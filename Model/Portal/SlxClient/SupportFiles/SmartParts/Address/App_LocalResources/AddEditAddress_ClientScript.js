<script language="javascript" type="text/javascript">
   
    var modeAddressCtrlId = "@ModeID";
    var entityTypeId = "@EntityTypeId";
    var updateEntityModeId = "@UpdateEntityModeId";
    var updateEntityResultId = "@UpdateEntityResultId";
    var updateMessageId = "@UpdateMessageId";
    
    function updateEntityAddress(obj)
    {
       var modeAddressCtrl = document.getElementById(modeAddressCtrlId);
       var entityTypeCtrl = document.getElementById(entityTypeId);
       var updateEntityModeCtrl = document.getElementById(updateEntityModeId);
       var updateEntityResultCtrl = document.getElementById(updateEntityResultId);
       var updateMessageCtrl = document.getElementById(updateMessageId);
            
       //Prompt user to update enity related addresses   
       if(confirm(updateMessageCtrl.value))
       {
            updateEntityResultCtrl.value = "True";
       }
       else
       {
            updateEntityResultCtrl.value = "False";
       }
     }    
 
    
 
</script>
