/*** begin header ***/
/*
JsOpt: ext-ux-livegrid ./livegrid/BufferedStore.js ./livegrid/BufferedJsonReader.js ./livegrid/BufferedGridDragZone.js ./livegrid/BufferedGridToolbar.js ./livegrid/BufferedRowSelectionModel.js ./livegrid/BufferedGridView.js
*/
/*** end header ***/

/*** begin file 'BufferedStore.js' ***/
/*
 * Ext.ux.grid.BufferedStore V0.9
 * Copyright(c) 2007, http://www.siteartwork.de
 *
 * Licensed under the terms of the Open Source LGPL 3.0
 * http://www.gnu.org/licenses/lgpl.html
 *
 * @author Thorsten Suckow-Homberg <ts@siteartwork.de>
 */

Ext.namespace('Ext.ux.grid');


/**
 * @class Ext.ux.grid.BufferedStore
 * @extends Ext.data.Store
 *
 * The BufferedGridSore is a special implementation of a Ext.data.Store. It is used
 * for loading chunks of data from the underlying data repository as requested
 * by the Ext.ux.BufferedGridView. It's size is limited to the config parameter
 * bufferSize and is thereby guaranteed to never hold more than this amount
 * of records in the store.
 *
 * Requesting selection ranges:
 * ----------------------------
 * This store implementation has 2 Http-proxies: A data proxy for requesting data
 * from the server for displaying and another proxy to request pending selections:
 * Pending selections are represented by row indexes which have been selected but
 * which records have not yet been available in the store. The loadSelections method
 * will initiate a request to the data repository (same url as specified in the
 * url config parameter for the store) to fetch the pending selections. The additional
 * parameter send to the server is the "ranges" parameter, which will hold a json
 * encoded string representing ranges of row indexes to load from the data repository.
 * As an example, pending selections with the indexes 1,2,3,4,5,9,10,11,16 would
 * have to be translated to [1,5],[9,11],[16].
 * Please note, that by indexes we do not understand (primary) keys of the data,
 * but indexes as represented by the view. To get the ranges of pending selections,
 * you can use the getPendingSelections method of the BufferedRowSelectionModel, which
 * should be used as the default selection model of the grid.
 *
 * Version-property:
 * -----------------
 * This implementation does also introduce a new member called "version". The version
 * property will help you in determining if any pending selections indexes are still
 * valid or may have changed. This is needed to reduce the danger of data inconsitence
 * when you are requesting data from the server: As an example, a range of indexes must
 * be read from the server but may have been become invalid when the row represented
 * by the index is no longer available in teh underlying data store, caused by a
 * delete or insert operation. Thus, you have to take care of the version property
 * by yourself (server side) and change this value whenever a row was deleted or
 * inserted. You can specify the path to the version property in the BufferedJsonReader,
 * which should be used as the default reader for this store. If the store recognizes
 * a version change, it will fire the versionchange event. It is up to the user
 * to remove all selections which are pending, or use them anyway.
 *
 * Inserting data:
 * ---------------
 * Another thing to notice is the way a user inserts records into the data store.
 * A user should always provide a sortInfo for the grid, so the findInsertIndex
 * method can return a value that comes close to the value as it would have been
 * computed by the underlying store's sort algorithm. Whenever a record should be
 * added to the store, the insert index should be calculated and the used as the
 * parameter for the insert method. The findInsertIndex method will return a value
 * that equals to Number.MIN_VALUE or Number.MAX_VALUE if the added record would not
 * change the current state of the store. If that happens, this data is not available
 * in the store, and may be requested later on when a new request for new data is made.
 *
 * Sorting:
 * --------
 * remoteSort will always be set to true, no matter what value the user provides
 * using the config object.
 *
 * @constructor
 * Creates a new Store.
 * @param {Object} config A config object containing the objects needed for the Store to access data,
 * and read the data into Records.
 */
Ext.ux.grid.BufferedStore = function(config) {

    config = config || {};

    // remoteSort will always be set to true.
    config.remoteSort = true;

    Ext.apply(this, config);

    this.addEvents({
         /**
          * @event versionchange
          * Fires when the version property has changed.
          * @param {Ext.ux.BufferedGridStore} this
          * @param {String} oldValue
          * @param {String} newValue
          */
        'versionchange'        : true,
         /**
          * @event beforeselectionsload
          * Fires before the store sends a request for ranges of records to
          * the server.
          * @param {Ext.ux.BufferedGridStore} this
          * @param {Array} ranges
          */
        'beforeselectionsload' : true,
         /**
          * @event selectionsload
          * Fires when selections have been loaded.
          * @param {Ext.ux.BufferedGridStore} this
          * @param {Array} records An array containing the loaded records from
          * the server.
          * @param {Array} ranges An array containing the ranges of indexes this
          * records may represent.
          */
        'selectionsload'       : true

    });

    Ext.ux.grid.BufferedStore.superclass.constructor.call(this, config);

    this.totalLength = 0;

    /**
     * The array represents the range of rows available in the buffer absolute to
     * the indexes of the data model.
     * @param {Array}
     */
    this.bufferRange = [0, 0];

    this.on('clear', function (){
        this.bufferRange = [0, 0];
    }, this);

    if(this.url && !this.selectionsProxy){
        this.selectionsProxy = new Ext.data.HttpProxy({url: this.url});
    }

};

Ext.extend(Ext.ux.grid.BufferedStore, Ext.data.Store, {

    /**
     * The version of the data in the store. This value is represented by the
     * versionProperty-property of the BufferedJsonReader.
     * @property
     */
    version : null,

    /**
     * Inserts a record at the position as specified in index.
     * If the index equals to Number.MIN_VALUE or Number.MAX_VALUE, the record will
     * not be added to the store, but still fire the add-event to indicate that
     * the set of data in the underlying store has been changed.
     * If the index equals to 0 and the length of data in the store equals to
     * bufferSize, the add-event will be triggered with Number.MIN_VALUE to
     * indicate that a record has been prepended. If the index equals to
     * bufferSize, the method will assume that the record has been appended and
     * trigger the add event with index set to Number.MAX_VALUE.
     *
     * Note:
     * -----
     * The index parameter is not a view index, but a value in the range of
     * [0, this.bufferSize].
     *
     * You are strongly advised to not use this method directly. Instead, call
     * findInsertIndex wirst and use the return-value as the first parameter for
     * for this method.
     */
    insert : function(index, records)
    {
        // hooray for haskell!
        records = [].concat(records);

        index = index >= this.bufferSize ? Number.MAX_VALUE : index;

        if (index == Number.MIN_VALUE || index == Number.MAX_VALUE) {
            var l = records.length;
            if (index == Number.MIN_VALUE) {
                this.bufferRange[0] += l;
                this.bufferRange[1] += l;
            }

            this.totalLength += l;
            this.fireEvent("add", this, records, index);
            return;
        }

        var split = false;
        var insertRecords = records;
        if (records.length + index >= this.bufferSize) {
            split = true;
            insertRecords = records.splice(0, this.bufferSize-index)
        }
        this.totalLength += insertRecords.length;

        // if the store was loaded without data and the bufferRange
        // has to be filled first
        if (this.bufferRange[1] < this.bufferSize) {
            this.bufferRange[1] = Math.min(this.bufferRange[1] + insertRecords.length, this.bufferSize);
        }

        for (var i = 0, len = insertRecords.length; i < len; i++) {
            this.data.insert(index, insertRecords[i]);
            insertRecords[i].join(this);
        }

        while (this.getCount() > this.bufferSize) {
            this.data.remove(this.data.last());
        }

        this.fireEvent("add", this, insertRecords, index);

        if (split == true) {
            this.fireEvent("add", this, records, Number.MAX_VALUE);
        }
    },

    /**
     * Remove a Record from the Store and fires the remove event.
     *
     * If the record is not within the store, the method will try to guess it's
     * index by calling findInsertIndex.
     *
     * Please note that this method assumes that the records that's about to
     * be removed from the store does belong to the data within the store or the
     * underlying data store, thus the remove event will always be fired.
     * This may lead to inconsitency if you have to stores up at once. Let A
     * be the store that reads from the data repository C, and B the other store
     * that only represents a subset of data of the data repository C. If you
     * now remove a record X from A, which has not been in the store, but is assumed
     * to be available in the data repository, and would like to sync the available
     * data of B, then you have to check first if X may have apperead in the subset
     * of data C represented by B before calling remove from the B store (because
     * the remove operation will always trigger the "remove" event, no matter what).
     * (Common use case: you have selected a range of records which are then stored in
     * the row selection model. User scrolls through the data and the store's buffer
     * gets refreshed with new data for displaying. Now you want to remove all records
     * which are within the rowselection model, but not anymore within the store.)
     * One possible workaround is to only remove the record X from B if, and only
     * if the return value of a call to [object instance of store B].data.indexOf(X)
     * does not return a value less than 0. Though not removing the record from
     * B may not update the view of an attached BufferedGridView immediately.
     *
     * @param {Ext.data.Record} record
     */
    remove : function(record)
    {
        var index = this.data.indexOf(record);

        if (index < 0) {
            var ind = this.findInsertIndex(record);
            this.totalLength -= 1;
            if(this.pruneModifiedRecords){
                this.modified.remove(record);
            }
            this.fireEvent("remove", this, record, ind);
            return false;
        }
        this.bufferRange[1]--;
        this.data.removeAt(index);

        if(this.pruneModifiedRecords){
            this.modified.remove(record);
        }

        this.totalLength -= 1;
        this.fireEvent("remove", this, record, index);
        return true;
    },

    /**
     * Remove all Records from the Store and fires the clear event.
     * The method assumes that there will be no data available anymore in the
     * underlying data store.
     */
    removeAll : function()
    {
        this.totalLength = 0;
        this.data.clear();

        if(this.pruneModifiedRecords){
            this.modified = [];
        }
        this.fireEvent("clear", this);
    },

    /**
     * Requests a range of data from the underlying data store. Similiar to the
     * start and limit parameter usually send to the server, the method needs
     * an array of ranges of indexes.
     * Example: To load all records at the positions 1,2,3,4,9,12,13,14, the supplied
     * parameter should equal to [[1,4],[9],[12,14]].
     * The request will only be done if the beforeselectionsloaded events return
     * value does not equal to false.
     */
    loadRanges : function(ranges)
    {
        var max_i = ranges.length;

        if(max_i > 0 && !this.selectionsProxy.activeRequest
           && this.fireEvent("beforeselectionsload", this, ranges) !== false){

            var lParams = this.lastOptions.params;

            var params = {};
            params.ranges = Ext.encode(ranges);

            if (lParams) {
                if (lParams.sort) {
                    params.sort = lParams.sort;
                }
                if (lParams.dir) {
                    params.dir = lParams.dir;
                }
            }

            var options = {};
            for (var i in this.lastOptions) {
                options.i = this.lastOptions.i;
            }

            options.ranges = params.ranges;

            this.selectionsProxy.load(params, this.reader,
                            this.selectionsLoaded, this,
                            options);
        }
    },

    /**
     * Alias for loadRanges.
     */
    loadSelections : function(ranges)
    {
        this.loadRanges(ranges);
    },

    /**
     * Called as a callback by the proxy which loads pending selections.
     * Will fire the selectionsload event with the loaded records if, and only
     * if the return value of the checkVersionChange event does not equal to
     * false.
     */
    selectionsLoaded : function(o, options, success)
    {
        if (this.checkVersionChange(o, options, success) !== false) {
            this.fireEvent("selectionsload", this, o.records, Ext.decode(options.ranges));
        } else {
            this.fireEvent("selectionsload", this, [], Ext.decode(options.ranges));
        }
    },

    /**
     * Checks if the version supplied in <tt>o</tt> differs from the version
     * property of the current instance of this object and fires the versionchange
     * event if it does.
     */
    // private
    checkVersionChange : function(o, options, success)
    {
        if(o && success !== false){
            if (o.version !== undefined) {
                var old      = this.version;
                this.version = o.version;
                if (this.version !== old) {
                    return this.fireEvent('versionchange', this, old, this.version);
                }
            }
        }
    },

    /**
     * The sort procedure tries to respect the current data in the buffer. If the
     * found index would not be within the bufferRange, Number.MIN_VALUE is returned to
     * indicate that the record would be sorted below the first record in the buffer
     * range, while Number.MAX_VALUE would indicate that the record would be added after
     * the last record in the buffer range.
     *
     * The method is not guaranteed to return the relative index of the record
     * in the data model as returned by the underlying domain model.
     */
    findInsertIndex : function(record)
    {
        this.remoteSort = false;
        var index = Ext.ux.grid.BufferedStore.superclass.findInsertIndex.call(this, record);
        this.remoteSort = true;

        if (this.bufferRange[0] > 0 && index == 0) {
            index = Number.MIN_VALUE;
        } else if (index >= this.bufferSize) {
            index = Number.MAX_VALUE;
        }

        return index;
    },

    /**
     * Removed snapshot check
     */
    // private
    sortData : function(f, direction)
    {
        direction = direction || 'ASC';
        var st = this.fields.get(f).sortType;
        var fn = function(r1, r2){
            var v1 = st(r1.data[f]), v2 = st(r2.data[f]);
            return v1 > v2 ? 1 : (v1 < v2 ? -1 : 0);
        };
        this.data.sort(direction, fn);
    },



    /**
     * @cfg {Number} bufferSize The number of records that will at least always
     * be available in the store for rendering. This value will be send to the
     * server as the <tt>limit</tt> parameter and should not change during the
     * lifetime of a grid component. Note: In a paging grid, this number would
     * indicate the page size.
     * The value should be set high enough to make a userfirendly scrolling
     * possible and should be greater than the sum of {nearLimit} and
     * {visibleRows}. Usually, a value in between 150 and 200 is good enough.
     * A lesser value will more often make the store re-request new data, while
     * a larger number will make loading times higher.
     */


    // private
    onMetaChange : function(meta, rtype, o)
    {
        this.version = null;
        Ext.ux.grid.BufferedStore.superclass.onMetaChange.call(this, meta, rtype, o);
    },


    /**
     * Will fire the versionchange event if the version of incoming data has changed.
     */
    // private
    loadRecords : function(o, options, success)
    {
        this.checkVersionChange(o, options, success);

        // we have to stay in sync with rows that may have been skipped while
        // the request was loading.
        this.bufferRange = [
            options.params.start,
            Math.min(options.params.start+options.params.limit, o.totalRecords)
        ];

        Ext.ux.grid.BufferedStore.superclass.loadRecords.call(this, o, options, success);
    },

    /**
     * Get the Record at the specified index.
     * The function will take the bufferRange into account and translate the passed argument
     * to the index of the record in the current buffer.
     *
     * @param {Number} index The index of the Record to find.
     * @return {Ext.data.Record} The Record at the passed index. Returns undefined if not found.
     */
    getAt : function(index)
    {
        var modelIndex = index - this.bufferRange[0];
        return this.data.itemAt(modelIndex);
    },

//--------------------------------------EMPTY-----------------------------------
    // no interface concept, so simply overwrite and leave them empty as for now
    clearFilter : function(){},
    isFiltered : function(){},
    collect : function(){},
    createFilterFn : function(){},
    sum : function(){},
    filter : function(){},
    filterBy : function(){},
    query : function(){},
    queryBy : function(){},
    find : function(){},
    findBy : function(){}

});
/*** end file 'BufferedStore.js' ***/

/*** begin file 'BufferedJsonReader.js' ***/
/*
 * Ext.ux.data.BufferedJsonReader V0.1
 * Copyright(c) 2007, http://www.siteartwork.de
 * 
 * Licensed under the terms of the Open Source LGPL 3.0
 * http://www.gnu.org/licenses/lgpl.html
 *
 * @author Thorsten Suckow-Homberg <ts@siteartwork.de>
 */

Ext.namespace('Ext.ux.data');


Ext.ux.data.BufferedJsonReader = function(meta, recordType){
    
    Ext.ux.data.BufferedJsonReader.superclass.constructor.call(this, meta, recordType);
};


Ext.extend(Ext.ux.data.BufferedJsonReader, Ext.data.JsonReader, {
    
    /**
     * @cfg {String} versionProperty Name of the property from which to retrieve the 
     *                               version of the data repository this reader parses 
     *                               the reponse from
     */   

    

    /**
     * Create a data block containing Ext.data.Records from a JSON object.
     * @param {Object} o An object which contains an Array of row objects in the property specified
     * in the config as 'root, and optionally a property, specified in the config as 'totalProperty'
     * which contains the total size of the dataset.
     * @return {Object} data A data block which is used by an Ext.data.Store object as
     * a cache of Ext.data.Records.
     */
    readRecords : function(o)
    {
        var s = this.meta;
        
        /* this is not correct - meta will get loaded after this point if including meta data in the JSON response */
        /* 
        if(!this.ef && s.versionProperty) {
            this.getVersion = this.getJsonAccessor(s.versionProperty);
        }
        */
        
        // shorten for future calls
        if (!this.__readRecords) {
            this.__readRecords = Ext.ux.data.BufferedJsonReader.superclass.readRecords;
        }
        
        var intercept = this.__readRecords.call(this, o);
        
        
        if (s.versionProperty) {
            
            if (!this.getVersion)
                this.getVersion = this.getJsonAccessor(this.versionProperty);
                
            var v = this.getVersion(o);
            intercept.version = (v === undefined || v === "") ? null : v;
        }

        
        return intercept;
    }
    
});
/*** end file 'BufferedJsonReader.js' ***/

/*** begin file 'BufferedGridDragZone.js' ***/
/*
 * Ext.ux.grid.BufferedGridDragZone V0.1
 * Copyright(c) 2007, http://www.siteartwork.de
 * 
 * Licensed under the terms of the Open Source LGPL 3.0
 * http://www.gnu.org/licenses/lgpl.html
 *
 * @author Thorsten Suckow-Homberg <ts@siteartwork.de>
 */

// private
// This is a support class used internally by the Grid components

Ext.namespace('Ext.ux.grid');

Ext.ux.grid.BufferedGridDragZone = function(grid, config){
    
    
    
    this.view = grid.getView();
    Ext.ux.grid.BufferedGridDragZone.superclass.constructor.call(this, this.view.mainBody.dom, config);
    
  //  this.addEvents({
    //    'startdrag' : true
    //});
    
    if(this.view.lockedBody){
        this.setHandleElId(Ext.id(this.view.mainBody.dom));
        this.setOuterHandleElId(Ext.id(this.view.lockedBody.dom));
    }
    this.scroll = false;
    this.grid = grid;
    this.ddel = document.createElement('div');
    this.ddel.className = 'x-grid-dd-wrap';
    
    this.view.ds.on('beforeselectionsload', this.onBeforeSelectionsLoad, this);
    this.view.ds.on('selectionsload',       this.onSelectionsLoad,       this);
};

Ext.extend(Ext.ux.grid.BufferedGridDragZone, Ext.dd.DragZone, {
    ddGroup : "GridDD",

    isDropValid : true,
    
    getDragData : function(e)
    {
        var t = Ext.lib.Event.getTarget(e);
        var rowIndex = this.view.findRowIndex(t);
        if(rowIndex !== false){
            var sm = this.grid.selModel;
            if(!sm.isSelected(rowIndex) || e.hasModifier()){
                sm.handleMouseDown(this.grid, rowIndex, e);
            }
            return {grid: this.grid, ddel: this.ddel, rowIndex: rowIndex, selections:sm.getSelections()};
        }
        return false;
    },

    onInitDrag : function(e)
    {
        this.view.ds.loadSelections(this.grid.selModel.getPendingSelections(true));
        
        var data = this.dragData;
        this.ddel.innerHTML = this.grid.getDragDropText();
        this.proxy.update(this.ddel);
        // fire start drag?
    },

    onBeforeSelectionsLoad : function()
    {
        this.isDropValid = false;
        Ext.fly(this.proxy.el.dom.firstChild).addClass('x-dd-drop-waiting');    
    },
    
    onSelectionsLoad : function()
    {
        this.isDropValid = true;
        this.ddel.innerHTML = this.grid.getDragDropText();
        Ext.fly(this.proxy.el.dom.firstChild).removeClass('x-dd-drop-waiting');    
    },
    
    afterRepair : function()
    {
        this.dragging = false;
    },

    getRepairXY : function(e, data)
    {
        return false;
    },

    onStartDrag : function()
    {
        
    },
    
    onEndDrag : function(data, e)
    {
        // fire end drag?
    },

    onValidDrop : function(dd, e, id)
    {
        // fire drag drop?
        this.hideProxy();
    },

    beforeInvalidDrop : function(e, id)
    {

    }
});
/*** end file 'BufferedGridDragZone.js' ***/

/*** begin file 'BufferedGridToolbar.js' ***/
/*
 * Ext.ux.BufferedGridToolbar V1.0
 * Copyright(c) 2007, http://www.siteartwork.de
 *
 * Licensed under the terms of the Open Source LGPL 3.0
 * http://www.gnu.org/licenses/lgpl.html
 *
 *
 * @author Thorsten Suckow-Homberg <ts@siteartwork.de>
 */

/**
 * @class Ext.ux.BufferedGridToolbar
 * @extends Ext.Toolbar
 * A specialized toolbar that is bound to a {@link Ext.ux.grid.BufferedGridView}
 * and provides information about the indexes of the requested data and the buffer
 * state.
 * @constructor
 * @param {Object} config
 */
Ext.namespace('Ext.ux');

Ext.ux.BufferedGridToolbar = Ext.extend(Ext.Toolbar, {
    /**
     * @cfg {Boolean} displayInfo
     * True to display the displayMsg (defaults to false)
     */

    /**
     * @cfg {String} displayMsg
     * The paging status message to display (defaults to "Displaying {start} - {end} of {total}")
     */
    displayMsg : 'Displaying {0} - {1} of {2}',

    /**
     * @cfg {String} emptyMsg
     * The message to display when no records are found (defaults to "No data to display")
     */
    emptyMsg : 'No data to display',

    /**
     * Value to display as the tooltip text for the refresh button. Defaults to
     * "Refresh"
     * @param {String}
     */
    refreshText : "Refresh",

    initComponent : function()
    {
        Ext.ux.BufferedGridToolbar.superclass.initComponent.call(this);
        this.bind(this.view);
    },

    // private
    updateInfo : function(rowIndex, visibleRows, totalCount)
    {
        if(this.displayEl){
            var msg = totalCount == 0 ?
                this.emptyMsg :
                String.format(this.displayMsg, rowIndex+1,
                              rowIndex+visibleRows, totalCount);
            this.displayEl.update(msg);
        }
    },

    /**
     * Unbinds the toolbar from the specified {@link Ext.ux.grid.BufferedGridView}
     * @param {@link Ext.ux.grid.BufferedGridView} view The view to unbind
     */
    unbind : function(view)
    {
        view.un('rowremoved',    this.onRowRemoved,    this);
        view.un('rowsinserted',  this.onRowsInserted,  this);
        view.un('beforebuffer',  this.beforeBuffer,    this);
        view.un('cursormove',    this.onCursorMove,    this);
        view.un('buffer',        this.onBuffer,        this);
        view.un('bufferfailure', this.onBufferFailure, this);
        this.view = undefined;
    },

    /**
     * Binds the toolbar to the specified {@link Ext.ux.grid.BufferedGridView}
     * @param {Ext.grid.GridPanel} view The view to bind
     */
    bind : function(view)
    {
        view.on('rowremoved',    this.onRowRemoved,    this);
        view.on('rowsinserted',  this.onRowsInserted,  this);
        view.on('beforebuffer',  this.beforeBuffer,    this);
        view.on('cursormove',    this.onCursorMove,    this);
        view.on('buffer',        this.onBuffer,        this);
        view.on('bufferfailure', this.onBufferFailure, this);
        this.view = view;
    },

// ----------------------------------- Listeners -------------------------------
    onCursorMove : function(view, rowIndex, visibleRows, totalCount)
    {
        this.updateInfo(rowIndex, visibleRows, totalCount);
    },

    // private
    onRowsInserted : function(view, start, end)
    {
        this.updateInfo(view.rowIndex, Math.min(view.ds.totalLength, view.visibleRows),
                        view.ds.totalLength);
    },

    // private
    onRowRemoved : function(view, index, record)
    {
        this.updateInfo(view.rowIndex, Math.min(view.ds.totalLength, view.visibleRows),
                        view.ds.totalLength);
    },

    // private
    beforeBuffer : function(view, store, rowIndex, visibleRows, totalCount)
    {
        this.loading.disable();
        this.updateInfo(rowIndex, visibleRows, totalCount);
    },

    // priate
    onBufferFailure : function(view, store, options)
    {
        this.loading.enable();
    },

    // private
    onBuffer : function(view, store, rowIndex, visibleRows, totalCount)
    {
        this.loading.enable();
        this.updateInfo(rowIndex, visibleRows, totalCount);
    },

    // private
    onClick : function(type)
    {
        switch (type) {
            case 'refresh':
                this.view.reset(true);
            break;

        }
    },

    // private
    onRender : function(ct, position)
    {
        Ext.PagingToolbar.superclass.onRender.call(this, ct, position);

        this.loading = this.addButton({
            tooltip : this.refreshText,
            iconCls : "x-tbar-loading",
            handler : this.onClick.createDelegate(this, ["refresh"])
        });

        this.addSeparator();

        if(this.displayInfo){
            this.displayEl = Ext.fly(this.el.dom).createChild({cls:'x-paging-info'});
        }
    }
});
/*** end file 'BufferedGridToolbar.js' ***/

/*** begin file 'BufferedRowSelectionModel.js' ***/
/*
 * Ext.ux.grid.BufferedRowSelectionModel V0.1
 * Copyright(c) 2007, http://www.siteartwork.de
 *
 * Licensed under the terms of the Open Source LGPL 3.0
 * http://www.gnu.org/licenses/lgpl.html
 *
 * @author Thorsten Suckow-Homberg <ts@siteartwork.de>
 */

Ext.namespace('Ext.ux.grid');

Ext.ux.grid.BufferedRowSelectionModel = function(config) {


    this.addEvents({
        /**
         * The selection dirty event will be triggered in case records were
         * inserted/ removed at view indexes that may affect the current
         * selection ranges which are only represented by view indexes, but not
         * current record-ids
         */
        'selectiondirty' : true
    });




    Ext.apply(this, config);

    this.bufferedSelections = {};

    this.pendingSelections = {};

    Ext.ux.grid.BufferedRowSelectionModel.superclass.constructor.call(this);

};

Ext.extend(Ext.ux.grid.BufferedRowSelectionModel, Ext.grid.RowSelectionModel, {


 // private
    initEvents : function()
    {
        Ext.ux.grid.BufferedRowSelectionModel.superclass.initEvents.call(this);

        this.grid.view.on('rowsinserted',    this.onAdd,            this);
        this.grid.store.on('selectionsload', this.onSelectionsLoad, this);
    },



    // private
    onRefresh : function()
    {
        //var ds = this.grid.store, index;
        //var s = this.getSelections();
        this.clearSelections(true);
        /*for(var i = 0, len = s.length; i < len; i++){
            var r = s[i];
            if((index = ds.indexOfId(r.id)) != -1){
                this.selectRow(index, true);
            }
        }
        if(s.length != this.selections.getCount()){
            this.fireEvent("selectionchange", this);
        }*/
    },



    /**
     * Callback is called when a row gets removed in the view. The process to
     * invoke this method is as follows:
     *
     * <ul>
     *  <li>1. store.remove(record);</li>
     *  <li>2. view.onRemove(store, record, indexInStore, isUpdate)<br />
     *   [view triggers rowremoved event]</li>
     *  <li>3. this.onRemove(view, indexInStore, record)</li>
     * </ul>
     *
     * If r defaults to <tt>null</tt> and index is within the pending selections
     * range, the selectionchange event will be called, too.
     * Additionally, the method will shift all selections and trigger the
     * selectiondirty event if any selections are pending.
     *
     */
    onRemove : function(v, index, r)
    {
        // if index equals to Number.MIN_VALUE or Number.MAX_VALUE, mark current
        // pending selections as dirty
        if ((index == Number.MIN_VALUE || index == Number.MAX_VALUE)) {
            this.selections.remove(r);
            this.fireEvent('selectiondirty', this, index, r);
            return;
        }

        var viewIndex    = index;
        var fire         = this.bufferedSelections[viewIndex] === true;
        var ranges       = this.getPendingSelections();
        var rangesLength = ranges.length;


        delete this.bufferedSelections[viewIndex];
        delete this.pendingSelections[viewIndex];

        if (r) {
            this.selections.remove(r);
        }

        if (rangesLength == 0) {
            this.shiftSelections(viewIndex, -1);
        } else {
            var s = ranges[0];
            var e = ranges[rangesLength-1];
            if (viewIndex <= e || viewIndex <= s) {
                if (this.fireEvent('selectiondirty', this, viewIndex, -1) !== false) {
                    this.shiftSelections(viewIndex, -1);
                }
            }
        }

        if (fire) {
            this.fireEvent('selectionchange', this);
        }
    },


    /**
     * If records where added to the store, this method will work as a callback,
     * called by the views' rowsinserted event.
     * Selections will be shifted down if, and only if, the listeners for the
     * selectiondirty event will return <tt>true</tt>.
     *
     */
    onAdd : function(store, index, endIndex, recordLength)
    {
        var ranges       = this.getPendingSelections();
        var rangesLength = ranges.length;

        // if index equals to Number.MIN_VALUE or Number.MAX_VALUE, mark current
        // pending selections as dirty
        if ((index == Number.MIN_VALUE || index == Number.MAX_VALUE)) {

            // we may shift selections if there are no pendning selections. Everything
            // in the current buffer range will be shifted up!
            if (rangesLength == 0 && index == Number.MIN_VALUE) {
                this.shiftSelections(this.grid.getStore().bufferRange[0], recordLength);
            }

            this.fireEvent('selectiondirty', this, index, recordLength);
            return;
        }

        if (rangesLength == 0) {
            this.shiftSelections(index, recordLength);
            return;
        }

        // it is safe to say that the selection is dirty when the inserted index
        // is less or equal to the first selection range index or less or equal
        // to the last selection range index
        var s         = ranges[0];
        var e         = ranges[rangesLength-1];
        var viewIndex = index;
        if (viewIndex <= e || viewIndex <= s) {
            if (this.fireEvent('selectiondirty', this, viewIndex, recordLength) !== false) {
                this.shiftSelections(viewIndex, recordLength);
            }
        }
    },



    /**
     * Shifts current/pending selections. This method can be used when rows where
     * inserted/removed and the selection model has to synchronize itself.
     */
    shiftSelections : function(startRow, length)
    {
        var index         = 0;
        var newSelections = {};
        var newIndex      = 0;
        var newRequests   = {};
        var totalLength = this.grid.store.totalLength;

        this.last = false;

        for (var i in this.bufferedSelections) {
            index    = parseInt(i);
            newIndex = index+length;
            if (newIndex >= totalLength) {
                break;
            }

            if (index >= startRow) {
                newSelections[newIndex] = true;

                if (this.pendingSelections[i]) {
                    newRequests[newIndex] = true;
                }

            } else {
                newSelections[i] = true;

                if (this.pendingSelections[i]) {
                    newRequests[i] = true;
                }
            }
        }

        this.bufferedSelections  = newSelections;
        this.pendingSelections   = newRequests;
    },

    /**
     *
     * @param {Array} records The records that have been loaded
     * @param {Array} ranges  An array representing the model index ranges the
     *                        reords have been loaded for.
     */
    onSelectionsLoad : function(store, records, ranges)
    {
        this.pendingSelections = {};

        this.selections.addAll(records);

    },

    /**
     * Returns true if there is a next record to select
     * @return {Boolean}
     */
    hasNext : function()
    {
        return this.last !== false && (this.last+1) < this.grid.store.getTotalCount();
    },

    /**
     * Gets the number of selected rows.
     * @return {Number}
     */
    getCount : function()
    {
        var sels = this.bufferedSelections;

        var c = 0;
        for (var i in sels) {
            c++;
        }

        return c;
    },

    /**
     * Returns True if the specified row is selected.
     * @param {Number/Record} record The record or index of the record to check
     * @return {Boolean}
     */
    isSelected : function(index)
    {
        if (typeof index == "number") {
            return this.bufferedSelections[index] === true;
        }

        var r = index;
        return (r && this.selections.key(r.id) ? true : false);
    },


    /**
     * Deselects a row.
     * @param {Number} row The index of the row to deselect
     */
    deselectRow : function(index, preventViewNotify)
    {
    	if(this.locked) return;
        if(this.last == index){
            this.last = false;
        }

        if(this.lastActive == index){
            this.lastActive = false;
        }
        var r = this.grid.store.getAt(index);

        delete this.pendingSelections[index];
        delete this.bufferedSelections[index];
        if (r) {
            this.selections.remove(r);
        }
        if(!preventViewNotify){
            this.grid.getView().onRowDeselect(index);
        }
        this.fireEvent("rowdeselect", this, index, r);
        this.fireEvent("selectionchange", this);
    },


    /**
     * Selects a row.
     * @param {Number} row The index of the row to select
     * @param {Boolean} keepExisting (optional) True to keep existing selections
     */
    selectRow : function(index, keepExisting, preventViewNotify)
    {
        if(this.last === index
           || this.locked
           || index < 0
           || index >= this.grid.store.getTotalCount()) {
            return;
        }



        var r = this.grid.store.getAt(index);

        if(this.fireEvent("beforerowselect", this, index, keepExisting, r) !== false){
            if(!keepExisting || this.singleSelect){
                this.clearSelections();
            }

            if (r) {
                this.selections.add(r);
                delete this.pendingSelections[index];
            } else {
                this.pendingSelections[index] = true;
            }

            this.bufferedSelections[index] = true;

            this.last = this.lastActive = index;

            if(!preventViewNotify){
                this.grid.getView().onRowSelect(index);
            }
            this.fireEvent("rowselect", this, index, r);
            this.fireEvent("selectionchange", this);
        }
    },

    clearPendingSelection : function(index)
    {
        var r = this.grid.store.getAt(index);
        if (!r) {
            return;
        }
        this.selections.add(r);
        delete this.pendingSelections[index];
    },

    getPendingSelections : function(asRange)
    {
        var index         = 1;
        var ranges        = [];
        var currentRange  = 0;
        var tmpArray      = [];

        for (var i in this.pendingSelections) {
            tmpArray.push(parseInt(i));
        }

        tmpArray.sort(function(o1,o2){
            if (o1 > o2) {
                return 1;
            } else if (o1 < o2) {
                return -1;
            } else {
                return 0;
            }
        });

        if (asRange === false) {
            return tmpArray;
        }

        var max_i = tmpArray.length;

        if (max_i == 0) {
            return [];
        }

        ranges[currentRange] = [tmpArray[0], tmpArray[0]];
        for (var i = 0, max_i = max_i-1; i < max_i; i++) {
            if (tmpArray[i+1] - tmpArray[i] == 1) {
                ranges[currentRange][1] = tmpArray[i+1];
            } else {
                currentRange++;
                ranges[currentRange] = [tmpArray[i+1], tmpArray[i+1]];
            }
        }

        return ranges;
    },

    /**
     * Clears all selections.
     */
    clearSelections : function(fast)
    {
        if(this.locked) return;
        if(fast !== true){
            //var ds = this.grid.store;
            var s = this.selections;
            /*s.each(function(r){
                this.deselectRow(ds.indexOfId(r.id)+this.grid.getView().bufferRange[0]);
            }, this);*/
            s.clear();

            for (var i in this.bufferedSelections) {
                this.deselectRow(i);
            }

        }else{
            this.selections.clear();
            this.bufferedSelections  = {};
            this.pendingSelections = {};
        }
        this.last = false;
    },


    /**
     * Selects a range of rows. All rows in between startRow and endRow are also
     * selected.
     *
     * @param {Number} startRow The index of the first row in the range
     * @param {Number} endRow The index of the last row in the range
     * @param {Boolean} keepExisting (optional) True to retain existing selections
     */
    selectRange : function(startRow, endRow, keepExisting)
    {
        if(this.locked) {
            return;
        }

        if(!keepExisting) {
            this.clearSelections();
        }

        if (startRow <= endRow) {
            for(var i = startRow; i <= endRow; i++) {
                this.selectRow(i, true);
            }
        } else {
            for(var i = startRow; i >= endRow; i--) {
                this.selectRow(i, true);
            }
        }
    }

});



/*** end file 'BufferedRowSelectionModel.js' ***/

/*** begin file 'BufferedGridView.js' ***/
/*
 * Ext.ux.grid.BufferedGridView V0.1
 * Copyright(c) 2007, http://www.siteartwork.de
 *
 * Licensed under the terms of the Open Source LGPL 3.0
 * http://www.gnu.org/licenses/lgpl.html
 *
 * @author Thorsten Suckow-Homberg <ts@siteartwork.de>
 */

/**
 * @class Ext.ux.grid.BufferedGridView
 * @extends Ext.grid.GridView
 *
 *
 * @constructor
 * @param {Object} config
 */
Ext.namespace('Ext.ux.grid');
Ext.ux.grid.BufferedGridView = function(config) {

    this.addEvents({
        /**
         * @event beforebuffer
         * Fires when the store is about to buffer new data.
         * @param {Ext.ux.BufferedGridView} this
         * @param {Ext.data.Store} store The store
         * @param {Number} rowIndex
         * @param {Number} visibleRows
         * @param {Number} totalCount
         */
        'beforebuffer' : true,
        /**
         * @event buffer
         * Fires when the store is finsihed buffering new data.
         * @param {Ext.ux.BufferedGridView} this
         * @param {Ext.data.Store} store The store
         * @param {Number} rowIndex
         * @param {Number} visibleRows
         * @param {Number} totalCount
         * @param {Object} options
         */
        'buffer' : true,
        /**
         * @event bufferfailure
         * Fires when buffering failed.
         * @param {Ext.ux.BufferedGridView} this
         * @param {Ext.data.Store} store The store
         * @param {Object} options The options the buffer-request was initiated with
         */
        'bufferfailure' : true,
        /**
         * @event cursormove
         * Fires when the the user scrolls through the data.
         * @param {Ext.ux.BufferedGridView} this
         * @param {Number} rowIndex The index of the first visible row in the
         *                          grid absolute to it's position in the model.
         * @param {Number} visibleRows The number of rows visible in the grid.
         * @param {Number} totalCount
         */
        'cursormove' : true

    });

    /**
     * @cfg {Number} scrollDelay The number of microseconds a call to the
     * onLiveScroll-lisener should be delayed when the scroll event fires
     */

    /**
     * @cfg {Number} bufferSize The number of records that will at least always
     * be available in the store for rendering. This value will be send to the
     * server as the <tt>limit</tt> parameter and should not change during the
     * lifetime of a grid component. Note: In a paging grid, this number would
     * indicate the page size.
     * The value should be set high enough to make a userfirendly scrolling
     * possible and should be greater than the sum of {nearLimit} and
     * {visibleRows}. Usually, a value in between 150 and 200 is good enough.
     * A lesser value will more often make the store re-request new data, while
     * a larger number will make loading times higher.
     */

    /**
     * @cfg {Number} nearLimit This value represents a near value that is responsible
     * for deciding if a request for new data is needed. The lesser the number, the
     * more often new data will be requested. The number should be set to a value
     * that lies in between 1/4 to 1/2 of the {bufferSize}.
     */

    /**
     * @cfg {Number} horizontalScrollOffset The height of a horizontal aligned
     * scrollbar.  The scrollbar is shown if the total width of all visible
     * columns exceeds the width of the grid component.
     * On Windows XP (IE7, FF2), this value defaults to 16.
     */
    this.horizontalScrollOffset = 16;

    /**
     * @cfg {Object} loadMaskConfig The config of the load mask that will be shown
     * by the view if a request for new data is underway.
     */
    this.loadMask = false;

    Ext.apply(this, config);

    this.templates = {};
    /**
     * The master template adds an addiiotnal scrollbar to make cursoring in the
     * data possible.
     */
    this.templates.master = new Ext.Template(
        '<div class="x-grid3" hidefocus="true"><div style="z-index:2000;background:none;position:relative;height:321px; float:right; width: 18px;overflow: scroll;"><div style="background:none;width:1px;overflow:hidden;font-size:1px;height:0px;"></div></div>',
            '<div class="x-grid3-viewport" style="float:left">',
                '<div class="x-grid3-header"><div class="x-grid3-header-inner"><div class="x-grid3-header-offset">{header}</div></div><div class="x-clear"></div></div>',
                '<div class="x-grid3-scroller" style="overflow-y:hidden !important;"><div class="x-grid3-body" style="position:relative;">{body}</div><a href="#" class="x-grid3-focus" tabIndex="-1"></a></div>',
            "</div>",
            '<div class="x-grid3-resize-marker">&#160;</div>',
            '<div class="x-grid3-resize-proxy">&#160;</div>',
        "</div>"
    );

    Ext.ux.grid.BufferedGridView.superclass.constructor.call(this);
};


Ext.extend(Ext.ux.grid.BufferedGridView, Ext.grid.GridView, {

// {{{ --------------------------properties-------------------------------------
    /**
     * Stores the height of the header. Needed for recalculating scroller inset height.
     * @param {Number}
     */
    hdHeight : 0,

    /**
     * Indicates wether the last row in the grid is clipped and thus not fully display.
     * 1 if clipped, otherwise 0.
     * @param {Number}
     */
    rowClipped : 0,


    /**
     * This is the actual y-scroller that does control sending request to the server
     * based upon the position of the scrolling cursor.
     * @param {Ext.Element}
     */
    liveScroller : null,

    /**
     * This is the panel that represents the amount of data in a given repository.
     * The height gets computed via the total amount of records multiplied with
     * the fixed(!) row height
     * @param {native HTMLObject}
     */
    liveScrollerInset : null,

    /**
     * The <b>fixed</b> row height for <b>every</b> row in the grid. The value is
     * computed once the store has been loaded for the first time and used for
     * various calculations during the lifetime of the grid component, such as
     * the height of the scroller and the number of visible rows.
     * @param {Number}
     */
    rowHeight : -1,

    /**
     * Stores the number of visible rows that have to be rendered.
     * @param {Number}
     */
    visibleRows : 1,

    /**
     * Stores the last offset relative to a previously scroll action. This is
     * needed for deciding wether the user scrolls up or down.
     * @param {Number}
     */
    lastIndex : -1,

    /**
     * Stores the last visible row at position "0" in the table view before
     * a new scroll event was created and fired.
     * @param {Number}
     */
    lastRowIndex : 0,

    /**
     * Stores the value of the <tt>liveScroller</tt>'s <tt>scrollTop</tt> DOM
     * property.
     * @param {Number}
     */
    lastScrollPos : 0,

    /**
     * The current index of the row in the model that is displayed as the first
     * visible row in the view.
     * @param {Number}
     */
    rowIndex : 0,

    /**
    * Set to <tt>true</tt> if the store is busy with loading new data.
    * @param {Boolean}
    */
    isBuffering : false,

	/**
	 * If a request for new data was made and the user scrolls to a new position
	 * that lays not within the requested range of the new data, the queue will
	 * hold the latest requested position. If the buffering succeeds and the value
	 * of requestQueue is not within the range of the current buffer, data may be
	 * re-requested.
	 *
	 * @param {Number}
	 */
    requestQueue : -1,

    /**
     * The view's own load mask that will be shown when a request to data was made
     * and there are no rows in the buffer left to render.
     * @see {loadMaskConfig}
     * @param {Ext.LoadMask}
     */
    loadMask : null,

    /**
     * Set to <tt>true</tt> if a request for new data has been made while there
     * are still rows in the buffer that can be rendered before the request
     * finishes.
     * @param {Boolean}
     */
    isPrebuffering : false,
// }}}

// {{{ --------------------------public API methods-----------------------------

    /**
     * Resets the view to display the first row in the data model. This will
     * change the scrollTop property of the scroller and may trigger a request
     * to buffer new data, if the row index "0" is not within the buffer range and
     * forceReload is set to true.
     *
     * @param {Boolean} forceReload <tt>true</tt> to reload the buffers contents,
     *                              othwerwise <tt>false</tt>
     */
    reset : function(forceReload)
    {
        if (forceReload === false) {
            this.ds.modified = [];
            this.grid.selModel.clearSelections(true);
            this.rowIndex      = 0;
            this.lastScrollPos = 0;
            this.lastRowIndex = 0;
            this.lastIndex    = 0;
            this.adjustVisibleRows();
            this.adjustScrollerPos(-this.liveScroller.dom.scrollTop, true);
            this.showLoadMask(false);
            this.refresh(true);
            //this.replaceLiveRows(0, true);
            this.fireEvent('cursormove', this, 0,
                           Math.min(this.ds.totalLength, this.visibleRows-this.rowClipped),
                           this.ds.totalLength);
        } else {

            var params = {
                    start : 0,
                    limit : this.ds.bufferSize
            };

            var sInfo = this.ds.sortInfo;

            if (sInfo) {
                params.dir  = sInfo.direction;
                params.sort = sInfo.field;
            }

            this.ds.load({
                callback : function(){this.reset(false);},
                scope    : this,
                params   : params
            });
        }

    },

// {{{ ------------adjusted methods for applying custom behavior----------------
    /**
     * Overwritten so the {@link Ext.ux.grid.BufferedGridDragZone} can be used
     * with this view implementation.
     *
     * Since detaching a previously created DragZone from a grid panel seems to
     * be impossible, a little workaround will tell the parent implementation
     * that drad/drop is not enabled for this view's grid, and right after that
     * the custom DragZone will be created, if neccessary.
     */
    renderUI : function()
    {
        var g = this.grid;
        var dEnabled = g.enableDragDrop || g.enableDrag;

        g.enableDragDrop = false;
        g.enableDrag     = false;

        Ext.ux.grid.BufferedGridView.superclass.renderUI.call(this);

        var g = this.grid;

        g.enableDragDrop = dEnabled;
        g.enableDrag     = dEnabled;

        if(dEnabled){
            var dd = new Ext.ux.grid.BufferedGridDragZone(g, {
                ddGroup : g.ddGroup || 'GridDD'
            });
        }


	    if (this.loadMask) {
            this.loadMask = new Ext.LoadMask(
                                this.mainBody.dom.parentNode.parentNode,
                                this.loadMask
                            );
        }
    },

    /**
     * The extended implementation attaches an listener to the beforeload
     * event of the store of the grid. It is guaranteed that the listener will
     * only be executed upon reloading of the store, sorting and initial loading
     * of data. When the store does "buffer", all events are suspended and the
     * beforeload event will not be triggered.
     *
     * @param {Ext.grid.GridPanel} grid The grid panel this view is attached to
     */
    init: function(grid)
    {
        Ext.ux.grid.BufferedGridView.superclass.init.call(this, grid);

        grid.on('expand', this._onExpand, this);

        this.ds.on('beforeload', this.onBeforeLoad, this);
	},


    /**
     * Only render the viewable rect of the table. The number of rows visible to
     * the user is defined in <tt>visibleRows</tt>.
     * This implementation does completely overwrite the parent's implementation.
     */
    // private
    renderBody : function()
    {
        var markup = this.renderRows(0, this.visibleRows-1);
        return this.templates.body.apply({rows: markup});
    },

    /**
     * Inits the DOM native elements for this component.
     * The properties <tt>liveScroller</tt> and <tt>liveScrollerInset</tt> will
     * be respected as provided by the master template.
     * The <tt>scroll</tt> listener for the <tt>liverScroller</tt> will also be
     * added here as the <tt>mousewheel</tt> listener.
     * This method overwrites the parents implementation.
     */
    // private
    initElements : function()
    {
        var E = Ext.Element;

        var el = this.grid.getGridEl().dom.firstChild;
	    var cs = el.childNodes;

	    this.el = new E(el);

        this.mainWrap = new E(cs[1]);

        // liveScroller and liveScrollerInset
        this.liveScroller       = new E(cs[0]);
        this.liveScrollerInset  = this.liveScroller.dom.firstChild;
        this.liveScroller.on('scroll', this.onLiveScroll,  this, {buffer : this.scrollDelay});

        var thd = this.mainWrap.dom.firstChild;
	    this.mainHd = new E(thd);

	    this.hdHeight = thd.offsetHeight;

	    this.innerHd = this.mainHd.dom.firstChild;
        this.scroller = new E(this.mainWrap.dom.childNodes[1]);
        if(this.forceFit){
            this.scroller.setStyle('overflow-x', 'hidden');
        }
        this.mainBody = new E(this.scroller.dom.firstChild);

        // addd the mousewheel event to the table's body
        this.mainBody.on('mousewheel', this.handleWheel,  this);

	    this.focusEl = new E(this.scroller.dom.childNodes[1]);
        this.focusEl.swallowEvent("click", true);

        this.resizeMarker = new E(cs[2]);
        this.resizeProxy = new E(cs[3]);

    },

	/**
	 * Layouts the grid's view taking the scroller into account. The height
	 * of the scroller gets adjusted depending on the total width of the columns.
	 * The width of the grid view will be adjusted so the header and the rows do
	 * not overlap the scroller.
	 * This method will also compute the row-height based on the first row this
	 * grid displays and will adjust the number of visible rows if a resize
	 * of the grid component happened.
	 * This method overwrites the parents implementation.
	 */
	//private
    layout : function()
    {
        if(!this.mainBody){
            return; // not rendered
        }
        var g = this.grid;
        var c = g.getGridEl(), cm = this.cm,
                expandCol = g.autoExpandColumn,
                gv = this;

        var csize = c.getSize(true);

        // set vw to 19 to take scrollbar width into account!
        var vw = csize.width-this.scrollOffset;

        if(vw < 20 || csize.height < 20){ // display: none?
            return;
        }

        if(g.autoHeight){
            this.scroller.dom.style.overflow = 'visible';
        }else{
            this.el.setSize(csize.width, csize.height);

            var hdHeight = this.mainHd.getHeight();
            var vh = csize.height - (hdHeight);

            this.scroller.setSize(vw, vh);
            if(this.innerHd){
                this.innerHd.style.width = (vw)+'px';
            }
        }

        if(this.forceFit){
            if(this.lastViewWidth != vw){
                this.fitColumns(false, false);
                this.lastViewWidth = vw;
            }
        }else {
            this.autoExpand();
        }

        // adjust the number of visible rows and the height of the scroller.
        this.adjustVisibleRows();
        this.adjustBufferInset();

        this.onLayout(vw, vh);
    },

// {{{ ----------------------dom/mouse listeners--------------------------------

    /**
     * Tells the view to recalculate the number of rows displayable
     * and the buffer inset, when it gets expanded after it has been
     * collapsed.
     *
     */
    _onExpand : function(panel)
    {
        this.adjustVisibleRows();
        this.adjustBufferInset();
        this.adjustScrollerPos(this.rowHeight*this.rowIndex, true);
    },

    // private
    onColumnMove : function(cm, oldIndex, newIndex)
    {
        this.indexMap = null;
        this.replaceLiveRows(this.rowIndex, true);
        this.updateHeaders();
        this.updateHeaderSortState();
        this.afterMove(newIndex);
    },


    /**
     * Called when a column width has been updated. Adjusts the scroller height
     * and the number of visible rows wether the horizontal scrollbar is shown
     * or not.
     */
    onColumnWidthUpdated : function(col, w, tw)
    {
        this.adjustVisibleRows();
        this.adjustBufferInset();
    },

    /**
     * Called when the width of all columns has been updated. Adjusts the scroller
     * height and the number of visible rows wether the horizontal scrollbar is shown
     * or not.
     */
    onAllColumnWidthsUpdated : function(ws, tw)
    {
        this.adjustVisibleRows();
        this.adjustBufferInset();
    },

    /**
     * Callback for selecting a row. The index of the row is the absolute index
     * in the datamodel and gets translated to the index in the view.
     * Overwrites the parent's implementation.
     */
    // private
    onRowSelect : function(row)
    {
        if (row < this.rowIndex || row > this.rowIndex+this.visibleRows) {
            return;
        }

        var viewIndex = row-this.rowIndex;

        this.addRowClass(viewIndex, "x-grid3-row-selected");
    },

    /**
     * Callback for deselecting a row. The index of the row is the absolute index
     * in the datamodel and gets translated to the index in the view.
     * Overwrites the parent's implementation.
     */
    // private
    onRowDeselect : function(row)
    {
        if (row < this.rowIndex || row > this.rowIndex+this.visibleRows) {
            return;
        }

        var viewIndex = row-this.rowIndex;

        this.removeRowClass(viewIndex, "x-grid3-row-selected");
    },

    /**
     * Callback for selecting a cell. The index of the row is the absolute index
     * in the datamodel and gets translated to the index in the view.
     * Overwrites the parent's implementation.
     */
    // private
    onCellSelect : function(row, col)
    {
        if (row < this.rowIndex || row > this.rowIndex+this.visibleRows) {
            return;
        }

        var viewIndex = row-this.rowIndex;

        var cell = this.getCell(viewIndex, col);
        if(cell){
            this.fly(cell).addClass("x-grid3-cell-selected");
        }
    },

    /**
     * Callback for deselecting a cell. The index of the row is the absolute index
     * in the datamodel and gets translated to the index in the view.
     * Overwrites the parent's implementation.
     */
    // private
    onCellDeselect : function(row, col)
    {
        if (row < this.rowIndex || row > this.rowIndex+this.visibleRows) {
            return;
        }

        var viewIndex = row-this.rowIndex;

        var cell = this.getCell(viewIndex, col);
        if(cell){
            this.fly(cell).removeClass("x-grid3-cell-selected");
        }
    },

    /**
     * Callback for onmouseover event of the grid's rows. The index of the row is
     * the absolute index in the datamodel and gets translated to the index in the
     * view.
     * Overwrites the parent's implementation.
     */
    // private
    onRowOver : function(e, t)
    {
        var row;
        if((row = this.findRowIndex(t)) !== false){
            var viewIndex = row-this.rowIndex;
            this.addRowClass(viewIndex, "x-grid3-row-over");
        }
    },

    /**
     * Callback for onmouseout event of the grid's rows. The index of the row is
     * the absolute index in the datamodel and gets translated to the index in the
     * view.
     * Overwrites the parent's implementation.
     */
    // private
    onRowOut : function(e, t)
    {
        var row;
        if((row = this.findRowIndex(t)) !== false && row !== this.findRowIndex(e.getRelatedTarget())){
            var viewIndex = row-this.rowIndex;
            this.removeRowClass(viewIndex, "x-grid3-row-over");
        }
    },


// {{{ ----------------------data listeners-------------------------------------
    /**
     * Called when the buffer gets cleared. Simply calls the updateLiveRows method
     * with the adjusted index and should force the store to reload
     */
    // private
    onClear : function()
    {
        this.reset(false);//var newIndex = Math.max(this.ds.bufferRange[0] - this.visibleRows, 0);
        //this.updateLiveRows(newIndex, true, true);
    },


    /**
     * Callback for the underlying store's remove method. The current
     * implementation does only remove the selected row which record is in the
     * current store.
     *
     */
    // private
    onRemove : function(ds, record, index, isUpdate)
    {

        if (index == Number.MIN_VALUE || index == Number.MAX_VALUE) {
            this.fireEvent("beforerowremoved", this, index, record);
            this.fireEvent("rowremoved",       this, index, record);
            this.adjustBufferInset();
            return;
        }
        var viewIndex = index + this.ds.bufferRange[0];
        if(isUpdate !== true){
            this.fireEvent("beforerowremoved", this, viewIndex, record);
        }

        var domLength = this.getRows().length;

        if (viewIndex < this.rowIndex) {
            // if the according row is not displayed within the visible rect of
            // the grid, just adjust the row index and the liveScroller
            this.rowIndex--;
            this.lastRowIndex = this.rowIndex;
            this.adjustScrollerPos(-this.rowHeight, true);
            this.fireEvent('cursormove', this, this.rowIndex,
                           Math.min(this.ds.totalLength, this.visibleRows-this.rowClipped),
                           this.ds.totalLength);

        } else if (viewIndex >= this.rowIndex && viewIndex < this.rowIndex+domLength) {

            var lastPossibleRIndex = ((this.rowIndex-this.ds.bufferRange[0])+this.visibleRows)-1;

            var cInd = viewIndex-this.rowIndex;
            var rec  = this.ds.getAt(this.rowIndex+this.visibleRows-1);

            // did we reach the end of the buffer range?
            if (rec == null) {
                // are there more records we could use? send a buffer request
                if (this.ds.totalLength > this.rowIndex+this.visibleRows) {
                    if(isUpdate !== true){
                        this.fireEvent("rowremoved", this, viewIndex, record);
                    }
                    this.updateLiveRows(this.rowIndex, true, true);

                    return;
                } else {
                    // no more records, neither in the underlying data model
                    // nor in the data store
                    if (this.rowIndex == 0) {
                        // simply remove the row from the end of the dom dom
                        this.removeRows(cInd, cInd);

                    } else {
                        // scroll a new row in the rect so the whole rect is filled
                        // with rows
                        this.rowIndex--;
                        this.lastRowIndex = this.rowIndex;
                        if (this.rowIndex < this.ds.bufferRange[0]) {
                            // buffer range is invalid! request new data
                            if(isUpdate !== true){
                               this.fireEvent("rowremoved", this, viewIndex, record);
                            }
                            this.updateLiveRows(this.rowIndex);

                            return;
                        } else {
                            // still records in the store, simply update the dom,
                            //but leave processing to this method after the event rowremoved
                            // was fired so the selection store can update properly
                            this.replaceLiveRows(this.rowIndex, true, false);
                        }
                    }
                }
            } else {

                // the record is right within the visible rect of the grid.
                // remove the row that represents the record and append another
                // record from the store
                this.removeRows(cInd, cInd);
                var html = this.renderRows(lastPossibleRIndex, lastPossibleRIndex);
                Ext.DomHelper.insertHtml('beforeEnd', this.mainBody.dom, html);
            }
        }

        // a record within the bufferrange was removed, so adjust the buffer
        // range
        this.adjustBufferInset();

        if(isUpdate !== true){
            this.fireEvent("rowremoved", this, viewIndex, record);
        }

        this.processRows(0, undefined, true);
    },

    /**
     * The callback for the underlying data store when new data was added.
     * If <tt>index</tt> equals to <tt>Number.MIN_VALUE</tt> or <tt>Number.MAX_VALUE</tt>, the
     * method can't tell at which position in the underlying data model the
     * records where added. However, if <tt>index</tt> equals to <tt>Number.MIN_VALUE</tt>,
     * the <tt>rowIndex</tt> property will be adjusted to <tt>rowIndex+records.length</tt>,
     * and the <tt>liveScroller</tt>'s properties get adjusted so it matches the
     * new total number of records of the underlying data model.
     * The same will happen to any records that get added at the store index which
     * is currently represented by the first visible row in the view.
     * Any other value will cause the method to compute the number of rows that
     * have to be (re-)painted and calling the <tt>insertRows</tt> method, if
     * neccessary.
     *
     * This method triggers the <tt>beforerowsinserted</tt> and <tt>rowsinserted</tt>
     * event, passing the indexes of the records as they may default to the
     * positions in the underlying data model. However, due to the fact that
     * any sort algorithm may have computed the indexes of the records, it is
     * not guaranteed that the computed indexes equal to the indexes of the
     * underlying data model.
     *
     * @param {Ext.ux.grid.BufferedStore} ds The datastore that buffers records
     *                                       from the underlying data model
     * @param {Array} records An array containing the newly added
     *                        {@link Ext.data.Record}s
     * @param {Number} index The index of the position in the underlying
     *                       {@link Ext.ux.grid.BufferedStore} where the rows
     *                       were added.
     */
    // private
    onAdd : function(ds, records, index)
    {
        var recordLen = records.length;

        // values of index which equal to Number.MIN_VALUE or Number.MAX_VALUE
        // indicate that the records were not added to the store. The component
        // does not know which index those records do have in the underlying
        // data model
        if (index == Number.MAX_VALUE || index == Number.MIN_VALUE) {
            this.fireEvent("beforerowsinserted", this, index, index);

            // if index equals to Number.MIN_VALUE, shift rows!
            if (index == Number.MIN_VALUE) {

                this.rowIndex     = this.rowIndex + recordLen;
                this.lastRowIndex = this.rowIndex;

                this.adjustBufferInset();
                this.adjustScrollerPos(this.rowHeight*recordLen, true);

                this.fireEvent("rowsinserted", this, index, index, recordLen);
                this.processRows();
                // the cursor did virtually move
                this.fireEvent('cursormove', this, this.rowIndex,
                               Math.min(this.ds.totalLength, this.visibleRows-this.rowClipped),
                               this.ds.totalLength);

                return;
            }

            this.adjustBufferInset();
            this.fireEvent("rowsinserted", this, index, index, recordLen);
            return;
        }

        // only insert the rows which affect the current view.
        var start = index+this.ds.bufferRange[0];
        var end   = start + (recordLen-1);
        var len   = this.getRows().length;

        var firstRow = 0;
        var lastRow  = 0;

        // rows would be added at the end of the rows which are currently
        // displayed, so fire the event, resize buffer and adjust visible
        // rows and return
        if (start > this.rowIndex+(this.visibleRows-1)) {
            this.fireEvent("beforerowsinserted", this, start, end);
            this.fireEvent("rowsinserted",       this, start, end, recordLen);

            this.adjustVisibleRows();
            this.adjustBufferInset();

        }

        // rows get added somewhere in the current view.
        else if (start >= this.rowIndex && start <= this.rowIndex+(this.visibleRows-1)) {
            firstRow = index;
            // compute the last row that would be affected of an insert operation
            lastRow  = index+(recordLen-1);
            this.lastRowIndex  = this.rowIndex;
            this.rowIndex      = (start > this.rowIndex) ? this.rowIndex : start;

            this.insertRows(ds, firstRow, lastRow);

            if (this.lastRowIndex != this.rowIndex) {
                this.fireEvent('cursormove', this, this.rowIndex,
                               Math.min(this.ds.totalLength, this.visibleRows-this.rowClipped),
                               this.ds.totalLength);
            }

            this.adjustVisibleRows();
            this.adjustBufferInset();
        }

        // rows get added before the first visible row, which would not affect any
        // rows to be re-rendered
        else if (start < this.rowIndex) {
            this.fireEvent("beforerowsinserted", this, start, end);

            this.rowIndex     = this.rowIndex+recordLen;
            this.lastRowIndex = this.rowIndex;

            this.adjustVisibleRows();
            this.adjustBufferInset();

            this.adjustScrollerPos(this.rowHeight*recordLen, true);

            this.fireEvent("rowsinserted", this, start, end, recordLen);
            this.processRows(0, undefined, true);

            this.fireEvent('cursormove', this, this.rowIndex,
                           Math.min(this.ds.totalLength, this.visibleRows-this.rowClipped),
                           this.ds.totalLength);
        }




    },

// {{{ ----------------------store listeners------------------------------------
    /**
     * This callback for the store's "beforeload" event will adjust the start
     * position and the limit of the data in the model to fetch. It is guaranteed
     * that this method will only be called when the store initially loads,
     * remeote-sorts or reloads.
     * All other load events will be suspended when the view requests buffer data.
     * See {updateLiveRows}.
     *
     * @param {Ext.data.Store} store The store the Grid Panel uses
     * @param {Object} options The configuration object for the proxy that loads
     *                         data from the server
     */
    onBeforeLoad : function(store, options)
    {
        if (!options.params) {
            options.params = {start : 0, limit : this.ds.bufferSize};
        } else {
            options.params.start = 0;
            options.params.limit = this.ds.bufferSize;
        }

        options.scope    = this;
        options.callback = function(){this.reset(false);};

        return true;
    },

    /**
     * Method is used as a callback for the load-event of the attached data store.
     * Adjusts the buffer inset based upon the <tt>totalCount</tt> property
     * returned by the response.
     * Overwrites the parent's implementation.
     */
    onLoad : function(o1, o2, options)
    {
        this.adjustBufferInset();
    },

    /**
     * This will be called when the data in the store has changed, i.e. a
     * re-buffer has occured. If the table was not rendered yet, a call to
     * <tt>refresh</tt> will initially render the table, which DOM elements will
     * then be used to re-render the table upon scrolling.
     *
     */
    // private
    onDataChange : function(store)
    {
        this.updateHeaderSortState();
    },

    /**
     * A callback for the store when new data has been buffered successfully.
     * If the current row index is not within the range of the newly created
     * data buffer or another request to new data has been made while the store
     * was loading, new data will be re-requested.
     *
     * Additionally, if there are any rows that have been selected which were not
     * in the data store, the method will request the pending selections from
     * the grid's selection model and add them to the selections if available.
     * This is because the component assumes that a user who scrolls through the
     * rows and updates the view's buffer during scrolling, can check the selected
     * rows which come into the view for integrity. It is up to the user to
     * deselect those rows not matchuing the selection.
     * Additionally, if the version of the store changes during various requests
     * and selections are still pending, the versionchange event of the store
     * can delete the pending selections after a re-bufer happened and before this
     * method was called.
     *
     */
    // private
    liveBufferUpdate : function(records, options, success)
    {
        if (success === true) {
            this.fireEvent('buffer', this, this.ds, this.rowIndex,
                Math.min(this.ds.totalLength, this.visibleRows-this.rowClipped),
                this.ds.getTotalCount(),
                options
            );

            this.isBuffering    = false;
            this.isPrebuffering = false;
            this.showLoadMask(false);

            var pendingSelections = this.grid.selModel.getPendingSelections(false);

            for (var i = 0, max_i = pendingSelections.length; i < max_i; i++) {
                this.grid.selModel.clearPendingSelection(pendingSelections[i]);
            }

            if (this.isInRange(this.rowIndex)) {
                this.replaceLiveRows(this.rowIndex);
            } else {
                this.updateLiveRows(this.rowIndex);
            }

            if (this.requestQueue >= 0) {
                var offset = this.requestQueue;
                this.requestQueue = -1;
                this.updateLiveRows(offset);
            }

            return;
        } else {
            this.fireEvent('bufferfailure', this, this.ds, options);
        }

        this.requestQueue   = -1;
        this.isBuffering    = false;
        this.isPrebuffering = false;
        this.showLoadMask(false);
    },


// {{{ ----------------------scroll listeners------------------------------------
    /**
     * Handles mousewheel event on the table's body. This is neccessary since the
     * <tt>liveScroller</tt> element is completely detached from the table's body.
     *
     * @param {Ext.EventObject} e The event object
     */
    handleWheel : function(e)
    {
        if (this.rowHeight == -1) {
            e.stopEvent();
            return;
        }
        var d = e.getWheelDelta();

        this.adjustScrollerPos(-(d*this.rowHeight));

        e.stopEvent();
    },

    /**
     * Handles scrolling through the grid. Since the grid is fixed and rows get
     * removed/ added subsequently, the only way to determine the actual row in
     * view is to measure the <tt>scrollTop</tt> property of the <tt>liveScroller</tt>'s
     * DOM element.
     *
     */
    onLiveScroll : function()
    {
        var scrollTop     = this.liveScroller.dom.scrollTop;

        var cursor = Math.floor((scrollTop)/this.rowHeight);
        this.rowIndex = cursor;
        // the lastRowIndex will be set when refreshing the view has finished
        if (cursor == this.lastRowIndex) {
            return;
        }

        this.updateLiveRows(cursor);
        this.lastScrollPos = this.liveScroller.dom.scrollTop;
    },



// {{{ --------------------------helpers----------------------------------------

    // private
    refreshRow : function(record)
    {
        var ds = this.ds, index;
        if(typeof record == 'number'){
            index = record;
            record = ds.getAt(index);
        }else{
            index = ds.indexOf(record);
        }

        var viewIndex = index + this.ds.bufferRange[0];

        if (viewIndex < this.rowIndex || viewIndex >= this.rowIndex + this.visibleRows) {
            this.fireEvent("rowupdated", this, viewIndex, record);
            return;
        }

        this.insertRows(ds, index, index, true);
        //this.getRow(index).rowIndex = index;
        //this.onRemove(ds, record, index+1, true);
        this.fireEvent("rowupdated", this, viewIndex, record);
    },

    /**
     * Overwritten so the rowIndex can be changed to the absolute index.
     *
     * If the third parameter equals to <tt>true</tt>, the method will also
     * repaint the selections.
     */
    // private
    processRows : function(startRow, skipStripe, paintSelections)
    {
        skipStripe = skipStripe || !this.grid.stripeRows;
        // we will always process all rows in the view
        startRow = 0;
        var rows = this.getRows();
        var cls = ' x-grid3-row-alt ';
        var cursor = this.rowIndex;

        var index      = 0;
        var selections = this.grid.selModel.selections;
        var ds         = this.ds;
        var row        = null;
        for(var i = startRow, len = rows.length; i < len; i++){
            index = i+cursor;
            row   = rows[i];
            // changed!
            row.rowIndex = index;

            if (paintSelections == true) {
                if (this.grid.selModel.bufferedSelections[index] === true) {
                    this.addRowClass(i, "x-grid3-row-selected");
                } else {
                    this.removeRowClass(i, "x-grid3-row-selected");
                }
                this.fly(row).removeClass("x-grid3-row-over");
            }

            if(!skipStripe){
                var isAlt = ((i+1) % 2 == 0);
                var hasAlt = (' '+row.className + ' ').indexOf(cls) != -1;
                if(isAlt == hasAlt){
                    continue;
                }
                if(isAlt){
                    row.className += " x-grid3-row-alt";
                }else{
                    row.className = row.className.replace("x-grid3-row-alt", "");
                }
            }
        }
    },

    /**
     * API only, since the passed arguments are the indexes in the buffer store.
     * However, the method will try to compute the indexes so they might match
     * the indexes of the records in the underlying data model.
     *
     */
    // private
    insertRows : function(dm, firstRow, lastRow, isUpdate)
    {
        var viewIndexFirst = firstRow + this.ds.bufferRange[0];
        var viewIndexLast  = lastRow  + this.ds.bufferRange[0];

        if (!isUpdate) {
            this.fireEvent("beforerowsinserted", this, viewIndexFirst, viewIndexLast);
        }

        // first off, remove the rows at the bottom of the view to match the
        // visibleRows value and to not cause any spill in the DOM
        if (isUpdate !== true && (this.getRows().length + (lastRow-firstRow)) >= this.visibleRows) {
            this.removeRows((this.visibleRows-1)-(lastRow-firstRow), this.visibleRows-1);
        } else if (isUpdate) {
            this.removeRows(viewIndexFirst-this.rowIndex, viewIndexLast-this.rowIndex);
        }

        // compute the range of possible records which could be drawn into the view without
        // causing any spill
        var lastRenderRow = (firstRow == lastRow)
                          ? lastRow
                          : Math.min(lastRow,  (this.rowIndex-this.ds.bufferRange[0])+(this.visibleRows-1));

        var html = this.renderRows(firstRow, lastRenderRow);

        var before = this.getRow(firstRow-(this.rowIndex-this.ds.bufferRange[0]));

        if (before) {
            Ext.DomHelper.insertHtml('beforeBegin', before, html);
        } else {
            Ext.DomHelper.insertHtml('beforeEnd', this.mainBody.dom, html);
        }



        if (isUpdate === true) {
            var rows   = this.getRows();
            var cursor = this.rowIndex;
            for (var i = 0, max_i = rows.length; i < max_i; i++) {
                rows[i].rowIndex = cursor+i;
            }
        }

        if (!isUpdate) {
            this.fireEvent("rowsinserted", this, viewIndexFirst, viewIndexLast, (viewIndexLast-viewIndexFirst)+1);
            this.processRows(0, undefined, true);
        }
    },

    /**
     * Focuses the specified cell.
     * @param {Number} row The row index
     * @param {Number} col The column index
     */
    focusCell : function(row, col, hscroll)
    {
        var xy = this.ensureVisible(row, col, hscroll);
        if (!xy) {
        	return;
		}
		this.focusEl.setXY(xy);

        if(Ext.isGecko){
            this.focusEl.focus();
        }else{
            this.focusEl.focus.defer(1, this.focusEl);
        }

    },

    /**
     * Makes sure that the requested /row/col is visible in the viewport.
     * The method may invoke a request for new buffer data and triggers the
     * scroll-event of the <tt>liveScroller</tt> element.
     *
     */
    // private
    ensureVisible : function(row, col, hscroll)
    {
        if(typeof row != "number"){
            row = row.rowIndex;
        }

        if(row < 0 || row >= this.ds.totalLength){
            return;
        }

        col = (col !== undefined ? col : 0);

        var rowInd = row-this.rowIndex;

        if (this.rowClipped && row == this.rowIndex+this.visibleRows-1) {
            this.adjustScrollerPos(this.rowHeight );
        } else if (row >= this.rowIndex+this.visibleRows) {
            this.adjustScrollerPos(((row-(this.rowIndex+this.visibleRows))+1)*this.rowHeight);
        } else if (row <= this.rowIndex) {
            this.adjustScrollerPos((rowInd)*this.rowHeight);
        }
        var rowInd = rowInd < 0 ? row : rowInd;
        var rowEl = this.getRow(rowInd), cellEl;

        if(!(hscroll === false && col === 0)){
            while(this.cm.isHidden(col)){
                col++;
            }
            cellEl = this.getCell(row-this.rowIndex, col);
        }

        if(!rowEl){
            return;
        }

        var c = this.scroller.dom;

        return cellEl ?
            Ext.fly(cellEl).getXY() :
            [c.scrollLeft+this.el.getX(), Ext.fly(rowEl).getY()];
    },


    /**
     * Checks if the passed argument <tt>cursor</tt> lays within a renderable
     * area. The area is renderable, if the sum of cursor and the visibleRows
     * property does not exceed the current upper buffer limit.
     *
     * If this method returns <tt>true</tt>, it's basically save to re-render
     * the view with <tt>cursor</tt> as the absolute position in the model
     * as the first visible row.
     *
     * @param {Number} cursor The absolute position of the row in the data model.
     *
     * @return {Boolean} <tt>true</tt>, if the row can be rendered, otherwise
     *                   <tt>false</tt>
     *
     */
    isInRange : function(rowIndex)
    {
        var lastRowIndex = Math.min(this.ds.totalLength-1,
                                    rowIndex + this.visibleRows);

        return (rowIndex     >= this.ds.bufferRange[0]) &&
               (lastRowIndex <= this.ds.bufferRange[1]);
    },

    /**
     * Calculates the bufferRange start index for a buffer request
     *
     * @param {Boolean} inRange If the index is within the current buffer range
     * @param {Number} index The index to use as a reference for the calculations
     * @param {Boolean} down Wether the calculation was requested when the user scrolls down
     */
    getPredictedBufferIndex : function(index, inRange, down)
    {
        if (!inRange) {
            var dNear = 2*this.nearLimit;
            return Math.max(0, index-((dNear >= this.ds.bufferSize ? this.nearLimit : dNear)));
        }
        if (!down) {
            return Math.max(0, (index-this.ds.bufferSize)+this.visibleRows);
        }

        if (down) {
            return Math.max(0, Math.min(index, this.ds.totalLength-this.ds.bufferSize));
        }
    },


    /**
     * Updates the table view. Removes/appends rows as needed and fetches the
     * cells content out of the available store. If the needed rows are not within
     * the buffer, the method will advise the store to update it's contents.
     *
     * The method puts the requested cursor into the queue if a previously called
     * buffering is in process.
     *
     * @param {Number} cursor The row's position, absolute to it's position in the
     *                        data model
     *
     */
    updateLiveRows: function(index, forceRepaint, forceReload)
    {
        this.fireEvent('cursormove', this, index,
                       Math.min(this.ds.totalLength, this.visibleRows-this.rowClipped),
                       this.ds.totalLength);

        var inRange = this.isInRange(index);

        if (this.isBuffering && this.isPrebuffering) {
            if (inRange) {
                this.replaceLiveRows(index);
            } else {
                this.showLoadMask(true);
            }
        }
        if (this.isBuffering) {
            this.requestQueue = index;
            return;
        }

        var lastIndex  = this.lastIndex;
        this.lastIndex = index;
        var inRange    = this.isInRange(index);

        var down = false;

        if (inRange && forceReload !== true) {

            // repaint the table's view
            this.replaceLiveRows(index, forceRepaint);

            // lets decide if we can void this method or stay in here for
            // requesting a buffer update
            if (index > lastIndex) { // scrolling down

                down = true;
                var totalCount = this.ds.totalLength;

                // while scrolling, we have not yet reached the row index
                // that would trigger a re-buffer
                if (index+this.visibleRows+this.nearLimit < this.ds.bufferRange[1]) {
                    return;
                }

                // If we have already buffered the last range we can ever get
                // by the queried data repository, we don't need to buffer again.
                // This basically means that a re-buffer would only occur again
                // if we are scrolling up.
                if (this.ds.bufferRange[1] >= totalCount) {
                    return;
                }
            } else if (index < lastIndex) { // scrolling up

                down = false;
                // We are scrolling up in the first buffer range we can ever get
                // Re-buffering would only occur upon scrolling down.
                if (this.ds.bufferRange[0] <= 0) {
                    return;
                }

                // if we are scrolling up and we are moving in an acceptable
                // buffer range, lets return.
                if (index - this.nearLimit > this.ds.bufferRange[0]) {
                    return;
                }
            } else {
                return;
            }

            this.isPrebuffering = true;
        }

        // prepare for rebuffering
        this.isBuffering = true

        var bufferOffset = this.getPredictedBufferIndex(index, inRange, down);

        if (!inRange) {
            this.showLoadMask(true);
        }

        this.fireEvent('beforebuffer', this, this.ds, index,
                       Math.min(this.ds.totalLength, this.visibleRows-this.rowClipped),
                       this.ds.totalLength
        );

        this.ds.suspendEvents();
        var sInfo  = this.ds.sortInfo;

        var params = {};
        if (this.ds.lastOptions) {
            Ext.apply(params, this.ds.lastOptions.params);
        }
        params.start = bufferOffset;
        params.limit = this.ds.bufferSize;

        if (sInfo) {
            params.dir  = sInfo.direction;
            params.sort = sInfo.field;
        }
        this.ds.load({
            callback : this.liveBufferUpdate,
            scope    : this,
            params   : params
        });
        this.ds.resumeEvents();
    },

    /**
     * Shows this' view own load mask to indicate that a large amount of buffer
     * data was requested by the store.
     * @param {Boolean} show <tt>true</tt> to show the load mask, otherwise
     *                       <tt>false</tt>
     */
    showLoadMask : function(show)
    {
        if (this.loadMask == null) {
            if (show) {
                this.loadMask = new Ext.LoadMask(this.mainBody.dom.parentNode.parentNode,
                                this.loadMaskConfig);
            } else {
                return;
            }
        }

        if (show) {
            this.loadMask.show();
        } else {
            this.loadMask.hide();
        }
    },

    /**
     * Renders the table body with the contents of the model. The method will
     * prepend/ append rows after removing from either the end or the beginning
     * of the table DOM to reduce expensive DOM calls.
     * It will also take care of rendering the rows selected, taking the property
     * <tt>bufferedSelections</tt> of the {@link BufferedRowSelectionModel} into
     * account.
     * Instead of calling this method directly, the <tt>updateLiveRows</tt> method
     * should be called which takes care of rebuffering if needed, since this method
     * will behave erroneous if data of the buffer is requested which may not be
     * available.
     *
     * @param {Number} cursor The position of the data in the model to start
     *                        rendering.
     *
     * @param {Boolean} forceReplace <tt>true</tt> for recomputing the DOM in the
     *                               view, otherwise <tt>false</tt>.
     */
    // private
    replaceLiveRows : function(cursor, forceReplace, processRows)
    {
        var spill = cursor-this.lastRowIndex;

        if (spill == 0 && forceReplace !== true) {
            return;
        }

        // decide wether to prepend or append rows
        // if spill is negative, we are scrolling up. Thus we have to prepend
        // rows. If spill is positive, we have to append the buffers data.
        var append = spill > 0;

        // abs spill for simplyfiying append/prepend calculations
        spill = Math.abs(spill);

        // adjust cursor to the buffered model index
        var cursorBuffer = cursor-this.ds.bufferRange[0];

        // compute the last possible renderindex
        var lpIndex = Math.min(cursorBuffer+this.visibleRows-1, this.ds.bufferRange[1]-this.ds.bufferRange[0]);

        // we can skip checking for append or prepend if the spill is larger than
        // visibleRows. We can paint the whole rows new then-
        if (spill >= this.visibleRows || spill == 0) {
            this.mainBody.update(this.renderRows(
                cursorBuffer,
                lpIndex
            ));
        } else {
            if (append) {
                this.removeRows(0, spill-1);
                if (cursorBuffer+this.visibleRows-spill < this.ds.bufferRange[1]-this.ds.bufferRange[0]) {
                    var html = this.renderRows(
                        cursorBuffer+this.visibleRows-spill,
                        lpIndex
                    );
                    Ext.DomHelper.insertHtml('beforeEnd', this.mainBody.dom, html);
                }

            } else {
                this.removeRows(this.visibleRows-spill, this.visibleRows-1);
                var html = this.renderRows(cursorBuffer, cursorBuffer+spill-1);
                Ext.DomHelper.insertHtml('beforeBegin', this.mainBody.dom.firstChild, html);
            }
        }

        if (processRows !== false) {
            this.processRows(0, undefined, true);
        }
        this.lastRowIndex = cursor;
    },



    /**
    * Adjusts the scroller height to make sure each row in the dataset will be
    * can be displayed, no matter which value the current height of the grid
    * component equals to.
    */
    // protected
    adjustBufferInset : function()
    {
        var g = this.grid, ds = g.store;

        var c  = g.getGridEl();

        var scrollbar = this.cm.getTotalWidth()+this.scrollOffset > c.getSize().width;

        // adjust the height of the scrollbar

        var liveScrollerDom = this.liveScroller.dom;

        var contHeight = liveScrollerDom.parentNode.offsetHeight +
                         (Ext.isGecko
                         ? ((ds.totalLength > 0 && scrollbar)
                            ? - this.horizontalScrollOffset
                            : 0)
                         : (((ds.totalLength > 0 && scrollbar)
                            ? 0 : this.horizontalScrollOffset)))

        liveScrollerDom.style.height = contHeight+"px";

        if (this.rowHeight == -1) {
            return;
        }

        // hidden rows is the number of rows which cannot be
        // displayed and for which a scrollbar needs to be
        // rendered. This does also take clipped rows into account
        var hiddenRows = (ds.totalLength == this.visibleRows-this.rowClipped)
                       ? 0
                       : Math.max(0, ds.totalLength-(this.visibleRows-this.rowClipped));

        this.liveScrollerInset.style.height = (hiddenRows == 0 ? 0 : contHeight+(hiddenRows*this.rowHeight))+"px";
    },

    /**
     * Recomputes the number of visible rows in the table based upon the height
     * of the component. The method adjusts the <tt>rowIndex</tt> property as
     * needed, if the sum of visible rows and the current row index exceeds the
     * number of total data available.
     */
    // protected
    adjustVisibleRows : function()
    {
        if (this.rowHeight == -1) {
            if (this.getRows()[0]) {
                this.rowHeight = this.getRows()[0].offsetHeight;

                if (this.rowHeight <= 0) {
                    this.rowHeight = -1;
                    return;
                }

            } else {
                return;
            }
        }


        var g = this.grid, ds = g.store;

        var c    = g.getGridEl();
        var cm   = this.cm;
        var size = c.getSize(true);
        var vh   = size.height;

        var vw = size.width-this.scrollOffset;
        // horizontal scrollbar shown?
        if (cm.getTotalWidth() > vw) {
            // yes!
            vh -= this.horizontalScrollOffset;
        }

        vh -= this.mainHd.getHeight();

        var totalLength = ds.totalLength || 0;

        var visibleRows = Math.max(1, Math.floor(vh/this.rowHeight));

        this.rowClipped = 0;
        // only compute the clipped row if the total length of records
        // exceeds the number of visible rows displayable
        if (totalLength > visibleRows && this.rowHeight / 3 < (vh - (visibleRows*this.rowHeight))) {
            visibleRows = Math.min(visibleRows+1, totalLength);
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
        if (this.rowIndex + (visibleRows-this.rowClipped) > totalLength) {
            this.rowIndex     = Math.max(0, totalLength-(visibleRows-this.rowClipped));
            this.lastRowIndex = this.rowIndex;
        }

        this.updateLiveRows(this.rowIndex, true);
    },


    adjustScrollerPos : function(pixels, suspendEvent)
    {
        if (pixels == 0) {
            return;
        }
        var liveScroller = this.liveScroller;
        var scrollDom    = liveScroller.dom;

        if (suspendEvent === true) {
            liveScroller.un('scroll', this.onLiveScroll, this);
        }
        this.lastScrollPos   = scrollDom.scrollTop;
        scrollDom.scrollTop += pixels;

        if (suspendEvent === true) {
            scrollDom.scrollTop = scrollDom.scrollTop;
            liveScroller.on('scroll', this.onLiveScroll, this, {buffer : this.scrollDelay});
        }

    }



});
/*** end file 'BufferedGridView.js' ***/
