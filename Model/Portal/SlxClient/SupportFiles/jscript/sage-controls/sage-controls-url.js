
URL = function (urlID, url, autoPostBack)
{
    this.urlID = urlID;
    this.url = new urlProp(url, this);
    this.AutoPostBack = autoPostBack;
}

function URL_FormatURL(val)
{
    var elem = document.getElementById(this.urlID); 
    elem.value = val;
}

function URL_FormatURLChange(ID)
{
    var elem = document.getElementById(this.urlID);
    if (this.url.get != elem.value)
    {
        this.url.set(elem.value);
        this.url.onChange.fire();
        if (this.AutoPostBack)
        {
            if (Sys)
            {
                Sys.WebForms.PageRequestManager.getInstance()._doPostBack(this.urlID, null);
            }
            else
            {
                document.forms(0).submit();
            }
        }
    }
}

urlProp = function(val, parentElem)
{
    this.parentElement = parentElem;
    this.value = val;
    this.onChange = new YAHOO.util.CustomEvent("change", this);
}

urlProp.prototype.set = function(val)
{
    this.value = val;
    this.parentElement.FormatURL(val);
}

urlProp.prototype.get = function()
{
    return this.value;
}

function LaunchWebSite(ID)
{
    var url = document.getElementById(ID).value;    
    var startURL = "http://";
    var startURL2 = "https://";
    if (url.indexOf(startURL) == -1 && url.indexOf(startURL2) == -1) 
    {
	    url = startURL + url;
    }     
    winH = window.open(url, '', 'dependent=no,directories=yes,location=yes,menubar=yes,resizeable=yes,pageXOffset=0px,pageYOffset=0px,scrollbars=yes,status=yes,titlebar=yes,toolbar=yes');
}

URL.prototype.FormatURL = URL_FormatURL;
URL.prototype.FormatURLChange = URL_FormatURLChange;
