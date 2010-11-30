<%@ Control language="c#" Inherits="Sage.SalesLogix.Client.GroupBuilder.ShareGroup" Codebehind="ShareGroup.ascx.cs" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>

<div style="display:none">
    <asp:Panel ID="Responses_RTools" runat="server">
        <SalesLogix:PageLink ID="LinkHelp" runat="server" LinkType="HelpFileName"
            ToolTip="<%$ resources:Portal, Help_ToolTip %>" Target="Help" NavigateUrl="sharegroup.aspx"
            ImageUrl="~/ImageResource.axd?scope=global&amp;type=Global_Images&amp;key=Help_16x16"></SalesLogix:PageLink>
    </asp:Panel>
</div>

<table cellpadding="0" cellspacing="0" class="tbodylt">
<tr>
	<td colspan="2">
	    <table cellpadding="2" cellspacing="0" class="theader">
			<tr>
			</tr>
		</table>
	</td>
</tr>
<tr>
	<td>
		<table cellpadding="3" cellspacing="0" class="fixed">
			<col width="310" />
			<col width="100%" />
			<tr>
				<td>
					<asp:listbox id="lbReleases" CssClass="dispnone"	runat="server" Width="304px" Height="200px"></asp:listbox>
					<select id="selReleases" multiple></select>
				</td>
				<td valign="top" align="left">
					<input id="btnAdd" class="btn" type="button" value='<asp:Localize ID="localizeAdd" runat="server" Text="<%$ resources: localizeAdd.Text %>" />' onclick="add_onclick();" /><br />
					<input id="btnRemove" class="btn" onclick="remove_onclick();" type="button" value='<asp:Localize ID="localizeRemove" runat="server" Text="<%$ resources: localizeRemove.Text %>" />' /> <br />
					<input id="btnEveryone"	class="btn" onclick="everyone_onclick();" type="button" value='<asp:Localize ID="localizeEveryone" runat="server" Text="<%$ resources: localizeEveryone.Text %>" />' />
				</td>
			</tr>
			<tr>
				<td class="pad">
				    <div class="W1">
				        <asp:Localize ID="localizeReleaseMessage" runat="server" Text="<%$ resources: localizeReleaseMessage.Text %>" />
			        </div>
			    </td>
			</tr>
			<tr>
				<td colspan="2" class="divline">&nbsp;</td>
			</tr>
			<tr>
				<td class="pad" colspan="2">
					<input id="btnOk" class="btn" onclick="ok_onclick();" type="button" value='<asp:Localize ID="localizeOk" runat="server" Text="<%$ resources: localizeOk.Text %>" />' /> 
					<input id="btnCancel" class="btn" onclick="window.close();" type="button" value='<asp:Localize ID="localizeCancel" runat="server" Text="<%$ resources: localizeCancel.Text %>" />' /> 
				</td>
			</tr>
		</table>
	</td>
</tr>
</table>
<asp:textbox id="txtGroupID" CssClass="dispnone" runat="server"></asp:textbox><asp:textbox id="txtEveryone" CssClass="dispnone" runat="server"></asp:textbox>

