using System;
using System.Collections.Generic;
using System.Web.UI;
using System.Web.UI.WebControls;
using Sage.Entity.Interfaces;
using Sage.Platform;
using Sage.Platform.Application;
using Sage.Platform.Application.UI;
using Sage.Platform.Application.UI.Web;
using Sage.Platform.Configuration;
using Sage.Platform.Repository;
using Sage.Platform.Security;
using Sage.Platform.WebPortal.Services;
using Sage.Platform.WebPortal.SmartParts;
using Sage.Platform.WebPortal.Workspaces.Tab;
using Sage.SalesLogix.Activity;
using Sage.SalesLogix.Security;
using Sage.SalesLogix.WebUserOptions;

public partial class SmartParts_Activity_ActivityManager : UserControl, ISmartPartInfoProvider
{
    private SLXUserService m_SLXUserService;
    private string _UserId = string.Empty;
    private ActivityAlarmOptions _UserOptions;

    private IPanelRefreshService _panelRefreshService;
    [ServiceDependency(Type = typeof(IPanelRefreshService), Required = true)]
    public IPanelRefreshService PanelRefresh
    {
        get
        {
            return _panelRefreshService;
        }
        set
        {
            _panelRefreshService = value;
        }
    }

    protected void Page_Load(object sender, EventArgs e)
    {
        m_SLXUserService = ApplicationContext.Current.Services.Get<IUserService>() as SLXUserService;
        _UserId = m_SLXUserService.GetUser().Id;
        _UserOptions = ActivityAlarmOptions.Load(Server.MapPath(@"App_Data\LookupValues"));
        if (!IsPostBack)
        {
            IList<IUser> users = UserCalendar.GetCalendarUsers(_UserId);
            foreach (IUser item in users)
            {
                if (_UserId.Equals(item.Id))
                {
                    UserList.Items.Insert(0, new ListItem(item.ToString(), item.Id.ToString()));
                    UserList.SelectedIndex = 0;
                }
                else
                {
                    if (item.Id.ToString().ToUpper().Trim() != "ADMIN")
                    {
                        UserList.Items.Add(new ListItem(item.ToString(), item.Id.ToString()));
                    }
                }
            }
        }
        if (UserList.SelectedIndex == -1)
        {
            UserList.SelectedIndex = 0;
        }
        GetContext();
    }

    private void GetContext()  //this was in prerender, but you need to set the options in load or they don't appear until next load
    {
        IContextService context = ApplicationContext.Current.Services.Get<IContextService>(true);
        ActivitySearchOptions aso;
        string timeFrame;
        if (Page.Request["useWelcomeCriteria"] == "T")
        {
            aso = (ActivitySearchOptions)context.GetContext("WelcomeSearchCriteria");
            timeFrame = (string)context.GetContext("WelcomeSearchTimeframe");
            SetCurrentTab("0", true);
            context.SetContext("ActivitySearchCriteria", aso);
            context.SetContext("ActivitySearchTimeFrame", TimeFrameList.SelectedValue);
            Response.Redirect("ActivityManager.aspx");
        }
        else
        {
            aso = (ActivitySearchOptions)context.GetContext("ActivitySearchCriteria");
            timeFrame = (string)context.GetContext("ActivitySearchTimeFrame");
        }
        if (aso == null)
        {
            aso = SetDefaultsFromUserOptions(ref timeFrame);
            TimeFrameList.SelectedIndex = -1;
            TimeFrameList.Items.FindByValue(timeFrame).Selected = true;
            if (aso != null)
            {
                SetStartandEndDates(ref aso);
                context.SetContext("ActivitySearchCriteria", aso);
                context.SetContext("ActivitySearchTimeFrame", TimeFrameList.SelectedValue);
            }
        }
        else if (!string.IsNullOrEmpty(timeFrame))
        {
            TimeFrameList.SelectedIndex = -1;
            TimeFrameList.Items.FindByValue(timeFrame).Selected = true;
        }
        if (aso != null)
        {
            UserList.SelectedIndex = -1;
            int index = 0;
            foreach (string id in aso.UserIds)
            {
                ListItem selectedItem = UserList.Items.FindByValue(id);
                if (selectedItem != null)
                {
                    UserList.Items.Remove(selectedItem);
                    selectedItem.Selected = true;
                    UserList.Items.Insert(index, selectedItem);
                    index++;
                }
            }
        }
    }

    protected void SearchBtn_Click(object sender, ImageClickEventArgs e)
    {
        IContextService context = ApplicationContext.Current.Services.Get<IContextService>(true);
        ActivitySearchOptions aso = new ActivitySearchOptions();
        int[] idxs = UserList.GetSelectedIndices();
        foreach (int i in idxs)
        {
            aso.UserIds.Add(UserList.Items[i].Value);
        }
        SetStartandEndDates(ref aso);
        context.SetContext("ActivitySearchCriteria", aso);
        context.SetContext("ActivitySearchTimeFrame", TimeFrameList.SelectedValue);
        Response.Redirect("ActivityManager.aspx?u=" + DateTime.Now.Millisecond);
    }

    private ActivitySearchOptions SetDefaultsFromUserOptions(ref string timeFrame)
    {
        ActivitySearchOptions result = null;
        timeFrame = TimeFrameList.Items[1].Value;
        if (_UserOptions != null)
        {
            SetCurrentTab(_UserOptions.DefaultView, true);
            if (!string.IsNullOrEmpty(_UserOptions.ShowActivitiesFor))
            {
                result = new ActivitySearchOptions();
                string[] items = _UserOptions.ShowActivitiesFor.Split('|');
                foreach (string id in items)
                {
                    result.UserIds.Add(id);
                }
            }
            if (!string.IsNullOrEmpty(_UserOptions.TimeFrame))
            {
                int idx = int.Parse(_UserOptions.TimeFrame);
                if (idx >= 0)
                {
                    timeFrame = TimeFrameList.Items[idx].Value;
                }
            }
        }

        return result;
    }

    private void SetStartandEndDates(ref ActivitySearchOptions so)
    {
        int month;
        int year;
        int remainder;
        switch (TimeFrameList.SelectedValue)
        {
            case "liAll":
                break;
            case "liToday":
                so.StartDate = DateTime.Today.ToUniversalTime();
                so.EndDate = DateTime.Today.AddDays(1).ToUniversalTime();
                break;
            case "liYesterday":
                DateTime temp = DateTime.Today.Subtract(new TimeSpan(1, 0, 0, 0));
                so.StartDate = temp.ToUniversalTime();
                so.EndDate = DateTime.Today.ToUniversalTime();
                break;
            case "liTomorrow":
                so.StartDate = DateTime.Today.AddDays(1).ToUniversalTime();
                so.EndDate = DateTime.Today.AddDays(2).ToUniversalTime();
                break;
            case "liCurrentWeek":
                so.StartDate = GetStartOfWeek().ToUniversalTime();
                so.EndDate = so.StartDate.Value.AddDays(7);
                break;
            case "liCurrentMonth":
                month = DateTime.Today.Month;
                year = DateTime.Today.Year;
                so.StartDate = new DateTime(year, month, 1).ToUniversalTime();
                so.EndDate = so.StartDate.Value.AddMonths(1);
                break;
            case "liCurrentQuarter":
                month = DateTime.Today.Month;
                year = DateTime.Today.Year;
                month = (Math.DivRem(month - 1, 3, out remainder) * 3) + 1;
                so.StartDate = new DateTime(year, month, 1).ToUniversalTime();
                so.EndDate = so.StartDate.Value.AddMonths(3);
                break;
            case "liCurrentYear":
                year = DateTime.Today.Year;
                so.StartDate = new DateTime(year, 1, 1).ToUniversalTime();
                so.EndDate = so.StartDate.Value.AddYears(1);
                break;
            case "liLastWeek":
                so.EndDate = GetStartOfWeek().ToUniversalTime();
                so.StartDate = so.EndDate.Value.Subtract(new TimeSpan(7, 0, 0, 0));
                break;
            case "liLastMonth":
                month = DateTime.Today.Month - 1;
                year = DateTime.Today.Year;
                if (month < 1)
                {
                    month = 12;
                    year--;
                }
                so.StartDate = new DateTime(year, month, 1).ToUniversalTime();
                so.EndDate = so.StartDate.Value.AddMonths(1);
                break;
            case "liLastQuarter":
                month = DateTime.Today.Month - 3;
                year = DateTime.Today.Year;
                if (month < 1)
                {
                    month = 11;
                    year--;
                }
                month = (Math.DivRem(month, 3, out remainder) * 3) + 1;
                if (remainder == 0)
                {
                    month = month - 3;
                }
                so.StartDate = new DateTime(year, month, 1).ToUniversalTime();
                so.EndDate = so.StartDate.Value.AddMonths(3);
                break;
            case "liLastYear":
                year = DateTime.Today.Year - 1;
                so.StartDate = new DateTime(year, 1, 1).ToUniversalTime();
                so.EndDate = so.StartDate.Value.AddYears(1);
                break;
            case "liWeektoDate":
                so.StartDate = GetStartOfWeek().ToUniversalTime();
                so.EndDate = DateTime.Today.AddDays(1).ToUniversalTime();
                break;
            case "liMonthtoDate":
                month = DateTime.Today.Month;
                year = DateTime.Today.Year;
                so.StartDate = new DateTime(year, month, 1).ToUniversalTime();
                so.EndDate = DateTime.Today.AddDays(1).ToUniversalTime();
                break;
            case "liQuartertoDate":
                month = DateTime.Today.Month;
                year = DateTime.Today.Year;
                month = (Math.DivRem(month - 1, 3, out remainder) * 3) + 1;
                so.StartDate = new DateTime(year, month, 1).ToUniversalTime();
                so.EndDate = DateTime.Today.AddDays(1).ToUniversalTime();
                break;
            case "liYeartoDate":
                year = DateTime.Today.Year;
                so.StartDate = new DateTime(year, 1, 1).ToUniversalTime();
                so.EndDate = DateTime.Today.AddDays(1).ToUniversalTime();
                break;
            case "liNextWeek":
                so.StartDate = GetStartOfWeek().AddDays(7).ToUniversalTime();
                so.EndDate = so.StartDate.Value.AddDays(7);
                break;
            case "liNextMonth":
                month = DateTime.Today.Month + 1;
                year = DateTime.Today.Year;
                if (month > 12)
                {
                    month = 1;
                    year++;
                }
                so.StartDate = new DateTime(year, month, 1).ToUniversalTime();
                so.EndDate = so.StartDate.Value.AddMonths(1);
                break;
            case "liNextQuarter":
                month = DateTime.Today.Month;
                year = DateTime.Today.Year;
                month = (Math.DivRem(month + 2, 3, out remainder) * 3) + 1;
                if (month > 12)
                {
                    month = 1;
                    year++;
                }
                so.StartDate = new DateTime(year, month, 1).ToUniversalTime();
                so.EndDate = so.StartDate.Value.AddMonths(3);
                break;
            case "liNextYear":
                year = DateTime.Today.Year + 1;
                so.StartDate = new DateTime(year, 1, 1).ToUniversalTime();
                so.EndDate = so.StartDate.Value.AddYears(1);
                break;
        }
        if (so.StartDate != null)
            so.StartDate = Activity.AdjustForClientTimezone((DateTime)so.StartDate);
        if (so.EndDate != null)
            so.EndDate = Activity.AdjustForClientTimezone((DateTime)so.EndDate);
    }

    private DateTime GetStartOfWeek()
    {
        DayOfWeek dow = DateTime.Today.DayOfWeek;
        switch (dow)
        {
            case DayOfWeek.Sunday:
                return DateTime.Today;
            case DayOfWeek.Monday:
                return DateTime.Today.Subtract(new TimeSpan(1, 0, 0, 0));
            case DayOfWeek.Tuesday:
                return DateTime.Today.Subtract(new TimeSpan(2, 0, 0, 0));
            case DayOfWeek.Wednesday:
                return DateTime.Today.Subtract(new TimeSpan(3, 0, 0, 0));
            case DayOfWeek.Thursday:
                return DateTime.Today.Subtract(new TimeSpan(4, 0, 0, 0));
            case DayOfWeek.Friday:
                return DateTime.Today.Subtract(new TimeSpan(5, 0, 0, 0));
            case DayOfWeek.Saturday:
                return DateTime.Today.Subtract(new TimeSpan(6, 0, 0, 0));
            default:
                return DateTime.Today;
        }
    }

    private void SetCurrentTab(string tab)
    {
        SetCurrentTab(tab, false);
    }

    private void SetCurrentTab(string tab, Boolean overwrite)
    {
        if (string.IsNullOrEmpty(tab)) { return; }
        ConfigurationManager manager = ApplicationContext.Current.Services.Get<ConfigurationManager>(true);
        ApplicationPage pg = Page as ApplicationPage;
        string mypagealias = Page.GetType().FullName + pg.ModeId;

        TabWorkspaceState tws = manager.GetInstance<TabWorkspaceState>(mypagealias, true);
        if ((tws != null) && (overwrite))
        {
            tws.ActiveMainTab = tws.MainTabs[int.Parse(tab)];
            manager.WriteInstance(tws, mypagealias, true);
        }
    }

    #region ISmartPartInfoProvider Members

    public ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        ToolsSmartPartInfo tinfo = new ToolsSmartPartInfo();
        foreach (Control c in ActivityReminders_RTools.Controls)
        {
            tinfo.RightTools.Add(c);
        }
        return tinfo;
    }

    #endregion
}
