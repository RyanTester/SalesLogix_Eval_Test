<%@ Control Language="C#" AutoEventWireup="true" CodeFile="ActivityManager.ascx.cs" Inherits="SmartParts_Activity_ActivityManager" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>

<script type="text/javascript">
<!--
    function UpdateTab()
    {
        if (Sys)
        {
            Sys.WebForms.PageRequestManager.getInstance()._doPostBack("ctl00_TabControl_TabControlUpdatePanel", null);
        }
    }
-->
</script>

<div style="display:none">
<asp:Panel ID="ActivityReminders_RTools" runat="server">
<SalesLogix:PageLink ID="ActivityManagersHelpLink" runat="server" LinkType="HelpFileName" Target="Help" NavigateUrl="activitylookup.aspx" ImageUrl="~/images/icons/Help_16x16.gif" ToolTip="<%$ resources: Portal, Help_ToolTip %>"></SalesLogix:PageLink></asp:Panel>
</div>
<table cellpadding="4" cellspacing="5">
    <tr>
        <td valign="top">
            <asp:Label ID="lblUsers" runat="server" Text="Users:" meta:resourcekey="ActivityManager_Label_lblUsers" CssClass="slxlabel" style="margin-right:5px; margin-top:2px"></asp:Label>
            <asp:ListBox ID="UserList" runat="server" Rows="4" SelectionMode="Multiple" style="vertical-align:top;"></asp:ListBox></td>
        <td valign="top">
            <asp:Label ID="lblTimeFrame" runat="server" Text="Time Frame:" meta:resourcekey="ActivityManager_Label_lblTimeFrame" CssClass="slxlabel" style="margin-right:5px;"></asp:Label>
            <asp:DropDownList ID="TimeFrameList" runat="server" style="margin-right:1px; vertical-align:middle;">
                <asp:ListItem Text="All" Value="liAll" meta:resourcekey="ActivityManager_ListItem_All"></asp:ListItem>
                <asp:ListItem Selected="True" Text="Today" Value="liToday" meta:resourcekey="ActivityManager_ListItem_Today"></asp:ListItem>
                <asp:ListItem Text="Yesterday" Value="liYesterday" meta:resourcekey="ActivityManager_ListItem_Yesterday"></asp:ListItem>
                <asp:ListItem Text="Tomorrow" Value="liTomorrow" meta:resourcekey="ActivityManager_ListItem_Tomorrow"></asp:ListItem>
                <asp:ListItem Text="Current Week" Value="liCurrentWeek" meta:resourcekey="ActivityManager_ListItem_CurrentWeek"></asp:ListItem>
                <asp:ListItem Text="Current Month" Value="liCurrentMonth" meta:resourcekey="ActivityManager_ListItem_CurrentMonth"></asp:ListItem>
                <asp:ListItem Text="Current Quarter" Value="liCurrentQuarter" meta:resourcekey="ActivityManager_ListItem_CurrentQuarter"></asp:ListItem>
                <asp:ListItem Text="Current Year" Value="liCurrentYear" meta:resourcekey="ActivityManager_ListItem_CurrentYear"></asp:ListItem>
                <asp:ListItem Text="Last Week" Value="liLastWeek" meta:resourcekey="ActivityManager_ListItem_LastWeek"></asp:ListItem>
                <asp:ListItem Text="Last Month" Value="liLastMonth" meta:resourcekey="ActivityManager_ListItem_LastMonth"></asp:ListItem>
                <asp:ListItem Text="Last Quarter" Value="liLastQuarter" meta:resourcekey="ActivityManager_ListItem_LastQuarter"></asp:ListItem>
                <asp:ListItem Text="Last Year" Value="liLastYear" meta:resourcekey="ActivityManager_ListItem_LastYear"></asp:ListItem>
                <asp:ListItem Text="Week to Date" Value="liWeektoDate" meta:resourcekey="ActivityManager_ListItem_WeektoDate"></asp:ListItem>
                <asp:ListItem Text="Month to Date" Value="liMonthtoDate" meta:resourcekey="ActivityManager_ListItem_MonthtoDate"></asp:ListItem>
                <asp:ListItem Text="Quarter to Date" Value="liQuartertoDate" meta:resourcekey="ActivityManager_ListItem_QuartertoDate"></asp:ListItem>
                <asp:ListItem Text="Year to Date" Value="liYeartoDate" meta:resourcekey="ActivityManager_ListItem_YeartoDate"></asp:ListItem>
                <asp:ListItem Text="Next Week" Value="liNextWeek" meta:resourcekey="ActivityManager_ListItem_NextWeek"></asp:ListItem>
                <asp:ListItem Text="Next Month" Value="liNextMonth" meta:resourcekey="ActivityManager_ListItem_NextMonth"></asp:ListItem>
                <asp:ListItem Text="Next Quarter" Value="liNextQuarter" meta:resourcekey="ActivityManager_ListItem_NextQuarter"></asp:ListItem>
                <asp:ListItem Text="Next Year" Value="liNextYear" meta:resourcekey="ActivityManager_ListItem_NextYear"></asp:ListItem>
            </asp:DropDownList>
            <asp:ImageButton ID="SearchBtn" runat="server" ImageUrl="../../images/icons/Find_16x16.gif" OnClick="SearchBtn_Click" style="vertical-align:middle; margin-left:5px;" AlternateText="Find" meta:resourcekey="ActivityManager_Image_Find" /></td>
    </tr>
</table>
