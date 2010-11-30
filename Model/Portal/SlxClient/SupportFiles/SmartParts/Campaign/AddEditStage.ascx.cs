using System;
using System.Data;
using System.Text;
using System.Web.UI;
using System.Web.UI.WebControls;
using Sage.Platform.WebPortal.SmartParts;
using Sage.Platform.Application;
using Sage.Entity.Interfaces;
using Sage.Platform;
using Sage.Platform.Orm;
using Sage.Platform.Repository;
using System.Collections.Generic;
using Sage.Platform.ComponentModel;
using Sage.SalesLogix.CampaignStage;
using Sage.Platform.Application.UI;
using Sage.Platform.Orm.Interfaces;
using Sage.Platform.WebPortal.Services;
using Sage.Platform.WebPortal;

public partial class SmartParts_Campaign_AddEditStage : EntityBoundSmartPartInfoProvider
{
    private ICampaignStage _stage = null;
    private string _mode = string.Empty;
    private IPersistentEntity _parentEntity = null;
    private IComponentReference _parentEntityReference = null;
    private Type _relatedEntityType = null;

    /// <summary>
    /// Gets the type of the entity.
    /// </summary>
    /// <value>The type of the entity.</value>
    public override Type EntityType
    {
        get { return typeof(ICampaignStage); }
    }

    /// <summary>
    /// Gets the type of the related entity.
    /// </summary>
    /// <value>The type of the related entity.</value>
    public Type RelatedEntityType
    {
        get { return _relatedEntityType; }
    }

    /// <summary>
    /// Called when [add entity bindings].
    /// </summary>
    protected override void OnAddEntityBindings()
    {
        BindingSource.Bindings.Add(new Sage.Platform.WebPortal.Binding.WebEntityBinding("Description", txtDecription, "Text", "", ""));
        BindingSource.Bindings.Add(new Sage.Platform.WebPortal.Binding.WebEntityBinding("Status", pklStatus, "PickListValue", "", ""));
        BindingSource.Bindings.Add(new Sage.Platform.WebPortal.Binding.WebEntityBinding("StartDate", dtStartDate, "DateTimeValue", "", null));
        BindingSource.Bindings.Add(new Sage.Platform.WebPortal.Binding.WebEntityBinding("LeadSource", luLeadSource, "LookupResultValue", "", null));
        BindingSource.Bindings.Add(new Sage.Platform.WebPortal.Binding.WebEntityBinding("EndDate", dtEndDate, "DateTimeValue", "", null));
        BindingSource.Bindings.Add(new Sage.Platform.WebPortal.Binding.WebEntityBinding("Notes", txtComment, "Text", "", ""));
        BindingSource.Bindings.Add(new Sage.Platform.WebPortal.Binding.WebEntityBinding("CampaignCode", txtCode, "Text", "", ""));
    }

    /// <summary>
    /// Called when [register client scripts].
    /// </summary>
    protected override void OnRegisterClientScripts()
    {
        base.OnRegisterClientScripts();
        IntRegisterClientScripts();
    }

    /// <summary>
    /// Called when [wire event handlers].
    /// </summary>
    protected override void OnWireEventHandlers()
    {
        txtCode.Attributes.Add("onChange", string.Format("javascript: return CS_OnCodeChange(this,'{0}');",PortalUtil.JavaScriptEncode(GetLocalResourceObject("CodeChangeMSG").ToString())));
        base.OnWireEventHandlers();
    }

    /// <summary>
    /// Called when [form bound].
    /// </summary>
    protected override void OnFormBound()
    {
        base.OnFormBound();
        ClientBindingMgr.RegisterDialogCancelButton(cmdCancel);
        this._parentEntity = GetParentEntity() as Sage.Platform.Orm.Interfaces.IPersistentEntity;
        this._parentEntityReference = this._parentEntity as Sage.Platform.ComponentModel.IComponentReference;
        _stage = (ICampaignStage)this.BindingSource.Current;
        if (DialogService.DialogParameters.Count > 0)
        {
            object mode;
            if(DialogService.DialogParameters.TryGetValue("Mode", out mode))
            {
                _mode = mode.ToString();
            }
        }
        LoadView();
    }

    /// <summary>
    /// Ints the register client scripts.
    /// </summary>
    private void IntRegisterClientScripts()
    {
        string script = GetLocalResourceObject("AddEditStage_ClientScript").ToString();
        StringBuilder sb = new StringBuilder(script);
        sb.Replace("@ModeID", Mode.ClientID);
        ScriptManager.RegisterStartupScript(Page, this.GetType(), "AddEditStageScript", sb.ToString(), false);
    }

    /// <summary>
    /// Gets the smart part info.
    /// </summary>
    /// <param name="smartPartInfoType">Type of the smart part info.</param>
    /// <returns></returns>
    public override ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        ToolsSmartPartInfo tinfo = new ToolsSmartPartInfo();
        if (this.BindingSource != null)
        {
            if (this.BindingSource.Current != null)
            {
                if (_stage.Id != null)
                {
                    if (_mode == "Complete")
                    {
                        tinfo.Title = GetLocalResourceObject("DialogTitleComplete").ToString();
                    }
                    else
                    {
                        tinfo.Title = GetLocalResourceObject("DialogTitleEdit").ToString();
                    }
                }
                else
                {
                    tinfo.Title = GetLocalResourceObject("DialogTitleAdd").ToString();
                }
            }
        }

        foreach (Control c in this.Form_LTools.Controls)
        {
            tinfo.LeftTools.Add(c);
        }
        foreach (Control c in this.Form_CTools.Controls)
        {
            tinfo.CenterTools.Add(c);
        }
        foreach (Control c in this.Form_RTools.Controls)
        {
            tinfo.RightTools.Add(c);
        }
        return tinfo;
    }

    /// <summary>
    /// Handles the RowCommand event of the grdTasks control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewCommandEventArgs"/> instance containing the event data.</param>
    protected void grdTasks_RowCommand(object sender, GridViewCommandEventArgs e)
    {
    }

    /// <summary>
    /// Handles the RowDeleting event of the grdTasks control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewDeleteEventArgs"/> instance containing the event data.</param>
    protected void grdTasks_RowDeleting(object sender, GridViewDeleteEventArgs e)
    {
    }

    /// <summary>
    /// Handles the OnClick event of the cmdSave control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void cmdSave_OnClick(object sender, EventArgs e)
    {
        ICampaignStage stage = this.BindingSource.Current as ICampaignStage;
        stage.Save();
        IPanelRefreshService refresher = PageWorkItem.Services.Get<IPanelRefreshService>();
        refresher.RefreshAll();
        DialogService.CloseEventHappened(sender, e); //Close Dialog
    }

    /// <summary>
    /// Handles the OnClick event of the cmdCancel control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void cmdCancel_OnClick(object sender, EventArgs e)
    {
        DialogService.CloseEventHappened(sender, e); //Close Dialog
    }

    /// <summary>
    /// Loads the view.
    /// </summary>
    private void LoadView()
    {
        //New Stage
        if (_stage.Id == null)
        {
            _stage.Campaign = (ICampaign)_parentEntity;
            _stage.Status = GetLocalResourceObject("Status_Open").ToString();
            _stage.CampaignCode = _stage.Campaign.CampaignCode;
            _stage.StartDate = DateTime.UtcNow;
        }
        else //Existing Stage
        {
            if (_mode == "Complete")//Complete the stage.
            {
                _stage.EndDate = DateTime.UtcNow;
                _stage.Status = GetLocalResourceObject("Status_Completed").ToString();
            }
        }
        grdTasks.DataSource = _stage.CampaignTasks;
        grdTasks.DataBind();
        LoadBudget(_stage);
    }

    /// <summary>
    /// Loads the budget.
    /// </summary>
    /// <param name="stage">The stage.</param>
    private void LoadBudget(ICampaignStage stage)
    {
        try
        {
            ComponentView budget = Rules.CalculateBudget(stage);
            slxCurActualCost.Text = budget.GetProperties()["ActualCosts"].GetValue(budget).ToString();
            slxCurEstimatedCost.Text = budget.GetProperties()["EstCosts"].GetValue(budget).ToString();
            txtActualHours.Text = string.Format("{0:n}", budget.GetProperties()["ActualHours"].GetValue(budget));
            txtEstimatedHours.Text = string.Format("{0:n}",budget.GetProperties()["EstHours"].GetValue(budget));
        }
        catch
        {
           //Error Calculatig Budget.
        }
    }
}
