using System.Web.UI;
using System.Web.UI.WebControls;
using Sage.SalesLogix.Web.Controls;
using Sage.SalesLogix.Web.Controls.Lookup;
using Sage.SalesLogix.Web.Controls.PickList;
using System.Collections.Generic;
using Sage.Entity.Interfaces;
using Sage.Platform.Application;
using Sage.Platform.Orm.Interfaces;
using Sage.Platform.Security;
using Sage.SalesLogix.Activity;

/// <summary>
/// Helper class for Activity presentation logic.
/// </summary>
public class ActivityFormHelper
{
    private readonly Activity _Activity;

    private Activity Activity
    {
        get { return _Activity; }
    }

    public bool IsInsert
    {
        get { return _Activity != null && (_Activity.PersistentState & PersistentState.New) > 0; }
    }

    private readonly bool _IsAddAllowed;
    private bool IsAddAllowed
    {
        get { return _IsAddAllowed; }
    }

    private readonly bool _IsEditAllowed;
    private bool IsEditAllowed
    {
        get { return _IsEditAllowed; }
    }

    private readonly bool _IsDeleteAllowed;
    private bool IsDeleteAllowed
    {
        get { return _IsDeleteAllowed; }
    }

    public ActivityFormHelper(Activity activity)
    {
        Guard.ArgumentNotNull(activity, "activity");

        _Activity = activity;

        UserCalendar uc = UserCalendar.GetCurrentUserCalendar(_Activity.UserId);
        bool foundUserCalendar = uc != null && uc.AllowAdd.HasValue && uc.AllowEdit.HasValue && uc.AllowDelete.HasValue;

        //If a user has been granted calendar access to another user, grant Add/Edit/Delete permissions regardless of Activity Type.
        _IsAddAllowed = foundUserCalendar && uc.AllowAdd.Value;
        _IsEditAllowed = foundUserCalendar && uc.AllowEdit.Value;
        _IsDeleteAllowed = foundUserCalendar && uc.AllowDelete.Value;
    }

    public string CurrentUserId
    {
        get { return ApplicationContext.Current.Services.Get<IUserService>(true).UserId.Trim(); }
    }

    public bool IsSaveEnabled
    {
        get { return (IsInsert && IsAddAllowed) || (!IsInsert && IsEditAllowed); }
    }

    public bool IsCompleteEnabled
    {
        get { return !IsInsert && IsEditAllowed; }
    }

    public bool IsDeleteEnabled
    {
        get { return !IsInsert && (IsDeleteAllowed || IsDeclineAllowed()); }
    }

    private bool IsDeclineAllowed()
    {
        if (CurrentUserId == Activity.UserId)
            return false;
        UserActivity attendee = Activity.Attendees.FindAttendee(CurrentUserId);
        return attendee != null && attendee.Status != UserActivityStatus.asDeclned;
    }

    public void SetTabVisibility(IList<TabPanel> panels)
    {
        foreach (TabPanel panel in panels)
        {
            panel.Visible = !(panel.ID == "Members" || panel.ID == "ActivityResources") ||
               !(Activity.Type == ActivityType.atPersonal || Activity.Type == ActivityType.atToDo);
        }
    }

    public void Reset(ControlCollection controls)
    {
        SetEnabled(controls, true);
    }

    public void Secure(ControlCollection controls)
    {
        if (!IsSaveEnabled)
            SetEnabled(controls, false);
    }

    public static void SetEnabled(ControlCollection controls, bool value)
    {
        foreach (Control c in controls)
        {
            if (c is TextBox
                || c is DropDownList
                || c is RadioButton
                || c is CheckBox
                || c is DateTimePicker
                || c is LookupControl
                || c is DurationPicker
                || c is PickListControl
                || c is SlxUserControl
                || c is ListBox
                || c is Button
                || c is Panel)
            {
                // skip toolbar panels
                if (c.ID == "RightTools" || c.ID == "CenterTools" || c.ID == "LeftTools")
                    continue;
                ((WebControl)c).Enabled = value;
            }
        }
    }
}
