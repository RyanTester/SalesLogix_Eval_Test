
Ext.ux.Portal = Ext.extend(Ext.Panel, {
    layout: 'column',
    autoScroll:true,
    cls:'x-portal',
    defaultType: 'portalcolumn',

    initComponent : function(){
        Ext.ux.Portal.superclass.initComponent.call(this);
        this.addEvents({
            validatedrop:true,
            beforedragover:true,
            dragover:true,
            beforedrop:true,
            drop:true
        });
    },

    initEvents : function(){
        Ext.ux.Portal.superclass.initEvents.call(this);
        this.dd = new Ext.ux.Portal.DropZone(this, this.dropConfig);
    }
});
Ext.reg('portal', Ext.ux.Portal);


Ext.ux.Portal.DropZone = function(portal, cfg){
    this.portal = portal;
    Ext.dd.ScrollManager.register(portal.body);
    Ext.ux.Portal.DropZone.superclass.constructor.call(this, portal.bwrap.dom, cfg);
    portal.body.ddScrollConfig = this.ddScrollConfig;
};

Ext.extend(Ext.ux.Portal.DropZone, Ext.dd.DropTarget, {
    ddScrollConfig : {
        vthresh: 50,
        hthresh: -1,
        animate: true,
        increment: 200
    },

    createEvent : function(dd, e, data, col, c, pos){
        return {
            portal: this.portal,
            panel: data.panel,
            columnIndex: col,
            column: c,
            position: pos,
            data: data,
            source: dd,
            rawEvent: e,
            status: this.dropAllowed
        };
    },

    notifyOver : function(dd, e, data){
        var xy = e.getXY(), portal = this.portal, px = dd.proxy;

        // case column widths
        if(!this.grid){
            this.grid = this.getGrid();
        }

        // handle case scroll where scrollbars appear during drag
        var cw = portal.body.dom.clientWidth;
        if(!this.lastCW){
            this.lastCW = cw;
        }else if(this.lastCW != cw){
            this.lastCW = cw;
            portal.doLayout();
            this.grid = this.getGrid();
        }

        // determine column
        var col = 0, xs = this.grid.columnX, cmatch = false;
        for(var len = xs.length; col < len; col++){
            if(xy[0] < (xs[col].x + xs[col].w)){
                cmatch = true;
                break;
            }
        }
        // no match, fix last index
        if(!cmatch){
            col--;
        }

        // find insert position
        var p, match = false, pos = 0,
            c = portal.items.itemAt(col),
            items = c.items.items;

        for(var len = items.length; pos < len; pos++){
            p = items[pos];
            var h = p.el.getHeight();
            if(h !== 0 && (p.el.getY()+(h/2)) > xy[1]){
                match = true;
                break;
            }
        }

        var overEvent = this.createEvent(dd, e, data, col, c,
                match && p ? pos : c.items.getCount());

        if(portal.fireEvent('validatedrop', overEvent) !== false &&
           portal.fireEvent('beforedragover', overEvent) !== false){

            // make sure proxy width is fluid
            px.getProxy().setWidth('auto');

            if(p){
                px.moveProxy(p.el.dom.parentNode, match ? p.el.dom : null);
            }else{
                px.moveProxy(c.el.dom, null);
            }

            this.lastPos = {c: c, col: col, p: match && p ? pos : false};
            this.scrollPos = portal.body.getScroll();

            portal.fireEvent('dragover', overEvent);

            return overEvent.status;;
        }else{
            return overEvent.status;
        }

    },

    notifyOut : function(){
        delete this.grid;
    },

    notifyDrop : function(dd, e, data){
        delete this.grid;
        if(!this.lastPos){
            return;
        }
        var c = this.lastPos.c, col = this.lastPos.col, pos = this.lastPos.p;

        var dropEvent = this.createEvent(dd, e, data, col, c,
                pos !== false ? pos : c.items.getCount());

        if(this.portal.fireEvent('validatedrop', dropEvent) !== false &&
           this.portal.fireEvent('beforedrop', dropEvent) !== false){

            dd.proxy.getProxy().remove();
            dd.panel.el.dom.parentNode.removeChild(dd.panel.el.dom);
            if(pos !== false){
                c.insert(pos, dd.panel);
            }else{
                c.add(dd.panel);
            }
            
            c.doLayout();

            this.portal.fireEvent('drop', dropEvent);

            // scroll position is lost on drop, fix it
            var st = this.scrollPos.top;
            if(st){
                var d = this.portal.body.dom;
                setTimeout(function(){
                    d.scrollTop = st;
                }, 10);
            }

        }
        delete this.lastPos;
        slxDashboard.saveState();
    },

    // internal cache of body and column coords
    getGrid : function(){
        var box = this.portal.bwrap.getBox();
        box.columnX = [];
        this.portal.items.each(function(c){
             box.columnX.push({x: c.el.getX(), w: c.el.getWidth()});
        });
        return box;
    }
});

Ext.ux.PortalColumn = Ext.extend(Ext.Container, {
    layout: 'anchor',
    autoEl: 'div',
    defaultType: 'portlet',
    cls:'x-portal-column'
});
Ext.reg('portalcolumn', Ext.ux.PortalColumn);

Ext.ux.Portlet = Ext.extend(Ext.Panel, {
    anchor: '100%',
    frame:true,
    collapsible:true,
    draggable:true,
    cls:'x-portlet'
});
Ext.reg('portlet', Ext.ux.Portlet);

//Ext.onReady(function() {
function setupPortal() {    
    Ext.get("MainWorkArea").setStyle("display", "none");

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "UIStateService.asmx/GetUIState",
        data: Ext.util.JSON.encode({
            section: "Dashboard",
            key: "PortalConfig_" + document.forms[0].action.substring(document.forms[0].action.lastIndexOf('/') + 1)
        }),
        dataType: "json",
        error: function (request, status, error) { 
            window.setTimeout(function() { doSetupPortal() }, 100);           
        },
        success: function(data, status) {  
            var resoptions;
            if (data && data.d) resoptions = Ext.util.JSON.decode(data.d);
            
            try 
            {                
                if (resoptions && !isNaN(resoptions.defportal)) 
                    userDashboardOptions = resoptions;                
            } 
            catch (ex) { }
            
            window.setTimeout(function() { doSetupPortal() }, 100);
        }
    }); 

    Ext.QuickTips.init();
};

function doSetupPortal() {
    for (var i = 0; i < userDashboardOptions.items.length; i++) {
        if (userDashboardOptions.items[i].name == 'My Workspace') {
            userDashboardOptions.items[i].name = DashboardResource.My_Workspace;
        }
    }
    slxDashboard = new Sage.SalesLogix.Dashboard(userDashboardOptions);
    slxDashboard.init();
}

function refreshPortletData(name) {
    var code = String.format("if (typeof {0} != 'undefined') {0}();", name + "_refresh");
    eval(code);
}


if (typeof Sys !== "undefined")
{
    Type.registerNamespace("Sage.SalesLogix");
}
else
{
    Ext.namespace("Sage.SalesLogix");
}


Sage.SalesLogix.Dashboard = function(options) {
    this._options = options;
    this._removed = {};
}

Sage.SalesLogix.Dashboard.prototype.createColumnObject = function(width) {
    return { columnWidth: width,
             style:'padding:10px 0px 10px 10px',
             items:[]};
}

Sage.SalesLogix.Dashboard.prototype.createTitle = function(name, number) {
    return String.format("{0} <img src='{1}' id='{3}' onclick='slxDashboard.createTabContextMenu({2}).show(Ext.get(\"{3}\"));'/>", 
        name, "images/expanddark.gif", number, "tab_icon_"+number);
}

Sage.SalesLogix.Dashboard.prototype.createCellObject = function(name, portalNum, column) {
    var curDashboard = this;
    return { 
        id : [name].join() + "_display", //add display or dup div ids that confuse the code later
        stateful: false,
        title: Ext.get(name).dom.title,
        tools: [
            {id: 'refresh',
            handler: function(e, target, panel) {
                    refreshPortletData(name);
                },
            qtip: DashboardResource.Refresh
            },
            {id: 'close',
            qtip: DashboardResource.Close,
            handler: function(e, target, panel){
                curDashboard._removed[panel.contentEl] = panel;
                
                panel.ownerCt.remove(panel, false);
                panel.hide();
                
                var cells = curDashboard._options.items[panel.location.dashboard].cells;
                for (var i=0; i < cells.length; i++) 
                    cells[i].remove(panel.location.cellitem);                
                
                /*
                panel.ownerCt.remove(panel, true);
                var cells = curDashboard._options.items[panel.location.dashboard].cells;
                for (var i=0; i<cells.length; i++) {
                    cells[i].remove(panel.location.cellitem);
                }
                */
                curDashboard.saveState();
            }}
        ],
        collapsible: false,
        style:'padding:0px 0px 10px 0px', 
        location: { dashboard: portalNum, cellitem: name},
        html: Ext.get(name+"contents").dom.innerHTML //if we don't copy the html then we can't revert
    };
}

Sage.SalesLogix.Dashboard.prototype.init = function() {
    var portals = new Array();
    for (var k=0; k<this._options.items.length; k++) {
        var dashboardPortal = { xtype:'portal', 
            region:'center', 
            margins:'35 5 5 0', 
            border: false, 
            visible: true, 
            id: "portal_panel_"+k, 
            items:[], 
            title: this.createTitle(this._options.items[k].name, k)
        };
        for (var i=0; i<this._options.items[k].layout.length; i++) {
            dashboardPortal.items.push(this.createColumnObject(this._options.items[k].layout[i]));
            for (var j=0; j<this._options.items[k].cells[i].length; j++) {
                if (Ext.get(this._options.items[k].cells[i][j]) != null) {
                    dashboardPortal.items[i].items.push(this.createCellObject(this._options.items[k].cells[i][j], k, i));
                    var code = String.format("if (typeof {0} != 'undefined') {0}();", this._options.items[k].cells[i][j] + "_refresh");
                    eval(code);
                }
            }
        }
        portals.push(dashboardPortal);
    }
    var curDashboard = this;
    var centerpanel = mainViewport.findById("center_panel_center");
    var panel = this._tabPanel = new Ext.TabPanel({
        border: false, 
        enableTabScroll: true, 
        id: "dashboard_panel"
    });
    var hiddenPanels = new Array();
    for (var i=0; i<portals.length;i++) {
        var thisportal = panel.add(portals[i]);
        thisportal.on("drop", function (args) {
            var portalNum = args.portal.id.match(/\d+$/);
            var smartpart = args.panel.location.cellitem;
            var cells = curDashboard._options.items[portalNum].cells;
            for (var i=0; i<cells.length; i++) {
                cells[i].remove(smartpart);
            }
            cells[args.columnIndex].splice(args.position, 0, smartpart);
        });
        if (curDashboard._options.items[i].isHidden) {
            hiddenPanels.push(thisportal.id);
        }
    }
    panel.on("contextmenu", function (tabpanel, tab, e){
        var portalNum = parseInt(tab.id.match(/\d+$/), 10);
        curDashboard.createTabContextMenu(portalNum).showAt(e.getXY());
    });
    centerpanel.add(panel);
    mainViewport.doLayout();
    panel.activate("portal_panel_"+this._options.defportal);
    for (var i=0; i<hiddenPanels.length; i++) {
        panel.hideTabStripItem(hiddenPanels[i]);
    }
    panel.doLayout();
    if (typeof idRefreshAndCloseButtons != "undefined") {
        idRefreshAndCloseButtons();
    }
}

Sage.SalesLogix.Dashboard.prototype.getAvailableContent = function(portalNum) {
    var used = {};
    //for (var i = 0; i < dashboardAvailableContent.length; i++)
    //    used[dashboardAvailableContent[i]] = false;
        
    for (var i = 0; i < this._options.items.length; i++) /* each portal */
        for (var j = 0; j < this._options.items[i].cells.length; j++) /* each column */
            for (var k = 0; k < this._options.items[i].cells[j].length; k++) /* each cell */
                used[this._options.items[i].cells[j][k]] = true;
    
    var result = [];            
    for (var i = 0; i < dashboardAvailableContent.length; i++)
        if (used[dashboardAvailableContent[i]] !== true)
            result.push(dashboardAvailableContent[i]);
            
    return result;
        
    /*
    var res = new Array();
    for (var i=0; i<dashboardAvailableContent.length; i++) {
        var val = dashboardAvailableContent[i];
        var alreadyAdded = false;
        var cells = this._options.items[portalNum].cells;
        for (var j=0; j<cells.length;j++) {
            for (var k=0; k<cells[j].length;k++) {
                if (cells[j][k] == val) {
                    alreadyAdded = true;
                    break;
                }
            }
            if (alreadyAdded) break;
        }
        if ((!alreadyAdded) && (Ext.get(val).dom.title != "")) res.push(val);
    }
    return res;
    */
}

Sage.SalesLogix.Dashboard.prototype.createTabContextMenu = function(portalNum) {
    var curDashboard = this;
    var origOptions = Sys.Serialization.JavaScriptSerializer.deserialize(
        Sys.Serialization.JavaScriptSerializer.serialize(this._options));
    var tcmenu = new Ext.menu.Menu({ items: [
        new Ext.menu.Item({ 
            text: DashboardResource.Add_Tab,
            icon: false,
            handler: function() {
                Ext.Msg.prompt(DashboardResource.Name, String.format('{0}:', DashboardResource.Name), function(btn, text){
                    if (btn == 'ok'){
                        curDashboard.newPortal(text);
                    }
                });                    
            }
        }),
        new Ext.menu.Item({ text: DashboardResource.Add_Content, handler: function() {
            var win = new Ext.Window({ title: DashboardResource.Add_New_Content,
                width: parseInt(DashboardResource.Popup_Width),
                height: parseInt(DashboardResource.Popup_Height),
                autoScroll: true,
                buttons: [{ text: DashboardResource.Ok, handler: function(t, e) { curDashboard.saveState(); t.ownerCt.close(); } }
                    , { text: DashboardResource.Cancel, handler: function(t, e) {
                        Ext.destroy(slxDashboard);
                        slxDashboard = new Sage.SalesLogix.Dashboard(origOptions);
                        slxDashboard.init();
                        t.ownerCt.close();
                    } 
                    }
                ]
            });
            var content = curDashboard.getAvailableContent(portalNum);
            if (content.length == 0) {
                win.add(new Ext.Panel({ html: String.format("<p>{0}</p>", DashboardResource.NoUnusedContent) }));
            }
            for (var i = 0; i < content.length; i++) {
                win.add(new Ext.form.Checkbox({ boxLabel: Ext.get(content[i]).dom.title,
                    contentId: content[i]
                })).on("check", function(t, checked) {
                    if (checked) {
                        var cell = curDashboard._removed[t.contentId];
                        if (cell) 
                        {
                            cell.location.dashboar = portalNum;
                            delete curDashboard._removed[t.contentId];  
                        }
                        else
                        {
                            cell = curDashboard.createCellObject(t.contentId, portalNum, 0);
                        }
                        
                        mainViewport.findById("portal_panel_" + portalNum).items.items[0].add(cell);
                                                    
                        /*
                        mainViewport.findById("portal_panel_" + portalNum).items.items[0].add(
                                curDashboard.createCellObject(t.contentId, portalNum, 0));
                        */
                        mainViewport.findById("center_panel_center").doLayout();
                        curDashboard._options.items[portalNum].cells[0].push(t.contentId);
                        var code = String.format("if (typeof {0} != 'undefined') {0}();", t.contentId + "_refresh");
                        eval(code);
                        t.el.dom.disabled = true;
                        t.el.dom.parentNode.style.display = "none";
                        t.el.dom.parentNode.nextSibling.style.display = "none";
                    }
                });
                var desc = $("#" + content[i] + "contents .portlet_description");
                if (desc.length > 0) {
                    win.add(new Ext.form.Label({ html: desc[0].innerHTML, style: "margin: 3px 10px 15px;display: block" }));
                } else {
                    win.add(new Ext.form.Label({ html: "&nbsp;", style: "margin: 3px 10px 15px;display: block" }));
                }
            }
            if (typeof idPopupWindow != "undefined") {
                win.on("show", function() { idPopupWindow(); });
            }
            win.show();
        } 
        }),
        new Ext.menu.Item({ text: DashboardResource.Edit_Options, handler: function() {
            var opWin = new Ext.Window({ title: DashboardResource.Edit_Options,
                width: parseInt(DashboardResource.Popup_Width),
                height: parseInt(DashboardResource.Popup_Height),
                buttons:
                    [{ text: DashboardResource.Ok, handler: function(t, e) {
                        if ($("#PortalName")[0].value.length > 0) {
                            var newTitle = Ext.util.Format.htmlEncode($("#PortalName")[0].value);
                            curDashboard._options.items[portalNum].name = newTitle;
                            mainViewport.findById("portal_panel_" + portalNum).setTitle(curDashboard.createTitle(newTitle, portalNum));
                        }
                        curDashboard.saveState();
                        var dp = mainViewport.findById("dashboard_panel");
                        dp.setWidth(dp.getSize().width - 1); //firing resize without changing anything doesn't recalc
                        dp.setWidth(dp.getSize().width + 1);
                        t.ownerCt.close();
                    }
                    }
                    , { text: DashboardResource.Cancel, handler: function(t, e) {
                        Ext.destroy(slxDashboard);
                        slxDashboard = new Sage.SalesLogix.Dashboard(origOptions);
                        slxDashboard.init();
                        t.ownerCt.close();
                    }
                    }
                ]
            });
            opWin.add(new Ext.Panel({
                html: String.format("<div style='margin: 5px 1px'>{0}: <input type='text' id='PortalName' value='{1}' /></div>",
                    DashboardResource.Name, curDashboard._options.items[portalNum].name)
                , border: false
            }));
            //            opWin.add(new Ext.form.Checkbox({boxLabel: DashboardResource.MakeThisMyDefault, 
            //                        checked: (parseInt(curDashboard._options.defportal) == parseInt(portalNum))
            //                    })).on("check", function(t,checked){ 
            //                        if (checked) {
            //                            curDashboard._options.defportal = portalNum;
            //                        } 
            //                    });
            opWin.add(new Ext.Panel({
                html: String.format("<div style='margin: 5px 1px'>{0}:</div>", DashboardResource.ChooseTemplate)
                , border: false
            }));

            var layouts = [
               { name: DashboardResource.TwoColSplit, layout: [.5, .5], imgUrl: 'images/icons/2col.gif' },
               { name: DashboardResource.ThreeCol, layout: [.33, .33, .34], imgUrl: 'images/icons/3col.gif' },
               { name: DashboardResource.TwoColLeft, layout: [.66, .34], imgUrl: 'images/icons/2col_bigL.gif' },
               { name: DashboardResource.TwoColRight, layout: [.34, .66], imgUrl: 'images/icons/2col_bigR.gif' },
               { name: DashboardResource.OneCol, layout: [.99], imgUrl: 'images/icons/1col.gif' }
            ];
            for (var i = 0; i < layouts.length; i++) {
                opWin.add(new Ext.form.Radio({ boxLabel: String.format("<img src='{1}'> {0}", layouts[i].name, layouts[i].imgUrl),
                    name: "Layout",
                    id: String.format("layout_{0}_id", i),
                    layout: layouts[i].layout,
                    style: "margin: 5px 5px",
                    checked: (layouts[i].layout[0] == curDashboard._options.items[portalNum].layout[0])
                })).on("check", function(t, checked) {
                    if (checked) {
                        var curPortal = mainViewport.findById("portal_panel_" + portalNum).items;
                        curDashboard._options.items[portalNum].layout = t.layout;
                        while (curDashboard._options.items[portalNum].cells.length < t.layout.length) {
                            curDashboard._options.items[portalNum].cells.push(new Array());
                        }
                        while (curDashboard._options.items[portalNum].cells.length > t.layout.length) {
                            var removed = curDashboard._options.items[portalNum].cells.pop();
                            curDashboard._options.items[portalNum].cells[0] = curDashboard._options.items[portalNum].cells[0].concat(removed);
                            mainViewport.findById("portal_panel_" + portalNum).remove(curPortal.items[curPortal.items.length - 1]);
                            for (var j = 0; j < removed.length; j++) {
                                curPortal.items[0].add(curDashboard.createCellObject(removed[j], portalNum, 0));
                            }
                        }
                        for (var j = 0; j < t.layout.length; j++) {
                            if (curPortal.items.length > j) {
                                curPortal.items[j].columnWidth = t.layout[j];
                            } else {
                                mainViewport.findById("portal_panel_" + portalNum).add(curDashboard.createColumnObject(t.layout[j]));
                            }
                        }
                        mainViewport.findById("center_panel_center").doLayout(true);
                    }
                });
            }
            if (typeof idPopupWindow != "undefined") {
                opWin.on("show", function() { idPopupWindow(); });
            }
            opWin.show();
        } 
        }),
        //        new Ext.menu.Item({text: DashboardResource.Hide, handler: function() {
        //            if (portalNum != curDashboard._options.defportal) {
        //                mainViewport.findById("dashboard_panel").hideTabStripItem(portalNum);
        //                curDashboard._options.items[portalNum].isHidden = true;
        //                mainViewport.findById("dashboard_panel").activate("portal_panel_"+curDashboard._options.defportal);
        //                curDashboard.saveState();
        //            } else {
        //                Ext.Msg.alert(DashboardResource.Warning, DashboardResource.CannotHide);
        //            }
        //        }}),
        //        new Ext.menu.Item({text: DashboardResource.Show, handler: function() {
        //            var win = new Ext.Window({title: DashboardResource.Show, 
        //                width: parseInt(DashboardResource.Popup_Width),
        //                height: parseInt(DashboardResource.Popup_Height),
        //                buttons: [{text: DashboardResource.Ok, handler: function(t, e){curDashboard.saveState();t.ownerCt.close();}}
        //                    ,{text: DashboardResource.Cancel, handler: function(t, e){
        //                        Ext.destroy(slxDashboard);
        //                        slxDashboard = new Sage.SalesLogix.Dashboard(origOptions);
        //                        slxDashboard.init();
        //                        t.ownerCt.close();}
        //                    }
        //                ]
        //            });
        //            for (var i=0; i< curDashboard._options.items.length; i++) {    
        //                if (curDashboard._options.items[i].isHidden) {
        //                    win.add(new Ext.form.Checkbox({boxLabel: curDashboard._options.items[i].name, 
        //                            portal: "portal_panel_"+i, 
        //                            index: i, 
        //                            checked: !curDashboard._options.items[i].isHidden}
        //                        )).on("check", function(t,checked){
        //                            if (checked) {  
        //                                curDashboard._options.items[t.index].isHidden = false;
        //                                mainViewport.findById("dashboard_panel").unhideTabStripItem(t.portal);
        //                            } else {
        //                                curDashboard._options.items[t.index].isHidden = true;
        //                                mainViewport.findById("dashboard_panel").hideTabStripItem(t.portal);
        //                            }
        //                        });
        //                }
        //            }
        //            win.show();
        //        }}),
        //        new Ext.menu.Item({text: DashboardResource.Make_Default, 
        //            icon: ((curDashboard._options.defportal == portalNum) ? "images/YUI/menuchk8_nrm_1.gif" : Ext.BLANK_IMAGE_URL),
        //            handler: function() {
        //                curDashboard._options.defportal = portalNum;
        //                curDashboard.saveState();
        //        }}),
        new Ext.menu.Item({
            text: DashboardResource.Delete_Tab,
            disabled: (portalNum == curDashboard._options.defportal),
            handler: function() {
            var confirm = Ext.Msg.confirm(DashboardResource.Delete_Tab, DashboardResource.ConfirmDelete, function(result) {
                    if (result == "yes") 
                        curDashboard.deletePortal(portalNum);    
                });
            }            
        }),
        new Ext.menu.Item({ text: DashboardResource.Help,
            icon: "images/icons/help_16x16.gif",
            handler: function() { window.open(Ext.get('hidWorkspaceHelpLink').getValue(), 'MCWebHelp') }
        })
    ]
    });
    if (typeof idMenuItems != "undefined") {
        tcmenu.on("show", function() { idMenuItems(); });
    }
    return tcmenu;
}

Sage.SalesLogix.Dashboard.prototype.saveState = function() {
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "UIStateService.asmx/StoreUIState",
        data: Ext.util.JSON.encode({
            section: "Dashboard",
            key: "PortalConfig_"+document.forms[0].action.substring(document.forms[0].action.lastIndexOf('/')+1),
            value: Ext.util.JSON.encode(this._options)
        }),
        dataType: "json",
        error: function (request, status, error) {            
        },
        success: function(data, status) {            
        }
    });          
}

Sage.SalesLogix.Dashboard.prototype.deletePortal = function(portalNum) {    
    
    if (portalNum != this._options.defportal) 
    {
        var panel = mainViewport.findById("dashboard_panel");
        var tab = panel.findById("portal_panel_" + portalNum);
        
        if (tab) 
        {
            panel.remove(tab);
            this._options.items.splice(portalNum, 1);
            this.saveState();
        }
    }
    else
    {
        Ext.Msg.alert(DashboardResource.Warning, DashboardResource.CannotHide);
    }
    
    /*
    Ext.Msg.alert(DashboardResource.Warning, "Not implemented");
    return;
    if (portalNum != this._options.defportal) {
        mainViewport.findById("dashboard_panel").hideTabStripItem(portalNum);
        this._options.items[portalNum].isHidden = true;
        mainViewport.findById("dashboard_panel").activate("portal_panel_"+this._options.defportal);
        this.saveState();
    } else {
        Ext.Msg.alert(DashboardResource.Warning, DashboardResource.CannotHide);
    }
    */
}

Sage.SalesLogix.Dashboard.prototype.newPortal = function(name) {
    /*
    Ext.Msg.alert(DashboardResource.Warning, "Not implemented");
    return;
    var newNum = this._options.items.length;
    this._options.items[newNum] = {name: "New Dashboard", isHidden: false, layout: [1], cells: [[]]};    
    */       
    var curDashboard = this;    
    var item = {
        name: name,
        isHidden: false,
        layout: [1],
        cells: [[]]
    };       
    var number = this._options.items.push(item) - 1;    
    var panel = this._tabPanel.add({
        xtype: "portal",
        id: "portal_panel_" + number,
        title: this.createTitle(name, number),
        listeners: {
            "drop": {
                fn: function(args) {
                    var portalNum = args.portal.id.match(/\d+$/);
                    var smartpart = args.panel.location.cellitem;
                    var cells = curDashboard._options.items[portalNum].cells;
                    for (var i=0; i<cells.length; i++) {
                        cells[i].remove(smartpart);
                    }
                    cells[args.columnIndex].splice(args.position, 0, smartpart);  
                }
            },
            "contextmenu": { 
                fn: function(tabpanel, tab, e) {
                    var portalNum = parseInt(tab.id.match(/\d+$/), 10);
                    curDashboard.createTabContextMenu(portalNum).showAt(e.getXY());
                }
            }
        },
        items: (function(){
            var r = [];
            for (var i = 0; i < item.layout.length; i++)
                r.push(curDashboard.createColumnObject(item.layout[i]));
            return r;
        })()
    });  
    
    this.saveState(); 
       
    /*
    margins:'35 5 5 0', 
            border: false, 
            visible: true, 
            id: "portal_panel_"+k, 
            items:[], 
            title: this.createTitle(this._options.items[k].name, k)
        };
        for (var i=0; i<this._options.items[k].layout.length; i++) {
            dashboardPortal.items.push(this.createColumnObject(this._options.items[k].layout[i]));
            for (var j=0; j<this._options.items[k].cells[i].length; j++) {
                if (Ext.get(this._options.items[k].cells[i][j]) != null) {
                    dashboardPortal.items[i].items.push(this.createCellObject(this._options.items[k].cells[i][j], k, i));
                    var code = String.format("if (typeof {0} != 'undefined') {0}();", this._options.items[k].cells[i][j] + "_refresh");
                    eval(code);
                }
            }
        }
    */
    
    /*
    var panel = new Ext.TabPanel({
        border: false, 
        enableTabScroll: true, 
        id: "dashboard_panel"
    });
    var hiddenPanels = new Array();
    for (var i=0; i<portals.length;i++) {
        var thisportal = panel.add(portals[i]);
        thisportal.on("drop", function (args) {
            var portalNum = args.portal.id.match(/\d+$/);
            var smartpart = args.panel.location.cellitem;
            var cells = curDashboard._options.items[portalNum].cells;
            for (var i=0; i<cells.length; i++) {
                cells[i].remove(smartpart);
            }
            cells[args.columnIndex].splice(args.position, 0, smartpart);
        });
        if (curDashboard._options.items[i].isHidden) {
            hiddenPanels.push(thisportal.id);
        }
    }
    panel.on("contextmenu", function (tabpanel, tab, e){
        var portalNum = parseInt(tab.id.match(/\d+$/), 10);
        curDashboard.createTabContextMenu(portalNum).showAt(e.getXY());
    });
    */
}

function setUpDashboardPanels() {
    Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
    mainViewport = new Ext.FormViewport({
        layout: "border",
        autoShow: false,
        border: false,
        bufferResize: true,
        items: [
            {
                region: "north",
                id: "north_panel",
                height: 62,
                title: false,
                collapsible: false,
                border: false,
                contentEl: "north_panel_content"
            },{
                region: "south",
                id: "south_panel",
                height: 20,
                collapsible: false,
                border: false,
                contentEl: "south_panel_content"   
            },{
                region: "west",
                id: "west_panel",   
                stateId: "west_panel",                
                border: false,
                split: true,
                width: 150,
                collapsible: true,
                collapseMode:'mini',
                margins: "0 0 0 0",
                cmargins: "0 0 0 0",
                layout:'accordion',
                sequence: true,                                
                defaults: {
                    stateEvents: ["collapse","expand"],
                    getState: function() {
                    return {collapsed:this.collapsed};
                    }
                },
                animCollapse: false,
                animFloat: false,
                layoutConfig:{
                    animate:false,
                    hideCollapseTool: true
                }
            },{
                region: "center",
                id: "center_panel",
                applyTo: "center_panel",                
                collapsible: false,
                border: false,
                margins: "6 6 6 6",
                cmargins: "0 0 0 0",
                layout: "border",
                items: [{ 
                    region: "center",
                    id: "center_panel_center",
                    applyTo: "center_panel_center",                    
                    border: false,
                    collapsible: false,
                    margins: "0 0 0 0",                    
                    autoScroll: false,
                    layout: "fit"                     
                }]
            }]
    });
}

function setNavState()
{
       for (var i = 0; i < NavBar_Menus.length; i++)
        {
          var item = mainViewport.findById('nav_bar_menu_' + i);
          if (item) item.saveState();
        }
}