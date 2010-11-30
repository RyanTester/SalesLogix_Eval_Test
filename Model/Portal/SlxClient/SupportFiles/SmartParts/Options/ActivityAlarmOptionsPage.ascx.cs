using System;
using System.Collections.Generic;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Text;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using Sage.SalesLogix.Activity;
using Sage.SalesLogix.Client.GroupBuilder;
using Sage.SalesLogix.WebUserOptions;
using Sage.Platform.Application;
using Sage.Platform.Application.Services;
using Sage.Platform;
using Sage.SalesLogix.Security;
using Sage.Entity.Interfaces;
using Sage.Platform.Security;
using Sage.Platform.Application.UI;
using Sage.SalesLogix;

public partial class ActivityAlarmOptionsPage : System.Web.UI.UserControl, ISmartPartInfoProvider
{
    private string _Category = "Calendar";

    protected void Page_PreRender(object sender, EventArgs e)
    {
        ActivityAlarmOptions options = null;
        options = ActivityAlarmOptions.Load(Server.MapPath(@"App_Data\LookupValues"));
        // set defaults
        if (options.ShowActivitiesFor != "")
        {
            foreach (ListItem li in _showActivitiesFor.Items)
                li.Selected = (options.ShowActivitiesFor.Contains(li.Value));
        }
        else
        {
            string curUserId =
                ((SLXUserService)(ApplicationContext.Current.Services.Get<IUserService>())).GetUser().Id.Trim();
            Utility.SetSelectedValue(_showActivitiesFor, curUserId);
        }
        Utility.SetSelectedValue(_defaultView, options.DefaultView);
        Utility.SetSelectedValue(_timeFrame, options.TimeFrame);
        Utility.SetSelectedValue(_defaultFollowupActivity, options.DefaultFollowupActivity);
        Utility.SetSelectedValue(_carryOverNotes, options.CarryOverNotes);
        Utility.SetSelectedValue(_carryOverAttachments, options.CarryOverAttachments);
        Utility.SetSelectedValue(_alarmDefaultLead, options.AlarmDefaultLead);

        _alarmDefaultLeadValue.Text = options.AlarmDefaultLeadValue.ToString();

        IUserOptionsService userOption = ApplicationContext.Current.Services.Get<IUserOptionsService>();
        if (userOption.GetCommonOption("DisplayActivityReminders", _Category) == "F")
        {
            _ShowReminders.SelectedIndex = 1;
            _ShowPastDue.Enabled = false;
            _ShowConfirms.Enabled = false;
            _ShowAlarms.Enabled = false;
            lblShowAlarms.Enabled = false;
            lblShowConfirms.Enabled = false;
            lblShowPastDue.Enabled = false;
        }
        else
        {
            _ShowReminders.SelectedIndex = 0;
            _ShowPastDue.Enabled = true;
            _ShowConfirms.Enabled = true;
            _ShowAlarms.Enabled = true;
            lblShowAlarms.Enabled = true;
            lblShowConfirms.Enabled = true;
            lblShowPastDue.Enabled = true;
        }
        if (userOption.GetCommonOption("RemindPastDue", _Category) == "F")
        {
            _ShowPastDue.SelectedIndex = 1;
        }
        if (userOption.GetCommonOption("RemindConfirmations", _Category) == "F")
        {
            _ShowConfirms.SelectedIndex = 1;
        }
        if (userOption.GetCommonOption("RemindAlarms", _Category) == "F")
        {
            _ShowAlarms.SelectedIndex = 1;
        }
        GenerateScript();
    }

    private void GenerateScript()
    {
        StringBuilder scp = new StringBuilder();
        scp.AppendLine("function ToggleEnabled()");
        scp.AppendLine("{");
        scp.AppendFormat("var showReminders = document.getElementById('{0}');", _ShowReminders.ClientID);
        scp.AppendFormat("var showAlarms = document.getElementById('{0}');", _ShowAlarms.ClientID);
        scp.AppendFormat("var showConfirms = document.getElementById('{0}');", _ShowConfirms.ClientID);
        scp.AppendFormat("var showPastDue = document.getElementById('{0}');", _ShowPastDue.ClientID);
        scp.AppendLine("var disabled = showReminders.selectedIndex == 1;");
        scp.AppendLine("showAlarms.disabled = disabled;");
        scp.AppendLine("showConfirms.disabled = disabled;");
        scp.AppendLine("showPastDue.disabled = disabled;");
        scp.AppendLine("}");
        ScriptManager.RegisterStartupScript(Page, GetType(), ClientID, scp.ToString(), true);
    }

    protected void Page_Load(object sender, EventArgs e)
    {
        //if (!IsPostBack)
        //{
        // initialize

        ActivityAlarmOptions options = null;
        try
        {
            options = ActivityAlarmOptions.Load(Server.MapPath(@"App_Data\LookupValues"));
        }
        catch
        {
            // temporary, as the service throws an exception for options not found
            // the service is not yet complete, but this allows testing of the UI
            options = ActivityAlarmOptions.CreateNew(Server.MapPath(@"App_Data\LookupValues"));
        }

        _defaultView.DataSource = options.DefaultViewLookupList;
        _defaultView.DataTextField = options.DataTextField;
        _defaultView.DataValueField = options.DataValueField;
        _timeFrame.DataSource = options.TimeFrameLookupList;
        _timeFrame.DataTextField = options.DataTextField;
        _timeFrame.DataValueField = options.DataValueField;
        _defaultFollowupActivity.DataSource = options.DefaultFollowupActivityLookupList;
        _defaultFollowupActivity.DataTextField = options.DataTextField;
        _defaultFollowupActivity.DataValueField = options.DataValueField;
        _carryOverNotes.DataSource = options.CarryOverNotesLookupList;
        _carryOverNotes.DataTextField = options.DataTextField;
        _carryOverNotes.DataValueField = options.DataValueField;
        _carryOverAttachments.DataSource = options.CarryOverAttachmentsLookupList;
        _carryOverAttachments.DataTextField = options.DataTextField;
        _carryOverAttachments.DataValueField = options.DataValueField;
        _alarmDefaultLead.DataSource = options.AlarmDefaultLeadLookupList;
        _alarmDefaultLead.DataTextField = options.DataTextField;
        _alarmDefaultLead.DataValueField = options.DataValueField;


        Sage.SalesLogix.Security.SLXUserService slxUserService = ApplicationContext.Current.Services.Get<Sage.Platform.Security.IUserService>() as Sage.SalesLogix.Security.SLXUserService;
        string currentUserID = slxUserService.GetUser().Id.ToString();
        IList<IUser> calUsers = UserCalendar.GetCalendarUsers(currentUserID);
        SortedList sl = new SortedList();
        foreach (IUser calUser in calUsers)
        {
            if ((calUser != null) && (!sl.Contains(calUser.ToString())))
            {
                sl.Add(calUser.ToString(), calUser.Id);
            }
        }
        _showActivitiesFor.SelectionMode = ListSelectionMode.Multiple;
        _showActivitiesFor.DataSource = sl;
        _showActivitiesFor.DataValueField = "VALUE";
        _showActivitiesFor.DataTextField = "KEY";
        Page.DataBind();

        //}
    }

    protected void _save_Click(object sender, EventArgs e)
    {
        // save values
        ActivityAlarmOptions options = new ActivityAlarmOptions(Server.MapPath(@"App_Data\LookupValues"));
        foreach (ListItem li in _showActivitiesFor.Items)
            if (li.Selected)
                options.ShowActivitiesFor += "|" + li.Value;
        if (options.ShowActivitiesFor.Length > 0)
            options.ShowActivitiesFor = options.ShowActivitiesFor.Remove(0, 1);
        options.DefaultView = _defaultView.SelectedValue;
        options.TimeFrame = _timeFrame.SelectedValue;
        options.DefaultFollowupActivity = _defaultFollowupActivity.SelectedValue;
        options.CarryOverNotes = _carryOverNotes.SelectedValue;
        options.CarryOverAttachments = _carryOverAttachments.SelectedValue;
        options.AlarmDefaultLead = _alarmDefaultLead.SelectedValue;
        options.AlarmDefaultLeadValue = System.Convert.ToInt32(_alarmDefaultLeadValue.Text);

        options.Save();

        IUserOptionsService userOption = ApplicationContext.Current.Services.Get<IUserOptionsService>();
        userOption.SetCommonOption("DisplayActivityReminders", _Category, _ShowReminders.Items[0].Selected ? "T" : "F", false);
        userOption.SetCommonOption("RemindPastDue", _Category, _ShowPastDue.Items[0].Selected ? "T" : "F", false);
        userOption.SetCommonOption("RemindConfirmations", _Category, _ShowConfirms.Items[0].Selected ? "T" : "F", false);
        userOption.SetCommonOption("RemindAlarms", _Category, _ShowAlarms.Items[0].Selected ? "T" : "F", false);

        IContextService context = ApplicationContext.Current.Services.Get<IContextService>(true);
        string value = string.Format("{0}|{1}|{2}|{3}",
            _ShowReminders.Items[0].Selected,
            _ShowAlarms.Items[0].Selected,
            _ShowPastDue.Items[0].Selected,
            _ShowConfirms.Items[0].Selected);
        context.SetContext("ActivityRemindersDisplay", value);
        FilterManager.SetActivityUserOptions(userOption);
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
        //tinfo.ImagePath = Page.ResolveClientUrl("~/images/icons/Schdedule_To_Do_24x24.gif");
        return tinfo;
    }


}
