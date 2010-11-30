// JScript File


function SLXDataGrid(ElementID) {
    
    if (ElementID) {
        // private members
        this.tHeadRow = null;
        this.selRow        = null;
        this.ID = ElementID;
        
        this.oResizeEl = null;  /* tracks which column is being resized */
	    this.oResortEl = null;  /* tracks which column is being resorted */
	    this.oOrigBox = null;   /* tracks the original width of col being resized */
	    this.iDown = null;      /* tracks where the mouse was depressed for col resize */
	    this.iRowsOpen = 0;     /* var tracking when all the table rows have opened or closed */
	    this.mvCursor = "move"; /* variable used to assign cursor. IE6 gets a different one */
	    this.selRow = null;     /* number of selected row in the table - used in toggling */
	    this.iColOffset = 0;    /* simplify figuring column number around chrome */
	    this.collapseState = 'closedAll';
	    this.iShowSortArrows = 1;  /* Turn on the showing of the sorting arrows  */
	    this.oStyle = null;		/* Addition of global stylesheet to document for grid */
	    this.sUID = "";
	    
	    this.HighlightBackgroundColor = "Highlight";
	    this.HighlightFontColor = "White";
	    
	    // events
        this.onrowdeselect      = new YAHOO.util.CustomEvent("onrowdeselect", this);
        this.onrowselect        = new YAHOO.util.CustomEvent("onrowselect", this);
        this.onrowadd           = new YAHOO.util.CustomEvent("onrowadd", this);
        this.onrowdelete        = new YAHOO.util.CustomEvent("onrowdelete", this);
        this.onrendercomplete   = new YAHOO.util.CustomEvent("onrendercomplete", this);

	    	    
        // call init only once the element is available
        YAHOO.util.Event.onAvailable(ElementID, this.init, this, true); 
              
    }
     
}

//constants
SLXDataGrid.prototype.defStripeEven 	    = 'rgb(208,208,191)';
SLXDataGrid.prototype.defStripeOdd 	        = '#FFFFFF';
SLXDataGrid.prototype.defChromeBaseColor 	= 'rgb(235,234,219)';
SLXDataGrid.prototype.defChromeLightColor   = 'rgb(235,234,219)';
SLXDataGrid.prototype.defChromeDarkColor 	= 'rgb(127,157,185)';
SLXDataGrid.prototype.defBoxLineColor 	    = 'rgb(127,157,185)';
SLXDataGrid.prototype.defSelectedRowColor   = 'rgb(0,85,229)';
SLXDataGrid.prototype.defSelectedTextColor  = 'white';
SLXDataGrid.prototype.defSelectedLinkColor  = 'yellow';
SLXDataGrid.prototype.defTextColor	        = 'black';
SLXDataGrid.prototype.oSheet                = null;


// called from constructor once table element is available
SLXDataGrid.prototype.init = function () {
    this.gridElement = document.getElementById(this.ID);
    if (this.gridElement.tagName.toLowerCase() == 'table') {
      
      	// get properties		   
        this.StripeEven = this.gridElement.getAttribute("StripeEven")
        this.StripeOdd = this.gridElement.getAttribute("StripeOdd");
        this.ChromeBaseColor = this.gridElement.getAttribute("ChromeBaseColor");
        this.ChromeLightColor = this.gridElement.getAttribute("ChromeLightColor");
        this.ChromeBaseColor = this.gridElement.getAttribute("ChromeBaseColor");
        this.ChromeDarkColor = this.gridElement.getAttribute("ChromeDarkColor");
        this.BoxLineColor = this.gridElement.getAttribute("BoxLineColor");
        this.GridLineColor = this.gridElement.getAttribute("GridLineColor");
        this.TextColor = this.gridElement.getAttribute("TextColor");
        this.SelectedRowColor = this.gridElement.getAttribute("SelectedRowColor");
        this.SelectedTextColor = this.gridElement.getAttribute("SelectedTextColor");
        this.SelectedLinkColor = this.gridElement.getAttribute("SelectedLinkColor");
        this.Expandable = this.gridElement.getAttribute("Expandable");
        this.Selectable = this.gridElement.getAttribute("Selectable");
        this.Sortable = this.gridElement.getAttribute("Sortable");
        this.GroupID = this.gridElement.getAttribute("GroupID");
        this.RecordID = this.gridElement.getAttribute("RecordID");
        this.PageSize = this.gridElement.getAttribute("PageSize");
        this.CurrentPage = this.gridElement.getAttribute("CurrentPage");
        this.SortCol = this.gridElement.getAttribute("SortCol");
        this.renderComplete = this.gridElement.getAttribute("renderComplete"); // VALUE="FALSE"
        this.CurrentPage = this.gridElement.getAttribute("CurrentPage");
        this.selectedIndex = this.gridElement.getAttribute("selectedIndex"); // VALUE="-1"
        this.preformatted = this.gridElement.getAttribute("preformatted");
        
        //this.onrendercomplete = this.gridElement.getAttribute("onrendercomplete");
        
        //apply defaults
        this.StripeEven = (this.StripeEven)? this.StripeEven : this.defStripeEven;
        this.StripeOdd = (this.StripeOdd)? this.StripeOdd : this.defStripeOdd;
        this.ChromeBaseColor = (this.ChromeBaseColor) ? this.ChromeBaseColor : this.defChromeBaseColor;
        this.ChromeLightColor = (this.ChromeLightColor) ? this.ChromeLightColor : this.defChromeLightColor;
        this.ChromeDarkColor = (this.ChromeDarkColor) ? this.ChromeDarkColor : this.defChromeDarkColor;
        this.BoxLineColor = (this.BoxLineColor) ? this.BoxLineColor : this.defBoxLineColor;
        this.GridLineColor = (this.GridLineColor) ? this.GridLineColor : this.BoxLineColor ; //ChromeBaseColor;
        this.SelectedRowColor = (this.SelectedRowColor) ? this.SelectedRowColor : this.defSelectedRowColor;
        this.SelectedTextColor = (this.SelectedTextColor) ? this.SelectedTextColor : this.defSelectedTextColor;
        this.SelectedLinkColor = (this.SelectedLinkColor) ? this.SelectedLinkColor : this.defSelectedLinkColor;
        this.TextColor = (this.TextColor) ? this.TextColor : this.defTextColor;
        this.Expandable = "FALSE";  //(this.Expandable == 'FALSE') ? 'FALSE' : 'TRUE';
        this.iColOffset = (this.Expandable == 'TRUE') ? 1 : 0;
        this.GroupID = (this.GroupID) ? this.GroupID : 'GROUPID1';
        this.Selectable = (this.Selectable) ? this.Selectable : "TRUE";
        this.selectedIndex = (this.SelectedIndex) ? this.selectedIndex : -1;
        this.renderComplete = (this.renderComplete) ? this.renderComplete : "FALSE";
            
        if (this.Sortable == 'FALSE') { this.iShowSortArrows = 0 };
        if (this.preformatted != 'TRUE') {
            this.sUID = this.gridElement.uniqueID	/* Get a unique ID for ourselves. We'll use this for css classname construction */
        } else {
            this.sUID = "__pref";
        }
	   
	    //this.setupStyles(); //remove for now - causes page refresh
        this.attachEvents();
        this.styleRows();  

        this.onrendercomplete.fire(this);
    }

}

SLXDataGrid.prototype.attachEvents = function() {
	
	if (this.gridElement.rows.length < 1) {
		return;
	} else {
		this.tHeadRow = this.gridElement.rows[0];
		this.tHeadRow.style.height = '19px';
	}
	// the events on the header row to resize the columns...
	for (var i = 0; i < this.tHeadRow.cells.length ; i++) {
		var c = this.tHeadRow.cells[i]  ;
		YAHOO.util.Event.addListener(c, "mousemove", this.isHot, this, true); 
		YAHOO.util.Event.addListener(c, "mousedown", this.startResize, this, true); 
		YAHOO.util.Event.addListener(c, "mouseup", this.endResize, this, true); 
//		if (iShowSortArrows) {
//			//if (!((preformatted == 'TRUE') && (i == 0))) {
//				c.attachEvent("onclick",fireSortByColumn);
//			//}
//		}
	}
	
    //attach row event handlers
    for (var i = 1; i < this.gridElement.rows.length; i++) {
	    var r = this.gridElement.rows[i];
	    r.vAlign = 'top';
	    YAHOO.util.Event.addListener(r, "click", this.SelectRow, this, true); 
    	
    }
		
//	if (Expandable == 'TRUE') {
//		tHeadRow.cells(0).attachEvent('onclick', toggleRow);
//	}

	// the events on the Expanders and rows to expand and select rows
//	if ((Selectable=='TRUE') || (Expandable == 'TRUE')) {
//		for (var i = 1; i < element.rows.length; i++) {
//			var r = element.rows(i);
//			if (Selectable == 'TRUE') {
//				r.attachEvent("onclick",selectRow);
//			}
//			if (Expandable == 'TRUE') {
//				r.cells(0).attachEvent('onclick',toggleRow);
//			}
//		}
//	}
}

SLXDataGrid.prototype.setupStyles = function() {
   /* creating a global stylesheet in the document to do our CSS work.  */
   /* Name rules using the UniqueID of the object so that multiple      */
   /* datagrids will not tread on each other.                           */
    if (this.preformatted != 'TRUE') {
        if (window.document.styleSheets.length < 1)
            this.oSheet = window.document.createStyleSheet();
        else
            this.oSheet = window.document.styleSheets[0];
        
               
       
        
        if (this.oSheet.addRule) {
            this.oSheet.addRule("TR.rowLight" + this.sUID,"BACKGROUND-COLOR:" + this.StripeEven + ";" + "COLOR:" + this.TextColor + ";");
			this.oSheet.addRule("TR.rowDark" + this.sUID,"BACKGROUND-COLOR:" + this.StripeOdd + ";" + "COLOR:" + this.TextColor + ";");
			this.oSheet.addRule("TR.rowSelected" + this.sUID,"BACKGROUND-COLOR:" + this.SelectedRowColor + "; COLOR:" + this.SelectedTextColor);
			this.oSheet.addRule("TR.rowSelected" + this.sUID + " TD A","COLOR:" + this.SelectedLinkColor);
			this.oSheet.addRule("TD.cellGrid" + this.sUID,	"BORDER-RIGHT: 1px "+ this.GridLineColor + " solid;" + "BORDER-BOTTOM: 1px "+ this.GridLineColor + " solid;");
			this.oSheet.addRule(".cellChrome" + this.sUID,"BORDER-TOP:1px " + this.ChromeLightColor + " solid;" + "BORDER-LEFT:1px " + this.ChromeLightColor + " solid;" + "BORDER-RIGHT:1px " + this.ChromeDarkColor + " solid;" + "BORDER-BOTTOM:1px " + this.ChromeDarkColor + " solid;" + "BACKGROUND-COLOR:" + this.ChromeBaseColor + ";" + "COLOR:" + this.TextColor + ";" + "CURSOR:pointer;");
        } 
        else {  //mozilla
            this.oSheet.insertRule("TR.rowLight" + this.sUID + " {BACKGROUND-COLOR:" + this.StripeEven + ";" + "COLOR:" + this.TextColor + "; }", this.oSheet.cssRules.length);
            this.oSheet.insertRule("TR.rowDark" + this.sUID + " {BACKGROUND-COLOR:" + this.StripeOdd + ";" + "COLOR:" + this.TextColor + "; }" , this.oSheet.cssRules.length);
            this.oSheet.insertRule("TR.rowSelected" + this.sUID + " {BACKGROUND-COLOR:" + this.SelectedRowColor + "; COLOR:" + this.SelectedTextColor + "}", this.oSheet.cssRules.length);
            this.oSheet.insertRule("TR.rowSelected" + this.sUID + " TD A {COLOR:" + this.SelectedLinkColor, this.oSheet.cssRules.length);
            this.oSheet.insertRule("TD.cellGrid" + this.sUID + " {BORDER-RIGHT: 1px " + this.GridLineColor + " solid;" + "BORDER-BOTTOM: 1px " + this.GridLineColor + " solid;}" , this.oSheet.cssRules.length);
            this.oSheet.insertRule(".cellChrome" + this.sUID + " {BORDER-TOP:1px " + this.ChromeLightColor + " solid;" + "BORDER-LEFT:1px " + this.ChromeLightColor + " solid;" + "BORDER-RIGHT:1px " + this.ChromeDarkColor + " solid;" + "BORDER-BOTTOM:1px " + this.ChromeDarkColor + " solid;" + "BACKGROUND-COLOR:" + this.ChromeBaseColor + ";" + "COLOR:" + this.TextColor + ";" + "CURSOR:hand;}" , this.oSheet.cssRules.length);
         }

//        for ( var i = 0; i < this.gridElement.rows.length; i++ ) {
//	        if (this.gridElement.rows[i].cells[0].children.length != 0) {
//		        if (this.gridElement.rows[i].cells[0].children.item[0].fillcolor) {
//			        this.gridElement.rows[i].cells[0].children.item[0].fillcolor = this.TextColor;
//		        }
//	        }
//        }
    }
}

SLXDataGrid.prototype.SelectedIndex = function() {
    return this.selectedIndex;    

}

SLXDataGrid.prototype.SelectRow = function(ev) {
    var rowIdx;
	var elem = ev.target || window.event.srcElement;
	var i = 0;
	while (elem.tagName != 'TR') {
		elem = elem.parentNode || elem.parentNode;
		if (i++ > 4) { break; }  //This should never happen, but this will avoid an endless loop.
	}
	rowIdx = elem.rowIndex;
	if (this.selRow) {
		if (this.selRow == rowIdx) {
			//this.normalizeRow(this.selRow);
			//this.selectedIndex = -1;
			
			//this.onrowdeselect.fire(this.selRow);
			//this.selRow = null;
		} else {
			this.normalizeRow(this.selRow);
			this.selRow = rowIdx;
			this.hilightRow(this.selRow);
			this.selectedIndex = this.selRow;
            this.onrowselect.fire(this.selRow);
		}
	} else {
		this.selRow = rowIdx;
		this.hilightRow(this.selRow);
		this.selectedIndex = this.selRow;
        this.onrowselect.fire(this.selRow);
	}

}

SLXDataGrid.prototype.selectRowByIndex = function(iNum) {
	// this method is not zero based. First row is row 1.
	if (!isNaN(iNum)) {
		if (iNum > 0 && iNum <= this.gridElement.rows.length - 1) {
			if (this.selRow) {
				if (this.selRow == iNum) {
					this.normalizeRow(this.selRow);
					this.selectedIndex = '-1';
					this.onrowdeselect.fire(this.selRow);
					this.selRow = null;
				} else {
					this.normalizeRow(this.selRow);
					this.selectedIndex = '-1';
					this.onrowdeselect.fire(this.selRow);
					this.selRow = iNum;
					this.hilightRow(this.selRow);
					this.selectedIndex = this.selRow
					this.onrowselect.fire(this.selRow);
				}
			} else {
				this.selRow = iNum;
				this.selectedIndex = iNum;
				this.hilightRow(this.selRow);
			    this.onrowselect.fire(this.selRow);
			}
		}
	}
}

SLXDataGrid.prototype.selectNextRow = function() {
	var iNextRow;
	if (!this.selRow) {
		iNextRow = 0;
	} else {
		iNextRow = this.selRow + 1;
	}
	this.selectRowByIndex(iNextRow);
}

SLXDataGrid.prototype.selectPrevRow = function() {
	var iNextRow;
	if (!this.selRow) {
		this.iNextRow = 0;
	} else {
		this.iNextRow = (this.selRow == 0) ? 0 : this.selRow -1;
	}
	this.selectRowByIndex(iNextRow)
}


SLXDataGrid.prototype.normalizeRow = function(iNum) {
 		this.gridElement.rows[iNum].style.backgroundColor = "";
 		this.gridElement.rows[iNum].style.color = "";
		this.gridElement.rows[iNum].selected = undefined;
}

SLXDataGrid.prototype.hilightRow = function(iNum) {
        this.gridElement.rows[iNum].style.backgroundColor = this.HighlightBackgroundColor;
        this.gridElement.rows[iNum].style.color = this.HighlightFontColor;
  		this.gridElement.rows[iNum].selected = true;
}

SLXDataGrid.prototype.styleRows = function() {
		for (var i = 1; i < this.gridElement.rows.length; i++) {
			var r = this.gridElement.rows[i];
			if (i % 2 == 1) {
				r.className = "rowLight" + this.sUID;
			} else {
				r.className = "rowDark" + this.sUID;
			}
		}
		if (this.selRow) {
			this.hilightRow(this.selRow);
		}
}

SLXDataGrid.prototype.addNewRow = function(iIndex) {
	if (typeof(iIndex) != 'undefined') {
		if (!isNaN(iIndex)) {
			if ((iIndex > 0) && (iIndex <= this.gridElement.rows.length)) {
				var r = this.gridElement.insertRow(iIndex);
			} else {
				var r = this.gridElement.insertRow(this.gridElement.rows.length);
			}
		} else {
			var r = this.gridElement.insertRow(this.gridElement.rows.length);
		}
	} else {
		var r = this.gridElement.insertRow(this.gridElement.rows.length);
	}
	r.vAlign = 'top';
    
    var cellNums = this.gridElement.rows[0].cells.length;
	if (this.Selectable == 'TRUE') {
		YAHOO.util.Event.addListener(r, "click", this.SelectRow, this, true); 
	}
	
    for (var i = 0; i < cellNums; i++) {
		var c = r.insertCell(i);
		c.innerHTML = '&nbsp;';
		c.className = "cellGrid" + this.sUID ;
    }
    
//	if ( this.Expandable == 'TRUE') {
//		this.addExpander(r);
//	}
	
	this.styleRows();
	this.onrowadd.fire(r.rowIndex);
    return r;
}

SLXDataGrid.prototype.deleteSelectedRow = function() {
	if (!this.selRow) {
		return;
	} else {
		var delRow = this.selRow;
		this.selRow = null;
		this.selectedIndex = -1;
		this.gridElement.deleteRow(delRow);
		this.styleRows();
		this.onrowdelete.fire(delRow);
	}
}

// column resizing functions

SLXDataGrid.prototype.isHot = function(ev) {
    var evt = window.event || ev;
    var browserOffset = 0;
       
	if (this.oResizeEl) {
	    var w;
	    if (document.getBoxObjectFor) {
	       browserOffset = 1;
		   w = this.oOrigBox.x;   
		}  
		else
		   w = this.oOrigBox.right - this.oOrigBox.left;
		    
		w = w + (evt.clientX - this.iDown);
		var n = this.oResizeEl.cellIndex - browserOffset;
		this.resizeColTo(n,w)
		if (window.event)
		    window.event.cancelBubble = true;
		return false;
	} else {
	    var el = ev.target || window.event.srcElement;
		if (el.tagName != 'TD' && el.tagName != 'TH') {
			el = el.parentNode;
		}
		if (el.tagName == 'NOBR') {
			el = el.parentNode;
		}
		var rect;
		if (document.getBoxObjectFor) { 
            rect = document.getBoxObjectFor(el); 
        }
        else if (el.getBoundingClientRect) {
		    rect = el.getBoundingClientRect();
		}
				
		var eventX = evt.x || evt.layerX;
		var rectRight = rect.right || rect.x;
						
		if (eventX >= (rectRight - 7) && (eventX <= rectRight)) {
			el.style.cursor = this.mvCursor;
			return true;
		} else {
			el.style.cursor = 'pointer';
			return false;
		}
	}
}

SLXDataGrid.prototype.startResize = function(ev) {
	if (this.isHot(ev)) {
		var el = ev.target || window.event.srcElement;
		if (el.tagName != 'TD' && el.tagName != 'TH') {
			el = el.parentNode;
		}
		if (el.tagName == 'NOBR') {
			el = el.parentNode;
		}
		this.oResizeEl = el;
		if (document.getBoxObjectFor) {
		    this.oOrigBox = document.getBoxObjectFor(el);
		} else {
		    this.oOrigBox = this.oResizeEl.getBoundingClientRect();
		}
		
		var evt = window.event || ev;
		this.iDown = evt.clientX;
//		if (this.oResizeEl.setCapture)
//		    this.oResizeEl.setCapture();
	} else {
		this.oResortEl = ev.target || window.event.srcElement;
	}
}

SLXDataGrid.prototype.endResize = function(ev) {
	if (this.oResizeEl) {
	    var w;
	    if (document.getBoxObjectFor)
		   w = this.oOrigBox.x; 
		else  
		   w = this.oOrigBox.right - this.oOrigBox.left;
		   
		var n = this.oResizeEl.cellIndex - this.iColOffset;
		
		var evt = window.event || ev;
		w = w + (evt.clientX - this.iDown);
		this.oResizeEl.style.cursor = 'pointer';
		this.resizeColTo(n,w)
		this.oOrigBox = null;
		this.iDown = null;
//		if (this.oResizeEl.releaseCapture)
//		    this.oResizeEl.releaseCapture();
		this.oResizeEl = null;
	} else {

	}
	//persistWidths();
}

SLXDataGrid.prototype.resizeColTo = function(iNum,iWidth) {
	if (isNaN(iNum) || iNum < 0 ) {
		return;
	}
	if (isNaN(iWidth)) { return }
	if (iWidth < 15) { iWidth = 15; }
	if (this.gridElement.rows[0].cells[(iNum + this.iColOffset)]) {
		this.gridElement.rows[0].cells[(iNum + this.iColOffset)].style.width = iWidth + 'px';
	}
}

/////////////////////////////////////////////////////////////////////////////
// http://ajax.asp.net/docs/ClientReference/Sys/ApplicationClass/SysApplicationNotifyScriptLoadedMethod.aspx
/////////////////////////////////////////////////////////////////////////////
if (typeof(Sys) !== 'undefined') { Sys.Application.notifyScriptLoaded(); }
/*
    --------------------------------------------------------
    DO NOT PUT SCRIPT BELOW THE CALL TO notifyScriptLoaded()
    --------------------------------------------------------
*/