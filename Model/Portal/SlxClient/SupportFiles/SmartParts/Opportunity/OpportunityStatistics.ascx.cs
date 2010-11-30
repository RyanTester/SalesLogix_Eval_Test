using System;
using System.Data;
using System.Data.Common;
using System.Web.UI;
using Sage.Platform.Security;
using Sage.SalesLogix.Client.GroupBuilder;
using System.Data.OleDb;
using Sage.SalesLogix.Plugins;
using Sage.Platform.Application.UI;

public partial class SmartParts_OpportunityStatistics : UserControl, ISmartPartInfoProvider
{
    protected void Page_Load(object sender, EventArgs e)
    {
        try
        {
            GroupContext groupContext = GroupContext.GetGroupContext();

            GroupInfo groupInfo = new GroupInfo();
            groupInfo.GroupID = groupContext.CurrentGroupID;

            string fromSQL = groupInfo.FromSQL;
            string whereSQL = groupInfo.WhereSQL;

            if (whereSQL != "")
                whereSQL = "WHERE " + whereSQL;
            string selectSQL = "SELECT SALESPOTENTIAL, CLOSEPROBABILITY, ACTUALAMOUNT, DATEOPENED, CLOSED, ESTIMATEDCLOSE ";
            string groupSQL = selectSQL + "FROM " + fromSQL + " " + whereSQL;

            using (new SparseQueryScope())
            using (IDbConnection vConn = GroupInfo.GetOpenConnection())
            {
                OleDbDataAdapter vAdapter = new OleDbDataAdapter(groupSQL, vConn as OleDbConnection);
                foreach (DbParameter p in groupInfo.Parameters)
                {
                    vAdapter.SelectCommand.Parameters.Add(p);
                }
                vAdapter.SelectCommand.Prepare();
                DataTable dt = new DataTable();
                vAdapter.Fill(dt);

                if (dt.Rows.Count != 0)
                {
                    GetNumOfOpportunities(dt);
                    GetPotentialValues(dt);
                    GetAverageCloseProb(dt);
                    GetActualAmountValues(dt);
                    GetAverageDaysOpen(dt);
                    GetRangeofDates(dt);
                }
                else
                {
                    lblNumOfOppsVal.Text = "0";
                    curSalesPotentialTotalVal.Text = "0";
                    curSalesPotentialAverageVal.Text = "0";
                    curWeightedPotentialAverageVal.Text = "0";
                    curWeightedPotentialTotalVal.Text = "0";
                    lblAverageCloseProbabilityVal.Text = "0";
                    curActualAmountTotalVal.Text = "0";
                    curActualAmountAverageVal.Text = "0";
                    lblAverageNumOfDaysOpenVal.Text = "0";
                    lblRangeOfEstCloseVal.Text = GetLocalResourceObject("None_rsc").ToString();
                }
            }
        }
        catch //Group didn't contain any records disable active controls
        {
            btnUpdateOpps.Enabled = false;
            ddlReports.Enabled = false;
        }
    }

    private void GetNumOfOpportunities(DataTable oppGroup)
    {
        lblNumOfOppsVal.Text = oppGroup.Rows.Count.ToString();
    }

    private void GetPotentialValues(DataTable oppGroup)
    {
        double salesPotential = 0;
        double weighted = 0;

        foreach (DataRow dr in oppGroup.Rows)
        {
            salesPotential = salesPotential + Convert.ToDouble(dr[0]);
            if (Convert.ToInt32(dr[1]) != 0)
                weighted = weighted + Convert.ToDouble(dr[0]) * (Convert.ToDouble(dr[1]) / 100);
        }

        curSalesPotentialTotalVal.Text = Convert.ToString(salesPotential);
        curSalesPotentialAverageVal.Text = Convert.ToString(salesPotential / oppGroup.Rows.Count);

        curWeightedPotentialTotalVal.Text = Convert.ToString(weighted);
        curWeightedPotentialAverageVal.Text = Convert.ToString(weighted / oppGroup.Rows.Count);
    }

    private void GetAverageCloseProb(DataTable oppGroup)
    {
        double closeProb = 0;

        foreach (DataRow dr in oppGroup.Rows)
        {
            closeProb = closeProb + Convert.ToDouble(dr[1]);
        }

        lblAverageCloseProbabilityVal.Text = Convert.ToString(Convert.ToInt32(closeProb / oppGroup.Rows.Count));
    }

    private void GetActualAmountValues(DataTable oppGroup)
    {
        double actualAmount = 0;

        foreach (DataRow dr in oppGroup.Rows)
        {
            if (!dr[2].Equals(DBNull.Value))
                actualAmount = actualAmount + Convert.ToDouble(dr[2]);
        }

        curActualAmountTotalVal.Text = Convert.ToString(actualAmount);
        curActualAmountAverageVal.Text = Convert.ToString(actualAmount / oppGroup.Rows.Count);
    }

    private void GetAverageDaysOpen(DataTable oppGroup)
    {
        TimeSpan DaysOpen = new TimeSpan();
        int totalDays = 0;
        int numDays = 0;
        int index = 0;

        foreach (DataRow dr in oppGroup.Rows)
        {
            if ((!dr[3].Equals(DBNull.Value)) && (Convert.ToString(dr[4]) == "T"))
            {
                DaysOpen = DateTime.Now - Convert.ToDateTime(dr[3]);
                totalDays = totalDays + DaysOpen.Days;
                index++;
            }
        }

        if (index != 0)
        {
            numDays = (totalDays / index);
        }

        lblAverageNumOfDaysOpenVal.Text = numDays.ToString();
    }

    private void GetRangeofDates(DataTable oppGroup)
    {
        DateTime minDate = new DateTime();
        DateTime maxDate = new DateTime();

        foreach (DataRow dr in oppGroup.Rows)
        {
            if (!dr[5].Equals(DBNull.Value))
            {
                if (oppGroup.Rows.IndexOf(dr) == 0)
                {
                    minDate = Convert.ToDateTime(dr[5]);
                    maxDate = Convert.ToDateTime(dr[5]);
                }

                if (DateTime.Compare(Convert.ToDateTime(dr[5]), minDate) < 0)
                {
                    minDate = Convert.ToDateTime(dr[5]);
                }

                if (DateTime.Compare(Convert.ToDateTime(dr[5]), maxDate) > 0)
                {
                    maxDate = Convert.ToDateTime(dr[5]);
                }

            }
        }
        lblRangeOfEstCloseVal.Text = minDate.ToShortDateString() + " - " + maxDate.ToShortDateString();
    }
    protected void btnUpdateOpps_Click(object sender, EventArgs e)
    {
        Response.Redirect("~/UpdateOpportunities.aspx");
    }

    protected void ddlReports_TextChanged(object sender, EventArgs e)
    {
        Plugin report = new Plugin();
        string reportURL = "";

        GroupContext groupContext = GroupContext.GetGroupContext();

        GroupInfo groupInfo = new GroupInfo();
        groupInfo.GroupID = groupContext.CurrentGroupID;

        switch (ddlReports.Text)
        {
            case "None":
                break;
            case "Sales Process Stage Analysis":
                report = Sage.SalesLogix.Plugins.Plugin.LoadByName("Sales Process Stage Analysis", "Opportunity", Sage.SalesLogix.Plugins.PluginType.CrystalReport);
                break;
            case "Sales Process Step Usage":
                report = Sage.SalesLogix.Plugins.Plugin.LoadByName("Sales Process Step Usage", "Opportunity", Sage.SalesLogix.Plugins.PluginType.CrystalReport);
                break;
            //case "Quota vs. Actual Sales":
            //    report = Sage.SalesLogix.Plugins.Plugin.LoadByName("Quota Vs. Actual Sales", "Opportunity", Sage.SalesLogix.Plugins.PluginType.CrystalReport);
            //    break;
            case "Forecast by Account Manager":
                report = Sage.SalesLogix.Plugins.Plugin.LoadByName("Forecast by Account Manager", "Opportunity", Sage.SalesLogix.Plugins.PluginType.CrystalReport);
                break;
            //case "Competetive Analysis":
            //    report = Sage.SalesLogix.Plugins.Plugin.LoadByName("Competetive Analysis", "Opportunity", Sage.SalesLogix.Plugins.PluginType.CrystalReport);
            //    break;
        }

        if (report.PluginId != null)
        {
            reportURL = "~/ReportManager.aspx?showthisreport=" + report.PluginId + "&showrptfamily=" + report.Family + "&filterbygroupid=" + groupInfo.GroupID;

            Response.Redirect(reportURL);
        }
    }

    #region ISmartPartInfoProvider Members

    public ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        Sage.Platform.WebPortal.SmartParts.ToolsSmartPartInfo tinfo = new Sage.Platform.WebPortal.SmartParts.ToolsSmartPartInfo();

        foreach (Control c in this.OpportunityStats_RTools.Controls)
        {
            tinfo.RightTools.Add(c);
        }
        return tinfo;
    }

    #endregion
}
