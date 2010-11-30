<%@ Control Language="C#" AutoEventWireup="true" CodeFile="Filters.ascx.cs" Inherits="SmartParts_TaskPane_Filters" %>
<div style="display:none">
    <asp:Panel ID="Filters_RTools" runat="server">
        <asp:HyperLink runat="server" ID="edit" Text="edit" CssClass="filter-edit"></asp:HyperLink>        
    </asp:Panel>
</div>
<script type="text/javascript">
var svc = Sage.Services.getService("GroupManagerService");

Sage.PopulateFilterList = function() {
    var GroupContext = Sage.Services.getService("ClientGroupContext");
    if ((typeof GroupContext === "undefined") ||
        (typeof Filters === "undefined") ||
        (typeof GroupContext.getContext().CurrentActiveFilters === "undefined")) {
        //|| (Filters._groupContextService.getContext().CurrentName != GroupContext.getContext().CurrentName)) {
        window.setTimeout(Sage.PopulateFilterList, 20);
    } else {
        svc.clearDistinctValuesCache();
        var filterMgr = Sage.GetCurrentFilterManager();
        var args = GroupContext.getContext().CurrentActiveFilters;
        if (args) {
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
                var filter = String.format("{0}_{1}", args[i].Entity, args[i].Name);
                var filterDiv = $("#" + filter);
                var vals = args[i].Value;
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
                    if ((Sage.GetHiddenFilters()[filter]) && (Sage.GetHiddenFilters()[filter].expanded) && !(Sage.GetHiddenFilters()[filter].hidden)) {
                        setVisibleNow = false;
                        var distinctVals = args[i].Value.slice();
                        var distinctDiv = filterDiv;
                        Filters.LoadDistinctValues(args[i].Entity, args[i].Name, function(id, opts) {
                            Filters.SetVisibleItems();
                        }, { distinctVals: distinctVals, distinctDiv: distinctDiv });
                    }
                }
            }
            if (setVisibleNow) Filters.SetVisibleItems();
        }

        Sage.FilterUpdateCounts();
    }
}

    $(document).ready(function() {

        if (typeof Sage.SalesLogix.Controls.ListPanel !== "undefined") {
            var panel = Sage.SalesLogix.Controls.ListPanel.find("MainList");
            panel.on("refresh", function() { Sage.FilterUpdateCounts(); });
            svc.addListener(Sage.GroupManagerService.CURRENT_GROUP_CHANGED, Sage.PopulateFilterList);
        }
        Sage.PopulateFilterList();
    });   
</script>