/*
 * Sage SalesLogix Web Controls
 * Copyright(c) 2009, Sage Software.
 */


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