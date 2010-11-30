<%@ Control Language="C#" AutoEventWireup="true" CodeFile="MainWhatsNew.ascx.cs" Inherits="SmartParts_NonWhatsNew_NonWhatsNew" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls"
    TagPrefix="SalesLogix" %>
<%@ Register Assembly="System.Web.Extensions, Version=3.5.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35"
    Namespace="System.Web.UI" TagPrefix="asp" %>

<div style="display: none">
    <asp:Panel ID="wnTools" runat="server">
        <SalesLogix:PageLink ID="WhatsNewHelpLink" runat="server" LinkType="HelpFileName" ToolTip="<%$ resources: Portal, Help_ToolTip %>" Target="Help" NavigateUrl="whatsnew" ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16"></SalesLogix:PageLink>
    </asp:Panel>
</div>

<table border="0" cellpadding="1" cellspacing="0" class="formtable">
	<col width="25%" /><col width="75%" />
	<tr>
		<td colspan="2">
		    <div class="lbl">
			    <span class="slxlabel" style="padding-left:35px"><asp:Label ID="OppWNChanges_lz" AssociatedControlID="ChangeDate" runat="server" Text="<%$ resources : ChangesOnOrAfter %>"></asp:Label></span>
			</div>
		</td>
	</tr>
	<tr>
		<td>
		    <asp:Panel runat="server" ID="ctrlstQuantity" CssClass="controlslist">
		        <span class="textcontrol" style="padding-left:35px; padding-right:20px;">
                    <SalesLogix:DateTimePicker runat="server" ID="ChangeDate" DisplayTime="false" />
                </span>
                <div>
                    <asp:Button ID="cmdSearch" runat="server" Text="<%$ resources : Search %>" OnClick="OnSearch" />
                </div>
            </asp:Panel>
        </td>
	</tr>
</table>
