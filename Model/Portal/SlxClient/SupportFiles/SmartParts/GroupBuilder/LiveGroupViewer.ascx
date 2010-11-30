<%@ Import namespace="Sage.Platform.Application.Services" %>
<%@ Import namespace="Sage.Platform.Application"%>
<%@ Import namespace="Sage.Platform.Security"%>
<%@ Import namespace="Sage.SalesLogix.Web"%>
<%@ Import namespace="Sage.Platform.WebPortal"%>
<%@ Import namespace="System.ComponentModel"%>
<%@ Import namespace="System.Drawing.Design"%>
<%@ Control Language="C#" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Timeline" TagPrefix="SalesLogix" %>

<SalesLogix:ListPanel runat="server" ID="GroupList" FriendlyName="MainList" IncludeScript="true" IncludeScriptAsReference="false" DelayLoad="true" DelayLoadUntilReady="true" AddTo="center_panel_center" Viewport="mainViewport" CreateOnly="true">
    <ViewOptions>
        <SalesLogix:ViewOptions Name="list" FitToContainer="true" />
    </ViewOptions>
    <StateDefinition>
        <%-- save panel state based on family --%>
        <StateID Value="function() { return Sage.Services.getService('ClientGroupContext').getContext().CurrentFamily; }" Format="Literal" />
        <%-- save view state based on group --%>
        <ChildStateID Value="function() { return Sage.Services.getService('ClientGroupContext').getContext().CurrentGroupID; }" Format="Literal" />
    </StateDefinition>
    <MetaConverters>
        <SalesLogix:MetaConverter Name="list" Type="groupmetaconverter" />
        <SalesLogix:MetaConverter Name="summary" Type="groupsummarymetaconverter" />
    </MetaConverters>
    <Connections>
        <SalesLogix:SDataConnection Name="list" Resource="slxdata.ashx/slx/crm/-/groups">
            <Parameters>
                <SalesLogix:ConnectionParameter 
                    Name="family"
                    Value="function() { return Sage.Services.getService('ClientGroupContext').getContext().CurrentFamily; }"
                    Format="Literal" />
                <SalesLogix:ConnectionParameter 
                    Name="name"
                    Value="function() { return Sage.Services.getService('ClientGroupContext').getContext().CurrentName; }"
                    Format="Literal" />
                <SalesLogix:ConnectionParameter Name="format" Value="json" />  
            </Parameters>
        </SalesLogix:SDataConnection>
        <SalesLogix:SDataConnection Name="summary" Resource="slxdata.ashx/slx/crm/-/groups" UseStaticMetaData="true">
            <MetaData ID="id" Root="items" VersionProperty="version" TotalProperty="total_count" />
            <Parameters>
                <SalesLogix:ConnectionParameter 
                    Name="family"
                    Value="function() { return Sage.Services.getService('ClientGroupContext').getContext().CurrentFamily; }"
                    Format="Literal" />
                <SalesLogix:ConnectionParameter 
                    Name="name"
                    Value="function() { return Sage.Services.getService('ClientGroupContext').getContext().CurrentName; }"
                    Format="Literal" />
                <SalesLogix:ConnectionParameter Name="format" Value="json" />
                <SalesLogix:ConnectionParameter Name="justids" Value="True" />                        
            </Parameters>
        </SalesLogix:SDataConnection>        
    </Connections>
</SalesLogix:ListPanel>

<script type="text/javascript">
     var waitingSelcectionCount = false;
  $(document).ready(function() {                       
        function hasValidFilter(store) {
            return (store.filter && store.filter.columns && store.filter.columns.length > 0) || //old style
                (store.filter && store.filter.field); //new style
        }

        var list = window.<%= GroupList.ClientID %>;
         
        list.on('render', function(l) {
            var context = Sage.Services.getService("ClientContextService");
            if (context && context.containsKey("GroupingChar")) 
                Sage.SalesLogix.Controls.GroupMetaConverter.numericGroupingChar = context.getValue("GroupingChar");      
             
            if (l.views.list)
            {
                                            
               l.views.list.getSelectionModel().addListener("selectionchange", function() {
                     // need to delay this
                    if( !waitingSelcectionCount)
                    {
                       waitingSelcectionCount = true;
                       window.setTimeout( function() {
                       
                          waitingSelcectionCount = false;
                       
                         $("#selectionCount").text(l.getTotalSelectionCount());
                        }, 
                        1000);
                     }                    
                       
                },{
                    single : true,        
                    addOnce : true
                    
               });
                               
                l.views.list.addListener("sortChange", function() {              
                  
                       window.setTimeout( function() {
                          $("#selectionCount").text(l.getTotalSelectionCount());
                        }, 
                        1000);
                             
                });
                
               
            }
            var svc = Sage.Services.getService("GroupManagerService");
            svc.addListener(Sage.GroupManagerService.FILTER_CHANGED, function(mgr, evt) {
                    if (hasValidFilter(evt)) 
                        l.applyFilter(evt.filter);
                    else
                        l.clearFilter();                               
                   l.refresh();
                },{
                    hold: 2000
                });
                
            svc.addListener(Sage.GroupManagerService.LISTENER_HOLD_STARTED, function (mgr, args) {
                    
                });
                
            svc.addListener(Sage.GroupManagerService.CURRENT_GROUP_CHANGED, function (mgr, args) {                            
                    l.clearFilter();                               
                    l.refresh();    
                }); 
        });
        list.on("itemcontextmenu", function(d,e) {            
            showAdHocMenu(e);
            e.stopEvent();
        });
             
        var svc = Sage.Services.getService("GroupManagerService");
        
        window.setTimeout(        // need to delay this or the FILTERCHANGED event doesn't register correctly
            function() {list.present();}, 
            10);
    });    
</script>

<script runat="server" type="text/C#">

    private string _summaryConfig;
    public string SummaryConfigFile
    {
        get { return _summaryConfig; }
        set { _summaryConfig = value; }
    }

    private string _detailPaneConfig;
    public string DetailsPaneConfigFile
    {
        get { return _detailPaneConfig; }
        set { _detailPaneConfig = value;  }
    }
    
    protected override void OnLoad(EventArgs e)
    {
        base.OnLoad(e);

        IUserOptionsService userOption = Sage.Platform.Application.ApplicationContext.Current.Services.Get<IUserOptionsService>();

        bool autoFitColumns;
        string autoFitColumnsValue = userOption.GetCommonOption("autoFitColumns", "GroupGridView");
        if (!Boolean.TryParse(autoFitColumnsValue, out autoFitColumns))
            autoFitColumns = true;

        ViewOptions listViewOptions = GroupList.ViewOptions.Find("list");
        if (listViewOptions == null)
            GroupList.ViewOptions.Add((listViewOptions = new ViewOptions()));

        listViewOptions.Name = "list";
        listViewOptions.FitToContainer = autoFitColumns;
        listViewOptions.selectionContextKey = GroupList.ClientID;
        listViewOptions.selectionContextType = "Group";
        if (!IsPostBack)
        {
            Sage.SalesLogix.SelectionService.ISelectionService ss = Sage.SalesLogix.Web.SelectionService.SelectionServiceRequest.GetSelectionService();
            if (ss != null)
            {
                Sage.SalesLogix.SelectionService.ISelectionContext groupSelectionContext = new Sage.SalesLogix.Client.GroupBuilder.GroupSelectionContext();
                groupSelectionContext.key = listViewOptions.selectionContextKey;
                groupSelectionContext.SelectionInfo = new Sage.SalesLogix.SelectionService.SelectionInfo();
                ss.SetSelectionContext(listViewOptions.selectionContextKey, groupSelectionContext);
            }
        }
        if (!String.IsNullOrEmpty(SummaryConfigFile))
            GroupList.ApplySummaryConfig(String.Format("~/SummaryConfigData/{0}.xml", SummaryConfigFile));
        if (!string.IsNullOrEmpty(DetailsPaneConfigFile))
            GroupList.ApplySummaryConfigForDetail(String.Format("~/SummaryConfigData/{0}.xml", DetailsPaneConfigFile));

        EntityPage page = Page as EntityPage;
        if (page != null)
        {
            PageLink pageLink = new PageLink();
            pageLink.LinkType = enumPageLinkType.HelpFileName;
            
            string entityname = page.EntityTypeName.Substring(0, page.EntityTypeName.IndexOf(","));
            
            switch (entityname)
            {
                case "Sage.Entity.Interfaces.IAccount" :
                    pageLink.NavigateUrl = "accountstandardlookup";
                    break;
                case "Sage.Entity.Interfaces.IContact":
                    pageLink.NavigateUrl = "contactstandardlookup";
                    break;
                case "Sage.Entity.Interfaces.ICampaign":
                    pageLink.NavigateUrl = "campaignlistview";
                    break;
                case "Sage.Entity.Interfaces.IContract":
                    pageLink.NavigateUrl = "contractlistview";
                    break;
                case "Sage.Entity.Interfaces.ITicket":
                    WebPortalUserService vWebPortalUserService = ApplicationContext.Current.Services.Get<IUserService>() as WebPortalUserService;
                    pageLink.NavigateUrl = vWebPortalUserService == null ? "csrticketlistview" : "custticktick";
                    break;
                case "Sage.Entity.Interfaces.IDefect":
                    pageLink.NavigateUrl = "defectlistview";
                    break;
                case "Sage.Entity.Interfaces.ILead":
                    pageLink.NavigateUrl = "leadlistview";
                    break;
                case "Sage.Entity.Interfaces.IOpportunity":
                    pageLink.NavigateUrl = "oppstandardlookup";
                    break;
                case "Sage.Entity.Interfaces.IReturn":
                    pageLink.NavigateUrl = "returnlistview";
                    break;
                case "Sage.Entity.Interfaces.IImportHistory":
                    pageLink.NavigateUrl = "leadimporthistorylistview";
                    break;
                case "Sage.Entity.Interfaces.ISalesOrder":
                    pageLink.NavigateUrl = "salesorderlistview";
                    break;                    
            }
            GroupList.HelpUrl = pageLink.GetWebHelpLink().Url;
        }        
    }

</script>
    
