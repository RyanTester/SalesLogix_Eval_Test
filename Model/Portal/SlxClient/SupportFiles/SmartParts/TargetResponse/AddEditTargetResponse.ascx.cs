using System;
using System.Web.UI;
using System.Web.UI.WebControls;
using Sage.Platform.Application;
using Sage.Platform.WebPortal.SmartParts;
using Sage.Entity.Interfaces;
using Sage.Platform.WebPortal.Binding;
using System.Reflection;
using Sage.Platform.WebPortal.Services;
using Sage.Platform.Application.UI;
using Sage.Platform;
using System.Text;
using Sage.Platform.Orm.Interfaces;
using Sage.Platform.Repository;
using System.Collections.Generic;

/// <summary>
/// Summary description for AddEditTargetResponse
/// </summary>
public partial class AddEditTargetResponse : EntityBoundSmartPartInfoProvider
{
    private WebEntityListBindingSource _dtsProducts;
    private WebEntityListBindingSource _dtsOpens;
    private WebEntityListBindingSource _dtsClicks;
    private WebEntityListBindingSource _dtsUndeliverables;
    private int _grdProductsdeleteColumnIndex = -2;

    #region Public Methods

    /// <summary>
    /// Gets the type of the entity.
    /// </summary>
    /// <value>The type of the entity.</value>
    public override Type EntityType
    {
        get { return typeof(ITargetResponse); }
    }

    /// <summary>
    /// DataSource for the Products records.
    /// </summary>
    /// <value>The DTS products.</value>
    public WebEntityListBindingSource dtsProducts
    {
        get
        {
            if (_dtsProducts == null)
                _dtsProducts = new WebEntityListBindingSource(typeof(IResponseProduct), EntityType,
                                                              "ResponseProducts",
                                                              MemberTypes.Property);
            return _dtsProducts;
        }
    }

    /// <summary>
    /// DataSource for the Marketing Service Open records.
    /// </summary>
    /// <value>The Marketing Service Open datasource.</value>
    public WebEntityListBindingSource dtsOpens
    {
        get
        {
            if (_dtsOpens == null)
                _dtsOpens = new WebEntityListBindingSource(typeof(IMarketingServiceOpen), EntityType,
                                                           "MarketingServiceRecipient.MarketingServiceOpens",
                                                           MemberTypes.Property);
            return _dtsOpens;
        }
    }

    /// <summary>
    /// DataSouce for the the Marketing Service Click records.
    /// </summary>
    /// <value>The Marketing Service Click datasource.</value>
    public WebEntityListBindingSource dtsClicks
    {
        get
        {
            if (_dtsClicks == null)
                _dtsClicks = new WebEntityListBindingSource(typeof(IMarketingServiceClick), EntityType,
                                                            "MarketingServiceRecipient.MarketingServiceClicks",
                                                            MemberTypes.Property);
            return _dtsClicks;
        }
    }

    /// <summary>
    /// DataSource for the Marketing Service Undeliverables records.
    /// </summary>
    /// <value>The Marketing Service Undeliverables datasource.</value>
    public WebEntityListBindingSource dtsUndeliverables
    {
        get
        {
            if (_dtsUndeliverables == null)
                _dtsUndeliverables = new WebEntityListBindingSource(typeof(IMarketingServiceUndeliverable), EntityType,
                                                                    "MarketingServiceRecipient.MarketingServiceUndeliverables",
                                                                    MemberTypes.Property);
            return _dtsUndeliverables;
        }
    }

    /// <summary>
    /// Gets a value indicating whether this instance is lead.
    /// </summary>
    /// <value><c>true</c> if this instance is lead; otherwise, <c>false</c>.</value>
    public Boolean IsLead
    {
        get
        {
            return rdgTargetType.SelectedIndex > 0;
            //if (!_IsLead.HasValue)
            //    _IsLead = (DialogService.DialogParameters.Count > 0 && (DialogService.DialogParameters.ContainsKey("IsLead")));
            //return Convert.ToBoolean(_IsLead);
        }
        set
        {
            rdgTargetType.SelectedIndex = 1;
            //_IsLead = value;
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

        foreach (Control c in Controls)
        {
            SmartPartToolsContainer cont = c as SmartPartToolsContainer;
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

    #region Private Methods

    /// <summary>
    /// Registers the client script.
    /// </summary>
    private void RegisterClientScript()
    {
        StringBuilder sb = new StringBuilder(GetLocalResourceObject("AddEditTargetResponse_ClientScript").ToString());
        sb.Replace("@tr_divProductsId", divProducts.ClientID);
        sb.Replace("@tr_tabProductsId", tabProducts.ClientID);
        sb.Replace("@tr_divClicksId", divClicks.ClientID);
        sb.Replace("@tr_tabClicksId", tabClicks.ClientID);
        sb.Replace("@tr_divOpensId", divOpens.ClientID);
        sb.Replace("@tr_tabOpensId", tabOpens.ClientID);
        sb.Replace("@tr_divUndeliverablesId", divUndeliverables.ClientID);
        sb.Replace("@tr_tabUndeliverablesId", tabUndeliverables.ClientID);
        sb.Replace("@tr_txtSelectedTabId", txtSelectedTab.ClientID);
        sb.Replace("@tr_divAddProductId", divAddProduct.ClientID);

        ScriptManager.RegisterStartupScript(Page, GetType(), "AddEditTargetResponse", sb.ToString(), false);
    }

    /// <summary>
    /// Sets the visible state of the tabs.
    /// </summary>
    private void SetVisibleTabState()
    {
        if (!String.IsNullOrEmpty(txtSelectedTab.Value))
        {
            switch (Convert.ToInt16(txtSelectedTab.Value))
            {
                case 1:
                    divClicks.Style.Add(HtmlTextWriterStyle.Display, "inline");
                    divOpens.Style.Add(HtmlTextWriterStyle.Display, "none");
                    divUndeliverables.Style.Add(HtmlTextWriterStyle.Display, "none");
                    tabClicks.CssClass = "activeTab tab";
                    tabOpens.CssClass = "inactiveTab tab";
                    tabUndeliverables.CssClass = "inactiveTab tab";
                    break;
                case 2:
                    divProducts.Style.Add(HtmlTextWriterStyle.Display, "none");
                    divClicks.Style.Add(HtmlTextWriterStyle.Display, "none");
                    divOpens.Style.Add(HtmlTextWriterStyle.Display, "inline");
                    divUndeliverables.Style.Add(HtmlTextWriterStyle.Display, "none");
                    tabProducts.CssClass = "inactiveTab tab";
                    tabClicks.CssClass = "inactiveTab tab";
                    tabOpens.CssClass = "activeTab tab";
                    tabUndeliverables.CssClass = "inactiveTab tab";
                    break;
                case 3:
                    divProducts.Style.Add(HtmlTextWriterStyle.Display, "none");
                    divClicks.Style.Add(HtmlTextWriterStyle.Display, "none");
                    divOpens.Style.Add(HtmlTextWriterStyle.Display, "inline");
                    divUndeliverables.Style.Add(HtmlTextWriterStyle.Display, "none");
                    tabProducts.CssClass = "inactiveTab tab";
                    tabClicks.CssClass = "inactiveTab tab";
                    tabOpens.CssClass = "inactiveTab tab";
                    tabUndeliverables.CssClass = "activeTab tab";
                    break;
                default:
                    divProducts.Style.Add(HtmlTextWriterStyle.Display, "inline");
                    divClicks.Style.Add(HtmlTextWriterStyle.Display, "none");
                    divOpens.Style.Add(HtmlTextWriterStyle.Display, "none");
                    divUndeliverables.Style.Add(HtmlTextWriterStyle.Display, "none");
                    tabProducts.CssClass = "activeTab tab";
                    tabClicks.CssClass = "inactiveTab tab";
                    tabOpens.CssClass = "inactiveTab tab";
                    tabUndeliverables.CssClass = "inactiveTab tab";
                    break;
            }
        }
    }

    /// <summary>
    /// Sets the UI display based on the TargetType selected.
    /// </summary>
    private void SetTargetTypeDisplay()
    {
        if (rdgTargetType.SelectedIndex == 0)
        {
            divContact.Visible = true;
            divLead.Visible = false;
        }
        else
        {
            divContact.Visible = false;
            divLead.Visible = true;
        }
    }

    /// <summary>
    /// Assigns the campaign target.
    /// </summary>
    private void AssignCampaignTarget()
    {
        ITargetResponse targetResponse = this.BindingSource.Current as ITargetResponse;
        if (targetResponse.Campaign != null)
        {
            ICampaignTarget campaignTarget = targetResponse.CampaignTarget;
            if (targetResponse.CampaignTarget == null)
            {
                ICampaign campaign = (ICampaign)lueCampaign.LookupResultValue;
                Object entityId;
                if (rdgTargetType.SelectedIndex == 1)
                    entityId = targetResponse.Lead.Id;
                else
                    entityId = targetResponse.Contact.Id;
                IRepository<ICampaignTarget> repository = EntityFactory.GetRepository<ICampaignTarget>();
                IQueryable query = (IQueryable)repository;
                IExpressionFactory expFactory = query.GetExpressionFactory();
                ICriteria criteria = query.CreateCriteria()
                    .Add(expFactory.And(
                        expFactory.Eq("EntityId", entityId),
                        expFactory.Eq("Campaign.Id", campaign.Id)));
                IList<ICampaignTarget> targets = criteria.List<ICampaignTarget>();
                if (targets.Count > 0)
                {
                    campaignTarget = targets[0];
                }
                else
                {
                    campaignTarget = EntityFactory.Create<ICampaignTarget>();
                    campaignTarget.Stage = targetResponse.Stage;
                    if (rdgTargetType.SelectedIndex == 1)
                    {
                        if (targetResponse.Lead != null)
                        {
                            campaignTarget.EntityId = targetResponse.Lead.Id.ToString();
                            campaignTarget.TargetType = "Lead";
                        }
                    }
                    else if (targetResponse.Contact != null)
                    {
                        campaignTarget.EntityId = targetResponse.Contact.Id.ToString();
                        campaignTarget.TargetType = "Contact";
                    }
                    campaignTarget.Campaign = targetResponse.Campaign;
                    campaignTarget.Status = GetLocalResourceObject("CampaignTargetStatus").ToString();
                }
            }
            else
            {
                if (rdgTargetType.SelectedIndex == 1)
                {
                    if (targetResponse.Lead != null)
                    {
                        campaignTarget.EntityId = targetResponse.Lead.Id.ToString();
                        campaignTarget.TargetType = "Lead";
                    }
                }
                else if (targetResponse.Contact != null)
                {
                    campaignTarget.EntityId = targetResponse.Contact.Id.ToString();
                    campaignTarget.TargetType = "Contact";
                }
                campaignTarget.Campaign = targetResponse.Campaign;
                campaignTarget.Status = GetLocalResourceObject("CampaignTargetStatus").ToString();
            }
            targetResponse.CampaignTarget = campaignTarget;
        }
        else
        {
            //don't create a campaignTarget
            targetResponse.CampaignTarget = null;
        }
    }

    /// <summary>
    /// Handles the OnCurrentEntitySet event of the BindingSource control.
    /// </summary>
    private void BindingSource_Set(object sender, EventArgs e)
    {
        bool enableEntity = false;
        bool enableCampaign = false;

        rdgTargetType.Enabled = true;
        ITargetResponse targetResponse = BindingSource.Current as ITargetResponse;

        if (DialogService.DialogParameters.ContainsKey("IsLead"))
            rdgTargetType.SelectedIndex = 1;
        else
        {
            if (rdgTargetType.SelectedIndex == -1) // default to contact if not set
                rdgTargetType.SelectedIndex = 0;
        }

        if (DialogService.DialogParameters.ContainsKey("ResponseDataSource"))
        {
            ITargetResponse targetResponseNew = DialogService.DialogParameters["ResponseDataSource"] as ITargetResponse;
            if (targetResponseNew != null)
            {
                targetResponse.Contact = targetResponseNew.Contact;
                targetResponse.Lead = targetResponseNew.Lead;
                targetResponse.Campaign = targetResponseNew.Campaign;
                if (targetResponseNew.CampaignTarget != null)
                    targetResponse.CampaignTarget = targetResponseNew.CampaignTarget;
                if (String.IsNullOrEmpty(targetResponse.Stage) && targetResponse.CampaignTarget != null)
                    targetResponse.Stage = targetResponse.CampaignTarget.Stage;
                if (targetResponseNew.Id == null)
                    targetResponse.Status = GetLocalResourceObject("Default_TargetStatus").ToString();
            }
        }

        //Adding a new response 
        if (targetResponse.Id == null)
        {
            enableEntity = true;
            enableCampaign = true;

            if (targetResponse.Contact != null)
            {
                lueContact.SeedValue = targetResponse.Contact.Account.Id.ToString();
            }
        }
        else //Editing a response
        {
            enableEntity = false;
            enableCampaign = (targetResponse.Campaign == null);
            rdgTargetType.Enabled = false;
        }
        lueContact.EnableLookup = enableEntity;
        lueContact.Enabled = enableEntity;
        lueLead.EnableLookup = enableEntity;
        lueLead.Enabled = enableEntity;
        lueCampaign.EnableLookup = enableCampaign;
        lueCampaign.Enabled = enableCampaign;

        if (DialogService.DialogParameters.ContainsKey("ResponseDataSource"))
            DialogService.DialogParameters.Remove("ResponseDataSource");
    }

    /// <summary>
    /// Loads the campaign stages.
    /// </summary>
    private void LoadCampaignStages()
    {
        lbxStages.Items.Clear();
        lbxStages.Items.Add(string.Empty);
        ITargetResponse targetResponse = BindingSource.Current as ITargetResponse;
        if (targetResponse != null)
        {
            ICampaign campaign = targetResponse.Campaign;
            if (campaign != null)
            {
                bool valueFound = false;
                foreach (ICampaignStage stage in campaign.CampaignStages)
                {
                    lbxStages.Items.Add(stage.Description);
                    if (stage.Description != targetResponse.Stage) continue;
                    lbxStages.SelectedValue = stage.Description;
                    valueFound = true;
                }

                if (!valueFound && !string.IsNullOrEmpty(targetResponse.Stage))
                {
                    lbxStages.Items.Add(targetResponse.Stage);
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
            if (BindingSource.Current == null)
            {
                BindingSource.OnCurrentEntitySet += BindingSource_Set;
            }
            else
            {
                BindingSource_Set(sender, e);
            }

            tabProducts.Attributes.Add("onclick", "javascript:OnTabProductsClick()");
            tabClicks.Attributes.Add("onclick", "javascript:OnTabClicksClick()");
            tabOpens.Attributes.Add("onclick", "javascript:OnTabOpensClick()");
            tabUndeliverables.Attributes.Add("onclick", "javascript:OnTabUndeliverablesClick()");
        }
    }

    /// <summary>
    /// Called when [closing].
    /// </summary>
    protected override void OnClosing()
    {
        DialogService.DialogParameters.Remove("ResponseDataSource");
        DialogService.DialogParameters.Remove("IsLead");
        rdgTargetType.SelectedIndex = 0; // set back to contact
        base.OnClosing();
        Refresh();
    }

    /// <summary>
    /// Called when [form bound].
    /// </summary>
    protected override void OnFormBound()
    {
        RegisterClientScript();
        if (IsLead)
        {
            lueLead.Text = String.Empty;
            rdgTargetType.SelectedIndex = 1;
        }
        else
        {
            rdgTargetType.SelectedIndex = 0;
        }
        SetTargetTypeDisplay();

        SetVisibleTabState();
        LoadCampaignStages();
        ClientBindingMgr.RegisterDialogCancelButton(cmdCancel);
        ClientBindingMgr.RegisterSaveButton(cmdOK);

        if (dtsProducts.SourceObject == null)
            dtsProducts.SourceObject = BindingSource.Current;
        if (dtsOpens.SourceObject == null)
            dtsOpens.SourceObject = BindingSource.Current;
        if (dtsClicks.SourceObject == null)
            dtsClicks.SourceObject = BindingSource.Current;
        if (dtsUndeliverables.SourceObject == null)
            dtsUndeliverables.SourceObject = BindingSource.Current;

        dtsProducts.Bind();
        dtsOpens.Bind();
        dtsClicks.Bind();
        dtsUndeliverables.Bind();
    }

    /// <summary>
    /// Called when [wire event handlers].
    /// </summary>
    protected override void OnWireEventHandlers()
    {
        base.OnWireEventHandlers();
        rdgTargetType.TextChanged += new EventHandler(rdgTargetType_ChangeAction);
        cmdOK.Click += new EventHandler(cmdOK_ClickAction);
        cmdOK.Click += new EventHandler(DialogService.CloseEventHappened);
        cmdCancel.Click += new EventHandler(DialogService.CloseEventHappened);
        lueAddProduct.LookupResultValueChanged += new EventHandler(lueAddProduct_ChangeAction);
    }

    public WebEntityListBindingSource Products
    {
        get
        {
            if (_dtsProducts == null)
            {
                _dtsProducts = new WebEntityListBindingSource(typeof(IResponseProduct),
           EntityType, "ResponseProducts", MemberTypes.Property);
            }
            return _dtsProducts;
        }
    }

    /// <summary>
    /// Called when [add entity bindings].
    /// </summary>
    protected override void OnAddEntityBindings()
    {
        WebEntityBinding lueLeadSourceLookupResultValueBinding = new WebEntityBinding("LeadSource", lueTargetLeadSource, "LookupResultValue", String.Empty, null);
        BindingSource.Bindings.Add(lueLeadSourceLookupResultValueBinding);
        WebEntityBinding lueContactValueBinding = new WebEntityBinding("Contact", lueContact, "LookupResultValue", String.Empty, null);
        BindingSource.Bindings.Add(lueContactValueBinding);
        WebEntityBinding lueLeadValueBinding = new WebEntityBinding("Lead", lueLead, "LookupResultValue", String.Empty, null);
        BindingSource.Bindings.Add(lueLeadValueBinding);
        WebEntityBinding lueCampaignLookupResultValueBinding = new WebEntityBinding("Campaign", lueCampaign, "LookupResultValue", String.Empty, null);
        BindingSource.Bindings.Add(lueCampaignLookupResultValueBinding);
        WebEntityBinding dtpResponseDateDateTimeValueBinding = new WebEntityBinding("ResponseDate", dtpResponseDate, "DateTimeValue", String.Empty, null);
        BindingSource.Bindings.Add(dtpResponseDateDateTimeValueBinding);
        WebEntityBinding lbxStagesTextBinding = new WebEntityBinding("Stage", lbxStages, "Text");
        BindingSource.Bindings.Add(lbxStagesTextBinding);
        WebEntityBinding pklResponseStatusPickListValueBinding = new WebEntityBinding("Status", pklResponseStatus, "PickListValue");
        BindingSource.Bindings.Add(pklResponseStatusPickListValueBinding);
        WebEntityBinding pklResponseMethodPickListValueBinding = new WebEntityBinding("ResponseMethod", pklResponseMethod, "PickListValue");
        BindingSource.Bindings.Add(pklResponseMethodPickListValueBinding);
        WebEntityBinding pklInterestPickListValueBinding = new WebEntityBinding("Interest", pklInterest, "PickListValue");
        BindingSource.Bindings.Add(pklInterestPickListValueBinding);
        WebEntityBinding pklInterestLevelPickListValueBinding = new WebEntityBinding("InterestLevel", pklInterestLevel, "PickListValue");
        BindingSource.Bindings.Add(pklInterestLevelPickListValueBinding);
        WebEntityBinding txtCommentsTextBinding = new WebEntityBinding("Comments", txtComments, "Text");
        BindingSource.Bindings.Add(txtCommentsTextBinding);
        dtsProducts.Bindings.Add(new WebEntityListBinding("ResponseProducts", grdProducts));
        dtsProducts.BindFieldNames = new String[] { "Id", "Product.Name", "Product.Description", "Product.ActualId", "Product.Status" };
        dtsClicks.Bindings.Add(new WebEntityListBinding("MarketingServiceRecipient.MarketingServiceClicks", grdClicks));
        dtsClicks.BindFieldNames = new String[] { "Id", "LinkName", "LinkURL", "ClickDate" };
        dtsOpens.Bindings.Add(new WebEntityListBinding("MarketingServiceRecipient.MarketingServiceOpens", grdOpens));
        dtsOpens.BindFieldNames = new String[] { "Id", "OpenDate", "UnsubscribeDate", "UnsubscribeCampaignName" };
        dtsUndeliverables.Bindings.Add(new WebEntityListBinding("MarketingServiceRecipient.MarketingServiceUndeliverables", grdUndeliverables));
        dtsUndeliverables.BindFieldNames = new String[] { "Id", "BounceDate", "BounceCampaignName", "BounceCount", "BounceReason" };

        BindingSource.OnCurrentEntitySet += new EventHandler(dtsProducts_OnCurrentEntitySet);
        BindingSource.OnCurrentEntitySet += new EventHandler(dtsOpens_OnCurrentEntitySet);
        BindingSource.OnCurrentEntitySet += new EventHandler(dtsClicks_OnCurrentEntitySet);
        BindingSource.OnCurrentEntitySet += new EventHandler(dtsUndeliverables_OnCurrentEntitySet);
    }

    /// <summary>
    /// Handles the ChangeAction event of the rdgTargetType control.
    /// </summary>
    /// <param   name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void rdgTargetType_ChangeAction(object sender, EventArgs e)
    {
        SetTargetTypeDisplay();
    }

    /// <summary>
    /// determines if the contact selected in the contact lookup is associated to an account.
    /// If an account was created without a contact, this caused a problem since responses
    /// are tied to an account.
    /// </summary>
    /// <param name="contact"></param>
    /// <param name="account"></param>
    /// <returns></returns>
    private bool IsContactAssociatedToAccount(IContact contact, IAccount account)
    {
        bool isAccountContact = false;
        foreach (IContact accountContact in account.Contacts)
        {
            IContact lookupContact = lueContact.LookupResultValue as IContact;
            if (lookupContact != null)
            {
                if (accountContact.Id.ToString().CompareTo(lookupContact.Id) == 0)
                {
                    isAccountContact = true;
                    break;
                }
            }
        }

        return isAccountContact;
    }

    /// <summary>
    /// Handles the ClickAction event of the cmdOK control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void cmdOK_ClickAction(object sender, EventArgs e)
    {
        ITargetResponse targetResponse = BindingSource.Current as ITargetResponse;

        // contact must be selected
        if (!IsLead)
        {
            if (lueContact.Text.Trim().Length == 0)
                throw new ValidationException("Please enter a Contact");
        }
        else
        {
            if(lueLead.Text.Trim().Length == 0)
                throw new ValidationException("Please enter a Lead");
        }

        AssignCampaignTarget();
        
        if (targetResponse.CampaignTarget != null && !targetResponse.CampaignTarget.PersistentState.Equals(PersistentState.New))
            targetResponse.CampaignTarget.Save();

        targetResponse.Save();
        RefreshData();
    }

    /// <summary>
    /// Handles the RowEditing event of the grdProducts control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewEditEventArgs"/> instance containing the event data.</param>
    protected void grdProducts_RowEditing(object sender, GridViewEditEventArgs e)
    {
        grdProducts.SelectedIndex = e.NewEditIndex;
    }

    /// <summary>
    /// Handles the RowDeleting event of the grdProducts control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewDeleteEventArgs"/> instance containing the event data.</param>
    protected void grdProducts_RowDeleting(object sender, GridViewDeleteEventArgs e)
    {
        grdProducts.SelectedIndex = -1;
    }

    /// <summary>
    /// Gets the index of the GRD parts delete column.
    /// </summary>
    /// <value>The index of the GRD parts delete column.</value>
    protected int grdProductsDeleteColumnIndex
    {
        get
        {
            if (_grdProductsdeleteColumnIndex == -2)
            {
                int bias = (grdProducts.ExpandableRows) ? 1 : 0;
                _grdProductsdeleteColumnIndex = -1;
                int colcount = 0;
                foreach (DataControlField col in grdProducts.Columns)
                {
                    ButtonField btn = col as ButtonField;
                    if (btn != null)
                    {
                        if (btn.CommandName == "Delete")
                        {
                            _grdProductsdeleteColumnIndex = colcount + bias;
                            break;
                        }
                    }
                    colcount++;
                }
            }
            return _grdProductsdeleteColumnIndex;
        }
    }

    /// <summary>
    /// Handles the RowDataBound event of the grdParts control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewRowEventArgs"/> instance containing the event data.</param>
    protected void grdProducts_RowDataBound(object sender, GridViewRowEventArgs e)
    {
        if (e.Row.RowType == DataControlRowType.DataRow)
        {
            if ((grdProductsDeleteColumnIndex >= 0) && (grdProductsDeleteColumnIndex < e.Row.Cells.Count))
            {
                TableCell cell = e.Row.Cells[grdProductsDeleteColumnIndex];
                foreach (Control c in cell.Controls)
                {
                    LinkButton btn = c as LinkButton;
                    if (btn != null)
                    {
                        btn.Attributes.Add("onclick", "javascript: return confirm('" + GetLocalResourceObject("grdProducts.Remove.ConfirmationMessage") + "');");
                        return;
                    }
                }
            }
        }
    }

    protected void grdProducts_RowCommand(object sender, GridViewCommandEventArgs e)
    {
        if (e.CommandName == "Page")
            return;
        int rowIndex;
        if (Int32.TryParse(e.CommandArgument.ToString(), out rowIndex))
        {
            dtsProducts.SelectedIndex = rowIndex;
            if (e.CommandName.Equals("Delete"))
            {
                if (grdProducts.DataKeys[0].Values.Count > 0)
                {
                    ITargetResponse targetResponse = BindingSource.Current as ITargetResponse;
                    if (targetResponse != null)
                    {
                        IResponseProduct responseProduct = EntityFactory.GetRepository<IResponseProduct>().Get(grdProducts.DataKeys[rowIndex].Values[0].ToString());
                        if (responseProduct != null)
                        {
                            targetResponse.ResponseProducts.Remove(responseProduct);
                            responseProduct.Delete();
                            if (PageWorkItem != null)
                            {
                                IPanelRefreshService refresher = PageWorkItem.Services.Get<IPanelRefreshService>();
                                if (refresher != null)
                                    refresher.RefreshAll();
                            }
                        }
                    }
                }
            }
        }
    }

    /// <summary>
    /// Refreshes the data.
    /// </summary>
    protected void RefreshData()
    {
        IPanelRefreshService refreshService = PageWorkItem.Services.Get<IPanelRefreshService>();
        if (refreshService != null)
        {
            refreshService.RefreshAll();
        }
        else
        {
            Response.Redirect(Request.Url.ToString());
        }
    }

    /// <summary>
    /// Handles the ChangeAction event of the lueAddProduct control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void lueAddProduct_ChangeAction(object sender, EventArgs e)
    {
        if (lueAddProduct.LookupResultValue != null)
        {
            ITargetResponse targetResponse = BindingSource.Current as ITargetResponse;
            IProduct product = lueAddProduct.LookupResultValue as IProduct;
            if ((targetResponse != null) && (product != null))
            {
                IResponseProduct responseProduct = EntityFactory.Create<IResponseProduct>();
                responseProduct.TargetResponse = targetResponse;
                responseProduct.Product = product;
                targetResponse.ResponseProducts.Add(responseProduct);
            }
        }
    }

    /// <summary>
    /// Handles the OnCurrentEntitySet event of the dtsproducts control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    void dtsProducts_OnCurrentEntitySet(object sender, EventArgs e)
    {
        if (!Visible) return;
        if (dtsProducts != null)
        {
            if (dtsProducts.SourceObject == null)
                dtsProducts.SourceObject = BindingSource.Current;
        }
    }

    /// <summary>
    /// Handles the OnCurrentEntitySet event of the dtsOpens control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    void dtsOpens_OnCurrentEntitySet(object sender, EventArgs e)
    {
        if (!Visible) return;
        if (dtsOpens != null)
        {
            if (dtsOpens.SourceObject == null)
                dtsOpens.SourceObject = BindingSource.Current;
        }
    }

    /// <summary>
    /// Handles the OnCurrentEntitySet event of the dtsClicks control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    void dtsClicks_OnCurrentEntitySet(object sender, EventArgs e)
    {
        if (!Visible) return;
        if (dtsClicks != null)
        {
            if (dtsClicks.SourceObject == null)
                dtsClicks.SourceObject = BindingSource.Current;
        }
    }

    /// <summary>
    /// Handles the OnCurrentEntitySet event of the dtsUndeliverables control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    void dtsUndeliverables_OnCurrentEntitySet(object sender, EventArgs e)
    {
        if (!Visible) return;
        if (dtsUndeliverables != null)
        {
            if (dtsUndeliverables.SourceObject == null)
                dtsUndeliverables.SourceObject = BindingSource.Current;
        }
    }

    #endregion
}