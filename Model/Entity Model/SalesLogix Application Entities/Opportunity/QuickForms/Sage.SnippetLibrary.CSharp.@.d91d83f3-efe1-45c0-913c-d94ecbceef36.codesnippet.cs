/*
 * This metadata is used by the Sage platform.  Do not remove.
<snippetHeader xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" id="d91d83f3-efe1-45c0-913c-d94ecbceef36">
 <assembly>Sage.SnippetLibrary.CSharp</assembly>
 <name>lueCompetitorReplaced_OnChange</name>
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
	/// OpportunityClosedWon form.
    /// </summary>
    public static partial class OpportunityClosedWonEventHandlers
    {
		/// <summary>
        /// Sets the flag, LostReplaced, on the opportunity competitor indicating that this opportunity 
		/// competitor was associated as a competitor replaced.
        /// </summary>
        /// <param name="form">The opportunity closed won form.</param>
        /// <param name="args">The event arguments.<see cref="System.EventArgs"/> instance containing the event data.</param>
        public static void lueCompetitorReplaced_OnChange(IOpportunityClosedWon form,  EventArgs args)
        {
           	ICompetitor competitor = form.lueCompetitorReplaced.LookupResultValue as ICompetitor;
			if (competitor != null)
			{
				IOpportunity opportunity = form.CurrentEntity as IOpportunity;
			    opportunity.SetOppCompetitorReplacedFlag(competitor);
			}
        }
    }
}