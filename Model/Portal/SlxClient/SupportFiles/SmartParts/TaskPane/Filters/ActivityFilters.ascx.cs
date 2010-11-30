using System;
using System.Collections.Generic;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Sage.Common.Syndication.Json;
using Sage.Platform;
using Sage.Platform.Application;
using Sage.Platform.Application.Services;
using Sage.Platform.Application.UI;
using Sage.Platform.Application.UI.Web;
using Sage.Platform.Configuration;
using Sage.Platform.Repository;
using Sage.Platform.Security;
using Sage.Platform.WebPortal.Services;
using Sage.Platform.WebPortal.Workspaces.Tab;
using Sage.SalesLogix.Client.GroupBuilder;
using Sage.SalesLogix.Security;

//[assembly: WebResource("Sage.SalesLogix.Client.GroupBuilder.jscript.Filter_ClientScript.js", "text/javascript", PerformSubstitution = true)]
public partial class SmartParts_TaskPane_ActivityFilters : System.Web.UI.UserControl, ISmartPartInfoProvider
{
    protected void Page_Load(object sender, EventArgs e)
    {
        IContextService context = ApplicationContext.Current.Services.Get<IContextService>(true);
        if (Page.Request["useWelcomeCriteria"] == "T" && !setWelcomeCriteria)
        {
            string timeFrame = (string)context.GetContext("WelcomeSearchTimeframe");
            SLXUserService slxUserService = ApplicationContext.Current.Services.Get<IUserService>() as SLXUserService;
            if (slxUserService != null)
            {
                string userid = slxUserService.GetUser().Id; // store the Current UserID in the Group context object
                SetCurrentTab("0", true);
                FilterManager.SetPersistedData(FilterManager.AppliedFiltersKey,
                                               FilterManager.GetWelcomeCriteria(userid, "1"));
                setWelcomeCriteria = true;
            }
        }

        //ScriptManager.RegisterClientScriptBlock(
        //        Page,
        //        typeof(Page),
        //        "filter-client-script",
        //        String.Format(
        //            @"<script pin=""pin"" type=""text/javascript"" src=""{0}""></script>",
        //            Page.ClientScript.GetWebResourceUrl(typeof(Sage.SalesLogix.Client.GroupBuilder.BaseFilter), "Sage.SalesLogix.Client.GroupBuilder.jscript.Filter_ClientScript.js")
        //        ),
        //        false);
        /*
        ScriptManager.GetCurrent(Page).Scripts.Add(
            new ScriptReference("Sage.SalesLogix.Client.GroupBuilder.jscript.Filter_ClientScript.js",
            "Sage.SalesLogix.Client.GroupBuilder"));
        */

        IUserOptionsService _UserOptions = ApplicationContext.Current.Services.Get<IUserOptionsService>(true);
        StringBuilder script = new StringBuilder();
        script.AppendFormat(
            "\nvar {0};$(document).ready(function(){{if (!{0} && (Sage.FilterManager))\n{{ {0} = new Sage.FilterManager({{id: \"{0}\",clientId: \"{1}\", allText: \"({2})\"}});{0}.init();Sage.PopulateFilterList();}}}});\n",
            ID, ClientID, GetLocalResourceObject("All").ToString());
        script.Append("var UserNameLookup={");
        IRepository<User> users = EntityFactory.GetRepository<User>();
        foreach (User u in users.FindAll())
            script.AppendFormat("\"{0}\": \"{1}, {2}\", ", u.Id, u.UserInfo.LastName, u.UserInfo.FirstName);
        script.Append("\"null\": \"null\"};\n");
        script.Append("var LocalizedActivityStrings={");
        string[] ActivityTypes = new string[] { "atToDo", "atAppointment", "atPhoneCall", "atPersonal", "atLiterature" };
        foreach (string v in ActivityTypes)
            script.AppendFormat("\"{0}\": \"{1}\", ", v, GetLocalResourceObject(v).ToString());
        script.Append("\"null\": \"null\"};\n");
        script.AppendFormat("Sage.FilterStrings={{\"allText\": \"({0})\"}};\n",
                            GetLocalResourceObject("All").ToString());
        script.AppendFormat("Sage.AppliedActivityFilterData={0};\n", FilterManager.GetPersistedData(FilterManager.AppliedFiltersKey));
        script.AppendFormat("Sage.HiddenActivityFilterData={0};\n", FilterManager.GetPersistedData(FilterManager.HiddenFiltersKey));
        ScriptManager.RegisterStartupScript(this.Page, typeof(Page), ID, script.ToString(), true);

        HyperLink clear = new HyperLink();
        clear.NavigateUrl = string.Format("javascript:{0}.ClearFilters();", ID);
        clear.Attributes.Add("style", "display: block; margin-bottom: 0.5em");
        clear.Text = GetLocalResourceObject("Clear_Filters").ToString();
        this.Controls.Add(clear);

        string[] ActivityEntities = { "Activity", "UserNotification", "LitRequest", "Event" };
        foreach (string table in ActivityEntities)
        {
            IList<BaseFilter> filterList = FilterManager.GetFiltersForEntity(table, this.Page.Server.MapPath(@"Filters\"));
            foreach (BaseFilter f in filterList)
            {
                this.Controls.Add(f);
            }
        }

        edit.NavigateUrl = string.Format("javascript:{0}.EditFilters();", ID);
        edit.Text = GetLocalResourceObject("Edit_Filters").ToString();

    }

    private bool setWelcomeCriteria = false;

    private void SetCurrentTab(string tab, Boolean overwrite)
    {
        if (string.IsNullOrEmpty(tab)) { return; }
        ConfigurationManager manager = ApplicationContext.Current.Services.Get<ConfigurationManager>(true);
        ApplicationPage pg = Page as ApplicationPage;
        string mypagealias = Page.GetType().FullName + pg.ModeId;

        TabWorkspaceState tws = manager.GetInstance<TabWorkspaceState>(mypagealias, true);
        if ((tws != null) && (overwrite) && (tws.MainTabs.Count > int.Parse(tab)))
        {
            tws.ActiveMainTab = tws.MainTabs[int.Parse(tab)];
            manager.WriteInstance(tws, mypagealias, true);
        }
    }

    /// <summary>
    /// Gets the smart part info.
    /// </summary>
    /// <param name="smartPartInfoType">Type of the smart part info.</param>
    /// <returns></returns>
    public ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        Sage.Platform.WebPortal.SmartParts.ToolsSmartPartInfo tinfo = new Sage.Platform.WebPortal.SmartParts.ToolsSmartPartInfo();
        foreach (Control c in Filters_RTools.Controls)
        {
            tinfo.RightTools.Add(c);
        }
        return tinfo;
    }
}
