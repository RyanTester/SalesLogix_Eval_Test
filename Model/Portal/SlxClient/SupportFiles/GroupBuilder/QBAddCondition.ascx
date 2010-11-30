<%@ Control language="c#" Inherits="Sage.SalesLogix.Client.GroupBuilder.QBAddCondition" Codebehind="QBAddCondition.ascx.cs" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>

<input type="hidden" id="hidTable" value="" />
<input type="hidden" id="hidField" value="" />
<input type="hidden" id="hidRealPath" value="" />

<table cellpadding="2" cellspacing="0" class="tbodylt" style="width:345; height:245">
    <tr>
		<td><asp:Localize ID="localizeFieldName" runat="server" Text="<%$ resources: localizeFieldName.Text %>" /></td>
		<td class="borderr" align="left">
			<input type="text" id="txtFieldName_AddCondition" name="txtFieldName_AddCondition" style="width:150px" />
		</td>
	</tr>
	<tr>
		<td><asp:Localize ID="localizeFieldType" runat="server" Text="<%$ resources: localizeFieldType.Text %>" /></td>
		<td class="borderr" align="left">
			<input type="text"  id="txtFieldType" name="txtFieldType" style="width:150px">
		</td>
	</tr>
	<tr>
		<td><asp:Localize ID="localizeOperator" runat="server" Text="<%$ resources: localizeOperator.Text %>" /></td>
		<td class="borderr" align="left" id="operatorSpace">
		
		</td>
		<td align="center"></td>
	</tr>
	<tr>
		<td><asp:Localize ID="localizeValueIs" runat="server" Text="<%$ resources: localizeValueIs.Text %>" /></td>
		<td class="borderr" align="left">
			<!-- show this only if it is a Date/Time data type and operator is not "within last/next xxx days"  -->
			<div id="dateValueDiv" class="dispnone">
		    	<SalesLogix:DateTimePicker ID="DateValue" runat="server" DisplayTime="False" DateText="" DateFormat="MM/DD/YYYY"></SalesLogix:DateTimePicker>
			</div>
			<!-- show this for everything else  -->
			<div id="textValueDiv" style="display:inline">
				<input type="text" id="txtValueIs" name="txtValueIs" style="width:120px"/>
			</div>
		&nbsp;	
		<input type="button" ID="btnBrowse" value='<asp:Localize runat="server" Text="<%$ resources: localizeBrowse.Text %>" />' onclick="QBAddCondition_browseField()" />
		</td>
	</tr>				
	<tr>
		<td>&nbsp;</td>
		<td class="borderr" align="left">
			<input type="checkbox" name="chkCaseSensEdit" id="chkCaseSensEdit" checked />
			<label for="chkCaseSens"><asp:Localize ID="localizeCaseSens" runat="server" Text="<%$ resources: localizeCaseSens.Text %>" /></label>
		</td>
	</tr>
	<tr>
		<td>&nbsp;</td>
		<td class="borderr" align="left">
			<input type="checkbox" id="chkLiteral" name="chkLiteral" />
			<label for="chkLiteral"><asp:Localize ID="localizeUseAsLiteral" runat="server" Text="<%$ resources: localizeUseAsLiteral.Text %>" /></label>
		</td>
	</tr>
	<tr style="height:100px">
        <td align="center" valign="top" colspan="2">
            <input type="button" id="btnOK" onclick="QBAddCondition_OK_Click()" style="width:75px" value='<asp:Localize runat="server" Text="<%$ resources: localizeOK.Text %>" />' />&nbsp;
            <input type="button" id="btnCancel" onclick="QBAddCondition_Cancel_Click()" style="width:75px"  value='<asp:Localize runat="server" Text="<%$ resources: localizeCancel.Text %>" />' />
        </td>
    </tr>
</table>

<div id="conditionInfo" visible="false"></div>



