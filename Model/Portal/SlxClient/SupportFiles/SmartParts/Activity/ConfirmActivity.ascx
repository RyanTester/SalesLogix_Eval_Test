<%@ Control Language="C#" AutoEventWireup="true" CodeFile="ConfirmActivity.ascx.cs" Inherits="SmartParts_Activity_ConfirmActivity" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Lookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>


<div style="display:none">
    <asp:Panel ID="ConfirmActivity_RTools" runat="server">
        <SalesLogix:PageLink ID="lnkConfirmActivityHelp" runat="server" LinkType="HelpFileName"
            ToolTip="<%$ resources: Portal, Help_ToolTip %>" Target="Help" NavigateUrl="confirmactivity.aspx"
            ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16">
        </SalesLogix:PageLink>
    </asp:Panel>
</div>
<table border="0" cellpadding="1" cellspacing="0" style="width:500px;" class="formtable">
<tr>
<td>  
    <span class="lbl">
        <asp:Label ID="ActivityType_lz" meta:resourcekey="ConfirmActivity_Label_ActivityType" AssociatedControlID="ActivityType" runat="server" Text="Activity Type:"></asp:Label></span>
    <span class="textcontrol">
        <asp:TextBox ID="ActivityType" runat="server" Enabled="false"></asp:TextBox></span> 
</td>
</tr>
<tr>
<td>  
    <span class="lbl">
        <asp:Label ID="StartDate_lz" meta:resourcekey="ConfirmActivity_Label_StartDate" AssociatedControlID="StartDate" runat="server" Text="Date/Time:"></asp:Label></span>
    <span class="textcontrol">
        <SalesLogix:DateTimePicker runat="server" ID="StartDate" DisplayTime="true" Enabled="false" /></span> 
</td>
</tr>
<tr>
<td>  
    <span class="lbl">
        <asp:Label ID="Regarding_lz" meta:resourcekey="ConfirmActivity_Label_Regarding" AssociatedControlID="Regarding" runat="server" Text="Regarding:"></asp:Label></span>
    <span class="textcontrol">
        <asp:TextBox ID="Regarding" runat="server" Enabled="false"></asp:TextBox></span> 
</td>
</tr>
<tr>
<td>  
    <span class="lbl">
        <asp:Label ID="Contact_lz" meta:resourcekey="ConfirmActivity_Label_Contact" AssociatedControlID="ContactId" runat="server" Text="Contact:"></asp:Label></span>
    <span class="textcontrol">
        <SalesLogix:LookupControl ID="ContactId" runat="server" LookupBindingMode="String" ReturnPrimaryKey="true" EnableHyperLinking="true" CssClass="slxtext" EnableLookup="false" LookupEntityName="Contact" LookupEntityTypeName="Sage.SalesLogix.Entities.Contact, Sage.SalesLogix.Entities">
<LookupProperties>
<SalesLogix:LookupProperty PropertyHeader="Id" PropertyName="Id" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
</LookupProperties>
        </SalesLogix:LookupControl></span> 
</td>
</tr>
<tr>
<td>  
    <span class="lbl">
        <asp:Label ID="Account_lz" meta:resourcekey="ConfirmActivity_Label_Account" AssociatedControlID="AccountId" runat="server" Text="Account:"></asp:Label></span>
    <span class="textcontrol">
        <SalesLogix:LookupControl ID="AccountId" runat="server" LookupBindingMode="String" ReturnPrimaryKey="true" EnableHyperLinking="false" CssClass="slxtext" Enabled="false" LookupEntityName="Account" LookupEntityTypeName="Sage.SalesLogix.Entities.Account, Sage.SalesLogix.Entities">
<LookupProperties>
<SalesLogix:LookupProperty PropertyHeader="Id" PropertyName="Id" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
</LookupProperties>
        </SalesLogix:LookupControl></span> 
</td>
</tr>
<tr>
<td>  
    <span runat="server" id="OpportunitySpan">
    <span class="lbl">
        <asp:Label ID="Opportunity_lz" meta:resourcekey="ConfirmActivity_Label_Opportunity" AssociatedControlID="OpportunityId" runat="server" Text="Opportunity:"></asp:Label></span>
    <span class="textcontrol">
        <SalesLogix:LookupControl ID="OpportunityId" runat="server" LookupBindingMode="String" ReturnPrimaryKey="true" EnableHyperLinking="false" CssClass="slxtext" Enabled="false" LookupEntityName="Opportunity" LookupEntityTypeName="Sage.SalesLogix.Entities.Opportunity, Sage.SalesLogix.Entities">
<LookupProperties>
<SalesLogix:LookupProperty PropertyHeader="Id" PropertyName="Id" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
</LookupProperties>
        </SalesLogix:LookupControl></span> </span>
</td>
</tr>
<tr>
<td>  
    <span class="lbl">
        <asp:Label ID="Phone_lz" meta:resourcekey="ConfirmActivity_Label_Phone" AssociatedControlID="Phone" runat="server" Text="Phone:"></asp:Label></span>
    <span class="textcontrol">
        <SalesLogix:Phone runat="server" ID="Phone" Enabled="false"></SalesLogix:Phone></span> 
</td>
</tr>
<tr>
<td>  
    <span class="lbl">
        <asp:Label ID="From_lz" meta:resourcekey="ConfirmActivity_Label_From" AssociatedControlID="From" runat="server" Text="From:"></asp:Label></span>
    <span class="textcontrol">
        <SalesLogix:LookupControl ID="From" runat="server" LookupBindingMode="String" ReturnPrimaryKey="true" EnableHyperLinking="false" CssClass="slxtext" Enabled="false" LookupEntityName="User" LookupEntityTypeName="Sage.SalesLogix.Security.User, Sage.SalesLogix.Security">
<LookupProperties>
<SalesLogix:LookupProperty PropertyHeader="Id" PropertyName="Id" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
</LookupProperties>
        </SalesLogix:LookupControl></span> 
</td>
</tr>
<tr>
<td>  
    <span class="lbl">
        <asp:Label ID="To_lz" meta:resourcekey="ConfirmActivity_Label_To" AssociatedControlID="To" runat="server" Text="To:"></asp:Label></span>
    <span class="textcontrol">
        <SalesLogix:LookupControl ID="To" runat="server" LookupBindingMode="String" ReturnPrimaryKey="true" EnableHyperLinking="false" CssClass="slxtext" Enabled="false" LookupEntityName="User" LookupEntityTypeName="Sage.SalesLogix.Security.User, Sage.SalesLogix.Security">
<LookupProperties>
<SalesLogix:LookupProperty PropertyHeader="Id" PropertyName="Id" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
</LookupProperties>
        </SalesLogix:LookupControl></span> 
</td>
</tr>
<tr>
<td>  
    <span class="lbl">
        <asp:Label ID="Action_lz" meta:resourcekey="ConfirmActivity_Label_Action" AssociatedControlID="Action" runat="server" Text="Action:"></asp:Label></span>
    <span class="textcontrol">
        <asp:DropDownList ID="Action" runat="server" CssClass="slxcontrol">
        <asp:ListItem Text="Confirm" Value="asAccepted" Selected="True" meta:resourcekey="ConfirmActivity_ListItem_Confirm"></asp:ListItem>
        <asp:ListItem Text="Decline" Value="asDeclned" meta:resourcekey="ConfirmActivity_ListItem_Decline"></asp:ListItem>
        </asp:DropDownList></span> 
</td>
</tr>
<tr>
<td>  
    <span class="lbl">
        <asp:Label ID="Reply_lz" meta:resourcekey="ConfirmActivity_Label_Reply" AssociatedControlID="Reply" runat="server" Text="Reply:"></asp:Label></span>
    <span class="textcontrol">
        <asp:TextBox ID="Reply" runat="server" Height="60px" TextMode="MultiLine" Wrap="true"></asp:TextBox>
    </span> 
</td>
</tr>
<tr>
<td>  
    <asp:Button ID="CompleteBtn" meta:resourcekey="ConfirmActivity_Button_Complete" runat="server" Text="Complete" CssClass="slxbutton" OnClick="CompleteBtn_Click" />
</td>
</tr>
</table>