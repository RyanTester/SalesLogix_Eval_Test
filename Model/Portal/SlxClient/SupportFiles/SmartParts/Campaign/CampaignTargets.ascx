<%@ Control Language="C#" AutoEventWireup="true" CodeFile="CampaignTargets.ascx.cs" Inherits="CampaignTargets" %>
<%@ Register Assembly="Sage.SalesLogix.Client.GroupBuilder" Namespace="Sage.SalesLogix.Client.GroupBuilder" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.PickList" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Lookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.Platform.WebPortal" Namespace="Sage.Platform.WebPortal.SmartParts" TagPrefix="SalesLogix" %>

<SalesLogix:SmartPartToolsContainer runat="server" ID="CampaignTargets_LTools" ToolbarLocation="left">
    <asp:LinkButton runat="server" ID="lnkFilters" OnClientClick="ShowHideFilters()" Text="<%$ resources: lnkShowFilters.Text %>"></asp:LinkButton>&nbsp;
</SalesLogix:SmartPartToolsContainer>

<SalesLogix:SmartPartToolsContainer runat="server" ID="CampaignTargets_CTools" ToolbarLocation="Center">
    <div class="slxlabel aligncenter">
        <asp:CheckBox ID="chkExternalList" runat="server" />
        <asp:Label ID="lblExternalList" runat="server" Text="<%$ resources: chkExternalList.Caption %>"></asp:Label>&nbsp;&nbsp;&nbsp;
    </div>
</SalesLogix:SmartPartToolsContainer>

<SalesLogix:SmartPartToolsContainer runat="server" ID="CampaignTargets_RTools" ToolbarLocation="right">
    <asp:ImageButton runat="server" ID="cmdSave" ToolTip="<%$ resources: cmdSave.ToolTip %>" OnClick="Save_OnClick"
        AlternateText="<%$ resources: cmdSave.Caption %>" ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Save_16x16" />
    <asp:ImageButton runat="server" ID="cmdUpdate" OnClick="UpdateTargets_OnClick"
        AlternateText="<%$ resources: cmdUpdate.Caption %>" ToolTip="<%$ resources: cmdUpdate.ToolTip %>"
        ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Recurring_16x16" />
    <asp:ImageButton runat="server" ID="cmdManageList" OnClick="ManageTargets_OnClick" AlternateText="<%$ resources: cmdManageList.Caption %>"
        ToolTip="<%$ resources: cmdManageList.ToolTip %>" ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=plus_16x16" />
    <asp:ImageButton runat="server" ID="cmdDelete" OnClick="DeleteTargets_OnClick" AlternateText="<%$ resources: cmdDelete.Caption %>"
        ToolTip="<%$ resources: cmdDelete.ToolTip %>" ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Delete_16x16" />
    <asp:ImageButton runat="server" ID="cmdEmail" OnClick="LaunchEmail_OnClick" AlternateText="<%$ resources: cmdLaunchEmail.Caption %>"
        ToolTip="<%$ resources: cmdLaunchEmail.ToolTip %>" ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Send_Write_email_16x16" />
    <SalesLogix:PageLink ID="lnkHelp" runat="server" LinkType="HelpFileName" ToolTip="<%$ resources: Portal, Help_ToolTip %>"
        Target="Help" NavigateUrl="campaigntargetstab.aspx" ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16">
    </SalesLogix:PageLink>
</SalesLogix:SmartPartToolsContainer>

<div id="hiddenProps" style="display:none" runat="server">
    <input id="txtConfirmExternalList" runat="server" type="hidden" />
    <input id="txtNewInitialTargetValue" runat="server" type="hidden" />
    <input id="txtSelectedTargetId" runat="server" type="hidden" />
    <input id="txtNewStatusValue" runat="server" type="hidden" />
    <asp:Button ID="cmdExternalList" runat="server" OnClick="cmdExternalList_OnClick" />
    <asp:Button ID="cmdInitialTarget" runat="server" OnClick="cmdInitialTarget_OnClick" />
    <asp:Button ID="cmdStatusChange" runat="server" OnClick="cmdStatusChange_OnClick" />
    <asp:HiddenField runat="server" ID="txtTargetContext" Value=""/>
    <input runat="server" id="txtShowFilter" enableviewstate="true" type="hidden" />
    <asp:HiddenField runat="server" ID="hfIsFormInit" Value="False" EnableViewState="true"/>
    <asp:HiddenField runat="server" ID="txtSelectedTargets" value="" EnableViewState="true" />
    <asp:HiddenField runat="server" ID="txtSelectContext" value="" EnableViewState="true"/>
</div>

<asp:ObjectDataSource 
        ID="TargetsObjectDataSource"
        runat="server"
        TypeName="Sage.SalesLogix.CampaignTarget.TargetsViewDataSource"
        DataObjectTypeName="Sage.SalesLogix.CampaignTarget.TargetView"
        OnObjectCreating="CreateTargetsViewDataSource"
        OnObjectDisposing="DisposeTargetsViewDataSource"
        EnablePaging="true"
        StartRowIndexParameterName="StartRecord"
        MaximumRowsParameterName="MaxRecords"
        SortParameterName="SortExpression"
        SelectMethod="GetData"
        SelectCountMethod="GetDataCount" >
</asp:ObjectDataSource>

<div id="divExternal" runat="server" style="display:none">
    <table border="0" cellpadding="1" cellspacing="0" class="formtable">
        <col width="33%" />
        <col width="33%" />
        <col width="33%" />
        <tr>
            <td>
                <div class="slxlabel alignleft">
                    <asp:Label runat="server" ID="lblExternalDescription" AssociatedControlID="txtExternalDescription"
                        Text="<%$ resources: txtExternalDescription.Caption %>">
                    </asp:Label>
                </div>
                <div class="textcontrol select">
                    <asp:TextBox ID="txtExternalDescription" runat="server"></asp:TextBox>
                </div>
            </td>
            <td>
                <div class="slxlabel alignleft">
                    <asp:Label runat="server" ID="lblExternalLocation" AssociatedControlID="txtExternalLocation"
                        Text="<%$ resources: txtExternalLocation.Caption %>">
                    </asp:Label>
                </div>
                <div class="textcontrol select">
                    <asp:TextBox ID="txtExternalLocation" runat="server"></asp:TextBox>
                </div>
            </td>
            <td>
                <div class="slxlabel alignleft">
                    <asp:Label runat="server" ID="lblExternalNumber" AssociatedControlID="txtExternalNumber"
                        Text="<%$ resources: txtExternalNumber.Caption %>">
                    </asp:Label>
                </div>
                <div class="textcontrol select">
                    <asp:TextBox ID="txtExternalNumber" runat="server"></asp:TextBox>
                </div>
            </td>
        </tr>
    </table>
</div>

<div id="divDisplayGrid" runat="server">
    <div id="filterDiv" style="display:none" runat="server">
        <table border="0" cellpadding="1" cellspacing="0" class="formtable">
            <col width="8%" />
            <col width="16%" />
            <col width="8%" />
            <col width="18%" />
            <col width="8%" />
            <col width="16%" />
            <col width="10%" />
            <tr>
                <td id="row1col1">
                    <div class="slxlabel alignleft">
                        <asp:Label runat="server" ID="lblShow" Text="<%$ resources: lblShow.Caption %>" />
                    </div>
                </td>
                <td id="row1col2">
                    <div class="slxlabel alignleft">
                        <asp:CheckBox runat="server" ID="chkContacts" Checked="true"
                            CssClass="checkbox" Text="<%$ resources: chkContacts.Caption %>" />
                        <asp:CheckBox runat="server" ID="chkLeads" Checked="true"
                            CssClass="checkbox" Text="<%$ resources: chkLeads.Caption %>" />
                    </div>
                </td>
                <td id="row1col3">
                    <div class="slxlabel alignleft">
                        <asp:CheckBox runat="server" ID="chkResponded" CssClass="checkbox" Text="<%$ resources: chkResponded.Caption %>" />
                    </div>
                </td>
                <td id="row1col4">
                    <fieldset class="slxlabel radio" style="width: 53%;" >
                        <asp:RadioButtonList runat="server" ID="rdgResponded" RepeatDirection="Horizontal">
                            <asp:ListItem Text="<%$ resources: rdgResponded_Yes.Text %>" Value="<%$ resources: rdgResponded_Yes.Value %>" />
                            <asp:ListItem Text="<%$ resources: rdgResponded_No.Text %>" Value="<%$ resources: rdgResponded_No.Value %>" />
                        </asp:RadioButtonList>
                    </fieldset>
                </td>
                <td id="row1col5">
                    <div class="slxlabel alignleft">
                        <asp:CheckBox runat="server" ID="chkStatus" CssClass="checkbox" Text="<%$ resources: chkStatus.Caption %>" />
                    </div>
                </td>
                <td id="row1col6">
                    <div class="textcontrol select">
                        <asp:ListBox runat="server" ID="lbxStatus" SelectionMode="Single" Width="175px" Rows="1" EnableViewState="true" OnSelectedIndexChanged="lbxStatus_SelectedIndexChanged"></asp:ListBox>
                    </div>
                </td>
                <td id="row1col7">
                    &nbsp;</td>
            </tr>
            <tr>
                <td id="row2col1">
                    <div class="slxlabel alignleft">
                        <asp:CheckBox runat="server" ID="chkGroup" CssClass="checkbox" Text="<%$ resources: chkGroup.Caption %>" />
                    </div>
                </td>
                <td id="row2col2">
                    <div class="textcontrol select">
                        <asp:ListBox runat="server" ID="lbxGroups" SelectionMode="Single" Width="175px" Rows="1"
                            OnSelectedIndexChanged="lbxGroups_OnSelectedIndexChanged" EnableViewState="true">
                        </asp:ListBox>
                    </div>
                </td>
                <td id="row2col3">
                    <div class="slxlabel alignleft">
                        <asp:CheckBox runat="server" ID="chkPriority" CssClass="checkbox" Text="<%$ resources: chkPriority.Caption %>" EnableViewState="true" />
                    </div>
                </td>
                <td id="row2col4">
                    <div class="textcontrol select">
                        <asp:ListBox runat="server" ID="lbxPriority" SelectionMode="Single" Width="175px" Rows="1"
                            OnSelectedIndexChanged="lbxPriority_OnSelectedIndexChanged" EnableViewState="true">
                        </asp:ListBox>
                    </div>
                </td>
                <td id="row2col5">
                    <div class="slxlabel alignleft">
                        <asp:CheckBox runat="server" ID="chkStage" CssClass="checkbox" Text="<%$ resources: chkStage.Caption %>" />
                    </div>
                </td>
                <td id="row2col6">
                    <div class="textcontrol select">
                        <asp:ListBox runat="server" ID="lbxStages" SelectionMode="Single" Width="175px" Rows="1"
                            OnSelectedIndexChanged="lbxStages_OnSelectedIndexChanged" EnableViewState="true">
                        </asp:ListBox>
                    </div>
                </td>
                <td id="row2col7">
                    <asp:Button runat="server" ID="cmdReset" Text="<%$ resources: cmdReset.Caption %>" OnClientClick="ResetFilters()" CssClass="slxbutton" />
                </td>
            </tr>
            <tr>
                <td colspan="7">
                </td>
            </tr>
        </table>
    </div>

    <table border="0" cellpadding="1" cellspacing="0" class="formtable">
        <col width="10%" />
        <col width="10%" />
        <col width="15%" />
        <col width="25%" />
        <col width="20%" />
        <col width="20%" />
        <tr class="mainContentHeader">
            <td id="row3col1" style="height: 26px">
                <div class="slxlabel alignleft">
                    <asp:Button runat="server" ID="cmdSelectAll" OnClick="cmdSelectAll_OnClick" Text="<%$ resources: cmdSelectAll.Caption %>" CssClass="slxbutton" />
                </div>
            </td>
            <td id="row3col2" style="height: 26px;">
                <div class="slxlabel alignleft">
                    <asp:Button runat="server" ID="cmdClearAll" OnClick="cmdClearAll_OnClick" Text="<%$ resources: cmdClearAll.Caption %>" CssClass="slxbutton" />
                </div>
            </td>
            <td id="row3col3" style="height: 26px">
                <div class="slxlabel alignleft">
                    <asp:Button runat="server" ID="cmdSearch" OnClick="Search_OnClick" Text="<%$ resources: cmdSearch.Caption %>" CssClass="slxbutton" />
                </div>
            </td>
            <td id="row3col4" style="height: 26px">
                <div class="slxlabel alignleft">
                    <asp:CheckBox runat="server" ID="chkDisplayOnOpen" CssClass="checkbox" OnCheckedChanged="chkDisplayOnOpen_CheckedChanged"
                        AutoPostBack="true" Text="<%$ resources: chkDisplayOnOpen.Caption %>" />
                </div>
            </td>
            <td style="height: 26px">
                <div class="slxlabel aligncenter">
                    <asp:Button runat="server" ID="cmdSaveAsGroup" OnClick="SaveAsGroup_OnClick" Text="<%$ resources: cmdSaveAsGroup.Caption %>" CssClass="slxbutton" />
                </div>
            </td>
            <td>
                <div class="slxlabel aligncenter">
                    <asp:Label runat="server" ID="lblSearchCount"></asp:Label>
                </div>
            </td>
        </tr>
        <tr>
            <td colspan="6" >
                <SalesLogix:SlxGridView runat="server" ID="grdTargets" GridLines="None" AutoGenerateColumns="false" CellPadding="4"
                    CssClass="datagrid" PagerStyle-CssClass="gridPager" AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt"
                    SelectedRowStyle-CssClass="rowSelected" ShowEmptyTable="true" EnableViewState="false" AllowPaging="true"
                    PageSize="10" OnPageIndexChanging="grdTargetspage_changing" ExpandableRows="False" ResizableColumns="true"
                    EmptyTableRowText="<%$ resources: grdTargets.EmptyTableRowText %>" MinRowHeight="22px" UseSLXPagerTemplate="false"
                    AllowSorting="true" ShowSortIcon="true" OnSorting="grdTargets_Sorting" OnRowCreated="grdTargets_RowCreated" >
                    <Columns>
                        <asp:TemplateField itemstyle-horizontalalign="Center">
                            <headerstyle width="25px" />
                            <ItemTemplate>
                                <asp:CheckBox runat="server" ID="chkSelectTarget" checked='<%# Eval("Selected") %>'></asp:CheckBox>
                            </ItemTemplate>
                        </asp:TemplateField>
                        <asp:BoundField DataField="Name" HeaderText="<%$ resources: grdTargets.Name.ColumnHeading %>" SortExpression="LastName" />
                        <asp:BoundField DataField="Company" HeaderText="<%$ resources: grdTargets.Company.ColumnHeading %>" SortExpression="Company" />
                        <asp:BoundField DataField="GroupName" HeaderText="<%$ resources:grdTargets.Group.ColumnHeading %>" SortExpression="GroupName" />
                        <asp:BoundField DataField="Priority" HeaderText="<%$ resources:grdTargets.Priority.ColumnHeading %>" SortExpression="Priority" />
                        <asp:TemplateField HeaderText="<%$ resources: grdTargets.Initial.ColumnHeading %>" SortExpression="InitialTarget"
                            itemstyle-horizontalalign="Center">
                            <ItemTemplate>
                                <asp:CheckBox runat="server" ID="chkInitialTarget" checked='<%# Eval("Initial") %>'></asp:CheckBox>
                            </ItemTemplate>
                        </asp:TemplateField>                    
                        <asp:TemplateField HeaderText="<%$ resources:grdTargets.Status.ColumnHeading %>" SortExpression="Status">
                            <ItemTemplate>
                                <div style="width:100%">
                                    <asp:DropDownList runat="server" ID="ddlTargetStatus"></asp:DropDownList>
                                </div>
                            </ItemTemplate>
                        </asp:TemplateField>
                        <asp:BoundField DataField="Stage" HeaderText="<%$ resources:grdTargets.Stage.ColumnHeading %>" SortExpression="Stage" />
                        <asp:TemplateField SortExpression="ModifyDate" HeaderText="<%$ resources:grdTargets.LastUpdate.ColumnHeading %>" >
                            <ItemTemplate>
                                <SalesLogix:DateTimePicker runat="server" ID="dteModifyDate" DisplayTime="False" DisplayMode="AsText"
                                    DateOnly="True" DateTimeValue='<%# Eval("ModifyDate") %>' >
                                </SalesLogix:DateTimePicker>
                            </ItemTemplate>
                        </asp:TemplateField>
                        <asp:TemplateField SortExpression="ResponseDate" HeaderText="<%$ resources:grdTargets.LastResponse.ColumnHeading %>" >
                            <ItemTemplate>
                                <SalesLogix:DateTimePicker runat="server" ID="dteResponseDate" DisplayTime="False" DisplayMode="AsText"
                                    DateOnly="True" DateTimeValue='<%# Eval("ResponseDate") %>' >
                                </SalesLogix:DateTimePicker>
                            </ItemTemplate>
                        </asp:TemplateField>
                        <asp:BoundField DataField="TargetType" HeaderText="<%$ resources:grdTargets.Type.ColumnHeading %>"
                            SortExpression="TargetType" />
                        <asp:BoundField DataField="TargetId" Visible="false" />
                        <asp:BoundField DataField="ResponseId" Visible="false" />
                        <asp:BoundField DataField="EntityId" Visible="false" />
                    </Columns>
                    <PagerSettings Mode="NumericFirstLast" FirstPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Start_16x16" 
                        LastPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=End_16x16" />
                </SalesLogix:SlxGridView>
            </td>
        </tr>
    </table>
</div>