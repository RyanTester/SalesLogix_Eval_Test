<%@ Control Language="C#" AutoEventWireup="true" CodeFile="ActivityCommandController.ascx.cs"
    Inherits="SmartParts_Activity_ActivityCommandController" %>
<table cellpadding="4" cellspacing="0" border="0" class="formtable">
    <tr>
        <td style="text-align: left;">
            <asp:Button ID="CompleteButton" runat="server" 
                Text="<%$ resources: Complete %>"
                ToolTip="<%$ resources: Complete %>" 
                CssClass="slxbutton" 
            />
            <asp:Button ID="DeleteButton" runat="server" 
                Text="<%$ resources: Delete %>"
                ToolTip="<%$ resources: Delete %>" 
                CssClass="slxbutton" 
            />
        </td>
        <td style="text-align: right">
            <asp:Button ID="OkButton" runat="server" 
                Text="<%$ resources: OK %>" 
                ToolTip="<%$ resources: OK %>" 
                CssClass="slxbutton" 
            />
            <asp:Button ID="CancelButton" runat="server" 
                ToolTip="<%$ resources: Cancel %>"
                Text="<%$ resources: Cancel %>" 
                UseSubmitBehavior="false" 
                CssClass="slxbutton" 
            />
        </td>
    </tr>
    <tr>
        <td>
            <div style="margin: 10pt 0pt 0pt;">
                <asp:Label runat="server" ID="CreateUser" CssClass="lblright" />
            </div>
        </td>
        <td></td>
    </tr>
</table>
