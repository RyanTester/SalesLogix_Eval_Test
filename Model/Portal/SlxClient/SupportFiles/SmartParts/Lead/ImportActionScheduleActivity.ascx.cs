using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using Sage.Platform.Application.Services;
using Sage.Platform.WebPortal.Services;
using Sage.Platform.Application.UI;
using Sage.Platform.Application;
using Sage.Platform.WebPortal.SmartParts;
using log4net;
using Sage.SalesLogix.Services.Import.Actions;
using Sage.SalesLogix.Services.Import;
using Sage.Entity.Interfaces;
using Sage.SalesLogix;

public partial class ImportActionScheduleActivity : EntityBoundSmartPartInfoProvider 
{

    private ActionScheduleActivity _action;
    private string _actionName;
    

    #region Public Methods

    /// <summary>
    /// Gets the type of the entity.
    /// </summary>
    /// <value>The type of the entity.</value>
    public override Type EntityType
    {
        get { return typeof(IImportHistory); }
    }

    /// <summary>
    /// Gets or sets the action.
    /// </summary>
    /// <value>The action.</value>
    public ActionScheduleActivity Action
    {
        get {return _action; }
        set { _action = value; }
    }

    /// <summary>
    /// Gets or sets the name of the action.
    /// </summary>
    /// <value>The name of the action.</value>
    public string ActionName
    {
        get {

            if (string.IsNullOrEmpty(_actionName))
            {
                if (DialogService.DialogParameters.Count > 0 && (DialogService.DialogParameters.ContainsKey("ActionName")))
                {
                    object actionName = DialogService.DialogParameters["ActionName"];
                    if (actionName != null)
                    {
                        _actionName = actionName.ToString();
                    }
                }
            }
            return _actionName; }
        set { _actionName = value;}
    }

    /// <summary>
    /// Gets the smart part info.
    /// </summary>
    /// <param name="smartPartInfoType">Type of the smart part info.</param>
    /// <returns></returns>
    override public ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        ToolsSmartPartInfo tinfo = new ToolsSmartPartInfo();

        foreach (Control c in this.Form_LTools.Controls)
        {
            tinfo.LeftTools.Add(c);
        }
        foreach (Control c in this.Form_CTools.Controls)
        {
            tinfo.CenterTools.Add(c);
        }
        foreach (Control c in this.Form_RTools.Controls)
        {
            tinfo.RightTools.Add(c);
        }
        
        ImportManager importManager = GetImportManager();
        if(importManager != null)
        {
            Action = importManager.ActionManager.GetAction(ActionName) as ActionScheduleActivity;
            if(Action != null)
            {
                if (Action.Activity.Type == ActivityType.atPhoneCall)
                {
                    tinfo.Title = GetLocalResourceObject("Const_SchedulePhoneCall_Title").ToString();
                }
                if (Action.Activity.Type == ActivityType.atAppointment)
                {
                    tinfo.Title = GetLocalResourceObject("Const_ScheduleMeeting_Title").ToString();
                }
                if (Action.Activity.Type == ActivityType.atToDo)
                {
                    tinfo.Title = GetLocalResourceObject("Const_ScheduleToDo_Title").ToString();
                }
            }
        }
        return tinfo;
    }

    #endregion

    /// <summary>
    /// Override this method to add bindings to the currrently bound smart part
    /// </summary>
    protected override void OnAddEntityBindings()
    {
    }

    /// <summary>
    /// Handles the Load event of the Page control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void Page_Load(object sender, EventArgs e)
    {
    }

    /// <summary>
    /// Called when the smartpart has been bound.  Derived components should override this method to run code that depends on entity context being set and it not changing.
    /// </summary>
    protected override void OnFormBound()
    {
        base.OnFormBound();
        if (ClientBindingMgr != null)
        {   // register these with the ClientBindingMgr so they can do their thing without causing the dirty data warning message...
            ClientBindingMgr.RegisterBoundControl(dtpStartDate);
            ClientBindingMgr.RegisterBoundControl(pklDescription);
            ClientBindingMgr.RegisterBoundControl(pklPriority);
            ClientBindingMgr.RegisterBoundControl(pklCategory);
        }
        SetActionState();
    }

    /// <summary>
    /// Called when [wire event handlers].
    /// </summary>
    protected override void OnWireEventHandlers()
    {
        btnSave.Click += btnSave_OnClick;
        btnSave.Click += DialogService.CloseEventHappened;
        btnCancel.Click += DialogService.CloseEventHappened;

        base.OnWireEventHandlers();
    }

    /// <summary>
    /// Handles the OnClick event of the btnSave control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void btnSave_OnClick(object sender, EventArgs e)
    {
         SaveActionState(true);
         IPanelRefreshService refresher = PageWorkItem.Services.Get<IPanelRefreshService>();
         if (refresher != null)
         {
             refresher.RefreshAll();
         }
    }

    /// <summary>
    /// Handles the OnChange event of the chkTimeless control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void chkTimeless_OnChange(object sender, EventArgs e)
    {
        SaveActionState(false);
    }


    /// <summary>
    /// Sets the state of the action.
    /// </summary>
    private void SetActionState()
    {
        ImportManager importManager = GetImportManager();
               
        Action = importManager.ActionManager.GetAction(ActionName) as ActionScheduleActivity;
        if (Action != null)
        {
            Action.HydrateChanges();
            SetPickListsByType(Action.Activity.Type);

            txtNotes.Text = Action.Activity.LongNotes;
            pklCategory.PickListValue = Action.Activity.Category;
            pklDescription.PickListValue = Action.Activity.Description;
            pklPriority.PickListValue = Action.Activity.Priority;
            chkTimeless.Checked = Action.Activity.Timeless;
            dpDuration.Value = Action.Activity.Duration;
            dpReminderDuration.Value = Action.Activity.ReminderDuration;
            chkRollover.Checked = Action.Activity.Rollover;
            chkAlarm.Checked = Action.Activity.Alarm;

            dtpStartDate.Timeless = chkTimeless.Checked;
            dtpStartDate.DisplayTime = !chkTimeless.Checked;
            dtpStartDate.DateTimeValue = Action.Activity.StartDate;
            dtpStartDate.Timeless = chkTimeless.Checked;
            dpDuration.Enabled = !chkTimeless.Checked;
            chkRollover.Enabled = chkTimeless.Checked;
        }
    }

    /// <summary>
    /// Saves the state of the action.
    /// </summary>
    private void SaveActionState(bool setInit)
    {
        ImportManager importManager = GetImportManager();
        Action = importManager.ActionManager.GetAction(ActionName) as ActionScheduleActivity;
        if (Action == null)
        { 
           DialogService.ShowMessage( string.Format("Error saving action Action:{0}",ActionName));
        }
        if (!Action.Initialized && setInit)
        {
            Action.Initialized = true;
            Action.Active = true;
        }
                
        Action.Activity.LongNotes = txtNotes.Text;
        Action.Activity.Category = pklCategory.PickListValue;
        Action.Activity.Description = pklDescription.PickListValue;
        Action.Activity.Priority = pklPriority.PickListValue;
        Action.Activity.Timeless = chkTimeless.Checked;
        Action.Activity.Duration = dpDuration.Value;
        Action.Activity.ReminderDuration = dpReminderDuration.Value;
        Action.Activity.Alarm = chkAlarm.Checked;
        Action.Activity.Rollover = chkRollover.Checked;
        try
        {
           Action.Activity.StartDate = (DateTime)dtpStartDate.DateTimeValue;
        }
        catch(Exception)
        {
          Action.Activity.StartDate = DateTime.UtcNow;
        }
        Action.SaveChanges();
        Page.Session["importManager"] = importManager;
    }

    /// <summary>
    /// Sets the user option defaults.
    /// </summary>
    /// <param name="activity">The activity.</param>
    private void SetUserOptionDefaults(Sage.SalesLogix.Activity.Activity activity)
    {
        IUserOptionsService userOption = ApplicationContext.Current.Services.Get<IUserOptionsService>();
        string alarmLeadUnit = userOption.GetCommonOption("AlarmDefaultLead", "ActivityAlarm");
        string alarmLeadValue = userOption.GetCommonOption("AlarmDefaultLeadValue", "ActivityAlarm");

        int alarmLeadMinutes = 15; //default
        if ((alarmLeadUnit != "") && (alarmLeadValue != ""))
        {
            try
            {
                alarmLeadMinutes = Convert.ToInt32(alarmLeadValue);
            }
            catch
            {
                alarmLeadMinutes = 15;
            }

            switch (alarmLeadUnit)
            {
                case "Days":
                    alarmLeadMinutes = alarmLeadMinutes * 24 * 60;
                    break;
                case "Hours":
                    alarmLeadMinutes = alarmLeadMinutes * 60;
                    break;
            }
        }
        activity.ReminderDuration = alarmLeadMinutes;
    }

    /// <summary>
    /// Sets the type of the pick lists by.
    /// </summary>
    /// <param name="activityType">Type of the activity.</param>
    private void SetPickListsByType(ActivityType activityType)
    {
        pklCategory.PickListId = "";
        pklDescription.PickListId = "";
        switch (activityType)
        {
            case ActivityType.atPhoneCall:
                pklCategory.PickListName = "Phone Call Category Codes";
                pklDescription.PickListName = "Phone Call Regarding";
                break;
            case ActivityType.atAppointment:
                pklCategory.PickListName = "Meeting Category Codes";
                pklDescription.PickListName = "Meeting Regarding";
                break;
            case ActivityType.atToDo:
                pklCategory.PickListName = "To Do Category Codes";
                pklDescription.PickListName = "To Do Regarding";
                break;
            
            default:
                pklCategory.PickListName = "To Do Category Codes";
                pklDescription.PickListName = "To Do Regarding"; break;
        }
    }

    /// <summary>
    /// Gets the import manager.
    /// </summary>
    /// <returns></returns>
    private ImportManager GetImportManager()
    {
        ImportManager importManager = Page.Session["importManager"] as ImportManager;
        if (importManager != null)
        {
        }
        else
        {
            DialogService.ShowMessage("error_ImportManager_NotFound");
        }
        return importManager;
    }
}
