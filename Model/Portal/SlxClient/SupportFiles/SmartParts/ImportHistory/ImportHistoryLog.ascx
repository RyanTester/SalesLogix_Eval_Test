<%@ Control Language="C#" AutoEventWireup="true" CodeFile="ImportHistoryLog.ascx.cs" Inherits="SmartParts_ImportHistory_ImportHistoryLog" %>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.Platform.WebPortal" Namespace="Sage.Platform.WebPortal.SmartParts" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>

<div style="display:none">
    <SalesLogix:SmartPartToolsContainer runat="server" ID="ImportHistory_RTools" ToolbarLocation="right">
        <SalesLogix:PageLink ID="lnkLeadImportDetailHelp" runat="server" LinkType="HelpFileName"
            ToolTip="<%$ resources: Portal, Help_ToolTip %>" Target="Help" NavigateUrl="leadimporthistoryhistorytab.aspx"
            ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16">
        </SalesLogix:PageLink>    
    </SalesLogix:SmartPartToolsContainer>
</div>
<SalesLogix:SlxGridView runat="server" ID="grdHistoryLog" GridLines="None" CellPadding="4" DataKeyNames="" AllowPaging="true"
    EnableViewState="false" ExpandableRows="true" CssClass="datagrid" PagerStyle-CssClass="gridPager" ResizableColumns="true"
    SelectedRowStyle-CssClass="rowSelected" AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt" PageSize="10"
    AutoGenerateColumns="false" ShowEmptyTable="true" EmptyTableRowText="<%$ resources: grdHistoryLog.EmptyTableRowText %>"
    OnPageIndexChanging="grdHistoryLog_OnPageIndexChanging" OnRowDataBound="grdHistoryLog_OnRowDataBound" >
    <Columns>
        <asp:TemplateField HeaderText="<%$ resources: grdHistoryLog.TimeStamp.ColumnHeading %>">
            <ItemTemplate>
             <SalesLogix:DateTimePicker runat="server" ID="dtpCreateDate" Enabled="true" DisplayTime="true" Timeless="false" DisplayMode="AsText" AutoPostBack="false" ></SalesLogix:DateTimePicker>
           </ItemTemplate>   
         </asp:TemplateField>
         <asp:TemplateField  HeaderText="<%$ resources: grdHistoryLog.Type.ColumnHeading %>">
          <itemtemplate>
              <asp:Label ID="lblItemType" runat="server"></asp:Label>
           </itemtemplate>
        </asp:TemplateField>
        <asp:BoundField DataField="Description" HeaderText="<%$ resources: grdHistoryLog.Description.ColumnHeading %>" />
        <asp:TemplateField  HeaderText="<%$ resources: grdHistoryLog.IsResolved.ColumnHeading %>" ItemStyle-HorizontalAlign="Center" ItemStyle-VerticalAlign="Top">
          <itemtemplate> <!-- added a top of -2 because the checkbox was below the row line in IE7 -->
              <asp:CheckBox ID="chkIsResolved" runat="server" style="position: relative; top: -2px;"></asp:CheckBox>
           </itemtemplate>
        </asp:TemplateField>
        <asp:TemplateField HeaderText="<%$ resources: grdHistoryLog.ResolvedDate.ColumnHeading %>">
            <ItemTemplate>
             <SalesLogix:DateTimePicker runat="server" ID="dtpResolvedDate" Enabled="true" DisplayTime="true" Timeless="false" DisplayMode="AsText" AutoPostBack="false" ></SalesLogix:DateTimePicker>
           </ItemTemplate>   
         </asp:TemplateField>
        
        <asp:TemplateField  HeaderText="">
          <itemtemplate>
              <asp:HyperLink ID="linkGotoResolved" runat="server" Target="_top" Width="40px"></asp:HyperLink>
           </itemtemplate>
        </asp:TemplateField>
         <asp:BoundField DataField="ResolveDescription" HeaderText="<%$ resources: grdHistoryLog.ResolvedDescription.ColumnHeading %>" />
    </Columns>
</SalesLogix:SlxGridView>    