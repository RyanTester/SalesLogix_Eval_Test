<%@ Control Language="C#" AutoEventWireup="true" CodeFile="IntroText.ascx.cs" Inherits="SmartParts_Dashboard_IntroText" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>

<div class="portlet_description">
<asp:label ID="Label0" runat="Server" Text="<%$ resources:Description %>"></asp:label>
</div>
<div class="ListOfLinksOuterDiv">
<asp:label ID="Label1" runat="Server" CssClass="ListOfLinksTitle" 
        Text="<%$ resources:ListOfLinksTitle %>" meta:resourcekey="Label1Resource1"></asp:label><br />
<asp:label ID="Label2" runat="Server" Text="<%$ resources:IntroText %>" 
        meta:resourcekey="Label2Resource1"></asp:label>
<p style="margin-top:11px">
    <SalesLogix:PageLink ID="MainHelp" runat="server" LinkType="HelpFileName"
    ToolTip="<%$ resources:Portal, Help_ToolTip %>" Target="Help" NavigateUrl="slxoverview.aspx"
    Text="Click here to learn how to use this system" meta:resourcekey="MainHelpResource1"></SalesLogix:PageLink>
</p></div>