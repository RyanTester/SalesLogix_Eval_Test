/*
 * This metadata is used by the Sage platform.  Do not remove.
<snippetHeader xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" id="472b0760-e2b9-4714-b658-781cefefe53f">
 <assembly>Sage.SnippetLibrary.CSharp</assembly>
 <name>CreateAsset</name>
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
using Sage.Platform.WebPortal;
#endregion Usings

namespace Sage.BusinessRules.CodeSnippets
{
    /// <summary>
    /// This is called on the toolbars insert asset action of the ticket activity items form.
    /// </summary>
    public static partial class TicketActivityItemsEventHandlers
    {
        /// <summary>
        /// Creates a new instance of an account product (asset) and associates it with the ticket activity.
        /// </summary>
        /// <param name="form">The ticket activity items form.</param>
        /// <param name="args">The <see cref="System.EventArgs"/> instance containing the event data.</param>
        public static void CreateAsset(ITicketActivityItems form,  EventArgs args)
        {
            Sage.Platform.WebPortal.SmartParts.WebActionEventArgs e = args as Sage.Platform.WebPortal.SmartParts.WebActionEventArgs;
            if (e != null)
            {
                Sage.Entity.Interfaces.ITicketActivityItem item = e.PassThroughObject as Sage.Entity.Interfaces.ITicketActivityItem;
                if (item != null && item.Product != null)
                {
					IAccountProduct asset;
					if (item.AccountProduct != null)
                    {
						asset = item.AccountProduct;
					}
                    else
                    {
						asset = Sage.Platform.EntityFactory.Create<IAccountProduct>();
						item.AccountProduct = asset;
					}
					IProduct product = item.Product;
            		asset.Product = product;
            		asset.ProductDescription = product.Description;
            		asset.ProductName = product.Name;
            		asset.ActualId = product.ActualId;
            		item.ItemQuantity = 1;
            		item.ItemAmount = Convert.ToDouble(product.DefaultPrice);

                    Sage.Platform.WebPortal.SmartParts.EntityBoundSmartPart smartpart = form.NativeForm as Sage.Platform.WebPortal.SmartParts.EntityBoundSmartPart;
                    if (smartpart != null)
                    {
                        Sage.Platform.WebPortal.EntityPage page = smartpart.Page as Sage.Platform.WebPortal.EntityPage;
						if (page != null) {
                        	if (page.ModeId.ToUpper() != "INSERT")
                        	{
	                            item.Save();
    	                    }
						}
                    }
                }
            }
        }
    }
}
