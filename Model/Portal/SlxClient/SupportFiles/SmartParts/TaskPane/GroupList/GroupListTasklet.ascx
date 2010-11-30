<%@ Control Language="C#" AutoEventWireup="true" CodeFile="GroupListTasklet.ascx.cs" Inherits="SmartParts_TaskPane_GroupList_GroupListTasklet" %>
<div style="display:none">
    <asp:Panel ID="GroupListTasklet_RTools" runat="server">
           
    </asp:Panel>
</div>
<style>
    .group-list .x-grid3-header {
        display:none;
    }    
    
    .group-list,
    .group-list .x-panel,
    .group-list .x-panel-bwrap,
    .group-list .x-panel-body,
    .group-list .x-resizable-proxy,
    .group-list .x-resizable-handle   
    {    
    	min-height: 0;	
    	/*
    	min-height: 0; 
    	_height: 1%;    	
    	*/
    }
    
    .group-list .task-pane-item-bwrap
    {
    	padding: 4px 0px 0px 0px;
    }
    
    .group-list .group-list-panel
    {   
    	_overflow: hidden; 	
    	border-top: solid 1px #DDDDDD;
    }
    
    .group-list .x-resizable-handle 
    {
    	
    } 
    
    .group-list 
    {
    	position: relative;
    }
    
    .group-list .task-pane-item-header
    {

    }    
    
    .group-list .x-resizable-over
    {
    	_overflow: hidden;
    }    
     
</style>
<div id="<%= ClientID %>">

</div>
<script type="text/javascript">
var <%= ID %>;
$(document).ready(function(){
    if (!<%= ID %>) {
        <%= ID %> = new Sage.TaskPane.GroupListTasklet({
            id: '<%= ID %>',
            clientId: '<%= ClientID %>',
            keyAlias: '<%= KeyAlias %>',
            columnAlias: '<%= ColumnAlias %>',
            columnDisplayName: '<%= ColumnDisplayName %>',
            entityDisplayName: '<%= EntityDisplayName %>'
        });
        <%= ID %>.init();     
    }    
});
</script>