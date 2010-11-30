<%@ Control language="C#" %>
<%@ Register tagprefix="sp" namespace="Sage.Platform.WebPortal.SmartParts" assembly="Sage.Platform.WebPortal" %>
<sp:NavItemCollection runat="server" id="contextScheduleActivity" meta:resourcekey="contextScheduleActivity" NavURL="" Target="" NavRenderMode="asContextMenu">
        <sp:NavItem ID="NavItem1" meta:resourcekey="menuItemSchedulePhoneCall" NavURL="javascript:ScheduleActivity('atPhoneCall');" IsSpacer="False" LargeImageURL="" SmallImageURL="" Target="">
    </sp:NavItem>
        <sp:NavItem ID="NavItem2" meta:resourcekey="menuItemScheduleMeeting" NavURL="javascript:ScheduleActivity('atAppointment');" IsSpacer="False" LargeImageURL="" SmallImageURL="" Target="">
    </sp:NavItem>
        <sp:NavItem ID="NavItem3" meta:resourcekey="menuItemtScheduleToDo" NavURL="javascript:ScheduleActivity('atToDo');" IsSpacer="False" LargeImageURL="" SmallImageURL="" Target="">
    </sp:NavItem>
        <sp:NavItem ID="NavItem4" meta:resourcekey="menuItemSchedulePersonalActivity" NavURL="javascript:ScheduleActivity('atPersonal');" IsSpacer="False" LargeImageURL="" SmallImageURL="" Target="">
    </sp:NavItem>
        <sp:NavItem ID="NavItem5" meta:resourcekey="menuItemScheduleEvent" NavURL="javascript:ScheduleEvent();" IsSpacer="False" LargeImageURL="" SmallImageURL="" Target="">
        </sp:NavItem>
</sp:NavItemCollection>