<%@ Control Language="C#" AutoEventWireup="true" CodeFile="UpdateOpportunities.ascx.cs" Inherits="SmartParts_UpdateOpportunities" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.PickList" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.DependencyLookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Lookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>

<script type="text/javascript">
function ChangeUpdateItems()
{

    var divAcctMgr = document.getElementById("AccMgrDiv");
    var divForecast = document.getElementById("ForecastDiv");
    var divCloseProb = document.getElementById("CloseProbDiv");
    var divComments = document.getElementById("CommentsDiv");
    var divEstClose = document.getElementById("EstCloseDiv");


    var ctrl = document.getElementById(ddl);

    
    switch(ctrl.value)
    {
        case AccountManager_rsc:
            divAcctMgr.style.display = "block";
            divForecast.style.display = "none";
            divCloseProb.style.display = "none";
            divComments.style.display = "none";
            divEstClose.style.display = "none";
            break;
        case AddToForecast_rsc:
            divAcctMgr.style.display = "none";
            divForecast.style.display = "block";
            divCloseProb.style.display = "none";
            divComments.style.display = "none";
            divEstClose.style.display = "none";
            break;
        case CloseProb_rsc:
            divAcctMgr.style.display = "none";
            divForecast.style.display = "none";
            divCloseProb.style.display = "block";
            divComments.style.display = "none";
            divEstClose.style.display = "none";
            break;
        case Comments_rsc:
            divAcctMgr.style.display = "none";
            divForecast.style.display = "none";
            divCloseProb.style.display = "none";
            divComments.style.display = "block";
            divEstClose.style.display = "none";
            break;
        case EstClose_rsc:
            divAcctMgr.style.display = "none";
            divForecast.style.display = "none";
            divCloseProb.style.display = "none";
            divComments.style.display = "none";
            divEstClose.style.display = "block";
            break;
    }
}
</script>  
    
<style type="text/css">
        .fixer DIV {display:inline;}
</style>    
    
<div style="display:none">
    <asp:Panel ID="UpdateOpps_RTools" runat="server">
        <SalesLogix:PageLink ID="lnkUpdateOpportunitiesHelp" runat="server" LinkType="HelpFileName"
            ToolTip="<%$ resources: Portal, Help_ToolTip %>" Target="Help" NavigateUrl="oppeditmulti.aspx"
            ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16">
        </SalesLogix:PageLink>
    </asp:Panel>
</div>
<div>
    <asp:Label runat="server" ID="lblOpp" Text="Changes can be made to the selected Opportunities" Font-Bold="true" meta:resourceKey="lblOpp_rsc"></asp:Label>
    <br />
    <asp:Button runat="server" ID="btnSelectAll" Text="Select All" OnClick="CheckAll" meta:resourceKey="btnSelectAll_rsc" />
    <asp:Button runat="server" ID="btnClearAll" Text="Clear All" OnClick="UnCheckAll" meta:resourceKey="btnClearAll_rsc"/>
    <br />
</div>

<div style="overflow:scroll; height:300px">
    <table id="OppGrid" runat="server" border="0" cellpadding="0" cellspacing="0">
        <tr>
            <td>
                <asp:GridView runat="server" ID="UpdateOppsGrid" EnableViewState="true" AutoGenerateColumns="false"
                    AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt" CssClass="datagrid" ShowEmptyTable="true">
                    <Columns>
                        <asp:TemplateField HeaderText="Select" meta:resourceKey="TFSelect_rsc">
                            <ItemTemplate>
                                <asp:CheckBox runat="server" id="chkSelect" Opportunityid='<%# Eval("Opportunityid")%>' oppEstClose='<%# Eval("EstimatedClose") %>'></asp:CheckBox>
                            </ItemTemplate>
                        </asp:TemplateField>
                        <asp:BoundField DataField="OpportunityId" Visible="false" />
                        <asp:BoundField DataField="Description" HeaderText="Opportunity" ReadOnly="True" meta:resourceKey="BFOpportunity_rsc" />
                        <asp:BoundField DataField="EstimatedClose" HeaderText="Est. Close" ReadOnly="true" meta:resourceKey="TFEstClose_rsc" HtmlEncode="false" DataFormatString="{0:MM/dd/yyyy}" />
                        <asp:TemplateField HeaderText="Prob %" meta:resourceKey="TFProb_rsc">
                            <ItemTemplate>
                                <asp:Label runat="server" id="lblProbability" Text='<%# Eval("CloseProbability") %>' ReadOnly="True"></asp:Label>
                            </ItemTemplate>
                        </asp:TemplateField>                        
                        <asp:TemplateField HeaderText="Forecast?" meta:resourceKey="TFForecast_rsc">
                            <ItemTemplate>
                                <asp:CheckBox runat="server" Enabled="False" id="chkForecast" Checked='<%# GetForecastValue(Eval("AddToForecast")) %>'/>
                            </ItemTemplate>
                        </asp:TemplateField>
                       <asp:TemplateField HeaderText="Acct. Mgr." meta:resourceKey="TFAcctMgr_rsc">
                            <ItemTemplate>
                                <SalesLogix:SlxUserControl ID="SlxUserControl1" runat="server" LookupResultValue='<%# Eval("AccountManagerID") %>' DisplayMode="AsText"></SalesLogix:SlxUserControl>
                            </ItemTemplate>
                        </asp:TemplateField>                       
                        <asp:BoundField DataField="Notes" HeaderText="Comments" ReadOnly="True" meta:resourceKey="BFComments_rsc" />
                        <asp:TemplateField>
                            <ItemTemplate>
                                <asp:Label runat="server" id="lblSalesPotential" Text='<%# Eval("SalesPotential") %>' Visible="false"></asp:Label>
                            </ItemTemplate>
                        </asp:TemplateField>
                    </Columns>
                    <RowStyle CssClass="rowlt" />
                    <AlternatingRowStyle CssClass="rowdk" />
                </asp:GridView>          
            </td>
        </tr>
    </table>
</div>
<br />
<div>
    <table style="display:inline" id="AddToForecast" runat="server" border="0" cellpadding="0" cellspacing="0" >
        <tr>
            <td colspan="2" style="padding-bottom:5px" >
                <asp:Label runat="server" ID="lblUpdate" Text="Click update to apply the following change to the selected Opportunities" Font-Bold="true" meta:resourceKey="lblUpdate_rsc"></asp:Label>
            </td>
        </tr>
        <tr>
            <td>
                <asp:DropDownList AutoPostBack="false" runat="server" ID="ddlUpdateOppDropDown" onchange="javascript:ChangeUpdateItems()">
                     <asp:ListItem Text="<%$ resources: AccountManager_rsc %>"></asp:ListItem>
                     <asp:ListItem Text="<%$ resources: AddToForecast_rsc %>"></asp:ListItem>
                     <asp:ListItem Text="<%$ resources: CloseProb_rsc %>"></asp:ListItem>
                     <asp:ListItem Text="<%$ resources: Comments_rsc %>"></asp:ListItem>
                     <asp:ListItem Text="<%$ resources: EstClose_rsc %>"></asp:ListItem>
                </asp:DropDownList>
            </td>
            <td>
                <div id="AccMgrDiv" style="display:inline">
                    <asp:Label runat="server" ID="lblChangeAcctMgr" Text="Change Acct. Mgr. to" meta:resourceKey="lblChangeAcctMgr_rsc"></asp:Label>
                    <SalesLogix:SlxUserControl runat="server" ID="usrAccMgr" AutoPostBack="false"></SalesLogix:SlxUserControl>
                </div>
                <div id="ForecastDiv" style="display:inline">
                    <asp:RadioButtonList runat="server" ID="rdgForecastYesNo" RepeatDirection="horizontal" >
                         <asp:ListItem Text="<%$ resources: Yes_rsc %>" Selected="true"></asp:ListItem>
                         <asp:ListItem Text="<%$ resources: No_rsc %>"></asp:ListItem>
                    </asp:RadioButtonList>
                </div>
                <div class="fixer" id="CloseProbDiv" style="display:inline">
                    <asp:Label runat="server" ID="lblcloseProb" Text="To:" meta:resourceKey="lblcloseProb_rsc"></asp:Label>
                    <SalesLogix:PickListControl runat="server" ID="pklCloseProbPickList" PickListName="Opportunity Probability" PickListId="kSYST0000317" />
                </div>
                <div id="CommentsDiv" style="display:inline">
                    <asp:TextBox runat="server" ID="txtComments"></asp:TextBox>
                </div>
                <div id="EstCloseDiv" style="display:inline">
                     <asp:RadioButton runat="server" ID="rdgEstClose" Text="<%$ resources: To_rsc %>" Checked="true" OnCheckedChanged="estClose_CheckedChanged" AutoPostBack="true" />  
                    <SalesLogix:DateTimePicker runat="server" ID="dtpDateTimeTo"></SalesLogix:DateTimePicker>
                     <asp:RadioButton runat="server" ID="rdgEstMove" Text="<%$ resources: Move_rsc %>" OnCheckedChanged="estMove_CheckedChanged" AutoPostBack="true"/>
                    <asp:DropDownList runat="server" ID="ddlMoveItem">
                        <asp:ListItem Text="Forward" meta:resourceKey="lblForward_rsc" Selected="true"></asp:ListItem>
                        <asp:ListItem Text="Back" meta:resourceKey="lblBack_rsc" ></asp:ListItem>
                    </asp:DropDownList>
                    <asp:TextBox runat="server" ID="txtNumDays" Text="60"></asp:TextBox>
                    <asp:Label runat="server" ID="lblDays" Text="days" meta:resourceKey="lblDays_rsc"></asp:Label>
                </div>
            </td>
        </tr>
    </table>
    <table>
        <tr>
            <td style="padding-bottom:3px; padding-top:3px">
                <asp:Label runat="server" ID="lblSalesPoten" Text="Sales Potential: " Font-Bold="true" meta:resourceKey="lblSalesPoten_rsc"></asp:Label>
                <SalesLogix:Currency runat="server" ID="curSalesPotentialTotal" DisplayMode="AsText" Font-Bold="true"></SalesLogix:Currency>
                <asp:Label runat="server" ID="lblWeighted" Text="Weighted: " Font-Bold="true" meta:resourceKey="lblWeighted_rsc"></asp:Label>
                <SalesLogix:Currency runat="server" ID="curWeightedTotal" DisplayMode="astext" Font-Bold="true"></SalesLogix:Currency>
                <asp:Label runat="server" ID="lblCount" Text="Count: " Font-Bold="true" meta:resourceKey="lblCount_rsc"></asp:Label>
                <asp:Label runat="server" ID="lblCountTotal" Font-Bold="true"></asp:Label>
            </td>
        </tr>
    </table>
    <table>
        <tr>
            <td>
                <asp:Button runat="server" ID="btnUpdate" Text="Update" OnClick="Update_Click" meta:resourceKey="btnUpdate_rsc" />
                <asp:Button runat="server" ID="btnClose" Text="Close" meta:resourceKey="btnClose_rsc" OnClick="Close_Click" />
            </td>
        </tr>
    </table>
</div>
