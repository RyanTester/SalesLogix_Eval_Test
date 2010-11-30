/*
 * This metadata is used by the Sage platform.  Do not remove.
<snippetHeader xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" id="71ab7dd2-b5f2-463e-88cf-3f7f7b9a3915">
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
    /// This method is invoked from the FullAddress property of the address entity.
    /// </summary>
    public static partial class AddressBusinessRules
    {
        /// <summary>
        /// Formats the full address; address, city, state, zip, country.
        /// </summary>
        /// <param name="address">The address.</param>
        /// <param name="result">The result.</param>
        public static void GetFullAddressStep1(IAddress address, out System.String result)
        {
			result = address.FormatFullAddress();
        }
    }
}