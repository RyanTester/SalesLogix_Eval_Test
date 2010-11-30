<%@ Control Language="C#" AutoEventWireup="true" CodeFile="ContactsWhatsNew.ascx.cs" Inherits="SmartParts_ConWhatsNew_ConWhatsNew" %>
<%@ Register Assembly="Sage.SalesLogix.Web" Namespace="Sage.SalesLogix.Web" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls"
    TagPrefix="SalesLogix" %>
<%@ Register Assembly="System.Web.Extensions, Version=3.5.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35"
    Namespace="System.Web.UI" TagPrefix="asp" %>

<asp:ObjectDataSource
    ID="ContactsNewObjectDataSource" 
    runat="server"
    TypeName="Sage.SalesLogix.LegacyBridge.WhatsNewRequest`1[[Sage.Entity.Interfaces.IContact, Sage.Entity.Interfaces]]"
    DataObjectTypeName="Sage.Entity.Interfaces.IContact"
    onobjectcreating="CreateContactsWhatsNewDataSource"
    onobjectdisposing="DisposeContactsWhatsNewDataSource"
    EnablePaging="true"
    StartRowIndexParameterName="StartRecord"
    MaximumRowsParameterName="MaxRecords" 
    SelectMethod="GetData"
    SelectCountMethod="GetRecordCount"
    SortParameterName="sortExpression"
     >
</asp:ObjectDataSource>

<asp:ObjectDataSource
    ID="ContactsModifiedObjectDataSource" 
    runat="server"
    TypeName="Sage.SalesLogix.LegacyBridge.WhatsNewRequest`1[[Sage.Entity.Interfaces.IContact, Sage.Entity.Interfaces]]"
    DataObjectTypeName="Sage.Entity.Interfaces.IContact"
    onobjectcreating="CreateContactsWhatsModifiedDataSource"
    onobjectdisposing="DisposeContactsWhatsNewDataSource"
    EnablePaging="true"
    StartRowIndexParameterName="StartRecord"
    MaximumRowsParameterName="MaxRecords" 
    SelectMethod="GetData"
    SelectCountMethod="GetRecordCount"
    SortParameterName="sortExpression"
     >
</asp:ObjectDataSource>

<SalesLogix:SlxGridView Caption="<%$ resources : NewContacts_Caption %>" ID="grdNewContacts" CssClass="datagrid" EnableViewState="false"
    AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt" GridLines="none" runat="server" AutoGenerateColumns="False"
    DataKeyNames="Id" CellPadding="4" ShowEmptyTable="True" AllowPaging="true" AllowSorting="true" PageSize="10" OnSorting="Sorting"
    EmptyTableRowText="<%$ resources: EmptyRow_lz %>" OnPageIndexChanging="grdNewContacts_PageIndexChanging" >
    <Columns>
        <asp:TemplateField SortExpression="NameLF" HeaderText="<%$ resources: Contact_lz %>">
            <ItemTemplate>
                <SalesLogix:PageLink ID="Link1" runat="server" Target="_top" LinkType="EntityAlias" Text='<%# Eval("LastName") + ", " + Eval("FirstName") %>'
                    NavigateUrl="contact" EntityId='<%# Eval("Id") %>' />
            </ItemTemplate>
        </asp:TemplateField>
        
        <asp:TemplateField SortExpression="AccountName" HeaderText="<%$ resources: Account_lz %>">
            <ItemTemplate>
                <SalesLogix:PageLink ID="Link2" runat="server" Target="_top" LinkType="EntityAlias" Text='<%# Eval("Account.AccountName") %>'
                    NavigateUrl="account" EntityId='<%# Eval("Account.Id") %>' />
            </ItemTemplate>
        </asp:TemplateField>
        
        <asp:TemplateField HeaderText="<%$ resources: Address_lz %>" SortExpression="CityStatePostal">
            <ItemTemplate>
                <asp:Label id="addr" Runat="Server" Text='<%# Eval("Address.CityStatePostal") %>' />
            </ItemTemplate>
        </asp:TemplateField>

        <asp:TemplateField HeaderText="<%$ resources: CreateDate_lz %>" HeaderStyle-Width="100px" SortExpression="CreateDate">
            <ItemTemplate>
                <SalesLogix:DateTimePicker id="crdate" Runat="Server" DisplayMode="AsText" DisplayTime="False" DateTimeValue=<%# Eval("CreateDate") %> />
            </ItemTemplate>
        </asp:TemplateField>

        <asp:TemplateField HeaderText="<%$ resources: User_lz %>" SortExpression="CreateUser" >
            <itemtemplate>
                <SalesLogix:SlxUserControl runat="server" ID="u1" DisplayMode="AsText" LookupResultValue='<%# Eval("CreateUser") %>' />
            </itemtemplate>
        </asp:TemplateField>
    </Columns>
	<PagerStyle CssClass="gridPager" />
    <PagerSettings Mode="NumericFirstLast" FirstPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Start_16x16" LastPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=End_16x16" />
</SalesLogix:SlxGridView>
<br/>

<SalesLogix:SlxGridView Caption="<%$ resources : ModifiedContacts_Caption %>" ID="grdModifiedContacts" CssClass="datagrid" EnableViewState="false"
    AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt" GridLines="none" runat="server" AutoGenerateColumns="False"
    DataKeyNames="Id" CellPadding="4" ShowEmptyTable="True" AllowPaging="true" AllowSorting="true" PageSize="10" OnSorting="Sorting"
    EmptyTableRowText="<%$ resources: EmptyRow_lz %>" OnPageIndexChanging="grdModifiedContacts_PageIndexChanging" >
    <Columns>
        <asp:TemplateField SortExpression="NameLF" HeaderText="<%$ resources: Contact_lz %>">
            <ItemTemplate>
                <SalesLogix:PageLink ID="Link3" runat="server" Target="_top" LinkType="EntityAlias" Text='<%# Eval("LastName") + ", " + Eval("FirstName") %>'
                    NavigateUrl="contact" EntityId='<%# Eval("Id") %>' />
            </ItemTemplate>
        </asp:TemplateField>
        
        <asp:TemplateField SortExpression="AccountName" HeaderText="<%$ resources: Account_lz %>">
            <ItemTemplate>
                <SalesLogix:PageLink ID="Link4" runat="server" Target="_top" LinkType="EntityAlias" Text='<%# Eval("Account.AccountName") %>'
                    NavigateUrl="account" EntityId='<%# Eval("Account.Id") %>' />
            </ItemTemplate>
        </asp:TemplateField>
        
        <asp:TemplateField HeaderText="<%$ resources: Address_lz %>" SortExpression="CityStatePostal">
            <ItemTemplate>
                <asp:Label id="addr2" Runat="Server" Text='<%# Eval("Address.CityStatePostal") %>' />
            </ItemTemplate>
        </asp:TemplateField>

        <asp:TemplateField HeaderText="<%$ resources: ModifyDate_lz %>" HeaderStyle-Width="100px" SortExpression="ModifyDate">
            <ItemTemplate>
                <SalesLogix:DateTimePicker id="moddate" Runat="Server" DisplayMode="AsText" DisplayTime="False" DateTimeValue=<%# Eval("ModifyDate") %> />
            </ItemTemplate>
        </asp:TemplateField>

        <asp:TemplateField HeaderText="<%$ resources: User_lz %>" SortExpression="ModifyUser" >
            <itemtemplate>
                <SalesLogix:SlxUserControl runat="server" ID="u2" DisplayMode="AsText" LookupResultValue='<%# Eval("ModifyUser") %>' />
            </itemtemplate>
        </asp:TemplateField>
    </Columns>
	<PagerStyle CssClass="gridPager" />
    <PagerSettings Mode="NumericFirstLast" FirstPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Start_16x16" LastPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=End_16x16" />
</SalesLogix:SlxGridView>

