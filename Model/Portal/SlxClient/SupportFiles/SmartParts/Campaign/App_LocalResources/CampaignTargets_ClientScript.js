<script language="javascript" type="text/javascript">
    
    var ct_selectedTargetCtrlId = "@txtSelectedTargetId";
    var ct_selectedTargetsCtrlId = "@txtSelectedTargetsId";
    var ct_selectedTargetContextCtrlId = "@txtSelectedTargetContextId";
    var ct_objTargets = new Object();
            
    function ResetFilters()
    {
        var control = document.getElementById("@chkShowContacts");
        if (control != null)
        {
            control.checked = false;
        }
        control = document.getElementById("@chkShowLeads");
        if (control != null)
        {
            control.checked = false;
        }
        control = document.getElementById("@chkGroup");
        if (control != null)
        {
            control.checked = false;
        }
        control = document.getElementById("@lbxGroup");
        if (control != null)
        {
            control.options[0].selected = true;
        }
        control = document.getElementById("@chkResponded");
        if (control != null)
        {
            control.checked = false;
        }
        control = document.getElementById("@chkPriority");
        if (control != null)
        {
            control.checked = false;
        }
        control = document.getElementById("@lbxPriority");
        if (control != null)
        {
            control.options[0].selected = true;
        }
        control = document.getElementById("@chkStatus");
        if (control != null)
        {
            control.checked = false;
        }
        control = document.getElementById("@lbxStatus");
        if (control != null)
        {
            control.options[0].selected = true;
        }
        control = document.getElementById("@chkStage");
        if (control != null)
        {
            control.checked = false;
        }
        control = document.getElementById("@lbxStage");
        if (control != null)
        {
            control.options[0].selected = true;
        }
    }
    
    function confirmExternalListCheck()
    {
        var chkExternalList = document.getElementById("@chkExternalListId");
        var confirmExternalList = document.getElementById("@txtConfirmExternalListId");
        confirmExternalList.value = "F";
        if (chkExternalList.checked)
        {
            if (confirm("@confirmExternalListMsg"))
            {
                confirmExternalList.value = "T";
            }
            else
            {
                chkExternalList.checked = false;               
            }
        }

        if (!chkExternalList.checked)
        {
            ct_SetStyleDisplay("@divDisplayGridId", "inline");
            ct_SetStyleDisplay("@divExternalId", "none");
            ct_SetStyleDisplay("@lnkFiltersId", "inline");
        }
        else
        {
            ct_SetStyleDisplay("@divDisplayGridId", "none");
            ct_SetStyleDisplay("@divExternalId", "inline");
            ct_SetStyleDisplay("@lnkFiltersId", "none");        
        }
        var useExternalList = document.getElementById("@cmdExternalListId");
        if (useExternalList != null)
        {
            InsertProgress_InvokeClickEvent(useExternalList);
        }
    }
    
    function ct_SetStyleDisplay(controlId, displayType)
    {
        var control = document.getElementById(controlId)
        if (control != null)
        {
            control.style.display = displayType;
        }
    }
    
    function InsertProgress_InvokeClickEvent(control)
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
    
    function onInitialTargetClick(gridInitialTargetCtrlId, newInitialTargetCtrlId, saveButtonId, targetId)
    {
        var value = false;
        var grdInitTarget = document.getElementById(gridInitialTargetCtrlId)
        if (grdInitTarget != null)
        {
            //get the changed value from the gridview
            value = grdInitTarget.checked;
            //assign the changed value
            var newInitTarget = document.getElementById(newInitialTargetCtrlId);
            if (newInitTarget != null)
            {
                newInitTarget.value = value;
                //get the action to post the change
                setSelectedTargetId(saveButtonId, targetId);
            }
        }
    }
    
    function setSelectedTargetId(saveButtonId, targetId)
    {
        var cmdSave = document.getElementById(saveButtonId);
        if (cmdSave != null)
        {
            var txtUpdateTargetId = document.getElementById(ct_selectedTargetCtrlId);
            if (txtUpdateTargetId != null)
            {
                txtUpdateTargetId.value = targetId;
                InsertProgress_InvokeClickEvent(cmdSave);
            }
        }
    }
    
    function onStatusChange(statusCtrlId, newStatusCtrlId, saveButtonId, targetId)
    {
        var value = "";
        var statusCtrl = document.getElementById(statusCtrlId);
        if (statusCtrl != null)
        {
            //get the changed value
            value = statusCtrl.value;
            //assign the changed value
            var newStatus = document.getElementById(newStatusCtrlId);
            if (newStatus != null)
            {
                newStatus.value = value;
                //get the action to post the change
                setSelectedTargetId(saveButtonId, targetId);
            }
        }
    }
    
    function ct_SelectAll()
    {
       ct_objTargets = new Object();
       document.getElementById(ct_selectedTargetsCtrlId).value = '';
       return true;
    }
    
    function ct_ClearAll()
    {
       ct_objTargets = new Object();
       document.getElementById(ct_selectedTargetsCtrlId).value = '';
       return true;
    }
    
    
    function ct_OnTargetSelectClick(sender, targetId)
    {
        ct_objTargets[targetId]= sender.checked
        ct_SaveSelectState(ct_objTargets);
    }
       
    function ct_SaveSelectState(targets)
    {
        var context = '<Targets>';
        for (var Id in targets) 
        {
            context = context + "<Target Id='" + Id + "' Selected='" + targets[Id] + "'/>" ; 
        }
        context = context + '</Targets>';
        document.getElementById(ct_selectedTargetsCtrlId).value = context;
    }

    function ShowHideFilters()
    {
        var txtShowFilters = document.getElementById("@txtShowFilterId");
        var lnkFilters = document.getElementById("@lnkFiltersId");
        if (txtShowFilters != null)
        {
            if (txtShowFilters.value == "true")
            {
                txtShowFilters.value = "false";
                ct_SetStyleDisplay("@filterDivId", "none");
                lnkFilters.innerText = "@lnkShowFilters";            
            }
            else
            {
                txtShowFilters.value = "true";
                ct_SetStyleDisplay("@filterDivId", "inline");
                lnkFilters.innerText = "@lnkHideFilters";
            }
        }
    }
        
</script>