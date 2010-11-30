using System;
using System.Text;
using System.Web.UI;
using Sage.Entity.Interfaces;
using Sage.Platform;
using Sage.Platform.Application;
using Sage.Platform.Application.UI;
using Sage.Platform.Security;
using Sage.Platform.WebPortal.Binding;
using Sage.Platform.WebPortal.SmartParts;
using Sage.Platform.WebPortal.Workspaces.Tab;
using Sage.SalesLogix.Activity;
using Sage.SalesLogix.Attachment;
using Sage.Platform.EntityBinding;
using Sage.Platform.Orm.Interfaces;
using TimeZone = Sage.Platform.TimeZone;
using Sage.Platform.Application.Services;
using System.Collections.Generic;

public partial class SmartParts_Activity_ActivityDetails : EntityBoundSmartPartInfoProvider
{
    #region Private Properties

    private Activity Activity
    {
        get { return (Activity)BindingSource.Current; }
    }

    private TimeZone TimeZone
    {
        get { return (TimeZone)AppContext["TimeZone"]; }
    }

    private static string CurrentUserId
    {
        get { return ApplicationContext.Current.Services.Get<IUserService>(true).UserId.Trim(); }
    }

    private ActivityFormHelper _ActivityFormHelper;
    private ActivityFormHelper Form
    {
        get { return _ActivityFormHelper; }
    }

    private ActivityParameters _Params;
    private ActivityParameters Params
    {
        get
        {
            if (_Params != null)
                return _Params;
            _Params = new ActivityParameters(
                (Dictionary<string, string>)AppContext["ActivityParameters"] ?? new Dictionary<string, string>());
            return _Params;
        }
    }

    #endregion

    protected override void OnInit(EventArgs e)
    {
        base.OnInit(e);
        BindingSource.OnCurrentEntitySet += delegate
        {
            _ActivityFormHelper = new ActivityFormHelper((Activity)BindingSource.Current);
        };
    }

    protected override void OnFormBound()
    {
        // TODO: Need to research and fix the cause of the double post back that attempts to fire a second 
        // OnFormBound while the dialog is closing.  This null check should not be necessary.
        if (BindingSource.Current == null) return;

        base.OnFormBound();

        if (IsActivating)
        {
			if (Form != null)
			{
	            Form.Reset(Controls);
	            if (Form.IsInsert)
	            {
	                if (Activity.RecurrenceState != RecurrenceState.rstOccurrence)
	                    Activity.Type = Params.Type;
	            }
            }
        }

        // TODO: can we use OnRegisterClientScript instead?
        RegisterScripts();

        FillForm();
    }

    protected void Page_PreRender(object sender, EventArgs e)
    {
        if (Form != null)
        {
            ContactId.InitializeLookup = (ContactId.SeedValue.Length == 12);
            AccountId.InitializeLookup = (AccountId.SeedValue.Length == 12);
            OpportunityId.InitializeLookup = (OpportunityId.SeedValue.Length == 12);
            TicketId.InitializeLookup = (TicketId.SeedValue.Length == 12);
            LeadId.InitializeLookup = false;
            ToggleReccurringTab();
            Rollover.Enabled = (!Activity.Recurring && Activity.Timeless);
            if (LeadId.Text == string.Empty)
                Company.Text = string.Empty;
            Form.Secure(Controls);
        }
    }

    protected override void OnWireEventHandlers()
    {
        base.OnWireEventHandlers();

        Timeless.CheckedChanged += Timeless_ChangeAction;
        Rollover.CheckedChanged += Rollover_ChangeAction;
        Alarm.CheckedChanged += Alarm_ChangeAction;

        StartDate.DateTimeValueChanged += StartDate_DateTimeValueChanged;

        ContactId.LookupResultValueChanged += ContactId_LookupResultValueChanged;
        AccountId.LookupResultValueChanged += AccountId_LookupResultValueChanged;
        TicketId.LookupResultValueChanged += TicketId_LookupResultValueChanged;
        OpportunityId.LookupResultValueChanged += OpportunityId_LookupResultValueChanged;
        LeadId.LookupResultValueChanged += LeadId_LookupResultValueChanged;
        rbContact.CheckedChanged += rbContact_CheckedChanged;
        rbLead.CheckedChanged += rbLead_CheckedChanged;
    }

    #region Event Handlers

    protected void Timeless_ChangeAction(object sender, EventArgs e)
    {
        if (!Activity.Timeless)
            Activity.Rollover = false;
    }

    protected void Rollover_ChangeAction(object sender, EventArgs e)
    {
        ToggleReccurringTab();
    }

    protected void Alarm_ChangeAction(object sender, EventArgs e)
    {
        ReminderDuration.Enabled = Activity.Alarm;
    }

    protected void StartDate_DateTimeValueChanged(object sender, EventArgs e)
    {
        if (Activity.Recurring)
        {
            Activity.RecurrencePattern.Reset(TimeZone);
            TabWorkspace ActivityTabs = PageWorkItem.Workspaces["TabControl"] as TabWorkspace;
            if (ActivityTabs != null)
            {
                TabInfo recurTab = ActivityTabs.GetTabByID("RecurringActivity");
                if (recurTab.WasUpdated)
                    recurTab.Element.Panel.Update();
            }
        }
    }

    protected void ContactId_LookupResultValueChanged(object sender, EventArgs e)
    {
        string contactID = ContactId.LookupResultValue.ToString();
        IContact contact = EntityFactory.GetById<IContact>(contactID);
        if (contact != null)
        {
            Activity.AccountId = contact.Account.Id.ToString();
            Activity.LeadId = null;
        }
    }

    protected void AccountId_LookupResultValueChanged(object sender, EventArgs e)
    {
        if (Activity.AccountId != null)
        {
            if (Activity.AccountId.Length == 12)
            {
                Activity.ContactId = null;
                Activity.OpportunityId = null;
                Activity.TicketId = null;
                Activity.LeadId = null;
            }
        }
    }

    protected void TicketId_LookupResultValueChanged(object sender, EventArgs e)
    {
        string ticketId = TicketId.LookupResultValue.ToString();
        ITicket ticket = EntityFactory.GetById<ITicket>(ticketId);
        if (ticket != null)
        {
            Activity.AccountId = ticket.Account.Id.ToString();
            foreach (Sage.SalesLogix.Entities.Contact c in ticket.Account.Contacts)
            {
                if (c.IsPrimary.HasValue)
                {
                    if ((bool)c.IsPrimary)
                    {
                        Activity.ContactId = c.Id;
                        break;
                    }
                }
            }
        }
    }

    protected void OpportunityId_LookupResultValueChanged(object sender, EventArgs e)
    {
        string opportunityId = OpportunityId.LookupResultValue.ToString();
        IOpportunity opportunity = EntityFactory.GetById<IOpportunity>(opportunityId);
        if (opportunity != null)
        {
            Activity.AccountId = opportunity.Account.Id.ToString();
            foreach (Sage.SalesLogix.Entities.Contact c in opportunity.Account.Contacts)
            {
                if (c.IsPrimary.HasValue)
                {
                    if ((bool)c.IsPrimary)
                    {
                        Activity.ContactId = c.Id;
                        break;
                    }
                }
            }
        }
    }

    protected void LeadId_LookupResultValueChanged(object sender, EventArgs e)
    {
        string leadID = LeadId.LookupResultValue.ToString();
        ILead lead = EntityFactory.GetById<ILead>(leadID);
        if (lead != null)
        {
            Activity.ContactId = null;
            Activity.OpportunityId = null;
            Activity.TicketId = null;
            Activity.AccountId = null;
            Activity.LeadName = lead.LeadNameLastFirst;
            Activity.AccountName = lead.Company;
            Activity.PhoneNumber = (lead.WorkPhone ?? lead.TollFree);
        }
        else
        {
            //lead was blanked
            Activity.LeadName = null;
            Activity.AccountName = null;
        }
    }

    protected void rbContact_CheckedChanged(object sender, EventArgs e)
    {
        SetDivVisible(VisibleDiv.Contact);
    }

    protected void rbLead_CheckedChanged(object sender, EventArgs e)
    {
        SetDivVisible(VisibleDiv.Lead);
    }

    private void ToggleReccurringTab()
    {
        if (Activity.Rollover)
        {
            Activity.Recuriterations = 0;
            Activity.Recurperiod = 0;
            Activity.Recurperiodspec = 0;
            Activity.Recurring = false;
        }
    }

    protected void UserId_SelectedValueChanged(object sender, EventArgs e)
    {
        string currentLeaderId = Activity.UserId;

        if (currentLeaderId != UserId.SelectedValue)
        {
            UserActivity attendee = Activity.Attendees.FindAttendee(currentLeaderId);
            if (attendee != null)
            {
                Activity.UserId = UserId.SelectedValue;
                if (Activity.Id != null)
                    if (Activity.ActivityId != "")
                        Activity.Save();
            }
        }
    }

    #endregion

    #region Private Helper Methods

    private void FillForm()
    {
        if (IsActivating && Form.IsInsert && !Activity.IsOccurrence)
        {
            SetDefaultUserInfo();
            CreateCarryOverAttachments();
            SetCarryOverNotes();
            SetTACODefaults();
            SetUserOptionDefaults();
        }

        SetPickListsByType();
        SetUIDefaults();

        SetDivVisible((IsNullOrWhiteSpace(Activity.LeadId) ? VisibleDiv.Contact : VisibleDiv.Lead));
        if (Activity.Type == ActivityType.atPersonal)
        {
            SetDivVisible(VisibleDiv.Contact);
            rbLead.Enabled = false;
        }
    }

    private void SetDefaultUserInfo()
    {
        Activity.CreateUser = CurrentUserId;
        Activity.ModifyUser = CurrentUserId;
        Activity.UserId = CurrentUserId;
        Activity.StartDate = GetStartDate();
    }

    private DateTime GetStartDate()
    {
        DateTime date;

        if (DateTime.TryParse(GetParam("startdate"), out date))
            return date;
        if (DateTime.TryParse(GetParam("recurdate"), out date))
            return date;

        return RoundUpToQuarterHour(DateTime.UtcNow);
    }

    private static DateTime RoundUpToQuarterHour(DateTime date)
    {
        int hour = date.Hour;
        int minutes = date.Minute;
        if ((minutes > 0) && (minutes <= 15))
        {
            minutes = 15;
        }
        else if ((minutes > 15) && (minutes <= 30))
        {
            minutes = 30;
        }
        else if ((minutes > 30) && (minutes <= 45))
        {
            minutes = 45;
        }
        else if (minutes > 45)
        {
            minutes = 0;
            hour++;
            if (hour >= 24)
            {
                hour = 0;
                date = date.AddDays(1);
            }
        }
        return new DateTime(date.Year, date.Month, date.Day, hour, minutes, 0);
    }

    private void SetCarryOverNotes()
    {
        IPersistentEntity persistentEntity = BindingSource.Current as IPersistentEntity;
        bool insertMode = false;
        if (persistentEntity != null)
        {
            insertMode = ((persistentEntity.PersistentState & PersistentState.New) > 0);
        }

        if (GetParam("carryovernotes") != null &&
            GetParam("carryovernotes").ToLower().Equals("true") &&
            GetParam("historyid") != null &&
            insertMode)
        {
            string historyId = GetParam("historyid");
            History history = EntityFactory.GetById<History>(historyId);
            if (history != null)
                Activity.LongNotes = history.LongNotes;
        }
    }

    #region TACO Initialization

    private void SetTACODefaults()
    {
        SetDivVisible(VisibleDiv.Contact);

        if (GetParam("aid") != null)
        {
            SetTACODefaultsFromParameters();
        }
        else if (GetParam("historyid") != null)
        {
            SetTACODefaultsFromHistoryId();
        }
        else
        {
            SetTACODefaultsFromEntityHistory();
        }
    }

    private void SetTACODefaultsFromParameters()
    {
        Activity.AccountId = GetParam("aid");
        if (GetParam("cid") != null)
        {
            Activity.ContactId = GetParam("cid");
        }

        if (GetParam("oid") != null)
        {
            Activity.OpportunityId = GetParam("oid");
        }

        if (GetParam("tid") != null)
        {
            Activity.TicketId = GetParam("tid");
        }
        if (GetParam("lid") != null)
        {
            Activity.LeadId = GetParam("lid");
            ILead lead = EntityFactory.GetById<ILead>(Activity.LeadId);
            if (lead != null)
            {
                Activity.AccountName = lead.Company;
            }
            SetDivVisible(VisibleDiv.Lead);
        }
    }

    private void SetTACODefaultsFromHistoryId()
    {
        IHistory hist = EntityFactory.GetById<IHistory>(GetParam("historyid"));
        Activity.ContactId = hist.ContactId;
        Activity.AccountId = hist.AccountId;
        Activity.OpportunityId = hist.OpportunityId;
        Activity.TicketId = hist.TicketId;
        Activity.LeadId = hist.LeadId;
        Activity.AccountName = hist.AccountName;
    }

    private void SetTACODefaultsFromEntityHistory()
    {
        bool found = false;
        foreach (EntityHistory hist in EntityContext.EntityHistory)
        {
            string entityType = hist.EntityType.Name;
            switch (entityType)
            {
                case "IAccount":
                    found = true;
                    IAccount account = EntityFactory.GetById<IAccount>(hist.EntityId.ToString());
                    Activity.AccountId = account.Id.ToString();
                    foreach (IContact accountContact in account.Contacts)
                        if (accountContact.IsPrimary.HasValue)
                        {
                            if ((bool)accountContact.IsPrimary)
                            {
                                Activity.ContactId = accountContact.Id.ToString();
                                break;
                            }
                        }
                    break;
                case "IContact":
                    found = true;
                    IContact contact = EntityFactory.GetById<IContact>(hist.EntityId.ToString());
                    Activity.ContactId = contact.Id.ToString();
                    Activity.AccountId = contact.Account.Id.ToString();
                    break;
                case "IOpportunity":
                    found = true;
                    IOpportunity opportunity = EntityFactory.GetById<IOpportunity>(hist.EntityId.ToString());
                    Activity.OpportunityId = opportunity.Id.ToString();
                    Activity.AccountId = opportunity.Account.Id.ToString();
                    foreach (IOpportunityContact oppContact in opportunity.Contacts)
                    {
                        if (oppContact.IsPrimary.HasValue)
                        {
                            if ((bool)oppContact.IsPrimary)
                            {
                                Activity.ContactId = oppContact.Contact.Id.ToString();
                                break;
                            }
                        }
                    }
                    break;
                case "ITicket":
                    found = true;
                    ITicket ticket = EntityFactory.GetById<ITicket>(hist.EntityId.ToString());
                    Activity.TicketId = ticket.Id.ToString();
                    Activity.AccountId = ticket.Account.Id.ToString();
                    Activity.ContactId = ((ticket.Contact == null)
                                              ? String.Empty
                                              : ticket.Contact.Id.ToString());
                    break;
                case "ILead":
                    found = true;
                    ILead lead = EntityFactory.GetById<ILead>(hist.EntityId.ToString());
                    if (lead != null)
                    {
                        Activity.LeadId = hist.EntityId.ToString();
                        Activity.LeadName = lead.LeadNameLastFirst;
                        Activity.AccountName = lead.Company;
                        Activity.PhoneNumber = (lead.WorkPhone ?? lead.TollFree);
                    }
                    SetDivVisible(VisibleDiv.Lead);
                    break;
            }
            if (found) break;
        }
    }

    #endregion

    private void SetUserOptionDefaults()
    {
        IUserOptionsService userOption = ApplicationContext.Current.Services.Get<IUserOptionsService>();
        string alarmLeadUnit = userOption.GetCommonOption("AlarmDefaultLead", "ActivityAlarm");
        string alarmLeadValue = userOption.GetCommonOption("AlarmDefaultLeadValue", "ActivityAlarm");

        int alarmLeadMinutes = 15; //default
        if ((alarmLeadUnit != "") && (alarmLeadValue != ""))
        {
            try
            {
                alarmLeadMinutes = Convert.ToInt32(alarmLeadValue);
            }
            catch
            {
                alarmLeadMinutes = 15;
            }

            switch (alarmLeadUnit)
            {
                case "Days":
                    alarmLeadMinutes = alarmLeadMinutes * 24 * 60;
                    break;
                case "Hours":
                    alarmLeadMinutes = alarmLeadMinutes * 60;
                    break;
            }
        }
        ReminderDuration.Value = alarmLeadMinutes;
        Activity.ReminderDuration = alarmLeadMinutes;
        Activity.Alarm = alarmLeadMinutes > 0;
    }

    private void SetPickListsByType()
    {
        Category.PickListId = "";
        Description.PickListId = "";
        switch (Activity.Type)
        {
            case ActivityType.atPhoneCall:
                Category.PickListName = "Phone Call Category Codes";
                Description.PickListName = "Phone Call Regarding";
                break;
            case ActivityType.atAppointment:
                Category.PickListName = "Meeting Category Codes";
                Description.PickListName = "Meeting Regarding";
                break;
            case ActivityType.atToDo:
                Category.PickListName = "To Do Category Codes";
                Description.PickListName = "To Do Regarding";
                break;
            case ActivityType.atEMail:
                Category.PickListName = "To Do Category Codes";
                Description.PickListName = "To Do Regarding";
                break;
            case ActivityType.atPersonal:
                Description.PickListName = "Personal Activity Regarding";
                break;
            case ActivityType.atNote:
                Category.PickListName = "Note Category Codes";
                Description.PickListName = "Note Regarding";
                break;
            default:
                Category.PickListName = "To Do Category Codes";
                Description.PickListName = "To Do Regarding";
                break;
        }
    }

    private void SetUIDefaults()
    {
        StartDate.DisplayTime = !Activity.Timeless;
        ReminderDuration.Enabled = Activity.Alarm;
        Duration.Enabled = !Activity.Timeless;
        StartDate.Timeless = Activity.Timeless;
        ActivityFacade.BindLeaderList(UserId, Activity.UserId);
    }

    private void SetDivVisible(VisibleDiv vd)
    {
        bool leadsVisible = (vd == VisibleDiv.Lead);
        rbLead.Checked = leadsVisible;
        rbContact.Checked = !leadsVisible;
    }

    private static bool IsNullOrWhiteSpace(string s)
    {
        return String.IsNullOrEmpty(s) || String.IsNullOrEmpty(s.Trim());
    }

    private void CreateCarryOverAttachments()
    {
        if (GetParam("carryoverattachments") == null
            || !GetParam("carryoverattachments").ToLower().Equals("true")
            || GetParam("historyid") == null
            || !Form.IsInsert)
            return;

        string historyId = GetParam("historyid");
        if (string.IsNullOrEmpty(historyId)) return;

        History history = EntityFactory.GetById<History>(historyId);
        if (history == null) return;

        WorkItem workItem = PageWorkItem;
        if (workItem == null) return;

        if (workItem.State["TempCarryOverAssociationID"] != null) return;

        string strTempAssocationID;
        if (workItem.State["TempAssociationID"] == null)
        {
            strTempAssocationID = history.Id;
            workItem.State["TempAssociationID"] = strTempAssocationID;
        }
        else
        {
            strTempAssocationID = workItem.State["TempAssociationID"].ToString();
        }
        workItem.State["TempCarryOverAssociationID"] = strTempAssocationID;
        Rules.InitCarryOverAttachments(history, strTempAssocationID);
    }

    #endregion

    #region ISmartPartInfo

    public override ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        // TODO: refactor
        ToolsSmartPartInfo tinfo = new ToolsSmartPartInfo();
        foreach (Control c in LeftTools.Controls)
        {
            tinfo.LeftTools.Add(c);
        }
        foreach (Control c in CenterTools.Controls)
        {
            tinfo.CenterTools.Add(c);
        }
        foreach (Control c in RightTools.Controls)
        {
            tinfo.RightTools.Add(c);
        }
        return tinfo;
    }

    #endregion

    private void RegisterScripts()
    {
        StringBuilder sb = new StringBuilder();
        sb.Append("function toggleEntityType() {");
        sb.AppendFormat("if ($('#{0}').attr('checked') == true) ", rbContact.ClientID);
        sb.Append("{ $('.contact-row').show();$('.lead-row').hide(); } else {");
        sb.Append("$('.contact-row').hide();$('.lead-row').show(); }");
        sb.Append("}");
        sb.Append("$(document).ready(toggleEntityType);");

        ScriptManager.RegisterStartupScript(this, GetType(), "activitydetailscript", sb.ToString(), true);
    }

    private string GetParam(string key)
    {
        string value;
        return Params.TryGetValue(key, out value) ? value : null;
    }

    #region EntityBoundSmartPart methods

    public override Type EntityType
    {
        get { return typeof(IActivity); }
    }

    protected override void OnAddEntityBindings()
    {
        EntityBindingSource bs = BindingSource;

        bs.Bindings.Add(new WebEntityBinding("!Timeless", StartDate, "DisplayTime"));
        bs.Bindings.Add(new WebEntityBinding("Timeless", StartDate, "Timeless"));

        bs.Bindings.Add(new WebEntityBinding("StartDate", StartDate, "DateTimeValue"));
        bs.Bindings.Add(new WebEntityBinding("Timeless", Timeless, "Checked"));
        bs.Bindings.Add(new WebEntityBinding("Rollover", Rollover, "Checked"));

        bs.Bindings.Add(new WebEntityBinding("Alarm", Alarm, "Checked"));
        bs.Bindings.Add(new WebEntityBinding("ReminderDuration", ReminderDuration, "Value"));

        bs.Bindings.Add(new WebEntityBinding("Duration", Duration, "Value"));
        bs.Bindings.Add(new WebEntityBinding("ContactId", ContactId, "LookupResultValue"));
        bs.Bindings.Add(new WebEntityBinding("AccountId", ContactId, "SeedValue"));
        bs.Bindings.Add(new WebEntityBinding("OpportunityId", OpportunityId, "LookupResultValue"));
        bs.Bindings.Add(new WebEntityBinding("AccountId", OpportunityId, "SeedValue"));
        bs.Bindings.Add(new WebEntityBinding("AccountId", AccountId, "LookupResultValue"));
        bs.Bindings.Add(new WebEntityBinding("TicketId", TicketId, "LookupResultValue"));
        bs.Bindings.Add(new WebEntityBinding("AccountID", TicketId, "SeedValue"));
        bs.Bindings.Add(new WebEntityBinding("Description", Description, "PickListValue"));
        bs.Bindings.Add(new WebEntityBinding("LongNotes", Notes, "Text"));
        bs.Bindings.Add(new WebEntityBinding("Priority", Priority, "PickListValue"));
        bs.Bindings.Add(new WebEntityBinding("Category", Category, "PickListValue"));
        bs.Bindings.Add(new WebEntityBinding("UserId", UserId, "SelectedValue"));

        bs.Bindings.Add(new WebEntityBinding("!Timeless", Duration, "Enabled"));
        bs.Bindings.Add(new WebEntityBinding("LeadId", LeadId, "LookupResultValue"));
        bs.Bindings.Add(new WebEntityBinding("AccountName", Company, "Text"));
    }

    #endregion

    private enum VisibleDiv
    {
        Contact,
        Lead
    }
}