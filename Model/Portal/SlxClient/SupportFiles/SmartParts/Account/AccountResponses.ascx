<%@ Control Language="C#" AutoEventWireup="true" CodeFile="AccountResponses.ascx.cs" Inherits="SmartParts_Account_Responses" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>

<div style="display:none">
    <asp:Panel ID="Responses_RTools" runat="server">
        <asp:ImageButton runat="server" ID="cmdAddResponse" ToolTip="<%$ resources: cmdAddResponse.ToolTip %>"
            ImageUrl="~/images/icons/plus_16x16.gif" />
        <SalesLogix:PageLink ID="lnkResponseHelp" runat="server" LinkType="HelpFileName"
            ToolTip="<%$ resources:Portal, Help_ToolTip %>" Target="Help" NavigateUrl="marketingtab.aspx"
            ImageUrl="~/ImageResource.axd?scope=global&amp;type=Global_Images&amp;key=Help_16x16"></SalesLogix:PageLink>
    </asp:Panel>
</div>

<SalesLogix:SlxGridView runat="server" ID="grdResponses" GridLines="None" AutoGenerateColumns="False" CellPadding="4"
    CssClass="datagrid" AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt" ShowEmptyTable="True" EnableViewState="False"
    RowSelect="True" EmptyTableRowText="<%$ resources: grdResponses.EmptyTableRow.Text %>"
    DataKeyNames="ResponseId" OnRowCommand="grdResponses_RowCommand" OnRowEditing="grdResponses_RowEditing"
    OnRowDataBound="grdResponses_RowDataBound" OnRowDeleting="grdResponses_RowDeleting" OnSorting="grdResponses_Sorting"
    AllowSorting="True" ShowSortIcon="True" CurrentSortExpression="contact" SortDescImageUrl="" SortAscImageUrl=""
    ExpandableRows="True" ResizableColumns="True" AllowPaging="true" PageSize="10" >
    <Columns>
        <asp:ButtonField CommandName="Edit" Text="<%$ resources: grdResponses.Edit.Column %>" />
        <asp:ButtonField CommandName="Delete" Text="<%$ resources: grdResponses.Delete.Column %>" />
        <asp:TemplateField SortExpression="contact" HeaderText="<%$ resources: grdResponses.Contact.Column %>" >
            <itemtemplate>
                <SalesLogix:PageLink ID="lnkContact" runat="server" EntityId='<%# Eval("ContactId") %>' LinkType="EntityAlias" Text='<%# Eval("Contact") %>' 
                    NavigateUrl="Contact" >
                </SalesLogix:PageLink>
            </itemtemplate>
        </asp:TemplateField>
        <asp:TemplateField SortExpression="ResponseDate" HeaderText="<%$ resources: grdResponses.ResponseDate.Column %>" >
            <itemtemplate>
                <SalesLogix:DateTimePicker runat="server" DisplayTime="True" DisplayDate="True" DisplayMode="AsText"
                    DateTimeValue='<%# Eval("ResponseDate") %>' ID="ResponseDate">
                </SalesLogix:DateTimePicker>
            </itemtemplate>
        </asp:TemplateField>
        <asp:BoundField DataField="Interest" HeaderText="<%$ resources: grdResponses.Interest.Column %>" SortExpression="Interest" />
        <asp:BoundField DataField="Status" HeaderText="<%$ resources: grdResponses.Status.Column %>" SortExpression="Status" />
        <asp:BoundField DataField="InterestLevel" HeaderText="<%$ resources: grdResponses.InterestLevel.Column %>" SortExpression="InterestLevel" />
        <asp:BoundField DataField="LeadSource" HeaderText="<%$ resources: grdResponses.LeadSource.Column %>" SortExpression="LeadSource" />
        <asp:BoundField DataField="Campaign" HeaderText="<%$ resources: grdResponses.Campaign.Column %>" SortExpression="Campaign" />
    </Columns>
    <AlternatingRowStyle CssClass="rowdk" />
    <RowStyle CssClass="rowlt" />
</SalesLogix:SlxGridView>