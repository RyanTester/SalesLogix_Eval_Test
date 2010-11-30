using System;
using System.Collections.Generic;
using System.Web.UI;
using System.Web.UI.WebControls;
using Sage.Platform.Application;
using Sage.Platform;
using Sage.Entity.Interfaces;
using Sage.Platform.WebPortal.SmartParts;
using Sage.SalesLogix.Entities;
using Sage.Platform.WebPortal;


public partial class SmartParts_Association_ContactAssociations : EntityBoundSmartPartInfoProvider //System.Web.UI.UserControl
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
    

    protected override void OnAddEntityBindings()
    {
        
    }
    
    public override Type EntityType
    {
        get { return typeof(Sage.Entity.Interfaces.IContact); }
    }
    
    protected override void InnerPageLoad(object sender, EventArgs e)
    {
        
    }
    protected override void OnWireEventHandlers()
    {
        btnAddAssociation.Click += new ImageClickEventHandler(btnAddAssociation_ClickAction);
        ContactAssociations_Grid.PageIndexChanging += new GridViewPageEventHandler(ContactAssociations_Grid_PageIndexChanging);
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
        foreach (Control c in this.ContactAssociations_LTools.Controls)
        {
            tinfo.LeftTools.Add(c);
        }
        foreach (Control c in this.ContactAssociations_CTools.Controls)
        {
            tinfo.CenterTools.Add(c);
        }
        foreach (Control c in this.ContactAssociations_RTools.Controls)
        {
            tinfo.RightTools.Add(c);
        }
        return tinfo;
    }
    protected void btnAddAssociation_ClickAction(object sender, EventArgs e)
    {
        if (DialogService != null)
        {
            DialogService.SetSpecs(200, 200, 250, 600, "AddEditContactAssociation", "", true);
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
                int bias = (ContactAssociations_Grid.ExpandableRows) ? 1 : 0;
                _deleteColumnIndex = -1;
                int colcount = 0;
                foreach (DataControlField col in ContactAssociations_Grid.Columns)
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
    protected void ContactAssociations_Grid_RowDataBound(object sender, GridViewRowEventArgs e)
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

    protected void ContactAssociations_Grid_RowCommand(object sender, GridViewCommandEventArgs e)
    {
        if (e.CommandName.Equals("Edit"))
        {
            int rowIndex = Convert.ToInt32(e.CommandArgument);
            string id = ContactAssociations_Grid.DataKeys[rowIndex].Value.ToString();
            if (DialogService != null)
            {
                DialogService.SetSpecs(200, 200, 250, 600, "AddEditContactAssociation", "", true);
                DialogService.EntityType = typeof(Sage.Entity.Interfaces.IAssociation);
                DialogService.EntityID = id;
                DialogService.ShowDialog();
            }
        }
        if (e.CommandName.Equals("Delete"))
        {
            int rowIndex = Convert.ToInt32(e.CommandArgument);
            string Id = ContactAssociations_Grid.DataKeys[rowIndex].Value.ToString();
            IAssociation assoc = EntityFactory.GetById<IAssociation>(Id);
            assoc.Delete();
            LoadGrid();
            
        }
    }

    protected void ContactAssociations_Grid_RowEditing(object sender, GridViewEditEventArgs e)
    {
        ContactAssociations_Grid.SelectedIndex = e.NewEditIndex;
    }

    protected void ContactAssociations_Grid_RowDeleting(object sender, GridViewDeleteEventArgs e)
    {
        
    }
    protected void ContactAssociations_Grid_PageIndexChanging(object sender, GridViewPageEventArgs e)
    {
        ContactAssociations_Grid.PageIndex = e.NewPageIndex;
    }
    private void LoadGrid()
    {

        string contactId = EntityService.EntityID.ToString();
        IContact contact = EntityFactory.GetRepository<IContact>().FindFirstByProperty("Id", contactId);
        IList<ContactAssociation> contactAssocList = Sage.SalesLogix.Association.AssociationBusinessRules.GetContactAssociations(contact);
        ContactAssociations_Grid.DataSource = contactAssocList;
        ContactAssociations_Grid.DataBind();
    }
    

}
