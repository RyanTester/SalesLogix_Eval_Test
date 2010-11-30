<%@ Control Language="C#" AutoEventWireup="true" CodeFile="FiltersTasklet.ascx.cs" Inherits="SmartParts_TaskPane_Filters_FiltersTasklet" %>
<div style="display:none">
    <asp:Panel ID="FiltersTasklet_RTools" runat="server">
        <asp:HyperLink runat="server" ID="edit" Text="edit" CssClass="filter-edit" meta:resourcekey="EditTool"></asp:HyperLink>        
    </asp:Panel>
</div>
<style>   
    .filter-tasklet .task-pane-item-bwrap
    {
    	padding: 0px 0px 0px 0px;
    }    
    .filter-list
    {
    	margin: 4px;
    }
    .filter-item a
    {
    	cursor: pointer;
    }
    .filter-item .filter-expand
    {  
    	width: 1.5em;    
    }     
    .filter-item
    {
    	line-height: 1.4em;
    }
    .filter-item .display-none
    {
    	display: none;
    }
    .filter-item li
    {
    	line-height: 1.4em;    	
    }
    .filter-item ul
    {
    	display: none;
    	padding: 0 0 0 1.5em;
    }   
    .filter-item .loading-indicator
    {
    	display: none;
    	margin-left: 1.5em;
    }
    .filter-item-expanded ul
    {
    	display: block;
    }   
    .filter-item-expanded .loading-indicator
    {
    	display: block;
    }
    .filter-item-hidden
    {
    	display: none;
    }   
    .filter-value
    {
    	white-space: nowrap;    	
	    zoom: 1;
    }
 
    .filter-value div
    {
	    line-height: 1.4em;
	    overflow: hidden;
	    -o-text-overflow: ellipsis;
	    text-overflow: ellipsis;
    }

    .filter-value span
    {
    	white-space: nowrap;    	
	    _white-space: normal;
    	padding: 0 0 0 0.25em;
    }
    .filter-value-name 
    {
    	
    }
    .filter-value-count
    {
    	color: #bbbbbb;
    }
    .edit-filters-dialog .x-window-mc
    {
    	background: #ffffff;
    }    
    .edit-filters-dialog .x-window-mc
    {
    	font-size: inherit;
    }
    .edit-filters-dialog h1
    {
    	font-size: 1em;
    	margin: 0 0 1em 0;
    	font-weight: bold;
    }
    .edit-filters-list
    {
    	margin: 0 1em 0 1em;
    }
    .edit-filters-list li
    {
    	line-height: 1.4em;
    }
    .edit-filters-list li span
    {
    	margin: 0 0 0 .25em;
    }
    .filter-commands
    {
    	padding: 1em 0 0 0;
    }
    .filter-commands a
    {
    	cursor: pointer;
    }
</style>
<ul id=<%= ClientID %> class="filter-list">
    <asp:Repeater runat="server" ID="items">
        <ItemTemplate>
            <li id="filter_<%# Eval("Alias") %>" class="filter-item<%# (( ((FilterItem)Container.DataItem).Hidden ) ? " filter-item-hidden" : "")  %>">
                <a class="filter-expand">[+]</a>   
                <span><%# Eval("Name") %></span>
                <ul class="display-none">
                   
                </ul>
            </li>
        </ItemTemplate>
    </asp:Repeater>
    <li class="filter-commands">
    <a class="filter-undo-all" style="display: none;"><%= GetLocalResourceObject("UndoFilters") %></a>
    </li>
</ul>
<script type="text/javascript">
var <%= ID %>;
$(document).ready(function(){
    if (!<%= ID %>)
    {
        <%= ID %> = new Sage.TaskPane.FiltersTasklet({
            id: "<%= ID %>",
            clientId: "<%= ClientID %>"        
        });
        <%= ID %>.init();  
    }  
});
</script>