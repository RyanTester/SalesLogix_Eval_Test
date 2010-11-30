using System;
using System.Collections.Generic;
using Sage.Entity.Interfaces;
using Sage.Platform;
using Sage.Platform.Application;
using Sage.Platform.Application.UI.Web;
using Sage.Platform.WebPortal.Services;
using Sage.SalesLogix.Activity;
using Sage.Platform.Orm.Entities;

public class LinkHandler
{

    private const int ActivityDlg_Height = 550;
    private const int ActivityDlg_Width = 870;
    private const int CompleteActivityDlg_Height = 560;
    private const int CompleteActivityDlg_Width = 870;
    private const int HistoryDlg_Height = 580;
    private const int HistoryDlg_Width = 730;


    private readonly ApplicationPage _Page;

    private ApplicationPage Page
    {
        get { return _Page; }
    }

    private bool IsInDialogIFrame
    {
        get
        {
            if (_Page != null)
            {
                return (_Page.PageWorkItem.Workspaces["DialogWorkspace"] == null);
            }
            return false;
        }
    }

    private IWebDialogService Dialog
    {
        get { return Page.PageWorkItem.Services.Get<IWebDialogService>(true); }
    }

    public static IContextService AppContext
    {
        get { return ApplicationContext.Current.Services.Get<IContextService>(true); }
    }

    public LinkHandler(System.Web.UI.Page page) : this((ApplicationPage)page) { }
    public LinkHandler(ApplicationPage page)
    {
        _Page = page;
    }

    #region Entity Link Handler

    public void EntityDetail(string id, string kind)
    {
        Page.Response.Redirect(string.Format("~/{0}.aspx?entityid={1}", kind, id));
    }

    #endregion


    #region Confirmations

    public void ConfirmActivity(string id, string toUserId)
    {
        string url = string.Format("~/ConfirmActivity.aspx?entityid={0}&touserid={1}", id, toUserId);
        Page.Response.Redirect(url);
    }

    public void DeleteConfirmation(string id, string notifyId)
    {
        string url = string.Format("~/DeleteConfirmation.aspx?entityid={0}&notifyid={1}", id, notifyId);
        Page.Response.Redirect(url);
    }

    public void RemoveDeletedConfirmation(string id)
    {
        string url = string.Format("~/RemoveDeletedConfirmation.aspx?entityid={0}", id);
        Page.Response.Redirect(url);
    }

    #endregion

    #region History Dialogs

    public void NewNote()
    {
        NewNote(new Dictionary<string, string>());
    }

    public void NewNote(Dictionary<string, string> args)
    {
        AppContext["ActivityParameters"] = args;
        Dialog.SetSpecs(-1, -1, 500, 710, "InsertNote");
        Dialog.EntityType = typeof(IHistory);
        Dialog.EntityID = EntityViewMode.Insert.ToString();
        Dialog.ShowDialog();
    }

    public void EditHistory(string id)
    {
        Dictionary<string, string> args = new Dictionary<string, string>();
        args.Add("contenturl", string.Format("History.aspx?entityid={0}", id));
        ShowHistoryDialog(args);
    }

    private void ShowHistoryDialog(Dictionary<string, string> args)
    {
        AppContext["ActivityParameters"] = args;
        Dialog.SetSpecs(-1, -1, HistoryDlg_Height, HistoryDlg_Width, "ActivityDialogController");
        Dialog.ShowDialog();
    }

    #endregion

    #region Activity Details Dialogs

    public void SchedulePhoneCall()
    {
        Dictionary<string, string> args = new Dictionary<string, string>();
        args.Add("type", "atPhoneCall");
        ScheduleActivity(args);
    }

    public void ScheduleMeeting()
    {
        Dictionary<string, string> args = new Dictionary<string, string>();
        args.Add("type", "atAppointment");
        ScheduleActivity(args);
    }

    public void ScheduleToDo()
    {
        Dictionary<string, string> args = new Dictionary<string, string>();
        args.Add("type", "atToDo");
        ScheduleActivity(args);
    }

    public void SchedulePersonalActivity()
    {
        Dictionary<string, string> args = new Dictionary<string, string>();
        args.Add("type", "atPersonal");
        ScheduleActivity(args);
    }

    public void ScheduleActivity(Dictionary<string, string> args)
    {
        args.Add("entityid", null);
        ShowActivityDialog(args);
    }

    public void EditActivity(string id)
    {
        if (Dialog.SmartPartMappedID != "EditRecurrence" && IsRecurring(id))
            ShowSeriesOrOccurrenceDialog("EditRecurrence", id);
        else
        {
            Dictionary<string, string> args = new Dictionary<string, string>();
            args.Add("entityid", id);
            ShowActivityDialog(args);
        }
    }

    private void ShowActivityDialog(Dictionary<string, string> args)
    {
        ActivityParameters aparams = new ActivityParameters(args);
        string url;
        if (aparams.RecurDate.HasValue)
        {
            // TODO: Refactor to remove QS dependancy
            url = string.Format("Activity.aspx?modeid=Insert&activityid={0}&recurdate={1}",
                aparams["activityid"],
                aparams.RecurDate);
        }
        else
        {
            url = string.IsNullOrEmpty(aparams.Id)
                ? "Activity.aspx?modeid=Insert"
                : string.Format("Activity.aspx?entityid={0}", aparams.Id);
        }
        aparams.Add("contenturl", url);
        AppContext["ActivityParameters"] = aparams;
        if (IsInDialogIFrame)
        {
            Page.Response.Redirect(url);
        }
        else
        {
            Dialog.SetSpecs(-1, -1, ActivityDlg_Height, ActivityDlg_Width, "ActivityDialogController");
            Dialog.ShowDialog();
        }
    }

    public void EditActivityOccurrencePrompt(string id, DateTime recurDate)
    {
        Dictionary<string, string> args = new Dictionary<string, string>();
        args.Add("recurdate", recurDate.ToString());
        AppContext["ActivityParameters"] = args;

        Dialog.SetSpecs(-1, -1, 200, 330, "EditRecurrence");
        ShowActivityDialog(id);
    }

    public void EditActivityOccurrence(string id, DateTime recurDate)
    {
        Dictionary<string, string> args = new Dictionary<string, string>();
        args.Add("activityid", id);
        args.Add("recurdate", recurDate.ToString());
        ShowActivityDialog(args);
    }

    // pass null id for Insert
    private void ShowActivityDialog(string id)
    {
        Dialog.EntityType = typeof(IActivity);
        Dialog.EntityID = id ?? EntityViewMode.Insert.ToString();
        Dialog.ShowDialog();
    }

    private static object BuildOccurrence()
    {
        Dictionary<string, string> args = (Dictionary<string, string>)AppContext["ActivityParameters"];
        if (args == null || !args.ContainsKey("activityid")) return null;

        Activity activity = EntityFactory.GetById<Activity>(args["activityid"]);
        DateTime startDate = TryParse(args["recurdate"]) ?? activity.StartDate;

        return activity.RecurrencePattern.GetOccurrence(startDate);
    }

    private static DateTime? TryParse(string s)
    {
        DateTime result;
        return DateTime.TryParse(s, out result) ? (DateTime?)result : null;
    }

    #endregion

    #region Complete Activity Dialogs

    public void ScheduleCompleteActivity()
    {
        Dialog.SetSpecs(-1, -1, 350, 500, "ScheduleCompleteActivity");
        Dialog.ShowDialog();
    }

    public void ScheduleCompleteActivity(Dictionary<string, string> args)
    {
        CompleteActivity(null, args);
    }

    public void CompleteActivityOccurrencePrompt(string id, DateTime recurDate)
    {
        Dictionary<string, string> args = new Dictionary<string, string>();
        args.Add("recurdate", recurDate.ToString());
        AppContext["ActivityParameters"] = args;

        Dialog.SetSpecs(-1, -1, 200, 330, "CompleteRecurrence");
        ShowActivityDialog(id);
    }

    public void CompleteActivityOccurrence(string id, DateTime recurDate)
    {
        Dictionary<string, string> args = new Dictionary<string, string>();
        args.Add("activityid", id);
        args.Add("recurdate", recurDate.ToString());
        // TODO: Refactor to remove QS dependancy
        args.Add("contenturl", string.Format("CompleteActivity.aspx?activityid={0}&recurdate={1}&entityid={2}", id, recurDate, id));
        AppContext["ActivityParameters"] = args;

        ShowCompleteActivityDialog(null, null);
    }

    public void CompleteActivity(string id, Dictionary<string, string> args)
    {
        //Completing an existing Activity
        if (id != null)
        {
            string mode;
            if (args.TryGetValue("mode", out mode) && mode == "batch")
            {
                args.Add("contenturl", string.Format("CompleteActivity.aspx?entityid={0}", id));
                args.Add("entityid", id);
                AppContext["ActivityParameters"] = args;
                ShowCompleteActivityDialog(id, args);
            }
            else
                CompleteActivity(id);
        }
        //Completing a new Activity
        else
        {
            args.Add("contenturl", "CompleteActivity.aspx?modeid=Insert");
            AppContext["ActivityParameters"] = args;
            ShowCompleteActivityDialog(id, args);
        }
    }

    public void CompleteActivity(string id)
    {
        if (Dialog.SmartPartMappedID != "CompleteRecurrence" && IsRecurring(id))
        {
            ShowSeriesOrOccurrenceDialog("CompleteRecurrence", id);
        }
        else
        {
            Dictionary<string, string> args = new Dictionary<string, string>();
            if (id != null)
            {
                args.Add("contenturl", string.Format("CompleteActivity.aspx?entityid={0}", id));
                args.Add("entityid", id);
            }
            AppContext["ActivityParameters"] = args;

            ShowCompleteActivityDialog(id, args);
        }
    }

    private void ShowCompleteActivityDialog(string id, IDictionary<string, string> args)
    {
        if (IsInDialogIFrame)
        {
            Page.Response.Redirect(args["contenturl"]);
        }

        Dialog.SetSpecs(-1, -1, CompleteActivityDlg_Height, CompleteActivityDlg_Width, "ActivityDialogController");
        Dialog.ShowDialog();
    }

    #endregion

    #region Delete Activity Dialogs

    public void DeleteActivity(string id)
    {
        Activity activity = EntityFactory.GetById<Activity>(id);
        activity.Delete();
        FormHelper.RefreshMainListPanel(Page, GetType());
    }

    public void DeleteActivityOccurrencePrompt(string id, DateTime recurDate)
    {
        Dictionary<string, string> args = new Dictionary<string, string>();
        args.Add("recurdate", recurDate.ToString());
        AppContext["ActivityParameters"] = args;

        Dialog.SetSpecs(-1, -1, 200, 330, "DeleteRecurrence");
        ShowActivityDialog(id);
    }

    #endregion

    private static bool IsRecurring(string id)
    {
        if (string.IsNullOrEmpty(id)) return false;

        Activity activity = EntityFactory.GetById<Activity>(id);
        if (activity == null) return false;

        return activity.Recurring && activity.RecurrencePattern.Range.NumOccurences > -1;
    }

    private void ShowSeriesOrOccurrenceDialog(string mappedId, string id)
    {
        Dialog.SetSpecs(200, 200, 200, 330, mappedId);
        ShowActivityDialog(id);
    }
}

public class ActivityParameters : Dictionary<string, string>
{
    public ActivityParameters() { }

    public ActivityParameters(Dictionary<string, string> dictionary) : base(dictionary) { }

    public ActivityType Type
    {
        get { return ContainsKey("type") ? GetActivityType(this["type"]) : ActivityType.atAppointment; }
    }

    public string Id
    {
        get { return ContainsKey("entityid") ? this["entityid"] : null; }
    }

    public DateTime? RecurDate
    {
        get { return ContainsKey("recurdate") ? TryParse(this["recurdate"]) : null; }
    }

    public bool IsBatchMode
    {
        get { return ContainsKey("mode") ? this["mode"] == "batch" : false; }
    }

    private static ActivityType GetActivityType(string s)
    {
        if (string.IsNullOrEmpty(s)) return ActivityType.atAppointment;
        try
        {
            return (ActivityType)Enum.Parse(typeof(ActivityType), s);
        }
        catch (ArgumentException) { }
        return ActivityType.atAppointment;
    }

    private static DateTime? TryParse(string s)
    {
        DateTime result;
        return DateTime.TryParse(s, out result) ? (DateTime?)result : null;
    }
}