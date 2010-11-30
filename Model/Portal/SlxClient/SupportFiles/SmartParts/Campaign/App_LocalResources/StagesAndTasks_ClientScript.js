<script type="text/javascript" language="Javascript" id="MANAGESTAGESCRIPT" >
<!--

function onCompleteStage(cmdCompleteCtrlId, stageContextCtrlId, stageContext)
{
    var cmdCtrl = document.getElementById(cmdCompleteCtrlId);
    var stageContextCtrl = document.getElementById(stageContextCtrlId);
    stageContextCtrl.value = stageContext;
    spm_InvokeClickEvent(cmdCtrl);
}

function onSetCurrent(cmdSetCurrentCtrlId, currentContextCtrlId, currentContext)
{
    var cmdCtrl = document.getElementById(cmdSetCurrentCtrlId);
    var currentContextCtrl = document.getElementById(currentContextCtrlId);
    currentContextCtrl.value = currentContext;
    spm_InvokeClickEvent(cmdCtrl);
}

function onCompleteStageWithDate(sender, cmdCompleteCtrlId, contextCtrlId, contextValue)
{
    var cmdCtrl = document.getElementById(cmdCompleteCtrlId);
    var contextCtrl = document.getElementById(contextCtrlId);
    contextCtrl.value = contextValue + ':' + sender.value;
    spm_InvokeClickEvent(cmdCtrl);
}

function onStartStageWithDate(sender, cmdStartCtrlId, contextCtrlId, contextValue)
{
    var cmdCtrl = document.getElementById(cmdStartCtrlId);
    var contextCtrl = document.getElementById(contextCtrlId);
    contextCtrl.value = contextValue + ':' + sender.value;
    spm_InvokeClickEvent(cmdCtrl);
}

function spm_InvokeClickEvent(control)
{
    if (document.createEvent)
    {
        // FireFox
        var e = document.createEvent("MouseEvents");
        e.initEvent("click", true, true);
        control.dispatchEvent(e);
    }
    else
    {
        // IE
        control.click();
    }
}

function saveState(context)
{
   if (Sage.Services)
     { 
         // Get the client side service:
         var contextservice = Sage.Services.getService("ClientContextService");
         // Check for a value:
         if (contextservice.containsKey("STAGECHANGED"))
         {
             // set a value that currently exists:  
             contextservice.setValue("STAGECHANGED", context);
         } 
         else
         {
             // add a new value:
             contextservice.add("STAGECHANGED", context);
         }
     }
}
-->
</script>