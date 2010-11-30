<%@ Control Language="C#" AutoEventWireup="true" CodeFile="RemoteAccountsWhatsNew.ascx.cs" Inherits="RemoteAccountsWhatsNew" %>
<%@ Register Assembly="Sage.SalesLogix.Web" Namespace="Sage.SalesLogix.Web" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>

<div style="display:none">
    <asp:Panel ID="Accounts_LTools" runat="server">
        <asp:Image runat="server" ImageUrl="~/images/icons/Companies_24x24.gif" />
        &nbsp&nbsp
        <asp:Label ID="lblTitle" runat="server"></asp:Label>
    </asp:Panel>
    <asp:Panel ID="Accounts_CTools" runat="server"></asp:Panel>
    <asp:Panel ID="Accounts_RTools" runat="server"></asp:Panel>
</div>

<div id="divNewAccounts" runat="server">
    <SalesLogix:SlxGridView ID="grdNewAccounts" CssClass="datagrid" AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt" GridLines="none" 
        runat="server" AutoGenerateColumns="False" DataKeyNames="AccountId" CellPadding="4" ShowEmptyTable="True" AllowPaging="true" AllowSorting="true"
        PageSize="10" EmptyTableRowText="<%$ resources: grdAccounts_EmptyRow %>" OnPageIndexChanging="PageIndexChanging" OnSorting="grdAccounts_Sorting"
        EnableViewState="false" OnRowCommand="grdNewAccounts_RowCommand" OnRowDataBound="grdAccounts_RowDataBound" ShowSortIcon="true">
        <Columns>
            <asp:BoundField DataField="AccountId" Visible="false" />
            <asp:ButtonField CommandName="Subscribe" Text="<%$ resources: grdAccounts_Subscribe_Text %>" ItemStyle-Width="100px" ItemStyle-HorizontalAlign="Center" />
            <asp:BoundField DataField="Account" SortExpression="Account" HeaderText="<%$ resources: grdAccounts_Account_ColumnHeader %>" />
            <asp:BoundField DataField="City" HeaderText="<%$ resources: grdAccounts_City_ColumnHeader %>" SortExpression="City"/>
            <asp:BoundField DataField="State" HeaderText="<%$ resources: grdAccounts_State_ColumnHeader %>" SortExpression="State"/>
            <asp:BoundField DataField="AccountMgr" HeaderText="<%$ resources: grdAccounts_AccountMgr_ColumnHeader %>" SortExpression="AccountMgr"/>
            <asp:BoundField DataField="Owner" HeaderText="<%$ resources: grdAccounts_Owner_ColumnHeader %>" SortExpression="Owner"/>
            <asp:BoundField DataField="AddedBy" HeaderText="<%$ resources: grdAccounts_AddedBy_ColumnHeader %>" SortExpression="AddedBy"/>
            <asp:TemplateField HeaderText="<%$ resources: grdAccounts_DateAdded_ColumnHeader %>" HeaderStyle-Width="100px" SortExpression="DateAdded">
                <ItemTemplate>
                    <SalesLogix:DateTimePicker id="dteDateAdded" Runat="Server" DisplayMode="AsText" DisplayTime="False" Timeless="true" DateTimeValue='<%# Eval("DateAdded") %>' />
                </ItemTemplate>
            </asp:TemplateField>
        </Columns>
        <PagerStyle CssClass="gridPager" />
        <PagerSettings Mode="NumericFirstLast" FirstPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Start_16x16" LastPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=End_16x16" />
    </SalesLogix:SlxGridView>
</div>

<div id="divUpdatedAccounts" runat="server" style="display:none">
    <SalesLogix:SlxGridView ID="grdUpdatedAccounts" CssClass="datagrid" AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt" GridLines="none" 
        runat="server" AutoGenerateColumns="False" DataKeyNames="AccountId" CellPadding="4" ShowEmptyTable="True" AllowPaging="true" AllowSorting="true"
        PageSize="10" EmptyTableRowText="<%$ resources: grdAccounts_EmptyRow %>" OnPageIndexChanging="PageIndexChanging" OnSorting="grdAccounts_Sorting"
        EnableViewState="false" OnRowCommand="grdUpdatedAccounts_RowCommand" OnRowDataBound="grdAccounts_RowDataBound" ShowSortIcon="true">
        <Columns>
            <asp:BoundField DataField="AccountId" Visible="false" />
            <asp:ButtonField CommandName="Subscribe" Text="<%$ resources: grdAccounts_Subscribe_Text %>" ItemStyle-Width="100px" ItemStyle-HorizontalAlign="Center" />
            <asp:BoundField DataField="Account" SortExpression="Account" HeaderText="<%$ resources: grdAccounts_Account_ColumnHeader %>" />
            <asp:BoundField DataField="ChangedField" HeaderText="<%$ resources: grdUpdatedAccounts_ChangedField_ColumnHeader %>" SortExpression="ChangedField"/>
            <asp:BoundField DataField="ChangedFrom" HeaderText="<%$ resources: grdUpdatedAccounts_ChangedFrom_ColumnHeader %>" SortExpression="ChangedFrom"/>
            <asp:BoundField DataField="ChangedTo" HeaderText="<%$ resources: grdUpdatedAccounts_ChangedTo_ColumnHeader %>" SortExpression="ChangedTo"/>
            <asp:BoundField DataField="ChangedBy" HeaderText="<%$ resources: grdUpdatedAccounts_ChangedBy_ColumnHeader %>" SortExpression="ChangedBy"/>
            <asp:TemplateField HeaderText="<%$ resources: grdUpdatedAccounts_ChangedDate_ColumnHeader %>" HeaderStyle-Width="100px" SortExpression="ChangedDate">
                <ItemTemplate>
                    <SalesLogix:DateTimePicker id="dteChangedDate" Runat="Server" DisplayMode="AsText" DisplayTime="False" Timeless="true" DateTimeValue='<%# Eval("ChangedDate") %>' />
                </ItemTemplate>
            </asp:TemplateField>
        </Columns>
        <PagerStyle CssClass="gridPager" />
        <PagerSettings Mode="NumericFirstLast" FirstPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Start_16x16" LastPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=End_16x16" />
    </SalesLogix:SlxGridView>
</div>

<div id="divDeletedAccounts" runat="server" style="display:none">
    <SalesLogix:SlxGridView ID="grdDeletedAccounts" CssClass="datagrid" AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt" GridLines="none" 
        runat="server" AutoGenerateColumns="False" DataKeyNames="AccountId" CellPadding="4" ShowEmptyTable="True" AllowPaging="true" AllowSorting="true"
        PageSize="10" EmptyTableRowText="<%$ resources: grdAccounts_EmptyRow %>" OnPageIndexChanging="PageIndexChanging" OnSorting="grdAccounts_Sorting"
        EnableViewState="false" ShowSortIcon="true">
        <Columns>
            <asp:BoundField DataField="AccountId" Visible="false" />
            <asp:BoundField DataField="Account" SortExpression="Account" HeaderText="<%$ resources: grdAccounts_Account_ColumnHeader %>" />
            <asp:BoundField DataField="City" HeaderText="<%$ resources: grdAccounts_City_ColumnHeader %>" SortExpression="City"/>
            <asp:BoundField DataField="State" HeaderText="<%$ resources: grdAccounts_State_ColumnHeader %>" SortExpression="State"/>
            <asp:BoundField DataField="AccountMgr" HeaderText="<%$ resources: grdAccounts_AccountMgr_ColumnHeader %>" SortExpression="AccountMgr"/>
            <asp:BoundField DataField="Owner" HeaderText="<%$ resources: grdAccounts_Owner_ColumnHeader %>" SortExpression="Owner"/>
            <asp:BoundField DataField="DeletedBy" HeaderText="<%$ resources: grdDeletedAccounts_DeletedBy_ColumnHeader %>" SortExpression="DeletedBy"/>
            <asp:TemplateField HeaderText="<%$ resources: grdDeletedAccounts_DeletedDate_ColumnHeader %>" HeaderStyle-Width="100px" SortExpression="DeletedDate">
                <ItemTemplate>
                    <SalesLogix:DateTimePicker id="dteDateDeleted" Runat="Server" DisplayMode="AsText" DisplayTime="False" Timeless="true" DateTimeValue='<%# Eval("DeletedDate") %>' />
                </ItemTemplate>
            </asp:TemplateField>
        </Columns>
        <PagerStyle CssClass="gridPager" />
        <PagerSettings Mode="NumericFirstLast" FirstPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Start_16x16" LastPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=End_16x16" />
    </SalesLogix:SlxGridView>
</div>