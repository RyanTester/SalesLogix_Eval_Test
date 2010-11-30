<%@ Control Language="C#" AutoEventWireup="true" CodeFile="InsertTargetProgress.ascx.cs" Inherits="InsertTargetProgress" %>
<%@ Register TagPrefix="radU" Namespace="Telerik.WebControls" Assembly="RadUpload.NET2" %>
		
<div style="display:none">
    <asp:Panel ID="pnlInsertTargets_LTools" runat="server"></asp:Panel>
    <asp:Panel ID="pnlInsertTargets_CTools" runat="server"></asp:Panel>
    <asp:Panel ID="pnlInsertTargets_RTools" runat="server"></asp:Panel>
    <asp:Button ID="cmdStartInsert" runat="server" Text="Start Insert" OnClick="StartInsert_OnClick" />
    <asp:Button runat="server" ID="cmdClose" OnClick="cmdClose_OnClick"/>
</div>


<radU:RadProgressManager ID="radProcessProgressMgr" runat="server" />
<br />

<radu:radprogressarea ProgressIndicators="TotalProgressBar, TotalProgress" id="radInsertProcessArea" runat="server" OnClientProgressUpdating="OnUpdateProgress">
    <progresstemplate>
       <table width="100%">
       <tr>
        <td align="center">
        <div class="RadUploadProgressArea">
            <table class="RadUploadProgressTable" style="height:100;width:100%;">
               <tr>
                    <td class="RadUploadTotalProgressData"  align="center">
                        <asp:Label ID="Primary" runat="server" Text="<%$ resources: lblPrimary.Caption %>"></asp:Label>&nbsp;
                        <!-- Percent of the Targets processed -->
                        <asp:Label ID="PrimaryPercent" runat="server"></asp:Label>%&nbsp;
                        <!-- Current record count of the Targets being processed -->
                        <asp:Label ID="PrimaryValue" runat="server"></asp:Label>&nbsp;
                        <!-- Total number of records to insert -->
                        <asp:Label ID="PrimaryTotal" runat="server"></asp:Label>
                        
                    </td>
                </tr>
                <tr>
                    <td class="RadUploadProgressBarHolder">
                        <!-- Insert Targets primary progress bar -->
                        <asp:Image ID="PrimaryProgressBar" runat="server" ImageUrl="~/images/icons/progress.gif" />
                    </td>
                </tr>
                <tr>
                    <!-- Total number of records successfully inserted -->
                    <td class="RadUploadFileCountProgressData">
                        <asp:Label ID="lblInserted" runat="server" Text="<%$ resources: lblInserted.Caption %>"></asp:Label>&nbsp;
                        <asp:Label ID="SecondaryValue" runat="server"></asp:Label>
                    </td>
                </tr>
                <tr>
                    <!-- Total number of records which failed to insert -->
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