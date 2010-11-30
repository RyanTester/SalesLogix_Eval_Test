using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Reflection;
using System.Text;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using Sage.Common.Syndication.Json;
using Sage.Platform.Application;
using Sage.Platform.Application.UI;
using Sage.Platform.Orm;
using Sage.Platform.WebPortal;
using Sage.Platform.WebPortal.Workspaces;
using Sage.Platform.Orm.Attributes;
using Sage.SalesLogix.Client.GroupBuilder;

public partial class SmartParts_TaskPane_GroupList_GroupListTasklet : System.Web.UI.UserControl, ISmartPartInfoProvider
{
    private string _columnAlias = "";
    private string _keyAlias = "";
    private string _columnDisplayName = "";
    private string _entityDisplayName = "";
    private string _entityName = "";

    public class ClientResourcesRepresentation
    {
        private SmartParts_TaskPane_GroupList_GroupListTasklet _control;
        public ClientResourcesRepresentation(SmartParts_TaskPane_GroupList_GroupListTasklet control)
        {
            _control = control;
        }

        public string LoadingMsg
        {
            get { return _control.GetLocalResourceObject("LoadingMsg") as string; }
        }
        public string WaitMsg
        {
            get { return _control.GetLocalResourceObject("WaitMsg") as string; }
        }
    }

    public string ColumnAlias
    {
        get { return _columnAlias; }
        set { _columnAlias = value; }
    }

    public string ColumnDisplayName
    {
        get { return _columnDisplayName; }
        set { _columnDisplayName = value; }
    }

    private IGroupContextService _groupContext;
    [ServiceDependency]
    public IGroupContextService GroupContext
    {
        get { return _groupContext; }
        set { _groupContext = value; }
    }

    public string KeyAlias
    {
        get { return _keyAlias; }
        set { _keyAlias = value; }
    }

    public string EntityDisplayName
    {
        get { return _entityDisplayName; }
        set { _entityDisplayName = value; }
    }

    public string EntityName
    {
        get { return _entityName; }
        set { _entityName = value; }
    }

    protected override void OnInit(EventArgs e)
    {
        base.OnInit(e);

        if (Parent is TaskPaneItem)
            ((TaskPaneItem)Parent).CssClass = "group-list";
    }

    protected void Page_Load(object sender, EventArgs e)
    {
        EntityPage entityPage = Page as EntityPage;
        if (entityPage != null)
        {
            Type entityType = Type.GetType(entityPage.EntityTypeName);

            object[] temp = entityType.GetCustomAttributes(true);
            object[] entityArAttributes = entityType.GetCustomAttributes(typeof(ActiveRecordAttribute), true);
            if (entityArAttributes.Length > 0)
            {
                ActiveRecordAttribute arAttribute = (ActiveRecordAttribute)entityArAttributes[0];
                EntityDisplayName = arAttribute.Table;

                KeyAlias = GroupInfo.GetTableKeyField(arAttribute.Table);
                ColumnAlias = KeyAlias;
                ColumnDisplayName = KeyAlias;
            }

            EntityDisplayName = entityType.GetPluralDisplayName();

            object[] entityDisplayAttributes = entityType.GetCustomAttributes(typeof(DisplayValuePropertyNameAttribute), true);
            if (entityDisplayAttributes.Length > 0)
            {
                DisplayValuePropertyNameAttribute displayAttribute = (DisplayValuePropertyNameAttribute)entityDisplayAttributes[0];
                PropertyInfo displayProperty = entityType.GetProperty(displayAttribute.PropertyName);
                if (displayProperty != null)
                {
                    object[] propertyAttributes = displayProperty.GetCustomAttributes(typeof(FieldAttribute), true);
                    if (propertyAttributes.Length > 0)
                    {
                        FieldAttribute fieldAttribute = (FieldAttribute)propertyAttributes[0];
                        ColumnAlias = fieldAttribute.Field.ToUpper();
                        ColumnDisplayName = fieldAttribute.Field.ToUpper();
                    }
                }
            }
        }

        StringBuilder resources = new StringBuilder();
        resources.AppendFormat("Sage.TaskPane.GroupListTasklet.Resources = {0};", JavaScriptConvert.SerializeObject(new ClientResourcesRepresentation(this)));

        ScriptManager.RegisterStartupScript(Page, typeof(Page), "taskpane-grouplist-resources", resources.ToString(), true);

        /*
        ScriptManager.RegisterClientScriptInclude(Page, typeof(Control), "Ext_BufferedGridView", ResolveUrl("~/Libraries/Ext/ux/widgets/grid/BufferedGridView.js"));
        ScriptManager.RegisterClientScriptInclude(Page, typeof(Control), "Ext_BufferedRowSelectionModel", ResolveUrl("~/Libraries/Ext/ux/widgets/grid/BufferedRowSelectionModel.js"));
        ScriptManager.RegisterClientScriptInclude(Page, typeof(Control), "Ext_BufferedStore", ResolveUrl("~/Libraries/Ext/ux/widgets/grid/BufferedStore.js"));
        ScriptManager.RegisterClientScriptInclude(Page, typeof(Control), "Ext_BufferedGridToolbar", ResolveUrl("~/Libraries/Ext/ux/widgets/BufferedGridToolbar.js"));
        ScriptManager.RegisterClientScriptInclude(Page, typeof(Control), "Ext_BufferedJsonReader", ResolveUrl("~/Libraries/Ext/ux/data/BufferedJsonReader.js"));
        */
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
        foreach (Control c in GroupListTasklet_RTools.Controls)
        {
            tinfo.RightTools.Add(c);
        }
        return tinfo;
    }
}
