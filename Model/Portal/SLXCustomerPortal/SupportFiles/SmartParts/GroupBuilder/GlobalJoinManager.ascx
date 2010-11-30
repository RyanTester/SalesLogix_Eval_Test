<%@ Control language="c#"  Inherits="Sage.SalesLogix.Client.GroupBuilder.GlobalJoinManager" Codebehind="GlobalJoinManager.ascx.cs" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>

<input type="hidden" id="joinid" name="joinid" value="" />
<input type="hidden" id="newJoinXML" name="newJoinXML" value="" />
<input type="hidden" id="saveType" name="saveType" value="" />
<table cellpadding="0" cellspacing="0" class="tbodylt">
	<tr>
		<td colspan="2">
			<table cellpadding="2" cellspacing="0" class="theader">
				<tr>
					<td class="header" colspan="3" align="left" ><asp:Localize ID="localizeGlobalJoinManager" runat="server" Text="<%$ resources: localizeGlobalJoinManager.Text %>" /></td>							
					<td class="header" align="right">					    
					    <SalesLogix:PageLink ID="JoinHelpLink" runat="server" LinkType="HelpFileName" ToolTip="<%$ resources: Portal, Help_ToolTip %>" Target="Help" NavigateUrl="queryglobaljoinmanager.aspx" ImageUrl="~/images/icons/Help_16x16.gif"></SalesLogix:PageLink></td>
				</tr>
			</table>
		</td>
	</tr>
	<tr>
		<td class="padding">
			<div id="joinGrid" runat="server" >
			</div>
		</td>
		<td valign="top" class="padding">
			<input type="button" value='<asp:Localize runat="server" Text="<%$ resources: localizeClose.Text %>" />' id="btnClose" onclick="GlobalJoinManager_closeWin()" /><br />
			<br />
			<input type="button" value='<asp:Localize runat="server" Text="<%$ resources: localizeAdd.Text %>" />'  id="bthAdd" onclick="GlobalJoinManager_addItem()" /><br />
			<input type="button" value='<asp:Localize runat="server" Text="<%$ resources: localizeEdit.Text %>" />' id="btnEdit" onclick="GlobalJoinManager_editItem()" /><br />
			<input type="button" value='<asp:Localize runat="server" Text="<%$ resources: localizeDelete.Text %>" />' id="btnDelete" onclick="GlobalJoinManager_deleteItem()" />
		</td>
	</tr>
</table>

