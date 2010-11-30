using System;
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
using System.Collections.Generic;

using Sage.Platform;
using Sage.Platform.Application;
using Sage.Platform.Security;
using Sage.Platform.WebPortal.Services;
using Sage.Platform.Orm;
using Sage.Platform.Orm.Entities;
using Sage.SalesLogix;
using Sage.SalesLogix.Security;
using Sage.SalesLogix.Services.SpeedSearch;
using Sage.SalesLogix.Services.SpeedSearch.SearchSupport;
using Sage.SalesLogix.SpeedSearch;
using Sage.SalesLogix.Web;
using Sage.Entity.Interfaces;
using Sage.Platform.Application.UI.Web;
using Sage.Platform.Application.UI;

public partial class SmartParts_Title_Title : System.Web.UI.UserControl, ISmartPartInfoProvider
{
    private IPageWorkItemLocator _locator;

    [ServiceDependency]
    public IPageWorkItemLocator Locator
    {
        get { return _locator; }
        set { _locator = value; }
    }

    public SmartParts_Title_Title()
    {
    }

    protected void Page_Load(object sender, EventArgs e)
    {
    }

    #region ISmartPartInfoProvider Members

    public ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        Sage.Platform.WebPortal.SmartParts.ToolsSmartPartInfo tinfo = new Sage.Platform.WebPortal.SmartParts.ToolsSmartPartInfo();
        //foreach (Control c in wnTools.Controls)
        //{
        //    tinfo.RightTools.Add(c);
        //}
        return tinfo;
    }

    #endregion
}
