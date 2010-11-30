using System;
using System.Web.UI;
using Sage.Platform.WebPortal.SmartParts;
using Sage.Platform;
using Sage.Entity.Interfaces;
using Sage.SalesLogix;
using Sage.SalesLogix.Orm.Utility;
using Sage.Platform.Application.UI;

public partial class SmartParts_UpdateOpportunityCurrency : EntityBoundSmartPartInfoProvider
{
    bool blnGetValues = false;

    public override Type EntityType
    {
        get { return typeof(Sage.Entity.Interfaces.IOpportunity); }
    }

    protected override void OnWireEventHandlers()
    {
        base.OnWireEventHandlers();
    }

    protected override void OnAddEntityBindings()
    {

    }

    protected override void OnFormBound()
    {
        if (!blnGetValues)
        {
            base.OnFormBound();
            Sage.Entity.Interfaces.IOpportunity entity = this.BindingSource.Current as Sage.Entity.Interfaces.IOpportunity;

            lblOppCurRate.Text = string.Format(GetLocalResourceObject("OppsCurrentRate_rsc").ToString(), entity.ExchangeRateCode, Convert.ToString(entity.ExchangeRate.GetValueOrDefault(1))).ToString();
            lblRateDate.Text = string.Format(GetLocalResourceObject("RateAssignedOn_rsc").ToString(), Convert.ToString(entity.ExchangeRateDate.Value.ToShortDateString())).ToString();
            lveChangeRate.Text = entity.ExchangeRateCode;
            txtExchangeRate.Text = Convert.ToString(entity.ExchangeRate.GetValueOrDefault(1));

            SystemInformation si = SystemInformationRules.GetSystemInfo();
            DelphiStreamReader stream = new DelphiStreamReader(si.Data);
            TValueType type;
            if (stream.FindProperty("LockOpportunityRate", out type))
            {
                if (type.Equals(TValueType.vaTrue))
                {
                    chkLockRate.Enabled = true;
                }
                else
                {
                    chkLockRate.Enabled = false;
                }
            }

            SystemInformation si2 = SystemInformationRules.GetSystemInfo();
            DelphiStreamReader stream2 = new DelphiStreamReader(si2.Data);
            TValueType type2;
            if (stream2.FindProperty("ChangeOpportunityRate", out type2))
            {
                if (type2.Equals(TValueType.vaTrue))
                {
                    txtExchangeRate.Enabled = true;
                }
                else
                {
                    txtExchangeRate.Enabled = false;
                }
            }
            chkLockRate.Checked = entity.ExchangeRateLocked.Value;

            GetFromValues();
        }
    }

    private void GetFromValues()
    {
        Sage.Entity.Interfaces.IOpportunity entity = this.BindingSource.Current as Sage.Entity.Interfaces.IOpportunity;

        curFrom.ExchangeRate = entity.ExchangeRate.GetValueOrDefault(1);
        curFrom.CurrentCode = entity.ExchangeRateCode;
        curFrom.Text = entity.SalesPotential.ToString();
    }

    protected void GetExchangeRate(object sender, EventArgs e)
    {
        Sage.Entity.Interfaces.IOpportunity entity = this.BindingSource.Current as Sage.Entity.Interfaces.IOpportunity;

        //IExchangeRate exchRate = lveChangeRate.LookupResultValue as IExchangeRate;
        IExchangeRate exchRate = EntityFactory.GetById<IExchangeRate>(lveChangeRate.LookupResultValue);

        if (exchRate != null)
        {
            txtExchangeRate.Text = exchRate.Rate.ToString();
            lblRateCurrent.Text = string.Format(GetLocalResourceObject("ThisRateCurrent_rsc").ToString(), Convert.ToString(exchRate.ModifyDate.Value.ToShortDateString())).ToString();

            GetFromValues();

            curTo.ExchangeRate = exchRate.Rate.GetValueOrDefault(1);
            curTo.CurrentCode = exchRate.Id.ToString();
            curTo.Text = Convert.ToString(entity.SalesPotential);

            lveChangeRate.Text = exchRate.Id.ToString();
            txtExchangeRate.Text = Convert.ToString(exchRate.Rate.GetValueOrDefault(1));
        }
        blnGetValues = true;
    }

    protected void SetLocked(object sender, EventArgs e)
    {
        Sage.Entity.Interfaces.IOpportunity entity = this.BindingSource.Current as Sage.Entity.Interfaces.IOpportunity;

        entity.ExchangeRateLocked = chkLockRate.Checked;
    }

    protected void cmdOK_Click(object sender, EventArgs e)
    {
        IOpportunity opportunity = this.BindingSource.Current as IOpportunity;
        if (opportunity != null)
        {
            IExchangeRate exchRate = EntityFactory.GetById<IExchangeRate>(lveChangeRate.Text);
            try
            {
                opportunity.ExchangeRateCode = exchRate.Id.ToString();
                opportunity.ExchangeRate = Convert.ToDouble(txtExchangeRate.Text);
                opportunity.Save();
            }
            catch (Exception)
            {
                throw new ApplicationException(GetLocalResourceObject("Error_ChangingExchangeRate").ToString());
            }
        }

        DialogService.CloseEventHappened(sender, e);
        Refresh();
    }

    protected void cmdCancel_Click(object sender, EventArgs e)
    {
        DialogService.CloseEventHappened(sender, e);
    }

    #region ISmartPartInfoProvider Members

    public override ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        Sage.Platform.WebPortal.SmartParts.ToolsSmartPartInfo tinfo = new Sage.Platform.WebPortal.SmartParts.ToolsSmartPartInfo();

        foreach (Control c in this.UpdateOpps_RTools.Controls)
        {
            tinfo.RightTools.Add(c);
        }
        return tinfo;
    }

    #endregion
}
