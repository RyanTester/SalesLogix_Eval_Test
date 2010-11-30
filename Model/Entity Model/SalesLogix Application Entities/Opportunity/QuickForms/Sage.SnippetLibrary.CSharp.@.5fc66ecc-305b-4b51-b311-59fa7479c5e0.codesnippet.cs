/*
 * This metadata is used by the Sage platform.  Do not remove.
<snippetHeader xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" id="5fc66ecc-305b-4b51-b311-59fa7479c5e0">
 <assembly>Sage.SnippetLibrary.CSharp</assembly>
 <name>cmdCancel_OnClickStep1</name>
 <references>
  <reference>
   <assemblyName>Sage.Entity.Interfaces.dll</assemblyName>
   <hintPath>%BASEBUILDPATH%\interfaces\bin\Sage.Entity.Interfaces.dll</hintPath>
  </reference>
  <reference>
   <assemblyName>Sage.Form.Interfaces.dll</assemblyName>
   <hintPath>%BASEBUILDPATH%\formInterfaces\bin\Sage.Form.Interfaces.dll</hintPath>
  </reference>
  <reference>
   <assemblyName>Sage.Platform.dll</assemblyName>
   <hintPath>%BASEBUILDPATH%\assemblies\Sage.Platform.dll</hintPath>
  </reference>
 </references>
</snippetHeader>
*/


#region Usings
using System;
using Sage.Entity.Interfaces;
using Sage.Form.Interfaces;
#endregion Usings

namespace Sage.BusinessRules.CodeSnippets
{
    /// <summary>
    /// Event handlers for the OpportunityClosedWon dialog
    /// </summary>
    public static partial class OpportunityClosedWonEventHandlers
    {
        /// <summary>
        /// Sets the status to Open if the dialog is cancelled.  This is limited because it does not know the 
        /// prior status so it resets to a pre-determined value.
        /// </summary>
        /// <param name="form">the instance of the OpportunityClosedWon dialog</param>
        /// <param name="args">empty</param>
        public static void cmdCancel_OnClickStep1( IOpportunityClosedWon form,  EventArgs args)
        {
            IOpportunity opportunity = form.CurrentEntity as IOpportunity;
            object resOpen = System.Web.HttpContext.GetGlobalResourceObject("Opportunity", "Opp_Status_Open");
            if(resOpen != null)
                opportunity.Status = resOpen.ToString(); //"Open";
        }
    }
}