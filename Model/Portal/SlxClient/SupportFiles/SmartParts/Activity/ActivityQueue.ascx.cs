using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.Web.UI;
using System.Web.UI.WebControls;
using Sage.Entity.Interfaces;
using Sage.Platform.Application;
using Sage.Platform.Security;
using Sage.SalesLogix.Activity;
using Sage.SalesLogix.Security;
using TimeZone = Sage.Platform.TimeZone;

public partial class SmartParts_Activity_ActivityQueue : UserControl
{
    private string _UserId;
    private string _UserName;
    private SLXUserService _SlxUserService;
    private bool displayQueue = false;
    private IContextService _Context;
    private int _highlightIndex = 0;

    protected void Page_Load(object sender, EventArgs e)
    {
        _SlxUserService = ApplicationContext.Current.Services.Get<IUserService>() as SLXUserService;
        _UserId = _SlxUserService.GetUser().Id;
        _UserName = _SlxUserService.GetUser().ToString();
        displayQueue = (Page.Request.QueryString.Get("mode") == "batch");
    }

    protected override void OnPreRender(EventArgs e)
    {
        if (displayQueue)
        {
            _Context = ApplicationContext.Current.Services.Get<IContextService>();
            List<string> ids = (List<string>)_Context.GetContext("CompleteActivityIds");
            if ((ids == null) || (ids.Count == 0))
            {
                ids = (List<string>)_Context.GetContext("RescheduleActivityIds");
            }
            ActivitySearchOptions aso = new ActivitySearchOptions();
            aso.ActivityIds.AddRange(ids);
            aso.UserIds.Add(_UserId);
            IList<Activity> results = Activity.GetActivitiesFor(aso);
            ActivityGrid.DataSource = ResultsToDataSet(results);
            ActivityGrid.DataBind();
            base.OnPreRender(e);
        }
    }

    protected override void Render(HtmlTextWriter writer)
    {
        if (displayQueue)
        {
            base.Render(writer);
        }
    }

    private DataSet ResultsToDataSet(IList<Activity> results)
    {
        TimeZone timeZone = (TimeZone)_Context.GetContext("TimeZone");
        DataSet dataSet = new DataSet();
        DataTable dataTable = new DataTable("Reminders");
        dataTable.Columns.Add(new DataColumn("Type"));
        dataTable.Columns.Add(new DataColumn("TypeImage"));
        dataTable.Columns.Add(new DataColumn("StartDate"));
        dataTable.Columns.Add(new DataColumn("ContactName"));
        dataTable.Columns.Add(new DataColumn("AccountName"));
        dataTable.Columns.Add(new DataColumn("Description"));
        dataTable.Columns.Add(new DataColumn("Priority"));
        dataTable.Columns.Add(new DataColumn("Notes"));
        dataTable.Columns.Add(new DataColumn("SchedFor"));
        dataTable.Columns.Add(new DataColumn("Id"));

        //_CurrentActivity = null;
        foreach (Activity item in results)
        {
            //if (_CurrentActivity == null) { _CurrentActivity = item; }
            UserActivity ua = item.Attendees.FindAttendee(_UserId);
            _UserName = User.GetById(item.UserId).ToString();
            DataRow row = dataTable.NewRow();
            switch (item.Type)
            {
                case ActivityType.atAppointment:
                    row[1] = Page.ResolveUrl("images/icons/Meeting_16x16.gif");
                    row[0] = item.TypeDisplay;
                    break;
                case ActivityType.atToDo:
                    row[1] = Page.ResolveUrl("images/icons/To_Do_16x16.gif");
                    row[0] = item.TypeDisplay;
                    break;
                case ActivityType.atPhoneCall:
                    row[1] = Page.ResolveUrl("images/icons/Call_16x16.gif");
                    row[0] = item.TypeDisplay;
                    break;
                case ActivityType.atPersonal:
                    row[1] = Page.ResolveUrl("images/icons/Personal_16x16.gif");
                    row[0] = item.TypeDisplay;
                    break;
                default:
                    row[1] = Page.ResolveUrl("images/icons/Calendar_16x16.gif");
                    row[0] = item.TypeDisplay;
                    break;
            }
            if (item.Timeless)
            {
                row[2] = item.StartDate.ToShortDateString() + " (timeless)";
            }
            else
            {
                row[2] = timeZone.UTCDateTimeToLocalTime(item.StartDate).ToString();
            }
            row[3] = item.ContactName;
            row[4] = item.AccountName;
            row[5] = item.Description;
            row[6] = item.Priority;
            row[7] = item.Notes;
            row[8] = _UserName;
            row[9] = item.Id;
            if (item.Id == Request["entityid"])
                _highlightIndex = dataTable.Rows.Count;
            dataTable.Rows.Add(row);
        }
        dataSet.Tables.Add(dataTable);
        return dataSet;
    }

    protected void ActivityGrid_RowDataBound(object sender, GridViewRowEventArgs e)
    {
        if (e.Row == null) { return; }
        if (e.Row.RowType == DataControlRowType.DataRow)
        {
            if (e.Row.RowIndex == _highlightIndex)
            {
                e.Row.BackColor = Color.LightBlue;//FromKnownColor(KnownColor.Highlight);
            }
        }
    }


}
