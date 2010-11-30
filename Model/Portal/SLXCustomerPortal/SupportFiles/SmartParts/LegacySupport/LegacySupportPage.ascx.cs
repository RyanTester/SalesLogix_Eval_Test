using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using Sage.SalesLogix.Security;
using Sage.Platform;
using Sage.SalesLogix.Client.LegacySupport;


/// <summary>
/// Class for hosting a full legacy page.
/// </summary>
public partial class LegacySupportPage : System.Web.UI.UserControl
{
    /// <summary>
    /// Handles the Load event of the Page control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void Page_Load(object sender, EventArgs e)
    {
        string UserId = "ADMIN";
        SLXUserService slxUserService = Sage.Platform.Application.ApplicationContext.Current.Services.Get<Sage.Platform.Security.IUserService>() as SLXUserService;
        if (slxUserService != null)
            UserId = slxUserService.GetUser().Id.ToString().Trim();

        LegacySupportCommon.LegacyLogin(UserId, Page);
        HtmlContainerControl div = (HtmlContainerControl)FindControl("prefscookiediv");

        var conn = LegacySupportCommon.GetOpenConnection();
        var cmd = conn.CreateCommand();
        cmd.Connection = conn;
        string vSQL = String.Format("SELECT USERPREFERENCES FROM SLXWEBUSERINFO WHERE USERID LIKE '{0}%'", UserId);
        try
        {
            cmd.CommandText = vSQL;
            object res = cmd.ExecuteScalar();
            string cookstr = (res == null) ? "" : res.ToString();
            if (cookstr == "")
            {
                vSQL = "SELECT PATH FROM SLXWEBALIAS WHERE NAME = 'defprefs' AND ISACTIVE = 'T'";
                cmd.CommandText = vSQL;
                res = cmd.ExecuteScalar();
                cookstr = (res == null) ? "" : res.ToString();
            }
            cookstr = cookstr.Replace("<#SYS name=theuserid>", UserId);
            if (cookstr.IndexOf("caldefuser") < 0)
            {
                cookstr += "&caldefuser=" + UserId;
            }
            div.InnerText = cookstr;
        }
        finally
        {
            cmd.Dispose();
            conn.Close();
            conn.Dispose();
        }
    }


}
