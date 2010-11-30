var resizeTimerID = null;
function Timeline_onResize() {
    if (resizeTimerID == null) {
        resizeTimerID = window.setTimeout(function() {
            resizeTimerID = null;
            tl.layout();
        }, 500);
    }
}

function Timeline_init(timeline_object, tab) {
    var method = timeline_object.onLoad;
    var delay = 750;
    $("#show_"+tab).click(function(){window.setTimeout(method, delay);});
    $("#more_"+tab).click(function(){window.setTimeout(method, delay);});
    if ($("#more_"+tab).length > 0) {
        $("#show_More").click(function(){window.setTimeout(method, delay);});
    }
    $(".tws-main-tab-buttons").click(function() { closeTimelineBubble(); });
    $(".tws-more-tab-buttons-container").click(function(){ closeTimelineBubble();});
    if (document.body.addEventListener) {
        document.body.addEventListener('onresize', Timeline_onResize, false);
    }  else if (document.body.attachEvent) {
        document.body.attachEvent('onresize', Timeline_onResize);
    }
    var svc = Sage.Services.getService("GroupManagerService");  
    if (svc) {
        svc.addListener(Sage.GroupManagerService.CURRENT_GROUP_POSITION_CHANGED, function(sender, evt) {
            method();
        });   
    }
    if (document.getElementById(timeline_object.ParentElement) != null) {
        if (document.getElementById(timeline_object.ParentElement).hasChildNodes()) {
            method();
        } else {
            window.setTimeout(method, delay);
        }
    }
    $(document).ready(function(){ Sage.DialogWorkspace.__instances['ctl00_DialogWorkspace'].on('open', closeTimelineBubble);});
}

function closeTimelineBubble() {
    //Use the Timeline's ajax wrapper to find and close the bubble popup.
    SimileAjax.WindowManager.popAllLayers();    
}

function Timeline_RecalculateHeight() {
    //var container = document.getElementById(timeline_object.ParentElement);
    $("div.timeline-container").each(function(i, elem) {
        var container = elem;
        if (container.hasChildNodes() && (container.clientHeight > 0)) {
            var largest = (container.clientHeight > 0) ? container.clientHeight - 55 : 300 - 55;
            var changed = false;
            var bands = $(".timeline-band-0 .timeline-band-events .timeline-band-layer-inner");
            for (var i = 0; i < bands.length; i++) {
                var div = bands[i];
                if (div && (div.lastChild)) {
                    for (var j = 0; j < div.childNodes.length; j++) {
                        if (div.childNodes[j].offsetTop > largest) {
                            largest = div.childNodes[j].offsetTop;
                            changed = true;
                        }
                    }
                }
            }
            if (changed) {
                var navbandheight = $(".timeline-band-1")[0].style.height;
                container.style.height = parseInt(largest + parseInt(navbandheight, 10) + 30, 10) + "px";
                $(".timeline-band-0")[0].style.height = parseInt(largest + 30, 10) + "px";
                $(".timeline-band-1")[0].style.top = parseInt(largest + 30, 10) + "px";
                $(".timeline-band-1")[0].style.height = navbandheight;
                //document.getElementById(timeline_object.ControlId).style.height = container.style.height;
                if (container.parent)
                    container.parent.style.height = container.style.height;
            }
            window.setTimeout(function() { Timeline_RecalculateHeight(); }, 2000);
        }
    });
}
