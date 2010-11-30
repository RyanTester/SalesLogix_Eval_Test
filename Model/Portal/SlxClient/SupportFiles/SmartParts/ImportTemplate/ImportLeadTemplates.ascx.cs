using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using Sage.Platform.WebPortal.SmartParts;
using System.Collections.Generic;
using Sage.Entity.Interfaces;
using Sage.Platform;
using Sage.Platform.Application;
using log4net;
using Sage.SalesLogix.Services.Import;
using Sage.SalesLogix.Services.PotentialMatch;

/// <summary>
/// Summary description for ImportLeadTemplate
/// </summary>
public partial class ImportLeadTemplates : EntityBoundSmartPartInfoProvider
{
    private int _iRowTemplatesIdx = -2;

    

    /// <summary>
    /// Gets the type of the entity.
    /// </summary>
    /// <value>The type of the entity.</value>
    public override Type EntityType
    {
        get { return typeof(ILead); }
    }

    /// <summary>
    /// Override this method to add bindings to the currrently bound smart part
    /// </summary>
    protected override void OnAddEntityBindings()
    {
    }

    /// <summary>
    /// Derived components should override this method to wire up event handlers.
    /// </summary>
    protected override void OnWireEventHandlers()
    {
        btnSave.Click += cmdSave_OnClick;
        btnSave.Click += DialogService.CloseEventHappened;
        btnCancel.Click += DialogService.CloseEventHappened;
        base.OnWireEventHandlers();
    }

    /// <summary>
    /// Called when the smartpart has been bound. Derived components should override this method to run code that depends on entity context being set and it not changing.
    /// </summary>
    protected override void OnFormBound()
    {
        object sender = this;
        EventArgs e = EventArgs.Empty;
        LoadTemplates();
        base.OnFormBound();
    }

    /// <summary>
    /// Loads the Import templates.
    /// </summary>
    private void LoadTemplates()
    {
        IList<IImportTemplate> list = ImportRules.GetImportTemplates();
        grdTemplates.DataSource = list;
        grdTemplates.DataBind();
    }

    /// <summary>
    /// Gets the index of the GRD templates delete column.
    /// </summary>
    /// <value>The index of the GRD templates delete column.</value>
    protected int grdTemplatesDeleteColumnIndex
    {
        get
        {
            if (_iRowTemplatesIdx == -2)
            {
                int bias = (grdTemplates.ExpandableRows) ? 1 : 0;
                _iRowTemplatesIdx = -1;
                int colcount = 0;
                foreach (DataControlField col in grdTemplates.Columns)
                {
                    ButtonField btn = col as ButtonField;
                    if (btn != null)
                    {
                        if (btn.CommandName == "Delete")
                        {
                            _iRowTemplatesIdx = colcount + bias;
                            break;
                        }
                    }
                    colcount++;
                }
            }
            return _iRowTemplatesIdx;
        }
    }

    /// <summary>
    /// Handles the RowDataBound event of the grdTemplates control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewRowEventArgs"/> instance containing the event data.</param>
    protected void grdTemplates_RowDataBound(object sender, GridViewRowEventArgs e)
    {
        if (e.Row.RowType == DataControlRowType.DataRow)
        {
            if ((grdTemplatesDeleteColumnIndex >= 0) && (grdTemplatesDeleteColumnIndex < e.Row.Cells.Count))
            {
                TableCell cell = e.Row.Cells[grdTemplatesDeleteColumnIndex];
                foreach (Control c in cell.Controls)
                {
                    LinkButton btn = c as LinkButton;
                    if (btn != null)
                    {
                        btn.Attributes.Add("onclick", "javascript: return confirm('" + GetLocalResourceObject("grdTemplates.DeleteConfirmation").ToString() + "');");
                        return;
                    }
                }
            }
        }
    }

    /// <summary>
    /// Handles the RowCommand event of the grdTemplates control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewCommandEventArgs"/> instance containing the event data.</param>
    protected void grdTemplates_RowCommand(object sender, GridViewCommandEventArgs e)
    {
        if (e.CommandName.Equals("Delete"))
        {
            {
                int rowIndex = Convert.ToInt32(e.CommandArgument);
                string id = grdTemplates.DataKeys[rowIndex].Value.ToString();
                IImportTemplate importMap = EntityFactory.GetById<IImportTemplate>(id);
                if (importMap != null)
                {
                    importMap.Delete();
                    LoadTemplates();
                }
            }
        }
    }

    /// <summary>
    /// Handles the RowDeleting event of the grdTemplates control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewDeleteEventArgs"/> instance containing the event data.</param>
    protected void grdTemplates_RowDeleting(object sender, GridViewDeleteEventArgs e)
    {
        grdTemplates.SelectedIndex = -1;
    }

    
    /// <summary>
    /// Handles the OnClick event of the cmdSave control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void cmdSave_OnClick(object sender, EventArgs e)
    {
        if (String.IsNullOrEmpty(txtDescription.Text))
            throw new ValidationException(GetLocalResourceObject("error_NoTemplateDescription").ToString());
        else if (!ImportRules.IsValidTemplateDescription(txtDescription.Text))
            throw new ValidationException(String.Format(GetLocalResourceObject("error_DuplicateTemplateDescription").ToString(), txtDescription.Text));
        else
        {
            try
            {
                ImportManager importManager = Page.Session["importManager"] as ImportManager;
                if (importManager != null)
                {
                    ImportTemplateManager templateManager = new ImportTemplateManager(importManager.EntityManager);
                    templateManager.TemplateName = txtDescription.Text;
                    templateManager.ImportOptions = importManager.Options;
                    templateManager.ImportSourceOptions = importManager.SourceReader.GetSourceOptions();
                    templateManager.SourceProperties = importManager.SourceReader.SourceProperties;
                    templateManager.ImportMaps = importManager.ImportMaps;
                    templateManager.TargetPropertyDefaults = importManager.TargetPropertyDefaults;
                    templateManager.Owner = ImportRules.GetDefaultOwner();
                    templateManager.SaveNewTemplate();
                    importManager.Options.Template = txtDescription.Text;
                    Page.Session["importManager"] = importManager;
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
            DialogService.CloseEventHappened(sender, e);
            Refresh();
        }
    }

    /// <summary>
    /// Tries to retrieve smart part information compatible with type
    /// smartPartInfoType.
    /// </summary>
    /// <param name="smartPartInfoType">Type of information to retrieve.</param>
    /// <returns>
    /// The <see cref="T:Sage.Platform.Application.UI.ISmartPartInfo"/> instance or null if none exists in the smart part.
    /// </returns>
    public override Sage.Platform.Application.UI.ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        Sage.Platform.WebPortal.SmartParts.ToolsSmartPartInfo tinfo = new Sage.Platform.WebPortal.SmartParts.ToolsSmartPartInfo();
        foreach (Control c in this.pnlImportLeadTemplate_LTools.Controls)
        {
            tinfo.LeftTools.Add(c);
        }
        foreach (Control c in this.pnlImportLeadTemplate_CTools.Controls)
        {
            tinfo.CenterTools.Add(c);
        }
        foreach (Control c in this.pnlImportLeadTemplate_RTools.Controls)
        {
            tinfo.RightTools.Add(c);
        }

        pnlImportLeadTemplate_LTools.Visible = false;
        pnlImportLeadTemplate_CTools.Visible = false;
        pnlImportLeadTemplate_RTools.Visible = false;

        return tinfo;
    }
}
