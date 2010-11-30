using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Xml;
using Sage.Entity.Interfaces;
using Sage.Platform;
using Sage.Platform.Application;
using Sage.Platform.Application.UI;
using Sage.Platform.WebPortal;
using Sage.Platform.WebPortal.Services;
using Sage.SalesLogix.Client.GroupBuilder;
using Sage.SalesLogix.Client.Reports;
using Sage.SalesLogix.Web.SelectionService;
using Sage.SalesLogix.SelectionService;
using Sage.SalesLogix.Web.Controls;

public partial class SmartParts_TaskPane_CommonTasks_CommonTasksTasklet : System.Web.UI.UserControl, ISmartPartInfoProvider
{
    #region Initialize Items

    private IWebDialogService _WebDialogService;
    /// <summary>
    /// Gets or sets the dialog service.
    /// </summary>
    /// <value>The dialog service.</value>
    [ServiceDependency]
    public IWebDialogService DialogService
    {
        get { return _WebDialogService; }
        set { _WebDialogService = value; }
    }

    private IEntityContextService _entityService;
    /// <summary>
    /// Gets or sets the entity service.
    /// </summary>
    /// <value>The entity service.</value>
    [ServiceDependency]
    public IEntityContextService EntityService
    {
        get { return _entityService; }
        set { _entityService = value; }
    }

    private LinkHandler _LinkHandler;
    private LinkHandler Link
    {
        get
        {
            if (_LinkHandler == null)
                _LinkHandler = new LinkHandler(Page);
            return _LinkHandler;
        }
    }

    /// <summary>
    /// 
    /// </summary>
    public class TaskItem
    {
        private string _id;
        private string _name;
        private string _action;
        private string _postbackFull;

        /// <summary>
        /// Gets or sets the id.
        /// </summary>
        /// <value>The id.</value>
        public string Id
        {
            get { return _id; }
            set { _id = value; }
        }

        /// <summary>
        /// Gets or sets the name.
        /// </summary>
        /// <value>The name.</value>
        public string Name
        {
            get { return _name; }
            set { _name = value; }
        }

        /// <summary>
        /// Gets or sets the action.
        /// </summary>
        /// <value>The action.</value>
        public string Action
        {
            get { return _action; }
            set { _action = value; }
        }

        /// <summary>
        /// Gets or sets the postback full.
        /// </summary>
        /// <value>The postback full.</value>
        public string PostbackFull
        {
            get { return _postbackFull; }
            set { _postbackFull = value; }
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="TaskItem"/> class.
        /// </summary>
        public TaskItem()
        { }
    }
    #endregion

    #region Define Dictionaries
    //IDictionary<string, Array> tasksByEntity= new Dictionary<string, Array>();
    private IDictionary<string, Array> _tasksByEntity;
    private IDictionary<string, Array> tasksByEntity
    {
        get
        {
            if (_tasksByEntity == null)
            { _tasksByEntity = new Dictionary<string, Array>(); }
            return _tasksByEntity;

        }
        set { _tasksByEntity = value; }
    }

    private IDictionary<string, Array> _tasksByEntityList;
    private IDictionary<string, Array> tasksByEntityList
    {
        get
        {
            if (_tasksByEntityList == null)
            { _tasksByEntityList = new Dictionary<string, Array>(); }
            return _tasksByEntityList;
        }
        set { _tasksByEntityList = value; }
    }
    #endregion

    /// <summary>
    /// Handles the Load event of the Page control.
    /// </summary>
    /// <param name="sender">The source of the event.</param>
    /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
    protected void Page_Load(object sender, EventArgs e)
    {
        tskExportToExcel.Command += tskExportToExcel_Command;
        ScriptManager.GetCurrent(this.Page).RegisterPostBackControl(FindControl("tskExportToExcel"));
        if (!IsPostBack)
        {
            GroupContext groupContext = GroupContext.GetGroupContext();
            if ((groupContext != null) && (groupContext.CurrentGroupInfo != null))
                divLeadAssignOwner.Visible = (groupContext.CurrentGroupInfo.TableName.ToUpper().Equals("LEAD"));
        }



    }

    void tskExportToExcel_Command(object sender, CommandEventArgs e)
    {
        ExportToFile();
    }

    protected override void OnPreRender(EventArgs e)
    {
        base.OnPreRender(e);

        EntityPage entityPage = Page as EntityPage;

        if (Page != null)
        {
            string entityType = EntityService.EntityType.Name.ToString();
            string displayMode = entityPage.ModeId.ToString();

            FillDictionaries();
            items.DataSource = CreateTaskItems(entityType, displayMode);
            items.DataBind();

            selectionText.Text = GetLocalResourceObject("SelectionText_DisplayCaption").ToString();
        }
    }



    /// <summary>
    /// Gets the smart part info.
    /// </summary>
    /// <param name="smartPartInfoType">Type of the smart part info.</param>
    /// <returns></returns>
    public virtual ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        Sage.Platform.WebPortal.SmartParts.ToolsSmartPartInfo tinfo = new Sage.Platform.WebPortal.SmartParts.ToolsSmartPartInfo();
        return tinfo;
    }

    /// <summary>
    /// Shows the response view.
    /// </summary>
    /// <param name="targetResponse">The target response.</param>
    private void ShowResponseView(ITargetResponse targetResponse)
    {
        if (DialogService != null)
        {
            string caption = GetLocalResourceObject("AddResponse_DialogCaption").ToString();
            DialogService.SetSpecs(200, 200, 550, 800, "AddEditTargetResponse", caption, true);
            DialogService.EntityType = typeof(ITargetResponse);
            if (targetResponse != null && targetResponse.Id != null)
                DialogService.EntityID = targetResponse.Id.ToString();
            DialogService.DialogParameters.Add("ResponseDataSource", targetResponse);
            DialogService.ShowDialog();
        }
    }

    /// <summary>
    /// Creates list of Common Tasks relative to current Entity
    /// There are several Common Tasks that are conditional whether they should be displayed or not.
    /// We begin CreateTaskItems by collecting the data required to determine our display conditions.
    /// </summary>
    /// <returns>List - TaskItem</returns>
    public List<TaskItem> CreateTaskItems(string currentEntity, string displayMode)
    {
        // Is reporting enabled?
        bool reportingEnabled = (!string.IsNullOrEmpty(ReportingUtil.GetReportingUrl()));

        // The 'Mail Merge' task will only display if ActiveX is enabled and if the user has selected to use ActiveMail.
        bool activeMailEnabled = false;
        IContextService context = Sage.Platform.Application.ApplicationContext.Current.Services.Get<IContextService>(true);
        if (context.GetContext("ActiveMail") != null)
            activeMailEnabled = (bool)context.GetContext("ActiveMail");

        // If the current group is an AdHoc group, then we need to display further AdHoc options.  We use GroupContext to determine this.
        GroupContext groupContext = GroupContext.GetGroupContext();
        string currentGroupID = groupContext.CurrentGroupID;
        bool currentIsAdHoc = false;
        bool contextHasAdHoc = false;
        if (groupContext.CurrentGroupInfo == null) return new List<TaskItem>();

        foreach (GroupInfo gi in groupContext.CurrentGroupInfo.GroupsList)
        {
            if (gi.GroupID == currentGroupID)
            {
                if ((gi.IsAdHoc) ?? false)
                { currentIsAdHoc = true; }
            }
            if ((gi.IsAdHoc) ?? false)
            { contextHasAdHoc = true; }
        }

        int length;
        try
        {

            List<TaskItem> items = new List<TaskItem>();
            if (displayMode == "Detail")
            {
                selectionDisplay.Visible = false;

                length = tasksByEntity[currentEntity].GetLength(0);
                for (int i = 0; i < length; i++)
                {
                    //Menu display conditions based on current Group, Context, and UserOptions
                    if (tasksByEntity[currentEntity].GetValue(i, 0).ToString() == "tskRemoveFromGroup" && !currentIsAdHoc) { }
                    // do not display
                    else if (tasksByEntity[currentEntity].GetValue(i, 0).ToString() == "tskAddToGroup" && !contextHasAdHoc) { }
                    // do not display
                    else if (tasksByEntity[currentEntity].GetValue(i, 0).ToString() == "tskMailMerge" && !activeMailEnabled) { }
                    // do not display
                    else if (tasksByEntity[currentEntity].GetValue(i, 0).ToString() == "tskDetailReport" && !reportingEnabled) { }
                    // do not display
                    else
                    {
                        TaskItem item = new TaskItem();
                        item.Id = tasksByEntity[currentEntity].GetValue(i, 0).ToString();
                        item.Name = tasksByEntity[currentEntity].GetValue(i, 1).ToString();
                        item.Action = tasksByEntity[currentEntity].GetValue(i, 2).ToString();
                        item.PostbackFull = tasksByEntity[currentEntity].GetValue(i, 3).ToString();
                        items.Add(item);
                    }
                }
            }
            else
            {
                length = tasksByEntityList[currentEntity].GetLength(0);
                for (int i = 0; i < length; i++)
                {
                    //Menu display conditions based on current Group and Context  
                    if (tasksByEntityList[currentEntity].GetValue(i, 0).ToString() == "tskRemoveFromGroup" && !currentIsAdHoc)
                    { }
                    else if (tasksByEntityList[currentEntity].GetValue(i, 0).ToString() == "tskAddToGroup" && !contextHasAdHoc)
                    { }
                    else
                    {
                        TaskItem item = new TaskItem();
                        item.Id = tasksByEntityList[currentEntity].GetValue(i, 0).ToString();
                        item.Name = tasksByEntityList[currentEntity].GetValue(i, 1).ToString();
                        item.Action = tasksByEntityList[currentEntity].GetValue(i, 2).ToString();
                        item.PostbackFull = tasksByEntityList[currentEntity].GetValue(i, 3).ToString();
                        items.Add(item);
                    }
                }
            }
            return items;
        }
        catch
        {
            return new List<TaskItem>();
        }
    }

    /// <summary>
    /// Creates the Click event of the Repeater control.
    /// </summary>
    protected void items_ItemDataBound(object sender, RepeaterItemEventArgs e)
    {
        LinkButton itemsLinkButton = (LinkButton)e.Item.FindControl("Action");
        itemsLinkButton.CommandName = ((TaskItem)e.Item.DataItem).Id;
        itemsLinkButton.OnClientClick = ((TaskItem)e.Item.DataItem).Action;
        if (((TaskItem)e.Item.DataItem).PostbackFull == "true")
        {
            ScriptManager.GetCurrent(this.Page).RegisterPostBackControl(e.Item.FindControl("Action"));
        }
    }

    /// <summary>
    /// Handles the ItemCommand event of the items control.
    /// </summary>
    /// <param name="source">The source of the event.</param>
    /// <param name="e">The <see cref="System.Web.UI.WebControls.RepeaterCommandEventArgs"/> instance containing the event data.</param>
    protected void items_ItemCommand(object source, RepeaterCommandEventArgs e)
    {
        if (e.CommandName == "tskAddResponse")
        {
            ITargetResponse targetResponse = EntityFactory.Create<ITargetResponse>();
            ShowResponseView(targetResponse);
        }
        //else if (e.CommandName == "tskScheduleProcess")
        //else if (e.CommandName == "tskExportToExcel")
        else if (e.CommandName == "tskInsertNote")
            Link.NewNote();
        else if (e.CommandName == "tskNewMeeting")
            Link.ScheduleMeeting();
        else if (e.CommandName == "tskNewPhoneCall")
            Link.SchedulePhoneCall();
        else if (e.CommandName == "tskNewToDo")
            Link.ScheduleToDo();
        else if (e.CommandName == "tskAddNewPickList")
            AddNewPickList();
    }

    private void AddNewPickList()
    {
        if (DialogService != null)
        {
            DialogService.SetSpecs(0, 0, 200, 600, "AddPickList", "Add New Code Pick List", true);
            DialogService.ShowDialog();
        }


    }

    private void ExportToFile()
    {
        GroupContextService groupContextService = ApplicationContext.Current.Services.Get<IGroupContextService>() as GroupContextService;
        CachedGroup currentGroup = groupContextService.GetGroupContext().CurrentGroupInfo.CurrentGroup;
        GroupInfo gInfo = currentGroup.GroupInformation;

        HttpCookie cFormat = Request.Cookies["format"];

        try
        {
            string passedArgument = hfSelections.Value;

            DataTable GroupTableAll = currentGroup.GroupDataTable;//.Copy();
            using (DataTable GroupTableSelections = GroupTableAll.Copy())
            {
                IDictionary<string, Layout> layout = new Dictionary<string, Layout>();
                foreach (Sage.SalesLogix.Client.GroupBuilder.GroupLayoutItem gl in gInfo.GetGroupLayout().Items)
                {

                    Layout item = new Layout();
                    if (gl.Format.Equals("Owner") || gl.Format.Equals("User"))
                    {
                        item.ColumnName = gl.Alias + "NAME";
                    }
                    else
                    {
                        item.ColumnName = gl.Alias;
                    }

                    item.ColumnCaption = gl.Caption;

                    if ((gl.Visible == "T") || (gl.Width != "0"))
                    {
                        item.Visible = true;
                    }
                    else
                    {
                        item.Visible = false;
                    }

                    item.FormatType = gl.Format;
                    item.FormatString = gl.FormatString;
                    item.Width = System.Convert.ToInt32(gl.Width);
                    
                    if (!layout.ContainsKey(item.ColumnName))
                    {
                        layout.Add(item.ColumnName, item);
                    }                    

                }

                if (passedArgument != "cancel")
                {

                    if (passedArgument == "selectAll")
                    {
                        //do nothing but process all of the records
                    }
                    else
                    {
                        //Get the selection service and remove un selected records.
                        //the passArgument has is the selection key.
                        ISelectionService srv = SelectionServiceRequest.GetSelectionService();
                        ISelectionContext selectionContext = srv.GetSelectionContext(passedArgument);
                        RemoveUnSelectedRows(selectionContext, GroupTableSelections);

                    }
                    //remove hidden columns
                    SetLayout(GroupTableSelections, layout);
                    if (cFormat != null)
                    {
                        switch (cFormat.Value)
                        {
                            case "csv":
                                ToCSV(GroupTableSelections, layout);
                                break;
                            case "tab":
                                ToTab(GroupTableSelections, layout);
                                break;
                        }
                    }
                }
            }
        }
        catch (Exception ex)
        {
            DialogService.ShowMessage(ex.Message);
        }
    }

    private void SetLayout(DataTable dataTable, IDictionary<string, Layout> layout)
    {

        for (int i = dataTable.Columns.Count - 1; i >= 0; i--)
        {
            DataColumn col = dataTable.Columns[i];
            Layout item = null;
            layout.TryGetValue(col.ColumnName, out item);
            if (item != null)
            {
                if (item.Visible)
                {
                    col.Caption = item.ColumnCaption;
                }
                else
                {
                    dataTable.Columns.Remove(col);
                }

            }
            else
            {
                dataTable.Columns.Remove(col);
            }
        }
        dataTable.AcceptChanges();
    }

    private void RemoveUnSelectedRows(ISelectionContext selectionContext, DataTable table)
    {
        // Clean up the table to include only our client side selections
        bool keep;

        IList<string> selections = selectionContext.GetSelectedIds();

        int i = 1;
        foreach (DataRow row in table.Rows)
        {
            keep = false;
            foreach (string id in selections)
            {

                if (row[0].ToString() == id)
                {
                    keep = true;
                    continue;
                }
            }
            if (!keep)
            { row.Delete(); }
            i++;
        }
        table.AcceptChanges();
    }

    private void RemoveUnSelectedRowsById(string selections, DataTable table)
    {
        // Clean up the table to include only our client side selections
        bool keep;
        string[] arraySelections = selections.Split(',');

        foreach (DataRow row in table.Rows)
        {
            keep = false;
            foreach (string sel in arraySelections)
            {
                string[] s = sel.Split(':');
                if (row[0].ToString() == s[1])
                { keep = true; }
            }
            if (!keep)
            { row.Delete(); }
        }
        table.AcceptChanges();
    }

    private void RemoveUnSelectedRowsByNumber(string selections, DataTable table)
    {
        // Clean up the table to include only our client side selections
        bool keep;
        string[] arraySelections = selections.Split(',');

        int i = 1;
        foreach (DataRow row in table.Rows)
        {
            keep = false;
            foreach (string sel in arraySelections)
            {
                string[] s = sel.Split(':');
                if (i.ToString() == s[0])
                {
                    keep = true;
                    continue;
                }
            }
            if (!keep)
            { row.Delete(); }
            i++;
        }
        table.AcceptChanges();
    }

    private void ToTab(DataTable table, IDictionary<string, Layout> layout)
    {
        Response.Clear();
        Response.Cache.SetMaxAge(TimeSpan.Zero);
        Response.Cache.SetRevalidation(HttpCacheRevalidation.AllCaches);
        Response.AppendHeader("Content-Disposition",
                              String.Format("attachment;filename={0:yyyyMMddhhmmss}_slx_exported_selections.csv",
                              DateTime.Now));
        Response.ContentType = "application/csv";
        Response.ContentEncoding = Encoding.Unicode;
        Response.Flush();
        using (StreamWriter writer = new StreamWriter(Response.OutputStream, Encoding.Unicode))
        {
            WriteTabFormat(table, writer, layout);
            writer.Flush();
            Response.Flush();
        }
        Response.End();
    }


    private void ToCSV(DataTable table, IDictionary<string, Layout> layout)
    {
        Response.Clear();
        Response.Cache.SetMaxAge(TimeSpan.Zero);
        Response.Cache.SetRevalidation(HttpCacheRevalidation.AllCaches);
        Response.AppendHeader("Content-Disposition",
                              String.Format("attachment;filename={0:yyyyMMddhhmmss}_slx_exported_selections.csv",
                              DateTime.Now));
        Response.ContentType = "application/csv";
        Response.ContentEncoding = Encoding.GetEncoding(1252);
        Response.Flush();
        using (StreamWriter writer = new StreamWriter(Response.OutputStream, Encoding.GetEncoding(1252)))
        {
            WriteCsvFormat(table, writer, layout);
            writer.Flush();
            Response.Flush();
        }
        Response.End();
    }


    protected int GetSelectionCount()
    {

        int count = 0;
        Sage.SalesLogix.SelectionService.ISelectionService ss = SelectionServiceRequest.GetSelectionService(); //ApplicationContext.Current.Services.Get<Sage.SalesLogix.SelectionService.ISelectionService>();
        if (ss != null)
        {
            Sage.SalesLogix.SelectionService.ISelectionContext sc = ss.GetSelectionContext("Test");
            if (sc != null)
            {
                return sc.GetSelectionCount();
            }

        }
        return count;

    }

    private static string EncodeTabValue(string value)
    {
        if (String.IsNullOrEmpty(value))
            return String.Empty;

        return value.Replace("\t", " ").Replace("\r\n", "").Replace("\n", "");
    }

    private static string EncodeCsvValue(string value)
    {
        const string DOUBLE_QUOTE = "\"";
        const string PAIRED_DOUBLE_QUOTE = DOUBLE_QUOTE + DOUBLE_QUOTE;

        /* Always surround the value with double quotes and double up any existing double quotes. */

        if (string.IsNullOrEmpty(value))
            return PAIRED_DOUBLE_QUOTE;

        value = string.Concat(DOUBLE_QUOTE, value.Replace(DOUBLE_QUOTE, PAIRED_DOUBLE_QUOTE), DOUBLE_QUOTE);

        return value;
    }

    private static void WriteTabFormat(DataTable table, TextWriter writer, IDictionary<string, Layout> layouts)
    {
        if (table.Columns.Count == 0) return;

        bool added = false;
        foreach (DataColumn column in table.Columns)
        {
            if (added) writer.Write("\t");

            added = true;

            writer.Write(EncodeTabValue(column.Caption));
        }

        writer.WriteLine();

        foreach (DataRow row in table.Rows)
        {
            added = false;
            foreach (DataColumn column in table.Columns)
            {
                if (added) writer.Write("\t");

                added = true;

                if (row.IsNull(column))
                    continue;

                Layout layout = null;
                layouts.TryGetValue(column.ColumnName, out layout);
                if (layout != null)
                {
                    writer.Write(EncodeCsvValue(FormatValue(row[column].ToString(), layout)));
                }
                else
                {
                    writer.Write(EncodeCsvValue(row[column].ToString()));
                }

            }

            writer.WriteLine();
        }
    }

    private static void WriteCsvFormat(DataTable table, System.IO.TextWriter writer, IDictionary<string, Layout> layouts)
    {
        if (table.Columns.Count != 0)
        {
            string delimiter = System.Threading.Thread.CurrentThread.CurrentCulture.TextInfo.ListSeparator;
            bool first = true;
            foreach (DataColumn col in table.Columns)
            {
                if (!first)
                    writer.Write(delimiter);

                writer.Write(EncodeCsvValue(col.Caption));
                first = false;
            }

            writer.WriteLine();

            foreach (DataRow row in table.Rows)
            {
                first = true;
                foreach (DataColumn col in table.Columns)
                {
                    if (!first)
                        writer.Write(delimiter);
                    if (row.IsNull(col))
                        continue;
                    else
                    {
                        Layout layout = null;
                        layouts.TryGetValue(col.ColumnName, out layout);
                        if (layout != null)
                        {
                            writer.Write(EncodeCsvValue(FormatValue(row[col].ToString(), layout)));
                        }
                        else
                        {
                            writer.Write(EncodeCsvValue(row[col].ToString()));
                        }
                    }
                    first = false;
                }
                writer.WriteLine();
            }
        }
    }
    private static string FormatValue(string value, Layout layout)
    {
        if (layout.FormatType.ToUpper() == "PHONE")
        {
            return Sage.SalesLogix.Web.Controls.Phone.FormatPhoneNumber(value);
        }
        else
        {
            return value;
        }
    }
    #region Fill Dictionaries

    /// <summary>
    /// Creates a dictionary of tasks by entity listed by Name, Action.  
    /// Name is for display, Action defines the JavaScript function.
    /// </summary>
    /// <returns>Dictionary string, array</returns>
    public void FillDictionaries()
    {

        #region Fill tasksByEntityList
        string[,] accountTasksList =
           {{"tskAddToGroup", GetLocalResourceObject("TaskText_AddToGroup").ToString(),"javascript:showAdHocList(Ext.EventObject);", "false"},
            {"tskSaveAsNewGroup",GetLocalResourceObject("TaskText_SaveAsNew").ToString(),"javascript:saveSelectionsAsNewGroup();","false"},
            {"tskRemoveFromGroup",GetLocalResourceObject("TaskText_Remove").ToString(),"javascript:removeSelectionsFromGroup();","false"},
            {"tskExportToExcel", GetLocalResourceObject("TaskText_Export").ToString(), "javascript:exportToExcel();", "false" }
           };
        tasksByEntityList.Add("IAccount", accountTasksList);

        string[,] contactTasksList =   
           {{"tskAddToGroup", GetLocalResourceObject("TaskText_AddToGroup").ToString(),"javascript:showAdHocList(Ext.EventObject);", "false"},
            {"tskSaveAsNewGroup",GetLocalResourceObject("TaskText_SaveAsNew").ToString(),"javascript:saveSelectionsAsNewGroup();","false"},
            {"tskRemoveFromGroup",GetLocalResourceObject("TaskText_Remove").ToString(),"javascript:removeSelectionsFromGroup();","false"},
            {"tskExportToExcel", GetLocalResourceObject("TaskText_Export").ToString(), "javascript:exportToExcel();", "false" }
           };
        tasksByEntityList.Add("IContact", contactTasksList);

        string[,] activitiesTasksList = { { "Mail Merge", "mailMerge" } };
        tasksByEntityList.Add("Activities", activitiesTasksList);

        string[,] opportunitiesTasksList =
           {{"tskAddToGroup", GetLocalResourceObject("TaskText_AddToGroup").ToString(),"javascript:showAdHocList(Ext.EventObject);", "false"},
            {"tskSaveAsNewGroup",GetLocalResourceObject("TaskText_SaveAsNew").ToString(),"javascript:saveSelectionsAsNewGroup();","false"},
            {"tskRemoveFromGroup",GetLocalResourceObject("TaskText_Remove").ToString(),"javascript:removeSelectionsFromGroup();","false"},
            {"tskExportToExcel", GetLocalResourceObject("TaskText_Export").ToString(), "javascript:exportToExcel();", "false" }
           };
        tasksByEntityList.Add("IOpportunity", opportunitiesTasksList);

        string[,] leadsTasksList =
           {{"tskAddToGroup", GetLocalResourceObject("TaskText_AddToGroup").ToString(),"javascript:showAdHocList(Ext.EventObject);", "false"},
            {"tskSaveAsNewGroup",GetLocalResourceObject("TaskText_SaveAsNew").ToString(),"javascript:saveSelectionsAsNewGroup();","false"},
            {"tskRemoveFromGroup",GetLocalResourceObject("TaskText_Remove").ToString(),"javascript:removeSelectionsFromGroup();","false"},
            {"tskExportToExcel", GetLocalResourceObject("TaskText_Export").ToString(), "javascript:exportToExcel();", "false"},
            //{"tskAssignOwner", GetLocalResourceObject("TaskText_AssignOwner").ToString(), "javascript:leadAssignOwner();", "true"},
            //{"tskDeleteLeads", GetLocalResourceObject("TaskText_DeleteLeads").ToString(), "javascript:leadDeleteRecords();", "true" }
           };
        tasksByEntityList.Add("ILead", leadsTasksList);

        string[,] campaignsTasksList =
           {{"tskAddToGroup", GetLocalResourceObject("TaskText_AddToGroup").ToString(),"javascript:showAdHocList(Ext.EventObject);", "false"},
            {"tskSaveAsNewGroup",GetLocalResourceObject("TaskText_SaveAsNew").ToString(),"javascript:saveSelectionsAsNewGroup();","false"},
            {"tskRemoveFromGroup",GetLocalResourceObject("TaskText_Remove").ToString(),"javascript:removeSelectionsFromGroup();","false"},
            {"tskExportToExcel", GetLocalResourceObject("TaskText_Export").ToString(), "javascript:exportToExcel();", "false" }
           };
        tasksByEntityList.Add("ICampaign", campaignsTasksList);

        string[,] ticketsTasksList =
           {{"tskAddToGroup", GetLocalResourceObject("TaskText_AddToGroup").ToString(),"javascript:showAdHocList(Ext.EventObject);", "false"},
            {"tskSaveAsNewGroup",GetLocalResourceObject("TaskText_SaveAsNew").ToString(),"javascript:saveSelectionsAsNewGroup();","false"},
            {"tskRemoveFromGroup",GetLocalResourceObject("TaskText_Remove").ToString(),"javascript:removeSelectionsFromGroup();","false"},
            {"tskExportToExcel", GetLocalResourceObject("TaskText_Export").ToString(), "javascript:exportToExcel();", "false" }
           };
        tasksByEntityList.Add("ITicket", ticketsTasksList);

        string[,] defectsTasksList =
           {{"tskAddToGroup", GetLocalResourceObject("TaskText_AddToGroup").ToString(),"javascript:showAdocList(Ext.EventObject);", "false"},
            {"tskSaveAsNewGroup",GetLocalResourceObject("TaskText_SaveAsNew").ToString(),"javascript:saveSelectionsAsNewGroup();","false"},
            {"tskRemoveFromGroup",GetLocalResourceObject("TaskText_Remove").ToString(),"javascript:removeSelectionsFromGroup();","false"},
            {"tskExportToExcel", GetLocalResourceObject("TaskText_Export").ToString(), "javascript:exportToExcel();", "false" }
           };
        tasksByEntityList.Add("IDefect", defectsTasksList);

        string[,] returnsTasksList =
           {{"tskAddToGroup", GetLocalResourceObject("TaskText_AddToGroup").ToString(),"javascript:showAdHocList(Ext.EventObject);", "false"},
            {"tskSaveAsNewGroup",GetLocalResourceObject("TaskText_SaveAsNew").ToString(),"javascript:saveSelectionsAsNewGroup();","false"},
            {"tskRemoveFromGroup",GetLocalResourceObject("TaskText_Remove").ToString(),"javascript:removeSelectionsFromGroup();","false"},
            {"tskExportToExcel", GetLocalResourceObject("TaskText_Export").ToString(), "javascript:exportToExcel();", "false" }
           };
        tasksByEntityList.Add("IReturn", returnsTasksList);

        string[,] contractsTasksList =
           {{"tskAddToGroup", GetLocalResourceObject("TaskText_AddToGroup").ToString(),"javascript:showAdHocList(Ext.EventObject);", "false"},
            {"tskSaveAsNewGroup",GetLocalResourceObject("TaskText_SaveAsNew").ToString(),"javascript:saveSelectionsAsNewGroup();","false"},
            {"tskRemoveFromGroup",GetLocalResourceObject("TaskText_Remove").ToString(),"javascript:removeSelectionsFromGroup();","false"},
            {"tskExportToExcel", GetLocalResourceObject("TaskText_Export").ToString(), "javascript:exportToExcel();", "false" }
           };
        tasksByEntityList.Add("IContract", contractsTasksList);

        string[,] salesOrderTasksList =
           {{"tskAddToGroup", GetLocalResourceObject("TaskText_AddToGroup").ToString(),"javascript:showAdHocList(Ext.EventObject);", "false"},
            {"tskSaveAsNewGroup",GetLocalResourceObject("TaskText_SaveAsNew").ToString(),"javascript:saveSelectionsAsNewGroup();","false"},
            {"tskRemoveFromGroup",GetLocalResourceObject("TaskText_Remove").ToString(),"javascript:removeSelectionsFromGroup();","false"},
            {"tskExportToExcel", GetLocalResourceObject("TaskText_Export").ToString(), "javascript:exportToExcel();", "false" }
           };
        tasksByEntityList.Add("ISalesOrder", salesOrderTasksList);

        string[,] codePickListTasksLists = { { "tskAddNewPickList", GetLocalResourceObject("TaskText_AddNewPickList").ToString(), "", "false" } };
        tasksByEntityList.Add("IDBCodePickList", codePickListTasksLists);

        #endregion

        #region Fill tasksByEntity
        string[,] accountTasks = 
             {{"tskDetailReport",GetLocalResourceObject("TaskText_DetailReport").ToString(),"javascript:ShowDefaultReport();","false"},
             {"",GetLocalResourceObject("TaskText_Email").ToString(),"javascript:EmailSend();","false"},                 
            {"tskMailMerge",GetLocalResourceObject("TaskText_MailMerge").ToString(),"javascript:WriteMailMergeEx();","false"},
             {"tskAddToGroup", GetLocalResourceObject("TaskText_AddToGroup").ToString(),"javascript:showAdHocList(Ext.EventObject);", "false"},
             {"tskRemoveFromGroup",GetLocalResourceObject("TaskText_Remove").ToString(),"javascript:removeCurrentFromGroup();","false"},
             {"tskAddResponse",GetLocalResourceObject("TaskText_ResponseToCampaign").ToString(),"","false"},
             {"tskInsertNote",GetLocalResourceObject("TaskText_AddNote").ToString(),"","false"},
             {"tskNewMeeting",GetLocalResourceObject("TaskText_Meeting").ToString(),"","false"},
             {"tskNewPhoneCall",GetLocalResourceObject("TaskText_PhoneCall").ToString(),"","false"},
             {"tskNewToDo",GetLocalResourceObject("TaskText_ToDo").ToString(),"","false"}};
        tasksByEntity.Add("IAccount", accountTasks);

        string[,] contactTasks = 
             {{"tskDetailReport",GetLocalResourceObject("TaskText_DetailReport").ToString(),"javascript:ShowDefaultReport();","false"},
             {"",GetLocalResourceObject("TaskText_Email").ToString(),"javascript:EmailSend();","false"},
             {"tskMailMerge",GetLocalResourceObject("TaskText_MailMerge").ToString(),"javascript:WriteMailMergeEx();","false"},
             {"tskAddToGroup", GetLocalResourceObject("TaskText_AddToGroup").ToString(),"javascript:showAdHocList(Ext.EventObject);", "false"},
             {"tskRemoveFromGroup",GetLocalResourceObject("TaskText_Remove").ToString(),"javascript:removeCurrentFromGroup();","false"},
             {"tskAddResponse",GetLocalResourceObject("TaskText_ResponseToCampaign").ToString(),"","false"},
             {"tskInsertNote",GetLocalResourceObject("TaskText_AddNote").ToString(),"","false"},
             {"tskNewMeeting",GetLocalResourceObject("TaskText_Meeting").ToString(),"","false"},
             {"tskNewPhoneCall",GetLocalResourceObject("TaskText_PhoneCall").ToString(),"","false"},
             {"tskNewToDo",GetLocalResourceObject("TaskText_ToDo").ToString(),"","false"}};
        tasksByEntity.Add("IContact", contactTasks);

        string[,] opportunitiesTasks = 
             {{"tskDetailReport",GetLocalResourceObject("TaskText_DetailReport").ToString(),"javascript:ShowDefaultReport();","false"},
             {"",GetLocalResourceObject("TaskText_Email").ToString(),"javascript:EmailSend();","false"},
             {"tskMailMerge",GetLocalResourceObject("TaskText_MailMerge").ToString(),"javascript:WriteMailMergeEx();","false"},
             {"tskAddToGroup", GetLocalResourceObject("TaskText_AddToGroup").ToString(),"javascript:showAdHocList(Ext.EventObject);", "false"},
             {"tskRemoveFromGroup",GetLocalResourceObject("TaskText_Remove").ToString(),"javascript:removeCurrentFromGroup();","false"},
             //PENDING {"tskAddResponse",GetLocalResourceObject("TaskText_ResponseToCampaign").ToString(),""},
             {"tskInsertNote",GetLocalResourceObject("TaskText_AddNote").ToString(),"","false"},
             {"tskNewMeeting",GetLocalResourceObject("TaskText_Meeting").ToString(),"","false"},
             {"tskNewPhoneCall",GetLocalResourceObject("TaskText_PhoneCall").ToString(),"","false"},
             {"tskNewToDo",GetLocalResourceObject("TaskText_ToDo").ToString(),"","false"},
             {"tskAddSalesOrder",GetLocalResourceObject("TaskText_SalesOrder").ToString(),"javascript:window.location='InsertSalesOrder.aspx?modeid=Insert&opp=yes';","false"}};
        tasksByEntity.Add("IOpportunity", opportunitiesTasks);

        string[,] activitiesTasks = 
            {{"",GetLocalResourceObject("TaskText_Email").ToString(),"email","false"},
             {"tskMailMerge",GetLocalResourceObject("TaskText_MailMerge").ToString(),"javascript:WriteMailMergeEx();","false"},             
             {"tskNewMeeting",GetLocalResourceObject("TaskText_Meeting").ToString(),"","false"},
             {"tskNewPhoneCall",GetLocalResourceObject("TaskText_PhoneCall").ToString(),"","false"},
             {"tskNewToDo",GetLocalResourceObject("TaskText_ToDo").ToString(),"","false"}};
        tasksByEntity.Add("IActivty", activitiesTasks);

        string[,] leadsTasks = 
             {{"",GetLocalResourceObject("TaskText_Email").ToString(),"javascript:EmailSend();","false"},
             {"tskMailMerge",GetLocalResourceObject("TaskText_MailMerge").ToString(),"javascript:WriteMailMergeEx();","false"},
             {"tskAddToGroup", GetLocalResourceObject("TaskText_AddToGroup").ToString(),"javascript:showAdHocList(Ext.EventObject);", "false"},
             {"tskRemoveFromGroup",GetLocalResourceObject("TaskText_Remove").ToString(),"javascript:removeCurrentFromGroup();","false"}, 
             //{GetLocalResourceObject("TaskText_ResponseToCampaign").ToString(),"addResponseToCampaign"},
             {"tskInsertNote",GetLocalResourceObject("TaskText_AddNote").ToString(),"","false"},
             {"tskNewMeeting",GetLocalResourceObject("TaskText_Meeting").ToString(),"","false"},
             {"tskNewPhoneCall",GetLocalResourceObject("TaskText_PhoneCall").ToString(),"","false"},
             {"tskNewToDo",GetLocalResourceObject("TaskText_ToDo").ToString(),"","false"}};
        tasksByEntity.Add("ILead", leadsTasks);

        string[,] campaignsTasks = 
            {{"Email",GetLocalResourceObject("TaskText_Email").ToString(),"javascript:EmailSend();","false"},
             {"tskMailMerge",GetLocalResourceObject("TaskText_MailMerge").ToString(),"javascript:WriteMailMergeEx();","false"},
             {"tskAddToGroup", GetLocalResourceObject("TaskText_AddToGroup").ToString(),"javascript:showAdHocList(Ext.EventObject);", "false"},
             {"tskRemoveFromGroup",GetLocalResourceObject("TaskText_Remove").ToString(),"javascript:removeCurrentFromGroup();","false"},
             {"tskInsertNote",GetLocalResourceObject("TaskText_AddNote").ToString(),"","false"},
             {"tskNewMeeting",GetLocalResourceObject("TaskText_Meeting").ToString(),"","false"},
             {"tskNewPhoneCall",GetLocalResourceObject("TaskText_PhoneCall").ToString(),"","false"},
             {"tskNewToDo",GetLocalResourceObject("TaskText_ToDo").ToString(),"","false"}};
        tasksByEntity.Add("ICampaign", campaignsTasks);

        string[,] ticketsTasks = 
             {{"tskDetailReport",GetLocalResourceObject("TaskText_DetailReport").ToString(),"javascript:ShowDefaultReport();","false"},
             {"cmdEmail",GetLocalResourceObject("TaskText_Email").ToString(),"javascript:EmailSend();","false"},       
             {"tskMailMerge",GetLocalResourceObject("TaskText_MailMerge").ToString(),"javascript:WriteMailMergeEx();","false"},
             {"tskAddToGroup", GetLocalResourceObject("TaskText_AddToGroup").ToString(),"javascript:showAdHocList(Ext.EventObject);", "false"},
             {"tskRemoveFromGroup",GetLocalResourceObject("TaskText_Remove").ToString(),"javascript:removeCurrentFromGroup();","false"},
             {"tskInsertNote",GetLocalResourceObject("TaskText_AddNote").ToString(),"","false"},
             {"tskNewMeeting",GetLocalResourceObject("TaskText_Meeting").ToString(),"","false"},
             {"tskNewPhoneCall",GetLocalResourceObject("TaskText_PhoneCall").ToString(),"","false"},
             {"tskNewToDo",GetLocalResourceObject("TaskText_ToDo").ToString(),"","false"}};
        tasksByEntity.Add("ITicket", ticketsTasks);

        string[,] defectsTasks = 
             {{"tskDetailReport",GetLocalResourceObject("TaskText_DetailReport").ToString(),"javascript:ShowDefaultReport();","false"},
             {"",GetLocalResourceObject("TaskText_Email").ToString(),"javascript:EmailSend();","false"},
             {"tskMailMerge",GetLocalResourceObject("TaskText_MailMerge").ToString(),"javascript:WriteMailMergeEx();","false"},
             {"tskAddToGroup", GetLocalResourceObject("TaskText_AddToGroup").ToString(),"javascript:showAdHocList(Ext.EventObject);", "false"},
             {"tskRemoveFromGroup",GetLocalResourceObject("TaskText_Remove").ToString(),"javascript:removeCurrentFromGroup();","false"},
             {"tskInsertNote",GetLocalResourceObject("TaskText_AddNote").ToString(),"","false"},
             {"tskNewMeeting",GetLocalResourceObject("TaskText_Meeting").ToString(),"","false"},
             {"tskNewPhoneCall",GetLocalResourceObject("TaskText_PhoneCall").ToString(),"","false"},
             {"tskNewToDo",GetLocalResourceObject("TaskText_ToDo").ToString(),"","false"}};
        tasksByEntity.Add("IDefect", defectsTasks);

        string[,] returnsTasks = 
            {{"",GetLocalResourceObject("TaskText_Email").ToString(),"javascript:EmailSend();","false"},
             {"tskMailMerge",GetLocalResourceObject("TaskText_MailMerge").ToString(),"javascript:WriteMailMergeEx();","false"},
             {"tskAddToGroup", GetLocalResourceObject("TaskText_AddToGroup").ToString(),"javascript:showAdHocList(Ext.EventObject);", "false"},
             {"tskRemoveFromGroup",GetLocalResourceObject("TaskText_Remove").ToString(),"javascript:removeCurrentFromGroup();","false"},
             {"tskInsertNote",GetLocalResourceObject("TaskText_AddNote").ToString(),"","false"},
             {"tskNewMeeting",GetLocalResourceObject("TaskText_Meeting").ToString(),"","false"},
             {"tskNewPhoneCall",GetLocalResourceObject("TaskText_PhoneCall").ToString(),"","false"},
             {"tskNewToDo",GetLocalResourceObject("TaskText_ToDo").ToString(),"","false"}};
        tasksByEntity.Add("IReturn", returnsTasks);

        string[,] contractsTasks = 
            {{"",GetLocalResourceObject("TaskText_Email").ToString(),"javascript:EmailSend();","false"},
             {"tskMailMerge",GetLocalResourceObject("TaskText_MailMerge").ToString(),"javascript:WriteMailMergeEx();","false"},
             {"tskAddToGroup", GetLocalResourceObject("TaskText_AddToGroup").ToString(),"javascript:showAdHocList(Ext.EventObject);", "false"},
             {"tskRemoveFromGroup",GetLocalResourceObject("TaskText_Remove").ToString(),"javascript:removeCurrentFromGroup();","false"},
             {"tskInsertNote",GetLocalResourceObject("TaskText_AddNote").ToString(),"","false"},
             {"tskNewMeeting",GetLocalResourceObject("TaskText_Meeting").ToString(),"","false"},
             {"tskNewPhoneCall",GetLocalResourceObject("TaskText_PhoneCall").ToString(),"","false"},
             {"tskNewToDo",GetLocalResourceObject("TaskText_ToDo").ToString(),"","false"}};
        tasksByEntity.Add("IContract", contractsTasks);

        string[,] salesOrdersTasks = 
            {{"tskAddToGroup", GetLocalResourceObject("TaskText_AddToGroup").ToString(),"javascript:showAdHocList(Ext.EventObject);", "false"},
             {"tskRemoveFromGroup",GetLocalResourceObject("TaskText_Remove").ToString(),"javascript:removeCurrentFromGroup();","false"},
             {"tskInsertNote",GetLocalResourceObject("TaskText_AddNote").ToString(),"","false"},
             {"tskNewMeeting",GetLocalResourceObject("TaskText_Meeting").ToString(),"","false"},
             {"tskNewPhoneCall",GetLocalResourceObject("TaskText_PhoneCall").ToString(),"","false"},
             {"tskNewToDo",GetLocalResourceObject("TaskText_ToDo").ToString(),"","false"}};
        tasksByEntity.Add("ISalesOrder", salesOrdersTasks);

        string[,] codePickListTasks = { { "tskAddNewPickList", GetLocalResourceObject("TaskText_AddNewPickList").ToString(), "", "false" } };
        tasksByEntity.Add("IDBCodePickList", codePickListTasks);


        #endregion
    }
    #endregion
    internal class Layout
    {
        public string ColumnName;
        private string _caption = string.Empty;
        public string ColumnCaption
        {
            get
            {
                if (string.IsNullOrEmpty(_caption))
                {
                    return ColumnName;
                }
                return _caption;
            }
            set { _caption = value; }
        }
        public string FormatType;
        public string FormatString;
        public bool Visible;
        public int Width;
    }
}

