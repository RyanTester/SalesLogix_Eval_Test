using System;
using System.Configuration;
using System.Web.UI;
using Sage.Platform.Application;
using Sage.Platform.WebPortal.Services;
using Sage.Platform.WebPortal.Workspaces;

public partial class ProcessTasksTasklet : System.Web.UI.UserControl
{
    protected void Page_Load(object sender, EventArgs e)
    {
        ScriptManager.GetCurrent(Page).Scripts.Add(new ScriptReference("~/SmartParts/TaskPane/ProcessTasks/ProcessTasksTasklet.js"));   
    }
}
