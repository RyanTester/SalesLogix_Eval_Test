// JScript File - populate the ExtJS Tree view

var templateTree;
var templatePanel;

function capFirstLetter(aString) {
    var first = aString.charAt(0).toUpperCase();
    return first + aString.substr(1).toLowerCase();
}
function closeTemplates() {
    templatePanel.hide();
}
function applyData(nodeInfo) {
    document.getElementById("TemplateId").value = nodeInfo.id;
    document.getElementById("TemplateName").value = nodeInfo.name;
    templatePanel.hide();
}
function localizeName(val) {
    if (typeof LitPageLinks[val] != "undefined")
        return LitPageLinks[val];
    return val;
}
function processNode(xnode, treeParent) {
    var newTreeNode;
    var nodeInfo = new Object;
    if (xnode.nodeName.toLowerCase() == 'item') {
        newTreeNode = new Ext.tree.TreeNode({
            text: localizeName(xnode.attributes.getNamedItem("name").nodeValue),
            templateid: xnode.attributes.getNamedItem("litid").nodeValue
        });
        newTreeNode.on("click", function() { applyData({ name: newTreeNode.text, id: xnode.attributes.getNamedItem("litid").nodeValue }); });
    } else {
        newTreeNode = new Ext.tree.TreeNode({
            text: capFirstLetter(localizeName(xnode.nodeName)),
            singleClickExpand: true
        });
    }
    treeParent.appendChild(newTreeNode);
    if (!(xnode.nextSibling == null)) {
        processNode(xnode.nextSibling, treeParent);
    }
    if (!(xnode.firstChild == null)) {  //  && (xnode.attributes.getNamedItem("litid") == null)
        processNode(xnode.firstChild, newTreeNode);
    }
}

function treeInit() {
    templateTree = new Ext.tree.TreePanel({
        rootVisible: false,
        border: false,
        layout: "fit",
        animate: false,
        autoScroll: true
    });
    var root = new Ext.tree.TreeNode({
        title: "Templates"
    });
    templateTree.setRootNode(root);
    var doc = getXMLDoc(document.getElementById("templateXml").innerHTML);
    var xnode = doc.firstChild;
    while (xnode.nodeName.toUpperCase() != "TEMPLATES") {
        xnode = xnode.nextSibling;
    }
    processNode(xnode.firstChild, root);

    templatePanel = new Ext.Window({
        //applyTo: "TemplatePanel",
        id: this._id + "_template_dialog",
        layout: "border",
        closeAction: "hide",
        title: LitPageLinks.pnlTitle,
        plain: true,
        height: 600,
        width: 500,
        stateful: false,
        constrain: true,
        items: [{
            region: "center",
            border: false,
            layout: "fit",
            items: [templateTree]
}],
            buttonAlign: "right",
            buttons: [{
                text: LitPageLinks.btnCancel,
                handler: function() {
                    templatePanel.hide();
                }
}]
            });

            templatePanel.doLayout();
        }
        function setUp() {
            Sys.WebForms.PageRequestManager.getInstance().add_endRequest(treeInit); //pageLoaded(treeInit);
        }
        $(document).ready(function() {
            setUp();
            treeInit();
        });

        var fired = false;
        function getValues(btn) {
            var templatetext;
            var onlyAttachment;
            var sbtext;
            var reqfor;
            var description;
            var inputs = document.getElementsByTagName("input");
            for (var i = 0; i < inputs.length; i++) {
                if (inputs[i].id.indexOf("clientdata") > -1) {
                    dest = inputs[i];
                }
                if (inputs[i].id.indexOf("TemplateName") > -1) {
                    templatetext = inputs[i];
                }
                if (inputs[i].id.indexOf("PrintLiteratureList_2") > -1) {
                    onlyAttachment = inputs[i];
                }
                if (inputs[i].id.indexOf("SendBy_TXT") > -1) {
                    sbtext = inputs[i];
                }
                if (inputs[i].id.indexOf("RequestedFor_LookupText") > -1) {
                    reqfor = inputs[i];
                }
                if (inputs[i].id.indexOf("Description") > -1) {
                    description = inputs[i];
                }

            }
            if ((document.getElementById("TemplateId").value == "") & (!onlyAttachment.checked)) {
                alert(LitWarning_SelectTemplate);
                return false;
            }
            dest.value = document.getElementById("TemplateId").value;
            var total = 0;
            for (var i = 0; i < inputs.length; i++) {
                if (inputs[i].id.indexOf("QRFOR") > -1) {
                    if (inputs[i].value.length > 0) {
                        dest.value += '|' + inputs[i].id.substr(5) + '=' + inputs[i].value;
                        if (!isNaN(parseInt(inputs[i].value))) {
                            total += parseInt(inputs[i].value);
                        } else {
                            alert(LitWarning_UnableToParseQuantity);
                            return false;
                        }
                    }
                }
            }
            if (total == 0) {
                alert(LitWarning_QtyGreaterThanZero);
                return false;
            }
            if (total > 1000000000) {
                alert(LitWarning_MaxOneBillion);
                return false;
            }
            if ((templatetext.value == "") && (!onlyAttachment.checked)) {
                alert(LitWarning_MustSelectTemplate);
                return false;
            }
            var sbdt = new Date(sbtext.value);
            var n = new Date();
            if (sbdt < n + 1) {
                alert(LitWarning_SendByDate);
                return false;
            }
            if (reqfor.value == '') {
                alert(LitWarning_SelectContact);
                return false;
            }
            if (description.value.length > 63) {
                alert(LitWarning_DescriptionLessThan64);
                return false;
            }
            if (fired) {
                return false;
            } else {
                fired = true;
            }
            return true;
        }

        function ShowPanel() {
            //templatePanel.cfg.setProperty("visible",true); 
            templatePanel.show();
            templateTree.expandAll();
            templatePanel.center();
            if (typeof idTemplates === "function") idTemplates();
        }

        /////////////////////////////////////////////////////////////////////////////
        // http://ajax.asp.net/docs/ClientReference/Sys/ApplicationClass/SysApplicationNotifyScriptLoadedMethod.aspx
        /////////////////////////////////////////////////////////////////////////////
        if (typeof (Sys) !== 'undefined') { Sys.Application.notifyScriptLoaded(); }
        /*
        --------------------------------------------------------
        DO NOT PUT SCRIPT BELOW THE CALL TO notifyScriptLoaded()
        --------------------------------------------------------
        */