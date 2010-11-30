<%@ Control Language="C#" AutoEventWireup="true" CodeFile="StepProcessRequest.ascx.cs" Inherits="StepProcessRequest" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.PickList" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.DependencyLookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Lookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>
<%@ Register TagPrefix="radU" Namespace="Telerik.WebControls" Assembly="RadUpload.NET2" %>

<style type="text/css">
.headerArea
{
   border-style:solid; 
   border-width:1px; 
   border-color:#99BBE8;
   background-color: #D9E7F8;  
   vertical-align:middle;
   padding:10px 10px 10px 10px;
   
}
</style>

		
<div style="display:none">
    <asp:Panel ID="pnlProcessLeads_LTools" runat="server"></asp:Panel>
    <asp:Panel ID="pnlProcessLeads_CTools" runat="server"></asp:Panel>
    <asp:Panel ID="pnlProcessLeads_RTools" runat="server"></asp:Panel>
    <asp:Button runat="server" ID="cmdCompleted" OnClick="cmdCompleted_OnClick"/>
</div>

<radU:RadProgressManager ID="radProcessProgressMgr" SuppressMissingHttpModuleError="true" runat="server" />
<br />
<div class="headerArea">
<table cellpadding="4" style="width:100%" >
   <tr>
      <td align="left">
        <div ID="divProcessing" runat="server">     
           <span class="slxlabel">
             <asp:Label ID="lblHeader" runat="server" Text=""></asp:Label>
           </span>
        </div>          
     </td>
  </tr>
  <tr>
      <td align="left">
          <span class="slxlabel">
             <asp:Label ID="lblHeader2" runat="server" Text=""></asp:Label>
           </span>                  
     </td>
  </tr>
  <tr>
      <td align="left">
            <span class="slxlabel">
                <asp:Label ID="lblImportNumber" runat="server" Text="<%$ resources: lblImportNumber.Caption %>"></asp:Label>
            </span>
            <span>
               <asp:LinkButton ID="lnkImportNumber" runat="server" OnClick="lnkImportNumber_OnClick"></asp:LinkButton>
            </span>
      </td>
  </tr>
    
</table> 

<br />
<radu:radprogressarea ProgressIndicators="TotalProgressBar, TotalProgress" id="radImportProcessArea" runat="server"
    OnClientProgressUpdating="OnUpdateProgress" Skin="Slx" SkinsPath="~/Libraries/RadControls/upload/skins">
    <progresstemplate >
        <table style="width:100%">
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
                            <tr>
                                <!-- Total number of records successfully imported -->
                                <td class="RadUploadFileCountProgressData">
                                    <asp:Label ID="lblImported" runat="server" Text="<%$ resources: lblImported.Caption %>"></asp:Label>&nbsp;
                                    <asp:Label ID="SecondaryValue" runat="server"></asp:Label>
                                </td>
                            </tr>
                            <tr>
                                <!-- Total number of records which failed to import -->
                                <td class="RadUploadFileCountProgressData">
                                    <asp:Label ID="lblFailed" runat="server" Text="<%$ resources: lblFailed.Caption %>"></asp:Label>&nbsp;
                                    <asp:Label ID="SecondaryTotal" runat="server"></asp:Label>
                                </td>
                            </tr>
                        </table>
                    </div>
                </td>
            </tr>
        </table>
    </progresstemplate>
</radu:radprogressarea>
<br />
<table style="width:100%">
    <tr>
        <td></td>
        <td align="center">
            <asp:Button ID="cmdAbort" runat="server"  Visible="true" CssClass="slxbutton" Text="<%$ resources: cmdAbort.Caption %>" OnClick="cmdAbort_OnClick" />
        </td>
    </tr>
</table>
</div>