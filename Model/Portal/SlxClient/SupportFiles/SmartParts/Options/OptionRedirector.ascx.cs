using System;
using Sage.Common.Syndication.Json;
using Sage.Entity.Interfaces;
using Sage.Platform;
using Sage.Platform.Application;
using Sage.Platform.Application.Services;
using Sage.Platform.Application.UI;
using Sage.Platform.Security;
using Sage.Platform.WebPortal.Services;
using Sage.SalesLogix.Client.GroupBuilder;

public partial class SmartParts_Options_OptionRedirector : System.Web.UI.UserControl, ISmartPartInfoProvider
{
    static readonly log4net.ILog log = log4net.LogManager.GetLogger(
    System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

    protected void Page_Load(object sender, EventArgs e)
    {
        try
        {
            Sage.Platform.Application.IContextService context =
                Sage.Platform.Application.ApplicationContext.Current.Services.Get<IContextService>(true);
            Sage.Platform.TimeZone tz = (Sage.Platform.TimeZone)context.GetContext("TimeZone");

            string uid = ApplicationContext.Current.Services.Get<IUserService>().UserId.Trim();

            IUser u = EntityFactory.GetById<IUser>(uid);
            if (u == null)
            {
                log.ErrorFormat("TimeZone: Failed to get userid '{0}'", uid);
            }
            else
            {
                if (u.UserInfo.TimeZone != tz.KeyName)
                {
                    u.UserInfo.TimeZone = tz.KeyName;
                    u.Save();
                }
            }

        }
        catch (Exception ex)
        {
            log.ErrorFormat(String.Format("TimeZone: Failed to set timezone: {0}", ex.Message));
        }
    }
    protected void Page_PreRender(object sender, EventArgs e)
    {
        IUserOptionsService opts = Sage.Platform.Application.ApplicationContext.Current.Services.Get<IUserOptionsService>();
        FilterManager.SetActivityUserOptions(opts);
        string defPage = opts.GetCommonOption("ShowOnStartup", "General");
        if (defPage != "")
        {
            Response.Redirect(defPage, true);
            return;
        }
    }



    #region ISmartPartInfoProvider Members

    public ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        return new SmartPartInfo(GetLocalResourceObject("PageDescription.Text").ToString(), GetLocalResourceObject("PageDescription.Text").ToString());
    }

    #endregion
}
