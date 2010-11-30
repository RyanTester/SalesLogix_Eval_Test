using System;
using System.Collections.Generic;
using System.Text;
using System.Web.UI;
using System.Web.UI.WebControls;
using Sage.Entity.Interfaces;
using Sage.Platform.Application;
using Sage.Platform.Orm.Interfaces;
using Sage.Platform.Security;
using Sage.Platform.WebPortal.SmartParts;
using Sage.Platform.WebPortal.Workspaces.Tab;
using Sage.SalesLogix.Web.Controls;

public partial class SmartParts_History_HistoryCommandController : EntityBoundSmartPart
{
    private static string CurrentUserId
    {
        get { return ApplicationContext.Current.Services.Get<IUserService>(true).UserId.Trim(); }
    }

    protected override void OnFormBound()
    {
        base.OnFormBound();
        IHistory history = (IHistory)BindingSource.Current;
        SetScheduledByLabel(history);
        cmdDelete.OnClientClick = FormHelper.GetConfirmDeleteScript();
        ClientBindingMgr.RegisterSaveButton(cmdOK);

        bool isEditAllowed = CurrentUserId == history.UserId || CurrentUserId == "ADMIN";
        cmdDelete.Visible = isEditAllowed;
        cmdOK.Visible = isEditAllowed;
    }

    private void SetScheduledByLabel(IHistory history)
    {
        Sage.Platform.Application.IContextService context = Sage.Platform.Application.ApplicationContext.Current.Services.Get<Sage.Platform.Application.IContextService>(true);
        Sage.Platform.TimeZone tz = context["TimeZone"] as Sage.Platform.TimeZone;

        if (tz != null)
        {
            string startDate = tz.UTCDateTimeToLocalTime(history.StartDate).Date.ToShortDateString();
            string createdate = tz.UTCDateTimeToLocalTime(history.CreateDate).Date.ToShortDateString();
            if (history.Timeless)
            {
                startDate = history.StartDate.Date.ToShortDateString();
                createdate = history.CreateDate.Date.ToShortDateString();
            }

            string userName;
            IUser createUser = Sage.Platform.EntityFactory.GetById<IUser>(history.CreateUser);
            if (createUser != null)
                userName = createUser.UserInfo.UserName;
            else
            {
                if (history.CreateUser.ToUpper().Trim() == "PROCESS")
                {
                    userName = "Process Manager";
                }
                else
                {
                    userName = "Unknown User";
                }
            }

            CreateUser.Text = GetLocalResourceObject("rsScheduledOn") + " " + createdate + " " + GetLocalResourceObject("rsBy") + " " + userName + " " + GetLocalResourceObject("rsOriginallyFor") + " " + startDate;
        }
    }

    protected override void OnWireEventHandlers()
    {
        base.OnWireEventHandlers();
        cmdOK.Click += cmdOK_ClickAction;
        cmdDelete.Click += cmdDelete_ClickAction;
    }

    private void CloseParentDialog(bool doRefreshAll)
    {
        var sb = new StringBuilder();
        var closeDialogId = "ctl00$DialogWorkspace$ActivityDialogController$btnCloseDialog";
        sb.AppendFormat("parent.__doPostBack('{0}','{1}');", closeDialogId, doRefreshAll);
        ScriptManager.RegisterStartupScript(
            this, GetType(), "activitydialogcontrollerscript", sb.ToString(), true);
    }

    private void cmdOK_ClickAction(object sender, EventArgs e)
    {
        IHistory _entity = BindingSource.Current as IHistory;
        if (_entity != null)
        {
            _entity.Save();
        }
        btnSave_ClickActionBRC(sender, e);

        CloseParentDialog(true);
    }

    protected void btnSave_ClickActionBRC(object sender, EventArgs e)
    {
        TabWorkspace ActivityTabs = PageWorkItem.Workspaces["TabControl"] as TabWorkspace;

        if (ActivityTabs != null)
        {
            Control historyDetails = ActivityTabs.GetSmartPartByID("HistoryDetails");
            SLXCheckBox CarryOverAttachments = historyDetails.FindControl("CarryOverAttachments") as SLXCheckBox;
            if (CarryOverAttachments == null) throw new ApplicationException("CarryOverAttachments control not found.");
            SLXCheckBox CarryOverNotes = historyDetails.FindControl("CarryOverNotes") as SLXCheckBox;
            if (CarryOverNotes == null) throw new ApplicationException("CarryOverNotes control not found.");
            ListBox FollowUpActivity = historyDetails.FindControl("FollowUpActivity") as ListBox;
            if (FollowUpActivity == null) throw new ApplicationException("FollowUpActivity control not found.");

            if (FollowUpActivity.SelectedValue == "None") return;

            Dictionary<string, string> args = new Dictionary<string, string>();
            args.Add("type", FollowUpActivity.SelectedValue);

            if (CarryOverNotes.Checked || CarryOverAttachments.Checked)
                args.Add("historyid", EntityContext.EntityID.ToString());
            if (CarryOverNotes.Checked)
                args.Add("carryovernotes", "true");
            if (CarryOverAttachments.Checked)
                args.Add("carryoverattachments", "true");

            new LinkHandler(Page).ScheduleActivity(args);
        }
    }

    protected void cmdDelete_ClickAction(object sender, EventArgs e)
    {
        IPersistentEntity persistentEntity = BindingSource.Current as IPersistentEntity;
        if (persistentEntity != null)
        {
            persistentEntity.Delete();
        }
        CloseParentDialog(true);
    }

    #region Overrides of EntityBoundSmartPart

    public override Type EntityType
    {
        get { return typeof(IHistory); }
    }

    protected override void OnAddEntityBindings()
    {

    }

    #endregion
}
