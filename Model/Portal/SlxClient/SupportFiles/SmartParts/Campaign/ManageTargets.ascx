<%@ Control Language="C#" AutoEventWireup="true" CodeFile="ManageTargets.ascx.cs" Inherits="ManageTargets" %>
<%@ Register Assembly="Sage.SalesLogix.Client.GroupBuilder" Namespace="Sage.SalesLogix.Client.GroupBuilder" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.PickList" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Lookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.Platform.WebPortal" Namespace="Sage.Platform.WebPortal.SmartParts" TagPrefix="SalesLogix" %>
<%@ Register TagPrefix="radU" Namespace="Telerik.WebControls" Assembly="RadUpload.NET2" %>

<style type="text/css">
.activeTab .tableft
{
	background-image : url("./images/blue/TabCurrentLeft.gif");
	float : left;
	height : 24px;
	width : 7px;
}
.activeTab .tabcenter
{
	background-image : url("./images/blue/TabCurrentCenter.gif");
	float : left;
	height : 24px;
	cursor : pointer;
	vertical-align : middle;
}
.activeTab .tabright
{
	background-image : url("./images/blue/TabCurrentRight.gif");
	float : left;
	height : 24px;
	width : 7px;
}
.inactiveTab .tableft
{
	background-image : url("./images/blue/TabLeft.gif");
	float : left;
	height : 24px;
	width : 7px;
}
.inactiveTab .tabcenter
{
	background-image : url("./images/blue/TabCenter.gif");
	float : left;
	height : 24px;
	cursor : pointer;
	vertical-align : middle;
}
.inactiveTab .tabright
{
	background-image : url("./images/blue/TabRight.gif");
	float : left;
	height : 24px;
	width : 7px;
}
</style>

<SalesLogix:SmartPartToolsContainer runat="server" ID="ManageTargets_RTools" ToolbarLocation="right">
    <SalesLogix:PageLink ID="lnkHelp" runat="server" LinkType="HelpFileName" ToolTip="<%$ resources: Portal, Help_ToolTip %>" 
        Target="Help" NavigateUrl="campaignmanagetargets.aspx" ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16">
    &nbsp;
    </SalesLogix:PageLink>
</SalesLogix:SmartPartToolsContainer>

<div id="hiddenProps" style="display:none" runat="server">
    <input id="txtSelectedTab" runat="server" type="hidden" />
</div>

<div id="tabStripArea" style="padding:5px,0px,0px,20px">
    <asp:Panel id="tabLookupTarget" runat="server" CssClass="activeTab">
	    <div class="tableft">&nbsp;</div>
		<div class="tabcenter">
		    <asp:Localize ID="lclTabLookupTarget" runat="server" 
                Text="<%$ resources:tabLookupTarget.Caption %>"></asp:Localize>
		</div>
		<div class="tabright">&nbsp;</div>
	</asp:Panel>
    <asp:Panel id="tabAddFromGroup" runat="server" CssClass="inactiveTab">
	    <div class="tableft">&nbsp;</div>
		<div class="tabcenter">
		    <asp:Localize ID="lclTabAddFromGroup" runat="server" 
                Text="<%$ resources:tabAddFromGroup.Caption %>"></asp:Localize>
		</div>
		<div class="tabright">&nbsp;</div>
	</asp:Panel>
</div>
<br />
<br />

<div style="margin:0px,10px,0px,10px; border: 1px solid #b5cbe0">
    <radU:RadProgressManager ID="radProcessProgressMgr" runat="server" SuppressMissingHttpModuleError="true"
        OnClientProgressUpdating="OnUpdateProgress" />
    <div runat="server" id="divLookupTargets">
        <table border="0" cellpadding="1" cellspacing="0" class="formtable">
            <col width="14%" /> 
            <col width="32%" />
            <col width="3%" />
            <col width="14%" />
            <col width="32%" />
            <col width="1%" />
            <tr id="row1">
                <td colspan="6">
                    <span class="slxlabel">
                        <asp:Label runat="server" ID="lblCaption" Text="<%$ resources: lblCaption.Text %>" />
                    </span>
                    <br />
                    <br />
                </td>
            </tr>
            <tr id="row2">
                <td id="row2col1">
                    <span class="slxlabel">
                        <asp:Label runat="server" ID="lblIncludeType" Text="<%$ resources: lblIncludeType.Caption %>" />
                    </span>
                </td>
                <td colspan="5" id="row2col2">
                    <fieldset class="slxlabel radio" style="width: 90%;" >
                        <asp:RadioButtonList runat="server" ID="rdgIncludeType" RepeatDirection="Horizontal" >
                            <asp:ListItem Text="<%$ resources: rdgIncludeType_Leads.Text %>"
                                Value="<%$ resources: rdgIncludeType_Leads.Value %>" />
                            <asp:ListItem Text="<%$ resources: rdgIncludeType_Accounts.Text %>" Selected="True"
                                Value="<%$ resources: rdgIncludeType_Accounts.Value %>" />
                            <asp:ListItem Text="<%$ resources: rdgIncludeType_AccountsAll.Text %>"
                                Value="<%$ resources: rdgIncludeType_AccountsAll.Value %>" />
                            <asp:ListItem Text="<%$ resources: rdgIncludeType_Contacts.Text %>"
                                Value="<%$ resources: rdgIncludeType_Contacts.Value %>" />
                        </asp:RadioButtonList>
                    </fieldset>
                    <br />
                    <br />
                </td>
            </tr>
            <tr id="row3">
                <td id="row3col1">
                    <div class="slxlabel alignleft">
                        <asp:CheckBox runat="server" ID="chkCompany" CssClass="checkbox" Text="<%$ resources: chkCompany.Caption %>" />
                    </div>
                </td>
                <td id="row3col2">
                    <div class="textcontrol select" >
                        <asp:ListBox runat="server" ID="lbxCompany" SelectionMode="Single" Rows="1">
                            <asp:ListItem  Text="<%$ resources: filter_StartingWith.Text %>"
                                Value="<%$ resources: filter_StartingWith.Value %>" />
                            <asp:ListItem  Text="<%$ resources: filter_Contains.Text %>"
                                Value="<%$ resources: filter_Contains.Value %>" />
                            <asp:ListItem  Text="<%$ resources: filter_EqualTo.Text %>"
                                Value="<%$ resources: filter_EqualTo.Value %>" />
                            <asp:ListItem  Text="<%$ resources: filter_NotEqualTo.Text %>"
                                Value="<%$ resources: filter_NotEqualTo.Value %>" />
                            <asp:ListItem  Text="<%$ resources: filter_EqualLessThan.Text %>"
                                Value="<%$ resources: filter_EqualLessThan.Value %>" />
                            <asp:ListItem  Text="<%$ resources: filter_EqualGreaterThan.Text %>"
                                Value="<%$ resources: filter_EqualGreaterThan.Value %>" />
                            <asp:ListItem  Text="<%$ resources: filter_LessThan.Text %>"
                                Value="<%$ resources: filter_LessThan.Value %>" />
                            <asp:ListItem  Text="<%$ resources: filter_GreaterThan.Text %>"
                                Value="<%$ resources: filter_GreaterThan.Value %>" />
                        </asp:ListBox>
                    </div>
                    <div class="textcontrol" style="width:45%">
                        <asp:TextBox runat="server" ID="txtCompany" />
                    </div>
                </td>
                <td id="row3col3"></td>
                <td id="row3col4">
                    <div class="slxlabel alignleft">
                        <asp:CheckBox runat="server" ID="chkCity" CssClass="checkbox" Text="<%$ resources: chkCity.Caption %>" />
                    </div>
                </td>
                <td id="row3col5">
                    <div class="textcontrol select">
                        <asp:ListBox runat="server" ID="lbxCity" SelectionMode="Single" Rows="1">
                            <asp:ListItem  Text="<%$ resources: filter_StartingWith.Text %>"
                                Value="<%$ resources: filter_StartingWith.Value %>" />
                            <asp:ListItem  Text="<%$ resources: filter_Contains.Text %>"
                                Value="<%$ resources: filter_Contains.Value %>" />
                            <asp:ListItem  Text="<%$ resources: filter_EqualTo.Text %>"
                                Value="<%$ resources: filter_EqualTo.Value %>" />
                            <asp:ListItem  Text="<%$ resources: filter_NotEqualTo.Text %>"
                                Value="<%$ resources: filter_NotEqualTo.Value %>" />
                            <asp:ListItem  Text="<%$ resources: filter_EqualLessThan.Text %>"
                                Value="<%$ resources: filter_EqualLessThan.Value %>" />
                            <asp:ListItem  Text="<%$ resources: filter_EqualGreaterThan.Text %>"
                                Value="<%$ resources: filter_EqualGreaterThan.Value %>" />
                            <asp:ListItem  Text="<%$ resources: filter_LessThan.Text %>"
                                Value="<%$ resources: filter_LessThan.Value %>" />
                            <asp:ListItem  Text="<%$ resources: filter_GreaterThan.Text %>"
                                Value="<%$ resources: filter_GreaterThan.Value %>" />                    
                        </asp:ListBox>
                    </div>
                    <div class="textcontrol" style="width:45%">
                        <asp:TextBox runat="server" ID="txtCity"></asp:TextBox>
                    </div>
                </td>
                <td></td>
            </tr>
            <tr id="row4">
                <td id="row4col1">
                    <div class="slxlabel alignleft">
                        <asp:CheckBox runat="server" ID="chkIndustry" CssClass="checkbox" Text="<%$ resources: chkIndustry.Caption %>" />
                    </div>
                </td>
                <td id="row4col2">
                    <div class="textcontrol select">
                        <asp:ListBox runat="server" ID="lbxIndustry" SelectionMode="Single" Rows="1">
                                <asp:ListItem  Text="<%$ resources: filter_StartingWith.Text %>"
                                    Value="<%$ resources: filter_StartingWith.Value %>" />
                                <asp:ListItem  Text="<%$ resources: filter_Contains.Text %>"
                                    Value="<%$ resources: filter_Contains.Value %>" />
                                <asp:ListItem  Text="<%$ resources: filter_EqualTo.Text %>"
                                    Value="<%$ resources: filter_EqualTo.Value %>" />
                                <asp:ListItem  Text="<%$ resources: filter_NotEqualTo.Text %>"
                                    Value="<%$ resources: filter_NotEqualTo.Value %>" />
                                <asp:ListItem  Text="<%$ resources: filter_EqualLessThan.Text %>"
                                    Value="<%$ resources: filter_EqualLessThan.Value %>" />
                                <asp:ListItem  Text="<%$ resources: filter_EqualGreaterThan.Text %>"
                                    Value="<%$ resources: filter_EqualGreaterThan.Value %>" />
                                <asp:ListItem  Text="<%$ resources: filter_LessThan.Text %>"
                                    Value="<%$ resources: filter_LessThan.Value %>" />
                                <asp:ListItem  Text="<%$ resources: filter_GreaterThan.Text %>"
                                    Value="<%$ resources: filter_GreaterThan.Value %>" />                
                        </asp:ListBox>
                    </div>
                    <div class="textcontrol picklist" style="width:45%">
                        <SalesLogix:PickListControl runat="server" ID="pklIndustry" PickListName="Industry" MustExistInList="false"
                            ValueStoredAsText="false" NoneEditable="true" AlphaSort="true" />
                    </div>
                </td>
                <td id="row4col3"></td>
                <td id="row4col4">
                    <div class="slxlabel alignleft">
                        <asp:CheckBox runat="server" ID="chkState" CssClass="checkbox" Text="<%$ resources: chkState.Caption %>" />
                    </div>
                </td>
                <td id="row4col5">
                    <div class="textcontrol select">
                        <asp:ListBox runat="server" ID="lbxState" SelectionMode="Single" Rows="1">
                                <asp:ListItem  Text="<%$ resources: filter_StartingWith.Text %>"
                                    Value="<%$ resources: filter_StartingWith.Value %>" />
                                <asp:ListItem  Text="<%$ resources: filter_Contains.Text %>"
                                    Value="<%$ resources: filter_Contains.Value %>" />
                                <asp:ListItem  Text="<%$ resources: filter_EqualTo.Text %>"
                                    Value="<%$ resources: filter_EqualTo.Value %>" />
                                <asp:ListItem  Text="<%$ resources: filter_NotEqualTo.Text %>"
                                    Value="<%$ resources: filter_NotEqualTo.Value %>" />
                                <asp:ListItem  Text="<%$ resources: filter_EqualLessThan.Text %>"
                                    Value="<%$ resources: filter_EqualLessThan.Value %>" />
                                <asp:ListItem  Text="<%$ resources: filter_EqualGreaterThan.Text %>"
                                    Value="<%$ resources: filter_EqualGreaterThan.Value %>" />
                                <asp:ListItem  Text="<%$ resources: filter_LessThan.Text %>"
                                    Value="<%$ resources: filter_LessThan.Value %>" />
                                <asp:ListItem  Text="<%$ resources: filter_GreaterThan.Text %>"
                                    Value="<%$ resources: filter_GreaterThan.Value %>" />                
                        </asp:ListBox>
                    </div>
                    <div class="textcontrol" style="width:45%">
                        <asp:TextBox runat="server" ID="txtState"></asp:TextBox>
                    </div>
                </td>
                <td></td>
            </tr>
            <tr id="row5">
                <td id="row5col1">
                    <div class="slxlabel alignleft">
                        <asp:CheckBox runat="server" ID="chkSIC" CssClass="checkbox" Text="<%$ resources: chkSIC.Caption %>" />
                    </div>
                </td>
                <td id="row5col2">
                    <div class="textcontrol select">
                        <asp:ListBox runat="server" ID="lbxSIC"  SelectionMode="Single" Rows="1">
                                <asp:ListItem  Text="<%$ resources: filter_StartingWith.Text %>"
                                    Value="<%$ resources: filter_StartingWith.Value %>" />
                                <asp:ListItem  Text="<%$ resources: filter_Contains.Text %>"
                                    Value="<%$ resources: filter_Contains.Value %>" />
                                <asp:ListItem  Text="<%$ resources: filter_EqualTo.Text %>"
                                    Value="<%$ resources: filter_EqualTo.Value %>" />
                                <asp:ListItem  Text="<%$ resources: filter_NotEqualTo.Text %>"
                                    Value="<%$ resources: filter_NotEqualTo.Value %>" />
                                <asp:ListItem  Text="<%$ resources: filter_EqualLessThan.Text %>"
                                    Value="<%$ resources: filter_EqualLessThan.Value %>" />
                                <asp:ListItem  Text="<%$ resources: filter_EqualGreaterThan.Text %>"
                                    Value="<%$ resources: filter_EqualGreaterThan.Value %>" />
                                <asp:ListItem  Text="<%$ resources: filter_LessThan.Text %>"
                                    Value="<%$ resources: filter_LessThan.Value %>" />
                                <asp:ListItem  Text="<%$ resources: filter_GreaterThan.Text %>"
                                    Value="<%$ resources: filter_GreaterThan.Value %>" />                
                        </asp:ListBox>
                    </div>
                    <div class="textcontrol" style="width:45%">
                        <asp:TextBox runat="server" ID="txtSIC"></asp:TextBox>
                    </div>
                </td>
                <td id="row5col3"></td>
                <td id="row5col4">
                    <div class="slxlabel alignleft">
                        <asp:CheckBox runat="server" ID="chkZip" CssClass="checkbox" Text="<%$ resources: chkZip.Caption %>" />
                    </div>
                </td>
                <td id="row5col5">
                    <div class="textcontrol select">
                        <asp:ListBox runat="server" ID="lbxZip" SelectionMode="Single" Rows="1">
                                <asp:ListItem  Text="<%$ resources: filter_StartingWith.Text %>"
                                    Value="<%$ resources: filter_StartingWith.Value %>" />
                                <asp:ListItem  Text="<%$ resources: filter_Contains.Text %>"
                                    Value="<%$ resources: filter_Contains.Value %>" />
                                <asp:ListItem  Text="<%$ resources: filter_EqualTo.Text %>"
                                    Value="<%$ resources: filter_EqualTo.Value %>" />
                                <asp:ListItem  Text="<%$ resources: filter_NotEqualTo.Text %>"
                                    Value="<%$ resources: filter_NotEqualTo.Value %>" />
                                <asp:ListItem  Text="<%$ resources: filter_EqualLessThan.Text %>"
                                    Value="<%$ resources: filter_EqualLessThan.Value %>" />
                                <asp:ListItem  Text="<%$ resources: filter_EqualGreaterThan.Text %>"
                                    Value="<%$ resources: filter_EqualGreaterThan.Value %>" />
                                <asp:ListItem  Text="<%$ resources: filter_LessThan.Text %>"
                                    Value="<%$ resources: filter_LessThan.Value %>" />
                                <asp:ListItem  Text="<%$ resources: filter_GreaterThan.Text %>"
                                    Value="<%$ resources: filter_GreaterThan.Value %>" />                
                        </asp:ListBox>
                    </div>
                    <div class="textcontrol" style="width:45%">
                        <asp:TextBox runat="server" ID="txtZip"></asp:TextBox>
                    </div>
                </td>
                <td></td>
            </tr>
            <tr id="row6">
                <td id="row6col1">
                    <div class="slxlabel alignleft">
                        <asp:CheckBox runat="server" ID="chkTitle" CssClass="checkbox" Text="<%$ resources: chkTitle.Caption %>" />
                    </div>
                </td>
                <td id="row6col2">
                    <div class="textcontrol select">
                        <asp:ListBox runat="server" ID="lbxTitle" SelectionMode="Single" Rows="1">
                                    <asp:ListItem  Text="<%$ resources: filter_StartingWith.Text %>"
                                        Value="<%$ resources: filter_StartingWith.Value %>" />
                                    <asp:ListItem  Text="<%$ resources: filter_Contains.Text %>"
                                        Value="<%$ resources: filter_Contains.Value %>" />
                                    <asp:ListItem  Text="<%$ resources: filter_EqualTo.Text %>"
                                        Value="<%$ resources: filter_EqualTo.Value %>" />
                                    <asp:ListItem  Text="<%$ resources: filter_NotEqualTo.Text %>"
                                        Value="<%$ resources: filter_NotEqualTo.Value %>" />
                                    <asp:ListItem  Text="<%$ resources: filter_EqualLessThan.Text %>"
                                        Value="<%$ resources: filter_EqualLessThan.Value %>" />
                                    <asp:ListItem  Text="<%$ resources: filter_EqualGreaterThan.Text %>"
                                        Value="<%$ resources: filter_EqualGreaterThan.Value %>" />
                                    <asp:ListItem  Text="<%$ resources: filter_LessThan.Text %>"
                                        Value="<%$ resources: filter_LessThan.Value %>" />
                                    <asp:ListItem  Text="<%$ resources: filter_GreaterThan.Text %>"
                                        Value="<%$ resources: filter_GreaterThan.Value %>" />                
                        </asp:ListBox>
                    </div>
                    <div class="textcontrol picklist" style="width:45%">
                        <SalesLogix:PickListControl runat="server" ID="pklTitle" PickListName="Title" MustExistInList="false" AlphaSort="true" />
                    </div>
                </td>
                <td id="row6col3"></td>
                <td id="row6col4">
                    <div class="slxlabel alignleft">
                        <asp:CheckBox runat="server" ID="chkLeadSource" CssClass="checkbox" Text="<%$ resources: chkLeadSource.Caption %>" />
                    </div>
                </td>
                <td id="row6col5">
                    <div class="textcontrol select">
                        <asp:ListBox runat="server" ID="lbxLeadSource" SelectionMode="Single" Rows="1">
                            <asp:ListItem  Text="<%$ resources: filter_StartingWith.Text %>"
                                Value="<%$ resources: filter_StartingWith.Value %>" />
                            <asp:ListItem  Text="<%$ resources: filter_Contains.Text %>"
                                Value="<%$ resources: filter_Contains.Value %>" />
                            <asp:ListItem  Text="<%$ resources: filter_EqualTo.Text %>"
                                Value="<%$ resources: filter_EqualTo.Value %>" />
                            <asp:ListItem  Text="<%$ resources: filter_NotEqualTo.Text %>"
                                Value="<%$ resources: filter_NotEqualTo.Value %>" />
                            <asp:ListItem  Text="<%$ resources: filter_EqualLessThan.Text %>"
                                Value="<%$ resources: filter_EqualLessThan.Value %>" />
                            <asp:ListItem  Text="<%$ resources: filter_EqualGreaterThan.Text %>"
                                Value="<%$ resources: filter_EqualGreaterThan.Value %>" />
                            <asp:ListItem  Text="<%$ resources: filter_LessThan.Text %>"
                                Value="<%$ resources: filter_LessThan.Value %>" />
                            <asp:ListItem  Text="<%$ resources: filter_GreaterThan.Text %>"
                                Value="<%$ resources: filter_GreaterThan.Value %>" />                
                        </asp:ListBox>
                    </div>
                    <div class="textcontrol lookup" style="width:45%">
                        <SalesLogix:LookupControl runat="server" ID="lueLeadSource" LookupEntityName="LeadSource"
                            LookupEntityTypeName="Sage.Entity.Interfaces.ILeadSource, Sage.Entity.Interfaces, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null" >
                            <LookupProperties>
                                <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueLeadSource.LookupProperties.Type.PropertyHeader %>"
                                    PropertyName="Type" PropertyFormat="None"  UseAsResult="True" ExcludeFromFilters="False">
                                </SalesLogix:LookupProperty>
                                <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueLeadSource.LookupProperties.Description.PropertyHeader %>"
                                    PropertyName="Description" PropertyFormat="None"  UseAsResult="True" ExcludeFromFilters="False">
                                </SalesLogix:LookupProperty>
                                <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueLeadSource.LookupProperties.AbbrevDescription.PropertyHeader %>"
                                    PropertyName="AbbrevDescription" PropertyFormat="None"  UseAsResult="True" ExcludeFromFilters="False">
                                </SalesLogix:LookupProperty>
                            </LookupProperties>
                            <LookupPreFilters>
                              <SalesLogix:LookupPreFilter PropertyName="Status" PropertyType="System.String" OperatorCode="=" FilterValue="<%$ resources: LeadSource.LUPF.Status %>" ></SalesLogix:LookupPreFilter>
                            </LookupPreFilters>
                        </SalesLogix:LookupControl>
                    </div>
                </td>
                <td></td>
            </tr>
            <tr id="row7">
                <td id="row7col1">
                    <div class="slxlabel alignleft">
                        <asp:CheckBox runat="server" ID="chkProducts" CssClass="checkbox" Text="<%$ resources: chkProducts.Caption %>" />
                    </div>
                </td>
                <td id="row7col2">
                    <div runat="server" id="divProducts" >
                        <div class="textcontrol select">
                            <asp:ListBox runat="server" ID="lbxProducts" SelectionMode="Single" Rows="1">
                                <asp:ListItem  Text="<%$ resources: filter_StartingWith.Text %>"
                                    Value="<%$ resources: filter_StartingWith.Value %>" />
                                <asp:ListItem  Text="<%$ resources: filter_Contains.Text %>"
                                    Value="<%$ resources: filter_Contains.Value %>" />
                                <asp:ListItem  Text="<%$ resources: filter_EqualTo.Text %>"
                                    Value="<%$ resources: filter_EqualTo.Value %>" />
                                <asp:ListItem  Text="<%$ resources: filter_NotEqualTo.Text %>"
                                    Value="<%$ resources: filter_NotEqualTo.Value %>" />
                                <asp:ListItem  Text="<%$ resources: filter_EqualLessThan.Text %>"
                                    Value="<%$ resources: filter_EqualLessThan.Value %>" />
                                <asp:ListItem  Text="<%$ resources: filter_EqualGreaterThan.Text %>"
                                    Value="<%$ resources: filter_EqualGreaterThan.Value %>" />
                                <asp:ListItem  Text="<%$ resources: filter_LessThan.Text %>"
                                    Value="<%$ resources: filter_LessThan.Value %>" />
                                <asp:ListItem  Text="<%$ resources: filter_GreaterThan.Text %>"
                                    Value="<%$ resources: filter_GreaterThan.Value %>" />                
                            </asp:ListBox>
                        </div>
                        <div class="textcontrol lookup" style="width:45%">
                            <SalesLogix:LookupControl runat="server" ID="lueProducts" LookupEntityName="Product"
                                LookupEntityTypeName="Sage.Entity.Interfaces.IProduct, Sage.Entity.Interfaces, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null">
                                <LookupProperties>
                                    <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueProducts.LookupProperties.ActualId.PropertyHeader %>" PropertyName="ActualId"
                                        PropertyFormat="None" UseAsResult="True" ExcludeFromFilters="False">
                                    </SalesLogix:LookupProperty>
                                    <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueProducts.LookupProperties.Name.PropertyHeader %>"
                                        PropertyName="Name" PropertyFormat="None" UseAsResult="True" ExcludeFromFilters="False">
                                    </SalesLogix:LookupProperty>
                                    <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueProducts.LookupProperties.Vendor.PropertyHeader %>"
                                        PropertyName="Vendor" PropertyFormat="None" UseAsResult="True" ExcludeFromFilters="False">
                                    </SalesLogix:LookupProperty>
                                </LookupProperties>
                                <LookupPreFilters>
                                </LookupPreFilters>
                            </SalesLogix:LookupControl>
                        </div>
                    </div>
                </td>
                <td id="row7col3"></td>
                <td id="row7col4">
                    <div class="slxlabel alignleft">
                        <asp:CheckBox runat="server" ID="chkImportSource" CssClass="checkbox" Text="<%$ resources: chkImportSource.Caption %>" />
                    </div>
                </td>
                <td id="row7col5">
                    <div class="textcontrol select">
                        <asp:ListBox runat="server" ID="lbxImportSource" SelectionMode="Single" Rows="1">
                            <asp:ListItem  Text="<%$ resources: filter_StartingWith.Text %>"
                                Value="<%$ resources: filter_StartingWith.Value %>" />
                            <asp:ListItem  Text="<%$ resources: filter_Contains.Text %>"
                                Value="<%$ resources: filter_Contains.Value %>" />
                            <asp:ListItem  Text="<%$ resources: filter_EqualTo.Text %>"
                                Value="<%$ resources: filter_EqualTo.Value %>" />
                            <asp:ListItem  Text="<%$ resources: filter_NotEqualTo.Text %>"
                                Value="<%$ resources: filter_NotEqualTo.Value %>" />
                            <asp:ListItem  Text="<%$ resources: filter_EqualLessThan.Text %>"
                                Value="<%$ resources: filter_EqualLessThan.Value %>" />
                            <asp:ListItem  Text="<%$ resources: filter_EqualGreaterThan.Text %>"
                                Value="<%$ resources: filter_EqualGreaterThan.Value %>" />
                            <asp:ListItem  Text="<%$ resources: filter_LessThan.Text %>"
                                Value="<%$ resources: filter_LessThan.Value %>" />
                            <asp:ListItem  Text="<%$ resources: filter_GreaterThan.Text %>"
                                Value="<%$ resources: filter_GreaterThan.Value %>" />                
                        </asp:ListBox>
                    </div>
                    <div class="textcontrol picklist" style="width:45%">
                        <SalesLogix:PickListControl runat="server" ID="pklImportSource" PickListName="Source"
                            NoneEditable="true" AlphaSort="true" />
                    </div>
                </td>
                <td></td>
            </tr>
            <tr id="row8">
                <td id="row8col1">
                    <div class="slxlabel alignleft">
                        <asp:CheckBox runat="server" ID="chkStatus" CssClass="checkbox" Text="<%$ resources: chkStatus.Caption %>" />
                    </div>
                </td>
                <td id="row8col2">
                    <div class="textcontrol select">
                        <asp:ListBox runat="server" ID="lbxStatus" SelectionMode="Single" Rows="1">
                            <asp:ListItem  Text="<%$ resources: filter_StartingWith.Text %>"
                                Value="<%$ resources: filter_StartingWith.Value %>" />
                            <asp:ListItem  Text="<%$ resources: filter_Contains.Text %>"
                                Value="<%$ resources: filter_Contains.Value %>" />
                            <asp:ListItem  Text="<%$ resources: filter_EqualTo.Text %>"
                                Value="<%$ resources: filter_EqualTo.Value %>" />
                            <asp:ListItem  Text="<%$ resources: filter_NotEqualTo.Text %>"
                                Value="<%$ resources: filter_NotEqualTo.Value %>" />
                            <asp:ListItem  Text="<%$ resources: filter_EqualLessThan.Text %>"
                                Value="<%$ resources: filter_EqualLessThan.Value %>" />
                            <asp:ListItem  Text="<%$ resources: filter_EqualGreaterThan.Text %>"
                                Value="<%$ resources: filter_EqualGreaterThan.Value %>" />
                            <asp:ListItem  Text="<%$ resources: filter_LessThan.Text %>"
                                Value="<%$ resources: filter_LessThan.Value %>" />
                            <asp:ListItem  Text="<%$ resources: filter_GreaterThan.Text %>"
                                Value="<%$ resources: filter_GreaterThan.Value %>" />                
                        </asp:ListBox>
                    </div>
                    <div class="textcontrol picklist" style="width:45%; display:inline">
                        <SalesLogix:PickListControl runat="server" ID="pklStatus" PickListName="Lead Status" AlphaSort="true"
                            MustExistInList="false" ValueStoredAsText="true" NoneEditable="true" EnableViewState="true" />
                    </div>        
                </td>
                <td id="row8col3"></td>
                <td id="row8col4">
                    <div class="slxlabel alignleft">
                        <asp:CheckBox runat="server" ID="chkCreateDate" CssClass="checkbox" Text="<%$ resources: chkCreateDate.Caption %>" />
                    </div>
                </td>
                <td id="row8col5">
                    <div class="textcontrol datepicker" style="width:33%;padding-right:20px;">
                        <SalesLogix:DateTimePicker runat="server" ID="dtpCreateFromDate" DisplayTime="true"></SalesLogix:DateTimePicker>               
                    </div>
                    <div class="lbl aligncenter" style="width:10%">
                        <asp:Label ID="dtpCreateToDate_lz" runat="server" AssociatedControlID="dtpCreateToDate"
                            Text="<%$ resources: dtpCreateToDate.Caption %>">
                        </asp:Label>
                    </div>
                    <div class="textcontrol datepicker" style="width:33%">
                        <SalesLogix:DateTimePicker runat="server" ID="dtpCreateToDate" DisplayTime="true"></SalesLogix:DateTimePicker>
                    </div>
                </td>
                <td></td>
            </tr>
            <tr id="row9">
                <td id="row9col1">
                    <div class="lbl">
                        <asp:Label runat="server" ID="lblDoNotIncludes"  Text="<%$ resources: lblDoNotIncludes.Caption %>"></asp:Label>
                    </div>
                </td>
                <td id="row9col2" colspan="4">
                    <div class="lbl" style="width:30%">
                        <asp:CheckBox runat="server" ID="chkSolicit" CssClass="checkbox" Text="<%$ resources: chkSolicit.Caption %>" />
                    </div>
                    <div class="lbl" style="width:30%">
                        <asp:CheckBox runat="server" ID="chkEmail" CssClass="checkbox" Text="<%$ resources: chkEmail.Caption %>" />
                    </div>
                    <div class="lbl" style="width:30%">
                        <asp:CheckBox runat="server" ID="chkCall" CssClass="checkbox" Text="<%$ resources: chkCall.Caption %>" />
                    </div>
                </td>
                <td id="row9col4">
                </td>
                <td id="row9col5">
                </td>
                <td></td>
            </tr>
            <tr id="row10">
                <td id="row10col1"></td>
                <td id="row10col2" colspan="4">
                    <div class="lbl" style="width:30%">
                        <asp:CheckBox runat="server" ID="chkMail" CssClass="checkbox" Text="<%$ resources: chkMail.Caption %>" />
                    </div>
                    <div class="lbl" style="width:30%">
                        <asp:CheckBox runat="server" ID="chkFax" CssClass="checkbox" Text="<%$ resources: chkFax.Caption %>" />
                    </div>
                </td>
                <td id="row10col3"></td>
                <td id="row10col4"></td>
                <td id="row10col5"></td>
            </tr>
            <tr id="row11">
                <td id="row11col1"></td>
                <td id="row11col2"></td>
                <td id="row11col3" colspan="2">
                    <asp:Panel runat="server" ID="ctrlstHowMany" CssClass="controlslist qfActionContainer">
                        <asp:Button runat="server" ID="cmdHowMany" OnClick="HowMany_OnClick" Text="<%$ resources: cmdHowMany.Caption %>" CssClass="slxbutton" />
                        <asp:Label ID="lblHowMany" runat="server" ></asp:Label>
                    </asp:Panel>
                </td>
                <td id="row11col4">
                    <asp:Panel runat="server" ID="ctrlstSearchClear" CssClass="controlslist qfActionContainer">
                        <asp:Button runat="server" ID="cmdSearch" OnClick="Search_OnClick" Text="<%$ resources: cmdSearch.Caption %>" CssClass="slxbutton" />
                        <asp:Button runat="server" ID="cmdClearAll" OnClientClick="mt_ClearFilters();" Text="<%$ resources: cmdClearAll.Caption %>" CssClass="slxbutton" />
                    </asp:Panel>
                </td>
            </tr>
            <tr id="row12">
                <td colspan="5">
                </td>
            </tr>
        </table>
    </div>

    <div runat="server" id="divAddFromGroup" style="display:none">
        <br />
        <table border="0" cellpadding="1" cellspacing="0" style="width:60%">
            <col width="35%" />
            <col width="65%" />
            <tr>
                <td colspan="2" style="padding:5px,0px,0px,5px">
                    <span class="slxlabel">
                        <asp:Label runat="server" ID="lblAddFromGroup" Text="<%$ resources: lblAddFromGroup.Text %>" />
                    </span>
                    <br />
                    <br />
                </td>
            </tr>
            <tr>
                <td rowspan="2">
                    <fieldset class="slxlabel radio" >
                        <asp:RadioButtonList runat="server" ID="rdgAddFromGroup" RepeatDirection="vertical" >
                            <asp:ListItem Text="<%$ resources: rdgLeadGroup.Text %>"
                                Value="<%$ resources: rdgLeadGroup.Value %>" />
                            <asp:ListItem Text="<%$ resources: rdgContactGroup.Text %>" Selected="True"
                                Value="<%$ resources: rdgContactGroup.Value %>" />
                        </asp:RadioButtonList>
                    </fieldset>                
                </td>
                <td>
                    <div class="textcontrol select">
                        <asp:ListBox runat="server" ID="lbxLeadGroups" SelectionMode="Single" Rows="1"></asp:ListBox>
                    </div>
                </td>
            </tr>
            <tr>
                <td>
                    <div class="textcontrol select">
                        <asp:ListBox runat="server" ID="lbxContactGroups" SelectionMode="Single" Rows="1">
                        </asp:ListBox>
                    </div>
                </td>
            </tr>
            <tr>
                <td></td>
                <td>
                    <br />
                    <asp:Button runat="server" ID="cmdAddFromGroup" OnClick="AddFromGroup_OnClick" Text="<%$ resources: cmdSearch.Caption %>" CssClass="slxbutton" />
                    <br />
                    <br />
                </td>
            </tr>                        
        </table>
    </div>
</div>
<br />
<div style="margin:0px,10px,0px,10px; border: 1px solid #b5cbe0">
    <table border="0" cellpadding="1" cellspacing="0" class="formtable">
        <col width="100%" /> 
        <tr>
            <td>
                <radu:radprogressarea ProgressIndicators="TotalProgressBar, TotalProgress" id="radInsertProcessArea" runat="server"
                    Skin="Slx" SkinsPath="~/Libraries/RadControls/upload/skins" OnClientProgressUpdating="OnUpdateProgress">
                    <progresstemplate>
                        <table width="100%">
                            <tr>
                                <td align="center">
                                    <div class="RadUploadProgressArea">
                                        <table class="RadUploadProgressTable" style="height:100;width:100%;">
                                            <tr>
                                                <td class="RadUploadTotalProgressData"  align="center">
                                                    <asp:Label ID="Primary" runat="server" Text="<%$ resources: lblPrimary.Caption %>"></asp:Label>&nbsp;
                                                    <!-- Percent of the Targets processed -->
                                                    <asp:Label ID="PrimaryPercent" runat="server"></asp:Label>%&nbsp;
                                                    <!-- Current record count of the Targets being processed -->
                                                    <asp:Label ID="PrimaryValue" runat="server"></asp:Label>&nbsp;
                                                    <!-- Total number of records to insert -->
                                                    <asp:Label ID="PrimaryTotal" runat="server"></asp:Label>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="RadUploadProgressBarHolder">
                                                    <!-- Insert Targets primary progress bar -->
                                                    <asp:Image ID="PrimaryProgressBar" runat="server" ImageUrl="~/images/icons/progress.gif" />
                                                </td>
                                            </tr>
                                            <tr>
                                                <!-- Total number of records successfully inserted -->
                                                <td class="RadUploadFileCountProgressData">
                                                    <asp:Label ID="lblInserted" runat="server" Text="<%$ resources: lblInserted.Caption %>"></asp:Label>&nbsp;
                                                    <asp:Label ID="SecondaryValue" runat="server"></asp:Label>
                                                </td>
                                            </tr>
                                            <tr>
                                                <!-- Total number of records which failed to insert -->
                                                <td class="RadUploadFileCountProgressData">
                                                    <asp:Label ID="lblFailed" runat="server" Text="<%$ resources: lblFailed.Caption %>"></asp:Label>&nbsp;
                                                    <asp:Label ID="SecondaryTotal" runat="server"></asp:Label>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </progresstemplate>
                </radu:radprogressarea>
                <SalesLogix:SlxGridView runat="server" ID="grdTargets" GridLines="None" AutoGenerateColumns="false" CellPadding="4"
                    CssClass="datagrid" PagerStyle-CssClass="gridPager" AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt"
                    SelectedRowStyle-CssClass="rowSelected" EnableViewState="false" AllowPaging="true" ResizableColumns="True"
                    PageSize="20" OnPageIndexChanging="grdTargetspage_changing" ExpandableRows="True" AllowSorting="true"
                    OnSorting="grdTargets_Sorting" ShowEmptyTable="true" EmptyTableRowText="<%$ resources: grdTargets.EmptyTableRowText %>" >
                    <Columns>
                        <asp:BoundField DataField="FirstName" HeaderText="<%$ resources: grdTargets.FirstName.ColumnHeading %>"
                            SortExpression="FirstName" />
                        <asp:BoundField DataField="LastName" HeaderText="<%$ resources: grdTargets.LastName.ColumnHeading %>"
                            SortExpression="LastName" />
                        <asp:BoundField DataField="Company" HeaderText="<%$ resources: grdTargets.Company.ColumnHeading %>"
                            SortExpression="Company" />
                        <asp:TemplateField HeaderText="<%$ resources: grdTargets.Email.ColumnHeading %>" SortExpression="Email">
                            <itemtemplate>
                                <SalesLogix:Email runat="server" DisplayMode="AsHyperlink" Text='<%# Eval("Email") %>'></SalesLogix:Email>
                            </itemtemplate>
                        </asp:TemplateField>
                        <asp:BoundField DataField="City" HeaderText="<%$ resources: grdTargets.City.ColumnHeading %>"
                            SortExpression="City" />
                        <asp:BoundField DataField="State" HeaderText="<%$ resources: grdTargets.State.ColumnHeading %>"
                            SortExpression="State" />
                        <asp:BoundField DataField="Zip" HeaderText="<%$ resources: grdTargets.Zip.ColumnHeading %>"
                            SortExpression="Zip" />
                        <asp:TemplateField HeaderText="<%$ resources: grdTargets.WorkPhone.ColumnHeading %>" SortExpression="WorkPhone" >
                            <itemtemplate>
                                <SalesLogix:Phone runat="server" DisplayAsLabel="True" Text='<%# Eval("WorkPhone") %>' />
                            </itemtemplate>
                        </asp:TemplateField>
                        <asp:BoundField DataField="EntityId", Visible="False" />
                    </Columns>
                    <PagerSettings Mode="NumericFirstLast" FirstPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Start_16x16.gif"
                        LastPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=End_16x16" />
                </SalesLogix:SlxGridView>
            </td>
        </tr>
        <tr id="row"14">
            <td id="row14col5">
                <asp:Panel runat="server" ID="ctrlstAddCancel" CssClass="controlslist qfActionContainer">
                    <asp:Button runat="server" ID="cmdAddTargets" OnClick="AddTargets_OnClick" Text="<%$ resources: cmdAdd.Caption %>" CssClass="slxbutton"/>
                    <asp:Button runat="server" ID="cmdCancel" Text="<%$ resources: cmdCancel.Caption %>" CssClass="slxbutton" />
                </asp:Panel>
            </td>
        </tr>
    </table>
</div>