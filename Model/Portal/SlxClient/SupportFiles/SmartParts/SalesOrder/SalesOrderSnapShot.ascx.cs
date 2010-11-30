using System;
using System.Globalization;
using System.Web.UI;
using Sage.Entity.Interfaces;
using Sage.Platform.EntityBinding;
using Sage.Platform.WebPortal;
using Sage.Platform.WebPortal.Binding;
using Sage.Platform.WebPortal.Services;
using Sage.Platform.WebPortal.SmartParts;
using Sage.SalesLogix.BusinessRules;
using Sage.SalesLogix.Entities;
using Sage.Platform.Application;
using Sage.Platform;
using TimeZone=Sage.Platform.TimeZone;

public partial class SalesOrderSnapShot : EntityBoundSmartPartInfoProvider
{
    /// <summary>
    /// Gets the type of the entity.
    /// </summary>
    /// <value>The type of the entity.</value>
    public override Type EntityType
    {
        get { return typeof(ISalesOrder); }
    }

    /// <summary>
    /// Override this method to add bindings to the currrently bound smart partmail
    /// </summary>
    protected override void OnAddEntityBindings()
    {
        BindingSource.Bindings.Add(new WebEntityBinding("CurrencyCode", lueCurrencyCode, "LookupResultValue"));
        BindingSource.Bindings.Add(new WebEntityBinding("Freight", curShipping, "Text"));
        BindingSource.Bindings.Add(new WebEntityBinding("Freight", curMyShipping, "Text"));
        BindingSource.Bindings.Add(new WebEntityBinding("Freight", curBaseShipping, "Text"));
        BindingSource.Bindings.Add(new WebEntityBinding("OrderTotal", curSubTotal, "Text"));
        BindingSource.Bindings.Add(new WebEntityBinding("OrderTotal", curMySubTotal, "Text"));
        BindingSource.Bindings.Add(new WebEntityBinding("ExchangeRate", numExchangeRateValue, "Text"));
        BindingSource.Bindings.Add(new WebEntityBinding("ExchangeRateDate", dtpExchangeRateDate, "DateTimeValue", String.Empty, null));

        ClientContextService clientcontext = PageWorkItem.Services.Get<ClientContextService>();
        if (clientcontext != null)
        {
            if (clientcontext.CurrentContext.ContainsKey(EntityPage.CONST_PREVIOUSENTITYIDKEY))
            {
                foreach (IEntityBinding binding in BindingSource.Bindings)
                {
                    WebEntityBinding pBinding = binding as WebEntityBinding;
                    if (pBinding != null)
                        pBinding.IgnoreControlChanges = true;
                }
            }
        }
    }

    /// <summary>
    /// Sets the currency display values for the grid.
    /// </summary>
    private void SetDisplayValues()
    {
        ISalesOrder salesOrder = (ISalesOrder)BindingSource.Current;
        if (salesOrder != null)
        {
            bool closed = salesOrder.Status.Equals(GetLocalResourceObject("SalesOrder_Status_Closed"));
            lnkDiscount.Enabled = !closed;
            lnkShipping.Enabled = !closed;
            lnkTaxRate.Enabled = !closed;
            lueCurrencyCode.Enabled = !closed;

            double subTotal = (salesOrder.OrderTotal.HasValue ? salesOrder.OrderTotal.Value : 0);
            double taxRate = salesOrder.Tax.HasValue ? salesOrder.Tax.Value : 0;
            double tax = Sage.SalesLogix.SalesOrder.SalesOrder.GetSalesOrderTaxAmount(salesOrder);
            double discount = salesOrder.Discount.HasValue ? salesOrder.Discount.Value : 0;
            double grandTotal = Sage.SalesLogix.SalesOrder.SalesOrder.GetSalesOrderGrandTotal(salesOrder);

            if (BusinessRuleHelper.IsMultiCurrencyEnabled())
            {
                UpdateMultiCurrencyExchangeRate(salesOrder, salesOrder.ExchangeRate.GetValueOrDefault(1));
                SetControlsDisplay();
            }
            if (!salesOrder.OrderTotal.HasValue)
            {
                foreach (SalesOrderItem item in salesOrder.SalesOrderItems)
                {
                    if (item.Discount != null)
                        subTotal += item.Price.Value * (int)item.Quantity.Value * (1 - item.Discount.Value);
                    else
                        subTotal += item.Price.Value;
                }
                if (subTotal > 0 && !salesOrder.OrderTotal.Equals(subTotal))
                    salesOrder.OrderTotal = subTotal;
            }
            double discountAmount = subTotal * discount;

            curBaseSubTotal.Text = Convert.ToString(subTotal);
            curTax.Text = Convert.ToString(tax);
            curMyTax.Text = Convert.ToString(tax);
            curBaseTax.Text = Convert.ToString(tax);
            curDiscount.Text = Convert.ToString(discountAmount);
            curMyDiscount.Text = Convert.ToString(discountAmount);
            curBaseDiscount.Text = Convert.ToString(discountAmount);
            lnkDiscount.Text = discount > 0
                                   ? String.Format("{1} ({0:0.00%})", discount,
                                                   GetLocalResourceObject("lnkDiscount.Caption"))
                                   : GetLocalResourceObject("lnkDiscount.Caption").ToString();
            lnkTaxRate.Text = taxRate > 0
                                  ? String.Format("{1} ({0:0.00%})", taxRate, GetLocalResourceObject("lnkTax.Caption"))
                                  : GetLocalResourceObject("lnkTax.Caption").ToString();
            curTotal.FormattedText = Convert.ToString(grandTotal);
            curMyTotal.FormattedText = Convert.ToString(grandTotal);
            curBaseTotal.Text = Convert.ToString(grandTotal);
        }
    }

    /// <summary>
    /// Sets the controls to be displayed based on whether multi-currency is enabled.
    /// </summary>
    private void SetControlsDisplay()
    {
        tblDetails.Border = 1;
        tblDetails.Width = "100%";
        rowDetailsHeader.Visible = true;
        rowSOSubTotal.Visible = true;
        rowMyCurSubTotal.Visible = true;
        rowSODiscount.Visible = true;
        rowMyCurDiscount.Visible = true;
        rowSOShipping.Visible = true;
        rowMyCurShipping.Visible = true;
        rowSOTax.Visible = true;
        rowMyCurTax.Visible = true;
        rowSOTotal.Visible = true;
        rowMyCurTotal.Visible = true;
        tblMultiCurrency.Visible = true;
        rowSubTotal.Style.Add(HtmlTextWriterStyle.PaddingRight, "0px");
    }

    protected void Page_Load(object sender, EventArgs e)
    {
        ISalesOrder salesOrder = BindingSource.Current as ISalesOrder;
        if (salesOrder != null)
        {
            if (BusinessRuleHelper.IsMultiCurrencyEnabled())
                UpdateMultiCurrencyExchangeRate(salesOrder, salesOrder.ExchangeRate.GetValueOrDefault(1));
        }
    }

    /// <summary>
    /// Called when [form bound].
    /// </summary>
    protected override void OnFormBound()
    {
        if (ClientBindingMgr != null)
        {
            // register these with the ClientBindingMgr so they can do their thing without causing the dirty data warning message...
            ClientBindingMgr.RegisterBoundControl(lnkEmail);
        }
        ISalesOrder salesOrder = BindingSource.Current as ISalesOrder;
        if (salesOrder != null)
        {
            SetDisplayValues();
            double shipping = (salesOrder.Freight.HasValue ? salesOrder.Freight.Value : 0);
            if (String.IsNullOrEmpty(curBaseShipping.FormattedText))
                curBaseShipping.Text = Convert.ToString(shipping);
            if (String.IsNullOrEmpty(curShipping.FormattedText))
                curShipping.Text = Convert.ToString(shipping);
            if (String.IsNullOrEmpty(curMyShipping.FormattedText))
                curMyShipping.Text = Convert.ToString(shipping);
            if (FormHelper.GetSystemInfoOption("ChangeSalesOrderRate"))
            {
                divExchangeRateLabel.Visible = false;
                divExchangeRateText.Visible = true;
            }
            else
            {
                divExchangeRateLabel.Visible = true;
                divExchangeRateText.Visible = false;
                lblExchangeRateValue.Text = numExchangeRateValue.Text;
            }
        }
    }

    /// <summary>
    /// Handles the OnClick event of the ShowDetailsView control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void ShowDetailsView_OnClick(object sender, EventArgs e)
    {
        if (DialogService != null)
        {
            ISalesOrder salesOrder = BindingSource.Current as ISalesOrder;
            string caption = String.Format(GetLocalResourceObject("lblDetailsView.Caption").ToString(), salesOrder.SalesOrderNumber);
            DialogService.SetSpecs(300, 450, 300, 410, "EditSalesOrderDetail", caption, true);
            DialogService.EntityID = salesOrder.Id.ToString();
            DialogService.ShowDialog();
        }
    }

    /// <summary>
    /// Handles the OnChange event of the CurrencyCode control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void CurrencyCode_OnChange(object sender, EventArgs e)
    {
        ISalesOrder salesOrder = BindingSource.Current as ISalesOrder;
        if (salesOrder != null)
        {
            IExchangeRate exchangeRate = EntityFactory.GetById<IExchangeRate>(lueCurrencyCode.LookupResultValue);
            if (exchangeRate != null)
            {
                Double rate = exchangeRate.Rate.GetValueOrDefault(1);
                salesOrder.ExchangeRate = rate;
                salesOrder.ExchangeRateDate = DateTime.UtcNow;
                salesOrder.CurrencyCode = lueCurrencyCode.LookupResultValue.ToString();
                UpdateMultiCurrencyExchangeRate(salesOrder, rate);
            }
        }
    }

    /// <summary>
    /// Handles the OnChange event of the ExchangeRate control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void ExchangeRate_OnChange(object sender, EventArgs e)
    {
        ISalesOrder salesOrder = BindingSource.Current as ISalesOrder;
        if (salesOrder != null)
        {
            salesOrder.ExchangeRate = Convert.ToDouble(String.IsNullOrEmpty(numExchangeRateValue.Text) ? "1" : numExchangeRateValue.Text);
            salesOrder.ExchangeRateDate = DateTime.UtcNow;
            UpdateMultiCurrencyExchangeRate(salesOrder, salesOrder.ExchangeRate.Value);
        }
    }

    /// <summary>
    /// Updates controls which are set to use multi currency.
    /// </summary>
    /// <param name="salesOrder">The sales order.</param>
    /// <param name="exchangeRate">The exchange rate.</param>
    private void UpdateMultiCurrencyExchangeRate(ISalesOrder salesOrder, Double exchangeRate)
    {
        string myCurrencyCode = BusinessRuleHelper.GetMyCurrencyCode();
        IExchangeRate myExchangeRate =
            EntityFactory.GetById<IExchangeRate>(String.IsNullOrEmpty(myCurrencyCode) ? "USD" : myCurrencyCode);
        double myRate = 0;
        if (myExchangeRate != null)
            myRate = myExchangeRate.Rate.GetValueOrDefault(1);
        curDiscount.CurrentCode = salesOrder.CurrencyCode;
        curDiscount.ExchangeRate = exchangeRate;
        curMyDiscount.CurrentCode = myCurrencyCode;
        curMyDiscount.ExchangeRate = myRate;
        curSubTotal.CurrentCode = String.IsNullOrEmpty(lueCurrencyCode.LookupResultValue.ToString())
                              ? salesOrder.CurrencyCode
                              : lueCurrencyCode.LookupResultValue.ToString();
        curTotal.CurrentCode = curSubTotal.CurrentCode;
        curTotal.ExchangeRate = exchangeRate;
        curMyTotal.CurrentCode = myCurrencyCode;
        curMyTotal.ExchangeRate = myRate;
        curSubTotal.CurrentCode = salesOrder.CurrencyCode;
        curSubTotal.ExchangeRate = exchangeRate;
        curMySubTotal.CurrentCode = myCurrencyCode;
        curMySubTotal.ExchangeRate = myRate;
        curTax.CurrentCode = salesOrder.CurrencyCode;
        curTax.ExchangeRate = exchangeRate;
        curMyTax.CurrentCode = myCurrencyCode;
        curMyTax.ExchangeRate = myRate;
        curShipping.CurrentCode = salesOrder.CurrencyCode;
        curShipping.ExchangeRate = exchangeRate;
        curMyShipping.CurrentCode = myCurrencyCode;
        curMyShipping.ExchangeRate = myRate;
    }

    /// <summary>
    /// Sends the email.
    /// </summary>
    /// <param name="sender">The sender.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void SendEmail(object sender, EventArgs e)
    {
        try
        {
            ISalesOrder salesOrder = BindingSource.Current as ISalesOrder;
            if (salesOrder != null)
            {
                string emailTo = String.Empty;
                string emailCC = String.Empty;
                if (salesOrder.RequestedBy != null)
                    if (!salesOrder.RequestedBy.Equals(salesOrder.ShippingContact) || !salesOrder.RequestedBy.Equals(salesOrder.BillingContact))
                        emailCC = salesOrder.RequestedBy.Email;
                if (salesOrder.ShippingContact != null)
                    emailTo = String.Format("{0};", salesOrder.ShippingContact.Email);
                if (!salesOrder.BillingContact.Equals(salesOrder.ShippingContact))
                    emailTo += salesOrder.BillingContact.Email;
                string subject = PortalUtil.JavaScriptEncode(
                    String.Format(GetLocalResourceObject("lblEmailSubject.Caption").ToString(),
                                  salesOrder.SalesOrderNumber, salesOrder.Account.AccountName)).Replace(
                    Environment.NewLine, "%0A");
                string emailBody = FormatEmailBody(salesOrder).Replace(Environment.NewLine, "%0A");
                if (!String.IsNullOrEmpty(emailCC))
                    ScriptManager.RegisterStartupScript(this, GetType(), "emailscript",
                                                        string.Format(
                                                            "<script type='text/javascript'>window.location.href='mailto:{0}?cc={1}&subject={2}&body={3}';</script>",
                                                            emailTo, emailCC, subject, emailBody), false);
                else
                    ScriptManager.RegisterStartupScript(this, GetType(), "emailscript",
                                                        string.Format(
                                                            "<script type='text/javascript'>window.location.href='mailto:{0}?subject={1}&body={2}';</script>",
                                                            emailTo, subject, emailBody), false);
            }
        }
        catch (Exception ex)
        {
            log.Error(ex.Message);
        }
    }

    /// <summary>
    /// Checks for null value.
    /// </summary>
    /// <param name="value">The value.</param>
    /// <returns></returns>
    private string CheckForNullValue(object value)
    {
        string outValue = String.Format(GetLocalResourceObject("lblNone.Caption").ToString());

        if (value != null)
        {
            if (value.ToString().Length > 0)
                outValue = value.ToString();
        }

        return outValue;
    }

    /// <summary>
    /// Formats the email body.
    /// </summary>
    /// <param name="salesOrder">The sales order.</param>
    /// <returns></returns>
    private string FormatEmailBody(ISalesOrder salesOrder)
    {
        IContextService context = ApplicationContext.Current.Services.Get<IContextService>(true);
        TimeZone timeZone = (TimeZone) context.GetContext("TimeZone");
        bool isMultiCurr = BusinessRuleHelper.IsMultiCurrencyEnabled();
        string datePattern = CultureInfo.CurrentCulture.DateTimeFormat.ShortDatePattern;

        string products = String.Empty;
        string emailBody = String.Format("{0} %0A", GetLocalResourceObject("lblEmailInfo.Caption"));
        emailBody += String.Format("{0} {1} %0A", GetLocalResourceObject("lblEmailAccount.Caption"),
                                   CheckForNullValue(salesOrder.Account.AccountName));
        emailBody += String.Format("{0} {1} %0A", GetLocalResourceObject("lblEmailOpportunity.Caption"),
                                   CheckForNullValue(salesOrder.Opportunity != null
                                                         ? salesOrder.Opportunity.Description
                                                         : String.Empty));
        emailBody += String.Format("{0} {1} %0A", GetLocalResourceObject("lblEmailDateCreated.Caption"),
                                   timeZone.UTCDateTimeToLocalTime((DateTime) salesOrder.CreateDate).ToString(datePattern));
        emailBody += String.Format("{0} {1} %0A", GetLocalResourceObject("lblEmailDateRequested.Caption"),
                                   salesOrder.OrderDate.HasValue
                                       ? timeZone.UTCDateTimeToLocalTime((DateTime) salesOrder.OrderDate).ToString(
                                             datePattern)
                                       : String.Empty);
        emailBody += String.Format("{0} {1} %0A", GetLocalResourceObject("lblEmailDatePromised.Caption"),
                                   salesOrder.DatePromised.HasValue
                                       ? timeZone.UTCDateTimeToLocalTime((DateTime) salesOrder.DatePromised).ToString(
                                             datePattern)
                                       : String.Empty);
        emailBody += String.Format("{0} {1} %0A", GetLocalResourceObject("lblEmailSalesOrderId.Caption"),
                                   salesOrder.SalesOrderNumber);
        emailBody += String.Format("{0} {1} %0A", GetLocalResourceObject("lblEmailType.Caption"),
                                   CheckForNullValue(salesOrder.OrderType));
        emailBody += String.Format("{0} {1} %0A%0A", GetLocalResourceObject("lblEmailStatus.Caption"),
                                   CheckForNullValue(salesOrder.Status));
        emailBody += String.Format("{0} {1} %0A%0A", GetLocalResourceObject("lblEmailComments.Caption"),
                                   CheckForNullValue(salesOrder.Comments));
        emailBody += String.Format("{0} %0A", GetLocalResourceObject("lblEmailValue.Caption"));
        curBaseTotal.Text = salesOrder.GrandTotal.ToString();
        emailBody += String.Format("{0} %0A", String.Format(GetLocalResourceObject("lblEmailBaseGrandTotal.Caption").ToString(),
                           curBaseTotal.FormattedText));
        if (isMultiCurr)
        {
            curTotal.CurrentCode = salesOrder.CurrencyCode;
            curTotal.Text = salesOrder.GrandTotal.ToString();
            emailBody += String.Format("{0} %0A", String.Format(GetLocalResourceObject("lblEmailSalesOrderGrandTotal.Caption").ToString(),
                                       curTotal.FormattedText));
            emailBody += String.Format("{0} {1} %0A", GetLocalResourceObject("lblEmailCurrencyCode.Caption"),
                                       CheckForNullValue(salesOrder.CurrencyCode));
            emailBody += String.Format("{0} {1} %0A", GetLocalResourceObject("lblEmailExchangeRate.Caption"),
                                       CheckForNullValue(salesOrder.ExchangeRate));
            if (salesOrder.ExchangeRateDate.HasValue)
                emailBody += String.Format("{0} {1} %0A", GetLocalResourceObject("lblEmailExchangeRateDate.Caption"),
                                           timeZone.UTCDateTimeToLocalTime((DateTime)salesOrder.ExchangeRateDate).
                                               ToString(datePattern));
            else
                emailBody += String.Format("{0} {1} %0A", GetLocalResourceObject("lblEmailExchangeRateDate.Caption"),
                                           GetLocalResourceObject("lblNone.Caption"));
        }

        emailBody += String.Format("%0A{0} %0A", GetLocalResourceObject("lblEmailProducts.Caption"));
        foreach (ISalesOrderItem item in salesOrder.SalesOrderItems)
            products += String.Format("{0} ({1}); ", item.Product, item.Quantity);
        emailBody += String.Format("{0} %0A", CheckForNullValue(products));
        emailBody += String.Format("%0A{0} %0A", GetLocalResourceObject("lblEmailBillShipAddress.Caption"));
        emailBody += String.Format("{0} %0A", GetLocalResourceObject("lblEmailBillingAddress.Caption"));
        emailBody += String.Format("{0} {1} %0A",
                                   GetLocalResourceObject("lblEmailBillingAddressName.Caption"),
                                   salesOrder.BillingContact.NamePFL);
        emailBody += salesOrder.BillingAddress.FormatFullSalesOrderAddress().Replace("\r\n", "%0A");

        emailBody += String.Format("%0A %0A{0} %0A", GetLocalResourceObject("lblEmailShippingAddress.Caption"));
        emailBody += String.Format("{0} {1} %0A",
                           GetLocalResourceObject("lblEmailShippingAddressName.Caption"),
                           salesOrder.ShippingContact.NamePFL);
        emailBody += salesOrder.ShippingAddress.FormatFullSalesOrderAddress().Replace("\r\n", "%0A");
        return PortalUtil.JavaScriptEncode(emailBody.Replace("+", "%20"));
    }
}