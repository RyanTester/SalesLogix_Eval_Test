using System;
using System.Web;
using System.Web.UI;
using Sage.Platform.Application;
using Sage.Entity.Interfaces;
using Sage.Platform.WebPortal;
using Sage.SalesLogix.Security;
using log4net;
using Sage.Platform.Security;
using Sage.Platform.Application.UI;
using Sage.SalesLogix.PickLists;
using Sage.Platform.WebPortal.SmartParts;
using System.Text;

public partial class SmartParts_Ticket_SendTicketEmail : EntityBoundSmartPartInfoProvider
{
    #region Protected Methods

    /// <summary>
    /// Inners the page load.
    /// </summary>
    /// <param name="sender">The sender.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected override void InnerPageLoad(object sender, EventArgs e)
    {
        if (Visible)
        {
            StringBuilder sb = new StringBuilder(GetLocalResourceObject("SendTicketEmail_ClientScript").ToString());
            sb.Replace("@emailTicketId", ClientID + "_obj");
            ITicket ticket = BindingSource.Current as ITicket;
            if (ticket != null)
            {
                sb.AppendLine(string.Format("var {0}_obj = new EmailTicket('{1}', '{2}', '{3}', '{4}', '{5}', '{6}');",
                        ClientID, GetEmailAddress(0, ticket), GetEmailAddress(1, ticket), GetEmailAddress(2, ticket),
                        GetEmailAddress(3, ticket), GetEmailSubject(ticket), BuildUpEmailBody(ticket)));
                sb.AppendLine();
            }

            ScriptManager.RegisterStartupScript(Page, GetType(), ClientID, sb.ToString(), true);
            cmdSendEmail.OnClientClick = String.Format("sendEmail('{0}', '{1}', '{2}', '{3}', '{4}')", rdgEmailType.ClientID,
                chkSendToContact.ClientID, chkSendToAssignedTo.ClientID, chkSendToAcctMgr.ClientID, chkSendToManager.ClientID);
        }
        base.InnerPageLoad(sender, e);
    }

    /// <summary>
    /// Handles the Click event of the cmdSendEmail control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void cmdSendEmail_Click(object sender, EventArgs e)
    {
        DialogService.CloseEventHappened(sender, e);
    }

    /// <summary>
    /// Gets the email address.
    /// </summary>
    /// <param name="emailType">Type of the email.</param>
    /// <param name="ticket">The ticket.</param>
    /// <returns></returns>
    private static string GetEmailAddress(int emailType, ITicket ticket)
    {
        string email = String.Empty;
        if (ticket != null)
        {
            switch (emailType)
            {
                case 0: //Contact
                    if (ticket.Contact != null)
                        email = (string.IsNullOrEmpty(ticket.Contact.Email) ? String.Empty : ticket.Contact.Email);
                    break;
                case 1: //AssignedTo
                    if (ticket.AssignedTo != null && ticket.AssignedTo.User != null)
                        email = ((ticket.AssignedTo.User.UserInfo.Email == String.Empty)
                                     ? String.Empty
                                     : ticket.AssignedTo.User.UserInfo.Email);
                    break;
                case 2: //AcctMgr
                    if (ticket.Account != null && ticket.Account.AccountManager != null)
                        email = (string.IsNullOrEmpty(ticket.Account.AccountManager.UserInfo.Email)
                                     ? String.Empty
                                     : ticket.Account.AccountManager.UserInfo.Email);
                    break;
                case 3: //MyMgr
                    SLXUserService service = ApplicationContext.Current.Services.Get<IUserService>() as SLXUserService;
                    if (service != null)
                    {
                        //User UserContext = service.GetUser();
                        //if (UserContext != null && UserContext.Manager != null && UserContext.Manager.UserInfo != null)
                        //    email = ((UserContext.Manager.UserInfo.Email == String.Empty) ? String.Empty : UserContext.Manager.UserInfo.Email);
                    }
                    break;
            }
        }
        return PortalUtil.JavaScriptEncode(email.Replace("+", "%20"));
    }

    /// <summary>
    /// Gets the email subject.
    /// </summary>
    /// <returns></returns>
    private string GetEmailSubject(ITicket ticket)
    {
        string ticketStatus = String.Empty;
        if (!String.IsNullOrEmpty(ticket.StatusCode))
        {
            PickList picklist = PickList.GetPickListByItemId(ticket.StatusCode);
            if (picklist != null)
                ticketStatus = picklist.Text;
        }
        return
            PortalUtil.JavaScriptEncode(HttpUtility.UrlEncode(
                                            String.Format(
                                                GetLocalResourceObject("SendTicketEmail_EmailMessageSubject").ToString(),
                                                ticket.ToString(), ticketStatus, ticket.Subject)).Replace("+", "%20"));
    }

    /// <summary>
    /// Builds the up email body.
    /// </summary>
    /// <returns></returns>
    private string BuildUpEmailBody(ITicket ticket)
    {
        String emailBody = String.Empty;
        String ticketRef = String.Empty;
        if (ticket != null)
        {
            emailBody = (ticket.ReceivedDate == null) ? String.Empty : string.Format(GetLocalResourceObject("SendTicketEmail_EmailBody_Received").ToString(),
                ticket.ReceivedDate.Value, "%0A%0A");
            emailBody += (ticket.CompletedDate == null) ? String.Empty : string.Format(GetLocalResourceObject("SendTicketEmail_EmailBody_Completed").ToString(),
                ticket.CompletedDate.Value, "%0A%0A");
            if (ticket.TicketProblem != null)
                emailBody += (ticket.TicketProblem.Notes == null) ? String.Empty : string.Format(GetLocalResourceObject("SendTicketEmail_EmailBody_Description").ToString(),
                    "%0A", HttpUtility.UrlEncode(ticket.TicketProblem.Notes.Trim()), "%0A%0A");
            if (ticket.TicketSolution != null)
                emailBody += (ticket.TicketSolution.Notes == null) ? String.Empty : string.Format(GetLocalResourceObject("SendTicketEmail_EmailBody_Resolution").ToString(),
                    "%0A", HttpUtility.UrlEncode(ticket.TicketSolution.Notes.Trim()), "%0A%0A");
            /* Add the TicketID, required by Send SLX. */
            if (ticket.Id != null)
                ticketRef = HttpUtility.UrlEncode(ticket.Id.ToString());
            emailBody += string.Format("{0}TICKETID: {1}{2}", "%0A%0A", ticketRef, "%0A%0A");
        }
        //pluses are not used for spaces in mailto: encoding
        return PortalUtil.JavaScriptEncode(emailBody.Replace("+", "%20"));
    }

    #endregion

    #region EntityBoundSmartPart methods
    /// <summary>
    /// Gets the type of the entity.
    /// </summary>
    /// <value>The type of the entity.</value>
    public override Type EntityType
    {
        get { return typeof(ITicket); }
    }

    /// <summary>
    /// Called when the smartpart has been bound.  Derived components should override this method to run code that depends on entity context being set and it not changing.
    /// </summary>
    protected override void OnFormBound()
    {
        object sender = this;
        EventArgs e = EventArgs.Empty;

        SLXUserService service = ApplicationContext.Current.Services.Get<IUserService>(true) as SLXUserService;
        if (service != null)
        {
            User UserContext = service.GetUser();
            //if (UserContext != null && UserContext.Manager != null && UserContext.Manager.UserInfo != null)
            //    lblManagerName.Text = UserContext.Manager.UserInfo.FirstName + " " + UserContext.Manager.UserInfo.LastName;
        }
        base.OnFormBound();
    }

    /// <summary>
    /// Derived components should override this method to wire up event handlers.
    /// </summary>
    protected override void OnWireEventHandlers()
    {
        if (ScriptManager.GetCurrent(this.Page) != null)
        {
            cmdSendEmail.Click += new EventHandler(DialogService.CloseEventHappened);
        }
        base.OnWireEventHandlers();
    }

    /// <summary>
    /// Override this method to add bindings to the currrently bound smart part
    /// </summary>
    protected override void OnAddEntityBindings()
    {
        this.BindingSource.Bindings.Add(new Sage.Platform.EntityBinding.PropertyBinding("Contact.FirstName", lblContactFirst, "Text"));
        this.BindingSource.Bindings.Add(new Sage.Platform.EntityBinding.PropertyBinding("Contact.LastName", lblContactLast, "Text"));
        this.BindingSource.Bindings.Add(new Sage.Platform.EntityBinding.PropertyBinding("AssignedTo.User.UserInfo.FirstName", lblAssignedToFirst, "Text"));
        this.BindingSource.Bindings.Add(new Sage.Platform.EntityBinding.PropertyBinding("AssignedTo.User.UserInfo.LastName", lblAssignedToLast, "Text"));
        this.BindingSource.Bindings.Add(new Sage.Platform.EntityBinding.PropertyBinding("Account.AccountManager.UserInfo.FirstName", lblAcctMgrFirst, "Text"));
        this.BindingSource.Bindings.Add(new Sage.Platform.EntityBinding.PropertyBinding("Account.AccountManager.UserInfo.LastName", lblAcctMgrLast, "Text"));
    }
    #endregion

    #region ISmartPartInfoProvider Members

    /// <summary>
    /// Tries to retrieve smart part information compatible with type
    /// smartPartInfoType.
    /// </summary>
    /// <param name="smartPartInfoType">Type of information to retrieve.</param>
    /// <returns>
    /// The <see cref="T:Sage.Platform.Application.UI.ISmartPartInfo"/> instance or null if none exists in the smart part.
    /// </returns>
    public override ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        Sage.Platform.WebPortal.SmartParts.ToolsSmartPartInfo tinfo = new Sage.Platform.WebPortal.SmartParts.ToolsSmartPartInfo();
        foreach (Control c in this.pnlSendTicketEmail_RTools.Controls)
        {
            tinfo.RightTools.Add(c);
        }
        tinfo.ImagePath = Page.ResolveClientUrl("~/images/icons/Send_Write_email_24x24.gif");
        return tinfo;
    }

    #endregion
}
