<%@ Control Language="C#" AutoEventWireup="true" CodeFile="CampaignTargetCreateGroup.ascx.cs" Inherits="CampaignTargetCreateGroup" %>
<%@ Register Assembly="Sage.SalesLogix.Client.GroupBuilder" Namespace="Sage.SalesLogix.Client.GroupBuilder" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.PickList" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.DependencyLookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Lookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.Platform.WebPortal" Namespace="Sage.Platform.WebPortal.SmartParts" TagPrefix="SalesLogix" %>

<SalesLogix:SmartPartToolsContainer runat="server" ID="CampaignTargets_RTools" ToolbarLocation="right">
    <SalesLogix:PageLink ID="lnkHelp" runat="server" LinkType="HelpFileName" ToolTip="<%$ resources: Portal, Help_ToolTip %>"
        Target="Help" NavigateUrl="campaigntargetgroup.aspx" ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16">
    </SalesLogix:PageLink>
</SalesLogix:SmartPartToolsContainer>

<table border="0" cellpadding="1" cellspacing="0" class="formtable">
    <col width="40%" />
    <col width="60%" />
    <tr>
        <td>
            <asp:Label runat="server" ID="lblGroupType" Text="<%$ resources: lblGroupType.Caption %>"></asp:Label>
        </td>
        <td>
            <div class="textcontrol select">
                <asp:ListBox runat="server" ID="lbxGroupType" SelectionMode="Single" Rows="1" >
                    <asp:ListItem Selected="true" Text="<%$ resources: lbxGroupType_Contact.Text %>"
                        Value="<%$ resources: lbxGroupType_Contact.Value %>" />
                    <asp:ListItem Text="<%$ resources: lbxGroupType_Lead.Text %>"
                        Value="<%$ resources: lbxGroupType_Lead.Value %>" />
                </asp:ListBox>
            </div>
        </td>
    </tr>
    <tr>
    <td>
        <asp:Label runat="server" ID="lblGroupName" Text="<%$ resources: lblGroupName.Caption %>"></asp:Label>
    </td>
        <td>
            <div class="textcontrol">
                <asp:TextBox runat="server" ID="txtGroupName" />
            </div>
        </td>
    </tr>
    <tr>
        <td>
            <asp:Label runat="server" ID="lblGroupMembers" Text="<%$ resources: lblGroupMembers.Caption %>"></asp:Label>
        </td>
        <td>
            <fieldset class="slxlabel radio"  style="width: 80%;" >
                <asp:RadioButtonList runat="server" ID="rdgGroupMembers" RepeatDirection="Vertical" >
                    <asp:ListItem Text="<%$ resources: rdgGroupMembers_AllTargets.Text %>" Selected="True"
                        Value="<%$ resources: rdgGroupMembers_AllTargets.Value %>" />
                    <asp:ListItem Text="<%$ resources: rdgGroupMembers_SelectedTargets.Text %>"
                        Value="<%$ resources: rdgGroupMembers_SelectedTargets.Value %>" />
                </asp:RadioButtonList>
            </fieldset>
        </td>
    </tr>
    <tr>
        <td colspan="2">
            <hr />
        </td>
    </tr>
    <tr>
        <td></td>
        <td>
            <asp:Panel runat="server" ID="ctrlstButtons" CssClass="controlslist qfActionContainer">
                <asp:Button runat="server" ID="cmdOK" OnClick="cmdOK_OnClick" Text="<%$ resources: cmdOK.Caption %>" CssClass="slxbutton" />
                <asp:Button runat="server" ID="cmdCancel" Text="<%$ resources: cmdCancel.Caption %>" CssClass="slxbutton" OnClick="cmdCancel_OnClick" />
            </asp:Panel>
        </td>
    </tr>
</table>