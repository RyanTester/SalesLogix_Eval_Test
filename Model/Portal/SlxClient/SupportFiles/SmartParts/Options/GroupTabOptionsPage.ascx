<%@ Control Language="C#" CodeFile="GroupTabOptionsPage.ascx.cs" Inherits="GroupTabOptionsPage" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>

<div style="display:none">
<asp:Panel ID="LitRequest_RTools" runat="server" meta:resourcekey="LitRequest_RToolsResource1">
    <asp:ImageButton runat="server" ID="btnSave" ToolTip="Save" ImageUrl="~/images/icons/Save_16x16.gif" meta:resourcekey="cmdSave_rsc" />
   <SalesLogix:PageLink ID="PrefsGroupHelpLink" runat="server" LinkType="HelpFileName" ToolTip="<%$ resources:Portal, Help_ToolTip %>" ImageUrl="~/ImageResource.axd?scope=global&amp;type=Global_Images&amp;key=Help_16x16"
     Target="Help" NavigateUrl="prefsgroup.aspx" meta:resourcekey="PrefsGroupHelpLinkResource2"></SalesLogix:PageLink>
</asp:Panel>
</div>

<style>
.grid-options .option-check input { width: 22px; }
.grid-options .option-check label { width: 22px; font-weight: bold; }
.grid-options .option-check-desc { margin-left: 22px; }
.indented { text-indent: 2em; }
</style>

<table border="0" cellpadding="1" cellspacing="0" class="formtable" style="margin-top:0px">
	<col width="50%" /><col width="50%" />
    <tr>
        <td>
            <table border="0" cellpadding="1" cellspacing="0" class="formtable" style="margin-top:0px">
                <tr>
		            <td class="highlightedCell">
			            <asp:Label ID="lblGroupTabOptions" runat="server" Font-Bold="True" Text="Group Options" meta:resourcekey="lblGroupTabOptionsResource1"></asp:Label>
            			
		            </td>
                </tr>
                <tr>
                     <td>
			            <span class="lbl"><asp:Label ID="lblMainView" runat="server" Text="Main View:" meta:resourcekey="lblMainViewResource1"></asp:Label></span>
			            <span class="textcontrol"><asp:DropDownList runat="server" ID="ddlMainView" AutoPostBack="True" CssClass="optionsInputClass" meta:resourcekey="ddlMainViewResource1"></asp:DropDownList></span>
		            </td>
               </tr>
               <tr>
                     <td>
			            <span class="lbl indented"><asp:Label ID="lblDefaultGroup" runat="server" Text="Default Group:" meta:resourcekey="lblDefaultGroupResource1"></asp:Label></span>
			            <span class="textcontrol"><asp:DropDownList runat="server" ID="ddlGroup" CssClass="optionsInputClass" meta:resourcekey="ddlGroupResource1"></asp:DropDownList></span>
		            </td>
              </tr>
              <tr>
                    <td>
			            <span class="lbl indented"><asp:Label ID="lblLookupLayoutGroup" runat="server" Text="Default Lookup Layout:" meta:resourcekey="lblLookupLayoutGroup1"></asp:Label></span>
			            <span class="textcontrol"><asp:DropDownList runat="server" ID="ddlLookupLayoutGroup" CssClass="optionsInputClass" meta:resourcekey="ddlLookupLayoutGroup1"></asp:DropDownList></span>
		            </td>
              </tr>
            </table>
        </td>
        <td>
            <table border="0" cellpadding="1" cellspacing="0" class="formtable" style="margin-top:0px">
                <tr>
            		<td class="highlightedCell">
		                <asp:Label ID="lblGroupTabGridOptions" runat="server" Font-Bold="True" Text="Grid Options" meta:resourcekey="lblGroupTabGridOptionsResource1"></asp:Label>
		            </td>
                </tr>
                <tr>
		            <td class="grid-options">
		                <asp:CheckBox runat="server" ID="cbAutoFitColumns" Text="Auto-fit Columns" meta:resourcekey="cbAutoFitColumnsResource1" CssClass="option-check" />
		                <br />
		                <div class="option-check-desc">
		                <asp:Label runat="server" ID="lblAutoFitColumnsDescription" Text="Text" meta:resourcekey="lblAutoFitColumnsDescriptionResource1"></asp:Label>
		                </div>
		            </td>
	            </tr>
                <tr>
		            <td>
		            </td>
	            </tr>
                <tr>
		            <td>
		            </td>
	            </tr>
	        </table>
	    </td>
	</tr>
</table>
