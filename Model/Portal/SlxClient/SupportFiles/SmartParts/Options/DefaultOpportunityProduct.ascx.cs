using System;
using System.Collections;
using System.Web.UI;
using System.Web.UI.WebControls;
using Sage.Platform.Application.Services;
using Sage.Platform.WebPortal.SmartParts;
using Sage.SalesLogix.Entities;
using Sage.Entity.Interfaces;
using Sage.Platform.Application;
using Sage.Platform;
using System.Collections.Generic;
using Sage.Platform.Repository;
using Sage.Platform.Application.UI;
using Sage.Common.Syndication.Json;
using System.Text;
using Sage.SalesLogix;
using Sage.SalesLogix.WebUserOptions;
using Sage.Platform.WebPortal.Services;
using Sage.Platform.WebPortal;

public partial class SmartParts_DefaultOpportunityProduct : System.Web.UI.UserControl, ISmartPartInfoProvider, IScriptControl
{

    IWebDialogService _dialogService;
    [ServiceDependency]
    public IWebDialogService DialogService
    {
        get { return _dialogService; }
        set
        {
            _dialogService = value;
        }
    }


    public class ClientConfiguration
    {
        private string _id;
        private string _clientId;
        private string _selectedNodesClientId;
        private string _productTreeTitle;
        private string _queryState;

        /// <summary>
        /// Gets or sets the ID.
        /// </summary>
        /// <value>The ID.</value>
        [JsonProperty("id")]
        public string ID
        {
            get { return _id; }
            set { _id = value; }
        }

        /// <summary>
        /// Gets or sets the client ID.
        /// </summary>
        /// <value>The client ID.</value>
        [JsonProperty("clientId")]
        public string ClientID
        {
            get { return _clientId; }
            set { _clientId = value; }
        }


        /// <summary>
        /// Gets or sets the selected nodes client ID.
        /// </summary>
        /// <value>The selected nodes client ID.</value>
        [JsonProperty("selectedNodesClientId")]
        public string SelectedNodesClientID
        {
            get { return _selectedNodesClientId; }
            set { _selectedNodesClientId = value; }
        }

        /// <summary>
        /// Gets or sets the product tree title.
        /// </summary>
        /// <value>The product tree title.</value>
        [JsonProperty("productTreeTitle")]
        public string ProductTreeTitle
        {
            get { return _productTreeTitle; }
            set { _productTreeTitle = value; }
        }

        [JsonProperty("queryState")]
        public string QueryState
        {
            get { return _queryState; }
            set { _queryState = value; }
        }
        /// <summary>
        /// Froms the specified control.
        /// </summary>
        /// <param name="control">The control.</param>
        /// <returns></returns>
        public static ClientConfiguration From(SmartParts_DefaultOpportunityProduct control)
        {
            ClientConfiguration configuration = new ClientConfiguration();
            configuration.ID = control.ID;
            configuration.ClientID = control.ClientID;
            configuration.SelectedNodesClientID = control.selectedNodes.ClientID;
            configuration.ProductTreeTitle = control.GetLocalResourceObject("lblAvailableProducts_rsc.Text") as string;
            return configuration;
        }
    }

    public class AddProductStateInfo
    {
        public bool Packages = false;
        public string NameFilter = string.Empty;
        public string DescFilter = string.Empty;
        public string FamilyFilter = string.Empty;
        public string StatusFilter = string.Empty;
        public string SKUFilter = string.Empty;
        public int NameCond = 0;
        public int DescCond = 0;
        public int SKUCond = 0;
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

    private IEntityContextService _EntityService;
    private IContextService _Context;
    private AddProductStateInfo _State;
    private IUserOptionsService _UserOptions;
    private ClientConfiguration treeConfig = null;

    /// <summary>
    /// Gets the <see cref="T:Sage.Platform.Application.IEntityContextService"/> instance
    /// </summary>
    /// <value></value>
    [ServiceDependency]
    public IEntityContextService EntityContext
    {
        set
        {
            _EntityService = value;
        }
        get
        {
            return _EntityService;
        }
    }

    protected override void OnLoad(EventArgs e)
    {
        base.OnLoad(e);
        cmdCancel.Click += DialogService.CloseEventHappened;
        cmdSave.Click += cmdOK_Click;
        cmdOK.Click += DialogService.CloseEventHappened;
    }

    /// <summary>
    /// Handles the Init event of the Page control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void Page_Init(object sender, EventArgs e)
    {
        _Context = ApplicationContext.Current.Services.Get<IContextService>();
        _State = _Context.GetContext("AddProductStateInfo") as AddProductStateInfo;
        if (_State == null) { _State = new AddProductStateInfo(); }
        _UserOptions = ApplicationContext.Current.Services.Get<IUserOptionsService>();

    }

    private void LoadTreeConfig()
    {
        if (treeConfig == null)
            treeConfig = ClientConfiguration.From(this);
        treeConfig.QueryState = BuildQueryFromState();

        // we only want to run the script when the content is actually there
        StringBuilder script = new StringBuilder();
        btnAdd.Visible = true;
        // ToDo: Place this message elsewhere so that it can be displayed when the sdata returns 0
        lblEnterCriteriaMessage.Visible = false;

        script.AppendFormat("SmartParts.Options.DefaultOpportunityProduct.create('{0}', {1})", ID,
                            JavaScriptConvert.SerializeObject(treeConfig));

        if (ScriptManager.GetCurrent(Page).IsInAsyncPostBack)
            ScriptManager.RegisterStartupScript(Page, typeof(Page), "add-opportunity-product-init",
                                                script.ToString(), true);
    }

    private string BuildQueryFromState()
    {
        StringBuilder queryStringState = new StringBuilder();
        queryStringState.AppendFormat("&Packages={0}&NameFilter={1}&FamilyFilter={2}&NameCond={3}",
            _State.Packages, _State.NameFilter, _State.FamilyFilter, _State.NameCond);
        queryStringState.AppendFormat("&StatusFilter={0}&SKUFilter={1}&SKUCond={2}",
            _State.StatusFilter, _State.SKUFilter, _State.SKUCond);

        return queryStringState.ToString();
    }
    /// <summary>
    /// Raises the <see cref="E:PreRender"/> event.
    /// </summary>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected override void OnPreRender(EventArgs e)
    {
        base.OnPreRender(e);
        LoadTreeConfig();

        if (Visible)
        {
            // required to register the .js file used in this page
            if (DesignMode == false)
                if (ScriptManager.GetCurrent(Page) != null)
                    ScriptManager.GetCurrent(Page).RegisterScriptControl(this);
        }

        //ClientBindingMgr.RegisterDialogCancelButton(cmdCancel);

        if (chkPackage.Checked != _State.Packages)
        {
            chkPackage_CheckedChanged(null, null);
        }
        grdProducts.DataBind();
    }


    /// <summary>
    /// Handles the ClickAction event of the cmdSave control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void cmdSave_ClickAction(object sender, EventArgs e)
    {
            
                
    }

    /// <summary>
    /// Handles the Click event of the btnAdd control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void btnAdd_Click(object sender, EventArgs e)
    {
        List<string> selectedProductIDs = new List<string>(selectedNodes.Value.Split(','));
        IList<IOpportunityProduct> ListProducts = DefOppProdHelper.GetList();
        foreach (string productID in selectedProductIDs)
        {
            IProduct product = EntityFactory.GetRepository<IProduct>().Get(productID);
            if (product != null)
            {
                IOpportunityProduct oppProd = EntityFactory.Create<IOpportunityProduct>();
                oppProd.Product = EntityFactory.GetRepository<IProduct>().Get(productID);

                bool isInList = false;
                foreach (IOpportunityProduct op in DefOppProdHelper.GetList())
                {
                    if (string.Compare(Convert.ToString(op.Product.Id), Convert.ToString(oppProd.Product.Id)) == 0)
                    {
                        op.Quantity++;
                        isInList = true;
                        break;
                    }
                }

                if (!isInList)
                {
                    oppProd.Quantity = 1;
                    oppProd.Discount = 0;

                    if (oppProd.Product.ProductProgram.Count != 0)
                    {
                        foreach (IProductProgram prodProgram in oppProd.Product.ProductProgram)
                        {
                            if (prodProgram.DefaultProgram == true)
                            {
                                oppProd.CalculatedPrice = prodProgram.Price;
                                oppProd.Program = prodProgram.Program;
                                oppProd.Price = prodProgram.Price;
                            }
                        }
                    }
                    else
                    {
                        oppProd.CalculatedPrice = Convert.ToDecimal(oppProd.Product.Price);
                        oppProd.Price = oppProd.Product.Price;
                    }
                    oppProd.ExtendedPrice = oppProd.CalculatedPrice * Convert.ToDecimal(oppProd.Quantity);
                    ListProducts.Add(oppProd);
                }
            }
        }
        for (int i = 0; i < ListProducts.Count; i++)
            ListProducts[i].Sort = i + 1;
        DefOppProdHelper.SetList(ListProducts);

        LoadTreeConfig();
    }

    #region filters


    /// <summary>
    /// Handles the Click event of the Clear control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void Clear_Click(object sender, EventArgs e)
    {
        chkName.Checked = false;
        chkSKU.Checked = false;
        ddlName.SelectedIndex = 0;
        ddlSKU.SelectedIndex = 0;
        txtName.Text = String.Empty;
        txtSKU.Text = String.Empty;
        chkFamily.Checked = false;
        chkStatus.Checked = false;
        chkPackage.Checked = false;
        _State.Packages = false;
        _State.NameFilter = string.Empty;
        _State.DescFilter = string.Empty;
        _State.FamilyFilter = string.Empty;
        _State.StatusFilter = string.Empty;
        _State.SKUFilter = string.Empty;
        _Context.SetContext("AddProductStateInfo", _State);
        treeConfig = null;

        // this causes the tree not to load
        hidIsTreeLoaded.Value = Boolean.FalseString;
    }

    /// <summary>
    /// Handles the Click event of the btnShowResults control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void btnShowResults_Click(object sender, EventArgs e)
    {
        treeConfig = null;
        _State.NameFilter = string.Empty;
        _State.DescFilter = string.Empty;
        _State.FamilyFilter = string.Empty;
        _State.StatusFilter = string.Empty;
        _State.SKUFilter = string.Empty;
        if (chkName.Checked)
        {
            _State.NameFilter = txtName.Text;
            _State.NameCond = ddlName.SelectedIndex;
        }


        if (chkSKU.Checked)
        {
            _State.SKUFilter = txtSKU.Text;
            _State.SKUCond = ddlSKU.SelectedIndex;
        }

        if (chkFamily.Checked)
        {
            _State.FamilyFilter = pklProductFamily.PickListValue;
        }

        if (chkStatus.Checked)
        {
            _State.StatusFilter = pklProductStatus.PickListValue;
        }
        _Context.SetContext("AddProductStateInfo", _State);

        hidIsTreeLoaded.Value = Boolean.TrueString;
    }

    /// <summary>
    /// Handles the CheckedChanged event of the chkPackage control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void chkPackage_CheckedChanged(object sender, EventArgs e)
    {
        if (_State.Packages == chkPackage.Checked) return;

        _State.Packages = chkPackage.Checked;
        _Context.SetContext("AddProductStateInfo", _State);

        // don't want this to load on the click event of the checkbox, wait until user clicks on Show Results
        hidIsTreeLoaded.Value = Boolean.FalseString;

        chkSKU.Enabled = !chkPackage.Checked;
        chkFamily.Enabled = !chkPackage.Checked;
        chkStatus.Enabled = !chkPackage.Checked;
        txtSKU.Enabled = !chkPackage.Checked;
        ddlSKU.Enabled = !chkPackage.Checked;
        pklProductFamily.Enabled = !chkPackage.Checked;
        pklProductStatus.Enabled = !chkPackage.Checked;
        chkName.Text = chkPackage.Checked
                           ? GetLocalResourceObject("chkPackageName_rsc.Text").ToString()
                           : GetLocalResourceObject("chkName_rsc.Text").ToString();

    }

    /// <summary>
    /// Gets the package list.
    /// </summary>
    /// <returns></returns>
    private object GetPackageList()
    {
        IRepository<Package> PackageRep = EntityFactory.GetRepository<Package>();
        IQueryable qryablePackage = (IQueryable)PackageRep;
        IExpressionFactory expPackage = qryablePackage.GetExpressionFactory();
        Sage.Platform.Repository.ICriteria criteriaPackage = qryablePackage.CreateCriteria();

        if (_State.NameFilter != string.Empty)
        {
            SearchParameter enumCondition = (SearchParameter)_State.NameCond;
            criteriaPackage.Add(GetExpression(expPackage, enumCondition, "Name", _State.NameFilter));
        }

        //_criteriaPackage.SetFetchMode("PackageProducts", Sage.Platform.Repository.FetchMode.Join);

        List<Package> PackageList = criteriaPackage.List<Package>() as List<Package>;
        return PackageList;
    }

    /// <summary>
    /// Gets the product list.
    /// </summary>
    /// <returns></returns>
    public object GetProductList()
    {
        IRepository<Product> productRep = EntityFactory.GetRepository<Product>();
        IQueryable qryableProduct = (IQueryable)productRep;
        IExpressionFactory expProduct = qryableProduct.GetExpressionFactory();
        Sage.Platform.Repository.ICriteria criteriaProduct = qryableProduct.CreateCriteria();

        if (_State.NameFilter != string.Empty)
        {
            SearchParameter enumCondition = (SearchParameter)_State.NameCond;
            criteriaProduct.Add(GetExpression(expProduct, enumCondition, "Name", _State.NameFilter));
        }

        if (_State.DescFilter != string.Empty)
        {
            SearchParameter enumCondition = (SearchParameter)_State.DescCond;
            criteriaProduct.Add(GetExpression(expProduct, enumCondition, "Description", _State.DescFilter));
        }

        if (_State.SKUFilter != string.Empty)
        {
            SearchParameter enumCondition = (SearchParameter)_State.SKUCond;
            criteriaProduct.Add(GetExpression(expProduct, enumCondition, "ActualId", _State.SKUFilter));
        }

        if (_State.FamilyFilter != string.Empty)
        {
            SearchParameter enumCondition = SearchParameter.EqualTo;
            criteriaProduct.Add(GetExpression(expProduct, enumCondition, "Family", _State.FamilyFilter));
        }

        if (_State.StatusFilter != string.Empty)
        {
            SearchParameter enumCondition = SearchParameter.EqualTo;
            criteriaProduct.Add(GetExpression(expProduct, enumCondition, "Status", _State.StatusFilter));
        }

        if (chkPackage.Checked)
        {

        }

        List<Product> ProductList = criteriaProduct.List<Product>() as List<Product>;
        return ProductList;
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

    protected void grdProducts_RowDataBound(object sender, GridViewRowEventArgs e)
    {
        string oppCurrencyCode;

        if (e.Row.RowType == DataControlRowType.DataRow)
        {
            // added for automation testing
            e.Row.Attributes.Add("id", string.Format("node_{0}", ((IProduct)((IOpportunityProduct)e.Row.DataItem).Product).Id));

            IUserOptionsService userOption = ApplicationContext.Current.Services.Get<IUserOptionsService>();
            if (userOption != null)
            {
                oppCurrencyCode = userOption.GetCommonOption("lveCurrency", "OpportunityDefaults");
                if (string.IsNullOrEmpty(oppCurrencyCode))
                {
                    oppCurrencyCode = "USD";
                }
                IExchangeRate rate = EntityFactory.GetById<IExchangeRate>(oppCurrencyCode);

                // Calculated Price
                Sage.SalesLogix.Web.Controls.Currency curr =
                    (Sage.SalesLogix.Web.Controls.Currency)e.Row.FindControl("curCalcPriceMC");
                if (curr != null)
                {
                    curr.ExchangeRate =  rate.Rate.GetValueOrDefault(1);
                    curr.CurrentCode = rate.Id.ToString();
                }

                //Extended Price
                Sage.SalesLogix.Web.Controls.Currency curExtPriceMC = (Sage.SalesLogix.Web.Controls.Currency)e.Row.FindControl("curExtPriceMC");
                if (curExtPriceMC != null)
                {
                    curExtPriceMC.ExchangeRate = rate.Rate.GetValueOrDefault(1);
                    curExtPriceMC.CurrentCode = rate.Id.ToString();
                }
            }
        }
    }

    #endregion

    #region ISmartPartInfoProvider Members

    public ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        Sage.Platform.WebPortal.SmartParts.ToolsSmartPartInfo tinfo = new Sage.Platform.WebPortal.SmartParts.ToolsSmartPartInfo();

        foreach (Control c in this.AddOpportunityProducts_RTools.Controls)
        {
            tinfo.RightTools.Add(c);
        }
        return tinfo;
    }

    protected void cmdOK_Click(object sender, EventArgs e)
    {
        StringBuilder xml = new StringBuilder("<xml xmlns:z='#RowsetSchema' xmlns:rs='urn:schemas-microsoft-com:rowset' xmlns:dt='uuid:C2F41010-65B3-11d1-A29F-00AA00C14882' xmlns:s='uuid:BDC6E3F0-6DA3-11d1-A2A3-00AA00C14882'>");
        xml.Append("<s:Schema id='RowsetSchema'>");
        xml.Append("<s:ElementType name='row' content='eltOnly' rs:updatable='true'>");
        xml.Append("<s:AttributeType name='SORT' rs:number='1' rs:write='true'>");
        xml.Append("<s:datatype dt:type='int' dt:maxLength='4' rs:precision='0'");
        xml.Append(" rs:fixedlength='true' rs:maybenull='false'/>");
        xml.Append("</s:AttributeType>");
        xml.Append("<s:AttributeType name='PRODUCTID' rs:number='2' rs:write='true'>");
        xml.Append("<s:datatype dt:type='string' rs:dbtype='str' dt:maxLength='12'");
        xml.Append(" rs:precision='0' rs:maybenull='false'/>");
        xml.Append("</s:AttributeType>");
        xml.Append("<s:AttributeType name='KEYFIELDID' rs:number='3' rs:write='true'>");
        xml.Append("<s:datatype dt:type='string' rs:dbtype='str' dt:maxLength='16'");
        xml.Append(" rs:precision='0' rs:maybenull='false'/>");
        xml.Append("</s:AttributeType>");
        xml.Append("<s:AttributeType name='PRODUCT' rs:number='4' rs:write='true'>");
        xml.Append("<s:datatype dt:type='string' rs:dbtype='str' dt:maxLength='64'");
        xml.Append(" rs:precision='0' rs:maybenull='false'/>");
        xml.Append("</s:AttributeType>");
        xml.Append("<s:AttributeType name='FAMILY' rs:number='5' rs:write='true'>");
        xml.Append("<s:datatype dt:type='string' rs:dbtype='str' dt:maxLength='64'");
        xml.Append(" rs:precision='0' rs:maybenull='false'/>");
        xml.Append("</s:AttributeType>");
        xml.Append("<s:AttributeType name='PRICELEVEL' rs:number='6' rs:write='true'>");
        xml.Append("<s:datatype dt:type='string' rs:dbtype='str' dt:maxLength='32'");
        xml.Append(" rs:precision='0' rs:maybenull='false'/>");
        xml.Append("</s:AttributeType>");
        xml.Append("<s:AttributeType name='PRICE' rs:number='7' rs:write='true'>");
        xml.Append("<s:datatype dt:type='number' rs:dbtype='currency' dt:maxLength='8'");
        xml.Append(" rs:precision='0' rs:fixedlength='true' rs:maybenull='false'/>");
        xml.Append("</s:AttributeType>");
        xml.Append("<s:AttributeType name='DISCOUNT' rs:number='8' rs:write='true'>");
        xml.Append(" <s:datatype dt:type='float' dt:maxLength='8' rs:precision='0'");
        xml.Append(" rs:fixedlength='true' rs:maybenull='false'/>");
        xml.Append("</s:AttributeType>");
        xml.Append("<s:AttributeType name='ADJPRICE' rs:number='9' rs:write='true'>");
        xml.Append(" <s:datatype dt:type='number' rs:dbtype='currency' dt:maxLength='8'");
        xml.Append(" rs:precision='0' rs:fixedlength='true' rs:maybenull='false'/>");
        xml.Append("</s:AttributeType>");
        xml.Append("<s:AttributeType name='PRICELOCAL' rs:number='10' rs:write='true'>");
        xml.Append(" <s:datatype dt:type='number' rs:dbtype='currency' dt:maxLength='8'");
        xml.Append(" rs:precision='0' rs:fixedlength='true' rs:maybenull='false'/>");
        xml.Append("</s:AttributeType>");
        xml.Append("<s:AttributeType name='QUANTITY' rs:number='11' rs:write='true'>");
        xml.Append(" <s:datatype dt:type='float' dt:maxLength='8' rs:precision='0'");
        xml.Append(" rs:fixedlength='true' rs:maybenull='false'/>");
        xml.Append("</s:AttributeType>");
        xml.Append("<s:AttributeType name='EXTENDED' rs:number='12' rs:write='true'>");
        xml.Append(" <s:datatype dt:type='number' rs:dbtype='currency' dt:maxLength='8'");
        xml.Append(" rs:precision='0' rs:fixedlength='true' rs:maybenull='false'/>");
        xml.Append("</s:AttributeType>");
        xml.Append("<s:AttributeType name='EXTENDEDLOCAL' rs:number='13'");
        xml.Append(" rs:write='true'>");
        xml.Append(" <s:datatype dt:type='number' rs:dbtype='currency' dt:maxLength='8'");
        xml.Append(" rs:precision='0' rs:fixedlength='true' rs:maybenull='false'/>");
        xml.Append("</s:AttributeType>");
        xml.Append("<s:extends type='rs:rowbase'/>");
        xml.Append("</s:ElementType>");
        xml.Append("</s:Schema>");
        xml.Append("<rs:data>");
        string rowstring = "<z:row SORT='{0}' PRODUCTID='{1}' KEYFIELDID='{11}' PRODUCT='{2}' FAMILY='{12}' PRICELEVEL='{3}' PRICE='{4}' DISCOUNT='{5}' ADJPRICE='{6}' PRICELOCAL='{7}' QUANTITY='{8}' EXTENDED='{9}' EXTENDEDLOCAL='{10}' />";
        foreach (IOpportunityProduct op in DefOppProdHelper.GetList())
            xml.AppendFormat(rowstring, op.Sort, op.Product.Id, op.Product.Name, op.Program, op.Price, op.Discount, op.CalculatedPrice, op.CalculatedPrice, op.Quantity, op.ExtendedPrice, op.ExtendedPrice, op.Id, op.Product.Family);
        xml.Append("</rs:data></xml>");
        _UserOptions.SetCommonOption("Products", "OpportunityDefaults", xml.ToString(), false);

        Sage.Platform.WebPortal.WebPortalPage wpPage = Page as Sage.Platform.WebPortal.WebPortalPage;
        IPanelRefreshService refresher = wpPage.PageWorkItem.Services.Get<IPanelRefreshService>();
        if (refresher != null)
        {
            refresher.RefreshAll();
        }
                




    }

    protected double checkDiscountVal(object value)
    {
        double discount;
        if (value == null)
        {
            discount = 0;
        }
        else
        {
            discount = (double)value;
        }
        return discount;
    }

    protected string checkFormat(object value)
    {
        string formatString;
        if (value == null)
        {
            formatString = "";
        }
        else
        {
            formatString = "{0:p}";
        }
        return formatString;
    }

    #endregion

    protected void dtsProducts_Updating(object sender, ObjectDataSourceMethodEventArgs e)
    {
        double discount = Convert.ToDouble(e.InputParameters["Discount"]);
        if (discount > 1)
            e.InputParameters["Discount"] = discount / 100;
    }
    protected void pklProductFamily_PickListValueChanged(object sender, EventArgs e)
    {
        string productId = ((HiddenField)grdProducts.Rows[grdProducts.EditIndex].FindControl("hidProductId")).Value;
        string program = ((Sage.SalesLogix.Web.Controls.PickList.PickListControl)grdProducts.Rows[grdProducts.EditIndex].FindControl("txtProgram")).PickListValue;

        IList<IOpportunityProduct> ListProducts = DefOppProdHelper.GetList();
        foreach (IOpportunityProduct op in ListProducts)
        {
            if (op.Product.Id.ToString() == productId)
            {
                op.Program = program;
                op.Product.Program = program;
                Sage.SalesLogix.Opportunity.Rules.CalcPriceFromProgramPrice(op);

                break;
            }
        }

        //grdProducts.DataBind();

    }
    protected void grdProducts_RowUpdating(object sender, GridViewUpdateEventArgs e)
    {
        if (e.NewValues["Discount"] != null && (Convert.ToDouble(e.NewValues["Discount"]) < 0 || Convert.ToDouble(e.NewValues["Discount"]) > 1))
        {
            e.Cancel = true;
            throw new ValidationException(GetLocalResourceObject("Validation_DiscountOutOfRange").ToString());

        }
    }

    #region IScriptControl Members

    public IEnumerable<ScriptDescriptor> GetScriptDescriptors()
    {
        yield break;
    }

    public IEnumerable<ScriptReference> GetScriptReferences()
    {
        yield return new ScriptReference("~/SmartParts/Options/DefaultOpportunityProduct.js");
    }

    #endregion
}

