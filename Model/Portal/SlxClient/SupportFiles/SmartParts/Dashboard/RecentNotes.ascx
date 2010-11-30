<%@ Control Language="C#" AutoEventWireup="true" CodeFile="RecentNotes.ascx.cs" Inherits="SmartParts_Dashboard_RecentNotes" %>

<div class="portlet_description">
<asp:label ID="Label0" runat="Server" Text="<%$ resources:Description %>"></asp:label>
</div>

<script type="text/javascript" >
Ext.onReady(function(){
    var url = "slxdata.ashx/slx/crm/-/namedqueries?format=json&name=recentNotes";
    var numberOfNotesToDisplay = 5;
    var numberOfCharactersToDisplay = 200;
    
    $.ajax({
        url: url,
        dataType: 'json',
        success: function(data) { 
            var tpl = new Ext.Template('<div style="margin:3px 0px"><a href="javascript:Link.editHistory(\'{HistId}\');">{Description}</a></div><div style="margin-bottom: 12px">{Notes}</div>');
            tpl.compile();
            for (var i=0; i<numberOfNotesToDisplay; i++) {
                if (i < data.items.length) {
                    tpl.append('RecentNotesDiv', {
                        HistId: data.items[i].id,
                        Description: ((data.items[i].description == null) || (data.items[i].description.trim().length == 0)) ? 
                            String.format("&lt;{0}&gt;", DashboardResource.Regarding) : 
                            data.items[i].description,
                        Notes: Ext.util.Format.ellipsis(data.items[i].notes, numberOfCharactersToDisplay)
                    });
                }
            }
            if (data.items.length == 0) {
                var noitems = new Ext.Template('<div>{NoItems}</div>');
                noitems.compile();
                noitems.append('RecentNotesDiv', {
                    NoItems: DashboardResource.NoItemsAvailable});
            }
            refreshPortletData("RecentNotes");
        },
        error: function(request, status, error) {
            var noitems = new Ext.Template('<div>{NoItems}</div>');
            noitems.compile();
            noitems.append('RecentNotesDiv', {
                NoItems: DashboardResource.NoItemsAvailable});
        }
    });
});

</script>
<div id="RecentNotesDiv">
</div>