using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Web.UI;
using System.Web.UI.WebControls;
using Sage.Entity.Interfaces;
using Sage.Platform.Application;
using Sage.Platform.Application.UI;
using Sage.Platform.Application.UI.Web;
using Sage.Platform.WebPortal;
using Sage.Platform.WebPortal.SmartParts;
using Sage.Platform.WebPortal.Workspaces.Tab;
using Sage.SalesLogix.Security;
using Sage.SalesLogix.Web.Controls;
using Sage.SalesLogix.Activity;
using Sage.SalesLogix.Attachment;
using TimeZone = Sage.Platform.TimeZone;

public partial class SmartParts_Activity_ActivityCommandController
    : EntityBoundSmartPartInfoProvider
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

    private LinkHandler _LinkHandler;
    private LinkHandler Link
    {
        get { return _LinkHandler ?? (_LinkHandler = new LinkHandler(Page)); }
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

            if (Activity.RecurrenceState == RecurrenceState.rstOccurrence)
            {
                TabWorkspace ActivityTabs = PageWorkItem.Workspaces["TabControl"] as TabWorkspace;
                if (ActivityTabs != null)
                {
                    //Hide the Recurring tab if Activity is an Occurrence in a series.
                    ActivityTabs.Hide("RecurringActivity", true);
                }
            }
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
                Activity.Type = Params.Type;
        }

        if (ClientBindingMgr != null)
        {
            ClientBindingMgr.RegisterSaveButton(OkButton);
            ClientBindingMgr.RegisterSaveButton(CompleteButton);
            ClientBindingMgr.RegisterSaveButton(DeleteButton);
        }

        if (!IsPostBack)
        {
            OkButton.Visible = Form.IsSaveEnabled;
            CompleteButton.Visible = Form.IsCompleteEnabled;
            DeleteButton.Visible = Form.IsDeleteEnabled;
            CreateUser.Text = GetCreateUser();

            DeleteButton.OnClientClick = GetDeleteConfirm();
        }
        ApplicationPage page = (ApplicationPage)Page;
        page.TitleBar.Text = GetTitleBarText();
        page.TitleBar.Image = ResolveUrl(GetTitleBarImage());
    }

    #region Form Bound Handling

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
        string scheduleOrEdit = Form.IsInsert ? "Schedule" : "Edit";

        if (Params.RecurDate.HasValue)
        {
            scheduleOrEdit = "Edit";
        }

        string key = "Const_" + scheduleOrEdit + activityType + "_Title";
        return GetLocalResourceObject(key).ToString();
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
        return string.Format("{0} {1} {2} {3}",
            GetLocalResourceObject("Const_ScheduledBy"), userName,
            GetLocalResourceObject("Const_On"), timezonestring);
    }

    private string GetDeleteConfirm()
    {
        string deleteMessage = GetLocalResourceObject("Const_DeleteMessage").ToString();
        if (Activity.UserId != Form.CurrentUserId)
        {
            UserActivity attendee = Activity.Attendees.FindAttendee(Form.CurrentUserId);
            if (attendee != null)
                deleteMessage = attendee.Status != UserActivityStatus.asDeclned
                    ? GetLocalResourceObject("Const_DeclineMessage").ToString()
                    : GetLocalResourceObject("Const_DeleteAllMessage").ToString();
        }
        return "return confirm('" + PortalUtil.JavaScriptEncode(deleteMessage) + "');";
    }

    protected override void OnWireEventHandlers()
    {
        base.OnWireEventHandlers();
        OkButton.Click += OkButton_Click;
        OkButton.Click += HandleBatchMode;
        CancelButton.Click += CancelButton_Click;
        CancelButton.Click += HandleBatchMode;
        DeleteButton.Click += DeleteButton_Click;
        CompleteButton.Click += CompleteButton_Click;
    }

    private void CloseParentDialog(bool doRefreshAll)
    {
        var sb = new StringBuilder();
        var closeDialogId = "ctl00$DialogWorkspace$ActivityDialogController$btnCloseDialog";
        sb.AppendFormat("parent.__doPostBack('{0}','{1}');", closeDialogId, doRefreshAll);
        ScriptManager.RegisterStartupScript(
            this, GetType(), "activitydialogcontrollerscript", sb.ToString(), true);
    }

    private void CancelButton_Click(object sender, EventArgs e)
    {
        CloseParentDialog(false);
    }

    #endregion

    #region Save Handling

    public void OkButton_Click(object sender, EventArgs e)
    {
        RadioButton rbLead = null;
        DurationPicker ReminderDuration = null;

        TabWorkspace ActivityTabs = PageWorkItem.Workspaces["TabControl"] as TabWorkspace;

        if (ActivityTabs != null)
        {
            Control tabControl = ActivityTabs.GetSmartPartByID("ActivityDetails");
            rbLead = tabControl.FindControl("rbLead") as RadioButton;
            ReminderDuration = tabControl.FindControl("ReminderDuration") as DurationPicker;
        }

        //break associations if not on that radio button per 1-61398
        if (rbLead != null)
            if (rbLead.Checked)
            {
                Activity.ContactId = null;
                Activity.OpportunityId = null;
                Activity.TicketId = null;
                Activity.AccountId = null;
                Activity.ContactName = null;
                if (Activity.LeadId == null)
                    Activity.AccountName = null;
                Activity.OpportunityName = null;
                Activity.TicketNumber = null;
            }
            else
            {
                Activity.LeadName = null;
                if (Activity.AccountId == null)
                    Activity.AccountName = null;
                Activity.LeadId = null;
            }

        // save insert mode status since save will change it
        bool insertMode = Activity.ActivityId.Length != 12;
        bool recurring = Activity.RecurrenceState == RecurrenceState.rstOccurrence;

        if (recurring)
        {
            ActivityOccurrence occ = (ActivityOccurrence)Activity;
            if (ReminderDuration != null) occ.ReminderDuration = ReminderDuration.Value;
            occ.Save();

        }
        else
        {
            if (ReminderDuration != null) Activity.ReminderDuration = ReminderDuration.Value;
            Activity.Save();
        }

        if (insertMode)
        {
            UpdateTempAttachments();
            if (recurring)
            {
                HandleRecurringAttachments();
            }
        }

        CloseParentDialog(true);
    }

    private void UpdateTempAttachments()
    {
        /* Update any attachment records that were created in Insert mode, but not as part of the carry over. */
        WorkItem workItem = PageWorkItem;
        if (workItem == null) return;

        object oStrTempAssociationID = workItem.State["TempAssociationID"];
        if (oStrTempAssociationID != null)
        {
            string strTempAssociationID = oStrTempAssociationID.ToString();
            IList<IAttachment> attachments = Rules.GetAttachmentsFor(EntityContext.EntityType, strTempAssociationID);
            if (attachments != null)
            {
                foreach (IAttachment attach in attachments)
                {
                    attach.ActivityId = Activity.ActivityId;
                    attach.Save();
                    /* Move the attachment from the \Attachment\_temporary path to the \Attachment path. */
                    Rules.MoveTempAttachment(attach);
                }
            }
            workItem.State.Remove("TempAssociationID");
        }
    }

    private void HandleRecurringAttachments()
    {
        ActivityOccurrence occ = (ActivityOccurrence)Activity;
        Rules.CopyRecurringAttachments(Activity, occ.ActivityBasedOn);
    }

    #endregion

    #region Delete Handling

    protected void DeleteButton_Click(object sender, EventArgs e)
    {
        DeleteActivityAttachments();
        Activity.Delete();
        RemoveFromEntityHistory();
        CloseParentDialog(true);
    }

    private void DeleteActivityAttachments()
    {
        if (Form.IsInsert) return;

        IList<IAttachment> attachments = Rules.GetAttachmentsFor(typeof(IActivity), Activity.ActivityId);
        foreach (IAttachment attachment in attachments)
        {
            int count = Rules.CountAttachmentsWithSameName(attachment);
            if (count.Equals(1))
            {
                string attachPath = Rules.GetAttachmentPath();
                if (File.Exists(attachPath + attachment.FileName))
                {
                    try
                    {
                        File.Delete(attachPath + attachment.FileName);
                    }
                    catch (Exception ex)
                    {
                        string message = string.Format(
                            "There was an unexpeted error deleting {0} in DeleteActivityAttachments. {1}",
                            attachment.FileName, ex.Message);
                        log.Error(message);
                    }
                }
            }
            attachment.Delete();
        }
    }

    private void RemoveFromEntityHistory()
    {
        if (EntityContext.EntityHistory.Count <= 0) return;

        EntityHistory historyRecord = EntityContext.EntityHistory[0];
        if (historyRecord == null) return;

        if (historyRecord.EntityId.ToString() == Activity.ActivityId)
            EntityContext.EntityHistory.Remove(historyRecord);
    }

    #endregion

    #region Complete Handling

    protected void CompleteButton_Click(object sender, EventArgs e)
    {
        Activity.Save();

        //Is Recurring
        if (Activity.Recurring && Activity.RecurrencePattern.Range.NumOccurences > -1)
        {
            DialogService.SmartPartMappedID = "CompleteRecurrence";
        }

        if (Activity is ActivityOccurrence)
        {
            Link.CompleteActivityOccurrence(Activity.ActivityId, Params.RecurDate ?? Activity.StartDate);
        }
        else
        {
            Link.CompleteActivity(Activity.ActivityId);
        }
        CloseParentDialog(true);
    }

    #endregion

    #region Batch Mode Handling

    private void HandleBatchMode(object sender, EventArgs e)
    {
        if (!Params.IsBatchMode) return;

        List<string> ids = AppContext["CompleteActivityIds"] as List<string>;
        if (ids != null && ids.Count > 0)
        {
            Dictionary<string, string> args = new Dictionary<string, string>();
            args.Add("mode", "batch");
            Link.CompleteActivity(ids[0], args);
        }
    }

    #endregion

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
