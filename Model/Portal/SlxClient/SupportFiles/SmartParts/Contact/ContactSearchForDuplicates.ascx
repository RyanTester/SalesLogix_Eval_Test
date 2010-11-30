<%@ Control Language="C#" AutoEventWireup="true" CodeFile="ContactSearchForDuplicates.ascx.cs" Inherits="ContactSearchForDuplicates" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>
<%@ Register Src="~/SmartParts/Lead/MatchOptions.ascx" TagName="MatchOptions" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.ScriptResourceProvider" TagPrefix="SalesLogix" %>


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
   width:95%;
   margin-left:20px; 
   margin-right:20px;
   margin-top:1em;
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
   overflow:scroll; 
   height:300px; 
   width:95%; 
     
         
}

.EntityCard
{
    padding : 10px 20px;
    background-color : White;
}

.SummaryTitle 
{
    font-size : 120%;
    font-weight : bold;
    color : Blue;
    padding-bottom : 4px;
}
.SummaryCaption 
{
    color: #999999;
    width : 120px;
    text-align : right;
    padding : 0px 0px 3px 0px;
}
.DataItem 
{
    display : inline;
    padding-left : 4px;
}

.DataColumn 
{
    padding-right : 30px;
    vertical-align : top;
}
.SummaryCol1 
{
     width : 180px;
}
.SummaryCol2 
{
    width : 320px;
}
.SummaryCol3 
{
}

.SummaryChildrenTableBox 
{

}
.SummaryChildrenTableCell 
{
    padding : 0px 8px;
}



</style>
<asp:HiddenField ID="Mode" runat="server" Value="View" />
<asp:HiddenField ID="UpdateIndex" runat="server" Value="True" />
<SalesLogix:ScriptResourceProvider ID="SummaryView_Captions" runat="server">
    <Keys>
        <SalesLogix:ResourceKeyName Key="svAddress1.Caption" />
        <SalesLogix:ResourceKeyName Key="svCityStateZip.Caption" />
        <SalesLogix:ResourceKeyName Key="svAccount.Caption" />
        <SalesLogix:ResourceKeyName Key="svCompany.Caption" />
        <SalesLogix:ResourceKeyName Key="svEmail.Caption" />
        <SalesLogix:ResourceKeyName Key="svName.Caption" />
        <SalesLogix:ResourceKeyName Key="svTitle.Caption" />
        <SalesLogix:ResourceKeyName Key="svType.Caption" />
        <SalesLogix:ResourceKeyName Key="svAccMgr.Caption" />
        <SalesLogix:ResourceKeyName Key="svHomePhone.Caption" />
        <SalesLogix:ResourceKeyName Key="svWorkPhone.Caption" />
        <SalesLogix:ResourceKeyName Key="svMobilePhone.Caption" />
        <SalesLogix:ResourceKeyName Key="svStatus.Caption" />
        <SalesLogix:ResourceKeyName Key="svWebAddress.Caption" />
        <SalesLogix:ResourceKeyName Key="svEntityAccount.Caption" />
        <SalesLogix:ResourceKeyName Key="svEntityContact.Caption" />
        <SalesLogix:ResourceKeyName Key="svEntityLead.Caption" />
        <SalesLogix:ResourceKeyName Key="svTollFree.Caption" />
        <SalesLogix:ResourceKeyName Key="svIndustry.Caption" />
        <SalesLogix:ResourceKeyName Key="svDivision.Caption" />
        <SalesLogix:ResourceKeyName Key="svMainPhone.Caption" />
        <SalesLogix:ResourceKeyName Key="svSummaryViewLead.Title" />
        <SalesLogix:ResourceKeyName Key="svSummaryViewContact.Title" />
        <SalesLogix:ResourceKeyName Key="svSummaryViewAccount.Title" />
        

    </Keys>
</SalesLogix:ScriptResourceProvider>
<div style="display:none">
    <asp:Panel ID="ContactMatching_RTools" runat="server">
        <SalesLogix:PageLink ID="lnkMatchOptionsHelp" runat="server" LinkType="HelpFileName"
            ToolTip="<%$ resources: Portal, Help_ToolTip %>" Target="Help" NavigateUrl="contactpotentialmatch.aspx"
            ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16">
            &nbsp;
        </SalesLogix:PageLink>
    </asp:Panel>
    <input id="txtSelectedTab" runat="server" type="hidden" />
</div>
<br />
<div class="infoArea">
<table id="SourceSnapShot" style="margin-left:20px; margin-right:20px; background-color:White; width:95%" border="0"
    cellpadding="0" cellspacing="0">
    <col width="1%" /><col width="35%" /><col width="32%" /><col width="32%" />
    <tr style="margin-left:5px; margin-top:5px">
        <td></td>
        <td colspan="2">
            <span class="lbl">
                <asp:Label ID="lblContact" runat="server" Text=""></asp:Label>
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
                <asp:Label ID="lblAccount" runat="server" Text="<%$ resources: lblAccount.Caption %>" AssociatedControlID="lblValueAccount"></asp:Label>
            </span>
            <span>
                <asp:Label ID="lblValueAccount" runat="server" Text=""></asp:Label>
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
<div id="tabStripArea" style="margin-left:20px; margin-right:20px">
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

<div runat="server" id="divFilters" style="display:block;">
    <div style="border:solid 1px #99BBE8; margin-left:20px; margin-right:20px; width:95%">
    <br />
    <table id="tblFilters" class="filterArea" border="0" cellpadding="0" cellspacing="0">
    <col width="1%" /><col width="4%" /><col width="15%" /><col width="85%" />
        <tr>
            <td></td>
            <td colspan="2">
                <span class="lbl">
                    <asp:Label runat="server" ID="lblMatchTypes" Text="<%$ resources: lblMatchTypes.Caption %>"></asp:Label>
                    <br />
                </span>
            </td>
            <td>
                <span>
                    <asp:CheckBox ID="chkContacts" runat="server" Checked="true" />
                </span>
                <span class="lblright" style="padding-right:40px">
                    <asp:Label ID="lblContacts" runat="server" AssociatedControlID="chkContacts" 
                        Text="<%$ resources: lblContacts.Caption %>">
                    </asp:Label>
                </span>
                <span>
                    <asp:CheckBox ID="chkLeads" runat="server" Checked="true" />
                </span>
                <span class="lblright" style="padding-right:40px">
                    <asp:Label ID="lblleads" runat="server" AssociatedControlID="chkLeads" 
                        Text="<%$ resources: lblLeads.Caption %>">
                    </asp:Label>
                </span>
                <span>
                    <asp:CheckBox ID="chkAccounts" runat="server" Checked="true" />
                </span>
                <span class="lblright">
                    <asp:Label ID="lblAccounts" runat="server" AssociatedControlID="chkAccounts" 
                        Text="<%$ resources: lblAccounts.Caption %>">
                    </asp:Label>
                </span>
            </td>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td colspan="2">
                <br />
                <span class="slxlabel">
                    <asp:Label runat="server" ID="lblMatchFilters" Text="<%$ resources: lblMatchFilters.Caption %>"></asp:Label>
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
                <asp:CheckBoxList ID="chklstFilters" runat="server" RepeatColumns="3" RepeatDirection="Horizontal" Width="100%"></asp:CheckBoxList>
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
            <td colspan="2">
                <fieldset class="slxlabel radio">
                    <asp:RadioButtonList ID="rdgOptions" runat="server" RepeatDirection="Horizontal" Width="90%">
                        <asp:ListItem Selected="True" Text="<%$ resources: rdgMatchAll_Item.Text %>" Value="MatchAll" />
                        <asp:ListItem Text="<%$ resources: rdgMatchAny_Item.Text %>" Value="MatchAny" />
                    </asp:RadioButtonList>
                </fieldset>
            </td>
        </tr>
    </table>
    </div>
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
 
<br />
<div  id="divResults" class="resultArea">
<table id="tblResults" border="0" cellpadding="0" cellspacing="0">
    <col width="5px" /><col width="100%" /><col width="5px" />
    <tr>
        <td></td>
        <td colspan="2">
            <br />
            <span class="slxlabel">
                <asp:Label runat="server" ID="lblMatchesFound" Text="<%$ resources: lblMatchesFound.Caption %>"></asp:Label>
            </span>
        </td>
        <td></td>
    </tr>
    <tr>
        <td></td>
        <td>            
            <SalesLogix:SlxGridView runat="server" ID="grdMatches" GridLines="Both" AutoGenerateColumns="false" CellPadding="4"
                CssClass="datagrid" PagerStyle-CssClass="gridPager" AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt"
                SelectedRowStyle-CssClass="rowSelected" ShowEmptyTable="true" EnableViewState="false" AllowPaging="false" AllowSorting="false"
                PageSize="20" OnSelectedIndexChanged="grdMatches_SelectedIndexChanged" ExpandableRows="False" ResizableColumns="true"
                OnRowCommand="grdMatches_OnRowCommand" EmptyTableRowText="<%$ resources: grdMatches.EmptyTableRowText %>"
                UseSLXPagerTemplate="false" DataKeyNames="Id,EntityType" 
                Width="100%"
                height="100%" 
                >        
                <Columns>
                    <asp:TemplateField HeaderText="">
                        <ItemTemplate>
                           <%# CreateViewButton(Eval("Id"), Eval("EntityType"))%>
                        </ItemTemplate>
                    </asp:TemplateField>
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
        <td style="padding-left:5px; padding-right:5px"></td>
    </tr>
    <tr>
        <td></td>
        <td colspan="2">
            <br />
            <span class="slxlabel">
                <asp:Label runat="server" ID="lblAccountMatches" Text="<%$ resources: lblAccountsFound.Caption %>"></asp:Label>
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
                UseSLXPagerTemplate="false" DataKeyNames="Id" 
                Width="100%"
                height="100%"             
                >                 
                <Columns>
                    <asp:TemplateField HeaderText="">
                        <ItemTemplate>
                           <%# CreateViewButton(Eval("Id"),"Account")%>
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:ButtonField CommandName="UseAccount" Text="<%$ resources: grdAccountMatches.UseAccount.ColumnHeading %>" />
                    <asp:BoundField DataField="Id" Visible="false" />
                    <asp:BoundField DataField="Score" ShowHeader="true" HeaderText="<%$ resources: grdAccountMatches.Score.ColumnHeading %>" />
                    <asp:BoundField DataField="Account" ShowHeader="true" HeaderText="<%$ resources: grdAccountMatches.Account.ColumnHeading %>" />
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
<div style="padding-right:20px; text-align:right; width:95%" >
   <asp:Panel runat="server" ID="pnlCancel" CssClass="controlslist qfActionContainer">
        <asp:Button runat="server" ID="cmdCancel" CssClass="slxbutton" Text="<%$ resources: cmdCancel.Caption %>" />
    </asp:Panel>
</div>
