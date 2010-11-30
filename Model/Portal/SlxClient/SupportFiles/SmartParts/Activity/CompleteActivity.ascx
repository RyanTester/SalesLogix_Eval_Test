<%@ Control Language="C#" AutoEventWireup="true" CodeFile="CompleteActivity.ascx.cs" Inherits="SmartParts_Activity_CompleteActivity" %>
<%@ Register Assembly="Sage.SalesLogix.Client.GroupBuilder" Namespace="Sage.SalesLogix.Client.GroupBuilder" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.PickList" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.DependencyLookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Lookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>

<div style="display:none">
    <asp:Panel ID="LeftTools" runat="server" />
    <asp:Panel ID="CenterTools" runat="server" />
    <asp:Panel ID="RightTools" runat="server">
<%--       <asp:Button runat="server" ID="CompleteAsScheduled" Text="<%$ resources: CompleteAsScheduled.Text %>" ToolTip="<%$ resources: CompleteAsScheduled.ToolTip %>" CssClass="slxbutton" Width="<%$ resources: CompleteAsScheduled.Width %>" />
        <asp:Button runat="server" ID="CompleteNow" Text="<%$ resources: CompleteNow.Text %>" ToolTip="<%$ resources: CompleteNow.ToolTip %>" CssClass="slxbutton" Width="<%$ resources: CompleteNow.Width %>"/>
--%>        <SalesLogix:PageLink ID="lnkCompleteActivityHelp" runat="server" LinkType="HelpFileName"
            ToolTip="<%$ resources: Portal, Help_ToolTip %>" Target="Help" NavigateUrl="completeactivity.aspx"
            ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16">
        </SalesLogix:PageLink>
    </asp:Panel>
</div>

<table border="0" cellpadding="1" cellspacing="0" class="formtable" style="width: 98%;">
    <col width="50%" /><col width="50%" />
    <tr>
        <td>  
            <span class="twocollbl"><asp:Label ID="Completed_lz"  AssociatedControlID="Completed" runat="server" Text="<%$ resources: Completed_lz.Text %>"></asp:Label></span> 
            <span  class="twocoltextcontrol" ><SalesLogix:DateTimePicker runat="server" ID="Completed" /></span> 
        </td>
        <td>  
           <span class="twocollbl"><asp:Label ID="Scheduled_lz" AssociatedControlID="Scheduled" runat="server" Text="<%$ resources: Scheduled_lz.Text %>"></asp:Label></span> 
            <span  class="twocoltextcontrol" >
                <SalesLogix:DateTimePicker runat="server" ID="Scheduled" />
            </span> 
        </td>
    </tr>
    <tr>
        <td>
            <span class="twocollbl"><asp:Label ID="Duration_lz" AssociatedControlID="Duration" runat="server" Text="<%$ resources: Duration_lz.Text %>"></asp:Label></span> 
            <span><SalesLogix:DurationPicker runat="server" ID="Duration"  Width="55%" MaxLength="3"  /></span> 
        </td>
        <td>  
            <span><asp:CheckBox runat="server" ID="Timeless" Text="" AccessKey="d" AutoPostBack="true"  /></span> 
            <span class="lblright"><asp:Label ID="Timeless_lz"  AssociatedControlID="Timeless" runat="server" Text="<%$ resources: Timeless_lz.Text %>"></asp:Label></span>
        </td>
    </tr>
    <tr>
        <td>  
            <span class="twocollbl"><asp:Label ID="Result_lz" AssociatedControlID="Result" runat="server" Text="<%$ resources: Result_lz.Text %>"></asp:Label></span> 
            <span  class="twocoltextcontrol" >
                <SalesLogix:PickListControl runat="server" ID="Result" PickListName="Meeting Result Codes" MustExistInList="false" />
            </span> 
        </td>
        <td>
            <span ><asp:CheckBox runat="server" ID="CarryOverNotes" Text=""  /></span> 
            <span class="lblright"><asp:Label ID="CarryOverNotes_lz" AssociatedControlID="CarryOverNotes" runat="server" Text="<%$ resources: CarryOverNotes_lz.Text %>"></asp:Label></span>      
        </td>
    </tr>
    <tr>
        <td>  
            <span class="twocollbl"><asp:Label ID="FollowUp_lz" AssociatedControlID="FollowUp" runat="server" Text="<%$ resources: FollowUp_lz.Text %>"></asp:Label></span> 
            <span  class="twocoltextcontrol" >
                <asp:ListBox runat="server" ID="FollowUp"  SelectionMode="Single" Rows="1"   >
                    <asp:ListItem  Text="<%$ resources: FollowUp.ListItem.None %>" Value="None" meta:resourcekey="FollowUp_rsc_1" />
                    <asp:ListItem  Text="<%$ resources: FollowUp.ListItem.PhoneCall %>" Value="atPhoneCall" meta:resourcekey="FollowUp_rsc_2" />
                    <asp:ListItem  Text="<%$ resources: FollowUp.ListItem.Meeting %>" Value="atMeeting" meta:resourcekey="FollowUp_rsc_3" />
                    <asp:ListItem  Text="<%$ resources: FollowUp.ListItem.ToDo %>" Value="atToDo" meta:resourcekey="FollowUp_rsc_4" />
                </asp:ListBox>
            </span> 
        </td>
        <td>
             <span ><asp:CheckBox runat="server" ID="CarryOverAttachments" Text=""  /></span> 
            <span class="lblright"><asp:Label ID="CarryOverAttachments_lz" AssociatedControlID="CarryOverAttachments" runat="server" Text="<%$ resources: CarryOverAttachments_lz.Text %>"></asp:Label></span> 
        </td>      
    </tr>
    <tr><td colspan="2" style="padding:1px 0px;"><span><hr /></span></td></tr>
    <tr>
        <td>
            <span class="twocollbl">&nbsp;</span>
            <asp:RadioButton runat="Server" ID="rbContact" text="<%$ resources: rbContact.Text %>" GroupName="PersonType" AutoPostBack="true" Enabled="false" />
            <asp:RadioButton runat="Server" ID="rbLead" text="<%$ resources: rbLead.Text %>" GroupName="PersonType" AutoPostBack="true" Enabled="false" />
        </td>
        <td></td>
    </tr>
    <tr>
        <td colspan="2">
        <div runat="server" id="leadsdiv">
        <table border="0" cellpadding="1" cellspacing="0" class="formtable">
            <col width="50%" /><col width="50%" />
            <tr>
                <td>  
                    <span class="twocollbl">
                        <asp:Label ID="Lead_lz" AssociatedControlID="LeadId" runat="server" Text="<%$ resources: LeadId_lz.Text %>"></asp:Label>
                    </span>
                    <span class="twocoltextcontrol">
                            <SalesLogix:LookupControl Width="95%" runat="server"  ID="LeadId" AutoPostBack="true" AllowClearingResult="true" OverrideSeedOnSearch="true" LookupBindingMode="string" ReturnPrimaryKey="true" LookupEntityName="Lead" LookupEntityTypeName="Sage.Entity.Interfaces.ILead, Sage.Entity.Interfaces, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null" >
                            <LookupProperties>
                                <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_LastName.PropertyHeader %>" PropertyName="LastName" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                                <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_FirstName.PropertyHeader %>" PropertyName="FirstName" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                                <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Company.PropertyHeader %>" PropertyName="Company" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                                <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_City.PropertyHeader %>" PropertyName="Address.City" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                                <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_State.PropertyHeader %>" PropertyName="Address.State" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                                <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Postal.PropertyHeader %>" PropertyName="Address.PostalCode" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                                <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Status.PropertyHeader %>" PropertyName="Status" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                                <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Owner.PropertyHeader %>" PropertyName="Owner.OwnerDescription" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                            </LookupProperties>
                            <LookupPreFilters>
                            </LookupPreFilters>
                        </SalesLogix:LookupControl>
                    </span> 
                </td>
                <td></td>
            </tr>
            <tr>
                <td>  
                    <span class="twocollbl">
                        <asp:Label ID="Company_lz" AssociatedControlID="Company" runat="server" Text="<%$ resources: Company_lz.Text %>"></asp:Label>
                    </span>
                    <span class="twocoltextcontrol">
                        <asp:Label runat="server" id="Company"></asp:Label>
                    </span> 
                </td>
                <td></td>
            </tr>
        </table>
        </div>
        <div runat="server" id="contactsdiv">
        <table border="0" cellpadding="1" cellspacing="0" class="formtable">
            <col width="25%" /><col width="25%" /><col width="25%" /><col width="25%" />
            <tr>
                <td colspan="2">  
                    <span class="twocollbl">
                        <asp:Label ID="ContactId_lz" AssociatedControlID="ContactId" runat="server" Text="<%$ resources: ContactId_lz.Text %>"></asp:Label>
                    </span>
                    <span class="twocoltextcontrol">
                            <SalesLogix:LookupControl Width="95%" runat="server"  ID="ContactId" AutoPostBack="true" AllowClearingResult="true" OverrideSeedOnSearch="true" LookupBindingMode="string" ReturnPrimaryKey="true" LookupEntityName="Contact" LookupEntityTypeName="Sage.Entity.Interfaces.IContact, Sage.Entity.Interfaces, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null" SeedProperty="Account.Id"  >
                            <LookupProperties>
                                <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Name.PropertyHeader %>" PropertyName="NameLF" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                                <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Account.PropertyHeader %>" PropertyName="AccountName" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                                <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_City.PropertyHeader %>" PropertyName="Address.City" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                                <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_State.PropertyHeader%>" PropertyName="Address.State" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                                <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_WorkPhone.PropertyHeader %>" PropertyName="WorkPhone" PropertyFormat="Phone"  UseAsResult="True"></SalesLogix:LookupProperty>
                                <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Email.PropertyHeader%>" PropertyName="Email" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>   
                            </LookupProperties>
                            <LookupPreFilters>
                            </LookupPreFilters>
                        </SalesLogix:LookupControl>
                    </span> 
                </td>
                <td colspan="2">  
                    <span class="twocollbl"><asp:Label ID="OpportunityId_lz" AssociatedControlID="OpportunityId" runat="server" Text="<%$ resources: OpportunityId_lz.Text %>"></asp:Label></span>
                    <span class="twocoltextcontrol">
                            <SalesLogix:LookupControl Width="95%" runat="server" ID="OpportunityId" AutoPostBack="true" AllowClearingResult="true" OverrideSeedOnSearch="true" LookupBindingMode="string" ReturnPrimaryKey="true" LookupEntityName="Opportunity" LookupEntityTypeName="Sage.Entity.Interfaces.IOpportunity, Sage.Entity.Interfaces, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null" SeedProperty="Account.Id"  >
                        <LookupProperties>
                            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Manager.PropertyHeader%>" PropertyName="AccountManager.UserInfo.UserName" PropertyFormat="User" ExcludeFromFilters="true"  UseAsResult="True"></SalesLogix:LookupProperty>                            
                            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Description.PropertyHeader %>" PropertyName="Description" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Account.PropertyHeader %>" PropertyName="Account.AccountName" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty> 
                            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Stage.PropertyHeader %>" PropertyName="Stage" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Status.PropertyHeader %>" PropertyName="Status" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Owner.PropertyHeader %>" PropertyName="Owner.OwnerDescription" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                        </LookupProperties>
                        <LookupPreFilters>
                        </LookupPreFilters>
                        </SalesLogix:LookupControl>
                    </span> 
                </td>
            </tr>
            <tr>
                <td colspan="2">  
                    <span class="twocollbl"><asp:Label ID="AccountId_lz" AssociatedControlID="AccountId" runat="server" Text="<%$ resources: AccountId_lz.Text %>"></asp:Label></span>
                    <span class="twocoltextcontrol">
                            <SalesLogix:LookupControl Width="95%" runat="server" ID="AccountId" AutoPostBack="true" AllowClearingResult="true" LookupBindingMode="string" ReturnPrimaryKey="true" LookupEntityName="Account" LookupEntityTypeName="Sage.Entity.Interfaces.IAccount, Sage.Entity.Interfaces, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null"  >
                        <LookupProperties>
                            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Account.PropertyHeader %>" PropertyName="AccountName" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_City.PropertyHeader %>" PropertyName="Address.City" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_State.PropertyHeader %>" PropertyName="Address.State" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_MainPhone.PropertyHeader%>" PropertyName="MainPhone" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Type.PropertyHeader%>" PropertyName="Type" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_SubType.PropertyHeader %>" PropertyName="SubType" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Status.PropertyHeader %>" PropertyName="Status" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Manager.PropertyHeader %>" PropertyName="AccountManager.UserInfo.UserName" PropertyFormat="User" ExcludeFromFilters="true"  UseAsResult="True"></SalesLogix:LookupProperty>
                            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Owner.PropertyHeader %>" PropertyName="Owner.OwnerDescription" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                        </LookupProperties>
                        <LookupPreFilters>
                        </LookupPreFilters>
                        </SalesLogix:LookupControl>
                    </span> 
                </td>
                <td colspan="2">  
                    <span class="twocollbl"><asp:Label ID="TicketId_lz" AssociatedControlID="TicketId" runat="server" Text="<%$ resources: TicketId_lz.Text %>"></asp:Label></span>
                    <span class="twocoltextcontrol">
                            <SalesLogix:LookupControl Width="95%" runat="server" ID="TicketId" AutoPostBack="true" AllowClearingResult="true" OverrideSeedOnSearch="true" LookupBindingMode="string" ReturnPrimaryKey="true" LookupEntityName="Ticket" LookupEntityTypeName="Sage.Entity.Interfaces.ITicket, Sage.Entity.Interfaces, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null" SeedProperty="Account.Id"  >
                        <LookupProperties> 
                            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_TicketNumber.PropertyHeader %>" PropertyName="TicketNumber" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Account.PropertyHeader %>" PropertyName="Account.AccountName" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Name.PropertyHeader %>" PropertyName="Contact.NameLF" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_WorkPhone.PropertyHeader %>" PropertyName="Contact.WorkPhone" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>             
                            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Status.PropertyHeader%>" PropertyName="StatusCode" PropertyFormat="PickList" PropertyType="SalesLogix.PickList" UseAsResult="True"></SalesLogix:LookupProperty>
                            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Urgency.PropertyHeader %>" PropertyName="Urgency.Description" PropertyFormat="None" UseAsResult="True"></SalesLogix:LookupProperty>                          
                          <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Area.PropertyHeader %>" PropertyName="Area" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                        </LookupProperties>
                        <LookupPreFilters>
                        </LookupPreFilters>
                        </SalesLogix:LookupControl>
                    </span> 
                </td>
            </tr>
        </table>
        </div>
        </td>
    </tr>
    <tr><td colspan="2" style="padding:1px 0px;"><span><hr /></span></td></tr>
    <tr>
        <td>  
            <span class="twocollbl"><asp:Label ID="Description_lz" AssociatedControlID="Description" runat="server" Text="<%$ resources: Description_lz.Text %>"></asp:Label></span> 
            <span  class="twocoltextcontrol" >
                <SalesLogix:PickListControl runat="server" ID="Description" PickListId="kSYST0000027" PickListName="Note Regarding" MustExistInList="false" AlphaSort="true" MaxLength="64" />
            </span> 
        </td>
        <td>
            <span class="twocollbl"><asp:Label ID="Category_lz" AssociatedControlID="Category" runat="server" Text="<%$ resources: Category_lz.Text %>"></asp:Label></span> 
            <span  class="twocoltextcontrol" >
                <SalesLogix:PickListControl runat="server" ID="Category" PickListId="kSYST0000015" PickListName="Meeting Category Codes" MustExistInList="false" AlphaSort="true" MaxLength="64" />
            </span> 
        </td>
    </tr>
    <tr>
        <td>  
            <span class="twocollbl"><asp:Label ID="Priority_lz" AssociatedControlID="Priority" runat="server" Text="<%$ resources: Priority_lz.Text %>"></asp:Label></span> 
            <span  class="twocoltextcontrol" >
                <SalesLogix:PickListControl runat="server" ID="Priority" PickListId="kSYST0000028" PickListName="Priorities" MustExistInList="false" MaxLength="64" AlphaSort="false" />
            </span> 
        </td>
        <td>  
            <span class="twocollbl"><asp:Label ID="UserId_lz" AssociatedControlID="UserId" runat="server" Text="<%$ resources: UserId_lz.Text %>"></asp:Label></span> 
            <span  class="twocoltextcontrol" >
               <asp:DropDownList runat="server" ID="UserId" AutoPostBack="true" OnSelectedIndexChanged="UserId_SelectedValueChanged"  />
            </span> 
        </td>
    </tr>
    <tr><td colspan="2" style="padding:1px 0px;"><span><hr /></span></td></tr>
    <tr>
        <td colspan="2" >
            <span class="twocollbl"><asp:Label ID="Notes_lz" AssociatedControlID="Notes" runat="server" Text="<%$ resources: Notes_lz.Text %>"></asp:Label></span> 
            <span  class="twocoltextcontrol" >
                <asp:TextBox runat="server" ID="Notes" TextMode="MultiLine" Rows="6" />
            </span> 
        </td>
    </tr>
</table>

