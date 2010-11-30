using System;
using System.Globalization;
using System.Web.UI;
using Sage.Entity.Interfaces;
using Sage.Platform;
using Sage.Platform.Application;
using Sage.Platform.EntityBinding;
using Sage.Platform.Repository;
using Sage.Platform.WebPortal;
using Sage.Platform.WebPortal.Binding;
using Sage.Platform.WebPortal.Services;
using Sage.Platform.WebPortal.SmartParts;
using Sage.SalesLogix.BusinessRules;
using TimeZone=Sage.Platform.TimeZone;

public partial class SmartParts_OpportunitySnapShot : EntityBoundSmartPartInfoProvider
{

    /// <summary>
    /// Gets the type of the entity.
    /// </summary>
    /// <value>The type of the entity.</value>
    public override Type EntityType
    {
        get { return typeof(IOpportunity); }
    }

    /// <summary>
    /// Override this method to add bindings to the currrently bound smart part
    /// </summary>
    protected override void OnAddEntityBindings()
    {
        BindingSource.Bindings.Add(new WebEntityBinding("ExchangeRateCode", lueCurrencyCode, "LookupResultValue", String.Empty, null));
        BindingSource.Bindings.Add(new WebEntityBinding("Weighted", curBaseWeighted, "Text"));
        BindingSource.Bindings.Add(new WebEntityBinding("Weighted", curWeighted, "Text"));
        BindingSource.Bindings.Add(new WebEntityBinding("Weighted", curMyCurWeighted, "Text"));
        BindingSource.Bindings.Add(new WebEntityBinding("ExchangeRate", numExchangeRateValue, "Text"));
        BindingSource.Bindings.Add(new WebEntityBinding("ExchangeRateDate", dtpExchangeRateDate, "DateTimeValue", String.Empty, null));
        BindingSource.Bindings.Add(new WebEntityBinding("Type", pklType, "PickListValue"));
        BindingSource.Bindings.Add(new WebEntityBinding("LeadSource", lueLeadSourceOpen, "LookupResultValue"));
        BindingSource.Bindings.Add(new WebEntityBinding("ExchangeRateLocked", chkLockRate, "Checked"));

        //Open Opportunity
        BindingSource.Bindings.Add(new WebEntityBinding("SalesPotential", curOpenBaseSalesPotential, "Text"));
        BindingSource.Bindings.Add(new WebEntityBinding("SalesPotential", curOpenSalesPotential, "Text"));
        BindingSource.Bindings.Add(new WebEntityBinding("SalesPotential", curMyCurSalesPotential, "Text"));
        BindingSource.Bindings.Add(new WebEntityBinding("DateOpened", dtpDateOpened, "DateTimeValue", String.Empty, null));

        //Closed Won Opportunity
        BindingSource.Bindings.Add(new WebEntityBinding("ActualAmount", curActualWon, "Text"));
        BindingSource.Bindings.Add(new WebEntityBinding("ActualAmount", curMyCurActualWon, "Text"));
        BindingSource.Bindings.Add(new WebEntityBinding("ActualAmount", curBaseActualWon, "Text"));
        BindingSource.Bindings.Add(new WebEntityBinding("ActualClose", dtpClosedWonSummary, "DateTimeValue", String.Empty, null));
        BindingSource.Bindings.Add(new WebEntityBinding("Reason", pklReasonWon, "PickListValue"));

        //Closed Lost Opportunity
        BindingSource.Bindings.Add(new WebEntityBinding("ActualAmount", curPotentialLost, "Text"));
        BindingSource.Bindings.Add(new WebEntityBinding("ActualAmount", curMyCurPotentialLost, "Text"));
        BindingSource.Bindings.Add(new WebEntityBinding("ActualAmount", curBasePotentialLost, "Text"));
        BindingSource.Bindings.Add(new WebEntityBinding("ActualClose", dtpClosedLostSummary, "DateTimeValue", String.Empty, null));
        BindingSource.Bindings.Add(new WebEntityBinding("Reason", pklReasonLost, "PickListValue"));

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
    /// Handles the Load event of the Page control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void Page_Load(object sender, EventArgs e)
    {
        SetMultiCurrencyDisplay();
    }

    private void SetMultiCurrencyDisplay()
    {
        IOpportunity opportunity = BindingSource.Current as IOpportunity;
        if (opportunity != null)
        {
            if (BusinessRuleHelper.IsMultiCurrencyEnabled())
            {
                tblDetails.Border = 1;
                tblDetails.Width = "100%";
                UpdateMultiCurrencyExchangeRate(opportunity, opportunity.ExchangeRate.GetValueOrDefault(1));
                tblMultiCurrency.Visible = true;
                rowDetailsHeader.Visible = true;
                colOppSalesPotential.Visible = true;
                colMyCurSalesPotential.Visible = true;
                colOppActualWon.Visible = true;
                colMyCurActualWon.Visible = true;
                colOppPotentialLost.Visible = true;
                colMyCurPotentialLost.Visible = true;
                colOppWeighted.Visible = true;
                colMyCurWeighted.Visible = true;
                colActualWon.Style.Add(HtmlTextWriterStyle.PaddingRight, "0px");
                colOpenSalesPotential.Style.Add(HtmlTextWriterStyle.PaddingRight, "0px");
                colPotentialLost.Style.Add(HtmlTextWriterStyle.PaddingRight, "0px");
            }
            if (opportunity.Status.Equals(GetLocalResourceObject("Status_Open").ToString()))
            {
                rowOpenSalesPotential.Visible = true;
                rowOpenSummary.Visible = true;
                rowWeighted.Visible = true;
                rowPotentialLost.Visible = false;
                rowActualWon.Visible = false;
                rowClosedWon.Visible = false;
                rowClosedLost.Visible = false;
                rowReasonWon.Visible = false;
                rowReasonLost.Visible = false;
                rowCompetitors.Visible = false;
                lblSummary.Text = String.Format(GetLocalResourceObject("lblSummary.Caption").ToString(),
                                                opportunity.DaysOpen);
                lblSummaryActivity.Text = String.Format(GetLocalResourceObject("lblSummaryActivity.Caption").ToString(),
                                                        opportunity.DaysSinceLastActivity);
            }
            else if (opportunity.Status.Equals(GetLocalResourceObject("Status_ClosedWon").ToString()))
            {
                rowActualWon.Visible = true;
                rowReasonWon.Visible = true;
                rowCompetitors.Visible = true;
                rowOpenSalesPotential.Visible = true;
                rowPotentialLost.Visible = false;
                rowOpenSummary.Visible = false;
                rowClosedLost.Visible = false;
                rowReasonLost.Visible = false;
                rowWeighted.Visible = false;
                lblDaysOpen.Text = String.Format(GetLocalResourceObject("lblDaysOpen.Caption").ToString(),
                                                 opportunity.DaysOpen);
                lblCompetitors.Text = String.Format(GetLocalResourceObject("lblCompetitorsReplaced.Caption").ToString(),
                                                    GetOpportunityCompetitors());
            }
            else if (opportunity.Status.Equals(GetLocalResourceObject("Status_ClosedLost").ToString()))
            {
                rowPotentialLost.Visible = true;
                rowClosedLost.Visible = true;
                rowReasonLost.Visible = true;
                rowCompetitors.Visible = true;
                rowOpenSalesPotential.Visible = true;
                rowActualWon.Visible = false;
                rowOpenSummary.Visible = false;
                rowClosedWon.Visible = false;
                rowReasonWon.Visible = false;
                rowWeighted.Visible = false;
                lblLostDaysOpen.Text = String.Format(GetLocalResourceObject("lblDaysOpen.Caption").ToString(),
                                                     opportunity.DaysOpen);
                lblCompetitors.Text = String.Format(GetLocalResourceObject("lblCompetitors.Caption").ToString(),
                                                    GetOpportunityCompetitors());
            }
            if (ShowSalesProcessInfo(opportunity))
            {
                rowSalesProcess.Visible = true;
                lblSalesProcess.Text = String.Format(GetLocalResourceObject("lblSalesProcess.Caption").ToString(),
                                                     opportunity.Stage);
            }
            else
                rowSalesProcess.Visible = false;
        }
    }

    /// <summary>
    /// Called when [form bound].
    /// </summary>
    protected override void OnFormBound()
    {
        chkLockRate.Enabled = FormHelper.GetSystemInfoOption("LockOpportunityRate");
        if (FormHelper.GetSystemInfoOption("ChangeOpportunityRate"))
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

    /// <summary>
    /// Gets the opportunity competitors.
    /// </summary>
    /// <returns></returns>
    private string GetOpportunityCompetitors()
    {
        IOpportunity opportunity = BindingSource.Current as IOpportunity;
        string competitors = String.Empty;
        if (opportunity.Competitors != null)
        {
            string oppCompetitors = String.Empty;
            foreach (IOpportunityCompetitor oppCompetitor in opportunity.Competitors)
            {
                oppCompetitors += oppCompetitor + "; ";
                if (oppCompetitor.LostReplaced != null && Convert.ToBoolean(oppCompetitor.LostReplaced.Value))
                    competitors += oppCompetitor + "; ";
            }
        }
        return String.IsNullOrEmpty(competitors) ? String.Format(GetLocalResourceObject("lblNone.Caption").ToString()) :
            competitors.Substring(0, competitors.Length - 2);
    }

    /// <summary>
    /// Called when [click actual amount].
    /// </summary>
    /// <param name="sender">The sender.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void OnClickActualAmount(object sender, EventArgs e)
    {
        if (DialogService != null)
        {
            IOpportunity entity = BindingSource.Current as IOpportunity;
            if ((entity != null) && (entity.Status.Equals(GetLocalResourceObject("Status_ClosedWon").ToString())))
                DialogService.SetSpecs(200, 200, 400, 600, "OpportunityClosedWon", "", true);
            else
                DialogService.SetSpecs(200, 200, 400, 600, "OpportunityClosedLost", "", true);
            DialogService.ShowDialog();
        }
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
            IOpportunity opportunity = BindingSource.Current as IOpportunity;
            if (opportunity != null)
            {
                string emailTo = String.Empty;
                string subject = PortalUtil.JavaScriptEncode(
                    String.Format(GetLocalResourceObject("lblEmailSubject.Caption").ToString(),
                                  opportunity.Description, opportunity.Account.AccountName)).Replace(
                    Environment.NewLine, "%0A");
                string emailBody = FormatEmailBody(opportunity).Replace(Environment.NewLine, "%0A");
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
    /// <param name="opportunity">The opportunity.</param>
    /// <returns></returns>
    private string FormatEmailBody(IOpportunity opportunity)
    {
        IContextService context = ApplicationContext.Current.Services.Get<IContextService>(true);
        TimeZone timeZone = (TimeZone) context.GetContext("TimeZone");
        string datePattern = CultureInfo.CurrentCulture.DateTimeFormat.ShortDatePattern;

        string oppProducts = String.Empty;
        bool oppWon = opportunity.Status.Equals(GetLocalResourceObject("Status_ClosedWon").ToString());
        bool oppLost = opportunity.Status.Equals(GetLocalResourceObject("Status_ClosedLost").ToString());
        string emailBody = String.Format("{0} %0A", GetLocalResourceObject("lblEmailInfo.Caption"));
        emailBody += String.Format("{0} {1} %0A", GetLocalResourceObject("lblEmailOppDesc.Caption"),
                                   CheckForNullValue(opportunity.Description));
        emailBody += String.Format("{0} {1} %0A", GetLocalResourceObject("lblEmailOppAccount.Caption"),
                                   CheckForNullValue(opportunity.Account != null
                                                         ? opportunity.Account.AccountName
                                                         : String.Empty));
        emailBody += String.Format("{0} {1} %0A", GetLocalResourceObject("EmailOppAcctMgr.Caption"),
                                   CheckForNullValue(opportunity.AccountManager));
        emailBody += String.Format("{0} {1} %0A", GetLocalResourceObject("EmailOppReseller.Caption"),
                                   CheckForNullValue(opportunity.Reseller));
        emailBody += String.Format("{0} {1} %0A", GetLocalResourceObject("EmailOppEstClose.Caption"),
                                   opportunity.EstimatedClose.HasValue
                                       ? timeZone.UTCDateTimeToLocalTime((DateTime) opportunity.EstimatedClose).ToString(
                                             datePattern)
                                       : String.Empty);
        emailBody += String.Format("{0} {1} %0A", GetLocalResourceObject("EmailOppCloseProb.Caption"),
                                   CheckForNullValue(opportunity.CloseProbability));
        emailBody += String.Format("{0} {1} %0A%0A", GetLocalResourceObject("EmailOppComments.Caption"),
                                   CheckForNullValue(opportunity.Notes));
        emailBody += String.Format("{0} %0A", GetLocalResourceObject("EmailOppValue.Caption"));
        emailBody += String.Format("{0} {1} %0A", GetLocalResourceObject("EmailOppPotential.Caption"),
                                   curOpenBaseSalesPotential.FormattedText);
        emailBody += String.Format("{0} {1} %0A%0A", GetLocalResourceObject("EmailOppWeighted.Caption"),
                                   curBaseWeighted.FormattedText);
        emailBody += String.Format("{0} %0A", GetLocalResourceObject("EmailOppSummary.Caption"));
        if (oppWon || oppLost)
        {
            emailBody += String.Format("{0} %0A",
                                       String.Format(
                                           GetLocalResourceObject("EmailOppWonLostSummary.Caption").ToString(),
                                           dtpClosedWonSummary.Text,
                                           Convert.ToString(opportunity.DaysOpen)));
            if (oppWon)
                emailBody += String.Format("{0} %0A",
                                           String.Format(GetLocalResourceObject("EmailOppReasonWon.Caption").ToString(),
                                                         CheckForNullValue(opportunity.Reason)));
            else
                emailBody += String.Format("{0} %0A",
                                           String.Format(
                                               GetLocalResourceObject("EmailOppReasonLost.Caption").ToString(),
                                               CheckForNullValue(opportunity.Reason)));
        }
        else
        {
            emailBody += String.Format("{0} %0A",
                                       String.Format(GetLocalResourceObject("EmailOppStageSummary.Caption").ToString(),
                                                     CheckForNullValue(opportunity.Stage)));
        }
        emailBody += String.Format("{0} %0A%0A",
                                   String.Format(GetLocalResourceObject("lblEmailOppType.Caption").ToString(),
                                                 CheckForNullValue(opportunity.Type)));

        emailBody += String.Format("{0} %0A", GetLocalResourceObject("EmailOppProducts.Caption"));

        foreach (IOpportunityProduct oppProduct in opportunity.Products)
            oppProducts += String.Format("{0} ({1}); ", oppProduct.Product, oppProduct.Quantity);

        if (!string.IsNullOrEmpty(oppProducts))
            emailBody += String.Format("{0} %0A%0A", CheckForNullValue(oppProducts.Substring(0, oppProducts.Length - 2)));

        if (oppWon || oppLost)
            emailBody += String.Format("{0} %0A{1} %0A%0A", GetLocalResourceObject("EmailOppCompetitors.Caption"),
                                       GetOpportunityCompetitors());

        emailBody += String.Format("{0} %0A", GetLocalResourceObject("EmailOppContacts.Caption"));
        foreach (IOpportunityContact oppContact in opportunity.Contacts)
            emailBody += String.Format("{0} %0A",
                                       String.Format("{0}, {1}; {2}", oppContact.Contact.Name,
                                                     oppContact.Contact.Title, oppContact.SalesRole));
        return PortalUtil.JavaScriptEncode(emailBody.Replace("+", "%20"));
    }

    /// <summary>
    /// Shows the sales process info.
    /// </summary>
    /// <param name="opportunity">The opportunity.</param>
    /// <returns></returns>
    private bool ShowSalesProcessInfo(IOpportunity opportunity)
    {
        bool result = false;
        if ((opportunity.Status.Equals(GetLocalResourceObject("Status_Open").ToString())) || (opportunity.Status.Equals(GetLocalResourceObject("Status_Inactive").ToString())))
        {
            IRepository<ISalesProcesses> rep = EntityFactory.GetRepository<ISalesProcesses>();
            IQueryable qry = (IQueryable)rep;
            IExpressionFactory ep = qry.GetExpressionFactory();
            ICriteria crit = qry.CreateCriteria();
            crit.Add(ep.Eq("EntityId", opportunity.Id.ToString()));
            IProjection proj = qry.GetProjectionsFactory().Count("Id");
            crit.SetProjection(proj);
            int count = (int)crit.UniqueResult();
            result = (count > 0);
        }
        return result;
    }

    /// <summary>
    /// Handles the OnChange event of the CurrencyCode control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void CurrencyCode_OnChange(object sender, EventArgs e)
    {
        IOpportunity opportunity = BindingSource.Current as IOpportunity;
        if (opportunity != null)
        {
            IExchangeRate exchangeRate = EntityFactory.GetById<IExchangeRate>(lueCurrencyCode.LookupResultValue);
            if (exchangeRate != null)
            {
                Double rate = exchangeRate.Rate.GetValueOrDefault(1);
                opportunity.ExchangeRate = rate;
                opportunity.ExchangeRateDate = DateTime.UtcNow;
                opportunity.ExchangeRateCode = lueCurrencyCode.LookupResultValue.ToString();
                UpdateMultiCurrencyExchangeRate(opportunity, rate);
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
        IOpportunity opportunity = BindingSource.Current as IOpportunity;
        if (opportunity != null)
        {
            opportunity.ExchangeRate = Convert.ToDouble(String.IsNullOrEmpty(numExchangeRateValue.Text) ? "1" : numExchangeRateValue.Text);
            opportunity.ExchangeRateDate = DateTime.UtcNow;
            UpdateMultiCurrencyExchangeRate(opportunity, opportunity.ExchangeRate.Value);
        }
    }

    /// <summary>
    /// Updates controls which are set to use multi currency.
    /// </summary>
    /// <param name="opportunity">The opportunity.</param>
    /// <param name="exchangeRate">The exchange rate.</param>
    private void UpdateMultiCurrencyExchangeRate(IOpportunity opportunity, Double exchangeRate)
    {
        string myCurrencyCode = BusinessRuleHelper.GetMyCurrencyCode();
        IExchangeRate myExchangeRate =
            EntityFactory.GetById<IExchangeRate>(String.IsNullOrEmpty(myCurrencyCode) ? "USD" : myCurrencyCode);
        double myRate = 0;
        if (myExchangeRate != null)
            myRate = myExchangeRate.Rate.GetValueOrDefault(1);
        string currentCode = opportunity.ExchangeRateCode;
        curOpenSalesPotential.CurrentCode = currentCode;
        curOpenSalesPotential.ExchangeRate = exchangeRate;
        curMyCurSalesPotential.CurrentCode = myCurrencyCode;
        curMyCurSalesPotential.ExchangeRate = myRate;
        curActualWon.CurrentCode = currentCode;
        curActualWon.ExchangeRate = exchangeRate;
        curMyCurActualWon.CurrentCode = myCurrencyCode;
        curMyCurActualWon.ExchangeRate = myRate;
        curPotentialLost.CurrentCode = currentCode;
        curPotentialLost.ExchangeRate = exchangeRate;
        curMyCurPotentialLost.CurrentCode = myCurrencyCode;
        curMyCurPotentialLost.ExchangeRate = myRate;
        curWeighted.CurrentCode = currentCode;
        curWeighted.ExchangeRate = exchangeRate;
        curMyCurWeighted.CurrentCode = myCurrencyCode;
        curMyCurWeighted.ExchangeRate = myRate;
    }
}