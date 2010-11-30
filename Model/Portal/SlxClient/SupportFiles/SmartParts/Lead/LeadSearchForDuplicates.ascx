<%@ Control Language="C#" AutoEventWireup="true" CodeFile="LeadSearchForDuplicates.ascx.cs" Inherits="LeadSearchForDuplicates" %>
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
   width:95%;
   margin-left:20px; 
   margin-right:20px;
          
}
.infoArea
{
   border-style:solid; 
   border-width:1px; 
   border-color:#99BBE8;
   background-color: White;
   margin-left:20px; 
   margin-right:20px;
   width:95%;  
         
}

.resultArea
{
   border-style:solid; 
   border-width:1px; 
   border-color:#99BBE8;
   margin-left:20px; 
   margin-right:20px;
   padding-bottom:10px;
   padding-left:10px; 
   padding-right:10px;  
   height:300px; 
   width:95%; 
   overflow:scroll;      
         
}

</style>
<asp:HiddenField ID="Mode" runat="server" Value="View" />
<asp:HiddenField ID="UpdateIndex" runat="server" Value="True" />
<div style="display:none">
    <asp:Panel ID="LeadMatching_RTools" runat="server">
        <SalesLogix:PageLink ID="lnkMatchOptionsHelp" runat="server" LinkType="HelpFileName"
            ToolTip="<%$ resources: Portal, Help_ToolTip %>" Target="Help" NavigateUrl="leadmatch.aspx"
            ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16">
        &nbsp;
        </SalesLogix:PageLink>
    </asp:Panel>
    <input id="txtSelectedTab" runat="server" type="hidden" />
</div>
<br />
<div class="infoArea">
<table id="SourceSnapShot"  style="margin-left:5px; margin-right:5px; background-color:White; width:95%" border="0" cellpadding="0" cellspacing="0">
    <col width="1%" /><col width="35%" /><col width="32%" /><col width="32%" />
    <tr style="margin-left:5px; margin-top:5px">
        <td></td>
        <td colspan="2">
            <span class="lbl">
                <asp:Label ID="lblLead" runat="server" Text=""></asp:Label>
            </span>
        </td>
        <td></td>
    </tr>
   <tr>
        <td></td>
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
        <td></td>
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
<br />
 
<div id="tabStripArea" style="margin-left:20px; margin-right:20px; width:95%">
    <asp:Panel id="tabFilters" runat="server" CssClass="activeTab">
        <div class="tableft">&nbsp;</div>
            <div class="tabcenter">
                <asp:Localize ID="lclTabFilters" runat="server" Text="<%$ resources: lblMatchFilters.Caption %>"></asp:Localize>
            </div>
        <div class="tabright">&nbsp;</div>
    </asp:Panel>
    <asp:Panel id="tabOptions" runat="server" CssClass="inactiveTab">
        <div class="tableft">&nbsp;</div>
        <div class="tabcenter">
            <asp:Localize ID="lclTabOptions" runat="server" Text="<%$ resources: cmdSearchOptions.Caption %>"></asp:Localize>
        </div>
        <div class="tabright">&nbsp;</div>
    </asp:Panel>
</div>

<div runat="server" id="divFilters">
    <table id="tblFilters" class="filterArea" border="0" cellpadding="0"
        cellspacing="0">
        <col width="1%" /><col width="4%" /><col width="15%" /><col width="85%" />
        <tr>
            <td></td>
            <td colspan="2">
                <span class="slxlabel">
                    <asp:Label runat="server" ID="lblMatchType" Text="<%$ resources: lblMatchTypes.Caption %>"></asp:Label>
                    <br />
                </span>
            </td>
            <td>
                <span>
                    <asp:CheckBox ID="chkContacts" runat="server" Checked="true" />
                </span>
                <span class="lblright" style="padding-right:20px">
                    <asp:Label ID="lblContacts" runat="server" AssociatedControlID="chkContacts" Text="<%$ resources: lblContacts.Caption %>"></asp:Label>
                </span>
                <span>
                    <asp:CheckBox ID="chkLeads" runat="server" Checked="true" />
                </span>
                <span class="lblright" style="padding-right:20px">
                    <asp:Label ID="lblleads" runat="server" AssociatedControlID="chkLeads" Text="<%$ resources: lblLeads.Caption %>"></asp:Label>
                </span>
                <span>
                    <asp:CheckBox ID="chkAccounts" runat="server" Checked="true" />
                </span>
                <span class="lblright">
                    <asp:Label ID="lblAccounts" runat="server" AssociatedControlID="chkAccounts" Text="<%$ resources: lblAccounts.Caption %>"></asp:Label>
                </span>
            </td>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td colspan="2">
                <br />
                <span class="slxlabel">
                    <asp:Label runat="server" ID="lblFiltersMatch" Text="<%$ resources: lblMatchFilters.Caption %>"></asp:Label>
                </span>
            </td>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td colspan="2">
                <span class="slxlabel">
                    <asp:Label runat="server" ID="lblFilterDesc" Text="<%$ resources: lblFilterDesc.Caption %>"></asp:Label>
                </span>
            </td>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td colspan="2">
                <asp:CheckBoxList ID="chkListFilters" runat="server" RepeatColumns="3" RepeatDirection="Horizontal" Width="100%"></asp:CheckBoxList>
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
    <div style="border:solid 1px #99BBE8; margin-left:20px; margin-right:20px; width:95%">
        <SalesLogix:MatchOptions id="MatchOptions" runat="server" OnInit="SetOptions" ></SalesLogix:MatchOptions>
    </div>
</div>
    
<br />
<div id="divUpdateMatches" style="margin-left:20px">
    <asp:Button runat="server" ID="cmdUpdateMatches" CssClass="slxbutton" Text="<%$ resources: cmdUpdateMatches.Caption %>" onclick="cmdUpdateMatches_Click" />
</div>
    
<br/> 
<div id="divResults" class="resultArea">   
<table id="tblResults" width="95%" border="0" cellpadding="0" cellspacing="0">
    <col width="5px" /><col width="100%" /><col width="5px" />
    <tr>
        <td></td>
        <td>
            <br />
            <span class="slxlabel">
                <asp:Label runat="server" ID="lblMatchesFound" Text="<%$ resources: lblMatchesFound.Caption %>"></asp:Label>
            </span>
        </td>
        <td></td>
    </tr>
    <tr>
        <td ></td>
        <td>
            <SalesLogix:SlxGridView runat="server" ID="grdMatches" GridLines="Both" AutoGenerateColumns="false" CellPadding="4"
                CssClass="datagrid" PagerStyle-CssClass="gridPager" AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt"
                SelectedRowStyle-CssClass="rowSelected" ShowEmptyTable="true" EnableViewState="false" AllowPaging="false" AllowSorting="false"
                PageSize="5" OnSelectedIndexChanged="grdMatches_SelectedIndexChanged" ExpandableRows="False" ResizableColumns="true"
                OnRowCommand="grdMatches_OnRowCommand" EmptyTableRowText="<%$ resources: grdMatches.EmptyTableRowText %>"
                UseSLXPagerTemplate="false" DataKeyNames="Id,EntityType" Width="100%" Height="100%" >        
                <Columns>
                    <asp:ButtonField CommandName="Open" Text="<%$ resources: grdMatches.Open.ColumnHeading %>" />
                    <asp:BoundField DataField="Id" Visible="false" />
                    <asp:BoundField DataField="Score" ItemStyle-HorizontalAlign="Center" HeaderText="<%$ resources: grdMatches.Score.ColumnHeading %>" />
                    <asp:BoundField DataField="EntityType" HeaderText="<%$ resources: grdMatches.Type.ColumnHeading %>" />
                    <asp:BoundField DataField="Company" HeaderText="<%$ resources: grdMatches.Company.ColumnHeading %>" />
                    <asp:BoundField DataField="FirstName" HeaderText="<%$ resources: grdMatches.FirstName.ColumnHeading %>" />
                    <asp:BoundField DataField="LastName" HeaderText="<%$ resources: grdMatches.LastName.ColumnHeading %>" />
                    <asp:BoundField DataField="Title" HeaderText="<%$ resources: grdMatches.Title.ColumnHeading %>" />
                    <asp:TemplateField HeaderText="<%$ resources: grdMatches.Email.ColumnHeading %>">
                        <ItemTemplate>
                            <SalesLogix:Email ID="Email" runat="server" DisplayMode="AsHyperlink" Text='<%# Eval("Email") %>'></SalesLogix:Email>
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:BoundField DataField="CityStateZip" HeaderText="<%$ resources: grdMatches.CityStateZip.ColumnHeading %>" />
                    <asp:TemplateField HeaderText="<%$ resources: grdMatches.WorkPhone.ColumnHeading %>">
                        <ItemTemplate>
                            <SalesLogix:Phone ID="phnWorkPhone" runat="server" DisplayAsLabel="true" Text='<%# Eval("WorkPhone") %>'></SalesLogix:Phone>
                        </ItemTemplate>
                    </asp:TemplateField>
                </Columns>
            </SalesLogix:SlxGridView>
        </td>
        <td></td>
    </tr>
    <tr>
        <td></td>
        <td>
            <br />
            <span class="slxlabel">
                <asp:Label runat="server" ID="lblAccountMatches" Text="<%$ resources: lblAccountMatches.Caption %>"></asp:Label>
            </span>
        </td>
        <td></td>
    </tr>
    <tr>
        <td></td>
        <td>
            <SalesLogix:SlxGridView runat="server" ID="grdAccountMatches" GridLines="None" AutoGenerateColumns="false" CellPadding="4"
                CssClass="datagrid" PagerStyle-CssClass="gridPager" AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt"
                SelectedRowStyle-CssClass="rowSelected" ShowEmptyTable="true" EnableViewState="false" AllowPaging="false" AllowSorting="false"
                PageSize="5" OnSelectedIndexChanged="grdAccountMatches_SelectedIndexChanged" ExpandableRows="False" ResizableColumns="True"
                OnRowCommand="grdAccountMatches_OnRowCommand" EmptyTableRowText="<%$ resources: grdMatches.EmptyTableRowText %>"
                UseSLXPagerTemplate="false" DataKeyNames="Id" Width="100%" Height="100%" >                 
                <Columns>
                    <asp:ButtonField CommandName="Add Contact" Text="<%$ resources: grdAccountMatches.AddContact.ColumnHeading %>" />
                    <asp:BoundField DataField="Id" Visible="false" />
                    <asp:BoundField DataField="AccountName" ShowHeader="true" HeaderText="<%$ resources: grdAccountMatches.Account.ColumnHeading %>" />
                    <asp:BoundField DataField="Industry" ShowHeader="true" HeaderText="<%$ resources: grdAccountMatches.Industry.ColumnHeading %>" />
                    <asp:BoundField DataField="WebAddress" ShowHeader="true" HeaderText="<%$ resources: grdAccountMatches.WebAddress.ColumnHeading %>" />
                    <asp:BoundField DataField="CityStateZip" ShowHeader="true" HeaderText="<%$ resources: grdMatches.CityStateZip.ColumnHeading %>" />
                    <asp:TemplateField HeaderText="<%$ resources: grdAccountMatches.MainPhone.ColumnHeading %>">
                        <ItemTemplate>
                            <SalesLogix:Phone ID="phnAccountPhone" runat="server" DisplayAsLabel="true" Text='<%# Eval("MainPhone") %>' />
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:BoundField DataField="Type" ShowHeader="true" HeaderText="<%$ resources: grdAccountMatches.Type.ColumnHeading %>" />
                </Columns>
            </SalesLogix:SlxGridView>
        </td>
        <td></td>
    </tr>    
 </table>
 </div>
 <br/>  
 
 <table id="tblFooter" width="100%" cellpadding="0" cellspacing="0" border="0">
    <col="80%" /><col="20%" />
    <tr>
        <td></td>
        <td align="right">
            <div style="padding: 10px 10px 0px 10px;">
                <asp:Button runat="server" ID="cmdCancel" CssClass="slxbutton" Text="<%$ resources: cmdCancel.Caption %>" style="width:70px;" />
            </div>
        </td>
    </tr>
</table>
