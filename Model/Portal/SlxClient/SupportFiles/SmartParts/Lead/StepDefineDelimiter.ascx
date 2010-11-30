<%@ Control Language="C#" AutoEventWireup="true" CodeFile="StepDefineDelimiter.ascx.cs" Inherits="StepDefineDelimiter" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>

<table border="0" cellpadding="1" cellspacing="0" class="formtable">
    <col width="1%" /><col width="99%" />
    <tr>
        <td colspan="2">
            <span class="slxlabel">
                <asp:Label runat="server" ID="lblDelimiter"  Text="<%$ resources: lblDelimiter.Caption %>"></asp:Label>
                <br />
                <br />
            </span>
        </td>
    </tr>
    <tr>
        <td></td>
        <td>
            <span class="slxlabel">
                <asp:Label ID="rdgpDelimiter_lz" AssociatedControlID="rdbTab" runat="server"
                    Text="<%$ resources:rdgpDelimiter.Caption %>" BorderStyle="None">
                </asp:Label>
            </span>
        </td>        
    </tr>
    <tr>
        <td></td>
        <td>
            <asp:RadioButton ID="rdbTab" GroupName="rdgpDelimiter" Text="<%$ resources:rdgpDelimiter_Tab.Text %>" runat="server" AutoPostBack="true" />
            <asp:RadioButton ID="rdbSemiColon" GroupName="rdgpDelimiter" Text="<%$ resources:rdgpDelimiter_Semicolon.Text %>" runat="server" AutoPostBack="true" />
            <asp:RadioButton ID="rdbComma" GroupName="rdgpDelimiter" Text="<%$ resources:rdgpDelimiter_Comma.Text %>" Checked="true" runat="server" AutoPostBack="true" />
            <asp:RadioButton ID="rdbSpace" GroupName="rdgpDelimiter" Text="<%$ resources:rdgpDelimiter_Space.Text %>" runat="server" AutoPostBack="true" />
            <asp:RadioButton ID="rdbOther" GroupName="rdgpDelimiter" Text="<%$ resources:rdgpDelimiter_Other.Text %>" runat="server" AutoPostBack="true" />
            <asp:TextBox ID="txtOtherDelimiter" runat="server" MaxLength="1" AutoPostBack="true" Width="40px"
                OnTextChanged="txtOtherDelimiter_OnTextChanged" >
            </asp:TextBox>
        </td>
    </tr>
    <tr>
        <td></td>
        <td>
            <br />
            <span class="lbl" style="width:18%">
                <asp:Label ID="lbxQualifier_lz" AssociatedControlID="lbxQualifier" runat="server"
                    Text="<%$ resources: lbxQualifier.Caption %>" >
                </asp:Label>
            </span>
            <span>
                <asp:ListBox runat="server" ID="lbxQualifier" SelectionMode="Single" Rows="1" AutoPostBack="true" Width="80px"
                     OnSelectedIndexChanged="lbxQualifier_SelectedIndexChanged" >
                    <asp:ListItem Text="<%$ resources:lbxQualifier_Empty.Text %>" Value="\x000"></asp:ListItem>
                    <asp:ListItem Text="<%$ resources:lbxQualifier_DoubleQuote.Text %>" Value="&quot;" Selected="True"></asp:ListItem>
                    <asp:ListItem Text="<%$ resources:lbxQualifier_SingleQuote.Text %>" Value="'" ></asp:ListItem>
                    <asp:ListItem Text="<%$ resources:lbxQualifier_None.Text %>" Value="None"></asp:ListItem>
                </asp:ListBox>
            </span>
        </td>
    </tr>
    <tr>
        <td></td>
        <td>
            <br />
            <span>
                <asp:CheckBox runat="server" ID="chkFirstRow" Checked="true" Text="" OnCheckedChanged="chkFirstRow_CheckedChanged"
                    AutoPostBack="true" />
            </span>
            <span class="lblright">
                <asp:Label ID="chkFirstRow_lz" AssociatedControlID="chkFirstRow" runat="server"
                    Text="<%$ resources: chkFirstRow.Caption %>">
                </asp:Label>
            </span>
        </td>
    </tr>
    <tr>
        <td></td>
        <td>
            <SalesLogix:SlxGridView runat="server" ID="grdPreview" GridLines="None" AutoGenerateColumns="true" CellPadding="4" CssClass="datagrid"
                Caption="<%$ resources:lblGridPreview.Caption %>" PagerStyle-CssClass="gridPager" AlternatingRowStyle-CssClass="rowdk" EnableViewState="false"
                RowStyle-CssClass="rowlt" SelectedRowStyle-CssClass="rowSelected" ShowEmptyTable="true" Height="150px" Width="800px"
                ExpandableRows="true" ResizableColumns="true" EmptyTableRowText="<%$ resources: grdPreview.EmptyTableRowText %>" >
                <PagerStyle CssClass="gridPager" />
                <AlternatingRowStyle CssClass="rowdk" />
                <RowStyle CssClass="rowlt" />
                <SelectedRowStyle CssClass="rowSelected" />
            </SalesLogix:SlxGridView>
        </td>
    </tr>
</table>
<br />