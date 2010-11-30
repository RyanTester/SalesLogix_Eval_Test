<%@ Control Language="C#" AutoEventWireup="true" CodeFile="help.ascx.cs" Inherits="SmartParts_help" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>

<p>
    <asp:Label runat="server" ID="obsoletemsg" Text="<%$ resources: obsoleteHelpMsg %>" ></asp:Label>
</p>
 <SalesLogix:PageLink 
    ID="RedirectLink" 
    runat="server" 
    LinkType="HelpFileName" 
    ToolTip="<%$ resources: obsoleteHelpMsg %>" 
    Target="Help" 
    NavigateUrl="" 
    Text="<%$ resources: newHelpLinkText %>"
    >
 </SalesLogix:PageLink> 
