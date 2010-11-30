<script language="javascript" type="text/javascript">

    function ResetResponseFilters()
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
        control = document.getElementById("@chkLeadSource");
        if (control != null)
        {
            control.checked = false;
        }
        control = document.getElementById("@lbxLeadSource");
        if (control != null)
        {
            control.options[0].selected = true;
        }
        control = document.getElementById("@chkMethod");
        if (control != null)
        {
            control.checked = false;
        }
        control = document.getElementById("@lbxMethod");
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
        control = document.getElementById("@chkName");
        if (control != null)
        {
            control.checked = false;
        }
        control = document.getElementById("@txtName");
        if (control != null)
        {
            control.value = "";
        }        
    }
    
    function tr_ShowHideFilters()
    {
        var tr_txtShowFilters = document.getElementById("@tr_txtShowFilterId");
        var tr_filterDiv = document.getElementById("@tr_filterDivId");
        var tr_lnkFilters = document.getElementById("@tr_lnkFiltersId");
        if (tr_txtShowFilters != null)
        {
            if (tr_txtShowFilters.value == "true")
            {
                tr_txtShowFilters.value = "false";
                tr_filterDiv.style.display = "none";
                tr_lnkFilters.innerText = "@tr_lnkShowFilters";
            }
            else
            {
                tr_txtShowFilters.value = "true";
                tr_filterDiv.style.display = "inline";
                tr_lnkFilters.innerText = "@tr_lnkHideFilters";
            }
        }
    }

</script>