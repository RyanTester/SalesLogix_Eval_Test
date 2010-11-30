using System;
using System.Data;
using System.Text;
using System.Configuration;
using System.Collections;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using Telerik.WebControls;
using Sage.Platform.WebPortal.SmartParts;
using Sage.Platform.Application.UI;
using Sage.Entity.Interfaces;
using System.IO;
using Sage.Platform.Application;
using Sage.Platform.Application.UI.Web;
using Sage.Platform.Application.UI.Web.Threading;
using System.Threading;
using Sage.Platform.Orm;
using Sage.SalesLogix.Services.Import;
using Sage.SalesLogix.Services.Import.Actions;
using Sage.SalesLogix.Services.PotentialMatch;
using Sage.Platform.WebPortal.Services;

public partial class ImportLeadsWizard : EntityBoundSmartPartInfoProvider
{
    private IContextService _Context;

    #region Public Methods

    /// <summary>
    /// Gets the type of the entity.
    /// </summary>
    /// <value>The type of the entity.</value>
    public override Type EntityType
    {
        get { return typeof(ILead); }
    }

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
    /// Gets the smart part info.
    /// </summary>
    /// <param name="smartPartInfoType">Type of the smart part info.</param>
    /// <returns></returns>
    public override ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        ToolsSmartPartInfo tinfo = new ToolsSmartPartInfo();
        ImportManager importManager = Page.Session["importManager"] as ImportManager;
        if (importManager != null)
        {
            tinfo.Title = String.Format(GetLocalResourceObject("dialog_StepSelectFile_Title").ToString(), Path.GetFileName(importManager.SourceFileName));
            tinfo.Description = importManager.SourceFileName;
        }
        foreach (Control c in this.pnlImportLead_RTools.Controls)
        {
            tinfo.RightTools.Add(c);
        }
        return tinfo;
    }

    #endregion

    /// <summary>
    /// Adds the DialogService for each of the wizards steps.
    /// </summary>
    /// <param name="sender">The sender.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void AddDialogServiceToPage(object sender, EventArgs e)
    {
        frmSelectFile.DialogService = DialogService;
        frmSelectFile.ContextService = ContextService;
        frmSelectFile.DialogService.onDialogClosing += OnStepClosing;
        frmDefineDelimiter.DialogService = DialogService;
        frmDefineDelimiter.DialogService.onDialogClosing += OnStepClosing;
        frmMapFields.DialogService = DialogService;
        frmMapFields.DialogService.onDialogClosing += OnStepClosing;
        frmManageDuplicates.DialogService = DialogService;
        frmManageDuplicates.DialogService.onDialogClosing += OnStepClosing;
        frmGroupActions.DialogService = DialogService;
        frmGroupActions.DialogService.onDialogClosing += OnStepClosing;
        frmReview.DialogService = DialogService;
        frmReview.DialogService.onDialogClosing += OnStepClosing;
        frmProcessRequest.DialogService = DialogService;
        frmProcessRequest.DialogService.onDialogClosing += OnStepClosing;
    }

    public void OnStepClosing(object from, WebDialogClosingEventArgs e)
    {
        IPanelRefreshService refresher = PageWorkItem.Services.Get<IPanelRefreshService>();
        if (refresher != null)
        {
            refresher.RefreshAll();
        }
    
    }

    /// <summary>
    /// Raises the <see cref="E:PreRender"/> event.
    /// </summary>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected override void OnPreRender(EventArgs e)
    {
        foreach (WizardStep step in wzdImportLeads.WizardSteps)
        {
            SetStep(step);
        }
        Button startButton = wzdImportLeads.FindControl("StartNavigationTemplateContainerID").FindControl("cmdStartButton") as Button;
        ScriptManager.GetCurrent(this.Page).RegisterPostBackControl(startButton);

        radImportProcessArea2.Visible = true;
        radProcessProgressMgr.Visible = true;


    }

    /// <summary>
    /// Handles the Click event of the startButton control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void startButton_Click(object sender, EventArgs e)
    {
        ImportManager importManager = Page.Session["importManager"] as ImportManager;
        if (importManager != null)
            importProcessId.Value = importManager.ToString();
        frmSelectFile.UploadFile();
    }

    /// <summary>
    /// Override this method to add bindings to the currrently bound smart part
    /// </summary>
    protected override void OnAddEntityBindings()
    {
    }

    /// <summary>
    /// Called when the dialog is closing.
    /// </summary>
    protected override void OnClosing()
    {
        Page.Session.Remove("importManager");
        if (DialogService.DialogParameters.ContainsKey("IsImportWizard"))
            DialogService.DialogParameters.Remove("IsImportWizard");
        base.OnClosing();
    }

    /// <summary>
    /// Handles the NextButtonClick event of the wzdImportLeads control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.WizardNavigationEventArgs"/> instance containing the event data.</param>
    protected void wzdImportLeads_NextButtonClick(object sender, WizardNavigationEventArgs e)
    {
        switch (wzdImportLeads.ActiveStepIndex)
        {
            case 0:
                PerformSelectFileActions();
                break;
            case 1:
                PerformDefineDelimiterActions();
                break;
            case 2:
                PerformMapFieldsActions();
                break;
            case 3:
                PerformManageDuplicatesActions();
                break;
            case 4:
                PerformGroupActions();
                break;
            case 5:
                PerformPreviewActions();
                break;
        }
    }

    protected void wzdImportLeads_PreviousButtonClick(object sender, WizardNavigationEventArgs e)
    {
        switch (wzdImportLeads.ActiveStepIndex)
        {
            case 0:
                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
                PreviousManageDuplicatesActions();
                break;
            case 4:
                break;
            case 5:
                break;
        }
    }

    /// <summary>
    /// Handles the CancelButtonClick event of the wzdImportLeads control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void wzdImportLeads_CancelButtonClick(object sender, EventArgs e)
    {
    }

    /// <summary>
    /// Handles the FinishButtonClick event of the wzdImportLeads control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.WizardNavigationEventArgs"/> instance containing the event data.</param>
    protected void wzdImportLeads_FinishButtonClick(object sender, WizardNavigationEventArgs e)
    {
        frmManageDuplicates.AssignMatchFilters();
        using (new SessionScopeWrapper(true))
        {
            ImportManager importManager = Page.Session["importManager"] as ImportManager;
            if (importManager != null)
            {
                importManager.ImportHistory.Save(); //Save the import history    
                ThreadPoolHelper.QueueTask(new WaitCallback(frmProcessRequest.StartImportProcess));
            }
        }
    }

    /// <summary>
    /// Handles the ActiveStepChanged event of the wzdImportLeads control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void wzdImportLeads_ActiveStepChanged(object sender, EventArgs e)
    {
        if (!frmSelectFile.ValidateRequiredFields())
            wzdImportLeads.ActiveStepIndex = 0;      
       
    }

    /// <summary>
    /// Sets the step.
    /// </summary>
    /// <param name="step">The step.</param>
    protected void SetStep(WizardStep step)
    {
        string result = string.Empty;
        if (step != null)
        {
            switch (step.ID)
            {
                case "cmdSelectFile":
                    SetStepControls(lblStep1Name, divStep1, step, IsVisited(visitedStep1.Value));
                    break;
                case "cmdDefineDelimiter":
                    SetStepControls(lblStep2Name, divStep2, step, IsVisited(visitedStep2.Value));
                    break;
                case "cmdMapFields":
                    SetStepControls(lblStep3Name, divStep3, step, IsVisited(visitedStep3.Value));
                    break;
                case "cmdManageDuplicates":
                    SetStepControls(lblStep4Name, divStep4, step, IsVisited(visitedStep4.Value));
                    break;
                case "cmdGroupActions":
                    SetStepControls(lblStep5Name, divStep5, step, IsVisited(visitedStep5.Value));
                    break;
                case "cmdReview":
                    SetStepControls(lblStep6Name, divStep6, step, IsVisited(visitedStep6.Value));
                    break;
                case "cmdProcess":
                    SetStepControls(lblStep7Name, divStep7, step, IsVisited(visitedStep7.Value));
                    break;
            }
        }
    }

    #region Private Methods

    /// <summary>
    /// Performs the select file actions.
    /// </summary>
    private void PerformSelectFileActions()
    {
        visitedStep1.Value = "True";
        frmSelectFile.SetProcessIDState(importProcessId.Value);
        frmSelectFile.SetStepSelectFileOptions();
    }

    /// <summary>
    /// Performs the define delimiter actions.
    /// </summary>
    private void PerformDefineDelimiterActions()
    {
        visitedStep2.Value = "True";
    }

    /// <summary>
    /// Performs the map fields actions.
    /// </summary>
    private void PerformMapFieldsActions()
    {
        visitedStep3.Value = "True";
    }

    /// <summary>
    /// Performs the manage duplicates actions.
    /// </summary>
    private void PerformManageDuplicatesActions()
    {
        visitedStep4.Value = "True";
        frmManageDuplicates.AssignMatchFilters();
    }

    /// <summary>
    /// Previouses the manage duplicates actions.
    /// </summary>
    private void PreviousManageDuplicatesActions()
    {
        frmManageDuplicates.AssignMatchFilters();
    }

    /// <summary>
    /// Saves options to import manager to be viewed in the preview
    /// </summary>
    private void PerformGroupActions()
    {
        visitedStep5.Value = "True";
        visitedStep6.Value = "True";
        frmGroupActions.SaveActionsState();
    }

    /// <summary>
    /// Performs the preview actions.
    /// </summary>
    private void PerformPreviewActions()
    {
        visitedStep6.Value = "True";
    }

    /// <summary>
    /// Determines whether the specified value is visited.
    /// </summary>
    /// <param name="value">The value.</param>
    /// <returns>
    /// 	<c>true</c> if the specified value is visited; otherwise, <c>false</c>.
    /// </returns>
    private bool IsVisited(string value)
    {
        if (string.IsNullOrEmpty(value))
            return false;
        return true;
    }

    /// <summary>
    /// Sets the step contorls.
    /// </summary>
    /// <param name="lblStepName">Name of the LBL step.</param>
    /// <param name="divStep">The div step.</param>
    /// <param name="step">The step.</param>
    /// <param name="visited">if set to <c>true</c> [visited].</param>
    private void SetStepControls(Label lblStepName, HtmlControl divStep, WizardStep step, bool visited)
    {
        if (lblStepName != null)
        {
            lblStepName.Text = step.Title;
            if (wzdImportLeads.ActiveStep.ID == step.ID)
            {
                lblStepName.Attributes.Add("class", "lblActive");
                lblStepName.Enabled = true;
            }
            else
            {
                if (visited)
                {
                    lblStepName.Attributes.Add("class", "lblVisited");
                    lblStepName.Enabled = true;
                }
                else
                {
                    lblStepName.Attributes.Add("class", "lblNotVisited");
                    lblStepName.Enabled = false;
                }
            }
        }

        if (divStep != null)
        {
            if (wzdImportLeads.ActiveStep.ID == step.ID)
                divStep.Attributes.Add("class", "Active");
            else
            {
                if (visited)
                    divStep.Attributes.Add("class", "Visited");
                else
                    divStep.Attributes.Add("class", "NotVisited");
            }
        }
    }

    #endregion
}
