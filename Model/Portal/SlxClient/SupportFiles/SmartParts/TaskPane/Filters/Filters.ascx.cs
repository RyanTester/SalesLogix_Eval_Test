using System;
using System.Collections.Generic;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Sage.Common.Syndication.Json;
using Sage.Platform.Application;
using Sage.Platform.Application.UI;
using Sage.SalesLogix.Client.GroupBuilder;

//[assembly: WebResource("Sage.SalesLogix.Client.GroupBuilder.jscript.Filter_ClientScript.js", "text/javascript", PerformSubstitution = true)]

public partial class SmartParts_TaskPane_Filters : System.Web.UI.UserControl, ISmartPartInfoProvider
{

    protected void Page_Load(object sender, EventArgs e)
    {
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

        StringBuilder script = new StringBuilder();
        script.AppendFormat( 
            "var {0};$(document).ready(function(){{if (!{0} && (Sage.FilterManager)){{ {0} = new Sage.FilterManager({{id: \"{0}\",clientId: \"{1}\", allText: \"({2})\"}});{0}.init();}}}});",
            ID, ClientID, GetLocalResourceObject("All").ToString());
        script.AppendFormat("Sage.FilterStrings={{\"allText\": \"({0})\"}};",
                            GetLocalResourceObject("All").ToString());
        ScriptManager.RegisterStartupScript(this.Page, typeof(Page), ID, script.ToString(), true);

        HyperLink clear = new HyperLink();
        clear.NavigateUrl = string.Format("javascript:{0}.ClearFilters();", ID);
        clear.Text = GetLocalResourceObject("Clear_Filters").ToString();
        clear.Attributes.Add("style", "display: block; margin-bottom: 0.5em");
        this.Controls.Add(clear);

        GroupContext groupContext = GroupContext.GetGroupContext();
        string entity = groupContext.CurrentEnity;
        entity = string.IsNullOrEmpty(entity) ? "Activity" : entity;
        IList<BaseFilter> filterList = FilterManager.GetFiltersForEntity(entity, this.Page.Server.MapPath(@"Filters\"));
        foreach (BaseFilter f in filterList)
        {
            this.Controls.Add(f);
        }

        edit.NavigateUrl = string.Format("javascript:{0}.EditFilters();", ID);
        edit.Text = GetLocalResourceObject("Edit_Filters").ToString();

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
