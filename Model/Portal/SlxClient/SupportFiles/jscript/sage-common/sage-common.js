/*
 * SageSalesLogixCommon
 * Copyright(c) 2009, Sage Software.
 * 
 * 
 */


function Cookie()
{this.defaultCookie="userprefs";}
function Cookie_getCookie(cookieName)
{var cookiestring=document.cookie;var cookies=cookiestring.split("; ");var search=(cookieName?cookieName:this.defaultCookie)+"=";for(i=0;i<cookies.length;i++){if(cookies[i].indexOf(search)>-1){return unescape(cookies[i].split("=")[1])}}}
function Cookie_setCookie(strPairs,cookieName)
{document.cookie=(cookieName?cookieName:this.defaultCookie)+"="+escape(strPairs);}
function Cookie_parseCookie(cookieName)
{var myCookie=this.getCookie((cookieName?cookieName:this.defaultCookie));if(myCookie){var pairs=myCookie.split("&");return pairs;}else{return new Array();}}
function Cookie_getCookieParm(parmName,cookieName)
{var parms=this.parseCookie(cookieName?cookieName:this.defaultCookie);var search=parmName+"=";for(var i=0;i<parms.length;i++){if(parms[i].indexOf(search)>-1)
{var vals=parms[i].split("=");return(vals[1]?vals[1]:"");}}
return"";}
function Cookie_setCookieParm(strVal,parmName,cookieName)
{var parms=this.parseCookie(cookieName?cookieName:this.defaultCookie);var pFound=false;var search=parmName+"=";for(var i=0;i<parms.length;i++){if(parms[i].indexOf(search)>-1){parms[i]=search+strVal;pFound=true;break;}}
if(pFound==false)
{parms[parms.length]=search+strVal;}
this.setCookie(parms.join("&"),(cookieName?cookieName:this.defaultCookie));}
function Cookie_delCookieParm(parmName,cookieName)
{var pairs=this.parseCookie((cookieName?cookieName:this.defaultCookie));var search=parmName+"=";var retpairs=new Array();for(var i=0;i<pairs.length;i++)
{if(pairs[i].indexOf(search)==-1)
{retpairs[retpairs.length]=pairs[i];}}
this.setCookie(retpairs.join("&"),(cookieName?cookieName:this.defaultCookie));}
Cookie.prototype.getCookie=Cookie_getCookie;Cookie.prototype.setCookie=Cookie_setCookie;Cookie.prototype.parseCookie=Cookie_parseCookie;Cookie.prototype.getCookieParm=Cookie_getCookieParm;Cookie.prototype.setCookieParm=Cookie_setCookieParm;Cookie.prototype.delCookieParm=Cookie_delCookieParm;var cookie=new Cookie();if(typeof(Sys)!=='undefined'){Sys.Application.notifyScriptLoaded();}

Ext.FormViewport=Ext.extend(Ext.Container,{initComponent:function(){Ext.FormViewport.superclass.initComponent.call(this);document.getElementsByTagName('html')[0].className+=' x-viewport';this.el=Ext.get(document.forms[0]);this.el.setHeight=Ext.emptyFn;this.el.setWidth=Ext.emptyFn;this.el.setSize=Ext.emptyFn;this.el.dom.scroll='no';this.allowDomMove=false;this.autoWidth=true;this.autoHeight=true;Ext.EventManager.onWindowResize(this.fireResize,this);this.renderTo=this.el;},fireResize:function(w,h){this.fireEvent('resize',this,w,h,w,h);}});Ext.reg('FormViewport',Ext.FormViewport);

function showMoreInfo()
{var address='ActivexInfo.aspx';var win=window.open(address,'AlarmMgrWin','width=425,height=425,directories=no,location=no,menubar=no,status=yes,scrollbars=yes,resizable=yes,titlebar=no,toolbar=no');}
function ConvertToPhpDateTimeFormat(formatstring){var conversions=[{"mm":"i"},{"m":"i"},{"ss":"s"},{"dddd":"l"},{"ddd":"D"},{"d":"j"},{"jj":"d"},{"MMMM":"F"},{"M":"n"},{"nnn":"M"},{"nn":"m"},{"yyyy":"Y"},{"yy":"y"},{"hh":"h"},{"h":"g"},{"HH":"H"},{"H":"G"},{"tt":"A"},{"t":"A"},{"fff":"u"},{"ff":"u"},{"f":"u"},{"zzz":"Z"},{"zz":"Z"},{"z":"Z"}];var result=formatstring;for(var i=0;i<conversions.length;i++)
{for(var k in conversions[i])
result=result.replace(new RegExp(k,"g"),conversions[i][k]);}
return result;}
function getContextByKey(key){var res='';if(Sage.Services){var contextservice=Sage.Services.getService("ClientContextService");if((contextservice)&&(contextservice.containsKey(key))){res=contextservice.getValue(key);}}
return res;}
function getCookie(c_name)
{if(document.cookie.length>0)
{c_start=document.cookie.indexOf(c_name+"=");if(c_start!=-1)
{c_start=c_start+c_name.length+1;c_end=document.cookie.indexOf(";",c_start);if(c_end==-1)c_end=document.cookie.length;return unescape(document.cookie.substring(c_start,c_end));}}
return"";}
function showRequestIndicator(){var elem=document.getElementById("asyncpostbackindicator");if(elem){elem.style.visibility="visible";}}
function hideRequestIndicator(sender,args){var elem=document.getElementById("asyncpostbackindicator");if(elem){elem.style.visibility="hidden";}
if(!args||!args.get_error)return;if(args.get_error!=undefined&&args.get_error()!=undefined){if(args.get_response().get_statusCode()=='0'){args.set_errorHandled(true);return;}
var errorMessage;if(args.get_response().get_statusCode()=='200'){errorMessage=args.get_error().message;}
else{var e=$get("defaultErrorMessage");if(e){if(e.innerText){errorMessage=e.innerText;}else{for(var i=0;i<e.childNodes.length;i++){if(e.childNodes[i].nodeType==3){errorMessage=e.childNodes[i].nodeValue;break;}}}}}
args.set_errorHandled(true);var msgService=Sage.Services.getService("WebClientMessageService");if(msgService){msgService.showClientMessage(errorMessage);}}}
function linkTo(url,helpWindow){if(helpWindow){window.open(url,'MCWebHelp');}else{try{window.location.href=url;}catch(e){}}}
function GeneralSearchOptionsPage_init(){if(document.getElementById("FaxProviderOptions"))
{var inputs=document.getElementsByTagName("input");for(var i=0;i<inputs.length;i++){if(inputs[i].id.indexOf("txtFaxProvider")>-1){FaxProviderControl=inputs[i];break;}}
if(typeof(FaxProviderControl)!="undefined"){FaxProviderControl.style.display="none";if(top.MailMergeGUI!=undefined){var x=top.MailMergeGUI.GetFaxProviderOptions(FaxProviderControl.value);x='<select name="FaxOptions" onchange="updateFaxProvider()">'+x+'</select>';document.all.FaxProviderOptions.innerHTML=x;}}}else{window.setTimeout('GeneralSearchOptionsPage_init()',500);}}
function SaveLookupAsGroup(obj,e,msg){if(typeof(msg)=='undefined'){msg=MasterPageLinks.SaveLookupAsGroupNamePrompt;}
Ext.Msg.prompt(MasterPageLinks.SaveLookupAsGroupNameDlgTitle,msg,function(btn,text){if(btn=='ok'&&text==''){SaveLookupAsGroup(obj,MasterPageLinks.AdHocDialog_NewGroupRePrompt);}
else if(btn=='ok'&&(text.match(/\'|\"|\/|\\|\*|\:|\?|\<|\>/)!=null)){promptForName(MasterPageLinks.SaveLookupAsGroupInvalidChar);}
else if(btn=='ok'&&text!=''){SaveLookup(text);}},'New Group');}
function SaveLookup(name){var postUrl="slxdata.ashx/slx/crm/-/groups/adhoc?action=SaveLookupAsGroup&name="+encodeURIComponent(name);$.ajax({type:"POST",url:postUrl,error:HandleSaveLookupError,success:OnNewGroupCreated,data:{},dataType:"text"});}
function HandleSaveLookupError(request,status){if(typeof request!='undefined'){if((typeof request.responseXML!='undefined')&&(request.responseXML!=null)){var nodes=request.responseXML.getElementsByTagName('sdata:message');if(nodes.length>0){Ext.Msg.show({title:"",msg:nodes[0].text,buttons:Ext.Msg.OK,icon:Ext.MessageBox.ERROR});}else{nodes=request.responseXML.getElementsByTagName('message');if(nodes.length>0){Ext.Msg.show({title:"",msg:nodes[0].textContent,buttons:Ext.Msg.OK,icon:Ext.MessageBox.ERROR});}}}
else{Ext.Msg.alert("an unidentified exception has occured");}}}
function OnNewGroupCreated(data,data2){var url=document.location.href.replace("#","");if(url.indexOf("?")>-1){var halves=url.split("?");url=halves[0];}
url+="?modeid=list"
document.location=url;}
function showAdHocMenu(e){var groupID=Sage.Services.getService("GroupManagerService")._contextService.getContext().CurrentGroupID;if(typeof(GroupGridContextMenu)!='undefined')
{GroupGridContextMenu.removeAll();}
else
{GroupGridContextMenu=new Ext.menu.Menu({id:'GroupGridContext'});if(typeof idMenuItems!="undefined"){GroupGridContextMenu.on("show",function(){idMenuItems();});}}
if(typeof groupGridContextMenuData==="undefined"||!groupGridContextMenuData)
return;var menustring=Sys.Serialization.JavaScriptSerializer.serialize(groupGridContextMenuData.menuitems);var newgmd=Sys.Serialization.JavaScriptSerializer.deserialize(menustring.replace(/%GROUPID%/g,groupID));addToAdHocMenu(newgmd,GroupGridContextMenu);if(!e)
{e={xy:[250,250]};}
GroupGridContextMenu.showAt(e.xy);}
function addToAdHocMenu(navItems,menu){if(navItems.length>0){for(var i=0;i<navItems.length;i++){if((navItems[i].isspacer=="True")||(navItems[i].text=='-')){menu.addSeparator();}else{if(navItems[i].submenu.length>0){var newsubmenu=new Ext.menu.Menu({id:navItems[i].id});addToAdHocMenu(navItems[i].submenu,newsubmenu);menu.add({text:navItems[i].text,handler:makeLink(navItems[i].href),id:navItems[i].id,menu:newsubmenu});}else{if(!getCurrentGroupInfo().isAdhoc&&navItems[i].id=="contextRemoveFromGroup")
{}
else if(navItems[i].submenu.length==0&&navItems[i].id=="contextAddToAdHoc")
{}
else
menu.add({text:navItems[i].text,handler:makeLink(navItems[i].href),id:navItems[i].id});}}}}}
function GroupNameByID(id){return id;}
var _ignoreChangeEvent=false;function handleGroupChange(gMgrSvc,args){if(GroupTabBar){_ignoreChangeEvent=true;GroupTabBar.setActiveTab(args.current.CurrentGroupID);populateGroupTabs()
_ignoreChangeEvent=false;}}
function showMainLookup(){if(typeof Sage.SalesLogix.Controls.ListPanel!='undefined')
{var listPanel=Sage.SalesLogix.Controls.ListPanel.find("MainList");}
if(typeof listPanel=='undefined'){var url=document.location.href;url=url.substring(0,url.indexOf("?"));url+="?modeid=list&showlookuponload=true";document.location=url;}else{var mgr=Sage.Services.getService("GroupLookupManager");if(mgr){mgr.showLookup();}else{mgr=new Sage.GroupLookupManager();Sage.Services.addService("GroupLookupManager",mgr);mgr.showLookup();}}}
function handleGroupTabChange(tabPanel,newTab,currentTab){if(_ignoreChangeEvent==true){return;}
navToNewGroup(newTab.url);}
function navToNewGroup(url){window.location=url;}
function getCurrentGroupID(){var clGrpContextSvc=Sage.Services.getService("ClientGroupContext");if(clGrpContextSvc){var clGrpContext=clGrpContextSvc.getContext();return clGrpContext.CurrentGroupID;}else if(typeof(window.__groupContext)!="undefined"){return window.__groupContext.CurrentGroupID;}
return"";}
function getCurrentGroupInfo(){var clGrpContextSvc=Sage.Services.getService("ClientGroupContext");if(clGrpContextSvc){var clGrpContext=clGrpContextSvc.getContext();return{"Name":clGrpContext.CurrentName,"Family":clGrpContext.CurrentFamily,"Id":clGrpContext.CurrentGroupID,"isAdhoc":clGrpContext.isAdhoc};}else if(typeof(window.__groupContext)!="undefined"){return{"Name":window.__groupContext.CurrentName,"Family":window.__groupContext.CurrentFamily,"Id":window.__groupContext.CurrentGroupID,"isAdhoc":window.__groupContext.isAdhoc};}
return"";}
function makeLink(dest){return function(){linkTo(dest,false)};}
AutoLogout=new function(){this.OneMinute=60000;this.LogoutDuration=20;this.StartAlertAt=10;this.StartWarnAt=5;this.Enabled=true;}
AutoLogout.process=function(minutes){if(!AutoLogout.Enabled)return;if(AutoLogout.LogoutReset){minutes=0;AutoLogout.LogoutReset=false;}
if(minutes==this.LogoutDuration){linkTo('Shutdown.axd',false);return;}
if(minutes<this.StartWarnAt){window.setTimeout('AutoLogout.process('+(minutes+1)+')',this.OneMinute);return;}
if(typeof MasterPageLinks!="undefined"){var msg=String.format(MasterPageLinks.IdleMessage,minutes);if(minutes>=this.LogoutDuration-this.StartAlertAt){Ext.get('autoLogoff').addClass("alerttext");msg=String.format(MasterPageLinks.LogoffMessage,this.LogoutDuration-minutes);}
Ext.get('autoLogoff').dom.innerHTML=msg;window.setTimeout('AutoLogout.process('+(minutes+1)+')',this.OneMinute);}
return;}
AutoLogout.resetTimer=function(){AutoLogout.LogoutReset=true;Ext.get('autoLogoff').removeClass("alerttext").dom.innerHTML="";}
function timesince(start){var now=new Date();return now-start;}
var contextSvc;var context;var strEntityId;var strEntityType;var strEntityTableName;var postUrl="";var totalCount;var selections;var arraySelections=new Array;var groupID="";var dialogBody="";function GetCurrentEntity()
{if(Sage.Services.hasService("ClientEntityContext"))
{contextSvc=Sage.Services.getService("ClientEntityContext");context=contextSvc.getContext();strEntityId=context.EntityId;strEntityType=context.EntityType;strEntityTableName=context.EntityTableName;}}
saveSelectionsAsNewGroup=function(){totalCount=Sage.Services.getService("ClientGroupContext").getContext().CurrentGroupCount;dialogBody=String.format(MasterPageLinks.AdHocDialog_NoneSelectedNewGroup,totalCount);var name="";var selectionInfo;try{selectionInfo=GetSeletionInfo();}
catch(e)
{Ext.Msg.alert(MasterPageLinks.AdHocDialog_NoData);}
if(selectionInfo.selectionCount==0){Ext.Msg.show({title:MasterPageLinks.AdHocDialog_NoneSelectedTitle,msg:dialogBody,buttons:{ok:MasterPageLinks.AdHocDialog_YesButton,cancel:MasterPageLinks.AdHocDialog_NoButton},fn:CreateNewGroup,icon:Ext.MessageBox.QUESTION});}
else
{promptForName('');}}
function CreateNewGroup(btn){if(btn=='ok'){promptForName('');}}
promptForName=function(addlMsg){var totalToAdd;var selectionInfo=GetSeletionInfo();if(selectionInfo.selectionCount==0)
{totalToAdd=totalCount}
else{totalToAdd=selectionInfo.selectionCount}
dialogBody=String.format(MasterPageLinks.AdHocDialog_NewGroupNamePrompt,totalToAdd)
Ext.MessageBox.buttonText.cancel=MasterPageLinks.AdHocDialog_CancelButton;Ext.MessageBox.buttonText.ok=MasterPageLinks.AdHocDialog_OkButton;Ext.Msg.prompt(MasterPageLinks.AdHocDialog_NewGroupTitle,dialogBody+addlMsg,function(btn,text){if(btn=='ok'&&text==''){promptForName(MasterPageLinks.AdHocDialog_NewGroupRePrompt);}
else if(btn=='ok'&&(text.match(/\'|\"|\/|\\|\*|\:|\?|\<|\>/)!=null)){promptForName(MasterPageLinks.SaveLookupAsGroupInvalidChar);}
else if(btn=='ok'&&text!=''){saveNewGroupPost(text);}},'New Group');}
saveNewGroupPost=function(name)
{var selectionInfo=GetSeletionInfo();if(selectionInfo.selectionCount==0)
{postUrl="slxdata.ashx/slx/crm/-/groups/adhoc?action=CreateAdHocGroup&name="+encodeURIComponent(name)+"&selectionKey="+selectionInfo.key;}
else
{postUrl="slxdata.ashx/slx/crm/-/groups/adhoc?action=CreateAdHocGroup&name="+encodeURIComponent(name)+"&selectionKey="+selectionInfo.key;}
if(postUrl!="")
{$.ajax({type:"POST",url:postUrl,contentType:"application/json",data:Ext.encode(selectionInfo),processData:false,error:HandleSaveLookupError,success:function(data)
{OnNewGroupCreated();}});}}
removeSelectionsFromGroup=function(){totalCount=Sage.Services.getService("ClientGroupContext").getContext().CurrentGroupCount;dialogBody=String.format(MasterPageLinks.AdHocDialog_NoneSelectedRemove,totalCount);var selectionInfo;try
{selectionInfo=GetSeletionInfo();groupID=Sage.Services.getService("GroupManagerService")._contextService.getContext().CurrentGroupID;}
catch(e)
{Ext.Msg.alert(MasterPageLinks.AdHocDialog_NoData);}
if(selectionInfo.selectionCount==0)
{if(totalCount==0)
{Ext.Msg.alert(MasterPageLinks.AdHocDialog_NoneSelectedTitle,MasterPageLinks.AdHocDialog_GroupCountZero);}
else
{Ext.Msg.confirm(MasterPageLinks.AdHocDialog_NoneSelectedTitle,dialogBody,function(btn)
{if(btn=='yes')
{removeConfirmed();}});}}
else
{removeConfirmed();}}
removeConfirmed=function(){var selectionInfo=GetSeletionInfo();if(selectionInfo.selectionCount==0)
{postUrl="slxdata.ashx/slx/crm/-/groups/adhoc?action=EditAdHocGroupRemoveMembers&groupID="+groupID+"&selectionKey="+selectionInfo.key;}
else
{postUrl="slxdata.ashx/slx/crm/-/groups/adhoc?action=EditAdHocGroupRemoveMembers&groupID="+groupID+"&selectionKey="+selectionInfo.key;}
if(postUrl!="")
{$.ajax({type:"POST",url:postUrl,contentType:"application/json",data:Ext.encode(selectionInfo),processData:false,error:function(request,status,error)
{alert(error)},success:function(status)
{}});Sage.Services.getService("GroupManagerService").setNewGroup(groupID);}}
addSelectionsToGroup=function(groupID){GetCurrentEntity();if(strEntityId!='')
{postUrl="slxdata.ashx/slx/crm/-/groups/adhoc?action=EditAdHocGroupAddMembers&groupID="+groupID+"&selections="+strEntityId
postAddToGroup(postUrl,{});}
else
{var selectionInfo;try
{totalCount=Sage.Services.getService("ClientGroupContext").getContext().CurrentGroupCount;dialogBody=String.format(MasterPageLinks.AdHocDialog_NoneSelectedAddToGroup,totalCount);selectionInfo=getCurrentGroupInfo();}
catch(e)
{Ext.Msg.alert(MasterPageLinks.AdHocDialog_NoData);}
if(selectionInfo.selectionCount==0)
{if(totalCount==0)
{Ext.Msg.alert(MasterPageLinks.AdHocDialog_NoneSelectedTitle,MasterPageLinks.AdHocDialog_GroupCountZero);}
else
{Ext.Msg.confirm(MasterPageLinks.AdHocDialog_NoneSelectedTitle,dialogBody,function(btn)
{if(btn=='yes')
{addConfirmed(groupID);}});}}
else
{addConfirmed(groupID);}}};addConfirmed=function(groupID)
{var selectionInfo=GetSeletionInfo();if(selectionInfo.selectionCount==0)
{postUrl="slxdata.ashx/slx/crm/-/groups/adhoc?action=EditAdHocGroupAddMembers&groupID="+groupID+"&selectionKey="+selectionInfo.key;}
else
{postUrl="slxdata.ashx/slx/crm/-/groups/adhoc?action=EditAdHocGroupAddMembers&groupID="+groupID+"&selectionKey="+selectionInfo.key;}
postAddToGroup(postUrl,selectionInfo);};postAddToGroup=function(postUrl,payLoad)
{if(postUrl!="")
{$.ajax({type:"POST",url:postUrl,contentType:"application/json",data:Ext.encode(payLoad),processData:false,error:function(request,status,error)
{alert(error)},success:function(status)
{}});Sage.Services.getService("GroupManagerService").setNewGroup(Sage.Services.getService("GroupManagerService")._contextService.getContext().CurrentGroupID);}}
function doTextBoxKeyUp(control)
{maxLength=control.attributes["MultiLineMaxLength"].value;value=control.value;if(value.length>maxLength-1)
control.value=value.substring(0,maxLength);}
function doTextBoxPaste(control)
{maxLength=control.attributes["MultiLineMaxLength"].value;value=control.value;if(maxLength)
{maxLength=parseInt(maxLength);var oTR=control.document.selection.createRange();var iInsertLength=maxLength-value.length+oTR.text.length;var sData=window.clipboardData.getData("Text").substr(0,iInsertLength);oTR.text=sData;return false;}}
function leadAssignOwner(){var selectionInfo=GetSeletionInfo();if(selectionInfo.selectionCount>0){LeadAssignOwner.addListener("change",LeadAssignOwnerChange);Javascript:window.LeadAssignOwner.show();}}
function LeadAssignOwnerChange(){var msgBox=Ext.MessageBox.show({title:MasterPageLinks.Leads_AssignOwner_ProgressTitle,msg:MasterPageLinks.Leads_AssignOwner_ProgressMsg,width:300,wait:true,waitConfig:{interval:200}});var assignOwnerId=document.getElementById(LeadAssignOwner._valueClientId);if(assignOwnerId!=null){var selectionInfo=GetSeletionInfo();var postUrl=String.format("slxdata.ashx/slx/crm/-/leads/assignowner?id={0}&selectionKey={1}",assignOwnerId.value,selectionInfo.key)
$.ajax({type:"POST",url:postUrl,contentType:"application/json",data:Ext.encode(selectionInfo),processData:false,error:HandleSaveLookupError,success:function(){msgBox.hide();RefreshListView();}});}}
function leadDeleteRecords(){if(ContinueWithSelections()){var selectionInfo=GetSeletionInfo();if(selectionInfo.selectionCount>0){dialogBody=MasterPageLinks.confirm_DeleteRecords;var conf=confirm(dialogBody);if(conf){var msgBox=Ext.MessageBox.show({title:MasterPageLinks.Leads_AssignOwner_ProgressTitle,msg:MasterPageLinks.Leads_DeleteLeads_ProgressMsg,width:300,wait:true,waitConfig:{interval:200}});$.ajax({type:"POST",url:String.format("slxdata.ashx/slx/crm/-/leads/deleteleads?selectionKey={0}",selectionInfo.key),contentType:"application/json",data:Ext.encode(selectionInfo),processData:false,error:HandleSaveLookupError,success:function(){msgBox.hide();RefreshListView();}});}}
else{selectionInfo.mode='selectAll';var msgBox=Ext.MessageBox.show({title:MasterPageLinks.Leads_AssignOwner_ProgressTitle,msg:MasterPageLinks.Leads_DeleteLeads_ProgressMsg,width:300,wait:true,waitConfig:{interval:200}});$.ajax({type:"POST",url:String.format("slxdata.ashx/slx/crm/-/leads/deleteAllLeadsInGroup?selectionKey={1}",selectionInfo.key),contentType:"application/json",data:Ext.encode(selectionInfo),processData:false,error:HandleSaveLookupError,success:function(){msgBox.hide();RefreshListView();}});}}}
function GetSeletedIdList(strEntity){var rc=false;try{var panel=Sage.SalesLogix.Controls.ListPanel.find("MainList");if(panel){arraySelections=panel.getSelections({idOnly:true});if(arraySelections.length==0){var totalCount=Sage.Services.getService("ClientGroupContext").getContext().CurrentGroupCount;dialogBody=String.format(MasterPageLinks.AdHocDialog_NoneSelectedAddToGroup,totalCount);var agree=confirm(dialogBody);if(agree){arraySelections=panel.getSelections({idOnly:false});}
rc=agree;}
else{rc=true;}}
return rc;}
catch(e){Ext.Msg.alert(MasterPageLinks.AdHocDialog_NoData);}}
function ContinueWithSelections(){var rc=false;var selectionInfo;try{var panel=Sage.SalesLogix.Controls.ListPanel.find("MainList");if(panel){selectionInfo=panel.getSelectionInfo();if(selectionInfo.selectionCount==0){var totalCount=Sage.Services.getService("ClientGroupContext").getContext().CurrentGroupCount;dialogBody=String.format(MasterPageLinks.AdHocDialog_NoneSelectedAddToGroup,totalCount);var agree=confirm(dialogBody);rc=agree;}
else{rc=true;}}
return rc;}
catch(e){Ext.Msg.alert(MasterPageLinks.AdHocDialog_NoData);}}
function GetSeletionInfo(){var selectionInfo;try{var panel=Sage.SalesLogix.Controls.ListPanel.find("MainList");if(panel){selectionInfo=panel.getSelectionInfo();}
return selectionInfo;}
catch(e){Ext.Msg.alert(MasterPageLinks.AdHocDialog_NoData);}}
function RefreshListView()
{var panel=Sage.SalesLogix.Controls.ListPanel.find("MainList");panel.refresh();}
SparkLine=function(config){this.config=config;if(typeof(config.data)!='undefined'){if(config.data.type.toLowerCase()=='mashup'){var self=this;$.get("MashupHandler.ashx",config.data.params,function(result,status){var datavals="";var first=true;var elems=result.documentElement.getElementsByTagName(config.data.datavaluename);for(var i=0;i<elems.length;i++){if(!first)datavals+=",";datavals+=$(elems[i]).text();first=false;}
self.makeImg(config,datavals);});}else if(config.data.type.toLowerCase()=='literal'){this.makeImg(config,config.data.data.join(','));}}};SparkLine.prototype.makeImg=function(config,datavals){var sparkurl="Libraries/SparkHandler.ashx?"
for(var param in config.params){sparkurl+=param+"="+encodeURIComponent(config.params[param])+"&";}
sparkurl+=config.paramdataname+"="+datavals;$('#'+config.renderTo).html(String.format('<img src="{0}" alt="{1}" title="{1}" />',sparkurl,datavals));};function RunSummarySparkLine(config){window.setTimeout(function(){var spk=new SparkLine(config);},10);return'';}
ScriptQueue=(function(){var queue={dom:[]};var run={dom:false};var options={trapExceptions:false};var execute=function(fn){try
{if(fn)fn.call();}
catch(e)
{if(options.trapExceptions===false)
throw e;Ext.Msg.alert("Error",e.message||e.description);}};return{options:options,at:{immediate:function(fn){execute(fn);},dom:function(fn){if(run.dom)
execute(fn);else if(fn)
queue.dom.push(fn);},ready:function(fn){if(fn)$(document).ready(fn);}},run:{dom:function(){run.dom=true;execute(function(){for(var i=0;i<queue.dom.length;i++)
queue.dom[i].call();});queue.dom=[];}}};})();

function createOptionsMenu(){if(typeof MasterPageLinks!="undefined"){var helpMenu=new Ext.menu.Menu({id:'HelpMenu',items:[{text:MasterPageLinks.WebClientHelp,handler:function(){linkTo(Ext.get('hidHelpLink').getValue(),true)}},{text:MasterPageLinks.About,handler:function(){linkTo(Ext.get('hidHelpAboutLink').getValue(),true)}}]});if(typeof idMenuItems!="undefined"){helpMenu.on("show",function(){idMenuItems();});}
var helpTb=new Ext.Toolbar({cls:"nobackground",id:"helptoolbar"});helpTb.render('OptionsMenu');helpTb.add({text:MasterPageLinks.Help,menu:helpMenu,tooltip:MasterPageLinks.Help},'|',{text:MasterPageLinks.Options,handler:function(){linkTo('UserOptions.aspx',false)}},'|',{text:MasterPageLinks.LogOff,handler:function(){linkTo('Shutdown.axd',false)}},' - '+Ext.get('lclLoginName').dom.innerHTML);if(Ext.isIE6){helpTb.addClass("toolbarIE6");}}
$('#show_GeneralSearchOptionsPage').click(function(){window.setTimeout('GeneralSearchOptionsPage_init()',500);});return;}
function createMainToolbar(){var tb=new Ext.Toolbar();tb.render('ToolbarArea_span');var tbdata=ToolBarMenuData;for(var i=0;i<tbdata.items.length;i++){var thismenu=new Ext.menu.Menu({listeners:{show:assertMenuHeight}});var menuitems=tbdata.items[i].items;if(menuitems){for(var j=0;j<menuitems.length;j++){if((menuitems[j].isspacer=='True')||(menuitems[j].text=='-')){thismenu.addSeparator();}else{var menuitem=thismenu.add({text:menuitems[j].text,handler:makeLink(menuitems[j].href),cls:"x-btn-text-icon",icon:menuitems[j].img.replace(/&amp;/g,"&")});if(menuitems[j].disabled)
menuitem.disable();if(menuitems[j].submenu.length>0){menuitem.menu=new Ext.menu.Menu();for(var k=0;k<menuitems[j].submenu.length;k++){menuitem.menu.add({text:menuitems[j].submenu[k].text,handler:makeLink(menuitems[j].submenu[k].href)});}
if(typeof idMenuItems!="undefined"){menuitem.menu.on("show",function(){idMenuItems();});}}}}}
if(typeof idMenuItems!="undefined"){thismenu.on("show",function(){idMenuItems();});}
var tbitem={text:tbdata.items[i].text,cls:"x-btn-text-icon",icon:tbdata.items[i].img.replace(/&amp;/g,"&"),tooltip:tbdata.items[i].tooltip};if(tbdata.items[i].navurl)tbitem.handler=makeLink(tbdata.items[i].navurl);if(menuitems)tbitem.menu=thismenu;tb.add(tbitem);}
tb.addClass("nobackground");if(Ext.isIE6){tb.addClass("toolbarIE6");}
$("#ReminderDiv").css("visibility","visible");return;}
function populateTitleBar(){if(Ext.get(localTitleTagId).dom.innerHTML==""){var found=false;for(var i=0;i<NavBar_Menus.length;i++){for(var j=0;j<NavBar_Menus[i].items.length;j++){var mi=NavBar_Menus[i].items[j];if((mi.href.length>1)&&(window.location.href.toLowerCase().indexOf(mi.href.toLowerCase())>-1)){var imagetag=(mi.img.length==0)?"":String.format("<img src='{0}' />",mi.img);Ext.get(localTitleTagId).dom.innerHTML=String.format("<span id='PageTitle'>{0} {1}</span>",imagetag,mi.text);found=true;break;}}
if(found){break;}}
if(!found)Ext.get(localTitleTagId).dom.innerHTML="<span id='PageTitle'>Sage SalesLogix</span>";}}
var GroupTabBar;var GroupsMenu;var GroupTabContextMenu;var GroupGridContextMenu;function addToMenu(navItems,menu,excludeids){if(navItems.length>0){for(var i=0;i<navItems.length;i++){var addit=true;if(typeof excludeids=="string"){addit=(excludeids!=navItems[i].id);}else if((typeof excludeids=="object")&&(excludeids.length)){for(var k=0;k<excludeids.length;k++){if(navItems[i].id==excludeids[k]){addit=false;}}}
if(addit){if((navItems[i].isspacer=="True")||(navItems[i].text=='-')){menu.addSeparator();}else{if(navItems[i].submenu.length>0){var newsubmenu=new Ext.menu.Menu({id:navItems[i].id});addToMenu(navItems[i].submenu,newsubmenu);menu.add({text:navItems[i].text,id:navItems[i].id,menu:newsubmenu,hideOnClick:false});}else{menu.add({text:navItems[i].text,handler:makeLink(navItems[i].href),id:navItems[i].id});}}}}}}
var lookupPnl;function verifyMasterPageObj(){var msg="MasterPage is missing required elements: {0}";var missingElems=new Array();if(typeof(MasterPageLinks)=="undefined"){missingElems.push("MasterPageLinks");}else{msg=MasterPageLinks.MissingElementsErrorMgs;}
var elem=document.getElementById("lookupBtn");if(!elem){missingElems.push("lookupBtn");}
elem=document.getElementById("GroupTabs");if(!elem){missingElems.push("GroupTabs");}
if(missingElems.length>0){alert(String.format(msg,missingElems.join(", ")));return false;}
return true;}
function populateGroupTabs(){if(!verifyMasterPageObj())return;var isReload=(typeof GroupsMenu!="undefined");if(isReload){GroupsMenu.removeAll();}else{$("#GroupTabs").css({left:(MasterPageLinks.LookupBtnWidth-0+6)+"px"});GroupsMenu=new Ext.menu.Menu({id:'GroupMenu',listeners:{show:assertMenuHeight}});if(typeof idMenuItems!="undefined"){GroupsMenu.on("show",function(){idMenuItems();});}}
if(typeof groupMenuData!="undefined"){var menustring=Ext.util.JSON.encode(groupMenuData.menuitems);var groupName=getCurrentGroupInfo().Name;if(groupName==null){groupName="";};var newgmd=Ext.util.JSON.decode(menustring.replace(/%GROUPNAME%/g,groupName).replace(/%GROUPID%/g,getCurrentGroupInfo().Id).replace(/%GROUPFILENAME%/g,groupName.replace(/[^A-Z0-9a-z]/g,"_")));var excludeids=new Array();if(getCurrentGroupID()=="LOOKUPRESULTS"){excludeids.push('mnuForXGroup');}
addToMenu(newgmd,GroupsMenu,excludeids);GroupsMenu.addSeparator();}
if(typeof groupMenuList=="undefined")return;var currentGroupId=getCurrentGroupID();checkMenuItemAvailability(GroupsMenu,currentGroupId);if(groupMenuList.groups){if(!isReload){GroupTabBar=new Ext.TabPanel({id:getCurrentGroupInfo().Family+'_tabpanel',renderTo:'GroupTabs',resizeTabs:false,minTabWidth:135,enableTabScroll:true,animScroll:true,border:false});}
var tabCount=groupMenuList.groups.length;for(var i=0;i<groupMenuList.groups.length;i++){var txt=Ext.util.Format.htmlEncode(groupMenuList.groups[i].text);if(currentGroupId==groupMenuList.groups[i].id){var itm=GroupsMenu.add({text:txt,handler:makeLink(groupMenuList.groups[i].href)});if(!isReload)
GroupTabBar.add({title:txt,html:'',url:groupMenuList.groups[i].href,id:groupMenuList.groups[i].id}).show();}else{GroupsMenu.add({text:txt,handler:makeLink(groupMenuList.groups[i].href)});if(!isReload)
GroupTabBar.add({title:txt,html:'',url:groupMenuList.groups[i].href,id:groupMenuList.groups[i].id});}}
var tabBarWidth=tabCount==0?5000:tabCount*150;$("#GroupTabs UL").css("width",tabBarWidth+"px");if(!isReload){if(groupMenuList.groups.length>0){GroupTabBar.addListener('beforetabchange',handleGroupTabChange);if(typeof groupTabConextMenuData!="undefined"){GroupTabBar.addListener('contextmenu',onTabContextMenu);}
var panel=mainViewport.findById('center_panel_north');var lookupTb=new Ext.Toolbar({cls:"nobackground",renderTo:"lookupBtn",stateful:false,id:"lookupTb"});lookupTb.addButton({text:MasterPageLinks.Lookup,handler:showMainLookup,id:"lookupButton",minWidth:MasterPageLinks.LookupBtnWidth,cls:'x-btn-text-icon',icon:'ImageResource.axd?scope=global&type=Global_Images&key=Find_16x16'});if((typeof Sage.SalesLogix!='undefined')&&(document.location.href.toLowerCase().indexOf('showlookuponload=true')>-1)){showMainLookup();}
if(panel){panel.addListener('resize',handleViewPortResize);var box=panel.getBox();handleViewPortResize(panel,box.width,box.height,box.width,box.height);}}
if(typeof MasterPageLinks!="undefined"){var groupTb=new Ext.Toolbar({id:"GroupsMenuToolBar"});groupTb.render("GroupMenuSpace");groupTb.add({text:MasterPageLinks.Groups,id:"GroupsMenuButton",cls:"x-btn-text-icon",icon:'images/icons/Groups_16x16.gif',menu:GroupsMenu});groupTb.addClass("nobackground");$(document).ready(function(){var gMgrSvc=Sage.Services.getService("GroupManagerService");gMgrSvc.addListener(Sage.GroupManagerService.CURRENT_GROUP_CHANGED,handleGroupChange);});}}}}
function checkforShowLookup(){if(typeof Sage.SalesLogix.Controls.ListPanel!='undefined')
{var listPanel=Sage.SalesLogix.Controls.ListPanel.find("MainList");}
if((typeof listPanel!='undefined')&&(document.location.href.toLowerCase().indexOf('showlookuponload=true')>-1)){showMainLookup();}}
function checkMenuItemAvailability(menu,groupID){for(var i=0;i<menu.items.items.length;i++){if(typeof(menu.items.items[i].menu)!="undefined"){checkMenuItemAvailability(menu.items.items[i].menu,groupID);}
if((menu.items.items[i].id=="contextCopy")||(menu.items.items[i].id=='navItemCopy')){var grpMgr=Sage.Services.getService("GroupManagerService");if(grpMgr){var grpInfo=grpMgr.findGroupInfoById(groupID);if(grpInfo){if((grpInfo.basedOn!='')&&(grpInfo.isAdHoc))
menu.items.items[i].disable();}}}else if((menu.items.items[i].id=='contextShare')||(menu.items.items[i].id=='navItemShare')){var ctxSvc=Sage.Services.getService('ClientContextService');var grpMgr=Sage.Services.getService('GroupManagerService');var disable=true;if((ctxSvc)&&(grpMgr)){var grpInfo=grpMgr.findGroupInfoById(groupID);var userID=ctxSvc.getValue('userID');if((grpInfo)&&(userID)){disable=(grpInfo.userID!=userID);}}
if(disable){menu.items.items[i].disable();}}}}
function onTabContextMenu(ts,item,e){if(item.id=='GroupLookup'){return;}
if(typeof(GroupTabContextMenu)!="undefined"){GroupTabContextMenu.removeAll();}else{GroupTabContextMenu=new Ext.menu.Menu({id:'GroupTabContext'});if(typeof idMenuItems!="undefined"){GroupTabContextMenu.on("show",function(){idMenuItems();});}}
var groupname=GroupNameByID(item.id);var menustring=Sys.Serialization.JavaScriptSerializer.serialize(groupTabConextMenuData.menuitems);var newgmd=Sys.Serialization.JavaScriptSerializer.deserialize(menustring.replace(/%GROUPNAME%/g,groupname).replace(/%GROUPID%/g,item.id).replace(/%GROUPFILENAME%/g,groupname.replace(/[^A-Z0-9a-z]/g,"_")));var excludeids=new Array();if(item.id=="LOOKUPRESULTS"){excludeids.push("contextEdit");excludeids.push("contextShare");excludeids.push("contextCopy");excludeids.push("contextHide");excludeids.push("contextDelete");excludeids.push("contextSpacer1");}
addToMenu(newgmd,GroupTabContextMenu,excludeids);checkMenuItemAvailability(GroupTabContextMenu,item.id);if((item.id=="LOOKUPRESULTS")&&(GroupTabBar.activeTab.id=="LOOKUPRESULTS")){GroupTabContextMenu.add({text:MasterPageLinks.LookupSaveAsGroup,handler:SaveLookupAsGroup,id:'rmbSaveLookupAsGroup'});}
GroupTabContextMenu.showAt(e.getPoint());}
function handleViewPortResize(panel,newWidth,newHeight,rawWidth,rawHeight){if((MasterPageLinks.LookupBtnWidth-0)>50){GroupTabBar.setWidth(newWidth-MasterPageLinks.LookupBtnWidth-6);}else{GroupTabBar.setWidth(newWidth-75);}}
function populateNavBar(){var west=mainViewport.findById('west_panel');if(!west)
return;var templates={item0:new Ext.XTemplate(['<div class="NavBarItem" onMouseDown="NavBarItem_mousedown(event, \'{contextmenu}\')" oncontextmenu="return false">','<a title="{tooltip}" href="{href}" target="{target}" oncontextmenu="return false">','<tpl if="img.length != 0"><img src="{img}" oncontextmenu="return false" /></tpl>','<br/>','{text}','</a>','</div>']),item1:new Ext.XTemplate(['<div class="NavBarItem" onMouseDown="NavBarItem_mousedown(event, \'{contextmenu}\')" oncontextmenu="return false">','<a title="{tooltip}" href="{href}" target="{target}" oncontextmenu="return false">','{text}','<br/>','<tpl if="img.length != 0"><img src="{img}" oncontextmenu="return false" /></tpl>','</a>','</div>']),item3:new Ext.XTemplate(['<div class="NavBarItem" onMouseDown="NavBarItem_mousedown(event, \'{contextmenu}\')" oncontextmenu="return false">','<a title="{tooltip}" href="{href}" target="{target}" oncontextmenu="return false">','{text}','<tpl if="img.length != 0"><img src="{img}" oncontextmenu="return false" /></tpl>','</a>','</div>']),itemDefault:new Ext.XTemplate(['<div class="NavBarItem" onMouseDown="NavBarItem_mousedown(event, \'{contextmenu}\')" oncontextmenu="return false">','<a title="{tooltip}" href="{href}" target="{target}" oncontextmenu="return false">','<tpl if="img.length != 0"><img src="{img}" oncontextmenu="return false" /></tpl>','{text}','</a>','</div>']),spacer:new Ext.XTemplate('<div class="NavBarItem">&nbsp;</div>')};for(var i=0;i<NavBar_Menus.length;i++)
{var menu=NavBar_Menus[i];var html=[];for(var j=0;j<menu.items.length;j++)
{if(menu.items[j].isspacer)
{html.push(templates.spacer.apply());}
else
{var tpl="item"+menu.textimagerelation;if(templates[tpl])
html.push(templates[tpl].apply(menu.items[j]));else
html.push(templates["itemDefault"].apply(menu.items[j]));}}
var panel=west.add({id:"nav_bar_menu_"+i,title:menu.title,border:false,autoScroll:true,fit:true,html:html.join('')});if(typeof menu.backgroundimage==="string")
{west.el.dom.style.backgroundImage=menu.backgroundimage;west.el.dom.oncontextmenu=function(){return false};}}
west.doLayout();$(".NavBarItem a",west.getEl().dom).each(function(i){if(window.location.href.toLowerCase().indexOf(this.href.toLowerCase())>-1){this.parentNode.className+=" ActiveNavBarItem";}});}
function showContextMenu(x,y,contextmenu){eval(" var data = "+contextmenu+"_data;");var leftNavContextMenu=new Ext.menu.Menu();var idlist=new Array();for(var i=0;i<data.length;i++){if((data[i].text=="-")||(data[i].isspacer=="True")){leftNavContextMenu.add('-');}else{var itemid=data[i].text.replace(/[^A-Za-z]/g,"_");while(idlist.indexOf(itemid)>-1){itemid+="_";}
idlist.push(itemid);leftNavContextMenu.add({text:data[i].text,href:data[i].href,id:String.format("contextmenu_{0}",itemid),icon:(data[i].img=="")?Ext.BLANK_IMAGE_URL:data[i].img,hrefTarget:data[i].target});}}
if(typeof idMenuItems!="undefined"){leftNavContextMenu.on("show",function(){idMenuItems();});}
leftNavContextMenu.showAt([x,y]);}
function NavBarItem_mousedown(e,contextmenu){if((e.button==2)&&(contextmenu.length>1)){window.setTimeout(String.format("showContextMenu({0}, {1}, '{2}')",e.clientX,e.clientY,contextmenu),300);}
return false;}
var mainViewport;function setUpPanels(){Ext.state.Manager.setProvider(new Ext.state.CookieProvider());var hasGroupTabs=(typeof groupMenuList!="undefined");var northPanel={region:"north",id:"north_panel",height:62,title:false,collapsible:false,border:false,contentEl:"north_panel_content"};var southPanel={region:"south",id:"south_panel",height:20,collapsible:false,border:false,contentEl:"south_panel_content",cls:"south_panel"};var westPanel={region:"west",id:"west_panel",stateId:"west_panel",border:false,split:true,width:150,collapsible:true,collapseMode:'mini',margins:"0 0 0 0",cmargins:"0 0 0 0",layout:'accordion',autoScroll:false,defaults:{stateEvents:["collapse","expand"],getState:function(){return{collapsed:this.collapsed};}},animCollapse:false,animFloat:false,bufferResize:true,layoutConfig:{animate:false,hideCollapseTool:true}};var centerPanelNorth={region:"north",id:"center_panel_north",contentEl:"center_panel_north_content",border:false,collapsible:false,margins:"0 0 0 0",height:(hasGroupTabs)?60:40};var centerPanelEast={region:"east",id:"center_panel_east",contentEl:"center_panel_east_content",split:true,border:true,bodyBorder:false,collapsible:true,collapseMode:'mini',animCollapse:false,animFloat:false,autoScroll:true,margins:"0 0 0 0",cmargins:"0 0 0 0",width:200,hidden:(typeof __includeTaskPane!=="undefined"&&__includeTaskPane===false)};var centerPanelCenter={region:"center",id:"center_panel_center",contentEl:"MainWorkArea",border:false,collapsible:false,margins:"0 0 0 0",autoScroll:true,autoShow:true,layout:"fit"};var centerPanelItems=[centerPanelNorth,centerPanelEast,centerPanelCenter];var centerPanel={region:"center",id:"center_panel",collapsible:false,border:false,autoShow:true,margins:"6 6 6 6",cmargins:"0 0 0 0",layout:"border",bufferResize:true,items:centerPanelItems};mainViewport=new Ext.FormViewport({id:"main_viewport",layout:"border",layoutConfig:{animate:false},autoShow:true,border:false,bufferResize:true,items:[northPanel,southPanel,westPanel,centerPanel],listeners:{"render":function(container,layout){if(typeof __includeTaskPane==="undefined"||__includeTaskPane!==false)
$("#center_panel_east > .x-panel-bwrap").show();}}});};function setNavState()
{for(var i=0;i<NavBar_Menus.length;i++)
{var item=mainViewport.findById('nav_bar_menu_'+i);if(item)
item.saveState();}}
function assertMenuHeight(m){var maxHeight=Ext.getBody().getHeight();var box=m._defaultBox=m._defaultBox||m.el.getBox();if((box.y+box.height+4)>maxHeight)
{m.el.setHeight((maxHeight-box.y-4));m.el.applyStyles("overflow: auto;");}
else
{m.el.setHeight(box.height);m.el.applyStyles("overflow: hidden;");}}
function ShowMenuItem()
{var txtdiv=$get('ssTextDiv');var menudiv=$get('ssMenuItemDiv');var bounds=Sys.UI.DomElement.getBounds(txtdiv);menudiv.style.left=bounds.x+"px";menudiv.style.top="56px";menudiv.style.display="block";}
var ssTimerId;function checkSSText(tbox){if(tbox.value==tbox.defaultValue){if(Sys.UI.DomElement.containsCssClass(tbox,"tboxinfo")){Sys.UI.DomElement.removeCssClass(tbox,"tboxinfo");tbox.value="";}}}
function HideSSDropDown()
{var menudiv=$get('ssMenuItemDiv');menudiv.style.display="none";}
function MenuBtnLeave(obj)
{obj.className="ssdropdown";ssTimerId=window.setTimeout('HideSSDropDown()',1000);}
function HandleEnterKeyMaster(e,id)
{if(!e)var e=window.event;if(e.keyCode==13)
{e.returnValue=false;e.cancelBubble=true;var strs=id.split('_');var btnId=strs[0]+"_Search1";var btn=$get(btnId);if(document.createEvent)
{var evt=document.createEvent("MouseEvents");evt.initMouseEvent("click",true,true,window,0,0,0,0,0,false,false,false,false,0,null);btn.dispatchEvent(evt);}
else
{btn.click();}}}

var REPORT_ACCOUNT="Account:Account Detail";var REPORT_CONTACT="Contact:Contact Detail";var REPORT_OPPORTUNITY="Opportunity:Opportunity Detail";var REPORT_DEFECT="Defect:Support Defect";var REPORT_TICKET="Ticket:Support Ticket";var REPORT_DEFAULT="";function GetAccountReport(){return REPORT_ACCOUNT;}
function SetAccountReport(Report){REPORT_ACCOUNT=Report;}
function GetContactReport(){return REPORT_CONTACT;}
function SetContactReport(Report){REPORT_CONTACT=Report;}
function GetOpportunityReport(){return REPORT_OPPORTUNITY;}
function SetOpportunityReport(Report){REPORT_OPPORTUNITY=Report;}
function GetDefectReport(){return REPORT_DEFECT;}
function SetDefectReport(Report){REPORT_DEFECT=Report;}
function GetTicketReport(){return REPORT_TICKET;}
function SetTicketReport(Report){REPORT_TICKET=Report;}
function GetDefaultReport(){return REPORT_DEFAULT;}
function SetDefaultReport(Report){REPORT_DEFAULT=Report;}
function GetCurrentReport(){var result=null;if(Sage.Services.hasService("ClientEntityContext")){var contextSvc=Sage.Services.getService("ClientEntityContext");var context=contextSvc.getContext();var strTableName=context.EntityTableName.toUpperCase();switch(strTableName){case"ACCOUNT":return GetAccountReport();break;case"CONTACT":return GetContactReport();break;case"OPPORTUNITY":return GetOpportunityReport();break;case"DEFECT":return GetDefectReport();break;case"TICKET":return GetTicketReport();break;default:return GetDefaultReport();break;}}
return result;}
function GetReportId(S){if(S!=null&&S!=""){if(S.toString().indexOf(":")!=-1){var xmlhttp=YAHOO.util.Connect.createXhrObject().conn;var strUrl="SLXReportsHelper.ashx?method=GetReportId&report="+escape(S);xmlhttp.open("GET",strUrl,false);xmlhttp.send(null);if(xmlhttp.status==200){return xmlhttp.responseText;}}
else{if(S.toString().length==12){return S;}}}
return null;}
function PopulateGlobals(ReportId,EntityTableName,EntityId){var strKeyField=EntityTableName+"."+EntityTableName+"ID";var strWSql="("+strKeyField+" = '"+EntityId+"')";var strSqlQry="SELECT "+strKeyField+" FROM "+EntityTableName;GLOBAL_REPORTING_PLUGINID=ReportId;GLOBAL_REPORTING_KEYFIELD=strKeyField;GLOBAL_REPORTING_RSF="";GLOBAL_REPORTING_WSQL=strWSql;GLOBAL_REPORTING_SQLQRY=strSqlQry;GLOBAL_REPORTING_SORTFIELDS="";GLOBAL_REPORTING_SORTDIRECTIONS="";GLOBAL_REPORTING_SS=(GLOBAL_REPORTING_URL.toUpperCase().indexOf("HTTPS")==-1?"0":"1");}
function ShowReportById(ReportId){if(GLOBAL_REPORTING_URL==""){alert(MSGID_THE_REPORTING_SERVER_HAS_NOT_BEEN);return;}
if(ReportId==null||ReportId==""){alert(MSGID_THE_REPORTID_HAS_NOT_BEEN_DEFINED);return;}
if(Sage.Services.hasService("ClientEntityContext")){var contextSvc=Sage.Services.getService("ClientEntityContext");var context=contextSvc.getContext();var strTableName=context.EntityTableName.toUpperCase();var strEntityId=context.EntityId;if(strEntityId!=""){PopulateGlobals(ReportId,strTableName,strEntityId);var url="ShowReport.aspx";window.open(url,"ShowReportViewer","location=no,menubar=no,resizable=yes,scrollbars=yes,status=no,titlebar=no,toolbar=no,width=800,height=630");}
else{alert(MSGID_THE_CURRENT_ENTITY_IS_UNDEFINED);}}
else{alert(MSGID_UNABLE_TO_SHOW_THE_DETAIL_REPORT);}}
function ShowReportByName(ReportName){if(GLOBAL_REPORTING_URL==""){alert(MSGID_THE_REPORTING_SERVER_HAS_NOT_BEEN);return;}
if(ReportName==null||ReportName==""){alert(MSGID_THE_REPORTNAME_HAS_NOT_BEEN_DEFINED);return;}
if(Sage.Services.hasService("ClientEntityContext")){var contextSvc=Sage.Services.getService("ClientEntityContext");var context=contextSvc.getContext();var strTableName=context.EntityTableName.toUpperCase();var strEntityId=context.EntityId;if(strEntityId!=""){var strReportId=GetReportId(ReportName);if(strReportId!=null&&strReportId!=""){PopulateGlobals(strReportId,strTableName,strEntityId);var url="ShowReport.aspx";window.open(url,"ShowReportViewer","location=no,menubar=no,resizable=yes,scrollbars=yes,status=no,titlebar=no,toolbar=no,width=800,height=630");}
else{alert(MSGID_THE_REPORT_COULD_NOT_BE_LOCATED_FOR)}}
else{alert(MSGID_THE_CURRENT_ENTITY_IS_UNDEFINED);}}
else{alert(MSGID_UNABLE_TO_SHOW_THE_DETAIL_REPORT);}}
function ShowReport(ReportNameOrId,EntityTableName,EntityId){if(GLOBAL_REPORTING_URL==""){alert(MSGID_THE_REPORTING_SERVER_HAS_NOT_BEEN);return;}
if(ReportNameOrId==null||ReportNameOrId==""){alert(MSGID_THE_REPORTNAMEORID_IS_UNDEFINED_IN);return;}
if(EntityTableName==null||EntityTableName==""){alert(MSGID_THE_ENTITYTABLENAME_IS_UNDEFINED_IN);return;}
if(EntityId==null||EntityId==""){alert(MSGID_THE_ENTITYID_IS_UNDEFINED_IN);return;}
var strReportId=GetReportId(ReportNameOrId);if(strReportId!=null&&strReportId!=""){var strTableName=EntityTableName.toUpperCase();var strEntityId=EntityId;if(strEntityId!=""){PopulateGlobals(strReportId,strTableName,strEntityId);var url="ShowReport.aspx";window.open(url,"ShowReportViewer","location=no,menubar=no,resizable=yes,scrollbars=yes,status=no,titlebar=no,toolbar=no,width=800,height=630");}
else{alert(MSGID_THE_CURRENT_ENTITY_IS_UNDEFINED);}}
else{alert(MSGID_THE_REPORT_COULD_NOT_BE_LOCATED_FOR)}}
function ShowDefaultReport(){if(GLOBAL_REPORTING_URL==""){alert(MSGID_THE_REPORTING_SERVER_HAS_NOT_BEEN);return;}
if(Sage.Services.hasService("ClientEntityContext")){var strDetailReport=GetCurrentReport();if(strDetailReport!=null&&strDetailReport!=""){var strReportId=GetReportId(strDetailReport);if(strReportId!=null&&strReportId!=""){var contextSvc=Sage.Services.getService("ClientEntityContext");var context=contextSvc.getContext();var strTableName=context.EntityTableName.toUpperCase();var strEntityId=context.EntityId;if(strEntityId!=""){PopulateGlobals(strReportId,strTableName,strEntityId);var url="ShowReport.aspx";window.open(url,"ShowReportViewer","location=no,menubar=no,resizable=yes,scrollbars=yes,status=no,titlebar=no,toolbar=no,width=800,height=630");}
else{alert(MSGID_THE_CURRENT_ENTITY_IS_UNDEFINED);}}
else{alert(MSGID_THE_REPORT_COULD_NOT_BE_LOCATED_FOR)}}
else{alert(MSGID_THE_CURRENT_ENTITY_DOES_NOT_HAVE);}}
else{alert(MSGID_UNABLE_TO_SHOW_THE_DETAIL_REPORT);}}
if(typeof(Sys)!=='undefined'){Sys.Application.notifyScriptLoaded();}
