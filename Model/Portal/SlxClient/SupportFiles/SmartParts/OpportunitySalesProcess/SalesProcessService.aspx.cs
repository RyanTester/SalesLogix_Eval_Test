using System;
using System.Text;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Collections.Generic;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using Sage.Entity.Interfaces;
using Sage.SalesLogix.SalesProcess;
using Sage.SalesLogix.Plugins;
using Sage.Platform;

public partial class SmartParts_OpportunitySalesProcess_SalesProcessService : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

        string results = string.Empty;
        string serviceType = Request.Params["serviceType"];
        string serviceContext = Request.Params["serviceContext"];
        switch (serviceType.ToUpper())
        {
            case "GETACTIONXML":
                results = GetActionXML(serviceContext);
                break;
            case "CANCOMPLETESTEP":
                results = CanCompleteStep(serviceContext);
                break;
            case "GETOPPCONTACTSEMAIL":
                results = GetOppContactsEmail(serviceContext);
                break;
            case "RESOLVEOPPCONTACT":
                results = ResolveOppContact(serviceContext);
                break;
            case "GETPLUGINID":
                results = GetPluginId(serviceContext);
                break;
            default: break;

        }
        Response.Write(results);

    }

    private string GetActionXML(string stepId)
    {
        string result = string.Empty;        
        result = Sage.SalesLogix.SalesProcess.Helpers.GetActionXML(stepId);
        return result;
    }

    private string CanCompleteStep(string stepId)
    {
        string result = string.Empty;
        ISalesProcessAudit spAudit = EntityFactory.GetById<ISalesProcessAudit>(stepId);
        if (spAudit != null)
        {
            result = spAudit.SalesProcess.CanCompleteStep(stepId);
        }

        return result;
    }

    private string GetOppContactsEmail(string opportunityId)
    {
        string result = string.Empty;

        result = Sage.SalesLogix.SalesProcess.Helpers.GetOppContactsEmailXML(opportunityId);
        
        return result;
    }

    private string ResolveOppContact(string opportunityContactId)
    {
        string contactId = string.Empty;
        try
        {
            IOpportunityContact oppcon = GetOppContact(opportunityContactId);
            if (oppcon != null)
            {
                contactId = oppcon.Contact.Id.ToString();
            }
        }
        catch
        {
            contactId = "";
        
        }
        return contactId;
    }

    private string GetPluginId(string pluginContext)
    {
       
        string pluginId = string.Empty;
        try
        {
            string[] args = pluginContext.Split(new Char[] { ',' });
            string name = args[0];
            string family = args[1];
            string strPluginType = args[2];
           
            switch (strPluginType)
            { 
                case "25":
                    pluginId = Sage.SalesLogix.SalesProcess.Helpers.GetPluginId(family, name, PluginType.MailMergeTemplate); 
                    break;
                case "19":
                    pluginId = Sage.SalesLogix.SalesProcess.Helpers.GetPluginId(family, name, PluginType.CrystalReport);
                    break;
                default:
                    break;
            
            }     
        }
        catch
        {
            pluginId = string.Empty;
        }
        return pluginId;
    }

    private static IList<IContact> GetOppContacts(string opportunityId)
    {
        List<IContact> contacts = new List<IContact>();
        IOpportunity opp = null;
        opp = EntityFactory.GetById<IOpportunity>(opportunityId);
        foreach (IOpportunityContact oppCon in opp.Contacts)
        {
            contacts.Add(oppCon.Contact);

        }
        
        return contacts;

    }

    private static int GetOppContactCount(string opportunityId)
    {
        int count = 0;
        IOpportunity opp;
        opp = EntityFactory.GetById<IOpportunity>(opportunityId);
        count = opp.Contacts.Count;
        return count;

    }

    private static IOpportunityContact GetOppContact(string opportunityContactId)
    {
        IOpportunityContact oppcon = null;
        oppcon = EntityFactory.GetById<IOpportunityContact>(opportunityContactId);
        return oppcon;

    }
}
