<%@ Control Language="C#" AutoEventWireup="true" CodeFile="AddResources.ascx.cs" Inherits="SmartParts_Activity_AddResources" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>

<div style="display:none">
<asp:Panel ID="LeftTools" runat="server" />
<asp:Panel ID="CenterTools" runat="server" />
<asp:Panel ID="RightTools" runat="server">
    <SalesLogix:PageLink ID="AddMembersHelpLink" runat="server" LinkType="HelpFileName" ToolTip="<%$ resources: AddMembersHelpLink.ToolTip %>" Target="Help" NavigateUrl="addremoveactivityresources.aspx" ImageUrl="~/images/icons/Help_16x16.gif"></SalesLogix:PageLink>
</asp:Panel>
</div>

<table style="width: 540px" class="formtable">
    <tr>
        <td><asp:Localize ID="AvailableResourcesCaption" runat="server" Text="<%$ resources: AddResources_AvailableResources.Text %>"></asp:Localize></td>
        <td></td>
        <td><asp:Localize ID="SelectedResourcesCaption" runat="server" Text="<%$ resources: AddResources_SelectedResources.Text %>"></asp:Localize></td>
    </tr>
    <tr>
        <td style="width: 225px">
            <asp:ListBox ID="AvailableResources" runat="server" Height="280px" Width="220px" SelectionMode="multiple" ></asp:ListBox></td>
        <td style="width: 85px">
             <asp:Button CssClass="slxbutton" ID="Add" runat="server" Text="<%$ resources: AddResources_AvailableMembers_Add.Text %>" OnClick="Add_Click" Width="<%$ resources: AddResources_AvailableMembers_Add.Width %>"/>
            <asp:Button CssClass="slxbutton" ID="Remove" runat="server" Text="<%$ resources: AddResources_AvailableMembers_Remove.Text %>" OnClick="Remove_Click" Width="<%$ resources: AddResources_AvailableMembers_Remove.Width %>" />
        </td>
        <td style="width: 225px">
            <asp:ListBox ID="SelectedResources" runat="server" Height="280px" Width="220px" SelectionMode="multiple"></asp:ListBox></td>
    </tr>
 </table>