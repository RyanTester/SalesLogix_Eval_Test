<%@ Control Language="C#" AutoEventWireup="true" CodeFile="ImportRunTest.ascx.cs" Inherits="ImportRunTest" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.Platform.WebPortal" Namespace="Sage.Platform.WebPortal.SmartParts" TagPrefix="SalesLogix" %>
<%@ Register TagPrefix="radU" Namespace="Telerik.WebControls" Assembly="RadUpload.NET2" %>

<div style="display:none">
    <asp:Button ID="cmdStartImportTest" runat="server" Text="Start Import" OnClick="StartImportTest_OnClick" />
    <asp:Button ID="cmdLoadResults" runat="server" OnClick="cmdLoadResults_OnClick" />
    <input id="txtRecordsSearched" type="hidden" runat="server" enableviewstate="true" />
    
</div>
<input id="hdStartTest" type="hidden" runat="server" enableviewstate="true" value="false" />
<input id="hdCompetedTest" type="hidden" runat="server" enableviewstate="true" value="false" />
<SalesLogix:SmartPartToolsContainer runat="server" ID="ImportRunTest_RTools" ToolbarLocation="right">
    <SalesLogix:PageLink ID="lnkImportRunTestHelp" runat="server" LinkType="HelpFileName" ToolTip="<%$ resources: Portal, Help_ToolTip %>" 
        Target="Help" NavigateUrl="leaddupetest.aspx" ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16">
    </SalesLogix:PageLink>
</SalesLogix:SmartPartToolsContainer>
<div style="text-align:left; border-style:solid; border-color:#99BBE8; border-width:1px; padding:10px 10px 10px 10px;  margin:5px 5px 0px 5px">
<radU:RadProgressManager ID="radProgressTestMgr3" SuppressMissingHttpModuleError="true" runat="server" />

<asp:panel ID="pnlProgressArea" runat="server">
<radu:radprogressarea ProgressIndicators="TotalProgressBar, TotalProgress" id="radImportTest3" runat="server" 
    OnClientProgressUpdating="OnUpdateTestProgress" Skin="Slx" SkinsPath="~/Libraries/RadControls/upload/skins">
    <progresstemplate >
        <table width="100%">
            <tr>
                <td align="center">
                    <div class="RadUploadProgressArea">
                        <table class="RadUploadProgressTable" style="height:100;width:100%;">
                            <tr>
                                <td class="RadUploadTotalProgressData"  align="center">
                                    <asp:Label ID="Primary" runat="server" Text="<%$ resources: lblPrimary_Progress.Caption %>"></asp:Label>&nbsp;
                                    <!-- Percent of the imports processed -->
                                    <asp:Label ID="PrimaryPercent" runat="server"></asp:Label>%&nbsp;
                                    <!-- Current record count of the import being processed -->
                                    <asp:Label ID="PrimaryValue" runat="server"></asp:Label>&nbsp;
                                    <!-- Total number of records to import -->
                                    <asp:Label ID="PrimaryTotal" runat="server"></asp:Label>
                                </td>
                            </tr>
                            <tr>
                                <td class="RadUploadProgressBarHolder">
                                    <!-- Import Leads primary progress bar -->
                                    <asp:Image ID="PrimaryProgressBar" runat="server" ImageUrl="~/images/icons/progress.gif" />
                                </td>
                            </tr>                                            
                        </table>
                    </div>
                </td>
            </tr>
        </table>
   </progresstemplate>
</radu:radprogressarea>
</asp:panel>
<table border="0" cellpadding="1" cellspacing="0" class="formtable">
    <tr>
        <td>
            <span class="lbl">
                <asp:Label ID="lblTotalRecordsProcessed" AssociatedControlID="txtTotalRecordsProcessed" runat="server"
                    Text="<%$ resources: lblTotalRecordsProcessed.Caption %>">
                </asp:Label>
            </span>
            <span class="textcontrol">
                   <asp:TextBox runat="server" ID="txtTotalRecordsProcessed" ReadOnly="true"/>
             </span>
        </td>
    </tr>
    <tr>
        <td>
            <span class="lbl">
                <asp:Label ID="lblTotalduplicates" AssociatedControlID="txtTotalDuplicates" runat="server"
                    Text="<%$ resources: lblTotalDuplicates.Caption %>">
                </asp:Label>
            </span>
            <span class="textcontrol" >
                <asp:TextBox runat="server" ID="txtTotalDuplicates" ReadOnly="true"/>
            </span>
        </td>
    </tr>
    <tr>
        <td>
            <span class="lbl">
                <asp:Label ID="lblProjectDuplicates" AssociatedControlID="txtProjectedDuplicates" runat="server"
                    Text="<%$ resources: lblProjectedDuplicates.Caption %>">
                </asp:Label>
            </span>
            <span class="textcontrol">
                <asp:TextBox runat="server" ID="txtProjectedDuplicates" ReadOnly="true"/>
            </span>
        </td>
    </tr>
</table>
</div>
<div style="padding: 10px 10px 0px 10px; text-align: right;">
    <asp:Button runat="server" ID="btnOK" CssClass="slxbutton" ToolTip="<%$ resources: cmdOK.Caption %>" Text="<%$ resources: cmdOK.Caption %>" style="width:70px;" />  
</div>