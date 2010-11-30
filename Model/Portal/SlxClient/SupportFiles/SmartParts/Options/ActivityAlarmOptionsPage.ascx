<%@ Control Language="C#" AutoEventWireup="true" CodeFile="ActivityAlarmOptionsPage.ascx.cs" Inherits="ActivityAlarmOptionsPage" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Lookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.PickList" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.DependencyLookup" TagPrefix="SalesLogix" %>

<div style="display:none">
<asp:Panel ID="LitRequest_RTools" runat="server" meta:resourcekey="LitRequest_RToolsResource1">
    <asp:ImageButton runat="server" ID="btnSave" OnClick="_save_Click" ToolTip="Save" ImageUrl="~/images/icons/Save_16x16.gif" meta:resourcekey="btnSaveResource1" />
    <SalesLogix:PageLink ID="ActAlarmHelpLink" runat="server" LinkType="HelpFileName" ToolTip="<%$ resources:Portal, Help_ToolTip %>" ImageUrl="~/ImageResource.axd?scope=global&amp;type=Global_Images&amp;key=Help_16x16" Target="Help" NavigateUrl="prefsactivity.aspx" meta:resourcekey="ActAlarmHelpLinkResource2"></SalesLogix:PageLink>
</asp:Panel>
</div>


<table border="0" cellpadding="1" cellspacing="0" class="formtable" style="margin-top:0px">
	<col width="50%" /><col width="50%" />
	<tr>
		<td class="highlightedCell">
			<asp:Label ID="lblActivityOptions" runat="server" Font-Bold="True" Text="Activity Options" meta:resourcekey="lblActivityOptionsResource1"></asp:Label>
		</td>
        <td class="highlightedCell">
            <asp:Label ID="lblReminderOpts" runat="server" Font-Bold="True" Text="Reminders Options" meta:resourcekey="lblReminderOptsResource1"></asp:Label>
		</td>
	</tr>
    <tr>
        <td rowspan="4">
			<span class="lbl"><asp:Label ID="lblShowActivitiesFor" runat="server" Text="Show Activities for:" meta:resourcekey="lblShowActivitiesForResource1"></asp:Label></span>
			<span class="textcontrol">
				<asp:ListBox Rows="6" runat="server" ID="_showActivitiesFor" meta:resourcekey="_showActivitiesForResource1" />
			</span>
		</td>
        <td>
			<span class="lbl"><asp:Label ID="lblDisplayReminders" runat="server" Text="Display Activity Reminders:" meta:resourcekey="lblDisplayRemindersResource1"></asp:Label></span>
			<span class="textcontrol">
				<asp:DropDownList ID="_ShowReminders" runat="server" onchange="javascript:ToggleEnabled();" meta:resourcekey="_ShowRemindersResource1">
					<asp:ListItem Text="Yes" Value="Yes" Selected="True" meta:resourcekey="ListItemResource1"></asp:ListItem>
					<asp:ListItem Text="No" Value="No" meta:resourcekey="ListItemResource2"></asp:ListItem>
				</asp:DropDownList>
            </span>
        </td>		
    </tr>
    <tr>
        <td>
			<span class="lbl"><asp:Label ID="lblShowAlarms" runat="server" AssociatedControlID="_ShowAlarms" Text="Display Alarms:" meta:resourcekey="lblShowAlarmsResource1"></asp:Label></span>
			<span class="textcontrol">
				<asp:DropDownList ID="_ShowAlarms" runat="server" meta:resourcekey="_ShowAlarmsResource1">
					<asp:ListItem Text="Yes" Value="Yes" Selected="True" meta:resourcekey="ListItemResource3"></asp:ListItem>
					<asp:ListItem Text="No" Value="No" meta:resourcekey="ListItemResource4"></asp:ListItem>
				</asp:DropDownList>
            </span>
        </td>
    </tr>
    <tr style="white-space: nowrap">
        <td>
			<span class="lbl"><asp:Label ID="lblShowConfirms" runat="server" AssociatedControlID="_ShowConfirms" Text="Display Confirmations:" meta:resourcekey="lblShowConfirmsResource1"></asp:Label></span>
			<span class="textcontrol">
				<asp:DropDownList ID="_ShowConfirms" runat="server" meta:resourcekey="_ShowConfirmsResource1"> 
					<asp:ListItem Text="Yes" Value="Yes" Selected="True" meta:resourcekey="ListItemResource5"></asp:ListItem>
					<asp:ListItem Text="No" Value="No" meta:resourcekey="ListItemResource6"></asp:ListItem>
				</asp:DropDownList>
			</span>
        </td>
    </tr>
    <tr style="white-space: nowrap">
        <td>
			<span class="lbl"><asp:Label ID="lblShowPastDue" runat="server" AssociatedControlID="_ShowPastDue" Text="Display Past Due:" meta:resourcekey="lblShowPastDueResource1"></asp:Label></span>
			<span class="textcontrol">
	            <asp:DropDownList ID="_ShowPastDue" runat="server" meta:resourcekey="_ShowPastDueResource1">
		            <asp:ListItem Text="Yes" Value="Yes" Selected="True" meta:resourcekey="ListItemResource7"></asp:ListItem>
			        <asp:ListItem Text="No" Value="No" meta:resourcekey="ListItemResource8"></asp:ListItem>
				</asp:DropDownList>
			</span>
        </td>
    </tr>
	<tr>
		<td><!-- that was the end of the rowspan  -->
			<span class="lbl"><asp:Label ID="lblDefaultView" runat="server" Text="Default View:" meta:resourcekey="lblDefaultViewResource1"></asp:Label></span>
			<span class="textcontrol">
	            <asp:DropDownList ID="_defaultView" runat="server" DataTextField="Key" DataValueField="Value" meta:resourcekey="_defaultViewResource1">
			    </asp:DropDownList>
			</span>
        </td>
        <td></td>
    </tr>
    <tr>
		<td>
			<span class="lbl"><asp:Label ID="lblTimeFrame" runat="server" Text="Time Frame:" meta:resourcekey="lblTimeFrameResource1"></asp:Label></span>
			<span class="textcontrol">
				<asp:DropDownList ID="_timeFrame" runat="server" DataTextField="Key" DataValueField="Value" meta:resourcekey="_timeFrameResource1"></asp:DropDownList>
            </span>
        </td>
        <td></td>
    </tr>
	<tr>
		<td>
			<span class="lbl"><asp:Label ID="lblDefFollowActiv" runat="server" Text="Default Follow-up Activity:" meta:resourcekey="lblDefFollowActivResource1"></asp:Label></span>
			<span class="textcontrol">
				<asp:DropDownList ID="_defaultFollowupActivity" runat="server" DataTextField="Key" DataValueField="Value" meta:resourcekey="_defaultFollowupActivityResource1">
				</asp:DropDownList>
			</span>
		</td>
		<td></td>
	</tr>
	<tr>
		<td>
			<span class="lbl"><asp:Label ID="lblCarryOver" runat="server" Text="Carry Over Notes:" meta:resourcekey="lblCarryOverResource1"></asp:Label></span>
			<span class="textcontrol">
				<asp:DropDownList ID="_carryOverNotes" runat="server" DataTextField="Key" DataValueField="Value" meta:resourcekey="_carryOverNotesResource1">
				</asp:DropDownList>
			</span>
		</td>
		<td></td>
	</tr>
	<tr>
		<td>
			<span class="lbl"><asp:Label ID="lblCarryOverAttachments" runat="server" Text="Carry Over Notes:" meta:resourcekey="lblCarryOverAttachmentsResource1"></asp:Label></span>
			<span class="textcontrol">
				<asp:DropDownList ID="_carryOverAttachments" runat="server" DataTextField="Key" DataValueField="Value" meta:resourcekey="_carryOverAttachmentsResource1">
				</asp:DropDownList>
			</span>
		</td>
		<td></td>
	</tr>	
	<tr>
		<td >
			<span class="lbl"><asp:Label ID="lblAlarmLead" runat="server" Text="Alarm Default Lead:" meta:resourcekey="lblAlarmLeadResource1"></asp:Label></span>
			<table style="width:50%;" border="0" cellpadding="0" cellspacing="0">
				<col width="20%" /><col width="80%" />
				<tr style="white-space: nowrap">
					<td style="padding:0"><asp:TextBox ID="_alarmDefaultLeadValue" runat="server" CssClass="slxcontrol" style="width:95%; margin:0; height:19px" meta:resourcekey="_alarmDefaultLeadValueResource1"></asp:TextBox></td>
					<td><asp:DropDownList ID="_alarmDefaultLead" runat="server" CssClass="slxcontrol" style="width:99%"
					DataTextField="Key" DataValueField="Value" meta:resourcekey="_alarmDefaultLeadResource1">
				</asp:DropDownList></td>
				</tr>
			</table>
		</td>
		<td></td>
	</tr>
</table>