<%@ Control Language="C#" AutoEventWireup="true" CodeFile="ReturnsWhatsNew.ascx.cs" Inherits="ReturnsWhatsNew" %>
<%@ Register Assembly="Sage.SalesLogix.Web" Namespace="Sage.SalesLogix.Web" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.PickList" TagPrefix="SalesLogix" %>
<%@ Register Assembly="System.Web.Extensions, Version=3.5.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" Namespace="System.Web.UI" TagPrefix="asp" %>

<asp:ObjectDataSource
    ID="ReturnsNewObjectDataSource" 
    runat="server"
    TypeName="Sage.SalesLogix.LegacyBridge.WhatsNewRequest`1[[Sage.Entity.Interfaces.IReturn, Sage.Entity.Interfaces]]"
    DataObjectTypeName="Sage.Entity.Interfaces.IReturn"
    onobjectcreating="CreateReturnsWhatsNewDataSource"
    onobjectdisposing="DisposeReturnsWhatsNewDataSource"
    EnablePaging="true"
    StartRowIndexParameterName="StartRecord"
    MaximumRowsParameterName="MaxRecords" 
    SelectMethod="GetData"
    SelectCountMethod="GetRecordCount"
    SortParameterName="sortExpression"
     >
</asp:ObjectDataSource>

<asp:ObjectDataSource
    ID="ReturnsModifiedObjectDataSource" 
    runat="server"
    TypeName="Sage.SalesLogix.LegacyBridge.WhatsNewRequest`1[[Sage.Entity.Interfaces.IReturn, Sage.Entity.Interfaces]]"
    DataObjectTypeName="Sage.Entity.Interfaces.IReturn"
    onobjectcreating="CreateReturnsWhatsModifiedDataSource"
    onobjectdisposing="DisposeReturnsWhatsNewDataSource"
    EnablePaging="true"
    StartRowIndexParameterName="StartRecord"
    MaximumRowsParameterName="MaxRecords" 
    SelectMethod="GetData"
    SelectCountMethod="GetRecordCount"
    SortParametername="sortExpression"
     >
</asp:ObjectDataSource>

<SalesLogix:SlxGridView Caption="<%$ resources : NewReturns_Caption %>" ID="grdNewReturns" CssClass="datagrid" EnableViewState="false"
    AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt" GridLines="none" runat="server" AutoGenerateColumns="False"
    DataKeyNames="Id" CellPadding="4" ShowEmptyTable="True" AllowPaging="true" AllowSorting="true" PageSize="10" OnSorting="Sorting"
    EmptyTableRowText="<%$ resources: grdReturns.EmptyTableRowText %>" OnPageIndexChanging="grdNewReturns_PageIndexChanging" >
    <Columns>
        <asp:TemplateField SortExpression="ReturnNumber" HeaderText="<%$ resources: grdNewReturns.ReturnNumber.ColumnHeading %>">
            <ItemTemplate>
                <SalesLogix:PageLink ID="lnkNewReturns" runat="server" Target="_top" LinkType="EntityAlias" Text='<%# Eval("ReturnNumber") %>'
                    NavigateUrl="return" EntityId='<%# Eval("Id") %>' />
            </ItemTemplate>
        </asp:TemplateField>
        <asp:TemplateField SortExpression="Account" HeaderText="<%$ resources: grdNewReturns.AccountName.ColumnHeading %>">
            <ItemTemplate>
                <SalesLogix:PageLink ID="lnkNewAccount" runat="server" Target="_top" LinkType="EntityAlias" Text='<%# Eval("Account.AccountName") %>'
                    NavigateUrl="Account" EntityId='<%# Eval("Account.Id") %>' />
            </ItemTemplate>
        </asp:TemplateField>
        <asp:TemplateField HeaderText="<%$ resources: grdNewReturns.CityStateZip.ColumnHeading %>" SortExpression="CityStatePostal">
            <ItemTemplate>
                <asp:Label id="lblNewAddress" Runat="Server" Text='<%# Eval("ReturnShippedAddress.FullAddress") %>' />
            </ItemTemplate>
        </asp:TemplateField>
        <asp:TemplateField HeaderText="<%$ resources: grdNewReturns.CreateDate.ColumnHeading %>" HeaderStyle-Width="100px" SortExpression="CreateDate">
            <ItemTemplate>
                <SalesLogix:DateTimePicker id="dteNewCreateDate" Runat="Server" DisplayMode="AsText" DisplayTime="False" DateTimeValue=<%# Eval("CreateDate") %> />
            </ItemTemplate>
        </asp:TemplateField>
        <asp:TemplateField HeaderText="<%$ resources: grdNewReturns.CreateUser.ColumnHeading %>" SortExpression="CreateUser" >
            <itemtemplate>
                <SalesLogix:SlxUserControl runat="server" ID="usrNewCreateUser" DisplayMode="AsText" LookupResultValue='<%# Eval("CreateUser") %>' />
            </itemtemplate>
        </asp:TemplateField>
    </Columns>
	<PagerStyle CssClass="gridPager" />
    <PagerSettings Mode="NumericFirstLast" FirstPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Start_16x16" LastPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=End_16x16" />
</SalesLogix:SlxGridView>
<br/>

<SalesLogix:SlxGridView Caption="<%$ resources : ModifiedReturns_Caption %>" ID="grdModifiedReturns" CssClass="datagrid" EnableViewState="false"
    AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt" GridLines="none" runat="server" AutoGenerateColumns="False"
    DataKeyNames="Id" CellPadding="4" ShowEmptyTable="True" AllowPaging="true" AllowSorting="true" PageSize="10" OnSorting="Sorting"
    EmptyTableRowText="<%$ resources: grdReturns.EmptyTableRowText %>" OnPageIndexChanging="grdNewReturns_PageIndexChanging" >
    <Columns>
        <asp:TemplateField SortExpression="ReturnNumber" HeaderText="<%$ resources: grdNewReturns.ReturnNumber.ColumnHeading %>">
            <ItemTemplate>
                <SalesLogix:PageLink ID="lnkModifiedReturns" runat="server" Target="_top" LinkType="EntityAlias" Text='<%# Eval("ReturnNumber") %>'
                    NavigateUrl="return" EntityId='<%# Eval("Id") %>' />
            </ItemTemplate>
        </asp:TemplateField>
        <asp:TemplateField SortExpression="Account" HeaderText="<%$ resources: grdNewReturns.AccountName.ColumnHeading %>">
            <ItemTemplate>
                <SalesLogix:PageLink ID="lnkModifiedAccount" runat="server" Target="_top" LinkType="EntityAlias" Text='<%# Eval("Account.AccountName") %>'
                    NavigateUrl="Account" EntityId='<%# Eval("Account.Id") %>' />
            </ItemTemplate>
        </asp:TemplateField>
        <asp:TemplateField HeaderText="<%$ resources: grdNewReturns.CityStateZip.ColumnHeading %>" SortExpression="CityStatePostal">
            <ItemTemplate>
                <asp:Label id="lblModifiedAddress" Runat="Server" Text='<%# Eval("ReturnShippedAddress.FullAddress") %>' />
            </ItemTemplate>
        </asp:TemplateField>
        <asp:TemplateField HeaderText="<%$ resources: grdNewReturns.ModifyDate.ColumnHeading %>" HeaderStyle-Width="100px" SortExpression="ModifyDate">
            <ItemTemplate>
                <SalesLogix:DateTimePicker id="dteModifiedDate" Runat="Server" DisplayMode="AsText" DisplayTime="False" DateTimeValue=<%# Eval("ModifyDate") %> />
            </ItemTemplate>
        </asp:TemplateField>
        <asp:TemplateField HeaderText="<%$ resources: grdNewReturns.ModifyUser.ColumnHeading %>" SortExpression="ModifyUser" >
            <itemtemplate>
                <SalesLogix:SlxUserControl runat="server" ID="usrModifiedUser" DisplayMode="AsText" LookupResultValue='<%# Eval("ModifyUser") %>' />
            </itemtemplate>
        </asp:TemplateField>
    </Columns>
	<PagerStyle CssClass="gridPager" />
    <PagerSettings Mode="NumericFirstLast" FirstPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Start_16x16" LastPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=End_16x16" />
</SalesLogix:SlxGridView>