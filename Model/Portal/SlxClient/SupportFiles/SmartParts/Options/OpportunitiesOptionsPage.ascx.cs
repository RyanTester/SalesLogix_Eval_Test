using System;
using System.Web.UI;
using System.Web.UI.WebControls;
using Sage.SalesLogix.WebUserOptions;
using Sage.Platform.WebPortal.Services;
using Sage.Platform.Application;
using Sage.Entity.Interfaces;
using Sage.Platform;
using Sage.Platform.Application.UI;
using Sage.SalesLogix.Plugins;
using Sage.SalesLogix;
using Sage.SalesLogix.Orm.Utility;

public partial class OpportunitiesOptionsPage : UserControl, ISmartPartInfoProvider
{

    /// <summary>
    /// Gets or sets an instance of the Dialog Service.
    /// </summary>
    private IWebDialogService _DialogService;
    [ServiceDependency]
    public IWebDialogService DialogService
    {
        set
        {
            _DialogService = value;
        }
        get
        {
            return _DialogService;
        }
    }

    //private IOpportunity exampleOpp;
    private IEntityContextService _EntityContextService;
    [ServiceDependency]
    public IEntityContextService EntityContextService
    {
        set
        {
            _EntityContextService = value;
        }
        get
        {
            return _EntityContextService;
        }
    }

    protected void _addProducts_ClickAction(object sender, EventArgs e)
    {
        if (DialogService != null)
        {
            DialogService.SetSpecs(550, 1000, "DefaultOpportunityProduct");
            DialogService.ShowDialog();
        }
    }

    protected void Page_PreRender(object sender, EventArgs e)
    {
        OpportunitiesOptions options = null;
        options = OpportunitiesOptions.Load(Server.MapPath(@"App_Data\LookupValues"));
        // set defaults
        if (options.OpportunityStatus != String.Empty)
            pklOpportunityStatus.PickListValue = options.OpportunityStatus;
        if (options.OpportunityType != String.Empty)
            pklOpportunityType.PickListValue = options.OpportunityType;
        if (options.Probability != String.Empty)
            pklOpportunityProbability.PickListValue = options.Probability;
        Utility.SetSelectedValue(_estimatedCloseToMonths, options.EstimatedCloseToMonths);
        
        //Set the default to none if ther is not a match.
        try
        {
            _salesProcess.SelectedValue = options.SalesProcess;
        }
        catch (Exception)
        {
            _salesProcess.SelectedValue = "NONE";
        }

        if (options.DefaultContacts != String.Empty)
            _defaultContacts.SelectedIndex = Convert.ToInt32(options.DefaultContacts);
        _useDefaultNamingConventions.Checked = options.UseDefaultNamingConventions;
        _estimatedCloseToLastDayOfMonth.Checked = options.EstimatedCloseToLastDayOfMonth;
        if (FormHelper.GetSystemInfoOption("MultiCurrency"))
        {
            lblDefCurrency.Visible = true;
            luDefCurrency.Visible = true;
            if (options.DefCurrencyCode != String.Empty)
            {
                luDefCurrency.LookupResultValue = EntityFactory.GetById<IExchangeRate>(options.DefCurrencyCode);
            }
        }
        else
        {
            lblDefCurrency.Visible = false;
            luDefCurrency.Visible = false;
        }
    }

    protected void Page_UnLoad(object sender, EventArgs e)
    {
        IContextService context = ApplicationContext.Current.Services.Get<IContextService>();
        context.SetContext("DefaultOpportunity", null);
    }

    protected void Page_Load(object sender, EventArgs e)
    {
        _addProducts.Click += _addProducts_ClickAction;

        BindSalesProcess();

        _estimatedCloseToMonths.Items.Clear();
        for (int i = 0; i <= 36; i++)
        {
            _estimatedCloseToMonths.Items.Add(i.ToString());
        }
        Page.DataBind();
    }

    private void BindSalesProcess()
    {
        _salesProcess.Items.Clear();
        System.Collections.Generic.IList<Plugin> SpList = PluginManager.GetPluginList(PluginType.SalesProcess, true, false);
        _salesProcess.Items.Add(new ListItem(GetLocalResourceObject("SalesProcess_None").ToString(), "NONE"));

        foreach (Plugin sp in SpList)
        {
            _salesProcess.Items.Add(new ListItem(sp.Name, sp.Name));
        }
    }

    protected void _save_Click(object sender, EventArgs e)
    {
        // save values
        OpportunitiesOptions options = new OpportunitiesOptions(Server.MapPath(@"App_Data\LookupValues"));
        options.OpportunityStatus = pklOpportunityStatus.PickListValue;
        options.OpportunityType = pklOpportunityType.PickListValue;
        options.Probability = pklOpportunityProbability.PickListValue;
        options.EstimatedCloseToMonths = _estimatedCloseToMonths.SelectedValue;
        options.SalesProcess = _salesProcess.SelectedValue;
        options.DefaultContacts = _defaultContacts.SelectedValue;
        options.UseDefaultNamingConventions = _useDefaultNamingConventions.Checked;
        options.EstimatedCloseToLastDayOfMonth = _estimatedCloseToLastDayOfMonth.Checked;
        if (luDefCurrency.LookupResultValue != null)
        {
            options.DefCurrencyCode = ((IExchangeRate)luDefCurrency.LookupResultValue).Id.ToString();
        }

        options.Save();
    }

    /// <summary>
    /// Gets the smart part info.
    /// </summary>
    /// <param name="smartPartInfoType">Type of the smart part info.</param>
    /// <returns></returns>
    public ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        Sage.Platform.WebPortal.SmartParts.ToolsSmartPartInfo tinfo = new Sage.Platform.WebPortal.SmartParts.ToolsSmartPartInfo();
        tinfo.Description = GetLocalResourceObject("PageDescription.Text").ToString();
        tinfo.Title = GetLocalResourceObject("PageDescription.Title").ToString();
        foreach (Control c in this.LitRequest_RTools.Controls)
        {
            tinfo.RightTools.Add(c);
        }
        return tinfo;
    }
}