<%@ Control Language="C#" AutoEventWireup="true" CodeFile="CalendarOptionsPage.ascx.cs" Inherits="CalendarOptionsPage" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Lookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.PickList" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.DependencyLookup" TagPrefix="SalesLogix" %>

<div style="display:none">
<asp:Panel ID="LitRequest_RTools" runat="server" meta:resourcekey="LitRequest_RToolsResource1">
    <asp:ImageButton runat="server" ID="btnSave" OnClick="_save_Click" ToolTip="Save" ImageUrl="~/images/icons/Save_16x16.gif" meta:resourcekey="btnSaveResource1" />
    <SalesLogix:PageLink ID="CalendarOptsHelpLink" runat="server" LinkType="HelpFileName" ToolTip="<%$ resources:Portal, Help_ToolTip %>" ImageUrl="~/ImageResource.axd?scope=global&amp;type=Global_Images&amp;key=Help_16x16"
     Target="Help" NavigateUrl="prefscalendar.aspx" meta:resourcekey="CalendarOptsHelpLinkResource2" Text=""></SalesLogix:PageLink>
</asp:Panel>
</div>

<table border="0" cellpadding="1" cellspacing="0" class="formtable" style="margin-top:0px;">
	<col width="50%" /><col width="50%" />
	<tr>
        <td colspan="2" style="height: 14px" valign="top" class="highlightedCell">
            <asp:Label ID="lblCalendarOptions" runat="server" Font-Bold="True" Text="Calendar Options" meta:resourcekey="lblCalendarOptionsResource1"></asp:Label></td>
	</tr>
    <tr>
        <td>
			<span class="lbl"><asp:Label ID="lblDefCalView" runat="server" Text="DefaultCalendar View:" meta:resourcekey="lblDefCalViewResource1"></asp:Label></span>
            <span class="textcontrol">
            <asp:DropDownList ID="_defaultCalendarView" runat="server" CssClass="optionsInputClass"
                DataTextField="Key" DataValueField="Value" meta:resourcekey="_defaultCalendarViewResource1">
            </asp:DropDownList>
            </span>
        </td>
        <td>
			<span class="lbl"><asp:Label ID="lblViewCalFor" runat="server" Text="View Calendar For:" Width="144px" meta:resourcekey="lblViewCalForResource1"></asp:Label></span>
            <span class="textcontrol"><asp:DropDownList ID="UserList" runat="server" meta:resourcekey="UserListResource1"/></span>
		</td>
	</tr>
    <tr>
        <td>
			<span class="lbl"><asp:Label ID="lblShowHist" runat="server" Text="Show History on Calendar:" meta:resourcekey="lblShowHistResource1"></asp:Label></span>
			<span class="textcontrol">
				<asp:DropDownList ID="_showHistoryOnDayView" runat="server" CssClass="optionsInputClass"
					DataTextField="Key" DataValueField="Value" meta:resourcekey="_showHistoryOnDayViewResource1">
				</asp:DropDownList>
			</span>
        </td>
        <td>
			<span class="lbl"><asp:Label ID="lblShowActiv" runat="server" Text="Show on Activities:" meta:resourcekey="lblShowActivResource1"></asp:Label></span>
			<span class="textcontrol">
				<asp:DropDownList ID="_showOnActivities" runat="server" CssClass="optionsInputClass"
					DataTextField="Key" DataValueField="Value" meta:resourcekey="_showOnActivitiesResource1">
				</asp:DropDownList>
            </span>
        </td>
	</tr>
    <tr>
        <td>
        </td>
        <td>
			<span class="lbl"><asp:Label ID="lblDayStart" runat="server" Text="Day Start:" meta:resourcekey="lblDayStartResource1"></asp:Label></span>
			<span class="textcontrol">
				<asp:DropDownList ID="_dayStart" runat="server" CssClass="optionsInputClass"
					DataTextField="Key" DataValueField="Value" meta:resourcekey="_dayStartResource1">
				</asp:DropDownList>
            </span>
        </td>        
    </tr>
    <tr>
        <td>
        </td>
        <td>
			<span class="lbl"><asp:Label ID="lblDayEnd" runat="server" Text="Day End:" meta:resourcekey="lblDayEndResource1"></asp:Label></span>
			<span class="textcontrol">
				<asp:DropDownList ID="_dayEnd" runat="server" CssClass="optionsInputClass"
					DataTextField="Key" DataValueField="Value" meta:resourcekey="_dayEndResource1">
				</asp:DropDownList>
            </span>
        </td>        
    </tr>
    <tr>
        <td></td>
        <td>
			<span class="lbl"><asp:Label ID="lblDefInterval" runat="server" Text="Default Interval:" meta:resourcekey="lblDefIntervalResource1"></asp:Label></span>
			<span class="textcontrol">
				<asp:DropDownList ID="_defaultInterval" runat="server" CssClass="optionsInputClass"
					DataTextField="Key" DataValueField="Value" meta:resourcekey="_defaultIntervalResource1">
				</asp:DropDownList>
			</span>
		</td>
    </tr>
    <tr>
		<td></td>
		<td>
			<span class="lbl"><asp:Label ID="lblDefaultActivityType" runat="server" Text="Default Activity Type:" meta:resourcekey="lblDefaultActivityTypeResource1"></asp:Label></span>
			<span class="textcontrol">
				<asp:DropDownList id="ddlDefaultActivityType" runat="server" CssClass="optionsInputClass" meta:resourcekey="ddlDefaultActivityTypeResource1">
					<asp:ListItem Text="" Value="None" Selected="True" meta:resourcekey="ListItemResource1"></asp:ListItem>
					<asp:ListItem Text="Phone Call" Value="atPhoneCall" meta:resourcekey="ListItemResource2"></asp:ListItem>
					<asp:ListItem Text="Meeting" Value="atAppointment" meta:resourcekey="ListItemResource3"></asp:ListItem>
					<asp:ListItem Text="To-Do" Value="atToDo" meta:resourcekey="ListItemResource4"></asp:ListItem>
				</asp:DropDownList>
			</span>
        </td>
    </tr>
</table>