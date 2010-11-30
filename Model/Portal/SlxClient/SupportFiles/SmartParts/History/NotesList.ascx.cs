using System;
using System.Collections.Generic;
using System.Web.UI;
using System.Web.UI.WebControls;
using Sage.Entity.Interfaces;
using Sage.Platform.Application;
using Sage.Platform.WebPortal.Binding;
using Sage.Platform.WebPortal.SmartParts;
using Sage.Platform.Application.UI;

public partial class SmartParts_History_NotesList : EntityBoundSmartPartInfoProvider
{
    /// <summary>
    /// Gets or sets the entity service.
    /// </summary>
    /// <value>The entity service.</value>
    [ServiceDependency(Type = typeof (IEntityContextService), Required = true)]
    public IEntityContextService EntityService { get; set; }

    private LinkHandler _LinkHandler;
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
                sel.Add(new HqlSelectField("id", "HistoryId"));
                sel.Add(new HqlSelectField("Description", "Description"));
                _hqlBindingSource = new WebHqlListBindingSource(sel, "History");
            }
            return _hqlBindingSource;
        }
    }

    /// <summary>
    /// Called when [wire event handlers].
    /// </summary>
    protected override void OnWireEventHandlers()
    {
        AddNote.Click += new ImageClickEventHandler(AddNote_ClickAction);
        grdNotes.PageIndexChanging += new GridViewPageEventHandler(grdNotes_PageIndexChanging);
        base.OnWireEventHandlers();
    }

    /// <summary>
    /// Called when [form bound].
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
                break;
        }

        HqlBindingSource.Where = string.Format("Type = {0} and {1} = '{2}'", (int)HistoryType.atNote, keyId, entityID);
        HqlBindingSource.OrderBy = "CompletedDate desc";
        HqlBindingSource.BoundGrid = grdNotes;
        grdNotes.DataBind();
    }

    /// <summary>
    /// Handles the PageIndexChanging event of the grdNotes control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewPageEventArgs"/> instance containing the event data.</param>
    void grdNotes_PageIndexChanging(object sender, GridViewPageEventArgs e)
    {
        grdNotes.PageIndex = e.NewPageIndex;
    }

    /// <summary>
    /// Gets the history link.
    /// </summary>
    /// <param name="HistoryId">The history id.</param>
    /// <returns></returns>
    protected static string GetHistoryLink(object HistoryId)
    {
        return string.Format("javascript:Link.editHistory('{0}');", HistoryId);
    }

    /// <summary>
    /// Gets the history description.
    /// </summary>
    /// <param name="Description">The description.</param>
    /// <returns></returns>
    protected string GetHistoryDescription(object Description)
    {
        return GetLocalResourceObject("grdNotes.Notes.PreText").ToString() + Description;
    }

    /// <summary>
    /// Gets the smart part info.
    /// </summary>
    /// <param name="smartPartInfoType">Type of the smart part info.</param>
    /// <returns></returns>
    public override ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        ToolsSmartPartInfo tinfo = new ToolsSmartPartInfo();
        foreach (Control c in NotesList_LTools.Controls)
        {
            tinfo.LeftTools.Add(c);
        }
        foreach (Control c in NotesList_CTools.Controls)
        {
            tinfo.CenterTools.Add(c);
        }
        foreach (Control c in NotesList_RTools.Controls)
        {
            tinfo.RightTools.Add(c);
        }
        return tinfo;
    }

    /// <summary>
    /// Handles the ClickAction event of the AddNote control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void AddNote_ClickAction(object sender, EventArgs e)
    {
        Dictionary<string, string> args = new Dictionary<string, string>();
        if (EntityService.EntityType == typeof(ILead))
            args.Add("leadid", EntityService.EntityID.ToString());
        Link.NewNote(args);
    }

    /// <summary>
    /// Called when [add entity bindings].
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