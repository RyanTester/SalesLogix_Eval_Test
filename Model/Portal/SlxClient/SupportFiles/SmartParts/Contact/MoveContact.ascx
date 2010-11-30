<%@ Control Language="C#" AutoEventWireup="true" CodeFile="MoveContact.ascx.cs" Inherits="SmartParts_Contact_MoveContact" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.PickList" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.DependencyLookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Lookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.ScriptResourceProvider" TagPrefix="Saleslogix" %>



 <SalesLogix:ScriptResourceProvider ID="MoveContactLinks" runat="server">
    <Keys>
        <SalesLogix:ResourceKeyName Key="MoveOptionsMore" />
        <SalesLogix:ResourceKeyName Key="MoveOptionsLess" />
    </Keys>
 </SalesLogix:ScriptResourceProvider>
 
<div style="display:none">
<asp:Panel ID="MoveContact_LTools" runat="server" meta:resourcekey="MoveContact_LToolsResource1">
</asp:Panel>
<asp:Panel ID="MoveContact_CTools" runat="server" meta:resourcekey="MoveContact_CToolsResource1">
</asp:Panel>
<asp:Panel ID="MoveContact_RTools" runat="server" meta:resourcekey="MoveContact_RToolsResource1">
<SalesLogix:PageLink ID="MoveContactHelpLink" runat="server" LinkType="HelpFileName" ToolTip="<%$ resources: Portal, Help_ToolTip %>" Target="Help" NavigateUrl="contactmove.aspx" ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16"></SalesLogix:PageLink></asp:Panel>
</div>

<table border="0" cellpadding="1" cellspacing="0" class="formtable">
	<col width="100%" />
	<tr>
		<td >  
			<span class="lbl"><asp:Label ID="lblMove" runat="server" Text="Move:" Width="75px" meta:resourcekey="lblMoveResource1"></asp:Label></span>
			<span class="textcontrol">
				<SalesLogix:LookupControl runat="server" ID="lueMoveContact" LookupEntityName="Contact" LookupEntityTypeName="Sage.SalesLogix.Entities.Contact, Sage.SalesLogix.Entities" EnableHyperLinking="false" AutoPostBack="true" >
				<LookupProperties>
				<SalesLogix:LookupProperty PropertyHeader="Account"     meta:resourcekey="LookupPropertyAccount"       PropertyName="AccountName" PropertyFormat="None" UseAsResult="True"></SalesLogix:LookupProperty>
				<SalesLogix:LookupProperty PropertyHeader="Last Name"   meta:resourcekey="LookupPropertyLastName"      PropertyName="LastName" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
				<SalesLogix:LookupProperty PropertyHeader="First Name"  meta:resourcekey="LookupPropertyFirstName"     PropertyName="FirstName" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
				<SalesLogix:LookupProperty PropertyHeader="Work"        meta:resourcekey="LookupPropertyWork"          PropertyName="WorkPhone" PropertyFormat="Phone"  UseAsResult="True"></SalesLogix:LookupProperty>
				<SalesLogix:LookupProperty PropertyHeader="Mobile"      meta:resourcekey="LookupPropertyMobile"        PropertyName="Mobile" PropertyFormat="Phone"  UseAsResult="True"></SalesLogix:LookupProperty>
				<SalesLogix:LookupProperty PropertyHeader="E-mail"      meta:resourcekey="LookupPropertyEmail"         PropertyName="Email" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
				</LookupProperties>                                    
				<LookupPreFilters>
				</LookupPreFilters>
				</SalesLogix:LookupControl>
			</span>
		</td>
	  </tr>
	  <tr>
		<td>
			<span class="lbl"><asp:Label ID="lblFrom" runat="server" Text="From:" Width="75px" meta:resourcekey="lblFromResource1"></asp:Label></span>
			<span class="textcontrol"><asp:TextBox ID="txtFromAccount" runat="server" Enabled="False" meta:resourcekey="txtFromAccountResource1"></asp:TextBox></span>
		</td>
	  </tr>
	  <tr>
		<td>
			<span class="lbl"><asp:Label ID="lblTo" runat="server" Text="To:" Width="75px" meta:resourcekey="lblToResource1"></asp:Label></span>
			<span class="textcontrol">
				<SalesLogix:LookupControl runat="server" ID="lueToAccount" LookupEntityName="Account" LookupEntityTypeName="Sage.SalesLogix.Entities.Account, Sage.SalesLogix.Entities" EnableHyperLinking="false"  AutoPostBack="true">
				<LookupProperties>
				<SalesLogix:LookupProperty PropertyHeader="Account" PropertyName="AccountName" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
				<SalesLogix:LookupProperty PropertyHeader="Main" PropertyName="MainPhone" PropertyFormat="Phone"  UseAsResult="True"></SalesLogix:LookupProperty>
				<SalesLogix:LookupProperty PropertyHeader="Type" PropertyName="Type" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
				<SalesLogix:LookupProperty PropertyHeader="Sub-Type" PropertyName="SubType" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
				<SalesLogix:LookupProperty PropertyHeader="Status" PropertyName="Status" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
				</LookupProperties>
				<LookupPreFilters>
				</LookupPreFilters>
				</SalesLogix:LookupControl>
			</span>
		</td>
	  </tr>
	  <tr>
		<td>
			<span><input type="button" ID="cmdMoveOptions" runat="server" class="slxbutton" onclick="javascript:ShowOrHideOptions();" /></span>
		</td>
	  </tr>  
  
 </table>

<div id="MoveOptions" style="display:none" runat="server" >
	<table border="0" cellpadding="1" cellspacing="0" class="formtable">
		<col width="100%" />
		<tr>
			<td > 
				<span class="lbl"><asp:Label ID="lblOptions" runat="server" Text="Options:" meta:resourcekey="lblOptionsResource1"></asp:Label></span>
			</td>
		</tr>
		<tr>
			<td>
				<span class="lblright">
					<asp:RadioButtonList ID="rblCopyMoved" runat="server"
						Width="402px" meta:resourcekey="rblCopyMovedResource1">
						<asp:ListItem Selected="True" Value="0" meta:resourcekey="ListItemResource1">Copy Contact and associate new Contact with original</asp:ListItem>
						<asp:ListItem Value="1" meta:resourcekey="ListItemResource2">Move the Contact to the new Account</asp:ListItem>
					</asp:RadioButtonList><br />
				</span>
			</td>
		</tr>
		<tr>
			<td>
				<span class="lblright">
					<asp:RadioButtonList ID="rblUseKeep" runat="server" Width="400px" meta:resourcekey="rblUseKeepResource1">
						<asp:ListItem Selected="True" Value="0" meta:resourcekey="ListItemResource3">Use Address(es) and Phone(s) of new Account</asp:ListItem>
						<asp:ListItem Value="1" meta:resourcekey="ListItemResource4">Keep original Address(es) and Phone(s)</asp:ListItem>
					</asp:RadioButtonList>				
				</span>
			</td>
		</tr>
		<tr>
			<td style="padding-top:20px;padding-left:20px">
				<span class="lblright">
					<asp:CheckBox ID="chkCopyHistory" runat="server" Text="Copy History related to Contact to the new Account" Width="366px" Checked="True" meta:resourcekey="chkCopyHistoryResource1" />				
				</span>
			</td>
		</tr>
		<tr>
			<td style="padding-left:20px;">
				<span class="lblright">
					<asp:CheckBox ID="chkCopyActivities" runat="server" Text="Copy Activities related to Contact to the new Account" Width="373px" meta:resourcekey="chkCopyActivitiesResource1" />
				</span>
			</td>
		</tr>
		<tr>
			<td style="padding-top:20px;">
				<span class="lbl"><asp:Label ID="lblReassign" runat="server" Text="Reassign open items to:" meta:resourcekey="lblReassignResource1"></asp:Label></span>
				<span class="textcontrol">
					<SalesLogix:LookupControl runat="server" ID="lueOpenItemsContact" LookupEntityName="Contact" LookupEntityTypeName="Sage.SalesLogix.Entities.Contact, Sage.SalesLogix.Entities" EnableHyperLinking="false" >
					<LookupProperties>
					<SalesLogix:LookupProperty PropertyHeader="Account"     meta:resourcekey="LookupPropertyAccount"           PropertyName="AccountName" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
					<SalesLogix:LookupProperty PropertyHeader="Last Name"   meta:resourcekey="LookupPropertyLastName"          PropertyName="LastName" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
					<SalesLogix:LookupProperty PropertyHeader="First Name"  meta:resourcekey="LookupPropertyFirstName"         PropertyName="FirstName" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
					<SalesLogix:LookupProperty PropertyHeader="Work"        meta:resourcekey="LookupPropertyWork"              PropertyName="WorkPhone" PropertyFormat="Phone"  UseAsResult="True"></SalesLogix:LookupProperty>
					<SalesLogix:LookupProperty PropertyHeader="Mobile"      meta:resourcekey="LookupPropertyMobile"            PropertyName="Mobile" PropertyFormat="Phone"  UseAsResult="True"></SalesLogix:LookupProperty>
					<SalesLogix:LookupProperty PropertyHeader="E-mail"      meta:resourcekey="LookupPropertyEmail"             PropertyName="Email" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
					</LookupProperties>                                    
					<LookupPreFilters>
					</LookupPreFilters>
					</SalesLogix:LookupControl>				
				</span>
			</td>
		</tr>
		<tr>
			<td>
				<span class="lbl"><asp:Label ID="lblWhenMoving" runat="server" Text="When moving, reassign  completed items to:" meta:resourcekey="lblWhenMovingResource1"></asp:Label></span>
				<span class="textcontrol">
					<SalesLogix:LookupControl runat="server" ID="lueCompletedItemsContact" LookupEntityName="Contact" LookupEntityTypeName="Sage.SalesLogix.Entities.Contact, Sage.SalesLogix.Entities" EnableHyperLinking="false" >
					<LookupProperties>
					<SalesLogix:LookupProperty PropertyHeader="Account"     meta:resourcekey="LookupPropertyAccount"    PropertyName="AccountName" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
					<SalesLogix:LookupProperty PropertyHeader="Last Name"   meta:resourcekey="LookupPropertyLastName"   PropertyName="LastName" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
					<SalesLogix:LookupProperty PropertyHeader="First Name"  meta:resourcekey="LookupPropertyFirstName"  PropertyName="FirstName" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
					<SalesLogix:LookupProperty PropertyHeader="Work"        meta:resourcekey="LookupPropertyWork"       PropertyName="WorkPhone" PropertyFormat="Phone"  UseAsResult="True"></SalesLogix:LookupProperty>
					<SalesLogix:LookupProperty PropertyHeader="Mobile"      meta:resourcekey="LookupPropertyMobile"     PropertyName="Mobile" PropertyFormat="Phone"  UseAsResult="True"></SalesLogix:LookupProperty>
					<SalesLogix:LookupProperty PropertyHeader="E-mail"      meta:resourcekey="LookupPropertyEmail"     PropertyName="Email" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
					</LookupProperties>
					<LookupPreFilters>
					</LookupPreFilters>
					</SalesLogix:LookupControl>
				</span>
			</td>
		</tr>
	</table>
</div>

<br />
<table border="0" cellpadding="1" cellspacing="0" class="formtable">
	<col width="99%" />
    <col width="1" />
    <col width="1" />
    <tr>
		<td></td>
		<td align="right">
		   <div class="slxButton" style="margin-right:10px">
			 <asp:Button ID="cmdOK" runat="server" Text="OK" CssClass="slxbutton" OnClick="cmdOK_Click" meta:resourcekey="cmdOKResource1" />
		   </div>
		</td>
		<td align="right">
		  <div class="slxButton" style="margin-right:10px">
		    <asp:Button ID="cmdCancel" runat="server" Text="Cancel" CssClass="slxbutton" OnClick="cmdCancel_Click" meta:resourcekey="cmdCancelResource1" />
		  </div>
		</td>
			
	</tr>
</table>






