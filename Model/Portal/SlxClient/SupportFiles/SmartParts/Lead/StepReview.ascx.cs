using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Collections.Generic;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using Sage.Platform.WebPortal.Services;
using Sage.Platform.Application;
using log4net;
using Sage.Entity.Interfaces;
using Sage.SalesLogix.Services.Import;
using Sage.SalesLogix.Services.Import.Actions;

public partial class StepReview : UserControl
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

    /// <summary>
    /// Raises the <see cref="E:System.Web.UI.Control.PreRender"></see> event.
    /// </summary>
    /// <param name="e">An <see cref="T:System.EventArgs"></see> object that contains the event data.</param>
    protected override void OnPreRender(EventArgs e)
    {
        ImportManager importManager = Page.Session["importManager"] as ImportManager;
        if (importManager != null)
        {
            lblImportFileValue.Text = importManager.SourceFileName;
            lblLeadSourceValue.Text = GetLocalResourceObject("DefaultLeadSource_Value").ToString();
            foreach (ImportTargetProperty targetProperty in importManager.TargetPropertyDefaults)
            {
                if (targetProperty.PropertyId.Equals("Owner"))
                {
                    lblDefaultOwnerValue.Text = Sage.Platform.EntityFactory.GetById<IOwner>(targetProperty.DefaultValue).ToString();
                }
                if (targetProperty.PropertyId.Equals("LeadSource") &&  !String.IsNullOrEmpty(targetProperty.DefaultValue.ToString()))
                {
                    lblLeadSourceValue.Text = Sage.Platform.EntityFactory.GetById<ILeadSource>(targetProperty.DefaultValue).ToString();
                }
            }
            if (importManager.Options.AddToGroup)
            {
                lblAddToGroupValue.Text = GetLocalResourceObject("lblCheckDuplicatesYes.Caption").ToString();
                lblLeadsGroupValue.Text = importManager.Options.AddHocGroupName;
            }
            else 
            {
                lblAddToGroupValue.Text = GetLocalResourceObject("lblCheckDuplicatesNo.Caption").ToString();
                lblLeadsGroupValue.Text = "";
            }
            
            if (importManager.Options.CheckForDuplicates)
                lblCheckDuplicatesValue.Text = GetLocalResourceObject("lblCheckDuplicatesYes.Caption").ToString();
            else
                lblCheckDuplicatesValue.Text = GetLocalResourceObject("lblCheckDuplicatesNo.Caption").ToString();
            if (importManager.ActionManager != null)
            {
                blActions.Items.Clear();
                foreach (IAction actions in importManager.ActionManager.GetActions())
                {
                    if (actions.Active)
                    {
                      blActions.Items.Add(new ListItem(actions.DisplayName));
                    }
                }
                
            }

        }
    }
}
