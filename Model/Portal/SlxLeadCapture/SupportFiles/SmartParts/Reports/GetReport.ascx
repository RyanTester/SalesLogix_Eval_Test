<%@ Control language="c#" Inherits="Sage.SalesLogix.Client.Reports.GetReport" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>

<div style="display:none">
<asp:Panel ID="GetReport_LTools" runat="server">
</asp:Panel>
<asp:Panel ID="GetReport_CTools" runat="server">
</asp:Panel>
<asp:Panel ID="GetReport_RTools" runat="server">
    <SalesLogix:PageLink ID="lnkReportHelp" runat="server" LinkType="HelpFileName"
        ToolTip="<%$ resources: Portal, Help_ToolTip %>" Target="Help" NavigateUrl="repmain.aspx"
        ImageUrl="ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16">
    </SalesLogix:PageLink>
</asp:Panel>
</div>

<input type="hidden" name="pwd" id="pwd" />
<input type="hidden" name="pluginid">
<input type="hidden" name="keyfield">
<input type="hidden" name="username">
<input type="hidden" name="rsf" value="">
<input type="hidden" name="wsql">
<input type="hidden" name="sqlqry">
<input type="hidden" name="forcesql">
<input type="hidden" name="tmargin" value="-1">
<input type="hidden" name="lmargin" value="-1">
<input type="hidden" name="sortfields">
<input type="hidden" name="sortdirections">
<input type="hidden" name="ss">
<input type="hidden" name="timezone">

<div id="loading" class="loadingBox">
    <asp:Localize ID="localizeLoadingReport" runat="server" Text="<%$ resources: localizeLoadingReport.Text %>"></asp:Localize>
    <br /><asp:Localize ID="localizePleaseWait" runat="server" Text="<%$ resources: localizePleaseWait.Text %>"></asp:Localize>
</div>
