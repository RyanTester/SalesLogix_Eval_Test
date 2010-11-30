<script language="javascript" type="text/javascript">
   
var cmdStartImportTestId = "@cmdStartImportTestId";
var cmdLoadResultsId = "@cmdLoadResultsId";
var hdStartTestId = "@hdStartTestId";
var hdCompletedTestId = "@hdCompletedTestId";
var _IsTestComplete = false;
//var _startProcess = "@_startProcess"; //true;
$(document).ready(setupUpdateScripts);

function setupUpdateScripts() 
{
    Sys.WebForms.PageRequestManager.getInstance().add_pageLoaded(ImportTest_PageLoadScript);
}
 
function ImportTest_PageLoadScript()
{
    var startTestCtrl = document.getElementById(hdStartTestId);
    if(startTestCtrl != null)
    {
        //alert(startTestCtrl.value);
        if(startTestCtrl.value == 'true')
        {
            var elementStartCtrl = document.getElementById(cmdStartImportTestId);
            if (elementStartCtrl != null)
            {
              //alert('StartingTest');
              ImportProgress_InvokeClickEvent(elementStartCtrl);
               startTestCtrl.value = 'false';
            }
        }
    }
}
  
function ImportProgress_InvokeClickEvent(control)
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

function OnUpdateTestProgress(progressArea, args)
{
    
    var completedTestCtrl = document.getElementById(hdCompletedTestId);
    if(completedTestCtrl != null)
    {
    
        //alert(args.ProgressData.ProcessCompleted);
        if (args.ProgressData.ProcessCompleted == 'True')
        { 
             if (completedTestCtrl.value == 'true')
             {
                return true;
             } 
             var elementStartCtrl = document.getElementById(cmdLoadResultsId);
             if (elementStartCtrl != null)
             {
               completedTestCtrl.value = 'true'; 
               ImportProgress_InvokeClickEvent(elementStartCtrl);
             }
                       
         }
    }
     return true;
}

</script>
