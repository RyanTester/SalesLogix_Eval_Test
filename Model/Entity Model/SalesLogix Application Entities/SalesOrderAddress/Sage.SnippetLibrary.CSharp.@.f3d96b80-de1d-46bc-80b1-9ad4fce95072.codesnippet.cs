/*
 * This metadata is used by the Sage platform.  Do not remove.
<snippetHeader xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" id="f3d96b80-de1d-46bc-80b1-9ad4fce95072">
 <assembly>Sage.SnippetLibrary.CSharp</assembly>
 <name>GetFullAddress</name>
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
    /// This is called on load action of the insert sales order form.
    /// </summary>
    public static partial class SalesOrderAddressBusinessRules
    {
        /// <summary>
        /// Formats the full address of this instance.
        /// </summary>
        /// <param name="salesOrderAddress">The sales order address.</param>
        /// <param name="result">The result.</param>
        public static void GetFullAddress(ISalesOrderAddress salesOrderAddress, out System.String result)
        {
            result = salesOrderAddress.FormatFullSalesOrderAddress();
        }
    }
}
