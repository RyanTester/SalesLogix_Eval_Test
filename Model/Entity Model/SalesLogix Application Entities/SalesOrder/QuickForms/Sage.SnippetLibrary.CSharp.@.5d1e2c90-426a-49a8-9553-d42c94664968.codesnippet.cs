/*
 * This metadata is used by the Sage platform.  Do not remove.
<snippetHeader xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" id="5d1e2c90-426a-49a8-9553-d42c94664968">
 <assembly>Sage.SnippetLibrary.CSharp</assembly>
 <name>lstbxBillingAddress_OnChange</name>
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
    /// This is called on the change action of the billing address list box control
	/// of the bill to ship to form.
    /// </summary>
    public static partial class BillToShipToEventHandlers
    {
		/// <summary>
    	/// Updates the sales order billing address with the newly selected address.
    	/// </summary>
    	/// <param name="form">The bill to ship to form.</param>
    	/// <param name="args">The <see cref="System.EventArgs"/> instance containing the event data.</param>
        public static void lstbxBillingAddress_OnChange(IBillToShipTo form,  EventArgs args)
        {
			ISalesOrder salesOrder = form.CurrentEntity as ISalesOrder;
			if (salesOrder != null)
			{
				IAddress address = Sage.Platform.EntityFactory.GetById<IAddress>(form.lstbxBillingAddress.Text);
				salesOrder.SetSalesOrderBillingAddress(address);
			}
        }
    }
}