<%@ Page Language="C#" MasterPageFile="~/Masters/Login.master" AutoEventWireup="true" Culture="auto" UICulture="auto" EnableEventValidation="false"%>
<%@ Import Namespace="Sage.Platform.Application"%>

<asp:Content ID="Content1" runat="server" ContentPlaceHolderID="ContentPlaceHolderArea" >

    <asp:Login ID="slxLogin" runat="server" CssClass="slxlogin"
        DestinationPageUrl="Default.aspx" OnPreRender="PreRender"
        Font-Names="Arial,Verdana,Sans-sarif" Font-Size="0.8em" ForeColor="#000000" >

        <LayoutTemplate>
            <div id="splashimg">
                <div id="LoginForm">
                    <div id="LoginLeftCol">
                        <div>
                            <asp:Label ID="UserNameLabel" runat="server" AssociatedControlID="UserName" meta:resourcekey="UserNameLabelResource1">User Name:</asp:Label>
                        </div>
                        <asp:Label ID="PasswordLabel" runat="server" AssociatedControlID="Password" meta:resourcekey="PasswordLabelResource1">Password:</asp:Label>
                    </div>
                    <div id="LoginRightCol">
                        <asp:TextBox ID="UserName" runat="server" CssClass="editCtl" meta:resourcekey="UserNameResource1"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="UserNameRequired" runat="server" ControlToValidate="UserName"
                            ErrorMessage="User Name is required." ToolTip="User Name is required." ValidationGroup="slxLogin" meta:resourcekey="UserNameRequiredResource1">*</asp:RequiredFieldValidator>
                        <br />
                        <asp:TextBox ID="Password" runat="server" CssClass="editCtl" TextMode="Password"></asp:TextBox>
                        <asp:Button ID="btnLogin" runat="server"  CommandName="Login" Class="okButton" Text="Log On" ValidationGroup="slxLogin"
                                meta:resourcekey="LoginButtonResource1" />
                        <div id="RememberMe">
                            <asp:CheckBox ID="chkRememberMe" runat="server" meta:resourcekey="RememberMeResource1" Checked="false" Text="Remember me next time." />
                        </div>
                        <div id="loginMsgRow" class="loginmsg">
                            <asp:Literal ID="FailureText" runat="server" EnableViewState="False" meta:resourcekey="FailureTextResource1"></asp:Literal>
                            &nbsp;
                        </div>
                        <div id="ExtFeatures">
                            <asp:Label ID="ExtendedFeatures" runat="server" Text="Extended Features may require a download" meta:resourcekey="ExtendedFeaturesResource2"></asp:Label><asp:HyperLink ID="FindOut" runat="server" Text="Find out more" NavigateUrl="javascript:showMoreInfo()" meta:resourcekey="ExtendedFeaturesResource1"></asp:HyperLink>
                            <div class="settings">
                                <div>
                                    <asp:Label ID="UseActiveMail" runat="server" Text="Active Mail" meta:resourcekey="ActiveMail" ></asp:Label>
                                </div>
                                <span><asp:RadioButtonList ID="UseActiveMailList" runat="server" CellPadding="0" CellSpacing="0">
                                <asp:ListItem Text="Use my settings" meta:resourcekey="ActiveMail_UseSetting" Selected="True"></asp:ListItem>
                                <asp:ListItem Text="Use ActiveMail this time (requires ActiveX)" meta:resourcekey="ActiveMail_Download"></asp:ListItem>
                                <asp:ListItem Text="Do not use ActiveMail this time" meta:resourcekey="ActiveMail_DoNotDownload"></asp:ListItem>
                                </asp:RadioButtonList></span>
                            </div>
                        </div>                 
                        <div id="VersionSection">
                            <asp:Label ID="VersionLabel" runat="server" Text="Version"></asp:Label>
                            <div class="info">
                                <div><asp:Label ID="Copyright" runat="server" Text="Copyright 1997-2007" meta:resourcekey="CopyrightResource1"></asp:Label></div>
                                <div><asp:Label ID="Sage" runat="server" Text="Sage Software, Inc." meta:resourcekey="SageResource1"></asp:Label></div>
                                <div><asp:Label ID="Rights" runat="server" Text="All Rights Reserved." meta:resourcekey="RightsResource1"></asp:Label></div>
                            </div>					    
                        </div> 
                    </div>
                </div>          
            </div>
        </LayoutTemplate>
    </asp:Login>
</asp:Content>

<script type="text/C#" runat="server">
    protected void Page_Load(object sender, EventArgs e)
    {
 
        System.Web.UI.WebControls.CheckBox rememberMe = (System.Web.UI.WebControls.CheckBox)slxLogin.Controls[0].FindControl("chkRememberMe");
        System.Web.UI.WebControls.TextBox userName = (System.Web.UI.WebControls.TextBox)slxLogin.Controls[0].FindControl("UserName");
        RadioButtonList uam = (RadioButtonList)slxLogin.Controls[0].FindControl("UseActiveMailList");
        if (!Request.Browser.ActiveXControls)
        {
            uam.Enabled = false;
        }
        if (IsPostBack)
        {
            if (uam.SelectedIndex > 0)
            {
                HttpCookie cookie = new HttpCookie("SlxActiveMail");
                cookie.Value = (uam.SelectedIndex == 1? "T":"F");
                cookie.Expires = DateTime.Now.AddDays(14);
                Response.Cookies.Add(cookie);
            }
            else
            {
                HttpCookie cookie = new HttpCookie("SlxActiveMail");
                cookie.Expires = DateTime.Now.AddDays(-1);
                Response.Cookies.Add(cookie);
            }
            HttpCookie cookieRememberMe = new HttpCookie("SLXRememberMe");
            cookieRememberMe.Value = (rememberMe.Checked ? "T" : "F");
            cookieRememberMe.Expires = DateTime.Now.AddDays(14);
            Response.Cookies.Add(cookieRememberMe);
            
            if (rememberMe.Checked)
            {
                HttpCookie cookieUserName = new HttpCookie("SLXUserName");
                cookieUserName.Value = Server.UrlEncode(userName.Text);
                cookieUserName.Expires = DateTime.Now.AddDays(14);
                Response.Cookies.Add(cookieUserName);
            }
        }
        else
        {
            if (Request.Cookies["SLXRememberMe"] != null)
            {
                rememberMe.Checked = (Request.Cookies["SLXRememberMe"].Value == "T");
                if ((rememberMe.Checked) && (Request.Cookies["SLXUserName"] != null))
                {
                    userName.Text = Server.UrlDecode(Request.Cookies["SLXUserName"].Value);
                }
            }
            ClearOldSession();
        }
        SetVersion();

        userName.Focus();
    }

    private void ClearOldSession()
    {
        string[] cookiesToDelete = {"SlxCalendar", "SlxCalendarASP"};
        foreach (string val in cookiesToDelete)
        {
            HttpCookie delCookie = new HttpCookie(val);
            delCookie.Expires = DateTime.Now.AddDays(-1d);
            Response.Cookies.Add(delCookie);
            Request.Cookies.Remove(val);
        }
        Session.Abandon();
    }

    protected new void PreRender(object sender, EventArgs e)
    {
        object msg = Sage.Platform.Application.ApplicationContext.Current.State["AuthError"];
        if (msg != null)
        {
            Sage.Platform.Application.ApplicationContext.Current.State.Remove("AuthError");
            
            Literal FailureText = (Literal)slxLogin.FindControl("FailureText");
            FailureText.Text = msg.ToString();
        }
    }
    private void SetVersion()
    {
        Version version = typeof(Sage.SalesLogix.Web.SLXMembershipProvider).Assembly.GetName().Version;
        Label lblVersion = (Label)slxLogin.FindControl("VersionLabel");
        lblVersion.Text = String.Format("{0} {1}", GetLocalResourceObject("VersionLabelResource1.Text").ToString(), version.ToString());
              
    }
    
    
</script>