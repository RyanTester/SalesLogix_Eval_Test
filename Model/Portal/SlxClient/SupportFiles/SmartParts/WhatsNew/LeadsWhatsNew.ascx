<%@ Control Language="C#" AutoEventWireup="true" CodeFile="LeadsWhatsNew.ascx.cs" Inherits="LeadsWhatsNew" %>
<%@ Register Assembly="Sage.SalesLogix.Web" Namespace="Sage.SalesLogix.Web" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="System.Web.Extensions, Version=3.5.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" Namespace="System.Web.UI" TagPrefix="asp" %>

<asp:ObjectDataSource
    ID="LeadsNewObjectDataSource" 
    runat="server"
    TypeName="Sage.SalesLogix.LegacyBridge.WhatsNewRequest`1[[Sage.Entity.Interfaces.ILead, Sage.Entity.Interfaces]]"
    DataObjectTypeName="Sage.Entity.Interfaces.ILead"
    onobjectcreating="CreateLeadsWhatsNewDataSource"
    onobjectdisposing="DisposeLeadsWhatsNewDataSource"
    EnablePaging="true"
    StartRowIndexParameterName="StartRecord"
    MaximumRowsParameterName="MaxRecords" 
    SelectMethod="GetData"
    SelectCountMethod="GetRecordCount"
    SortParameterName="sortExpression"
     >
</asp:ObjectDataSource>

<asp:ObjectDataSource
    ID="LeadsModifiedObjectDataSource" 
    runat="server"
    TypeName="Sage.SalesLogix.LegacyBridge.WhatsNewRequest`1[[Sage.Entity.Interfaces.ILead, Sage.Entity.Interfaces]]"
    DataObjectTypeName="Sage.Entity.Interfaces.ILead"
    onobjectcreating="CreateLeadsWhatsModifiedDataSource"
    onobjectdisposing="DisposeLeadsWhatsNewDataSource"
    EnablePaging="true"
    StartRowIndexParameterName="StartRecord"
    MaximumRowsParameterName="MaxRecords" 
    SelectMethod="GetData"
    SelectCountMethod="GetRecordCount"
    SortParameterName="sortExpression"
     >
</asp:ObjectDataSource>

<SalesLogix:SlxGridView Caption="<%$ resources : NewLeads_Caption %>" ID="grdNewLeads" CssClass="datagrid" DataKeyNames="Id" PageSize="10"
    AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt" GridLines="none" runat="server" AutoGenerateColumns="False" 
    CellPadding="4" ShowEmptyTable="True" EnableViewState="false" AllowPaging="true" AllowSorting="true" OnSorting="Sorting"
    OnPageIndexChanging="grdNewLeads_PageIndexChanging" EmptyTableRowText="<%$ resources: EmptyTableRowText %>" >
    <Columns>
        <asp:TemplateField SortExpression="LastName" HeaderText="<%$ resources: WNGVLeads1.Lead.ColumnHeading %>">
            <ItemTemplate>
                <SalesLogix:PageLink ID="Link1" runat="server" Target="_top" LinkType="EntityAlias" Text='<%# Eval("LastName") + ", " + Eval("FirstName") %>'
                    NavigateUrl="lead" EntityId='<%# Eval("Id") %>' />
            </ItemTemplate>
        </asp:TemplateField>
        
        <asp:TemplateField SortExpression="Company" HeaderText="<%$ resources: WNGVLeads1.Company.ColumnHeading %>">
            <ItemTemplate>
                <asp:Label id="company" Runat="Server" Text='<%# Eval("Company") %>' />
            </ItemTemplate>
        </asp:TemplateField>
        
        <asp:TemplateField HeaderText="<%$ resources: WNGVLeads1.Address.ColumnHeading %>" SortExpression="CityStatePostal">
            <ItemTemplate>
                <asp:Label id="addr" Runat="Server" Text='<%# Eval("Address.LeadCtyStZip") %>' />
            </ItemTemplate>
        </asp:TemplateField>

        <asp:TemplateField HeaderText="<%$ resources: WNGVLeads1.CreateDate.ColumnHeading %>" HeaderStyle-Width="100px" SortExpression="CreateDate">
            <ItemTemplate>
                <SalesLogix:DateTimePicker id="crdate" Runat="Server" DisplayMode="AsText" DisplayTime="False" DateTimeValue=<%# Eval("CreateDate") %> />
            </ItemTemplate>
        </asp:TemplateField>

        <asp:TemplateField HeaderText="<%$ resources: WNGVLeads1.User.ColumnHeading %>" SortExpression="CreateUser" >
            <itemtemplate>
                <SalesLogix:SlxUserControl runat="server" ID="u1" DisplayMode="AsText" LookupResultValue='<%# Eval("CreateUser") %>' />
            </itemtemplate>
        </asp:TemplateField>
    </Columns>
	<PagerStyle CssClass="gridPager" />
    <PagerSettings Mode="NumericFirstLast" FirstPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Start_16x16" LastPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=End_16x16" />
</SalesLogix:SlxGridView>
<br/>

<SalesLogix:SlxGridView Caption="<%$ resources : ModifiedLeads_Caption %>" ID="grdModifiedLeads" CssClass="datagrid" OnSorting="Sorting"
    AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt" GridLines="none" runat="server" AutoGenerateColumns="False" DataKeyNames="Id"
    CellPadding="4" ShowEmptyTable="True" EnableViewState="false" AllowPaging="true" AllowSorting="true" PageSize="10"
    OnPageIndexChanging="grdModifiedLeads_PageIndexChanging" EmptyTableRowText="<%$ resources: EmptyTableRowText %>" >
    <Columns>
        <asp:TemplateField SortExpression="LastName" HeaderText="<%$ resources: WNGVLeads1.Lead.ColumnHeading %>">
            <ItemTemplate>
                <SalesLogix:PageLink ID="Link3" runat="server" Target="_top" LinkType="EntityAlias" Text='<%# Eval("LastName") + ", " + Eval("FirstName") %>'
                    NavigateUrl="lead" EntityId='<%# Eval("Id") %>' />
            </ItemTemplate>
        </asp:TemplateField>
        
        <asp:TemplateField SortExpression="Company" HeaderText="<%$ resources: WNGVLeads1.Company.ColumnHeading %>">
            <ItemTemplate>
                <asp:Label id="company2" Runat="Server" Text='<%# Eval("Company") %>' />
            </ItemTemplate>
        </asp:TemplateField>
        
        <asp:TemplateField HeaderText="<%$ resources: WNGVLeads1.Address.ColumnHeading %>" SortExpression="CityStatePostal">
            <ItemTemplate>
                <asp:Label id="addr2" Runat="Server" Text='<%# Eval("Address.LeadCtyStZip") %>' />
            </ItemTemplate>
        </asp:TemplateField>

        <asp:TemplateField HeaderText="<%$ resources: WNGVLeads2.ModifyDate.ColumnHeading %>" HeaderStyle-Width="100px" SortExpression="ModifyDate">
            <ItemTemplate>
                <SalesLogix:DateTimePicker id="moddate" Runat="Server" DisplayMode="AsText" DisplayTime="False" DateTimeValue=<%# Eval("ModifyDate") %> />
            </ItemTemplate>
        </asp:TemplateField>

        <asp:TemplateField HeaderText="<%$ resources: WNGVLeads1.User.ColumnHeading %>" SortExpression="ModifyUser" >
            <itemtemplate>
                <SalesLogix:SlxUserControl runat="server" ID="u2" DisplayMode="AsText" LookupResultValue='<%# Eval("ModifyUser") %>' />
            </itemtemplate>
        </asp:TemplateField>
    </Columns>
	<PagerStyle CssClass="gridPager" />
    <PagerSettings Mode="NumericFirstLast" FirstPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Start_16x16" LastPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=End_16x16" />
</SalesLogix:SlxGridView>