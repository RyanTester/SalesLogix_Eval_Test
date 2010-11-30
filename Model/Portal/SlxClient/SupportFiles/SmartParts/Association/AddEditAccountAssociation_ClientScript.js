AddEditAccountAssociation = function(modeAssocCtrlId, luToIdDialogCtrlId, lblBackRelationAccountCtrlId,
    currentAccountIdCtrlId, cmdCloseCtrlId, msgCanNotAssociate) 
    {
    this.modeAssocCtrlId = modeAssocCtrlId;
    this.luToIdDialogCtrlId = luToIdDialogCtrlId;
    this.lblBackRelationAccountCtrlId = lblBackRelationAccountCtrlId;
    this.currentAccountIdCtrlId = currentAccountIdCtrlId;
    this.cmdCloseCtrlId = cmdCloseCtrlId;
    this.msgCanNotAssociate = msgCanNotAssociate;
}

 //YAHOO.util.Event.addListener(window, 'load', setupUpdateScripts);
//$(document).ready(this.setupUpdateScripts);

AddEditAccountAssociation.prototype.onToIDChange = function(type, args, me)
 {
      //Sets the back relation label.
      var backRelationCtrl = document.getElementById(this.lblBackRelationAccountCtrlId);
      var toIdDialogTextCtrl = document.getElementById(this.luToIdDialogTextCtrlId);
      
      if((backRelationCtrl != null) && (toIdDialogTextCtrl != null))
      {
          
          backRelationCtrl.innerHTML = toIdDialogTextCtrl.value;
          
      }       
 
 }

// AddEditAssociation.prototype.setupUpdateScripts = function() {
//     Sys.WebForms.PageRequestManager.getInstance().add_pageLoaded(this.associationPageLoadScript);
// }

 AddEditAccountAssociation.prototype.associationPageLoadScript = function()
 {
    var elementModeCtrl = document.getElementById(this.modeAssocCtrlId);
              
    if (elementModeCtrl != null)
    {
             
       if(elementModeCtrl.value == "ADD")
       {
       
          // Add Lookup change event      
          var toIdDialogObj = document.getElementById(this.luToIDDialogObjID); 

          if (toIdDialogObj)
          {
             var elementToIdBtnCtrl = document.getElementById(this.luToIdDialogCtrlId +'_LookupBtn' );
             var toIdDialogValueCtrl = document.getElementById(this.luToIdDialogCtrlId + '_LookupResult');
             var toIdDialogTextCtrl = document.getElementById(this.luToIdDialogCtrlId + '_LookupText');
             //toIdDialogObj.onChange.subscribe(onToIDChange, null); 
             toIdDialogValueCtrl.value = '';
             toIdDialogTextCtrl.value ='';
             elementToIdBtnCtrl.onclick();
             toIdDialogObj.on('close', onToIdReturn);   //toIdDialogObj.onClose.subscribe(onToIdReturn); 
          }
       }
    }
 }

 AddEditAccountAssociation.prototype.onToIdReturn = function(type, args)
{

     var currentAccountIdCtrl = document.getElementById(this.currentAccountIdCtrlId);
     var toIdDialogValueCtrl = document.getElementById(this.luToIdDialogCtrlId + '_LookupResult');
     var toIdDialogTextCtrl = document.getElementById(this.luToIdDialogCtrlId + '_LookupText');
     var elementToIdBtnCtrl = document.getElementById(this.luToIdDialogCtrlId + '_LookupBtn');
     if(toIdDialogValueCtrl.value == currentAccountIdCtrl.value)
     {
         alert(this.msgCanNotAssociate); //'You can not associate the account to it self.'
          // Re open the Lookup 
          if ( elementToIdBtnCtrl != null)
          {
             toIdDialogValueCtrl.value = '';
             toIdDialogTextCtrl.value = '';
             elementToIdBtnCtrl.onclick();
          } 
          return;   
     }
     
     if(toIdDialogValueCtrl.value == '')
     {

         var cmdCloseCtrl = document.getElementById(this.cmdCloseCtrlId);
          cmdCloseCtrl.click();
          return;   
     }

     var backRelationCtrl = document.getElementById(this.lblBackRelationAccountCtrlId);
    
      
     if((backRelationCtrl != null) && (toIdDialogTextCtrl != null))
     {
         backRelationCtrl.innerHTML = toIdDialogTextCtrl.value;
     }       
         
 }


 /* function used to limit the length of                   */
 /* textareas to 'num' characters with an onkeypress event */
 AddEditAccountAssociation.prototype.limitLength = function(event, ctl, max) 
 {

     if (event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 45 || event.keyCode == 46 || event.keyCode == 17 ||
        (event.keyCode >= 35 && event.keyCode <=40))
         return true;
     else
        return (ctl.value.length < max);
 }

 AddEditAccountAssociation.prototype.clipText = function(ctl, max) 
 {

    ctl.value = ctl.value.substring(0, max);
 }
 if (typeof (Sys) !== 'undefined') Sys.Application.notifyScriptLoaded();
    
 
