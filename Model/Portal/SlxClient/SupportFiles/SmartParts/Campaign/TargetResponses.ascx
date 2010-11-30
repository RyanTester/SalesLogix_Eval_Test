<%@ Control Language="C#" AutoEventWireup="true" CodeFile="TargetResponses.ascx.cs" Inherits="TargetResponses" %>
<%@ Register Assembly="Sage.SalesLogix.Client.GroupBuilder" Namespace="Sage.SalesLogix.Client.GroupBuilder" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.Platform.WebPortal" Namespace="Sage.Platform.WebPortal.SmartParts" TagPrefix="SalesLogix" %>

<SalesLogix:SmartPartToolsContainer runat="server" ID="TargetResponses_LTools" ToolbarLocation="left">
    <asp:LinkButton runat="server" ID="tr_lnkFilters" OnClientClick="tr_ShowHideFilters()" Text="<%$ resources: lnkShowFilters.Text %>"></asp:LinkButton>&nbsp;
</SalesLogix:SmartPartToolsContainer>

<SalesLogix:SmartPartToolsContainer runat="server" ID="TargetResponses_RTools" ToolbarLocation="right">
    <asp:ImageButton runat="server" ID="AddResponse" ToolTip="<%$ resources: addResponse.ToolTip %>"
        ImageUrl="~/images/icons/plus_16x16.gif" />
    <SalesLogix:PageLink ID="lnkHelp" runat="server" LinkType="HelpFileName" ToolTip="<%$ resources: Portal, Help_ToolTip %>" 
        Target="Help" NavigateUrl="campaignresponsestab.aspx" ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16">
    </SalesLogix:PageLink>
</SalesLogix:SmartPartToolsContainer>

<input runat="server" id="tr_txtShowFilter" enableviewstate="true" type="hidden" />

<div id="tr_filterDiv" style="display:none" runat="server">   
    <table border="0" cellpadding="1" cellspacing="0" class="formtable">
        <col width="10%" />
        <col width="35%" />
        <col width="25%" />
        <col width="20%" />
        <tr id="row0">
            <td id="row0col1">
                <span class="lbl">
                    <asp:Label runat="server" ID="lblShow" Text="<%$ resources: lblShow.Caption %>" />
                </span>
            </td>
            <td id="row0col2">
                <div class="lbl">
                    <asp:CheckBox runat="server" ID="chkContacts" CssClass="checkbox" Checked="true" EnableViewState="true"
                        Text="<%$ resources: chkContacts.Caption %>" />
                </div>
                <div class="lbl">
                    <asp:CheckBox runat="server" ID="chkLeads" CssClass="checkbox" Checked="true" EnableViewState="true"
                        Text="<%$ resources: chkLeads.Caption %>" />
                </div>
            </td>
            <td></td>
            <td></td>
        </tr>
        <tr id="row1">
            <td></td>
            <td id="row1col1">
                <div class="lbl">
                    <asp:CheckBox runat="server" ID="chkLeadSource" CssClass="checkbox" EnableViewState="true"
                        Text="<%$ resources: chkLeadSource.Caption %>" />
                </div>
                <div class="textcontrol select">
                    <asp:ListBox runat="server" ID="lbxLeadSource" SelectionMode="Single" Rows="1" EnableViewState="true" 
                        OnSelectedIndexChanged="lbxLeadSource_SelectedIndexChanged" >
                    </asp:ListBox>
                </div>
            </td>
            <td id="row1col5">
                <div class="lbl">
                    <asp:CheckBox runat="server" ID="chkStage" CssClass="checkbox" EnableViewState="true"
                        Text="<%$ resources: chkStage.Caption %>"  />
                </div>
                <div class="textcontrol select">
                    <asp:ListBox runat="server" ID="lbxStage" SelectionMode="Single" Rows="1" EnableViewState="true" OnSelectedIndexChanged="lbxStage_SelectedIndexChanged" >
                    </asp:ListBox>
                </div>            
            </td>
            <td id="row1col6">
                <asp:Button runat="server" ID="cmdSearch" OnClick="Search_OnClick" Text="<%$ resources: cmdSearch.Caption %>" CssClass="slxbutton" />
            </td>
        </tr>
        <tr id="row2">
            <td id="row2col1"></td>
            <td id="row2col2">
                <div class="lbl">
                    <asp:CheckBox runat="server" ID="chkMethod" CssClass="checkbox" EnableViewState="true"
                        Text="<%$ resources: chkMethod.Caption %>" />
                </div>
                                <div class="textcontrol select">
                    <asp:ListBox runat="server" ID="lbxMethods" SelectionMode="Single" Rows="1" EnableViewState="true" OnSelectedIndexChanged="lbxMethods_SelectedIndexChanged">
                    </asp:ListBox>
                </div>  
            </td>
            <td id="row2col4">
                <div class="lbl">
                    <asp:CheckBox runat="server" ID="chkName" CssClass="checkbox" EnableViewState="true"
                        Text="<%$ resources: chkName.Caption %>" />
                </div>
                <div class="textcontrol">
                    <asp:TextBox runat="server" ID="txtName" EnableViewState="true"></asp:TextBox>
                </div>            
            </td>
            <td id="row2col5">
                <asp:Button runat="server" ID="cmdReset" Text="<%$ resources: cmdReset.Caption %>" EnableViewState="true"
                    OnClientClick="ResetResponseFilters()" CssClass="slxbutton" />
            </td>
        </tr>
    </table>
</div>
<table border="0" cellpadding="1" cellspacing="0" class="formtable">
    <col width="80%" />
    <col width="20%" />
    <tr class="mainContentHeader">
        <td>
            <div class="slxlabel aligncenter">
                <asp:CheckBox runat="server" ID="chkDisplayResults" CssClass="checkbox" OnCheckedChanged="chkDisplayResults_CheckedChanged"
                    AutoPostBack="true" Text="<%$ resources: chkDisplayResults.Caption %>" />
            </div>
        </td>
        <td>
            <div class="slxlabel aligncenter">
                <asp:Label runat="server" ID="tr_lblSearchCount"></asp:Label>
            </div>
        </td>
    </tr>
    <tr>
        <td colspan="2">
            <SalesLogix:SlxGridView runat="server" ID="grdResponses" GridLines="None" AutoGenerateColumns="false" CellPadding="4"
                CssClass="datagrid" PagerStyle-CssClass="gridPager" AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt"
                SelectedRowStyle-CssClass="rowSelected" ShowEmptyTable="true" EnableViewState="false" ExpandableRows="True"
                DataKeyNames="TargetId, ResponseId, Type" ResizableColumns="True" EmptyTableRowText="<%$ resources: grdResponses.EmptyTableRowText %>"
                OnRowCommand="grdResponses_RowCommand" OnRowDeleting="grdResponses_RowDeleting" OnRowDataBound="grdResponses_RowDataBound"
                OnRowEditing="grdResponses_RowEditing" UseSLXPagerTemplate="false" AllowPaging="true" pageSize="10" >
                <Columns>
                    <asp:BoundField DataField="LeadSource" HeaderText="<%$ resources: grdResponses.LeadSource.ColumnHeading %>" />
                    <asp:BoundField DataField="Target" HeaderText="<%$ resources: grdResponses.Name.ColumnHeading %>" />
                    <asp:BoundField DataField="Type" HeaderText="<%$ resources: grdResponses.Type.ColumnHeading %>" />
                    <asp:TemplateField SortExpression="ResponseDate" HeaderText="<%$ resources: grdResponses.ResponseDate.ColumnHeading %>" >
                        <ItemTemplate>
                            <SalesLogix:DateTimePicker runat="server" ID="dteResponseDate" DisplayTime="False" DisplayMode="AsText"
                                DateOnly="True" DateTimeValue='<%# Eval("ResponseDate") %>' >
                            </SalesLogix:DateTimePicker>
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:BoundField DataField="Method" HeaderText="<%$ resources: grdResponses.Method.ColumnHeading %>" />                    
                    <asp:BoundField DataField="Stage" HeaderText="<%$ resources: grdResponses.Stage.ColumnHeading %>" />
                    <asp:BoundField DataField="Comments" HeaderText="<%$ resources: grdResponses.Comments.ColumnHeading %>" />
                    <asp:ButtonField CommandName="Add" Text="<%$ resources: grdResponses.Add.Column %>" />
                    <asp:ButtonField CommandName="Edit" Text="<%$ resources: grdResponses.Edit.Column %>" />
                    <asp:ButtonField CommandName="Delete" Text="<%$ resources: grdResponses.Delete.Column %>" />
                    <asp:BoundField DataField="TargetId" Visible="false" />
                    <asp:BoundField DataField="ResponseId" Visible="false" />                    
                </Columns>
            </SalesLogix:SlxGridView>
        </td>
    </tr>
</table>