<script type="text/javascript">
   
    function onTargetWins()
    {
        $(".rdoTargetWins").attr('checked', true);
    }

    function onSourceWins()
    {
        $(".rdoSourceWins").attr('checked', true);
    }
    
    function OnTabFiltersClick()
	{
	    SetDivDisplay("@lsc_divFiltersId", "block");	
	    SetDivDisplay("@lsc_divOptionsId", "none");
	    
	    SetTabDisplay("@lsc_tabFiltersId", "activeTab tab");
	    SetTabDisplay("@lsc_tabOptionsId", "inactiveTab tab");
	    
        SetSelectedTabState("@lsc_txtSelectedTabId", 1);
	}
	
    function OnTabOptionsClick()
	{
	    SetDivDisplay("@lsc_divFiltersId", "none");	
	    SetDivDisplay("@lsc_divOptionsId", "block");
	    
	    SetTabDisplay("@lsc_tabFiltersId", "inactiveTab tab");
	    SetTabDisplay("@lsc_tabOptionsId", "activeTab tab");
	    
        SetSelectedTabState("@lsc_txtSelectedTabId", 2);
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
