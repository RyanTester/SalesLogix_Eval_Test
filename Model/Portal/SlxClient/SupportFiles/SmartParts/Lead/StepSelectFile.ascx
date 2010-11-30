<%@ Control Language="C#" AutoEventWireup="true" CodeFile="StepSelectFile.ascx.cs" Inherits="StepSelectFile" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Lookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>
<%@ Register TagPrefix="radU" Namespace="Telerik.WebControls" Assembly="RadUpload.NET2" %>

<input id="txtImportFile" type="hidden" runat="server" />
<input id="importProcessId" type="hidden" runat="server" enableviewstate="true" />
<input id="txtConfirmUpload" type="hidden" runat="server" />
<radU:RadProgressManager ID="radUProgressMgr" runat="server" />
<div runat="server" id="divMainContent">
    <div runat="server" style="text-align:left; border-style:solid; border-color:#99BBE8; border-width:1px; padding:5px; width:400px">
        <table runat="server" id="tblSelectFile" border="0" cellpadding="0" class="formtable" cellspacing="0" >
            <tr>
                <td>
                    <asp:Label ID="lblFileRequired" AssociatedControlID="uplFile" runat="server" Text="*" Visible="False" ForeColor="Red"></asp:Label>
                        <span class="slxlabel" style="margin-left:10px;width:95%">
                            <asp:Label ID="lblFile" AssociatedControlID="uplFile" runat="server" Text="<%$ resources: lblSelectFileHeader.Caption %>"></asp:Label>
                        </span>
                    <radU:RadUpload ID="uplFile" runat="server" InitialFileInputsCount="1" ControlObjectsVisibility="None" Skin="None" Width="95%"
                        EnableFileInputSkinning="False" ToolTip="<%$ resources: uplFile.Tooltip %>" OnClientFileSelected="OnUploadImportFile"
                        OnClientAdded="IncreaseFileInputWidth" />
                    <div id="uploadProgressAreaDiv" style="display: block" runat="server">
                        <radU:RadProgressArea ID="radUProgressArea" runat="server" ProgressIndicators="TotalProgressBar,TotalProgressPercent"
                            DisplayCancelButton="true" Skin="Slx" SkinsPath="~/Libraries/RadControls/upload/skins">
                        </radU:RadProgressArea>
                    </div>
                </td>
            </tr>
            <tr>
                <td>
                    <br />
                </td>
            </tr>
            <tr>
                <td>
                    <span class="slxlabel" style="margin-left:10px;width:95%">
                        <asp:Label ID="lblCurentFile" AssociatedControlID="txtCurrentFile" runat="server" Text="<%$ resources: lblCurrentFile.Caption %>"></asp:Label>
                    </span>
                    <span class="textcontrol" style="margin-left:10px;width:95%">
                        <asp:TextBox ID="txtCurrentFile" runat="server" EnableViewState="true" ReadOnly="true" Enabled="true"></asp:TextBox>
                    </span>  
                </td>
            </tr>
         </table>
    </div>
    <br />
    <div style="text-align:left; border-style:solid; border-color:#99BBE8; border-width:1px; padding:5px; width:400px">
        <table border="0" cellpadding="0" class="formtable" cellspacing="0">
            <tr>
                <td align="left">
                   <div class="lbl alignleft">
                        <asp:Label ID="lblDefaultOwner" AssociatedControlID="ownDefaultOwner" runat="server"
                            Text="<%$ resources: ownDefaultOwner.Caption %>">
                        </asp:Label>
                    </div>
                    <div class="textcontrol picklist">
                        <SalesLogix:OwnerControl runat="server" ID="ownDefaultOwner" AutoPostBack="false" EnableViewState="true"
                            OnLookupResultValueChanged="ownDefaultOwner_LookupResultValueChanged" Width="100%">
                        </SalesLogix:OwnerControl>
                    </div>
                </td>
            </tr>
            <tr>        
                <td>
                    <div class="lbl alignleft">
                        <asp:Label ID="lblDefaultLeadSource" AssociatedControlID="lueLeadSource" runat="server" EnableViewState="true" 
                            Text="<%$ resources: lueLeadSource.Caption %>">
                        </asp:Label>
                    </div>
                    <div class="textcontrol picklist">
                        <SalesLogix:LookupControl runat="server" ID="lueLeadSource" LookupEntityName="LeadSource" AutoPostBack="false" LookupBindingMode="String"
                            LookupEntityTypeName="Sage.Entity.Interfaces.ILeadSource, Sage.Entity.Interfaces, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null"
                            ReturnPrimaryKey="True" OnLookupResultValueChanged="lueLeadSource_LookupResultValueChanged" >
                            <LookupProperties>
                                <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueLeadSource.LookupProperties.Type.PropertyHeader %>" 
                                    PropertyName="Type" PropertyFormat="None" UseAsResult="True" ExcludeFromFilters="False">
                                </SalesLogix:LookupProperty>
                                <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueLeadSource.LookupProperties.Description.PropertyHeader %>"
                                    PropertyName="Description" PropertyFormat="None" UseAsResult="True" ExcludeFromFilters="False">
                                </SalesLogix:LookupProperty>
                                <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueLeadSource.LookupProperties.AbbrevDescription.PropertyHeader %>"
                                    PropertyName="AbbrevDescription" PropertyFormat="None" UseAsResult="True" ExcludeFromFilters="False">
                                </SalesLogix:LookupProperty>
                            </LookupProperties>
                            <LookupPreFilters>
                            <SalesLogix:LookupPreFilter PropertyName="Status" PropertyType="System.String" OperatorCode="="
 FilterValue="<%$ resources: LeadSource.LUPF.Status %>"
 ></SalesLogix:LookupPreFilter>
                            </LookupPreFilters>
                        </SalesLogix:LookupControl>
                    </div>
                </td>
            </tr>
            <tr>
              <td>
                <br />
              </td>
            </tr>
            <tr>
                <td>
                    <div class="slxlabel">
                        <asp:CheckBox ID="chkAddToGroup" runat="server" Text="<%$ resources: chkAddToGroup.Caption %>" EnableViewState="true" />
                    </div>
                    <table border="0" class="formtable" style="margin-left:20px; padding-right:10px; width:95%">
                        <tr>
                            <td>
                                <span style="width:200px;">
                                    <asp:RadioButton ID="rdbCreateGroup" runat="server" Text="<%$ resources: rdbCreateAdHocGroup.Caption %>" Checked="true" />
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span class="slxlabel">
                                    <asp:Label ID="lblCreateGroup" runat="server" AssociatedControlID="txtCreateGroupName"></asp:Label>
                                </span>
                                <span class="textcontrol" style="width:100%">
                                    <asp:TextBox ID="txtCreateGroupName" runat="server" EnableViewState="true"></asp:TextBox>
                                </span>
                            </td>
                         </tr>
                         <tr>
                            <td style="height: 22px">
                                <span>
                                    <asp:RadioButton ID="rdbAddToAddHocGroup" runat="server" Text="<%$ resources: rdbAddToAdHocGroup.Caption %>" />
                                </span>
                                <div class="textcontrol select" style="width:100%">
                                    <asp:ListBox ID="lbxAddHocGroups" runat="server" SelectionMode="Single" Rows="1" EnableViewState="true"></asp:ListBox>
                                </div>
                            </td>
                         </tr>
                     </table>
                </td>
            </tr>
        </table>
        
    </div>
   
        <br />
        <span class="slxlabel">
            <asp:Label ID="lblRequiredMsg" runat="server" Text="<%$ resources:lblRequiredMsg.Caption %>" ForeColor="Red" Visible="False" ></asp:Label>
        </span>
</div>
<br />

<div runat="server" id="divError" style="display:none">
    <span class="slxlabel">
        <asp:Label ID="lblError" runat="server"></asp:Label>
    </span>
</div>