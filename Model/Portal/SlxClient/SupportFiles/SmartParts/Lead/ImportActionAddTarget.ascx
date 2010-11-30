<%@ Control Language="C#" AutoEventWireup="true" CodeFile="ImportActionAddTarget.ascx.cs" Inherits="ImportActionAddTarget" %>
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
        <SalesLogix:PageLink ID="lnkAddResponse" runat="server" LinkType="HelpFileName" Target="Help" NavigateUrl="leadimporttarget.aspx"
            ToolTip="<%$ resources: Portal, Help_ToolTip %>" ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16">
        </SalesLogix:PageLink>
    </asp:Panel>
</div>

<table border="0" cellpadding="1" cellspacing="0" class="formtable">
    <tr>
        <td>
            <span class="lbl">
                <asp:Label ID="lblCampaign" runat="server" Text="<%$ resources: lblCampaign.Caption %>"></asp:Label>
            </span>
            <div class="textcontrol lookup">
                <SalesLogix:LookupControl runat="server" ID="lueCampaigns" LookupEntityName="Campaign" AutoPostBack="false"
                    LookupEntityTypeName="Sage.Entity.Interfaces.ICampaign, Sage.Entity.Interfaces, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null" >
                    <LookupProperties>
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueCampaign.LookupProperties.Status.PropertyHeader %>"
                            PropertyName="Status" PropertyFormat="None" UseAsResult="True" ExcludeFromFilters="False">
                        </SalesLogix:LookupProperty>
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueCampaign.LookupProperties.CampaignCode.PropertyHeader %>"
                            PropertyName="CampaignCode" PropertyFormat="None" UseAsResult="True" ExcludeFromFilters="False">
                        </SalesLogix:LookupProperty>
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueCampaign.LookupProperties.CampaignName.PropertyHeader %>"
                            PropertyName="CampaignName" PropertyFormat="None" UseAsResult="True" ExcludeFromFilters="False">
                        </SalesLogix:LookupProperty>
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueCampaign.LookupProperties.StartDate.PropertyHeader %>"
                            PropertyName="StartDate" PropertyFormat="None" UseAsResult="True" ExcludeFromFilters="False">
                        </SalesLogix:LookupProperty>
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueCampaign.LookupProperties.EndDate.PropertyHeader %>"
                            PropertyName="EndDate" PropertyFormat="None" UseAsResult="True" ExcludeFromFilters="False">
                        </SalesLogix:LookupProperty>
                    </LookupProperties>
                    <LookupPreFilters>
                    </LookupPreFilters>
                </SalesLogix:LookupControl>
            </div>
        </td>
    </tr>
        <tr>
       <td><br /></td>
       
    </tr>
    <tr>
        <td align="right">
            
            <div style="padding: 10px 10px 0px 10px;">
                <asp:Button runat="server" ID="btnSave" CssClass="slxbutton" Text="<%$ resources: cmdSave.Caption %>" style="width:70px; margin: 0 5px 0 0;" />
                <asp:Button runat="server" ID="btnCancel" CssClass="slxbutton" Text="<%$ resources: cmdCancel.Caption %>" style="width:70px;" />
            </div>
        </td>
    </tr>    
</table>