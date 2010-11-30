using System;
using System.Web.UI;
using System.Collections.Generic;
using Sage.Entity.Interfaces;
using Sage.Platform;
using Sage.Platform.Application;
using Sage.Platform.Application.UI;
using Sage.Platform.WebPortal.SmartParts;
using Sage.SalesLogix.Services.PotentialMatch;
using System.Web.UI.WebControls;
using System.Data;
using log4net;
using System.Text;
using Sage.Platform.Application.UI.Web;
using Sage.Platform.Orm;

public partial class LeadSearchAndConvert : EntityBoundSmartPartInfoProvider
{
    private LeadDuplicateProvider _duplicateProvider;
    private string _redirectURL = string.Empty;
    private Boolean? _IsImportView;
    

    #region Public Methods

    /// <summary>
    /// Gets the type of the entity.
    /// </summary>
    /// <value>The type of the entity.</value>
    public override Type EntityType
    {
        get { return typeof(ILead); }
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

        foreach (Control c in LeadMatching_RTools.Controls)
        {
            tinfo.RightTools.Add(c);
        }
        return tinfo;
    }

    /// <summary>
    /// Gets the duplicate provider.
    /// </summary>
    /// <value>The duplicate provider.</value>
    public LeadDuplicateProvider DuplicateProvider
    {
        get
        {
            if (_duplicateProvider == null || _duplicateProvider.EntitySource.EntityData == null)
            {
                try
                {
                    if (DialogService.DialogParameters.Count > 0 && (DialogService.DialogParameters.ContainsKey("duplicateProvider")))
                    {
                        _duplicateProvider = DialogService.DialogParameters["duplicateProvider"] as LeadDuplicateProvider;
                    }
                    else
                    {
                        _duplicateProvider = new LeadDuplicateProvider();
                        MatchEntitySource entitySource = new MatchEntitySource(typeof(ILead), BindingSource.Current);
                        _duplicateProvider.EntitySource = entitySource;
                        if (!_IsImportView.GetValueOrDefault(true))
                        {
                            _duplicateProvider.SearchAccount = true;
                        }
                    }
                }
                catch (Exception exp)
                {
                    throw new ValidationException(String.Format(GetLocalResourceObject("LoadErrorMSG").ToString(), exp.Message));
                }
            }
            return _duplicateProvider;
        }
    }

    /// <summary>
    /// Gets the is import view.
    /// </summary>
    /// <value>The is import view.</value>
    public Boolean IsImportView
    {
        get
        {
            if (!_IsImportView.HasValue)
                _IsImportView = (DialogService.DialogParameters.Count > 0 && (DialogService.DialogParameters.ContainsKey("duplicateProvider")));
            return Convert.ToBoolean(_IsImportView);
        }
    }

    #endregion

    #region Private Methods

    /// <summary>
    /// Loads the source entity that the de-dup will be performed on.
    /// </summary>
    private void LoadSourceEntity()
    {
        if (DuplicateProvider != null)
        {
            try
            {
                if (BindingSource.Current != null)
                {
                    LoadSourceSnapshot(BindingSource.Current as ILead);
                }
                else
                {
                    LoadSourceSnapshot(DuplicateProvider.EntitySource.EntityData as ILead);
                }
            }
            catch (Exception ex)
            {
                log.Error(ex.Message);
            }
        }
    }

    /// <summary>
    /// Loads the match filters.
    /// </summary>
    private void LoadMatchFilters()
    {
        SetActiveFilters();
        chklstFilters.Items.Clear();
        foreach (MatchPropertyFilterMap propertyFilter in DuplicateProvider.GetFilters())
        {
            ListItem item = new ListItem();
            // If resource does not exist then use the xml value. Item is prefixed with "Filter" to better identify resourse items
            if (GetLocalResourceObject("Filter." + propertyFilter.PropertyName) != null && GetLocalResourceObject("Filter." + propertyFilter.PropertyName).ToString() != "")
            {
                item.Text = GetLocalResourceObject("Filter." + propertyFilter.PropertyName).ToString();
            }
            else
            {
                item.Text = propertyFilter.DisplayName;
            }

            item.Value = propertyFilter.PropertyName;
            item.Selected = propertyFilter.Enabled;
            chklstFilters.Items.Add(item);
        }
    }

    /// <summary>
    /// Loads the potential matches.
    /// </summary>
    private void LoadPotentialMatches()
    {

        if (Mode.Value == "Load")
        {
            Mode.Value = "View";
            if (!IsImportView)
            {
                DuplicateProvider.SearchLead = false;
                chkLeads.Checked = false;
            }
            if (UpdateIndex.Value == "True")
            {
                DuplicateProvider.RefreshIndexes(false);
                UpdateIndex.Value = "False";
            }
                DuplicateProvider.FindMatches();
            MatchResults matchResults = DuplicateProvider.GetMatchResults();
            DataTable accountTable = GetPotentialAccountMatchesLayout();

            if (matchResults != null)
            {
                DataTable dataTable = GetPotentialMatchesLayout();

                string leadType = "Lead";
                string contactType = "Contact";
                matchResults.HydrateResults();
                foreach (MatchResultItem resultItem in matchResults.Items)
                {
                    if (typeof(ILead).Equals(resultItem.EntityType))
                    {
                        AddLeadEntityToDataSource(dataTable, resultItem, leadType);
                    }
                    else if (typeof(IContact).Equals(resultItem.EntityType))
                    {
                        AddContactEntityToDataSource(dataTable, resultItem, contactType);
                    }
                    else if (typeof(IAccount).Equals(resultItem.EntityType))
                    {
                        AddAccountEntityToDataSource(accountTable, resultItem);
                    }
                }
                grdMatches.DataSource = dataTable;
            }
            grdMatches.DataBind();

            if (!IsImportView)
            {
                grdAccountMatches.DataSource = accountTable;
                grdAccountMatches.DataBind();
            }
        }
        else 
        {
            
            grdAccountMatches.DataBind();
            grdMatches.DataBind();
        
        }
    }

    /// <summary>
    /// Adds the lead entity to data source.
    /// </summary>
    private void AddLeadEntityToDataSource(DataTable dataTable, MatchResultItem resultItem, string type)
    {
        try
        {
            string entityName = GetLocalResourceObject("lblLeads.Caption").ToString();
            ILead lead = resultItem.Data as ILead;
            dataTable.Rows.Add(lead.Id.ToString(), type, resultItem.Score, entityName, lead.Company, lead.FirstName,
                lead.LastName, lead.Title, lead.Email, lead.Address.LeadCtyStZip, lead.WorkPhone);
        }
        catch
        {
        }
    }

    /// <summary>
    /// Adds the contact entity to data source.
    /// </summary>
    /// <param name="dataTable">The data table.</param>
    private void AddContactEntityToDataSource(DataTable dataTable, MatchResultItem resultItem, string type)
    {
        try
        {
            string entityName = GetLocalResourceObject("lblContacts.Caption").ToString();
            IContact contact = resultItem.Data as IContact;
            dataTable.Rows.Add(contact.Id.ToString(), type, resultItem.Score, entityName, contact.Account.AccountName,
                contact.FirstName, contact.LastName, contact.Title, contact.Email, contact.Address.CityStateZip,
                contact.WorkPhone);
        }
        catch
        {
        }
    }

    /// <summary>
    /// Adds the account entity to data source.
    /// </summary>
    /// <param name="accountTable">The account table.</param>
    private void AddAccountEntityToDataSource(DataTable accountTable, MatchResultItem resultItem)
    {
        try
        {
            IAccount account = resultItem.Data as IAccount;
            accountTable.Rows.Add(account.Id.ToString(), resultItem.Score, account.AccountName, account.Industry, account.WebAddress,
                account.Address.CityStateZip, account.MainPhone, account.Type);
        }
        catch
        {
        }
    }

    /// <summary>
    /// Gets the data table.
    /// </summary>
    /// <returns></returns>
    private DataTable GetPotentialMatchesLayout()
    {
        DataTable dataTable = new DataTable("PotentialMatches");
        DataColumn dataColumn;

        dataColumn = dataTable.Columns.Add();
        dataColumn.ColumnName = "Id";
        dataColumn.DataType = typeof(string);
        dataColumn.AllowDBNull = true;

        dataColumn = dataTable.Columns.Add();
        dataColumn.ColumnName = "EntityType";
        dataColumn.DataType = typeof(string);
        dataColumn.AllowDBNull = true;

        dataColumn = dataTable.Columns.Add();
        dataColumn.ColumnName = "Score";
        dataColumn.DataType = typeof(int);
        dataColumn.AllowDBNull = true;

        dataColumn = dataTable.Columns.Add();
        dataColumn.ColumnName = "EntityName";
        dataColumn.DataType = typeof(string);
        dataColumn.AllowDBNull = true;

        dataColumn = dataTable.Columns.Add();
        dataColumn.ColumnName = "Company";
        dataColumn.DataType = typeof(string);
        dataColumn.AllowDBNull = true;

        dataColumn = dataTable.Columns.Add();
        dataColumn.ColumnName = "FirstName";
        dataColumn.DataType = typeof(string);
        dataColumn.AllowDBNull = true;

        dataColumn = dataTable.Columns.Add();
        dataColumn.ColumnName = "LastName";
        dataColumn.DataType = typeof(string);
        dataColumn.AllowDBNull = true;

        dataColumn = dataTable.Columns.Add();
        dataColumn.ColumnName = "Title";
        dataColumn.DataType = typeof(string);
        dataColumn.AllowDBNull = true;

        dataColumn = dataTable.Columns.Add();
        dataColumn.ColumnName = "Email";
        dataColumn.DataType = typeof(string);
        dataColumn.AllowDBNull = true;

        dataColumn = dataTable.Columns.Add();
        dataColumn.ColumnName = "CityStateZip";
        dataColumn.DataType = typeof(string);
        dataColumn.AllowDBNull = true;

        dataColumn = dataTable.Columns.Add();
        dataColumn.ColumnName = "WorkPhone";
        dataColumn.DataType = typeof(string);
        dataColumn.AllowDBNull = true;

        return dataTable;
    }

    /// <summary>
    /// Gets the potential account matches layout.
    /// </summary>
    /// <returns></returns>
    private DataTable GetPotentialAccountMatchesLayout()
    {
        DataTable dataTable = new DataTable("AccountMatches");
        DataColumn dataColumn;

        dataColumn = dataTable.Columns.Add();
        dataColumn.ColumnName = "Id";
        dataColumn.DataType = typeof(string);
        dataColumn.AllowDBNull = true;

        dataColumn = dataTable.Columns.Add();
        dataColumn.ColumnName = "Score";
        dataColumn.DataType = typeof(int);
        dataColumn.AllowDBNull = true;

        dataColumn = dataTable.Columns.Add();
        dataColumn.ColumnName = "AccountName";
        dataColumn.DataType = typeof(string);
        dataColumn.AllowDBNull = true;

        dataColumn = dataTable.Columns.Add();
        dataColumn.ColumnName = "Industry";
        dataColumn.DataType = typeof(string);
        dataColumn.AllowDBNull = true;

        dataColumn = dataTable.Columns.Add();
        dataColumn.ColumnName = "WebAddress";
        dataColumn.DataType = typeof(string);
        dataColumn.AllowDBNull = true;

        dataColumn = dataTable.Columns.Add();
        dataColumn.ColumnName = "CityStateZip";
        dataColumn.DataType = typeof(string);
        dataColumn.AllowDBNull = true;

        dataColumn = dataTable.Columns.Add();
        dataColumn.ColumnName = "MainPhone";
        dataColumn.DataType = typeof(string);
        dataColumn.AllowDBNull = true;

        dataColumn = dataTable.Columns.Add();
        dataColumn.ColumnName = "Type";
        dataColumn.DataType = typeof(string);
        dataColumn.AllowDBNull = true;

        return dataTable;
    }

    /// <summary>
    /// Sets the active filters.
    /// </summary>
    private void SetActiveFilters()
    {
        foreach (ListItem item in chklstFilters.Items)
            DuplicateProvider.SetActiveFilter(item.Value, item.Selected);
        if (rdgOptions.SelectedIndex == 0)
            DuplicateProvider.MatchOperator = MatchOperator.And;
        else
            DuplicateProvider.MatchOperator = MatchOperator.Or;

        DuplicateProvider.SearchAccount = true;
        DuplicateProvider.SearchContact = (chkContacts.Checked);
        DuplicateProvider.SearchLead = (chkLeads.Checked);
        DuplicateProvider.AdvancedOptions = MatchOptions.GetAdvancedOptions();
    }


    /// <summary>
    /// Sets the display properties.
    /// </summary>
    private void SetDisplayProperties()
    {
        bool importView = IsImportView;
        ddlAccountConflicts.Visible = !IsImportView;
        chkCreateOpportunity.Visible = !importView;
        lblCreateOpportunity.Visible = !importView;
        lblAccountConflicts.Visible = !importView;
        grdAccountMatches.Visible = !importView;
        lblAccountMatches.Visible = !importView;
        if (importView)
        {
            divTypes.Style.Add(HtmlTextWriterStyle.Display, "inline");
            divSearchTypes.Style.Add(HtmlTextWriterStyle.Display, "inline");
        }
        cmdConvert.Visible = !importView;
        cmdInsert.Visible = importView;
    }

    /// <summary>
    /// Registers the client script.
    /// </summary>
    private void RegisterClientScript()
    {
        StringBuilder sb = new StringBuilder(GetLocalResourceObject("LeadSearchAndConvert_ClientScript").ToString());
        sb.Replace("@lsc_divFiltersId", divFilters.ClientID);
        sb.Replace("@lsc_tabFiltersId", tabFilters.ClientID);
        sb.Replace("@lsc_divOptionsId", divOptions.ClientID);
        sb.Replace("@lsc_tabOptionsId", tabOptions.ClientID);
        sb.Replace("@lsc_txtSelectedTabId", txtSelectedTab.ClientID);

        ScriptManager.RegisterStartupScript(Page, GetType(), "LeadSearchAndConvert", sb.ToString(), false);
    }

    /// <summary>
    /// Sets the visible state of the tabs.
    /// </summary>
    private void SetVisibleTabState()
    {
        divFilters.Style.Add(HtmlTextWriterStyle.Display, "block");
        divOptions.Style.Add(HtmlTextWriterStyle.Display, "none");
        tabFilters.CssClass = "activeTab";
        tabOptions.CssClass = "inactiveTab";
        string selectedTab = Request.Form[txtSelectedTab.ClientID.Replace("_", "$")];
        if (!String.IsNullOrEmpty(selectedTab))
        {
            if (selectedTab.Equals("2"))
            {
                divFilters.Style.Add(HtmlTextWriterStyle.Display, "none");
                divOptions.Style.Add(HtmlTextWriterStyle.Display, "block");
                tabFilters.CssClass = "inactiveTab";
                tabOptions.CssClass = "activeTab";
                return;
            }
        }
    }

    /// <summary>
    /// Merges the record.
    /// </summary>
    /// <param name="targetId">The target id.</param>
    /// <param name="targetType">Type of the target.</param>
    private void MergeRecord(string targetId, string targetType)
    {
        Type tType = null;
        object tValue = null;

        if (targetType.Equals("Lead"))
        {
            tType = typeof(ILead);
            tValue = Sage.Platform.EntityFactory.GetById<ILead>(targetId);
        }
        if (targetType.Equals("Contact"))
        {
            tType = typeof(IContact);
            tValue = Sage.Platform.EntityFactory.GetById<IContact>(targetId);
        }

        MatchEntitySource target = new MatchEntitySource(tType, tValue);
        MatchEntitySource source = null;

        if (DuplicateProvider != null)
        {
            source = DuplicateProvider.EntitySource;
            if (source.EntityType == typeof(ILead))
            {
                LeadMergeProvider mergeProvider = new LeadMergeProvider(target.EntityType);
                mergeProvider.Source = source;
                mergeProvider.Target = target;
                Page.Session["mergeProvider"] = mergeProvider;

                IList<MergeRecordView> mergeView = mergeProvider.GetMergeView();
                grdMerge.DataSource = mergeView;
                grdMerge.DataBind();
            }
        }
    }


    /// <summary>
    /// Loads the source snapshot.
    /// </summary>
    /// <param name="source">The source.</param>
    private void LoadSourceSnapshot(ILead lead)
    {
        if (lead != null)
        {
            if (!String.IsNullOrEmpty(lead.LastName))
                lblLead.Text = String.Format("{0}, {1}", lead.LastName, lead.FirstName);
            else
                lblLead.Text = lead.FirstName;
            lblValueCompany.Text = lead.Company;
            if (lead.Address != null)
                lblAddress.Text = lead.Address.FormatFullLeadAddress();
            lblValueEmail.Text = lead.Email;
            lblValueTitle.Text = lead.Title;
            phnWorkPhone.Text = lead.WorkPhone;
            lblValueWeb.Text = lead.WebAddress;
        }
    }

    /// <summary>
    /// Sets the div visable.
    /// </summary>
    /// <param name="divID">The div ID.</param>
    private void SetDivVisable(string divID)
    {
        pnlSearchForDuplicates.Visible = false;
        pnlMergeRecords.Visible = false;

        switch (divID)
        {
            case "pnlSearchForDuplicates":
                pnlSearchForDuplicates.Visible = true;
                break;
            case "pnlMergeRecords":
                pnlMergeRecords.Visible = true;
                break;
        }
    }

    #endregion

    /// <summary>
    /// Override this method to add bindings to the currrently bound smart part
    /// </summary>
    protected override void OnAddEntityBindings()
    {
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
            SmartPart smartPart = MatchOptions;
            if (smartPart != null)
            {
                smartPart.InitSmartPart(ParentWorkItem, PageWorkItem.Services.Get<IPageWorkItemLocator>());
                smartPart.DialogService = DialogService;
                EntityBoundSmartPart entitySmartPart = smartPart as EntityBoundSmartPart;
                if (entitySmartPart != null)
                    entitySmartPart.InitEntityBoundSmartPart(PageWorkItem.Services.Get<IEntityContextService>());
            }
            tabFilters.Attributes.Add("onclick", "javascript:OnTabFiltersClick()");
            tabOptions.Attributes.Add("onclick", "javascript:OnTabOptionsClick()");
        }
    }

    /// <summary>
    /// Raises the <see cref="E:Load"/> event.
    /// </summary>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected override void OnLoad(EventArgs e)
    {
        base.OnLoad(e);

        if (Visible)
        {
            RegisterClientScript();
            SetVisibleTabState();
        }
    }

    /// <summary>
    /// Raises the <see cref="E:PreRender"/> event.
    /// </summary>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected override void OnPreRender(EventArgs e)
    {
        try
        {
            if (Visible && DuplicateProvider != null)
            {
                LoadMatchFilters();
                LoadSourceEntity();
                LoadPotentialMatches();
                lblMatchesFound.Text = String.Format(GetLocalResourceObject("lblMatchesFound.Caption").ToString(), grdMatches.TotalRecordCount);
                SetDisplayProperties();
            }
        }
        catch (Exception exp)
        {
            throw new ValidationException(String.Format(GetLocalResourceObject("LoadErrorMSG").ToString(), exp.Message));
        }
    }

    /// <summary>
    /// Derived components should override this method to wire up event handlers.
    /// </summary>
    protected override void OnWireEventHandlers()
    {
        cmdCancel.Click += new EventHandler(DialogService.CloseEventHappened);
    }

    /// <summary>
    /// Handles the SelectedIndexChanged event of the grdMatches control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void grdMatches_SelectedIndexChanged(object sender, EventArgs e)
    {
       
    }

    /// <summary>
    /// Handles the SelectedIndexChanged event of the grdAccountMatches control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void grdAccountMatches_SelectedIndexChanged(object sender, EventArgs e)
    {

    }
    /// <summary>
    /// Handles the SelectedIndexChanged event of the grdMerge control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void grdMerge_SelectedIndexChanged(object sender, EventArgs e)
    {

    }
    /// <summary>
    /// Handles the Click event of the cmdUpdateMatches control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void cmdUpdateMatches_Click(object sender, EventArgs e)
    {
        Mode.Value = "Load";
    }

    /// <summary>
    /// Handles the Click event of the cmdConvertLead control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void cmdConvert_Click(object sender, EventArgs e)
    {
        try
        {
            ILead lead = DuplicateProvider.EntitySource.EntityData as ILead;
            if (lead != null)
                ConvertLeadToNewAccountAndContact(lead, chkCreateOpportunity.Checked, string.Empty);
        }
        catch (Exception ex)
        {
            log.Error(ex.Message);
        }
    }

    /// <summary>
    /// Handles the Click event of the cmdInsert control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void cmdInsert_Click(object sender, EventArgs e)
    {
        ILead sourceLead = DuplicateProvider.EntitySource.EntityData as ILead;

        if (sourceLead != null)
        {
            using (NHibernate.ISession session = new SessionScopeWrapper(true))
            {
                sourceLead.Save();
                if (sourceLead.Id != null)
                {
                    SetResolveData(sourceLead.Id.ToString(), "ILead", string.Format(GetLocalResourceObject("Resolved.InsertedNewLead").ToString(), string.Format("{0}, {1}", sourceLead.LastName, sourceLead.FirstName)));
                    Response.Redirect(string.Format("Lead.aspx?entityId={0}", (sourceLead.Id)));
                }
            }
        }
    }

    /// <summary>
    /// Handles the OnRowCommand event of the grdDuplicates control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewCommandEventArgs"/> instance containing the event data.</param>
    protected void grdMatches_OnRowCommand(object sender, GridViewCommandEventArgs e)
    {
        if (e.CommandName.Equals("Merge"))
        {
            SetDivVisable(pnlMergeRecords.ID);

            int rowIndex = Convert.ToInt32(e.CommandArgument);
            string entityId = grdMatches.DataKeys[rowIndex].Values[0].ToString();
            string entityType = grdMatches.DataKeys[rowIndex].Values[1].ToString();

            if (entityId != null)
            {
                MergeRecord(entityId, entityType);
                hdfSourceID.Value = entityId;
                hdfSourceType.Value = entityType;
            }
        }
    }

    /// <summary>
    /// Handles the OnRowCommand event of the grdAccountMatches control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewCommandEventArgs"/> instance containing the event data.</param>
    protected void grdAccountMatches_OnRowCommand(object sender, GridViewCommandEventArgs e)
    {
        if (e.CommandName.Equals("Add Contact"))
        {
            int rowIndex = Convert.ToInt32(e.CommandArgument);
            string accountId = grdAccountMatches.DataKeys[rowIndex].Values[0].ToString();

            if (accountId != null)
            {
                hdfSourceID.Value = accountId;
                if (DuplicateProvider.EntitySource.EntityData != null)
                {
                    ILead sourceLead = DuplicateProvider.EntitySource.EntityData as ILead;
                    ConvertLeadToContact(sourceLead, accountId, chkCreateOpportunity.Checked, ddlAccountConflicts.SelectedValue);
                }
            }
        }
    }

    /// <summary>
    /// Handles the RowDataBound event of the mergeGrid control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewRowEventArgs"/> instance containing the event data.</param>
    protected void grdMerge_RowDataBound(object sender, GridViewRowEventArgs e)
    {
        if (e.Row.RowType == DataControlRowType.Header)
        {
            LeadMergeProvider mp = Page.Session["mergeProvider"] as LeadMergeProvider;
            if (mp != null)
            {
                System.Web.UI.WebControls.Label lblSource = ((System.Web.UI.WebControls.Label)e.Row.FindControl("lblSourceRecord"));
                System.Web.UI.WebControls.Label lblTarget = ((System.Web.UI.WebControls.Label)e.Row.FindControl("lblTargetRecord"));
                if (lblSource != null)
                    lblSource.Text = string.Format("Source {0} record is primary.", GetEntityName(mp.Source.EntityType));
                if (lblTarget != null)
                    lblTarget.Text = string.Format("Target {0} record is primary.", GetEntityName(mp.Target.EntityType));
            }
        }
    }

    /// <summary>
    /// Gets the name of the entity.
    /// </summary>
    /// <param name="entityType">Type of the entity.</param>
    /// <returns></returns>
    protected string GetEntityName(Type entityType)
    {
        string name = entityType.Name;
        if (entityType.Equals(typeof(ILead)))
            return "Lead";
        if (entityType.Equals(typeof(IContact)))
            return "Contact";
        return entityType.Name;
    }

    /// <summary>
    /// Creates the radio button.
    /// </summary>
    /// <param name="data">The data.</param>
    /// <param name="context">The context.</param>
    /// <returns></returns>
    protected string CreatePropertyRadioButton(object data, string context)
    {
        string radioButton = String.Empty;
        if (data != null)
        {
            MergeRecordView rv = data as MergeRecordView;
            if (context.Equals("Source"))
            {
                string strChecked = string.Empty;
                if (rv.PropertyOverwrite == MergeOverwrite.sourceWins)
                    strChecked = "checked";
                radioButton = string.Format("<input type='radio' class='rdoSourceWins' id='rdoSourceWins_{0}' name='rdoMergeOverwrite_{0}' value='SourceWins' {1} />", rv.PropertyMapId, strChecked);
            }
            if (context.Equals("Target"))
            {
                string strChecked = string.Empty;
                if (rv.PropertyOverwrite == MergeOverwrite.targetWins)
                    strChecked = "checked";
                radioButton = string.Format("<input type='radio' class='rdoTargetWins' id='rdoTargetWins_{0}' name='rdoMergeOverwrite_{0}' value='TargetWins' {1} />", rv.PropertyMapId, strChecked);
            }
        }
        return radioButton;
    }

    /// <summary>
    /// Creates the record radio button.
    /// </summary>
    /// <param name="context">The context.</param>
    /// <returns></returns>
    protected string CreateRecordRadioButton(string context)
    {
        string radioButton = String.Empty;
        LeadMergeProvider mp = Page.Session["mergeProvider"] as LeadMergeProvider;
        if (mp != null)
        {
            if (context.Equals("Source"))
            {
                string strChecked = string.Empty;
                if (mp.RecordOverwrite == MergeOverwrite.sourceWins)
                    strChecked = "checked";
                radioButton = string.Format("<input type='radio' onclick='onSourceWins()' id='rdoSourceRecordWins' name='rdoRecordOverwrite' value='SourceWins' {0} />", strChecked);
            }
            if (context.Equals("Target"))
            {
                string strChecked = string.Empty;
                if (mp.RecordOverwrite == MergeOverwrite.targetWins)
                    strChecked = "checked";
                radioButton = string.Format("<input type='radio' onclick='onTargetWins()' id='rdoTargetRecordWins' name='rdoRecordOverwrite' value='TargetWins' {0} />", strChecked);
            }
        }
        return radioButton;
    }

    /// <summary>
    /// Called when [closing].
    /// </summary>
    protected override void OnClosing()
    {
        DialogService.DialogParameters.Remove("duplicateProvider");
        DialogService.DialogParameters.Remove("matchAdvancedOptions");
        base.OnClosing();
        if (_redirectURL != string.Empty)
        {
            Response.Redirect(_redirectURL, false);
        }
    }

    /// <summary>
    /// Handles the Click event of the btnMerge control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void btnMerge_Click(object sender, EventArgs e)
    {
        MergeRecords();
        SetDivVisable(pnlSearchForDuplicates.ID);
    }

    /// <summary>
    /// Sets the options.
    /// </summary>
    /// <param name="sender">The sender.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void SetOptions(object sender, EventArgs e)
    {
        if (!DialogService.DialogParameters.ContainsKey("matchAdvancedOptions") && Visible)
        {
            DialogService.DialogParameters.Add("matchAdvancedOptions", DuplicateProvider.AdvancedOptions);
        }
    }

    /// <summary>
    /// Handles the Click event of the btnCancel control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void btnCancel_Click(object sender, EventArgs e)
    {
        SetDivVisable(pnlSearchForDuplicates.ID);
    }

    /// <summary>
    /// Converts the lead to new account and contact.
    /// </summary>
    /// <param name="lead">The lead.</param>
    /// <param name="createOpportunity">if set to <c>true</c> [create opportunity].</param>
    /// <param name="options">The options.</param>
    private void ConvertLeadToNewAccountAndContact(ILead lead, bool createOpportunity, string options)
    {
        IOpportunity opportunity = null;
        IContact contact = EntityFactory.Create<IContact>();
        IAccount account = EntityFactory.Create<IAccount>();
        string leadHistoryId = string.Empty;
        ILeadHistory leadHistory = null; EntityFactory.Create<ILeadHistory>();
        leadHistoryId = lead.SaveLeadHistory();

        lead.ConvertLeadToContact(contact, account, options);
        lead.ConvertLeadToAccount(account);
        lead.ConvertLeadAddressToAccountAddress(account);
        lead.ConvertLeadAddressToContactAddress(contact);
        account.Save();
        contact.SaveContactAccount(account);

        if (createOpportunity)
        {
            opportunity = EntityFactory.Create<IOpportunity>();
            opportunity.Account = contact.Account;
            opportunity.Description = string.Format(GetLocalResourceObject("Opportunity_Description").ToString(), lead.LeadNameLastFirst);
            opportunity.Owner = contact.Account.Owner;
            opportunity.Save();
        }

        AddAttachmentsToLead(lead, account, contact, opportunity);
        lead.AddHistoryAndQualificationRecords(contact, account, opportunity, false);
        lead.AddActivities(contact, account, opportunity);

        IList<ICampaignTarget> campaignTargets = EntityFactory.GetRepository<ICampaignTarget>().FindByProperty("EntityId", lead.Id.ToString());
        foreach (ICampaignTarget campaignTarget in campaignTargets)
            lead.ChangeCampaignTargetEntityID(contact, campaignTarget);

        leadHistory = EntityFactory.GetById<ILeadHistory>(leadHistoryId);
        if (leadHistory != null)
        {
            leadHistory.ContactId = contact.Id.ToString();
            leadHistory.AccountId = account.Id.ToString();
            leadHistory.Save();
        }
        lead.Delete();
        EntityContext.RemoveEntityHistory(typeof(ILead), lead.Id);

        if (opportunity != null)
        {
            Response.Redirect(string.Format("Opportunity.aspx?entityid={0}", opportunity.Id),false);
        }
        else
        {
            Response.Redirect(string.Format("Contact.aspx?entityId={0}", contact.Id), false);
        }
    }

    /// <summary>
    /// Converts the lead to contact.
    /// </summary>
    /// <param name="sourceLead">The source lead.</param>
    /// <param name="accountID">The account ID.</param>
    private void ConvertLeadToContact(ILead sourceLead, string accountID, bool createOpportinity, string mergeRule)
    {
        if (accountID != null)
        {
            IAccount account = EntityFactory.GetById<IAccount>(accountID);
            if (account != null)
            {
                IContact contact = EntityFactory.Create<IContact>();
                IOpportunity opportunity = null;

                ILeadHistory leadHistory = null;
                string leadHistoryId = string.Empty;

                leadHistoryId = sourceLead.SaveLeadHistory();

                sourceLead.ConvertLeadToContact(contact, account, "Add Contact to this Account");
                sourceLead.ConvertLeadAddressToContactAddress(contact);
                sourceLead.ConvertLeadAddressToAccountAddress(account);
                sourceLead.MergeLeadWithAccount(account, mergeRule, contact);
                account.Save();
                contact.Save();

                if (createOpportinity)
                {
                    opportunity = EntityFactory.Create<IOpportunity>();
                    opportunity.Account = contact.Account;
                    opportunity.Description = string.Format("Opportunity for {0}", sourceLead.LeadNameLastFirst);
                    opportunity.Owner = contact.Account.Owner;
                    opportunity.Save();
                }

                IList<IAttachment> attachment = EntityFactory.GetRepository<IAttachment>().FindByProperty("LeadId", sourceLead.Id.ToString());
                foreach (IAttachment attach in attachment)
                    sourceLead.AddAttachmentsContactID(contact, account, null, attach);

                sourceLead.AddHistoryAndQualificationRecords(contact, account, opportunity, false);
                sourceLead.AddActivities(contact, account, opportunity);

                IList<ICampaignTarget> campaignTarget = EntityFactory.GetRepository<ICampaignTarget>().FindByProperty("EntityId", sourceLead.Id.ToString());
                foreach (ICampaignTarget ct in campaignTarget)
                    sourceLead.ChangeCampaignTargetEntityID(contact, ct);

                leadHistory = EntityFactory.GetById<ILeadHistory>(leadHistoryId);
                if (leadHistory != null)
                {
                    leadHistory.ContactId = contact.Id.ToString();
                    leadHistory.AccountId = account.Id.ToString();
                    leadHistory.Save();
                }
                sourceLead.Delete();
                EntityContext.RemoveEntityHistory(typeof(ILead), sourceLead.Id);

                if (opportunity != null)
                {
                    Response.Redirect(string.Format("Opportunity.aspx?entityid={0}", opportunity.Id), false);
                }
                else
                {
                    Response.Redirect(string.Format("Contact.aspx?entityId={0}", contact.Id),false);
                }
            }
        }
    }

    /// <summary>
    /// Adds the attachments to lead.
    /// </summary>
    /// <param name="sourceLead">The source lead.</param>
    /// <param name="account">The account.</param>
    /// <param name="contact">The contact.</param>
    private void AddAttachmentsToLead(ILead sourceLead, IAccount account, IContact contact, IOpportunity opportunity)
    {
        IList<IAttachment> attachments = EntityFactory.GetRepository<IAttachment>().FindByProperty("LeadId", sourceLead.Id.ToString());
        foreach (IAttachment attachment in attachments)
            sourceLead.AddAttachmentsContactID(contact, account, opportunity, attachment);
    }

    /// <summary>
    /// Merges the records.
    /// </summary>
    private void MergeRecords()
    {
        try
        {
            LeadMergeProvider mergeProvider = Page.Session["mergeProvider"] as LeadMergeProvider;
            ILead sourceLead = null;
            ILead targetLead = null;
            IOpportunity opportunity = null;
            IContact targetContact = null;
            if (mergeProvider != null)
            {
                foreach (MergePropertyMap map in mergeProvider.MergeMaps)
                {
                    string overWrite = Request.Form["rdoMergeOverwrite_" + map.Name];
                    if (overWrite != null)
                    {
                        if (overWrite.Equals("SourceWins"))
                            map.MergeOverwrite = MergeOverwrite.sourceWins;
                        else
                            map.MergeOverwrite = MergeOverwrite.targetWins;
                    }
                }

                string recordOverWrite = Request.Form["rdoRecordOverwrite"];
                string recordMergeRule = string.Empty;
                if (recordOverWrite != null)
                {
                    if (recordOverWrite.Equals("SourceWins"))
                    {
                        mergeProvider.RecordOverwrite = MergeOverwrite.sourceWins;
                        recordMergeRule = "SOURCEWINS";
                    }
                    else
                    {
                        mergeProvider.RecordOverwrite = MergeOverwrite.targetWins;
                        recordMergeRule = "TARGETWINS";
                    }
                }

                sourceLead = mergeProvider.Source.EntityData as ILead;
                if (sourceLead.Id != null)
                {
                    object sourceLeadId = ((ILead)mergeProvider.Source.EntityData).Id;
                    sourceLead = EntityFactory.GetById<ILead>(sourceLeadId);
                    mergeProvider.Source.EntityData = sourceLead;
                }
                if (mergeProvider.Target.EntityType == typeof(ILead))
                {
                    object targetLeadId = ((ILead)mergeProvider.Target.EntityData).Id;
                    targetLead = EntityFactory.GetById<ILead>(targetLeadId);
                    mergeProvider.Target.EntityData = targetLead;
                    mergeProvider.merge();
                    sourceLead.ManualMergeLeadwithLead(targetLead, recordMergeRule);
                    targetLead.Save();
                }
                if (mergeProvider.Target.EntityType == typeof(IContact))
                {
                    targetContact = mergeProvider.Target.EntityData as IContact;
                    object targetContactId = ((IContact)mergeProvider.Target.EntityData).Id;
                    targetContact = EntityFactory.GetById<IContact>(targetContactId);
                    mergeProvider.Target.EntityData = targetContact;
                    mergeProvider.merge();

                    sourceLead.ManualMergeLeadWithContact(targetContact, recordMergeRule);
                    targetContact.AccountName = targetContact.Account.AccountName;
                    targetContact.Save();
                    targetContact.Account.Save();
                    if (sourceLead.Id != null)
                    {
                        ILeadHistory leadHistory = null;
                        string leadHistoryId = sourceLead.SaveLeadHistory();
                        leadHistory = EntityFactory.GetById<ILeadHistory>(leadHistoryId);
                        if (leadHistory != null)
                        {
                            leadHistory.ContactId = targetContact.Id.ToString();
                            leadHistory.ContactMerged = true;
                            leadHistory.AccountId = targetContact.Account.Id.ToString();
                            leadHistory.AccountMerged = true;
                            leadHistory.Save();
                        }
                    }

                    if (chkCreateOpportunity.Checked)
                    {
                        opportunity = EntityFactory.Create<IOpportunity>();
                        opportunity.Account = targetContact.Account;
                        opportunity.Description = string.Format("Opportunity for {0}", targetContact.FullName);
                        opportunity.Owner = targetContact.Account.Owner;
                        opportunity.Save();
                    }

                    if (sourceLead.Id != null)
                    {
                        IList<IAttachment> attachment = EntityFactory.GetRepository<IAttachment>().FindByProperty("LeadId", sourceLead.Id.ToString());
                        foreach (IAttachment attach in attachment)
                            sourceLead.AddAttachmentsContactID(targetContact, targetContact.Account, opportunity, attach);

                        sourceLead.AddHistoryAndQualificationRecords(targetContact, targetContact.Account, opportunity, true);
                        sourceLead.AddActivities(targetContact, targetContact.Account, opportunity);

                        IList<ICampaignTarget> campaignTarget = EntityFactory.GetRepository<ICampaignTarget>().FindByProperty("EntityId", sourceLead.Id.ToString());
                        foreach (ICampaignTarget ct in campaignTarget)
                            sourceLead.ChangeCampaignTargetEntityID(targetContact, ct);
                    }
                }
                if (sourceLead.Id != null)
                {
                    sourceLead.Delete();
                    EntityContext.RemoveEntityHistory(typeof(ILead), sourceLead.Id);
                }

                Page.Session["mergeProvider"] = null;

                try
                {

                    if (targetLead != null)
                    {
                        SetResolveData(targetLead.Id.ToString(), "ILead", string.Format(GetLocalResourceObject("Resolved.MergedWithLead").ToString(), targetLead.LeadNameLastFirst));
                        Response.Redirect(string.Format("Lead.aspx?entityId={0}", targetLead.Id));
                    }

                    if (targetContact != null)
                    {
                        SetResolveData(targetContact.Id.ToString(), "IContact", string.Format(GetLocalResourceObject("Resolved.MergedWithContact").ToString(), targetContact.NameLF));
                        if (opportunity != null)
                        {
                              //Response.Redirect(string.Format("Opportunity.aspx?entityid={0}", opportunity.Id));
                              _redirectURL =  string.Format("Opportunity.aspx?entityid={0}", opportunity.Id);
                        }
                        else
                        {
                            //Response.Redirect(string.Format("Contact.aspx?entityId={0}", targetContact.Id));
                            _redirectURL =  string.Format("Contact.aspx?entityId={0}", targetContact.Id);
                        }
                    }

                    DialogService.CloseEventHappened(this, null);
                    PanelRefresh.RefreshAll();
                }
                catch(Exception)
                {
                   
                }
            }
        }
        catch (Exception exp)
        {
            if (exp != null)
            {
                throw new ValidationException(String.Format(GetLocalResourceObject("Error_MergingRecords").ToString(), exp.InnerException));
            }           
        }
    }

    /// <summary>
    /// Goes to.
    /// </summary>
    /// <param name="entityType">Type of the entity.</param>
    /// <param name="entityId">The entity id.</param>
    private void GoToEntity(Type entityType, string entityId)
    {
        string pageName = string.Empty;
        if (entityType == typeof(ILead))
            pageName = "Lead";
        if (entityType == typeof(IContact))
            pageName = "Contact";
        Response.Redirect(string.Format("~/{0}.aspx?entityId={1}", pageName, entityId),false);
    }

    /// <summary>
    /// Sets the resolve data.
    /// </summary>
    /// <param name="entityId">The entity id.</param>
    /// <param name="entityType">Type of the entity.</param>
    /// <param name="resolveDescription">The resolve description.</param>
    private void SetResolveData(string entityId, string entityType, string resolveDescription)
    {
        string itemId;
        try
        {
            if (DialogService.DialogParameters.Count > 0 && (DialogService.DialogParameters.ContainsKey("importHistoryItemId")))
            {
                itemId = System.Convert.ToString(DialogService.DialogParameters["importHistoryItemId"]);
                IImportHistoryItem item = Sage.Platform.EntityFactory.GetById<IImportHistoryItem>(itemId);
                item.IsResolved = true;
                item.ResolvedDate = DateTime.UtcNow;
                item.ResolveEntityType = entityType;
                item.ResolveReferenceId = entityId;
                item.ResolveDescription = resolveDescription;
                item.Save();
            }
        }
        catch (Exception)
        {
            //throw new ApplicationException(string.Format());
        }
    }

}
