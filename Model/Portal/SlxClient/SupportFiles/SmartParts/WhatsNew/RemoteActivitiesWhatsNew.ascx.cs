using System;
using System.ComponentModel;
using System.Globalization;
using System.Web.UI;
using System.Web.UI.WebControls;
using Sage.Entity.Interfaces;
using Sage.Platform;
using Sage.Platform.Application;
using Sage.Platform.Application.Services;
using Sage.Platform.Application.UI;
using Sage.Platform.WebPortal.SmartParts;
using Sage.SalesLogix.LegacyBridge;
using Sage.SalesLogix.Web.Controls;

public partial class RemoteActivitiesWhatsNew : UserControl, ISmartPartInfoProvider
{
    private WhatsNewRequest<IActivity> _request = null;

    /// <summary>
    /// Gets the search options.
    /// </summary>
    /// <value>The search options.</value>
    /// <returns>
    /// The <see cref="T:System.Web.HttpRequest"/> object associated with the <see cref="T:System.Web.UI.Page"/> that contains the <see cref="T:System.Web.UI.UserControl"/> instance.
    /// </returns>
    private WhatsNewRequest<IActivity> WNRequest
    {
        get
        {
            if (_request == null)
                _request = new WhatsNewRequest<IActivity>();
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
            WNRequest.ActiveTab = WhatsNewRequest<IActivity>.ActiveTabEnum.Activity;
            SetActiveGridDisplay(searchTypeEnum, WNRequest);
        }
    }

    /// <summary>
    /// Sets the active grid display.
    /// </summary>
    /// <param name="searchType">Type of the search.</param>
    /// <param name="whatsNewRequest">The whats new request.</param>
    private void SetActiveGridDisplay(WhatsNewSearchOptions.SearchTypeEnum searchType, WhatsNewRequest<IActivity> whatsNewRequest)
    {
        switch (searchType)
        {
            case WhatsNewSearchOptions.SearchTypeEnum.Updated:
                lblActiviesTitle.Text = GetLocalResourceObject("ModifiedAccounts_Title").ToString();
                divNewActivities.Style.Add(HtmlTextWriterStyle.Display, "none");
                divUpdatedActivities.Style.Add(HtmlTextWriterStyle.Display, "inline");
                WNRequest.SearchOptions.SortExpression = grdUpdatedActivities.SortExpression;
                WNRequest.SearchOptions.SortDirection = (ListSortDirection)grdUpdatedActivities.SortDirection;
                grdUpdatedActivities.DataSource = whatsNewRequest.GetRemoteActivitiesWhatsNew();
                grdUpdatedActivities.DataBind();
                break;
            default:
                lblActiviesTitle.Text = GetLocalResourceObject("NewActivities_Title").ToString();
                divNewActivities.Style.Add(HtmlTextWriterStyle.Display, "inline");
                divUpdatedActivities.Style.Add(HtmlTextWriterStyle.Display, "none");
                WNRequest.SearchOptions.SortExpression = grdNewActivities.SortExpression;
                WNRequest.SearchOptions.SortDirection = (ListSortDirection)grdNewActivities.SortDirection;
                grdNewActivities.DataSource = whatsNewRequest.GetRemoteActivitiesWhatsNew();
                grdNewActivities.DataBind();
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
    /// Handles the Sorting event of the grdActivities control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewSortEventArgs"/> instance containing the event data.</param>
    protected void grdActivities_Sorting(Object sender, GridViewSortEventArgs e)
    {
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
        const string noteURL = "~/images/icons/Note_16x16.gif";

        switch ((ActivityType)Enum.Parse(typeof(ActivityType), type.ToString()))
        {
            case ActivityType.atAppointment:
                return meetingURL;
            case ActivityType.atPhoneCall:
                return phoneURL;
            case ActivityType.atToDo:
                return todoURL;
            case ActivityType.atPersonal:
                return personalURL;
            case ActivityType.atNote:
                return noteURL;
            default:
                return meetingURL;
        }
    }

    /// <summary>
    /// Gets the alt.
    /// </summary>
    /// <param name="type">The type.</param>
    /// <returns></returns>
    protected string GetAlternateText(object type)
    {
        switch ((ActivityType)Enum.Parse(typeof(ActivityType), type.ToString()))
        {
            case ActivityType.atAppointment:
                return GetLocalResourceObject("ActivityType_Meeting").ToString();
            case ActivityType.atPhoneCall:
                return GetLocalResourceObject("ActivityType_PhoneCall").ToString();
            case ActivityType.atToDo:
                return GetLocalResourceObject("ActivityType_ToDo").ToString(); 
            case ActivityType.atPersonal:
                return GetLocalResourceObject("ActivityType_Personal").ToString();
            case ActivityType.atNote:
                return GetLocalResourceObject("ActivityType_Note").ToString();
            default:
                return String.Empty;
        }
    }

    /// <summary>
    /// Gets the activity link.
    /// </summary>
    /// <param name="ActivityID">The activity ID.</param>
    /// <returns></returns>
    protected string GetActivityLink(object ActivityID)
    {
        IActivity activity = EntityFactory.GetById<IActivity>(ActivityID.ToString());
        if (activity != null)
            return String.Format("WhatsNew_EditActivity('{0}', '{1}')", activity.Id,
                                 activity.StartDate.ToString(CultureInfo.InvariantCulture));
        return String.Empty;
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

        foreach (Control c in Activities_LTools.Controls)
        {
            tinfo.LeftTools.Add(c);
        }
        foreach (Control c in Activities_CTools.Controls)
        {
            tinfo.CenterTools.Add(c);
        }
        foreach (Control c in Activities_RTools.Controls)
        {
            tinfo.RightTools.Add(c);
        }
        return tinfo;
    }

    #endregion
}
