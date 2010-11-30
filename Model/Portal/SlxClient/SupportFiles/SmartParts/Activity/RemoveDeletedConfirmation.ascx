<%@ Control Language="C#" AutoEventWireup="true" CodeFile="RemoveDeletedConfirmation.ascx.cs" Inherits="SmartParts_Activity_RemoveDeletedConfirmation" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Lookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>


<div style="display:none">
<asp:Panel ID="RemoveDeletedConfirm_RTools" runat="server">
<SalesLogix:PageLink ID="RemoveDeletedConfirmHelpLink" runat="server" LinkType="HelpFileName" Target="Help" NavigateUrl="confirmnotificationdelete.aspx" ImageUrl="~/images/icons/Help_16x16.gif" ToolTip="<%$ resources: Portal, Help_ToolTip %>"></SalesLogix:PageLink></asp:Panel>
</div>
<table border="0" cellpadding="1" cellspacing="0" style="width:500px;" class="formtable">
<tr>
<td>  
    <span class="lbl">
        <asp:Label ID="StartDate_lz" meta:resourcekey="RemoveDeletedConfirm_Label_StartDate" AssociatedControlID="StartDate" runat="server" Text="Date/Time:"></asp:Label></span>
    <span class="textcontrol">
        <SalesLogix:DateTimePicker runat="server" ID="StartDate" DisplayTime="true" Enabled="false" /></span> 
</td>
</tr>
<tr>
<td>  
    <span class="lbl">
        <asp:Label ID="Regarding_lz" meta:resourcekey="RemoveDeletedConfirm_Label_Regarding" AssociatedControlID="Regarding" runat="server" Text="Regarding:"></asp:Label></span>
    <span class="textcontrol">
        <asp:TextBox ID="Regarding" runat="server" Height="80px" Wrap="true" TextMode="MultiLine" ReadOnly="true" ></asp:TextBox></span> 
</td>
</tr>
<tr>
<td>  
    <span class="lbl">
        <asp:Label ID="From_lz" meta:resourcekey="RemoveDeletedConfirm_Label_From" AssociatedControlID="From" runat="server" Text="From:"></asp:Label></span>
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
        <asp:Label ID="To_lz" meta:resourcekey="RemoveDeletedConfirm_Label_To" AssociatedControlID="To" runat="server" Text="To:"></asp:Label></span>
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
    <asp:Button ID="DeleteBtn" meta:resourcekey="RemoveDeletedConfirm_Button_Delete" runat="server" Text="Delete" CssClass="slxbutton" OnClick="DeleteBtn_Click" />
</td>
</tr>
</table>