/*
 * Sage SalesLogix Web Controls
 * Copyright(c) 2009, Sage Software.
 */


function PickList(clientId,picklistName,storeAsText,multiSelect,mustExistInList,alphaSort,autoPostback,canEditText,required){this.clientId=clientId;this.textId=clientId+"_Text";this.codeId=clientId+"_Code";this.listId=clientId+"_Items";this.listDivId=clientId+"_ListDIV";this.outerDivId=clientId+"_outerDiv";this.btnShowId=clientId+"_BtnShow";this.HyperTextId=clientId+"_HyperText";this.BtnDivId=clientId+"_ListBtnsDIV";this.isDroppedDown=false;this.storeValueAsText=storeAsText;this.multiSelect=multiSelect;this.mustExistInList=mustExistInList;this.AlphaSort=alphaSort;this.AutoPostBack=autoPostback;this.CanEditText=canEditText;this.PickListName=picklistName;this.LastValidText="";this.multiSelectValues=new Array();this.Required=required;this.defaultValueId=clientId+"_DefaultValue";this.defaultCodeId=clientId+"_DefaultCode";this.onChange=new YAHOO.util.CustomEvent("change",this);if(this.Required)
{var text=document.getElementById(this.textId);if(text.value=='')
{var code=document.getElementById(this.codeId);var defaultValue=document.getElementById(this.defaultValueId);var defaultCode=document.getElementById(this.defaultCodeId);if(this.storeValueAsText)
{text.value=defaultValue.value;code.value=defaultValue.value;}
else
{text.value=defaultValue.value;code.value=defaultCode.value;}}}}
function PickList_setVal(newVal){var text=document.getElementById(this.textId);var code=document.getElementById(this.codeId);var list=document.getElementById(this.listId);if(this.storeValueAsText=="True"){text.value=newVal;code.value=newVal;if(this.multiSelect=="True")
{this.multiSelectValues=new Array();var values=newVal.split(",");var listDiv=document.getElementById(this.listDivId);var items=listDiv.getElementsByTagName("input");var item;for(var i=0;i<items.length;i++)
{for(var j=0;j<values.length;j++)
{if(items[i].type=="checkbox")
{if(items[i].value==values[j])
{items[i].checked=true;this.multiSelectValues[items[i].id]=unescape(items[i].value);break;}
else{items[i].checked=false;}}}}}
else
{for(key=0;key<list.options.length;key++)
{if(list.options[key].text==newVal)
{text.value=list.options[key].text;code.value=newVal;list.options[key].selected=true;break;}}}}else{for(key=0;key<list.options.length;key++)
{if(list.options[key].value==newVal)
{text.value=list.options[key].text;code.value=newVal;list.options[key].selected=true;break;}}}}
function PickList_getVal(){var text=document.getElementById(this.textId);var code=document.getElementById(this.codeId);if(this.storeValueAsText=="True"){return text.value;}else{return code.value;}}
function PickList_HandleFocusLeave()
{var self=this;var text=document.getElementById(this.textId);}
function PickList_SetVisibility(visible)
{var self=this;var listDiv=document.getElementById(this.listDivId);if(visible)
{listDiv.style.display="block";if(this.multiSelect!="True")
{var pickListEl=document.getElementById(this.clientId);var pickListTextEl=document.getElementById(this.clientId+"_Text");var innerListEl=document.getElementById(this.clientId+"_InnerListDIV");var adjust=($(innerListEl).outerWidth()-$(innerListEl).width());$(innerListEl).width($(pickListTextEl).outerWidth()-adjust);}
if(this._globalClickBound!==true)
{this._globalClickBound=true;this._globalClickEl=Ext.isIE?document.body:document;var last=false;$(listDiv).parents().each(function(){var overflow=$(this).css("overflow");if(overflow=="auto"||overflow=="scroll")
{self._globalClickEl=last||this;return false;}
last=this;});Ext.get(this._globalClickEl).on("mousedown",this.MimicBlur,this,{delay:10});}
this.isDroppedDown=true;}
else
{this.ResolveValue();listDiv.style.display="none";this.isDroppedDown=false;}}
function PickList_ResolveValue()
{if((this.CanEditText)&&(this.mustExistInList)&&(this.multiSelect=="False"))
{var textELM=document.getElementById(this.textId);var codeELM=document.getElementById(this.codeId);var list=document.getElementById(this.listId);if(textELM.Value!="")
{for(key=0;key<list.options.length;key++)
{if(list.options[key].selected)
{textELM.value=list.options[key].text;codeELM.value=list.options[key].value;break;}}}}}
function PickList_MimicBlur(e)
{var e=(e!==false)?(e||window.event):false;var target=(e)?e.currentTarget||(e.target||e.srcElement):false;var el=document.getElementById(this.clientId);var contains=function(a,b){if(!a||!b)
return false;else
return a.contains?(a!=b&&a.contains(b)):(!!(a.compareDocumentPosition(b)&16));};if(target&&contains(el,target))
return;if(this._globalClickBound===true)
{Ext.get(this._globalClickEl||(Ext.isIE?document.body:document)).un("mousedown",this.MimicBlur);this._globalClickBound=false;}
this.SetVisibility(false);};function PickList_ButtonClick(e){var e=e||window.event;var target=e.currentTarget||e.srcElement;var listDiv=document.getElementById(this.listDivId);var controlDiv=document.getElementById(this.clientId);var list=document.getElementById(this.listId);if(this.isDroppedDown){this.MimicBlur(false);controlDiv.style.zIndex=0;}else{this.GetList();var ua=navigator.userAgent.toLowerCase();var textbox=$get(this.textId);var bounds=Sys.UI.DomElement.getBounds(textbox);if(bounds.width!=0)
{listDiv.style.width=bounds.width+"px";}
controlDiv.style.zIndex=1;this.SetVisibility(true);if(this.multiSelect=="True")
{var frame=$get(this.clientId+"_frame");var innerList=$get(this.clientId+"_InnerListDIV");if(innerList)
{var container=$("#"+this.clientId).find(".picklist-items");if(container.length>0)
{var position=container.position();var size={width:container.width(),height:container.height()};$(frame).css({"top":position.top+"px","left":position.left+"px","width":size.width+"px","height":size.height+"px"});}}}
list.focus();}
e.cancelBubble=true;if(e.stopPropagation)e.stopPropagation();return false;}
function PickList_GetList()
{var list=document.getElementById(this.listId);if((this.multiSelect=="True")||(list.options.length==0))
{if(typeof(xmlhttp)=="undefined"){xmlhttp=YAHOO.util.Connect.createXhrObject().conn;}
var current=document.getElementById(this.textId);var encodeText=encodeURIComponent(current.value);var vURL="SLXPickListCache.aspx?picklist="+this.PickListName+"&multiselect="+this.multiSelect+"&alphasort="+this.AlphaSort+"&clientid="+this.clientId+"&current="+encodeText;xmlhttp.open("GET",vURL,false);xmlhttp.send(null);this.HandleHttpResponse(xmlhttp.responseText);}}
function PickList_HandleHttpResponse(results){if(results=="NOTAUTHENTICATED")
{window.location.reload(true);return;}
if(this.multiSelect=="True")
{document.getElementById(this.listId).innerHTML=results;var listDiv=document.getElementById(this.listDivId);var items=listDiv.getElementsByTagName("input");for(var i=0;i<items.length;i++)
{if(items[i].checked)
{this.multiSelectValues[items[i].id]=unescape(items[i].value);}
else
{this.multiSelectValues[items[i].id]=undefined;}}}
else
{var list=document.getElementById(this.listId);var items=results.split("|");for(var i=0;i<items.length;i++)
{if(items[i]=="")continue;var parts=PickList_GetItemParts(items[i]);var oOption=document.createElement("OPTION");list.options.add(oOption);if(parts[0].charAt(0)=='@')
{parts[0]=parts[0].substr(1);oOption.selected=true;}
oOption.text=parts[1];oOption.value=parts[0];}}}
function PickList_GetItemParts(item)
{var parts=item.split("^");if(parts.length>2)
{for(var i=2;i<parts.length;i++)
{parts[1]=parts[1]+"^"+parts[i];}}
return parts;}
function PickList_SetHint(e)
{if(!e)var e=window.event;var list=document.getElementById(this.listId);if(e.target)
{list.title=e.target.textContent;}
else
{var offset=e.y;var indexOffset=0;var scrollIndex=list.scrollTop;scrollIndex=scrollIndex/14;while(offset>=14)
{offset=offset-14;indexOffset++;}
if(scrollIndex+indexOffset<list.options.length)
{list.title=list.options[scrollIndex+indexOffset].innerText;}}}
function PickList_SelectionChanged(){var list=document.getElementById(this.listId);if(list.options!=undefined&&list.options.length>0)
{var text=document.getElementById(this.textId);var code=document.getElementById(this.codeId);var hyperText=document.getElementById(this.HyperTextId);var oldText=text.value;if(list.selectedIndex!=-1)
{var newText;if(list.options[list.selectedIndex].innerText)
{newText=unescape(list.options[list.selectedIndex].innerText);}
else
{newText=unescape(list.options[list.selectedIndex].textContent);}
var newValue=list.options[list.selectedIndex].value;if(oldText!=newText)
{text.value=newText;if(hyperText!=undefined)
{if(navigator.appName.toLowerCase().indexOf("microsoft")==-1)
hyperText.textContent=newText;else
hyperText.innerText=newText;}
code.value=newValue;}}
this.SetVisibility(false);this.isDroppedDown=false;if(this.AutoPostBack)
{if(Sys)
{Sys.WebForms.PageRequestManager.getInstance()._doPostBack(this.clientId,null);}
else
{document.forms(0).submit();}}
this.onChange.fire(this);this.InvokeChangeEvent(text);}}
function PickList_MultiSelect(){var text=document.getElementById(this.textId);var newValue="";var hasMultiple=false;var listDiv=document.getElementById(this.listDivId);var items=listDiv.getElementsByTagName("input");var hyperText=document.getElementById(this.HyperTextId);for(var i=0;i<items.length;i++)
{if(this.multiSelectValues[items[i].id]!=undefined)
{if(hasMultiple){newValue=newValue+", "+this.multiSelectValues[items[i].id];}
else
{newValue=this.multiSelectValues[items[i].id];hasMultiple=true;}}}
if(newValue==""){}
else{if(newValue.length>text.maxLength){newValue=newValue.substring(0,text.maxLength-1);}}
this.SetVisibility(false);this.isDroppedDown=false;if(newValue!=text.value){if(hyperText!=undefined)
{if(navigator.appName.toLowerCase().indexOf("microsoft")==-1)
hyperText.textContent=newValue;else
hyperText.innerText=newValue;}
text.value=newValue;this.onChange.fire(this);this.InvokeChangeEvent(text);}}
function Picklist_HandleKeyDown(e){if(!e)var e=window.event;if(e.keyCode==9)
{this.MimicBlur();this.SelectionChanged();return true;}
else if(e.keyCode==13)
{e.returnValue=false;e.cancelBubble=true;if(e.stopPropagation)e.stopPropagation();this.SelectionChanged();return true;}
if(this.CanEditText==false)
{if(e.keyCode!=37&&e.keyCode!=38&&e.keyCode!=39&&e.keyCode!=40)
{return false;}}
return true;}
function PickList_TextChange(e)
{if(!e)var e=window.event;if(e.keyCode==13)
{return;}
var text=document.getElementById(this.textId);var list=document.getElementById(this.listId);var items=list.options;if(items.length==0){this.GetList();}
if(text.value=="")
{if((this.isDroppedDown)&&(!this.mustExistInList))
{this.SetVisibility(false);this.isDroppedDown=false;}
return;}
if(this.isDroppedDown)
{if(e.keyCode==40)
{list.selectedIndex=list.selectedIndex+1;return;}
if(e.keyCode==38)
{list.selectedIndex=list.selectedIndex-1;return;}}
if(this.mustExistInList)
{this.SetVisibility(true);this.isDroppedDown=true;}
else{list.selectedIndex=-1;}
var matchFound=false;for(var i=0;i<items.length;i++){var item=items[i];if(unescape(item.text).toLowerCase().indexOf(unescape(text.value).toLowerCase())==0){list.selectedIndex=i;matchFound=true;this.LastValidText=text.value;if(!this.isDroppedDown)
{this.SetVisibility(true);this.isDroppedDown=true;}
break;}}
if((this.mustExistInList)&&(!matchFound))
{text.value=this.LastValidText;}
if(list.selectedIndex==-1)
{this.SetVisibility(false);this.isDroppedDown=false;}}
function PickList_SetCheckedState(itemId,index,value)
{var checkbox=document.getElementById(itemId);if(checkbox.checked)
{checkbox.checked=false;this.multiSelectValues[checkbox.id]=undefined;}
else
{checkbox.checked=true;this.multiSelectValues[checkbox.id]=unescape(value);}}
function PickList_InvokeChangeEvent(cntrl)
{if(document.createEvent)
{var evObj=document.createEvent('HTMLEvents');evObj.initEvent('change',true,true);cntrl.dispatchEvent(evObj);}
else
{cntrl.fireEvent('onchange');}}
PickList.prototype.SetHint=PickList_SetHint;PickList.prototype.setVal=PickList_setVal;PickList.prototype.getVal=PickList_getVal;PickList.prototype.SetVisibility=PickList_SetVisibility;PickList.prototype.ButtonClick=PickList_ButtonClick;PickList.prototype.SelectionChanged=PickList_SelectionChanged;PickList.prototype.MultiSelect=PickList_MultiSelect;PickList.prototype.TextChange=PickList_TextChange;PickList.prototype.SetCheckedState=PickList_SetCheckedState;PickList.prototype.HandleFocusLeave=PickList_HandleFocusLeave;PickList.prototype.GetList=PickList_GetList;PickList.prototype.HandleHttpResponse=PickList_HandleHttpResponse;PickList.prototype.InvokeChangeEvent=PickList_InvokeChangeEvent;PickList.prototype.MimicBlur=PickList_MimicBlur;PickList.prototype.HandleKeyDown=Picklist_HandleKeyDown;PickList.prototype.ResolveValue=PickList_ResolveValue;