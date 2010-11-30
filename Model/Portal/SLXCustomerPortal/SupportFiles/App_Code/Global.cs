using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;

/// <summary>
/// Summary description for Global
/// </summary>
public class Global : System.Web.HttpApplication
{
    static readonly log4net.ILog log = log4net.LogManager.GetLogger(
        System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

    void Application_Start(object sender, EventArgs e)
    {
        string path = Server.MapPath("~/log4net.config");
        log4net.Config.XmlConfigurator.Configure(new System.IO.FileInfo(path));
        log.Info("SalesLogix Web Client started.");

        string connectionConfigPath = Server.MapPath("~/connection.config");
        if (System.IO.File.Exists(connectionConfigPath))
        {
            Sage.SalesLogix.SLXConnectionInfo connectionInfo = Sage.SalesLogix.SLXConnectionInfo.ReadFromFile(connectionConfigPath);

            int connectionPort;
            Int32.TryParse(connectionInfo.Port, out connectionPort);
            Sage.SalesLogix.SLXSystemPool.Initialize(connectionInfo.Server, connectionPort);
        }
    }

    void Application_End(object sender, EventArgs e)
    {
        log.Info("SalesLogix Customer Portal ended.");
    }

    private const string _errorPageHtmlFmt = @"<html xmlns=""http://www.w3.org/1999/xhtml"">
<head runat=""server"">
    <title>{0}</title>
    <link rel=""stylesheet"" type=""text/css"" href=""css/SlxBase.css"" />
    <style type=""text/css"">
    .msg {{ padding: 50px 50px; width: 800px; }}
    .header {{ font-size : 150%; color: #01795E; }}
    .errormsg {{ }}
    .action {{ font-size : 100%; color: #01795E; padding: 30px 0px 0px 0px; border-bottom: solid 1px #01795E; }}
    .actionitem {{ padding-bottom:10px; }}
    </style>
</head>
<body>
  <div class=""msg"">
    <p class=""header"">{1}</p>
    <p class=""errormsg"">{2}</p>
    <p class=""action"">{3}</p>
    <ul>
      <li class=""actionitem""><a href=""Default.aspx"">{4}</a></li>
    </ul>
  </div>
</body>
</html>";

    void Application_Error(object sender, EventArgs e)
    {
        Exception ex = Server.GetLastError();
        if (Request.FilePath.EndsWith(".aspx"))
        {
            log.Error("Unhandled exception.", ex);
            Server.ClearError();
            string errMarkup = string.Format(_errorPageHtmlFmt,
                Resources.SalesLogix.ExceptionPageTitle,
                Resources.SalesLogix.CannotCompleteRequest,
                ex.GetBaseException().Message,
                Resources.SalesLogix.Actions,
                Resources.SalesLogix.ReturnLink);
            Response.Write(errMarkup);
        }
    }

}
