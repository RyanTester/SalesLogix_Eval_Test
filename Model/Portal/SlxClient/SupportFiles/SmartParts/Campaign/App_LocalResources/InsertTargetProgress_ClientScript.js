<script language="javascript" type="text/javascript">
	var _IsCompleted = false;
	//YAHOO.util.Event.addListener(window, 'load', setupUpdateScripts);

	function setupUpdateScripts()
	{
		Sys.WebForms.PageRequestManager.getInstance().add_pageLoaded(InsertProgress_PageLoadScript);
	}

	function InsertProgress_PageLoadScript()
	{
	    var elementStartCtrl = document.getElementById("@cmdInsertStartCtrlId");
    	          
	    if (elementStartCtrl != null)
	    {
	        InsertProgress_InvokeClickEvent(elementStartCtrl);
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
	
	function OnUpdateProgress(progressArea, args)
	{
	    if (args.ProgressData.ProcessCompleted == "True")
	    {
		    if(_IsCompleted)
		    {
		        return false;
		    } 
		    var elementStartCtrl = document.getElementById("@cmdCloseCtrlId");
		    if (elementStartCtrl != null)
		    {
			    InsertProgress_InvokeClickEvent(elementStartCtrl);
		    }
		    _IsCompleted = true;
		    return false;
	    }
	}

</script>