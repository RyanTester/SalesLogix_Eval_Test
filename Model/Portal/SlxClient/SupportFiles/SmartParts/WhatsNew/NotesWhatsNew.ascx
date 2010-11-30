<%@ Control Language="C#" AutoEventWireup="true" CodeFile="NotesWhatsNew.ascx.cs" Inherits="SmartParts_NotWhatsNew_NotWhatsNew" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls"
    TagPrefix="SalesLogix" %>
<%@ Register Assembly="System.Web.Extensions, Version=3.5.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35"
    Namespace="System.Web.UI" TagPrefix="asp" %>

<asp:ObjectDataSource
    ID="NotesNewObjectDataSource" 
    runat="server"
    TypeName="Sage.SalesLogix.LegacyBridge.WhatsNewRequest`1[[Sage.Entity.Interfaces.IHistory, Sage.Entity.Interfaces]]"
    DataObjectTypeName="Sage.Entity.Interfaces.IHistory"
    onobjectcreating="CreateNotesWhatsNewDataSource"
    onobjectdisposing="DisposeNotesWhatsNewDataSource"
    EnablePaging="true"
    StartRowIndexParameterName="StartRecord"
    MaximumRowsParameterName="MaxRecords" 
    SelectMethod="GetData"
    SelectCountMethod="GetRecordCount"
    SortParameterName="sortExpression"
     >
</asp:ObjectDataSource>

<asp:ObjectDataSource
    ID="NotesModifiedObjectDataSource" 
    runat="server"
    TypeName="Sage.SalesLogix.LegacyBridge.WhatsNewRequest`1[[Sage.Entity.Interfaces.IHistory, Sage.Entity.Interfaces]]"
    DataObjectTypeName="Sage.Entity.Interfaces.IHistory"
    onobjectcreating="CreateNotesWhatsModifiedDataSource"
    onobjectdisposing="DisposeNotesWhatsNewDataSource"
    EnablePaging="true"
    StartRowIndexParameterName="StartRecord"
    MaximumRowsParameterName="MaxRecords" 
    SelectMethod="GetData"
    SelectCountMethod="GetRecordCount"
    SortParameterName="sortExpression"
     >
</asp:ObjectDataSource>

<SalesLogix:SlxGridView Caption="<%$ resources: NewNotes_Caption %>" ID="grdNewNotes" CssClass="datagrid" EnableViewState="false"
    AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt" GridLines="none" runat="server" AutoGenerateColumns="False" DataKeyNames="Id"
    CellPadding="4" ShowEmptyTable="True" AllowPaging="true" AllowSorting="true" PageSize="10" EmptyTableRowText="<%$ resources: EmptyRow_lz %>" 
    OnPageIndexChanging="grdNewNotes_PageIndexChanging" OnSorting="Sorting" >
    <Columns>
        <asp:TemplateField HeaderText="<%$ resources: BaseType_lz %>" SortExpression="Type" >
            <ItemTemplate>
                <img id="imgNewType" runat="Server" src='<%# GetImage(Eval("Type")) %>' alt='<%# GetAlt(Eval("Type")) %>' onclick='<%# GetActivityLink(Eval("Id"))  %>' />
            </ItemTemplate>
        </asp:TemplateField>
        <asp:TemplateField HeaderText="<%$ resources: Type_lz %>" >
            <ItemTemplate>
                <asp:Label ID="lblNewType" Text='<%# GetEntityType(Eval("ContactId")) %>' runat="server"></asp:Label>
            </ItemTemplate>
        </asp:TemplateField>
        <asp:TemplateField SortExpression="Name" HeaderText="<%$ resources: Name_lz %>">
            <ItemTemplate>
                <SalesLogix:PageLink ID="lnkName" runat="server" LinkType="EntityAlias" Text='<%# GetDisplayName(Eval("ContactName"), Eval("LeadName")) %>'
                    NavigateUrl='<%# GetEntityType(Eval("ContactId")) %>' EntityId='<%# GetEntityId(Eval("ContactId"), Eval("LeadId")) %>' />
            </ItemTemplate>
        </asp:TemplateField>
        <asp:TemplateField HeaderText="<%$ resources: Account_Company %>" SortExpression="AccountName">
            <ItemTemplate>
                <SalesLogix:PageLink ID="Link3" runat="server" Target="_top" LinkType="EntityAlias" Text='<%# Eval("AccountName") %>'
                    NavigateUrl='<%# GetEntityType(Eval("ContactId")) %>' EntityId='<%# GetEntityId(Eval("ContactId"), Eval("LeadId")) %>' />
            </ItemTemplate>
        </asp:TemplateField>
        <asp:TemplateField HeaderText="<%$ resources: Regarding_lz %>" SortExpression="Description">
            <ItemTemplate><%# Eval("Description") %></ItemTemplate>
        </asp:TemplateField>
        <asp:TemplateField HeaderText="<%$ resources: Completed_lz %>" HeaderStyle-Width="100px" SortExpression="CompletedDate">
            <ItemTemplate>
                <SalesLogix:DateTimePicker Timeless="true" DisplayTime='<%# Eval("TimeLess") %>' id="cmpdate" Runat="Server" DisplayMode="AsText" DateTimeValue=<%# Eval("CompletedDate") %> />
            </ItemTemplate>
        </asp:TemplateField>
        <asp:TemplateField HeaderText="<%$ resources: CreateDate_lz %>" HeaderStyle-Width="100px" SortExpression="CreateDate">
            <ItemTemplate>
                <SalesLogix:DateTimePicker id="crdate" Runat="Server" DisplayMode="AsText" DateTimeValue=<%# Eval("CreateDate") %> />
            </ItemTemplate>
        </asp:TemplateField>
    </Columns>
	<PagerStyle CssClass="gridPager" />
    <PagerSettings Mode="NumericFirstLast" FirstPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Start_16x16" LastPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=End_16x16" />
</SalesLogix:SlxGridView>
<br/>

<SalesLogix:SlxGridView Caption="<%$ resources: ModifiedNotes_Caption %>" ID="grdModifiedNotes" CssClass="datagrid" EnableViewState="false"
    AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt" GridLines="none" runat="server" AutoGenerateColumns="False" DataKeyNames="Id"
    CellPadding="4" ShowEmptyTable="True" AllowPaging="true" AllowSorting="true" PageSize="10" EmptyTableRowText="<%$ resources: EmptyRow_lz %>" 
    OnPageIndexChanging="grdModifiedNotes_PageIndexChanging" OnSorting="Sorting" >
    <Columns>
        <asp:TemplateField HeaderText="<%$ resources: BaseType_lz %>" SortExpression="Type" >
            <ItemTemplate>
                <img id="imgNewType" runat="Server" src='<%# GetImage(Eval("Type")) %>' alt='<%# GetAlt(Eval("Type")) %>' onclick='<%# GetActivityLink(Eval("Id"))  %>' />
            </ItemTemplate>
        </asp:TemplateField>
        <asp:TemplateField HeaderText="<%$ resources: Type_lz %>" >
            <ItemTemplate>
                <asp:Label ID="lblNewType" Text='<%# GetEntityType(Eval("ContactId")) %>' runat="server"></asp:Label>
            </ItemTemplate>
        </asp:TemplateField>
        <asp:TemplateField SortExpression="Name" HeaderText="<%$ resources: Name_lz %>">
            <ItemTemplate>
                <SalesLogix:PageLink ID="lnkName" runat="server" LinkType="EntityAlias" Text='<%# GetDisplayName(Eval("ContactName"), Eval("LeadName")) %>'
                    Target="_top" NavigateUrl='<%# GetEntityType(Eval("ContactId")) %>' EntityId='<%# GetEntityId(Eval("ContactId"), Eval("LeadId")) %>' />
            </ItemTemplate>
        </asp:TemplateField>
        <asp:TemplateField HeaderText="<%$ resources: Account_Company %>" SortExpression="AccountName">
            <ItemTemplate>
                <SalesLogix:PageLink ID="Link3" runat="server" Target="_top" LinkType="EntityAlias" Text='<%# Eval("AccountName") %>'
                    NavigateUrl='<%# GetEntityType(Eval("ContactId")) %>' EntityId='<%# GetEntityId(Eval("ContactId"), Eval("LeadId")) %>' />
            </ItemTemplate>
        </asp:TemplateField>
        <asp:TemplateField HeaderText="<%$ resources: Regarding_lz %>" SortExpression="Description">
            <ItemTemplate><%# Eval("Description") %></ItemTemplate>
        </asp:TemplateField>
        <asp:TemplateField HeaderText="<%$ resources: Completed_lz %>" HeaderStyle-Width="100px" SortExpression="CompletedDate">
            <ItemTemplate>
                <SalesLogix:DateTimePicker Timeless="true" DisplayTime='<%# Eval("TimeLess") %>' id="cmpdate" Runat="Server" DisplayMode="AsText" DateTimeValue=<%# Eval("CompletedDate") %> />
            </ItemTemplate>
        </asp:TemplateField>
        <asp:TemplateField HeaderText="<%$ resources: ModifyDate_lz %>" HeaderStyle-Width="100px" SortExpression="ModifyDate">
            <ItemTemplate>
                <SalesLogix:DateTimePicker id="moddate" Runat="Server" DisplayMode="AsText" DateTimeValue=<%# Eval("ModifyDate") %> />
            </ItemTemplate>
        </asp:TemplateField>
    </Columns>
	<PagerStyle CssClass="gridPager" />
    <PagerSettings Mode="NumericFirstLast" FirstPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Start_16x16" LastPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=End_16x16" />
</SalesLogix:SlxGridView>