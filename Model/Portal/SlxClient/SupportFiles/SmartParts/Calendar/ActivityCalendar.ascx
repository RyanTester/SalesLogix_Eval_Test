<%@ Control Language="C#" CodeFile="ActivityCalendar.ascx.cs" 
    Inherits="SmartParts_Calendar_ActivityCalendar" 
    AutoEventWireup="true" %>
<%@ Register TagPrefix="ig_sched" Namespace="Infragistics.WebUI.WebSchedule" 
    Assembly="Infragistics2.WebUI.WebSchedule.v7.1, Version=7.1.20071.40, Culture=neutral, PublicKeyToken=7dd5c3163f2cd0cb" %>
<%@ Register TagPrefix="Slx" Namespace="Sage.SalesLogix.Web.Controls" 
    Assembly="Sage.SalesLogix.Web.Controls" %>
<%@ Register TagPrefix="Srp" Namespace="Sage.SalesLogix.Web.Controls.ScriptResourceProvider" 
    Assembly="Sage.SalesLogix.Web.Controls" %>    

<Srp:ScriptResourceProvider ID="SR" runat="server">
    <Keys>
        <Srp:ResourceKeyName Key="EventList_Title" />
        <Srp:ResourceKeyName Key="EventList_Column_Start" />
        <Srp:ResourceKeyName Key="EventList_Column_End" />
        <Srp:ResourceKeyName Key="EventList_Column_Type" />
        <Srp:ResourceKeyName Key="EventList_EmptyText" />
        <Srp:ResourceKeyName Key="_EventType" />
        <Srp:ResourceKeyName Key="Active_EventType" />
        <Srp:ResourceKeyName Key="Business Trip_EventType" />
        <Srp:ResourceKeyName Key="Conference_EventType" />
        <Srp:ResourceKeyName Key="Holiday_EventType" />
        <Srp:ResourceKeyName Key="Off_EventType" />
        <Srp:ResourceKeyName Key="Trade Show_EventType" />
        <Srp:ResourceKeyName Key="Unavailable_EventType" />
        <Srp:ResourceKeyName Key="Vacation_EventType" />
    </Keys>
</Srp:ScriptResourceProvider>

<div id="calendar_left">
    <ig_sched:WebCalendarView ID="SlxWebCalendarView" runat="server" 
        meta:resourcekey="SlxWebCalendarViewResource1" 
    />
    
    <div id="calendar_events"></div>
</div>

<div id="calendar_center">
    <ig_sched:WebDayView ID="SlxWebDayView" runat="server"
        meta:resourcekey="SlxWebDayViewResource1" 
        style="display: none"
    />
    <ig_sched:WebWeekView ID="SlxWebWeekView" runat='server' 
        meta:resourcekey="SlxWebWeekViewResource1"
        style="display: none"
    />
    <ig_sched:WebMonthView ID="SlxWebMonthView" runat="server"
        meta:resourcekey="SlxWebMonthViewResource1"
        style="display: none"
    />
</div>

<ig_sched:WebScheduleInfo ID="SlxWebScheduleInfo" runat="server" />

<asp:button ID="btnDeleteActivity" runat="server" 
    style="display: none" 
    OnClick="btnDeleteActivity_Click" />
<asp:button ID="btnEditActivity" runat="server" 
    style="display: none" 
    OnClick="btnEditActivity_Click" />
<asp:button ID="btnCompleteActivity" runat="server" 
    style="display: none" 
    OnClick="btnCompleteActivity_Click" />

<asp:HiddenField ID="hfCurrentActivity" runat="server" />
<asp:HiddenField ID="hfOccurrenceDate" runat="server" />
<asp:HiddenField ID="hfCurrentActivityIsOccurence" runat="server" />
<asp:HiddenField ID="hfCurrentView" runat="server" />

<div style="display: none">
    <asp:ImageButton ID="DayViewBtn" runat="server" 
        EnableViewState="false"
        OnClick="DayViewBtn_Click" 
        AlternateText="Day View" 
        ImageUrl="~/images/icons/CalendarDay_16x16.gif" 
        meta:resourcekey="DayViewBtnResource1"
    />
    <asp:ImageButton ID="WeekViewBtn" runat="server" 
        EnableViewState="false"
        OnClick="WeekViewBtn_Click" 
        AlternateText="Week View" 
        ImageUrl="~/images/icons/CalendarWeek_16x16.gif" 
        meta:resourcekey="WeekViewBtnResource1" 
    />
    <asp:ImageButton ID="MonthViewBtn" runat="server" 
        EnableViewState="false"
        OnClick="MonthViewBtn_Click" 
        AlternateText="Month View" 
        ImageUrl="~/images/icons/CalendarMonth_16x16.gif" 
        meta:resourcekey="MonthViewBtnResource1"
    />
    <asp:DropDownList ID="UserList" runat="server"
        AutoPostBack="True" 
        OnSelectedIndexChanged="UserList_SelectedIndexChanged" 
        meta:resourcekey="UserListResource1"
    />
    <Slx:PageLink ID="CalendarHelpLink" runat="server" 
        EnableViewState="false"
        LinkType="HelpFileName" 
        ToolTip="<%$ resources: Portal, Help_ToolTip %>" 
        Target="Help" 
        NavigateUrl="caldailyforact.aspx" 
        ImageUrl="~/images/icons/Help_16x16.gif" 
    />
</div>

<script type="text/javascript" src="jscript/calendar.js"></script>
<script type="text/javascript">

// used by jscript/calendar.js

var clientId = {
    scheduleInfo: "<%= SlxWebScheduleInfo.ClientID %>",
    dayView: "<%= SlxWebDayView.ClientID %>",
    weekView: "<%= SlxWebWeekView.ClientID %>",
    monthView: "<%= SlxWebMonthView.ClientID %>",
    currentActivity: "<%= hfCurrentActivity.ClientID %>",
    currentActivityIsOccurence: "<%= hfCurrentActivityIsOccurence.ClientID %>",
    occurrenceDate: "<%= hfOccurrenceDate.ClientID %>",
    btnEditActivity: "<%= btnEditActivity.ClientID %>",
    btnDeleteActivity: "<%= btnDeleteActivity.ClientID %>",
    btnCompleteActivity: "<%= btnCompleteActivity.ClientID %>"
};

var options = {
    defaultActivityType: "<%= Options.DefaultActivityType %>"
};

</script>
