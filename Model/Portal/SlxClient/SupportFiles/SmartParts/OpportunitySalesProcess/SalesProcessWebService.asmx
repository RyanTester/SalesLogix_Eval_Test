<%@ WebService Language="C#" Class="SalesProcess.SalesProcessWebService" %>
using System;
using System.Web;
using System.Web.Services;
using System.Web.Services.Protocols;
using System.Web.Script.Services; // From Microsoft.Web.Extensions.dll assembly
using Sage.Entity.Interfaces;
using Sage.SalesLogix.SalesProcess;


namespace SalesProcess
{
    [WebService(Namespace = "http://SalesProcess.SalesProcessWebService.com/ws")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [ScriptService]
    public class SalesProcessWebService : WebService
    {

        [WebMethod]
        public string GetActionXML(string stepId)
        {
            return Sage.SalesLogix.SalesProcess.Helpers.GetActionXML(stepId);
        
        }

    }
}