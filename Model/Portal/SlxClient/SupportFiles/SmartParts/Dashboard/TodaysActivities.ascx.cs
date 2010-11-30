using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.Web.UI;
using NHibernate;
using Sage.Entity.Interfaces;
using Sage.Platform.Application;
using Sage.Platform.Application.UI;
using Sage.Platform.Framework;
using Sage.Platform.NamedQueries;
using Sage.Platform.Security;
using Sage.SalesLogix.Activity;
using Sage.SalesLogix.Client.GroupBuilder;
using Sage.SalesLogix.Security;
using Sage.SalesLogix.Web.Controls;

public partial class SmartParts_Dashboard_TodaysActivities : UserControl, ISmartPartInfoProvider
{

    protected void Page_Load(object sender, EventArgs e)
    {
        FilterManager.GetFiltersForEntity("Activity", this.Page.Server.MapPath(@"Filters\"));
        IContextService context =
            Sage.Platform.Application.ApplicationContext.Current.Services.Get<IContextService>(true);
        if (context.GetContext("WelcomeSearchTimeframe") == null)
        {
            context.SetContext("WelcomeSearchTimeframe", "1");
        }

    }


    #region ISmartPartInfoProvider Members

    public ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        Sage.Platform.WebPortal.SmartParts.ToolsSmartPartInfo tinfo = new Sage.Platform.WebPortal.SmartParts.ToolsSmartPartInfo();
        tinfo.Description = GetLocalResourceObject("PageDescription.Text").ToString();
        tinfo.Title = GetLocalResourceObject("PageDescription.Title").ToString();
        return tinfo;
    }

    #endregion
}
