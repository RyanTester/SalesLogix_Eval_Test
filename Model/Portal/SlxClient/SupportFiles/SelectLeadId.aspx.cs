using System;

public partial class SelectLeadId : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        Sage.SalesLogix.Client.GroupBuilder.ClientGroupContextService clientGroupContext = new Sage.SalesLogix.Client.GroupBuilder.ClientGroupContextService();
        Page.Form.Controls.Add(clientGroupContext);

        SelectedLead.ReturnPrimaryKey = true;
        SelectedLead.ID = "SelectedLead";
        SelectedLead.LookupEntityName = "Lead";
        SelectedLead.LookupEntityTypeName = "Sage.SalesLogix.Entities.Lead, Sage.SalesLogix.Entities";
        for (int i = 0; i < SelectedLead.LookupProperties.Count; i++)
        {
            SelectedLead.LookupProperties[i].PropertyName = SelectedLead.LookupProperties[i].PropertyName.Replace("Lead.", "");
        }
        SelectedLead.SeedProperty = "";
        SelectedLead.SeedValue = "";
    }
}
