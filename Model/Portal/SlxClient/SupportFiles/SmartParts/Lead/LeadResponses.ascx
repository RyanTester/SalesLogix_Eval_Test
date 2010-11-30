<%@ Control Language="C#" AutoEventWireup="true" CodeFile="LeadResponses.ascx.cs" Inherits="SmartParts_Lead_LeadResponses" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Lookup" TagPrefix="SalesLogix" %>

<div style="display:none">
    <asp:Panel ID="LeadResponses_RTools" runat="server" >
        <asp:ImageButton runat="server" ID="cmdAddResponse" ToolTip="<%$ resources: cmdAddResponse.ToolTip %>"
            ImageUrl="~/images/icons/plus_16x16.gif" />
        <SalesLogix:PageLink ID="lnkLeadResponseHelp" runat="server" LinkType="HelpFileName"
            ToolTip="<%$ resources:Portal, Help_ToolTip %>" Target="Help" NavigateUrl="marketingtab.aspx"
            ImageUrl="~/ImageResource.axd?scope=global&amp;type=Global_Images&amp;key=Help_16x16" >
        </SalesLogix:PageLink>
    </asp:Panel>
</div>

<SalesLogix:SlxGridView runat="server" ID="grdLeadResponses" GridLines="None" AutoGenerateColumns="False" CellPadding="4"
    CssClass="datagrid" AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt" ShowEmptyTable="True" EnableViewState="False"
    RowSelect="True" EmptyTableRowText="<%$ resources: grdLeadResponses.EmptyTableRow.Text %>"
    DataKeyNames="Id" OnRowCommand="LeadResponses_RowCommand" OnRowEditing="LeadResponses_RowEditing"
    OnRowDataBound="LeadResponses_RowDataBound" OnRowDeleting="LeadResponses_RowDeleting" OnSorting="LeadResponses_Sorting"
    AllowSorting="True" ShowSortIcon="True" CurrentSortExpression="CampaignName" SortDescImageUrl="" SortAscImageUrl=""
    ExpandableRows="True" ResizableColumns="True" AllowPaging="true" PageSize="10" >
    <Columns>
        <asp:ButtonField CommandName="Edit" Text="<%$ resources: grdLeadResponses.Edit.Column %>" />
        <asp:ButtonField CommandName="Delete" Text="<%$ resources: grdLeadResponses.Delete.Column %>" />
        <asp:TemplateField SortExpression="ResponseDate" HeaderText="<%$ resources: grdLeadResponses.ResponseDate.Column %>" >
            <itemtemplate>
                <SalesLogix:DateTimePicker runat="server" DisplayTime="True" DisplayDate="True" DisplayMode="AsText"
                    DateTimeValue='<%# Eval("ResponseDate") %>' ID="ResponseDate">
                </SalesLogix:DateTimePicker>
            </itemtemplate>
        </asp:TemplateField>
        <asp:BoundField DataField="Interest" HeaderText="<%$ resources: grdLeadResponses.Interest.Column %>" SortExpression="Interest" />
        <asp:BoundField DataField="Status" HeaderText="<%$ resources: grdLeadResponses.Status.Column %>" SortExpression="Status" />
        <asp:BoundField DataField="InterestLevel" HeaderText="<%$ resources: grdLeadResponses.InterestLevel.Column %>" SortExpression="InterestLevel" />
        <asp:BoundField DataField="LeadSource" HeaderText="<%$ resources: grdLeadResponses.LeadSource.Column %>" SortExpression="LeadSource" />
        <asp:BoundField DataField="Campaign" HeaderText="<%$ resources: grdLeadResponses.Campaign.Column %>" SortExpression="Campaign" />        
    </Columns>
    <AlternatingRowStyle CssClass="rowdk" />
    <RowStyle CssClass="rowlt" />
</SalesLogix:SlxGridView>