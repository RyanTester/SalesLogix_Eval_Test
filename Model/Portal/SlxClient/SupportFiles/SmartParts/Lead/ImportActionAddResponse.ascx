<%@ Control Language="C#" AutoEventWireup="true" CodeFile="ImportActionAddResponse.ascx.cs" Inherits="ImportActionAddResponse" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Lookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.PickList" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.DependencyLookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.Platform.WebPortal" Namespace="Sage.Platform.WebPortal.SmartParts" TagPrefix="SalesLogix" %>

<div style="display:none">
    <asp:Panel ID="Form_LTools" runat="server"></asp:Panel>
    <asp:Panel ID="Form_CTools" runat="server"></asp:Panel>
    <asp:Panel ID="Form_RTools" runat="server">
        <SalesLogix:PageLink ID="lnkAddResponse" runat="server" LinkType="HelpFileName" Target="Help" NavigateUrl="leadimportresponse.aspx"
            ToolTip="<%$ resources: Portal, Help_ToolTip %>" ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16">
        </SalesLogix:PageLink>
    </asp:Panel>
</div>
<asp:HiddenField runat="server" ID="Mode" EnableViewState="true" />
<table border="0" cellpadding="1" cellspacing="0" class="formtable">
    <col width="60%" /><col width="40%" />
    <tr>
        <td>
            <div class="lbl alignleft">
                <asp:Label ID="lueLeadSource_lbl" AssociatedControlID="lueResponseLeadSource" runat="server" 
                    Text="<%$ resources: lueLeadSource.Caption %>" >
                </asp:Label>
            </div>
            <div class="textcontrol lookup">
                <SalesLogix:LookupControl runat="server" ID="lueResponseLeadSource" ToolTip="<%$ resources: lueLeadSource.ToolTip %>" LookupEntityName="LeadSource"
                    LookupEntityTypeName="Sage.Entity.Interfaces.ILeadSource, Sage.Entity.Interfaces, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null"
                     LookupBindingMode="Object" AllowClearingResult="true" >
                    <LookupProperties>
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueLeadSource.LookupProperties.Type.PropertyHeader %>"
                            PropertyName="Type" PropertyFormat="None" UseAsResult="False" ExcludeFromFilters="False">
                        </SalesLogix:LookupProperty>
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueLeadSource.LookupProperties.Description.PropertyHeader %>"
                            PropertyName="Description" PropertyFormat="None" UseAsResult="True" ExcludeFromFilters="False">
                        </SalesLogix:LookupProperty>
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueLeadSource.LookupProperties.AbbrevDescription.PropertyHeader %>"
                            PropertyName="AbbrevDescription" PropertyFormat="None"  UseAsResult="False" ExcludeFromFilters="False">
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
            <div class="lbl alignleft">
                <asp:Label ID="dtpResponseDate_lbl" AssociatedControlID="dtpResponseDate" runat="server" 
                    Text="<%$ resources: dtpResponseDate.Caption %>" >
                </asp:Label>
            </div>
            <div class="textcontrol datepicker">
                <SalesLogix:DateTimePicker runat="server" ID="dtpResponseDate" ToolTip="<%$ resources: dtpResponseDate.ToolTip %>" />
            </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class=" lbl alignleft">
                <asp:Label ID="lblResponseStatus" AssociatedControlID="pklResponseStatus" runat="server" 
                    Text="<%$ resources: pklResponseStatus.Caption %>" >
                </asp:Label>
            </div>
            <div class="textcontrol picklist">
                <SalesLogix:PickListControl runat="server" ID="pklResponseStatus" PickListName="Response Status" MustExistInList="false" />
            </div>
        </td>
    </tr>    
    <tr>
        <td>
            <div class=" lbl alignleft">
                <asp:Label ID="pklResponseMethod_lbl" AssociatedControlID="pklResponseMethod" runat="server" 
                    Text="<%$ resources: pklResponseMethod.Caption %>" >
                </asp:Label>
            </div>
            <div class="textcontrol picklist">
                <SalesLogix:PickListControl runat="server" ID="pklResponseMethod" PickListName="Response Method" MustExistInList="false" />
            </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="lbl alignleft">
                <asp:Label ID="lueCampaign_lbl" AssociatedControlID="lueCampaign" runat="server"
                    Text="<%$ resources: lueCampaign.Caption %>" >
                </asp:Label>
            </div>
            <div class="textcontrol lookup">
                <SalesLogix:LookupControl runat="server" ID="lueCampaign" ToolTip="<%$ resources: lueCampaign.ToolTip %>" LookupEntityName="Campaign"
                    LookupEntityTypeName="Sage.Entity.Interfaces.ICampaign, Sage.Entity.Interfaces, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null"
                    AutoPostBack="true" LookupBindingMode="Object" ReturnPrimaryKey="True" OnLookupResultValueChanged="OnResultValueChanged" >
                    <LookupProperties>
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueCampaign.LookupProperties.Status.PropertyHeader %>"
                            PropertyName="Status" PropertyFormat="None" UseAsResult="False" ExcludeFromFilters="False">
                        </SalesLogix:LookupProperty>
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueCampaign.LookupProperties.CampaignCode.PropertyHeader %>"
                            PropertyName="CampaignCode" PropertyFormat="None" UseAsResult="False" ExcludeFromFilters="False">
                        </SalesLogix:LookupProperty>
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueCampaign.LookupProperties.CampaignName.PropertyHeader %>"
                            PropertyName="CampaignName" PropertyFormat="None" UseAsResult="True" ExcludeFromFilters="False">
                        </SalesLogix:LookupProperty>
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueCampaign.LookupProperties.StartDate.PropertyHeader %>"
                            PropertyName="StartDate" PropertyFormat="None" UseAsResult="False" ExcludeFromFilters="False">
                        </SalesLogix:LookupProperty>
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueCampaign.LookupProperties.EndDate.PropertyHeader %>"
                            PropertyName="EndDate" PropertyFormat="None" UseAsResult="False" ExcludeFromFilters="False">
                        </SalesLogix:LookupProperty>
                    </LookupProperties>
                    <LookupPreFilters>
                    </LookupPreFilters>
                </SalesLogix:LookupControl>
            </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class=" lbl alignleft">
                <asp:Label ID="lbxStages_lbl" AssociatedControlID="lbxStages" runat="server" Text="<%$ resources: lbxStages.Caption %>" ></asp:Label>
            </div>
            <div class="textcontrol select">
                <asp:ListBox runat="server" ID="lbxStages" SelectionMode="Single" Rows="1"  >
                </asp:ListBox>
            </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class=" lbl alignleft">
                <asp:Label ID="lblInterest" AssociatedControlID="pklInterest" runat="server" Text="<%$ resources: lblInterest.Caption %>" ></asp:Label>
            </div>
            <div class="textcontrol picklist">
                <SalesLogix:PickListControl runat="server" ID="pklInterest" PickListName="Response Interest" MustExistInList="false" StorageMode="Text" />
            </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class=" lbl alignleft">
                <asp:Label ID="lblInterestLevel" AssociatedControlID="pklInterestLevel" runat="server" Text="<%$ resources: lblInterestLevel.Caption %>" ></asp:Label>
            </div>
            <div class="textcontrol picklist">
                <SalesLogix:PickListControl runat="server" ID="pklInterestLevel" PickListName="Response Interest Level" MustExistInList="false" StorageMode="Text" />
            </div>
        </td>
    </tr>
    <tr>
        <td colspan="2">
           
                <div class="lbl">
                    <asp:Localize ID="lclComments" runat="server" Text="<%$ resources: hzsComments.Caption %>"></asp:Localize>
               </div>
           
        </td>
    </tr>
    <tr>
        <td style="padding:10px 10px 10px 10px">
            <asp:TextBox runat="server"  Width="100%" ID="txtComments" TextMode="MultiLine" Columns="40" Rows="4" MaxLength="255"></asp:TextBox>
        </td>
    </tr>
        <tr>
       <td><br /></td>
       
    </tr>
    <tr>
        <td align="right">
            
            <div style="padding: 10px 10px 0px 10px;">
                <asp:Button runat="server" ID="btnSave" CssClass="slxbutton"  Text="<%$ resources: cmdSave.Caption %>" style="width:70px; margin: 0 5px 0 0;" />  
                <asp:Button runat="server" ID="btnCancel" CssClass="slxbutton" Text="<%$ resources: cmdCancel.Caption %>" style="width:70px;" />     
            </div>
            
        </td>
    </tr>
</table>


 

