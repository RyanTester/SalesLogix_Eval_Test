<%@ Control language="c#" Inherits="Sage.SalesLogix.Client.GroupBuilder.addCalcField" Codebehind="addCalcField.ascx.cs" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" > 

<input type="hidden" name="calcFieldXML" value="" />
<table cellpadding="0" cellspacing="0" class="tbodylt">
	<tr>
		<td colspan="2">
			<table cellpadding="2" cellspacing="0" class="theader">
				<tr>
					<td class="header" colspan="3" align="left" ><label id="ADDCALCULATEDFIELD"><asp:Localize  runat="server" Text="<%$ resources: localizeAddCalcField.Text %>" /></label></td>							
					<td class="header" align="right">    
					    <SalesLogix:PageLink ID="AddCalcFieldHelpLink" runat="server" LinkType="HelpFileName" ToolTip="<%$ resources: Portal, Help_ToolTip %>" Target="Help" NavigateUrl="queryaddeditcalcfields.aspx" ImageUrl="~/images/icons/Help_16x16.gif"></SalesLogix:PageLink>
                    </td>
				</tr>
			</table>
		</td>
	</tr>
	<tr>
		<td valign="top">
			<div id="divTableTree">
			    <asp:TreeView ID="CalcFieldTreeView" runat="server" ExpandDepth="1"></asp:TreeView>
			</div>
		</td>
		<td valign="top" class="padd3">
			<input type="button" value='<asp:Localize runat="server" Text="<%$ resources: localizeOK.Text %>" />' id="btnOK" onclick="ok_click()" class="W1" /><br />
			<input type="button" value='<asp:Localize runat="server" Text="<%$ resources: localizeCancel.Text %>" />' id="btnCancel" onclick="window.close()" class="W1" /><br />
		</td>
	</tr>
	<tr>
		<td class="paddlt">
			<table cellpadding="0" cellspacing="0" width="500px">
				<tr>
					<td id="tabsimg0" style="background-image:url(images/groupbuilder/startcap.gif)" >&nbsp;</td>
					<td id="tabProp" class="tab" onclick="tabClick(0)"><asp:Localize ID="localizeProperties" runat="server" Text="<%$ resources: localizeProperties.Text %>" /></td>
					<td style="background-image:url(images/groupbuilder/centercap.gif)" >&nbsp;&nbsp;&nbsp;</td>
					<td id="tabCalc" class="tab" onclick="tabClick(1)"><asp:Localize ID="localizeCalculation" runat="server" Text="<%$ resources: localizeCalculation.Text %>" /></td>
					<td id="tabeimg4" style="background-image:url(images/groupbuilder/endcap.gif)">&nbsp;&nbsp;&nbsp;</td>
					<td class="W100">&nbsp;</td>
				</tr>
			</table>				
		</td>
	</tr>
	<tr>
		<td class="paddlb">
			<table cellpadding="0" cellspacing="0">
				<tr>
					<td id="tabcontents" colspan="12">
						<div id="tabpageProp" class="hiddentab">  <!-- Properties  -->
							<table cellpadding="4" cellspacing="4">
								<tr>
									<td><asp:Localize ID="localizeNameAlias" runat="server" Text="<%$ resources: localizeNameAlias.Text %>" /></td>
									<td>
										<input type="text" class="W2" id="txtName" />
										<input type="text" class="W2" id="txtAlias" />
									</td>
								</tr>
								<tr>
									<td><asp:Localize ID="localizeBaseTable" runat="server" Text="<%$ resources: localizeBaseTable.Text %>" /></td>
									<td>
										<asp:DropDownList Runat="server" AutoPostBack="True" ID="lstBaseTable" CssClass="W2"></asp:DropDownList>
									</td>
								</tr>
								<tr>
									<td><asp:Localize ID="localizeCalcType" runat="server" Text="<%$ resources: localizeCalcType.Text %>" /></td>
									<td>
										<select id="selCalcType" class="W2">
											<option value="S"><asp:Localize ID="localizeString" runat="server" Text="<%$ resources: localizeString.Text %>" /></option>
											<option value="N"><asp:Localize ID="localizeNumeric" runat="server" Text="<%$ resources: localizeNumeric.Text %>" /></option>
										</select>
									</td>
								</tr>
								<tr>
									<td><asp:Localize ID="localizeDescription" runat="server" Text="<%$ resources: localizeDescription.Text %>" /></td>
									<td>
										<input type="text" id="txtDescription" class="W3" />
									</td>
								</tr>
							</table>
						</div>
						<div id="tabpageCalc" class="hiddentab">  <!-- Calculations -->
							<table>
								<tr>
									<td>
										<button id="add" onclick="addCalc('+');">+</button>
										<button id="sub" onclick="addCalc('-');">-</button>
										<button id="mul" onclick="addCalc('*');">*</button>
										<button id="div" onclick="addCalc('/');">&divide;</button>
										&nbsp;
										<button id="lprns" onclick="addCalc('(');" class="smallertext">(</button>
										<button id="rprns" onclick="addCalc(')');" class="smallertext">)</button>
									</td>
								</tr>
								<tr>
									<td>
										<div contenteditable="true" id="dispText"></div>
									</td>
								</tr>
							</table>
						</div>
					</td>
				</tr>
			</table>
		</td>
	</tr>
</table>
	
