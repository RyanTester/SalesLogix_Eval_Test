    var gridViewCtl = null;
    var _curSelRow = null;
    
    function getGridViewControl()
    {
        gridViewCtl = document.getElementById(slxattachmentstrings.gridViewCtlId);
        selRowIndxCtl = document.getElementById(slxattachmentstrings.selRowIndxCtlID);
    }
    
    function onGridViewRowSelected(rowIdx)
    {
        var selRow = getSelectedRow(rowIdx);
        if (_curSelRow != null)
        {
            $(_curSelRow).removeClass("x-grid3-row-selected")
        }
        else
        {
            _curSelRow = getSelectedRow(1);
            if (_curSelRow != null)
            {
                $(_curSelRow).removeClass("x-grid3-row-selected")
            }
        }

        if (null != selRow)
        {
            _curSelRow = selRow;
            selRowIndxCtl.value = rowIdx;
            $(_curSelRow).addClass("x-grid3-row-selected");
        }
    }

    function getSelectedRow(rowIdx)
    {
        return getGridRow(rowIdx);
    }
    
    function getGridRow(rowIdx)
    {
        getGridViewControl();
        if (null != gridViewCtl)
        {
            return gridViewCtl.rows[rowIdx];
        }
        return null;
    }
    
    function getGridColumn(rowIdx, colIdx)
    {
        var gridRow = getGridRow(rowIdx);
        if (null != gridRow)
        {
            return gridRow.cells[colIdx];
        }
        return null;
    }
    
    function getCellValue(rowIdx, colIdx)
    {
        var gridCell = getGridColumn(rowIdx, colIdx);
        if (null != gridCell)
        {
            return gridCell.innerText;
        }
        return null;
    }
    
    function OnDeleteAttachment()
    {
        getGridViewControl();
        if (selRowIndxCtl.value != "")
        {
            var confirmelem = document.getElementById(slxattachmentstrings.txtConfirmDeleteElement);
            if (confirm(slxattachmentstrings.confirmAttachDeleteMsg)) 
            {
			    confirmelem.value = "T";
			    var cmdDelete = document.getElementById(slxattachmentstrings.cmdDeleteAttachmentID);
                if (cmdDelete != null)
                {
                    var mgr = Sage.Services.getService("ClientBindingManagerService");
                    if (mgr)
                    {
                        mgr.skipWarning();
                    }
                    Attachments_AllowSubmit();
                    __doPostBack(cmdDelete.name, "");
                }
            }
			else
			{
			    confirmelem.value = "F";
			}
        }
        else
        {
            alert(slxattachmentstrings.ErrorNoRecordSelectedMsg);
            return false;
        }
    }
    
    function SetDivDisplay(Div, display)
    { 
        var control = document.getElementById(Div);
        control.style.display = display;
    }
  
    function OnInsertURL_Click()
    {
        var urlMode = document.getElementById(slxattachmentstrings.IsURLMode);
        urlMode.value = "T";
        SetDivDisplay(slxattachmentstrings.fileDiv, "none");
        SetDivDisplay(slxattachmentstrings.fileUploadDiv, "none");
        SetDivDisplay(slxattachmentstrings.urlDiv, "inline");
        SetDivDisplay(slxattachmentstrings.urlUploadDiv, "inline");
        SetDivDisplay(slxattachmentstrings.insertDiv, "inline");
        SetDivDisplay(slxattachmentstrings.editDiv, "none");
        SetHelpLink();
    }
    
    function SetHelpLink()
    {
        var helpLink = document.getElementById(slxattachmentstrings.AttachmentsHelpLink);
        var newLink = helpLink.href.replace("attachmentstab.aspx", "addattachment.aspx");
        helpLink.href = newLink;
        newLink = helpLink.href.replace("editattach.aspx", "addattachment.aspx");
        helpLink.href = newLink;
    }
    
    function OnInsertUpload()
    {
        //if inserting a URL validate web address and description exists
        var urlMode = document.getElementById(slxattachmentstrings.IsURLMode);
        if (urlMode != null)
        {
            if (urlMode.value == "T")
            {
                var txtInsertURL = document.getElementById(slxattachmentstrings.txtInsertURLID);
                if (txtInsertURL != null)
                {
                    if (txtInsertURL.value != "")
                    {
                        var txtURLDescription = document.getElementById(slxattachmentstrings.txtInsertDesc);
                        if (txtURLDescription != null)
                        {
                            if (txtURLDescription.value == "")
                            {
                                alert(slxattachmentstrings.Error_NoURL_Description);
                                return false;
                            }
                        }
                    }
                    else
                    {
                        alert(slxattachmentstrings.Error_NoURL_Address);
                        return false;
                    }
                }
            }
        }
        var cmdSaveFile = document.getElementById(slxattachmentstrings.cmdInsertUpload);
        if (cmdSaveFile != null)
        {
            var mgr = Sage.Services.getService("ClientBindingManagerService");
            if (mgr) {
                mgr.skipWarning();
            }
            Attachments_AllowSubmit();
            __doPostBack(cmdSaveFile.name, "");
        }
    }
    
    function OnEditUpload()
    {
        //if editing a URL validate web address and description exists
        var urlMode = document.getElementById(slxattachmentstrings.IsURLMode);
        if (urlMode.value == "T")
        {
            var txtEditURL = document.getElementById(slxattachmentstrings.txtEditURLID);
            if (txtEditURL != null)
            {
                if (txtEditURL.value != "")
                {
                    var txtURLDescription = document.getElementById(slxattachmentstrings.txtEditDescID);
                    if (txtURLDescription != null)
                    {
                        if (txtURLDescription.value == "")
                        {
                            alert(slxattachmentstrings.Error_NoURL_Description);
                            return false;
                        }
                    }
                }
                else
                {
                    alert(slxattachmentstrings.Error_NoURL_Address);
                    return false;
                }
            }
        }
        var cmdEditFile = document.getElementById(slxattachmentstrings.cmdEditUpload);
        if (cmdEditFile != null)
        {
            Attachments_AllowSubmit();
            __doPostBack(cmdEditFile.name, "");
        }
    }
    
    function IncreaseFileInputWidth(radUpload, args)
    {
        var cell = args.Row.cells[0];
        var inputs = cell.getElementsByTagName('INPUT');
        for (var i = 0; i < inputs.length; i++)
        {
            if (inputs[i].type == "file")
            {
                inputs[i].size = 40;
            }
        }
    }

var Attachments_ShouldPost = false; 
function Attachments_AllowSubmit() {
    Attachments_ShouldPost = true;
}
function Attachments_onSubmitting(sender, args) {
    if (Attachments_ShouldPost) {
        Attachments_ShouldPost = false;
        return true;
    }
    var retval = false;
    $(":file").each(function() { retval = ((this.value != "") || retval); });
    return retval;
}

if (typeof(Sys) !== 'undefined') Sys.Application.notifyScriptLoaded();