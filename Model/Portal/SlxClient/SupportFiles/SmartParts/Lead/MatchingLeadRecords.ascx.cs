using System;
using System.Collections;
using System.Reflection;
using System.Web.UI;
using System.Collections.Generic;
using Sage.Entity.Interfaces;
using Sage.Platform;
using Sage.Platform.Application;
using Sage.Platform.Application.UI;
using Sage.Platform.Repository;
using Sage.Platform.WebPortal.Binding;
using Sage.Platform.WebPortal.SmartParts;


public partial class SmartParts_Lead_MatchingLeadRecords : EntityBoundSmartPartInfoProvider
{
    string accountID = "";

    protected void Page_Load(object sender, EventArgs e)
    {

    }

    protected override void InnerPageLoad(object sender, EventArgs e)
    {
        if (this.Visible)
        {
            LoadingGrids();
        }
    }

    public override Type EntityType
    {
        get { return typeof(ILead); }
    }

    protected override void OnAddEntityBindings()
    {
        dtsLeads.Bindings.Add(new WebEntityListBinding("Leads", grdLeads));
        BindingSource.OnCurrentEntitySet += new EventHandler(dtsleads_OnCurrentEntitySet);

        dtsMatchingLeads.Bindings.Add(new WebEntityListBinding("Leads", grdMatchedLeads));
        BindingSource.OnCurrentEntitySet += new EventHandler(dtsMatchingleads_OnCurrentEntitySet);

        dtsContacts.Bindings.Add(new WebEntityListBinding("Contacts", grdMatchedContacts));
        BindingSource.OnCurrentEntitySet += new EventHandler(dtsContacts_OnCurrentEntitySet);

        dtsAccounts.Bindings.Add(new WebEntityListBinding("Accounts", grdMatchedAccounts));
        BindingSource.OnCurrentEntitySet += new EventHandler(dtsAccounts_OnCurrentEntitySet);
    }

    protected override void OnWireEventHandlers()
    {
        chkCompany.CheckedChanged += new EventHandler(general_CheckedChanged);
        chkFirstName.CheckedChanged += new EventHandler(general_CheckedChanged);
        chkLastName.CheckedChanged += new EventHandler(general_CheckedChanged);
        chkTitle.CheckedChanged += new EventHandler(general_CheckedChanged);
        chkEmail.CheckedChanged += new EventHandler(general_CheckedChanged);
        chkCityStatePostal.CheckedChanged += new EventHandler(general_CheckedChanged);
        chkWorkPhone.CheckedChanged += new EventHandler(general_CheckedChanged);
        chkTollFreePhone.CheckedChanged += new EventHandler(general_CheckedChanged);
        chkWebAddress.CheckedChanged += new EventHandler(general_CheckedChanged);
        chkIndustry.CheckedChanged += new EventHandler(general_CheckedChanged);
        cmdClose.Click += new EventHandler(DialogService.CloseEventHappened);
    }

    protected override void OnFormBound()
    {
        ClientBindingMgr.RegisterDialogCancelButton(cmdClose);
        dtsLeads.Bind();
        dtsMatchingLeads.Bind();
        dtsContacts.Bind();
        dtsAccounts.Bind();
        base.OnFormBound();
    }

    void dtsleads_OnCurrentEntitySet(object sender, EventArgs e)
    {
        if (this.Visible)
        {
            dtsLeads.SourceObject = BindingSource.Current;
        }
    }

    void dtsMatchingleads_OnCurrentEntitySet(object sender, EventArgs e)
    {
        if (this.Visible)
        {
            dtsMatchingLeads.SourceObject = BindingSource.Current;
        }
    }

    void dtsContacts_OnCurrentEntitySet(object sender, EventArgs e)
    {
        if (this.Visible)
        {
            dtsContacts.SourceObject = BindingSource.Current;
        }
    }

    void dtsAccounts_OnCurrentEntitySet(object sender, EventArgs e)
    {
        if (this.Visible)
        {
            dtsAccounts.SourceObject = BindingSource.Current;
        }
    }

    void general_CheckedChanged(object sender, EventArgs e)
    {
        LoadingGrids();
    }

    private WebEntityListBindingSource _dtsLeads;
    public WebEntityListBindingSource dtsLeads
    {
        get
        {
            if (_dtsLeads == null)
            {
                _dtsLeads = new WebEntityListBindingSource(typeof(ILead), EntityType
                , "", MemberTypes.Property);
            }
            return _dtsLeads;
        }
    }

    private WebEntityListBindingSource _dtsMatchingLeads;
    public WebEntityListBindingSource dtsMatchingLeads
    {
        get
        {
            if (_dtsMatchingLeads == null)
            {
                _dtsMatchingLeads = new WebEntityListBindingSource(typeof(ILead), EntityType
                , "", MemberTypes.Property);
            }
            return _dtsMatchingLeads;
        }
    }

    private WebEntityListBindingSource _dtsContacts;
    public WebEntityListBindingSource dtsContacts
    {
        get
        {
            if (_dtsContacts == null)
            {
                _dtsContacts = new WebEntityListBindingSource(typeof(IContact), EntityType
                , "", MemberTypes.Property);
            }
            return _dtsContacts;
        }
    }

    private WebEntityListBindingSource _dtsAccounts;
    public WebEntityListBindingSource dtsAccounts
    {
        get
        {
            if (_dtsAccounts == null)
            {
                _dtsAccounts = new WebEntityListBindingSource(typeof(IAccount), EntityType
                , "", MemberTypes.Property);
            }
            return _dtsAccounts;
        }
    }

    protected void LoadingGrids()
    {
        LoadLeadGrid();
        LoadMatchedLeadGrid();
        LoadContactGrid();
        LoadAccountGrid();
    }

    protected void LoadLeadGrid()
    {
        ILead curLead = BindingSource.Current as ILead;
        if (curLead != null)
        {
            List<ILead> leadlist = new List<ILead>();
            leadlist.Add(curLead);
            dtsLeads.setCustomData(leadlist);
        }
    }

    private void LoadMatchedLeadGrid()
    {
        bool ConditionMet = false;
        string Company = "";
        string FirstName = "";
        string LastName = "";
        string Title = "";
        string Email = "";
        string CityStatePostal = "";
        string WorkPhone = "";
        string WebAddress = "";
        IExpressionFactory exp = null;
        ICriteria criteria = null;

        ILead lead = BindingSource.Current as ILead;
        if (lead != null)
        {
            Company = lead.Company;
            FirstName = lead.FirstName;
            LastName = lead.LastName;
            Title = lead.Title;
            Email = lead.Email;
            CityStatePostal = lead.Address.LeadCtyStZip;
            WorkPhone = lead.WorkPhone;
            WebAddress = lead.WebAddress;
        }

        IRepository<ILead> matchingLeadList = EntityFactory.GetRepository<ILead>();
        IQueryable qryContact = (IQueryable)matchingLeadList;
        exp = qryContact.GetExpressionFactory();
        criteria = qryContact.CreateCriteria();
        criteria.CreateAlias("Address", "ad");

        IList<IExpression> expression = new List<IExpression>();

        if ((chkCompany.Checked) && (Company != null))
        {   
            expression.Add(GetExpression(exp, "Company", Company));
            ConditionMet = true;
        }

        if ((chkFirstName.Checked) && (FirstName != null))
        {
            expression.Add(GetExpression(exp, "FirstName", FirstName));
            ConditionMet = true;
        }

        if ((chkLastName.Checked) && (LastName != null))
        {
            expression.Add(GetExpression(exp, "LastName", LastName));
            ConditionMet = true;
        }

        if ((chkTitle.Checked) && (Title != null))
        {
            expression.Add(GetExpression(exp, "Title", Title));
            ConditionMet = true;
        }

        if ((chkEmail.Checked) && (Email != null))
        {
            expression.Add(GetExpression(exp, "Email", Email));
            ConditionMet = true;
        }

        if ((chkCityStatePostal.Checked) && (CityStatePostal != null))
        {
            expression.Add(GetExpression(exp, "ad.LeadCtyStZip", CityStatePostal));
            ConditionMet = true;
        }

        if ((chkWorkPhone.Checked) && (WorkPhone != null))
        {
           expression.Add(GetExpression(exp, "WorkPhone", WorkPhone));
           ConditionMet = true;
        }

        if ((chkWebAddress.Checked) && (WebAddress != null))
        {
            expression.Add(GetExpression(exp, "WebAddress", WebAddress));
            ConditionMet = true;
        }

        IJunction junction;

        if (rdbMatchAll.Checked)
        {
            junction = exp.Conjunction(); // AND
        }
        else
        {
            junction = exp.Disjunction(); // OR
        }

        foreach (IExpression e in expression)
        {
            junction.Add(e);
        }

        criteria.Add(junction);
        if (ConditionMet.Equals(true))
        {
            IList list = criteria.List();
            dtsMatchingLeads.setCustomData(list);

            lblLeadMatches.Text = string.Format(GetLocalResourceObject("PotentialLeadMatches_rsc").ToString(), list.Count);
        }
    }

    private void LoadContactGrid()
    {
        bool ConditionMet = false;
        string Company = "";
        string FirstName = "";
        string LastName = "";
        string Title = "";
        string Email = "";
        string CityStatePostal = "";
        string WorkPhone = "";
        string WebAddress = "";
        IExpressionFactory exp = null;
        ICriteria criteria = null;

        ILead lead = BindingSource.Current as ILead;

        if (lead != null)
        {
            Company = lead.Company;
            FirstName = lead.FirstName;
            LastName = lead.LastName;
            Title = lead.Title;
            Email = lead.Email;
            CityStatePostal = lead.Address.LeadCtyStZip;
            WorkPhone = lead.WorkPhone;
            WebAddress = lead.WebAddress;
        }

        IRepository<IContact> contactList = EntityFactory.GetRepository<IContact>();
        IQueryable qryContact = (IQueryable)contactList;
        exp = qryContact.GetExpressionFactory();
        criteria = qryContact.CreateCriteria();
        criteria.CreateAlias("Address", "ad");

        IList<IExpression> expression = new List<IExpression>();

        if ((chkCompany.Checked) && (Company != null))
        {
            expression.Add(GetExpression(exp, "AccountName", Company));
            ConditionMet = true;
        }

        if ((chkFirstName.Checked) && (FirstName != null))
        {
            expression.Add(GetExpression(exp, "FirstName", FirstName));
            ConditionMet = true;
        }

        if ((chkLastName.Checked) && (LastName != null))
        {
            expression.Add(GetExpression(exp, "LastName", LastName));
            ConditionMet = true;
        }

        if ((chkTitle.Checked) && (Title != null))
        {
            expression.Add(GetExpression(exp, "Title", Title));
            ConditionMet = true;
        }

        if ((chkEmail.Checked) && (Email != null))
        {
            expression.Add(GetExpression(exp, "Email", Email));
            ConditionMet = true;
        }

        if ((chkCityStatePostal.Checked) && (CityStatePostal != null))
        {
            expression.Add(GetExpression(exp, "ad.CityStateZip", CityStatePostal));
            ConditionMet = true;
        }

        if ((chkWorkPhone.Checked) && (WorkPhone != null))
        {
            expression.Add(GetExpression(exp, "WorkPhone", WorkPhone));
            ConditionMet = true;
        }

        if ((chkWebAddress.Checked) && (WebAddress != null))
        {
            expression.Add(GetExpression(exp, "WebAddress", WebAddress));
            ConditionMet = true;
        }

        IJunction junction;

        if (rdbMatchAll.Checked)
        {
            junction = exp.Conjunction(); // AND
        }
        else
        {
            junction = exp.Disjunction(); // OR
        }

        foreach (IExpression e in expression)
        {
            junction.Add(e);
        }

        criteria.Add(junction);

        if (ConditionMet.Equals(true))
        {
            IList list = criteria.List();
            dtsContacts.setCustomData(list);

            lblContactMatches.Text =
                string.Format(GetLocalResourceObject("PotentialContactMatches_rsc").ToString(), list.Count);
        }
    }

    private void LoadAccountGrid()
    {
        bool ConditionMet = false;
        string Company = "";
        string CityStatePostal = "";
        string WorkPhone = "";
        string TollFree = "";
        string WebAddress = "";
        string Industry = "";
        IExpressionFactory exp = null;
        ICriteria criteria = null;

        ILead lead = BindingSource.Current as ILead;

        if (lead != null)
        {
            Company = lead.Company;
            CityStatePostal = lead.Address.LeadCtyStZip;
            WorkPhone = lead.WorkPhone;
            TollFree = lead.TollFree;
            WebAddress = lead.WebAddress;
            Industry = lead.Industry;
        }

        IRepository<IAccount> accountList = EntityFactory.GetRepository<IAccount>();
        IQueryable qryAccount = (IQueryable)accountList;
        exp = qryAccount.GetExpressionFactory();
        criteria = qryAccount.CreateCriteria();
        criteria.CreateAlias("Address", "ad");

        IList<IExpression> expression = new List<IExpression>();

        if ((chkCompany.Checked) && (Company != null))
        {
            expression.Add(GetExpression(exp, "AccountName", Company));
            ConditionMet = true;
        }

        if ((chkIndustry.Checked) && (Industry != null))
        {
            expression.Add(GetExpression(exp, "Industry", Industry));
            ConditionMet = true;
        }

        if ((chkWebAddress.Checked) && (WebAddress != null))
        {
            expression.Add(GetExpression(exp, "WebAddress", WebAddress));
            ConditionMet = true;
        }

        if ((chkCityStatePostal.Checked) && (CityStatePostal != null))
        {
            expression.Add(GetExpression(exp, "ad.CityStateZip", CityStatePostal));
            ConditionMet = true;
        }

        if ((chkWorkPhone.Checked) && (WorkPhone != null))
        {
            expression.Add(GetExpression(exp, "MainPhone", WorkPhone));
            ConditionMet = true;
        }

        if ((chkTollFreePhone.Checked) && (TollFree != null))
        {
            expression.Add(GetExpression(exp, "TollFree", TollFree));
            ConditionMet = true;
        }

        IJunction junction;

        if (rdbMatchAll.Checked)
        {
            junction = exp.Conjunction(); // AND
        }
        else
        {
            junction = exp.Disjunction(); // OR
        }

        foreach (IExpression e in expression)
        {
            junction.Add(e);
        }

        criteria.Add(junction);

        if (ConditionMet.Equals(true))
        {
            IList list = criteria.List();
            dtsAccounts.setCustomData(list);

            lblAccountMatches.Text =
                string.Format(GetLocalResourceObject("PotentialAccountMatches_rsc").ToString(), list.Count);
        }
    }

    private IExpression GetExpression(IExpressionFactory ef, string propName, string value)
    {
        if (!chkMatchExactly.Checked)
        {       
            return ef.InsensitiveLike(propName, value, LikeMatchMode.Contains); 
        }
        else
        {
            return ef.Eq(propName, value);
        }
    }

    protected void btnUpdate_Click(object sender, EventArgs e)
    {

    }

    protected void rdbMatchAll_CheckedChanged(object sender, EventArgs e)
    {
        LoadingGrids();
        rdbMatchExactly.Checked = false;
    }

    protected void rdbMatchExactly_CheckedChanged(object sender, EventArgs e)
    {
        LoadingGrids();
        rdbMatchAll.Checked = false;
    }

    protected void chkMatchExactly_CheckedChanged(object sender, EventArgs e)
    {
        LoadingGrids();
    }


    protected void btnConvert_Click(object sender, EventArgs e)
    {
        IContact newContact = EntityFactory.Create<IContact>();
        IAccount newAccount = EntityFactory.Create<IAccount>();
        ILeadHistory newHistory = EntityFactory.Create<ILeadHistory>();
        ILeadAddressHistory newAddressHistory = EntityFactory.Create<ILeadAddressHistory>();
        newAddressHistory.LeadHistory = newHistory;
        newHistory.Addresses.Add(newAddressHistory);

        {
            ILead curLead = BindingSource.Current as ILead;
            if (curLead != null)
            { 
                accountID = ((IAccount) dtsAccounts.Current).Id.ToString();
                if (accountID != null)
                {
                    IList<IAccount> selectedAccount = EntityFactory.GetRepository<IAccount>().FindByProperty("Id", accountID);
                    if (selectedAccount != null)
                    {
                        foreach (IAccount account in selectedAccount)
                        {
                            curLead.ConvertLeadToContact(newContact, account, GetLocalResourceObject("chkAddContacts.Text").ToString());
                            
                            curLead.ConvertLeadAddressToContactAddress(newContact);
                            curLead.ConvertLeadAddressToAccountAddress(account);

                            curLead.MergeLeadWithAccount(account, GetLocalResourceObject("ExistingAccountwins.Text").ToString(), newContact);
                            
                            account.Save();

                            Response.Redirect(string.Format("Contact.aspx?entityId={0}", (newContact.Id)));
                        }
                    }
                }
            }
        }
    }

    #region ISmartPartInfoProvider Members

    public override ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        ToolsSmartPartInfo tinfo = new ToolsSmartPartInfo();

        foreach (Control c in this.LeadMatching_RTools.Controls)
        {
            tinfo.RightTools.Add(c);
        }
        return tinfo;
    }

    #endregion

    protected void btnOpenLead_Click(object sender, EventArgs e)
    {
        if (dtsMatchingLeads.Current != null)
        {
            string leadID = ((ILead) dtsMatchingLeads.Current).Id.ToString();
            if (leadID != null)
            {
                Response.Redirect(string.Format("Lead.aspx?entityId={0}", leadID));
            }
        }
    }

    protected void btnOpenContact_Click(object sender, EventArgs e)
    {
        if (dtsContacts.Current != null)
        {
            string ContactID = ((IContact) dtsContacts.Current).Id.ToString();
            if (ContactID != null)
            {
                Response.Redirect(string.Format("Contact.aspx?entityId={0}", ContactID));
            }
        }
    }

    protected void grdMatchedAccounts_SelectedIndexChanged(object sender, EventArgs e)
    {

    }

    protected void grdMatchedContacts_SelectedIndexChanged(object sender, EventArgs e)
    {

    }

    protected void grdMatchedLeads_SelectedIndexChanged(object sender, EventArgs e)
    {

    }
 
}
