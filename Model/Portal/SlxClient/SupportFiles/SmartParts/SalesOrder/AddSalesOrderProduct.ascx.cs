using System;
using System.Collections.Generic;
using System.Text;
using System.Web.UI;
using System.Web.UI.WebControls;
using Sage.Common.Syndication.Json;
using Sage.Entity.Interfaces;
using Sage.Platform;
using Sage.Platform.Application;
using Sage.Platform.Application.UI;
using Sage.Platform.WebPortal.Services;
using Sage.Platform.WebPortal.SmartParts;
using Sage.SalesLogix.BusinessRules;

public partial class SmartParts_AddSalesOrderProduct : EntityBoundSmartPartInfoProvider, IScriptControl
{

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
        public static ClientConfiguration From(SmartParts_AddSalesOrderProduct control)
        {
            ClientConfiguration configuration = new ClientConfiguration();
            configuration.ID = control.ID;
            configuration.ClientID = control.ClientID;
            configuration.SelectedNodesClientID = control.selectedNodes.ClientID;
            configuration.ProductTreeTitle = control.GetLocalResourceObject("lblAvailableProducts.Text") as string;
            return configuration;
        }
    }

    public class AddProductStateInfo
    {
        public bool Packages;
        public string NameFilter = string.Empty;
        public string DescFilter = string.Empty;
        public string FamilyFilter = string.Empty;
        public string StatusFilter = string.Empty;
        public string SKUFilter = string.Empty;
        public int NameCond;
        public int DescCond;
        public int SKUCond;
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

    private IContextService _Context;
    private AddProductStateInfo _State;
    private ClientConfiguration treeConfig;

    /// <summary>
    /// Gets the <see cref="T:Sage.Platform.Application.IEntityContextService"/> instance
    /// </summary>
    /// <value></value>
    [ServiceDependency]
    public new IEntityContextService EntityContext { set; get; }

    /// <summary>
    /// Gets the type of the entity.
    /// </summary>
    /// <value>The type of the entity.</value>
    public override Type EntityType
    {
        get { return typeof(ISalesOrder); }
    }

    /// <summary>
    /// Handles the Init event of the Page control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void Page_Init(object sender, EventArgs e)
    {
        grdProducts.Columns[6].Visible = BusinessRuleHelper.IsMultiCurrencyEnabled();

        _Context = ApplicationContext.Current.Services.Get<IContextService>();
        _State = _Context.GetContext("AddProductStateInfo") as AddProductStateInfo;
        if (_State == null) {_State = new AddProductStateInfo();}
    }

    private void LoadTreeConfig()
    {
        // we only want to run the script when the content is actually there
        if (treeConfig == null)
            treeConfig = ClientConfiguration.From(this);

        treeConfig.QueryState = BuildQueryFromState();
        
        btnAdd.Visible = true;

        // ToDo: Place this message elsewhere so that it can be displayed when the sdata returns 0
        lblEnterCriteriaMessage.Visible = false;
        
        StringBuilder script = new StringBuilder();
        script.AppendFormat("SmartParts.SalesOrder.AddSalesOrderProduct.create('{0}', {1})", ID,
                            JavaScriptConvert.SerializeObject(treeConfig));

        if (ScriptManager.GetCurrent(Page).IsInAsyncPostBack)
            ScriptManager.RegisterStartupScript(Page, typeof(Page), "add-salesorder-product-init",
                                                    script.ToString(), true);
    }

    private string BuildQueryFromState()
    {
        StringBuilder queryStringState = new StringBuilder();
        queryStringState.AppendFormat("&Packages={0}&NameFilter={1}&FamilyFilter={2}&NameCond={3}", 
            _State.Packages,_State.NameFilter,_State.FamilyFilter,_State.NameCond);
        queryStringState.AppendFormat("&StatusFilter={0}&SKUFilter={1}&SKUCond={2}",
            _State.StatusFilter,_State.SKUFilter,_State.SKUCond);
        
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
        ClientBindingMgr.RegisterDialogCancelButton(cmdCancel);

        if (Visible)
        {
            ISalesOrder salesOrder = BindingSource.Current as ISalesOrder;
          
            // required to register the .js file used in this page
            if (DesignMode == false)
                if (ScriptManager.GetCurrent(Page) != null)
                    ScriptManager.GetCurrent(Page).RegisterScriptControl(this);

            if (salesOrder != null)
            {
                dtsProducts.SelectParameters.Clear();
                string salesorderId = (salesOrder.Id == null) ? string.Empty : salesOrder.Id.ToString();
                dtsProducts.SelectParameters.Add("salesorderId", salesorderId);
                grdProducts.DataBind();
            }
        }

        if (chkPackage.Checked != _State.Packages)
            chkPackage_CheckedChanged(null, null);
    }


    /// <summary>
    /// Handles the Click event of the btnAdd control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void btnAdd_Click(object sender, EventArgs e)
    {
        List<string> selectedProductIDs = new List<string>(selectedNodes.Value.Split(','));
        ISalesOrder salesOrder = BindingSource.Current as ISalesOrder;

        foreach (string productID in selectedProductIDs)
        {
            IProduct product = EntityFactory.GetRepository<IProduct>().Get(productID);
            if (product != null)
            {
                ISalesOrderItem salesOrderItem = EntityFactory.Create<ISalesOrderItem>();
                salesOrderItem.Product = EntityFactory.GetRepository<IProduct>().Get(productID);
                salesOrderItem.ProductName = salesOrderItem.Product.Name;
                salesOrderItem.SalesOrder = salesOrder;
                salesOrderItem.Family = product.Family;

                bool isInList = false;
                if (salesOrder != null)
                {
                    foreach (ISalesOrderItem so in salesOrder.SalesOrderItems)
                    {
                        if (string.Compare(Convert.ToString(so.Product.Id), Convert.ToString(salesOrderItem.Product.Id)) == 0)
                        {
                            so.Quantity++;
                            isInList = true;
                            break;
                        }
                    }

                    if (!isInList)
                    {
                        salesOrderItem.Quantity = 1;
                        salesOrderItem.Discount = 0;

                        if (salesOrderItem.Product.ProductProgram.Count != 0)
                        {
                            foreach (IProductProgram prodProgram in salesOrderItem.Product.ProductProgram)
                            {
                                if (prodProgram.DefaultProgram == true)
                                {
                                    salesOrderItem.CalculatedPrice = prodProgram.Price;
                                    salesOrderItem.Program = prodProgram.Program;
                                    salesOrderItem.Price = (double?)prodProgram.Price;
                                }
                            }
                        }
                        else
                        {
                            salesOrderItem.CalculatedPrice = Convert.ToDecimal(salesOrderItem.Product.Price);
                            salesOrderItem.Price = (double?)salesOrderItem.Product.Price;
                        }

                        salesOrderItem.ExtendedPrice = (double?)(salesOrderItem.CalculatedPrice * Convert.ToDecimal(salesOrderItem.Quantity));
                        salesOrder.SalesOrderItems.Add(salesOrderItem);
                    }
                }
            }
        }
    }

    /// <summary>
    /// Override this method to add bindings to the currrently bound smart part
    /// </summary>
    protected override void OnAddEntityBindings()
    {
    }

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
        pklProductFamily.PickListValue = String.Empty;
        pklProductStatus.PickListValue = String.Empty;
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
            _State.FamilyFilter = pklProductFamily.PickListValue;

        if (chkStatus.Checked)
            _State.StatusFilter = pklProductStatus.PickListValue;
        _Context.SetContext("AddProductStateInfo", _State);

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

        chkSKU.Enabled = !chkPackage.Checked;
        chkFamily.Enabled = !chkPackage.Checked;
        chkStatus.Enabled = !chkPackage.Checked;
        txtSKU.Enabled = !chkPackage.Checked;
        ddlSKU.Enabled = !chkPackage.Checked;
        pklProductFamily.Enabled = !chkPackage.Checked;
        pklProductStatus.Enabled = !chkPackage.Checked;
        chkName.Text = chkPackage.Checked
                           ? GetLocalResourceObject("chkPackageName").ToString()
                           : GetLocalResourceObject("chkName").ToString();
    }

    #region ISmartPartInfoProvider Members

    public override ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        ToolsSmartPartInfo tinfo = new ToolsSmartPartInfo();

        foreach (Control c in AddSalesOrderProducts_RTools.Controls)
        {
            tinfo.RightTools.Add(c);
        }
        return tinfo;
    }

    #endregion

    protected void cmdOK_Click(object sender, EventArgs e)
    {
        if (BindingSource != null)
        {
            ISalesOrder salesOrder = BindingSource.Current as ISalesOrder;

            if (salesOrder != null)
                if ((salesOrder.PersistentState & Sage.Platform.Orm.Interfaces.PersistentState.New) <= 0)
                    salesOrder.Save();
        }
        DialogService.CloseEventHappened(sender, e);
        Refresh();
    }

    protected void cmdCancel_Click(object sender, EventArgs e)
    {
        DialogService.CloseEventHappened(sender, e);
    }

    protected static double checkDiscountVal(object value)
    {
        double discount;
        if (value == null)
            discount = 0;
        else
            discount = (double) value;
        return discount;
    }

    protected static string checkFormat(object value)
    {
        string formatString;
        if (value == null)
            formatString = String.Empty;
        else
            formatString = "{0:p}";
        return formatString;
    }

    protected void dtsProducts_Updating(object sender, ObjectDataSourceMethodEventArgs e)
    {
        double discount = Convert.ToDouble(e.InputParameters["Discount"]);
        if (discount > 1)
            e.InputParameters["Discount"] = discount / 100;
    }

    protected void pklProductProgram_PickListValueChanged(object sender, EventArgs e)
    {
        ISalesOrder salesOrder = BindingSource.Current as ISalesOrder;
        string productId = ((HiddenField)grdProducts.Rows[grdProducts.EditIndex].FindControl("hidProductId")).Value;
        string program = ((Sage.SalesLogix.Web.Controls.PickList.PickListControl)grdProducts.Rows[grdProducts.EditIndex].FindControl("pklProgram")).PickListValue;

        if (salesOrder != null)
            foreach (ISalesOrderItem item in salesOrder.SalesOrderItems)
            {
                if (item.Product.Id.ToString().Equals(productId))
                {
                    item.Program = program;
                    Sage.SalesLogix.SalesOrder.SalesOrderItem.CalcPriceFromProgramPrice(item);
                    break;
                }
            }
    }

    #region IScriptControl Members

    public IEnumerable<ScriptDescriptor> GetScriptDescriptors()
    {
        yield break;
    }

    public IEnumerable<ScriptReference> GetScriptReferences()
    {
        yield return new ScriptReference("~/SmartParts/SalesOrder/AddSalesOrderProduct.js");
    }

    #endregion
}