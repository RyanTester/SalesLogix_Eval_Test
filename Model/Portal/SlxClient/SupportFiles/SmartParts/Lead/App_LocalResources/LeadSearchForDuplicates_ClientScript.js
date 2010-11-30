<script language="javascript" type="text/javascript">

	function OnTabFiltersClick()
	{
	    SetDivDisplay("@lsd_divFiltersId", "inline");	
	    SetDivDisplay("@lsd_divOptionsId", "none");
	    
	    SetTabDisplay("@lsd_tabFiltersId", "activeTab tab");
	    SetTabDisplay("@lsd_tabOptionsId", "inactiveTab tab");
	    
        SetSelectedTabState("@lsd_txtSelectedTabId", 1);
	}
	
    function OnTabOptionsClick()
	{
	    SetDivDisplay("@lsd_divFiltersId", "none");	
	    SetDivDisplay("@lsd_divOptionsId", "inline");
	    
	    SetTabDisplay("@lsd_tabFiltersId", "inactiveTab tab");
	    SetTabDisplay("@lsd_tabOptionsId", "activeTab tab");
	    
        SetSelectedTabState("@lsd_txtSelectedTabId", 2);
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