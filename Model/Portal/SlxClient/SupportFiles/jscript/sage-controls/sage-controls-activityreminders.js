function ReminderTimer(reminderId, userId, message, delay, clientId)
{
    this.Delay = delay;
    this.ElapsedTime = GetCookieInt("Elapsed", "SlxReminder", 0);
    this.TimerIsRunning = false;
    this.TimerId = null;
    this.ReminderId = reminderId;
    this.ClientId = clientId;
    this.UserId = userId;
    this.Message = message;
    this.StartTimer();
}

function GetCookieInt(valuename, cookiename, defaultvalue)
{
    var tempVal = cookie.getCookieParm(valuename, cookiename);
    return (tempVal == "") ? defaultvalue : parseInt(tempVal);
}

function ReminderTimer_StartTimer()
{
    this.StopTimer();
    this.TimerIsRunning = true;
    this.TimerId = self.setTimeout("ReminderTimerObj.CheckTimeOut()", 15000);
}

function ReminderTimer_StopTimer()
{
    if (this.TimerIsRunning)
    {
        clearTimeout(this.TimerId);
    }
    timerRunning = false;
}

function ReminderTimer_CheckTimeOut()
{
    var temp = this.ElapsedTime + 15000;
    if (temp >= this.Delay)
    {
        this.ElapsedTime = 0;
        this.TimeOut();
    }
    else
    {
        this.ElapsedTime = temp;
        cookie.setCookieParm(this.ElapsedTime, "Elapsed", "SlxReminder");
        this.StartTimer();
    }
}

function ReminderTimer_TimeOut()
{ 
    var self = this;
          
    if ((typeof(RolloverObj) != "undefined") && (RolloverObj.RollingOver)) return;
  
    $.get("SLXReminderHandler.aspx?user=" + this.UserId, function(data, status) {
        self.HandleHttpResponse(data);
    });
    
    this.StartTimer();
    
}

function ReminderTimer_HandleHttpResponse(result)
{
    if (result == "NOTAUTHENTICATED")
    {
        window.location.reload(true);
        return;
    }
    if (isNaN(result)) { return; }
    
    //This block supports the Activity Reminder Toolbar button
    var reminderButton = Ext.getCmp('toolbar_Reminders');    
    if (reminderButton)
    {
        reminderButton.setText(String.format("{0} ({1})", this.Message, result));
        if (result == "0")
        {        
            //Use a try because if this has already been removed it will throw an error in Firefox
            //No hasClass Method exists
            try{reminderButton.removeClass("x-btn-highlight");}
            catch(e){}
        }
        else
        {
           reminderButton.addClass("x-btn-highlight");
        }
     }
     // End Activity Reminder Toolbar button block
     
    //This block supports the Activity Reminder UserControl
    var text = document.getElementById(this.ReminderId);
    if (text)
    {
        text.innerHTML = String.format("{0} ({1})", this.Message, result);
        var outerElem = document.getElementById(this.ClientId);
        if (result == "0")
        {
            Ext.get(this.ClientId).removeClass("ReminderAlert").addClass("ReminderNoAlert");
        }
        else
        {
            Ext.get(this.ClientId).removeClass("ReminderNoAlert").addClass("ReminderAlert");
        }
    }
    // End Activity Reminder UserControl block
}

ReminderTimer.prototype.StartTimer = ReminderTimer_StartTimer;
ReminderTimer.prototype.StopTimer = ReminderTimer_StopTimer;
ReminderTimer.prototype.TimeOut = ReminderTimer_TimeOut;
ReminderTimer.prototype.CheckTimeOut = ReminderTimer_CheckTimeOut;
ReminderTimer.prototype.HandleHttpResponse = ReminderTimer_HandleHttpResponse;

function ActivityRollover(message, userId)
{
    this.RollingOver = false;
    this.message = message;
    this.UserId = userId;
}

ActivityRollover.prototype.DoRollovers = function()
{
    var NumberToRoll = 20;
    if (typeof(roxmlhttp) == "undefined") {
        roxmlhttp = YAHOO.util.Connect.createXhrObject().conn;
    }
    var vUrl = String.format("SLXReminderHandler.aspx?user={0}&Rollover=T&Count={1}", this.UserId, NumberToRoll);
    roxmlhttp.open("GET", vUrl, true);
    roxmlhttp.onreadystatechange = function() { RolloverObj.RolloverChild(vUrl, this.message);};
    roxmlhttp.send(null);
}

ActivityRollover.prototype.RolloverChild = function(vURL, msg)
{
    if (roxmlhttp.readyState == 4)
    {
        if (roxmlhttp.responseText == "NOTAUTHENTICATED")
        {
            window.location.reload(true);
            return;
        }
        var NumberLeft = parseInt(roxmlhttp.responseText);
        if ( NumberLeft > 0) 
        {
            this.RollingOver = true;
            self.setTimeout("SetWarning(" + NumberLeft + ", '" + this.message + "')", 100);
            roxmlhttp.open("GET", vURL, true);
            roxmlhttp.onreadystatechange = function() { RolloverObj.RolloverChild(vURL, this.message);};
            roxmlhttp.send(null);
        }
        else
        {
            self.setTimeout("ClearWarning()", 500);
        }
    }
}

function SetWarning(total, msg)
{
    var msgService = Sage.Services.getService("WebClientMessageService");
    if (msgService)
    { 
        msgService.showClientMessage(RolloverObj.message.replace("%d", total)); 
    } 
}
function ClearWarning()
{
    var msgService = Sage.Services.getService("WebClientMessageService");
    if (msgService)
    { 
        msgService.hideClientMessage();
    } 
    RolloverObj.RollingOver = false;
}
