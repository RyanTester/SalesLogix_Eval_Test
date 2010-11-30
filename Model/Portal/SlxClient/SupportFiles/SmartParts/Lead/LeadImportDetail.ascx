<%@ Control Language="C#" AutoEventWireup="true" CodeFile="LeadImportDetail.ascx.cs" Inherits="SmartParts_Lead_LeadImportDetail" %>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.Platform.WebPortal" Namespace="Sage.Platform.WebPortal.SmartParts" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>

<div style="display:none">
<asp:Panel ID="LeadImportDetail_RTools" runat="server">
    <SalesLogix:PageLink ID="lnkLeadImportDetailHelp" runat="server" LinkType="HelpFileName"
        ToolTip="<%$ resources: Portal, Help_ToolTip %>" Target="Help" NavigateUrl=""
        ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16">
    </SalesLogix:PageLink>
</asp:Panel>
</div>

<div>
    <table>
        <tr>
            <td align="right" valign="top" style="padding-right:200px">
                <asp:Label ID="lblLeadImportID" runat="server" Text="<%$ resources:lblLeadImportID.Text %>"></asp:Label>
                <asp:TextBox ID="txtImportID" runat="server" BorderStyle="None"></asp:TextBox><br />
                <asp:Label ID="lblImportDate" runat="server" Text="<%$ resources:lblImportDate.Text %>"></asp:Label>
                <asp:TextBox ID="txtImportDate" runat="server" BorderStyle="None"></asp:TextBox><br />
                <asp:Label ID="lblStatus" runat="server" Text="<%$ resources:lblStatus.Text %>"></asp:Label>
                <asp:TextBox ID="txtStatus" runat="server" BorderStyle="None"></asp:TextBox>
            </td>
            <td align="right" valign="top" style="padding-left:200px">
                <asp:Label ID="lblImportLeads" runat="server" Text="<%$ resources:lblImportLeads.Text %>"></asp:Label>
                <asp:TextBox ID="txtImportLeads" runat="server" BorderStyle="None"></asp:TextBox><br />
                <asp:Label ID="lblAutoMergedDuplicates" runat="server" Text="<%$ resources:lblAutoMergedDuplicates.Text %>"></asp:Label>
                <asp:TextBox ID="txtAutoMergedDuplicates" runat="server" BorderStyle="None"></asp:TextBox><br />
                <asp:Label ID="lblUnresolvedDuplicates" runat="server" Text="<%$ resources:lblUnresolvedDuplicates.Text %>"></asp:Label>
                <asp:TextBox ID="txtUnresolvedDuplicates" runat="server" BorderStyle="None"></asp:TextBox><br />
                <asp:Label ID="lblErrors" runat="server" Text="<%$ resources:lblErrors.Text %>"></asp:Label>
                <asp:TextBox ID="txtErrors" runat="server" BorderStyle="None"></asp:TextBox>
            </td>
        </tr>
        <tr>
            <td style="padding-top:25px; padding-bottom:10px">
                <asp:Label ID="lblPotentialDuplicates" runat="server" Text="<%$ resources:lblPotentialDuplicates.Text %>"></asp:Label>
            </td>
            <td align="right" style="padding-top:25px; padding-bottom:10px">
                <asp:Button ID="btnReimport" runat="server" Text="<%$ resources:btnReimport.Text %>" CssClass="slxbutton" />
            </td>
        </tr>
    </table>
    <table>
        <tr>
            <td>
                <SalesLogix:SlxGridView runat="server" ID="grdImportDuplicates" AutoGenerateColumns="false" CssClass="datagrid"
                        EnableViewState="false" SelectedRowStyle-CssClass="rowSelected" AlternatingRowStyle-CssClass="rowdk" 
                        RowStyle-CssClass="rowlt" ShowEmptyTable="true" EmptyTableRowText="<%$ resources:NoRecords.EmptyTableRowText %>">
                    <Columns>
                        <asp:HyperLinkField HeaderText="De-Duplicate" ShowHeader="true" />
                        <asp:BoundField HeaderText="<%$ resources:Score.HeaderText %>" DataField="Score" HtmlEncode="false" ShowHeader="true" />
                        <asp:BoundField HeaderText="<%$ resources:FirstName.HeaderText %>" DataField="FirstName" HtmlEncode="false" ShowHeader="true" />
                        <asp:BoundField HeaderText="<%$ resources:LastName.HeaderText %>" DataField="LastName" HtmlEncode="false" ShowHeader="true" />
                        <asp:BoundField HeaderText="<%$ resources:Company.HeaderText %>" DataField="Company" HtmlEncode="false" ShowHeader="true" />
                        <asp:BoundField HeaderText="<%$ resources:WorkPhone.HeaderText %>" DataField="WorkPhone" HtmlEncode="false" ShowHeader="true" />
                        <asp:BoundField HeaderText="<%$ resources:Address.HeaderText %>" DataField="Address" HtmlEncode="false" ShowHeader="true" />
                        <asp:BoundField HeaderText="<%$ resources:City.HeaderText %>" DataField="City" HtmlEncode="false" ShowHeader="true" />
                    </Columns>
                </SalesLogix:SlxGridView>
            </td>
        </tr>
    </table>
    <table>
        <tr>
            <td style="padding-top:25px; padding-bottom:10px">
                <asp:Label ID="lblImportErrors" runat="server" Text="<%$ resources:lblImportErrors.Text %>"></asp:Label>
            </td>
        </tr>
    </table>
    <table>
        <tr>
            <td>
                <%--<SalesLogix:SlxGridView runat="server" ID="grdImportErrors" AutoGenerateColumns="false" CssClass="datagrid"
                        EnableViewState="false" SelectedRowStyle-CssClass="rowSelected" AlternatingRowStyle-CssClass="rowdk" 
                        RowStyle-CssClass="rowlt" ShowEmptyTable="true" EmptyTableRowText="<%$ resources:NoRecords.EmptyTableRowText %>">   
                    <Columns>
                        <asp:HyperLinkField HeaderText="De-Duplicate" ShowHeader="true" />
                        <asp:BoundField HeaderText="<%$ resources:Error.HeaderText %>" DataField="Score" HtmlEncode="false" ShowHeader="true" />
                        <asp:BoundField HeaderText="<%$ resources:FirstName.HeaderText %>" DataField="FirstName" HtmlEncode="false" ShowHeader="true" />
                        <asp:BoundField HeaderText="<%$ resources:LastName.HeaderText %>" DataField="LastName" HtmlEncode="false" ShowHeader="true" />
                        <asp:BoundField HeaderText="<%$ resources:Company.HeaderText %>" DataField="Company" HtmlEncode="false" ShowHeader="true" />
                        <asp:BoundField HeaderText="<%$ resources:WorkPhone.HeaderText %>" DataField="WorkPhone" HtmlEncode="false" ShowHeader="true" />
                        <asp:BoundField HeaderText="<%$ resources:Address.HeaderText %>" DataField="Address" HtmlEncode="false" ShowHeader="true" />
                        <asp:BoundField HeaderText="<%$ resources:City.HeaderText %>" DataField="City" HtmlEncode="false" ShowHeader="true" />  
                    </Columns>
                </SalesLogix:SlxGridView>--%>
                <SalesLogix:SlxGridView runat="server" ID="grdHistoryItems" GridLines="None" CellPadding="4" DataKeyNames=""
                        EnableViewState="false" ExpandableRows="true" CssClass="datagrid" PagerStyle-CssClass="gridPager"
                        SelectedRowStyle-CssClass="rowSelected" AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt"
                        ResizableColumns="True" AutoGenerateColumns="false" ShowEmptyTable="true" AllowPaging="true"
                        EmptyTableRowText="No records match the selection criteria." PageSize="100"   
                        OnPageIndexChanging="grdHistoryItems_OnPageIndexChanging">
                        <Columns>
                            <asp:BoundField DataField="RecordNumber" HeaderText="Record Number" />
                            <asp:BoundField DataField="TimeStamp" HeaderText="Time Stamp" />
                            <asp:BoundField DataField="ItemType" HeaderText="Type" />
                            <asp:BoundField DataField="Description" HeaderText="Description" />
                        </Columns>
                    </SalesLogix:SlxGridView>
            </td>
        </tr>
    </table>
</div>