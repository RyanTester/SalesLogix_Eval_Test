using System;
using System.Web.UI;
using Sage.Platform.Application;
using Sage.SalesLogix.Web;
using Sage.SalesLogix.WebUserOptions;
using Sage.Platform.Application.UI;
using Sage.Entity.Interfaces;
using Sage.SalesLogix.LegacyBridge.Delphi;
using System.Text.RegularExpressions;

public partial class ChangePasswordOptionsPage : System.Web.UI.UserControl, ISmartPartInfoProvider
{
    private string curUser;
    private Sage.SalesLogix.Security.SLXUserService slxUserService;

    protected void Page_Load(object sender, EventArgs e)
    {
        //if (!IsPostBack)
        //{
        ChangePasswordOptions options = ChangePasswordOptions.CreateNew();

        // this check necessary to allow creation of new instance every postback (known bug), 
        // but allowing UI changes
        if (string.IsNullOrEmpty(_newPassword.Text))
        {
            _newPassword.Text = options.NewPassword;  // default is empty
            _confirmPassword.Text = options.NewPassword;  // default is empty
        }
        //}
        slxUserService = Sage.Platform.Application.ApplicationContext.Current.Services.Get<Sage.Platform.Security.IUserService>() as Sage.SalesLogix.Security.SLXUserService;
         curUser = slxUserService.GetUser().Id;

             if (curUser.ToString().Trim() != "ADMIN")
             {
                 lblUser.Visible = false;
                 this.User.Visible = false;
                 PrefsPasswordHelpLink.NavigateUrl = "prefspass.aspx";
             }
             else
             {
                 PrefsPasswordHelpLink.NavigateUrl = "prefspassadmin.aspx";
                 if (this.User.LookupResultValue == null)
                 {
                     this.User.LookupResultValue = curUser;
                     
                 }
             }
  }

    protected void _changePassword_Click(object sender, EventArgs e)
    {
        DelphiComponent dc = new DelphiComponent();
        Sage.SalesLogix.SystemInformation si = Sage.SalesLogix.SystemInformationRules.GetSystemInfo();
        
        DelphiBinaryReader delphi = new DelphiBinaryReader(si.Data);
        dc = delphi.ReadComponent(true);

        string minPasswordLength = dc.Properties["MinPasswordLength"].ToString();
        bool noBlankPassword  = (bool)dc.Properties["NoBlankPassword"];
        bool alphaNumPassword = (bool)dc.Properties["AlphaNumPassword"];
        bool noNameInPassword = (bool)dc.Properties["NoNameInPassword"];
        
        Regex objAlphaNumericPattern = new Regex("[a-zA-Z][0-9]");
        string changingUser = string.Empty;
        
        // Get the user name of the person who's getting their password changed
         Sage.Entity.Interfaces.IUser us = User.LookupResultValue as IUser;

         if (us != null)
         {
             changingUser = us.UserName;
         }
         else
         {
             changingUser = slxUserService.UserName;
         }

        string newPassword = _newPassword.Text;
        if (Convert.ToInt32(minPasswordLength) != 0)
        {
            if (newPassword.Length < Convert.ToInt32(minPasswordLength))
            {
                lblMessage.Text = string.Format(GetLocalResourceObject("minPasswordLength").ToString(), minPasswordLength); //   "Password length must be {0} chars or greater!"
                return;
            }
            if (alphaNumPassword && !objAlphaNumericPattern.IsMatch(newPassword))
            {
                lblMessage.Text = GetLocalResourceObject("alphaNumPassword").ToString();// "Passwords must be alphanumeric!";
                return;
            }

        }
        else if (noBlankPassword && newPassword.Length == 0)
        {
            lblMessage.Text = GetLocalResourceObject("noBlankPassword").ToString();//Passwords can not be blank!";
            return; 
        }
        
        if (noNameInPassword && newPassword.ToUpper().Contains(changingUser.ToUpper()))
        {
            if (curUser.ToUpper().Contains("ADMIN") && !changingUser.ToUpper().Contains("ADMIN"))
                lblMessage.Text = GetLocalResourceObject("noNameInPasswordAdmin").ToString(); // "Passwords cannot contain the user name!";
            else
                lblMessage.Text = GetLocalResourceObject("noNameInPasswordUser").ToString(); //"Passwords cannot contain your user name!";
            return;
        }

        // save values
        if (newPassword == _confirmPassword.Text)
        {
            ChangePasswordOptions options = new ChangePasswordOptions();
            options.NewPassword = newPassword;

            string curUser = slxUserService.GetUser().Id;
            if (curUser.ToString().Trim() != "ADMIN")
            {
                options.UserId = curUser;
            }
            else
            {
                options.UserId = ((IUser)this.User.LookupResultValue).Id.ToString();
            }
            options.Save();

            var webAuthProvider = ApplicationContext.Current.Services.Get<IAuthenticationProvider>() as SLXWebAuthenticationProvider;
            if (webAuthProvider != null)
            {
                // reset the authentication token, otherwise the OleDb connection string will be out of sync until the next logon
                webAuthProvider.AuthenticateWithContext(changingUser, newPassword);
            }

            if (_newPassword.Text.Length == 0)
            {
                lblMessage.Text = GetLocalResourceObject("PasswordBlank").ToString();
            }
            else
            {
                lblMessage.Text = string.Empty;
            }
        }
        else
        {
            lblMessage.Text = GetLocalResourceObject("PasswordNotMatch").ToString();
        }
    }

    /// <summary>
    /// Gets the smart part info.
    /// </summary>
    /// <param name="smartPartInfoType">Type of the smart part info.</param>
    /// <returns></returns>
    public ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        Sage.Platform.WebPortal.SmartParts.ToolsSmartPartInfo tinfo = new Sage.Platform.WebPortal.SmartParts.ToolsSmartPartInfo();
        tinfo.Description = GetLocalResourceObject("lblChangePasswordResource1.Text").ToString(); // "Change Password";
        tinfo.Title = GetLocalResourceObject("lblChangePasswordResource1.Text").ToString(); // "Change Password";
        foreach (Control c in this.LitRequest_RTools.Controls)
        {
            tinfo.RightTools.Add(c);
        }

        //tinfo.ImagePath = Page.ResolveClientUrl("~/images/icons/Schdedule_To_Do_24x24.gif");
        return tinfo;
    }




}
