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
using Sage.Platform.NamedQueries;
using Sage.SalesLogix.Security;

public partial class SmartParts_Dashboard_CampaignResponses : System.Web.UI.UserControl
{
    protected void Page_Load(object sender, EventArgs e)
    {
        const string QueryName = "campaignResponses";
        const string targetsQuery = "campaignTargetsQuery";

        INamedQueryCacheService service = ApplicationContext.Current.Services.Get<INamedQueryCacheService>(false);
        if (service != null)
        {
            if (!service.Contains(QueryName))
            {
                NamedQueryInfo queryinfo = new NamedQueryInfo();
                string activeEquiv = GetGlobalResourceObject("Campaign", "Campaign_Status_Active").ToString();
                string whereClause = string.Empty;
                if (!string.IsNullOrEmpty(activeEquiv))
                {
                    whereClause = string.Format("where c.Status='{0}'", activeEquiv);
                }
                queryinfo.Hql =
                    string.Format("select c.id, c.CampaignName, c.StartDate, c.EndDate, c.ExpectedContactResponses, c.ExpectedLeadResponses from Campaign c {0} order by c.EndDate asc", whereClause);
                queryinfo.Name = QueryName;
                queryinfo.ColumnAliases = new string[] { "id", "name", "startdate", "enddate", "expectedcontact", "expectedlead" };
                service.Add(queryinfo);
            }
            if (!service.Contains(targetsQuery))
            {
                NamedQueryInfo targetsQueryInfo = new NamedQueryInfo();
                targetsQueryInfo.Hql =
                    "select t.ResponseDate from TargetResponse t";
                targetsQueryInfo.Name = targetsQuery;
                targetsQueryInfo.ColumnAliases = new string[] { "ResponseDate" };
                service.Add(targetsQueryInfo);
            }
        }
    }
}
