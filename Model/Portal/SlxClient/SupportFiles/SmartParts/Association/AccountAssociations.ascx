<%@ Control Language="C#" AutoEventWireup="true" CodeFile="AccountAssociations.ascx.cs" Inherits="SmartParts_Association_AccountAssociations" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>

<div style="display:none">
 <asp:Panel ID="AccountAssociations_LTools" runat="server"></asp:Panel>
 <asp:Panel ID="AccountAssociations_CTools" runat="server"></asp:Panel>
 <asp:Panel ID="AccountAssociations_RTools" runat="server">
    <asp:ImageButton runat="server" ID="btnAddAssociation" ToolTip="Add Association" 
        ImageUrl="~\images\icons\plus_16X16.gif" meta:resourcekey="btnAdd" />
    <SalesLogix:PageLink ID="lnkAssociationChangeHelp" runat="server" LinkType="HelpFileName"
        ToolTip="<%$ resources: Portal, Help_ToolTip %>" Target="Help" NavigateUrl="associationstab.aspx"
        ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16">
    </SalesLogix:PageLink>
 </asp:Panel>
</div>


             <SalesLogix:SlxGridView runat="server" 
              ID="AccountAssociations_Grid" 
              GridLines="None"
              AutoGenerateColumns="False" 
              CellPadding="4" 
              CssClass="datagrid"
              AlternatingRowStyle-CssClass="rowdk" 
              RowStyle-CssClass="rowlt" 
              ShowEmptyTable="true"
              EmptyTableRowText="No records match the selection criteria." 
              meta:resourcekey="AccountAssocationsGrid_NoRecordFound"
              OnRowDataBound="AccountAssociations_Grid_RowDataBound"
              OnRowCommand="AccountAssociations_Grid_RowCommand" 
              OnRowEditing="AccountAssociations_Grid_RowEditing"
              OnRowDeleting="AccountAssociations_Grid_RowDeleting"
              DataKeyNames="Id"
              EnableViewState="false" 
              AllowPaging="true"
              PageSize="10"  
              >
                <Columns>
                     <asp:ButtonField CommandName="Edit" Text="Edit" meta:resourcekey="AccountAssociationsGrid_Edit" /> 
                     <asp:ButtonField CommandName="Delete" Text="Delete" meta:resourcekey="AccountAssociationsGrid_Delete" /> 
                     <asp:TemplateField   HeaderText="Account"  meta:resourcekey="AccountAssociationsGrid_Name"   >
                          <itemtemplate>
                              <SalesLogix:PageLink runat="server" NavigateUrl="Account"  EntityId='<%# Eval("AccountId") %>'   Text='<%# Eval("Account") %>'  LinkType="EntityAlias" ToolTip="Go to Account" meta:resourcekey="AccountAssociationsGrid_Link"></SalesLogix:PageLink>
                          </itemtemplate>
                      </asp:TemplateField>
                      <asp:BoundField DataField="Relation"    HeaderText="Relation"  meta:resourcekey="AccountAssociationsGrid_Relation"    />
                      <asp:BoundField DataField="Notes"    HeaderText="Notes"  meta:resourcekey="AccountAssociationsGrid_Notes" />
                      <asp:BoundField DataField="CreatedBy"    HeaderText="Created By"  meta:resourcekey="AccountAssociationsGrid_CreatedBy"    />
                      <asp:BoundField DataField="Date" DataFormatString="{0:d}" HtmlEncode="false"   HeaderText="Date"  meta:resourcekey="AccountAssociationsGrid_Date"    />
                  </Columns>
             </SalesLogix:SlxGridView>
