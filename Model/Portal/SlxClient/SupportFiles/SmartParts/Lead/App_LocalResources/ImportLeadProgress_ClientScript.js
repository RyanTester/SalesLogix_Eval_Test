<script language="javascript" type="text/javascript">
   
 
 var cmdCloseCtrlId = "@cmdCloseCtrlId";
 var _IsCompleted = false;
  
 
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
function OnUpdateProgress(progressArea, args)
{
    if (args.ProgressData.ProcessCompleted=="True")
    {
        if(_IsCompleted)
        {
          return false;
        } 
        var elementStartCtrl = document.getElementById(cmdCloseCtrlId);
        if (elementStartCtrl != null)
        {
              
            ImportProgress_InvokeClickEvent(elementStartCtrl);
            
        }
         _IsCompleted = true;        
        return false;
    }
}

 
</script>
