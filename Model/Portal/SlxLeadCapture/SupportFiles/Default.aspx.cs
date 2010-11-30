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
using Sage.Platform.Application;
using Sage.SalesLogix.Entities;
using Sage.SalesLogix.Security;
using Sage.Entity.Interfaces;
using Sage.Platform.Repository;
using Sage.Platform.Configuration;
using Sage.SalesLogix;
using Sage.SalesLogix.Web;

public partial class LeadCapture : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        System.Collections.Generic.IList<LeadSource> LsList = Sage.Platform.EntityFactory.GetRepository<LeadSource>().FindAll();
        ddlHowDidYouHear.DataSource = LsList;
        ddlHowDidYouHear.DataTextField = "DESCRIPTION";
        ddlHowDidYouHear.DataValueField = "ID";
        ddlHowDidYouHear.DataBind();
        if (!Page.IsPostBack)
        {
            Page.ClientScript.RegisterClientScriptInclude("YAHOO_yahoo", "jscript/YUI/yahoo.js");
            Page.ClientScript.RegisterClientScriptInclude("YAHOO_event", "jscript/YUI/event.js");
            Page.ClientScript.RegisterClientScriptInclude("YAHOO_util", "jscript/YUI/utilities.js");
            Page.ClientScript.RegisterClientScriptInclude("timezone", "jscript/timezone.js");
        }
        else
        {
            if (Request.Params["tz_info"] != null)
            {
                Sage.Platform.TimeZones tzs = new Sage.Platform.TimeZones();
                string[] tzinfo = Request.Params["tz_info"].Split(',');
                if (tzinfo.Length == 11)
                {
                    Sage.Platform.TimeZone tz = tzs.FindTimeZone(tzinfo[0], tzinfo[1], tzinfo[2], tzinfo[3], tzinfo[4], tzinfo[5], tzinfo[6], tzinfo[7], tzinfo[8], tzinfo[9], tzinfo[10]);
                    Sage.Platform.Application.IContextService context = Sage.Platform.Application.ApplicationContext.Current.Services.Get<Sage.Platform.Application.IContextService>(true);
                    context.SetContext("TimeZone", tz);
                }
            }
        }
    }

    protected void Page_PreRender(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            SetPage(0);
        }
        else
        {
            if (txtFirstName.Text == "")
            {
                SetPage(0);
            }
            else
            {
                if ((txtCompany.Text == "") && (rblRepresent.SelectedIndex == 0))
                {
                    SetPage(1);
                }
                else
                {
                    SaveValues();
                    SetPage(2);
                }
            }
        }
    }
    protected void btnReset_Click(object sender, EventArgs e)
    {
        Control myForm = Page.FindControl("Form1");
        foreach (Control ctl in myForm.Controls)
            if (ctl.GetType().ToString().Equals("System.Web.UI.WebControls.TextBox"))
                ((TextBox)ctl).Text = "";
    }

    private void SetPage(int num)
    {
        HtmlGenericControl[] divs = new HtmlGenericControl[3];
        divs[0] = Page1;
        divs[1] = Page2;
        divs[2] = Page3;
        for (int i = 0; i < divs.Length; i++)
        {
            if (i == num)
            {
                divs[i].Style.Add("display", "inline");
                foreach (Control ctl in divs[i].Controls)
                    if (ctl.GetType().ToString().Equals("System.Web.UI.WebControls.RequiredFieldValidator"))
                    {
                        ((RequiredFieldValidator)ctl).Enabled = true;
                    }
            }
            else
            {
                divs[i].Style.Add("display", "none");
                foreach (Control ctl in divs[i].Controls)
                    if (ctl.GetType().ToString().Equals("System.Web.UI.WebControls.RequiredFieldValidator"))
                    {
                        ((RequiredFieldValidator)ctl).Enabled = false;
                    }
            }
        }
        if (num == 2)
        {
            ButtonDiv.Style.Add("display", "none");
        }
        else
        {
            ButtonDiv.Style.Add("display", "inline");
        }
    }

    private string GetConfigValue(WebUserConfigOptions opt)
    {
        WebUserConfiguration co = GetConfiguration();
        switch (opt)
        {
            case WebUserConfigOptions.AccountType:
                if (co.AccountType != null)
                    return co.AccountType;
                else
                    return "Lead";
            case WebUserConfigOptions.AccountSubType:
                if (co.AccountSubType != null)
                    return co.AccountSubType;
                else
                    return "Not Contacted";
            case WebUserConfigOptions.AccountManagerId:
                if (co.AccountManagerId != null)
                {
                    Sage.SalesLogix.Security.User user = Sage.SalesLogix.Security.User.GetUser(co.AccountManagerId);
                    if ((user != null) && (user.Id != null))
                        return user.Id;
                    else
                        return "ADMIN";
                }
                else
                    return "ADMIN";
            case WebUserConfigOptions.LeadOwner:
                if (co.LeadOwner != null)
                {
                    Sage.SalesLogix.Security.Owner owner = Sage.SalesLogix.Security.Owner.GetByOwnerDescription(co.LeadOwner);
                    if ((owner != null) && (owner.Id != null))
                        return owner.Id;
                    else
                        return "SYST00000001";
                }
                else
                    return "SYST00000001";
        }
        return "";
    }

    private static WebUserConfiguration _Config = null;
    private static WebUserConfiguration GetConfiguration()
    {
        if (_Config == null)
        {
            Sage.Platform.Data.IDataService data = ApplicationContext.Current.Services.Get<Sage.Platform.Data.IDataService>();
            if (data != null)
            {
                Sage.Platform.VirtualFileSystem.VFSQuery.ConnectToVFS(data.GetConnectionString());
            }
            Sage.Platform.Configuration.ConfigurationManager manager = ApplicationContext.Current.Services.Get<Sage.Platform.Configuration.ConfigurationManager>(true);
            if (!manager.IsConfigurationTypeRegistered(typeof(WebUserConfiguration)))
                manager.RegisterConfigurationType(typeof(WebUserConfiguration));
            _Config = (WebUserConfiguration)manager.GetConfiguration(typeof(WebUserConfiguration));
        }
        return _Config;
    }

    private void SaveValues()
    {
        IAddress conaddress = Sage.Platform.EntityFactory.Create<IAddress>();
        conaddress.Address1 = txtAddress1.Text;
        conaddress.Address2 = txtAddress2.Text;
        conaddress.City = txtCity.Text;
        conaddress.State = State.PickListValue;
        conaddress.PostalCode = txtPostal.Text;
        conaddress.Country = Country.PickListValue;
        conaddress.Description = GetLocalResourceObject("rscMailingDescription").ToString();

        IAccount acc = Sage.Platform.EntityFactory.Create<IAccount>();
        string ownerId = GetConfigValue(WebUserConfigOptions.LeadOwner);
        ownerId = ((ownerId == null) ? "SYST00000001" : ownerId);
        acc.Owner = Owner.GetByOwnerId(ownerId);
        acc.DoNotSolicit = false;
        acc.Type = GetConfigValue(WebUserConfigOptions.AccountType);
        acc.SubType = GetConfigValue(WebUserConfigOptions.AccountSubType);
        acc.AccountManager = Sage.Platform.EntityFactory.GetById<Sage.Entity.Interfaces.IUser>(GetConfigValue(WebUserConfigOptions.AccountManagerId));

        if (rblRepresent.SelectedIndex == 0)
        {
            acc.AccountName = txtCompany.Text;
            acc.Division = txtDivision.Text;
            acc.MainPhone = txtCompanyPhone.Text;
            acc.TollFree = txtTollFree.Text;
            acc.Fax = txtCompanyFax.Text;
            acc.Industry = (Industry.PickListValue.Length > 63) ? Industry.PickListValue.Substring(0, 63) : Industry.PickListValue;
            acc.WebAddress = txtCompanyWeb.Text;
            double rev;
            if (Double.TryParse(txtRevenues.Text, out rev))
            {
                acc.Revenue = (decimal)rev;
            }
            IAddress accaddress = Sage.Platform.EntityFactory.Create<IAddress>();
            accaddress.Address1 = txtCompanyAddress.Text;
            accaddress.Address2 = txtCompanyAddress2.Text;
            accaddress.City = txtCompanyCity.Text;
            accaddress.State = CompanyState.PickListValue;
            accaddress.PostalCode = txtCompanyPostal.Text;
            accaddress.Country = CompanyCountry.PickListValue;
            accaddress.Description = GetLocalResourceObject("rscMailingDescription").ToString();
            acc.Address = accaddress;
            acc.ShippingAddress = accaddress;
            acc.Save();
            accaddress.EntityId = acc.Id.ToString();
            accaddress.Save();
        }
        else
        {
            acc.AccountName = txtLastName.Text + ", " + txtFirstName.Text;
            acc.MainPhone = txtPhone.Text;
            acc.Fax = txtFax.Text;
            acc.Address = conaddress;
            acc.ShippingAddress = conaddress;
            acc.Save();
        }
        IContact con = Sage.Platform.EntityFactory.Create<IContact>();
        con.FirstName = txtFirstName.Text;
        con.LastName = txtLastName.Text;
        con.Prefix = ddlPrefix.Text;
        con.Suffix = txtSuffix.Text;
        con.Salutation = txtFirstName.Text;
        con.Title = txtTitle.PickListValue;
        con.WorkPhone = txtPhone.Text;
        con.HomePhone = txtHomePhone.Text;
        con.Fax = txtFax.Text;
        con.Mobile = txtMobile.Text;
        con.Pager = txtPager.Text;
        con.PinNumber = txtPin.Text;
        con.WebAddress = txtWebUrl.Text;
        con.Email = txtEmail.Text;

        con.Address = conaddress;
        con.DoNotEmail = false;
        con.DoNotFax = false;
        con.DoNotMail = false;
        con.DoNotPhone = false;
        con.DoNotSolicit = false;
        con.Account = acc;
        con.AccountName = acc.AccountName;
        con.Owner = acc.Owner;
        con.Save();
        conaddress.EntityId = con.Id.ToString();
        conaddress.Save();

        IContactLeadSource cl = Sage.Platform.EntityFactory.Create<IContactLeadSource>();
        cl.Contact = con;
        string howDidYouHear = ddlHowDidYouHear.SelectedValue;
        if(!string.IsNullOrEmpty(howDidYouHear))
            cl.LeadSource = Sage.Platform.EntityFactory.GetById<ILeadSource>(howDidYouHear);
        cl.LeadDate = DateTime.Now;
        cl.Save();

        Sage.SalesLogix.Activity.Activity act = Sage.Platform.EntityFactory.Create<Sage.SalesLogix.Activity.Activity>();
        act.ContactId = con.Id.ToString();
        act.AccountId = acc.Id.ToString();
        act.Description = GetLocalResourceObject("rscWebLeadFollowupDescription").ToString();
        act.StartDate = DateTime.Now;
        act.Timeless = true;
        act.Alarm = false;
        act.AlarmTime = DateTime.Now;
        act.OriginalDate = DateTime.Now;
        switch (ddlHowContact.SelectedValue)
        {
            case "phone":
                act.Type = ActivityType.atPhoneCall;
                break;
            case "fax":
                act.Type = ActivityType.atToDo;
                act.Description += GetLocalResourceObject("rscDescSuffixFax").ToString();
                break;
            case "mail":
                act.Type = ActivityType.atToDo;
                act.Description += GetLocalResourceObject("rscDescSuffixMail").ToString();
                break;
            case "e-mail":
                act.Type = ActivityType.atToDo;
                act.Description += GetLocalResourceObject("rscDescSuffixEmail").ToString();
                break;
            default:
                return; //don't save the activity if no type
        }
        act.Attendees.Add(GetConfigValue(WebUserConfigOptions.AccountManagerId));
        act.Save();
    }
}
