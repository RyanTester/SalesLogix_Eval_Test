using System;
using System.Text.RegularExpressions;

public partial class SmartParts_help : System.Web.UI.UserControl
{
    protected void Page_Init(object sender, EventArgs e)
    {
        string keyword = Regex.Replace(Request.RawUrl, @"[\w\W]*\\", string.Empty);

        RedirectLink.NavigateUrl = keyword;
    }


}
