<%@ Control Language="C#" AutoEventWireup="true" CodeFile="DoYouKnow.ascx.cs" Inherits="SmartParts_Dashboard_DoYouKnow" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>

<div class="portlet_description">
<asp:label ID="Label0" runat="Server" Text="<%$ resources:Description %>"></asp:label>
</div>

<SalesLogix:ListOfLinksControl runat="server" ID="DoYouKnow" Title="" meta:resourcekey="DoYouKnow">
        <SalesLogix:PageLink ID="PageLink6" runat="server" target="Help" text="<%$ resources:HowToAddANewAccount %>" NavigateUrl="addaccount.aspx" LinkType="HelpFileName" />
        <SalesLogix:PageLink ID="PageLink7" runat="server" target="Help" text="<%$ resources:HowToAddANewContact %>" NavigateUrl="contactadd1.aspx" LinkType="HelpFileName" />
        <SalesLogix:PageLink ID="PageLink8" runat="server" target="Help" text="<%$ resources:HowToAddAnOpportunity%>" NavigateUrl="opportunityadd.aspx" LinkType="HelpFileName" />
        <SalesLogix:PageLink ID="PageLink9" runat="server" target="Help" text="<%$ resources:HowToUseMailMerge%>" NavigateUrl="usemailmerge.aspx" LinkType="HelpFileName" />
        <SalesLogix:PageLink ID="PageLink10" runat="server" target="Help" text="<%$ resources:HowToCreateAGroupUsingQueryBuilder%>" NavigateUrl="querybuilderoverview.aspx" LinkType="HelpFileName" />
        <SalesLogix:PageLink ID="PageLink11" runat="server" target="Help" text="<%$ resources:HowToChangeMyPersonalOptions%>" NavigateUrl="prefsedit.aspx" LinkType="HelpFileName" />                
</SalesLogix:ListOfLinksControl>