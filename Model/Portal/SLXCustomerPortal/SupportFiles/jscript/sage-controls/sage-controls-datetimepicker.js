function SLXDateTimePicker(options)
{
    if (typeof(window._datePickers) == 'undefined') {
        window._datePickers = [];
    }
    for (var i = 0; i < window._datePickers.length; i++) {
        if (window._datePickers[i].ClientId == options.ClientID) {
            var dp = window._datePickers[i];
            dp.ShortDate = options.DateFormat
            dp.DisplayTime = options.DisplayTime;
            dp.ShowCal = options.DisplayDate;
            dp.AutoPostBack = options.AutoPostBack;
            dp.Year = options.Year;
            dp.Month = options.Month;
            dp.Day = options.Day;
            dp.Hours = options.Hour;
            dp.Min = options.Minute;
            return dp;
        }
    }
    this.ShortDate = options.DateFormat;
    this.ClientId = options.ClientID;
    this.TextBoxID = options.ClientID + "_TXT";
    this.PanelId = options.ClientID + "_WIN";
    this.ContainerId = options.ClientID + "_Container";
    this.HiddenTextId = options.ClientID + "_Hidden";
    this.HyperTextId = options.ClientID + "_HyperText";
    this.Header = "";
    this.DisplayTime = options.DisplayTime;
    this.Required = options.Required;   
    this.Year = options.Year;
    this.Month = options.Month;
    this.Day = options.Day;
    this.Hours = options.Hour;
    this.Min = options.Minute;
    this.Panel = null;
    this.cal1 = null;
    this.ShowCal = options.DisplayDate;
    this.AutoPostBack = options.AutoPostBack;
    this.OnChangeFN = (options.ClientChangeHandler == "undefined") ? "" : options.ClientChangeHandler;
    this.CalendarDateTime = new Date(options.Year,options.Month-1,options.Day,options.Hour,options.Minute);
    this.HideTimer;
    this.is24HourTime = options.Enable24HourTime;
    this._listeners = {};

    this._listeners[SLXDateTimePicker.BEFORE_SHOW_EVENT] = [];   
    this._listeners[SLXDateTimePicker.BEFORE_HIDE_EVENT] = [];

    this.id = (options.ClientID) ? options.ClientID : "slxdatetimepicker";
    this.containerID = this.ClientID + "_cont";
    
    this.phpDateFormat = ConvertToPhpDateTimeFormat(options.DateFormat);
    var container = document.getElementById(this.containerID);
    if (!container) {
        $("body").append("<div id=\"" + this.containerID + "\"></div>");
    }
    
    //ensure localization constants - these should come from the resource file, but in case something goes wrong...
    if (typeof(_dateTimePickerConstants) == 'undefined')
        _dateTimePickerConstants = {"InvalidFormatError":"The date entered is not a valid date.","InvalidYearMsg":"Year is not 2 or 4 digits: ","InvalidMonthMsg":"Month value is invalid: ","InvalidDayMsg":"Day value is invalid: ","InvalidHourMsg":"Hour value is invalid: ","InvalidMinuteMsg":"Minute value is invalid: ","Invalid12HourMsg":"Invalid 12 Hour time (hour): ","TwoDigitYearMax":29,"Enable24HourTime":false,"MonthNames":["January","February","March","April","May","June","July","August","September","October","November","December",""],"DayNames":["Su","Mo","Tu","We","Th","Fr","Sa"],"MonthYearText":"Choose a month (Control+Up/Down to move years)","NextMonthText":"Next Month (Control+Right)","PrevMonthText":"Previous Month (Control+Left)","TodayToolTip":"{0} (Spacebar)","TodayText":"Today","OKText":"OK","CancelText":"Cancel","SelectADate":"Select a Date","SelectATime":"Select a Time","SelectADateAndTime":"Select a Date and Time"};
  
    this.mainDatePicker = new Ext.DatePicker({
        id: this.id + '_dp',
        name: this.id + '_dp', 
        format: this.phpDateFormat,
        style:'margin-bottom:20px',
//        monthNames : _dateTimePickerConstants.MonthNames,
//        monthYearText : _dateTimePickerConstants.MonthYearText,
//        nextText : _dateTimePickerConstants.NextMonthText,
//        prevText : _dateTimePickerConstants.PrevMonthText,
//        todayTip : _dateTimePickerConstants.TodayToolTip,
//        todayText: _dateTimePickerConstants.TodayText,
        okText : _dateTimePickerConstants.OKText,
        cancelText : _dateTimePickerConstants.CancelText        
    }); 
    
    this.mainTimePicker = new Ext.form.TimeField({
        id: this.id + '_tp',
        name: this.id + '_tp',
        style:'margin-bottom:20px',
        format : this.getTimeFormatString(),
        width:178
    });
    var OKBtn = new Ext.Button({
        id: String.format('{0}_btnOk', this.id),
        name: this.id + '_ok',
        text: _dateTimePickerConstants.OKText,
        minWidth:'84',
        listeners: { click : { fn : this.handleOK, scope: this } }
    });
    var CancelBtn = new Ext.Button({
        id: String.format('{0}_btnCancel', this.id),
        name: this.id + '_cancel',
        minWidth: '84', 
        text: _dateTimePickerConstants.CancelText,
        listeners: { click : { fn : this.handleCancel, scope: this } }    
    });

    var datePanel = new Ext.Panel({
        id: this.id + '_datepanel',
        frame:true,
        bodyStyle:'padding:5px 5px 0',
        width: 200,
        items: [this.mainDatePicker, this.mainTimePicker]
        //items: (options.DisplayTime) ? [this.mainDatePicker, this.mainTimePicker] : [this.mainDatePicker]
    });

    var label = _dateTimePickerConstants.SelectATime;
    if ((options.DisplayDate) && (options.DisplayTime)) { label = _dateTimePickerConstants.SelectADateAndTime; }
    else if (options.DisplayDate) { label = _dateTimePickerConstants.SelectADate; }
    

    this.win = new Ext.Window( {
        title:label,
        contentEl: this.containerID,
        id: this.id + "_slxdpw",
        width : 212,
        height : 340,
        resizable:false,
        closeAction:'hide',
        autoScroll:false,
        constrain: true,
        plain:true,
        modal:true,
        border:false,
        items : [datePanel],
        buttons : [OKBtn, CancelBtn]
    });
    
    this.win.addListener('beforehide', this.beforeHide, this);
        
    window._datePickers.push(this);
};

SLXDateTimePicker.BEFORE_SHOW_EVENT = "beforeShow";
SLXDateTimePicker.BEFORE_HIDE_EVENT = "beforeHide";

SLXDateTimePicker.prototype.addListener = function(event, listener, options) {
    this._listeners[event] = this._listeners[event] || [];  
    
    if (typeof options == "undefined" || options == null)
        options = { hold: -1 };            
                         
    this._listeners[event].push({ listener: listener, evt: options});
};

SLXDateTimePicker.prototype.removeListener = function(event, listener) {
    this._listeners[event] = this._listeners[event] || [];
    
    for (var i = 0; i < this._listeners[event].length; i++)
        if (this._listeners[event][i].listener == listener)
            break;
    
    this._listeners[event].splice(i, 1);
};

SLXDateTimePicker.prototype.beforeShow = function(args) {
    for (var i = 0 ; i < this._listeners[SLXDateTimePicker.BEFORE_SHOW_EVENT].length; i++)
    {
        var listener = this._listeners[SLXDateTimePicker.BEFORE_SHOW_EVENT][i].listener;
        if (typeof listener === "function")
            listener(this, args);    
        else if (typeof listener === "object")
            listener.beforeShow(this, args); 
    }
};

SLXDateTimePicker.prototype.beforeHide = function(args) {
    for (var i = 0 ; i < this._listeners[SLXDateTimePicker.BEFORE_HIDE_EVENT].length; i++)
    {
        var listener = this._listeners[SLXDateTimePicker.BEFORE_HIDE_EVENT][i].listener;
        if (typeof listener === "function")
            listener(this, args);    
        else if (typeof listener === "object")
            listener.beforeHide(this, args); 
    }
};

SLXDateTimePicker.prototype.handleCancel = function(e) {
    this.Hide();
};

SLXDateTimePicker.prototype.showPicker = function() {
    if (this.win && !this.win.isVisible()) {
        var label = _dateTimePickerConstants.SelectATime;
        if ((this.ShowCal) && (this.DisplayTime)) { label = _dateTimePickerConstants.SelectADateAndTime; }
        else if (this.ShowCal) { label = _dateTimePickerConstants.SelectADate; }
        this.win.setTitle(label);
        this.win.show();
    }
};

SLXDateTimePicker.prototype.CanShow = function()
{
    var inPostBack = false;
    if (Sys)
    {
        var prm = Sys.WebForms.PageRequestManager.getInstance();
        inPostBack = prm.get_isInAsyncPostBack();
    }
    if (!inPostBack)
    {
        return true;
    }
    else
    {
//        var id = this.ClientId + "_cal";
//        var handler = function() 
//        {
//            window[id].Show('');
//        }
//        Sage.SyncExec.call(handler);
        return false;
    }
};
    
SLXDateTimePicker.prototype.Show = function()
{
    if (this.CanShow())
    {
        var hours = this.Hours;
        var ampm = "AM";
        if (!this.is24HourTime)
        {
            if (hours > 11) {
                hours = hours - 12;
                ampm = "PM";
            }
        }
        this.mainDatePicker.setVisible(this.ShowCal);
        this.mainTimePicker.setVisible(this.DisplayTime);
        var datestr = this.Year + "-";
        var fmtstr = "Y-m-d h:i:s"
        datestr += (this.Month < 10) ? "0" + this.Month : this.Month;
        datestr += "-";
        datestr += (this.Day < 10) ? "0" + this.Day : this.Day;
        datestr += " ";
        datestr += (hours < 10) ? "0" + hours : hours;
        datestr += ":"
        datestr += (this.Min < 10) ? "0" + this.Min : this.Min;
        datestr += ":00"; 
        if (!this.is24HourTime) {
            datestr += " " + ampm;
            fmtstr += " A";
        }
        var date = Date.parseDate(datestr, fmtstr);
        if (this.ShowCal)
        {
            this.setDate(date);
        } 
        else if (this.DisplayTime)
        {
            this.mainTimePicker.setValue(date);
        }
        else return;
        if (!this.ShowCal)
        {
          this.win.height = 120;
        }
        this.beforeShow();
        this.showPicker();
    }
};

SLXDateTimePicker.prototype.Hide = function()
{
    this.beforeHide();
    if ((this.win) && this.win.isVisible()) {
        this.win.hide();
    }
};



SLXDateTimePicker.prototype.handleOK = function(e) {
    //var retDate = this.mainDatePicker.getValue(); //gives a date with 0:00:00 time
    var retDate = this.mainDatePicker.activeDate;  // getValue() is documented, but doesn't return the "active" date if the user changes month, year, or day without clicking.
    if (this.DisplayTime) {
        var timestr;
        var timeDivStr = this.getTimeDivChar();
        if (!this.mainTimePicker.isValid()) {
            //alert(this.Hours);
            if (this.is24HourTime) {
                timestr = this.Hours + timeDivStr + this.Min;
            } else {
                timestr = (this.Hours > 11) ? this.Hours - 12 : this.Hours;
                timestr += timeDivStr;
                timestr += (this.Min < 10) ? "0" + this.Min : this.Min;
                timestr += (this.Hours > 11) ? " PM" : " AM";
            }
            this.mainTimePicker.setValue(timestr);
        }
        timestr = this.mainTimePicker.getValue();  // gives time string value  "1:56 PM" or "13:56"
        if (this.is24HourTime) {
            var timeParts = timestr.split(timeDivStr);
            retDate = retDate.add(Date.HOUR, timeParts[0]).add(Date.MINUTE, timeParts[1]);
        } else {
            var timePartsA = timestr.split(" ");
            var timeParts = timePartsA[0].split(timeDivStr);
            var h = timeParts[0];
            var m = timeParts[1];
            if ((timePartsA[1].substr(0,1).toUpperCase() == "P")  && (h < 12)){
                h = h - 0 + 12;
            } else if ((timePartsA[1].substr(0,1).toUpperCase() == "A") && (h == 12)) {
                h = 0;
            }
            retDate = retDate.add(Date.HOUR, h).add(Date.MINUTE, m);
        }
    }
    this.Year = retDate.getFullYear();
    this.Month = retDate.getMonth() + 1;
    this.Day = retDate.getDate();
    this.Hours = retDate.getHours();
    this.Min = retDate.getMinutes();
    
    var hasChanged = ((this.CalendarDateTime.getFullYear() != retDate.getFullYear()) ||
          (this.CalendarDateTime.getMonth() != retDate.getMonth()) ||
          (this.CalendarDateTime.getDate() != retDate.getDate()) ||
          (this.CalendarDateTime.getHours() != retDate.getHours()) ||
          (this.CalendarDateTime.getMinutes() != retDate.getMinutes()));
    

    this.Hide();
    var textValue = $("#" + this.TextBoxID).attr('value');
    if ((hasChanged) || (textValue == "")) {
        var selectedDate = this.fmtDate();  // fmtDate sets this.CalendarDateTime
        $('#' + this.TextBoxID).attr('value', selectedDate);  
        // if it is hyperlink mode, set the link text:
        $("#" + this.HyperTextId).text(selectedDate);
        this.InvokeChangeEvent(document.getElementById(this.TextBoxID));  
    }
};

SLXDateTimePicker.prototype.fmtDate = function()
{
    this.CalendarDateTime = new Date(this.Year,this.Month-1,this.Day,this.Hours,this.Min);
    var hidden = document.getElementById(this.HiddenTextId);
    
    hidden.value = this.Year + "," + this.Month + "," + this.Day + "," + this.Hours + "," + this.Min;
    var result = "";

    if (this.ShowCal)
    {
        var divChar = this.getDivChar();
        var strMon = this.Month;
        var strDat = this.Day;
        if (this.ShortDate.substring(0,1).toUpperCase() == 'MM')
        {
            strMon = (strMon < 10) ? '0' + strMon : strMon;            
        }
        if (this.ShortDate.substring(0,1).toUpperCase == 'DD')
        {
            strDat = (strDat < 10) ? '0' + strDat : strDat;
        }
 
        if (this.ShortDate.substring(0,1) == 'M' || this.ShortDate.substring(0,1) == 'm') {
            result = strMon + divChar + strDat + divChar + this.CalendarDateTime.getFullYear();
        }
        if (this.ShortDate.substring(0,1) == 'D' || this.ShortDate.substring(0,1) == 'd') {
            result = strDat + divChar + strMon + divChar + this.CalendarDateTime.getFullYear();
        }
        if (this.ShortDate.substring(0,1) == 'Y' || this.ShortDate.substring(0,1) == 'y') {
            result = this.CalendarDateTime.getFullYear() + divChar + strMon + divChar + strDat;
        }
        if (this.DisplayTime) 
        { 
            result += " "; 
        }    
    }
    if (this.DisplayTime) 
    { 
        var timeDivStr = this.getTimeDivChar();
        var strHour = this.Hours;
        var strMin = this.Min;
        if (strMin < 10) { strMin = "0" + strMin; }
        if (this.ShortDate.indexOf('H') > -1)
        {
            result += strHour + timeDivStr + strMin;
        }
        else if (this.ShortDate.indexOf('h') > -1)
        {
            var str12Hour = this.Hours;
            if (this.Hours == 0) { str12Hour = "12"; }
            var strMeridian = "AM";
            if (this.Hours >= 12)
            {
                if (this.Hours > 12)
                {
                    str12Hour = (this.Hours -12);
                }
                strMeridian = "PM";
            }
            result += str12Hour + timeDivStr + strMin + " " + strMeridian;
        }
        else { result += this.CalendarDateTime.toLocaleTimeString(); }
    }
    if (this.OnChangeFN != "")
    {
        hidden.fireEvent("onchange");
        //this.OnChangeFN.call();
    }
    return result; 
};

SLXDateTimePicker.prototype.ParseDateTime = function()
{
  var error = false;
  try
  {
    var strDateTime = document.getElementById(this.TextBoxID).value;
    if (strDateTime == "" && this.Required != true)
    {
         var hidden = document.getElementById(this.HiddenTextId);
         hidden.value = "";
         return;
     }
    var arrayDateTime = strDateTime.split(" ");
    var strDate = "";
    var strTime = "";
    var strMeridian = "";
    if (this.ShowCal)
    {
        strDate = arrayDateTime[0];
        if (arrayDateTime.length > 1)
        {
            strTime = arrayDateTime[1];
        }
        if (arrayDateTime.length > 2)
        {
            strMeridian = arrayDateTime[2];
        }
    }
    else 
    {
        strTime = arrayDateTime[0];
        if (arrayDateTime.length > 1)
        {
            strMeridian = arrayDateTime[1];
        }
    }
    var divChar = this.getDivChar();
    var items = new Array(3);
    if (this.ShowCal)
    {
        var dividerIndex = 0;
        for (var i=0; i<strDate.length; i++)
        {
            if (strDate.charAt(i) == " ") { break; }
            if (strDate.charAt(i) == divChar)
            {
                dividerIndex++;
            } 
            else
            {
                if (items[dividerIndex] == undefined)
                {
                    items[dividerIndex] = strDate.charAt(i);
                }
                else
                {
                    items[dividerIndex] += strDate.charAt(i);
                }
            }
        }
        //alert(items[0] + " " + items[1] + " " + items[2]);
        if (this.ShortDate.substring(0,1) == 'M' || this.ShortDate.substring(0,1) == 'm') {
            this.Month = Number(items[0]);
            this.Day = Number(items[1]);
            this.Year = Number(items[2]);
        }
        if (this.ShortDate.substring(0,1) == 'D' || this.ShortDate.substring(0,1) == 'd') {
            this.Day = Number(items[0]);
            this.Month = Number(items[1]);
            this.Year = Number(items[2]);
        }
        if (this.ShortDate.substring(0,1) == 'Y' || this.ShortDate.substring(0,1) == 'y') {
            this.Year = Number(items[0]);
            this.Month = Number(items[1]);
            this.Day = Number(items[2]);
        }
        
        if ((isNaN(this.Year)) || ((this.Year > 99) && (this.Year < 1000)) || (this.Year > 9999)) { throw _dateTimePickerConstants.InvalidYearMsg;}
        else if (this.Year < 100)
        {
            if (this.Year > _dateTimePickerConstants.TwoDigitYearMax) {this.Year = this.Year + 1900;}
            else {this.Year = this.Year + 2000;}
        }
        if ((isNaN(this.Month)) || (this.Month < 1) || (this.Month > 12)) { throw _dateTimePickerConstants.InvalidMonthMsg + this.Month;}
        if ((isNaN(this.Day)) || (this.Day < 1) || (this.Day > 31)) { throw _dateTimePickerConstants.InvalidDayMsg + this.Day;}
    }
    if (strTime != "")
    {
        var timeDivStr = this.getTimeDivChar();
        var hourOffset = 0;
        items = strTime.split(timeDivStr);
        this.Hours = Number(items[0]);
        if (strMeridian != "")
        {
            if (this.Hours > 12) { throw _dateTimePickerConstants.Invalid12HourMsg + this.Hours;}
            if (this.Hours == 12) { this.Hours = 0; }
            if (strMeridian.indexOf("PM") > -1)
            {
                hourOffset = 12;
            }
            this.Hours = this.Hours + hourOffset;
        }
        this.Min = Number(items[1]);
        if ((isNaN(this.Hours)) || (this.Hours < 0) || (this.Hours >= 24)) { throw _dateTimePickerConstants.InvalidHourMsg + this.Hours;}
        if ((isNaN(this.Min)) || (this.Min < 0) || (this.Min >= 60)) { throw _dateTimePickerConstants.InvalidMinuteMsg + this.Min;}
    }
    var tempDate = this.CalendarDateTime;
    this.CalendarDateTime = new Date(this.Year,this.Month-1,this.Day,this.Hours,this.Min);
    if (this.CalendarDateTime.getMonth() != (this.Month -1)) 
    { 
        this.CalendarDateTime = tempDate;
        throw "error"; 
    }
    var hidden = document.getElementById(this.HiddenTextId);
    hidden.value = this.Year + "," + this.Month + "," + this.Day + "," + this.Hours + "," + this.Min;
    if (this.cal1 != null)
    {
        this.cal1.setYear(this.Year);
        this.cal1.setMonth(this.Month-1);
        this.cal1.select(this.CalendarDateTime);
        this.cal1.render();
    }
    var selectedDate = this.fmtDate()
    document.getElementById(this.TextBoxID).value = selectedDate;
    
  }
  catch(err)
  {
      error = true;
      alert(_dateTimePickerConstants.InvalidFormatError + " " + err);
      this.Year = this.CalendarDateTime.getFullYear();
      this.Month = this.CalendarDateTime.getMonth() + 1;
      this.Day = this.CalendarDateTime.getDate();
      this.Hours = this.CalendarDateTime.getHours();
      this.Min = this.CalendarDateTime.getMinutes();
      var selectedDate = this.fmtDate()
      document.getElementById(this.TextBoxID).value = selectedDate;
      this.Show(this.ShowCal, this.DisplayTime);
  }
  if ((!error) && (this.AutoPostBack))
  {
      if (Sys)
      {
          Sys.WebForms.PageRequestManager.getInstance()._doPostBack(this.TextBoxID, null);
      }
      else
      {
          document.forms(0).submit();
      }
  }
};
 
SLXDateTimePicker.prototype.getDivChar = function()
{
/* this function determines date separator for the date format supplied  */
    var divChar = "";
    for (var i=0; i<this.ShortDate.length; i++) {
        if(isNaN(this.ShortDate.charAt(i))) {
            if((this.ShortDate.charAt(i) < "A" || this.ShortDate.charAt(i) > "Z") && (this.ShortDate.charAt(i) < "a" || this.ShortDate.charAt(i) > "z")) {
                divChar = this.ShortDate.charAt(i);
                break;
            }
        }
    }
    return divChar;
};

SLXDateTimePicker.prototype.getTimeDivChar = function() {
/* this function determines time separator for the date format supplied  */
    if (this.DisplayTime) {
        var fmtParts = this.ShortDate.split(" ");
        if (fmtParts.length > 1) {
            var timeFmt = fmtParts[1];
            for (var i=0; i < timeFmt.length; i++) {
                if (isNaN(timeFmt.charAt(i))) {
                    if ((timeFmt.charAt(i) < "A" || timeFmt.charAt(i) > "Z") && (timeFmt.charAt(i) < "a" || timeFmt.charAt(i) > "z")) {
                        return timeFmt.charAt(i);
                    }
                }
            }
        }
    }
    return ":";
};

SLXDateTimePicker.prototype.getTimeFormatString = function() {
    var divChar = this.getTimeDivChar();
    var time12 = String.format("g{0}i A", divChar);
    var time24 = String.format("G{0}i", divChar);
    return (this.is24HourTime) ? time24 : time12;
}

SLXDateTimePicker.prototype.setDate = function(objDate)
{
    this.Year = objDate.getFullYear();
    this.Month = objDate.getMonth() + 1;
    this.Day = objDate.getDate();
    this.CalendarDateTime = new Date(this.Year,this.Month-1,this.Day,this.Hours,this.Min);
    var hidden = document.getElementById(this.HiddenTextId);
    hidden.value = this.Year + "," + this.Month + "," + this.Day + "," + this.Hours + "," + this.Min;
    this.mainDatePicker.setValue(objDate);
    this.mainTimePicker.setValue(objDate);
};

SLXDateTimePicker.prototype.InvokeChangeEvent = function(cntrl)
{
    if (document.createEvent)
    {
        //FireFox
        var evObj = document.createEvent('HTMLEvents'); 
        evObj.initEvent ('change', true, true); 
        cntrl.dispatchEvent(evObj);
    }
    else
    {
        //IE
        cntrl.fireEvent('onchange');
    }
};