using System;
using System.Globalization;
using System.Collections.Generic;
using System.Web.UI;
using Microsoft.Practices.Unity;
using Sage.Platform;
using Sage.Platform.Application;
using Sage.Platform.Application.UI;
using Sage.Platform.Security;
using Sage.Platform.WebPortal.SmartParts;
using Sage.SalesLogix.Activity;
using Sage.SalesLogix.Security;
using Sage.Platform.Repository;
using TimeZone = Sage.Platform.TimeZone;
using Sage.Platform.Application.UI.Web;

public partial class SmartParts_Activity_DeleteConfirmation : UserControl, ISmartPartInfoProvider
{
    #region Dependency Injection
    [InjectionMethod]
    public void InitEntityContext([ServiceDependency]WorkItem parentWorkItem)
    {
        _workItem = parentWorkItem;
        m_EntityContextService = _workItem.Services.Get<IEntityContextService>();
    }
    #endregion

    #region Services
    private SLXUserService m_SLXUserService;
    private IEntityContextService m_EntityContextService;
    private WorkItem _workItem;
    #endregion

    private Activity _CurrentActivity = null;
    private UserNotification _UserNotify = null;
    private string _UserId = string.Empty;
    private string _ActivityId = string.Empty;
    private string _NotifyId = string.Empty;
    private string _FromUser = string.Empty;

    protected void Page_Load(object sender, EventArgs e)
    {
        m_SLXUserService = ApplicationContext.Current.Services.Get<IUserService>() as SLXUserService;
        _UserId = m_SLXUserService.GetUser().Id;
        _ActivityId = m_EntityContextService.EntityID.ToString();
        _CurrentActivity = Activity.GetActivityFromID(_ActivityId);
        _NotifyId = (Page.Request.QueryString.Get("notifyid"));
        _UserNotify = (UserNotification)EntityFactory.GetById(typeof(UserNotification), _NotifyId);
    }

    protected override void OnPreRender(EventArgs e)
    {
        SetActivityDetail();
        SetTitleBar();
        base.OnPreRender(e);
    }

    private void SetActivityDetail()
    {
        IContextService context = ApplicationContext.Current.Services.Get<IContextService>(true);
        TimeZone timeZone = (TimeZone)context.GetContext("TimeZone");
        string datePattern = CultureInfo.CurrentCulture.DateTimeFormat.ShortDatePattern;
        string timePattern = CultureInfo.CurrentCulture.DateTimeFormat.ShortTimePattern;
        if (_CurrentActivity != null)
        {
            switch (_CurrentActivity.Type)
            {
                case Sage.Entity.Interfaces.ActivityType.atAppointment:
                    ActivityType.Text = GetLocalResourceObject("DeleteConfirmation_ActivityType_Meeting").ToString();
                    break;
                case Sage.Entity.Interfaces.ActivityType.atToDo:
                    ActivityType.Text = GetLocalResourceObject("DeleteConfirmation_ActivityType_ToDo").ToString();
                    break;
                case Sage.Entity.Interfaces.ActivityType.atPhoneCall:
                    ActivityType.Text = GetLocalResourceObject("DeleteConfirmation_ActivityType_Call").ToString();
                    break;
                case Sage.Entity.Interfaces.ActivityType.atPersonal:
                    ActivityType.Text = GetLocalResourceObject("DeleteConfirmation_ActivityType_Personal").ToString();
                    break;
                default:
                    ActivityType.Text = _CurrentActivity.Type.ToString();
                    break;
            }
            StartDate.Text = _CurrentActivity.Timeless
                                 ? _CurrentActivity.StartDate.ToShortDateString() + " (timeless)"
                                 : timeZone.UTCDateTimeToLocalTime(_CurrentActivity.StartDate).ToString(datePattern +
                                                                                                        " " +
                                                                                                        timePattern);
            Regarding.Text = _CurrentActivity.Description;
            ContactId.LookupResultValue = _CurrentActivity.ContactId;
            AccountId.LookupResultValue = _CurrentActivity.AccountId;
            OpportunityId.LookupResultValue = _CurrentActivity.OpportunityId;
            Phone.Text = _CurrentActivity.PhoneNumber;

            From.LookupResultValue = GetFromUserId();
            To.LookupResultValue = _UserId;

            Action.Text = _UserNotify.Type;
            Reply.Text = _UserNotify.Notes;

            ApplicationPage page = Page as ApplicationPage;
            if (page == null) return;

        }
    }
    private void SetTitleBar()
    {
        ApplicationPage page = (ApplicationPage)Page;
        page.TitleBar.Text = string.Format(
            GetLocalResourceObject("DeleteConfirmation_Title").ToString(), GetFromUser(), User.GetById(_UserId));
    }

    private string GetFromUserId()
    {
        if (string.IsNullOrEmpty(_FromUser))
        {
            IRepository<UserNotification> notifRep = EntityFactory.GetRepository<UserNotification>();
            IQueryable qry = (IQueryable)notifRep;
            IExpressionFactory ef = qry.GetExpressionFactory();
            ICriteria crit = qry.CreateCriteria();
            IExpression userExp = ef.Eq("ToUserId", _UserId);
            IExpression activityExp = ef.Eq("ActivityId", _ActivityId);
            IList<UserNotification> confirms = crit.Add(ef.And(userExp, activityExp)).List<UserNotification>();
            _FromUser = confirms.Count > 0 ? confirms[0].FromUserId : _CurrentActivity.UserId;
        }
        return _FromUser;
    }

    private object GetFromUser()
    {
        return !string.IsNullOrEmpty(_FromUser) ? User.GetById(_FromUser) : User.GetById(_CurrentActivity.UserId);
    }
    protected void DeleteBtn_Click(object sender, EventArgs e)
    {
        if (_UserNotify != null)
        {
            _UserNotify.Delete();
        }
        Page.Response.Redirect("ActivityManager.aspx?activetab=actTabConfirm");
    }

    #region ISmartPartInfoProvider Members

    public ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        object fromUser = User.GetById(_UserNotify.FromUserId);
        ToolsSmartPartInfo tinfo = new ToolsSmartPartInfo();
        //if ((_UserNotify != null) && (_UserNotify.Type.Equals("Decline")))
        //{
        //    //tinfo.Description = string.Format(GetLocalResourceObject("DeleteConfirmation_Title_Decline").ToString(), fromUser);
        //    //tinfo.Title = string.Format(GetLocalResourceObject("DeleteConfirmation_Description_Decline").ToString(), fromUser);
        //}
        //else 
        //{
        //    //tinfo.Description = string.Format(GetLocalResourceObject("DeleteConfirmation_Title").ToString(), fromUser);
        //    //tinfo.Title = string.Format(GetLocalResourceObject("DeleteConfirmation_Description").ToString(), fromUser);
        //}
        foreach (Control c in this.DeleteConfirmation_RTools.Controls)
        {
            tinfo.RightTools.Add(c);
        }
        //tinfo.ImagePath = Page.ResolveClientUrl("images/icons/Find_24x24.gif"); 
        return tinfo;
    }

    #endregion
}
