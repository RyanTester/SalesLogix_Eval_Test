<%@ Control Language="C#" AutoEventWireup="true" CodeFile="AddMembers.ascx.cs" Inherits="SmartParts_Activity_AddMembers"  %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>

<div style="display:none">
<asp:Panel ID="LeftTools" runat="server" />
<asp:Panel ID="CenterTools" runat="server" />
<asp:Panel ID="RightTools" runat="server">
    <SalesLogix:PageLink ID="lnkAddMembersHelp" runat="server" LinkType="HelpFileName"
        ToolTip="<%$ resources: Portal, Help_ToolTip %>" Target="Help" NavigateUrl="addremoveactivitymembers.aspx"
        ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16">
    </SalesLogix:PageLink>
</asp:Panel>
</div>

<table style="width: 535px" class="formtable">
    <tr>
        <td><asp:Localize ID="AvailableMembersTitle" runat="server" Text="<%$ resources: AddMembers_AddMembersTitle.Text %>"></asp:Localize></td>
        <td>
        </td>
        <td><asp:Localize ID="CurrentlySelectedMembers" runat="server" Text="<%$ resources: AddMembers_CurrentlySelectedMembers.Text %>"></asp:Localize></td>
    </tr>
    <tr>
        <td style="width: 225px">
            <asp:ListBox ID="AvailableMembers" runat="server" Height="280px" Width="220px" SelectionMode="multiple" ></asp:ListBox></td>
        <td style="width: 85px">
            <asp:Button CssClass="slxbutton" ID="Add" runat="server" OnClick="Add_Click" Width="<%$ resources: AddMembers_AvailableMembers_Add.Width %>"  Text="<%$ resources: AddMembers_AvailableMembers_Add.Text %>"/>
            <asp:Button CssClass="slxbutton" ID="Remove" runat="server" OnClientClick="return CheckRemoveLeader();" OnClick="Remove_Click" Width="<%$ resources:  AddMembers_AvailableMembers_Remove.Width %>" Text="<%$ resources: AddMembers_AvailableMembers_Remove.Text %>" />
        </td>
        <td style="width:225px">
            <asp:ListBox ID="SelectedMembers" runat="server" Height="280px" Width="220px" SelectionMode="multiple"></asp:ListBox></td>
    </tr>
</table>

