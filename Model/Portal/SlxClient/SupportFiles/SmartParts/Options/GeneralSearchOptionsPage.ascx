<%@ Control Language="C#" AutoEventWireup="true" CodeFile="GeneralSearchOptionsPage.ascx.cs" Inherits="GeneralSearchOptionsPage" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Lookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.PickList" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.DependencyLookup" TagPrefix="SalesLogix" %>

<style type="text/css">
    .style1
    {
        height: 23px;
    }
</style>

<div style="display:none">
<asp:Panel ID="LitRequest_RTools" runat="server" meta:resourcekey="LitRequest_RToolsResource1">
    <asp:ImageButton runat="server" ID="cmdSave" ToolTip="Save" OnClick="_save_Click" ImageUrl="~/images/icons/Save_16x16.gif" meta:resourcekey="cmdSave_rsc" />
    <SalesLogix:PageLink ID="GeneralOptionsHelpLink" runat="server" LinkType="HelpFileName" ToolTip="<%$ resources:Portal, Help_ToolTip %>" ImageUrl="~/ImageResource.axd?scope=global&amp;type=Global_Images&amp;key=Help_16x16"
     Target="Help" NavigateUrl="prefsgen.aspx" meta:resourcekey="GeneralOptionsHelpLinkResource2"></SalesLogix:PageLink>
</asp:Panel>
</div>

<asp:HiddenField runat="server" ID="FaxProviderSelectedValue" Value="undefined" />

<%--Used to store resources:msgMenuRangeMessage for use in javascript.--%>
<asp:HiddenField ID="htxtMenuRangeMessage" Value="<%$ resources:msgMenuRangeMessage %>" runat="server" />

<table border="0" cellpadding="1" cellspacing="0" class="formtable" style="margin-top:0px">
	<col width="50%" /><col width="50%" />
	<tr>
		<td class="highlightedCell">
			<asp:Label ID="lblGenOptions" runat="server" Font-Bold="True" Text="General Options" Width="120px" meta:resourcekey="lblGenOptionsResource1"></asp:Label>
		</td>
		<td class="highlightedCell">
			<asp:Label ID="lblEmailOptions" runat="server" Font-Bold="True" Text="E-mail Options:" meta:resourcekey="lblEmailOptionsResource1" ></asp:Label>
		</td>
	</tr>
	<tr>
		<td>
			<span class="lbl"><asp:Label ID="lblShowOnStartup" runat="server" Text="Show on Startup:" Width="123px" meta:resourcekey="lblShowOnStartupResource1"></asp:Label></span>
			<span class="textcontrol"><asp:DropDownList runat="server" ID="_showOnStartup" CssClass="optionsInputClass" meta:resourcekey="_showOnStartupResource1" /></span>
			
		</td>
		<td>
			<span class="lbl"><asp:Label ID="lblLogToHistory" runat="server" Font-Bold="True" Text="Log To History" meta:resourcekey="lblLogToHistoryResource1" ></asp:Label></span>
			<span class="textcontrol"><asp:DropDownList ID="_logToHistory" runat="server" DataTextField="Key" DataValueField="Value" meta:resourcekey="_logToHistoryResource1">
                            </asp:DropDownList></span>
		</td>                        
	</tr>
        <tr>
            <td>
				<span class="lbl"><asp:Label ID="lblDefaultOwner" runat="server" Text="Default Owner/Team:" Width="165px" meta:resourcekey="lblDefaultOwnerResource1"></asp:Label></span>
				<span class="textcontrol">
                <SalesLogix:OwnerControl runat="server" ID="_defaultOwnerTeam" AutoPostBack="False" DisplayMode="AsControl" meta:resourcekey="_defaultOwnerTeamResource1" >
                    <OwnerDialogStyle BackColor="Control" />
                </SalesLogix:OwnerControl></span>
			</td>
			<td class="slxlabel checkbox">
				<asp:CheckBox ID="_promptDuplicateContacts" runat="server"
                  Text="<span id='lblPromptForDup'>Prompt for Duplicate Contacts or Leads</span>" meta:resourcekey="_promptDuplicateContactsResource1" />
            </td>
		</tr>
        <tr>
			<td>
				<span class="lbl"><asp:Label ID="lblIntellisync" runat="server" Text="Intellisync Contact Group:" meta:resourcekey="lblIntellisyncResource1"></asp:Label></span>
                <span class="textcontrol">
                <asp:DropDownList ID="_intellisyncGroup" CssClass="optionsInputClass" 
                    DataTextField="Text" DataValueField="Value" runat="server">
                </asp:DropDownList>
                </span>
			</td>
            <td class="style1">
				<span class="slxlabel checkbox"><asp:CheckBox ID="_promptContactNotFound" runat="server"
                      Text="<span id='lblPromptConNotFound'>Prompt for Contact or Lead not Found</span>" meta:resourcekey="_promptContactNotFoundResource1" />
				</span>
            </td>        
        </tr>		
		<tr>
		    <td>
		        <span class="lbl"><asp:Label ID="lblAutoLogoff" runat="server" Text="Enable Automatic Logoff:" meta:resourcekey="lblAutoLogoffResource1"></asp:Label></span>
                <span>
                    <asp:CheckBox ID="_autoLogoff" runat="server" />
                    <asp:Label ID="lblLogOffAfter" runat="server" Text="Log off after" meta:resourcekey="lblLogOffAfterResource1"></asp:Label>
                    <asp:TextBox ID="_logoffDuration" width="30px" runat="server" ></asp:TextBox>
                    <asp:DropDownList ID="_logoffUnits" runat="server" DataTextField="Key" DataValueField="Value"></asp:DropDownList>
                </span>
		    </td><td></td>
		</tr>
		<tr>
		    <td>
		        <span class="lbl" style="width:100%"><asp:CheckBox ID="chkPromptForUnsavedData" runat="server" Text="<%$ resources: PromptForUnsavedData %>" /></span>
		    </td>
		</tr>
        <tr>
            <td>
				<span class="lbl"><asp:Label ID="lblEmailBaseTemplate" runat="server" Text="E-mail Base Template:" meta:resourcekey="lblEmailBaseTemplateResource1"></asp:Label></span>
                <span class="textcontrol">
					<span runat="server" id="EmailSpan">
						<asp:TextBox ID="txtEmailBaseTemplate" runat="server" meta:resourcekey="txtEmailBaseTemplateResource1"></asp:TextBox>
						<img alt="find" src="images/icons/find_16x16.gif" class="optionsImageClass" onclick="getTemplate('Email')" />
						<asp:TextBox ID="txtEmailBaseTemplateId" runat="server" meta:resourcekey="txtEmailBaseTemplateIdResource1"></asp:TextBox>
					</span>
                </span>
            </td>
			<td></td>
        </tr>
        <tr>
            <td>
				<span class="lbl"><asp:Label ID="lblLetterBaseTemplate" runat="server" Text="Letter Base Template:" meta:resourcekey="lblLetterBaseTemplateResource1"></asp:Label></span>
				<span class="textcontrol">
					<span runat="server" id="LetterSpan">
						<asp:TextBox ID="txtLetterBaseTemplate" runat="server" meta:resourcekey="txtLetterBaseTemplateResource1"></asp:TextBox>
						<img alt="find" src="images/icons/find_16x16.gif" class="optionsImageClass" onclick="getTemplate('Letter')" />
						<asp:TextBox ID="txtLetterBaseTemplateId" runat="server" meta:resourcekey="txtLetterBaseTemplateIdResource1"></asp:TextBox>
					</span>
				</span>
            </td>
            <td>
            </td>
        </tr>
        <tr>
            <td>
				<span class="lbl"><asp:Label ID="lblFaxBaseTemplate" runat="server" Text="Fax Base Template:" meta:resourcekey="lblFaxBaseTemplateResource1"></asp:Label></span>
				<span class="textcontrol">
					<span runat="server" id="FaxSpan">
						<asp:TextBox ID="txtFaxBaseTemplate" runat="server" meta:resourcekey="txtFaxBaseTemplateResource1"></asp:TextBox>
						<img alt="find" src="images/icons/find_16x16.gif" class="optionsImageClass" onclick="getTemplate('Fax')" />
						<asp:TextBox ID="txtFaxBaseTemplateId" runat="server" meta:resourcekey="txtFaxBaseTemplateIdResource1"></asp:TextBox>
					</span>
			   </span>
			</td>
        </tr>        
        <tr>
            <td>
				<span class="lbl"><asp:Label ID="lblRecentTemplates" runat="server" Text="Write Menu - Recent Templates:" meta:resourcekey="lblRecentTemplatesResource1"></asp:Label></span>
				<span class="textcontrol">
	                <asp:TextBox ID="txtRecentTemplates" runat="server" meta:resourcekey="txtRecentTemplatesResource1"></asp:TextBox>
				</span>
            </td>
            <td></td>
        </tr>
        <tr>
            <td>
				<span class="lbl"><asp:Label ID="lblFaxProvider" runat="server" Text="Fax Provider:" meta:resourcekey="lblFaxProviderResource1"></asp:Label></span>
				<span class="textcontrol">
                <span id="FaxProviderOptions"></span>
                <asp:TextBox ID="txtFaxProvider" runat="server" meta:resourcekey="txtFaxProviderResource1"></asp:TextBox>
                </span>
            </td>
            <td><asp:Button ID="btnFlushCache" runat="server" Text="Clear Cache" visible="false" Enabled="false" OnClick="btnFlushCache_Click" meta:resourcekey="btnFlushCache1" /></td>
        </tr>
        <tr>
            <td>
				<span class="lbl"><asp:Label ID="lblMyCurrency" runat="server" Text="My Currency:" meta:resourcekey="lblMyCurrencyResource1"></asp:Label></span>
				<span class="textcontrol">
					<SalesLogix:LookupControl runat="server" ID="luMyCurrency" LookupEntityName="ExchangeRate" LookupEntityTypeName="Sage.Entity.Interfaces.IExchangeRate, Sage.Entity.Interfaces, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null">
					<LookupProperties>
						<SalesLogix:LookupProperty PropertyHeader="Description" PropertyName="Description" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
						<SalesLogix:LookupProperty PropertyHeader="Currency Code" PropertyName="Id" PropertyFormat="None"  UseAsResult="True"></SalesLogix:LookupProperty>
						<SalesLogix:LookupProperty PropertyHeader="Rate" PropertyName="Rate" PropertyFormat="None"  UseAsResult="True" ExcludeFromFilters="True" meta:resourceKey="LPRate_rsc"></SalesLogix:LookupProperty>
					</LookupProperties>
					<LookupPreFilters>
					</LookupPreFilters>
					</SalesLogix:LookupControl>				
				</span>
            </td>
            <td></td>
        </tr>   
        <tr>
        		<td class="highlightedCell">
            <%--<td colspan="2" class="slxlabel">--%>
			    <asp:Label ID="ExtendedFeatures" runat="server" Text="Extended Features may require a download - " meta:resourcekey="ExtendedFeaturesResource2"></asp:Label>
			    <asp:HyperLink ID="FindOut" runat="server" Text="Find out more" NavigateUrl="javascript:showMoreInfo()" meta:resourcekey="ExtendedFeaturesResource1"></asp:HyperLink>
            </td>
            <td></td>
        </tr>
        <tr>
            <td colspan="2" class="slxlabel checkbox">
                <asp:CheckBox ID="_useActiveMail" runat="server" Text="Use ActiveMail (requires ActiveX)" meta:resourcekey="UseActiveMailResource" />
			</td>
        </tr>    
        <tr>
			<td colspan="2" class="slxlabel checkbox">
                <asp:CheckBox ID="_useActiveReporting" runat="server" Text="Use ActiveReporting (requires ActiveX and Crystal Runtime)" meta:resourcekey="UseActiveReportingResource" />
			</td>        
        </tr> 
        
</table>

<%--                   
    <table style="display: none; width: 421px">
        <tr style="display:none">
            <td colspan="2" class="highlightedCell">
                <asp:Label ID="lblSearchOptions" runat="server" Font-Bold="True" Text="Search Options" meta:resourcekey="lblSearchOptionsResource1"></asp:Label></td>
        </tr>
        <tr style="display:none">
            <td style="width: 217px" valign="top">
                <asp:Label ID="lblDefaultContactSearch" runat="server" Text="Default Contact Search:" meta:resourcekey="lblDefaultContactSearchResource1"></asp:Label></td>
            <td valign="top">
                <asp:DropDownList ID="_defaultContactSearch" runat="server" DataTextField="Key" DataValueField="Value" meta:resourcekey="_defaultContactSearchResource1">
                </asp:DropDownList>
            </td>
        </tr>
        <tr style="display:none">
            <td style="width: 217px; height: 23px;" valign="top">
                <asp:Label ID="lblDefaultAccountSearch" runat="server" Text="Default Account Search:" meta:resourcekey="lblDefaultAccountSearchResource1"></asp:Label></td>
            <td style="height: 23px" valign="top">
                <asp:DropDownList ID="_defaultAccountSearch" runat="server" DataTextField="Key" DataValueField="Value" meta:resourcekey="_defaultAccountSearchResource1">
                </asp:DropDownList>
            </td>
        </tr>
        <tr style="display:none">
            <td style="width: 217px; height: 22px;" valign="top">
                <asp:Label ID="lblDefaultOppSearch" runat="server" Text="Default Opportunity Search:" meta:resourcekey="lblDefaultOppSearchResource1"></asp:Label></td>
            <td valign="top" style="height: 22px">
                <asp:DropDownList ID="_defaultOpportunitySearch" runat="server" DataTextField="Key" DataValueField="Value" meta:resourcekey="_defaultOpportunitySearchResource1">
                </asp:DropDownList>
            </td>
        </tr>
        
    </table>--%>
<script type="text/javascript">
function checkMenuRange()
{
    var oRecentTemplatesControl = document.getElementById("<%= txtRecentTemplates.ClientID %>");
    if (oRecentTemplatesControl != null)
    {
        var iCount = oRecentTemplatesControl.value;
        if ((iCount == null) || (iCount == ""))
        {
            oRecentTemplatesControl.value = "0";
        }
        else
        {
            if (!isNaN(iCount))
            {
                iCount = parseInt(iCount);
                if ((iCount < 0) || (iCount > 10))
                {
                    alert('<%= htxtMenuRangeMessage.Value %>');
                }
            }
            else
            {
                alert('<%= htxtMenuRangeMessage.Value %>');
            }
        }
    }
}

function getTemplate(mode) {
    InitObjects();
	var vTE = top.TemplateEditor
	vTE.CreateWindow();
	var tmp = false;
	try {
		vTE.TransportType = 0;
		vTE.ConnectionString = CONNSTRING;
		vTE.AttachmentPath     = ATTACHPATH;
	    if (GM.CurrentEntityIsContact || GM.CurrentEntityIsLead)
	    {
	        vTE.CurrentEntityID = GM.CurrentEntityID;
	        vTE.CurrentEntityName = GM.CurrentEntityDescription;
		    vTE.CurrentEntityType = GM.CurrentEntityTableName;
	    }
	    else
	    {
		    vTE.CurrentEntityType = "CONTACT";
	    }	
		vTE.EmailSystem = 2; //emailOutlook

		var tmp = vTE.bShowPreviewButton;
		vTE.bShowPreviewButton = false;


		vTE.CurrentContactName = "";
		vTE.LibraryPath  = LIBRARYPATH;

		vTE.UserID = USERID;
		vTE.UserName = USERNAME;

		vTE.BaseKeyCode = "";
		vTE.Remote = false;
		vTE.SiteCode = SITECODE;


		if (vTE.ShowModal() == 1) {
            var inputs = document.getElementsByTagName("input");
            for (var i=0; i<inputs.length;i++) {
                if (inputs[i].id.indexOf('txt'+mode+'BaseTemplateId') > -1) {
                    inputs[i].value = vTE.SelectedTemplatePluginID;
                } else {
                    if (inputs[i].id.indexOf('txt'+mode+'BaseTemplate') > -1) {
                        inputs[i].value = vTE.SelectedTemplateName;
                    }
                }
            }
		}
	} finally {
		vTE.bShowPreviewButton = tmp;
		vTE.DestroyWindow();
	}
}
Sys.Application.add_load(GeneralSearchOptionsPage_init);
function updateFaxProvider() {
    if (document.getElementById("FaxOptions"))
    {       
        var oFaxProviderSelectedValue = document.getElementById("<%= FaxProviderSelectedValue.ClientID %>");
        if (oFaxProviderSelectedValue != null)
        {
            oFaxProviderSelectedValue.value = document.all.FaxOptions.options[document.all.FaxOptions.selectedIndex].value;
        }
    }
}

 

function showMoreInfo()
{
    var address = 'ActivexInfo.aspx';
    var win = window.open(address, 'AlarmMgrWin', 'width=425,height=425,directories=no,location=no,menubar=no,status=yes,scrollbars=yes,resizable=yes,titlebar=no,toolbar=no');
}

</script>