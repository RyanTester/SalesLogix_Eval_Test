<%@ Control Language="C#" AutoEventWireup="true" CodeFile="OpportunitySnapShot.ascx.cs" Inherits="SmartParts_OpportunitySnapShot" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.PickList" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.DependencyLookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Lookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>

<style type="text/css">
    .border-style
    {
        border:solid 1px #a8a9be;
        background-color:White;
        width:99%;
    }
    .main-header
    {
        background-color:#DFE8F6;
        border-bottom:solid 1px #a8a9be;
        font-weight:bold;
        padding:1px 0px 1px 4px;
    }
    .details-header
    {
        background-color:Silver;
        font-weight:bold;
        text-align:center;
    }
    .column-label
    {
        padding-right : 100px;
    }
    .right-align
    {
        text-align : right;
        font-size : 85%;
	    padding-top : .3em;
    }
</style>

<div class="border-style">
    <table width="100%" border="0" cellpadding="0" cellspacing="0">
        <col width="60%" />
        <col width="40%" />
        <tr class="main-header">
            <td>
                <asp:Label ID="lblTitle" runat="server" Text="<%$ resources: lblTitle.Caption %>"></asp:Label>
            </td>
            <td>
                <asp:LinkButton ID="lnkEmail" runat="server" OnClick="SendEmail" Text="<%$ resources: cpyCopyToEmail.Caption %>"></asp:LinkButton>
            </td>
        </tr>
    </table>
    <table id="tblDetails" runat="server" border="0" cellpadding="0" cellspacing="0">
        <col width="25%" />
        <col width="25%" />
        <col width="25%" />
        <col width="25%" />
        <tr runat="server" id="rowDetailsHeader" class="details-header" visible="false">
            <td style="background-color:White">
            </td>
            <td>
                <asp:Label ID="lblBaseHeader" runat="server" Text="<%$ resources: lblBaseHeader.Caption %>"></asp:Label>
            </td>
            <td>
                <asp:Label ID="lblOpportunityHeader" runat="server" Text="<%$ resources: lblOpportunityHeader.Caption %>"></asp:Label>
            </td>
            <td>
                <asp:Label ID="lblMyCurrencyHeader" runat="server" Text="<%$ resources: lblMyCurrencyHeader.Caption %>"></asp:Label>   
            </td>
        </tr>
        <tr runat="server" id="rowOpenSalesPotential">
            <td runat="server" id="colOpenSalesPotential" class="column-label">
                <asp:Label ID="lblOpenSalesPotential" runat="server" Text="<%$ resources: lblOpenSalesPotential.Caption %>"
                    AssociatedControlID="curOpenBaseSalesPotential">
                </asp:Label>
            </td>
            <td class="right-align">
                <SalesLogix:Currency runat="server" ID="curOpenBaseSalesPotential" DisplayMode="AsText" ExchangeRateType="BaseRate"
                    DisplayCurrencyCode="true">
                </SalesLogix:Currency>
            </td>
            <td runat="server" class="right-align" id="colOppSalesPotential" visible="false">
                <SalesLogix:Currency runat="server" ID="curOpenSalesPotential" DisplayMode="AsText" ExchangeRateType="OpportunityRate"
                    DisplayCurrencyCode="true">
                </SalesLogix:Currency>
            </td>
            <td runat="server" class="right-align" id="colMyCurSalesPotential" visible="false">
                <SalesLogix:Currency runat="server" ID="curMyCurSalesPotential" DisplayMode="AsText" ExchangeRateType="MyRate"
                    DisplayCurrencyCode="true">
                </SalesLogix:Currency>
            </td>
        </tr>
        <tr runat="server" id="rowActualWon">
            <td runat="server" id="colActualWon" class="column-label">
                <asp:Label ID="lblPotentialWon" runat="server" Text="<%$ resources: lblPotentialAmount.Caption %>"
                    AssociatedControlID="curBaseActualWon">
                </asp:Label>
            </td>
            <td class="right-align">
                <asp:LinkButton runat="server" OnClick="OnClickActualAmount" Text="">
                    <SalesLogix:Currency runat="server" ID="curBaseActualWon" DisplayMode="AsText" ExchangeRateType="BaseRate"
                        DisplayCurrencyCode="true">
                    </SalesLogix:Currency>
                </asp:LinkButton>
            </td>
            <td runat="server" class="right-align" id="colOppActualWon" visible="false">
                <asp:LinkButton runat="server" OnClick="OnClickActualAmount" Text="">
                    <SalesLogix:Currency runat="server" ID="curActualWon" DisplayMode="AsText" ExchangeRateType="OpportunityRate"
                        DisplayCurrencyCode="true">
                    </SalesLogix:Currency>
                </asp:LinkButton>
            </td>
            <td runat="server" class="right-align" id="colMyCurActualWon" visible="false">
                <asp:LinkButton runat="server" OnClick="OnClickActualAmount" Text="">
                    <SalesLogix:Currency runat="server" ID="curMyCurActualWon" DisplayMode="AsText" ExchangeRateType="MyRate"
                        DisplayCurrencyCode="true">
                    </SalesLogix:Currency>
                </asp:LinkButton>
            </td>
        </tr>
        <tr runat="server" id="rowPotentialLost">
            <td runat="server" id="colPotentialLost" class="column-label">
                <asp:Label ID="lblPotentialLost" runat="server" Text="<%$ resources: lblPotentialAmount.Caption %>"
                    AssociatedControlID="curBasePotentialLost">
                </asp:Label>
            </td>
            <td class="right-align">
                <asp:LinkButton runat="server" OnClick="OnClickActualAmount" Text="">
                    <SalesLogix:Currency runat="server" ID="curBasePotentialLost" DisplayMode="AsText" ExchangeRateType="BaseRate"
                        DisplayCurrencyCode="true">
                    </SalesLogix:Currency>
                </asp:LinkButton>
            </td>
            <td runat="server" id="colOppPotentialLost" visible="false" class="right-align">
                <asp:LinkButton runat="server" OnClick="OnClickActualAmount" Text="">
                    <SalesLogix:Currency runat="server" ID="curPotentialLost" DisplayMode="AsText" ExchangeRateType="OpportunityRate"
                        DisplayCurrencyCode="true">
                    </SalesLogix:Currency>
                </asp:LinkButton>
            </td>
            <td runat="server" id="colMyCurPotentialLost" visible="false" class="right-align">
                <asp:LinkButton runat="server" OnClick="OnClickActualAmount" Text="">
                    <SalesLogix:Currency runat="server" ID="curMyCurPotentialLost" DisplayMode="AsText" ExchangeRateType="MyRate"
                        DisplayCurrencyCode="true">
                    </SalesLogix:Currency>
                </asp:LinkButton>
            </td>
        </tr>
        <tr runat="server" id="rowWeighted">
            <td>
                <asp:Label ID="lblWeighted" runat="server" Text="<%$ resources: lblWeighted.Caption %>"
                    AssociatedControlID="curWeighted">
                </asp:Label>
            </td>
            <td class="right-align">
                <SalesLogix:Currency runat="server" ID="curBaseWeighted" DisplayMode="AsText" ExchangeRateType="BaseRate"
                    DisplayCurrencyCode="true">
                </SalesLogix:Currency>
            </td>
            <td runat="server" id="colOppWeighted" visible="false" class="right-align">
                <SalesLogix:Currency runat="server" ID="curWeighted" DisplayMode="AsText" ExchangeRateType="OpportunityRate"
                    DisplayCurrencyCode="true">
                </SalesLogix:Currency>
            </td>
            <td runat="server" id="colMyCurWeighted" visible="false" class="right-align">
                <SalesLogix:Currency runat="server" ID="curMyCurWeighted" DisplayMode="AsText" ExchangeRateType="MyRate"
                    DisplayCurrencyCode="true">
                </SalesLogix:Currency>
            </td>
        </tr>
    </table>
    <br />
    <table id="tblMultiCurrency" runat="server" border="0" cellpadding="0" cellspacing="0" width="100%" visible="false">
        <col width="100%" />
        <tr>
            <td>
                <div class=" lbl alignleft">
                    <asp:Label ID="lueCurrencyCode_lbl" AssociatedControlID="lueCurrencyCode" runat="server"
                        Text="<%$ resources: lueCurrencyCode.Caption %>" >
                    </asp:Label>
                </div>
                <div class="textcontrol lookup">
                    <SalesLogix:LookupControl runat="server" ID="lueCurrencyCode" ToolTip="<%$ resources: lueCurrencyCode.ToolTip %>" LookupEntityName="ExchangeRate"
                        LookupEntityTypeName="Sage.Entity.Interfaces.IExchangeRate, Sage.Entity.Interfaces, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null"
                        LookupDisplayMode="HyperText" OnLookupResultValueChanged="CurrencyCode_OnChange" AutoPostBack="true" LookupBindingMode="String" >
                        <LookupProperties>
                            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueCurrencyCode.Description.PropertyHeader %>" PropertyName="Description"
                                PropertyType="System.String" PropertyFormat="None" UseAsResult="True" ExcludeFromFilters="False">
                            </SalesLogix:LookupProperty>
                            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueCurrencyCode.Rate.PropertyHeader %>" PropertyName="Rate"
                                PropertyType="System.Double" PropertyFormat="None" UseAsResult="True" ExcludeFromFilters="False">
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
                <div class="lbl alignleft">
                    <asp:Label ID="lblExchangeRate" AssociatedControlID="lblExchangeRateValue" runat="server"
                        Text="<%$ resources: lblExchangeRate.Caption %>">
                    </asp:Label>
                </div>
                <div runat="server" id="divExchangeRateLabel" class="textcontrol">
                    <asp:Label runat="server" ID="lblExchangeRateValue" Enabled="false"></asp:Label>
                </div>
                <div runat="server" id="divExchangeRateText" class="textcontrol" style="width:65px">
                    <SalesLogix:NumericControl runat="server" ID="numExchangeRateValue" OnTextChanged="ExchangeRate_OnChange" AutoPostBack="true" />
                </div>
            </td>
        </tr>
        <tr>
            <td>
                <div class="lbl alignleft">
                    <asp:Label ID="lblExchangeRateDate" AssociatedControlID="dtpExchangeRateDate" runat="server"
                        Text="<%$ resources: dtpExchangeRateDate.Caption %>">
                    </asp:Label>
                </div>
                <div>
                    <SalesLogix:DateTimePicker runat="server" ID="dtpExchangeRateDate" DisplayMode="AsText"></SalesLogix:DateTimePicker>
                </div>
            </td>
        </tr>
        <tr>
            <td>
                <asp:CheckBox runat="server" ID="chkLockRate" Text="<%$ resources: chkLockRate.Caption %>"/>
            </td>
        </tr>
        <tr>
            <td>
                <br />
            </td>
        </tr>
    </table>
    <table id="tblSummary" runat="server" border="0" cellpadding="0" cellspacing="0">
        <tr>
            <td>
                <div class="lbl">
                    <asp:Label runat="server" ID="lblSummaryHeader" Text="<%$ resources: lblSummaryHeader.Caption %>"></asp:Label>
                </div>
            </td>
        </tr>
        <tr runat="server" id="rowOpenSummary">
            <td>
                <asp:Label ID="lblSummary" runat="server" Text="<%$ resources: lblSummary.Caption %>"></asp:Label>
                <SalesLogix:DateTimePicker ID="dtpDateOpened" Timeless="true" runat="server" DisplayMode="AsHyperlink"
                    DisplayTime="False">
                </SalesLogix:DateTimePicker>
                <asp:Label ID="lblSummaryActivity" runat="server"></asp:Label>
            </td>
        </tr>
        <tr runat="server" id="rowClosedWon">
            <td>
                <asp:Label ID="lblClosedWonSummary" runat="server" Text="<%$ resources: lblClosedSummary.Caption %>"></asp:Label>
                <SalesLogix:DateTimePicker ID="dtpClosedWonSummary" Timeless="true" runat="server" DisplayMode="AsHyperlink"
                    DisplayTime="False">
                </SalesLogix:DateTimePicker>
                <asp:Label ID="lblDaysOpen" runat="server"></asp:Label>
            </td>
        </tr>
        <tr runat="server" id="rowClosedLost">
            <td>
                <asp:Label ID="lblClosedLostSummary" runat="server" Text="<%$ resources: lblClosedSummary.Caption %>"></asp:Label>
                <SalesLogix:DateTimePicker ID="dtpClosedLostSummary" Timeless="true" runat="server" DisplayMode="AsHyperlink"
                    DisplayTime="False">
                </SalesLogix:DateTimePicker>
                <asp:Label ID="lblLostDaysOpen" runat="server"></asp:Label>
            </td>
        </tr>
    </table>
    <table id="tblReasonWonLost" runat="server" border="0" cellpadding="0" cellspacing="0">
        <tr runat="server" id="rowReasonWon">
            <td>
                <div>
                    <asp:Label ID="lblReasonWon" runat="server" Text="<%$ resources: lblReasonWon.Caption %>"></asp:Label>
                </div>
            </td>
            <td>
                <SalesLogix:PickListControl runat="server" ID="pklReasonWon" PickListName="Reason Won" DisplayMode="AsHyperlink"
                    ValueStoredAsText="false" AllowMultiples="true" NoneEditable="true" />
            </td>
        </tr>
        <tr runat="server" id="rowReasonLost">
            <td>
                <asp:Label ID="lblReasonLost" runat="server" AssociatedControlID="pklReasonLost"
                    Text="<%$ resources: lblReasonLost.Caption %>">
                </asp:Label>
            </td>
            <td>
                <SalesLogix:PickListControl runat="server" ID="pklReasonLost" DisplayMode="AsHyperlink" PickListName="Reason Won"
                    ValueStoredAsText="false" AllowMultiples="true" NoneEditable="true" />
            </td>
        </tr>
    </table>
    <table id="tblProcesCompetitors" runat="server" border="0" cellpadding="0" cellspacing="0">
        <tr runat="server" id="rowSalesProcess">
            <td>
                <div>
                    <asp:Label ID="lblSalesProcess" runat="server" Text="<%$ resources: lblSalesProcess.Caption %>"></asp:Label>
                </div>
            </td>
        </tr>
        <tr runat="server" id="rowCompetitors">
            <td>
                <div>
                    <asp:Label ID="lblCompetitors" runat="server"></asp:Label>
                </div>
            </td>
        </tr>
    </table>
    <table id="tblTypeSource" runat="server" border="0" cellpadding="0" cellspacing="0">
        <tr>
            <td>
                <asp:Label runat="server" ID="lblType" Text="<%$ resources: lblType.Caption %>" />
            </td>
            <td>
                <SalesLogix:PickListControl runat="server" ID="pklType" PickListName="Opportunity Type" DisplayMode="AsHyperlink" />
            </td>
        </tr>
        <tr id="rowSource">
            <td>
                <div>
                    <asp:Label runat="server" ID="lblSource" Text="<%$ resources: lblSource.Caption %>" /> 
                </div>
            </td>
            <td>
                <div>
                    <SalesLogix:LookupControl runat="server" ID="lueLeadSourceOpen" LookupEntityName="LeadSource" LookupDisplayMode="HyperText"
                        LookupEntityTypeName="Sage.SalesLogix.Entities.LeadSource, Sage.SalesLogix.Entities" >
                        <LookupProperties>
                            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueLeadSource.Type.PropertyHeader %>"
                                PropertyName="Type" PropertyFormat="None" UseAsResult="True">
                            </SalesLogix:LookupProperty>
                            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueLeadSource.Description.PropertyHeader %>"
                                PropertyName="Description" PropertyFormat="None" UseAsResult="True">
                            </SalesLogix:LookupProperty>
                            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueLeadSource.AbbrevDescription.PropertyHeader %>"
                                PropertyName="AbbrevDescription" PropertyFormat="None" UseAsResult="True">
                            </SalesLogix:LookupProperty>
                        </LookupProperties>
                        <LookupPreFilters>              
                        </LookupPreFilters>
                    </SalesLogix:LookupControl>
                </div>
            </td>
        </tr>
    </table>
</div>