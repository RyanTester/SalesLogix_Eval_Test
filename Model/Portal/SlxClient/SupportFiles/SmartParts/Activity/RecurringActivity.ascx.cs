using System;
using System.Collections.Generic;
using System.Text;
using System.Web.UI;
using System.Web.UI.WebControls;
using Sage.Platform.WebPortal.SmartParts;
using Sage.Platform.WebPortal.Workspaces.Tab;
using Sage.SalesLogix.Activity;
using TimeZone = Sage.Platform.TimeZone;

public partial class SmartParts_Activity_RecurringActivity : EntityBoundSmartPartInfoProvider
{
    #region Private Properties

    private Activity Activity
    {
        get { return (Activity)BindingSource.Current; }
    }

    private ActivityFormHelper _ActivityFormHelper;
    private ActivityFormHelper Form
    {
        get { return _ActivityFormHelper; }
    }

    private TimeZone TimeZone
    {
        get { return (TimeZone)AppContext["TimeZone"]; }
    }

    #endregion

    #region Page Lifetime Events

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
        }

        RegisterClientScripts();

        if (ClientBindingMgr != null)
        {
            ClientBindingMgr.RegisterBoundControl(dtpStartRecurring);
            ClientBindingMgr.RegisterBoundControl(dtpEndRecurring);
        }

        LoadRecurrencePatternUIFromActivity();
        Form.Secure(Controls);
    }

    protected override void OnWireEventHandlers()
    {
        dtpStartRecurring.DateTimeValueChanged += dtpStartRecurring_DateTimeValueChanged;
        txtEndAfter.TextChanged += txtEndAfter_TextChanged;
        dtpEndRecurring.DateTimeValueChanged += dtpEndRecurring_DateTimeValueChanged;
        txtEveryDay.TextChanged += txtEveryDay_TextChanged;
        txtEveryDayAfterCompletion.TextChanged += afterCompletionTextChanged;
        rbEveryDay.CheckedChanged += rbEveryDay_CheckedChanged;
        rbEveryDayAfterCompletion.CheckedChanged += rbEveryDay_CheckedChanged;

        // weekly pattern handlers
        txtWeekly.TextChanged += txtWeekly_TextChanged;
        chkSunday.CheckedChanged += chkWeek_CheckedChanged;
        chkMonday.CheckedChanged += chkWeek_CheckedChanged;
        chkTuesday.CheckedChanged += chkWeek_CheckedChanged;
        chkWednesday.CheckedChanged += chkWeek_CheckedChanged;
        chkThursday.CheckedChanged += chkWeek_CheckedChanged;
        chkFriday.CheckedChanged += chkWeek_CheckedChanged;
        chkSaturday.CheckedChanged += chkWeek_CheckedChanged;
        txtWeeklyAfterCompletion.TextChanged += (afterCompletionTextChanged);
        rbEveryWeekly.CheckedChanged += rbEveryWeekly_CheckedChanged;
        rbEveryWeeklyAfterCompletion.CheckedChanged += rbEveryWeekly_CheckedChanged;

        //monthly pattern handlers
        txtEveryMonthOnDay.TextChanged += txtEveryMonthOnDay_TextChanged;
        txtEveryMonthOnTheDayOfWeek.TextChanged += txtEveryMonthOnTheDayOfWeek_TextChanged;
        ddlEveryMonthOnDay.SelectedIndexChanged += ddlEveryMonthOnDay_SelectedIndexChanged;
        rbEveryMonthOnDay.CheckedChanged += rbMonthly_CheckedChanged;
        rbEveryMonthOnTheDayOfWeek.CheckedChanged += rbMonthly_CheckedChanged;
        ddlWeekOfMonth.SelectedIndexChanged += ddlWeekOfMonth_SelectedIndexChanged;
        ddlMonthlyWeekDay.SelectedIndexChanged += ddlMonthlyWeekDay_SelectedIndexChanged;
        rbMonthsAfterCompletion.CheckedChanged += rbMonthly_CheckedChanged;
        txtMonthsAfterCompletion.TextChanged += afterCompletionTextChanged;

        //yearly pattern handlers
        txtYearlyOnDayOfTheMonth.TextChanged += txtYearlyOnDayOfTheMonth_TextChanged;
        ddlMonthOfTheYear.SelectedIndexChanged += ddlMonthOfTheYear_SelectedIndexChanged;
        ddlYearlyDayOfMonth.SelectedIndexChanged += ddlYearlyDayOfMonth_SelectedIndexChanged;
        rbYearlyEveryOnDayOfTheMonth.CheckedChanged += rbYearly_CheckedChanged;
        rbDayOfTheYear.CheckedChanged += rbYearly_CheckedChanged;
        ddlYearlyWeekOfMonth.SelectedIndexChanged += ddlYearlyWeekOfMonth_SelectedIndexChanged;
        ddlYearlyWeekDay.SelectedIndexChanged += ddlYearlyWeekDay_SelectedIndexChanged;
        ddlYearlyMonthOfYear.SelectedIndexChanged += ddlYearlyMonthOfYear_SelectedIndexChanged;
        rbYearlyAfterCompletion.CheckedChanged += rbYearly_CheckedChanged;
        txtYearlyAfterCompletion.TextChanged += afterCompletionTextChanged;

        base.OnWireEventHandlers();
    }

    #endregion

    #region EntityBoundSmartPart Methods

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
        foreach (Control c in LeftTools.Controls)
        {
            tinfo.LeftTools.Add(c);
        }
        foreach (Control c in CenterTools.Controls)
        {
            tinfo.CenterTools.Add(c);
        }
        foreach (Control c in RightTools.Controls)
        {
            tinfo.RightTools.Add(c);
        }
        return tinfo;
    }

    #endregion

    #region Server Control Event Handlers

    protected void rbRecurringType_SelectedIndexChanged(object sender, EventArgs e)
    {
        bool doLoad = false;
        switch (rbRecurringType.SelectedIndex)
        {
            case (0):
                if (Activity.RecurrencePattern.RecurrenceType != RecurrenceType.rtNone) doLoad = true;
                break;
            case (1):
                if (Activity.RecurrencePattern.RecurrenceType != RecurrenceType.rtDaily) doLoad = true;
                break;
            case (2):
                if (Activity.RecurrencePattern.RecurrenceType != RecurrenceType.rtWeekly) doLoad = true;
                break;
            case (3):
                if (Activity.RecurrencePattern.RecurrenceType != RecurrenceType.rtMonthly) doLoad = true;
                break;
            case (4):
                if (Activity.RecurrencePattern.RecurrenceType != RecurrenceType.rtYearly) doLoad = true;
                break;
        }

        if (doLoad)
        {
            LoadRecurrencePanel();
        }
    }

    //Duration Panel Handlers
    void dtpEndRecurring_DateTimeValueChanged(object sender, EventArgs e)
    {
        if (dtpEndRecurring.DateTimeValue != null)
        {
            DateTime endDate = (DateTime)(dtpEndRecurring.DateTimeValue);
            DateTime startDate = (DateTime)(dtpStartRecurring.DateTimeValue);
            if (endDate > startDate)
            {
                TimeSpan ts = new TimeSpan(endDate.Ticks - startDate.Ticks);

                int occurences = 0;
                switch (Activity.RecurrencePattern.RecurrenceType)
                {
                    case RecurrenceType.rtDaily:
                        occurences = Convert.ToInt32(ts.TotalDays / Activity.RecurrencePattern.Pattern.Daily.EveryXDays);
                        occurences++;  // add an occurrence to include the start date
                        break;
                    case RecurrenceType.rtWeekly:
                        occurences = GetNumberOccurrencesForPattern(Convert.ToInt32(ts.TotalDays));
                        break;
                    case RecurrenceType.rtMonthly:
                        occurences = Convert.ToInt32(ts.TotalDays / Activity.RecurrencePattern.Pattern.Daily.EveryXDays / 30);
                        occurences++;
                        break;
                    case RecurrenceType.rtYearly:
                        occurences = Convert.ToInt32(ts.TotalDays / Activity.RecurrencePattern.Pattern.Daily.EveryXDays / 365);
                        occurences++;
                        break;
                }


                Activity.RecurrencePattern.Range.NumOccurences = occurences;
                SaveActivity();
            }
        }
    }
    void txtEndAfter_TextChanged(object sender, EventArgs e)
    {
        if (txtEndAfter.Text != "")
        {
            Activity.RecurrencePattern.Range.NumOccurences = Convert.ToInt32(txtEndAfter.Text);
            SaveActivity();
        }
    }
    void dtpStartRecurring_DateTimeValueChanged(object sender, EventArgs e)
    {
        RebuildStartDateFromStartRecurringDate();

        switch (Activity.RecurrencePattern.RecurrenceType)
        {
            case RecurrenceType.rtDaily:
                break;
            case RecurrenceType.rtWeekly:
                ResetWeeklyRecurrence();
                break;
            case RecurrenceType.rtMonthly:
                ResetMonthlyRecurrence();
                break;
            case RecurrenceType.rtYearly:
                ResetYearlyRecurrence();
                break;
            default:
                break;
        }

        SaveActivity();

        //Notify General Tab to update Start Time display
        TabWorkspace ActivityTabs = PageWorkItem.Workspaces["TabControl"] as TabWorkspace;
        if (ActivityTabs != null)
        {
            TabInfo generalTab = ActivityTabs.GetTabByID("ActivityDetails");
            if (generalTab.WasUpdated)
                generalTab.Element.Panel.Update();
        }
    }

    //update after handlers
    void rbEveryWeekly_CheckedChanged(object sender, EventArgs e)
    {
        if (rbEveryWeekly.Checked)
        {
            Activity.RecurrencePattern.Range.Kind = RangeKind.rkEndAfterX;
            txtWeekly.Enabled = true;
            EnableWeeklyCheckBoxes(true);
            txtWeeklyAfterCompletion.Enabled = false;
            UpdateRecurrenceFrequencyPattern(txtWeekly);
        }
        else
        {
            Activity.RecurrencePattern.Range.Kind = RangeKind.rkNoEndDate;
            txtWeeklyAfterCompletion.Enabled = true;
            txtWeekly.Enabled = false;
            EnableWeeklyCheckBoxes(false);
            UpdateAfterCompletionFrequencyPattern(txtWeeklyAfterCompletion);
        }

        SaveActivity();
    }

    void rbEveryDay_CheckedChanged(object sender, EventArgs e)
    {
        if (rbEveryDay.Checked)
        {
            txtEveryDay.Enabled = true;
            txtEveryDayAfterCompletion.Enabled = false;
            UpdateRecurrenceFrequencyPattern(txtEveryDay);
        }
        else
        {
            txtEveryDayAfterCompletion.Enabled = true;
            txtEveryDay.Enabled = false;
            UpdateAfterCompletionFrequencyPattern(txtEveryDayAfterCompletion);
        }

        SaveActivity();
    }

    void afterCompletionTextChanged(object sender, EventArgs e)
    {
        TextBox txtAfterCompletion = (sender as TextBox);
        UpdateAfterCompletionFrequencyPattern(txtAfterCompletion);
        SaveActivity();
    }

    //Daily Recurrence Handlers
    void txtEveryDay_TextChanged(object sender, EventArgs e)
    {
        Activity.RecurrencePattern.Pattern.Daily.EveryXDays = Convert.ToInt32(txtEveryDay.Text);
        SaveActivity();
    }

    //Weekly Recurrence Handlers
    void txtWeekly_TextChanged(object sender, EventArgs e)
    {
        Activity.RecurrencePattern.Pattern.Weekly.WeeksBetweenOccurences = Convert.ToInt32(txtWeekly.Text);
        SaveActivity();
    }
    void chkWeek_CheckedChanged(object sender, EventArgs e)
    {
        UpdateDaysForWeeklyRecurrencePattern();
        EnforceDayOfTheWeekOnStartDate();
        SaveActivity();
    }


    //Monthly Recurrence Handlers
    void ddlEveryMonthOnDay_SelectedIndexChanged(object sender, EventArgs e)
    {
        Activity.RecurrencePattern.Pattern.Monthly.DayOfMonth.Day = Convert.ToInt32(ddlEveryMonthOnDay.SelectedValue);
        SaveActivity();
        SetStartDateFromMonthOnDay();

    }

    void txtEveryMonthOnDay_TextChanged(object sender, EventArgs e)
    {
        Activity.RecurrencePattern.Pattern.Monthly.EveryXMonths = Convert.ToInt32(txtEveryMonthOnDay.Text);
        SaveActivity();
        SetStartDateFromMonthOnDay();
    }
    void rbMonthly_CheckedChanged(object sender, EventArgs e)
    {
        if (rbEveryMonthOnDay.Checked)
        {
            Activity.RecurrencePattern.Range.NumOccurences = 2;
            Activity.RecurrencePattern.Pattern.Monthly.Kind = MonthlyOccurenceKind.moDayOfMonth;
            if (Activity.RecurrencePattern.Range.Kind == RangeKind.rkNoEndDate)
                Activity.RecurrencePattern.Range.Kind = RangeKind.rkEndAfterX;
        }
        else if (rbEveryMonthOnTheDayOfWeek.Checked)
        {
            Activity.RecurrencePattern.Range.NumOccurences = 2;
            Activity.RecurrencePattern.Pattern.Monthly.Kind = MonthlyOccurenceKind.moDayOfWeek;
            if (Activity.RecurrencePattern.Range.Kind == RangeKind.rkNoEndDate)
                Activity.RecurrencePattern.Range.Kind = RangeKind.rkEndAfterX;
        }
        else
        {
            txtMonthsAfterCompletion.Enabled = true;
            UpdateAfterCompletionFrequencyPattern(txtMonthsAfterCompletion);
        }

        ResetMonthlyRecurrence();
        SaveActivity();

        if (Activity.RecurrencePattern.Pattern.Monthly.Kind == MonthlyOccurenceKind.moDayOfMonth)
        {
            SetStartDateFromMonthOnDay();
        }
        else
        {
            UpdateStartDateForMonthlyRecurrencePattern();
        }
    }

    void ddlMonthlyWeekDay_SelectedIndexChanged(object sender, EventArgs e)
    {
        Activity.RecurrencePattern.Pattern.Monthly.DayOfWeek.Day = GetTypedDayOfTheMonthFromDayInTheWeek(Convert.ToInt32(ddlMonthlyWeekDay.SelectedValue));
        SaveActivity();
        UpdateStartDateForMonthlyRecurrencePattern();
    }

    void ddlWeekOfMonth_SelectedIndexChanged(object sender, EventArgs e)
    {
        Activity.RecurrencePattern.Pattern.Monthly.DayOfWeek.Modifier = GetModifierFromInt(Convert.ToInt32(ddlWeekOfMonth.SelectedValue));
        SaveActivity();
        UpdateStartDateForMonthlyRecurrencePattern();
    }

    void txtEveryMonthOnTheDayOfWeek_TextChanged(object sender, EventArgs e)
    {
        Activity.RecurrencePattern.Pattern.Monthly.EveryXMonths = Convert.ToInt32(txtEveryMonthOnTheDayOfWeek.Text);
        SaveActivity();
        UpdateStartDateForMonthlyRecurrencePattern();
    }

    //Yearly Recurrence Handlers
    void ddlMonthOfTheYear_SelectedIndexChanged(object sender, EventArgs e)
    {
        Activity.RecurrencePattern.Pattern.Yearly.Month = (Month)(Convert.ToInt32(ddlMonthOfTheYear.SelectedValue));
        SaveActivity();
    }
    void txtYearlyOnDayOfTheMonth_TextChanged(object sender, EventArgs e)
    {
        Activity.RecurrencePattern.Pattern.Yearly.EveryXYears = Convert.ToInt32(txtYearlyOnDayOfTheMonth.Text);
        SaveActivity();
    }
    void ddlYearlyDayOfMonth_SelectedIndexChanged(object sender, EventArgs e)
    {
        Activity.RecurrencePattern.Pattern.Yearly.Monthly.Day = Convert.ToInt32(ddlYearlyDayOfMonth.SelectedValue);
        SaveActivity();
    }
    void rbYearly_CheckedChanged(object sender, EventArgs e)
    {
        if (rbDayOfTheYear.Checked)
        {
            Activity.RecurrencePattern.Range.NumOccurences = 2;
            Activity.RecurrencePattern.Pattern.Yearly.Kind = YearlyOccurenceKind.yoDayOfMonth;
            if (Activity.RecurrencePattern.Range.Kind == RangeKind.rkNoEndDate)
                Activity.RecurrencePattern.Range.Kind = RangeKind.rkEndAfterX;
        }
        else if (rbYearlyEveryOnDayOfTheMonth.Checked)
        {
            Activity.RecurrencePattern.Range.NumOccurences = 2;
            Activity.RecurrencePattern.Pattern.Yearly.Kind = YearlyOccurenceKind.yoMonthly;
            if (Activity.RecurrencePattern.Range.Kind == RangeKind.rkNoEndDate)
                Activity.RecurrencePattern.Range.Kind = RangeKind.rkEndAfterX;
        }
        else
        {
            UpdateAfterCompletionFrequencyPattern(txtYearlyAfterCompletion);
        }

        SaveActivity();
        ResetYearlyRecurrence();
    }
    void ddlYearlyMonthOfYear_SelectedIndexChanged(object sender, EventArgs e)
    {
        Activity.RecurrencePattern.Pattern.Yearly.Month = GetMonthFromInt(Convert.ToInt32(ddlYearlyMonthOfYear.SelectedValue));
        SaveActivity();
    }
    void ddlYearlyWeekDay_SelectedIndexChanged(object sender, EventArgs e)
    {
        Activity.RecurrencePattern.Pattern.Yearly.DayOfMonth.Day = GetTypedDayOfTheMonthFromDayInTheWeek(Convert.ToInt32(ddlYearlyWeekDay.SelectedValue));
        SaveActivity();
    }
    void ddlYearlyWeekOfMonth_SelectedIndexChanged(object sender, EventArgs e)
    {
        Activity.RecurrencePattern.Pattern.Yearly.DayOfMonth.Modifier = GetModifierFromInt(Convert.ToInt32(ddlYearlyWeekOfMonth.SelectedValue));
        SaveActivity();
    }

    #endregion

    #region Private Methods

    //General
    private void SaveActivity()
    {
        Activity.RecurrencePattern.UpdateActivity(Activity);
    }

    private void LoadRecurrencePatternUIFromActivity()
    {
        if (!Activity.Recurring)
        {
            ClearRecurrenceTypePanels();
            pnlOnce.Style["display"] = "inline";
            pnlDuration.Style["display"] = "none";

            rbRecurringType.SelectedIndex = 0;
        }
        else
        {
            pnlDuration.Style["display"] = "inline"; // default

            switch (Activity.RecurrencePattern.RecurrenceType)
            {
                case RecurrenceType.rtDaily:
                    ClearRecurrenceTypePanels();
                    pnlDaily.Style["display"] = "inline";
                    rbRecurringType.SelectedIndex = 1;

                    rbEveryDay.Checked = (Activity.RecurrencePattern.Range.NumOccurences >= 0);
                    rbEveryDayAfterCompletion.Checked = (Activity.RecurrencePattern.Range.NumOccurences < 0);

                    if (rbEveryDay.Checked)
                    {
                        txtEveryDay.Enabled = true;
                        txtEveryDayAfterCompletion.Enabled = false;
                        txtEveryDay.Text = Activity.RecurrencePattern.Pattern.Daily.EveryXDays.ToString();
                    }
                    else if (rbEveryDayAfterCompletion.Checked)
                    {
                        txtEveryDayAfterCompletion.Enabled = true;
                        txtEveryDay.Enabled = false;
                        txtEveryDayAfterCompletion.Text = Activity.RecurrencePattern.Pattern.Daily.EveryXDays.ToString();
                        pnlDuration.Style["display"] = "none";
                    }

                    UpdateEndRecurringDateForDailyRecurrencePattern();

                    break;
                case RecurrenceType.rtWeekly:
                    ClearRecurrenceTypePanels();
                    pnlWeekly.Style["display"] = "inline";
                    rbRecurringType.SelectedIndex = 2;
                    txtWeekly.Text = Activity.RecurrencePattern.Pattern.Weekly.WeeksBetweenOccurences.ToString();

                    rbEveryWeekly.Checked = (Activity.RecurrencePattern.Range.NumOccurences >= 0);
                    rbEveryWeeklyAfterCompletion.Checked = (Activity.RecurrencePattern.Range.NumOccurences < 0);

                    if (rbEveryWeekly.Checked)
                    {
                        txtWeekly.Enabled = true;
                        txtWeeklyAfterCompletion.Enabled = false;
                        txtWeekly.Text = Activity.RecurrencePattern.Pattern.Weekly.WeeksBetweenOccurences.ToString();
                    }
                    else if (rbEveryWeeklyAfterCompletion.Checked)
                    {
                        txtWeeklyAfterCompletion.Enabled = true;
                        txtWeekly.Enabled = false;
                        txtWeeklyAfterCompletion.Text = Activity.RecurrencePattern.Pattern.Weekly.WeeksBetweenOccurences.ToString();
                        pnlDuration.Style["display"] = "none";
                    }

                    if (rbEveryWeekly.Checked)
                    {
                        chkMonday.Checked = ((Activity.RecurrencePattern.Pattern.Weekly.Days & Day.dayMonday) == Day.dayMonday);
                        chkTuesday.Checked = ((Activity.RecurrencePattern.Pattern.Weekly.Days & Day.dayTuesday) == Day.dayTuesday);
                        chkWednesday.Checked = ((Activity.RecurrencePattern.Pattern.Weekly.Days & Day.dayWednesday) == Day.dayWednesday);
                        chkThursday.Checked = ((Activity.RecurrencePattern.Pattern.Weekly.Days & Day.dayThursday) == Day.dayThursday);
                        chkFriday.Checked = ((Activity.RecurrencePattern.Pattern.Weekly.Days & Day.dayFriday) == Day.dayFriday);
                        chkSaturday.Checked = ((Activity.RecurrencePattern.Pattern.Weekly.Days & Day.daySaturday) == Day.daySaturday);
                        chkSunday.Checked = ((Activity.RecurrencePattern.Pattern.Weekly.Days & Day.daySunday) == Day.daySunday);
                    }

                    UpdateEndRecurringDateForWeeklyRecurrencePattern();

                    break;
                case RecurrenceType.rtMonthly:
                    ClearRecurrenceTypePanels();
                    pnlMonthly.Style["display"] = "inline";
                    rbRecurringType.SelectedIndex = 3;

                    rbMonthsAfterCompletion.Checked = (Activity.RecurrencePattern.Range.NumOccurences == -1);
                    if (!(rbMonthsAfterCompletion.Checked))
                    {
                        rbEveryMonthOnDay.Checked = (Activity.RecurrencePattern.Pattern.Monthly.Kind == MonthlyOccurenceKind.moDayOfMonth);
                        rbEveryMonthOnTheDayOfWeek.Checked = (Activity.RecurrencePattern.Pattern.Monthly.Kind == MonthlyOccurenceKind.moDayOfWeek);
                    }

                    if (rbMonthsAfterCompletion.Checked)
                    {
                        txtMonthsAfterCompletion.Enabled = true;
                        txtMonthsAfterCompletion.Text = Activity.RecurrencePattern.Pattern.Monthly.EveryXMonths.ToString();
                        pnlDuration.Style["display"] = "none";
                    }
                    else if (rbEveryMonthOnDay.Checked)
                    {
                        txtEveryMonthOnDay.Text = Activity.RecurrencePattern.Pattern.Monthly.EveryXMonths.ToString();
                        ddlEveryMonthOnDay.SelectedValue = Activity.RecurrencePattern.Pattern.Monthly.DayOfMonth.Day.ToString();

                        //reset these values
                        ddlWeekOfMonth.SelectedValue = "1";
                        ddlMonthlyWeekDay.SelectedValue = "1";
                        txtEveryMonthOnTheDayOfWeek.Text = "1";
                    }
                    else if (rbEveryMonthOnTheDayOfWeek.Checked)
                    {
                        ddlWeekOfMonth.SelectedValue = GetIntFromModifier(Activity.RecurrencePattern.Pattern.Monthly.DayOfWeek.Modifier).ToString();
                        ddlMonthlyWeekDay.SelectedValue = GetIntFromTypedDayOfMonth(Activity.RecurrencePattern.Pattern.Monthly.DayOfWeek.Day).ToString();
                        txtEveryMonthOnTheDayOfWeek.Text = Activity.RecurrencePattern.Pattern.Monthly.EveryXMonths.ToString();

                        //reset these values
                        txtEveryMonthOnDay.Text = "1";
                        ddlEveryMonthOnDay.SelectedValue = "1";
                    }

                    UpdateEndRecurringDateForMonthlyRecurrencePattern();
                    ResetMonthlyRecurrence();


                    break;
                case RecurrenceType.rtYearly:
                    ClearRecurrenceTypePanels();
                    pnlYear.Style["display"] = "inline";
                    rbRecurringType.SelectedIndex = 4;

                    rbYearlyAfterCompletion.Checked = (Activity.RecurrencePattern.Range.NumOccurences == -1);
                    if (!(rbYearlyAfterCompletion.Checked))
                    {
                        rbYearlyEveryOnDayOfTheMonth.Checked = (Activity.RecurrencePattern.Pattern.Yearly.Kind == YearlyOccurenceKind.yoMonthly);
                        rbDayOfTheYear.Checked = (Activity.RecurrencePattern.Pattern.Yearly.Kind == YearlyOccurenceKind.yoDayOfMonth);
                    }

                    if (rbYearlyAfterCompletion.Checked)
                    {
                        txtYearlyAfterCompletion.Enabled = true;
                        txtYearlyAfterCompletion.Text = Activity.RecurrencePattern.Pattern.Yearly.EveryXYears.ToString();
                        pnlDuration.Style["display"] = "none";

                        rbYearlyEveryOnDayOfTheMonth.Checked = false;
                        rbDayOfTheYear.Checked = false;
                    }
                    else if (rbYearlyEveryOnDayOfTheMonth.Checked)
                    {
                        ddlMonthOfTheYear.SelectedValue = ((int)(Activity.RecurrencePattern.Pattern.Yearly.Month)).ToString();
                        ddlYearlyDayOfMonth.SelectedValue = Activity.RecurrencePattern.Pattern.Yearly.Monthly.Day.ToString();
                        txtYearlyOnDayOfTheMonth.Text = Activity.RecurrencePattern.Pattern.Yearly.EveryXYears.ToString();

                        //reset these values
                        rbDayOfTheYear.Checked = false;
                        ddlYearlyMonthOfYear.SelectedValue = "1";
                        ddlYearlyWeekDay.SelectedValue = "1";
                        ddlYearlyWeekOfMonth.SelectedValue = "1";
                    }
                    else if (rbDayOfTheYear.Checked)
                    {

                        ddlYearlyMonthOfYear.SelectedValue = GetIntFromMonth(Activity.RecurrencePattern.Pattern.Yearly.Month).ToString();
                        ddlYearlyWeekDay.SelectedValue = GetIntFromTypedDayOfMonth(Activity.RecurrencePattern.Pattern.Yearly.DayOfMonth.Day).ToString();
                        ddlYearlyWeekOfMonth.SelectedValue = GetIntFromModifier(Activity.RecurrencePattern.Pattern.Yearly.DayOfMonth.Modifier).ToString();

                        //reset these values
                        ddlMonthOfTheYear.SelectedValue = GetIntFromMonth(Activity.RecurrencePattern.Pattern.Yearly.Month).ToString();
                        ddlYearlyDayOfMonth.SelectedValue = Activity.RecurrencePattern.Pattern.Yearly.Monthly.Day.ToString();
                    }

                    UpdateEndRecurringDateForYearlyRecurrencePattern();
                    ResetYearlyRecurrence();

                    break;
            }

            dtpStartRecurring.DateTimeValue = Activity.Timeless ?
                      Activity.StartDate : TimeZone.UTCDateTimeToLocalTime(Activity.StartDate);

            rbEndAfter.Checked = true;
            txtEndAfter.Text = Math.Abs(Activity.RecurrencePattern.Range.NumOccurences).ToString();
        }
    }

    private void ClearRecurrenceTypePanels()
    {
        pnlOnce.Style["display"] = "none";
        pnlDaily.Style["display"] = "none";
        pnlWeekly.Style["display"] = "none";
        pnlMonthly.Style["display"] = "none";
        pnlYear.Style["display"] = "none";
    }

    private void SetStartDateFromMonthOnDay()
    {
        DateTime tempdate = TimeZone.UTCDateTimeToLocalTime(Activity.StartDate);
        if (Activity.Timeless)
            tempdate = Activity.StartDate;

        int month = tempdate.Month;
        int year = tempdate.Year;
        DateTime startDate = new DateTime(year, month, Activity.RecurrencePattern.Pattern.Monthly.DayOfMonth.Day, tempdate.Hour, tempdate.Minute, 0);
        Activity.StartDate = TimeZone.LocalDateTimeToUTCTime(startDate);
    }

    private void LoadRecurrencePanel()
    {
        switch (rbRecurringType.SelectedIndex)
        {
            case 0:
                //pnlDuration.Style["display"] = "none";
                Activity.RecurrencePattern.RecurrenceType = RecurrenceType.rtNone;
                break;
            case 1:
                Activity.RecurrencePattern.RecurrenceType = RecurrenceType.rtDaily;

                Activity.RecurrencePattern.Pattern.Daily.Kind = DailyOccurenceKind.doEveryXDays;
                Activity.RecurrencePattern.Pattern.Daily.EveryXDays = 1;

                break;
            case 2:
                Activity.RecurrencePattern.RecurrenceType = RecurrenceType.rtWeekly;
                Activity.RecurrencePattern.Pattern.Weekly.WeeksBetweenOccurences = 1;
                ResetWeeklyRecurrence();

                break;
            case 3:

                Activity.RecurrencePattern.RecurrenceType = RecurrenceType.rtMonthly;
                Activity.RecurrencePattern.Pattern.Monthly.Kind = MonthlyOccurenceKind.moDayOfMonth;
                ResetMonthlyRecurrence();

                Activity.RecurrencePattern.Pattern.Monthly.EveryXMonths = 1;

                break;
            case 4:
                Activity.RecurrencePattern.RecurrenceType = RecurrenceType.rtYearly;

                Activity.RecurrencePattern.Pattern.Yearly.Kind = YearlyOccurenceKind.yoMonthly;
                ResetYearlyRecurrence();

                Activity.RecurrencePattern.Pattern.Yearly.EveryXYears = 1;

                break;
        }

        SaveActivity();
        Activity.RecurrencePattern.Range.NumOccurences = 2;
    }

    private void RebuildStartDateFromStartRecurringDate()
    {
        DateTime startDate = (DateTime)(dtpStartRecurring.DateTimeValue);

        DateTime tempDate = startDate;
        if (!Activity.Timeless)
            tempDate = TimeZone.UTCDateTimeToLocalTime(Activity.StartDate);

        int hour = tempDate.Hour;
        int min = tempDate.Minute;
        int sec = tempDate.Second;
        int year = startDate.Year;
        int month = startDate.Month;
        int day = startDate.Day;

        DateTime newDate = new DateTime(year, month, day, hour, min, sec);
        if (!Activity.Timeless)
            newDate = TimeZone.LocalDateTimeToUTCTime(newDate);

        Activity.StartDate = newDate;
    }

    // end after helpers
    private void UpdateAfterCompletionFrequencyPattern(TextBox txtAfterCompletion)
    {
        Activity.RecurrencePattern.Range.NumOccurences = -1;
        GetAndUpdateRecurrenceFrequency(txtAfterCompletion);
    }

    private void UpdateRecurrenceFrequencyPattern(TextBox txtAfterCompletion)
    {
        Activity.RecurrencePattern.Range.NumOccurences = 2;
        GetAndUpdateRecurrenceFrequency(txtAfterCompletion);
    }

    private void GetAndUpdateRecurrenceFrequency(TextBox txtAfterCompletion)
    {
        int frequency = GetRecurFrequencyFromEndAfterTextBox(txtAfterCompletion);
        UpdateRecurrenceFrequency(txtAfterCompletion, frequency);
    }

    private void UpdateRecurrenceFrequency(Control txtAfterCompletion, int frequency)
    {
        switch (txtAfterCompletion.ID)
        {
            case "txtEveryDayAfterCompletion":
            case "txtEveryDay":
                Activity.RecurrencePattern.Pattern.Daily.EveryXDays = frequency;
                break;
            case "txtWeeklyAfterCompletion":
                Activity.RecurrencePattern.Pattern.Weekly.WeeksBetweenOccurences = frequency;
                break;
            case "txtWeekly":
                Activity.RecurrencePattern.Pattern.Weekly.WeeksBetweenOccurences = frequency;
                break;
            case "txtMonthsAfterCompletion":
                Activity.RecurrencePattern.Pattern.Monthly.EveryXMonths = frequency;
                break;
            case "txtYearlyAfterCompletion":
                Activity.RecurrencePattern.Pattern.Yearly.EveryXYears = frequency;
                break;
        }
    }
    private static int GetRecurFrequencyFromEndAfterTextBox(TextBox txtAfterCompletion)
    {
        int frequency = 1;
        if (txtAfterCompletion != null)
        {
            if (txtAfterCompletion.Text != "")
                frequency = Convert.ToInt32(txtAfterCompletion.Text);
        }
        return frequency;
    }

    //Daily recurrence
    private void UpdateEndRecurringDateForDailyRecurrencePattern()
    {
        dtpEndRecurring.DateTimeValue = Activity.EndDate;
    }

    // weekly recurrence
    private void UpdateDaysForWeeklyRecurrencePattern()
    {
        Activity.RecurrencePattern.Pattern.Weekly.Days = 0;
        if (chkMonday.Checked)
            Activity.RecurrencePattern.Pattern.Weekly.Days = Activity.RecurrencePattern.Pattern.Weekly.Days | Day.dayMonday;
        if (chkTuesday.Checked)
            Activity.RecurrencePattern.Pattern.Weekly.Days = Activity.RecurrencePattern.Pattern.Weekly.Days | Day.dayTuesday;
        if (chkWednesday.Checked)
            Activity.RecurrencePattern.Pattern.Weekly.Days = Activity.RecurrencePattern.Pattern.Weekly.Days | Day.dayWednesday;
        if (chkThursday.Checked)
            Activity.RecurrencePattern.Pattern.Weekly.Days = Activity.RecurrencePattern.Pattern.Weekly.Days | Day.dayThursday;
        if (chkFriday.Checked)
            Activity.RecurrencePattern.Pattern.Weekly.Days = Activity.RecurrencePattern.Pattern.Weekly.Days | Day.dayFriday;
        if (chkSaturday.Checked)
            Activity.RecurrencePattern.Pattern.Weekly.Days = Activity.RecurrencePattern.Pattern.Weekly.Days | Day.daySaturday;
        if (chkSunday.Checked)
            Activity.RecurrencePattern.Pattern.Weekly.Days = Activity.RecurrencePattern.Pattern.Weekly.Days | Day.daySunday;
    }

    private void UpdateEndRecurringDateForWeeklyRecurrencePattern()
    {
        dtpEndRecurring.DateTimeValue = Activity.EndDate;
    }

    private int GetNumberOccurrencesForPattern(int totalDays)
    {
        List<int> weeklyPattern = GetWeeklyPattern();
        int currentWeek = Activity.RecurrencePattern.Pattern.Weekly.WeeksBetweenOccurences;
        int dayDelta = 0;
        int occurrences = 0;
        DateTime localDateTime = TimeZone.UTCDateTimeToLocalTime(Activity.StartDate);

        while (dayDelta < totalDays)
        {
            foreach (int day in weeklyPattern)
            {
                dayDelta = ((currentWeek - 1) * 7) + (day - (int)(localDateTime.DayOfWeek));
                occurrences++;
            }
            currentWeek += Activity.RecurrencePattern.Pattern.Weekly.WeeksBetweenOccurences;
        }
        return occurrences;
    }

    private List<int> GetWeeklyPattern()
    {
        List<int> weeklyPattern = new List<int>();
        if ((Activity.RecurrencePattern.Pattern.Weekly.Days & Day.daySunday) == Day.daySunday)
            weeklyPattern.Add(0);
        if ((Activity.RecurrencePattern.Pattern.Weekly.Days & Day.dayMonday) == Day.dayMonday)
            weeklyPattern.Add(1);
        if ((Activity.RecurrencePattern.Pattern.Weekly.Days & Day.dayTuesday) == Day.dayTuesday)
            weeklyPattern.Add(2);
        if ((Activity.RecurrencePattern.Pattern.Weekly.Days & Day.dayWednesday) == Day.dayWednesday)
            weeklyPattern.Add(3);
        if ((Activity.RecurrencePattern.Pattern.Weekly.Days & Day.dayThursday) == Day.dayThursday)
            weeklyPattern.Add(4);
        if ((Activity.RecurrencePattern.Pattern.Weekly.Days & Day.dayFriday) == Day.dayFriday)
            weeklyPattern.Add(5);
        if ((Activity.RecurrencePattern.Pattern.Weekly.Days & Day.daySaturday) == Day.daySaturday)
            weeklyPattern.Add(6);
        return weeklyPattern;
    }

    private void ResetWeeklyRecurrence()
    {
        DateTime tempDate = GetLocalStartDate();
        Activity.RecurrencePattern.Pattern.Weekly.Days = DayOfTheWeekToDay(tempDate.DayOfWeek);
    }

    private void EnforceDayOfTheWeekOnStartDate()
    {
        DateTime localDateTime = GetLocalStartDate();

        switch (localDateTime.DayOfWeek)
        {
            case DayOfWeek.Monday:
                Activity.RecurrencePattern.Pattern.Weekly.Days = Activity.RecurrencePattern.Pattern.Weekly.Days | Day.dayMonday;
                break;
            case DayOfWeek.Tuesday:
                Activity.RecurrencePattern.Pattern.Weekly.Days = Activity.RecurrencePattern.Pattern.Weekly.Days | Day.dayTuesday;
                break;
            case DayOfWeek.Wednesday:
                Activity.RecurrencePattern.Pattern.Weekly.Days = Activity.RecurrencePattern.Pattern.Weekly.Days | Day.dayWednesday;
                break;
            case DayOfWeek.Thursday:
                Activity.RecurrencePattern.Pattern.Weekly.Days = Activity.RecurrencePattern.Pattern.Weekly.Days | Day.dayThursday;
                break;
            case DayOfWeek.Friday:
                Activity.RecurrencePattern.Pattern.Weekly.Days = Activity.RecurrencePattern.Pattern.Weekly.Days | Day.dayFriday;
                break;
            case DayOfWeek.Saturday:
                Activity.RecurrencePattern.Pattern.Weekly.Days = Activity.RecurrencePattern.Pattern.Weekly.Days | Day.daySaturday;
                break;
            case DayOfWeek.Sunday:
                Activity.RecurrencePattern.Pattern.Weekly.Days = Activity.RecurrencePattern.Pattern.Weekly.Days | Day.daySunday;
                break;
        }
    }

    private void EnableWeeklyCheckBoxes(bool enabled)
    {
        chkSunday.Enabled = enabled;
        chkMonday.Enabled = enabled;
        chkTuesday.Enabled = enabled;
        chkWednesday.Enabled = enabled;
        chkThursday.Enabled = enabled;
        chkFriday.Enabled = enabled;
        chkSaturday.Enabled = enabled;
    }

    // Monthly Recurrence
    private void UpdateEndRecurringDateForMonthlyRecurrencePattern()
    {
        dtpEndRecurring.DateTimeValue = Activity.EndDate;
    }

    private void ResetMonthlyRecurrence()
    {
        DateTime tempDate = GetLocalStartDate();

        if (rbMonthsAfterCompletion.Checked)
        {
            txtEveryMonthOnTheDayOfWeek.Enabled = false;
            ddlWeekOfMonth.Enabled = false;
            ddlMonthlyWeekDay.Enabled = false;
            txtEveryMonthOnDay.Enabled = false;
            ddlEveryMonthOnDay.Enabled = false;
            txtMonthsAfterCompletion.Enabled = true;
        }
        else if (Activity.RecurrencePattern.Pattern.Monthly.Kind == MonthlyOccurenceKind.moDayOfMonth)
        {
            Activity.RecurrencePattern.Pattern.Monthly.DayOfMonth.Day = tempDate.Day;

            txtEveryMonthOnTheDayOfWeek.Enabled = false;
            ddlWeekOfMonth.Enabled = false;
            ddlMonthlyWeekDay.Enabled = false;
            txtEveryMonthOnDay.Enabled = true;
            ddlEveryMonthOnDay.Enabled = true;
            txtMonthsAfterCompletion.Enabled = false;
        }
        else if (Activity.RecurrencePattern.Pattern.Monthly.Kind == MonthlyOccurenceKind.moDayOfWeek)
        {
            int adjustedDay = (int)(tempDate.DayOfWeek) + 1;
            Activity.RecurrencePattern.Pattern.Monthly.DayOfWeek.Day = GetTypedDayOfTheMonthFromDayInTheWeek(adjustedDay);
            Activity.RecurrencePattern.Pattern.Monthly.DayOfWeek.Modifier = GetModifierFromInt(GetWeekOfMonthFromDate(tempDate));

            txtEveryMonthOnTheDayOfWeek.Enabled = true;
            ddlWeekOfMonth.Enabled = true;
            ddlMonthlyWeekDay.Enabled = true;
            txtEveryMonthOnDay.Enabled = false;
            ddlEveryMonthOnDay.Enabled = false;
            txtMonthsAfterCompletion.Enabled = false;
        }
    }

    //Yearly Recurrence
    private void UpdateStartDateForMonthlyRecurrencePattern()
    {
        // change the start date
        DateTime tempdate = GetLocalStartDate();

        int weekOfTheMonth = GetIntFromModifier(Activity.RecurrencePattern.Pattern.Monthly.DayOfWeek.Modifier);
        int dayOfWeek = GetIntFromTypedDayOfMonth(Activity.RecurrencePattern.Pattern.Monthly.DayOfWeek.Day) - 1;
        int newDay = GetDayOfTheMonthFromWeekAndDay(Activity.StartDate.Year, weekOfTheMonth, dayOfWeek, tempdate.Month);

        int year = tempdate.Year;
        int month = tempdate.Month;
        int hour = tempdate.Hour;
        int minute = tempdate.Minute;

        DateTime newStartDate = new DateTime(year, month, newDay, hour, minute, 0);
        SetLocalStartDate(newStartDate);
    }

    private void UpdateStartDateForYearlyRecurrencePattern()
    {
        // change the start date
        DateTime tempdate = GetLocalStartDate();

        // change the start date
        int weekOfTheMonth = GetIntFromModifier(Activity.RecurrencePattern.Pattern.Yearly.DayOfMonth.Modifier);
        int dayOfWeek = GetIntFromTypedDayOfMonth(Activity.RecurrencePattern.Pattern.Yearly.DayOfMonth.Day) - 1;
        int month = (int)(Activity.RecurrencePattern.Pattern.Yearly.Month);
        int newDay = GetDayOfTheMonthFromWeekAndDay(Activity.StartDate.Year, weekOfTheMonth, dayOfWeek, month);

        int year = tempdate.Year;
        int hour = tempdate.Hour;
        int minute = tempdate.Minute;

        DateTime newStartDate = new DateTime(year, month, newDay, hour, minute, 0);
        SetLocalStartDate(newStartDate);

    }

    private void UpdateEndRecurringDateForYearlyRecurrencePattern()
    {
        if (Activity.RecurrencePattern.Pattern.Yearly.Kind == YearlyOccurenceKind.yoMonthly)
        {
            DateTime tempdate = GetLocalStartDate();

            int month = (int)(Activity.RecurrencePattern.Pattern.Yearly.Month);
            int day = Activity.RecurrencePattern.Pattern.Yearly.Monthly.Day;
            int year = Activity.StartDate.Year;

            DateTime newDate = new DateTime(year, month, day, tempdate.Hour, tempdate.Minute, 0);
            SetLocalStartDate(newDate);
        }
        else
        {
            UpdateStartDateForYearlyRecurrencePattern();
        }

        dtpEndRecurring.DateTimeValue = Activity.EndDate;
    }

    private void ResetYearlyRecurrence()
    {
        DateTime tempDate = GetLocalStartDate();

        if (rbYearlyAfterCompletion.Checked)
        {
            txtYearlyAfterCompletion.Enabled = true;
            txtYearlyOnDayOfTheMonth.Enabled = false;
            ddlMonthOfTheYear.Enabled = false;
            ddlYearlyDayOfMonth.Enabled = false;
            ddlYearlyWeekOfMonth.Enabled = false;
            ddlYearlyWeekDay.Enabled = false;
            ddlYearlyMonthOfYear.Enabled = false;
        }
        else if (Activity.RecurrencePattern.Pattern.Yearly.Kind == YearlyOccurenceKind.yoMonthly)
        {
            Activity.RecurrencePattern.Pattern.Yearly.Monthly.Day = tempDate.Day;
            Activity.RecurrencePattern.Pattern.Yearly.Month = GetMonthFromInt(tempDate.Month);

            txtYearlyOnDayOfTheMonth.Enabled = true;
            ddlMonthOfTheYear.Enabled = true;
            ddlYearlyDayOfMonth.Enabled = true;

            ddlYearlyWeekOfMonth.Enabled = false;
            ddlYearlyWeekDay.Enabled = false;
            ddlYearlyMonthOfYear.Enabled = false;
            txtYearlyAfterCompletion.Enabled = false;
        }
        else if (Activity.RecurrencePattern.Pattern.Yearly.Kind == YearlyOccurenceKind.yoDayOfMonth)
        {
            Activity.RecurrencePattern.Pattern.Yearly.Month = GetMonthFromInt(tempDate.Month);
            int adjustedDay = (int)(tempDate.DayOfWeek) + 1;
            Activity.RecurrencePattern.Pattern.Yearly.DayOfMonth.Day = GetTypedDayOfTheMonthFromDayInTheWeek(adjustedDay);
            Activity.RecurrencePattern.Pattern.Yearly.DayOfMonth.Modifier = GetModifierFromInt(GetWeekOfMonthFromDate(tempDate));

            txtYearlyOnDayOfTheMonth.Enabled = false;
            ddlMonthOfTheYear.Enabled = false;
            ddlYearlyDayOfMonth.Enabled = false;

            ddlYearlyWeekOfMonth.Enabled = true;
            ddlYearlyWeekDay.Enabled = true;
            ddlYearlyMonthOfYear.Enabled = true;
            txtYearlyAfterCompletion.Enabled = false;
        }
    }

    private DateTime GetLocalStartDate()
    {
        return !Activity.Timeless
            ? TimeZone.UTCDateTimeToLocalTime(Activity.StartDate)
            : Activity.StartDate;
    }

    private void SetLocalStartDate(DateTime localDateTime)
    {
        Activity.StartDate = !Activity.Timeless
            ? TimeZone.LocalDateTimeToUTCTime(localDateTime)
            : localDateTime.Date.AddSeconds(5);
    }

    private static int GetWeekOfMonthFromDate(DateTime StartDate)
    {
        int currentDayOfTheWeek = (int)(StartDate.DayOfWeek);
        int currentDay = StartDate.Day;
        int currentMonth = StartDate.Month;
        int currentYear = StartDate.Year;

        int daysInCurrentMonth = DateTime.DaysInMonth(currentYear, currentMonth);
        int weekCount = 0;
        for (int i = 1; i <= daysInCurrentMonth; i++)
        {
            DateTime newDate = new DateTime(currentYear, currentMonth, i);
            if ((int)(newDate.DayOfWeek) == currentDayOfTheWeek)
                weekCount++;

            if (i == currentDay)
                break;
        }
        return weekCount;
    }

    private static int GetLastWeekOfTheMonthForDay(int year, int month, int day)
    {
        int daysInCurrentMonth = DateTime.DaysInMonth(year, month);
        int weekCount = 0;
        for (int i = 1; i <= daysInCurrentMonth; i++)
        {
            DateTime newDate = new DateTime(year, month, i);
            if ((int)(newDate.DayOfWeek) == day)
                weekCount++;

        }
        return weekCount;
    }

    private static int GetDayOfTheMonthFromWeekAndDay(int year, int weekOfTheMonth, int dayOfTheWeek, int month)
    {
        // get the proper last week of the month for the given day
        if (weekOfTheMonth == 5)
        {
            weekOfTheMonth = GetLastWeekOfTheMonthForDay(year, month, dayOfTheWeek);
        }

        int daysInCurrentMonth = DateTime.DaysInMonth(year, month);

        int weekCount = 1;
        for (int i = 1; i <= daysInCurrentMonth; i++)
        {
            DateTime newDate = new DateTime(year, month, i);

            if ((weekCount == weekOfTheMonth) && ((int)(newDate.DayOfWeek) == dayOfTheWeek))
                return i;

            if ((int)(newDate.DayOfWeek) == dayOfTheWeek)
                weekCount++;
        }
        return daysInCurrentMonth;
    }

    // Scripts
    private new void RegisterClientScripts()
    {
        StringBuilder sb = new StringBuilder(GetLocalResourceObject("RecurringActivity_ClientScript").ToString());

        ScriptManager.RegisterClientScriptBlock(Page, GetType(), "RecurringActivity", sb.ToString(), true);
    }

    #endregion

    // TODO: These don't belong here, refactor
    #region Private Activity Enumeration Support Methods

    private static TypedDayOfMonth GetTypedDayOfTheMonthFromDayInTheWeek(int DayInTheWeek)
    {
        switch (DayInTheWeek)
        {
            case 1:
                return TypedDayOfMonth.tdmSunday;
            case 2:
                return TypedDayOfMonth.tdmMonday;
            case 3:
                return TypedDayOfMonth.tdmTuesday;
            case 4:
                return TypedDayOfMonth.tdmWednesday;
            case 5:
                return TypedDayOfMonth.tdmThursday;
            case 6:
                return TypedDayOfMonth.tdmFriday;
            case 7:
                return TypedDayOfMonth.tdmSaturday;
            case 8:
                return TypedDayOfMonth.tdmDay;
            case 9:
                return TypedDayOfMonth.tdmWeekDay;
            case 10:
                return TypedDayOfMonth.tdmWeekend;
            default:
                return TypedDayOfMonth.tdmDay;
        }
    }

    private static Day DayOfTheWeekToDay(DayOfWeek dayOfTheWeek)
    {
        switch (dayOfTheWeek)
        {
            case DayOfWeek.Sunday:
                return Day.daySunday;
            case DayOfWeek.Monday:
                return Day.dayMonday;
            case DayOfWeek.Tuesday:
                return Day.dayTuesday;
            case DayOfWeek.Wednesday:
                return Day.dayWednesday;
            case DayOfWeek.Thursday:
                return Day.dayThursday;
            case DayOfWeek.Friday:
                return Day.dayFriday;
            case DayOfWeek.Saturday:
                return Day.daySaturday;
            default:
                return Day.dayMonday;
        }
    }

    private static int GetIntFromTypedDayOfMonth(TypedDayOfMonth DayOfMonth)
    {
        switch (DayOfMonth)
        {
            case TypedDayOfMonth.tdmSunday:
                return 1;
            case TypedDayOfMonth.tdmMonday:
                return 2;
            case TypedDayOfMonth.tdmTuesday:
                return 3;
            case TypedDayOfMonth.tdmWednesday:
                return 4;
            case TypedDayOfMonth.tdmThursday:
                return 5;
            case TypedDayOfMonth.tdmFriday:
                return 6;
            case TypedDayOfMonth.tdmSaturday:
                return 7;
            case TypedDayOfMonth.tdmDay:
                return 8;
            case TypedDayOfMonth.tdmWeekDay:
                return 9;
            case TypedDayOfMonth.tdmWeekend:
                return 10;
            default:
                return 0;
        }
    }

    private static Month GetMonthFromInt(int MonthOfTheYear)
    {
        switch (MonthOfTheYear)
        {
            case 1:
                return Month.January;
            case 2:
                return Month.February;
            case 3:
                return Month.March;
            case 4:
                return Month.April;
            case 5:
                return Month.May;
            case 6:
                return Month.June;
            case 7:
                return Month.July;
            case 8:
                return Month.August;
            case 9:
                return Month.September;
            case 10:
                return Month.October;
            case 11:
                return Month.November;
            case 12:
                return Month.December;
            default:
                return Month.January;
        }
    }

    private static int GetIntFromMonth(Month MonthOfTheYear)
    {
        switch (MonthOfTheYear)
        {
            case Month.January:
                return 1;
            case Month.February:
                return 2;
            case Month.March:
                return 3;
            case Month.April:
                return 4;
            case Month.May:
                return 5;
            case Month.June:
                return 6;
            case Month.July:
                return 7;
            case Month.August:
                return 8;
            case Month.September:
                return 9;
            case Month.October:
                return 10;
            case Month.November:
                return 11;
            case Month.December:
                return 12;
            default:
                return 0;
        }
    }

    private static MonthDayModifier GetModifierFromInt(int WeekOfTheMonth)
    {
        switch (WeekOfTheMonth)
        {
            case 0:
                return MonthDayModifier.mdmOnly;
            case 1:
                return MonthDayModifier.mdmFirst;
            case 2:
                return MonthDayModifier.mdmSecond;
            case 3:
                return MonthDayModifier.mdmThird;
            case 4:
                return MonthDayModifier.mdmFourth;
            case 5:
                return MonthDayModifier.mdmLast;
            default:
                return MonthDayModifier.mdmFirst;
        }
    }

    private static int GetIntFromModifier(MonthDayModifier modifier)
    {
        switch (modifier)
        {
            case MonthDayModifier.mdmOnly:
                return 0;
            case MonthDayModifier.mdmFirst:
                return 1;
            case MonthDayModifier.mdmSecond:
                return 2;
            case MonthDayModifier.mdmThird:
                return 3;
            case MonthDayModifier.mdmFourth:
                return 4;
            case MonthDayModifier.mdmLast:
                return 5;
            default:
                return 0;
        }
    }

    #endregion
}
