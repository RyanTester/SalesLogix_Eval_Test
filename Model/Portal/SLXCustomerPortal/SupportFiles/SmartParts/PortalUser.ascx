<%@ Control Language="C#" AutoEventWireup="true" CodeFile="PortalUser.ascx.cs" Inherits="PortalUser" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>


<table border="0" cellpadding="1" cellspacing="0" class="formtable">
  <col width="33%" /><col width="33%" /><col width="33%" />
  <tr>
  <td>
        <asp:Label CssClass="lbl" ID="lblContactName" runat="server" Text="Contact Name:" meta:resourcekey="lblContactResource" 
            AssociatedControlID="txtContactName">
        </asp:Label>
        <span class="textcontrol">
            <asp:TextBox ID="txtContactName" runat="server" Enabled="false"></asp:TextBox>
        </span>
  </td>
  <td>
        <asp:Label CssClass="lbl" ID="lblWorkPhone" runat="server" Text="Work Phone:" meta:resourcekey="lblPhoneResource"
            AssociatedControlID="phnWorkPhone"></asp:Label>
        <span class="textcontrol">
            <SalesLogix:Phone Enabled="false" ID="phnWorkPhone" runat="server"></SalesLogix:Phone>
        </span>
  </td>
  <td>&nbsp;</td>
</tr>
<tr>
	<td>
        <asp:Label CssClass="lbl" ID="lblCompanyName" runat="server" Text="Company Name:" meta:resourcekey="lblCompanyResource"
            AssociatedControlID="txtCompanyName">
        </asp:Label>
        <span class="textcontrol">
            <asp:TextBox ID="txtCompanyName" runat="server" Enabled="false"></asp:TextBox>
        </span>
	</td>
	<td>
        <asp:Label CssClass="lbl" ID="lblEmail" runat="server" Text="Email:" meta:resourcekey="lblEmailResource"
            AssociatedControlID="cmdEmail"></asp:Label>
        <span class="textcontrol">
            <SalesLogix:Email ID="cmdEmail" runat="server" Enabled="false" ToolTip="<%$ resources: cmdEmail.ToolTip %>"></SalesLogix:Email>
        </span>
	</td>
  <td>&nbsp;</td>
</tr>  
</table>
