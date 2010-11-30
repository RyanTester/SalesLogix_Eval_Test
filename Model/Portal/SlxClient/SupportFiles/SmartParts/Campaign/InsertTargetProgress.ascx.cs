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
using Sage.Platform.WebPortal.SmartParts;
using Sage.Entity.Interfaces;
using Sage.Platform.Application.UI;
using Telerik.WebControls;
using System.Threading;
using Sage.SalesLogix.CampaignTarget;
using Sage.Platform.WebPortal.Services;
using Sage.Platform.Application;
using System.Text;

public partial class InsertTargetProgress : EntityBoundSmartPartInfoProvider
{

    #region Public Methods

    /// <summary>
    /// Gets the type of the entity.
    /// </summary>
    /// <value>The type of the entity.</value>
    public override Type EntityType
    {
        get { return typeof(ICampaign); }
    }

    /// <summary>
    /// Tries to retrieve smart part information compatible with type
    /// smartPartInfoType.
    /// </summary>
    /// <param name="smartPartInfoType">Type of information to retrieve.</param>
    /// <returns>
    /// The <see cref="T:Sage.Platform.Application.UI.ISmartPartInfo"/> instance or null if none exists in the smart part.
    /// </returns>
    public override ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        ToolsSmartPartInfo tinfo = new ToolsSmartPartInfo();
        if (BindingSource != null)
        {
            if (BindingSource.Current != null)
            {
                tinfo.Description = BindingSource.Current.ToString();
                tinfo.Title = BindingSource.Current.ToString();
            }
        }

        foreach (Control control in Controls)
        {
            SmartPartToolsContainer cont = control as SmartPartToolsContainer;
            if (cont != null)
            {
                switch (cont.ToolbarLocation)
                {
                    case SmartPartToolsLocation.Right:
                        foreach (Control tool in cont.Controls)
                        {
                            tinfo.RightTools.Add(tool);
                        }
                        break;
                    case SmartPartToolsLocation.Center:
                        foreach (Control tool in cont.Controls)
                        {
                            tinfo.CenterTools.Add(tool);
                        }
                        break;
                    case SmartPartToolsLocation.Left:
                        foreach (Control tool in cont.Controls)
                        {
                            tinfo.LeftTools.Add(tool);
                        }
                        break;
                }
            }
        }
        return tinfo;
    }

    #endregion

    #region Protected Methods

    /// <summary>
    /// Derived components should override this method to wire up event handlers.
    /// </summary>
    protected override void OnWireEventHandlers()
    {
        if (ScriptManager.GetCurrent(this.Page) != null)
        {
            ScriptManager.GetCurrent(this.Page).RegisterPostBackControl(cmdStartInsert);
        }
        base.OnWireEventHandlers();
    }

    /// <summary>
    /// Called when the smartpart has been bound.  Derived components should override this method to run code that depends on entity context being set and it not changing.
    /// </summary>
    protected override void OnFormBound()
    {
        object sender = this;
        EventArgs e = EventArgs.Empty;
        base.OnFormBound();
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
        base.OnClosing();
    }

    /// <summary>
    /// Derived components should override this method to register client scripts to the page.  This only runs when the page is not loading asynchronously.
    /// </summary>
    protected override void OnRegisterClientScripts()
    {
        base.OnRegisterClientScripts();
        RegisterScripts();
    }

    /// <summary>
    /// Handles the Load event of the Page control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void Page_Load(object sender, EventArgs e)
    {
    }

    /// <summary>
    /// Register the client scripts.
    /// </summary>
    protected void RegisterScripts()
    {
        string script = GetLocalResourceObject("InsertTargetProgress_ClientScript").ToString();
        StringBuilder sb = new StringBuilder(script);
        sb.Replace("@cmdInsertStartCtrlId", cmdStartInsert.ClientID);
        sb.Replace("@cmdCloseCtrlId", cmdClose.ClientID);
        ScriptManager.RegisterStartupScript(Page, GetType(), "InsertTargetProgress_ClientScript", sb.ToString(), false);
    }

    /// <summary>
    /// Handles the OnClick event of the cmdClose control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void cmdClose_OnClick(object sender, EventArgs e)
    {
        DialogService.CloseEventHappened(sender, e);
        Refresh();
    }

    /// <summary>
    /// Gets the arguements from the handler to set the progress indicator.
    /// </summary>
    /// <param name="args">The args.</param>
    private void InsertTargetHandler(InsertProgressArgs args)
    {
        RadProgressContext insertProgress = RadProgressContext.Current;
        insertProgress["PrimaryPercent"] = Convert.ToString(Math.Round(Decimal.Divide(args.ProcessedCount, args.RecordCount) * 100));
        insertProgress["PrimaryValue"] = String.Format("({0})", args.ProcessedCount.ToString());
        insertProgress["PrimaryTotal"] = String.Format("({0})", args.RecordCount.ToString());
        insertProgress["SecondaryValue"] = String.Format("({0})", args.InsertedCount.ToString());
        insertProgress["SecondaryTotal"] = String.Format("({0})", args.ErrorCount.ToString());
        insertProgress["ProcessCompleted"] = "False";
        Thread.Sleep(1000);
    }

    /// <summary>
    /// Sets the complete process info.
    /// </summary>
    private void SetCompleteProcessInfo()
    {
        RadProgressContext insertProgress = RadProgressContext.Current;
        insertProgress["ProcessCompleted"] = "True";
        Page.Session["ImportingLeads"] = "True";
        Thread.Sleep(1000);
    }

    /// <summary>
    /// Sets the start process info.
    /// </summary>
    private void SetStartProcessInfo()
    {
        RadProgressContext insertProgress = RadProgressContext.Current;
        insertProgress["PrimaryPercent"] = "0";
        insertProgress["PrimaryValue"] = "0";
        insertProgress["PrimaryTotal"] = "0";
        insertProgress["SecondaryValue"] = "0";
        insertProgress["SecondaryTotal"] = "0";
        insertProgress["ProcessCompleted"] = "False";
    }

    /// <summary>
    /// Handles the OnClick event of the StartProcess control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void StartInsert_OnClick(object sender, EventArgs e)
    {
        if (DialogService.DialogParameters.Count > 0)
        {
            if (DialogService.DialogParameters.ContainsKey("targetsDataTable"))
            {
                DataTable targets = DialogService.DialogParameters["targetsDataTable"] as DataTable;
                SetStartProcessInfo();
                InsertTargetManager insertManager = new InsertTargetManager();
                insertManager.CampaignId = EntityContext.EntityID.ToString();
                insertManager.TargetList = targets;
                //insertManager.TargetType = _State.targetType;
                insertManager.StartTargetInsertProcess(InsertTargetHandler);
                SetCompleteProcessInfo();
                DialogService.DialogParameters.Remove("targetsDataTable");
            }
            else
            {
                //throw exception
            }
        }
    }
    #endregion
}
