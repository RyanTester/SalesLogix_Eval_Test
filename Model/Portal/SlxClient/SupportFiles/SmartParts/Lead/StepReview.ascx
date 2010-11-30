<%@ Control Language="C#" AutoEventWireup="true" CodeFile="StepReview.ascx.cs" Inherits="StepReview" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Lookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>

<table border="0" cellpadding="1" cellspacing="0" class="formtable" style="width:100%">
    <col width="1%" /><col width="35%" /><col width="64%" />
    <tr>
        <td colspan="3">
            <span class="slxlabel">
                <asp:Label ID="lblHeader" runat="server" Text="<%$ resources:lblHeader.Caption %>"></asp:Label>
            </span>
            <br />
            <br />
            <br />
        </td>
    </tr>
    <tr>
        <td></td>
        <td>
            <span class="slxlabel">
                <asp:Label ID="lblImportFile" runat="server" Text="<%$ resources:lblImportFile.Caption %>" AssociatedControlID="lblImportFileValue"></asp:Label>
            </span>
        </td>
        <td>
            <span class="textcontrol">
                <asp:Label ID="lblImportFileValue" runat="server"></asp:Label>
            </span>
        </td>
    </tr>
    <tr>
        <td></td>
        <td>
            <span class="slxlabel">
                <asp:Label ID="lblDefaultOwner" runat="server" Text="<%$ resources:lblDefaultOwnder.Caption %>" AssociatedControlID="lblDefaultOwnerValue"></asp:Label>
            </span>
        </td>
        <td>
            <span class="textcontrol">
                <asp:Label ID="lblDefaultOwnerValue" runat="server"></asp:Label>
            </span>
        </td>
    </tr>
    <tr>
        <td></td>
        <td>
            <span class="slxlabel">
                <asp:Label ID="lblLeadSource" runat="server" Text="<%$ resources:lblDefaultLeadSource.Caption %>" AssociatedControlID="lblLeadSourceValue"></asp:Label>
            </span>
        </td>
        <td>      
            <span class="textcontrol">
                <asp:Label ID="lblLeadSourceValue" runat="server"></asp:Label>
            </span>
        </td>
    </tr>
    <tr>
        <td></td>
        <td>
            <span class="slxlabel">
                <asp:Label ID="lblAddToGroup" runat="server" Text="<%$ resources:lblAddToGroup.Caption %>" AssociatedControlID="lblAddToGroupValue"></asp:Label>
            </span>
        </td>
        <td>
            <span class="textcontrol>
                <asp:Label ID="lblAddToGroupValue" runat="server"></asp:Label>
            </span>
        </td>
    </tr>
    <tr>
        <td></td>
        <td>
            <span class="slxlabel">
                <asp:Label ID="lblLeadsGroup" runat="server" Text="<%$ resources:lblLeadsGroup.Caption %>" AssociatedControlID="lblLeadsGroupValue"></asp:Label>
            </span>
        </td>
        <td>
            <span class="textcontrol>
                <asp:Label ID="lblLeadsGroupValue" runat="server"></asp:Label>
            </span>
        </td>
    </tr>
    <tr>
        <td></td>
        <td>
            <span class="slxlabel">
                <asp:Label ID="lblCheckDuplicates" runat="server" Text="<%$ resources:lblCheckDuplicates.Caption %>" AssociatedControlID="lblCheckDuplicatesValue"></asp:Label>
            </span>
        </td>
        <td>
            <asp:Label ID="lblCheckDuplicatesValue" runat="server"></asp:Label>
        </td>
    </tr>
    <tr>
        <td></td>
        <td>
            <span class="slxlabel">
                <asp:Label ID="lblGroupAction" runat="server" Text="<%$ resources:lblGroupAction.Caption %>"></asp:Label>
            </span>
        </td>
        <td >
          
            <span class="textcontrol">
               <asp:BulletedList ID="blActions" runat="server" BulletStyle="Circle" ></asp:BulletedList>
            </span>
          
        </td>
    </tr>

</table>