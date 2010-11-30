using System;
using System.Text;
using System.Web.UI;
using System.Web.UI.WebControls;
using Sage.Platform.Application.UI;
using Sage.Platform.WebPortal.SmartParts;
using Sage.Entity.Interfaces;
using System.Collections.Generic;
using Sage.SalesLogix.PickLists;
using Sage.Platform.ComponentModel;
using Sage.SalesLogix.CampaignTarget;

public partial class SmartParts_Campaign_UpdateTargets : EntityBoundSmartPartInfoProvider, IScriptControl
{
    private ICampaign _campaign = null;
    private TargetSelectedFilterState _filterState;
    private bool _SetLastPageIndex = false;
   
   
    /// <summary>
    /// Gets the type of the entity.
    /// </summary>
    /// <value>The type of the entity.</value>
    public override Type EntityType
    {
        get { return typeof(ICampaign); }
    }

    /// <summary>
    /// Called when [add entity bindings].
    /// </summary>
    protected override void OnAddEntityBindings()
    {

    }

    /// <summary>
    /// Handles the Init event of the Page control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void Page_Init(object sender, EventArgs e)
    {
    }

    /// <summary>
    /// Called when [wire event handlers].
    /// </summary>
    protected override void OnWireEventHandlers()
    {
        ddlOptions.Attributes.Add("onchange", string.Format("return {0}_obj.OptionChange();", ClientID));
        grdTargets.PageIndexChanging += new GridViewPageEventHandler(grdTargets_PageIndexChanging);
        base.OnWireEventHandlers();
    }
    /// <summary>
    /// Called when [form bound].
    /// </summary>
    /// 
    protected override void OnFormBound()
    {
        base.OnFormBound();
        ClientBindingMgr.RegisterDialogCancelButton(cmdCancel);
        _campaign = (ICampaign) BindingSource.Current;
        if (DialogService.DialogParameters.Count > 0)
        {
            object filterStateObj;
            if (DialogService.DialogParameters.TryGetValue("TargetSelectedFilterState", out filterStateObj))
            {
                _filterState = filterStateObj as TargetSelectedFilterState;
                _filterState.IncludeSelectedOnly = true;
            }
        }
        LoadView();
    }

    /// <summary>
    /// Ints the register client scripts.
    /// </summary>
    private void IntRegisterClientScripts()
    {
        StringBuilder sb = new StringBuilder();
        sb.AppendFormat("{0}_obj = new Sage.SalesLogix.CampaignUpdateTarget('{0}');", ClientID);
        ScriptManager.RegisterClientScriptBlock(Page, GetType(), "UpdateTargetsScript", sb.ToString(), true);
    }

    /// <summary>
    /// Handles the OnClick event of the cmdUpdate control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void cmdUpdate_OnClick(object sender, EventArgs e)
    {
        UpdateTargets();
    }

    /// <summary>
    /// Handles the OnClick event of the cmdClose control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void cmdClose_OnClick(object sender, EventArgs e)
    {
        DialogService.CloseEventHappened(sender, e);
        PanelRefresh.RefreshTabWorkspace();
    }

    /// <summary>
    /// Handles the PageIndexChanging event of the grdTargets control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewPageEventArgs"/> instance containing the event data.</param>
    protected void grdTargets_PageIndexChanging(object sender, GridViewPageEventArgs e)
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
    /// Handles the RowDataBound event of the grdTargets control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewRowEventArgs"/> instance containing the event data.</param>
    protected void grdTargets_RowDataBound(object sender, GridViewRowEventArgs e)
    {
        if (e.Row.RowType == DataControlRowType.DataRow)
        {
            TargetView target = (TargetView)e.Row.DataItem;
            Sage.SalesLogix.Web.Controls.DateTimePicker dtpLastUpdated = (Sage.SalesLogix.Web.Controls.DateTimePicker)e.Row.FindControl("dtpLastUpdated");
            if (dtpLastUpdated != null)
            {
                try
                {
                    dtpLastUpdated.DateTimeValue = target.ModifyDate;
                }
                catch
                {
                    dtpLastUpdated.DateTimeValue = DateTime.MinValue;
                    dtpLastUpdated.Text = string.Empty;
                }
            }
            Sage.SalesLogix.Web.Controls.DateTimePicker dtpResponseDate = (Sage.SalesLogix.Web.Controls.DateTimePicker)e.Row.FindControl("dtpResponseDateGrid");
            if (dtpResponseDate != null)
            {
                try
                {
                    dtpResponseDate.DateTimeValue = target.ResponseDate;
                }
                catch
                {
                    dtpResponseDate.DateTimeValue = DateTime.MinValue;
                    dtpResponseDate.Text = string.Empty;
                }
            }
        }
    }
    
    /// <summary>
    /// Loads the view.
    /// </summary>
    private void LoadView()
    {
        LoadGrid();
        SetControls();
    }

    /// <summary>
    /// Sets the controls.
    /// </summary>
    private void SetControls()
    {
        string option = Request.Form[ddlOptions.ClientID.Replace("_", "$")];
        LoadOptionsDDL();
        ddlOptions.SelectedValue = option;

        string stageTo = Request.Form[ddlToStage.ClientID.Replace("_", "$")];
        LoadStageToDDL(_campaign);
        ddlToStage.SelectedValue = stageTo;

        string stage = Request.Form[ddlStage.ClientID.Replace("_", "$")];
        LoadStageDDL(_campaign);
        ddlStage.SelectedValue = stage;

        string status = Request.Form[ddlToStatus.ClientID.Replace("_", "$")];
        LoadPicklistItems("Target Status", ddlToStatus);
        ddlToStatus.SelectedValue = status;

        string responseMethod = Request.Form[ddlResponseMethods.ClientID.Replace("_", "$")];
        LoadPicklistItems("Response Method", ddlResponseMethods);
        ddlResponseMethods.SelectedValue = responseMethod;

        string responseInterest = Request.Form[ddlResponseInterests.ClientID.Replace("_", "$")];
        LoadPicklistItems("Response Interest", ddlResponseInterests);
        ddlResponseInterests.SelectedValue = responseInterest;

        string responseInterestLevel = Request.Form[ddlResponseInterestLevels.ClientID.Replace("_", "$")];
        LoadPicklistItems("Response Interest Level", ddlResponseInterestLevels);
        ddlResponseInterestLevels.SelectedValue = responseInterestLevel;

        if (luLeadSource.LookupResultValue != null)
        {
            luLeadSource.Text = luLeadSource.LookupResultValue.ToString();
        }

        if (dtpResponseDate.DateTimeValue == null)
        {
            dtpResponseDate.DateTimeValue = DateTime.UtcNow;
        }

        opt0.Style.Add("display", "none");
        opt1.Style.Add("display", "none");
        opt2.Style.Add("display", "none");
        opt3.Style.Add("display", "none");

        switch (ddlOptions.SelectedValue)
        {
            case "0":
                opt0.Style.Add("display", "blocked");
                break;
            case "1":
                opt1.Style.Add("display", "blocked");
                break;
            case "2":
                opt2.Style.Add("display", "blocked");
                break;
            case "3":
                opt3.Style.Add("display", "blocked");
                break;
            default:
                opt0.Style.Add("display", "blocked");
                break;
        }
    }

    /// <summary>
    /// Updates the targets by Ids.
    /// </summary>
    private void UpdateTargets_ByIds()
    {
        string option = Request.Form[ddlOptions.ClientID.Replace("_", "$")];
        object[] targetIds = GetSelecetedTargetIds();
        if (targetIds.GetLength(0) > 0)
        {
            switch (option)
            {
                case "0":
                    string status = Request.Form[ddlToStatus.ClientID.Replace("_", "$")];
                    DoUpdateStatus(status, targetIds);
                    break;
                case "1":
                    string stage = Request.Form[ddlToStage.ClientID.Replace("_", "$")];
                    DoUpdateStage(stage, targetIds);
                    break;
                case "2":
                    string init = Request.Form[rdlInitTargets.ClientID.Replace("_", "$")];
                    bool initTarget = false;
                    if (init == "Y")
                    {
                        initTarget = true;
                    }
                    DoUpdateInit(initTarget, targetIds);
                    break;
                case "3":
                    ICampaign campaign = (ICampaign)BindingSource.Current;
                    DoAddResponse(targetIds, campaign);
                    break;
                default:
                    break;
            }
        }
    }
    /// <summary>
    /// Updates the targets by data source.
    /// </summary>
    private void UpdateTargets()
    {
        string option = Request.Form[ddlOptions.ClientID.Replace("_", "$")];


        switch (option)
        {
            case "0":
                string status = Request.Form[ddlToStatus.ClientID.Replace("_", "$")];
                DoUpdateStatus(status);

                break;
            case "1":
                string stage = Request.Form[ddlToStage.ClientID.Replace("_", "$")];
                DoUpdateStage(stage);

                break;
            case "2":
                string init = Request.Form[rdlInitTargets.ClientID.Replace("_", "$")];
                bool initTarget = false;
                if (init == "Y")
                {
                    initTarget = true;
                }
                DoUpdateInit(initTarget);

                break;
            case "3":
                ICampaign campaign = (ICampaign)BindingSource.Current;
                DoAddResponse(campaign);

                break;

            default:

                break;
        }

    }
    /// <summary>
    /// Does the update status.
    /// </summary>
    /// <param name="status">The status.</param>
    /// <param name="targetIds">The target ids.</param>
    private void DoUpdateStatus(string status, object[] targetIds)
    {
        Helpers.UpdateTargetStatus(status, targetIds);
    }

    /// <summary>
    /// Does the update stage.
    /// </summary>
    /// <param name="stage">The stage.</param>
    /// <param name="targetIds">The target ids.</param>
    private static void DoUpdateStage(string stage, object[] targetIds)
    {
        Helpers.UpdateTargetStage(stage, targetIds);
    }

    /// <summary>
    /// Does the update init.
    /// </summary>
    /// <param name="initTarget">if set to <c>true</c> [init target].</param>
    /// <param name="targetIds">The target ids.</param>
    private static void DoUpdateInit(Boolean initTarget, object[] targetIds)
    {
        Helpers.UpdateTargetInit(initTarget, targetIds);
    }

    /// <summary>
    /// Does the add response.
    /// </summary>
    /// <param name="targetIds">The target ids.</param>
    /// <param name="campaign">The campaign.</param>
    private void DoAddResponse(object[] targetIds, ICampaign campaign)
    {
        string stage = Request.Form[ddlStage.ClientID.Replace("_", "$")];
        string comment = txtComment.Text;
        string responseMethod = Request.Form[ddlResponseMethods.ClientID.Replace("_", "$")];
        string Id = luLeadSource.ClientID + "_LookupText";
        string leadSource = Request.Form[Id.Replace("_", "$")];
        string responseInterest = Request.Form[ddlResponseInterests.ClientID.Replace("_", "$")];
        string responseInterestLevel = Request.Form[ddlResponseInterestLevels.ClientID.Replace("_", "$")];
        DateTime? responseDate = dtpResponseDate.DateTimeValue;

        String[] propNames = { "Stage", "Comment", "ResponseMethod", "LeadSource", "ResponseDate", "Interest", "InterestLevel" };
        object[] propValues = { stage, comment, responseMethod, leadSource, responseDate, responseInterest, responseInterestLevel };
        ComponentView responseData = new ComponentView(propNames, propValues);

        Helpers.AddTargetResponses(targetIds, campaign, responseData);
    }
    /// <summary>
    /// Does the update status.
    /// </summary>
    /// <param name="status">The status.</param>
    private void DoUpdateStatus(string status)
    {
        TargetsViewDataSource ds = GetDataSource();
        Helpers.UpdateTargetStatus(status, ds);
    }


    /// <summary>
    /// Does the update stage.
    /// </summary>
    /// <param name="stage">The stage.</param>
    private void DoUpdateStage(string stage)
    {
        TargetsViewDataSource ds = GetDataSource();
        Helpers.UpdateTargetStage(stage, ds);
    }

    /// <summary>
    /// Does the update init.
    /// </summary>
    /// <param name="initTarget">if set to <c>true</c> [init target].</param>
    /// <param name="targetIds">The target ids.</param>
    private void DoUpdateInit(Boolean initTarget)
    {
        TargetsViewDataSource ds = GetDataSource();
        Helpers.UpdateTargetInit(initTarget, ds);
    }

    /// <summary>
    /// Does the add response.
    /// </summary>
    /// <param name="targetIds">The target ids.</param>
    /// <param name="campaign">The campaign.</param>
    private void DoAddResponse(ICampaign campaign)
    {
        string stage = Request.Form[ddlStage.ClientID.Replace("_", "$")];
        string comment = txtComment.Text;
        string responseMethod = Request.Form[ddlResponseMethods.ClientID.Replace("_", "$")];
        string Id = luLeadSource.ClientID + "_LookupText";
        string leadSource = Request.Form[Id.Replace("_", "$")];
        string responseInterest = Request.Form[ddlResponseInterests.ClientID.Replace("_", "$")];
        string responseInterestLevel = Request.Form[ddlResponseInterestLevels.ClientID.Replace("_", "$")];
        DateTime? responseDate = dtpResponseDate.DateTimeValue;

        String[] propNames = { "Stage", "Comment", "ResponseMethod", "LeadSource", "ResponseDate", "Interest", "InterestLevel" };
        object[] propValues = { stage, comment, responseMethod, leadSource, responseDate, responseInterest, responseInterestLevel };
        ComponentView responseData = new ComponentView(propNames, propValues);
        TargetsViewDataSource ds = GetDataSource();
        Helpers.AddTargetResponses(ds, campaign, responseData);
    }

    /// <summary>
    /// Gets the seleceted target ids.
    /// </summary>
    /// <returns></returns>
    private object[] GetSelecetedTargetIds()
    {
        object[] ids = null;
        TargetsViewDataSource ds = new TargetsViewDataSource();

        if (DialogService.DialogParameters.Count > 0)
        {
            object filterStateObj;
            if (DialogService.DialogParameters.TryGetValue("TargetSelectedFilterState", out filterStateObj))
            {
                _filterState = filterStateObj as TargetSelectedFilterState;
                _filterState.IncludeSelectedOnly = true;
            }
        }
        
        ds.SelectedFilterState = _filterState;
        ids = ds.GetTargetIds(true);
        return ids;
    }

    /// <summary>
    /// Gets the data source.
    /// </summary>
    /// <returns>
    /// 
    /// </returns>
    private TargetsViewDataSource GetDataSource()
    {

        TargetsViewDataSource ds = new TargetsViewDataSource();

        if (DialogService.DialogParameters.Count > 0)
        {
            object filterStateObj;
            if (DialogService.DialogParameters.TryGetValue("TargetSelectedFilterState", out filterStateObj))
            {
                _filterState = filterStateObj as TargetSelectedFilterState;
                _filterState.IncludeSelectedOnly = true;
            }
        }

        ds.SelectedFilterState = _filterState;

        return ds;
    }

    /// <summary>
    /// Loads the options DDL.
    /// </summary>
    private void LoadOptionsDDL()
    {
        ddlOptions.Items.Clear();
        ListItem item = new ListItem();

        item = new ListItem();
        item.Text = GetLocalResourceObject("Option_Status").ToString();
        item.Value = "0";
        ddlOptions.Items.Add(item);

        item = new ListItem();
        item.Text = GetLocalResourceObject("Option_Stage").ToString();
        item.Value = "1";
        item.Selected = true;
        ddlOptions.Items.Add(item);

        item = new ListItem();
        item.Text = GetLocalResourceObject("Option_Initial").ToString();
        item.Value = "2";
        ddlOptions.Items.Add(item);

        item = new ListItem();
        item.Text = GetLocalResourceObject("Option_AddResponse").ToString();
        item.Value = "3";
        ddlOptions.Items.Add(item);
    }

    /// <summary>
    /// Loads the stage DDL.
    /// </summary>
    /// <param name="campaign">The campaign.</param>
    private void LoadStageDDL(ICampaign campaign)
    {
        ddlStage.Items.Clear();
        if (campaign != null)
        {
            foreach (ICampaignStage stage in campaign.CampaignStages)
            {
                ddlStage.Items.Add(stage.Description);
            }
        }
    }

    /// <summary>
    /// Loads the stage to DDL.
    /// </summary>
    /// <param name="campaign">The campaign.</param>
    private void LoadStageToDDL(ICampaign campaign)
    {
        ddlToStage.Items.Clear();
        if (campaign != null)
        {
            foreach (ICampaignStage stage in campaign.CampaignStages)
            {
                ddlToStage.Items.Add(stage.Description);
            }
        }
    }

    /// <summary>
    /// Loads the picklist items.
    /// </summary>
    /// <param name="picklistName">Name of the picklist.</param>
    /// <param name="list">The list.</param>
    private static void LoadPicklistItems(String picklistName, DropDownList list)
    {
        list.Items.Clear();
        string picklistId = PickList.PickListIdFromName(picklistName);
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
                    item.Value = picklistItem.Text;
                    list.Items.Add(item);
                }
            }
        }
    }

    /// <summary>
    /// Loads the grid.
    /// </summary>
    private void LoadGrid()
    {
        grdTargets.DataSource = TargetsObjectDataSource;
        grdTargets.DataBind();
    }

    /// <summary>
    /// Creates the targets view data source.
    /// </summary>
    /// <param name="sender">The sender.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.ObjectDataSourceEventArgs"/> instance containing the event data.</param>
    protected void CreateTargetsViewDataSource(object sender, ObjectDataSourceEventArgs e)
    {
        TargetsViewDataSource dataSource = new TargetsViewDataSource();
        dataSource.SelectedFilterState = _filterState;
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
    /// Handles the Sorting event of the grdTargets control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewSortEventArgs"/> instance containing the event data.</param>
    protected void grdTargets_Sorting(object sender, GridViewSortEventArgs e)
    {
    }

    protected override void OnPreRender(EventArgs e)
    {
        base.OnPreRender(e);
        if (ScriptManager.GetCurrent(Page) != null)
            ScriptManager.GetCurrent(Page).RegisterScriptControl(this);
        IntRegisterClientScripts();
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
                tinfo.Title = GetLocalResourceObject("DialogTitle").ToString();
            }
        }

        foreach (Control c in Form_LTools.Controls)
        {
            tinfo.LeftTools.Add(c);
        }
        foreach (Control c in Form_CTools.Controls)
        {
            tinfo.CenterTools.Add(c);
        }
        foreach (Control c in Form_RTools.Controls)
        {
            tinfo.RightTools.Add(c);
        }
        return tinfo;
    }

    #region IScriptControl Members

    public IEnumerable<ScriptDescriptor> GetScriptDescriptors()
    {
        yield break;
    }

    public IEnumerable<ScriptReference> GetScriptReferences()
    {
        yield return new ScriptReference("~/smartparts/Campaign/UpdateTargets_ClientScript.js");
    }

    #endregion
}