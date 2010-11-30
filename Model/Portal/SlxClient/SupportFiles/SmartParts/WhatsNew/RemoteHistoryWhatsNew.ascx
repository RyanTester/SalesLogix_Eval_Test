<%@ Control Language="C#" AutoEventWireup="true" CodeFile="RemoteHistoryWhatsNew.ascx.cs" Inherits="RemoteHistoryWhatsNew" %>
<%@ Register Assembly="Sage.SalesLogix.Web" Namespace="Sage.SalesLogix.Web" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>

<div style="display:none">
    <asp:Panel ID="History_LTools" runat="server">
        <asp:Image ID="Image1" runat="server" ImageUrl="~/images/icons/Import_History_24x24.gif" />
        &nbsp&nbsp
        <asp:Label ID="lblHistoryTitle" runat="server"></asp:Label>
    </asp:Panel>
    <asp:Panel ID="History_CTools" runat="server"></asp:Panel>
    <asp:Panel ID="History_RTools" runat="server"></asp:Panel>
</div>

<div id="divNewHistory" runat="server">
    <SalesLogix:SlxGridView ID="grdHistory" CssClass="datagrid" AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt"
        GridLines="none" runat="server" AutoGenerateColumns="False" CellPadding="4" ShowEmptyTable="True" AllowPaging="true"
        AllowSorting="true" PageSize="10" EmptyTableRowText="<%$ resources: grdHistory_EmptyRow %>" EnableViewState="false"
        OnPageIndexChanging="PageIndexChanging" OnSorting="grdHistory_Sorting" ShowSortIcon="true">
        <Columns>
            <asp:TemplateField HeaderText="<%$ resources: grdHistory_Completed_ColumnHeading %>" HeaderStyle-Width="100px" SortExpression="CompletedDate">
                <ItemTemplate>
                    <SalesLogix:DateTimePicker ID="dteCompletedDate" Runat="Server" DisplayMode="AsText" DisplayTime="False" Timeless="true" DateTimeValue='<%# Eval("CompletedDate") %>' />
                </ItemTemplate>
            </asp:TemplateField>
            <asp:BoundField DataField="Account" SortExpression="Account" HeaderText="<%$ resources: grdHistory_Account_ColumnHeader %>" />
            <asp:BoundField DataField="Contact" SortExpression="Contact" HeaderText="<%$ resources: grdHistory_Contact_ColumnHeader %>" />
            <asp:BoundField DataField="Regarding" HeaderText="<%$ resources: grdHistory_Regarding_ColumnHeader %>" SortExpression="Regarding"/>
            <asp:BoundField DataField="AddedBy" HeaderText="<%$ resources: grdHistory_AddedBy_ColumnHeader %>" SortExpression="AddedBy"/>
            <asp:TemplateField HeaderText="<%$ resources: grdHistory_DateAdded_ColumnHeader %>" HeaderStyle-Width="100px" SortExpression="DateAdded">
                <ItemTemplate>
                    <SalesLogix:DateTimePicker id="dteDateAdded" Runat="Server" DisplayMode="AsText" DisplayTime="False" Timeless="true" DateTimeValue='<%# Eval("DateAdded") %>' />
                </ItemTemplate>
            </asp:TemplateField>
        </Columns>
        <PagerStyle CssClass="gridPager" />
        <PagerSettings Mode="NumericFirstLast" FirstPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Start_16x16" LastPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=End_16x16" />
    </SalesLogix:SlxGridView>
</div>

<div id="divUpdatedHistory" runat="server">
    <SalesLogix:SlxGridView ID="grdUpdatedHistory" CssClass="datagrid" AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt"
        GridLines="none" runat="server" AutoGenerateColumns="False" CellPadding="4" ShowEmptyTable="True" AllowPaging="true"
        AllowSorting="true" PageSize="10" EmptyTableRowText="<%$ resources: grdHistory_EmptyRow %>" EnableViewState="false"
        OnPageIndexChanging="PageIndexChanging" OnSorting="grdHistory_Sorting" ShowSortIcon="true">
        <Columns>
            <asp:TemplateField HeaderText="<%$ resources: grdHistory_Completed_ColumnHeading %>" HeaderStyle-Width="100px" SortExpression="CompletedDate">
                <ItemTemplate>
                    <SalesLogix:DateTimePicker ID="dteCompletedDate" Runat="Server" DisplayMode="AsText" DisplayTime="False" Timeless="true" DateTimeValue='<%# Eval("CompletedDate") %>' />
                </ItemTemplate>
            </asp:TemplateField>
            <asp:BoundField DataField="Account" SortExpression="Account" HeaderText="<%$ resources: grdHistory_Account_ColumnHeader %>" />
            <asp:BoundField DataField="Contact" SortExpression="Contact" HeaderText="<%$ resources: grdHistory_Contact_ColumnHeader %>" />
            <asp:BoundField DataField="ChangedField" HeaderText="<%$ resources: grdUpdatedHistory_ChangedField_ColumnHeader %>" SortExpression="ChangedField"/>
            <asp:BoundField DataField="ChangedFrom" HeaderText="<%$ resources: grdUpdatedHistory_ChangedFrom_ColumnHeader %>" SortExpression="ChangedFrom"/>
            <asp:BoundField DataField="ChangedTo" HeaderText="<%$ resources: grdUpdatedHistory_ChangedTo_ColumnHeader %>" SortExpression="ChangedTo"/>
            <asp:BoundField DataField="ChangedBy" HeaderText="<%$ resources: grdUpdatedHistory_ChangedBy_ColumnHeader %>" SortExpression="ChangedBy"/>
            <asp:TemplateField HeaderText="<%$ resources: grdUpdatedHistory_ChangedDate_ColumnHeader %>" HeaderStyle-Width="100px" SortExpression="ChangedDate">
                <ItemTemplate>
                    <SalesLogix:DateTimePicker id="dteChangedDate" Runat="Server" DisplayMode="AsText" DisplayTime="False" Timeless="true" DateTimeValue='<%# Eval("ChangedDate") %>' />
                </ItemTemplate>
            </asp:TemplateField>
        </Columns>
        <PagerStyle CssClass="gridPager" />
        <PagerSettings Mode="NumericFirstLast" FirstPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Start_16x16" LastPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=End_16x16" />
    </SalesLogix:SlxGridView>
</div>