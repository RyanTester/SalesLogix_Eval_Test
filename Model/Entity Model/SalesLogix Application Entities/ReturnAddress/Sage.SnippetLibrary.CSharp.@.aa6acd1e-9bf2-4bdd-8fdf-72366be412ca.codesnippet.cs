/*
 * This metadata is used by the Sage platform.  Do not remove.
<snippetHeader xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" id="aa6acd1e-9bf2-4bdd-8fdf-72366be412ca">
 <assembly>Sage.SnippetLibrary.CSharp</assembly>
 <name>GetFormatFullAddressStep1</name>
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
    /// This method is invoked from the FullAddress property of the return address entity.
    /// </summary>
    public static partial class ReturnAddressBusinessRules
    {
        /// <summary>
        /// Formats the full address; address, city, state, zip, country.
        /// </summary>
        /// <param name="returnaddress">The returnaddress.</param>
        /// <param name="result">The result.</param>
        public static void GetFullAddress(IReturnAddress returnaddress, out System.String result)
        {
            result = returnaddress.FormatFullReturnAddress();
        }
    }
}
