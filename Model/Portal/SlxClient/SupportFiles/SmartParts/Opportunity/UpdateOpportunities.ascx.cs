using System;
using System.Data;
using System.Data.Common;
using System.Text;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Collections.Generic;
using Sage.Platform.Application.UI;
using Sage.Platform.Data;
using Sage.Platform.Security;
using Sage.Platform.WebPortal;
using Sage.SalesLogix.Client.GroupBuilder;
using System.Data.OleDb;
using Sage.Platform.ComponentModel;
using Sage.Platform.WebPortal.Services;
using Sage.Platform.Application;

public partial class SmartParts_UpdateOpportunities : UserControl, ISmartPartInfoProvider
{
    private string referringUrl = "Opportunity.aspx";

    #region Protected Methods

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

    protected void Page_Load(object sender, EventArgs e)
    {
        if (string.IsNullOrEmpty(referringUrl))
            referringUrl = Request.UrlReferrer.AbsoluteUri;

        LoadGrid();
    }

    protected void LoadGrid()
    {
        if (this.Visible)
        {
            GenerateScript();

            EnableEstCloseControls();

            GroupContext groupContext = GroupContext.GetGroupContext();

            string fromSQL = null;
            string whereSQL = null;
            string selectSQL = null;
            string groupSQL = null;
            //string joinSQL = null;
            IList<DbParameter> parameters;


            if (groupContext.CurrentGroupID != "LOOKUPRESULTS")
            {
                GroupInfo groupInfo = new GroupInfo();
                groupInfo.GroupID = groupContext.CurrentGroupID;
                fromSQL = groupInfo.FromSQL;
                whereSQL = groupInfo.WhereSQL;
                parameters = groupInfo.Parameters;
            }
            else
            {
                CachedGroup groupInfo = groupContext.CurrentGroupInfo.CurrentGroup;
                fromSQL = groupInfo.GroupInformation.FromSQL;
                whereSQL = groupInfo.GroupInformation.WhereSQL;
                parameters = groupInfo.GroupInformation.Parameters;
            }

            // the joing caused ambiguous columns in the select clause so aliases had to be specified.
            // I made an assumption that opportunity is a required table and that the format of the
            // query would remain the same.  Shaky at best, I know.
            //string opportunityAlias = null;
            //int startIndex = fromSQL.ToLower().IndexOf("opportunity ") + "opportunity ".Length;
            //int stringLength = fromSQL.ToLower().IndexOf(" ", startIndex);
            //opportunityAlias = fromSQL.Substring(startIndex, stringLength - startIndex);

            //if (whereSQL != "")
            //    whereSQL = " WHERE " + whereSQL;
            //selectSQL = "SELECT opportunityid, " + opportunityAlias + ".description, estimatedclose, closeprobability, addtoforecast, " + opportunityAlias + ".notes, salespotential, UserInfoCustom.LastName + ', ' + UserInfoCustom.FirstName as AccountManager";
            //joinSQL = "LEFT OUTER JOIN USERINFO UserInfoCustom ON (" + opportunityAlias + ".AccountManagerId = UserInfoCustom.USERID)";
            //groupSQL = selectSQL + " FROM " + fromSQL + " " + joinSQL + " " + whereSQL;

            if (whereSQL != "")
                whereSQL = " WHERE " + whereSQL;
            selectSQL = "SELECT opportunityid, description, estimatedclose, closeprobability, accountmanagerid, addtoforecast, notes, salespotential";
            groupSQL = selectSQL + " FROM " + fromSQL + " " + whereSQL;

            var vConn = GroupInfo.GetOpenConnection();
            var vAdapter = new OleDbDataAdapter(groupSQL, vConn as OleDbConnection);
            foreach (DbParameter p in parameters)
                vAdapter.SelectCommand.Parameters.Add(p);

            DataTable dt = new DataTable();
            try
            {
                using (new SparseQueryScope())
                {
                    vAdapter.Fill(dt);
                }
            }
            catch
            {
                //throw new GroupInfoException(string.Format("Error Executing SQL", groupSQL), e);
                throw new Exception("Error Executing SQL");
            }
            finally
            {
                vConn.Close();
            }

            UpdateOppsGrid.DataSource = dt;
            UpdateOppsGrid.DataBind();
            CalcOppValues();
        }
    }

    protected bool GetForecastValue(object value)
    {
        bool forecast;
        if (value.ToString() == "T")
        {
            forecast = true;
        }
        else
        {
            forecast = false;
        }
        return forecast;
    }

    protected void estClose_CheckedChanged(object sender, EventArgs e)
    {
        rdgEstMove.Checked = false;
        EnableEstCloseControls();
    }

    protected void estMove_CheckedChanged(object sender, EventArgs e)
    {
        rdgEstClose.Checked = false;
        EnableEstCloseControls();
    }

    protected void EnableEstCloseControls()
    {
        if ((!rdgEstClose.Checked) && (!rdgEstMove.Checked))
        {
            rdgEstClose.Checked = true;
        }

        if (rdgEstClose.Checked)
        {
            ddlMoveItem.Enabled = false;
            txtNumDays.Enabled = false;
            dtpDateTimeTo.Enabled = true;
        }
        else
        {
            ddlMoveItem.Enabled = true;
            txtNumDays.Enabled = true;
            dtpDateTimeTo.Enabled = false;
        }
    }

    protected void CheckAll(object sender, EventArgs e)
    {
        foreach (GridViewRow gr in UpdateOppsGrid.Rows)
        {
            CheckBox cb = (CheckBox)gr.Cells[0].FindControl("chkSelect");
            cb.Checked = true;
        }
    }

    protected void UnCheckAll(object sender, EventArgs e)
    {
        foreach (GridViewRow gr in UpdateOppsGrid.Rows)
        {
            CheckBox cb = (CheckBox)gr.Cells[0].FindControl("chkSelect");
            cb.Checked = false;
        }
    }

    protected void Update_Click(object sender, EventArgs e)
    {
        UpdateOpportunities(sender, e);
    }
    protected void Close_Click(object sender, EventArgs e)
    {
        Response.Redirect(referringUrl);
    }

    protected void UpdateOpportunities(object sender, EventArgs e)
    {

        List<string> updateList = new List<string>();
        List<DateTime> estCloseList = new List<DateTime>();

        foreach (GridViewRow dr in UpdateOppsGrid.Rows)
        {
            CheckBox cb = (CheckBox)dr.Cells[0].FindControl("chkSelect");
            if (cb.Checked)
            {
                updateList.Add(cb.Attributes["Opportunityid"]);
                estCloseList.Add(Convert.ToDateTime(cb.Attributes["oppEstClose"]));
            }
        }

        if (updateList.Count != 0)
        {
            string idList = GetListOfIDs(updateList);

            if ((ddlUpdateOppDropDown.Text != GetLocalResourceObject("EstClose_rsc").ToString()) || (rdgEstClose.Checked))
            {
                string oppValue = GetUpdateFieldAndValue();
                if (!string.IsNullOrEmpty(oppValue))
                {
                    string SQL = "UPDATE OPPORTUNITY SET " + oppValue + " WHERE OPPORTUNITYID IN (" + idList + ")";

                    Sage.Platform.Data.IDataService service = Sage.Platform.Application.ApplicationContext.Current.Services.Get<Sage.Platform.Data.IDataService>();
                    using (new SparseQueryScope())
                    using (var conn = service.GetOpenConnection())
                    {
                        var cmd = conn.CreateCommand(SQL);
                        cmd.ExecuteNonQuery();
                    }
                }
            }
            else
            {
                List<string> oppEstValues = GetEstimatedCloseValues(estCloseList);

                IDataService service = Sage.Platform.Application.ApplicationContext.Current.Services.Get<IDataService>();
               
                using (new SparseQueryScope())
                {
                    for (int i = 0; i < oppEstValues.Count; i++)
                    {
                        string SQL = "UPDATE OPPORTUNITY SET ESTIMATEDCLOSE = '" + oppEstValues[i] + "' WHERE OPPORTUNITYID = '" + updateList[i] + "'";

                        using (var conn = service.GetOpenConnection())
                        using (var cmd = conn.CreateCommand(SQL))
                        {
                            cmd.ExecuteNonQuery();
                        }
                    }
                }
            }
        }
        LoadGrid();
    }
    #endregion

    #region Private Methods

    private void CalcOppValues()
    {
        double SalesPotential = 0;
        double Weighted = 0;

        foreach (GridViewRow gr in UpdateOppsGrid.Rows)
        {
            double dSalesPotentialValue = 0;
            Label sp = (Label)gr.Cells[0].FindControl("lblSalesPotential");
            if (!string.IsNullOrEmpty(sp.Text))
            {                
                if (Double.TryParse(sp.Text, out dSalesPotentialValue))
                {
                    SalesPotential += dSalesPotentialValue;
                }
            }

            Label weighted = (Label)gr.Cells[0].FindControl("lblProbability");
            if (!string.IsNullOrEmpty(weighted.Text))
            {
                double dWeightedValue;
                if (Double.TryParse(weighted.Text, out dWeightedValue))
                {
                    Weighted += ((dSalesPotentialValue * dWeightedValue) / 100);
                }
            }
        }

        curSalesPotentialTotal.Text = Convert.ToString(SalesPotential);
        curWeightedTotal.Text = Convert.ToString(Weighted);
        lblCountTotal.Text = Convert.ToString(UpdateOppsGrid.Rows.Count);
    }

    private string GetListOfIDs(List<string> idList)
    {
        string strFormattedList = "";

        if (idList != null)
        {
            if (idList.Count > 1)
            {
                int index = 0;
                foreach (string id in idList)
                {
                    index++;
                    if (index != idList.Count)
                    {
                        strFormattedList = strFormattedList + "'" + id + "',";
                    }
                    else
                    {
                        strFormattedList = strFormattedList + "'" + id + "'";
                    }
                }
            }
            else
            {
                strFormattedList = "'" + idList[0] + "'";
            }
        }

        return strFormattedList;
    }

    private string GetUpdateFieldAndValue()
    {
        string updateVal = "";

        if (ddlUpdateOppDropDown.Text == GetLocalResourceObject("AccountManager_rsc").ToString())
        {
            if (usrAccMgr.LookupResultValue != null)
            {
                updateVal = "ACCOUNTMANAGERID = '" + ((IComponentReference)usrAccMgr.LookupResultValue).Id + "'";
                usrAccMgr.LookupResultValue = null;
            }
            else
            {
                DialogService.ShowMessage(GetLocalResourceObject("AcctManagerRequiresValue_rsc").ToString());
                updateVal = null;
            }
        }

        if (ddlUpdateOppDropDown.Text == GetLocalResourceObject("AddToForecast_rsc").ToString())
        {
            if (rdgForecastYesNo.SelectedValue == GetLocalResourceObject("Yes_rsc").ToString())
            { updateVal = "ADDTOFORECAST = 'T'"; }
            else
            { updateVal = "ADDTOFORECAST = 'F'"; }
        }

        if (ddlUpdateOppDropDown.Text == GetLocalResourceObject("CloseProb_rsc").ToString())
        { updateVal = "CLOSEPROBABILITY = '" + pklCloseProbPickList.PickListValue + "'"; }

        if (ddlUpdateOppDropDown.Text == GetLocalResourceObject("Comments_rsc").ToString())
        { updateVal = "NOTES = '" + txtComments.Text + "'"; }

        if (ddlUpdateOppDropDown.Text == GetLocalResourceObject("EstClose_rsc").ToString())
        {
            if (rdgEstClose.Checked)
            {
                if (dtpDateTimeTo.Text == "")
                {
                    if (DialogService != null)
                    {
                        DialogService.ShowMessage(GetLocalResourceObject("Est_Date_Message_rsc").ToString(), "Alert");
                    }
                }
                else
                {
                    updateVal = "ESTIMATEDCLOSE = '" + dtpDateTimeTo.Text + "'";
                }
            }
        }

        return updateVal;
    }

    private List<string> GetEstimatedCloseValues(List<DateTime> oDates)
    {
        List<string> dateTimeValues = new List<string>();

        if (ddlMoveItem.SelectedValue == GetLocalResourceObject("Forward_rsc").ToString())
        {
            if (!string.IsNullOrEmpty(txtNumDays.Text))
            {
                double dNumDaysValue;
                if (Double.TryParse(txtNumDays.Text, out dNumDaysValue))
                {
                    for (int i = 0; i < oDates.Count; i++)
                    {
                        DateTime oppDate = oDates[i].AddDays(dNumDaysValue);
                        dateTimeValues.Add(oppDate.Date.ToString());
                    }
                }
            }
            return dateTimeValues;
        }
        else
        {
            if (!string.IsNullOrEmpty(txtNumDays.Text))
            {
                double dNumDaysValue;
                if (Double.TryParse(txtNumDays.Text, out dNumDaysValue))
                {
                    for (int i = 0; i < oDates.Count; i++)
                    {
                        DateTime oDate1 = oDates[i];
                        DateTime oDate2 = oDate1.AddDays(dNumDaysValue);
                        TimeSpan diff1 = oDate2 - oDate1;

                        DateTime oppDate = oDates[i].Subtract(diff1);
                        dateTimeValues.Add(oppDate.Date.ToString());
                    }
                }
            }
            return dateTimeValues;
        }
    }

    private void GenerateScript()
    {

        StringBuilder jscript = new StringBuilder();
        jscript.AppendFormat("var AccountManager_rsc=\"{0}\";", PortalUtil.JavaScriptEncode(GetLocalResourceObject("AccountManager_rsc").ToString()));
        jscript.AppendFormat("var AddToForecast_rsc=\"{0}\";", PortalUtil.JavaScriptEncode(GetLocalResourceObject("AddToForecast_rsc").ToString()));
        jscript.AppendFormat("var CloseProb_rsc=\"{0}\";", PortalUtil.JavaScriptEncode(GetLocalResourceObject("CloseProb_rsc").ToString()));
        jscript.AppendFormat("var Comments_rsc=\"{0}\";", PortalUtil.JavaScriptEncode(GetLocalResourceObject("Comments_rsc").ToString()));
        jscript.AppendFormat("var EstClose_rsc=\"{0}\";", PortalUtil.JavaScriptEncode(GetLocalResourceObject("EstClose_rsc").ToString()));
        jscript.AppendFormat("var ddl = '{0}'; ChangeUpdateItems();", ddlUpdateOppDropDown.ClientID);

        ScriptManager.RegisterStartupScript(Page, GetType(), ClientID, jscript.ToString(), true);
    }
    # endregion


    #region ISmartPartInfoProvider Members

    public ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
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


