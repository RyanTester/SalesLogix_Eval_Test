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
using Sage.Platform.Security;
using Sage.SalesLogix.Web;
using Sage.SalesLogix.Security;
using log4net;
using Sage.Platform;
using Sage.Entity.Interfaces;

public partial class PortalUser : System.Web.UI.UserControl
{
    static readonly ILog log = LogManager.GetLogger(System.Reflection.MethodInfo.GetCurrentMethod().DeclaringType);
    private IEntityContextService _EntityService;
    private WebPortalUserService _UserService;

    [ServiceDependency]
    public IEntityContextService EntityContext
    {
        set
        {
            _EntityService = value;
        }
        get
        {
            return _EntityService;
        }
    }

    [ServiceDependency(Type = typeof(IUserService), Required = true)]
    public WebPortalUserService UserService
    {
        get
        {
            return _UserService;
        }
        set
        {
            _UserService = value;
        }
    }

    protected void Page_Load(object sender, EventArgs e)
    {
        try
        {
            if (EntityContext != null && EntityContext.EntityType == typeof(ITicket))
            {
                if (EntityContext.EntityID.ToString().ToUpper() == "INSERT")
                {
                    Sage.SalesLogix.Security.PortalUser pu = UserService.GetPortalUser();
                    phnWorkPhone.Text = pu.Contact.WorkPhone;
                    txtContactName.Text = pu.Contact.ToString();
                    txtCompanyName.Text = pu.Contact.AccountName;
                    cmdEmail.Text = pu.Contact.Email;
                }
                else
                {
                    ITicket ticket = EntityFactory.GetRepository<ITicket>().Get(EntityContext.EntityID);
                    if (ticket != null)
                    {
                        phnWorkPhone.Text = ticket.Contact.WorkPhone;
                        txtContactName.Text = ticket.Contact.ToString();
                        txtCompanyName.Text = ticket.Account.ToString();
                        cmdEmail.Text = ticket.Contact.Email;
                    }
                }
            }
        }
        catch (Exception ex)
        {
            log.Info(ex.Message.ToString());
        }
    }
}