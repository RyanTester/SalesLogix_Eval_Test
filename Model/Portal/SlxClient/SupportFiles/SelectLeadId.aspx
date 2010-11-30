<%@ Page Language="C#" AutoEventWireup="true" CodeFile="SelectLeadId.aspx.cs" Inherits="SelectLeadId" %>

<%@ Import namespace="Sage.Platform.Application.UI.Web"%>
<%@ Import namespace="Sage.Platform.Application.UI"%>
<%@ Import namespace="Sage.SalesLogix"%>
<%@ Import namespace="Sage.Platform.Application"%>
<%@ Import namespace="Sage.Platform.Security"%>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.DependencyLookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Client.GroupBuilder" Namespace="Sage.SalesLogix.Client.GroupBuilder.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Client.GroupBuilder" Namespace="Sage.SalesLogix.Client.GroupBuilder" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.Platform.WebPortal" Namespace="Sage.Platform.WebPortal.SmartParts" TagPrefix="smartParts" %>
<%@ Register Assembly="Sage.Platform.WebPortal" Namespace="Sage.Platform.WebPortal.Workspaces" TagPrefix="workSpace" %>
<%@ Register Assembly="Sage.Platform.WebPortal" Namespace="Sage.Platform.WebPortal.Services" TagPrefix="Services" %>
<%@ Register Assembly="Sage.Platform.WebPortal" Namespace="Sage.Platform.WebPortal.Workspaces.Tab" TagPrefix="tws" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.PickList" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Lookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Timeline" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.ScriptResourceProvider" TagPrefix="Saleslogix" %>
<%@ Register Assembly="System.Web.Extensions, Version=3.5.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" Namespace="System.Web.UI"
    TagPrefix="asp" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="Head1" runat="server">
    <title>Select Lead</title>

    <link rel="stylesheet" type="text/css" href="~/css/YUI/fonts.css" />
    <link rel="stylesheet" type="text/css" href="~/css/YUI/reset.css" />
    <link rel="stylesheet" type="text/css" href="~/Libraries/Ext/resources/css/ext-all.css" /> 
    <link rel="stylesheet" type="text/css" href="~/Libraries/Ext/ux/resources/css/ext-ux-livegrid.css" />
    <link rel="stylesheet" type="text/css" href="~/css/YUI/container.css" />
          
    <script pin="pin" type="text/javascript" src="Libraries/jQuery/jquery.js"></script>
    <script pin="pin" type="text/javascript" src="Libraries/jQuery/jquery.selectboxes.js"></script>
    <script pin="pin" type="text/javascript" src="Libraries/jQuery/jquery-ui.js"></script>
    <script pin="pin" type="text/javascript" src="Libraries/Ext/adapter/jquery/ext-jquery-adapter.js"></script>
    <script pin="pin" type="text/javascript" src="Libraries/Ext/ext-all.js"></script>
    <script pin="pin" type="text/javascript" src="Libraries/Ext/ext-overrides.js"></script>
    <script pin="pin" type="text/javascript" src="Libraries/Ext/ext-paging-tree-loader.js"></script>
    <script pin="pin" type="text/javascript" src="Libraries/Ext/ext-tablegrid.js"></script>
    <script pin="pin" type="text/javascript" src="Libraries/Ext/ux/ext-ux-livegrid-combined-min.js"></script>
    
    <script pin="pin" type="text/javascript" src="jscript/YUI/yui-combined-min.js"></script>     
    <script pin="pin" type="text/javascript" src="jscript/sage-platform/sage-platform.js"></script>
    <script pin="pin" type="text/javascript" src="jscript/sage-controls/sage-controls.js"></script>
    <script pin="pin" type="text/javascript" src="jscript/sage-common/sage-common.js"></script>
    
    <link rel="stylesheet" type="text/css" href="~/css/sage-styles.css" />      
    
    <style type="text/css">
        body { font-size:80% }
    </style>
</head>
<body onunload="unload()">
    <form id="form1" runat="server">
    <asp:ScriptManager id="ScriptManager1" runat="server" />
    <div id="MainWorkArea" class="formtable">
        <div style="visibility:hidden;">
            <SalesLogix:LookupControl runat="server" ID="SelectedLead" LookupEntityName="Lead" LookupEntityTypeName="Sage.SalesLogix.Entities.Lead, Sage.SalesLogix.Entities">
                <LookupProperties>
                    <SalesLogix:LookupProperty PropertyHeader="<%$ resources: luSelectedLead_Company %>" PropertyName="Company" PropertyFormat="None"  UseAsResult="False"></SalesLogix:LookupProperty>
                    <SalesLogix:LookupProperty PropertyHeader="<%$ resources: luSelectedLead_LastName %>" PropertyName="LastName" PropertyFormat="None"  UseAsResult="False"></SalesLogix:LookupProperty>
                    <SalesLogix:LookupProperty PropertyHeader="<%$ resources: luSelectedLead_FirstName %>" PropertyName="FirstName" PropertyFormat="None"  UseAsResult="False"></SalesLogix:LookupProperty>
                    <SalesLogix:LookupProperty PropertyHeader="<%$ resources: luSelectedLead_Work %>" PropertyName="WorkPhone" PropertyFormat="None"  UseAsResult="False"></SalesLogix:LookupProperty>
                    <SalesLogix:LookupProperty PropertyHeader="<%$ resources: luSelectedLead_Mobile %>" PropertyName="Mobile" PropertyFormat="None"  UseAsResult="False"></SalesLogix:LookupProperty>
                    <SalesLogix:LookupProperty PropertyHeader="<%$ resources: luSelectedLead_Email %>" PropertyName="Email" PropertyFormat="None"  UseAsResult="False"></SalesLogix:LookupProperty>
                </LookupProperties>
                <LookupPreFilters>
                </LookupPreFilters>
            </SalesLogix:LookupControl>
        </div>
    </div>
    <script type="text/javascript">
        function unload() {
            if (document.getElementById('SelectedLead_LookupResult') != null) {
                returnValue = document.getElementById('SelectedLead_LookupResult').value;
            }
        }
        $("document").ready(function(){
            var oGrid;
            var oNativeGrid;
            if (typeof SelectedLead != 'undefined')
            {
                SelectedLead_luobj.show();
                oGrid = SelectedLead_luobj.getGrid();
                if (oGrid != null)
                {
                    oNativeGrid = oGrid.getNativeGrid();
                    if (oNativeGrid != null)
                    {
                        oNativeGrid.on('rowdblclick', function(nativeGrid, rowIndex, e) {window.close();});
                    }
                }
            }
            $(".x-window-footer .x-btn-center").click(function(){window.close();});
            $(".x-tool-close").click(function(){window.close();});
        });
    </script>
    </form>
</body>
</html>
