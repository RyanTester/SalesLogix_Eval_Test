<%@ Control Language="C#" AutoEventWireup="true" CodeFile="UpdateOpportunityCurrency.ascx.cs" Inherits="SmartParts_UpdateOpportunityCurrency" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.PickList" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.DependencyLookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Lookup" TagPrefix="SalesLogix" %>

<div style="display:none">
    <asp:Panel ID="UpdateOpps_RTools" runat="server">
        <SalesLogix:PageLink ID="lnkUpdateOpportunitiesHelp" runat="server" LinkType="HelpFileName"
            ToolTip="<%$ resources: Portal, Help_ToolTip %>" Target="Help" NavigateUrl="oppcurrency.aspx"
            ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16">
        </SalesLogix:PageLink>
    </asp:Panel>
</div>

<style type="text/css">
        .fixer DIV {display:inline;}
</style>

<div>
    <table class="formtable">
        <tr>
            <td style="padding-left:10px; padding-top:10px">
                <asp:Label runat="server" ID="lblOppCurRate"></asp:Label>
                <asp:Label Visible="false" runat="server" ID="lblCurrCode" Font-Bold="true"></asp:Label>
            </td>
        </tr>
        <tr>
            <td style="padding-left:30px">
                <asp:Label runat="server" ID="lblRateDate"></asp:Label>
                <br />
                <br />
            </td>
        </tr>
        <tr>
            <td style="padding-left:10px">
                <div class="textcontrol lookup">
                    <asp:Label runat="server" ID="lblChange" Text="Change Rate to  " meta:resourceKey="lblChange_rsc"></asp:Label>
                    <SalesLogix:LookupControl runat="server" AutoPostBack="true" LookupBindingMode="String" OnLookupResultValueChanged="GetExchangeRate" ID="lveChangeRate" ReturnPrimaryKey="true" LookupEntityName="ExchangeRate" LookupEntityTypeName="Sage.SalesLogix.Entities.ExchangeRate, Sage.SalesLogix.Entities, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null"  >
                        <LookupProperties>
                        <SalesLogix:LookupProperty PropertyHeader="Currency Code" PropertyName="Id" PropertyFormat="None"  UseAsResult="True" ExcludeFromFilters="False" meta:resourceKey="LPCurrencyCode_rsc"></SalesLogix:LookupProperty>
                        <SalesLogix:LookupProperty PropertyHeader="Description" PropertyName="Description" PropertyFormat="None"  UseAsResult="True" ExcludeFromFilters="False" meta:resourceKey="LPDescription_rsc"></SalesLogix:LookupProperty>
                        <SalesLogix:LookupProperty PropertyHeader="Rate" PropertyName="Rate" PropertyFormat="None"  UseAsResult="True" ExcludeFromFilters="True" meta:resourceKey="LPRate_rsc"></SalesLogix:LookupProperty>
                        </LookupProperties>
                        <LookupPreFilters>
                        </LookupPreFilters>
                    </SalesLogix:LookupControl>
                    <asp:TextBox Width="55px" runat="server" ID="txtExchangeRate"></asp:TextBox>
                </div>
            </td>
        </tr>
    </table>
    <table>
        <tr>
            <td style="padding-left:30px">
                <asp:Label runat="server" ID="lblRateCurrent"></asp:Label>
            </td>
        </tr>
    </table>
    <table>
        <tr>
            <td style="padding-left:10px">
                <br />
                <asp:Label runat="server" ID="lblWillChange" Text="Making this change would convert this Opportunity's" meta:resourceKey="lblWillChange_rsc"></asp:Label>
            </td>
        </tr>
        <tr>
            <td style="padding-left:10px">
                <asp:Label runat="server" ID="lblConvertedPotential" Text="convert potential - From: " meta:resourceKey="lblConvertedPotential_rsc"></asp:Label>
                <SalesLogix:Currency runat="server" ID="curFrom" ExchangeRateType="OpportunityRate" DisplayCurrencyCode="true" DisplayMode="astext"></SalesLogix:Currency>                
            </td>
        </tr>
        <tr>
            <td style="padding-left:132px">
                <asp:Label runat="server" ID="lblTo" Text="To: " meta:resourceKey="lblTo_rsc"></asp:Label>
                <SalesLogix:Currency runat="server" ID="curTo"  DisplayCurrencyCode="true" DisplayMode="astext" ExchangeRateType="opportunityRate"></SalesLogix:Currency>
            </td>
        </tr>
        <tr>
            <td style="padding-left:10px">
                <br />
                <asp:CheckBox AutoPostBack="true" runat="server" ID="chkLockRate" OnCheckedChanged="SetLocked" Text="Lock in the rate for this Opportunity" meta:resourceKey="chkLockRate_rsc" />
            </td>
        </tr>
        <tr>
            <td align="right" style="padding-right:10px">
                <asp:Button runat="server" ID="cmdOK" Text="<%$ resources: cmdOK.Caption %>" Width="100px" CssClass="slxbutton" OnClick="cmdOK_Click"  />
            </td>
            <td align="right" style="padding-right:20px">
                <asp:Button runat="server" ID="cmdCancel" Text="<%$ resources: cmdCancel.Caption %>" Width="100px" CssClass="slxbutton" OnClick="cmdCancel_Click"  />
            </td>
        </tr>
    </table>
</div>