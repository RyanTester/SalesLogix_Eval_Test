<%@ Control Language="C#" AutoEventWireup="true" CodeFile="ActivityQueue.ascx.cs" Inherits="SmartParts_Activity_ActivityQueue" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>


<div style="height:300px;overflow:scroll;width:99.9%;">
<SalesLogix:SlxGridView runat="server" ID="ActivityGrid" GridLines="None" AutoGenerateColumns="False" CellPadding="4" CssClass="datagrid"
AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt" ShowEmptyTable="True" EmptyTableRowText="No records match the selection criteria." 
meta:resourcekey="ActivitiesGrid_rsc" DataKeyNames="Id" EnableViewState="False" OnRowDataBound="ActivityGrid_RowDataBound" >
<Columns>
        <asp:TemplateField SortExpression="Type" meta:resourcekey="ActivitiesGrid_Header_Type" HeaderText="Type">
            <itemtemplate>
                <asp:HyperLink ID="HyperLink1" runat="server" Target="_top" Width="100px" NavigateUrl=''>
									<img alt="Activity Type" style="vertical-align:middle;" src='<%# DataBinder.Eval(Container.DataItem, "TypeImage") %>' />&nbsp;<%# DataBinder.Eval(Container.DataItem, "Type") %>
				</asp:HyperLink>
            </itemtemplate></asp:TemplateField>
        <asp:BoundField DataField="StartDate" HeaderText="Date/Time" SortExpression="StartDate" meta:resourcekey="ActivitiesGrid_Header_StartDate" >
            <itemstyle width="145px" />
        </asp:BoundField>
        <asp:BoundField DataField="ContactName" HeaderText="Contact Name" SortExpression="ContactName" meta:resourcekey="ActivitiesGrid_Header_ContactName" >
            <itemstyle width="120px" />
        </asp:BoundField>
        <asp:BoundField DataField="AccountName" HeaderText="Account Name" SortExpression="AccountName" meta:resourcekey="ActivitiesGrid_Header_AccountName" >
            <itemstyle width="120px" />
        </asp:BoundField>
        <asp:BoundField DataField="Description" HeaderText="Regarding" SortExpression="Description" meta:resourcekey="ActivitiesGrid_Header_Description" >
        </asp:BoundField>
        <asp:BoundField DataField="Priority" HeaderText="Priority" SortExpression="Priority" meta:resourcekey="ActivitiesGrid_Header_Priority" />
        <asp:BoundField DataField="Notes" HeaderText="Notes" SortExpression="Notes" meta:resourcekey="ActivitiesGrid_Header_Notes" >
        </asp:BoundField>
        <asp:BoundField DataField="SchedFor" HeaderText="Sched For" SortExpression="SchedFor" meta:resourcekey="ActivitiesGrid_Header_SchedFor" >
            <itemstyle width="100px" />
        </asp:BoundField>
    </Columns>
    <RowStyle BackColor="#F7F6F3" ForeColor="#333333" CssClass="rowdk" />
    <EditRowStyle BackColor="#999999" />
    <SelectedRowStyle BackColor="#E2DED6" Font-Bold="True" ForeColor="#333333" />
    <PagerStyle BackColor="#284775" ForeColor="White" HorizontalAlign="Center" />
    <HeaderStyle BackColor="#5D7B9D" Font-Bold="True" ForeColor="White" />
    <AlternatingRowStyle BackColor="White" ForeColor="#284775" CssClass="rowlt" />
</SalesLogix:SlxGridView>
</div>