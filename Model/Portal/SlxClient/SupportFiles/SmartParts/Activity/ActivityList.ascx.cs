using System;
using System.Collections.Generic;
using System.Web.UI;
using System.Web.UI.WebControls;
using Sage.Platform.Application;
using Sage.Platform.WebPortal.SmartParts;
using Sage.Entity.Interfaces;
using Sage.Platform.WebPortal.Binding;

public partial class SmartParts_ActivityList : EntityBoundSmartPartInfoProvider
{
    #region Private Class Members

    /// <summary>
    /// Gets or sets the entity service.
    /// </summary>
    /// <value>The entity service.</value>
    [ServiceDependency(Type = typeof (IEntityContextService), Required = true)]
    public IEntityContextService EntityService { get; set; }

    private Sage.Platform.TimeZone _timeZone;
    /// <summary>
    /// Gets or sets the time zone.
    /// </summary>
    /// <value>The time zone.</value>
    [ContextDependency("TimeZone")]
    public Sage.Platform.TimeZone TimeZone
    {
        get { return _timeZone; }
        set { _timeZone = value; }
    }

    private LinkHandler _LinkHandler;
    private LinkHandler Link
    {
        get
        {
            if (_LinkHandler == null)
                _LinkHandler = new LinkHandler(Page);
            return _LinkHandler;
        }
    }

    private WebHqlListBindingSource _hqlBindingSource;
    /// <summary>
    /// Builds the HQL binding source for the activity list.
    /// </summary>
    /// <value>The HQL binding source.</value>
    public WebHqlListBindingSource HqlBindingSource
    {
        get
        {
            if (_hqlBindingSource == null)
            {
                List<HqlSelectField> sel = new List<HqlSelectField>();
                sel.Add(new HqlSelectField("a.id", "ActivityID"));
                sel.Add(new HqlSelectField("a.Type", "Type"));
                sel.Add(new HqlSelectField("a.StartDate", "StartDate"));
                sel.Add(new HqlSelectField("a.Timeless", "Timeless"));
                sel.Add(new HqlSelectField("a.Duration", "Duration"));
                sel.Add(new HqlSelectField("a.UserId", "UserId"));
                sel.Add(new HqlSelectField("a.ContactName", "ContactName"));
                sel.Add(new HqlSelectField("a.Description", "Description"));
                sel.Add(new HqlSelectField("a.Category", "Category"));
                sel.Add(new HqlSelectField("a.OpportunityName", "OpportunityName"));
                sel.Add(new HqlSelectField("a.Notes", "Notes"));
                sel.Add(new HqlSelectField("ui.UserName", "Leader"));
                
                _hqlBindingSource = new WebHqlListBindingSource(sel, "Activity a, UserInfo ui");
            }
            return _hqlBindingSource;
        }
    }
    #endregion

    #region Page Lifetime Events

    protected override void OnWireEventHandlers()
    {
        if (Visible)
        {
            AddMeeting.Click += new ImageClickEventHandler(AddMeeting_Click);
            AddPhoneCall.Click += new ImageClickEventHandler(AddPhoneCall_Click);
            AddToDo.Click += new ImageClickEventHandler(AddToDo_Click);
            ActivityGrid.PageIndexChanging += new GridViewPageEventHandler(ActivityGrid_PageIndexChanging);
            ActivityGrid.Sorting += new GridViewSortEventHandler(ActivityGrid_Sorting);

            base.OnWireEventHandlers();
        }
    }

    void ActivityGrid_Sorting(object sender, GridViewSortEventArgs e)
    {
    }

    protected void Page_PreRender(object sender, EventArgs e)
    {
        if (Visible)
        {
            string entityName = EntityService.GetExtendedEntityAttribute("TableName");
            entityName = entityName.Substring(0, 1).ToUpper() + entityName.Substring(1, entityName.Length - 1).ToLower();
            string entityId = EntityService.EntityID.ToString();
            string keyId = GetKeyId(entityName);

            foreach (DataControlField col in ActivityGrid.Columns)
            {
                if (col is BoundField)
                {
                    if (entityName.Equals("Contact"))
                    {
                        if (((BoundField)(col)).DataField.Equals("ContactName"))
                            col.Visible = false;
                        if (((BoundField)(col)).DataField.Equals("OpportunityName"))
                            col.Visible = true;
                    }
                    if (entityName.Equals("Ticket"))
                    {
                        if (((BoundField)(col)).DataField.Equals("Category"))
                            col.Visible = false;
                        if (((BoundField)(col)).DataField.Equals("ContactName"))
                            col.Visible = false;
                        if (((BoundField)(col)).DataField.Equals("Notes"))
                            col.Visible = true;
                    }
                    if (entityName.Equals("Lead"))
                    {
                        if (((BoundField)(col)).DataField.Equals("ContactName"))
                            col.Visible = false;
                        if (((BoundField)(col)).DataField.Equals("OpportunityName"))
                            col.Visible = false;
                    }
                }
            }

            HqlBindingSource.Where =
                String.Format("a.UserId = ui.id and a.{0} = '{1}' and (a.Type = {2} or a.Type = {3} or a.Type = {4} or a.Type = {5})", keyId, entityId,
                              (int)ActivityType.atAppointment, (int)ActivityType.atPhoneCall, (int)ActivityType.atToDo,
                              (int)ActivityType.atPersonal);
            HqlBindingSource.BoundGrid = ActivityGrid;
            ActivityGrid.DataBind();
        }
    }
    #endregion

    #region Control Event Handlers
    void ActivityGrid_PageIndexChanging(object sender, GridViewPageEventArgs e)
    {
        ActivityGrid.PageIndex = e.NewPageIndex;
    }

    void AddToDo_Click(object sender, ImageClickEventArgs e)
    {
        Link.ScheduleToDo();
    }

    void AddPhoneCall_Click(object sender, ImageClickEventArgs e)
    {
        Link.SchedulePhoneCall();
    }

    void AddMeeting_Click(object sender, ImageClickEventArgs e)
    {
        Link.ScheduleMeeting();
    }

    #endregion

    #region Private Helper Methods
    protected string GetLocalDateTime(object StartDate, object TimeLess)
    {
        if (TimeLess != null)
            if ((bool)TimeLess)
            {
                DateTime startDate = Convert.ToDateTime(StartDate);
                string dateString = startDate.ToShortDateString() + " (" + GetLocalResourceObject("Const_Timeless") + ")";
                return dateString;
            }
        return _timeZone.UTCDateTimeToLocalTime(Convert.ToDateTime(StartDate)).ToString("g");
    }

    protected string GetImage(object activityType)
    {
        const string meetingURL = "images/icons/Meeting_16x16.gif";
        const string phoneURL = "images/icons/Call_16x16.gif";
        const string todoURL = "images/icons/To_Do_16x16.gif";
        const string personalURL = "images/icons/Personal_16x16.gif";

        string imageURL = meetingURL;
        switch (activityType.ToString())
        {
            case "atMeeting":
                imageURL = meetingURL;
                break;
            case "atAppointment":
                imageURL = meetingURL;
                break;
            case "atPhoneCall":
                imageURL = phoneURL;
                break;
            case "atToDo":
                imageURL = todoURL;
                break;
            case "atPersonal":
                imageURL = personalURL;
                break;
            default:
                imageURL = meetingURL;
                break;
        }
        return imageURL;
    }

    protected string GetDuration(object Timeless)
    {
        if (Timeless != null)
        {
            if (!(bool)Timeless)
            {
                return string.Format("{0:d} min", Eval("Duration"));
            }
            else
                return string.Empty;
        }
        return string.Format("{0:d} min", Eval("Duration"));
    }

    protected string GetToolTip(object activityType)
    {

        string toolTip = GetLocalResourceObject("Activity_Meeting_Name").ToString();
        switch (activityType.ToString())
        {
            case "atMeeting":
                toolTip = GetLocalResourceObject("Activity_Meeting_Name").ToString();
                break;
            case "atAppointment":
                toolTip = GetLocalResourceObject("Activity_Meeting_Name").ToString();
                break;
            case "atPhoneCall":
                toolTip = GetLocalResourceObject("Activity_PhoneCall_Name").ToString();
                break;
            case "atToDo":
                toolTip = GetLocalResourceObject("Activity_ToDo_Name").ToString();
                break;
            case "atPersonal":
                toolTip = GetLocalResourceObject("Activity_Personal_Name").ToString();
                break;
            default:
                toolTip = GetLocalResourceObject("Activity_Meeting_Name").ToString();
                break;
        }
        return toolTip;
    }

    protected static string BuildCompleteActivityNavigateURL(object ActivityID)
    {
        return string.Format("javascript:Link.completeActivity('{0}')", ActivityID);
    }

    protected static string BuildActivityNavigateURL(object ActivityID)
    {
        return string.Format("javascript:Link.editActivity('{0}')", ActivityID);
    }

    private static String GetKeyId(String entityName)
    {
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
                break;
        }
        return keyId;
    }

    #endregion

    #region EntityBoundSmartPart

    protected override void OnAddEntityBindings()
    {

    }

    public override Type EntityType
    {
        get { return typeof(Sage.Entity.Interfaces.IActivity); }
    }

    public override Sage.Platform.Application.UI.ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        Sage.Platform.WebPortal.SmartParts.ToolsSmartPartInfo tinfo = new Sage.Platform.WebPortal.SmartParts.ToolsSmartPartInfo();
        if (this.BindingSource != null)
        {
            if (this.BindingSource.Current != null)
            {
                //tinfo.Description = this.BindingSource.Current.ToString();
                //tinfo.Title = this.BindingSource.Current.ToString();
            }
        }
        foreach (Control c in this.ActivityList_LTools.Controls)
        {
            tinfo.LeftTools.Add(c);
        }
        foreach (Control c in this.ActivityList_CTools.Controls)
        {
            tinfo.CenterTools.Add(c);
        }
        foreach (Control c in this.ActivityList_RTools.Controls)
        {
            tinfo.RightTools.Add(c);
        }
        return tinfo;
    }
    #endregion
}