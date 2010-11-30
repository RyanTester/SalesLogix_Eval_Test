using System;
using System.Collections.Generic;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Globalization;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Data.OleDb;
using System.Linq;
using Sage.Platform.Application.Services;
using Sage.SalesLogix.WebUserOptions;
using Sage.SalesLogix;
using Sage.Platform.Application;
using Sage.SalesLogix.Plugins;
using Sage.Platform.Application.UI;
using Sage.Platform.Orm;
using Sage.SalesLogix.Client.GroupBuilder;
using Sage.SalesLogix.Entities;

/// <summary>
/// Group options are stored in useroptions under category DefaultGroup, name Entity name.  The lan default groups are stored under
/// category DefaultGroup, name MainviewFamily|MainViewName
/// </summary>
public partial class GroupTabOptionsPage : System.Web.UI.UserControl, ISmartPartInfoProvider
{
    /// <summary>
    /// Saves the options.
    /// </summary>
    /// <param name="sender">The sender.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void SaveOption(object sender, EventArgs e)
    {
        IUserOptionsService userOption = ApplicationContext.Current.Services.Get<IUserOptionsService>();
        userOption.SetCommonOption(DefaultGroupOptionName(), "DefaultGroup", GetFamNameFromId(ddlGroup.SelectedValue), false);
        userOption.SetCommonOption(DefaultGroupOptionName(), "LookupLayoutGroup", GetFamNameFromId(ddlLookupLayoutGroup.SelectedValue), false);
        var egis = GroupContext.GetGroupContext().EntityGroupInfos;
        if (egis != null)
        {
            foreach (var egi in egis)
                if (egi.EntityName.Equals(DefaultGroupOptionName(), StringComparison.OrdinalIgnoreCase))
                {
                    egi.ClearCache(true);
                    break;
                }
        }
        userOption.SetCommonOption("autoFitColumns", "GroupGridView",
                                   cbAutoFitColumns.Checked.ToString(CultureInfo.InvariantCulture), false);
    }

    private string GetFamNameFromId(string id)
    {
        System.Collections.Generic.IList<Plugin> GroupList = PluginManager.GetPluginList(PluginType.ACOGroup, true, false);
        foreach (Plugin grp in GroupList)
            if (grp.PluginId == id)
                return String.Format("{0}:{1}", grp.Family, grp.Name);
        GroupList = PluginManager.GetPluginList(PluginType.Group, true, false);
        foreach (Plugin grp in GroupList)
            if (grp.PluginId == id)
                return String.Format("{0}:{1}", grp.Family, grp.Name);
        return "";
    }

    /// <summary>
    /// Handles the PreRender event of the Page control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void Page_PreRender(object sender, EventArgs e)
    {
        string family = "ACCOUNT";
        if (ddlMainView.SelectedItem != null)
        {
            family = ddlMainView.SelectedItem.Value;
        }

        System.Collections.Generic.IList<Plugin> GroupList = PluginManager.GetPluginList(GroupInfo.GetGroupPluginType(family), true, false);
        for (int i = GroupList.Count - 1; i >= 0; i--)
        {
            if (GroupList[i].Family.ToLower() != family.ToLower())
            {
                GroupList.RemoveAt(i);
                continue;
            }
            if (String.IsNullOrEmpty(GroupList[i].DisplayName))
            {
                GroupList[i].DisplayName = GroupList[i].Name;
            }

        }

        /***** Name Collistion with Blob.PluginId *****************************************************/
        //ddlGroup.DataSource = GroupList;
        //ddlGroup.DataTextField = "DisplayName";
        //ddlGroup.DataValueField = "PluginId";
        //ddlGroup.DataBind();
        /*********************************************************************************************/
        ddlGroup.Items.Clear();
        ddlLookupLayoutGroup.Items.Clear();
        foreach (Plugin gl in GroupList)
        {
            ddlGroup.Items.Add(new ListItem(gl.DisplayName, gl.PluginId));
            ddlLookupLayoutGroup.Items.Add(new ListItem(gl.DisplayName, gl.PluginId));
        }

        IUserOptionsService userOption = ApplicationContext.Current.Services.Get<IUserOptionsService>();
        string defFamName = userOption.GetCommonOption(DefaultGroupOptionName(), "DefaultGroup");
        foreach (Plugin grp in GroupList)
            if ((grp.Family.ToLower() == defFamName.Split(':')[0].ToLower()) && (grp.Name == defFamName.Split(':')[1]))
                Utility.SetSelectedValue(ddlGroup, grp.PluginId);
        string defLayoutGroup = userOption.GetCommonOption(DefaultGroupOptionName(), "LookupLayoutGroup");
        defLayoutGroup = (string.IsNullOrEmpty(defLayoutGroup)) ? defFamName : defLayoutGroup;
        foreach (Plugin grp in GroupList)
            if ((grp.Family.ToLower() == defLayoutGroup.Split(':')[0].ToLower()) && (grp.Name == defLayoutGroup.Split(':')[1]))
                Utility.SetSelectedValue(ddlLookupLayoutGroup, grp.PluginId);

        bool autoFitColumns;
        string autoFitColumnsValue = userOption.GetCommonOption("autoFitColumns", "GroupGridView");
        if (!Boolean.TryParse(autoFitColumnsValue, out autoFitColumns))
            autoFitColumns = true;

        cbAutoFitColumns.Checked = autoFitColumns;
    }

    private string DefaultGroupOptionName()
    {
        //String MainView = ddlMainView.SelectedValue;
        //System.Collections.Generic.IList<Plugin> MainViewList = PluginManager.GetPluginList(PluginType.MainView, true, false);
        //foreach (Plugin mv in MainViewList)
        //    if (mv.DataCode.ToLower() == MainView.ToLower())
        //        return String.Format("{0}|{1}", mv.Family, mv.Name);
        //return "";
        return ddlMainView.SelectedValue;
    }

    /// <summary>
    /// Handles the Load event of the Page control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void Page_Load(object sender, EventArgs e)
    {
        btnSave.Click += SaveOption;
        SortedList MVList = new SortedList();
        AddFamiliesToList(ref MVList, PluginType.ACOGroup);
        AddFamiliesToList(ref MVList, PluginType.Group);
        ddlMainView.DataSource = MVList;
        ddlMainView.DataValueField = "Key";
        ddlMainView.DataTextField = "Value";
        ddlMainView.DataBind();
    }

    private static void AddFamiliesToList(ref SortedList MVList, PluginType aType)
    {
        System.Collections.Generic.IList<Plugin> aList = PluginManager.GetPluginList(aType, true, false);
        string EntityAssemblyqualifiedName = (typeof(Sage.SalesLogix.Entities.Account)).AssemblyQualifiedName;
        foreach (Plugin grp in aList)
        {
            string family = grp.Family;
            family = GroupInfo.GetEntityName(family);
            System.Type familytype = Type.GetType(EntityAssemblyqualifiedName.Replace("Account", family), false, true);
            if (familytype != null)
            {
                string famname = familytype.GetDisplayName();
                if (!MVList.ContainsKey(grp.Family) && !MVList.ContainsValue(famname))
                {
                    MVList.Add(grp.Family, famname);
                }
            }
        }
    }

    private static string CapFirst(string val)
    {
        if (string.IsNullOrEmpty(val))
            return string.Empty;
        return val.Substring(0, 1).ToUpper() + val.Substring(1).ToLower();
    }

    /// <summary>
    /// Gets the smart part info.
    /// </summary>
    /// <param name="smartPartInfoType">Type of the smart part info.</param>
    /// <returns></returns>
    public ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        Sage.Platform.WebPortal.SmartParts.ToolsSmartPartInfo tinfo = new Sage.Platform.WebPortal.SmartParts.ToolsSmartPartInfo();
        tinfo.Description = GetLocalResourceObject("PageDescription.Text").ToString();
        tinfo.Title = GetLocalResourceObject("PageDescription.Title").ToString();
        foreach (Control c in this.LitRequest_RTools.Controls)
        {
            tinfo.RightTools.Add(c);
        }
        return tinfo;
    }

}
