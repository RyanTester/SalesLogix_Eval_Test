<%@ Control Language="C#" AutoEventWireup="true" CodeFile="OpportunitiesWhatsNew.ascx.cs" Inherits="SmartParts_OppWhatsNew_OppWhatsNew" %>
<%@ Register Assembly="Sage.SalesLogix.Web" Namespace="Sage.SalesLogix.Web" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls"
    TagPrefix="SalesLogix" %>
<%@ Register Assembly="System.Web.Extensions, Version=3.5.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35"
    Namespace="System.Web.UI" TagPrefix="asp" %>

<asp:ObjectDataSource
    ID="OpportunitiesNewObjectDataSource" 
    runat="server"
    TypeName="Sage.SalesLogix.LegacyBridge.WhatsNewRequest`1[[Sage.Entity.Interfaces.IOpportunity, Sage.Entity.Interfaces]]"
    DataObjectTypeName="Sage.Entity.Interfaces.IOpportunity"
    onobjectcreating="CreateOpportunitiesWhatsNewDataSource"
    onobjectdisposing="DisposeOpportunitiesWhatsNewDataSource"
    EnablePaging="true"
    StartRowIndexParameterName="StartRecord"
    MaximumRowsParameterName="MaxRecords" 
    SelectMethod="GetData"
    SelectCountMethod="GetRecordCount"
    SortParameterName="sortExpression"
     >
</asp:ObjectDataSource>

<asp:ObjectDataSource
    ID="OpportunitiesModifiedObjectDataSource" 
    runat="server"
    TypeName="Sage.SalesLogix.LegacyBridge.WhatsNewRequest`1[[Sage.Entity.Interfaces.IOpportunity, Sage.Entity.Interfaces]]"
    DataObjectTypeName="Sage.Entity.Interfaces.IOpportunity"
    onobjectcreating="CreateOpportunitiesWhatsModifiedDataSource"
    onobjectdisposing="DisposeOpportunitiesWhatsNewDataSource"
    EnablePaging="true"
    StartRowIndexParameterName="StartRecord"
    MaximumRowsParameterName="MaxRecords" 
    SelectMethod="GetData"
    SelectCountMethod="GetRecordCount"
    SortParameterName="sortExpression"
     >
</asp:ObjectDataSource>

<SalesLogix:SlxGridView Caption="<%$ resources : NewOpportunities_Caption %>" ID="grdNewOpportunities" CssClass="datagrid" EnableViewState="false"
    AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt" GridLines="none" runat="server" AutoGenerateColumns="False"
    DataKeyNames="ID" CellPadding="4" ShowEmptyTable="True" AllowPaging="true" AllowSorting="true" PageSize="10" OnSorting="Sorting"
    EmptyTableRowText="<%$ resources: EmptyRow_lz %>" OnPageIndexChanging="grdNewOpportunities_PageIndexChanging" >
    <Columns>
        <asp:TemplateField SortExpression="Description" HeaderText="<%$ resources: OppName_lz %>">
            <ItemTemplate>
                <SalesLogix:PageLink ID="Link1" runat="server" Target="_top" LinkType="EntityAlias" Text='<%# Eval("Description") %>'
                    NavigateUrl="opportunity" EntityId='<%# DataBinder.Eval(Container.DataItem, "Id") %>' />
            </ItemTemplate>
        </asp:TemplateField>

        <asp:TemplateField SortExpression="Account" HeaderText="<%$ resources: Account_lz %>">
            <ItemTemplate>
                <SalesLogix:PageLink ID="Link2" runat="server" Target="_top" LinkType="EntityAlias" Text='<%# Eval("Account.AccountName") %>'
                    NavigateUrl="account" EntityId='<%# DataBinder.Eval(Container.DataItem, "Account.Id") %>' />
            </ItemTemplate>
        </asp:TemplateField>

        <asp:TemplateField HeaderText="<%$ resources: EstimatedClose_lz %>" SortExpression="EstimatedClose">
            <ItemTemplate>
                <SalesLogix:DateTimePicker id="closdate" Runat="Server" DisplayMode="AsText" DisplayTime="False" DateTimeValue=<%# Eval("EstimatedClose") %> />
            </ItemTemplate>
        </asp:TemplateField>

        <asp:BoundField DataField="SalesPotential" HeaderText="<%$ resources: Potential_lz %>" SortExpression="SalesPotential" DataFormatString="{0:C}" HtmlEncode="false" itemstyle-horizontalalign="Right" />

        <asp:TemplateField HeaderText="<%$ resources: Owner_lz %>" SortExpression="O.OwnerDescription">
            <ItemTemplate>
                <asp:Label id="owner" Runat="Server" Text='<%# Eval("Owner.OwnerDescription") %>' />
            </ItemTemplate>
        </asp:TemplateField>

        <asp:TemplateField HeaderText="<%$ resources: CreateDate_lz %>" HeaderStyle-Width="100px" SortExpression="CreateDate">
            <ItemTemplate>
                <SalesLogix:DateTimePicker id="crdate" Runat="Server" DisplayMode="AsText" DisplayTime="False" DateTimeValue=<%# DataBinder.Eval(Container.DataItem, "CreateDate") %> />
            </ItemTemplate>
        </asp:TemplateField>
    </Columns>
	<PagerStyle CssClass="gridPager" />
    <PagerSettings Mode="NumericFirstLast" FirstPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Start_16x16" LastPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=End_16x16" />
</SalesLogix:SlxGridView>
<br/>

<SalesLogix:SlxGridView Caption="<%$ resources : ModifiedOpportunities_Caption %>" ID="grdModifiedOpportunities" CssClass="datagrid"
    AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt" GridLines="none" runat="server" AutoGenerateColumns="False" DataKeyNames="ID"
    CellPadding="4" ShowEmptyTable="True" AllowPaging="true" AllowSorting="true" PageSize="10" EmptyTableRowText="<%$ resources: EmptyRow_lz %>"
    OnPageIndexChanging="grdModifiedOpportunities_PageIndexChanging" OnSorting="Sorting" EnableViewState="false" >
    <Columns>
        <asp:TemplateField SortExpression="Description" HeaderText="<%$ resources: OppName_lz %>">
            <ItemTemplate>
                <SalesLogix:PageLink ID="Link3" runat="server" Target="_top" LinkType="EntityAlias" Text='<%# Eval("Description") %>'
                    NavigateUrl="opportunity" EntityId='<%# DataBinder.Eval(Container.DataItem, "Id") %>' />
            </ItemTemplate>
        </asp:TemplateField>

        <asp:TemplateField SortExpression="Account" HeaderText="<%$ resources: Account_lz %>">
            <ItemTemplate>
                <SalesLogix:PageLink ID="Link4" runat="server" Target="_top" LinkType="EntityAlias"  Text='<%# Eval("Account.AccountName") %>'
                    NavigateUrl="account" EntityId='<%# DataBinder.Eval(Container.DataItem, "Account.Id") %>' />
            </ItemTemplate>
        </asp:TemplateField>

        <asp:TemplateField HeaderText="<%$ resources: EstimatedClose_lz %>" SortExpression="EstimatedClose">
            <ItemTemplate>
                <SalesLogix:DateTimePicker id="closdate2" Runat="Server" DisplayMode="AsText" DisplayTime="False" DateTimeValue=<%# DataBinder.Eval(Container.DataItem, "EstimatedClose") %> />
            </ItemTemplate>
        </asp:TemplateField>

        <asp:BoundField DataField="SalesPotential" HeaderText="<%$ resources: Potential_lz %>" SortExpression="SalesPotential" DataFormatString="{0:C}" HtmlEncode="false" itemstyle-horizontalalign="Right" />

        <asp:TemplateField HeaderText="<%$ resources: Owner_lz %>" SortExpression="O.OwnerDescription">
            <ItemTemplate>
                <asp:Label id="owner2" Runat="Server" Text='<%# DataBinder.Eval(Container.DataItem, "Owner.OwnerDescription") %>' />
            </ItemTemplate>
        </asp:TemplateField>
        
        <asp:TemplateField HeaderText="<%$ resources: ModifyDate_lz %>" HeaderStyle-Width="100px" SortExpression="ModifyDate">
            <ItemTemplate>
                <SalesLogix:DateTimePicker id="moddate" Runat="Server" DisplayMode="AsText" DisplayTime="False" DateTimeValue=<%# DataBinder.Eval(Container.DataItem, "ModifyDate") %> />
            </ItemTemplate>
        </asp:TemplateField>
    </Columns>
	<PagerStyle CssClass="gridPager" />
    <PagerSettings Mode="NumericFirstLast" FirstPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Start_16x16" LastPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=End_16x16" />
</SalesLogix:SlxGridView>
