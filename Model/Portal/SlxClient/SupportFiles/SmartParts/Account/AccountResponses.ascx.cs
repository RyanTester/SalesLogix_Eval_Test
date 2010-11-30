using System;
using System.Collections;
using System.Data;
using System.Web.UI;
using System.Web.UI.WebControls;
using Sage.Platform;
using Sage.Entity.Interfaces;
using Sage.Platform.Application.UI;
using Sage.Platform.Security;
using Sage.Platform.WebPortal.SmartParts;
using Sage.Platform.WebPortal.Services;
using log4net;
using Sage.Platform.Application;
using NHibernate;
using Sage.Platform.Framework;
using System.Text;

public partial class SmartParts_Account_Responses : EntityBoundSmartPartInfoProvider
{
    private IPanelRefreshService _RefreshService;
    

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
    public IPanelRefreshService RefreshService
    {
        set
        {
            _RefreshService = value;
        }
        get
        {
            return _RefreshService;
        }
    }

    #endregion

    #region Private Methods

    /// <summary>
    /// Loads the marketing.
    /// </summary>
    private void LoadResponses()
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
                    qry.Append("Select contact, response.ResponseDate, response.Interest, response.Status, response.InterestLevel, ");
                    qry.Append("response.LeadSource, campaign.CampaignName, response.Id ");
                    qry.Append("From TargetResponse as response ");
                    qry.Append("Join response.Contact as contact ");
                    qry.Append("Left Join response.Campaign as campaign ");
                    qry.Append("Where contact.Account.Id = :accountId");
                    if (grdResponses.AllowSorting)
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
                    System.Data.DataTable dt = new DataTable();
                    dt.Columns.Add("ContactId");
                    dt.Columns.Add("Contact");
                    System.Data.DataColumn col = new DataColumn("ResponseDate", typeof(DateTime));
                    dt.Columns.Add(col);
                    dt.Columns.Add("Interest");
                    dt.Columns.Add("Status");
                    dt.Columns.Add("InterestLevel");
                    dt.Columns.Add("LeadSource");
                    dt.Columns.Add("Campaign");
                    dt.Columns.Add("ResponseId");
                    if (result != null)
                        foreach (object[] data in result)
                        {
                            dt.Rows.Add(((IContact) data[0]).Id, data[0], ConvertData(data[1]), data[2], data[3], data[4], data[5], data[6], data[7]);
                        }
                    grdResponses.DataSource = dt;
                    grdResponses.DataBind();
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
    /// Gets the order by clause.
    /// </summary>
    /// <returns></returns>
    private string GetOrderByClause()
    {
        string sortField = grdResponses.CurrentSortExpression;
        if (sortField.Equals("contact"))
        {
            sortField = "LastName";
        }
        if (grdResponses.CurrentSortDirection.ToUpper() == "ASCENDING")
            return String.Format(" Order By {0} asc", sortField);
        return String.Format(" Order By {0} desc", sortField);
    }

    /// <summary>
    /// Converts the value of the object into a valid DateTime value.
    /// </summary>
    /// <param name="dateTime">The date time.</param>
    /// <returns></returns>
    private DateTime? ConvertData(Object dateTime)
    {
        if (dateTime == null)
            return DateTime.MinValue;
        return Convert.ToDateTime(dateTime);
    }

    /// <summary>
    /// Shows the response view.
    /// </summary>
    /// <param name="targetResponse">The target response.</param>
    private void ShowResponseView(ITargetResponse targetResponse)
    {
        if (DialogService != null)
        {
            string caption = GetLocalResourceObject("AddResponse_DialogCaption").ToString();
            if (targetResponse != null && targetResponse.Id != null)
            {
                caption = GetLocalResourceObject("EditResponse_DialogCaption").ToString();
            }
            DialogService.SetSpecs(200, 200, 550, 800, "AddEditTargetResponse", caption, true);
            DialogService.EntityType = typeof(ITargetResponse);
            if (targetResponse != null && targetResponse.Id != null)
                DialogService.EntityID = targetResponse.Id.ToString();
            DialogService.DialogParameters.Add("ResponseDataSource", targetResponse);
            // added account id in the case that a contact is needed for association to an account
            if(EntityContext != null)
                DialogService.DialogParameters.Add("AccountId", EntityContext.EntityID);

            DialogService.ShowDialog();
        }
    }

    #endregion

    /// <summary>
    /// Derived components should override this method to wire up event handlers.
    /// </summary>
    protected override void OnWireEventHandlers()
    {
        cmdAddResponse.Click += cmdAddResponse_Click;
        grdResponses.PageIndexChanging += grdResponses_PageIndexChanging;
        base.OnWireEventHandlers();
    }

    /// <summary>
    /// Override this method to add bindings to the currrently bound smart part
    /// </summary>
    protected override void OnAddEntityBindings()
    {
    }

    /// <summary>
    /// Called when the smartpart has been bound.  Derived components should override this method to run code that depends on entity context being set and it not changing.
    /// </summary>
    protected override void OnFormBound()
    {
        if (Visible)
        {
            LoadResponses();
            base.OnFormBound();
        }
    }

    /// <summary>
    /// Handles the RowCommand event of the grdResponses control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewCommandEventArgs"/> instance containing the event data.</param>
    protected void grdResponses_RowCommand(object sender, GridViewCommandEventArgs e)
    {
        ITargetResponse targetResponse;
        string responseId = String.Empty;
        try
        {
            int rowIndex = Convert.ToInt32(e.CommandArgument);
            responseId = grdResponses.DataKeys[rowIndex].Values[0].ToString();
            if (String.IsNullOrEmpty(responseId))
                return;
            targetResponse = EntityFactory.GetRepository<ITargetResponse>().Get(responseId);
            if (targetResponse == null)
                return;
        }
        catch
        {
            return;
        }

        switch (e.CommandName.ToUpper())
        {
            case "EDIT":
                ShowResponseView(targetResponse);
                break;
            case "DELETE":
                if (targetResponse != null)
                {
                    ICampaignTarget campaignTarget = targetResponse.CampaignTarget;
                    if (campaignTarget != null)
                    {
                        campaignTarget.Status = GetLocalResourceObject("TargetStatus_Removed").ToString();
                        campaignTarget.TargetResponses.Remove(targetResponse);
                    }
                    targetResponse.Delete();
                    LoadResponses();
                }
                break;
            case "SORT":
                break;
        }
    }

    /// <summary>
    /// Handles the RowEditing event of the grdResponses control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewEditEventArgs"/> instance containing the event data.</param>
    protected void grdResponses_RowEditing(object sender, GridViewEditEventArgs e)
    {
        grdResponses.SelectedIndex = e.NewEditIndex;
    }

    /// <summary>
    /// Handles the RowDataBound event of the grdResponses control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewRowEventArgs"/> instance containing the event data.</param>
    protected void grdResponses_RowDataBound(object sender, GridViewRowEventArgs e)
    {
        if (e.Row.RowType == DataControlRowType.DataRow)
        {
            LinkButton deleteCommnad = (LinkButton)e.Row.Cells[2].Controls[0];
            deleteCommnad.Attributes.Add("onclick", "javascript: return confirm('" + GetLocalResourceObject("ConfirmMessage_DeleteResponse").ToString() + "');");
        }
    }

    /// <summary>
    /// Handles the RowDeleting event of the grdResponses control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewDeleteEventArgs"/> instance containing the event data.</param>
    protected void grdResponses_RowDeleting(object sender, GridViewDeleteEventArgs e)
    {
        grdResponses.SelectedIndex = e.RowIndex;
    }

    /// <summary>
    /// Handles the Sorting event of the grdResponses control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewSortEventArgs"/> instance containing the event data.</param>
    protected void grdResponses_Sorting(object sender, GridViewSortEventArgs e)
    {
    }

    /// <summary>
    /// Handles the PageIndexChanging event of the grdResponses control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewPageEventArgs"/> instance containing the event data.</param>
    protected void grdResponses_PageIndexChanging(object sender, GridViewPageEventArgs e)
    {
        grdResponses.PageIndex = e.NewPageIndex;
    }

    /// <summary>
    /// Handles the Click event of the cmdAddResponse control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.ImageClickEventArgs"/> instance containing the event data.</param>
    protected void cmdAddResponse_Click(object sender, ImageClickEventArgs e)
    {
        ITargetResponse targetResponse = EntityFactory.Create<ITargetResponse>();
        ShowResponseView(targetResponse);
    }

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
        ToolsSmartPartInfo tinfo = new ToolsSmartPartInfo();
        foreach (Control c in Responses_RTools.Controls)
        {
            tinfo.RightTools.Add(c);
        }
        return tinfo;
    }

    #endregion
}
