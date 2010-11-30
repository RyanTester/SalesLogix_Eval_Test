using System;
using System.Web.UI;
using Sage.Entity.Interfaces;
using Sage.Platform.Application;
using Sage.Platform.Application.Services;
using Sage.Platform.Application.UI;
using Sage.Platform.Application.UI.Web;
using Sage.Platform.Configuration;
using Sage.Platform.WebPortal.Services;
using Sage.Platform.WebPortal.SmartParts;
using Sage.Platform.WebPortal.Workspaces.Tab;
using Sage.SalesLogix.LegacyBridge;

public partial class RemoteMainWhatsNew : UserControl, ISmartPartInfoProvider
{
    private IPageWorkItemLocator _locator;

    /// <summary>
    /// Gets or sets the locator.
    /// </summary>
    /// <value>The locator.</value>
    [ServiceDependency]
    public IPageWorkItemLocator Locator
    {
        get { return _locator; }
        set { _locator = value; }
    }

    /// <summary>
    /// Handles the Load event of the Page control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void Page_Load(object sender, EventArgs e)
    {
        SetFilterDisplay();
        if (IsPostBack) return;

        DateTime searchDate = DateTime.UtcNow;
        IUserOptionsService userOpts = ApplicationContext.Current.Services.Get<IUserOptionsService>();
        if (userOpts != null)
        {
            try
            {
                searchDate = DateTime.Parse(userOpts.GetCommonOption("LastWebUpdate", "Web", false, searchDate.ToString(), "LastWebUpdate"));
                SetSelectedSearchType(userOpts.GetCommonOption("WhatsNewSearchType", "Web", false, WhatsNewSearchOptions.SearchTypeEnum.New.ToString(), "WhatsNewSearchType"));
            }
            catch (Exception)
            {
                
            }
        }
        dteChangeDate.DateTimeValue = searchDate;
    }

    /// <summary>
    /// Sets the filter display.
    /// </summary>
    private void SetFilterDisplay()
    {
        ConfigurationManager manager = ApplicationContext.Current.Services.Get<ConfigurationManager>(true);
        ApplicationPage page = Page as ApplicationPage;
        string pageAlias = Page.GetType().FullName + (String.IsNullOrEmpty(page.ModeId) ? page.ModeId : String.Empty);

        TabWorkspaceState tabWorkSpace = manager.GetInstance<TabWorkspaceState>(pageAlias, true);
        if (tabWorkSpace != null)
        {
            switch (tabWorkSpace.ActiveMainTab)
            {
                case "RemoteActivitiesWhatsNew":
                    divUpdatedOption.Style.Add(HtmlTextWriterStyle.Display, "inline");
                    divDeletedOption.Style.Add(HtmlTextWriterStyle.Display, "none");
                    break;
                case "RemoteNotesWhatsNew":
                    divUpdatedOption.Style.Add(HtmlTextWriterStyle.Display, "inline");
                    divDeletedOption.Style.Add(HtmlTextWriterStyle.Display, "none");
                    break;
                case "RemoteHistoryWhatsNew":
                    divUpdatedOption.Style.Add(HtmlTextWriterStyle.Display, "inline");
                    divDeletedOption.Style.Add(HtmlTextWriterStyle.Display, "none");
                    break;
                case "RemoteDocumentsWhatsNew":
                    divUpdatedOption.Style.Add(HtmlTextWriterStyle.Display, "none");
                    divDeletedOption.Style.Add(HtmlTextWriterStyle.Display, "none");
                    break;
                default:
                    divUpdatedOption.Style.Add(HtmlTextWriterStyle.Display, "inline");
                    divDeletedOption.Style.Add(HtmlTextWriterStyle.Display, "inline");
                    break;
            }
        }
    }

    /// <summary>
    /// Called when [search_ click].
    /// </summary>
    /// <param name="sender">The sender.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void OnSearch_Click(object sender, EventArgs e)
    {
        IUserOptionsService userOpts = ApplicationContext.Current.Services.Get<IUserOptionsService>();
        if (userOpts != null)
        {
            userOpts.SetCommonOption("LastWebUpdate", "Web", dteChangeDate.DateTimeValue.Value.ToString(), false);
            userOpts.SetCommonOption("WhatsNewSearchType", "Web", GetSeletectedSearchType(), false);
        }
        RefreshActiveTab();
    }

    /// <summary>
    /// Refreshes the active tab.
    /// </summary>
    private void RefreshActiveTab()
    {
        IPanelRefreshService refresher = Locator.GetPageWorkItem().Services.Get<IPanelRefreshService>();
        if (refresher != null)
            refresher.RefreshAll();
    }

    /// <summary>
    /// Called when [delete_ click].
    /// </summary>
    /// <param name="sender">The sender.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void OnDelete_Click(object sender, EventArgs e)
    {
        if (dteDeleteTransactions.DateTimeValue == null)
            throw new ValidationException(GetLocalResourceObject("error_DeleteTransactions_InvalidDate").ToString());
        WhatsNewRequest<IAccount> whatsNewRequest = new WhatsNewRequest<IAccount>();
        whatsNewRequest.DeleteTransactions(dteDeleteTransactions.DateTimeValue);
        RefreshActiveTab();
    }

    /// <summary>
    /// Gets the type of the seletected search.
    /// </summary>
    /// <returns></returns>
    private string GetSeletectedSearchType()
    {
        if (rdbUpdated.Checked)
            return "Updated";
        if (rdbDeleted.Checked)
            return "Deleted";
        return "New";
    }

    /// <summary>
    /// Sets the type of the selected search.
    /// </summary>
    /// <param name="searchType">Type of the search.</param>
    private void SetSelectedSearchType(String searchType)
    {
        rdbNew.Checked = (searchType.Equals("New"));
        rdbUpdated.Checked = (searchType.Equals("Updated"));
        rdbDeleted.Checked = (searchType.Equals("Deleted"));
    }

    protected void rdbNew_CheckedChanged(object sender, EventArgs e)
    {
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

        foreach (Control c in MainToolbar_LTools.Controls)
        {
            tinfo.LeftTools.Add(c);
        }
        foreach (Control c in MainToolbar_CTools.Controls)
        {
            tinfo.CenterTools.Add(c);
        }
        foreach (Control c in MainToolbar_RTools.Controls)
        {
            tinfo.RightTools.Add(c);
        }
        return tinfo;
    }

    #endregion
}
