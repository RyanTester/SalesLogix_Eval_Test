using System;
using System.ComponentModel;
using System.Web.UI;
using System.Web.UI.WebControls;
using Sage.Platform.Application.Services;
using Sage.Platform.Application.UI;
using Sage.Platform.WebPortal.SmartParts;
using Sage.SalesLogix.Web.Controls;
using Sage.SalesLogix.LegacyBridge;
using Sage.Platform.Application;
using Sage.Entity.Interfaces;

public partial class RemoteContactsWhatsNew : UserControl, ISmartPartInfoProvider
{
    private WhatsNewRequest<IContact> _request = null;

    /// <summary>
    /// Gets the search options.
    /// </summary>
    /// <value>The search options.</value>
    /// <returns>
    /// The <see cref="T:System.Web.HttpRequest"/> object associated with the <see cref="T:System.Web.UI.Page"/> that contains the <see cref="T:System.Web.UI.UserControl"/> instance.
    /// </returns>
    private WhatsNewRequest<IContact> WNRequest
    {
        get
        {
            if (_request == null)
                _request = new WhatsNewRequest<IContact>();
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
            WNRequest.ActiveTab = WhatsNewRequest<IContact>.ActiveTabEnum.Contact;
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
                lblContactsTitle.Text = GetLocalResourceObject("ModifiedContacts_Title").ToString();
                divNewContacts.Style.Add(HtmlTextWriterStyle.Display, "none");
                divUpdatedContacts.Style.Add(HtmlTextWriterStyle.Display, "inline");
                divDeletedContacts.Style.Add(HtmlTextWriterStyle.Display, "none");
                WNRequest.SearchOptions.SortExpression = grdUpdatedContacts.SortExpression;
                WNRequest.SearchOptions.SortDirection = (ListSortDirection)grdUpdatedContacts.SortDirection;
                grdUpdatedContacts.DataSource = WNRequest.GetRemoteContactsWhatsNew();
                grdUpdatedContacts.DataBind();
                break;
            case WhatsNewSearchOptions.SearchTypeEnum.Deleted:
                lblContactsTitle.Text = GetLocalResourceObject("DeletedContacts_Title").ToString();
                divNewContacts.Style.Add(HtmlTextWriterStyle.Display, "none");
                divUpdatedContacts.Style.Add(HtmlTextWriterStyle.Display, "none");
                divDeletedContacts.Style.Add(HtmlTextWriterStyle.Display, "inline");
                WNRequest.SearchOptions.SortExpression = grdDeletedContacts.SortExpression;
                WNRequest.SearchOptions.SortDirection = (ListSortDirection)grdDeletedContacts.SortDirection;
                grdDeletedContacts.DataSource = WNRequest.GetRemoteContactsWhatsNew();
                grdDeletedContacts.DataBind();
                break;
            default:
                lblContactsTitle.Text = GetLocalResourceObject("NewContacts_Title").ToString();
                divNewContacts.Style.Add(HtmlTextWriterStyle.Display, "inline");
                divUpdatedContacts.Style.Add(HtmlTextWriterStyle.Display, "none");
                divDeletedContacts.Style.Add(HtmlTextWriterStyle.Display, "none");
                WNRequest.SearchOptions.SortExpression = grdNewContacts.SortExpression;
                WNRequest.SearchOptions.SortDirection = (ListSortDirection)grdNewContacts.SortDirection;
                grdNewContacts.DataSource = WNRequest.GetRemoteContactsWhatsNew();
                grdNewContacts.DataBind();
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
    /// Handles the Sorting event of the grdContacts control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewSortEventArgs"/> instance containing the event data.</param>
    protected void grdContacts_Sorting(Object sender, GridViewSortEventArgs e)
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

        foreach (Control c in Contacts_LTools.Controls)
        {
            tinfo.LeftTools.Add(c);
        }
        foreach (Control c in Contacts_CTools.Controls)
        {
            tinfo.CenterTools.Add(c);
        }
        foreach (Control c in Contacts_RTools.Controls)
        {
            tinfo.RightTools.Add(c);
        }
        return tinfo;
    }

    #endregion
}
