using Sage.Platform;
using Sage.Entity.Interfaces;
using System;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Collections;
using Sage.Platform.WebPortal.SmartParts;
using Sage.Platform.Application.UI;
using ICriteria = Sage.Platform.Repository.ICriteria;
using Sage.Platform.Repository;

public partial class AddCampaignLeadSource : EntityBoundSmartPartInfoProvider
{
    /// <summary>
    /// 
    /// </summary>
    public enum SearchParameter
    {
        /// <summary>
        /// 
        /// </summary>
        StartingWith,
        /// <summary>
        /// 
        /// </summary>
        Contains,
        /// <summary>
        /// 
        /// </summary>
        EqualTo,
        /// <summary>
        /// 
        /// </summary>
        NotEqualTo,
        /// <summary>
        /// 
        /// </summary>
        EqualOrLessThan,
        /// <summary>
        /// 
        /// </summary>
        EqualOrGreaterThan,
        /// <summary>
        /// 
        /// </summary>
        LessThan,
        /// <summary>
        /// 
        /// </summary>
        GreaterThan
    }

    /// <summary>
    /// Gets the type of the entity.
    /// </summary>
    /// <value>The type of the entity.</value>
    public override Type EntityType
    {
        get { return typeof(ICampaign); }
    }

    /// <summary>
    /// Gets the expression.
    /// </summary>
    /// <param name="ef">The ef.</param>
    /// <param name="expression">The expression.</param>
    /// <param name="propName">Name of the prop.</param>
    /// <param name="value">The value.</param>
    /// <returns></returns>
    public static IExpression GetExpression(IExpressionFactory ef, SearchParameter expression, string propName, string value)
    {
        switch (expression)
        {
            case SearchParameter.Contains:
                return ef.InsensitiveLike(propName, value, LikeMatchMode.Contains);
            case SearchParameter.EqualOrGreaterThan:
                return ef.Ge(propName, value);
            case SearchParameter.EqualOrLessThan:
                return ef.Lt(propName, value);
            case SearchParameter.EqualTo:
                return ef.Eq(propName, value);
            case SearchParameter.GreaterThan:
                return ef.Gt(propName, value);
            case SearchParameter.LessThan:
                return ef.Lt(propName, value);
            case SearchParameter.NotEqualTo:
                return ef.InsensitiveNe(propName, value);
            case SearchParameter.StartingWith:
                return ef.InsensitiveLike(propName, value, LikeMatchMode.BeginsWith);
        }
        return null;
    }

    /// <summary>
    /// Override this method to add bindings to the currrently bound smart part
    /// </summary>
    protected override void OnAddEntityBindings()
    {
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
    /// Derived components should override this method to wire up event handlers.
    /// </summary>
    protected override void OnWireEventHandlers()
    {
        if (ScriptManager.GetCurrent(Page) != null && DialogService != null)
            grdCampaignLeadSource.RowCommand += grdCampaign_OnRowCommand;
        base.OnWireEventHandlers();
    }

    /// <summary>
    /// Handles the OnRowCommand event of the grdCampaign control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void grdCampaign_OnRowCommand(object sender, EventArgs e)
    {
        if (DialogService != null)
            DialogService.CloseEventHappened(sender, e);
        Refresh();
    }

    /// <summary>
    /// Called when [activating].
    /// </summary>
    protected override void OnActivating()
    {
        grdCampaignLeadSource.DataBind();
        base.OnActivating();
    }

    /// <summary>
    /// Gets the real entity property name.
    /// </summary>
    /// <returns>Entity property name.</returns>
    private String GetEntityPropertyValue()
    {
        switch (ddlCondition.Text)
        {
            case "Type":
                return "Type";
            case "Description":
                return "Description";
            case "SourceCode":
                return "AbbrevDescription";
            default:
                return "Description";
        }
    }

    /// <summary>
    /// Loads the product grid.
    /// </summary>
    protected void LoadProductGrid()
    {
        try
        {
            if (EntityContext != null && EntityContext.EntityType == typeof(ICampaign))
            {
                SearchParameter enumValue = (SearchParameter)ddlFilterBy.SelectedIndex;
                IRepository<ILeadSource> leadSource = EntityFactory.GetRepository<ILeadSource>();
                IQueryable query = (IQueryable)leadSource;
                IExpressionFactory exp = query.GetExpressionFactory();
                ICriteria criteria = query.CreateCriteria();
                criteria.Add(GetExpression(exp, enumValue, GetEntityPropertyValue(), txtLookupValue.Text));

                IList list = criteria.List();
                grdCampaignLeadSource.DataSource = list;
                grdCampaignLeadSource.DataBind();
            }
        }
        catch (Exception ex)
        {
            log.Error(ex.Message);
            throw;
        }
    }

    /// <summary>
    /// Handles the Click event of the imgFindButton control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.ImageClickEventArgs"/> instance containing the event data.</param>
    protected void imgFindButton_Click(object sender, ImageClickEventArgs e)
    {
        LoadProductGrid();
    }

    /// <summary>
    /// Handles the RowCommand event of the grdCampaignLeadSource control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewCommandEventArgs"/> instance containing the event data.</param>
    protected void grdCampaignLeadSource_RowCommand(object sender, GridViewCommandEventArgs e)
    {
        if (e.CommandName.Equals("Associate"))
        {
            int rowIndex = Convert.ToInt32(e.CommandArgument);
            if (grdCampaignLeadSource != null)
            {
                string id = grdCampaignLeadSource.DataKeys[rowIndex].Value.ToString();
                if (!String.IsNullOrEmpty(id))
                {
                    ICampaign campaign = BindingSource.Current as ICampaign;
                    ILeadSource leadsource = EntityFactory.GetRepository<ILeadSource>().Get(id);
                    if (!String.IsNullOrEmpty(campaign.CampaignLeadSources))
                        campaign.CampaignLeadSources += String.Format(", {0}", leadsource.Description);
                    else
                        campaign.CampaignLeadSources = leadsource.Description;
                }
            }
        }
    }

    /// <summary>
    /// Handles the RowEditing event of the grdCampaignLeadSource control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewEditEventArgs"/> instance containing the event data.</param>
    protected void grdCampaignLeadSource_RowEditing(object sender, GridViewEditEventArgs e)
    {
        if (grdCampaignLeadSource != null) 
            grdCampaignLeadSource.SelectedIndex = e.NewEditIndex;
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
        foreach (Control c in CampaignLeadSource_RTools.Controls)
        {
            tinfo.RightTools.Add(c);
        }
        return tinfo;
    }
    
    #endregion
}