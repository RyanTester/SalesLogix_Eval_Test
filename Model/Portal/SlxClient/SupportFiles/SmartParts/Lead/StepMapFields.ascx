<%@ Control Language="C#" AutoEventWireup="true" CodeFile="StepMapFields.ascx.cs" Inherits="StepMapFields" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>

<div id="Div1" style="display:none" runat="server">
    <input id="txtMatchToRowIndx" type="hidden" runat="server" />
    <input id="txtMatchFromRowIndx" type="hidden" runat="server" />
    <input id="txtMappingsRowIndx" type="hidden" runat="server" />
    <input id="txtImportFile" type="hidden" runat="server" />
    <input id="importProcessId" type="hidden" runat="server" />
</div>

<table border="0" cellpadding="1" cellspacing="0" class="formtable" style="width:100%">
    <col width="1%" /><col width="46%" /><col width="14%" /><col width="39%" />
    <tr>
        <td colspan="4">
            <span class="slxlabel">
                <asp:Label ID="lblHeader" runat="server" Text="<%$ resources:lblHeader.Caption %>" Width="650px"></asp:Label>
            </span>
            <br />
            <br />
            <br />
        </td>
    </tr>
    <tr>
        <td style="height: 62px"></td>
        <td align="left" style="height: 62px" >
            <span class="lbl">
                <asp:Label ID="lblTemplates" AssociatedControlID="cboTemplates" runat="server"
                    Text="<%$ resources: lblTemplates.Caption %>">
                </asp:Label>
            </span>
            <span class="textcontrol">
                <asp:ListBox runat="server" ID="cboTemplates" SelectionMode="Single" Rows="1" AutoPostBack="true" OnSelectedIndexChanged="cboTemplates_SelectedIndexChanged" >
                    <asp:ListItem Selected="true" Text="<%$ resources: cboTemplates.None.Item %>" Value="None"></asp:ListItem>
                </asp:ListBox>
            </span>
            <br />
        </td>
    </tr>
    <tr>
        <td></td>
        <td>
            <span class="slxlabel">
                <asp:Label ID="lblMatches" AssociatedControlID="lblMatches" runat="server" 
                    Text="<%$ resources: lblMatches.Caption %>">
                </asp:Label>
            </span>
        </td>
        <td></td>
        <td style="padding-bottom:0.5em">
            <span>
                <asp:CheckBox runat="server" ID="chkShowAllTargets" Text="<%$ resources: chkShowAllTargets.Caption %>"
                    TextAlign="right" OnCheckedChanged="chkShowAllTargets_CheckedChanged" AutoPostBack="true" />                                   
            </span>            
        </td>
    </tr>
    <tr>
        <td></td>
        <td>
            <SalesLogix:SlxGridView Height="200px" runat="server" ID="grdSource" GridLines="None" AutoGenerateColumns="false" CellPadding="4"
                DataKeyNames="FieldName,FieldIndex" CssClass="datagrid" PagerStyle-CssClass="gridPager" EnableViewState="false"
                AlternatingRowStyle-CssClass="rowdk" ExpandableRows="false" RowStyle-CssClass="rowlt" ResizableColumns="True"  
                SelectedRowStyle-CssClass="rowSelected" OnRowCreated="grdSource_RowCreated" ShowEmptyTable="true"
                EmptyTableRowText="<%$ resources: grdSource.EmptyTableRowText %>" >
                <Columns>
                    <asp:BoundField DataField="FieldIndex" HeaderText="<%$ resources: grdSource.ColumnNumber.ColumnHeading %>" />                
                    <asp:BoundField DataField="FieldName" HeaderText="<%$ resources: grdSource.ListField.ColumnHeading %>" />
                    <asp:BoundField DataField="SLXTargetProperty" HeaderText="<%$ resources: grdSource.SLXField.ColumnHeading %>" />
                </Columns>
            </SalesLogix:SlxGridView>
        </td>
        <td align="center">
            <br />
            <br />
            <br />
            <br />
            <asp:Button runat="server" ID="cmdMatch" Text="<%$ resources: cmdMatch.Caption %>" OnClick="cmdMatch_Click" CssClass="slxbutton" />
            <br />
            <br />
            <asp:Button runat="server" ID="cmdUnmatch" Text="<%$ resources: cmdUnmatch.Caption %>" OnClick="cmdUnmatch_Click" CssClass="slxbutton" />            
        </td>
        <td style="padding-right:20px;">
            <SalesLogix:SlxGridView Height="200px" runat="server" ID="grdTarget" GridLines="None" AutoGenerateColumns="false" CellPadding="4"
                CssClass="datagrid" PagerStyle-CssClass="gridPager" AlternatingRowStyle-CssClass="rowdk" ExpandableRows="false"
                RowStyle-CssClass="rowlt" SelectedRowStyle-CssClass="rowSelected" ResizableColumns="True" EnableViewState="false"
                DataKeyNames="PropertyId" OnRowCreated="grdTarget_RowCreated" ShowEmptyTable="true"
                EmptyTableRowText="<%$ resources: grdTarget.EmptyTableRowText %>" >
                <Columns>
                    <asp:BoundField DataField="FullDisplayName" HeaderText="<%$ resources: grdTarget.SLXField.ColumnHeading %>" />
                </Columns>
            </SalesLogix:SlxGridView>
        </td>
    </tr>
    <tr>
        <td>
            <br />
            <br />
        </td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td></td>
        <td colspan="3">
            
            <asp:Button runat="server" ID="cmdSave" OnClick="SaveTemplate_OnClick" Enabled="false" CssClass="slxbutton" 
                Text="<%$ resources: cmdSave.Caption %>" ToolTip="<%$ resources: cmdSave.ToolTip %>" />
            <asp:Button runat="server" ID="cmdSaveAs" OnClick="SaveAsTemplate_OnClick" Enabled="false" CssClass="slxbutton"
                Text="<%$ resources: cmdSaveAs.Caption %>" ToolTip="<%$ resources: cmdSaveAs.ToolTip %>" />
           
        </td>    
    </tr>
 </table>