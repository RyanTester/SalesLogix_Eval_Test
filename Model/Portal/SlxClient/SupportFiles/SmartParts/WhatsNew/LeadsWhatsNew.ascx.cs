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

public partial class LeadsWhatsNew : UserControl, ISmartPartInfoProvider
{
    private bool _NewLeadsLastPageIndex = false;
    private bool _ModifiedLeadsLastPageIndex = false;
    private WhatsNewRequest<ILead> _request = null;
    private WhatsNewSearchOptions _searchOptions = null;

    /// <summary>
    /// Gets the search options.
    /// </summary>
    /// <value>The search options.</value>
    /// <returns>
    /// The <see cref="T:System.Web.HttpRequest"/> object associated with the <see cref="T:System.Web.UI.Page"/> that contains the <see cref="T:System.Web.UI.UserControl"/> instance.
    /// </returns>
    private WhatsNewRequest<ILead> WNRequest
    {
        get
        {
            if (_request == null)
                _request = new WhatsNewRequest<ILead>();
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
    /// Raises the <see cref="E:System.Web.UI.Control.PreRender"/> event.
    /// </summary>
    /// <param name="e">An <see cref="T:System.EventArgs"/> object that contains the event data.</param>
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

        //New Leads
        SearchOptions.SearchType = WhatsNewSearchOptions.SearchTypeEnum.New;
        if (!String.IsNullOrEmpty(grdNewLeads.SortExpression))
        {
            SearchOptions.OrderBy = grdNewLeads.SortExpression;
            SearchOptions.SortDirection =
                (grdNewLeads.CurrentSortDirection.Equals("Ascending", StringComparison.CurrentCultureIgnoreCase))
                    ? ListSortDirection.Ascending
                    : ListSortDirection.Descending;
        }
        WNRequest.SearchOptions = SearchOptions;
        grdNewLeads.DataSource = LeadsNewObjectDataSource;
        grdNewLeads.DataBind();

        //Modified Leads
        SearchOptions.SearchType = WhatsNewSearchOptions.SearchTypeEnum.Updated;
        if (!String.IsNullOrEmpty(grdModifiedLeads.SortExpression))
        {
            SearchOptions.OrderBy = grdModifiedLeads.SortExpression;
            SearchOptions.SortDirection =
                (grdModifiedLeads.CurrentSortDirection.Equals("Ascending", StringComparison.CurrentCultureIgnoreCase))
                    ? ListSortDirection.Ascending
                    : ListSortDirection.Descending;
        }
        else
        {
            SearchOptions.OrderBy = "ModifyDate";
            SearchOptions.SortDirection = ListSortDirection.Ascending;
        }
        WNRequest.SearchOptions = SearchOptions;
        grdModifiedLeads.DataSource = LeadsModifiedObjectDataSource;
        grdModifiedLeads.DataBind();

        base.OnPreRender(e);
    }

    /// <summary>
    /// Pages the index changing.
    /// </summary>
    /// <param name="sender">The sender.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewPageEventArgs"/> instance containing the event data.</param>
    protected void grdNewLeads_PageIndexChanging(Object sender, GridViewPageEventArgs e)
    {
        if (!Visible) return;

        int pageIndex = e.NewPageIndex;
        // if viewstate is off in the GridView then we need to calculate PageCount ourselves
        if (pageIndex > 10000)
        {
            _NewLeadsLastPageIndex = true;
            grdNewLeads.PageIndex = 0;
        }
        else
        {
            _NewLeadsLastPageIndex = false;
            grdNewLeads.PageIndex = pageIndex;
        }
    }

    /// <summary>
    /// Handles the PageIndexChanging event of the grdModifiedLeads control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewPageEventArgs"/> instance containing the event data.</param>
    protected void grdModifiedLeads_PageIndexChanging(Object sender, GridViewPageEventArgs e)
    {
        if (!Visible) return;

        int pageIndex = e.NewPageIndex;
        // if viewstate is off in the GridView then we need to calculate PageCount ourselves
        if (pageIndex > 10000)
        {
            _ModifiedLeadsLastPageIndex = true;
            grdModifiedLeads.PageIndex = 0;
        }
        else
        {
            _ModifiedLeadsLastPageIndex = false;
            grdModifiedLeads.PageIndex = pageIndex;
        }
    }

    protected void Sorting(Object sender, GridViewSortEventArgs e)
    {
    }

    /// <summary>
    /// Creates the lead whats new data source.
    /// </summary>
    /// <param name="sender">The sender.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.ObjectDataSourceEventArgs"/> instance containing the event data.</param>
    protected void CreateLeadsWhatsNewDataSource(object sender, ObjectDataSourceEventArgs e)
    {
        if (_NewLeadsLastPageIndex)
        {
            int pageIndex = 0;
            int recordCount = WNRequest.GetRecordCount();
            int pageSize = grdNewLeads.PageSize;
            decimal numberOfPages = recordCount / pageSize;
            pageIndex = Convert.ToInt32(Math.Ceiling(numberOfPages));
            grdNewLeads.PageIndex = pageIndex;
        }
        e.ObjectInstance = WNRequest;
    }

    /// <summary>
    /// Creates the lead whats modified data source.
    /// </summary>
    /// <param name="sender">The sender.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.ObjectDataSourceEventArgs"/> instance containing the event data.</param>
    protected void CreateLeadsWhatsModifiedDataSource(object sender, ObjectDataSourceEventArgs e)
    {
        if (_ModifiedLeadsLastPageIndex)
        {
            int pageIndex = 0;
            int recordCount = WNRequest.GetRecordCount();
            int pageSize = grdModifiedLeads.PageSize;
            decimal numberOfPages = recordCount / pageSize;
            pageIndex = Convert.ToInt32(Math.Ceiling(numberOfPages));
            grdModifiedLeads.PageIndex = pageIndex;
        }
        e.ObjectInstance = WNRequest;
    }

    /// <summary>
    /// Disposes the lead whats new data source.
    /// </summary>
    /// <param name="sender">The sender.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.ObjectDataSourceDisposingEventArgs"/> instance containing the event data.</param>
    protected void DisposeLeadsWhatsNewDataSource(object sender, ObjectDataSourceDisposingEventArgs e)
    {
        // Get the instance of the business object that the ObjectDataSource is working with.
        WhatsNewRequest<ILead> dataSource = e.ObjectInstance as WhatsNewRequest<ILead>;

        // Cancel the event, so that the object will not be Disposed if it implements IDisposable.
        e.Cancel = true;
    }

	#region ISmartPartInfoProvider Members

	public ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
	{
		ToolsSmartPartInfo tinfo = new ToolsSmartPartInfo();

		Label lbl = new Label();
		lbl.Text = GetLocalResourceObject("Leads_Caption").ToString();

		tinfo.LeftTools.Add(lbl);
		tinfo.ImagePath = Page.ResolveClientUrl("~/images/icons/Leads_24x24.gif");

		return tinfo;
	}

	#endregion
}
