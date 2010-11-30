using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Data.OleDb;
using System.Drawing;
using System.IO;
using System.Reflection;
using System.Text;
using System.Web.UI;
using System.Web.UI.WebControls;

using Sage.Entity.Interfaces;
using Sage.Platform;
using Sage.Platform.Application;
using Sage.Platform.Application.UI;
using Sage.Platform.Configuration;
using Sage.Platform.Data;
using Sage.Platform.Orm.Attributes;
using Sage.Platform.Repository;
using Sage.Platform.Security;
using Sage.Platform.WebPortal;
using Sage.Platform.WebPortal.Services;
using Sage.Platform.WebPortal.SmartParts;
using Sage.SalesLogix.Orm;
using Sage.SalesLogix.Security;
using Sage.SalesLogix.Services.SpeedSearch;
using Sage.SalesLogix.Services.SpeedSearch.SearchSupport;
using Sage.SalesLogix.Web;
using AttributeCollection = System.ComponentModel.AttributeCollection;
using Sage.Platform.Orm;

public partial class SmartParts_SpeedSearch : UserControl, ISmartPartInfoProvider
{

    // This controls which of two paging mechanisms is used to handle switching between
    // pages of search results (i.e., items 1-10, 11-20, etc.).  
    //
    // If true, SearchResults are stored in a session variable, so when a different page
    // is requested, the results are available.  This is easy and quick, but can require
    // a lot of memory on a high-traffic site as sessions accumulate, and also makes
    // load-balancing with multiple servers more difficult.
    //
    // If false, SearchResults are re-generated for each page, so nothing has to be
    // kept in the Session.  This is somewhat more complicated but eliminates
    // the need to keep Session data on the server, and therefore is recommended, especially
    // for high-traffic sites.
    private int whichResultsPage = 0;
    private int totalDocCount = 0;
    private SpeedSearchResults Results;
    private int ItemsPerPage = 10;
    private List<IIndexDefinition> _Indexes = null;
    private List<DBIndexDefinition> _DBIndexDefs = new List<DBIndexDefinition>();
    private Dictionary<string, SlxFieldDefinition> _SearchFilters =
        new Dictionary<string, SlxFieldDefinition>(StringComparer.InvariantCultureIgnoreCase);
    private Dictionary<string, Type> _TablesEntities = null;
    private string _CurrentIndexName = string.Empty;
    private int _UserType = 1;
    private bool _DisplayLink = false;
    private SpeedSearchState _State = null;
    private EntityBase _ResultEntity = null;
    private string _ResultProperty = string.Empty;
    private string _ChildPropertyName = string.Empty;

    #region Services
    private ConfigurationManager _Context;
    private SLXUserService m_SLXUserService;
    public SLXUserService UserService
    {
        get
        {
            return m_SLXUserService;
        }
        set
        {
            m_SLXUserService = value;
        }
    }

    private IWebDialogService _dialogService;
    [ServiceDependency]
    public IWebDialogService DialogService
    {
        get { return _dialogService; }
        set { _dialogService = value; }
    }

    private IEntityContextService m_EntityContextService;
    private WorkItem _workItem;
    [Microsoft.Practices.Unity.InjectionMethod]
    public void InitEntityContext([ServiceDependency]WorkItem parentWorkItem)
    {
        _workItem = parentWorkItem;
        m_EntityContextService = _workItem.Services.Get<IEntityContextService>();
    }
    #endregion

    #region Web Form Designer generated code
    override protected void OnInit(EventArgs e)
    {
        //
        // CODEGEN: This call is required by the ASP.NET Web Form Designer.
        //
        //InitializeComponent();
        base.OnInit(e);
    }

    #endregion

    protected string Localize(string key, string defaultValue)
    {
        object result = GetLocalResourceObject(key);
        if (result != null)
            return result as string;

        result = GetGlobalResourceObject("SpeedSearch", key);
        if (result != null)
            return result as string;

        return defaultValue;
    }

    protected void Page_Load(object sender, EventArgs e)
    {

        _Context = ApplicationContext.Current.Services.Get<ConfigurationManager>();
        if (this.Visible)
        {
            if ((DialogService.SmartPartMappedID == "SpeedSearch") && (DialogService.DialogParameters.Count > 0))
            {
                _ChildPropertyName = DialogService.DialogParameters["ChildName"].ToString();
                _ResultProperty = DialogService.DialogParameters["EntityProperty"].ToString();
            }
            _Context = ApplicationContext.Current.Services.Get<ConfigurationManager>();
            m_SLXUserService = ApplicationContext.Current.Services.Get<IUserService>() as SLXUserService;
            if (m_SLXUserService is WebPortalUserService)
            {
                _UserType = 0;
            }
            SearchResultsGrid.PageIndexChanged +=
                new DataGridPageChangedEventHandler(SearchResultsGrid_PageIndexChanged);
            btnAdvanced.NavigateUrl = string.Format("javascript:ToggleAdvanced('{0}')", btnAdvanced.ClientID);
            LoadIndexes();
            CreateIndexControls();
            GenerateScript();

            IContextService context = Sage.Platform.Application.ApplicationContext.Current.Services.Get<IContextService>(true);
            if (context.HasContext("SearchRequestText"))
            {
                SearchRequest.Text = (string)context.GetContext("SearchRequestText");
                context.RemoveContext("SearchRequestText");
                SearchButton_Click(null, null);
                return;
            }

            if (Session[ClientID] != null)
            {
                initResults(Session[ClientID].ToString());
                DataSet resultSet = (DataSet)Session[ClientID + "DataSet"];
                ShowPage(resultSet);
                if ((DialogService.SmartPartMappedID == "SpeedSearch") && (DialogService.DialogParameters.Count > 0) && (Page.Request.Browser.Browser != "IE"))
                {
                    Control parent = this.Parent;
                    while (!(parent == null || parent is UpdatePanel))
                    {
                        parent = parent.Parent;
                    }
                    if (parent != null)
                    {
                        ((UpdatePanel)parent).Update();
                    }
                }
            }
        }
    }

    private string EscapeJavaScript(string text)
    {
        if (String.IsNullOrEmpty(text))
            return text;

        return text.Replace("\\", "\\\\").Replace("\"", "\\\"").Replace("'", "\\'");
    }

    private void GenerateScript()
    {
        StringBuilder script = new StringBuilder();
        script.AppendLine("function ToggleAdvanced(hyperLinkId)");
        script.AppendLine("{");
        script.AppendLine("    var advDiv = document.getElementById(\"Advanced\");");
        script.AppendLine("    var btnAdv = document.getElementById(hyperLinkId);");
        script.AppendLine("    if (advDiv.style.display == \"block\")");
        script.AppendLine("    {");
        script.AppendLine("        advDiv.style.display = \"none\";");
        script.AppendLine("        btnAdv.innerHTML = \"" + EscapeJavaScript(Localize("SpeedSearch_href_Advanced.Text", "Advanced")) + "\";");
        script.AppendLine("    }");
        script.AppendLine("    else");
        script.AppendLine("    {");
        script.AppendLine("        advDiv.style.display = \"block\";");
        script.AppendLine("        btnAdv.innerHTML = \"" + EscapeJavaScript(Localize("SpeedSearch_href_Standard.Text", "Standard")) + "\";");
        script.AppendLine("    }");
        script.AppendLine("}");
        script.AppendLine("function GetPreviewDoc(id, preview)");
        script.AppendLine("{");
        script.AppendLine("        var vdocId = id;");
        script.AppendLine("        if (preview == \"false\")");
        script.AppendLine("        {");
        script.AppendLine("            vdocId = \"NoAccess\";");
        script.AppendLine("        }");
        script.AppendFormat("        var vURL = \"SLXSearchDocHandler.aspx?docid=\" + vdocId + \"&clientid={0}\";", ClientID);
        script.AppendLine();
        script.AppendLine("        if (typeof(xmlhttp) == \"undefined\")");
        script.AppendLine("        {");
        script.AppendLine("            xmlhttp = YAHOO.util.Connect.createXhrObject().conn;");
        script.AppendLine("        }");
        script.AppendLine("        xmlhttp.open(\"GET\", vURL, false);");
        script.AppendLine("        xmlhttp.send(null);");
        script.AppendLine("        var results = xmlhttp.responseText;");
        script.AppendLine("        if (results == \"NOTAUTHENTICATED\")");
        script.AppendLine("        {");
        script.AppendLine("            window.location.reload(true);");
        script.AppendLine("            return;");
        script.AppendLine("        }");
        script.AppendLine("        var vwin = window.open();");
        script.AppendLine("        var oNewDoc = vwin.document.open(\"text/html\", \"Preview\");");
        script.AppendLine("        oNewDoc.write(results);");
        script.AppendLine("        oNewDoc.close();");
        script.AppendLine("}");
        script.AppendLine("function MarkUsed(docId, index, identifier, dbid, id)");
        script.AppendLine("{");
        script.AppendFormat("    var info = document.getElementById('{0}');", MarkUsedInfo.ClientID); //<%= MarkUsedInfo.ClientID %>
        script.AppendFormat("    var currentIdx = document.getElementById('{0}');", currentIndex.ClientID); //<%= currentIndex.ClientID %>
        script.AppendLine("    currentIdx.value = id;");
        script.AppendLine("    info.value = docId + \"|\" + index + \"|\" + identifier + \"|\" + dbid;");
        script.AppendLine("    if (Sys)");
        script.AppendLine("    {");
        script.AppendFormat("        Sys.WebForms.PageRequestManager.getInstance()._doPostBack('{0}', null);",
                            HiddenField0.ClientID); //<%= HiddenField0.ClientID %>
        script.AppendLine("    }");
        script.AppendLine("    else");
        script.AppendLine("    {");
        script.AppendLine("        document.forms(0).submit();");
        script.AppendLine("    }");
        script.AppendLine("}");
        script.AppendLine("function ReturnResult(id)");
        script.AppendLine("{");
        script.AppendFormat("        var postBackBtn = document.getElementById(\"{0}\");", btnReturnResult.ClientID);
        script.AppendFormat("        var returnResultAction = document.getElementById(\"{0}\");", ReturnResultAction.ClientID);
        script.AppendFormat("        var currentIdx = document.getElementById(\"{0}\");", currentIndex.ClientID);
        script.AppendFormat("        var info = document.getElementById('{0}');", MarkUsedInfo.ClientID); //<%= MarkUsedInfo.ClientID %>
        script.AppendLine("        info.value = \"\";");
        script.AppendLine("        currentIdx.value = id;");
        script.AppendLine("        returnResultAction.value = '1';");
        script.AppendLine("        postBackBtn.click();");
        script.AppendLine("        currentIdx.value = \"\";");
        script.AppendLine("}");
        script.AppendLine("function HandleEnterKeyEvent(e)");
        script.AppendLine("{");
        script.AppendLine("    if (!e) var e = window.event;");
        script.AppendLine("    if (e.keyCode == 13) //Enter");
        script.AppendLine("    {");
        //script.AppendLine("    //debugger; ");
        script.AppendLine("        e.returnValue = false;");
        script.AppendLine("        e.cancelBubble = true;");
        script.AppendLine("        if (e.stopPropagation) e.stopPropagation();");
        script.AppendFormat("        var btn = document.getElementById(\"{0}\");", SearchButton.ClientID);
        script.AppendLine("        if (document.createEvent)");
        script.AppendLine("        {");
        script.AppendFormat("            __doPostBack('{0}', 'OnClick'); ", SearchButton.UniqueID);  //btn.dispatchEvent(evt);
        script.AppendLine("        }");
        script.AppendLine("        else");
        script.AppendLine("        {");
        script.AppendLine("            btn.click();");
        script.AppendLine("        }");
        script.AppendLine("    }");
        script.AppendLine("}");

        ScriptManager.RegisterStartupScript(Page, GetType(), ClientID, script.ToString(), true);
    }

    protected override void OnPreRender(EventArgs e)
    {
        if (this.Visible)
        {
            InitializeState();
            if (!string.IsNullOrEmpty(MarkUsedInfo.Value))
            {
                SetItemAsUsed();
                MarkUsedInfo.Value = string.Empty;
            }
            if (!string.IsNullOrEmpty(ReturnResultAction.Value))
            {
                ReturnResult();
                ReturnResultAction.Value = string.Empty;
                WebPortalPage page = Page as WebPortalPage;
                if (page != null)
                {
                    IPanelRefreshService refresher = page.PageWorkItem.Services.Get<IPanelRefreshService>();
                    if (refresher != null)
                    {
                        refresher.RefreshAll();
                    }
                }
            }
            if (!string.IsNullOrEmpty(currentIndex.Value))
            {
                Literal document = new Literal();
                if (currentIndex.Value.Equals("NoAccess"))
                {
                    document.Text = GetLocalResourceObject("SpeedSearch_Result_NoAccess").ToString();
                }
                else
                {
                    int index = (string.IsNullOrEmpty(CurrentPageIndex.Value)) ? 0 : int.Parse(CurrentPageIndex.Value);
                    whichResultsPage = index;
                    //SpeedSearchWebService.SpeedSearchService ss = new SpeedSearchWebService.SpeedSearchService();
                    //ss.Url = ConfigurationManager.AppSettings.Get("SpeedSearchWebService.SpeedSearchService");
                    SpeedSearchService ss = new SpeedSearchService();
                    SpeedSearchQuery ssq = BuildQuery();
                    ssq.DocTextItem = int.Parse(currentIndex.Value);
                    string xml = ss.DoSpeedSearch(ssq.GetAsXml());
                    Results = SpeedSearchResults.LoadFromXml(xml);
                    document.Text = Results.Items[0].HighlightedDoc;
                }
                currentIndex.Value = "";
                FirstPage.Visible = true;
                PreviousPage.Visible = true;
                NextPage.Visible = true;
                LastPage.Visible = true;
                //SearchDocumentPanel.ContentTemplateContainer.Controls.Add(document);
            }
        }
        base.OnPreRender(e);
    }

    private void CreateIndexControls()
    {
        if (_Indexes != null)
        {
            Literal outerDiv = new Literal();
            outerDiv.Text = "<div style='border:inset 1px;overflow-y:scroll;height:160px;'>";
            PlaceHolder1.Controls.Add(outerDiv);

            int itemCount = 0;
            foreach (IIndexDefinition id in _Indexes)
            {
                if (id.Type == 1)
                {
                    DBIndexDefinition dbid = DBIndexDefinition.SetFromString(id.MetaData);
                    _DBIndexDefs.Add(dbid);
                    foreach (SlxFieldDefinition fd in dbid.FilterFields)
                    {
                        fd.IndexType = 1;
                        SlxFieldDefinition temp;
                        if (_SearchFilters.ContainsKey(fd.DisplayName))
                        {
                            _SearchFilters.TryGetValue(fd.DisplayName, out temp);
                            temp.CommonIndexes += "," + id.IndexName;
                            _SearchFilters.Remove(fd.DisplayName);
                        }
                        else
                        {
                            temp = SlxFieldDefinition.SetFromString(fd.GetAsString());
                            temp.CommonIndexes = id.IndexName;
                        }
                        _SearchFilters.Add(temp.DisplayName, temp);
                    }
                }
                else
                {
                    if (!_SearchFilters.ContainsKey("File Name"))
                    {
                        SlxFieldDefinition fd = new SlxFieldDefinition();
                        fd.DisplayName = "name";
                        fd.FieldType = 1;
                        fd.IndexType = 0;
                        _SearchFilters.Add("File Name", fd);
                    }
                    if (!_SearchFilters.ContainsKey("File Last Modified"))
                    {
                        SlxFieldDefinition fd = new SlxFieldDefinition();
                        fd.DisplayName = "date";
                        fd.FieldType = 11;
                        fd.IndexType = 0;
                        _SearchFilters.Add("File Last Modified", fd);
                    }
                    if (!_SearchFilters.ContainsKey("File Date Created"))
                    {
                        SlxFieldDefinition fd = new SlxFieldDefinition();
                        fd.DisplayName = "created";
                        fd.FieldType = 11;
                        fd.IndexType = 0;
                        _SearchFilters.Add("File Date Created", fd);
                    }
                }
                Literal rowDiv = new Literal();
                rowDiv.Text = "<div>";
                PlaceHolder1.Controls.Add(rowDiv);

                CheckBox cb = new CheckBox();
                cb.ID = "Index" + itemCount.ToString();
                cb.Text = Localize(IndexDefinitionToResourceKey(id), id.IndexName);
                cb.LabelAttributes.Add("id", "lblIndex" + itemCount.ToString());
                cb.Checked = true;
                cb.CssClass = "slxlabel";
                cb.Style.Add(HtmlTextWriterStyle.MarginLeft, "5px");
                cb.ForeColor = Color.Navy;
                PlaceHolder1.Controls.Add(cb);

                Literal endRowDiv = new Literal();
                endRowDiv.Text = "</div>";
                PlaceHolder1.Controls.Add(endRowDiv);
                itemCount++;
            }
            Literal endouterDiv = new Literal();
            endouterDiv.Text = "</div>";
            PlaceHolder1.Controls.Add(endouterDiv);
        }
        CreateFilterControls();
    }

    private string StripSpecialChars(string text)
    {
        text = text.Replace(" ", "_");
        text = text.Replace(".", "_");
        text = text.Replace("-", "_");
        text = text.Replace("=", "_");
        text = text.Replace("!", "_");
        text = text.Replace("?", "_");
        text = text.Replace("#", "_");

        return text;
    }

    private string IndexDefinitionToResourceKey(IIndexDefinition definition)
    {
        return String.Format("INDEX_{0}", StripSpecialChars(definition.IndexName)).ToUpper();
    }

    private string FieldDefinitionToResourceKey(SlxFieldDefinition definition)
    {
        string name = definition.DisplayName;
        //string name = definition.TextPath;

        //fix custom created ones from above (so the keys are more descriptive).      
        switch (name)
        {
            case "name":
                name = "File Name";
                break;
            case "date":
                name = "File Last Modified";
                break;
            case "created":
                name = "File Date Created";
                break;
        }

        return String.Format("FILTER_{0}", StripSpecialChars(name)).ToUpper();
    }

    private void CreateFilterControls()
    {
        Literal outerDiv = new Literal();
        outerDiv.Text = "<div style='border:inset 1px;overflow-y:scroll;height:160px;'><table style='width:100%'>";
        PlaceHolder2.Controls.Add(outerDiv);

        // Add Frequently Used filter to the top.
        // ********************************************
        Literal freqrow = new Literal();
        freqrow.Text = "<tr><td colspan='2' style='word-wrap:normal;'>";
        PlaceHolder2.Controls.Add(freqrow);

        Label freqlbl = new Label();
        freqlbl.Text = GetLocalResourceObject("SpeedSearch_Label_FrequentlyUsed").ToString();
        freqlbl.CssClass = "slxlabel";
        freqlbl.ForeColor = Color.Navy;
        freqlbl.Style.Add(HtmlTextWriterStyle.MarginLeft, "5px");
        PlaceHolder2.Controls.Add(freqlbl);

        Literal freqCol2 = new Literal();
        freqCol2.Text = "</td><td style='width:55%'>";
        PlaceHolder2.Controls.Add(freqCol2);

        CheckBox cb = new CheckBox();
        cb.ID = "FreqUsed";
        cb.Checked = false;
        cb.CssClass = "slxtext";
        PlaceHolder2.Controls.Add(cb);

        Literal freqEndCol = new Literal();
        freqEndCol.Text = "</td></tr>";
        PlaceHolder2.Controls.Add(freqEndCol);
        //*********************************************
        int idx = 0;
        foreach (string key in _SearchFilters.Keys)
        {
            Literal row = new Literal();
            row.Text = "<tr><td style='width:30%;word-wrap:normal;'>";
            PlaceHolder2.Controls.Add(row);

            SlxFieldDefinition fd;
            _SearchFilters.TryGetValue(key, out fd);
            Label lbl = new Label();
            lbl.ID = "lblFilterField" + idx.ToString();
            lbl.Text = Localize(FieldDefinitionToResourceKey(_SearchFilters[key]), key.Replace('_', ' '));
            lbl.CssClass = "slxlabel";
            lbl.ForeColor = Color.Navy;
            lbl.Style.Add(HtmlTextWriterStyle.MarginLeft, "5px");
            PlaceHolder2.Controls.Add(lbl);

            Literal nextCol = new Literal();
            nextCol.Text = "</td><td style='width:10%'>";
            PlaceHolder2.Controls.Add(nextCol);

            Label lbl2 = new Label();
            lbl2.ID = "lblFilterType" + idx.ToString();
            //lbl2.Width = new Unit("50px");
            if (fd.FieldType == 11) // Date-11, string-1, SlxId-23
            {
                lbl2.Text = Localize("SpeedSearch_Filter_Within", "Within");
            }
            else
            {
                lbl2.Text = Localize("SpeedSearch_Filter_Like", "Like");
            }
            lbl2.CssClass = "slxlabel";
            lbl2.ForeColor = Color.Navy;
            PlaceHolder2.Controls.Add(lbl2);

            Literal nextCol2 = new Literal();
            nextCol2.Text = "</td><td style='width:45%'>";
            PlaceHolder2.Controls.Add(nextCol2);

            TextBox txt = new TextBox();
            txt.Width = new Unit("90%");
            txt.ID = fd.DisplayName;
            txt.CssClass = "slxtext";
            PlaceHolder2.Controls.Add(txt);

            Literal endCol = new Literal();
            endCol.Text = "</td></tr>";
            PlaceHolder2.Controls.Add(endCol);
            idx++;
        }

        Literal endouterDiv = new Literal();
        endouterDiv.Text = "</table></div>";
        PlaceHolder2.Controls.Add(endouterDiv);

    }

    protected void SearchButton_Click(object sender, EventArgs e)
    {
        CurrentPageIndex.Value = "0";
        whichResultsPage = 0;
        DoSearch();
        ShowPage();
    }
    protected void SortByDateButton_Click(object sender, EventArgs e)
    {
        whichResultsPage = 0;

        DoSearch();
        ShowPage();
    }

    //protected void btnReturnResult_Click(object sender, EventArgs e)
    private void ReturnResult()
    {
        InitializeState();
        int index = (string.IsNullOrEmpty(CurrentPageIndex.Value)) ? 0 : int.Parse(CurrentPageIndex.Value);
        if (string.IsNullOrEmpty(currentIndex.Value)) return;
        whichResultsPage = index;
        SpeedSearchService ss = new SpeedSearchService();
        SpeedSearchQuery ssq = BuildQuery();
        ssq.DocTextItem = int.Parse(currentIndex.Value) + 1000000;
        string xml = ss.DoSpeedSearch(ssq.GetAsXml());
        Results = SpeedSearchResults.LoadFromXml(xml);

        _ResultEntity = (EntityBase)m_EntityContextService.GetEntity();
        if (!string.IsNullOrEmpty(_ChildPropertyName))
        {
            PropertyDescriptor child = TypeDescriptor.GetProperties(_ResultEntity.GetType())[_ChildPropertyName];
            _ResultEntity = (EntityBase)child.GetValue(_ResultEntity);
        }
        PropertyDescriptor resultProp = TypeDescriptor.GetProperties(_ResultEntity.GetType())[_ResultProperty];
        resultProp.SetValue(_ResultEntity, Results.Items[0].HighlightedDoc);

        DialogService.CloseEventHappened(null, null);
    }

    public void DoSearch()
    {
        currentIndex.Value = "";
        _State = new SpeedSearchState();
        _State.SearchText = SearchRequest.Text;
        _State.SearchTypeIdx = SearchType.SelectedIndex;
        _State.Root = SearchFlags.Items[0].Selected;
        _State.Thesaurus = SearchFlags.Items[1].Selected;
        _State.SoundsLike = SearchFlags.Items[2].Selected;
        _State.MaxResults = int.Parse(MaxResults.SelectedValue);
        //SpeedSearchWebService.SpeedSearchService ss = new SpeedSearchWebService.SpeedSearchService();
        //ss.Url = ConfigurationManager.AppSettings.Get("SpeedSearchWebService.SpeedSearchService");
        SpeedSearchService ss = new SpeedSearchService();
        SpeedSearchQuery ssq = BuildQuery();
        if (Session[ClientID + "_SearchQry"] != null)
        {
            Session[ClientID + "_SearchQry"] = ssq.GetAsXml();
        }
        else
        {
            Session[ClientID + "_SearchQry"] = ssq.GetAsXml();
        }
        string xml = ss.DoSpeedSearch(ssq.GetAsXml());
        if (Session[ClientID] != null)
        {
            Session[ClientID] = xml;
        }
        else
        {
            Session[ClientID] = xml;
        }
        initResults(xml);
        if (!_Context.IsConfigurationTypeRegistered(typeof(SpeedSearchState)))
        {
            _Context.RegisterConfigurationType(typeof(SpeedSearchState));
        }
        _Context.WriteConfiguration(_State);
    }

    private void initResults(string resultsXml)
    {
        Results = SpeedSearchResults.LoadFromXml(resultsXml);
        totalDocCount = Results.TotalCount;
        int max = int.Parse(MaxResults.SelectedValue);
        if ((max > 0) && (totalDocCount > max))
        {
            totalDocCount = max;
        }
        if (totalDocCount > 0)
        {
            FirstPage.Visible = true;
            PreviousPage.Visible = true;
            NextPage.Visible = true;
            LastPage.Visible = true;
        }
        int startPage = (totalDocCount > 0) ? ((whichResultsPage * 10) + 1) : 0;
        int end = (whichResultsPage + 1) * 10;
        if (end > totalDocCount)
        {
            end = totalDocCount;
        }
        PagingLabel.Text = string.Format(GetLocalResourceObject("SpeedSearch_Label_PagingLabel").ToString(),
            startPage, end, totalDocCount);
        TotalCount.Value = totalDocCount.ToString();
    }

    private SpeedSearchQuery BuildQuery()
    {
        SpeedSearchQuery ssq = new SpeedSearchQuery();
        ssq.SearchText = SearchRequest.Text;
        ssq.SearchType = SearchType.SelectedIndex;
        ssq.IncludeStemming = SearchFlags.Items[0].Selected;
        ssq.IncludeThesaurus = SearchFlags.Items[1].Selected;
        ssq.IncludePhonic = SearchFlags.Items[2].Selected;
        ssq.WhichPage = whichResultsPage;
        ssq.ItemsPerPage = 10;
        for (int i = 0; i < _Indexes.Count; i++)
        {
            CheckBox thisIndex = (CheckBox)PlaceHolder1.FindControl("Index" + i.ToString());
            if ((thisIndex != null) && (thisIndex.Checked))
            {
                ssq.Indexes.Add(_Indexes[i].IndexName);
                _State.SelectedIndexes.Add(i);
            }
        }
        CheckBox freqfilter = (CheckBox)PlaceHolder2.FindControl("FreqUsed");
        if ((freqfilter != null) && (freqfilter.Checked))
        {
            ssq.UseFrequentFilter = true;
        }
        foreach (SlxFieldDefinition fd in _SearchFilters.Values)
        {
            TextBox filter = (TextBox)PlaceHolder2.FindControl(fd.DisplayName);
            if ((filter != null) && (!string.IsNullOrEmpty(filter.Text)))
            {
                ssq.Filters.Add(new SpeedSearchFilter(fd.DisplayName, filter.Text, fd.CommonIndexes, fd.FieldType, fd.IndexType));
            }
        }
        return ssq;
    }

    public void ShowPage()
    {
        ShowPage(null);
    }

    public void ShowPage(DataSet resultSet)
    {
        // Do not display the grid if there are no results
        PagingLabel.Visible = true;
        if ((Results != null) && (Results.Items.Count == 0))
        {
            SearchResultsGrid.Visible = false;
            StatusLabel.Visible = true;
            if (!String.IsNullOrEmpty(Results.ErrorMessage))
            {
                StatusLabel.Text = Results.ErrorMessage;
                PagingLabel.Visible = false;
            }
            else
            {
                StatusLabel.Text = GetLocalResourceObject("SpeedSearch_Label_NoResults").ToString();
            }
        }
        else
        {
            StatusLabel.Visible = false;
            SearchResultsGrid.Visible = true;
        }


        // Populate the DataGrid
        SearchResultsGrid.DataSource = resultSet;
        if (resultSet == null)
        {
            SearchResultsGrid.DataSource = ResultsToDataSet();
            if (Session[ClientID] != null)
            {
                Session[ClientID + "DataSet"] = SearchResultsGrid.DataSource;
            }
            else
            {
                Session[ClientID + "DataSet"] = SearchResultsGrid.DataSource;
            }
        }
        SearchResultsGrid.PageSize = ItemsPerPage;
        SearchResultsGrid.CurrentPageIndex = whichResultsPage;
        SearchResultsGrid.VirtualItemCount = totalDocCount;
        SearchResultsGrid.DataBind();

        Results = null;
    }

    private void InitializeState()
    {
        if (_State == null)
        {
            if (!_Context.IsConfigurationTypeRegistered(typeof(SpeedSearchState)))
            {
                _Context.RegisterConfigurationType(typeof(SpeedSearchState));
            }
            _State = _Context.GetConfiguration<SpeedSearchState>();
        }
        if ((_State != null) && (_State.SelectedIndexes.Count > 0))
        {
            SearchRequest.Text = _State.SearchText;
            SearchType.SelectedIndex = _State.SearchTypeIdx;
            MaxResults.SelectedValue = _State.MaxResults.ToString();
            SearchFlags.Items[0].Selected = _State.Root;
            SearchFlags.Items[1].Selected = _State.Thesaurus;
            SearchFlags.Items[2].Selected = _State.SoundsLike;
            for (int idx = 0; idx < _Indexes.Count; idx++)
            {
                CheckBox thisIndex = (CheckBox)PlaceHolder1.FindControl("Index" + idx.ToString());
                if (thisIndex != null)
                {
                    thisIndex.Checked = false;
                    if (_State.SelectedIndexes.Contains(idx))
                    {
                        thisIndex.Checked = true;
                    }
                }
            }
        }
    }

    // Convert dtSearch SearchResults to a DataSet, so the DataSet can be bound
    // to a DataGrid control
    private DataSet ResultsToDataSet()
    {
        DataSet dataSet = new DataSet();
        DataTable dataTable = new DataTable("SearchResults");
        dataTable.Columns.Add(new DataColumn("Score")); //0
        dataTable.Columns.Add(new DataColumn("HitCount")); //1
        dataTable.Columns.Add(new DataColumn("DisplayName")); //2
        dataTable.Columns.Add(new DataColumn("HighlightLink")); //3
        dataTable.Columns.Add(new DataColumn("DirectLink")); //4
        dataTable.Columns.Add(new DataColumn("Date")); //5 
        dataTable.Columns.Add(new DataColumn("Size")); //6
        dataTable.Columns.Add(new DataColumn("Synopsis")); //7
        dataTable.Columns.Add(new DataColumn("Source")); //8
        dataTable.Columns.Add(new DataColumn("RelationName1")); //9
        dataTable.Columns.Add(new DataColumn("RelationLink1")); //10
        dataTable.Columns.Add(new DataColumn("RelationName2")); //11
        dataTable.Columns.Add(new DataColumn("RelationLink2")); //12
        dataTable.Columns.Add(new DataColumn("RelationName3")); //13
        dataTable.Columns.Add(new DataColumn("RelationLink3")); //14
        dataTable.Columns.Add(new DataColumn("RelationName4")); //15
        dataTable.Columns.Add(new DataColumn("RelationLink4")); //16
        dataTable.Columns.Add(new DataColumn("FullDoc")); //17
        dataTable.Columns.Add(new DataColumn("AllowPreview")); //18
        dataTable.Columns.Add(new DataColumn("DisplayReturnResult")); //19

        foreach (SpeedSearchResultItem item in Results.Items)
        {
            DataRow row = dataTable.NewRow();
            int start = item.IndexRetrievedFrom.LastIndexOf("\\") + 1;
            _CurrentIndexName = item.IndexRetrievedFrom.Substring(start, item.IndexRetrievedFrom.Length - start);
            IIndexDefinition currentIdx = _Indexes.Find(IndexNameMatch);
            row[0] = item.ScorePercent;
            row[1] = item.HitCount;

            if (currentIdx.Type == 0)
            {
                row[2] = item.DisplayName;
                row[3] = item.FileName;
                row[18] = "true";
            }
            else
            {
                string tempName = item.DisplayName;
                int idx = tempName.Length - 12;
                string key = tempName.Substring(idx);
                string tableName = tempName.Substring(0, tempName.IndexOf(" "));


                row[2] = GetEntityDisplay(GetEntityFromTable(tableName), key, item.DisplayName);
                row[18] = "false";
                if (_DisplayLink)
                {
                    row[18] = "true";
                    string path = Page.ResolveUrl(string.Format("{0}.aspx", tableName));
                    path = Page.MapPath(path);
                    bool pageexists = File.Exists(path);
                    if (pageexists)
                    {
                        row[3] = string.Format("javascript:Link.entityDetail('{1}', '{0}')", key, tableName);
                    }
                }
                else if (m_SLXUserService is WebPortalUserService)
                {
                    row[18] = "true";
                }
            }
            row[5] = item.ModifiedDate;
            row[6] = item.Size / 1024;
            string tempval = item.Synopsis; //&lt;a NAME=TheBody&gt;&lt;/a&gt;
            if (tempval.IndexOf("&lt;a NAME=TheBody&gt;&lt;/a&gt;") > 0)
            {
                tempval = tempval.Remove(tempval.IndexOf("&lt;a NAME=TheBody&gt;&lt;/a&gt;"), 32);
            }
            row[7] = tempval;
            // look up value in App_GlobalResources\SpeedSearch.resx. If not found, use whatever value came back from SS service.
            string sourceValue = GetGlobalResourceObject("SpeedSearch", string.Format("INDEX_{0}", _CurrentIndexName.Replace(" ", "_").ToUpperInvariant())).ToString();
            if (string.IsNullOrEmpty(sourceValue)) sourceValue = _CurrentIndexName;
            row[8] = sourceValue;
            if (item.Fields.ContainsKey("accountid"))
            {
                row[9] = GetEntityDisplay(GetEntityFromTable("ACCOUNT"), item.Fields["accountid"]);
                if (_DisplayLink)
                {
                    row[10] = string.Format("../../{1}.aspx?entityId={0}", item.Fields["accountid"], "ACCOUNT");
                }
            }
            if (item.Fields.ContainsKey("contactid"))
            {
                row[11] = GetEntityDisplay(GetEntityFromTable("CONTACT"), item.Fields["contactid"]);
                if (_DisplayLink)
                {
                    row[12] = string.Format("../../{1}.aspx?entityId={0}", item.Fields["contactid"], "CONTACT");
                }
            }
            if (item.Fields.ContainsKey("opportunityid"))
            {
                row[13] = GetEntityDisplay(GetEntityFromTable("OPPORTUNITY"), item.Fields["opportunityid"]);
                if (_DisplayLink)
                {
                    row[14] = string.Format("../../{1}.aspx?entityId={0}", item.Fields["opportunityid"], "OPPORTUNITY");
                }
            }
            if (item.Fields.ContainsKey("ticketid"))
            {
                row[15] = GetEntityDisplay(GetEntityFromTable("TICKET"), item.Fields["ticketid"]);
                if (_DisplayLink)
                {
                    row[16] = string.Format("../../{1}.aspx?entityId={0}", item.Fields["ticketid"], "TICKET");
                }
            }
            row[17] = item.HighlightedDoc;
            row[19] = "none";
            if ((!string.IsNullOrEmpty(_ResultProperty)) && (row[18].ToString() == "true"))
            {
                row[19] = "block";
            }
            dataTable.Rows.Add(row);
        }
        dataSet.Tables.Add(dataTable);
        return dataSet;
    }

    private bool IndexNameMatch(IIndexDefinition value)
    {
        return value.IndexName.Equals(_CurrentIndexName);
    }

    private void SetItemAsUsed()
    {
        string[] items = MarkUsedInfo.Value.Split('|');
        IRepository<IIndexStatistics> rep = EntityFactory.GetRepository<IIndexStatistics>();
        IQueryable qry = (IQueryable)rep;
        IExpressionFactory ef = qry.GetExpressionFactory();
        ICriteria crit = qry.CreateCriteria();
        IIndexStatistics stats = crit.Add(ef.Eq("Id", items[0])).UniqueResult<IIndexStatistics>();
        if (stats != null)
        {
            stats.TotalCount++;
            stats.LastHitDate = DateTime.Now.ToUniversalTime();
            if (_UserType == 0)
            {
                stats.CustomerHitCount++;
            }
            else
            {
                stats.EmployeeHitCount++;
            }
            stats.Save();
        }
        else
        {
            string SQL = "INSERT INTO INDEXSTATS (DOCUMENTID, SEARCHINDEX, IDENTIFIER, CUSTOMERHITCOUNT, EMPLOYEEHITCOUNT, TOTALCOUNT, LASTHITDATE, DBID) VALUES (?,?,?,?,?,?,?,?)";
            IDataService service = Sage.Platform.Application.ApplicationContext.Current.Services.Get<IDataService>();
            using (var conn = service.GetOpenConnection() as OleDbConnection)
            using (var cmd = conn.CreateCommand(SQL) as OleDbCommand)
            {
                if (cmd != null)
                {
                    cmd.Parameters.Clear();
                    cmd.Parameters.AddWithValue("@DOCUMENTID", items[0]);
                    cmd.Parameters.AddWithValue("@SEARCHINDEX", items[1]);
                    cmd.Parameters.AddWithValue("@IDENTIFIER", items[2]);
                    if (_UserType == 0)
                    {
                        cmd.Parameters.AddWithValue("@CUSTOMERHITCOUNT", 1);
                        cmd.Parameters.AddWithValue("@EMPLOYEEHITCOUNT", 0);
                    }
                    else
                    {
                        cmd.Parameters.AddWithValue("@CUSTOMERHITCOUNT", 0);
                        cmd.Parameters.AddWithValue("@EMPLOYEEHITCOUNT", 1);
                    }
                    cmd.Parameters.AddWithValue("@TOTALCOUNT", 1);
                    cmd.Parameters.AddWithValue("@LASTHITDATE", DateTime.Now.ToUniversalTime());
                    cmd.Parameters.AddWithValue("@DBID", items[3]);
                    cmd.ExecuteNonQuery();
                }
            }
        }
    }

    private void LoadIndexes()
    {
        if ((_Indexes == null) || (_Indexes.Count == 0))
        {
            IRepository<IIndexDefinition> rep = EntityFactory.GetRepository<IIndexDefinition>();
            IQueryable qry = (IQueryable)rep;
            IExpressionFactory ef = qry.GetExpressionFactory();
            ICriteria crit = qry.CreateCriteria();
            IExpression accessExp = ef.Le("UserAccess", _UserType);
            crit.Add(ef.And(accessExp, ef.Eq("Enabled", true)));
            crit.AddOrder(ef.Asc("IndexName"));
            IList<IIndexDefinition> tempIndexes = crit.List<IIndexDefinition>();

            //c.Add(NHibernate.Expression.Expression.Eq("Enabled", true));
            //c.Add(Expression.Le("UserAccess", _UserType));
            //c.AddOrder(Order.Asc("IndexName"));
            //List<IndexDefinition> tempIndexes = (List<IndexDefinition>)c.List<IndexDefinition>();

            Assembly interfaceAsm = Assembly.GetAssembly(typeof(IIndexDefinition));
            Type[] types = interfaceAsm.GetTypes();
            _TablesEntities = new Dictionary<string, Type>();
            foreach (Type entity in types)
            {
                AttributeCollection attrs = TypeDescriptor.GetAttributes(entity);
                foreach (Attribute attr in attrs)
                {
                    ActiveRecordAttribute activeRecord = attr as ActiveRecordAttribute;
                    if (activeRecord != null)
                    {
                        _TablesEntities.Add(activeRecord.Table.ToUpper(), entity);
                    }
                }
            }
            _Indexes = new List<IIndexDefinition>();
            foreach (IIndexDefinition index in tempIndexes)
            {
                if (index.Type == 1) // database index
                {
                    DBIndexDefinition dbid = DBIndexDefinition.SetFromString(index.MetaData);
                    if (_TablesEntities.ContainsKey(dbid.MainTable.ToUpper()))
                    {
                        _Indexes.Add(index);
                    }
                }
                else
                {
                    _Indexes.Add(index);
                }
            }
        }
    }

    private string GetEntityDisplay(Type entity, string value)
    {
        return GetEntityDisplay(entity, value, "");
    }

    private string GetEntityDisplay(Type entity, string value, string displayName)
    {
        bool okToDisplay;
        EntityBase Result = null;
        string displayValue = string.Empty;
        if ((entity.Name.Equals("Activity")) || (entity.Name.Equals("IActivity")))
        {
            okToDisplay = ActivitySecurity(value);
            if (okToDisplay)
            {
                Result = (EntityBase)EntityFactory.GetById(entity, value);
            }
        }
        else
        {
            IRepository notifRep = EntityFactory.GetRepository(entity);
            IQueryable qry = (IQueryable)notifRep;
            IExpressionFactory ef = qry.GetExpressionFactory();
            ICriteria crit = qry.CreateCriteria().Add(ef.Eq("Id", value));
            IList<EntityBase> results;
            if ((_UserType == 0) && ((entity.Name.Equals("Ticket")) || (entity.Name.Equals("ITicket"))))
            {
                string portalUser =
                    ((WebPortalUserService)m_SLXUserService).GetPortalUser().Contact.Account.Id.ToString();
                crit.CreateAlias("Account", "A").Add(ef.Eq("A.Id", portalUser));
            }
            results = crit.List<EntityBase>();
            okToDisplay = (results.Count > 0);
            if (okToDisplay)
            {
                Result = results[0];
            }
            else if (!string.IsNullOrEmpty(displayName))
            {
                int pos = displayName.IndexOf('#');
                displayValue = displayName.Substring(pos + 1, displayName.Length - (13 + pos));
            }
        }
        if (!okToDisplay)
        {
            _DisplayLink = false;
            return string.Format(GetLocalResourceObject("SpeedSearch_Result_NoLongerExists").ToString(), entity.Name.Substring(1).ToUpper(), displayValue);
        }
        _DisplayLink = true;
        return GetEntityDisplayName(entity) + ": " + Result;
    }

    private string GetEntityDisplayName(Type entity)
    {
        var displayName = entity.GetDisplayName();

        if (!string.IsNullOrEmpty(displayName))
            return displayName;

        if (entity.IsInterface)
            return entity.Name.Substring(1).ToUpper();
        else
            return entity.Name.ToUpper();
    }

    private bool ActivitySecurity(string id)
    {
        string SQL = string.Format("SELECT ACTIVITYID, NULL \"$ACTIVITYSECURITY$\" FROM ACTIVITY WHERE ACTIVITYID = '{0}'", id);
        IDataService service = Sage.Platform.Application.ApplicationContext.Current.Services.Get<IDataService>();
        using (var conn = service.GetOpenConnection())
        using (var cmd = conn.CreateCommand(SQL))
        using (var reader = cmd.ExecuteReader())
        {
            return reader.Read();
        }
    }


    private Type GetEntityFromTable(string table)
    {
        string key = table.ToUpper();
        if (_TablesEntities.ContainsKey(key))
        {
            return _TablesEntities[key];
        }
        return null;
    }

    protected void SearchResultsGrid_PageIndexChanged(object source, EventArgs e)
    {
        MarkUsedInfo.Value = string.Empty;
        int index = int.Parse(CurrentPageIndex.Value);
        int end = (index + 1) * 10;
        totalDocCount = int.Parse(TotalCount.Value);
        string id = ((ImageButton)source).ID;
        if (id.Equals("NextPage"))
        {
            if (end < totalDocCount)
            {
                index++;
            }
        }
        else if (id.Equals("PreviousPage"))
        {
            if (index > 0)
            {
                index--;
            }
        }
        else if (id.Equals("LastPage"))
        {
            int temp = int.Parse(TotalCount.Value);
            index = temp / 10;
            if ((index * 10) == temp)
            {
                index--;
            }
        }
        else { index = 0; }
        CurrentPageIndex.Value = index.ToString();
        whichResultsPage = index;

        DoSearch();
        ShowPage();
    }

    protected void SpeedSearchReset_Click(object sender, ImageClickEventArgs e)
    {
        _State = new SpeedSearchState();
        for (int i = 0; i < _Indexes.Count; i++)
        {
            _State.SelectedIndexes.Add(i);
        }
        if (!_Context.IsConfigurationTypeRegistered(typeof(SpeedSearchState)))
        {
            _Context.RegisterConfigurationType(typeof(SpeedSearchState));
        }
        _Context.WriteConfiguration(_State);
    }

    protected void NextPage_Click(object sender, ImageClickEventArgs e)
    {

    }

    #region ISmartPartInfoProvider Members

    public ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        ToolsSmartPartInfo tinfo = new ToolsSmartPartInfo();
        tinfo.Description = GetLocalResourceObject("SpeedSearch_Description").ToString();
        tinfo.Title = GetLocalResourceObject("SpeedSearch_Title").ToString();
        foreach (Control c in this.SpeedSearch_RTools.Controls)
        {
            tinfo.RightTools.Add(c);
        }
        tinfo.ImagePath = Page.ResolveClientUrl("images/icons/Speed_Search_24x24.gif"); return tinfo;
    }

    #endregion
}
