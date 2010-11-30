<%@ Import Namespace="Sage.Entity.Interfaces"%>
<%@ Control Language="C#" ClassName="SmartParts_Opportunity_OpportunityProductEX" CodeFile="OpportunityProductEX.ascx.cs" Inherits="SmartParts_Opportunity_OpportunityProductEX" %>
<%@ Register Assembly="Sage.SalesLogix.Client.GroupBuilder" Namespace="Sage.SalesLogix.Client.GroupBuilder" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.PickList" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.DependencyLookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Lookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>

<div style="display:none">
    <asp:Panel ID="pnlOpportunityProducts_LTools" runat="server">
    </asp:Panel>
    <asp:Panel ID="pnlOpportunityProducts_CTools" runat="server">
    </asp:Panel>
    <asp:Panel ID="pnlOpportunityProducts_RTools" runat="server">
        <asp:ImageButton runat="server" ID="cmdAdd" AlternateText="<%$ resources: cmdAdd.Caption %>"  ToolTip="<%$ resources: cmdAdd.ToolTip %>"
            ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=plus_16x16" />
        <SalesLogix:PageLink ID="lnkOpportunityProductsHelp" runat="server" LinkType="HelpFileName" ToolTip="<%$ resources: Portal, Help_ToolTip %>"
            Target="Help" NavigateUrl="oppproductstab.aspx" ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16">
        </SalesLogix:PageLink>
    </asp:Panel>
</div>
<SalesLogix:SlxGridView runat="server" ID="grdProducts" GridLines="None" AutoGenerateColumns="false" CellPadding="4" CssClass="datagrid"
    AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt" SelectedRowStyle-CssClass="rowSelected" ShowEmptyTable="true" EnableViewState="false"
    EmptyTableRowText="<%$ resources: grdProducts.EmptyTableRowText %>" ExpandableRows="True" ResizableColumns="True" ShowSortIcon="true"
    OnRowCommand="grdProducts_RowCommand" DataKeyNames="InstanceId, Id" OnRowEditing="grdProducts_RowEditing" OnRowDeleting="grdProducts_RowDeleting" OnRowCreated="grdProducts_RowCreated" OnRowDataBound="grdProducts_RowDataBound"
    CurrentSortExpression="Sort" CurrentSortDirection="Ascending" OnSorting="grdProducts_Sorting" AllowSorting="true" >
    <Columns>
        <asp:BoundField DataField="Sort" HeaderText="<%$ resources: grdProducts.b0b2419f-997c-4069-8563-1e887e21350c.ColumnHeading %>" SortExpression="Sort"  />
        <asp:BoundField DataField="Product" HeaderText="<%$ resources: grdProducts.5497fe01-8a48-477d-a53e-e8f4e0582a97.ColumnHeading %>" SortExpression="Product.Name" />
        <asp:BoundField DataField="Product.Family" HeaderText="<%$ resources: grdProducts.2ef6d5e0-0151-4e42-9f55-be5d2f29e5bc.ColumnHeading %>" SortExpression="Product.Family"  />
        <asp:BoundField DataField="Program" HeaderText="<%$ resources: grdProducts.cbdffc35-205f-4823-be00-51c2e6814177.ColumnHeading %>" SortExpression="Program" />
        <asp:TemplateField HeaderText="<%$ resources: grdProducts.f2c5a5b4-9e12-4d17-bd9c-a0971a5b3f8b.ColumnHeading %>" ItemStyle-HorizontalAlign="Right" SortExpression="Price" >
            <ItemTemplate>
                <SalesLogix:Currency runat="server" ID="grdProductscol5" Text='<%# dtsProducts.getPropertyValue(Container.DataItem, "Price") %>' DisplayMode="AsText" ExchangeRateType="BaseRate"  />
            </ItemTemplate>
        </asp:TemplateField>
        <asp:BoundField DataField="Discount" DataFormatString="<%$ resources: grdProducts.a78eb82e-3072-4561-88c6-fcbb61b4dfca.FormatString %>" 
            HtmlEncode="false" HeaderText="<%$ resources: grdProducts.a78eb82e-3072-4561-88c6-fcbb61b4dfca.ColumnHeading %>" 
            SortExpression="Discount" ItemStyle-HorizontalAlign="Right" />
        <asp:TemplateField HeaderText="<%$ resources: grdProducts.AdjustedPrice.ColumnHeading %>" ItemStyle-HorizontalAlign="Right"
            SortExpression="AdjustedPrice" >
            <ItemTemplate>
                <SalesLogix:Currency runat="server" ID="grdProductscol7" Text='<%# dtsProducts.getPropertyValue(Container.DataItem, "CalculatedPrice") %>' DisplayMode="AsText" ExchangeRateType="BaseRate"/>
            </ItemTemplate>
        </asp:TemplateField>
        <asp:TemplateField HeaderText="<%$ resources: grdProducts.AdjustedPrice.ColumnHeading %>" ItemStyle-HorizontalAlign="Right"
            AccessibleHeaderText="MultiCurrencyDependent" SortExpression="CalculatedPrice" >
            <ItemTemplate>
                <SalesLogix:Currency runat="server" ID="grdProductscol8" DisplayMode="AsText" ExchangeRateType="OpportunityRate" ExchangeRate='<%# dtsProducts.getPropertyValue(Container.DataItem, "Opportunity.ExchangeRate") %>' CurrentCode='<%# dtsProducts.getPropertyValue(Container.DataItem, "Opportunity.ExchangeRateCode") %>'  Text='<%# dtsProducts.getPropertyValue(Container.DataItem, "CalculatedPrice") %>'  DisplayCurrencyCode="true" />
            </ItemTemplate>
        </asp:TemplateField>
        <asp:BoundField DataField="Quantity" HeaderText="<%$ resources: grdProducts.76587efc-d2d6-431d-97b4-dad570949772.ColumnHeading %>" SortExpression="Quantity" />
        <asp:TemplateField HeaderText="<%$ resources: grdProducts.11bbebf5-295b-40da-b53c-b29c70f99820.ColumnHeading %>" ItemStyle-HorizontalAlign="Right"
            SortExpression="ExtendedPrice" >
            <ItemTemplate>
                <SalesLogix:Currency runat="server" ID="grdProductscol10" Text='<%# dtsProducts.getPropertyValue(Container.DataItem, "ExtendedPrice") %>' DisplayMode="AsText" ExchangeRateType="OpportunityRate"  DisplayCurrencyCode="true" />
            </ItemTemplate>
        </asp:TemplateField>
        <asp:ButtonField CommandName="Edit" Text="<%$ resources: grdProducts.4348d5bc-66e6-416a-ab26-693e8d8e3c75.Text %>"/>
        <asp:ButtonField CommandName="Delete" Text="<%$ resources: grdProducts.15c63dca-f598-4d7f-ab8d-8dd2be881cf6.Text %>"/>
    </Columns>
</SalesLogix:SlxGridView>