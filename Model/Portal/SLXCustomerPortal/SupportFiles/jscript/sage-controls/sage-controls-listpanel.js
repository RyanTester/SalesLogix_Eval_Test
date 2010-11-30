if (typeof Ext.applyIfNull !== "function")
{
    Ext.applyIfNull = function(o, c) {
        if(o && c)
            for(var p in c)
                if(typeof o[p] == "undefined" || o[p] == null)
                    o[p] = c[p];                    
        return o;   
    };
}

Sage.SalesLogix.Controls.BufferedGridView = Ext.extend(Ext.ux.grid.BufferedGridView, {
    initTemplates: function() {
        this.templates.row = new Ext.Template(
            '<div id="{id}" class="x-grid3-row {alt}" style="{tstyle}"><table class="x-grid3-row-table" border="0" cellspacing="0" cellpadding="0" style="{tstyle}">',
            '<tbody><tr>{cells}</tr>',
            (this.enableRowBody ? '<tr class="x-grid3-row-body-tr" style="{bodyStyle}"><td colspan="{cols}" class="x-grid3-body-cell" tabIndex="0" hidefocus="on"><div class="x-grid3-row-body">{body}</div></td></tr>' : ''),
            '</tbody></table></div>'
        );
        Sage.SalesLogix.Controls.BufferedGridView.superclass.initTemplates.call(this);
    },
    /* modified from Ext 2.1 source - changed to provide the row id to the row template */
    doRender: function(cs, rs, ds, startRow, colCount, stripe) {
        var ts = this.templates, ct = ts.cell, rt = ts.row, last = colCount - 1;
        var tstyle = 'width:' + this.getTotalWidth() + ';';
        var buf = [], cb, c, p = {}, rp = { tstyle: tstyle }, r;
        for (var j = 0, len = rs.length; j < len; j++) {
            r = rs[j]; cb = [];
            if (typeof r === "undefined")
                continue;
            if (this.id && r) {
                rp.id = (this.activeView != "list")
                    ? [this.id, "row", r.id].join("_")
                    : [this.id, "row" + r.id, r.data[this.ds.converter.meta.keyfield]].join("_");
            }
            var rowIndex = (j + startRow);
            for (var i = 0; i < colCount; i++) {
                c = cs[i];
                p.id = c.id;
                p.css = i == 0 ? 'x-grid3-cell-first ' : (i == last ? 'x-grid3-cell-last ' : '');
                p.attr = p.cellAttr = "";
                p.value = c.renderer(r.data[c.name], p, r, rowIndex, i, ds);
                p.style = c.style;
                if (p.value == undefined || p.value === "") p.value = "&#160;";
                if (r.dirty && typeof r.modified[c.name] !== 'undefined') {
                    p.css += ' x-grid3-dirty-cell';
                }
                cb[cb.length] = ct.apply(p);
            }
            var alt = [];
            if (stripe && ((rowIndex + 1) % 2 == 0)) {
                alt[0] = "x-grid3-row-alt";
            }
            if (r.dirty) {
                alt[1] = " x-grid3-dirty-row";
            }
            rp.cols = colCount;
            if (this.getRowClass) {
                alt[2] = this.getRowClass(r, rowIndex, rp, ds);
            }
            rp.alt = alt.join(" ");
            rp.cells = cb.join("");
            buf[buf.length] = rt.apply(rp);
        }
        return buf.join("");
    },
    adjustVisibleRows: function() {
        var rows = this.getRows();
        if (rows[0]) {
            var rh = rows[0].offsetHeight + 0.5; /* adjustment for incorrect rendering */
            if (rh < 1.0) {
                this.rowHeight = -1;
                return;
            }

            this.rowHeight = rh;
        }

        var g = this.grid, ds = g.store;

        var c = g.getGridEl();
        var cm = this.cm;
        var size = c.getSize(true);
        var vh = size.height;

        var vw = size.width - this.scrollOffset;
        // horizontal scrollbar shown?
        if (cm.getTotalWidth() > vw) {
            // yes!
            vh -= this.horizontalScrollOffset;
        }

        vh -= this.mainHd.getHeight();

        var totalLength = ds.totalLength || 0;

        var visibleRows = Math.max(1, Math.floor(vh / this.rowHeight));

        this.rowClipped = 0;
        // only compute the clipped row if the total length of records
        // exceeds the number of visible rows displayable
        if (totalLength > visibleRows && this.rowHeight > (vh - (visibleRows * this.rowHeight))) {
            visibleRows = Math.min(visibleRows + 1, totalLength);
            this.rowClipped = 1;
        }

        if (this.visibleRows == visibleRows - this.rowsClipped) {
            return;
        }

        this.visibleRows = visibleRows;

        // skip recalculating the row index if we are currently buffering.
        if (this.isBuffering) {
            return;
        }

        // when re-rendering, doe not take the clipped row into account
        if (this.rowIndex + (visibleRows - this.rowClipped) > totalLength) {
            this.rowIndex = Math.max(0, totalLength - (visibleRows - this.rowClipped));
            this.lastRowIndex = this.rowIndex;
        }

        this.updateLiveRows(this.rowIndex, true);
    }
});

/*
    Configuration Options
    useMetaData: boolean/object
        list
        summary
        timeline
    metaData: object
        list
        summary
        timeline
    metaConverters: object
        list
        summary
        timeline
    managers: object
        list
            xtype
        summary
            xtype
        timeline
            xtype    
*/

/**
 * @cfg {String|Function} stateId
 * A string representing a state identifier or a function to return one.
 */

 Sage.SalesLogix.Controls.BufferedStore = Ext.extend(Ext.ux.grid.BufferedStore, {

    //Override the Load Records Method becuse o.toalRecords = null and throws error;
    loadRecords : function(o, options, success)
    {
        this.checkVersionChange(o, options, success);
        
        var totalRecords = 0;
        if(o != null)
        {
            totalRecords = o.totalRecords;
        }
        else
        { 
            totalRecords = 0;
        }
        // we have to stay in sync with rows that may have been skipped while
        // the request was loading.
        this.bufferRange = [
            options.params.start,
            Math.min(options.params.start+options.params.limit, totalRecords)
        ];

        Ext.ux.grid.BufferedStore.superclass.loadRecords.call(this, o, options, success);
    }

  });   
 
 
 Sage.SalesLogix.Controls.BufferedRowSelectionModel = Ext.extend(Ext.ux.grid.BufferedRowSelectionModel, {
    
      getSelections: function()
      {  
          return Ext.ux.grid.BufferedRowSelectionModel.superclass.getSelections.call(this);        
      }
         
  });   
 
 
Sage.SalesLogix.Controls.ListPanel = Ext.extend(Ext.Panel, {     
    /*
    If one of the connection parameters is a function, the first argument passed to that function is the connection object. 
    The "this" reference refers to the object calling the builder.
    
    This object could be moved out into a static class.
    */
    builders: {
        standard: function(options) {
            return options;
        },        
        sdata: function(options) {
            var o = options;
            var u = [];
            var p = []; 
                           
            if (o.predicate && (typeof o.predicate === "string") && o.predicate.length > 0)               
                u.push(String.format(o.resource, o.predicate));
            else
                u.push(o.resource);
           
            if (typeof o.parameters === "object")
            {
                for (var k in o.parameters)
                {
                    if ((typeof o.parameters[k] === "object") && (o.parameters[k].eval === true))
                    {
                        var r = eval(o.parameters[k].statement);
                        if (r !== false)
                            p.push(k + "=" + encodeURIComponent(r));
                    }
                    else if (typeof o.parameters[k] === "function")
                    {
                        var r = o.parameters[k].apply(this, arguments);
                        if (r !== false)
                            p.push(k + "=" + encodeURIComponent(r));    
                    }
                    else
                        p.push(k + "=" + encodeURIComponent(o.parameters[k]));
                }
            }       
            else if (typeof o.parameters === "string")
                p.push(o.parameters);
                                     
            if (p.length > 0)
            {
                u.push("?");
                u.push(p.join("&"));            
            } 
            return u.join("");
        }
    },  
    visibleRangeMsg: "Displaying {0} - {1} of {2}", 
    emptyRangeMsg: "No data to display", 
    loadingMsg: "Loading...",
    pleaseWaitMsg: "Please wait...", 
    detailText: "Detail",
    showDetailText: "Detail",
    hideDetailText: "Hide Detail",
    summaryText: "Summary",
    listText: "List",
    initComponent: function() {        
        /* localization configuration */
        /* remove when using native ext localization */    
        if (typeof Sage.SalesLogix.Controls.Resources.ListPanel !== "undefined") 
            Ext.apply(this, {
                visibleRangeMsg: this.initialConfig.visibleRangeMsg || Sage.SalesLogix.Controls.Resources.ListPanel.VisibleRangeMsg, 
                emptyRangeMsg: this.initialConfig.emptyRangeMsg || Sage.SalesLogix.Controls.Resources.ListPanel.EmptyRangeMsg, 
                loadingMsg: this.initialConfig.loadingMsg || Sage.SalesLogix.Controls.Resources.ListPanel.LoadingMsg,
                pleaseWaitMsg: this.initialConfig.pleaseWaitMsg || Sage.SalesLogix.Controls.Resources.ListPanel.PleaseWaitMsg,
                detailText: this.initialConfig.detailText || Sage.SalesLogix.Controls.Resources.ListPanel.DetailText,
                showDetailText: this.initialConfig.showDetailText || Sage.SalesLogix.Controls.Resources.ListPanel.ShowDetailText,
                hideDetailText: this.initialConfig.hideDetailText || Sage.SalesLogix.Controls.Resources.ListPanel.HideDetailText,
                summaryText: this.initialConfig.summaryText || Sage.SalesLogix.Controls.Resources.ListPanel.SummaryText,
                listText: this.initialConfig.listText || Sage.SalesLogix.Controls.Resources.ListPanel.ListText
            });
    
        /* optional configuration */                
        Ext.applyIf(this, {       
            metaConverters: {},                       
            margins: "0 0 0 0",
	        title: false,
            frame: false,
            border: false,
            autoShow: true,
            bufferResize: true,
            cls: "list-panel",
            disableDetailView: (this.managers.detail ? false : true) /* allow it to be disabled externally or disable it if it would be empty */
        });               
        
        /* required configuration */
        Ext.apply(this, {
            presented: false,
            layout: "border",        
            stateful: false, /* we handle our own state for now */
            refreshFunc: {}
        });
        
        /* extended defaults */
        this.metaConverters = this.metaConverters || {};
        Ext.applyIfNull(this.metaConverters, {
            list: {
                xtype: "groupmetaconverter"
            },
            summary: {
                xtype: "groupsummarymetaconverter"
            }            
        });
        
        this.initManagers();
        this.initViews();               
        this.initToolbar();
              
        Sage.SalesLogix.Controls.ListPanel.superclass.initComponent.call(this); 
        
        this.addEvents(
		    'itemselect',
		    'viewswitch',
		    'itemcontextmenu',
		    'present',
		    'initialload',
		    'load',
		    'beforerefresh',
		    'refresh'
		);
        
        this.bind(); 
        this.register();
    },	
	bind: function() {	    

	},
	unbind: function() {
	
	}	
});

Sage.SalesLogix.Controls.ListPanel.instances = { byId: {}, byName: {} };
Sage.SalesLogix.Controls.ListPanel.find = function(name) {
    if (Sage.SalesLogix.Controls.ListPanel.instances.byName[name])
        return Sage.SalesLogix.Controls.ListPanel.instances.byName[name];
    if (Sage.SalesLogix.Controls.ListPanel.instances.byId[name])
        return Sage.SalesLogix.Controls.ListPanel.instances.byId[name];
    return false;
};

Sage.SalesLogix.Controls.ListPanel.prototype.register = function() {
    this.friendlyName = this.friendlyName || this.id;
    Sage.SalesLogix.Controls.ListPanel.instances.byId[this.id] = this;
    Sage.SalesLogix.Controls.ListPanel.instances.byName[this.friendlyName] = this;
};

Sage.SalesLogix.Controls.ListPanel.prototype.present = function(viewport) {    
    if (this.renderTo)
        return;
    
    if (typeof this.addTo === "string") this.addTo = Ext.getCmp(this.addTo);
        
    if (this.addTo)
    {
        $(this.addTo.getEl().dom).find(".x-panel-body").children().hide();
        
        this.addTo.add(this);
        this.addTo.doLayout();
    }                      
    
    this.fireEvent("present", this);
    
    this.presented = true;
    if (this.createOnly)
        this.refresh();
};

Sage.SalesLogix.Controls.ListPanel.prototype.initToolbar = function() {
    
    var self = this;
    var items = [];
    items.push("->");
    
    if (this.detailView)
    {
        items.push({
            group: "detail",
            update: function(l) { 
                if (l.disableDetailView)
                {
                    this.hide();
                    return;
                } 
                this.show();
                this.suspendEvents();
                this.toggle(l.loadState().showDetail);
                this.setText(l.loadState().showDetail ? l.hideDetailText : l.showDetailText);
                this.resumeEvents();
                
                if (l.activeView == "summary") 
                    this.disable(); 
                else 
                    this.enable();                  
            },
            id: this.makeId("button", "detail"),
            text: (!this.detailView.hidden) ? this.hideDetailText : this.showDetailText,
            enableToggle: true,        
            hidden: this.disableDetailView,
            disabled: (this.activeView == "summary"),
            pressed: (!this.detailView.hidden),                        
            listeners: {
                toggle: {
                    fn: function(b, t) {
                        if (t)
                            self.detailView.show(); 
                        else
                            self.detailView.hide(); 
                        
                        this.setText(t ? self.hideDetailText : self.showDetailText);    
                        
                        self.saveState({showDetail: t});                    
                        self.doLayout(); 
                    }
                }
            }
        });     
        var separator = new Ext.Toolbar.Separator();
        separator.group = "detail";
        separator.hidden = this.disableDetailView;
        separator.update = function(l) {                
            if (l.disableDetailView)
            {
                this.hide();
                return;
            } 
            this.show();
        };
        /* fix for broken hidden on initial render */
        separator.render = function(td){
            this.td = td;
            td.appendChild(this.el);
            if (this.hidden)
                this.td.style.display = "none";
        };
        
        items.push(separator);
    }
    
    /* if (this.views.list) */
        items.push({
            update: function(l) { 
                if ((l.views.list && l.connections.list) && ((l.views.summary && l.connections.summary) || (l.views.timeline && l.connection.timeline))) 
                {
                    this.show();
                    this.suspendEvents(); 
                    this.toggle(l.activeView == "list"); 
                    this.resumeEvents();                 
                }
                else
                {
                    this.hide();
                }                
            },
            id: this.makeId("button", "list"),
            text: this.listText,
            hidden: !((this.views.list && this.connections.list) && ((this.views.summary && this.connections.summary) || (this.views.timeline && this.connection.timeline))),
            listeners: {

            },
            enableToggle: true,
            pressed: (this.activeView == "list"),
            toggleGroup: this.makeId("button", "toggle", "group"),            
            listeners: {
                toggle: {
                    fn: function(b, t) {
                        if (t)
                            self.switchView("list");  
                    }
                }
            }
        });
        
    /* if (this.views.summary) */
        items.push({
            update: function(l) { 
                if (l.views.summary && l.connections.summary) 
                {
                    this.show();
                    this.suspendEvents(); 
                    this.toggle(l.activeView == "summary"); 
                    this.resumeEvents();                 
                }
                else
                {
                    this.hide();
                }    
            },
            id: this.makeId("button", "summary"),
            text: this.summaryText,
            hidden: !(this.views.summary && this.connections.summary),
            listeners: {

            },
            enableToggle: true,
            pressed: (this.activeView == "summary"),
            toggleGroup: this.makeId("button", "toggle", "group"),
            listeners: {
                toggle: {
                    fn: function(b, t) {
                        if (t)
                            self.switchView("summary");  
                    }
                }
            }
        });
        
    if (this.views.timeline)
        items.push({
            update: function(l) { this.suspendEvents(); this.toggle(l.activeView == "timeline"); this.resumeEvents(); },
            id: this.makeId("button", "timeline"),
            text: this.timelineText,
            listeners: {

            },
            enableToggle: true,
            pressed: (this.activeView == "timeline"),
            toggleGroup: this.makeId("button", "toggle", "group"),
            listeners: {
                toggle: {
                    fn: function(b, t) {
                        if (t)
                            self.switchView("timeline");  
                    }
                }
            }
        });
        
    if (this.helpUrl)
        items.push({
            icon: "ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16",
            text : false,
            cls:"x-btn-text-icon x-btn-icon-only",
            handler: function() { window.open(self.helpUrl, 'MCWebHelp'); }
        });

    this.tbar = new Sage.SalesLogix.Controls.ListPanelToolbar(items);
};

Sage.SalesLogix.Controls.ListPanel.prototype.switchView = function(view, forceLayout) {
    if (this.activeView === view)
        return;
    
    if (view === "summary")
        this.detailView.hide();
    else if (this.loadState().showDetail && !this.disableDetailView)
        this.detailView.show();
    else    
        this.detailView.hide(); 
    
    this.activeView = view;
    
    this.saveState({activeView: view});
        
    var viewId = this.makeId(view);
    var viewComponent = this.mainView.findById(viewId);
    
    this.mainView.layout.setActiveItem(viewId);
    this.updateToolbarItems();
    this.doLayout();
    
    this.fireEvent("viewswitch", view, viewComponent, this);
};

Sage.SalesLogix.Controls.ListPanel.prototype.setEnableDetailView = function(enable, skipLayout) {
    if (enable !== !this.disableDetailView)
    {
        if (this.activeView === "summary")
            this.detailView.hide();
        else if (this.loadState().showDetail && enable)
            this.detailView.show();
        else    
            this.detailView.hide(); 
                        
        this.disableDetailView = !enable;   
        
        if (skipLayout === true)
        {
            this.updateToolbarItems();
            this.doLayout();
        }
    }        
};

Sage.SalesLogix.Controls.ListPanel.prototype.refresh = function() {
    //TODO: add support to create list/summary/timeline panel if we are switching to a tab that now has configuration for it
    
    this.fireEvent("beforerefresh", this);
    
    //validate current view, if it is not valid, switch to the list view
    var updateToolbar = true;
    if (this.activeView && !(this.views[this.activeView] && this.connections[this.activeView]))
    {
        updateToolbar = false;
        this.switchView("list");
    }
    
    if (this.refreshFunc[this.activeView])
        this.refreshFunc[this.activeView].call(this);
        
    if (this.detailView && this.detailView.refresh)
        this.detailView.refresh();
        
    if (updateToolbar)
        this.updateToolbarItems();
        
    this.fireEvent("refresh", this);
};

Sage.SalesLogix.Controls.ListPanel.prototype.updateToolbarItems = function() {
    var items = this.getTopToolbar().items.items;
    for (var i = 0; i < items.length; i++)
        if (items[i].update)
            items[i].update.call(items[i], this);
};

Sage.SalesLogix.Controls.ListPanel.prototype.initManagers = function() {
    for (var k in this.managers)
    {
        /* set the id and owner and create */
        if (this.managers[k].xtype)
            this.managers[k] = Ext.ComponentMgr.create(Ext.apply(this.managers[k], {id: this.makeId("manager", k), owner: this}));        
    }    
};

Sage.SalesLogix.Controls.ListPanel.prototype.makeId = function() {    
    var parts = [];
    parts.push(this.id);
    for (var i = 0; i < arguments.length; i++)
        parts.push(arguments[i]);
    return parts.join('_');
};

Sage.SalesLogix.Controls.ListPanel.prototype.makeFriendlyId = function() {
    var parts = [];
    parts.push(this.friendlyName || this.id);
    for (var i = 0; i < arguments.length; i++)
        parts.push(arguments[i]);
    return parts.join('_');
};

Sage.SalesLogix.Controls.ListPanel.prototype.getStateId = function(view) {    
    if (typeof this.stateId === "string")
        return this.makeFriendlyId(view, this.stateId);
    
    if (typeof this.stateId === "function")
        return this.makeFriendlyId(view, this.stateId.call(this));
        
    return this.makeFriendlyId(view,"state");
};

Sage.SalesLogix.Controls.ListPanel.prototype.getChildStateId = function(view) {
    if (typeof this.childStateId === "string")
        return this.makeFriendlyId(view, this.childStateId);
    
    if (typeof this.childStateId === "function")
        return this.makeFriendlyId(view, this.childStateId.call(this));
        
    return this.getStateId(view); /* default is to return the standard state id */
};

Sage.SalesLogix.Controls.ListPanel.prototype.loadState = function(refresh) {
    if (refresh !== true && this.state)
        return this.state;
    
    return (this.state = Ext.state.Manager.get(this.getStateId("state"), this.state || { activeView: "list", showDetail: false }));               
};

Sage.SalesLogix.Controls.ListPanel.prototype.saveState = function(updates, saveOnly) {
    if (saveOnly !== true)
        updates = Ext.apply(this.loadState(), updates);
    this.state = updates;
    Ext.state.Manager.set(this.getStateId("state"), updates);
};

Sage.SalesLogix.Controls.ListPanel.prototype.refreshState = function() {
    this.loadState(true);
    
    if (this.detailView)
        if (this.state.showDetail)
            this.detailView.show();
        else
            this.detailView.hide();
            
    this.switchView(this.state.activeView, true);   
};

Sage.SalesLogix.Controls.ListPanel.prototype.buildConnection = function(partial, source) {
    source = (!source && partial.copy && this.connections[partial.copy]) ? this.connections[partial.copy] : source || {};

    Ext.applyIf(partial.parameters, source.parameters);
    Ext.applyIf(partial, source);
        
    return partial;
};

Sage.SalesLogix.Controls.ListPanel.prototype.initViews = function() {
    this.loadState();
    this.views = this.views || {};
    this.views.list = this.createList();
    this.views.summary = this.createSummary();
    //this.views.timeline = this.createTimeline();
    
    var items = [];        
    for (var k in this.views)
        if (this.views[k])
            items.push(this.views[k]);   
    
    this.activeView = this.state.activeView;
    if (!this.activeView || !(this.views[this.activeView] && this.connections[this.activeView]))
        this.activeView = "list"; /* default for now */
        
    var active = this.makeId(this.activeView);
      
    this.mainView = this.mainView || new Ext.Panel(Ext.apply({
        border: false,
        region: "center",
        id: this.makeId("main"),
        autoShow: true,
        bufferResize: true,       
        layout: "card",
        border: false,
        deferredRender: true,
        activeItem: active,
        items: items,
        stateful: false             
    }, this.mainViewConfig)); 
    
    /* allow for custom detailView passed in via options */
    this.detailView = this.detailView || new Sage.SalesLogix.Controls.SummaryPanel(Ext.apply({
        region: "south",
        id: this.makeId("detail"),
        height: 200,
        layout: "fit",
        split: true,
        border: true,
        bodyBorder: false,
        collapsible: true,
        collapseMode:'mini',
        animCollapse: false,
        animFloat: false,
        autoScroll: true,
        margins: "0 0 0 0",
        cmargins: "0 0 0 0", 
        autoShow: true,
        bufferResize: true,
        hidden: (this.activeView === "summary" || this.disableDetailView || !this.state.showDetail),
        cls: "list-detail",  
        /*      
        tbar: (this.detailViewToolbar === false) ? false : new Ext.Toolbar({
            //items: ["-"]
        }),
        */
        tbar: this.detailViewToolbar,
        manager: this.managers.detail,
        list: this,
        stateful: false
    }, this.detailViewConfig));   
    
    this.items = [this.mainView, this.detailView];
};

Sage.SalesLogix.Controls.ListPanel.prototype.useMetaDataFor = function(view) {    
    if (!this.connections[view])
        return false;
    
    if (typeof this.connections[view].useStaticMetaData === "boolean")
        return !this.connections[view].useStaticMetaData;      
        
    return true;
};

Sage.SalesLogix.Controls.ListPanel.prototype.getViewOptions = function(view) {
    if (this.viewOptions && this.viewOptions[view])
        return this.viewOptions[view];
    return {};
};

Sage.SalesLogix.Controls.ListPanel.prototype.applyFilter = function(filter) {
    this.filter = filter;
};

Sage.SalesLogix.Controls.ListPanel.prototype.clearFilter = function() {
    this.filter = false;
};

Sage.SalesLogix.Controls.ListPanel.prototype.applyFilterToLiveGridStore = function(store) {
    if (this.filter)
    {
        store.proxy.conn.method = "POST";
        store.proxy.conn.jsonData = this.filter;
    }
    else
    {
        if (store.proxy.conn.jsonData)
            delete store.proxy.conn.jsonData;
    }   
};

Sage.SalesLogix.Controls.ListPanel.prototype.createList = function() { 
    var self = this;
    if (!this.connections.list || (this.connections.list.parameters.name) && (this.connections.list.parameters.name() == "")) //second occurs if new entity with no groups
        return false;

    /* create a converter for static meta data */
    var converter;
    if (!this.useMetaDataFor("list")) {
        var c = Ext.apply({ meta: this.connections.list.metaData }, this.metaConverters.list);
        converter = Ext.ComponentMgr.create(c);
        converter.init();
    }

    /* by default meta data is provided via the JSON response */
    var reader;
    if (this.useMetaDataFor("list")) {
        reader = new Ext.ux.data.BufferedJsonReader();
    }
    else {
        var c = converter.toReaderConfig();
        reader = new Ext.ux.data.BufferedJsonReader(c.meta, c.recordType);
    }

    var store = new Sage.SalesLogix.Controls.BufferedStore({
        autoLoad: false,
        bufferSize: 150,
        reader: reader,
        filter: {},
        url: "/",
        builder: this.builders[this.connections.list.builder],
        connection: this.connections.list,
        converterConfig: this.metaConverters.list,
        manager: this.managers.list
    });

    store.on("beforeload", function(s, o) {
        if (this.useMetaDataFor("list") && !s.requestedMetaData)
            s.connection.parameters.meta = "true";

        s.proxy.conn.url = s.url = s.builder(s.connection, this);
        s.proxy.conn.method = "GET";
        
        /* fix to fire a load style event only once (as it should by default) */    
        this.on("load", function(s, r) {
            this.fireEvent("initialload", s, r, this);
        }, this, {single: true});

        this.applyFilterToLiveGridStore(s);
    }, this);

    store.on("load", function(s, r, o) {
        var svc = Sage.Services.getService("ClientGroupContext");
        if (svc) {
            svc.getContext().CurrentGroupCount = s.totalLength;
        }
        if (this.useMetaDataFor("list")) {
            s.requestedMetaData = true;
            delete s.connection.parameters.meta;
        }               
        
        this.fireEvent("load", s, r, this);
    }, this);

    //var view = new Ext.ux.grid.BufferedGridView({
    var view = new Sage.SalesLogix.Controls.BufferedGridView({
        id: this.makeFriendlyId("list"),
        nearLimit: 25,
        forceFit: (this.getViewOptions("list").fitToContainer === false) ? false : true, /* default to true */
        autoFill: true,
        loadMask: {
            msg: this.pleaseWaitMsg
        }
    });

    view.on("beforebuffer", function(v, s, index, visible, total, offset) {
        s.proxy.conn.url = s.url = s.builder(s.connection, this);
        s.proxy.conn.method = "GET";

        this.applyFilterToLiveGridStore(s);
    }, this);

    view.on("beforebuffer", function(v, s, idx, vis, cnt) { this.onLiveGridViewRangeEvent(idx, vis, cnt); }, this);
    view.on("buffer", function(v, s, idx, vis, cnt) { this.onLiveGridViewRangeEvent(idx, vis, cnt); }, this);
    view.on("cursormove", function(v, idx, vis, cnt) { this.onLiveGridViewRangeEvent(idx, vis, cnt); }, this);
    
    view.on("cursormove", function() {
        //TODO: Find out what idRows() is for.
        if (typeof idRows != "undefined") idRows();
    }, this);
//CNH Override this  
    //Ext.ux.grid.BufferedRowSelectionModel
    var selectionModel = new Sage.SalesLogix.Controls.BufferedRowSelectionModel({
        singleSelect: (this.getViewOptions("list").singleSelect === true) ? true : false /* default to false */
    });  
    
    selectionModel.on("rowselect", this.onLiveGridRowSelect, this);

    var columnModel;
    if (this.useMetaDataFor("list"))
        columnModel = new Ext.grid.ColumnModel([]);
    else
        columnModel = new Ext.grid.ColumnModel(converter.toColumnModel()); 

    var grid = new Ext.grid.GridPanel({
        id: this.makeId("list"), 
        ds: store,
        enableDragDrop: false,
        cm: columnModel,
        sm: selectionModel,
        loadMask: {
            msg: this.loadingMsg 
        },
        view: view,
        title: "",
        stripeRows: true,
        stateId: this.getChildStateId("list"), 
        border: false,
        stateful: false,
        layout: "fit",
        cls: "list-view-list"
    });
    
    store.on("beforeload", function(s, o) {  
        /* need to re-adjust row sizing */              
        var view = grid.getView();
        if (view)
            view.rowHeight = -1;    
    }, this);

    var handleShow = function() {
        if (this.createOnly && (this.presented == false))
            return; /* we wait until present is called to load in this situation */
    
        var store = grid.getStore();        

        /* clear sort */
        store.sortToggle = {}; 
        store.sortInfo = null; 
                   
        /* apply new state id */                   
        grid.stateId = self.getChildStateId("list");        
        grid.initState();   
        
        store.load(); 
    };
    
    grid.on("show", function() {                    
        if (grid.rendered)        
            handleShow.call(this); /* g.getStore().load(); */
        else
            grid.on("render", function() { handleShow.call(this); /* g.getStore().load(); */ }, this, { single: true });
    }, this);  

    grid.on("rowcontextmenu", function(g, r, e) { this.fireEvent("itemcontextmenu", r, e); }, this);

    /* must be after grid panel creation */
    if (this.useMetaDataFor("list"))
        store.on("metachange", function(s, m) { this.onLiveGridStoreMetaChange(s, m, { grid: grid }); }, this);

    var handleRefresh = function() {
        var store = grid.getStore();        

        /* clear sort */
        store.sortToggle = {}; 
        store.sortInfo = null; 
                   
        /* apply new state id */                   
        grid.stateId = self.getChildStateId("list");        
        grid.initState();
        
        store.requestedMetaData = false;
        store.connection = self.connections.list;
        store.converterConfig = self.metaConverters.list;
        store.manager = self.managers.list;
        store.load();  
    };
    
    this.refreshFunc.list = function() {                       
        if (grid.rendered) 
            handleRefresh.call(this);
        else         
            grid.on("render", function(grid) {
                handleRefresh.call(this);                                
            }, this, {single: true});        
    };

    return grid;
};

//TODO: the two grid creation functions could possible be combined.
Sage.SalesLogix.Controls.ListPanel.prototype.createSummary = function() {        
    var self = this;
    if (!this.managers.summary || !this.connections.summary)
        return false;

    /* create a converter for static meta data */      
    var converter;
    if (!this.useMetaDataFor("summary"))
    {
        var c = Ext.apply({meta: this.connections.summary.metaData}, this.metaConverters.summary);    
        converter = Ext.ComponentMgr.create(c);
        converter.init();  
    }
    
    /* by default meta data is provided via the JSON response */    
    var reader;
    if (this.useMetaDataFor("summary"))
        reader = new Ext.ux.data.BufferedJsonReader();
    else         
    {
        var c = converter.toReaderConfig();
        reader = new Ext.ux.data.BufferedJsonReader(c.meta, c.recordType);    
    }
        
    var store = new Ext.ux.grid.BufferedStore({
        autoLoad : false,
        bufferSize: 1000,
        reader: reader,
        filter: {},
        url: "/",
        builder: this.builders[this.connections.summary.builder],
        connection: this.connections.summary,
        converterConfig: this.metaConverters.summary,
        manager: this.managers.summary
    });
    
    store.on("beforeload", function(s, o) {
        if (this.useMetaDataFor("summary") && !s.requestedMetaData)
            s.connection.parameters.meta = "true";
        
        s.proxy.conn.url = s.url = s.builder.call(this, s.connection);
        s.proxy.conn.method = "GET";   
        
        /* fix to fire a load style event only once (as it should by default) */    
        this.on("load", function(s, r) {
            this.fireEvent("initialload", s, r, this);
        }, this, {single: true});
        
        this.applyFilterToLiveGridStore(s);              
    }, this);
    
    store.on("load", function(s, r, o) {
        if (this.useMetaDataFor("summary"))
        {
            s.requestedMetaData = true;
            delete s.connection.parameters.meta;            
        }
        
        this.fireEvent("load", s, r, this);
    }, this);
    
    //var view = new Ext.ux.grid.BufferedGridView({
    var view = new Sage.SalesLogix.Controls.BufferedGridView({
        id: this.makeFriendlyId("summary"),
        nearLimit: 25,
        forceFit: true,
        autoFill: true,
        loadMask: {
            msg: this.pleaseWaitMsg
        }
    }); 
    
    view.on("beforebuffer", function(v, s, index, visible, total, offset) {
        s.proxy.conn.url = s.url = s.builder.call(this, s.connection);
        s.proxy.conn.method = "GET";  
        
        this.applyFilterToLiveGridStore(s);
    }, this); 
    
    view.on("beforebuffer", function(v, s, idx, vis, cnt) { this.onLiveGridViewRangeEvent(idx, vis, cnt); }, this);   
    view.on("buffer", function(v, s, idx, vis, cnt) { this.onLiveGridViewRangeEvent(idx, vis, cnt); }, this);    
    view.on("cursormove", function(v, idx, vis, cnt) { this.onLiveGridViewRangeEvent(idx, vis, cnt); }, this);
        
    view.on("cursormove", function() {
        //TODO: Find out what idRows() is for.
        if (typeof idRows != "undefined") idRows();
    }, this);    
 
    var selectionModel = new Ext.ux.grid.BufferedRowSelectionModel({
        singleSelect: (this.getViewOptions("summary").singleSelect === false) ? false : true /* default to true */
    }); 
    
    selectionModel.on("rowselect", this.onLiveGridRowSelect, this);
    
    var columnModel;
    if (this.useMetaDataFor("summary"))
        columnModel = new Ext.grid.ColumnModel([]);
    else
        columnModel = new Ext.grid.ColumnModel(converter.toColumnModel()); //TODO: work in non dynamic layout for column model
        
    var grid = new Ext.grid.GridPanel({
        id: this.makeId("summary"), 
        ds: store,
        enableDragDrop: false,
        cm: columnModel,
        sm: selectionModel,
        loadMask: {
            msg: this.loadingMsg 
        },
        view: view,
        title: "",
        stripeRows: false,
        stateId: this.getChildStateId("summary"), 
        border: false,
        stateful: false,
        layout: "fit",
        cls: "list-view-summary"
    });
    
    store.on("beforeload", function(s, o) {  
        /* need to re-adjust row sizing */              
        var view = grid.getView();
        if (view)
            view.rowHeight = -1;    
    }, this);
    
    var handleShow = function() {
        if (this.createOnly && (this.presented == false))
            return; /* we wait until present is called to load in this situation */
            
        var store = grid.getStore();        

        /* clear sort */
        store.sortToggle = {}; 
        store.sortInfo = null; 
                   
        /* apply new state id */                   
        grid.stateId = self.getChildStateId("summary");        
        grid.initState();   
        
        store.load(); 
    };
    
    grid.on("show", function() {
        if (grid.rendered)        
            handleShow.call(this); /* g.getStore().load(); */
        else
            grid.on("render", function() { handleShow.call(this); /* g.getStore().load(); */ }, this, { single: true });
    }, this);       
   
    /* must be after grid panel creation */
    if (this.useMetaDataFor("summary"))
        store.on("metachange", function(s, m) { this.onLiveGridStoreMetaChange(s, m, {grid: grid}); }, this);
        
    var handleRefresh = function() {
        var store = grid.getStore();        

        /* clear sort */
        store.sortToggle = {}; 
        store.sortInfo = null; 
                   
        /* apply new state id */                   
        grid.stateId = self.getChildStateId("summary");        
        grid.initState();
        
        store.requestedMetaData = false;
        store.connection = self.connections.summary;
        store.converterConfig = self.metaConverters.summary;
        store.manager = self.managers.summary;
        store.load();  
    };
    
    this.refreshFunc.summary = function() {                       
        if (grid.rendered) 
            handleRefresh.call(this);
        else         
            grid.on("render", function(grid) {
                handleRefresh.call(this);                                
            }, this, {single: true});        
    };
        
    return grid;
};

Sage.SalesLogix.Controls.ListPanel.prototype.onLiveGridRowClick = function(grid, index, e) {
    var view = grid.getView();
    var store = grid.getStore();                
    var row = store.getAt(index) || store.data.items[index - view.bufferRange[0]];     
    if (row) 
        this.fireEvent("itemselect", row, index, e);   
};

/*
    The parameter passed to the event follows the format of {id: 'the id', data: {... raw data ...}}
*/
Sage.SalesLogix.Controls.ListPanel.prototype.onLiveGridRowSelect = function(model, index, row) {   
    if (row)
        this.fireEvent("itemselect", row, index);
};

Sage.SalesLogix.Controls.ListPanel.prototype.onLiveGridStoreMetaChange = function(s, m, o) {
    var c = {meta: m};
    Ext.apply(c, s.converterConfig);
    s.converter = Ext.ComponentMgr.create(c);
    s.converter.init();
    var store = o.grid.getStore();
    store.suspendEvents();
    store.removeAll();
    store.resumeEvents();
    o.grid.getColumnModel().setConfig(s.converter.toColumnModel());
};

Sage.SalesLogix.Controls.ListPanel.prototype.onLiveGridViewRangeEvent = function(rowIndex, visibleRows, totalCount) {
    var message = (totalCount === 0) ? this.emptyRangeMsg : String.format(this.visibleRangeMsg, rowIndex + 1, rowIndex + visibleRows, totalCount);
    var tbar = this.getTopToolbar();
    if (tbar && tbar.setMessage)
        tbar.setMessage(message);
};
//cnh Over ride this get Selection Model
Sage.SalesLogix.Controls.ListPanel.prototype.getSelections = function(o) {
    if (this.activeView != "list") /* currently only the list view supports selections */
        return []; 
    
    o = Ext.applyIf(o || {}, {
        idOnly: false    
    });   
    
    if (o.idOnly === true)
    {

              var result = [];
              var selections =this.views.list.getSelectionModel().getSelections();
              for (var i = 0; i < selections.length; i++)
              {
                result.push(selections[i].data[this.views.list.view.ds.converter.meta.keyfield]);                
              }
              return result;  
    }
    else
        return this.views.list.getSelectionModel().getSelections();
};

Sage.SalesLogix.Controls.ListPanel.prototype.getSelectionInfo = function() {
   // if (this.activeView != "list") /* currently only the list view supports selections */
   //     return []; 

    var recordCount = this.views.list.store.reader.jsonData.count; //this.views.list.store.getCount();
    var selectionCount = this.getTotalSelectionCount();
    var selectionKey = this.id;
    var mode = 'selection';
    var selections = [];
    var ranges = []; 
    var keyField = this.views.list.view.ds.converter.meta.keyfield;
    var sortDirection = this.views.list.view.ds.lastOptions.params.dir;
    var sortField = this.views.list.view.ds.lastOptions.params.sort;
    
    if(recordCount == selectionCount)
    {
        if(selectionCount > 0)
        {
           mode = 'selectAll'
        }       
    }
    else
    {
          
       var sels = this.views.list.getSelectionModel().getSelections();
       for (var i = 0; i < sels.length; i++)
       {
            var selection = {
                rn: sels[i].data['SLXRN'],
                id: sels[i].data[this.views.list.view.ds.converter.meta.keyfield]
             };
           //selections.push((sels[i].data['SLXRN']+ ':' +sels[i].data[this.views.list.view.ds.converter.meta.keyfield]));
           selections.push(selection);
       }
             
       var rgs = this.views.list.getSelectionModel().getPendingSelections();  
       for (var i = 0; i < rgs.length; i++)
       {          
               var rangeTemp = rgs[i];
               var range = {
                startRow: rangeTemp[0],
                endRow: rangeTemp[1]
             };
             ranges.push(range);        
       }                            
       
   }      
   var selectionInfo = {
       key: selectionKey,
       mode: mode,
       selectionCount: selectionCount,
       recordCount: recordCount,
       sortDirection: sortDirection,
       sortField:sortField,
       keyField: keyField,
       ranges: ranges,
       selections: selections
      };
              
   return selectionInfo;     
};


//Add to get the real cout of selection even if they are pending.
Sage.SalesLogix.Controls.ListPanel.prototype.getTotalSelectionCount = function() {
    if (this.activeView != "list") /* currently only the list view supports selections */
        return 0; 
    
        var totalCount = 0;
        var selections = this.views.list.getSelectionModel().getSelections();
        var pendingSelections = this.views.list.getSelectionModel().getPendingSelections();
        
        for (var i = 0; i < pendingSelections.length; i++)
        {
            var range = pendingSelections[i];
            var startRow = range[0];
            var endRow = range[1];
            totalCount = totalCount + (endRow - startRow) + 1;
            
        }             
        totalCount = totalCount + selections.length;
        
        return totalCount;    
   
};


Ext.reg("listpanel", Sage.SalesLogix.Controls.ListPanel);

Sage.SalesLogix.Controls.SummaryPanel = Ext.extend(Ext.Panel, {
    initComponent: function() {    
        /* optional configuration */                
        Ext.applyIf(this, {       
           
        });
        
        /* required configuration */
        Ext.apply(this, {
           
        });
              
        Sage.SalesLogix.Controls.SummaryPanel.superclass.initComponent.call(this);    
        
        this.bind();                
    },	
	bind: function() {	
        if (this.list)
        {
            this.list.on("itemselect", function(context, index, e) {
		            this.showSummary(context);
		        }, this);
		        
		    this.list.on("load", function(s, r, l) {
		            if (this.context)
		                return;
		                
		            if (r && r.length > 0)
		                this.showSummary(r[0]);
		        }, this);
		}
		        
		this.on("show", function() {
		    if (this.context)
		        this.showSummary(this.context);    
		});	
		
		this.on("hide", function() {
		    this.clear();
		});
	},
	clear: function() {
	    this.body.dom.innerHTML = "";	    
	},
	refresh: function() {
	    if (this.rendered)
	    {	    
	        this.body.dom.innerHTML = "";
	        this.context = false;	    
	    } 
	    else
	    {
	        this.on("render", function(panel) { 
                this.body.dom.innerHTML = "";
	            this.context = false;
            }, this, {single: true});
	    }
	},
	showSummary: function(context) {	    
	    if (this.manager)
	    {	        
	        if (this.showTimeout)
	            clearTimeout(this.showTimeout);
	            
	        this.context = context;
	        
	        if (this.hidden)
	            return;
	            
	        if (this.isWaiting === false)    
                this.body.dom.innerHTML = '<div class="loading-indicator">'+Sage.SalesLogix.Controls.Resources.ListPanel.LoadingMsg+'</div>'; 	            
            this.isWaiting = true;                
            	        
	        var self = this;
	        this.run = this.run || function() {
	            self.manager.show(self.context, self.body.dom);
	            self.isWaiting = false;
	        };	        
	        
	        this.showTimeout = setTimeout(this.run, 250);  
	    }
	}
});

Ext.reg("summarypanel", Sage.SalesLogix.Controls.SummaryPanel);

Sage.SalesLogix.Controls.ListPanelToolbar = Ext.extend(Ext.Toolbar, {
    initComponent : function()
    {
        Sage.SalesLogix.Controls.ListPanelToolbar.superclass.initComponent.call(this);
        this.bind();
    },
    bind: function() {
        var parent = this.findParentBy(function(c) { /* first parent */ return true; }, this);
		if (parent && parent instanceof Sage.SalesLogix.Controls.ListPanel)
		    parent.on("viewswitch", function(view, id, component) {
                this.setMessage("");
		    }, this);
    },
    unbind: function() {
    
    },
    setMessage: function(message) {
        if (this.messageEl)
            this.messageEl.dom.innerHTML = message;    
    },
    onRender : function(container, position)
    {
        Sage.SalesLogix.Controls.ListPanelToolbar.superclass.onRender.call(this, container, position);
       
        this.messageEl = Ext.fly(this.el.dom).createChild({tag: "span", cls:"x-paging-info"});
    }    
});

Ext.reg("listpaneltoolbar", Sage.SalesLogix.Controls.ListPanelToolbar);

/****************************/
/***** SUMMARY MANAGER ******/
/****************************/

/**
 * @cfg {String|Array} template
 * The template to display.
 */

/**
 * @cfg {String} params
 * Parameters to pass to the data request.
 */
 
/**
 * @cfg {Object} builder
 * A URL builder that can transform the connection.
 */
 
/**
 * @cfg {String} connection
 * An connection object.
 */
 
Sage.SalesLogix.Controls.SummaryManager = function(config) {   
    config = config || {};    
    Ext.apply(this, config);   
    
    this.queue = []; // queue of pending show operations    
    this.timeout = false;  
    this.run = false;
    this.template = new Ext.XTemplate(this.template);
    this.tooltip = new Sage.SalesLogix.Controls.SummaryToolTip({
        renderTo: Ext.getBody(),
        autoWidth: true,
        dismissDelay: 0,
        hideDelay: 500,
        showDelay: 250
    });
    
    if (this.connection && this.owner)
        this.builder = this.owner.builders[this.connection.builder];
    
    Sage.SalesLogix.Controls.SummaryManager.superclass.constructor.apply(this, arguments);
    
    this.addEvents(
        'show'
    );
    
    /* summary managers need to be named in order to be referred back to from tooltips */
    if (this.id)
        Sage.SalesLogix.Controls.SummaryManager.instances[this.id] = this; 
};

Ext.extend(Sage.SalesLogix.Controls.SummaryManager, Ext.util.Observable);

Sage.SalesLogix.Controls.SummaryManager.instances = {};

/*
    if queued is true, el should be a string id.
    * o
        id: id for the current item
        data: raw data for the current item
*/
Sage.SalesLogix.Controls.SummaryManager.prototype.show = function(o, el, queued) {    
    if (queued === true)
    {    
        if (this.timeout)
            clearTimeout(this.timeout);   
                    
        var self = this;
        this.run = this.run || function() {
            self.processQueue();
        };  
        
        this.queue.push({o: o, el: el});             
        
        setTimeout(this.run, 250);
        return;
    }
    else
    {
        this.requestData(o, el);
    }
};

Sage.SalesLogix.Controls.SummaryManager.prototype.processQueue = function() {      
    var trimmed = [];    
    for (var i = this.queue.length - 1; i >= 0; i--)
    {
        if (document.getElementById(this.queue[i].el))
            trimmed.push(this.queue[i]);
        else   
            break;
    }
    
    this.queue = [];
        
    //TODO: could actually batch all calls here 
    for (var i = 0; i < trimmed.length; i++)    
        this.requestData.call(this, trimmed[i].o, trimmed[i].el);
};

Sage.SalesLogix.Controls.SummaryManager.prototype.requestData = function(o, el) {   
    var o = o || {};    
    var url = this.builder.call(this, this.connection, o);
    var self = this;
    $.ajax({
        url: url,
        dataType: "json",
        data: o.params || {},
        success: function(data) {
            self.processData(o, el, data);
        },
        error: function(request, status, error) {
        
        }
    });
};

Sage.SalesLogix.Controls.SummaryManager.prototype.processData = function(o, el, data) {
    if (typeof el === "string")
        el = Ext.get(el);
    if (el) 
    {        
        // Add the original sdata results to the data.items to be able to find the Occurence data/time
        Ext.apply(data.items[0], {context:o});
        this.template.overwrite(el, Ext.apply(data, {summarymanager:this.id}));    

        this.fireEvent("show", this, o, el);
    }
};

Sage.SalesLogix.Controls.SummaryManager.prototype.onToolTipTargetOver = function(el, context, child, e) {    
    /* copy the connection object and apply defaults from the manager connection */    
    var connection = Ext.apply({}, this.children[child].connection);
    
    Ext.applyIfNull(connection.parameters, this.connection.parameters);
    Ext.applyIfNull(connection, this.connection);
    
    var url = this.builder.call(this, connection, context);

    if (!e.pageX && !e.pageY)
    {
        e.pageX = e.clientX + document.body.scrollLeft;
        e.pageY = e.clientY + document.body.scrollTop;
    }

    this.tooltip.target = el;  
    this.tooltip.targetXY = Ext.lib.Event.getXY(e);  
    this.tooltip.body.dom.innerHTML = '<div class="loading-indicator">'+Sage.SalesLogix.Controls.Resources.ListPanel.LoadingMsg+'</div>'; 
    this.tooltip.show();
    
    var self = this;
    $.ajax({
        url: url,
        dataType: "json",
        success: function(data) {
            /* ensure the template */
            if (!(self.children[child].template instanceof Ext.XTemplate))
                self.children[child].template = new Ext.XTemplate(self.children[child].template);
                
            self.children[child].template.overwrite(self.tooltip.body, data);
            self.tooltip.syncSize();
            self.tooltip.doLayout();
        },
        error: function(request, status, error) {
        
        }
    });
};

Sage.SalesLogix.Controls.SummaryManager.prototype.onToolTipTargetOut = function(el, context, child, e) {
    if (this.tooltip && !this.tooltip.hidden)
    {
        if (this.tooltip.hideTimer)
            this.tooltip.hide();
        else    
            this.tooltip.delayHide();
    }
};

Sage.SalesLogix.Controls.SummaryManager.toolTipHandler = function(dir, e) {
    if (!e) var e = window.event;
    
    var el = Ext.get(e.target || e.srcElement);
    
    if (!el)
        return;
    
    var id = el.getAttributeNS("slx", "id");
    var name = el.getAttributeNS("slx", "summarymanager");
    var child = el.getAttributeNS("slx", "summarychild"); 
       
    if (!id || !name || !child)
        return;
        
    var manager = Sage.SalesLogix.Controls.SummaryManager.instances[name];
    
    if (!manager)
        return;
        
    switch (dir.toLowerCase()) 
    {
        case "over":
            //Don't show the tooltip if there are no results
            if (el.dom.innerText == '0')
                return;
                
            manager.onToolTipTargetOver(el, {id: id}, child, e);
            break;
        case "out":
            manager.onToolTipTargetOut(el, {id: id}, child, e);
            break;
    }
};

var summaryToolTipHandler = Sage.SalesLogix.Controls.SummaryManager.toolTipHandler;

Sage.SalesLogix.Controls.SummaryManager.navHandler = function(entityid, tabName, e) {
    if ((entityid == "") || (entityid.length != 12)) { return; }
    var url = document.location.href;
    if (url.indexOf("?") > -1) {    
        url = url.substring(0, url.indexOf("?"));
    }
    url += "?entityid=" + entityid;
    if (tabName != "") {
        url = url + "&activetab=" + tabName;
    }
    document.location = url;
};

var summaryNavHandler = Sage.SalesLogix.Controls.SummaryManager.navHandler;

Ext.reg("summarymanager", Sage.SalesLogix.Controls.SummaryManager);

/*
    Persistant ToolTip support based on http://extjs.com/forum/showthread.php?p=192455#post192455. 
*/
Sage.SalesLogix.Controls.SummaryToolTip = Ext.extend(Ext.ToolTip, {
    initComponent: function() {                
        Sage.SalesLogix.Controls.SummaryToolTip.superclass.initComponent.call(this);
    },

    afterRender: function() {
        Sage.SalesLogix.Controls.SummaryToolTip.superclass.afterRender.call(this);
        this.el.on('mouseout', this.onTargetOut, this);
        this.el.on('mouseover', this.onElOver, this);
        
        if (Ext.isIE) 
            this.on('resize', this.fixIESize, this);
    },
    checkWithin: function(e) {
        if(this.el && e.within(this.el.dom, true)) 
        {
            return true;
        }
        if(this.disabled || e.within(this.target.dom, true))
        {
            return true;
        }
        return false;
    },
    onElOver: function(e) {
        if (this.checkWithin(e)) 
            this.clearTimer('hide');        
    },
    onTargetOver: function(e) {
        if(this.disabled || e.within(this.target.dom, true))
            return;
            
        this.clearTimer('hide');
        this.targetXY = e.getXY();
        this.delayShow(e);
    },
    delayShow: function(e) {
        this.showTimer = this.doShow.defer(this.showDelay, this, [e]);
    },
    doShow: function(e) {
        var xy = e.getXY();
        var within = this.target.getRegion().contains({left: xy[0], right: xy[0], top: xy[1], bottom: xy[1]});
        if (within) 
            this.show();        
    },
    onTargetOut: function(e)
    {
        if (this.checkWithin(e)) 
        {
            this.clearTimer('hide');
        } 
        else if (this.hideTimer) 
        {   
            this.hide();
        } 
        else 
        {
            this.delayHide();
        }
    },
    fixIESize: function(tip, aw, ah, w, h) {
        var top = Ext.get(this.getEl().dom.firstChild);
        var bottom = Ext.get(this.getEl().dom.lastChild.lastChild);
        
        if (w)
            w = w - top.getFrameWidth("l"); /* can use top or bottom as they should be the same in this scenario */
        else
            w = this.el.getWidth();
            
        if (top) 
            top.setWidth(w);
        
        if (bottom)
            bottom.setWidth(w);    
    }
});

Ext.reg('summarytooltip', Sage.SalesLogix.Controls.SummaryToolTip); 

/***************************/
/*** METADATA CONVERTERS ***/
/***************************/
Sage.SalesLogix.Controls.MetaConverter = function(config) {
    if (config && config.meta)
        Ext.apply(this, config);
    else
        Ext.apply(this, {meta: config});   
        
    Sage.SalesLogix.Controls.MetaConverter.superclass.constructor.apply(this, arguments);
        
    this.addEvents(
        "init"
    );    
};

Ext.extend(Sage.SalesLogix.Controls.MetaConverter, Ext.util.Observable);

Sage.SalesLogix.Controls.MetaConverter.toColumnModel = function() {
    return {};
};

Sage.SalesLogix.Controls.MetaConverter.toReaderConfig = function() {
    return {};
};

Sage.SalesLogix.Controls.MetaConverter.init = function() {
    this.fireEvent("init", this, this.meta);
};

Sage.SalesLogix.Controls.GroupSummaryMetaConverter = Ext.extend(Sage.SalesLogix.Controls.MetaConverter, {
    init: function() {
    
    },
    toColumnModel: function() {
        var model = [];
        var svc = Sage.Services.getService("ClientGroupContext");
        if (svc) 
        {
            var table = svc.getContext().CurrentTable;
            /* there was a width: 'auto' here but it was causing issues with column widths */
            var item = {
                header: svc.CurrentName,
                align: 'left', 
                sortable: false,
                dataIndex: table + 'ID',
                renderer: this.summaryRenderer
            };
        }
        model.push(item);          
        return model;
    },
    toReaderConfig: function() {
        var columns = [];
        var id = "ACCOUNTID";
        var svc = Sage.Services.getService("ClientGroupContext");
        if (svc) 
            id = svc.getContext().CurrentTable + "ID";        
        columns.push({name: id, sortType: "string" });
        columns.push({name: 'SLXRN', sortType: 'int'});
        return {meta: this.meta, recordType: columns};   
    },
    summaryRenderer: function(value, meta, record, rowIndex, columnIndex, store) {
        if (!value)
            return "&nbsp;";
            
        if (value.length != 12) 
            return value;
            
        var el = value + "_" + Sage.SalesLogix.Controls.GroupSummaryMetaConverter.renderedCount++;
        store.manager.show({id: value, record: record}, el, true);
        return String.format('<div id="{0}" class="list-view-summary-item"><div class="loading-indicator">{1}</div></div>', el, Sage.SalesLogix.Controls.Resources.ListPanel.LoadingMsg); 
    }
});
Sage.SalesLogix.Controls.GroupSummaryMetaConverter.renderedCount = 0;

Ext.reg("groupsummarymetaconverter", Sage.SalesLogix.Controls.GroupSummaryMetaConverter);

Sage.SalesLogix.Controls.GroupMetaConverter = Ext.extend(Sage.SalesLogix.Controls.MetaConverter, {
    toBoolean: function(v) {
        if (typeof v === "boolean")
            return v;
        if (typeof v === "string" && v.match)
            return !!v.match(/T/i);
        return false;
    },
    init: function() {
        try {

            this.layout = { entity: this.meta.layout.mainTable || this.meta.layout.entity, columns: [] };
            for (var i = 0; i < this.meta.layout.items.length; i++)
                this.layout.columns.push({
                    dataPath: this.meta.layout.items[i].dataPath,
                    alias: this.meta.layout.items[i].alias,
                    align: this.meta.layout.items[i].align,
                    formatString: this.meta.layout.items[i].formatString,
                    format: this.meta.layout.items[i].format,
                    caption: this.meta.layout.items[i].caption,
                    captionAlign: this.meta.layout.items[i].captionAlign,
                    sortType: null,
                    width: this.meta.layout.items[i].width,
                    isVisible: this.toBoolean(this.meta.layout.items[i].visible), // ((typeof this.meta.layout.items[i].visible === "boolean") ? this.meta.layout.items[i].visible : !!this.meta.layout.items[i].visible.match(/T/i)),
                    isWebLink: this.toBoolean(this.meta.layout.items[i].webLink), // ((typeof this.meta.layout.items[i].webLink === "boolean") ? this.meta.layout.items[i].webLink : !!this.meta.layout.items[i].webLink.match(/T/i)),
                    isPrimaryKey: false
                });

            var l = this.layout.columns.length;
            for (var i = 0; i < l; i++) {
                var column = this.layout.columns[i];
                if (column.isVisible == false)
                    continue;

                if (column.renderer)
                    continue;

                switch (true) {
                    case ((column.alias == "ACCOUNT") || (column.alias.match(/A\d_ACCOUNT/) ? true : false)):
                        column.renderer = this.createEntityLinkRenderer("ACCOUNT");
                        break;

                    case !!column.alias.match(/^email$/i):
                        column.renderer = this.createEmailRenderer(column);
                        break;

                    case !!(column.format && column.format.match(/DateTime/i)):
                        column.renderer = this.createDateTimeRenderer(column);
                        break;

                    case !!(column.format && column.format.match(/Phone/i)):
                        column.renderer = this.createPhoneRenderer(column);
                        break;

                    case !!(column.format && column.format.match(/Fixed/i)):
                        column.renderer = this.createFixedNumberRenderer(column);
                        break;

                    case !!(column.format && column.format.match(/Boolean/i)):
                        column.renderer = this.createBooleanRenderer(column);
                        break;

                    default:
                        column.renderer = this.createDefaultRenderer(column);
                        break;
                }

                if (column.isWebLink)
                    column.renderer = this.createEntityLinkRenderer(column);


                var r;
                for (var j = 0; j < Sage.SalesLogix.Controls.GroupMetaConverter.renderers.length; j++)
                    if ((r = Sage.SalesLogix.Controls.GroupMetaConverter.renderers[j].call(this, column)) !== false)
                    column.renderer = r;
            }
            this.fireEvent("init", this, this.layout);
        }
        catch (e) {
            Ext.Msg.alert("Error Reading Meta Data", e.message || e.description);
        }
    },
    toReaderConfig: function() {
        try {
            var fields = [];
            fields.push({ name: 'SLXRN', sortType: 'int' });
            for (var i = 0; i < this.layout.columns.length; i++) {
                var column = this.layout.columns[i];
                var field = {
                    name: column.alias,
                    sortType: column.sortType || "string"
                };

                switch (column.format) {
                    case "Owner":
                    case "User":
                        fields.push({ name: column.alias + "NAME", sortType: "string" });
                        break;
                    case "DateTime":
                        field.sortType = "int";
                        break;
                    case "PickList Item":
                        fields.push({ name: column.alias + "TEXT", sortType: "string" });
                        break;
                }

                if (column.isWebLink)
                    fields.push({ name: this.layout.entity + "ID", sortType: "string" });

                if (column.alias == "ACCOUNT" || column.alias == "ACCOUNT_ACCOUNT")
                    fields.push({ name: "ACCOUNT_ID", sortType: "string" });

                fields.push(field);
            }
            return { meta: this.meta, recordType: fields };
        }
        catch (e) {
            Ext.Msg.alert("Error Creating Reader Config", e.message || e.description);
            return { meta: this.meta, recordType: [] };
        }
    },
    toColumnModel: function() {
        try {
            var model = [];
            var cols = this.layout.columns;
            for (var i = 0; i < cols.length; i++) {
                var thiscol = cols[i];
                if (thiscol.isVisible && parseInt(thiscol.width) > 0) {
                    var item = {
                        header: thiscol.caption,
                        align: thiscol.align,
                        width: parseInt(thiscol.width),
                        sortable: true,
                        dataIndex: thiscol.alias,
                        renderer: thiscol.renderer
                    };

                    // compares each item's header to see if there is a matching localized version
                    // in the GroupMetaConverter.localization dictionary
                    Ext.each(Sage.SalesLogix.Controls.GroupMetaConverter.localization, function(l) {
                        if (l.hasOwnProperty(item["header"])) {
                            item["header"] = l[item["header"]];
                            return false;
                        }
                    });

                    switch (thiscol.format) {
                        case "Owner":
                        case "User":
                            item.dataIndex += "NAME";
                            break;
                        case "PickList Item":
                            item.dataIndex += "TEXT";
                            break;
                    }

                    model.push(item);
                }
            }

            return model;
        }
        catch (e) {
            Ext.Msg.alert("Error Creating Column Model", e.message || e.description);
            return [];
        }
    },
    createEntityLinkRenderer: function(column) {
        var entity;
        var valuerenderer;
        if (typeof column === "string") {
            entity = column;
            valuerenderer = function(v, m, r, ro, c, s) { return Ext.util.Format.htmlEncode(v); };
        } else {
            entity = (column.dataPath.lastIndexOf("!") > -1)
                ? column.dataPath.substring(0, column.dataPath.lastIndexOf("!")).substring(column.dataPath.lastIndexOf(".") + 1)
                : column.dataPath.substring(0, column.dataPath.lastIndexOf(":"));
            valuerenderer = column.renderer;
        }
        var tableName = entity.slice(0);
        var keyField = tableName + "ID";
        var grpService = Sage.Services.getService("ClientGroupContext");
        if (grpService) {
            if (entity == grpService.getContext().CurrentTable) {
                entity = grpService.getContext().CurrentEntity;
                keyField = grpService.getContext().CurrentTableKeyField;
            }
        }
        return function(value, meta, record, rowIndex, columnIndex, store) {
            var id = record.data[keyField] || record.data[tableName + "_ID"];
            if (!id)
                return value;

            return (value ? String.format("<a href={2}.aspx?entityid={0}>{1}</a>", id, valuerenderer(value, meta, record, rowIndex, columnIndex, store), entity) : "");
        };
    },
    createFixedNumberRenderer: function(column) {
        var format = column.formatString.replace(/%.*[dnf]/, "{0}").replace("%%", "%");
        var useGroupingChar = (column.formatString.match(/%.*[dnf]/) == null) ?
            false : // is not a valid format string
            (column.formatString.match(/%.*[dnf]/)[0].indexOf("n") > 0);
        var match = column.formatString.match(/\.(\d+)/);
        var precision;
        if (match) {
            precision = match[1];
        }
        var NumericGroupingChar = Sage.SalesLogix.Controls.GroupMetaConverter.numericGroupingChar;
        var rx = /(\d+)(\d{3})/;
        if (precision && !isNaN(precision)) {
            return function(value, meta, record, rowIndex, columnIndex, store) {
                if (value && !isNaN(value)) {
                    var num = String.format(format, value.toFixed(precision));
                    if (useGroupingChar) {
                        while (rx.test(num)) {
                            num = num.replace(rx, '$1' + NumericGroupingChar + '$2');
                        }
                    }
                    return num;
                }
            };
        }

        return function(value, meta, record, rowIndex, columnIndex, store) {
            return (value ? Ext.util.Format.htmlEncode(value) : "&nbsp;");
        };
    },
    createDateTimeRenderer: function(column) {
        var renderer = Ext.util.Format.dateRenderer(ConvertToPhpDateTimeFormat(column.formatString));
        return function(value, meta, record, rowIndex, columnIndex, store) {
            if (value && value.getMinutes && value.getHours) {
                var minutes = (value.getMinutes() + value.getHours() * 60);
                if ((1440 - minutes == value.getTimezoneOffset()) && (column.formatString.indexOf('h') == -1) && (value.getTimezoneOffset() > 0))
                    return renderer(new Date(value.clone().setDate(value.getDate() + 1)));
            }
            return renderer(value);
        };
    },
    createPhoneRenderer: function(column) {
        return function(value, meta, record, rowIndex, columnIndex, store) {
            if ((value == null) || (value == "null")) return "&nbsp;";
            if (!value || value.length != 10)
                return Ext.util.Format.htmlEncode(value);

            return String.format("({0}) {1}-{2}", value.substring(0, 3), value.substring(3, 6), value.substring(6));
        };
    },
    createEmailRenderer: function(column) {
        return function(value, meta, record, rowIndex, columnIndex, store) {
            return (value ? String.format("<a href=mailto:{0}>{0}</a>", Ext.util.Format.htmlEncode(value)) : "");
        }
    },
    createBooleanRenderer: function(column) {
        return function(value, meta, record, rowIndex, columnIndex, store) {
            /* Format the char value based on the SalesLogix business rule for Boolean fields. */
            if ((value == null) || (value == "")) return "&nbsp;";
            /*
            var arrBooleans = new Array(5);
            arrBooleans[0] = "T";
            arrBooleans[1] = "t";
            arrBooleans[2] = "Y";
            arrBooleans[3] = "y";
            arrBooleans[4] = "1";
            arrBooleans[5] = "+";
            var booleanValue = false;
            for (var i = 0; i <= 5; i++) {
            if (value == arrBooleans[i]) {
            booleanValue = true;
            break;
            }
            }
            */
            var arrBooleans = { "T": true, "t": true, "Y": true, "y": true, "1": true, "+": true };
            var booleanValue = arrBooleans[String(value)];

            var strFmt = column.formatString;
            var strYes = Ext.util.Format.htmlEncode(Sage.SalesLogix.Controls.Resources.ListPanel.YesText);
            var strNo = Ext.util.Format.htmlEncode(Sage.SalesLogix.Controls.Resources.ListPanel.NoText);
            if ((strFmt == null) || (strFmt == "")) return (booleanValue == true) ? strYes : strNo;
            var iIndex = (String(strFmt).indexOf("/"));
            if (iIndex != -1) {
                // Examples of formatString: "True/False", "Positive/Negative", "Yes/No"
                var arrValues = (String(strFmt).split("/"));
                if (arrValues.length == 2) {
                    var strValue = (booleanValue == true) ? arrValues[0] : arrValues[1];
                    if ((strValue == null) || (strValue == "")) {
                        // strYes and strNo are already encoded
                        return (booleanValue == true) ? strYes : strNo;
                    }
                    return Ext.util.Format.htmlEncode(strValue);
                }
            }
            return (booleanValue == true) ? strYes : strNo;
        }
    },
    createDefaultRenderer: function(column) {
        return function(value, meta, record, rowIndex, columnIndex, store) {
            return (value ? Ext.util.Format.htmlEncode(value) : "&nbsp;");
        }
    }
});

function ListPanel_RenderDateOnly(value)
{   
    var renderer = Ext.util.Format.dateRenderer(ConvertToPhpDateTimeFormat(getContextByKey('userDateFmtStr')));
    if (value && value.getMinutes && value.getHours) {
        var minutes = (value.getMinutes() + value.getHours() * 60);
        if ((1440 - minutes == value.getTimezoneOffset()) && (value.getTimezoneOffset() > 0))
            return renderer(new Date(value.clone().setDate(value.getDate() + 1)));
    }
    return renderer(value);
}        

//recieves unformatted number and a format string 
function ListPanelSummary_FixedNumberRenderer(value, fmtstr)
{
    var format = fmtstr.replace(/%.*[dnf]/, "{0}").replace("%%", "%");
    var useGroupingChar = (fmtstr.match(/%.*[dnf]/) == null) ?
        false : // is not a valid format string
        (fmtstr.match(/%.*[dnf]/)[0].indexOf("n") > 0);
    var match = fmtstr.match(/\.(\d+)/);
    var precision;
    if (match) 
    {
        precision = match[1];
    }
    var NumericGroupingChar = Sage.SalesLogix.Controls.GroupMetaConverter.numericGroupingChar;
    var rx = /(\d+)(\d{3})/;
    if (precision && !isNaN(precision)) 
    {
        if (value && !isNaN(value)) 
        {
            var num = String.format(format, value.toFixed(precision));
            if (useGroupingChar) 
            {
                while (rx.test(num)) 
                {
                    num = num.replace(rx, '$1' + NumericGroupingChar + '$2');
                }
            }
            return num;
        }
    }
     return (value ? Ext.util.Format.htmlEncode(value) : "&nbsp;");
}        

Sage.SalesLogix.Controls.GroupMetaConverter.numericGroupingChar = ',';

/*  
    should return false for no match  
    item: function(c) {}
        c: column definition  
*/
Sage.SalesLogix.Controls.GroupMetaConverter.renderers = [function(c) {
    if (c.template)
    {
        var t;
        try
        {
            t = new Ext.XTemplate(c.template);
        }
        catch (e)
        {
            Ext.Msg.alert("Error Compiling Template", e.message || e.description);
        }
        return function(value, meta, record, rowIndex, columnIndex, store) {
            var o = {value: value, row: record, column: c};
            try
            {
                /* we need to catch any errors here as they will not be presented in a friendly manner otherwise */
                /* which makes it very difficult to track them down */
                return t.apply(o);
            }
            catch (e)
            {
                if (!reported)
                    Ext.Msg.alert("Error Applying Template", e.message || e.description);
                reported = true;
                return value;
            }
        };
    }
    return false;
}];
Sage.SalesLogix.Controls.GroupMetaConverter.registerCustomRenderer = function(r) {
    Sage.SalesLogix.Controls.GroupMetaConverter.renderers.push(r);
};
// creates a GroupMetaConverter localization dictionary to hold localized header strings
Sage.SalesLogix.Controls.GroupMetaConverter.localization = [];
Sage.SalesLogix.Controls.GroupMetaConverter.registerLocalizationStore = function(s) {
    Sage.SalesLogix.Controls.GroupMetaConverter.localization.push(s);
};

Ext.reg("groupmetaconverter", Sage.SalesLogix.Controls.GroupMetaConverter);

Sage.SalesLogix.Controls.StandardMetaConverter = Ext.extend(Sage.SalesLogix.Controls.MetaConverter, {
    init: function() {
        try
        {
            var self = this;
            for (var i = 0; i < this.meta.layout.items.length; i++)
            {
                var item = this.meta.layout.items[i];
                
                item.width = (typeof item.width !== "number") ? parseInt(item.width) : item.width;
                item.sortable = (typeof item.sortable === "boolean") ? item.sortable : true;

                Ext.each(["header"], function(f) {
                    if (typeof item[f] === "string")
                        Ext.each(Sage.SalesLogix.Controls.StandardMetaConverter.localization, function(l) {
                            if (l.hasOwnProperty(item[f]))
                            {
                                item[f] = l[item[f]];
                                return false;
                            }
                        });
                });
                
                Ext.each(Sage.SalesLogix.Controls.StandardMetaConverter.renderers, function(r) {
                    var c;
                    if ((c = r.call(self, item)) !== false)
                    {
                        item.renderer = c;
                        return false;
                    }                     
                });                           
            }            
            
            this.fireEvent("init", this, this.layout);
        }
        catch (e)
        {
            Ext.Msg.alert("Error Reading Meta Data", e.message || e.description);            
        }
    },
    createDateTimeRenderer: function(column) {    
        var renderer = Ext.util.Format.dateRenderer(ConvertToPhpDateTimeFormat(getContextByKey('userDateFmtStr')));
        return function(value, meta, record, rowIndex, columnIndex, store) {
            return renderer(value);    
        };
    },
    toReaderConfig: function() {                                    
        return {meta: this.meta, recordType: this.meta.fields};
    },
    toColumnModel: function() {                                                            
        return this.meta.layout.items;        
    }
});

Sage.SalesLogix.Controls.StandardMetaConverter.renderers = [function(c) {
    if (c.template)
    {
        var t;
        var reported = false;
        try
        {
            t = new Ext.XTemplate(c.template);
            t.compile();
        }
        catch (e)
        {
            Ext.Msg.alert("Error Compiling Template", e.message || e.description);
        }
        return function(value, meta, record, rowIndex, columnIndex, store) {
            var o = {value: value, row: record, column: c};
            try
            {
                /* we need to catch any errors here as they will not be presented in a friendly manner otherwise */
                /* which makes it very difficult to track them down */
                return t.apply(o);
            }
            catch (e)
            {
                if (!reported)
                    Ext.Msg.alert("Error Applying Template", e.message || e.description);
                reported = true;
                return value;
            }
        };
    }
    return false;
},
// Date Time createDateTimeRenderer
function(column) {
    if (column.format && column.format.match(/DateFormat/i))
       {
        return column.renderer = this.createDateTimeRenderer(column); 
       }
     else
        return false;
    } 
];
Sage.SalesLogix.Controls.StandardMetaConverter.registerCustomRenderer = function(r) {
    Sage.SalesLogix.Controls.StandardMetaConverter.renderers.push(r);
};

Sage.SalesLogix.Controls.StandardMetaConverter.localization = [];
Sage.SalesLogix.Controls.StandardMetaConverter.registerLocalizationStore = function(s) {
    Sage.SalesLogix.Controls.StandardMetaConverter.localization.push(s);
};

Ext.reg("standardmetaconverter", Sage.SalesLogix.Controls.StandardMetaConverter);

Sage.SalesLogix.Controls.StandardSummaryMetaConverter = Ext.extend(Sage.SalesLogix.Controls.MetaConverter, {
    init: function() {
   
    },
    toColumnModel: function() {        
        return [{
            header: "ID",
            align: "left",
            sortable: false,
            dataIndex: "id",
            renderer: this.summaryRenderer
        }];
    },
    toReaderConfig: function() {   
        columns.push({name: "id", sortType: "string" });
        return {meta: this.meta, recordType: columns};   
    },
    summaryRenderer: function(value, meta, record, rowIndex, columnIndex, store) {
        if (!value)
            return "&nbsp;";
            
        if (value.length < 12) 
            return value;
            
        var el = value + "_" + Sage.SalesLogix.Controls.StandardSummaryMetaConverter.renderedCount++;
        store.manager.show({id: value, record: record}, el, true);
        return String.format('<div id="{0}" class="list-view-summary-item"><div class="loading-indicator">{1}</div></div>', el, Sage.SalesLogix.Controls.Resources.ListPanel.LoadingMsg); 
    }
});
Sage.SalesLogix.Controls.StandardSummaryMetaConverter.renderedCount = 0;

Ext.reg("standardsummarymetaconverter", Sage.SalesLogix.Controls.StandardSummaryMetaConverter);

