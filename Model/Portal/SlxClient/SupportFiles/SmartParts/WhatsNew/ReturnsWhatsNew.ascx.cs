using System;
using System.ComponentModel;
using System.Web.UI;
using System.Web.UI.WebControls;
using Sage.Entity.Interfaces;
using Sage.Platform.Application;
using Sage.Platform.Application.Services;
using Sage.Platform.Application.UI;
using Sage.Platform.WebPortal.SmartParts;
using Sage.SalesLogix.LegacyBridge;

public partial class ReturnsWhatsNew : UserControl, ISmartPartInfoProvider
{
    private bool _NewReturnsLastPageIndex = false;
    private bool _ModifiedReturnsLastPageIndex = false;
    private WhatsNewRequest<IReturn> _request = null;
    private WhatsNewSearchOptions _searchOptions = null;

    /// <summary>
    /// Gets the search options.
    /// </summary>
    /// <value>The search options.</value>
    /// <returns>
    /// The <see cref="T:System.Web.HttpRequest"/> object associated with the <see cref="T:System.Web.UI.Page"/> that contains the <see cref="T:System.Web.UI.UserControl"/> instance.
    /// </returns>
    private WhatsNewRequest<IReturn> WNRequest
    {
        get
        {
            if (_request == null)
                _request = new WhatsNewRequest<IReturn>();
            return _request;
        }
    }

    /// <summary>
    /// Gets the search options.
    /// </summary>
    /// <value>The search options.</value>
    private WhatsNewSearchOptions SearchOptions
    {
        get
        {
            if (_searchOptions == null)
                _searchOptions = new WhatsNewSearchOptions();
            return _searchOptions;
        }
    }

    /// <summary>
    /// Handles the Load event of the Page control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void Page_Load(object sender, EventArgs e)
    {
    }

    /// <summary>
    /// Raises the <see cref="E:System.Web.UI.Control.PreRender"></see> event.
    /// </summary>
    /// <param name="e">An <see cref="T:System.EventArgs"></see> object that contains the event data.</param>
    protected override void OnPreRender(EventArgs e)
    {
        if (!Visible) return;

        DateTime fromDate = DateTime.UtcNow;
        IUserOptionsService userOptions = ApplicationContext.Current.Services.Get<IUserOptionsService>();
        if (userOptions != null)
        {
            try
            {
                fromDate = DateTime.Parse(userOptions.GetCommonOption("LastWebUpdate", "Web", false, fromDate.ToString(), "LastWebUpdate"));
            }
            catch
            { }
        }

        SearchOptions.SearchDate = fromDate;

        //New Returns
        SearchOptions.SearchType = WhatsNewSearchOptions.SearchTypeEnum.New;
        if (!String.IsNullOrEmpty(grdNewReturns.SortExpression))
        {
            SearchOptions.OrderBy = grdNewReturns.SortExpression;
            SearchOptions.SortDirection =
            (grdNewReturns.CurrentSortDirection.Equals("Ascending", StringComparison.CurrentCultureIgnoreCase))
                ? ListSortDirection.Ascending
                : ListSortDirection.Descending;
        }
        WNRequest.SearchOptions = SearchOptions;
        grdNewReturns.DataSource = ReturnsNewObjectDataSource;
        grdNewReturns.DataBind();

        //Modified Returns
        SearchOptions.SearchType = WhatsNewSearchOptions.SearchTypeEnum.Updated;
        if (!String.IsNullOrEmpty(grdModifiedReturns.SortExpression))
        {
            SearchOptions.OrderBy = grdModifiedReturns.SortExpression;
            SearchOptions.SortDirection =
            (grdModifiedReturns.CurrentSortDirection.Equals("Ascending", StringComparison.CurrentCultureIgnoreCase))
                ? ListSortDirection.Ascending
                : ListSortDirection.Descending;
        }
        else
        {
            SearchOptions.OrderBy = "ModifyDate";
            SearchOptions.SortDirection = ListSortDirection.Ascending;
        }
        WNRequest.SearchOptions = SearchOptions;
        grdModifiedReturns.DataSource = ReturnsModifiedObjectDataSource;
        grdModifiedReturns.DataBind();

        base.OnPreRender(e);
    }

    /// <summary>
    /// Handles the PageIndexChanging event of the grdNewReturns control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewPageEventArgs"/> instance containing the event data.</param>
    protected void grdNewReturns_PageIndexChanging(Object sender, GridViewPageEventArgs e)
    {
        if (!Visible) return;

        int pageIndex = e.NewPageIndex;
        // if viewstate is off in the GridView then we need to calculate PageCount ourselves
        if (pageIndex > 10000)
        {
            _NewReturnsLastPageIndex = true;
            grdNewReturns.PageIndex = 0;
        }
        else
        {
            _NewReturnsLastPageIndex = false;
            grdNewReturns.PageIndex = pageIndex;
        }
    }

    /// <summary>
    /// Handles the PageIndexChanging event of the grdModifiedReturns control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewPageEventArgs"/> instance containing the event data.</param>
    protected void grdModifiedReturns_PageIndexChanging(Object sender, GridViewPageEventArgs e)
    {
        if (!Visible) return;

        int pageIndex = e.NewPageIndex;
        // if viewstate is off in the GridView then we need to calculate PageCount ourselves
        if (pageIndex > 10000)
        {
            _ModifiedReturnsLastPageIndex = true;
            grdModifiedReturns.PageIndex = 0;
        }
        else
        {
            _ModifiedReturnsLastPageIndex = false;
            grdModifiedReturns.PageIndex = pageIndex;
        }
    }

    /// <summary>
    /// Sortings the specified sender.
    /// </summary>
    /// <param name="sender">The sender.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewSortEventArgs"/> instance containing the event data.</param>
    protected void Sorting(Object sender, GridViewSortEventArgs e)
    {
    }

    /// <summary>
    /// Creates the returns whats new data source.
    /// </summary>
    /// <param name="sender">The sender.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.ObjectDataSourceEventArgs"/> instance containing the event data.</param>
    protected void CreateReturnsWhatsNewDataSource(object sender, ObjectDataSourceEventArgs e)
    {
        if (_NewReturnsLastPageIndex)
        {
            int pageIndex = 0;
            int recordCount = WNRequest.GetRecordCount();
            int pageSize = grdNewReturns.PageSize;
            decimal numberOfPages = recordCount / pageSize;
            pageIndex = Convert.ToInt32(Math.Ceiling(numberOfPages));
            grdNewReturns.PageIndex = pageIndex;
        }
        e.ObjectInstance = WNRequest;
    }

    /// <summary>
    /// Creates the returns whats modified data source.
    /// </summary>
    /// <param name="sender">The sender.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.ObjectDataSourceEventArgs"/> instance containing the event data.</param>
    protected void CreateReturnsWhatsModifiedDataSource(object sender, ObjectDataSourceEventArgs e)
    {
        if (_ModifiedReturnsLastPageIndex)
        {
            int pageIndex = 0;
            int recordCount = WNRequest.GetRecordCount();
            int pageSize = grdModifiedReturns.PageSize;
            decimal numberOfPages = recordCount / pageSize;
            pageIndex = Convert.ToInt32(Math.Ceiling(numberOfPages));
            grdModifiedReturns.PageIndex = pageIndex;
        }
        e.ObjectInstance = WNRequest;
    }

    /// <summary>
    /// Disposes the returns whats new data source.
    /// </summary>
    /// <param name="sender">The sender.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.ObjectDataSourceDisposingEventArgs"/> instance containing the event data.</param>
    protected void DisposeReturnsWhatsNewDataSource(object sender, ObjectDataSourceDisposingEventArgs e)
    {
        // Get the instance of the business object that the ObjectDataSource is working with.
        WhatsNewRequest<IReturn> dataSource = e.ObjectInstance as WhatsNewRequest<IReturn>;

        // Cancel the event, so that the object will not be Disposed if it implements IDisposable.
        e.Cancel = true;
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

        Label lblNewReturns = new Label();
        lblNewReturns.Text = GetLocalResourceObject("Returns_Caption").ToString();

        tinfo.LeftTools.Add(lblNewReturns);
        tinfo.ImagePath = Page.ResolveClientUrl("~/images/icons/Return_detail_24x24.gif");

        return tinfo;
    }

    #endregion
}