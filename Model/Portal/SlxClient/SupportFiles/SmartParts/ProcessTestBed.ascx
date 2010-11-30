<%@ Control Language="C#" AutoEventWireup="true" CodeFile="ProcessTestBed.ascx.cs" Inherits="SmartParts_ProcessTestBed" %>
<style type="text/css">
    .title
    {
	    font-family: Times New Roman;
	    font-size : 20px;
	    font-weight : bold;
	    color : Navy;
	    padding-top:10px;
	    padding-bottom:10px;
    }
    .linkHeader
    {
	    background-color : #ECECEC;
	    border-bottom : solid 1px navy;
	    padding : 5px;
    }
    .renderedObject
    {
	    border : solid 1px navy;
    }
    .objLabel
    {
	    font-weight: bold;
	    font-size: 10px;
	    padding-right : 10px;
	    width: 100px;
    }
    .objSet
    {
	    padding : 3px;
    }
    .objValue
    {
	    font-size: 10px;
    }
    .notFound{
	    font-family: Times New Roman;
	    font-size : 14px;
	    font-weight : bold;
	    color : Red;
	    padding-left:14px;
    }
    .errorText{
	    font-family: Times New Roman;
	    font-size : 14px;
	    font-weight : bold;
	    color : Red;
	    padding-left:14px;
    }
    .statusText{
	    font-family: Times New Roman;
	    font-size : 14px;
	    font-weight : bold;
	    color : Navy;
	    padding-left:14px;
    }
    .postMessagePanel{
	    margin-top : 10px;
	    border : solid 1px navy;
    }
    .resultsDiv{
	    width: 100%;
	    height: 150px;
	    overflow : auto;
	    border: 1px solid navy;
    }
</style>
<script type="text/javascript">

var regTemplate = new Ext.XTemplate(
    '<div class="renderedObject">',
    '<div class="linkHeader"><a href="javascript:runProcess(\'{Name}\')">{FriendlyName}</a></div>',
    '<div class="objSet">',
    '<span class="objLabel">Name:</span>',
    '<span  class="objValue">{Name}</span>',
    '</div>',
    '<div class="objSet">',
    '<span class="objLabel">Description:</span>',
    '<span  class="objValue">{Description}</span>',
    '</div>',
    '<div class="objSet">',
    '<span class="objLabel">Path:</span>',
    '<span  class="objValue">{ProcessPath}</span>',
    '</div>',
    '<div class="objSet">',
    '<span class="objLabel">Compiled:</span>',
    '<span  class="objValue">{IsCompiled}</span>',
    '</div>',
    '</div>'
);

var runTemplate = new Ext.XTemplate(
    '<div class="renderedObject">',
    '<div class="linkHeader">{Id}&nbsp;<a href="javascript:terminateProcess(\'{Id}\')">Terminate</a></div>',
    '<div class="objSet">',
    '<span class="objLabel">Name:</span>',
    '<span  class="objValue">{Name}</span>',
    '</div>',
    '<div class="objSet">',
    '<span class="objLabel">Description:</span>',
    '<span  class="objValue">{Description}</span>',
    '</div>',
    '<div class="objSet">',
    '<span class="objLabel">Path:</span>',
    '<span  class="objValue">{ProcessPath}</span>',
    '</div>',
    '<div class="objSet">',
    '<span class="objLabel">Compiled:</span>',
    '<span  class="objValue">{IsCompiled}</span>',
    '</div>',
    '<div class="objSet">',
    '<span class="objLabel">Queues:</span>',
    '<span  class="objValue">',
    '<tpl for="AvailableQueues">{QueueUri}{[xindex === xcount ? "" : ", "]}</tpl>',
    '</span>',
    '</div>',
    '</div>'
);

var msgDialog = new Ext.Window({
    width:500,
    height:300,
    closeAction: 'hide',
    plain: true
});

Ext.onReady(initProcessTestBed, null, false);

var ptbTimeoutToken;

function initProcessTestBed(){
    runAll();
    ptbTimeoutToken = setInterval("getRunningProcesses()", 3000);
}

function ptbTryGetUrl(){
    if(Sage.Services.hasService("ClientContextService")){
        var context = Sage.Services.getService("ClientContextService");
        if(context != null){
            if(context.containsKey("ProcessHost")){
                return context.getValue("ProcessHost");
            }
        }
    }
    return null;
}

function runAll(){
    getRegisteredProcesses();
    getRunningProcesses();
}



function getRegisteredProcesses(){
    var baseUrl = ptbTryGetUrl();
    if(baseUrl != null){
        var regStatus = document.getElementById("regStatus");
        regStatus.innerHTML = 'Working...';
        var req = new XMLHttpRequest();
        req.onreadystatechange = function(){
            var target = document.getElementById("registeredDiv");
            if(req.readyState == 4){
                if(req.status == 200){
                    var results = eval(req.responseText);        
                    renderObject(target, results);
                }
                else{
                    target.innerHTML = '<div class="errorText">' + req.status + ' ' + req.statusText + '\r\n' + req.responseText + '</div>';
                }
            }
            regStatus.innerHTML = '';
        }
        var url = escape(baseUrl + "/ProcessManager/RegisteredProcesses");
        req.open("GET", "proxyrequest.ashx?target=" + url, true);
        req.send(null);
    }
}
function getRunningProcesses(){
    var baseUrl = ptbTryGetUrl();
    if(baseUrl != null){
        var runStatus = document.getElementById("runStatus");
        runStatus.innerHTML = 'Working...';
        var req = new XMLHttpRequest();
        req.onreadystatechange = function(){  
            var target = document.getElementById("runningDiv");    
            if(req.readyState == 4){
                if(req.status == 200){
                    var results = eval(req.responseText);       
                    var cboProcesses = document.getElementById("cboProcesses");
                    for(i = cboProcesses.options.length - 1; i >= 0; i--)
                        cboProcesses.remove(i);
                        
                    for(i = 0; i < results.length; i++){
                        var optionX = document.createElement("option");
                        optionX.text = results[i].Id + " - " + results[i].FriendlyName;
                        optionX.value = results[i].Id;
                        cboProcesses.add(optionX);
                    }
                    renderObject(target, results);
                }
                else{
                    
                    target.innerHTML = '<div class="errorText">' + req.status + ' ' + req.statusText + '\r\n' + req.responseText + '</div>';
                }
                runStatus.innerHTML = '';
            }
        }
        var url = escape(baseUrl + "/ProcessManager/RunningProcesses");
        req.open("GET", "proxyrequest.ashx?target=" + url, true);    
        req.send(null);
    }
}

function terminateProcess(processId){
    var baseUrl = ptbTryGetUrl();
    if(baseUrl != null){
        var req = new XMLHttpRequest();
        req.onreadystatechange = function(){  
            if(req.readyState == 4){
                if(req.status == 200){
                    getRunningProcesses();
                }
                else{
                    alert(req.status + " " + req.statusText + "\r\n" + req.responseText);
                }
                
            }
        }
        var url = escape(baseUrl + "/ProcessManager/RunningProcesses(" + processId + ")");
        req.open("POST", "proxyrequest.ashx?target=" + url, false);
        req.setRequestHeader("x-http-method-override", "DELETE");
        req.send(null);
    }
}
function doPostMessage(){
    var cboProcesses = document.getElementById("cboProcesses");
    var txtUri = document.getElementById("txtUri");
    var txtMsg = document.getElementById("txtMessage");
    if(cboProcesses.value != null && cboProcesses.value != "" && txtUri.value != null && txtUri.value != "")
    {
        postMessage(cboProcesses.value, txtUri.value, txtMsg.value);
    }
    else{
        alert("Missing Required Information");
    }
}
function postMessage(processId, messageUri, message){
    var baseUrl = ptbTryGetUrl();
    if(baseUrl != null){
        var req = new XMLHttpRequest();
        req.onreadystatechange = function(){  
            if(req.readyState == 4){
                if(req.status == 200){
                    alert("Message received successfully");
                    getRunningProcesses();
                }
                else{
                    msgDialog.title = "Error Posting Message";
                    msgDialog.html = req.status + " " + req.statusText + "<br>" + req.responseText;
                    msgDialog.show(this);
                }
            }
        }
        var url = escape(baseUrl + "/ProcessManager/RunningProcesses(" + processId + ")/Messages(" + messageUri + ")");
        req.open("POST", "proxyrequest.ashx?target=" + url, true);
        req.send(message);
    }    
}

function runProcess(name){
    var baseUrl = ptbTryGetUrl();
    if(baseUrl != null){
        var req = new XMLHttpRequest();
        req.onreadystatechange = function(){  
            if(req.readyState == 4){
                if(req.status == 200){
                    getRunningProcesses();
                }
                else{
                    alert(req.status + " " + req.statusText + "\r\n" + req.responseText);
                }
            }
        }
        var url = escape(baseUrl + "/ProcessManager/RunningProcesses?name=" + name);
        req.open("POST", "proxyrequest.ashx?target=" + url, true);
        req.send(null);
    }
}

function renderObject(target, objToRender){    
    var result = "";
    if(objToRender.length > 0){
        for(i = 0; i < objToRender.length; i++){
            if(objToRender[i].Id){
                result += runTemplate.apply(objToRender[i]);
            }
            else{
                result += regTemplate.apply(objToRender[i]);
            }
        }
    }
    else{
        result += "<div class=\"notFound\">No items found.</div>";
    }
    target.innerHTML = result;
}

</script>

<div class="title">Registered Processes:&nbsp;&nbsp<span id="regStatus" class="statusText"></span></div>
    <div class="resultsDiv" id="registeredDiv">
    </div>

    <div class="postMessagePanel">
        <div class="linkHeader">Post Message to Process:</div>
        <table style="margin:5px">
            <tr>
                <td>Target Process:</td>
                <td><select id="cboProcesses"></select></td>
            </tr>
            <tr>
                <td>Target Uri:</td>
                <td>
                    <input style="width:100%" type="text" id="txtUri" />
                </td>
            </tr>
            <tr>
                <td valign="top">Message</td>
                <td>
                    <textarea cols="72" rows="4" id="txtMessage"></textarea>
                </td>
            </tr>
            <tr>
                <td colspan="2" align="right"><input type="button" value="Send Message" id="btnPostMessage" onclick="javascript:doPostMessage()" /></td>
            </tr>
        </table>
    </div>

<div class="title">Running Processes:&nbsp;&nbsp<span id="runStatus" class="statusText"></span></div>
<div class="resultsDiv" id="runningDiv">
</div>