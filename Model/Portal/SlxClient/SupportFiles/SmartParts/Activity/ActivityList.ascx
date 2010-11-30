<%@ Control Language="C#" AutoEventWireup="true" CodeFile="activitylist.ascx.cs" Inherits="SmartParts_ActivityList" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.Platform.WebPortal" Namespace="Sage.Platform.WebPortal.SmartParts" TagPrefix="SalesLogix" %>

<div style="display:none">

<asp:Panel ID="ActivityList_LTools" runat="server" />
<asp:Panel ID="ActivityList_CTools" runat="server" />
<SalesLogix:SmartPartToolsContainer runat="server" ID="ActivityList_RTools">
    <asp:ImageButton runat="server" ID="AddMeeting"  ToolTip="<%$ resources: AddMeeting.ToolTip %>" ImageUrl="~/images/icons/Schedule_Meeting_16x16.gif"  />
    <asp:ImageButton runat="server" ID="AddPhoneCall"  ToolTip="<%$ resources: AddPhoneCall.ToolTip %>" ImageUrl="~/images/icons/Schedule_Call_16x16.gif" />
    <asp:ImageButton runat="server" ID="AddToDo" ToolTip="<%$ resources: AddToDo.ToolTip %>" ImageUrl="~/images/icons/Schdedule_To_Do_16x16.gif"  />
    <SalesLogix:PageLink ID="lnkActivityListHelp" runat="server" LinkType="HelpFileName"
        ToolTip="<%$ resources: Portal, Help_ToolTip %>" Target="Help" NavigateUrl="activitiestab.aspx"
        ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16">
    </SalesLogix:PageLink>
</SalesLogix:SmartPartToolsContainer>

</div>

<SalesLogix:SlxGridView ID="ActivityGrid" runat="server" AutoGenerateColumns="False" EnableViewState="false" CellPadding="4"
    ForeColor="#333333" GridLines="None" CssClass="datagrid" EmptyTableRowText="<%$ resources: ActivityGrid.EmptyTableRowText %>" 
    ShowEmptyTable="true" AllowPaging="true" PageSize="10" AllowSorting="true">
    <Columns>
        
        <asp:TemplateField HeaderText="<%$ resources: ActivityGrid.Columns.Complete.HeaderText %>">
           <itemtemplate>
                <asp:HyperLink ID="CompleteActivity" runat="server" Target="_top" Width="65px" 
                    NavigateUrl='<%# BuildCompleteActivityNavigateURL(Eval("ActivityID")) %>' 
                    Text="<%$ resources: ActivityGrid.Columns.Complete.HeaderText %>">
				</asp:HyperLink>
		    </itemtemplate>
        </asp:TemplateField>
        
        <asp:TemplateField HeaderText="<%$ resources: ActivityGrid.Columns.Type.HeaderText %>" SortExpression="Type">
           <itemtemplate>
                <asp:HyperLink ID="HyperLink1" runat="server" Target="_top" 
                    NavigateUrl='<%# BuildActivityNavigateURL(Eval("ActivityID")) %>'>
					<img alt='<%# GetToolTip(Eval("Type")) %>' style="vertical-align:middle;" 
					    src='<%# GetImage(Eval("Type")) %>' />&nbsp;<%# GetToolTip(Eval("Type")) %>
				</asp:HyperLink>
		    </itemtemplate>
        </asp:TemplateField>
        
        <asp:TemplateField HeaderText="<%$ resources: ActivityGrid.Columns.StartDate.HeaderText %>" SortExpression="StartDate">
            <ItemTemplate>
                <%# GetLocalDateTime(Eval("StartDate"), Eval("TimeLess"))%>
            </ItemTemplate>
        </asp:TemplateField>
        
        <asp:TemplateField HeaderText="<%$ resources: ActivityGrid.Columns.Duration.HeaderText %>" SortExpression="Duration" >
            <ItemTemplate>
                <%# GetDuration(Eval("Timeless")) %>
            </ItemTemplate>
            <ItemStyle Width="60px" HorizontalAlign="Center" />
        </asp:TemplateField>
        
        <asp:BoundField DataField="Leader" HeaderText="<%$ resources: ActivityGrid.Columns.Leader.HeaderText %>" SortExpression="Leader" />
        
        <asp:BoundField DataField="ContactName" HeaderText="<%$ resources: ActivityGrid.Columns.ContactName.HeaderText %>" 
            SortExpression="ContactName">
            <ItemStyle Width="150px" />
        </asp:BoundField>
        
        <asp:BoundField DataField="Description" HeaderText="<%$ resources: ActivityGrid.Columns.Description.HeaderText %>" 
            SortExpression="Description" />
        
        <asp:BoundField DataField="Category" HeaderText="<%$ resources: ActivityGrid.Columns.Category.HeaderText %>" 
            SortExpression="Category" />
        
         <asp:BoundField DataField="OpportunityName" HeaderText="<%$ resources: ActivityGrid.Columns.OpportunityName.HeaderText %>" 
            SortExpression="OpportunityName" Visible="false" >
            <ItemStyle Width="150px" />
        </asp:BoundField>
        
        <asp:BoundField DataField="Notes" HeaderText="<%$ resources: ActivityGrid.Columns.Notes.HeaderText %>" 
            SortExpression="Notes" Visible="false" />
        
    </Columns>
    <RowStyle CssClass="rowlt" />
    <SelectedRowStyle BackColor="Highlight" />
    <AlternatingRowStyle CssClass="rowdk" />
    <FooterStyle BackColor="#5D7B9D" Font-Bold="True" ForeColor="White" />
</SalesLogix:SlxGridView>
