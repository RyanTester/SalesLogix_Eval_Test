/*
 * This metadata is used by the Sage platform.  Do not remove.
<snippetHeader xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" id="47c8ef52-3c79-4176-b716-81d347074e5a">
 <assembly>Sage.SnippetLibrary.CSharp</assembly>
 <name>lueNameBilling_OnChange</name>
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
    /// This is called on the change action of the billing contact lookup control
	/// of the bill to ship to form.
    /// </summary>
    public static partial class BillToShipToEventHandlers
    {
		/// <summary>
    	/// Updates the sales order billing address and billing contact with the new address.
    	/// </summary>
    	/// <param name="form">The bill to ship to form.</param>
    	/// <param name="args">The <see cref="System.EventArgs"/> instance containing the event data.</param>
        public static void lueNameBilling_OnChange(IBillToShipTo form,  EventArgs args)
        {
        	ISalesOrder salesOrder = form.CurrentEntity as ISalesOrder;
        	if (salesOrder != null && salesOrder.BillingContact != null)
        	{
            	salesOrder.BillingAddress = salesOrder.SetSalesOrderBillingAddress(salesOrder.BillingContact.Address);
            	salesOrder.BillToName = salesOrder.BillingContact.NameLF;
        	}
        }
    }
}