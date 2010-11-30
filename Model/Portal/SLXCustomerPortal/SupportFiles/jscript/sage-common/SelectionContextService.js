
Sage.SelectionContextService = function() {
    
    this._url = "slxdata.ashx/slx/crm/-/SelectionService"; 
    var self = this;
    $(document).ready(function() {        
        var prm = Sys.WebForms.PageRequestManager.getInstance();
        prm.add_beginRequest(function(sender, args) {
            
        });
        prm.add_endRequest(function(sender, args) {
           
            
        });
    });
};

Sage.SelectionContextService.UI_STATE_SECTION = "SelectionContextService";


Sage.SelectionContextService.prototype.getSelectionInfo = function(key, callback) {
        
    if (typeof key === "undefined" || key == null)
        key = '';
     
           
    $.ajax({
        url: this._url, 
        dataType: "json",
        success: function(data) { 
            callback(data)
        },
        error: function(request, status, error) { 
        }
    });
};

Sage.SelectionContextService.prototype.getSelectedIds = function(options, callback) {
    
    if (typeof options === "undefined" || options == null)
        key = '';
        
    $.ajax({
        url:  this._url, 
        dataType: "json",
        success: function(data) { 
            callback(data)
        },
        error: function(request, status, error) { 
        }
    });

}

Sage.SelectionContextService.prototype.setSelectionContext = function(key, selectionInfo, callback) {
   
   $.ajax({
        url : String.format("{0}/SetSelectionContext?key={1}",this._url, key),
        type : "POST",
        dataType: "json",
        success:  function(data) { 
            callback(data);
        },
        //error: function(request, status, error) {
        //    alert("request: " + request + " \nstatus: " + status + " \nerror: " + error);
        //},
        error:function(request, status, error) { 
            callback(error);
        },
        data :Ext.encode(selectionInfo)
    });      
};

Sage.Services.addService("SelectionContextService", new Sage.SelectionContextService());