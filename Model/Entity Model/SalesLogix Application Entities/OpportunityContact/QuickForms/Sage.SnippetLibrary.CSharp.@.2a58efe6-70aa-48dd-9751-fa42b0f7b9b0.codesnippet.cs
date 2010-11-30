/*
 * This metadata is used by the Sage platform.  Do not remove.
<snippetHeader xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" id="2a58efe6-70aa-48dd-9751-fa42b0f7b9b0">
 <assembly>Sage.SnippetLibrary.CSharp</assembly>
 <name>cmdOK_OnClick</name>
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
    /// This is called on the click action of OK button after the save event of the 
	/// EditOpportunityContact form.
    /// </summary>
    public static partial class EditOpportunityContactEventHandlers
    {
		/// <summary>
        /// Iterates through the opportunity contacts collection and sets the primary flag of the opportunity
		/// contact to false if this instance of the opportunity contact is set to be the primary.
        /// </summary>
        /// <param name="form">The form.</param>
        /// <param name="args">The <see cref="System.EventArgs"/> instance containing the event data.</param>
        public static void cmdOK_OnClick(IEditOpportunityContact form,  EventArgs args)
        {
            IOpportunityContact newOppContact = form.CurrentEntity as IOpportunityContact;
			foreach(IOpportunityContact oppContact in newOppContact.Opportunity.Contacts)
			{
				if(!newOppContact.Equals(oppContact))
				{
                    if (newOppContact.IsPrimary.HasValue && newOppContact.IsPrimary.Value)
                    {
                        oppContact.IsPrimary = false;
                    }
				}
			}
            if (newOppContact.Opportunity.Id != null)
                newOppContact.Save();
        }
    }
}