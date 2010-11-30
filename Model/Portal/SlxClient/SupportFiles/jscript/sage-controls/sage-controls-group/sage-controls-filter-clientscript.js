
Sage.FilterManager = function(options) {
    this._id = options.id;
    this._clientId = options.clientId;
    this._context = document.getElementById(this._clientId);
    this.DistinctFilters = [];
    this._expandCount = 10;
    this.allText = options.allText;
    this.userOptions = options.userOptions;
    this.activeFilters = options.activeFilters;

    this._templates = {
        header: new Ext.XTemplate(
            '<li><a class="filter-select-all">{selectAllText}</a> / <a class="filter-clear-all">{clearAllText}</a></li>'
        ),
        item: new Ext.XTemplate(
            '<li id="filter_{alias}" class="filter-item<tpl if="hidden"> filter-item-hidden</tpl>">',
                '<a class="filter-expand">[+]</a>',
                '<span>{name}</span>',
                '<ul class="display-none">',
                '</ul>',
            '</li>'
        ),
        value: new Ext.XTemplate(
            '<div class="" style=\"white-space:nowrap;\">',
            '<input id="filter_{entity}_{alias}_{index}" type="checkbox" value="{VALUE}" <tpl if="selected">checked="checked"</tpl> onclick="{objname}.ApplyDistinctFilter(\'{[String.escape(values.entity)]}_{[String.escape(values.alias)]}\', \'{valueWithSingleFixed}\')" />',
            '<span class="filter-value-name">',
            '{displayName}',
            '</span>',
            '&nbsp;<span class="filter-value-count {alias}_{displayNameId}_count">({count})</span>',
            '</div>'
        ),
        footer: new Ext.XTemplate(
            '<li><a class="filter-show-more">{showMoreText}</a> / <a class="filter-show-all">{showAllText}</a></li>'
        ),
        commands: new Ext.XTemplate(
            '<li class="filter-commands"><a class="filter-undo-all">{undoAllFiltersText}</a></li>'
        ),
        managerItem: new Ext.Template(["<DIV style=\"white-space:nowrap;padding-left:4px;\"><INPUT id=\"{id}\" onclick=\"Sage.HandleWindowCheckboxClick(event, '{filterId}');\" ",
            "type=\"checkbox\" {checked} value=\"{value}\" /><SPAN class=filter-value-name>{display}</SPAN></DIV>"])

    }
    Sage.FilterManager.managerItemFormat = "<DIV style=\"white-space:nowrap;padding-left:4px;\"><INPUT id=\"{0}\" onclick=\"Sage.HandleWindowCheckboxClick(event, '{1}');\" type=\"checkbox\" {2} value=\"{3}\" /><SPAN class=filter-value-name>{4}</SPAN></DIV>";
    // entity, alias, index, VALUE, checked, objname, entity escaped, alias escaped, valuewithsinglefixed, displayname, displaynameid, count, cssclass
    Sage.FilterManager.valueItemFormat = ['<div style="white-space:nowrap;" class="{12}">',
            '<input id="filter_{0}_{1}_{2}" type="checkbox" value="{3}" {4} onclick="{5}.ApplyDistinctFilter(\'{6}_{7}\', \'{8}\')" />',
            '<span class="filter-value-name">',
            '{9}',
            '</span>',
            '&nbsp;<span class="filter-value-count {1}_{10}_count">({11})</span>',
            '</div>'].join('');

    /* should move this but TaskPaneResources is currently not available at the time this script file is loaded */
    Sage.FilterManager.nullIdString = "_Null_";
    Sage.FilterManager.nullString = TaskPaneResources._null_;  //"(Null)";
    Sage.FilterManager.blankString = TaskPaneResources._blank_;  //"(Blank)";
    Sage.FilterManager.EditFiltersString = TaskPaneResources.Edit_Filters;  //'Edit Filters';     
    Sage.FilterManager.UnknownCount = "...";
}

Sage.FilterManager.prototype.init = function() {
    function findContext(idstring) {
        if (idstring == "") return null;
        var elem = document.getElementById(idstring);
        if (elem != null) return elem;
        idstring = idstring.substring(0, idstring.lastIndexOf('_'));
        return findContext(idstring);
    }
    if (document.getElementById)
        this._context = findContext(this._clientId);
    if (typeof(Filters) != "undefined")    
        this._groupContextService = Sage.Services.getService("ClientGroupContext");
    this.PopupActive = false;
};

Sage.FilterManager.GetManagerService = function() {
    if (Sage.FilterManager.FilterActivityManager)
        return Sage.FilterManager.FilterActivityManager;
    return Sage.Services.getService("GroupManagerService");
};

Sage.FilterManager.prototype.GetManagerService = function() {
    return Sage.FilterManager.GetManagerService();
};

Sage.FilterManager.prototype.ApplyLookupFilter = function(options) { //filtername, entity, field, opsid, valueid, tablename) {
    var svc = this.GetManagerService();
    if (svc) {
        var value = '';
        var ops = '';
        if ($("#FilterWindow #" + options.valueid).length > 0) {
            value = $("#FilterWindow #" + options.valueid)[0].value;
            $("#" + options.valueid)[0].value = value;
        } else {
            value = $("#" + options.valueid)[0].value;
        }
        if ($("#FilterWindow #" + options.opsid).length > 0) {
            ops = $("#FilterWindow #" + options.opsid)[0].value;
            $("#" + options.opsid)[0].value = ops;
        } else {
            ops = $("#" + options.opsid)[0].value;
        }
        options.ops = ops;
        options.value = value;
        options.filterType = 'Lookup';
        svc.setActiveFilter(options);
    }
}

Sage.FilterManager.prototype.ApplyRangeFilter = function(options) { //filtername, entity, field, value, tablename) {
    var svc = this.GetManagerService();
    var values = [];
    $(String.format("DIV#{0}_{1} input", options.entity, options.filterName)).each(function(itm) {
        if (this.checked) {
            values.push(this.value);
        }
    });
    options.value = values;
    options.filterType = 'Range';
    if (svc) {
        svc.setActiveFilter(options);
    }
}

Sage.FilterManager.prototype.ApplyDistinctFilter = function(filterDef, value) {
    var store = $("#distinctFilter_" + filterDef).get(0);
    
    if (typeof filterDef == "string") {
        filterDef = $(String.format("#distinctFilter_{0}", filterDef)).get(0).filterDef;
    }
    
    $(store).data("filter").selected = $(store).data("filter").selected || {};

    if ($(store).data("filter").selected.hasOwnProperty(value) == false)
        $(store).data("filter").selected[value] = true;
    else
        delete $(store).data("filter").selected[value];
    
    var svc = this.GetManagerService();
    var values = [];
    
    for (var key in $(store).data("filter").selected) values.push(key); 
    
    if (svc) 
    {
        svc.setActiveFilter({ filterName: filterDef.Name, entity: filterDef.EntityName, field: filterDef.FieldName, 
        value: values, filterType: 'Distinct', tableName: filterDef.TableName, property: filterDef.PropertyName });
    }
}

Sage.ActivityEntity = function() {
    var tabPanel = Ext.ComponentMgr.get('activity_groups_tabs');
    if (tabPanel) {
        if (tabPanel.activeTab.id == 'literature') return "LitRequest";
        if (tabPanel.activeTab.id == 'confirmation') return "UserNotification";
        if (tabPanel.activeTab.id == 'event') return "Event";
        if (tabPanel.activeTab.id == 'all_open') return "Activity";
    }
    return "";
}

Sage.GetHiddenFilters = function() {
    var hiddenFilters = {};
    var groupkey = "";
    var tabPanel = Ext.ComponentMgr.get('activity_groups_tabs');
    if (tabPanel) {
        if (typeof Sage.HiddenActivityFilterData != "undefined") {
            hiddenFilters = Ext.apply({}, Sage.HiddenActivityFilterData); 
        }
    } else {
        var GroupContext = Sage.Services.getService("ClientGroupContext");
        if (GroupContext) {
            if (GroupContext.getContext().CurrentHiddenFilters) {
                hiddenFilters = GroupContext.getContext().CurrentHiddenFilters;
            }
        }
    }
    return hiddenFilters;
}

Sage.SaveHiddenFilters = function(hiddenFilters, oncomplete) {
    if (typeof oncomplete != "function") {
        oncomplete = function() { };
    }
    var groupkey = "";
    var tabPanel = Ext.ComponentMgr.get('activity_groups_tabs');
    if (tabPanel) {
        groupkey = "activity";
        Sage.HiddenActivityFilterData = hiddenFilters;
    } else {
        var GroupContext = Sage.Services.getService("ClientGroupContext");
        if (GroupContext) {
            groupkey = GroupContext.getContext().CurrentFamily.toLowerCase() + GroupContext.getContext().CurrentName.toLowerCase();
            groupkey = groupkey.replace(/ /g, '_').replace(/'/g, '_');
        }
    }
    if (groupkey != "") {
        var title = "hidden_filters_" + groupkey;
        if (Sage.FilterActivityManager[title])
            clearTimeout(Sage.FilterActivityManager[title]);
        Sage.FilterActivityManager[title] = setTimeout(function() {
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "UIStateService.asmx/StoreUIState",
                data: Ext.util.JSON.encode({
                    section: "Filters",
                    key: title,
                    value: Ext.util.JSON.encode(hiddenFilters)
                }),
                dataType: "json",
                error: function(request, status, error) {
                    oncomplete();
                },
                success: function(data, status) {
                    oncomplete();
                }
            });
        },
            1000);
    }
}

Sage.FilterUpdateCounts = function() {
    function getCurrentType() {
        var tabPanel = Ext.ComponentMgr.get('activity_groups_tabs');
        if (typeof tabPanel === "undefined")
            return null;
        switch (tabPanel.activeTab.id) {
            case 'literature':
                return 'literature';
            case 'confirmation':
                return 'confirmation';
            case 'all_open':
                return 'activity';
            case 'event':
                return 'event';
        }
        return 'activity';
    }
    var hiddenFilters = Sage.GetHiddenFilters();
    var atleastoneexpanded = false;
    for (var e in hiddenFilters) {
        if (hiddenFilters[e].expanded) {
            atleastoneexpanded = true;
            break;
        }
    }
    if (!atleastoneexpanded)
        return;
    var options = (getCurrentType() == null) ? null : { type: getCurrentType() };
    var svc = Sage.FilterManager.GetManagerService();
    if (Sage.FilterRangeCountRequest)
        clearTimeout(Sage.FilterRangeCountRequest);
    Sage.FilterRangeCountRequest = setTimeout(function() {
        svc.requestRangeCounts(function(args) {
            try {
                for (var i = 0; i < args.length; i++) {
                    if (!args[i].Counts)
                        continue;
                    var container = $(String.format("#{0}_{1}_items", args[i].FilterEntity, args[i].FilterName)).get(0);
                    if (container) {
                        var store = $(container).siblings(".filter-item");

                        if ($(store).data("filter")) { //distincts
                            function GetDisplayName(data, value, name) {
                                if ((data.family == "ACTIVITY") && (data.name == "Duration")) {
                                    var min = (value % 60 < 10) ? String.format("0{0}", value % 60) : value % 60;
                                    return String.format("{0}:{1}", Math.floor(value / 60), min);
                                }
                                return name;
                            }

                            function FixNullBlank(item) {
                                if (item.VALUE === null) {
                                    item.VALUE = Sage.FilterManager.nullString;
                                    item.displayName = Sage.FilterManager.nullString;
                                    item.displayNameId = Sage.FiltersToJSId(Sage.FilterManager.nullString);
                                }
                                if (/^\s*$/.test(item.VALUE)) {
                                    item.VALUE = Sage.FilterManager.blankString;
                                    item.displayName = Sage.FilterManager.blankString;
                                    item.displayNameId = Sage.FiltersToJSId(Sage.FilterManager.blankString);
                                }
                            }

                            var manager = Sage.GetCurrentFilterManager();
                            var data = $(store).data("filter").data;
                            var values = $(store).data("filter").values;
                            var selected = $(store).data("filter").selected;

                            var html = [];
                            if (getCurrentType() != null) { // only for activity/conf/lit/event
                                for (var key in args[i].Counts) {
                                    if (key == "") key = Sage.FilterManager.blankString;
                                    var exists = false;
                                    for (var j = 0; j < values.length; j++) {
                                        if (values[j].VALUE == key) {
                                            exists = true;
                                            break;
                                        }
                                    }
                                    if (!exists) {
                                        values[values.length] = { VALUE: key, NAME: key, TOTAL: -1, display: true,
                                            entity: data.family, alias: data.name,
                                            count: -1, objname: 'ActivityFilters'
                                        }
                                    }
                                }
                            }

                            var hiddenFilters = Sage.GetHiddenFilters();
                            var filterId = String.format("{0}_{1}", Sage.FiltersToJSId(data.family), Sage.FiltersToJSId((values[0]) ? values[0].alias : ''));
                            var csssearchstring = ((hiddenFilters[filterId]) && (hiddenFilters[filterId].items)) ? '|' + hiddenFilters[filterId].items.join('|').toLowerCase() + '|' : '';
                            for (var j = 0; j < values.length; j++) {
                                var item = values[j];
                                var key = item.VALUE;

                                item.selected = selected
                                ? selected.hasOwnProperty(key)
                                : false;

                                item.count = args[i].Counts.hasOwnProperty(key)
                                ? args[i].Counts[key]
                                : 0;
                                item.count = item.count == -1 ? Sage.FilterManager.UnknownCount : item.count;
                                item.displayName = GetDisplayName(data, key, GetFilterDisplayName(key, item.NAME));
                                item.displayNameId = Sage.FiltersToJSId(GetFilterDisplayName(key, item.NAME));
                                item.valueWithSingleFixed = (typeof item.VALUE) == "string" ? item.VALUE.replace(/'/g, "\\\'") : item.VALUE;

                                var cssclass = (csssearchstring.indexOf('|' + key.toString().toLowerCase() + '|') > -1) ? "display-none" : "";
                                html.push(String.format(Sage.FilterManager.valueItemFormat, item.entity, item.alias, j, item.VALUE,
                                (item.selected) ? "checked=\"checked\"" : "", item.objname, Sage.FiltersToJSId(item.entity),
                                Sage.FiltersToJSId(item.alias), item.valueWithSingleFixed, item.displayName, item.displayNameId, item.count, cssclass));

                            }

                            var fragment = document.createDocumentFragment();

                            fragment.appendChild(container.cloneNode(false));
                            fragment.firstChild.innerHTML = html.join('');
                            container.parentNode.replaceChild(fragment, container);
                            Sage.GetCurrentFilterManager().SetVisibleItem(String.format("{0}_{1}", args[i].FilterEntity, args[i].FilterName));
                        }
                        else { //ranges and distincts with no metadata populated
                            var thisFilterData = args[i];
                            var context = $(String.format("#{0}_{1}", thisFilterData.FilterEntity, thisFilterData.FilterName)).get(0);
                            var container = $(String.format("#{0}_{1}_items", thisFilterData.FilterEntity, thisFilterData.FilterName)).get(0);

                            var hasItems = true;
                            var fragment = document.createDocumentFragment();
                            if ($.browser.mozilla && !fragment.querySelectorAll) { //ff pre3.1 has no mechanism to do selection in fragments
                                $(".filter-value-count", context).each(function() {
                                    this.firstChild.nodeValue = "(0)"; //need to zero the ones that won't come down
                                });
                                for (var filterval in thisFilterData.Counts) {
                                    hasItems = true;
                                    var filterIdVal = (filterval == null) ? Sage.FilterManager.nullIdString : filterval;
                                    $(String.format("span.{0}_{1}_count", thisFilterData.FilterName, Sage.FiltersToJSId(filterIdVal)), context).each(function() {
                                        this.firstChild.nodeValue = String.format("({0})", thisFilterData.Counts[filterval] == -1 ? Sage.FilterManager.UnknownCount : thisFilterData.Counts[filterval]);
                                    });
                                }
                            } else {
                                fragment.appendChild(container.cloneNode(true));
                                if ($.browser.mozilla) { //ff >= 3.1 (ie doesn't keep state if do this)
                                    for (var j = 0; j < fragment.querySelectorAll(".filter-value-count").length; j++) {
                                        fragment.querySelectorAll(".filter-value-count")[j].firstChild.nodeValue = "(0)";
                                    }
                                    for (var filterval in thisFilterData.Counts) {
                                        hasItems = true;
                                        var filterIdVal = (filterval == null) ? Sage.FilterManager.nullIdString : filterval;
                                        var node = fragment.querySelector(String.format("span.{0}_{1}_count", thisFilterData.FilterName, Sage.FiltersToJSId(filterIdVal)));
                                        if (node)
                                            node.firstChild.nodeValue = String.format("({0})", thisFilterData.Counts[filterval] == -1 ? Sage.FilterManager.UnknownCount : thisFilterData.Counts[filterval]);
                                    }
                                } else { //ie 6 and 7
                                    var countnodes = fragment.getElementsByTagName("SPAN");
                                    for (var j = 0; j < countnodes.length; j++) {
                                        hasItems = true;
                                        if (countnodes[j].className.indexOf("filter-value-count") > -1) {
                                            countnodes[j].firstChild.nodeValue = "(0)";
                                            for (var filterval in thisFilterData.Counts) {
                                                var filterIdVal = Sage.FiltersToJSId((filterval == null) ? Sage.FilterManager.nullIdString : filterval);
                                                if (countnodes[j].className.indexOf(filterIdVal) > -1) {
                                                    countnodes[j].firstChild.nodeValue = String.format("({0})", thisFilterData.Counts[filterval] == -1 ? Sage.FilterManager.UnknownCount : thisFilterData.Counts[filterval]);
                                                    break;
                                                }
                                            }
                                            if (container.getElementsByTagName("INPUT")[j].checked) //ie feels clone doesn't include state
                                                fragment.getElementsByTagName("INPUT")[j].checked = true;
                                        }
                                    }
                                }
                                container.parentNode.replaceChild(fragment, container);
                            }
                            if (!hasItems) {
                                $(String.format("#{0}_{1}", thisFilterData.FilterEntity, thisFilterData.FilterName)).parent().addClass("filter-no-items")
                            } else {
                                $(String.format("#{0}_{1}", thisFilterData.FilterEntity, thisFilterData.FilterName)).parent().removeClass("filter-no-items")
                            }
                        }
                    }
                };
                $(".filterloading").remove();
            }
            catch (ex) {
                $(".filterloading").remove();
                throw ex;
            }
        }, options);
    }, 2000);
}


Sage.FilterManager.prototype.EditFilters = function() {
    var self = this;
    if (this.PopupActive)
        return;
    this.PopupActive = true;
    var hiddenFilters = Sage.GetHiddenFilters();
    var win = new Ext.Window({ title: Sage.FilterManager.EditFiltersString,
        id: 'EditFilterWindow',
        width: parseInt(300),
        height: parseInt(400),
        autoScroll: true
    });
    win.on('close', function() {
        self.PopupActive = false; 
    });
    win.on('beforeclose', function() {
        Sage.SaveHiddenFilters(hiddenFilters);
    });

    var activityEntity = Sage.ActivityEntity().toUpperCase();

    $("div.LookupFilter,div.RangeFilter,div.DistinctFilter", this._context).each(function() {
        if (this.id.substring(0, activityEntity.length) == activityEntity) {
            var cb = new Ext.form.Checkbox({
                boxLabel: $(".FilterName", this).get(0).innerHTML,
                checked: !$(this).hasClass("display-none")
            });
            var filterDiv = this;
            cb.on('check', (function(t, v) {
                if (v) {
                    $(filterDiv).removeClass("display-none");
                    if (typeof hiddenFilters[filterDiv.id] != "undefined")
                        hiddenFilters[filterDiv.id].hidden = false;
                } else {
                    $("input", $(filterDiv)).each(function(index, item) {
                        if(item.checked)
                            item.click();
                    });
                    $(filterDiv).addClass("display-none");
                    if (typeof hiddenFilters[filterDiv.id] === "undefined")
                        hiddenFilters[filterDiv.id] = {};
                    hiddenFilters[filterDiv.id].hidden = true;
                }
            }));
            win.add(cb);
        }
    });
    win.show();
}

Sage.FilterManager.prototype.ClearFilters = function() {
    $("span.filter-item", this._context).each(function() {
        if (typeof $(this).data("filter") !== 'undefined') $(this).data("filter").selected = {};
    });
    $("div.LookupFilter input", this._context).each(function() {
        this.value = '';
    });
    $("div.RangeFilter input", this._context).each(function() {
        this.checked = false;
    });
    $("div.DistinctFilter input", this._context).each(function() {
        this.checked = false;
    });
    var entity = Sage.ActivityEntity();
    var svc = this.GetManagerService();
    if (svc) {
        svc.setActiveFilter({ filterName: "clear", entity: entity, field: "clear", property: "clear", value: "clear", filterType: "clear" });
    }
}

Sage.FilterManager.prototype.ToggleShortList = function(filterId, forceOpen) {
    var filterDiv = $("#" + filterId);
    var anchor = filterDiv.find("A").get(0);
    var itemsDiv = filterDiv.find(String.format("#{0}_items", filterId));
    var entity = Sage.FilterInfo(filterId).Entity;
    var filterName = Sage.FilterInfo(filterId).Name;
    var svc = this.GetManagerService();

    function ToggleList(doNotUpdateCounts) {
        var hiddenFilters = Sage.GetHiddenFilters();
        var oncomplete = null;
        var changed = false;
        if (forceOpen || (anchor.innerHTML === "[+]")) {
            anchor.innerHTML = "[-]";
            itemsDiv.removeClass("display-none");
            if (!hiddenFilters[filterId]) {
                hiddenFilters[filterId] = {};
            }
            changed = !hiddenFilters[filterId].expanded;
            hiddenFilters[filterId].expanded = true;
            try {
                if (!itemsDiv.parentNode) itemsDiv.parentNode = itemsDiv.parent();
                if ((itemsDiv.parentNode) && (!doNotUpdateCounts)) {
                    itemsDiv.before('<div class="loading-indicator filterloading"><span>' + TaskPaneResources.Loading + '</span></div>');
                }
            } catch (ex) {
                //don't throw an error if cant find prev node
            }
            svc.RangeCountCache = null;
            if (!doNotUpdateCounts) oncomplete = Sage.FilterUpdateCounts;
        } else {
            anchor.innerHTML = "[+]";
            itemsDiv.addClass("display-none");
            if (hiddenFilters[filterId]) {
                hiddenFilters[filterId].expanded = false;
                changed = true;
            }
        }
        if (changed) {
            Sage.SaveHiddenFilters(hiddenFilters, oncomplete);
        }
    }

    if (filterDiv.hasClass("DistinctFilter") && (itemsDiv.length > 0) && (itemsDiv.get(0).childNodes.length <= 1)) {
        var notNeedToDoFullRefresh = this.GetAppliedFilters().length == 0; //(typeof Sage.FilterManager.FilterActivityManager === 'undefined') || 
        this.LoadDistinctValues(entity, filterName, function() { ToggleList(notNeedToDoFullRefresh); });
        return;
    }
    ToggleList();
}

Sage.FilterManager.prototype.GetAppliedFilters = function() {
    if (typeof Sage.AppliedActivityFilterData != 'undefined')
        return Sage.AppliedActivityFilterData;
    if (this._groupContextService)
        return this._groupContextService.getContext().CurrentActiveFilters;
    return [];
}


var hiddenFiltersStore = {};
Sage.FilterManager.prototype.ShowFilterWindow = function(itm) {
    var thisFilterManager = Sage.GetCurrentFilterManager();
    if (thisFilterManager.PopupActive)
        return;
    hiddenFiltersStore = Sage.GetHiddenFilters();
    var itemsdiv = $("#" + itm).get(0);
    var taskpane = Ext.get(itemsdiv.parentNode.parentNode.parentNode);
    var filterInfo = Sage.FilterInfo(itm.replace("_items", ""));
    var filterId = String.format("{0}_{1}", filterInfo.Entity, filterInfo.Name);
    var title = $(String.format("div#{0}_{1} a.FilterName", filterInfo.Entity, filterInfo.Name)).get(0).innerHTML;
    var win = new Ext.Window({ title: title,
        id: 'FilterWindow',
        width: parseInt(taskpane.getWidth()),
        height: parseInt(300),
        autoScroll: true,
        x: taskpane.getLeft(false),
        y: Ext.get(itemsdiv.parentNode).getTop(false),
        html: "<span>loading...</span>"
    });
    win.on('close', function() {
        Sage.SaveHiddenFilters(hiddenFiltersStore);
        thisFilterManager.PopupActive = false;
        Sage.PopulateFilterList();
    });
    win.setPosition(taskpane.getLeft(false), Ext.get(itemsdiv.parentNode).getTop(false));
    win.setSize(parseInt(taskpane.getWidth()), 300);
    win.show();

    var svc = Sage.Services.getService("GroupManagerService");  //above event gets eaten on the group tabs
    if (svc)
        svc.addListener(Sage.GroupManagerService.CURRENT_GROUP_CHANGED, function(mgr, args) {
            win.close();
        });

    var allvisible = true;

    //    var template = new Ext.Template( ["<DIV style=\"white-space:nowrap;padding-left:4px;\"><INPUT id=\"{id}\" onclick=\"Sage.HandleWindowCheckboxClick(event, '{filterId}');\" ",
    //        " type=\"checkbox\" {checked} value=\"{value}\" /><SPAN class=filter-value-name>{value}</SPAN></DIV>"]);

    var hiddenFiltersSearchString = '';
    if ((hiddenFiltersStore[filterId]) && (hiddenFiltersStore[filterId].items)) {
        hiddenFiltersSearchString = hiddenFiltersStore[filterId].items.join('|');
    }
    var html = [];
    $(String.format("DIV#{0} input", filterId)).each(function() {
        var ckd = true;
        if ((hiddenFiltersStore[filterId]) && (hiddenFiltersStore[filterId].items))
            ckd = hiddenFiltersSearchString.indexOf(this.value) == -1;
        allvisible = allvisible && ckd;
        html.push(String.format(Sage.FilterManager.managerItemFormat,
            this.id + '_' + new Date().getTime(),
            filterId,
            (ckd) ? ' checked="checked" ' : '',
            this.value,
            (this.nextSibling.innerText) ? this.nextSibling.innerText :
                (this.nextSibling.innerHTML) ? this.nextSibling.innerHTML : this.nextSibling.nodeValue
        ));
    });
    var allchk = String.format("<DIV><input id=\"allcheckbox\" type=\"checkbox\" {0} onclick=\"Sage.HandleWindowAllCheckBoxClick(event, '{2}');\" /><span>{1}</span>",
        (allvisible) ? " checked=\"checked\" " : "", Sage.FilterStrings.allText, filterId);
    win.body.dom.innerHTML = allchk + html.join('');
}

Sage.HandleWindowAllCheckBoxClick = function(e, filterId) {
    var sender;
    if (!e)
        e = window.event;
    if (e.target)
        sender = e.target;
    if (e.srcElement)
        sender = e.srcElement;
    var chkd = sender.checked;
    //alert($("#FilterWindow input:not(#allcheckbox)").get().length);

    if (!hiddenFiltersStore[filterId]) {
        hiddenFiltersStore[filterId] = { hidden: false, items: [] };
    }
    hiddenFiltersStore[filterId].items = [];

    $("#FilterWindow input:not(#allcheckbox)").each(function() {
        if (this.checked != chkd) {
            this.checked = chkd;
        }
        if (!chkd)
            hiddenFiltersStore[filterId].items.push(this.value);
    });
}

Sage.HandleWindowCheckboxClick = function(e, filterId) {
    var sender;
    if (!e) 
        e = window.event;
    if (e.target)
        sender = e.target;
    if (e.srcElement) 
        sender = e.srcElement;

    if (!hiddenFiltersStore[filterId]) {
        hiddenFiltersStore[filterId] = { hidden: false, items: [] };
    }
    if (!hiddenFiltersStore[filterId].items) {
        hiddenFiltersStore[filterId].items = [];
    }
    if (sender.checked) {
        while (hiddenFiltersStore[filterId].items.indexOf(sender.value) > -1) {
            hiddenFiltersStore[filterId].items.splice(hiddenFiltersStore[filterId].items.indexOf(sender.value), 1);
        }
    } else {
        if (hiddenFiltersStore[filterId].items.indexOf(sender.value) == -1) {
            hiddenFiltersStore[filterId].items.push(sender.value);
        }
    }
}

Sage.FilterManager.prototype.SetVisibleItem = function(filter) {
    var hiddenFilters = Sage.GetHiddenFilters();
    if (hiddenFilters[filter]) {
        if (hiddenFilters[filter].hidden) {
            $("#" + filter).addClass("display-none");
        }
        if (($("#" + filter).hasClass("RangeFilter")) && (hiddenFilters[filter].items)) {
//            for (var i = 0; i < hiddenFilters[filter].items.length; i++) {
//                $(String.format("input[value='{0}']", hiddenFilters[filter].items[i]), $("#" + filter)).parent().addClass("display-none");
//            }
            var i = 0;
            var node = document.getElementById(String.format('filter_{0}_{1}', filter, i));
            while (node) {
                if (hiddenFilters[filter].items.indexOf(node.value) > -1)
                    $(node.parentNode).addClass("display-none"); 
                else
                    $(node.parentNode).removeClass("display-none");
                node = document.getElementById(String.format('filter_{0}_{1}', filter, ++i));
            }
        }

        if ((hiddenFilters[filter].expanded) && ($("#" + filter + "_items").hasClass("display-none"))) {
            this.ToggleShortList(filter, true);
        }
    }

}

Sage.FilterManager.prototype.SetVisibleItems = function() {
    var GroupContext = Sage.Services.getService("ClientGroupContext");
    var allFilters = GroupContext.getContext().CurrentEntityFilters;
    if (allFilters) {
        for (var i = 0; i < allFilters.length; i++) {
            if (!allFilters[i].InCurrentGroupLayout)
                $(String.format("#{0}_{1}", allFilters[i].Entity, allFilters[i].Name)).addClass("display-none")
            else
                $(String.format("#{0}_{1}", allFilters[i].Entity, allFilters[i].Name)).removeClass("display-none");
        }
    }

    var hiddenFilters = Sage.GetHiddenFilters();
    if (hiddenFilters) {
        for (filter in hiddenFilters) {
            this.SetVisibleItem(filter);
        }
    }

}

Sage.FilterManager.prototype.LoadDistinctValues = function(entity, filterName, finished, options) {
    var self = this;
    if (self.PopupActive)
        return;
    if (typeof finished === "undefined")
        finished = self.ShowFilterWindow;
    var el = $(String.format("#distinctFilter_{0}_{1}", entity, filterName)).get(0);
    if (!(el) || el.fetching)
        return;
    el.fetching = true;
    var itemsdivid = String.format("{0}_{1}_items", entity, filterName);
    var container = $(String.format("DIV#{0}", itemsdivid)).get(0);
    var svc = this.GetManagerService();
    var field = String.format("{0}.{1}", el.filterDef.TableName, el.filterDef.FieldName);
    var datapath = el.filterDef.DataPath;
    if (svc) { 
        svc.getDistinctValuesForField(field, { family: entity, filterName: filterName, dataPath: datapath }, function(data) {
            self.loadDistinctFilterValues(el, container, data, null, filterName);
            el.fetching = false;
            el.fetched = true;
            //self.SetVisibleItem(String.format("{0}_{1}", entity, filterName));
            finished(itemsdivid, options);
        });
    } else {
        el.fetching = false;
        finished(itemsdivid, options);
    }
}

Sage.FilterManager.prototype.loadDistinctFilterValues = function(parent, container, data, filter, alias) {
    function GetDisplayName(data, item) {
        if ((data.family == "ACTIVITY") && (data.name == "Duration")) {
            var min = (item.VALUE % 60 < 10) ? String.format("0{0}", item.VALUE % 60) : item.VALUE % 60;
            return String.format("{0}:{1}", Math.floor(item.VALUE / 60), min);
        }
        return item.NAME;
    }

    function FixNullBlank(item) {
        if (item.VALUE === null) {
            item.VALUE = Sage.FilterManager.nullString;
            item.displayName = Sage.FilterManager.nullString;
            item.displayNameId = Sage.FiltersToJSId(Sage.FilterManager.nullString);
        }
        if (/^\s*$/.test(item.VALUE)) {
            item.VALUE = Sage.FilterManager.blankString;
            item.displayName = Sage.FilterManager.blankString;
            item.displayNameId = Sage.FiltersToJSId(Sage.FilterManager.blankString);
        }
    }

    var self = this;
    var lookup = {};

    //fix-up items (move any null or blank at the end to the beginning)
    var fixAt = false;
    var fix = [];
    for (var i = data.items.length - 1; i >= 0; i--) {
        var item = data.items[i];
        if (item.VALUE !== null && !(typeof item.VALUE === "string" && /^\s*$/.test(item.VALUE)))
            break; //stop at the first non null/blank value

        fix.push(item);
        fixAt = i;
    }

    if (fixAt !== false)
        data.items = fix.concat(data.items.slice(0, fixAt));

    //store all values
    //$(parent).data("filter").values = data.items;
    $(parent).data("filter", {});
    $(parent).data("filter").data = data;
    $(parent).data("filter").values = data.items;

    //de-construct existing filters
    //    var selected = this.createEmptySelection();
    //    if (filter) {
    //        if (filter.on[alias])
    //            for (var i = 0; i < filter.on[alias].length; i++)
    //            this.setSelectionValue(selected, filter.on[alias][i]);

    //        if (filter.withNull[alias])
    //            selected.withNull = true;

    //        if (filter.withBlank[alias])
    //            selected.withBlank = true;

    //        $(parent).data("filter").selected = selected;
    //    }

    var getSelectedFromFilterData = function(data, parent) {
        var selected = {};
        for (var j = 0; j < data.length; j++) {
            if (!data[j].Entity) {
                data[j].Entity = data[j].entity;
                data[j].Name = data[j].filterName;
                data[j].Value = data[j].value;
            }
            if (data[j].Entity == parent.filterDef.EntityName &&
                data[j].Name == parent.filterDef.Name) {
                for (var k = 0; k < data[j].Value.length; k++) {
                    selected[data[j].Value[k]] = true;
                }
                $(parent).data("filter").selected = selected;
                break;
            }
        }
        return selected;
    }

    var selected = {};
    if (this._groupContextService) {  //entity groups
        var context = this._groupContextService.getContext();
        selected = getSelectedFromFilterData(context.CurrentActiveFilters, parent);
    } else { //activity/etc.        
        selected = getSelectedFromFilterData(Sage.AppliedActivityFilterData, parent);
    }

    var hiddenFilters = Sage.GetHiddenFilters();
    var html = [];
    var csssearchstring = '';
    var filterId = String.format("{0}_{1}", Sage.FiltersToJSId(data.family), Sage.FiltersToJSId(alias));
    if ((hiddenFilters[filterId]) && (hiddenFilters[filterId].items)) {
        csssearchstring = ((hiddenFilters[filterId]) && (hiddenFilters[filterId].items)) ? '|' + hiddenFilters[filterId].items.join('|').toLowerCase() + '|' : '';
    }
    for (var i = 0; i < data.items.length; i++) {
        var item = data.items[i];
        item.alias = alias;
        item.display = (i < this._expandCount);
        item.index = i;
        item.selected = false; 
        item.count = item.TOTAL == -1 ? Sage.FilterManager.UnknownCount : item.TOTAL;
        item.displayName = GetDisplayName(data, item);
        item.objname = self._id;
        item.entity = data.family;
        item.displayNameId = Sage.FiltersToJSId(item.VALUE);
        FixNullBlank(item);
        item.valueWithSingleFixed = (typeof item.VALUE) == "string" ? item.VALUE.replace(/'/g, "\\\'") : item.VALUE;

        var cssclass = (csssearchstring.indexOf('|' + item.VALUE.toString().toLowerCase() + '|') > -1) ? "display-none" : "";
        html.push(String.format(Sage.FilterManager.valueItemFormat, item.entity, item.alias, item.index, item.VALUE,
            (item.selected) ? "checked=\"checked\"" : "", item.objname, Sage.FiltersToJSId(item.entity),
            Sage.FiltersToJSId(item.alias), item.valueWithSingleFixed, item.displayName, item.displayNameId, item.count, cssclass));

    }
    container.innerHTML = html.join('');


};

Sage.FiltersToJSId = function(val) {
    if ((typeof val) == "number") return String.format("{0}", val).replace(/\W/g, '_');
    return (typeof val != "string") ? "" : val.replace(/\W/g, '_');
}

Sage.FilterManager.prototype.toJSId = function(val) {
    return Sage.FiltersToJSId(val);
}

Sage.FilterManager.prototype.doSelectAll = function(parent, container, sender) {
    var self = this;
    $(container).find("input").each(function() {
        self.setSelectionValue($(parent).data("filter").selected, $(parent).data("filter").values[parseInt(this.value)].VALUE);
        this.checked = true;
    });

    this.processFilterSelections();
};

Sage.FilterManager.prototype.doClearAll = function(parent, container, sender, process) {
    var self = this;
    $(container).find("input").each(function() {
        self.clearSelectionValue($(parent).data("filter").selected, $(parent).data("filter").values[parseInt(this.value)].VALUE);
        this.checked = false;
    });

    if (!(process === false))
        this.processFilterSelections();
};

Sage.FilterManager.prototype.createEmptySelection = function() {
    return {
        values: {},
        withNull: false,
        withBlank: false
    };
};

Sage.FilterManager.prototype.containsSelectionValue = function(selection, value) {
    if (value === null)
        return (selection.withNull == true);
    else if (typeof value === "string" && /^\s*$/.test(value))
        return (selection.withBlank == true);
    else if (typeof value === "boolean" ||
             typeof value === "string" ||
             typeof value === "number")
        return (selection.values[value] == true);
    else
        return false;
};

Sage.FilterManager.prototype.setSelectionValue = function(selection, value) {
    if (value === null)
        selection.withNull = true;
    else if (typeof value === "string" && /^\s*$/.test(value))
        selection.withBlank = true;
    else if (typeof value === "boolean" ||
             typeof value === "string" ||
             typeof value === "number")
        selection.values[value] = true;
};

Sage.FilterManager.prototype.clearSelectionValue = function(selection, value) {
    if (value === null)
        selection.withNull = false;
    else if (typeof value === "string" && /^\s*$/.test(value))
        selection.withBlank = false;
    else if (typeof value === "boolean" ||
             typeof value === "string" ||
             typeof value === "number")
        delete selection.values[value];
};

Sage.FilterManager.prototype.processFilterSelections = function() {
    var filter = this.createFilterFromSelections();
    this.GetManagerService().setActiveFilter(filter);
}

Sage.FilterManager.prototype.createFilterFromSelections = function() {
    var filter = { columns: [], on: {}, withNull: {}, withBlank: {} };
    $("li.filter-item", this._context).each(function() {
        var el = this;
        var data = $(el).data("filter");
        var values = [];

        for (var key in data.selected.values)
            values.push(key);

        if (values.length > 0 || data.selected.withNull || data.selected.withBlank) {
            filter.columns.push(data.alias);
            filter.on[data.alias] = values;
            filter.withNull[data.alias] = data.selected.withNull;
            filter.withBlank[data.alias] = data.selected.withBlank;
        }
    });

    return filter;
};

Sage.FilterInfo = function(filterid) {
    var GroupContext = Sage.Services.getService("ClientGroupContext");
    var allFilters = GroupContext.getContext().CurrentEntityFilters;
    if (allFilters) {
        for (var i = 0; i < allFilters.length; i++) {
            if (allFilters[i].FilterId == filterid) {
                return allFilters[i];
            }
        }
        for (var i = 0; i < allFilters.length; i++) {  //filterid may be appended with a location
            if (filterid.indexOf(allFilters[i].FilterId) == 0) {
                return allFilters[i];
            }
        }
    }
    var res = {};
    res.Entity = filterid.split('_')[0]; //breaks on _ in filter or entity name
    res.Name = filterid.split('_')[1];
    return res;
}

Sage.GetCurrentFilterManager = function() {
    return window.Filters ? window.Filters : window.ActivityFilters;
}

Sage.FilterActivityManager = function(options) {
    //this.ActiveFilters = [];
    this._listeners = {};
    this._listeners.onSetActiveFilter = [];
}
Sage.FilterActivityManager.prototype.ONSETACTIVEFILTER = "onSetActiveFilter";

Sage.FilterActivityManager.prototype.setActiveFilter = function(options) {
    function addFilterToTab(activeTab, options) {
        if (typeof Sage.AppliedActivityFilterData === "undefined")
            Sage.AppliedActivityFilterData = [];
        for (var i = 0; i < Sage.AppliedActivityFilterData.length; i++) {
            if ((Sage.AppliedActivityFilterData[i].filterName === options.filterName) &&
                (Sage.AppliedActivityFilterData[i].entity === options.entity)) {
                Sage.AppliedActivityFilterData[i] = options;
                return;
            }
        }
        Sage.AppliedActivityFilterData[Sage.AppliedActivityFilterData.length] = options;
        return;
    }

    function storeFilter(activeTab) {
        var actfilterdata = [];
        for (var i = 0; i < Sage.AppliedActivityFilterData.length; i++) {
            //            if (Sage.AppliedActivityFilterData[i].entity.toLowerCase() != 'clear') {
            actfilterdata[actfilterdata.length] = (Sage.AppliedActivityFilterData[i]);
            //            } 
        }

        if (Sage.FilterActivityManager.appliedTimeout)
            clearTimeout(Sage.FilterActivityManager.appliedTimeout);

        Sage.FilterActivityManager.appliedTimeout = setTimeout(function() {
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "UIStateService.asmx/StoreUIState",
                data: Ext.util.JSON.encode({
                    section: "Filters",
                    key: "applied_activity_filters",
                    value: Ext.util.JSON.encode(actfilterdata)
                }),
                dataType: "json",
                error: function(request, status, error) {
                },
                success: function(data, status) {
                }
            });
        },
            1000);
    }

    this.RangeCountCache = null;
    if (options.filterType == 'clear') {
        for (var i = 0; i < Sage.AppliedActivityFilterData.length; i++) {
            if (Sage.AppliedActivityFilterData[i].entity.toLowerCase() == Sage.ActivityEntity().toLowerCase()) {
                Sage.AppliedActivityFilterData.splice(i, 1);
            }
        }
    } else {
        for (var i = 0; i < Sage.AppliedActivityFilterData.length; i++) {
            if (Sage.AppliedActivityFilterData[i].filterType.toLowerCase() == 'clear') {
                Sage.AppliedActivityFilterData.splice(0, i);
            }
        }
    }
    var tabPanel = Ext.ComponentMgr.get('activity_groups_tabs');
    var list = tabPanel.listObj;
    var activeTab = tabPanel.getActiveTab();
    addFilterToTab(activeTab, options);

    if (Sage.FilterActivityManager.refreshListTimeout)
        clearTimeout(Sage.FilterActivityManager.refreshListTimeout);
    Sage.FilterActivityManager.refreshListTimeout = setTimeout(function() {
        list.connections = Ext.apply({}, activeTab.connections);
        list.filter = Ext.apply({}, Sage.AppliedActivityFilterData);
        list.setEnableDetailView(activeTab.id === "all_open");
        list.refresh();
        storeFilter(activeTab, options);
        Sage.FilterUpdateCounts();
    }, 2000);
    this.fireEvent(this.ONSETACTIVEFILTER, options);
};

Sage.FilterActivityManager.prototype.getDistinctValuesForField = function(field, options, success, fail) {
    var d = { metaData: {}, groupId: "" };
    this.requestRangeCounts(function(data) {
        var countData; // = {};
        for (var i = 0; i < data.length; i++) {
            if ((data[i].FilterName === options.filterName) && (data[i].FilterEntity === options.family)) {
                countData = data[i];
            }
        }
        d.family = countData.FilterEntity;
        d.name = countData.FilterName;
        d.items = [];
        for (var i in countData.Counts) {
            d.items.push({
                TOTAL: countData.Counts[i],
                VALUE: (i == Sage.FilterManager.nullString) ? null : i,
                NAME: GetFilterDisplayName(i)
            });
        }
        d.items.sort(function(a, b) { return isNaN(a.NAME) ? a.NAME > b.NAME : a.NAME - b.NAME; });
        d.count = d.items.length;
        d.total_count = d.items.length;
        d.distinctField = field;
        success(d);
    }, { type: options.family, field: field }, fail);
};

function GetFilterDisplayName(val, defname) {
    if (typeof(UserNameLookup) != "undefined") {
        if (UserNameLookup[val])
            return UserNameLookup[val];
    }
    if (typeof(LocalizedActivityStrings) != "undefined") {
        if (LocalizedActivityStrings[val])
            return LocalizedActivityStrings[val];
    }
    if (val == null)
        return Sage.FilterManager.nullString;
    if (val == "")
        return Sage.FilterManager.blankString;
    return ((typeof(defname) != "undefined") && (defname)) ? defname : val;
}

Sage.FilterActivityManager.prototype.requestRangeCounts = function(success, options, fail) {
    var self = this;
    var family = options.type.toLowerCase();

    if (self.RangeCountCache && (self.RangeCountCache[0].FilterEntity.toLowerCase() == family)) {
        success(self.RangeCountCache);
        return;
    }
    if (this.fetchingRangeCounts) {
        window.setTimeout(function() { self.requestRangeCounts(success, options, fail); }, 50);
        return;
    }
    self.fetchingRangeCounts = true;

    if (family == 'litrequest') family = 'literature';
    if (family == 'usernotification') family = 'confirmation';
    var sdata = {};
    sdata.resource = String.format("slxdata.ashx/slx/crm/-/activities/{0}count/all", family);
    sdata.qparams = {
        responsetype: "json",
        time: new Date().getTime()
    };

    $.ajax({
        url: this.buildRequestUrl(sdata),
        dataType: "json",
        success: function(data) {
            self.RangeCountCache = data;
            success(data);
            self.fetchingRangeCounts = false;
        },
        error: function(request, status, error) {
            self.fetchingRangeCounts = false;
            if (typeof fail === "function") fail(request, status, error);
        }

    });
};

Sage.FilterActivityManager.prototype.requestActiveFilters = function(success, fail) {
    setTimeout(function() { success(Sage.AppliedActivityFilterData); }, 10); //must go after ready events finish
};

Sage.FilterActivityManager.prototype.addListener = function(name, handler) {
    if (name == this.ONSETACTIVEFILTER) {
        this._listeners.onSetActiveFilter.push(handler);
    }
}

Sage.FilterActivityManager.prototype.fireEvent = function(name, options) {
    if (name == this.ONSETACTIVEFILTER) {
        for (var i = 0; i < this._listeners.onSetActiveFilter.length; i++) {
            this._listeners.onSetActiveFilter[i](options);
        }
    }
}

Sage.FilterActivityManager.prototype.buildRequestUrl = function(options) {
    var o = options;
    var u = [];
    var p = [];
    var qp = [];

    u.push(o.resource);
    if (o.predicate) {
        if (typeof o.predicate === "object")
            for (var k in o.predicate)
            p.push(k + "=" + encodeURIComponent(o.predicate[k]));
        else if (typeof o.predicate === "string")
            p.push(o.predicate);

        if (p.length > 0) {
            u.push("(");
            u.push(p.join("&"));
            u.push(")");
        }
    }
    if (o.qparams) {
        if (typeof o.qparams === "object")
            for (var prm in o.qparams)
            qp.push(prm + "=" + encodeURIComponent(o.qparams[prm]));
        else if (typeof o.qparams === "string")
            qp.push(o.qparams);

        if (qp.length > 0) {
            u.push("?");
            u.push(qp.join("&"));
        }
    }

    return u.join("");
}
