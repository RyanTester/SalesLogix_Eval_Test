using System;
using System.Data;
using System.Text;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using Sage.Platform.WebPortal.SmartParts;
using Sage.Platform.Application.UI;
using Sage.Entity.Interfaces;
using Sage.SalesLogix.Client.GroupBuilder;
using Sage.SalesLogix.CampaignTarget;
using Sage.Platform.Application;

/// <summary>
/// Summary description for CampaignTargetCreateGroup
/// </summary>
public partial class CampaignTargetCreateGroup : EntityBoundSmartPartInfoProvider 
{
    #region Public Methods

    /// <summary>
    /// Gets the type of the entity.
    /// </summary>
    /// <value>The type of the entity.</value>
    public override Type EntityType
    {
        get { return typeof(ICampaignTarget); }
    }

    protected override void OnFormBound()
    {
        ClientBindingMgr.RegisterDialogCancelButton(cmdCancel);
        base.OnFormBound();
    }

    /// <summary>
    /// Tries to retrieve smart part information compatible with type
    /// smartPartInfoType.
    /// </summary>
    /// <param name="smartPartInfoType">Type of information to retrieve.</param>
    /// <returns>
    /// The <see cref="T:Sage.Platform.Application.UI.ISmartPartInfo"/> instance or null if none exists in the smart part.
    /// </returns>
    public override ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        ToolsSmartPartInfo tinfo = new ToolsSmartPartInfo();
        if (BindingSource != null)
        {
            if (BindingSource.Current != null)
            {
                tinfo.Description = BindingSource.Current.ToString();
                tinfo.Title = BindingSource.Current.ToString();
            }
        }

        foreach (Control control in Controls)
        {
            SmartPartToolsContainer cont = control as SmartPartToolsContainer;
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

    #endregion

    /// <summary>
    /// Called when [add entity bindings].
    /// </summary>
    protected override void OnAddEntityBindings()
    {
    }

    /// <summary>
    /// Called when [wire event handlers].
    /// </summary>
    protected override void OnWireEventHandlers()
    {
        cmdCancel.Click += new EventHandler(DialogService.CloseEventHappened);
        base.OnWireEventHandlers();
    }

    protected override void OnClosing()
    {
        base.OnClosing();
        if (DialogService.DialogParameters.ContainsKey("TargetSelectedFilterState"))
            DialogService.DialogParameters.Remove("TargetSelectedFilterState");
    }

    /// <summary>
    /// Handles the OnClick event of the cmdOK control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void cmdOK_OnClick(object sender, EventArgs e)
    {
        if (string.IsNullOrEmpty(txtGroupName.Text))
        {
            DialogService.ShowMessage(GetLocalResourceObject("error_NoGroupName").ToString());
            return;
        }
        if (DialogService.DialogParameters.Count > 0)
        {
            if (DialogService.DialogParameters.ContainsKey("TargetSelectedFilterState"))
            {
                string groupId = String.Empty;
                TargetSelectedFilterState filterState = DialogService.DialogParameters["TargetSelectedFilterState"] as TargetSelectedFilterState;
                TargetsViewDataSource ds = new TargetsViewDataSource();
                string targetIds = null;
                ds.SelectedFilterState = filterState; 
                if (lbxGroupType.SelectedValue.ToString().Equals("Contact"))
                {
                    filterState.IncludeContacts = true;
                    filterState.IncludeLeads = false;
                }
                else
                {
                    filterState.IncludeContacts = false;
                    filterState.IncludeLeads = true;
                }
                
                if (rdgGroupMembers.SelectedIndex == 0)//Get alls targets.
                    targetIds = ConvertToString(ds.GetEntityIds(false));
                else //Get selected targets.
                    targetIds = ConvertToString(ds.GetEntityIds(true));
                if (!string.IsNullOrEmpty(targetIds))
                {
                    groupId = GroupInfo.CreateAdHocGroup(targetIds, lbxGroupType.SelectedValue.ToString(), txtGroupName.Text);
                }
                else
                {
                    throw new ValidationException(String.Format(GetLocalResourceObject("error_NoTargetsFound").ToString(), lbxGroupType.SelectedValue));
                }
                
                if (!String.IsNullOrEmpty(groupId))
                {
                    if (lbxGroupType.SelectedValue.ToString().Equals("Contact"))
                    {
                        Response.Redirect(string.Format("Contact.aspx?gid={0}", groupId));
                    }
                    else
                    {
                        Response.Redirect(string.Format("Lead.aspx?gid={0}", groupId));
                    }
                }
            }
            else
            {
                DialogService.ShowMessage(GetLocalResourceObject("error_NoDataSourceFound").ToString());
            }
            DialogService.CloseEventHappened(sender, e);
            Refresh();
        }
    }

    /// <summary>
    /// Handles the OnClick event of the cmdCancel control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void cmdCancel_OnClick(object sender, EventArgs e)
    {
        DialogService.CloseEventHappened(sender, e);
    }

    /// <summary>
    /// Converts to string.
    /// </summary>
    /// <param name="targetIdsObjArry">The target ids obj arry.</param>
    /// <returns></returns>
    private string ConvertToString(object[] targetIdsObjArry)
    {
        StringBuilder sb = new StringBuilder();
        if (targetIdsObjArry != null)
        {
            if (targetIdsObjArry != null)
            {
                foreach (object Id in targetIdsObjArry)
                {
                    sb.AppendFormat("{0},", Id.ToString());
                }
                sb.Remove(sb.Length - 1, 1);
            }
        }
        else
        {
            DialogService.ShowMessage(GetLocalResourceObject("error_NoDataSourceFound").ToString());
        }
        return  sb.ToString();
    }

    /// <summary>
    /// Gets a comma delimited list of all target ids.
    /// </summary>
    /// <param name="targets">The targets.</param>
    /// <returns></returns>
    private String GetListOfAllTargetIds(DataTable targets)
    {
        string targetIds = string.Empty;
        if (targets != null)
        {
            DataRow[] rows = targets.Select(String.Format("TargetType='{0}'", lbxGroupType.SelectedValue.ToString()));
            foreach (DataRow row in rows)
            {
                targetIds += String.Format("{0},", row["EntityId"]);
            }
        }
        return targetIds.Remove(targetIds.Length - 1);
    }

    /// <summary>
    /// Gets a comma delimited list of selected target ids.
    /// </summary>
    /// <param name="targets">The targets.</param>
    /// <returns></returns>
    private String GetListOfSelectedTargetIds(DataTable targets)
    {
        string targetIds = string.Empty;
        if (targets != null)
        {
            DataRow[] rows = targets.Select("Selected=True");
            foreach (DataRow row in rows)
            {
                if (row["TargetType"].Equals(lbxGroupType.SelectedValue.ToString()))
                    targetIds += String.Format("{0},", row["EntityId"]);
            }
        }
        return targetIds.Remove(targetIds.Length - 1);
    }
}
