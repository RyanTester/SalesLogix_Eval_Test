using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Collections.Generic;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using Sage.Entity.Interfaces;
using Sage.Platform;
using Sage.Platform.Security;
using Sage.Platform.Application;
using Sage.Platform.Application.Services;
using Sage.SalesLogix.Security;
using Sage.SalesLogix.WebUserOptions;
using Sage.Platform.Application.UI;
using Sage.Platform.Repository;
using Sage.SalesLogix.Activity;

public partial class CalendarOptionsPage : Sage.Platform.WebPortal.SmartParts.SmartPart, ISmartPartInfoProvider
{
    protected void Page_PreRender(object sender, EventArgs e)
    {
        CalendarOptions options = null;
        try
        {
            options = CalendarOptions.Load(Server.MapPath(@"App_Data\LookupValues"));
        }
        catch
        {
            // temporary, as the service throws an exception for options not found
            // the service is not yet complete, but this allows testing of the UI
            options = CalendarOptions.CreateNew(Server.MapPath(@"App_Data\LookupValues"));
        }

        _defaultCalendarView.DataSource = options.DefaultCalendarViewLookupList;
        _defaultCalendarView.DataTextField = options.DataTextField;
        _defaultCalendarView.DataValueField = options.DataValueField;

        _showHistoryOnDayView.DataSource = options.ShowHistoryOnDayViewLookupList;
        _showHistoryOnDayView.DataTextField = options.DataTextField;
        _showHistoryOnDayView.DataValueField = options.DataValueField;

        _showOnActivities.DataSource = options.ShowOnActivitiesLookupList;
        _showOnActivities.DataTextField = options.DataTextField;
        _showOnActivities.DataValueField = options.DataValueField;

        _dayStart.DataSource = options.DayStartLookupList;
        _dayStart.DataTextField = options.DataValueField;
        _dayStart.DataValueField = options.DataTextField;

        _dayEnd.DataSource = options.DayEndLookupList;
        _dayEnd.DataTextField = options.DataValueField;
        _dayEnd.DataValueField = options.DataTextField;

        _defaultInterval.DataSource = options.DefaultIntervalLookupList;
        _defaultInterval.DataTextField = options.DataValueField;
        _defaultInterval.DataValueField = options.DataValueField;

        DataBind();
        BindUsers();

        // set defaults
        Utility.SetSelectedValue(_defaultCalendarView, options.DefaultCalendarView);
        Utility.SetSelectedValue(_showHistoryOnDayView, options.ShowHistoryOnDayView);

        if (!Utility.SetSelectedValue(UserList, options.ViewCalendarFor))
        {
            Utility.SetSelectedValue(UserList,
                                     ((SLXUserService)(ApplicationContext.Current.Services.Get<IUserService>())).
                                         GetUser().Id);
        }

        Utility.SetSelectedValue(_showOnActivities, options.ShowOnActivities);

        if (!string.IsNullOrEmpty(options.DayStart))
        {
            DateTime timeHolder = DateTime.Parse(options.DayStart);
            _dayStart.ClearSelection();

            ListItem startItem = _dayStart.Items.FindByValue(timeHolder.ToString("t"));
            if (startItem != null)
                startItem.Selected = true;
            else
            {
                startItem = _dayStart.Items.FindByText(timeHolder.ToString("t"));
                if (startItem != null)
                    startItem.Selected = true;
            }
        }

        if (!string.IsNullOrEmpty(options.DayEnd))
        {
            DateTime timeHolder = DateTime.Parse(options.DayEnd);

            _dayEnd.ClearSelection();
            ListItem endItem = _dayEnd.Items.FindByValue(timeHolder.ToString("t"));
            if (endItem != null)
                endItem.Selected = true;
            else
            {
                endItem = _dayEnd.Items.FindByText(timeHolder.ToString("t"));
                if (endItem != null)
                    endItem.Selected = true;
            }
        }

        Utility.SetSelectedValue(_defaultInterval, options.DefaultInterval);
        Utility.SetSelectedValue(ddlDefaultActivityType, options.DefaultActivityType);
    }

    protected void _save_Click(object sender, EventArgs e)
    {
        // save values
        CalendarOptions options = new CalendarOptions(Server.MapPath(@"App_Data\LookupValues"));
        options.DefaultCalendarView = _defaultCalendarView.SelectedValue;
        options.ShowHistoryOnDayView = _showHistoryOnDayView.SelectedValue;
        options.ViewCalendarFor = UserList.SelectedValue;
        options.ShowOnActivities = _showOnActivities.SelectedValue;
        options.DayStart = _dayStart.SelectedItem.Text; // _dayStart.SelectedValue;
        options.DayEnd = _dayEnd.SelectedItem.Text; // _dayEnd.SelectedValue;
        options.DefaultInterval = _defaultInterval.SelectedValue;
        options.DefaultActivityType = ddlDefaultActivityType.SelectedValue;

        options.Save();

    }

    /// <summary>
    /// Gets the smart part info.
    /// </summary>
    /// <param name="smartPartInfoType">Type of the smart part info.</param>
    /// <returns></returns>
    public ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        Sage.Platform.WebPortal.SmartParts.ToolsSmartPartInfo tinfo = new Sage.Platform.WebPortal.SmartParts.ToolsSmartPartInfo();
        tinfo.Description = GetLocalResourceObject("PageDescription.Text").ToString();
        tinfo.Title = GetLocalResourceObject("PageDescription.Title").ToString();
        foreach (Control c in this.LitRequest_RTools.Controls)
        {
            tinfo.RightTools.Add(c);
        }
        //tinfo.ImagePath = Page.ResolveClientUrl("~/images/icons/Schdedule_To_Do_24x24.gif");
        return tinfo;
    }

    private void BindUsers()
    {
        if (IsActivating)
        {
            User loggedOnUser = ((SLXUserService)(ApplicationContext.Current.Services.Get<IUserService>())).GetUser();
            UserList.Items.Add(new ListItem(loggedOnUser.ToString(), loggedOnUser.Id.ToString()));

            IList<IUser> results = UserCalendar.GetCalendarUsers(loggedOnUser.Id);
            int selectedindex = 0;
            int i = 1;
            if (results != null)
            {
                foreach (User listUser in results)
                {
                    if (!loggedOnUser.Equals(listUser))
                    {
                        UserList.Items.Add(new ListItem(listUser.ToString(), listUser.Id.ToString()));
                    }
                    i++;
                }
            }
            UserList.SelectedIndex = selectedindex;
        }
    }
}
