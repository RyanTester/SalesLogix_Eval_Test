// class used for watching bound data fields and notifying the user that they have dirty data
ClientBindingManagerService = function() {
    this._WatchChanges = true;
    this._PageExitWarningMessage = "";
    this._ShowWarningOnPageExit = false;
    this._SkipCheck = false;
    this._CurrentEntityIsDirty = false;
    this._SaveBtnID = "";
    this._MsgDisplayID = "";
    this._entityTransactionID = "";
    
    positionDirtyDataMessage();
};

$(document).ready(function() {
    Sys.WebForms.PageRequestManager.getInstance().add_endRequest(positionDirtyDataMessage);
});

function positionDirtyDataMessage() {
    if ($('#PageTitle').get().length > 0) {
        $('#PageTitle').after($('.dirtyDataMessage').replaceWith(''))
        $('.dirtyDataMessage').css('top', $('#PageTitle').position().top);
        $('.dirtyDataMessage').css('left', $('#PageTitle').outerWidth());
    }
}

ClientBindingManagerService.prototype.SetShowWarningOnPageExit = function(showMsg) {
    this._ShowWarningOnPageExit = (showMsg);
    if (this._ShowWarningOnPageExit) {
        window.onbeforeunload = this.onExit;
    }
};

ClientBindingManagerService.prototype.onExit = function(e) {
    var mgr = Sage.Services.getService("ClientBindingManagerService");
    if (mgr) {
        if (mgr._ShowWarningOnPageExit) {
            if (mgr._SkipCheck) {
                //_SkipCheck = false;
                return;
            }
            if (mgr._CurrentEntityIsDirty) {
                window.setTimeout(function() {
                    hideRequestIndicator(null, { });
                }, 1000);
                if (window.event) {
                    window.event.returnValue = mgr._PageExitWarningMessage;
                } else {
                    return mgr._PageExitWarningMessage;
                }
            }
        }
    }
    return;
};


ClientBindingManagerService.prototype.canChangeEntityContext = function() {
    if ((this._WatchChanges) && (this._CurrentEntityIsDirty) && (this._ShowWarningOnPageExit)) {
        if (confirm(this._PageExitWarningMessage)) {
            this.clearDirtyStatus();
            return true;
        } else {
            return false;
        }
    }
    return true;
};

ClientBindingManagerService.prototype.markDirty = function(e) {
    var mgr = Sage.Services.getService("ClientBindingManagerService");
    if (mgr) {
        if (mgr._WatchChanges) {
            mgr._CurrentEntityIsDirty = true;
            positionDirtyDataMessage();
            $("#" + mgr._MsgDisplayID).show();
        }
    }
};

ClientBindingManagerService.prototype.clearDirtyStatus = function() {
    var mgr = Sage.Services.getService("ClientBindingManagerService");
    if (mgr) {
        mgr._CurrentEntityIsDirty = false;
        $("#" + mgr._MsgDisplayID).hide();
    }
};

function notifyIsSaving() {
    Sys.WebForms.PageRequestManager.getInstance().add_endRequest(handleEndSaveRequest);
    var mgr = Sage.Services.getService("ClientBindingManagerService");
    if (mgr) {
        mgr.clearDirtyStatus();
    }
};

function handleEndSaveRequest(sender, args) {
    var mgr = Sage.Services.getService("ClientBindingManagerService");
    if (mgr) {
        if (!args.get_error()) {
            mgr.clearDirtyStatus();
        } else {
            mgr.markDirty();
        }
        Sys.WebForms.PageRequestManager.getInstance().remove_endRequest(handleEndSaveRequest);
    }
};

ClientBindingManagerService.prototype.saveForm = function() {
    var btn = $get(this._SaveBtnID);
    if (btn) {
        if ((btn.tagName.toLowerCase() == "input") && (btn.type == "image")) {
            notifyIsSaving();
            Sys.WebForms.PageRequestManager.getInstance()._doPostBack(btn.name, null);
        } else if (btn.onClick) {
            notifyIsSaving();
            btn.onClick();
        }
    }
};

ClientBindingManagerService.prototype.registerResetBtn = function(elemID) {
    if (elemID) {
        var btn = $get(elemID);
        if (btn) {
            $addHandler(btn, "click", this.resetCurrentEntity);
        }
    }
};

ClientBindingManagerService.prototype.registerSaveBtn = function(elemID) {
    if (elemID) {
        var btn = $get(elemID);
        if (btn) {
            $addHandler(btn, "click", notifyIsSaving);
            if (this._SaveBtnID == "") {
                this._SaveBtnID = elemID;
            }
        }
    }
};

ClientBindingManagerService.prototype.registerDialogCancelBtn = function(elemID) {
    if (elemID) {
        var btn = $get(elemID);
        if (btn) {
            $addHandler(btn, "click", this.rollbackCurrentTransaction);
        }
    }
};

ClientBindingManagerService.prototype.registerBoundControls = function(controlList) {
    var mgr = Sage.Services.getService("ClientBindingManagerService");
    if (mgr) {
        if ((mgr._WatchChanges) && (controlList)) {
            var ctrlIDs = controlList.split(",");
            var elem;
            for (var i = 0; i < ctrlIDs.length; i++) {
                elem = $get(ctrlIDs[i]);
                if (elem) {
                    // check here for attribute saying it is a container - if it is, recurse children looking for the correct one(s)...
                    if (elem.attributes["slxcompositecontrol"]) {
                        mgr.findChildControls(elem);
                    } else {
                        mgr.attachChangeHandler(elem);
                    }
                    //if (mgr._ShowWarningOnPageExit) {
                    //    mgr.registerPostBackWarningExceptions(elem);  //if this is a control that contains a link we want to allow it to do its thing without prompting the user
                    //}
                }
            }
        }
        mgr.findWarningExceptions();
    }
};

ClientBindingManagerService.prototype.findChildControls = function(elem) {
    if ((elem) && (elem.attributes) && (elem.attributes["slxchangehook"]) && (!elem.attributes["slxcompositecontrol"])) {
        //alert("found a changehook: \nID: " + elem.id + "\nname: " + elem.name + "\nelem: " + elem);
        this.attachChangeHandler(elem);
    } else {
        if (elem.childNodes) {
            for (var n = 0; n < elem.childNodes.length; n++) {
                this.findChildControls(elem.childNodes[n]);
            }
        }
    }
};

ClientBindingManagerService.prototype.setControlFocus = function(ctrlid) {
    trySelect = function(elem) {
        if ((typeof (elem.select) == "function") || (typeof (elem.select) == "object")) {
            elem.select();
            return true;
        }
        return false;
    };
    var elem = $("#" + ctrlid)[0];
    if (elem) {
        if (trySelect(elem)) { return; }
        elem = $("#" + ctrlid + " TEXTAREA")[0];
        if ((elem) && (trySelect(elem))) { return; }
        elem = $("#" + ctrlid + " INPUT")[0];
        if ((elem) && (trySelect(elem))) { return; }
        elem = $("#" + ctrlid + " SELECT")[0];
        if ((elem) && (trySelect(elem))) { return; }
    }
};

ClientBindingManagerService.prototype.attachChangeHandler = function(elem) {
    if (elem) {
        if ((elem.tagName == "A") || ((elem.tagName == "INPUT") && ((elem.type == "button") || (elem.type == "image") || (elem.type == "submit")))) {
            this.registerChildPostBackWarningExceptions(elem);
        } else {
            try { $removeHandler(elem, "change", this.markDirty); } catch (e) { }
            $addHandler(elem, "change", this.markDirty);
        }
    }
};

ClientBindingManagerService.prototype.registerPostBackWarningExceptions = function(elem) {
    if (elem) {
        elems = $("a,input[type='INPUT'],input[type='BUTTON'],input[type='IMAGE'],input[type='SUBMIT']", elem).get();
        for(var i = 0; i < elems.length; i++) {
            this.registerChildPostBackWarningExceptions(elems[i]);
        }
    }
}
ClientBindingManagerService.prototype.findWarningExceptions = function() {
    var elems = $("span[slxcompositecontrol], div[slxcompositecontrol]").get();
    for(var i = 0; i < elems.length; i++) {
        this.registerPostBackWarningExceptions(elems[i]);
    }
}

ClientBindingManagerService.prototype.registerChildPostBackWarningExceptions = function(elem) {
    if (elem) {
        if ($(elem).hasClass("leavesPage")) {
            return;
        }
        if ((elem.tagName == "A") || ((elem.tagName == "INPUT") && ((elem.type == "button") || (elem.type == "image") || (elem.type == "submit")))) {
            try { $removeHandler(elem, "click", this.skipWarning); } catch (e) { }
            $addHandler(elem, "click", this.skipWarning);
        }
    }
};

ClientBindingManagerService.prototype.turnOffWarnings = function() {
    var mgr = Sage.Services.getService("ClientBindingManagerService");
    if (mgr) {
        mgr._SkipCheck = true;
        var x = window.setTimeout(function() {var mgr = Sage.Services.getService("ClientBindingManagerService"); if (mgr) { mgr._SkipCheck = true }}, 500);  //just in case there is a timer waiting to turn it back on
    }
};

ClientBindingManagerService.prototype.resumeWarning = function() {
    var mgr = Sage.Services.getService("ClientBindingManagerService");
    if (mgr) {
        mgr._SkipCheck = false;
    }
};

ClientBindingManagerService.prototype.skipWarning = function() {
    var mgr = Sage.Services.getService("ClientBindingManagerService");
    if (mgr) {
        mgr._SkipCheck = true;
        var x = window.setTimeout(function() {var mgr = Sage.Services.getService("ClientBindingManagerService"); if (mgr) { mgr._SkipCheck = false }}, 500);
    }
};

ClientBindingManagerService.prototype.resetCurrentEntity = function() {
    doFormReset();
    var mgr = Sage.Services.getService("ClientBindingManagerService");
    if (mgr) {
        var contextservice = Sage.Services.getService("ClientContextService");
        if (contextservice) {
            if (contextservice.containsKey("ResetCurrentEntity")) {
                contextservice.setValue("ResetCurrentEntity", "true");
            } else {
                contextservice.add("ResetCurrentEntity", "true");
            }
        }
        mgr.clearDirtyStatus();
    }
};

ClientBindingManagerService.prototype.rollbackCurrentTransaction = function() {
    doSectionReset("dialog");
    var mgr = Sage.Services.getService("ClientBindingManagerService");
    if (mgr) {
        //alert("rolling back current transaction... " + mgr._entityTransactionID);
        var contextservice = Sage.Services.getService("ClientContextService");
        if (contextservice) {
            if (contextservice.containsKey("RollbackEntityTransaction")) {
                contextservice.setValue("RollbackEntityTransaction", mgr._entityTransactionID);
            } else {
                contextservice.add("RollbackEntityTransaction", mgr._entityTransactionID);
            }
        }
    }
};

function doFormReset() {
    if (document.all) {
        doSectionReset("main");
        doSectionReset("tabs");
        doSectionReset("dialog");
    } else {
        document.forms[0].reset();
    }
};

function doSectionReset(sectionId) {
    function getElements(sectionId, tagName) {
        if ((sectionId == "main") && (document.all.MainContent)) {
            return document.all.MainContent.getElementsByTagName(tagName);
        } else if ((sectionId == "tabs") && (document.all.ctl00_TabControl)) {
            return document.all.ctl00_TabControl.getElementsByTagName(tagName);
        } else if (document.all.ctl00_DialogWorkspace) {
            return document.all.ctl00_DialogWorkspace.getElementsByTagName(tagName);
        } 
        return new Array();
    }
    if (document.all) {
        var elem;
        var elems = getElements(sectionId, "INPUT");
        for (var i = 0; i < elems.length; i++) {
            elem = elems[i];
            if ((elem.type == "checkbox") || (elem.type == "radio")) {
                if (elem.checked != elem.defaultChecked) {
                    elem.checked = elem.defaultChecked;
                }
            } else {
                if (elem.value != elem.defaultValue) {
                    elem.value = elem.defaultValue;
                }
            }
        }
        elems = getElements(sectionId, "TEXTAREA");
        for (var i = 0; i < elems.length; i++) {
            elem = elems[i];
            if (elem.value != elem.defaultValue) {
                elem.value = elem.defaultValue;
            }
        }
        elems = getElements(sectionId, "SELECT");
        for (var i = 0; i < elems.length; i++) {
            elem = elems[i];
            for (var k = 0; k < elem.options.length; k++) {
                elem.options[k].selected = elem.options[k].defaultSelected;
            }
        }
    } else {
        document.forms[0].reset();
    }
};

//var mgr = Sage.Services.getService("ClientBindingManagerService");
//if (mgr) { mgr.rollbackCurrentTransaction(); }

ClientBindingManagerService.prototype.setCurrentTransaction = function(transaction) {
    this._entityTransactionID = transaction;
};

function clearReset() {
    //alert("clearing reset");
    if (Sage.Services) {
        var contextservice = Sage.Services.getService("ClientContextService");
        if (contextservice) {
            if (contextservice.containsKey("ResetCurrentEntity")) {
                contextservice.remove("ResetCurrentEntity");
            }
            if (contextservice.containsKey("RollbackEntityTransaction")) {
                contextservice.remove("RollbackEntityTransaction");
                //alert(contextservice.containsKey("RollbackEntityTransaction"));
            }
        }
    }
};

Sage.Services.addService("ClientBindingManagerService", new ClientBindingManagerService());