using System;
using System.Collections;
using System.Configuration;
using System.Data;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using Sage.Platform.Application;
using Sage.Platform.Application.UI;
using Sage.Platform.NamedQueries;
using Sage.SalesLogix.Security;

public partial class SmartParts_Dashboard_RecentNotes : UserControl
{
    protected void Page_Load(object sender, EventArgs e)
    {
        const string QueryName = "recentNotes";

        INamedQueryCacheService service = ApplicationContext.Current.Services.Get<INamedQueryCacheService>(false);
        if (service != null)
        {
            if (!service.Contains(QueryName))
            {
                SLXUserService slxUserService = ApplicationContext.Current.Services.Get<Sage.Platform.Security.IUserService>() as SLXUserService;
                NamedQueryInfo queryinfo = new NamedQueryInfo();  // 
                queryinfo.Hql =
                    "select h.id, h.Description, h.Notes from History h where h.Type=262148 and h.UserId=? and h.CreateDate>? order by h.CreateDate desc";
                queryinfo.Name = QueryName;
                queryinfo.ColumnAliases = new string[] { "id", "description", "notes" };
                queryinfo.SetParameter(0, slxUserService.GetUser().Id);
                queryinfo.SetParameter(1, DateTime.Now.AddDays(-15));

                service.Add(queryinfo);
            }
        }


    }

}
