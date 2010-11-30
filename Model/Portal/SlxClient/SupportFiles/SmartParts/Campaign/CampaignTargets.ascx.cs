using System;
using System.Text;
using System.Xml;
using System.Web.UI;
using System.Web.UI.WebControls;
using Sage.Platform;
using Sage.Platform.Application;
using Sage.Platform.Application.UI;
using Sage.Platform.Repository;
using Sage.Platform.WebPortal.Binding;
using Sage.Platform.WebPortal.Services;
using Sage.Platform.WebPortal.SmartParts;
using Sage.Entity.Interfaces;
using log4net;
using Sage.SalesLogix.PickLists;
using System.Collections.Generic;
using Sage.SalesLogix.CampaignTarget;
using Sage.Platform.WebPortal;

/// <summary>
/// Summary description for CampaignTargets
/// </summary>
public partial class CampaignTargets : EntityBoundSmartPartInfoProvider
{
    #region properties
    private IContextService _Context;
    private AddFilterStateInfo _State;
    private bool _SetLastPageIndex = false;
    
    #endregion

    #region Public Methods
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
        if (BindingSource != null)
        {
            if (BindingSource.Current != null)
            {
                tinfo.Description = BindingSource.Current.ToString();
                tinfo.Title = BindingSource.Current.ToString();
            }
        }

        foreach (Control control in Controls)
        {
            SmartPartToolsContainer cont = control as SmartPartToolsContainer;
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

    #region Public Classes

    /// <summary>
    /// 
    /// </summary>
    public class AddFilterStateInfo
    {
        public string EntityID = String.Empty;
        public bool showContacts = true;
        public bool showLeads = true;
        public int groupFilter = 0;
        public int respondedFilter = 0;
        public int priorityFilter = 0;
        public int statusFilter = 0;
        public int stageFilter = 0;
        public bool formOpen = false;
        public bool manageViewOpen = false;
    }
    #endregion

    #region Private Methods

    /// <summary>
    /// Handles the Init event of the Page control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void Page_Init(object sender, EventArgs e)
    {
        if (Visible)
        {
            if (ContextService.HasContext("AddFilterStateInfo"))
            {
                _State = ContextService.GetContext("AddFilterStateInfo") as AddFilterStateInfo;
            }
            if (_State == null)
            {
                _State = new AddFilterStateInfo();
                PopulateListBoxControl(lbxPriority, "Lead Priority");
                AddDistinctGroupItemsToList();
                AddDistinctStageItemsToList();
            }
            else
            {
                lbxGroups.SelectedIndex = _State.groupFilter;
                lbxPriority.SelectedIndex = _State.priorityFilter;
                lbxStages.SelectedIndex = _State.stageFilter;
                lbxStatus.SelectedIndex = _State.statusFilter;
            }
            PopulateListBoxControl(lbxStatus, "Target Status");
        }
    }

    /// <summary>
    /// Override this method to add bindings to the currrently bound smart part
    /// </summary>
    protected override void OnAddEntityBindings()
    {
        BindingSource.Bindings.Add(new WebEntityBinding("TargetAudienceList", txtExternalDescription, "Text", String.Empty, String.Empty));
        BindingSource.Bindings.Add(new WebEntityBinding("TargetAudienceLocation", txtExternalLocation, "Text", String.Empty, String.Empty));
        BindingSource.Bindings.Add(new WebEntityBinding("TargetAudienceTargetCount", txtExternalNumber, "Text", String.Empty, String.Empty));
    }

    /// <summary>
    /// Derived components should override this method to wire up event handlers.
    /// </summary>
    protected override void OnWireEventHandlers()
    {
        cmdReset.Attributes.Add("onclick", "return false;");
        cmdClearAll.Attributes.Add("onclick", "return ct_ClearAll();");
        cmdSelectAll.Attributes.Add("onclick", "return ct_SelectAll();");
        lnkFilters.Attributes.Add("onclick", "return false;");
        cmdDelete.Attributes.Add("onclick", "javascript: return confirm('" + PortalUtil.JavaScriptEncode(GetLocalResourceObject("confirmDeleteMsg").ToString()) + "');");
        chkExternalList.Attributes.Add("onclick", "confirmExternalListCheck()");
        base.OnWireEventHandlers();
    }

    /// <summary>
    /// Raises the <see cref="E:EntityContextChanged"/> event.
    /// </summary>
    /// <param name="e">The <see cref="Sage.Platform.Application.EntityContextChangedEventArgs"/> instance containing the event data.</param>
    protected override void OnEntityContextChanged(EntityContextChangedEventArgs e)
    {
        //this should happen since the paging to a new enity does not have context of the old entity so this is not called.
        ContextService.RemoveContext("AddFilterStateInfo");
        ContextService.RemoveContext("CT_SELECTED_TARGETIDS");
        base.OnEntityContextChanged(e);
    }

    /// <summary>
    /// Handles the Init event of the Page control.
    /// </summary>
    private void RegisterClientScript()
    {
        StringBuilder sb = new StringBuilder(GetLocalResourceObject("CampaignTargets_ClientScript").ToString());
        sb.Replace("@chkShowContacts", chkContacts.ClientID);
        sb.Replace("@chkShowLeads", chkLeads.ClientID);
        sb.Replace("@chkGroup", chkGroup.ClientID);
        sb.Replace("@lbxGroup", lbxGroups.ClientID);
        sb.Replace("@chkResponded", chkResponded.ClientID);
        sb.Replace("@chkPriority", chkPriority.ClientID);
        sb.Replace("@lbxPriority", lbxPriority.ClientID);
        sb.Replace("@chkStatus", chkStatus.ClientID);
        sb.Replace("@lbxStatus", lbxStatus.ClientID);
        sb.Replace("@chkStage", chkStage.ClientID);
        sb.Replace("@lbxStage", lbxStages.ClientID);
        sb.Replace("@chkExternalListId", chkExternalList.ClientID);
        sb.Replace("@confirmExternalListMsg", PortalUtil.JavaScriptEncode(GetLocalResourceObject("confirm_ExternalList_Msg").ToString()));
        sb.Replace("@cmdExternalListId", cmdExternalList.ClientID);
        sb.Replace("@txtConfirmExternalListId", txtConfirmExternalList.ClientID);
        sb.Replace("@targetsGridId", grdTargets.ClientID);
        sb.Replace("@txtSelectedTargetId", txtSelectedTargetId.ClientID);
        sb.Replace("@noTargetSelectedMsg", PortalUtil.JavaScriptEncode(GetLocalResourceObject("error_NoTarget_Selected").ToString()));
        sb.Replace("@txtSelectedTargetContextId", txtSelectContext.ClientID);
        sb.Replace("@txtSelectedTargetsId", txtSelectedTargets.ClientID);
        sb.Replace("@txtShowFilterId", txtShowFilter.ClientID);
        sb.Replace("@filterDivId", filterDiv.ClientID);
        sb.Replace("@lnkFiltersId", lnkFilters.ClientID);
        sb.Replace("@lnkHideFilters", PortalUtil.JavaScriptEncode(GetLocalResourceObject("lnkHideFilters.Text").ToString()));
        sb.Replace("@lnkShowFilters", PortalUtil.JavaScriptEncode(GetLocalResourceObject("lnkShowFilters.Text").ToString()));
        sb.Replace("@divExternalId", divExternal.ClientID);
        sb.Replace("@divDisplayGridId", divDisplayGrid.ClientID);

        ScriptManager.RegisterStartupScript(Page, GetType(), "TargetsScript", sb.ToString(), false);
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
    /// Called when the smartpart has been bound.  Derived components should override this method to run code that depends on 
    /// entity context being set and it not changing.
    /// </summary>
    protected override void OnActivating()
    {
        cmdEmail.Enabled = Sage.SalesLogix.Campaign.Helpers.CanLaunchEmailCampaign();
        hfIsFormInit.Value = "False";
        base.OnActivating();
    }

    /// <summary>
    /// Called when [form bound].
    /// </summary>
    protected override void OnFormBound()
    {
        ICampaign campaign = GetParentEntity() as ICampaign;
        if (campaign != null)
        {
            chkExternalList.Checked = false;
            if (campaign.UseExternalList.HasValue)
                chkExternalList.Checked = campaign.UseExternalList.Value;
            chkExternalList.Enabled = (campaign.ActualLaunchDate == null);
        }
        if (chkExternalList.Checked)
        {
            divDisplayGrid.Style.Add(HtmlTextWriterStyle.Display, "none");
            divExternal.Style.Add(HtmlTextWriterStyle.Display, "inline");
            lnkFilters.Style.Add(HtmlTextWriterStyle.Display, "none");
        }
        else
        {
            divDisplayGrid.Style.Add(HtmlTextWriterStyle.Display, "inline");
            divExternal.Style.Add(HtmlTextWriterStyle.Display, "none");
            lnkFilters.Style.Add(HtmlTextWriterStyle.Display, "inline");

            if (txtShowFilter.Value.Equals("true"))
            {
                filterDiv.Style.Add(HtmlTextWriterStyle.Display, "inline");
            }
            else
            {
                filterDiv.Style.Add(HtmlTextWriterStyle.Display, "none");
            }
            chkDisplayOnOpen.Checked = Sage.SalesLogix.Campaign.Helpers.ShowTargetsOnOpen();

            if (_State.EntityID != EntityContext.EntityID.ToString())
            {
                ContextService.RemoveContext("AddFilterStateInfo");
                ContextService.RemoveContext("CT_SELECT_STATE");
                _State.EntityID = EntityContext.EntityID.ToString();
                _State.formOpen = false;
            }
            grdTargets.EmptyTableRowText = GetLocalResourceObject("grdTargets.EmptyTableRowText").ToString();
            if (!_State.formOpen || (hfIsFormInit.Value == "False") || _State.manageViewOpen)
            {
                _State.formOpen = true;
                hfIsFormInit.Value = "True";
                txtSelectedTargets.Value = string.Empty;

                if (chkDisplayOnOpen.Checked)
                {
                    LoadGrid();
                }
                else
                {
                    grdTargets.EmptyTableRowText = GetLocalResourceObject("grdTargets.NoRecordsFoundText").ToString();
                    grdTargets.DataBind();
                }
            }
            else
            {
                LoadGrid();
            }
            ContextService.SetContext("AddFilterStateInfo", _State);
        }
        cmdSave.Visible = chkExternalList.Checked;
        cmdUpdate.Visible = !chkExternalList.Checked;
        cmdManageList.Visible = !chkExternalList.Checked;
        cmdDelete.Visible = !chkExternalList.Checked;
        cmdEmail.Visible = !chkExternalList.Checked;
    }

    /// <summary>
    /// Handles the changing event of the grdTargetspage control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewPageEventArgs"/> instance containing the event data.</param>
    protected void grdTargetspage_changing(object sender, GridViewPageEventArgs e)
    {
        int pageIndex = e.NewPageIndex;
        // if viewstate is off in the GridView then we need to calculate PageCount ourselves
        if (pageIndex > 10000)
        {
            _SetLastPageIndex = true;
            grdTargets.PageIndex = 0;
        }
        else
        {
            _SetLastPageIndex = false;
            grdTargets.PageIndex = pageIndex;
        }
    }

    /// <summary>
    /// Handles the Sorting event of the grdTargets control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewSortEventArgs"/> instance containing the event data.</param>
    protected void grdTargets_Sorting(object sender, GridViewSortEventArgs e)
    {
    }

    /// <summary>
    /// Gets and populates a listbox control with the picklist items specified by the picklistName paramater.
    /// </summary>
    /// <param name="listBox">The list box.</param>
    /// <param name="picklistName">Name of the picklist.</param>
    private static void PopulateListBoxControl(ListBox listBox, string picklistName)
    {
        listBox.Items.Clear();
        string picklistId = PickList.PickListIdFromName(picklistName);
        listBox.Items.Add(String.Empty);
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
                    listBox.Items.Add(item);
                }
            }
        }
    }

    /// <summary>
    /// Adds the distinct CampaignTarget group names to list.
    /// </summary>
    private void AddDistinctGroupItemsToList()
    {
        lbxGroups.Items.Clear();
        lbxGroups.Items.Add(String.Empty);

        IRepository<ICampaignTarget> rep = EntityFactory.GetRepository<ICampaignTarget>();
        IQueryable query = (IQueryable)rep;
        IExpressionFactory expressions = query.GetExpressionFactory();
        IProjections projections = query.GetProjectionsFactory();
        Sage.Platform.Repository.ICriteria criteria = query.CreateCriteria()
                .SetProjection(projections.Distinct(projections.Property("GroupName")))
                    .Add(expressions
                        .And(expressions.Eq("Campaign.Id", EntityContext.EntityID), expressions.IsNotNull("GroupName")));

        IList<object> groups = criteria.List<object>();
        if (groups != null)
        {
            ListItem item;
            foreach (string group in groups)
            {
                if (!String.IsNullOrEmpty(group))
                {
                    item = new ListItem();
                    item.Text = group;
                    lbxGroups.Items.Add(item);
                }
            }
        }
    }

    /// <summary>
    /// Adds the distinct CampaignStage stage names to list.
    /// </summary>
    private void AddDistinctStageItemsToList()
    {
        lbxStages.Items.Clear();
        lbxStages.Items.Add("");

        IRepository<ICampaignStage> rep = EntityFactory.GetRepository<ICampaignStage>();
        IQueryable query = (IQueryable)rep;
        IExpressionFactory expressions = query.GetExpressionFactory();
        IProjections projections = query.GetProjectionsFactory();
        Sage.Platform.Repository.ICriteria criteria = query.CreateCriteria()
                .SetProjection(projections.Distinct(projections.Property("Description")))
                    .Add(expressions
                        .And(expressions.Eq("Campaign.Id", EntityContext.EntityID), expressions.IsNotNull("Description")));

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
                    lbxStages.Items.Add(item);
                }
            }
        }
    }

    /// <summary>
    /// Handles the RowCreated event of the grdTargets control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewRowEventArgs"/> instance containing the event data.</param>
    protected void grdTargets_RowCreated(object sender, GridViewRowEventArgs e)
    {
        if (e.Row.RowType == DataControlRowType.Header)
        {
        }
        else if (e.Row.RowType == DataControlRowType.DataRow)
        {
            TargetView target = (TargetView)e.Row.DataItem;

            CheckBox cb = new CheckBox();
            cb = (CheckBox)e.Row.FindControl("chkSelectTarget");
            if (cb != null)
            {
                cb.Attributes.Add("onClick", string.Format("return ct_OnTargetSelectClick(this,'{0}');", target.TargetId));
            }

            CheckBox initialTarget = (CheckBox)e.Row.FindControl("chkInitialTarget");
            if (initialTarget != null)
            {
                initialTarget.Attributes.Add("onClick", string.Format("javascript:onInitialTargetClick('{0}', '{1}', '{2}', '{3}');",
                    initialTarget.ClientID, txtNewInitialTargetValue.ClientID, cmdInitialTarget.ClientID, target.TargetId));
            }

            LoadTargetStatusItems(e, target);
        }
    }

    /// <summary>
    /// Populates the Status list, adds missing items if not contained in the Target Status picklist, and set the selected value.
    /// </summary>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewRowEventArgs"/> instance containing the event data.</param>
    private void LoadTargetStatusItems(GridViewRowEventArgs e, TargetView target)
    {
        DropDownList statusList = e.Row.FindControl("ddlTargetStatus") as DropDownList;
        statusList.Attributes.Add("onChange", string.Format("javascript:onStatusChange('{0}', '{1}', '{2}', '{3}');",
            statusList.ClientID, txtNewStatusValue.ClientID, cmdStatusChange.ClientID, target.TargetId));
        ListItemCollection listItems = new ListItemCollection();
        foreach (ListItem item in lbxStatus.Items)
            listItems.Add(item);
        if (target != null)
        {
            String value = target.Status;
            ListItem item = listItems.FindByText(value);
            if (item == null)
            {
                item = new ListItem();
                item.Text = value;
                listItems.Add(item);
            }
            statusList.DataSource = listItems;
            statusList.SelectedValue = value;
        }
    }

    /// <summary>
    /// Handles the OnClick event of the cmdInitialTarget control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void cmdInitialTarget_OnClick(object sender, EventArgs e)
    {
        if (!string.IsNullOrEmpty(txtSelectedTargetId.Value))
        {
            ICampaignTarget target = EntityFactory.GetRepository<ICampaignTarget>().Get(txtSelectedTargetId.Value);
            if (target != null)
            {
                target.InitialTarget = Convert.ToBoolean(txtNewInitialTargetValue.Value);
                target.Save();
            }
            txtSelectedTargetId.Value = String.Empty;
            txtNewInitialTargetValue.Value = String.Empty;
        }
    }

    /// <summary>
    /// Handles the SelectedIndexChanged event of the ddlTargetStatus control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void cmdStatusChange_OnClick(object sender, EventArgs e)
    {
        if (!string.IsNullOrEmpty(txtSelectedTargetId.Value))
        {
            ICampaignTarget target = EntityFactory.GetRepository<ICampaignTarget>().Get(txtSelectedTargetId.Value);
            if (target != null)
            {
                target.Status = txtNewStatusValue.Value;
                target.Save();
                if (target.Status.Equals(GetLocalResourceObject("Status_Response").ToString()))
                {
                    bool isLead = target.TargetType.Equals("Lead");
                    ITargetResponse targetResponse = EntityFactory.Create<ITargetResponse>();
                    targetResponse.CampaignTarget = target;
                    targetResponse.Campaign = target.Campaign;
                    if (isLead)
                        targetResponse.Lead = EntityFactory.GetById<ILead>(target.EntityId);
                    else
                        targetResponse.Contact = EntityFactory.GetById<IContact>(target.EntityId);
                    ShowResponseView(targetResponse, isLead);
                }
            }
            txtSelectedTargetId.Value = String.Empty;
            txtNewStatusValue.Value = String.Empty;
        }
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
            if (isLead)
            {
                DialogService.DialogParameters.Add("IsLead", isLead);
            }
            DialogService.SetSpecs(200, 200, 550, 800, "AddEditTargetResponse", caption, true);
            DialogService.EntityType = typeof(ITargetResponse);
            DialogService.DialogParameters.Add("ResponseDataSource", targetResponse);
            DialogService.ShowDialog();
        }
    }

    /// <summary>
    /// Handles the CheckedChanged event of the chkDisplayOnOpen control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void chkDisplayOnOpen_CheckedChanged(object sender, EventArgs e)
    {
        Sage.SalesLogix.Campaign.Helpers.SetShowOnOpenOption(((chkDisplayOnOpen.Checked) ? "T" : "F"), "Web.ViewTargets");
    }

    /// <summary>
    /// Handles the OnClick event of the cmdExternalList control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void cmdExternalList_OnClick(object sender, EventArgs e)
    {
        ICampaign campaign = GetParentEntity() as ICampaign;
        if (campaign != null)
        {
            if (txtConfirmExternalList.Value.Equals("T"))
            {
                campaign.UseExternalList = true;
                Sage.SalesLogix.Campaign.Rules.DeleteCampaignTargets(campaign);
                IPanelRefreshService refresher = PageWorkItem.Services.Get<IPanelRefreshService>();
                refresher.RefreshMainWorkspace();
            }
            else //still need to post changes to 'External List' properties
            {
                campaign.UseExternalList = false;
                campaign.TargetAudienceList = null;
                campaign.TargetAudienceLocation = null;
                campaign.TargetAudienceTargetCount = null;
                campaign.Save();
            }
        }
    }

    /// <summary>
    /// Handles the OnClick event of the DeleteTargets control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void DeleteTargets_OnClick(object sender, EventArgs e)
    {
        TargetsViewDataSource dataSource = new TargetsViewDataSource();
        dataSource.OnSetCriteriaEvent += OnSetFilters;
        dataSource.SelectedFilterState = GetFilterState();
        dataSource.DeleteSelectedTargets();
    }

    /// <summary>
    /// Handles the OnClick event of the UpdateTargets control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void UpdateTargets_OnClick(object sender, EventArgs e)
    {
        if (DialogService != null)
        {
            _State.manageViewOpen = true;
            TargetSelectedFilterState state = GetFilterState();
            ICampaign campaign = GetParentEntity() as ICampaign;
            DialogService.SetSpecs(200, 200, 650, 900, "UpdateTargets", "", true);
            DialogService.EntityType = typeof(ICampaign);
            DialogService.EntityID = campaign.Id.ToString();
            DialogService.DialogParameters.Add("TargetSelectedFilterState", state);
            DialogService.ShowDialog();
        }
    }

    /// <summary>
    /// Handles the OnClick event of the Search control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void Search_OnClick(object sender, EventArgs e)
    {
        _State.manageViewOpen = false;
    }

    /// <summary>
    /// Handles the OnClick event of the ManageTargets control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void ManageTargets_OnClick(object sender, EventArgs e)
    {
        if (DialogService != null)
        {
            _State.manageViewOpen = true;
            DialogService.SetSpecs(200, 200, 650, 1200, "ManageTargets", "", true);
            DialogService.ShowDialog();
        }
    }

    /// <summary>
    /// Handles the OnClick event of the LaunchEmail control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void LaunchEmail_OnClick(object sender, EventArgs e)
    {
    }

    /// <summary>
    /// Handles the OnClick event of the SaveAsGroup control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void SaveAsGroup_OnClick(object sender, EventArgs e)
    {
        TargetSelectedFilterState filterState = GetFilterState();
        DialogService.SetSpecs(200, 200, 220, 350, "CampaignTargetCreateGroup", "", true);
        DialogService.DialogParameters.Add("TargetSelectedFilterState", filterState);
        DialogService.ShowDialog();
    }

    /// <summary>
    /// Handles the OnClick event of the Save control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void Save_OnClick(object sender, EventArgs e)
    {
        ICampaign campaign = BindingSource.Current as ICampaign;
        campaign.Save();
    }

    /// <summary>
    /// Handles the OnSelectedIndexChanged event of the lbxPriority control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void lbxPriority_OnSelectedIndexChanged(object sender, EventArgs e)
    {
        _State.priorityFilter = lbxStages.SelectedIndex;
        ContextService.SetContext("AddFilterStateInfo", _State);
    }

    /// <summary>
    /// Handles the OnSelectedIndexChanged event of the lbxGroups control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void lbxGroups_OnSelectedIndexChanged(object sender, EventArgs e)
    {
        _State.groupFilter = lbxGroups.SelectedIndex;
        ContextService.SetContext("AddFilterStateInfo", _State);
    }

    /// <summary>
    /// Handles the SelectedIndexChanged event of the lbxStatus control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void lbxStatus_SelectedIndexChanged(object sender, EventArgs e)
    {
        _State.statusFilter = lbxStages.SelectedIndex;
        ContextService.SetContext("AddFilterStateInfo", _State);
    }

    /// <summary>
    /// Handles the OnSelectedIndexChanged event of the lbxStages control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void lbxStages_OnSelectedIndexChanged(object sender, EventArgs e)
    {
        _State.stageFilter = lbxStages.SelectedIndex;
        ContextService.SetContext("AddFilterStateInfo", _State);
    }

    /// <summary>
    /// Handles the OnClick event of the cmdSelectAll control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void cmdSelectAll_OnClick(object sender, EventArgs e)
    {
        txtSelectedTargets.Value = string.Empty;
        txtSelectContext.Value = "SELECT_ALL";
        ContextService.RemoveContext("CT_SELECT_STATE");
    }

    /// <summary>
    /// Handles the OnClick event of the cmdClearAll control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void cmdClearAll_OnClick(object sender, EventArgs e)
    {
        txtSelectedTargets.Value = string.Empty;
        txtSelectContext.Value = "CLEAR_ALL";
        ContextService.RemoveContext("CT_SELECT_STATE");
    }

    /// <summary>
    /// Gets the state of the select.
    /// </summary>
    /// <returns></returns>
    private IDictionary<string, bool> GetSelectState()
    {
        IDictionary<string, bool> selectState;
        selectState = (IDictionary<string, bool>)ContextService.GetContext("CT_SELECT_STATE");
        if (selectState == null)
        {
            selectState = new Dictionary<string, bool>();
        }
        LoadClientSelects(selectState);
        ContextService.SetContext("CT_SELECT_STATE", selectState);
        return selectState;
    }

    /// <summary>
    /// Sets the client select context.
    /// </summary>
    /// <param name="selectState">State of the select.</param>
    private void LoadClientSelects(IDictionary<string, bool> selectState)
    {
        string clientContext = txtSelectedTargets.Value;
        if (!string.IsNullOrEmpty(clientContext))
        {

            XmlDocument xmlDoc = new XmlDocument();
            xmlDoc.LoadXml(clientContext);
            XmlNodeList targetNodes = xmlDoc.DocumentElement.SelectNodes("//Targets/Target");
            foreach (XmlNode tn in targetNodes)
            {
                string Id = tn.Attributes["Id"].Value;
                string selected = tn.Attributes["Selected"].Value;
                if (selectState.ContainsKey(Id))
                {
                    selectState.Remove(Id);
                }
                selectState.Add(Id, Convert.ToBoolean(selected));

            }
            txtSelectedTargets.Value = string.Empty;
        }
    }

    /// <summary>
    /// Determines whether [is select ALL].
    /// </summary>
    /// <returns>
    /// 	<c>true</c> if [is select ALL]; otherwise, <c>false</c>.
    /// </returns>
    private bool IsSelectALL()
    {
        return (txtSelectContext.Value.Equals("SELECT_ALL"));
    }

    /// <summary>
    /// Creates the targets view data source.
    /// </summary>
    /// <param name="sender">The sender.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.ObjectDataSourceEventArgs"/> instance containing the event data.</param>
    protected void CreateTargetsViewDataSource(object sender, ObjectDataSourceEventArgs e)
    {
        TargetsViewDataSource dataSource = new TargetsViewDataSource();
        dataSource.OnSetCriteriaEvent += OnSetFilters;
        dataSource.SelectedFilterState = GetFilterState();
        dataSource.CacheResult = false;
        if (!String.IsNullOrEmpty(grdTargets.SortExpression))
            dataSource.SortExpression = grdTargets.SortExpression;
        dataSource.IsAscending = grdTargets.SortDirection.Equals(SortDirection.Ascending);
        if (_SetLastPageIndex)
        {
            int pageIndex = 0;
            int recordCount = dataSource.GetDataCount();
            int pageSize = grdTargets.PageSize;
            decimal numberOfPages = recordCount / pageSize;
            pageIndex = Convert.ToInt32(Math.Ceiling(numberOfPages));
            grdTargets.PageIndex = pageIndex;
        }
        e.ObjectInstance = dataSource;
    }

    /// <summary>
    /// Disposes the targets view data source.
    /// </summary>
    /// <param name="sender">The sender.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.ObjectDataSourceDisposingEventArgs"/> instance containing the event data.</param>
    protected void DisposeTargetsViewDataSource(object sender, ObjectDataSourceDisposingEventArgs e)
    {
        // Cancel the event, so that the object will not be Disposed if it implements IDisposable.
        e.Cancel = true;
    }

    /// <summary>
    /// Called when [set filters] event is fired on the TargetViewDataSource object.
    /// </summary>
    /// <param name="criteria">The criteria.</param>
    /// <param name="expressions">The expressions.</param>
    protected void OnSetFilters(ICriteria criteria, IExpressionFactory expressions)
    {
        ICampaign campaign = GetParentEntity() as ICampaign;
        criteria.Add(expressions.Eq("Campaignid", campaign.Id.ToString()));

        if (chkContacts.Checked && chkLeads.Checked)
        {
            //Don't Set Any Filters
        }
        if (!chkContacts.Checked && !chkLeads.Checked)
            criteria.Add(expressions.Eq("TargetType", "NONE"));
        if (chkContacts.Checked && !chkLeads.Checked)
            criteria.Add(expressions.Eq("TargetType", "Contact"));
        if (!chkContacts.Checked && chkLeads.Checked)
            criteria.Add(expressions.Eq("TargetType", "Lead"));
        if (chkPriority.Checked && lbxPriority.SelectedItem != null)
            criteria.Add(expressions.Eq("Priority", lbxPriority.SelectedItem.Text));
        if (chkGroup.Checked && lbxGroups.SelectedItem != null)
            criteria.Add(expressions.Eq("GroupName", lbxGroups.SelectedItem.Text));
        if (chkStatus.Checked && lbxStatus.SelectedItem != null)
            criteria.Add(expressions.Eq("Status", lbxStatus.SelectedItem.Text));
        if (chkStage.Checked && lbxStages.SelectedItem != null)
            criteria.Add(expressions.Eq("Stage", lbxStages.SelectedItem.Text));
        if (chkResponded.Checked)
        {
            if (rdgResponded.SelectedIndex == 0)
                criteria.Add(expressions.IsNotNull("ResponseDate"));
            else
                criteria.Add(expressions.IsNull("ResponseDate"));
        }
    }

    /// <summary>
    /// Loads the grid.
    /// </summary>
    private void LoadGrid()
    {
        grdTargets.DataSource = TargetsObjectDataSource;
        grdTargets.DataBind();

        if (grdTargets.Rows.Count > 0)
        {
            int pageIndex = grdTargets.PageIndex;
            int pageSize = grdTargets.PageSize;
            int firstRcd = (pageIndex * pageSize) + 1;
            int lastRcd = (pageIndex + 1) * pageSize;
            int totalRcdCount = grdTargets.TotalRecordCount;
            if (lastRcd > totalRcdCount)
                lastRcd = totalRcdCount;
            lblSearchCount.Text = String.Format(GetLocalResourceObject("lblSearchCount.Caption").ToString(), firstRcd, lastRcd, totalRcdCount);
        }
        else
        {
            lblSearchCount.Text = String.Empty;
        }
    }

    /// <summary>
    /// Gets the state of the filter.
    /// </summary>
    /// <returns></returns>
    private TargetSelectedFilterState GetFilterState()
    {
        TargetSelectedFilterState state = new TargetSelectedFilterState();
        ICampaign campaign = GetParentEntity() as ICampaign;
        state.CampaignId = campaign.Id.ToString();
        state.IncludeContacts = chkContacts.Checked;
        state.IncludeLeads = chkLeads.Checked;

        state.FilterByGroup = chkGroup.Checked;
        if (lbxGroups.SelectedItem != null)
            state.GroupValue = lbxGroups.SelectedItem.Text;

        state.FilterByPriority = chkPriority.Checked;
        if (lbxPriority.SelectedItem != null)
            state.PriorityValue = lbxPriority.SelectedItem.Text;

        state.FilterByResponded = chkResponded.Checked;
        state.Responded = (rdgResponded.SelectedIndex == 0) ? true : false;

        state.FilterByStatus = chkStatus.Checked;
        if (lbxStatus.SelectedItem != null)
            state.StatusValue = lbxStatus.SelectedItem.Text;

        state.FilterByStage = chkStage.Checked;
        if (lbxStages.SelectedItem != null)
            state.StageValue = lbxStages.SelectedItem.Text;

        state.SelectedALL = IsSelectALL();
        state.SelectedStates = GetSelectState();
        return state;
    }

    #endregion
}
