/*
 * Sage SalesLogix Web Controls
 * Copyright(c) 2009, Sage Software.
 */


function UserControl(options){options=options||{};this._dialog=null;this._options=options;this._clientId=options.clientId;this._textClientId=options.textClientId;this._valueClientId=options.valueClientId;this._autoPostBack=options.autoPostBack;this._userTypesToShow=options.userTypesToShow;this._userTypesToShowOrder=options.userTypesToShowOrder;this._identifyNodes=true;this._result=false;this._typeAheadText=false;this._typeAheadTimeout=false;this._helpLink=options.helpLink;UserControl.__instances[this._clientId]=this;UserControl.__initRequestManagerEvents();this.addEvents('open','close','change');};Ext.extend(UserControl,Ext.util.Observable);UserControl.__instances={};UserControl.__requestManagerEventsInitialized=false;UserControl.__initRequestManagerEvents=function(){if(UserControl.__requestManagerEventsInitialized)
return;var contains=function(a,b){if(!a||!b)
return false;else
return a.contains?(a!=b&&a.contains(b)):(!!(a.compareDocumentPosition(b)&16));};var prm=Sys.WebForms.PageRequestManager.getInstance();prm.add_pageLoaded(function(sender,args){var panels=args.get_panelsUpdated();if(panels)
{for(var i=0;i<panels.length;i++)
{for(var id in UserControl.__instances)
if(contains(panels[i],document.getElementById(id)))
{var instance=UserControl.__instances[id];instance.initContext();}}}});UserControl.__requestManagerEventsInitialized=true;};UserControl.prototype.init=function(){this.initContext();};UserControl.prototype.initContext=function(){this._context=document.getElementById(this._clientId);};UserControl.prototype.identifyNode=function(node){if(!this._identifyNodes||node._wasIdentified)
return;for(var i=0;i<node.childNodes.length;i++)
{var child=node.childNodes[i];var el=child.getUI().getAnchor();$(el).attr("id",(this._clientId+"_"+child.id));}
node._wasIdentified=true;};UserControl.prototype.createUserTypeNodes=function(){var self=this;var children=[];for(var i=0;i<this._userTypesToShowOrder.length;i++)
{var id=this._userTypesToShowOrder[i];children.push({id:id,text:this._userTypesToShow[id],cls:["user-type-container"," ","user-type-",id,"-container"].join(''),singleClickExpand:true,expanded:false,listeners:{"expand":function(node){self.identifyNode(node);}}});}
return children;};UserControl.prototype.createDialog=function(){var self=this;var root=new Ext.tree.AsyncTreeNode({text:"Root",id:"root",expanded:true,listeners:{"expand":function(node){self.identifyNode(node);}},children:this.createUserTypeNodes()});var loader=new Ext.tree.TreeLoader({url:"slxdata.ashx/slx/crm/-/users/{0}",requestMethod:"GET"});loader.on("beforeload",function(treeLoader,node){treeLoader.formatUrl=treeLoader.formatUrl||treeLoader.url;treeLoader.url=String.format(treeLoader.formatUrl,node.id);});var tree=new Ext.tree.TreePanel({id:this._clientId+"_tree",root:root,rootVisible:false,containerScroll:true,autoScroll:true,animate:false,frame:false,stateful:false,loader:loader,border:false});var panel=new Ext.Panel({id:this._clientId+"_container",layout:"fit",border:false,stateful:false,items:tree});var dialog=new Ext.Window({id:this._clientId+"_window",title:UserControlResources.SlxUserControl_Header,cls:"lookup-dialog user-lookup-dialog",layout:"border",closeAction:"hide",plain:true,height:400,width:300,stateful:false,constrain:true,modal:true,items:[{region:"center",margins:"0 0 0 0",border:false,layout:"fit",id:this._clientId+"_layout_center",items:panel}],buttonAlign:"right",buttons:[{id:this._clientId+"_ok",text:GetResourceValue(UserControlResources.SlxUserControl_Button_Ok,"OK"),handler:function(){var node=tree.getSelectionModel().getSelectedNode();if(!node||!node.isLeaf()){Ext.Msg.alert("",UserControlResources.SlxUserControl_UserType_NoRecordSelected);return;}
self.close();self.setResult(node.id,node.text);}},{id:this._clientId+"_cancel",text:UserControlResources.SlxUserControl_Button_Cancel,handler:function(){self.close();}}],tools:[{id:"help",handler:function(evt,toolEl,panel){if(self._helpLink&&self._helpLink.url)
window.open(self._helpLink.url,(self._helpLink.target||"help"));}}]});dialog.on("show",function(win){$(document).bind("keyup.UserControl",function(evt){switch(evt.keyCode){case 13:case 32:var node=tree.getSelectionModel().getSelectedNode();if(node&&!node.isExpanded())
node.expand();break;}});$(document).bind("keypress.UserControl",function(evt){var key=evt.charCode||evt.keyCode;var text=String.fromCharCode(key);if(self._typeAheadTimeout)
clearTimeout(self._typeAheadTimeout);self._typeAheadTimeout=setTimeout(function(){self._typeAheadText=false;},1500);if(self._typeAheadText)
self._typeAheadText=text=self._typeAheadText+text;else
self._typeAheadText=text;var node=tree.getSelectionModel().getSelectedNode();if(node){if(node.parentNode&&(node.isLeaf()||!node.isExpanded()))
node=node.parentNode;}
else{node=root;}
var match=self.search(node,new RegExp("^"+text,"i"));if(match){match.select();return false;}});if(typeof idLookup!="undefined")idLookup("lookup-dialog");});dialog.on("hide",function(win){$(document).unbind("keypress.UserControl");$(document).unbind("keyup.UserControl");});tree.on("dblclick",function(node,evt){if(!node||!node.isLeaf())
return;self.close();self.setResult(node.id,node.text);});this._dialog=dialog;this._tree=tree;};UserControl.prototype.search=function(node,expr){if(node)
{if(node.id!="root"&&expr.test(node.text))
return node;if(node.isExpanded())
{for(var i=0;i<node.childNodes.length;i++)
{var child=node.childNodes[i];var match=false;if(child.isLeaf())
{if(expr.test(child.text))
return child;}
else if((match=this.search(child,expr)))
return match;}}}
return false;};UserControl.prototype.show=function(){var self=this;if(!this._dialog)
this.createDialog();this._dialog.doLayout();this._dialog.show();this._dialog.center();this.fireEvent('open',this);};UserControl.prototype.close=function(){if(this._dialog)
this._dialog.hide();};UserControl.prototype.setResult=function(id,text){this._result={id:id,text:text};var textEl=$("#"+this._textClientId,this._context).get(0);var valueEl=$("#"+this._valueClientId,this._context).get(0);textEl.value=text;valueEl.value=id;this.invokeChangeEvent(textEl);this.fireEvent('change',this);if(this._autoPostBack)
__doPostBack(this._clientId,'');};UserControl.prototype.invokeChangeEvent=function(el){if(document.createEvent)
{var evt=document.createEvent('HTMLEvents');evt.initEvent('change',true,true);el.dispatchEvent(evt);}
else
{el.fireEvent('onchange');}};function UserPanel(clientId,autoPostBack)
{this.ClientId=clientId;this.UserDivId=clientId+"_outerDiv";this.UserTypeId=clientId+"_UserType";this.UserTextId=clientId+"_LookupText";this.UserValueId=clientId+"_LookupResult";this.ResultDivId=clientId+"_Results";this.UserListId=clientId+"_UserList";this.AutoPostBack=autoPostBack;this.LookupValue="";this.DisplayValue="";this.onChange=new YAHOO.util.CustomEvent("change",this);this.panel=null;}
function UserPanel_CanShow()
{var inPostBack=false;if(Sys)
{var prm=Sys.WebForms.PageRequestManager.getInstance();inPostBack=prm.get_isInAsyncPostBack();}
if(!inPostBack)
{return true;}
else
{var id=this.ClientId+"_obj";var handler=function()
{window[id].Show('');}
Sage.SyncExec.call(handler);return false;}}
function UserPanel_Show()
{if(this.CanShow())
{if((this.panel==null)||(this.panel.element.parentNode==null))
{var lookup=document.getElementById(this.UserDivId);lookup.style.display="block";this.panel=new YAHOO.widget.Panel(this.UserDivId,{visible:false,width:"305px",fixedcenter:true,constraintoviewport:true,underlay:"shadow",draggable:true,modal:false});this.panel.render();}
this.panel.show();var userType=document.getElementById(this.UserTypeId);var list=document.getElementById(this.UserListId);if(list.options.length<1)
{var type=userType.selectedIndex;if(type==-1){type=0;}
var vURL="SLXUserListHandler.aspx?usertype="+type;if(typeof(xmlhttp)=="undefined"){xmlhttp=YAHOO.util.Connect.createXhrObject().conn;}
xmlhttp.open("GET",vURL,false);xmlhttp.send(null);var results=xmlhttp.responseText;var items=results.split("|");for(var i=0;i<items.length;i++)
{if(items[i]=="")continue;var parts=items[i].split("*");var oOption=document.createElement("OPTION");list.options.add(oOption);if(parts[0].charAt(0)=='@')
{parts[0]=parts[0].substr(1);oOption.selected=true;}
oOption.innerHTML=parts[1];oOption.value=parts[0];}}}}
function UserPanel_PerformLookup()
{var userType=document.getElementById(this.UserTypeId);var list=document.getElementById(this.UserListId);for(var i=list.options.length-1;i>=0;i--)
{list.options[i]=null;}
var type=userType.selectedIndex;if(type==-1){type=0;}
var vURL="SLXUserListHandler.aspx?usertype="+type;if(typeof(xmlhttp)=="undefined"){xmlhttp=YAHOO.util.Connect.createXhrObject().conn;}
xmlhttp.open("GET",vURL,false);xmlhttp.send(null);var results=xmlhttp.responseText;if(results=="NOTAUTHENTICATED")
{window.location.reload(true);return;}
var items=results.split("|");for(var i=0;i<items.length;i++)
{if(items[i]=="")continue;var parts=items[i].split("*");var oOption=document.createElement("OPTION");list.options.add(oOption);if(parts[0].charAt(0)=='@')
{parts[0]=parts[0].substr(1);oOption.selected=true;}
oOption.innerHTML=parts[1];oOption.value=parts[0];}}
function UserPanel_Close()
{this.panel.hide();}
function UserPanel_Ok()
{var list=document.getElementById(this.UserListId);try
{this.LookupValue=list.options[list.selectedIndex].value;}
catch(e)
{Ext.Msg.alert("",UserControlResources.SlxUserControl_UserType_NoRecordSelected);return false;}
this.DisplayValue=list.options[list.selectedIndex].innerHTML;var UserText=document.getElementById(this.UserTextId);var UserValue=document.getElementById(this.UserValueId);UserText.value=this.DisplayValue;UserValue.value=this.LookupValue;this.panel.hide();this.onChange.fire(this);this.InvokeChangeEvent(UserText);if(this.AutoPostBack)
{if(Sys)
{Sys.WebForms.PageRequestManager.getInstance()._doPostBack(this.ClientId,null);}
else
{document.forms(0).submit();}}}
function UserPanel_getVal()
{return this.LookupValue;}
function UserPanel_setVal(key,display)
{this.LookupValue=key;this.DisplayValue=display;var lookupText=document.getElementById(this.LookupTextId);lookupText.value=this.DisplayValue;}
function UserPanel_GetUserTypeParam()
{var UserType=document.getElementById(this.UserTypeId);var arg=-1;if(UserType.options.length>0)
{arg=UserType.selectedIndex;}
return arg;}
function UserPanel_InvokeChangeEvent(cntrl)
{if(document.createEvent)
{var evObj=document.createEvent('HTMLEvents');evObj.initEvent('change',true,true);cntrl.dispatchEvent(evObj);}
else
{cntrl.fireEvent('onchange');}}
UserPanel.prototype.CanShow=UserPanel_CanShow;UserPanel.prototype.Show=UserPanel_Show;UserPanel.prototype.Close=UserPanel_Close;UserPanel.prototype.GetUserTypeParam=UserPanel_GetUserTypeParam;UserPanel.prototype.Ok=UserPanel_Ok;UserPanel.prototype.PerformLookup=UserPanel_PerformLookup;UserPanel.prototype.getVal=UserPanel_getVal;UserPanel.prototype.setVal=UserPanel_setVal;UserPanel.prototype.InvokeChangeEvent=UserPanel_InvokeChangeEvent;if(typeof(Sys)!=='undefined')Sys.Application.notifyScriptLoaded();