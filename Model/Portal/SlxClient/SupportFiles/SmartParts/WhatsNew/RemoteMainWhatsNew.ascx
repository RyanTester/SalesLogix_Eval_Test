<%@ Control Language="C#" AutoEventWireup="true" CodeFile="RemoteMainWhatsNew.ascx.cs" Inherits="RemoteMainWhatsNew" %>
<%@ Register Assembly="Sage.SalesLogix.Web" Namespace="Sage.SalesLogix.Web" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>

<style type="text/css">
    .style1
    {
        width: 120px;
    }
    .style2
    {
        width: 240px;
    }
    .style3
    {
    	width: 400px;
    }
</style>

<div style="display: none">
    <asp:Panel ID="MainToolbar_LTools" runat="server"></asp:Panel>
    <asp:Panel ID="MainToolbar_CTools" runat="server"></asp:Panel>
    <asp:Panel ID="MainToolbar_RTools" runat="server">
        <SalesLogix:PageLink ID="lnkRemoteWhatsNew" runat="server" LinkType="HelpFileName" ToolTip="<%$ resources: Portal, Help_ToolTip %>"
            Target="Help" NavigateUrl="whatsnewdisconnect" ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </SalesLogix:PageLink>
    </asp:Panel>
</div>

<table border="0" cellpadding="1" cellspacing="0" class="formtable">
	<col /><col /><col /><col />
	    <tr>
	        <td class="style1">
	            <div class="lbl">
	                <asp:RadioButton runat="server" ID="rdbNew" Text="<%$ resources: rdgSearchType_New.Caption %>" GroupName="SearchType"
	                    OnCheckedChanged="OnSearch_Click" AutoPostBack="true" />
	            </div>
            </td>
            <td class="style2">
                <div class="slxlabel alignleft">
                    <asp:Label runat="server" ID="lblDisplayTransactions" Text="<%$ resources: lblDisplayTransactions.Caption %>"></asp:Label>
                </div>
            </td>
            <td class="style3">
                <span class="textcontrol" style="padding-right:20px;">
                    <SalesLogix:DateTimePicker runat="server" ID="dteChangeDate" DisplayTime="false" />
                </span>
                <asp:Button ID="btnSearch" runat="server" Text="<%$ resources : btnSearch_Caption %>" OnClick="OnSearch_Click" CssClass="slxbutton" />
            </td>
        </tr>
        <tr>
            <td class="style1">
                <div runat="server" id="divUpdatedOption" class="lbl">
                    <asp:RadioButton runat="server" ID="rdbUpdated" Text="<%$ resources: rdgSearchType_Updated.Caption %>" GroupName="SearchType" 
                        OnCheckedChanged="OnSearch_Click" AutoPostBack="true" />
                </div>
            </td>
            <td class="style2">
                <div class="slxlabel alignleft">
                    <asp:Label runat="server" ID="lblDeleteTransactions" Text="<%$ resources : lblDeleteTransactions.Caption %>"></asp:Label>
                </div>
            </td>
            <td class="style3">
                <span class="textcontrol" style="padding-right:20px;">
                    <SalesLogix:DateTimePicker runat="server" ID="dteDeleteTransactions" DisplayTime="false" />
                </span>
                <asp:Button ID="btnDelete" runat="server" Text="<%$ resources : btnDelete_Caption %>" OnClick="OnDelete_Click" CssClass="slxbutton" />
            </td>
        </tr>
        <tr>
            <td class="style1">
                <div runat="server" id="divDeletedOption" class="lbl">
                    <asp:RadioButton runat="server" ID="rdbDeleted" Text="<%$ resources: rdgSearchType_Deleted.Caption %>" GroupName="SearchType"
                        OnCheckedChanged="OnSearch_Click" AutoPostBack="true" />
                </div>
            </td>
            <td class="style2"></td>
            <td></td>
        </tr>
</table>
<script type="text/javascript">
    var rdb_NewCtrolId = "<%= rdbNew.ClientID %>";
    var rdb_DeletedCtrolId = "<%= rdbDeleted.ClientID %>";
    var div_UpdatedButtonCtrlId = "<%= divUpdatedOption.ClientID %>";
    var div_DeletedButtonCtrlId = "<%= divDeletedOption.ClientID %>";

    $(document).ready(function() {
        TabControl.on('maintabchange', function(id, tab) {
            switch (id) {
                case 'RemoteAccountsWhatsNew':
                    SetFilterOptions("inline", "inline");
                    break;
                case 'RemoteContactsWhatsNew':
                    SetFilterOptions("inline", "inline");
                    break;
                case 'RemoteOpportunitiesWhatsNew':
                    SetFilterOptions("inline", "inline");
                    break;
                case 'RemoteActivitiesWhatsNew':
                    ResetFilterOption(false);
                    SetFilterOptions("inline", "none");
                    break;
                case 'RemoteNotesWhatsNew':
                    ResetFilterOption(false);
                    SetFilterOptions("inline", "none");
                    break;
                case 'RemoteHistoryWhatsNew':
                    ResetFilterOption(false);
                    SetFilterOptions("inline", "none");
                    break;
                case 'RemoteDocumentsWhatsNew':
                    ResetFilterOption(true);
                    SetFilterOptions("none", "none");
                    break;
            }
        });
    });

    function ResetFilterOption(IsDocumentsTab) {
        var deleteButton = document.getElementById(rdb_DeletedCtrolId);
        if (deleteButton != null && deleteButton.checked || IsDocumentsTab) {
            var newButton = document.getElementById(rdb_NewCtrolId);
            if (newButton != null)
                newButton.checked = true;
        }
    }

    function SetFilterOptions(updatedDisplay, deletedDisplay) {
        divUpdatedOption = document.getElementById(div_UpdatedButtonCtrlId);
        divDeletedOption = document.getElementById(div_DeletedButtonCtrlId);
        if (divUpdatedOption != null)
            divUpdatedOption.style.display = updatedDisplay;
        if (divDeletedOption != null)
            divDeletedOption.style.display = deletedDisplay;
    }
    
</script>