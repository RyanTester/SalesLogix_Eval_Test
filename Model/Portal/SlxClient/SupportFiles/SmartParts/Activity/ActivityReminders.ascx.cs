using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Globalization;
using System.Text;
using System.Web.Configuration;
using System.Web.UI;
using System.Web.UI.WebControls;
using Sage.Entity.Interfaces;
using Sage.Platform.Application;
using Sage.Platform.Application.UI;
using Sage.Platform.Application.Services;
using Sage.Platform.Configuration;
using Sage.Platform.DynamicMethod;
using Sage.Platform.Security;
using Sage.Platform.Utility;
using Sage.Platform.VirtualFileSystem;
using Sage.Platform.WebPortal.SmartParts;
using Sage.SalesLogix.Activity;
using Sage.SalesLogix.Security;
using TimeZone = Sage.Platform.TimeZone;
using Sage.Platform;
using System.Linq;

public partial class SmartParts_Activity_ActivityReminders : UserControl, ISmartPartInfoProvider
{
    private SLXUserService m_SLXUserService;
    private TimeSpan reminderTimeout;
    private IContextService _Context;
    private Activity _CurrentActivity;
    private IUser _CurrentUser;
    private IUserOptionsService _UserOptions;
    private bool _Alarms;
    private bool _PastDue;
    private bool _Confirms;
    private bool _DisplayReminders;

    private LinkHandler _LinkHandler;

    private static readonly Dictionary<ActivityType, string> ActivityTypeImageUrls =
        new Dictionary<ActivityType, string>
        {
            {ActivityType.atAppointment, "images/icons/Meeting_16x16.gif"},
            {ActivityType.atToDo, "images/icons/To_Do_16x16.gif"},
            {ActivityType.atPhoneCall, "images/icons/Call_16x16.gif"},
            {ActivityType.atPersonal, "images/icons/Personal_16x16.gif"}
        };

    private LinkHandler Link
    {
        get
        {
            if (_LinkHandler == null)
                _LinkHandler = new LinkHandler(Page);
            return _LinkHandler;
        }
    }

    private IUser CurrentUser
    {
        get
        {
            if (_CurrentUser == null)
                _CurrentUser = m_SLXUserService.GetUser();
            return _CurrentUser;
        }
    }

    private IList<Activity> ListActionActivities
    {
        get { return Activity.GetByIds(GetListActionIds()); }
    }

    private static TimeZone TimeZone
    {
        get
        {
            var context = ApplicationContext.Current.Services.Get<IContextService>(true);
            return (TimeZone)context["TimeZone"];
        }
    }

    protected void Page_Load(object sender, EventArgs e)
    {
        m_SLXUserService = ApplicationContext.Current.Services.Get<IUserService>() as SLXUserService;
        _UserOptions = ApplicationContext.Current.Services.Get<IUserOptionsService>();
        _Context = ApplicationContext.Current.Services.Get<IContextService>(true);
        object cacheDisplayRem = _Context.GetContext("ActivityRemindersDisplay");
        if (cacheDisplayRem != null)
        {
            string[] temp = cacheDisplayRem.ToString().Split('|');
            _DisplayReminders = Convert.ToBoolean(temp[0]);
            _Alarms = Convert.ToBoolean(temp[1]);
            _PastDue = Convert.ToBoolean(temp[2]);
            _Confirms = Convert.ToBoolean(temp[3]);
        }
        else
        {
            _DisplayReminders = (_UserOptions.GetCommonOption("DisplayActivityReminders", "Calendar") != "F");
            _Alarms = (_UserOptions.GetCommonOption("RemindAlarms", "Calendar") != "F");
            _PastDue = (_UserOptions.GetCommonOption("RemindPastDue", "Calendar") != "F");
            _Confirms = (_UserOptions.GetCommonOption("RemindConfirmations", "Calendar") != "F");
            string value = string.Format("{0}|{1}|{2}|{3}", _DisplayReminders, _Alarms, _PastDue, _Confirms);
            _Context.SetContext("ActivityRemindersDisplay", value);
        }
        if (!Page.IsPostBack)
        {
            btnShowHideDetail.OnClientClick = String.Format("javascript:btnShowHideDetails('{0}', '{1}', '{2}')",
                ClientID,
                GetLocalResourceObject("btnHideDetail.Caption"),
                GetLocalResourceObject("btnShowDetail.Caption"));
            btnShowHideDetail.Attributes["onClick"] = "return false;";
        }
    }

    protected override void OnPreRender(EventArgs e)
    {
        if (!string.IsNullOrEmpty(currentIndex.Value))
            _CurrentActivity = Activity.GetActivityFromID(currentIndex.Value);

        DoAction(ActionType.Value);
        ActionType.Value = string.Empty;

        if (!Page.IsPostBack)
            chkPastDue.Checked = _PastDue;

        SetDetailPaneVisibility();
        LoadActivities();
        SetActivityDetail();
        base.OnPreRender(e);
    }

    private void DoAction(string action)
    {
        if (string.IsNullOrEmpty(action)) return;

        SelectedIds.Value = string.Empty;

        var detailActions = new Dictionary<string, Action>
        {
            {"Confirm", Confirm},
            {"Decline", Decline},
            {"UnConfirm", UnConfirm},
            {"Complete", Complete},
            {"Reschedule", Reschedule},
        };
        var listActions = new Dictionary<string, Action>
        {
            {"CompleteSelected", CompleteSelected},
            {"CompleteSelectedIndividually", CompleteSelectedIndividually},
            {"DeleteSelected", DeleteSelected},
            {"RescheduleSelected", RescheduleSelected},
            {"SnoozeSelected", SnoozeSelected},
            {"DismissSelected", DismissSelected},
        };

        if (detailActions.ContainsKey(action))
        {
            detailActions[action]();
        }
        else if (listActions.ContainsKey(action))
        {
            if (GetListActionIds().Count > 0)
                listActions[action]();
        }
    }

    #region Detail Actions

    private void Confirm()
    {
        ConfirmDeclineActivity(UserActivityStatus.asAccepted);
    }

    private void Decline()
    {
        ConfirmDeclineActivity(UserActivityStatus.asDeclned);
    }

    private void UnConfirm()
    {
        ConfirmDeclineActivity(UserActivityStatus.asUnconfirmed);
    }

    private void ConfirmDeclineActivity(UserActivityStatus status)
    {
        if (_CurrentActivity != null)
            _CurrentActivity.ConfirmDeclineActivity(_CurrentActivity.ActivityId, CurrentUser.Id.ToString().Trim(), status, String.Empty);
        if (status.Equals(UserActivityStatus.asDeclned))
            _CurrentActivity = null;
    }

    protected void Complete()
    {
        if (_CurrentActivity != null)
            Link.CompleteActivity(_CurrentActivity.ActivityId);
        _CurrentActivity = null;
    }

    // TODO: remove support for multiple ids
    private void Reschedule()
    {
        var context = ApplicationContext.Current.Services.Get<IContextService>(true);
        string[] ids = ActivityIds.Value.Split(',');
        if (ids.Length > 1)
        {
            context.SetContext("RescheduleActivityIds", new List<string>(ids));
            Response.Redirect(string.Format("RescheduleActivity.aspx?entityid={0}&mode=batch", ids[0]));
        }
        else
        {
            Response.Redirect(string.Format("RescheduleActivity.aspx?entityid={0}", currentIndex.Value));
        }
    }

    #endregion

    #region List Actions

    public void CompleteSelected()
    {
        var exceptionIds = new List<string>();

        foreach (var activity in ListActionActivities)
        {
            var data = new CompleteActivityData
            {
                User = CurrentUser,
                CompletedDate = Convert.ToBoolean(asScheduled.Value)
                    ? activity.StartDate.AddMinutes(activity.Duration)
                    : DateTime.UtcNow,
                Result = resultText.Value,
                Notes = completeNotes.Value
            };
            if (!Complete(activity, data))
                exceptionIds.Add(activity.ActivityId);
            if (activity == _CurrentActivity) _CurrentActivity = null;
        }

        if (exceptionIds.Count > 0)
            ShowError(SR.Error_QuickComplete, exceptionIds);
    }

    private static bool Complete(IActivity activity, CompleteActivityData data)
    {
        try
        {
            activity.LongNotes = data.Notes;
            IHistory history = activity.Complete(
                data.User.Id.ToString(), data.Result, string.Empty, data.CompletedDate);
            return history != null;
        }
        catch (DynamicMethodException e)
        {
            if (e.InnerException is CompleteActivityException)
                return false;
            throw;
        }
    }

    private class CompleteActivityData
    {
        public IUser User;
        public DateTime CompletedDate;
        public string Result;
        public string Notes;
    }

    private void ShowError(string message, IEnumerable<string> ids)
    {
        SelectedIds.Value = string.Join(",", ids.ToArray());
        var script = string.Format("Reminders.showError('{0}');", message);
        RunScript(script);
    }

    private void RunScript(string script)
    {
        var sb = new StringBuilder()
            .AppendLine("$(function() {")
            .AppendLine(script)
            .AppendLine("});");

        var type = typeof(Page);
        var key = Guid.NewGuid().ToString();
        var scriptBlock = sb.ToString();
        const bool tags = true;

        var sm = ScriptManager.GetCurrent(Page);
        if (sm != null && sm.IsInAsyncPostBack)
            ScriptManager.RegisterClientScriptBlock(Page, type, key, scriptBlock, tags);
        else
            Page.ClientScript.RegisterClientScriptBlock(type, key, scriptBlock, tags);
    }

    private void CompleteSelectedIndividually()
    {
        var args = new Dictionary<string, string>();
        var context = ApplicationContext.Current.Services.Get<IContextService>(true);
        var ids = GetListActionIds().ToArray();

        if (ids.Length > 1)
        {
            context.SetContext("CompleteActivityIds", GetListActionIds().ToList());
            args.Add("mode", "batch");
        }
        Link.CompleteActivity(ids[0], args);
    }

    private void DeleteSelected()
    {
        foreach (var activity in ListActionActivities)
        {
            activity.Delete();
            if (activity == _CurrentActivity) _CurrentActivity = null;
        }
    }

    private void RescheduleSelected()
    {
        var context = ApplicationContext.Current.Services.Get<IContextService>(true);
        string[] ids = GetListActionIds().ToArray();
        if (ids.Length > 1)
        {
            context.SetContext("RescheduleActivityIds", new List<string>(ids));
            Response.Redirect(string.Format("RescheduleActivity.aspx?entityid={0}&mode=batch", ids[0]));
        }
        else
        {
            Response.Redirect(string.Format("RescheduleActivity.aspx?entityid={0}", ids[0]));
        }
    }

    private void DismissSelected()
    {
        foreach (var activity in ListActionActivities)
        {
            activity.Attendees.Current.DismissAlarm();
            if (activity == _CurrentActivity) _CurrentActivity = null;
        }
    }

    private void SnoozeSelected()
    {
        var duration = TimeSpan.FromMinutes(int.Parse(SnoozeDuration.Text));
        foreach (var activity in ListActionActivities)
        {
            activity.Attendees.Current.SnoozeAlarm(duration);
            if (activity == _CurrentActivity) _CurrentActivity = null;
        }
    }

    #endregion

    private void SetDetailPaneVisibility()
    {
        if (hideDetailsPane.Value.Equals("F"))
        {
            divActivityDetails.Style.Add(HtmlTextWriterStyle.Display, "inline");
            divActivityList.Style.Add(HtmlTextWriterStyle.Height, "350px");
            btnShowHideDetail.Text = GetLocalResourceObject("btnHideDetail.Caption").ToString();
        }
        else
        {
            divActivityDetails.Style.Add(HtmlTextWriterStyle.Display, "none");
            divActivityList.Style.Add(HtmlTextWriterStyle.Height, "600px");
            btnShowHideDetail.Text = GetLocalResourceObject("btnShowDetail.Caption").ToString();
        }
    }

    private void LoadActivities()
    {
        if (!TimeSpan.TryParse(WebConfigurationManager.AppSettings["CacheActivityRemindersResultTimeout"], out reminderTimeout))
            reminderTimeout = CachedResult<int>.TimeoutOneMinute;
        IList<Activity> activityList = Reminders.GetRemindersList(GetSearchOptions());
        Page.Session["USER_REMINDER_COUNT_RESULT"] =  new CachedResult<int>(reminderTimeout, () => activityList.Count);
        grdActivityReminders.DataSource = ResultsToDataSet(activityList);
        grdActivityReminders.DataBind();
    }

    private ActivityReminderSearchOptions GetSearchOptions()
    {
        if (_PastDue != chkPastDue.Checked)
        {
            _UserOptions.SetCommonOption(
                "RemindPastDue",                    // name
                "Calendar",                         // category
                chkPastDue.Checked ? "T" : "F",     // value
                false                               // locked
            );
            var value = string.Format("{0}|{1}|{2}|{3}",
                _DisplayReminders, _Alarms, chkPastDue.Checked, _Confirms);
            _Context.SetContext("ActivityRemindersDisplay", value);
        }
        ListSortDirection sortDir = ListSortDirection.Ascending;
        if (grdActivityReminders.CurrentSortDirection.Equals("Descending"))
          sortDir = ListSortDirection.Descending;
        var searchOptions = new ActivityReminderSearchOptions
        {
            UserId = CurrentUser.Id.ToString().Trim(),
            IncludePastDue = chkPastDue.Checked,
            IncludeUnconfirmed = _Confirms,
            IncludeAlarms = _Alarms,
            SortOrder = GetSortExpression(),
            SortDirection = sortDir,
            MaxResults = 200
        };
        return searchOptions;
    }

    private static bool IsLead(IActivity item)
    {
        return (!String.IsNullOrEmpty(item.LeadId) && !(item.LeadId.Trim() == ""));
    }

    private DataTable ResultsToDataSet(IEnumerable<Activity> results)
    {
        DataTable dt = CreateDataTable();

        foreach (Activity activity in results)
        {
            bool isLead = IsLead(activity);
            if (_CurrentActivity == null)
                _CurrentActivity = activity;
            DataRow row = dt.NewRow();

            row["ActivityId"] = activity.ActivityId;
            row["TypeImage"] = Page.ResolveUrl(ActivityTypeImageUrls[activity.Type]);
            row["ActivityType"] = activity.Type.ToDisplayName();
            row["StartDate"] = FormatDate(activity.StartDate, activity.Timeless);
            row["ReminderType"] = GetReminderType(activity);

            if (isLead)
            {
                row["Name"] = activity.LeadName;
                row["ContactLink"] = string.Format(
                    "../../{0}.aspx?entityId={1}", "LEAD", activity.LeadId);
                var lead = EntityFactory.GetById<ILead>(activity.LeadId);
                if (lead != null)
                {
                    row["AccountName"] = lead.Company;
                    row["AccountLink"] = string.Format(
                        "../../{0}.aspx?entityId={1}", "LEAD", activity.LeadId);
                }
                row["ContactLinkEnabled"] = !string.IsNullOrEmpty(activity.LeadId);
                row["AccountLinkEnabled"] = !string.IsNullOrEmpty(activity.LeadId);
            }
            else
            {
                row["Name"] = activity.ContactName;
                row["ContactLink"] = string.Format(
                    "../../{0}.aspx?entityId={1}", "CONTACT", activity.ContactId);
                row["AccountName"] = activity.AccountName;
                row["AccountLink"] = string.Format(
                    "../../{0}.aspx?entityId={1}", "ACCOUNT", activity.AccountId);
                row["ContactLinkEnabled"] = !string.IsNullOrEmpty(activity.ContactId);
                row["AccountLinkEnabled"] = !string.IsNullOrEmpty(activity.AccountId);
            }
            row["Id"] = activity.Id;
            row["Regarding"] = activity.Description;

            dt.Rows.Add(row);
        }

        return dt;
    }

    private string GetReminderType(Activity item)
    {
        UserActivity ua = item.Attendees.Current;

        var isConfirm = ua.Status == UserActivityStatus.asUnconfirmed;
        if (isConfirm)
            return SR.ReminderType_Confirm;

        var isAlarm = ua.AlarmTime.HasValue && ua.Alarm.HasValue && ua.Alarm.Value;
        if (isAlarm)
            return SR.ReminderType_Alarm;

        bool isAlarmTriggered = ua.AlarmTime < DateTime.UtcNow;
        bool isAlarmOff = ua.Alarm == null || ua.Alarm == false;

        if (item.IsPastDue && (isAlarmTriggered || isAlarmOff))
            return SR.ReminderType_PastDue;

        return SR.ReminderType_Alarm;
    }

    private static DataTable CreateDataTable()
    {
        var dt = new DataTable("Reminders");
        dt.Columns.Add("ActivityId");
        dt.Columns.Add("ReminderType");
        dt.Columns.Add("ActivityType");
        dt.Columns.Add("ActivityLink");
        dt.Columns.Add("StartDate");
        dt.Columns.Add("Name");
        dt.Columns.Add("ContactLink");
        dt.Columns.Add("AccountName");
        dt.Columns.Add("AccountLink");
        dt.Columns.Add("Id");
        dt.Columns.Add("TypeImage");
        dt.Columns.Add("ContactLinkEnabled", typeof(bool));
        dt.Columns.Add("AccountLinkEnabled", typeof(bool));
        dt.Columns.Add("Regarding");
        return dt;
    }

    protected string BuildActivityNavigateUrl(object activityId, object reminderType)
    {
        if (reminderType.Equals(SR.ReminderType_Confirm))
            return String.Format("javascript:Link.confirmActivity('{0}');", activityId);
        return string.Format("javascript:Link.editActivity('{0}')", activityId);
    }

    private void SetActivityDetail()
    {
        if (_CurrentActivity != null && grdActivityReminders.Rows.Count > 0)
        {
            lnkRegarding.Text = _CurrentActivity.Description;
            lnkRegarding.NavigateUrl = String.Format("javascript:Link.editActivity('{0}');", (object)_CurrentActivity.ActivityId);
            switch (_CurrentActivity.Type)
            {
                case ActivityType.atAppointment:
                    imgActivity.ImageUrl = Page.ResolveUrl("images/icons/Meeting_16x16.gif");
                    break;
                case ActivityType.atToDo:
                    imgActivity.ImageUrl = Page.ResolveUrl("images/icons/To_Do_16x16.gif");
                    break;
                case ActivityType.atPhoneCall:
                    imgActivity.ImageUrl = Page.ResolveUrl("images/icons/Call_16x16.gif");
                    break;
                case ActivityType.atPersonal:
                    imgActivity.ImageUrl = Page.ResolveUrl("images/icons/Personal_16x16.gif");
                    break;
                default:
                    imgActivity.ImageUrl = Page.ResolveUrl("images/icons/Calendar_16x16.gif");
                    break;
            }
            if (_CurrentActivity.Timeless)
            {
                lblStartDate.Text = String.Format("{0} {1}", _CurrentActivity.StartDate.ToShortDateString(), GetLocalResourceObject("lblTimeless.Text").ToString());
            }
            else
            {
                DateTime endTime = TimeZone.UTCDateTimeToLocalTime(_CurrentActivity.StartDate).AddMinutes(_CurrentActivity.Duration);
                lblStartDate.Text = String.Format("{0} - {1}", TimeZone.UTCDateTimeToLocalTime(_CurrentActivity.StartDate), endTime.ToLongTimeString());
            }
            if (IsLead(_CurrentActivity))
            {
                lblContact.Text = GetLocalResourceObject("lblLead.Text").ToString();
                lnkContactName.Text = _CurrentActivity.LeadName;
                lnkContactName.Enabled = !String.IsNullOrEmpty(_CurrentActivity.LeadId);
                lnkContactName.NavigateUrl = Page.ResolveClientUrl(String.Format("../../{0}.aspx?entityId={1}", "LEAD", _CurrentActivity.LeadId));
                lblAccount.Text = GetLocalResourceObject("lblCompany.Text").ToString();
                lnkAccount.Text = _CurrentActivity.AccountName;
                lnkAccount.Enabled = !String.IsNullOrEmpty(_CurrentActivity.LeadId);
                lnkAccount.NavigateUrl = Page.ResolveClientUrl(String.Format("../../{0}.aspx?entityId={1}", "LEAD", _CurrentActivity.LeadId));
            }
            else
            {
                lblContact.Text = GetLocalResourceObject("lblContact.Text").ToString();
                lnkContactName.Text = _CurrentActivity.ContactName;
                lnkContactName.Enabled = !String.IsNullOrEmpty(_CurrentActivity.ContactId);
                lnkContactName.NavigateUrl = Page.ResolveClientUrl(String.Format("../../{0}.aspx?entityId={1}", "CONTACT", _CurrentActivity.ContactId));
                lblAccount.Text = GetLocalResourceObject("lblAccount.Text").ToString();
                lnkAccount.Text = _CurrentActivity.AccountName;
                lnkAccount.Enabled = !String.IsNullOrEmpty(_CurrentActivity.AccountId);
                lnkAccount.NavigateUrl = Page.ResolveClientUrl(String.Format("../../{0}.aspx?entityId={1}", "ACCOUNT", _CurrentActivity.AccountId));
            }
            phnPhone.Text = _CurrentActivity.PhoneNumber;
            lnkOpportunity.Text = _CurrentActivity.OpportunityName;
            lnkOpportunity.Enabled = !String.IsNullOrEmpty(_CurrentActivity.OpportunityId);
            lnkOpportunity.NavigateUrl = Page.ResolveClientUrl(String.Format("../../{0}.aspx?entityId={1}", "OPPORTUNITY", _CurrentActivity.OpportunityId));
            lnkTicket.Text = _CurrentActivity.TicketNumber;
            lnkTicket.Enabled = !String.IsNullOrEmpty(_CurrentActivity.TicketId);
            lnkTicket.NavigateUrl = Page.ResolveClientUrl(String.Format("../../{0}.aspx?entityId={1}", "TICKET", _CurrentActivity.TicketId));
            txtNotes.Text = _CurrentActivity.LongNotes;
            lblPriorityDisplay.Text = _CurrentActivity.Priority;
            lblLeaderDisplay.Text = User.GetById(_CurrentActivity.UserId).ToString();
            if (_CurrentActivity.Attendees.Current.Status.Equals(UserActivityStatus.asUnconfirmed))
            {
                divConfirmActivity.Style.Add(HtmlTextWriterStyle.Display, "inline");
                divActivityOptions.Style.Add(HtmlTextWriterStyle.Display, "none");
                divDeleteConfirmation.Style.Add(HtmlTextWriterStyle.Display, "none");
                lnkRegarding.NavigateUrl = Page.ResolveClientUrl(String.Format("../../ConfirmActivity.aspx?entityid={0}", (object)_CurrentActivity.ActivityId));
            }
            else
            {
                divActivityOptions.Style.Add(HtmlTextWriterStyle.Display, "inline");
                divConfirmActivity.Style.Add(HtmlTextWriterStyle.Display, "none");
                divDeleteConfirmation.Style.Add(HtmlTextWriterStyle.Display, "none");
            }
            SetDuration();
        }
        else
        {
            lnkRegarding.Text = GetLocalResourceObject("lblNoActivity.Text").ToString();
            imgActivity.ImageUrl = Page.ResolveUrl("images/icons/Calendar_16x16.gif");
            lnkContactName.Text = String.Empty;
            lnkContactName.NavigateUrl = String.Empty;
            phnPhone.Text = String.Empty;
            lnkAccount.Text = String.Empty;
            txtNotes.Text = String.Empty;
            lnkOpportunity.Text = String.Empty;
            lnkTicket.Text = String.Empty;
            btnSnooze.Enabled = false;
            btnSnoozeAll.Enabled = false;
        }
    }

    /// <summary>
    /// Sets the display duration of the activity.
    /// </summary>
    private void SetDuration()
    {
        if (_CurrentActivity.Duration < 60)
            lblDurationText.Text = String.Format(GetLocalResourceObject("lblDuration_Minutes.Text").ToString(), (object)_CurrentActivity.Duration);
        else if (_CurrentActivity.Duration.Equals(60))
            lblDurationText.Text = String.Format(GetLocalResourceObject("lblDuration_Hour.Text").ToString(), _CurrentActivity.Duration / 60);
        else
        {
            int hours = _CurrentActivity.Duration / 60;
            int minutes = _CurrentActivity.Duration - (hours * 60);
            if (minutes.Equals(0))
            {
                if (hours > 1)
                    lblDurationText.Text = String.Format(GetLocalResourceObject("lblDuration_Hours.Text").ToString(), hours);
                else
                    lblDurationText.Text = String.Format(GetLocalResourceObject("lblDuration_Hour.Text").ToString(), hours);
            }
            else
            {
                if (hours > 1)
                    lblDurationText.Text = String.Format("{0}, {1}", String.Format(GetLocalResourceObject("lblDuration_Hours.Text").ToString(), hours),
                        String.Format(GetLocalResourceObject("lblDuration_Minutes.Text").ToString(), minutes));
                else
                    lblDurationText.Text = String.Format("{0}, {1}", String.Format(GetLocalResourceObject("lblDuration_Hour.Text").ToString(), hours),
                        String.Format(GetLocalResourceObject("lblDuration_Minutes.Text").ToString(), minutes));
            }
        }
    }

    private static string FormatDate(DateTime value, bool timeless)
    {
        return timeless
            ? TimeZone.UTCDateTimeToLocalTime(value)
                .ToString(CultureInfo.CurrentCulture.DateTimeFormat.ShortDatePattern)
            : TimeZone.UTCDateTimeToLocalTime(value)
                .ToString(CultureInfo.CurrentCulture.DateTimeFormat.ShortDatePattern + " " +
                    CultureInfo.CurrentCulture.DateTimeFormat.ShortTimePattern);
    }

    private ICollection<string> GetListActionIds()
    {
        if (string.IsNullOrEmpty(ActivityIds.Value))
            return new string[0];
        return ActivityIds.Value.Split(',');
    }

    private ActivitySortOrder GetSortExpression()
    {
        switch (grdActivityReminders.CurrentSortExpression)
        {
            case "Type":
                return ActivitySortOrder.soType;
            case "ActivityType":
                return ActivitySortOrder.soActivityType;
            case "StartDate":
                return ActivitySortOrder.soStartDate;
            case "ContactName":
                return ActivitySortOrder.soContact;
            case "AccountName":
                return ActivitySortOrder.soAccount;
            case "AlarmTime":
                return ActivitySortOrder.soAlarmTime;
            default:
                return ActivitySortOrder.soStartDate;
        }
    }

    protected void grdActivityReminders_Sorting(object sender, GridViewSortEventArgs e)
    {
    }

    protected void grdActivityReminders_RowDataBound(object sender, GridViewRowEventArgs e)
    {
        if (e.Row.RowType != DataControlRowType.DataRow) return;

        DataRow item = ((DataRowView)e.Row.DataItem).Row;
        var activityId = item["ActivityId"].ToString();
        var reminderType = item["ReminderType"].ToString();

        SetOnClick(e.Row, "onGridViewRowSelected('{0}', '{1}', '{2}')",
            e.Row.DataItemIndex + 1, ClientID, activityId);

        var checkBox = FindControl<CheckBox>(e.Row, "chkRowSelect");
        checkBox.InputAttributes["data-activityId"] = activityId;
        checkBox.InputAttributes["data-reminderType"] = reminderType;

        //for confirmation type change text to bold
        if (reminderType.Equals(SR.ReminderType_Confirm))
        {
            e.Row.Cells[2].Font.Bold = true;
            if (e.Row.Cells[3].Controls.Count > 1)
                ((HyperLink)e.Row.Cells[3].Controls[1]).Font.Bold = true;
            e.Row.Cells[4].Font.Bold = true;
            if (e.Row.Cells[5].Controls.Count > 1)
                ((HyperLink)e.Row.Cells[5].Controls[1]).Font.Bold = true;
            if (e.Row.Cells[6].Controls.Count > 1)
                ((HyperLink)e.Row.Cells[6].Controls[1]).Font.Bold = true;
            e.Row.Cells[7].Font.Bold = true;
        }

        if (_CurrentActivity != null)
        {
            if (activityId.Equals(_CurrentActivity.ActivityId))
            {
                currentIndex.Value = _CurrentActivity.ActivityId;
                if (!e.Row.CssClass.Contains("x-grid3-row-selected"))
                    e.Row.CssClass += "x-grid3-row-selected";
            }
        }
    }

    private static void SetOnClick(WebControl control, string js, params object[] args)
    {
        control.Attributes.Add("onclick", string.Format(js, args));
    }

    private static T FindControl<T>(Control parentControl, string id) where T : Control
    {
        Control control = parentControl.FindControl(id);

        if (control == null)
        {
            throw new ArgumentOutOfRangeException(
                string.Format("{0}.FindControl failed for ID \"{1}\"", parentControl.ID, id));
        }

        return (T)control;
    }

    #region ISmartPartInfoProvider Members

    /// <summary>
    /// Gets the smart part info.
    /// </summary>
    /// <param name="smartPartInfoType">Type of the smart part info.</param>
    /// <returns></returns>
    public ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        ToolsSmartPartInfo tinfo = new ToolsSmartPartInfo();
        foreach (Control c in ActivityReminders_LTools.Controls)
            tinfo.LeftTools.Add(c);
        foreach (Control c in ActivityReminders_CTools.Controls)
            tinfo.CenterTools.Add(c);
        foreach (Control c in ActivityReminders_RTools.Controls)
            tinfo.RightTools.Add(c);
        return tinfo;
    }

    #endregion

    #region String Resources

    // ReSharper disable InconsistentNaming
    protected StringResources SR { get; set; }

    protected class StringResources
    {
        public string ReminderType_Alarm;
        public string ReminderType_Confirm;
        public string ReminderType_PastDue;
        public string DeleteActivity_ConfirmationMessage;
        public string Error_QuickComplete;
        public string Warning;
        public string ConfirmedActivitiesOnly;
        public string AsScheduled;
        public string Now;
        public string Individually;
        public string ApplyToSelected;
        public string QuickComplete;
        public string CompleteAllSelected;
        public string Result;
        public string AlarmOnlyAction;
        public string OK;
        public string Cancel;
        public string OptOutMessage;
    }
    // ReSharper restore InconsistentNaming

    protected void Page_Init(object sender, EventArgs e)
    {
        SR = new StringResources
        {
            ReminderType_Alarm = Res("ReminderType_Alarm"),
            ReminderType_Confirm = Res("ReminderType_Confirm"),
            ReminderType_PastDue = Res("ReminderType_PastDue"),
            DeleteActivity_ConfirmationMessage = Res("DeleteActivity_ConfirmationMessage"),
            Error_QuickComplete = Res("Error_QuickComplete"),
            Warning = Res("Warning"),
            ConfirmedActivitiesOnly = Res("ConfirmedActivitiesOnly"),
            AsScheduled = Res("AsScheduled"),
            Now = Res("Now"),
            Individually = Res("Individually"),
            ApplyToSelected = Res("ApplyToSelected"),
            QuickComplete = Res("QuickComplete"),
            CompleteAllSelected = Res("CompleteAllSelected"),
            Result = Res("Result"),
            AlarmOnlyAction = Res("AlarmOnlyAction"),
            OK = Res("OK"),
            Cancel = Res("Cancel"),
            OptOutMessage = Res("OptOutMessage")
        };
    }

    private string Res(string resourceKey)
    {
        return GetLocalResourceObject(resourceKey).ToString();
    }

    #endregion
}

[ConfigurationType("cfg://{General}", "ActivityReminderUserConfig")]
[ConfigurationPolicies(ConfigurationPolicies.User)]
[ConfigurationSource(typeof(VFSConfigurationSource))]
public class ActivityReminderState
{
    public bool ShowPastDue { get; set; }

    public ActivityReminderState()
    {
        ShowPastDue = true;
    }
}
