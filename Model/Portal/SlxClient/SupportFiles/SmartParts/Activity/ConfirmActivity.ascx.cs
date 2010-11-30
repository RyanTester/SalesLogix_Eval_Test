using System;
using System.Collections.Generic;
using System.Globalization;
using System.Web.UI;
using Microsoft.Practices.Unity;
using Sage.Entity.Interfaces;
using Sage.Platform;
using Sage.Platform.Application;
using Sage.Platform.Application.UI;
using Sage.Platform.Application.UI.Web;
using Sage.Platform.Repository;
using Sage.Platform.Security;
using Sage.Platform.WebPortal.SmartParts;
using Sage.SalesLogix.Activity;
using Sage.SalesLogix.Entities;
using Sage.SalesLogix.Security;
using TimeZone = Sage.Platform.TimeZone;

public partial class SmartParts_Activity_ConfirmActivity : UserControl, ISmartPartInfoProvider
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
    private IUserService _IUserService;
    private IEntityContextService m_EntityContextService;
    private WorkItem _workItem;
    #endregion

    private Activity _CurrentActivity;
    private string _UserId = string.Empty;
    private string _ActivityId = string.Empty;
    private string _FromUser = string.Empty;

    protected void Page_Load(object sender, EventArgs e)
    {
        _UserId = (Page.Request.QueryString.Get("touserid"));
        if (string.IsNullOrEmpty(_UserId))
        {
            _IUserService = ApplicationContext.Current.Services.Get<IUserService>();
            _UserId = _IUserService.UserId;

        }
        _ActivityId = m_EntityContextService.EntityID.ToString();
        _CurrentActivity = Activity.GetActivityFromID(_ActivityId);
    }

    protected override void OnPreRender(EventArgs e)
    {
        SetActivityDetail();
        SetTitleBar();
        base.OnPreRender(e);
    }

    private void SetTitleBar()
    {
        ApplicationPage page = (ApplicationPage)Page;
        page.TitleBar.Text = string.Format(
            GetLocalResourceObject("ConfirmActivity_Description").ToString(), GetFromUser(), User.GetById(_UserId));
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
                    ActivityType.Text = GetLocalResourceObject("ConfirmActivity_ActivityType_Meeting").ToString();
                    break;
                case Sage.Entity.Interfaces.ActivityType.atToDo:
                    ActivityType.Text = GetLocalResourceObject("ConfirmActivity_ActivityType_ToDo").ToString();
                    break;
                case Sage.Entity.Interfaces.ActivityType.atPhoneCall:
                    ActivityType.Text = GetLocalResourceObject("ConfirmActivity_ActivityType_Call").ToString();
                    break;
                case Sage.Entity.Interfaces.ActivityType.atPersonal:
                    ActivityType.Text = GetLocalResourceObject("ConfirmActivity_ActivityType_Personal").ToString();
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
            LeadChanges();
        }
    }

    private void LeadChanges()
    {
        bool isLead = (!String.IsNullOrEmpty(_CurrentActivity.LeadId) && !(_CurrentActivity.LeadId.Trim() == ""));
        if (isLead)
        {
            Contact_lz.Text = GetLocalResourceObject("Lead").ToString();
            Account_lz.Text = GetLocalResourceObject("Company").ToString();
            AccountId.Text = _CurrentActivity.AccountName;
            ContactId.Text = _CurrentActivity.LeadName;
            ContactId.SetLookupEntity(typeof(Lead));
            ContactId.LookupEntityName = "Lead";
            ContactId.LookupEntityTypeName = "Sage.SalesLogix.Entities.Lead, Sage.SalesLogix.Entities";
            ContactId.LookupResultValue = _CurrentActivity.LeadId;
            AccountId.EnableHyperLinking = false;
            OpportunitySpan.Visible = false;
        }
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

    protected void CompleteBtn_Click(object sender, EventArgs e)
    {
        UserActivityStatus status = Action.Items[Action.SelectedIndex].Value.Equals("asDeclned") ?
            UserActivityStatus.asDeclned : UserActivityStatus.asAccepted;
        _CurrentActivity.ConfirmDeclineActivity(_CurrentActivity.ActivityId, _UserId, status, Reply.Text);
        Page.Response.Redirect("ActivityManager.aspx?activetab=actTabConfirm");
    }

    #region ISmartPartInfoProvider Members

    public ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        ToolsSmartPartInfo tinfo = new ToolsSmartPartInfo();
        foreach (Control c in ConfirmActivity_RTools.Controls)
        {
            tinfo.RightTools.Add(c);
        }
        return tinfo;
    }

    #endregion
}
