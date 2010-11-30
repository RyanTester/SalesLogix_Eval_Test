<%@ Control Language="C#" AutoEventWireup="true" CodeFile="SendTicketEmail.ascx.cs" Inherits="SmartParts_Ticket_SendTicketEmail" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>

<div style="display:none">
    <asp:Panel ID="pnlSendTicketEmail_RTools" runat="server">
        <SalesLogix:PageLink ID="lnkSendTicketEmailHelp" runat="server" LinkType="HelpFileName"
            ToolTip="<%$ resources: Portal, Help_ToolTip %>" Target="Help" NavigateUrl="csrticketsendemail.aspx"
            ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16">
        </SalesLogix:PageLink>        
    </asp:Panel>
</div>

<table border="0" cellpadding="1" cellspacing="0" class="formtable">
    <col width="60%" /><col width="40%" />
    <tr>
        <td >
            <span class="lbl">
                <asp:Label ID="lblSendTicketEmail_To" Text="<%$ resources: lblSendTicketEmail_To.Caption %>" AssociatedControlID="lblSendTicketEmail" 
                    runat="server">
                </asp:Label>
            </span> 
            <span class="lbl">
                <asp:Label runat="server" ID="lblSendTicketEmail" />
            </span> 
        </td>
    </tr>
    <tr>
        <td >
            <span >
                <asp:CheckBox runat="server" ID="chkSendToContact" Checked="true" Text="" />
            </span>
            <span class="lblright">
                <asp:Label ID="lblSendTicketEmail_Contact" Text="<%$ resources: lblSendTicketEmail_Contact.Caption %>" runat="server"
                    AssociatedControlID="chkSendToContact" >
                </asp:Label>
            </span>
        </td>
        <td >
            <span class="slxlabel">
                <asp:Label runat="server" ID="lblContactFirst" />
                <asp:Label runat="server" ID="lblContactLast" />
            </span>
        </td>
    </tr>
    <tr>
        <td >
            <span >
                <asp:CheckBox runat="server" ID="chkSendToAssignedTo" Text="" />
            </span>
            <span class="lblright">
                <asp:Label ID="lblSendTicketEmail_AssignedTo" Text="<%$ resources: lblSendTicketEmail_AssignedTo.Caption %>" runat="server"
                    AssociatedControlID="chkSendToAssignedTo" >
                </asp:Label>
            </span>
        </td>
        <td >
            <span class="slxlabel">
                <asp:Label runat="server" ID="lblAssignedToFirst" />
                <asp:Label runat="server" ID="lblAssignedToLast" />
            </span>
        </td>
    </tr>
    <tr>
        <td >
            <span >
                <asp:CheckBox runat="server" ID="chkSendToAcctMgr" Text="" />
            </span>
            <span class="lblright">
                <asp:Label ID="lblSendTicketEmail_AcctMgr" Text="<%$ resources: lblSendTicketEmail_AcctMgr.Caption %>" runat="server"
                    AssociatedControlID="chkSendToAcctMgr">
                </asp:Label>
            </span>
        </td>
        <td >        
            <span class="slxlabel">
                <asp:Label runat="server" ID="lblAcctMgrFirst" />
                <asp:Label runat="server" ID="lblAcctMgrLast" />                
            </span>
        </td>
    </tr>
    <tr>
        <td >
            <span >
                <asp:CheckBox runat="server" ID="chkSendToManager" Text="" />
            </span>
            <span class="lblright">
                <asp:Label ID="lblSendTicketEmail_MyManager" Text="<%$ resources: lblSendTicketEmail_MyManager.Caption %>" runat="server"
                    AssociatedControlID="chkSendToManager">
                </asp:Label>
            </span>
        </td>
        <td >        
            <span class="slxlabel">
                <asp:Label runat="server" ID="lblManagerName" />
            </span>
        </td>
    </tr>
    <tr>
        <td colspan="2" style="padding:5px 0px;">
            <hr />
        </td>
    </tr>
    <tr>
        <td >  
            <span class="lbl">
                <asp:Label ID="lblSendTicketEmail_EmailType" Text="<%$ resources: lblSendTicketEmail_EmailType.Caption %>" runat="server"></asp:Label>
            </span>
        </td>
    </tr>
    <tr>
        <td >   
            <span >
                <asp:RadioButtonList runat="server" ID="rdgEmailType" >
                    <asp:ListItem Selected="true" Text="<%$ resources: lstOption_TicketInfo.Caption %>" Value="Ticket Info" />
                    <asp:ListItem Text="<%$ resources: lstOption_None.Caption %>" Value="None" />
                </asp:RadioButtonList>
            </span>
        </td>
    </tr>
    <tr>
        <td colspan="2" style="padding:5px 0px;">
            <hr />
        </td>
    </tr>
    <tr>
        <td >  
            &nbsp;
        </td>
        <td>
            <span >
                <asp:Button Width=80 runat="server" ID="cmdSendEmail" Text="<%$ resources: cmdSendEmail.Caption %>" UseSubmitBehavior="false" />
            </span>
        </td>
    </tr>
</table>