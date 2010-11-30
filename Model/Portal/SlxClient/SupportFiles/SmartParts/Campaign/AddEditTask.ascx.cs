using System;
using System.Text;
using System.Web.UI;
using System.Web.UI.WebControls;
using Sage.Platform.WebPortal.SmartParts;
using Sage.Platform.Application;
using Sage.Entity.Interfaces;
using Sage.Platform;
using Sage.Platform.Orm;
using System.Collections.Generic;
using Sage.SalesLogix.Security;
using Sage.Platform.Security;
using Sage.Platform.Application.UI;
using Sage.Platform.WebPortal.Services;
using Sage.Platform.Orm.Interfaces;

public partial class SmartParts_Campaign_AddEditTask : EntityBoundSmartPartInfoProvider
{
    private ICampaignTask _task = null;
    private string _mode = null;
    private IPersistentEntity _parentEntity = null;
    
    /// <summary>
    /// Gets the type of the entity.
    /// </summary>
    /// <value>The type of the entity.</value>
    public override Type EntityType
    {
        get { return typeof(ICampaignTask); }
    }

    /// <summary>
    /// Called when [add entity bindings].
    /// </summary>
    protected override void OnAddEntityBindings()
    {
        BindingSource.Bindings.Add(new Sage.Platform.WebPortal.Binding.WebEntityBinding("Description", txtDecription, "Text", "", ""));
        BindingSource.Bindings.Add(new Sage.Platform.WebPortal.Binding.WebEntityBinding("Status", pklStatus, "PickListValue", "", ""));
        BindingSource.Bindings.Add(new Sage.Platform.WebPortal.Binding.WebEntityBinding("DueDate", dtNeededDate, "DateTimeValue", "", null));
        BindingSource.Bindings.Add(new Sage.Platform.WebPortal.Binding.WebEntityBinding("Priority", pklPriority, "PickListValue", "", ""));
        BindingSource.Bindings.Add(new Sage.Platform.WebPortal.Binding.WebEntityBinding("CompletedDate", dtCompletedDate, "DateTimeValue", "", null));
        BindingSource.Bindings.Add(new Sage.Platform.WebPortal.Binding.WebEntityBinding("PercentComplete", txtPercentComplete, "Text", "", "0.0"));
        BindingSource.Bindings.Add(new Sage.Platform.WebPortal.Binding.WebEntityBinding("Notes", txtComment, "Text", "", ""));
        BindingSource.Bindings.Add(new Sage.Platform.WebPortal.Binding.WebEntityBinding("ActualHours", numActualHours, "Text"));
        BindingSource.Bindings.Add(new Sage.Platform.WebPortal.Binding.WebEntityBinding("BudgetHours", numEstimatedHours, "Text"));
        BindingSource.Bindings.Add(new Sage.Platform.WebPortal.Binding.WebEntityBinding("ActualCost", slxCurActualCost, "Text"));
        BindingSource.Bindings.Add(new Sage.Platform.WebPortal.Binding.WebEntityBinding("BudgetAmount", slxCurEstimatedCost, "Text"));
        BindingSource.Bindings.Add(new Sage.Platform.WebPortal.Binding.WebEntityBinding("DateAssigned", dtAssignedDate, "DateTimeValue", "", null));
        //We need this so we can default the percenatage to 100%. the bindigs actually formats the percentage. 
        BindingSource.OnCurrentEntitySet += new EventHandler(BindingSource_IntOnCurrentEntitySet);
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
        rdlAssignTo.Attributes.Add("onClick", string.Format("return onAssignToTypeChange('{0}');", rdlAssignTo.ClientID.Replace("_","$")));
        base.OnWireEventHandlers();
    }

    /// <summary>
    /// Called when [form bound].
    /// </summary>
    protected override void OnFormBound()
    {
        ClientBindingMgr.RegisterDialogCancelButton(cmdCancel);
        base.OnFormBound();
    }

    /// <summary>
    /// Handles the OnCurrentEntitySet event of the BindingSource control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void BindingSource_IntOnCurrentEntitySet(object sender, EventArgs e)
    {
        _parentEntity = GetParentEntity() as IPersistentEntity;
        _task = BindingSource.Current as ICampaignTask;
        if (DialogService.DialogParameters.Count > 0)
        {
            object mode;
            if (DialogService.DialogParameters.TryGetValue("Mode", out mode))
                _mode = mode.ToString();
        }
        LoadView();
    }

    /// <summary>
    /// Ints the register client scripts.
    /// </summary>
    private void IntRegisterClientScripts()
    {
        string script = GetLocalResourceObject("AddEditTask_ClientScript").ToString();
        StringBuilder sb = new StringBuilder(script);
        sb.Replace("@opt0ID", opt0.ClientID);
        sb.Replace("@opt1ID", opt1.ClientID);
        sb.Replace("@opt2ID", opt2.ClientID);
        sb.Replace("@opt3ID", opt3.ClientID);
        sb.Replace("@opt4ID", opt4.ClientID);
        sb.Replace("@ownerTypeID", txtOwnerType.ClientID);
        ScriptManager.RegisterStartupScript(Page, GetType(), "AddEditTaskScript", sb.ToString(), false);
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
                if (_task.Id != null)
                {
                    if (_mode.ToUpper().Equals("EDIT"))
                        tinfo.Title = GetLocalResourceObject("DialogTitleEdit").ToString();
                    else
                        tinfo.Title = GetLocalResourceObject("DialogTitleComplete").ToString();
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
    /// Handles the OnClick event of the cmdSave control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void cmdSave_OnClick(object sender, EventArgs e)
    {
        ICampaignTask task = BindingSource.Current as ICampaignTask;
        ResolveOwner(task);
        task.Save();

        IPanelRefreshService refresher = PageWorkItem.Services.Get<IPanelRefreshService>();
        refresher.RefreshAll();
        DialogService.CloseEventHappened(sender, e);
    }

    /// <summary>
    /// Handles the OnClick event of the cmdCancel control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void cmdCancel_OnClick(object sender, EventArgs e)
    {
        DialogService.CloseEventHappened(sender, e);
    }

    /// <summary>
    /// Loads the view.
    /// </summary>
    private void LoadView()
    {
        if (_task.Id == null) //Insert task
        {
            //Need to move this to a bussiness rule
            _task.Campaign = (ICampaign)_parentEntity;
            _task.Status = GetLocalResourceObject("Status_Open").ToString();
            _task.DateAssigned = DateTime.UtcNow;
            _task.PercentComplete = 0; //set 0%
            _task.OwnerName = GetDefaultAssignToName();
            _task.OwnerType = "0"; //TeamUser
            _task.ActualHours = 0;
            _task.ActualCost = 0;
            _task.BudgetHours = 0;
            _task.BudgetAmount = 0;
            _task.Priority = GetLocalResourceObject("Priority_Normal").ToString();
            object stageId;
            if (DialogService.DialogParameters.TryGetValue("StageId", out stageId))
                _task.CampaignStage = GetCampaignStage(stageId.ToString());
        }
        else //Update task
        {
            if (_mode == "Complete")//Complete the task.
            {
                _task.CompletedDate = DateTime.UtcNow;
                _task.Status = GetLocalResourceObject("Status_Completed").ToString();
                _task.Completed = true;
                _task.PercentComplete = 1.0;
            }
        }
        if (_task.PercentComplete == null)
            _task.PercentComplete = 0;
        SetOwner();
    }

    /// <summary>
    /// Sets the owner.
    /// </summary>
    private void SetOwner()
    {
        opt0.Style.Add("display", "none");
        opt1.Style.Add("display", "none");
        opt2.Style.Add("display", "none");
        opt3.Style.Add("display", "none");
        opt4.Style.Add("display", "none");
        
        string s = _task.OwnerType;//slxBool Value used as enumeration ???? Thats nice.
        try
        {
            rdlAssignTo.SelectedIndex = Convert.ToInt32(s);
        }
        catch
        {
            s = "0";
            rdlAssignTo.SelectedIndex = 0;
        }
        txtOwnerType.Text = s;
        LoadDepartmentDropDown();
        switch(s)
        {
            case "0":
                opt0.Style.Add("display", "blocked");
                slxOwner.Text = _task.OwnerName;
                break;
            case "1":
                opt1.Style.Add("display", "blocked");
                ddlDepartments.SelectedValue=_task.OwnerName;
                break;
            case "2":
                opt2.Style.Add("display", "blocked");
                luContact.Text = _task.OwnerName;
                break;
            case "3":
                opt3.Style.Add("display", "blocked");
                txtOther.Text = _task.OwnerName;
                break;
            case "4":
                opt4.Style.Add("display", "blocked");
                break;
            default:
                opt0.Style.Add("display", "blocked");
                slxOwner.Text = _task.OwnerName;
                break;
        }
    }

    /// <summary>
    /// Resolves the owner.
    /// </summary>
    /// <param name="task">The task.</param>
    private void ResolveOwner(ICampaignTask task)
    {
        string ownerType = Request.Form[txtOwnerType.ClientID.Replace("_","$")];
        task.OwnerType = ownerType;
        string ownerName = string.Empty;
        string Id = string.Empty;
        switch (ownerType)
        {
            case "0":
                Id = slxOwner.ClientID + "_LookupText";
                ownerName = Request.Form[Id.Replace("_", "$")]; 
                break;
            case "1":
                Id = ddlDepartments.ClientID;
                ownerName = Request.Form[Id.Replace("_", "$")]; 
                break;
            case "2":
                Id = luContact.ClientID + "_LookupText";
                ownerName = Request.Form[Id.Replace("_", "$")]; 
                break;
            case "3":
                ownerName = Request.Form[txtOther.ClientID.Replace("_", "$")]; 
                break;
            case "4":
                ownerName = "";
                break;
            default:
                break;
        }
        task.OwnerName = ownerName;
    }

    /// <summary>
    /// Loads the department drop down.
    /// </summary>
    private void LoadDepartmentDropDown()
    {
        ddlDepartments.Items.Clear();
        IList<Owner> departmentList = GetDepartments();
        ListItem item = new ListItem();
        item.Text = string.Empty;
        item.Value = string.Empty;
        item.Selected = true;
        ddlDepartments.Items.Add(item);
        foreach (Owner owner in departmentList)
        {
            item = new ListItem();
            item.Text = owner.OwnerDescription;
            item.Value = owner.OwnerDescription;
            ddlDepartments.Items.Add(item);
        }
    }

    /// <summary>
    /// Sets the department drop down.
    /// </summary>
    /// <param name="value">The value.</param>
    private void SetDepartmentDropDownx(string value)
    {
        bool found = false;
        foreach (ListItem item in ddlDepartments.Items)
        {
            if (item.Text == value)
            {
                item.Selected = true;
                found = true;
            }
            else
            {
                item.Selected = false;
            }
        }
        if (!found)
        {
            ListItem item = new ListItem();
            item.Text = value;
            item.Value = value;
            item.Selected = true;
            ddlDepartments.Items.Add(item);
        }
    }

    /// <summary>
    /// Gets the campaign stage.
    /// </summary>
    /// <param name="stageId">The stage id.</param>
    /// <returns></returns>
    private ICampaignStage GetCampaignStage(string stageId)
    {
        ICampaignStage stage = null;
        using (new SessionScopeWrapper())
        {
            stage = EntityFactory.GetById<ICampaignStage>(stageId);
        }
        return stage;
    }

    /// <summary>
    /// Gets the departments.
    /// </summary>
    /// <returns></returns>
    private IList<Owner> GetDepartments()
    {
        IList<Owner> results = new List<Owner>();
        results = Owner.GetByOwnerType(OwnerType.Department);
        return results;
    }

    /// <summary>
    /// Gets the name of the default assign to.
    /// </summary>
    /// <returns></returns>
    private string GetDefaultAssignToName()
    {
        IUser user = null;
        SLXUserService service = ApplicationContext.Current.Services.Get<IUserService>() as SLXUserService;
        User currentUser = service.GetUser();
        user = currentUser;
        return user.ToString();
    }
}
