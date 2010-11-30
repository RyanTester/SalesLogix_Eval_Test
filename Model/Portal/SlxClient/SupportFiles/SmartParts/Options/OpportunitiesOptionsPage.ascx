<%@ Control Language="C#" AutoEventWireup="true" CodeFile="OpportunitiesOptionsPage.ascx.cs" Inherits="OpportunitiesOptionsPage" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Lookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.DependencyLookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.PickList" TagPrefix="SalesLogix" %>

<div style="display:none">
<asp:Panel ID="LitRequest_RTools" runat="server" meta:resourcekey="LitRequest_RToolsResource1">
    <asp:ImageButton runat="server" ID="cmdSave" ToolTip="Save" OnClick="_save_Click" ImageUrl="~/images/icons/Save_16x16.gif" meta:resourcekey="cmdSave_rsc" />
    <SalesLogix:PageLink ID="PrefsOpphelpLink" runat="server" LinkType="HelpFileName" ToolTip="<%$ resources:Portal, Help_ToolTip %>" ImageUrl="~/ImageResource.axd?scope=global&amp;type=Global_Images&amp;key=Help_16x16" Target="Help" NavigateUrl="prefsopp.aspx" meta:resourcekey="PrefsOpphelpLinkResource2"></SalesLogix:PageLink>
</asp:Panel>
</div>


<table border="0" cellpadding="1" cellspacing="0" class="formtable" style="margin-top:0px;">
	<col width="50%" /><col width="50%" />
	<tr style="display:none">
        <td colspan="2">
            <asp:Label ID="lblTitle" runat="server" Font-Bold="True" Text="Set the default attributes for new opportunities" meta:resourcekey="lblTitleResource1"></asp:Label>
		</td>
	</tr>
    <tr>
        <td class="highlightedCell">
			<asp:Label ID="lblDescription" runat="server" Text="Opportunity Description" Font-Bold="True" meta:resourcekey="lblDescriptionResource1"></asp:Label>&nbsp;
		</td>
        <td class="highlightedCell">
            <asp:Label ID="lblUse" runat="server" Font-Bold="True" Text="Use This Estimated Close Date"
                Width="250px" meta:resourcekey="lblUseResource1"></asp:Label>
		</td>		
    </tr>
    <tr>
        <td>
			<span class="slxlabel"><asp:CheckBox ID="_useDefaultNamingConventions" runat="server"
                Text="Use default naming conventions (as defined by administrator)" meta:resourcekey="_useDefaultNamingConventionsResource1" />
			</span>
		</td>
        <td>
			<span class="slxlabel"><asp:Label ID="lblEstimated" runat="server" Text="Set estimated close to" Width="144px" meta:resourcekey="lblEstimatedResource1"></asp:Label><asp:DropDownList ID="_estimatedCloseToMonths" runat="server" 
                DataTextField="Key" DataValueField="Value" meta:resourcekey="_estimatedCloseToMonthsResource1">
            </asp:DropDownList>
            <asp:Label ID="lblMonths" runat="server" Text=" months after opening" meta:resourcekey="lblMonthsResource1"></asp:Label>
            </span>
		</td>
    </tr> 
	<tr>
		<td>
			<span class="lbl"><asp:Label ID="lblSample" runat="server" Text="Sample Description:" meta:resourcekey="lblSampleResource1"></asp:Label></span>
            <table class="slxlinkcontrol"><tr><td><asp:Label ID="lblSample2" runat="server" Text="Abbott Ltd.-Phase-03" meta:resourcekey="lblSample2Resource1"></asp:Label></td></tr></table>
		</td>
        <td>
			<span class="slxlabel"><asp:CheckBox ID="_estimatedCloseToLastDayOfMonth" runat="server" Text="<span id='lblChangeEstClostToLastDayOfMonth'>Initially change estimated close to last day of month</span>"
                meta:resourcekey="_estimatedCloseToLastDayOfMonthResource1" />
			</span>
		</td>
    </tr>  
    <tr>
		<td colspan="2">&nbsp;</td>
    </tr> 
	<tr>
		<td class="highlightedCell">
			<asp:Label ID="lblOther" runat="server" Font-Bold="True" Text="Other" meta:resourcekey="lblOtherResource1"></asp:Label>
		</td>
        <td class="highlightedCell">
			<asp:Label ID="lblDefaultSalesProcess" runat="server" Font-Bold="True" Text="Default Sales Process" meta:resourcekey="lblDefaultSalesProcessResource1"></asp:Label>
		</td>
	</tr>
	<tr>
		<td>
			<span class="lbl"><asp:Label ID="lblOppStatus" runat="server" Text="Opportunity Status:" meta:resourcekey="lblOppStatusResource1"></asp:Label></span>
			<span class="textcontrol">
                <SalesLogix:PickListControl DisplayMode="AsControl" PickListId="kSYST0000393" PickListName="Opportunity Status" ID="pklOpportunityStatus" runat="server" AlphaSort="True" AutoPostBack="False" DefaultPickListItem="" LeftMargin="" NoneEditable="True" />
			</span>
		</td>
		<td>
			<span class="lbl"><asp:Label ID="lblProcess" runat="server" Text="Sales Process:" Width="147px" meta:resourcekey="lblProcessResource1"></asp:Label></span>
			<span class="textcontrol">
				<asp:DropDownList ID="_salesProcess" runat="server" meta:resourcekey="_salesProcessResource1"></asp:DropDownList>
			</span>
        </td>		
		
	</tr>
	<tr style="white-space: nowrap">
		<td>
			<span class="lbl"><asp:Label ID="lblOppType" runat="server" Text="Opportunity Type:" meta:resourcekey="lblOppTypeResource1"></asp:Label></span>
			<span class="textcontrol">
                <SalesLogix:PickListControl DisplayMode="AsControl" PickListId="kSYST0000394" PickListName="Opportunity Type" ID="pklOpportunityType" runat="server" AlphaSort="True" AutoPostBack="False" DefaultPickListItem="" LeftMargin="" NoneEditable="True" />				
			</span>
		</td>
		<td></td>
	</tr>
	<tr style="white-space: nowrap">
		<td>
			<span class="lbl"><asp:Label ID="lblProbability" runat="server" Text="Probability:" meta:resourcekey="lblProbabilityResource1"></asp:Label></span>
			<span class="textcontrol">
                <SalesLogix:PickListControl DisplayMode="AsControl" PickListId="kSYST0000317" PickListName="Opportunity Probability" ID="pklOpportunityProbability" runat="server" AlphaSort="True" AutoPostBack="False" DefaultPickListItem="" LeftMargin="" NoneEditable="True" />								
			</span>
		</td>
        <td class="highlightedCell">
			<asp:Label ID="lblDefault" runat="server" Font-Bold="True" Text="Default Contact(s)" meta:resourcekey="lblDefaultResource1"></asp:Label>
		</td>
	</tr>	
	<tr>
		<td>
			<span class="lbl"><asp:Label ID="lblDefCurrency" runat="server" Text="Default Currency:" meta:resourcekey="lblDefCurrencyResource1"></asp:Label></span>
			<span class="textcontrol">
				<SalesLogix:LookupControl runat="server" ID="luDefCurrency" LookupEntityName="ExchangeRate" LookupEntityTypeName="Sage.Entity.Interfaces.IExchangeRate, Sage.Entity.Interfaces, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null">
				<LookupProperties>
				    <SalesLogix:LookupProperty PropertyHeader="Currency Code" PropertyName="Id" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
					<SalesLogix:LookupProperty PropertyHeader="Description" PropertyName="Description" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
					<SalesLogix:LookupProperty PropertyHeader="Rate" PropertyName="Rate" PropertyFormat="None"  UseAsResult="True" ExcludeFromFilters="True" meta:resourceKey="LPRate_rsc"></SalesLogix:LookupProperty>
				</LookupProperties>
				<LookupPreFilters>
				</LookupPreFilters>
				</SalesLogix:LookupControl>
			</span>
		</td>
		<td>
			<span class="slxlabel">
			<asp:RadioButtonList ID="_defaultContacts" runat="server" meta:resourcekey="_defaultContactsResource1">
				<asp:ListItem Selected="True" Value="0" text="&lt;span id='lblAddAllContacts'&gt;Add all contacts associated with account&lt;/span&gt;" meta:resourcekey="ListItemResource1" /> 
				<asp:ListItem Value="1" text="&lt;span id='lblAddOnlyPrimary'&gt;Add only the account's primary contact&lt;/span&gt;" meta:resourcekey="ListItemResource2" /> 
				<asp:ListItem Value="2" text="&lt;span id='lblAddNone'&gt;Add no contacts&lt;/span&gt;" meta:resourcekey="ListItemResource3" /> 
			</asp:RadioButtonList>
			</span>
		</td>
	</tr>
	<tr>
		<td>&nbsp;</td>
		<td>&nbsp;</td>
	</tr>
	<tr>
		<td></td>
		<td>
			<asp:Button ID="_addProducts" runat="server" Text="Products..." UseSubmitBehavior="False" meta:resourcekey="_addProductsResource1" />
		</td>
	</tr>
</table>