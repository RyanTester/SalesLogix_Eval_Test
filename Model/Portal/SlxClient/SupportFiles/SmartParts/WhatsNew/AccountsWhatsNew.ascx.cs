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

public partial class SmartParts_AccWhatsNew_AccWhatsNew : UserControl, ISmartPartInfoProvider
{
    private bool _NewAccountsLastPageIndex = false;
    private bool _ModifiedAccountsLastPageIndex = false;
    private WhatsNewRequest<IAccount> _request = null;
    private WhatsNewSearchOptions _searchOptions = null;

    /// <summary>
    /// Gets the search options.
    /// </summary>
    /// <value>The search options.</value>
    /// <returns>
    /// The <see cref="T:System.Web.HttpRequest"/> object associated with the <see cref="T:System.Web.UI.Page"/> that contains the <see cref="T:System.Web.UI.UserControl"/> instance.
    /// </returns>
    private WhatsNewRequest<IAccount> WNRequest
    {
        get
        {
            if (_request == null)
                _request = new WhatsNewRequest<IAccount>();
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
        
        //New Accounts
        SearchOptions.SearchType = WhatsNewSearchOptions.SearchTypeEnum.New;
        if (!String.IsNullOrEmpty(grdNewAccounts.SortExpression))
        {
            SearchOptions.OrderBy = grdNewAccounts.SortExpression;
            SearchOptions.SortDirection =
                (grdNewAccounts.CurrentSortDirection.Equals("Ascending", StringComparison.CurrentCultureIgnoreCase))
                    ? ListSortDirection.Ascending
                    : ListSortDirection.Descending;
        }
        WNRequest.SearchOptions = SearchOptions;
        grdNewAccounts.DataSource = AccountsNewObjectDataSource;
        grdNewAccounts.DataBind();

        //Modified Accounts
        SearchOptions.SearchType = WhatsNewSearchOptions.SearchTypeEnum.Updated;
        if (!String.IsNullOrEmpty(grdModifiedAccounts.SortExpression))
        {
            SearchOptions.OrderBy = grdModifiedAccounts.SortExpression;
            SearchOptions.SortDirection =
                (grdModifiedAccounts.CurrentSortDirection.Equals("Ascending", StringComparison.CurrentCultureIgnoreCase))
                    ? ListSortDirection.Ascending
                    : ListSortDirection.Descending;
        }
        else
        {
            SearchOptions.OrderBy = "ModifyDate";
            SearchOptions.SortDirection = ListSortDirection.Ascending;
        }
        WNRequest.SearchOptions = SearchOptions;
        grdModifiedAccounts.DataSource = AccountsModifiedObjectDataSource;
        grdModifiedAccounts.DataBind();

        base.OnPreRender(e);
    }

    /// <summary>
    /// Pages the index changing.
    /// </summary>
    /// <param name="sender">The sender.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewPageEventArgs"/> instance containing the event data.</param>
    protected void grdNewAccounts_PageIndexChanging(Object sender, GridViewPageEventArgs e)
    {
        if (!this.Visible) return;

        int pageIndex = e.NewPageIndex;
        // if viewstate is off in the GridView then we need to calculate PageCount ourselves
        if (pageIndex > 10000)
        {
            _NewAccountsLastPageIndex = true;
            grdNewAccounts.PageIndex = 0;
        }
        else
        {
            _NewAccountsLastPageIndex = false;
            grdNewAccounts.PageIndex = pageIndex;
        }
    }

    /// <summary>
    /// Handles the PageIndexChanging event of the grdModifiedAccounts control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewPageEventArgs"/> instance containing the event data.</param>
    protected void grdModifiedAccounts_PageIndexChanging(Object sender, GridViewPageEventArgs e)
    {
        if (!this.Visible) return;

        int pageIndex = e.NewPageIndex;
        // if viewstate is off in the GridView then we need to calculate PageCount ourselves
        if (pageIndex > 10000)
        {
            _ModifiedAccountsLastPageIndex = true;
            grdModifiedAccounts.PageIndex = 0;
        }
        else
        {
            _ModifiedAccountsLastPageIndex = false;
            grdModifiedAccounts.PageIndex = pageIndex;
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
    /// Creates the accounts whats new data source.
    /// </summary>
    /// <param name="sender">The sender.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.ObjectDataSourceEventArgs"/> instance containing the event data.</param>
    protected void CreateAccountsWhatsNewDataSource(object sender, ObjectDataSourceEventArgs e)
    {
        if (_NewAccountsLastPageIndex)
        {
            int pageIndex = 0;
            int recordCount = WNRequest.GetRecordCount();
            int pageSize = grdNewAccounts.PageSize;
            decimal numberOfPages = recordCount / pageSize;
            pageIndex = Convert.ToInt32(Math.Ceiling(numberOfPages));
            grdNewAccounts.PageIndex = pageIndex;
        }
        e.ObjectInstance = WNRequest;
    }

    /// <summary>
    /// Creates the accounts whats modified data source.
    /// </summary>
    /// <param name="sender">The sender.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.ObjectDataSourceEventArgs"/> instance containing the event data.</param>
    protected void CreateAccountsWhatsModifiedDataSource(object sender, ObjectDataSourceEventArgs e)
    {
        if (_ModifiedAccountsLastPageIndex)
        {
            int pageIndex = 0;
            int recordCount = WNRequest.GetRecordCount();
            int pageSize = grdModifiedAccounts.PageSize;
            decimal numberOfPages = recordCount / pageSize;
            pageIndex = Convert.ToInt32(Math.Ceiling(numberOfPages));
            grdModifiedAccounts.PageIndex = pageIndex;
        }
        e.ObjectInstance = WNRequest;
    }

    /// <summary>
    /// Disposes the accounts whats new data source.
    /// </summary>
    /// <param name="sender">The sender.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.ObjectDataSourceDisposingEventArgs"/> instance containing the event data.</param>
    protected void DisposeAccountsWhatsNewDataSource(object sender, ObjectDataSourceDisposingEventArgs e)
    {
        // Get the instance of the business object that the ObjectDataSource is working with.
        WhatsNewRequest<IAccount> dataSource = e.ObjectInstance as WhatsNewRequest<IAccount>;

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

		Label lbl = new Label();
        lbl.Text = GetLocalResourceObject("Accounts_Caption").ToString();

		tinfo.LeftTools.Add(lbl);
		tinfo.ImagePath = Page.ResolveClientUrl("~/images/icons/Companies_24x24.gif");

		return tinfo;
	}

	#endregion
}
