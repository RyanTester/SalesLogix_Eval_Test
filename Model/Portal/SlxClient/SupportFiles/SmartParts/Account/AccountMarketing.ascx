<%@ Control Language="C#" AutoEventWireup="true" CodeFile="AccountMarketing.ascx.cs" Inherits="SmartParts_Account_AccountMarketing" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>

<div style="display:none">
    <asp:Panel ID="AccountMarketing_RTools" runat="server" meta:resourcekey="AccountMarketing_RToolsResource1">
        <asp:ImageButton runat="server" ID="AddResponse" ToolTip="Add Campaign Response" 
            ImageUrl="~/images/icons/plus_16x16.gif" meta:resourcekey="AddResponse_rsc" />
        <SalesLogix:PageLink ID="lnkAccountMarketingHelp" runat="server" LinkType="HelpFileName"
            ToolTip="<%$ resources:Portal, Help_ToolTip %>" Target="Help" NavigateUrl="marketingtab.aspx"
            ImageUrl="~/ImageResource.axd?scope=global&amp;type=Global_Images&amp;key=Help_16x16" meta:resourcekey="lnkAccountMarketingHelpResource1"></SalesLogix:PageLink>
    </asp:Panel>
</div>

<SalesLogix:SlxGridView runat="server" ID="grdAccountMarketing" GridLines="None" AutoGenerateColumns="False" CellPadding="4"
    CssClass="datagrid" AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt" ShowEmptyTable="True" EnableViewState="False"
    RowSelect="True" EmptyTableRowText="No records match the selection criteria." meta:resourcekey="AccountMarketing_EmptyTableRowText"
    DataKeyNames="TargetId,ResponseId" OnRowCommand="AccountMarketing_RowCommand" OnRowEditing="AccountMarketing_RowEditing"
    OnRowDataBound="AccountMarketing_RowDataBound" OnRowDeleting="AccountMarketing_RowDeleting" OnSorting="AccountMarketing_Sorting"
    AllowSorting="True" ShowSortIcon="True" CurrentSortExpression="CampaignName" SortDescImageUrl="" SortAscImageUrl=""
    ExpandableRows="True" ResizableColumns="True" 
    AllowPaging="true"
    pageSize="10" >
    <Columns>
        <asp:ButtonField CommandName="Add" Text="<%$ resources: AccountMarketing_Add.Text %>" />
        <asp:ButtonField CommandName="Edit" Text="<%$ resources: AccountMarketing_Edit.Text %>" />
        <asp:ButtonField CommandName="Delete" Text="<%$ resources: AccountMarketing_Delete.Text %>" />
        <asp:ButtonField CommandName="Remove" Text="<%$ resources: AccountMarketing_Remove %>" />
        <asp:BoundField DataField="CampaignName" HeaderText="<%$ resources: AccountMarketing_Name.HeaderText %>" SortExpression="CampaignName" />
        <asp:BoundField DataField="CampaignCode" HeaderText="<%$ resources: AccountMarketing_Code.HeaderText %>" SortExpression="CampaignCode" />
        <asp:BoundField DataField="Status" HeaderText="<%$ resources: AccountMarketing_Status.HeaderText %>" />
        <asp:BoundField DataField="Stage" HeaderText="<%$ resources: AccountMarketing_Stage.HeaderText %>" />
        <asp:TemplateField SortExpression="contact" HeaderText="<%$ resources: AccountMarketing_Contact.HeaderText %>" >
            <itemtemplate>
                <SalesLogix:PageLink runat="server" EntityId='<%# Eval("ContactId") %>' LinkType="EntityAlias" Text='<%# Eval("Contact") %>' 
                    NavigateUrl="Contact" meta:resourcekey="PageLinkResource1">
                </SalesLogix:PageLink>
            </itemtemplate>
        </asp:TemplateField>
        <asp:TemplateField SortExpression="StartDate" HeaderText="<%$ resources: AccountMarketing_StartDate.HeaderText %>" >
            <itemtemplate>
                <SalesLogix:DateTimePicker runat="server" ID="StartDate" DisplayTime="False" DisplayMode="AsText"
                    DateOnly="True" DateTimeValue='<%# Eval("StartDate") %>'>
                </SalesLogix:DateTimePicker>
            </itemtemplate>
        </asp:TemplateField>
        <asp:TemplateField SortExpression="EndDate" HeaderText="<%$ resources: AccountMarketing_EndDate.HeaderText %>" >
            <itemtemplate>
                <SalesLogix:DateTimePicker runat="server" ID="EndDate" DisplayTime="False" DisplayMode="AsText"
                     DateOnly="True" DateTimeValue='<%# Eval("EndDate") %>'>
                </SalesLogix:DateTimePicker>
            </itemtemplate>
        </asp:TemplateField>
        <asp:TemplateField SortExpression="ResponseDate" HeaderText="<%$ resources: AccountMarketing_ResponseDate.HeaderText %>" >
            <itemtemplate>
                <SalesLogix:DateTimePicker runat="server" DisplayTime="True" DisplayDate="True" DisplayMode="AsText"
                    DateTimeValue='<%# Eval("ResponseDate") %>' ID="ResponseDate">
                </SalesLogix:DateTimePicker>
            </itemtemplate>
        </asp:TemplateField>
        <asp:BoundField DataField="ResponseMethod" SortExpression="ResponseMethod" HeaderText="<%$ resources: AccountMarketing_ResponseMethod.HeaderText %>" />
    </Columns>
    <AlternatingRowStyle CssClass="rowdk" />
    <RowStyle CssClass="rowlt" />
</SalesLogix:SlxGridView>