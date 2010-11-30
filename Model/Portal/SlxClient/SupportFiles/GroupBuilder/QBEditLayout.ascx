<%@ Control language="c#" Inherits="Sage.SalesLogix.Client.GroupBuilder.QBEditLayout" Codebehind="QBEditLayout.ascx.cs" %>

<table cellpadding="0" cellspacing="0" class="tbodylt">
	<tr>
		<td>
			<table cellpadding="2" cellspacing="0" class="fixed">
				<col width="80">
				<col width="210">
				<col width="70">
				<tr>
					<td><asp:Localize ID="localizeFieldName" runat="server" Text="<%$ resources: localizeFieldName.Text %>" /></td>
					<td class="borderr">
						<input type="text" style="width:200" id="txtFieldName_EditLayout"> 
					<td align="center"><input type="button" id="btnOK" onclick="QBEditLayout_OK_Click()" style="width:60px" tabindex="25" value='<asp:Localize runat="server" Text="<%$ resources: localizeOK.Text %>" />' /></td>
				</tr>
				<tr>
					<td><asp:Localize ID="localizeCaption" runat="server" Text="<%$ resources: localizeCaption.Text %>" /></td>
					<td class="borderr">
						<input type="text" style="width:200" id="txtCaption"></td>
					<td align="center"><input type="button" id="btnCancel" onclick="QBEditLayout_Cancel_Click()" style="width:60px" tabindex="30" value='<asp:Localize runat="server" Text="<%$ resources: localizeCancel.Text %>" />' /></td>
				</tr>
				<tr>
					<td><asp:Localize ID="localizeVisible" runat="server" Text="<%$ resources: localizeVisible.Text %>" /></td>
					<td class="borderr">
						<input type="checkbox" id="chkVisible">
					</td>
					<td align="center"></td>
				</tr>
				<tr>
					<td><asp:Localize ID="localizeWidth" runat="server" Text="<%$ resources: localizeWidth.Text %>" /></td>
					<td class="borderr">
						<input type="text" id="txtWidth" name="txtWidth" style="width:110" onkeypress="forceNumInput()"/>
					</td>
				</tr>
				<tr>
					<td><asp:Localize ID="localizeCaptAlign" runat="server" Text="<%$ resources: localizeCaptAlign.Text %>" /></td>
					<td class="borderr">
						<select id="selCaptAlign" style="width:110">
							<option value="Left" selected><asp:Localize ID="localizeLeft" runat="server" Text="<%$ resources: localizeLeft.Text %>" /></option>
							<option value="Right"><asp:Localize ID="localizeRight" runat="server" Text="<%$ resources: localizeRight.Text %>" /></option>
							<option value="Center"><asp:Localize ID="localizeCenter" runat="server" Text="<%$ resources: localizeCenter.Text %>" /></option>
						</select>
					</td>
				</tr>
				<tr>
					<td><asp:Localize ID="localizeTextAlign" runat="server" Text="<%$ resources: localizeTextAlign.Text %>" /></td>
					<td class="borderr">
						<select id="selTextAlign" style="width:110">
							<option value="Left" selected><asp:Localize ID="localizeLeft2" runat="server" Text="<%$ resources: localizeLeft.Text %>" /></option>
							<option value="Right"><asp:Localize ID="localizeRight2" runat="server" Text="<%$ resources: localizeRight.Text %>" /></option>
							<option value="Center"><asp:Localize ID="localizeCenter2" runat="server" Text="<%$ resources: localizeCenter.Text %>" /></option>
						</select>
					</td>
				</tr>
				<tr>
					<td><asp:Localize ID="localizeFormatType" runat="server" Text="<%$ resources: localizeFormatType.Text %>" /></td>
					<td class="borderr">
						<select id="selFormatType" style="width:110">
							<option value="None" selected><asp:Localize ID="localizeNone" runat="server" Text="<%$ resources: localizeNone.Text %>" /></option>
							<option value="Fixed"><asp:Localize ID="localizeNumber" runat="server" Text="<%$ resources: localizeNumber.Text %>" /></option>
							<option value="Integer"><asp:Localize ID="localizeInteger" runat="server" Text="<%$ resources: localizeInteger.Text %>" /></option>
							<option value="DateTime"><asp:Localize ID="localizeDateTime" runat="server" Text="<%$ resources: localizeDateTime.Text %>" /></option>
							<option value="Percent"><asp:Localize ID="localizePercentage" runat="server" Text="<%$ resources: localizePercentage.Text %>" /></option>
							<option value="Currency"><asp:Localize ID="localizeCurrency" runat="server" Text="<%$ resources: localizeCurrency.Text %>" /></option>
							<option value="User"><asp:Localize ID="localizeUserName" runat="server" Text="<%$ resources: localizeUserName.Text %>" /></option>
							<option value="Phone"><asp:Localize ID="localizePhoneNumber" runat="server" Text="<%$ resources: localizePhoneNumber.Text %>" /></option>
							<option value="Owner"><asp:Localize ID="localizeOwner" runat="server" Text="<%$ resources: localizeOwner.Text %>" />Owner</option>
							<option value="Boolean"><asp:Localize ID="localizeBoolean" runat="server" Text="<%$ resources: localizeBoolean.Text %>" />Boolean</option>
							<option value="Positive Integer"><asp:Localize ID="localizePositiveInteger" runat="server" Text="<%$ resources: localizePositiveInteger.Text %>" /></option>
							<option value="PickList Item"><asp:Localize ID="localizePickListItem" runat="server" Text="<%$ resources: localizePickListItem.Text %>" /></option>
							<option value="Time Zone"><asp:Localize ID="localizeTimeZone" runat="server" Text="<%$ resources: localizeTimeZone.Text %>" />Time Zone</option>
						</select>
					</td>
				</tr>
				<tr>
					<td><asp:Localize ID="localizeFormat" runat="server" Text="<%$ resources: localizeFormat.Text %>" /></td>
					<td class="borderr">
						<input type="text" id="txtFormat" style="width:110">
					</td>
				</tr>
				<tr>
					<td><asp:Localize ID="localizeEntityLinked" runat="server" Text="<%$ resources: localizeEntityLinked.Text %>" /></td>
					<td class="borderr">
						<input type="checkbox" id="chkWebLink">
					</td>
					<td align="center"></td>
				</tr>
				<tr>
					<td><asp:Localize ID="localizeCSSClass" runat="server" Text="<%$ resources: localizeCSSClass.Text %>" /></td>
					<td class="borderr">
						<input type="text" id="txtCssClass" style="width:110">
					</td>
				</tr>
			</table>
		</td>
	</tr>
</table>
