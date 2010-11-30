<%@ Control Language="C#" AutoEventWireup="true" CodeFile="HistoryCommandController.ascx.cs" Inherits="SmartParts_History_HistoryCommandController" %>


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
            <asp:Button CssClass="slxbutton" ID="cmdDelete" runat="server" Text="<%$ resources: btnDelete.Caption %>" />
            <asp:Button CssClass="slxbutton" ID="cmdOK" runat="server" Text="<%$ resources: btnOK.Caption %>" />
            <asp:Button CssClass="slxbutton" ID="cmdCancel" runat="server" Text="<%$ resources: btnCancel.Caption %>" OnClientClick="parent.__doPostBack('ctl00$DialogWorkspace$ActivityDialogController$btnCloseDialog','');" UseSubmitBehavior="false" />
        </td>
    </tr>

</table>