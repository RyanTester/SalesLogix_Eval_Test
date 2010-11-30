using System;
using System.Data;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Collections;
using System.IO;
using System.Text;
using Telerik.WebControls;
using Sage.Platform.WebPortal.SmartParts;
using Sage.Entity.Interfaces;
using System.Collections.Generic;
using Sage.Platform.Application;
using log4net;
using Sage.Platform.WebPortal.Services;
using Sage.Platform.Application.UI;
using Sage.Platform.Application.UI.Web;
using Sage.SalesLogix.Services.Import;
using Sage.SalesLogix.Services.PotentialMatch;
using Sage.SalesLogix.Client.GroupBuilder;
using Sage.SalesLogix.Services.Import.Actions;

/// <summary>
/// Summary description for Lead Imports Select a File step.
/// </summary>
public partial class StepSelectFile : UserControl, ISmartPartInfoProvider
{
    private IWebDialogService _DialogService;
    private IContextService _Context;
    static readonly ILog log = LogManager.GetLogger(System.Reflection.MethodInfo.GetCurrentMethod().DeclaringType);

    #region Public Properties

    /// <summary>
    /// Gets or sets an instance of the Dialog Service.
    /// </summary>
    /// <value>The dialog service.</value>
    [ServiceDependency]
    public IWebDialogService DialogService
    {
        set
        {
            _DialogService = value;
        }
        get
        {
            return _DialogService;
        }
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

    #endregion

    #region Public Methods

    /// <summary>
    /// Gets the smart part info.
    /// </summary>
    /// <param name="smartPartInfoType">Type of the smart part info.</param>
    /// <returns></returns>
    public ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        ToolsSmartPartInfo tinfo = new ToolsSmartPartInfo();
        return tinfo;
    }

    /// <summary>
    /// Validates the required fields.
    /// </summary>
    /// <returns></returns>
    public Boolean ValidateRequiredFields()
    {
        lblFileRequired.Visible = false;
        lblRequiredMsg.Visible = false;
        ImportManager importManager = Page.Session["importManager"] as ImportManager;
        if (importManager != null)
        {
            if (String.IsNullOrEmpty(importManager.SourceFileName))
            {
                lblFileRequired.Visible = true;
                lblRequiredMsg.Visible = true;
                return false;
            }
        }
        return true;
    }

    /// <summary>
    /// Sets the step select file options.
    /// </summary>
    public void SetStepSelectFileOptions()
    {
        ImportManager importManager = GetImportManager();
        importManager.Options.AddToGroup = chkAddToGroup.Checked;
        importManager.Options.CreateAddHocGroup = rdbCreateGroup.Checked;
        importManager.Options.AddToAddHocGroup = rdbAddToAddHocGroup.Checked;
        if (rdbCreateGroup.Checked)
            importManager.Options.AddHocGroupName = txtCreateGroupName.Text;
        else if (rdbAddToAddHocGroup.Checked)
        {
            if (lbxAddHocGroups.SelectedValue != null)
                importManager.Options.AddHocGroupId = lbxAddHocGroups.SelectedValue;
            if (lbxAddHocGroups.SelectedItem != null)
                importManager.Options.AddHocGroupName = lbxAddHocGroups.SelectedItem.Text;
        }
        txtCurrentFile.Text = importManager.SourceFileName;
        Page.Session["importManager"] = importManager;
    }

    /// <summary>
    /// Uploads the file.
    /// </summary>
    public void UploadFile()
    {
        if (uplFile.UploadedFiles.Count == 0)
            return;
        
        lblFileRequired.Visible = false;
        lblRequiredMsg.Visible = false;
        try
        {
            if (txtConfirmUpload.Value.Equals("F"))
            {
                uplFile.UploadedFiles.Clear();
            }

            if (txtConfirmUpload.Value.Equals("O"))
            {
                //elected to overwrite existing uploaded file
                ImportManager importManager = GetImportManager();
                importManager.SourceFileName = uplFile.UploadedFiles[0].FileName;
                importManager.ImportMaps.Clear();
                //importManager.SourceProperties.Clear();
                ImportOptions options = new ImportOptions();
                importManager.Options = options;
                Page.Session["importManager"] = importManager;
                txtConfirmUpload.Value = "T";
            }

            if (txtConfirmUpload.Value.Equals("T"))
            {
                UploadedFile file = uplFile.UploadedFiles[0];
                if (file != null)
                {
                    ImportManager importManager = Page.Session["importManager"] as ImportManager;
                    importManager.SourceFileName = file.FileName;
                    importManager.SourceReader = GetCSVReader(file, importManager.ToString());
                    //importManager.SourceReader = GetCSVReader(file);
                    Page.Session["importManager"] = importManager;
                }
            }
        }
        catch (Exception ex)
        {
            log.Error(ex.Message);
            DialogService.ShowMessage(ex.Message);
        }
    }

    /// <summary>
    /// Holds the state of the current import processes ID.
    /// </summary>
    /// <param name="processId">The process id.</param>
    public void SetProcessIDState(string processId)
    {
        importProcessId.Value = processId;
    }

    #endregion

    #region Protected Methods

    /// <summary>
    /// Handles the Init event of the Page control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void Page_Init(object sender, EventArgs e)
    {
        StringBuilder sb = new StringBuilder(GetLocalResourceObject("ImportLead_ClientScript").ToString());
        sb.Replace("@selectedFileId", txtImportFile.ClientID);
        sb.Replace("@confirmOverwriteFileMsg", GetLocalResourceObject("confirmOverwriteFileMsg").ToString());
        sb.Replace("@txtConfirmOverwriteId", txtConfirmUpload.ClientID);
        sb.Replace("@rdbCreateGroupId", rdbCreateGroup.ClientID);
        sb.Replace("@rdbAddToAddHocGroupId", rdbAddToAddHocGroup.ClientID);
        sb.Replace("@txtCreateGroupNameId", txtCreateGroupName.ClientID);
        sb.Replace("@lbxAddHocGroupsId", lbxAddHocGroups.ClientID);
        sb.Replace("@chkAddToGroupId", chkAddToGroup.ClientID);
        ScriptManager.RegisterClientScriptBlock(Page, this.GetType(), "ImportLeadScript", sb.ToString(), false);

        radUProgressArea.Localization["CancelButton"] = GetLocalResourceObject("radProgress_Cancel").ToString();
        radUProgressArea.Localization["Uploaded"] = GetLocalResourceObject("radProgress_Uploaded").ToString();

        rdbCreateGroup.Attributes.Add("OnClick", "rdbCreateGroup_Click();");
        rdbAddToAddHocGroup.Attributes.Add("OnClick", "rdbAddToAddHocGroup_Click();");
        chkAddToGroup.Attributes.Add("onClick", "chkAddToGroup_Click();");
    }

    /// <summary>
    /// Raises the <see cref="E:System.Web.UI.Control.PreRender"></see> event.
    /// </summary>
    /// <param name="e">An <see cref="T:System.EventArgs"></see> object that contains the event data.</param>
    protected override void OnPreRender(EventArgs e)
    {
        LoadView();
        base.OnPreRender(e);
    }

    /// <summary>
    /// Loads the view with the defaulted data.
    /// </summary>
    protected void LoadView()
    {
        ImportManager importManager = GetImportManager();
        if (importManager != null)
        {
            if (importManager.SourceFileName != null)
            {
                txtImportFile.Value = importManager.SourceFileName;
                uploadProgressAreaDiv.Style.Add(HtmlTextWriterStyle.Display, "none");
            }
            chkAddToGroup.Checked = importManager.Options.AddToGroup;
            SetDefaultTargetProperties(importManager);
            LoadAddHocGroups();
            
            Page.Session["importManager"] = importManager;
        }
    }

    /// <summary>
    /// Handles the LookupResultValueChanged event of the ownDefaultOwner control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void ownDefaultOwner_LookupResultValueChanged(object sender, EventArgs e)
    {
        string ownerId;
        if (ownDefaultOwner.LookupResultValue == null)
            ownerId = string.Empty;
        else
            ownerId = ownDefaultOwner.LookupResultValue.ToString();
        SetDefaultTargetPropertyValue("Owner", ownerId);
    }

    /// <summary>
    /// Handles the LookupResultValueChanged event of the lueLeadSource control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void lueLeadSource_LookupResultValueChanged(object sender, EventArgs e)
    {
        string leadSource = (lueLeadSource.LookupResultValue == null) ? String.Empty : lueLeadSource.LookupResultValue.ToString();
        SetDefaultTargetPropertyValue("LeadSource", leadSource);
    }

    #endregion

    #region Private Methods

    /// <summary>
    /// Gets and Sets the default target properties.
    /// </summary>
    /// <param name="importManager">The import manager.</param>
    private void SetDefaultTargetProperties(ImportManager importManager)
    {
        if (importManager.TargetPropertyDefaults == null || importManager.TargetPropertyDefaults.Count == 0)
        {
            ImportTargetProperty tpOwner = importManager.EntityManager.GetEntityProperty("Owner");
            ImportTargetProperty tpLeadSource = importManager.EntityManager.GetEntityProperty("LeadSource");
            ImportTargetProperty tpImportSource = importManager.EntityManager.GetEntityProperty("ImportSource");
            if (tpOwner != null)
            {
                IOwner owner = ImportRules.GetDefaultOwner();
                tpOwner.DefaultValue = owner.Id.ToString();
                importManager.TargetPropertyDefaults.Add(tpOwner);
                ownDefaultOwner.LookupResultValue = owner.Id;
            }
            if (tpLeadSource != null)
            {
                tpLeadSource.DefaultValue = String.Empty;
                importManager.TargetPropertyDefaults.Add(tpLeadSource);
            }
        }
        else
        {
            foreach (ImportTargetProperty tp in importManager.TargetPropertyDefaults)
            {
                if (tp.PropertyId.Equals("Owner"))
                    ownDefaultOwner.LookupResultValue = (object)Sage.Platform.EntityFactory.GetById<IOwner>(tp.DefaultValue);
                if (tp.PropertyId.Equals("LeadSource"))
                    lueLeadSource.LookupResultValue = tp.DefaultValue.ToString();
            }
        }
    }

    /// <summary>
    /// Sets the default value for the EntityProperty specified.
    /// </summary>
    /// <param name="property">The property.</param>
    /// <param name="value">The value.</param>
    private void SetDefaultTargetPropertyValue(string property, string value)
    {
        ImportManager importManager = Page.Session["importManager"] as ImportManager;
        ImportTargetProperty prop = importManager.EntityManager.GetEntityProperty(property);
        if (prop != null)
        {
            prop.DefaultValue = value;
            Page.Session["importManager"] = importManager;
        }
    }

    /// <summary>
    /// Gets the import manager.
    /// </summary>we
    /// <returns></returns>
    private ImportManager GetImportManager()
    {
        ImportManager importManager = Page.Session["importManager"] as ImportManager;
        if (importManager != null)
        {
            if (importProcessId.Value != importManager.ToString() && String.IsNullOrEmpty(txtImportFile.Value))
            {
                lblFileRequired.Visible = false;
                lblRequiredMsg.Visible = false;
                importManager = null;
            }
        }
        if (importManager == null)
        {
            try
            {
                LeadDuplicateProvider duplicateProvider = new LeadDuplicateProvider();
                txtCreateGroupName.Text = DateTime.Now.ToString();
                ImportService importService = new ImportService();
                importManager = importService.CreateImportManager(typeof(ILead));
                importManager.DuplicateProvider = duplicateProvider;
                importManager.MergeProvider = new ImportLeadMergeProvider();
                importManager.ActionManager = GetActionManager();
            }
            catch (Exception e)
            {
                divError.Style.Add(HtmlTextWriterStyle.Display, "inline");
                divMainContent.Style.Add(HtmlTextWriterStyle.Display, "none");
                lblError.Text = (e.Message);
                ((Button)Parent.Parent.FindControl("StartNavigationTemplateContainerID").FindControl("cmdStartButton")).Visible = false;
            }
        }
        return importManager;
    }

    /// <summary>
    /// Streams the data from the posted file into a new FileStream, which is then saved to the attachments folder
    /// specified in BranchOptions.
    /// </summary>
    /// <param name="file">The uploaded file.</param>
    /// <returns>The data stream.</returns>
    private byte[] GetData(UploadedFile file)
    {
        int fileLen = file.ContentLength;
        byte[] Data = new byte[fileLen];
        file.InputStream.Read(Data, 0, fileLen);
        return Data;
    }


    /// <summary>
    /// Gets the CSV reader.
    /// </summary>
    /// <param name="file">The file.</param>
    /// <param name="importId">The import id.</param>
    /// <returns></returns>
    private ImportCSVReader GetCSVReader(UploadedFile file, string importId)
    {
        
        string fileName = importId + ".csv";
        string path = ImportService.GetImportProcessPath() + fileName;
        ImportService.DeleteImportFile(path);
        file.MoveTo(path);
        ImportCSVReader reader = new ImportCSVReader(path);
        return reader;
        
    }
    /// <summary>
    /// Gets the CSV reader.
    /// </summary>
    /// <param name="file">The file.</param>
    /// <returns></returns>
    private ImportCSVReader GetCSVReader(UploadedFile file)
    {
        byte[] data = GetData(file);
        ImportCSVReader reader = new ImportCSVReader(data);
        return reader;

    }
    /// <summary>
    /// Loads the add hoc groups.
    /// </summary>
    private void LoadAddHocGroups()
    {
        if (lbxAddHocGroups.Items.Count <= 0)
        {
            lbxAddHocGroups.Items.Clear();
            IList addHocGroups = GroupInfo.GetGroupList("LEAD");
            foreach (GroupInfo group in addHocGroups)
            {
                if (group.IsAdHoc.HasValue && Convert.ToBoolean(group.IsAdHoc))
                {
                    ListItem item = new ListItem();
                    item.Text = group.GroupName;
                    item.Value = group.GroupID;
                    lbxAddHocGroups.Items.Add(item);
                }
            }
        }
    }

    /// <summary>
    /// Gets the action manager.
    /// </summary>
    /// <returns></returns>
    private IActionManager GetActionManager()
    {
        return null;
    }
    #endregion
}