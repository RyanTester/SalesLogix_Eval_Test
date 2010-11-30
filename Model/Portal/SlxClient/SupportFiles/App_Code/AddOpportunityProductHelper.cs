using System;
using System.Collections.Generic;
using Sage.Entity.Interfaces;
using Sage.Platform;
using System.ComponentModel;
using Sage.Platform.ChangeManagement;
using Sage.SalesLogix.BusinessRules.Properties;
using System.Reflection;

namespace Sage.SalesLogix.Client.App_Code
{
    /// <summary>
    /// Opportunity Helper rules class
    /// </summary>
    public class AddOpportunityProductHelperClass
    {
        #region public gridview methods
        /// <summary>
        /// Selects the specified opportunity.
        /// </summary>
        /// <param name="opportunityId">The opportunity.</param>
        /// <returns></returns>
        public static IList<IOpportunityProduct> Select(string opportunityId)
        {
            return Sage.SalesLogix.Opportunity.OpportunityHelperClass.Select(opportunityId);

        }

        /// <summary>
        /// This method exists for the rare case where the object data source will call select without
        /// our custom parameters.
        /// </summary>
        /// <returns></returns>
        public static IList<IOpportunityProduct> Select()
        {
            return Sage.SalesLogix.Opportunity.OpportunityHelperClass.Select();

        }

        /// <summary>
        /// Updates the specified original_ id.
        /// </summary>
        /// <param name="original_Id">The original_ id.</param>
        /// <param name="original_InstanceId">The original_ instance id.</param>
        /// <param name="discount">The discount.</param>
        /// <param name="calculatedPrice">The calculated price.</param>
        /// <param name="quantity">The quantity.</param>
        public static void Update(string original_Id, object original_InstanceId, double discount, decimal calculatedPrice, double quantity, string program)
        {
            Sage.SalesLogix.Opportunity.OpportunityHelperClass.Update(original_Id, original_InstanceId, discount,
                                                                      calculatedPrice, quantity, program);

        }


        /// <summary>
        /// Deletes the specified original_ id.
        /// </summary>
        /// <param name="original_Id">The original_ id.</param>
        /// <param name="original_InstanceId">The original_ instance id.</param>
        public static void Delete(string original_Id, object original_InstanceId)
        {
            Sage.SalesLogix.Opportunity.OpportunityHelperClass.Delete(original_Id, original_InstanceId);
        }

        /// <summary>
        /// Inserts the specified opportunity.
        /// </summary>
        /// <param name="opportunity">The opportunity.</param>
        /// <returns></returns>
        public static IList<IOpportunityProduct> Insert(string opportunity)
        {
            return Sage.SalesLogix.Opportunity.OpportunityHelperClass.Insert(opportunity);

        }

        /// <summary>
        /// Gets the current opportunity.
        /// </summary>
        /// <value>The current opportunity.</value>
        public static IOpportunity CurrentOpportunity
        {
            get
            {
                return Sage.SalesLogix.Opportunity.OpportunityHelperClass.CurrentOpportunity;
            }
        }

        #endregion

        #region Private Static Methods

        private static IOpportunityProduct GetOppProd(string original_Id, object original_InstanceId)
        {
            IOpportunityProduct oppProd = null;
            if (CurrentOpportunity != null)
            {
                foreach (IOpportunityProduct op in CurrentOpportunity.Products)
                {

                    if (op.Id != null)
                    {
                        if (String.Equals(op.Id.ToString(), original_Id))
                        {
                            oppProd = op;
                            break;
                        }
                    }
                    else
                    {
                        if (String.Equals(op.InstanceId.ToString(), original_InstanceId.ToString()))
                        {
                            oppProd = op;
                            break;
                        }
                    }


                }
            }
            else
            {
                oppProd = EntityFactory.GetRepository<IOpportunityProduct>().Get(original_Id);
            }
            return oppProd;
        }

        #endregion
    }


}
