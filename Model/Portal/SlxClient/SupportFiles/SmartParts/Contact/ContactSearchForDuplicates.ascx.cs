using System;
using System.Collections;
using System.Reflection;
using System.Web.UI;
using System.Collections.Generic;
using Sage.Entity.Interfaces;
using Sage.Platform;
using Sage.Platform.Application;
using Sage.Platform.Application.UI;
using Sage.Platform.Repository;
using Sage.Platform.WebPortal.Binding;
using Sage.Platform.WebPortal.SmartParts;
using Sage.SalesLogix.Services.PotentialMatch;
using Sage.Platform.NamedQueries;
using System.Web.UI.WebControls;
using System.Web.UI.MobileControls;
using System.Data;
using Sage.Platform.Application.UI.Web;
using System.Text;

public partial class ContactSearchForDuplicates : EntityBoundSmartPartInfoProvider
{
    private ContactDuplicateProvider _duplicateProvider;

    #region Public Methods

    /// <summary>
    /// Gets the type of the entity.
    /// </summary>
    /// <value>The type of the entity.</value>
    public override Type EntityType
    {
        get { return typeof(IImportHistory); }
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

        foreach (Control c in ContactMatching_RTools.Controls)
        {
            tinfo.RightTools.Add(c);
        }

        tinfo.Title = GetLocalResourceObject("DialogTitle").ToString();
        
        return tinfo;
    }

    /// <summary>
    /// Gets the duplicate provider.
    /// </summary>
    /// <value>The duplicate provider.</value>
    public IMatchDuplicateProvider DuplicateProvider
    {
        get
        {
            try
            {
                if (_duplicateProvider == null)
                {
                    IContact contact = null;
                    if (DialogService.DialogParameters.Count > 0 && (DialogService.DialogParameters.ContainsKey("Contact")))
                    {
                        contact = DialogService.DialogParameters["Contact"] as IContact;
                        IAccount account = DialogService.DialogParameters["Account"] as IAccount;
                        contact.Account = account;
                        contact.AccountName = account.AccountName;
                    }
                    if (contact == null)
                        contact = EntityFactory.Create<IContact>();
                    _duplicateProvider = new ContactDuplicateProvider();
                    _duplicateProvider.EntitySource = new MatchEntitySource(typeof(IContact), contact);
                }
            }
            catch(Exception exp)
            {
                throw new ApplicationException(string.Format(GetLocalResourceObject("LoadErrorMSG").ToString(), exp.Message));
            }
            return _duplicateProvider;
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
                LoadSourceSnapshot(DuplicateProvider.EntitySource);
            }
            catch (Exception)
            {
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
            SetActiveFilters();
            if (UpdateIndex.Value == "True")
            {
                DuplicateProvider.RefreshIndexes(false);
                UpdateIndex.Value = "False";
            }
            DuplicateProvider.FindMatches();
            MatchResults matchResults = DuplicateProvider.GetMatchResults();
            if (matchResults != null)
            {
                DataTable dataTable = GetPotentialMatchesLayout();
                DataTable accountDataTable = GetAccountLayout();

                ILead lead = null;
                IContact contact = null;
                IAccount account = null;
                string leadType = GetLocalResourceObject("lblLeads.Caption").ToString();
                string contactType = GetLocalResourceObject("lblContacts.Caption").ToString();

                matchResults.HydrateResults();
                foreach (MatchResultItem resultItem in matchResults.Items)
                {
                    if (typeof(ILead).Equals(resultItem.EntityType))
                    {
                        try
                        {
                            lead = resultItem.Data as ILead;
                            dataTable.Rows.Add(lead.Id.ToString(), "Lead", resultItem.Score, leadType, lead.Company, lead.FirstName,
                                lead.LastName, lead.Title, lead.Email, lead.Address.LeadCtyStZip, lead.WorkPhone);
                        }
                        catch
                        {
                        }
                    }
                    else if (typeof(IContact).Equals(resultItem.EntityType))
                    {
                        try
                        {
                            contact = resultItem.Data as IContact;
                            dataTable.Rows.Add(contact.Id.ToString(), "Contact", resultItem.Score, contactType, contact.Account.AccountName,
                                contact.FirstName, contact.LastName, contact.Title, contact.Email, contact.Address.CityStateZip,
                                contact.WorkPhone);
                        }
                        catch
                        {
                        }
                    }
                    else if (typeof(IAccount).Equals(resultItem.EntityType))
                    {
                        try
                        {
                            account = resultItem.Data as IAccount;
                            accountDataTable.Rows.Add(account.Id.ToString(), resultItem.Score, account.AccountName,
                                account.MainPhone, account.WebAddress, account.Industry, account.Address.CityStateZip,
                                account.Type);
                        }
                        catch
                        {
                        }
                    }
                }
                grdMatches.DataSource = dataTable;
                grdAccountMatches.DataSource = accountDataTable;
            }
            grdMatches.DataBind();
            grdAccountMatches.DataBind();
        }
        else 
        {
            grdMatches.DataBind();
            grdAccountMatches.DataBind();        
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
        dataColumn.DataType = typeof (string);
        dataColumn.AllowDBNull = true;

        dataColumn = dataTable.Columns.Add();
        dataColumn.ColumnName = "EntityType";
        dataColumn.DataType = typeof (string);
        dataColumn.AllowDBNull = true;

        dataColumn = dataTable.Columns.Add();
        dataColumn.ColumnName = "Score";
        dataColumn.DataType = typeof (string);
        dataColumn.AllowDBNull = true;

        dataColumn = dataTable.Columns.Add();
        dataColumn.ColumnName = "EntityName";
        dataColumn.DataType = typeof (string);
        dataColumn.AllowDBNull = true;

        dataColumn = dataTable.Columns.Add();
        dataColumn.ColumnName = "Company";
        dataColumn.DataType = typeof (string);
        dataColumn.AllowDBNull = true;

        dataColumn = dataTable.Columns.Add();
        dataColumn.ColumnName = "FirstName";
        dataColumn.DataType = typeof (string);
        dataColumn.AllowDBNull = true;

        dataColumn = dataTable.Columns.Add();
        dataColumn.ColumnName = "LastName";
        dataColumn.DataType = typeof (string);
        dataColumn.AllowDBNull = true;

        dataColumn = dataTable.Columns.Add();
        dataColumn.ColumnName = "Title";
        dataColumn.DataType = typeof (string);
        dataColumn.AllowDBNull = true;

        dataColumn = dataTable.Columns.Add();
        dataColumn.ColumnName = "Email";
        dataColumn.DataType = typeof (string);
        dataColumn.AllowDBNull = true;

        dataColumn = dataTable.Columns.Add();
        dataColumn.ColumnName = "CityStateZip";
        dataColumn.DataType = typeof (string);
        dataColumn.AllowDBNull = true;

        dataColumn = dataTable.Columns.Add();
        dataColumn.ColumnName = "WorkPhone";
        dataColumn.DataType = typeof (string);
        dataColumn.AllowDBNull = true;

        return dataTable;
    }

    /// <summary>
    /// Gets the data table.
    /// </summary>
    /// <returns></returns>
    private DataTable GetAccountLayout()
    {
        DataTable dataTable = new DataTable("PotentialAccounts");
        DataColumn dataColumn;

        dataColumn = dataTable.Columns.Add();
        dataColumn.ColumnName = "Id";
        dataColumn.DataType = typeof (string);
        dataColumn.AllowDBNull = true;

        dataColumn = dataTable.Columns.Add();
        dataColumn.ColumnName = "Score";
        dataColumn.DataType = typeof (string);
        dataColumn.AllowDBNull = true;

        dataColumn = dataTable.Columns.Add();
        dataColumn.ColumnName = "Account";
        dataColumn.DataType = typeof (string);
        dataColumn.AllowDBNull = true;

        dataColumn = dataTable.Columns.Add();
        dataColumn.ColumnName = "MainPhone";
        dataColumn.DataType = typeof (string);
        dataColumn.AllowDBNull = true;

        dataColumn = dataTable.Columns.Add();
        dataColumn.ColumnName = "WebAddress";
        dataColumn.DataType = typeof (string);
        dataColumn.AllowDBNull = true;

        dataColumn = dataTable.Columns.Add();
        dataColumn.ColumnName = "Industry";
        dataColumn.DataType = typeof (string);
        dataColumn.AllowDBNull = true;

        dataColumn = dataTable.Columns.Add();
        dataColumn.ColumnName = "CityStateZip";
        dataColumn.DataType = typeof (string);
        dataColumn.AllowDBNull = true;

        dataColumn = dataTable.Columns.Add();
        dataColumn.ColumnName = "Type";
        dataColumn.DataType = typeof (string);
        dataColumn.AllowDBNull = true;

        return dataTable;
    }

    /// <summary>
    /// Sets the active filters.
    /// </summary>
    private void SetActiveFilters()
    {
        foreach (ListItem item in chklstFilters.Items)
        {
            if (item.Selected)
                DuplicateProvider.SetActiveFilter(item.Value, item.Enabled);
        }
        
        ContactDuplicateProvider contactDupProvider = (ContactDuplicateProvider)DuplicateProvider;

        if (rdgOptions.SelectedIndex == 0)
            contactDupProvider.MatchOperator = MatchOperator.And;
        else
            contactDupProvider.MatchOperator = MatchOperator.Or;

        contactDupProvider.SearchAccount = (chkAccounts.Checked);
        contactDupProvider.SearchContact = (chkContacts.Checked);
        contactDupProvider.SearchLead = (chkLeads.Checked);
        contactDupProvider.AdvancedOptions = MatchOptions.GetAdvancedOptions();
    }

    /// <summary>
    /// Registers the client script.
    /// </summary>
    private void RegisterClientScript()
    {
        StringBuilder sb = new StringBuilder(GetLocalResourceObject("ContactSearchForDuplicates_ClientScript").ToString());
        sb.Replace("@csd_divFiltersId", divFilters.ClientID);
        sb.Replace("@csd_tabFiltersId", tabFilters.ClientID);
        sb.Replace("@csd_divOptionsId", divOptions.ClientID);
        sb.Replace("@csd_tabOptionsId", tabOptions.ClientID);
        sb.Replace("@csd_txtSelectedTabId", txtSelectedTab.ClientID);

        ScriptManager.RegisterClientScriptBlock(Page, GetType(), "ContactSearchForDuplicates", sb.ToString(), false);
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
    /// Loads the source snapshot.
    /// </summary>
    /// <param name="source">The source.</param>
    private void LoadSourceSnapshot(MatchEntitySource source)
    {
        if (source.EntityData != null && source.EntityType == typeof(IContact))
        {
            IContact contact = source.EntityData as IContact;
            if (!String.IsNullOrEmpty(contact.LastName))
            {
                lblContact.Text = String.Format("{0}, {1}", contact.LastName, contact.FirstName);
            }
            else
            {
                lblContact.Text = contact.FirstName;
            }
            lblValueAccount.Text = contact.Account.AccountName;
            if (contact.Address != null)
                lblAddress.Text = contact.Address.FormatFullAddress();
            lblValueEmail.Text = contact.Email;
            lblValueTitle.Text = contact.Title;
            phnWorkPhone.Text = contact.WorkPhone;
            lblValueWeb.Text = contact.WebAddress;
        }
    }

    #endregion

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
                {
                    entitySmartPart.InitEntityBoundSmartPart(PageWorkItem.Services.Get<IEntityContextService>());
                }
            }

            tabFilters.Attributes.Add("onclick", "javascript:OnTabFiltersClick()");
            tabOptions.Attributes.Add("onclick", "javascript:OnTabOptionsClick()");

            AddNamedQueries();
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
    /// Override this method to add bindings to the currrently bound smart part
    /// </summary>
    protected override void OnAddEntityBindings()
    {
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
            }
        }
        catch (Exception exp)
        {
            throw new ApplicationException(string.Format(GetLocalResourceObject("LoadErrorMSG").ToString(), exp.Message));
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
    /// Handles the Click event of the cmdSearchOptions control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void cmdSearchOptions_Click(object sender, EventArgs e)
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
    /// Handles the OnRowCommand event of the grdDuplicates control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewCommandEventArgs"/> instance containing the event data.</param>
    protected void grdMatches_OnRowCommand(object sender, GridViewCommandEventArgs e)
    {
        if (e.CommandName.Equals("Open"))
        {
            int rowIndex = Convert.ToInt32(e.CommandArgument);
            string Id = grdMatches.DataKeys[rowIndex].Values[0].ToString();
            string entityName = grdMatches.DataKeys[rowIndex].Values[1].ToString();
            Response.Redirect(string.Format("{0}.aspx?entityId={1}", entityName, Id));
            DialogService.CloseEventHappened(sender, e);
        }
    }

    /// <summary>
    /// Handles the OnRowCommand event of the grdAccounts control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewCommandEventArgs"/> instance containing the event data.</param>
    protected void grdAccountMatches_OnRowCommand(object sender, GridViewCommandEventArgs e)
    {
        if (e.CommandName.Equals("UseAccount"))
        {
            int rowIndex = Convert.ToInt32(e.CommandArgument);
            string Id = grdAccountMatches.DataKeys[rowIndex].Value.ToString();
                   
            if (!DialogService.DialogParameters.ContainsKey("JumpID"))
            {
                DialogService.DialogParameters.Add("JumpID", Id);
            }
            else
            {
                DialogService.DialogParameters["JumpID"] = Id;
            }
            DialogService.CloseEventHappened(sender, e);
                    
        }
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
    /// Called when [closing].
    /// </summary>
    protected override void OnClosing()
    {
        DialogService.DialogParameters.Remove("duplicateProvider");
        DialogService.DialogParameters.Remove("matchAdvancedOptions");
        base.OnClosing();
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

    protected string CreateViewButton(object entityId, object entityType)
    {
        string button;
        button = string.Format("<a id='lnkViewSummaryID_{0}' onClick='showSummaryView(this,\"{1}\",\"{2}\")' style='cursor:hand' />{3}</a> ", entityId, entityType, entityId, GetLocalResourceObject("grdMatches.Open.ColumnHeading").ToString());
        return button;      
    }


    private void AddNamedQueries()
    {

        INamedQueryCacheService service = ApplicationContext.Current.Services.Get<INamedQueryCacheService>(false);
        if (service == null)
        {
            INamedQueryLookupService lsvc = ApplicationContext.Current.Services.Get<INamedQueryLookupService>(false);
            if (lsvc != null)
            {
                service = lsvc as INamedQueryCacheService;
            }
        }

        if (service != null)
        {

            if (!service.Contains("ContactSearch"))
            {
                service.Add(GetContactNamedQueryinfo());
            }
            if (!service.Contains("LeadSearch"))
            {
                service.Add(GetLeadNamedQueryinfo());
            }
            if (!service.Contains("AccountSearch"))
            {
                service.Add(GetAccountNamedQueryinfo());
            }
        }
    }


    private NamedQueryInfo GetContactNamedQueryinfo()
    {
      
        NamedQueryInfo info = new NamedQueryInfo();
        info.Name = "ContactSearch";
        //info.Id = new Guid("1");
        string[] AliasCols = new string[] {"id", "name", "address_address1","address_citystatezip","homephone","email", "account_id","accountname", "title", "type", "accountmanager_userinfo_firstname", "workphone", "mobilePhone", "webaddress" };
        //string hql = "select  mainentity.id,  mainentity.Name,  mainentity.Address.Address1,  mainentity.Address.CityStateZip,  mainentity.HomePhone,  mainentity.Email,  mainentity.Account.id,  mainentity.AccountName,  mainentity.Title,  mainentity.Type,  mainentity.AccountManager.UserInfo.FirstName, mainentity.WorkPhone from Contact  mainentity  left join  mainentity.Address  left join  mainentity.Account  left join  mainentity.AccountManager  group by  mainentity.id,  mainentity.Name,  mainentity.Address.Address1,  mainentity.Address.CityStateZip,  mainentity.HomePhone,  mainentity.Email,  mainentity.Account.id,  mainentity.AccountName,  mainentity.Title,  mainentity.Type,  mainentity.AccountManager.UserInfo.FirstName, mainentity.WorkPhone ";
        string hql = "select  mainentity.id,  mainentity.Name,  mainentity.Address.Address1,  mainentity.Address.CityStateZip,  mainentity.HomePhone,  mainentity.Email,  mainentity.Account.id,  mainentity.AccountName,  mainentity.Title,  mainentity.Type,  mainentity.AccountManager.UserInfo.FirstName, mainentity.WorkPhone, mainentity.Mobile, mainentity.WebAddress  from Contact  mainentity  left join  mainentity.Address  left join  mainentity.Account  left join  mainentity.AccountManager";
        info.Hql = hql;
        info.ColumnAliases = AliasCols;
        return info;    
    
    }
    private NamedQueryInfo GetLeadNamedQueryinfo()
    {
        NamedQueryInfo info = new NamedQueryInfo();
        info.Name = "LeadSearch";
        //info.Id = new Guid("1");
        string[] AliasCols = new string[] { "id", "name", "address_address1", "address_citystatezip", "homephone", "email", "company", "title", "type", "accountmanager_userinfo_firstname","accountmanager_userinfo_lastname", "workphone", "mobilePhone", "webaddress" };
        string hql = "select  mainentity.id,  mainentity.LeadNameFirstLast,  mainentity.Address.Address1,  mainentity.Address.LeadCtyStZip,  mainentity.HomePhone,  mainentity.Email,  mainentity.Company,  mainentity.Title,  mainentity.Type,  mainentity.AccountManager.UserInfo.FirstName, mainentity.AccountManager.UserInfo.LastName, mainentity.WorkPhone, mainentity.Mobile, mainentity.WebAddress  from Lead  mainentity left join  mainentity.Address  left join  mainentity.AccountManager";
        info.Hql = hql;
        info.ColumnAliases = AliasCols;
        return info;

    }

    private NamedQueryInfo GetAccountNamedQueryinfo()
    {
        
        NamedQueryInfo info = new NamedQueryInfo();
        info.Name = "AccountSearch";
        //info.Id = new Guid("1");
        string[] AliasCols = new string[] { "id", "name", "address_address1", "address_citystatezip", "mainphone", "email", "division", "type", "accountmanager_userinfo_firstname", "accountmanager_userinfo_lastname", "tollfree", "industry", "webaddress", "status", "subType" };
        string hql = "select  mainentity.id,  mainentity.AccountName,  mainentity.Address.Address1,  mainentity.Address.CityStateZip,  mainentity.MainPhone,  mainentity.Email,  mainentity.Division,  mainentity.Type,  mainentity.AccountManager.UserInfo.FirstName, mainentity.AccountManager.UserInfo.LastName, mainentity.TollFree, mainentity.Industry, mainentity.WebAddress, mainentity.Status, mainentity.SubType from Account mainentity left join  mainentity.Address  left join  mainentity.AccountManager";
        info.Hql = hql;
        info.ColumnAliases = AliasCols;
        return info;

    }

}
