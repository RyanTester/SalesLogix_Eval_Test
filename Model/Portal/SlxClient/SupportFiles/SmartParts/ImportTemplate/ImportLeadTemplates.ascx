<%@ Control Language="C#" AutoEventWireup="true" CodeFile="ImportLeadTemplates.ascx.cs" Inherits="ImportLeadTemplates" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>

<div style="display:none">
    <asp:Panel ID="pnlImportLeadTemplate_LTools" runat="server"></asp:Panel>
    <asp:Panel ID="pnlImportLeadTemplate_CTools" runat="server"></asp:Panel>
    <asp:Panel ID="pnlImportLeadTemplate_RTools" runat="server">
        <SalesLogix:PageLink ID="lnkImportSaveTemplateHelp" runat="server" LinkType="HelpFileName" ToolTip="<%$ resources: Portal, Help_ToolTip %>" 
            Target="Help" NavigateUrl="leadimportsavetemplate.aspx" ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16">
        </SalesLogix:PageLink>
    </asp:Panel>
</div>

<table border="0" cellpadding="1" cellspacing="0" class="formtable">
    <col width="50%" /><col width="50%" />
    <tr>
        <td colspan="2" >
            <span class="lbl">
                <asp:Label ID="txtDescription_lz" AssociatedControlID="txtDescription" runat="server" 
                    Text="<%$ resources: txtDescription.Caption %>">
                </asp:Label>
            </span> 
            <span class="textcontrol">
                <asp:TextBox runat="server" ID="txtDescription" />
            </span>
        </td>
    </tr>
    <tr>
        <td colspan="2" >
            <span >
                <hr />
            </span>
        </td>
    </tr>
    <tr>
        <td >
            <span class="slxlabel">
                <asp:Label ID="lblTemplates_lz" AssociatedControlID="lblTemplates" runat="server" 
                    Text="<%$ resources: lblTemplates.Caption %>">
                </asp:Label>
            </span> 
            <span >
                <asp:Label runat="server" ID="lblTemplates" />
            </span>
        </td>
    </tr>    
    <tr>
        <td colspan="2" style="padding-right:5px">
            <span >
                <SalesLogix:SlxGridView runat="server" ID="grdTemplates" GridLines="None" ShowEmptyTable="true" EnableViewState="false"
                    AutoGenerateColumns="false" CellPadding="4" CssClass="datagrid" PagerStyle-CssClass="gridPager" ResizableColumns="True"
                    AlternatingRowStyle-CssClass="rowdk" RowStyle-CssClass="rowlt" SelectedRowStyle-CssClass="rowSelected" DataKeyNames="Id"
                    OnRowDataBound="grdTemplates_RowDataBound" OnRowDeleting="grdTemplates_RowDeleting" OnRowCommand="grdTemplates_RowCommand"
                    ExpandableRows="True" EmptyTableRowText="<%$ resources: grdTemplates.EmptyTableRowText %>" >
                    <Columns>
                        <asp:ButtonField CommandName="Delete" Text="<%$ resources: grdTemplates.Delete.Text %>" />
                        <asp:BoundField DataField="TemplateName" HeaderText="<%$ resources: grdTemplates.Description.ColumnHeading %>" />
                        
                        <asp:TemplateField   HeaderText="<%$ resources: grdTemplates.CreatedBy.ColumnHeading %>" >
                          <itemtemplate>
                             <SalesLogix:SlxUserControl runat="server" ID="slxCreateUser" DisplayMode="AsText" LookupResultValue='<%# Eval("CreateUser")  %>' CssClass=""  />
                          </itemtemplate>
                        </asp:TemplateField>                        
                        
                        <asp:TemplateField HeaderText="<%$ resources: grdTemplates.CreateDate.ColumnHeading %>">
                          <ItemTemplate>
                             
                             <SalesLogix:DateTimePicker runat="server" ID="dtpCreateDate" Enabled="true" DisplayTime="true" Timeless="false" DisplayMode="AsText" AutoPostBack="false" DateTimeValue='<%#Eval("CreateDate") %>'></SalesLogix:DateTimePicker>
                             
                          </ItemTemplate>   
                        </asp:TemplateField>          
                                      
                        
                        <asp:TemplateField  HeaderText="<%$ resources: grdTemplates.ModifyUser.ColumnHeading %>" >
                          <itemtemplate>
                             <SalesLogix:SlxUserControl runat="server" ID="slxModifyUser" DisplayMode="AsText" LookupResultValue='<%# Eval("ModifyUser")  %>' CssClass=""  />
                          </itemtemplate>
                        </asp:TemplateField>
                        
                        <asp:TemplateField HeaderText="<%$ resources: grdTemplates.ModifyDate.ColumnHeading %> ">
                          <ItemTemplate>
                             
                             <SalesLogix:DateTimePicker runat="server" ID="dtpModifyDate" Enabled="true" DisplayTime="true" Timeless="false" DisplayMode="AsText" AutoPostBack="false"  DateTimeValue=' <%# Eval("ModifyDate") %>'></SalesLogix:DateTimePicker>
                             
                          </ItemTemplate>   
                        </asp:TemplateField>
                        
                    </Columns>
                </SalesLogix:SlxGridView>
            </span>
        </td>
    </tr>
</table>
<div style="padding: 10px 10px 0px 10px; text-align: right;">
     <asp:Button runat="server" ID="btnSave" CssClass="slxbutton" ToolTip="<%$ resources: cmdSave.Caption %>" Text="<%$ resources: cmdSave.Caption %>"  style="width:70px; margin: 0 5px 0 0;" />  
     <asp:Button runat="server" ID="btnCancel" CssClass="slxbutton" ToolTip="<%$ resources: cmdCancel.Caption %>" Text="<%$ resources: cmdCancel.Caption %>" style="width:70px;" />  
</div>