/*
 * SagePlatform
 * Copyright(c) 2009, Sage Software.
 */


Sage.DialogWorkspace=function(options){this._initialized=false;this._id=options.id;this._clientId=options.clientId;this._stateClientId=options.stateClientId;this._panelClientId=options.panelClientId;this._contentClientId=options.contentClientId;this._context=null;this._dialog=null;this._dialogPanel=null;this._closedOnServerSide=false;this._dialogInfo={};this.addEvents('open','close');Sage.DialogWorkspace.__instances[this._clientId]=this;Sage.DialogWorkspace.__initRequestManagerEvents();};Ext.extend(Sage.DialogWorkspace,Ext.util.Observable);Sage.DialogWorkspace.__maskCount=0;Sage.DialogWorkspace.__instances={};Sage.DialogWorkspace.__requestManagerEventsInitialized=false;Sage.DialogWorkspace.__initRequestManagerEvents=function(){if(Sage.DialogWorkspace.__requestManagerEventsInitialized)
return;var contains=function(a,b){if(!a||!b)
return false;else
return a.contains?(a!=b&&a.contains(b)):(!!(a.compareDocumentPosition(b)&16));};var prm=Sys.WebForms.PageRequestManager.getInstance();prm.add_beginRequest(function(sender,args){var element=args.get_postBackElement();if(element)
{for(var id in Sage.DialogWorkspace.__instances)
{var instance=Sage.DialogWorkspace.__instances[id];if(instance._context&&contains(instance._context,element))
{instance.disable();}}}});prm.add_pageLoaded(function(sender,args){var panels=args.get_panelsUpdated();if(panels)
{for(var id in Sage.DialogWorkspace.__instances)
{for(var i=0;i<panels.length;i++)
{var instance=Sage.DialogWorkspace.__instances[id];if(contains(panels[i],document.getElementById(instance._stateClientId)))
{instance.enable();instance.handleEvents();break;}}}}});prm.add_endRequest(function(sender,args){for(var id in Sage.DialogWorkspace.__instances)
{var instance=Sage.DialogWorkspace.__instances[id];instance.clearState();instance.enable();}});Sage.DialogWorkspace.__requestManagerEventsInitialized=true;};Sage.DialogWorkspace.requestMask=function(){Sage.DialogWorkspace.__maskCount=Sage.DialogWorkspace.__maskCount+1};Sage.DialogWorkspace.prototype.init=function(){this.initContext();this.initDialog();$("#"+this._contentClientId).show();this.handleEvents();};Sage.DialogWorkspace.prototype.clearState=function(){$("#"+this._stateClientId).val("");};Sage.DialogWorkspace.prototype.disable=function(){if(!this._dialog)
return;if(!this._dialog.isVisible())
return;this._dialog.disable();};Sage.DialogWorkspace.prototype.enable=function(){if(!this._dialog)
return;if(!this._dialog.isVisible())
return;this._dialog.enable();};Sage.DialogWorkspace.prototype.show=function(o){if(typeof o==="string")
o={id:o}
o.event="open";o.from=o.from||"client";var value=Sys.Serialization.JavaScriptSerializer.serialize(o);$("#"+this._stateClientId).val(value);__doPostBack(this._stateClientId,'');};Sage.DialogWorkspace.prototype.initContext=function(){this._context=document.getElementById(this._clientId);};Sage.DialogWorkspace.prototype.initDialog=function(){var self=this;var content=new Ext.Panel({cls:"dialog-workspace-content-panel",id:this._contentClientId+"_panel",contentEl:this._contentClientId,border:false,allowDomMove:false,stateful:false});var wrapper=new Ext.Panel({id:this._clientId+"_wrapper",cls:"dialog-workspace-wrapper",autoScroll:true,border:false,items:[content]});var dialog=new Ext.Window({id:this._clientId,tools:[{id:"help",handler:function(){if(self._dialogInfo.help&&self._dialogInfo.help.url)
window.open(self._dialogInfo.help.url,(self._dialogInfo.help.target||"help"));}}],items:[wrapper],allowDomMove:false,applyTo:Ext.get(this._clientId),layout:"fit",closeAction:"hide",cls:"dialog-workspace",plain:true,stateful:false,constrain:true,modal:true});dialog.on('show',function(panel){if(self._dialogInfo.help&&self._dialogInfo.help.url)
panel.tools["help"].show();else
panel.tools["help"].hide();self.fireEvent('open',this);});dialog.on('beforehide',function(panel){if(self._closedOnServerSide)
return;var evt={event:"close",id:self._dialogInfo.id};var bindingManager=Sage.Services.getService('ClientBindingManagerService');if(bindingManager)
bindingManager.rollbackCurrentTransaction();self._dialogInfo={};var value=Sys.Serialization.JavaScriptSerializer.serialize(evt);$("#"+self._stateClientId).val(value);Sage.DialogWorkspace.requestMask();__doPostBack(self._stateClientId,'');return false;});dialog.on('hide',function(panel){self.fireEvent('close',this);});dialog.on('resize',function(window,width,height){dialog.doLayout();});this._dialogPanel=content;this._dialog=dialog;};Sage.DialogWorkspace.prototype.fitToViewport=function(size){var win={width:$(window).width(),height:$(window).height()};var el={width:$(this._dialogPanel.getEl().dom).find(".dialog-workspace-content").width(),height:$(this._dialogPanel.getEl().dom).find(".dialog-workspace-content").height()};var frame={width:this._dialog.getFrameWidth(),height:this._dialog.getFrameHeight()};if(el.width<=0||el.height<=0)
el={width:0,height:0};var out={width:(size.width+frame.width),height:(size.height+frame.height),left:false,top:false,scroll:false};if(out.height>win.height)
{out.height=win.height;out.top=0;out.scroll=true;}
if(out.width>win.width)
{out.width=win.width;out.left=0;}
return out;};Sage.DialogWorkspace.prototype.handleEvents=function(){var value=$("#"+this._stateClientId).val();var evt={};if(value)
evt=eval("("+value+")");$("#"+this._stateClientId).val("");switch(evt.event){case"open":if(this._dialog){this._dialogInfo=evt;this._dialog.setTitle(this._dialogInfo.title);var size=this.fitToViewport({width:evt.width,height:evt.height});this._dialog.setSize(size.width,size.height);if(size.scroll)
this._dialog.addClass("dialog-workspace-scroll");else
this._dialog.removeClass("dialog-workspace-scroll");this._dialog.doLayout();this._dialog.show();if(evt.centerDialog)
this._dialog.center();else
this._dialog.setPosition(evt.left,evt.top);}
break;case"close":if(this._dialog){this._closedOnServerSide=true;this._dialog.hide();this._dialogInfo={};this._closedOnServerSide=false;}
if(this.onClose){for(var i=0;i<this.onClose.length;i++){this.onClose[i]();}}
break;}};