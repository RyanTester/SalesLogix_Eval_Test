<%@ Control Language="C#" AutoEventWireup="true" CodeFile="QuickActions.ascx.cs" Inherits="SmartParts_Dashboard_QuickActions" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>

<div class="portlet_description">
<asp:label ID="Label0" runat="Server" Text="<%$ resources:Description %>"></asp:label>
</div>

<SalesLogix:ListOfLinksControl runat="server" id="QuickActions" Title="" meta:resourcekey="QuickActions">
    <SalesLogix:PageLink ID="PageLink1" runat="server" text="<%$ resources:ScheduleAMeeting %>" NavigateUrl="javascript:Link.scheduleMeeting();" LinkType="RelativePath" />
    <SalesLogix:PageLink ID="PageLink2" runat="server" text="<%$ resources:ScheduleAPhoneCall %>" NavigateUrl="javascript:Link.schedulePhoneCall();" LinkType="RelativePath" />
    <SalesLogix:PageLink ID="PageLink3" runat="server" text="<%$ resources:ViewActivities %>" NavigateUrl="ActivityManager.aspx" LinkType="RelativePath" />
    <SalesLogix:PageLink ID="PageLink4" runat="server" text="<%$ resources:InsertNewAccount %>" NavigateUrl="InsertNewAccount.aspx?modeid=Insert" LinkType="RelativePath" />
    <SalesLogix:PageLink ID="PageLink5" runat="server" text="<%$ resources:InsertNewContact %>" NavigateUrl="InsertContactAccount.aspx?modeid=Insert" LinkType="RelativePath" />
</SalesLogix:ListOfLinksControl>