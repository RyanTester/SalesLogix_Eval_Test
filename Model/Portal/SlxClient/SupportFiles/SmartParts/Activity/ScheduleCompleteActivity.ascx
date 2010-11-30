<%@ Control Language="C#" AutoEventWireup="true" CodeFile="ScheduleCompleteActivity.ascx.cs" Inherits="SmartParts_Activity_ScheduleCompleteActivity" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.DependencyLookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Lookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>


<style type="text/css">
#TitleBar IMG
{
    margin : 4px;
}
#TitleBar
{
    font-size : 110%;
    font-weight : bold;
}

</style>
<div style="display:none">
<asp:Panel ID="ScheduleCompleteActivity_LTools" runat="server">
</asp:Panel>
<asp:Panel ID="ScheduleCompleteActivity_CTools" runat="server">
</asp:Panel>
<asp:Panel ID="ScheduleCompleteActivity_RTools" runat="server">
    <SalesLogix:PageLink ID="ScheduleCompleteActivityHelpLink" runat="server" LinkType="HelpFileName" ToolTip="<%$ resources: Portal, Help_ToolTip %>" Target="Help" NavigateUrl="completeunschedactivity" ImageUrl="~/images/icons/Help_16x16.gif"></SalesLogix:PageLink>
</asp:Panel>
</div>

<div style="margin:5px">
<span id="TitleBar">
    <asp:Image runat="server" ID="TitleBarImage" ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=complete_activity_24x24" />
    <asp:Label runat="server" ID="TitleBarLabel" Text="<%$ resources: TitleBarLabel.Text %>" />
</span>
<table>
    <tr>
        <td>  
            <span class="twocollbl">&nbsp;</span>
            <div style="margin:5px">
                <asp:RadioButton runat="Server" ID="rbContact" text="<%$ resources: rbContact.Text %>" GroupName="PersonType" AutoPostBack="true" />
                <asp:RadioButton runat="Server" ID="rbLead" text="<%$ resources: rbLead.Text %>" GroupName="PersonType" AutoPostBack="true" />
            </div>
        </td>
    </tr>
    <tr><td><div id="contactsdiv" runat="server">
<table>
    <tr>
        <td width="150"><span class="lbl"><asp:Label ID="LabelContact" Text="<%$ resources: labelContact.Text %>"  AssociatedControlID="Contact" runat="server"></asp:Label></span></td>
        <td  width="300">
            <span class="textcontrol">
                <SalesLogix:LookupControl runat="server" ID="Contact" 
                    AutoPostBack="true" 
                    AllowClearingResult="true" 
                    OverrideSeedOnSearch="true" 
                    LookupEntityName="Contact" 
                    LookupEntityTypeName="Sage.Entity.Interfaces.IContact, Sage.Entity.Interfaces, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null"
                    SeedProperty="Account.Id"
                    >
                    <LookupProperties>
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Contact.NameLF.PropertyHeader %>" 
                            PropertyName="NameLF" PropertyFormat="None" UseAsResult="True" />
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Contact.AccountName.PropertyHeader %>" 
                            PropertyName="AccountName" PropertyFormat="None" UseAsResult="True" />
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Contact.Address.City.PropertyHeader %>" 
                            PropertyName="Address.City" PropertyFormat="None" UseAsResult="True" />
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Contact.Address.State.PropertyHeader %>" 
                            PropertyName="Address.State" PropertyFormat="None" UseAsResult="True" />
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Contact.WorkPhone.PropertyHeader %>" 
                            PropertyName="WorkPhone" PropertyFormat="None" UseAsResult="True" />
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Contact.Email.PropertyHeader %>" 
                            PropertyName="Email" PropertyFormat="None" UseAsResult="True" />
                    </LookupProperties>
                    <LookupPreFilters />
                </SalesLogix:LookupControl>
             </span>
        </td>
    </tr>

    <tr>
        <td>
            <span class="lbl"><asp:Label ID="LabelAccount" Text="<%$ resources: labelAccount.Text %>" AssociatedControlID="Account" runat="server"></asp:Label></span>
        </td>
        <td>
            <span class="textcontrol">
                <SalesLogix:LookupControl runat="server" ID="Account" AutoPostBack="true" AllowClearingResult="true" 
                    LookupEntityName="Account" 
                    LookupEntityTypeName="Sage.Entity.Interfaces.IAccount, Sage.Entity.Interfaces, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null" >
                    <LookupProperties>
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Account.AccountName.PropertyHeader %>" 
                            PropertyName="AccountName" PropertyFormat="None" UseAsResult="True" />
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Account.Address.City.PropertyHeader %>" 
                            PropertyName="Address.City" PropertyFormat="None" UseAsResult="True" />
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Account.Address.State.PropertyHeader %>" 
                            PropertyName="Address.State" PropertyFormat="None" UseAsResult="True" />
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Account.MainPhone.PropertyHeader %>" 
                            PropertyName="MainPhone" PropertyFormat="None" UseAsResult="True" />
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Account.Type.PropertyHeader %>" 
                            PropertyName="Type" PropertyFormat="None" UseAsResult="True" />
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Account.SubType.PropertyHeader %>" 
                            PropertyName="SubType" PropertyFormat="None" UseAsResult="True" />                            
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Account.Status.PropertyHeader %>" 
                            PropertyName="Status" PropertyFormat="None" UseAsResult="True" />
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Account.AccountManager.PropertyHeader %>" 
                            PropertyName="AccountManager.UserInfo.UserName" PropertyFormat="User" ExcludeFromFilters="true" UseAsResult="True" />
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Account.Owner.OwnerDescription.PropertyHeader %>" 
                            PropertyName="Owner.OwnerDescription" PropertyFormat="None" UseAsResult="True" />
                    </LookupProperties>
                    <LookupPreFilters />
                </SalesLogix:LookupControl>
             </span>
          </td>
    </tr>
    <tr>
        <td>
            <span class="lbl"><asp:Label ID="LabelOpportunity" Text="<%$ resources: LabelOpportunity.Text %>" AssociatedControlID="Opportunity" runat="server"></asp:Label></span>
        </td>
        <td>
            <span class="textcontrol">
                <SalesLogix:LookupControl runat="server" ID="Opportunity" AutoPostBack="true" AllowClearingResult="true" 
                    LookupEntityName="Opportunity" OverrideSeedOnSearch="true" SeedProperty="Account.Id"
                    LookupEntityTypeName="Sage.Entity.Interfaces.IOpportunity, Sage.Entity.Interfaces, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null"  >
                    <LookupProperties>
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Opportunity.AccountManager.PropertyHeader %>" 
                            PropertyName="AccountManager.UserInfo.UserName" PropertyFormat="User" ExcludeFromFilters="true" UseAsResult="True" />    
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Opportunity.Description.PropertyHeader %>" 
                            PropertyName="Description" PropertyFormat="None" UseAsResult="True" />                                            
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Opportunity.Account.AccountName.PropertyHeader %>" 
                            PropertyName="Account.AccountName" PropertyFormat="None" UseAsResult="True" />
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Opportunity.Stage.PropertyHeader %>" 
                            PropertyName="Stage" PropertyFormat="None" UseAsResult="True" />
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Opportunity.Status.PropertyHeader %>" 
                            PropertyName="Status" PropertyFormat="None" UseAsResult="True" />
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Opportunity.Owner.OwnerDescription.PropertyHeader %>" 
                            PropertyName="Owner.OwnerDescription" PropertyFormat="None" UseAsResult="True" />                            
                    </LookupProperties>
                    <LookupPreFilters />
                </SalesLogix:LookupControl>
            </span>
        </td>
    </tr>
    <tr>
        <td>
            <span class="lbl"><asp:Label ID="LabelTicket" Text="<%$ resources: LabelTicket.Text %>"  AssociatedControlID="Ticket" runat="server"></asp:Label></span>
        </td>
        <td >
            <span class="textcontrol">
                <SalesLogix:LookupControl runat="server" ID="Ticket" AutoPostBack="true" AllowClearingResult="true" 
                    LookupEntityName="Ticket" OverrideSeedOnSearch="true" SeedProperty="Account.Id"
                    LookupEntityTypeName="Sage.Entity.Interfaces.ITicket, Sage.Entity.Interfaces, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null"  >
                    <LookupProperties>
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Ticket.TicketNumber.PropertyHeader %>" 
                            PropertyName="TicketNumber" PropertyFormat="None" UseAsResult="True" />                    
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Ticket.Account.AccountName.PropertyHeader %>" 
                            PropertyName="Account.AccountName" PropertyFormat="None" UseAsResult="True" />
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Ticket.Contact.NameLF.PropertyHeader %>" 
                            PropertyName="Contact.NameLF" PropertyFormat="None" UseAsResult="True" />
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Ticket.Contact.WorkPhone.PropertyHeader %>" 
                            PropertyName="Contact.WorkPhone" PropertyFormat="None" UseAsResult="True" />                            
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Ticket.StatusCode.PropertyHeader %>" 
                            PropertyName="StatusCode" PropertyFormat="PickList" PropertyType="SalesLogix.PickList" UseAsResult="True" />
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Ticket.Urgency.Description.PropertyHeader %>" 
                            PropertyName="Urgency.Description" PropertyFormat="None" UseAsResult="True" />                            
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Ticket.Area.PropertyHeader %>" 
                            PropertyName="Area" PropertyFormat="None" UseAsResult="True" />   
                    </LookupProperties>
                    <LookupPreFilters />
                </SalesLogix:LookupControl>
             </span>
        </td>
    </tr>
</table>
</div>
<div id="leadsdiv" runat="server">
    <table>
        <col width="150px" /><col width="300px" />
        <tr>
            <td>  
                <span class="lbl">
                    <asp:Label ID="Lead_lz" AssociatedControlID="LeadId" runat="server" Text="<%$ resources: Name_lz.Text %>"></asp:Label>
                </span>
             </td><td>
               <span class="textcontrol">
                    <SalesLogix:LookupControl runat="server"  ID="LeadId" AutoPostBack="true" AllowClearingResult="true" 
                        LookupEntityName="Lead" 
                        LookupEntityTypeName="Sage.Entity.Interfaces.ILead, Sage.Entity.Interfaces, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null" >
                        <LookupProperties>
                            <SalesLogix:LookupProperty  PropertyHeader="<%$ resources: Lead.LastName.PropertyHeader %>"                   PropertyName="LastName" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                            <SalesLogix:LookupProperty  PropertyHeader="<%$ resources: Lead.FirstName.PropertyHeader %>"                   PropertyName="FirstName" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                            <SalesLogix:LookupProperty  PropertyHeader="<%$ resources: Lead.Company.PropertyHeader %>"                    PropertyName="Company" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                            <SalesLogix:LookupProperty  PropertyHeader="<%$ resources: Lead.Address.City.PropertyHeader %>"               PropertyName="Address.City" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                            <SalesLogix:LookupProperty  PropertyHeader="<%$ resources: Lead.Address.State.PropertyHeader %>"              PropertyName="Address.State" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                            <SalesLogix:LookupProperty  PropertyHeader="<%$ resources: Lead.Address.PostalCode.PropertyHeader %>"         PropertyName="Address.PostalCode" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                            <SalesLogix:LookupProperty  PropertyHeader="<%$ resources: Lead.Status.PropertyHeader %>"                     PropertyName="Status" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                            <SalesLogix:LookupProperty  PropertyHeader="<%$ resources: Lead.Owner.OwnerDescription.PropertyHeader %>"     PropertyName="Owner.OwnerDescription" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                        </LookupProperties>
                        <LookupPreFilters>
                        </LookupPreFilters>
                    </SalesLogix:LookupControl>
                </span> 
            </td>
        </tr>
        <tr>
            <td>  
                <span class="lbl">
                    <asp:Label ID="Company_lz" AssociatedControlID="Company" runat="server" Text="<%$ resources: Company_lz.Text %>"></asp:Label>
                </span>
            </td><td>
                <span class="textcontrol">
                    <asp:TextBox runat="server" id="Company" Enabled="false"></asp:TextBox>
                </span> 
            </td>
        </tr>
    </table>
</div>
</td></tr></table>
<hr />

<table>
    <tr>
        <td colspan="2">
            <asp:RadioButton ID="NewUnscheduledActivity" runat="server" 
                GroupName="Main" 
                Text="<%$ resources: NewUnscheduledActivity.Text %>" 
                AutoPostBack="True" 
                Checked="True" />
        </td>
    </tr>
    <tr>
        <td width="60">&nbsp;</td>
        <td>
           <asp:RadioButtonList ID="ActivityTypeButtonList" runat="server" RepeatDirection="horizontal">
                <asp:ListItem Text="<%$ resources: ActivityType.ListItemPhoneCall.Text %>" Value="atPhoneCall" Selected="true" ActivityTypeID="Phone"></asp:ListItem>
                <asp:ListItem Text="<%$ resources: ActivityType.ListItemMeeting.Text %>"  Value="atMeeting" ActivityTypeID="Meeting"></asp:ListItem>
                <asp:ListItem Text="<%$ resources: ActivityType.ListItemToDo.Text %>" Value="atToDo" ActivityTypeID="ToDo"></asp:ListItem>
            </asp:RadioButtonList>
        </td>
    </tr>
    <tr>
        <td colspan="2">
            <asp:Button ID="btnContinue" runat="server" 
                Text="<%$ resources: btnContinue.Text %>" 
                OnClick="btnContinue_Click" />
        </td>
    </tr>
</table>

<hr />
<asp:RadioButton ID="CompleteScheduledActivity" runat="server" 
    GroupName="Main" 
    Text="<%$ resources: CompleteScheduledActivity.Text %>" 
    AutoPostBack="True" />
<br />
<SalesLogix:SlxGridView ID="OpenActivities" runat="server" AutoGenerateColumns="False" 
    CellPadding="4" ForeColor="#333333" GridLines="None" CssClass="datagrid"  
    AllowSorting="true" OnSorting="OpenActivities_Sorting" DataSourceID="OpenActivitiesDS" ShowSortIcon="True">
    <Columns>
        <asp:TemplateField HeaderText="<%$ resources: TemplateFieldComplete.HeaderText %>">
            <ItemTemplate>
                <asp:HyperLink ID="HyperLink1" runat="server" Target="_top" Width="65px" 
                    NavigateUrl='<%# BuildCompleteActivityNavigateURL(Eval("ActivityID")) %>' 
                    Text="<%$ resources: TemplateFieldComplete.HeaderText %>" />
            </ItemTemplate>
        </asp:TemplateField>
         <asp:TemplateField HeaderText="<%$ resources: TemplateFieldType.HeaderText %>"     
             SortExpression="Type">
            <ItemTemplate>
                <asp:ImageButton ID="ImageButton1" runat="server" 
                    ImageUrl='<%# GetImage(Eval("Type")) %>' AlternateText='<%# GetToolTip(Eval("Type")) %>' 
                    />&nbsp;<%# GetToolTip(Eval("Type")) %>
            </ItemTemplate>
        </asp:TemplateField>
        <asp:TemplateField HeaderText="<%$ resources: TemplateFieldDateTime.HeaderText %>"
             SortExpression="StartDate">
            <ItemTemplate><%# GetLocalDateTime(Eval("StartDate"), Eval("TimeLess"))%></ItemTemplate>
        </asp:TemplateField>
         <asp:BoundField DataField="Notes" HeaderText="<%$ resources: TemplateFieldNotes.HeaderText %>" 
             SortExpression="Notes"/>
     </Columns>
</SalesLogix:SlxGridView>

<asp:ObjectDataSource ID="OpenActivitiesDS" runat="server" 
    SelectMethod="GetActivitiesForUser" 
    TypeName="ActivityFacade">
    <SelectParameters>
        <asp:SessionParameter Name="entityName" SessionField="entityName" Type="String" />
        <asp:SessionParameter Name="entityId" SessionField="entityId" Type="String" />
    </SelectParameters>
</asp:ObjectDataSource>

<div style="float:right;">
    <asp:Button ID="CancelButton" runat="server" Text="<%$ resources: CancelText %>" />
</div>

</div>
