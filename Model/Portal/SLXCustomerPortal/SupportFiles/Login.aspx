<%@ Page Language="C#" MasterPageFile="~/Masters/Login.master" AutoEventWireup="true" Culture="auto" UICulture="auto" EnableEventValidation="false"%>
<%@ Import Namespace="Sage.Platform.Orm"%>
<%@ Import Namespace="System.Collections.Generic"%>
<%@ Import Namespace="NHibernate"%>
<%@ Import Namespace="Sage.Entity.Interfaces"%>
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
                        <div id="ForgotPassword">            
                            <asp:LinkButton runat="server" OnClick="GetPasswordHint_Click" Text="Forgot your password?" ID="passwordHint" CssClass="forgotPassword"
                                meta:resourcekey="ForgotYourPassword" EnableViewState="False">
                            </asp:LinkButton>
                        </div>
                        <div id="RememberMe">
                            <asp:CheckBox ID="chkRememberMe" runat="server" meta:resourcekey="RememberMeResource1" Checked="false" Text="Remember me next time." />
                        </div>
                        <div id="loginMsgRow" class="loginmsg">
                            <asp:Literal ID="FailureText" runat="server" EnableViewState="False" meta:resourcekey="FailureTextResource1"></asp:Literal>
                            &nbsp;
                        </div>               
                        <div id="VersionSection" style="position: relative; top: 80px;">
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
        CheckBox rememberMe = (CheckBox)slxLogin.Controls[0].FindControl("chkRememberMe");
        TextBox userName = (TextBox)slxLogin.Controls[0].FindControl("UserName");

        if (IsPostBack)
        {

            HttpCookie cookieRememberMe = new HttpCookie("SLXCustPortalRememberMe");
            cookieRememberMe.Value = (rememberMe.Checked ? "T" : "F");
            cookieRememberMe.Expires = DateTime.Now.AddDays(14);
            Response.Cookies.Add(cookieRememberMe);

            if (rememberMe.Checked)
            {
                HttpCookie cookieUserName = new HttpCookie("SLXCustPortalUserName");
                cookieUserName.Value = userName.Text;
                cookieUserName.Expires = DateTime.Now.AddDays(14);
                Response.Cookies.Add(cookieUserName);
            }
        }
        else
        {
            if (Request.Cookies["SLXCustPortalRememberMe"] != null)
            {
                rememberMe.Checked = (Request.Cookies["SLXCustPortalRememberMe"].Value == "T");
                if ((rememberMe.Checked) && (Request.Cookies["SLXCustPortalUserName"] != null))
                {
                    userName.Text = Request.Cookies["SLXCustPortalUserName"].Value;
                }
            }
        }

        SetVersion();
        userName.Focus();
    }


    protected new void PreRender(object sender, EventArgs e)
    {
        object msg = Sage.Platform.Application.ApplicationContext.Current.State["AuthError"];
        if (msg != null)
        {
            Sage.Platform.Application.ApplicationContext.Current.State.Remove("AuthError");
            
            Literal FailureText = (Literal)slxLogin.FindControl("FailureText");
            FailureText.Text = msg.ToString();
            FailureText.Visible = true;
        }
    }
    private void SetVersion()
    {
        Version version = typeof(Sage.SalesLogix.Web.SLXMembershipProvider).Assembly.GetName().Version;
        Label lblVersion = (Label)slxLogin.FindControl("VersionLabel");
        lblVersion.Text = String.Format("{0} {1}", GetLocalResourceObject("VersionLabelResource1.Text").ToString(), version.ToString());
              
    }
    /// <summary>
    /// Handles the Click event of the GetPasswordHint control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void GetPasswordHint_Click(object sender, EventArgs e)
    {
        TextBox userName = (TextBox)slxLogin.Controls[0].FindControl("UserName");
        Literal HintText = (Literal)slxLogin.FindControl("FailureText");

        if (String.IsNullOrEmpty(userName.Text))
        {
            HintText.Text = GetLocalResourceObject("PasswordHintUserNameRequired").ToString();
        }
        else
        {
            IList<IContact> contacts = null;
            using (ISession session = new SessionScopeWrapper())
            {
                contacts = session.CreateQuery("from Contact c where c.WebUserName = :value")
                   .SetAnsiString("value", userName.Text)
                   .List<IContact>();
            }
            if ((contacts != null) && (contacts.Count > 0))
            {
                HintText.Text = string.Format("<span style=\"color:green;\">{0}</span>", contacts[0].WebPasswordHint);
            }
        }
        HintText.Visible = true;
    }


</script>