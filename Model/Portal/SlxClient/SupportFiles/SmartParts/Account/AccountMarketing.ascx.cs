using Sage.Platform.Application;
using Sage.Platform;
using Sage.Entity.Interfaces;
using System;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Text;
using NHibernate;
using System.Collections;
using Sage.Platform.Framework;
using Sage.Platform.Application.UI;
using Sage.Platform.Security;
using Sage.Platform.WebPortal.Services;
using Sage.Platform.WebPortal.SmartParts;

public partial class SmartParts_Account_AccountMarketing : EntityBoundSmartPartInfoProvider
{
    #region Public Properties
    /// <summary>
    /// Gets the type of the entity.
    /// </summary>
    /// <value>The type of the entity.</value>
    public override Type EntityType
    {
        get { return typeof(IAccount); }
    }

    /// <summary>
    /// Gets or sets an instance of the Refresh Service.
    /// </summary>
    /// <value>The refresh service.</value>
    [ServiceDependency]
    public IPanelRefreshService RefreshService { set; get; }

    #endregion

    #region Protected Methods
    /// <summary>
    /// Derived components should override this method to wire up event handlers.
    /// </summary>
    protected override void OnWireEventHandlers()
    {
        if (ScriptManager.GetCurrent(Page) != null)
        {
            AddResponse.Click += AddResponse_Click;
            grdAccountMarketing.PageIndexChanging += grdAccountMarketing_PageIndexChanging;
        }
        base.OnWireEventHandlers();
    }

    /// <summary>
    /// Called when the smartpart has been bound.  Derived components should override this method to run code that depends on entity context being set and it not changing.
    /// </summary>
    protected override void OnFormBound()
    {
        LoadMarketing();
        base.OnFormBound();
    }

    /// <summary>
    /// Override this method to add bindings to the currrently bound smart part
    /// </summary>
    protected override void OnAddEntityBindings()
    {
    }

    /// <summary>
    /// Handles the Click event of the AddResponse control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.ImageClickEventArgs"/> instance containing the event data.</param>
    protected void AddResponse_Click(object sender, ImageClickEventArgs e)
    {
        AddResponseAndTarget();
    }

    /// <summary>
    /// Handles the RowDataBound event of the ContactMarketing control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewRowEventArgs"/> instance containing the event data.</param>
    protected void AccountMarketing_RowDataBound(object sender, GridViewRowEventArgs e)
    {
        if (e.Row.RowType == DataControlRowType.DataRow)
        {
            System.Data.DataRowView row = (System.Data.DataRowView)e.Row.DataItem;
            
            LinkButton deleteCommand = (LinkButton)e.Row.Cells[3].Controls[0];
            LinkButton removeCommand = (LinkButton)e.Row.Cells[4].Controls[0];

            string msg = GetLocalResourceObject("ConfirmMessage_DeleteResponse").ToString();
            deleteCommand.Enabled = !String.IsNullOrEmpty(row["ResponseId"].ToString());
            if (deleteCommand.Enabled)
            {
                deleteCommand.Attributes.Add("onclick", "javascript: return confirm('" + msg + "');");
            }
            else
            {
                e.Row.Cells[3].ForeColor = System.Drawing.Color.Gray;
            }

            msg = String.Format(GetLocalResourceObject("ConfirmMessage_RemoveTargetAssociation").ToString(), e.Row.Cells[5].Text);
            removeCommand.Enabled = !row["Status"].ToString().Equals(GetLocalResourceObject("TargetStatus_Removed").ToString());
            if (removeCommand.Enabled)
            {
                removeCommand.Attributes.Add("onclick", "javascript: return confirm('" + msg + "');");
            }
            else
            {
                e.Row.Cells[4].ForeColor = System.Drawing.Color.Gray;
            }

            // this code can be used if we switch out the confirm dialog with the Ext messagebox.  This would allow us to
            // create a custom title for the dialog.

            // need to add these to the resource file in order for the Ext messagebox functions to work properly.
            //ConfirmMessage_DeleteTitle	Delete?	
            //ConfirmMessage_RemoveTitle	Remove?	

            //string title = GetLocalResourceObject("ConfirmMessage_DeleteTitle").ToString();
            //deleteCommand.Attributes["href"] = "#";
            //string cmd = string.Format("javascript:Ext.Msg.confirm('{0}', '{1}', function(btn, text) {{ if(btn =='yes') {{ __doPostBack('{2}','{3}{4}{5}'); }} }});", title, msg, grdAccountMarketing.UniqueID, deleteCommand.CommandName, IdSeparator, e.Row.RowIndex);
            //deleteCommand.Attributes.Add("onclick", cmd);

            //msg = String.Format(GetLocalResourceObject("ConfirmMessage_RemoveTargetAssociation").ToString(), e.Row.Cells[5].Text);
            //title = GetLocalResourceObject("ConfirmMessage_RemoveTitle").ToString();
            //removeCommand.Attributes["href"] = "#";
            //cmd = string.Format("javascript:Ext.Msg.confirm('{0}', '{1}', function(btn, text) {{ if(btn =='yes') {{ __doPostBack('{2}','{3}{4}{5}'); }} }});", title, msg, grdAccountMarketing.UniqueID, removeCommand.CommandName, IdSeparator, e.Row.RowIndex);
            //removeCommand.Attributes.Add("onclick", cmd);
        }
    }

    /// <summary>
    /// Handles the RowCommand event of the AccountMarketing control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewCommandEventArgs"/> instance containing the event data.</param>
    protected void AccountMarketing_RowCommand(object sender, GridViewCommandEventArgs e)
    {
        ITargetResponse targetResponse = null;
        ICampaignTarget campaignTarget = null;
        string targetId = String.Empty;
        string responseId = String.Empty;
        try
        {
            int rowIndex = Convert.ToInt32(e.CommandArgument);
            targetId = grdAccountMarketing.DataKeys[rowIndex].Values[0].ToString();
            responseId = grdAccountMarketing.DataKeys[rowIndex].Values[1].ToString();
            if (!string.IsNullOrEmpty(responseId))
            {
                targetResponse = EntityFactory.GetRepository<ITargetResponse>().Get(responseId);
                campaignTarget = targetResponse.CampaignTarget;
            }
            else if (!string.IsNullOrEmpty(targetId))
                campaignTarget = EntityFactory.GetRepository<ICampaignTarget>().Get(targetId);
        }
        catch
        {
        }

        switch (e.CommandName.ToUpper())
        {
            case "ADD":
                if (targetResponse == null  || targetResponse.Id != null)
                {
                    targetResponse = EntityFactory.Create<ITargetResponse>();
                    targetResponse.Campaign = campaignTarget.Campaign;
                    targetResponse.Contact = EntityFactory.GetRepository<IContact>().Get(campaignTarget.EntityId);
                    targetResponse.CampaignTarget = campaignTarget;
                    ShowResponseView(targetResponse);
                }
                else
                {
                    ShowResponseView(targetResponse);
                }
                break;
            case "EDIT":
                if (String.IsNullOrEmpty(targetId))
                {
                    AddResponseAndTarget();
                }
                else
                {
                    if (targetResponse == null)
                    {
                        targetResponse = EntityFactory.Create<ITargetResponse>();
                        targetResponse.Campaign = campaignTarget.Campaign;
                        targetResponse.CampaignTarget = campaignTarget;
                        targetResponse.Contact = EntityFactory.GetRepository<IContact>().Get(campaignTarget.EntityId);
                    }
                    ShowResponseView(targetResponse);
                }
                break;
            case "DELETE":
                if (targetResponse != null)
                {
                    if (campaignTarget.TargetResponses.Count <= 1)
                        campaignTarget.Status = GetLocalResourceObject("TargetStatus_Removed").ToString();
                    campaignTarget.TargetResponses.Remove(targetResponse);
                    targetResponse.Delete();
                    LoadMarketing();
                }
                else
                {
                    RemoveTargetAssociation(targetId);
                }
                break;
            case "REMOVE":
                RemoveTargetAssociation(targetId);
                break;
            case "SORT":
                break;
        }
    }

    /// <summary>
    /// Handles the RowDeleting event of the grdAccountMarketing control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewDeleteEventArgs"/> instance containing the event data.</param>
    protected void AccountMarketing_RowDeleting(object sender, GridViewDeleteEventArgs e)
    {
        grdAccountMarketing.SelectedIndex = e.RowIndex;
    }

    /// <summary>
    /// Handles the RowEditing event of the AccountMarketing control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewEditEventArgs"/> instance containing the event data.</param>
    protected void AccountMarketing_RowEditing(object sender, GridViewEditEventArgs e)
    {
        grdAccountMarketing.SelectedIndex = e.NewEditIndex;
    }

    /// <summary>
    /// Handles the Sorting event of the grdAccountMarketing control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewSortEventArgs"/> instance containing the event data.</param>
    protected void AccountMarketing_Sorting(object sender, GridViewSortEventArgs e)
    {  
    }

    /// <summary>
    /// Handles the PageIndexChanging event of the grdAccountMarketing control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewPageEventArgs"/> instance containing the event data.</param>
    protected void grdAccountMarketing_PageIndexChanging(object sender, GridViewPageEventArgs e)
    {
        grdAccountMarketing.PageIndex = e.NewPageIndex;
    }

    #endregion

    #region Private Methods
    /// <summary>
    /// Gets the order by clause.
    /// </summary>
    /// <returns></returns>
    private string GetOrderByClause()
    {
        string sortField = grdAccountMarketing.CurrentSortExpression;
        if (sortField.Equals("contact"))
        {
            sortField = "LastName";
        }
        if (grdAccountMarketing.CurrentSortDirection.ToUpper() == "ASCENDING")
            return String.Format(" Order By {0} asc", sortField);
        return String.Format(" Order By {0} desc", sortField);
    }

    /// <summary>
    /// Loads the marketing.
    /// </summary>
    private void LoadMarketing()
    {
        try
        {
            ISession session = SessionFactoryHolder.HolderInstance.CreateSession();
            try
            {
                if (EntityContext != null && EntityContext.EntityType == typeof(IAccount))
                {
                    IAccount account = EntityFactory.GetRepository<IAccount>().Get(EntityContext.EntityID);
                    StringBuilder qry = new StringBuilder();
                    qry.Append("Select campaign.CampaignName, campaign.CampaignCode, target.Status, target.Stage, ");
                    qry.Append("contact, campaign.StartDate, campaign.EndDate, ");
                    qry.Append("response.ResponseDate, response.ResponseMethod, target.Id, response.Id ");
                    qry.Append("From Contact as contact ");
                    qry.Append("Join contact.CampaignTargets as target ");
                    qry.Append("Join target.Campaign as campaign ");
                    qry.Append("Left Join target.TargetResponses as response ");
                    qry.Append("Where contact.Account.Id = :accountId");
                    if (grdAccountMarketing.AllowSorting)
                    {
                        qry.Append(GetOrderByClause());
                    }
                    IQuery q = session.CreateQuery(qry.ToString());

                    q.SetAnsiString("accountId", account.Id.ToString());

                    IList result;
                    using (new SparseQueryScope())
                    {
                       result = q.List();
                    }
                    System.Data.DataTable dt = new System.Data.DataTable();
                    dt.Columns.Add("CampaignName");
                    dt.Columns.Add("CampaignCode");
                    dt.Columns.Add("Status");
                    dt.Columns.Add("Stage");
                    dt.Columns.Add("ContactId");
                    dt.Columns.Add("Contact");
                    System.Data.DataColumn col = new System.Data.DataColumn("StartDate", typeof(DateTime));
                    dt.Columns.Add(col);
                    col = new System.Data.DataColumn("EndDate", typeof(DateTime));
                    dt.Columns.Add(col);
                    col = new System.Data.DataColumn("ResponseDate", typeof(DateTime));
                    dt.Columns.Add(col);
                    dt.Columns.Add("ResponseMethod");
                    dt.Columns.Add("TargetId");
                    dt.Columns.Add("ResponseId");
                    if (result != null)
                        foreach (object[] data in result)
                        {
                            dt.Rows.Add(data[0], data[1], data[2], data[3], ((IContact) data[4]).Id, data[4], ConvertData(data[5]), ConvertData(data[6]), ConvertData(data[7]), data[8], data[9], data[10]);
                        }
                    grdAccountMarketing.DataSource = dt;
                    grdAccountMarketing.DataBind();
                }
            }
            finally
            {
                SessionFactoryHolder.HolderInstance.ReleaseSession(session);
            }
        }
        catch (Exception ex)
        {
            log.Error(ex.Message);
            throw;
        }
    }

    /// <summary>
    /// Converts the value of the object into a valid DateTime value.
    /// </summary>
    /// <param name="dateTime">The date time.</param>
    /// <returns></returns>
    private static DateTime? ConvertData(Object dateTime)
    {
        if (dateTime == null)
            return DateTime.MinValue;
        return Convert.ToDateTime(dateTime);
    }

    /// <summary>
    /// Adds the response and target.
    /// </summary>
    private void AddResponseAndTarget()
    {
        if (DialogService != null)
        {
            ITargetResponse targetResponse = EntityFactory.Create<ITargetResponse>();
            ShowResponseView(targetResponse);
        }
    }

    /// <summary>
    /// Shows the response view.
    /// </summary>
    /// <param name="targetResponse">The target response.</param>
    private void ShowResponseView(ITargetResponse targetResponse)
    {
        if (DialogService != null)
        {
            string caption = GetLocalResourceObject("AddTargetResponse_DialogCaption").ToString();
            if (targetResponse != null && targetResponse.Id != null)
            {
                caption = GetLocalResourceObject("EditTargetResponse_DialogCaption").ToString();
            }
            DialogService.SetSpecs(200, 200, 550, 800, "AddEditTargetResponse", caption, true);
            DialogService.EntityType = typeof(ITargetResponse);
            if (targetResponse != null && targetResponse.Id != null)
            {
                DialogService.EntityID = targetResponse.Id.ToString();
                targetResponse.Contact = EntityFactory.GetById<IContact>(targetResponse.CampaignTarget.EntityId);
            }
                
            DialogService.DialogParameters.Add("ResponseDataSource", targetResponse);
            DialogService.ShowDialog();
        }
    }

    /// <summary>
    /// Removes the target association from the campaign by updating its status.
    /// </summary>
    /// <param name="targetId">The target id.</param>
    private void RemoveTargetAssociation(string targetId)
    {
        if (!String.IsNullOrEmpty(targetId))
        {
            ICampaignTarget campaignTarget = EntityFactory.GetRepository<ICampaignTarget>().Get(targetId);
            if (campaignTarget != null)
            {
                campaignTarget.Status = GetLocalResourceObject("TargetStatus_Removed").ToString();
                campaignTarget.Save();
                LoadMarketing();
            }
        }
    }
    #endregion

    #region ISmartPartInfoProvider Members

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
        Sage.Platform.WebPortal.SmartParts.ToolsSmartPartInfo tinfo = new ToolsSmartPartInfo();
        foreach (Control c in AccountMarketing_RTools.Controls)
        {
            tinfo.RightTools.Add(c);
        }
        return tinfo;
    }

    #endregion
}