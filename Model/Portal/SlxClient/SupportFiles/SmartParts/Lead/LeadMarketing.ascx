<%@ Control Language="C#" AutoEventWireup="true" CodeFile="LeadMarketing.ascx.cs" Inherits="SmartParts_Lead_LeadMarketing" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Lookup" TagPrefix="SalesLogix" %>

<div style="display:none">
    <asp:Panel ID="LeadMarketing_RTools" runat="server" meta:resourcekey="LeadMarketing_RToolsResource1">
        <asp:ImageButton runat="server" ID="AddResponse" ToolTip="Add Campaign Response" 
            ImageUrl="~/images/icons/plus_16x16.gif" meta:resourcekey="AddResponse_rsc" />
        <SalesLogix:PageLink ID="lnkLeadMarketingHelp" runat="server" LinkType="HelpFileName"
            ToolTip="<%$ resources:Portal, Help_ToolTip %>" Target="Help" NavigateUrl="marketingtab.aspx"
            ImageUrl="~/ImageResource.axd?scope=global&amp;type=Global_Images&amp;key=Help_16x16" meta:resourcekey="lnkLeadMarketingHelpResource1"></SalesLogix:PageLink>
    </asp:Panel>
</div>

<SalesLogix:SlxGridView runat="server" ID="grdLeadMarketing" GridLines="None" AutoGenerateColumns="False" CellPadding="4"
    CssClass="datagrid" AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt" ShowEmptyTable="True" EnableViewState="False"
    RowSelect="True" EmptyTableRowText="<%$ resources: LeadMarketing_EmptyTableRowText %>" ResizableColumns="True"
    DataKeyNames="TargetId,ResponseId" OnRowCommand="LeadMarketing_RowCommand" OnRowEditing="LeadMarketing_RowEditing"
    OnRowDataBound="LeadMarketing_RowDataBound" OnRowDeleting="LeadMarketing_RowDeleting" OnSorting="LeadMarketing_Sorting"
    AllowSorting="True" ShowSortIcon="True" CurrentSortExpression="CampaignName" SortDescImageUrl="" SortAscImageUrl=""
    ExpandableRows="True" AllowPaging="true" pageSize="10">
    <Columns>
        <asp:ButtonField CommandName="Edit" Text="<%$ resources: LeadMarketing_Edit.Text %>" />
        <asp:ButtonField CommandName="Delete" Text="<%$ resources: LeadMarketing_Delete.Text %>" />
        <asp:ButtonField CommandName="Remove" Text="<%$ resources: LeadMarketing_Remove.Text %>" />
        <asp:BoundField DataField="CampaignName" SortExpression="CampaignName" HeaderText="<%$ resources: LeadMarketing_Name.HeaderText %>" />
        <asp:BoundField DataField="CampaignCode" SortExpression="CampaignCode" HeaderText="<%$ resources: LeadMarketing_Code.HeaderText %>" />
        <asp:BoundField DataField="Status" HeaderText="<%$ resources: LeadMarketing_Status.HeaderText %>" />
        <asp:BoundField DataField="Stage" HeaderText="<%$ resources: LeadMarketing_Stage.HeaderText %>" />
        <asp:TemplateField SortExpression="StartDate" HeaderText="<%$ resources: LeadMarketing_StartDate.HeaderText %>" >
            <itemtemplate>
                <SalesLogix:DateTimePicker runat="server" ID="StartDate" DisplayTime="False" DisplayMode="AsText"
                    DateOnly="True" DateTimeValue='<%# Eval("StartDate") %>'>
                </SalesLogix:DateTimePicker>
            </itemtemplate>
        </asp:TemplateField>
        <asp:TemplateField SortExpression="EndDate" HeaderText="<%$ resources: LeadMarketing_EndDate.HeaderText %>" >
            <itemtemplate>
                <SalesLogix:DateTimePicker runat="server" ID="EndDate" DisplayTime="False" DisplayMode="AsText"
                     DateOnly="True" DateTimeValue='<%# Eval("EndDate") %>'>
                </SalesLogix:DateTimePicker>
            </itemtemplate>
        </asp:TemplateField>
        <asp:TemplateField SortExpression="ResponseDate" HeaderText="<%$ resources: LeadMarketing_ResponseDate.HeaderText %>" >
            <itemtemplate>
                <SalesLogix:DateTimePicker runat="server" DisplayTime="True" DisplayDate="True" DisplayMode="AsText"
                    DateTimeValue='<%# Eval("ResponseDate") %>' ID="ResponseDate">
                </SalesLogix:DateTimePicker>
            </itemtemplate>
        </asp:TemplateField>
        <asp:BoundField DataField="ResponseMethod" SortExpression="ResponseMethod" HeaderText="<%$ resources: LeadMarketing_ResponseMethod.HeaderText %>" />
    </Columns>
    <AlternatingRowStyle CssClass="rowdk" />
    <RowStyle CssClass="rowlt" />
</SalesLogix:SlxGridView>