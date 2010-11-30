<%@ Control Language="C#" AutoEventWireup="true" CodeFile="RecentlyViewed.ascx.cs" Inherits="SmartParts_Dashboard_RecentlyViewed" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>

<div class="portlet_description">
    <asp:label ID="Label0" runat="Server" Text="<%$ resources:Description %>"></asp:label>
</div>

<SalesLogix:ListOfLinksControl runat="server" ID="RecentlyViewed" meta:resourcekey="RecentlyViewedResource1" ItemsToDisplay="10" 
    ShowIcons="True">
</SalesLogix:ListOfLinksControl>