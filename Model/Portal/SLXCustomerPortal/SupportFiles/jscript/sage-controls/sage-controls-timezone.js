
function Timezone_populatelist(controlId) 
{
    var sel = $("#"+ controlId + " #TimezoneList")[0];
    if (sel.options.length == 1) {
        $.ajax({
            type: "GET",
            url: "slxdata.ashx/slx/crm/-/timezones/p", 
            success: function(list) {
                sel.options.length = 0;
                for (var i=0; i<list.length; i++) {
                    var opt = new Option(list[i].Displayname, list[i].Keyname);
                    sel.options[sel.options.length] = opt;
                    if (list[i].Keyname == $("#"+controlId).find('input').filter('[@type=hidden]')[0].value)
                        sel.selectedIndex = i;
                }
                sel.onblur = function() {
                    $("#"+controlId).find('input').filter('[@type=hidden]')[0].value = sel.options[sel.selectedIndex].value;
                };
            },
            dataType : "json"
        });
        return false;
   }
}