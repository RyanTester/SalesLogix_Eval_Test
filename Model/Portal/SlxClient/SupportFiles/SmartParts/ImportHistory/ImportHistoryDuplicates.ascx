<%@ Control Language="C#" AutoEventWireup="true" CodeFile="ImportHistoryDuplicates.ascx.cs" Inherits="ImportHistoryDuplicates" %>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.Platform.WebPortal" Namespace="Sage.Platform.WebPortal.SmartParts" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>


<div style="display:none">
    <SalesLogix:SmartPartToolsContainer runat="server" ID="ImportHistory_RTools" ToolbarLocation="right">
        <SalesLogix:PageLink ID="lnkLeadImportDetailHelp" runat="server" LinkType="HelpFileName"
            ToolTip="<%$ resources: Portal, Help_ToolTip %>" Target="Help" NavigateUrl="leadimporthistorydupetab.aspx"
            ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16">
        </SalesLogix:PageLink>
    </SalesLogix:SmartPartToolsContainer>
</div>

<SalesLogix:SlxGridView runat="server" ID="grdDuplicates" GridLines="None" AutoGenerateColumns="true" CellPadding="4" CssClass="datagrid" 
    DataKeyNames="Id" ShowEmptyTable="true" PagerStyle-CssClass="gridPager" AlternatingRowStyle-CssClass="rowdk" AllowPaging="true"
    PageSize="15" RowStyle-CssClass="rowlt" SelectedRowStyle-CssClass="rowSelected" EnableViewState="false" ExpandableRows="true" 
    ResizableColumns="true" Width="100%" OnRowEditing="grdDuplicates_OnRowEditing" OnRowCommand="grdDuplicates_OnRowCommand" 
    EmptyTableRowText="<%$ resources: grdDuplicates.EmptyTableRowText %>" OnPageIndexChanging="grdDuplicates_OnPageIndexChanging" 
    OnRowDataBound="grdDuplicates_OnRowDataBound">
    <Columns>
        <asp:ButtonField CommandName="Resolve" Text="<%$ resources: grdDuplicates.Resolve.ColumnHeading %>" ControlStyle-Width="50px"/> 
    </Columns>
</SalesLogix:SlxGridView>