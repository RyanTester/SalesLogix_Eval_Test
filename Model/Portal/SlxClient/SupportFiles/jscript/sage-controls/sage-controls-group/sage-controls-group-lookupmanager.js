Sage.GroupLookupManager = function() {
    this.win = '';
    this.lookupIsOpen = false;
    this.withinGroup = false;
    this.conditions = [];

    this.lookupTpl = new Ext.XTemplate(
        //'<div id="entitylookupdiv-container">',
        '<div id="entitylookupdiv_{index}" class="lookup-condition-row">',
        '<label class="slxlabel" style="width:75px;clear:left;display:block;float:left;position:relative;padding:4px 0px 0px 0px"><tpl if="index &lt; 1">{addrowlabel}</tpl><tpl if="index &gt; 0">{hiderowlabel}</tpl></label>',
        '<div style="padding-left:75px;position:relative;">',
        '<select id="fieldnames_{index}" class="lookup-fieldnames-list" onchange="var mgr = Sage.Services.getService(\'GroupLookupManager\');if (mgr) { mgr.operatorChange({index}); }"><tpl for="fields"><option value="{fieldname}">{displayname}</option></tpl></select>',
        '<select id="operators_{index}" class="lookup-operators-list"><tpl for="operators"><option value="{symbol}">{display}</option></tpl></select>',
        '<input type="text" id="value_{index}" class="lookup-value" />',
        '<tpl if="index &lt; 1"><img src="{addimgurl}" alt="{addimgalttext}" style="cursor:pointer;padding:0px 5px;" onclick="var mgr = Sage.Services.getService(\'GroupLookupManager\');if (mgr){mgr.addLookupCondition();}" />',
        '<input type="button" id="lookupButton" onclick="var mgr = Sage.Services.getService(\'GroupLookupManager\');if (mgr) { mgr.doLookup(); }" value="{srchBtnCaption}" /></tpl>',
        '<tpl if="index &gt; 0"><img src="{hideimgurl}" alt="{hideimgalttext}" style="cursor:pointer;padding:0px 5px;" onclick="var mgr = Sage.Services.getService(\'GroupLookupManager\');if (mgr) { mgr.removeLookupCondition({index});}" /></tpl>',
        '</div></div>' //</div>
    );  

    if (window.lookupSetupObject) {
        this.setupTemplateObj = window.lookupSetupObject;
    } else {
        window.setTimeout(this.getTemplateObj, 100); //otherwise this is a race
    }
    gMgrSvc = Sage.Services.getService("GroupManagerService");
    gMgrSvc.addListener(Sage.GroupManagerService.CURRENT_GROUP_CHANGED, this.handleGroupChanged);

}

Sage.GroupLookupManager.prototype.getTemplateObj = function() {
    var mgr = Sage.Services.getService("GroupLookupManager")
    mgr.setupTemplateObj =  (window.lookupSetupObject) ? window.lookupSetupObject : {
        fields: [{ fieldname: '', displayname: ''}],
        operators: [{ symbol: 'sw', display: 'Starting With' },
            { symbol: 'like', display: 'Contains' },
            { symbol: 'eq', display: 'Equal to' },
            { symbol: 'ne', display: 'Not Equal to' },
            { symbol: 'lteq', display: 'Equal or Less than' },
            { symbol: 'gteq', display: 'Equal or Greater than' },
            { symbol: 'lt', display: 'Less than' },
            { symbol: 'gt', display: 'Greater than'}],
        numericoperators: [{ symbol: "eq", "display": "Equal to" },
            { symbol: "ne", "display": "Not Equal to" },
            { symbol: "lteq", "display": "Equal or Less than" },
            { symbol: "gteq", "display": "Equal or Greater than" },
            { symbol: "lt", "display": "Less than" },
            { symbol: "gt", "display": "Greater than"}],
        index: 0,
        hideimgurl: 'images/icons/Find_Remove_16x16.gif',
        addimgurl: 'images/icons/Find_Add_16x16.gif',

        hideimgalttext: 'Remove Condition',
        addimgalttext: 'Add Condition',
        addrowlabel: 'Lookup by:',
        hiderowlabel: 'And:',
        srchBtnCaption: 'Search',
        errorOperatorRequiresValue: 'The operator requires a value'
    }

}

Sage.GroupLookupManager.prototype.showLookup = function() {
    var mgr = Sage.Services.getService("GroupLookupManager");
    if (mgr) {    
        if (mgr.lookupisopen) { return; }
        mgr.lookupisopen = true;
        if (mgr.win == '') {
            mgr.setupLookupElements();
        }
        mgr.handleGroupChanged();
        var gMgrSvc = Sage.Services.getService("GroupManagerService");
        var layout = gMgrSvc.getLookupFields(mgr.resetLookup);
        mgr.win.show();
        $(document).bind("keydown", mgr.checkKeys );
        $("#value_0").focus();
        window.setTimeout(function() { $("#value_0").focus(); }, 500);
    }
}

Sage.GroupLookupManager.prototype.checkKeys = function(e) {
    if (e.keyCode == 13) {
        var mgr = Sage.Services.getService("GroupLookupManager");
        if (mgr) {
            mgr.doLookup();
        }
    }
}

Sage.GroupLookupManager.prototype.setupLookupElements = function() {
    var mgr = Sage.Services.getService("GroupLookupManager");
    if ((mgr) && (mgr.win == '')) {
        var pnl = new Ext.Panel({
            id: 'lookupformpanel',
            layout: 'fit',
            style: 'padding:5px',
            html: ''
        });

        var cpc = mainViewport.findById('center_panel_center');
        var cpcBox = cpc.getBox();

        //pnl.html = mgr.lookupTpl.apply(mgr.setupTemplateObj);
        if (!mgr.setupTemplateObj) mgr.getTemplateObj();
        pnl.html = '<div id="entitylookupdiv-container">' + mgr.lookupTpl.apply(mgr.setupTemplateObj) + '</div>';

        mgr.win = new Ext.Window({
            header: false,
            footer: false,
            hideBorders: true,
            //closable:false,
            resizable: false,
            draggable: false,
            width: 700,
            height: 300,
            //plain:true,
            shadow: false,
            bodyStyle: 'padding:5px',
            buttonAlign: 'right',
            items: pnl,
            closeAction: 'hide',
            modal: true,
            stateful: false,
            tools: [{ id: 'help', handler: function() { linkTo(window.lookupSetupObject.lookupHelpLocation, true); } }]
        });
        mgr.win.setWidth(700);
        mgr.win.setPosition(cpcBox.x - 2, cpcBox.y);
        mgr.win.addListener("beforehide", mgr.onLookupHide, mgr);

        //var centerPanel = mainViewport.findById('center_panel_center');  
        //centerPanel.addListener('resize', mgr.lookupResize, mgr);
    }
}

Sage.GroupLookupManager.prototype.adjustInputHeight = function() {
   $(".lookup-value").height($(".lookup-operators-list").height());
}

Sage.GroupLookupManager.prototype.addLookupCondition = function() {
    var mgr = Sage.Services.getService("GroupLookupManager");
    if (mgr) {    
        mgr.setupTemplateObj.index++;
        mgr.lookupTpl.append('entitylookupdiv-container', mgr.setupTemplateObj);
        mgr.adjustInputHeight();
    }
}

Sage.GroupLookupManager.prototype.removeLookupCondition = function(idx) {
    var rowid = "#entitylookupdiv_" + idx;
    $(rowid).html('');
}

Sage.GroupLookupManager.prototype.onLookupHide = function() {
    this.lookupisopen = false;
    $(document).unbind("keydown", this.checkKeys );

}

//Sage.GroupLookupManager.prototype.lookupResize = function(panel, newWidth, newHeight, rawWidth, rawHeight) {
//    if (this.win) {
//        this.win.setWidth(newWidth);
//    }
//}

Sage.GroupLookupManager.prototype.doLookup = function() {
    if (this.reloadConditions()) {
        var gMgrSvc = Sage.Services.getService("GroupManagerService");
        if (gMgrSvc) {
            gMgrSvc.doLookup(this.getConditionsString());
        }
        this.win.hide();
    } else {
        alert(this.setupTemplateObj.errorOperatorRequiresValue);
    }
}

Sage.GroupLookupManager.prototype.reloadSelect = function(sel, items) {
    while (sel.options.length > 0) {
        sel.remove(0);
    }
    var opt;
    for (var i = 0; i < items.length; i++) {
        opt = document.createElement("option");
        opt.value = items[i].symbol;
        opt.text = items[i].display;
        try {
            sel.add(opt);
        } catch (e) {
            sel.appendChild(opt);
        }
    }
}

Sage.GroupLookupManager.prototype.operatorChange = function(index) {
    var mgr = Sage.Services.getService("GroupLookupManager");
    if (mgr) {
        var operators = $('#operators_' + index)[0];
        var fields = $('#fieldnames_' + index)[0];
        if ((fields.selectedIndex >= 0) && 
            (fields.selectedIndex < mgr.setupTemplateObj.fields.length) &&
            (mgr.setupTemplateObj.fields[fields.selectedIndex].isNumeric)) 
        {
            if (operators.length != mgr.setupTemplateObj.numericoperators.length) {
                mgr.reloadSelect(operators, mgr.setupTemplateObj.numericoperators);
            }
        } else {
            if (operators.length != mgr.setupTemplateObj.operators.length) {
                mgr.reloadSelect(operators, mgr.setupTemplateObj.operators);
            }
        }
    }
}

Sage.GroupLookupManager.prototype.reloadConditions = function() {
    this.conditions = [];
    var filterRows = $('.lookup-condition-row');
    for (var i = 0; i < filterRows.length; i++) {
        var row = filterRows[i];
        var fieldname = $('.lookup-fieldnames-list', filterRows[i]);
        var operator = $('.lookup-operators-list', filterRows[i]);
        var val = $('.lookup-value', filterRows[i]);
        if (fieldname[0]) {
            if ((fieldname[0].value) && (operator[0].value)) {  // && (val[0].value)
                if ((!val[0].value) && ((operator[0].value != 'like') && (operator[0].value != 'sw'))) {
                    return false; //must have a value for numeric comparisons
                }
                var condition = {
                    fieldname: fieldname[0].value,
                    operator: operator[0].value,
                    val: val[0].value.replace(/%/g, '')
                }
                this.conditions.push(condition);
                //conditions.push(fieldname[0].value + "'" + operator[0].value + "'" + val[0].value.replace(",", "").replace("'", ""));
                this.operatorChange(0);
            }
        }
    }
    return true;
}

Sage.GroupLookupManager.prototype.resetLookup = function(data) {
    var x = data;
    var mgr = Sage.Services.getService("GroupLookupManager");
    if (mgr) {
        mgr.setupTemplateFields(data);       
        mgr.setupTemplateObj.index = 0;
        if (mgr.win != '') {
            mgr.lookupTpl.overwrite('entitylookupdiv-container', mgr.setupTemplateObj);
            //set lookup controls to match current conditions
            if (mgr.conditions.length > 0) {
                for (var i = 1; i < mgr.conditions.length; i++) {
                    mgr.addLookupCondition();
                }
                var filterRows = $('.lookup-condition-row');
                if (filterRows) {
                    for (var i = 0; i < filterRows.length; i++) {
                        var row = filterRows[i];
                        if ((row) && (mgr.conditions[i])) {
                            var cond = mgr.conditions[i];
                            var fld = $('.lookup-fieldnames-list', row);
                            var op = $('.lookup-operators-list', row);
                            var val = $('.lookup-value', row);
                            if (fld[0]) fld[0].value = cond.fieldname;
                            if (op[0]) op[0].value = cond.operator;
                            if (val[0]) val[0].value = cond.val;
                            mgr.operatorChange(i);
                        }
                    }
                }
            }
            mgr.adjustInputHeight();
        }
    }
}

Sage.GroupLookupManager.prototype.getConditionsString = function() {
    return Sys.Serialization.JavaScriptSerializer.serialize(this.conditions);
}

Sage.GroupLookupManager.prototype.handleGroupChanged = function() {
    var gMgrSvc = Sage.Services.getService("GroupManagerService");
    var mgr = Sage.Services.getService("GroupLookupManager");
    if ((!mgr) && (this.setupTemplateObj)) {
        mgr = this;
    }
    if (mgr.win != '') {
        if (mgr.win.isVisible()) {
            mgr.win.hide();
        }
    }
}


Sage.GroupLookupManager.prototype.setupTemplateFields = function(filters) {
    var NumericFieldTypes = { "2": true, "6": true, "3": true, "11": true }; //"0": true, 0 is calculated fields - but they end up acting like strings
    var mgr = Sage.Services.getService("GroupLookupManager");
    if (mgr) {
        mgr.setupTemplateObj.fields = [];
        for (var i = 0; i < filters.items.length; i++) {
            if ((filters.items[i].visible == "T") && (filters.items[i].width != "0")) {
                var itemIsNumber = filters.items[i].fieldType in  NumericFieldTypes;
                mgr.setupTemplateObj.fields.push({ fieldname: filters.items[i].alias,
                    displayname: filters.items[i].caption,
                    isNumeric: itemIsNumber
                });
            }
        }
    }
}


Sage.Services.addService("GroupLookupManager", new Sage.GroupLookupManager() );
