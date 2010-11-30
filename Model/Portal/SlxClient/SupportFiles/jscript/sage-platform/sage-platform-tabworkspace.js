/*
$.ui.plugin.add("draggable", "simpleScroll", {
    drag : function(e,ui) {    
        var o = ui.options;
        o.simpleScrollSensitivity = o.simpleScrollSensitivity || 48;
	    
        var scroll = { x : $(document).scrollLeft(), y : $(document).scrollTop() };
        var pos = { x : ui.absolutePosition.left, y : ui.instance.position.top };
        var win = { width : $(window).width(), height : $(window).height() };
	    
        if ((pos.y - scroll.y) > (win.height - o.simpleScrollSensitivity))
            window.scrollBy(0, (pos.y - scroll.y) - (win.height - o.simpleScrollSensitivity));
	        
        if ((pos.y - scroll.y) < (o.simpleScrollSensitivity))
            window.scrollBy(0, (pos.y - scroll.y) - (o.simpleScrollSensitivity));	   	    	    
    }
});
*/
/*
var state = { 
        MiddleTabs : [],
        MainTabs : [],
        MoreTabs : []        
    };
*/
Sage.TabWorkspaceState = function(state) {
    this._state = state;
    this._wasTabUpdated = new Object;
    this._hiddenTabs = new Object;      
    this._collections = ['MiddleTabs', 'MainTabs', 'MoreTabs'];
    this._collectionActiveRef = {'MainTabs' : 'ActiveMainTab', 'MoreTabs' : 'ActiveMoreTab'};
    
    //sync the dictionary with the list
    for (var i = 0; i < this._state.UpdatedTabs.length; i++)
        this._wasTabUpdated[this._state.UpdatedTabs[i]] = true;
    
    for (var i = 0; i < this._state.HiddenTabs.length; i++)
        this._hiddenTabs[this._state.HiddenTabs[i]] = true;    
        
};

Sage.TabWorkspaceState.MIDDLE_TABS = 'MiddleTabs';
Sage.TabWorkspaceState.MAIN_TABS = 'MainTabs';
Sage.TabWorkspaceState.MORE_TABS = 'MoreTabs';

Sage.TabWorkspaceState.deserialize = function(value) {    
    try
    {
        var state = Sys.Serialization.JavaScriptSerializer.deserialize(value);
        return new Sage.TabWorkspaceState(state);
    }
    catch (e)
    {
        return null;
    }
};

Sage.TabWorkspaceState.prototype.serialize = function() {
    return Sys.Serialization.JavaScriptSerializer.serialize(this._state);
};

Sage.TabWorkspaceState.prototype.getObject = function() {
    return this._state;
};

Sage.TabWorkspaceState.prototype.getSectionFor = function(target) {
    if (this.isMiddleTab(target))
        return Sage.TabWorkspaceState.MIDDLE_TABS;
    if (this.isMainTab(target))
        return Sage.TabWorkspaceState.MAIN_TABS;
    if (this.isMoreTab(target))
        return Sage.TabWorkspaceState.MORE_TABS;
    return false;
};

Sage.TabWorkspaceState.prototype._isTab = function(collection, target) {
    if (typeof this._state[collection] != "object")
        return;
        
    for (var i in this._state[collection])
        if (this._state[collection][i] == target)
            return true;
    return false;
};

Sage.TabWorkspaceState.prototype._removeFromTabs = function(collection, target) {
    if (typeof this._state[collection] != "object")
        return;
        
    var result = [];
    jQuery.each(this._state[collection], function(i, value) {
        if (value != target)
            result.push(value);
    });
    this._state[collection] = result;
    
    //if the collection is question has an active reference, and that value is set to the target, set it to null
    if (typeof this._collectionActiveRef[collection] != 'undefined')
        if (this._state[this._collectionActiveRef[collection]] == target)
            this._state[this._collectionActiveRef[collection]] = null;
};

Sage.TabWorkspaceState.prototype._addToTabs = function(collection, target, at, step) {
    if (typeof this._state[collection] != "object")
        return;
        
    //remove it from the other collections
    for (var other in this._collections)
        if (other != collection)
            this._removeFromTabs(this._collections[other], target);
        
    if (typeof at != 'undefined')
    {
        if (typeof at == 'number')
        {
            this._state[collection].splice(at, 0, target);
        }
        else
        {
            var insertAt = this._state[collection].length;
            jQuery.each(this._state[collection], function(i, value) {
                if (value == at)
                {
                    insertAt = i;
                    return false;
                }
            });
            
            if (typeof step == 'number')
                insertAt = insertAt + step;
            
            this._state[collection].splice(insertAt, 0, target);
        }
    }
    else
    {
        this._state[collection].push(target);
    }
};

Sage.TabWorkspaceState.prototype.isMiddleTab = function(target) { 
    return this._isTab(Sage.TabWorkspaceState.MIDDLE_TABS, target); 
};

Sage.TabWorkspaceState.prototype.removeFromMiddleTabs = function(target) { 
    this._removeFromTabs(Sage.TabWorkspaceState.MIDDLE_TABS, target); 
};

Sage.TabWorkspaceState.prototype.addToMiddleTabs = function(target, at, step) { 
    this._addToTabs(Sage.TabWorkspaceState.MIDDLE_TABS, target, at, step); 
};

Sage.TabWorkspaceState.prototype.isMainTab = function(target) { 
    return this._isTab(Sage.TabWorkspaceState.MAIN_TABS, target); 
};

Sage.TabWorkspaceState.prototype.removeFromMainTabs = function(target) { 
    this._removeFromTabs(Sage.TabWorkspaceState.MAIN_TABS, target); 
};

Sage.TabWorkspaceState.prototype.addToMainTabs = function(target, at, step) { 
    this._addToTabs(Sage.TabWorkspaceState.MAIN_TABS, target, at, step); 
};

Sage.TabWorkspaceState.prototype.setActiveMainTab = function(target) { 
    this._state.ActiveMainTab = target; 
};

Sage.TabWorkspaceState.prototype.getActiveMainTab = function() { 
    return this._state.ActiveMainTab; 
};

Sage.TabWorkspaceState.prototype.isMoreTab = function(target) { 
    return this._isTab(Sage.TabWorkspaceState.MORE_TABS, target); 
};

Sage.TabWorkspaceState.prototype.removeFromMoreTabs = function(target) { 
    this._removeFromTabs(Sage.TabWorkspaceState.MORE_TABS, target); 
};

Sage.TabWorkspaceState.prototype.addToMoreTabs = function(target, at, step) { 
    this._addToTabs(Sage.TabWorkspaceState.MORE_TABS, target, at, step); 
};

Sage.TabWorkspaceState.prototype.setActiveMoreTab = function(target) { 
    this._state.ActiveMoreTab = target; 
};

Sage.TabWorkspaceState.prototype.getActiveMoreTab = function() { 
    return this._state.ActiveMoreTab; 
};

Sage.TabWorkspaceState.prototype.getMainTabs = function() {
    return this._state.MainTabs;
};

Sage.TabWorkspaceState.prototype.getMoreTabs = function() {
    return this._state.MoreTabs;
};

Sage.TabWorkspaceState.prototype.getMiddleTabs = function() {
    return this._state.MiddleTabs;
};

Sage.TabWorkspaceState.prototype.getUpdatedTabs = function() {
    return this._state.UpdatedTabs;
};

Sage.TabWorkspaceState.prototype.markTabUpdated = function(target) {
    if (this._wasTabUpdated[target])
        return;
         
    this._wasTabUpdated[target] = true;
    this._state.UpdatedTabs.push(target);
};

Sage.TabWorkspaceState.prototype.wasTabUpdated = function(target) {
    return this._wasTabUpdated[target];
};

Sage.TabWorkspaceState.prototype.clearUpdatedTabs = function() {
    this._wasTabUpdated = new Object;
    this._state.UpdatedTabs = [];
};

Sage.TabWorkspaceState.prototype.getHiddenTabs = function() {
    return this._state.HiddenTabs;
};
Sage.TabWorkspaceState.prototype.InHideMode = function() {
    return this._state.InHideMode;
};
Sage.TabWorkspace = function(config) {
    this._id = config.id;
    this._clientId = config.clientId;
    this._afterPostBackActions = [];       
    this._info = config.info;
    this._state = new Sage.TabWorkspaceState(config.state);            
    this._textSelectionDisabled = false;      
    this._debug = false;     
    this._regions = {}; 
    this._middleRegionDropTolerance = 20;
    this._offsetParent = false;
    this._offsetParentScroll = -1;
    
    this.compileInfoLookups();
    
    Sage.TabWorkspace.superclass.constructor.apply(this);
    
    this.addEvents(
        'maintabchange',
        'moretabchange'        
    );
};

Ext.extend(Sage.TabWorkspace, Ext.util.Observable);

Sage.TabWorkspace.MORE_TAB_ID = "More";
Sage.TabWorkspace.MAIN_AREA = "main";
Sage.TabWorkspace.MORE_AREA = "more";
Sage.TabWorkspace.MIDDLE_AREA = "middle";

Sage.TabWorkspace.prototype.compileInfoLookups = function() {
    this._info._byId = new Object;
    this._info._byElementId = new Object;
    this._info._byDropTargetId = new Object;
    this._info._byButtonId = new Object;
    this._info._byMoreButtonId = new Object;
    for (var i = 0; i < this._info.Tabs.length; i++)
    {
        this._info._byId[this._info.Tabs[i].Id] = this._info.Tabs[i];
        this._info._byElementId[this._info.Tabs[i].ElementId] = this._info.Tabs[i];
        this._info._byDropTargetId[this._info.Tabs[i].DropTargetId] = this._info.Tabs[i];
        this._info._byButtonId[this._info.Tabs[i].ButtonId] = this._info.Tabs[i];
        this._info._byMoreButtonId[this._info.Tabs[i].MoreButtonId] = this._info.Tabs[i];
    }
};

Sage.TabWorkspace.prototype.getInfoFor = function(tab) { return this._info._byId[tab]; };
Sage.TabWorkspace.prototype.getInfoForTab = function(tabId) { return this._info._byId[tabId]; };
Sage.TabWorkspace.prototype.getInfoForTabElement = function(elementId) { return this._info._byElementId[elementId]; };
Sage.TabWorkspace.prototype.getInfoForTabDropTarget = function(dropTargetId) { return this._info._byDropTargetId[dropTargetId]; };
Sage.TabWorkspace.prototype.getInfoForTabButton = function(buttonId) { return this._info._byButtonId[buttonId]; };
Sage.TabWorkspace.prototype.getInfoForTabMoreButton = function(buttonId) { return this._info._byMoreButtonId[buttonId]; };
Sage.TabWorkspace.prototype.getStateProxyTriggerId = function() { return this._info.ProxyTriggerId; };
Sage.TabWorkspace.prototype.getStateProxyPayloadId = function() { return this._info.ProxyPayloadId; };
Sage.TabWorkspace.prototype.getDragHelperContainerId = function() { return this._info.DragHelperContainerId; };
Sage.TabWorkspace.prototype.getUseUIStateService = function() { return this._info.UseUIStateService; };
Sage.TabWorkspace.prototype.getUIStateServiceKey = function() { return this._info.UIStateServiceKey; };
Sage.TabWorkspace.prototype.getUIStateServiceProxyType = function() { return this._info.UIStateServiceProxyType; };
Sage.TabWorkspace.prototype.getAllDropTargets = function() { return this._allDropTargets; };
Sage.TabWorkspace.prototype.getAllMainButtons = function() { return this._allMainButtons; };
Sage.TabWorkspace.prototype.getAllMoreButtons = function() { return this._allMoreButtons; };

Sage.TabWorkspace.prototype.getElement = function() {
    if (document.getElementById)
        return document.getElementById(this._clientId);
    return null;
};

Sage.TabWorkspace.prototype.getContext = function() { return this._context; };
Sage.TabWorkspace.prototype.getState = function() { return this._state; };
Sage.TabWorkspace.prototype.setState = function(state) { this._state = state; };

Sage.TabWorkspace.prototype.resetState = function(state)
{
	if (typeof state === "undefined")
	{
		var stateProxy = $("#" + this.getStateProxyPayloadId(), this.getContext()).val();
		if (stateProxy == "")
		{
			this.setState(this.getState());
		}
		else
		{
			this.setState(Sage.TabWorkspaceState.deserialize(stateProxy)); 
		} 
	}
	else if (typeof state === "string")
	{
		this.setState(Sage.TabWorkspaceState.deserialize(state));
	}
	this.logDebug("Reset state...");
};

Sage.TabWorkspace.prototype.logDebug = function(text) {
    if (this._debug)
    {
        var pad = function(value, length) {
            value = value.toString();
            while (value.length < length)
                value = "0" + value;
            return value;
        };
        var date = new Date();
        var dateString = pad(date.getHours(),2) + ":" + pad(date.getMinutes(),2) + ":" + pad(date.getSeconds(),2) + "." + pad(date.getMilliseconds(),3);
        $("#debug_log").append(dateString + " - " + text + "<br />");
    }
};

Sage.TabWorkspace.prototype.registerAfterPostBackAction = function(action) {
    this._afterPostBackActions.push(action);
};

Sage.TabWorkspace.prototype.init = function() { 
    this.logDebug("[enter] init"); 
    
    //cache common lookups               
    if (document.getElementById)
        this._context = document.getElementById(this._clientId);    
        
    if (this._context)
        this._offsetParent = $(this._context).offsetParent();
    
    this._allDropTargets = $("div.tws-drop-target", this._context);
    this._allMainButtons = $("li.tws-tab-button", this._context);
    this._allMoreButtons = $("li.tws-more-tab-button", this._context);
    this._mainButtonContainer = $("div.tws-main-tab-buttons", this._context);
    this._mainButtonContainerRegion = this.createRegionsFrom(this._mainButtonContainer)[0];
    this._moreButtonContainer = $("div.tws-more-tab-buttons-container", this._context);
    this._moreButtonContainerRegion = this.createRegionsFrom(this._moreButtonContainer)[0];
    
    this.getState().clearUpdatedTabs();
    for (var i = 0; i < this.getState().getMiddleTabs().length; i++)
        this.getState().markTabUpdated(this.getState().getMiddleTabs()[i]);
        
    if (this.getState().getActiveMainTab())
        this.getState().markTabUpdated(this.getState().getActiveMainTab());         
    
    if (this.getState().getActiveMainTab() == Sage.TabWorkspace.MORE_TAB_ID) 
        if (this.getState().getActiveMoreTab())
            this.getState().markTabUpdated(this.getState().getActiveMoreTab());
        
    //store the helper height & width   
    this._dragHelperHeight = $(".tws-tab-drag-helper", this.getContext()).height();
    this._dragHelperWidth = $(".tws-tab-drag-helper", this.getContext()).width();  
        
    this.logDebug("[enter] initEvents");
    this.initEvents();
    this.logDebug("[leave] initEvents");
    this.logDebug("[enter] initDragDrop");
    this.initDragDrop();
    this.logDebug("[leave] initDragDrop");
    this.logDebug("[leave] init");
    this.hideTabs();
};

Sage.TabWorkspace.prototype.initEvents = function() {
    var self = this; //since jQuery overrides "this" in the closure        
    
    //setup the update events
    //will need to refactor this to use add_endRequest instead
    var prm = Sys.WebForms.PageRequestManager.getInstance();
    prm.add_endRequest(function(sender, args) {  
        self.setupAllTabElementDraggables();
        self.hideTabs();
    });   
    
    prm.add_beginRequest(function(sender, args) {
        self.cleanupAllTabElementDraggables();
    });
};

Sage.TabWorkspace.prototype.hideTabs = function() 
{
     if(!this.getState().InHideMode())
     {
        return;
     } 
     for (var i = 0; i < this.getState().getMiddleTabs().length; i++)
     {
        var tab =this.getState().getMiddleTabs()[i];                
        this.unHideTab(tab);       
     } 
     
     for (var i = 0; i < this.getState().getMoreTabs().length; i++)
     {
        var tab =this.getState().getMoreTabs()[i];                
        this.unHideTab(tab);       
     } 
     
     for (var i = 0; i < this.getState().getMainTabs().length; i++)
     {
        var tab =this.getState().getMainTabs()[i];                
        this.unHideTab(tab);       
     } 
          
     for (var i = 0; i < this.getState().getHiddenTabs().length; i++)
     {
        var tab =this.getState().getHiddenTabs()[i];                
        this.hideTab(tab);       
     }
};

Sage.TabWorkspace.prototype.hideTab = function(tab) {
    this.logDebug("[enter] hideTab");
    if (typeof tab === "string")
        tab = this.getInfoFor(tab);
       
            
    switch (this.getState().getSectionFor(tab.Id))
    {
        case Sage.TabWorkspaceState.MAIN_TABS:                   
            
            $("#" + tab.ButtonId, this.getContext()).hide(); 
            $("#" + tab.ElementId, this.getContext()).hide();
            break;
            
        case Sage.TabWorkspaceState.MORE_TABS:
              
            $("#" + tab.MoreButtonId, this.getContext()).hide();
            $("#" + tab.ElementId, this.getContext()).hide();
            break;
            
        case Sage.TabWorkspaceState.MIDDLE_TABS:                 
            $("#" + tab.ElementId, this.getContext()).hide();
            break;
     }  
     
};

Sage.TabWorkspace.prototype.unHideTab = function(tab) {
    this.logDebug("[enter] hideTab");
    if (typeof tab === "string")
        tab = this.getInfoFor(tab);
       
    switch (this.getState().getSectionFor(tab.Id))
    {
        case Sage.TabWorkspaceState.MAIN_TABS:                   
            
            $("#" + tab.ButtonId, this.getContext()).show();
            if (this.getState().getActiveMainTab() == tab.Id)
            {
               $("#" + tab.ElementId, this.getContext()).show();       
            }
            
            break;
            
        case Sage.TabWorkspaceState.MORE_TABS:
                    
            $("#" + tab.MoreButtonId, this.getContext()).show();
            if (this.getState().getActiveMoreTab() == tab.Id)
            {
               $("#" + tab.ElementId, this.getContext()).show();       
            }
            break;
            
        case Sage.TabWorkspaceState.MIDDLE_TABS:                 
                        
             $("#" + tab.ElementId, this.getContext()).show();          
                              
            break;
     }  
     
};


Sage.TabWorkspace.prototype.disablePageTextSelection = function() {
    if (jQuery.browser.msie)
    {
        if (!this._textSelectionDisabled)
        {                
            this._oldBodyOnDrag = document.body.ondrag;
            this._oldBodyOnSelectStart = document.body.onselectstart;
            
            document.body.ondrag = function () { return false; };
            document.body.onselectstart = function () { return false; };
            
            this._textSelectionDisabled = true;
        }
    }
};

Sage.TabWorkspace.prototype.enablePageTextSelection = function() {
    if (jQuery.browser.msie)
    {
        if (this._textSelectionDisabled)
        {        
            document.body.ondrag = this._oldBodyOnDrag;
            document.body.onselectstart = this._oldBodyOnSelectStart;
            
            this._textSelectionDisabled = false;
        }
    }
};

Sage.TabWorkspace.prototype.setDragDropHelperText = function(helper, text) {
    if (typeof text != "string")
        return;
            
    $(".tws-drag-helper-text", helper).html(text);
}

Sage.TabWorkspace.prototype.setupTabElementDraggable = function(tab) {
    var self = this;
        
    var $query;      
    if (typeof tab == 'string')
        $query = $("#" + this.getInfoFor(tab).ElementId, this.getContext());
    else if (typeof target == 'object')
        $query = tab.ElementId;
        
    if ($query.is(".ui-draggable"))
        return;
           
    if (typeof tab === "string")
        this.logDebug("Setting up tab element draggable for " + tab + ".");
    else
        this.logDebug("Setting up tab element draggable for " + tab.Id + ".");
            
    $query.draggable({        
        handle : ".tws-tab-view-header",
        cursor : "move",
        cursorAt : { top : self._dragHelperHeight / 2, left : self._dragHelperWidth / 2 },
        zIndex : 15000,  
        delay: 50,    
        opacity : 0.5,
        scroll: true,
        refreshPositions: true,
        appendTo : "#" + self.getDragHelperContainerId(),
        helper : function() {             
            return self.createDraggableHelper(); 
        },
        start : function(e, ui) {        
            this._context = self.getInfoForTabElement(this.id);
            this._overDraggable = false;
            
            $(ui.helper).data("over", 0);
            
            self.disablePageTextSelection();                          
            self.setDragDropHelperText(ui.helper, this._context.Name);     
        },
        stop : function(e, ui) {
            self.enablePageTextSelection();
        }
    });
};

Sage.TabWorkspace.prototype.cleanupTabElementDraggable = function(tab) {
    var $query;      
    if (typeof tab == 'string')
        $query = $("#" + this.getInfoFor(tab).ElementId, this.getContext());
    else if (typeof target == 'object')
        $query = tab.ElementId;
    
    if (!$query.is(".ui-draggable"))
            return;
            
    if (typeof tab === "string")
        this.logDebug("Cleaning up tab element draggable for " + tab + ".");
    else
        this.logDebug("Cleaning up tab element draggable for " + tab.Id + ".");
    
    $query.draggable("destroy");                        
};

Sage.TabWorkspace.prototype.setupAllTabElementDraggables = function() {
    for (var i = 0; i < this.getState().getMiddleTabs().length; i++)
        this.setupTabElementDraggable(this.getState().getMiddleTabs()[i]);
        
    if (this.getState().getActiveMainTab() && this.getState().getActiveMainTab() != Sage.TabWorkspace.MORE_TAB_ID)
        this.setupTabElementDraggable(this.getState().getActiveMainTab());
    
    if (this.getState().getActiveMoreTab())
        this.setupTabElementDraggable(this.getState().getActiveMoreTab());   
};

Sage.TabWorkspace.prototype.cleanupAllTabElementDraggables = function() {
    //only updated tabs should have tab element draggables
    for (var i = 0; i < this.getState().getUpdatedTabs().length; i++)
        this.cleanupTabElementDraggable(this.getState().getUpdatedTabs()[i]);
};

Sage.TabWorkspace.prototype.createMainInsertMarker = function(el, at) {          
    if (el)
    {
        var marker = $("<div class=\"tws-insert-button-marker\"></div>").css({ top: (at.top - 24) + "px", left: (at.left - 12) + "px" });
        $("div.tws-main-tab-buttons", this.getContext()).append(marker);
        el._marker = marker;
    }
};

Sage.TabWorkspace.prototype.cleanupMainInsertMarker = function(el) {
    if (el && el._marker)
    {
        el._marker.remove();
        el._marker = null;
    }
};

Sage.TabWorkspace.prototype.createMoreInsertMarker = function(el, at) {          
    if (el)
    {
        var marker = $("<div class=\"tws-insert-button-marker\"></div>").css({ top : (at.top - 12) + "px" });
        $("div.tws-more-tab-buttons-container", this.getContext()).append(marker);
        el._marker = marker;
    }
};

Sage.TabWorkspace.prototype.cleanupMoreInsertMarker = function(el) {
    if (el && el._marker)
    {
        el._marker.remove();
        el._marker = null;
    }
};

Sage.TabWorkspace.prototype.getContextFromUI = function(ui) {    
    return ui.draggable.get(0)._context;  
};

Sage.TabWorkspace.prototype.getRegions = function(area) {
    return this._regions[area];
};

Sage.TabWorkspace.prototype.createRegionsFrom = function(list) {
    var regions = [];
    list.each(function() {
        var el = $(this);
        regions.push({ 
            x: el.offset().left,
            y: el.offset().top,
            width: el.width(),
            height: el.height(),
            el: this
        });
    });
    
    return regions;
};

Sage.TabWorkspace.prototype.testRegions = function(regions, pos, test) {
    var list = (typeof regions === "string") ? this._regions[regions] : regions;
    if (list && list.length && typeof test === "function")
    {
        for (var i = 0; i < list.length; i++)
        {
            if (test(list[i], pos))
                return list[i].el;
        }
    }
    
    return null;
};

Sage.TabWorkspace.prototype.setDroppableOn = function(draggable, id, droppable) {
    if (typeof draggable._droppables === "undefined")
        draggable._droppables = {};
        
    draggable._droppables[id] = droppable;
};

Sage.TabWorkspace.prototype.getDroppableFrom = function(draggable, id) {
    if (draggable._droppables)
        return draggable._droppables[id];
};

Sage.TabWorkspace.prototype.updateOffsetParentScroll = function() {
    this._offsetParentScroll = $(this._offsetParent).scrollTop();
};

Sage.TabWorkspace.prototype.shouldUpdateRegions = function() {
    if (this._offsetParent) 
    {
        if (this._offsetParentScroll != $(this._offsetParent).scrollTop())
        {
            this._offsetParentScroll = $(this._offsetParent).scrollTop();
            return true;
        }
    }
    
    return false;
};

Sage.TabWorkspace.prototype.initDragDrop = function() {
    var self = this;    
    
    /*****************************/
    /*** DROP TARGET DROPPABLE ***/
    /*****************************/
    $("div.tws-middle-section", this.getContext()).droppable({
        /* accept : ".tws-tab-button:not(#show_More),.tws-more-tab-button,.tws-tab-element", */
        accept : ".tws-tab-button,.tws-more-tab-button,.tws-tab-element",
        tolerance : "pointer",
        activate : function(e, ui) {
            self.logDebug("Activate MiddleSection");
            
            //add our instance to the draggable
            self.setDroppableOn(ui.draggable.get(0), Sage.TabWorkspace.MIDDLE_AREA, ui.options);
                        
            self._allDropTargets.filter("div.tws-middle-section div.tws-drop-target").addClass("tws-drop-target-active");
        },    
        deactivate : function(e, ui) {
            self.logDebug("De-Activate MiddleSection");
                        
            self._allDropTargets.filter("div.tws-middle-section div.tws-drop-target").removeClass("tws-drop-target-active");
            
            ui.draggable.unbind('drag', ui.options.track);             
            ui.options._targets = null;
            ui.options._current = null;            
        },
        over : function(e, ui) {
            self.logDebug("Over MiddleSection");
                        
            var regions = self.createRegionsFrom(self.getAllDropTargets().filter(":visible"));
            var draggable = ui.draggable.get(0);
            var pos = { y: e.pageY, x: e.pageX };  
            var el = self.testRegions(regions, pos, function(r, p) { return (p.y > (r.y - self._middleRegionDropTolerance) && p.y <= (r.y + r.height + self._middleRegionDropTolerance)) });
            
            if (el)
            {
                $(el).addClass("tws-drop-target-hover");                 
                $(ui.helper).data("over", $(ui.helper).data("over") + 1);     
                $(ui.helper).addClass("tws-drag-helper-valid");                                   
            }

            ui.options._targets = regions;
            ui.options._currentTarget = (el) ? el : null;
            ui.draggable.bind('drag', ui.options.track);
        },
        out : function(e, ui) {
            self.logDebug("Out MiddleSection");
            
            var draggable = ui.draggable.get(0);
            
            self._allDropTargets.removeClass("tws-drop-target-hover");
            
            $(ui.helper).data("over", $(ui.helper).data("over") - 1);
            if ($(ui.helper).data("over") <= 0)
            {
                $(ui.helper).data("over", 0);            
                $(ui.helper).removeClass("tws-drag-helper-valid"); 
            }
                                                                        
            ui.draggable.unbind('drag', ui.options.track);
            ui.options._targets = null;
            ui.options._currentTarget = null;
        },
        drop : function(e, ui) {
            self.logDebug("Drop MiddleSection");
            
            var context = self.getContextFromUI(ui);    
            var target = ui.options._currentTarget;
 
            self._allDropTargets.removeClass("tws-drop-target-hover");            
            $(ui.helper).removeClass("tws-drag-helper-valid");
            
            if (target)           
                self.dropToMiddleSection(context, target);                
        },
        track : function(e, ui) {          
            var draggable = this;
            var droppable = self.getDroppableFrom(draggable, Sage.TabWorkspace.MIDDLE_AREA);
            var pos = { y: e.pageY, x: e.pageX };
            var el = self.testRegions(droppable._targets, pos, function(r, p) { return (p.y > (r.y - self._middleRegionDropTolerance) && p.y <= (r.y + r.height + self._middleRegionDropTolerance)) });

            if (droppable._currentTarget != el)
            {
                var last = droppable._currentTarget;
                if (last) 
                {
                    $(ui.helper).removeClass("tws-drag-helper-valid");
                    $(last).removeClass("tws-drop-target-hover");
                }
                    
                if (el)                                
                {
                    $(ui.helper).addClass("tws-drag-helper-valid");
                    $(el).addClass("tws-drop-target-hover");
                }
                
                droppable._currentTarget = el;
            }
        }
    });
    
    /*****************************/
    /* MAIN BUTTON BAR DROPPABLE */
    /*****************************/
    $("div.tws-main-tab-buttons", this.getContext()).droppable({
        accept : ".tws-tab-button,.tws-more-tab-button,.tws-tab-element",                      
        tolerance : "pointer",
        activate : function(e, ui) {
            self.logDebug("Activate MainButtonBar");
            
            //not functional in ui 1.5 - is there an equivalent and is it needed?    
            //ui.instance.proportions.width = ui.instance.element.width();
            //ui.instance.proportions.height = ui.instance.element.height(); 
            
            self.updateMainAreaRegions(); 
            
            self.setDroppableOn(ui.draggable.get(0), Sage.TabWorkspace.MAIN_AREA, ui.options);                        
        },
        deactivate : function(e, ui) {
            self.logDebug("De-Activate MainButtonBar");
            
            self.cleanupMainInsertMarker(ui.draggable.get(0));
            
            ui.draggable.unbind('drag', ui.options.track);
            ui.options._targets = null;
            ui.options._currentTarget = null;            
        },
        over : function(e, ui) {      
            self.logDebug("Over main button bar event occured for " + self.getContextFromUI(ui).Id);                                             
            
            $(ui.helper).data("over", $(ui.helper).data("over") + 1);     
            $(ui.helper).addClass("tws-drag-helper-valid");   
            
            var regions = self.getRegions(Sage.TabWorkspace.MAIN_AREA);
            var pos = { y: e.pageY, x: e.pageX };  
            var el = self.testRegions(regions, pos, function(r, p) {
                return (p.x > r.x && p.x <= (r.x + r.width) &&
                        p.y > r.y && p.y <= (r.y + r.height));
            });
            var position = {};
                if (el)
                    position = $(el, self.getContext()).position();
                else
                    position = $(".tws-tab-button-tail", self.getContext()).position();                        
            
            self.cleanupMainInsertMarker(ui.draggable.get(0)); 
            self.createMainInsertMarker(ui.draggable.get(0), position);
            
            ui.options._targets = regions;
            ui.options._currentTarget = null;
            ui.draggable.bind('drag', ui.options.track);
        },
        out : function(e, ui) {
            self.logDebug("Out MainButtonBar");
            
            $(ui.helper).data("over", $(ui.helper).data("over") - 1);
            if ($(ui.helper).data("over") <= 0)
            {
                $(ui.helper).data("over", 0);     
                $(ui.helper).removeClass("tws-drag-helper-valid"); 
            }
            
            self.cleanupMainInsertMarker(ui.draggable.get(0));           
                                    
            ui.draggable.unbind('drag', ui.options.track);
            ui.options._targets = null;
            ui.options._currentTarget = null;
        },
        drop : function(e, ui) {    
            self.logDebug("Drop to main event occured for " + self.getContextFromUI(ui).Id);   
            
            var context = self.getContextFromUI(ui);    
            var target = (ui.options._currentTarget) ? ui.options._currentTarget : this;                                                                     
            self.dropToMainSection(context, target);
        },        
        track : function(e, ui) {            
            var draggable = this;
            var droppable = self.getDroppableFrom(draggable, Sage.TabWorkspace.MAIN_AREA);
            var pos = { y: e.pageY, x: e.pageX };  
            var el = self.testRegions(droppable._targets, pos, function(r, p) {
                return (p.x > r.x && p.x <= (r.x + r.width) &&
                        p.y > r.y && p.y <= (r.y + r.height));
            });
           
            if (droppable._currentTarget != el)
            {
                droppable._currentTarget = el;
                
                var position = {};
                if (el)
                    position = $(droppable._currentTarget, self.getContext()).position();
                else
                    position = $(".tws-tab-button-tail", self.getContext()).position();
                
                self.cleanupMainInsertMarker(draggable); 
                self.createMainInsertMarker(draggable, position);
            }            
        }     
    });        
    
    /*****************************/
    /* MORE BUTTON BAR DROPPABLE */
    /*****************************/
    $(".tws-more-tab-buttons", this.getContext()).droppable({
        accept : ".tws-tab-button:not(#show_More),.tws-more-tab-button,.tws-tab-element:not(#element_More)",            
        tolerance : "pointer",
        activate : function(e, ui) {
            self.logDebug("Activate MoreButtonBar");                       
            
            //fix for jQuery 1.5 and size of initially hidden droppables             
                     
            //not functional in ui 1.5 - is there an equivalent and is it needed?    
            //ui.instance.proportions.width = ui.instance.element.width();
            //ui.instance.proportions.height = ui.instance.element.height(); 
            
            self.updateMoreAreaRegions(); 
            
            self.setDroppableOn(ui.draggable.get(0), Sage.TabWorkspace.MORE_AREA, ui.options);
        },
        deactivate : function(e, ui) {
            self.cleanupMoreInsertMarker(ui);    
            
            ui.draggable.unbind('drag', ui.options.track);
            ui.options._targets = null;
            ui.options._currentTarget = null; 
        },
        over : function(e, ui) {
            self.logDebug("Over more button bar event occured for " + self.getContextFromUI(ui).Id);                                             
            
            $(ui.helper).data("over", $(ui.helper).data("over") + 1);     
            $(ui.helper).addClass("tws-drag-helper-valid");   
            
            var regions = self.getRegions(Sage.TabWorkspace.MORE_AREA);
            var pos = { y: e.pageY, x: e.pageX };  
            var el = self.testRegions(regions, pos, function(r, p) { return (p.y > r.y && p.y <= (r.y + r.height)) }); 
            var position = {};
                if (el)
                    position = $(el, self.getContext()).position();
                else
                    position = $(".tws-more-tab-button-tail", self.getContext()).position();
            
            self.cleanupMoreInsertMarker(ui.draggable.get(0)); 
            self.createMoreInsertMarker(ui.draggable.get(0), position); 
            
            ui.options._targets = regions;
            ui.options._currentTarget = null;
            ui.draggable.bind('drag', ui.options.track);                     
        },
        out : function(e, ui) {
            $(ui.helper).data("over", $(ui.helper).data("over") - 1);
            if ($(ui.helper).data("over") <= 0)
            {
                $(ui.helper).data("over", 0);     
                $(ui.helper).removeClass("tws-drag-helper-valid"); 
            }  
            
            self.cleanupMoreInsertMarker(ui.draggable.get(0)); 
            
            ui.draggable.unbind('drag', ui.options.track);
            ui.options._targets = null;
            ui.options._currentTarget = null;                      
        },
        drop : function(e, ui) {    
            self.logDebug("Drop to more event occured for " + self.getContextFromUI(ui).Id);
            
            var context = self.getContextFromUI(ui);    
            var target = (ui.options._currentTarget) ? ui.options._currentTarget : this;                                                                                                   
            self.dropToMoreSection(context, target);
        },          
        track : function(e, ui) {            
            var draggable = this; 
            var droppable = self.getDroppableFrom(draggable, Sage.TabWorkspace.MORE_AREA);
            var pos = { y: e.pageY, x: e.pageX };  
            var el = self.testRegions(droppable._targets, pos, function(r, p) { return (p.y > r.y && p.y <= (r.y + r.height)) }); 
                       
            if (droppable._currentTarget != el)
            {
                droppable._currentTarget = el;
                
                var position = {};
                if (el)
                    position = $(droppable._currentTarget, self.getContext()).position();
                else
                    position = $(".tws-more-tab-button-tail", self.getContext()).position();
                
                self.cleanupMoreInsertMarker(draggable); 
                self.createMoreInsertMarker(draggable, position);
            }            
        }  
    });
    
    /*****************************/
    /*** MAIN BUTTON DRAGGABLE ***/
    /*****************************/    
    $("li.tws-tab-button:not(li.tws-tab-button-tail)", this.getContext()).draggable({
        cursor : "move",
        cursorAt : { top : self._dragHelperHeight / 2, left : self._dragHelperWidth / 2 },
        zIndex : 15000,       
        appendTo : "#" + self.getDragHelperContainerId(),
        //refreshPositions : true,
        opacity: 0.5,
        delay: 50,    
        scroll: true,
        refreshPositions: true,
        helper : function() {             
            return self.createDraggableHelper(); 
        },
        start : function(e, ui) {  
            this._context = self.getInfoForTabButton(this.id);
            this._overDraggable = false;
            
            $(ui.helper).data("over", 0);
            
            self.disablePageTextSelection();            
            self.setDragDropHelperText(ui.helper, this._context.Name);  
        },
        stop : function(e, ui) {
            self.enablePageTextSelection();
        }
    });
    
    /*****************************/
    /*** MORE BUTTON DRAGGABLE ***/
    /*****************************/
    $("li.tws-more-tab-button:not(li.tws-more-tab-button-tail)", this.getContext()).draggable({
        cursor : "move",
        cursorAt : { top : self._dragHelperHeight / 2, left : self._dragHelperWidth / 2 },
        zIndex : 15000,     
        //refreshPositions : true,  
        opacity: 0.5,  
        delay: 50,   
        scroll: true,
        refreshPositions: true,
        appendTo : "#" + self.getDragHelperContainerId(),
        helper : function() {             
            return self.createDraggableHelper(); 
        },
        start : function(e, ui) {  
            this._context = self.getInfoForTabMoreButton(this.id);
            this._overDraggable = false;
            
            $(ui.helper).data("over", 0);
            
            self.disablePageTextSelection();            
            self.setDragDropHelperText(ui.helper, this._context.Name);  
        },
        stop : function(e, ui) {
            self.enablePageTextSelection();
        }
    });       
    
    $("li.tws-tab-button:not(li.tws-tab-button-tail)", this.getContext()).click(function(e) {
        var tab = self.getInfoForTabButton($(this).attr("id"));
        
        self.logDebug("Click event occured for " + tab.Id);
        
        self.showMainTab(tab.Id);
        
        if (e.ctrlKey)
            this.forceUpdateFor(tab.Id);
    });  
    
    $("li.tws-more-tab-button:not(li.tws-more-tab-button-tail)", this.getContext()).click(function(e) {
        var tab = self.getInfoForTabMoreButton($(this).attr("id"));
        
        self.logDebug("Click event occured for " + tab.Id);
        
        self.showMoreTab(tab.Id);
        
        if (e.ctrlKey)
            this.forceUpdateFor(tab.Id);    
    });     
    
    this.updateAllRegions();
    this.setupAllTabElementDraggables();   
};

Sage.TabWorkspace.prototype.createDraggableHelper = function() {
    return $("<div class='tws-tab-drag-helper'><div class='tws-drag-helper-icon' /><div class='tws-drag-helper-text' /></div>");
};

Sage.TabWorkspace.prototype.showMainTab = function(tab, triggerUpdate) { 
    this.logDebug("[enter] showMainTab");
    
    if (typeof tab === "string")
        tab = this.getInfoFor(tab);
        
    var previousMainTabId = this.getState().getActiveMainTab();
    
    //if we are already the active main tab, we do not have to do anything
    if (this.getState().getActiveMainTab() == tab.Id)
    {
        //still optionally trigger an update
        if (typeof triggerUpdate == 'undefined' || triggerUpdate)
            this.triggerUpdateFor(tab.Id); 
        return;
    }
                
    //change state
    this.getState().setActiveMainTab(tab.Id);
      
    /* 
    $(".tws-main-tab-content > .tws-tab-element", this.getContext()).hide();
    $("#" + tab.ElementId, this.getContext()).show();
    $(".tws-main-tab-buttons .tws-tab-button", this.getContext()).removeClass("tws-active-tab-button"); 
    $("#" + tab.ButtonId, this.getContext()).addClass("tws-active-tab-button");
    */
    
    this.showMainTabDom(tab);
    
    if (tab.Id == Sage.TabWorkspace.MORE_TAB_ID)
        if (this.getState().getActiveMoreTab())
            this.showMoreTabDom(this.getState().getActiveMoreTab());
   
    if (typeof triggerUpdate == 'undefined' || triggerUpdate)
            this.triggerUpdateFor(tab.Id);     
            
    this.fireEvent('maintabchange', tab.Id, tab);     
};

Sage.TabWorkspace.prototype.showMainTabDom = function(tab) {
    
    if (typeof tab === "string")
        tab = this.getInfoFor(tab);
        
    $(".tws-main-tab-content > .tws-tab-element", this.getContext()).hide();
    $("#" + tab.ElementId, this.getContext()).show();
    $(".tws-main-tab-buttons .tws-tab-button", this.getContext()).removeClass("tws-active-tab-button"); 
    $("#" + tab.ButtonId, this.getContext()).addClass("tws-active-tab-button");
};

Sage.TabWorkspace.prototype.showMoreTab = function(tab, triggerUpdate) {
    this.logDebug("[enter] showMoreTab");
    
    if (typeof tab === "string")
        tab = this.getInfoFor(tab);
    
    if (this.getState().getActiveMoreTab() == tab.Id)
    {
        //still optionally trigger an update
        if (typeof triggerUpdate == 'undefined' || triggerUpdate)
            this.triggerUpdateFor(tab.Id); 
        return;   
    }
    
    this.getState().setActiveMoreTab(tab.Id);
    
    /*
    $(".tws-more-tab-content .tws-tab-element", this.getContext()).hide();
    $("#" + tab.ElementId, this.getContext()).show();
    $(".tws-more-tab-buttons .tws-more-tab-button", this.getContext()).removeClass("tws-active-more-tab-button");
    $("#" + tab.MoreButtonId, this.getContext()).addClass("tws-active-more-tab-button");
    */
    
    this.showMoreTabDom(tab);
    
    if (typeof triggerUpdate == 'undefined' || triggerUpdate)
            this.triggerUpdateFor(tab.Id); 
            
    this.fireEvent('moretabchange', tab.Id, tab);
};

Sage.TabWorkspace.prototype.showMoreTabDom = function(tab) {
    if (typeof tab === "string")
        tab = this.getInfoFor(tab);
    
    $(".tws-more-tab-content .tws-tab-element", this.getContext()).hide();
    $("#" + tab.ElementId, this.getContext()).show();
    $(".tws-more-tab-buttons .tws-more-tab-button", this.getContext()).removeClass("tws-active-more-tab-button");
    $("#" + tab.MoreButtonId, this.getContext()).addClass("tws-active-more-tab-button");
};

Sage.TabWorkspace.prototype.dropToMainSection = function(tab, target) {   
    /*
    tab: information about the tab being dropped
    target: the dom element that the tab was dropped on
    */
    
    this.logDebug("[enter] dropToMainSection");
      
    //determine the drop position via ui.droppable
    var $location;
    if ($(target).is(".tws-main-tab-buttons"))    
        $location = $(".tws-tab-button-tail", this.getContext());    
    else    
        $location = $(target, this.getContext());
                             
    switch (this.getState().getSectionFor(tab.Id))
    {
        case Sage.TabWorkspaceState.MAIN_TABS:                   
            $location.before($("#" + tab.ButtonId, this.getContext()));
            break;
            
        case Sage.TabWorkspaceState.MORE_TABS:
            $("#" + tab.MoreButtonId, this.getContext()).hide();
            $location.before($("#" + tab.ButtonId, this.getContext()).show());            
            
            //move the tab element
            $(".tws-main-tab-content", this.getContext()).append($("#" + tab.ElementId));
            //move the drop target
            $(".tws-main-tab-content", this.getContext()).append($("#" + tab.DropTargetId));
            break;
            
        case Sage.TabWorkspaceState.MIDDLE_TABS:                 
            $location.before($("#" + tab.ButtonId, this.getContext()).show());
            
            //move the tab element
            $(".tws-main-tab-content", this.getContext()).append($("#" + tab.ElementId));
            //move the drop target
            $(".tws-main-tab-content", this.getContext()).append($("#" + tab.DropTargetId));
            
            break;
    }
       
    //add this tab to the main tabs
    if ($location.is(".tws-tab-button-tail"))
        this.getState().addToMainTabs(tab.Id);
    else
        this.getState().addToMainTabs(tab.Id, this.getInfoForTabButton($location.attr("id")).Id, 0);    
        
    //show this main tab
    this.showMainTab(tab.Id);
};

Sage.TabWorkspace.prototype.dropToMoreSection = function(tab, target) {   
    /*
    tab: information about the tab being dropped
    target: the dom element that the tab was dropped on
    */
    
    this.logDebug("[enter] dropToMoreSection"); 
  
    //determine the drop position via ui.droppable
    var $location;
    if ($(target).is(".tws-more-tab-buttons"))    
        $location = $(".tws-more-tab-button-tail", this.getContext());    
    else    
        $location = $(target, this.getContext());
                             
    switch (this.getState().getSectionFor(tab.Id))
    {
        case Sage.TabWorkspaceState.MAIN_TABS:                   
            $("#" + tab.ButtonId, this.getContext()).hide();
            $location.before($("#" + tab.MoreButtonId, this.getContext()).show());            
            
            //move the tab element
            $(".tws-more-tab-element .tws-more-tab-content-fixer", this.getContext()).before($("#" + tab.ElementId));
            //move the drop target
            $(".tws-more-tab-element .tws-more-tab-content-fixer", this.getContext()).before($("#" + tab.DropTargetId));
            break;
            
        case Sage.TabWorkspaceState.MORE_TABS:
            $location.before($("#" + tab.MoreButtonId, this.getContext()));
            break;
            
        case Sage.TabWorkspaceState.MIDDLE_TABS:                 
            $location.before($("#" + tab.MoreButtonId, this.getContext()).show());
                        
            //move the tab element
            $(".tws-more-tab-element .tws-more-tab-content-fixer", this.getContext()).before($("#" + tab.ElementId));
            //move the drop target
            $(".tws-more-tab-element .tws-more-tab-content-fixer", this.getContext()).before($("#" + tab.DropTargetId));                        
            break;
    }
       
    //add this tab to the main tabs
    if ($location.is(".tws-more-tab-button-tail"))
        this.getState().addToMoreTabs(tab.Id);
    else
        this.getState().addToMoreTabs(tab.Id, this.getInfoForTabMoreButton($location.attr("id")).Id, 0);    
        
    //show this main tab
    this.showMoreTab(tab.Id);
};

Sage.TabWorkspace.prototype.dropToMiddleSection = function(tab, target) {   
    /*
    tab: information about the tab being dropped
    target: the dom element that the tab was dropped on
    */
    
    this.logDebug("[enter] dropToMiddleSection");
     
    var tabsToUpdate = [];
    
    //dropped to it's own drop target
    if (tab.DropTargetId == target.id)
        return;
             
    switch (this.getState().getSectionFor(tab.Id))
    {
        case Sage.TabWorkspaceState.MAIN_TABS:
            //are we the last main tab? if so, do nothing
            if (this.getState().getMainTabs().length == 1)
                return;
                
            //are we the current active main tab?
            if (this.getState().getActiveMainTab() == tab.Id)
            {
                var $newActiveTab = $("#" + tab.ButtonId, this.getContext()).prev(".tws-tab-button:visible:not(.tws-tab-button-tail)");
                if ($newActiveTab.length <= 0)
                    $newActiveTab = $("#" + tab.ButtonId, this.getContext()).next(".tws-tab-button:visible:not(.tws-tab-button-tail)");
                    
                if ($newActiveTab.length > 0)
                {
                    var newActiveTabId = this.getInfoForTabButton($newActiveTab.attr("id")).Id;
                    this.showMainTab(newActiveTabId, false); //do not trigger an update
                    tabsToUpdate.push(newActiveTabId);
                }                               
            }                      
            
            $("#" + tab.ButtonId, this.getContext()).hide();   
                
            //move the old drop target
            $(target).after($("#" + tab.DropTargetId, this.getContext()));    
            //show and move the tab element
            $(target).after($("#" + tab.ElementId, this.getContext()).show());
            
            tabsToUpdate.push(tab.Id);     
            break;
            
        case Sage.TabWorkspaceState.MORE_TABS:
            //are we the current active more tab?
            if (this.getState().getActiveMoreTab() == tab.Id)
            {
                //TODO: should we make a new more tab active?
            }
            
            $("#" + tab.MoreButtonId, this.getContext()).hide();
            
            //move the old drop target
            $(target).after($("#" + tab.DropTargetId, this.getContext()));    
            //show and move the tab element
            $(target).after($("#" + tab.ElementId, this.getContext()).show());
            
            tabsToUpdate.push(tab.Id);
            break;
            
        case Sage.TabWorkspaceState.MIDDLE_TABS:
            //move the old drop target
            $(target).after($("#" + tab.DropTargetId, this.getContext()));    
            //show and move the tab element
            $(target).after($("#" + tab.ElementId, this.getContext()).show());
            
            tabsToUpdate.push(tab.Id);
            break;
    }     
    
    //update state  
    if ($(target).hasClass("tws-middle-drop-target"))
        this.getState().addToMiddleTabs(tab.Id, 0); //first
    else  
        this.getState().addToMiddleTabs(tab.Id, this.getInfoForTabDropTarget(target.id).Id, 1);              
                    
    this.triggerUpdateFor(tabsToUpdate);
};

Sage.TabWorkspace.prototype.deriveStateFromMarkup = function() {
    var self = this;
    var state = { 
        MiddleTabs : [],
        MainTabs : [],
        MoreTabs : []        
    };
    
    $(".tws-middle-section .tws-tab-element", this.getContext()).each(function() {
        state.MiddleTabs.push(self.getInfoForTabElement($(this).attr("id")).Id);
    });
    
    $(".tws-main-section .tws-main-tab-buttons .tws-tab-button:visible", this.getContext()).each(function() { 
        var tab = self.getInfoForTabButton($(this).attr("id"));
        state.MainTabs.push(tab.Id);
        
        if ($(this).hasClass("tws-active-tab-button", this.getContext()))
            state.ActiveMainTab = tab.Id;
    });
    
    return state;
};


Sage.TabWorkspace.prototype.updateVisibleDroppables = function() {
    this.logDebug("[enter] enableAllVisibleDroppables");
    
    $("div.tws-drop-target:visible", this.getContext()).droppable("enable");   
    
    //fix for jQuery 1.5 and size of initially hidden droppables
    $.ui.ddmanager.prepareOffsets();

    this.logDebug("[leave] enableAllVisibleDroppables");
};

Sage.TabWorkspace.prototype.updateAllRegions = function() {
    this.updateMainAreaRegions();
    this.updateMoreAreaRegions();
    this.updateMiddleAreaRegions();
};

Sage.TabWorkspace.prototype.updateMainAreaRegions = function() { 
    //validate the container region and the area region list
    var region = this.createRegionsFrom(this._mainButtonContainer)[0];
    /*
    if ((typeof region != 'undefined') && region.x == this._mainButtonContainerRegion.x &&
        region.y == this._mainButtonContainerRegion.y &&
        region.width == this._mainButtonContainerRegion.width &&
        region.height == this._mainButtonContainerRegion.height &&
        (typeof this._regions[Sage.TabWorkspace.MAIN_AREA] ==="object" && this._regions[Sage.TabWorkspace.MAIN_AREA].length > 0))
        return;
    */    
    this._regions[Sage.TabWorkspace.MAIN_AREA] = this.createRegionsFrom(this._allMainButtons.filter(":visible")); 
    this._mainButtonContainerRegion = region;
};
Sage.TabWorkspace.prototype.updateMoreAreaRegions = function() {
    //validate the container region and the area region list
    var region = this.createRegionsFrom(this._moreButtonContainer)[0];
    /*
    if ((typeof region != 'undefined') && region.x == this._moreButtonContainerRegion.x &&
        region.y == this._moreButtonContainerRegion.y &&
        region.width == this._moreButtonContainerRegion.width &&
        region.height == this._moreButtonContainerRegion.height &&
        (typeof this._regions[Sage.TabWorkspace.MORE_AREA] ==="object" && this._regions[Sage.TabWorkspace.MORE_AREA].length > 0))
        return;
    */     
    this._regions[Sage.TabWorkspace.MORE_AREA] = this.createRegionsFrom(this._allMoreButtons.filter(":visible")); 
    this._moreButtonContainerRegion = region;
};
Sage.TabWorkspace.prototype.updateMiddleAreaRegions = function() { 
    this._regions[Sage.TabWorkspace.MIDDLE_AREA] = this.createRegionsFrom(this._allDropTargets.filter(":visible")); 
};

Sage.TabWorkspace.prototype.updateContextualFeedback = function() {
    /* More Tab Messages */
    if (this.getState().getMoreTabs().length <= 0)
        $(".tws-more-tab-message", this.getContext()).empty().append(TabWorkspaceResource.More_Tab_Empty_Message).show();
    else if (this.getState().getActiveMoreTab() == null) 
        $(".tws-more-tab-message", this.getContext()).empty().append(TabWorkspaceResource.More_Tab_No_Selection_Message).show();
    else
        $(".tws-more-tab-message", this.getContext()).hide();
        
    /* Middle Tab Messages */
    if (this.getState().getMiddleTabs().length <= 0)
    {
        $(".tws-middle-section", this.getContext()).addClass("tws-middle-section-empty");
        $(".tws-middle-drop-target span", this.getContext()).empty().append(TabWorkspaceResource.Middle_Pane_Empty_Drop_Target_Message);
    }
    else
    {
        $(".tws-middle-section", this.getContext()).removeClass("tws-middle-section-empty");
        $(".tws-middle-drop-target span", this.getContext()).empty().append(TabWorkspaceResource.Middle_Pane_Drop_Target_Message);
    }
};

Sage.TabWorkspace.prototype.triggerUpdateFor = function(tabs, data) {

    this.updateContextualFeedback();
    this.updateAllRegions(); 
    
    var tabsToUpdate = [];
    var shouldSendState = false;
    var stateSent = false;
    var self = this;
    
    if (typeof tabs == 'string')
    {
        //check to see if we need to update the tab.  never update the more tab, but do send state.
        if (tabs == Sage.TabWorkspace.MORE_TAB_ID)
        {
            //if we are the more tab, see if we need to update the active more tab
            var activeMoreTab = this.getState().getActiveMoreTab();
            if (activeMoreTab && !this.getState().wasTabUpdated(activeMoreTab))
            {
                this.getState().markTabUpdated(activeMoreTab);
                tabsToUpdate.push(activeMoreTab);
            }
            else
            {
                shouldSendState = true;
            }
        }
        else
        {        
            if (!this.getState().wasTabUpdated(tabs) && (tabs != Sage.TabWorkspace.MORE_TAB_ID))        
            {            
                //mark the tab as updated so when the state gets sent the server knows the control is "active"
                this.getState().markTabUpdated(tabs); 
                tabsToUpdate.push(tabs);            
            }
            else
            {
                shouldSendState = true;
            }
        }
    }
    else
    {
        for (var i = 0; i < tabs.length; i++)
        {
            //check to see if we need to update the tab.  never update the more tab, but do send state.
            if (tabs[i] == Sage.TabWorkspace.MORE_TAB_ID)
            {
                //if we are the more tab, see if we need to update the active more tab
                var activeMoreTab = this.getState().getActiveMoreTab();
                if (activeMoreTab && !this.getState().wasTabUpdated(activeMoreTab))
                {
                    this.getState().markTabUpdated(activeMoreTab);
                    tabsToUpdate.push(activeMoreTab);
                }
                else
                {
                    shouldSendState = true;
                }
            }
            else 
            {
                if (!this.getState().wasTabUpdated(tabs[i]) && (tabs[i] != Sage.TabWorkspace.MORE_TAB_ID))
                {
                    //mark the tab as updated so when the state gets sent the server knows the control is "active"
                    this.getState().markTabUpdated(tabs[i]); 
                    tabsToUpdate.push(tabs[i]);
                }
                else
                {
                    shouldSendState = true;
                }
            }
        }
    }
                
    if (typeof tabs == 'string')
        this.logDebug("Update requested for: " + tabs);
    else
        this.logDebug("Updates requested for: " + tabs.join(", "));
    
    var serializedState = this.getState().serialize();
    $("#" + this.getStateProxyPayloadId()).val(serializedState);
                            
    for (var i = 0; i < tabsToUpdate.length; i++)
    {
        this.logDebug("Triggering update for " + tabsToUpdate[i]);
    
        tab = tabsToUpdate[i];                                        
        //this.cleanupTabElement(tab);        
        
        $("#" + this.getInfoFor(tab).UpdatePayloadId).val(serializedState);
        __doPostBack(this.getInfoFor(tab).UpdateTriggerId, "");
        
        stateSent = true;              
    }
    
    var forceProxyCall = false;
    if (shouldSendState && !stateSent && this.getUseUIStateService())
    {    
        this.logDebug("Sending state update via UIStateService.");
                
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "UIStateService.asmx/StoreTabWorkspaceState",
            data: Ext.util.JSON.encode({
                key: this.getUIStateServiceKey(),
                state: this.getState().getObject()
            }),
            dataType: "json",
            error: function (request, status, error) {
                self.logDebug("State update via UIStateService failed.");   
                self.logDebug("Sending state update via proxy.");
                        
                $("#" + self.getStateProxyPayloadId()).val(serializedState);
                __doPostBack(self.getStateProxyTriggerId(), ""); 
                
                stateSent = true;     
            },
            success: function(data, status) {
                stateSent = true;            
            }
        });
    }
    
    //if the state needs to be sent, and hasn't been, and the UI state service us not being used, or has failed
    //send it via the proxy
    if (shouldSendState && !stateSent && (!this.getUseUIStateService() || forceProxyCall))
    {
        this.logDebug("Sending state update via proxy.");
        
        //$("#" + this.getStateProxyPayloadId()).val(serializedState);
        __doPostBack(this.getStateProxyTriggerId(), "");
        
        stateSent = true;
    }    
};