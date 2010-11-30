using System;
using System.Collections.Generic;
using System.Web.UI;
using System.Web.UI.WebControls;
using Sage.Entity.Interfaces;
using Sage.Platform.Application;
using Sage.Platform.Application.UI;
using Sage.Platform.WebPortal.Binding;
using Sage.Platform.WebPortal.SmartParts;
using Sage.SalesLogix.Activity;
using TimeZone = Sage.Platform.TimeZone;

public partial class SmartParts_History_HistoryList : EntityBoundSmartPartInfoProvider
{
    #region Private Class Members

    private TimeZone _timeZone;
    private LinkHandler _LinkHandler;

    /// <summary>
    /// Gets or sets the entity service.
    /// </summary>
    /// <value>The entity service.</value>
    [ServiceDependency(Type = typeof (IEntityContextService), Required = true)]
    public IEntityContextService EntityService { get; set; }

    /// <summary>
    /// Gets or sets the time zone.
    /// </summary>
    /// <value>The time zone.</value>
    [ContextDependency("TimeZone")]
    public TimeZone TimeZone
    {
        get { return _timeZone; }
        set { _timeZone = value; }
    }

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

    #endregion

    /// <summary>
    /// Derived components should override this method to wire up event handlers.
    /// </summary>
    protected override void OnWireEventHandlers()
    {
        CompleteActivity.Click += CompleteActivity_Click;
        HistoryGrid.PageIndexChanging += GridView1_PageIndexChanging;
        HistoryGrid.Sorting += GridView1_Sorting;
        base.OnWireEventHandlers();
    }

    /// <summary>
    /// Handles the Sorting event of the GridView1 control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewSortEventArgs"/> instance containing the event data.</param>
    void GridView1_Sorting(object sender, GridViewSortEventArgs e)
    {
    }

    private WebHqlListBindingSource _hqlBindingSource;
    /// <summary>
    /// Gets the HQL binding source for the history list.
    /// </summary>
    /// <value>The HQL binding source.</value>
    public WebHqlListBindingSource HqlBindingSource
    {
        get
        {
            if (_hqlBindingSource == null)
            {
                List<HqlSelectField> sel = new List<HqlSelectField>();
                sel.Add(new HqlSelectField("h.id", "HistoryId"));
                sel.Add(new HqlSelectField("h.Type", "Type"));
                sel.Add(new HqlSelectField("h.CompletedDate", "CompletedDate"));
                sel.Add(new HqlSelectField("h.Timeless", "Timeless"));
                sel.Add(new HqlSelectField("h.UserId", "UserId"));
                sel.Add(new HqlSelectField("h.ContactName", "ContactName"));
                sel.Add(new HqlSelectField("h.Description", "Description"));
                sel.Add(new HqlSelectField("h.Result", "Result"));
                sel.Add(new HqlSelectField("h.Notes", "Notes"));
                sel.Add(new HqlSelectField("h.Category", "Category"));
                sel.Add(new HqlSelectField("ui.UserName", "User"));
                _hqlBindingSource = new WebHqlListBindingSource(sel, "History h, UserInfo ui");
            }
            return _hqlBindingSource;
        }
    }

    /// <summary>
    /// Called when the smartpart has been bound.  Derived components should override this method to run code that depends on entity context being set and it not changing.
    /// </summary>
    protected override void OnFormBound()
    {
        base.OnFormBound();

        string entityName = EntityService.GetExtendedEntityAttribute("TableName");
        entityName = entityName.Substring(0, 1).ToUpper() + entityName.Substring(1, entityName.Length - 1).ToLower();
        string entityID = EntityService.EntityID.ToString();

        string keyId = "AccountId";
        switch (entityName)
        {
            case "Contact":
                keyId = "ContactId";
                break;
            case "Opportunity":
                keyId = "OpportunityId";
                break;
            case "Ticket":
                keyId = "TicketId";
                break;
            case "Lead":
                keyId = "LeadId";
                BoundField leadField = (BoundField)HistoryGrid.Columns[3];
                if (leadField != null)
                    leadField.Visible = false;
                break;
        }
        
        HqlBindingSource.OrderBy = "h.CompletedDate desc";
        HqlBindingSource.Where = string.Format("h.UserId = ui.id and h.Type != {0} and h.Type != {1} and h.{2} = '{3}'", (int)HistoryType.atNote,
                                               (int) HistoryType.atDatabaseChange, keyId, entityID);
        HqlBindingSource.BoundGrid = HistoryGrid;
        HistoryGrid.DataBind();
    }

    /// <summary>
    /// Handles the PageIndexChanging event of the GridView1 control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewPageEventArgs"/> instance containing the event data.</param>
    void GridView1_PageIndexChanging(object sender, GridViewPageEventArgs e)
    {
        HistoryGrid.PageIndex = e.NewPageIndex;
    }

    /// <summary>
    /// Handles the Click event of the CompleteActivity control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.ImageClickEventArgs"/> instance containing the event data.</param>
    protected void CompleteActivity_Click(object sender, ImageClickEventArgs e)
    {
        Link.ScheduleCompleteActivity();
    }

    /// <summary>
    /// Tries to retrieve smart part information compatible with type
    /// smartPartInfoType.
    /// </summary>
    /// <param name="smartPartInfoType">Type of information to retrieve.</param>
    /// <returns>
    /// The <see cref="T:Sage.Platform.Application.UI.ISmartPartInfo"/> instance or null if none exists in the smart part.
    /// </returns>
    public override ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        ToolsSmartPartInfo tinfo = new ToolsSmartPartInfo();
        foreach (Control c in HistoryList_LTools.Controls)
        {
            tinfo.LeftTools.Add(c);
        }
        foreach (Control c in HistoryList_CTools.Controls)
        {
            tinfo.CenterTools.Add(c);
        }
        foreach (Control c in HistoryList_RTools.Controls)
        {
            tinfo.RightTools.Add(c);
        }
        return tinfo;
    }

    /// <summary>
    /// Gets the local date time.
    /// </summary>
    /// <param name="StartDate">The start date.</param>
    /// <param name="Timeless">The timeless.</param>
    /// <returns></returns>
    protected string GetLocalDateTime(object StartDate, object Timeless)
    {
        if (Convert.ToBoolean(Timeless))
            return Convert.ToDateTime(StartDate).ToShortDateString();
        const string cLocalDateTime = "g";
        return _timeZone.UTCDateTimeToLocalTime(Convert.ToDateTime(StartDate)).ToString(cLocalDateTime);
    }

    protected static string GetImage(object activityType)
    {
        const string meetingURL = "images/icons/Meeting_16x16.gif";

        switch (activityType.ToString())
        {
            case "atMeeting":
                return meetingURL;
            case "atAppointment":
                return meetingURL;
            case "atPhoneCall":
                return "images/icons/Call_16x16.gif";
            case "atToDo":
                return "images/icons/To_Do_16x16.gif";
            case "atPersonal":
                return "images/icons/Personal_16x16.gif";
            case "atDoc":
                return meetingURL;
            default:
                return meetingURL;
        }
    }

    protected string GetToolTip(object activityType)
    {
        switch (activityType.ToString())
        {
            case "atMeeting":
                return GetLocalResourceObject("History_Meeting_Type").ToString();
            case "atAppointment":
                return GetLocalResourceObject("History_Meeting_Type").ToString();
            case "atPhoneCall":
                return GetLocalResourceObject("History_PhoneCall_Type").ToString();
            case "atToDo":
                return GetLocalResourceObject("History_ToDo_Type").ToString();
            case "atPersonal":
                return GetLocalResourceObject("History_Personal_Type").ToString();
            case "atEMail":
                return GetLocalResourceObject("History_Email_Type").ToString();
            case "atDoc":
                return GetLocalResourceObject("History_Document_Type").ToString();
            default:
                return GetLocalResourceObject("History_Meeting_Type").ToString();
        }
    }

    /// <summary>
    /// Gets the history link.
    /// </summary>
    /// <param name="HistoryId">The history id.</param>
    /// <returns></returns>
    protected string GetHistoryLink(object HistoryId)
    {
        return string.Format("javascript:Link.editHistory('{0}');", HistoryId);
    }

    /// <summary>
    /// Override this method to add bindings to the currrently bound smart part
    /// </summary>
    protected override void OnAddEntityBindings()
    {
    }

    /// <summary>
    /// Gets the type of the entity.
    /// </summary>
    /// <value>The type of the entity.</value>
    public override Type EntityType
    {
        get { return typeof(IHistory); }
    }
}
