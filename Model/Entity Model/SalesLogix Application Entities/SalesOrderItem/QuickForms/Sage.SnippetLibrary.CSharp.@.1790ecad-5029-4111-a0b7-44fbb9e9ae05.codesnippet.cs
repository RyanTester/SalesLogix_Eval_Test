/*
 * This metadata is used by the Sage platform.  Do not remove.
<snippetHeader xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" id="1790ecad-5029-4111-a0b7-44fbb9e9ae05">
 <assembly>Sage.SnippetLibrary.CSharp</assembly>
 <name>curMCCalcPrice_OnChangeStep</name>
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
  <reference>
   <assemblyName>Sage.SalesLogix.API.dll</assemblyName>
  </reference>
 </references>
</snippetHeader>
*/


#region Usings
using System;
using Sage.Entity.Interfaces;
using Sage.Form.Interfaces;
using Sage.SalesLogix.API;
#endregion Usings

namespace Sage.BusinessRules.CodeSnippets
{
	/// <summary>
    /// Event handlers for the EditSalesOrderItem dialog
    /// </summary>
    public static partial class EditSalesOrderItemEventHandlers
    {
		/// <summary>
		/// Updates the sales order products price based on a change of the multi currency pricing value.
		/// The updated is based on the value changed divided by the exchange rate. This event is only
		/// called when multi-currency is enabled.
		/// </summary>
		/// <param name="form">the instance of the EditSalesOrderItem dialog</param>
		/// <param name="args">empty</param>
        public static void curMCCalcPrice_OnChangeStep(IEditSalesOrderItem form, EventArgs args)
        {
			ISalesOrderItem salesOrderItem = form.CurrentEntity as ISalesOrderItem;
			if (salesOrderItem != null)
			{
				double exchangeRate = salesOrderItem.SalesOrder.ExchangeRate.HasValue
										? salesOrderItem.SalesOrder.ExchangeRate.Value
										: 1;
				form.curMCCalcPrice.CurrentCode = salesOrderItem.SalesOrder.CurrencyCode;
				string price = String.IsNullOrEmpty(form.curMCCalcPrice.Text) ? "0" : form.curMCCalcPrice.Text;
				salesOrderItem.CalculatedPrice = (decimal?) (Convert.ToDouble(price)/exchangeRate);
				salesOrderItem.CalculateCalcPrice();
			}
		}
    }
}