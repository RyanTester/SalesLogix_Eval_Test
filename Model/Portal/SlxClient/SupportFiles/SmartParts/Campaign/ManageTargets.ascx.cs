using System;
using System.Data;
using System.Web.UI;
using System.Web.UI.WebControls;
using Sage.Platform.WebPortal.SmartParts;
using Sage.Entity.Interfaces;
using log4net;
using Sage.Platform.Application.UI;
using System.Collections.Generic;
using Sage.Platform.Repository;
using System.Text;
using Sage.Platform;
using Sage.Platform.Application;
using System.Collections;
using Sage.SalesLogix.CampaignTarget;
using Telerik.WebControls;
using System.Threading;
using Sage.SalesLogix.Client.GroupBuilder;

/// <summary>
/// Summary description for CampaignTargets
/// </summary>
public partial class ManageTargets : EntityBoundSmartPartInfoProvider
{
    #region properties
    private IContextService _Context;
    private AddManageFilterStateInfo _State;

    
    #endregion

    #region Public definations

    /// <summary>
    /// Gets the type of the entity.
    /// </summary>
    /// <value>The type of the entity.</value>
    public override Type EntityType
    {
        get
        {
            return typeof(ICampaignTarget);
        }
    }

    /// <summary>
    /// Gets the smart part info.
    /// </summary>
    /// <param name="smartPartInfoType">Type of the smart part info.</param>
    /// <returns></returns>
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

        foreach (Control c in Controls)
        {
            if (c is SmartPartToolsContainer)
            {
                SmartPartToolsContainer cont = c as SmartPartToolsContainer;
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

    /// <summary>
    /// 
    /// </summary>
    public class AddManageFilterStateInfo
    {
        public DataTable targetList = new DataTable();
        public string targetType = String.Empty;
        public string groupName = String.Empty;
    }

    public enum SearchParameter
    {
        StartingWith,
        Contains,
        EqualTo,
        NotEqualTo,
        EqualOrLessThan,
        EqualOrGreaterThan,
        LessThan,
        GreaterThan
    }

    #endregion

    #region Private Methods

    /// <summary>
    /// Registers the client script.
    /// </summary>
    private void RegisterClientScript()
    {
        StringBuilder sb = new StringBuilder(GetLocalResourceObject("ManageTargets_ClientScript").ToString());
        sb.Replace("@mt_chkCompanyId", chkCompany.ClientID);
        sb.Replace("@mt_lbxCompanyId", lbxCompany.ClientID);
        sb.Replace("@mt_txtCompanyId", txtCompany.ClientID);
        sb.Replace("@mt_chkIndustryId", chkIndustry.ClientID);
        sb.Replace("@mt_lbxIndustryId", lbxIndustry.ClientID);
        sb.Replace("@mt_pklIndustryId", pklIndustry.ClientID + "_obj");
        sb.Replace("@mt_chkSICId", chkSIC.ClientID);
        sb.Replace("@mt_lbxSICId", lbxSIC.ClientID);
        sb.Replace("@mt_txtSICId", txtSIC.ClientID);
        sb.Replace("@mt_chkTitleId", chkTitle.ClientID);
        sb.Replace("@mt_lbxTitleId", lbxTitle.ClientID);
        sb.Replace("@mt_pklTitleId", pklTitle.ClientID + "_obj");
        sb.Replace("@mt_chkProductsId", chkProducts.ClientID);
        sb.Replace("@mt_lbxProductsId", lbxProducts.ClientID);
        sb.Replace("@mt_lueProductsId", lueProducts.ClientID + "_obj");
        sb.Replace("@mt_chkStatusId", chkStatus.ClientID);
        sb.Replace("@mt_lbxStatusId", lbxStatus.ClientID);
        sb.Replace("@mt_pklStatusId", pklStatus.ClientID + "_obj");
        sb.Replace("@mt_chkSolicitId", chkSolicit.ClientID);
        sb.Replace("@mt_chkEmailId", chkEmail.ClientID);
        sb.Replace("@mt_chkCallId", chkCall.ClientID);
        sb.Replace("@mt_chkMailId", chkMail.ClientID);
        sb.Replace("@mt_chkFaxId", chkFax.ClientID);
        sb.Replace("@mt_chkCityId", chkCity.ClientID);
        sb.Replace("@mt_lbxCityId", lbxCity.ClientID);
        sb.Replace("@mt_txtCityId", txtCity.ClientID);
        sb.Replace("@mt_chkStateId", chkState.ClientID);
        sb.Replace("@mt_lbxStateId", lbxState.ClientID);
        sb.Replace("@mt_txtStateId", txtState.ClientID);
        sb.Replace("@mt_chkZipId", chkZip.ClientID);
        sb.Replace("@mt_lbxZipId", lbxZip.ClientID);
        sb.Replace("@mt_txtZipId", txtZip.ClientID);
        sb.Replace("@mt_chkLeadSourceId", chkLeadSource.ClientID);
        sb.Replace("@mt_lbxLeadSourceId", lbxLeadSource.ClientID);
        sb.Replace("@mt_lueLeadSourceId", lueLeadSource.ClientID + "_obj");
        sb.Replace("@mt_chkImportSourceId", chkImportSource.ClientID);
        sb.Replace("@mt_lbxImportSourceId", lbxImportSource.ClientID);
        sb.Replace("@mt_pklImportSourceId", pklImportSource.ClientID + "_obj");
        sb.Replace("@mt_chkCreateDateId", chkCreateDate.ClientID);
        sb.Replace("@mt_dtpFromDateId", dtpCreateFromDate.ClientID);
        sb.Replace("@mt_dtpToDateId", dtpCreateFromDate.ClientID);
        sb.Replace("@mt_divLookupTargetsId", divLookupTargets.ClientID);
        sb.Replace("@mt_divAddFromGroupId", divAddFromGroup.ClientID);
        sb.Replace("@mt_tabLookupTargetId", tabLookupTarget.ClientID);
        sb.Replace("@mt_tabAddFromGroupId", tabAddFromGroup.ClientID);
        sb.Replace("@mt_txtSelectedTabId", txtSelectedTab.ClientID);

        ScriptManager.RegisterStartupScript(Page, this.GetType(), "ManageTargetScript", sb.ToString(), false);
    }

    /// <summary>
    /// Called when [add entity bindings].
    /// </summary>
    protected override void OnAddEntityBindings()
    {
    }

    /// <summary>
    /// Called when [wire event handlers].
    /// </summary>
    protected override void OnWireEventHandlers()
    {
        cmdCancel.Click += new EventHandler(DialogService.CloseEventHappened);
        cmdClearAll.Attributes.Add("onClick", "return false;");
        base.OnWireEventHandlers();
    }

    /// <summary>
    /// Called when [activating].
    /// </summary>
    protected override void OnActivating()
    {
        FilterOptions options = new FilterOptions();
        SetFilterControls(options);
        AddDistinctGroupItemsToList(lbxContactGroups, "Contact");
        AddDistinctGroupItemsToList(lbxLeadGroups, "Lead");
    }

    /// <summary>
    /// Called when the dialog is closing.
    /// </summary>
    protected override void OnClosing()
    {
        _Context.RemoveContext("AddManageFilterStateInfo");
        FilterOptions options = new FilterOptions();
        SetFilterOptions(options);
        options.Save();
        base.OnClosing();
        Refresh();
    }

    /// <summary>
    /// Adds the distinct group items to list.
    /// </summary>
    private void AddDistinctGroupItemsToList(ListBox listBox, String entityName)
    {
        listBox.Items.Clear();
        listBox.Items.Add(String.Empty);

        IList groups = GroupInfo.GetGroupList(entityName);
        if (groups != null)
        {
            ListItem item;
            foreach (GroupInfo group in groups)
            {
                if (!String.IsNullOrEmpty(group.DisplayName))
                {
                    item = new ListItem();
                    item.Text = group.DisplayName;
                    item.Value = group.GroupID;
                    listBox.Items.Add(item);
                }
            }
        }
    }

    /// <summary>
    /// Handles the Init event of the Page control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void Page_Init(object sender, EventArgs e)
    {
        if (Visible)
        {
            _Context = ApplicationContext.Current.Services.Get<IContextService>();
            if (_Context.HasContext("AddManageFilterStateInfo"))
            {
                _State = (AddManageFilterStateInfo) _Context.GetContext("AddManageFilterStateInfo");
            }
            if (_State == null)
            {
                _State = new AddManageFilterStateInfo();
                _State.targetList = GetDataGridLayout();
            }

            rdgIncludeType.Items[0].Attributes.Add("onclick", "javascript:onSearchTypeChange(0);");
            rdgIncludeType.Items[1].Attributes.Add("onclick", "javascript:onSearchTypeChange(1);");
            rdgIncludeType.Items[2].Attributes.Add("onclick", "javascript:onSearchTypeChange(2);");
            rdgIncludeType.Items[3].Attributes.Add("onclick", "javascript:onSearchTypeChange(3);");
            tabLookupTarget.Attributes.Add("onclick", "javascript:OnTabLookupTargetClick()");
            tabAddFromGroup.Attributes.Add("onclick", "javascript:OnTabAddFromGroupClick()");
        }
    }

    /// <summary>
    /// Called when the smartpart has been bound.  Derived components should override this method to run code that depends on entity 
    /// context being set and it not changing.
    /// </summary>
    protected override void OnFormBound()
    {
        ClientBindingMgr.RegisterDialogCancelButton(cmdCancel);
        if (_State != null)
        {
            if (!String.IsNullOrEmpty(txtSelectedTab.Value))
            {
                if (Convert.ToInt16(txtSelectedTab.Value) == 1)
                {
                    divLookupTargets.Style.Add(HtmlTextWriterStyle.Display, "none");
                    divAddFromGroup.Style.Add(HtmlTextWriterStyle.Display, "inline");
                    tabLookupTarget.CssClass = "inactiveTab tab";
                    tabAddFromGroup.CssClass = "activeTab tab";
                }
                else
                {
                    divAddFromGroup.Style.Add(HtmlTextWriterStyle.Display, "none");
                    divLookupTargets.Style.Add(HtmlTextWriterStyle.Display, "inline");
                    tabLookupTarget.CssClass = "activeTab tab";
                    tabAddFromGroup.CssClass = "inactiveTab tab";
                }
            }
            grdTargets.DataSource = _State.targetList;
        }
        grdTargets.DataBind();
        cmdAddTargets.Enabled = grdTargets.Rows.Count > 0;
    }

    /// <summary>
    /// Called when [register client scripts].
    /// </summary>
    protected override void OnRegisterClientScripts()
    {
        base.OnRegisterClientScripts();
        RegisterClientScript();
    }

    /// <summary>
    /// Gets the list of targets based on the filter options.
    /// </summary>
    /// <returns>DataTable </returns>
    private DataTable GetTargets()
    {
        DataTable dt = null;
        IList targets = null;
        if (EntityContext != null)
        {
            dt = GetDataGridLayout();
            switch (rdgIncludeType.SelectedIndex)
            {
                case 0:
                    targets = GetLeadTargets();
                    break;
                case 1:
                    targets = GetAccountTargets();
                    break;
                case 2:
                    targets = GetAccountTargets();
                    break;
                case 3:
                    targets = GetContactTargets();
                    break;
            }
            if (targets != null)
            {
                foreach (object[] data in targets)
                {
                    dt.Rows.Add(data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[7], data[8]);
                }
                if (_State != null)
                {
                    if (rdgIncludeType.SelectedIndex == 0)
                    {
                        _State.targetType = "Lead";
                    }
                    else
                    {
                        _State.targetType = "Contact";
                    }
                    _State.targetList = dt;
                    _Context.SetContext("AddManageFilterStateInfo", _State);
                }
            }
        }
        return dt;
    }

    /// <summary>
    /// Builds the column collection for the data grid layout.
    /// </summary>
    /// <returns></returns>
    private DataTable GetDataGridLayout()
    {
        DataTable dt = new DataTable();
        try
        {
            dt.Columns.Add("FirstName");
            dt.Columns.Add("LastName");
            dt.Columns.Add("Company");
            dt.Columns.Add("Email");
            dt.Columns.Add("City");
            dt.Columns.Add("State");
            dt.Columns.Add("Zip");
            dt.Columns.Add("WorkPhone");
            dt.Columns.Add("EntityId");
        }
        catch (Exception ex)
        {
            log.Error(ex.Message);
            throw;
        }
        return dt;
    }

    /// <summary>
    /// Gets a list of the Lead targets.
    /// </summary>
    /// <returns></returns>
    private IList GetLeadTargets()
    {
        IList leadList = null;
        try
        {
            IQueryable query = (IQueryable)EntityFactory.GetRepository<ILead>();
            IExpressionFactory expressions = query.GetExpressionFactory();
            IProjections projections = query.GetProjectionsFactory();
            ICriteria criteria = query.CreateCriteria("a1")
                .CreateCriteria("Addresses", "address")
                    .SetProjection(projections.ProjectionList()
                        .Add(projections.Property("FirstName"))
                        .Add(projections.Property("LastName"))
                        .Add(projections.Property("Company"))
                        .Add(projections.Property("Email"))
                        .Add(projections.Property("address.City"))
                        .Add(projections.Property("address.State"))
                        .Add(projections.Property("address.PostalCode"))
                        .Add(projections.Property("WorkPhone"))
                        .Add(projections.Property("Id"))
                        );
            AddExpressionsCriteria(criteria, expressions);
            leadList = criteria.List();
        }
        catch (Exception ex)
        {
            log.Error(ex.Message);
            throw;
        }
        return leadList;
    }

    /// <summary>
    /// Gets the contact targets via a join thorugh Account.
    /// </summary>
    /// <returns></returns>
    private IList GetAccountTargets()
    {
        IList contactList = null;
        try
        {
            IQueryable query = (IQueryable)EntityFactory.GetRepository<IContact>();
            IExpressionFactory expressions = query.GetExpressionFactory();
            IProjections projections = query.GetProjectionsFactory();
            Sage.Platform.Repository.ICriteria criteria = query.CreateCriteria("a1")
                .CreateCriteria("Account", "account")
                .CreateCriteria("Addresses", "address")
                    .SetProjection(projections.ProjectionList()
                        .Add(projections.Property("FirstName"))
                        .Add(projections.Property("LastName"))
                        .Add(projections.Property("Account"))
                        .Add(projections.Property("Email"))
                        .Add(projections.Property("address.City"))
                        .Add(projections.Property("address.State"))
                        .Add(projections.Property("address.PostalCode"))
                        .Add(projections.Property("WorkPhone"))
                        .Add(projections.Property("Id"))
                        );
            AddExpressionsCriteria(criteria, expressions);
            contactList = criteria.List();
        }
        catch(NHibernate.QueryException nex)
        {
            log.Error(nex.Message);
            string message = GetLocalResourceObject("QueryError").ToString();
            if (nex.Message.Contains("could not resolve property"))
                message += "  " + GetLocalResourceObject("QueryErrorInvalidParameter").ToString();

            throw new ValidationException(message);
        }
        catch (Exception ex)
        {
            log.Error(ex.Message);
            throw;
        }
        return contactList;
    }

    /// <summary>
    /// Gets the contact targets.
    /// </summary>
    /// <returns></returns>
    private IList GetContactTargets()
    {
        IList contactList = null;
        try
        {
            IQueryable query = (IQueryable)EntityFactory.GetRepository<IContact>();
            IExpressionFactory expressions = query.GetExpressionFactory();
            IProjections projections = query.GetProjectionsFactory();
            ICriteria criteria = query.CreateCriteria("a1")
                .CreateCriteria("Account", "account")
                .CreateCriteria("Addresses", "address")
                    .SetProjection(projections.ProjectionList()
                        .Add(projections.Property("FirstName"))
                        .Add(projections.Property("LastName"))
                        .Add(projections.Property("Account"))
                        .Add(projections.Property("Email"))
                        .Add(projections.Property("address.City"))
                        .Add(projections.Property("address.State"))
                        .Add(projections.Property("address.PostalCode"))
                        .Add(projections.Property("WorkPhone"))
                        .Add(projections.Property("Id"))
                        );
            AddExpressionsCriteria(criteria, expressions);
            contactList = criteria.List();
        }
        catch (Exception ex)
        {
            log.Error(ex.Message);
            throw;
        }
        return contactList;
    }

    /// <summary>
    /// Adds the expressions criteria.
    /// </summary>
    /// <param name="criteria">The criteria.</param>
    /// <param name="expressions">The expressions.</param>
    /// <returns></returns>
    private void AddExpressionsCriteria(ICriteria criteria, IExpressionFactory expressions)
    {
        if (criteria != null)
        {
            SearchParameter clause;
            Boolean isLeads = (rdgIncludeType.SelectedIndex == 0);
            Boolean isPrimaryContact = (rdgIncludeType.SelectedIndex == 1);
            Boolean isIndividual = (rdgIncludeType.SelectedIndex == 3);

            if (isIndividual)
            {
                criteria.Add(expressions.Eq("address.IsPrimary", true));
            }
            if (isPrimaryContact)
            {
                criteria.Add(expressions.Eq("a1.IsPrimary", true));
            }
            if (chkCompany.Checked)
            {
                clause = (SearchParameter)lbxCompany.SelectedIndex;
                if (isLeads)
                    criteria.Add(GetExpression(expressions, clause, "a1.Company", txtCompany.Text));
                else
                    criteria.Add(GetExpression(expressions, clause, "account.AccountName", txtCompany.Text));
            }
            if (chkIndustry.Checked)
            {
                clause = (SearchParameter)lbxIndustry.SelectedIndex;
                if (isLeads)
                    criteria.Add(GetExpression(expressions, clause, "a1.Industry", pklIndustry.PickListValue));
                else
                    criteria.Add(GetExpression(expressions, clause, "account.Industry", pklIndustry.PickListValue));
            }
            if (chkSIC.Checked)
            {
                clause = (SearchParameter)lbxSIC.SelectedIndex;
                if (isLeads)
                    criteria.Add(GetExpression(expressions, clause, "a1.SICCode", txtSIC.Text));
                else
                    criteria.Add(GetExpression(expressions, clause, "account.SicCode", txtSIC.Text));
            }
            if (chkTitle.Checked)
            {
                clause = (SearchParameter)lbxTitle.SelectedIndex;
                criteria.Add(GetExpression(expressions, clause, "a1.Title", pklTitle.PickListValue));
            }
            if (chkProducts.Checked && !isLeads)
            {
                criteria.CreateCriteria("account.AccountProducts", "product");
                clause = (SearchParameter)lbxProducts.SelectedIndex;
                criteria.Add(GetExpression(expressions, clause, "product.ProductName", lueProducts.Text));
            }
            if (chkStatus.Checked)
            {
                clause = (SearchParameter)lbxStatus.SelectedIndex;
                if (isLeads || isIndividual)
                    criteria.Add(GetExpression(expressions, clause, "a1.Status", pklStatus.PickListValue));
                else
                    criteria.Add(GetExpression(expressions, clause, "account.Status", pklStatus.PickListValue));
            }
            if (!chkSolicit.Checked)
                criteria.Add(expressions.Or(expressions.Eq("a1.DoNotSolicit", false), expressions.IsNull("a1.DoNotSolicit")));
            if (!chkEmail.Checked)
                criteria.Add(expressions.Or(expressions.Eq("a1.DoNotEmail", false), expressions.IsNull("a1.DoNotEmail")));
            if (!chkCall.Checked)
                criteria.Add(expressions.Or(expressions.Eq("a1.DoNotPhone", false), expressions.IsNull("a1.DoNotPhone")));
            if (!chkMail.Checked)
                criteria.Add(expressions.Or(expressions.Eq("a1.DoNotMail", false), expressions.IsNull("a1.DoNotMail")));
            if (!chkFax.Checked)
            {
                if (isLeads)
                    criteria.Add(expressions.Or(expressions.Eq("a1.DoNotFAX", false), expressions.IsNull("a1.DoNotFAX")));
                else
                    criteria.Add(expressions.Or(expressions.Eq("a1.DoNotFax", false), expressions.IsNull("a1.DoNotFax")));
            }
            if (chkCity.Checked)
            {
                clause = (SearchParameter)lbxCity.SelectedIndex;
                AddCommaDelimitedStringsToExpression(criteria, expressions, txtCity.Text, "address.City", clause);
            }
            if (chkState.Checked)
            {
                clause = (SearchParameter)lbxState.SelectedIndex;
                AddCommaDelimitedStringsToExpression(criteria, expressions, txtState.Text, "address.State", clause);
            }
            if (chkZip.Checked)
            {
                clause = (SearchParameter)lbxZip.SelectedIndex;
                AddCommaDelimitedStringsToExpression(criteria, expressions, txtZip.Text, "address.PostalCode", clause);
            }
            if (chkLeadSource.Checked)
            {             
                switch (rdgIncludeType.SelectedIndex)
                {
                    case 0:
                        criteria.CreateCriteria("a1.LeadSource", "leadsource");
                        break;
                    case 3:
                        criteria.CreateCriteria("a1.LeadSources", "leadsource");
                        break;
                    default:
                        criteria.CreateCriteria("account.LeadSource", "leadsource");
                        break;
                }
                clause = (SearchParameter)lbxLeadSource.SelectedIndex;
                criteria.Add(GetExpression(expressions, clause, "leadsource.Description", lueLeadSource.Text));
            }
            if (chkImportSource.Checked)
            {
                clause = (SearchParameter)lbxImportSource.SelectedIndex;
                if (isLeads || isIndividual)
                    criteria.Add(GetExpression(expressions, clause, "a1.ImportSource", pklImportSource.PickListValue));
                else
                    criteria.Add(GetExpression(expressions, clause, "account.ImportSource", pklImportSource.PickListValue));
            }
            if (!string.IsNullOrEmpty(dtpCreateFromDate.Text))
            {
                if (chkCreateDate.Checked && (isLeads || isIndividual))
                    criteria.Add(expressions.Between("a1.CreateDate", CheckForNullDate(dtpCreateFromDate.DateTimeValue), CheckForNullDate(dtpCreateToDate.DateTimeValue)));
                else if (chkCreateDate.Checked)
                    criteria.Add(expressions.Between("account.CreateDate", CheckForNullDate(dtpCreateFromDate.DateTimeValue), CheckForNullDate(dtpCreateToDate.DateTimeValue)));
            }
        }
        return;
    }

    /// <summary>
    /// Gets the expression.
    /// </summary>
    /// <param name="ef">The ef.</param>
    /// <param name="expression">The expression.</param>
    /// <param name="propName">Name of the prop.</param>
    /// <param name="value">The value.</param>
    /// <returns></returns>
    private static IExpression GetExpression(IExpressionFactory ef, SearchParameter expression, string propName, string value)
    {
        switch (expression)
        {
            case SearchParameter.StartingWith:
                return ef.InsensitiveLike(propName, value, LikeMatchMode.BeginsWith);
            case SearchParameter.Contains:
                return ef.InsensitiveLike(propName, value, LikeMatchMode.Contains);
            case SearchParameter.EqualOrGreaterThan:
                return ef.Ge(propName, value);
            case SearchParameter.EqualOrLessThan:
                return ef.Le(propName, value);
            case SearchParameter.EqualTo:
                return ef.Eq(propName, value);
            case SearchParameter.GreaterThan:
                return ef.Gt(propName, value);
            case SearchParameter.LessThan:
                return ef.Lt(propName, value);
            case SearchParameter.NotEqualTo:
                return ef.InsensitiveNe(propName, value);
        }
        return null;
    }

    /// <summary>
    /// Adds the comma delimited strings to the expression factory.
    /// </summary>
    /// <param name="criteria">The criteria.</param>
    /// <param name="expressions">The expressions.</param>
    /// <param name="text">The text.</param>
    /// <param name="propertyName">Name of the property.</param>
    /// <param name="clause">The clause.</param>
    private static void AddCommaDelimitedStringsToExpression(ICriteria criteria, IExpressionFactory expressions, String text,
        String propertyName, SearchParameter clause)
    {
        if (!string.IsNullOrEmpty(text))
        {
            IList<IExpression> expression = new List<IExpression>();
            IJunction junction;
            string[] values = text.Split(',');
            foreach (String value in values)
            {
                expression.Add(GetExpression(expressions, clause, propertyName, value));
            }
            junction = expressions.Disjunction();
            foreach (IExpression e in expression)
            {
                junction.Add(e);
            }
            criteria.Add(junction);
        }
        return;
    }

    /// <summary>
    /// Handles the OnClick event of the HowMany control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void HowMany_OnClick(object sender, EventArgs e)
    {
        IList targets = null;
        int count = 0;
        switch (rdgIncludeType.SelectedIndex)
        {
            case 0:
                targets = GetLeadTargets();
                break;
            case 1:
                targets = GetAccountTargets();
                break;
            case 2:
                targets = GetAccountTargets();
                break;
            case 3:
                targets = GetContactTargets();
                break;
        }
        if (targets != null)
            count = targets.Count;
        lblHowMany.Text = String.Format(GetLocalResourceObject("HowManyTargets_Msg").ToString(), count);
    }

    /// <summary>
    /// Handles the OnClick event of the Search control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void Search_OnClick(object sender, EventArgs e)
    {
        grdTargets.DataSource = GetTargets();
    }

    /// <summary>
    /// Handles the OnClick event of the AddFromGroup control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void AddFromGroup_OnClick(object sender, EventArgs e)
    {
        string groupId = String.Empty;
        string entityName = String.Empty;
        if (rdgAddFromGroup.SelectedIndex == 0)
        {
            entityName = "Lead";
            groupId = lbxLeadGroups.SelectedValue;
        }
        else
        {
            entityName = "Contact";
            groupId = lbxContactGroups.SelectedValue;
        }

        if (!String.IsNullOrEmpty(groupId))
        {
            DataTable dataTable = Helpers.GetEntityGroupList(entityName, groupId);
            if (_State != null)
            {
                _State.targetList = dataTable;
                _State.targetType = entityName;
                _State.groupName = lbxContactGroups.SelectedItem.ToString();
                _Context.SetContext("AddManageFilterStateInfo", _State);
            }
        }
        else
        {
            throw new ValidationException(GetLocalResourceObject("error_NoGroupSelected").ToString());
        }
    }

    /// <summary>
    /// Handles the changing event of the grdTargetspage control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="GridViewPageEventArgs"/> instance containing the event data.</param>
    protected void grdTargetspage_changing(object sender, GridViewPageEventArgs e)
    {
    }

    /// <summary>
    /// Handles the Sorting event of the grdTargets control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="GridViewSortEventArgs"/> instance containing the event data.</param>
    protected void grdTargets_Sorting(object sender, GridViewSortEventArgs e)
    {
    }

    /// <summary>
    /// Checks for null date and returns current date/time if null.
    /// </summary>
    /// <param name="dateTime">The date time value.</param>
    /// <returns></returns>
    private DateTime? CheckForNullDate(DateTime? dateTime)
    {
        if (dateTime == null)
            dateTime = DateTime.UtcNow;
        return dateTime;
    }

    /// <summary>
    /// Sets the filter controls.
    /// </summary>
    /// <param name="options">The options.</param>
    private void SetFilterControls(FilterOptions options)
    {
        chkCompany.Checked = options.CompanyEnabled;
        SetListBox(lbxCompany, options.CompanyOperator);
        txtCompany.Text = options.CompanyValue;

        chkTitle.Checked = options.TitleEnabled;
        SetListBox(lbxTitle, options.TitleOperator);
        pklTitle.PickListValue = options.TitleValue;

        chkIndustry.Checked = options.IndustryEnabled;
        SetListBox(lbxIndustry, options.IndustryOperator);
        pklIndustry.PickListValue = options.IndustryValue;

        chkSIC.Checked = options.SICEnabled;
        SetListBox(lbxSIC, options.SICOperator);
        txtSIC.Text = options.SICValue;

        chkProducts.Checked = options.ProdOwnedEnabled;
        SetListBox(lbxProducts, options.ProdOwnedOperator);
        lueProducts.Text = options.ProdOwnedValue;

        chkLeadSource.Checked = options.LeadSourceEnabled;
        SetListBox(lbxLeadSource, options.LeadSourceOperator);
        lueLeadSource.Text = options.LeadSourceValue;

        chkStatus.Checked = options.StatusEnabled;
        SetListBox(lbxStatus, options.StatusOperator);
        pklStatus.PickListValue = options.StatusValue;

        chkState.Checked = options.StateEnabled;
        SetListBox(lbxState, options.StateOperator);
        txtState.Text = options.StateValue;

        chkZip.Checked = options.PostalCodeEnabled;
        SetListBox(lbxZip, options.PostalCodeOperator);
        txtZip.Text = options.PostalCodeValue;

        chkCity.Checked = options.CityEnabled;
        SetListBox(lbxCity, options.CityOperator);
        txtCity.Text = options.CityValue;

        chkImportSource.Checked = options.ImportSourceEnabled;
        SetListBox(lbxImportSource, options.ImportSourceOperator);
        pklImportSource.PickListValue = options.ImportSourceValue;

        chkMail.Checked = options.IncludeDoNotMail;
        chkEmail.Checked = options.IncludeDoNotEmail;
        chkCall.Checked = options.IncludeDoNotPhone;
        chkFax.Checked = options.IncludeDoNotFax;
        chkSolicit.Checked = options.IncludeDoNotSolicit;

        rdgIncludeType.SelectedIndex = (int)options.IncludeType;

        chkCreateDate.Checked = options.CreateDateEnabled = chkCreateDate.Checked;
        dtpCreateFromDate.DateTimeValue = options.CreateDateFromValue;
        dtpCreateToDate.DateTimeValue = options.CreateDateToValue;
    }

    /// <summary>
    /// Sets the filter options.
    /// </summary>
    /// <param name="options">The options.</param>
    private void SetFilterOptions(FilterOptions options)
    {
        options.CompanyEnabled = chkCompany.Checked;
        options.CompanyOperator = (FilterOperator)lbxCompany.SelectedIndex;
        options.CompanyValue = txtCompany.Text;

        options.TitleEnabled = chkTitle.Checked;
        options.TitleOperator = (FilterOperator)lbxTitle.SelectedIndex;
        options.TitleValue = pklTitle.PickListValue;
        
        options.IndustryEnabled = chkIndustry.Checked;
        options.IndustryOperator = (FilterOperator)lbxIndustry.SelectedIndex;
        options.IndustryValue = pklIndustry.PickListValue;

        options.SICEnabled = chkSIC.Checked;
        options.SICOperator = (FilterOperator)lbxSIC.SelectedIndex;
        options.SICValue = txtSIC.Text;

        options.ProdOwnedEnabled = chkProducts.Checked;
        options.ProdOwnedOperator = (FilterOperator)lbxProducts.SelectedIndex;
        string prodOwnerID = lueProducts.ClientID + "_LookupText";
        string prodOwner = Request.Form[prodOwnerID.Replace("_", "$")];
        options.ProdOwnedValue = prodOwner;

        options.LeadSourceEnabled = chkLeadSource.Checked;
        options.LeadSourceOperator = (FilterOperator)lbxLeadSource.SelectedIndex;
        string leadSourceID = lueLeadSource.ClientID + "_LookupText";
        string leadSource = Request.Form[leadSourceID.Replace("_", "$")];
        options.LeadSourceValue = leadSource;

        options.StatusEnabled = chkStatus.Checked;
        options.StatusOperator = (FilterOperator)lbxStatus.SelectedIndex;
        options.StatusValue = pklStatus.PickListValue;

        options.StateEnabled = chkState.Checked;
        options.StateOperator = (FilterOperator)lbxState.SelectedIndex;
        options.StateValue = txtState.Text;

        options.PostalCodeEnabled = chkZip.Checked;
        options.PostalCodeOperator = (FilterOperator)lbxZip.SelectedIndex;
        options.PostalCodeValue = txtZip.Text;

        options.CityEnabled = chkCity.Checked;
        options.CityOperator = (FilterOperator)lbxCity.SelectedIndex;
        options.CityValue = txtCity.Text;

        options.ImportSourceEnabled = chkImportSource.Checked;
        options.ImportSourceOperator = (FilterOperator)lbxImportSource.SelectedIndex;
        options.ImportSourceValue = pklImportSource.PickListValue;

        options.IncludeDoNotMail = chkMail.Checked;
        options.IncludeDoNotEmail = chkEmail.Checked;
        options.IncludeDoNotPhone = chkCall.Checked;
        options.IncludeDoNotFax = chkFax.Checked;
        options.IncludeDoNotSolicit = chkSolicit.Checked;
        options.IncludeType = (FilterIncludeType)rdgIncludeType.SelectedIndex;
        options.CreateDateEnabled = chkCreateDate.Checked;
        options.CreateDateFromValue = dtpCreateFromDate.DateTimeValue;
        options.CreateDateToValue = dtpCreateToDate.DateTimeValue;
    }

    /// <summary>
    /// Sets the list box.
    /// </summary>
    /// <param name="lbx">The LBX.</param>
    /// <param name="filterOperator">The filter operator.</param>
    private void SetListBox(ListBox lbx, FilterOperator filterOperator)
    {
        lbx.SelectedIndex = (int)filterOperator;
    }

    /// <summary>
    /// Handles the OnClick event of the AddTargets control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewSortEventArgs"/> instance containing the event data.</param>
    protected void AddTargets_OnClick(object sender, EventArgs e)
    {
        if (_State != null)
        {
            if (_State.targetList.Rows.Count > 0)
            {
                //SetStartProcessInfo();
                InsertTargetManager insertManager = new InsertTargetManager();
                insertManager.CampaignId = EntityContext.EntityID.ToString();
                insertManager.TargetList = _State.targetList;
                insertManager.TargetType = _State.targetType;
                insertManager.GroupName = _State.groupName;
                insertManager.StartTargetInsertProcess();
                //SetCompleteProcessInfo();
                DialogService.CloseEventHappened(sender, e);
                Refresh();
                //if (DialogService != null)
                //{
                //    DialogService.SetSpecs(200, 200, 200, 450, "InsertTargetProgress");
                //    DialogService.DialogParameters.Add("targetsDataTable", _State.targetList);
                //    DialogService.ShowDialog();
                //}
            }
            else
            {
                DialogService.ShowMessage(GetLocalResourceObject("error_NoTargetsSelected").ToString());
            }
        }
        else
        {
            DialogService.ShowMessage(GetLocalResourceObject("error_NoTargetsSelected").ToString());
        }
    }

    /// <summary>
    /// Gets the arguements from the handler to set the progress indicator.
    /// </summary>
    /// <param name="args">The args.</param>
    private void InsertTargetHandler(InsertProgressArgs args)
    {
        RadProgressContext insertProgress = RadProgressContext.Current;
        insertProgress["myProgressInfo"] = "112";
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
    #endregion
}