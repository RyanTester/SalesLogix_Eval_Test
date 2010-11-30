using System;
using System.Web;
using Sage.SalesLogix;

public class Global : HttpApplication
{
    static readonly log4net.ILog Log = log4net.LogManager.GetLogger(
        System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

    void Application_Start(object sender, EventArgs e)
    {
        string path = Server.MapPath("~/log4net.config");
        log4net.Config.XmlConfigurator.Configure(new System.IO.FileInfo(path));

        Log.Info("SalesLogix Web Client initializing.");

        InitializeSalesLogix();

        // NOTE: To use NHibernate Profiler ( http://nhprof.com )
        // 1. Add a reference to HibernatingRhinos.NHibernate.Profiler.Appender.dll assembly
        //    (Do not overwrite log4net.dll if prompted.)
        // 2. Uncomment following line:
        // HibernatingRhinos.NHibernate.Profiler.Appender.NHibernateProfiler.Initialize();

        Log.Info("SalesLogix Web Client started.");
    }

    private void InitializeSalesLogix()
    {
        string connectionConfigPath = Server.MapPath("~/connection.config");
        if (System.IO.File.Exists(connectionConfigPath))
        {
            var connectionInfo = SLXConnectionInfo.ReadFromFile(connectionConfigPath);

            int connectionPort;
            int.TryParse(connectionInfo.Port, out connectionPort);
            SLXSystemPool.Initialize(connectionInfo.Server, connectionPort);
        }
    }

    void Application_End(object sender, EventArgs e)
    {
        Log.Info("SalesLogix Web Client ended.");
    }

    void Application_Error(object sender, EventArgs e)
    {
        Exception ex = Server.GetLastError();

        if (Request.FilePath.EndsWith(".aspx"))
        {
            Log.Error("Unhandled exception.", ex);
            Server.ClearError();
            Response.Write(GetErrorPageHtml(ex));
        }
    }

    void Session_Start(object sender, EventArgs e)
    {
        // Code that runs when a new session is started
    }

    void Session_End(object sender, EventArgs e)
    {
        // Code that runs when a session ends. 
        // Note: The Session_End event is raised only when the sessionstate mode
        // is set to InProc in the Web.config file. If session mode is set to StateServer 
        // or SQLServer, the event is not raised.
    }

    void Application_BeginRequest(object sender, EventArgs e)
    {
        if (Request.HttpMethod == "GET")
            AddScriptDeferResponseFilter();
    }

    private void AddScriptDeferResponseFilter()
    {
        string path = Request.AppRelativeCurrentExecutionFilePath;
        if (!path.EndsWith(".aspx", StringComparison.OrdinalIgnoreCase)) return;

        // skip these pages - no other pages are named the same, can just check end
        if (path.EndsWith("ViewAttachment.aspx", StringComparison.OrdinalIgnoreCase)
            || path.EndsWith("ViewDocument.aspx", StringComparison.OrdinalIgnoreCase)) return;

        Response.Filter = new Dropthings.Web.Util.ScriptDeferFilter(Response);
    }

    private string GetErrorPageHtml(Exception e)
    {
        return string.Format(ErrorPageHtmlFmt,
            Resources.SalesLogix.ExceptionPageTitle,
            Resources.SalesLogix.CannotCompleteRequest,
            e.GetBaseException().Message,
            Resources.SalesLogix.Actions,
            Resources.SalesLogix.ReturnLink,
            Resources.SalesLogix.EmailSubject,
            Request.Url,
            e.GetBaseException().Message,
            e.GetBaseException().StackTrace,
            Resources.SalesLogix.MailDetailsLink,
            Resources.SalesLogix.ShowDetails);
    }

    private const string ErrorPageHtmlFmt = @"<html xmlns=""http://www.w3.org/1999/xhtml"">
<head runat=""server"">
    <title>{0}</title>
    <link rel=""stylesheet"" type=""text/css"" href=""css/SlxBase.css"" />
    <style type=""text/css"">
    .msg {{ padding: 50px 50px; width: 800px; }}
    .header {{ font-size : 150%; color: #01795E; }}
    .globalerrormsg {{ }}
    .action {{ font-size : 100%; color: #01795E; padding: 30px 0px 0px 0px; border-bottom: solid 1px #01795E; }}
    .actionitem {{ padding-bottom:10px; }}
    .exceptionDetails {{ display : none; border: solid 1px #01795E; font-family:Courier; font-size:80%; padding:5px; overflow:scroll; height:250px; width:600px; }}
    </style>
    <script type=""text/javascript"">
    var open = false;
    function toggleDetails() {{
        var elem = document.getElementById('details');
        elem.style.display = (open) ? 'none' : 'block';
        open = !open;
    }}
    </script>
</head>
<body>
  <div class=""msg"">
    <p class=""header"">{1}</p>
    <p class=""globalerrormsg"">{2}</p>
    <p class=""action"">{3}</p>
    <ul>
      <li class=""actionitem""><a href=""Default.aspx"">{4}</a></li>
      <li class=""actionitem""><a href=""mailto:?subject={5}&body={6} {7} {8}"">{9}</a></li>
      <li class=""actionitem""><a href=""javascript:toggleDetails()"">{10}</a></li>
    </ul>
    <div class=""exceptionDetails"" id=""details"">{6} {7} {8}</div>
  </div>
</body>
</html>";
}
