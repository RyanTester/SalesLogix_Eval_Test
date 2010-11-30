<%@ Control Language="C#" AutoEventWireup="true" CodeFile="ActivityDetails.ascx.cs" Inherits="SmartParts_Activity_ActivityDetails"  %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.PickList" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.DependencyLookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Lookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>


<div style="display:none">
    <asp:Panel ID="LeftTools" runat="server" />
    <asp:Panel ID="CenterTools" runat="server" />
    <asp:Panel ID="RightTools" runat="server">
         <SalesLogix:PageLink ID="ActivityDetailsHelpLink" runat="server" LinkType="HelpFileName" ToolTip="<%$ resources: Portal, Help_ToolTip %>" Target="Help" NavigateUrl="activitydetailview.aspx" ImageUrl="~/images/icons/Help_16x16.gif" ></SalesLogix:PageLink>
    </asp:Panel>
</div>

<style type="text/css">
.lead-row 
{
    display : none;
}
.contact-row
{
    display : none;
}
</style>

<div style="overflow:auto">
<table border="0" cellpadding="1" cellspacing="0" class="formtable">
    <col width="50%" />
    <col width="50%" />
    <!-- Regarding section -->
    <tr>
        <td>
            <div class="lbl alignleft"><asp:Label ID="Description_lz"  AssociatedControlID="Description" runat="server" Text="<%$ resources: Description_lz.Text %>"></asp:Label></div>
            <div class="textcontrol picklist">
                <SalesLogix:PickListControl runat="server" ID="Description" PickListId="kSYST0000027" PickListName="Note Regarding" MustExistInList="false" AlphaSort="true" MaxLength="64"  />
            </div> 
        </td>
        <td>
            <div class="lbl alignleft"><asp:Label ID="Category_lz" AssociatedControlID="Category" runat="server" Text="<%$ resources: Category_lz.Text %>"></asp:Label></div>
            <div class="textcontrol picklist">
                <SalesLogix:PickListControl runat="server" ID="Category" PickListId="kSYST0000015" PickListName="Meeting Category Codes" MustExistInList="false" AlphaSort="true" MaxLength="64" />
            </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="lbl alignleft"><asp:Label ID="Priority_lz" AssociatedControlID="Priority" runat="server" Text="<%$ resources: Priority_lz.Text %>" ></asp:Label></div>
            <div class="textcontrol">
                <SalesLogix:PickListControl runat="server" ID="Priority" PickListId="kSYST0000028" PickListName="Priorities" MustExistInList="false" MaxLength="64" AlphaSort="false" />
            </div>         
        </td>
    </tr>
    <!-- end Regarding section -->
    <tr>
        <td colspan="2"><hr /></td>
    </tr>    
    <!-- Start Time section -->
    <tr>
        <td>
            <div class="lbl alignleft"><asp:Label ID="StartDate_lz"  AssociatedControlID="StartDate" runat="server"  Text="<%$ resources: StartDate_lz.Text %>"></asp:Label></div>
            <div class="textcontrol datepicker" ><SalesLogix:DateTimePicker runat="server" ID="StartDate" AutoPostBack="true" Required="true"  /></div> 
        </td>
        <td>
            <div class="lbl alignleft"><asp:Label ID="lblReminder" AssociatedControlID="" runat="server" Text="<%$ resources: Alarm.Text %>"></asp:Label></div>
            <span class="floatleft">
                <SalesLogix:SLXCheckBox runat="server" ID="Alarm" Text="" AutoPostBack="true"  /> &nbsp;
            </span>
            <span class="textcontrol durationpicker" class="floatleft">
                <SalesLogix:DurationPicker runat="server" ID="ReminderDuration" MaxLength="3" />
            </span>
        </td>
    </tr>
    <tr>
        <td style="padding-bottom:3px">
            <div class="lbl alignleft">&nbsp;</div>
            <div class="slxlabel checkbox" style="clear:none">
                <SalesLogix:SLXCheckBox runat="server" ID="Timeless" Text="<%$ resources: Timeless_lz.Text %>" AutoPostBack="true"  />
            </div>
        </td>
        <td style="padding-bottom:3px">
            <div class="lbl alignleft">&nbsp;</div>
            <div class="slxlabel checkbox" style="clear:none">
                <SalesLogix:SLXCheckBox runat="server" ID="Rollover" Text="<%$ resources: Rollover.Text %>" TextAlign="Right" AutoPostBack="true" />
            </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="lbl alignleft"><asp:Label ID="Duration_lz"  AssociatedControlID="Duration" runat="server" Text="<%$ resources: Duration_lz.Text %>"></asp:Label></div>
            <div class="textcontrol">
                <SalesLogix:DurationPicker runat="server" ID="Duration" MaxLength="3" />
            </div> 
        </td>
        <td>
            <div class="lbl alignleft"><asp:Label ID="UserId_lz" AssociatedControlID="UserId" runat="server" Text="<%$ resources: UserId_lz.Text %>" ></asp:Label></div>
            <div class="textcontrol">
                <asp:DropDownList runat="server" ID="UserId" AutoPostBack="true" OnSelectedIndexChanged="UserId_SelectedValueChanged"  />
            </div> 
        </td>
    </tr>
    <!-- end start time section  -->
    <tr>
        <td colspan="2"><hr /></td>
    </tr>
    <!-- Associated enties section -->
    <tr>
        <td>
            <div class="lbl alignleft">&nbsp;</div>
            <asp:RadioButton runat="Server" ID="rbContact" cssclass="lblright" text="<%$ resources: rbContact.Text %>" GroupName="PersonType" AutoPostBack="false" onclick="toggleEntityType();" />
            <asp:RadioButton runat="Server" ID="rbLead" cssclass="lblright" text="<%$ resources: rbLead.Text %>" GroupName="PersonType" AutoPostBack="false" onclick="toggleEntityType();" />
        </td>
        <td></td>
    </tr>
    <tr>
        <td>
        
        </td>
    </tr>
<%--</table>
            <!-- lead area  -->
<div runat="server" id="leadsdiv">
<table border="0" cellpadding="1" cellspacing="0" class="formtable" style="margin-top:2px;">
    <col width="50%" />
    <col width="50%" />--%>
    <tr class="lead-row">
        <td>
            <div class="lbl alignleft">
                <asp:Label ID="Lead_lz" AssociatedControlID="LeadId" runat="server" Text="<%$ resources: Name_lz.Text %>"></asp:Label>
            </div>
            <div class="textcontrol lookup">
                <SalesLogix:LookupControl runat="server"  ID="LeadId" AutoPostBack="true" AllowClearingResult="true" OverrideSeedOnSearch="true" LookupBindingMode="string" ReturnPrimaryKey="true" LookupEntityName="Lead" LookupEntityTypeName="Sage.Entity.Interfaces.ILead, Sage.Entity.Interfaces, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null" >
                    <LookupProperties>
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_LastName.PropertyHeader %>" PropertyName="LastName" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_FirstName.PropertyHeader %>" PropertyName="FirstName" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Company.PropertyHeader %>" PropertyName="Company" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_City.PropertyHeader %>" PropertyName="Address.City" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_State.PropertyHeader %>" PropertyName="Address.State" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Postal.PropertyHeader %>" PropertyName="Address.PostalCode" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Status.PropertyHeader %>" PropertyName="Status" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_WorkPhone.PropertyHeader %>" PropertyName="WorkPhone" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Owner.PropertyHeader %>" PropertyName="Owner.OwnerDescription" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                    </LookupProperties>
                    <LookupPreFilters>
                    </LookupPreFilters>
                </SalesLogix:LookupControl>
            </div> 
        </td>
        <td></td>
    </tr>
    <tr class="lead-row">
        <td>
            <div class="lbl">
                <asp:Label ID="Company_lz" AssociatedControlID="Company" runat="server" Text="<%$ resources: Company_lz.Text %>"></asp:Label>
            </div>
            <div class="textcontrol">
                <asp:Textbox runat="server" enabled="false" id="Company" Text=""></asp:Textbox>
            </div> 
        </td>
        <td></td>
    </tr>
<%--</table>
</div>
            <!-- end lead area  -->
            <!-- contact area  -->
<div runat="server" id="contactsdiv">
<table border="0" cellpadding="1" cellspacing="0" class="formtable">
    <col width="50%" />
    <col width="50%" />--%>
    <tr class="contact-row">
        <td>
            <div class="lbl alignleft">
                <asp:Label ID="ContactId_lzx" AssociatedControlID="ContactId" runat="server" Text="<%$ resources: ContactId_lz.Text %>"></asp:Label>
            </div>
            <div class="textcontrol lookup">
                <SalesLogix:LookupControl runat="server"  ID="ContactId" AutoPostBack="true" AllowClearingResult="true" OverrideSeedOnSearch="true" LookupBindingMode="string" ReturnPrimaryKey="true" LookupEntityName="Contact" LookupEntityTypeName="Sage.Entity.Interfaces.IContact, Sage.Entity.Interfaces, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null" SeedProperty="Account.Id"  >
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
            </div>         
        </td>
        <td>
            <div class="lbl alignleft"><asp:Label ID="OpportunityId_lzx" AssociatedControlID="OpportunityId" runat="server" Text="<%$ resources: OpportunityId_lz.Text %>"></asp:Label></div>
            <div class="textcontrol">
                <SalesLogix:LookupControl runat="server" ID="OpportunityId" AutoPostBack="true" AllowClearingResult="true" OverrideSeedOnSearch="true" LookupBindingMode="string" ReturnPrimaryKey="true" LookupEntityName="Opportunity" LookupEntityTypeName="Sage.Entity.Interfaces.IOpportunity, Sage.Entity.Interfaces, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null" SeedProperty="Account.Id"  >
                <LookupProperties>
                    <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Manager.PropertyHeader%>" PropertyName="AccountManager.UserInfo.UserName" PropertyType="System.String" PropertyFormat="None" ExcludeFromFilters="true"  UseAsResult="True"></SalesLogix:LookupProperty>                            
                    <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Description.PropertyHeader %>" PropertyName="Description" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                    <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Account.PropertyHeader %>" PropertyName="Account.AccountName" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty> 
                    <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Stage.PropertyHeader %>" PropertyName="Stage" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                    <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Status.PropertyHeader %>" PropertyName="Status" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                    <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Owner.PropertyHeader %>" PropertyName="Owner.OwnerDescription" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                </LookupProperties>
                <LookupPreFilters>
                </LookupPreFilters>
                </SalesLogix:LookupControl>
            </div>         
        </td>
    </tr>
    <tr class="contact-row">
        <td>
            <div class="lbl alignleft"><asp:Label ID="AccountId_lz" AssociatedControlID="AccountId" runat="server" Text="<%$ resources: AccountId_lz.Text %>"></asp:Label></div>
            <div class="textcontrol">
                <SalesLogix:LookupControl runat="server" ID="AccountId" AutoPostBack="true" AllowClearingResult="true" LookupBindingMode="string" ReturnPrimaryKey="true" LookupEntityName="Account" LookupEntityTypeName="Sage.Entity.Interfaces.IAccount, Sage.Entity.Interfaces, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null"  >
                <LookupProperties>
                    <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Account.PropertyHeader %>" PropertyName="AccountName" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                    <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_City.PropertyHeader %>" PropertyName="Address.City" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                    <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_State.PropertyHeader %>" PropertyName="Address.State" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                    <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_MainPhone.PropertyHeader%>" PropertyName="MainPhone" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                    <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Type.PropertyHeader%>" PropertyName="Type" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                    <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_SubType.PropertyHeader %>" PropertyName="SubType" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                    <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Status.PropertyHeader %>" PropertyName="Status" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                    <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Manager.PropertyHeader %>" PropertyName="AccountManager.UserInfo.UserName" PropertyType="System.String" PropertyFormat="None" ExcludeFromFilters="true"  UseAsResult="True"></SalesLogix:LookupProperty>
                    <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Owner.PropertyHeader %>" PropertyName="Owner.OwnerDescription" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                </LookupProperties>
                <LookupPreFilters>
                </LookupPreFilters>
                </SalesLogix:LookupControl>
            </div>         
        </td>
        <td>
            <div class="lbl alignleft"><asp:Label ID="TicketId_lz" AssociatedControlID="TicketId" runat="server" Text="<%$ resources: TicketId_lz.Text %>"></asp:Label></div>
            <div class="textcontrol">
                <SalesLogix:LookupControl runat="server" ID="TicketId" AutoPostBack="true" AllowClearingResult="true" OverrideSeedOnSearch="true" LookupBindingMode="string" ReturnPrimaryKey="true" LookupEntityName="Ticket" LookupEntityTypeName="Sage.Entity.Interfaces.ITicket, Sage.Entity.Interfaces, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null" SeedProperty="Account.Id"  >
                <LookupProperties>
                    <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_TicketNumber.PropertyHeader %>" PropertyName="TicketNumber" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                    <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Account.PropertyHeader %>" PropertyName="Account.AccountName" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                    <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Contact.PropertyHeader %>" PropertyName="Contact.NameLF" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                    <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_WorkPhone.PropertyHeader %>" PropertyName="Contact.WorkPhone" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>             
                    <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Status.PropertyHeader%>" PropertyName="StatusCode" PropertyFormat="PickList" PropertyType="SalesLogix.PickList" UseAsResult="True"></SalesLogix:LookupProperty>
                    <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Urgency.PropertyHeader %>" PropertyName="Urgency.Description" PropertyFormat="None" UseAsResult="True"></SalesLogix:LookupProperty>                          
                  <SalesLogix:LookupProperty PropertyHeader="<%$ resources: Lookup_Area.PropertyHeader %>" PropertyName="Area" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
                </LookupProperties>
                <LookupPreFilters>
                </LookupPreFilters>
                </SalesLogix:LookupControl>
            </div>         
        </td>
    </tr>
<%--</table> 
</div>
           
            <!-- end contact area  -->
    <!-- end Associated entities section  -->
    <!-- Notes Section   -->
<table border="0" cellpadding="1" cellspacing="0" class="formtable" >
    <col width="50%" />
    <col width="50%" />--%>
    <tr>
        <td colspan="2"><hr /></td>
    </tr>
    <tr>
        <td colspan="2">
            <div class="twocollbl"><asp:Label ID="Notes_lz" AssociatedControlID="Notes" runat="server" Text="<%$ resources: Notes_lz.Text %>"></asp:Label></div>
            <div class="twocoltextcontrol">
                <asp:TextBox runat="server" ID="Notes" TextMode="MultiLine" Rows="6"  />
            </div> 
        </td>
    </tr>
    <tr>
        <td colspan="2">  
            <span class="twocollbl"><asp:Label ID="CreateUser_lz" AssociatedControlID="CreateUser" runat="server" Text=""></asp:Label></span>
            <span>
                <asp:Label runat="server" cssclass="lblright" ID="CreateUser"  />
            </span> 
        </td>
    </tr>
</table>
</div>
