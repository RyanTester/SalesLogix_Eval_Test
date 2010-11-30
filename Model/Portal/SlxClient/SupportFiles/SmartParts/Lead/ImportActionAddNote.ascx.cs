using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using Sage.Platform.WebPortal.Services;
using Sage.Platform.Application.UI;
using Sage.Platform.Application;
using Sage.Platform.WebPortal.SmartParts;
using log4net;
using Sage.SalesLogix.Services.Import.Actions;
using Sage.SalesLogix.Services.Import;
using Sage.Entity.Interfaces;

public partial class ImportActionAddNote :EntityBoundSmartPartInfoProvider // ISmartPartInfoProvider
{

    private ActionAddNote _action;
    

    #region Public Methods

    /// <summary>
    /// Gets the type of the entity.
    /// </summary>
    /// <value>The type of the entity.</value>
    public override Type EntityType
    {
        get { return typeof(IImportHistory); }
    }

    /// <summary>
    /// Gets or sets the action.
    /// </summary>
    /// <value>The action.</value>
    public ActionAddNote Action
    {
        get { return _action; }
        set { _action = value; }
    }

    /// <summary>
    /// Gets the smart part info.
    /// </summary>
    /// <param name="smartPartInfoType">Type of the smart part info.</param>
    /// <returns></returns>
    public override ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        ToolsSmartPartInfo tinfo = new ToolsSmartPartInfo();

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
        tinfo.Title = GetLocalResourceObject("Title").ToString();
        return tinfo;
    }

    #endregion

    /// <summary>
    /// Override this method to add bindings to the currrently bound smart part
    /// </summary>
    protected override void OnAddEntityBindings()
    {
    }

    /// <summary>
    /// Handles the Load event of the Page control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void Page_Load(object sender, EventArgs e)
    {
        //SetActionState();
    }

    /// <summary>
    /// Called when the smartpart has been bound.  Derived components should override this method to run code that depends on entity context being set and it not changing.
    /// </summary>
    protected override void OnFormBound()
    {
        base.OnFormBound();
        if (ClientBindingMgr != null)
        {   // register these with the ClientBindingMgr so they can do their thing without causing the dirty data warning message...
            ClientBindingMgr.RegisterBoundControl(dtpStartDate);
            ClientBindingMgr.RegisterBoundControl(pklDescription);
            ClientBindingMgr.RegisterBoundControl(pklCategory);
        }
        SetActionState();
    }

    /// <summary>
    /// Called when [wire event handlers].
    /// </summary>
    protected override void OnWireEventHandlers()
    {
        btnSave.Click += btnSave_OnClick;
        btnSave.Click += DialogService.CloseEventHappened;
        btnCancel.Click += DialogService.CloseEventHappened;

        base.OnWireEventHandlers();
    }

    /// <summary>
    /// Handles the OnClick event of the btnSave control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void btnSave_OnClick(object sender, EventArgs e)
    {
         SaveActionState(true);
         IPanelRefreshService refresher = PageWorkItem.Services.Get<IPanelRefreshService>();
         if (refresher != null)
         {
             refresher.RefreshAll();
         }
    }

    /// <summary>
    /// Handles the OnChange event of the chkTimeless control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void chkTimeless_OnChange(object sender, EventArgs e)
    {
        SaveActionState(false);
    }


    /// <summary>
    /// Sets the state of the action.
    /// </summary>
    private void SetActionState()
    {
        ImportManager importManager = GetImportManager();
        Action = importManager.ActionManager.GetAction("AddNote") as ActionAddNote;
        Action.HydrateChanges();
        txtNotes.Text = Action.History.LongNotes;
        pklCategory.PickListValue = Action.History.Category;
        pklDescription.PickListValue = Action.History.Description;
        chkTimeless.Checked = Action.History.Timeless;
        dpDuration.Value = Action.History.Duration;
        dtpStartDate.Timeless = chkTimeless.Checked;
        dtpStartDate.DisplayTime = !chkTimeless.Checked;
        dtpStartDate.DateTimeValue = Action.History.StartDate;
        dpDuration.Enabled = !chkTimeless.Checked;
        
    }

    /// <summary>
    /// Saves the state of the action.
    /// </summary>
    private void SaveActionState(bool setInit)
    {
        ImportManager importManager = GetImportManager();
        Action = importManager.ActionManager.GetAction("AddNote") as ActionAddNote;

        Action.History.LongNotes = txtNotes.Text;
        Action.History.Category = pklCategory.PickListValue;
        Action.History.Description = pklDescription.PickListValue;
        Action.History.Timeless = chkTimeless.Checked;
        //Action.History.UserId = slxUser.LookupResultValue.ToString();
        Action.History.Duration = dpDuration.Value;
        if (dtpStartDate.DateTimeValue == null)
        {
            Action.History.StartDate = DateTime.UtcNow;
        }
        else 
        {
            Action.History.StartDate = (DateTime)dtpStartDate.DateTimeValue;
        }

        if (!Action.Initialized && setInit)
        {
            Action.Initialized = true;
            Action.Active = true;
        }
        Action.SaveChanges();
        Page.Session["importManager"] = importManager;
    }

    /// <summary>
    /// Gets the import manager.
    /// </summary>
    /// <returns></returns>
    private ImportManager GetImportManager()
    {
        ImportManager importManager = Page.Session["importManager"] as ImportManager;
        if (importManager != null)
        {
        }
        else
        {
            DialogService.ShowMessage("error_ImportManager_NotFound");
        }
        return importManager;
    }
}
