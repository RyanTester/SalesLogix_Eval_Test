using System;
using System.Data;
using System.Collections;
using System.IO;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;

using Gen = System.Collections.Generic;
using System.Globalization;
using Sage.Platform.WebPortal;
using Sage.Platform.Configuration;
using Sage.SalesLogix.Web.Controls;
using System.Xml;
using System.Xml.Xsl;
using System.Xml.XPath;
using System.Text;

public partial class Masters_help : System.Web.UI.MasterPage
{
    HttpCookie _cultureCookie = null;

    protected void Page_Init(object sender, EventArgs e)
    {
        SetHelpCulture();
    }

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!Page.IsPostBack)
        {
            ddlSupportedCultures.DataSource = HelpSiteMapProvider.SupportedHelpCultures;
            ddlSupportedCultures.DataValueField = "Name";
            ddlSupportedCultures.DataTextField = "DisplayName";
            ddlSupportedCultures.DataBind();
        }
		Page.Title = GetLocalResourceObject("HelpPageTitle").ToString();
        //try
        //{
        //	Page.RegisterClientScriptBlock("dropdown script",
        //		System.IO.File.ReadAllText(Server.MapPath("~/help/Common/js/dropdown.js")));
        //}
        //catch (Exception ex)
        //{
        //Response.Write(ex.Message);
        //}
        GenerateScript();

        hlHome.NavigateUrl = Request.Url.GetLeftPart(System.UriPartial.Path);
    }

    private void GenerateScript()
    {
        StringBuilder script = new StringBuilder();

        script.AppendLine("function HandleEnterKeyEvent(e)");
        script.AppendLine("{");
        script.AppendLine("    if (!e) var e = window.event;");
        script.AppendLine("    if (e.keyCode == 13) //Enter");
        script.AppendLine("    {");
        script.AppendLine("        e.returnValue = false;");
        script.AppendLine("        e.cancelBubble = true;");
        script.AppendFormat("        var btn = document.getElementById(\"{0}\");", imgSearchIcon.ClientID);
        script.AppendLine("        if (document.createEvent)");
        script.AppendLine("        {");
        script.AppendLine("            var evt = document.createEvent(\"MouseEvents\");");
        script.AppendLine("            evt.initMouseEvent(\"click\", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);");
        script.AppendLine("            btn.dispatchEvent(evt);");
        script.AppendLine("        }");
        script.AppendLine("        else");
        script.AppendLine("        {");
        script.AppendLine("            btn.click();");
        script.AppendLine("        }");
        script.AppendLine("    }");
        script.AppendLine("}");

        ScriptManager.RegisterClientScriptBlock(Page, GetType(), ClientID, script.ToString(), true);
    }

    protected void TOC_DataBound(object sender, TreeNodeEventArgs e)
    {
        try
        {
            if ((e != null) && (e.Node != null) && (Request.QueryString["content"] != null))
            {
                if ((e.Node.Depth < 2) || (Request.QueryString["content"].Contains(e.Node.Text)))
                {
                    e.Node.Expanded = true;
                }
                else
                {
                    e.Node.Expanded = false;
                }
            }
        }
        catch
        {
            return; //sometimes e is in an invalid state
        }
    }


    protected void Page_PreRender(object sender, EventArgs e)
    {
        try
        {
            string value = _cultureCookie != null ? _cultureCookie.Value : "en";
            if (ddlSupportedCultures.Items.FindByValue(value) != null)
                ddlSupportedCultures.SelectedValue = value;
            else
                ddlSupportedCultures.SelectedValue = "en";
        }
        catch
        {
            ddlSupportedCultures.SelectedValue = "en";
        }

        if (_cultureCookie != null)
        {
            _cultureCookie.Expires = DateTime.Now.AddYears(1);
            Response.Cookies.Add(_cultureCookie);
        }
    }

    private void SetHelpCulture()
    {
        _cultureCookie = Request.Cookies[HelpConstant.HelpCultureCookieName];
        string preferredHelpCultureName = _cultureCookie != null ? _cultureCookie.Value : string.Empty;

        if (string.IsNullOrEmpty(preferredHelpCultureName))
        {
            preferredHelpCultureName = System.Threading.Thread.CurrentThread.CurrentCulture.Name;
            _cultureCookie = new HttpCookie(HelpConstant.HelpCultureCookieName, preferredHelpCultureName);
            Request.Cookies.Add(_cultureCookie);
            Response.Cookies.Add(_cultureCookie);
        }

        helpSiteMapDataSource.SiteMapProvider = HelpSiteMapProvider.GetHelpProviderNameByCultureName(preferredHelpCultureName);
    }


    protected void ddlSupportedCultures_SelectedIndexChanged(object sender, EventArgs e)
    {
        //HttpCookie cultureCookie = Request.Cookies[HelpConstant.HelpCultureCookieName];
        string saveHelpCultureName = _cultureCookie != null ? _cultureCookie.Value : string.Empty;
        string newHelpCultureName = ddlSupportedCultures.SelectedValue;

        if (_cultureCookie != null)
        {
            _cultureCookie.Value = newHelpCultureName;
            Request.Cookies[HelpConstant.HelpCultureCookieName].Value = newHelpCultureName;
        }

        if (saveHelpCultureName.CompareTo(newHelpCultureName) != 0)
        {
            string url = Server.UrlDecode(Request.Url.PathAndQuery); //Request.Url.ToString();
            string saveRootUrl = HelpSiteMapProvider.GetProviderRootUrlByCultureName(saveHelpCultureName);
            string newRootUrl = HelpSiteMapProvider.GetProviderRootUrlByCultureName(newHelpCultureName);
            //Response.Redirect(url.Replace(saveRootUrl, newRootUrl));
            //Using the transfer method maintains the newly chosen culture name.
            Server.Transfer(url.Replace(saveRootUrl, newRootUrl));
        }
    }

    protected void imgSearchIcon_Click(object sender, ImageClickEventArgs e)
    {
        string helpCultureName = _cultureCookie != null ? _cultureCookie.Value : string.Empty;
        string rootUrl = HelpSiteMapProvider.GetProviderRootUrlByCultureName(helpCultureName);
        string contentIndexName = "HelpContentIndex:" + rootUrl;
        ContentIndex myContentIndex = null;
        ContentSearchResult mySearchResult = null;
        XmlDocument doc = new XmlDocument();
        XslCompiledTransform xslt = new XslCompiledTransform();
        XsltArgumentList xsltArgs = new XsltArgumentList();
        StringWriter xsltResult = null;
        string exprPageTitle = @"(?si)(?:(?<=<meta\s*name\s*=\s*(?:""|')menuText(?:""|')\s*content\s*=\s*(?:""|'))(?<contentAttribute>.*?[^(?:"")]*)(?=(?:"")[^>]*>)|(?<=<meta\s*content\s*=\s*(?:""|'))(?<contentAttribute>.*?[^(?:"")]*)(?=(?:"")\s*name\s*=\s*(?:""|')menuText(?:""|')\s*[^>]*>))";

        if (txtSearch.Text.Length > 0)
        {
            try
            {
                myContentIndex = Application[contentIndexName] as ContentIndex;
                if (myContentIndex == null)
                {
                    myContentIndex = new ContentIndex(Page.MapPath(rootUrl), exprPageTitle);
                    Application[contentIndexName] = myContentIndex;
                }

                mySearchResult = myContentIndex.Search(txtSearch.Text);
                doc.LoadXml(mySearchResult.ToXml());
                xslt.Load(Server.MapPath("css/searchResult.xsl"));
                xsltArgs.AddParam("hrefPrefix", string.Empty, Request.Url.GetLeftPart(System.UriPartial.Path) + "?page=Help&content=");
                xsltArgs.AddParam("relativeURL", string.Empty, rootUrl);
                xsltArgs.AddParam("mappedURL", string.Empty, Page.MapPath(rootUrl));

                xsltResult = new StringWriter();
                xslt.Transform(doc, xsltArgs, xsltResult);

                litMainContent.Text = xsltResult.ToString();
            }
            catch (XmlException xmlEx)
            {
                if (xmlEx.Message.ToLowerInvariant().Contains("root"))
                {   //Missing root element.
                    litMainContent.Text = String.Format(GetLocalResourceObject("NoContentFound").ToString(), txtSearch.Text);
                }
                else
                {
                    litMainContent.Text = String.Format(GetLocalResourceObject("UnableToSearch").ToString(), xmlEx.Message);
                }
            }
            catch (Exception ex)
            {
				litMainContent.Text = String.Format(GetLocalResourceObject("UnableToSearch").ToString(), ex.Message);
            }
            finally
            {
                if (xsltResult != null)
                    xsltResult.Close();               
            }
        }
    }
}
