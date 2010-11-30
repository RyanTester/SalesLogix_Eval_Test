<%@ Control Language="C#" AutoEventWireup="true" CodeFile="EditRecurrence.ascx.cs" Inherits="SmartParts_Activity_EditRecurrence" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<br />
<table border="0" cellpadding="1" cellspacing="0" class="formtable">
    <tr>
        <td><asp:Localize ID="ActivityStartDate" runat="server" Text="<%$ resources: ActivityStartDate.Text %>" /></td>
       <td><SalesLogix:DateTimePicker ID="StartDate" runat="server" DisplayMode="AsText"></SalesLogix:DateTimePicker></td>
    </tr>
     <tr>
        <td><asp:Localize ID="ContactName" runat="server" Text="<%$ resources: ContactName.Text %>" /></td>
        <td><asp:Label ID="Contact" runat="server" ></asp:Label></td>
    </tr>
     <tr>
        <td><asp:Localize ID="AccountName" runat="server" Text="<%$ resources: AccountName.Text %>" /></td>
        <td><asp:Label ID="Account" runat="server" ></asp:Label></td>
    </tr>
     <tr>
        <td><asp:Localize ID="OpportunityName" runat="server" Text="<%$ resources: OpportunityName.Text %>" /></td>
        <td><asp:Label ID="Opportunity" runat="server" ></asp:Label></td>
    </tr>
    <tr><td colspan="2" style="height:15px"></td></tr>
    <tr>
        <td colspan="2">
            <asp:RadioButtonList ID="RecurrenceType" runat="Server">
                <asp:ListItem Text="<%$ resources: RecurrenceType.Series.Text %>" Value="series" Selected="true"/>
                <asp:ListItem Text="<%$ resources: RecurrenceType.occurrence.Text %>" Value="occurrence"/>
            </asp:RadioButtonList>
        </td>
    </tr>
    <tr><td colspan="2" style="height:10px"></td></tr>
    <tr >
        <td><asp:Button CssClass="slxbutton" ID="btnContinue" runat="Server" OnClick="btnContinue_Click" Text="<%$ resources: btnContinue_Click.Text %>" /></td>
    </tr>
</table>


