<%@ Control Language="C#" AutoEventWireup="true" CodeFile="ImportHistoryDetail.ascx.cs" Inherits="SmartParts_ImportHistory_ImportHistoryDetail" %>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.Platform.WebPortal" Namespace="Sage.Platform.WebPortal.SmartParts" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Client.GroupBuilder" Namespace="Sage.SalesLogix.Client.GroupBuilder" TagPrefix="SalesLogix" %>

<div style="display:none">
    <SalesLogix:SmartPartToolsContainer runat="server" ID="ImportHistory_RTools" ToolbarLocation="right">
        <SalesLogix:GroupNavigator runat="server" ID="ImpotHistoryNav" ></SalesLogix:GroupNavigator>
        <SalesLogix:PageLink ID="lnkLeadImportDetailHelp" runat="server" LinkType="HelpFileName"
            ToolTip="<%$ resources: Portal, Help_ToolTip %>" Target="Help" NavigateUrl="leadimporthistorydetailview.aspx"
            ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16">
        </SalesLogix:PageLink>
    </SalesLogix:SmartPartToolsContainer>
</div>
<table border="0" cellpadding="1" cellspacing="0" class="formtable">
    <col width="50%" /><col width="50%" />
    <tr>
        <td>
            <span class="lbl">
                <asp:Label ID="lblImportId" runat="server" AssociatedControlID="txtImportId"
                    Text="<%$ resources: lblImportId.Caption %>">
                </asp:Label>
            </span>
            <span class="textcontrol" > 
                <asp:TextBox runat="server" ID="txtImportId" ReadOnly="true"/>
            </span>
        </td>
        
        <td>
            <span class="lbl">
                <asp:Label ID="lblStartedBy" runat="server" AssociatedControlID="usrStartedBy" 
                    Text="<%$ resources: lblStartedBy.Caption %>">
                </asp:Label>
            </span>
            <span class="textcontrol" >
                <SalesLogix:SlxUserControl runat="server" ID="usrStartedBy" ReadOnly="true" LookupBindingMode="String" />
            </span>
        </td>
    </tr>
    <tr>
       <td>
            <span class="lbl">
                <asp:Label ID="lblImportFile" runat="server" AssociatedControlID="txtImportFileName"
                    Text="<%$ resources: lblImportFileName.Caption %>">
                </asp:Label>
            </span>
            <span class="textcontrol" > 
                <asp:TextBox runat="server" ID="txtImportFileName" ReadOnly="true"/>
            </span>
        </td>
        <td>
            <span class="lbl">
                <asp:Label ID="lblStatus" runat="server" AssociatedControlID="txtStatus" Text="<%$ resources: lblStatus.Caption %>">
                </asp:Label>
            </span>
            <span class="textcontrol" > 
                <asp:TextBox runat="server" ID="txtStatus" ReadOnly="true"/>                    
            </span>
            
        </td>
    </tr>
     <tr>
        <td >
            <span class="lbl">
                <asp:Label ID="lblTotalRecord" AssociatedControlID="txtTotalRecords" runat="server"
                    Text="<%$ resources: lblTotalRecords.Caption %>">
                </asp:Label>
            </span>
            <span class="textcontrol" >
               <asp:TextBox runat="server" ID="txtTotalRecords" ReadOnly="true"/>
            </span>
        </td>
        <td>
            <span class="lbl">
            </span>
            <span>
                <asp:Button ID="cmdAbort" runat="server"  Visible="false" CssClass="slxButton" Text="<%$ resources: cmdAbort.Caption %>" OnClick="cmdAbort_OnClick" />
            </span>
        </td>
    </tr>
    <tr>
        <td>
            <span class="lbl">
                <asp:Label ID="lblTotalProcessed" AssociatedControlID="txtRecordsProcessed" runat="server"
                    Text="<%$ resources: lblRecordsProcessed.Caption %>">
                </asp:Label>
            </span>
            <span class="textcontrol" >
               <asp:TextBox runat="server" ID="txtRecordsProcessed" ReadOnly="true"/>
            </span>
        </td>
        <td>
           <span class="lbl">
                <asp:Label ID="lblStartDate" runat="server" AssociatedControlID="dtpStartDate"
                    Text="<%$ resources: lblStartDate.Caption %>">
                </asp:Label>
            </span>
            <span class="textcontrol" >
                <SalesLogix:DateTimePicker runat="server" ID="dtpStartDate" ReadOnly="true" DisplayTime="true" />
            </span>
        </td>
    </tr>
    <tr>  
        <td>
            <span class="lbl">
                <asp:Label ID="lblTotalSuccess" AssociatedControlID="txtRecordsImported" runat="server"
                    Text="<%$ resources: lblRecordsSuccess.Caption %>">
                </asp:Label>
            </span>
            <span class="textcontrol" >
                <asp:TextBox runat="server" ID="txtRecordsImported" ReadOnly="true"/>
            </span>
        </td>
        <td>
            <span class="lbl">
                <asp:Label ID="lblCompleteDate" runat="server" AssociatedControlID="dtpCompleteDate"
                    Text="<%$ resources: lblCompleteDate.Caption %>">
                </asp:Label>
            </span>
            <span class="textcontrol" >
                <SalesLogix:DateTimePicker runat="server" ID="dtpCompleteDate" ReadOnly="true" DisplayDate="true" />
            </span>
        </td>
    </tr>
    <tr>
        <td>
            <span class="lbl">
                <asp:Label ID="lblTotalErrors" AssociatedControlID="txtTotalErrors" runat="server"
                    Text="<%$ resources: lblTotalErrors.Caption %>">
                </asp:Label>
            </span>
            <span class="textcontrol" >
                <asp:TextBox runat="server" ID="txtTotalErrors" ReadOnly="true"/>
            </span>
        </td>
        <td>
            <span class="lbl">
                <asp:Label ID="lblTemplate" AssociatedControlID="txtTemplate" runat="server"
                    Text="<%$ resources: lblTemplate.Caption %>">
                </asp:Label>
            </span>
            <span class="textcontrol" >
                <asp:TextBox runat="server" ID="txtTemplate" ReadOnly="true"/>
            </span>
        </td>
    </tr>
    <tr> 
        <td>
            <span class="lbl">
                <asp:Label ID="lblWarningCount" AssociatedControlID="txtWarningCount" runat="server"
                    Text="<%$ resources: lblWarningCount.Caption %>">
                </asp:Label>
            </span>
            <span class="textcontrol" >
               <asp:TextBox runat="server" ID="txtWarningCount" ReadOnly="true"/>
            </span>
        </td>
    </tr>
    <tr> 
        <td>
            <span class="lbl">
                <asp:Label ID="Label1" AssociatedControlID="txtDuplicateCount" runat="server"
                    Text="<%$ resources: lblDuplicateCount.Caption %>">
                </asp:Label>
            </span>
            <span class="textcontrol" >
               <asp:TextBox runat="server" ID="txtDuplicateCount" ReadOnly="true"/>
            </span>
        </td>
    </tr>
    <tr> 
        <td>
            <span class="lbl">
                <asp:Label ID="Label2" AssociatedControlID="txtMergedCount" runat="server"
                    Text="<%$ resources: lblMergedCount.Caption %>">
                </asp:Label>
            </span>
            <span class="textcontrol" >
               <asp:TextBox runat="server" ID="txtMergedCount" ReadOnly="true"/>
            </span>
        </td>
    </tr>
</table>
<br />