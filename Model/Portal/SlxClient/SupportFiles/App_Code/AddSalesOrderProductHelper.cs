using System;
using System.Collections.Generic;
using Sage.Entity.Interfaces;
using Sage.Platform;
using Sage.SalesLogix.SalesOrder;

namespace Sage.SalesLogix.Client.App_Code
{
    /// <summary>
    /// Sales Order Helper rules class
    /// </summary>
    public class AddSalesOrderProductHelperClass
    {
        /// <summary>
        /// Gets the current Sales Order.
        /// </summary>
        /// <value>The current Sales Order.</value>
        public static ISalesOrder CurrentSalesOrder
        {
            get
            {
                return SalesOrderHelperClass.CurrentSalesOrder;
            }
        }

        #region public gridview methods

        /// <summary>
        /// Selects the specified salesOrder.
        /// </summary>
        /// <param name="salesOrderId">The salesOrder.</param>
        /// <returns></returns>
        public static IList<ISalesOrderItem> Select(string salesOrderId)
        {
            return SalesOrderHelperClass.Select(salesOrderId);
        }

        /// <summary>
        /// This method exists for the rare case where the object data source will call select without
        /// our custom parameters.
        /// </summary>
        /// <returns></returns>
        public static IList<ISalesOrderItem> Select()
        {
            return SalesOrderHelperClass.Select();
        }

        /// <summary>
        /// Updates the specified original_ id.
        /// </summary>
        /// <param name="original_Id">The original_ id.</param>
        /// <param name="original_InstanceId">The original_ instance id.</param>
        /// <param name="discount">The discount.</param>
        /// <param name="calculatedPrice">The calculated price.</param>
        /// <param name="quantity">The quantity.</param>
        /// <param name="program">The program</param>
        public static void Update(string original_Id, object original_InstanceId, double discount, decimal calculatedPrice, double quantity, string program)
        {
            SalesOrderHelperClass.Update(original_Id, original_InstanceId, discount, calculatedPrice, quantity, program);
        }

        /// <summary>
        /// Deletes the specified original_ id.
        /// </summary>
        /// <param name="original_Id">The original_ id.</param>
        /// <param name="original_InstanceId">The original_ instance id.</param>
        public static void Delete(string original_Id, object original_InstanceId)
        {
            SalesOrderHelperClass.Delete(original_Id, original_InstanceId);
        }

        /// <summary>
        /// Inserts the specified Sales Order.
        /// </summary>
        /// <param name="salesOrder">The Sales Order.</param>
        /// <returns></returns>
        public static IList<ISalesOrderItem> Insert(string salesOrder)
        {
            return SalesOrderHelperClass.Insert(salesOrder);
        }

        #endregion

        #region Private Static Methods

        private static ISalesOrderItem GetSalesOrderItem(string original_Id, object original_InstanceId)
        {
            ISalesOrderItem salesOrderItem = null;
            if (CurrentSalesOrder != null)
            {
                foreach (ISalesOrderItem item in CurrentSalesOrder.SalesOrderItems)
                {
                    if (item.Id != null)
                    {
                        if (String.Equals(item.Id.ToString(), original_Id))
                        {
                            salesOrderItem = item;
                            break;
                        }
                    }
                    else
                    {
                        if (String.Equals(item.InstanceId.ToString(), original_InstanceId.ToString()))
                        {
                            salesOrderItem = item;
                            break;
                        }
                    }
                }
            }
            else
            {
                salesOrderItem = EntityFactory.GetRepository<ISalesOrderItem>().Get(original_Id);
            }
            return salesOrderItem;
        }

        #endregion
    }
}