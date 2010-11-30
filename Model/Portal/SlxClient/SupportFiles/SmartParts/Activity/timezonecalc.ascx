<%@ Control language="c#" Inherits="timezonecalc" CodeFile="timezonecalc.ascx.cs"  %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>

<input type="hidden" id="year" name="year" />
<input type="hidden" id="month" name="month" />
<input type="hidden" id="day" name="day" />
<input type="hidden" id="hour" name="hour" />
<input type="hidden" id="min" name="min" />
<input type="hidden" id="timezone" name="timezone" />
<input type="hidden" id="localtimezone" name="localtimezone" runat="server" />
<input type="hidden" id="localbias" name="localbias" runat="server" />
<input type="hidden" id="localnodltbias" name="localnodltbias" runat="server" />

<div style="display:none">
<asp:Panel ID="TZCalc_LTools" runat="server">
</asp:Panel>
<asp:Panel ID="TZCalc_CTools" runat="server">
</asp:Panel>
<asp:Panel ID="TZCalc_RTools" runat="server">
    <SalesLogix:PageLink ID="AddMembersHelpLink" runat="server" LinkType="HelpFileName" ToolTip="<%$ resources: AddMembersHelpLink.ToolTip %>" Target="Help" NavigateUrl="timezonecalc.aspx" ImageUrl="~/images/icons/Help_16x16.gif"></SalesLogix:PageLink>
</asp:Panel>
</div>

<table cellpadding="0" cellspacing="0" style="height:320;" width="100%" class="tbodylt">
	<tr>
		<td id="leftside" class="pad" valign="top">
			<fieldset>
				<legend>
				    <label id="CURRENTTIMEZONE">
				        <asp:Localize ID="localizeCurrentTimeZone" runat="server" Text="<%$ resources: localizeCurrentTimeZone.Text %>" />
				     </label></legend>
				<table width="310" cellpadding="2" cellspacing="0">
					<tr>
						<td><label class="inactiveTextBox" id="lblLocalTimeZone" runat="server"></label></td>
					</tr>
					<tr>
						<td><input type="checkbox" id="chkCurrDltAdjust" checked runat="server" />
						    <label for="chkCurrDltAdjust" id="lblCurrDltAdjust" runat="server">
						        <asp:Localize ID="localizeDaylightSavings" runat="server" Text="<%$ resources: localizeDaylightSavings.Text %>" />
						    </label>
						</td>
					</tr>
					<tr>
						<td>
							<table>
								<tr>
									<td><label id="DATE"><asp:Localize ID="localizeDate" runat="server" Text="<%$ resources: localizeDate.Text %>" /></label></td>
									<td>
										<SalesLogix:DateTimePicker runat="server" ID="CurrDateValue" EnableViewState="true" Width="60px" AutoPostBack="true" />
										
									</td>
									<td>&nbsp;</td>
									<td>
								    </td>
								</tr>
							</table>
						</td>
					</tr>
				</table>
			</fieldset>
			<br />
			<fieldset>
				<legend><label id="COMPARISONTIMEZONE"><asp:Localize ID="localizeComparison" runat="server" Text="<%$ resources: localizeComparison.Text %>" /></label></legend>
				<table width="310" cellpadding="2" cellspacing="0" border="0">
					<tr>
						<td><asp:DropDownList Width="395px" runat="server" ID="CompTzSelect" AutoPostBack="true"></asp:DropDownList></td>
					</tr>
					<tr>
						<td><input type="checkbox" id="chkCompDltAdjust" checked runat="server" />
						    <label for="chkCompDltAdjust" id="lblCompDltAdjust" runat="server"><asp:Localize ID="localizeDaylightSavings2" runat="server" Text="<%$ resources: localizeDaylightSavings.Text %>" /></label>
						</td>
					</tr>
					<tr>
						<td>
							<table>
								<tr>
									<td><label id="DATE1"><asp:Localize ID="localizeDate2" runat="server" Text="<%$ resources: localizeDate.Text %>" /></label></td>
									<td>
										<SalesLogix:DateTimePicker runat="server" ID="CompDateValue" Width="60px" EnableViewState="true" AutoPostBack="true"/>
									</td>
									<td>&nbsp;</td>
									<td>
									</td>
								</tr>
							</table>
						</td>
					</tr>		
				</table>
			</fieldset>
			<br />
			<fieldset>
				<label id="dateTimeMessage" runat="server">-</label><br />
				<label id="currLongDateFmt" runat="server">-</label><br />
				<label id="currTZDispName" runat="server">-</label><br />
				<label id="currTZStdDltName" runat="server">-</label>
			</fieldset>	
			<asp:button CssClass="slxbutton" ID="UpdateActivity" runat="server" Text="<%$ resources: UpdateActivity.Text %>" OnClick="UpdateActivity_Click" /> 
			<input type="button" class="slxbutton" id="moreless" runat="server" onclick="moreless_click()" value="<%$ resources: jsMore %>" />
		</td>
		<td id="rightside" valign="top">
	        <div id="allTimeZoneList" runat="server" />
		</td>
	</tr>
</table>
<div class="dispnone" id="baseinformation" runat="server"></div>
