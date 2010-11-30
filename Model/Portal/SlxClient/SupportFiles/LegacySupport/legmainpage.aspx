<%@ Page Language="C#" AutoEventWireup="true" CodeFile="legmainpage.aspx.cs" Inherits="Sage.SalesLogix.Client.LegacySupport.legacysupport_legmainpage" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Untitled Page</title>
<script pin="pin" type="text/javascript" src="/slxweb/jscript/sage-common/cookiesobj.js"></script>

<script pin="pin" type="text/javascript">
<!--

	cookie.setCookie(top.document.all.containerdiv.innerText); //do we need to reset the cookie each time the page loads?
	
	
function init() {
	var type = '<%=Request.Params["type"]%>';
	var vURL = '/scripts/slxweb.dll/view?name=';
	switch (type) {
		case 'con' :
			var csearch = uDefault(cookie.getCookieParm('consearch'),'searchfrmcon');
			vURL += csearch + '&ctemplate=conmain&atemplate=accmain&otemplate=oppmain&mode=0&typeid=' + top.GM.GetDefaultGroupID(0);
			break;
		case 'acc' :
			var asearch = uDefault(cookie.getCookieParm("accsearch"),"searchfrmacc");
			vURL += asearch + '&ctemplate=conmain&atemplate=accmain&otemplate=oppmain&mode=1&typeid=' + top.GM.GetDefaultGroupID(1);
			break;
		case 'opp' :
			var osearch = uDefault(cookie.getCookieParm("oppsearch"),"searchfrmopp");
			vURL += 	osearch + "&mode=3&ctemplate=conmain&atemplate=accmain&otemplate=oppmain&typeid=" + top.GM.GetDefaultGroupID(2);
			break;
		case 'tick' :
			var tsearch = uDefault(cookie.getCookieParm("ticksearch"),"csrsearchfrmtick");
			vURL += tsearch + "&ttemplate=csrtickmain&ctemplate=conmain&atemplate=accmain";
			break;
		case 'cal' :
			var caldefuser = cookie.getCookieParm("caldefuser");
			var caldefview = uDefault(cookie.getCookieParm("caldefview"),"calendardayview");
			var calendardayviewincludehistory = uDefault(cookie.getCookieParm("calendardayviewincludehistory"),"T");
			var calendarweekviewincludehistory = uDefault(cookie.getCookieParm("calendarweekviewincludehistory"),"T");
			var calendarmonthviewincludehistory = uDefault(cookie.getCookieParm("calendarmonthviewincludehistory"),"F");
			var includehistory = eval(caldefview + "includehistory");
			vURL += caldefview + "&caluser=" + caldefuser + "&" + caldefview + "includehistory=" + includehistory;
			break;
		case 'wnew' :
			vURL += "welcome&mode=0";
			break;
		case 'lib' :
			vURL += "saleslib&mode=5";
			break;
		case 'rep' :
			vURL += 'blank';
			break;
		case 'proc' :
			var proctab = cookie.getCookieParm("pdeftab");
			vURL += "procmain&mode=" + proctab + "&typeid=" + proctab;
			break;
		case 'act' :
			vURL += 'searchfrmact';
			break;
			
		default :
			vURL += 'blank';
			break;
			
	}
		
	document.all.main_content.src = vURL; 

}

function uDefault(inValue,defValue)
{
	return inValue?inValue:defValue;
}


function refreshView() {

}

-->
</script>

</head>

<frameset cols="0, *" framespacing="0" frameborder="0" border="0" onload="init()">
	<frame src="legblank.aspx" name="leftnav" noresize scrolling="no" marginheight="0" marginwidth="0" />
	<frameset rows="0, *" framespacing="0" frameborder="0" border="0">
		<frame src="legblank.aspx" name="topnav" noresize scrolling="no" marginheight="0" marginwidth="0" />
		<frame src="legblank.aspx" border="5" name="main_content" noresize scrolling="auto" marginheight="0" marginwidth="0" />
	</frameset>
</frameset>

</html>
