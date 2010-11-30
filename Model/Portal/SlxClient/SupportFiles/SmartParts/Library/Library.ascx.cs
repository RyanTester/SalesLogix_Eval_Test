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

using Sage.Platform;
using Sage.Platform.Application;
using Sage.Platform.NamedQueries;
using Sage.SalesLogix.Security;
using Sage.Platform.Security;
using Sage.Platform.WebPortal.Services;
using Sage.SalesLogix.Services.SpeedSearch;
using Sage.SalesLogix.Services.SpeedSearch.SearchSupport;
using Sage.Platform.Orm;
using Sage.SalesLogix.SpeedSearch;
using System.Collections.Generic;
using Sage.SalesLogix.Web;
using Sage.Platform.Orm.Entities;
using Sage.Entity.Interfaces;
using Sage.Platform.Application.UI;

using Sage.Platform.Repository;
using Sage.SalesLogix.Web.Controls;


public partial class SmartParts_Library_Library : System.Web.UI.UserControl, ISmartPartInfoProvider
{
    public SmartParts_Library_Library()
    {
    }

    public string HelpLink
    {
        get
        {
            string cacheKey = "LibraryHelpLink";
            if (Cache[cacheKey] == null)
            {
                PageLink pageLink = new PageLink();
                pageLink.LinkType = enumPageLinkType.HelpFileName;
                pageLink.NavigateUrl = "library.aspx";

                Cache.Insert(cacheKey, pageLink.GetWebHelpLink().Url);
            }

            return Cache[cacheKey].ToString();
        }
    }

    protected void Page_Load(object sender, EventArgs e)
    {
        
    }
    
    #region ISmartPartInfoProvider Members

    public ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        Sage.Platform.WebPortal.SmartParts.ToolsSmartPartInfo tinfo = new Sage.Platform.WebPortal.SmartParts.ToolsSmartPartInfo();
        //foreach (Control c in libTools.Controls)
        //{
        //    tinfo.RightTools.Add(c);
        //}
        return tinfo;
    }

    #endregion
}
