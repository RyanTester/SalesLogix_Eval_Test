Sage.ContentPane = function(toggleBtn, contentArea, attr) {
	this.contentArea = contentArea;
	this.toggleButton = toggleBtn;
	this.state = "open";
	this.minImg = attr.minImg;
	this.maxImg = attr.maxImg
	this.minText = attr.minText;
	this.maxText = attr.maxText;
	var elem = YAHOO.util.Dom.get(toggleBtn);
	YAHOO.util.Event.removeListener(toggleBtn, 'click');
	YAHOO.util.Event.addListener(toggleBtn, 'click', this.toggle, this, true);
	YAHOO.util.Dom.setStyle(toggleBtn, "cursor", "pointer");
		
	if (typeof(cookie) != "undefined") {
		var st = cookie.getCookieParm(this.contentArea, "MainContentState");
		if (st) {
			if (st == "closed") {
				this.close();
			}
		}
	}
}

Sage.ContentPane.prototype.setState = function(state) {
	this.state = state;
	if (typeof(cookie) != "undefined") {
		cookie.setCookieParm(this.state, this.contentArea, "MainContentState");
	}
}

Sage.ContentPane.prototype.toggle = function() {
	if (this.state == "open") {
		this.close();
	} else {
		this.open();
	}
}

Sage.ContentPane.prototype.close = function() {
    /*
    YAHOO.util.Dom.setStyle(this.contentArea, "overflow", "hidden");	
	var attr = { height : { to : 0 }	}
	var anim = new YAHOO.util.Anim(this.contentArea, attr, 0.25);
	anim.animate();
	this.setState("closed");
	var elem = document.getElementById(this.toggleButton);
	if (elem) {
		elem.src = this.maxImg;
		elem.alt = this.maxText;
	}
	*/
	YAHOO.util.Dom.setStyle(this.contentArea + "_inner", "display", "none");
	this.setState("closed");
	var elem = document.getElementById(this.toggleButton);
	if (elem) {
		elem.src = this.maxImg;
		elem.alt = this.maxText;
	}
}

Sage.ContentPane.prototype.open = function() {
    /*
    YAHOO.util.Dom.setStyle(this.contentArea, "overflow", "visible");
	var attr = { height : { to : 100, unit : "%" } }
	var anim = new YAHOO.util.Anim(this.contentArea, attr, 0.25);
	anim.animate();
	this.setState("open");
	var elem = document.getElementById(this.toggleButton);
	if (elem) {
		elem.src = this.minImg;
		elem.alt = this.minText;
	}
	*/
	YAHOO.util.Dom.setStyle(this.contentArea + "_inner", "display", "block");
	this.setState("open");
	var elem = document.getElementById(this.toggleButton);
	if (elem) {
		elem.src = this.minImg;
		elem.alt = this.minText;
	}
}

Sage.ContentPaneAttr = function() {
	this.minImg = "";
	this.maxImg = "";
	this.minText = "";
	this.maxText = "";
}
