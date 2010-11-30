Type.registerNamespace('SageControls');

SageControls.UpdateProgressOverlayBehavior = function (element) {
    SageControls.UpdateProgressOverlayBehavior.initializeBase(this, [element]);

    //Properties    
    this._timerID = null;
    
    //Handlers
    this._pageRequestManager = null;
    this._showDelegate = null;
    this._pageBeginRequestHandler = null;
    this._pageEndRequestHandler = null;
    this._windowResizeHandler = null;
    this._isActive = false;
    
}

SageControls.UpdateProgressOverlayBehavior.prototype = {
    initialize : function() {
        SageControls.UpdateProgressOverlayBehavior.callBaseMethod(this, 'initialize');
        this._pageRequestManager = Sys.WebForms.PageRequestManager.getInstance();
        this._pageBeginRequestHandler = Function.createDelegate(this, this._onBeginRequest);
        this._pageEndRequestHandler = Function.createDelegate(this, this._onEndRequest);
        this._showDelegate = Function.createDelegate(this, this._onShow);
        if (this._pageRequestManager != null) {
            this._pageRequestManager.add_beginRequest(this._pageBeginRequestHandler);
            this._pageRequestManager.add_endRequest(this._pageEndRequestHandler);
        }
        this._windowResizeHandler = Function.createDelegate(this, this._onWindowResize);
        $addHandler(window, 'resize', this._windowResizeHandler);
        
    },
    dispose : function() {
        if (this._pageRequestManager) {
            if (this._pageBeginRequestHandler) {
                this._pageRequestManager.remove_beginRequest(this._onBeginRequest);
                this._pageEndRequestHandler = null;
            }
            if (this._pageEndRequestHandler) {
                this._pageRequestManager.remove_endRequest(this._onEndRequest);
                this._pageEndRequestHandler = null;
            }
            this._pageRequestManager = null;
        }
        
        if (this._windowResizeHandler) {
            $removeHandler(window, 'resize', this._windowResizeHandler);            
            this._windowResizeHandler = null;
        }
        
        SageControls.UpdateProgressOverlayBehavior.callBaseMethod(this, 'dispose');
    },
    //
    // Handlers
    //
    _onBeginRequest : function(sender, arg) {
        var elt = arg.get_postBackElement();
        var startTimer = (this._associatedUpdatePanelId)? false : true;
        while (!startTimer && postbackElt) {
            if (elt.id && this._associatedUpdatePanelId === curElem.id) {
                startTimer = true; 
            }
            elt = elt.parentNode; 
        } 
        if (startTimer) {
            this._timerID = window.setTimeout(this._showDelegate, this._displayAfter);
        }    
    },
    _onEndRequest : function(sender, arg) {
        var elt = this.get_element();
        if (!elt) {
            return;
        }
        
        var iframe = elt.iframeOverlay;
        if (iframe) {
            iframe.style.display = 'none';
        }
        if (this._timerID) {
            window.clearTimeout(this._timerID);
            this._timerID = null;
        }
        this._isActive = false;
    },
    _onWindowResize : function() {
        if (this._isActive) {
            this._onShow();
        }
    },
    //
    // Private methods
    //
    _onShow : function() {
        
        var controlToOverlay
        if (this._controlToOverlayID) {
            controlToOverlay = $get(this._controlToOverlayID);
            if (!controlToOverlay) {
                return;
            }
        }
        
        this._isActive = true;
        var iframe = (this._iframeRequired()) ? this._initializeIframe() : null;
        var elt = this.get_element(); 
        elt.style.zIndex = 100000;
        elt.style.position = 'absolute';
        Sys.UI.DomElement.addCssClass(elt, this._targetCssClass);
        

        var bounds = (this._controlToOverlayID) ? 
            Sys.UI.DomElement.getBounds(controlToOverlay) : this._getBrowserInnerBounds();

        
        elt.style.width = bounds.width + 'px';
        elt.style.height = bounds.height + 'px';
        Sys.UI.DomElement.setLocation(elt, bounds.x, bounds.y);
        
        if (iframe) {
            iframe.style.width = bounds.width + 'px';
            iframe.style.height = bounds.height + 'px';
            iframe.style.display = 'block';
            Sys.UI.DomElement.setLocation(iframe, bounds.x, bounds.y);
        }
    },
    _iframeRequired : function() {
        return ((Sys.Browser.agent === Sys.Browser.InternetExplorer) && (Sys.Browser.version < 7));
    },
    _initializeIframe : function() {
        var elt = this.get_element();
        if ((elt) && (!elt.iframeOverlay)) {
            var iframeOverlay = document.createElement('iframe');
            iframeOverlay.style.zIndex = 99999;
            iframeOverlay.src = 'javascript:false';
            iframeOverlay.style.position = 'absolute';
            iframeOverlay.style.margin = '0px';
            iframeOverlay.style.padding = '0px';
            iframeOverlay.style.opacity = 0;
            iframeOverlay.style.MozOpacity = 0;
            iframeOverlay.style.KhtmlOpacity = 0;
            iframeOverlay.style.filter = 'alpha(opacity=0)';
            iframeOverlay.style.border = 'none';
            
            elt.parentNode.insertBefore(iframeOverlay, elt);
            elt.iframeOverlay = iframeOverlay;
        }
        return elt.iframeOverlay;
    },
    _getBrowserInnerBounds : function() {
        var height = self.innerHeight;
        var width = self.innerWidth;
        var compatMode = document.compatMode;

        if (!width) {
            width = (compatMode == 'CSS1Compat') ? 
        	    document.documentElement.clientWidth : document.body.clientWidth;
        }

	    if (!height) {
		    height = (compatMode == 'CSS1Compat') ? 
			    document.documentElement.clientHeight : document.body.clientHeight;
	    }
    		
        return new Sys.UI.Bounds(0, 0, width, height);
    },
    //
    // Properties
    //
    get_controlToOverlayID : function() {
        return this._controlToOverlayID;
    },
    set_controlToOverlayID : function(value) {
        this._controlToOverlayID = value;
    },
    
    get_targetCssClass : function() {
        return this._targetCssClass;
    },
    set_targetCssClass : function(value) {
        this._targetCssClass = value;
    },
    
    get_displayAfter : function() {
        return this._displayAfter;
    },
    set_displayAfter : function(value) {
        this._displayAfter = value;
    },
    
    get_associatedUpdatePanelID : function() {
        return this._associatedUpdatePanelID;
    },
    set_associatedUpdatePanelID : function(value) {
        this._associatedUpdatePanelID = value;
    }  
}

SageControls.UpdateProgressOverlayBehavior.registerClass('SageControls.UpdateProgressOverlayBehavior', Sys.UI.Behavior);