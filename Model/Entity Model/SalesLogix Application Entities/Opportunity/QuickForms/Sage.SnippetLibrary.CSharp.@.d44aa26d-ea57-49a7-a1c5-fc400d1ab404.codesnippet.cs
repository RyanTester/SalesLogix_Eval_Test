/*
 * This metadata is used by the Sage platform.  Do not remove.
<snippetHeader xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" id="d44aa26d-ea57-49a7-a1c5-fc400d1ab404">
 <assembly>Sage.SnippetLibrary.CSharp</assembly>
 <name>lueCompetitorLoss_OnChange</name>
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
    /// This is called on the click action of the competitor lookup event of the 
	/// OpportunityClosedLost form.
    /// </summary>
    public static partial class OpportunityClosedLostEventHandlers
    {
		/// <summary>
        /// Sets the flag, LostReplaced, on the opportunity competitor indicating that this opportunity 
		/// competitor was associated as a competitor lost to.
        /// </summary>
        /// <param name="form">The opportunity closed lost form.</param>
        /// <param name="args">The event arguments.<see cref="System.EventArgs"/> instance containing the event data.</param>
        public static void lueCompetitorLoss_OnChange(IOpportunityClosedLost form,  EventArgs args)
        {
            ICompetitor competitor = form.lueCompetitorLoss.LookupResultValue as ICompetitor;
			if (competitor != null)
			{
				IOpportunity opportunity = form.CurrentEntity as IOpportunity;
			    opportunity.SetOppCompetitorReplacedFlag(competitor);
			}
        }
    }
}