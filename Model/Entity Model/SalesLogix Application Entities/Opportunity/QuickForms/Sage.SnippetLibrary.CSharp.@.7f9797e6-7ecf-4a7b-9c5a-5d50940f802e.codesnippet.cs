/*
 * This metadata is used by the Sage platform.  Do not remove.
<snippetHeader xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" id="7f9797e6-7ecf-4a7b-9c5a-5d50940f802e">
 <assembly>Sage.SnippetLibrary.CSharp</assembly>
 <name>SetDefaultOppContactInfo</name>
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
    /// This is called on the lookup result of the associate contact action 
	/// of the opportunity contacts form.
    /// </summary>
    public static partial class OpportunityContactsEventHandlers
    {
		/// <summary>
       	/// Adds the selected contact as a new opportunity contact.
       	/// </summary>
       	/// <param name="form">The opportunity contacts form.</param>
       	/// <param name="args">The <see cref="System.EventArgs"/> instance containing the event data.</param>
        public static void SetDefaultOppContactInfo(IOpportunityContacts form,  EventArgs args)
        {
            Sage.Platform.WebPortal.SmartParts.WebActionEventArgs e = args as Sage.Platform.WebPortal.SmartParts.WebActionEventArgs;
            if (e != null)
            {
				IContact contact = form.lueAssociateContact.LookupResultValue as IContact;
                IOpportunityContact opportunityContact = e.PassThroughObject as IOpportunityContact;
                if (opportunityContact != null && contact != null)
						opportunityContact.SetOppContactDefaults(contact);
            }
			form.lueAssociateContact.LookupResultValue = null; //34026
        }
    }
}