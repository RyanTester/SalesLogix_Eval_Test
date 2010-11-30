<%@ Control language="c#" Inherits="Sage.SalesLogix.Client.GroupBuilder.OwnerAssign" Codebehind="OwnerAssign.aspx.cs" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >

<asp:textbox id="txtXml" CssClass="hiddentab" runat="server" Visible="true"></asp:textbox>
<table cellpadding="0" cellspacing="0" class="tbodylt">
	<tr>
		<td colspan="2">
		</td>
	</tr>
	<tr>
		<td class="padtop">
			<table cellSpacing="0" cellPadding="0" width="250">
				<tr>
					<td id="Td1" style="background-image:url(images/groupbuilder/startcap.gif)" >&nbsp;</td>
					<td id="tabUser" class="tab" onclick="tabClick(0)"><asp:Localize ID="localizeUsers" runat="server" Text="<%$ resources: localizeUsers.Text %>" /></td>
					<td id="Td2" style="background-image:url(images/groupbuilder/endcap.gif)" >&nbsp;</td>
					<td id="tabsimg3" style="background-image:url(images/groupbuilder/startcap.gif)" >&nbsp;</td>
					<td id="tabDep" class="tab" onclick="tabClick(1)"><asp:Localize ID="localizeDepartments" runat="server" Text="<%$ resources: localizeDepartments.Text %>" /></td>
					<td id="tabeimg3" style="background-image:url(images/groupbuilder/endcap.gif)" >&nbsp;</td>
					<td id="tabsimg4" style="background-image:url(images/groupbuilder/startcap.gif)" >&nbsp;</td>
					<td id="tabTeam" class="tab" onclick="tabClick(2)"><asp:Localize ID="localizeTeams" runat="server" Text="<%$ resources: localizeTeams.Text %>" /></td>
					<td id="tabeimg4" style="background-image:url(images/groupbuilder/endcap.gif)">&nbsp;&nbsp;&nbsp;</td>
					<td class="W100">&nbsp;</td>
				</tr>
			</table>
		</td>
		<td rowSpan="2" valign="top" class="padtop">
		    <input onclick="ok_onclick();" type="button" value="<%= localOk %>" class="btn" /><br>
			<input onclick="window.close();" type="button" value="<%= localCancel %>" class="btn" /><br>
		</td>
	</tr>
	<tr>
		<td id="padleftbottom">
			<table cellpadding="0" cellspacing="0">
				<tr>
					<td id="tabcontainer">
						<div id="tabpageUser">
							<p><asp:Localize ID="localizeUserType" runat="server" Text="<%$ resources: localizeUserType.Text %>" />
								<select id="userType" onchange="userType_onchange();">
									<option value="NMTVC" selected><asp:Localize ID="localizeAll" runat="server" Text="<%$ resources: localizeAll.Text %>" /></option>
									<option value="C"><asp:Localize ID="localizeConcurrent" runat="server" Text="<%$ resources: localizeConcurrent.Text %>" /></option>
									<option value="N"><asp:Localize ID="localizeNetwork" runat="server" Text="<%$ resources: localizeNetwork.Text %>" /></option>
									<option value="M"><asp:Localize ID="localizeRemote" runat="server" Text="<%$ resources: localizeRemote.Text %>" /></option>
									<option value="T"><asp:Localize ID="localizeWebClient" runat="server" Text="<%$ resources: localizeWebClient.Text %>" /></option>
									<option value="V"><asp:Localize ID="localizeWebViewer" runat="server" Text="<%$ resources: localizeWebViewer.Text %>" /></option>
								</select></p>
							<select id="selUsers" multiple class="W1">
							</select>
						</div>
						<div id="tabpageDep" class="hiddentab">
							<p>&nbsp;</p>
							<select id="selDepartments" multiple class="W1">
							</select>
						</div>
						<div id="tabpageTeam" class="hiddentab">
							<p><input type="checkbox" name="myteams" id="myteams" onclick="myteams_onclick();"><label id="lblMYTEAMS" for="myteams"><asp:Localize ID="localizeMyTeams" runat="server" Text="<%$ resources: localizeMyTeams.Text %>" /></label>&nbsp;</p>
							<select id="selTeams" multiple class="W1"></select>
						</div>
					</td>
				</tr>
			</table>
		</td>
	</tr>
</table>

