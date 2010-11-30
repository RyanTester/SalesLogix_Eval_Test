/*
 * Sage SalesLogix Web Controls
 * Copyright(c) 2009, Sage Software.
 */


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