using System;
using System.Globalization;
using System.Web.UI;
using Microsoft.Practices.Unity;
using Sage.Platform;
using Sage.Platform.Application;
using Sage.Platform.Application.UI;
using Sage.Platform.Application.UI.Web;
using Sage.Platform.Orm;
using Sage.Platform.WebPortal.SmartParts;
using Sage.SalesLogix.Activity;
using Sage.SalesLogix.Security;
using TimeZone=Sage.Platform.TimeZone;

public partial class SmartParts_Activity_RemoveDeletedConfirmation : UserControl, ISmartPartInfoProvider
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
    private IEntityContextService m_EntityContextService;
    private WorkItem _workItem;
    #endregion

    private UserNotification _CurrentEntity = null;
    private string _NotifyId = string.Empty;

    protected void Page_Load(object sender, EventArgs e)
    {
        _NotifyId = m_EntityContextService.EntityID.ToString();
        using (new SessionScopeWrapper())
        {
            _CurrentEntity = EntityFactory.GetById<UserNotification>(_NotifyId);
        }
        SetTitleBar();
    }

    protected override void OnPreRender(EventArgs e)
    {
        SetDetail();
        base.OnPreRender(e);
    }

    private void SetTitleBar()
    {
        ApplicationPage page = Page as ApplicationPage;
        if (page == null) return;

        page.TitleBar.Text = string.Format(
            GetLocalResourceObject("RemoveDeletedConfirm_Title").ToString(),
            User.GetById(_CurrentEntity.FromUserId));
    }

    private void SetDetail()
    {
        IContextService context = ApplicationContext.Current.Services.Get<IContextService>(true);
        TimeZone timeZone = (TimeZone)context.GetContext("TimeZone");
        string datePattern = CultureInfo.CurrentCulture.DateTimeFormat.ShortDatePattern;
        string timePattern = CultureInfo.CurrentCulture.DateTimeFormat.ShortTimePattern;
        if (_CurrentEntity != null)
        {
            if (_CurrentEntity.SendDate.HasValue)
                StartDate.Text = timeZone.UTCDateTimeToLocalTime(_CurrentEntity.SendDate.Value).ToString(datePattern + " " + timePattern);
          
            if (!String.IsNullOrEmpty(_CurrentEntity.Notes))
                Regarding.Text = _CurrentEntity.Notes;
            From.LookupResultValue = _CurrentEntity.FromUserId;
            To.LookupResultValue = _CurrentEntity.ToUserId;
        }
    }

    protected void DeleteBtn_Click(object sender, EventArgs e)
    {
        _CurrentEntity.Delete();
        Page.Response.Redirect("ActivityManager.aspx?activetab=actTabConfirm");
    }

    #region ISmartPartInfoProvider Members

    public ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        ToolsSmartPartInfo tinfo = new ToolsSmartPartInfo();
        foreach (Control c in RemoveDeletedConfirm_RTools.Controls)
        {
            tinfo.RightTools.Add(c);
        }
        return tinfo;
    }

    #endregion
}
