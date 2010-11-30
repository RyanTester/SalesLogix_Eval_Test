using System;
using System.Web.UI;

public partial class WinAuthLoad : Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

        Page.ClientScript.RegisterClientScriptInclude("YAHOO_yahoo", "jscript/YUI/yahoo.js");
        Page.ClientScript.RegisterClientScriptInclude("YAHOO_event", "jscript/YUI/event.js");
        Page.ClientScript.RegisterClientScriptInclude("YAHOO_connection", "jscript/YUI/connection.js");
        HiddenField1.Value = Request.Params["next_url"];
    }

    protected void Page_LoadComplete(object sender, EventArgs e)
    {
        //Response.Redirect(Request.Params["next_url"] + "?loaded=true");
    }
    protected void Button1_Click(object sender, EventArgs e)
    {
        Response.Redirect(Request.Params["next_url"]);
    }
}
