<%@ Control Language="C#" AutoEventWireup="true" CodeFile="AddEditTargetResponse.ascx.cs" Inherits="AddEditTargetResponse" %>
<%@ Register Assembly="Sage.SalesLogix.Client.GroupBuilder" Namespace="Sage.SalesLogix.Client.GroupBuilder" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.PickList" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.DependencyLookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Lookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.Platform.WebPortal" Namespace="Sage.Platform.WebPortal.SmartParts" TagPrefix="SalesLogix" %>

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

<SalesLogix:SmartPartToolsContainer runat="server" ID="AddEditTargetResponse_RTools" ToolbarLocation="right">
    <SalesLogix:PageLink ID="lnkAddEditTargetResponseHelp" runat="server" LinkType="HelpFileName"
        ToolTip="<%$ resources: Portal, Help_ToolTip %>" Target="Help" NavigateUrl="campaignresponseedit.aspx"
        ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16">
    &nbsp;
    </SalesLogix:PageLink>
</SalesLogix:SmartPartToolsContainer>

<div id="hiddenProps" style="display:none" runat="server">
    <input id="txtSelectedTab" runat="server" type="hidden" />
</div>

<table border="0" cellpadding="1" cellspacing="0" class="formtable">
    <col width="50%" />
    <col width="50%" />
    <tr>
        <td>
            <div class="lbl alignleft">
                <asp:Label runat="server" ID="lblTargetType" AssociatedControlID="rdgTargetType"
                    Text="<%$ resources: lblTargetType.Caption %>">
                </asp:Label>
            </div>
            <asp:RadioButtonList runat="server" ID="rdgTargetType" RepeatDirection="Horizontal" CssClass="slxlabel alignright" 
                AutoPostBack="true" >
                <asp:ListItem Text="<%$ resources: rdgTargetType_item0.Text %>" Value="<%$ resources: rdgTargetType_item0.Value %>" />
                <asp:ListItem Text="<%$ resources: rdgTargetType_item1.Text %>" Value="<%$ resources: rdgTargetType_item1.Value %>" />
            </asp:RadioButtonList>
        </td>
        <td>
            <div class=" lbl alignleft">
                <asp:Label ID="lblStatus" AssociatedControlID="pklResponseStatus" runat="server" 
                    Text="<%$ resources: pklResponseStatus.Caption %>" >
                </asp:Label>
            </div>        
            <div class="textcontrol picklist">
                <SalesLogix:PickListControl runat="server" ID="pklResponseStatus" PickListName="Response Status" MustExistInList="false" StorageMode="Text"
                    NoneEditable="true" AlphaSort="true" />
            </div>
        </td>
    </tr>
    <tr>
        <td>
            <div runat="server" id="divContact" visible="true">
                <div class="lbl alignleft">
                    <asp:Label ID="lueContact_lbl" AssociatedControlID="lueContact" runat="server" 
                        Text="<%$ resources: lueContact.Caption %>" >
                     </asp:Label>
                </div>
                <div class="textcontrol lookup">
                    <SalesLogix:LookupControl runat="server" ID="lueContact" ToolTip="<%$ resources: lueContact.ToolTip %>" LookupEntityName="Contact"
                        LookupEntityTypeName="Sage.Entity.Interfaces.IContact, Sage.Entity.Interfaces, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null"
                        LookupBindingMode="Object" SeedProperty="Account.Id" AutoPostBack="true" DialogWidth="800" >
                        <LookupProperties>
                            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueContact.LookupProperties.Name.PropertyHeader %>"
                                PropertyName="NameLF" PropertyFormat="None" UseAsResult="True" ExcludeFromFilters="False">
                            </SalesLogix:LookupProperty>
                            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueContact.LookupProperties.AccountName.PropertyHeader %>"
                                PropertyName="AccountName" PropertyFormat="None" UseAsResult="True" ExcludeFromFilters="False">
                            </SalesLogix:LookupProperty>
                            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueContact.LookupProperties.City.PropertyHeader %>"
                                PropertyName="Address.City" PropertyFormat="None" UseAsResult="True" ExcludeFromFilters="False">
                            </SalesLogix:LookupProperty>                            
                            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueContact.LookupProperties.State.PropertyHeader %>"
                                PropertyName="Address.State" PropertyFormat="None" UseAsResult="True" ExcludeFromFilters="False">
                            </SalesLogix:LookupProperty>                            
                            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueContact.LookupProperties.WorkPhone.PropertyHeader %>"
                                PropertyName="WorkPhone" PropertyFormat="Phone" UseAsResult="True" ExcludeFromFilters="False">
                            </SalesLogix:LookupProperty>
                            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueContact.LookupProperties.Email.PropertyHeader %>"
                                PropertyName="Email" PropertyFormat="None" UseAsResult="True" ExcludeFromFilters="False">
                            </SalesLogix:LookupProperty>
                        </LookupProperties>
                        <LookupPreFilters>
                        </LookupPreFilters>
                    </SalesLogix:LookupControl>
                </div>
            </div>
            <div runat="server" id="divLead" visible="false">
                <div class="lbl alignleft">
                    <asp:Label ID="lueLead_lbl" AssociatedControlID="lueLead" runat="server" 
                        Text="<%$ resources: lueLead.Caption %>" >
                     </asp:Label>
                </div>
                <div class="textcontrol lookup">
                    <SalesLogix:LookupControl runat="server" ID="lueLead" LookupEntityName="Lead" ToolTip="<%$ resources: lueLead.ToolTip %>" 
                        LookupEntityTypeName="Sage.Entity.Interfaces.ILead, Sage.Entity.Interfaces, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null"
                        LookupBindingMode="Object" AutoPostBack="true" >
                        <LookupProperties>
                            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueLead.LookupProperties.Name.PropertyHeader %>"
                                PropertyName="LeadNamePrefixFirstLast" PropertyFormat="None" UseAsResult="True" ExcludeFromFilters="False">
                            </SalesLogix:LookupProperty>
                            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueLead.LookupProperties.Company.PropertyHeader %>"
                                PropertyName="Company" PropertyFormat="None" UseAsResult="True" ExcludeFromFilters="False">
                            </SalesLogix:LookupProperty>
                            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueLead.LookupProperties.WorkPhone.PropertyHeader %>"
                                PropertyName="WorkPhone" PropertyFormat="Phone" UseAsResult="True" ExcludeFromFilters="False">
                            </SalesLogix:LookupProperty>
                            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueLead.LookupProperties.Mobile.PropertyHeader %>"
                                PropertyName="Mobile" PropertyFormat="Phone" UseAsResult="True" ExcludeFromFilters="False">
                            </SalesLogix:LookupProperty>
                            <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueLead.LookupProperties.Email.PropertyHeader %>"
                                PropertyName="Email" PropertyFormat="None" UseAsResult="True" ExcludeFromFilters="False">
                            </SalesLogix:LookupProperty>
                        </LookupProperties>
                        <LookupPreFilters>
                        </LookupPreFilters>
                    </SalesLogix:LookupControl>
                </div>
            </div>
        </td>
        <td>
            <div class="lbl alignleft">
                <asp:Label ID="dtpResponseDate_lbl" AssociatedControlID="dtpResponseDate" runat="server" 
                    Text="<%$ resources: dtpResponseDate.Caption %>" >
                </asp:Label>
            </div>
            <div class="textcontrol datepicker">
                <SalesLogix:DateTimePicker runat="server" ID="dtpResponseDate" ToolTip="<%$ resources: dtpResponseDate.ToolTip %>" />
            </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="lbl alignleft">
                <asp:Label ID="lueCampaign_lbl" AssociatedControlID="lueCampaign" runat="server"
                    Text="<%$ resources: lueCampaign.Caption %>" >
                </asp:Label>
            </div>
            <div class="textcontrol lookup">
                <SalesLogix:LookupControl runat="server" ID="lueCampaign" ToolTip="<%$ resources: lueCampaign.ToolTip %>" LookupEntityName="Campaign"
                    LookupEntityTypeName="Sage.Entity.Interfaces.ICampaign, Sage.Entity.Interfaces, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null"
                    AutoPostBack="true" DialogWidth="800" >
                    <LookupProperties>
                       <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueCampaign.LookupProperties.CampaignName.PropertyHeader %>"
                            PropertyName="CampaignName" PropertyFormat="None" UseAsResult="True" ExcludeFromFilters="False">
                        </SalesLogix:LookupProperty>
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueCampaign.LookupProperties.CampaignCode.PropertyHeader %>"
                            PropertyName="CampaignCode" PropertyFormat="None" UseAsResult="True" ExcludeFromFilters="False">
                        </SalesLogix:LookupProperty>                                            
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueCampaign.LookupProperties.Manager.PropertyHeader %>"
                            PropertyName="AccountManager.UserInfo.UserName" PropertyFormat="None" UseAsResult="True" ExcludeFromFilters="False">
                        </SalesLogix:LookupProperty>
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueCampaign.LookupProperties.StartDate.PropertyHeader %>"
                            PropertyName="StartDate" PropertyFormat="None" UseAsResult="True" ExcludeFromFilters="False">
                        </SalesLogix:LookupProperty>
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueCampaign.LookupProperties.EndDate.PropertyHeader %>"
                            PropertyName="EndDate" PropertyFormat="None" UseAsResult="True" ExcludeFromFilters="False">
                        </SalesLogix:LookupProperty>
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueCampaign.LookupProperties.Status.PropertyHeader %>"
                            PropertyName="Status" PropertyFormat="None" UseAsResult="True" ExcludeFromFilters="False">
                        </SalesLogix:LookupProperty>
                    </LookupProperties>
                    <LookupPreFilters>
                    </LookupPreFilters>
                </SalesLogix:LookupControl>
            </div>
        </td>
        <td>
            <div class=" lbl alignleft">
                <asp:Label ID="pklResponseMethod_lbl" AssociatedControlID="pklResponseMethod" runat="server" 
                    Text="<%$ resources: pklResponseMethod.Caption %>" >
                </asp:Label>
            </div>
            <div class="textcontrol picklist">
                <SalesLogix:PickListControl runat="server" ID="pklResponseMethod" PickListName="Response Method" MustExistInList="false" />
            </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class=" lbl alignleft">
                <asp:Label ID="lbxStages_lbl" AssociatedControlID="lbxStages" runat="server" Text="<%$ resources: lbxStages.Caption %>" ></asp:Label>
            </div>
            <div class="textcontrol select">
                <asp:ListBox runat="server" ID="lbxStages" SelectionMode="Single" Rows="1" >
                </asp:ListBox>
            </div>
        </td>
        <td>
            <div class=" lbl alignleft">
                <asp:Label ID="lblInterest" AssociatedControlID="pklInterest" runat="server" Text="<%$ resources: lblInterest.Caption %>" ></asp:Label>
            </div>
            <div class="textcontrol picklist">
                <SalesLogix:PickListControl runat="server" ID="pklInterest" PickListName="Response Interest" MustExistInList="false" StorageMode="Text" />
            </div>
        </td>
    </tr>
    <tr>
        <td>
            <div class="lbl alignleft">
                <asp:Label ID="lueLeadSource_lbl" AssociatedControlID="lueTargetLeadSource" runat="server" 
                    Text="<%$ resources: lueLeadSource.Caption %>" >
                </asp:Label>
            </div>
            <div class="textcontrol lookup">
                <SalesLogix:LookupControl runat="server" ID="lueTargetLeadSource" LookupEntityName="LeadSource" 
                    LookupEntityTypeName="Sage.Entity.Interfaces.ILeadSource, Sage.Entity.Interfaces, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null">
                    <LookupProperties>
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueLeadSource.LookupProperties.Type.PropertyHeader %>"
                            PropertyName="Type" PropertyFormat="None" UseAsResult="False" ExcludeFromFilters="False">
                        </SalesLogix:LookupProperty>
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueLeadSource.LookupProperties.Description.PropertyHeader %>"
                            PropertyName="Description" PropertyFormat="None" UseAsResult="True" ExcludeFromFilters="False">
                        </SalesLogix:LookupProperty>
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueLeadSource.LookupProperties.AbbrevDescription.PropertyHeader %>"
                            PropertyName="AbbrevDescription" PropertyFormat="None" UseAsResult="False" ExcludeFromFilters="False">
                        </SalesLogix:LookupProperty>
                    </LookupProperties>
                    <LookupPreFilters>
                        <SalesLogix:LookupPreFilter PropertyName="Status" PropertyType="System.String" OperatorCode="="
 FilterValue="<%$ resources: LeadSource.LUPF.Status %>"
 ></SalesLogix:LookupPreFilter>
                    </LookupPreFilters>
                </SalesLogix:LookupControl>
            </div>
        </td>
        <td>
           <div class=" lbl alignleft">
                <asp:Label ID="lblInterestLevel" AssociatedControlID="pklInterestLevel" runat="server" Text="<%$ resources: lblInterestLevel.Caption %>" ></asp:Label>
            </div>
            <div class="textcontrol picklist">
                <SalesLogix:PickListControl runat="server" ID="pklInterestLevel" PickListName="Response Interest Level" MustExistInList="false" StorageMode="Text" />
            </div>
            <br />
            <br />
        </td>
    </tr>
    <tr class="mainContentHeader">
        <td colspan="2">
            <div>
                <span id="hzsComments">
                    <asp:Localize ID="lclComments" runat="server" Text="<%$ resources: hzsComments.Caption %>">Comments</asp:Localize>
                </span>
            </div>
        </td>
    </tr>
    <tr>
        <td colspan="2">
            <div class="twocoltextcontrol">
                <asp:TextBox runat="server" ID="txtComments" TextMode="MultiLine" Columns="40" Rows="4" MultiLineMaxLength="255"
                    onkeyup="doTextBoxKeyUp(this);" onpaste="doTextBoxPaste(this);">
                </asp:TextBox>
            </div>
        </td>
    </tr>
    <tr>
        <td>
            <br />
            <br />
        </td>
    </tr>
    <tr>
        <td>
            <asp:Panel id="tabProducts" runat="server" CssClass="activeTab tab">
                <div class="tableft">&nbsp;</div>
                <div class="tabcenter">
                    <asp:Localize ID="lclTabProducts" runat="server" Text="<%$ resources: lblProducts.Caption %>"></asp:Localize>
                </div>
                <div class="tabright">&nbsp;</div>
            </asp:Panel>
            <asp:Panel id="tabClicks" runat="server" CssClass="inactiveTab tab">
                <div class="tableft">&nbsp;</div>
                <div class="tabcenter">
                    <asp:Localize ID="lclTabClicks" runat="server" Text="<%$ resources: grdClicks.Caption %>"></asp:Localize>
                </div>
                <div class="tabright">&nbsp;</div>
            </asp:Panel>
            <asp:Panel id="tabOpens" runat="server" CssClass="inactiveTab tab">
                <div class="tableft">&nbsp;</div>
                <div class="tabcenter">
                    <asp:Localize ID="lclOpens" runat="server" Text="<%$ resources: grdOpens.Caption %>"></asp:Localize>
                </div>
                <div class="tabright">&nbsp;</div>
            </asp:Panel>
            <asp:Panel id="tabUndeliverables" runat="server" CssClass="inactiveTab tab">
                <div class="tableft">&nbsp;</div>
                <div class="tabcenter">
                    <asp:Localize ID="lclUndeliverables" runat="server" Text="<%$ resources: grdUndeliverables.Caption %>"></asp:Localize>
                </div>
                <div class="tabright">&nbsp;</div>
            </asp:Panel>
        </td>
        <td align="right" style="padding-right:20px">
            <div runat="server" id="divAddProduct">
                <SalesLogix:LookupControl runat="server" ID="lueAddProduct" ToolTip="<%$ resources: lueAddProduct.ToolTip %>" LookupEntityName="Product"
                    LookupEntityTypeName="Sage.Entity.Interfaces.IProduct, Sage.Entity.Interfaces, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null"
                    LookupDisplayMode="ButtonOnly" AutoPostBack="true" LookupImageURL="~/ImageResource.axd?scope=global&type=Global_Images&key=plus_16x16" >
                    <LookupProperties>
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueAddProduct.LookupProperties.ActualId.PropertyHeader %>"
                            PropertyName="ActualId" PropertyFormat="None" UseAsResult="True" ExcludeFromFilters="False">
                        </SalesLogix:LookupProperty>
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueAddProduct.LookupProperties.Name.PropertyHeader %>"
                            PropertyName="Name" PropertyFormat="None" UseAsResult="True" ExcludeFromFilters="False">
                        </SalesLogix:LookupProperty>
                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: lueAddProduct.LookupProperties.Status.PropertyHeader %>"
                            PropertyName="Status" PropertyFormat="None" UseAsResult="True" ExcludeFromFilters="False">
                        </SalesLogix:LookupProperty>
                    </LookupProperties>
                    <LookupPreFilters>
                    </LookupPreFilters>
                </SalesLogix:LookupControl>
            </div>
        </td>
    </tr>
    <tr>
        <td colspan="2">
            <div runat="server" id="divProducts" style="display:inline">
                <SalesLogix:SlxGridView runat="server" ID="grdProducts" GridLines="None" AutoGenerateColumns="false" CellPadding="4"
                    CssClass="datagrid" PagerStyle-CssClass="gridPager" AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt"
                    SelectedRowStyle-CssClass="rowSelected" ShowEmptyTable="true" EnableViewState="false" ExpandableRows="True"
                    EmptyTableRowText="<%$ resources: grdProducts.EmptyTableRowText %>" ResizableColumns="True" >
                    <Columns>
                        <asp:BoundField DataField="Product.Name" HeaderText="<%$ resources: grdProducts.ProductName.ColumnHeading %>" />
                        <asp:BoundField DataField="Product.Description" HeaderText="<%$ resources: grdProducts.Description.ColumnHeading %>" />
                        <asp:BoundField DataField="Product.ActualId" HeaderText="<%$ resources: grdProducts.SKU.ColumnHeading %>" />
                        <asp:BoundField DataField="Product.Status" HeaderText="<%$ resources: grdProducts.Status.ColumnHeading %>" />
                    </Columns>
                </SalesLogix:SlxGridView>
            </div>
        </td>
    </tr>
    <tr>
        <td colspan="2">
            <div runat="server" id="divClicks" style="display:none">
                <SalesLogix:SlxGridView runat="server" ID="grdClicks" GridLines="None" AutoGenerateColumns="false" CellPadding="4"
                    CssClass="datagrid" PagerStyle-CssClass="gridPager" AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt"
                    SelectedRowStyle-CssClass="rowSelected" ShowEmptyTable="true" EnableViewState="false" ExpandableRows="True"
                    EmptyTableRowText="<%$ resources: grdClicks.EmptyTableRowText %>" ResizableColumns="True" >
                    <Columns>
                        <asp:BoundField DataField="LinkName" HeaderText="<%$ resources: grdClicks.LinkName.ColumnHeading %>" />
                        <asp:BoundField DataField="LinkURL" HeaderText="<%$ resources: grdClicks.LinkURL.ColumnHeading %>" />
                        <asp:TemplateField HeaderText="<%$ resources: grdClicks.ClickDate.ColumnHeading %>">
                            <itemtemplate>
                                <SalesLogix:DateTimePicker runat="server" ID="grdClickscol3" DisplayTime="false" DisplayMode="AsText" DateTimeValue='<%#  dtsClicks.getPropertyValue(Container.DataItem, "ClickDate")  %>'  CssClass=""  />
                            </itemtemplate>
                        </asp:TemplateField>
                    </Columns>
                </SalesLogix:SlxGridView>
            </div>
        </td>
    </tr>
    <tr>
        <td colspan="2">
            <div runat="server" id="divOpens" style="display:none">
                <SalesLogix:SlxGridView runat="server" ID="grdOpens" GridLines="None" AutoGenerateColumns="false" CellPadding="4"
                    CssClass="datagrid" PagerStyle-CssClass="gridPager" AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt"
                    SelectedRowStyle-CssClass="rowSelected" ShowEmptyTable="true" EnableViewState="false" ExpandableRows="True"
                    EmptyTableRowText="<%$ resources: grdOpens.EmptyTableRowText %>" ResizableColumns="True" >
                    <Columns>
                        <asp:TemplateField HeaderText="<%$ resources: grdOpens.OpenDate.ColumnHeading %>">
                            <itemtemplate>
                                <SalesLogix:DateTimePicker runat="server" ID="grdOpenscol1" DisplayTime="false" DisplayMode="AsText"
                                    DateTimeValue='<%# dtsOpens.getPropertyValue(Container.DataItem, "OpenDate") %>' CssClass="" />
                            </itemtemplate>
                        </asp:TemplateField>
                        <asp:TemplateField HeaderText="<%$ resources: grdOpens.UnsubscribeDate.ColumnHeading %>">
                            <itemtemplate>
                                <SalesLogix:DateTimePicker runat="server" ID="grdOpenscol2" DisplayTime="false" DisplayMode="AsText"
                                    DateTimeValue='<%# dtsOpens.getPropertyValue(Container.DataItem, "UnsubscribeDate") %>' CssClass="" />
                            </itemtemplate>
                        </asp:TemplateField>
                        <asp:BoundField DataField="UnsubscribeCampaignName" HeaderText="<%$ resources: grdOpens.UnsubscribeCampaign.ColumnHeading %>" />
                    </Columns>
                </SalesLogix:SlxGridView>
            </div>
        </td>
    </tr>
    <tr>
        <td colspan="2">
            <div runat="server" id="divUndeliverables" style="display:none">
                <SalesLogix:SlxGridView runat="server" ID="grdUndeliverables" GridLines="None" AutoGenerateColumns="false" CellPadding="4"
                    CssClass="datagrid" PagerStyle-CssClass="gridPager" AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt"
                    SelectedRowStyle-CssClass="rowSelected" ShowEmptyTable="true" EnableViewState="false" ExpandableRows="True"
                    EmptyTableRowText="<%$ resources: grdUndeliverables.EmptyTableRowText %>" ResizableColumns="True">
                    <Columns>
                        <asp:TemplateField HeaderText="<%$ resources: grdUndeliverables.BounceDate.ColumnHeading %>">
                            <itemtemplate>
                                <SalesLogix:DateTimePicker runat="server" ID="grdUndeliverablescol1" DisplayTime="false" DisplayMode="AsText"
                                    DateTimeValue='<%# dtsUndeliverables.getPropertyValue(Container.DataItem, "BounceDate") %>' CssClass="" />
                            </itemtemplate>
                        </asp:TemplateField>
                        <asp:BoundField DataField="BounceCampaignName" HeaderText="<%$ resources: grdUndeliverables.BounceCampaign.ColumnHeading %>" />
                        <asp:BoundField DataField="BounceCount" HeaderText="<%$ resources: grdUndeliverables.BounceCount.ColumnHeading %>" />
                        <asp:BoundField DataField="BounceReason" HeaderText="<%$ resources: grdUndeliverables.BounceReason.ColumnHeading %>" />
                    </Columns>
                </SalesLogix:SlxGridView>
            </div>
        </td>
    </tr>
    <tr>
        <td></td>
        <td>
            <br />
            <asp:Panel runat="server" ID="ctrlstButtons" CssClass="controlslist qfActionContainer">
                <asp:Button runat="server" ID="cmdOK" Text="<%$ resources: cmdOK.Caption %>" CssClass="slxbutton" />
                <asp:Button runat="server" ID="cmdCancel" Text="<%$ resources: cmdCancel.Caption %>" CssClass="slxbutton" CausesValidation="false" />
            </asp:Panel>
        </td>
    </tr>
</table>
<asp:HiddenField ID="hidAccountId" runat="server" />