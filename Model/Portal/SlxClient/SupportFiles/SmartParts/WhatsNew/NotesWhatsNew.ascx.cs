using System;
using System.ComponentModel;
using System.Web.UI;
using System.Web.UI.WebControls;
using Sage.Entity.Interfaces;
using Sage.Platform;
using Sage.Platform.Application;
using Sage.Platform.Application.Services;
using Sage.Platform.Application.UI;
using Sage.Platform.WebPortal.SmartParts;
using Sage.SalesLogix.LegacyBridge;

public partial class SmartParts_NotWhatsNew_NotWhatsNew : UserControl, ISmartPartInfoProvider
{
    private bool _NewNotesLastPageIndex = false;
    private bool _ModifiedNotesLastPageIndex = false;
    private WhatsNewRequest<IHistory> _request = null;
    private WhatsNewSearchOptions _searchOptions = null;

    /// <summary>
    /// Gets the search options.
    /// </summary>
    /// <value>The search options.</value>
    /// <returns>
    /// The <see cref="T:System.Web.HttpRequest"/> object associated with the <see cref="T:System.Web.UI.Page"/> that contains the <see cref="T:System.Web.UI.UserControl"/> instance.
    /// </returns>
    private WhatsNewRequest<IHistory> WNRequest
    {
        get
        {
            if (_request == null)
                _request = new WhatsNewRequest<IHistory>();
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

        SearchOptions.NotesOnly = true;
        SearchOptions.SearchDate = fromDate;

        //New History
        SearchOptions.SearchType = WhatsNewSearchOptions.SearchTypeEnum.New;
        if (!String.IsNullOrEmpty(grdNewNotes.SortExpression))
        {
            SearchOptions.OrderBy = grdNewNotes.SortExpression;
            SearchOptions.SortDirection =
                (grdNewNotes.CurrentSortDirection.Equals("Ascending", StringComparison.CurrentCultureIgnoreCase))
                    ? ListSortDirection.Ascending
                    : ListSortDirection.Descending;
        }
        WNRequest.SearchOptions = SearchOptions;
        grdNewNotes.DataSource = NotesNewObjectDataSource;
        grdNewNotes.DataBind();

        //Modified History
        SearchOptions.SearchType = WhatsNewSearchOptions.SearchTypeEnum.Updated;
        if (!String.IsNullOrEmpty(grdModifiedNotes.SortExpression))
        {
            SearchOptions.OrderBy = grdModifiedNotes.SortExpression;
            SearchOptions.SortDirection =
                (grdModifiedNotes.CurrentSortDirection.Equals("Ascending", StringComparison.CurrentCultureIgnoreCase))
                    ? ListSortDirection.Ascending
                    : ListSortDirection.Descending;
        }
        else
        {
            SearchOptions.OrderBy = "ModifyDate";
            SearchOptions.SortDirection = ListSortDirection.Ascending;
        }
        WNRequest.SearchOptions = SearchOptions;
        grdModifiedNotes.DataSource = NotesModifiedObjectDataSource;
        grdModifiedNotes.DataBind();

        base.OnPreRender(e);
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
                return "Meeting";
            case "atPhoneCall":
                return "Phone Call";
            case "atToDo":
                return "To-Do";
            case "atPersonal":
                return "Personal Activity";
            default:
                return "Meeting";
        }
    }

    /// <summary>
    /// Gets the activity link.
    /// </summary>
    /// <param name="Id">The id.</param>
    /// <returns></returns>
    protected string GetActivityLink(object Id)
    {
        return string.Format("javascript:Link.editHistory('{0}');", Id);
    }

    /// <summary>
    /// Gets the type of the entity.
    /// </summary>
    /// <param name="contactId">The contact id.</param>
    /// <returns></returns>
    protected string GetEntityType(object contactId)
    {
        if (contactId != null)
            return "Contact";
        return "Lead";
    }

    /// <summary>
    /// Determines whether [is blank or null] [the specified id].
    /// </summary>
    /// <param name="Id">The id.</param>
    /// <returns>
    /// 	<c>true</c> if [is blank or null] [the specified id]; otherwise, <c>false</c>.
    /// </returns>
    protected bool IsBlankOrNull(object Id)
    {
        return (Id == null) || (Id.ToString().Trim() == String.Empty);
    }

    /// <summary>
    /// Gets the type.
    /// </summary>
    /// <param name="Id">The id.</param>
    /// <returns></returns>
    protected string GetType(object Id)
    {
        IHistory hist = EntityFactory.GetById<IHistory>(Id.ToString());
        if (hist == null)
            return "";
        if (IsBlankOrNull(hist.LeadId))
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
    /// Handles the PageIndexChanging event of the grdNewNotes control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewPageEventArgs"/> instance containing the event data.</param>
    protected void grdNewNotes_PageIndexChanging(Object sender, GridViewPageEventArgs e)
    {
        if (!Visible) return;

        int pageIndex = e.NewPageIndex;
        // if viewstate is off in the GridView then we need to calculate PageCount ourselves
        if (pageIndex > 10000)
        {
            _NewNotesLastPageIndex = true;
            grdNewNotes.PageIndex = 0;
        }
        else
        {
            _NewNotesLastPageIndex = false;
            grdNewNotes.PageIndex = pageIndex;
        }
    }

    /// <summary>
    /// Handles the PageIndexChanging event of the grdModifiedNotes control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewPageEventArgs"/> instance containing the event data.</param>
    protected void grdModifiedNotes_PageIndexChanging(Object sender, GridViewPageEventArgs e)
    {
        int pageIndex = e.NewPageIndex;
        // if viewstate is off in the GridView then we need to calculate PageCount ourselves
        if (pageIndex > 10000)
        {
            _ModifiedNotesLastPageIndex = true;
            grdModifiedNotes.PageIndex = 0;
        }
        else
        {
            _ModifiedNotesLastPageIndex = false;
            grdModifiedNotes.PageIndex = pageIndex;
        }
    }

    /// <summary>
    /// Creates the notes whats new data source.
    /// </summary>
    /// <param name="sender">The sender.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.ObjectDataSourceEventArgs"/> instance containing the event data.</param>
    protected void CreateNotesWhatsNewDataSource(object sender, ObjectDataSourceEventArgs e)
    {
        if (_NewNotesLastPageIndex)
        {
            int pageIndex = 0;
            int recordCount = WNRequest.GetRecordCount();
            int pageSize = grdNewNotes.PageSize;
            decimal numberOfPages = recordCount / pageSize;
            pageIndex = Convert.ToInt32(Math.Ceiling(numberOfPages));
            grdNewNotes.PageIndex = pageIndex;
        }
        e.ObjectInstance = WNRequest;
    }

    /// <summary>
    /// Creates the notes whats modified data source.
    /// </summary>
    /// <param name="sender">The sender.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.ObjectDataSourceEventArgs"/> instance containing the event data.</param>
    protected void CreateNotesWhatsModifiedDataSource(object sender, ObjectDataSourceEventArgs e)
    {
        if (_ModifiedNotesLastPageIndex)
        {
            int pageIndex = 0;
            int recordCount = WNRequest.GetRecordCount();
            int pageSize = grdModifiedNotes.PageSize;
            decimal numberOfPages = recordCount / pageSize;
            pageIndex = Convert.ToInt32(Math.Ceiling(numberOfPages));
            grdModifiedNotes.PageIndex = pageIndex;
        }
        e.ObjectInstance = WNRequest;
    }

    /// <summary>
    /// Disposes the notes whats new data source.
    /// </summary>
    /// <param name="sender">The sender.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.ObjectDataSourceDisposingEventArgs"/> instance containing the event data.</param>
    protected void DisposeNotesWhatsNewDataSource(object sender, ObjectDataSourceDisposingEventArgs e)
    {
        // Get the instance of the business object that the ObjectDataSource is working with.
        WhatsNewRequest<IHistory> dataSource = e.ObjectInstance as WhatsNewRequest<IHistory>;

        // Cancel the event, so that the object will not be Disposed if it implements IDisposable.
        e.Cancel = true;
    }

    protected void Sorting(Object sender, GridViewSortEventArgs e)
    { }

    #region ISmartPartInfoProvider Members

	public ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
	{
		ToolsSmartPartInfo tinfo = new ToolsSmartPartInfo();

        Label lbl = new Label();
        lbl.Text = GetLocalResourceObject("Notes_Caption").ToString();

        tinfo.LeftTools.Add(lbl);
        tinfo.ImagePath = Page.ResolveClientUrl("~/images/icons/Note_24x24.gif");

        return tinfo;
    }

    #endregion

}

