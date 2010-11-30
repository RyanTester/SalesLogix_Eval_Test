<%@ Control Language="C#" AutoEventWireup="true" CodeFile="SalesOrderSnapShot.ascx.cs" Inherits="SalesOrderSnapShot" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
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
    .right-align-bold
    {
        text-align : right;
        font-size : 85%;
	    padding-top : .3em;
	    font-weight : bold;
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
                <asp:Label ID="lblSalesOrderHeader" runat="server" Text="<%$ resources: lblSalesOrderHeader.Caption %>"></asp:Label>
            </td>
            <td>
                <asp:Label ID="lblMyCurrencyHeader" runat="server" Text="<%$ resources: lblMyCurrencyHeader.Caption %>"></asp:Label>   
            </td>
        </tr>
        <tr>
            <td runat="server" id="rowSubTotal" class="column-label" >
                <asp:Label ID="lblSubTotal" runat="server" Text="<%$ resources: lblSubTotal.Caption %>"
                    AssociatedControlID="curSubTotal">
                </asp:Label>
            </td>
            <td runat="server" id="rowBaseSubTotal" class="right-align">
                <SalesLogix:Currency runat="server" ID="curBaseSubTotal" DisplayMode="AsText" ExchangeRateType="BaseRate"
                    DisplayCurrencyCode="false">
                </SalesLogix:Currency>
            </td>
            <td id="rowSOSubTotal" runat="server" visible="false" class="right-align">
                <SalesLogix:Currency runat="server" ID="curSubTotal" DisplayMode="AsText" ExchangeRateType="SalesOrderRate"
                    DisplayCurrencyCode="true">
                </SalesLogix:Currency>
            </td>
            <td id="rowMyCurSubTotal" runat="server" visible="false" class="right-align">
                <SalesLogix:Currency runat="server" ID="curMySubTotal" DisplayMode="AsText" ExchangeRateType="MyRate"
                    DisplayCurrencyCode="true">
                </SalesLogix:Currency>
            </td>
        </tr>
        <tr>
            <td>
                <asp:LinkButton ID="lnkDiscount" runat="server" Text="<%$ resources: lnkDiscount.Caption %>"
                    OnClick="ShowDetailsView_OnClick">
                </asp:LinkButton>
            </td>
            <td class="right-align">
                <SalesLogix:Currency runat="server" ID="curBaseDiscount" DisplayMode="AsText" ExchangeRateType="BaseRate"
                    DisplayCurrencyCode="false">
                </SalesLogix:Currency>
                <asp:Label runat="server" ID="lblBaseDiscountPercentage" Enabled="false"></asp:Label>
            </td>
            <td id="rowSODiscount" runat="server" visible="false" class="right-align">
                <SalesLogix:Currency runat="server" ID="curDiscount" DisplayMode="AsText" ExchangeRateType="SalesOrderRate"
                    DisplayCurrencyCode="true">
                </SalesLogix:Currency>
            </td>
            <td id="rowMyCurDiscount" runat="server" visible="false" class="right-align">
                <SalesLogix:Currency runat="server" ID="curMyDiscount" DisplayMode="AsText" ExchangeRateType="MyRate"
                    DisplayCurrencyCode="true">
                </SalesLogix:Currency>
            </td>
        </tr>
        <tr>
            <td>
                <asp:LinkButton ID="lnkShipping" runat="server" Text="<%$ resources: lblShipping.Caption %>"
                    OnClick="ShowDetailsView_OnClick">
                </asp:LinkButton>
            </td>
            <td class="right-align">
                <SalesLogix:Currency runat="server" ID="curBaseShipping" DisplayMode="AsText" ExchangeRateType="BaseRate"
                    DisplayCurrencyCode="false">
                </SalesLogix:Currency>
            </td>
            <td id="rowSOShipping" runat="server" visible="false" class="right-align">
                <SalesLogix:Currency runat="server" ID="curShipping" DisplayMode="AsText" ExchangeRateType="SalesOrderRate"
                    DisplayCurrencyCode="true">
                </SalesLogix:Currency>
            </td>
            <td id="rowMyCurShipping" runat="server" visible="false" class="right-align">
                <SalesLogix:Currency runat="server" ID="curMyShipping" DisplayMode="AsText" ExchangeRateType="MyRate"
                    DisplayCurrencyCode="true">
                </SalesLogix:Currency>
            </td>
        </tr>
        <tr>
            <td>
                <asp:LinkButton ID="lnkTaxRate" runat="server" Text="<%$ resources: lnkTax.Caption %>"
                    OnClick="ShowDetailsView_OnClick">
                </asp:LinkButton>
            </td>
            <td class="right-align">
                <SalesLogix:Currency runat="server" ID="curBaseTax" DisplayMode="AsText" ExchangeRateType="BaseRate"
                    DisplayCurrencyCode="false">
                </SalesLogix:Currency>
                <asp:Label runat="server" ID="lblBaseRatePercentage" Enabled="false"></asp:Label>
            </td>
            <td id="rowSOTax" runat="server" visible="false" class="right-align">
                <SalesLogix:Currency runat="server" ID="curTax" DisplayMode="AsText" ExchangeRateType="SalesOrderRate"
                    DisplayCurrencyCode="true">
                </SalesLogix:Currency>
            </td>
            <td id="rowMyCurTax" runat="server" visible="false" class="right-align">
                <SalesLogix:Currency runat="server" ID="curMyTax" DisplayMode="AsText" ExchangeRateType="MyRate"
                    DisplayCurrencyCode="true">
                </SalesLogix:Currency>
            </td>
        </tr>
        <tr>
            <td style="font-weight:bold">
                <asp:Label ID="lblTotal" runat="server" Text="<%$ resources: lblTotal.Caption %>"
                    AssociatedControlID="curTotal">
                </asp:Label>
            </td>
            <td class="right-align-bold">
                <SalesLogix:Currency runat="server" ID="curBaseTotal" DisplayMode="AsText" ExchangeRateType="BaseRate"
                    DisplayCurrencyCode="false" Font-Bold="true">
                </SalesLogix:Currency>
            </td>
            <td id="rowSOTotal" runat="server" visible="false" class="right-align-bold">
                <SalesLogix:Currency runat="server" ID="curTotal" DisplayMode="AsText" ExchangeRateType="SalesOrderRate"
                    DisplayCurrencyCode="true" Font-Bold="true">
                </SalesLogix:Currency>
            </td>
            <td id="rowMyCurTotal" runat="server" visible="false" class="right-align-bold">
                <SalesLogix:Currency runat="server" ID="curMyTotal" DisplayMode="AsText" ExchangeRateType="MyRate"
                    DisplayCurrencyCode="true" Font-Bold="true">
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
                    <asp:Label ID="txtExchangeRate_lbl" AssociatedControlID="lblExchangeRateValue" runat="server"
                        Text="<%$ resources: txtExchangeRate.Caption %>">
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
    </table>
</div>