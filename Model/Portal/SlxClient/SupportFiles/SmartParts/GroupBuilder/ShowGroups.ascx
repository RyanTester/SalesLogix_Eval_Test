<%@ Control language="c#" AutoEventWireup="true" Inherits="Sage.SalesLogix.Client.GroupBuilder.ShowGroups" Codebehind="ShowGroups.ascx.cs" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>

<table cellpadding="0" cellspacing="0" class="tbodylt">
	<tr>
	    <td colspan="2">
    		<table cellpadding="2" cellspacing="0" class="theader">
				<tr>
					<td class="header" align="left" style="height: 34px" >
					    <asp:Localize ID="localizeViewSQL" runat="server" Text="<%$ resources: localizeShowGroups.Text %>" />
					</td>
					<td class="header" align="right" style="height: 34px">
			            <SalesLogix:PageLink ID="ShowGroupsHelpLink" runat="server" LinkType="HelpFileName" ToolTip="<%$ resources: Portal, Help_ToolTip %>" Target="Help" NavigateUrl="showgroup.aspx" ImageUrl="~/images/icons/Help_16x16.gif"></SalesLogix:PageLink>
					</td>
				</tr>
			</table>
		</td>
	</tr>
	<tr>
		<td class="padding">
			<div id="groupsGrid" runat="server" >
			</div>
		</td>
		<td valign="top" class="padding">
            <asp:Button runat="server" ID="btnOk" Text="<%$ resources: btnOk.Text %>" ToolTip="<%$ resources: btnOk.ToolTip %>" OnClientClick="ShowGroups_save()" style="width:60px"  />
			<br />
		</td>
	</tr>
</table>

