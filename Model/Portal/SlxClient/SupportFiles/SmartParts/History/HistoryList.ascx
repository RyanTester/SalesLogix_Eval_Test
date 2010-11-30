<%@ Control Language="C#" AutoEventWireup="true" CodeFile="HistoryList.ascx.cs" Inherits="SmartParts_History_HistoryList" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.Platform.WebPortal" Namespace="Sage.Platform.WebPortal.SmartParts" TagPrefix="SalesLogix" %>

<div style="display:none">
    <asp:Panel ID="HistoryList_LTools" runat="server"></asp:Panel>
    <asp:Panel ID="HistoryList_CTools" runat="server"></asp:Panel>
    <SalesLogix:SmartPartToolsContainer ID="HistoryList_RTools" runat="server">
        <asp:ImageButton runat="server" ID="CompleteActivity" Text="<%$ resources: CompleteActivity.ToolTip %>" meta:resourcekey="AddHistory_rsc"
            ToolTip="<%$ resources: CompleteActivity.ToolTip %>" ImageUrl="~/images/icons/plus_16x16.gif" />
        <SalesLogix:PageLink ID="HistoryListHelpLink" runat="server" LinkType="HelpFileName" ToolTip="<%$ resources: HistoryListHelpLink.ToolTip %>"
            Target="Help" NavigateUrl="historytab.aspx" ImageUrl="~/images/icons/Help_16x16.gif">
        </SalesLogix:PageLink>
    </SalesLogix:SmartPartToolsContainer>
</div>
<SalesLogix:SlxGridView ID="HistoryGrid" runat="server" AutoGenerateColumns="False" CellPadding="4" EnableViewState="false" ForeColor="#333333"
    GridLines="None" CssClass="datagrid" AllowPaging="true" PageSize="10" AllowSorting="true" CurrentSortDirection="Descending"
    ShowEmptyTable="true" EmptyTableRowText="<%$ resources: HistoryGrid.EmptyTableRowText %>" ShowSortIcon="true">
    <Columns>
        <asp:TemplateField HeaderText="<%$ resources: HistoryGrid.Columns.Type.HeaderText %>" SortExpression="Type">
           <itemtemplate>
                <asp:HyperLink id="A1" runat="server" Target="_top" 
                    NavigateUrl='<%# GetHistoryLink(Eval("HistoryId")) %>'>
					<img alt='<%# GetToolTip(Eval("Type")) %>' style="vertical-align:middle;" 
					    src='<%# GetImage(Eval("Type")) %>' />&nbsp;<%# GetToolTip(Eval("Type")) %>
				</asp:HyperLink>
		    </itemtemplate>
        </asp:TemplateField>
        <asp:TemplateField HeaderText="<%$ resources: HistoryGrid.Columns.CompleteDate.HeaderText %>" SortExpression="CompletedDate">
            <ItemTemplate><%# GetLocalDateTime(Eval("CompletedDate"), Eval("Timeless"))%></ItemTemplate>
        </asp:TemplateField>
        <asp:BoundField DataField="User" HeaderText="<%$ resources: HistoryGrid.Columns.Leader.HeaderText %>" SortExpression="User" />
        <asp:BoundField DataField="ContactName" HeaderText="<%$ resources: HistoryGrid.Columns.ContactName.HeaderText %>" SortExpression="ContactName"/>
        <asp:BoundField DataField="Description" HeaderText="<%$ resources: HistoryGrid.Columns.Description.HeaderText %>" SortExpression="Description" />
        <asp:BoundField DataField="Result" HeaderText="<%$ resources: HistoryGrid.Columns.Result.HeaderText %>" SortExpression="Result"/>
        <asp:BoundField DataField="Notes" HeaderText="<%$ resources: HistoryGrid.Columns.Notes.HeaderText %>" SortExpression="Notes"/>
        <asp:BoundField DataField="Category" HeaderText="<%$ resources: HistoryGrid.Columns.Category.HeaderText %>" SortExpression="Category"/>
    </Columns>
    <FooterStyle BackColor="#5D7B9D" Font-Bold="True" ForeColor="White" />
    <RowStyle CssClass="rowlt" />
    <SelectedRowStyle BackColor="Highlight" />
    <AlternatingRowStyle CssClass="rowdk" />
</SalesLogix:SlxGridView>