
Ext.namespace('Ext.ux.grid');Ext.ux.grid.BufferedStore=function(config){config=config||{};config.remoteSort=true;Ext.apply(this,config);this.addEvents({'versionchange':true,'beforeselectionsload':true,'selectionsload':true});Ext.ux.grid.BufferedStore.superclass.constructor.call(this,config);this.totalLength=0;this.bufferRange=[0,0];this.on('clear',function(){this.bufferRange=[0,0];},this);if(this.url&&!this.selectionsProxy){this.selectionsProxy=new Ext.data.HttpProxy({url:this.url});}};Ext.extend(Ext.ux.grid.BufferedStore,Ext.data.Store,{version:null,insert:function(index,records)
{records=[].concat(records);index=index>=this.bufferSize?Number.MAX_VALUE:index;if(index==Number.MIN_VALUE||index==Number.MAX_VALUE){var l=records.length;if(index==Number.MIN_VALUE){this.bufferRange[0]+=l;this.bufferRange[1]+=l;}
this.totalLength+=l;this.fireEvent("add",this,records,index);return;}
var split=false;var insertRecords=records;if(records.length+index>=this.bufferSize){split=true;insertRecords=records.splice(0,this.bufferSize-index)}
this.totalLength+=insertRecords.length;if(this.bufferRange[1]<this.bufferSize){this.bufferRange[1]=Math.min(this.bufferRange[1]+insertRecords.length,this.bufferSize);}
for(var i=0,len=insertRecords.length;i<len;i++){this.data.insert(index,insertRecords[i]);insertRecords[i].join(this);}
while(this.getCount()>this.bufferSize){this.data.remove(this.data.last());}
this.fireEvent("add",this,insertRecords,index);if(split==true){this.fireEvent("add",this,records,Number.MAX_VALUE);}},remove:function(record)
{var index=this.data.indexOf(record);if(index<0){var ind=this.findInsertIndex(record);this.totalLength-=1;if(this.pruneModifiedRecords){this.modified.remove(record);}
this.fireEvent("remove",this,record,ind);return false;}
this.bufferRange[1]--;this.data.removeAt(index);if(this.pruneModifiedRecords){this.modified.remove(record);}
this.totalLength-=1;this.fireEvent("remove",this,record,index);return true;},removeAll:function()
{this.totalLength=0;this.data.clear();if(this.pruneModifiedRecords){this.modified=[];}
this.fireEvent("clear",this);},loadRanges:function(ranges)
{var max_i=ranges.length;if(max_i>0&&!this.selectionsProxy.activeRequest&&this.fireEvent("beforeselectionsload",this,ranges)!==false){var lParams=this.lastOptions.params;var params={};params.ranges=Ext.encode(ranges);if(lParams){if(lParams.sort){params.sort=lParams.sort;}
if(lParams.dir){params.dir=lParams.dir;}}
var options={};for(var i in this.lastOptions){options.i=this.lastOptions.i;}
options.ranges=params.ranges;this.selectionsProxy.load(params,this.reader,this.selectionsLoaded,this,options);}},loadSelections:function(ranges)
{this.loadRanges(ranges);},selectionsLoaded:function(o,options,success)
{if(this.checkVersionChange(o,options,success)!==false){this.fireEvent("selectionsload",this,o.records,Ext.decode(options.ranges));}else{this.fireEvent("selectionsload",this,[],Ext.decode(options.ranges));}},checkVersionChange:function(o,options,success)
{if(o&&success!==false){if(o.version!==undefined){var old=this.version;this.version=o.version;if(this.version!==old){return this.fireEvent('versionchange',this,old,this.version);}}}},findInsertIndex:function(record)
{this.remoteSort=false;var index=Ext.ux.grid.BufferedStore.superclass.findInsertIndex.call(this,record);this.remoteSort=true;if(this.bufferRange[0]>0&&index==0){index=Number.MIN_VALUE;}else if(index>=this.bufferSize){index=Number.MAX_VALUE;}
return index;},sortData:function(f,direction)
{direction=direction||'ASC';var st=this.fields.get(f).sortType;var fn=function(r1,r2){var v1=st(r1.data[f]),v2=st(r2.data[f]);return v1>v2?1:(v1<v2?-1:0);};this.data.sort(direction,fn);},onMetaChange:function(meta,rtype,o)
{this.version=null;Ext.ux.grid.BufferedStore.superclass.onMetaChange.call(this,meta,rtype,o);},loadRecords:function(o,options,success)
{this.checkVersionChange(o,options,success);this.bufferRange=[options.params.start,Math.min(options.params.start+options.params.limit,o.totalRecords)];Ext.ux.grid.BufferedStore.superclass.loadRecords.call(this,o,options,success);},getAt:function(index)
{var modelIndex=index-this.bufferRange[0];return this.data.itemAt(modelIndex);},clearFilter:function(){},isFiltered:function(){},collect:function(){},createFilterFn:function(){},sum:function(){},filter:function(){},filterBy:function(){},query:function(){},queryBy:function(){},find:function(){},findBy:function(){}});Ext.namespace('Ext.ux.data');Ext.ux.data.BufferedJsonReader=function(meta,recordType){Ext.ux.data.BufferedJsonReader.superclass.constructor.call(this,meta,recordType);};Ext.extend(Ext.ux.data.BufferedJsonReader,Ext.data.JsonReader,{readRecords:function(o)
{var s=this.meta;if(!this.__readRecords){this.__readRecords=Ext.ux.data.BufferedJsonReader.superclass.readRecords;}
var intercept=this.__readRecords.call(this,o);if(s.versionProperty){if(!this.getVersion)
this.getVersion=this.getJsonAccessor(this.versionProperty);var v=this.getVersion(o);intercept.version=(v===undefined||v==="")?null:v;}
return intercept;}});Ext.namespace('Ext.ux.grid');Ext.ux.grid.BufferedGridDragZone=function(grid,config){this.view=grid.getView();Ext.ux.grid.BufferedGridDragZone.superclass.constructor.call(this,this.view.mainBody.dom,config);if(this.view.lockedBody){this.setHandleElId(Ext.id(this.view.mainBody.dom));this.setOuterHandleElId(Ext.id(this.view.lockedBody.dom));}
this.scroll=false;this.grid=grid;this.ddel=document.createElement('div');this.ddel.className='x-grid-dd-wrap';this.view.ds.on('beforeselectionsload',this.onBeforeSelectionsLoad,this);this.view.ds.on('selectionsload',this.onSelectionsLoad,this);};Ext.extend(Ext.ux.grid.BufferedGridDragZone,Ext.dd.DragZone,{ddGroup:"GridDD",isDropValid:true,getDragData:function(e)
{var t=Ext.lib.Event.getTarget(e);var rowIndex=this.view.findRowIndex(t);if(rowIndex!==false){var sm=this.grid.selModel;if(!sm.isSelected(rowIndex)||e.hasModifier()){sm.handleMouseDown(this.grid,rowIndex,e);}
return{grid:this.grid,ddel:this.ddel,rowIndex:rowIndex,selections:sm.getSelections()};}
return false;},onInitDrag:function(e)
{this.view.ds.loadSelections(this.grid.selModel.getPendingSelections(true));var data=this.dragData;this.ddel.innerHTML=this.grid.getDragDropText();this.proxy.update(this.ddel);},onBeforeSelectionsLoad:function()
{this.isDropValid=false;Ext.fly(this.proxy.el.dom.firstChild).addClass('x-dd-drop-waiting');},onSelectionsLoad:function()
{this.isDropValid=true;this.ddel.innerHTML=this.grid.getDragDropText();Ext.fly(this.proxy.el.dom.firstChild).removeClass('x-dd-drop-waiting');},afterRepair:function()
{this.dragging=false;},getRepairXY:function(e,data)
{return false;},onStartDrag:function()
{},onEndDrag:function(data,e)
{},onValidDrop:function(dd,e,id)
{this.hideProxy();},beforeInvalidDrop:function(e,id)
{}});Ext.namespace('Ext.ux');Ext.ux.BufferedGridToolbar=Ext.extend(Ext.Toolbar,{displayMsg:'Displaying {0} - {1} of {2}',emptyMsg:'No data to display',refreshText:"Refresh",initComponent:function()
{Ext.ux.BufferedGridToolbar.superclass.initComponent.call(this);this.bind(this.view);},updateInfo:function(rowIndex,visibleRows,totalCount)
{if(this.displayEl){var msg=totalCount==0?this.emptyMsg:String.format(this.displayMsg,rowIndex+1,rowIndex+visibleRows,totalCount);this.displayEl.update(msg);}},unbind:function(view)
{view.un('rowremoved',this.onRowRemoved,this);view.un('rowsinserted',this.onRowsInserted,this);view.un('beforebuffer',this.beforeBuffer,this);view.un('cursormove',this.onCursorMove,this);view.un('buffer',this.onBuffer,this);view.un('bufferfailure',this.onBufferFailure,this);this.view=undefined;},bind:function(view)
{view.on('rowremoved',this.onRowRemoved,this);view.on('rowsinserted',this.onRowsInserted,this);view.on('beforebuffer',this.beforeBuffer,this);view.on('cursormove',this.onCursorMove,this);view.on('buffer',this.onBuffer,this);view.on('bufferfailure',this.onBufferFailure,this);this.view=view;},onCursorMove:function(view,rowIndex,visibleRows,totalCount)
{this.updateInfo(rowIndex,visibleRows,totalCount);},onRowsInserted:function(view,start,end)
{this.updateInfo(view.rowIndex,Math.min(view.ds.totalLength,view.visibleRows),view.ds.totalLength);},onRowRemoved:function(view,index,record)
{this.updateInfo(view.rowIndex,Math.min(view.ds.totalLength,view.visibleRows),view.ds.totalLength);},beforeBuffer:function(view,store,rowIndex,visibleRows,totalCount)
{this.loading.disable();this.updateInfo(rowIndex,visibleRows,totalCount);},onBufferFailure:function(view,store,options)
{this.loading.enable();},onBuffer:function(view,store,rowIndex,visibleRows,totalCount)
{this.loading.enable();this.updateInfo(rowIndex,visibleRows,totalCount);},onClick:function(type)
{switch(type){case'refresh':this.view.reset(true);break;}},onRender:function(ct,position)
{Ext.PagingToolbar.superclass.onRender.call(this,ct,position);this.loading=this.addButton({tooltip:this.refreshText,iconCls:"x-tbar-loading",handler:this.onClick.createDelegate(this,["refresh"])});this.addSeparator();if(this.displayInfo){this.displayEl=Ext.fly(this.el.dom).createChild({cls:'x-paging-info'});}}});Ext.namespace('Ext.ux.grid');Ext.ux.grid.BufferedRowSelectionModel=function(config){this.addEvents({'selectiondirty':true});Ext.apply(this,config);this.bufferedSelections={};this.pendingSelections={};Ext.ux.grid.BufferedRowSelectionModel.superclass.constructor.call(this);};Ext.extend(Ext.ux.grid.BufferedRowSelectionModel,Ext.grid.RowSelectionModel,{initEvents:function()
{Ext.ux.grid.BufferedRowSelectionModel.superclass.initEvents.call(this);this.grid.view.on('rowsinserted',this.onAdd,this);this.grid.store.on('selectionsload',this.onSelectionsLoad,this);},onRefresh:function()
{this.clearSelections(true);},onRemove:function(v,index,r)
{if((index==Number.MIN_VALUE||index==Number.MAX_VALUE)){this.selections.remove(r);this.fireEvent('selectiondirty',this,index,r);return;}
var viewIndex=index;var fire=this.bufferedSelections[viewIndex]===true;var ranges=this.getPendingSelections();var rangesLength=ranges.length;delete this.bufferedSelections[viewIndex];delete this.pendingSelections[viewIndex];if(r){this.selections.remove(r);}
if(rangesLength==0){this.shiftSelections(viewIndex,-1);}else{var s=ranges[0];var e=ranges[rangesLength-1];if(viewIndex<=e||viewIndex<=s){if(this.fireEvent('selectiondirty',this,viewIndex,-1)!==false){this.shiftSelections(viewIndex,-1);}}}
if(fire){this.fireEvent('selectionchange',this);}},onAdd:function(store,index,endIndex,recordLength)
{var ranges=this.getPendingSelections();var rangesLength=ranges.length;if((index==Number.MIN_VALUE||index==Number.MAX_VALUE)){if(rangesLength==0&&index==Number.MIN_VALUE){this.shiftSelections(this.grid.getStore().bufferRange[0],recordLength);}
this.fireEvent('selectiondirty',this,index,recordLength);return;}
if(rangesLength==0){this.shiftSelections(index,recordLength);return;}
var s=ranges[0];var e=ranges[rangesLength-1];var viewIndex=index;if(viewIndex<=e||viewIndex<=s){if(this.fireEvent('selectiondirty',this,viewIndex,recordLength)!==false){this.shiftSelections(viewIndex,recordLength);}}},shiftSelections:function(startRow,length)
{var index=0;var newSelections={};var newIndex=0;var newRequests={};var totalLength=this.grid.store.totalLength;this.last=false;for(var i in this.bufferedSelections){index=parseInt(i);newIndex=index+length;if(newIndex>=totalLength){break;}
if(index>=startRow){newSelections[newIndex]=true;if(this.pendingSelections[i]){newRequests[newIndex]=true;}}else{newSelections[i]=true;if(this.pendingSelections[i]){newRequests[i]=true;}}}
this.bufferedSelections=newSelections;this.pendingSelections=newRequests;},onSelectionsLoad:function(store,records,ranges)
{this.pendingSelections={};this.selections.addAll(records);},hasNext:function()
{return this.last!==false&&(this.last+1)<this.grid.store.getTotalCount();},getCount:function()
{var sels=this.bufferedSelections;var c=0;for(var i in sels){c++;}
return c;},isSelected:function(index)
{if(typeof index=="number"){return this.bufferedSelections[index]===true;}
var r=index;return(r&&this.selections.key(r.id)?true:false);},deselectRow:function(index,preventViewNotify)
{if(this.locked)return;if(this.last==index){this.last=false;}
if(this.lastActive==index){this.lastActive=false;}
var r=this.grid.store.getAt(index);delete this.pendingSelections[index];delete this.bufferedSelections[index];if(r){this.selections.remove(r);}
if(!preventViewNotify){this.grid.getView().onRowDeselect(index);}
this.fireEvent("rowdeselect",this,index,r);this.fireEvent("selectionchange",this);},selectRow:function(index,keepExisting,preventViewNotify)
{if(this.last===index||this.locked||index<0||index>=this.grid.store.getTotalCount()){return;}
var r=this.grid.store.getAt(index);if(this.fireEvent("beforerowselect",this,index,keepExisting,r)!==false){if(!keepExisting||this.singleSelect){this.clearSelections();}
if(r){this.selections.add(r);delete this.pendingSelections[index];}else{this.pendingSelections[index]=true;}
this.bufferedSelections[index]=true;this.last=this.lastActive=index;if(!preventViewNotify){this.grid.getView().onRowSelect(index);}
this.fireEvent("rowselect",this,index,r);this.fireEvent("selectionchange",this);}},clearPendingSelection:function(index)
{var r=this.grid.store.getAt(index);if(!r){return;}
this.selections.add(r);delete this.pendingSelections[index];},getPendingSelections:function(asRange)
{var index=1;var ranges=[];var currentRange=0;var tmpArray=[];for(var i in this.pendingSelections){tmpArray.push(parseInt(i));}
tmpArray.sort(function(o1,o2){if(o1>o2){return 1;}else if(o1<o2){return-1;}else{return 0;}});if(asRange===false){return tmpArray;}
var max_i=tmpArray.length;if(max_i==0){return[];}
ranges[currentRange]=[tmpArray[0],tmpArray[0]];for(var i=0,max_i=max_i-1;i<max_i;i++){if(tmpArray[i+1]-tmpArray[i]==1){ranges[currentRange][1]=tmpArray[i+1];}else{currentRange++;ranges[currentRange]=[tmpArray[i+1],tmpArray[i+1]];}}
return ranges;},clearSelections:function(fast)
{if(this.locked)return;if(fast!==true){var s=this.selections;s.clear();for(var i in this.bufferedSelections){this.deselectRow(i);}}else{this.selections.clear();this.bufferedSelections={};this.pendingSelections={};}
this.last=false;},selectRange:function(startRow,endRow,keepExisting)
{if(this.locked){return;}
if(!keepExisting){this.clearSelections();}
if(startRow<=endRow){for(var i=startRow;i<=endRow;i++){this.selectRow(i,true);}}else{for(var i=startRow;i>=endRow;i--){this.selectRow(i,true);}}}});Ext.namespace('Ext.ux.grid');Ext.ux.grid.BufferedGridView=function(config){this.addEvents({'beforebuffer':true,'buffer':true,'bufferfailure':true,'cursormove':true});this.horizontalScrollOffset=16;this.loadMask=false;Ext.apply(this,config);this.templates={};this.templates.master=new Ext.Template('<div class="x-grid3" hidefocus="true"><div style="z-index:2000;background:none;position:relative;height:321px; float:right; width: 18px;overflow: scroll;"><div style="background:none;width:1px;overflow:hidden;font-size:1px;height:0px;"></div></div>','<div class="x-grid3-viewport" style="float:left">','<div class="x-grid3-header"><div class="x-grid3-header-inner"><div class="x-grid3-header-offset">{header}</div></div><div class="x-clear"></div></div>','<div class="x-grid3-scroller" style="overflow-y:hidden !important;"><div class="x-grid3-body" style="position:relative;">{body}</div><a href="#" class="x-grid3-focus" tabIndex="-1"></a></div>',"</div>",'<div class="x-grid3-resize-marker">&#160;</div>','<div class="x-grid3-resize-proxy">&#160;</div>',"</div>");Ext.ux.grid.BufferedGridView.superclass.constructor.call(this);};Ext.extend(Ext.ux.grid.BufferedGridView,Ext.grid.GridView,{hdHeight:0,rowClipped:0,liveScroller:null,liveScrollerInset:null,rowHeight:-1,visibleRows:1,lastIndex:-1,lastRowIndex:0,lastScrollPos:0,rowIndex:0,isBuffering:false,requestQueue:-1,loadMask:null,isPrebuffering:false,reset:function(forceReload)
{if(forceReload===false){this.ds.modified=[];this.grid.selModel.clearSelections(true);this.rowIndex=0;this.lastScrollPos=0;this.lastRowIndex=0;this.lastIndex=0;this.adjustVisibleRows();this.adjustScrollerPos(-this.liveScroller.dom.scrollTop,true);this.showLoadMask(false);this.refresh(true);this.fireEvent('cursormove',this,0,Math.min(this.ds.totalLength,this.visibleRows-this.rowClipped),this.ds.totalLength);}else{var params={start:0,limit:this.ds.bufferSize};var sInfo=this.ds.sortInfo;if(sInfo){params.dir=sInfo.direction;params.sort=sInfo.field;}
this.ds.load({callback:function(){this.reset(false);},scope:this,params:params});}},renderUI:function()
{var g=this.grid;var dEnabled=g.enableDragDrop||g.enableDrag;g.enableDragDrop=false;g.enableDrag=false;Ext.ux.grid.BufferedGridView.superclass.renderUI.call(this);var g=this.grid;g.enableDragDrop=dEnabled;g.enableDrag=dEnabled;if(dEnabled){var dd=new Ext.ux.grid.BufferedGridDragZone(g,{ddGroup:g.ddGroup||'GridDD'});}
if(this.loadMask){this.loadMask=new Ext.LoadMask(this.mainBody.dom.parentNode.parentNode,this.loadMask);}},init:function(grid)
{Ext.ux.grid.BufferedGridView.superclass.init.call(this,grid);grid.on('expand',this._onExpand,this);this.ds.on('beforeload',this.onBeforeLoad,this);},renderBody:function()
{var markup=this.renderRows(0,this.visibleRows-1);return this.templates.body.apply({rows:markup});},initElements:function()
{var E=Ext.Element;var el=this.grid.getGridEl().dom.firstChild;var cs=el.childNodes;this.el=new E(el);this.mainWrap=new E(cs[1]);this.liveScroller=new E(cs[0]);this.liveScrollerInset=this.liveScroller.dom.firstChild;this.liveScroller.on('scroll',this.onLiveScroll,this,{buffer:this.scrollDelay});var thd=this.mainWrap.dom.firstChild;this.mainHd=new E(thd);this.hdHeight=thd.offsetHeight;this.innerHd=this.mainHd.dom.firstChild;this.scroller=new E(this.mainWrap.dom.childNodes[1]);if(this.forceFit){this.scroller.setStyle('overflow-x','hidden');}
this.mainBody=new E(this.scroller.dom.firstChild);this.mainBody.on('mousewheel',this.handleWheel,this);this.focusEl=new E(this.scroller.dom.childNodes[1]);this.focusEl.swallowEvent("click",true);this.resizeMarker=new E(cs[2]);this.resizeProxy=new E(cs[3]);},layout:function()
{if(!this.mainBody){return;}
var g=this.grid;var c=g.getGridEl(),cm=this.cm,expandCol=g.autoExpandColumn,gv=this;var csize=c.getSize(true);var vw=csize.width-this.scrollOffset;if(vw<20||csize.height<20){return;}
if(g.autoHeight){this.scroller.dom.style.overflow='visible';}else{this.el.setSize(csize.width,csize.height);var hdHeight=this.mainHd.getHeight();var vh=csize.height-(hdHeight);this.scroller.setSize(vw,vh);if(this.innerHd){this.innerHd.style.width=(vw)+'px';}}
if(this.forceFit){if(this.lastViewWidth!=vw){this.fitColumns(false,false);this.lastViewWidth=vw;}}else{this.autoExpand();}
this.adjustVisibleRows();this.adjustBufferInset();this.onLayout(vw,vh);},_onExpand:function(panel)
{this.adjustVisibleRows();this.adjustBufferInset();this.adjustScrollerPos(this.rowHeight*this.rowIndex,true);},onColumnMove:function(cm,oldIndex,newIndex)
{this.indexMap=null;this.replaceLiveRows(this.rowIndex,true);this.updateHeaders();this.updateHeaderSortState();this.afterMove(newIndex);},onColumnWidthUpdated:function(col,w,tw)
{this.adjustVisibleRows();this.adjustBufferInset();},onAllColumnWidthsUpdated:function(ws,tw)
{this.adjustVisibleRows();this.adjustBufferInset();},onRowSelect:function(row)
{if(row<this.rowIndex||row>this.rowIndex+this.visibleRows){return;}
var viewIndex=row-this.rowIndex;this.addRowClass(viewIndex,"x-grid3-row-selected");},onRowDeselect:function(row)
{if(row<this.rowIndex||row>this.rowIndex+this.visibleRows){return;}
var viewIndex=row-this.rowIndex;this.removeRowClass(viewIndex,"x-grid3-row-selected");},onCellSelect:function(row,col)
{if(row<this.rowIndex||row>this.rowIndex+this.visibleRows){return;}
var viewIndex=row-this.rowIndex;var cell=this.getCell(viewIndex,col);if(cell){this.fly(cell).addClass("x-grid3-cell-selected");}},onCellDeselect:function(row,col)
{if(row<this.rowIndex||row>this.rowIndex+this.visibleRows){return;}
var viewIndex=row-this.rowIndex;var cell=this.getCell(viewIndex,col);if(cell){this.fly(cell).removeClass("x-grid3-cell-selected");}},onRowOver:function(e,t)
{var row;if((row=this.findRowIndex(t))!==false){var viewIndex=row-this.rowIndex;this.addRowClass(viewIndex,"x-grid3-row-over");}},onRowOut:function(e,t)
{var row;if((row=this.findRowIndex(t))!==false&&row!==this.findRowIndex(e.getRelatedTarget())){var viewIndex=row-this.rowIndex;this.removeRowClass(viewIndex,"x-grid3-row-over");}},onClear:function()
{this.reset(false);},onRemove:function(ds,record,index,isUpdate)
{if(index==Number.MIN_VALUE||index==Number.MAX_VALUE){this.fireEvent("beforerowremoved",this,index,record);this.fireEvent("rowremoved",this,index,record);this.adjustBufferInset();return;}
var viewIndex=index+this.ds.bufferRange[0];if(isUpdate!==true){this.fireEvent("beforerowremoved",this,viewIndex,record);}
var domLength=this.getRows().length;if(viewIndex<this.rowIndex){this.rowIndex--;this.lastRowIndex=this.rowIndex;this.adjustScrollerPos(-this.rowHeight,true);this.fireEvent('cursormove',this,this.rowIndex,Math.min(this.ds.totalLength,this.visibleRows-this.rowClipped),this.ds.totalLength);}else if(viewIndex>=this.rowIndex&&viewIndex<this.rowIndex+domLength){var lastPossibleRIndex=((this.rowIndex-this.ds.bufferRange[0])+this.visibleRows)-1;var cInd=viewIndex-this.rowIndex;var rec=this.ds.getAt(this.rowIndex+this.visibleRows-1);if(rec==null){if(this.ds.totalLength>this.rowIndex+this.visibleRows){if(isUpdate!==true){this.fireEvent("rowremoved",this,viewIndex,record);}
this.updateLiveRows(this.rowIndex,true,true);return;}else{if(this.rowIndex==0){this.removeRows(cInd,cInd);}else{this.rowIndex--;this.lastRowIndex=this.rowIndex;if(this.rowIndex<this.ds.bufferRange[0]){if(isUpdate!==true){this.fireEvent("rowremoved",this,viewIndex,record);}
this.updateLiveRows(this.rowIndex);return;}else{this.replaceLiveRows(this.rowIndex,true,false);}}}}else{this.removeRows(cInd,cInd);var html=this.renderRows(lastPossibleRIndex,lastPossibleRIndex);Ext.DomHelper.insertHtml('beforeEnd',this.mainBody.dom,html);}}
this.adjustBufferInset();if(isUpdate!==true){this.fireEvent("rowremoved",this,viewIndex,record);}
this.processRows(0,undefined,true);},onAdd:function(ds,records,index)
{var recordLen=records.length;if(index==Number.MAX_VALUE||index==Number.MIN_VALUE){this.fireEvent("beforerowsinserted",this,index,index);if(index==Number.MIN_VALUE){this.rowIndex=this.rowIndex+recordLen;this.lastRowIndex=this.rowIndex;this.adjustBufferInset();this.adjustScrollerPos(this.rowHeight*recordLen,true);this.fireEvent("rowsinserted",this,index,index,recordLen);this.processRows();this.fireEvent('cursormove',this,this.rowIndex,Math.min(this.ds.totalLength,this.visibleRows-this.rowClipped),this.ds.totalLength);return;}
this.adjustBufferInset();this.fireEvent("rowsinserted",this,index,index,recordLen);return;}
var start=index+this.ds.bufferRange[0];var end=start+(recordLen-1);var len=this.getRows().length;var firstRow=0;var lastRow=0;if(start>this.rowIndex+(this.visibleRows-1)){this.fireEvent("beforerowsinserted",this,start,end);this.fireEvent("rowsinserted",this,start,end,recordLen);this.adjustVisibleRows();this.adjustBufferInset();}
else if(start>=this.rowIndex&&start<=this.rowIndex+(this.visibleRows-1)){firstRow=index;lastRow=index+(recordLen-1);this.lastRowIndex=this.rowIndex;this.rowIndex=(start>this.rowIndex)?this.rowIndex:start;this.insertRows(ds,firstRow,lastRow);if(this.lastRowIndex!=this.rowIndex){this.fireEvent('cursormove',this,this.rowIndex,Math.min(this.ds.totalLength,this.visibleRows-this.rowClipped),this.ds.totalLength);}
this.adjustVisibleRows();this.adjustBufferInset();}
else if(start<this.rowIndex){this.fireEvent("beforerowsinserted",this,start,end);this.rowIndex=this.rowIndex+recordLen;this.lastRowIndex=this.rowIndex;this.adjustVisibleRows();this.adjustBufferInset();this.adjustScrollerPos(this.rowHeight*recordLen,true);this.fireEvent("rowsinserted",this,start,end,recordLen);this.processRows(0,undefined,true);this.fireEvent('cursormove',this,this.rowIndex,Math.min(this.ds.totalLength,this.visibleRows-this.rowClipped),this.ds.totalLength);}},onBeforeLoad:function(store,options)
{if(!options.params){options.params={start:0,limit:this.ds.bufferSize};}else{options.params.start=0;options.params.limit=this.ds.bufferSize;}
options.scope=this;options.callback=function(){this.reset(false);};return true;},onLoad:function(o1,o2,options)
{this.adjustBufferInset();},onDataChange:function(store)
{this.updateHeaderSortState();},liveBufferUpdate:function(records,options,success)
{if(success===true){this.fireEvent('buffer',this,this.ds,this.rowIndex,Math.min(this.ds.totalLength,this.visibleRows-this.rowClipped),this.ds.getTotalCount(),options);this.isBuffering=false;this.isPrebuffering=false;this.showLoadMask(false);var pendingSelections=this.grid.selModel.getPendingSelections(false);for(var i=0,max_i=pendingSelections.length;i<max_i;i++){this.grid.selModel.clearPendingSelection(pendingSelections[i]);}
if(this.isInRange(this.rowIndex)){this.replaceLiveRows(this.rowIndex);}else{this.updateLiveRows(this.rowIndex);}
if(this.requestQueue>=0){var offset=this.requestQueue;this.requestQueue=-1;this.updateLiveRows(offset);}
return;}else{this.fireEvent('bufferfailure',this,this.ds,options);}
this.requestQueue=-1;this.isBuffering=false;this.isPrebuffering=false;this.showLoadMask(false);},handleWheel:function(e)
{if(this.rowHeight==-1){e.stopEvent();return;}
var d=e.getWheelDelta();this.adjustScrollerPos(-(d*this.rowHeight));e.stopEvent();},onLiveScroll:function()
{var scrollTop=this.liveScroller.dom.scrollTop;var cursor=Math.floor((scrollTop)/this.rowHeight);this.rowIndex=cursor;if(cursor==this.lastRowIndex){return;}
this.updateLiveRows(cursor);this.lastScrollPos=this.liveScroller.dom.scrollTop;},refreshRow:function(record)
{var ds=this.ds,index;if(typeof record=='number'){index=record;record=ds.getAt(index);}else{index=ds.indexOf(record);}
var viewIndex=index+this.ds.bufferRange[0];if(viewIndex<this.rowIndex||viewIndex>=this.rowIndex+this.visibleRows){this.fireEvent("rowupdated",this,viewIndex,record);return;}
this.insertRows(ds,index,index,true);this.fireEvent("rowupdated",this,viewIndex,record);},processRows:function(startRow,skipStripe,paintSelections)
{skipStripe=skipStripe||!this.grid.stripeRows;startRow=0;var rows=this.getRows();var cls=' x-grid3-row-alt ';var cursor=this.rowIndex;var index=0;var selections=this.grid.selModel.selections;var ds=this.ds;var row=null;for(var i=startRow,len=rows.length;i<len;i++){index=i+cursor;row=rows[i];row.rowIndex=index;if(paintSelections==true){if(this.grid.selModel.bufferedSelections[index]===true){this.addRowClass(i,"x-grid3-row-selected");}else{this.removeRowClass(i,"x-grid3-row-selected");}
this.fly(row).removeClass("x-grid3-row-over");}
if(!skipStripe){var isAlt=((i+1)%2==0);var hasAlt=(' '+row.className+' ').indexOf(cls)!=-1;if(isAlt==hasAlt){continue;}
if(isAlt){row.className+=" x-grid3-row-alt";}else{row.className=row.className.replace("x-grid3-row-alt","");}}}},insertRows:function(dm,firstRow,lastRow,isUpdate)
{var viewIndexFirst=firstRow+this.ds.bufferRange[0];var viewIndexLast=lastRow+this.ds.bufferRange[0];if(!isUpdate){this.fireEvent("beforerowsinserted",this,viewIndexFirst,viewIndexLast);}
if(isUpdate!==true&&(this.getRows().length+(lastRow-firstRow))>=this.visibleRows){this.removeRows((this.visibleRows-1)-(lastRow-firstRow),this.visibleRows-1);}else if(isUpdate){this.removeRows(viewIndexFirst-this.rowIndex,viewIndexLast-this.rowIndex);}
var lastRenderRow=(firstRow==lastRow)?lastRow:Math.min(lastRow,(this.rowIndex-this.ds.bufferRange[0])+(this.visibleRows-1));var html=this.renderRows(firstRow,lastRenderRow);var before=this.getRow(firstRow-(this.rowIndex-this.ds.bufferRange[0]));if(before){Ext.DomHelper.insertHtml('beforeBegin',before,html);}else{Ext.DomHelper.insertHtml('beforeEnd',this.mainBody.dom,html);}
if(isUpdate===true){var rows=this.getRows();var cursor=this.rowIndex;for(var i=0,max_i=rows.length;i<max_i;i++){rows[i].rowIndex=cursor+i;}}
if(!isUpdate){this.fireEvent("rowsinserted",this,viewIndexFirst,viewIndexLast,(viewIndexLast-viewIndexFirst)+1);this.processRows(0,undefined,true);}},focusCell:function(row,col,hscroll)
{var xy=this.ensureVisible(row,col,hscroll);if(!xy){return;}
this.focusEl.setXY(xy);if(Ext.isGecko){this.focusEl.focus();}else{this.focusEl.focus.defer(1,this.focusEl);}},ensureVisible:function(row,col,hscroll)
{if(typeof row!="number"){row=row.rowIndex;}
if(row<0||row>=this.ds.totalLength){return;}
col=(col!==undefined?col:0);var rowInd=row-this.rowIndex;if(this.rowClipped&&row==this.rowIndex+this.visibleRows-1){this.adjustScrollerPos(this.rowHeight);}else if(row>=this.rowIndex+this.visibleRows){this.adjustScrollerPos(((row-(this.rowIndex+this.visibleRows))+1)*this.rowHeight);}else if(row<=this.rowIndex){this.adjustScrollerPos((rowInd)*this.rowHeight);}
var rowInd=rowInd<0?row:rowInd;var rowEl=this.getRow(rowInd),cellEl;if(!(hscroll===false&&col===0)){while(this.cm.isHidden(col)){col++;}
cellEl=this.getCell(row-this.rowIndex,col);}
if(!rowEl){return;}
var c=this.scroller.dom;return cellEl?Ext.fly(cellEl).getXY():[c.scrollLeft+this.el.getX(),Ext.fly(rowEl).getY()];},isInRange:function(rowIndex)
{var lastRowIndex=Math.min(this.ds.totalLength-1,rowIndex+this.visibleRows);return(rowIndex>=this.ds.bufferRange[0])&&(lastRowIndex<=this.ds.bufferRange[1]);},getPredictedBufferIndex:function(index,inRange,down)
{if(!inRange){var dNear=2*this.nearLimit;return Math.max(0,index-((dNear>=this.ds.bufferSize?this.nearLimit:dNear)));}
if(!down){return Math.max(0,(index-this.ds.bufferSize)+this.visibleRows);}
if(down){return Math.max(0,Math.min(index,this.ds.totalLength-this.ds.bufferSize));}},updateLiveRows:function(index,forceRepaint,forceReload)
{this.fireEvent('cursormove',this,index,Math.min(this.ds.totalLength,this.visibleRows-this.rowClipped),this.ds.totalLength);var inRange=this.isInRange(index);if(this.isBuffering&&this.isPrebuffering){if(inRange){this.replaceLiveRows(index);}else{this.showLoadMask(true);}}
if(this.isBuffering){this.requestQueue=index;return;}
var lastIndex=this.lastIndex;this.lastIndex=index;var inRange=this.isInRange(index);var down=false;if(inRange&&forceReload!==true){this.replaceLiveRows(index,forceRepaint);if(index>lastIndex){down=true;var totalCount=this.ds.totalLength;if(index+this.visibleRows+this.nearLimit<this.ds.bufferRange[1]){return;}
if(this.ds.bufferRange[1]>=totalCount){return;}}else if(index<lastIndex){down=false;if(this.ds.bufferRange[0]<=0){return;}
if(index-this.nearLimit>this.ds.bufferRange[0]){return;}}else{return;}
this.isPrebuffering=true;}
this.isBuffering=true
var bufferOffset=this.getPredictedBufferIndex(index,inRange,down);if(!inRange){this.showLoadMask(true);}
this.fireEvent('beforebuffer',this,this.ds,index,Math.min(this.ds.totalLength,this.visibleRows-this.rowClipped),this.ds.totalLength);this.ds.suspendEvents();var sInfo=this.ds.sortInfo;var params={};if(this.ds.lastOptions){Ext.apply(params,this.ds.lastOptions.params);}
params.start=bufferOffset;params.limit=this.ds.bufferSize;if(sInfo){params.dir=sInfo.direction;params.sort=sInfo.field;}
this.ds.load({callback:this.liveBufferUpdate,scope:this,params:params});this.ds.resumeEvents();},showLoadMask:function(show)
{if(this.loadMask==null){if(show){this.loadMask=new Ext.LoadMask(this.mainBody.dom.parentNode.parentNode,this.loadMaskConfig);}else{return;}}
if(show){this.loadMask.show();}else{this.loadMask.hide();}},replaceLiveRows:function(cursor,forceReplace,processRows)
{var spill=cursor-this.lastRowIndex;if(spill==0&&forceReplace!==true){return;}
var append=spill>0;spill=Math.abs(spill);var cursorBuffer=cursor-this.ds.bufferRange[0];var lpIndex=Math.min(cursorBuffer+this.visibleRows-1,this.ds.bufferRange[1]-this.ds.bufferRange[0]);if(spill>=this.visibleRows||spill==0){this.mainBody.update(this.renderRows(cursorBuffer,lpIndex));}else{if(append){this.removeRows(0,spill-1);if(cursorBuffer+this.visibleRows-spill<this.ds.bufferRange[1]-this.ds.bufferRange[0]){var html=this.renderRows(cursorBuffer+this.visibleRows-spill,lpIndex);Ext.DomHelper.insertHtml('beforeEnd',this.mainBody.dom,html);}}else{this.removeRows(this.visibleRows-spill,this.visibleRows-1);var html=this.renderRows(cursorBuffer,cursorBuffer+spill-1);Ext.DomHelper.insertHtml('beforeBegin',this.mainBody.dom.firstChild,html);}}
if(processRows!==false){this.processRows(0,undefined,true);}
this.lastRowIndex=cursor;},adjustBufferInset:function()
{var g=this.grid,ds=g.store;var c=g.getGridEl();var scrollbar=this.cm.getTotalWidth()+this.scrollOffset>c.getSize().width;var liveScrollerDom=this.liveScroller.dom;var contHeight=liveScrollerDom.parentNode.offsetHeight+
(Ext.isGecko?((ds.totalLength>0&&scrollbar)?-this.horizontalScrollOffset:0):(((ds.totalLength>0&&scrollbar)?0:this.horizontalScrollOffset)))
liveScrollerDom.style.height=contHeight+"px";if(this.rowHeight==-1){return;}
var hiddenRows=(ds.totalLength==this.visibleRows-this.rowClipped)?0:Math.max(0,ds.totalLength-(this.visibleRows-this.rowClipped));this.liveScrollerInset.style.height=(hiddenRows==0?0:contHeight+(hiddenRows*this.rowHeight))+"px";},adjustVisibleRows:function()
{if(this.rowHeight==-1){if(this.getRows()[0]){this.rowHeight=this.getRows()[0].offsetHeight;if(this.rowHeight<=0){this.rowHeight=-1;return;}}else{return;}}
var g=this.grid,ds=g.store;var c=g.getGridEl();var cm=this.cm;var size=c.getSize(true);var vh=size.height;var vw=size.width-this.scrollOffset;if(cm.getTotalWidth()>vw){vh-=this.horizontalScrollOffset;}
vh-=this.mainHd.getHeight();var totalLength=ds.totalLength||0;var visibleRows=Math.max(1,Math.floor(vh/this.rowHeight));this.rowClipped=0;if(totalLength>visibleRows&&this.rowHeight/3<(vh-(visibleRows*this.rowHeight))){visibleRows=Math.min(visibleRows+1,totalLength);this.rowClipped=1;}
if(this.visibleRows==visibleRows-this.rowsClipped){return;}
this.visibleRows=visibleRows;if(this.isBuffering){return;}
if(this.rowIndex+(visibleRows-this.rowClipped)>totalLength){this.rowIndex=Math.max(0,totalLength-(visibleRows-this.rowClipped));this.lastRowIndex=this.rowIndex;}
this.updateLiveRows(this.rowIndex,true);},adjustScrollerPos:function(pixels,suspendEvent)
{if(pixels==0){return;}
var liveScroller=this.liveScroller;var scrollDom=liveScroller.dom;if(suspendEvent===true){liveScroller.un('scroll',this.onLiveScroll,this);}
this.lastScrollPos=scrollDom.scrollTop;scrollDom.scrollTop+=pixels;if(suspendEvent===true){scrollDom.scrollTop=scrollDom.scrollTop;liveScroller.on('scroll',this.onLiveScroll,this,{buffer:this.scrollDelay});}}});