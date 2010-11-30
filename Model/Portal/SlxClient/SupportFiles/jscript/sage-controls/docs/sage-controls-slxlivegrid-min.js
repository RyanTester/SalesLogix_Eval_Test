/*
 * Sage SalesLogix Web Controls
 * Copyright(c) 2009, Sage Software.
 */


Sage.SalesLogix.Controls.LiveGrid=function(options){this._options=options;this._connections={};this._maps={};this._grid=null;this._summaryGrid=null;this._layout={};this._stateId=this._options.id;this._requestedMetaData=false;this._summaryViewMgr=null;this._activeGrid=null;var cons=this._options.connections;for(var i=0;i<cons.length;i++)
this._connections[cons[i]["for"]]=cons[i];var maps=this._options.maps;for(var i=0;i<maps.length;i++)
this._maps[maps[i]["for"]]=maps[i];this.addEvents('beforeinit','init','layout','createstore','createsummarystore','createview','createsummaryview','creategrid');this.SUMMARY='summary';this.LIST='list';this.NumericGroupingChar=",";var contextservice=Sage.Services.getService("ClientContextService");if((contextservice)&&(contextservice.containsKey("GroupingChar"))){this.NumericGroupingChar=contextservice.getValue("GroupingChar");}};Ext.extend(Sage.SalesLogix.Controls.LiveGrid,Ext.util.Observable);Sage.SalesLogix.Controls.LiveGrid.prototype.getOptions=function(){return this._options;};Sage.SalesLogix.Controls.LiveGrid.prototype.getLayout=function(){return this._layout;};Sage.SalesLogix.Controls.LiveGrid.prototype.getConnections=function(){return this._connections;};Sage.SalesLogix.Controls.LiveGrid.prototype.getMaps=function(){return this._maps;};Sage.SalesLogix.Controls.LiveGrid.prototype.getNativeGrid=function(){return this.getGrid();};Sage.SalesLogix.Controls.LiveGrid.prototype.getGrid=function(){return(this._activeGrid)?this._activeGrid:this._grid;};Sage.SalesLogix.Controls.LiveGrid.prototype.getStateId=function(){return this._stateId;};Sage.SalesLogix.Controls.LiveGrid.prototype.setStateId=function(value){this._stateId=value;};Sage.SalesLogix.Controls.LiveGrid.prototype.getId=function(){return this._options.id;};Sage.SalesLogix.Controls.LiveGrid.prototype.clearMetaData=function(){this._requestedMetaData=false;};Sage.SalesLogix.Controls.LiveGrid.prototype.hasStaticLayout=function(){return(this._options.columns&&this._options.columns.length>0);};Sage.SalesLogix.Controls.LiveGrid.prototype.getStatePageId=function(){return this._options.id+"_"+Sage.Services.getService('ClientGroupContext').getContext().CurrentFamily;};Sage.SalesLogix.Controls.LiveGrid.prototype.getSelectionsTotal=function(entity){var selections;var activeGrid;var selectCount;activeGrid=this.getGrid();selections=activeGrid.getSelections();selectCount=selections.length;return selectCount;};Sage.SalesLogix.Controls.LiveGrid.prototype.getSelectionsByID=function(entity){var arraySelectionIDs=new Array;var activeGrid;var selections;activeGrid=this.getGrid();selections=activeGrid.getSelections();var count=selections.length;for(i=0;i<count;i++)
{var id=selections[i].data[GetKeyField(entity)]||selections[i].data[entity+"_ID"];arraySelectionIDs[i]=id;}
return arraySelectionIDs;};Sage.SalesLogix.Controls.LiveGrid.prototype.getTotalCount=function(){var activeGrid;var totalCount;activeGrid=this.getGrid();totalCount=activeGrid.getStore().getTotalCount();return totalCount;};Sage.SalesLogix.Controls.LiveGrid.prototype.init=function(){if(this.hasStaticLayout()){this._layout={entity:this._options.entity,columns:this._options.columns};this.processLayout();}
this.clearMetaData();this.initGrid();};Sage.SalesLogix.Controls.LiveGrid.prototype.buildSummaryColumnModel=function(){var model=[];var grpContext=Sage.Services.getService("ClientGroupContext");if(grpContext){var tbl=grpContext.getContext().CurrentTable;var item={header:grpContext.CurrentName,align:'left',width:'auto',sortable:false,dataIndex:GetKeyField(tbl),renderer:SummaryRenderer}
model.push(item);}
return new Ext.grid.ColumnModel(model);};Sage.SalesLogix.Controls.LiveGrid.prototype.buildColumnModelConfig=function(){var model=[];var cols=this._layout.columns;for(var i=0;i<cols.length;i++){var thiscol=cols[i];if(thiscol.isVisible&&parseInt(thiscol.width)>0)
{var item={header:thiscol.caption,align:thiscol.align,width:parseInt(thiscol.width),sortable:true,dataIndex:thiscol.alias,renderer:thiscol.renderer};switch(thiscol.format){case"Owner":case"User":item.dataIndex+="NAME";break;case"PickList Item":item.dataIndex+="TEXT";break;}
model.push(item);}}
return model;};Sage.SalesLogix.Controls.LiveGrid.prototype.buildColumnModel=function(){if(this.hasStaticLayout())
return new Ext.grid.ColumnModel(this.buildColumnModelConfig());else
return new Ext.grid.ColumnModel([]);};Sage.SalesLogix.Controls.LiveGrid.prototype.buildSummaryReader=function(){var columns=[];var idname="ACCOUNTID";var grpContext=Sage.Services.getService("ClientGroupContext");if(grpContext){idname=GetKeyField(grpContext.getContext().CurrentTable);}
columns.push({name:idname,sortType:"string"});columns.push({name:'SLXRN',sortType:'int'});return new Ext.ux.data.BufferedJsonReader({root:'response.value.items',versionProperty:'response.value.version',totalProperty:'response.value.total_count',id:'id'},columns);};Sage.SalesLogix.Controls.LiveGrid.prototype.buildReader=function(){var columns=[];if(this._options.useMetaData===false)
{columns.push({name:'SLXRN',sortType:'int'});for(var i=0;i<this._layout.columns.length;i++)
{item={name:this._layout.columns[i].alias,sortType:(this._layout.columns[i].sortType)?this._layout.columns[i].sortType:"string"};switch(this._layout.columns[i].format){case"Owner":case"User":columns.push({name:this._layout.columns[i].alias+"NAME",sortType:"string"});break;case"DateTime":item.sortType="int";break;case"PickList Item":columns.push({name:this._layout.columns[i].alias+"TEXT",sortType:"string"});break;}
if(this._layout.columns[i].isWebLink)
columns.push({name:GetKeyField(this._layout.entity),sortType:"string"});if(this._layout.columns[i].alias=="ACCOUNT"||this._layout.columns[i].alias=="ACCOUNT_ACCOUNT")
columns.push({name:"ACCOUNT_ID",sortType:"string"});columns.push(item);}
if(this._maps["data"])
return new Ext.ux.data.BufferedJsonReader({root:this._maps["data"].data,versionProperty:this._maps["data"].version,totalProperty:this._maps["data"].count},columns);else
return new Ext.ux.data.BufferedJsonReader({root:"response.value.items",versionProperty:"response.value.version",totalProperty:"response.value.total_count"},columns);}
else
{return new Ext.ux.data.BufferedJsonReader();}};Sage.SalesLogix.Controls.LiveGrid.prototype.buildSummaryDataStore=function(reader){var store=new Ext.ux.grid.BufferedStore({autoLoad:false,bufferSize:1000,reader:reader,filter:{},url:"builder",buildUrl:this._connections["summary"]});store.on("beforeload",function(store,options){this._connections["summary"].parameters["meta"]="true";var url=this.buildUrl("summary",{instance:self,store:store,startAt:0,args:arguments});store.proxy.conn.url=url;store.proxy.conn.method="GET";store.url=url;},this);this.fireEvent('createsummarystore',this,store);return store;};Sage.SalesLogix.Controls.LiveGrid.prototype.buildDataStore=function(reader){var store=new Ext.ux.grid.BufferedStore({autoLoad:false,bufferSize:150,reader:reader,filter:{},url:"builder",buildUrl:this._connections["data"]});store.on("beforeload",function(store,options){if(this._options.useMetaData&&!this._requestedMetaData)
if(this._connections["data"])
this._connections["data"].parameters["meta"]="true";var url=this.buildUrl("data",{instance:self,store:store,startAt:0,args:arguments});store.proxy.conn.url=url;store.proxy.conn.method="GET";store.url=url;},this);store.on("load",function(store,records,options){if(this._options.useMetaData)
if(this._connections["data"])
{delete this._connections["data"].parameters["meta"];this._requestedMetaData=true;}},this);if(!this.hasStaticLayout())
{store.on("metachange",function(store,meta){args={data:meta,layout:null};this.fireEvent("layout",this,args);if(args.layout)
{this._layout=args.layout;}
else
{this._layout={entity:meta.layout.mainTable,columns:[]};for(var i=0;i<meta.layout.items.length;i++)
this._layout.columns.push({dataPath:meta.layout.items[i].dataPath,alias:meta.layout.items[i].alias,align:meta.layout.items[i].align,formatString:meta.layout.items[i].formatString,format:meta.layout.items[i].format,caption:meta.layout.items[i].caption,captionAlign:meta.layout.items[i].captionAlign,sortType:null,width:meta.layout.items[i].width,isVisible:((typeof meta.layout.items[i].visible==="boolean")?meta.layout.items[i].visible:!!meta.layout.items[i].visible.match(/T/i)),isWebLink:((typeof meta.layout.items[i].webLink==="boolean")?meta.layout.items[i].webLink:!!meta.layout.items[i].webLink.match(/T/i)),isPrimaryKey:false});}
this.processLayout();this._grid.getColumnModel().setConfig(this.buildColumnModelConfig());},this);}
this.fireEvent('createstore',this,store);return store;};Sage.SalesLogix.Controls.LiveGrid.prototype.buildView=function(){var view=new Ext.ux.grid.BufferedGridView({nearLimit:25,forceFit:(this.getOptions().forceFitColumns===false)?false:true,autoFill:true,loadMask:{msg:SlxLiveGridResources.PleaseWait}});view.on("beforebuffer",function(view,store,rowIndex,visibleRows,totalCount,bufferOffset){var url=this.buildUrl("data",{instance:self,store:store,startAt:bufferOffset,args:arguments});store.proxy.conn.url=url;store.proxy.conn.method="GET";store.url=url;},this);view.on('cursormove',function(){if(typeof idRows!="undefined")idRows();},this);this.fireEvent('createview',this,view);return view;};Sage.SalesLogix.Controls.LiveGrid.prototype.buildSummaryView=function(){var view=new Ext.ux.grid.BufferedGridView({nearLimit:25,forceFit:true,autoFill:true,loadMask:{msg:SlxLiveGridResources.PleaseWait}});view.on("beforebuffer",function(view,store,rowIndex,visibleRows,totalCount,bufferOffset){var url=this.buildUrl("summary",{instance:self,store:store,startAt:bufferOffset,args:arguments});store.proxy.conn.url=url;store.proxy.conn.method="GET";store.url=url;},this);view.on('cursormove',function(){if(typeof idRows!="undefined")idRows();},this);this.fireEvent('createsummaryview',this,view);return view;};Sage.SalesLogix.Controls.LiveGrid.prototype.addToPanel=function(panel){if(!panel&&this._targetPanel)
panel=this._targetPanel;if(!panel)
return;$(panel.getEl().dom).find(".x-panel-body").children().hide();panel.add(this._grid);if(this._summaryViewMgr!=null){panel.add(this._summaryGrid);}
var initialView=Ext.state.Manager.get(this.getStatePageId(),this.LIST);var initIndex=0;this._activeGrid=this._grid;if(initialView==this.SUMMARY){this._activeGrid=this._summaryGrid;initIndex=1;}
panel.layout.setActiveItem(initIndex);panel.doLayout();};Sage.SalesLogix.Controls.LiveGrid.prototype.initGrid=function(){var self=this;this.fireEvent("beforeinit",this,{});var reader=this.buildReader();var store=this.buildDataStore(reader);var view=this.buildView();var columnModel=this.buildColumnModel();var selectionModel=new Ext.ux.grid.BufferedRowSelectionModel({singleSelect:this._options.singleSelect});var toolbar=new Ext.ux.BufferedGridToolbar({view:view,id:this._id+"_listtbar",refreshText:SlxLiveGridResources.Refresh,displayInfo:true});toolbar.displayMsg=SlxLiveGridResources.DisplayMessage;toolbar.emptyMsg=SlxLiveGridResources.EmptyMessage;toolbar.refreshText=SlxLiveGridResources.Refresh;var panel;if(typeof mainViewport!='undefined')
var viewport=mainViewport;if(typeof this._options.target==="object")
{panel=this._options.target;}
else
{if(viewport&&this._options.target&&!this._options.createOnly)
panel=viewport.findById(this._options.target);}
if(panel){this._targetPanel=panel;panel.el.dom.oncontextmenu=function(){return false};}
var config={id:this._options.id+"_grid",ds:store,enableDragDrop:false,cm:columnModel,sm:selectionModel,loadMask:{msg:SlxLiveGridResources.Loading},view:view,title:"",stripeRows:true,tbar:toolbar,stateId:this._stateId,border:false,layout:'fit'};if(!panel&&!this._options.createOnly)
config.renderTo=this._options.target;this._grid=new Ext.grid.GridPanel(config);if(typeof showAdHocMenu!='undefined'){this._grid.addListener('contextmenu',showAdHocMenu);}
this.fireEvent('creategrid',this,this._grid);var summaryGrid={};if(this._summaryViewMgr!=null){var summaryReader=this.buildSummaryReader();var summaryStore=this.buildSummaryDataStore(summaryReader);var summaryView=this.buildSummaryView();var summaryColumnModel=this.buildSummaryColumnModel();var summarySelectionModel=new Ext.ux.grid.BufferedRowSelectionModel();var toolbar=new Ext.ux.BufferedGridToolbar({view:summaryView,id:this._id+"_summtbar",refreshText:SlxLiveGridResources.Refresh,displayInfo:true});toolbar.displayMsg=SlxLiveGridResources.DisplayMessage;toolbar.emptyMsg=SlxLiveGridResources.EmptyMessage;toolbar.refreshText=SlxLiveGridResources.Refresh;var summaryConfig={id:this._options.id+"_Summary",ds:summaryStore,enableDragDrop:false,cm:summaryColumnModel,sm:summarySelectionModel,loadMask:{msg:SlxLiveGridResources.Loading},view:summaryView,title:"",stripeRows:false,tbar:toolbar,stateId:this._stateId+"_Summary",border:false};summaryGrid=new Ext.grid.GridPanel(summaryConfig);this._summaryGrid=summaryGrid;}
if(panel&&!this._options.createOnly)
{this.addToPanel(panel);var tbar=this._grid.getTopToolbar();tbar.addFill();if(this._summaryViewMgr!=null){tbar.addButton({text:SlxLiveGridResources.List,handler:this.showListView,scope:self,disabled:true});tbar.addButton({text:SlxLiveGridResources.Summary,handler:this.showSummaryView,scope:self});var summarytbar=this._summaryGrid.getTopToolbar();summarytbar.addFill();summarytbar.addButton({text:SlxLiveGridResources.List,handler:this.showListView,scope:self});summarytbar.addButton({text:SlxLiveGridResources.Summary,handler:this.showSummaryView,scope:self,disabled:true});summarytbar.addButton({icon:"ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16",handler:function(){linkTo(encodeURI("help.aspx?content=help*\\base\\summaryview.aspx"),true);},text:"",cls:"x-btn-text-icon"});}
var self=this;if(self._options.helpurl!=""){tbar.addButton({icon:"ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16",handler:function(){linkTo(encodeURI(self._options.helpurl),true);},text:"",cls:"x-btn-text-icon"});}
if(Ext.state.Manager.get(this.getStatePageId(),this.LIST)==this.LIST){store.load();}else{summaryStore.load();}}
this.fireEvent("init",this,{});};Sage.SalesLogix.Controls.LiveGrid.__urlBuilders={standard:function(options,context){return options;},sdata:function(options,context){var o=options;var u=[];var p=[];if(o.predicate&&(typeof o.predicate==="string")&&o.predicate.length>0)
u.push(String.format(o.resource,o.predicate));else
u.push(o.resource);if(typeof o.parameters==="object")
{for(var k in o.parameters)
{if((typeof o.parameters[k]==="object")&&(o.parameters[k].eval===true))
{var r=eval(o.parameters[k].statement);if(r!==false)
p.push(k+"="+encodeURIComponent(r));}
else if(typeof o.parameters[k]==="function")
{var r=o.parameters[k](context);if(r!==false)
p.push(k+"="+encodeURIComponent(r));}
else
p.push(k+"="+encodeURIComponent(o.parameters[k]));}}
else if(typeof o.parameters==="string")
p.push(o.parameters);if(p.length>0)
{u.push("?");u.push(p.join("&"));}
return u.join("");}};Sage.SalesLogix.Controls.LiveGrid.prototype.buildUrl=function(which,context){return Sage.SalesLogix.Controls.LiveGrid.__urlBuilders[this._connections[which].builder](this._connections[which],context);};Sage.SalesLogix.Controls.LiveGrid.prototype.processLayout=function(){var l=this._layout.columns.length;for(var i=0;i<l;i++)
{var column=this._layout.columns[i];if(column.isVisible==false)
continue;if(column.renderer)
continue;switch(true)
{case((column.alias=="ACCOUNT")||(column.alias.match(/A\d_ACCOUNT/)?true:false)):column.renderer=this.createEntityLinkRenderer("ACCOUNT");break;case column.isWebLink:column.renderer=this.createEntityLinkRenderer(column);break;case!!column.alias.match(/^email$/i):column.renderer=this.createEmailRenderer(column);break;case!!(column.format&&column.format.match(/DateTime/i)):column.renderer=this.createDateTimeRenderer(column);break;case!!(column.format&&column.format.match(/Phone/i)):column.renderer=this.createPhoneRenderer(column);break;case!!(column.format&&column.format.match(/Fixed/i)):column.renderer=this.createFixedNumberRenderer(column);break;default:column.renderer=this.createDefaultRenderer(column);break;}}};Sage.SalesLogix.Controls.LiveGrid.prototype.createEntityLinkRenderer=function(column){var self=this;var entity;if(typeof column==="string")
entity=column;else
entity=(column.dataPath.lastIndexOf("!")>-1)?column.dataPath.substring(0,column.dataPath.lastIndexOf("!")).substring(column.dataPath.lastIndexOf(".")+1):column.dataPath.substring(0,column.dataPath.lastIndexOf(":"));var tableName=entity.slice(0);var keyField=GetKeyField(tableName);var grpService=Sage.Services.getService("ClientGroupContext");if(grpService){if(entity==grpService.getContext().CurrentTable)entity=grpService.getContext().CurrentEntity;}
return function(value,meta,record,rowIndex,columnIndex,store){var id=record.data[keyField]||record.data[tableName+"_ID"];if(!id)
return value;return String.format("<a href={2}.aspx?entityid={0}>{1}</a>",id,Ext.util.Format.htmlEncode(value),entity);};};Sage.SalesLogix.Controls.LiveGrid.prototype.createFixedNumberRenderer=function(column){var format=column.formatString.replace(/%.*[dnf]/,"{0}").replace("%%","%");var useGroupingChar=(column.formatString.match(/%.*[dnf]/)==null)?false:(column.formatString.match(/%.*[dnf]/)[0].indexOf("n")>0);var match=column.formatString.match(/\.(\d+)/);var precision;if(match){precision=match[1];}
var NumericGroupingChar=this.NumericGroupingChar;var rx=/(\d+)(\d{3})/;if(precision&&!isNaN(precision)){return function(value,meta,record,rowIndex,columnIndex,store){if(value&&!isNaN(value)){var num=String.format(format,value.toFixed(precision));if(useGroupingChar){while(rx.test(num)){num=num.replace(rx,'$1'+NumericGroupingChar+'$2');}}
return num;}};}
return function(value,meta,record,rowIndex,columnIndex,store){return(value?Ext.util.Format.htmlEncode(value):"&nbsp;");};};Sage.SalesLogix.Controls.LiveGrid.prototype.createDateTimeRenderer=function(column){var renderer=Ext.util.Format.dateRenderer(ConvertToPhpDateTimeFormat(column.formatString));return function(value,meta,record,rowIndex,columnIndex,store){return renderer(value);};};Sage.SalesLogix.Controls.LiveGrid.prototype.createPhoneRenderer=function(column){return LiveGrid_RenderPhoneNumber;};function LiveGrid_RenderPhoneNumber(value,meta,record,rowIndex,columnIndex,store){if((value==null)||(value=="null"))return"&nbsp;";if(!value||value.length!=10)
return Ext.util.Format.htmlEncode(value);return String.format("({0}) {1}-{2}",value.substring(0,3),value.substring(3,6),value.substring(6));};Sage.SalesLogix.Controls.LiveGrid.prototype.createEmailRenderer=function(column){return function(value,meta,record,rowIndex,columnIndex,store){return(value?String.format("<a href=mailto:{0}>{0}</a>",Ext.util.Format.htmlEncode(value)):"");};};Sage.SalesLogix.Controls.LiveGrid.prototype.createDefaultRenderer=function(column){return function(value,meta,record,rowIndex,columnIndex,store){return(value?Ext.util.Format.htmlEncode(value):"&nbsp;");}}
var summaryrenderedindex=0;function SummaryRenderer(value,meta,record,rowIndex,columnIndex,store){if(!value){return"&nbsp;";}
if(value.length!=12){return value;}
var contentEl=value+"_"+summaryrenderedindex++;window._SummaryViewManager.getData(value,contentEl);return String.format("<div id='{0}' style='min-height:110px'>{1}</div>",contentEl,SlxLiveGridResources.Loading);};Sage.SalesLogix.Controls.LiveGrid.prototype.showSummaryView=function(btn,pressed){var panel;if(mainViewport)
panel=mainViewport.findById(this._options.target);if(panel){panel.layout.setActiveItem(1);this._activeGrid=this._summaryGrid;Ext.state.Manager.set(this.getStatePageId(),this.SUMMARY);this.fireEvent("toggleview",[this,{}]);}};Sage.SalesLogix.Controls.LiveGrid.prototype.showListView=function(btn,pressed){var panel;if(mainViewport)
panel=mainViewport.findById(this._options.target);if(panel){panel.layout.setActiveItem(0);this._activeGrid=this._grid;Ext.state.Manager.set(this.getStatePageId(),this.LIST);this.fireEvent("toggleview",[this,{}]);}};function GetKeyField(tableName){var keyField=tableName+"ID";var grpService=Sage.Services.getService("ClientGroupContext");if((grpService)&&(grpService.getContext().CurrentTable==tableName)){keyField=grpService.getContext().CurrentTableKeyField;}
return keyField;}
function makeEntityRenderer(entity){var keyField=GetKeyField(entity);return function(e,p,r){var id=r.data[keyField];if((typeof id=="undefined")||(id==""))
id=r.data[entity+"_ID"];if((typeof id=="undefined")||(id==""))
return e;return String.format("<a href={2}.aspx?entityid={0}>{1}</a>",id,e,entity);}};function makeFixedNumRenderer(strformat){var width;var precision;if(strformat.indexOf(".")>-1){width=strformat.charAt(strformat.indexOf(".")-1);precision=strformat.charAt(strformat.indexOf(".")+1);}else{width=strformat.charAt(strformat.indexOf("%")+1);}
var sformat=strformat.replace(/%.*[dnf]/,"{0}").replace("%%","%");if(!isNaN(precision)){return function(e){if((!isNaN(e))&&(e!="")){return String.format(sformat,e.toFixed(precision));}else{return e;}};}
return function(e){return e;};}
Sage.SalesLogix.Controls.SummaryViewChildWindowManager=function(){this.containerID='SummaryViewChildDataBox';var box=document.getElementById("SummaryViewChildDataBox");if(!box){$("body").append("<div id=\"SummaryViewChildDataBox\"></div>");}
this.dataMgr=new Sage.SalesLogix.Controls.SummaryDataManager();this.timeoutpointers=new Array();this.childdatatemplates={};this.whereformatstrings={};this.win=new Ext.Window({contentEl:'SummaryViewChildDataBox',id:this.containerID+"_win",layout:'fit',width:300,height:150,resizable:true,closeAction:'hide',autoScroll:true,constrain:true});}
Sage.SalesLogix.Controls.SummaryViewChildWindowManager.prototype.showMyData=function(queryid,entityid,winTitle,e){if(!entityid){return;}
var fmtstr=this.whereformatstrings[queryid];if(!fmtstr){return;}
if(!winTitle){winTitle='';}
var opts={name:queryid,where:String.format(fmtstr,entityid)}
if(!e){var e={clientX:200,clientY:200};}
var context={name:queryid,childWinMgr:this,winTitle:winTitle,x:e.clientX+10,y:e.clientY+10}
this.dataMgr.requestData(opts,this.receiveChildData,this.handleDataError,context);}
var doOnce=true;Sage.SalesLogix.Controls.SummaryViewChildWindowManager.prototype.receiveChildData=function(context,data){var self=context.childWinMgr;var template=self.childdatatemplates[context.name];template.overwrite(self.containerID,data);self.win.setTitle(context.winTitle);self.cancelSummaryClose();self.win.show();if(context.x){self.win.setPosition(context.x,context.y);}
if(doOnce){var elem=self.win.getEl();if(elem){elem.addListener("mouseover",self.cancelSummaryClose,self);elem.addListener("mouseout",self.mouseOut,self);}
doOnce=false;}}
Sage.SalesLogix.Controls.SummaryViewChildWindowManager.prototype.handleDataError=function(context,err){if(context.childWinMgr.win.isVisible())
context.childWinMgr.win.hide();}
Sage.SalesLogix.Controls.SummaryViewChildWindowManager.prototype.mouseOut=function(e){this.timeoutpointers.push(window.setTimeout(this.closeSummaryWin,1000));}
Sage.SalesLogix.Controls.SummaryViewChildWindowManager.prototype.closeSummaryWin=function(){if(window._SummaryViewManager.childWinMgr.win.isVisible())
window._SummaryViewManager.childWinMgr.win.hide();}
Sage.SalesLogix.Controls.SummaryViewChildWindowManager.prototype.cancelSummaryClose=function(){var self=window._SummaryViewManager.childWinMgr;for(var i=self.timeoutpointers.length-1;i>-1;i--){window.clearTimeout(self.timeoutpointers[i]);self.timeoutpointers.pop;}}
Sage.SalesLogix.Controls.SummaryViewManager=function(){this.summarycardtemplate={};this.dataMgr={};this.queryname='';this.whereformatstring='';this.childWinMgr={};this.stringresources={};}
Sage.SalesLogix.Controls.SummaryViewManager.prototype.showChildList=function(queryid,entityid,winTitle,e){if(!e){var e=window.event;}
this.childWinMgr.showMyData(queryid,entityid,winTitle,e);}
Sage.SalesLogix.Controls.SummaryViewManager.prototype.getData=function(entityId,contentEl){window.setTimeout(String.format("window._SummaryViewManager.getDataRealityCheck('{0}','{1}')",entityId,contentEl),250);}
Sage.SalesLogix.Controls.SummaryViewManager.prototype.getDataRealityCheck=function(entityId,contentEl){var elem=document.getElementById(contentEl);if(elem){var self=window._SummaryViewManager;var options={name:self.queryname,where:String.format(self.whereformatstring,entityId)}
var context={name:self.queryname,viewmgr:self,contentEl:contentEl}
self.dataMgr.requestData(options,self.receiveData,self.handleDataError,context);}}
Sage.SalesLogix.Controls.SummaryViewManager.prototype.receiveData=function(context,data){var self=context.viewmgr;var contentEl=context.contentEl;if(document.getElementById(contentEl)){self.summarycardtemplate.overwrite(contentEl,data);}}
Sage.SalesLogix.Controls.SummaryViewManager.prototype.handleDataError=function(context,err){}
Sage.SalesLogix.Controls.SummaryViewManager.prototype.navToDetail=function(entityid,tabName,e){if((entityid=="")||(entityid.length!=12)){return;}
var url=document.location.href;if(url.indexOf("?")>-1){url=url.substring(0,url.indexOf("?"));}
url+="?entityid="+entityid;if(tabName!=""){url=url+"&activetab="+tabName;}
document.location=url;}
Sage.SalesLogix.Controls.SummaryDataManager=function(){this.rooturl='slxdata.ashx/slx/crm/-/namedqueries?format=json&';}
Sage.SalesLogix.Controls.SummaryDataManager.prototype.requestData=function(params,successcallback,errorcallback,context){if(typeof params==="undefined"){return;}
if(typeof successcallback==="undefined"){successcallback=function(data){};};if(typeof errorcallback==="undefined"){errorcallback=function(){};};if(typeof context==="undefined"){context='';}
var url=this.rooturl+this.buildQParamStr(params);$.ajax({url:url,dataType:'json',success:function(data){successcallback(context,data);},error:function(request,status,error){errorcallback(context,error);}});}
Sage.SalesLogix.Controls.SummaryDataManager.prototype.buildQParamStr=function(params){var o=params;var p=[];if(typeof o==="object")
for(var k in o)
p.push(k+"="+encodeURIComponent(o[k]));else if(typeof o==="string")
p.push(o);return p.join("&");}