/*
 * This metadata is used by the Sage platform.  Do not remove.
<snippetHeader xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" id="12c4dbb2-e601-4f95-8261-5b3c6b4ef215">
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
    /// Event handlers for the EditOpportunityProduct dialog
    /// </summary>
    public static partial class EditOpportunityProductEventHandlers
    {
        /// <summary>
        /// Updates the opportunity products price based on a change of the multi currency pricing value.
		/// The updated is based on the value changed divided by the exchange rate. This event is only
		/// called when multi-currency is enabled.
        /// </summary>
        /// <param name="form">the instance of the EditOpportunityProduct dialog</param>
        /// <param name="args">empty</param>		
        public static void curMCCalcPrice_OnChangeStep(IEditOpportunityProduct form, EventArgs args)
        {
            IOpportunityProduct opportunityProduct = form.CurrentEntity as IOpportunityProduct;
            if (opportunityProduct != null)
            {
                double exchangeRate = opportunityProduct.Opportunity.ExchangeRate.HasValue
                                          ? opportunityProduct.Opportunity.ExchangeRate.Value
                                          : 1;
                form.curMCCalcPrice.CurrentCode = opportunityProduct.Opportunity.ExchangeRateCode;
                string price = String.IsNullOrEmpty(form.curMCCalcPrice.Text) ? "0" : form.curMCCalcPrice.Text;
                opportunityProduct.CalculatedPrice = (decimal?) (Convert.ToDouble(price)/exchangeRate);
                opportunityProduct.CalculateCalcPrice();
            }
        }
    }
}
