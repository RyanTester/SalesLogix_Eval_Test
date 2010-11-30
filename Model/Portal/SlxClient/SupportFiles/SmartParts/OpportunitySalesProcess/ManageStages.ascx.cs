using System;
using System.Data;
using System.Configuration;
using System.IO;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Text;
using System.Drawing;
using System.Collections.Generic;
using NHibernate;
using Sage.SalesLogix.Entities;
using Sage.Entity.Interfaces;
using Sage.SalesLogix;
using Sage.SalesLogix.Web.Controls;
using Sage.SalesLogix.Security;
using Sage.Platform.WebPortal.Services;
using Sage.Platform.WebPortal.SmartParts;
using Sage.Platform.Security;
using Sage.Platform.Application;
using Sage.Platform.Orm;
using Sage.Platform;
using Sage.SalesLogix.SalesProcess;
using Sage.SalesLogix.HighLevelTypes;
using Sage.SalesLogix.Plugins;


public partial class SmartParts_OpportunitySalesProcess_ManageStages : EntityBoundSmartPartInfoProvider, IScriptControl
{
   
    private ISalesProcesses _salesProcess = null;
   
    /// <summary>
    /// Called when [add entity bindings].
    /// </summary>
    protected override void OnAddEntityBindings()
    {


    }
    /// <summary>
    /// Gets the type of the entity.
    /// </summary>
    /// <value>The type of the entity.</value>
     public override Type EntityType
    {
        get { return typeof(Sage.Entity.Interfaces.IOpportunity); }
    }


    /// <summary>
    /// Called when [form bound].
    /// </summary>
    protected override void OnFormBound()
    {
        base.OnFormBound();
        LoadView();

    }

    /// <summary>
    /// Called when [wire event handlers].
    /// </summary>
    protected override void OnWireEventHandlers()
    {
        base.OnWireEventHandlers();
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
    /// Loads the view.
    /// </summary>
    private void LoadView()
    {
        string opportunityId = this.EntityContext.EntityID.ToString();
        LoadSalesProcess(opportunityId);
        
    }

    protected override void OnPreRender(EventArgs e)
    {
        base.OnPreRender(e);

        if (Visible)
        {
            // required to register the .js file used in this page
            if (DesignMode == false)
            {
                if (ScriptManager.GetCurrent(Page) != null)
                {
                    ScriptManager.GetCurrent(Page).RegisterScriptControl(this);
                }
            }
        }
    }


    /// <summary>
    /// Ints the register client scripts.
    /// </summary>
    protected void IntRegisterClientScripts()
    {
        if (!ScriptManager.GetCurrent(Page).IsInAsyncPostBack)
        {
            //string script = GetLocalResourceObject("ManageStages_ClientScript").ToString();
            //StringBuilder sb = new StringBuilder(script);
            //this.Page.ClientScript.RegisterClientScriptBlock(this.GetType(), "ManageStages", sb.ToString(), false);
            //string jvScript = "<script src='SmartParts/OpportunitySalesProcess/ManageStages_ClientScript.js' type='text/javascript'></script>";
            //ScriptManager.RegisterClientScriptBlock(Page, GetType(), "ManageStages", jvScript, false);
            //ScriptManager.RegisterClientScriptInclude(Page, GetType(), "ManageStages", "SmartParts/OpportunitySalesProcess/ManageStages_ClientScript.js");

        }
    }
    /// <summary>
    /// Gets the smart part info.
    /// </summary>
    /// <param name="smartPartInfoType">Type of the smart part info.</param>
    /// <returns></returns>
    public override Sage.Platform.Application.UI.ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        Sage.Platform.WebPortal.SmartParts.ToolsSmartPartInfo tinfo = new Sage.Platform.WebPortal.SmartParts.ToolsSmartPartInfo();
        if (this.BindingSource != null)
        {
            if (this.BindingSource.Current != null)
            {
                //
            }

        }
        if (GetLocalResourceObject("Title") != null)
        {
            tinfo.Title = GetLocalResourceObject("Title").ToString();
        }
        foreach (Control c in this.ManageStages_LTools.Controls)
        {
            tinfo.LeftTools.Add(c);
        }
        foreach (Control c in this.ManageStages_CTools.Controls)
        {
            tinfo.CenterTools.Add(c);
        }
        foreach (Control c in this.ManageStages_RTools.Controls)
        {
            tinfo.RightTools.Add(c);
        }
        return tinfo;
    }

    /// <summary>
    /// Called when [my dialog closing].
    /// </summary>
    /// <param name="from">From.</param>
    /// <param name="e">The <see cref="Sage.Platform.WebPortal.Services.WebDialogClosingEventArgs"/> instance containing the event data.</param>
    protected override void OnMyDialogClosing(object from, WebDialogClosingEventArgs e)
    {
        base.OnMyDialogClosing(from, e);
        //we nned to refresh the salesprocess page or we will get un wanted postbacks on the Stages DDL.
        Session.Remove("MANAGESTAGESACTIVE");
        Sage.Platform.WebPortal.Services.IPanelRefreshService refresher = PageWorkItem.Services.Get<Sage.Platform.WebPortal.Services.IPanelRefreshService>();
        refresher.RefreshAll(); 
              
    }
    /// <summary>
    /// Called when [my dialog opening].
    /// </summary>
    protected override void OnMyDialogOpening()
    {
        base.OnMyDialogOpening();
        Session.Add("MANAGESTAGESACTIVE", "T");
    }


    /// <summary>
    /// Loads the sales process.
    /// </summary>
    /// <param name="opportunityId">The opportunity id.</param>
    private void LoadSalesProcess(string opportunityId)
    {


        IOpportunity opp = EntityFactory.GetRepository<IOpportunity>().FindFirstByProperty("Id", opportunityId);
        if( opp != null)
        {
            txtOpportunity.Text = opp.Description;
        }

        ISalesProcesses salesProcess = Sage.SalesLogix.SalesProcess.Helpers.GetSalesProcess(opportunityId);
        _salesProcess = salesProcess;
        if (salesProcess != null)
        {
            txtSalesProcess.Text = salesProcess.Name;
            LoadSnapShot(salesProcess);
            IList<ISalesProcessAudit> list = salesProcess.GetSalesProcessAudits();
            grdStages.DataSource = list;
            grdStages.DataBind();
        }
        else 
        {
            List<ISalesProcessAudit> list = new List<ISalesProcessAudit>(); 
            grdStages.DataSource = list;
            grdStages.DataBind();
        }             
    }


    /// <summary>
    /// Loads the snap shot.
    /// </summary>
    /// <param name="salesProcess">The sales process.</param>
    private void LoadSnapShot(ISalesProcesses salesProcess)
    {
        foreach (ISalesProcessAudit spAudit in salesProcess.SalesProcessAudits)
        {
            if (spAudit.ProcessType == "STAGE")
            {
                if (spAudit.IsCurrent == true)
                {
                    SetSnapShot(spAudit);   
                }
            }
        }
        
    }

    /// <summary>
    /// Sets the snap shot.
    /// </summary>
    /// <param name="stage">The stage.</param>
    private void SetSnapShot(ISalesProcessAudit stage)
    {
        if (stage != null)
        {
            valueCurrnetStage.Text = stage.StageName;
            valueProbabilty.Text = stage.Probability.ToString() + "%";
            valueDaysInStage.Text = Convert.ToString(this._salesProcess.DaysInStage(stage.Id.ToString()));
            valueEstDays.Text = Convert.ToString(this._salesProcess.EstimatedDaysToClose());
            dtpEstClose.DateTimeValue = (DateTime)this._salesProcess.EstimatedCloseDate();
        }
        else
        {
            valueCurrnetStage.Text = "''";
            valueProbabilty.Text = "0%";
            valueDaysInStage.Text = "0";
            valueEstDays.Text = "0";
            dtpEstClose.DateTimeValue = DateTime.MinValue;
            dtpEstClose.Text = string.Empty;
        }
    }
    /// <summary>
    /// Handles the RowDataBound event of the grdStages control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewRowEventArgs"/> instance containing the event data.</param>
    protected void grdStages_RowDataBound(object sender, GridViewRowEventArgs e)
    {
        if (e.Row.RowType == DataControlRowType.DataRow)
        {
            ISalesProcessAudit spAudit = (ISalesProcessAudit)e.Row.DataItem;
            if ((spAudit.ProcessType == "HEADER") || (spAudit.ProcessType == "FOOTER")||(spAudit.ProcessType == "STEP"))
            {
                e.Row.Cells.Clear();
                return;

            }
            if (spAudit.ProcessType == "STAGE")
            {
                CheckBox chkStageComplete = ((CheckBox)e.Row.FindControl("chkStageComplete"));
                if (chkStageComplete != null)
                {
                    chkStageComplete.Attributes.Add("onClick", string.Format("return onCompleteStage('{0}','{1}','{2}');", cmdCompleteStage.ClientID, stageContext.ClientID, spAudit.Id.ToString() + ":" + spAudit.Completed));
                    chkStageComplete.Checked = (spAudit.Completed == true);
                }

                CheckBox chkStageCurrnet = ((CheckBox)e.Row.FindControl("chkStageCurrent"));
                if (chkStageCurrnet != null)
                {
                    chkStageCurrnet.Attributes.Add("onClick", string.Format("return onSetCurrent('{0}','{1}','{2}');", cmdSetCurrent.ClientID, currentContext.ClientID, spAudit.Id.ToString() + ":" + spAudit.IsCurrent));
                    chkStageCurrnet.Checked = (spAudit.IsCurrent == true);
                    chkStageCurrnet.Enabled = (spAudit.IsCurrent != true);
                }
                               

                Sage.SalesLogix.Web.Controls.DateTimePicker dtpStartDate = (Sage.SalesLogix.Web.Controls.DateTimePicker)e.Row.FindControl("dtpStartDate");
                if (dtpStartDate != null)
                {
                    dtpStartDate.SetClientSideChangeHandler(string.Format("onStartStageWithDate(this,'{0}','{1}','{2}');", cmdStartDate.ClientID, startDateContext.ClientID, spAudit.Id.ToString()));
                    if (spAudit.StartDate != null)
                    {
                        dtpStartDate.DateTimeValue = (DateTime)spAudit.StartDate;
                    }
                    else
                    {
                        dtpStartDate.DateTimeValue = DateTime.MinValue;
                        dtpStartDate.Text = string.Empty;
                    }
                }
                Sage.SalesLogix.Web.Controls.DateTimePicker dtpCompletedDate = (Sage.SalesLogix.Web.Controls.DateTimePicker)e.Row.FindControl("dtpCompleteDate");
                if (dtpCompletedDate != null)
                {
                    dtpCompletedDate.SetClientSideChangeHandler(string.Format("onCompleteStageWithDate(this,'{0}','{1}','{2}');", cmdCompleteDate.ClientID, completeDateContext.ClientID, spAudit.Id.ToString()));
                    if (spAudit.CompletedDate != null)
                    {
                        dtpCompletedDate.DateTimeValue = (DateTime)spAudit.CompletedDate;
                    }
                    else
                    {
                        dtpCompletedDate.DateTimeValue = DateTime.MinValue;
                        dtpCompletedDate.Text = string.Empty;
                    }
                }

            }
            
        }
    }

    /// <summary>
    /// Handles the OnClick event of the cmdCompleteStage control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void cmdCompleteStage_OnClick(object sender, EventArgs e)
    {

        string stageContextValue = Request.Form[ResolveClientId(stageContext.ClientID)];
        string[] args = stageContextValue.Split(new Char[] { ':' });
        string spaid = args[0];
        ISalesProcesses salesProcess = Sage.SalesLogix.SalesProcess.Helpers.GetSalesProcess(this.EntityContext.EntityID.ToString());
        if (args[1] == "False")
        {
            string result = salesProcess.CanCompleteStage(spaid);
            if (result == string.Empty)
            {
                salesProcess.CompleteStage(spaid, DateTime.Now);
                salesProcess.Save();
            }
            else
            {

                if (DialogService != null)
                {
                    DialogService.ShowMessage(result);
                }
                return;
            }
        }
        else
        {
            salesProcess.UnCompleteStage(spaid);
            salesProcess.Save();
        }


    }
    /// <summary>
    /// Handles the OnClick event of the cmdSetCurrent control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void cmdSetCurrent_OnClick(object sender, EventArgs e)
    {

        string currentContextValue = Request.Form[ResolveClientId(currentContext.ClientID)];
        string[] args = currentContextValue.Split(new Char[] { ':' });
        string spaid = args[0];
        ISalesProcesses salesProcess = Sage.SalesLogix.SalesProcess.Helpers.GetSalesProcess(this.EntityContext.EntityID.ToString());
        if (args[1] == "False")
        {
            string result = salesProcess.CanMoveToStage(spaid);
            if (result == string.Empty)
            {
                salesProcess.SetToCurrentStage(spaid);
                salesProcess.Save();
            }
            else
            {

                if (DialogService != null)
                {
                    DialogService.ShowMessage(result);
                }
                return;
            }
        }
        
    }

    /// <summary>
    /// Handles the OnClick event of the cmdCompleteDate control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void cmdCompleteDate_OnClick(object sender, EventArgs e)
    {

        string contextValue = Request.Form[ResolveClientId(completeDateContext.ClientID)];
        string[] args = contextValue.Split(new Char[] { ':' });
        string spaid = args[0];
        DateTime completeDate = ResolveDateTime(args[1]);
        ISalesProcesses salesProcess = Sage.SalesLogix.SalesProcess.Helpers.GetSalesProcess(this.EntityContext.EntityID.ToString());
        string result = salesProcess.CanCompleteStage(spaid);
        if (result == string.Empty)
        {
            salesProcess.CompleteStage(spaid, completeDate);
            salesProcess.Save();
        }
        else
        {

            if (DialogService != null)
            {
                DialogService.ShowMessage(result);
            }
            return;
        }
    }

    /// <summary>
    /// Handles the OnClick event of the cmdStartDate control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void cmdStartDate_OnClick(object sender, EventArgs e)
    {
        string contextValue = Request.Form[ResolveClientId(startDateContext.ClientID)];
        string[] args = contextValue.Split(new Char[] { ':' });
        string spaid = args[0];
        DateTime startDate = ResolveDateTime(args[1]);
        ISalesProcesses salesProcess = Sage.SalesLogix.SalesProcess.Helpers.GetSalesProcess(this.EntityContext.EntityID.ToString());
        salesProcess.StartStage(spaid, startDate);
        salesProcess.Save();

    }


    /// <summary>
    /// Handles the onDialogOpening event of the DialogService control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void DialogService_onDialogOpening(object sender, EventArgs e)
    {

        if (DialogService.SmartPartMappedID == this.ID)
        {
            string opportunityId = this.EntityContext.EntityID.ToString();
            LoadSalesProcess(opportunityId);
            
        }
    }
    /// <summary>
    /// Handles the onDialogClosing event of the DialogService control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void DialogService_onDialogClosing(object sender, EventArgs e)
    {

        if (DialogService.SmartPartMappedID == this.ID)
        {
           
            Response.Redirect(Request.Url.ToString());
        }
    }


    /// <summary>
    /// Resolves the client id.
    /// </summary>
    /// <param name="clientId">The client id.</param>
    /// <returns></returns>
    private string ResolveClientId(string clientId)
    {
        string id;
        id = clientId.Replace("_", "$");
        return id;
    }
    /// <summary>
    /// Resolves the date time.
    /// </summary>
    /// <param name="textDate">The text date.</param>
    /// <returns></returns>
    private DateTime ResolveDateTime(string textDate)
    {

        DateTime result = DateTime.MinValue;
        string[] vals = textDate.Split(',');
        if (vals.Length > 1)
        {
            int year = int.Parse(vals[0]);
            int month = int.Parse(vals[1]);
            int day = int.Parse(vals[2]);
            int hour = int.Parse(vals[3]);
            int min = int.Parse(vals[4]);

            result = new DateTime(year, month, day, 0, 0, 0);

            //return result.ToUniversalTime();
        }
        return result;
    }
    public IEnumerable<ScriptDescriptor> GetScriptDescriptors()
    {
        yield break;
    }
    public IEnumerable<ScriptReference> GetScriptReferences()
    {

        List<ScriptReference> refs = new List<ScriptReference>();
        ScriptReference javRef = new ScriptReference("~/SmartParts/OpportunitySalesProcess/ManageStages_ClientScript.js");
        //refs.Add(javRef);
        return refs;
    }
}
