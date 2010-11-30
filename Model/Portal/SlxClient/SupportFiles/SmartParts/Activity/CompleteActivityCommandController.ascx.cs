using System;
using System.Collections.Generic;
using System.Text;
using System.Web.UI;
using System.Web.UI.WebControls;
using Sage.Platform;
using Sage.Platform.Application;
using Sage.Platform.Security;
using Sage.Platform.WebPortal.SmartParts;
using Sage.Platform.WebPortal.Workspaces.Tab;
using Sage.Entity.Interfaces;
using Sage.SalesLogix.Activity;
using Sage.Platform.Application.UI;
using Sage.SalesLogix.Attachment;
using Sage.SalesLogix.Security;
using Sage.SalesLogix.Web.Controls;
using Sage.SalesLogix.Web.Controls.PickList;
using Sage.Platform.Application.UI.Web;
using TimeZone = Sage.Platform.TimeZone;

public partial class SmartParts_Activity_CompleteActivityCommandController : EntityBoundSmartPartInfoProvider
{
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

    private LinkHandler _LinkHandler;
    private LinkHandler Link
    {
        get { return _LinkHandler ?? (_LinkHandler = new LinkHandler(Page)); }
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

        if (IsActivating && Form.IsInsert)
        {
            if (Activity.RecurrenceState != RecurrenceState.rstOccurrence)
                Activity.Type = GetActivityType(GetParam("type"));
        }

        DisableMembersAndResources();
        if (ClientBindingMgr != null)
        {
            ClientBindingMgr.RegisterSaveButton(CompleteNow);
            ClientBindingMgr.RegisterSaveButton(CompleteAsScheduled);
        }

        if (!IsPostBack)
        {
            CompleteAsScheduled.Visible = Form.IsSaveEnabled;
            CompleteNow.Visible = Form.IsSaveEnabled;
            CreateUser.Text = GetCreateUser();
        }
        ApplicationPage page = (ApplicationPage)Page;
        page.TitleBar.Text = GetTitleBarText();
        page.TitleBar.Image = ResolveUrl(GetTitleBarImage());
    }

    private string GetCreateUser()
    {
        User createUser = User.GetById(Activity.CreateUser);
        string userName = createUser != null
            ? createUser.UserInfo.UserName
            : Activity.CreateUser;
        string timezonestring = TimeZone != null
            ? TimeZone.UTCDateTimeToLocalTime(Activity.CreateDate).ToShortDateString()
            : string.Empty;
        return string.Format("{0} {1} {2} {3} {4} {5}",
            GetLocalResourceObject("Const_ScheduledBy"), userName,
            GetLocalResourceObject("Const_On"), timezonestring,
            GetLocalResourceObject("Const_originally_for"),
            TimeZone.UTCDateTimeToLocalTime(Activity.StartDate).ToShortDateString());
    }

    private void DisableMembersAndResources()
    {
        TabWorkspace ActivityTabs = PageWorkItem.Workspaces["TabControl"] as TabWorkspace;

        if (ActivityTabs != null)
        {
            foreach (TabInfo tab in ActivityTabs.Tabs)
            {
                if (tab.ID == "AddMembers")
                    ActivityFormHelper.SetEnabled(tab.Content.Controls, false);
                if (tab.ID == "AddResources")
                    ActivityFormHelper.SetEnabled(tab.Content.Controls, false);
            }
        }
    }

    private static ActivityType GetActivityType(string activityType)
    {
        if (string.IsNullOrEmpty(activityType)) return ActivityType.atAppointment;
        try
        {
            return (ActivityType)Enum.Parse(typeof(ActivityType), activityType);
        }
        catch (ArgumentException) { }
        return ActivityType.atAppointment;
    }

    //--------------start  from CompleteActivity-------------------------------
    protected override void OnWireEventHandlers()
    {
        base.OnWireEventHandlers();
        CompleteAsScheduled.Click += CompleteAsScheduled_ClickAction;
        CompleteNow.Click += CompleteNow_ClickAction;
        CancelButton.Click += CancelButton_Click;
    }

    private void CloseParentDialog(bool doRefreshAll)
    {
        var sb = new StringBuilder();
        var closeDialogId = "ctl00$DialogWorkspace$ActivityDialogController$btnCloseDialog";
        sb.AppendFormat("parent.__doPostBack('{0}','{1}');", closeDialogId, doRefreshAll);
        ScriptManager.RegisterStartupScript(
            this, GetType(), "activitydialogcontrollerscript", sb.ToString(), true);
    }

    protected void CompleteAsScheduled_ClickAction(object sender, EventArgs e)
    {
        DateTime compdt = DateTime.UtcNow;
        bool useCon = true;

        RadioButton rbCon = FindCompActControl("rbContact") as RadioButton;
        if (rbCon != null)
            useCon = rbCon.Checked;
        DateTimePicker dtpScheduled = FindCompActControl("Scheduled") as DateTimePicker;
        if (dtpScheduled != null)
        {
            if (dtpScheduled.DateTimeValue.HasValue)
            {
                compdt = dtpScheduled.DateTimeValue.Value.AddMinutes(Activity.Duration);
            }
        }
        CompleteActivity(compdt, useCon);

        CloseParentDialog(true);
    }

    private Control FindCompActControl(string controlID)
    {
        TabWorkspace ActivityTabs = PageWorkItem.Workspaces["TabControl"] as TabWorkspace;

        if (ActivityTabs != null)
        {
            Control tabControl = ActivityTabs.GetSmartPartByID("ActivityDetails");
            return tabControl.FindControl(controlID);
        }
        return null;
    }

    protected void CompleteNow_ClickAction(object sender, EventArgs e)
    {
        DateTime _now = DateTime.UtcNow;
        bool useCon = true;

        RadioButton rbCon = FindCompActControl("rbContact") as RadioButton;
        if (rbCon != null)
            useCon = rbCon.Checked;
        DateTimePicker dtpCompleted = FindCompActControl("Completed") as DateTimePicker;
        if (dtpCompleted != null)
            _now = dtpCompleted.DateTimeValue ?? _now;

        CompleteActivity(_now, useCon);

        CloseParentDialog(true);
    }

    private void CancelButton_Click(object sender, EventArgs e)
    {
        CloseParentDialog(false);
    }

    private void CompleteActivity(DateTime completeDate, bool selectedContact)
    {
        UpdateContactOrLeadInfo(selectedContact);

        PickListControl pklResult = FindCompActControl("Result") as PickListControl;
        string result = (pklResult != null) ? pklResult.PickListValue : string.Empty;
        string resultCode = string.Empty;
        IHistory hist = Activity.Complete(CurrentUserId, result, resultCode, completeDate);

        UpdateActivityAttachments(hist);
        UpdateEntityHistory(hist);
        LinkToNextDialog(hist);
    }

    private void UpdateContactOrLeadInfo(bool selectedContact)
    {
        if (selectedContact)
        {
            Activity.LeadId = null;
        }
        else
        {
            Activity.ContactId = null;
            Activity.OpportunityId = null;
            Activity.TicketId = null;
            Activity.AccountId = null;
        }

        if (!string.IsNullOrEmpty(Activity.LeadId))
        {
            ILead lead = EntityFactory.GetById<ILead>(Activity.LeadId);
            if (lead != null)
            {
                if (string.IsNullOrEmpty(Activity.AccountName))
                {
                    Activity.AccountName = lead.Company;
                }
                Activity.ContactName = lead.LeadNameLastFirst;
            }
        }
    }

    private void UpdateActivityAttachments(IHistory history)
    {
        UpdateTempAttachments(history);
        IList<IAttachment> attachments = Rules.GetAttachmentsFor(typeof(IActivity), Activity.ActivityId);
        if (attachments == null) return;

        foreach (IAttachment attachment in attachments)
        {
            attachment.HistoryId = history.HistoryId;
            attachment.Save();
        }
    }

    private void UpdateTempAttachments(IHistory history)
    {
        if (!Form.IsInsert) return;

        WorkItem workItem = PageWorkItem;
        if (workItem == null) return;

        object oStrTempAssociationID = workItem.State["TempAssociationID"];
        if (oStrTempAssociationID == null) return;

        string strTempAssociationID = oStrTempAssociationID.ToString();
        Type typ = EntityContext.EntityType;
        IList<IAttachment> attachments = Rules.GetAttachmentsFor(typ, strTempAssociationID);
        if (attachments != null)
        {
            foreach (IAttachment attachment in attachments)
            {
                attachment.HistoryId = history.Id.ToString();
                attachment.Save();
                /* Move the attachment from the \Attachment\_temporary path to the \Attachment path. */
                Rules.MoveTempAttachment(attachment);
            }
        }
        workItem.State.Remove("TempAssociationID");
    }

    private void LinkToNextDialog(IHistory hist)
    {
        string nextActivityInBatch = GetNextActivityInBatch(hist.ActivityId);

        if (ScheduleFollowUp(hist))
            return; // handle batch mode in ActivityDetailsManager

        if (nextActivityInBatch != null)
        {
            Dictionary<string, string> args = new Dictionary<string, string>();
            args.Add("mode", "batch");
            Link.CompleteActivity(nextActivityInBatch, args);
        }
    }

    private string GetNextActivityInBatch(string currentActivityId)
    {
        if (GetParam("mode") != "batch")
            return null;
        List<string> ids = AppContext["CompleteActivityIds"] as List<string>;
        if (ids == null)
            return null;

        ids.Remove(currentActivityId);
        return ids.Count > 0 ? ids[0] : null;
    }

    private bool ScheduleFollowUp(IHistory hist)
    {
        ListBox lbFollowUp = FindCompActControl("FollowUp") as ListBox;
        if (lbFollowUp == null) return false;
        CheckBox cxCarryOverNotes = FindCompActControl("CarryOverNotes") as CheckBox;
        if (cxCarryOverNotes == null) return false;
        CheckBox cxCarryOverAttachments = FindCompActControl("CarryOverAttachments") as CheckBox;
        if (cxCarryOverAttachments == null) return false;

        if (lbFollowUp.SelectedValue == "None" || lbFollowUp.SelectedValue == "")
            return false;

        Dictionary<string, string> args = new Dictionary<string, string>();
        args.Add("type", lbFollowUp.SelectedValue);

        if (cxCarryOverNotes.Checked || cxCarryOverAttachments.Checked)
        {
            args.Add("historyid", hist.Id.ToString());
        }
        if (cxCarryOverNotes.Checked)
        {
            args.Add("carryovernotes", "true");
        }
        if (cxCarryOverAttachments.Checked)
        {
            args.Add("carryoverattachments", "true");
        }
        args.Add("aid", hist.AccountId);
        args.Add("cid", hist.ContactId);
        args.Add("oid", hist.OpportunityId);
        args.Add("tid", hist.TicketId);
        args.Add("lid", hist.LeadId);

        // if we're in batch mode (multiple complete from ActivityReminders)
        // pass that fact on to ScheduleActivity, so it can link to next activity in batch
        if (GetParam("mode") == "batch")
            args.Add("mode", "batch");

        Link.ScheduleActivity(args);

        return true;
    }

    private void UpdateEntityHistory(IHistory hist)
    {
        //Remove deleted Activity from Entity History
        List<EntityHistory> removeList = new List<EntityHistory>();
        foreach (Sage.Platform.Application.EntityHistory eh in EntityContext.EntityHistory)
        {
            if (eh.EntityId.ToString() == hist.ActivityId)
            {
                removeList.Add(eh);
            }
        }

        foreach (Sage.Platform.Application.EntityHistory ehr in removeList)
        {
            EntityContext.EntityHistory.Remove(ehr);
        }
    }

    private string GetParam(string key)
    {
        string value;
        return Params.TryGetValue(key, out value) ? value : null;
    }

    //--------------end from CompleteActivity-------------------------------

    private string GetTitleBarText()
    {
        switch (Activity.Type)
        {
            case ActivityType.atAppointment:
                return GetLocalTitle("Meeting");
            case ActivityType.atPhoneCall:
                return GetLocalTitle("PhoneCall");
            case ActivityType.atToDo:
                return GetLocalTitle("ToDo");
            case ActivityType.atPersonal:
                return GetLocalTitle("Personal");
        }
        return GetLocalTitle("Activity");
    }

    private string GetTitleBarImage()
    {
        switch (Activity.Type)
        {
            case ActivityType.atAppointment:
                return "~/images/icons/Schedule_Meeting_24x24.gif";
            case ActivityType.atPhoneCall:
                return "~/images/icons/Schedule_Call_24x24.gif";
            case ActivityType.atToDo:
                return "~/images/icons/Schedule_To_Do_24x24.gif";
            case ActivityType.atPersonal:
                return "~/images/icons/Schedule_Personal_Activity_24x24.gif";
        }
        return "~/images/icons/Schedule_Meeting_24x24.gif.gif";
    }

    private string GetLocalTitle(string activityType)
    {
        string key = "Const_Complete" + activityType;
        return GetLocalResourceObject(key).ToString();
    }

    public override Type EntityType
    {
        get { return typeof(IActivity); }
    }

    protected override void OnAddEntityBindings()
    {
        // empty
    }

    public override ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        return new SmartPartInfo(string.Empty, string.Empty);
    }
}