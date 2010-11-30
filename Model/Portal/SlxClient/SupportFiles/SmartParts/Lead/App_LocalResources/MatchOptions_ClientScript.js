<script language="javascript" type="text/javascript">

    var txtDup_Low = document.getElementById("@mo_txtDuplicate_LowId");
    var txtPosDup_Low = document.getElementById("@mo_txtPossibleDuplicate_LowId");
    var lblPosDup_High = document.getElementById("@mo_lblPossibleDuplicate_HighId");
    var lblNoDup_High = document.getElementById("@mo_lblNoDuplicate_HighId");
        
    function OnUseFuzzyCheckedChanged()
    {
        var lbxFuzzyLevel = document.getElementById("@mo_lbxFuzzyLevelId");
        var chkUseFuzzy = document.getElementById("@mo_chkUseFuzzyId");
	    if (chkUseFuzzy != null && lbxFuzzyLevel != null)
	    {
	        lbxFuzzyLevel.enabled = chkUseFuzzy.checked;
	    }
    }
    
    function OnDuplicateScoreChange()
    {
        if (txtDup_Low != null && lblNoDup_High != null && lblPosDup_High != null && txtPosDup_Low != null)
        {
            if (parseInt(txtDup_Low.value) > 100)
            {
                txtDup_Low.value = 100;
            }
            var lowVal = parseInt(txtDup_Low.value) - 1;
            $("#@mo_lblPossibleDuplicate_HighId").text(lowVal);
            if (parseInt(txtPosDup_Low.value) >= parseInt(txtDup_Low.value))
            {
                txtPosDup_Low.value = lowVal - 1;
            }
            $("#@mo_lblNoDuplicate_HighId").text(parseInt(txtPosDup_Low.value) - 1);
        }
    }
    
    function OnDuplicatePossibleChange()
    {
        var posDupHigh = $("#@mo_lblPossibleDuplicate_HighId").text();
        if (parseInt(txtPosDup_Low.value) > parseInt(posDupHigh))
        {
            var posDupLow = parseInt(txtPosDup_Low.value) + 1;
            $("#@mo_lblPossibleDuplicate_HighId").text(posDupLow);
            txtDup_Low.value = parseInt(posDupLow) + 1;
        }
        $("#@mo_lblNoDuplicate_HighId").text(parseInt(txtPosDup_Low.value) - 1);
    }
</script>