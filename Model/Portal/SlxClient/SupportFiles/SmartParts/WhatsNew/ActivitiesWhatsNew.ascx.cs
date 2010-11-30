using System;
using System.Globalization;
using System.Text;
using System.Web.UI;
using System.Web.UI.WebControls;
using Sage.Entity.Interfaces;
using Sage.Platform;
using Sage.Platform.Application;
using Sage.Platform.Application.Services;
using Sage.Platform.Application.UI;
using Sage.Platform.Security;
using Sage.Platform.WebPortal.Services;
using Sage.Platform.WebPortal.SmartParts;
using Sage.Platform.WebPortal.Workspaces;
using Sage.Platform.WebPortal.Workspaces.Tab;
using Sage.SalesLogix.Activity;

public partial class SmartParts_ActWhatsNew_ActWhatsNew : UserControl, ISmartPartInfoProvider
{
    private bool _NewActivitiesLastPageIndex = false;
    private bool _ModifiedActivitiesLastPageIndex = false;
    private ActivtyWhatsNewSearchOptions _searchOptions = null;

    /// <summary>
    /// Gets the search options.
    /// </summary>
    /// <value>The search options.</value>
    private ActivtyWhatsNewSearchOptions SearchOptions
    {
        get
        {
            if (_searchOptions == null)
                _searchOptions = new ActivtyWhatsNewSearchOptions();
            return _searchOptions;
        }
    }

    private LinkHandler _LinkHandler;
    /// <summary>
    /// Gets the link.
    /// </summary>
    /// <value>The link.</value>
    private LinkHandler Link
    {
        get
        {
            if (_LinkHandler == null)
                _LinkHandler = new LinkHandler(Page);
            return _LinkHandler;
        }
    }

    /// <summary>
    /// Gets the current user id.
    /// </summary>
    /// <value>The current user id.</value>
    private static string CurrentUserId
    {
        get { return ApplicationContext.Current.Services.Get<IUserService>(true).UserId.Trim(); }
    }

    /// <summary>
    /// Handles the Load event of the Page control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!Visible) return;
    }

    /// <summary>
    /// Raises the <see cref="E:System.Web.UI.Control.PreRender"/> event.
    /// </summary>
    /// <param name="e">An <see cref="T:System.EventArgs"/> object that contains the event data.</param>
    protected override void OnPreRender(EventArgs e)
    {
        base.OnPreRender(e);

        RegisterClientScript();

        if (!Visible) return;

        DateTime fromDate = GetLastWebUpdate();

        SearchOptions.UserIds.AddRange(UserCalendar.GetCalendarAccessUserList(CurrentUserId));
        SearchOptions.StartDate = fromDate;
        if (!String.IsNullOrEmpty(grdNewActivities.SortExpression))
            SearchOptions.OrderBy = grdNewActivities.SortExpression;
        SearchOptions.IncludeUnconfirmed = true;
        SearchOptions.MaxResults = grdNewActivities.PageSize;

        grdNewActivities.DataSource = ActivitiesNewObjectDataSource;
        grdNewActivities.DataBind();
        grdModifiedActivities.DataSource = ActivitiesModifiedObjectDataSource;
        grdModifiedActivities.DataBind();
    }

    /// <summary>
    /// Creates the activities whats new data source.
    /// </summary>
    /// <param name="sender">The sender.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.ObjectDataSourceEventArgs"/> instance containing the event data.</param>
    protected void CreateActivitiesWhatsNewDataSource(object sender, ObjectDataSourceEventArgs e)
    {
        ActivitiesWhatsNewDataSource dataSource = new ActivitiesWhatsNewDataSource();
        dataSource.ActivitySearchOptions = SearchOptions;
        SearchOptions.ModifiedActivitiesOnly = false;
        if (_NewActivitiesLastPageIndex)
        {
            int pageIndex = 0;
            int recordCount = dataSource.GetRecordCount();
            int pageSize = grdNewActivities.PageSize;
            decimal numberOfPages = recordCount / pageSize;
            pageIndex = Convert.ToInt32(Math.Ceiling(numberOfPages));
            grdNewActivities.PageIndex = pageIndex;
        }
        e.ObjectInstance = dataSource;
    }

    /// <summary>
    /// Creates the activities whats modified data source.
    /// </summary>
    /// <param name="sender">The sender.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.ObjectDataSourceEventArgs"/> instance containing the event data.</param>
    protected void CreateActivitiesWhatsModifiedDataSource(object sender, ObjectDataSourceEventArgs e)
    {
        ActivitiesWhatsNewDataSource dataSource = new ActivitiesWhatsNewDataSource();
        dataSource.ActivitySearchOptions = SearchOptions;
        SearchOptions.ModifiedActivitiesOnly = true;
        if (_ModifiedActivitiesLastPageIndex)
        {
            int pageIndex = 0;
            int recordCount = dataSource.GetRecordCount();
            int pageSize = grdModifiedActivities.PageSize;
            decimal numberOfPages = recordCount / pageSize;
            pageIndex = Convert.ToInt32(Math.Ceiling(numberOfPages));
            grdModifiedActivities.PageIndex = pageIndex;
        }
        e.ObjectInstance = dataSource;
    }

    /// <summary>
    /// Gets the UTC time from local time.
    /// </summary>
    /// <param name="dateTime">The date time.</param>
    /// <returns></returns>
    public static DateTime GetUTCTimeFromLocalTime(DateTime dateTime)
    {
        IContextService context = ApplicationContext.Current.Services.Get<IContextService>(true);
        if (context.HasContext("TimeZone"))
        {
            Sage.Platform.TimeZone timeZone = (Sage.Platform.TimeZone)context.GetContext("TimeZone");
            return timeZone.LocalDateTimeToUTCTime(dateTime);
        }
        return dateTime;
    }

    /// <summary>
    /// Disposes the activities whats new data source.
    /// </summary>
    /// <param name="sender">The sender.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.ObjectDataSourceDisposingEventArgs"/> instance containing the event data.</param>
    protected void DisposeActivitiesWhatsNewDataSource(object sender, ObjectDataSourceDisposingEventArgs e)
    {
        // Get the instance of the business object that the ObjectDataSource is working with.
        ActivitiesWhatsNewDataSource dataSource = e.ObjectInstance as ActivitiesWhatsNewDataSource;

        // Cancel the event, so that the object will not be Disposed if it implements IDisposable.
        e.Cancel = true;
    }

    /// <summary>
    /// Gets the last web update.
    /// </summary>
    /// <returns></returns>
    private static DateTime GetLastWebUpdate()
    {
        DateTime dt = DateTime.UtcNow;

        IUserOptionsService userOpts = ApplicationContext.Current.Services.Get<IUserOptionsService>();
        if (userOpts != null)
        {
            try
            {
                dt = DateTime.Parse(userOpts.GetCommonOption("LastWebUpdate", "Web", false, dt.ToString(), "LastWebUpdate"));
            }
            catch
            { }
        }
        return dt.Date;
    }

    /// <summary>
    /// Gets the image.
    /// </summary>
    /// <param name="type">The type.</param>
    /// <returns></returns>
    protected string GetImage(object type)
    {
        const string meetingURL = "~/images/icons/Meeting_16x16.gif";
        const string phoneURL = "~/images/icons/Call_16x16.gif";
        const string todoURL = "~/images/icons/To_Do_16x16.gif";
        const string personalURL = "~/images/icons/Personal_16x16.gif";

        switch (type.ToString())
        {
            case "atAppointment":
                return meetingURL;
            case "atPhoneCall":
                return phoneURL;
            case "atToDo":
                return todoURL;
            case "atPersonal":
                return personalURL;
            default:
                return meetingURL;
        }
    }

    /// <summary>
    /// Gets the alt.
    /// </summary>
    /// <param name="type">The type.</param>
    /// <returns></returns>
    protected string GetAlt(object type)
    {
        switch (type.ToString())
        {
            case "atAppointment":
                return GetLocalResourceObject("Meeting_Type").ToString();
            case "atPhoneCall":
                return GetLocalResourceObject("Phone_Type").ToString();
            case "atToDo":
                return GetLocalResourceObject("ToDo_Type").ToString();
            case "atPersonal":
                return GetLocalResourceObject("Personal_Type").ToString();
            default:
                return GetLocalResourceObject("Meeting_Type").ToString();
        }
    }

    /// <summary>
    /// Gets the activity link.
    /// </summary>
    /// <param name="ActivityID">The activity ID.</param>
    /// <returns></returns>
    protected string GetActivityLink(object ActivityID)
    {
        IActivity act = EntityFactory.GetById<IActivity>(ActivityID.ToString());
        return String.Format("WhatsNew_EditActivity('{0}', '{1}')", act.Id, act.StartDate.ToString(CultureInfo.InvariantCulture));
    }

    /// <summary>
    /// Gets the type of the entity.
    /// </summary>
    /// <param name="contactId">The contact id.</param>
    /// <returns></returns>
    protected string GetEntityType(object contactId)
    {
        if (contactId != null)
            return GetLocalResourceObject("Contact").ToString();
        return GetLocalResourceObject("Lead").ToString();
    }

    /// <summary>
    /// Gets the display name.
    /// </summary>
    /// <param name="contact">The contact.</param>
    /// <param name="lead">The lead.</param>
    /// <returns></returns>
    protected string GetDisplayName(object contact, object lead)
    {
        if (lead != null)
            return lead.ToString();
        if (contact != null)
            return contact.ToString();
        return String.Empty;
    }

    /// <summary>
    /// Gets the entity id.
    /// </summary>
    /// <param name="contactId">The contact id.</param>
    /// <param name="leadId">The lead id.</param>
    /// <returns></returns>
    protected string GetEntityId(object contactId, object leadId)
    {
        if (leadId != null)
            return leadId.ToString();
        if (contactId != null)
            return contactId.ToString();
        return String.Empty;
    }

    /// <summary>
    /// Handles the PageIndexChanging event of the grdNewActivities control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewPageEventArgs"/> instance containing the event data.</param>
    protected void grdNewActivities_PageIndexChanging(Object sender, GridViewPageEventArgs e)
    {
        if (!Visible) return;

        int pageIndex = e.NewPageIndex;
        // if viewstate is off in the GridView then we need to calculate PageCount ourselves
        if (pageIndex > 10000)
        {
            _NewActivitiesLastPageIndex = true;
            grdNewActivities.PageIndex = 0;
        }
        else
        {
            _NewActivitiesLastPageIndex = false;
            grdNewActivities.PageIndex = pageIndex;
        }
    }

    /// <summary>
    /// Handles the PageIndexChanging event of the grdModifiedActivities control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewPageEventArgs"/> instance containing the event data.</param>
    protected void grdModifiedActivities_PageIndexChanging(Object sender, GridViewPageEventArgs e)
    {
        int pageIndex = e.NewPageIndex;
        // if viewstate is off in the GridView then we need to calculate PageCount ourselves
        if (pageIndex > 10000)
        {
            _ModifiedActivitiesLastPageIndex = true;
            grdModifiedActivities.PageIndex = 0;
        }
        else
        {
            _ModifiedActivitiesLastPageIndex = false;
            grdModifiedActivities.PageIndex = pageIndex;
        }
    }

    /// <summary>
    /// Sortings the specified sender.
    /// </summary>
    /// <param name="sender">The sender.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewSortEventArgs"/> instance containing the event data.</param>
    protected void Sorting(Object sender, GridViewSortEventArgs e)
    { }

    /// <summary>
    /// Handles the Click event of the hEditAct control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void hEditAct_Click(object sender, EventArgs e)
    {
        string activityID = hActId.Value;
        if (activityID.Length > 12)
            activityID = activityID.Substring(0, 12);
        Activity activity = EntityFactory.GetById<Activity>(activityID);

        if (activity != null)
        {
            if (activity.Recurring && activity.RecurrencePattern.Range.NumOccurences > -1)
            {
                IWebDialogService dialogService = GetdialogService();
                if (dialogService != null)
                {
                    dialogService.SetSpecs(200, 200, 200, 330, "EditRecurrence", "", true);
                    dialogService.EntityType = typeof(IActivity);
                    dialogService.EntityID = activityID;
                    dialogService.DialogParameters.Add("recurdate", hOccurrenceDate.Value);
                    dialogService.ShowDialog();
                }
                else
                {
                    Link.EditActivity(activityID);
                }
            }
            else
            {
                Link.EditActivity(activityID);
            }
        }
    }

    /// <summary>
    /// Getdialogs the service.
    /// </summary>
    /// <returns></returns>
    private IWebDialogService GetdialogService()
    {
        WorkItem workItem = null;
        Control testVal = Parent;
        int cnt = 0;
        while ((!(testVal is IWorkspace)) && (testVal != null) && (cnt < 5))
        {
            testVal = testVal.Parent;
        }
        if (testVal is MainContentWorkspace)
        {
            MainContentWorkspace ws = (MainContentWorkspace)testVal;
            workItem = ws.WorkItem.Parent;
        }
        else if (testVal is TabWorkspace)
        {
            TabWorkspace ws = (TabWorkspace)testVal;
            workItem = ws.WorkItem.Parent;
        }
        else if (testVal is DialogWorkspace)
        {
            DialogWorkspace ws = (DialogWorkspace)testVal;
            workItem = ws.WorkItem.Parent;
        }
        if (workItem == null) return null;
        return workItem.Services.Get<IWebDialogService>();
    }

    /// <summary>
    /// Registers the client script.
    /// </summary>
    private void RegisterClientScript()
    {
        StringBuilder script = new StringBuilder();
        script.AppendLine("function WhatsNew_EditActivity(activityId, occurDate)");
        script.AppendLine("{");
        script.AppendFormat("        document.getElementById('{0}').value = activityId;", hActId.ClientID);
        script.AppendLine();
        script.AppendFormat("        document.getElementById('{0}').value = occurDate;", hOccurrenceDate.ClientID);
        script.AppendLine();
        script.AppendFormat("        document.getElementById('{0}').click();", hEditAct.ClientID);
        script.AppendLine("}");
        ScriptManager.RegisterClientScriptBlock(Page, GetType(), ClientID + "_EditActivityScript", script.ToString(), true);
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

        Label lbl = new Label();
        lbl.Text = GetLocalResourceObject("Activities_Caption").ToString();

        tinfo.LeftTools.Add(lbl);
        tinfo.ImagePath = Page.ResolveClientUrl("~/images/icons/To_Do_24x24.gif");

        return tinfo;
    }

    #endregion
}
