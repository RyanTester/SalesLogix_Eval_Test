<%@ Control Language="C#" AutoEventWireup="true" CodeFile="LeadSearchAndConvert.ascx.cs" Inherits="LeadSearchAndConvert" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>
<%@ Register Src="~/SmartParts/Lead/MatchOptions.ascx" TagName="MatchOptions" TagPrefix="SalesLogix" %>

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

.filterArea
{
   border-style:solid; 
   border-width:1px; 
   border-color:#99BBE8;

   /*
   width:95%;
   margin-left:20px; 
   margin-right:20px;
   */       
}
.infoArea
{
   border-style:solid; 
   border-width:1px; 
   border-color:#99BBE8;
   background-color: White;
   padding: 4px;
   /*
   margin-left:20px; 
   margin-right:20px;
   width:95%;  
   */      
}

.infoArea td
{
	vertical-align: top;
}

.leadConvertSection
{
	padding: 10px 10px 10px 10px;
}

.leadConvertSection .formtable 
{
	margin: 0;
}

.resultTableContainer
{
	padding: 0 10px 0 10px;
}

.resultArea
{
   border-style:solid; 
   border-width:1px; 
   border-color:#99BBE8;
   /*
   margin-left:20px; 
   margin-right:20px;
   padding-bottom:10px;
   padding-left:10px; 
   padding-right:10px; 
   */
   overflow:auto; 
   height:300px; 
   /* width:95%; */
}

.resultAreaWrapper
{
	min-height: 0;
	_height: 1%;
}

.mergeArea
{
   border-style:solid; 
   border-width:1px; 
   border-color:#99BBE8;
   /*
   margin-left:20px; 
   margin-right:20px;
   */
   overflow:auto;  
   height:625px; 
         
}

#MergeRecords .qfActionContainer
{
	padding: 10px 0 0 0;
}

.mergeAreaWrapper
{
	min-height: 0;
	_height: 1%;
	padding: 2px;
}

</style>
<asp:HiddenField ID="Mode" runat="server" Value="View" />
<asp:HiddenField ID="UpdateIndex" runat="server" Value="True" />
<div style="display:none">
    <asp:Panel ID="LeadMatching_RTools" runat="server">
        <SalesLogix:PageLink ID="lnkMatchOptionsHelp" runat="server" LinkType="HelpFileName"
            ToolTip="<%$ resources: Portal, Help_ToolTip %>" Target="Help" NavigateUrl="leadmergerecords.aspx"
            ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16">
        &nbsp;&nbsp;&nbsp;&nbsp;
        </SalesLogix:PageLink>
    </asp:Panel>
    <input id="txtSelectedTab" runat="server" type="hidden" />
</div>

<asp:Panel runat="server" ID="pnlSearchForDuplicates" Visible="true">
    <div class="leadConvertSection">
    <div class="infoArea">
    <table id="SourceSnapShot" style="background-color:White; width:100%" border="0" cellpadding="0" cellspacing="0">
        <col /><col width="33%" /><col width="33%" />
        <tr>            
            <td colspan="3">
                <span class="lbl">
                    <asp:Label ID="lblLead" runat="server" Text=""></asp:Label>
                </span>
            </td>
            <td></td>
        </tr>
       <tr>
            <td>
                <div class="textcontrol phone">
                    <SalesLogix:Phone runat="server" ID="phnWorkPhone" ReadOnly="true" MaxLength="32" DisplayAsLabel="true"></SalesLogix:Phone>
                </div>
            </td>
            <td>
                <span class="lbl">
                    <asp:Label ID="lblCompany" runat="server" Text="<%$ resources: lblCompany.Caption %>" AssociatedControlID="lblValueCompany"></asp:Label>
                </span>
                <span>
                    <asp:Label ID="lblValueCompany" runat="server" Text=""></asp:Label>
                </span>
            </td>
            <td>
                <span class="lbl">
                    <asp:Label ID="lblEmail" runat="server" Text="<%$ resources: lblEmail.Caption %>" AssociatedControlID="lblValueEmail"></asp:Label>
                </span>
                <span>
                    <asp:Label ID="lblValueEmail" runat="server" Text=""></asp:Label>
                </span>
            </td>
        </tr>
        <tr>
            <td>
                <span>
                    <asp:Label ID="lblAddress" runat="server" Text=""></asp:Label>
                </span>
            </td>
            <td>
                <span class="lbl">
                    <asp:Label ID="lblTitle" runat="server" Text="<%$ resources: lblTitle.Caption %>" AssociatedControlID="lblValueTitle"></asp:Label>
                </span>
                <span>
                    <asp:Label ID="lblValueTitle" runat="server" Text=""></asp:Label>
                </span>
            </td>
            <td>
                <span class="lbl">
                    <asp:Label ID="lblWeb" runat="server" Text="<%$ resources: lblWeb.Caption %>" AssociatedControlID="lblValueWeb"></asp:Label>
                </span>
                <span>
                    <asp:Label ID="lblValueWeb" runat="server" Text=""></asp:Label>
                </span>
            </td>
        </tr>
    </table>
    </div>
    </div>
    
    <div class="leadConvertSection">
    <div id="tabStripArea">
        <asp:Panel id="tabFilters" runat="server" CssClass="activeTab">
            <div class="tableft">&nbsp;</div>
                <div class="tabcenter">
                    <asp:Localize ID="lclTabFilters" runat="server" Text="<%$ resources:lblMatchFilters.Caption %>"></asp:Localize>
                </div>
            <div class="tabright">&nbsp;</div>
        </asp:Panel>
        <asp:Panel id="tabOptions" runat="server" CssClass="inactiveTab">
            <div class="tableft">&nbsp;</div>
            <div class="tabcenter">
                <asp:Localize ID="lclTabOptions" runat="server" Text="<%$ resources:cmdSearchOptions.Caption %>"></asp:Localize>
            </div>
            <div class="tabright">&nbsp;</div>
        </asp:Panel>
    </div>
    <div style="clear: both;"></div>
    <div runat="server" id="divFilters" class="filterArea">
        <table id="tblFilters" style="width: 100%;" border="0" cellpadding="0" cellspacing="0">
            <colgroup>
                <col width="1%" />
                <col width="4%" />
                <col width="20%" />
                <col width="75%" />
            </colgroup>
            <tr>
                <td></td>
                <td colspan="2">
                    <span runat="server" id="divTypes" class="lbl" style="padding-right:30px; display:none">
                        <asp:Label ID="lblMatchTypes" runat="server" Text="<%$ resources: lblMatchTypes.Caption %>"></asp:Label>
                        <br />
                    </span>
                </td>
                <td>
                    <div runat="server" id="divSearchTypes" style="display:none">
                        <span>
                            <asp:CheckBox ID="chkContacts" runat="server" Checked="true" />
                        </span>
                        <span class="lblright" style="padding-right:40px">
                            <asp:Label ID="lblContacts" runat="server" AssociatedControlID="chkContacts" 
                                Text="<%$ resources: lblContacts.Caption %>"> </asp:Label>
                        </span>
                        <span>
                            <asp:CheckBox ID="chkLeads" runat="server" Checked="true" />
                        </span>
                        <span class="lblright">
                            <asp:Label ID="lblleads" runat="server" AssociatedControlID="chkLeads" 
                                Text="<%$ resources: lblLeads.Caption %>"></asp:Label>
                        </span>
                    </div>
                </td>
                <td></td>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td colspan="2">
                    <br />
                    <span class="slxlabel">
                        <asp:Label ID="lblMatchFilters" runat="server" Text="<%$ resources: lblMatchFilters.Caption %>"></asp:Label>
                    </span>
                </td>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td colspan="2">
                    <span class="slxlabel">
                        <asp:Label ID="lblFilterDesc" runat="server" Text="<%$ resources: lblFilterDesc.Caption %>"></asp:Label>
                    </span>
                </td>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td colspan="2">
                    <asp:CheckBoxList ID="chklstFilters" runat="server" RepeatColumns="3" RepeatDirection="Horizontal" Width="100%">
                    </asp:CheckBoxList>
                    <br />
                </td>
            </tr>
            <tr>
                <td></td>
                <td colspan="2">
                    <span class="lbl">
                        <asp:Label runat="server" ID="lblOptions" Text="<%$ resources: lblOptions.Caption %>"></asp:Label>
                    </span>
                </td>
                <td>
                    <fieldset class="slxlabel radio">
                        <asp:RadioButtonList ID="rdgOptions" runat="server" RepeatDirection="Horizontal" Width="75%">
                            <asp:ListItem Selected="True" Text="<%$ resources: rdgMatchAll_Item.Text %>" Value="MatchAll" />
                            <asp:ListItem Text="<%$ resources: rdgMatchAny_Item.Text %>" Value="MatchAny" />
                        </asp:RadioButtonList>
                    </fieldset>
                </td>
            </tr>
        </table>
    </div>
    
    <div runat="server" id="divOptions" style="display:none;">
        <div class="filterArea">
            <SalesLogix:MatchOptions id="MatchOptions" runat="server" OnLoad="SetOptions" ></SalesLogix:MatchOptions>
        </div>
    </div>    
   
    </div>
    
    <div class="leadConvertSection">
     <div id="divUpdateMatches" style="">
        <asp:Button runat="server" ID="cmdUpdateMatches" CssClass="slxbutton" Text="<%$ resources: cmdUpdateMatches.Caption %>" onclick="cmdUpdateMatches_Click" />
    </div>
    </div>
    
    <div class="leadConvertSection">
    <div class="resultArea">
    <div class="resultAreaWrapper">
    <table id="tblResults" width="100%" border="0" cellpadding="0" cellspacing="0">        
        <tr>
            
            <td>
                <br />
                <div class="resultTableContainer">
                <span class="slxlabel">
                    <asp:Label ID="lblMatchesFound" runat="server" Text="<%$ resources: lblMatchesFound.Caption %>"></asp:Label>
                </span>
                </div>
            </td>
            
        </tr>
        <tr>            
            <td>
                <div class="resultTableContainer">
                <SalesLogix:SlxGridView ID="grdMatches" runat="server" 
                    AllowPaging="false" 
                    DataKeyNames="Id,EntityType" 
                    Width="100%"
                    height="100%"
                    AllowSorting="false" 
                    AlternatingRowStyle-CssClass="rowdk" 
                    ShowEmptyTable="true" 
                    UseSLXPagerTemplate="false"
                    AutoGenerateColumns="false" 
                    CellPadding="4" 
                    CssClass="datagrid" 
                    EnableViewState="false" 
                    ExpandableRows="False"
                    EmptyTableRowText="<%$ resources: grdMatches.EmptyTableRowText %>" 
                    GridLines="Both" 
                    OnRowCommand="grdMatches_OnRowCommand" 
                    OnSelectedIndexChanged="grdMatches_SelectedIndexChanged" 
                    PageSize="5"
                    PagerStyle-CssClass="gridPager" 
                    ResizableColumns="true" 
                    RowStyle-CssClass="rowlt" 
                    SelectedRowStyle-CssClass="rowSelected" >
                    <Columns>
                        <asp:ButtonField CommandName="Merge" Text="<%$ resources: grdMatches.Merge.ColumnHeading %>" />
                        <asp:BoundField DataField="Id" Visible="false" />
                        <asp:BoundField DataField="EntityType" Visible="false" />
                        <asp:BoundField DataField="Score" HeaderText="<%$ resources: grdMatches.Score.ColumnHeading %>" 
                            ItemStyle-HorizontalAlign="Center" />
                        <asp:BoundField DataField="EntityName" HeaderText="<%$ resources: grdMatches.Type.ColumnHeading %>" />
                        <asp:BoundField DataField="Company" HeaderText="<%$ resources: grdMatches.Company.ColumnHeading %>" />
                        <asp:BoundField DataField="FirstName" HeaderText="<%$ resources: grdMatches.FirstName.ColumnHeading %>" />
                        <asp:BoundField DataField="LastName" HeaderText="<%$ resources: grdMatches.LastName.ColumnHeading %>" />
                        <asp:BoundField DataField="Title" HeaderText="<%$ resources: grdMatches.Title.ColumnHeading %>" />
                        <asp:TemplateField HeaderText="<%$ resources: grdMatches.Email.ColumnHeading %>">
                            <ItemTemplate>
                                <SalesLogix:Email ID="Email" runat="server" DisplayMode="AsHyperlink" Text='<%# Eval("Email") %>'>
                                </SalesLogix:Email>
                            </ItemTemplate>
                        </asp:TemplateField>
                        <asp:BoundField DataField="CityStateZip" HeaderText="<%$ resources: grdMatches.CityStateZip.ColumnHeading %>" />
                        <asp:TemplateField HeaderText="<%$ resources: grdMatches.WorkPhone.ColumnHeading %>">
                            <ItemTemplate>
                                <SalesLogix:Phone ID="phnWorkPhone" runat="server" DisplayAsLabel="true" Text='<%# Eval("WorkPhone") %>'>
                                </SalesLogix:Phone>
                            </ItemTemplate>
                        </asp:TemplateField>
                    </Columns>
                </SalesLogix:SlxGridView>
                </div>
            </td>
            
        </tr>
        <tr>
            
            <td>
                <br />
                <div class="resultTableContainer">
                <span class="slxlabel">
                    <asp:Label ID="lblAccountMatches" runat="server" Text="<%$ resources: lblAccountMatches.Caption %>"></asp:Label>
                </span>
                </div>
            </td>
            
        </tr>
        <tr>
            
            <td>
                <div class="resultTableContainer">
                <SalesLogix:SlxGridView ID="grdAccountMatches" runat="server" 
                    AllowPaging="false" 
                    AllowSorting="false"
                    AlternatingRowStyle-CssClass="rowdk" 
                    AutoGenerateColumns="false" 
                    CellPadding="4" 
                    CssClass="datagrid" 
                    DataKeyNames="Id" 
                    EmptyTableRowText="<%$ resources: grdMatches.EmptyTableRowText %>" 
                    Width="100%"
                    Height="100%"
                    PageSize="5" 
                    GridLines="None" 
                    OnRowCommand="grdAccountMatches_OnRowCommand"
                    ExpandableRows="False" 
                    OnSelectedIndexChanged="grdAccountMatches_SelectedIndexChanged" 
                    PagerStyle-CssClass="gridPager" 
                    EnableViewState="false" 
                    ResizableColumns="True" 
                    RowStyle-CssClass="rowlt"
                    SelectedRowStyle-CssClass="rowSelected" 
                    ShowEmptyTable="true" 
                    UseSLXPagerTemplate="false">
                    <Columns>
                        <asp:ButtonField CommandName="Add Contact" Text="<%$ resources: grdAccount.AddContact.ColumnHeading %>" />
                        <asp:BoundField DataField="Id" Visible="false" />
                        <asp:BoundField DataField="Score" HeaderText="<%$ resources: grdAccountMatches.Score.ColumnHeading %>" />
                        <asp:BoundField DataField="AccountName" HeaderText="<%$ resources: grdAccountMatches.Account.ColumnHeading %>" />
                        <asp:BoundField DataField="Industry" HeaderText="<%$ resources: grdAccountMatches.Industry.ColumnHeading %>" />
                        <asp:BoundField DataField="WebAddress" HeaderText="<%$ resources: grdAccountMatches.WebAddress.ColumnHeading %>" />
                        <asp:BoundField DataField="CityStateZip" HeaderText="<%$ resources: grdMatches.CityStateZip.ColumnHeading %>" />
                        <asp:TemplateField HeaderText="<%$ resources: grdAccountMatches.MainPhone.ColumnHeading %>">
                            <ItemTemplate>
                                <SalesLogix:Phone ID="phnAccountPhone" runat="server" DisplayAsLabel="true" 
                                    Text='<%# Eval("MainPhone") %>' />
                            </ItemTemplate>
                        </asp:TemplateField>
                        <asp:BoundField DataField="Type" HeaderText="<%$ resources: grdAccountMatches.Type.ColumnHeading %>" />
                    </Columns>
                </SalesLogix:SlxGridView>
                </div>
            </td>
            
        </tr>
        
    </table>
    </div>
    </div>
    </div>
    
    <div class="leadConvertSection">
    <table border="0" cellpadding="1" cellspacing="0" class="formtable">
        <colgroup>
            <col width="70%" />
            <col width="30%" />
        </colgroup>
        <tr>
            <td>
                <span class="slxlabel">
                    <asp:Label ID="lblAccountConflicts" runat="server" Text="<%$ resources: lblAccountConflicts.Caption %>"></asp:Label>
                </span>
                <div class="textcontrol select">
                    <asp:DropDownList ID="ddlAccountConflicts" runat="server">
                        <asp:ListItem Text="<%$ resources: ddlAccountConflicts_Item_AccountWins %>" Value="ACCOUNTWINS"></asp:ListItem>
                        <asp:ListItem Text="<%$ resources: ddlAccountConflicts_Item_LeadWins %>" Value="LEADWINS"></asp:ListItem>
                    </asp:DropDownList>
                </div>
            </td>
        </tr>
        <tr>
            <td>
                <span>
                    <asp:CheckBox ID="chkCreateOpportunity" runat="server" />
                </span>
                <span class="lblright">
                    <asp:Label ID="lblCreateOpportunity" runat="server" AssociatedControlID="chkCreateOpportunity" 
                        Text="<%$ resources: lblCreateOpportunity.Caption %>"> </asp:Label>
                </span>
            </td>
            <td align="right">
                <asp:Panel ID="ctrlstAddCancel" runat="server" CssClass="controlslist qfActionContainer">
                    <asp:Button ID="cmdInsert" runat="server" OnClick="cmdInsert_Click" Text="<%$ resources: cmdInsert.Caption %>" CssClass="slxbutton" />
                    <asp:Button ID="cmdConvert" runat="server" OnClick="cmdConvert_Click" Text="<%$ resources: cmdConvert.Caption %>" CssClass="slxbutton" />
                    <asp:Button ID="cmdCancel" runat="server" Text="<%$ resources: cmdCancel.Caption %>" CssClass="slxbutton" />
                </asp:Panel>
            </td>
        </tr>
    </table>
    </div>
</asp:Panel>

<%--Layout for the Merge Records view--%>
<asp:Panel runat="server" ID="pnlMergeRecords" Visible="false">
    <div class="leadConvertSection">
    <div id="MergeRecords">  
        <asp:HiddenField ID="hdfSourceID" runat="server" />
        <asp:HiddenField ID="hdfSourceType" runat="server" />
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
                <td>
                    <asp:Label ID="lblMergeText" runat="server" Text="<%$ resources: lblMergeText.Text %>"></asp:Label>
                </td>
            </tr>
        </table>
        <br />
        <div class="mergeArea">
        <div class="mergeAreaWrapper">
        <table style="width: 100%;" cellpadding="0" cellspacing="0" border="0">
           <tr>
                <td style="">                   
                    <SalesLogix:SlxGridView runat="server" ID="grdMerge" 
                        AllowPaging="false"
                        GridLines= "Both" 
                        AutoGenerateColumns="False"
                        AlternatingRowStyle-CssClass="rowdk" 
                        RowStyle-CssClass="rowlt" 
                        CellPadding="4"
                        CssClass="datagrid" 
                        OnRowDataBound="grdMerge_RowDataBound" 
                        OnSelectedIndexChanged="grdMerge_SelectedIndexChanged" 
                        EnableViewState="false" 
                        ExpandableRows="false"
                        ResizableColumns="false" 
                        PageSize="5" 
                        Width = "100%" 
                        Height="100%" 
                        DataKeyNames="PropertyMapId">
                        <Columns >                     
                            <asp:BoundField DataField="PropertyMapId" Visible="false" />
                            <asp:BoundField DataField="Description" HeaderText="Property"/>
                            <asp:TemplateField ItemStyle-HorizontalAlign="Center" HeaderStyle-HorizontalAlign="Center">
                                <HeaderTemplate>
                                    <%# CreateRecordRadioButton("Source") %> 
                                </HeaderTemplate>
                                <ItemTemplate>
                                    <%# CreatePropertyRadioButton(Container.DataItem, "Source") %> 
                                </ItemTemplate>                             
                            </asp:TemplateField>
                            <asp:TemplateField>
                                <HeaderTemplate>
                                    <asp:Label runat="server" ID="lblSourceRecord" Text="Source"></asp:Label>
                                </HeaderTemplate>
                                <ItemTemplate>
                                    <asp:Label runat="server" ID="SourceValue" Text='<%# Eval("SourceValue") %>' />
                                </ItemTemplate>                        
                            </asp:TemplateField>                
                            <asp:TemplateField ItemStyle-HorizontalAlign="Center" HeaderStyle-HorizontalAlign="Center">
                                <HeaderTemplate>
                                    <%# CreateRecordRadioButton("Target")%> 
                                </HeaderTemplate>
                                <ItemTemplate>
                                    <%# CreatePropertyRadioButton(Container.DataItem, "Target")%> 
                                </ItemTemplate>   
                            </asp:TemplateField>
                            <asp:TemplateField>
                                <HeaderTemplate>
                                    <asp:Label runat="server" ID="lblTargetRecord" Text="Target"/>
                                </HeaderTemplate>
                                <ItemTemplate>
                                    <asp:Label runat="server" ID="TargetValue" Text='<%# Eval("TargetValue") %>' />
                                </ItemTemplate>                        
                            </asp:TemplateField>
                        </Columns>
                        <HeaderStyle BackColor="#F3F3F3" BorderColor="Transparent" Font-Bold="True" Font-Size="Small" />
                        <RowStyle CssClass="rowlt" />
                        <AlternatingRowStyle CssClass="rowdk" />
                    </SalesLogix:SlxGridView>
                </td>  
            </tr>            
        </table>
        </div>
        </div>
        <table width="100%">
             <tr>
                <td align="right" style="">
                    <asp:Panel runat="server" ID="ctrlstButtons" CssClass="controlslist qfActionContainer">
                        <asp:Button runat="server" ID="btnMerge" CssClass="slxbutton" Onclick="btnMerge_Click" ToolTip="Merge" Text="<%$ resources: cmdMerge.Caption %>" />
                        <asp:Button runat="server" ID="btnCancel" CssClass="slxbutton" ToolTip="Cancel" Text="<%$ resources: cmdCancel.Caption %>" onclick="btnCancel_Click" />
                    </asp:Panel>
                </td>
            </tr>        
        </table>
    </div>
    </div>
</asp:Panel>


