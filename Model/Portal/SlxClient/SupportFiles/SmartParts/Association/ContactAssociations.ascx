<%@ Control Language="C#" AutoEventWireup="true" CodeFile="ContactAssociations.ascx.cs" Inherits="SmartParts_Association_ContactAssociations" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>

<div style="display:none">
    <asp:Panel ID="ContactAssociations_LTools" runat="server"></asp:Panel>
    <asp:Panel ID="ContactAssociations_CTools" runat="server"></asp:Panel>
    <asp:Panel ID="ContactAssociations_RTools" runat="server">
        <asp:ImageButton runat="server" ID="btnAddAssociation" Text="<%$ resources: btnAddAssociation.Text %>"
            ToolTip="<%$ resources: btnAddAssociation.ToolTip %>" ImageUrl="~\images\icons\plus_16X16.gif" />
        <SalesLogix:PageLink ID="lnkAssociationHelp" runat="server" LinkType="HelpFileName"
            ToolTip="<%$ resources: Portal, Help_ToolTip %>" Target="Help" NavigateUrl="associationstab.aspx"
            ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16">
        </SalesLogix:PageLink>
    </asp:Panel>
</div>

<SalesLogix:SlxGridView runat="server" ID="ContactAssociations_Grid" GridLines="None" AutoGenerateColumns="False" CellPadding="4" 
    CssClass="datagrid" AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt" ShowEmptyTable="true" DataKeyNames="Id"
    EmptyTableRowText="<%$ resources: ContactAssociationsGrid_NoRecordFound.EmptyTableRowText %>" AllowPaging="true"
    OnRowDataBound="ContactAssociations_Grid_RowDataBound" OnRowCommand="ContactAssociations_Grid_RowCommand" EnableViewState="false"
    OnRowEditing="ContactAssociations_Grid_RowEditing" OnRowDeleting="ContactAssociations_Grid_RowDeleting" PageSize="10" >
    <Columns>
       <asp:ButtonField CommandName="Edit" Text="<%$ resources: ContactAssociationsGrid_Edit.Text %>" /> 
       <asp:ButtonField CommandName="Delete" Text="<%$ resources: ContactAssociationsGrid_Delete.Text %>"/> 
       <asp:TemplateField HeaderText="<%$ resources: ContactAssociationsGrid_Name.HeaderText %>" >
              <itemtemplate>
                  <SalesLogix:PageLink runat="server" NavigateUrl="Contact" EntityId='<%# Eval("ContactId") %>' Text='<%# Eval("Contact") %>'
                        LinkType="EntityAlias" ToolTip="<%$ resources: ContactAssociationsGrid_Link.ToolTip %>">
                  </SalesLogix:PageLink>
              </itemtemplate>
          </asp:TemplateField>
          <asp:BoundField DataField="Relation" HeaderText="<%$ resources: ContactAssociationsGrid_Relation.HeaderText %>" />
          <asp:BoundField DataField="Notes" HeaderText="<%$ resources: ContactAssociationsGrid_Notes.HeaderText %>" />
          <asp:BoundField DataField="CreatedBy" HeaderText="<%$ resources: ContactAssociationsGrid_CreatedBy.HeaderText %>" />
          <asp:BoundField DataField="Date" DataFormatString="{0:d}" HtmlEncode="false" HeaderText="<%$ resources: ContactAssociationsGrid_Date.HeaderText %>" />
      </Columns>
</SalesLogix:SlxGridView>
