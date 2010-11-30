/*
 * This metadata is used by the Sage platform.  Do not remove.
<snippetHeader xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" id="5cef2b4c-eea5-4e47-ba23-613f63e5fde0">
 <assembly>Sage.SnippetLibrary.CSharp</assembly>
 <name>lueNameShipping_OnChange</name>
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
    /// This is called on the change action of the shipping contact lookup control
	/// of the bill to ship to form.
    /// </summary>
    public static partial class BillToShipToEventHandlers
    {
		/// <summary>
    	/// Updates the sales order shipping address and shipping contact with the new address.
    	/// </summary>
    	/// <param name="form">The bill to ship to form.</param>
    	/// <param name="args">The <see cref="System.EventArgs"/> instance containing the event data.</param>
        public static void lueNameShipping_OnChange(IBillToShipTo form,  EventArgs args)
        {
            ISalesOrder salesOrder = form.CurrentEntity as ISalesOrder;
			if (salesOrder != null && salesOrder.ShippingContact != null)
    		{
        		salesOrder.ShippingAddress = salesOrder.SetSalesOrderShippingAddress(salesOrder.ShippingContact.ShippingAddress);
        		salesOrder.ShipToName = salesOrder.ShippingContact.NameLF;
    		}
		}
    }
}