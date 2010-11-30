<%@ Control Language="C#" AutoEventWireup="true" CodeFile="RemoteContactsWhatsNew.ascx.cs" Inherits="RemoteContactsWhatsNew" %>
<%@ Register Assembly="Sage.SalesLogix.Web" Namespace="Sage.SalesLogix.Web" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>

<div style="display:none">
    <asp:Panel ID="Contacts_LTools" runat="server">
        <asp:Image ID="imgContacts" runat="server" ImageUrl="~/images/icons/Contacts_24x24.gif" />
        &nbsp&nbsp
        <asp:Label ID="lblContactsTitle" runat="server"></asp:Label>
    </asp:Panel>
    <asp:Panel ID="Contacts_CTools" runat="server"></asp:Panel>
    <asp:Panel ID="Contacts_RTools" runat="server"></asp:Panel>
</div>

<div id="divNewContacts" runat="server">
    <SalesLogix:SlxGridView ID="grdNewContacts" CssClass="datagrid" AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt"
        GridLines="none" runat="server" AutoGenerateColumns="False" DataKeyNames="contactId" CellPadding="4" ShowEmptyTable="True"
        AllowPaging="true" AllowSorting="true" PageSize="10" EmptyTableRowText="<%$ resources: grdContacts_EmptyRow %>"
        OnPageIndexChanging="PageIndexChanging" OnSorting="grdContacts_Sorting" EnableViewState="false" ShowSortIcon="true">
        <Columns>
            <asp:BoundField DataField="ContactId" Visible="false" />
            <asp:BoundField DataField="Contact" SortExpression="Contact" HeaderText="<%$ resources: grdContacts_Name_ColumnHeader %>" />
            <asp:BoundField DataField="Account" SortExpression="Account" HeaderText="<%$ resources: grdContacts_Account_ColumnHeader %>" />
            <asp:BoundField DataField="City" HeaderText="<%$ resources: grdContacts_City_ColumnHeader %>" SortExpression="City"/>
            <asp:BoundField DataField="State" HeaderText="<%$ resources: grdContacts_State_ColumnHeader %>" SortExpression="State"/>
            <asp:BoundField DataField="AccountMgr" HeaderText="<%$ resources: grdContacts_AccountMgr_ColumnHeader %>" SortExpression="AccountMgr"/>
            <asp:BoundField DataField="Owner" HeaderText="<%$ resources: grdContacts_Owner_ColumnHeader %>" SortExpression="Owner"/>
            <asp:BoundField DataField="AddedBy" HeaderText="<%$ resources: grdContacts_AddedBy_ColumnHeader %>" SortExpression="AddedBy"/>
            <asp:TemplateField HeaderText="<%$ resources: grdContacts_DateAdded_ColumnHeader %>" HeaderStyle-Width="100px" SortExpression="DateAdded">
                <ItemTemplate>
                    <SalesLogix:DateTimePicker id="dteDateAdded" Runat="Server" DisplayMode="AsText" DisplayTime="False" Timeless="true" DateTimeValue='<%# Eval("DateAdded") %>' />
                </ItemTemplate>
            </asp:TemplateField>
        </Columns>
        <PagerStyle CssClass="gridPager" />
        <PagerSettings Mode="NumericFirstLast" FirstPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Start_16x16" LastPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=End_16x16" />
    </SalesLogix:SlxGridView>
</div>

<div id="divUpdatedContacts" runat="server" style="display:none">
    <SalesLogix:SlxGridView ID="grdUpdatedContacts" CssClass="datagrid" AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt"
        GridLines="none" runat="server" AutoGenerateColumns="False" DataKeyNames="contactId" CellPadding="4" ShowEmptyTable="True"
        AllowPaging="true" AllowSorting="true" PageSize="10" EmptyTableRowText="<%$ resources: grdContacts_EmptyRow %>"
        OnPageIndexChanging="PageIndexChanging" OnSorting="grdContacts_Sorting" EnableViewState="false" ShowSortIcon="true">
        <Columns>
            <asp:BoundField DataField="ContactId" Visible="false" />
            <asp:BoundField DataField="Contact" SortExpression="Contact" HeaderText="<%$ resources: grdContacts_Name_ColumnHeader %>" />
            <asp:BoundField DataField="Account" SortExpression="Account" HeaderText="<%$ resources: grdContacts_Account_ColumnHeader %>" />
            <asp:BoundField DataField="ChangedField" HeaderText="<%$ resources: grdUpdatedContacts_ChangedField_ColumnHeader %>" SortExpression="ChangedField"/>
            <asp:BoundField DataField="ChangedFrom" HeaderText="<%$ resources: grdUpdatedContacts_ChangedFrom_ColumnHeader %>" SortExpression="ChangedFrom"/>
            <asp:BoundField DataField="ChangedTo" HeaderText="<%$ resources: grdUpdatedContacts_ChangedTo_ColumnHeader %>" SortExpression="ChangedTo"/>
            <asp:BoundField DataField="ChangedBy" HeaderText="<%$ resources: grdUpdatedContacts_ChangedBy_ColumnHeader %>" SortExpression="ChangedBy"/>
            <asp:TemplateField HeaderText="<%$ resources: grdUpdatedContacts_ChangedDate_ColumnHeader %>" HeaderStyle-Width="100px" SortExpression="ChangedDate">
                <ItemTemplate>
                    <SalesLogix:DateTimePicker id="dteChangedDate" Runat="Server" DisplayMode="AsText" DisplayTime="False" Timeless="true" DateTimeValue='<%# Eval("ChangedDate") %>' />
                </ItemTemplate>
            </asp:TemplateField>
        </Columns>
        <PagerStyle CssClass="gridPager" />
        <PagerSettings Mode="NumericFirstLast" FirstPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Start_16x16" LastPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=End_16x16" />
    </SalesLogix:SlxGridView>
</div>

<div id="divDeletedContacts" runat="server" style="display:none">
    <SalesLogix:SlxGridView ID="grdDeletedContacts" CssClass="datagrid" AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt"
        GridLines="none" runat="server" AutoGenerateColumns="False" DataKeyNames="contactId" CellPadding="4" ShowEmptyTable="True"
        AllowPaging="true" AllowSorting="true" PageSize="10" EmptyTableRowText="<%$ resources: grdContacts_EmptyRow %>"
        OnPageIndexChanging="PageIndexChanging" OnSorting="grdContacts_Sorting" EnableViewState="false" ShowSortIcon="true">
        <Columns>
            <asp:BoundField DataField="ContactId" Visible="false" />
            <asp:BoundField DataField="Contact" SortExpression="Contact" HeaderText="<%$ resources: grdContacts_Name_ColumnHeader %>" />
            <asp:BoundField DataField="Account" SortExpression="Account" HeaderText="<%$ resources: grdContacts_Account_ColumnHeader %>" />
            <asp:BoundField DataField="City" HeaderText="<%$ resources: grdContacts_City_ColumnHeader %>" SortExpression="City"/>
            <asp:BoundField DataField="State" HeaderText="<%$ resources: grdContacts_State_ColumnHeader %>" SortExpression="State"/>
            <asp:BoundField DataField="AccountMgr" HeaderText="<%$ resources: grdContacts_AccountMgr_ColumnHeader %>" SortExpression="AccountMgr"/>
            <asp:BoundField DataField="Owner" HeaderText="<%$ resources: grdContacts_Owner_ColumnHeader %>" SortExpression="Owner"/>
            <asp:BoundField DataField="DeletedBy" HeaderText="<%$ resources: grdDeletedContacts_DeletedBy_ColumnHeader %>" SortExpression="DeletedBy"/>
            <asp:TemplateField HeaderText="<%$ resources: grdDeletedContacts_DeletedDate_ColumnHeader %>" HeaderStyle-Width="100px" SortExpression="DeletedDate">
                <ItemTemplate>
                    <SalesLogix:DateTimePicker id="dteDeletedDate" Runat="Server" DisplayMode="AsText" DisplayTime="False" Timeless="true" DateTimeValue='<%# Eval("DeletedDate") %>' />
                </ItemTemplate>
            </asp:TemplateField>
        </Columns>
        <PagerStyle CssClass="gridPager" />
        <PagerSettings Mode="NumericFirstLast" FirstPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Start_16x16" LastPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=End_16x16" />
    </SalesLogix:SlxGridView>
</div>
