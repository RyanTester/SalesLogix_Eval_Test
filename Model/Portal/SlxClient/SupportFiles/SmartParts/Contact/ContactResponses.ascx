<%@ Control Language="C#" AutoEventWireup="true" CodeFile="ContactResponses.ascx.cs" Inherits="SmartParts_Contact_ContactResponses" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>

<div style="display:none">
    <asp:Panel ID="ContactResponses_RTools" runat="server">
        <asp:ImageButton runat="server" ID="cmdAddResponse" ToolTip="<%$ resources: cmdAddResponse.ToolTip %>"
            ImageUrl="~/images/icons/plus_16x16.gif" />
        <SalesLogix:PageLink ID="lnkContactResponseHelp" runat="server" LinkType="HelpFileName"
            ToolTip="<%$ resources:Portal, Help_ToolTip %>" Target="Help" NavigateUrl="marketingtab.aspx"
            ImageUrl="~/ImageResource.axd?scope=global&amp;type=Global_Images&amp;key=Help_16x16" >
        </SalesLogix:PageLink>
    </asp:Panel>
</div>

<SalesLogix:SlxGridView runat="server" ID="grdContactResponses" GridLines="None" AutoGenerateColumns="False" CellPadding="4"
    CssClass="datagrid" AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt" ShowEmptyTable="True" EnableViewState="False"
    RowSelect="True" EmptyTableRowText="<%$ resources: grdContactResponses.EmptyTableRow.Text %>"
    DataKeyNames="Id" OnRowCommand="grdContactResponses_RowCommand" OnRowEditing="grdContactResponses_RowEditing"
    OnRowDataBound="grdContactResponses_RowDataBound" OnRowDeleting="grdContactResponses_RowDeleting" OnSorting="grdContactResponses_Sorting"
    AllowSorting="True" ShowSortIcon="True" CurrentSortExpression="CampaignName" SortDescImageUrl="" SortAscImageUrl=""
    ExpandableRows="True" ResizableColumns="True" AllowPaging="true" >
    <Columns>
        <asp:ButtonField CommandName="Edit" Text="<%$ resources: grdContactResponses.Edit.Column %>" />
        <asp:ButtonField CommandName="Delete" Text="<%$ resources: grdContactResponses.Delete.Column %>" />
        <asp:TemplateField SortExpression="ResponseDate" HeaderText="<%$ resources: grdContactResponses.ResponseDate.Column %>" >
            <itemtemplate>
                <SalesLogix:DateTimePicker runat="server" DisplayTime="True" DisplayDate="True" DisplayMode="AsText"
                    DateTimeValue='<%# Eval("ResponseDate") %>' ID="ResponseDate">
                </SalesLogix:DateTimePicker>
            </itemtemplate>
        </asp:TemplateField>
        <asp:BoundField DataField="Interest" HeaderText="<%$ resources: grdContactResponses.Interest.Column %>" SortExpression="Interest" />
        <asp:BoundField DataField="Status" HeaderText="<%$ resources: grdContactResponses.Status.Column %>" SortExpression="Status" />
        <asp:BoundField DataField="InterestLevel" HeaderText="<%$ resources: grdContactResponses.InterestLevel.Column %>" SortExpression="InterestLevel" />
        <asp:BoundField DataField="LeadSource" HeaderText="<%$ resources: grdContactResponses.LeadSource.Column %>" SortExpression="LeadSource" />
        <asp:BoundField DataField="Campaign" HeaderText="<%$ resources: grdContactResponses.Campaign.Column %>" SortExpression="Campaign" />
    </Columns>
    <AlternatingRowStyle CssClass="rowdk" />
    <RowStyle CssClass="rowlt" />
</SalesLogix:SlxGridView>
