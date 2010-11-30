<%@ Control Language="C#" AutoEventWireup="true" CodeFile="ActivityFilters.ascx.cs" Inherits="SmartParts_TaskPane_ActivityFilters" %>
<div style="display:none">
    <asp:Panel ID="Filters_RTools" runat="server">
        <asp:HyperLink runat="server" ID="edit" Text="edit" CssClass="filter-edit"></asp:HyperLink>        
    </asp:Panel>
</div>
<script type="text/javascript">
    Sage.FilterManager.FilterActivityManager = new Sage.FilterActivityManager();
    //$(document).ready(function() {

    Sage.PopulateFilterList = function() {
        var svc = Sage.FilterManager.GetManagerService();
        var GetVisibleFilters = function() {
            var tabPanel = Ext.ComponentMgr.get('activity_groups_tabs');
            var visibleFilters = { LitRequest: false, UserNotification: false, Event: false, Activity: false };
            if (tabPanel) {
                visibleFilters.LitRequest = (tabPanel.activeTab.id == 'literature');
                visibleFilters.UserNotification = (tabPanel.activeTab.id == 'confirmation');
                visibleFilters.Event = (tabPanel.activeTab.id == 'event');
                visibleFilters.Activity = (tabPanel.activeTab.id == 'all_open');
            }
            return visibleFilters;
        }

        var tabPanel = Ext.ComponentMgr.get('activity_groups_tabs');
        var visibleFilters = GetVisibleFilters();
        for (e in visibleFilters) {
            if (visibleFilters[e])
                $(String.format(".{0}_Filter", e.toUpperCase())).removeClass("display-none")
            else
                $(String.format(".{0}_Filter", e.toUpperCase())).addClass("display-none");
        }
        svc.requestActiveFilters(function(args) {
            var filterMgr = Sage.GetCurrentFilterManager();
            $("div.LookupFilter input", filterMgr._context).each(function() {
                this.value = '';
            });
            $("div.RangeFilter input", filterMgr._context).each(function() {
                this.checked = false;
            });
            $("div.filter-items", filterMgr._context).addClass("display-none");
            $("div.DistinctFilter div.filter-items").each(function() {
                this.innerHTML = '';
            });
            $("span.filter-item", filterMgr._context).each(function() {
                if (typeof $(this).data("filter") !== 'undefined') $(this).removeData("filter");
            });
            $("a.filter-expand", filterMgr._context).text("[+]");

            var setVisibleNow = true;
            for (var i = 0; i < args.length; i++) {
                if (args[i] == null) {
                    continue;
                }
                var filterDiv = $(String.format("#{0}_{1}", args[i].entity, args[i].filterName));
                var vals = args[i].value;
                if (filterDiv.hasClass("LookupFilter")) {
                    for (var j = 0; j < vals.length; j++) {
                        filterDiv.find("input").get(0).value = vals[j];
                        if (args[i].op) {
                            filterDiv.find("select").get(0).selectedValue = args[i].op;
                        }
                    }
                }
                if (filterDiv.hasClass("RangeFilter")) {
                    for (var j = 0; j < vals.length; j++) {
                        if (filterDiv.find(String.format("input[value='{0}']", vals[j])).length > 0)
                            filterDiv.find(String.format("input[value='{0}']", vals[j])).get(0).checked = true;
                    }
                }
                if (filterDiv.hasClass("DistinctFilter")) {
                    setVisibleNow = false;
                    var distinctVals = args[i].value.slice();
                    var distinctDiv = filterDiv;
                    ActivityFilters.LoadDistinctValues(args[i].entity, args[i].filterName, function(id, opts) {
                        for (var j = 0; j < opts.distinctVals.length; j++) {
                            if (opts.distinctDiv.find(String.format("input[value='{0}']", opts.distinctVals[j])).length > 0)
                                opts.distinctDiv.find(String.format("input[value='{0}']", opts.distinctVals[j])).get(0).checked = true;
                        }
                        ActivityFilters.SetVisibleItems();
                    }, { distinctVals: distinctVals, distinctDiv: distinctDiv }
                );
                }
            }
            if (setVisibleNow) ActivityFilters.SetVisibleItems();

            Sage.FilterUpdateCounts();
        });
    }

$(document).ready(function() {
    Ext.ComponentMgr.get('activity_groups_tabs').on('tabchange', function() {
        Sage.PopulateFilterList();
    });
});
</script>
