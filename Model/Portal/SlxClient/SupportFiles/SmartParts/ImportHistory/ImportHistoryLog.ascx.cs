using System;
using System.Collections;
using System.Configuration;
using System.Data;
using System.Drawing;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Collections.Generic;
using Sage.Entity.Interfaces;
using Sage.SalesLogix.Services.Import;
using Sage.Platform.WebPortal.SmartParts;
using Sage.Platform.Application.UI;
using Sage.SalesLogix.Web.Controls;
using Sage.Platform.Repository;
using Sage.Platform;

public partial class SmartParts_ImportHistory_ImportHistoryLog : EntityBoundSmartPartInfoProvider 
{
    /// <summary>
    /// Gets the type of the entity.
    /// </summary>
    /// <value>The type of the entity.</value>
    public override Type EntityType
    {
        get { return typeof(Sage.Entity.Interfaces.IImportHistory); }
    }

    /// <summary>
    /// Override this method to add bindings to the currrently bound smart part
    /// </summary>
    protected override void OnAddEntityBindings()
    {
    }

    /// <summary>
    /// Called when the smartpart has been bound.  Derived components should override this method to run code that depends on entity context being set and it not changing.
    /// </summary>
    protected override void OnFormBound()
    {
        base.OnFormBound();
        LoadForm();
    }

    /// <summary>
    /// Handles the Load event of the Page control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void Page_Load(object sender, EventArgs e)
    { 
    }

    /// <summary>
    /// Handles the OnPageIndexChanging event of the grdHistoryLog control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewPageEventArgs"/> instance containing the event data.</param>
    protected void grdHistoryLog_OnPageIndexChanging(object sender, GridViewPageEventArgs e)
    {
        grdHistoryLog.PageIndex = e.NewPageIndex;
    }

    /// <summary>
    /// Gets the smart part info.
    /// </summary>
    /// <param name="smartPartInfoType">Type of the smart part info.</param>
    /// <returns></returns>
    public override ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        ToolsSmartPartInfo tinfo = new ToolsSmartPartInfo();

        foreach (Control c in Controls)
        {
            SmartPartToolsContainer cont = c as SmartPartToolsContainer;
            if (cont != null)
            {
                switch (cont.ToolbarLocation)
                {
                    case SmartPartToolsLocation.Right:
                        foreach (Control tool in cont.Controls)
                        {
                            tinfo.RightTools.Add(tool);
                        }
                        break;
                    case SmartPartToolsLocation.Center:
                        foreach (Control tool in cont.Controls)
                        {
                            tinfo.CenterTools.Add(tool);
                        }
                        break;
                    case SmartPartToolsLocation.Left:
                        foreach (Control tool in cont.Controls)
                        {
                            tinfo.LeftTools.Add(tool);
                        }
                        break;
                }
            }
        }
        return tinfo;
    }

    /// <summary>
    /// Handles the OnRowDataBound event of the grdHistoryLog control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.GridViewRowEventArgs"/> instance containing the event data.</param>
    protected void grdHistoryLog_OnRowDataBound(object sender, GridViewRowEventArgs e)
    {
        if (e.Row.RowType == DataControlRowType.DataRow)
        {
            IImportHistoryItem item = (IImportHistoryItem)e.Row.DataItem;
            DateTimePicker dtpCreateDate = (DateTimePicker)e.Row.FindControl("dtpCreateDate");
            if (dtpCreateDate != null)
            {
                if (item.CreateDate != null)
                {
                    dtpCreateDate.DateTimeValue = (DateTime)item.CreateDate;
                }
                else
                {
                    dtpCreateDate.DateTimeValue = DateTime.MinValue;
                    dtpCreateDate.Text = string.Empty;
                }
            }
            Label lblItemType = (Label)e.Row.FindControl("lblItemType");
            if (lblItemType != null)
            {
                try
                {
                    if (item.ItemType.Equals("DUPLICATE"))
                        lblItemType.Text = GetLocalResourceObject("itemType.Duplicate").ToString();
                    if (item.ItemType.Equals("ERROR"))
                        lblItemType.Text = GetLocalResourceObject("itemType.Error").ToString();
                    if (item.ItemType.Equals("WARNING"))
                        lblItemType.Text = GetLocalResourceObject("itemType.Waring").ToString();
                    if (item.ItemType.Equals("MERGED"))
                        lblItemType.Text = GetLocalResourceObject("itemType.Merged").ToString();
                    if (item.ItemType.Equals("INFO"))
                        lblItemType.Text = GetLocalResourceObject("itemType.Info").ToString();
                }
                catch (Exception)
                {
                    lblItemType.Text = item.ItemType;
                }
            }

            CheckBox chkIsResolved = (CheckBox)e.Row.FindControl("chkIsResolved");
            if (chkIsResolved != null)
            {
                chkIsResolved.Enabled = false;
                chkIsResolved.Checked = Convert.ToBoolean(item.IsResolved);
            }

            HyperLink linkGotoResolved = (HyperLink)e.Row.FindControl("linkGotoResolved");
            if (linkGotoResolved != null)
            {
                if (Convert.ToBoolean(item.IsResolved))
                {
                    linkGotoResolved.NavigateUrl = GetNavagationURL(item);
                    linkGotoResolved.Text = GetLocalResourceObject("GoTo").ToString();
                }
                else
                {
                    linkGotoResolved.NavigateUrl = string.Empty;
                    linkGotoResolved.Text = string.Empty;
                }
            }
            DateTimePicker dtpResolvedDate = (DateTimePicker)e.Row.FindControl("dtpResolvedDate");
            if (dtpResolvedDate != null)
            {
                if (item.ResolvedDate != null)
                {
                    dtpResolvedDate.DateTimeValue = (DateTime)item.ResolvedDate;
                }
                else
                {
                    dtpResolvedDate.DateTimeValue = DateTime.MinValue;
                    dtpResolvedDate.Text = string.Empty;
                }
            }
        }
    }

    /// <summary>
    /// Gets the navagation URL.
    /// </summary>
    /// <param name="item">The item.</param>
    /// <returns></returns>
    private string GetNavagationURL(IImportHistoryItem item)
    {
        string url = string.Empty;
        url = string.Format("~/{0}.aspx?entityId={1}", GetEntityPageName(item.ResolveEntityType), item.ResolveReferenceId);
        return url;
    }

    /// <summary>
    /// Gets the name of the entity page.
    /// </summary>
    /// <param name="entityType">Type of the entity.</param>
    /// <returns></returns>
    private string GetEntityPageName(string entityType)
    {
        string name = string.Empty;
        if(entityType.Equals("ILead"))
            name = GetLocalResourceObject("LeadEntityName").ToString();
        if (entityType.Equals("IContact"))
            name = name = GetLocalResourceObject("ContactEntityName").ToString();
        return name;
    }

    /// <summary>
    /// Gets the name of the entity.
    /// </summary>
    /// <param name="entityType">Type of the entity.</param>
    /// <returns></returns>
    private string GetEntityName(string entityType)
    {
        string name = string.Empty;
        if (entityType.Equals("ILead"))
            name = "Lead";
        if (entityType.Equals("IContact"))
            name = "Contact";
        return name;
    }

    /// <summary>
    /// Loads the form.
    /// </summary>
    private void LoadForm()
    {
        IImportHistory importHistory = BindingSource.Current as IImportHistory;
        if (importHistory != null)
        {
            grdHistoryLog.DataSource = GetHistoryItems(importHistory, "", "CreateDate", true); //importHistory.ImportHistoryItems;
            grdHistoryLog.DataBind();
        }
    }

    private IList<IImportHistoryItem> GetHistoryItems(IImportHistory importHistory, string itemType, string sortField, bool ascending)
    {
        IList<IImportHistoryItem> items = null;
        IRepository<IImportHistoryItem> repItems = EntityFactory.GetRepository<IImportHistoryItem>();
        IQueryable qryItems = (IQueryable)repItems;
        IExpressionFactory expItems = qryItems.GetExpressionFactory();
        Sage.Platform.Repository.ICriteria critItems = qryItems.CreateCriteria();
        critItems.Add(expItems.Eq("ImportHistoryId", importHistory.Id));
        if(!string.IsNullOrEmpty(itemType))
        {
          critItems.Add(expItems.Eq("ItemType", itemType));
        }
        if (!String.IsNullOrEmpty(sortField))
        {
            if (ascending)
            {
                critItems.AddOrder(expItems.Asc(sortField));
            }
            else
            {
                critItems.AddOrder(expItems.Desc(sortField));
            }
        }
                
        items = critItems.List<IImportHistoryItem>();
        return items;                                       

    }


    

}
