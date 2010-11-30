<%@ Control language="c#" Inherits="Sage.SalesLogix.Client.GroupBuilder.viewSQL" Codebehind="viewSQL.ascx.cs" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" > 


<table cellpadding="0" cellspacing="0" class="tbodylt">
	<tr>
		<td colspan="2">
    		<table cellpadding="2" cellspacing="0" class="theader">
				<tr>
					<td class="header" align="left" style="height: 34px" >
					    <asp:Localize ID="localizeViewSQL" runat="server" Text="<%$ resources: localizeViewSQL.Text %>" />
					</td>
					<td class="header" align="right" style="height: 34px">
			            <SalesLogix:PageLink ID="ViewSqlHelpLink" runat="server" LinkType="HelpFileName" ToolTip="<%$ resources: Portal, Help_ToolTip %>" Target="Help" NavigateUrl="viewquerysql.aspx" ImageUrl="~/images/icons/Help_16x16.gif"></SalesLogix:PageLink>
					</td>
				</tr>
			</table>
		</td>
	</tr>
	<tr>
		<td class="pad">
			<textarea id="sqlDisp" name="sqlDisp" onkeypress="return false"></textarea>
		</td>
		<td valign="top" class="pad">
			<input type="button" value='<asp:Localize runat="server" Text="<%$ resources: localizeClose.Text %>" />' id="btnClose" onclick="window.close()" /><br />
		</td>
	</tr>
</table>
	