using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using log4net;
using Sage.Platform.WebPortal.SmartParts;
using System.Collections.Generic;
using System.Text;
using Sage.Entity.Interfaces;
using Sage.Platform.WebPortal.Services;
using Sage.Platform.Application;
using Sage.SalesLogix.Services.Import;

/// <summary>
/// Summary description for Lead Imports Define Delimiter step.
/// </summary>
public partial class StepDefineDelimiter : UserControl
{
    private IWebDialogService _DialogService;
    static readonly ILog log = LogManager.GetLogger(System.Reflection.MethodInfo.GetCurrentMethod().DeclaringType);

    #region Public Methods

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

    #endregion

    #region Private Methods

    /// <summary>
    /// Raises the <see cref="E:System.Web.UI.Control.PreRender"></see> event.
    /// </summary>
    /// <param name="e">An <see cref="T:System.EventArgs"></see> object that contains the event data.</param>
    protected override void OnPreRender(EventArgs e)
    {
        LoadPreviewGrid();
        base.OnPreRender(e);
    }

    /// <summary>
    /// Loads the preview grid.
    /// </summary>
    private void LoadPreviewGrid()
    {
        ImportManager importManager = GetImportManager();
        if (importManager != null)
        {
            txtOtherDelimiter.Enabled = (rdbOther.Checked);
            try
            {
                grdPreview.DataSource = importManager.SourcePreview;
                grdPreview.DataBind();
                Page.Session["importManager"] = importManager;
            }
            catch (Exception ex)
            {
                log.Warn(String.Format(GetLocalResourceObject("error_PreviewData").ToString(), ex.Message));
            }
        }
        else
        {
            log.Warn(GetLocalResourceObject("error_MissingImportFile".ToString()));
        }
    }
    
    /// <summary>
    /// Gets the import manager.
    /// </summary>
    /// <returns></returns>
    private ImportManager GetImportManager()
    {
        ImportManager importManager = Page.Session["importManager"] as ImportManager;
        if (importManager == null)
            importManager = new ImportManager(typeof(ILead));
        if (importManager != null)
        {
            ImportCSVOptions options = ((ImportCSVReader)importManager.SourceReader).Options;
            if (rdbOther.Checked)
            { 
                if (!String.IsNullOrEmpty(txtOtherDelimiter.Text))
                    options.Delimiter = Convert.ToChar(txtOtherDelimiter.Text);
            }
            else
            {
                options.Delimiter = GetSelectedDelimiter();
            }
            if (!lbxQualifier.SelectedValue.ToString().Equals("None"))
            {
                options.Qualifier = Convert.ToChar(lbxQualifier.SelectedValue);
            }
            else
            {
                options.Qualifier = '\x000';
            }
            options.FirstRowColHeader = chkFirstRow.Checked;
        }
        return importManager;
    }

    /// <summary>
    /// Gets the selected delimiter.
    /// </summary>
    /// <returns></returns>
    private Char GetSelectedDelimiter()
    {
        if (rdbTab.Checked)
            return 't';
        else if (rdbComma.Checked)
            return ',';
        else if (rdbSemiColon.Checked)
            return ';';
        else if (rdbSpace.Checked)
            return ' ';
        else
            return ',';
    }

    /// <summary>
    /// Handles the CheckedChanged event of the chkFirstRow control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void chkFirstRow_CheckedChanged(object sender, EventArgs e)
    {
    }

    /// <summary>
    /// Handles the SelectedIndexChanged event of the lbxQualifier control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void lbxQualifier_SelectedIndexChanged(object sender, EventArgs e)
    {
    }
    
    protected void txtOtherDelimiter_OnTextChanged(object sender, EventArgs e)
    {
    }

    #endregion
}

