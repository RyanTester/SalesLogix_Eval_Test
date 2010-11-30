<%@ Control Language="C#" AutoEventWireup="true" CodeFile="LegacySupportPage.ascx.cs" Inherits="LegacySupportPage" %> 

<script pin="pin" type="text/javascript" src="/slxweb/jscript/sage-common/cookiesobj.js"></script>
<script pin="pin" type="text/javascript" src="/slxweb/jscript/groupmanager.js"></script>
<script pin="pin" type="text/vbscript" src="/slxweb/jscript/groupmanagervb.vbs"></script>

<script pin="pin" type="text/javascript">
<!--
    var helper;
    var helpSearch;
    var helpPath;
    var scriptsPath;
    var timeFmt;
    var pivotyear;
    var webPlusFlag;
    var wF;
    var actwin = null;
    var alarmwin = null;
    var client;
    var multicurrency;
    var GM = new groupmanager();
    var GMvb = makeGroupManagerVb();
    var reportingEnabled;


    function supportpage_onload() {
        //this runs after the legacy support setup page has loaded and updated the cookies, etc.
        resizeMainContentFrame();
        //window.onresize = resizeMainContentFrame;

        reportingEnabled = (GM.ReportServer != "");
        //load the correct legacy content area...
        var url = 'legacysupport/legmainpage.aspx?type=<%=Request.Params["type"] %>';
        document.all.legacy_content.src = url; //'legmainpage.aspx?type=<%=Request.Params["type"] %>';
    }

    function resizeMainContentFrame() {
        var height = document.body.clientHeight;
        document.all.legacy_content.style.height = height + "px";
    }

    function refreshView() {

    }

-->
</script>
<div id="containerdiv">
	<div style="display:none" id="prefscookiediv" runat="server"></div>
</div>
<iframe onload="supportpage_onload()" id="supportpage" height="0px" width="0px" src="/scripts/slxweb.dll/view?name=legacysetup"></iframe>
<iframe id="leftnav" height="0px" width="0px" src="legacysupport/legleftnav.aspx" ></iframe>
<iframe id="topnav" height="0px" width="0px" src="legacysupport/legtopnav.aspx" ></iframe>
<iframe width="100%" id="legacy_content" src="legacysupport/legblank.aspx" ></iframe> 


