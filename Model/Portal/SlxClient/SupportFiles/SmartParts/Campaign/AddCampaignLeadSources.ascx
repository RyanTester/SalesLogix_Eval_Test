<%@ Control Language="C#" AutoEventWireup="true" CodeFile="AddCampaignLeadSources.ascx.cs" Inherits="AddCampaignLeadSource" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>

<div style="display:none">
    <asp:Panel ID="CampaignLeadSource_RTools" runat="server">
        <SalesLogix:PageLink ID="lnkCampaignLeadSourceHelp" runat="server" LinkType="HelpFileName"
            ToolTip="<%$ resources: Portal, Help_ToolTip %>" Target="Help" NavigateUrl="campaignaddleadsource.aspx"
            ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16">
        &nbsp;
        </SalesLogix:PageLink>
    </asp:Panel>
</div>

<table border="0" cellpadding="1" cellspacing="0" class="formtable">
    <col width="100%" />
    <tr>
        <td>
            <asp:Label runat="server" ID="lblFilterBy" AssociatedControlID="ddlCondition" Text="<%$ resources:FilterBy_rsc.Text %>" Font-Bold="True"></asp:Label>
            <asp:DropDownList ID="ddlCondition" runat="server">
                <asp:ListItem Text="<%$ resources: Type_Condition.Text %>" Value="Type"></asp:ListItem>
                <asp:ListItem Text="<%$ resources: Description_Condition.Text %>" Value="Description" Selected="True"></asp:ListItem>
                <asp:ListItem Text="<%$ resources: SourceCode_Condition.Text %>" Value="SourceCode"></asp:ListItem>
            </asp:DropDownList>
            <asp:DropDownList runat="server" ID="ddlFilterBy">
                <asp:ListItem Text="<%$ resources: StartingWith_rsc.Text %>" Value="Starting With"></asp:ListItem>
                <asp:ListItem Text="<%$ resources: Contains_rsc.Text %>" Value="Contains"></asp:ListItem>
                <asp:ListItem Text="<%$ resources: Equalto_rsc.Text %>" Value="Equal to"></asp:ListItem>
                <asp:ListItem Text="<%$ resources: NotEqualto_rsc.Text %>" Value="Not Equal to"></asp:ListItem>
                <asp:ListItem Text="<%$ resources: EqualorLessthan_rsc.Text %>" Value="Equal or Less than"></asp:ListItem>
                <asp:ListItem Text="<%$ resources: EqualorGreaterthan_rsc.Text %>" Value="Equal or Greater than"></asp:ListItem>
                <asp:ListItem Text="<%$ resources: Lessthan_rsc.Text %>" Value="Less than"></asp:ListItem>
                <asp:ListItem Text="<%$ resources: Greaterthan_rsc.Text %>" Value="Greater than"></asp:ListItem>
            </asp:DropDownList>
            <asp:TextBox runat="server" ID="txtLookupValue"></asp:TextBox>
            <asp:ImageButton runat="server" ID="imgFindButton" ImageUrl="~/images/icons/Find_16x16.gif" OnClick="imgFindButton_Click" />
        </td>
    </tr>
</table>
<hr />
<SalesLogix:SlxGridView runat="server" ID="grdCampaignLeadSource" AutoGenerateColumns="false" ShowEmptyTable="true" CssClass="datagrid"
    EmptyTableRowText="<%$ resources: grdCampaignLeadSource.EmptyTableRowText %>" DataKeyNames="Id" AlternatingRowStyle-CssClass="rowdk"
    EnableViewState="false" RowStyle-CssClass="rowlt" OnRowCommand="grdCampaignLeadSource_RowCommand" OnRowEditing="grdCampaignLeadSource_RowEditing">
    <Columns>
        <asp:ButtonField CommandName="Associate" Text="<%$ resources: Associate_rsc.HeaderText %>" />
        <asp:BoundField DataField="Description" HeaderText="<%$ resources: Description_rsc.HeaderText %>" />        
        <asp:BoundField DataField="Type" HeaderText="<%$ resources: Type_rsc.HeaderText %>" />
    </Columns>
</SalesLogix:SlxGridView>
