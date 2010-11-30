// JScript File

var morelessClientID = '@morelessClientID';
var lzComparisonTimeZones = '@lzComparisonTimeZones';

// resource strings
var rsMore = '@rsMore';
var rsLess = '@rsLess';
          
function moreless_click() {
	if ($("#" + morelessClientID).attr("value") == rsMore) {
	    $("#rightside").show();
	    $("#" + morelessClientID).attr("value", rsLess);
	} else {
	    $("#rightside").hide();
	    $("#" + morelessClientID).attr("value", rsMore);
	}  
}

$(document).ready(function() {
    var btn = Ext.get(morelessClientID);
    if (btn) {
        btn.on("click", function(){
            var grid = new Ext.grid.TableGrid("tblTZTable", {
                height: 274,
                width: 430,
                stripeRows: true, 
                title: lzComparisonTimeZones,
                viewConfig: {forceFit: true}
            });
            grid.render();
        }, false, {single:true}); 
    }
    document.getElementById("rightside").style.display = 'none';    
    $("#rightside").hide();
});
