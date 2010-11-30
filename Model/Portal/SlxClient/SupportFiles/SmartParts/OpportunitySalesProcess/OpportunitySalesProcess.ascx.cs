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
using System.Xml;
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
using Sage.Platform.Application.Services;
using Sage.Platform.Orm;
using Sage.Platform;
using Sage.SalesLogix.SalesProcess;
using Sage.SalesLogix.HighLevelTypes;
using Sage.SalesLogix.Plugins;
using Sage.Common.Syndication.Json;
using Sage.Platform.Application.UI;
using Sage.SalesLogix.Activity;
using Sage.Platform.WebPortal.Binding;


public partial class SmartParts_OpportunitySalesProcess_SalesProcess : EntityBoundSmartPartInfoProvider , IScriptControl
{
    private ISalesProcesses _salesProcess = null;
    private IOpportunity _opportunity = null;

    private LinkHandler _LinkHandler;
    private LinkHandler Link
    {
        get
        {
            if (_LinkHandler == null)
                _LinkHandler = new LinkHandler(Page);
            return _LinkHandler;
        }
    }

    /// <summary>
    /// Gets the type of the entity.
    /// </summary>
    /// <value>The type of the entity.</value>
    public override Type EntityType
    {
        get { return typeof(IOpportunity); }
    }

    /// <summary>
    /// Called when [add entity bindings].
    /// </summary>
    protected override void OnAddEntityBindings()
    {
    }

    /// <summary>
    /// Raises the <see cref="E:EntityContextChanged"/> event.
    /// </summary>
    /// <param name="e">The <see cref="Sage.Platform.Application.EntityContextChangedEventArgs"/> instance containing the event data.</param>
    protected override void OnEntityContextChanged(EntityContextChangedEventArgs e)
    {
        base.OnEntityContextChanged(e);
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
    /// Loads the view.
    /// </summary>
    private void LoadView()
    {
        if (this.Visible)
        {
            this._opportunity = GetParentEntity() as IOpportunity;
            string opportunityId = this.EntityContext.EntityID.ToString();
            luOppContact.SeedProperty = "Opportunity.Id";
            luOppContact.SeedValue = opportunityId;
            txtOpportunityId.Value = opportunityId;

            //set the current userId
            SLXUserService service = ApplicationContext.Current.Services.Get<IUserService>() as SLXUserService;
            IUser user = service.GetUser() as IUser;
            currentUserId.Value = user.Id.ToString();

            //set the primary opp contactid
            IContact primeContact = GetPrimaryOppContact(opportunityId);
            if (primeContact != null)
                primaryOppContactId.Value = primeContact.Id.ToString();
            else
                primaryOppContactId.Value = string.Empty;

            //set the account manager id
            accountManagerId.Value = _opportunity.AccountManager.Id.ToString();

            //Set the opportunity contact count
            txtOppContactCount.Value = Convert.ToString(GetOppContactCount(opportunityId));
            LoadSalesProcessDropDown();
            LoadSalesProcess(opportunityId);
        }

    }

    /// <summary>
    /// Called when [wire event handlers].
    /// </summary>
    protected override void OnWireEventHandlers()
    {
        ddLSalesProcess.Attributes.Add("onchange", "return onSalesProcessChange();");
        cmdSelectContactNext.Attributes.Add("onclick", "return onSelectContactNext();");
        cmdSelectUserNext.Attributes.Add("onclick", "return onSelectUserNext();");
        cmdCompleteStep.Attributes.Add("onclick", "return doPostBack(this);");
        base.OnWireEventHandlers();
    }
    /// <summary>
    /// Called when [register client scripts].
    /// </summary>
    protected override void OnRegisterClientScripts()
    {
        base.OnRegisterClientScripts();
        intRegisterClientScripts();
        RegisterWebService();
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
    /// Registers the client scripts.
    /// </summary>
    protected void intRegisterClientScripts()
    {
        OppSalesProcessScriptStrings spCtrlIDs = new OppSalesProcessScriptStrings();
        spCtrlIDs.ddlSalesProcessCtrlId = ddLSalesProcess.ClientID;
        spCtrlIDs.ddlStagesCtrlId = ddlStages.ClientID;
        spCtrlIDs.salesProcessGridCtrlId = SalesProcessGrid.ClientID;   // <---<<<  not used... ???
        spCtrlIDs.currentSalesProcessCtrlId = txtCurrentSalesProcessName.ClientID;
        spCtrlIDs.currentStageCtrlId = txtCurrentStage.ClientID;
        spCtrlIDs.numOfStepsCompletedCtrlId = txtNumOfStepsCompleted.ClientID;
        spCtrlIDs.opportunityIdCtrlId = txtOpportunityId.ClientID;
        spCtrlIDs.oppContactCountCtrlId = txtOppContactCount.ClientID;
        spCtrlIDs.luOppContactCtrlId = luOppContact.ClientID;
        spCtrlIDs.luOppContactObj = luOppContact.ClientID + "_obj";
        spCtrlIDs.luUserCtrlId = luUser.ClientID;
        spCtrlIDs.luUserObj = luUser.ClientID + "_obj";
        spCtrlIDs.selectedContactIdCtrlId = selectedContactId.ClientID;
        spCtrlIDs.selectedUserIdCtrlId = selectedUserId.ClientID;
        spCtrlIDs.cmdDoActionCtrlId = cmdDoAction.ClientID;
        spCtrlIDs.actionContextCtrlId = actionContext.ClientID;
        spCtrlIDs.primaryOppContactIdCtrlId = primaryOppContactId.ClientID;
        spCtrlIDs.accountManagerIdCtrlId = accountManagerId.ClientID;
        spCtrlIDs.currentUserIdCtrlId = currentUserId.ClientID;

        string script = string.Format("var spCtrlIDs = {0};", JavaScriptConvert.SerializeObject(spCtrlIDs));
        ScriptManager.RegisterStartupScript(Page, GetType(), "OppSPCtrlIDs", script, true);

        //string jvScript = "<script src='SmartParts/OpportunitySalesProcess/OpportunitySalesProcess_ClientScript.js' type='text/javascript'></script>";
        //ScriptManager.RegisterClientScriptBlock(Page, GetType(), "salesprocesscript", jvScript, false);
        
        //ScriptManager.RegisterStartupScript(Page, GetType(), "salesprocesscript", Page.ResolveClientUrl("SmartParts/OpportunitySalesProcess/OpportunitySalesProcess_ClientScript.js"),true);
        
        //string vbscript = "<script type='text/vbscript' src='SmartParts/OpportunitySalesProcess/SpMailMerge_ClientScript.vbs'></script>";
        //ScriptManager.RegisterClientScriptBlock(Page, GetType(), "SPMailMergeScript", vbscript, false);
        //ScriptManager.RegisterStartupScript(Page, GetType(), "SPMailMergeScript", vbscript, false);

    }

    /// <summary>
    /// Registers the web service.
    /// </summary>
    protected void RegisterWebService()
    {
        ServiceReference item = new ServiceReference();
        item.Path = "~/SmartParts/OpportunitySalesProcess/SalesProcessWebService.asmx";
        item.InlineScript = true;
        scriptManagerProxy.Services.Add(item);
    }

    /// <summary>
    /// Gets the smart part info.
    /// </summary>
    /// <param name="smartPartInfoType">Type of the smart part info.</param>
    /// <returns></returns>
    public override ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        ToolsSmartPartInfo tinfo = new ToolsSmartPartInfo();
        foreach (Control c in this.SalesProcess_LTools.Controls)
        {
            tinfo.LeftTools.Add(c);
        }
        foreach (Control c in this.SalesProcess_CTools.Controls)
        {
            tinfo.CenterTools.Add(c);
        }
        foreach (Control c in this.SalesProcess_RTools.Controls)
        {
            tinfo.RightTools.Add(c);
        }
        return tinfo;
    }

    /// <summary>
    /// Loads the sales process.
    /// </summary>
    /// <param name="opportunityId">The opportunity id.</param>
    private void LoadSalesProcess(string opportunityId)
    {
        ISalesProcesses salesProcess = Helpers.GetSalesProcess(opportunityId);
        _salesProcess = salesProcess;
        if (salesProcess != null)
        {
            IList<ISalesProcessAudit> list = salesProcess.GetSalesProcessAudits();
            LoadStagesDropDown(list);
            SalesProcessGrid.DataSource = list;
            SalesProcessGrid.DataBind();
            SetDDLSalesProcess(salesProcess.Name);
            txtNumOfStepsCompleted.Value = Convert.ToString(salesProcess.NumberOfStepsCompleted());
            txtCurrentSalesProcessName.Value = salesProcess.Name;
            txtCurrentSalesProcessId.Value = salesProcess.Id.ToString();
        }
        else
        {
            LoadStagesDropDown(null);
            List<ISalesProcessAudit> list = new List<ISalesProcessAudit>();
            SalesProcessGrid.DataSource = list;
            SalesProcessGrid.DataBind();
            IUserOptionsService userOption = ApplicationContext.Current.Services.Get<IUserOptionsService>();
            string defSalesProcess = userOption.GetCommonOption("cboSalesProcess", "OpportunityDefaults");
            if (string.IsNullOrEmpty(defSalesProcess))
                defSalesProcess = "NONE";
            SetDDLSalesProcess(defSalesProcess);
            txtNumOfStepsCompleted.Value = "0";
            txtCurrentSalesProcessName.Value = String.Empty;
            txtCurrentSalesProcessId.Value = String.Empty;
        }
    }

    /// <summary>
    /// Loads the sales process drop down.
    /// </summary>
    private void LoadSalesProcessDropDown()
    {
        ddLSalesProcess.Items.Clear();
        IList<Plugin> pluginList = null;
        pluginList = Helpers.GetSalesProcessPluginList();
        ListItem item = new ListItem();
        item.Text = GetLocalResourceObject("SalesProcess_None").ToString();
        item.Value = "NONE";
        ddLSalesProcess.Items.Add(item);
        foreach (Plugin plugin in pluginList)
        {
            item = new ListItem();
            item.Text = plugin.Name;
            item.Value = plugin.PluginId;
            ddLSalesProcess.Items.Add(item);
        }
    }

    /// <summary>
    /// Sets the DDL sales process.
    /// </summary>
    /// <param name="name">The name.</param>
    private void SetDDLSalesProcess(string name)
    {
        foreach (ListItem item in ddLSalesProcess.Items)
        {
            if (item.Text == name)
            {
                item.Selected = true;
            }
        }
    }

    /// <summary>
    /// Loads the stages drop down.
    /// </summary>
    /// <param name="salesProcessAudits">The sales process audits.</param>
    private void LoadStagesDropDown(IList<ISalesProcessAudit> salesProcessAudits)
    {
        ddlStages.Items.Clear();
        if (salesProcessAudits == null)
        {
            LoadSnapShot(null);
            return;
        }

        int currentStageIndex = -1;
        int i = -1;
        foreach (ISalesProcessAudit spAudit in salesProcessAudits)
        {
            if (spAudit.ProcessType == "STAGE")
            {
                ListItem item = new ListItem();
                item.Text = string.Format("{0}.{1} {2}%", spAudit.StageOrder, spAudit.StageName, spAudit.Probability.ToString());
                item.Value = spAudit.Id.ToString();
                ddlStages.Items.Add(item);
                i++;
                if (spAudit.IsCurrent == true)
                {
                    LoadSnapShot(spAudit);
                    currentStageIndex = i;
                }
            }
        }
        ddlStages.SelectedIndex = currentStageIndex;
    }

    /// <summary>
    /// Loads the snap shot.
    /// </summary>
    /// <param name="stage">The stage.</param>
    private void LoadSnapShot(ISalesProcessAudit stage)
    {
        if (stage != null)
        {
            valueCurrnetStage.Text = stage.StageName;
            valueProbabilty.Text = stage.Probability.ToString() + "%";
            valueDaysInStage.Text = Convert.ToString(this._salesProcess.DaysInStage(stage.Id.ToString()));
            valueEstDays.Text = Convert.ToString(_salesProcess.EstimatedDaysToClose());
            dtpEstClose.DateTimeValue = (DateTime)_salesProcess.EstimatedCloseDate();
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
    /// Handles the Click event of the cmdStages control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void cmdStages_Click(object sender, EventArgs e)
    {
        if (DialogService != null)
        {
            DialogService.SetSpecs(200, 200, 400, 800, "ManageStages", "", true);
            DialogService.ShowDialog();
        }
    }

    /// <summary>
    /// Handles the SelectedIndexChanged event of the ddLSalesProcess control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void ddLSalesProcess_SelectedIndexChanged(object sender, EventArgs e)
    {
        string opportunityId = this.EntityContext.EntityID.ToString();
        string pluginID = ddLSalesProcess.SelectedItem.Value;
        ISalesProcesses salesProcess = EntityFactory.Create<ISalesProcesses>();
        salesProcess.InitSalesProcess(pluginID, opportunityId);
        IPanelRefreshService refresher = PageWorkItem.Services.Get<IPanelRefreshService>();
        refresher.RefreshAll();
    }

    /// <summary>
    /// Handles the SelectedIndexChanged event of the ddlStages control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void ddlStages_SelectedIndexChanged(object sender, EventArgs e)
    {
        object manageStagesDialog = Page.Session["MANAGESTAGESACTIVE"];
        if (manageStagesDialog != null)
            return;

        string stageId = ddlStages.SelectedItem.Value;
        ISalesProcesses salesProcess = Helpers.GetSalesProcess(this.EntityContext.EntityID.ToString());
        string result = salesProcess.CanMoveToStage(stageId);
        if (result == string.Empty)
        {
            salesProcess.SetToCurrentStage(stageId);
            salesProcess.Save();
        }
        else
        {
            if (DialogService != null)
                DialogService.ShowMessage(result);
        }
        IPanelRefreshService refresher = PageWorkItem.Services.Get<IPanelRefreshService>();
        refresher.RefreshAll();
    }

    /// <summary>
    /// Handles the RowDataBound event of the SalesProcessGrid control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewRowEventArgs"/> instance containing the event data.</param>
    protected void SalesProcessGrid_RowDataBound(object sender, GridViewRowEventArgs e)
    {
        if (e.Row.RowType == DataControlRowType.DataRow)
        {
            ISalesProcessAudit spAudit = (ISalesProcessAudit)e.Row.DataItem;
            // process header and footer records
            if ((spAudit.ProcessType == "HEADER") || (spAudit.ProcessType == "FOOTER"))
            {
                e.Row.Cells.Clear();
                return;
            }
            // process step records
            if (spAudit.ProcessType == "STEP")
            {
                CheckBox cbComplete = ((CheckBox)e.Row.FindControl("chkComplete"));
                cbComplete.Attributes.Add("onClick", string.Format("return onCompleteStep('{0}','{1}','{2}');", cmdCompleteStep.ClientID, stepContext.ClientID, spAudit.Id.ToString() + ":" + spAudit.Completed));

                Label lblReq = ((Label)e.Row.FindControl("lblReq"));

                lblReq.ForeColor = Color.Red;
				lblReq.Text = (spAudit.Required == true ? "*" : "&nbsp;");

                LinkButton linkAction = ((LinkButton)e.Row.FindControl("linkAction"));
                linkAction.Text = spAudit.StepName;
                linkAction.Attributes.Add("href", string.Format("javascript:executeAction('{0}','{1}');", spAudit.Id.ToString(), spAudit.ActionType));

                DateTimePicker dtpStartDate = (DateTimePicker)e.Row.FindControl("dtpStartDate");
                if (dtpStartDate != null)
                {
                    dtpStartDate.SetClientSideChangeHandler(string.Format("onStartStepWithDate(this,'{0}','{1}','{2}');", cmdStartDate.ClientID, startDateContext.ClientID, spAudit.Id.ToString()));
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
                DateTimePicker dtpCompletedDate = (DateTimePicker)e.Row.FindControl("dtpCompleteDate");
                if (dtpCompletedDate != null)
                {
                    dtpCompletedDate.SetClientSideChangeHandler(string.Format("onCompleteStepWithDate(this,'{0}','{1}','{2}');", cmdCompleteDate.ClientID, completeDateContext.ClientID, spAudit.Id.ToString()));
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
            // process stage records
            if (spAudit.ProcessType == "STAGE")
            {
                e.Row.Cells[0].ColumnSpan = 6;
                e.Row.Cells[0].HorizontalAlign = HorizontalAlign.Left;
                e.Row.Cells[0].Font.Bold = (spAudit.IsCurrent == true);
                e.Row.BackColor = Color.FromArgb(220, 233, 247);
                e.Row.Cells[0].Text = string.Format("{0} {1}:{2}-{3}%", GetLocalResourceObject("Stage").ToString(), spAudit.StageOrder, spAudit.StageName, spAudit.Probability);
                e.Row.Cells.RemoveAt(1);
                e.Row.Cells.RemoveAt(1);
                e.Row.Cells.RemoveAt(1);
                e.Row.Cells.RemoveAt(1);
            }
        }
    }

    /// <summary>
    /// Handles the OnClick event of the cmdCompleteStep control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void cmdCompleteStep_OnClick(object sender, EventArgs e)
    {
        string stepContextValue = stepContext.Value;
        string[] args = stepContextValue.Split(new Char[] { ':' });
        string spaid = args[0];
        ISalesProcesses salesProcess = Helpers.GetSalesProcess(this.EntityContext.EntityID.ToString());
        if (args[1] == "False")
        {
            string result = salesProcess.CanCompleteStep(spaid);
            if (result == string.Empty)
            {
                salesProcess.CompleteStep(spaid, DateTime.Now);
                salesProcess.Save();
            }
            else
            {
                if (DialogService != null)
                    DialogService.ShowMessage(result);
                return;
            }
        }
        else
        {
            salesProcess.UnCompleteStep(spaid);
            salesProcess.Save();
        }
        IPanelRefreshService refresher = PageWorkItem.Services.Get<IPanelRefreshService>();
        refresher.RefreshAll();
    }

    /// <summary>
    /// Handles the OnClick event of the cmdCompleteDate control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void cmdCompleteDate_OnClick(object sender, EventArgs e)
    {
        string contextValue = completeDateContext.Value;
        string[] args = contextValue.Split(new Char[] { ':' });
        string spaid = args[0];
        DateTime completeDate = ResolveDateTime(args[1]);
        ISalesProcesses salesProcess = Helpers.GetSalesProcess(this.EntityContext.EntityID.ToString());

        string result = salesProcess.CanCompleteStep(spaid);
        if (result == string.Empty)
        {
            salesProcess.CompleteStep(spaid, completeDate);
            salesProcess.Save();
        }
        else
        {
            if (DialogService != null)
                DialogService.ShowMessage(result);
            return;
        }
        IPanelRefreshService refresher = PageWorkItem.Services.Get<IPanelRefreshService>();
        refresher.RefreshAll();
    }

    /// <summary>
    /// Handles the OnClick event of the cmdStartDate control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void cmdStartDate_OnClick(object sender, EventArgs e)
    {
        string contextValue = startDateContext.Value;
        string[] args = contextValue.Split(new Char[] { ':' });
        string spaid = args[0];
        DateTime startDate = ResolveDateTime(args[1]);
        ISalesProcesses salesProcess = Helpers.GetSalesProcess(this.EntityContext.EntityID.ToString());
        salesProcess.StartStep(spaid, startDate);
        salesProcess.Save();
    }

    /// <summary>
    /// Handles the OnClick event of the cmdDoAction control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void cmdDoAction_OnClick(object sender, EventArgs e)
    {
        DoAction(actionContext.Value);
    }

    /// <summary>
    /// Handles the RowCommand event of the SalesProcessGrid control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewCommandEventArgs"/> instance containing the event data.</param>
    protected void SalesProcessGrid_RowCommand(object sender, GridViewCommandEventArgs e)
    {
        if (e.CommandName.Equals("Action"))
        {
            int rowIndex = Convert.ToInt32(e.CommandArgument);
            string Id = SalesProcessGrid.DataKeys[rowIndex].Value.ToString();
            DoAction(Id);
        }
    }

    /// <summary>
    /// Does the action.
    /// </summary>
    /// <param name="spaId">The spa id.</param>
    private void DoAction(string spaId)
    {
        string result = string.Empty;

        ISalesProcessAudit spAudit = Helpers.GetSalesProcessAudit(spaId);
        this._opportunity = GetOpportunity(spAudit.EntityId);
        this._salesProcess = Helpers.GetSalesProcess(spAudit.EntityId);
        if (spAudit == null)
            return;

        try
        {
            result = _salesProcess.CanCompleteStep(spaId);
            if (result == string.Empty)
            {
                string actionType = spAudit.ActionType;
                switch (actionType.ToUpper())
                {
                    case "NONE":
                        break;
                    case "MAILMERGE":
                        result = DoMailMerge(spAudit);
                        break;
                    case "SCRIPT":
                        result = DoWebAction(spAudit);
                        break;
                    case "FORM":
                        result = DoWebForm(spAudit);
                        break;
                    case "PHONECALL":
                        result = DoActivity(spAudit);
                        break;
                    case "TODO":
                        result = DoActivity(spAudit);
                        break;
                    case "MEETING":
                        result = DoActivity(spAudit);
                        break;
                    case "LITREQUEST":
                        result = DoLitRequest(spAudit);
                        break;
                    case "CONTACTPROCESS":
                        result = DoContactProcess(spAudit);
                        break;
                    case "ACTIVITYNOTEPAD":
                        result = GetLocalResourceObject("ActvityNotePadNotSupported").ToString(); //"Activity Note Pad not in availble in Web.";
                        break;
                    default:
                        break;
                }
            }
        }
        catch (Exception ex)
        {
            result = ex.Message;
        }

        if (DialogService != null)
        {
            if (!string.IsNullOrEmpty(result))
            {
                string msg = string.Format(GetLocalResourceObject("MSG_ProcessActionResult").ToString(), spAudit.StepName, result);
                DialogService.ShowMessage(msg);
            }
        }
    }

    /// <summary>
    /// Does the activity.
    /// </summary>
    /// <param name="step">The step.</param>
    /// <returns></returns>
    private string DoActivity(ISalesProcessAudit step)
    {
        string result = string.Empty;
        string xmlData = System.Text.UnicodeEncoding.UTF8.GetString(step.Data);
        XmlDocument xmlDoc = new XmlDocument();
        xmlDoc.LoadXml(xmlData);
        XmlNode actionNode = xmlDoc.DocumentElement.SelectSingleNode("//Action/ActivityAction");

        string strAutoSchedule = string.Empty;

        strAutoSchedule = actionNode.SelectSingleNode("AutoSchedule").InnerText;
        string leaderId = selectedUserId.Value;

        IUser leader = GetUser(leaderId);
        if (leader == null)
            throw new Exception(GetLocalResourceObject("Error_LeaderNotFound").ToString());

        string contactId = selectedContactId.Value;

        IContact contact = GetContact(contactId);
        if (contact == null)
            throw new Exception(GetLocalResourceObject("Error_ContactNotFound").ToString());
        if (strAutoSchedule == "F")
        {
            //Show the user the new Activity.

            Activity activity = (Activity)_salesProcess.ScheduleActivity(step.Id.ToString(), _opportunity, leader, contact, false);
            Session["activitysession"] = activity;
            Dictionary<string, string> args = new Dictionary<string, string>();
            args.Add("type", activity.Type.ToString());
            Link.ScheduleActivity(args);
        }
        else
        {
            //schedule the activity 
            Activity activity = (Activity)this._salesProcess.ScheduleActivity(step.Id.ToString(), this._opportunity, leader, contact, true);
            result = string.Format(GetLocalResourceObject("MSG_ActivityScheduled").ToString(), contact.FirstName, contact.LastName);
        }
        return result;
    }

    /// <summary>
    /// Does the lit request.
    /// </summary>
    /// <param name="step">The step.</param>
    /// <returns></returns>
    private string DoLitRequest(ISalesProcessAudit step)
    {
        string result = string.Empty;
        string authorId = selectedUserId.Value;
        IUser author = GetUser(authorId);
        if (author == null)
            throw new Exception(GetLocalResourceObject("Error_AuthorNotFound").ToString());

        string contactId = selectedContactId.Value;
        IContact contact = GetContact(contactId);
        if (contact == null)
            throw new Exception(GetLocalResourceObject("Error_ContactNotFound").ToString());

        string reqId = this._salesProcess.ScheduleLitRequest(step.Id.ToString(), this._opportunity, author, contact);
        if (reqId != string.Empty)
        {
            string url = string.Format("~/LitRequest.aspx?entityid={0}", reqId);
            Response.Redirect(url);
        }
        else
        {
            result = GetLocalResourceObject("Error_LitRequestNotScheduled").ToString();
        }

        return result;
    }

    /// <summary>
    /// Does the contact process.
    /// </summary>
    /// <param name="step">The step.</param>
    /// <returns></returns>
    private string DoContactProcess(ISalesProcessAudit step)
    {
        string result = string.Empty;

        string contactId = selectedContactId.Value;
        IContact contact = GetContact(contactId);

        if (contact == null)
            throw new Exception(GetLocalResourceObject("Error_ContactNotFound").ToString());

        string processId = this._salesProcess.ScheduleContactProcess(step.Id.ToString(), contact);
        if (processId != string.Empty)
        {
            result = string.Format(GetLocalResourceObject("MSG_ContactProcessScheduled").ToString(), contact.FirstName, contact.LastName);
        }
        else
        {
            result = GetLocalResourceObject("Error_ContactProcessNotAssigned").ToString();
        }
        return result;
    }

    /// <summary>
    /// Does the web action.
    /// </summary>
    /// <param name="spAudit">The sp audit.</param>
    /// <returns></returns>
    private string DoWebAction(ISalesProcessAudit spAudit)
    {
        string result = string.Empty;
        string xmlData = UnicodeEncoding.UTF8.GetString(spAudit.Data);

        XmlDocument xmlDoc = new XmlDocument();
        xmlDoc.LoadXml(xmlData);

        XmlNode actionNode = xmlDoc.DocumentElement.SelectSingleNode("//Action/ScriptAction");
        string family = actionNode.SelectSingleNode("WebAction/Family").InnerText;
        string name = actionNode.SelectSingleNode("WebAction/Name").InnerText;
        result = GetLocalResourceObject("MSG_WebActionNotSupported").ToString();
        return result;
    }

    /// <summary>
    /// Does the web form.
    /// </summary>
    /// <param name="spAudit">The sp audit.</param>
    /// <returns></returns>
    private string DoWebForm(ISalesProcessAudit spAudit)
    {
        string result = string.Empty;

        string xmlData = UnicodeEncoding.UTF8.GetString(spAudit.Data);
        XmlDocument xmlDoc = new XmlDocument();
        xmlDoc.LoadXml(xmlData);
        XmlNode actionNode = xmlDoc.DocumentElement.SelectSingleNode("//Action/FormAction");
        string family = actionNode.SelectSingleNode("WebForm/Family").InnerText;
        string name = actionNode.SelectSingleNode("WebForm/Name").InnerText;
        result = GetLocalResourceObject("MSG_WebFormsNotSupported").ToString();
        return result;
    }

    /// <summary>
    /// Does the mail merge.
    /// </summary>
    /// <param name="spAudit">The sp audit.</param>
    /// <returns></returns>
    private string DoMailMerge(ISalesProcessAudit spAudit)
    {
        string result = string.Empty;
        result = GetLocalResourceObject("MSG_MailMergeCompleted").ToString();
        return result;
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
        }
        return result;
    }

    /// <summary>
    /// Gets the opp account manager.
    /// </summary>
    /// <param name="opportunityId">The opportunity id.</param>
    /// <returns></returns>
    private static IUser GetOppAccountManager(string opportunityId)
    {
        IUser user = null;
        IOpportunity opp = null;
        using (ISession session = new SessionScopeWrapper())
        {
            opp = EntityFactory.GetById<IOpportunity>(opportunityId);
            user = opp.AccountManager;
        }
        return user;
    }

    /// <summary>
    /// Gets the user.
    /// </summary>
    /// <param name="userId">The user id.</param>
    /// <returns></returns>
    private static IUser GetUser(string userId)
    {
        IUser user = null;
        using (ISession session = new SessionScopeWrapper())
        {
            user = EntityFactory.GetById<IUser>(userId);
        }
        return user;

    }

    /// <summary>
    /// Gets the current user.
    /// </summary>
    /// <returns></returns>
    private static IUser GetCurrentUser()
    {
        IUser user = null;
        SLXUserService service = ApplicationContext.Current.Services.Get<IUserService>() as SLXUserService;
        User currentUser = service.GetUser();
        user = currentUser as IUser;
        return user;
    }

    /// <summary>
    /// Gets the opp contact.
    /// </summary>
    /// <param name="opportunityContactId">The opportunity contact id.</param>
    /// <returns></returns>
    private static IOpportunityContact GetOppContact(string opportunityContactId)
    {
        IOpportunityContact oppcon = null;
        using (ISession session = new SessionScopeWrapper())
        {
            oppcon = EntityFactory.GetById<IOpportunityContact>(opportunityContactId);
        }
        return oppcon;
    }

    /// <summary>
    /// Gets the opp contact count.
    /// </summary>
    /// <param name="opportunityId">The opportunity id.</param>
    /// <returns></returns>
    private static int GetOppContactCount(string opportunityId)
    {
        int count = 0;
        IOpportunity opp;
        using (ISession session = new SessionScopeWrapper())
        {
            opp = EntityFactory.GetById<IOpportunity>(opportunityId);
            count = opp.Contacts.Count;
        }
        return count;
    }

    /// <summary>
    /// Gets the primary opp contact.
    /// </summary>
    /// <param name="opportunityId">The opportunity id.</param>
    /// <returns></returns>
    private static IContact GetPrimaryOppContact(string opportunityId)
    {
        IContact contact = null;
        IOpportunity opp = null;
        using (ISession session = new SessionScopeWrapper())
        {
            opp = EntityFactory.GetById<IOpportunity>(opportunityId);

            foreach (IOpportunityContact oppCon in opp.Contacts)
            {
                if (oppCon.IsPrimary == true)
                    contact = oppCon.Contact;
            }
        }
        return contact;
    }

    /// <summary>
    /// Gets the opp contacts.
    /// </summary>
    /// <param name="opportunityId">The opportunity id.</param>
    /// <returns></returns>
    private static IList<IContact> GetOppContacts(string opportunityId)
    {
        List<IContact> contacts = new List<IContact>();
        IOpportunity opp = null;
        using (ISession session = new SessionScopeWrapper())
        {
            opp = EntityFactory.GetById<IOpportunity>(opportunityId);

            foreach (IOpportunityContact oppCon in opp.Contacts)
            {
                contacts.Add(oppCon.Contact);
            }
        }
        return contacts;
    }

    /// <summary>
    /// Gets the contact.
    /// </summary>
    /// <param name="contactId">The contact id.</param>
    /// <returns></returns>
    private static IContact GetContact(string contactId)
    {
        IContact contact = null;
        using (ISession session = new SessionScopeWrapper())
        {
            contact = EntityFactory.GetById<IContact>(contactId);
        }
        return contact;
    }

    /// <summary>
    /// Gets the opportunity.
    /// </summary>
    /// <param name="opportunityId">The opportunity id.</param>
    /// <returns></returns>
    private static IOpportunity GetOpportunity(string opportunityId)
    {
        IOpportunity opp = null;
        using (new SessionScopeWrapper())
        {
            opp = EntityFactory.GetById<IOpportunity>(opportunityId);
        }
        return opp;
    }

    /// <summary>
    /// 
    /// </summary>
    private class OppSalesProcessScriptStrings
    {
        private string _currentSalesProcessCtrlId;
        /// <summary>
        /// Gets or sets the current sales process CTRL id.
        /// </summary>
        /// <value>The current sales process CTRL id.</value>
        public string currentSalesProcessCtrlId
        {
            get { return _currentSalesProcessCtrlId; }
            set { _currentSalesProcessCtrlId = value; }
        }

        private string _currentStageCtrlId;
        /// <summary>
        /// Gets or sets the current stage CTRL id.
        /// </summary>
        /// <value>The current stage CTRL id.</value>
        public string currentStageCtrlId
        {
            get { return _currentStageCtrlId; }
            set { _currentStageCtrlId = value; }
        }

        private string _numOfStepsCompletedCtrlId;
        /// <summary>
        /// Gets or sets the num of steps completed CTRL id.
        /// </summary>
        /// <value>The num of steps completed CTRL id.</value>
        public string numOfStepsCompletedCtrlId
        {
            get { return _numOfStepsCompletedCtrlId; }
            set { _numOfStepsCompletedCtrlId = value; }
        }

        private string _ddlSalesProcessCtrlId;
        /// <summary>
        /// Gets or sets the DDL sales process CTRL id.
        /// </summary>
        /// <value>The DDL sales process CTRL id.</value>
        public string ddlSalesProcessCtrlId
        {
            get { return _ddlSalesProcessCtrlId; }
            set { _ddlSalesProcessCtrlId = value; }
        }

        private string _opportunityIdCtrlId;
        /// <summary>
        /// Gets or sets the opportunity id CTRL id.
        /// </summary>
        /// <value>The opportunity id CTRL id.</value>
        public string opportunityIdCtrlId
        {
            get { return _opportunityIdCtrlId; }
            set { _opportunityIdCtrlId = value; }
        }

        private string _oppContactCountCtrlId;
        /// <summary>
        /// Gets or sets the opp contact count CTRL id.
        /// </summary>
        /// <value>The opp contact count CTRL id.</value>
        public string oppContactCountCtrlId
        {
            get { return _oppContactCountCtrlId; }
            set { _oppContactCountCtrlId = value; }
        }

        private string _ddlStagesCtrlId;
        /// <summary>
        /// Gets or sets the DDL stages CTRL id.
        /// </summary>
        /// <value>The DDL stages CTRL id.</value>
        public string ddlStagesCtrlId
        {
            get { return _ddlStagesCtrlId; }
            set { _ddlStagesCtrlId = value; }
        }

        private string _salesProcessGridCtrlId;
        /// <summary>
        /// Gets or sets the sales process grid CTRL id.
        /// </summary>
        /// <value>The sales process grid CTRL id.</value>
        public string salesProcessGridCtrlId
        {
            get { return _salesProcessGridCtrlId; }
            set { _salesProcessGridCtrlId = value; }
        }

        private string _currentCompleteCheckboxCtrl;
        /// <summary>
        /// Gets or sets the current complete checkbox CTRL.
        /// </summary>
        /// <value>The current complete checkbox CTRL.</value>
        public string currentCompleteCheckboxCtrl
        {
            get { return _currentCompleteCheckboxCtrl; }
            set { _currentCompleteCheckboxCtrl = value; }
        }

        private string _luOppContactCtrlId;
        /// <summary>
        /// Gets or sets the lu opp contact CTRL id.
        /// </summary>
        /// <value>The lu opp contact CTRL id.</value>
        public string luOppContactCtrlId
        {
            get { return _luOppContactCtrlId; }
            set { _luOppContactCtrlId = value; }
        }

        private string _luUserCtrlId;
        /// <summary>
        /// Gets or sets the lu user CTRL id.
        /// </summary>
        /// <value>The lu user CTRL id.</value>
        public string luUserCtrlId
        {
            get { return _luUserCtrlId; }
            set { _luUserCtrlId = value; }
        }

        private string _luOppContactObj;
        /// <summary>
        /// Gets or sets the lu opp contact obj.
        /// </summary>
        /// <value>The lu opp contact obj.</value>
        public string luOppContactObj
        {
            get { return _luOppContactObj; }
            set { _luOppContactObj = value; }
        }

        private string _luUserEventSubscribed;
        /// <summary>
        /// Gets or sets the lu user event subscribed.
        /// </summary>
        /// <value>The lu user event subscribed.</value>
        public string luUserEventSubscribed
        {
            get { return _luUserEventSubscribed; }
            set { _luUserEventSubscribed = value; }
        }

        private string _luUserObj;
        /// <summary>
        /// Gets or sets the lu user obj.
        /// </summary>
        /// <value>The lu user obj.</value>
        public string luUserObj
        {
            get { return _luUserObj; }
            set { _luUserObj = value; }
        }

        private string _luOppContactEventSubscribed;
        /// <summary>
        /// Gets or sets the lu opp contact event subscribed.
        /// </summary>
        /// <value>The lu opp contact event subscribed.</value>
        public string luOppContactEventSubscribed
        {
            get { return _luOppContactEventSubscribed; }
            set { _luOppContactEventSubscribed = value; }
        }

        private string _selectedContactIdCtrlId;
        /// <summary>
        /// Gets or sets the selected contact id CTRL id.
        /// </summary>
        /// <value>The selected contact id CTRL id.</value>
        public string selectedContactIdCtrlId
        {
            get { return _selectedContactIdCtrlId; }
            set { _selectedContactIdCtrlId = value; }
        }

        private string _selectedUserIdCtrlId;
        /// <summary>
        /// Gets or sets the selected user id CTRL id.
        /// </summary>
        /// <value>The selected user id CTRL id.</value>
        public string selectedUserIdCtrlId
        {
            get { return _selectedUserIdCtrlId; }
            set { _selectedUserIdCtrlId = value; }
        }

        private string _cmdDoActionCtrlId;
        /// <summary>
        /// Gets or sets the CMD do action CTRL id.
        /// </summary>
        /// <value>The CMD do action CTRL id.</value>
        public string cmdDoActionCtrlId
        {
            get { return _cmdDoActionCtrlId; }
            set { _cmdDoActionCtrlId = value; }
        }

        private string _primaryOppContactIdCtrlId;
        /// <summary>
        /// Gets or sets the primary opp contact id CTRL id.
        /// </summary>
        /// <value>The primary opp contact id CTRL id.</value>
        public string primaryOppContactIdCtrlId
        {
            get { return _primaryOppContactIdCtrlId; }
            set { _primaryOppContactIdCtrlId = value; }
        }

        private string _accountManagerIdCtrlId;
        /// <summary>
        /// Gets or sets the account manager id CTRL id.
        /// </summary>
        /// <value>The account manager id CTRL id.</value>
        public string accountManagerIdCtrlId
        {
            get { return _accountManagerIdCtrlId; }
            set { _accountManagerIdCtrlId = value; }
        }

        private string _currentUserIdCtrlId;
        /// <summary>
        /// Gets or sets the current user id CTRL id.
        /// </summary>
        /// <value>The current user id CTRL id.</value>
        public string currentUserIdCtrlId
        {
            get { return _currentUserIdCtrlId; }
            set { _currentUserIdCtrlId = value; }
        }

        private string _cmdActionCtrlId;
        /// <summary>
        /// Gets or sets the CMD action CTRL id.
        /// </summary>
        /// <value>The CMD action CTRL id.</value>
        public string cmdActionCtrlId
        {
            get { return _cmdActionCtrlId; }
            set { _cmdActionCtrlId = value; }
        }

        private string _actionContextCtrlId;
        /// <summary>
        /// Gets or sets the action context CTRL id.
        /// </summary>
        /// <value>The action context CTRL id.</value>
        public string actionContextCtrlId
        {
            get { return _actionContextCtrlId; }
            set { _actionContextCtrlId = value; }
        }

        private string _currentProcessAction;
        /// <summary>
        /// Gets or sets the current process action.
        /// </summary>
        /// <value>The current process action.</value>
        public string currentProcessAction
        {
            get { return _currentProcessAction; }
            set { _currentProcessAction = value; }
        }
    }
    #region IScriptControl Members

    public IEnumerable<ScriptDescriptor> GetScriptDescriptors()
    {
        yield break;
    }

    public IEnumerable<ScriptReference> GetScriptReferences()
    {

        List<ScriptReference> refs = new List<ScriptReference>();
        ScriptReference javRef  =  new ScriptReference("~/SmartParts/OpportunitySalesProcess/OpportunitySalesProcess_ClientScript.js");
        ScriptReference vbRef = new ScriptReference("~/SmartParts/OpportunitySalesProcess/SpMailMerge_ClientScript.vbs");
        refs.Add(javRef);
        //refs.Add(vbRef);
        //yield return refs;
        return refs;
    }

    #endregion
}
