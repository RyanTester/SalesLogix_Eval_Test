/*
 * Sage SalesLogix Web Controls
 * Copyright(c) 2009, Sage Software.
 */


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