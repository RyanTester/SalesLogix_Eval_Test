<script language="javascript" type="text/javascript">
   
    var opt0CtrlId = "@opt0ID";
    var opt1CtrlId = "@opt1ID";
    var opt2CtrlId = "@opt2ID";
    var opt3CtrlId = "@opt3ID";
    var opt4CtrlId = "@opt4ID";
    var ownerTypeCtrlId = "@ownerTypeID";
       
    function onAssignToTypeChange(ctrlName)
    {
        var radioButtons = document.getElementsByName(ctrlName);
        for (var i = 0; i < radioButtons.length; i ++)
        {
            if (radioButtons[i].checked) 
            {
                SetAssignTo(radioButtons[i].value)  
                SetOwnerType(radioButtons[i].value)
            }
        }   
    }    
 
    function SetAssignTo(ownerType)
    {
        ShowControl(opt0CtrlId, false)
        ShowControl(opt1CtrlId, false)
        ShowControl(opt2CtrlId, false)
        ShowControl(opt3CtrlId, false)
        ShowControl(opt4CtrlId, false)
             
        switch(ownerType)
        {
            case "0": //User/Team
               ShowControl(opt0CtrlId, true)
               break;
            case "1": //Department
               ShowControl(opt1CtrlId, true)
               break;
            case "2": //Contact
               ShowControl(opt2CtrlId, true)
               break;
            case "3": //Other
               ShowControl(opt3CtrlId, true)
               break;
            case "4": //None
               ShowControl(opt4CtrlId, true)
               break;    
            default:
                break;
         }
          
    }
    
    function SetOwnerType(ownerType)
    {
       var ctrl = document.getElementById(ownerTypeCtrlId);
       if(ctrl != null)
       {
          ctrl.value = ownerType;
       }
    }
    
    function ShowControl(ctrlId, show)
    {
        var ctrl = document.getElementById(ctrlId);
        if(ctrl != null)
        {
            if(show)
            {
                ctrl.style.display = 'block';
            }
            else
            {
                ctrl.style.display = 'none';
            }
        }
    }
</script>
