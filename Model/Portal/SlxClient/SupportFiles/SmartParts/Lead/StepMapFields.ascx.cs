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
using log4net;
using System.Collections.Generic;
using Sage.Entity.Interfaces;
using Sage.Platform.WebPortal.Services;
using Sage.Platform.Application;
using Sage.Platform.Application.UI;
using Sage.Platform.WebPortal.SmartParts;
using Sage.SalesLogix.Services.Import;

/// <summary>
/// Summary description for the Import Lead wizard Map Fields step.
/// </summary>
public partial class StepMapFields : UserControl, ISmartPartInfoProvider
{
    private Int32 _iRowMatchToIdx;
    private Int32 _iRowMatchFromIdx;
    private IWebDialogService _dialogService;

    static readonly ILog log = LogManager.GetLogger(System.Reflection.MethodInfo.GetCurrentMethod().DeclaringType);

    #region Public Methods

    /// <summary>
    /// Gets or sets an instance of the Dialog Service.
    /// </summary>
    /// <value>The dialog service.</value>
    [ServiceDependency]
    public IWebDialogService DialogService
    {
        get { return _dialogService; }
        set { _dialogService = value; }
    }

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

    #endregion

    /// <summary>
    /// Raises the <see cref="E:System.Web.UI.Control.PreRender"></see> event.
    /// </summary>
    /// <param name="e">An <see cref="T:System.EventArgs"></see> object that contains the event data.</param>
    protected override void OnPreRender(EventArgs e)
    {
        ImportManager importManager = Page.Session["importManager"] as ImportManager;
        if (importManager != null)
        {
            GetImportTemplateList(importManager.Options);
            string template = cboTemplates.SelectedValue.ToString();
            cmdSave.Enabled = (!template.Equals(GetLocalResourceObject("cboTemplates.None.Item").ToString()) && !String.IsNullOrEmpty(template));
            cmdSaveAs.Enabled = true;
            IList<SourceFieldMap> sourceList = GetSourceList(importManager);
            grdSource.DataSource = sourceList;
            IList<ImportTargetProperty> targetList = importManager.GetTargetPropertyDispalyList(chkShowAllTargets.Checked, false);
            grdTarget.DataSource = targetList;
            grdTarget.DataBind();
            grdSource.DataBind();
            IList<ImportMap> importMaps = importManager.ImportMaps;
            lblMatches.Text = String.Format(GetLocalResourceObject("lblMatches.Caption").ToString(), importMaps.Count.ToString(), sourceList.Count.ToString());
        }
        else
        {
            DialogService.ShowMessage(GetLocalResourceObject("error_ImportManager_NotFound").ToString());
        }
        base.OnPreRender(e);
    }

    /// <summary>
    /// Handles the RowCreated event of the grdSource control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewRowEventArgs"/> instance containing the event data.</param>
    protected void grdSource_RowCreated(object sender, GridViewRowEventArgs e)
    {
        if (e.Row.RowType == DataControlRowType.Header)
        {
            _iRowMatchFromIdx = 0;
        }
        else if (e.Row.RowType == DataControlRowType.DataRow)
        {
            _iRowMatchFromIdx++;
            e.Row.Attributes.Add("onclick", String.Format("onGridViewRowSelected('{0}', '{1}', '{2}')", _iRowMatchFromIdx.ToString(),
                                                          grdSource.ClientID, txtMatchFromRowIndx.ClientID));
        }
    }

    /// <summary>
    /// Handles the RowCreated event of the grdTarget control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewRowEventArgs"/> instance containing the event data.</param>
    protected void grdTarget_RowCreated(object sender, GridViewRowEventArgs e)
    {
        if (e.Row.RowType == DataControlRowType.Header)
        {
            _iRowMatchToIdx = 0;
        }
        else if (e.Row.RowType == DataControlRowType.DataRow)
        {
            _iRowMatchToIdx++;
            e.Row.Attributes.Add("onclick", String.Format("onGridViewRowSelected('{0}', '{1}', '{2}')", _iRowMatchToIdx.ToString(),
                                                          grdTarget.ClientID, txtMatchToRowIndx.ClientID));
        }
    }

    /// <summary>
    /// Handles the RowCommand event of the grdSource control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewCommandEventArgs"/> instance containing the event data.</param>
    protected void grdSource_RowCommand(object sender, GridViewCommandEventArgs e)
    {
    }

    /// <summary>
    /// Handles the SelectedIndexChanged event of the cboTemplates control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void cboTemplates_SelectedIndexChanged(object sender, EventArgs e)
    {
        ImportManager importManager = Page.Session["importManager"] as ImportManager;
        if (!cboTemplates.SelectedValue.ToString().Equals(GetLocalResourceObject("cboTemplates.None.Item").ToString()))
        {
            string errorMessage = String.Empty;
            //Owner and Lead Source values are saved into the template and we don't necessarily want to overwrite these values so we'll
            //reassign them after the template is done loading.
            ImportTargetProperty tpOwner = importManager.EntityManager.GetEntityProperty("Owner");
            String ownerId = tpOwner.DefaultValue.ToString();
            ImportTargetProperty tpLeadSource = importManager.EntityManager.GetEntityProperty("LeadSource");
            String leadSourceId = tpLeadSource.DefaultValue.ToString();
            if (!importManager.AddImportMapsFromTemplate(importManager, cboTemplates.SelectedItem.Value, out errorMessage))
            {
                DialogService.ShowMessage(errorMessage);
            }
            else
            {
                importManager.Options.Template = cboTemplates.SelectedItem.Text;
                SetDefaultTargetPropertyValue("Owner", ownerId, importManager);
                SetDefaultTargetPropertyValue("LeadSource", leadSourceId, importManager);
                Page.Session["importManager"] = importManager;
            }
        }
    }

    /// <summary>
    /// Sets the default value for the EntityProperty specified.
    /// </summary>
    /// <param name="property">The property.</param>
    /// <param name="value">The value.</param>
    private void SetDefaultTargetPropertyValue(string property, string value, ImportManager importManager)
    {
        ImportTargetProperty prop = importManager.EntityManager.GetEntityProperty(property);
        if (prop != null)
        {
            prop.DefaultValue = value;
            Page.Session["importManager"] = importManager;
        }
    }

    /// <summary>
    /// Handles the OnClick event of the SaveTemplate control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void SaveTemplate_OnClick(object sender, EventArgs e)
    {
        try
        {
            ImportManager importManager = Page.Session["importManager"] as ImportManager;
            ImportTemplateManager templateManager = new ImportTemplateManager(importManager.EntityManager);
            if (templateManager != null)
            {
                templateManager.ImportOptions = importManager.Options;
                templateManager.SourceProperties = importManager.SourceProperties;
                templateManager.ImportSourceOptions = importManager.SourceReader.GetSourceOptions();
                templateManager.ImportMaps = importManager.ImportMaps;
                templateManager.TargetPropertyDefaults = importManager.TargetPropertyDefaults;
                templateManager.SaveTemplate(cboTemplates.SelectedItem.Value);
            }
            else
            {
                log.Warn(String.Format(GetLocalResourceObject("error_templateManager").ToString(), String.Empty));
            }
        }
        catch (Exception ex)
        {
            log.Error(String.Format(GetLocalResourceObject("error_templateManager").ToString(), ex.Message));
        }
    }

    /// <summary>
    /// Handles the OnClick event of the SaveAsTemplate control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void SaveAsTemplate_OnClick(object sender, EventArgs e)
    {
        if (DialogService != null)
        {
            DialogService.SetSpecs(200, 200, 250, 700, "ImportLeadTemplates", "", true);
            DialogService.EntityType = typeof(IImportTemplate);
            DialogService.ShowDialog();
        }
    }

    /// <summary>
    /// Gets the template list.
    /// </summary>
    private void GetImportTemplateList(ImportOptions options)
    {
        cboTemplates.Items.Clear();
        cboTemplates.Items.Add(GetLocalResourceObject("cboTemplates.None.Item").ToString());
        IList<IImportTemplate> list = ImportRules.GetImportTemplates();
        ListItem item;
        foreach (IImportTemplate template in list)
        {
            item = new ListItem();
            item.Text = template.TemplateName;
            item.Value = template.Id.ToString();
            if (options != null && item.Text.Equals(options.Template))
                item.Selected = true;
            cboTemplates.Items.Add(item);
        }
    }

    /// <summary>
    /// Handles the CheckedChanged event of the chkShowAllTargets control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void chkShowAllTargets_CheckedChanged(object sender, EventArgs e)
    {
    }
      
    
    /// <summary>
    /// Handles the Click event of the cmdMatch control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void cmdMatch_Click(object sender, EventArgs e)
    {
        //Get the selected record from the 'source' datagrid
        if (String.IsNullOrEmpty(txtMatchFromRowIndx.Value) || String.IsNullOrEmpty(txtMatchToRowIndx.Value))
        {
            DialogService.ShowMessage(GetLocalResourceObject("error_NoSourceTargetSelected").ToString(), "SalesLogix");
            return;
        }
        int sourceSelIdx = Convert.ToInt32(txtMatchFromRowIndx.Value) - 1;
        int targetSelIdx = Convert.ToInt32(txtMatchToRowIndx.Value) - 1;
        string sourceField = grdSource.DataKeys[sourceSelIdx].Values[0].ToString();
        string targetField = grdTarget.DataKeys[targetSelIdx].Values[0].ToString();

        ImportManager importManager = Page.Session["importManager"] as ImportManager;
        importManager.RemoveImportMap(sourceField); //Remove before we add
        importManager.AddImportMap(sourceField, targetField);
        Page.Session["importManager"] = importManager;
        txtMatchFromRowIndx.Value = String.Empty;
        txtMatchToRowIndx.Value = String.Empty;
    }

    /// <summary>
    /// Removes the selected record from the target mappings.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void cmdUnmatch_Click(object sender, EventArgs e)
    {
        if (String.IsNullOrEmpty(txtMatchFromRowIndx.Value))
        {
            DialogService.ShowMessage(GetLocalResourceObject("error_NoSourceSelected").ToString(), "SalesLogix");
            return;
        }
        ImportManager importManager = Page.Session["importManager"] as ImportManager;
        if (importManager != null)
        {
            int sourceSelIdx = Convert.ToInt32(txtMatchFromRowIndx.Value) - 1;
            string sourceField = grdSource.DataKeys[sourceSelIdx].Values[0].ToString();
            importManager.RemoveImportMap(sourceField);
            Page.Session["importManager"] = importManager;
        }
    }

    private IList<SourceFieldMap> GetSourceList(ImportManager importManager)
    {
        List<SourceFieldMap> list = new List<SourceFieldMap>();
        if (importManager != null)
        {

            foreach (ImportSourceProperty sp in importManager.GetSourcePropertyDisplayList(true))
            {
                SourceFieldMap sfm = new SourceFieldMap();
                sfm.FieldIndex = sp.FieldIndex;
                sfm.FieldName = sp.FieldName;
                foreach (ImportMap map in importManager.ImportMaps)
                {
                    if (map.SourceProperty.FieldName.Equals(sp.FieldName))
                    {
                        sfm.SLXTargetProperty = map.TargetProperty.FullDisplayName;
                        break;
                    }
                }
                list.Add(sfm);
            }
        
        }
        return list;    
    }
        

    public class SourceFieldMap
    {
        private int _FieldIndex = -1;
        private string _FieldName = string.Empty;
        private string _SLXTargetProperty =string.Empty;
        public SourceFieldMap()
        { 
        
        }
        public int FieldIndex
        {
            get { return _FieldIndex; }
            set { _FieldIndex = value; }

        }
        public string FieldName
        {
            get { return _FieldName; }
            set { _FieldName = value; }

        }
        public string SLXTargetProperty
        {
            get { return _SLXTargetProperty; }
            set { _SLXTargetProperty = value; }

        }

    }


}
