/*
 * Sage SalesLogix Web Controls
 * Copyright(c) 2009, Sage Software.
 */


Sage.ClientGroupContextService=function(){this._emptyContext={DefaultGroupID:null,CurrentGroupID:null,CurrentTable:null,CurrentName:null,CurrentEntity:null,CurrentFamily:null};this.isRetrievingContext=false;};Sage.ClientGroupContextService.prototype.getContext=function(){if(window.__groupContext){if(!window.__groupContext.ContainsPositionState)
this.requestContext();return window.__groupContext;}
this.requestContext();return this._emptyContext;};Sage.ClientGroupContextService.prototype.requestContext=function(){if(this.isRetrievingContext==true)
return;window.setTimeout(function(){$.ajax({url:'slxdata.ashx/slx/crm/-/groups/context?time='+new Date().getTime(),type:'GET',dataType:'json',success:function(data){var svc=Sage.Services.getService("ClientGroupContext");if(typeof(svc)!="unknown")
svc.setContext(data);}});},5000);this.isRetrievingContext=true;}
Sage.ClientGroupContextService.prototype.setContext=function(contextObj){if(typeof contextObj==="object"){window.__groupContext=contextObj;}
var svc=Sage.Services.getService("ClientGroupContext")
svc.isRetrievingContext=false;}
Sage.ClientGroupContextService.prototype.setCurrentGroup=function(grpID,grpName){var context=this.getContext();if(grpID)context.CurrentGroupID=grpID;if(grpName)context.CurrentName=grpName;}
Sage.Services.addService("ClientGroupContext",new Sage.ClientGroupContextService());