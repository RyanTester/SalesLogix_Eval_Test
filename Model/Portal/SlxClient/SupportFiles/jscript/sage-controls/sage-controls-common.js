
if (typeof Sys !== "undefined")
{
    Type.registerNamespace("Sage.SalesLogix.Controls");
    Type.registerNamespace("Sage.SalesLogix.Controls.Resources");
    Type.registerNamespace("Resources");  //(from lookup)
}
else
{
    Ext.namespace("Sage.SalesLogix.Controls");
    Ext.namespace("Sage.SalesLogix.Controls.Resources");
    
    Sage.__namespace = true; //allows child namespaces to be registered via Type.registerNamespace(...)
    Sage.SalesLogix.__namespace = true;
    Sage.SalesLogix.Controls.__namespace = true;
    Sage.SalesLogix.Controls.Resources.__namespace = true;
}


if (typeof(Sage) != "undefined")
{    
    Sage.SyncExec = function() {
        this._functionList = [];
        
        var self = this;
        var prm = Sys.WebForms.PageRequestManager.getInstance();
        prm.add_endRequest(function(sender, args) {
            self.onEndRequest();
        });
    };

    Sage.SyncExec.prototype.onEndRequest = function() {
        var functionsToCall = this._functionList;
        this._functionList = [];
        for (var i = 0; i < functionsToCall.length; i++)
            functionsToCall[i]();    
    };

    Sage.SyncExec.prototype.tryCall = function(functionToCall) {
        var prm = Sys.WebForms.PageRequestManager.getInstance();
        this._functionList.push(functionToCall);
    };

    Sage.SyncExec.call = function(functionToCall) {
        if (typeof Sage.SyncExec._instance == "undefined")
            Sage.SyncExec._instance = new Sage.SyncExec();    
            
        Sage.SyncExec._instance.tryCall(functionToCall);    
    };
}

function IsAllowedNavigationKey(charCode) {
    return (charCode == 8   // backspace
        || charCode == 9    // tab
        || charCode == 46   // delete
        || charCode == 37   // left arrow
        || charCode == 39); // right arrow
}

// from duration picker script - is also used by recurring activity script...
function RestrictToNumeric(e, groupSeparator, decimalSeparator) {
    // works firefox.  IE won't even fire keypress event for special characters
    if (navigator.userAgent.indexOf("Firefox") >= 0) {
        if (e.keyCode && IsAllowedNavigationKey(e.keyCode)) return true;
    }

    var code = e.charCode || e.keyCode;
    return ((code >= 48 && code <= 57)  // 0-9
        || code == groupSeparator       // localized
        || code == decimalSeparator);   // localized
}

function GetResourceValue(resource, defval) {
    var val = resource;
    if ((val == null) || (val.length == 0)) {
        val = defval;
    }
    return val;
}
