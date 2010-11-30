Type.registerNamespace("Sage.TaskPane");

Sage.TaskPane.FiltersTasklet = function(options) {
    this._id = options.id;
    this._clientId = options.clientId;
    this._context = document.getElementById(this._clientId);
    this._groupManagerService = Sage.Services.getService("GroupManagerService");
    this._groupContextService = Sage.Services.getService("ClientGroupContext");
    this._expandCount = 10;
    this._hiddenFields = [];
    this._state = {};
    this._dialog = null;
    this._filters = {};
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
            /*        
            '<li class="filter-value<tpl if="!display"> display-none</tpl>">',
            '<input id="filter_{alias}_{index}" type="checkbox" value="{VALUE}" <tpl if="selected">checked="checked"</tpl> />',
            '<span class="filter-value-name">{NAME}</span><span class="filter-value-count">({TOTAL})</span>',
            '</li>'
            */
            '<li class="filter-value<tpl if="!display"> display-none</tpl>">',
            '<div>',
            '<input id="filter_{alias}_{index}" type="checkbox" value="{index}" <tpl if="selected">checked="checked"</tpl> />',
            '<span class="filter-value-name">',
            '{displayName}',
            '</span>',
            '<span class="filter-value-count">({count})</span>',
            '</div>',
            '</li>'
        ),
        footer: new Ext.XTemplate(
            '<li><a class="filter-show-more">{showMoreText}</a> / <a class="filter-show-all">{showAllText}</a></li>'
        ),
        commands: new Ext.XTemplate(
            '<li class="filter-commands"><a class="filter-undo-all">{undoAllFiltersText}</a></li>'
        )         
    };    
    
    Sage.TaskPane.FiltersTasklet.__instances[this._clientId] = this;
    Sage.TaskPane.FiltersTasklet.__initRequestManagerEvents();
};

Sage.TaskPane.FiltersTasklet.__instances = {};
Sage.TaskPane.FiltersTasklet.__requestManagerEventsInitialized = false;
Sage.TaskPane.FiltersTasklet.__initRequestManagerEvents = function() {
    if (Sage.TaskPane.FiltersTasklet.__requestManagerEventsInitialized)
        return;
        
    var prm = Sys.WebForms.PageRequestManager.getInstance();
    prm.add_pageLoaded(function(sender, args) {        
        var panels = args.get_panelsUpdated();
        if (panels)
        {            
            for (var i = 0; i < panels.length; i++)
            {
                var $item = $(panels[i]).find("ul.filter-list");
                if ($item.length > 0)
                {
                    var id = $item.attr("id");
                    var instance = Sage.TaskPane.FiltersTasklet.__instances[id];
                    if (instance)
                    {
                        instance.initContext();
                        instance.initInteractions();
                        instance.initSavedFilters();
                    }       
                }
            }            
        }
    }); 
     
    Sage.TaskPane.FiltersTasklet.__requestManagerEventsInitialized = true; 
};

Sage.TaskPane.FiltersTasklet.showEditDialog = function(id, e) {
    if (!e) var e = window.event;
	e.cancelBubble = true;
	if (e.stopPropagation) e.stopPropagation();
    
    if (Sage.TaskPane.FiltersTasklet.__instances[id])
        Sage.TaskPane.FiltersTasklet.__instances[id].showEditDialog();
};

Sage.TaskPane.FiltersTasklet.prototype.init = function() {
    this.initContext();    
    this.initGroupManagerEvents();
    this.initInteractions();
    this.initSavedFilters();    
};

Sage.TaskPane.FiltersTasklet.prototype.initSavedFilters = function() {
    var self = this;   
    
    this._groupManagerService.requestActiveFilter(function(args) {
        var filter = args.filter; 
                      
        for (var i = 0; filter && i < filter.columns.length; i++)
        {
            //ensure a new scope
            (function() {
                var alias = filter.columns[i];
                var id = "#filter_" + alias;
                var el = $(id).get(0);
                var container = $(el).find("ul");
                              
                $(el).toggleClass("filter-item-expanded");
                
                //temporary
                if ($(el).hasClass("filter-item-expanded"))
                    $("a.filter-expand", el).text("[-]");
                else
                    $("a.filter-expand", el).text("[+]");
                          
                if (!$(el).data("filter").fetched)
                {
                    container.before('<div class="loading-indicator"><span>Loading...</span></div>');                               
                    self._groupManagerService.getDistinctValuesForField($(el).data("filter").alias, function(data) { 
                        self.loadFilterValues(el, container.get(0), data, filter);
                    });    
                }            
            })();  
        }
    });
};

Sage.TaskPane.FiltersTasklet.prototype.initContext = function() {
    if (document.getElementById)
        this._context = document.getElementById(this._clientId);
};

Sage.TaskPane.FiltersTasklet.prototype.createEmptySelection = function() {
    return {
        values: {},
        withNull: false,
        withBlank: false
    };
};

Sage.TaskPane.FiltersTasklet.prototype.initInteractions = function() {
    var self = this;   
    
    $(this._context).parents(".task-pane-item").children(".task-pane-item-header").find("a.filter-edit").click(function() {
        self.showEditDialog();    
    });    
    
    $(this._context).find(".filter-undo-all").click(function() {
        var sender = this;
        $("li.filter-item", self._context).each(function() {
            var parent = this;
            var container = $(this).children("ul").get(0);
            self.doClearAll(parent, container, sender, false);
            
            $(parent).data("filter").selected = self.createEmptySelection(); //fully clear any and all values
                        
            self.processFilterSelections();
        });
    });
    
    $("li.filter-item", this._context).each(function() {
        var el = this;
        $(el).data("filter", { fetched: false, alias: this.id.substring("filter_".length), selected: self.createEmptySelection() });
        
        var container = $(el).find("ul");
                
        $(el).find("a.filter-expand").click(function() {  
            $(el).toggleClass("filter-item-expanded");
            
            //temporary
            if ($(el).hasClass("filter-item-expanded"))
                $("a.filter-expand", el).text("[-]");
            else
                $("a.filter-expand", el).text("[+]");
                      
            if (!$(el).data("filter").fetched)
            {
                container.before('<div class="loading-indicator"><span>Loading...</span></div>');                               
                self._groupManagerService.getDistinctValuesForField($(el).data("filter").alias, function(data) { 
                    self.loadFilterValues(el, container.get(0), data);
                });    
            }            
        });        
    });
};

Sage.TaskPane.FiltersTasklet.prototype.initGroupManagerEvents = function() {
    var self = this;
    var svc = Sage.Services.getService("GroupManagerService");  
    svc.addListener(Sage.GroupManagerService.CURRENT_GROUP_CHANGED, function(sender, evt) {
        /* TODO: remove comment below once CGC event does not cause partial page postback */
        //self.reload();    
    });   
};

Sage.TaskPane.FiltersTasklet.prototype.reload = function() {
    var self = this;
  
    //unbind all mouse interaction
    if (!this._context)
        return;
        
    $(this._context).children().hide();
    $(this._context).prepend('<div class="loading-indicator"><span>Loading...</span></div>');    
    $(this._context).find("ul,a").unbind("click");
    $(this._context).children(":not(.loading-indicator)").remove();        
  
    //need to get hidden fields too!
    var service = new Sage.Platform.WebPortal.Services.UIStateService();
    if (service) 
    {
        service.GetTaskletState(
            self.getSettingsName(),
            self.getSettingsKey("hidden"),           
            function(result) {  
                if (result)
                    result = Sys.Serialization.JavaScriptSerializer.deserialize(result);                    
                self._groupManagerService.getAvailableFilters(function(data) {
                    self.loadFilterItems(data, result);
                });  
            }, 
            function() {
                self._groupManagerService.getAvailableFilters(function(data) {
                    self.loadFilterItems(data);
                });    
            }
        );      
    }    
};

Sage.TaskPane.FiltersTasklet.prototype.loadFilterItems = function(data, hidden) {
    var self = this;
    
    var lookup = {};
    if (hidden)
        for (var i = 0; i < hidden.length; i++)
            lookup[hidden[i]] = true; 
            
    $(this._context).children("div.loading-indicator").remove();   

    for (var i = 0; i < data.items.length; i++)
    {        
        var item = data.items[i];
        if (!item.isFilterable)
            continue;
        
        $(this._context).append(this._templates.item.apply({
            alias: item.alias,
            name: item.caption,
            hidden: lookup[item.alias]    
        }));
    }
    
    $(this._context).append(this._templates.commands.apply({
        undoAllFiltersText: Sage.TaskPane.FiltersTasklet.Resources.UndoFilters
    }));
    
    this.initInteractions();        
    
    //now get current filters then filter values
    this._groupManagerService.requestActiveFilter(function(args) {
        var filter = args.filter;
        for (var i = 0; filter && i < filter.columns.length; i++)
        {
            //ensure a new scope
            (function() {
                var alias = filter.columns[i];
                var id = "#filter_" + alias;
                var el = $(id).get(0);
                var container = $(el).find("ul");
                           
                $(el).toggleClass("filter-item-expanded");
                          
                if (!$.data(el, "filter").fetched)
                {
                    container.before('<div class="loading-indicator"><span>Loading...</span></div>');                               
                    self._groupManagerService.getDistinctValuesForField($.data(el, "filter").alias, function(data) { 
                        self.loadFilterValues(el, container.get(0), data, filter);
                    });    
                }            
            })();  
        }
    });
};

Sage.TaskPane.FiltersTasklet.prototype.createFilterFromSelections = function() {
    var filter = {columns: [], on: {}, withNull: {}, withBlank: {}};
    $("li.filter-item", this._context).each(function() {
        var el = this;        
        var data = $(el).data("filter");      
        var values = [];        
        
        for (var key in data.selected.values)        
            values.push(key);                    
        
        if (values.length > 0 || data.selected.withNull || data.selected.withBlank)
        {
            filter.columns.push(data.alias);
            filter.on[data.alias] = values;
            filter.withNull[data.alias] = data.selected.withNull;
            filter.withBlank[data.alias] = data.selected.withBlank;
        }             
    }); 
    
    return filter;
};

Sage.TaskPane.FiltersTasklet.prototype.setSelectionValue = function(selection, value) {
    if (value === null)
        selection.withNull = true;
    else if (typeof value === "string" && /^\s*$/.test(value))
        selection.withBlank = true;
    else if (typeof value === "boolean" || 
             typeof value === "string" ||
             typeof value === "number")
        selection.values[value] = true;   
};

Sage.TaskPane.FiltersTasklet.prototype.clearSelectionValue = function(selection, value) {
    if (value === null)
        selection.withNull = false;
    else if (typeof value === "string" && /^\s*$/.test(value))
        selection.withBlank = false;
    else if (typeof value === "boolean" || 
             typeof value === "string" ||
             typeof value === "number")
        delete selection.values[value];    
};

Sage.TaskPane.FiltersTasklet.prototype.containsSelectionValue = function(selection, value) {
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

Sage.TaskPane.FiltersTasklet.prototype.loadFilterValues = function(parent, container, data, filter) {            
    var self = this;          
    var alias = $(parent).data("filter").alias;
    var lookup = {};  
    
    //fix-up items (move any null or blank at the end to the beginning)
    var fixAt = false;
    var fix = [];
    for (var i = data.items.length - 1; i >= 0; i--)
    {
        var item = data.items[i];
        if (item.VALUE !== null && !(typeof item.VALUE === "string" && /^\s*$/.test(item.VALUE)))
            break; //stop at the first non null/blank value
        
        fix.push(item);            
        fixAt = i;        
    }
    
    if (fixAt !== false)    
        data.items = fix.concat(data.items.slice(0, fixAt));      
    
    //store all values    
    $(parent).data("filter").values = data.items;
    
    //de-construct existing filters
    var selected = this.createEmptySelection();
    if (filter)
    {                
        if (filter.on[alias])
            for (var i = 0; i < filter.on[alias].length; i++)
                this.setSelectionValue(selected, filter.on[alias][i]);       
        
        if (filter.withNull[alias])
            selected.withNull = true;
            
        if (filter.withBlank[alias])
            selected.withBlank = true;            
                    
        $(parent).data("filter").selected = selected;
    }
    
    //if any filters are defined, show the undo button
    if (filter && filter.on[alias] && filter.on[alias].length > 0)
        $(".filter-undo-all", this._context).show();
    
    $(container).append(this._templates.header.apply({ 
        selectAllText: Sage.TaskPane.FiltersTasklet.Resources.SelectAll, 
        clearAllText: Sage.TaskPane.FiltersTasklet.Resources.ClearAll
    }));
    
    for (var i = 0; i < data.items.length; i++)
    {
        var item = data.items[i];         
        item.alias = alias;       
        item.display = (i < this._expandCount);      
        item.index = i;
        item.selected = this.containsSelectionValue(selected, item.VALUE); //lookup[item.VALUE] ? true : false;
        item.count = item.TOTAL;
        item.displayName = item.NAME;      
        if (item.VALUE === null)
            item.displayName = "(" + Sage.TaskPane.FiltersTasklet.Resources.NullText + ")";
        else if (/^\s*$/.test(item.VALUE))
            item.displayName = "(" + Sage.TaskPane.FiltersTasklet.Resources.BlankText + ")";
        
        $(container).append(this._templates.value.apply(item));
    }
    
    if (data.items.length > this._expandCount)
        $(container).append(this._templates.footer.apply({ 
            showMoreText: Sage.TaskPane.FiltersTasklet.Resources.ShowMore, 
            showAllText: Sage.TaskPane.FiltersTasklet.Resources.ShowAll 
        }));
    
    $(parent).children("div.loading-indicator").remove();        
    $(container).removeClass("display-none").click(function(evt) {
        var target = evt.target || evt.srcElement;
        if (target && $(target).is("input")) 
        { 
            var el = $(target).parents("li.filter-item").get(0);                                    
            if (target.checked)
                self.setSelectionValue($(el).data("filter").selected, $(el).data("filter").values[parseInt(target.value)].VALUE);
            else
                self.clearSelectionValue($(el).data("filter").selected, $(el).data("filter").values[parseInt(target.value)].VALUE);
            
            var test = $(el).data("filter");    
            
            self.processFilterSelections();
        }
    });     
    
    $(container).children(":first").children("a.filter-select-all").click(function() { self.doSelectAll(parent, container, this); });            
    $(container).children(":first").children("a.filter-clear-all").click(function() { self.doClearAll(parent, container, this); });
    $(container).children(":last").children("a.filter-show-more").click(function() { self.doShowMore(parent, container, this); });
    $(container).children(":last").children("a.filter-show-all").click(function() { self.doShowAll(parent, container, this); });
            
    $.data(parent, "filter").fetched = true;
    $.data(parent, "filter").expanded = this._expandCount + 1; /* +1 for header li */    
};

Sage.TaskPane.FiltersTasklet.prototype.processFilterSelections = function() {
    var filter = this.createFilterFromSelections();
    
    if (filter.columns.length == 0)
        $(".filter-undo-all", this._context).hide();
    else    
        $(".filter-undo-all", this._context).show();
    
    this._groupManagerService.setActiveFilter(filter);           
}

Sage.TaskPane.FiltersTasklet.prototype.doSelectAll = function(parent, container, sender) {
    var self = this;
    $(container).find("input").each(function() {       
        self.setSelectionValue($(parent).data("filter").selected, $(parent).data("filter").values[parseInt(this.value)].VALUE);
        this.checked = true;        
    });
    
    this.processFilterSelections();                      
};

Sage.TaskPane.FiltersTasklet.prototype.doClearAll = function(parent, container, sender, process) {
    var self = this;
    $(container).find("input").each(function() {
        self.clearSelectionValue($(parent).data("filter").selected, $(parent).data("filter").values[parseInt(this.value)].VALUE);
        this.checked = false;        
    });
        
    if (!(process === false)) 
        this.processFilterSelections();
};

Sage.TaskPane.FiltersTasklet.prototype.doShowMore = function(parent, container, sender) {
    var expanded = $(parent).data("filter").expanded;   
    
    //we are fully expanded, do not continue
    if (expanded <= -1)
        return;
        
    var begin = expanded - 1;
    var end = expanded + this._expandCount;
    var children = $(container).children();
    
    children.slice(begin, end).removeClass("display-none");
    
    if (end < children.size())
        $(parent).data("filter").expanded = end;
    else
    {
        children.filter(":last").hide();
        $(parent).data("filter").expanded = -1;
    }
};

Sage.TaskPane.FiltersTasklet.prototype.doShowAll = function(parent, container, sender) {
    $(container).children().show().filter(":last").hide();    
    $(parent).data("filter").expanded = -1;
};

Sage.TaskPane.FiltersTasklet.prototype.getSettingsKey = function(local) {
    return local + ":" + this._groupContextService.getContext().CurrentFamily.toLowerCase() + "-" + this._groupContextService.getContext().CurrentName.toLowerCase();
};

Sage.TaskPane.FiltersTasklet.prototype.getSettingsName = function() {
    return this._id;
};

Sage.TaskPane.FiltersTasklet.prototype.showEditDialog = function() { 
    var self = this;
       
    if (!this._dialog)
    {
        var template = new Ext.XTemplate(
            '<h1>{text}</h1>',
            '<ul class="edit-filters-list">',
                '<tpl for="filters">',
                '<li>',
                    '<input type="checkbox" id="{parent.id}_{id}" <tpl if="checked">checked="checked"</tpl> />',
                    '<span>{name}</span>',
                '</li>',
                '</tpl>',
            '</ul>'            
        );
        
        var filters = [];
        $("li.filter-item", this._context).each(function(){
            var data = $.data(this, "filter");
            filters.push({
                id: data.alias,
                name: $(this).children("span").text(),
                checked: !$(this).hasClass("filter-item-hidden")
            });
        });
        
        var dialog;
        dialog = new Ext.Window({
            id: this._id + "_edit_dialog",
            title: Sage.TaskPane.FiltersTasklet.Resources.DialogTitle,
            cls: "edit-filters-dialog",
            layout: "border",            
            closeAction: "hide",
            plain: true,
            height: 300,
            width: 300,
            stateful: false,                
            items: [{
                region: "center",
                margins: "5 5 5 5",
                border: false,
                html: template.apply({
                    id: this._id,
                    text: Sage.TaskPane.FiltersTasklet.Resources.DialogMessage,
                    filters: filters
                })
            }],
            buttonAlign: "right",
            buttons: [{
                text: Sage.TaskPane.FiltersTasklet.Resources.DialogOK,
                handler: function() {
                    var hidden = [];
                    var hiddenLookup = {};
                    $(self._context).children("li.filter-item-hidden").each(function() {
                        var alias = this.id.substring("filter_".length);
                        hidden.push(alias);
                        hiddenLookup[alias] = true;        
                    });
                    
                    var choices = [];
                    var choicesLookup = {};
                    $(dialog.getEl().dom).find(":checkbox:not(:checked)").each(function() {
                        var alias = this.id.substring((self._id + "_").length);
                        choices.push(alias);  
                        choicesLookup[alias] = true;                                
                    });    
                                       
                    var service = new Sage.Platform.WebPortal.Services.UIStateService();
                    if (service) 
                    {
                        service.StoreTaskletState(
                            self.getSettingsName(),
                            self.getSettingsKey("hidden"),
                            Sys.Serialization.JavaScriptSerializer.serialize(choices), 
                            function() { 
                                //state sent
                                
                                //see if choices contains everything that is currently hidden, if so, skip changes for this part
                                var alreadyHidden = true;
                                for (var i = 0; i < choices.length; i++)
                                    if (!hiddenLookup[choices[i]])
                                        alreadyHidden = false;                                                                    
                                
                                if (choices.length > 0 && !alreadyHidden) 
                                {
                                    for (var i = 0; i < choices.length; i++)
                                    {
                                        var el = $("#filter_" + choices[i]).get(0);
                                        $(el).addClass("filter-item-hidden").find(".filter-value > input").each(function() {
                                            this.checked = false;
                                        }); 
                                        $.data(el, "filter").selected = {};                                                                                                               
                                    }
                                                              
                                    self.processFilterSelections();
                                }
                                
                                if (hidden.length > 0)
                                {
                                    for (var i = 0; i < hidden.length; i++)
                                    {
                                        if (!choicesLookup[hidden[i]])
                                            $("#filter_" + hidden[i]).removeClass("filter-item-hidden");
                                    }
                                }
                            }, 
                            function() {
                                //error
                            }
                        );           
                    }  
                    
                    dialog.hide();                                                                                                 
                }
            },{
                text: Sage.TaskPane.FiltersTasklet.Resources.DialogCancel,
                handler: function() {
                    dialog.hide();
                }                
            }]
        });     
        
        this._dialog = dialog;     
    }   
       
    this._dialog.show();    
    this._dialog.center();
};
