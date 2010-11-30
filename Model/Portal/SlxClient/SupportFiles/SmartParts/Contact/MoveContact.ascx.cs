using System;
using System.Text;
using System.Web;
using System.Web.UI;
using Sage.Platform.Application;
using Sage.Platform.Repository;
using Sage.Platform.Security;
using Sage.Platform.WebPortal.SmartParts;
using Sage.SalesLogix.Security;
using Sage.SalesLogix.Web.Controls;

public partial class SmartParts_Contact_MoveContact : EntityBoundSmartPartInfoProvider
{
    private Sage.Entity.Interfaces.IContact _Contact;
    private Sage.Entity.Interfaces.IContact Contact
    {
        set { _Contact = value; }
        get { return _Contact; }
    }

    private Boolean _IsClosing;
    private Boolean IsClosing
    {
        set { _IsClosing = value; }
        get { return _IsClosing; }
    }

    public override Type EntityType
    {
        get { return typeof(Sage.Entity.Interfaces.IContact); }
    }

    protected override void InnerPageLoad(object sender, EventArgs e)
    {
        if (this.Visible & !IsClosing)
        {
            if (Contact == null)
            {
                if (!DialogService.DialogParameters.ContainsKey("MoveContact"))
                {
                    Sage.Entity.Interfaces.IContact contact = GetParentEntity() as Sage.Entity.Interfaces.IContact;
                    Contact = contact;
                    DialogService.DialogParameters.Add("MoveContact", Contact);
                    DialogService.DialogParameters.Add("ToAccount", Contact.Account);
                }
                else
                {
                    /* Handled in change event. */
                }
                if (!DialogService.DialogParameters.ContainsKey("CompletedItemsContact"))
                {
                    DialogService.DialogParameters.Add("CompletedItemsContact", this.lueCompletedItemsContact.LookupResultValue);
                }
                if (!DialogService.DialogParameters.ContainsKey("OpenItemsContact"))
                {
                    DialogService.DialogParameters.Add("OpenItemsContact", this.lueOpenItemsContact.LookupResultValue);
                }
            }
            if (!DialogService.DialogParameters.ContainsKey("Init"))
            {
                this.chkCopyHistory.Checked = true;
                DialogService.DialogParameters.Add("Init", string.Empty);
            }
        }
    }

    protected override void OnAddEntityBindings()
    {
    }

    protected override void OnFormBound()
    {
        ClientBindingMgr.RegisterDialogCancelButton(cmdCancel);
        if ((Contact != null) & !IsClosing)
        {
            Sage.Entity.Interfaces.IContact contact = DialogService.DialogParameters["MoveContact"] as Sage.Entity.Interfaces.IContact;
            Sage.Entity.Interfaces.IAccount account = DialogService.DialogParameters["ToAccount"] as Sage.Entity.Interfaces.IAccount;
            this.lueMoveContact.LookupResultValue = contact;
            this.txtFromAccount.Text = contact.AccountName;
            this.lueToAccount.LookupResultValue = account;
            this.lueCompletedItemsContact.SeedProperty = "Account.Id";
            this.lueCompletedItemsContact.SeedValue = contact.Account.Id.ToString();
            this.lueOpenItemsContact.SeedProperty = "Account.Id";
            this.lueOpenItemsContact.SeedValue = contact.Account.Id.ToString();
            this.lueCompletedItemsContact.LookupResultValue = DialogService.DialogParameters["CompletedItemsContact"];
            this.lueOpenItemsContact.LookupResultValue = DialogService.DialogParameters["OpenItemsContact"];
        }
        base.OnFormBound();
    }

    protected override void OnWireEventHandlers()
    {
        if (!IsClosing)
        {
            this.lueMoveContact.LookupResultValueChanged += new EventHandler(this.lueMoveContact_ChangeAction);
            this.lueToAccount.LookupResultValueChanged += new EventHandler(this.lueToAccount_ChangeAction);
            this.lueCompletedItemsContact.LookupResultValueChanged += new EventHandler(this.lueCompletedItemsContact_ChangeAction);
            this.lueOpenItemsContact.LookupResultValueChanged += new EventHandler(this.lueOpenItemsContact_ChangeAction);
            base.OnWireEventHandlers();
        }
    }

    private Sage.Entity.Interfaces.IContact GetPrimaryContactFor(Sage.Entity.Interfaces.IAccount account)
    {
        Object result;
        IRepository<Sage.Entity.Interfaces.IContact> rep = Sage.Platform.EntityFactory.GetRepository<Sage.Entity.Interfaces.IContact>();
        IQueryable qry = (IQueryable)rep;
        IExpressionFactory ep = qry.GetExpressionFactory();
        Sage.Platform.Repository.ICriteria crit = qry.CreateCriteria();
        crit.Add(ep.Eq("Account", account));
        crit.Add(ep.Eq("IsPrimary", true));
        result = crit.UniqueResult<Sage.Entity.Interfaces.IContact>();
        return (result != null) ? (Sage.Entity.Interfaces.IContact)result : null;
    }

    protected void lueMoveContact_ChangeAction(object sender, EventArgs e)
    {
        if (!DialogService.DialogParameters.ContainsKey("MoveContact"))
        {
            DialogService.DialogParameters.Add("MoveContact", this.lueMoveContact.LookupResultValue);
        }
        else
        {
            DialogService.DialogParameters["MoveContact"] = this.lueMoveContact.LookupResultValue;
        }
		Sage.Entity.Interfaces.IContact contact = (Sage.Entity.Interfaces.IContact) this.lueMoveContact.LookupResultValue;
        Contact = contact;
        this.lueMoveContact.LookupResultValue = contact;
        this.txtFromAccount.Text = contact.AccountName;
        this.lueCompletedItemsContact.SeedProperty = "Account.Id";
        this.lueCompletedItemsContact.SeedValue = contact.Account.Id.ToString();
        this.lueOpenItemsContact.SeedProperty = "Account.Id";
        this.lueOpenItemsContact.SeedValue = contact.Account.Id.ToString();
        Sage.Entity.Interfaces.IContact primary_contact = GetPrimaryContactFor(contact.Account);
        if (primary_contact != null)
        {
            if (!primary_contact.Equals(contact))
            {
                this.lueCompletedItemsContact.LookupResultValue = primary_contact;
                this.lueOpenItemsContact.LookupResultValue = primary_contact;
            }
            else
            {
                this.lueCompletedItemsContact.LookupResultValue = null;
                this.lueOpenItemsContact.LookupResultValue = null;
            }
        }
        if (!DialogService.DialogParameters.ContainsKey("CompletedItemsContact"))
        {
            DialogService.DialogParameters.Add("CompletedItemsContact", this.lueCompletedItemsContact.LookupResultValue);
        }
        else
        {
            DialogService.DialogParameters["CompletedItemsContact"] = this.lueCompletedItemsContact.LookupResultValue;
        }
        if (!DialogService.DialogParameters.ContainsKey("OpenItemsContact"))
        {
            DialogService.DialogParameters.Add("OpenItemsContact", this.lueOpenItemsContact.LookupResultValue);
        }
        else
        {
            DialogService.DialogParameters["OpenItemsContact"] = this.lueOpenItemsContact.LookupResultValue;
        }
    }

    protected void lueToAccount_ChangeAction(object sender, EventArgs e)
    {
        if (!DialogService.DialogParameters.ContainsKey("ToAccount"))
        {
            DialogService.DialogParameters.Add("ToAccount", this.lueToAccount.LookupResultValue);
        }
        else
        {
            DialogService.DialogParameters["ToAccount"] = this.lueToAccount.LookupResultValue;
        }
        Contact = DialogService.DialogParameters["MoveContact"] as Sage.Entity.Interfaces.IContact;
    }

    protected void lueCompletedItemsContact_ChangeAction(object sender, EventArgs e)
    {
        if (!DialogService.DialogParameters.ContainsKey("CompletedItemsContact"))
        {
            DialogService.DialogParameters.Add("CompletedItemsContact", this.lueCompletedItemsContact.LookupResultValue);
        }
        else
        {
            DialogService.DialogParameters["CompletedItemsContact"] = this.lueCompletedItemsContact.LookupResultValue;
        }
    }

    protected void lueOpenItemsContact_ChangeAction(object sender, EventArgs e)
    {
        if (!DialogService.DialogParameters.ContainsKey("OpenItemsContact"))
        {
            DialogService.DialogParameters.Add("OpenItemsContact", this.lueOpenItemsContact.LookupResultValue);
        }
        else
        {
            DialogService.DialogParameters["OpenItemsContact"] = this.lueOpenItemsContact.LookupResultValue;
        }
    }

    /// <summary>
    /// Normally this method is not used, however, I want to emit some script on the page so I have added the Page_Load
    /// method.
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    protected void Page_Load(object sender, EventArgs e)
    {
        cmdMoveOptions.Value = GetLocalResourceObject("MoveOptionsMore").ToString();

        EmitClientScript();
    }

    /// <summary>
    /// Writes javascript to the page in order to show and hide the options div without needing
    /// to do a postback.
    /// </summary>
    private void EmitClientScript()
    {
        StringBuilder sb = new StringBuilder();

        sb.AppendLine("<script language=\"javascript\" type=\"text/javascript\">");
        sb.Append("function ShowOrHideOptions() {");
        sb.Append("if (typeof MoveContactLinks != \"undefined\") {");
        sb.Append("var btn = document.getElementById('" + cmdMoveOptions.ClientID + "');");
        sb.Append("var moveDiv = document.getElementById('" + MoveOptions.ClientID + "');");
        sb.Append("if(moveDiv.style.display == \"none\") {");
        sb.Append("btn.value = MoveContactLinks.MoveOptionsLess;");
        sb.Append("moveDiv.style.display = \"block\";");
        sb.Append("}");
        sb.Append("else {");
        sb.Append("btn.value = MoveContactLinks.MoveOptionsMore;");
        sb.Append("moveDiv.style.display = \"none\";");
        sb.Append("}");
        sb.Append("}");
        sb.Append("}");
        sb.AppendLine("</script>");

        if(!Page.ClientScript.IsClientScriptBlockRegistered("moveButtonScript"))
        {
            if (ScriptManager.GetCurrent(Page).IsInAsyncPostBack)
                ScriptManager.RegisterStartupScript(Page, typeof(Page), "moveButtonScript", sb.ToString(), false);
        }
    }
    protected void cmdOK_Click(object sender, EventArgs e)
    {
        try
        {
            object contactId;
            object[] objarray = new object[] {
            this.lueMoveContact.LookupResultValue,
            this.lueToAccount.LookupResultValue,
            (Boolean)(this.rblCopyMoved.SelectedIndex == 0),
            (Boolean)(this.rblUseKeep.SelectedIndex == 0),
            this.chkCopyHistory.Checked,
            this.chkCopyActivities.Checked,
            this.lueOpenItemsContact.LookupResultValue,
            this.lueCompletedItemsContact.LookupResultValue
        };
            contactId = Sage.Platform.Orm.DynamicMethodLibraryHelper.Instance.Execute("Contact.MoveContact", objarray);
            DialogService.CloseEventHappened(sender, e);
            if (contactId != null)
            {
                Response.Redirect(string.Format("Contact.aspx?entityId={0}", (contactId.ToString())));
            }
        }
        catch (Exception error)
        {
            if (error.InnerException != null)
            {
                DialogService.ShowMessage(error.InnerException.Message, "SalesLogix");
            }
            else
            {
                DialogService.ShowMessage(error.Message, "SalesLogix");
            }
        }
    }

    protected void cmdCancel_Click(object sender, EventArgs e)
    {
        IsClosing = true;
        DialogService.CloseEventHappened(sender, e);
    }

    protected override void OnMyDialogClosing(object from, Sage.Platform.WebPortal.Services.WebDialogClosingEventArgs e)
    {
        DialogService.DialogParameters.Clear();
        IsClosing = true;
        base.OnMyDialogClosing(from, e);
    }

    public override Sage.Platform.Application.UI.ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        Sage.Platform.WebPortal.SmartParts.ToolsSmartPartInfo tinfo = new Sage.Platform.WebPortal.SmartParts.ToolsSmartPartInfo();
        foreach (Control c in this.MoveContact_LTools.Controls)
        {
            tinfo.LeftTools.Add(c);
        }
        foreach (Control c in this.MoveContact_CTools.Controls)
        {
            tinfo.CenterTools.Add(c);
        }
        foreach (Control c in this.MoveContact_RTools.Controls)
        {
            tinfo.RightTools.Add(c);
        }
        return tinfo;
    }

}
