/*
 * Sage SalesLogix Web Controls
 * Copyright(c) 2009, Sage Software.
 */


String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"");}
var slxdatagrid=function(gridID){this.gridID=gridID;this.containerId=gridID+"_container";this.expandAllCell=null;this.expandable=false;this.table=null;this.expandclassname="slxgridrowexpand";this.expandnoiconclassname="slxgridrowexpandnoicon";this.collapseclassname="slxgridrowcollapse";this.collapsenoiconclassname="slxgridrowcollapsenoicon";this.contentdivclassname="cellcontents";this.pagerclassname="gridPager";this.collapsedheight="16px";this.wids=new Array();this.key="";this.__idIndexer=0;this.HeaderRow=null;var tbl=document.getElementById(gridID);if(tbl){this.table=tbl;if(tbl.getAttribute("key"))
this.key=tbl.getAttribute("key");if((tbl.rows.length>0)&&(tbl.rows[0].cells.length>0)){var cell=null;if(YAHOO.util.Dom.hasClass(tbl.rows[0],this.pagerclassname))
cell=tbl.rows[1].cells[0];else
cell=tbl.rows[0].cells[0];this.expandable=(YAHOO.util.Dom.hasClass(cell,this.expandclassname)||YAHOO.util.Dom.hasClass(cell,this.expandnoiconclassname)||YAHOO.util.Dom.hasClass(cell,this.collapseclassname)||YAHOO.util.Dom.hasClass(cell,this.collapsenoiconclassname));if(this.expandable){this.expandAllCell=cell;YAHOO.util.Event.removeListener(cell,"click",this.expandCollapseAll);YAHOO.util.Event.addListener(cell,"click",this.expandCollapseAll,this,true);}}
this.setHeaderRow();this.initColWidths();this.setSortIDs();this.attachResizeEvent();}}
slxdatagrid.prototype.GridKey=function(){return this.gridID+this.key;}
slxdatagrid.prototype.dispose=function(){this.table=null;this.expandAllCell=null;}
slxdatagrid.prototype.getColIndexStart=function(){return(this.expandable)?1:0;}
slxdatagrid.prototype.setSortIDs=function(){if((this.table.rows.length>0)&&(this.HeaderRow)){var idx=(this.table.id.lastIndexOf("_")>0)?this.table.id.lastIndexOf("_")+1:0;var idRoot=this.table.id.substring(idx);for(var i=0;i<this.HeaderRow.cells.length;i++){var links=YAHOO.util.Dom.getElementsBy(this.returnTrue,"A",this.HeaderRow.cells[i]);for(var j=0;j<links.length;j++){links[j].id=idRoot+this.__idIndexer++;}}}}
slxdatagrid.prototype.returnTrue=function(){return true;}
slxdatagrid.prototype.expandCollapseAll=function(){if(YAHOO.util.Dom.hasClass(this.expandAllCell,this.expandclassname)){for(var i=1;i<this.table.rows.length;i++){this.expandRow(this.table.rows[i]);}
YAHOO.util.Dom.removeClass(this.expandAllCell,this.expandclassname);YAHOO.util.Dom.addClass(this.expandAllCell,this.collapseclassname);}else if(YAHOO.util.Dom.hasClass(this.expandAllCell,this.collapseclassname)){for(var i=1;i<this.table.rows.length;i++){this.collapseRow(this.table.rows[i]);}
YAHOO.util.Dom.removeClass(this.expandAllCell,this.collapseclassname);YAHOO.util.Dom.addClass(this.expandAllCell,this.expandclassname);}}
function expandCollapseRow(){var row=this.gridobj.getRow(this.idx);this.gridobj.toggleRow(row);}
slxdatagrid.prototype.toggleRow=function(row){if(row){if(YAHOO.util.Dom.hasClass(row.cells[0],this.expandclassname)||YAHOO.util.Dom.hasClass(row.cells[0],this.expandnoiconclassname)){this.expandRow(row);}else if(YAHOO.util.Dom.hasClass(row.cells[0],this.collapseclassname)||YAHOO.util.Dom.hasClass(row.cells[0],this.collapsenoiconclassname)){this.collapseRow(row);}}}
slxdatagrid.prototype.expandRow=function(row){if(row){if(YAHOO.util.Dom.hasClass(row.cells[0],this.collapseclassname)||(!YAHOO.util.Dom.hasClass(row.cells[0],this.expandclassname)&&!YAHOO.util.Dom.hasClass(row.cells[0],this.expandnoiconclassname))){return;}
var collapseH=this.collapsedheight.replace("px","");for(var i=this.getColIndexStart();i<row.cells.length;i++){cell=row.cells[i];if(cell.childNodes[0]){if(YAHOO.util.Dom.hasClass(cell.childNodes[0],this.contentdivclassname)){if(cell.childNodes[0].scrollHeight>collapseH){YAHOO.util.Dom.setStyle(cell.childNodes[0],"height","100%");}}}}
var expandoCell=row.cells[0];if(YAHOO.util.Dom.hasClass(row.cells[0],this.expandclassname))
YAHOO.util.Dom.replaceClass(expandoCell,this.expandclassname,this.collapseclassname);else
YAHOO.util.Dom.replaceClass(expandoCell,this.expandnoiconclassname,this.collapsenoiconclassname);}}
slxdatagrid.prototype.collapseRow=function(row){if(row){if(YAHOO.util.Dom.hasClass(row.cells[0],this.expandclassname)||(!YAHOO.util.Dom.hasClass(row.cells[0],this.collapseclassname)&&!YAHOO.util.Dom.hasClass(row.cells[0],this.collapsenoiconclassname))){return;}
var collapseH=this.collapsedheight.replace("px","");var setH=collapseH;for(var i=this.getColIndexStart();i<row.cells.length;i++){cell=row.cells[i];if(cell.childNodes[0]){if(YAHOO.util.Dom.hasClass(cell.childNodes[0],this.contentdivclassname)){setH=(collapseH<cell.childNodes[0].scrollHeight)?collapseH:cell.childNodes[0].scrollHeight;YAHOO.util.Dom.setStyle(cell.childNodes[0],"height",setH+"px");}}}
var expandoCell=row.cells[0];if(YAHOO.util.Dom.hasClass(row.cells[0],this.collapseclassname))
YAHOO.util.Dom.replaceClass(expandoCell,this.collapseclassname,this.expandclassname);else
YAHOO.util.Dom.replaceClass(expandoCell,this.collapsenoiconclassname,this.expandnoiconclassname);}}
slxdatagrid.prototype.getRow=function(idx){if((this.table)&&(this.table.rows.length>idx)){return this.table.rows[idx];}
return null;}
slxdatagrid.prototype.initColWidths=function(){if(this.HeaderRow){if(this.getWidthsFromCookie()){if(this.expandable){this.setWidth(0,"20",false);}
for(var i=this.getColIndexStart();i<this.HeaderRow.cells.length;i++){this.setWidth(i,this.wids[i],false);}}else{this.fillSpace();}}}
slxdatagrid.prototype.fillSpace=function(){if(this.HeaderRow){if(this.expandable){this.setWidth(0,"20",false);}
var cont=YAHOO.util.Dom.get(this.containerId);var container=YAHOO.util.Region.getRegion(cont);var containerW=container.right-container.left;var tbl=YAHOO.util.Region.getRegion(this.table);this.doResize();var tblW=tbl.right-tbl.left;var spaceWidth=container.right-tbl.right;var divCols=this.HeaderRow.cells.length;if(this.expandable){divCols--;}
var increaseBy=Math.round(spaceWidth/divCols);increaseBy--;this.getCurrentWidths();var start=(this.expandable)?1:0;if(increaseBy>3){for(var i=start;i<this.HeaderRow.cells.length;i++){var newtableregion=YAHOO.util.Region.getRegion(this.table);if(newtableregion.right>container.right-increaseBy){increaseBy=container.right-newtableregion.right-2;}
if(newtableregion.right>container.right-4){return;}
var newWidth=this.wids[i]+increaseBy;if(this.wids[i]){this.setWidth(i,newWidth,false);if(cont.scrollWidth>containerW){this.setWidth(i,newWidth-(cont.scrollWidth-containerW),false);return;}
newtableregion=YAHOO.util.Region.getRegion(this.table);var tblWidth=newtableregion.right-newtableregion.left-2;if(tblWidth>=containerW){var newNewWidth=newWidth-(tblWidth-containerW+5);this.setWidth(i,newNewWidth,false);return;}}}}}}
slxdatagrid.prototype.getCurrentWidths=function(){if(this.HeaderRow){this.wids=new Array();for(var i=0;i<this.HeaderRow.cells.length;i++){this.wids.push(this.getColumnWidth(i));}}}
slxdatagrid.prototype.getColumnWidth=function(colIndex){if(this.HeaderRow){if(this.HeaderRow.cells[colIndex]){var region=YAHOO.util.Region.getRegion(this.HeaderRow.cells[colIndex]);return region.right-region.left;}}
return 0;}
slxdatagrid.prototype.getWidthsFromCookie=function(){var widthcookie=getCookie("GRIDCW");if(widthcookie){var grids=widthcookie.split("||");for(var i=0;i<grids.length;i++){var widthdef=grids[i].split("!");if(widthdef[0]==this.GridKey()){if(widthdef[1]){this.wids=widthdef[1].split(":");return true;}}}}
return false;}
slxdatagrid.prototype.setWidthsToCookie=function(){this.getCurrentWidths();var widthcookie=getCookie("GRIDCW");if(widthcookie){var grids=widthcookie.split("||");widthcookie="";var needtoadd=true;for(var i=0;i<grids.length;i++){var widthdef=grids[i].split("!");if(widthdef[0]==this.GridKey()){widthdef[1]=this.generateWidthCookieString();needtoadd=false;}
widthcookie+=(i>0)?"||":"";widthcookie+=widthdef[0]+"!"+widthdef[1];}
if(needtoadd){widthcookie+=(widthcookie!="")?"||":"";widthcookie+=this.GridKey()+"!"+this.generateWidthCookieString();}}else{widthcookie=this.GridKey()+"!"+this.generateWidthCookieString();}
document.cookie="GRIDCW="+widthcookie;}
function getCookie(name){var cookies=document.cookie.split(";");for(var i=0;i<cookies.length;i++){var cookie=cookies[i].split("=");if(cookie.length>0){if(cookie[0].trim()==name){if(cookie[1]){return cookie[1];}}}}
return null;}
slxdatagrid.prototype.generateWidthCookieString=function(){var str="";for(var i=0;i<this.wids.length;i++){str+=(i>0)?":":"";var num=this.wids[i];num=Math.round(num);str+=num;}
return str;}
slxdatagrid.prototype.setWidth=function(colIdx,width,persist){if(!isNaN(width)){width=width+"px";}
if(this.HeaderRow){for(var r=0;r<this.table.rows.length;r++){if(this.table.rows[r].cells[colIdx]){YAHOO.util.Dom.setStyle(this.table.rows[r].cells[colIdx],"width",width);}}
if(persist){this.setWidthsToCookie();}}}
slxdatagrid.prototype.setHeaderRow=function(){for(var r=0;r<this.table.rows.length;r++){if(this.table.rows[r].getAttribute("HeaderRow")){this.HeaderRow=this.table.rows[r];return;}}}
slxdatagridcolumn=function(headerColId,datagrid,colIdx,config){if(headerColId){this.datagrid=datagrid;this.colIndex=colIdx;this.headerColId=headerColId;this.init(headerColId,headerColId,config);this.handleElId=headerColId;this.setHandleElId(headerColId);var elem=YAHOO.util.Dom.get(headerColId);if(elem){YAHOO.util.Event.removeListener(elem,"mouseover",this.onMouse);YAHOO.util.Event.addListener(elem,"mouseover",this.onMouse,this,true);YAHOO.util.Event.removeListener(elem,"mousemove",this.onMouse);YAHOO.util.Event.addListener(elem,"mousemove",this.onMouse,this,true);YAHOO.util.Event.removeListener(elem,"mouseout",this.onMouseOut);YAHOO.util.Event.addListener(elem,"mouseout",this.onMouseOut,this,true);}}}
YAHOO.extend(slxdatagridcolumn,YAHOO.util.DragDrop);slxdatagridcolumn.prototype.dispose=function(){this.datagrid=null;var elem=YAHOO.util.Dom.get(this.headerColId);if(elem){YAHOO.util.Event.purgeElement(elem);}}
slxdatagridcolumn.prototype.onMouseDown=function(e){var panel=this.getEl();this.startWidth=panel.offsetWidth;this.startPos=YAHOO.util.Event.getPageX(e);}
slxdatagridcolumn.prototype.onDrag=function(e){var newPos=YAHOO.util.Event.getPageX(e);var offsetX=newPos-this.startPos;var newWidth=Math.max(this.startWidth+offsetX,30);var panel=this.getEl();panel.style.width=newWidth+"px";this.datagrid.setWidth(this.colIndex,newWidth+"px",true);}
slxdatagridcolumn.prototype.onMouse=function(e){eventX=YAHOO.util.Event.getPageX(e);var elem=YAHOO.util.Dom.get(this.headerColId);var region=YAHOO.util.Region.getRegion(elem);hotX=region.right-10;if(eventX>hotX){YAHOO.util.Dom.setStyle(this.headerColId,"cursor","col-resize");}else{YAHOO.util.Dom.setStyle(this.headerColId,"cursor","");}}
slxdatagridcolumn.prototype.onMouseOut=function(e){YAHOO.util.Dom.setStyle(this.headerColId,"cursor","");}
slxdatagrid.prototype.doResize=function(){var cont=document.getElementById(this.containerId);var container=YAHOO.util.Region.getRegion(cont);var tbl=YAHOO.util.Region.getRegion(this.table);if((tbl.right-tbl.left)>(container.right-container.left)){if(cont.style.height==""){var tblheight=tbl.bottom-tbl.top;document.getElementById(this.containerId).style.height=(tblheight+20)+"px";}}}
slxdatagrid.prototype.attachResizeEvent=function(){var viewport=window["mainViewport"];var panel=(viewport?viewport.findById("center_panel_center"):false);if(panel){panel.on("resize",function(panel,adjWidth,adjHeight,width,height){this.doResize();},this);}}