<%@ Control Language="C#" AutoEventWireup="true" CodeFile="CommonTasksTasklet.ascx.cs" Inherits="SmartParts_TaskPane_CommonTasks_CommonTasksTasklet" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Lookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.ScriptResourceProvider" TagPrefix="SalesLogix" %>

<asp:HiddenField ID="hfSelections" runat="server" Value="" />
<asp:UpdatePanel UpdateMode="Conditional" runat="server" ID="SAG">
<ContentTemplate>
<span runat="server" id='selectionDisplay' class="task-pane-item-common-selectioncount"> <span id='selectionCount'>0</span><%# GetLocalResourceObject("EditResponse_DialogCaption").ToString() %> <asp:Label ID='selectionText' runat='server'></asp:Label></span>
 
<ul id="<%= ClientID %>" class="task-pane-item-common-tasklist">
    <asp:Repeater runat="server" ID="items" onitemdatabound="items_ItemDataBound" 
        onitemcommand="items_ItemCommand">
        <ItemTemplate>  
        <asp:LinkButton runat="server" ID="Action" meta:resourcekey="ActionResource1" CausesValidation="False">
            <li id="tsk<%# Eval("Id") %>" class="task-item">
                <span><%# Eval("Name") %></span></li>                
        </asp:LinkButton>     
        </ItemTemplate>
    </asp:Repeater>
    
     <div runat="server" id="divLeadAssignOwner" style="display:none">
    <SalesLogix:OwnerControl runat="server" ID="ownAssignToOwner"></SalesLogix:OwnerControl>
   
</div>
 </ul>
 <asp:Button ID="tskExportToExcel" runat="server" style="display:none;" />
  <script type="text/javascript">
var <%= ID %>;
$(document).ready(function(){
    if (!<%= ID %>)
    {
        <%= ID %> = new Sage.TaskPane.CommonTasksTasklet({
            id: "<%= ID %>",
            clientId: "<%= ClientID %>"        
        });
        <%= ID %>.init();  
    }        
});

<% if (!ScriptManager.GetCurrent(Page).IsInAsyncPostBack) { %>
    $(document).ready(function() { 
        window.LeadAssignOwner = window.<%= ownAssignToOwner.ClientID + "_control" %>;
    });
<% } else { %>
    window.LeadAssignOwner = window.<%= ownAssignToOwner.ClientID + "_control" %>;
<% } %>
</script>
</ContentTemplate>
</asp:UpdatePanel>
<SalesLogix:ScriptResourceProvider ID="CommonTasksResx" runat="server">
    <Keys>
        <SalesLogix:ResourceKeyName Key="ExportToFile_Header" />
        <SalesLogix:ResourceKeyName Key="ExportToFile_OptionTab" />
        <SalesLogix:ResourceKeyName Key="ExportToFile_OptionCSV" />
        <SalesLogix:ResourceKeyName Key="ExportToFile_OptionSaveFormat" />
        <SalesLogix:ResourceKeyName Key="ExportToFile_DialogTitle" />
        <SalesLogix:ResourceKeyName Key="ExportToFile_OK" />
        <SalesLogix:ResourceKeyName Key="ExportToFile_Cancel" />
    </Keys>
</SalesLogix:ScriptResourceProvider>
