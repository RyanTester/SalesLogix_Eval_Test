<script language="javascript" type="text/javascript">
    var gridViewCtl = null;
    var selectedFileId = "@selectedFileId";
    
    function onGridViewRowSelected(rowIdx, grdCtrlId, rowIdxCtrlId)
    {
        gridViewCtl = document.getElementById(grdCtrlId);
        var idxCtrl = document.getElementById(rowIdxCtrlId);
        selRow = getSelectedRow(idxCtrl.value);
        if (selRow != null)
        {
            selRow.style.backgroundColor = '#ffffff';
        }
        
        selRow = getSelectedRow(rowIdx);
        if (null != selRow)
        {
            idxCtrl.value = rowIdx;
            selRow.style.backgroundColor = '#fbf3c8';
        }
    }

    function getSelectedRow(rowIdx)
    {
        return getGridRow(rowIdx);
    }
    
    function getGridRow(rowIdx)
    {
        if (gridViewCtl != null)
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
    
    function OnUploadImportFile()
    {
        var file = document.getElementById(selectedFileId);
        if (file != null)
        {
            var confirmUpload = document.getElementById("@txtConfirmOverwriteId");
            confirmUpload.value = "T";
            if (file.value != "")
            {
	            if (confirm("@confirmOverwriteFileMsg")) 
	            {
	                confirmUpload.value = "O";
	                file.value = "";
	            }
	            else
	            {
	                confirmUpload.value = "F";
	            }
            }
        }
    }
    
    function rdbCreateGroup_Click()
    {
        var rdbAddHocGroup = document.getElementById("@rdbAddToAddHocGroupId");
        if (rdbAddHocGroup != null)
        {
            rdbAddHocGroup.checked = false;
        }
    }
    
    function rdbAddToAddHocGroup_Click()
    {
        var rdbCreateGroup = document.getElementById("@rdbCreateGroupId");
        if (rdbCreateGroup != null)
        {
            rdbCreateGroup.checked = false;
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
    
    function chkAddToGroup_Click()
    {
        var chkAddToGroup = document.getElementById("@chkAddToGroupId");
        if (chkAddToGroup != null)
        {
            EnableDisableControl(document.getElementById("@rdbCreateGroupId"), chkAddToGroup.checked);
            EnableDisableControl(document.getElementById("@txtCreateGroupNameId"), chkAddToGroup.checked);
            EnableDisableControl(document.getElementById("@rdbAddToAddHocGroupId"), chkAddToGroup.checked);
            EnableDisableControl(document.getElementById("@lbxAddHocGroupsId"), chkAddToGroup.checked);
        }
    }
    
    function EnableDisableControl(control, enabled)
    {
        if (control != null)
        {
            control.enabled = enabled;
        }
    }
</script>