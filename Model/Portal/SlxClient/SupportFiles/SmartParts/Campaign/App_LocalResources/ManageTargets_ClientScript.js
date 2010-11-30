<script language="javascript" type="text/javascript">

    function onSearchTypeChange(selectedIndex)
    {
        var pklStatus = @mt_pklStatusId;
        if (pklStatus != null)
        {
            var statusList = document.getElementById(pklStatus.listId);
            if (statusList != null)
            {
                //clear existing items
                statusList.length = 0;
                if (selectedIndex == 0)
                    pklStatus.PickListName = "Lead Status";
                else if (selectedIndex == 3)
                    pklStatus.PickListName = "Contact Status";
                else
                    pklStatus.PickListName = "Account Status";
            }
        }
        var control = document.getElementById("@mt_chkProductsId");
        if (control != null)
            control.enabled = (selectedIndex > 0);
        control = document.getElementById("@mt_lbxProductsId");
        if (control != null)
            control.enabled = (selectedIndex > 0);
        control = document.getElementById("@mt_lueProductsId");
        if (control != null)
            control.enabled = (selectedIndex > 0);
    }
    
    function mt_ClearFilters()
    {
        var picklistValue = null;
        var lookupValue = null;
        var control = document.getElementById("@mt_chkCompanyId");
        if (control != null)
            control.checked = false;
        control = document.getElementById("@mt_lbxCompanyId");
        if (control != null)
            control.options[0].selected = true;
        control = document.getElementById("@mt_txtCompanyId");
        if (control != null)
            control.value = "";
        control = document.getElementById("@mt_chkIndustryId");
        if (control != null)
            control.checked = false;
        control = document.getElementById("@mt_lbxIndustryId");
        if (control != null)
            control.options[0].selected = true;
        ClearObjectControlValue(@mt_pklIndustryId, 0);
        control = document.getElementById("@mt_chkSICId");
            control.checked = "";
        control = document.getElementById("@mt_lbxSICId");
        if (control != null)
            control.options[0].selected = true;
        control = document.getElementById("@mt_txtSICId");
        if (control != null)
            control.value = "";
        control = document.getElementById("@mt_chkTitleId");
        if (control != null)
            control.checked = false;
        control = document.getElementById("@mt_lbxTitleId");
        if (control != null)
            control.options[0].selected = true;
        ClearObjectControlValue(@mt_pklTitleId, 0);
        control = document.getElementById("@mt_chkProductsId");
        if (control != null)
            control.checked = false;
        control = document.getElementById("@mt_lbxProductsId");
        if (control != null)
            control.options[0].selected = true;
        ClearObjectControlValue(@mt_lueProductsId, 1);
        control = document.getElementById("@mt_chkStatusId");
        if (control != null)
            control.checked = false;
        control = document.getElementById("@mt_lbxStatusId");
        if (control != null)
            control.options[0].selected = true;
        ClearObjectControlValue(@mt_pklStatusId, 0);
        control = document.getElementById("@mt_chkSolicitId");
        if (control != null)
            control.checked = false;
        control = document.getElementById("@mt_chkEmailId");
        if (control != null)
            control.checked = false;
        control = document.getElementById("@mt_chkCallId");
        if (control != null)
            control.checked = false;
        control = document.getElementById("@mt_chkMailId");
        if (control != null)
            control.checked = false;
        control = document.getElementById("@mt_chkFaxId");
        if (control != null)
            control.checked = false;
        control = document.getElementById("@mt_chkCityId");
        if (control != null)
            control.checked = false;
        control = document.getElementById("@mt_lbxCityId");
        if (control != null)
            control.options[0].selected = true;
        control = document.getElementById("@mt_txtCityId");
        if (control != null)
            control.value = "";
        control = document.getElementById("@mt_chkStateId");
        if (control != null)
            control.checked = false;
        control = document.getElementById("@mt_lbxStateId");
        if (control != null)
            control.options[0].selected = true;
        control = document.getElementById("@mt_txtStateId");
        if (control != null)
            control.value = "";
        control = document.getElementById("@mt_chkZipId");
        if (control != null)
            control.checked = false;
        control = document.getElementById("@mt_lbxZipId");
        if (control != null)
            control.options[0].selected = true;
        control = document.getElementById("@mt_txtZipId");
        if (control != null)
            control.value = "";
        control = document.getElementById("@mt_chkLeadSourceId");
        if (control != null)
            control.checked = false;
        control = document.getElementById("@mt_lbxLeadSourceId");
        if (control != null)
            control.options[0].selected = true;
        ClearObjectControlValue(@mt_lueLeadSourceId, 1);
        control = document.getElementById("@mt_chkImportSourceId");
        if (control != null)
            control.checked = false;
        control = document.getElementById("@mt_lbxImportSourceId");
        if (control != null)
            control.options[0].selected = true;
        ClearObjectControlValue(@mt_pklImportSourceId, 0);
        control = document.getElementById("@mt_chkCreateDateId");
        if (control != null)
            control.checked = false;
        control = document.getElementById("@mt_dtpFromDateId");
        if (control != null)
            control.value = now;
        control = document.getElementById("@mt_dtpToDateId");
        if (control != null)
            control.value = now;
    }
    
    function ClearObjectControlValue(control, type)
    {
        if (control != null)
        {
            var textCtrl = null;
            switch (type)
            {
                case 0: //picklist
                    textCtrl = document.getElementById(control.textId);
                    break;
                case 1: //lookup
                    textCtrl = document.getElementById(control.LookupTextId);
                    break;
                default:
            }
            if (textCtrl != null)
                textCtrl.value = "";
        }
    }
    
    function OnUpdateProgress(progressArea, args)
	{
	    if (args.ProgressData.ProcessCompleted == "True")
	    {
		    if(_IsCompleted)
		    {
		        return false;
		    }
		    _IsCompleted = true;
		    return false;
	    }
	}
	
	function OnTabLookupTargetClick()
	{
	    SetDivDisplay("@mt_divAddFromGroupId", "none");	
	    SetDivDisplay("@mt_divLookupTargetsId", "inline");
	    
	    SetTabDisplay("@mt_tabLookupTargetId", "activeTab tab");
	    SetTabDisplay("@mt_tabAddFromGroupId", "inactiveTab tab");
	    
        SetSelectedTabState("@mt_txtSelectedTabId", 0);
	}
	
	function OnTabAddFromGroupClick()
	{
	    SetDivDisplay("@mt_divLookupTargetsId", "none");
	    SetDivDisplay("@mt_divAddFromGroupId", "inline");
	    
	    SetTabDisplay("@mt_tabLookupTargetId", "inactiveTab tab");
	    SetTabDisplay("@mt_tabAddFromGroupId", "activeTab tab");
	    
	    SetSelectedTabState("@mt_txtSelectedTabId", 1);
	}

	function SetDivDisplay(divId, display)
    { 
        var control = document.getElementById(divId);
        if (control != null)
        {
            control.style.display = display;
        }
    }

    function SetTabDisplay(tabId, displayClass)
    {
        var control = document.getElementById(tabId);
        if (control != null)
        {
            control.className = displayClass;
        }
    }
    
    function SetSelectedTabState(tabStateId, index)
    {
    	var selectTab = document.getElementById(tabStateId);
	    if (selectTab != null)
	    {
	        selectTab.value = index;
	    }
    }
    
</script>