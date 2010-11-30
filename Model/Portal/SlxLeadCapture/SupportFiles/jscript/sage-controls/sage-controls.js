/*
 * Sage SalesLogix Web Controls
 * Copyright(c) 2009, Sage Software.
 */


if(typeof Sys!=="undefined")
{Type.registerNamespace("Sage.SalesLogix.Controls");Type.registerNamespace("Sage.SalesLogix.Controls.Resources");Type.registerNamespace("Resources");}
else
{Ext.namespace("Sage.SalesLogix.Controls");Ext.namespace("Sage.SalesLogix.Controls.Resources");Sage.__namespace=true;Sage.SalesLogix.__namespace=true;Sage.SalesLogix.Controls.__namespace=true;Sage.SalesLogix.Controls.Resources.__namespace=true;}
if(typeof(Sage)!="undefined")
{Sage.SyncExec=function(){this._functionList=[];var self=this;var prm=Sys.WebForms.PageRequestManager.getInstance();prm.add_endRequest(function(sender,args){self.onEndRequest();});};Sage.SyncExec.prototype.onEndRequest=function(){var functionsToCall=this._functionList;this._functionList=[];for(var i=0;i<functionsToCall.length;i++)
functionsToCall[i]();};Sage.SyncExec.prototype.tryCall=function(functionToCall){var prm=Sys.WebForms.PageRequestManager.getInstance();this._functionList.push(functionToCall);};Sage.SyncExec.call=function(functionToCall){if(typeof Sage.SyncExec._instance=="undefined")
Sage.SyncExec._instance=new Sage.SyncExec();Sage.SyncExec._instance.tryCall(functionToCall);};}
function IsAllowedNavigationKey(charCode){return(charCode==8||charCode==9||charCode==46||charCode==37||charCode==39);}
function RestrictToNumeric(e,groupSeparator,decimalSeparator){if(navigator.userAgent.indexOf("Firefox")>=0){if(e.keyCode&&IsAllowedNavigationKey(e.keyCode))return true;}
var code=e.charCode||e.keyCode;return((code>=48&&code<=57)||code==groupSeparator||code==decimalSeparator);}
function GetResourceValue(resource,defval){var val=resource;if((val==null)||(val.length==0)){val=defval;}
return val;}

function ReminderTimer(reminderId,userId,message,delay,clientId)
{this.Delay=delay;this.ElapsedTime=GetCookieInt("Elapsed","SlxReminder",0);this.TimerIsRunning=false;this.TimerId=null;this.ReminderId=reminderId;this.ClientId=clientId;this.UserId=userId;this.Message=message;this.StartTimer();}
function GetCookieInt(valuename,cookiename,defaultvalue)
{var tempVal=cookie.getCookieParm(valuename,cookiename);return(tempVal=="")?defaultvalue:parseInt(tempVal);}
function ReminderTimer_StartTimer()
{this.StopTimer();this.TimerIsRunning=true;this.TimerId=self.setTimeout("ReminderTimerObj.CheckTimeOut()",15000);}
function ReminderTimer_StopTimer()
{if(this.TimerIsRunning)
{clearTimeout(this.TimerId);}
timerRunning=false;}
function ReminderTimer_CheckTimeOut()
{var temp=this.ElapsedTime+15000;if(temp>=this.Delay)
{this.ElapsedTime=0;this.TimeOut();}
else
{this.ElapsedTime=temp;cookie.setCookieParm(this.ElapsedTime,"Elapsed","SlxReminder");this.StartTimer();}}
function ReminderTimer_TimeOut()
{var self=this;if((typeof(RolloverObj)!="undefined")&&(RolloverObj.RollingOver))return;$.get("SLXReminderHandler.aspx?user="+this.UserId,function(data,status){self.HandleHttpResponse(data);});this.StartTimer();}
function ReminderTimer_HandleHttpResponse(result)
{if(result=="NOTAUTHENTICATED")
{window.location.reload(true);return;}
if(isNaN(result)){return;}
var reminderButton=Ext.getCmp('toolbar_Reminders');if(reminderButton)
{reminderButton.setText(String.format("{0} ({1})",this.Message,result));if(result=="0")
{try{reminderButton.removeClass("x-btn-highlight");}
catch(e){}}
else
{reminderButton.addClass("x-btn-highlight");}}
var text=document.getElementById(this.ReminderId);if(text)
{text.innerHTML=String.format("{0} ({1})",this.Message,result);var outerElem=document.getElementById(this.ClientId);if(result=="0")
{Ext.get(this.ClientId).removeClass("ReminderAlert").addClass("ReminderNoAlert");}
else
{Ext.get(this.ClientId).removeClass("ReminderNoAlert").addClass("ReminderAlert");}}}
ReminderTimer.prototype.StartTimer=ReminderTimer_StartTimer;ReminderTimer.prototype.StopTimer=ReminderTimer_StopTimer;ReminderTimer.prototype.TimeOut=ReminderTimer_TimeOut;ReminderTimer.prototype.CheckTimeOut=ReminderTimer_CheckTimeOut;ReminderTimer.prototype.HandleHttpResponse=ReminderTimer_HandleHttpResponse;function ActivityRollover(message,userId)
{this.RollingOver=false;this.message=message;this.UserId=userId;}
ActivityRollover.prototype.DoRollovers=function()
{var NumberToRoll=20;if(typeof(roxmlhttp)=="undefined"){roxmlhttp=YAHOO.util.Connect.createXhrObject().conn;}
var vUrl=String.format("SLXReminderHandler.aspx?user={0}&Rollover=T&Count={1}",this.UserId,NumberToRoll);roxmlhttp.open("GET",vUrl,true);roxmlhttp.onreadystatechange=function(){RolloverObj.RolloverChild(vUrl,this.message);};roxmlhttp.send(null);}
ActivityRollover.prototype.RolloverChild=function(vURL,msg)
{if(roxmlhttp.readyState==4)
{if(roxmlhttp.responseText=="NOTAUTHENTICATED")
{window.location.reload(true);return;}
var NumberLeft=parseInt(roxmlhttp.responseText);if(NumberLeft>0)
{this.RollingOver=true;self.setTimeout("SetWarning("+NumberLeft+", '"+this.message+"')",100);roxmlhttp.open("GET",vURL,true);roxmlhttp.onreadystatechange=function(){RolloverObj.RolloverChild(vURL,this.message);};roxmlhttp.send(null);}
else
{self.setTimeout("ClearWarning()",500);}}}
function SetWarning(total,msg)
{var msgService=Sage.Services.getService("WebClientMessageService");if(msgService)
{msgService.showClientMessage(RolloverObj.message.replace("%d",total));}}
function ClearWarning()
{var msgService=Sage.Services.getService("WebClientMessageService");if(msgService)
{msgService.hideClientMessage();}
RolloverObj.RollingOver=false;}

PickListComboBox=function(options){var self=this;var o=options||{};this.pickListRequestUrl=o.pickListRequestUrl||"slxdata.ashx/slx/crm/-/picklists/find";this.pickListName=o.pickListName;var m={text:"text",id:"itemId",code:"code"};this.store=o.store=new Ext.data.Store({baseParams:{name:o.pickListName,sort:o.sort},proxy:new Ext.data.HttpProxy({url:String.format(this.pickListRequestUrl,escape(this.pickListName)),method:"GET"}),reader:new Ext.data.JsonReader({root:"items",id:"id",fields:[{name:"text"},{name:"value",convert:function(v,rec){return m[o.storageMode]?rec[m[o.storageMode]]:rec["text"];}}]})});o.mode="remote";o.displayField="text";o.valueField="value";o.triggerAction="all";o.minChars=(typeof o.minChars==="number")?o.minChars:4;o.typeAhead=(typeof o.typeAhead==="boolean")?o.typeAhead:false;o.editable=(typeof o.editable==="boolean")?o.editable:!o.mustExistInList;o.sort=(typeof o.sort==="boolean")?o.sort:true;PickListComboBox.superclass.constructor.call(this,o);}
Ext.extend(PickListComboBox,Ext.form.ComboBox,{initComponent:function()
{PickListComboBox.superclass.initComponent.call(this);this.bind();},bind:function(){},unbind:function(){},setValue:function(v){if(typeof v==="object")
{PickListComboBox.superclass.setValue.call(this,v.value);Ext.form.ComboBox.superclass.setValue.call(this,v.text);}
else
{PickListComboBox.superclass.setValue.call(this,v);}},getValue:function(){var v={text:Ext.form.ComboBox.superclass.getValue.call(this),value:PickListComboBox.superclass.getValue.call(this)};return v;}});Ext.reg('picklistcombo',PickListComboBox);AddressFormPanel=Ext.extend(Ext.form.FormPanel,{setLayout:function(layout){AddressFormPanel.superclass.setLayout.call(this,layout);if(Ext.isIE6)
{layout.elementStyle="padding-left:0px;";}}});function AddressControl(options){options=options||{};this._dialog=null;this._form=null;this._context=null;this._options=options;this._id=options.id;this._clientId=options.clientId;this._autoPostBack=options.autoPostBack;this._fields=options.fields;this._displayValueClientId=options.displayValueClientId;this._returnValueClientId=options.returnValueClientId;this._helpLink=options.helpLink;this._map={};this._templates={returnValue:['{addr1}|{addr2}|{addr3}|{city}|{state}|{postalCode}|{country}|{attention}|{description}|{isPrimary}|{isMailing}']};};AddressControl.fieldOptionHandlers={"checkbox":function(f,o){if(o.disableOnChecked)
if(f.getValue()===true)
f.disable();else
f.enable();}};AddressControl.prototype.getDialog=function(){return this._dialog;};AddressControl.prototype.initContext=function(){this._context=document.getElementById(this._clientId);};AddressControl.prototype.init=function(){this.initContext();};AddressControl.prototype.close=function(){if(this.getDialog())
this.getDialog().hide();};AddressControl.prototype.ensureDialog=function(){if(!this.getDialog())
this.createDialog();};AddressControl.prototype.createFormItems=function(){var self=this;var items=[];for(var i=0;i<this._fields.length;i++)
{if(this._fields[i].visible===false)
continue;this._map[this._fields[i].name]=this._fields[i];var f=$.extend(this._fields[i],this._fields[i].pickList,{id:this._clientId+"_field_"+this._fields[i].name,stateful:false,anchor:(this._fields[i].xtype!="checkbox")?"100%":false});if(f.maxLength>0)
f.autoCreate={tag:'input',type:'text',maxlength:this._fields[i].maxLength};items.push(f);}
return items;};AddressControl.prototype.processFieldOptions=function(f,o){if(AddressControl.fieldOptionHandlers[f.xtype])
AddressControl.fieldOptionHandlers[f.xtype].call(this,f,o);};AddressControl.prototype.restoreValues=function(){var form=this._form.getForm();form.setValues(this.getBoundValues());for(var name in this._map)
{var f=form.findField(name);var o=this._map[name].options;if(f&&o)
this.processFieldOptions(f,o);}};AddressControl.prototype.getBoundValues=function(){var values={};for(var name in this._map)
{var field=this._map[name];if(field)
{if(field.pickList)
{var textEl=document.getElementById(field.pickList.formTextClientId);var valueEl=document.getElementById(field.pickList.formValueClientId);if(textEl&&valueEl)
values[name]={text:$(textEl).val(),value:$(valueEl).val()};}
else
{var el=document.getElementById(field.formClientId);if(el)
if($(el).is(":checkbox"))
values[name]=el.checked;else
values[name]=$(el).val();}}}
return values;};AddressControl.prototype.setBoundValues=function(values){for(var name in values)
{var field=this._map[name];var value=values[name];if(field)
{if(field.pickList)
{var textEl=document.getElementById(field.pickList.formTextClientId);var valueEl=document.getElementById(field.pickList.formValueClientId);if(textEl)
textEl.value=value.text;if(valueEl)
valueEl.value=value.value;}
else
{var el=document.getElementById(field.formClientId);if(el)
if($(el).is(":checkbox"))
el.checked=(value===true||value==="true"||value==="on"||value===1)?true:false;else
$(el).val(value);}}}};AddressControl.prototype.setReturnValue=function(values){var variables={};for(var key in values)
variables[key]=(typeof values[key]==="object")?values[key].text:values[key];var template=new Ext.XTemplate(this._templates.returnValue);$("#"+this._returnValueClientId).val(template.apply(variables));};AddressControl.prototype.setDisplayValue=function(values,complete){var self=this;var map={'addr1':'addr1','addr2':'addr2','addr3':'addr3','city':'city','st':'state','zip':'postalCode','cntry':'country'};var parameters={};for(var key in map)
if(values[map[key]])
parameters[key]=(typeof values[map[key]]==="object")?values[map[key]].text:values[map[key]];$.get("SLXAddressHandler.aspx",parameters,function(data,status){$("#"+self._displayValueClientId).val(data);if(complete)
complete.call();});};AddressControl.prototype.getValues=function(){var form=this._form.getForm();var values={};for(var name in this._map)
{var field=form.findField(name);if(field)
values[name]=field.getValue();}
return values;};AddressControl.prototype.saveValues=function(){var self=this;var values=this.getValues();this.setBoundValues(values);this.setReturnValue(values);var mgr=Sage.Services.getService("ClientBindingManagerService");if(mgr){mgr.markDirty();}
this.setDisplayValue(values,function(){if(self._autoPostBack)
__doPostBack(self._clientId,'');});};AddressControl.prototype.createDialog=function(){var self=this;var form=new AddressFormPanel({id:this._clientId+"_form",baseCls:"x-plain",labelWidth:100,layoutConfig:{labelSeparator:""},defaultType:"textfield",bodyStyle:"padding:5px;",stateful:false,items:this.createFormItems()});var panel=new Ext.Panel({id:this._clientId+"_panel",autoScroll:true,border:false,items:[form]});var dialog=new Ext.Window({id:this._clientId+"_window",title:addressrsc.AddressControl_EditPanel_Header,cls:"address-dialog",width:(this._options.width>0)?this._options.width:350,height:(this._options.height>0)?this._options.height:390,minWidth:(this._options.minWidth>0)?this._options.minWidth:350,minHeight:(this._options.minHeight>0)?this._options.minHeight:390,layout:"fit",closeAction:"hide",plain:true,stateful:false,constrain:true,modal:true,items:[panel],buttonAlign:"right",buttons:[{id:this._clientId+"_ok",text:addressrsc.AddressControl_EditPanel_Ok,handler:function(){self.saveValues();self.close();}},{id:this._clientId+"_cancel",text:addressrsc.AddressControl_EditPanel_Cancel,handler:function(){self.close();}}],tools:[{id:"help",handler:function(evt,toolEl,panel){if(self._helpLink&&self._helpLink.url)
window.open(self._helpLink.url,(self._helpLink.target||"help"));}}]});dialog.on("resize",function(dialog,width,height){panel.doLayout();});form.on("afterlayout",function(container,layout){});dialog.on("show",function(dialog){self.restoreValues();if(typeof idLookup!="undefined")idLookup("address-dialog");});this._form=form;this._dialog=dialog;};AddressControl.prototype.show=function(){this.ensureDialog();this.getDialog().show();this.getDialog().center();};AddressControl.prototype.showMap=function(){this.createFormItems();var values=this.getBoundValues();var map={'streetaddress':'addr1','city':'city','state':'state','zip':'postalcode','country':'country'};var parameters={};for(var key in map)
if(values[map[key]])
parameters[key]=(typeof values[map[key]]==="object")?values[map[key]].text:values[map[key]];parameters.level=9;parameters.iconid=0;parameters.height=300;parameters.width=500;var queryParams=[];for(var key in parameters)
queryParams.push(key+"="+encodeURIComponent(parameters[key]));var url="http://www.mapquest.com/cgi-bin/ia_free?"+queryParams.join("&");var options='directories=no,location=no,menubar=no,pageXOffset=0px,pageYOffset=0px,scrollbars=yes,status=no,titlebar=no,toolbar=yes';window.open(url,'',options);};function Address_FormatAddress(ID)
{var elem=document.getElementById(this.displayID);var test=elem.value;var vURL="SLXAddressHandler.aspx?addr1="+this.desc1value+"&addr2="+this.desc2value+"&addr3="+this.desc3value
+"&city="+this.cityvalue+"&st="+this.statevalue
+"&zip="+this.zipvalue+"&cntry="+this.countryvalue;if(typeof(xmlhttp)=="undefined"){xmlhttp=YAHOO.util.Connect.createXhrObject().conn;}
xmlhttp.open("GET",vURL,false);xmlhttp.send(null);var results=xmlhttp.responseText;if(results=="NOTAUTHENTICATED")
{window.location.reload(true);return;}
if(test!=results)
{elem.value=results;if(this.AutoPostBack)
{if(Sys)
{Sys.WebForms.PageRequestManager.getInstance()._doPostBack(this.clientId,null);}
else
{document.forms(0).submit();}}}}
function Address_ButtonClick()
{tempStr="";addElems=new Array();addElems[0]="streetaddress=";addElems[1]="city=";addElems[2]="state=";addElems[3]="zip=";addElems[4]="country=";addElems[0]+=((this.desc1value=="")?"":this.desc1value);addElems[1]+=((this.cityvalue=="")?"":this.cityvalue);addElems[2]+=((this.statevalue=="")?"":this.statevalue);addElems[3]+=((this.zipvalue=="")?"":this.zipvalue);addElems[4]+=((this.countryvalue=="")?"":this.countryvalue);for(i=0;i<addElems.length;i++)
{if(addElems[i]=="")
{i++;}
if(i==0)
{tempStr="http://www.mapquest.com/cgi-bin/ia_free?height=300&width=500&"+addElems[i];}else{if(addElems[i].indexOf("=")!="")
{tempStr+=("&"+addElems[i]);}else{tempStr+=("+"+addElems[i]);}}}
var p1=0;var find=" ";var rep="+";p1=tempStr.indexOf(find);while(p1!=-1)
{preS=tempStr.substring(0,p1);posS=tempStr.substring(p1+1,tempStr.length);tempStr=preS+rep+posS;p1=tempStr.indexOf(find);}
tempStr+="&level=9&iconid=11";OpenMap(tempStr);}
function OpenMap(wCode)
{winH=window.open(wCode,'','directories=no,location=no,menubar=no,pageXOffset=0px,pageYOffset=0px,scrollbars=yes,status=no,titlebar=no,toolbar=yes');}
function Address(clientId,desc1,desc2,desc3,city,state,zip,country,county,salutation,description,primary,mailing,autoPostBack)
{this.clientId=clientId;this.displayID=clientId+"_displayText";this.dlgDivID=clientId+"_outerDiv";this.returnValueId=clientId+"_resultText";;this.desc1value=desc1;this.desc2value=desc2;this.desc3value=desc3;this.cityvalue=city;this.statevalue=state;this.zipvalue=zip;this.countryvalue=country;this.countyvalue=county;this.salutationvalue=salutation;this.description=description;this.isPrimary=primary;this.isMailing=mailing;this.AutoPostBack=autoPostBack;this.panel=null;}
function Address_Show()
{if((this.panel==null)||(this.panel.element.parentNode==null))
{var dlgDiv=document.getElementById(this.dlgDivID);dlgDiv.style.display="block";this.panel=new YAHOO.widget.Panel(this.dlgDivID,{visible:false,width:"300px",fixedcenter:false,constraintoviewport:true,x:250,y:200,underlay:"shadow",draggable:true});this.panel.render();}
this.panel.show();document.getElementById(this.clientId+"_Addr1").focus();}
function Address_Cancel()
{this.panel.hide();document.getElementById(this.clientId+"_Addr1").value=this.desc1value;document.getElementById(this.clientId+"_Addr2").value=this.desc2value;document.getElementById(this.clientId+"_Addr3").value=this.desc3value
document.getElementById(this.clientId+"_City_Text").value=this.cityvalue;document.getElementById(this.clientId+"_State_Text").value=this.statevalue;document.getElementById(this.clientId+"_Zip").value=this.zipvalue;document.getElementById(this.clientId+"_Country_Text").value=this.countryvalue;document.getElementById(this.clientId+"_Attn").value=this.salutationvalue;document.getElementById(this.clientId+"_Desc_Text").value=this.description;document.getElementById(this.clientId+"_IsPrimary").checked=this.isPrimary;document.getElementById(this.clientId+"_IsMailing").checked=this.isMailing;}
function Address_Ok()
{this.panel.hide();this.desc1value=document.getElementById(this.clientId+"_Addr1").value;this.desc2value=document.getElementById(this.clientId+"_Addr2").value;this.desc3value=document.getElementById(this.clientId+"_Addr3").value;this.cityvalue=document.getElementById(this.clientId+"_City_Text").value;this.statevalue=document.getElementById(this.clientId+"_State_Text").value;this.zipvalue=document.getElementById(this.clientId+"_Zip").value;this.countryvalue=document.getElementById(this.clientId+"_Country_Text").value;this.salutationvalue=document.getElementById(this.clientId+"_Attn").value;this.description=document.getElementById(this.clientId+"_Desc_Text").value;this.isPrimary=document.getElementById(this.clientId+"_IsPrimary").checked;this.isMailing=document.getElementById(this.clientId+"_IsMailing").checked
var returnValue=document.getElementById(this.returnValueId);returnValue.value=this.desc1value+"|"+this.desc2value+"|"+this.desc3value+"|"+this.cityvalue+"|"+this.statevalue+"|"+this.zipvalue+"|"+this.countryvalue+"|"+this.salutationvalue+'|'+this.description+'|'+this.isPrimary+'|'+this.isMailing;this.FormatAddress(this.displayID);}
function Address_HandleKeyEvent(evt)
{if(!evt){evt=window.event;}
if(evt.keyCode==13)
{this.Ok();}
else if(evt.keyCode==27)
{this.Cancel();}}
Address.prototype.ButtonClick=Address_ButtonClick;Address.prototype.FormatAddress=Address_FormatAddress;Address.prototype.Show=Address_Show;Address.prototype.Cancel=Address_Cancel;Address.prototype.Ok=Address_Ok;Address.prototype.HandleKeyEvent=Address_HandleKeyEvent;

Currency=function(currCode,cntrID,decimalSeparator,groupSeparator,symbol,groupDigits,decimalDigits,clearRegex,currVal,autoPostBack,warning,positivePattern,negativePattern,negativeSign)
{this.cntrID=cntrID;this.DecimalSeparator=decimalSeparator;this.GroupSeparator=groupSeparator;this.GroupDigits=groupDigits;this.DecimalDigits=decimalDigits;this.Symbol=symbol;this.Code=currCode;this.ClearRegex=clearRegex;this.AutoPostBack=autoPostBack;this.CurrVal=currVal;this.WarningMsg=warning;this.PositivePattern=positivePattern;this.NegativePattern=negativePattern;this.NegativeSign=negativeSign;}
function Currency_calculateCurrency(val)
{result=val*1;var elem=document.getElementById(this.cntrID);elem.value=result;}
function RestrictToCurrency(e){var code=e.charCode||e.keyCode;return(code==this.Symbol.charCodeAt(0)||RestrictToNumeric(e,this.GroupSeparator.charCodeAt(0),this.DecimalSeparator.charCodeAt(0)));}
function Currency_FormatCurrency()
{var currency=document.getElementById(this.cntrID);var val;var isText=false;if(this.cntrID.indexOf("_Text")>0)
{isText=true;val=currency.innerText;}
else
{val=currency.value;}
var negativeCheck=new RegExp(String.format("[\{0}\(\)]",this.NegativeSign));var isNegative=negativeCheck.test(val);var reg=new RegExp(this.ClearRegex,"g");val=val.replace(reg,"");if(this.DecimalSeparator!=".")
{if(val.indexOf(".")>=0)
{alert(val+" "+this.WarningMsg);if(!isText){currency.value=this.CurrVal;}
return;}}
var parts=val.split(this.DecimalSeparator);for(i=0;i<parts.length;i++)
{if(isNaN(parts[i]))
{alert(parts[i]+" "+this.WarningMsg);if(!isText){currency.value=this.CurrVal;}
return;}}
var result="";if(val!="")
{var pos=val.indexOf(this.DecimalSeparator)==-1?val.length:val.indexOf(this.DecimalSeparator);result=this.DecimalSeparator;for(var i=1;i<=this.DecimalDigits;i++)
{if(pos+i>=val.length)
{result+="0";}
else
{result+=val.substr(pos+i,1);}}
while(pos-this.GroupDigits>0)
{result=this.GroupSeparator+val.substr(pos-this.GroupDigits,this.GroupDigits)+result;pos=pos-this.GroupDigits;}
if(pos>0)
{result=val.substr(0,pos)+result;}}
if(result!="")
{if(this.Code==this.Symbol)
{this.NegativePattern=8;this.PositivePattern=3;}
var currencyValue="";if(isNegative)
{switch(this.NegativePattern)
{case 0:currencyValue=String.format("({0}{1})",this.Symbol,result);break;case 1:currencyValue=String.format("{0}{1}{2}",this.NegativeSign,this.Symbol,result);break;case 2:currencyValue=String.format("{0}{1}{2}",this.Symbol,this.NegativeSign,result);break;case 3:currencyValue=String.format("{0}{1}{3}",this.Symbol,result,this.NegativeSign);break;case 4:currencyValue=String.format("({0}{1})",result,this.Symbol);break;case 5:currencyValue=String.format("{0}{1}{2}",this.NegativeSign,result,this.Symbol);break;case 6:currencyValue=String.format("{0}{1}{2}",result,this.NegativeSign,this.Symbol);break;case 7:currencyValue=String.format("{0}{1}{3}",result,this.Symbol,this.NegativeSign);break;case 8:currencyValue=String.format("{0}{1} {2}",this.NegativeSign,result,this.Symbol);break;case 9:currencyValue=String.format("{0}{1} {2}",this.NegativeSign,this.Symbol,result);break;case 10:currencyValue=String.format("{0} {1}{2}",result,this.Symbol,this.NegativeSign);break;case 11:currencyValue=String.format("{0} {1}{2}",this.Symbol,result,this.NegativeSign);break;case 12:currencyValue=String.format("{0} {1}{2}",this.Symbol,this.NegativeSign,result);break;case 13:currencyValue=String.format("{0}{1} {2}",result,this.NegativeSign,this.Symbol);break;case 14:currencyValue=String.format("({0} {1})",this.Symbol,result);break;case 15:currencyValue=String.format("({0} {1})",result,this.Symbol);break;}}
else
{switch(this.PositivePattern)
{case 0:currencyValue=String.format("{0}{1}",this.Symbol,result);break;case 1:currencyValue=String.format("{0}{1}",result,this.Symbol);break;case 2:currencyValue=String.format("{0} {1}",this.Symbol,result);break;case 3:currencyValue=String.format("{0} {1}",result,this.Symbol);break;}}
if(isText)
currency.innerText=currencyValue;else
currency.value=currencyValue;this.CurrVal=currencyValue;}
if(this.AutoPostBack)
{if(Sys)
{Sys.WebForms.PageRequestManager.getInstance()._doPostBack(this.cntrID,null);}
else
{document.forms(0).submit();}}}
Currency.prototype.CalculateCurrency=Currency_calculateCurrency;Currency.prototype.FormatCurrency=Currency_FormatCurrency;Currency.prototype.RestrictCurrencyInput=RestrictToCurrency;

function SLXDateTimePicker(options)
{if(typeof(window._datePickers)=='undefined'){window._datePickers=[];}
for(var i=0;i<window._datePickers.length;i++){if(window._datePickers[i].ClientId==options.ClientID){var dp=window._datePickers[i];dp.ShortDate=options.DateFormat
dp.DisplayTime=options.DisplayTime;dp.ShowCal=options.DisplayDate;dp.AutoPostBack=options.AutoPostBack;dp.Year=options.Year;dp.Month=options.Month;dp.Day=options.Day;dp.Hours=options.Hour;dp.Min=options.Minute;return dp;}}
this.ShortDate=options.DateFormat;this.ClientId=options.ClientID;this.TextBoxID=options.ClientID+"_TXT";this.PanelId=options.ClientID+"_WIN";this.ContainerId=options.ClientID+"_Container";this.HiddenTextId=options.ClientID+"_Hidden";this.HyperTextId=options.ClientID+"_HyperText";this.Header="";this.DisplayTime=options.DisplayTime;this.Required=options.Required;this.Year=options.Year;this.Month=options.Month;this.Day=options.Day;this.Hours=options.Hour;this.Min=options.Minute;this.Panel=null;this.cal1=null;this.ShowCal=options.DisplayDate;this.AutoPostBack=options.AutoPostBack;this.OnChangeFN=(options.ClientChangeHandler=="undefined")?"":options.ClientChangeHandler;this.CalendarDateTime=new Date(options.Year,options.Month-1,options.Day,options.Hour,options.Minute);this.HideTimer;this.is24HourTime=options.Enable24HourTime;this._listeners={};this._listeners[SLXDateTimePicker.BEFORE_SHOW_EVENT]=[];this._listeners[SLXDateTimePicker.BEFORE_HIDE_EVENT]=[];this.id=(options.ClientID)?options.ClientID:"slxdatetimepicker";this.containerID=this.ClientID+"_cont";this.phpDateFormat=ConvertToPhpDateTimeFormat(options.DateFormat);var container=document.getElementById(this.containerID);if(!container){$("body").append("<div id=\""+this.containerID+"\"></div>");}
if(typeof(_dateTimePickerConstants)=='undefined')
_dateTimePickerConstants={"InvalidFormatError":"The date entered is not a valid date.","InvalidYearMsg":"Year is not 2 or 4 digits: ","InvalidMonthMsg":"Month value is invalid: ","InvalidDayMsg":"Day value is invalid: ","InvalidHourMsg":"Hour value is invalid: ","InvalidMinuteMsg":"Minute value is invalid: ","Invalid12HourMsg":"Invalid 12 Hour time (hour): ","TwoDigitYearMax":29,"Enable24HourTime":false,"MonthNames":["January","February","March","April","May","June","July","August","September","October","November","December",""],"DayNames":["Su","Mo","Tu","We","Th","Fr","Sa"],"MonthYearText":"Choose a month (Control+Up/Down to move years)","NextMonthText":"Next Month (Control+Right)","PrevMonthText":"Previous Month (Control+Left)","TodayToolTip":"{0} (Spacebar)","TodayText":"Today","OKText":"OK","CancelText":"Cancel","SelectADate":"Select a Date","SelectATime":"Select a Time","SelectADateAndTime":"Select a Date and Time"};this.mainDatePicker=new Ext.DatePicker({id:this.id+'_dp',name:this.id+'_dp',format:this.phpDateFormat,style:'margin-bottom:20px',okText:_dateTimePickerConstants.OKText,cancelText:_dateTimePickerConstants.CancelText});this.mainTimePicker=new Ext.form.TimeField({id:this.id+'_tp',name:this.id+'_tp',style:'margin-bottom:20px',format:this.getTimeFormatString(),width:178});var OKBtn=new Ext.Button({id:String.format('{0}_btnOk',this.id),name:this.id+'_ok',text:_dateTimePickerConstants.OKText,minWidth:'84',listeners:{click:{fn:this.handleOK,scope:this}}});var CancelBtn=new Ext.Button({id:String.format('{0}_btnCancel',this.id),name:this.id+'_cancel',minWidth:'84',text:_dateTimePickerConstants.CancelText,listeners:{click:{fn:this.handleCancel,scope:this}}});var datePanel=new Ext.Panel({id:this.id+'_datepanel',frame:true,bodyStyle:'padding:5px 5px 0',width:200,items:[this.mainDatePicker,this.mainTimePicker]});var label=_dateTimePickerConstants.SelectATime;if((options.DisplayDate)&&(options.DisplayTime)){label=_dateTimePickerConstants.SelectADateAndTime;}
else if(options.DisplayDate){label=_dateTimePickerConstants.SelectADate;}
this.win=new Ext.Window({title:label,contentEl:this.containerID,id:this.id+"_slxdpw",width:212,height:340,resizable:false,closeAction:'hide',autoScroll:false,constrain:true,plain:true,modal:true,border:false,items:[datePanel],buttons:[OKBtn,CancelBtn]});this.win.addListener('beforehide',this.beforeHide,this);window._datePickers.push(this);};SLXDateTimePicker.BEFORE_SHOW_EVENT="beforeShow";SLXDateTimePicker.BEFORE_HIDE_EVENT="beforeHide";SLXDateTimePicker.prototype.addListener=function(event,listener,options){this._listeners[event]=this._listeners[event]||[];if(typeof options=="undefined"||options==null)
options={hold:-1};this._listeners[event].push({listener:listener,evt:options});};SLXDateTimePicker.prototype.removeListener=function(event,listener){this._listeners[event]=this._listeners[event]||[];for(var i=0;i<this._listeners[event].length;i++)
if(this._listeners[event][i].listener==listener)
break;this._listeners[event].splice(i,1);};SLXDateTimePicker.prototype.beforeShow=function(args){for(var i=0;i<this._listeners[SLXDateTimePicker.BEFORE_SHOW_EVENT].length;i++)
{var listener=this._listeners[SLXDateTimePicker.BEFORE_SHOW_EVENT][i].listener;if(typeof listener==="function")
listener(this,args);else if(typeof listener==="object")
listener.beforeShow(this,args);}};SLXDateTimePicker.prototype.beforeHide=function(args){for(var i=0;i<this._listeners[SLXDateTimePicker.BEFORE_HIDE_EVENT].length;i++)
{var listener=this._listeners[SLXDateTimePicker.BEFORE_HIDE_EVENT][i].listener;if(typeof listener==="function")
listener(this,args);else if(typeof listener==="object")
listener.beforeHide(this,args);}};SLXDateTimePicker.prototype.handleCancel=function(e){this.Hide();};SLXDateTimePicker.prototype.showPicker=function(){if(this.win&&!this.win.isVisible()){var label=_dateTimePickerConstants.SelectATime;if((this.ShowCal)&&(this.DisplayTime)){label=_dateTimePickerConstants.SelectADateAndTime;}
else if(this.ShowCal){label=_dateTimePickerConstants.SelectADate;}
this.win.setTitle(label);this.win.show();}};SLXDateTimePicker.prototype.CanShow=function()
{var inPostBack=false;if(Sys)
{var prm=Sys.WebForms.PageRequestManager.getInstance();inPostBack=prm.get_isInAsyncPostBack();}
if(!inPostBack)
{return true;}
else
{return false;}};SLXDateTimePicker.prototype.Show=function()
{if(this.CanShow())
{var hours=this.Hours;var ampm="AM";if(!this.is24HourTime)
{if(hours>11){hours=hours-12;ampm="PM";}}
this.mainDatePicker.setVisible(this.ShowCal);this.mainTimePicker.setVisible(this.DisplayTime);var datestr=this.Year+"-";var fmtstr="Y-m-d h:i:s"
datestr+=(this.Month<10)?"0"+this.Month:this.Month;datestr+="-";datestr+=(this.Day<10)?"0"+this.Day:this.Day;datestr+=" ";datestr+=(hours<10)?"0"+hours:hours;datestr+=":"
datestr+=(this.Min<10)?"0"+this.Min:this.Min;datestr+=":00";if(!this.is24HourTime){datestr+=" "+ampm;fmtstr+=" A";}
var date=Date.parseDate(datestr,fmtstr);if(this.ShowCal)
{this.setDate(date);}
else if(this.DisplayTime)
{this.mainTimePicker.setValue(date);}
else return;if(!this.ShowCal)
{this.win.height=120;}
this.beforeShow();this.showPicker();}};SLXDateTimePicker.prototype.Hide=function()
{this.beforeHide();if((this.win)&&this.win.isVisible()){this.win.hide();}};SLXDateTimePicker.prototype.handleOK=function(e){var retDate=this.mainDatePicker.activeDate;if(this.DisplayTime){var timestr;var timeDivStr=this.getTimeDivChar();if(!this.mainTimePicker.isValid()){if(this.is24HourTime){timestr=this.Hours+timeDivStr+this.Min;}else{timestr=(this.Hours>11)?this.Hours-12:this.Hours;timestr+=timeDivStr;timestr+=(this.Min<10)?"0"+this.Min:this.Min;timestr+=(this.Hours>11)?" PM":" AM";}
this.mainTimePicker.setValue(timestr);}
timestr=this.mainTimePicker.getValue();if(this.is24HourTime){var timeParts=timestr.split(timeDivStr);retDate=retDate.add(Date.HOUR,timeParts[0]).add(Date.MINUTE,timeParts[1]);}else{var timePartsA=timestr.split(" ");var timeParts=timePartsA[0].split(timeDivStr);var h=timeParts[0];var m=timeParts[1];if((timePartsA[1].substr(0,1).toUpperCase()=="P")&&(h<12)){h=h-0+12;}else if((timePartsA[1].substr(0,1).toUpperCase()=="A")&&(h==12)){h=0;}
retDate=retDate.add(Date.HOUR,h).add(Date.MINUTE,m);}}
this.Year=retDate.getFullYear();this.Month=retDate.getMonth()+1;this.Day=retDate.getDate();this.Hours=retDate.getHours();this.Min=retDate.getMinutes();var hasChanged=((this.CalendarDateTime.getFullYear()!=retDate.getFullYear())||(this.CalendarDateTime.getMonth()!=retDate.getMonth())||(this.CalendarDateTime.getDate()!=retDate.getDate())||(this.CalendarDateTime.getHours()!=retDate.getHours())||(this.CalendarDateTime.getMinutes()!=retDate.getMinutes()));this.Hide();var textValue=$("#"+this.TextBoxID).attr('value');if((hasChanged)||(textValue=="")){var selectedDate=this.fmtDate();$('#'+this.TextBoxID).attr('value',selectedDate);$("#"+this.HyperTextId).text(selectedDate);this.InvokeChangeEvent(document.getElementById(this.TextBoxID));}};SLXDateTimePicker.prototype.fmtDate=function()
{this.CalendarDateTime=new Date(this.Year,this.Month-1,this.Day,this.Hours,this.Min);var hidden=document.getElementById(this.HiddenTextId);hidden.value=this.Year+","+this.Month+","+this.Day+","+this.Hours+","+this.Min;var result="";if(this.ShowCal)
{var divChar=this.getDivChar();var strMon=this.Month;var strDat=this.Day;if(this.ShortDate.substring(0,1).toUpperCase()=='MM')
{strMon=(strMon<10)?'0'+strMon:strMon;}
if(this.ShortDate.substring(0,1).toUpperCase=='DD')
{strDat=(strDat<10)?'0'+strDat:strDat;}
if(this.ShortDate.substring(0,1)=='M'||this.ShortDate.substring(0,1)=='m'){result=strMon+divChar+strDat+divChar+this.CalendarDateTime.getFullYear();}
if(this.ShortDate.substring(0,1)=='D'||this.ShortDate.substring(0,1)=='d'){result=strDat+divChar+strMon+divChar+this.CalendarDateTime.getFullYear();}
if(this.ShortDate.substring(0,1)=='Y'||this.ShortDate.substring(0,1)=='y'){result=this.CalendarDateTime.getFullYear()+divChar+strMon+divChar+strDat;}
if(this.DisplayTime)
{result+=" ";}}
if(this.DisplayTime)
{var timeDivStr=this.getTimeDivChar();var strHour=this.Hours;var strMin=this.Min;if(strMin<10){strMin="0"+strMin;}
if(this.ShortDate.indexOf('H')>-1)
{result+=strHour+timeDivStr+strMin;}
else if(this.ShortDate.indexOf('h')>-1)
{var str12Hour=this.Hours;if(this.Hours==0){str12Hour="12";}
var strMeridian="AM";if(this.Hours>=12)
{if(this.Hours>12)
{str12Hour=(this.Hours-12);}
strMeridian="PM";}
result+=str12Hour+timeDivStr+strMin+" "+strMeridian;}
else{result+=this.CalendarDateTime.toLocaleTimeString();}}
if(this.OnChangeFN!="")
{hidden.fireEvent("onchange");}
return result;};SLXDateTimePicker.prototype.ParseDateTime=function()
{var error=false;try
{var strDateTime=document.getElementById(this.TextBoxID).value;if(strDateTime==""&&this.Required!=true)
{var hidden=document.getElementById(this.HiddenTextId);hidden.value="";return;}
var arrayDateTime=strDateTime.split(" ");var strDate="";var strTime="";var strMeridian="";if(this.ShowCal)
{strDate=arrayDateTime[0];if(arrayDateTime.length>1)
{strTime=arrayDateTime[1];}
if(arrayDateTime.length>2)
{strMeridian=arrayDateTime[2];}}
else
{strTime=arrayDateTime[0];if(arrayDateTime.length>1)
{strMeridian=arrayDateTime[1];}}
var divChar=this.getDivChar();var items=new Array(3);if(this.ShowCal)
{var dividerIndex=0;for(var i=0;i<strDate.length;i++)
{if(strDate.charAt(i)==" "){break;}
if(strDate.charAt(i)==divChar)
{dividerIndex++;}
else
{if(items[dividerIndex]==undefined)
{items[dividerIndex]=strDate.charAt(i);}
else
{items[dividerIndex]+=strDate.charAt(i);}}}
if(this.ShortDate.substring(0,1)=='M'||this.ShortDate.substring(0,1)=='m'){this.Month=Number(items[0]);this.Day=Number(items[1]);this.Year=Number(items[2]);}
if(this.ShortDate.substring(0,1)=='D'||this.ShortDate.substring(0,1)=='d'){this.Day=Number(items[0]);this.Month=Number(items[1]);this.Year=Number(items[2]);}
if(this.ShortDate.substring(0,1)=='Y'||this.ShortDate.substring(0,1)=='y'){this.Year=Number(items[0]);this.Month=Number(items[1]);this.Day=Number(items[2]);}
if((isNaN(this.Year))||((this.Year>99)&&(this.Year<1000))||(this.Year>9999)){throw _dateTimePickerConstants.InvalidYearMsg;}
else if(this.Year<100)
{if(this.Year>_dateTimePickerConstants.TwoDigitYearMax){this.Year=this.Year+1900;}
else{this.Year=this.Year+2000;}}
if((isNaN(this.Month))||(this.Month<1)||(this.Month>12)){throw _dateTimePickerConstants.InvalidMonthMsg+this.Month;}
if((isNaN(this.Day))||(this.Day<1)||(this.Day>31)){throw _dateTimePickerConstants.InvalidDayMsg+this.Day;}}
if(strTime!="")
{var timeDivStr=this.getTimeDivChar();var hourOffset=0;items=strTime.split(timeDivStr);this.Hours=Number(items[0]);if(strMeridian!="")
{if(this.Hours>12){throw _dateTimePickerConstants.Invalid12HourMsg+this.Hours;}
if(this.Hours==12){this.Hours=0;}
if(strMeridian.indexOf("PM")>-1)
{hourOffset=12;}
this.Hours=this.Hours+hourOffset;}
this.Min=Number(items[1]);if((isNaN(this.Hours))||(this.Hours<0)||(this.Hours>=24)){throw _dateTimePickerConstants.InvalidHourMsg+this.Hours;}
if((isNaN(this.Min))||(this.Min<0)||(this.Min>=60)){throw _dateTimePickerConstants.InvalidMinuteMsg+this.Min;}}
var tempDate=this.CalendarDateTime;this.CalendarDateTime=new Date(this.Year,this.Month-1,this.Day,this.Hours,this.Min);if(this.CalendarDateTime.getMonth()!=(this.Month-1))
{this.CalendarDateTime=tempDate;throw"error";}
var hidden=document.getElementById(this.HiddenTextId);hidden.value=this.Year+","+this.Month+","+this.Day+","+this.Hours+","+this.Min;if(this.cal1!=null)
{this.cal1.setYear(this.Year);this.cal1.setMonth(this.Month-1);this.cal1.select(this.CalendarDateTime);this.cal1.render();}
var selectedDate=this.fmtDate()
document.getElementById(this.TextBoxID).value=selectedDate;}
catch(err)
{error=true;alert(_dateTimePickerConstants.InvalidFormatError+" "+err);this.Year=this.CalendarDateTime.getFullYear();this.Month=this.CalendarDateTime.getMonth()+1;this.Day=this.CalendarDateTime.getDate();this.Hours=this.CalendarDateTime.getHours();this.Min=this.CalendarDateTime.getMinutes();var selectedDate=this.fmtDate()
document.getElementById(this.TextBoxID).value=selectedDate;this.Show(this.ShowCal,this.DisplayTime);}
if((!error)&&(this.AutoPostBack))
{if(Sys)
{Sys.WebForms.PageRequestManager.getInstance()._doPostBack(this.TextBoxID,null);}
else
{document.forms(0).submit();}}};SLXDateTimePicker.prototype.getDivChar=function()
{var divChar="";for(var i=0;i<this.ShortDate.length;i++){if(isNaN(this.ShortDate.charAt(i))){if((this.ShortDate.charAt(i)<"A"||this.ShortDate.charAt(i)>"Z")&&(this.ShortDate.charAt(i)<"a"||this.ShortDate.charAt(i)>"z")){divChar=this.ShortDate.charAt(i);break;}}}
return divChar;};SLXDateTimePicker.prototype.getTimeDivChar=function(){if(this.DisplayTime){var fmtParts=this.ShortDate.split(" ");if(fmtParts.length>1){var timeFmt=fmtParts[1];for(var i=0;i<timeFmt.length;i++){if(isNaN(timeFmt.charAt(i))){if((timeFmt.charAt(i)<"A"||timeFmt.charAt(i)>"Z")&&(timeFmt.charAt(i)<"a"||timeFmt.charAt(i)>"z")){return timeFmt.charAt(i);}}}}}
return":";};SLXDateTimePicker.prototype.getTimeFormatString=function(){var divChar=this.getTimeDivChar();var time12=String.format("g{0}i A",divChar);var time24=String.format("G{0}i",divChar);return(this.is24HourTime)?time24:time12;}
SLXDateTimePicker.prototype.setDate=function(objDate)
{this.Year=objDate.getFullYear();this.Month=objDate.getMonth()+1;this.Day=objDate.getDate();this.CalendarDateTime=new Date(this.Year,this.Month-1,this.Day,this.Hours,this.Min);var hidden=document.getElementById(this.HiddenTextId);hidden.value=this.Year+","+this.Month+","+this.Day+","+this.Hours+","+this.Min;this.mainDatePicker.setValue(objDate);this.mainTimePicker.setValue(objDate);};SLXDateTimePicker.prototype.InvokeChangeEvent=function(cntrl)
{if(document.createEvent)
{var evObj=document.createEvent('HTMLEvents');evObj.initEvent('change',true,true);cntrl.dispatchEvent(evObj);}
else
{cntrl.fireEvent('onchange');}};

DependencyLookup=function(clientId,initCall,size,autoPostBack,title){this.ClientId=clientId;this.PanelId=clientId+"_Panel";this.InitCall=initCall;this.LookupControls=new Array();this.CurrentIndex=0;this.Size=size+"px";this.AutoPostBack=autoPostBack;this.panel=null;this.Title=title;};DependencyLookup.prototype.CanShow=function(){var inPostBack=false;if(Sys){var prm=Sys.WebForms.PageRequestManager.getInstance();inPostBack=prm.get_isInAsyncPostBack();}
if(!inPostBack){return true;}
else{var id=this.ClientId+"_obj";var handler=function(){window[id].Show('');}
Sage.SyncExec.call(handler);return false;}};DependencyLookup.prototype.Show=function(){if(this.CanShow()){if(this.panel==null){var lookup=document.getElementById(this.PanelId);lookup.style.display="block";this.panel=new Ext.Window({id:"dl_"+this.PanelId,layout:"fit",plain:true,closeAction:"hide",floating:true,width:this.Size,constrain:true,modal:false,title:this.Title,contentEl:lookup});if((this.CurrentIndex==0)||(this.LookupControls[i]!=undefined)){this.Init();}
for(var i=0;i<this.CurrentIndex;i++){if(this.LookupControls[i]!=undefined){var text=document.getElementById(this.LookupControls[i].TextId);var seedVal="";if(i>0){seedVal=this.GetSeeds(i);}
if((text.value!="")||(seedVal!="")||(i==0)){this.LookupControls[i].CurrentValue=text.value;var listId=this.LookupControls[i].ListId;var list=document.getElementById(listId);if(list.options.length==0){this.LookupControls[i].LoadList(seedVal);}}}}}
this.panel.show();}};DependencyLookup.prototype.AddControl=function(baseId,listId,textId,type,displayProperty,seedProperty){var dependCtrl=new dependControl(baseId,listId,textId,type,displayProperty,seedProperty);this.LookupControls[this.CurrentIndex]=dependCtrl;this.CurrentIndex++;};DependencyLookup.prototype.AddFilters=function(FilterProp,FilterValue)
{var dependCtrl=new dependControl(listId,textId,type,displayProperty,seedProperty);this.LookupControls[this.CurrentIndex]=dependCtrl;this.CurrentIndex++;};DependencyLookup.prototype.SelectionChanged=function(index){if((index+1)<this.CurrentIndex){this.LookupControls[index+1].LoadList(this.GetSeeds(index+1));for(var i=index+2;i<this.CurrentIndex;i++){this.LookupControls[i].ClearList();}}};DependencyLookup.prototype.Ok=function(){this.panel.hide();for(var i=0;i<this.CurrentIndex;i++){var text=document.getElementById(this.LookupControls[i].TextId);var list=document.getElementById(this.LookupControls[i].ListId);if((list.selectedIndex!=undefined)&&(list.selectedIndex!=-1)){text.value=list.options[list.selectedIndex].text;}
else{text.value="";}
this.InvokeChangeEvent(text);}
if(this.AutoPostBack){if(Sys){Sys.WebForms.PageRequestManager.getInstance()._doPostBack(this.ClientId,null);}
else{document.forms(0).submit();}}};DependencyLookup.prototype.Init=function(){eval(this.InitCall);};DependencyLookup.prototype.InvokeChangeEvent=function(cntrl){if(document.createEvent){var evObj=document.createEvent('HTMLEvents');evObj.initEvent('change',true,true);cntrl.dispatchEvent(evObj);}
else{cntrl.fireEvent('onchange');}};DependencyLookup.prototype.GetSeeds=function(index){var result="";for(var i=index;i>0;i--){var dependParent=this.LookupControls[i-1];var dependChild=this.LookupControls[i];var list=document.getElementById(dependParent.ListId);if(list.selectedIndex==-1){return result;}
var seed=list.options[list.selectedIndex];result+=dependChild.SeedProperty+","+seed.text+"|"}
result=result.substr(0,result.length-1);return result;};dependControl=function(baseId,listId,textId,type,displayProperty,seedProperty){this.BaseId=baseId;this.ListId=listId;this.TextId=textId;this.Type=type;this.DisplayProperty=displayProperty;this.SeedProperty=seedProperty;this.CurrentValue="";};dependControl.prototype.LoadList=function(seedValue){var vURL="SLXDependencyHandler.aspx?cacheid="+this.BaseId+"&type="+this.Type+"&displayprop="+this.DisplayProperty+"&seeds="+seedValue+"&currentval="+this.CurrentValue;Ext.Ajax.request({url:vURL,callback:this.HandleHttpResponse,scope:this});};dependControl.prototype.HandleHttpResponse=function(options,isSuccess,response){if(isSuccess){var list=document.getElementById(this.ListId);list.innerHTML="";var items=response.responseText.split("|");for(var i=0;i<items.length;i++){if(items[i]=="")continue;var parts=items[i].split(",");var oOption=document.createElement("OPTION");list.options.add(oOption);if(parts[0].charAt(0)=='@'){parts[0]=parts[0].substr(1);oOption.selected=true;}
oOption.innerHTML=parts[1];oOption.value=parts[0];}}};dependControl.prototype.ClearList=function(){var list=document.getElementById(this.ListId);list.innerHTML="";};DependencyLookup.prototype.close=function(){if(this.getDialog())
this.getDialog().hide();};

Email=function(emailID,email,autoPostBack)
{this.emailID=emailID;this.email=new emailProp(email,this);this.AutoPostBack=autoPostBack;}
function Email_FormatEmail(val)
{var elem=document.getElementById(this.emailID);elem.value=val;}
function Email_FormatEmailChange(ID)
{var elem=document.getElementById(this.emailID);if(this.email.get!=elem.value)
{this.email.set(elem.value);this.email.onChange.fire();if(this.AutoPostBack)
{if(Sys)
{Sys.WebForms.PageRequestManager.getInstance()._doPostBack(this.emailID,null);}
else
{document.forms(0).submit();}}}}
emailProp=function(val,parentElem)
{this.parentElement=parentElem;this.value=val;this.onChange=new YAHOO.util.CustomEvent("change",this);}
emailProp.prototype.set=function(val)
{this.value=val;this.parentElement.FormatEmail(val);}
emailProp.prototype.get=function()
{return this.value;}
function SendEmail(ID)
{var email=document.getElementById(ID);var sEmail=email.value;sEmail="mailto:"+sEmail;document.location.href=sEmail;}
function SendEmailFromLabel(ID)
{var email=document.getElementById(ID);var sEmail=email.innerHTML;sEmail="mailto:"+sEmail;document.location.href=sEmail;}
Email.prototype.FormatEmail=Email_FormatEmail;Email.prototype.FormatEmailChange=Email_FormatEmailChange;

if(typeof Ext.applyIfNull!=="function")
{Ext.applyIfNull=function(o,c){if(o&&c)
for(var p in c)
if(typeof o[p]=="undefined"||o[p]==null)
o[p]=c[p];return o;};}
Sage.SalesLogix.Controls.BufferedGridView=Ext.extend(Ext.ux.grid.BufferedGridView,{initTemplates:function(){this.templates.row=new Ext.Template('<div id="{id}" class="x-grid3-row {alt}" style="{tstyle}"><table class="x-grid3-row-table" border="0" cellspacing="0" cellpadding="0" style="{tstyle}">','<tbody><tr>{cells}</tr>',(this.enableRowBody?'<tr class="x-grid3-row-body-tr" style="{bodyStyle}"><td colspan="{cols}" class="x-grid3-body-cell" tabIndex="0" hidefocus="on"><div class="x-grid3-row-body">{body}</div></td></tr>':''),'</tbody></table></div>');Sage.SalesLogix.Controls.BufferedGridView.superclass.initTemplates.call(this);},doRender:function(cs,rs,ds,startRow,colCount,stripe){var ts=this.templates,ct=ts.cell,rt=ts.row,last=colCount-1;var tstyle='width:'+this.getTotalWidth()+';';var buf=[],cb,c,p={},rp={tstyle:tstyle},r;for(var j=0,len=rs.length;j<len;j++){r=rs[j];cb=[];if(typeof r==="undefined")
continue;if(this.id&&r){rp.id=(this.activeView!="list")?[this.id,"row",r.id].join("_"):[this.id,"row"+r.id,r.data[this.ds.converter.meta.keyfield]].join("_");}
var rowIndex=(j+startRow);for(var i=0;i<colCount;i++){c=cs[i];p.id=c.id;p.css=i==0?'x-grid3-cell-first ':(i==last?'x-grid3-cell-last ':'');p.attr=p.cellAttr="";p.value=c.renderer(r.data[c.name],p,r,rowIndex,i,ds);p.style=c.style;if(p.value==undefined||p.value==="")p.value="&#160;";if(r.dirty&&typeof r.modified[c.name]!=='undefined'){p.css+=' x-grid3-dirty-cell';}
cb[cb.length]=ct.apply(p);}
var alt=[];if(stripe&&((rowIndex+1)%2==0)){alt[0]="x-grid3-row-alt";}
if(r.dirty){alt[1]=" x-grid3-dirty-row";}
rp.cols=colCount;if(this.getRowClass){alt[2]=this.getRowClass(r,rowIndex,rp,ds);}
rp.alt=alt.join(" ");rp.cells=cb.join("");buf[buf.length]=rt.apply(rp);}
return buf.join("");},adjustVisibleRows:function(){var rows=this.getRows();if(rows[0]){var rh=rows[0].offsetHeight+0.5;if(rh<1.0){this.rowHeight=-1;return;}
this.rowHeight=rh;}
var g=this.grid,ds=g.store;var c=g.getGridEl();var cm=this.cm;var size=c.getSize(true);var vh=size.height;var vw=size.width-this.scrollOffset;if(cm.getTotalWidth()>vw){vh-=this.horizontalScrollOffset;}
vh-=this.mainHd.getHeight();var totalLength=ds.totalLength||0;var visibleRows=Math.max(1,Math.floor(vh/this.rowHeight));this.rowClipped=0;if(totalLength>visibleRows&&this.rowHeight>(vh-(visibleRows*this.rowHeight))){visibleRows=Math.min(visibleRows+1,totalLength);this.rowClipped=1;}
if(this.visibleRows==visibleRows-this.rowsClipped){return;}
this.visibleRows=visibleRows;if(this.isBuffering){return;}
if(this.rowIndex+(visibleRows-this.rowClipped)>totalLength){this.rowIndex=Math.max(0,totalLength-(visibleRows-this.rowClipped));this.lastRowIndex=this.rowIndex;}
this.updateLiveRows(this.rowIndex,true);}});Sage.SalesLogix.Controls.BufferedStore=Ext.extend(Ext.ux.grid.BufferedStore,{loadRecords:function(o,options,success)
{this.checkVersionChange(o,options,success);var totalRecords=0;if(o!=null)
{totalRecords=o.totalRecords;}
else
{totalRecords=0;}
this.bufferRange=[options.params.start,Math.min(options.params.start+options.params.limit,totalRecords)];Ext.ux.grid.BufferedStore.superclass.loadRecords.call(this,o,options,success);}});Sage.SalesLogix.Controls.BufferedRowSelectionModel=Ext.extend(Ext.ux.grid.BufferedRowSelectionModel,{getSelections:function()
{return Ext.ux.grid.BufferedRowSelectionModel.superclass.getSelections.call(this);}});Sage.SalesLogix.Controls.ListPanel=Ext.extend(Ext.Panel,{builders:{standard:function(options){return options;},sdata:function(options){var o=options;var u=[];var p=[];if(o.predicate&&(typeof o.predicate==="string")&&o.predicate.length>0)
u.push(String.format(o.resource,o.predicate));else
u.push(o.resource);if(typeof o.parameters==="object")
{for(var k in o.parameters)
{if((typeof o.parameters[k]==="object")&&(o.parameters[k].eval===true))
{var r=eval(o.parameters[k].statement);if(r!==false)
p.push(k+"="+encodeURIComponent(r));}
else if(typeof o.parameters[k]==="function")
{var r=o.parameters[k].apply(this,arguments);if(r!==false)
p.push(k+"="+encodeURIComponent(r));}
else
p.push(k+"="+encodeURIComponent(o.parameters[k]));}}
else if(typeof o.parameters==="string")
p.push(o.parameters);if(p.length>0)
{u.push("?");u.push(p.join("&"));}
return u.join("");}},visibleRangeMsg:"Displaying {0} - {1} of {2}",emptyRangeMsg:"No data to display",loadingMsg:"Loading...",pleaseWaitMsg:"Please wait...",detailText:"Detail",showDetailText:"Detail",hideDetailText:"Hide Detail",summaryText:"Summary",listText:"List",initComponent:function(){if(typeof Sage.SalesLogix.Controls.Resources.ListPanel!=="undefined")
Ext.apply(this,{visibleRangeMsg:this.initialConfig.visibleRangeMsg||Sage.SalesLogix.Controls.Resources.ListPanel.VisibleRangeMsg,emptyRangeMsg:this.initialConfig.emptyRangeMsg||Sage.SalesLogix.Controls.Resources.ListPanel.EmptyRangeMsg,loadingMsg:this.initialConfig.loadingMsg||Sage.SalesLogix.Controls.Resources.ListPanel.LoadingMsg,pleaseWaitMsg:this.initialConfig.pleaseWaitMsg||Sage.SalesLogix.Controls.Resources.ListPanel.PleaseWaitMsg,detailText:this.initialConfig.detailText||Sage.SalesLogix.Controls.Resources.ListPanel.DetailText,showDetailText:this.initialConfig.showDetailText||Sage.SalesLogix.Controls.Resources.ListPanel.ShowDetailText,hideDetailText:this.initialConfig.hideDetailText||Sage.SalesLogix.Controls.Resources.ListPanel.HideDetailText,summaryText:this.initialConfig.summaryText||Sage.SalesLogix.Controls.Resources.ListPanel.SummaryText,listText:this.initialConfig.listText||Sage.SalesLogix.Controls.Resources.ListPanel.ListText});Ext.applyIf(this,{metaConverters:{},margins:"0 0 0 0",title:false,frame:false,border:false,autoShow:true,bufferResize:true,cls:"list-panel",disableDetailView:(this.managers.detail?false:true)});Ext.apply(this,{presented:false,layout:"border",stateful:false,refreshFunc:{}});this.metaConverters=this.metaConverters||{};Ext.applyIfNull(this.metaConverters,{list:{xtype:"groupmetaconverter"},summary:{xtype:"groupsummarymetaconverter"}});this.initManagers();this.initViews();this.initToolbar();Sage.SalesLogix.Controls.ListPanel.superclass.initComponent.call(this);this.addEvents('itemselect','viewswitch','itemcontextmenu','present','initialload','load','beforerefresh','refresh');this.bind();this.register();},bind:function(){},unbind:function(){}});Sage.SalesLogix.Controls.ListPanel.instances={byId:{},byName:{}};Sage.SalesLogix.Controls.ListPanel.find=function(name){if(Sage.SalesLogix.Controls.ListPanel.instances.byName[name])
return Sage.SalesLogix.Controls.ListPanel.instances.byName[name];if(Sage.SalesLogix.Controls.ListPanel.instances.byId[name])
return Sage.SalesLogix.Controls.ListPanel.instances.byId[name];return false;};Sage.SalesLogix.Controls.ListPanel.prototype.register=function(){this.friendlyName=this.friendlyName||this.id;Sage.SalesLogix.Controls.ListPanel.instances.byId[this.id]=this;Sage.SalesLogix.Controls.ListPanel.instances.byName[this.friendlyName]=this;};Sage.SalesLogix.Controls.ListPanel.prototype.present=function(viewport){if(this.renderTo)
return;if(typeof this.addTo==="string")this.addTo=Ext.getCmp(this.addTo);if(this.addTo)
{$(this.addTo.getEl().dom).find(".x-panel-body").children().hide();this.addTo.add(this);this.addTo.doLayout();}
this.fireEvent("present",this);this.presented=true;if(this.createOnly)
this.refresh();};Sage.SalesLogix.Controls.ListPanel.prototype.initToolbar=function(){var self=this;var items=[];items.push("->");if(this.detailView)
{items.push({group:"detail",update:function(l){if(l.disableDetailView)
{this.hide();return;}
this.show();this.suspendEvents();this.toggle(l.loadState().showDetail);this.setText(l.loadState().showDetail?l.hideDetailText:l.showDetailText);this.resumeEvents();if(l.activeView=="summary")
this.disable();else
this.enable();},id:this.makeId("button","detail"),text:(!this.detailView.hidden)?this.hideDetailText:this.showDetailText,enableToggle:true,hidden:this.disableDetailView,disabled:(this.activeView=="summary"),pressed:(!this.detailView.hidden),listeners:{toggle:{fn:function(b,t){if(t)
self.detailView.show();else
self.detailView.hide();this.setText(t?self.hideDetailText:self.showDetailText);self.saveState({showDetail:t});self.doLayout();}}}});var separator=new Ext.Toolbar.Separator();separator.group="detail";separator.hidden=this.disableDetailView;separator.update=function(l){if(l.disableDetailView)
{this.hide();return;}
this.show();};separator.render=function(td){this.td=td;td.appendChild(this.el);if(this.hidden)
this.td.style.display="none";};items.push(separator);}
items.push({update:function(l){if((l.views.list&&l.connections.list)&&((l.views.summary&&l.connections.summary)||(l.views.timeline&&l.connection.timeline)))
{this.show();this.suspendEvents();this.toggle(l.activeView=="list");this.resumeEvents();}
else
{this.hide();}},id:this.makeId("button","list"),text:this.listText,hidden:!((this.views.list&&this.connections.list)&&((this.views.summary&&this.connections.summary)||(this.views.timeline&&this.connection.timeline))),listeners:{},enableToggle:true,pressed:(this.activeView=="list"),toggleGroup:this.makeId("button","toggle","group"),listeners:{toggle:{fn:function(b,t){if(t)
self.switchView("list");}}}});items.push({update:function(l){if(l.views.summary&&l.connections.summary)
{this.show();this.suspendEvents();this.toggle(l.activeView=="summary");this.resumeEvents();}
else
{this.hide();}},id:this.makeId("button","summary"),text:this.summaryText,hidden:!(this.views.summary&&this.connections.summary),listeners:{},enableToggle:true,pressed:(this.activeView=="summary"),toggleGroup:this.makeId("button","toggle","group"),listeners:{toggle:{fn:function(b,t){if(t)
self.switchView("summary");}}}});if(this.views.timeline)
items.push({update:function(l){this.suspendEvents();this.toggle(l.activeView=="timeline");this.resumeEvents();},id:this.makeId("button","timeline"),text:this.timelineText,listeners:{},enableToggle:true,pressed:(this.activeView=="timeline"),toggleGroup:this.makeId("button","toggle","group"),listeners:{toggle:{fn:function(b,t){if(t)
self.switchView("timeline");}}}});if(this.helpUrl)
items.push({icon:"ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16",text:false,cls:"x-btn-text-icon x-btn-icon-only",handler:function(){window.open(self.helpUrl,'MCWebHelp');}});this.tbar=new Sage.SalesLogix.Controls.ListPanelToolbar(items);};Sage.SalesLogix.Controls.ListPanel.prototype.switchView=function(view,forceLayout){if(this.activeView===view)
return;if(view==="summary")
this.detailView.hide();else if(this.loadState().showDetail&&!this.disableDetailView)
this.detailView.show();else
this.detailView.hide();this.activeView=view;this.saveState({activeView:view});var viewId=this.makeId(view);var viewComponent=this.mainView.findById(viewId);this.mainView.layout.setActiveItem(viewId);this.updateToolbarItems();this.doLayout();this.fireEvent("viewswitch",view,viewComponent,this);};Sage.SalesLogix.Controls.ListPanel.prototype.setEnableDetailView=function(enable,skipLayout){if(enable!==!this.disableDetailView)
{if(this.activeView==="summary")
this.detailView.hide();else if(this.loadState().showDetail&&enable)
this.detailView.show();else
this.detailView.hide();this.disableDetailView=!enable;if(skipLayout===true)
{this.updateToolbarItems();this.doLayout();}}};Sage.SalesLogix.Controls.ListPanel.prototype.refresh=function(){this.fireEvent("beforerefresh",this);var updateToolbar=true;if(this.activeView&&!(this.views[this.activeView]&&this.connections[this.activeView]))
{updateToolbar=false;this.switchView("list");}
if(this.refreshFunc[this.activeView])
this.refreshFunc[this.activeView].call(this);if(this.detailView&&this.detailView.refresh)
this.detailView.refresh();if(updateToolbar)
this.updateToolbarItems();this.fireEvent("refresh",this);};Sage.SalesLogix.Controls.ListPanel.prototype.updateToolbarItems=function(){var items=this.getTopToolbar().items.items;for(var i=0;i<items.length;i++)
if(items[i].update)
items[i].update.call(items[i],this);};Sage.SalesLogix.Controls.ListPanel.prototype.initManagers=function(){for(var k in this.managers)
{if(this.managers[k].xtype)
this.managers[k]=Ext.ComponentMgr.create(Ext.apply(this.managers[k],{id:this.makeId("manager",k),owner:this}));}};Sage.SalesLogix.Controls.ListPanel.prototype.makeId=function(){var parts=[];parts.push(this.id);for(var i=0;i<arguments.length;i++)
parts.push(arguments[i]);return parts.join('_');};Sage.SalesLogix.Controls.ListPanel.prototype.makeFriendlyId=function(){var parts=[];parts.push(this.friendlyName||this.id);for(var i=0;i<arguments.length;i++)
parts.push(arguments[i]);return parts.join('_');};Sage.SalesLogix.Controls.ListPanel.prototype.getStateId=function(view){if(typeof this.stateId==="string")
return this.makeFriendlyId(view,this.stateId);if(typeof this.stateId==="function")
return this.makeFriendlyId(view,this.stateId.call(this));return this.makeFriendlyId(view,"state");};Sage.SalesLogix.Controls.ListPanel.prototype.getChildStateId=function(view){if(typeof this.childStateId==="string")
return this.makeFriendlyId(view,this.childStateId);if(typeof this.childStateId==="function")
return this.makeFriendlyId(view,this.childStateId.call(this));return this.getStateId(view);};Sage.SalesLogix.Controls.ListPanel.prototype.loadState=function(refresh){if(refresh!==true&&this.state)
return this.state;return(this.state=Ext.state.Manager.get(this.getStateId("state"),this.state||{activeView:"list",showDetail:false}));};Sage.SalesLogix.Controls.ListPanel.prototype.saveState=function(updates,saveOnly){if(saveOnly!==true)
updates=Ext.apply(this.loadState(),updates);this.state=updates;Ext.state.Manager.set(this.getStateId("state"),updates);};Sage.SalesLogix.Controls.ListPanel.prototype.refreshState=function(){this.loadState(true);if(this.detailView)
if(this.state.showDetail)
this.detailView.show();else
this.detailView.hide();this.switchView(this.state.activeView,true);};Sage.SalesLogix.Controls.ListPanel.prototype.buildConnection=function(partial,source){source=(!source&&partial.copy&&this.connections[partial.copy])?this.connections[partial.copy]:source||{};Ext.applyIf(partial.parameters,source.parameters);Ext.applyIf(partial,source);return partial;};Sage.SalesLogix.Controls.ListPanel.prototype.initViews=function(){this.loadState();this.views=this.views||{};this.views.list=this.createList();this.views.summary=this.createSummary();var items=[];for(var k in this.views)
if(this.views[k])
items.push(this.views[k]);this.activeView=this.state.activeView;if(!this.activeView||!(this.views[this.activeView]&&this.connections[this.activeView]))
this.activeView="list";var active=this.makeId(this.activeView);this.mainView=this.mainView||new Ext.Panel(Ext.apply({border:false,region:"center",id:this.makeId("main"),autoShow:true,bufferResize:true,layout:"card",border:false,deferredRender:true,activeItem:active,items:items,stateful:false},this.mainViewConfig));this.detailView=this.detailView||new Sage.SalesLogix.Controls.SummaryPanel(Ext.apply({region:"south",id:this.makeId("detail"),height:200,layout:"fit",split:true,border:true,bodyBorder:false,collapsible:true,collapseMode:'mini',animCollapse:false,animFloat:false,autoScroll:true,margins:"0 0 0 0",cmargins:"0 0 0 0",autoShow:true,bufferResize:true,hidden:(this.activeView==="summary"||this.disableDetailView||!this.state.showDetail),cls:"list-detail",tbar:this.detailViewToolbar,manager:this.managers.detail,list:this,stateful:false},this.detailViewConfig));this.items=[this.mainView,this.detailView];};Sage.SalesLogix.Controls.ListPanel.prototype.useMetaDataFor=function(view){if(!this.connections[view])
return false;if(typeof this.connections[view].useStaticMetaData==="boolean")
return!this.connections[view].useStaticMetaData;return true;};Sage.SalesLogix.Controls.ListPanel.prototype.getViewOptions=function(view){if(this.viewOptions&&this.viewOptions[view])
return this.viewOptions[view];return{};};Sage.SalesLogix.Controls.ListPanel.prototype.applyFilter=function(filter){this.filter=filter;};Sage.SalesLogix.Controls.ListPanel.prototype.clearFilter=function(){this.filter=false;};Sage.SalesLogix.Controls.ListPanel.prototype.applyFilterToLiveGridStore=function(store){if(this.filter)
{store.proxy.conn.method="POST";store.proxy.conn.jsonData=this.filter;}
else
{if(store.proxy.conn.jsonData)
delete store.proxy.conn.jsonData;}};Sage.SalesLogix.Controls.ListPanel.prototype.createList=function(){var self=this;if(!this.connections.list||(this.connections.list.parameters.name)&&(this.connections.list.parameters.name()==""))
return false;var converter;if(!this.useMetaDataFor("list")){var c=Ext.apply({meta:this.connections.list.metaData},this.metaConverters.list);converter=Ext.ComponentMgr.create(c);converter.init();}
var reader;if(this.useMetaDataFor("list")){reader=new Ext.ux.data.BufferedJsonReader();}
else{var c=converter.toReaderConfig();reader=new Ext.ux.data.BufferedJsonReader(c.meta,c.recordType);}
var store=new Sage.SalesLogix.Controls.BufferedStore({autoLoad:false,bufferSize:150,reader:reader,filter:{},url:"/",builder:this.builders[this.connections.list.builder],connection:this.connections.list,converterConfig:this.metaConverters.list,manager:this.managers.list});store.on("beforeload",function(s,o){if(this.useMetaDataFor("list")&&!s.requestedMetaData)
s.connection.parameters.meta="true";s.proxy.conn.url=s.url=s.builder(s.connection,this);s.proxy.conn.method="GET";this.on("load",function(s,r){this.fireEvent("initialload",s,r,this);},this,{single:true});this.applyFilterToLiveGridStore(s);},this);store.on("load",function(s,r,o){var svc=Sage.Services.getService("ClientGroupContext");if(svc){svc.getContext().CurrentGroupCount=s.totalLength;}
if(this.useMetaDataFor("list")){s.requestedMetaData=true;delete s.connection.parameters.meta;}
this.fireEvent("load",s,r,this);},this);var view=new Sage.SalesLogix.Controls.BufferedGridView({id:this.makeFriendlyId("list"),nearLimit:25,forceFit:(this.getViewOptions("list").fitToContainer===false)?false:true,autoFill:true,loadMask:{msg:this.pleaseWaitMsg}});view.on("beforebuffer",function(v,s,index,visible,total,offset){s.proxy.conn.url=s.url=s.builder(s.connection,this);s.proxy.conn.method="GET";this.applyFilterToLiveGridStore(s);},this);view.on("beforebuffer",function(v,s,idx,vis,cnt){this.onLiveGridViewRangeEvent(idx,vis,cnt);},this);view.on("buffer",function(v,s,idx,vis,cnt){this.onLiveGridViewRangeEvent(idx,vis,cnt);},this);view.on("cursormove",function(v,idx,vis,cnt){this.onLiveGridViewRangeEvent(idx,vis,cnt);},this);view.on("cursormove",function(){if(typeof idRows!="undefined")idRows();},this);var selectionModel=new Sage.SalesLogix.Controls.BufferedRowSelectionModel({singleSelect:(this.getViewOptions("list").singleSelect===true)?true:false});selectionModel.on("rowselect",this.onLiveGridRowSelect,this);var columnModel;if(this.useMetaDataFor("list"))
columnModel=new Ext.grid.ColumnModel([]);else
columnModel=new Ext.grid.ColumnModel(converter.toColumnModel());var grid=new Ext.grid.GridPanel({id:this.makeId("list"),ds:store,enableDragDrop:false,cm:columnModel,sm:selectionModel,loadMask:{msg:this.loadingMsg},view:view,title:"",stripeRows:true,stateId:this.getChildStateId("list"),border:false,stateful:false,layout:"fit",cls:"list-view-list"});store.on("beforeload",function(s,o){var view=grid.getView();if(view)
view.rowHeight=-1;},this);var handleShow=function(){if(this.createOnly&&(this.presented==false))
return;var store=grid.getStore();store.sortToggle={};store.sortInfo=null;grid.stateId=self.getChildStateId("list");grid.initState();store.load();};grid.on("show",function(){if(grid.rendered)
handleShow.call(this);else
grid.on("render",function(){handleShow.call(this);},this,{single:true});},this);grid.on("rowcontextmenu",function(g,r,e){this.fireEvent("itemcontextmenu",r,e);},this);if(this.useMetaDataFor("list"))
store.on("metachange",function(s,m){this.onLiveGridStoreMetaChange(s,m,{grid:grid});},this);var handleRefresh=function(){var store=grid.getStore();store.sortToggle={};store.sortInfo=null;grid.stateId=self.getChildStateId("list");grid.initState();store.requestedMetaData=false;store.connection=self.connections.list;store.converterConfig=self.metaConverters.list;store.manager=self.managers.list;store.load();};this.refreshFunc.list=function(){if(grid.rendered)
handleRefresh.call(this);else
grid.on("render",function(grid){handleRefresh.call(this);},this,{single:true});};return grid;};Sage.SalesLogix.Controls.ListPanel.prototype.createSummary=function(){var self=this;if(!this.managers.summary||!this.connections.summary)
return false;var converter;if(!this.useMetaDataFor("summary"))
{var c=Ext.apply({meta:this.connections.summary.metaData},this.metaConverters.summary);converter=Ext.ComponentMgr.create(c);converter.init();}
var reader;if(this.useMetaDataFor("summary"))
reader=new Ext.ux.data.BufferedJsonReader();else
{var c=converter.toReaderConfig();reader=new Ext.ux.data.BufferedJsonReader(c.meta,c.recordType);}
var store=new Ext.ux.grid.BufferedStore({autoLoad:false,bufferSize:1000,reader:reader,filter:{},url:"/",builder:this.builders[this.connections.summary.builder],connection:this.connections.summary,converterConfig:this.metaConverters.summary,manager:this.managers.summary});store.on("beforeload",function(s,o){if(this.useMetaDataFor("summary")&&!s.requestedMetaData)
s.connection.parameters.meta="true";s.proxy.conn.url=s.url=s.builder.call(this,s.connection);s.proxy.conn.method="GET";this.on("load",function(s,r){this.fireEvent("initialload",s,r,this);},this,{single:true});this.applyFilterToLiveGridStore(s);},this);store.on("load",function(s,r,o){if(this.useMetaDataFor("summary"))
{s.requestedMetaData=true;delete s.connection.parameters.meta;}
this.fireEvent("load",s,r,this);},this);var view=new Sage.SalesLogix.Controls.BufferedGridView({id:this.makeFriendlyId("summary"),nearLimit:25,forceFit:true,autoFill:true,loadMask:{msg:this.pleaseWaitMsg}});view.on("beforebuffer",function(v,s,index,visible,total,offset){s.proxy.conn.url=s.url=s.builder.call(this,s.connection);s.proxy.conn.method="GET";this.applyFilterToLiveGridStore(s);},this);view.on("beforebuffer",function(v,s,idx,vis,cnt){this.onLiveGridViewRangeEvent(idx,vis,cnt);},this);view.on("buffer",function(v,s,idx,vis,cnt){this.onLiveGridViewRangeEvent(idx,vis,cnt);},this);view.on("cursormove",function(v,idx,vis,cnt){this.onLiveGridViewRangeEvent(idx,vis,cnt);},this);view.on("cursormove",function(){if(typeof idRows!="undefined")idRows();},this);var selectionModel=new Ext.ux.grid.BufferedRowSelectionModel({singleSelect:(this.getViewOptions("summary").singleSelect===false)?false:true});selectionModel.on("rowselect",this.onLiveGridRowSelect,this);var columnModel;if(this.useMetaDataFor("summary"))
columnModel=new Ext.grid.ColumnModel([]);else
columnModel=new Ext.grid.ColumnModel(converter.toColumnModel());var grid=new Ext.grid.GridPanel({id:this.makeId("summary"),ds:store,enableDragDrop:false,cm:columnModel,sm:selectionModel,loadMask:{msg:this.loadingMsg},view:view,title:"",stripeRows:false,stateId:this.getChildStateId("summary"),border:false,stateful:false,layout:"fit",cls:"list-view-summary"});store.on("beforeload",function(s,o){var view=grid.getView();if(view)
view.rowHeight=-1;},this);var handleShow=function(){if(this.createOnly&&(this.presented==false))
return;var store=grid.getStore();store.sortToggle={};store.sortInfo=null;grid.stateId=self.getChildStateId("summary");grid.initState();store.load();};grid.on("show",function(){if(grid.rendered)
handleShow.call(this);else
grid.on("render",function(){handleShow.call(this);},this,{single:true});},this);if(this.useMetaDataFor("summary"))
store.on("metachange",function(s,m){this.onLiveGridStoreMetaChange(s,m,{grid:grid});},this);var handleRefresh=function(){var store=grid.getStore();store.sortToggle={};store.sortInfo=null;grid.stateId=self.getChildStateId("summary");grid.initState();store.requestedMetaData=false;store.connection=self.connections.summary;store.converterConfig=self.metaConverters.summary;store.manager=self.managers.summary;store.load();};this.refreshFunc.summary=function(){if(grid.rendered)
handleRefresh.call(this);else
grid.on("render",function(grid){handleRefresh.call(this);},this,{single:true});};return grid;};Sage.SalesLogix.Controls.ListPanel.prototype.onLiveGridRowClick=function(grid,index,e){var view=grid.getView();var store=grid.getStore();var row=store.getAt(index)||store.data.items[index-view.bufferRange[0]];if(row)
this.fireEvent("itemselect",row,index,e);};Sage.SalesLogix.Controls.ListPanel.prototype.onLiveGridRowSelect=function(model,index,row){if(row)
this.fireEvent("itemselect",row,index);};Sage.SalesLogix.Controls.ListPanel.prototype.onLiveGridStoreMetaChange=function(s,m,o){var c={meta:m};Ext.apply(c,s.converterConfig);s.converter=Ext.ComponentMgr.create(c);s.converter.init();var store=o.grid.getStore();store.suspendEvents();store.removeAll();store.resumeEvents();o.grid.getColumnModel().setConfig(s.converter.toColumnModel());};Sage.SalesLogix.Controls.ListPanel.prototype.onLiveGridViewRangeEvent=function(rowIndex,visibleRows,totalCount){var message=(totalCount===0)?this.emptyRangeMsg:String.format(this.visibleRangeMsg,rowIndex+1,rowIndex+visibleRows,totalCount);var tbar=this.getTopToolbar();if(tbar&&tbar.setMessage)
tbar.setMessage(message);};Sage.SalesLogix.Controls.ListPanel.prototype.getSelections=function(o){if(this.activeView!="list")
return[];o=Ext.applyIf(o||{},{idOnly:false});if(o.idOnly===true)
{var result=[];var selections=this.views.list.getSelectionModel().getSelections();for(var i=0;i<selections.length;i++)
{result.push(selections[i].data[this.views.list.view.ds.converter.meta.keyfield]);}
return result;}
else
return this.views.list.getSelectionModel().getSelections();};Sage.SalesLogix.Controls.ListPanel.prototype.getSelectionInfo=function(){var recordCount=this.views.list.store.reader.jsonData.count;var selectionCount=this.getTotalSelectionCount();var selectionKey=this.id;var mode='selection';var selections=[];var ranges=[];var keyField=this.views.list.view.ds.converter.meta.keyfield;var sortDirection=this.views.list.view.ds.lastOptions.params.dir;var sortField=this.views.list.view.ds.lastOptions.params.sort;if(recordCount==selectionCount)
{if(selectionCount>0)
{mode='selectAll'}}
else
{var sels=this.views.list.getSelectionModel().getSelections();for(var i=0;i<sels.length;i++)
{var selection={rn:sels[i].data['SLXRN'],id:sels[i].data[this.views.list.view.ds.converter.meta.keyfield]};selections.push(selection);}
var rgs=this.views.list.getSelectionModel().getPendingSelections();for(var i=0;i<rgs.length;i++)
{var rangeTemp=rgs[i];var range={startRow:rangeTemp[0],endRow:rangeTemp[1]};ranges.push(range);}}
var selectionInfo={key:selectionKey,mode:mode,selectionCount:selectionCount,recordCount:recordCount,sortDirection:sortDirection,sortField:sortField,keyField:keyField,ranges:ranges,selections:selections};return selectionInfo;};Sage.SalesLogix.Controls.ListPanel.prototype.getTotalSelectionCount=function(){if(this.activeView!="list")
return 0;var totalCount=0;var selections=this.views.list.getSelectionModel().getSelections();var pendingSelections=this.views.list.getSelectionModel().getPendingSelections();for(var i=0;i<pendingSelections.length;i++)
{var range=pendingSelections[i];var startRow=range[0];var endRow=range[1];totalCount=totalCount+(endRow-startRow)+1;}
totalCount=totalCount+selections.length;return totalCount;};Ext.reg("listpanel",Sage.SalesLogix.Controls.ListPanel);Sage.SalesLogix.Controls.SummaryPanel=Ext.extend(Ext.Panel,{initComponent:function(){Ext.applyIf(this,{});Ext.apply(this,{});Sage.SalesLogix.Controls.SummaryPanel.superclass.initComponent.call(this);this.bind();},bind:function(){if(this.list)
{this.list.on("itemselect",function(context,index,e){this.showSummary(context);},this);this.list.on("load",function(s,r,l){if(this.context)
return;if(r&&r.length>0)
this.showSummary(r[0]);},this);}
this.on("show",function(){if(this.context)
this.showSummary(this.context);});this.on("hide",function(){this.clear();});},clear:function(){this.body.dom.innerHTML="";},refresh:function(){if(this.rendered)
{this.body.dom.innerHTML="";this.context=false;}
else
{this.on("render",function(panel){this.body.dom.innerHTML="";this.context=false;},this,{single:true});}},showSummary:function(context){if(this.manager)
{if(this.showTimeout)
clearTimeout(this.showTimeout);this.context=context;if(this.hidden)
return;if(this.isWaiting===false)
this.body.dom.innerHTML='<div class="loading-indicator">'+Sage.SalesLogix.Controls.Resources.ListPanel.LoadingMsg+'</div>';this.isWaiting=true;var self=this;this.run=this.run||function(){self.manager.show(self.context,self.body.dom);self.isWaiting=false;};this.showTimeout=setTimeout(this.run,250);}}});Ext.reg("summarypanel",Sage.SalesLogix.Controls.SummaryPanel);Sage.SalesLogix.Controls.ListPanelToolbar=Ext.extend(Ext.Toolbar,{initComponent:function()
{Sage.SalesLogix.Controls.ListPanelToolbar.superclass.initComponent.call(this);this.bind();},bind:function(){var parent=this.findParentBy(function(c){return true;},this);if(parent&&parent instanceof Sage.SalesLogix.Controls.ListPanel)
parent.on("viewswitch",function(view,id,component){this.setMessage("");},this);},unbind:function(){},setMessage:function(message){if(this.messageEl)
this.messageEl.dom.innerHTML=message;},onRender:function(container,position)
{Sage.SalesLogix.Controls.ListPanelToolbar.superclass.onRender.call(this,container,position);this.messageEl=Ext.fly(this.el.dom).createChild({tag:"span",cls:"x-paging-info"});}});Ext.reg("listpaneltoolbar",Sage.SalesLogix.Controls.ListPanelToolbar);Sage.SalesLogix.Controls.SummaryManager=function(config){config=config||{};Ext.apply(this,config);this.queue=[];this.timeout=false;this.run=false;this.template=new Ext.XTemplate(this.template);this.tooltip=new Sage.SalesLogix.Controls.SummaryToolTip({renderTo:Ext.getBody(),autoWidth:true,dismissDelay:0,hideDelay:500,showDelay:250});if(this.connection&&this.owner)
this.builder=this.owner.builders[this.connection.builder];Sage.SalesLogix.Controls.SummaryManager.superclass.constructor.apply(this,arguments);this.addEvents('show');if(this.id)
Sage.SalesLogix.Controls.SummaryManager.instances[this.id]=this;};Ext.extend(Sage.SalesLogix.Controls.SummaryManager,Ext.util.Observable);Sage.SalesLogix.Controls.SummaryManager.instances={};Sage.SalesLogix.Controls.SummaryManager.prototype.show=function(o,el,queued){if(queued===true)
{if(this.timeout)
clearTimeout(this.timeout);var self=this;this.run=this.run||function(){self.processQueue();};this.queue.push({o:o,el:el});setTimeout(this.run,250);return;}
else
{this.requestData(o,el);}};Sage.SalesLogix.Controls.SummaryManager.prototype.processQueue=function(){var trimmed=[];for(var i=this.queue.length-1;i>=0;i--)
{if(document.getElementById(this.queue[i].el))
trimmed.push(this.queue[i]);else
break;}
this.queue=[];for(var i=0;i<trimmed.length;i++)
this.requestData.call(this,trimmed[i].o,trimmed[i].el);};Sage.SalesLogix.Controls.SummaryManager.prototype.requestData=function(o,el){var o=o||{};var url=this.builder.call(this,this.connection,o);var self=this;$.ajax({url:url,dataType:"json",data:o.params||{},success:function(data){self.processData(o,el,data);},error:function(request,status,error){}});};Sage.SalesLogix.Controls.SummaryManager.prototype.processData=function(o,el,data){if(typeof el==="string")
el=Ext.get(el);if(el)
{Ext.apply(data.items[0],{context:o});this.template.overwrite(el,Ext.apply(data,{summarymanager:this.id}));this.fireEvent("show",this,o,el);}};Sage.SalesLogix.Controls.SummaryManager.prototype.onToolTipTargetOver=function(el,context,child,e){var connection=Ext.apply({},this.children[child].connection);Ext.applyIfNull(connection.parameters,this.connection.parameters);Ext.applyIfNull(connection,this.connection);var url=this.builder.call(this,connection,context);if(!e.pageX&&!e.pageY)
{e.pageX=e.clientX+document.body.scrollLeft;e.pageY=e.clientY+document.body.scrollTop;}
this.tooltip.target=el;this.tooltip.targetXY=Ext.lib.Event.getXY(e);this.tooltip.body.dom.innerHTML='<div class="loading-indicator">'+Sage.SalesLogix.Controls.Resources.ListPanel.LoadingMsg+'</div>';this.tooltip.show();var self=this;$.ajax({url:url,dataType:"json",success:function(data){if(!(self.children[child].template instanceof Ext.XTemplate))
self.children[child].template=new Ext.XTemplate(self.children[child].template);self.children[child].template.overwrite(self.tooltip.body,data);self.tooltip.syncSize();self.tooltip.doLayout();},error:function(request,status,error){}});};Sage.SalesLogix.Controls.SummaryManager.prototype.onToolTipTargetOut=function(el,context,child,e){if(this.tooltip&&!this.tooltip.hidden)
{if(this.tooltip.hideTimer)
this.tooltip.hide();else
this.tooltip.delayHide();}};Sage.SalesLogix.Controls.SummaryManager.toolTipHandler=function(dir,e){if(!e)var e=window.event;var el=Ext.get(e.target||e.srcElement);if(!el)
return;var id=el.getAttributeNS("slx","id");var name=el.getAttributeNS("slx","summarymanager");var child=el.getAttributeNS("slx","summarychild");if(!id||!name||!child)
return;var manager=Sage.SalesLogix.Controls.SummaryManager.instances[name];if(!manager)
return;switch(dir.toLowerCase())
{case"over":if(el.dom.innerText=='0')
return;manager.onToolTipTargetOver(el,{id:id},child,e);break;case"out":manager.onToolTipTargetOut(el,{id:id},child,e);break;}};var summaryToolTipHandler=Sage.SalesLogix.Controls.SummaryManager.toolTipHandler;Sage.SalesLogix.Controls.SummaryManager.navHandler=function(entityid,tabName,e){if((entityid=="")||(entityid.length!=12)){return;}
var url=document.location.href;if(url.indexOf("?")>-1){url=url.substring(0,url.indexOf("?"));}
url+="?entityid="+entityid;if(tabName!=""){url=url+"&activetab="+tabName;}
document.location=url;};var summaryNavHandler=Sage.SalesLogix.Controls.SummaryManager.navHandler;Ext.reg("summarymanager",Sage.SalesLogix.Controls.SummaryManager);Sage.SalesLogix.Controls.SummaryToolTip=Ext.extend(Ext.ToolTip,{initComponent:function(){Sage.SalesLogix.Controls.SummaryToolTip.superclass.initComponent.call(this);},afterRender:function(){Sage.SalesLogix.Controls.SummaryToolTip.superclass.afterRender.call(this);this.el.on('mouseout',this.onTargetOut,this);this.el.on('mouseover',this.onElOver,this);if(Ext.isIE)
this.on('resize',this.fixIESize,this);},checkWithin:function(e){if(this.el&&e.within(this.el.dom,true))
{return true;}
if(this.disabled||e.within(this.target.dom,true))
{return true;}
return false;},onElOver:function(e){if(this.checkWithin(e))
this.clearTimer('hide');},onTargetOver:function(e){if(this.disabled||e.within(this.target.dom,true))
return;this.clearTimer('hide');this.targetXY=e.getXY();this.delayShow(e);},delayShow:function(e){this.showTimer=this.doShow.defer(this.showDelay,this,[e]);},doShow:function(e){var xy=e.getXY();var within=this.target.getRegion().contains({left:xy[0],right:xy[0],top:xy[1],bottom:xy[1]});if(within)
this.show();},onTargetOut:function(e)
{if(this.checkWithin(e))
{this.clearTimer('hide');}
else if(this.hideTimer)
{this.hide();}
else
{this.delayHide();}},fixIESize:function(tip,aw,ah,w,h){var top=Ext.get(this.getEl().dom.firstChild);var bottom=Ext.get(this.getEl().dom.lastChild.lastChild);if(w)
w=w-top.getFrameWidth("l");else
w=this.el.getWidth();if(top)
top.setWidth(w);if(bottom)
bottom.setWidth(w);}});Ext.reg('summarytooltip',Sage.SalesLogix.Controls.SummaryToolTip);Sage.SalesLogix.Controls.MetaConverter=function(config){if(config&&config.meta)
Ext.apply(this,config);else
Ext.apply(this,{meta:config});Sage.SalesLogix.Controls.MetaConverter.superclass.constructor.apply(this,arguments);this.addEvents("init");};Ext.extend(Sage.SalesLogix.Controls.MetaConverter,Ext.util.Observable);Sage.SalesLogix.Controls.MetaConverter.toColumnModel=function(){return{};};Sage.SalesLogix.Controls.MetaConverter.toReaderConfig=function(){return{};};Sage.SalesLogix.Controls.MetaConverter.init=function(){this.fireEvent("init",this,this.meta);};Sage.SalesLogix.Controls.GroupSummaryMetaConverter=Ext.extend(Sage.SalesLogix.Controls.MetaConverter,{init:function(){},toColumnModel:function(){var model=[];var svc=Sage.Services.getService("ClientGroupContext");if(svc)
{var table=svc.getContext().CurrentTable;var item={header:svc.CurrentName,align:'left',sortable:false,dataIndex:table+'ID',renderer:this.summaryRenderer};}
model.push(item);return model;},toReaderConfig:function(){var columns=[];var id="ACCOUNTID";var svc=Sage.Services.getService("ClientGroupContext");if(svc)
id=svc.getContext().CurrentTable+"ID";columns.push({name:id,sortType:"string"});columns.push({name:'SLXRN',sortType:'int'});return{meta:this.meta,recordType:columns};},summaryRenderer:function(value,meta,record,rowIndex,columnIndex,store){if(!value)
return"&nbsp;";if(value.length!=12)
return value;var el=value+"_"+Sage.SalesLogix.Controls.GroupSummaryMetaConverter.renderedCount++;store.manager.show({id:value,record:record},el,true);return String.format('<div id="{0}" class="list-view-summary-item"><div class="loading-indicator">{1}</div></div>',el,Sage.SalesLogix.Controls.Resources.ListPanel.LoadingMsg);}});Sage.SalesLogix.Controls.GroupSummaryMetaConverter.renderedCount=0;Ext.reg("groupsummarymetaconverter",Sage.SalesLogix.Controls.GroupSummaryMetaConverter);Sage.SalesLogix.Controls.GroupMetaConverter=Ext.extend(Sage.SalesLogix.Controls.MetaConverter,{toBoolean:function(v){if(typeof v==="boolean")
return v;if(typeof v==="string"&&v.match)
return!!v.match(/T/i);return false;},init:function(){try{this.layout={entity:this.meta.layout.mainTable||this.meta.layout.entity,columns:[]};for(var i=0;i<this.meta.layout.items.length;i++)
this.layout.columns.push({dataPath:this.meta.layout.items[i].dataPath,alias:this.meta.layout.items[i].alias,align:this.meta.layout.items[i].align,formatString:this.meta.layout.items[i].formatString,format:this.meta.layout.items[i].format,caption:this.meta.layout.items[i].caption,captionAlign:this.meta.layout.items[i].captionAlign,sortType:null,width:this.meta.layout.items[i].width,isVisible:this.toBoolean(this.meta.layout.items[i].visible),isWebLink:this.toBoolean(this.meta.layout.items[i].webLink),isPrimaryKey:false});var l=this.layout.columns.length;for(var i=0;i<l;i++){var column=this.layout.columns[i];if(column.isVisible==false)
continue;if(column.renderer)
continue;switch(true){case((column.alias=="ACCOUNT")||(column.alias.match(/A\d_ACCOUNT/)?true:false)):column.renderer=this.createEntityLinkRenderer("ACCOUNT");break;case!!column.alias.match(/^email$/i):column.renderer=this.createEmailRenderer(column);break;case!!(column.format&&column.format.match(/DateTime/i)):column.renderer=this.createDateTimeRenderer(column);break;case!!(column.format&&column.format.match(/Phone/i)):column.renderer=this.createPhoneRenderer(column);break;case!!(column.format&&column.format.match(/Fixed/i)):column.renderer=this.createFixedNumberRenderer(column);break;case!!(column.format&&column.format.match(/Boolean/i)):column.renderer=this.createBooleanRenderer(column);break;default:column.renderer=this.createDefaultRenderer(column);break;}
if(column.isWebLink)
column.renderer=this.createEntityLinkRenderer(column);var r;for(var j=0;j<Sage.SalesLogix.Controls.GroupMetaConverter.renderers.length;j++)
if((r=Sage.SalesLogix.Controls.GroupMetaConverter.renderers[j].call(this,column))!==false)
column.renderer=r;}
this.fireEvent("init",this,this.layout);}
catch(e){Ext.Msg.alert("Error Reading Meta Data",e.message||e.description);}},toReaderConfig:function(){try{var fields=[];fields.push({name:'SLXRN',sortType:'int'});for(var i=0;i<this.layout.columns.length;i++){var column=this.layout.columns[i];var field={name:column.alias,sortType:column.sortType||"string"};switch(column.format){case"Owner":case"User":fields.push({name:column.alias+"NAME",sortType:"string"});break;case"DateTime":field.sortType="int";break;case"PickList Item":fields.push({name:column.alias+"TEXT",sortType:"string"});break;}
if(column.isWebLink)
fields.push({name:this.layout.entity+"ID",sortType:"string"});if(column.alias=="ACCOUNT"||column.alias=="ACCOUNT_ACCOUNT")
fields.push({name:"ACCOUNT_ID",sortType:"string"});fields.push(field);}
return{meta:this.meta,recordType:fields};}
catch(e){Ext.Msg.alert("Error Creating Reader Config",e.message||e.description);return{meta:this.meta,recordType:[]};}},toColumnModel:function(){try{var model=[];var cols=this.layout.columns;for(var i=0;i<cols.length;i++){var thiscol=cols[i];if(thiscol.isVisible&&parseInt(thiscol.width)>0){var item={header:thiscol.caption,align:thiscol.align,width:parseInt(thiscol.width),sortable:true,dataIndex:thiscol.alias,renderer:thiscol.renderer};Ext.each(Sage.SalesLogix.Controls.GroupMetaConverter.localization,function(l){if(l.hasOwnProperty(item["header"])){item["header"]=l[item["header"]];return false;}});switch(thiscol.format){case"Owner":case"User":item.dataIndex+="NAME";break;case"PickList Item":item.dataIndex+="TEXT";break;}
model.push(item);}}
return model;}
catch(e){Ext.Msg.alert("Error Creating Column Model",e.message||e.description);return[];}},createEntityLinkRenderer:function(column){var entity;var valuerenderer;if(typeof column==="string"){entity=column;valuerenderer=function(v,m,r,ro,c,s){return Ext.util.Format.htmlEncode(v);};}else{entity=(column.dataPath.lastIndexOf("!")>-1)?column.dataPath.substring(0,column.dataPath.lastIndexOf("!")).substring(column.dataPath.lastIndexOf(".")+1):column.dataPath.substring(0,column.dataPath.lastIndexOf(":"));valuerenderer=column.renderer;}
var tableName=entity.slice(0);var keyField=tableName+"ID";var grpService=Sage.Services.getService("ClientGroupContext");if(grpService){if(entity==grpService.getContext().CurrentTable){entity=grpService.getContext().CurrentEntity;keyField=grpService.getContext().CurrentTableKeyField;}}
return function(value,meta,record,rowIndex,columnIndex,store){var id=record.data[keyField]||record.data[tableName+"_ID"];if(!id)
return value;return(value?String.format("<a href={2}.aspx?entityid={0}>{1}</a>",id,valuerenderer(value,meta,record,rowIndex,columnIndex,store),entity):"");};},createFixedNumberRenderer:function(column){var format=column.formatString.replace(/%.*[dnf]/,"{0}").replace("%%","%");var useGroupingChar=(column.formatString.match(/%.*[dnf]/)==null)?false:(column.formatString.match(/%.*[dnf]/)[0].indexOf("n")>0);var match=column.formatString.match(/\.(\d+)/);var precision;if(match){precision=match[1];}
var NumericGroupingChar=Sage.SalesLogix.Controls.GroupMetaConverter.numericGroupingChar;var rx=/(\d+)(\d{3})/;if(precision&&!isNaN(precision)){return function(value,meta,record,rowIndex,columnIndex,store){if(value&&!isNaN(value)){var num=String.format(format,value.toFixed(precision));if(useGroupingChar){while(rx.test(num)){num=num.replace(rx,'$1'+NumericGroupingChar+'$2');}}
return num;}};}
return function(value,meta,record,rowIndex,columnIndex,store){return(value?Ext.util.Format.htmlEncode(value):"&nbsp;");};},createDateTimeRenderer:function(column){var renderer=Ext.util.Format.dateRenderer(ConvertToPhpDateTimeFormat(column.formatString));return function(value,meta,record,rowIndex,columnIndex,store){if(value&&value.getMinutes&&value.getHours){var minutes=(value.getMinutes()+value.getHours()*60);if((1440-minutes==value.getTimezoneOffset())&&(column.formatString.indexOf('h')==-1)&&(value.getTimezoneOffset()>0))
return renderer(new Date(value.clone().setDate(value.getDate()+1)));}
return renderer(value);};},createPhoneRenderer:function(column){return function(value,meta,record,rowIndex,columnIndex,store){if((value==null)||(value=="null"))return"&nbsp;";if(!value||value.length!=10)
return Ext.util.Format.htmlEncode(value);return String.format("({0}) {1}-{2}",value.substring(0,3),value.substring(3,6),value.substring(6));};},createEmailRenderer:function(column){return function(value,meta,record,rowIndex,columnIndex,store){return(value?String.format("<a href=mailto:{0}>{0}</a>",Ext.util.Format.htmlEncode(value)):"");}},createBooleanRenderer:function(column){return function(value,meta,record,rowIndex,columnIndex,store){if((value==null)||(value==""))return"&nbsp;";var arrBooleans={"T":true,"t":true,"Y":true,"y":true,"1":true,"+":true};var booleanValue=arrBooleans[String(value)];var strFmt=column.formatString;var strYes=Ext.util.Format.htmlEncode(Sage.SalesLogix.Controls.Resources.ListPanel.YesText);var strNo=Ext.util.Format.htmlEncode(Sage.SalesLogix.Controls.Resources.ListPanel.NoText);if((strFmt==null)||(strFmt==""))return(booleanValue==true)?strYes:strNo;var iIndex=(String(strFmt).indexOf("/"));if(iIndex!=-1){var arrValues=(String(strFmt).split("/"));if(arrValues.length==2){var strValue=(booleanValue==true)?arrValues[0]:arrValues[1];if((strValue==null)||(strValue=="")){return(booleanValue==true)?strYes:strNo;}
return Ext.util.Format.htmlEncode(strValue);}}
return(booleanValue==true)?strYes:strNo;}},createDefaultRenderer:function(column){return function(value,meta,record,rowIndex,columnIndex,store){return(value?Ext.util.Format.htmlEncode(value):"&nbsp;");}}});function ListPanel_RenderDateOnly(value)
{var renderer=Ext.util.Format.dateRenderer(ConvertToPhpDateTimeFormat(getContextByKey('userDateFmtStr')));if(value&&value.getMinutes&&value.getHours){var minutes=(value.getMinutes()+value.getHours()*60);if((1440-minutes==value.getTimezoneOffset())&&(value.getTimezoneOffset()>0))
return renderer(new Date(value.clone().setDate(value.getDate()+1)));}
return renderer(value);}
function ListPanelSummary_FixedNumberRenderer(value,fmtstr)
{var format=fmtstr.replace(/%.*[dnf]/,"{0}").replace("%%","%");var useGroupingChar=(fmtstr.match(/%.*[dnf]/)==null)?false:(fmtstr.match(/%.*[dnf]/)[0].indexOf("n")>0);var match=fmtstr.match(/\.(\d+)/);var precision;if(match)
{precision=match[1];}
var NumericGroupingChar=Sage.SalesLogix.Controls.GroupMetaConverter.numericGroupingChar;var rx=/(\d+)(\d{3})/;if(precision&&!isNaN(precision))
{if(value&&!isNaN(value))
{var num=String.format(format,value.toFixed(precision));if(useGroupingChar)
{while(rx.test(num))
{num=num.replace(rx,'$1'+NumericGroupingChar+'$2');}}
return num;}}
return(value?Ext.util.Format.htmlEncode(value):"&nbsp;");}
Sage.SalesLogix.Controls.GroupMetaConverter.numericGroupingChar=',';Sage.SalesLogix.Controls.GroupMetaConverter.renderers=[function(c){if(c.template)
{var t;try
{t=new Ext.XTemplate(c.template);}
catch(e)
{Ext.Msg.alert("Error Compiling Template",e.message||e.description);}
return function(value,meta,record,rowIndex,columnIndex,store){var o={value:value,row:record,column:c};try
{return t.apply(o);}
catch(e)
{if(!reported)
Ext.Msg.alert("Error Applying Template",e.message||e.description);reported=true;return value;}};}
return false;}];Sage.SalesLogix.Controls.GroupMetaConverter.registerCustomRenderer=function(r){Sage.SalesLogix.Controls.GroupMetaConverter.renderers.push(r);};Sage.SalesLogix.Controls.GroupMetaConverter.localization=[];Sage.SalesLogix.Controls.GroupMetaConverter.registerLocalizationStore=function(s){Sage.SalesLogix.Controls.GroupMetaConverter.localization.push(s);};Ext.reg("groupmetaconverter",Sage.SalesLogix.Controls.GroupMetaConverter);Sage.SalesLogix.Controls.StandardMetaConverter=Ext.extend(Sage.SalesLogix.Controls.MetaConverter,{init:function(){try
{var self=this;for(var i=0;i<this.meta.layout.items.length;i++)
{var item=this.meta.layout.items[i];item.width=(typeof item.width!=="number")?parseInt(item.width):item.width;item.sortable=(typeof item.sortable==="boolean")?item.sortable:true;Ext.each(["header"],function(f){if(typeof item[f]==="string")
Ext.each(Sage.SalesLogix.Controls.StandardMetaConverter.localization,function(l){if(l.hasOwnProperty(item[f]))
{item[f]=l[item[f]];return false;}});});Ext.each(Sage.SalesLogix.Controls.StandardMetaConverter.renderers,function(r){var c;if((c=r.call(self,item))!==false)
{item.renderer=c;return false;}});}
this.fireEvent("init",this,this.layout);}
catch(e)
{Ext.Msg.alert("Error Reading Meta Data",e.message||e.description);}},createDateTimeRenderer:function(column){var renderer=Ext.util.Format.dateRenderer(ConvertToPhpDateTimeFormat(getContextByKey('userDateFmtStr')));return function(value,meta,record,rowIndex,columnIndex,store){return renderer(value);};},toReaderConfig:function(){return{meta:this.meta,recordType:this.meta.fields};},toColumnModel:function(){return this.meta.layout.items;}});Sage.SalesLogix.Controls.StandardMetaConverter.renderers=[function(c){if(c.template)
{var t;var reported=false;try
{t=new Ext.XTemplate(c.template);t.compile();}
catch(e)
{Ext.Msg.alert("Error Compiling Template",e.message||e.description);}
return function(value,meta,record,rowIndex,columnIndex,store){var o={value:value,row:record,column:c};try
{return t.apply(o);}
catch(e)
{if(!reported)
Ext.Msg.alert("Error Applying Template",e.message||e.description);reported=true;return value;}};}
return false;},function(column){if(column.format&&column.format.match(/DateFormat/i))
{return column.renderer=this.createDateTimeRenderer(column);}
else
return false;}];Sage.SalesLogix.Controls.StandardMetaConverter.registerCustomRenderer=function(r){Sage.SalesLogix.Controls.StandardMetaConverter.renderers.push(r);};Sage.SalesLogix.Controls.StandardMetaConverter.localization=[];Sage.SalesLogix.Controls.StandardMetaConverter.registerLocalizationStore=function(s){Sage.SalesLogix.Controls.StandardMetaConverter.localization.push(s);};Ext.reg("standardmetaconverter",Sage.SalesLogix.Controls.StandardMetaConverter);Sage.SalesLogix.Controls.StandardSummaryMetaConverter=Ext.extend(Sage.SalesLogix.Controls.MetaConverter,{init:function(){},toColumnModel:function(){return[{header:"ID",align:"left",sortable:false,dataIndex:"id",renderer:this.summaryRenderer}];},toReaderConfig:function(){columns.push({name:"id",sortType:"string"});return{meta:this.meta,recordType:columns};},summaryRenderer:function(value,meta,record,rowIndex,columnIndex,store){if(!value)
return"&nbsp;";if(value.length<12)
return value;var el=value+"_"+Sage.SalesLogix.Controls.StandardSummaryMetaConverter.renderedCount++;store.manager.show({id:value,record:record},el,true);return String.format('<div id="{0}" class="list-view-summary-item"><div class="loading-indicator">{1}</div></div>',el,Sage.SalesLogix.Controls.Resources.ListPanel.LoadingMsg);}});Sage.SalesLogix.Controls.StandardSummaryMetaConverter.renderedCount=0;Ext.reg("standardsummarymetaconverter",Sage.SalesLogix.Controls.StandardSummaryMetaConverter);

function LookupControl(options){this._options=options;this._id=options.id;this._clientId=options.clientId;this._gridId=options.gridId;this._namedQuery=options.namedQuery;this._seedProperty=options.seedProperty;this._seedValue=options.seedValue;this._currentSeedValue=options.seedValue;this._overrideSeedOnSearch=options.overrideSeedOnSearch;this._entity=options.entity;this._entityDisplayName=options.entityDisplayName;this._entityDisplayProperty=options.entityDisplayProperty;this._linkUrl=options.linkUrl;this._resultId=options.resultId;this._resultTextId=options.resultTextId;this._resultHyperTextId=options.resultHyperTextId;this._properties=options.properties;this._context=null;this._dialog=null;this._autoPostBack=options.autoPostBack;this._initializeLookup=options.initializeLookup;this._initialized=false;this._helpLink=options.helpLink;this._returnPrimaryKey=options.returnPrimaryKey;this._returnProperty='id';this._templates={lookup:new Ext.XTemplate('<div class="lookup-query">','<span class="lookup-label">{lookupLabel}</span>','<div class="lookup-properties">','<select id="{lookupPropertiesId}" tabindex="1">','</select>','</div>','<div class="lookup-operators">','<select id="{lookupOperatorsId}" tabindex="2">','</select>','</div>','<div class="lookup-values">','<select id="{lookupValuesSelectId}" style="display:none;" tabindex="3"></select><input id="{lookupValuesInputId}" style="display:none;" type="text" tabindex="3" />','</div>','<div class="lookup-search"></div>','<div class="clear-both"></div>','</div>')};this._propertyLookup={};this._propertyPairs={};for(var i=0;i<this._properties.length;i++)
{this._propertyPairs[this._properties[i].value]=this._properties[i].name;this._propertyLookup[this._properties[i].value]=this._properties[i];if(this._properties[i].useAsResult)this._returnProperty=this._properties[i].name;}
LookupControl.__instances[this._clientId]=this;LookupControl.__initRequestManagerEvents();this.addEvents('open','close','change');};Ext.extend(LookupControl,Ext.util.Observable);LookupControl.DISPLAY_MODE_LIST=0;LookupControl.DISPLAY_MODE_DIALOG=1;LookupControl.DISPLAY_MODE_LINK=2;LookupControl.DISPLAY_MODE_TEXT=3;LookupControl.DISPLAY_MODE_BUTTON=4;LookupControl.__operators={"System.String":[{name:"LookupControl_Operator_Contains",value:"ct"},{name:"LookupControl_Operator_StartsWith",value:"sw"},{name:"LookupControl_Operator_Equal",value:"eq"},{name:"LookupControl_Operator_NotEqual",value:"ne"},{name:"LookupControl_Operator_GT",value:"gt"},{name:"LookupControl_Operator_GE",value:"gteq"},{name:"LookupControl_Operator_LT",value:"lt"},{name:"LookupControl_Operator_LE",value:"lteq"}],"System.Boolean":[{name:"LookupControl_Operator_Equal",value:"eq"},{name:"LookupControl_Operator_NotEqual",value:"ne"}],"SalesLogix.PickList":[{name:"LookupControl_Operator_Equal",value:"eq"},{name:"LookupControl_Operator_NotEqual",value:"ne"}]};LookupControl.__defaultOperators=[{name:"LookupControl_Operator_Equal",value:"eq"},{name:"LookupControl_Operator_NotEqual",value:"ne"},{name:"LookupControl_Operator_GT",value:"gt"},{name:"LookupControl_Operator_GE",value:"gteq"},{name:"LookupControl_Operator_LT",value:"lt"},{name:"LookupControl_Operator_LE",value:"lteq"}];LookupControl.__transforms={standard:{sw:function(e,p,t,v){return String.format("{0}.{1} like {2}",e,p,this.escape(t,(v+"*"),true));},ct:function(e,p,t,v){return String.format("{0}.{1} like {2}",e,p,this.escape(t,("*"+v+"*"),true));},eq:function(e,p,t,v){return String.format("{0}.{1} eq {2}",e,p,this.escape(t,v,true));},ne:function(e,p,t,v){return String.format("{0}.{1} ne {2}",e,p,this.escape(t,v,true));},gt:function(e,p,t,v){return String.format("{0}.{1} gt {2}",e,p,this.escape(t,v,true));},lt:function(e,p,t,v){return String.format("{0}.{1} lt {2}",e,p,this.escape(t,v,true));},gteq:function(e,p,t,v){return String.format("{0}.{1} gteq {2}",e,p,this.escape(t,v,true));},lteq:function(e,p,t,v){return String.format("{0}.{1} lteq {2}",e,p,this.escape(t,v,true));}},upper:{sw:function(e,p,t,v){return String.format("upper({0}.{1}) like upper({2})",e,p,this.escape(t,(v+"*"),true));},ct:function(e,p,t,v){return String.format("upper({0}.{1}) like upper({2})",e,p,this.escape(t,("*"+v+"*"),true));},eq:function(e,p,t,v){return String.format("upper({0}.{1}) eq upper({2})",e,p,this.escape(t,v,true));},ne:function(e,p,t,v){return String.format("upper({0}.{1}) ne upper({2})",e,p,this.escape(t,v,true));},gt:function(e,p,t,v){return String.format("upper({0}.{1}) gt upper({2})",e,p,this.escape(t,v,true));},lt:function(e,p,t,v){return String.format("upper({0}.{1}) lt upper({2})",e,p,this.escape(t,v,true));},gteq:function(e,p,t,v){return String.format("upper({0}.{1}) gteq upper({2})",e,p,this.escape(t,v,true));},lteq:function(e,p,t,v){return String.format("upper({0}.{1}) lteq upper({2})",e,p,this.escape(t,v,true));}}};LookupControl.__instances={};LookupControl.__requestManagerEventsInitialized=false;LookupControl.__initRequestManagerEvents=function(){if(LookupControl.__requestManagerEventsInitialized)
return;var contains=function(a,b){if(!a||!b)
return false;else
return a.contains?(a!=b&&a.contains(b)):(!!(a.compareDocumentPosition(b)&16));};var prm=Sys.WebForms.PageRequestManager.getInstance();prm.add_pageLoaded(function(sender,args){var panels=args.get_panelsUpdated();if(panels)
{for(var i=0;i<panels.length;i++)
{for(var id in LookupControl.__instances)
if(contains(panels[i],document.getElementById(id)))
{var instance=LookupControl.__instances[id];instance.initContext();}}}});LookupControl.__requestManagerEventsInitialized=true;};LookupControl.createOrRefresh=function(id,options){var instance=id;if(typeof id==="string")
instance=window[id];if(instance)
{if(instance.isInitialized())
instance.refresh(options);else
instance.init();}
else
{instance=window[id]=new LookupControl(options);instance.init();}};LookupControl.prototype.initContext=function(){if(document.getElementById)
this._context=document.getElementById(this._clientId);};LookupControl.prototype.isInitialized=function(){return this._initialized;};LookupControl.prototype.init=function(){this._initialized=true;this.initContext();};LookupControl.prototype.refresh=function(options){this._options=options;this._id=options.id;this._clientId=options.clientId;this._gridId=options.gridId;this._namedQuery=options.namedQuery;this._seedProperty=options.seedProperty;this._seedValue=options.seedValue;this._currentSeedValue=options.seedValue;this._overrideSeedOnSearch=options.overrideSeedOnSearch;this._entity=options.entity;this._entityDisplayName=options.entityDisplayName;this._entityDisplayProperty=options.entityDisplayProperty;this._linkUrl=options.linkUrl;this._resultId=options.resultId;this._resultTextId=options.resultTextId;this._resultHyperTextId=options.resultHyperTextId;this._properties=options.properties;this._autoPostBack=options.autoPostBack;this._initializeLookup=options.initializeLookup;this._helpLink=options.helpLink;this._returnPrimaryKey=options.returnPrimaryKey;};LookupControl.prototype.getTransformFor=function(op)
{var store=this._options.forceUpper?LookupControl.__transforms.upper:LookupControl.__transforms.standard;if(store&&store[op])
return store[op];else
return false;}
LookupControl.prototype.escape=function(type,value,quote){switch(type)
{case"SalesLogix.PickList":case"SalesLogix.MRCodePickList":case"System.String":if(quote)
{value=String.format("'{0}'",value.replace(new RegExp("\\'","g"),"''"));}
else
{value=value.replace(new RegExp("\\'","g"),"''");}
break;}
return value;};LookupControl.prototype.enable=function(){var result=$("#"+this._resultId);if(result.length>0)
result.get(0).disabled=true;var text=$("#"+this._resultTextId);if(text.length>0)
text.get(0).disabled=true;};LookupControl.prototype.disable=function(){var result=$("#"+this._resultId);if(result.length>0)
result.get(0).disabled=false;var text=$("#"+this._resultTextId);if(text.length>0)
text.get(0).disabled=false;};LookupControl.prototype.close=function(){if(this._dialog)
this._dialog.hide();};LookupControl.prototype.getResult=function(){return $("#"+this._resultId).val();};LookupControl.prototype.setResult=function(value){if(typeof value==='object')
{this.setResultText(this._returnPrimaryKey?value[this._entityDisplayProperty]||value['id']:value[this._entityDisplayProperty]||value[this._returnProperty]);this.setResultValue(this._returnPrimaryKey?value['id']:value[this._returnProperty]);}
else
this.setResultValue(value);};LookupControl.prototype.getResultValue=function(){return $("#"+this._resultId).val();};LookupControl.prototype.setResultValue=function(value){$("#"+this._resultId).val(value);};LookupControl.prototype.getResultText=function(){return $("#"+this._resultTextId).val();};LookupControl.prototype.setResultText=function(value){$("#"+this._resultTextId).val(value);};LookupControl.prototype.setResultHyperText=function(value){$("#"+this._resultHyperTextId).text(value);};LookupControl.prototype.doPostBack=function(){__doPostBack(this._clientId,'');};LookupControl.prototype.goToResult=function(){var result=this.getResult();if(result){var mgr=Sage.Services.getService("ClientBindingManagerService");if(mgr){if(mgr.canChangeEntityContext()){window.location=this._linkUrl+result;}}else{window.location=this._linkUrl+result;}}};LookupControl.prototype.getGrid=function(){return window[this._gridId];};LookupControl.prototype.invokeChangeEvent=function(el){if(document.createEvent)
{var evt=document.createEvent('HTMLEvents');evt.initEvent('change',true,true);el.dispatchEvent(evt);}
else
{el.fireEvent('onchange');}};LookupControl.prototype.getSeedQueryExpression=function(seedValue){if(this._seedProperty)
{var property=this._seedProperty;var operator="sw";var value=seedValue||this._currentSeedValue;var transform=this.getTransformFor(operator);if(transform)
if(value)
return transform.call(this,this._entity,property,"System.String",value);}
return false;};LookupControl.prototype.setGridParameters=function(seedValue,reload){var seedQuery=this.getSeedQueryExpression(seedValue);if(seedQuery)
this.getGrid().getConnections()["data"].parameters["where"]=seedQuery;else
if(!this._initializeLookup&&!this.hasDialog())
this.getGrid().getConnections()["data"].parameters["where"]="0 eq 1";if(reload)
this.getGrid().clearMetaData();if(reload&&this.getGrid().getNativeGrid())
this.getGrid().getNativeGrid().getStore().reload();};LookupControl.prototype.initGrid=function(seedValue,reload){if(this.getGrid()&&this.getGrid().hasStaticLayout())
{var isGridInitialized=(this.getGrid().getNativeGrid())?true:false;var reload=(!isGridInitialized)?false:reload;this.setGridParameters(seedValue,reload);this.getGrid().clearMetaData();if(!isGridInitialized)
{this.getGrid().init();this.wireUpGridEvents();}}};LookupControl.prototype.wireUpGridEvents=function(){var self=this;this.getGrid().getNativeGrid().on('rowdblclick',function(nativeGrid,rowIndex,evt){var view=nativeGrid.getView();var store=nativeGrid.getStore();var selected=store.getAt(rowIndex);if(!selected)
selected=store.data.items[rowIndex-view.bufferRange[0]];if(selected)
{self.setResult(selected.data);self.invokeChangeEvent($("#"+self._resultTextId).get(0));self.fireEvent('change',this);if(self._autoPostBack)
__doPostBack(self._clientId,'');}
self.close();});};LookupControl.prototype.checkPostBack=function(){if(this._autoPostBack)
__doPostBack(this._clientId,'');};LookupControl.prototype.clearResult=function(){this.setResult("");this.setResultText("");this.setResultHyperText("");this.invokeChangeEvent($("#"+this._resultTextId).get(0));this.fireEvent('change',this);if(this._autoPostBack)
__doPostBack(this._clientId,'');};LookupControl.prototype.createDialog=function(){var self=this;var variables={lookupPropertiesId:this._clientId+"_lookup_properties",lookupOperatorsId:this._clientId+"_lookup_operators",lookupValuesSelectId:this._clientId+"_lookup_values_select",lookupValuesInputId:this._clientId+"_lookup_values_input",lookupLabel:LookupControlResources.LookupControl_Label_LookupByShort,properties:this._properties};var gridPanel=new Ext.Panel({layout:"fit",border:false,items:this.getGrid().getNativeGrid()});var searchButton=new Ext.Button({id:this._clientId+"_lookup_search",text:LookupControlResources.LookupControl_Button_Search,tabIndex:4});var northPanel=new Ext.Panel({region:"north",margins:"5 5 5 5",id:this._id+"_lookup_panel_north",border:false,autoHeight:true,html:this._templates.lookup.apply(variables)});var dialog=new Ext.Window({id:this._id+"_lookup_dialog",title:String.format(LookupControlResources.LookupControl_Header,this._entityDisplayName),cls:"lookup-dialog",layout:"border",closeAction:"hide",plain:true,height:this._options.dialogHeight||500,width:this._options.dialogWidth||680,stateful:false,modal:true,items:[northPanel,{region:"center",margins:"0 0 0 0",border:false,layout:"fit",id:this._id+"_lookup_panel_center",items:gridPanel}],buttonAlign:"right",buttons:[{id:this._clientId+"_lookup_ok",tabIndex:5,text:GetResourceValue(LookupControlResources.LookupControl_Button_Ok,"OK"),handler:function(){var grid=self.getGrid().getNativeGrid();var selected;if(grid.getStore().getTotalCount()>1)
selected=grid.getSelectionModel().getSelected();else if(grid.getStore().getTotalCount()==1)
selected=grid.getStore().getAt(0);if(selected)
{self.setResult(selected.data);self.invokeChangeEvent($("#"+self._resultTextId).get(0));self.fireEvent('change',this);if(self._autoPostBack)
__doPostBack(self._clientId,'');}
self.close();}},{id:this._clientId+"_lookup_cancel",tabIndex:6,text:LookupControlResources.LookupControl_Button_Cancel,handler:function(){self.close();}}],tools:[{id:"help",handler:function(evt,toolEl,panel){if(self._helpLink&&self._helpLink.url)
window.open(self._helpLink.url,(self._helpLink.target||"help"));}}]});searchButton.on('click',function(){var context=dialog.getEl().dom;var properties=$(".lookup-properties select",context).selectedValues();var operators=$(".lookup-operators select",context).selectedValues();var property=(properties.length>0)?properties[0]:null;var operator=(operators.length>0)?operators[0]:null;self.getGrid().clearMetaData();if(!properties||!operator)
return;var info=self._propertyLookup[property];var value;switch(info.type)
{case"SalesLogix.PickList":var values=$(".lookup-values select",context).selectedValues();value=(values.length>0)?values[0]:null;break;case"SalesLogix.MRCodePickList":var values=$(".lookup-values select",context).selectedValues();value=(values.length>0)?values[0]:null;break;default:value=$(".lookup-values input",context).val();break;}
var transform=self.getTransformFor(operator);if(transform)
{if(value)
{var grid=self.getGrid();grid.getNativeGrid().getStore().setDefaultSort(property,'ASC');var where=transform.call(self,self._entity,property,info.type,value);if(!self._overrideSeedOnSearch)
{var seedQuery=self.getSeedQueryExpression();if(seedQuery)
where=where+" and "+seedQuery;}
grid.getConnections()["data"].parameters["where"]=where;grid.getNativeGrid().getStore().load();}
else
{var grid=self.getGrid();grid.getNativeGrid().getStore().setDefaultSort(property,'ASC');delete grid.getConnections()["data"].parameters["where"];if(!self._overrideSeedOnSearch)
{var seedQuery=self.getSeedQueryExpression();if(seedQuery)
grid.getConnections()["data"].parameters["where"]=seedQuery;}
grid.getNativeGrid().getStore().load();}}});dialog.on('hide',function(){self.fireEvent('close',this);},dialog);dialog.on('show',function(){var context=dialog.getEl().dom;if(!this._initialized)
{searchButton.render($(".lookup-search",context).get(0));var select=$(".lookup-properties select",context).addOption(self._propertyPairs).change(function(e){$("option:selected",this).each(function(){var property=self._propertyLookup[$(this).val()];if(property)
{var operators={};if(LookupControl.__operators[property.type])
for(var i=0;i<LookupControl.__operators[property.type].length;i++)
operators[LookupControl.__operators[property.type][i].value]=LookupControlResources[LookupControl.__operators[property.type][i].name];else
for(var i=0;i<LookupControl.__defaultOperators.length;i++)
operators[LookupControl.__defaultOperators[i].value]=LookupControlResources[LookupControl.__defaultOperators[i].name];var select=$(".lookup-operators select",context).get(0);$(select).removeOption(/./).addOption(operators);select.selectedIndex=0;if(property.type=="SalesLogix.PickList")
{$(".lookup-values input",context).val("").hide();$(".lookup-values select",context).removeOption(/./).show();$.ajax({url:String.format("slxdata.ashx/slx/crm/-/picklists/{0}",property.pickListName),data:{format:"json"},dataType:"json",success:function(data){var options={};for(var i=0;i<data.items.length;i++)
{var name=data.items[i].text;var value=data.items[i].itemId||data.items[i].text;options[value]=name;}
$(".lookup-values select",context).addOption(options);},error:function(request,status,error){}});}
else if(property.type=="SalesLogix.MRCodePickList")
{$(".lookup-values input",context).val("").hide();$(".lookup-values select",context).removeOption(/./).show();$.ajax({url:String.format("slxdata.ashx/slx/crm/-/CodePickLists({0})",property.pickListName),data:{format:"json"},dataType:"json",success:function(data){var options={};for(var i=0;i<data.items.length;i++)
{var name=data.items[i].displayValue;var value=data.items[i].pickListItemPath||data.items[i].displayValue;options[value]=name;}
$(".lookup-values select",context).addOption(options);},error:function(request,status,error){}});}
else if(property.type=="System.Boolean")
{$(".lookup-values input",context).val("").hide();$(".lookup-values select",context).removeOption(/./),addOption({"true":"true","false":"false"}).show();}
else
{$(".lookup-values select",context).removeOption(/./).hide();$(".lookup-values input",context).show();}}});}).get(0);if(select&&select.options.length>0)
{select.selectedIndex=0;$(select).change();}
$(".lookup-values input, .lookup-values select",context).bind("keypress",function(e){if(e.which==13)
{if(document.createEvent)
{var button=searchButton.getEl().dom;var evt=document.createEvent("MouseEvents");evt.initMouseEvent("click",true,true,window,0,0,0,0,0,false,false,false,false,0,null);button.dispatchEvent(evt);}
else
{$("#"+searchButton.getEl().dom.id).click();}
e.cancelBubble=true;if(e.stopPropagation)
e.stopPropagation();return false;}});this._initialized=true;}
if(typeof idLookup!="undefined")idLookup("lookup-dialog");var focusEl=$(".lookup-properties select",context).get(0);setTimeout(function(){focusEl.focus();},50);},dialog);this._dialog=dialog;this._searchButton=searchButton;this._northPanel=northPanel;};LookupControl.prototype.hasDialog=function(){return!!this._dialog;};LookupControl.prototype.getDialog=function(){return this._dialog;};LookupControl.prototype.ensureDialog=function(){if(!this.getDialog())
this.createDialog();};LookupControl.prototype.show=function(alternateSeedValue){var reload=false;if(alternateSeedValue&&alternateSeedValue!=this._currentSeedValue)
{this._currentSeedValue=alternateSeedValue;reload=true;}
this.initGrid(alternateSeedValue,reload);this.ensureDialog();this.getDialog().doLayout();this.getDialog().show();this.getDialog().center();this.getGrid().getNativeGrid().getStore().load();this.fireEvent('open',this);};

function NamePanel(clientId,prefix,first,middle,last,suffix,autoPostBack)
{this.ClientId=clientId;this.nameDivId=clientId+"_outerDiv";this.displayID=clientId+"_displayText";this.returnValueId=clientId+"_nameResult";this.prefix=prefix;this.first=first;this.middle=middle;this.last=last;this.suffix=suffix;this.AutoPostBack=autoPostBack;this.TextChanged=false;this.panel=null;}
function NamePanel_Show()
{if((this.panel==null)||(this.panel.element.parentNode==null))
{var dlgDiv=document.getElementById(this.nameDivId);dlgDiv.style.display="block";this.panel=new YAHOO.widget.Panel(this.nameDivId,{visible:false,width:"300px",height:"250px",fixedcenter:true,constraintoviewport:true,underlay:"shadow",draggable:true});this.panel.render();}
this.panel.show();document.getElementById(this.ClientId+"_first").focus();}
function NamePanel_Cancel()
{this.panel.hide();document.getElementById(this.ClientId+"_prefix_Text").value=this.prefix;document.getElementById(this.ClientId+"_first").value=this.first;document.getElementById(this.ClientId+"_middle").value=this.middle;document.getElementById(this.ClientId+"_last").value=this.last;document.getElementById(this.ClientId+"_suffix_Text").value=this.suffix;}
function NamePanel_Ok()
{this.panel.hide();this.prefix=document.getElementById(this.ClientId+"_prefix_Text").value;this.first=document.getElementById(this.ClientId+"_first").value;this.middle=document.getElementById(this.ClientId+"_middle").value;this.last=document.getElementById(this.ClientId+"_last").value;this.suffix=document.getElementById(this.ClientId+"_suffix_Text").value;var returnValue=document.getElementById(this.returnValueId);returnValue.value=this.prefix+"|"+this.first+"|"+this.middle+"|"+this.last+"|"+this.suffix;this.FormatName();}
function NamePanel_HandleKeyEvent(evt)
{if(!evt){evt=window.event;}
if(evt.keyCode==13)
{this.Ok();}
else if(evt.keyCode==27)
{this.Cancel();}}
function NamePanel_Trim(stringToTrim){return stringToTrim.replace(/^\s+|\s+$/g,"");}
function NamePanel_NameChanged()
{this.TextChanged=true;}
function NamePanel_FormatName()
{var name=((this.prefix=="")?"":this.prefix+' ');name+=((this.first=="")?"":this.first+' ');name+=((this.middle=="")?"":this.middle+' ');name+=((this.last=="")?"":this.last+' ');name+=((this.suffix=="")?"":this.suffix);name=this.Trim(name);var elem=document.getElementById(this.displayID);elem.value=name;this.TextChanged=false;if(this.AutoPostBack)
{if(Sys)
{Sys.WebForms.PageRequestManager.getInstance()._doPostBack(this.displayID,null);}
else
{document.forms(0).submit();}}}
function NamePanel_ParseName()
{if(!this.TextChanged){return;}
var longest=0;var elem=document.getElementById(this.displayID);var parseText=elem.value;var prefixes=document.getElementById(this.ClientId+"_prefix_Items");var suffixes=document.getElementById(this.ClientId+"_suffix_Items");var lastNamePrefixes=document.getElementById(this.ClientId+"_lastNamePrefixes");var testValue="";this.prefix="";this.first="";this.middle="";this.last="";this.suffix="";document.getElementById(this.ClientId+"_prefix_Text").value=this.prefix;document.getElementById(this.ClientId+"_suffix_Text").value=this.suffix;document.getElementById(this.ClientId+"_last").value=this.last;document.getElementById(this.ClientId+"_first").value=this.first;document.getElementById(this.ClientId+"_middle").value=this.middle;if(prefixes.options.length==0)
{eval(this.ClientId+"_prefix_obj.GetList();");}
for(var i=0;i<prefixes.options.length;i++)
{var testPrefix=prefixes.options[i].text.toUpperCase()+" ";testValue=parseText.substr(0,testPrefix.length).toUpperCase();if(testValue.localeCompare(testPrefix)==0)
{if(prefixes.options[i].text.length>longest)
{this.prefix=this.Trim(prefixes.options[i].text);document.getElementById(this.ClientId+"_prefix_Text").value=this.prefix;longest=this.prefix.length;break;}}
else
{testPrefix=testPrefix.replace(/\./g,"");testValue=parseText.substr(0,testPrefix.length).toUpperCase();if(testValue.localeCompare(testPrefix)==0)
{if(prefixes.options[i].text.length>longest)
{this.prefix=this.Trim(prefixes.options[i].text);document.getElementById(this.ClientId+"_prefix_Text").value=this.prefix;longest=testPrefix.length;break;}}}}
if(longest>0)
{parseText=parseText.substr(longest);}
longest=0;lastSpaceIdx=parseText.lastIndexOf(" ");testValue=parseText.substr(lastSpaceIdx+1).replace(/\./g,"");testValue=testValue.toUpperCase();if(suffixes.options.length==0)
{eval(this.ClientId+"_suffix_obj.GetList();");}
for(var i=0;i<suffixes.options.length;i++)
{var suffixWithoutDots=suffixes.options[i].text.replace(/\./g,"");suffixWithoutDots=suffixWithoutDots.toUpperCase();if(parseText.length>suffixes.options[i].text.length+1)
{if(testValue.localeCompare(suffixWithoutDots)==0)
{if(suffixWithoutDots.length>0)
{this.suffix=this.Trim(suffixes.options[i].text);document.getElementById(this.ClientId+"_suffix_Text").value=this.suffix;longest=this.suffix.length;}
parseText=parseText.substr(0,lastSpaceIdx)+" "+this.suffix;}}
else
{testValue=testValue.substr(testValue.length-suffixWithoutDots.length,suffixWithoutDots.length+1);if(testValue.localeCompare(" "+suffixWithoutDots)==0)
{if(suffixWithoutDots.length>0)
{this.suffix=this.Trim(suffixes.options[i].text);document.getElementById(this.ClientId+"_suffix_Text").value=this.suffix;longest=suffixWithoutDots.length;break;}}}}
if(longest>0)
{longest++;parseText=parseText.substr(0,parseText.length-longest);}
lastSpaceIdx=parseText.lastIndexOf(" ");while((lastSpaceIdx==parseText.length-1)&&(lastSpaceIdx>0))
{parseText=parseText.substr(0,lastSpaceIdx);lastSpaceIdx=parseText.lastIndexOf(" ");}
if(lastSpaceIdx>0)
{this.last=parseText.substr(lastSpaceIdx+1);document.getElementById(this.ClientId+"_last").value=this.last;parseText=parseText.substr(0,lastSpaceIdx);}
else
{this.last=this.Trim(parseText);document.getElementById(this.ClientId+"_last").value=this.last;parseText="";}
lastSpaceIdx=parseText.lastIndexOf(" ");if(lastSpaceIdx>0)
{testValue=parseText.substr(lastSpaceIdx+1).toUpperCase();for(var i=0;i<lastNamePrefixes.options.length;i++)
{if(testValue.localeCompare(lastNamePrefixes.options[i].text.toUpperCase())==0)
{this.last=lastNamePrefixes.options[i].text+" "+this.last;document.getElementById(this.ClientId+"_last").value=this.last;parseText=parseText.substr(0,lastSpaceIdx);break;}}}
if((this.last!="")&&(this.last[this.last.length-1]==","))
{this.last=this.last.substr(0,this.last.length-1);}
parseText=this.Trim(parseText);lastSpaceIdx=parseText.indexOf(" ");if(lastSpaceIdx>0)
{this.first=this.Trim(parseText.substr(0,lastSpaceIdx));this.middle=this.Trim(parseText.substr(lastSpaceIdx+1));}
else{this.first=this.Trim(parseText);}
document.getElementById(this.ClientId+"_first").value=this.first;document.getElementById(this.ClientId+"_middle").value=this.middle;var returnValue=document.getElementById(this.returnValueId);returnValue.value=this.prefix+"|"+this.first+"|"+this.middle+"|"+this.last+"|"+this.suffix;this.FormatName();}
NamePanel.prototype.FormatName=NamePanel_FormatName;NamePanel.prototype.Show=NamePanel_Show;NamePanel.prototype.Cancel=NamePanel_Cancel;NamePanel.prototype.Ok=NamePanel_Ok;NamePanel.prototype.HandleKeyEvent=NamePanel_HandleKeyEvent;NamePanel.prototype.NameChanged=NamePanel_NameChanged;NamePanel.prototype.ParseName=NamePanel_ParseName;NamePanel.prototype.Trim=NamePanel_Trim;

function OwnerControl(options){options=options||{};this._dialog=null;this._options=options;this._clientId=options.clientId;this._textClientId=options.textClientId;this._valueClientId=options.valueClientId;this._autoPostBack=options.autoPostBack;this._identifyNodes=true;this._result=false;this._typeAheadText=false;this._typeAheadTimeout=false;this._helpLink=options.helpLink;OwnerControl.__instances[this._clientId]=this;OwnerControl.__initRequestManagerEvents();this.addEvents('open','close','change');};Ext.extend(OwnerControl,Ext.util.Observable);OwnerControl.__instances={};OwnerControl.__requestManagerEventsInitialized=false;OwnerControl.__initRequestManagerEvents=function(){if(OwnerControl.__requestManagerEventsInitialized)
return;var contains=function(a,b){if(!a||!b)
return false;else
return a.contains?(a!=b&&a.contains(b)):(!!(a.compareDocumentPosition(b)&16));};var prm=Sys.WebForms.PageRequestManager.getInstance();prm.add_pageLoaded(function(sender,args){var panels=args.get_panelsUpdated();if(panels)
{for(var i=0;i<panels.length;i++)
{for(var id in OwnerControl.__instances)
if(contains(panels[i],document.getElementById(id)))
{var instance=OwnerControl.__instances[id];instance.initContext();}}}});OwnerControl.__requestManagerEventsInitialized=true;};OwnerControl.prototype.init=function(){this.initContext();};OwnerControl.prototype.initContext=function(){this._context=document.getElementById(this._clientId);};OwnerControl.prototype.identifyNode=function(node){if(!this._identifyNodes||node._wasIdentified)
return;for(var i=0;i<node.childNodes.length;i++)
{var child=node.childNodes[i];var el=child.getUI().getAnchor();$(el).attr("id",(this._clientId+"_"+child.id));}
node._wasIdentified=true;};OwnerControl.prototype.createDialog=function(){var self=this;var root=new Ext.tree.AsyncTreeNode({text:"Root",id:"root",expanded:true,listeners:{"expand":function(node){self.identifyNode(node);}},children:[{id:"user",text:OwnerControlResources.OwnerControl_OwnerType_User,cls:"owner-type-user-container",singleClickExpand:true,expanded:false,listeners:{"expand":function(node){self.identifyNode(node);}}},{id:"team",text:OwnerControlResources.OwnerControl_OwnerType_Team,cls:"owner-type-team-container",singleClickExpand:true,listeners:{"expand":function(node){self.identifyNode(node);}}},{id:"system",text:OwnerControlResources.OwnerControl_OwnerType_System,cls:"owner-type-system-container",singleClickExpand:true,listeners:{"expand":function(node){self.identifyNode(node);}}}]});var loader=new Ext.tree.TreeLoader({url:"slxdata.ashx/slx/crm/-/owners/{0}",requestMethod:"GET"});loader.on("beforeload",function(treeLoader,node){treeLoader.formatUrl=treeLoader.formatUrl||treeLoader.url;treeLoader.url=String.format(treeLoader.formatUrl,node.id);});var tree=new Ext.tree.TreePanel({id:this._clientId+"_tree",root:root,rootVisible:false,containerScroll:true,autoScroll:true,animate:false,frame:false,stateful:false,loader:loader,border:false});var panel=new Ext.Panel({id:this._clientId+"_container",layout:"fit",border:false,stateful:false,items:tree});var dialog=new Ext.Window({id:this._clientId+"_window",title:OwnerControlResources.OwnerControl_Header,cls:"lookup-dialog",layout:"border",closeAction:"hide",plain:true,height:400,width:300,stateful:false,constrain:true,modal:true,items:[{region:"center",margins:"0 0 0 0",border:false,layout:"fit",id:this._clientId+"_layout_center",items:panel}],buttonAlign:"right",buttons:[{id:this._clientId+"_ok",text:GetResourceValue(OwnerControlResources.OwnerControl_Button_Ok,"OK"),handler:function(){var node=tree.getSelectionModel().getSelectedNode();if(!node||!node.isLeaf())
{Ext.Msg.alert("",OwnerControlResources.SlxOwnerControl_OwnerType_NoRecordSelected);return;}
self.close();self.setResult(node.id,node.text);}},{id:this._clientId+"_cancel",text:GetResourceValue(OwnerControlResources.OwnerControl_Button_Cancel,"Cancel"),handler:function(){self.close();}}],tools:[{id:"help",handler:function(evt,toolEl,panel){if(self._helpLink&&self._helpLink.url)
window.open(self._helpLink.url,(self._helpLink.target||"help"));}}]});dialog.on("show",function(win){$(document).bind("keyup.OwnerControl",function(evt){switch(evt.keyCode){case 13:case 32:var node=tree.getSelectionModel().getSelectedNode();if(node&&!node.isExpanded())
node.expand();break;}});$(document).bind("keypress.OwnerControl",function(evt){var key=evt.charCode||evt.keyCode;var text=String.fromCharCode(key);if(self._typeAheadTimeout)
clearTimeout(self._typeAheadTimeout);self._typeAheadTimeout=setTimeout(function(){self._typeAheadText=false;},1500);if(self._typeAheadText)
self._typeAheadText=text=self._typeAheadText+text;else
self._typeAheadText=text;var node=tree.getSelectionModel().getSelectedNode();if(node)
{if(node.parentNode&&(node.isLeaf()||!node.isExpanded()))
node=node.parentNode;}
else
{node=root;}
var match=self.search(node,new RegExp("^"+text,"i"));if(match)
{match.select();return false;}});if(typeof idLookup!="undefined")idLookup("lookup-dialog");});dialog.on("hide",function(win){$(document).unbind("keypress.OwnerControl");$(document).unbind("keyup.OwnerControl");});tree.on("dblclick",function(node,evt){if(!node||!node.isLeaf())
return;self.close();self.setResult(node.id,node.text);});this._dialog=dialog;this._tree=tree;};OwnerControl.prototype.search=function(node,expr){if(node)
{if(node.id!="root"&&expr.test(node.text))
return node;if(node.isExpanded())
{for(var i=0;i<node.childNodes.length;i++)
{var child=node.childNodes[i];var match=false;if(child.isLeaf())
{if(expr.test(child.text))
return child;}
else if((match=this.search(child,expr)))
return match;}}}
return false;};OwnerControl.prototype.show=function(){var self=this;if(!this._dialog)
this.createDialog();this._dialog.doLayout();this._dialog.show();this._dialog.center();this.fireEvent('open',this);};OwnerControl.prototype.close=function(){if(this._dialog)
this._dialog.hide();};OwnerControl.prototype.setResult=function(id,text){this._result={id:id,text:text};var textEl=$("#"+this._textClientId,this._context).get(0);var valueEl=$("#"+this._valueClientId,this._context).get(0);textEl.value=text;valueEl.value=id;this.invokeChangeEvent(textEl);this.fireEvent('change',this);if(this._autoPostBack)
__doPostBack(this._clientId,'');};OwnerControl.prototype.invokeChangeEvent=function(el){if(document.createEvent)
{var evt=document.createEvent('HTMLEvents');evt.initEvent('change',true,true);el.dispatchEvent(evt);}
else
{el.fireEvent('onchange');}};function OwnerPanel(clientId,autoPostBack)
{this.ClientId=clientId;this.OwnerDivId=clientId+"_outerDiv";this.OwnerTypeId=clientId+"_OwnerType";this.OwnerTextId=clientId+"_LookupText";this.OwnerValueId=clientId+"_LookupResult";this.ResultDivId=clientId+"_Results";this.OwnerListId=clientId+"_OwnerList";this.AutoPostBack=autoPostBack;this.LookupValue="";this.DisplayValue="";this.onChange=new YAHOO.util.CustomEvent("change",this);this.panel=null;}
function OwnerPanel_CanShow()
{var inPostBack=false;if(Sys)
{var prm=Sys.WebForms.PageRequestManager.getInstance();inPostBack=prm.get_isInAsyncPostBack();}
if(!inPostBack)
{return true;}
else
{var id=this.ClientId+"_obj";var handler=function()
{window[id].Show('');}
Sage.SyncExec.call(handler);return false;}}
function OwnerPanel_Show()
{if(this.CanShow())
{if((this.panel==null)||(this.panel.element.parentNode==null))
{var lookup=document.getElementById(this.OwnerDivId);lookup.style.display="block";this.panel=new YAHOO.widget.Panel(this.OwnerDivId,{visible:false,width:"305px",fixedcenter:true,constraintoviewport:true,underlay:"shadow",draggable:true,modal:false});this.panel.render();}
this.panel.show();var ownerType=document.getElementById(this.OwnerTypeId);var list=document.getElementById(this.OwnerListId);if(list.options.length<1)
{var type=ownerType.selectedIndex;if(type==-1){type=0;}
var vURL="SLXOwnerListHandler.aspx?ownertype="+type;if(typeof(xmlhttp)=="undefined"){xmlhttp=YAHOO.util.Connect.createXhrObject().conn;}
xmlhttp.open("GET",vURL,false);xmlhttp.send(null);var results=xmlhttp.responseText;var items=results.split("|");for(var i=0;i<items.length;i++)
{if(items[i]=="")continue;var parts=items[i].split("*");var oOption=document.createElement("OPTION");list.options.add(oOption);if(parts[0].charAt(0)=='@')
{parts[0]=parts[0].substr(1);oOption.selected=true;}
oOption.innerHTML=parts[1];oOption.value=parts[0];}}}}
function OwnerPanel_PerformLookup()
{var ownerType=document.getElementById(this.OwnerTypeId);var list=document.getElementById(this.OwnerListId);for(var i=list.options.length-1;i>=0;i--)
{list.options[i]=null;}
var type=ownerType.selectedIndex;if(type==-1){type=0;}
var vURL="SLXOwnerListHandler.aspx?ownertype="+type;if(typeof(xmlhttp)=="undefined"){xmlhttp=YAHOO.util.Connect.createXhrObject().conn;}
xmlhttp.open("GET",vURL,false);xmlhttp.send(null);var results=xmlhttp.responseText;if(results=="NOTAUTHENTICATED")
{window.location.reload(true);return;}
var items=results.split("|");for(var i=0;i<items.length;i++)
{if(items[i]=="")continue;var parts=items[i].split("*");var oOption=document.createElement("OPTION");list.options.add(oOption);if(parts[0].charAt(0)=='@')
{parts[0]=parts[0].substr(1);oOption.selected=true;}
oOption.innerHTML=parts[1];oOption.value=parts[0];}}
function OwnerPanel_Close()
{this.panel.hide();}
function OwnerPanel_Ok()
{this.panel.hide();var list=document.getElementById(this.OwnerListId);try
{this.LookupValue=list.options[list.selectedIndex].value;}
catch(e)
{Ext.Msg.alert("",OwnerControlResources.SlxOwnerControl_OwnerType_NoRecordSelected);return false;}
this.DisplayValue=list.options[list.selectedIndex].innerHTML;var ownerText=document.getElementById(this.OwnerTextId);var ownerValue=document.getElementById(this.OwnerValueId);ownerText.value=this.DisplayValue;ownerValue.value=this.LookupValue;this.onChange.fire(this);this.InvokeChangeEvent(ownerText);if(this.AutoPostBack)
{if(Sys)
{Sys.WebForms.PageRequestManager.getInstance()._doPostBack(this.ClientId,null);}
else
{document.forms(0).submit();}}}
function OwnerPanel_getVal()
{return this.LookupValue;}
function OwnerPanel_setVal(key,display)
{this.LookupValue=key;this.DisplayValue=display;var lookupText=document.getElementById(this.LookupTextId);lookupText.value=this.DisplayValue;}
function OwnerPanel_GetOwnerTypeParam()
{var ownerType=document.getElementById(this.OwnerTypeId);var arg=-1;if(ownerType.options.length>0)
{arg=ownerType.selectedIndex;}
return arg;}
function OwnerPanel_InvokeChangeEvent(cntrl)
{if(document.createEvent)
{var evObj=document.createEvent('HTMLEvents');evObj.initEvent('change',true,true);cntrl.dispatchEvent(evObj);}
else
{cntrl.fireEvent('onchange');}}
OwnerPanel.prototype.CanShow=OwnerPanel_CanShow;OwnerPanel.prototype.Show=OwnerPanel_Show;OwnerPanel.prototype.Close=OwnerPanel_Close;OwnerPanel.prototype.PerformLookup=OwnerPanel_PerformLookup;OwnerPanel.prototype.GetOwnerTypeParam=OwnerPanel_GetOwnerTypeParam;OwnerPanel.prototype.Ok=OwnerPanel_Ok;OwnerPanel.prototype.getVal=OwnerPanel_getVal;OwnerPanel.prototype.setVal=OwnerPanel_setVal;OwnerPanel.prototype.InvokeChangeEvent=OwnerPanel_InvokeChangeEvent;

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

Phone=function(clientID,phone,autoPostBack)
{this.ClientId=clientID;this.phoneID=clientID+"_phoneText";this.phone=new phoneProp(phone,this);this.AutoPostBack=autoPostBack;var elem=document.getElementById(this.phoneID);if(elem!=null)
{elem.value=FormatPhoneNumber(phone);}}
function Phone_FormatPhone(val)
{var elem=document.getElementById(this.phoneID);elem.value=FormatPhoneNumber(val);}
function FormatPhoneNumber(val)
{if((val.length==0)||(val.charAt(0)=="0"))
return val;var ext="";var temp=val;var vTempExt="";var extFound=false;var isInter=false;var extAtBegin=false;var i=-1;if(val.charAt(0)=="+")
{isInter=true;}
val.replace("/\D+/g.","");i=val.indexOf("ext");if(i>-1)
{ext=val.substring(i);temp=val.substring(0,value.length-ext.length)
vTempExt=ext.substring(3,ext.length);ext=val.substring(i,3);extFound=true;if(i==2)
{extAtBegin=true;}}
else
{i=findToken(val,"x");if(i>-1)
{ext=val.substring(i);vTempExt=ext.substring(1,ext.length);j=findToken(vTempExt,"x");if(j>-1)
{extFound=false;ext="";i=-1;}
else
{temp=val.substring(0,val.length-ext.length)
ext="x";extFound=true;}
if(i==0)
{extAtBegin=true;}}}
if(extFound)
{if(vTempExt.length>=1)
{if(containsAlphaChar(vTempExt))
{ext=ext+convertPhoneLetters(vTempExt);}
else
{ext=ext+vTempExt;}}}
if(extAtBegin)
{return ext;}
else
{val=convertPhoneLetters(temp);var result=val;if(val.length==10)
{result="("+val.substr(0,3)+") "+val.substr(3,3)+"-"+val.substr(6,4);}
if(val.length==7)
{result=val.substr(0,3)+"-"+val.substr(3,4);}
return result+ext;}}
function findToken(inString,strToken)
{inString=inString.toUpperCase();strToken=strToken.toUpperCase();for(i=0;i<inString.length;i++)
{if(inString.charAt(i)==strToken)
{return i;}}
return-1;}
function convertPhoneLetters(inString)
{inString=inString.toUpperCase();var retVal="";for(i=0;i<inString.length;i++)
{switch(inString.charAt(i))
{case("A"):case("B"):case("C"):retVal+="2";break;case("D"):case("E"):case("F"):retVal+="3";break;case("G"):case("H"):case("I"):retVal+="4";break;case("J"):case("K"):case("L"):retVal+="5";break;case("M"):case("N"):case("O"):retVal+="6";break;case("P"):case("Q"):case("R"):case("S"):retVal+="7";break;case("T"):case("U"):case("V"):retVal+="8";break;case("W"):case("X"):case("Y"):case("Z"):retVal+="9";break;default:retVal+=inString.charAt(i);break;}}
return retVal;}
function containsAlphaChar(inString)
{for(i=0;i<inString.length;i++)
{chr=inString.charAt(i);if(((chr>="a")&&(chr<="z"))||((chr>="A")&&(chr<="Z")))
return true;}
return false;}
function Phone_FormatPhoneChange()
{var elem=document.getElementById(this.phoneID);this.phone.set(elem.value);this.phone.onChange.fire();if(this.AutoPostBack)
{if(Sys)
{Sys.WebForms.PageRequestManager.getInstance()._doPostBack(this.ClientId,null);}
else
{document.forms(0).submit();}}}
phoneProp=function(val,parentElem)
{this.parentElement=parentElem;this.value=val;this.onChange=new YAHOO.util.CustomEvent("change",this);}
phoneProp.prototype.set=function(val)
{this.value=val;this.parentElement.FormatPhone(val);}
phoneProp.prototype.get=function()
{return this.value;}
Phone.prototype.FormatPhone=Phone_FormatPhone;Phone.prototype.FormatPhoneChange=Phone_FormatPhoneChange;

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

String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"");}
var slxdatagrid=function(gridID){this.gridID=gridID;this.containerId=gridID+"_container";this.expandAllCell=null;this.expandable=false;this.table=null;this.expandclassname="slxgridrowexpand";this.expandnoiconclassname="slxgridrowexpandnoicon";this.collapseclassname="slxgridrowcollapse";this.collapsenoiconclassname="slxgridrowcollapsenoicon";this.contentdivclassname="cellcontents";this.pagerclassname="gridPager";this.collapsedheight="16px";this.wids=new Array();this.key="";this.__idIndexer=0;this.HeaderRow=null;var tbl=document.getElementById(gridID);if(tbl){this.table=tbl;if(tbl.getAttribute("key"))
this.key=tbl.getAttribute("key");if((tbl.rows.length>0)&&(tbl.rows[0].cells.length>0)){var cell=null;if(YAHOO.util.Dom.hasClass(tbl.rows[0],this.pagerclassname))
cell=tbl.rows[1].cells[0];else
cell=tbl.rows[0].cells[0];this.expandable=(YAHOO.util.Dom.hasClass(cell,this.expandclassname)||YAHOO.util.Dom.hasClass(cell,this.expandnoiconclassname)||YAHOO.util.Dom.hasClass(cell,this.collapseclassname)||YAHOO.util.Dom.hasClass(cell,this.collapsenoiconclassname));if(this.expandable){this.expandAllCell=cell;YAHOO.util.Event.removeListener(cell,"click",this.expandCollapseAll);YAHOO.util.Event.addListener(cell,"click",this.expandCollapseAll,this,true);}}
this.setHeaderRow();this.initColWidths();this.setSortIDs();this.attachResizeEvent();}}
slxdatagrid.prototype.GridKey=function(){return this.gridID+this.key;}
slxdatagrid.prototype.dispose=function(){this.table=null;this.expandAllCell=null;}
slxdatagrid.prototype.getColIndexStart=function(){return(this.expandable)?1:0;}
slxdatagrid.prototype.setSortIDs=function(){if((this.table.rows.length>0)&&(this.HeaderRow)){var idx=(this.table.id.lastIndexOf("_")>0)?this.table.id.lastIndexOf("_")+1:0;var idRoot=this.table.id.substring(idx);for(var i=0;i<this.HeaderRow.cells.length;i++){var links=YAHOO.util.Dom.getElementsBy(this.returnTrue,"A",this.HeaderRow.cells[i]);for(var j=0;j<links.length;j++){links[j].id=idRoot+this.__idIndexer++;}}}}
slxdatagrid.prototype.returnTrue=function(){return true;}
slxdatagrid.prototype.expandCollapseAll=function(){if(YAHOO.util.Dom.hasClass(this.expandAllCell,this.expandclassname)){for(var i=1;i<this.table.rows.length;i++){this.expandRow(this.table.rows[i]);}
YAHOO.util.Dom.removeClass(this.expandAllCell,this.expandclassname);YAHOO.util.Dom.addClass(this.expandAllCell,this.collapseclassname);}else if(YAHOO.util.Dom.hasClass(this.expandAllCell,this.collapseclassname)){for(var i=1;i<this.table.rows.length;i++){this.collapseRow(this.table.rows[i]);}
YAHOO.util.Dom.removeClass(this.expandAllCell,this.collapseclassname);YAHOO.util.Dom.addClass(this.expandAllCell,this.expandclassname);}}
function expandCollapseRow(){var row=this.gridobj.getRow(this.idx);this.gridobj.toggleRow(row);}
slxdatagrid.prototype.toggleRow=function(row){if(row){if(YAHOO.util.Dom.hasClass(row.cells[0],this.expandclassname)||YAHOO.util.Dom.hasClass(row.cells[0],this.expandnoiconclassname)){this.expandRow(row);}else if(YAHOO.util.Dom.hasClass(row.cells[0],this.collapseclassname)||YAHOO.util.Dom.hasClass(row.cells[0],this.collapsenoiconclassname)){this.collapseRow(row);}}}
slxdatagrid.prototype.expandRow=function(row){if(row){if(YAHOO.util.Dom.hasClass(row.cells[0],this.collapseclassname)||(!YAHOO.util.Dom.hasClass(row.cells[0],this.expandclassname)&&!YAHOO.util.Dom.hasClass(row.cells[0],this.expandnoiconclassname))){return;}
var collapseH=this.collapsedheight.replace("px","");for(var i=this.getColIndexStart();i<row.cells.length;i++){cell=row.cells[i];if(cell.childNodes[0]){if(YAHOO.util.Dom.hasClass(cell.childNodes[0],this.contentdivclassname)){if(cell.childNodes[0].scrollHeight>collapseH){YAHOO.util.Dom.setStyle(cell.childNodes[0],"height","100%");}}}}
var expandoCell=row.cells[0];if(YAHOO.util.Dom.hasClass(row.cells[0],this.expandclassname))
YAHOO.util.Dom.replaceClass(expandoCell,this.expandclassname,this.collapseclassname);else
YAHOO.util.Dom.replaceClass(expandoCell,this.expandnoiconclassname,this.collapsenoiconclassname);}}
slxdatagrid.prototype.collapseRow=function(row){if(row){if(YAHOO.util.Dom.hasClass(row.cells[0],this.expandclassname)||(!YAHOO.util.Dom.hasClass(row.cells[0],this.collapseclassname)&&!YAHOO.util.Dom.hasClass(row.cells[0],this.collapsenoiconclassname))){return;}
var collapseH=this.collapsedheight.replace("px","");var setH=collapseH;for(var i=this.getColIndexStart();i<row.cells.length;i++){cell=row.cells[i];if(cell.childNodes[0]){if(YAHOO.util.Dom.hasClass(cell.childNodes[0],this.contentdivclassname)){setH=(collapseH<cell.childNodes[0].scrollHeight)?collapseH:cell.childNodes[0].scrollHeight;YAHOO.util.Dom.setStyle(cell.childNodes[0],"height",setH+"px");}}}
var expandoCell=row.cells[0];if(YAHOO.util.Dom.hasClass(row.cells[0],this.collapseclassname))
YAHOO.util.Dom.replaceClass(expandoCell,this.collapseclassname,this.expandclassname);else
YAHOO.util.Dom.replaceClass(expandoCell,this.collapsenoiconclassname,this.expandnoiconclassname);}}
slxdatagrid.prototype.getRow=function(idx){if((this.table)&&(this.table.rows.length>idx)){return this.table.rows[idx];}
return null;}
slxdatagrid.prototype.initColWidths=function(){if(this.HeaderRow){if(this.getWidthsFromCookie()){if(this.expandable){this.setWidth(0,"20",false);}
for(var i=this.getColIndexStart();i<this.HeaderRow.cells.length;i++){this.setWidth(i,this.wids[i],false);}}else{this.fillSpace();}}}
slxdatagrid.prototype.fillSpace=function(){if(this.HeaderRow){if(this.expandable){this.setWidth(0,"20",false);}
var cont=YAHOO.util.Dom.get(this.containerId);var container=YAHOO.util.Region.getRegion(cont);var containerW=container.right-container.left;var tbl=YAHOO.util.Region.getRegion(this.table);this.doResize();var tblW=tbl.right-tbl.left;var spaceWidth=container.right-tbl.right;var divCols=this.HeaderRow.cells.length;if(this.expandable){divCols--;}
var increaseBy=Math.round(spaceWidth/divCols);increaseBy--;this.getCurrentWidths();var start=(this.expandable)?1:0;if(increaseBy>3){for(var i=start;i<this.HeaderRow.cells.length;i++){var newtableregion=YAHOO.util.Region.getRegion(this.table);if(newtableregion.right>container.right-increaseBy){increaseBy=container.right-newtableregion.right-2;}
if(newtableregion.right>container.right-4){return;}
var newWidth=this.wids[i]+increaseBy;if(this.wids[i]){this.setWidth(i,newWidth,false);if(cont.scrollWidth>containerW){this.setWidth(i,newWidth-(cont.scrollWidth-containerW),false);return;}
newtableregion=YAHOO.util.Region.getRegion(this.table);var tblWidth=newtableregion.right-newtableregion.left-2;if(tblWidth>=containerW){var newNewWidth=newWidth-(tblWidth-containerW+5);this.setWidth(i,newNewWidth,false);return;}}}}}}
slxdatagrid.prototype.getCurrentWidths=function(){if(this.HeaderRow){this.wids=new Array();for(var i=0;i<this.HeaderRow.cells.length;i++){this.wids.push(this.getColumnWidth(i));}}}
slxdatagrid.prototype.getColumnWidth=function(colIndex){if(this.HeaderRow){if(this.HeaderRow.cells[colIndex]){var region=YAHOO.util.Region.getRegion(this.HeaderRow.cells[colIndex]);return region.right-region.left;}}
return 0;}
slxdatagrid.prototype.getWidthsFromCookie=function(){var widthcookie=getCookie("GRIDCW");if(widthcookie){var grids=widthcookie.split("||");for(var i=0;i<grids.length;i++){var widthdef=grids[i].split("!");if(widthdef[0]==this.GridKey()){if(widthdef[1]){this.wids=widthdef[1].split(":");return true;}}}}
return false;}
slxdatagrid.prototype.setWidthsToCookie=function(){this.getCurrentWidths();var widthcookie=getCookie("GRIDCW");if(widthcookie){var grids=widthcookie.split("||");widthcookie="";var needtoadd=true;for(var i=0;i<grids.length;i++){var widthdef=grids[i].split("!");if(widthdef[0]==this.GridKey()){widthdef[1]=this.generateWidthCookieString();needtoadd=false;}
widthcookie+=(i>0)?"||":"";widthcookie+=widthdef[0]+"!"+widthdef[1];}
if(needtoadd){widthcookie+=(widthcookie!="")?"||":"";widthcookie+=this.GridKey()+"!"+this.generateWidthCookieString();}}else{widthcookie=this.GridKey()+"!"+this.generateWidthCookieString();}
document.cookie="GRIDCW="+widthcookie;}
function getCookie(name){var cookies=document.cookie.split(";");for(var i=0;i<cookies.length;i++){var cookie=cookies[i].split("=");if(cookie.length>0){if(cookie[0].trim()==name){if(cookie[1]){return cookie[1];}}}}
return null;}
slxdatagrid.prototype.generateWidthCookieString=function(){var str="";for(var i=0;i<this.wids.length;i++){str+=(i>0)?":":"";var num=this.wids[i];num=Math.round(num);str+=num;}
return str;}
slxdatagrid.prototype.setWidth=function(colIdx,width,persist){if(!isNaN(width)){width=width+"px";}
if(this.HeaderRow){for(var r=0;r<this.table.rows.length;r++){if(this.table.rows[r].cells[colIdx]){YAHOO.util.Dom.setStyle(this.table.rows[r].cells[colIdx],"width",width);}}
if(persist){this.setWidthsToCookie();}}}
slxdatagrid.prototype.setHeaderRow=function(){for(var r=0;r<this.table.rows.length;r++){if(this.table.rows[r].getAttribute("HeaderRow")){this.HeaderRow=this.table.rows[r];return;}}}
slxdatagridcolumn=function(headerColId,datagrid,colIdx,config){if(headerColId){this.datagrid=datagrid;this.colIndex=colIdx;this.headerColId=headerColId;this.init(headerColId,headerColId,config);this.handleElId=headerColId;this.setHandleElId(headerColId);var elem=YAHOO.util.Dom.get(headerColId);if(elem){YAHOO.util.Event.removeListener(elem,"mouseover",this.onMouse);YAHOO.util.Event.addListener(elem,"mouseover",this.onMouse,this,true);YAHOO.util.Event.removeListener(elem,"mousemove",this.onMouse);YAHOO.util.Event.addListener(elem,"mousemove",this.onMouse,this,true);YAHOO.util.Event.removeListener(elem,"mouseout",this.onMouseOut);YAHOO.util.Event.addListener(elem,"mouseout",this.onMouseOut,this,true);}}}
YAHOO.extend(slxdatagridcolumn,YAHOO.util.DragDrop);slxdatagridcolumn.prototype.dispose=function(){this.datagrid=null;var elem=YAHOO.util.Dom.get(this.headerColId);if(elem){YAHOO.util.Event.purgeElement(elem);}}
slxdatagridcolumn.prototype.onMouseDown=function(e){var panel=this.getEl();this.startWidth=panel.offsetWidth;this.startPos=YAHOO.util.Event.getPageX(e);}
slxdatagridcolumn.prototype.onDrag=function(e){var newPos=YAHOO.util.Event.getPageX(e);var offsetX=newPos-this.startPos;var newWidth=Math.max(this.startWidth+offsetX,30);var panel=this.getEl();panel.style.width=newWidth+"px";this.datagrid.setWidth(this.colIndex,newWidth+"px",true);}
slxdatagridcolumn.prototype.onMouse=function(e){eventX=YAHOO.util.Event.getPageX(e);var elem=YAHOO.util.Dom.get(this.headerColId);var region=YAHOO.util.Region.getRegion(elem);hotX=region.right-10;if(eventX>hotX){YAHOO.util.Dom.setStyle(this.headerColId,"cursor","col-resize");}else{YAHOO.util.Dom.setStyle(this.headerColId,"cursor","");}}
slxdatagridcolumn.prototype.onMouseOut=function(e){YAHOO.util.Dom.setStyle(this.headerColId,"cursor","");}
slxdatagrid.prototype.doResize=function(){var cont=document.getElementById(this.containerId);var container=YAHOO.util.Region.getRegion(cont);var tbl=YAHOO.util.Region.getRegion(this.table);if((tbl.right-tbl.left)>(container.right-container.left)){if(cont.style.height==""){var tblheight=tbl.bottom-tbl.top;document.getElementById(this.containerId).style.height=(tblheight+20)+"px";}}}
slxdatagrid.prototype.attachResizeEvent=function(){var viewport=window["mainViewport"];var panel=(viewport?viewport.findById("center_panel_center"):false);if(panel){panel.on("resize",function(panel,adjWidth,adjHeight,width,height){this.doResize();},this);}}

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

var resizeTimerID=null;function Timeline_onResize(){if(resizeTimerID==null){resizeTimerID=window.setTimeout(function(){resizeTimerID=null;tl.layout();},500);}}
function Timeline_init(timeline_object,tab){var method=timeline_object.onLoad;var delay=750;$("#show_"+tab).click(function(){window.setTimeout(method,delay);});$("#more_"+tab).click(function(){window.setTimeout(method,delay);});if($("#more_"+tab).length>0){$("#show_More").click(function(){window.setTimeout(method,delay);});}
$(".tws-main-tab-buttons").click(function(){closeTimelineBubble();});$(".tws-more-tab-buttons-container").click(function(){closeTimelineBubble();});if(document.body.addEventListener){document.body.addEventListener('onresize',Timeline_onResize,false);}else if(document.body.attachEvent){document.body.attachEvent('onresize',Timeline_onResize);}
var svc=Sage.Services.getService("GroupManagerService");if(svc){svc.addListener(Sage.GroupManagerService.CURRENT_GROUP_POSITION_CHANGED,function(sender,evt){method();});}
if(document.getElementById(timeline_object.ParentElement)!=null){if(document.getElementById(timeline_object.ParentElement).hasChildNodes()){method();}else{window.setTimeout(method,delay);}}
$(document).ready(function(){Sage.DialogWorkspace.__instances['ctl00_DialogWorkspace'].on('open',closeTimelineBubble);});}
function closeTimelineBubble(){SimileAjax.WindowManager.popAllLayers();}
function Timeline_RecalculateHeight(){$("div.timeline-container").each(function(i,elem){var container=elem;if(container.hasChildNodes()&&(container.clientHeight>0)){var largest=(container.clientHeight>0)?container.clientHeight-55:300-55;var changed=false;var bands=$(".timeline-band-0 .timeline-band-events .timeline-band-layer-inner");for(var i=0;i<bands.length;i++){var div=bands[i];if(div&&(div.lastChild)){for(var j=0;j<div.childNodes.length;j++){if(div.childNodes[j].offsetTop>largest){largest=div.childNodes[j].offsetTop;changed=true;}}}}
if(changed){var navbandheight=$(".timeline-band-1")[0].style.height;container.style.height=parseInt(largest+parseInt(navbandheight,10)+30,10)+"px";$(".timeline-band-0")[0].style.height=parseInt(largest+30,10)+"px";$(".timeline-band-1")[0].style.top=parseInt(largest+30,10)+"px";$(".timeline-band-1")[0].style.height=navbandheight;if(container.parent)
container.parent.style.height=container.style.height;}
window.setTimeout(function(){Timeline_RecalculateHeight();},2000);}});}

function Timezone_populatelist(controlId)
{var sel=$("#"+controlId+" #TimezoneList")[0];if(sel.options.length==1){$.ajax({type:"GET",url:"slxdata.ashx/slx/crm/-/timezones/p",success:function(list){sel.options.length=0;for(var i=0;i<list.length;i++){var opt=new Option(list[i].Displayname,list[i].Keyname);sel.options[sel.options.length]=opt;if(list[i].Keyname==$("#"+controlId).find('input').filter('[@type=hidden]')[0].value)
sel.selectedIndex=i;}
sel.onblur=function(){$("#"+controlId).find('input').filter('[@type=hidden]')[0].value=sel.options[sel.selectedIndex].value;};},dataType:"json"});return false;}}

function groupmanager(){this.CurrentUserID="";this.SortCol=-1;this.SortDir="ASC";this.CurrentMode="CONTACT";this.GMUrl="SLXGroupBuilder.aspx?method=";this.GroupXML="";this.ConfirmDeleteMessage="Are you sure you want to delete the current group?";this.InvalidSortStringMessage="Error: Invalid sort string - ";this.InvalidConditionStringMessage="Error: Invalid condition string - ";this.InvalidLayoutConditionStringMessage="Error: Invalid layout string - ";}
function XBrowserXmlHttp(){this.XmlHttp=YAHOO.util.Connect.createXhrObject();}
var xmlHttpObject=new XBrowserXmlHttp();var xmlhttp=xmlHttpObject.XmlHttp.conn;function getFromServer(vURL){xmlhttp.open("GET",vURL,false);xmlhttp.send("dummypostdata");var respText=xmlhttp.responseText;if(xmlhttp.responseText=="NOTAUTHENTICATED"){window.location.reload(true);return;}
if((respText.indexOf('Error')>-1)&&(respText.indexOf('Error')<3)){alert(respText);}
return respText;}
function postToServer(vURL,aData){xmlhttp.open("POST",vURL,false);xmlhttp.send(aData)
var respText=xmlhttp.responseText;if(xmlhttp.responseText=="NOTAUTHENTICATED"){window.location.reload(true);return;}
if((respText.indexOf('Error')>-1)&&(respText.indexOf('Error')<3)){alert(respText);}
return respText;}
function groupmanager_CreateGroup(strMode){if(strMode=='')
strMode=getCurrentGroupInfo().Family;var vURL="QueryBuilderMain.aspx?mode="+strMode;var width=Ext.getBody().getViewSize().width*.9;window.open(vURL,"GroupViewer",String.format("resizable=yes,centerscreen=yes,width={0},height=565,status=no,toolbar=no,scrollbars=yes",width));}
function groupmanager_DeleteGroup(strGroupID){if(strGroupID=='')
strGroupID=getCurrentGroupInfo().Id;var d=new Date();var time=d.getTime();if(confirm(this.ConfirmDeleteMessage)){getFromServer(this.GMUrl+'DeleteGroup&gid='+strGroupID+"&time="+time);var url=document.location.href.replace("#","");if(url.indexOf("?")>-1){var halves=url.split("?");url=halves[0];}
document.location=url;}}
function groupmanager_EditGroup(strGroupID){if(strGroupID=='')
strGroupID=getCurrentGroupInfo().Id;var vURL='QueryBuilderMain.aspx?gid='+strGroupID;vURL+='&mode='+this.CurrentMode;var width=Ext.getBody().getViewSize().width*.9;window.open(vURL,"EditGroup",String.format("resizable=yes,centerscreen=yes,width={0},height=565,status=no,toolbar=no,scrollbars=yes",width));}
function groupmanager_CopyGroup(strGroupID){if(strGroupID=='')
strGroupID=getCurrentGroupInfo().Id;var vURL='QueryBuilderMain.aspx?gid='+strGroupID+'&action=copy';vURL+='&mode='+this.CurrentMode;var width=Ext.getBody().getViewSize().width*.9;window.open(vURL,"EditGroup",String.format("resizable=yes,centerscreen=yes,width={0},height=565,status=no,toolbar=no,scrollbars=yes",width));}
function groupmanager_ListGroupsAsSelect(strFamily){if(strFamily=='')
strFamily=getCurrentGroupInfo().Family;var vURL=this.GMUrl+"GetGroupList&entity="+strFamily;var response=getFromServer(vURL);var htmlOption;var xmlDoc=getXMLDoc(response);if(xmlDoc){var groupInfos=xmlDoc.getElementsByTagName('GroupInfo');for(var i=0;i<groupInfos.length;i++){htmlOption+="<option value = '"+groupInfos[i].getElementsByTagName("GroupID")[0].firstChild.nodeValue+"'>"
+groupInfos[i].getElementsByTagName("DisplayName")[0].firstChild.nodeValue
+"</option>";}
return htmlOption;}
return"";}
function groupmanager_HideGroup(strGroupID){if(strGroupID=='')
strGroupID=getCurrentGroupInfo().Id;postToServer(this.GMUrl+'HideGroup&gid='+strGroupID,'');}
function groupmanager_UnHideGroup(strGroupID){if(strGroupID=='')
strGroupID=getCurrentGroupInfo().Id;getFromServer(this.GMUrl+'UnHideGroup&gid='+strGroupID);}
function groupmanager_ShowGroups(strTableName){if(strTableName=='')
strTableName=getCurrentGroupInfo().Family;var vURL='ShowGroups.aspx?tablename='+strTableName;window.open(vURL,"ShowGroups","resizable=yes,centerscreen=yes,width=800,height=565,status=no,toolbar=no,scrollbars=yes");}
function groupmanager_ShowGroupInViewer(strGroupID){if(strGroupID=='')
strGroupID=getCurrentGroupInfo().Id;var vURL="GroupViewer.aspx?gid="+strGroupID;window.open(vURL,"GroupViewer","resizable=yes,centerscreen=yes,width=800,height=600,status=no,toolbar=no,scrollbars=yes");}
function groupmanager_Count(strGroupID){if(strGroupID=='')
strGroupID=getCurrentGroupInfo().Id;return getFromServer(this.GMUrl+'Count&gid='+strGroupID);}
function groupmanager_CreateAdHocGroup(strGroups,strName,strFamily,strLayoutId){var vURL=this.GMUrl+'CreateAdHocGroup';vURL+='&name='+encodeURIComponent(strName);vURL+='&family='+strFamily;vURL+='&layoutid='+encodeURIComponent(strLayoutId);return postToServer(vURL,strGroups);}
function groupmanager_GetGroupSQL(strGroupID,strUseAliases,strParts)
{if(strGroupID=='')
strGroupID=getCurrentGroupInfo().Id;var vURL=this.GMUrl+'GetGroupSQL';vURL+='&gid='+strGroupID;if(strUseAliases!=null){if((strUseAliases=='true')||(strUseAliases=='false')){vURL+='&UseAliases='+strUseAliases;}}
if(strParts!=null){vURL+='&parts='+strParts;}
return getFromServer(vURL);}
function groupmanager_EditAdHocGroupAddMember(strGroupID,strItem){if(strGroupID=='')
strGroupID=getCurrentGroupInfo().Id;var x=getFromServer(this.GMUrl+'EditAdHocGroupAddMember&groupid='+strGroupID+'&entityid='+strItem);}
function groupmanager_EditAdHocGroupDeleteMember(strGroupID,strItem){if(strGroupID=='')
strGroupID=getCurrentGroupInfo().Id;var x=getFromServer(this.GMUrl+'EditAdHocGroupDeleteMember&groupid='+strGroupID+'&entityid='+strItem);}
function groupmanager_IsAdHoc(strGroupID){if(strGroupID=='')
strGroupID=getCurrentGroupInfo().Id;if(this.adHocGroupDictionary.hasOwnProperty(strGroupID)){return this.adHocGroupDictionary[strGroupID];}else{var isAH=getFromServer(this.GMUrl+'IsAdHoc&groupID='+strGroupID);this.adHocGroupDictionary[strGroupID]=isAH;return isAH;}}
function groupmanager_GetCurrentGroupID(strMode){alert('not implemented yet');}
function groupmanager_SetCurrentGroupID(strMode,strValue){alert('not implemented yet');}
function groupmanager_GetDefaultGroupID(strMode){alert('not implemented yet');}
function groupmanager_SetDefaultGroupID(strMode,strValue){alert('not implemented yet');}
function groupmanager_ExportGroup(strGroupID,strFileName){InitObjects();if(GMvb)
{GMvb.ExportGroup(strGroupID,strFileName);}}
function stringsToQueryXML(strMode,strLayouts,strConditions,strSorts){var lxml=layoutStrToXML(strLayouts);var cxml=conditionStrToXML(strConditions);var sxml=sortStrToXML(strSorts);var res='<SLXGroup>';res+='<plugindata id="" name="" family="';res+=strMode+'" type="8" system="F" userid="" />';res+='<groupid /><description />';res+=lxml;res+=cxml;res+=sxml;res+='<hiddenfields count="0" />';res+='<parameters count="0" />';res+='<selectsql><![CDATA[]]></selectsql>';res+='<fromsql><![CDATA[]]></fromsql>';res+='<wheresql><![CDATA[]]></wheresql>';res+='<orderbysql><![CDATA[]]></orderbysql>';res+='<valuesql><![CDATA[]]></valuesql>';res+='<maintable>';res+=strMode;res+='</maintable>';res+='<adhocgroup>false</adhocgroup>';res+='<adhocgroupid />';res+='<adddistinct>false</adddistinct>';res+='</SLXGroup>';return res;}
function conditionStrToXML(strConditions){var conds=strConditions.split(/\n/);var ret='<conditions>';for(var i=0;i<conds.length;i++){if(conds[i]!=''){var parts=conds[i].split('|');if(parts.length<10){alert(this.InvalidConditionStringMessage+conds[i]);return;}
var cond='<condition><datapath><![CDATA[';cond+=parts[1];cond+=']]></datapath><alias><![CDATA[';cond+=parts[2];cond+=']]></alias><displayname>';cond+=getFieldName(parts[1]);cond+='</displayname><displaypath>';cond+=getDisplayPath(parts[1]);cond+='</displaypath><fieldtype /><operator><![CDATA[';cond+=parts[3];cond+=']]></operator><value><![CDATA[';cond+=parts[4];cond+=']]></value><connector><![CDATA[';cond+=parts[5];cond+=']]></connector><casesens>';cond+=(parts[7]=='T')?'true':'false';cond+='</casesens><leftparens><![CDATA[';cond+=parts[8];cond+=']]></leftparens><rightparens><![CDATA[';cond+=parts[9];cond+=']]></rightparens><isliteral>';cond+=(parts[10]=='T')?'true':'false';cond+='</isliteral><isnegated>';cond+=(parts[11]=='T')?'true':'false';cond+='</isnegated></condition>';ret+=cond;}}
ret+='</conditions>';return ret}
function sortStrToXML(strSorts){var sorts=strSorts.split(/\n/);var ret='<sorts>';for(var i=0;i<sorts.length;i++){var parts=sorts[i].split('|');if(parts.length<4){alert(this.InvalidSortStringMessage+sorts[i]);return;}
var st='<sort><datapath><![CDATA[';st+=parts[1];st+=']]></datapath><alias><![CDATA[';st+=parts[2];st+=']]></alias><displayname>';st+=getFieldName(parts[1]);st+='</displayname><displaypath>';st+=getDisplayPath(parts[1]);st+='</displaypath><sortorder>';st+=parts[3];st+='</sortorder></sort>';ret+=st;}
ret+='</sorts>';return ret;}
function layoutStrToXML(strLayouts){var formatTypes=new Array();formatTypes.push('None');formatTypes.push('Fixed');formatTypes.push('Integer');formatTypes.push('DateTime');formatTypes.push('Percent');formatTypes.push('Currency');formatTypes.push('User');formatTypes.push('Phone');formatTypes.push('Owner');formatTypes.push('Boolean');formatTypes.push('Positive Integer');formatTypes.push('PickList Item');formatTypes.push('Time Zone');var aligns=new Array();aligns.push('Left');aligns.push('Right');aligns.push('Center');var layouts=strLayouts.split(/\n/);var ret='<layouts>';for(var i=0;i<layouts.length;i++){var parts=layouts[i].split('|');if(parts.length<9){alert(this.InvalidLayoutConditionStringMessage+layouts[i]);return;}
lXML='<layout><datapath><![CDATA[';lXML+=parts[1];lXML+=']]></datapath><alias><![CDATA[';lXML+=parts[2];lXML+=']]></alias><displayname>';lXML+=getFieldName(parts[1]);lXML+='</displayname><displaypath>';lXML+=getDisplayPath(parts[1]);lXML+='</displaypath><fieldtype />';lXML+='<caption><![CDATA[';lXML+=parts[3];lXML+=']]></caption><width>';lXML+=parts[4];lXML+='</width><formatstring><![CDATA[';lXML+=parts[5];lXML+=']]></formatstring><format>';var fmt=parts[6];fmt=(fmt=="")?0:fmt;lXML+=formatTypes[fmt];lXML+='</format><align>';var al=parts[7];al=(al=="")?0:al;lXML+=aligns[al];lXML+='</align><captalign>';al=parts[8];al=(al=="")?0:al;lXML+=aligns[al];lXML+='</captalign></layout>';ret+=lXML}
ret+='</layouts>';return ret;}
function getFieldName(aDataPath){var res="";if(aDataPath.indexOf('!')>-1){res=aDataPath.substr(aDataPath.lastIndexOf('!')+1);}else{res=aDataPath.substr(aDataPath.lastIndexOf(':')+1);}
return res;}
function getDisplayPath(aDataPath){var disp="";var isTable=true;var temp="";for(var i=0;i<aDataPath.length;i++){var chr=aDataPath.charAt(i);if(isTable){if((chr==":")||(chr=='!')){if(disp==""){disp=temp;}else{disp=disp+"."+temp;}
temp="";isTable=false;}else{temp+=chr;}}else if(chr=="."){isTable=true;}}
return disp;}
function groupmanager_ShareGroup(strGroupID){if(strGroupID=='')
strGroupID=getCurrentGroupInfo().Family;var vURL='ShareGroup.aspx?gid='+strGroupID;window.open(vURL,"ShareGroup","resizable=yes,centerscreen=yes,width=530,height=500,status=no,toolbar=no,scrollbars=yes");}
function groupmanager_GetGroupId(strGroupName){return getFromServer(this.GMUrl+'GetGroupId&name='+strGroupName);}
groupmanager.prototype.CreateGroup=groupmanager_CreateGroup;groupmanager.prototype.DeleteGroup=groupmanager_DeleteGroup;groupmanager.prototype.EditGroup=groupmanager_EditGroup;groupmanager.prototype.CopyGroup=groupmanager_CopyGroup;groupmanager.prototype.HideGroup=groupmanager_HideGroup;groupmanager.prototype.UnHideGroup=groupmanager_UnHideGroup;groupmanager.prototype.ShowGroups=groupmanager_ShowGroups;groupmanager.prototype.Count=groupmanager_Count;groupmanager.prototype.CreateAdHocGroup=groupmanager_CreateAdHocGroup;groupmanager.prototype.IsAdHoc=groupmanager_IsAdHoc;groupmanager.prototype.GetCurrentGroupID=groupmanager_GetCurrentGroupID;groupmanager.prototype.getCurrentGroupID=groupmanager_GetCurrentGroupID;groupmanager.prototype.SetCurrentGroupID=groupmanager_SetCurrentGroupID;groupmanager.prototype.GetDefaultGroupID=groupmanager_GetDefaultGroupID;groupmanager.prototype.SetDefaultGroupID=groupmanager_SetDefaultGroupID;groupmanager.prototype.ExportGroup=groupmanager_ExportGroup;groupmanager.prototype.ShareGroup=groupmanager_ShareGroup;groupmanager.prototype.ShowGroupInViewer=groupmanager_ShowGroupInViewer;groupmanager.prototype.ListGroupsAsSelect=groupmanager_ListGroupsAsSelect;groupmanager.prototype.GetGroupSQL=groupmanager_GetGroupSQL;groupmanager.prototype.GetGroupId=groupmanager_GetGroupId;var groupManager=new groupmanager();

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

Sage.GroupLookupManager=function(){this.win='';this.lookupIsOpen=false;this.withinGroup=false;this.conditions=[];this.lookupTpl=new Ext.XTemplate('<div id="entitylookupdiv_{index}" class="lookup-condition-row">','<label class="slxlabel" style="width:75px;clear:left;display:block;float:left;position:relative;padding:4px 0px 0px 0px"><tpl if="index &lt; 1">{addrowlabel}</tpl><tpl if="index &gt; 0">{hiderowlabel}</tpl></label>','<div style="padding-left:75px;position:relative;">','<select id="fieldnames_{index}" class="lookup-fieldnames-list" onchange="var mgr = Sage.Services.getService(\'GroupLookupManager\');if (mgr) { mgr.operatorChange({index}); }"><tpl for="fields"><option value="{fieldname}">{displayname}</option></tpl></select>','<select id="operators_{index}" class="lookup-operators-list"><tpl for="operators"><option value="{symbol}">{display}</option></tpl></select>','<input type="text" id="value_{index}" class="lookup-value" />','<tpl if="index &lt; 1"><img src="{addimgurl}" alt="{addimgalttext}" style="cursor:pointer;padding:0px 5px;" onclick="var mgr = Sage.Services.getService(\'GroupLookupManager\');if (mgr){mgr.addLookupCondition();}" />','<input type="button" id="lookupButton" onclick="var mgr = Sage.Services.getService(\'GroupLookupManager\');if (mgr) { mgr.doLookup(); }" value="{srchBtnCaption}" /></tpl>','<tpl if="index &gt; 0"><img src="{hideimgurl}" alt="{hideimgalttext}" style="cursor:pointer;padding:0px 5px;" onclick="var mgr = Sage.Services.getService(\'GroupLookupManager\');if (mgr) { mgr.removeLookupCondition({index});}" /></tpl>','</div></div>');if(window.lookupSetupObject){this.setupTemplateObj=window.lookupSetupObject;}else{window.setTimeout(this.getTemplateObj,100);}
gMgrSvc=Sage.Services.getService("GroupManagerService");gMgrSvc.addListener(Sage.GroupManagerService.CURRENT_GROUP_CHANGED,this.handleGroupChanged);}
Sage.GroupLookupManager.prototype.getTemplateObj=function(){var mgr=Sage.Services.getService("GroupLookupManager")
mgr.setupTemplateObj=(window.lookupSetupObject)?window.lookupSetupObject:{fields:[{fieldname:'',displayname:''}],operators:[{symbol:'sw',display:'Starting With'},{symbol:'like',display:'Contains'},{symbol:'eq',display:'Equal to'},{symbol:'ne',display:'Not Equal to'},{symbol:'lteq',display:'Equal or Less than'},{symbol:'gteq',display:'Equal or Greater than'},{symbol:'lt',display:'Less than'},{symbol:'gt',display:'Greater than'}],numericoperators:[{symbol:"eq","display":"Equal to"},{symbol:"ne","display":"Not Equal to"},{symbol:"lteq","display":"Equal or Less than"},{symbol:"gteq","display":"Equal or Greater than"},{symbol:"lt","display":"Less than"},{symbol:"gt","display":"Greater than"}],index:0,hideimgurl:'images/icons/Find_Remove_16x16.gif',addimgurl:'images/icons/Find_Add_16x16.gif',hideimgalttext:'Remove Condition',addimgalttext:'Add Condition',addrowlabel:'Lookup by:',hiderowlabel:'And:',srchBtnCaption:'Search',errorOperatorRequiresValue:'The operator requires a value'}}
Sage.GroupLookupManager.prototype.showLookup=function(){var mgr=Sage.Services.getService("GroupLookupManager");if(mgr){if(mgr.lookupisopen){return;}
mgr.lookupisopen=true;if(mgr.win==''){mgr.setupLookupElements();}
mgr.handleGroupChanged();var gMgrSvc=Sage.Services.getService("GroupManagerService");var layout=gMgrSvc.getLookupFields(mgr.resetLookup);mgr.win.show();$(document).bind("keydown",mgr.checkKeys);$("#value_0").focus();window.setTimeout(function(){$("#value_0").focus();},500);}}
Sage.GroupLookupManager.prototype.checkKeys=function(e){if(e.keyCode==13){var mgr=Sage.Services.getService("GroupLookupManager");if(mgr){mgr.doLookup();}}}
Sage.GroupLookupManager.prototype.setupLookupElements=function(){var mgr=Sage.Services.getService("GroupLookupManager");if((mgr)&&(mgr.win=='')){var pnl=new Ext.Panel({id:'lookupformpanel',layout:'fit',style:'padding:5px',html:''});var cpc=mainViewport.findById('center_panel_center');var cpcBox=cpc.getBox();if(!mgr.setupTemplateObj)mgr.getTemplateObj();pnl.html='<div id="entitylookupdiv-container">'+mgr.lookupTpl.apply(mgr.setupTemplateObj)+'</div>';mgr.win=new Ext.Window({header:false,footer:false,hideBorders:true,resizable:false,draggable:false,width:700,height:300,shadow:false,bodyStyle:'padding:5px',buttonAlign:'right',items:pnl,closeAction:'hide',modal:true,stateful:false,tools:[{id:'help',handler:function(){linkTo(window.lookupSetupObject.lookupHelpLocation,true);}}]});mgr.win.setWidth(700);mgr.win.setPosition(cpcBox.x-2,cpcBox.y);mgr.win.addListener("beforehide",mgr.onLookupHide,mgr);}}
Sage.GroupLookupManager.prototype.adjustInputHeight=function(){$(".lookup-value").height($(".lookup-operators-list").height());}
Sage.GroupLookupManager.prototype.addLookupCondition=function(){var mgr=Sage.Services.getService("GroupLookupManager");if(mgr){mgr.setupTemplateObj.index++;mgr.lookupTpl.append('entitylookupdiv-container',mgr.setupTemplateObj);mgr.adjustInputHeight();}}
Sage.GroupLookupManager.prototype.removeLookupCondition=function(idx){var rowid="#entitylookupdiv_"+idx;$(rowid).html('');}
Sage.GroupLookupManager.prototype.onLookupHide=function(){this.lookupisopen=false;$(document).unbind("keydown",this.checkKeys);}
Sage.GroupLookupManager.prototype.doLookup=function(){if(this.reloadConditions()){var gMgrSvc=Sage.Services.getService("GroupManagerService");if(gMgrSvc){gMgrSvc.doLookup(this.getConditionsString());}
this.win.hide();}else{alert(this.setupTemplateObj.errorOperatorRequiresValue);}}
Sage.GroupLookupManager.prototype.reloadSelect=function(sel,items){while(sel.options.length>0){sel.remove(0);}
var opt;for(var i=0;i<items.length;i++){opt=document.createElement("option");opt.value=items[i].symbol;opt.text=items[i].display;try{sel.add(opt);}catch(e){sel.appendChild(opt);}}}
Sage.GroupLookupManager.prototype.operatorChange=function(index){var mgr=Sage.Services.getService("GroupLookupManager");if(mgr){var operators=$('#operators_'+index)[0];var fields=$('#fieldnames_'+index)[0];if((fields.selectedIndex>=0)&&(fields.selectedIndex<mgr.setupTemplateObj.fields.length)&&(mgr.setupTemplateObj.fields[fields.selectedIndex].isNumeric))
{if(operators.length!=mgr.setupTemplateObj.numericoperators.length){mgr.reloadSelect(operators,mgr.setupTemplateObj.numericoperators);}}else{if(operators.length!=mgr.setupTemplateObj.operators.length){mgr.reloadSelect(operators,mgr.setupTemplateObj.operators);}}}}
Sage.GroupLookupManager.prototype.reloadConditions=function(){this.conditions=[];var filterRows=$('.lookup-condition-row');for(var i=0;i<filterRows.length;i++){var row=filterRows[i];var fieldname=$('.lookup-fieldnames-list',filterRows[i]);var operator=$('.lookup-operators-list',filterRows[i]);var val=$('.lookup-value',filterRows[i]);if(fieldname[0]){if((fieldname[0].value)&&(operator[0].value)){if((!val[0].value)&&((operator[0].value!='like')&&(operator[0].value!='sw'))){return false;}
var condition={fieldname:fieldname[0].value,operator:operator[0].value,val:val[0].value.replace(/%/g,'')}
this.conditions.push(condition);this.operatorChange(0);}}}
return true;}
Sage.GroupLookupManager.prototype.resetLookup=function(data){var x=data;var mgr=Sage.Services.getService("GroupLookupManager");if(mgr){mgr.setupTemplateFields(data);mgr.setupTemplateObj.index=0;if(mgr.win!=''){mgr.lookupTpl.overwrite('entitylookupdiv-container',mgr.setupTemplateObj);if(mgr.conditions.length>0){for(var i=1;i<mgr.conditions.length;i++){mgr.addLookupCondition();}
var filterRows=$('.lookup-condition-row');if(filterRows){for(var i=0;i<filterRows.length;i++){var row=filterRows[i];if((row)&&(mgr.conditions[i])){var cond=mgr.conditions[i];var fld=$('.lookup-fieldnames-list',row);var op=$('.lookup-operators-list',row);var val=$('.lookup-value',row);if(fld[0])fld[0].value=cond.fieldname;if(op[0])op[0].value=cond.operator;if(val[0])val[0].value=cond.val;mgr.operatorChange(i);}}}}
mgr.adjustInputHeight();}}}
Sage.GroupLookupManager.prototype.getConditionsString=function(){return Sys.Serialization.JavaScriptSerializer.serialize(this.conditions);}
Sage.GroupLookupManager.prototype.handleGroupChanged=function(){var gMgrSvc=Sage.Services.getService("GroupManagerService");var mgr=Sage.Services.getService("GroupLookupManager");if((!mgr)&&(this.setupTemplateObj)){mgr=this;}
if(mgr.win!=''){if(mgr.win.isVisible()){mgr.win.hide();}}}
Sage.GroupLookupManager.prototype.setupTemplateFields=function(filters){var NumericFieldTypes={"2":true,"6":true,"3":true,"11":true};var mgr=Sage.Services.getService("GroupLookupManager");if(mgr){mgr.setupTemplateObj.fields=[];for(var i=0;i<filters.items.length;i++){if((filters.items[i].visible=="T")&&(filters.items[i].width!="0")){var itemIsNumber=filters.items[i].fieldType in NumericFieldTypes;mgr.setupTemplateObj.fields.push({fieldname:filters.items[i].alias,displayname:filters.items[i].caption,isNumeric:itemIsNumber});}}}}
Sage.Services.addService("GroupLookupManager",new Sage.GroupLookupManager());

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

URL=function(urlID,url,autoPostBack)
{this.urlID=urlID;this.url=new urlProp(url,this);this.AutoPostBack=autoPostBack;}
function URL_FormatURL(val)
{var elem=document.getElementById(this.urlID);elem.value=val;}
function URL_FormatURLChange(ID)
{var elem=document.getElementById(this.urlID);if(this.url.get!=elem.value)
{this.url.set(elem.value);this.url.onChange.fire();if(this.AutoPostBack)
{if(Sys)
{Sys.WebForms.PageRequestManager.getInstance()._doPostBack(this.urlID,null);}
else
{document.forms(0).submit();}}}}
urlProp=function(val,parentElem)
{this.parentElement=parentElem;this.value=val;this.onChange=new YAHOO.util.CustomEvent("change",this);}
urlProp.prototype.set=function(val)
{this.value=val;this.parentElement.FormatURL(val);}
urlProp.prototype.get=function()
{return this.value;}
function LaunchWebSite(ID)
{var url=document.getElementById(ID).value;var startURL="http://";var startURL2="https://";if(url.indexOf(startURL)==-1&&url.indexOf(startURL2)==-1)
{url=startURL+url;}
winH=window.open(url,'','dependent=no,directories=yes,location=yes,menubar=yes,resizeable=yes,pageXOffset=0px,pageYOffset=0px,scrollbars=yes,status=yes,titlebar=yes,toolbar=yes');}
URL.prototype.FormatURL=URL_FormatURL;URL.prototype.FormatURLChange=URL_FormatURLChange;

Sage.FilterManager=function(options){this._id=options.id;this._clientId=options.clientId;this._context=document.getElementById(this._clientId);this.DistinctFilters=[];this._expandCount=10;this.allText=options.allText;this.userOptions=options.userOptions;this.activeFilters=options.activeFilters;this._templates={header:new Ext.XTemplate('<li><a class="filter-select-all">{selectAllText}</a> / <a class="filter-clear-all">{clearAllText}</a></li>'),item:new Ext.XTemplate('<li id="filter_{alias}" class="filter-item<tpl if="hidden"> filter-item-hidden</tpl>">','<a class="filter-expand">[+]</a>','<span>{name}</span>','<ul class="display-none">','</ul>','</li>'),value:new Ext.XTemplate('<div class="" style=\"white-space:nowrap;\">','<input id="filter_{entity}_{alias}_{index}" type="checkbox" value="{VALUE}" <tpl if="selected">checked="checked"</tpl> onclick="{objname}.ApplyDistinctFilter(\'{[String.escape(values.entity)]}_{[String.escape(values.alias)]}\', \'{valueWithSingleFixed}\')" />','<span class="filter-value-name">','{displayName}','</span>','&nbsp;<span class="filter-value-count {alias}_{displayNameId}_count">({count})</span>','</div>'),footer:new Ext.XTemplate('<li><a class="filter-show-more">{showMoreText}</a> / <a class="filter-show-all">{showAllText}</a></li>'),commands:new Ext.XTemplate('<li class="filter-commands"><a class="filter-undo-all">{undoAllFiltersText}</a></li>'),managerItem:new Ext.Template(["<DIV style=\"white-space:nowrap;padding-left:4px;\"><INPUT id=\"{id}\" onclick=\"Sage.HandleWindowCheckboxClick(event, '{filterId}');\" ","type=\"checkbox\" {checked} value=\"{value}\" /><SPAN class=filter-value-name>{display}</SPAN></DIV>"])}
Sage.FilterManager.managerItemFormat="<DIV style=\"white-space:nowrap;padding-left:4px;\"><INPUT id=\"{0}\" onclick=\"Sage.HandleWindowCheckboxClick(event, '{1}');\" type=\"checkbox\" {2} value=\"{3}\" /><SPAN class=filter-value-name>{4}</SPAN></DIV>";Sage.FilterManager.valueItemFormat=['<div style="white-space:nowrap;" class="{12}">','<input id="filter_{0}_{1}_{2}" type="checkbox" value="{3}" {4} onclick="{5}.ApplyDistinctFilter(\'{6}_{7}\', \'{8}\')" />','<span class="filter-value-name">','{9}','</span>','&nbsp;<span class="filter-value-count {1}_{10}_count">({11})</span>','</div>'].join('');Sage.FilterManager.nullIdString="_Null_";Sage.FilterManager.nullString=TaskPaneResources._null_;Sage.FilterManager.blankString=TaskPaneResources._blank_;Sage.FilterManager.EditFiltersString=TaskPaneResources.Edit_Filters;Sage.FilterManager.UnknownCount="...";}
Sage.FilterManager.prototype.init=function(){function findContext(idstring){if(idstring=="")return null;var elem=document.getElementById(idstring);if(elem!=null)return elem;idstring=idstring.substring(0,idstring.lastIndexOf('_'));return findContext(idstring);}
if(document.getElementById)
this._context=findContext(this._clientId);if(typeof(Filters)!="undefined")
this._groupContextService=Sage.Services.getService("ClientGroupContext");this.PopupActive=false;};Sage.FilterManager.GetManagerService=function(){if(Sage.FilterManager.FilterActivityManager)
return Sage.FilterManager.FilterActivityManager;return Sage.Services.getService("GroupManagerService");};Sage.FilterManager.prototype.GetManagerService=function(){return Sage.FilterManager.GetManagerService();};Sage.FilterManager.prototype.ApplyLookupFilter=function(options){var svc=this.GetManagerService();if(svc){var value='';var ops='';if($("#FilterWindow #"+options.valueid).length>0){value=$("#FilterWindow #"+options.valueid)[0].value;$("#"+options.valueid)[0].value=value;}else{value=$("#"+options.valueid)[0].value;}
if($("#FilterWindow #"+options.opsid).length>0){ops=$("#FilterWindow #"+options.opsid)[0].value;$("#"+options.opsid)[0].value=ops;}else{ops=$("#"+options.opsid)[0].value;}
options.ops=ops;options.value=value;options.filterType='Lookup';svc.setActiveFilter(options);}}
Sage.FilterManager.prototype.ApplyRangeFilter=function(options){var svc=this.GetManagerService();var values=[];$(String.format("DIV#{0}_{1} input",options.entity,options.filterName)).each(function(itm){if(this.checked){values.push(this.value);}});options.value=values;options.filterType='Range';if(svc){svc.setActiveFilter(options);}}
Sage.FilterManager.prototype.ApplyDistinctFilter=function(filterDef,value){var store=$("#distinctFilter_"+filterDef).get(0);if(typeof filterDef=="string"){filterDef=$(String.format("#distinctFilter_{0}",filterDef)).get(0).filterDef;}
$(store).data("filter").selected=$(store).data("filter").selected||{};if($(store).data("filter").selected.hasOwnProperty(value)==false)
$(store).data("filter").selected[value]=true;else
delete $(store).data("filter").selected[value];var svc=this.GetManagerService();var values=[];for(var key in $(store).data("filter").selected)values.push(key);if(svc)
{svc.setActiveFilter({filterName:filterDef.Name,entity:filterDef.EntityName,field:filterDef.FieldName,value:values,filterType:'Distinct',tableName:filterDef.TableName,property:filterDef.PropertyName});}}
Sage.ActivityEntity=function(){var tabPanel=Ext.ComponentMgr.get('activity_groups_tabs');if(tabPanel){if(tabPanel.activeTab.id=='literature')return"LitRequest";if(tabPanel.activeTab.id=='confirmation')return"UserNotification";if(tabPanel.activeTab.id=='event')return"Event";if(tabPanel.activeTab.id=='all_open')return"Activity";}
return"";}
Sage.GetHiddenFilters=function(){var hiddenFilters={};var groupkey="";var tabPanel=Ext.ComponentMgr.get('activity_groups_tabs');if(tabPanel){if(typeof Sage.HiddenActivityFilterData!="undefined"){hiddenFilters=Ext.apply({},Sage.HiddenActivityFilterData);}}else{var GroupContext=Sage.Services.getService("ClientGroupContext");if(GroupContext){if(GroupContext.getContext().CurrentHiddenFilters){hiddenFilters=GroupContext.getContext().CurrentHiddenFilters;}}}
return hiddenFilters;}
Sage.SaveHiddenFilters=function(hiddenFilters,oncomplete){if(typeof oncomplete!="function"){oncomplete=function(){};}
var groupkey="";var tabPanel=Ext.ComponentMgr.get('activity_groups_tabs');if(tabPanel){groupkey="activity";Sage.HiddenActivityFilterData=hiddenFilters;}else{var GroupContext=Sage.Services.getService("ClientGroupContext");if(GroupContext){groupkey=GroupContext.getContext().CurrentFamily.toLowerCase()+GroupContext.getContext().CurrentName.toLowerCase();groupkey=groupkey.replace(/ /g,'_').replace(/'/g,'_');}}
if(groupkey!=""){var title="hidden_filters_"+groupkey;if(Sage.FilterActivityManager[title])
clearTimeout(Sage.FilterActivityManager[title]);Sage.FilterActivityManager[title]=setTimeout(function(){$.ajax({type:"POST",contentType:"application/json; charset=utf-8",url:"UIStateService.asmx/StoreUIState",data:Ext.util.JSON.encode({section:"Filters",key:title,value:Ext.util.JSON.encode(hiddenFilters)}),dataType:"json",error:function(request,status,error){oncomplete();},success:function(data,status){oncomplete();}});},1000);}}
Sage.FilterUpdateCounts=function(){function getCurrentType(){var tabPanel=Ext.ComponentMgr.get('activity_groups_tabs');if(typeof tabPanel==="undefined")
return null;switch(tabPanel.activeTab.id){case'literature':return'literature';case'confirmation':return'confirmation';case'all_open':return'activity';case'event':return'event';}
return'activity';}
var hiddenFilters=Sage.GetHiddenFilters();var atleastoneexpanded=false;for(var e in hiddenFilters){if(hiddenFilters[e].expanded){atleastoneexpanded=true;break;}}
if(!atleastoneexpanded)
return;var options=(getCurrentType()==null)?null:{type:getCurrentType()};var svc=Sage.FilterManager.GetManagerService();if(Sage.FilterRangeCountRequest)
clearTimeout(Sage.FilterRangeCountRequest);Sage.FilterRangeCountRequest=setTimeout(function(){svc.requestRangeCounts(function(args){try{for(var i=0;i<args.length;i++){if(!args[i].Counts)
continue;var container=$(String.format("#{0}_{1}_items",args[i].FilterEntity,args[i].FilterName)).get(0);if(container){var store=$(container).siblings(".filter-item");if($(store).data("filter")){function GetDisplayName(data,value,name){if((data.family=="ACTIVITY")&&(data.name=="Duration")){var min=(value%60<10)?String.format("0{0}",value%60):value%60;return String.format("{0}:{1}",Math.floor(value/60),min);}
return name;}
function FixNullBlank(item){if(item.VALUE===null){item.VALUE=Sage.FilterManager.nullString;item.displayName=Sage.FilterManager.nullString;item.displayNameId=Sage.FiltersToJSId(Sage.FilterManager.nullString);}
if(/^\s*$/.test(item.VALUE)){item.VALUE=Sage.FilterManager.blankString;item.displayName=Sage.FilterManager.blankString;item.displayNameId=Sage.FiltersToJSId(Sage.FilterManager.blankString);}}
var manager=Sage.GetCurrentFilterManager();var data=$(store).data("filter").data;var values=$(store).data("filter").values;var selected=$(store).data("filter").selected;var html=[];if(getCurrentType()!=null){for(var key in args[i].Counts){if(key=="")key=Sage.FilterManager.blankString;var exists=false;for(var j=0;j<values.length;j++){if(values[j].VALUE==key){exists=true;break;}}
if(!exists){values[values.length]={VALUE:key,NAME:key,TOTAL:-1,display:true,entity:data.family,alias:data.name,count:-1,objname:'ActivityFilters'}}}}
var hiddenFilters=Sage.GetHiddenFilters();var filterId=String.format("{0}_{1}",Sage.FiltersToJSId(data.family),Sage.FiltersToJSId((values[0])?values[0].alias:''));var csssearchstring=((hiddenFilters[filterId])&&(hiddenFilters[filterId].items))?'|'+hiddenFilters[filterId].items.join('|').toLowerCase()+'|':'';for(var j=0;j<values.length;j++){var item=values[j];var key=item.VALUE;item.selected=selected?selected.hasOwnProperty(key):false;item.count=args[i].Counts.hasOwnProperty(key)?args[i].Counts[key]:0;item.count=item.count==-1?Sage.FilterManager.UnknownCount:item.count;item.displayName=GetDisplayName(data,key,GetFilterDisplayName(key,item.NAME));item.displayNameId=Sage.FiltersToJSId(GetFilterDisplayName(key,item.NAME));item.valueWithSingleFixed=(typeof item.VALUE)=="string"?item.VALUE.replace(/'/g,"\\\'"):item.VALUE;var cssclass=(csssearchstring.indexOf('|'+key.toString().toLowerCase()+'|')>-1)?"display-none":"";html.push(String.format(Sage.FilterManager.valueItemFormat,item.entity,item.alias,j,item.VALUE,(item.selected)?"checked=\"checked\"":"",item.objname,Sage.FiltersToJSId(item.entity),Sage.FiltersToJSId(item.alias),item.valueWithSingleFixed,item.displayName,item.displayNameId,item.count,cssclass));}
var fragment=document.createDocumentFragment();fragment.appendChild(container.cloneNode(false));fragment.firstChild.innerHTML=html.join('');container.parentNode.replaceChild(fragment,container);Sage.GetCurrentFilterManager().SetVisibleItem(String.format("{0}_{1}",args[i].FilterEntity,args[i].FilterName));}
else{var thisFilterData=args[i];var context=$(String.format("#{0}_{1}",thisFilterData.FilterEntity,thisFilterData.FilterName)).get(0);var container=$(String.format("#{0}_{1}_items",thisFilterData.FilterEntity,thisFilterData.FilterName)).get(0);var hasItems=true;var fragment=document.createDocumentFragment();if($.browser.mozilla&&!fragment.querySelectorAll){$(".filter-value-count",context).each(function(){this.firstChild.nodeValue="(0)";});for(var filterval in thisFilterData.Counts){hasItems=true;var filterIdVal=(filterval==null)?Sage.FilterManager.nullIdString:filterval;$(String.format("span.{0}_{1}_count",thisFilterData.FilterName,Sage.FiltersToJSId(filterIdVal)),context).each(function(){this.firstChild.nodeValue=String.format("({0})",thisFilterData.Counts[filterval]==-1?Sage.FilterManager.UnknownCount:thisFilterData.Counts[filterval]);});}}else{fragment.appendChild(container.cloneNode(true));if($.browser.mozilla){for(var j=0;j<fragment.querySelectorAll(".filter-value-count").length;j++){fragment.querySelectorAll(".filter-value-count")[j].firstChild.nodeValue="(0)";}
for(var filterval in thisFilterData.Counts){hasItems=true;var filterIdVal=(filterval==null)?Sage.FilterManager.nullIdString:filterval;var node=fragment.querySelector(String.format("span.{0}_{1}_count",thisFilterData.FilterName,Sage.FiltersToJSId(filterIdVal)));if(node)
node.firstChild.nodeValue=String.format("({0})",thisFilterData.Counts[filterval]==-1?Sage.FilterManager.UnknownCount:thisFilterData.Counts[filterval]);}}else{var countnodes=fragment.getElementsByTagName("SPAN");for(var j=0;j<countnodes.length;j++){hasItems=true;if(countnodes[j].className.indexOf("filter-value-count")>-1){countnodes[j].firstChild.nodeValue="(0)";for(var filterval in thisFilterData.Counts){var filterIdVal=Sage.FiltersToJSId((filterval==null)?Sage.FilterManager.nullIdString:filterval);if(countnodes[j].className.indexOf(filterIdVal)>-1){countnodes[j].firstChild.nodeValue=String.format("({0})",thisFilterData.Counts[filterval]==-1?Sage.FilterManager.UnknownCount:thisFilterData.Counts[filterval]);break;}}
if(container.getElementsByTagName("INPUT")[j].checked)
fragment.getElementsByTagName("INPUT")[j].checked=true;}}}
container.parentNode.replaceChild(fragment,container);}
if(!hasItems){$(String.format("#{0}_{1}",thisFilterData.FilterEntity,thisFilterData.FilterName)).parent().addClass("filter-no-items")}else{$(String.format("#{0}_{1}",thisFilterData.FilterEntity,thisFilterData.FilterName)).parent().removeClass("filter-no-items")}}}};$(".filterloading").remove();}
catch(ex){$(".filterloading").remove();throw ex;}},options);},2000);}
Sage.FilterManager.prototype.EditFilters=function(){var self=this;if(this.PopupActive)
return;this.PopupActive=true;var hiddenFilters=Sage.GetHiddenFilters();var win=new Ext.Window({title:Sage.FilterManager.EditFiltersString,id:'EditFilterWindow',width:parseInt(300),height:parseInt(400),autoScroll:true});win.on('close',function(){self.PopupActive=false;});win.on('beforeclose',function(){Sage.SaveHiddenFilters(hiddenFilters);});var activityEntity=Sage.ActivityEntity().toUpperCase();$("div.LookupFilter,div.RangeFilter,div.DistinctFilter",this._context).each(function(){if(this.id.substring(0,activityEntity.length)==activityEntity){var cb=new Ext.form.Checkbox({boxLabel:$(".FilterName",this).get(0).innerHTML,checked:!$(this).hasClass("display-none")});var filterDiv=this;cb.on('check',(function(t,v){if(v){$(filterDiv).removeClass("display-none");if(typeof hiddenFilters[filterDiv.id]!="undefined")
hiddenFilters[filterDiv.id].hidden=false;}else{$("input",$(filterDiv)).each(function(index,item){if(item.checked)
item.click();});$(filterDiv).addClass("display-none");if(typeof hiddenFilters[filterDiv.id]==="undefined")
hiddenFilters[filterDiv.id]={};hiddenFilters[filterDiv.id].hidden=true;}}));win.add(cb);}});win.show();}
Sage.FilterManager.prototype.ClearFilters=function(){$("span.filter-item",this._context).each(function(){if(typeof $(this).data("filter")!=='undefined')$(this).data("filter").selected={};});$("div.LookupFilter input",this._context).each(function(){this.value='';});$("div.RangeFilter input",this._context).each(function(){this.checked=false;});$("div.DistinctFilter input",this._context).each(function(){this.checked=false;});var entity=Sage.ActivityEntity();var svc=this.GetManagerService();if(svc){svc.setActiveFilter({filterName:"clear",entity:entity,field:"clear",property:"clear",value:"clear",filterType:"clear"});}}
Sage.FilterManager.prototype.ToggleShortList=function(filterId,forceOpen){var filterDiv=$("#"+filterId);var anchor=filterDiv.find("A").get(0);var itemsDiv=filterDiv.find(String.format("#{0}_items",filterId));var entity=Sage.FilterInfo(filterId).Entity;var filterName=Sage.FilterInfo(filterId).Name;var svc=this.GetManagerService();function ToggleList(doNotUpdateCounts){var hiddenFilters=Sage.GetHiddenFilters();var oncomplete=null;var changed=false;if(forceOpen||(anchor.innerHTML==="[+]")){anchor.innerHTML="[-]";itemsDiv.removeClass("display-none");if(!hiddenFilters[filterId]){hiddenFilters[filterId]={};}
changed=!hiddenFilters[filterId].expanded;hiddenFilters[filterId].expanded=true;try{if(!itemsDiv.parentNode)itemsDiv.parentNode=itemsDiv.parent();if((itemsDiv.parentNode)&&(!doNotUpdateCounts)){itemsDiv.before('<div class="loading-indicator filterloading"><span>'+TaskPaneResources.Loading+'</span></div>');}}catch(ex){}
svc.RangeCountCache=null;if(!doNotUpdateCounts)oncomplete=Sage.FilterUpdateCounts;}else{anchor.innerHTML="[+]";itemsDiv.addClass("display-none");if(hiddenFilters[filterId]){hiddenFilters[filterId].expanded=false;changed=true;}}
if(changed){Sage.SaveHiddenFilters(hiddenFilters,oncomplete);}}
if(filterDiv.hasClass("DistinctFilter")&&(itemsDiv.length>0)&&(itemsDiv.get(0).childNodes.length<=1)){var notNeedToDoFullRefresh=this.GetAppliedFilters().length==0;this.LoadDistinctValues(entity,filterName,function(){ToggleList(notNeedToDoFullRefresh);});return;}
ToggleList();}
Sage.FilterManager.prototype.GetAppliedFilters=function(){if(typeof Sage.AppliedActivityFilterData!='undefined')
return Sage.AppliedActivityFilterData;if(this._groupContextService)
return this._groupContextService.getContext().CurrentActiveFilters;return[];}
var hiddenFiltersStore={};Sage.FilterManager.prototype.ShowFilterWindow=function(itm){var thisFilterManager=Sage.GetCurrentFilterManager();if(thisFilterManager.PopupActive)
return;hiddenFiltersStore=Sage.GetHiddenFilters();var itemsdiv=$("#"+itm).get(0);var taskpane=Ext.get(itemsdiv.parentNode.parentNode.parentNode);var filterInfo=Sage.FilterInfo(itm.replace("_items",""));var filterId=String.format("{0}_{1}",filterInfo.Entity,filterInfo.Name);var title=$(String.format("div#{0}_{1} a.FilterName",filterInfo.Entity,filterInfo.Name)).get(0).innerHTML;var win=new Ext.Window({title:title,id:'FilterWindow',width:parseInt(taskpane.getWidth()),height:parseInt(300),autoScroll:true,x:taskpane.getLeft(false),y:Ext.get(itemsdiv.parentNode).getTop(false),html:"<span>loading...</span>"});win.on('close',function(){Sage.SaveHiddenFilters(hiddenFiltersStore);thisFilterManager.PopupActive=false;Sage.PopulateFilterList();});win.setPosition(taskpane.getLeft(false),Ext.get(itemsdiv.parentNode).getTop(false));win.setSize(parseInt(taskpane.getWidth()),300);win.show();var svc=Sage.Services.getService("GroupManagerService");if(svc)
svc.addListener(Sage.GroupManagerService.CURRENT_GROUP_CHANGED,function(mgr,args){win.close();});var allvisible=true;var hiddenFiltersSearchString='';if((hiddenFiltersStore[filterId])&&(hiddenFiltersStore[filterId].items)){hiddenFiltersSearchString=hiddenFiltersStore[filterId].items.join('|');}
var html=[];$(String.format("DIV#{0} input",filterId)).each(function(){var ckd=true;if((hiddenFiltersStore[filterId])&&(hiddenFiltersStore[filterId].items))
ckd=hiddenFiltersSearchString.indexOf(this.value)==-1;allvisible=allvisible&&ckd;html.push(String.format(Sage.FilterManager.managerItemFormat,this.id+'_'+new Date().getTime(),filterId,(ckd)?' checked="checked" ':'',this.value,(this.nextSibling.innerText)?this.nextSibling.innerText:(this.nextSibling.innerHTML)?this.nextSibling.innerHTML:this.nextSibling.nodeValue));});var allchk=String.format("<DIV><input id=\"allcheckbox\" type=\"checkbox\" {0} onclick=\"Sage.HandleWindowAllCheckBoxClick(event, '{2}');\" /><span>{1}</span>",(allvisible)?" checked=\"checked\" ":"",Sage.FilterStrings.allText,filterId);win.body.dom.innerHTML=allchk+html.join('');}
Sage.HandleWindowAllCheckBoxClick=function(e,filterId){var sender;if(!e)
e=window.event;if(e.target)
sender=e.target;if(e.srcElement)
sender=e.srcElement;var chkd=sender.checked;if(!hiddenFiltersStore[filterId]){hiddenFiltersStore[filterId]={hidden:false,items:[]};}
hiddenFiltersStore[filterId].items=[];$("#FilterWindow input:not(#allcheckbox)").each(function(){if(this.checked!=chkd){this.checked=chkd;}
if(!chkd)
hiddenFiltersStore[filterId].items.push(this.value);});}
Sage.HandleWindowCheckboxClick=function(e,filterId){var sender;if(!e)
e=window.event;if(e.target)
sender=e.target;if(e.srcElement)
sender=e.srcElement;if(!hiddenFiltersStore[filterId]){hiddenFiltersStore[filterId]={hidden:false,items:[]};}
if(!hiddenFiltersStore[filterId].items){hiddenFiltersStore[filterId].items=[];}
if(sender.checked){while(hiddenFiltersStore[filterId].items.indexOf(sender.value)>-1){hiddenFiltersStore[filterId].items.splice(hiddenFiltersStore[filterId].items.indexOf(sender.value),1);}}else{if(hiddenFiltersStore[filterId].items.indexOf(sender.value)==-1){hiddenFiltersStore[filterId].items.push(sender.value);}}}
Sage.FilterManager.prototype.SetVisibleItem=function(filter){var hiddenFilters=Sage.GetHiddenFilters();if(hiddenFilters[filter]){if(hiddenFilters[filter].hidden){$("#"+filter).addClass("display-none");}
if(($("#"+filter).hasClass("RangeFilter"))&&(hiddenFilters[filter].items)){var i=0;var node=document.getElementById(String.format('filter_{0}_{1}',filter,i));while(node){if(hiddenFilters[filter].items.indexOf(node.value)>-1)
$(node.parentNode).addClass("display-none");else
$(node.parentNode).removeClass("display-none");node=document.getElementById(String.format('filter_{0}_{1}',filter,++i));}}
if((hiddenFilters[filter].expanded)&&($("#"+filter+"_items").hasClass("display-none"))){this.ToggleShortList(filter,true);}}}
Sage.FilterManager.prototype.SetVisibleItems=function(){var GroupContext=Sage.Services.getService("ClientGroupContext");var allFilters=GroupContext.getContext().CurrentEntityFilters;if(allFilters){for(var i=0;i<allFilters.length;i++){if(!allFilters[i].InCurrentGroupLayout)
$(String.format("#{0}_{1}",allFilters[i].Entity,allFilters[i].Name)).addClass("display-none")
else
$(String.format("#{0}_{1}",allFilters[i].Entity,allFilters[i].Name)).removeClass("display-none");}}
var hiddenFilters=Sage.GetHiddenFilters();if(hiddenFilters){for(filter in hiddenFilters){this.SetVisibleItem(filter);}}}
Sage.FilterManager.prototype.LoadDistinctValues=function(entity,filterName,finished,options){var self=this;if(self.PopupActive)
return;if(typeof finished==="undefined")
finished=self.ShowFilterWindow;var el=$(String.format("#distinctFilter_{0}_{1}",entity,filterName)).get(0);if(!(el)||el.fetching)
return;el.fetching=true;var itemsdivid=String.format("{0}_{1}_items",entity,filterName);var container=$(String.format("DIV#{0}",itemsdivid)).get(0);var svc=this.GetManagerService();var field=String.format("{0}.{1}",el.filterDef.TableName,el.filterDef.FieldName);var datapath=el.filterDef.DataPath;if(svc){svc.getDistinctValuesForField(field,{family:entity,filterName:filterName,dataPath:datapath},function(data){self.loadDistinctFilterValues(el,container,data,null,filterName);el.fetching=false;el.fetched=true;finished(itemsdivid,options);});}else{el.fetching=false;finished(itemsdivid,options);}}
Sage.FilterManager.prototype.loadDistinctFilterValues=function(parent,container,data,filter,alias){function GetDisplayName(data,item){if((data.family=="ACTIVITY")&&(data.name=="Duration")){var min=(item.VALUE%60<10)?String.format("0{0}",item.VALUE%60):item.VALUE%60;return String.format("{0}:{1}",Math.floor(item.VALUE/60),min);}
return item.NAME;}
function FixNullBlank(item){if(item.VALUE===null){item.VALUE=Sage.FilterManager.nullString;item.displayName=Sage.FilterManager.nullString;item.displayNameId=Sage.FiltersToJSId(Sage.FilterManager.nullString);}
if(/^\s*$/.test(item.VALUE)){item.VALUE=Sage.FilterManager.blankString;item.displayName=Sage.FilterManager.blankString;item.displayNameId=Sage.FiltersToJSId(Sage.FilterManager.blankString);}}
var self=this;var lookup={};var fixAt=false;var fix=[];for(var i=data.items.length-1;i>=0;i--){var item=data.items[i];if(item.VALUE!==null&&!(typeof item.VALUE==="string"&&/^\s*$/.test(item.VALUE)))
break;fix.push(item);fixAt=i;}
if(fixAt!==false)
data.items=fix.concat(data.items.slice(0,fixAt));$(parent).data("filter",{});$(parent).data("filter").data=data;$(parent).data("filter").values=data.items;var getSelectedFromFilterData=function(data,parent){var selected={};for(var j=0;j<data.length;j++){if(!data[j].Entity){data[j].Entity=data[j].entity;data[j].Name=data[j].filterName;data[j].Value=data[j].value;}
if(data[j].Entity==parent.filterDef.EntityName&&data[j].Name==parent.filterDef.Name){for(var k=0;k<data[j].Value.length;k++){selected[data[j].Value[k]]=true;}
$(parent).data("filter").selected=selected;break;}}
return selected;}
var selected={};if(this._groupContextService){var context=this._groupContextService.getContext();selected=getSelectedFromFilterData(context.CurrentActiveFilters,parent);}else{selected=getSelectedFromFilterData(Sage.AppliedActivityFilterData,parent);}
var hiddenFilters=Sage.GetHiddenFilters();var html=[];var csssearchstring='';var filterId=String.format("{0}_{1}",Sage.FiltersToJSId(data.family),Sage.FiltersToJSId(alias));if((hiddenFilters[filterId])&&(hiddenFilters[filterId].items)){csssearchstring=((hiddenFilters[filterId])&&(hiddenFilters[filterId].items))?'|'+hiddenFilters[filterId].items.join('|').toLowerCase()+'|':'';}
for(var i=0;i<data.items.length;i++){var item=data.items[i];item.alias=alias;item.display=(i<this._expandCount);item.index=i;item.selected=false;item.count=item.TOTAL==-1?Sage.FilterManager.UnknownCount:item.TOTAL;item.displayName=GetDisplayName(data,item);item.objname=self._id;item.entity=data.family;item.displayNameId=Sage.FiltersToJSId(item.VALUE);FixNullBlank(item);item.valueWithSingleFixed=(typeof item.VALUE)=="string"?item.VALUE.replace(/'/g,"\\\'"):item.VALUE;var cssclass=(csssearchstring.indexOf('|'+item.VALUE.toString().toLowerCase()+'|')>-1)?"display-none":"";html.push(String.format(Sage.FilterManager.valueItemFormat,item.entity,item.alias,item.index,item.VALUE,(item.selected)?"checked=\"checked\"":"",item.objname,Sage.FiltersToJSId(item.entity),Sage.FiltersToJSId(item.alias),item.valueWithSingleFixed,item.displayName,item.displayNameId,item.count,cssclass));}
container.innerHTML=html.join('');};Sage.FiltersToJSId=function(val){if((typeof val)=="number")return String.format("{0}",val).replace(/\W/g,'_');return(typeof val!="string")?"":val.replace(/\W/g,'_');}
Sage.FilterManager.prototype.toJSId=function(val){return Sage.FiltersToJSId(val);}
Sage.FilterManager.prototype.doSelectAll=function(parent,container,sender){var self=this;$(container).find("input").each(function(){self.setSelectionValue($(parent).data("filter").selected,$(parent).data("filter").values[parseInt(this.value)].VALUE);this.checked=true;});this.processFilterSelections();};Sage.FilterManager.prototype.doClearAll=function(parent,container,sender,process){var self=this;$(container).find("input").each(function(){self.clearSelectionValue($(parent).data("filter").selected,$(parent).data("filter").values[parseInt(this.value)].VALUE);this.checked=false;});if(!(process===false))
this.processFilterSelections();};Sage.FilterManager.prototype.createEmptySelection=function(){return{values:{},withNull:false,withBlank:false};};Sage.FilterManager.prototype.containsSelectionValue=function(selection,value){if(value===null)
return(selection.withNull==true);else if(typeof value==="string"&&/^\s*$/.test(value))
return(selection.withBlank==true);else if(typeof value==="boolean"||typeof value==="string"||typeof value==="number")
return(selection.values[value]==true);else
return false;};Sage.FilterManager.prototype.setSelectionValue=function(selection,value){if(value===null)
selection.withNull=true;else if(typeof value==="string"&&/^\s*$/.test(value))
selection.withBlank=true;else if(typeof value==="boolean"||typeof value==="string"||typeof value==="number")
selection.values[value]=true;};Sage.FilterManager.prototype.clearSelectionValue=function(selection,value){if(value===null)
selection.withNull=false;else if(typeof value==="string"&&/^\s*$/.test(value))
selection.withBlank=false;else if(typeof value==="boolean"||typeof value==="string"||typeof value==="number")
delete selection.values[value];};Sage.FilterManager.prototype.processFilterSelections=function(){var filter=this.createFilterFromSelections();this.GetManagerService().setActiveFilter(filter);}
Sage.FilterManager.prototype.createFilterFromSelections=function(){var filter={columns:[],on:{},withNull:{},withBlank:{}};$("li.filter-item",this._context).each(function(){var el=this;var data=$(el).data("filter");var values=[];for(var key in data.selected.values)
values.push(key);if(values.length>0||data.selected.withNull||data.selected.withBlank){filter.columns.push(data.alias);filter.on[data.alias]=values;filter.withNull[data.alias]=data.selected.withNull;filter.withBlank[data.alias]=data.selected.withBlank;}});return filter;};Sage.FilterInfo=function(filterid){var GroupContext=Sage.Services.getService("ClientGroupContext");var allFilters=GroupContext.getContext().CurrentEntityFilters;if(allFilters){for(var i=0;i<allFilters.length;i++){if(allFilters[i].FilterId==filterid){return allFilters[i];}}
for(var i=0;i<allFilters.length;i++){if(filterid.indexOf(allFilters[i].FilterId)==0){return allFilters[i];}}}
var res={};res.Entity=filterid.split('_')[0];res.Name=filterid.split('_')[1];return res;}
Sage.GetCurrentFilterManager=function(){return window.Filters?window.Filters:window.ActivityFilters;}
Sage.FilterActivityManager=function(options){this._listeners={};this._listeners.onSetActiveFilter=[];}
Sage.FilterActivityManager.prototype.ONSETACTIVEFILTER="onSetActiveFilter";Sage.FilterActivityManager.prototype.setActiveFilter=function(options){function addFilterToTab(activeTab,options){if(typeof Sage.AppliedActivityFilterData==="undefined")
Sage.AppliedActivityFilterData=[];for(var i=0;i<Sage.AppliedActivityFilterData.length;i++){if((Sage.AppliedActivityFilterData[i].filterName===options.filterName)&&(Sage.AppliedActivityFilterData[i].entity===options.entity)){Sage.AppliedActivityFilterData[i]=options;return;}}
Sage.AppliedActivityFilterData[Sage.AppliedActivityFilterData.length]=options;return;}
function storeFilter(activeTab){var actfilterdata=[];for(var i=0;i<Sage.AppliedActivityFilterData.length;i++){actfilterdata[actfilterdata.length]=(Sage.AppliedActivityFilterData[i]);}
if(Sage.FilterActivityManager.appliedTimeout)
clearTimeout(Sage.FilterActivityManager.appliedTimeout);Sage.FilterActivityManager.appliedTimeout=setTimeout(function(){$.ajax({type:"POST",contentType:"application/json; charset=utf-8",url:"UIStateService.asmx/StoreUIState",data:Ext.util.JSON.encode({section:"Filters",key:"applied_activity_filters",value:Ext.util.JSON.encode(actfilterdata)}),dataType:"json",error:function(request,status,error){},success:function(data,status){}});},1000);}
this.RangeCountCache=null;if(options.filterType=='clear'){for(var i=0;i<Sage.AppliedActivityFilterData.length;i++){if(Sage.AppliedActivityFilterData[i].entity.toLowerCase()==Sage.ActivityEntity().toLowerCase()){Sage.AppliedActivityFilterData.splice(i,1);}}}else{for(var i=0;i<Sage.AppliedActivityFilterData.length;i++){if(Sage.AppliedActivityFilterData[i].filterType.toLowerCase()=='clear'){Sage.AppliedActivityFilterData.splice(0,i);}}}
var tabPanel=Ext.ComponentMgr.get('activity_groups_tabs');var list=tabPanel.listObj;var activeTab=tabPanel.getActiveTab();addFilterToTab(activeTab,options);if(Sage.FilterActivityManager.refreshListTimeout)
clearTimeout(Sage.FilterActivityManager.refreshListTimeout);Sage.FilterActivityManager.refreshListTimeout=setTimeout(function(){list.connections=Ext.apply({},activeTab.connections);list.filter=Ext.apply({},Sage.AppliedActivityFilterData);list.setEnableDetailView(activeTab.id==="all_open");list.refresh();storeFilter(activeTab,options);Sage.FilterUpdateCounts();},2000);this.fireEvent(this.ONSETACTIVEFILTER,options);};Sage.FilterActivityManager.prototype.getDistinctValuesForField=function(field,options,success,fail){var d={metaData:{},groupId:""};this.requestRangeCounts(function(data){var countData;for(var i=0;i<data.length;i++){if((data[i].FilterName===options.filterName)&&(data[i].FilterEntity===options.family)){countData=data[i];}}
d.family=countData.FilterEntity;d.name=countData.FilterName;d.items=[];for(var i in countData.Counts){d.items.push({TOTAL:countData.Counts[i],VALUE:(i==Sage.FilterManager.nullString)?null:i,NAME:GetFilterDisplayName(i)});}
d.items.sort(function(a,b){return isNaN(a.NAME)?a.NAME>b.NAME:a.NAME-b.NAME;});d.count=d.items.length;d.total_count=d.items.length;d.distinctField=field;success(d);},{type:options.family,field:field},fail);};function GetFilterDisplayName(val,defname){if(typeof(UserNameLookup)!="undefined"){if(UserNameLookup[val])
return UserNameLookup[val];}
if(typeof(LocalizedActivityStrings)!="undefined"){if(LocalizedActivityStrings[val])
return LocalizedActivityStrings[val];}
if(val==null)
return Sage.FilterManager.nullString;if(val=="")
return Sage.FilterManager.blankString;return((typeof(defname)!="undefined")&&(defname))?defname:val;}
Sage.FilterActivityManager.prototype.requestRangeCounts=function(success,options,fail){var self=this;var family=options.type.toLowerCase();if(self.RangeCountCache&&(self.RangeCountCache[0].FilterEntity.toLowerCase()==family)){success(self.RangeCountCache);return;}
if(this.fetchingRangeCounts){window.setTimeout(function(){self.requestRangeCounts(success,options,fail);},50);return;}
self.fetchingRangeCounts=true;if(family=='litrequest')family='literature';if(family=='usernotification')family='confirmation';var sdata={};sdata.resource=String.format("slxdata.ashx/slx/crm/-/activities/{0}count/all",family);sdata.qparams={responsetype:"json",time:new Date().getTime()};$.ajax({url:this.buildRequestUrl(sdata),dataType:"json",success:function(data){self.RangeCountCache=data;success(data);self.fetchingRangeCounts=false;},error:function(request,status,error){self.fetchingRangeCounts=false;if(typeof fail==="function")fail(request,status,error);}});};Sage.FilterActivityManager.prototype.requestActiveFilters=function(success,fail){setTimeout(function(){success(Sage.AppliedActivityFilterData);},10);};Sage.FilterActivityManager.prototype.addListener=function(name,handler){if(name==this.ONSETACTIVEFILTER){this._listeners.onSetActiveFilter.push(handler);}}
Sage.FilterActivityManager.prototype.fireEvent=function(name,options){if(name==this.ONSETACTIVEFILTER){for(var i=0;i<this._listeners.onSetActiveFilter.length;i++){this._listeners.onSetActiveFilter[i](options);}}}
Sage.FilterActivityManager.prototype.buildRequestUrl=function(options){var o=options;var u=[];var p=[];var qp=[];u.push(o.resource);if(o.predicate){if(typeof o.predicate==="object")
for(var k in o.predicate)
p.push(k+"="+encodeURIComponent(o.predicate[k]));else if(typeof o.predicate==="string")
p.push(o.predicate);if(p.length>0){u.push("(");u.push(p.join("&"));u.push(")");}}
if(o.qparams){if(typeof o.qparams==="object")
for(var prm in o.qparams)
qp.push(prm+"="+encodeURIComponent(o.qparams[prm]));else if(typeof o.qparams==="string")
qp.push(o.qparams);if(qp.length>0){u.push("?");u.push(qp.join("&"));}}
return u.join("");}
