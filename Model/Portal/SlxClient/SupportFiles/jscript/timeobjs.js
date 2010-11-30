/* external script file                               */
/* Copyright ©1997-2006                               */
/* Sage Software, Inc.                                */
/* All Rights Reserved                                */
/*  time.js                                           */
/*  rehash of the time script in Object form          */
/*  also adds functionality from dateformats.js       */
/*  and moves substantial time funcs out of defwindow */
/*  Author: Lisa A. Allen (Shearman)                  */
/*  Rewrite Date: Aug 23, 2001                        */
/*  ================================================  */
/*  Object Methods-This is a singleton object 'class' */
/*  time.cmpDateStrs(dateStr1,dateStr2)               */
/*  time.drawDayNamesSel(selectName)                  */
/*  time.drawMonthDaysSel(selectName)                 */
/*  time.drawMonthNamesSel(selectName)                */
/*  time.fmtDateSpan()                                */
/*  time.fmtDotToSlash(dateStr)                       */
/*  time.fmtFullYear(formObj)                         */
/*  time.fmtFullYearStr(inputStr)                     */
/*  time.fmtServerToJS(dateStr,dateFmt)               */
/*  time.getWeekDayName(num)                          */
/*  time.getMonthName(num)                            */
/*  time.getMonthDays(month,year)                     */
/*  time.getAgeDays(CreateDObj,EndDObj,OutputObj)     */
/*  time.getCookie(cookieName)                        */
/*  time.getLocalTimeDiv()                            */
/*  time.getLocalTimeVer()                            */
/*  time.isBetween(inputStr,lowNum,highNum)           */
/*  time.isLeapYear(year)                             */
/*  time.isValidDateObj(inputObj)                     */
/*  time.isValidDateStr(inputStr)                     */
/*  time.setTimeFrame(obj)                            */
/*  time.setDaySpan(strType)                          */
/*  time.setWeekSpan(strType)                         */
/*  time.setMonthSpan(strType)                        */
/*  time.setQuarterSpan(strType)                      */
/*  time.setYearSpan(strType)                         */
/*  time.setAllSpan()                                 */
/*  time.setTimelessSpan()                            */
/*  time.setDayStart()                                */
/*  time.setDayEnd()                                  */
/*  time.splitTime(aName,aDate)                       */
/*  time.buildDateFromStr(dStr, dateFmt)              */
/*  time.getHoursFromTimeStr(strTime)                 */
/*  time.getMinutesFromTimeStr(strTime)               */
/*  ------------------------------------------------- */
/*  Date object method additions:                     */
/*  <dateobject>.rollDate(numSpans,spanType)          */
/*  <dateobject>.fmtDate(dateFmt)                     */
/*  <dateobject>.fmtTime()                            */
/*	<dateobject>.addWorkMinutes(addMin,dayStart,dayEnd,workWeekends)  */
/*  ================================================= */
/*  Notes:                                            */
/*  ================================================= */

/* Two arrays containing the English Month and weekday names  */
/* These are fed into the methods that draw select controls   */
/* Localising these names only requires creating an alternate */
/* array for each, and using those in the construction of the */
/* Time() object.                                             */

var wkDay = new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");
var monOfy = new Array("January","February","March","April","May","June","July","August","September","October","November","December");


/* First, some modifications to the Date Object's methods  */
/* Any Date Object created on a page with this script has  */
/* These methods available (without the 'Date_' prefix)    */


function Date_rollDate(numSpans,spanType)
{
	/* prototype property for Date objects      */
	/* Takes a number (+ or -) and a spanName   */
	/* And rolls it's own date forward,         */
	/* or backward that number of spans         */
	/* Accounts for variable number of days     */
	/* in a month by checking to see if the     */
	/* day of month is the same after as before */
	/* the roll. If it's not the same, it's     */
	/* assumed that the number of days permonth */
	/* in the target month was less, and it has */
	/* rolled into the next month-- not what we */
	/* want. We correct by subtracting those    */
	/* days back off.                           */
	/* Example: rolling 1 month forward from    */
	/* Aug 31, would ordinarily deal with the   */
	/* discrepancy by setting the date 1 day    */
	/* forward, to Oct. 1. In our case, this    */
	/* is not what we want.                     */
	/* This is effective for months, quarters   */
	/* and years.                               */
	/* ======================================== */

	var msecsPerSecond = 1000;
	var msecsPerMin    = msecsPerSecond * 60;
	var msecsPerHour   = msecsPerMin * 60;
	var msecsPerDay    = msecsPerHour * 24;
	var msecsPerWeek   = msecsPerDay * 7;

	switch (spanType)
	{
		case "second", "S":
			this.setTime(this.getTime() + (numSpans * msecsPerSecond));
			break;
		case "minute", "N":
			this.setTime(this.getTime() + (numSpans * msecsPerMin));
			break;
		case "hour", "H":
			this.setTime(this.getTime() + (numSpans * msecsPerHour));
			break;
		case "day", "D":
			this.setTime(this.getTime() + (numSpans * msecsPerDay));
			break;
		case "week", "W":
			this.setTime(this.getTime() + (numSpans * msecsPerWeek));
			break;
		case "month", "M":
			var monthday = this.getDate()
			this.setMonth(this.getMonth() + numSpans);
			if (this.getDate() != monthday)
			{
				this.rollDate(-(this.getDate()),"D");
			}
			break;
		case "quarter", "Q":
			var monthday = this.getDate();
			this.setMonth(this.getMonth() + (numSpans * 3));
			if (this.getDate() != monthday)
			{
				this.rollDate(-(this.getDate()),"D");
			}
			break;
		case "year", "Y":
			var monthday = this.getDate();
			this.setFullYear(this.getFullYear() + numSpans);
			if (this.getDate() != monthday)
			{
				this.rollDate(-(this.getDate()),"D");
			}
			break;

	}
}

function Date_fmtDate(dateFmt) {
	/* formats the date in the windows short date format passed  */
	/* adapted from formatDate in deprecated dateformats.js      */
	/* this method is attached to all Dates objects on pages     */
	/* using this script and can be called as:                   */
	/*                  string=<dateobject>.fmtDate(dateFmt)     */

    if (dateFmt == null) {dateFmt = 'mm/dd/yyyy';}
	var divChar = getDivChar(dateFmt);

	var imon = this.getMonth() + 1;
	var idat = this.getDate();

	var strMon = ((dateFmt.indexOf('M') > -1) && (imon < 10)) ? '0' + imon : imon;
	var strDat = ((dateFmt.indexOf('D') > -1) && (idat < 10)) ? '0' + idat : idat;

	if (dateFmt.substring(0,1) == 'M' || dateFmt.substring(0,1) == 'm') {
		//return (this.getMonth()+1) + divChar + this.getDate() + divChar + this.getFullYear();
		return strMon + divChar + strDat + divChar + this.getFullYear();
	}
	if (dateFmt.substring(0,1) == 'D' || dateFmt.substring(0,1) == 'd') {
		return strDat + divChar + strMon + divChar + this.getFullYear();
	}
	if (dateFmt.substring(0,1) == 'Y' || dateFmt.substring(0,1) == 'y') {
		return this.getFullYear() + divChar + strMon + divChar + strDat;
	}
}


function getDivChar(dateFmt) {
  /* this function determines date separator for the date format supplied  */
	var divChar = "";
	for (var i=0; i<dateFmt.length; i++) {
		if(isNaN(dateFmt.charAt(i))) {
			if((dateFmt.charAt(i) < "A" || dateFmt.charAt(i) > "Z") && (dateFmt.charAt(i) < "a" || dateFmt.charAt(i) > "z")) {
				divChar = dateFmt.charAt(i);
			}
		}
	}
	return divChar;
}


function Date_fmtTime() {
	/* initialize time-related variables with current time settings */
	var hour = this.getHours();
	var minute = this.getMinutes();
	var ampm = "";

	if (time.getLocalTimeVer() == "12") {
		/* validate hour values	and set value of ampm */
		if (hour >= 12) {
			hour -= 12;
			ampm = " PM";
		} else
			ampm = " AM";
		hour = (hour == 0) ? 12 : hour
	}


	/* add zero digit to a one digit minute */
	if (minute < 10)
		minute = "0" + minute // do not parse this number!

	/* return time string */
	return hour + time.getLocalTimeDiv() + minute + ampm
}



function Date_addWorkMinutes(addMin,dayStart,dayEnd,workWeekends) {
	/* This adds time in minutes to the date object.                       */
	/* This only adds minutes during the work day so if it is 5 min.       */
	/*  until the office closes and we add 60 min, the returned date       */
	/*  will be 55 minutes into the next working day.  This takes          */
	/*  weekends into account if the office does not work weekends.        */


	/*  If the start day is a Sat or Sun and we do not work weekends, then */
	/*  we change the start date to the beginning of the workday on Monday.*/
	if (workWeekends == 'F') {
		if (this.getDay() == 0) { //Sunday - add a day and set time
			this.setDate(this.getDate() + 1);
			this.setHours(0);
			this.setMinutes(dayStart);
		} else if (this.getDay() == 6) { //Saturday - add 2 days and set time
			this.setDate(this.getDate() + 2);
			this.setHours(0);
			this.setMinutes(dayStart);
		}
	}
	//if the 'work day' is less than an hour - we assume they are open 24 hours.
	if (Math.abs(dayEnd - dayStart) < 60) {
		dayEnd = dayStart;
	}

	/* current time in Minutes (same format as dayStart and dayEnd)         */
	var currTimeMin = (this.getHours() * 60) + this.getMinutes();

	/* Scenario 1 - open 24 hours -                                           */
	/*  we just add addMin to date then take weekends into acocunt.         */
	var testDate = new Date(this.getFullYear(), this.getMonth(), this.getDate(), this.getHours(), this.getMinutes());
	if (dayEnd == dayStart) {
	  var min = this.getMinutes() + (addMin - 0);
	  this.setMinutes(min);
	} else if ((dayStart - 0) < (dayEnd - 0)) {
		/* Scenario 2 - open time before close time                               */
		/* How many minutes in a work day?                                      */
		var workDayMin = dayEnd - dayStart;


		/* Scenario 2A- current time is before the office opens.                  */
		/*  so we just start counting from office open time.                    */
		if ((currTimeMin - 0) <= (dayStart - 0)) {
			/* will we end today?  */
			if (addMin < workDayMin) {
				/* yes, we only have today to worry about                           */
			} else {
				/*no, we need to account for office closed time.                    */
				/* non-work timeperiods is the time between closing and opening.    */
				var nonworktimeperiods = parseInt(addMin / workDayMin, 10);
				var nonworkmin = nonworktimeperiods * (1440 - workDayMin);
				addMin = (addMin - 0) + (nonworkmin - 0);
			}
			this.setHours(0);
			this.setMinutes((dayStart - 0) + (addMin - 0));
		} else


		/* Scenario 2B- current time is during the work day.                      */
		if ((currTimeMin - 0) <= (dayEnd - 0)) {
			/* Will we end today?   */
			if (addMin < (dayEnd - currTimeMin)) {
				/* yes, we only have today to worry about                           */
			} else {
				/* no, we need to account for office closed time.                   */
				var nonworktimeperiods = 1 + (parseInt((addMin - (dayEnd - currTimeMin)) / workDayMin, 10));
				/*     1 = time between today and tomorrow                          */
				/*     addMin = minutes to add from now                             */
				/*     dayEnd - currTimeMin = number of minutes before close today  */
				/*     workDayMin = number of minutes in one full workday           */
				var nonworkmin = nonworktimeperiods * (1440 - workDayMin);
				addMin = (addMin - 0) + (nonworkmin - 0);
			}
			this.setMinutes(this.getMinutes() + (addMin - 0));
		} else

		/* Scenario 2C- current time is after the work day.                     */
		if ((currTimeMin - 0) > (dayEnd - 0)) {
			/* nonworktimeperiods calculated as above - except time between       */
			/* today and tomorrow is not a full nonworktimeperiod - we'll add     */
			/* that later.                                                        */
			var nonworktimeperiods = parseInt((addMin / workDayMin), 10);
			var nonworkmin = nonworktimeperiods * (1440 - workDayMin);
			/* here is where we add the nonworktime between today and tomorrow.   */
			nonworkmin = (nonworkmin - 0) + ((1440 - workDayMin) - (currTimeMin - dayEnd));
			addMin = (addMin - 0) + (nonworkmin - 0);
			this.setMinutes(this.getMinutes() + (addMin - 0));
		}
	} else

	/* Scenario 3 - close time before open time                             */
	/*  This would happen in an operation that opens in the evening and is  */
	/*  open past midnight. Not common, but it is possible.                 */
	if ((dayStart - 0) > (dayEnd - 0)) {
		/* How many minutes in a work day?                                    */
		var workDayMin = 1440 - (dayStart - dayEnd);

		/*Scenario 3A - current time is before closing today                  */
		if ((currTimeMin - 0) < (dayEnd - 0)) {
			/* will we end before we close this morning?  */
			if (addMin <= (dayEnd - currTimeMin)) {
				/* yes, we only have this morning to worry about                  */
			} else {
				/*no, we need to account for office closed time.                             */
				var nonworktimeperiods = 1 + (parseInt((addMin - (dayEnd - currTimeMin)) / workDayMin, 10));
				/*     1 = time between close this morning and open this evening.            */
				/*     addMin = minutes to add from now                                      */
				/*     dayEnd - currTimeMin = number of minutes before close this morning    */
				/*     workDayMin = number of minutes in one full workday (night?)           */
				var nonworkmin = nonworktimeperiods * (1440 - workDayMin);
				addMin = (addMin - 0) + (nonworkmin - 0);
			}
			this.setHours(0);
			this.setMinutes((currTimeMin - 0) + (addMin - 0));
		} else

		/* Scenario 3B - current time is before we open this evening          */
		if ((currTimeMin - 0) < (dayStart - 0)) {
			/* Will we end in one work period? */
			if ((addMin - 0) <= (workDayMin)) {
				//yes, so there is really nothing to do.
			} else {
			  //no, there will be non working hours involved
				var nonworktimeperiods = parseInt(addMin / workDayMin, 10);
				var nonworkmin = nonworktimeperiods * (1440 - workDayMin);
				addMin = (addMin - 0) + (nonworkmin - 0);
			}
			this.setHours(0);
			this.setMinutes((dayStart - 0) + (addMin - 0));
		} else

		/* Scenario 3C - current time is after we open in the evening         */
		if ((currTimeMin - 0) >= (dayStart - 0)) {
			var worktimelefttoday = workDayMin - (currTimeMin - dayStart);

			/* Will we end in one work period?  */
			if ((addMin - 0) < (worktimelefttoday - 0)) {
				//yes..
			} else {
				//no, more office closed time...
				var nonworktimeperiods = 1 + (parseInt((addMin - (workDayMin)) / workDayMin, 10));
				/*     1 = time between today and tomorrow                          */
				/*     addMin = minutes to add from now                             */
				/*     currTimeMin - dayStart = number of minutes since we opened  */
				/*     workDayMin = number of minutes in one full workday           */
				var nonworkmin = nonworktimeperiods * (1440 - workDayMin);
				addMin = (addMin - 0) + (nonworkmin - 0);
			}
			this.setMinutes(this.getMinutes() + (addMin - 0));
		}
	}

	if (workWeekends == 'F') {
	  var daysDiff = Math.round((this - testDate)/86400000);
		stDay = testDate.getDay();
		stDay = (stDay == 0) ? 7 : stDay;
		var addDays = 0;
		if (((stDay - 0) + (daysDiff - 0)) > 5) {
			addDays = (2 * ((stDay - 0 + daysDiff)/7));
		}
		this.setDate(this.getDate() + (addDays - 0));
		/* Did we end on a weekend?                                         */
		if (this.getDay() == 0) { //Sunday - add a day
			this.setDate(this.getDate() + 1);
		} else if (this.getDay() == 6) { //Saturday - add 2 days
			this.setDate(this.getDate() + 2);
		}
	}
}





Date.prototype.rollDate = Date_rollDate;
Date.prototype.fmtDate = Date_fmtDate;
Date.prototype.fmtTime = Date_fmtTime;
Date.prototype.addWorkMinutes = Date_addWorkMinutes;

/* Next, define a Time object to be used for manipulating and formatting */
/* Dates and times. Time() is our constructor for the class.             */
/* Time_<name> are prototype functions. They will be called through the  */
/* Time Class as time.<methodname - Time_ prefix>, not as freestanding   */
/* functions.  Example: time.drawDayNamesSel(selectName)  -- correct     */
/*                      Time_drawDayNamesSel(selectName)  -- WRONG!      */

function Time(months,days)
{
	/* Constructor for the Time object class            */
	/* the months and days arguments to the constructor */
	/* are a means of constructing a time object with   */
	/* non-english weekdays and monthnames to pull from */
	/* If they are supplied, the object will use them   */
	/* for display. Otherwise, it will use the defaults */
	/* included with the script as wkDay and monOfy     */
	var sdf = this.getCookie('datefmt');
	if (sdf == '') {
		sdf = this.getCookie('serverFmt');
	}
	//var mn = this.getCookie('MonthNamesLong');
	//var wn = this.getCookie('WkDayNamesLong');
	//var mnArr = mn.split("|");
	//var wnArr = wn.split("|");
	//if (mnArr.length == 12) {
	//	this.months = mnArr;
	//} else {
		this.months = (months?months:monOfy);
	//}
	//if (wnArr.length == 7) {
	//	this.days = wnArr;
	//} else {
		this.days = (days?days:wkDay);
	//}
	this.msecsPerSecond = 1000;
	this.msecsPerMinute = 1000 * 60;
	this.msecsPerHour   = 1000 * 60 * 60;
	this.msecsPerDay    = 1000 * 60 * 60 * 24;
	this.msecsPerWeek   = 1000 * 60 * 60 * 24 * 7;
	this.localTimeDiv = this.getLocalTimeDiv();
	this.localTimeVer = this.getLocalTimeVer();
	if (sdf != '') {
		this.serverDateFmt = sdf;
	} else {
		this.serverDateFmt = 'mm/dd/yyyy';
	}
	this.date = new Date();
	this.navFlag = false;
	this.spanStart = new Date();
	this.spanEnd = new Date();
}

function Time_drawDayNamesSel(selectName)
{
	/* This method will construct an html select element */
	/* and write it in the document where it is called. */
	/* selectName is the name that will be given the element */
	/* in the form. Today's weekday will be auto selected */
	var selString = "<select name='" & selectName & "'>\n";
	for (var i=0; i<this.days.length; i++)
	{
		selString += "<option value='" + this.days[i] + "'";
		if (this.date.getDay() == i)
		{
			selString += " selected";
		}
		selString += ">" + this.days[i] + "</option>\n";
	}
	selString += "</select>";
	document.write(selString);
}

function Time_drawMonthNamesSel(selectName)
{
	/* This method will construct an html select element */
	/* and write it in the document where it is called. */
	/* selectName is the name that will be given the element */
	/* in the form. Today's month will be auto selected */
	var selString = "<select name='" & selectName & "'>\n";
	for (var i=0; i<this.days.length; i++)
	{
		selString += "<option value='" + this.months[i] + "'";
		if (this.date.getMonth() == i)
		{
			selString += " selected";
		}
		selString += ">" + this.months[i] + "</option>\n";
	}
	selString += "</select>";
	document.write(selString);
}

function Time_drawMonthDaysSel(selectName)
{
	/* This method will construct an html select element */
	/* and write it in the document where it is called. */
	/* selectName is the name that will be given the element */
	/* in the form. Today's day of month will be auto selected */
	var selString = "<select name='" & selectName & "'>\n";
	for (var i=1; i<32; i++)
	{
		selString += "<option value='" + i + "'";
		if (this.date.getDate() == i)
		{
			selString += " selected";
		}
		selString += ">" + i + "</option>\n";
	}
	selString += "</select>";
	document.write(selString);
}


function Time_fmtDateSpan()
{

	/* Called by other functions to format a qualified date */
	/* as string in hidden fields on forms for submittal.   */
	/* This function probably needs to be de-americanised.  */
	/* Note the very american output of the formatting      */
	/* Fixing this MAY make a lot of code unneccessary over */
	/* individual pages.                                    */

	this.setDayStart();
	this.setDayEnd();

	var tF = this.serverDateFmt;
	var tFDiv = "";
	var strStart;
	var strEnd;

	for (var i=0; i<tF.length; i++) {
		if(isNaN(tF.charAt(i))) {
			if((tF.charAt(i) < "A" || tF.charAt(i) > "Z") && (tF.charAt(i) < "a" || tF.charAt(i) > "z")) {
				tFDiv = tF.charAt(i);
			}
		}
	}
	strStart = "" + (this.spanStart.getMonth() + 1) + tFDiv + this.spanStart.getDate() + tFDiv + this.spanStart.getFullYear() + "";
	strEnd = "" + (this.spanEnd.getMonth() + 1) + tFDiv + this.spanEnd.getDate() + tFDiv + this.spanEnd.getFullYear() + "+" + this.spanEnd.getHours() + ":" + this.spanEnd.getMinutes() + ":" + this.spanEnd.getSeconds() + "";

	if (this.navFlag == false) {
		document.mainform.sDate.value = strStart;
		document.mainform.eDate.value = strEnd;
	} else {
		sDate = strStart;
		eDate = strEnd;
	}
	this.navFlag = false;
}

function Time_getWeekDayName(num)
{
	/* When passed a string, returns the week day name */
	/* formerly called weekDay                         */

	for (var i=0; i< this.days.length; i++){
		if (num == i)
		{
			return this.days[i];
		}
	}
}

function Time_getMonthName(num)
{
	/* When passed a number, returns the month name */
	/* formerly called theMonth                     */
	for (var i=0; i< this.months.length; i++){
		if (num == i)
		{
			return this.months[i];
		}
	}
	return "";
}

function Time_setTimeFrame(obj)
{
	/* Gets time span  based on activity choice selected. */
	/* previously called setTimeFrame                     */

	if (!obj.options) {
		var timeFrame = obj;
	} else {
		var timeFrame = obj.options[obj.selectedIndex].value;
	}
	if (timeFrame == "notime") {
		this.setAllSpan();
	} else {
		// spanType is cur, nex, lst, tDt
		// spanPeriod is D, W, M, Q, Y
		var spanType = timeFrame.substring(0, timeFrame.length -1);
		var spanPeriod = timeFrame.charAt(timeFrame.length -1);

		switch(spanPeriod) {
			case "D":
				this.setDaySpan(spanType);
				break;
			case "W":
				this.setWeekSpan(spanType);
				break;
			case "M":
				this.setMonthSpan(spanType);
				break;
			case "Q":
				this.setQuarterSpan(spanType);
				break;
			case "Y":
				this.setYearSpan(spanType);
				break;
		}
	}
	this.fmtDateSpan();
}

function Time_setDaySpan(strType)
{
	/* this method finds the start and end times for a single day */
	/* either current, previous, or next */

	this.spanStart = new Date();
	this.setDayStart();

	switch(strType)
	{
		case "cur":
			break;
		case "lst":
			this.spanStart.rollDate(-1,"D");
			break;
		case "nex":
			this.spanStart.rollDate(1,"D");
	}
	this.spanEnd = new Date(this.spanStart.getTime() + (this.msecsPerDay -this.msecsPerSecond));
}

function Time_setWeekSpan(strType)
{
	/* this method finds the start and end times for a single week */
	/* either todate, current, previous, or next    */
	/* todate means the current week, up till -now- */
	this.spanStart = new Date();
	this.setDayStart();
	this.spanStart.rollDate(-(this.spanStart.getDay()),"D")
	switch(strType)
	{
		case "cur":
			break;
		case "lst":
			this.spanStart.rollDate(-1, "W");
			break;
		case "nex":
			this.spanStart.rollDate(1, "W");
			break;
		case "tDt":
			this.spanEnd = new Date();
	}
	if (strType != "tDt")
	{
		this.spanEnd = new Date(this.spanStart)
		this.spanEnd.rollDate(1,"W");
		this.spanEnd.rollDate(-1,"S");
	}
}

function Time_setMonthSpan(strType)
{
	/* this method finds the start and end times for a single month */
	/* either todate, current, previous, or next    */
	/* todate means the current month, up till -now- */
	this.spanStart = new Date();
	this.setDayStart();
	this.spanStart.setDate(1);
	switch(strType)
	{
		case "cur":
			break;
		case "lst":
			this.spanStart.rollDate(-1, "M");
			break;
		case "nex":
			this.spanStart.rollDate(1, "M");
			break;
		case "tDt":
			this.spanEnd = new Date();
	}
	if (strType != "tDt")
	{
		this.spanEnd = new Date(this.spanStart);
		this.spanEnd.rollDate(1,"M");
		this.spanEnd.rollDate(-1,"S");
		this.setDayEnd();
	}

}

function Time_setQuarterSpan(strType)
{
	/* this method finds the start and end times for a single quarter */
	/* either todate, current, previous, or next    */
	/* todate means the current quarter, up till -now- */
	this.spanStart = new Date();
	this.setDayStart();

	/* roll back to start of current month */
	this.spanStart.rollDate(-(this.spanStart.getDate())+1,"D");

	/* roll back to start of current quarter */
	this.spanStart.rollDate(-(this.spanStart.getMonth() % 3),"M");
	switch(strType)
	{
		case "cur":
			break;
		case "lst":
			this.spanStart.rollDate(-3,"M");
			break;
		case "nex":
			this.spanStart.rollDate(3,"M");
			break;
		case "tDt":
			this.spanEnd = new Date();
	}
	if (strType != "tDt")
	{
		this.spanEnd = new Date(this.spanStart);
		this.spanEnd.rollDate(3,"M");
		this.spanEnd.rollDate(-1,"S")
		this.setDayEnd();
	}

}

function Time_setYearSpan(strType)
{
	/* this method finds the start and end times for a single year */
	/* either todate, current, previous, or next    */
	/* todate means the current year, up till -now- */
	this.spanStart = new Date();
	this.setDayStart();

	/* roll back to start of current month */
	this.spanStart.setDate(1);

	/* roll back to start of current year */
	this.spanStart.setMonth(0);
	switch(strType)
	{
		case "cur":
			break;
		case "lst":
			this.spanStart.rollDate(-1,"Y");
			break;
		case "nex":
			this.spanStart.rollDate(1,"Y");
			break;
		case "tDt":
			this.spanEnd = new Date();
	}
	if (strType != "tDt")
	{
		this.spanEnd = new Date(this.spanStart);
		this.spanEnd.rollDate(1,"Y");
		this.spanEnd.rollDate(-1,"S")
		this.setDayEnd();
	}
}

function Time_setAllSpan()
{
	/* this function sets a start date and end date of      */
	/* 100 years on both sides of the current date          */
	/* which is designed to catch all the activities a user */
	/* might have.                                          */
	this.spanStart = new Date();
	this.spanEnd = new Date();
	this.setDayStart();
	this.setDayEnd();
	this.spanStart.rollDate(-100,"Y");
	this.spanEnd.rollDate(100,"Y");
}

function Time_setTimelessSpan()
{
	/* this function may not actually be needed. */
	/* Cannot find it actually being used anyplace */
	this.spanStart = new Date();
	this.spanEnd = new Date();
	this.setDayStart();
	this.setDayEnd();
	this.spanStart.rollDate(-100,"Y");
	this.spanEnd.rollDate(-100,"Y");
}

function Time_setDayStart()
{
	/* this function sets the beginning time fragment */
	/* of spanStart to 00:00:00  */
	this.spanStart.setHours(0);
	this.spanStart.setMinutes(0);
	this.spanStart.setSeconds(0);
}

function Time_setDayEnd()
{
	/* this function sets the ending time fragment */
	/* of spanEnd to 23:59:59  */
	this.spanEnd.setHours(23);
	this.spanEnd.setMinutes(59);
	this.spanEnd.setSeconds(59);
}

function Time_getAgeDays(CreateDObj,EndDObj,OutputObj)
{
	/* rewrite of calcAge function into generic time object */
	/* Calculates the differences between two dates in days */
	/* Always expects a js date (dd/mm/yyyy)                */
	this.SpanStart = new Date(this.fmtDotToSlash(CreateDObj.value))

	if (EndDObj.value != "") {
		this.SpanEnd = new Date(this.fmtDotToSlash(EndDObj.value));
	} else {
		this.SpanEnd = new Date();
	}

	var Age = Math.round((this.SpanStart - this.SpanEnd)/this.msecsPerDay);

	if (OutputObj != "") {
		OutputObj.value = Age;
	} else {
		document.write(Age);
	}

}

function Time_fmtDotToSlash(dateStr)
{
	/* translates dot separators to  /'s or :'s. */
	/* formerly was chgDotToSlash                */

	var hasTime = (dateStr.indexOf(' ') > 0);
	var dateDiv = '';
	var timeDiv = '';
	var dateOnly = '';
	var timeOnly = '';

	if (hasTime) {
		dateOnly = dateStr.substr(0, dateStr.indexOf(' '));
		timeOnly = dateStr.substr(dateStr.indexOf(' ') + 1, 20);
		for (var i=0; i<timeOnly.length; i++) {
			if(isNaN(timeOnly.charAt(i))) {
				if((timeOnly.charAt(i) < "A" || timeOnly.charAt(i) > "Z") && (timeOnly.charAt(i) < "a" || timeOnly.charAt(i) > "z")) {
					timeDiv = timeOnly.charAt(i);
				}
			}
		}
	} else {
		dateOnly = dateStr;
	}

	for (var i=0; i<dateOnly.length; i++) {
		if(isNaN(dateOnly.charAt(i))) {
			if((dateOnly.charAt(i) < "A" || dateOnly.charAt(i) > "Z") && (dateOnly.charAt(i) < "a" || dateOnly.charAt(i) > "z")) {
				dateDiv = dateOnly.charAt(i);
			}
		}
	}

	if (dateDiv != '') {
		dateStr = dateStr.replace(dateDiv, '/');
		dateStr = dateStr.replace(dateDiv, '/');
	}
	if (timeDiv != '') {
		dateStr = dateStr.replace(timeDiv, ':');
		dateStr = dateStr.replace(timeDiv, ':');
	}

	return dateStr;
}

function Time_fmtServerToJS(datestr)
{
	/* prototype method for Time class                   */
	/* takes a datestring, and an input format string    */
	/* and converts it into a proper javascript string   */
	/* input dates may be euro or american going in      */
	/* but will always be american coming out.           */
	/* Function is capable of handling dates in          */
	/* dd/mm/yyyy, mm/dd/yyyy, yyyy/mm/dd formats w/wo   */
	/* military times (dd/mm/yyyy hh:mm:ss etc.)         */
	/* dash separators are also supported.               */

	var divChar = "";
	var dateFmt = this.serverDateFmt;
	var leadChar = dateFmt.substring(0,1);
	var dateParts, dateTimeParts;
	var space = / /;
	var mm, dd, yy;
	var tt = "";
	var startYear = top.pivotyear ? top.pivotyear : 30;
	startYear = Number(startYear);

	for (var i=0; i<dateFmt.length; i++) {
	/*  determines date separator  */
		if(isNaN(dateFmt.charAt(i))) {
			if((dateFmt.charAt(i) < "A" || dateFmt.charAt(i) > "Z") && (dateFmt.charAt(i) < "a" || dateFmt.charAt(i) > "z")) {
				divChar = dateFmt.charAt(i);
			}
		}
	}

	dateTimeParts = datestr.split(space);
	dateParts = dateTimeParts[0].split(divChar);

	if (dateTimeParts.length > 1){
		tt = " " + dateTimeParts[1];
	}

	switch (leadChar)
	{
		case "M","m":
			/* mm/dd/yyyy  formatting */
			mm = 0;
			dd = 1;
			yy = 2;
			break;
		case "D","d":
			/* dd/mm/yyyy formatting */
			dd = 0;
			mm = 1;
			yy = 2;
			break;
		case "Y","y":
			/* yyyy/mm/dd formatting */
			yy = 0;
			mm = 1;
			dd = 2;
			break;
		default:
			mm = 0;
			dd = 1;
			yy = 2;
			break;
	}
	if (dateParts[yy].length == 2){
		intYear = Number(dateParts[yy]);
		if (intYear < startYear) {
		    dateParts[yy] = intYear + 2000;
		} else {
		    dateParts[yy] = intYear + 1900;
		}
	}
	return dateParts[mm] + divChar + dateParts[dd] + divChar + dateParts[yy] + tt;
}

function Time_getLocalTimeDiv() {
	var d = new Date
	var s = d.toLocaleString();
	for (var i=s.length; i>0; --i) {
		if ((s.charAt(i) == '.') || (s.charAt(i) == ':')) { return s.charAt(i); }
	}
	return ':';
}

function Time_getLocalTimeVer() {
	var d = new Date;
	var s = d.toLocaleString();
	var i = s.length - 1;
	if (s.charAt(i) == 'M') {
		return "12";
	} else {
		return "24";
	}
}


function Time_isLeapYear(year) {
	/* Returns true or false, depending on if the year  */
	/* given is a leap year or not. Formerly 'leapYear' */

	if ((year % 4 == 0) && ((year % 100 != 0) || (year % 400 == 0))) {
		return true // is leap year
	} else {
		return false // is not leap year
	}
}

function Time_isBetween(inputStr,lowNum,highNum) {
	/* this function checks the valid range for a passed   */
	/* numeric string variable and returns a true or false */

	var inputNum = parseInt(inputStr,10);
	if (inputNum >= lowNum && inputNum <= highNum) {
		return true;
	} else {
		return false;
	}
}

function Time_getMonthDays(month,year) {
	// create array to hold number of days in each month
	var ar = new Array(12)
	ar[0] = 31 // January
	ar[1] = (this.isLeapYear(year)) ? 29 : 28 // February
	ar[2] = 31 // March
	ar[3] = 30 // April
	ar[4] = 31 // May
	ar[5] = 30 // June
	ar[6] = 31 // July
	ar[7] = 31 // August
	ar[8] = 30 // September
	ar[9] = 31 // October
	ar[10] = 30 // November
	ar[11] = 31 // December

	// return number of days in the specified month (parameter)
	return ar[month];
}

function Time_cmpDateStrs(dateStr1,dateStr2)
{
	/* takes two date -strings-, compares their parts and    */
	/* returns false if any of their parts are not identical */
	/* formerly checkDates2                                  */

	var areEqual = true;
	var date1arr = dateStr1.split("/");
	var date2arr = dateStr2.split("/");

	for (var j=0;j<date1arr.length;j++)
	{
		if (parseInt(date1arr[j],10) != parseInt(date2arr[j],10))
		{
			areEqual = false;
		}
	}

	return areEqual;
}

function Time_splitTime(aName, aDate) {
	/* Takes a US style datestring and uses it's time portion to  */
	/* set <aName>hour, <aName>time, and <aName>min controls with */
	/* it's hours, AM/PM designation, and minutes on the mainform */
	/* Formerly splitTime.                                        */

	/* Modified Feb 2004 for Global Date/Time functionality...    */
	/* It now sets the time to <aName>time control then if it is  */
	/* a timeDisplay object, then it calls object.verify() to     */
	/* make sure it is formatted correctly for the client.        */

	var vDate = (!aDate) ? (new Date()) : (new Date(this.fmtDotToSlash(aDate)));
	var control = eval("document.mainform." + aName + "time");
	var tempHours = vDate.getHours();
	var tempAMPM = 'AM';
	if (tempHours >= 12) {
		tempHours = tempHours - 12;
		var tempAMPM = "PM";
	}

	if(tempHours == 0) {
		tempHours = 12;
	}

	var m = vDate.getMinutes();
	if (m < 10) {
		m = '0' + m;
	}

	control.value = tempHours + this.getLocalTimeDiv() + m + ' ' + tempAMPM;
	if (control.pHour) {
		/* if this is a 'timeDisplay' object, call the verify() method     */
		control.verify();
	}
}

function Time_isValidDateStr(inputStr) {

	/* Validates a passed value is a valid date                */
	/* fixed some issues in the previous incarnation           */
	/* with the way the day/month were being retreived         */
	/* and validated so that the JS tendency to roll improper  */
	/* datestrings forward in creating and setting them no     */
	/* longer prevents the proper validation of what was input */
	/* Formerly validateDate.                                  */

	if (inputStr == "") {
		alert("Be sure to enter all fields");
		return false;
	} else {
		inputStr = this.fmtServerToJS(inputStr,this.serverDateFmt);
		inputStr = this.fmtDotToSlash(inputStr);
		var dateParts = inputStr.split("/");
		var mm=0; var dd=1; var yy=2;
		var day = parseInt(dateParts[dd],10);
		var month = parseInt(dateParts[mm],10);
		var year = parseInt(dateParts[yy],10);
		var top = this.getMonthDays(month-1,year);
		if (!this.isBetween(month,1,12)) {
			alert("Please enter a valid date.");
			return false;
		} else {
			if (!this.isBetween(day,1,top)) {
				alert("Please enter a valid date.");
				return false;
			} else {
				if (!this.isBetween(year,1,9999)) {
					alert("Please enter a valid date.");
					return false;
				}
			}
		}
	return true;
	}
}

function Time_fmtFullYear(formObj) {
// this function takes a two-digit year entry and
// converts it using pivotyear settings in ADMIN
// under Options-System Options.
// Four digit year entries are ignored by this code.
// Formerly convertYear

	var inputDateStr = formObj.value;
	var startYear = this.getCookie("pivotyear");
	if (startYear == "") {
		startYear = 30;
	}
	startYear = Number(startYear);

	if (this.isValidDateStr(inputDateStr)) { // check for a valid date entry

		// I do not like this. It would seem like Feb has a
		// good chance of being screwed up
		// Since we construct a date, and THEN set the fullyear.
		// The number of days could have already rolled over
		// Probably should just deconstruct the date, massage the year
		// And then construct the date object and format from there
		// Fix it!!

		var inputDate = new Date(this.fmtDotToSlash(this.fmtServerToJS(inputDateStr, this.serverDateFmt)));
		var yearStart = inputDateStr.lastIndexOf("/") + 1;
		var inputYear = inputDateStr.substring(yearStart);

		if (inputYear.length == 2) {
			intYear = Number(inputYear);
			if (intYear < startYear) {
				intYear = intYear + 2000;
			} else {
				intYear = intYear + 1900;
			}
			inputDate.setFullYear(intYear);
			formObj.value = inputDate.fmtDate(this.serverDateFmt);
		} else {
			formObj.value = inputDate.fmtDate(this.serverDateFmt);
		}
	} else {
		formObj.value = "";
		formObj.focus();
	}
}

function Time_fmtFullYearStr(inputStr) {
// this function takes a two-digit year entry and
// converts it using default pivotyear settings
// in ADMIN (defaults to 30)
// Four digit year entries are ignored by this code.
// Compare to Time_fmtFullYear(inputObj)... this function
// takes a two-digit year string (or number) as opposed to
// the date input box on the form.

	var startYear = this.getCookie("pivotyear");
	if (startYear == undefined) {
		startYear = 30;
	}
	startYear = Number(startYear);
	if (inputStr.length < 3) {
		intYear = Number(inputStr);
		if (intYear < startYear) {
			intYear = intYear + 2000;
		} else {
			intYear = intYear + 1900;
		}
		return String(intYear);
	} else {
		return twoDigYear;
	}

}



function Time_isValidDateObj(inputObj)
{
	//Validates a passed value is a valid date
	//does not allow for javascript rollover
	//rolls the date back to the last day of the month
	//if 2/30/2000 is entered, output is 2/29/2000
	//if 9/31/2000 is entered, output is 9/30/2000
	//formerly validateDate2

    	var inputStr = this.fmtServerToJS(inputObj.value);
	if (inputStr == "")
	{
		alert("Be sure to enter all fields");
		return false;
	}
	else
	{
		inputStr = this.fmtDotToSlash(inputStr);
		var inputDate = new Date(inputStr);
		var day = inputDate.getDate();
		var month = inputDate.getMonth();
		var year = inputDate.getFullYear();

		var sdate = inputDate.fmtDate(this.serverDateFmt);
		sdate = this.fmtServerToJS(sdate);

		var bool = this.cmpDateStrs(sdate,inputStr);
		if (bool == true)
		{
			var top = this.getMonthDays(month,year);
			if (!this.isBetween(month,0,11))
			{
				alert("Please enter a valid date.");
				return false;
			}
			else
			{
				if (!this.isBetween(day,1,top))
				{
					alert("Please enter a valid date.");
					return false;
				}
				else
				{
					if (!this.isBetween(year,1,9999))
					{
						alert("Please enter a valid date.");
						return false;
					}
				}
			}
			return true;
		}
		else
		{
		    //account for javascript date rollover
		    month = month - 1;
		    day = this.getMonthDays(month,year);
		    inputDate.setMonth(month);
		    inputDate.setDate(day);
		    inputObj.value = inputDate.fmtDate(this.serverDateFmt);
		    return true;
		}
	}
}


function Time_getCookie(cookieName)
{
	/* gets a named cookie from the document.cookie(s) */
	var cookiestring = document.cookie;
	var cookies = cookiestring.split("; ");
	var search = cookieName + "=";
	for (i=0; i < cookies.length; i++) {
		if (cookies[i].indexOf(search) > -1) {
			var aPair = cookies[i].split("=");
			if (aPair[1]) {
				return unescape(aPair[1])
			}
		}
	}
	return '';
}

function Time_buildDateFromStr(dStr,dateFmt) {
	/* this function returns a date object for the date string passed.   */
	/* The second parameter - dateFmt - tells this function what format  */
	/* the date string is in.                                            */
	if ((dStr == '') || (dateFmt == '')) {
		return null;
	}
	/* if a time was also passed in, we need to get rid of it..          */
	if (dStr.indexOf(' ') > 0) {
		dStr = dStr.substring(0, dStr.indexOf(' '));
	}

	if (dateFmt.substr(0, 8).toUpperCase() == 'YYYYMMDD') {
		var y = dStr.substring(0, 4);
		var m = dStr.substring(4, 6);
		var d = dStr.substring(6, 8);
		return new Date(y, m - 1, d);		
	}
	
	var divChar = getDivChar(dateFmt);
	if (dStr.indexOf(divChar) < 0) {
		divChar = getDivChar(dStr);
	}
	
	
	if (dStr.indexOf(divChar) < 0) {
		alert('Error: script could not convert string to date object:  ' + dStr);
		return '';
	}

	var dParts = dStr.split(divChar);
	var initChar = dateFmt.substring(0,1);
	var m,d,y;
	if ((initChar == 'm') || (initChar == 'M')) {
		m = 0;
		d = 1;
		y = 2;
	} else if ((initChar == 'd') || (initChar == 'D')) {
		d = 0;
		m = 1;
		y = 2;
	} else if ((initChar == 'y') || (initChar == 'Y')) {
		y = 0;
		m = 1;
		d = 2;
	} else {
		return null;
	}
	/* Adding pivot year logic - la 6/2002 */
	var startYear = this.getCookie("pivotyear");
	if (startYear == undefined) {
		startYear = 30;
	}
	startYear = Number(startYear);
	if (dParts[y].length < 4) {
		intYear = Number(dParts[y]);
		if (intYear < startYear) {
			intYear = intYear + 2000;
		} else {
			intYear = intYear + 1900;
		}
		dParts[y] = intYear;
	}
	return new Date(dParts[y], (dParts[m] - 1), dParts[d]);
}

function Time_getHoursFromTimeStr(strTime) {
	if (strTime == "") {
		return "";
	}
	var aTimeParts = strTime.split(time.getLocalTimeDiv());
	var iHours = aTimeParts[0];
	if (isNaN(iHours)) {
		while ((isNaN(iHours)) && (iHours.length > 1)) {
			iHours = iHours.substring(1, iHours.length);
		}
	}
	var ampm = "";
	if (aTimeParts[1].toUpperCase().indexOf("A") > -1) {
		ampm = "AM";
	} else if (aTimeParts[1].toUpperCase().indexOf("P") > -1) {
		ampm = "PM";
	}
	if (ampm == "PM") {
		iHours = (iHours == 12) ? 12 : (iHours - 0 + 12);
	} else if (ampm == "AM") {
		iHours = (iHours == 12) ? 0 : iHours;
	}
	return iHours;
}

function Time_getMinutesFromTimeStr(strTime) {
	if (strTime == "") {
		return "";
	}
	var aTimeParts = strTime.split(time.getLocalTimeDiv());
	if (aTimeParts[1].indexOf(" ") > -1) {
		return aTimeParts[1].substring(0, aTimeParts[1].indexOf(" "));
	} else {
		return aTimeParts[1];
	}
}


function writeDateStamp(obj,username,cldatefmt) {
  var d = new Date();			// Declare variables.
  var s = username + ' - ';

 	s += d.fmtDate(cldatefmt) + ' ';	// Use the client short date format
  s += d.toLocaleTimeString();	// Get time (using the user local settings format)

	var strTimeZoneKey = top.GM.TzGetLocalSystemTimeZoneKey();

	s += ' (' + top.GM.TzGetStandardName(strTimeZoneKey) + ')\r';
	obj.value = s + '\n\n' + obj.value;
	//obj.focus();
	// try to move the cursor to the end of the timestamp...
	var tRange = obj.createTextRange();
	if (tRange) {
		tRange.moveEnd('textedit', -1);
		tRange.moveStart('character', s.length);
		tRange.select();
	} else {
		obj.focus();
	}
}


function fmtDateTime2Client(datestr) {
	var cldatefmt = time.getCookie('clDateFmt');
	if (cldatefmt == '') {
		cldatefmt = 'mm/dd/yyyy';
	}
	if (datestr != '' && datestr != ' ') {
		var d = new Date(datestr);
		if (typeof(d) != 'undefined') {
			var tStr = d.fmtTime();
			var dStr = d.fmtDate(cldatefmt)
			window.document.write(dStr + " " + tStr);
		}
	}
}

function fmtTime2Client(datestr) {
	var cldatefmt = time.getCookie('clDateFmt');
	if (cldatefmt == '') {
		cldatefmt = 'mm/dd/yyyy';
	}
	if (datestr != '' && datestr != ' ') {
		var d = new Date(datestr);
		if (typeof(d) != 'undefined') {
			var tStr = d.fmtTime();
			return tStr;
		}
	} else {
		return ' ';
	}
}

function fmtTime_To_Client(datestr) {
	var cldatefmt = time.getCookie('clDateFmt');
	if (datestr != '' && datestr != ' ') {
		var yr = datestr.substring(0,4);
		var mo = datestr.substring(5,7) - 1;
		var dy = datestr.substring(8,10);
		var hr = datestr.substring(11,13);
		var mn = datestr.substring(14,16);

		var d = new Date(yr, mo, dy, hr, mn);
		if (typeof(d) != 'undefined') {
			return d.fmtTime();
		}
	}
	return '';
}

function fmtDateTime_To_Client(datestr) {
	var cldatefmt = time.getCookie('clDateFmt');

	if (cldatefmt == '') {
		cldatefmt = 'mm/dd/yyyy';
	}
	if (datestr != '' && datestr != ' ') {
		var s_yr = datestr.substring(0,4);
		var s_mo = datestr.substring(5,7);
		var s_dy = datestr.substring(8,10);
		var s_hr = datestr.substring(11,13);
		var s_mn = datestr.substring(14,16);

		var yr = s_yr.valueOf();
		var mo = s_mo.valueOf() - 1;
		var dy = s_dy.valueOf();
		var hr = s_hr.valueOf();
		var mn = s_mn.valueOf();

		var d = new Date(yr, mo, dy, hr, mn);
		if (typeof(d) != 'undefined') {
			var tStr = d.fmtTime();
			var dStr = d.fmtDate(cldatefmt)
			window.document.write(dStr + " " + tStr);
		}
	}
}

/* Attach methods to Time() class */

/* control rendering methods */
Time.prototype.drawDayNamesSel = Time_drawDayNamesSel;
Time.prototype.drawMonthNamesSel = Time_drawMonthNamesSel;
Time.prototype.drawMonthDaysSel = Time_drawMonthDaysSel;

/* number to word translation for period names */
Time.prototype.getWeekDayName = Time_getWeekDayName;
Time.prototype.getMonthName = Time_getMonthName;

/* timespan manipulation and formatting methods */
Time.prototype.cmpDateStrs = Time_cmpDateStrs;
Time.prototype.fmtDateSpan = Time_fmtDateSpan;
Time.prototype.fmtDotToSlash = Time_fmtDotToSlash;
Time.prototype.fmtFullYear = Time_fmtFullYear;
Time.prototype.fmtFullYearStr = Time_fmtFullYearStr;
Time.prototype.fmtServerToJS = Time_fmtServerToJS;
Time.prototype.getLocalTimeDiv = Time_getLocalTimeDiv;
Time.prototype.getLocalTimeVer = Time_getLocalTimeVer;
Time.prototype.getAgeDays = Time_getAgeDays;
Time.prototype.getMonthDays = Time_getMonthDays;
Time.prototype.isBetween = Time_isBetween;
Time.prototype.isLeapYear = Time_isLeapYear;
Time.prototype.isValidDateObj = Time_isValidDateObj;
Time.prototype.isValidDateStr = Time_isValidDateStr;
Time.prototype.buildDateFromStr = Time_buildDateFromStr;
Time.prototype.getHoursFromTimeStr = Time_getHoursFromTimeStr;
Time.prototype.getMinutesFromTimeStr = Time_getMinutesFromTimeStr;



Time.prototype.setTimeFrame = Time_setTimeFrame;
Time.prototype.setDaySpan = Time_setDaySpan;
Time.prototype.setWeekSpan = Time_setWeekSpan;
Time.prototype.setMonthSpan = Time_setMonthSpan;
Time.prototype.setQuarterSpan = Time_setQuarterSpan;
Time.prototype.setYearSpan = Time_setYearSpan;
Time.prototype.setAllSpan = Time_setAllSpan;
Time.prototype.setTimelessSpan = Time_setTimelessSpan;

Time.prototype.setDayStart = Time_setDayStart;
Time.prototype.setDayEnd = Time_setDayEnd;

Time.prototype.splitTime = Time_splitTime;
Time.prototype.getCookie = Time_getCookie;

/* Construct an instance of Time() automatically */
var time = new Time();

/////////////////////////////////////////////////////////////////////////////
// http://ajax.asp.net/docs/ClientReference/Sys/ApplicationClass/SysApplicationNotifyScriptLoadedMethod.aspx
/////////////////////////////////////////////////////////////////////////////
if (typeof(Sys) !== 'undefined') { Sys.Application.notifyScriptLoaded(); }
/*
    --------------------------------------------------------
    DO NOT PUT SCRIPT BELOW THE CALL TO notifyScriptLoaded()
    --------------------------------------------------------
*/