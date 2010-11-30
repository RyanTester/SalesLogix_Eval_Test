
function createOptionsMenu() {
    if (typeof MasterPageLinks != "undefined") {
        var helpMenu = new Ext.menu.Menu({
            id: 'HelpMenu',
            items: [{ text: MasterPageLinks.WebClientHelp, handler: function() { linkTo(Ext.get('hidHelpLink').getValue(), true) } },
                    { text: MasterPageLinks.About, handler: function() { linkTo(Ext.get('hidHelpAboutLink').getValue(), true) } }]
        });
        if (typeof idMenuItems != "undefined") {
            helpMenu.on("show", function() { idMenuItems(); });
        }        
        var helpTb = new Ext.Toolbar({cls: "nobackground", id: "helptoolbar"});
        helpTb.render('OptionsMenu');
        helpTb.add({text: MasterPageLinks.Help, menu: helpMenu, tooltip: MasterPageLinks.Help},
            '|',
            {text: MasterPageLinks.Options, handler: function(){linkTo('UserOptions.aspx', false)}},
            '|',
            {text: MasterPageLinks.LogOff, handler: function(){linkTo('Shutdown.axd', false)}}, 
            ' - ' + Ext.get('lclLoginName').dom.innerHTML);
        if (Ext.isIE6) {
            helpTb.addClass("toolbarIE6");
        }
    }
    $('#show_GeneralSearchOptionsPage').click(function(){window.setTimeout('GeneralSearchOptionsPage_init()', 500);});
    return;
}

function createMainToolbar() {
    var tb = new Ext.Toolbar({id: 'maintoolbar'});
    tb.render('ToolbarArea_span');
    var tbdata = ToolBarMenuData;
    for (var i=0; i<tbdata.items.length; i++) {
        var thismenu = new Ext.menu.Menu({listeners: {show: assertMenuHeight}});
        var menuitems = tbdata.items[i].items;
        if (menuitems) {
            for (var j=0; j<menuitems.length; j++) {
                if ((menuitems[j].isspacer == 'True') || (menuitems[j].text == '-')) {
                    thismenu.addSeparator();
                } else {
                    var menuitem = thismenu.add({text: menuitems[j].text, 
                        handler: makeLink(menuitems[j].href, (menuitems[j].target == 'MCWebHelp'), menuitems[j].target),
                        cls: "x-btn-text-icon", 
                        icon: menuitems[j].img.replace(/&amp;/g, "&"),
                        hrefTarget : menuitems[j].target,
                        id: menuitems[j].id
                    });
                    if (menuitems[j].disabled)
                        menuitem.disable();
                    if (menuitems[j].submenu.length > 0) {
                        menuitem.menu = new Ext.menu.Menu();
                        for (var k=0; k < menuitems[j].submenu.length; k++) {
                            menuitem.menu.add({ text: menuitems[j].submenu[k].text, 
                                handler: makeLink(menuitems[j].submenu[k].href, false, menuitems[j].submenu[k].target),
                                hrefTarget: menuitems[j].submenu[k].target
                            });                   
                        }
                        if (typeof idMenuItems != "undefined") {
                            menuitem.menu.on("show", function(){idMenuItems();});
                        }
                    }
                }
            }
        }
        if (typeof idMenuItems != "undefined") {
            thismenu.on("show", function(){idMenuItems();});
        }
        var styleClass = "x-btn-text-icon ";
        styleClass += (tbdata.items[i].cls != '') ? tbdata.items[i].cls : '';
        
        var tbitem = {text: tbdata.items[i].text, 
                cls: styleClass, 
                icon: tbdata.items[i].img.replace(/&amp;/g, "&"),
                tooltip: tbdata.items[i].tooltip,
                id: tbdata.items[i].id,
                hrefTarget: tbdata.items[i].target
            };
        if (tbdata.items[i].navurl) tbitem.handler = makeLink(tbdata.items[i].navurl);
        if (menuitems) tbitem.menu = thismenu;
        tb.add(tbitem);
    }
    tb.addClass("nobackground");
    if (Ext.isIE6) {
        tb.addClass("toolbarIE6");
    }
    //$("#ReminderDiv").css("visibility", "visible");
    if (typeof AddMailMerge === 'function') AddMailMerge();
    return;
}
function populateTitleBar() {
    if (Ext.get(localTitleTagId).dom.innerHTML == "") {
        var found = false;
        for (var i=0; i<NavBar_Menus.length; i++) {
            for (var j=0; j<NavBar_Menus[i].items.length; j++) {
                var mi = NavBar_Menus[i].items[j];
                if ((mi.href.length > 1) && (window.location.href.toLowerCase().indexOf(mi.href.toLowerCase()) > -1)) {
                    var imagetag = (mi.img.length == 0) ? "" : String.format("<img src='{0}' />", mi.img);
                    Ext.get(localTitleTagId).dom.innerHTML = String.format("<span id='PageTitle'>{0} {1}</span>", imagetag, mi.text);
                    found = true;
                    break;
                }
            }
            if (found) {break;}
        }
        if (!found) Ext.get(localTitleTagId).dom.innerHTML = "<span id='PageTitle'>Sage SalesLogix</span>";
    }
    /* populateGroupTabs(); */
}
var GroupTabBar;
var GroupsMenu;
var GroupTabContextMenu;
var GroupGridContextMenu;

function addToMenu(navItems, menu, excludeids) {
    if (navItems.length > 0) {
        for(var i = 0; i < navItems.length; i++) {
            var addit = true;
            if (typeof excludeids == "string") {
                //alert(excludeids);
                addit = (excludeids != navItems[i].id);
            } else if ((typeof excludeids == "object") && (excludeids.length)) {
                for (var k = 0; k < excludeids.length; k++) {
                    if (navItems[i].id == excludeids[k]) {
                        addit = false;
                    }
                }
            }   
            if (addit) {
                if ((navItems[i].isspacer == "True") || (navItems[i].text == '-')) {
                    menu.addSeparator();
                } else {
                    if (navItems[i].submenu.length > 0) {
                        var newsubmenu = new Ext.menu.Menu( {id : navItems[i].id } );
                        addToMenu(navItems[i].submenu, newsubmenu);
                        menu.add({text:navItems[i].text, id: navItems[i].id, menu : newsubmenu, hideOnClick : false});
                    } else {
                        menu.add({text:navItems[i].text, handler: makeLink(navItems[i].href), id: navItems[i].id});
                    }
                }
            }   
        }
    }
}
var lookupPnl;
function verifyMasterPageObj() {
    var msg = "MasterPage is missing required elements: {0}";
    var missingElems = new Array();
    if ( typeof(MasterPageLinks) == "undefined") {
        missingElems.push("MasterPageLinks");
    } else {
        msg = MasterPageLinks.MissingElementsErrorMgs;
    }     
    var elem = document.getElementById("lookupBtn");
    if (!elem) {
        missingElems.push("lookupBtn");
    }
    elem = document.getElementById("GroupTabs");
    if (!elem) {
        missingElems.push("GroupTabs");
    }
    if (missingElems.length > 0) {
        alert(String.format(msg, missingElems.join(", ")));
        return false;
    }
    return true;
}
function populateGroupTabs() {
    if (!verifyMasterPageObj()) return;
    var isReload = (typeof GroupsMenu != "undefined");
    if (isReload) {
        GroupsMenu.removeAll();
    } else {
        $("#GroupTabs").css({left: (MasterPageLinks.LookupBtnWidth - 0  + 6) + "px"});
        GroupsMenu = new Ext.menu.Menu({id: 'GroupMenu',listeners: {show: assertMenuHeight}});    
        if (typeof idMenuItems != "undefined") {
            GroupsMenu.on("show", function(){idMenuItems();});
        }
    }
    if (typeof groupMenuData != "undefined") {        
        var menustring = Ext.util.JSON.encode(groupMenuData.menuitems); 
        var groupName = getCurrentGroupInfo().Name;
        if (groupName == null) { groupName = ""; };
        var newgmd = Ext.util.JSON.decode(
            menustring.replace(/%GROUPNAME%/g, groupName).replace(/%GROUPID%/g, getCurrentGroupInfo().Id).replace(/%GROUPFILENAME%/g, groupName.replace(/[^A-Z0-9a-z&]/g, "_"))); 
        
        var excludeids = new Array();
        if (getCurrentGroupID() == "LOOKUPRESULTS") {
            excludeids.push('mnuForXGroup');
        }
       
        addToMenu(newgmd, GroupsMenu, excludeids);
        GroupsMenu.addSeparator();
    }
    
    if (typeof groupMenuList == "undefined") return;
    
    var currentGroupId = getCurrentGroupID();
    checkMenuItemAvailability(GroupsMenu, currentGroupId);
    //if (!isReload) {
    if (groupMenuList.groups) {
        if (!isReload) {
            GroupTabBar = new Ext.TabPanel({
                id: getCurrentGroupInfo().Family + '_tabpanel',
                renderTo:'GroupTabs',
                resizeTabs:false,
                minTabWidth:135,
                enableTabScroll:true,
                animScroll:true,
                border:false
            });
        }
        var tabCount = groupMenuList.groups.length;   
        for (var i = 0; i < groupMenuList.groups.length; i++) {
            var txt = Ext.util.Format.htmlEncode(groupMenuList.groups[i].text);
            if (currentGroupId == groupMenuList.groups[i].id) {
                var itm = GroupsMenu.add({text : txt, handler: makeLink(groupMenuList.groups[i].href) });
                if (!isReload)
                    GroupTabBar.add({ title:txt, html:'', url:groupMenuList.groups[i].href, id:groupMenuList.groups[i].id }).show();
            } else {
                GroupsMenu.add({text : txt, handler: makeLink(groupMenuList.groups[i].href) });
                if (!isReload)
                    GroupTabBar.add({ title:txt, html:'', url:groupMenuList.groups[i].href, id:groupMenuList.groups[i].id });
            }
        }

        // the length of the display name for each tab is 128
        var tabBarWidth = tabCount == 0 ? 5000 : tabCount * 400;
        $("#GroupTabs UL").css("width", tabBarWidth + "px");

        if (!isReload) {
            if (groupMenuList.groups.length > 0) {
                GroupTabBar.addListener('beforetabchange', handleGroupTabChange);
                if (typeof groupTabConextMenuData != "undefined") {
                    GroupTabBar.addListener('contextmenu', onTabContextMenu);
                }
           
                var panel = mainViewport.findById('center_panel_north');  

                var lookupTb = new Ext.Toolbar({
                    cls: "nobackground",
                    renderTo: "lookupBtn",
                    stateful: false,
                    id: "lookupTb"
                });
                
                lookupTb.addButton({
                    text: MasterPageLinks.Lookup,
                    handler: showMainLookup,
                    id: "lookupButton",
                    minWidth: MasterPageLinks.LookupBtnWidth,
                    cls: 'x-btn-text-icon',
                    icon: 'ImageResource.axd?scope=global&type=Global_Images&key=Find_16x16'
                });
      
                if ((typeof Sage.SalesLogix != 'undefined') && (document.location.href.toLowerCase().indexOf('showlookuponload=true') > -1)) {
                    showMainLookup();
                }
                
                if (panel) {
                    panel.addListener('resize', handleViewPortResize);
                    var box = panel.getBox(); //FireFox 3 needs this to run now to make sure there are scroll buttons...
                    handleViewPortResize(panel, box.width, box.height, box.width, box.height);
                }
            }
            if (typeof MasterPageLinks != "undefined") {
                var groupTb = new Ext.Toolbar({id: "GroupsMenuToolBar"});
                groupTb.render("GroupMenuSpace");
                groupTb.add({text: MasterPageLinks.Groups,
                    id: "GroupsMenuButton", 
                    cls: "x-btn-text-icon", 
                    icon: 'images/icons/Groups_16x16.gif', 
                    menu: GroupsMenu});
                groupTb.addClass("nobackground");

                $(document).ready(function() {
                    var gMgrSvc = Sage.Services.getService("GroupManagerService");
                    gMgrSvc.addListener(Sage.GroupManagerService.CURRENT_GROUP_CHANGED, handleGroupChange);
                });
            }
        }
    }
}

function checkforShowLookup() {
    if (typeof Sage.SalesLogix.Controls.ListPanel != 'undefined')
        {var listPanel = Sage.SalesLogix.Controls.ListPanel.find("MainList");}
    
    if ((typeof listPanel != 'undefined') && (document.location.href.toLowerCase().indexOf('showlookuponload=true') > -1)) {
        showMainLookup();
    }
}    

function checkMenuItemAvailability(menu, groupID) {
    for (var i = 0; i < menu.items.items.length; i++) {
        if (typeof(menu.items.items[i].menu) != "undefined") { // check submenus.
            checkMenuItemAvailability(menu.items.items[i].menu, groupID); 
        }
        if ((menu.items.items[i].id == "contextCopy") || (menu.items.items[i].id == 'navItemCopy')) {
            //Hide when Basedon is not null/empty and it is an AdHoc group...
            var grpMgr = Sage.Services.getService("GroupManagerService");
            if (grpMgr) {
                var grpInfo = grpMgr.findGroupInfoById(groupID);
                if (grpInfo) {
                    if ((grpInfo.basedOn != '') && (grpInfo.isAdHoc))
                        menu.items.items[i].disable();
                }
            }
        } else if ((menu.items.items[i].id == 'contextShare') || (menu.items.items[i].id == 'navItemShare')) {
            //if it isn't my group, I cannot share it...
            var ctxSvc = Sage.Services.getService('ClientContextService');
            var grpMgr = Sage.Services.getService('GroupManagerService');
            var disable = true;
            if ((ctxSvc) && (grpMgr)) {
                var grpInfo = grpMgr.findGroupInfoById(groupID);
                var userID = ctxSvc.getValue('userID');
                if ((grpInfo) && (userID)) {
                    disable = (grpInfo.userID != userID);
                }
            }
            if (disable) {
                menu.items.items[i].disable();
            }
        }
    }
}

function onTabContextMenu(ts, item, e) {
    if (item.id == 'GroupLookup') {
        return;
    }
    if (typeof(GroupTabContextMenu) != "undefined") {
        GroupTabContextMenu.removeAll();
    } else {
        GroupTabContextMenu = new Ext.menu.Menu({id: 'GroupTabContext'});
        if (typeof idMenuItems != "undefined") {
            GroupTabContextMenu.on("show", function(){idMenuItems();});
        }
    }
    
    var groupname = GroupNameByID(item.id);
    
    var menustring = Sys.Serialization.JavaScriptSerializer.serialize(groupTabConextMenuData.menuitems);
    var newgmd = Sys.Serialization.JavaScriptSerializer.deserialize(
        menustring.replace(/%GROUPNAME%/g, groupname).replace(/%GROUPID%/g, item.id).replace(/%GROUPFILENAME%/g, groupname.replace(/[^A-Z0-9a-z&]/g, "_"))); 
    
    var excludeids = new Array();
    if (item.id == "LOOKUPRESULTS") {
       excludeids.push("contextEdit");
       excludeids.push("contextShare");
       excludeids.push("contextCopy");
       excludeids.push("contextHide");
       excludeids.push("contextDelete");
       excludeids.push("contextSpacer1");
    }
    
    addToMenu(newgmd, GroupTabContextMenu, excludeids);
    checkMenuItemAvailability(GroupTabContextMenu, item.id);
    
    if ((item.id == "LOOKUPRESULTS") && (GroupTabBar.activeTab.id == "LOOKUPRESULTS")) {
        GroupTabContextMenu.add({text:MasterPageLinks.LookupSaveAsGroup, handler: SaveLookupAsGroup, id:'rmbSaveLookupAsGroup'});
    }
    
    GroupTabContextMenu.showAt(e.getPoint());
}

function handleViewPortResize(panel, newWidth, newHeight, rawWidth, rawHeight) {
    if ((MasterPageLinks.LookupBtnWidth - 0) > 50) {
        GroupTabBar.setWidth(newWidth - MasterPageLinks.LookupBtnWidth - 6);
    } else {
        GroupTabBar.setWidth(newWidth - 75);
    }
}


function populateNavBar(){
    var west = mainViewport.findById('west_panel');  
    if (!west)
        return;
    
    var templates = {
        item0: new Ext.XTemplate([
            '<div class="NavBarItem" onMouseDown="NavBarItem_mousedown(event, \'{contextmenu}\')" oncontextmenu="return false">',
            '<a title="{tooltip}" href="{href}" target="{target}" oncontextmenu="return false">',
            '<tpl if="img.length != 0"><img src="{img}" oncontextmenu="return false" /></tpl>',
            '<br/>',
            '{text}',
            '</a>',
            '</div>'
        ]),
        item1: new Ext.XTemplate([
            '<div class="NavBarItem" onMouseDown="NavBarItem_mousedown(event, \'{contextmenu}\')" oncontextmenu="return false">',
            '<a title="{tooltip}" href="{href}" target="{target}" oncontextmenu="return false">',
            '{text}',
            '<br/>',
            '<tpl if="img.length != 0"><img src="{img}" oncontextmenu="return false" /></tpl>',
            '</a>',
            '</div>'
        ]),
        item3: new Ext.XTemplate([
            '<div class="NavBarItem" onMouseDown="NavBarItem_mousedown(event, \'{contextmenu}\')" oncontextmenu="return false">',
            '<a title="{tooltip}" href="{href}" target="{target}" oncontextmenu="return false">',
            '{text}',
            '<tpl if="img.length != 0"><img src="{img}" oncontextmenu="return false" /></tpl>',
            '</a>',
            '</div>'
        ]),
        itemDefault: new Ext.XTemplate([
            '<div class="NavBarItem" onMouseDown="NavBarItem_mousedown(event, \'{contextmenu}\')" oncontextmenu="return false">',
            '<a title="{tooltip}" href="{href}" target="{target}" oncontextmenu="return false">',
            '<tpl if="img.length != 0"><img src="{img}" oncontextmenu="return false" /></tpl>',
            '{text}',
            '</a>',
            '</div>'
        ]),
        spacer: new Ext.XTemplate('<div class="NavBarItem">&nbsp;</div>')
    };
    
    for (var i = 0; i < NavBar_Menus.length; i++)
    {
        var menu = NavBar_Menus[i];    
        var html = [];        
        for (var j = 0; j < menu.items.length; j++)
        {        
            if (menu.items[j].isspacer)
            {
                html.push(templates.spacer.apply());
            }
            else
            {
                var tpl = "item" + menu.textimagerelation;
                if (templates[tpl])
                    html.push(templates[tpl].apply(menu.items[j]));
                else
                    html.push(templates["itemDefault"].apply(menu.items[j]));
            }
        }   
           
        var panel = west.add({ 
            id: "nav_bar_menu_" + i,
            title: menu.title,
            border: false,
            autoScroll: true,
            fit: true,
            html: html.join('')
        });
        
        if (typeof menu.backgroundimage === "string")
        {
            west.el.dom.style.backgroundImage = menu.backgroundimage;
            west.el.dom.oncontextmenu = function(){ return false };
            // west.el.dom.parentNode.oncontextmenu = function(){ return false }; 
        }                
    }
    
    west.doLayout(); 
           
    $(".NavBarItem a", west.getEl().dom).each(function(i) { //highlight the active item
        if (window.location.href.toLowerCase().indexOf(this.href.toLowerCase()) > -1) {
            this.parentNode.className += " ActiveNavBarItem";
        }
    });
}
function showContextMenu(x,y, contextmenu) {
    eval(" var data = " + contextmenu + "_data;");	    
    var leftNavContextMenu = new Ext.menu.Menu();
    var idlist = new Array();
    for (var i=0; i<data.length; i++) {
        if ((data[i].text == "-") || (data[i].isspacer == "True")) {
            leftNavContextMenu.add('-');
        } else {
            var itemid = data[i].text.replace(/[^A-Za-z]/g, "_");
            while (idlist.indexOf(itemid) > -1) {
                itemid += "_";
            }
            idlist.push(itemid);
            leftNavContextMenu.add({ text: data[i].text, 
                href: data[i].href, 
                id: String.format("contextmenu_{0}", itemid),
                icon: (data[i].img == "") ? Ext.BLANK_IMAGE_URL : data[i].img,
                hrefTarget : data[i].target
            });
        }
    }
    if (typeof idMenuItems != "undefined") {
        leftNavContextMenu.on("show", function(){idMenuItems();});
    }
    leftNavContextMenu.showAt([x,y]);
}
function NavBarItem_mousedown(e, contextmenu) {
    if ((e.button == 2) && (contextmenu.length > 1)) {
        window.setTimeout(String.format("showContextMenu({0}, {1}, '{2}')", e.clientX, e.clientY, contextmenu), 300);
    }
    return false;
}

var mainViewport;
function setUpPanels() {
    Ext.state.Manager.setProvider(new Ext.state.CookieProvider());

    var hasGroupTabs = (typeof groupMenuList != "undefined");
    var northPanel = {
        region: "north",
        id: "north_panel",
        height: 62,
        title: false,
        collapsible: false,
        border: false,
        contentEl: "north_panel_content"
    };
    
    var southPanel = {
        region: "south",
        id: "south_panel",
        height: 20,
        collapsible: false,
        border: false,
        contentEl: "south_panel_content",
        cls: "south_panel"
    };
    
    var westPanel = {
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
        autoScroll: false,
        defaults: {
            stateEvents: ["collapse","expand"],
            getState: function() {
            return {collapsed:this.collapsed};
            }
        },
        animCollapse: false,
        animFloat: false,
        bufferResize: true,
        layoutConfig:{
            animate:false,
            hideCollapseTool: true
        }
    };
    
    var centerPanelNorth = {
        region: "north",
        id: "center_panel_north",
        contentEl: "center_panel_north_content",
        border: false,
        collapsible: false,
        margins: "0 0 0 0",                    
        height: (hasGroupTabs) ? 60 : 40
    };
    
    var centerPanelEast = {
        region: "east",
        id: "center_panel_east",
        contentEl: "center_panel_east_content",
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
        width: 200,
        hidden: (typeof __includeTaskPane !== "undefined" && __includeTaskPane === false)
    };
    
    var centerPanelCenter = {
        region: "center",
        id: "center_panel_center",
        contentEl: "MainWorkArea",         
        border: false,
        collapsible: false,
        margins: "0 0 0 0",                    
        autoScroll: true,
        autoShow: true,
        layout: "fit" //,
        //activeItem:0,
        //layout: "card" 
    };
        
    var centerPanelItems = [centerPanelNorth, centerPanelEast, centerPanelCenter];
    var centerPanel = {
        region: "center",
        id: "center_panel",            
        collapsible: false,
        border: false,
        autoShow: true,
        margins: "6 6 6 6",
        cmargins: "0 0 0 0",
        layout: "border",
        bufferResize: true,
        items: centerPanelItems
    };
    
    mainViewport = new Ext.FormViewport({
        id: "main_viewport",
        layout: "border",
        layoutConfig: {
            animate: false
        },
        autoShow: true,
        border: false,
        bufferResize: true,
        items: [northPanel, southPanel, westPanel, centerPanel],
        listeners: {
            "render" : function(container, layout) {                                 
                if (typeof __includeTaskPane === "undefined" || __includeTaskPane !== false)
                    $("#center_panel_east > .x-panel-bwrap").show(); //fix for improper display:none when initially collapsed                
            }
        } 
    }); 
};

function setNavState()
{
    for (var i = 0; i < NavBar_Menus.length; i++)
    {
        var item = mainViewport.findById('nav_bar_menu_' + i);
        if (item)
            item.saveState();
    }
}


function assertMenuHeight(m) {    
    var maxHeight = Ext.getBody().getHeight();    
    var box = m._defaultBox = m._defaultBox || m.el.getBox();
       
    if ((box.y + box.height + 4) > maxHeight)
    {
        m.el.setHeight((maxHeight - box.y - 4));
        m.el.applyStyles("overflow: auto;");
    }    
    else
    {
        m.el.setHeight(box.height);
        m.el.applyStyles("overflow: hidden;");
    }
}

function ShowMenuItem()
{
    var txtdiv = $get('ssTextDiv');
    var menudiv = $get('ssMenuItemDiv');
    var bounds = Sys.UI.DomElement.getBounds(txtdiv);
    menudiv.style.left = bounds.x + "px";
    menudiv.style.top = "56px";
    menudiv.style.display = "block";
}

var ssTimerId;
function checkSSText(tbox) {
  if (tbox.value == tbox.defaultValue) {
    if (Sys.UI.DomElement.containsCssClass(tbox, "tboxinfo")) {
      Sys.UI.DomElement.removeCssClass(tbox, "tboxinfo");
      tbox.value = "";
    }
  }
}
function HideSSDropDown()
{
    var menudiv = $get('ssMenuItemDiv');
    menudiv.style.display = "none";
}
function MenuBtnLeave(obj)
{
    obj.className="ssdropdown";
    ssTimerId=window.setTimeout('HideSSDropDown()',1000);
}
function HandleEnterKeyMaster(e, id)
{
    if (!e) var e = window.event;
    if (e.keyCode == 13) //Enter
    {
        e.returnValue = false;
        e.cancelBubble = true;
        var strs = id.split('_');
        var btnId = strs[0] + "_Search1";
        var btn = $get(btnId);
        if (document.createEvent)
        {
            var evt = document.createEvent("MouseEvents");
            evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            btn.dispatchEvent(evt);
        }
        else
        {
            btn.click();
        }
    }
}
/* 
 Kill the document.onkeypress event coming from the Enter key and of type 'text'.
 This function of web forms causes the form to submit.  Normally considered an acceptable function,
 if there are multiple control on the page that use SubmitBehavior, the top
 control in the form will win and it's onclick will be fired.
 UseSubmitBehaviour=false is the usual method to fix this, but .net ImageButtons do not extend that     attribute.
*/
document.onkeypress= function (evt)
{
    var evt  = (evt) ? evt : ((event) ? event : null);
    var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
    if ((evt.keyCode == 13) && (node.type=="text")) {return false;}
}