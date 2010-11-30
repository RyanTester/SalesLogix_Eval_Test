<%@ Control Language="C#" AutoEventWireup="true" CodeFile="ScheduleProcess.ascx.cs" Inherits="SmartParts_Process_ScheduleProcess" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.PickList" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.DependencyLookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Lookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>

<div style="display:none">
<asp:Panel ID="ScheduleProcess_LTools" runat="server" meta:resourcekey="ScheduleProcess_LToolsResource1">
</asp:Panel>
<asp:Panel ID="ScheduleProcess_CTools" runat="server" meta:resourcekey="ScheduleProcess_CToolsResource1">
</asp:Panel>
<asp:Panel ID="ScheduleProcess_RTools" runat="server" meta:resourcekey="ScheduleProcess_RToolsResource1">
<SalesLogix:PageLink ID="ScheduleProcessHelpLink" runat="server" LinkType="HelpFileName" ToolTip="<%$ resources:Portal, Help_ToolTip %>" Target="Help" NavigateUrl="processschedule.aspx" ImageUrl="~/ImageResource.axd?scope=global&amp;type=Global_Images&amp;key=Help_16x16" meta:resourcekey="ScheduleProcessHelpLinkResource1"></SalesLogix:PageLink></asp:Panel>
</div>

<table border="0" cellpadding="1" cellspacing="0" class="formtable">
<col width="100%" />
	<tr>
		<td>
			<span class="lbl"><asp:Label ID="lblScheduleFor" runat="server" Text="Schedule For:" Width="110px" meta:resourcekey="lblScheduleForResource1"></asp:Label></span>
			<span class="textcontrol">
				<SalesLogix:LookupControl runat="server" ID="lueContactToScheduleFor" LookupEntityName="Contact" LookupEntityTypeName="Sage.SalesLogix.Entities.Contact, Sage.SalesLogix.Entities" EnableHyperLinking="false" AutoPostBack="false" >
				<LookupProperties>
				<SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueContactToScheduleFor.LookupProperties.NameLF.PropertyHeader %>" PropertyName="NameLF" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
				<SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueContactToScheduleFor.LookupProperties.Account.PropertyHeader %>" PropertyName="AccountName" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>

				<SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueContactToScheduleFor.LookupProperties.Address.City.PropertyHeader %>" PropertyName="Address.City" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
				<SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueContactToScheduleFor.LookupProperties.Address.State.PropertyHeader %>" PropertyName="Address.State" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
				
				<SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueContactToScheduleFor.LookupProperties.Work.PropertyHeader %>" PropertyName="WorkPhone" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
				<SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueContactToScheduleFor.LookupProperties.Email.PropertyHeader %>" PropertyName="Email" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
				</LookupProperties>
				<LookupPreFilters>
				</LookupPreFilters>
				</SalesLogix:LookupControl>
			</span>
		</td>
	</tr>
	<tr>
		<td>
			<span class="lbl"><asp:Label ID="lblProcessType" runat="server" Text="Process Type:" Width="110px" meta:resourcekey="lblProcessTypeResource1"></asp:Label></span>
			<span class="textcontrol"><asp:DropDownList ID="cboProcessType" runat="server" Width="190px" meta:resourcekey="cboProcessTypeResource1"></asp:DropDownList></span>
		</td>
	</tr>
	<tr>
		<td>
			<span class="lbl"><asp:Label ID="lblProcessOwner" runat="server" Text="Process Owner:" Width="110px" meta:resourcekey="lblProcessOwnerResource1"></asp:Label></span>
			<span class="textcontrol"><SalesLogix:SlxUserControl runat="server" ID="ownProcessOwner" AutoPostBack="False" DisplayMode="AsControl" meta:resourcekey="ownProcessOwnerResource1" >
                <UserDialogStyle BackColor="Control" />
            </SalesLogix:SlxUserControl></span>
		</td>
	</tr>
	<tr>
		<td><asp:Button ID="cmdSchedule" runat="server" OnClick="cmdSchedule_Click" Text="Schedule" meta:resourcekey="cmdScheduleResource1" /></td>
	</tr>
</table>




