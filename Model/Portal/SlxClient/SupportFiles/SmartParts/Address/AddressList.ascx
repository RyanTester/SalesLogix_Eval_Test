<%@ Control Language="C#" AutoEventWireup="true" CodeFile="AddressList.ascx.cs" Inherits="SmartParts_AddressList" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>


<div style="display:none">
    <asp:Panel ID="Address_LTools" runat="server"></asp:Panel>
    <asp:Panel ID="Address_CTools" runat="server"></asp:Panel>
    <asp:Panel ID="Address_RTools" runat="server">
        <asp:ImageButton runat="server" ID="btnAdd" ToolTip="Add address" meta:resourcekey="btnAdd" 
            ImageUrl="~\images\icons\plus_16X16.gif"  />
        <SalesLogix:PageLink ID="lnkAddressHelp" runat="server" LinkType="HelpFileName"
            ToolTip="<%$ resources: Portal, Help_ToolTip %>" Target="Help" NavigateUrl="accountaddresschange.aspx"
            ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16">
        </SalesLogix:PageLink>
    </asp:Panel>
    <asp:HiddenField ID="ConfirmMessage" runat="server" meta:resourcekey="ConfirmMessage"/>
</div>


             <SalesLogix:SlxGridView runat="server" 
              ID="AddressGrid" 
              GridLines="None"
              AutoGenerateColumns="False" 
              CellPadding="4" 
              CssClass="datagrid"
              AlternatingRowStyle-CssClass="rowdk" 
              RowStyle-CssClass="rowlt" 
              ShowEmptyTable="True"
              EmptyTableRowText="No records match the selection criteria." 
              meta:resourcekey="AddressGrid_NoRecordFound"
              OnRowDataBound="AddressGrid_RowDataBound"
              OnRowCommand="AddressGrid_RowCommand" 
              OnRowEditing="AddressGrid_RowEditing"
              OnRowDeleting="AddressGrid_RowDeleting"
              OnSorting = "AddressGrid_Sorting"
              DataKeyNames="Id" 
              AllowSorting="True" 
              RowSelect="True" 
              SortAscImageUrl="" 
              SortDescImageUrl=""
              EnableViewState="false"
              AllowPaging="true"
              PageSize="10" 
              >
                <Columns>
                      <asp:ButtonField CommandName="Edit"  Text="Edit" meta:resourcekey="AddressGrid_Edit" /> 
                      <asp:ButtonField CommandName="Delete" Text="Delete"  meta:resourcekey="AddressGrid_Delete" />
                      <asp:TemplateField HeaderText="Primary" SortExpression="IsPrimary" meta:resourcekey="AddressGrid_Primary"><ItemTemplate><%# ConvertBoolean(Eval("IsPrimary")) %></ItemTemplate></asp:TemplateField>
                      <asp:TemplateField HeaderText="Shipping" SortExpression="IsMailing" meta:resourcekey="AddressGrid_Shipping"><ItemTemplate><%# ConvertBoolean(Eval("IsMailing")) %></ItemTemplate></asp:TemplateField>
                      <asp:BoundField DataField="Description"    HeaderText="Description" SortExpression="Description" meta:resourcekey="AddressGrid_Description" />
                      <asp:BoundField DataField="Salutation"    HeaderText="Attention"  SortExpression="Salutation" meta:resourcekey="AddressGrid_Attention" />
                      <asp:BoundField DataField="StreetAddress"    HeaderText="Address" SortExpression="Address1" meta:resourcekey="AddressGrid_Address1"    />
                      <asp:BoundField DataField="City"    HeaderText="City"  SortExpression="City" meta:resourcekey="AddressGrid_City" />
                      <asp:BoundField DataField="State"    HeaderText="State" SortExpression="State" meta:resourcekey="AddressGrid_State" />
                      <asp:BoundField DataField="PostalCode"    HeaderText="Postal"  SortExpression="PostalCode" meta:resourcekey="AddressGrid_PostalCode" />
                      <asp:BoundField DataField="Country"    HeaderText="Country"  SortExpression="Country" meta:resourcekey="AddressGrid_Country" />
                  </Columns>
                 <RowStyle CssClass="rowlt" />
                 <AlternatingRowStyle CssClass="rowdk" />
             </SalesLogix:SlxGridView>
        