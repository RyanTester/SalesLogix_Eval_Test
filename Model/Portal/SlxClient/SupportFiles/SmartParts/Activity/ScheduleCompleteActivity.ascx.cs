using System;
using System.Collections.Generic;
using System.Data;
using System.Web.UI;
using System.Web.UI.WebControls;
using Sage.Entity.Interfaces;
using Sage.Platform;
using Sage.Platform.Application;
using Sage.Platform.Application.UI;
using Sage.Platform.EntityBinding;
using Sage.Platform.Security;
using Sage.Platform.WebPortal.Binding;
using Sage.Platform.WebPortal.SmartParts;
using Sage.SalesLogix.Activity;
using Sage.SalesLogix.Entities;
using TimeZone = Sage.Platform.TimeZone;
using Sage.Platform.ComponentModel;
using Sage.SalesLogix.Web.Controls.Lookup;

public partial class SmartParts_Activity_ScheduleCompleteActivity : EntityBoundSmartPartInfoProvider
{
    #region class Members

    private TimeZone _timeZone;

    [ContextDependency("TimeZone")]
    public TimeZone TimeZone
    {
        get { return _timeZone; }
        set { _timeZone = value; }
    }

    private static string CurrentUserId
    {
        get { return ApplicationContext.Current.Services.Get<IUserService>(true).UserId.Trim(); }
    }

    private LinkHandler _LinkHandler;

    private LinkHandler Link
    {
        get
        {
            if (_LinkHandler == null)
                _LinkHandler = new LinkHandler(Page);
            return _LinkHandler;
        }
    }

    #endregion

    #region Page Lifecycle Events

    protected override void OnFormBound()
    {
        base.OnFormBound();

        if (IsActivating)
        {
            ResetForm();
            SetValuesFromEntityHistory();
        }

        btnContinue.Enabled = NewUnscheduledActivity.Checked;
        OpenActivities.Visible = false;

        if (CompleteScheduledActivity.Checked)
        {
            LookupControl lookup = GetBoundLookup();
            Session["entityName"] = lookup != null ? lookup.LookupEntityName : null;
            Session["entityId"] = lookup != null ? GetId(lookup.LookupResultValue) : null;
            OpenActivities.DataBind();
            OpenActivities.Visible = OpenActivities.Rows.Count > 0;
        }
        if (Account.LookupResultValue != null)
        {
            SetSeedValues();
        }
        if (LeadId.LookupResultValue == null)
        {
            Company.Text = string.Empty;
        }
    }

    private void ResetForm()
    {
        SetDivVisible(VisibleDiv.Contact);

        Contact.LookupResultValue = null;
        Account.LookupResultValue = null;
        Ticket.LookupResultValue = null;
        Opportunity.LookupResultValue = null;
        LeadId.LookupResultValue = null;

        NewUnscheduledActivity.Checked = true;
        ActivityTypeButtonList.ClearSelection();
        ActivityTypeButtonList.Items[0].Selected = true;

        CompleteScheduledActivity.Checked = false;
    }

    private void SetValuesFromEntityHistory()
    {
        foreach (EntityHistory hist in EntityContext.EntityHistory)
        {
            if (ValuesSet(hist)) return;
        }
    }

    private bool ValuesSet(EntityHistory hist)
    {
        switch (hist.EntityType.Name)
        {
            case "IAccount":
                IAccount account = EntityFactory.GetById<IAccount>(hist.EntityId.ToString());
                Account.LookupResultValue = account;
                Contact.LookupResultValue = GetPrimaryContact(account.Contacts);
                return true;
            case "IContact":
                IContact contact = EntityFactory.GetById<IContact>(hist.EntityId.ToString());
                Contact.LookupResultValue = contact;
                Account.LookupResultValue = contact.Account;
                return true;
            case "IOpportunity":
                IOpportunity opportunity = EntityFactory.GetById<IOpportunity>(hist.EntityId.ToString());
                Opportunity.LookupResultValue = opportunity;
                Account.LookupResultValue = opportunity.Account;
                foreach (IOpportunityContact oppContact in opportunity.Contacts)
                {
                    if (oppContact.IsPrimary.HasValue)
                    {
                        if ((bool)oppContact.IsPrimary)
                        {
                            Contact.LookupResultValue = oppContact.Contact;
                            break;
                        }
                    }
                }
                return true;
            case "ITicket":
                ITicket ticket = EntityFactory.GetById<ITicket>(hist.EntityId.ToString());
                Ticket.LookupResultValue = ticket;
                Account.LookupResultValue = ticket.Account;
                Contact.LookupResultValue = ticket.Contact;
                return true;
            case "ILead":
                SetDivVisible(VisibleDiv.Lead);
                ILead lead = EntityFactory.GetById<ILead>(hist.EntityId.ToString());
                LeadId.LookupResultValue = lead;
                Company.Text = lead.Company;
                return true;
        }
        return false;
    }

    private LookupControl GetBoundLookup()
    {
        if (rbLead.Checked && LeadId.LookupResultValue != null)
        {
            return LeadId;
        }
        if (rbContact.Checked)
        {
            if (Ticket.LookupResultValue != null)
            {
                return Ticket;
            }
            if (Opportunity.LookupResultValue != null)
            {
                return Opportunity;
            }
            if (Contact.LookupResultValue != null)
            {
                return Contact;
            }
            if (Account.LookupResultValue != null)
            {
                return Account;
            }
        }
        return null;
    }

    private string GetId(object value)
    {
        IComponentReference compRef = value as IComponentReference;
        if (compRef != null)
        {
            return compRef.Id.ToString();
        }
        return string.Empty;
    }

    private void SetSeedValues()
    {
        string seedValue = ((Account)(Account.LookupResultValue)).Id;
        Contact.InitializeLookup = true;
        Contact.SeedValue = seedValue;
        Opportunity.InitializeLookup = true;
        Opportunity.SeedValue = seedValue;
        Ticket.InitializeLookup = true;
        Ticket.SeedValue = seedValue;
        LeadId.InitializeLookup = false;
    }

    protected void OpenActivities_Sorting(object sender, GridViewSortEventArgs e)
    {

    }

    protected override void OnWireEventHandlers()
    {
        base.OnWireEventHandlers();
        CancelButton.Click += DialogService.CloseEventHappened;
        Contact.LookupResultValueChanged += Contact_LookupResultValueChanged;
        Account.LookupResultValueChanged += Account_LookupResultValueChanged;
        Opportunity.LookupResultValueChanged += Opportunity_LookupResultValueChanged;
        Ticket.LookupResultValueChanged += Ticket_LookupResultValueChanged;
        LeadId.LookupResultValueChanged += LeadId_LookupResultValueChanged;
        rbContact.CheckedChanged += rbContact_CheckedChanged;
        rbLead.CheckedChanged += rbLead_CheckedChanged;
    }

    private void rbLead_CheckedChanged(object sender, EventArgs e)
    {
        SetDivVisible(VisibleDiv.Lead);
    }

    private void rbContact_CheckedChanged(object sender, EventArgs e)
    {
        SetDivVisible(VisibleDiv.Contact);
    }

    private void SetDivVisible(VisibleDiv vd)
    {
        bool leadsVisible = (vd == VisibleDiv.Lead);
        leadsdiv.Visible = leadsVisible;
        rbLead.Checked = leadsVisible;
        contactsdiv.Visible = !leadsVisible;
        rbContact.Checked = !leadsVisible;
    }

    protected static string BuildCompleteActivityNavigateURL(object ActivityID)
    {
        return string.Format("javascript:Link.completeActivity('{0}')", ActivityID);
    }

    #endregion

    #region Event Handlers

    private void Ticket_LookupResultValueChanged(object sender, EventArgs e)
    {
        Ticket ticket = (Ticket)Ticket.LookupResultValue;
        if (ticket != null)
        {
            Account.LookupResultValue = ticket.Account;
            Opportunity.LookupResultValue = null;
            SetContactFromPrimary(ticket.Account.Contacts);
        }
    }

    private void LeadId_LookupResultValueChanged(object sender, EventArgs e)
    {
        Lead lead = (Lead)LeadId.LookupResultValue;
        if (lead != null)
        {
            Company.Text = lead.Company;
            Contact.LookupResultValue = null;
            Account.LookupResultValue = null;
            Ticket.LookupResultValue = null;
            Opportunity.LookupResultValue = null;
        }
    }

    private void Opportunity_LookupResultValueChanged(object sender, EventArgs e)
    {
        Opportunity opportunity = (Opportunity)Opportunity.LookupResultValue;
        if (opportunity != null)
        {
            Account.LookupResultValue = opportunity.Account;
            Ticket.LookupResultValue = null;
            SetContactFromPrimary(opportunity.Account.Contacts);
        }
    }

    private void Account_LookupResultValueChanged(object sender, EventArgs e)
    {
        Account account = (Account)Account.LookupResultValue;
        if (account != null)
        {
            Ticket.LookupResultValue = null;
            Opportunity.LookupResultValue = null;
            SetContactFromPrimary(account.Contacts);
        }
    }

    private void SetContactFromPrimary(IEnumerable<IContact> contacts)
    {
        Contact.LookupResultValue = GetPrimaryContact(contacts);
        LeadId.LookupResultValue = null;
    }

    private Contact GetPrimaryContact(IEnumerable<IContact> contacts)
    {
        foreach (Contact c in contacts)
            if (c.IsPrimary.HasValue && (bool)c.IsPrimary)
                return c;
        return null;
    }

    private void Contact_LookupResultValueChanged(object sender, EventArgs e)
    {
        Contact contact = (Contact)Contact.LookupResultValue;
        if (contact != null)
        {
            Account.LookupResultValue = contact.Account;
            LeadId.LookupResultValue = null;
        }
    }

    protected void btnContinue_Click(object sender, EventArgs e)
    {
        string activityType = ActivityTypeButtonList.SelectedValue;
        string accountId = "";
        string contactId = "";
        string oppId = "";
        string ticketId = "";
        string leadId = "";

        if (Account.LookupResultValue != null)
        {
            Account account = Account.LookupResultValue as Account;
            if (account != null)
                accountId = account.Id;
        }

        if (Contact.LookupResultValue != null)
        {
            Contact contact = Contact.LookupResultValue as Contact;
            if (contact != null)
                contactId = contact.Id;
        }

        if (Opportunity.LookupResultValue != null)
        {
            Opportunity opportunity = Opportunity.LookupResultValue as Opportunity;
            if (opportunity != null)
                oppId = opportunity.Id;
        }

        if (Ticket.LookupResultValue != null)
        {
            Ticket ticket = Ticket.LookupResultValue as Ticket;
            if (ticket != null)
                ticketId = ticket.Id;
        }
        if (LeadId.LookupResultValue != null)
        {
            Lead lead = LeadId.LookupResultValue as Lead;
            if (lead != null)
            {
                leadId = lead.Id;
            }
        }

        Dictionary<string, string> args = new Dictionary<string, string>();
        args.Add("type", activityType);
        args.Add("aid", accountId);
        args.Add("cid", contactId);
        args.Add("oid", oppId);
        args.Add("tid", ticketId);
        args.Add("lid", leadId);

        Link.ScheduleCompleteActivity(args);
    }

    #endregion

    #region EntityBoundSmartPart

    protected override void OnAddEntityBindings()
    {
    }

    public override Type EntityType
    {
        get { return typeof(IActivity); }
    }

    public override ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        ToolsSmartPartInfo tinfo = new ToolsSmartPartInfo();
        foreach (Control c in ScheduleCompleteActivity_LTools.Controls)
        {
            tinfo.LeftTools.Add(c);
        }
        foreach (Control c in ScheduleCompleteActivity_CTools.Controls)
        {
            tinfo.CenterTools.Add(c);
        }
        foreach (Control c in ScheduleCompleteActivity_RTools.Controls)
        {
            tinfo.RightTools.Add(c);
        }
        return tinfo;
    }

    #endregion

    #region Private Helper Methods

    protected string GetLocalDateTime(object StartDate, object TimeLess)
    {
        if ((bool)TimeLess)
        {
            DateTime startDate = Convert.ToDateTime(StartDate);
            string dateString = startDate.ToShortDateString() + " (timeless)";
            return dateString;
        }
        return _timeZone.UTCDateTimeToLocalTime(Convert.ToDateTime(StartDate)).ToString("g");
    }

    protected string GetToolTip(object activityType)
    {
        string toolTip;
        switch ((ActivityType)activityType)
        {
            case ActivityType.atAppointment:
                toolTip = GetLocalResourceObject("ActivityType.ListItemMeeting.Text").ToString();
                break;
            case ActivityType.atPhoneCall:
                toolTip = GetLocalResourceObject("ActivityType.ListItemPhoneCall.Text").ToString();
                break;
            case ActivityType.atToDo:
                toolTip = GetLocalResourceObject("ActivityType.ListItemToDo.Text").ToString();
                break;
            case ActivityType.atPersonal:
                toolTip = GetLocalResourceObject("ActivityType.ListItemPersonal.Text").ToString();
                break;
            default:
                toolTip = GetLocalResourceObject("ActivityType.ListItemMeeting.Text").ToString();
                break;
        }
        return toolTip;
    }

    protected static string GetImage(object activityType)
    {
        string imageURL;
        switch ((ActivityType)activityType)
        {
            case ActivityType.atPhoneCall:
                imageURL = "~/images/icons/Call_16x16.gif";
                break;
            case ActivityType.atToDo:
                imageURL = "~/images/icons/To_Do_16x16.gif";
                break;
            case ActivityType.atPersonal:
                imageURL = "~/images/icons/Personal_16x16.gif";
                break;
            default:
                imageURL = "~/images/icons/Meeting_16x16.gif";
                break;
        }
        return imageURL;
    }

    #endregion

    private enum VisibleDiv
    {
        Contact,
        Lead
    }
}