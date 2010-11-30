using System;
using System.Collections;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Sage.Platform.WebPortal.Services;
using Sage.Platform.WebPortal.SmartParts;
using Sage.Entity.Interfaces;
using Sage.SalesLogix;
using Sage.SalesLogix.Orm.Utility;

public partial class SmartParts_Opportunity_OpportunityProductEX : EntityBoundSmartPartInfoProvider
{
    protected void grdProducts_RowCommand(object sender, GridViewCommandEventArgs e)
	{
        if (e.CommandName == "Page")
            return;

        int rowIndex;
        if (Int32.TryParse(e.CommandArgument.ToString(), out rowIndex))
        {
            dtsProducts.SelectedIndex = rowIndex;
            object currentEntity = dtsProducts.Current;
            if ((currentEntity is Sage.Platform.ComponentModel.ComponentView) && !((Sage.Platform.ComponentModel.ComponentView)currentEntity).IsVirtualComponent)
                currentEntity = ((Sage.Platform.ComponentModel.ComponentView)currentEntity).Component;
            string id = String.Empty;
            //Check if this is an unpersisted entity and use its InstanceId
            if (Sage.Platform.WebPortal.PortalUtil.ObjectIsNewEntity(currentEntity))
            {
                if (grdProducts.DataKeys[0].Values.Count > 1)
                {
                    foreach (DictionaryEntry val in grdProducts.DataKeys[rowIndex].Values)
                    {
                        if (val.Key.ToString() == "InstanceId")
                        {
                            Guid instanceId = (Guid)val.Value;
                            dtsProducts.SetCurrentEntityByInstanceId(instanceId);
                            id = instanceId.ToString();
                            currentEntity = dtsProducts.Current;
                            if ((currentEntity is Sage.Platform.ComponentModel.ComponentView) && !((Sage.Platform.ComponentModel.ComponentView)currentEntity).IsVirtualComponent)
                                currentEntity = ((Sage.Platform.ComponentModel.ComponentView)currentEntity).Component;
                        }
                    }
                }
            }
            else
            {
                if (grdProducts.DataKeys[0].Values.Count > 1)
                {
                    foreach (DictionaryEntry val in grdProducts.DataKeys[rowIndex].Values)
                    {
                        if (val.Key.ToString() != "InstanceId")
                        {
                            id = val.Value.ToString();
                        }
                    }
                }
            }		

            if (e.CommandName.Equals("Edit"))
            {
                if (DialogService != null)
                {
                    DialogService.SetSpecs(300, 425, "EditOpportunityProduct", HttpContext.GetLocalResourceObject(Request.Path,"EditOpportunityProduct.Title").ToString());
                    DialogService.EntityType = typeof (IOpportunityProduct);
                    DialogService.EntityID = id;
                    DialogService.ShowDialog();
                }
            }
            if (e.CommandName.Equals("Delete"))
            {
                Sage.Entity.Interfaces.IOpportunity mainentity = this.BindingSource.Current as Sage.Entity.Interfaces.IOpportunity;
                if (mainentity != null)
                {
                    IOpportunityProduct childEntity = null;
                    if((currentEntity != null) && (currentEntity is IOpportunityProduct))
                    {
                        childEntity = (IOpportunityProduct)currentEntity;
                    }
                    else if (id != null)
                    {
                        childEntity = Sage.Platform.EntityFactory.GetById<IOpportunityProduct>(id);
                    }
                    if (childEntity != null)
                    {
                        mainentity.Products.Remove(childEntity);
                        if ((childEntity.PersistentState & Sage.Platform.Orm.Interfaces.PersistentState.New) <= 0)
                        {
                            childEntity.Delete();
                        }

                        if (mainentity.Products.Count != 0)
                        {
                            double salesPotential = 0;
                            foreach (IOpportunityProduct oppProduct in mainentity.Products)
                            {
                                if (oppProduct.Sort > rowIndex + 1)
                                {
                                    oppProduct.Sort--; 
                                }
                                salesPotential = salesPotential + (double)oppProduct.ExtendedPrice.Value;
                            }
                            mainentity.SalesPotential = salesPotential;

                            // this save prevented the user from deleting rows in the products grid.  The first delete
                            // would work fine, but then the save caused the application to lose track of the entity
                            // object so the object information didn't match the information shown on the page.

                            //mainentity.Save();
                        }
                    }
                }
            }
        }
        grdProducts_refresh();
	}
	
	protected void grdProducts_refresh()
	{
		if (PageWorkItem != null)
        {
			IPanelRefreshService refresher = PageWorkItem.Services.Get<IPanelRefreshService>();
			if (refresher != null)
			{
				refresher.RefreshAll();
			}
			else
			{
				Response.Redirect(Request.Url.ToString());
			}
		}
	}
	
    protected void grdProducts_RowEditing(object sender, GridViewEditEventArgs e)
	{
		grdProducts.SelectedIndex = e.NewEditIndex;
	}
            
    protected void grdProducts_RowDeleting(object sender, GridViewDeleteEventArgs e)
	{
		grdProducts.SelectedIndex = -1;
	}

    public override Type EntityType
    {
	    get { return typeof(IOpportunity); }
    }

     private Sage.Platform.WebPortal.Binding.WebEntityListBindingSource _dtsProducts;
     /// <summary>
     /// Gets the DTS products.
     /// </summary>
     /// <value>The DTS products.</value>
     public Sage.Platform.WebPortal.Binding.WebEntityListBindingSource dtsProducts
     {
         get
         {
             if (_dtsProducts == null)
             {
                 _dtsProducts = new Sage.Platform.WebPortal.Binding.WebEntityListBindingSource(typeof(IOpportunityProduct),
                                                                                               EntityType
                                                                                               , "Products",
                                                                                               System.Reflection.MemberTypes.
                                                                                                   Property);
                 _dtsProducts.UseSmartQuery = true;
             }
             return _dtsProducts;
         }
     }

     void dtsProducts_OnCurrentEntitySet(object sender, EventArgs e)
     {
         if (Visible)
         {
             dtsProducts.SourceObject = BindingSource.Current;
             RegisterBindingsWithClient(dtsProducts);
         }
     }

     protected override void OnAddEntityBindings()
     {
         dtsProducts.Bindings.Add(new Sage.Platform.WebPortal.Binding.WebEntityListBinding("Products", grdProducts));
         dtsProducts.BindFieldNames = new String[]
                                          {
                                              "Id", "Sort", "Product", "Product.Family", "Program", "Price", "Discount",
                                              "CalculatedPrice", "Quantity", "ExtendedPrice", "Opportunity.ExchangeRate",
                                              "Opportunity.ExchangeRateCode"
                                          };
         BindingSource.OnCurrentEntitySet += new EventHandler(dtsProducts_OnCurrentEntitySet);
     }

    protected void cmdAdd_ClickAction(object sender, EventArgs e)
    {
        if (DialogService != null)
        {
            DialogService.SetSpecs(500, 1000, "AddOpportunityProduct");
            DialogService.ShowDialog();
        }
    }


    protected override void OnWireEventHandlers()
    {
        base.OnWireEventHandlers();
        cmdAdd.Click += new ImageClickEventHandler(cmdAdd_ClickAction);
    }

    protected override void OnFormBound()
    {
        object sender = this;
        EventArgs e = EventArgs.Empty;
        dtsProducts.Bind();

        SystemInformation si = SystemInformationRules.GetSystemInfo();
        DelphiStreamReader stream = new DelphiStreamReader(si.Data);
        TValueType type;
        if (stream.FindProperty("MultiCurrency", out type))
        {
            if (type.Equals(TValueType.vaTrue))
            {
                grdProducts.Columns[7].Visible = true;
            }
            else
            {
                grdProducts.Columns[7].Visible = false;
            }
        }

        base.OnFormBound();
    }

    /// <summary>
    /// Gets the smart part info.
    /// </summary>
    /// <param name="smartPartInfoType">Type of the smart part info.</param>
    /// <returns></returns>
    public override Sage.Platform.Application.UI.ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        ToolsSmartPartInfo tinfo = new ToolsSmartPartInfo();
        foreach (Control c in pnlOpportunityProducts_LTools.Controls)
        {
            tinfo.LeftTools.Add(c);
        }
        foreach (Control c in pnlOpportunityProducts_CTools.Controls)
        {
            tinfo.CenterTools.Add(c);
        }
        foreach (Control c in pnlOpportunityProducts_RTools.Controls)
        {
            tinfo.RightTools.Add(c);
        }
        return tinfo;
    }

    private int _grdOppProductsdeleteColumnIndex = -2;
    protected int grdOppProductsDeleteColumnIndex
    {
        get
        {
            if (_grdOppProductsdeleteColumnIndex == -2)
            {
                int bias = (grdProducts.ExpandableRows) ? 1 : 0;
                _grdOppProductsdeleteColumnIndex = -1;
                int colcount = 0;
                foreach (DataControlField col in grdProducts.Columns)
                {
                    ButtonField btn = col as ButtonField;
                    if (btn != null)
                    {
                        if (btn.CommandName == "Delete")
                        {
                            _grdOppProductsdeleteColumnIndex = colcount + bias;
                            break;
                        }
                    }
                    colcount++;
                }
            }
            return _grdOppProductsdeleteColumnIndex;
        }
    }

    protected void grdProducts_RowCreated(object sender, GridViewRowEventArgs e)
    {
        if (e.Row.RowType == DataControlRowType.DataRow)
        {
            IOpportunity entity = (IOpportunity)EntityContext.GetEntity();

            //Calculated (Opportunity Currency)
			Sage.SalesLogix.Web.Controls.Currency curr = (Sage.SalesLogix.Web.Controls.Currency) e.Row.Cells[7].Controls[1];
            curr.ExchangeRate = entity.ExchangeRate.GetValueOrDefault(1);
            curr.CurrentCode = entity.ExchangeRateCode;

            //Extended Price
			curr = (Sage.SalesLogix.Web.Controls.Currency) e.Row.Cells[9].Controls[1];
            curr.ExchangeRate = entity.ExchangeRate.GetValueOrDefault(1);
            curr.CurrentCode = entity.ExchangeRateCode;
        }
    }

    protected void grdProducts_RowDataBound(object sender, GridViewRowEventArgs e)
    {
        if (e.Row.RowType == DataControlRowType.DataRow)
        {
            if ((grdOppProductsDeleteColumnIndex >= 0) && (grdOppProductsDeleteColumnIndex < e.Row.Cells.Count))
            {
                TableCell cell = e.Row.Cells[grdOppProductsDeleteColumnIndex];
                foreach (Control c in cell.Controls)
                {
                    LinkButton btn = c as LinkButton;
                    if (btn != null)
					{
                        btn.Attributes.Add("onclick", "javascript: return confirm('" + GetLocalResourceObject("grdProductsConfrmation.ConfirmationMessage").ToString() + "');");
                        return;
                    }
                }
            }
        }
    }

    protected void grdProducts_Sorting(object sender, GridViewSortEventArgs e)
    {
    }
}