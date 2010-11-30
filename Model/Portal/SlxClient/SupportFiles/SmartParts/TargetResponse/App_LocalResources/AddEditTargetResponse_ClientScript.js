<script language="javascript" type="text/javascript">

	function OnTabProductsClick()
	{
	    SetDivDisplay("@tr_divProductsId", "inline");	
	    SetDivDisplay("@tr_divOpensId", "none");
	    SetDivDisplay("@tr_divClicksId", "none");
	    SetDivDisplay("@tr_divUndeliverablesId", "none");
	    SetDivDisplay("@tr_divAddProductId", "inline");
	    
	    SetTabDisplay("@tr_tabProductsId", "activeTab tab");
	    SetTabDisplay("@tr_tabOpensId", "inactiveTab tab");
	    SetTabDisplay("@tr_tabClicksId", "inactiveTab tab");
	    SetTabDisplay("@tr_tabUndeliverablesId", "inactiveTab tab");
	    
        SetSelectedTabState("@tr_txtSelectedTabId", 0);
	}
	
    function OnTabOpensClick()
	{
	    SetDivDisplay("@tr_divOpensId", "inline");
	    SetDivDisplay("@tr_divProductsId", "none");
	    SetDivDisplay("@tr_divClicksId", "none");
	    SetDivDisplay("@tr_divUndeliverablesId", "none");
	    SetDivDisplay("@tr_divAddProductId", "none");
	    
	    SetTabDisplay("@tr_tabOpensId", "activeTab tab");
	    SetTabDisplay("@tr_tabProductsId", "inactiveTab tab");
	    SetTabDisplay("@tr_tabClicksId", "inactiveTab tab");
	    SetTabDisplay("@tr_tabUndeliverablesId", "inactiveTab tab");
	    
        SetSelectedTabState("@tr_txtSelectedTabId", 0);
	}
	
    function OnTabClicksClick()
	{
	    SetDivDisplay("@tr_divClicksId", "inline");
	    SetDivDisplay("@tr_divProductsId", "none");
	    SetDivDisplay("@tr_divOpensId", "none");
	    SetDivDisplay("@tr_divUndeliverablesId", "none");
	    SetDivDisplay("@tr_divAddProductId", "none");
	    
	    SetTabDisplay("@tr_tabClicksId", "activeTab tab");
	    SetTabDisplay("@tr_tabProductsId", "inactiveTab tab");
	    SetTabDisplay("@tr_tabOpensId", "inactiveTab tab");
	    SetTabDisplay("@tr_tabUndeliverablesId", "inactiveTab tab");
	    
        SetSelectedTabState("@tr_txtSelectedTabId", 0);
	}
	
	function OnTabUndeliverablesClick()
	{
	    SetDivDisplay("@tr_divUndeliverablesId", "inline");
	    SetDivDisplay("@tr_divProductsId", "none");
	    SetDivDisplay("@tr_divOpensId", "none");
	    SetDivDisplay("@tr_divClicksId", "none");
	    SetDivDisplay("@tr_divAddProductId", "none");
	    
	    SetTabDisplay("@tr_tabUndeliverablesId", "activeTab tab");
	    SetTabDisplay("@tr_tabProductsId", "inactiveTab tab");
	    SetTabDisplay("@tr_tabOpensId", "inactiveTab tab");
	    SetTabDisplay("@tr_tabClicksId", "inactiveTab tab");
	    
        SetSelectedTabState("@tr_txtSelectedTabId", 0);
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