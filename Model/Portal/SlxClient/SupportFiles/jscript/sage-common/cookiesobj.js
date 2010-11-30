/* external script file                               */
/* Copyright ©1997-2006                               */
/* Sage Software, Inc.                                */
/* All Rights Reserved                                */
/*  cookies.js                                        */
/*  rehash of the cookies script in Object form       */
/*  Author: Lisa A. Allen (Shearman)                  */
/*  Rewrite Date: Aug 15, 2001                        */

/*  ================================================  */
/*  Object Methods-This is a singleton object 'class' */
/*  cookie.getCookie(cookieName)                      */
/*  cookie.setCookie(strPairs,cookieName)             */
/*  cookie.parseCookie(cookieName)                    */
/*  cookie.getCookieParm(parmName,cookieName)         */
/*  cookie.setCookieParm(strVal,parmName,cookieName)  */
/*  cookie.delCookieParm(parmName,cookieName)         */
/*  cookie.setPickDefault(obj,parmName,cookieName)    */
/*  ================================================= */
/*  Notes:                                            */
/*  1. In all cases the cookieName parameter is       */
/*     optional, and if omitted defaults to the       */
/*     defaultCookie property of the object.          */
/*     This is initialised as "userprefs".            */
/*  2. An instance of this class is automatically     */
/*     created as the last action of this script.     */
/*     The instance is stored in the global variable  */
/*     "cookie" and all methods should be accessed    */
/*     via the class instance.                        */
/*  ================================================= */

function Cookie()
{
	/* cookie class constructor */
	/* this will be a singleton object */
	this.defaultCookie = "userprefs";
}

function Cookie_getCookie(cookieName)
{
	/* gets a named cookie from the document.cookie(s) */
	var cookiestring = document.cookie;
	var cookies = cookiestring.split("; ");
	var search = (cookieName?cookieName:this.defaultCookie) + "=";
	for (i=0; i < cookies.length; i++) {
		if (cookies[i].indexOf(search) > -1) {
			return unescape(cookies[i].split("=")[1])
		}
	}
}

function Cookie_setCookie(strPairs,cookieName)
{
	/* Sets the named cookie and value to the document.cookie */
	document.cookie = (cookieName?cookieName:this.defaultCookie) + "=" + escape(strPairs);
}


function Cookie_parseCookie(cookieName)
{
	/* Breaks the named cookie up into name/value pairs */
	/* returns the pairs as an array for searching over */
	var myCookie = this.getCookie((cookieName?cookieName:this.defaultCookie));
    if (myCookie) {
	    var pairs = myCookie.split("&");
	    return pairs;
	} else {
	    return new Array();
	}
}

function Cookie_getCookieParm(parmName,cookieName)
{
	/* searches for the value of an individual name/value pair stored */
	/* in the cookie, using parseCookie */
	var parms = this.parseCookie(cookieName?cookieName:this.defaultCookie);
	var search = parmName + "=";
	for (var i=0; i<parms.length;i++) {
		if (parms[i].indexOf(search) > -1)
		{
			var vals = parms[i].split("=");
			return (vals[1] ? vals[1] : "");
		}
	}
	return "";
}

function Cookie_setCookieParm(strVal,parmName,cookieName)
{
	/* Replaces, or inserts a named value into the cookie string  */
	var parms = this.parseCookie(cookieName?cookieName:this.defaultCookie);
	var pFound = false;
	var search = parmName + "=";
	for (var i=0; i<parms.length; i++ ) {
		if (parms[i].indexOf(search) > -1) {
			parms[i] = search + strVal;
			pFound = true;
			break;
		}
	}
	if (pFound == false)
	{
		parms[parms.length] = search + strVal;
	}
	this.setCookie(parms.join("&"),(cookieName?cookieName:this.defaultCookie));
}

function Cookie_delCookieParm(parmName,cookieName)
{
	/* remove a parameter from the named cookie's parameters */
	var pairs = this.parseCookie((cookieName?cookieName:this.defaultCookie));
	var search= parmName + "=";
	var retpairs = new Array();
	for (var i=0; i<pairs.length; i++)
	{
		if (pairs[i].indexOf(search) == -1)
		{
			/* loop through the parameters and transfer */
			/* them to a new copy of the array if they  */
			/* are NOT the parameter to be deleted      */
			retpairs[retpairs.length] = pairs[i];
		}
	}
	this.setCookie(retpairs.join("&"),(cookieName?cookieName:this.defaultCookie));
}

/* Hook up method definitions to the Cookie class  */
Cookie.prototype.getCookie = Cookie_getCookie;
Cookie.prototype.setCookie = Cookie_setCookie;
Cookie.prototype.parseCookie = Cookie_parseCookie;
Cookie.prototype.getCookieParm = Cookie_getCookieParm;
Cookie.prototype.setCookieParm = Cookie_setCookieParm;
Cookie.prototype.delCookieParm = Cookie_delCookieParm;

/* Instantiate new cookie object automagically. */
/* Access all Cookie() methods through the cookie instance  */
var cookie = new Cookie();
