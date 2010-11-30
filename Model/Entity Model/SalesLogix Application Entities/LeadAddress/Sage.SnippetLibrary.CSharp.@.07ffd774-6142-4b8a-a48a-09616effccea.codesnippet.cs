/*
 * This metadata is used by the Sage platform.  Do not remove.
<snippetHeader xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" id="07ffd774-6142-4b8a-a48a-09616effccea">
 <assembly>Sage.SnippetLibrary.CSharp</assembly>
 <name>GetFullAddressStep1</name>
 <references>
  <reference>
   <assemblyName>Sage.Entity.Interfaces.dll</assemblyName>
   <hintPath>%BASEBUILDPATH%\interfaces\bin\Sage.Entity.Interfaces.dll</hintPath>
  </reference>
  <reference>
   <assemblyName>Sage.Platform.dll</assemblyName>
   <hintPath>%BASEBUILDPATH%\assemblies\sage.platform.dll</hintPath>
  </reference>
 </references>
</snippetHeader>
*/


#region Usings
using System;
using Sage.Entity.Interfaces;
#endregion Usings

namespace Sage.BusinessRules.CodeSnippets
{
    /// <summary>
    /// This method is invoked from the FullAddress property of the lead address entity.
    /// </summary>
    public static partial class LeadAddressBusinessRules
    {
        /// <summary>
        /// Formats the full address; address, city, state, zip, country.
        /// </summary>
        /// <param name="leadaddress">The leadaddress.</param>
        /// <param name="result">The result.</param>
        public static void GetFullAddressStep1(ILeadAddress leadaddress, out System.String result)
        {
            result = leadaddress.FormatFullLeadAddress();
        }
    }
}