Sage.TaskPane.GroupListTasklet = function(options) {
    this._id = options.id;
    this._clientId = options.clientId;
    this._context = null;
    this._keyAlias = options.keyAlias;
    this._columnAlias = options.columnAlias;
    this._columnDisplayName = options.columnDisplayName;
    this._groupContextService = Sage.Services.getService("ClientGroupContext");
    this._grid = null;
    this._panel = null;
    this._resizer = null;
    this._skipOnRowSelect = false;
    this._requestedMetaData = false;
    this._connections = {
        data: {
            builder: 'sdata',
            resource: 'slxdata.ashx/slx/crm/-/groups',
            parameters: {
                family: this._groupContextService.getContext().CurrentFamily, 
                name: this._groupContextService.getContext().CurrentName,               
                responsetype: 'json',
                meta: true
            }   
        }
    };
    this._tasks = {
        buffer: []
    };
    
    Sage.TaskPane.GroupListTasklet.__instances[this._clientId] = this;
    Sage.TaskPane.GroupListTasklet.__initRequestManagerEvents();
};

Sage.TaskPane.GroupListTasklet.__instances = {};
Sage.TaskPane.GroupListTasklet.__requestManagerEventsInitialized = false;
Sage.TaskPane.GroupListTasklet.__initRequestManagerEvents = function() {
    if (Sage.TaskPane.GroupListTasklet.__requestManagerEventsInitialized)
        return;

    var contains = function(a, b) {
        if (!a || !b)
            return false;
        else
            return a.contains ? (a != b && a.contains(b)) : (!!(a.compareDocumentPosition(b) & 16));
    };

    var prm = Sys.WebForms.PageRequestManager.getInstance();
    prm.add_pageLoaded(function(sender, args) {
        var panels = args.get_panelsUpdated();
        if (panels) {
            for (var i = 0; i < panels.length; i++) {
                for (var id in Sage.TaskPane.GroupListTasklet.__instances)
                    if (contains(panels[i], document.getElementById(id))) {
                    var instance = Sage.TaskPane.GroupListTasklet.__instances[id];
                    instance.initContext();
                    instance.initGrid();
                    instance.initInteractions();
                    instance.initTaskPaneItemEvents();
                    instance.refresh();
                }
            }
        }
    });

    Sage.TaskPane.GroupListTasklet.__requestManagerEventsInitialized = true;
};


Sage.TaskPane.GroupListTasklet.prototype.init = function() {
    var self = this;
    this.initContext();
    this.initGroupManagerEvents();    
    this.initGrid();   
    this.initInteractions();    
    this.initTaskPaneItemEvents();
    this.refresh();
};

Sage.TaskPane.GroupListTasklet.prototype.refresh = function()
{
    this._grid.getStore().load();
};

Sage.TaskPane.GroupListTasklet.prototype.initTaskPaneItemEvents = function() {
    var self = this;
    var instanceClientId = $(this._context).parents(".task-pane").attr("id");
    var instance = Sage.TaskPaneWorkspace.getInstanceFromClientId(instanceClientId);
    if (instance) 
    {
        var itemClientId = $(this._context).parents(".task-pane-item").attr("id");
        var item = instance.getItemFromClientId(itemClientId);
        if (item)
            item.addListener("toggled", function(sender, args) {
                if (!args.collapsed)
                    this._panel.doLayout();  
            }, this);
    }
};

Sage.TaskPane.GroupListTasklet.prototype.initContext = function() {
    if (document.getElementById)
        this._context = document.getElementById(this._clientId);
};

Sage.TaskPane.GroupListTasklet.prototype.initInteractions = function() {
    var self = this;           
};

Sage.TaskPane.GroupListTasklet.prototype.initGroupManagerEvents = function() {
    var self = this;
    var svc = Sage.Services.getService("GroupManagerService");  
    svc.addListener(Sage.GroupManagerService.CURRENT_GROUP_POSITION_CHANGED, function(sender, evt) {
        var position = evt.current.CurrentEntityPosition;
        self._ignoreOnRowSelect = true;
        self.navigateToRow(position - 1);
    });   
    svc.addListener(Sage.GroupManagerService.CURRENT_GROUP_COUNT_CHANGED, function(sender, evt) {
        self._grid.getStore().load();
    });   
};

Sage.TaskPane.GroupListTasklet.prototype.setCurrentEntity = function(id, position) {
    var entityContextSvc = Sage.Services.getService("ClientEntityContext");
    var contextSvc = Sage.Services.getService("ClientContextService");
    if (entityContextSvc && contextSvc) 
    {
        var gMgrSvc = Sage.Services.getService("ClientGroupContext");
        if (gMgrSvc) {
            var previousPosition = gMgrSvc.getContext().CurrentEntityPosition;
            if (position == previousPosition) return;

            var mgr = Sage.Services.getService("ClientBindingManagerService");
            if ((mgr) && (!mgr.canChangeEntityContext())) { 
                this.navigateToRow(previousPosition - 1);
                return;
            }
        }

        var entityContext = entityContextSvc.getContext();                
        //$("#8332521B0B8E43bdB705171B97758A70").val("ClientEntityId=" + id + "&PreviousEntityId=" + context.EntityId);
        
        if (contextSvc.containsKey("ClientEntityId"))
            contextSvc.setValue("ClientEntityId", id);
        else
            contextSvc.add("ClientEntityId", id);
            
        if (contextSvc.containsKey("PreviousEntityId"))
            contextSvc.setValue("PreviousEntityId", entityContext.EntityId);
        else
            contextSvc.add("PreviousEntityId", entityContext.EntityId);
            
        if (contextSvc.containsKey("ClientEntityPosition"))
            contextSvc.setValue("ClientEntityPosition", position);
        else    
            contextSvc.add("ClientEntityPosition", position);
        
        __doPostBack("MainContent", "");
    }
};

Sage.TaskPane.GroupListTasklet.prototype.getGrid = function() { return this._grid; };
Sage.TaskPane.GroupListTasklet.prototype.navigateToRow = function(row) {            
    try
    {
        var count = this.getGrid().getView().visibleRows;
        var index = this.getGrid().getView().rowIndex;
        var adj = index + Math.floor((count / 2.0));
        var focusAt = row;
        if (adj > row)
            focusAt = row - Math.floor((count / 2.0));
        else
            focusAt = row + Math.floor((count / 2.0));
            
        var max = this.getGrid().getStore().getTotalCount();
        
        if (focusAt < 0)
            focusAt = 0;
        if (focusAt >= max)
            focusAt = (max - 1);                         
        
        /* safe way */
        /* this.getGrid().getView().focusRow(focusAt); */
        
        /* uses 'private' methods */
        /* fix for form focus issue */
        var xy = this.getGrid().getView().ensureVisible(focusAt, 0, false);
        this.getGrid().getView().focusEl.setXY(xy);
    } 
    catch (e)
    {
    }  
   
    var buffer = this.getGrid().getStore().bufferRange;
    if (row >= buffer[0] && row <= buffer[1])
    {
        this.getGrid().getSelectionModel().suspendEvents();
        this.getGrid().getSelectionModel().selectRow(row); 
        this.getGrid().getSelectionModel().resumeEvents();       
    }
    else
    {
        this._tasks.buffer.push(function(o) {
            o.getGrid().getSelectionModel().suspendEvents();
            o.getGrid().getSelectionModel().selectRow(row); 
            o.getGrid().getSelectionModel().resumeEvents();
        });
    }
};

Sage.TaskPane.GroupListTasklet.prototype.isInIE6 = function() {
    //alert("msie: " + $.browser.msie + " compat: " + !!document.compatMode + " xml: " + !window.XMLHttpRequest);
    //if ($.browser.msie && document.compatMode && !window.XMLHttpRequest) 
    //    return true;
    if ($.browser.msie)
    {
        var ua = navigator.userAgent;
        var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null)
          return parseFloat( RegExp.$1 ) < 7.0;
    }
    return false;
};

Sage.TaskPane.GroupListTasklet.__urlBuilders = { 
    standard: function(options, context) {
        return options;
    },
    sdata: function(options, context) {
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
                if ((typeof o.parameters[k] === "object") && (o.parameters[k] != null) && (o.parameters[k].eval === true))
                {
                    var r = eval(o.parameters[k].statement);
                    if (r !== false)
                        p.push(k + "=" + encodeURIComponent(r));
                }
                else if (typeof o.parameters[k] === "function")
                {
                    var r = o.parameters[k](context);
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
};

Sage.TaskPane.GroupListTasklet.prototype.buildUrl = function(which, context) {
    return Sage.TaskPane.GroupListTasklet.__urlBuilders[this._connections[which].builder](this._connections[which], context);    
};

Sage.TaskPane.GroupListTasklet.prototype.initGrid = function() {
    var self = this;
    
    var bufferedReader = new Ext.ux.data.BufferedJsonReader({
            root            : 'items',
            versionProperty : 'version',
            totalProperty   : 'total_count',
            id              : this._keyAlias //'id'
        }, 
        [{            
            name: this._columnAlias,
            sortType: 'string'
        },{
            name: 'SLXRN',
            sortType: 'int'
        }]
    );
    
    var bufferedDataStore = new Ext.ux.grid.BufferedStore({
        autoLoad: false,
        bufferSize: 100,
        reader: bufferedReader,
        filter: {},
        url: "build"        
    });
        
    bufferedDataStore.on("beforeload", function (store, options) {      
            var url = this.buildUrl("data", {instance: self, store: store, startAt: 0, args: arguments});
            store.proxy.conn.url = url;
            store.proxy.conn.method = "GET";
            store.url = url;                        
        }, this);
       
    var bufferedView = new Ext.ux.grid.BufferedGridView({
        nearLimit   : 25,
        forceFit    : true,
        autoFill    : true,
        loadMask    : {
            msg     : Sage.TaskPane.GroupListTasklet.Resources.WaitMsg // 'Please wait...'
        }
    }); 
    
    bufferedView.on('beforebuffer', function (view, store, rowIndex, visibleRows, totalCount, bufferOffset) {
            var url = this.buildUrl("data", {instance: self, store: store, startAt: bufferOffset, args: arguments});
            store.proxy.conn.url = url;
            store.proxy.conn.method = "GET";
            store.url = url;
        }, this);            
        
    bufferedView.on('buffer', function (view, store, rowIndex, visibleRows, totalCount, bufferOffset) {
            for (var i = 0; i < this._tasks.buffer.length; i++)
                this._tasks.buffer[i](this);
            this._tasks.buffer = [];
        }, this);
              
    bufferedView.on('refresh', function(view) { 
            var svc = Sage.Services.getService("ClientGroupContext");  
            this.navigateToRow(svc.getContext().CurrentEntityPosition - 1);  
        }, this, {single: true});      
    
    var bufferedSelectionModel = new Ext.ux.grid.BufferedRowSelectionModel({singleSelect: true});
    bufferedSelectionModel.onRefresh = function() { };
    
    bufferedSelectionModel.on('beforerowselect', function(selectionModel, index, keep, record) {
            //ensure cleared selected - clear selections does not want to clear initial selection after page refresh
            selectionModel.clearSelections();
            if (selectionModel.lastActive !== false)
                selectionModel.deselectRow( selectionModel.lastActive );
        });       
        
    bufferedSelectionModel.on('rowselect', function(selectionModel, index, record) {         
            var view = self._grid.getView();
            var store = self._grid.getStore();
            
            var row = store.getAt(index);     
            if (!row)
                row = store.data.items[ index - view.bufferRange[0] ];

            if (row && row.id)
                self.setCurrentEntity(record.data[view.ds.reader.meta.keyfield], index + 1);                 
            
            self._ignoreOnRowSelect = false;                
        });
    
    var colModel = new Ext.grid.ColumnModel([
        {header: 'SLXRN', dataIndex: 'SLXRN', hidden: true},
        {header: this._keyAlias, dataIndex: this._keyAlias, hidden: true},
        {header: this._columnDisplayName, dataIndex: this._columnAlias, 
            renderer: function(value, meta, record, rowIndex, columnIndex, store) {
                return (value ? Ext.util.Format.htmlEncode(value) : "&nbsp;");
            } 
        }
    ]);

    this._grid = new Ext.grid.GridPanel({
        id: this._clientId + '_grid',
        layout: 'fit',
        ds: bufferedDataStore,
        enableDragDrop: false,
        enableColumnHide: false,
        enableColumnMove: false,
        enableColumnResize: false,
        enableHdMenu: false,
        cm: colModel,
        sm: bufferedSelectionModel,
        loadMask: {
            msg: Sage.TaskPane.GroupListTasklet.Resources.LoadingMsg // 'Loading...'
        },
        view: bufferedView,
        title: '',
        stripeRows: true,
        border: false,
        stateful: false 
    });
    
    this._grid.on('rowclick', function(grid, index, e) {    
                            
    });
        
    this._panel = new Ext.Panel({
        id: this._clientId + '_panel',
        cls: 'group-list-panel',
        layout: 'fit',
        border: false,
        items: this._grid,
        renderTo: this._clientId,
        width: "100%"
    });
    
    this._resizer = new Ext.Resizable(this._clientId + '_grid', {
        handles: 's',
        dynamic: true
    });
    
    this._resizer.on('resize', function(resizer, width, height, e) {
            if (!self.isInIE6())
            {                
                this.doLayout();
            }
            else
            {                    
                self._grid.setHeight(height - 5);
		        self._grid.syncSize();
		        self._grid.doLayout();
		        this.doLayout();		        
            }
        }, this._panel);
        
    var layoutPanel = mainViewport.findById("center_panel_east");
    layoutPanel.on('resize', function() {
            if (!self.isInIE6())
            {                
                this.doLayout();
            }
            else
            {                    
                self._grid.setWidth(this.getInnerWidth());
		        self._grid.syncSize();
		        self._grid.doLayout();
		        this.doLayout();		        
            }
        }, this._panel);             
};
