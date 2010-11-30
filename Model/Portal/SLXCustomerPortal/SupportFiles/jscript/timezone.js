/* external script file                            */
/* Copyright ©1997-2007                            */
/* Sage Software, Inc.                             */
/* All Rights Reserved                             */
/* timezone.js                                      */


function GetTimeZoneInfo()
{
	// output:

	// iBias		:	bias in minutes from GMT
	// iDLTBias		:	change in bias (in minutes) when daylight time is in effect
	// bDLT			:	true if Daylight time observed, false if not
	//					If false, the rest of the output variables will be 0
	// idowStart	:	0(Sunday)..6(Sat) for the day of week of daylight time start
	// idowEnd		:	0(Sunday)..6(Sat) for the day of week of daylight time end

	// inthDayStart	:	1(1st)..5(last) to indicate the nth day of month format of the TIME_ZONE_INFORMATION structure for
	//					daylight time start
	// inthDayEnd	:	1(1st)..5(last) to indicate the nth day of month format of the TIME_ZONE_INFORMATION structure for
	//					daylight time end

	// iMonthStart	:	1(Jan)..12(Dec) to indicate the month of the TIME_ZONE_INFORMATION structure for daylight time start
	// iMonthEnd	:	1(Jan)..12(Dec) to indicate the month of the TIME_ZONE_INFORMATION structure for daylight time end

	// iHourStart	:	0..23 to indicate daylight change time of the TIME_ZONE_INFORMATION structure for daylight time start
	// iHourEnd		:	0..23 to indicate daylight change time of the TIME_ZONE_INFORMATION structure for daylight time end

	// first piece of code determines if the bias changes at two arbritrary points in the current year

	// ------------------------------
	// output vars
	var iBias			= 0;
	var iDLTBias		= 0;
	var bDLT			= false;
	var idowStart		= 0;
	var idowEnd			= 0;
	var inthDayStart	= 0;
	var inthDayEnd		= 0;
	var iMonthStart		= 0;
	var iMonthEnd		= 0;
	var iHourStart		= 0;
	var iHourEnd		= 0;
	var strTZInfo		= "";
	var tzValues;

	// start of routine
	var iYear = new Date().getYear();
	//var iYear = 2004;
	var aDateTest1 = new Date(iYear, 0, 1);
	var aDateTest2 = new Date(iYear, 7, 1);

	iBias = aDateTest1.getTimezoneOffset();
	if ( aDateTest1.getTimezoneOffset() != aDateTest2.getTimezoneOffset())
	// if they don't equal, then we have a change in bias at some point in the year
	{
		// starting from March 1st, we will scan each day
		// and determine when the bias changes.
		// This date was chosen, as no timezones in the
		// Windows Registry have daylight times outside of this.
		var aDate1 = new Date(iYear, 0, 1);

		// Get the start
		var iOldOfs = aDate1.getTimezoneOffset();
		var bFound = false;

		var iHour1 = 0;

		for (var iLoop = 0; iLoop < 180; iLoop++)
		{
			aDate1.setDate( aDate1.getDate()+ 1);
			if (iOldOfs != aDate1.getTimezoneOffset())
			{
				aDate1.setDate( aDate1.getDate() - 1);
				var iHrs = aDate1.getHours();
				for (var iHour = iHrs; iHour < iHrs + 24; iHour++)
				{
					aDate1.setHours(iHour);
					if (iOldOfs != aDate1.getTimezoneOffset())
					{
						aHour1 = aDate1.getHours();
						bFound = true;
						break;
					}
				}
				break;
			}
		}

		if (bFound)	// search for end period
		{
			// determine begin date
			var aDate2 = new Date(iYear, 7, 1);		// starting from August 1st

			var iOldOfs = aDate2.getTimezoneOffset();
			var bFound = false;

			var aHour2 = 0;

			for (var iLoop = 0; iLoop < 180; iLoop++)
			{
				aDate2.setDate( aDate2.getDate() + 1);
				if (iOldOfs != aDate2.getTimezoneOffset())
				{
					aDate2.setDate( aDate2.getDate() - 1);
					// now find the actual hour it crosses over
					// NOTE: the result is always +1 hour, as the
					// JScript date functions automatically add the bias.
					// E.g. if you set date to 02:00:00, at the time daylight
					// adjusts, it will return 03:00:00!
					var iHrs = aDate2.getHours();
					for (var iHour = iHrs; iHour < iHrs + 24; iHour++)
					{
						aDate2.setHours(iHour);
						if (iOldOfs != aDate2.getTimezoneOffset())
						{
							aHour2 = aDate2.getHours();
							bFound = true;
							break;
						}
					}
					break;
				}
			}

			if (bFound)
			{
				bDLT = true;

				if (aDate1.getTimezoneOffset() > aDate2.getTimezoneOffset())
				{
					iBias			= aDate1.getTimezoneOffset();
					iDLTBias		= aDate2.getTimezoneOffset() - aDate1.getTimezoneOffset();

					iHourStart		= aHour2 - 1;
					if (iHourStart < 0)
						iHourStart += 24;

					idowStart		= aDate2.getDay();
					iMonthStart		= aDate2.getMonth();
					inthDayStart	= getnthWeek(aDate2);

					iHourEnd		= (aHour1 + 1) % 24;
					idowEnd			= aDate1.getDay();
					iMonthEnd		= aDate1.getMonth();
					inthDayEnd		= getnthWeek(aDate1);

				}
				else
				{
					//WScript.echo("2");
					//WScript.echo(aDate1.getTimezoneOffset());
					//WScript.echo(aDate2.getTimezoneOffset());
					iBias			= aDate2.getTimezoneOffset();
					iDLTBias		= aDate1.getTimezoneOffset() - aDate2.getTimezoneOffset();

					iHourStart		= aHour1 - 1;
					if (iHourStart < 0)
						iHourStart += 24;

					idowStart		= aDate1.getDay();
					iMonthStart		= aDate1.getMonth() + 1;
					inthDayStart	= getnthWeek(aDate1);

					iHourEnd		= (aHour2 + 1) % 24;
					idowEnd			= aDate2.getDay();
					iMonthEnd		= aDate2.getMonth() + 1;
					inthDayEnd		= getnthWeek(aDate2);
				}
			}
			else
			{
				//WScript.echo("No daylight time");
			}

		}
	}

	tzValues = new Array(iBias, iDLTBias, bDLT, idowStart, idowEnd, inthDayStart, inthDayEnd, iMonthStart, iMonthEnd, iHourStart, iHourEnd);
	strTZInfo = tzValues.toString();

	//document.forms[0].tz_info.value = strTZInfo;
	var elem = document.createElement("INPUT");
	elem.type = "HIDDEN";
	elem.value = strTZInfo;
	elem.name = "tz_info";
	document.forms[0].appendChild(elem);

	function getLastDayofYear(aDate)
	{
		var aDate2 = new Date(aDate.getYear(), aDate.getMonth() < 5 ? 1 : 5, 1);

		var iOldOfs = aDate2.getTimezoneOffset();


		for (var iLoop = 0; iLoop < 180; iLoop++)
		{
			aDate2.setDate( aDate2.getDate() + 1);
			if (iOldOfs != aDate2.getTimezoneOffset())
			{
				aDate2.setDate( aDate2.getDate() - 1);
				return (Math.floor((aDate2.getDate() - 1) / 7) + 1);
			}
		}
		return (0);
	}

}

function getnthWeek(aDate) {
	// Given a date, this returns the nth week the date is on.
	//  Example, if the date is the first tuesday in the month,
	//  this function returns 1.
	//  If the date is the last Sunday in the month, this function
	//  will return either 4 or 5 depending on the year.  (There might
	//  be 4 of that day this year, but 5 next year.)
	if (!aDate) {
		return 0;
	}
	var d = aDate.getDate();
	var dayOfWeek = aDate.getDay();
	var weekNum = 0;
	var tempDate = aDate;
	for (var i = 1; i < d+1; i++) {
		tempDate.setDate(i);
		if (tempDate.getDay() == dayOfWeek) {
			weekNum++;
		}
	}
	return weekNum;
}

YAHOO.util.Event.addListener(window, "load", GetTimeZoneInfo);

/////////////////////////////////////////////////////////////////////////////
// http://ajax.asp.net/docs/ClientReference/Sys/ApplicationClass/SysApplicationNotifyScriptLoadedMethod.aspx
/////////////////////////////////////////////////////////////////////////////
if (typeof(Sys) !== 'undefined') { Sys.Application.notifyScriptLoaded(); }
/*
    --------------------------------------------------------
    DO NOT PUT SCRIPT BELOW THE CALL TO notifyScriptLoaded()
    --------------------------------------------------------
*/