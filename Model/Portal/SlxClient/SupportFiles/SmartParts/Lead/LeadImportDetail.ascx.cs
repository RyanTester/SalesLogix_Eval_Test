using System;
using System.Collections;
using System.Configuration;
using System.Data;
using System.Drawing;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using Sage.Entity.Interfaces;
using Sage.SalesLogix.Services.Import;
using Sage.Platform.WebPortal.SmartParts;

public partial class SmartParts_Lead_LeadImportDetail : EntityBoundSmartPartInfoProvider
{
    public override Type EntityType
    {
        get { return typeof(Sage.Entity.Interfaces.IImportHistory); }
    }

    protected override void OnAddEntityBindings()
    { 
    
    }

    protected override void OnFormBound()
    {
        base.OnFormBound();
    }

    protected void grdHistoryItems_OnPageIndexChanging(object sender, GridViewPageEventArgs e)
    {
        grdHistoryItems.PageIndex = e.NewPageIndex;
    }

    protected void Page_Load(object sender, EventArgs e)
    {
        IImportHistory importHistory = BindingSource.Current as IImportHistory;
        
        if (importHistory != null)
        {
            txtImportID.Text = importHistory.Id.ToString();
            txtImportDate.Text = importHistory.CreateDate.ToString();
            txtStatus.Text = importHistory.Status;
            txtImportLeads.Text = importHistory.ImportedCount.ToString();
            txtAutoMergedDuplicates.Text = importHistory.MergeCount.ToString();
            txtUnresolvedDuplicates.Text = importHistory.DuplicateCount.ToString();
            txtErrors.Text = importHistory.ErrorCount.ToString();

            DataTable dtImportHistory = importHistory.GetHistoryItems() as DataTable;
            grdHistoryItems.DataSource = dtImportHistory;
            grdHistoryItems.DataBind();
            string data = importHistory.Data;
        }
    }
}
