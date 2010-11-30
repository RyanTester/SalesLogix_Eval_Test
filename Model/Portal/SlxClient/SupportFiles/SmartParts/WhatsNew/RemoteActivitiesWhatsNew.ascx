<%@ Control Language="C#" AutoEventWireup="true" CodeFile="RemoteActivitiesWhatsNew.ascx.cs" Inherits="RemoteActivitiesWhatsNew" %>
<%@ Register Assembly="Sage.SalesLogix.Web" Namespace="Sage.SalesLogix.Web" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>

<div style="display:none">
    <asp:Panel ID="Activities_LTools" runat="server">
        <asp:Image ID="imgActivities" runat="server" ImageUrl="~/images/icons/Task_List_3D_24x24.gif" />
        &nbsp&nbsp
        <asp:Label ID="lblActiviesTitle" runat="server"></asp:Label>
    </asp:Panel>
    <asp:Panel ID="Activities_CTools" runat="server"></asp:Panel>
    <asp:Panel ID="Activities_RTools" runat="server"></asp:Panel>
</div>

<div id="divNewActivities" runat="server">
    <SalesLogix:SlxGridView ID="grdNewActivities" CssClass="datagrid" AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt"
        GridLines="none" runat="server" AutoGenerateColumns="False" DataKeyNames="ActivityId" CellPadding="4" ShowEmptyTable="True"
        AllowPaging="true" AllowSorting="true" PageSize="10" EmptyTableRowText="<%$ resources: grdActivities_EmptyRow %>"
        OnPageIndexChanging="PageIndexChanging" OnSorting="grdActivities_Sorting" EnableViewState="false" ShowSortIcon="true">
        <Columns>
            <asp:BoundField DataField="ActivityId" Visible="false" />
            <asp:TemplateField>
                <ItemTemplate>
                    <img id="imgType" runat="Server" src='<%# GetImage(Eval("Type")) %>' alt='<%# GetAlternateText(Eval("Type")) %>' />
                </ItemTemplate>
            </asp:TemplateField>
            <asp:TemplateField HeaderText="<%$ resources: grdActivities_Type_ColumnHeader %>" SortExpression="Type" >
                <ItemTemplate>
                    <asp:Label id="lblType" runat="Server" ToolTip='<%# GetAlternateText(Eval("Type")) %>' Text='<%# GetAlternateText(Eval("Type")) %>' />
                </ItemTemplate>
            </asp:TemplateField>
            <asp:TemplateField HeaderText="<%$ resources: grdActivities_ScheduleDate_ColumnHeader %>" HeaderStyle-Width="100px" SortExpression="ScheduledDate">
                <ItemTemplate>
                    <SalesLogix:DateTimePicker id="dteScheduleDate" Runat="Server" DisplayMode="AsText" DisplayTime="False" Timeless="true" DateTimeValue='<%# Eval("ScheduleDate") %>' />
                </ItemTemplate>
            </asp:TemplateField>
            <asp:BoundField DataField="Account" SortExpression="Account" HeaderText="<%$ resources: grdActivities_Account_ColumnHeader %>" />
            <asp:BoundField DataField="Contact" SortExpression="Contact" HeaderText="<%$ resources: grdActivities_Contact_ColumnHeader %>" />
            <asp:BoundField DataField="Regarding" HeaderText="<%$ resources: grdActivities_Regarding_ColumnHeader %>" SortExpression="Regarding"/>
            <asp:BoundField DataField="ScheduleFor" HeaderText="<%$ resources: grdActivities_ScheduleFor_ColumnHeader %>" SortExpression="ScheduleFor"/>
            <asp:BoundField DataField="AddedBy" HeaderText="<%$ resources: grdActivities_AddedBy_ColumnHeader %>" SortExpression="AddedBy"/>
            <asp:TemplateField HeaderText="<%$ resources: grdActivities_DateAdded_ColumnHeader %>" HeaderStyle-Width="100px" SortExpression="DateAdded">
                <ItemTemplate>
                    <SalesLogix:DateTimePicker id="dteDateAdded" Runat="Server" DisplayMode="AsText" DisplayTime="False" Timeless="true" DateTimeValue='<%# Eval("DateAdded") %>' />
                </ItemTemplate>
            </asp:TemplateField>
        </Columns>
        <PagerStyle CssClass="gridPager" />
        <PagerSettings Mode="NumericFirstLast" FirstPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Start_16x16" LastPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=End_16x16" />
    </SalesLogix:SlxGridView>
</div>

<div id="divUpdatedActivities" runat="server" style="display:none">
    <SalesLogix:SlxGridView ID="grdUpdatedActivities" CssClass="datagrid" AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt"
        GridLines="none" runat="server" AutoGenerateColumns="False" DataKeyNames="ActivityId" CellPadding="4" ShowEmptyTable="True"
        AllowPaging="true" AllowSorting="true" PageSize="10" EmptyTableRowText="<%$ resources: grdActivities_EmptyRow %>"
        OnPageIndexChanging="PageIndexChanging" OnSorting="grdActivities_Sorting" EnableViewState="false" ShowSortIcon="true">
        <Columns>
            <asp:BoundField DataField="ActivityId" Visible="false" />
            <asp:TemplateField>
                <ItemTemplate><img id="imgType" runat="Server" src='<%# GetImage(Eval("Type")) %>' alt='<%# GetAlternateText(Eval("Type")) %>' onclick='<%# GetActivityLink(Eval("ActivityId"))  %>' /></ItemTemplate>
            </asp:TemplateField>
            <asp:BoundField DataField="Type" HeaderText="<%$ resources: grdActivities_Type_ColumnHeader %>" SortExpression="Type"/>
            <asp:TemplateField HeaderText="<%$ resources: grdActivities_ScheduleDate_ColumnHeader %>" HeaderStyle-Width="100px" SortExpression="ScheduledDate">
                <ItemTemplate>
                    <SalesLogix:DateTimePicker id="dteScheduleDate" Runat="Server" DisplayMode="AsText" DisplayTime="False" Timeless="true" DateTimeValue='<%# Eval("ScheduleDate") %>' />
                </ItemTemplate>
            </asp:TemplateField>
            <asp:BoundField DataField="Account" SortExpression="Account" HeaderText="<%$ resources: grdActivities_Account_ColumnHeader %>" />
            <asp:BoundField DataField="Contact" SortExpression="Contact" HeaderText="<%$ resources: grdActivities_Contact_ColumnHeader %>" />
            <asp:BoundField DataField="ChangedField" HeaderText="<%$ resources: grdUpdatedActivities_ChangedField_ColumnHeader %>" SortExpression="ChangedField"/>
            <asp:BoundField DataField="ChangedFrom" HeaderText="<%$ resources: grdUpdatedActivities_ChangedFrom_ColumnHeader %>" SortExpression="ChangedFrom"/>
            <asp:BoundField DataField="ChangedTo" HeaderText="<%$ resources: grdUpdatedActivities_ChangedTo_ColumnHeader %>" SortExpression="ChangedTo"/>
            <asp:BoundField DataField="ChangedBy" HeaderText="<%$ resources: grdUpdatedActivities_ChangedBy_ColumnHeader %>" SortExpression="ChangedBy"/>
            <asp:TemplateField HeaderText="<%$ resources: grdUpdatedActivities_ChangedDate_ColumnHeader %>" HeaderStyle-Width="100px" SortExpression="ChangeDate">
                <ItemTemplate>
                    <SalesLogix:DateTimePicker id="dteChangedDate" Runat="Server" DisplayMode="AsText" DisplayTime="False" Timeless="true" DateTimeValue='<%# Eval("ChangedDate") %>' />
                </ItemTemplate>
            </asp:TemplateField>
        </Columns>
        <PagerStyle CssClass="gridPager" />
        <PagerSettings Mode="NumericFirstLast" FirstPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Start_16x16" LastPageImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=End_16x16" />
    </SalesLogix:SlxGridView>
</div>
