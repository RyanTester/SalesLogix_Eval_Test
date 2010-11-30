// TODO: This is mostly the same UI as ActivityDetails.ascx.cs - consider merging

using System;
using System.Collections.Generic;
using System.Web.UI;
using System.Web.UI.WebControls;
using Sage.Entity.Interfaces;
using Sage.Platform;
using Sage.Platform.Application;
using Sage.Platform.EntityBinding;
using Sage.Platform.WebPortal.Binding;
using Sage.Platform.WebPortal.SmartParts;
using Sage.SalesLogix.Activity;
using TimeZone = Sage.Platform.TimeZone;
using Sage.Platform.Application.Services;

public partial class SmartParts_Activity_CompleteActivity : EntityBoundSmartPartInfoProvider
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

    #region Page Lifetime Events

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
            SetInsertDefaults();
            SetCommonDefaults();
            }
        }
    }

    protected void Page_PreRender(object sender, EventArgs e)
    {
		if (Form != null)
		{
	        ContactId.InitializeLookup = (ContactId.SeedValue.Length > 0);
	        AccountId.InitializeLookup = (AccountId.SeedValue.Length > 0);
	        OpportunityId.InitializeLookup = (OpportunityId.SeedValue.Length == 12);
	        TicketId.InitializeLookup = (TicketId.SeedValue.Length == 12);
	        LeadId.InitializeLookup = false;
	        Company.Text = LeadId.Text == string.Empty ? string.Empty : Activity.AccountName;
	        SetLeadDivVisible(LeadId.Text != "");
	        Form.Secure(Controls);
		}
    }

    protected override void OnWireEventHandlers()
    {
        base.OnWireEventHandlers();
        ContactId.LookupResultValueChanged += ContactId_ChangeAction;
        OpportunityId.LookupResultValueChanged += OpportunityId_ChangeAction;
        AccountId.LookupResultValueChanged += AccountId_ChangeAction;
        TicketId.LookupResultValueChanged += TicketId_ChangeAction;
        LeadId.LookupResultValueChanged += LeadId_LookupResultValueChanged;
        rbContact.CheckedChanged += rbContact_CheckedChanged;
        rbLead.CheckedChanged += rbLead_CheckedChanged;
    }

    #endregion

    #region Event Handlers

    void rbLead_CheckedChanged(object sender, EventArgs e)
    {
        SetLeadDivVisible(true);
    }

    void rbContact_CheckedChanged(object sender, EventArgs e)
    {
        SetLeadDivVisible(false);
    }

    void SetLeadDivVisible(Boolean leadsVisible)
    {
        leadsdiv.Visible = leadsVisible;
        rbLead.Checked = leadsVisible;
        contactsdiv.Visible = !leadsVisible;
        rbContact.Checked = !leadsVisible;
    }

    void LeadId_LookupResultValueChanged(object sender, EventArgs e)
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
            Activity.ContactName = lead.LeadNameLastFirst;
            Activity.AccountName = lead.Company;
        }
    }

    protected void ContactId_ChangeAction(object sender, EventArgs e)
    {
        string contactId = ContactId.LookupResultValue.ToString();
        IContact contact = EntityFactory.GetById<IContact>(contactId);
        if (contact != null)
        {
            Activity.AccountId = contact.Account.Id.ToString();
            Activity.LeadId = null;
            Activity.LeadName = null;
        }
    }

    protected void OpportunityId_ChangeAction(object sender, EventArgs e)
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

    protected void AccountId_ChangeAction(object sender, EventArgs e)
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

    protected void TicketId_ChangeAction(object sender, EventArgs e)
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

    protected void UserId_SelectedValueChanged(object sender, EventArgs e)
    {
        string currentLeaderId = Activity.UserId.Trim();

        if (currentLeaderId != UserId.SelectedValue)
        {
            UserActivity attendee = Activity.Attendees.FindAttendee(currentLeaderId);
            if (attendee != null)
            {
                //replace the current leader with the new one
                Activity.Attendees.Remove(attendee.UserId.Trim());
                Activity.UserId = UserId.SelectedValue.Trim();
                if (Activity.Id != null)
                    if (Activity.ActivityId != "")
                        Activity.Save();
            }
        }
    }

    #endregion

    #region Private Helper Methods

    private void SetCommonDefaults()
    {
        ActivityFacade.BindLeaderList(UserId, Activity.UserId);

        //Check if the type is being passed as a Param.  
        //This should take precedent over a newly created Type default of atAppointment
        if (GetParam("type") != null)
        {
            //TODO: Refactor OUT all references to atMeeting, OR add atMeeting to the ActivityType enum
            string type = GetParam("type") == "atMeeting" ? "atAppointment" : GetParam("type");
            Activity.Type = (ActivityType)Enum.Parse(typeof(ActivityType), type);
        }
        switch (Activity.Type)
        {
            case ActivityType.atAppointment:
                Result.PickListName = "Meeting Result Codes";
                Category.PickListName = "Meeting Category Codes";
                Description.PickListName = "Meeting Regarding";
                break;
            case ActivityType.atPhoneCall:
                Result.PickListName = "Phone Call Result Codes";
                Category.PickListName = "Phone Call Category Codes";
                Description.PickListName = "Phone Call Regarding";
                break;
            case ActivityType.atToDo:
                Result.PickListName = "To Do Result Codes";
                Category.PickListName = "To Do Category Codes";
                Description.PickListName = "To Do Regarding";
                break;
            case ActivityType.atPersonal:
                Result.PickListName = "Personal Activity Result Codes";
                Description.PickListName = "Personal Activity Regarding";
                break;
            case ActivityType.atEMail:
                Category.PickListName = "To Do Category Codes";
                Description.PickListName = "To Do Regarding";
                break;
            case ActivityType.atNote:
                Category.PickListName = "Note Category Codes";
                Description.PickListName = "Note Regarding";
                break;
            default:
                Result.PickListName = "Meeting Result Codes";
                break;
        }

        Result.PickListValue = Result.DefaultPickListItem;

        if (string.IsNullOrEmpty(Result.PickListValue))
            Result.PickListValue = GetLocalResourceObject("Const_Complete").ToString();

        IUserOptionsService userOption = ApplicationContext.Current.Services.Get<IUserOptionsService>();
        string defFollowUpActivity = userOption.GetCommonOption("DefaultFollowupActivity", "ActivityAlarm");
        string followupValue = "None";
        switch (defFollowUpActivity)
        {
            case ("Phone Call"):
                followupValue = "atPhoneCall";
                break;
            case ("Meeting"):
                followupValue = "atMeeting";
                break;
            case ("To-Do"):
                followupValue = "atToDo";
                break;
        }

        FollowUp.SelectedValue = followupValue;

        string carryOverNotes = userOption.GetCommonOption("CarryOverNotes", "ActivityAlarm");
        CarryOverNotes.Checked = (carryOverNotes != "No") && (carryOverNotes != "F");

        string carryOverAttachments = userOption.GetCommonOption("CarryOverAttachments", "ActivityAlarm");
        CarryOverAttachments.Checked = (carryOverAttachments != "No") && (carryOverAttachments != "F");

        Completed.DateTimeValue = DateTime.UtcNow;
        Scheduled.DateTimeValue = Activity.StartDate;

        Scheduled.Timeless = Activity.Timeless;
        Scheduled.DisplayTime = !Activity.Timeless;

        Completed.Timeless = Activity.Timeless;
        Completed.DisplayTime = !Activity.Timeless;

        Duration.Enabled = !Activity.Timeless;

        //handle timeless activities
        if (Activity.Timeless)
        {
            Scheduled.DateTimeValue = Activity.StartDate;

            IContextService context = Sage.Platform.Application.ApplicationContext.Current.Services.Get<IContextService>(true);
            TimeZone tz = context["TimeZone"] as TimeZone;
            if (tz != null) Completed.DateTimeValue = tz.UTCDateTimeToLocalTime(DateTime.UtcNow);
        }
    }

    private void SetInsertDefaults()
    {
        if (Activity.ActivityId == "")
        {
            Sage.SalesLogix.Security.SLXUserService slxUserService = Sage.Platform.Application.ApplicationContext.Current.Services.Get<Sage.Platform.Security.IUserService>() as Sage.SalesLogix.Security.SLXUserService;
            if (slxUserService != null)
            {
                string currentUserID = slxUserService.GetUser().Id;  // store the Current UserID in the Group context object

                Activity.CreateUser = currentUserID;
                Activity.ModifyUser = currentUserID;
                Activity.UserId = currentUserID;
                Activity.Attendees.Add(currentUserID);
            }

            FollowUp.SelectedValue = GetLocalResourceObject("Const_None").ToString();
            CarryOverNotes.Checked = true;
            CarryOverAttachments.Checked = true;

            SetTacoDefaults();
        }
    }

    // TODO: refactor (see ActivityDetails)
    private void SetTacoDefaults()
    {
        // check to see if TACO values are passed in the querystring first - this takes precedence
        SetLeadDivVisible(false);
        if (GetParam("aid") != null)
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
                SetLeadDivVisible(true);
                Activity.LeadId = GetParam("lid");
                ILead lead = EntityFactory.GetById<ILead>(Activity.LeadId);
                if (lead != null)
                {
                    Activity.AccountName = lead.Company;
                    Activity.LeadName = lead.LeadNameLastFirst;
                    Activity.ContactName = lead.LeadNameLastFirst;
                }
            }
        }
        else
        {
            bool found = false;
            foreach (Sage.Platform.Application.EntityHistory hist in EntityContext.EntityHistory)
            {
                string entityType = hist.EntityType.Name;
                switch (entityType)
                {
                    case "IAccount":
                        found = true;
                        IAccount account = EntityFactory.GetById<IAccount>(hist.EntityId.ToString());
                        Activity.AccountId = account.Id.ToString();
                        Activity.AccountName = account.AccountName;
                        foreach (Sage.Entity.Interfaces.IContact accountContact in account.Contacts)
                        {
                            if ((bool)accountContact.IsPrimary)
                            {
                                Activity.ContactId = accountContact.Id.ToString();
                                Activity.ContactName = accountContact.LastName + ", " + accountContact.FirstName;
                                break;
                            }
                        }
                        break;
                    case "IContact":
                        found = true;
                        IContact contact = EntityFactory.GetById<IContact>(hist.EntityId.ToString());
                        Activity.ContactId = contact.Id.ToString();
                        Activity.ContactName = contact.LastName + ", " + contact.FirstName;
                        Activity.AccountId = contact.Account.Id.ToString();
                        Activity.AccountName = contact.Account.AccountName;
                        break;
                    case "IOpportunity":
                        found = true;
                        IOpportunity opportunity = EntityFactory.GetById<IOpportunity>(hist.EntityId.ToString());
                        Activity.OpportunityId = opportunity.Id.ToString();
                        Activity.OpportunityName = opportunity.Description;
                        Activity.AccountId = opportunity.Account.Id.ToString();
                        Activity.AccountName = opportunity.Account.AccountName;
                        foreach (Sage.Entity.Interfaces.IOpportunityContact oppContact in opportunity.Contacts)
                        {
                            if ((bool)oppContact.IsPrimary)
                            {
                                Activity.ContactId = oppContact.Contact.Id.ToString();
                                Activity.ContactName = oppContact.Contact.LastName + ", " +
                                                        oppContact.Contact.FirstName;
                                break;
                            }
                        }
                        break;
                    case "ITicket":
                        found = true;
                        ITicket ticket = EntityFactory.GetById<ITicket>(hist.EntityId.ToString());
                        Activity.TicketId = ticket.Id.ToString();
                        Activity.TicketNumber = ticket.AlternateKeyPrefix + "-" + ticket.AlternateKeySuffix;
                        Activity.AccountId = ticket.Account.Id.ToString();
                        Activity.AccountName = ticket.Account.AccountName;
                        Activity.ContactId = ticket.Contact.Id.ToString();
                        Activity.ContactName = ticket.Contact.LastName + ", " + ticket.Contact.FirstName;
                        break;
                    case "ILead":
                        found = true;
                        ILead lead = EntityFactory.GetById<ILead>(hist.EntityId.ToString());
                        if (lead != null)
                        {
                            Activity.LeadId = hist.EntityId.ToString();
                            Activity.LeadName = lead.LeadNameLastFirst;
                            Activity.ContactName = lead.LeadNameLastFirst;
                            Activity.AccountName = lead.Company;
                        }
                        SetLeadDivVisible(true);
                        break;
                }
                if (found) break;
            }
        }
    }

    private string GetParam(string key)
    {
        string value;
        return Params.TryGetValue(key, out value) ? value : null;
    }

    #endregion

    #region EntityBoundSmartPart methods

    public override Type EntityType
    {
        get { return typeof(IActivity); }
    }

    protected override void OnAddEntityBindings()
    {
        EntityBindingSource bs = BindingSource;
        bs.Bindings.Add(new WebEntityBinding("Duration", Duration, "Value"));
        bs.Bindings.Add(new WebEntityBinding("!Timeless", Duration, "Enabled"));
        bs.Bindings.Add(new WebEntityBinding("Timeless", Timeless, "Checked"));
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
        bs.Bindings.Add(new WebEntityBinding("UserId", UserId, "Text"));
        bs.Bindings.Add(new WebEntityBinding("LeadId", LeadId, "LookupResultValue"));
        bs.Bindings.Add(new WebEntityBinding("StartDate", Scheduled, "DateTimeValue"));
    }

    public override Sage.Platform.Application.UI.ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
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
}
