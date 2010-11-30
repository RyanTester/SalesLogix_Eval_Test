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
using Sage.SalesLogix.Web.Controls;

public partial class RemoteOpportunitiesWhatsNew : UserControl, ISmartPartInfoProvider
{
    private WhatsNewRequest<IOpportunity> _request = null;

    /// <summary>
    /// Gets the search options.
    /// </summary>
    /// <value>The search options.</value>
    /// <returns>
    /// The <see cref="T:System.Web.HttpRequest"/> object associated with the <see cref="T:System.Web.UI.Page"/> that contains the <see cref="T:System.Web.UI.UserControl"/> instance.
    /// </returns>
    private WhatsNewRequest<IOpportunity> WNRequest
    {
        get
        {
            if (_request == null)
                _request = new WhatsNewRequest<IOpportunity>();
            return _request;
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
        if (Page.Visible)
        {
            DateTime searchDate = DateTime.UtcNow;
            WhatsNewSearchOptions.SearchTypeEnum searchTypeEnum = WhatsNewSearchOptions.SearchTypeEnum.New;
            IUserOptionsService userOpts = ApplicationContext.Current.Services.Get<IUserOptionsService>();
            if (userOpts != null)
            {
                try
                {
                    string searchType;
                    searchDate = DateTime.Parse(userOpts.GetCommonOption("LastWebUpdate", "Web", false, searchDate.ToString(), "LastWebUpdate"));
                    searchType = userOpts.GetCommonOption("WhatsNewSearchType", "Web", false, WhatsNewSearchOptions.SearchTypeEnum.New.ToString(), "WhatsNewSearchType");
                    if (Enum.IsDefined(typeof(WhatsNewSearchOptions.SearchTypeEnum), searchType))
                        searchTypeEnum = (WhatsNewSearchOptions.SearchTypeEnum)Enum.Parse(typeof(WhatsNewSearchOptions.SearchTypeEnum), searchType, true);
                }
                catch
                {
                }
            }
            WNRequest.SearchOptions.SearchDate = searchDate;
            WNRequest.SearchOptions.SearchType = searchTypeEnum;
            WNRequest.ActiveTab = WhatsNewRequest<IOpportunity>.ActiveTabEnum.Opportunity;
            SetActiveGridDisplay(searchTypeEnum, WNRequest);
        }
    }

    /// <summary>
    /// Sets the active grid display.
    /// </summary>
    /// <param name="searchType">Type of the search.</param>
    /// <param name="whatsNewRequest">The whats new request.</param>
    private void SetActiveGridDisplay(WhatsNewSearchOptions.SearchTypeEnum searchType, WhatsNewRequest<IOpportunity> whatsNewRequest)
    {
        switch (searchType)
        {
            case WhatsNewSearchOptions.SearchTypeEnum.Updated:
                lblOpportunitiesTitle.Text = GetLocalResourceObject("ModifiedOpportunities_Title").ToString();
                divNewOpportunities.Style.Add(HtmlTextWriterStyle.Display, "none");
                divUpdatedOpportunities.Style.Add(HtmlTextWriterStyle.Display, "inline");
                divDeletedOpportunities.Style.Add(HtmlTextWriterStyle.Display, "none");
                WNRequest.SearchOptions.SortExpression = grdUpdatedOpportunities.SortExpression;
                WNRequest.SearchOptions.SortDirection = (ListSortDirection)grdUpdatedOpportunities.SortDirection;
                grdUpdatedOpportunities.DataSource = whatsNewRequest.GetRemoteOpportunitiesWhatsNew();
                grdUpdatedOpportunities.DataBind();
                break;
            case WhatsNewSearchOptions.SearchTypeEnum.Deleted:
                lblOpportunitiesTitle.Text = GetLocalResourceObject("DeletedOpportunities_Title").ToString();
                divNewOpportunities.Style.Add(HtmlTextWriterStyle.Display, "none");
                divUpdatedOpportunities.Style.Add(HtmlTextWriterStyle.Display, "none");
                divDeletedOpportunities.Style.Add(HtmlTextWriterStyle.Display, "inline");
                WNRequest.SearchOptions.SortExpression = grdDeletedOpportunities.SortExpression;
                WNRequest.SearchOptions.SortDirection = (ListSortDirection)grdDeletedOpportunities.SortDirection;
                grdDeletedOpportunities.DataSource = whatsNewRequest.GetRemoteOpportunitiesWhatsNew();
                grdDeletedOpportunities.DataBind();
                break;
            default:
                lblOpportunitiesTitle.Text = GetLocalResourceObject("NewOpportunities_Title").ToString();
                divNewOpportunities.Style.Add(HtmlTextWriterStyle.Display, "inline");
                divUpdatedOpportunities.Style.Add(HtmlTextWriterStyle.Display, "none");
                divDeletedOpportunities.Style.Add(HtmlTextWriterStyle.Display, "none");
                WNRequest.SearchOptions.SortExpression = grdNewOpportunities.SortExpression;
                WNRequest.SearchOptions.SortDirection = (ListSortDirection)grdNewOpportunities.SortDirection;
                grdNewOpportunities.DataSource = whatsNewRequest.GetRemoteOpportunitiesWhatsNew();
                grdNewOpportunities.DataBind();
                break;
        }
    }

    /// <summary>
    /// Handles the Sorting event of the grdOpportunities control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewSortEventArgs"/> instance containing the event data.</param>
    protected void grdOpportunities_Sorting(Object sender, GridViewSortEventArgs e)
    {
    }

    /// <summary>
    /// Pages the index changing.
    /// </summary>
    /// <param name="sender">The sender.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewPageEventArgs"/> instance containing the event data.</param>
    protected void PageIndexChanging(Object sender, GridViewPageEventArgs e)
    {
        if (!Visible) return;

        ((SlxGridView)sender).PageIndex = e.NewPageIndex;
        ((SlxGridView)sender).DataBind();
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

        foreach (Control c in Opportunities_LTools.Controls)
        {
            tinfo.LeftTools.Add(c);
        }
        foreach (Control c in Opportunities_CTools.Controls)
        {
            tinfo.CenterTools.Add(c);
        }
        foreach (Control c in Opportunities_RTools.Controls)
        {
            tinfo.RightTools.Add(c);
        }
        return tinfo;
    }

    #endregion
}
