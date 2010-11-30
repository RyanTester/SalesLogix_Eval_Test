Sage.WebClientMessageService = function(options) {
   
};

Sage.WebClientMessageService.prototype.hideClientMessage = function() {	
	Ext.Msg.hide();
};

Sage.WebClientMessageService.prototype.showClientMessage = function(title, msg, fn, scope) { 
	if (typeof title === "object")
	    return Ext.Msg.alert(title);	    	
	
	var o = {
	    title: (typeof msg === "string") ? title : Sage.WebClientMessageService.Resources.DefaultDialogMessageTitle,
	    msg: (typeof msg === "string") ? msg : title,
	    buttons: Ext.Msg.OK,
	    fn: fn,
	    scope: scope
	};
	
    Ext.Msg.show(o);	
};

Sage.Services.addService("WebClientMessageService", new Sage.WebClientMessageService());

