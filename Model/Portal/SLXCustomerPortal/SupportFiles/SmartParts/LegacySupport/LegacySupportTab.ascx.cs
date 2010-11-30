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
/// Class to support using a tab view from the legacy web client in the new web client. 
///
/// </summary>
public partial class LegacySupportTab : System.Web.UI.UserControl
{

#region Properties
    private string sTemplate = "";
    /// <summary>
    /// Gets or sets the request string that will be passed to the slxweb com object.
    /// </summary>
    /// <value>The request string.</value>
    public string Template
    {
        get
        {
            return sTemplate;
        }

        set
        {
            sTemplate = value;
        }
    }

    private string sParams = "";
    /// <summary>
    /// Gets or sets the parameters.  They should be of the form: name=value&amp;name2=value2... etc.
    /// </summary>
    /// <value>The parameters.</value>
    public string Parameters
    {
        get
        {
            return sParams;
        }
        set
        {
            sParams = value;
        }
    }

    private string sWidth = "100%";
    /// <summary>
    /// Gets or sets the width of the control.  This may be of the form NUMpx or NUM%
    /// </summary>
    public string Width
    {
        get
        {
            return sWidth;
        }
        set
        {
            sWidth = value;
        }
    }

    private string sHeight = "100%";
    /// <summary>
    /// Gets or sets the width of the control.  This may be of the form NUMpx or NUM%
    /// </summary>
    public string Height
    {
        get
        {
            return sHeight;
        }
        set
        {
            sHeight = value;
        }
    }

    private string sBorder = "0";
    /// <summary>
    /// Gets or sets the Border value, default to 0 (none).
    /// </summary>
    public string Border
    {
        get
        {
            return sBorder;
        }
        set
        {
            sBorder = value;
        }
    }
    #endregion

    /// <summary>
    /// Currently we are going through the legacy slxweb.dll and populating an iframe.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void Page_Load(object sender, EventArgs e)
    {
        if (this.Visible)
        {
            string UserId = "";               
            SLXUserService slxUserService = Sage.Platform.Application.ApplicationContext.Current.Services.Get<Sage.Platform.Security.IUserService>() as SLXUserService;
            if (slxUserService != null)
                UserId = slxUserService.GetUser().Id.ToString().Trim();

            LegacySupportCommon.LegacyLogin(UserId, Page);
            string EntityId = (Request.QueryString["entityId"] == null) ? "" : Request.QueryString["entityId"];

            if ((sParams.Length > 0) && (sParams[0] != '&'))
            {
                sParams = "&" + sParams;
            }
            string sUrl = String.Format("/scripts/slxweb.dll/view?name={0}{1}", sTemplate, sParams);
            if (sUrl.ToLower().IndexOf("id=") == -1)
            {
                sUrl = sUrl + "&id=" + EntityId;
            }
            LegacyTabContent.Attributes.Add("src", sUrl);
            LegacyTabContent.Attributes.Add("width", sWidth);
            LegacyTabContent.Attributes.Add("height", sHeight);
            LegacyTabContent.Attributes.Add("border", sBorder);
       }

    }

}