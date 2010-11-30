using System;
using System.Data;
using System.Collections.Generic;
using System.Web.UI;
using System.Web.UI.WebControls;
using Sage.Platform.WebPortal.SmartParts;
using Sage.Platform.Application;
using Sage.Platform.Orm;
using Sage.Platform;
using Sage.Entity.Interfaces;
using Sage.Platform.Repository;


public partial class SmartParts_AccountReseller : EntityBoundSmartPartInfoProvider 
{
    private IAccount _account;
    private IEntityContextService _EntityService;
    [ServiceDependency(Type = typeof(IEntityContextService), Required = true)]
    public IEntityContextService EntityService
    {
        get
        {
            return _EntityService;
        }
        set
        {
            _EntityService = value;
        }
    }
  
    public override Type EntityType
    {
        get { return typeof(Sage.Entity.Interfaces.IAccount); }
    }


    protected override void InnerPageLoad(object sender, EventArgs e)
    {
            }

    protected override void OnAddEntityBindings()
    {


    }
  
    protected override void OnWireEventHandlers()
    {
        grdReseller.PageIndexChanging += new GridViewPageEventHandler(grdReseller_PageIndexChanging);
        base.OnWireEventHandlers();
    }

    protected override void OnFormBound()
    {
        base.OnFormBound();
        this._account = (IAccount)this.BindingSource.Current;
        LoadView();
    }
    
    public override Sage.Platform.Application.UI.ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        Sage.Platform.WebPortal.SmartParts.ToolsSmartPartInfo tinfo = new Sage.Platform.WebPortal.SmartParts.ToolsSmartPartInfo();
        if (this.BindingSource != null)
        {
            if (this.BindingSource.Current != null)
            {
                //tinfo.Description = this.BindingSource.Current.ToString();
                //tinfo.Title = this.BindingSource.Current.ToString();
            }
        }
        foreach (Control c in this.Reseller_LTools.Controls)
        {
            tinfo.LeftTools.Add(c);
        }
        foreach (Control c in this.Reseller_CTools.Controls)
        {
            tinfo.CenterTools.Add(c);
        }
        foreach (Control c in this.Reseller_RTools.Controls)
        {
            tinfo.RightTools.Add(c);
        }
        return tinfo;
    }
    protected void btnAdd_ClickAction(object sender, EventArgs e)
    {
        
    }

    protected void grdReseller_PageIndexChanging(object sender, GridViewPageEventArgs e)
    {
        grdReseller.PageIndex = e.NewPageIndex;
    }
    private void LoadView()
    {

        LoadStats();
        LoadGrid();
        
    }

    private void LoadStats()
    {

        DataTable dt = GetResellerStats(this._account);

        string status_Open;
        string status_ClosedWon;
        string status_ClosedLost;
        string status_Inactive;

        status_Open = GetLocalResourceObject("Status_Open").ToString();
        status_ClosedWon = GetLocalResourceObject("Status_ClosedWon").ToString();
        status_ClosedLost = GetLocalResourceObject("Status_ClosedLost").ToString();
        status_Inactive = GetLocalResourceObject("Status_Inactive").ToString();
        
        if (string.IsNullOrEmpty(status_Open))
        {
           status_Open = "Open";
        }
        if (string.IsNullOrEmpty(status_ClosedWon))
        {
           status_ClosedWon = "Closed - Won";
        }
        if (string.IsNullOrEmpty(status_ClosedLost))
        {
           status_ClosedLost = "Closed - Lost";
        }

        if (string.IsNullOrEmpty(status_Inactive))
        {
           status_Inactive = "Inactive";
        }
        
        foreach (DataRow row in dt.Rows)
        {

            string status = Convert.ToString(row["STATUS"]);
            string count = Convert.ToString(row["Count"]);
            string total = Convert.ToString(row["Total"]);

            if (status == status_Open)
            {
                txtOpenCount.Text = count;
                crnOpenTotal.Text = total;
            
            }
            
            if (status == status_ClosedWon)
            {
                txtClosedWonCount.Text = count;
                crnClosedWonTotal.Text = total;
            
            }
            if (status == status_ClosedLost)
            {
                txtClosedLostCount.Text = count;
                crnClosedLostTotal.Text = total;
            
            }
            if (status == status_Inactive)
            {
                txtInactiveCount.Text = count;
                crnInactiveTotal.Text = total;
            
            }
            
            
                
        }
    }
    
    private void LoadGrid()
    {
        grdReseller.DataSource = GetResellerOppList(this._account);
        grdReseller.DataBind();
    
    }

    private IList<IOpportunity> GetResellerOppList(IAccount account)
    {

        IList<IOpportunity> list = null;

        using (new SessionScopeWrapper())
        {
            IRepository<IOpportunity> rep = EntityFactory.GetRepository<IOpportunity>();
            IQueryable qry = (IQueryable)rep;
            IExpressionFactory ep = qry.GetExpressionFactory();
            Sage.Platform.Repository.ICriteria crt = qry.CreateCriteria();
            crt.Add(ep.Eq("Reseller", account));
            list = crt.List<IOpportunity>();

        }
        return list;

    }

    private DataTable GetResellerStats(IAccount account)
    {

        DataTable dt = new DataTable("OppStats");
        DataColumn dc;

        dc = dt.Columns.Add();
        dc.ColumnName = "Status";
        dc.DataType = typeof (string);
        dc.AllowDBNull = true;

        dc = dt.Columns.Add();
        dc.ColumnName = "Count";
        dc.DataType = typeof (int);
        dc.AllowDBNull = true;

        dc = dt.Columns.Add();
        dc.ColumnName = "Total";
        dc.DataType = typeof (double);
        dc.AllowDBNull = true;

        DataRow drOpen;
        DataRow drClosedWon;
        DataRow drClosedLost;
        DataRow drInactive;
        drOpen = dt.NewRow();
        drClosedWon = dt.NewRow();
        drClosedLost = dt.NewRow();
        drInactive = dt.NewRow();

        string status_Open;
        string status_ClosedWon;
        string status_ClosedLost;
        string status_Inactive;

        status_Open = GetLocalResourceObject("Status_Open").ToString();
        status_ClosedWon = GetLocalResourceObject("Status_ClosedWon").ToString();
        status_ClosedLost = GetLocalResourceObject("Status_ClosedLost").ToString();
        status_Inactive = GetLocalResourceObject("Status_Inactive").ToString();

        if (string.IsNullOrEmpty(status_Open))
        {
            status_Open = "Open";
        }
        if (string.IsNullOrEmpty(status_ClosedWon))
        {
            status_ClosedWon = "Closed - Won";
        }
        if (string.IsNullOrEmpty(status_ClosedLost))
        {
            status_ClosedLost = "Closed - Lost";
        }

        if (string.IsNullOrEmpty(status_Inactive))
        {
            status_Inactive = "Inactive";
        }

        drOpen["Status"] = status_Open;
        drClosedWon["Status"] = status_ClosedWon;
        drClosedLost["Status"] = status_ClosedLost;
        drInactive["Status"] = status_Inactive;

        int openCount = 0;
        double openTotal = 0.0;
        int closedWonCount = 0;
        double closedWonTotal = 0.0;
        int closedLostCount = 0;
        double closedLostTotal = 0.0;
        int inactiveCount = 0;
        double inactiveTotal = 0.0;

        IList<IOpportunity> list = GetResellerOppList(account);
        
        foreach (IOpportunity opp in list)
        {

            if (opp.Status == status_Open)
            {
                openCount++;
                openTotal = openTotal + (double)opp.SalesPotential;
            }
            if (opp.Status == status_ClosedWon)
            {
                closedWonCount++;
                closedWonTotal = closedWonTotal + (double)opp.ActualAmount;
            }
            if (opp.Status == status_ClosedLost)
            {
                closedLostCount++;
                closedLostTotal = closedLostTotal + (double)opp.SalesPotential;
            }
            if (opp.Status == status_Inactive)
            {
                inactiveCount++;
                inactiveTotal = inactiveTotal + (double)opp.SalesPotential;
            }
        }

        drOpen["Count"] = openCount;
        drOpen["Total"] = openTotal;
        drClosedWon["Count"] = closedWonCount;
        drClosedWon["Total"] = closedWonTotal;
        drClosedLost["Count"] = closedLostCount;
        drClosedLost["Total"] = closedLostTotal;
        drInactive["Count"] = inactiveCount;
        drInactive["Total"] = inactiveTotal;

        dt.Rows.Add(drOpen);
        dt.Rows.Add(drClosedLost);
        dt.Rows.Add(drClosedWon);
        dt.Rows.Add(drInactive);

        return dt;

    }

    protected void grdReseller_RowDataBound(object sender, GridViewRowEventArgs e)
    {
        if (e.Row.RowType == DataControlRowType.DataRow)
        {
            
            IOpportunity opportunity = (IOpportunity)e.Row.DataItem;
            //Sales Potential
			Sage.SalesLogix.Web.Controls.Currency curr = (Sage.SalesLogix.Web.Controls.Currency) e.Row.Cells[2].Controls[1];
            curr.ExchangeRate = opportunity.ExchangeRate.GetValueOrDefault(1);
            curr.CurrentCode = opportunity.ExchangeRateCode;
        }
    }

}
