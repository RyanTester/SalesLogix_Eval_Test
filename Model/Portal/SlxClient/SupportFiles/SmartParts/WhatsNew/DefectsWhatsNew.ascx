<%@ Control Language="C#" AutoEventWireup="true" CodeFile="DefectsWhatsNew.ascx.cs" Inherits="DefectsWhatsNew" %>
<%@ Register Assembly="Sage.SalesLogix.Web" Namespace="Sage.SalesLogix.Web" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.PickList" TagPrefix="SalesLogix" %>
<%@ Register Assembly="System.Web.Extensions, Version=3.5.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" Namespace="System.Web.UI" TagPrefix="asp" %>

<asp:ObjectDataSource
    ID="DefectsNewObjectDataSource" 
    runat="server"
    TypeName="Sage.SalesLogix.LegacyBridge.WhatsNewRequest`1[[Sage.Entity.Interfaces.IDefect, Sage.Entity.Interfaces]]"
    DataObjectTypeName="Sage.Entity.Interfaces.IDefect"
    onobjectcreating="CreateDefectsWhatsNewDataSource"
    onobjectdisposing="DisposeDefectsWhatsNewDataSource"
    EnablePaging="true"
    StartRowIndexParameterName="StartRecord"
    MaximumRowsParameterName="MaxRecords" 
    SelectMethod="GetData"
    SelectCountMethod="GetRecordCount"
    SortParameterName="sortExpression"
     >
</asp:ObjectDataSource>

<asp:ObjectDataSource
    ID="DefectsModifiedObjectDataSource" 
    runat="server"
    TypeName="Sage.SalesLogix.LegacyBridge.WhatsNewRequest`1[[Sage.Entity.Interfaces.IDefect, Sage.Entity.Interfaces]]"
    DataObjectTypeName="Sage.Entity.Interfaces.IDefect"
    onobjectcreating="CreateDefectsWhatsModifiedDataSource"
    onobjectdisposing="DisposeDefectsWhatsNewDataSource"
    EnablePaging="true"
    StartRowIndexParameterName="StartRecord"
    MaximumRowsParameterName="MaxRecords" 
    SelectMethod="GetData"
    SelectCountMethod="GetRecordCount"
    SortParameterName="sortExpression"
     >
</asp:ObjectDataSource>

<SalesLogix:SlxGridView Caption="<%$ resources : NewDefects_Caption %>" ID="grdNewDefects" CssClass="datagrid" OnSorting="Sorting"
    AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt" GridLines="none" runat="server" AutoGenerateColumns="False" DataKeyNames="Id"
    CellPadding="4" ShowEmptyTable="True" AllowPaging="true" AllowSorting="true" PageSize="10" EnableViewState="false"
    EmptyTableRowText="<%$ resources: grdNewDefects.EmptyTableRowText %>" OnPageIndexChanging="grdNewDefects_PageIndexChanging" >
    <Columns>
        <asp:TemplateField SortExpression="DefectNumber" HeaderText="<%$ resources: grdNewDefects.DefectID.ColumnHeading %>">
            <ItemTemplate>
                <SalesLogix:PageLink ID="lnkDefect" runat="server" Target="_top" LinkType="EntityAlias" Text='<%# Eval("DefectNumber") %>'
                    NavigateUrl="defect" EntityId='<%# Eval("Id") %>' />
            </ItemTemplate>
        </asp:TemplateField>
        <asp:TemplateField SortExpression="StatusCode" HeaderText="<%$ resources: grdNewDefects.Status.ColumnHeading %>">
            <ItemTemplate>
                <SalesLogix:PickListControl runat="server" ID="pklStatus" ValueStoredAsText="False" 
                    PickListName="Defect Status" PickListValue='<%#  Eval("StatusCode")  %>' DisplayMode="AsText" CssClass="">
                </SalesLogix:PickListControl>
            </ItemTemplate>
        </asp:TemplateField>
        <asp:TemplateField SortExpression="Priority" HeaderText="<%$ resources: grdNewDefects.Priority.ColumnHeading %>">
            <ItemTemplate>
                <SalesLogix:PickListControl runat="server" ID="pklPriority" ValueStoredAsText="False" 
                    PickListName="Defect Priority" PickListValue='<%#  Eval("PriorityCode")  %>' DisplayMode="AsText" CssClass="">
                </SalesLogix:PickListControl>
            </ItemTemplate>
        </asp:TemplateField>
        <asp:TemplateField SortExpression="Severity" HeaderText="<%$ resources: grdNewDefects.Severity.ColumnHeading %>">
            <ItemTemplate>
                <SalesLogix:PickListControl runat="server" ID="pklSeverity" ValueStoredAsText="False" 
                    PickListName="Defect Severity" PickListValue='<%#  Eval("SeverityCode")  %>' DisplayMode="AsText" CssClass="">
                </SalesLogix:PickListControl>
            </ItemTemplate>
        </asp:TemplateField>
        <asp:TemplateField HeaderText="<%$ resources: grdNewDefects.CreateDate.ColumnHeading %>" HeaderStyle-Width="100px" SortExpression="CreateDate">
            <ItemTemplate>
                <SalesLogix:DateTimePicker id="dteCreateDate" Runat="Server" DisplayMode="AsText" DisplayTime="False" DateTimeValue=<%# Eval("CreateDate") %> />
            </ItemTemplate>
        </asp:TemplateField>
        <asp:TemplateField HeaderText="<%$ resources: grdNewDefects.CreateUser.ColumnHeading %>" SortExpression="CreateUser" >
            <itemtemplate>
                <SalesLogix:SlxUserControl runat="server" ID="dteCreateUser" DisplayMode="AsText" LookupResultValue='<%# Eval("CreateUser") %>' />
            </itemtemplate>
        </asp:TemplateField>
    </Columns>
	<PagerStyle CssClass="gridPager" />
    <PagerSettings Mode="NumericFirstLast" FirstPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Start_16x16" LastPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=End_16x16" />
</SalesLogix:SlxGridView>
<br/>

<SalesLogix:SlxGridView Caption="<%$ resources : ModifiedDefects_Caption %>" ID="grdModifiedDefects" CssClass="datagrid" OnSorting="Sorting"
    AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt" GridLines="none" runat="server" AutoGenerateColumns="False" DataKeyNames="Id"
    CellPadding="4" ShowEmptyTable="True" AllowPaging="true" AllowSorting="true" PageSize="10" EnableViewState="false"
    EmptyTableRowText="<%$ resources: grdChangedDefects.EmptyTableRowText %>" OnPageIndexChanging="grdModifiedDefects_PageIndexChanging" >
    <Columns>
        <asp:TemplateField SortExpression="DefectNumber" HeaderText="<%$ resources: grdNewDefects.DefectID.ColumnHeading %>">
            <ItemTemplate>
                <SalesLogix:PageLink ID="lnkModifedDefects" runat="server" Target="_top" LinkType="EntityAlias" Text='<%# Eval("DefectNumber") %>'
                    NavigateUrl="defect" EntityId='<%# Eval("Id") %>' />
            </ItemTemplate>
        </asp:TemplateField>
        <asp:TemplateField SortExpression="StatusCode" HeaderText="<%$ resources: grdNewDefects.Status.ColumnHeading %>">
            <ItemTemplate>
                <SalesLogix:PickListControl runat="server" ID="pklModifidStatus" ValueStoredAsText="False" 
                    PickListName="Defect Status" PickListValue='<%#  Eval("StatusCode")  %>' DisplayMode="AsText" CssClass="">
                </SalesLogix:PickListControl>
            </ItemTemplate>
        </asp:TemplateField>
        <asp:TemplateField SortExpression="Priority" HeaderText="<%$ resources: grdNewDefects.Priority.ColumnHeading %>">
            <ItemTemplate>
                <SalesLogix:PickListControl runat="server" ID="pklModifiedPriority" ValueStoredAsText="False" 
                    PickListName="Defect Priority" PickListValue='<%#  Eval("PriorityCode")  %>' DisplayMode="AsText" CssClass="">
                </SalesLogix:PickListControl>
            </ItemTemplate>
        </asp:TemplateField>
        <asp:TemplateField SortExpression="Severity" HeaderText="<%$ resources: grdNewDefects.Severity.ColumnHeading %>">
            <ItemTemplate>
                <SalesLogix:PickListControl runat="server" ID="pklModifiedSeverity"  ValueStoredAsText="False" 
                    PickListName="Defect Severity" PickListValue='<%#  Eval("SeverityCode")  %>' DisplayMode="AsText" CssClass="">
                </SalesLogix:PickListControl>
            </ItemTemplate>
        </asp:TemplateField>
        <asp:TemplateField HeaderText="<%$ resources: grdNewDefects.ModifyDate.ColumnHeading %>" HeaderStyle-Width="100px" SortExpression="ModifyDate">
            <ItemTemplate>
                <SalesLogix:DateTimePicker id="dteModifyDate" Runat="Server" DisplayMode="AsText" DisplayTime="False" DateTimeValue=<%# Eval("ModifyDate") %> />
            </ItemTemplate>
        </asp:TemplateField>
        <asp:TemplateField HeaderText="<%$ resources: grdNewDefects.ModifyUser.ColumnHeading %>" SortExpression="ModifyUser" >
            <itemtemplate>
                <SalesLogix:SlxUserControl runat="server" ID="dteModifyUser" DisplayMode="AsText" LookupResultValue='<%# Eval("ModifyUser") %>' />
            </itemtemplate>
        </asp:TemplateField>
    </Columns>
	<PagerStyle CssClass="gridPager" />
    <PagerSettings Mode="NumericFirstLast" FirstPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Start_16x16" LastPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=End_16x16" />
</SalesLogix:SlxGridView>