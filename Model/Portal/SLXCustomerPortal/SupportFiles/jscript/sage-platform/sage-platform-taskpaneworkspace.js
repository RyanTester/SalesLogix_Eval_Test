Sage.TaskPaneItem = function(workspace, options) {
    this._workspace = workspace;
    this._options = options;
    this._events = {};
};

Sage.TaskPaneItem.prototype.getWorkspace = function() { return this._workspace; };
Sage.TaskPaneItem.prototype.getId = function() { return this._options.Id; };
Sage.TaskPaneItem.prototype.getClientId = function() { return this._options.ClientId; };
Sage.TaskPaneItem.prototype.getTitle = function() { return this._options.Title; };
Sage.TaskPaneItem.prototype.getDescription = function() { return this._options.Description; };
Sage.TaskPaneItem.prototype.getIsCollapsed = function() { return this._options.IsCollapsed; };
Sage.TaskPaneItem.prototype.setIsCollapsed = function(v) { this._options.IsCollapsed = v; };
Sage.TaskPaneItem.prototype.getElement = function() { return document.getElementById(this.getClientId()); };
Sage.TaskPaneItem.prototype.addListener = function(event, listener, context) {
    this._events[event] = this._events[event] || [];
    this._events[event].push({
        listener: listener,
        context: context
    });
};
Sage.TaskPaneItem.prototype.removeListener = function(event, listener, context) {
    if (this._events[event])
    {
        if (listener) 
        {
            for (var i = 0; i < this._events[event].length; i++)
                if (this._events[event][i].listener == listener)
                    break;
                
            this._listeners[event].splice(i, 1); //remove first
        }
        else
            this._listeners[event] = []; //remove all
    }    
};
Sage.TaskPaneItem.prototype.purgeListeners = function() {
    this._events = {};
};
Sage.TaskPaneItem.prototype.fireEvent = function(event, args) {
    if (this._events[event])
        for (var i = 0; i < this._events[event].length; i++)
            this._events[event][i].listener.apply(this._events[event][i].context || this._events[event][i].listener, args);  
};
Sage.TaskPaneItem.prototype.toggle = function() {
    var collapsed = this.getIsCollapsed();
    
    if (collapsed)
    {    
        $(this.getElement())
            .removeClass("task-pane-item-collapsed")
            .find(".task-pane-item-toggler")
            .attr("title", TaskPaneResources.Minimize)
            .find("img")
            .attr("src", this.getWorkspace().getOptions().MinimizeImage);               
        collapsed = false;
    }
    else
    {
        $(this.getElement())
            .addClass("task-pane-item-collapsed")
            .find(".task-pane-item-toggler")
            .attr("title", TaskPaneResources.Maximize)
            .find("img")
            .attr("src", this.getWorkspace().getOptions().MaximizeImage);
        collapsed = true;
    }
    
    this.fireEvent("toggled", [this, {collapsed: collapsed}]);
    
    //TODO: notify workspace of state change
    this.setIsCollapsed(collapsed);
    this.getWorkspace().persistState();
};

Sage.TaskPaneWorkspace = function(options) {
    this._options = options;  
    this._cache = {};
    this._items = [];    
    this._lookup = {
        byId: {},
        byClientId: {}
    };
    
    for (var i = 0; i < options.Items.length; i++)
    {
        var item = new Sage.TaskPaneItem(this, options.Items[i]);  
        this._lookup.byId[item.getId()] = item;
        this._lookup.byClientId[item.getClientId()] = item;
        
        this._items.push(item);
    }
    
    Sage.TaskPaneWorkspace.registerInstance({id: options.Id, clientId: options.ClientId}, this);
};

Sage.TaskPaneWorkspace.__instances = {byId: {}, byClientId: {}}; 
Sage.TaskPaneWorkspace.registerInstance = function(options, instance) { 
    Sage.TaskPaneWorkspace.__instances.byId[options.id] = instance;
    Sage.TaskPaneWorkspace.__instances.byClientId[options.clientId] = instance;   
}; 

Sage.TaskPaneWorkspace.getInstance = function(id) {
    return Sage.TaskPaneWorkspace.__instances.byId[id];  
};

Sage.TaskPaneWorkspace.getInstanceFromClientId = function(clientId) {
    return Sage.TaskPaneWorkspace.__instances.byClientId[clientId];
};

Sage.TaskPaneWorkspace.prototype.getId = function() { return this._options.Id; };
Sage.TaskPaneWorkspace.prototype.getClientId = function() { return this._options.ClientId; };
Sage.TaskPaneWorkspace.prototype.getUIStateServiceKey = function() { return this._options.UIStateServiceKey; };
Sage.TaskPaneWorkspace.prototype.getUIStateServiceProxyType = function() { return this._options.UIStateServiceProxyType; };
Sage.TaskPaneWorkspace.prototype.getOptions = function() { return this._options; };
Sage.TaskPaneWorkspace.prototype.getContext = function() { return this._context; };
Sage.TaskPaneWorkspace.prototype.getCache = function() { return this._cache; };
Sage.TaskPaneWorkspace.prototype.getItems = function() { return this._items; };
Sage.TaskPaneWorkspace.prototype.getItem = function(id) { return this._lookup.byId[id]; };
Sage.TaskPaneWorkspace.prototype.getItemFromClientId = function(id) { return this._lookup.byClientId[id]; };

Sage.TaskPaneWorkspace.prototype.initRequestManagerEvents = function() {
    var prm = Sys.WebForms.PageRequestManager.getInstance();
    prm.add_pageLoading(function(sender, args) {
        var panels = args.get_panelsUpdating();
        if (panels)
        {            
            for (var i = 0; i < panels.length; i++)
            {
                var $parent = $(panels[i]).parent(".task-pane");
                if ($parent.length > 0)
                {
                    var id = $parent.attr("id");
                    var instance = Sage.TaskPaneWorkspace.getInstanceFromClientId(id);
                    if (instance)
                    {
                        instance.purgeListeners();                        
                    }       
                }
            }            
        }
    });
    prm.add_pageLoaded(function(sender, args) {        
        var panels = args.get_panelsUpdated();
        if (panels)
        {            
            for (var i = 0; i < panels.length; i++)
            {
                var $parent = $(panels[i]).parent(".task-pane");
                if ($parent.length > 0)
                {
                    var id = $parent.attr("id");
                    var instance = Sage.TaskPaneWorkspace.getInstanceFromClientId(id);
                    if (instance)
                    {
                        instance.initContext();
                        instance.initCaches();
                        instance.initInteractions();
                        instance.updateVisualStyles();
                    }       
                }
            }            
        }
    });   
};

Sage.TaskPaneWorkspace.prototype.init = function() {
    var self = this;
    
    this.initRequestManagerEvents();
    this.initContext();
    this.initCaches();
    this.initInteractions();
        
    this.updateVisualStyles();  
};

Sage.TaskPaneWorkspace.prototype.purgeListeners = function() {
    for (var i = 0; i < this._items.length; i++)
        this._items[i].purgeListeners();
};

Sage.TaskPaneWorkspace.prototype.initContext = function() {
    if (document.getElementById)
        this._context = document.getElementById(this.getClientId());
};

Sage.TaskPaneWorkspace.prototype.initCaches = function() {
    this._cache.items = $(".task-pane-item:not(.ui-sortable-helper)", this._context);
    this._cache.headers = $(".task-pane-item-header:not(.ui-sortable-helper)", this._context);
};

Sage.TaskPaneWorkspace.prototype.initInteractions = function() {
    var self = this;
    
    jQuery.each(this.getItems(), function() {
        $(this.getElement()).find(".task-pane-item-toggler").bind("click", this, function(e) {
            e.data.toggle();
        });    
    });   
    
    /* nothing to sort if there are no items - sortable will throw otherwise */
    var container = this.getOptions().SortDragContainer || $(this._context).parent().attr("id");    
    if (container)
        container = "#" + container;          
    else
        container = "parent";  
            
    if (this.getItems().length > 0)
    {
        $(".task-pane-item-container", this._context).sortable({
            axis: "y",
            items: ".task-pane-item",
            handle: ".task-pane-item-handle",
            revert: false,
            containment: container,
            helper: function(e, el) {
                var handle = $(el).find(".task-pane-item-handle");
                var clone = handle.clone()
                    .addClass("task-pane-drag-helper")
                    .css("width", handle.width() + "px");
                
                return clone.get(0);
            },
            delay: 50,
            scroll: true,
            update: function(e, ui) {
                self.initCaches(); //re-sync caches
                self.updateVisualStyles();
                self.persistState();
            }
        });
    }
};

Sage.TaskPaneWorkspace.prototype.updateVisualStyles = function() {
    //set first & last styling
    this._cache.items.removeClass("task-pane-item-first task-pane-item-last");
    this._cache.items.filter(":first").addClass("task-pane-item-first");
    this._cache.items.filter(":last").addClass("task-pane-item-last");
};

Sage.TaskPaneWorkspace.prototype.buildState = function() {
    var self = this;
    var state = {
        Order: [],
        Collapsed: []
    };
    this._cache.items.each(function() {
        var item = self.getItemFromClientId(this.id); 
        
        state.Order.push(item.getId());
        if ($(this).hasClass("task-pane-item-collapsed"))  
            state.Collapsed.push(item.getId());       
    });
    
    return state;
};

Sage.TaskPaneWorkspace.prototype.persistState = function() {
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "UIStateService.asmx/StoreTaskPaneWorkspaceState",
        data: Ext.util.JSON.encode({
            key: this.getUIStateServiceKey(),
            state: this.buildState()
        }),
        dataType: "json",
        error: function (request, status, error) {            
        },
        success: function(data, status) {            
        }
    });
};
