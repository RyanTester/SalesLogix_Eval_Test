<%@ Control Language="C#" AutoEventWireup="true" CodeFile="NotesList.ascx.cs" Inherits="SmartParts_History_NotesList" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>

<div style="display:none">
<asp:Panel ID="NotesList_LTools" runat="server">
</asp:Panel>
<asp:Panel ID="NotesList_CTools" runat="server">
</asp:Panel>
<asp:Panel ID="NotesList_RTools" runat="server">
    <asp:ImageButton runat="server" ID="AddNote" Text="Add Note" ToolTip="<%$ resources: AddNote.ToolTip %>" ImageUrl="~/images/icons/plus_16x16.gif" meta:resourcekey="AddNote_rsc" />
    <SalesLogix:PageLink ID="NotesListHelpLink" runat="server" LinkType="HelpFileName" ToolTip="<%$ resources: Portal, Help_ToolTip %>" Target="Help" NavigateUrl="notestab.aspx" ImageUrl="~/images/icons/Help_16x16.gif"></SalesLogix:PageLink>
</asp:Panel>
</div>
<SalesLogix:SlxGridView ID="grdNotes" runat="server" AutoGenerateColumns="False" CellPadding="4" ForeColor="#333333"
    EnableViewState="false" GridLines="None" CssClass="datagrid" AllowPaging="true" PageSize="10" ShowEmptyTable="true"
    EmptyTableRowText="<%$ resources: grdNotes.EmptyTableRowText %>">
    <FooterStyle BackColor="#5D7B9D" Font-Bold="True" ForeColor="White" />
    <Columns>
        <asp:TemplateField HeaderText="<%$ resources: grdNotes.Columns.Notes.HeaderText %>">
            <ItemTemplate><a id="A1" runat="server" href='<%# GetHistoryLink(Eval("HistoryId")) %>'><%# GetHistoryDescription(Eval("Description")) %></a></ItemTemplate>
        </asp:TemplateField>
     </Columns>
    <RowStyle BackColor="#F7F6F3" ForeColor="#333333" CssClass="rowdk" />
    <EditRowStyle BackColor="#999999" />
    <SelectedRowStyle BackColor="#E2DED6" Font-Bold="True" ForeColor="#333333" />
    <PagerStyle BackColor="#284775" ForeColor="White" HorizontalAlign="Center" />
    <HeaderStyle BackColor="#5D7B9D" Font-Bold="True" ForeColor="White" />
    <AlternatingRowStyle BackColor="White" ForeColor="#284775" CssClass="rowlt" />
</SalesLogix:SlxGridView>
