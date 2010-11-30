using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Infragistics.WebUI.Shared;
using Infragistics.WebUI.WebSchedule;
using Sage.Entity.Interfaces;
using Sage.Platform;
using Sage.Platform.Application;
using Sage.Platform.Application.Services;
using Sage.Platform.Application.UI;
using Sage.Platform.Security;
using Sage.Platform.WebPortal.Services;
using Sage.Platform.WebPortal.SmartParts;
using Sage.SalesLogix.Activity;
using Sage.SalesLogix.Web.UI.Activity;
using Activity = Sage.SalesLogix.Activity.Activity;
using TimeZone = Sage.Platform.TimeZone;

public partial class SmartParts_Calendar_ActivityCalendar : UserControl, ISmartPartInfoProvider
{
    private const string CalendarCss = "~/css/calendar.css";
    private const string IgJsFileName = "Libraries/Infragistics/ig_shared.js";

    protected CalendarState Selected { get; set; }

    protected CalendarOptions Options { get; set; }

    private LinkHandler _linkHandler;

    private LinkHandler Link
    {
        get
        {
            if (_linkHandler == null)
                _linkHandler = new LinkHandler(Page);
            return _linkHandler;
        }
    }

    #region Service Properties

    [ServiceDependency]
    public IUserService UserService { get; set; }

    [ServiceDependency]
    public IContextService ContextService { get; set; }

    [ServiceDependency]
    public IMenuService MenuService { get; set; }

    [ServiceDependency]
    public IUserOptionsService OptionsService { get; set; }

    #endregion

    protected void Page_Init(object sender, EventArgs e)
    {
        Options = new CalendarOptions(OptionsService);
        InitCalendar();
    }

    protected void Page_Load(object sender, EventArgs e)
    {
        Selected = GetCalendarState();

        BindCalendar();

        if (!IsPostBack)
        {
            BindUserList();
        }
    }

    protected void Page_PreRender(object sender, EventArgs e)
    {
        SlxWebDayView.Visible = Selected.View == CalendarView.DayView;
        SlxWebWeekView.Visible = Selected.View == CalendarView.WeekView;
        SlxWebMonthView.Visible = Selected.View == CalendarView.MonthView;

        hfCurrentView.Value = ((int)Selected.View).ToString();
    }

    private void BindCalendar()
    {
        SlxWebScheduleInfo.ActiveResourceName = Selected.User;
        SlxWebScheduleInfo.ActiveDayUtc = Selected.Date;

        var sm = ScriptManager.GetCurrent(Page);
        if (sm != null && sm.IsInAsyncPostBack)
        {
            if (!ShouldDataBind(sm.AsyncPostBackSourceElementID))
                CancelDataBind();
        }
    }

    private bool ShouldDataBind(string postBackId)
    {
        bool shouldDataBind = true;
        shouldDataBind = postBackId == btnEditActivity.UniqueID // TODO: shouldn't need this
            || postBackId == DayViewBtn.UniqueID
            || postBackId == WeekViewBtn.UniqueID
            || postBackId == MonthViewBtn.UniqueID
            || postBackId == string.Empty  // ig callback
            || postBackId == SlxWebScheduleInfo.UniqueID
            || postBackId == UserList.UniqueID
            || postBackId == "ctl00$DialogWorkspace$ActivityDialogController$btnCloseDialog"
                && Request["__EVENTARGUMENT"] == "True";

        if (postBackId == btnDeleteActivity.UniqueID)
            shouldDataBind = true;

        return shouldDataBind;
    }

    private void CancelDataBind()
    {
        object o = SlxWebScheduleInfo;
        var t = o.GetType();
        var pi = t.GetField("needsDataBindCalled",
            BindingFlags.NonPublic | BindingFlags.Instance);
        pi.SetValue(o, 0);
    }

    private void BindUserList()
    {
        UserList.DataBind(
            from UserCalendar uc in UserCalendar.GetCurrentUserCalendarList()
            let key = uc.UserName
            let value = uc.CalUser.UserName.ToUpper().Trim()
            select new KeyValuePair<string, string>(key, value));
        UserList.SelectedValue = SlxWebScheduleInfo.ActiveResourceName;
    }

    #region Control Events

    protected void DayViewBtn_Click(object sender, ImageClickEventArgs e)
    {
        Selected.View = CalendarView.DayView;
    }

    protected void WeekViewBtn_Click(object sender, ImageClickEventArgs e)
    {
        Selected.View = CalendarView.WeekView;
    }

    protected void MonthViewBtn_Click(object sender, ImageClickEventArgs e)
    {
        Selected.View = CalendarView.MonthView;
    }

    protected void UserList_SelectedIndexChanged(object sender, EventArgs e)
    {
        Selected.User = UserList.SelectedValue;
        SlxWebScheduleInfo.ActiveResourceName = UserList.SelectedValue;
    }

    #region Activity actions

    protected void btnDeleteActivity_Click(object sender, EventArgs e)
    {
        string activityId = hfCurrentActivity.Value;
        var activity = EntityFactory.GetById<Activity>(activityId);
        if (activity == null) return;

        if ((activity.Recurring) && (hfCurrentActivityIsOccurence.Value == "true"))
        {
            DateTime recurDate = DateTime.Parse(hfOccurrenceDate.Value);
            Link.DeleteActivityOccurrencePrompt(activityId, recurDate);
        }
        else
        {
            activity.Delete();
        }
    }

    protected void btnEditActivity_Click(object sender, EventArgs e)
    {
        string activityId = hfCurrentActivity.Value;
        var activity = EntityFactory.GetById<Activity>(activityId);
        if (activity == null) return;

        if ((activity.Recurring) && (activity.RecurrencePattern.Range.NumOccurences > -1))
        {
            DateTime recurDate = DateTime.Parse(hfOccurrenceDate.Value);
            Link.EditActivityOccurrencePrompt(activityId, recurDate);
        }
        else
        {
            Link.EditActivity(activityId);
        }
    }

    protected void btnCompleteActivity_Click(object sender, EventArgs e)
    {
        string activityId = hfCurrentActivity.Value;
        var activity = EntityFactory.GetById<Activity>(activityId);
        if (activity == null) return;

        if ((activity.Recurring) && (activity.RecurrencePattern.Range.NumOccurences > -1))
        {
            DateTime recurDate = DateTime.Parse(hfOccurrenceDate.Value);
            Link.CompleteActivityOccurrencePrompt(activityId, recurDate);
        }
        else
        {
            Link.CompleteActivity(activityId);
        }
    }

    #endregion

    #endregion

    #region ISmartPartInfoProvider Members

    public ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        var tinfo = new ToolsSmartPartInfo();
        tinfo.CenterTools.Add(DayViewBtn);
        tinfo.CenterTools.Add(WeekViewBtn);
        tinfo.CenterTools.Add(MonthViewBtn);
        tinfo.CenterTools.Add(UserList);
        tinfo.RightTools.Add(CalendarHelpLink);
        return tinfo;
    }

    #endregion

    private void InitCalendar()
    {
        InitWebScheduleInfo(SlxWebScheduleInfo);
        InitCalendarView(SlxWebCalendarView);
        InitDayView(SlxWebDayView);
        InitWeekView(SlxWebWeekView);
        InitMonthView(SlxWebMonthView);

        AddContextMenu("contextScheduleActivity",
            "~/ContextMenuItems/contextScheduleActivity.ascx");
        AddContextMenu("contextEditActivity",
            "~/ContextMenuItems/contextEditActivity.ascx");
        AddContextMenu("contextEditActivityHistory",
            "~/ContextMenuItems/contextEditActivityHistory.ascx");
    }

    private void InitWebScheduleInfo(WebScheduleInfo info)
    {
        info.EnableViewState = false;
        info.EnableSmartCallbacks = true;
        info.JavaScriptFileNameCommon = IgJsFileName;
        info.TimeZoneOffset = GetTimeZoneOffset();
        info.LoggedOnUserName = UserService.UserName.ToUpper().Trim();
        info.WorkDayStartTime = Options.DayStartTime;
        info.WorkDayEndTime = Options.DayEndTime;

        info.ClientEvents.ActivityDialogOpening = "SlxWebScheduleInfo_ActivityDialogOpening";
        info.ClientEvents.ActivityUpdating = "SlxWebScheduleInfo_ActivityUpdating";
        info.ClientEvents.ActiveDayChanged = "SlxWebScheduleInfo_ActiveDayChanged";

        var activityProvider = new ActivityProvider(SlxWebScheduleInfo, OptionsService);
        info.DataFetch = activityProvider;
        info.DataUpdate = activityProvider;
    }

    private void InitCalendarView(WebCalendarView view)
    {
        view.EnableViewState = false;
        view.WebScheduleInfo = SlxWebScheduleInfo;
        view.StyleSheetFileName = CalendarCss;
        view.JavaScriptFileNameCommon = IgJsFileName;
        view.ClientEvents.MouseUp = "Calendar_MouseUp";
        view.ClientEvents.Navigate = "SlxWebCalendarView_Navigate";
        view.FooterFormat =
            GetLocalResourceObject("SlxWebCalendarView.FooterFormat").ToString();
    }

    private void InitDayView(WebDayView view)
    {
        view.EnableViewState = false;
        view.WebScheduleInfo = SlxWebScheduleInfo;
        view.StyleSheetFileName = CalendarCss;
        view.ActivityWidthMinimum = 30;
        view.Height = Unit.Percentage(100);
        view.Width = Unit.Percentage(100);
        view.ScrollPosition = -1;
        view.AppointmentFormatString =
            "<REMINDER_IMAGE>&nbsp;<span class='content'><SUBJECT></span>&nbsp;";
        view.AppointmentTooltipFormatString =
            "<START_DATE_TIME> - <END_DATE_TIME><NEW_LINE><DESCRIPTION>";
        view.JavaScriptFileNameCommon = IgJsFileName;
        view.TimeSlotInterval = Options.DefaultInterval;
        view.ClientEvents.MouseDown = "GetDateOfEvent";
        view.ClientEvents.MouseUp = "Calendar_MouseUp";
        view.ClientEvents.NavigateNext = "View_Navigate";
        view.ClientEvents.NavigatePrevious = "View_Navigate";
    }

    private void InitWeekView(WebWeekView view)
    {
        view.EnableViewState = false;
        view.WebScheduleInfo = SlxWebScheduleInfo;
        view.StyleSheetFileName = CalendarCss;
        view.Height = Unit.Pixel(500);
        view.Width = Unit.Percentage(100);
        view.EnableKeyboardNavigation = true;
        view.AppointmentFormatString =
            "<START_DATE_TIME> - <END_DATE_TIME>&nbsp;<REMINDER_IMAGE>&nbsp;" +
            "<span class='content'><SUBJECT></span>";
        view.AppointmentTooltipFormatString =
            "<START_DATE_TIME> - <END_DATE_TIME><NEW_LINE><DESCRIPTION>";
        view.JavaScriptFileNameCommon = IgJsFileName;
        view.ClientEvents.MouseUp = "Calendar_MouseUp";
        view.ClientEvents.NavigateNext = "View_Navigate";
        view.ClientEvents.NavigatePrevious = "View_Navigate";
    }

    private void InitMonthView(WebMonthView view)
    {
        view.EnableViewState = false;
        view.WebScheduleInfo = SlxWebScheduleInfo;
        view.StyleSheetFileName = CalendarCss;
        view.Height = Unit.Percentage(100);
        view.Width = Unit.Percentage(100);
        view.AppointmentFormatString =
            "<span class='content'><SUBJECT></span>";
        view.AppointmentTooltipFormatString =
            "<START_DATE_TIME> - <END_DATE_TIME><NEW_LINE><DESCRIPTION>";
        view.JavaScriptFileNameCommon = IgJsFileName;
        view.ClientEvents.MouseUp = "Calendar_MouseUp";
        view.ClientEvents.NavigateNext = "View_Navigate";
        view.ClientEvents.NavigatePrevious = "View_Navigate";
    }

    private TimeSpan GetTimeZoneOffset()
    {
        var tz = (TimeZone)ContextService["TimeZone"];
        int minutes = -tz.BiasForGivenDate(DateTime.Now);
        return TimeSpan.FromMinutes(minutes);
    }

    private void AddContextMenu(string id, string path)
    {
        // Add New context menus to the Nav Collection then tell MenuService to write them out.
        var menu = LoadControl(path).Controls[0] as NavItemCollection;
        MenuService.AddMenu(id, menu, menuType.ContextMenu);
    }

    private CalendarState GetCalendarState()
    {
        var state = Session["ActivityCalendar_CalendarState"] as CalendarState;
        if (state == null)
        {
            state = new CalendarState
            {
                View = Options.DefaultView,
                User = Options.DefaultUser ?? SlxWebScheduleInfo.LoggedOnUserName
            };
            Session["ActivityCalendar_CalendarState"] = state;
        }

        state.Date = GetDateFromCookie() ?? SlxWebScheduleInfo.ActiveDayUtc;
        return state;
    }

    private SmartDate GetDateFromCookie()
    {
        var cookie = Request.Cookies["SlxCalendar"];
        if (cookie == null) return null;

        string date = GetCookieParm(cookie, "Date");
        return SmartDate.Parse(date).ToUniversalTime();
    }

    // TODO: cookies.js includes support for multivalue cookies -
    // create a corresponding C# class to manage these cookies
    private static string GetCookieParm(HttpCookie cookie, string parm)
    {
        var decoded = HttpUtility.UrlDecode(cookie.Value, System.Text.Encoding.Default);
        var nameValuePairs = decoded.Split(new[] { '&' });
        foreach (var pair in nameValuePairs)
        {
            var split = pair.Split(new[] { '=' });
            var name = split[0];
            var value = split[1];
            if (name == parm)
                return value;
        }
        return null;
    }

    private static CalendarView ParseView(string view)
    {
        int value;
        return int.TryParse(view, out value) && Enum.IsDefined(typeof(CalendarView), value)
            ? (CalendarView)Enum.Parse(typeof(CalendarView), view)
            : CalendarView.Default;
    }

    public class CalendarOptions
    {
        private IUserOptionsService OptionsService { get; set; }

        public SmartDate DayStartTime
        {
            get
            {
                var date = ParseSmartDate(GetOption("DayStartTime"));
                return !date.IsEmpty ? date : new SmartDate(1, 1, 1, 8, 0, 0);
            }
        }

        public SmartDate DayEndTime
        {
            get
            {
                var date = ParseSmartDate(GetOption("DayEndTime"));
                return !date.IsEmpty ? date : new SmartDate(1, 1, 1, 17, 0, 0);
            }
        }

        public string DefaultActivityType
        {
            get { return GetOption("DefaultActivityType"); }
        }

        public TimeSlotInterval DefaultInterval
        {
            get { return ParseInterval(GetOption("DefaultInterval")); }
        }

        public string DefaultUser
        {
            get { return GetUserName(GetOption("ViewCalendarFor")); }
        }

        public CalendarView DefaultView
        {
            get
            {
                CalendarView view = ParseView(GetOption("DefaultCalendarView"));
                return view != CalendarView.Default ? view : CalendarView.DayView;
            }
        }

        public CalendarOptions(IUserOptionsService userOptionsService)
        {
            OptionsService = userOptionsService;
        }

        private static TimeSlotInterval ParseInterval(string interval)
        {
            int value;
            return int.TryParse(interval, out value) &&
                Enum.IsDefined(typeof(TimeSlotInterval), value)
                ? (TimeSlotInterval)value
                : TimeSlotInterval.FifteenMinutes;
        }

        private static SmartDate ParseSmartDate(string date)
        {
            DateTime value;
            return DateTime.TryParse(date, out value) ? new SmartDate(value) : new SmartDate();
        }

        private string GetOption(string option)
        {
            return OptionsService.GetCommonOption(option, "Calendar");
        }

        private static string GetUserName(string userId)
        {
            var user = EntityFactory.GetById<IUser>(userId);
            return user != null ? user.UserName.ToUpper().Trim() : null;
        }
    }

    public enum CalendarView
    {
        Default = -1,
        DayView = 0,
        WeekView = 1,
        MonthView = 2
    }

    public class CalendarState
    {
        public SmartDate Date { get; set; }
        public string User { get; set; }
        public CalendarView View { get; set; }
    }
}
