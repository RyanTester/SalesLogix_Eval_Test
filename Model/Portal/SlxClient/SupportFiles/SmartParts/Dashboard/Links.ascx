<%@ Control Language="C#" AutoEventWireup="true" CodeFile="Links.ascx.cs" Inherits="SmartParts_Dashboard_Links" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>

<div class="portlet_description">
<asp:label ID="Label0" runat="Server" Text="<%$ resources:Description %>"></asp:label>
</div>

<SalesLogix:ListOfLinksControl runat="server" ID="Links" Title="" meta:resourcekey="LinksResc">
        <SalesLogix:PageLink ID="PageLink13" runat="server" target="External" text="<%$ resources:SupportOnline %>" NavigateUrl="<%$ resources:SupportURL %>" LinkType="AbsolutePath" />
        <SalesLogix:PageLink ID="PageLink14" runat="server" target="External" text="<%$ resources:ProductInformation %>" NavigateUrl="<%$ resources: ProductsURL %>" LinkType="AbsolutePath" />
        <SalesLogix:PageLink ID="PageLink15" runat="server" target="External" text="<%$ resources:Website %>" NavigateUrl="<%$ resources: SageURL %>" LinkType="AbsolutePath" />
</SalesLogix:ListOfLinksControl>