<%@ Control language="C#" %>
<%@ Register tagprefix="sp" namespace="Sage.Platform.WebPortal.SmartParts" assembly="Sage.Platform.WebPortal" %>
<sp:NavItemCollection runat="server" id="contextActivityGridMenu" meta:resourcekey="contextActivityGridMenu" NavURL="" Target="">
    <sp:NavItem ID="menuItemViewActivity" meta:resourcekey="menuItemViewActivity" NavURL="javascript:Link.editActivity('%ACTIVITYID%');" IsSpacer="False" Target="">
    </sp:NavItem>  
    <sp:NavItem ID="menuItemViewActivityOccurrence" meta:resourcekey="menuItemViewActivity" NavURL="javascript:Link.editActivityOccurrence('%ACTIVITYID%','%STARTDATE%');" IsSpacer="False" Target="">
    </sp:NavItem>
    <sp:NavItem ID="menuItemCompleteActivity" meta:resourcekey="menuItemCompleteActivity" NavURL="javascript:Link.completeActivity('%ACTIVITYID%');" IsSpacer="False" Target="">
    </sp:NavItem>
    <sp:NavItem ID="menuItemCompleteActivityOccurrence" meta:resourcekey="menuItemCompleteActivity" NavURL="javascript:Link.completeActivityOccurrence('%ACTIVITYID%','%STARTDATE%');" IsSpacer="False" Target="">
    </sp:NavItem>
    <sp:NavItem ID="menuItemDeleteActivity" meta:resourcekey="menuItemDeleteActivity" NavURL="javascript:Link.deleteActivity('%ACTIVITYID%');" IsSpacer="False" Target="">
    </sp:NavItem>
    <sp:NavItem ID="menuItemDeleteActivityOccurrence" meta:resourcekey="menuItemDeleteActivity" NavURL="javascript:Link.deleteActivityOccurrence('%ACTIVITYID%','%STARTDATE%');" IsSpacer="False" Target="">
    </sp:NavItem> 
    <sp:NavItem ID="aafbdfbbbfa" meta:resourcekey="aafbdfbbbfa" NavURL="" IsSpacer="True" LargeImageURL="" SmallImageURL="" Target="">
    </sp:NavItem>    
    <sp:NavItem ID="menuItemViewContact" meta:resourcekey="menuItemViewContact" NavURL="Contact.aspx?entityid=%CONTACTID%" IsSpacer="False" Target="">
    </sp:NavItem>                                
    <sp:NavItem ID="menuItemViewAccount" meta:resourcekey="menuItemViewAccount" NavURL="Account.aspx?entityid=%ACCOUNTID%" IsSpacer="False" Target="">    
    </sp:NavItem>     
    <sp:NavItem ID="menuItemViewLead" meta:resourcekey="menuItemViewLead" NavURL="Lead.aspx?entityid=%LEADID%" IsSpacer="False" Target="">
    </sp:NavItem> 
    <sp:NavItem ID="menuItemViewOpportunity" meta:resourcekey="menuItemViewOpportunity" NavURL="Opportunity.aspx?entityid=%OPPORTUNITYID%" IsSpacer="False" Target="">
    </sp:NavItem>          
    <sp:NavItem ID="menuItemViewTicket" meta:resourcekey="menuItemViewTicket" NavURL="Ticket.aspx?entityid=%TICKETID%" IsSpacer="False" Target="">
    </sp:NavItem>          
</sp:NavItemCollection>