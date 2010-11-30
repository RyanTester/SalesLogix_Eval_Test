<%@ Control Language="C#" AutoEventWireup="true" CodeFile="TodaysActivities.ascx.cs" Inherits="SmartParts_Dashboard_TodaysActivities" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>

<div class="portlet_description">
<asp:label ID="Label0" runat="Server" Text="<%$ resources:Description %>"></asp:label>
</div>
    
<div id="TodaysActivitiesDiv"></div>
    
<script type="text/javascript" >

    function TodaysActivities_refresh() {
        if (!Sage.DialogWorkspace.onClose) {
            Sage.DialogWorkspace.prototype.onClose = [TodaysActivities_refresh];
        } else {
            var found = false;
            for (var elem in Sage.DialogWorkspace.onClose) {
                if (elem === TodaysActivities_refresh) {
                    found = true;
                    break;
                }
            }
            if (!found)
                Sage.DialogWorkspace.onClose.push(TodaysActivities_refresh);
        }
        $("#TodaysActivitiesDiv").html("");
        var numberToShow = 5;

        var tpl = new Ext.Template('<div><a href="javascript:Link.editActivity(\'{id}\');">{timerange} {description} {name}</div>');
        tpl.compile();
        var tplOccur = new Ext.Template('<div><a href="javascript:Link.editActivityOccurrence(\'{id}\',\'{datetime}\');">{timerange} {description} {name}</div>');
        tplOccur.compile();        

        $.ajax({
            url: "slxdata.ashx/slx/crm/-/activities/activity/all?useWelcomeCriteria=true&count=true&meta=true&start=0&sort=StartDate&limit=" + numberToShow + "&dc=" + (new Date()).getTime(),
            dataType: 'json',
            success: function(data) {
            
                for (var i = 0; i < data.items.length; i++) {
                    if (i < numberToShow) {
                        var name = data.items[i].contactName ? data.items[i].contactName : data.items[i].leadName;
                        var starttime = new Date(data.items[i].startDate);
                        var endtime = new Date(data.items[i].startDate.setMinutes(data.items[i].startDate.getMinutes()+data.items[i].duration));
                        var recurring = new Boolean(data.items[i].recurring);
                        var idDate = data.items[i].id; 
                        
                        var index = data.items[i].id.indexOf(':');                        
                        if (index > 0)
                            id = idDate.slice(0,index); 
                        else 
                            id = idDate;

                        var timeRegExp = new RegExp("([0-9]{1,2}\:[0-9]{1,2})\:[0-9]{1,2}");
                        if (recurring == true) {
                            var datetime = idDate.slice(index + 1);
                            
                            tplOccur.append('TodaysActivitiesDiv', {
                            id: id,
                                datetime: datetime,
                            timerange: data.items[i].timeless
                                ? '<%= GetLocalResourceObject("Timeless.Text") %>'
                                : String.format("{0} - {1}", starttime.toLocaleTimeString().replace(timeRegExp, "$1"), endtime.toLocaleTimeString().replace(timeRegExp, "$1")),
                            description: data.items[i].description,
                            name: name ? String.format("({0})", name) : ""
                            });
                        }
                        else {
                        tpl.append('TodaysActivitiesDiv', {
                                id: id,
                            timerange: data.items[i].timeless
                                ? '<%= GetLocalResourceObject("Timeless.Text") %>'
                                : String.format("{0} - {1}", starttime.toLocaleTimeString().replace(timeRegExp, "$1"), endtime.toLocaleTimeString().replace(timeRegExp, "$1")),
                            description: data.items[i].description,
                            name: name ? String.format("({0})", name) : ""
                        });
                        }                        
                    };
                }
                var allActivities = String.format('<div style="margin-top: 1em;"><a href="ActivityManager.aspx?useWelcomeCriteria=T"><%= GetLocalResourceObject("AllActivities.Text") %></a></div>', data.count);
                document.getElementById('TodaysActivitiesDiv').innerHTML += allActivities;
            },
            error: function(request, status, error) {
                var noitems = new Ext.Template('<div>{NoItems}</div>');
                noitems.compile();
                noitems.append('TodaysActivitiesDiv', {
                    NoItems: '<%= GetLocalResourceObject("NoItemsAvailable") %>'
                });
            }
        });

    }
</script>