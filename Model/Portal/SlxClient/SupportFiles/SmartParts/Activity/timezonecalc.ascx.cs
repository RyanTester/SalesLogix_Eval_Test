using System;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Text;
using Sage.Platform;
using Sage.Platform.WebPortal;
using Sage.SalesLogix.Activity;
using Sage.Platform.WebPortal.SmartParts;
using TimeZone = Sage.Platform.TimeZone;

/// <summary>
/// Summary description for timezonecalc.
/// </summary>
public partial class timezonecalc : EntityBoundSmartPartInfoProvider
{
    private DateTime StartDateComparison;

    private Activity Activity
    {
        get { return (Activity)BindingSource.Current; }
    }

    private TimeZone TimeZone
    {
        get { return (TimeZone)AppContext["TimeZone"]; }
    }

    private ActivityFormHelper _ActivityFormHelper;
    private ActivityFormHelper Form
    {
        get { return _ActivityFormHelper; }
    }

    private const string ACTSTARTDATEKEY = "NewActStartDate";

    #region Page Life Cycle

    protected override void OnInit(EventArgs e)
    {
        base.OnInit(e);
        BindingSource.OnCurrentEntitySet += delegate
        {
            _ActivityFormHelper = new ActivityFormHelper((Activity)BindingSource.Current);
        };
    }

    protected override void OnFormBound()
    {
        base.OnFormBound();

        if (IsActivating)
        {
            Form.Reset(Controls);
            CurrDateValue.DateTimeValue = Activity.StartDate;
            CompDateValue.DateTimeValue = Activity.StartDate;
            GenerateGrid();
            Session[ACTSTARTDATEKEY] = null;
        }

        StartDateComparison = Activity.StartDate; //save the startdate before binding to see if it gets changed

        if (ClientBindingMgr != null)
        {
            ClientBindingMgr.RegisterBoundControl(CurrDateValue);
            ClientBindingMgr.RegisterBoundControl(CompDateValue);
        }

        UpdateActivity.Enabled = Form.IsSaveEnabled;
    }

    protected void Page_PreRender(object sender, EventArgs e)
    {
        // if the startdate was changed above, update the control
        if ((StartDateComparison != Activity.StartDate) || (Session[ACTSTARTDATEKEY] != null))
        {
            CurrDateValue.DateTimeValue = Activity.StartDate;
            CompDateValue.DateTimeValue = Activity.StartDate;
            CompTzSelect.SelectedValue = TimeZone.DisplayName;
            Session[ACTSTARTDATEKEY] = null;
        }
        GenerateGrid();
        RegisterClientScripts();
    }

    protected void Page_UnLoad(object sender, EventArgs e)
    {
        if (Visible || Activity == null || StartDateComparison == Activity.StartDate) return;

        Session[ACTSTARTDATEKEY] = Activity.StartDate;
    }

    protected override void OnWireEventHandlers()
    {
        base.OnWireEventHandlers();

        CurrDateValue.DateTimeValueChanged += CurrDateValue_DateTimeValueChanged;
        CompDateValue.DateTimeValueChanged += CompDateValue_DateTimeValueChanged;
        CompTzSelect.SelectedIndexChanged += CompTzSelect_SelectedIndexChanged;
        chkCompDltAdjust.ServerChange += chkCompDltAdjust_ServerChange;
        chkCurrDltAdjust.ServerChange += chkCurrDltAdjust_ServerChange;
    }

    #endregion

    private void GenerateGrid()
    {
        #region Table Html

        const string tableHeader = @"
<table id=""tblTZTable"" cellpadding=""2"" cellspacing=""0"">
    <thead>
        <tr>
            <th>{0}</th>
            <th class=""thDateTime"">{1}</th>
        </tr>
    </thead>
    <tbody>
";
        const string tableDetail = @"
        <tr>
            <td>{0}</td>
            <td name=""tzConvDateTime"" bias=""{1}"">{2}</td>
        </tr>
";
        const string tableFooter = @"
    </tbody>
</table>
";
        #endregion

        currLongDateFmt.InnerHtml = string.Format("{0} <label id=\"lblTime\">{1}</label>",
            Activity.StartDate.AddMinutes(ServerToClientBias()).ToLocalTime().ToLongDateString(),
            Activity.StartDate.AddMinutes(ServerToClientBias()).ToLocalTime().ToShortTimeString());

        StringBuilder sb = new StringBuilder();

        sb.Append(string.Format(tableHeader,
            GetLocalResourceObject("localizeTimeZone.Text"),
            GetLocalResourceObject("localizeDateTime.Text")));

        DateTime GridDateTime = CurrDateValue.DateTimeValue != null ?
            (DateTime)CurrDateValue.DateTimeValue : Activity.StartDate;
        bool BuildTzSelect = (CompTzSelect.Items.Count == 0);

        foreach (TimeZone tz in new TimeZones())
        {
            sb.Append(string.Format(tableDetail,
                tz.DisplayName,
                tz.BiasForGivenDate(GridDateTime),
                tz.UTCDateTimeToLocalTime(GridDateTime).ToShortTimeString()));

            if (BuildTzSelect)
                BuildTimeZoneSelect(tz, TimeZone.KeyName);
        }

        sb.Append(tableFooter);
        allTimeZoneList.InnerHtml = sb.ToString();
    }

    private void BuildTimeZoneSelect(TimeZone tz, string clientTimeZone)
    {
        // option...............
        CompTzSelect.Items.Add(new ListItem(tz.DisplayName));
        if (clientTimeZone != tz.KeyName) return;

        CompTzSelect.SelectedValue = tz.DisplayName;
        currTZDispName.InnerText = tz.DisplayName;
        currTZStdDltName.InnerText =
            tz.DateFallsWithinDaylightSaving(Activity.StartDate) ? tz.DaylightName : tz.StandardName;
        localtimezone.Value = tz.KeyName;
        lblLocalTimeZone.InnerText = tz.DisplayName;
        localbias.Value = tz.BiasForGivenDate(Activity.StartDate).ToString();
        localnodltbias.Value = tz.Bias.ToString();
        chkCurrDltAdjust.Disabled = (!tz.ObservervesDaylightTime);
        lblCurrDltAdjust.Disabled = (!tz.ObservervesDaylightTime);
        chkCompDltAdjust.Disabled = (!tz.ObservervesDaylightTime);
        lblCompDltAdjust.Disabled = (!tz.ObservervesDaylightTime);
    }

    #region event handlers

    void CompTzSelect_SelectedIndexChanged(object sender, EventArgs e)
    {
        CurrDateValue_DateTimeValueChanged(sender, e);
    }

    void CompDateValue_DateTimeValueChanged(object sender, EventArgs e)
    {
        if ((CompDateValue.DateTimeValue != null))
        {
            TimeZones tzones = new TimeZones();
            TimeZone comptz = tzones.FindTimeZone(CompTzSelect.SelectedValue, TimeZones.TZFindType.ftDisplayName);
            DateTime newDateTime = (DateTime)(CompDateValue.DateTimeValue);
            newDateTime = newDateTime.AddMinutes(-1 * TimeZone.BiasForGivenDate(newDateTime));
            CurrDateValue.DateTimeValue = newDateTime.AddMinutes(comptz.BiasForGivenDate(newDateTime));
        }
    }

    void CurrDateValue_DateTimeValueChanged(object sender, EventArgs e)
    {
        if ((CurrDateValue.DateTimeValue != null))
        {
            TimeZones tzones = new TimeZones();
            TimeZone comptz = tzones.FindTimeZone(CompTzSelect.SelectedValue, TimeZones.TZFindType.ftDisplayName);
            DateTime newDateTime = (DateTime)(CurrDateValue.DateTimeValue);
            newDateTime = newDateTime.AddMinutes(TimeZone.BiasForGivenDate(newDateTime));
            CompDateValue.DateTimeValue = newDateTime.AddMinutes(-1 * comptz.BiasForGivenDate(newDateTime));
            chkCompDltAdjust.Disabled = (!comptz.ObservervesDaylightTime);
            lblCompDltAdjust.Disabled = (!comptz.ObservervesDaylightTime);
        }
    }

    protected void UpdateActivity_Click(object sender, EventArgs e)
    {
        DateTime newDateTime = (DateTime)(CurrDateValue.DateTimeValue);
        Activity.StartDate = newDateTime;
    }

    static void chkCurrDltAdjust_ServerChange(object sender, EventArgs e)
    {
    }

    static void chkCompDltAdjust_ServerChange(object sender, EventArgs e)
    {
    }

    #endregion

    private new void RegisterClientScripts()
    {
        Page.ClientScript.RegisterClientScriptInclude("timeobj", "jscript/timeobjs.js");

        if (!Page.ClientScript.IsClientScriptBlockRegistered("timezonecalc_clientscript"))
        {
            StringBuilder sb = new StringBuilder(GetLocalResourceObject("timezonecalc_clientscript").ToString());

            sb.Replace("@rsMore", PortalUtil.JavaScriptEncode(GetLocalResourceObject("jsMore").ToString()));
            sb.Replace("@rsLess", PortalUtil.JavaScriptEncode(GetLocalResourceObject("jsLess").ToString()));
            sb.Replace("@morelessClientID", moreless.ClientID);
            sb.Replace("@lzComparisonTimeZones", PortalUtil.JavaScriptEncode(
                GetLocalResourceObject("localizeComparisonTimeZones.Text").ToString()));

            ScriptManager.RegisterClientScriptBlock(Page, GetType(), "timezonecalc_clientscript", sb.ToString(), true); //for more/less
        }

        string timeZoneCalcCSS = "<style type=\"text/css\">" + GetLocalResourceObject("timezonecalc_style") + "</style>";
        Page.ClientScript.RegisterClientScriptBlock(GetType(), "timezonecalc_css", timeZoneCalcCSS);
    }

    private double ServerToClientBias()
    {
        double ServerBias = -1 * System.TimeZone.CurrentTimeZone.GetUtcOffset(DateTime.Now).TotalMinutes;
        double ClientBias = TimeZone.BiasForGivenDate(DateTime.Now);
        return -1 * (ClientBias - ServerBias);
    }

    #region EntityBoundSmartPartInfoProvider

    protected override void OnAddEntityBindings()
    {

    }

    public override Type EntityType
    {
        get { return typeof(Sage.Entity.Interfaces.IActivity); }
    }

    public override Sage.Platform.Application.UI.ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        ToolsSmartPartInfo tinfo = new ToolsSmartPartInfo();
        foreach (Control c in TZCalc_LTools.Controls)
        {
            tinfo.LeftTools.Add(c);
        }
        foreach (Control c in TZCalc_CTools.Controls)
        {
            tinfo.CenterTools.Add(c);
        }
        foreach (Control c in TZCalc_RTools.Controls)
        {
            tinfo.RightTools.Add(c);
        }
        return tinfo;
    }

    #endregion
}
