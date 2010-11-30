/*
 * Sage SalesLogix Web Controls
 * Copyright(c) 2009, Sage Software.
 */


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