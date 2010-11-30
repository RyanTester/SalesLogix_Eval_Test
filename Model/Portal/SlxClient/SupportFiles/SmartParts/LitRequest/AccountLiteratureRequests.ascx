<%@ control language="C#" autoeventwireup="true" CodeFile="AccountLiteratureRequests.ascx.cs" inherits="SmartParts_LitRequest_AccountLiteratureRequests" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.DependencyLookup" TagPrefix="SalesLogix" %>


<script runat="server">
protected void LiteratureRequests_changing(object sender, GridViewPageEventArgs e)
{
 LiteratureRequests.PageIndex = e.NewPageIndex;
 LiteratureRequests.DataBind();
}

</script>

<div style="display:none">
<asp:Panel ID="LitRequests_LTools" runat="server" meta:resourcekey="LitRequests_LToolsResource1"></asp:Panel>
<asp:Panel ID="LitRequests_CTools" runat="server" meta:resourcekey="LitRequests_CToolsResource1"></asp:Panel>
<asp:Panel ID="LitRequests_RTools" runat="server" meta:resourcekey="LitRequests_RToolsResource1">
    <asp:ImageButton runat="server" ID="btnAddLitRequest" ToolTip="Add new Literature Request" 
        ImageUrl="~\images\icons\plus_16X16.gif" meta:resourcekey="btnAddLitRequest_rsc" />
    <SalesLogix:PageLink ID="lnkLiteratureRequestTabHelp" runat="server" LinkType="HelpFileName"
        ToolTip="<%$ resources:Portal, Help_ToolTip %>" Target="Help" NavigateUrl="litrequesttab.aspx"
        ImageUrl="~/ImageResource.axd?scope=global&amp;type=Global_Images&amp;key=Help_16x16" meta:resourcekey="lnkLiteratureRequestTabHelpResource1"></SalesLogix:PageLink>
</asp:Panel>
</div>

    <SalesLogix:SlxGridView ID="LiteratureRequests" CssClass="datagrid" AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt" GridLines="None" 
        runat="server" AutoGenerateColumns="False" ForeColor="#333333" DataKeyNames="Id" CellPadding="4" ShowEmptyTable="True"
        AllowPaging="true" PageSize="5" OnPageIndexChanging="LiteratureRequests_changing"
        meta:resourcekey="EmptyRow_lz" EmptyTableRowText="No records match the selection criteria." CurrentSortDirection="Ascending" CurrentSortExpression="" ExpandableRows="True" ResizableColumns="True" RowSelect="True" ShowSortIcon="True" SortAscImageUrl="" SortDescImageUrl="" >
        <Columns>
            <asp:TemplateField   HeaderText="Request Date"  meta:resourcekey="AccountLiteratureRequests_27_rsc_1"   >
            <itemtemplate>
<SalesLogix:PageLink runat="server" EntityId='<%# Eval("Id") %>' LinkType="EntityAlias" Text='<%# String.Format("{0:d}", Eval("REQDATE")) %>' NavigateUrl="LitRequest" meta:resourcekey="PageLinkResource1"></SalesLogix:PageLink>

            
</itemtemplate></asp:TemplateField>
           <asp:BoundField DataField="CONTACTNAME" meta:resourcekey="ContactName_lz" HeaderText="Contact Name" ReadOnly="True" >
                <headerstyle width="150px" />
            </asp:BoundField>
            <asp:TemplateField HeaderText="Request User" meta:resourcekey="TemplateFieldResource1" >
            <itemtemplate>
<SalesLogix:SlxUserControl runat="server" LookupResultValue='<%# Eval("REQUSER") %>' AutoPostBack="False" DisplayMode="AsText" meta:resourcekey="SlxUserControlResource1">
<UserDialogStyle BackColor="ButtonFace"></UserDialogStyle>
</SalesLogix:SlxUserControl>

            
</itemtemplate></asp:TemplateField>
            <asp:BoundField DataField="DESCRIPTION" HeaderText="Description" ReadOnly="True" meta:resourcekey="BoundFieldResource1"/>
            <asp:BoundField DataField="SENDVIA" HeaderText="Send Via" ReadOnly="True" meta:resourcekey="BoundFieldResource2"/>
            <asp:BoundField DataField="PRIORITY" HeaderText="Priority" ReadOnly="True" meta:resourcekey="BoundFieldResource3"/>
        </Columns>
        <PagerSettings Mode="NumericFirstLast" FirstPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Start_16x16.gif" LastPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=End_16x16" />        
        <RowStyle CssClass="rowlt" />
        <AlternatingRowStyle CssClass="rowdk" />
    </SalesLogix:SlxGridView>
