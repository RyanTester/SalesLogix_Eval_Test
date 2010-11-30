<%@ Control Language="C#" AutoEventWireup="true" CodeFile="ActivitiesWhatsNew.ascx.cs" Inherits="SmartParts_ActWhatsNew_ActWhatsNew" %>
<%@ Register Assembly="Sage.SalesLogix.Web" Namespace="Sage.SalesLogix.Web" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls"
    TagPrefix="SalesLogix" %>
<%@ Register Assembly="System.Web.Extensions, Version=3.5.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35"
    Namespace="System.Web.UI" TagPrefix="asp" %>

<asp:HiddenField runat="server" ID="hActId" />
<asp:HiddenField runat="server" ID="hOccurrenceDate" />
<div style="display: none"><asp:Button runat="server" ID="hEditAct" OnClick="hEditAct_Click" /></div>

<asp:ObjectDataSource
    ID="ActivitiesNewObjectDataSource" 
    runat="server" 
    TypeName="Sage.SalesLogix.Activity.ActivitiesWhatsNewDataSource, Sage.SalesLogix.Activity"
    DataObjectTypeName="Sage.Entity.Interfaces.IActivity"
    onobjectcreating="CreateActivitiesWhatsNewDataSource"
    onobjectdisposing="DisposeActivitiesWhatsNewDataSource"
    EnablePaging="true"
    StartRowIndexParameterName="StartRecord"
    MaximumRowsParameterName="MaxRecords" 
    SelectMethod="GetData"
    SelectCountMethod="GetRecordCount" >
</asp:ObjectDataSource>

<asp:ObjectDataSource
    ID="ActivitiesModifiedObjectDataSource" 
    runat="server" 
    TypeName="Sage.SalesLogix.Activity.ActivitiesWhatsNewDataSource, Sage.SalesLogix.Activity"
    DataObjectTypeName="Sage.Entity.Interfaces.IActivity"
    onobjectcreating="CreateActivitiesWhatsModifiedDataSource"
    onobjectdisposing="DisposeActivitiesWhatsNewDataSource"
    EnablePaging="true"
    StartRowIndexParameterName="StartRecord"
    MaximumRowsParameterName="MaxRecords" 
    SelectMethod="GetData"
    SelectCountMethod="GetRecordCount" >
</asp:ObjectDataSource>

<SalesLogix:SlxGridView Caption="<%$ resources : NewActivities_Caption %>" ID="grdNewActivities" CssClass="datagrid" OnSorting="Sorting"
    AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt" GridLines="none" runat="server" AutoGenerateColumns="False"
    DataKeyNames="Id" CellPadding="4" ShowEmptyTable="True" AllowPaging="true" AllowSorting="true" PageSize="10" EnableViewState="false"
    EmptyTableRowText="<%$ resources: EmptyRow_lz %>" OnPageIndexChanging="grdNewActivities_PageIndexChanging" >
    <Columns>
        <asp:TemplateField HeaderText="<%$ resources: ActivityType_lz %>" SortExpression="Type" >
            <ItemTemplate>
                <img id="imgNewType" runat="Server" src='<%# GetImage(Eval("Type")) %>' alt='<%# GetAlt(Eval("Type")) %>' onclick='<%# GetActivityLink(Eval("Id"))  %>' />
            </ItemTemplate>
        </asp:TemplateField>
        <asp:TemplateField HeaderText="<%$ resources: Type_lz %>" >
            <ItemTemplate>
                <asp:Label ID="lblNewType" Text='<%# GetEntityType(Eval("ContactId")) %>' runat="server"></asp:Label>
            </ItemTemplate>
        </asp:TemplateField>
        <asp:TemplateField HeaderText="<%$ resources: Name_lz %>" >
            <ItemTemplate>
                <SalesLogix:PageLink ID="lnkName" runat="server" LinkType="EntityAlias" Text='<%# GetDisplayName(Eval("ContactName"), Eval("LeadName")) %>'
                    Target="_top" NavigateUrl='<%# GetEntityType(Eval("ContactId")) %>' EntityId='<%# GetEntityId(Eval("ContactId"), Eval("LeadId")) %>' />
            </ItemTemplate>
        </asp:TemplateField>
        <asp:TemplateField HeaderText="<%$ resources: Regarding_lz %>" SortExpression="Description">
            <ItemTemplate><%# Eval("Description") %></ItemTemplate>
        </asp:TemplateField>
        <asp:TemplateField HeaderText="<%$ resources: ScheduledFor_lz %>" SortExpression="StartDate">
            <ItemTemplate>
                <SalesLogix:DateTimePicker id="dteStartDate" Runat="Server" DisplayMode="AsText" DisplayTime="False" DateTimeValue=<%# Eval("StartDate") %> />
            </ItemTemplate>
        </asp:TemplateField>
        <asp:TemplateField HeaderText="<%$ resources: Added_lz %>" SortExpression="CreateDate">
            <ItemTemplate>
                <SalesLogix:DateTimePicker id="dteCreateDate" Runat="Server" DisplayMode="AsText" DisplayTime="False" DateTimeValue=<%# Eval("CreateDate") %> />
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
<div class="mainContentHeader">
    <asp:Label runat="server" ID="lblModAcct" Text= />
</div>
<SalesLogix:SlxGridView Caption="<%$ resources : ModifiedActivities_Caption %>" ID="grdModifiedActivities" CssClass="datagrid"
    AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt" GridLines="none" runat="server" AutoGenerateColumns="False"
    DataKeyNames="Id" CellPadding="4" ShowEmptyTable="True" AllowPaging="true" AllowSorting="true" PageSize="10" OnSorting="Sorting"
    EmptyTableRowText="<%$ resources: EmptyRow_lz %>" OnPageIndexChanging="grdModifiedActivities_PageIndexChanging" EnableViewState="false" >
    <Columns>
        <asp:TemplateField HeaderText="<%$ resources: ActivityType_lz %>" SortExpression="Type" >
            <ItemTemplate>
                <img id="imgModType" runat="Server" src='<%# GetImage(Eval("Type")) %>' alt='<%# GetAlt(Eval("Type")) %>' onclick='<%# GetActivityLink(Eval("Id"))  %>' />
            </ItemTemplate>
        </asp:TemplateField>
        <asp:TemplateField HeaderText="<%$ resources: Type_lz %>" >
            <ItemTemplate>
                <asp:Label ID="lblModType" Text='<%# GetEntityType(Eval("ContactId")) %>' runat="server"></asp:Label>
            </ItemTemplate>
        </asp:TemplateField>
        <asp:TemplateField HeaderText="<%$ resources: Name_lz %>" >
            <ItemTemplate>
            <SalesLogix:PageLink ID="lnkName" runat="server" LinkType="EntityAlias" Text='<%# GetDisplayName(Eval("ContactName"), Eval("LeadName")) %>'
                Target="_top" NavigateUrl='<%# GetEntityType(Eval("ContactId")) %>' EntityId='<%# GetEntityId(Eval("ContactId"), Eval("LeadId")) %>' />
            </ItemTemplate>
        </asp:TemplateField>
        <asp:TemplateField HeaderText="<%$ resources: Regarding_lz %>" SortExpression="Description">
            <ItemTemplate><%# Eval("Description")%></ItemTemplate>
        </asp:TemplateField>
        <asp:TemplateField HeaderText="<%$ resources: ScheduledFor_lz %>" SortExpression="StartDate">
            <ItemTemplate>
                <SalesLogix:DateTimePicker id="dteModStartDate" Runat="Server" DisplayMode="AsText" DisplayTime="False" DateTimeValue=<%# Eval("StartDate") %> />
            </ItemTemplate>
        </asp:TemplateField>
        <asp:TemplateField HeaderText="<%$ resources: Modified %>" SortExpression="ModifyDate">
            <ItemTemplate>
                <SalesLogix:DateTimePicker id="dteModifiedDate" Runat="Server" DisplayMode="AsText" DisplayTime="False" DateTimeValue=<%# Eval("ModifyDate") %> />
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
