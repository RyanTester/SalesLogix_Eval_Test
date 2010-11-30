<%@ Control Language="C#" AutoEventWireup="true" CodeFile="ContractsWhatsNew.ascx.cs" Inherits="ContractsWhatsNew" %>
<%@ Register Assembly="Sage.SalesLogix.Web" Namespace="Sage.SalesLogix.Web" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="System.Web.Extensions, Version=3.5.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" Namespace="System.Web.UI" TagPrefix="asp" %>

<asp:ObjectDataSource
    ID="ContractsNewObjectDataSource"
    runat="server"
    TypeName="Sage.SalesLogix.LegacyBridge.WhatsNewRequest`1[[Sage.Entity.Interfaces.IContract, Sage.Entity.Interfaces]]"
    DataObjectTypeName="Sage.Entity.Interfaces.IContract"
    onobjectcreating="CreateContractsWhatsNewDataSource"
    onobjectdisposing="DisposeContractsWhatsNewDataSource"
    EnablePaging="true"
    StartRowIndexParameterName="StartRecord"
    MaximumRowsParameterName="MaxRecords"
    SelectMethod="GetData"
    SelectCountMethod="GetRecordCount"
    SortParameterName="sortExpression"
     >
</asp:ObjectDataSource>

<asp:ObjectDataSource
    ID="ContractsModifiedObjectDataSource"
    runat="server"
    TypeName="Sage.SalesLogix.LegacyBridge.WhatsNewRequest`1[[Sage.Entity.Interfaces.IContract, Sage.Entity.Interfaces]]"
    DataObjectTypeName="Sage.Entity.Interfaces.IContract"
    onobjectcreating="CreateContractsWhatsModifiedDataSource"
    onobjectdisposing="DisposeContractsWhatsNewDataSource"
    EnablePaging="true"
    StartRowIndexParameterName="StartRecord"
    MaximumRowsParameterName="MaxRecords"
    SelectMethod="GetData"
    SelectCountMethod="GetRecordCount"
    SortParameterName="sortExpression"
     >
</asp:ObjectDataSource>

<SalesLogix:SlxGridView Caption="<%$ resources : NewContracts_Caption %>" ID="grdNewContracts" CssClass="datagrid" DataKeyNames="Id"
    AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt" GridLines="none" runat="server" AutoGenerateColumns="False" 
    CellPadding="4" ShowEmptyTable="True" AllowPaging="true" AllowSorting="true" PageSize="10" OnSorting="Sorting" EnableViewState="false"
    EmptyTableRowText="<%$ resources: grdNewContracts.EmptyTableRowText %>" OnPageIndexChanging="grdNewContracts_PageIndexChanging" >
    <Columns>
        <asp:TemplateField SortExpression="ReferenceNumber" HeaderText="<%$ resources: grdNewContracts.ReferenceNumber.ColumnHeading %>">
            <ItemTemplate>
                <SalesLogix:PageLink ID="lnkContract" runat="server" Target="_top" LinkType="EntityAlias" Text='<%# Eval("ReferenceNumber") %>'
                    NavigateUrl="contract" EntityId='<%# Eval("Id") %>' />
            </ItemTemplate>
        </asp:TemplateField>
        <asp:TemplateField SortExpression="Account" HeaderText="<%$ resources: grdNewContracts.AccountName.ColumnHeading %>">
            <ItemTemplate>
                <SalesLogix:PageLink ID="lnkAccount" runat="server" Target="_top" LinkType="EntityAlias" Text='<%# Eval("Account.AccountName") %>'
                    NavigateUrl="account" EntityId='<%# Eval("Account.Id") %>' />
            </ItemTemplate>
        </asp:TemplateField>
        <asp:BoundField DataField="Remaining" HeaderText="<%$ resources: grdNewContracts.Remaining.ColumnHeading %>" SortExpression="Remaining" />
        <asp:TemplateField HeaderText="<%$ resources: grdNewContracts.CreateDate.ColumnHeading %>" HeaderStyle-Width="100px" SortExpression="CreateDate">
            <ItemTemplate>
                <SalesLogix:DateTimePicker id="dteCreateDate" Runat="Server" DisplayMode="AsText" DisplayTime="False" DateTimeValue=<%# Eval("CreateDate") %> />
            </ItemTemplate>
        </asp:TemplateField>
        <asp:TemplateField HeaderText="<%$ resources: grdNewContracts.CreateUser.ColumnHeading %>" SortExpression="CreateUser" >
            <itemtemplate>
                <SalesLogix:SlxUserControl runat="server" ID="dteCreateUser" DisplayMode="AsText" LookupResultValue='<%# Eval("CreateUser") %>' />
            </itemtemplate>
        </asp:TemplateField>
    </Columns>
	<PagerStyle CssClass="gridPager" />
    <PagerSettings Mode="NumericFirstLast" FirstPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Start_16x16" LastPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=End_16x16" />
</SalesLogix:SlxGridView>
<br/>

<SalesLogix:SlxGridView Caption="<%$ resources : ModifiedContracts_Caption %>" ID="grdModifiedContracts" CssClass="datagrid" OnSorting="Sorting"
    AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt" GridLines="none" runat="server" AutoGenerateColumns="False" DataKeyNames="Id"
    CellPadding="4" ShowEmptyTable="True" AllowPaging="true" AllowSorting="true" PageSize="10" EnableViewState="false"
    EmptyTableRowText="<%$ resources: grdChangedContracts.EmptyTableRowText %>" OnPageIndexChanging="grdModifiedContracts_PageIndexChanging" >
    <Columns>
        <asp:TemplateField SortExpression="ReferenceNumber" HeaderText="<%$ resources: grdNewContracts.ReferenceNumber.ColumnHeading %>">
            <ItemTemplate>
                <SalesLogix:PageLink ID="lnkChangedContract" runat="server" Target="_top" LinkType="EntityAlias" Text='<%# Eval("ReferenceNumber") %>'
                    NavigateUrl="contract" EntityId='<%# Eval("Id") %>' />
            </ItemTemplate>
        </asp:TemplateField>
        <asp:TemplateField SortExpression="Account" HeaderText="<%$ resources: grdNewContracts.AccountName.ColumnHeading %>">
            <ItemTemplate>
                <SalesLogix:PageLink ID="lnkChangedAccount" runat="server" Target="_top" LinkType="EntityAlias" Text='<%# Eval("Account.AccountName") %>'
                    NavigateUrl="account" EntityId='<%# Eval("Account.Id") %>' />
            </ItemTemplate>
        </asp:TemplateField>
        <asp:BoundField DataField="Remaining" HeaderText="<%$ resources: grdNewContracts.Remaining.ColumnHeading %>" SortExpression="Remaining" />
        <asp:TemplateField HeaderText="<%$ resources: grdNewContracts.Modified.ColumnHeading %>" HeaderStyle-Width="100px" SortExpression="ModifyDate">
            <ItemTemplate>
                <SalesLogix:DateTimePicker id="dteModifyDate" Runat="Server" DisplayMode="AsText" DisplayTime="False" DateTimeValue=<%# Eval("ModifyDate") %> />
            </ItemTemplate>
        </asp:TemplateField>
        <asp:TemplateField HeaderText="<%$ resources: grdNewContracts.ModifyUser.ColumnHeading %>" SortExpression="ModifyUser" >
            <itemtemplate>
                <SalesLogix:SlxUserControl runat="server" ID="dteModifyUser" DisplayMode="AsText" LookupResultValue='<%# Eval("ModifyUser") %>' />
            </itemtemplate>
        </asp:TemplateField>
    </Columns>
	<PagerStyle CssClass="gridPager" />
    <PagerSettings Mode="NumericFirstLast" FirstPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Start_16x16" LastPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=End_16x16" />
</SalesLogix:SlxGridView>