/*
 * This metadata is used by the Sage platform.  Do not remove.
<snippetHeader xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" id="b1d5a2cb-3338-4d6a-a5e9-861db9fe7b9d">
 <assembly>Sage.SnippetLibrary.CSharp</assembly>
 <name>LoadAction1Step1</name>
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
  <reference>
   <assemblyName>Sage.Platform.WebPortal.dll</assemblyName>
   <hintPath>%BASEBUILDPATH%\assemblies\Sage.Platform.WebPortal.dll</hintPath>
  </reference>
  <reference>
   <assemblyName>Sage.Platform.Application.UI.Web.dll</assemblyName>
   <hintPath>%BASEBUILDPATH%\assemblies\Sage.Platform.Application.UI.Web.dll</hintPath>
  </reference>
  <reference>
   <assemblyName>System.Web.dll</assemblyName>
  </reference>
 </references>
</snippetHeader>
*/


#region Usings
using System;
using System.Web;
using Sage.Entity.Interfaces;
using Sage.Form.Interfaces;
using Sage.Platform.WebPortal;
#endregion Usings

namespace Sage.BusinessRules.CodeSnippets
{
	/// <summary>
    /// This is called on the lookup result of the associate competitor action 
	/// of the opportunity competitors form.
    /// </summary>
    public static partial class OpportunityCompetitorsEventHandlers
    {
		/// <summary>
        /// Adds the selected competitor as a new opportunity competitor.
        /// </summary>
        /// <param name="form">The form.</param>
        /// <param name="args">The <see cref="System.EventArgs"/> instance containing the event data.</param>
        public static void LoadAction1Step1(IOpportunityCompetitors form, EventArgs args)
        {            
            Sage.Platform.WebPortal.SmartParts.WebActionEventArgs e = args as Sage.Platform.WebPortal.SmartParts.WebActionEventArgs;
            if (e != null)
            {
				ICompetitor competitor = form.lueAssociateCompetitor.LookupResultValue as ICompetitor;
                IOpportunityCompetitor opportunityCompetitor = e.PassThroughObject as IOpportunityCompetitor;
                if (opportunityCompetitor != null && competitor != null)
						opportunityCompetitor.SetOppCompetitorDefaults(competitor);
            }
			form.lueAssociateCompetitor.LookupResultValue = null; //34026
        }
    }
}
