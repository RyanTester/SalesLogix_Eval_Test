<%@ Control Language="C#" AutoEventWireup="true" CodeFile="OpportunityStatistics.ascx.cs" Inherits="SmartParts_OpportunityStatistics" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>

<div style="display:none">
    <asp:Panel ID="OpportunityStats_RTools" runat="server">
        <SalesLogix:PageLink ID="lnkOpportunityStatisticsHelp" runat="server" LinkType="HelpFileName"
            ToolTip="<%$ resources: Portal, Help_ToolTip %>" Target="Help" NavigateUrl="oppstatistics.aspx"
            ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16">
        </SalesLogix:PageLink>
    </asp:Panel>
</div>
<style type="text/css">
        .fixer DIV {display:inline;}
</style> 
<div>
    <table>
        <tr>
            <td style="padding-left:10px; padding-top:10px">
                <asp:Label runat="server" ID="lblOppStatistics" Text="Opportunity Statistics" meta:resourceKey="OpportunityStatistics_rsc" Font-Bold="true" Font-Size="Medium"></asp:Label>
                <br />
                <asp:Label runat="server" ID="lblOppStatNote" Text="Statistics for the Opportunities you selected." meta:resourceKey="StatisticsfortheOpportunitiesyouselected_rsc"></asp:Label>
            </td>        
        </tr>
    </table>
</div>
<br />
<div style="border:solid 1px navy; background-color:White; width:550px">
    <table>
        <tr>
            <td style="width:250px; padding-left:10px">
                <asp:Label runat="server" ID="lblNumOfOpps" Text="# of Opportunities" meta:resourceKey="lblNumOfOpps_rsc"></asp:Label><br />
                <asp:Label runat="server" ID="lblSalesPotentialTotal" Text="Sales Potential Total (Average)" meta:resourceKey="lblSalesPotentialTotal_rsc"></asp:Label><br />
                <asp:Label runat="server" ID="lblWeightedPotentialTotal" Text="Weighted Potential Total (Average)" meta:resourceKey="lblWeightedPotentialTotal_rsc"></asp:Label><br />
                <asp:Label runat="server" ID="lblAverageCloseProbability" Text="Average Close Probability" meta:resourceKey="lblAverageCloseProbability_rsc"></asp:Label><br />
                <asp:Label runat="server" ID="lblActualAmountTotal" Text="Actual Amount Total (Average)" meta:resourceKey="lblActualAmountTotal_rsc"></asp:Label><br />
                <asp:Label runat="server" ID="lblAverageNumOfDaysOpen" Text="Average # of Days Open" meta:resourceKey="lblAverageNumOfDaysOpen_rsc"></asp:Label><br />
                <asp:Label runat="server" ID="lblRangeOfEstClose" Text="Range of Est. Close (Min - Max)" meta:resourceKey="lblRangeOfEstClose_rsc"></asp:Label>
            </td>
            <td style="width:15px; padding-left:10px">
                <asp:Label runat="server" ID="lblEqual1" Text="="></asp:Label><br />
                <asp:Label runat="server" ID="lblEqual2" Text="="></asp:Label><br />
                <asp:Label runat="server" ID="lblEqual3" Text="="></asp:Label><br />
                <asp:Label runat="server" ID="lblEqual4" Text="="></asp:Label><br />
                <asp:Label runat="server" ID="lblEqual5" Text="="></asp:Label><br />
                <asp:Label runat="server" ID="lblEqual6" Text="="></asp:Label><br />
                <asp:Label runat="server" ID="lblEqual7" Text="="></asp:Label>
            </td>
            <td style="width:250px; padding-left:10px">
                <asp:Label runat="server" ID="lblNumOfOppsVal" ></asp:Label><br />
                <div class="fixer">
                    <SalesLogix:Currency runat="server" ID="curSalesPotentialTotalVal" DisplayMode="AsText"></SalesLogix:Currency>
                    <asp:Label runat="server" ID="lblSalesPotentialParen1" Text="("></asp:Label>
                    <SalesLogix:Currency runat="server" ID="curSalesPotentialAverageVal" DisplayMode="AsText"></SalesLogix:Currency>
                    <asp:Label runat="server" ID="lblSalesPotentialParen2" Text=")"></asp:Label><br />
                </div>
                <div class="fixer">
                    <SalesLogix:Currency runat="server" ID="curWeightedPotentialTotalVal" DisplayMode="AsText"></SalesLogix:Currency>
                    <asp:Label runat="server" ID="lblWeightedParen1" Text="("></asp:Label>
                    <SalesLogix:Currency runat="server" ID="curWeightedPotentialAverageVal" DisplayMode="AsText"></SalesLogix:Currency>
                    <asp:Label runat="server" ID="lblWeightedParen2" Text=")"></asp:Label>
                </div>
                <asp:Label runat="server" ID="lblAverageCloseProbabilityVal" ></asp:Label>
                <asp:Label runat="server" ID="lblPercent" Text="%"></asp:Label><br />
                <div>
                    <SalesLogix:Currency runat="server" ID="curActualAmountTotalVal" DisplayMode="AsText"></SalesLogix:Currency>
                    <asp:Label runat="server" ID="lblActualParen1" Text="("></asp:Label>
                    <SalesLogix:Currency runat="server" ID="curActualAmountAverageVal" DisplayMode="AsText"></SalesLogix:Currency>
                    <asp:Label runat="server" ID="lblActualParen2" Text=")"></asp:Label>
                </div>
                <asp:Label runat="server" ID="lblAverageNumOfDaysOpenVal" ></asp:Label><br />
                <asp:Label runat="server" ID="lblRangeOfEstCloseVal" ></asp:Label><br />
            </td>
        </tr>
    </table>
</div>
    <br />
    <br />
<div>
    <table>
        <tr>
            <td style="padding-left:10px">
                <asp:Label runat="server" ID="lblReports" Text="Reports" Font-Bold="true" meta:resourceKey="lblReports_rsc"></asp:Label>
            </td>
        </tr>
        <tr>
            <td style="padding-left:10px">      
                <asp:DropDownList AutoPostBack="true" runat="server" ID="ddlReports"  OnTextChanged="ddlReports_TextChanged">
                    <asp:ListItem Text="None" meta:resourceKey="None_rsc"></asp:ListItem>
                    <asp:ListItem Text="Sales Process Stage Analysis" meta:resourceKey="SalesProcessStageAnalysis_rsc"></asp:ListItem>
                    <asp:ListItem Text="Sales Process Step Usage" meta:resourceKey="SalesProcessStepUsage_rsc"></asp:ListItem>
                    <%--<asp:ListItem Text="Quota vs. Actual Sales"></asp:ListItem>--%>
                    <asp:ListItem Text="Forecast by Account Manager" meta:resourceKey="ForecastbyAccountManager_rsc"></asp:ListItem>
                    <%--<asp:ListItem Text="Competetive Analysis"></asp:ListItem>--%>
                </asp:DropDownList>
                <asp:Button runat="server" ID="btnUpdateOpps" Text="Update Opps" OnClick="btnUpdateOpps_Click" meta:resourceKey="btnUpdateOpps_rsc" />
            </td>
        </tr>
    </table>
</div>