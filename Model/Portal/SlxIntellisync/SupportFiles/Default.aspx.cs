using System;
using System.IO;

public partial class _Default : System.Web.UI.Page 
{

    protected override void OnPreLoad(EventArgs e)
    {
        base.OnPreLoad(e);

        SetVersion();
        BuildDownloadLink();

    }
    private void BuildDownloadLink()
    {
        
        string path = Server.MapPath(@"Downloads\IntellisyncInstall.zip");
        
        if (!File.Exists(path))
        {
            intellisyncDownload.Visible = false;
        }

    }

    private void SetVersion()
    {
        Version version = typeof(Sage.SalesLogix.Intellisync.Entity.ActivityGetCommand).Assembly.GetName().Version;
        VersionLabel.Text = String.Format("Version {0}", version.ToString());
    }
    
}
