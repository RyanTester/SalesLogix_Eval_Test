<%@ Control Language="C#" AutoEventWireup="true" CodeFile="RemoteNotesWhatsNew.ascx.cs" Inherits="RemoteNotesWhatsNew" %>
<%@ Register Assembly="Sage.SalesLogix.Web" Namespace="Sage.SalesLogix.Web" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>

<div style="display:none">
    <asp:Panel ID="Notes_LTools" runat="server">
        <asp:Image ID="imgNotes" runat="server" ImageUrl="~/images/icons/Note_24x24.gif" />
        &nbsp&nbsp
        <asp:Label ID="lblNotesTitle" runat="server"></asp:Label>
    </asp:Panel>
    <asp:Panel ID="Notes_CTools" runat="server"></asp:Panel>
    <asp:Panel ID="Notes_RTools" runat="server"></asp:Panel>
</div>

<div id="divNewNotes" runat="server">
    <SalesLogix:SlxGridView ID="grdNewNotes" CssClass="datagrid" AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt"
        GridLines="none" runat="server" AutoGenerateColumns="False" CellPadding="4" ShowEmptyTable="True" ShowSortIcon="true"
        AllowPaging="true" AllowSorting="true" PageSize="10" EmptyTableRowText="<%$ resources: grdNotes_EmptyRow %>"
        OnPageIndexChanging="PageIndexChanging" OnSorting="grdNotes_Sorting" EnableViewState="false">
        <Columns>
            <asp:TemplateField HeaderText="<%$ resources: grdNotes_Completed_ColumnHeader %>" HeaderStyle-Width="100px" SortExpression="CompletedDate">
                <ItemTemplate>
                    <SalesLogix:DateTimePicker id="dteCompletedDate" Runat="Server" DisplayMode="AsText" DisplayTime="False" Timeless="true" DateTimeValue='<%# Eval("CompletedDate") %>' />
                </ItemTemplate>
            </asp:TemplateField>
            <asp:BoundField DataField="Account" SortExpression="Account" HeaderText="<%$ resources: grdNotes_Account_ColumnHeader %>" />
            <asp:BoundField DataField="Contact" SortExpression="Account" HeaderText="<%$ resources: grdNotes_Contact_ColumnHeader %>" />
            <asp:BoundField DataField="Regarding" HeaderText="<%$ resources: grdNotes_Regarding_ColumnHeader %>" SortExpression="Regarding"/>
            <asp:BoundField DataField="AddedBy" HeaderText="<%$ resources: grdNotes_AddedBy_ColumnHeader %>" SortExpression="AddedBy"/>
            <asp:TemplateField HeaderText="<%$ resources: grdNotes_DateAdded_ColumnHeader %>" HeaderStyle-Width="100px" SortExpression="DateAdded">
                <ItemTemplate>
                    <SalesLogix:DateTimePicker id="dteDateAdded" Runat="Server" DisplayMode="AsText" DisplayTime="False" Timeless="true" DateTimeValue='<%# Eval("DateAdded") %>' />
                </ItemTemplate>
            </asp:TemplateField>
        </Columns>
        <PagerStyle CssClass="gridPager" />
        <PagerSettings Mode="NumericFirstLast" FirstPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Start_16x16" LastPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=End_16x16" />
    </SalesLogix:SlxGridView>
</div>

<div id="divChangedNotes" runat="server">
    <SalesLogix:SlxGridView ID="grdChangedNotes" CssClass="datagrid" AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt"
        GridLines="none" runat="server" AutoGenerateColumns="False" CellPadding="4" ShowEmptyTable="True" ShowSortIcon="true"
        AllowPaging="true" AllowSorting="true" PageSize="10" EmptyTableRowText="<%$ resources: grdNotes_EmptyRow %>"
        OnPageIndexChanging="PageIndexChanging" OnSorting="grdNotes_Sorting" EnableViewState="false">
        <Columns>
            <asp:TemplateField HeaderText="<%$ resources: grdNotes_Completed_ColumnHeader %>" HeaderStyle-Width="100px" SortExpression="CompletedDate">
                <ItemTemplate>
                    <SalesLogix:DateTimePicker id="dteCompletedDate" Runat="Server" DisplayMode="AsText" DisplayTime="False" Timeless="true" DateTimeValue='<%# Eval("CompletedDate") %>' />
                </ItemTemplate>
            </asp:TemplateField>
            <asp:BoundField DataField="Account" SortExpression="Account" HeaderText="<%$ resources: grdNotes_Account_ColumnHeader %>" />
            <asp:BoundField DataField="Contact" SortExpression="Account" HeaderText="<%$ resources: grdNotes_Contact_ColumnHeader %>" />
            <asp:BoundField DataField="Regarding" HeaderText="<%$ resources: grdNotes_Regarding_ColumnHeader %>" SortExpression="Regarding"/>
            <asp:BoundField DataField="ChangedField" HeaderText="<%$ resources: grdChangedNotes_ChangedField_ColumnHeader %>" SortExpression="ChangedField"/>
            <asp:BoundField DataField="ChangedFrom" HeaderText="<%$ resources: grdChangedNotes_ChangedFrom_ColumnHeader %>" SortExpression="ChangedFrom"/>
            <asp:BoundField DataField="ChangedTo" HeaderText="<%$ resources: grdChangedNotes_ChangedTo_ColumnHeader %>" SortExpression="ChangedTo"/>
            <asp:BoundField DataField="ChangedBy" HeaderText="<%$ resources: grdChangedNotes_ChangedBy_ColumnHeader %>" SortExpression="ChangedBy"/>
            <asp:TemplateField HeaderText="<%$ resources: grdChangedNotes_ChangedDate_ColumnHeader %>" HeaderStyle-Width="100px" SortExpression="ChangedDate">
                <ItemTemplate>
                    <SalesLogix:DateTimePicker id="dteChangedDate" Runat="Server" DisplayMode="AsText" DisplayTime="False" Timeless="true" DateTimeValue='<%# Eval("ChangedDate") %>' />
                </ItemTemplate>
            </asp:TemplateField>
        </Columns>
        <PagerStyle CssClass="gridPager" />
        <PagerSettings Mode="NumericFirstLast" FirstPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Start_16x16" LastPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=End_16x16" />
    </SalesLogix:SlxGridView>
</div>
