using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Text;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Xml;
using Sage.Platform.Application;
using Sage.Platform.Application.UI;
using Sage.Platform.WebPortal.Services;
using Sage.Platform.WebPortal.Workspaces;
using Sage.SalesLogix.Client.GroupBuilder;
using Sage.Common.Syndication.Json;

public partial class SmartParts_TaskPane_Filters_FiltersTasklet : System.Web.UI.UserControl, ISmartPartInfoProvider
{
    public class ClientResourcesRepresentation
    {
        private SmartParts_TaskPane_Filters_FiltersTasklet _control;
        public string ShowMore
        {
            get { return _control.GetLocalResourceObject("ShowMore") as string; }
        }
        public string ShowAll
        {
            get { return _control.GetLocalResourceObject("ShowAll") as string; }
        }
        public string SelectAll
        {
            get { return _control.GetLocalResourceObject("SelectAll") as string; }
        }
        public string ClearAll
        {
            get { return _control.GetLocalResourceObject("ClearAll") as string; }
        }
        public string DialogMessage
        {
            get { return _control.GetLocalResourceObject("DialogMessage") as string; }
        }
        public string DialogOK
        {
            get { return _control.GetLocalResourceObject("DialogOK") as string; }
        }
        public string DialogCancel
        {
            get { return _control.GetLocalResourceObject("DialogCancel") as string; }
        }
        public string DialogTitle
        {
            get { return _control.GetLocalResourceObject("DialogTitle") as string; }
        }
        public string UndoFilters
        {
            get { return _control.GetLocalResourceObject("UndoFilters") as string; }   
        }
        public string NullText
        {
            get { return _control.GetLocalResourceObject("NullText") as string; }   
        }
        public string BlankText
        {
            get { return _control.GetLocalResourceObject("BlankText") as string; }
        }
        public ClientResourcesRepresentation(SmartParts_TaskPane_Filters_FiltersTasklet control)
        {
            _control = control;
        }
    }
    public class FilterItem
    {
        private string _name;
        private string _alias;
        private bool _hidden;

        public string Name
        {
            get { return _name; }
            set { _name = value; }
        }

        public string Alias
        {
            get { return _alias; }
            set { _alias = value; }
        }

        public bool Hidden
        {
            get { return _hidden; }
            set { _hidden = value; }
        }

        public FilterItem()
        {

        }
    }

    private List<string> _hiddenFilters = new List<string>();

    private IGroupContextService _groupContext;
    [ServiceDependency]
    public IGroupContextService GroupContext
    {
        get { return _groupContext; }
        set { _groupContext = value; }
    }

    private void RestoreState()
    {
        try
        {
            UIStateService service = new UIStateService();

            GroupContext group = GroupContext.GetGroupContext();
            if (group != null && !String.IsNullOrEmpty(GroupContext.CurrentGroupID))
            {
                GroupInfo info = GroupContext.GetGroupContext().CurrentGroupInfo.CurrentGroup.GroupInformation;

                string family = info.Entity.ToLower();
                string name = info.GroupName.ToLower();
                string data = service.GetTaskletState(ID, "hidden:" + family + "-" + name);
                if (data != null)
                    _hiddenFilters = new List<string>(JavaScriptConvert.DeserializeObject<string[]>(data));
            }
        } 
        catch { }
    }

    private List<FilterItem> CreateFilterItems()
    {
        try
        {            
            GroupInfo info = GroupContext.GetGroupContext().CurrentGroupInfo.CurrentGroup.GroupInformation;
            GroupLayout layout = info.GetGroupLayout();

            List<FilterItem> items = new List<FilterItem>();
            foreach (GroupLayoutItem layoutItem in layout.Items)
            {
                if (!layoutItem.IsFilterable)
                    continue;

                FilterItem item = new FilterItem();
                item.Name = layoutItem.Caption;
                item.Alias = layoutItem.Alias;
                item.Hidden = _hiddenFilters.Contains(layoutItem.Alias);
                items.Add(item);
            }

            return items;
        }
        catch
        {
            return new List<FilterItem>();
        }
    }

    protected override void OnInit(EventArgs e)
    {
        base.OnInit(e);

        if (Parent is TaskPaneItem)
            ((TaskPaneItem)Parent).CssClass = "filter-tasklet";
    }

    protected void Page_Load(object sender, EventArgs e)
    {
        RestoreState();

        GroupInfo info = new GroupInfo();
        info.GroupID = GroupContext.CurrentGroupID;

        items.DataSource = CreateFilterItems();
        items.DataBind();

        StringBuilder resources = new StringBuilder();
        resources.AppendFormat("Sage.TaskPane.FiltersTasklet.Resources = {0};", JavaScriptConvert.SerializeObject(new ClientResourcesRepresentation(this)));

        ScriptManager.GetCurrent(Page).Scripts.Add(new ScriptReference("~/SmartParts/TaskPane/Filters/FiltersTasklet.js"));
        ScriptManager.RegisterStartupScript(Page, typeof(Page), "taskpane-filters-resources", resources.ToString(), true);
    }

    /// <summary>
    /// Tries to retrieve smart part information compatible with type
    /// smartPartInfoType.
    /// </summary>
    /// <param name="smartPartInfoType">Type of information to retrieve.</param>
    /// <returns>
    /// The <see cref="T:Sage.Platform.Application.UI.ISmartPartInfo"/> instance or null if none exists in the smart part.
    /// </returns>
    public virtual ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        Sage.Platform.WebPortal.SmartParts.ToolsSmartPartInfo tinfo = new Sage.Platform.WebPortal.SmartParts.ToolsSmartPartInfo();
        foreach (Control c in FiltersTasklet_RTools.Controls)
        {
            tinfo.RightTools.Add(c);
        }
        return tinfo;
    }
}
