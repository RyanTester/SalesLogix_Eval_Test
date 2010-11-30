function OwnerControl(options) {
    options = options || {};
    this._dialog = null;
    this._options = options;    
    this._clientId = options.clientId;
    this._textClientId = options.textClientId;
    this._valueClientId = options.valueClientId;
    this._autoPostBack = options.autoPostBack; 
    this._identifyNodes = true;   
    this._result = false;
    this._typeAheadText = false;
    this._typeAheadTimeout = false;
    this._helpLink = options.helpLink;
        
    OwnerControl.__instances[this._clientId] = this;
    OwnerControl.__initRequestManagerEvents();
    
    this.addEvents(
        'open',
        'close',
        'change'
    );  
};

Ext.extend(OwnerControl, Ext.util.Observable);

OwnerControl.__instances = {};
OwnerControl.__requestManagerEventsInitialized = false;
OwnerControl.__initRequestManagerEvents = function() {
    if (OwnerControl.__requestManagerEventsInitialized)
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
        if (panels)
        {            
            for (var i = 0; i < panels.length; i++)
            {
                for (var id in OwnerControl.__instances)
                    if (contains(panels[i], document.getElementById(id))) 
                    {
                        var instance = OwnerControl.__instances[id];   
                        instance.initContext();                                             
                    }                        
            }            
        }
    }); 
     
    OwnerControl.__requestManagerEventsInitialized = true; 
};

OwnerControl.prototype.init = function() {
    this.initContext();
};

OwnerControl.prototype.initContext = function() {
    this._context = document.getElementById(this._clientId);
};

OwnerControl.prototype.identifyNode = function(node) {
    if (!this._identifyNodes || node._wasIdentified)
        return;
    
    for (var i = 0; i < node.childNodes.length; i++)
    {
        var child = node.childNodes[i];
        var el = child.getUI().getAnchor();
        $(el).attr("id", (this._clientId + "_" + child.id));
    }
    
    node._wasIdentified = true;
};

OwnerControl.prototype.createDialog = function() {
    var self = this;
    var root = new Ext.tree.AsyncTreeNode({
        text: "Root",
        id: "root",
        expanded: true,
        listeners: { "expand": function(node) { self.identifyNode(node); } },
        children: [{
            id: "user",
            text: OwnerControlResources.OwnerControl_OwnerType_User,
            cls: "owner-type-user-container",
            singleClickExpand: true,
            expanded: false,
            listeners: { "expand": function(node) { self.identifyNode(node); } }
        },{
            id: "team",
            text: OwnerControlResources.OwnerControl_OwnerType_Team,
            cls: "owner-type-team-container",
            singleClickExpand: true,
            listeners: { "expand": function(node) { self.identifyNode(node); } }
        },{
            id: "system",
            text: OwnerControlResources.OwnerControl_OwnerType_System,
            cls: "owner-type-system-container",
            singleClickExpand: true,
            listeners: { "expand": function(node) { self.identifyNode(node); } }
        }]        
    });
    var loader = new Ext.tree.TreeLoader({
        url: "slxdata.ashx/slx/crm/-/owners/{0}",        
        requestMethod: "GET"        
    });    
    loader.on("beforeload", function(treeLoader, node) {        
        treeLoader.formatUrl = treeLoader.formatUrl || treeLoader.url;
        treeLoader.url = String.format(treeLoader.formatUrl, node.id);    
    });        
    var tree = new Ext.tree.TreePanel({
        id: this._clientId + "_tree",
        root: root,
        rootVisible: false,
        containerScroll: true,
        autoScroll: true,
        animate: false,
        frame: false,
        stateful: false, 
        loader: loader,
        border: false
    });      
    var panel = new Ext.Panel({
        id: this._clientId + "_container",
        layout: "fit",
        border: false,
        stateful: false,
        items: tree
    });    
    var dialog = new Ext.Window({
        id: this._clientId + "_window",
        title: OwnerControlResources.OwnerControl_Header,
        cls: "lookup-dialog",
        layout: "border",            
        closeAction: "hide",
        plain: true,
        height: 400,
        width: 300,
        stateful: false,
        constrain: true,
        modal: true,                           
        items: [{
            region: "center",
            margins: "0 0 0 0",
            border: false,
            layout: "fit",
            id: this._clientId + "_layout_center",
            items: panel
        }],
        buttonAlign: "right",
        buttons: [{
            id: this._clientId + "_ok",
            text: GetResourceValue(OwnerControlResources.OwnerControl_Button_Ok, "OK"),
            handler: function() {
                var node = tree.getSelectionModel().getSelectedNode();
                if (!node || !node.isLeaf())   
                {
                    Ext.Msg.alert("", OwnerControlResources.SlxOwnerControl_OwnerType_NoRecordSelected); 
                    return;
                }
                
                self.close();
                self.setResult(node.id, node.text);                
            }         
        },{
            id: this._clientId + "_cancel",
            text: GetResourceValue(OwnerControlResources.OwnerControl_Button_Cancel, "Cancel"),
            handler: function() {
                self.close();        
            }
        }],
        tools: [{
            id: "help",
            handler: function(evt, toolEl, panel) {  
                if (self._helpLink && self._helpLink.url) 
                    window.open(self._helpLink.url, (self._helpLink.target || "help"));
            }
        }]
    });
    dialog.on("show", function(win) {   
        $(document).bind("keyup.OwnerControl", function(evt) {
            switch (evt.keyCode) {
                case 13: /* enter key */
                case 32: /* space bar */
                    var node = tree.getSelectionModel().getSelectedNode();
                    if (node && !node.isExpanded())
                        node.expand();                        
                    break;
            }    
        });              
        $(document).bind("keypress.OwnerControl", function(evt) {            
            var key = evt.charCode || evt.keyCode;
            var text = String.fromCharCode(key);
            
            if (self._typeAheadTimeout)
                clearTimeout(self._typeAheadTimeout);
                            
            self._typeAheadTimeout = setTimeout(function() {
                    self._typeAheadText = false;
                }, 1500);
                
            if (self._typeAheadText)
                self._typeAheadText = text = self._typeAheadText + text;      
            else
                self._typeAheadText = text;          
                                              
            //constrain the search to the current selected "sub-tree"
            //pass the root node to search if we want to search over everything
            var node = tree.getSelectionModel().getSelectedNode();
            if (node)
            {                            
                if (node.parentNode && (node.isLeaf() || !node.isExpanded()))                
                    node = node.parentNode;               
            }
            else
            {
                node = root;
            }
            
            var match = self.search(node, new RegExp("^" + text, "i"));
            if (match) 
            {
                match.select();
                return false;
            }
        });
        if (typeof idLookup != "undefined") idLookup("lookup-dialog");
    });
    dialog.on("hide", function(win) {
        $(document).unbind("keypress.OwnerControl");
        $(document).unbind("keyup.OwnerControl");
    });
    tree.on("dblclick", function(node, evt) {
        if (!node || !node.isLeaf())   
            return;
                
        self.close();
        self.setResult(node.id, node.text);
    });

    this._dialog = dialog;
    this._tree = tree;
};

OwnerControl.prototype.search = function(node, expr) {
    if (node)
    {
        if (node.id != "root" && expr.test(node.text))
            return node;
        
        if (node.isExpanded())
        {
            for (var i = 0; i < node.childNodes.length; i++)
            {                
                var child = node.childNodes[i];
                var match = false;
                if (child.isLeaf())
                {
                    if (expr.test(child.text))
                        return child;                     
                }
                else if ((match = this.search(child, expr)))
                    return match;
            }
        }
    }
    return false;
};

OwnerControl.prototype.show = function() {
    var self = this;
       
    if (!this._dialog)
         this.createDialog();            
   
    this._dialog.doLayout();
    this._dialog.show();    
    this._dialog.center();
    
    this.fireEvent('open', this);
};

OwnerControl.prototype.close = function() {
    if (this._dialog)
        this._dialog.hide();
};

OwnerControl.prototype.setResult = function(id, text) {
    this._result = {id: id, text: text}; 
    
    var textEl = $("#" + this._textClientId, this._context).get(0);
    var valueEl = $("#" + this._valueClientId, this._context).get(0);
       
    textEl.value = text;
    valueEl.value = id;
    
    this.invokeChangeEvent(textEl);
    this.fireEvent('change', this);
    
    if (this._autoPostBack)
        __doPostBack(this._clientId, '');
};

OwnerControl.prototype.invokeChangeEvent = function(el) {
    if (document.createEvent)
    {
        //FF
        var evt = document.createEvent('HTMLEvents'); 
        evt.initEvent ('change', true, true); 
        el.dispatchEvent(evt);
    }
    else
    {
        //IE
        el.fireEvent('onchange');
    }
};

function OwnerPanel(clientId, autoPostBack)
{
    this.ClientId = clientId;
    this.OwnerDivId = clientId + "_outerDiv";
    this.OwnerTypeId = clientId + "_OwnerType";
    this.OwnerTextId = clientId + "_LookupText";
    this.OwnerValueId = clientId + "_LookupResult";
    this.ResultDivId = clientId + "_Results";
    this.OwnerListId = clientId + "_OwnerList";
    this.AutoPostBack = autoPostBack;
    this.LookupValue = "";
    this.DisplayValue = "";
    this.onChange = new YAHOO.util.CustomEvent("change", this);
    this.panel = null;
}


function OwnerPanel_CanShow()
{
    var inPostBack = false;
    if (Sys)
    {
        var prm = Sys.WebForms.PageRequestManager.getInstance();
        inPostBack = prm.get_isInAsyncPostBack();
    }
    if (!inPostBack)
    {
        return true;
    }
    else
    {
        var id = this.ClientId + "_obj";
        var handler = function() 
        {
            window[id].Show('');
        }
        Sage.SyncExec.call(handler);
        return false;
    }
}

function OwnerPanel_Show()
{
    if (this.CanShow())
    {
        if ((this.panel == null) || (this.panel.element.parentNode == null))
        {
            var lookup = document.getElementById(this.OwnerDivId);
            lookup.style.display = "block";
            this.panel = new YAHOO.widget.Panel(this.OwnerDivId, { visible:false, width:"305px", /*x:250, y:200,*/ fixedcenter:true, constraintoviewport:true, underlay:"shadow", draggable:true, modal:false });
            this.panel.render();
        }
        this.panel.show();
        var ownerType = document.getElementById(this.OwnerTypeId);
        var list = document.getElementById(this.OwnerListId);
        if (list.options.length < 1)
        {
            var type = ownerType.selectedIndex;
            if (type == -1) { type = 0; }
            var vURL = "SLXOwnerListHandler.aspx?ownertype=" + type;
            if (typeof(xmlhttp) == "undefined") {
                xmlhttp = YAHOO.util.Connect.createXhrObject().conn;
            }
            xmlhttp.open("GET", vURL, false);
            xmlhttp.send(null);
          
            var results = xmlhttp.responseText;
            var items = results.split("|");
            for (var i=0; i<items.length; i++)
            {
                if (items[i] == "") continue;
                var parts = items[i].split("*");
                var oOption = document.createElement("OPTION");
                list.options.add(oOption);
                if (parts[0].charAt(0) == '@')
                {
                    parts[0] = parts[0].substr(1);
                    oOption.selected = true;
                }
                oOption.innerHTML = parts[1];
                oOption.value = parts[0];
            }
        }
    }
}

function OwnerPanel_PerformLookup()
{
    var ownerType = document.getElementById(this.OwnerTypeId);
    var list = document.getElementById(this.OwnerListId);
    for (var i = list.options.length -1; i >= 0; i--)
    {
        list.options[i] = null;
    }
    var type = ownerType.selectedIndex;
    if (type == -1) { type = 0; }
    var vURL = "SLXOwnerListHandler.aspx?ownertype=" + type;
    if (typeof(xmlhttp) == "undefined") {
        xmlhttp = YAHOO.util.Connect.createXhrObject().conn;
    }
    xmlhttp.open("GET", vURL, false);
    xmlhttp.send(null);
      
    var results = xmlhttp.responseText;
    if (results == "NOTAUTHENTICATED")
    {
        window.location.reload(true);
        return;
    }
    var items = results.split("|");
    for (var i=0; i<items.length; i++)
    {
        if (items[i] == "") continue;
        var parts = items[i].split("*");
        var oOption = document.createElement("OPTION");
        list.options.add(oOption);
        if (parts[0].charAt(0) == '@')
        {
            parts[0] = parts[0].substr(1);
            oOption.selected = true;
        }
        oOption.innerHTML = parts[1];
        oOption.value = parts[0];
    }
}

function OwnerPanel_Close()
{
    this.panel.hide();
}

function OwnerPanel_Ok()
{
    this.panel.hide();
    var list = document.getElementById(this.OwnerListId);
    try
    {
        this.LookupValue = list.options[list.selectedIndex].value;
    }
    catch (e)
    {
        Ext.Msg.alert("", OwnerControlResources.SlxOwnerControl_OwnerType_NoRecordSelected);           
        return false;
    }
    
    this.DisplayValue = list.options[list.selectedIndex].innerHTML;
    var ownerText = document.getElementById(this.OwnerTextId);
    var ownerValue = document.getElementById(this.OwnerValueId);
    ownerText.value = this.DisplayValue;
    ownerValue.value = this.LookupValue;
    this.onChange.fire(this);
    this.InvokeChangeEvent(ownerText);
    if (this.AutoPostBack)
    {
        if (Sys)
        {
            Sys.WebForms.PageRequestManager.getInstance()._doPostBack(this.ClientId, null);
        }
        else
        {
            document.forms(0).submit();
        }
    }
}

function OwnerPanel_getVal()
{
    return this.LookupValue;
    
}

function OwnerPanel_setVal(key, display)
{
    this.LookupValue = key;
    this.DisplayValue = display;
    var lookupText = document.getElementById(this.LookupTextId);
    lookupText.value = this.DisplayValue;
}

function OwnerPanel_GetOwnerTypeParam()
{
    var ownerType = document.getElementById(this.OwnerTypeId);
    var arg = -1;
    if(ownerType.options.length > 0)
    {
        arg = ownerType.selectedIndex;
    }
    return arg;
}

function OwnerPanel_InvokeChangeEvent(cntrl)
{
    if (document.createEvent)
    {
        //FireFox
        var evObj = document.createEvent('HTMLEvents'); 
        evObj.initEvent ('change', true, true); 
        cntrl.dispatchEvent(evObj);
    }
    else
    {
        //IE
        cntrl.fireEvent('onchange');
    }
}

OwnerPanel.prototype.CanShow = OwnerPanel_CanShow;
OwnerPanel.prototype.Show = OwnerPanel_Show;
OwnerPanel.prototype.Close = OwnerPanel_Close;
OwnerPanel.prototype.PerformLookup = OwnerPanel_PerformLookup;
OwnerPanel.prototype.GetOwnerTypeParam = OwnerPanel_GetOwnerTypeParam;
OwnerPanel.prototype.Ok = OwnerPanel_Ok;
OwnerPanel.prototype.getVal = OwnerPanel_getVal;
OwnerPanel.prototype.setVal = OwnerPanel_setVal;
OwnerPanel.prototype.InvokeChangeEvent = OwnerPanel_InvokeChangeEvent;