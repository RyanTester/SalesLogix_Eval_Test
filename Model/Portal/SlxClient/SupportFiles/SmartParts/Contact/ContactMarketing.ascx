<%@ Control Language="C#" AutoEventWireup="true" CodeFile="ContactMarketing.ascx.cs" Inherits="SmartParts_Contact_ContactMarketing" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Lookup" TagPrefix="SalesLogix" %>

<div style="display:none">
    <asp:Panel ID="ContactMarketing_RTools" runat="server" meta:resourcekey="ContactMarketing_RToolsResource1">
        <asp:ImageButton runat="server" ID="AddResponse" ToolTip="Add Campaign Response" 
            ImageUrl="~/images/icons/plus_16x16.gif" meta:resourcekey="AddResponse_rsc" />
        <SalesLogix:PageLink ID="lnkContactMarketingHelp" runat="server" LinkType="HelpFileName"
            ToolTip="<%$ resources:Portal, Help_ToolTip %>" Target="Help" NavigateUrl="marketingtab.aspx"
            ImageUrl="~/ImageResource.axd?scope=global&amp;type=Global_Images&amp;key=Help_16x16" meta:resourcekey="lnkContactMarketingHelpResource1"></SalesLogix:PageLink>
    </asp:Panel>
</div>

<SalesLogix:SlxGridView runat="server" ID="grdContactMarketing" GridLines="None" AutoGenerateColumns="False" CellPadding="4"
    CssClass="datagrid" AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt" ShowEmptyTable="True" EnableViewState="False"
    RowSelect="True" SelectedRowStyle-CssClass="rowSelected" EmptyTableRowText="<%$ resources: grdContactMarketing.EmptyTableRow.Text %>"
    DataKeyNames="TargetId,ResponseId" OnRowCommand="ContactMarketing_RowCommand" OnRowEditing="ContactMarketing_RowEditing"
    OnRowDataBound="ContactMarketing_RowDataBound" OnRowDeleting="ContactMarketing_RowDeleting" OnSorting="ContactMarketing_Sorting"
    AllowSorting="True" ShowSortIcon="True" CurrentSortExpression="CampaignName" SortDescImageUrl="" SortAscImageUrl=""
    PagerStyle-CssClass="gridPager" ExpandableRows="True" ResizableColumns="True" AllowPaging="true" >
    <Columns>
        <asp:ButtonField CommandName="Edit" Text="<%$ resources: grdContactMarketing.Edit.Column %>" />
        <asp:ButtonField CommandName="Delete" Text="<%$ resources: grdContactMarketing.Delete.Column %>" />
        <asp:ButtonField CommandName="Remove" Text="<%$ resources: grdContactMarketing.Remove.Column %>" />
        <asp:BoundField DataField="CampaignName" SortExpression="CampaignName" HeaderText="<%$ resources: grdContactMarketing.Name.Column %>" />
        <asp:BoundField DataField="CampaignCode" SortExpression="CampaignCode" HeaderText="<%$ resources: grdContactMarketing.Code.Column %>" />
        <asp:BoundField DataField="Status" HeaderText="<%$ resources: grdContactMarketing.Status.Column %>" />
        <asp:BoundField DataField="Stage" HeaderText="<%$ resources: grdContactMarketing.Stage.Column %>" />
        <asp:TemplateField SortExpression="StartDate" HeaderText="<%$ resources: grdContactMarketing.StartDate.Column %>" >
            <itemtemplate>
                <SalesLogix:DateTimePicker runat="server" ID="StartDate" DisplayTime="False" DisplayMode="AsText"
                    DateOnly="True" DateTimeValue='<%# Eval("StartDate") %>'>
                </SalesLogix:DateTimePicker>
            </itemtemplate>
        </asp:TemplateField>
        <asp:TemplateField SortExpression="EndDate" HeaderText="<%$ resources: grdContactMarketing.EndDate.Column %>" >
            <itemtemplate>
                <SalesLogix:DateTimePicker runat="server" ID="EndDate" DisplayTime="False" DisplayMode="AsText"
                     DateOnly="True" DateTimeValue='<%# Eval("EndDate") %>'>
                </SalesLogix:DateTimePicker>
            </itemtemplate>
        </asp:TemplateField>
        <asp:TemplateField SortExpression="ResponseDate" HeaderText="<%$ resources: grdContactMarketing.ResponseDate.Column %>" >
            <itemtemplate>
                <SalesLogix:DateTimePicker runat="server" DisplayTime="True" DisplayDate="True" DisplayMode="AsText"
                    DateTimeValue='<%# Eval("ResponseDate") %>' ID="ResponseDate">
                </SalesLogix:DateTimePicker>
            </itemtemplate>
        </asp:TemplateField>
        <asp:BoundField DataField="ResponseMethod" SortExpression="ResponseMethod" HeaderText="<%$ resources: grdContactMarketing.ResponseMethod.Column %>" />
    </Columns>
</SalesLogix:SlxGridView>