<%@ Control Language="C#" AutoEventWireup="true" CodeFile="ChangePasswordOptionsPage.ascx.cs" Inherits="ChangePasswordOptionsPage" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>

<div style="display:none">
<asp:Panel ID="LitRequest_RTools" runat="server" meta:resourcekey="LitRequest_RToolsResource1">
   <asp:ImageButton runat="server" ID="btnSave" OnClick="_changePassword_Click" ToolTip="Save" ImageUrl="~/images/icons/Save_16x16.gif" meta:resourcekey="btnSaveResource1" />
   <SalesLogix:PageLink ID="PrefsPasswordHelpLink" runat="server" LinkType="HelpFileName" ToolTip="<%$ resources:Portal, Help_ToolTip %>" ImageUrl="~/ImageResource.axd?scope=global&amp;type=Global_Images&amp;key=Help_16x16"
     Target="Help" NavigateUrl="prefspassadmin.aspx" meta:resourcekey="PrefsPasswordHelpLinkResource2"></SalesLogix:PageLink>
</asp:Panel>
</div>

<table border="0" cellpadding="1" cellspacing="0" class="formtable" style="margin-top:0px;">
	<col width="50%" /><col width="50%" />
	<tr>
        <td colspan="2" class="highlightedCell">
            <asp:Label ID="lblChangePassword" runat="server" Font-Bold="True" Text="Change Password" meta:resourcekey="lblChangePasswordResource1"></asp:Label>
		</td>
	</tr>
    <tr>
        <td>
			<span class="lbl"><asp:Label ID="lblUser" runat="server" Text="User:" meta:resourcekey="lblUserResource1"></asp:Label></span>
			<span class="textcontrol">
				<SalesLogix:SlxUserControl runat="server" ID="User" AutoPostBack="False" DisplayMode="AsControl" meta:resourcekey="UserResource2" >
					<UserDialogStyle BackColor="Control" />
				</SalesLogix:SlxUserControl>
			</span>
		</td>
		<td></td>
    </tr>
    <tr>
        <td>
			<span class="lbl"><asp:Label ID="lblNewPassword" runat="server" Text="New Password:" meta:resourcekey="lblNewPasswordResource1"></asp:Label></span>
			<span class="textcontrol">
				<asp:TextBox ID="_newPassword" TextMode="Password" runat="server" meta:resourcekey="_newPasswordResource1"></asp:TextBox>
			</span>
		</td>
		<td><asp:Label ID="lblMessage" runat="server" ForeColor="Red" meta:resourcekey="lblMessageResource1" ></asp:Label></td>
    </tr>
    <tr>
        <td>
			<span class="lbl"><asp:Label ID="lblConfirm" runat="server" Text="Confirm Password:" meta:resourcekey="lblConfirmResource1"></asp:Label></span>
			<span class="textcontrol">
				<asp:TextBox ID="_confirmPassword" TextMode="Password" runat="server" meta:resourcekey="_confirmPasswordResource1"></asp:TextBox>
			</span>
		</td>
		<td></td>
    </tr>
</table>