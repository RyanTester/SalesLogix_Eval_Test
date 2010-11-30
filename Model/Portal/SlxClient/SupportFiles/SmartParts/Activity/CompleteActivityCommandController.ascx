<%@ Control Language="C#" AutoEventWireup="true" CodeFile="CompleteActivityCommandController.ascx.cs" Inherits="SmartParts_Activity_CompleteActivityCommandController" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>



<table cellpadding="1" cellspacing="0" border="0" class="formtable">
    <col />
    <col />
    <tr>
        <td>
            <div>
                <asp:Label runat="server" cssclass="lblright" ID="CreateUser"  />
            </div> 
        </td>
        <td style="text-align:right">
           <asp:Button runat="server" ID="CompleteAsScheduled" Text="<%$ resources: CompleteAsScheduled.Text %>" ToolTip="<%$ resources: CompleteAsScheduled.ToolTip %>" CssClass="slxbutton" Width="<%$ resources: CompleteAsScheduled.Width %>" />
           <asp:Button runat="server" ID="CompleteNow" Text="<%$ resources: CompleteNow.Text %>" ToolTip="<%$ resources: CompleteNow.ToolTip %>" CssClass="slxbutton" Width="<%$ resources: CompleteNow.Width %>"/>
            <asp:Button CssClass="slxbutton" ID="CancelButton" runat="server" Text="<%$ resources: Cancel %>" UseSubmitBehavior="false" />
        </td>
    </tr>

</table>
