/*
 * This metadata is used by the Sage platform.  Do not remove.
<snippetHeader xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" id="825a1a0b-fd53-41de-9720-740bbb927955">
 <assembly>Sage.SnippetLibrary.CSharp</assembly>
 <name>ResetAddPartLookup</name>
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
    /// This is a post execute script action which occurs after the insert asset action is invoked from the toolbar
    /// of the ticket activity items form.
    /// </summary>
    public static partial class Classbd7189f1dad74bfabbf988c29c3375b4
    {
        /// <summary>
        /// Resets the result value of the insert asset lookup control.
        /// </summary>
        /// <param name="form">The ticket activity items form.</param>
        /// <param name="args">The <see cref="System.EventArgs"/> instance containing the event data.</param>
        public static void ResetAddPartLookup(ITicketActivityItems form,  EventArgs args)
        {
			form.lueAddPart.LookupResultValue = null;
        }
    }
}