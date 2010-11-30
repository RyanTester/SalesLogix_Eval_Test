<%@ Control Language="C#" AutoEventWireup="true" CodeFile="MatchOptions.ascx.cs" Inherits="MatchOptions" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.Platform.WebPortal" Namespace="Sage.Platform.WebPortal.SmartParts" TagPrefix="SalesLogix" %>

<SalesLogix:SmartPartToolsContainer runat="server" ID="MatchOptions_RTools" ToolbarLocation="right">
    <SalesLogix:PageLink ID="lnkMatchOptionsHelp" runat="server" LinkType="HelpFileName" ToolTip="<%$ resources: Portal, Help_ToolTip %>" 
        Target="Help" NavigateUrl="leadimportadvancedmatch.aspx" ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16">
    </SalesLogix:PageLink>
</SalesLogix:SmartPartToolsContainer>
<asp:HiddenField runat="server" ID="IsDefaultsSet" Value="False" EnableViewState="true" />
<table runat="server" id="tblDupScores" border="0" cellpadding="1" cellspacing="0" class="formtable" visible="false">
    <col width="5%" /><col width="25%" /><col width="10%" /><col width="20%" /><col width="35%" />
    <tr>
        <td colspan="3">
            <span class="slxlabel">
                <asp:Label runat="server" ID="lblHeader" Text="<%$ resources: lblHeader.Caption %>"></asp:Label>
                <br />
            </span>
        </td>
    </tr>
    <tr>
        <td></td>
        <td>
            <span class="slxlabel">
                <asp:Label runat="server" ID="lblDuplicate" Text="<%$ resources: lblDuplicate.Caption %>"></asp:Label>
            </span>
        </td>
        <td>
            <asp:TextBox ID="txtDuplicate_Low" runat="server" Width="30px"></asp:TextBox>
        </td>
        <td>
            <span class="slxlabel">
                <asp:Label runat="server" ID="lblDuplicateTo" Text="<%$ resources: lblTo.Caption %>"></asp:Label>
            </span>
        </td>
        <td>
            <asp:Label ID="lblDuplicate_High" runat="server" Width="30px" Text="<%$ resources: lblHighValue.Caption %>"></asp:Label>
        </td>
    </tr>
    <tr>
        <td></td>
        <td>
            <span class="slxlabel">
                <asp:Label runat="server" ID="lblPossibleDuplicate" Text="<%$ resources: lblPossible.Caption %>"></asp:Label>
            </span>
        </td>
        <td>
            <asp:TextBox ID="txtPossibleDuplicate_Low" runat="server" Width="30px" MaxLength="2"></asp:TextBox>
        </td>
        <td>
            <span class="slxlabel">
                <asp:Label runat="server" ID="lblPossibleTo" Text="<%$ resources: lblTo.Caption %>"></asp:Label>
            </span>
        </td>
        <td>
            <asp:Label ID="lblPossibleDuplicate_High" runat="server" Width="30px"></asp:Label>
        </td>
    </tr>
    <tr>
        <td></td>
        <td>
            <span class="slxlabel">
                <asp:Label runat="server" ID="lblNoDuplicate" Text="<%$ resources: lblNoDuplicate.Caption %>"></asp:Label>
            </span>
        </td>
        <td>
            <asp:Label ID="lblNoDuplicate_Low" runat="server" Width="30px" Text="<%$ resources: lblLowValue.Caption %>"></asp:Label>
        </td>
        <td>
            <span class="slxlabel">
                <asp:Label runat="server" ID="lblNoDuplicateTo" Text="<%$ resources: lblTo.Caption %>"></asp:Label>
            </span>
        </td>
        <td>
            <asp:Label ID="lblNoDuplicate_High" runat="server" Width="30px"></asp:Label>
        </td>
    </tr>
</table>
<br />
<table border="0" cellpadding="1" cellspacing="0" class="formtable">
    <col width="5%" /><col width="30%" /><col width="65%" />
    <tr>
        <td colspan="3">
            <span>
                <asp:CheckBox runat="server" ID="chkUseStemming" Checked= "false" />
            </span>
            <span class="lblright">
                <asp:Label ID="lblUseStemming" AssociatedControlID="chkUseStemming" runat="server"
                    Text="<%$ resources: chkUseStemming.Caption %>">
                </asp:Label>
            </span>
        </td>
    </tr>
    <tr>
        <td colspan="3">
            <br />
            <span>
                <asp:CheckBox runat="server" ID="chkUsePhonic" Checked="false" />
            </span>
            <span class="lblright">
                <asp:Label ID="lblUsePhonic" AssociatedControlID="chkUsePhonic" runat="server"
                    Text="<%$ resources: chkUsePhonic.Caption %>">
                </asp:Label>
            </span>
        </td>
    </tr>
    <tr>
        <td colspan="3">
            <br />
            <span>
                <asp:CheckBox runat="server" ID="chkUseSynonym" Checked="false" />
            </span>
            <span class="lblright">
                <asp:Label ID="lblUseSynonym" AssociatedControlID="chkUseSynonym" runat="server"
                    Text="<%$ resources: chkUseSynonym.Caption %>">
                </asp:Label>
            </span>
        </td>
    </tr>
    <tr>
        <td colspan="3">
            <br />
            <span>
                <asp:CheckBox runat="server" ID="chkUseFuzzy" Checked="false" Text="" />
            </span>
            <span class="lblright">
                <asp:Label ID="lblUseFuzzy" AssociatedControlID="chkUseFuzzy" runat="server" Text="<%$ resources: chkUseFuzzy.Caption %>">
                </asp:Label>
            </span>
        </td>
    </tr>
    <tr>
        <td></td>
        <td>
            <span class="slxlabel">
                <asp:Label ID="lblFuzzyLevelNote1" runat="server" Text="*" ForeColor="Red"></asp:Label>
                <asp:Label runat="server" ID="lblFuzzyLevel" Text="<%$ resources: lblFuzzyLevel.Caption %>"></asp:Label>
            </span>
        </td>
        <td>
            <div class="textcontrol select">
                <asp:ListBox runat="server" ID="lbxFuzzyLevel" SelectionMode="Single" Width="50px" Rows="1" EnableViewState="true">
                    <asp:ListItem>1</asp:ListItem>
                    <asp:ListItem Selected="True">2</asp:ListItem>
                    <asp:ListItem>3</asp:ListItem>
                    <asp:ListItem>4</asp:ListItem>
                    <asp:ListItem>5</asp:ListItem>
                    <asp:ListItem>6</asp:ListItem>
                    <asp:ListItem>7</asp:ListItem>
                    <asp:ListItem>8</asp:ListItem>
                    <asp:ListItem>9</asp:ListItem>
                    <asp:ListItem>10</asp:ListItem>
                </asp:ListBox>
            </div>
        </td>
    </tr>
</table>
<table border="0" cellpadding="1" cellspacing="0" class="formtable">
    <col width="5%" /><col width="50%" /><col width="45%" />
    <tr>
        <td></td>
        <td>
            <span class="slxlabel">
                <asp:Label ID="lblFuzzyLevelNote2" runat="server" Text="*" ForeColor="Red"></asp:Label>
                <asp:Label runat="server" ID="txtFuzzyLevelNote" Text="<%$ resources: lblFuzzyLevelNote.Caption %>"></asp:Label>
            </span>
        </td>
        <td>
            <asp:Panel runat="server" ID="ctrlstOKCancel" CssClass="controlslist qfActionContainer">
                <asp:Button runat="server" ID="cmdOK" Text="<%$ resources: cmdOK.Caption %>" CssClass="slxbutton" OnClick="cmdOK_Click" Visible="false" />
                <asp:Button runat="server" ID="cmdCancel" Text="<%$ resources: cmdCancel.Caption %>" CssClass="slxbutton" OnClick="cmdCancel_Click" Visible="false" />
            </asp:Panel>
        </td>
    </tr>
</table>