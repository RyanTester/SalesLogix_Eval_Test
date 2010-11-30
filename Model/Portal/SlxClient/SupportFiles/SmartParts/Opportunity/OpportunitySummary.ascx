<%@ Control Language="C#" AutoEventWireup="true" CodeFile="OpportunitySummary.ascx.cs" Inherits="SmartParts_OpportunitySummary" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>

<div style="display:none">
    <asp:Panel ID="OppSummary_RTools" runat="server">
        <SalesLogix:PageLink ID="lnkOppSummaryHelp" runat="server" LinkType="HelpFileName"
            ToolTip="<%$ resources: Portal, Help_ToolTip %>" Target="Help" NavigateUrl="oppsummarytab.aspx"
            ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16">
        </SalesLogix:PageLink>
    </asp:Panel>
</div>

<table border="0" cellpadding="0" cellspacing="2" class="formtable">
<col width="25%" /><col width="15%" /><col width="15%" /><col width="45%" />
<tr>
    <td>
    </td>
    <td>
        <asp:Label runat="server" Text="Date" ID="lblDate" meta:resourceKey="lblDate_rsc"></asp:Label>
    </td>
    <td>
        <asp:Label runat="server" Text="User" ID="lblUser" meta:resourceKey="lblUser_rsc"></asp:Label>
    </td>
    <td>
        <asp:Label runat="server" Text="Regarding" ID="lblRegarding" meta:resourceKey="lblRegarding_rsc"></asp:Label>
    </td>
</tr>
<tr>
    <td>
        <asp:Label runat="server" Text="Last Call:" ID="lblLastCall" meta:resourceKey="lblLastCall_rsc"></asp:Label>
    </td>
    <td>
        <asp:TextBox runat="server" ID="LastCallDate" ReadOnly="true"></asp:TextBox>
    </td>
    <td>
        <asp:TextBox runat="server" ID="LastCallUser" Width="98%" ReadOnly="true"></asp:TextBox>
    </td>
    <td>
        <asp:TextBox runat="server" ID="LastCallRegarding" Width="95%" ReadOnly="true"></asp:TextBox>
    </td>
</tr>
<tr>
    <td>
        <asp:Label runat="server" Text="Next Call:" ID="lblNextCall" meta:resourceKey="lblNextCall_rsc"></asp:Label>
    </td>
    <td>
        <asp:TextBox runat="server" ID="NextCallDate" ReadOnly="true"></asp:TextBox>
    </td>
    <td>
        <asp:TextBox runat="server" ID="NextCallUser" Width="98%" ReadOnly="true"></asp:TextBox>
    </td>
    <td>
        <asp:TextBox runat="server" ID="NextCallRegarding" Width="95%" ReadOnly="true"></asp:TextBox>
    </td>
</tr>
<tr>
    <td>
        <asp:Label runat="server" Text="Last Meet:" ID="lblLastMeet" meta:resourceKey="lblLastMeet_rsc"></asp:Label>
    </td>
    <td>
        <asp:TextBox runat="server" ID="LastMeetDate" ReadOnly="true"></asp:TextBox>
    </td>
    <td>
        <asp:TextBox runat="server" ID="LastMeetUser" Width="98%" ReadOnly="true"></asp:TextBox>
    </td>
    <td>
        <asp:TextBox runat="server" ID="LastMeetRegarding" Width="95%" ReadOnly="true"></asp:TextBox>
    </td>
</tr>
<tr>
    <td>
        <asp:Label runat="server" Text="Next Meet:" ID="lblNextMeet" meta:resourceKey="lblNextMeet_rsc"></asp:Label>
    </td>
    <td>
        <asp:TextBox runat="server" ID="NextMeetDate" ReadOnly="true"></asp:TextBox>
    </td>
    <td>
        <asp:TextBox runat="server" ID="NextMeetUser" Width="98%" ReadOnly="true"></asp:TextBox>
    </td>
    <td>
        <asp:TextBox runat="server" ID="NextMeetRegarding" Width="95%" ReadOnly="true"></asp:TextBox>
    </td>
</tr>
<tr>
    <td>
        <asp:Label runat="server" Text="Last To Do:" ID="lblLastToDo" meta:resourceKey="lblLastToDo_rsc"></asp:Label>
    </td>
    <td>
        <asp:TextBox runat="server" ID="LastToDoDate" ReadOnly="true"></asp:TextBox>
    </td>
    <td>
        <asp:TextBox runat="server" ID="LastToDoUser" Width="98%" ReadOnly="true"></asp:TextBox>
    </td>
    <td>
        <asp:TextBox runat="server" ID="LastToDoRegarding" Width="95%" ReadOnly="true"></asp:TextBox>
    </td>
</tr>
<tr>
    <td>
        <asp:Label runat="server" Text="Next To Do:" ID="lblNextToDo" meta:resourceKey="lblNextToDo_rsc"></asp:Label>
    </td>
    <td>
        <asp:TextBox runat="server" ID="NextToDoDate" ReadOnly="true"></asp:TextBox>
    </td>
    <td>
        <asp:TextBox runat="server" ID="NextToDoUser" Width="98%" ReadOnly="true"></asp:TextBox>
    </td>
    <td>
        <asp:TextBox runat="server" ID="NextToDoRegarding" Width="95%" ReadOnly="true"></asp:TextBox>
    </td>
</tr>
<tr>
    <td>
        <asp:Label runat="server" Text="Last Letter:" ID="lblLastLetter" meta:resourceKey="lblLastLetter_rsc"></asp:Label>
    </td>
    <td>
        <asp:TextBox runat="server" ID="LastLetterDate" ReadOnly="true"></asp:TextBox>
    </td>
    <td>
        <asp:TextBox runat="server" ID="LastLetterUser" Width="98%" ReadOnly="true"></asp:TextBox>
    </td>
    <td>
        <asp:TextBox runat="server" ID="LastLetterRegarding" Width="95%" ReadOnly="true"></asp:TextBox>
    </td>
</tr>
<tr>
    <td>
        <asp:Label runat="server" Text="Last E-mail:" ID="lblLastEmail" meta:resourceKey="lblLastEmail_rsc"></asp:Label>
    </td>
    <td>
        <asp:TextBox runat="server" ID="LastEmailDate" ReadOnly="true"></asp:TextBox>
    </td>
    <td>
        <asp:TextBox runat="server" ID="LastEmailUser" Width="98%" ReadOnly="true"></asp:TextBox>
    </td>
    <td>
        <asp:TextBox runat="server" ID="LastEmailRegarding" Width="95%" ReadOnly="true"></asp:TextBox>
    </td>
</tr>
<tr>
    <td>
        <asp:Label runat="server" Text="Last FAX:" ID="lblLastFax" meta:resourceKey="lblLastFax_rsc"></asp:Label>
    </td>
    <td>
        <asp:TextBox runat="server" ID="LastFaxDate" ReadOnly="true"></asp:TextBox>
    </td>
    <td>
        <asp:TextBox runat="server" ID="LastFaxUser" Width="98%" ReadOnly="true"></asp:TextBox>
    </td>
    <td>
        <asp:TextBox runat="server" ID="LastFaxRegarding" Width="95%" ReadOnly="true"></asp:TextBox>
    </td>
</tr>
<tr>
    <td style="height: 24px">
        <asp:Label runat="server" Text="Last Update:" ID="lblLastUpdate" meta:resourceKey="lblLastUpdate_rsc"></asp:Label>
    </td>
    <td style="height: 24px">
        <asp:TextBox runat="server" ID="LastUpdateDate" ReadOnly="true"></asp:TextBox>
    </td>
    <td style="height: 24px">
        <asp:TextBox runat="server" ID="LastUpdateUser" Width="98%" ReadOnly="true"></asp:TextBox>
    </td>
    <td>
    </td>
</tr>
</table>