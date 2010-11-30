using System;
using Sage.Entity.Interfaces;
using Sage.Platform;

public partial class SelectContactId : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        Sage.SalesLogix.Client.GroupBuilder.ClientGroupContextService clientGroupContext = new Sage.SalesLogix.Client.GroupBuilder.ClientGroupContextService();
        Page.Form.Controls.Add(clientGroupContext);

        SelectedContact.ReturnPrimaryKey = true;
        if ((Request.Params["OpportunityId"] != null) && (Request.Params["OpportunityId"].ToString() != ""))
        {
            SelectedContact.ID = "SelectedOppContact";
            SelectedContact.LookupEntityName = "OpportunityContact";
            SelectedContact.LookupEntityTypeName = "Sage.SalesLogix.Entities.OpportunityContact, Sage.SalesLogix.Entities";
            for (int i = 0; i < SelectedContact.LookupProperties.Count; i++)
            {
                SelectedContact.LookupProperties[i].PropertyName = "Contact." + SelectedContact.LookupProperties[i].PropertyName;
            }
            SelectedContact.SeedProperty = "Opportunity.Id";
            SelectedContact.SeedValue = Request.Params["OpportunityId"].ToString();
        }
        else
        {
            SelectedContact.ID = "SelectedContact";
            SelectedContact.LookupEntityName = "Contact";
            SelectedContact.LookupEntityTypeName = "Sage.SalesLogix.Entities.Contact, Sage.SalesLogix.Entities";
            for (int i = 0; i < SelectedContact.LookupProperties.Count; i++)
            {
                SelectedContact.LookupProperties[i].PropertyName = SelectedContact.LookupProperties[i].PropertyName.Replace("Contact.", "");
            }
            SelectedContact.SeedProperty = "";
            SelectedContact.SeedValue = "";
        }
        if ((Request.Params["AccountId"] != null) && (Request.Params["AccountId"].ToString() != ""))
        {
            SelectedContact.SeedProperty = "Account.Id";
            SelectedContact.SeedValue = Request.Params["AccountId"].ToString();
        }
    }

    private string GetAccIdForOpp(string p)
    {
        IOpportunity opp = EntityFactory.GetById<IOpportunity>(p);
        return opp.Account.Id.ToString();
    }
}
