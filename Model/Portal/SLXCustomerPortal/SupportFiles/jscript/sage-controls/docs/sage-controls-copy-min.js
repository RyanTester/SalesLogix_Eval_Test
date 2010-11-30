/*
 * Sage SalesLogix Web Controls
 * Copyright(c) 2009, Sage Software.
 */


Sage.Copy=function(config){this.originalConfig=config;this.hasContent=config.hasContent;}
Sage.Copy.prototype.copyClip=function(){this.copyTo="Clipboard"
if(this.hasContent){this.OnCopyContentReady();}else{this.requestContent();}}
Sage.Copy.prototype.requestContent=function(){var self=this;var id="";if(Sage.Services.hasService("ClientEntityContext"))
{contextSvc=Sage.Services.getService("ClientEntityContext");context=contextSvc.getContext();id=context.EntityId;var url=String.format("slxdata.ashx/slx/crm/-/SummaryData/{0}?format=json&where=mainentity.id eq '{1}'",self.originalConfig.name,id);$.ajax({url:url,dataType:"json",data:{},success:function(data){var tpl=new Ext.XTemplate(self.originalConfig.template);tpl.overwrite(self.originalConfig.clientId,data);self.hasContent=true;if(self.copyTo=="Clipboard")
self.OnCopyContentReady();else
self.OnEmailContentReady();},error:function(request,status,error){alert(status);}});}}
Sage.Copy.prototype.OnCopyContentReady=function(){var elem=$get(this.originalConfig.clientId);var clipString='';if(elem){if(elem.innerText){clipString=elem.innerText;}else if(elem.textContent){clipString=elem.textContent;}
if(window.clipboardData){window.clipboardData.setData("text",clipString);}else{try{return;netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");var clipboardHelper=Components.classes["@mozilla.org/widget/clipboardhelper;1"].getService(Components.interfaces.nsIClipboardHelper);if(clipboardHelper){clipboardHelper.copyString(clipString);}}catch(e){alert(String.format("{0}. {1}",this.originalConfig.cannotAccessClipboard,e.message));}}}}
Sage.Copy.prototype.copyToEmail=function(){this.copyTo="Email"
if(this.hasContent){this.OnEmailContentReady();}else{this.requestContent();}}
Sage.Copy.prototype.OnEmailContentReady=function(){var baseControlId=this.originalConfig.clientId;var elem=document.getElementById(baseControlId+"_to");var vTo=(elem)?elem.value:"";elem=document.getElementById(baseControlId+"_cc");var vCC=(elem)?elem.value:"";elem=document.getElementById(baseControlId+"_bcc");var vBCC=(elem)?elem.value:"";elem=document.getElementById(baseControlId+"_subject");var vSubject=(elem)?elem.value:"";elem=document.getElementById(baseControlId);var vBody=(elem)?getInnerText(elem):"";var isFirstParam=true;var link="mailto:"+vTo;if(vSubject!=""){link+=getParamSeparatorChar(isFirstParam)+"subject="+vSubject;isFirstParam=false;}
if(vCC!=""){link+=getParamSeparatorChar(isFirstParam)+"cc="+vCC;isFirstParam=false;}
if(vBCC!=""){link+=getParamSeparatorChar(isFirstParam)+"bcc="+vBCC;isFirstParam=false;}
if(vBody!=""){vBody=vBody.replace(/([\:])\n\s*\n/g,"$1");vBody=vBody.replace(/(\n)[\s*\n]+/g,"$1");vBody=vBody.replace(/     /g," ");link+=getParamSeparatorChar(isFirstParam)+"body="+encodeURIComponent(vBody);}
document.location.href=link;}
function getParamSeparatorChar(isFirst){return(isFirst)?"?":"&";}
function getInnerText(elem){var hasInnerText=(document.getElementsByTagName("body")[0].innerText!=undefined)?true:false;return hasInnerText?elem.innerText:elem.textContent;}