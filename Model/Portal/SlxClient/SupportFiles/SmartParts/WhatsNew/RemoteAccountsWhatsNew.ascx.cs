using System;
using System.ComponentModel;
using System.Web.UI.WebControls;
using Sage.Entity.Interfaces;
using Sage.Platform.Application.Services;
using Sage.Platform.WebPortal.SmartParts;
using Sage.SalesLogix.Web.Controls;
using Sage.Platform.Application.UI;
using Sage.SalesLogix.LegacyBridge;
using Sage.Platform.Application;
using System.Web.UI;

public partial class RemoteAccountsWhatsNew : UserControl, ISmartPartInfoProvider
{
    private WhatsNewRequest<IAccount> _request = null;

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
    /// Raises the <see cref="E:System.Web.UI.Control.PreRender"/> event.
    /// </summary>
    /// <param name="e">An <see cref="T:System.EventArgs"/> object that contains the event data.</param>
    protected override void OnPreRender(EventArgs e)
    {
        if (Visible)
        {
            DateTime searchDate = DateTime.UtcNow;
            WhatsNewSearchOptions.SearchTypeEnum searchTypeEnum = WhatsNewSearchOptions.SearchTypeEnum.New;
            IUserOptionsService userOpts = ApplicationContext.Current.Services.Get<IUserOptionsService>();
            if (userOpts != null)
            {
                try
                {
                    string searchType;
                    searchDate =
                        DateTime.Parse(userOpts.GetCommonOption("LastWebUpdate", "Web", false, searchDate.ToString(),
                                                                "LastWebUpdate"));
                    searchType = userOpts.GetCommonOption("WhatsNewSearchType", "Web", false,
                                                          WhatsNewSearchOptions.SearchTypeEnum.New.ToString(),
                                                          "WhatsNewSearchType");
                    if (Enum.IsDefined(typeof(WhatsNewSearchOptions.SearchTypeEnum), searchType))
                        searchTypeEnum =
                            (WhatsNewSearchOptions.SearchTypeEnum)
                            Enum.Parse(typeof(WhatsNewSearchOptions.SearchTypeEnum), searchType, true);
                }
                catch
                {
                }
            }
            WNRequest.SearchOptions.SearchDate = searchDate;
            WNRequest.SearchOptions.SearchType = searchTypeEnum;
            WNRequest.ActiveTab = WhatsNewRequest<IAccount>.ActiveTabEnum.Account;
            SetActiveGridDisplay(searchTypeEnum);
        }
    }

    /// <summary>
    /// Sets the active grid display.
    /// </summary>
    /// <param name="searchType">Type of the search.</param>
    private void SetActiveGridDisplay(WhatsNewSearchOptions.SearchTypeEnum searchType)
    {
        switch (searchType)
        {
            case WhatsNewSearchOptions.SearchTypeEnum.Updated:
                lblTitle.Text = GetLocalResourceObject("ModifiedAccounts_Title").ToString();
                divNewAccounts.Style.Add(HtmlTextWriterStyle.Display, "none");
                divUpdatedAccounts.Style.Add(HtmlTextWriterStyle.Display, "inline");
                divDeletedAccounts.Style.Add(HtmlTextWriterStyle.Display, "none");
                WNRequest.SearchOptions.SortExpression = grdUpdatedAccounts.SortExpression;
                WNRequest.SearchOptions.SortDirection = (ListSortDirection)grdUpdatedAccounts.SortDirection;
                grdUpdatedAccounts.DataSource = WNRequest.GetRemoteAccountsWhatsNew();
                grdUpdatedAccounts.DataBind();
                break;
            case WhatsNewSearchOptions.SearchTypeEnum.Deleted:
                lblTitle.Text = GetLocalResourceObject("DeletedAccounts_Title").ToString();
                divNewAccounts.Style.Add(HtmlTextWriterStyle.Display, "none");
                divUpdatedAccounts.Style.Add(HtmlTextWriterStyle.Display, "none");
                divDeletedAccounts.Style.Add(HtmlTextWriterStyle.Display, "inline");
                WNRequest.SearchOptions.SortExpression = grdDeletedAccounts.SortExpression;
                WNRequest.SearchOptions.SortDirection = (ListSortDirection)grdDeletedAccounts.SortDirection;
                grdDeletedAccounts.DataSource = WNRequest.GetRemoteAccountsWhatsNew();
                grdDeletedAccounts.DataBind();
                break;
            default:
                lblTitle.Text = GetLocalResourceObject("NewAccounts_Title").ToString();
                divNewAccounts.Style.Add(HtmlTextWriterStyle.Display, "inline");
                divUpdatedAccounts.Style.Add(HtmlTextWriterStyle.Display, "none");
                divDeletedAccounts.Style.Add(HtmlTextWriterStyle.Display, "none");
                WNRequest.SearchOptions.SortExpression = grdNewAccounts.SortExpression;
                WNRequest.SearchOptions.SortDirection = (ListSortDirection)grdNewAccounts.SortDirection;
                grdNewAccounts.DataSource = WNRequest.GetRemoteAccountsWhatsNew();
                grdNewAccounts.DataBind();
                break;
        }
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

    /// <summary>
    /// Handles the Sorting event of the grdAccounts control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewSortEventArgs"/> instance containing the event data.</param>
    protected void grdAccounts_Sorting(Object sender, GridViewSortEventArgs e)
    {
    }

    /// <summary>
    /// Handles the RowDataBound event of the grdAccounts control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewRowEventArgs"/> instance containing the event data.</param>
    protected void grdAccounts_RowDataBound(object sender, GridViewRowEventArgs e)
    {
        if (e.Row.RowType == DataControlRowType.DataRow)
        {
            WhatsNewRequest<IAccount>.AccountWhatsNewInfo whatsNewInfo = (WhatsNewRequest<IAccount>.AccountWhatsNewInfo)e.Row.DataItem;
            if (e.Row.Cells[1].Controls.Count > 0)
            {
                LinkButton editTask = (LinkButton) e.Row.Cells[1].Controls[0];
                if (editTask != null)
                {
                    String[] status = whatsNewInfo.AccountId.Split(':');
                    if (status[1].Equals("S"))
                        editTask.Text = GetLocalResourceObject("grdAccounts_Subscribe_Text").ToString();
                    else if (status[1].Equals("U"))
                        editTask.Text = GetLocalResourceObject("grdAccounts_UnSubscribe_Text").ToString();
                    else if (status[1].Equals("F"))
                        editTask.Enabled = false;
                }
            }
        }
    }

    /// <summary>
    /// Handles the RowCommand event of the grdNewAccounts control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewCommandEventArgs"/> instance containing the event data.</param>
    protected void grdNewAccounts_RowCommand(object sender, GridViewCommandEventArgs e)
    {
        if (e.CommandName.Equals("Subscribe"))
        {
            string id = grdNewAccounts.DataKeys[Convert.ToInt32(e.CommandArgument)].Value.ToString();
            DoSubscriptionRules(id);
        }
    }

    /// <summary>
    /// Handles the RowCommand event of the grdUpdatedAccounts control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewCommandEventArgs"/> instance containing the event data.</param>
    protected void grdUpdatedAccounts_RowCommand(object sender, GridViewCommandEventArgs e)
    {
        if (e.CommandName.Equals("Subscribe"))
        {
            string id = grdUpdatedAccounts.DataKeys[Convert.ToInt32(e.CommandArgument)].Value.ToString();
            DoSubscriptionRules(id);
        }
    }

    private void DoSubscriptionRules(String accountId)
    {
        if (!String.IsNullOrEmpty(accountId))
        {
            String[] status = accountId.Split(':');
            if (status[1].Equals("S"))
                WNRequest.Subscribe(status[0]);
            else if (status[1].Equals("U"))
            {
                if (WNRequest.IsForcedAccount(status[0]))
                    throw new ValidationException(GetLocalResourceObject("error_ForcedAccount_Message").ToString());
                WNRequest.UnSubscribe(status[0]);
            }
        }
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

        foreach (Control c in Accounts_LTools.Controls)
        {
            tinfo.LeftTools.Add(c);
        }
        foreach (Control c in Accounts_CTools.Controls)
        {
            tinfo.CenterTools.Add(c);
        }
        foreach (Control c in Accounts_RTools.Controls)
        {
            tinfo.RightTools.Add(c);
        }
        return tinfo;
    }

    #endregion
}
