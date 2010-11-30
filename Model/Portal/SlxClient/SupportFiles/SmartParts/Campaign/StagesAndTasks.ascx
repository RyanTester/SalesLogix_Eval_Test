<%@ Control Language="C#" AutoEventWireup="true" CodeFile="StagesAndTasks.ascx.cs" Inherits="SmartParts_StagesAndTasks" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>

<div style="display:none">
 <asp:Panel ID="Stages_LTools" runat="server"></asp:Panel>
 <asp:Panel ID="Stages_CTools" runat="server"></asp:Panel>
 <asp:Panel ID="Stages_RTools" runat="server">
        <asp:ImageButton runat="server" ID="btnAddStage" ToolTip="Add Stage" meta:resourcekey="btnAddStage" 
            ImageUrl="~\images\icons\plus_16X16.gif"  />
        <SalesLogix:PageLink ID="lnkStageTaskHelp" runat="server" LinkType="HelpFileName"
        ToolTip="<%$ resources: Portal, Help_ToolTip %>" Target="Help" NavigateUrl="campaignstagestaskstab.aspx"
        ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16">
    </SalesLogix:PageLink>
 </asp:Panel>
  
</div>
          
             <SalesLogix:SlxGridView runat="server" 
              ID="grdStages" 
              GridLines="None"
              AutoGenerateColumns="False" 
              CellPadding="4" 
              CssClass="datagrid"
              AlternatingRowStyle-CssClass="rowdk" 
              RowStyle-CssClass="rowlt" 
              ShowEmptyTable="true"
              EmptyTableRowText="<%$ resources: grdStages.EmptyTableRowText %>"
              OnRowDataBound="grdStages_RowDataBound"
              OnRowCommand="grdStages_RowCommand" 
              OnRowEditing="grdStages_RowEditing"
              OnRowDeleting="grdStages_RowDeleting"
              DataKeyNames="Id" 
              EnableViewState="false"
              ExpandableRows="false"
              ResizableColumns="true"
              
              >
              <Columns>
                <asp:BoundField DataField="Description" HeaderText="<%$ resources: grdStages.Description.ColumnHeading %>" />
                <asp:BoundField DataField="Status" HeaderText="<%$ resources: grdStages.Status.ColumnHeading %>" />
                <asp:BoundField DataField="Priority" HeaderText="<%$ resources: grdStages.Priority.ColumnHeading %>" />
                <asp:TemplateField HeaderText="<%$ resources: grdStages.NeededDate.ColumnHeading %>">
                  <ItemTemplate>
                     <SalesLogix:DateTimePicker runat="server" ID="dtpNeededDate" Enabled="true" DisplayDate="true" DisplayTime="false" Timeless="True" DisplayMode="AsText" AutoPostBack="false"></SalesLogix:DateTimePicker>
                  </ItemTemplate>   
                </asp:TemplateField>
                <asp:TemplateField HeaderText="<%$ resources: grdStages.PercentComplete.ColumnHeading %>">
                  <ItemTemplate>
                    <asp:Label ID="lblPercent" runat="server"></asp:Label>                    
                  </ItemTemplate>
                 </asp:TemplateField>
                <asp:ButtonField CommandName="AddTask" Text="<%$ resources: grdStages.AddTask.RowCommand %>" /> 
                <asp:ButtonField CommandName="Edit" Text="<%$ resources: grdStages.EditStage.RowCommand %>" /> 
                <asp:ButtonField CommandName="Complete" Text="<%$ resources: grdStages.CompleteStage.RowCommand %>" /> 
                <asp:ButtonField CommandName="Delete" Text="<%$ resources: grdStages.DeleteStage.RowCommand %>" /> 
               </Columns>
             </SalesLogix:SlxGridView>                         
       
