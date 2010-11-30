/*
 * Sage SalesLogix Web Controls
 * Copyright(c) 2009, Sage Software.
 */


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