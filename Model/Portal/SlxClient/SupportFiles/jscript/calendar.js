/// <reference name="MicrosoftAjax.js" />
/// <reference path="../Libraries/jQuery/jquery-vsdoc.js" />

// Page Load / Async post backs
//#region 

$(function() {

    overrideWeekViewOnMouseDown();
    
    var viewport = window["mainViewport"];
    var panel = (viewport ? viewport.findById("center_panel_center") : false);   
    if (panel) {
        panel.getEl().dom.oncontextmenu = function() { return false; };
        document.oncontextmenu = function() { return false; };
        panel.on("resize", function() {
            AdjustCalendar(this);
            __calendar.resize[__calendar.active].call(__calendar.activeView);
        });
    }  
    
    RenderCalendarAndEvents(panel);

    var prm = Sys.WebForms.PageRequestManager.getInstance();
    prm.add_pageLoaded(function(sender, args) {        
        overrideWeekViewOnMouseDown();
        var updated = args.get_panelsUpdated();
        $(updated).each(function() {
            if (this.id === "ctl00_mainformUpdatePanel")
                RenderCalendarAndEvents(panel);
        });
    });
}); 

function RenderCalendarAndEvents(panel) {
    BuildCalendar();
    AdjustCalendar(panel);
    RebuildCalendarState(); 
    setCalendarView(__calendar.view);
    EventList.render();
    EventList.setDate(__calendar.scheduleInfo.getActiveDay());
}

//#endregion

// Calendar 
//#region

var __calendar = null;

function BuildCalendar() {
    __calendar = {
        scheduleInfo: ig_getWebScheduleInfoById(clientId.scheduleInfo),
        view: parseInt($("input[id$=_hfCurrentView]").val()),
        active: null,
        activeView: null,
        views: {
            month: typeof(ig_getWebMonthViewById) === "undefined" ? null :
                ig_getWebMonthViewById(clientId.monthView),
            week: typeof(ig_getWebWeekViewById) === "undefined" ? null :
                ig_getWebWeekViewById(clientId.weekView),
            day: typeof(ig_getWebDayViewById) === "undefined" ? null :
                ig_getWebDayViewById(clientId.dayView)
        },
        fix: {
            month: function() {
                if (__calendar.active != "month") return;
                $("#calendar_center").css({"overflow": "auto"});
                $(this.getElement()).css({"width": "auto"});
                EnableCalendarAppointmentDetails();
            },
            week: function() {  
                if (__calendar.active != "week") return;
                $("#calendar_center").css({"overflow": "auto"});
                $(this.getElement())
                    .css({"width": "auto", "zoom": "1", "min-height": "0"})
                    .find("table:first")
                        .css({"height": "auto"});
                EnableCalendarAppointmentDetails();              
            },
            day: function(callback) {
                if (__calendar.active != "day") return;
                $("#calendar_center").css({"overflow": "hidden"});
                if ($.browser.msie && !Ext.isIE8)
                    $("#" + this._clientID + "_divScroll")
                        .css({"zoom": "1", "min-height": "0"})
                        .find("table:first")
                            .css({"width": "auto", "zoom": "1", "min-height": "0"}); 
                    
                var el = this.getElement();
                                    
                if ($(el).find(".igdv_AllDayEventArea .igdv_AllDayEventScroll").length == 0)            
                    $(el).find(".igdv_AllDayEventArea table:first")
                        .css(($.browser.msie && !Ext.isIE8 ? {"width":"auto"} : {"width": "100%"}))
                        .wrap('<div class="igdv_AllDayEventScroll"></div>');    
                        
                if (callback)
                    this._fixAppBounds();                                       
                
                EnableCalendarAppointmentDetails();
            }                
        },
        show: {
            month: function() { 
                $(this.getElement()).show(); 
            },
            week: function() {
                $(this.getElement()).show();
            },
            day: function() {
                //Set scroll position based on user pref calendar property          
                if((x = this.getScrollPosition()) < 0)
                    x = (this._row0 ? this._row0.offsetHeight : 16) * this._props[9];
                this._divScroll.scrollTop = x;
                                                                            
                $(this.getElement()).show();
                
                __calendar.resize.day.call(this);
            }
        },
        resize: {
            month: function() {},
            week: function() {},
            day: function() {
                var el = this.getElement();
                 
                $(el).height($(el.parentNode).height());
                
                this._fixOnResize = 0;
                this._onResize(1);
                this._fixAppBounds();
            }
        }
    };
}

function AdjustCalendar(panel) {
    if (!panel) 
        return;
        
    $(panel.getEl().dom).find(".x-panel-body").css({"overflow":"hidden"});

    var size = panel.getSize();
    $("#calendar_left").height(size.height - 27);                
    $("#calendar_center").height(size.height - 27);
    $("#calendar_center").width(size.width - 177);
}
               
function RebuildCalendarState() {            
   
    for (var k in __calendar.views) {
        if (__calendar.views[k]) {
            (function() {
                var v = k;
                var fn = __calendar.views[v].callbackRender;
                if (fn) 
                    __calendar.views[v].callbackRender = function(response, context) {
                        fn.call(this, response, context);
                        __calendar.fix[v].call(this, true);
                    };
            })();
            
            var el = __calendar.views[k].getElement();
            el.oncontextmenu = function() { return false; };            
        }
    }                
}

function setCalendarView(view) {

    // set active view
    switch (__calendar.view)
    {        
        case 1:
            __calendar.active = "week";   
            __calendar.activeView = __calendar.views.week;   
            break;
        case 2:
            __calendar.active = "month";
            __calendar.activeView = __calendar.views.month;
            break;
        case 0:
        default:
            __calendar.active = "day";
            __calendar.activeView = __calendar.views.day;
            break;
    }

    // show active view
    if (__calendar.activeView)
    {
        __calendar.fix[__calendar.active].call(__calendar.activeView);
        __calendar.show[__calendar.active].call(__calendar.activeView);
    }
}

// This function enables the markup in the calendar appointments that is passed to the 
// calendar info by the Activity Provider.  
function EnableCalendarAppointmentDetails() 
{
   var x= $('span.content');
     for (i=0;i<x.length;i++)
     {
        //On first load the element will only have 1 childNode yet.
        //We only want to set innerHTML the first time. 
            if (x[i].childNodes.length == 1)
            {
                var textContent = x[i].textContent ;
                if (textContent != undefined) 
                {
                    x[i].innerHTML = x[i].textContent;  
                }                
                else 
                {
                    x[i].innerHTML = x[i].innerText;
                }
            }
     }     
}

//#endregion

// Calendar client event handlers
//#region

function SlxWebScheduleInfo_ActiveDayChanged(scheduleInfo, event, newDate) {
    onDateChanged(newDate);
}

// NOTE: SlxWebScheduleInfo_ActiveDayChanged does not always fire when date changes
//       So hook up Navigate events to call our own onDateChanged handler.
function SlxWebCalendarView_Navigate(calendarView, event, firstDateofMonth) {
    onDateChanged(firstDateofMonth);
}
 
function View_Navigate(view, event, numberOfDays) {
    var scheduleInfo = view.getWebScheduleInfo();
    var date = scheduleInfo.getActiveDay().add(Date.DAY, numberOfDays);
    onDateChanged(date);
}

function onDateChanged(date) {
    // NOTE: Server side ActiveDayChanged does not always fire, so store enw date in cookie.
    cookie.setCookieParm(date ? Ext.util.Format.date(date, 'Y-m-d') : '', 'Date', 'SlxCalendar');

    EventList.setDate(date);
}
 
//#endregion

// Activity dialogs
//#region

var currentActivity;
var currentActivityId;
var currentDate;

function Calendar_MouseUp(oView, oEvent, element) {

    element.oncontextmenu = function() { return false; };
    var mouseType = oEvent.event.button;
    if (mouseType == 2) {
        if (!oEvent.event) {
            oEvent.event = {xy: [250, 250]};
        }
        else {
            oEvent.event = {xy: [oEvent.event.clientX, oEvent.event.clientY]};
        }

        currentActivity = oView.getSelectedActivity();
        var contextMenu;
 
        if (currentActivity) {
            currentActivityId = currentActivity.getDataKey().split("|")[0];
            UpdateServerHiddenFields();
            if (currentActivityId.substring(0,1) == "H") {
                if (typeof(ContextEditActivityHistory) == 'undefined') {
                    ContextEditActivityHistory = 
                        new Ext.menu.Menu({id: 'contextEditActivityHistory'});
                    addToMenu(contextEditActivityHistory_data, ContextEditActivityHistory);
                }        
                ContextEditActivityHistory.showAt(oEvent.event.xy);
            }                
            else {
                if (typeof(ContextEditActivity) == 'undefined') {
                    ContextEditActivity = new Ext.menu.Menu({id: 'contextEditActivity'});
                    addToMenu(contextEditActivity_data, ContextEditActivity);
                }        
                ContextEditActivity.showAt(oEvent.event.xy);                
             }
        } 
        else {
            if (typeof(ContextScheduleActivity) == 'undefined') {
                ContextScheduleActivity = new Ext.menu.Menu({id: 'contextScheduleActivity'});
                addToMenu(contextScheduleActivity_data, ContextScheduleActivity);
            }        
            ContextScheduleActivity.showAt(oEvent.event.xy);
        }
        oEvent.cancel = true;
    }
}  

function SetCurrentDate() 
{
    // For Week and MonthView only, set currentDate
    //     DayView sets currentDate in GetDateOfEvent() on DayView.MouseDown.
    if (__calendar.view === 1 || __calendar.view === 2 )
        currentDate = RoundToQuarterHour(__calendar.scheduleInfo.getActiveDay());
}

/*
    Retrieves the datetime that was clicked by the user based on the location of the click.
    Then changes the ActiveDay/currentDate to this date/time.
    ie. The user clicks 9AM on the DayView, this function calculates that by which 'SLOT' 
    received the click event.
*/
function GetDateOfEvent(oView, oEvent, element) 
{
    if (__calendar.view === 1 || __calendar.view === 2 )
        return;

    var now = '';
    var hour = '';
    var minute = '';
    var slotID = '';
    var duration = '';

    for (var i = 0; i < element.attributes.length; i++) { 
        if (element.attributes[i].nodeValue) {
            if(element.attributes[i].nodeValue.toString().indexOf("SLOT") > -1) {
                slotID = element.attributes[i].nodeValue.toString().substring(4);
            }
        }         
    }

    var x = oView.getWebScheduleInfo();
    var tempDate = x.getActiveDay();
    var newDate = new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate());

    now = new Date();
    
    if (__calendar.view == 0 && isNumeric(slotID)) { // Day View
        duration = oView.getTimeSlotInterval();
        hour = slotID * duration / 60
        if (hour.toString().indexOf('.') > -1) {
            time = hour.toString().split('.');
            hour = time[0];
            minute = time[1];
            switch (minute) {
                case '25': 
                    minute = 15; 
                    break;
                case '50':
                case '5': 
                    minute = 30; 
                    break;
                case '75': 
                    minute = 45; 
                    break;
            }                
        }
        newDate.setHours(hour, minute);     
        hour = newDate.getUTCHours();
        minute = newDate.getUTCMinutes();
        newDate.setFullYear(
            newDate.getUTCFullYear(), newDate.getUTCMonth(), newDate.getUTCDate());
    }	    
    else {
        var now = new Date();
        var hour = now.getUTCHours();
        var minute = now.getUTCMinutes();
    }

    if (minute == 0) {}
    else if (minute <= 15)
        minute = 15;
    else if (minute <= 30)
        minute = 30;
    else if (minute <= 45)
        minute = 45;
    else {
        minute = 0;
        if (hour < 23)
            hour++;
        else
            hour = 0;
    }
	
    newDate.setHours(hour, minute);	
    currentDate = newDate;
}

function RoundToQuarterHour(date) {

    var now = new Date();
    var hour = now.getHours();
    var minute = now.getMinutes();

    if (minute == 0) {}
    else if (minute <= 15)
        minute = 15;
    else if (minute <= 30)
        minute = 30;
    else if (minute <= 45)
        minute = 45;
    else {
        minute = 0;
        if (hour < 23)
            hour++;
        else
            hour = 0;
    }
        
    date.setHours(hour, minute);

    hour = date.getUTCHours();
    date.setFullYear(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    minute = date.getUTCMinutes();
    date.setHours(hour, minute);
    return date;
}	

function isNumeric(text) {

    var validChars = "0123456789.";
    var isNumber=true;
    var chr;

    for (i = 0; i < text.length && isNumber; i++) { 
        chr = text.charAt(i); 
        if (validChars.indexOf(chr) == -1) {
            isNumber = false;
        }
    }
    return isNumber;
}

function SlxWebScheduleInfo_ActivityDialogOpening(oScheduleInfo, oEvent, oDialog, oActivity) 
{
    SetCurrentDate();
        
    var dialogURL;
    if (oActivity.getDataKey() == null) {
        var args = new Object();

        args["type"] = options.defaultActivityType;
        
        if (currentDate)
            args["startdate"] = currentDate.toLocaleString();
            
        dialogURL = "javascript:Link.scheduleActivity(" +  
            Sys.Serialization.JavaScriptSerializer.serialize(args) + ");";
    }  
    else {
        currentActivity = oActivity;
        currentActivityId = oActivity.getDataKey().split("|", 1);
        
        if (oActivity.getImportance() == 2) {
            dialogURL = 'ConfirmActivity.aspx?entityid=' + currentActivityId;
        } else if (oActivity.getLocation() == "recur") {
             UpdateServerHiddenFields();
             $get(clientId.btnEditActivity).click();
             oEvent.cancel = true;
             return;
        } else if (oActivity.getLocation() == "completed") {
            dialogURL = "javascript:Link.editHistory('" + oActivity.getDataKey() + "');";
        } else {
            dialogURL = "javascript:Link.editActivity('" + oActivity.getDataKey() + "');";
        }
    }
 
    window.location = dialogURL;
    oEvent.cancel = true;
}

function UpdateServerHiddenFields() {
    
    $get(clientId.currentActivity).value = currentActivityId;
    if (currentActivity.getLocation() == "recur") {
        $get(clientId.currentActivityIsOccurence).value = "true";
        var occurDate = currentActivity.getDataKey().split("|", 3)[2];
        if (occurDate)
            $get(clientId.occurrenceDate).value = occurDate;
    } 
    else {
        $get(clientId.currentActivityIsOccurence).value = "false";
    }
}

function SlxWebScheduleInfo_ActivityUpdating(
    scheduleInfo, event, activityUpdateProps, activity, id) {
    
//  Infragistics chokes on markup added to subject in post for 
//  SlxWebScheduleInfo_ActivityUpdating.  Since we don't update this data on a resize, 
//  stripping it from the activity properties.
    activity._props[11] = "";
    
    if (activity.getLocation() == "completed") {
        event.cancel = true;
    }
}

//#endregion

// Context menu
//#region
     
function ScheduleActivity(activityType) 
{
    SetCurrentDate();

    var args = new Object();
    args["startdate"] = currentDate.toLocaleString();
    args["type"] = activityType;

    window.location = "javascript:Link.scheduleActivity(" +  
        Sys.Serialization.JavaScriptSerializer.serialize(args) + ");";
}

function ScheduleEvent() 
{
    SetCurrentDate();
    window.location = "ScheduleEvent.aspx?modeid=Insert&startdate=" + 
        encodeURI(currentDate.toLocaleString());
}

function EditActivity() {

    if (currentActivity) {
        if (currentActivity.getImportance() == 2) {
            window.location = 'ConfirmActivity.aspx?entityid=' + currentActivityId; 
        } 
        else if (currentActivity.getLocation() == "recur") {
            $get(clientId.btnEditActivity).click();        
        } 
        else
            Link.editActivity(currentActivityId);
    }
}

function EditHistory() {

    if (currentActivity) {
        if (currentActivityId.substring(0, 1) == "H")
            window.location = "javascript:Link.editHistory('" + currentActivityId + "');";
    }
}

function CompleteActivity() {
 
    if (currentActivity) {
        if (currentActivity.getImportance() == 2){
            window.location = 'ConfirmActivity.aspx?entityid=' + currentActivityId;
        }
        else if (currentActivity.getLocation() == "recur") {
            $get(clientId.btnCompleteActivity).click();
        }
        else
            window.location = "javascript:Link.completeActivity('" + currentActivityId + "');";
    }
}

function DeleteActivity() {
    if (currentActivity) {
        if (currentActivity.getImportance() == 2) {
            window.location = 'ConfirmActivity.aspx?entityid=' + currentActivityId;
        } 
        else if (currentActivity.getLocation() == "recur") {
             $get(clientId.btnDeleteActivity).click();        
        } 
        else {
            Ext.Msg.confirm(
                MasterPageLinks.ActivitiesDialog_DeleteActivityTitle, 
                MasterPageLinks.ActivitiesDialog_DeleteActivity, 
                function(btn) {
                    if (btn == 'yes') {
                        $get(clientId.btnDeleteActivity).click();
                    }        
                }
            );                
        }
    }
}

//#endregion

// Events
//#region

var EventList = 
{
    storeUrl: 'slxdata.ashx/slx/crm/-/activities/event/bymonth',
    month: null,
    userName: null,
    
    setDate: function(date) 
    {
        // if month or user changed, refresh list
        var month = Ext.util.Format.date(date, 'Y-m');
        var isNewMonth = EventList.month !== month;
        var userName = __calendar.scheduleInfo.getActiveResourceName();
        var isNewUser = EventList.userName !== userName;
        if (!isNewMonth && !isNewUser)
            return;

        EventList.userName = userName;
        EventList.month = month;
            
        var q = date ? '?date=' + Ext.util.Format.date(date, 'Y-m-d') : '';
        q += '&user=' + userName;
        var url = this.storeUrl + q;
        this.store.proxy.conn.url = url;
        this.store.load();
    },
    
    dateFormatString: getContextByKey('userDateFmtStr'),
    
    dateRenderer: function(value) 
    {
        return value ? value.format(EventList.dateFormatString) : "";
    },
    
    linkRenderer: function(value, cell, record) 
    {
        var entityId = record.get('id');
        var date = EventList.dateRenderer(value);
        return String.format('<a id="lnk{0}" href="Event.aspx?entityId={0}">{1}</a>', entityId, date);
    },
    typeRenderer: function(value)
    {
        return eval("SR." + value + "_EventType");
    },
    store: new Ext.data.JsonStore(
    {
        root: 'items',
        id: 'id',
        totalProperty: 'count',
        fields: ['id', 'startDate', 'endDate', 'type', 'description']
    }),
    
    render: function() 
    {
        var oldGrid = Ext.getCmp('event-list');
        if (oldGrid)
            oldGrid.destroy();

        var grid = new Ext.grid.GridPanel(
        {
            id: 'event-list',
            title: SR.EventList_Title,
            border: false,
            autoHeight: true,
            autoExpandColumn: 'type',
            cls: 'nowrapgrid',
            stripeRows: true,
            viewConfig: {
                // needed otherwise does not display empty text after initial store load
                // if we don't load store due to month/user unchanged
                deferEmptyText: false, 
                emptyText: SR.EventList_EmptyText,
                autoFill: true,
                scrollOffset: 2
            },
            store: this.store,
            columns: [{
                dataIndex: 'startDate',
                header: SR.EventList_Column_Start,
                renderer: this.linkRenderer
            }, {
                dataIndex: 'endDate',
                header: SR.EventList_Column_End,
                renderer: this.dateRenderer
            }, {
                id: 'type',
                dataIndex: 'type',
                header: SR.EventList_Column_Type,
                renderer: this.typeRenderer
            }]
        });
        grid.getColumnModel().defaultSortable = true;
        grid.render('calendar_events');
    }
};

//#endregion

// Infragistics control overrides
//#region

function overrideWeekViewOnMouseDown()
{
    if (typeof(ig_WebWeekView) === "undefined") return;
    
    ig_WebWeekView.prototype._onMousedown = function(src, evt)
    {
	    if (!this._element.focus)
	        this._element.focus();
	    var scheduleInfo = this.getWebScheduleInfo();
	    if(src.tagName == "IMG")
		    src = src.parentNode;
	    if(this.fireEvent(evt.type, evt, src))
		    return;
	    var uie = src.getAttribute("uie");
	    if(uie == "Appt")
	    {
		    var day = null, e = src;
		    while(e)
		    {
			    if(e.getAttribute && ig_shared.notEmpty(day = e.getAttribute("date")))
				    break;
			    e = e.parentNode;
		    }
		    if(!e || !day || !this._selectDay(day))
			    return;
		    this._selectAppt(src); 
	    }
	    this._selectDay(src.getAttribute("date"));
    }
}

//#endregion

if (typeof(Sys) !== 'undefined') { Sys.Application.notifyScriptLoaded(); }
