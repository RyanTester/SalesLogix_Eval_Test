using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Collections.Generic;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using Sage.Platform.WebPortal.SmartParts;
using Sage.SalesLogix.Web.Controls;
using NHibernate;
using Sage.Platform.Security;
using Sage.SalesLogix.Security;
using Sage.Platform.Application;
using Sage.Platform.Orm;
using Sage.Platform;
using Sage.Entity.Interfaces;
using Sage.SalesLogix.Association;
using Sage.SalesLogix.HighLevelTypes;
using Sage.SalesLogix.Entities;
using Sage.Platform.WebPortal;



public partial class SmartParts_Association_AccountAssociations : EntityBoundSmartPartInfoProvider //EntityBoundSmartPart //System.Web.UI.UserControl
{
    private IEntityContextService _EntityService;
    [ServiceDependency(Type = typeof(IEntityContextService), Required = true)]
    public IEntityContextService EntityService
    {
        get
        {
            return _EntityService;
        }
        set
        {
            _EntityService = value;
        }
    }
    
    public override Type EntityType
    {
        get { return typeof(Sage.Entity.Interfaces.IAccount); }
    }

    protected override void OnAddEntityBindings()
    {


    }

    protected override void InnerPageLoad(object sender, EventArgs e)
    {
        
    }

    protected override void OnWireEventHandlers()
    {
        btnAddAssociation.Click += new ImageClickEventHandler(btnAddAssociation_ClickAction);
        AccountAssociations_Grid.PageIndexChanging += new GridViewPageEventHandler(AccountAssociations_Grid_PageIndexChanging);
        base.OnWireEventHandlers();
    }

    protected override void OnFormBound()
    {
        base.OnFormBound();
        LoadGrid();
    }

    public override Sage.Platform.Application.UI.ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        Sage.Platform.WebPortal.SmartParts.ToolsSmartPartInfo tinfo = new Sage.Platform.WebPortal.SmartParts.ToolsSmartPartInfo();
        if (this.BindingSource != null)
        {
            if (this.BindingSource.Current != null)
            {
                //tinfo.Description = this.BindingSource.Current.ToString();
                //tinfo.Title = this.BindingSource.Current.ToString();
            }
        }
        foreach (Control c in this.AccountAssociations_LTools.Controls)
        {
            tinfo.LeftTools.Add(c);
        }
        foreach (Control c in this.AccountAssociations_CTools.Controls)
        {
            tinfo.CenterTools.Add(c);
        }
        foreach (Control c in this.AccountAssociations_RTools.Controls)
        {
            tinfo.RightTools.Add(c);
        }
        return tinfo;
    }
    protected void btnAddAssociation_ClickAction(object sender, EventArgs e)
    {
        if (DialogService != null)
        {
            DialogService.SetSpecs(200, 200, 250, 600, "AddEditAccountAssociation", "", true);
            DialogService.EntityType = typeof(Sage.Entity.Interfaces.IAssociation);
            DialogService.ShowDialog();
        }
    }

    private int _deleteColumnIndex = -2;
    protected int DeleteColumnIndex
    {
        get
        {
            if (_deleteColumnIndex == -2)
            {
                int bias = (AccountAssociations_Grid.ExpandableRows) ? 1 : 0;
                _deleteColumnIndex = -1;
                int colcount = 0;
                foreach (DataControlField col in AccountAssociations_Grid.Columns)
                {
                    ButtonField btn = col as ButtonField;
                    if (btn != null)
                    {
                        if (btn.CommandName == "Delete")
                        {
                            _deleteColumnIndex = colcount + bias;
                            break;
                        }
                    }
                    colcount++;
                }
            }
            return _deleteColumnIndex;
        }

    }
    
    protected void AccountAssociations_Grid_RowDataBound(object sender, GridViewRowEventArgs e)
    {
        if (e.Row.RowType == DataControlRowType.DataRow)
        {
            // Get the LinkButton control for the Delete 
            if ((DeleteColumnIndex >= 0) && (DeleteColumnIndex < e.Row.Cells.Count))
            {
                TableCell cell = e.Row.Cells[DeleteColumnIndex];
                foreach (Control c in cell.Controls)
                {
                    LinkButton btn = c as LinkButton;
                    if (btn != null)
                    {
                        btn.Attributes.Add("onclick", "javascript: return confirm('" + PortalUtil.JavaScriptEncode(GetLocalResourceObject("ConfirmMessage").ToString()) + "');");
                        return;
                    }
                }
            }
        }
    }
    protected void AccountAssociations_Grid_RowCommand(object sender, GridViewCommandEventArgs e)
    {
        if (e.CommandName.Equals("Edit"))
        {
            int rowIndex = Convert.ToInt32(e.CommandArgument);
            string id = AccountAssociations_Grid.DataKeys[rowIndex].Value.ToString();
            if (DialogService != null)
            {
                DialogService.SetSpecs(200, 200, 250, 600, "AddEditAccountAssociation", "", true);
                DialogService.EntityType = typeof(Sage.Entity.Interfaces.IAssociation);
                DialogService.EntityID = id;
                DialogService.ShowDialog();
            }
        }
        if (e.CommandName.Equals("Delete"))
        {
            int rowIndex = Convert.ToInt32(e.CommandArgument);
            string Id = AccountAssociations_Grid.DataKeys[rowIndex].Value.ToString();
            IAssociation assoc = EntityFactory.GetById<IAssociation>(Id);
            assoc.Delete();
            LoadGrid();
        }
    }

    protected void AccountAssociations_Grid_RowEditing(object sender, GridViewEditEventArgs e)
    {
        AccountAssociations_Grid.SelectedIndex = e.NewEditIndex;
    }
    protected void AccountAssociations_Grid_RowDeleting(object sender, GridViewDeleteEventArgs e)
    {
        
    }

    protected void AccountAssociations_Grid_PageIndexChanging(object sender, GridViewPageEventArgs e)
    {
        AccountAssociations_Grid.PageIndex = e.NewPageIndex;
    }

    private void LoadGrid()
    {
        string accountId = EntityService.EntityID.ToString();
        IAccount account = EntityFactory.GetRepository<IAccount>().FindFirstByProperty("Id", accountId);
        IList<AccountAssociation> accountAssocList = Sage.SalesLogix.Association.AssociationBusinessRules.GetAccountAssociations(account);
        AccountAssociations_Grid.DataSource = accountAssocList;
        AccountAssociations_Grid.DataBind();
    }
}
