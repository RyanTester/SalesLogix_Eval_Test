/*
 * Sage SalesLogix Web Controls
 * Copyright(c) 2009, Sage Software.
 */


Sage.GroupManagerService=function(){this._contextService=Sage.Services.getService("ClientGroupContext");this._saveFilterTimeouts={}
this._filters={};this._listeners={};this._listeners[Sage.GroupManagerService.FILTER_CHANGED]=[];this._listeners[Sage.GroupManagerService.CURRENT_GROUP_CHANGED]=[];this._listeners[Sage.GroupManagerService.LISTENER_HOLD_STARTED]=[];this._listeners[Sage.GroupManagerService.CURRENT_GROUP_POSITION_CHANGED]=[];this._listeners[Sage.GroupManagerService.CURRENT_GROUP_COUNT_CHANGED]=[];var self=this;$(document).ready(function(){var prm=Sys.WebForms.PageRequestManager.getInstance();prm.add_beginRequest(function(sender,args){var request=args.get_request();request.__originalGroupContext=self._contextService.getContext();});prm.add_endRequest(function(sender,args){var response=args.get_response();var request=response.get_webRequest();var context=self._contextService.getContext();if(request.__originalGroupContext.CurrentGroupID!=context.CurrentGroupID)
{self.onCurrentGroupChanged({current:context,previous:request.__originalGroupContext});}
else
{if(request.__originalGroupContext.CurrentEntityPosition!=context.CurrentEntityPosition)
self.onCurrentGroupPositionChanged({current:context,previous:request.__originalGroupContext});if(request.__originalGroupContext.CurrentGroupCount!=context.CurrentGroupCount)
self.onCurrentGroupCountChanged({current:context,previous:request.__originalGroupContext});}});});};Sage.GroupManagerService.UI_STATE_SECTION="GroupManagerService";Sage.GroupManagerService.FILTER_CHANGED="onFilterChanged";Sage.GroupManagerService.LISTENER_HOLD_STARTED="onListenerHoldStarted";Sage.GroupManagerService.CURRENT_GROUP_CHANGED="onCurrentGroupChanged";Sage.GroupManagerService.CURRENT_GROUP_POSITION_CHANGED="onCurrentGroupPositionChanged";Sage.GroupManagerService.CURRENT_GROUP_COUNT_CHANGED="onCurrentGroupCountChanged";Sage.GroupManagerService.LOOKUPRESULTS="LOOKUPRESULTS";Sage.GroupManagerService.prototype.buildRequestUrl=function(options){var o=options;var u=[];var p=[];var qp=[];u.push(o.resource);if(o.predicate){if(typeof o.predicate==="object")
for(var k in o.predicate)
p.push(k+"="+encodeURIComponent(o.predicate[k]));else if(typeof o.predicate==="string")
p.push(o.predicate);if(p.length>0)
{u.push("(");u.push(p.join("&"));u.push(")");}}
if(o.qparams){if(typeof o.qparams==="object")
for(var prm in o.qparams)
qp.push(prm+"="+encodeURIComponent(o.qparams[prm]));else if(typeof o.qparams==="string")
qp.push(o.qparams);if(qp.length>0){u.push("?");u.push(qp.join("&"));}}
return u.join("");}
Sage.GroupManagerService.prototype.getAvailableFilters=function(options,callback){if(jQuery.isFunction(options))
{callback=options;options=null;}
if(typeof options==="undefined"||options==null)
options={family:this._contextService.getContext().CurrentFamily,name:this._contextService.getContext().CurrentName};var sdata={};sdata.resource="slxdata.ashx/slx/crm/-/groups";sdata.qparams={family:options.family,name:options.name,output:"layout",responsetype:"json"};$.ajax({url:this.buildRequestUrl(sdata),dataType:"json",success:function(data){callback(data)},error:function(request,status,error){}});};Sage.GroupManagerService.prototype.getLookupFields=function(options,callback){if(jQuery.isFunction(options))
{callback=options;options=null;}
if(typeof options==="undefined"||options==null)
options={family:this._contextService.getContext().CurrentFamily,name:this._contextService.getContext().LookoutLayoutGroupName};var sdata={};sdata.resource="slxdata.ashx/slx/crm/-/groups";sdata.qparams={family:options.family,name:options.name,output:"layout",responsetype:"json"};$.ajax({url:this.buildRequestUrl(sdata),dataType:"json",success:function(data){callback(data)},error:function(request,status,error){}});}
Sage.GroupManagerService.prototype.clearDistinctValuesCache=function(){this._distinctValuesCache=undefined;}
Sage.GroupManagerService.prototype.getDistinctValuesForField=function(field,options,callback){if(jQuery.isFunction(options)){callback=options;options=null;}
if(typeof options==="undefined"||options==null)
options={};if(!options.name)
options.name=this._contextService.getContext().CurrentName;if(!options.family)
options.family=this._contextService.getContext().CurrentFamily;var self=this;if(!this._distinctValuesCache){this._distinctValuesCache=[];}
var valueId=String.format("{0}_{1}",options.family,options.filterName);if(self._distinctValuesCache[valueId]){callback(this._distinctValuesCache[valueId]);return;}
var sdata={};sdata.resource="slxdata.ashx/slx/crm/-/groups";sdata.qparams={family:options.family,name:options.name,distinctDataPath:options.dataPath,distinct:field,responsetype:"json",time:new Date().getTime()};$.ajax({url:this.buildRequestUrl(sdata),dataType:"json",success:function(data){self._distinctValuesCache[valueId]=data;callback(data)},error:function(request,status,error){}});};Sage.GroupManagerService.prototype.setNewGroup=function(grpID){var self=this;if(grpID==Sage.GroupManagerService.LOOKUPRESULTS){var lookupMgr=Sage.Services.getService("GroupLookupManager");if(lookupMgr){self.doLookup(lookupMgr.getConditionsString(),lookupMgr.withinGroup);return;}}
var sdata={};sdata.resource="slxdata.ashx/slx/crm/-/groups/context";sdata.predicate=null;sdata.qparams={groupid:grpID,responsetype:"json",time:new Date().getTime()}
$.ajax({url:self.buildRequestUrl(sdata),type:"POST",dataType:"json",success:OnSuccesfullGroupChanged,error:function(request,status,error){alert("request: "+request+" \nstatus: "+status+" \nerror: "+error);},data:{}});};function OnSuccesfullGroupChanged(data){var gMgr=Sage.Services.getService("GroupManagerService");if(gMgr){var prevcontext=gMgr._contextService.getContext();gMgr._contextService.setContext(data);gMgr.onCurrentGroupChanged({current:gMgr._contextService.getContext(),previous:prevcontext});}}
Sage.GroupManagerService.prototype.doLookup=function(conditionStr,withinGroup){var self=this;var sdata={};if(typeof withinGroup==="undefined"){withinGroup=false;}
sdata.resource="slxdata.ashx/slx/crm/-/groups/context";sdata.predicate=null;sdata.qparams={groupid:Sage.GroupManagerService.LOOKUPRESULTS,includegroupconditions:(withinGroup)?"true":"false",conditions:conditionStr,responsetype:"json",time:new Date().getTime()}
$.ajax({url:self.buildRequestUrl(sdata),type:"POST",dataType:"json",success:OnSuccesfullGroupChanged,error:function(request,status,error){alert("request: "+request+" \nstatus: "+status+" \nerror: "+error);},data:{}});}
Sage.GroupManagerService.prototype.onFilterChanged=function(args){for(var i=0;i<this._listeners[Sage.GroupManagerService.FILTER_CHANGED].length;i++)
{var listener=this._listeners[Sage.GroupManagerService.FILTER_CHANGED][i].listener;var evt=this._listeners[Sage.GroupManagerService.FILTER_CHANGED][i].evt;if(evt.family&&evt.family.toLowerCase()!=args.family.toLowerCase())
continue;if(evt.name&&evt.name.toLowerCase()!=args.name.toLowerCase())
continue;if(evt.hold<0)
{if(typeof listener==="function")
listener(this,args);else if(typeof listener==="object")
listener.onFilterChanged(this,args);}
else
{if(evt.timeout)
clearTimeout(evt.timeout);(function(l){evt.timeout=setTimeout(function(){if(typeof l==="function")
l(this,args);else if(typeof l==="object")
l.onFilterChanged(this,args);},evt.hold);})(listener);this.onListenerHoldStarted({held:listener,timeout:evt.timeout,args:args});}}};Sage.GroupManagerService.prototype.onCurrentGroupChanged=function(args){for(var i=0;i<this._listeners[Sage.GroupManagerService.CURRENT_GROUP_CHANGED].length;i++)
{var listener=this._listeners[Sage.GroupManagerService.CURRENT_GROUP_CHANGED][i].listener;if(typeof listener==="function")
listener(this,args);else if(typeof listener==="object")
listener.onCurrentGroupChanged(this,args);}};Sage.GroupManagerService.prototype.onCurrentGroupPositionChanged=function(args){for(var i=0;i<this._listeners[Sage.GroupManagerService.CURRENT_GROUP_POSITION_CHANGED].length;i++)
{var listener=this._listeners[Sage.GroupManagerService.CURRENT_GROUP_POSITION_CHANGED][i].listener;if(typeof listener==="function")
listener(this,args);else if(typeof listener==="object")
listener.onCurrentGroupPositionChanged(this,args);}};Sage.GroupManagerService.prototype.onCurrentGroupCountChanged=function(args){for(var i=0;i<this._listeners[Sage.GroupManagerService.CURRENT_GROUP_COUNT_CHANGED].length;i++)
{var listener=this._listeners[Sage.GroupManagerService.CURRENT_GROUP_COUNT_CHANGED][i].listener;if(typeof listener==="function")
listener(this,args);else if(typeof listener==="object")
listener.onCurrentGroupCountChanged(this,args);}};Sage.GroupManagerService.prototype.onListenerHoldStarted=function(args){for(var i=0;i<this._listeners[Sage.GroupManagerService.LISTENER_HOLD_STARTED].length;i++)
{var listener=this._listeners[Sage.GroupManagerService.LISTENER_HOLD_STARTED][i].listener;if(typeof listener==="function")
listener(this,args);else if(typeof listener==="object")
listener.onListenerHoldStarted(this,args);}};Sage.GroupManagerService.prototype.requestRangeCounts=function(callback,options){var self=this;if(this._contextService.getContext().CurrentName==null){return;}
if(typeof options==="undefined"||options==null)
options={family:this._contextService.getContext().CurrentFamily,name:this._contextService.getContext().CurrentName};options.keys={family:options.family.toLowerCase(),name:options.name.toLowerCase()};var sdata={};sdata.resource="slxdata.ashx/slx/crm/-/groups";sdata.qparams={family:options.family,name:options.name,output:"rangeCounts",responsetype:"json",time:new Date().getTime()};$.ajax({url:this.buildRequestUrl(sdata),dataType:"json",success:function(data){callback(data)},error:function(request,status,error){}});}
Sage.GroupManagerService.prototype.requestActiveFilters=function(callback,options){var self=this;if(this._contextService.getContext().CurrentName==null){return;}
if(typeof options==="undefined"||options==null)
options={family:this._contextService.getContext().CurrentFamily,name:this._contextService.getContext().CurrentName};options.keys={family:options.family.toLowerCase(),name:options.name.toLowerCase()};var sdata={};sdata.resource="slxdata.ashx/slx/crm/-/groups";sdata.qparams={family:options.family,name:options.name,output:"activeFilters",responsetype:"json",time:new Date().getTime()};$.ajax({url:this.buildRequestUrl(sdata),dataType:"json",success:function(data){callback(data);},error:function(request,status,error){}});}
Sage.GroupManagerService.prototype.requestActiveFilter=function(callback,options){var self=this;if(this._contextService.getContext().CurrentName==null){return;}
if(typeof options==="undefined"||options==null)
options={family:this._contextService.getContext().CurrentFamily,name:this._contextService.getContext().CurrentName};options.keys={family:options.family.toLowerCase(),name:options.name.toLowerCase()};if(this._filters[options.keys.family]&&this._filters[options.keys.family][options.keys.name])
{callback({filter:this._filters[options.keys.family][options.keys.name],family:options.family,name:options.name,options:options});}
else
{$.ajax({type:"POST",contentType:"application/json; charset=utf-8",url:"UIStateService.asmx/GetUIState",data:Ext.util.JSON.encode({section:Sage.GroupManagerService.UI_STATE_SECTION,key:"filter:"+options.keys.family+"-"+options.keys.name}),dataType:"json",error:function(request,status,error){},success:function(data,status){var filter;if(data&&data.d)filter=Ext.util.JSON.decode(data.d);self._filters[options.keys.family]=self._filters[options.keys.family]||{};self._filters[options.keys.family][options.keys.name]=filter;callback({filter:filter,family:options.family,name:options.name,options:options});}});}};Sage.GroupManagerService.prototype.saveActiveFilter=function(family,name){var self=this;var key=family+"-"+name;if(this._saveFilterTimeouts[key])
clearTimeout(this._saveFilterTimeouts[key]);this._saveFilterTimeouts[key]=setTimeout(function(){self.doSaveActiveFilter(family,name);},5000);};Sage.GroupManagerService.prototype.doSaveActiveFilter=function(family,name){var keys={family:family.toLowerCase(),name:name.toLowerCase()};$.ajax({type:"POST",contentType:"application/json; charset=utf-8",url:"UIStateService.asmx/StoreUIState",data:Ext.util.JSON.encode({section:Sage.GroupManagerService.UI_STATE_SECTION,key:"filter:"+keys.family+"-"+keys.name,value:Ext.util.JSON.encode(this._filters[keys.family][keys.name])}),dataType:"json",error:function(request,status,error){},success:function(data,status){}});};Sage.GroupManagerService.prototype.setActiveFilter=function(filter,options){if(typeof options==="undefined"||options==null)
options={family:this._contextService.getContext().CurrentFamily,name:this._contextService.getContext().CurrentName};options.keys={family:options.family.toLowerCase(),name:options.name.toLowerCase()};this._filters[options.keys.family]=this._filters[options.keys.family]||{};this._filters[options.keys.family][options.keys.name]=filter;var caf=this._contextService.getContext().CurrentActiveFilters;var found=false;for(var i=0;i<caf.length;i++){if((caf[i].Name==filter.filterName)&&(caf[i].Entity==filter.entity)){found=true;caf[i].Value=filter.value;}}
if(!found){this._contextService.getContext().CurrentActiveFilters.push({Name:filter.filterName,Entity:filter.entity,InCurrentGroupLayout:true,FilterId:Sage.FiltersToJSId(filter.entity)+"_"+Sage.FiltersToJSId(filter.filterName),Value:filter.value});}
if(filter.filterType=='clear')caf=[];this._contextService.getContext().CurrentActiveFilters=caf;this.saveActiveFilter(options.keys.family,options.keys.name);this.onFilterChanged({filter:filter,family:options.family,name:options.name,options:options});};Sage.GroupManagerService.prototype.addListener=function(event,listener,options){this._listeners[event]=this._listeners[event]||[];if(typeof options=="undefined"||options==null)
options={hold:-1};this._listeners[event].push({listener:listener,evt:options});};Sage.GroupManagerService.prototype.removeListener=function(event,listener){this._listeners[event]=this._listeners[event]||[];for(var i=0;i<this._listeners[event].length;i++)
if(this._listeners[event][i].listener==listener)
break;this._listeners[event].splice(i,1);};Sage.GroupManagerService.prototype.findGroupInfoList=function(){if(typeof(groupInfoList)!="undefined"){return groupInfoList;}}
Sage.GroupManagerService.prototype.findGroupInfoById=function(groupId){var list=this.findGroupInfoList();if(list){if(typeof(list.groupInfos)!="undefined"){for(var i=0;i<list.groupInfos.length;i++){if(list.groupInfos[i].groupID==groupId)
return list.groupInfos[i];}}}}
Sage.Services.addService("GroupManagerService",new Sage.GroupManagerService());