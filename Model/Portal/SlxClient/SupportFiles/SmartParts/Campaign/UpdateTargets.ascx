<%@ Control Language="C#" AutoEventWireup="true" CodeFile="UpdateTargets.ascx.cs" Inherits="SmartParts_Campaign_UpdateTargets" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.PickList" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.DependencyLookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Lookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>

<div style="display:none">
    <asp:Panel ID="Form_LTools" runat="server"></asp:Panel>
    <asp:Panel ID="Form_CTools" runat="server"></asp:Panel>
    <asp:Panel ID="Form_RTools" runat="server">
        <SalesLogix:PageLink ID="lnkHelp" runat="server" LinkType="HelpFileName"
            ToolTip="<%$ resources: Portal, Help_ToolTip %>" Target="Help" NavigateUrl="campaignupdatetarget.aspx"
            ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16">
        </SalesLogix:PageLink>
    </asp:Panel>
    <asp:HiddenField runat="server" ID="txtSelectedTargets" value=""/>
    <asp:HiddenField runat="server" ID="txtSelectContext" value=""/>
    <asp:HiddenField runat="server" ID="txtInit" value="F"/>
</div>

<asp:ObjectDataSource 
        ID="TargetsObjectDataSource"
        runat="server"
        TypeName="Sage.SalesLogix.CampaignTarget.TargetsViewDataSource"
        DataObjectTypeName="Sage.SalesLogix.CampaignTarget.TargetView"
        onobjectcreating="CreateTargetsViewDataSource"
        onobjectdisposing="DisposeTargetsViewDataSource"
        EnablePaging="true"
        StartRowIndexParameterName="StartRecord"
        MaximumRowsParameterName="MaxRecords"
        SortParameterName="SortExpression"
        SelectMethod="GetData"
        SelectCountMethod="GetDataCount" >
</asp:ObjectDataSource>

<table id="tblGrid" border="0" cellpadding="1" cellspacing="2" class="formtable">
    <tr>
        <td style="padding-left:10px; padding-right:10px">
            <div style="overflow:auto; height:260px; border: 1px solid #b5cbe0">            
                <SalesLogix:SlxGridView runat="server" ID="grdTargets" GridLines="None" AutoGenerateColumns="False" CellPadding="4"
                    CssClass="datagrid" AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt" ShowEmptyTable="true"  
                    AllowPaging="true" OnRowDataBound="grdTargets_RowDataBound" DataKeyNames="TargetId" EnableViewState="false"
                    PageSize="10" ExpandableRows="true" AllowSorting="true" ShowSortIcon="true" OnSorting="grdTargets_Sorting"
                    ResizableColumns="true" EmptyTableRowText="<%$ resources: grdTargets.EmptyTableRowText %>" >
                    <Columns>
                        <asp:BoundField DataField="Name" HeaderText="<%$ resources: grdTargets.Name.Header %>" SortExpression="LastName" />
                        <asp:BoundField DataField="Company" HeaderText="<%$ resources: grdTargets.Company.Header %>" SortExpression="Company" />
                        <asp:BoundField DataField="TargetType" HeaderText="<%$ resources: grdTargets.Type.Header %>" SortExpression="TargetType" />
                        <asp:BoundField DataField="Status" HeaderText="<%$ resources: grdTargets.Status.Header %>" SortExpression="Status" />
                        <asp:TemplateField HeaderText="<%$ resources: grdTargets.Init.Header %>" itemstyle-horizontalalign="Center"
                            SortExpression="InitialTarget">
                            <ItemTemplate>
                                <asp:CheckBox id="chkInit" runat="server" enabled="false" checked='<%# Eval("Initial") %>'></asp:CheckBox>            
                            </ItemTemplate>
                         </asp:TemplateField>
                         <asp:BoundField DataField="Stage" HeaderText="<%$ resources: grdTargets.Stage.Header %>" SortExpression="Stage"/>
                         <asp:TemplateField HeaderText="<%$ resources: grdTargets.LastUpdated.Header %>" SortExpression="ModifyDate">
                            <itemtemplate>
                                <SalesLogix:DateTimePicker runat="server" ID="dtpLastUpdated" DisplayTime="false" DisplayMode="AsText"/>
                            </itemtemplate>
                        </asp:TemplateField>
                        <asp:TemplateField HeaderText="<%$ resources: grdTargets.ResponseDate.Header %>" SortExpression="ResponseDate">
                            <itemtemplate>
                                <SalesLogix:DateTimePicker runat="server" ID="dtpResponseDateGrid" DisplayTime="false" DisplayMode="AsText"/>
                            </itemtemplate>
                        </asp:TemplateField>
                    </Columns> 
                </SalesLogix:SlxGridView>                         
            </div>
        </td>
    </tr>
</table>

<table id="tblOptions" border="0" cellpadding="1" cellspacing="2" class="formtable">
    <col width ="1" /><col width="1" /><col width="100%" />
    <tr>
        <td>
        </td>
    </tr>
</table>

<table id="tblAssignment" border="0" cellpadding="1" cellspacing="2" class="formtable">
    <col width ="1" /><col width="60%" /><col width="1" /><col width="40%" />
    <tr>
        <td align="left"></td>
        <td>
            <div class="lbl">
                <asp:Label ID="lblUpdateTargets" AssociatedControlID="ddlOptions" runat="server" Text="<%$ resources: lblUpdateTargets.Text %>"></asp:Label>
            </div>
            <div class="textcontrol">
                <asp:DropDownList ID="ddlOptions" runat="server" AutoPostBack="false"></asp:DropDownList>
            </div>
        </td>
        <td align="left"></td>
        <td>
            <div id="opt0" style="display:none" runat="server">
                <div class="lbl">
                    <asp:Label ID="lblToStatus" runat="server" AssociatedControlID="ddlToStatus" Text="<%$ resources: lblTo.Text %>"></asp:Label>
                </div>
                <div class="textcontrol">
                    <asp:DropDownList ID="ddlToStatus" runat="server" AutoPostBack="false"></asp:DropDownList>
                </div>
            </div>
                <div id="opt1" style="display:none" runat="server">
                <div class="lbl">
                    <asp:Label ID="lblToStage" runat="server" AssociatedControlID="ddlTOStage" Text="<%$ resources: lblTo.Text %>"></asp:Label>
                </div>
                <div class="textcontrol">
                    <asp:DropDownList ID="ddlToStage" runat="server" AutoPostBack="false"></asp:DropDownList>
                </div>
            </div>
            <div id="opt2" style="display:none" runat="server" >
                <div class="lbl">
                    <asp:Label ID="lblInitTo" runat="server" Text="<%$ resources: lblTo.Text %>"></asp:Label>
                </div>
                <div>
                    <asp:RadioButtonList id="rdlInitTargets" runat="server">
                        <asp:ListItem Text="<%$ resources: rdlInitTargets.Yes.Item %>" Value="Y"></asp:ListItem>
                        <asp:ListItem Text="<%$ resources: rdlInitTargets.No.Item %>" Value="N"></asp:ListItem>
                    </asp:RadioButtonList>
                </div>
            </div>
        </td>
    </tr>
    <tr>
        <td colspan="4">
            <div id="opt3" style="display:none" runat="server" >
                <table border="0" cellpadding="1" cellspacing="2" class="formtable">
                    <col width="50%" /><col width="50%" />
                    <tr>
                        <td colspan="2" >
                            <hr />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="lbl alignleft">
                                <asp:Label ID="lblResponseDate" AssociatedControlID="dtpResponseDate" runat="server" 
                                    Text="<%$ resources: lblResponseDate.Text %>" >
                                </asp:Label>
                            </div>
                            <div class="textcontrol datepicker" >
                                <SalesLogix:DateTimePicker runat="server" ID="dtpResponseDate" DisplayDate="true" DisplayTime="false" 
                                    Timeless="True" Enabled="true">
                                </SalesLogix:DateTimePicker>
                            </div>
                        </td>
                        <td>
                            <div class="lbl">
                                <asp:Label ID="lblLeadSource" AssociatedControlID="luLeadSource" runat="server"
                                    Text="<%$ resources: lblLeadSource.Text %>">
                                </asp:Label>
                            </div>
                            <div class="textcontrol lookup" >
                                <SalesLogix:LookupControl runat="server" ID="luLeadSource"
                                    LookupEntityTypeName="Sage.Entity.Interfaces.ILeadSource, Sage.Entity.Interfaces, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null" >
                                    <LookupProperties>
                                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: LeadSourceType.PropertyHeader %>"
                                            PropertyName="Type" PropertyFormat="None" UseAsResult="True" ExcludeFromFilters="False">
                                        </SalesLogix:LookupProperty>
                                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: LeadSourceDescription.PropertyHeader %>"
                                            PropertyName="Description" PropertyFormat="None" UseAsResult="True" ExcludeFromFilters="False">
                                        </SalesLogix:LookupProperty>
                                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: LeadSourceAbbrev.PropertyHeader %>"
                                            PropertyName="AbbrevDescription" PropertyFormat="None" UseAsResult="True" ExcludeFromFilters="False">
                                        </SalesLogix:LookupProperty>
                                        <SalesLogix:LookupProperty PropertyHeader="<%$ resources: LeadSourceSourceDate.PropertyHeader %>"
                                            PropertyName="SourceDate" PropertyFormat="None" UseAsResult="True" ExcludeFromFilters="False">
                                        </SalesLogix:LookupProperty>
                                    </LookupProperties>
                                    <LookupPreFilters>
                                        <SalesLogix:LookupPreFilter PropertyName="Status" FilterValue="Active"></SalesLogix:LookupPreFilter>
                                    </LookupPreFilters>
                                </SalesLogix:LookupControl>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>  
                            <div class="lbl">
                                <asp:Label ID="lblResponseMetod" runat="server" AssociatedControlID="ddlResponseMethods"
                                    Text="<%$ resources: lblResponseMetod.Text %>">
                                </asp:Label>
                            </div>
                            <div class="textcontrol">
                                <asp:DropDownList ID="ddlResponseMethods" runat="server" AutoPostBack="false"></asp:DropDownList>
                            </div>
                        </td>
                        <td>
                            <div class="lbl">
                                <asp:Label ID="lblStage" runat="server" AssociatedControlID="ddlStage" Text="<%$ resources: lblStage.Text %>"></asp:Label>
                            </div>
                            <div class="textcontrol">
                                <asp:DropDownList ID="ddlStage" runat="server" AutoPostBack="false"></asp:DropDownList>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="lbl">
                                <asp:Label ID="lblInterest" runat="server" AssociatedControlID="ddlResponseInterests"
                                    Text="<%$ resources: lblInterest.Text %>">
                                </asp:Label>
                            </div>
                            <div class="textcontrol">
                                <asp:DropDownList ID="ddlResponseInterests" runat="server" AutoPostBack="false"></asp:DropDownList>
                            </div>
                        </td>
                        <td>
                            <div class="lbl">
                                <asp:Label ID="lblInterestLevel" runat="server" AssociatedControlID="ddlResponseInterestLevels"
                                    Text="<%$ resources: lblInterestLevel.Text %>">
                                </asp:Label>
                            </div>
                            <div class="textcontrol">
                                <asp:DropDownList ID="ddlResponseInterestLevels" runat="server" AutoPostBack="false"></asp:DropDownList>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <div class="twocollbl">
                                <asp:Label ID="lblComment" AssociatedControlID="txtComment" runat="server" Text="<%$ resources: lblComment.Text %>"></asp:Label>
                            </div>
                            <div class="twocoltextcontrol TEXTAREA" style="width:80%">
                                <asp:TextBox runat="server" ID="txtComment" TextMode="MultiLine" Rows="4" />
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
        </td>
    </tr>  
</table>

<table id="tblButtons" border="0" cellpadding="1" cellspacing="2" class="formtable">
    <col width="99%" /><col width="1" /><col width="1" />
    <tr>
        <td colspan="3" >
            <hr />
        </td>
    </tr>
    <tr>
        <td></td>
        <td align="right">
            <div class="slxButton" style="margin-right:10px">
                <asp:Button ID="cmdUpdate" Text="<%$ resources: cmdUpdate.Text %>" width="100px" runat="server" OnClick="cmdUpdate_OnClick" />
            </div>
        </td>
        <td align="right">
            <div class="slxButton" style="margin-right:40px">
                <asp:Button ID="cmdCancel" Text="<%$ resources: cmdCancel.Text %>" runat="server" width="100px" OnClick="cmdClose_OnClick" />
            </div>
        </td>
    </tr>
</table>
