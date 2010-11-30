using System;
using System.Data;
using System.Web.UI;
using System.Web.UI.WebControls;
using Sage.Platform.WebPortal.SmartParts;
using Sage.Platform.Application.UI;
using Sage.Entity.Interfaces;
using Sage.SalesLogix.Campaign;
using System.Text;
using System.Collections;
using Sage.Platform;
using Sage.Platform.Repository;
using log4net;
using System.Collections.Generic;
using Sage.SalesLogix.PickLists;
using Sage.Platform.Application;

/// <summary>
/// Summary description for TargetResponses
/// </summary>
public partial class TargetResponses : EntityBoundSmartPartInfoProvider
{
    #region properties

    private int _grdResponseDeleteColIndex = -2;
    private IContextService _Context;
    private ResponseFilterStateInfo _State;
    

    #endregion

    #region public methods

    /// <summary>
    /// Gets or sets the entity context.
    /// </summary>
    /// <value>The entity context.</value>
    /// <returns>The specified <see cref="T:System.Web.HttpContext"></see> object associated with the current request.</returns>
    [ServiceDependency]
    public IContextService ContextService
    {
        set
        {
            _Context = ApplicationContext.Current.Services.Get<IContextService>();
        }
        get
        {
            return _Context;
        }
    }

    /// <summary>
    /// Gets the type of the entity.
    /// </summary>
    /// <value>The type of the entity.</value>
    public override Type EntityType
    {
        get { return typeof(ICampaign); }
    }

    /// <summary>
    /// Gets the smart part info.
    /// </summary>
    /// <param name="smartPartInfoType">Type of the smart part info.</param>
    /// <returns></returns>
    public override ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        ToolsSmartPartInfo tinfo = new ToolsSmartPartInfo();
        if (BindingSource != null)
        {
            if (BindingSource.Current != null)
            {
                tinfo.Description = BindingSource.Current.ToString();
                tinfo.Title = BindingSource.Current.ToString();
            }
        }

        foreach (Control c in Controls)
        {
            SmartPartToolsContainer cont = c as SmartPartToolsContainer;
            if (cont != null)
            {
                switch (cont.ToolbarLocation)
                {
                    case SmartPartToolsLocation.Right:
                        foreach (Control tool in cont.Controls)
                        {
                            tinfo.RightTools.Add(tool);
                        }
                        break;
                    case SmartPartToolsLocation.Center:
                        foreach (Control tool in cont.Controls)
                        {
                            tinfo.CenterTools.Add(tool);
                        }
                        break;
                    case SmartPartToolsLocation.Left:
                        foreach (Control tool in cont.Controls)
                        {
                            tinfo.LeftTools.Add(tool);
                        }
                        break;
                }
            }
        }
        return tinfo;
    }

    #endregion

    /// <summary>
    /// 
    /// </summary>
    public class ResponseFilterStateInfo
    {
        public bool showContacts = true;
        public bool showLeads = true;
        public int leadSourceFilter = 0;
        public int methodFilter = 0;
        public int stageFilter = 0;
        public bool formOpen;
        public string nameFilter = String.Empty;
    }

    #region private methods

    /// <summary>
    /// Called when [add entity bindings].
    /// </summary>
    protected override void OnAddEntityBindings()
    {
    }

    /// <summary>
    /// Called when [wire event handlers].
    /// </summary>
    protected override void OnWireEventHandlers()
    {
        if (ScriptManager.GetCurrent(Page) != null)
        {
            AddResponse.Click += new ImageClickEventHandler(AddResponse_Click);
            cmdReset.Attributes.Add("onclick", "return false;");
            tr_lnkFilters.Attributes.Add("onclick", "return false;");
        }
        base.OnWireEventHandlers();
    }

    /// <summary>
    /// Handles the Init event of the Page control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void Page_Init(object sender, EventArgs e)
    {
        ScriptManager.GetCurrent(Page).Scripts.Add(new ScriptReference("~/SmartParts/Campaign/TargetResponses_ClientScript.js"));
        if (ContextService != null)
        {
            _State = ContextService.GetContext("ResponseFilterStateInfo") as ResponseFilterStateInfo;
            if (_State == null)
            {
                _State = new ResponseFilterStateInfo();
                AssignLeadSourceList();
                PopulateResponseMethods();
                AddDistinctStageItemsToList();
            }
            else
            {
                lbxLeadSource.SelectedIndex = _State.leadSourceFilter;
                lbxMethods.SelectedIndex = _State.methodFilter;
                lbxStage.SelectedIndex = _State.stageFilter;
                txtName.Text = _State.nameFilter;
            }
        }
    }

    /// <summary>
    /// Registers the client script.
    /// </summary>
    private void RegisterClientScript()
    {
        StringBuilder sb = new StringBuilder(GetLocalResourceObject("TargetResponses_ClientScript").ToString());
        sb.Replace("@chkShowContacts", chkContacts.ClientID);
        sb.Replace("@chkShowLeads", chkLeads.ClientID);
        sb.Replace("@chkLeadSource", chkLeadSource.ClientID);
        sb.Replace("@lbxLeadSource", lbxLeadSource.ClientID);
        sb.Replace("@chkMethod", chkMethod.ClientID);
        sb.Replace("@lbxMethod", lbxMethods.ClientID);
        sb.Replace("@chkStage", chkStage.ClientID);
        sb.Replace("@lbxStage", lbxStage.ClientID);
        sb.Replace("@chkName", chkName.ClientID);
        sb.Replace("@txtName", txtName.ClientID);
        sb.Replace("@tr_txtShowFilterId", tr_txtShowFilter.ClientID);
        sb.Replace("@tr_filterDivId", tr_filterDiv.ClientID);
        sb.Replace("@tr_lnkFiltersId", tr_lnkFilters.ClientID);
        sb.Replace("@tr_lnkHideFilters", GetLocalResourceObject("lnkHideFilters.Text").ToString());
        sb.Replace("@tr_lnkShowFilters", GetLocalResourceObject("lnkShowFilters.Text").ToString());
        ScriptManager.RegisterStartupScript(Page, GetType(), "ResponseScript", sb.ToString(), false);
    }

    /// <summary>
    /// Called when [form bound].
    /// </summary>
    protected override void OnFormBound()
    {
        if (tr_txtShowFilter.Value.Equals("true"))
            tr_filterDiv.Style.Add(HtmlTextWriterStyle.Display, "inline");
        else
            tr_filterDiv.Style.Add(HtmlTextWriterStyle.Display, "none");

        chkDisplayResults.Checked = Helpers.ShowResponsesOnOpen();

        if (chkDisplayResults.Checked && !_State.formOpen)
            ExecuteFilter();
        else if (_State.formOpen)
            ExecuteFilter();
        grdResponses.DataBind();

        _State.formOpen = true;
        ContextService.SetContext("ResponseFilterStateInfo", _State);
    }

    /// <summary>
    /// Called when [register client scripts].
    /// </summary>
    protected override void OnRegisterClientScripts()
    {
        base.OnRegisterClientScripts();
        RegisterClientScript();
    }

    /// <summary>
    /// Assigns the lead source list.
    /// </summary>
    private void AssignLeadSourceList()
    {
        lbxLeadSource.Items.Clear();
        lbxLeadSource.Items.Add(String.Empty);
        IList<ILeadSource> leadSources = EntityFactory.GetRepository<ILeadSource>().FindAll();
        if (leadSources != null)
        {
            foreach (ILeadSource leadSource in leadSources)
            {
                if (leadSource.Description != null)
                {
                    ListItem item = new ListItem();
                    item.Text = leadSource.Description;
                    lbxLeadSource.Items.Add(item);
                }
            }
        }
    }

    /// <summary>
    /// Gets and populates the ResponseMethods.
    /// </summary>
    private void PopulateResponseMethods()
    {
        lbxMethods.Items.Clear();
        string picklistId = PickList.PickListIdFromName("Response Method");
        lbxMethods.Items.Add(String.Empty);
        if (!String.IsNullOrEmpty(picklistId))
        {
            IList<PickList> items = PickList.GetPickListItems(picklistId, true);
            if (items != null)
            {
                ListItem item;
                foreach (PickList picklistItem in items)
                {
                    item = new ListItem();
                    item.Text = picklistItem.Text;
                    item.Value = picklistItem.ItemId;
                    lbxMethods.Items.Add(item);
                }
            }
        }
    }

    /// <summary>
    /// Adds the distinct CampaignStage stage names to list.
    /// </summary>
    private void AddDistinctStageItemsToList()
    {
        lbxStage.Items.Clear();
        lbxStage.Items.Add(String.Empty);

        IRepository<ICampaignStage> rep = EntityFactory.GetRepository<ICampaignStage>();
        IQueryable query = (IQueryable)rep;
        IExpressionFactory expressions = query.GetExpressionFactory();
        IProjections projections = query.GetProjectionsFactory();
        ICriteria criteria = query.CreateCriteria()
            .SetProjection(projections.Distinct(projections.Property("Description")))
                .Add(expressions
                    .And(expressions.Eq("Campaign.Id", EntityContext.EntityID), expressions.IsNotNull("Description")))
                    .SetCacheable(true);

        IList<object> stages = criteria.List<object>();
        if (stages != null)
        {
            ListItem item;
            foreach (string stage in stages)
            {
                if (!String.IsNullOrEmpty(stage))
                {
                    item = new ListItem();
                    item.Text = stage;
                    lbxStage.Items.Add(item);
                }
            }
        }
    }

    /// <summary>
    /// Executes the filter.
    /// </summary>
    private void ExecuteFilter()
    {
        if (EntityContext != null)
        {
            DataTable dataTable = GetDataGridLayout();
            if (chkContacts.Checked)
                dataTable = AssignListToDataTable(dataTable, GetContactTargets());
            if (chkLeads.Checked)
                dataTable = AssignListToDataTable(dataTable, GetLeadTargets());
            grdResponses.DataSource = dataTable;

            if (dataTable != null)
            {
                int pageIndex = grdResponses.PageIndex;
                int pageSize = grdResponses.PageSize;
                int firstRcd = (pageIndex * pageSize) + 1;
                int lastRcd = (pageIndex + 1) * pageSize;
                int totalRcdCount = dataTable.Rows.Count;
                if (lastRcd > totalRcdCount)
                    lastRcd = totalRcdCount;

                tr_lblSearchCount.Text = String.Format(GetLocalResourceObject("lblSearchCount.Caption").ToString(), firstRcd, lastRcd, totalRcdCount);
            }
        }
        else
        {
            log.Error(GetLocalResourceObject("error_EntityContext").ToString());
        }
    }

    /// <summary>
    /// Assigns the list of targets to the data table.
    /// </summary>
    /// <param name="dt">The dt.</param>
    /// <param name="list">The list.</param>
    /// <returns></returns>
    private DataTable AssignListToDataTable(DataTable dt, IList list)
    {
        if (list != null)
        {
            foreach (object[] data in list)
            {
                dt.Rows.Add(data[0], data[1], data[2], ConvertData(data[3]), data[4], data[5], data[6], data[7], data[8]);
            }
        }
        return dt;
    }

    /// <summary>
    /// Builds the column collection for the data grid layout.
    /// </summary>
    /// <returns></returns>
    private DataTable GetDataGridLayout()
    {
        DataTable dt = new DataTable();
        DataColumn col;
        try
        {
            dt.Columns.Add("LeadSource");
            dt.Columns.Add("Target");
            dt.Columns.Add("Type");
            col = new DataColumn("ResponseDate", typeof(DateTime));
            dt.Columns.Add(col);
            dt.Columns.Add("Method");
            dt.Columns.Add("Stage");
            dt.Columns.Add("Comments");
            dt.Columns.Add("TargetId");
            dt.Columns.Add("ResponseId");
        }
        catch (Exception ex)
        {
            log.Error(ex.Message);
            throw;
        }
        return dt;
    }

    /// <summary>
    /// Gets a list of the target responses based on the filter criteria.
    /// </summary>
    /// <returns></returns>
    private IList GetContactTargets()
    {
        IList contactList = null;
        try
        {
            IQueryable query = (IQueryable)EntityFactory.GetRepository<IContact>();
            IExpressionFactory expressions = query.GetExpressionFactory();
            IProjections projections = query.GetProjectionsFactory();
            ICriteria criteria = query.CreateCriteria("contact")
                .SetCacheable(true)
                .CreateCriteria("CampaignTargets", "target")
                    .Add(expressions.Eq("Campaign.Id", EntityContext.EntityID))
                .CreateCriteria("TargetResponses", "response")
                        .SetProjection(projections.ProjectionList()
                            .Add(projections.Property("response.LeadSource"))
                            .Add(projections.Property("NameLF"))
                            .Add(projections.Property("target.TargetType"))
                            .Add(projections.Property("response.ResponseDate"))
                            .Add(projections.Property("response.ResponseMethod"))
                            .Add(projections.Property("response.Stage"))
                            .Add(projections.Property("response.Comments"))
                            .Add(projections.Property("target.Id"))
                            .Add(projections.Property("response.Id"))
                            .Add(projections.Property("contact.LastName"))
                            );
            criteria = GetExpressions(criteria, expressions);
            if (chkName.Checked)
                criteria.Add(expressions.InsensitiveLike("contact.LastName", txtName.Text, LikeMatchMode.BeginsWith));
            contactList = criteria.List();
        }
        catch (Exception ex)
        {
            log.Error(ex.Message);
            throw;
        }
        return contactList;
    }

    /// <summary>
    /// Gets the Lead targets.
    /// </summary>
    /// <returns></returns>
    private IList GetLeadTargets()
    {
        IList leadList = null;
        try
        {
            IQueryable query = (IQueryable)EntityFactory.GetRepository<ILead>();
            IExpressionFactory expressions = query.GetExpressionFactory();
            IProjections projections = query.GetProjectionsFactory();
            ICriteria criteria = query.CreateCriteria("lead")
                .SetCacheable(true)
                .CreateCriteria("CampaignTargets", "target")
                    .Add(expressions.Eq("Campaign.Id", EntityContext.EntityID))
                .CreateCriteria("TargetResponses", "response")
                        .SetProjection(projections.ProjectionList()
                            .Add(projections.Property("response.LeadSource"))
                            .Add(projections.Property("LeadNameLastFirst"))
                            .Add(projections.Property("target.TargetType"))
                            .Add(projections.Property("response.ResponseDate"))
                            .Add(projections.Property("response.ResponseMethod"))
                            .Add(projections.Property("response.Stage"))
                            .Add(projections.Property("response.Comments"))
                            .Add(projections.Property("target.Id"))
                            .Add(projections.Property("response.Id"))
                            .Add(projections.Property("lead.LastName"))
                            );
            criteria = GetExpressions(criteria, expressions);
            if (chkName.Checked)
                criteria.Add(expressions.InsensitiveLike("lead.LastName", txtName.Text, LikeMatchMode.BeginsWith));
            leadList = criteria.List();
        }
        catch (Exception ex)
        {
            log.Error(ex.Message);
            throw;
        }
        return leadList;
    }

    /// <summary>
    /// Gets the filter expressions.
    /// </summary>
    /// <param name="expressions">The expressions.</param>
    /// <returns></returns>
    private ICriteria GetExpressions(ICriteria criteria, IExpressionFactory expressions)
    {
        if (chkLeadSource.Checked)
            criteria.Add(expressions.Eq("response.LeadSource", lbxLeadSource.SelectedItem.Text.ToString()));
        if (chkMethod.Checked)
            criteria.Add(expressions.Eq("response.ResponseMethod", lbxMethods.SelectedItem.Text));
        if (chkStage.Checked)
            criteria.Add(expressions.Eq("response.Stage", lbxStage.SelectedItem.Text));
        return criteria;
    }

    /// <summary>
    /// Converts the value of the object into a valid DateTime value.
    /// </summary>
    /// <param name="dateTime">The date time.</param>
    /// <returns></returns>
    private DateTime? ConvertData(Object dateTime)
    {
        if (dateTime == null)
            return DateTime.MinValue;
        return Convert.ToDateTime(dateTime);
    }

    /// <summary>
    /// Handles the RowCommand event of the grdResponses control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewCommandEventArgs"/> instance containing the event data.</param>
    protected void grdResponses_RowCommand(object sender, GridViewCommandEventArgs e)
    {
        ITargetResponse targetResponse = null;
        string responseId = String.Empty;
        int rowIndex = Convert.ToInt32(e.CommandArgument);
        try
        {
            responseId = grdResponses.DataKeys[rowIndex].Values[1].ToString();
            if (!String.IsNullOrEmpty(responseId))
                targetResponse = EntityFactory.GetRepository<ITargetResponse>().Get(responseId);
        }
        catch
        {
            return;
        }
        string targetType = grdResponses.DataKeys[rowIndex].Values[2].ToString();

        if (e.CommandName.Equals("Delete"))
        {
            targetResponse.Delete();
        }
        else if (e.CommandName.Equals("Add"))
        {
            bool isLead = false;
            ICampaignTarget campaignTarget = null;
            string targetId = grdResponses.DataKeys[rowIndex].Values[0].ToString();
            if (!String.IsNullOrEmpty(targetId))
                campaignTarget = EntityFactory.GetRepository<ICampaignTarget>().Get(targetId);
            if (campaignTarget != null)
            {
                targetResponse = EntityFactory.Create<ITargetResponse>();
                if (targetType.ToUpper().Equals("LEAD"))
                {
                    isLead = true;
                    targetResponse.Lead = EntityFactory.GetRepository<ILead>().Get(campaignTarget.EntityId);
                }
                else
                {
                    targetResponse.Contact = EntityFactory.GetRepository<IContact>().Get(campaignTarget.EntityId);
                }
                if (BindingSource.Current != null)
                    targetResponse.Campaign = BindingSource.Current as ICampaign;
                targetResponse.CampaignTarget = campaignTarget;
                ShowResponseView(targetResponse, isLead);
            }
        }
        else if (e.CommandName.Equals("Edit"))
        {
            if (!string.IsNullOrEmpty(targetType))
                ShowResponseView(targetResponse, targetType.Equals("Lead"));
            else
                DialogService.ShowMessage(GetLocalResourceObject("error_InvalidTargetType").ToString());
        }
    }

    /// <summary>
    /// Handles the OnClick event of the Search control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void Search_OnClick(object sender, EventArgs e)
    {
    }

    /// <summary>
    /// Handles the Click event of the AddResponse control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.ImageClickEventArgs"/> instance containing the event data.</param>
    protected void AddResponse_Click(object sender, ImageClickEventArgs e)
    {
        ITargetResponse targetResponse = EntityFactory.Create<ITargetResponse>();
        targetResponse.CampaignTarget = EntityFactory.Create<ICampaignTarget>();
        if (BindingSource.Current != null)
        {
            targetResponse.Campaign = BindingSource.Current as ICampaign;
            targetResponse.CampaignTarget.Campaign = targetResponse.Campaign;
        }
        ShowResponseView(targetResponse, false);
    }

    /// <summary>
    /// Shows the response view.
    /// </summary>
    /// <param name="targetResponse">The target response.</param>
    /// <param name="isLead">if set to <c>true</c> [is lead].</param>
    private void ShowResponseView(ITargetResponse targetResponse, Boolean isLead)
    {
        if (DialogService != null)
        {
            string caption = GetLocalResourceObject("AddTargetResponse_DialogCaption").ToString();
            if (targetResponse.Id != null)
            {
                caption = GetLocalResourceObject("EditTargetResponse_DialogCaption").ToString();
            }
            if (isLead)
            {
                DialogService.DialogParameters.Add("IsLead", isLead);
            }
            DialogService.SetSpecs(200, 200, 550, 800, "AddEditTargetResponse", caption, true);
            DialogService.EntityType = typeof(ITargetResponse);
            if (targetResponse != null && targetResponse.Id != null)
                DialogService.EntityID = targetResponse.Id.ToString();

            DialogService.DialogParameters.Add("ResponseDataSource", targetResponse);
            DialogService.ShowDialog();
        }
    }

    /// <summary>
    /// Handles the RowDeleting event of the grdResponses control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewDeleteEventArgs"/> instance containing the event data.</param>
    protected void grdResponses_RowDeleting(object sender, GridViewDeleteEventArgs e)
    {
    }

    /// <summary>
    /// Handles the RowDataBound event of the grdResponses control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewRowEventArgs"/> instance containing the event data.</param>
    protected void grdResponses_RowDataBound(object sender, GridViewRowEventArgs e)
    {
        if (e.Row.RowType == DataControlRowType.DataRow)
        {
            if ((grdResponseDeleteColumnIndex >= 0) && (grdResponseDeleteColumnIndex < e.Row.Cells.Count))
            {
                TableCell cell = e.Row.Cells[grdResponseDeleteColumnIndex];
                foreach (Control c in cell.Controls)
                {
                    LinkButton btn = c as LinkButton;
                    if (btn != null)
                    {
                        btn.Attributes.Add("onclick", "javascript: return confirm('" + GetLocalResourceObject("grdResponses.ConfirmDelete_Msg").ToString() + "');");
                        return;
                    }
                }
            }
        }
    }

    /// <summary>
    /// Gets the index of the GRD campaigns delete column.
    /// </summary>
    /// <value>The index of the GRD campaigns delete column.</value>
    protected int grdResponseDeleteColumnIndex
    {
        get
        {
            if (_grdResponseDeleteColIndex == -2)
            {
                int bias = (grdResponses.ExpandableRows) ? 1 : 0;
                _grdResponseDeleteColIndex = -1;
                int colcount = 0;
                foreach (DataControlField col in grdResponses.Columns)
                {
                    ButtonField btn = col as ButtonField;
                    if (btn != null)
                    {
                        if (btn.CommandName == "Delete")
                        {
                            _grdResponseDeleteColIndex = colcount + bias;
                            break;
                        }
                    }
                    colcount++;
                }
            }
            return _grdResponseDeleteColIndex;
        }
    }

    /// <summary>
    /// Handles the RowEditing event of the grdResponses control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewEditEventArgs"/> instance containing the event data.</param>
    protected void grdResponses_RowEditing(object sender, GridViewEditEventArgs e)
    {
    }

    /// <summary>
    /// Handles the CheckedChanged event of the chkDisplayResults control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void chkDisplayResults_CheckedChanged(object sender, EventArgs e)
    {
        Helpers.SetShowOnOpenOption(((chkDisplayResults.Checked) ? "T" : "F"), "Web.ViewResponses");
    }

    /// <summary>
    /// Handles the SelectedIndexChanged event of the lbxLeadSource control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void lbxLeadSource_SelectedIndexChanged(object sender, EventArgs e)
    {
        if (_State != null)
        {
            _State.leadSourceFilter = lbxLeadSource.SelectedIndex;
            ContextService.SetContext("ResponseFilterStateInfo", _State);
        }
    }

    /// <summary>
    /// Handles the SelectedIndexChanged event of the lbxMethods control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void lbxMethods_SelectedIndexChanged(object sender, EventArgs e)
    {
        if (_State != null)
        {
            _State.methodFilter = lbxMethods.SelectedIndex;
            ContextService.SetContext("ResponseFilterStateInfo", _State);
        }
    }

    /// <summary>
    /// Handles the SelectedIndexChanged event of the lbxStage control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void lbxStage_SelectedIndexChanged(object sender, EventArgs e)
    {
        if (_State != null)
        {
            _State.stageFilter = lbxStage.SelectedIndex;
            ContextService.SetContext("ResponseFilterStateInfo", _State);
        }
    }

    #endregion

}
