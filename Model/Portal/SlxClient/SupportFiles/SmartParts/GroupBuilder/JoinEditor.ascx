<%@ Control language="c#" Inherits="Sage.SalesLogix.Client.GroupBuilder.JoinEditor" Codebehind="JoinEditor.ascx.cs" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>

<input type="hidden" id="joinid" name="joinid" value="" />
<table cellpadding="0" cellspacing="0" class="tbodylt">
	<tr>
		<td colspan="3">
			<table cellpadding="2" cellspacing="0" class="theader">
				<tr>
					<td class="header" colspan="3" align="left" ><label id="ADDGLOBALJOIN"><asp:Localize ID="localizeAddGlobalJoin" runat="server" Text="<%$ resources: localizeAddGlobalJoin.Text %>" /></label></td>							
					<td class="header" align="right">					    
					    <SalesLogix:PageLink ID="JoinHelpLink" runat="server" LinkType="HelpFileName" ToolTip="<%$ resources: Portal, Help_ToolTip %>" Target="Help" NavigateUrl="queryjointables.aspx" ImageUrl="~/images/icons/Help_16x16.gif"></SalesLogix:PageLink>
                    </td>
				</tr>
			</table>
		</td>
	</tr>
	<tr>
		<td class="padding">
			<fieldset>
				<legend><asp:Localize ID="localizeParentTableAndJoinField" runat="server" Text="<%$ resources: localizeParentTableAndJoinField.Text %>" /></legend>
				<select ID="parentTables" onchange="parentTableChanged()" class="W1"></select>
				<br>
				<select size="12" ID="parentFields" class="W1"></select>
			</fieldset>
		</td>
		<td class="padding">
			<fieldset>
				<legend><asp:Localize ID="localizeChildTableAndJoinField" runat="server" Text="<%$ resources: localizeChildTableAndJoinField.Text %>" /></legend>
				<select ID="childTables" onchange="childTableChanged()" class="W1"><option value=""></option></select>
				<br>	
				<select size="12" ID="childFields" class="W1"></select>
			</fieldset>
		</td>	
		<td valign="top" class="padding">
			<input type="button" id="btnOK" onclick="save()" class="W2" value='<asp:Localize runat="server" Text="<%$ resources: localizeOK.Text %>" />' /><br />
			<input type="button" id="btnCancel" onclick="window.close()" class="W2" value='<asp:Localize runat="server" Text="<%$ resources: localizeCancel.Text %>" />' /><br />
		</td>
	</tr>
	<tr>
		<td colspan="2" class="padding">
			<fieldset>
				<legend><asp:Localize ID="localizeJoinType" runat="server" Text="<%$ resources: localizeJoinType.Text %>" /></legend>
				<table>
					<tr>
						<td class="W2"><input type="radio" id="innerJoin" name="jointype" value="="><label for="innerJoin"><asp:Localize ID="localizeInner" runat="server" Text="<%$ resources: localizeInner.Text %>" /></label></td>
						<td><asp:Localize ID="localizeOnlyIncludeJoinFieldsEqual" runat="server" Text="<%$ resources: localizeOnlyIncludeJoinFieldsEqual.Text %>" /></td>
					</tr>
					<tr>
						<td><input type="radio" id="leftJoin" name="jointype" value=">" checked><label for="leftJoin"><asp:Localize ID="localizeLeft" runat="server" Text="<%$ resources: localizeLeft.Text %>" /></label></td>
						<td><asp:Localize ID="localizeIncludeAllRecordsFromChildTableWhere" runat="server" Text="<%$ resources: localizeIncludeAllRecordsFromChildTableWhere.Text %>" /></td>
					</tr>
					<tr>
						<td><input type="radio" id="rightJoin" name="jointype" value="<"><label for="rightJoin"><asp:Localize ID="localizeRight" runat="server" Text="<%$ resources: localizeRight.Text %>" /></label></td>
						<td><asp:Localize ID="localizeIncludeAllRecordsFromParentTableWhere" runat="server" Text="<%$ resources: localizeIncludeAllRecordsFromParentTableWhere.Text %>" /></td>
					</tr>
				</table>
			</fieldset>
		</td>
	</tr>
	<tr>
		<td colspan="2" class="padding" id="joinOptions">
			<fieldset>
				<legend><asp:Localize ID="localizeJoinOptions" runat="server" Text="<%$ resources: localizeJoinOptions.Text %>" /></legend>
				<table>
					<tr>
						<td class="W2"><asp:Localize ID="localizeVisibility" runat="server" Text="<%$ resources: localizeVisibility.Text %>" /></td>
						<td>
							<select id="visibility" name="visibility">
								<option value="T"><asp:Localize ID="localizeAlways" runat="server" Text="<%$ resources: localizeAlways.Text %>" /></option>
								<option value="F" selected><asp:Localize ID="localizeAllow" runat="server" Text="<%$ resources: localizeAllow.Text %>" /></option>
								<option value="N"><asp:Localize ID="localizeNever" runat="server" Text="<%$ resources: localizeNever.Text %>" /></option>
							</select>
						</td>
					</tr>
					<tr>
						<td><asp:Localize ID="localizeCascadeType" runat="server" Text="<%$ resources: localizeCascadeType.Text %>" /></td>
						<td>
							<select id="cascade" name="cascade">
								<option value="D"><asp:Localize ID="localizeDelete" runat="server" Text="<%$ resources: localizeDelete.Text %>" /></option>
								<option value="C"><asp:Localize ID="localizeClear" runat="server" Text="<%$ resources: localizeClear.Text %>" /></option>
								<option value="R"><asp:Localize ID="localizeReplace" runat="server" Text="<%$ resources: localizeReplace.Text %>" /></option>
								<option value="S"><asp:Localize ID="localizeStopCascade" runat="server" Text="<%$ resources: localizeStopCascade.Text %>" /></option>
								<option value="X" selected><asp:Localize ID="localizeDontCascade" runat="server" Text="<%$ resources: localizeDontCascade.Text %>" /></option>
							</select>
						</td>
					</tr>
				</table>
			</fieldset>
		</td>
	</tr>
</table>
