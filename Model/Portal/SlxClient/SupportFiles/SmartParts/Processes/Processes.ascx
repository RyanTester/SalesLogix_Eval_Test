<%@ Control Language="C#" AutoEventWireup="true" CodeFile="Processes.ascx.cs" Inherits="SmartParts_Processes_Processes" %>
<%@ Register Assembly="Sage.SalesLogix.Web" Namespace="Sage.SalesLogix.Web" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls"
    TagPrefix="SalesLogix" %>
<%@ Register Assembly="System.Web.Extensions, Version=3.5.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35"
    Namespace="System.Web.UI" TagPrefix="asp" %>
<%@ Register Assembly="Sage.SalesLogix.Client.GroupBuilder" Namespace="Sage.SalesLogix.Client.GroupBuilder" TagPrefix="SalesLogix" %>

<asp:Button ID="btnChangeStatus" runat="server" Text="" style="display:none;" OnClick="btnChangeStatus_Click" />
<asp:HiddenField ID="hfCurrentId" runat="server" />
<asp:HiddenField ID="hfAction" runat="server" />

<div style="display:none">
    <asp:Panel ID="Processes_LTools" runat="server">
    </asp:Panel>
    <asp:Panel ID="Processes_CTools" runat="server">
    </asp:Panel>
    <asp:Panel ID="Processes_RTools" runat="server">
        <asp:ImageButton runat="server" ID="btnSchedPrc" OnClick="cmdSchedProcess_Click" ToolTip="<%$ resources: grdProcesses.SchedPrc %>" 
            ImageUrl="~/images/icons/plus_16x16.gif" />
        <SalesLogix:PageLink ID="lnkProcessesHelp" runat="server" LinkType="HelpFileName"
            ToolTip="<%$ resources: Portal, Help_ToolTip %>" Target="Help" NavigateUrl="processstatus"
            ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16">
        </SalesLogix:PageLink>
    </asp:Panel>
</div>

<div id="grdAttach">
    <SalesLogix:SlxGridView ID="SlxGridView1" CssClass="datagrid" AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt" GridLines="none" 
        runat="server" AutoGenerateColumns="False" ForeColor="#333333" DataKeyNames="Id" CellPadding="4" ShowEmptyTable="True" 
        AllowPaging="true" AllowSorting="true" PageSize="25" EmptyTableRowText="<%$ resources: grdProcesses.EmptyTableRowText %>" 
        OnPageIndexChanging="PageIndexChanging" OnSorting="Sorting" EnableViewState="false" >
        <Columns>
            <asp:BoundField DataField="Name" HeaderText="<%$ resources: grdProcesses.Process %>" SortExpression="Name" />

            <asp:TemplateField SortExpression="LFName" HeaderText="<%$ resources: grdProcesses.Contact %>">
                <ItemTemplate>
                    <SalesLogix:PageLink ID="Link2" runat="server" LinkType="EntityAlias" Text='<%# Eval("Contact.LastName") + ", " + Eval("Contact.FirstName") %>'
                        NavigateUrl="contact" EntityId='<%# Eval("Contact.Id") %>' ></SalesLogix:PageLink>
                </ItemTemplate>
            </asp:TemplateField>

            <asp:TemplateField HeaderText="<%$ resources: grdProcesses.LastAction %>" SortExpression="LastAction">
                <ItemTemplate>
                    <SalesLogix:DateTimePicker id="ladate" Runat="Server" DisplayMode="AsText" DisplayTime="True" DateTimeValue=<%# Eval("LastAction") %> />
                </ItemTemplate>
            </asp:TemplateField>

            <asp:TemplateField HeaderText="<%$ resources: grdProcesses.NextAction %>" SortExpression="NextAction">
                <ItemTemplate>
                    <SalesLogix:DateTimePicker id="nadate" Runat="Server" DisplayMode="AsText" DisplayTime="True" DateTimeValue=<%# Eval("NextAction") %> />
                </ItemTemplate>
            </asp:TemplateField>

            <asp:TemplateField HeaderText="<%$ resources: grdProcesses.Susp %>" SortExpression="Suspended" >
                <itemtemplate>
                    <asp:Label runat="server" Text='<%# ((int)(Eval("Suspended")??0)!=0) ? GetLocalResourceObject("Yes_rsc").ToString() : GetLocalResourceObject("No_rsc").ToString() %>'></asp:Label>
                 </itemtemplate>
            </asp:TemplateField>

            <asp:TemplateField SortExpression="C.S." HeaderText="<%$ resources: grdProcesses.ChangeStatus %>">
                <ItemTemplate>
                    <asp:Label runat="server" ID="txt1" Visible=<%# !IsRedVisible() %> Text=<%# GetStatusText() %> />

                    <asp:HyperLink ID="HyperLink1" runat="server" Target="_top" Width="16px" Visible='<%# IsGreenVisible() %>' NavigateUrl='<%# BuildProcessesNavigateURL(Eval("Id"),"Resume") %>'>
					    <asp:Image ID="Resume" runat="server" ToolTip="<%$ resources: grdProcesses.Resume %>" ImageAlign="AbsMiddle"
					        ImageUrl="~/images/greendot.gif" />&nbsp;
				    </asp:HyperLink>
                    
                    <asp:HyperLink ID="HyperLink2" runat="server" Target="_top" Width="16px" Visible='<%# IsYellowVisible() %>' NavigateUrl='<%# BuildProcessesNavigateURL(Eval("Id"),"Suspend") %>'>
					    <asp:Image ID="Suspend" runat="server" ToolTip="<%$ resources: grdProcesses.Suspend %>" ImageAlign="AbsMiddle"
					        AlternateText="<%$ resources: grdProcesses.Suspend %>" ImageUrl="~/images/yellowdot.gif" />&nbsp;
				    </asp:HyperLink>

                    <asp:HyperLink ID="HyperLink3" runat="server" Target="_top" Width="16px" Visible='<%# IsRedVisible() %>' NavigateUrl='<%# BuildProcessesNavigateURL(Eval("Id"),"Abort") %>'>
					    <asp:Image ID="Abort" runat="server" ToolTip="<%$ resources: grdProcesses.Abort %>" ImageAlign="AbsMiddle"
					        AlternateText="<%$ resources: grdProcesses.Suspend %>" ImageUrl="~/images/reddot.gif" />&nbsp;
				    </asp:HyperLink>
                </ItemTemplate>
            </asp:TemplateField>
        </Columns>
        <RowStyle CssClass="rowlt" />
        <AlternatingRowStyle CssClass="rowdk" />
    </SalesLogix:SlxGridView>
</div>
