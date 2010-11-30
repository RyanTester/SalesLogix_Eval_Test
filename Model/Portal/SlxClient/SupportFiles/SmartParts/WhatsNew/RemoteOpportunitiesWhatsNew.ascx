<%@ Control Language="C#" AutoEventWireup="true" CodeFile="RemoteOpportunitiesWhatsNew.ascx.cs" Inherits="RemoteOpportunitiesWhatsNew" %>
<%@ Register Assembly="Sage.SalesLogix.Web" Namespace="Sage.SalesLogix.Web" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>

<div style="display:none">
    <asp:Panel ID="Opportunities_LTools" runat="server">
        <asp:Image ID="imgOpportunities" runat="server" ImageUrl="~/images/icons/Opportunity_Dashboard_24x24.gif" />
        &nbsp&nbsp
        <asp:Label ID="lblOpportunitiesTitle" runat="server"></asp:Label>
    </asp:Panel>
    <asp:Panel ID="Opportunities_CTools" runat="server"></asp:Panel>
    <asp:Panel ID="Opportunities_RTools" runat="server"></asp:Panel>
</div>

<div id="divNewOpportunities" runat="server">
    <SalesLogix:SlxGridView ID="grdNewOpportunities" CssClass="datagrid" AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt"
        GridLines="none" runat="server" AutoGenerateColumns="False" DataKeyNames="AccountId" CellPadding="4" ShowEmptyTable="True"
        AllowPaging="true" AllowSorting="true" PageSize="10" EmptyTableRowText="<%$ resources: grdOpportunities_EmptyRow %>"
        OnPageIndexChanging="PageIndexChanging" OnSorting="grdOpportunities_Sorting" EnableViewState="false" ShowSortIcon="true">
        <Columns>
            <asp:BoundField DataField="AccountId" Visible="false" />
            <asp:BoundField DataField="Account" SortExpression="Account" HeaderText="<%$ resources: grdOpportunities_Account_ColumnHeader %>" />
            <asp:BoundField DataField="City" HeaderText="<%$ resources: grdOpportunities_City_ColumnHeader %>" SortExpression="City"/>
            <asp:BoundField DataField="State" HeaderText="<%$ resources: grdOpportunities_State_ColumnHeader %>" SortExpression="State"/>
            <asp:BoundField DataField="Description" HeaderText="<%$ resources: grdOpportunities_Description_ColumnHeader %>" SortExpression="Description"/>
            <asp:BoundField DataField="PotentialSales" HeaderText="<%$ resources: grdOpportunities_Potential_ColumnHeader %>" SortExpression="PotentialSales"/>
            <asp:TemplateField HeaderText="<%$ resources: grdOpportunities_CloseDate_ColumnHeader %>" HeaderStyle-Width="100px" SortExpression="CloseDate">
                <ItemTemplate>
                    <SalesLogix:DateTimePicker id="dteCloseDate" Runat="Server" DisplayMode="AsText" DisplayTime="False" Timeless="true" DateTimeValue='<%# Eval("CloseDate") %>' />
                </ItemTemplate>
            </asp:TemplateField>
            <asp:BoundField DataField="AccountMgr" HeaderText="<%$ resources: grdOpportunities_AccountMgr_ColumnHeader %>" SortExpression="AccountMgr"/>
            <asp:BoundField DataField="Owner" HeaderText="<%$ resources: grdOpportunities_Owner_ColumnHeader %>" SortExpression="Owner"/>
            <asp:BoundField DataField="AddedBy" HeaderText="<%$ resources: grdOpportunities_AddedBy_ColumnHeader %>" SortExpression="AddedBy"/>
            <asp:TemplateField HeaderText="<%$ resources: grdOpportunities_DateAdded_ColumnHeader %>" HeaderStyle-Width="100px" SortExpression="DateAdded">
                <ItemTemplate>
                    <SalesLogix:DateTimePicker id="dteDateAdded" Runat="Server" DisplayMode="AsText" DisplayTime="False" Timeless="true" DateTimeValue='<%# Eval("DateAdded") %>' />
                </ItemTemplate>
            </asp:TemplateField>
        </Columns>
        <PagerStyle CssClass="gridPager" />
        <PagerSettings Mode="NumericFirstLast" FirstPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Start_16x16" LastPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=End_16x16" />
    </SalesLogix:SlxGridView>
</div>

<div id="divUpdatedOpportunities" runat="server" style="display:none">
    <SalesLogix:SlxGridView ID="grdUpdatedOpportunities" CssClass="datagrid" AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt"
        GridLines="none" runat="server" AutoGenerateColumns="False" DataKeyNames="AccountId" CellPadding="4" ShowEmptyTable="True"
        AllowPaging="true" AllowSorting="true" PageSize="10" EmptyTableRowText="<%$ resources: grdOpportunities_EmptyRow %>"
        OnPageIndexChanging="PageIndexChanging" OnSorting="grdOpportunities_Sorting" EnableViewState="false" ShowSortIcon="true">
        <Columns>
            <asp:BoundField DataField="AccountId" Visible="false" />
            <asp:BoundField DataField="Account" SortExpression="Account" HeaderText="<%$ resources: grdOpportunities_Account_ColumnHeader %>" />
            <asp:BoundField DataField="Description" HeaderText="<%$ resources: grdOpportunities_Description_ColumnHeader %>" SortExpression="City"/>
            <asp:BoundField DataField="ChangedField" HeaderText="<%$ resources: grdUpdatedOpportunities_ChangedField_ColumnHeader %>" SortExpression="ChangedField"/>
            <asp:BoundField DataField="ChangedFrom" HeaderText="<%$ resources: grdUpdatedOpportunities_ChangedFrom_ColumnHeader %>" SortExpression="ChangedFrom"/>
            <asp:BoundField DataField="ChangedTo" HeaderText="<%$ resources: grdUpdatedOpportunities_ChangedTo_ColumnHeader %>" SortExpression="ChangedTo"/>
            <asp:BoundField DataField="ChangedBy" HeaderText="<%$ resources: grdUpdatedOpportunities_ChangedBy_ColumnHeader %>" SortExpression="ChangedBy"/>
            <asp:TemplateField HeaderText="<%$ resources: grdUpdatedOpportunities_ChangedDate_ColumnHeader %>" HeaderStyle-Width="100px" SortExpression="ChangedDate">
                <ItemTemplate>
                    <SalesLogix:DateTimePicker id="dteChangedDate" Runat="Server" DisplayMode="AsText" DisplayTime="False" Timeless="true" DateTimeValue='<%# Eval("ChangedDate") %>' />
                </ItemTemplate>
            </asp:TemplateField>
        </Columns>
        <PagerStyle CssClass="gridPager" />
        <PagerSettings Mode="NumericFirstLast" FirstPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Start_16x16" LastPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=End_16x16" />
    </SalesLogix:SlxGridView>
</div>

<div id="divDeletedOpportunities" runat="server" style="display:none">
    <SalesLogix:SlxGridView ID="grdDeletedOpportunities" CssClass="datagrid" AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt"
        GridLines="none" runat="server" AutoGenerateColumns="False" DataKeyNames="AccountId" CellPadding="4" ShowEmptyTable="True"
        AllowPaging="true" AllowSorting="true" PageSize="10" EmptyTableRowText="<%$ resources: grdOpportunities_EmptyRow %>"
        OnPageIndexChanging="PageIndexChanging" OnSorting="grdOpportunities_Sorting" EnableViewState="false" ShowSortIcon="true">
        <Columns>
            <asp:BoundField DataField="AccountId" Visible="false" />
            <asp:BoundField DataField="Account" SortExpression="Account" HeaderText="<%$ resources: grdOpportunities_Account_ColumnHeader %>" />
            <asp:BoundField DataField="City" HeaderText="<%$ resources: grdOpportunities_City_ColumnHeader %>" SortExpression="City"/>
            <asp:BoundField DataField="State" HeaderText="<%$ resources: grdOpportunities_State_ColumnHeader %>" SortExpression="State"/>
            <asp:BoundField DataField="Description" HeaderText="<%$ resources: grdOpportunities_Description_ColumnHeader %>" SortExpression="Description"/>
            <asp:BoundField DataField="PotentialSales" HeaderText="<%$ resources: grdOpportunities_Potential_ColumnHeader %>" SortExpression="PotentialSales"/>
            <asp:TemplateField HeaderText="<%$ resources: grdOpportunities_CloseDate_ColumnHeader %>" HeaderStyle-Width="100px" SortExpression="CloseDate">
                <ItemTemplate>
                    <SalesLogix:DateTimePicker id="dteCloseDate" Runat="Server" DisplayMode="AsText" DisplayTime="False" Timeless="true" DateTimeValue='<%# Eval("CloseDate") %>' />
                </ItemTemplate>
            </asp:TemplateField>
            <asp:BoundField DataField="AccountMgr" HeaderText="<%$ resources: grdOpportunities_AccountMgr_ColumnHeader %>" SortExpression="AccountMgr"/>
            <asp:BoundField DataField="Owner" HeaderText="<%$ resources: grdOpportunities_Owner_ColumnHeader %>" SortExpression="Owner"/>
            <asp:BoundField DataField="DeletedBy" HeaderText="<%$ resources: grdDeletedOpportunities_DeletedBy_ColumnHeader %>" SortExpression="DeletedBy"/>
            <asp:TemplateField HeaderText="<%$ resources: grdDeletedOpportunities_DeletedDate_ColumnHeader %>" HeaderStyle-Width="100px" SortExpression="DeletedDate">
                <ItemTemplate>
                    <SalesLogix:DateTimePicker id="dteDeletedDate" Runat="Server" DisplayMode="AsText" DisplayTime="False" Timeless="true" DateTimeValue='<%# Eval("DeletedDate") %>' />
                </ItemTemplate>
            </asp:TemplateField>
        </Columns>
        <PagerStyle CssClass="gridPager" />
        <PagerSettings Mode="NumericFirstLast" FirstPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Start_16x16" LastPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=End_16x16" />
    </SalesLogix:SlxGridView>
</div>
