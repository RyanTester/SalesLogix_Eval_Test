<%@ Control Language="C#" AutoEventWireup="true" CodeFile="RemoteDocumentsWhatsNew.ascx.cs" Inherits="RemoteDocumentsWhatsNew" %>
<%@ Register Assembly="Sage.SalesLogix.Web" Namespace="Sage.SalesLogix.Web" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>

<SalesLogix:SlxGridView ID="grdDocuments" CssClass="datagrid" AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt" GridLines="none" 
    runat="server" AutoGenerateColumns="False" CellPadding="4" ShowEmptyTable="True" AllowPaging="true" AllowSorting="true"
    PageSize="10" EmptyTableRowText="<%$ resources: grdDocuments_EmptyRow %>" OnPageIndexChanging="PageIndexChanging"
    OnSorting="grdDocuments_Sorting" EnableViewState="false" ShowSortIcon="true">
    <Columns>
        <asp:BoundField DataField="Type" HeaderText="<%$ resources: grdDocuments_Type_ColumnHeader %>" SortExpression="Type" />
        <asp:BoundField DataField="Description" HeaderText="<%$ resources: grdDocuments_Description_ColumnHeader %>" SortExpression="Description"/>
        <asp:TemplateField SortExpression="DisplayFileName" HeaderText="<%$ resources: grdDocuments_FileName_ColumnHeader %>" >
            <ItemTemplate>
                <asp:HyperLink ID="lnkFile" runat="server" Target="_blank" Text='<%# Eval("DisplayFileName") %>'
                    NavigateUrl='<%# FormatUrl(Eval("AttachmentId"), Eval("Filename"), Eval("DataType"), Eval("Description")) %>' >
                </asp:HyperLink>
            </ItemTemplate>
        </asp:TemplateField>
        <asp:TemplateField HeaderText="<%$ resources: grdDocuments_DateAdded_ColumnHeader %>" HeaderStyle-Width="100px" SortExpression="DateAdded">
            <ItemTemplate>
                <SalesLogix:DateTimePicker ID="dteDateAdded" Runat="Server" DisplayMode="AsText" DisplayTime="False" Timeless="true" DateTimeValue='<%# Eval("DateAdded") %>' />
            </ItemTemplate>
        </asp:TemplateField>
    </Columns>
    <PagerStyle CssClass="gridPager" />
    <PagerSettings Mode="NumericFirstLast" FirstPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Start_16x16" LastPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=End_16x16" />
</SalesLogix:SlxGridView>
