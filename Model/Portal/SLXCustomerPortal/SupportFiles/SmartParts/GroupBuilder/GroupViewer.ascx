<%@ Control Language="C#" AutoEventWireup="true"  Inherits="Sage.SalesLogix.Client.GroupBuilder.GroupViewer" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>

<div style="display:none">
<asp:Panel ID="pnlGroupViewer_LTools" runat="server">
</asp:Panel>
<asp:Panel ID="pnlGroupViewer_CTools" runat="server">
</asp:Panel>
<asp:Panel ID="pnlGroupViewer_RTools" runat="server">
<SalesLogix:PageLink ID="lnkGroupViewerHelp" runat="server" LinkType="HelpFileName" ToolTip="<%$ resources: Portal, Help_ToolTip %>" Target="Help" NavigateUrl="accountstandardlookup.aspx" ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16"></SalesLogix:PageLink></asp:Panel>
</div>

<SalesLogix:SlxGridView ID="GridViewGroup" runat="server" AutoGenerateColumns="False" GridLines="None" CssClass="datagrid" 
     AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt" ShowSortIcon="false" PagerStyle-CssClass="gridPager"
    AllowPaging="true" AllowSorting="true" PageSize="25" OnPageIndexChanging="GridViewGroup_PageIndexChanging" EmptyTableRowText="<%$ resources: GridViewGroup.EmptyTableRowText %>"
    OnSorting="GridViewGroup_Sorting" OnRowCreated="GridViewGroup_RowCreated" EnableViewState="false">
    <SelectedRowStyle BackColor="ActiveCaption" />
    <PagerSettings Mode="NumericFirstLast" FirstPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Start_16x16" LastPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=End_16x16" />
</SalesLogix:SlxGridView>
    
&nbsp;&nbsp;&nbsp;&nbsp;<br />
<asp:Label ID="lblGroupName" runat="server" Visible="false"><asp:Localize ID="localizeGroupName" runat="server" Text="<%$ resources: localizeGroupName.Text %>" /></asp:Label>
<input type="text" id="txtAdHocGroupName" runat="server" visible="false"/>&nbsp;
<input type="button" ID="btnSaveAdHoc" runat="server"  value="<%$ resources: localizeFinished.Text %>" visible="false" />
<input type="button" ID="btnCancelAdHoc" runat="server" onclick="CancelAdHocGroup();" value="<%$ resources: localizeCancel.Text %>" visible="false" />
<input type="hidden" id="hiddenMainTable" runat="server" />
<asp:ObjectDataSource ID="odsGroups" runat="server" SelectMethod="GetGroupDataTable" EnablePaging="true" SelectCountMethod="GetGroupCount" 
     TypeName="Sage.SalesLogix.Client.GroupBuilder.GroupInfo, Sage.SalesLogix.Client.GroupBuilder">
      <SelectParameters>
        <asp:Parameter Name="startRowIndex" Type="Int32" DefaultValue="1" />
        <asp:Parameter Name="maximumRows" Type="Int32" DefaultValue="25" />
    </SelectParameters>
</asp:ObjectDataSource>
