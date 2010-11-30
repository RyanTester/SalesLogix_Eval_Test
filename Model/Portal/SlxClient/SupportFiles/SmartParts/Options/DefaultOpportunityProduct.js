Type.registerNamespace("SmartParts.Options");

SmartParts.Options.DefaultOpportunityProduct = function(options) {
    this._options = options;
};

SmartParts.Options.DefaultOpportunityProduct.create = function(id, options) {
    window[id] = new SmartParts.Options.DefaultOpportunityProduct(options);
    window[id].init();
};

SmartParts.Options.DefaultOpportunityProduct.prototype.init = function() {
    this.initProductsTreePanel();
};

SmartParts.Options.DefaultOpportunityProduct.prototype.initProductsTreePanel = function() {
    var self = this;
    var root = new Ext.tree.AsyncTreeNode({text: this._options.productTreeTitle, children: this._options.nodes, id: 'root'});
    var tree = new Ext.tree.TreePanel({
        id: this._options.id + "_tree",
        plugins: new Ext.ux.tree.TreeNodeMouseoverPlugin(), //must use the plugin 
        loader: new Ext.ux.tree.PagingTreeLoader({  //use the extend TreeLoader 
            requestMethod: 'GET',
            dataUrl: 'slxdata.ashx/slx/crm/-/products?format=JSON' + this._options.queryState,
            pageSize:15,    //the count of the childnode to show every time,default 20
            enableTextPaging:true,  //whether to show the pagination's text             
            pagingModel:'remote', //local means client paging ,remote means server paging,default local
            listeners:  
            {
                load: function(loader, node, response)  
                {  
                    if (node.id != 'root')
                    {
                        //If there are children, look to see if the top node is selected.  If yes, select all.
                        node.eachChild(function(child) {
                        child.ui.toggleCheck(node.ui.checkbox.checked);
                        child.ui.onCheckChange();
                        });        
                        self.processSelectedNodes();                           
                    }
                }
            }
        }), 
        root: root,
        rootVisible: false,
        containerScroll: true,
        autoScroll: true,
        animate: false,
        frame: false,
        stateful: true,        
        width: 200,
        height: 330                              
    });

    tree.suspendEvents();
    this._productsTreePanel = tree;
    tree.resumeEvents();
    
    tree.on('checkchange', function(node, checked) {
            tree.suspendEvents();
            if (!node.leaf) 
            {
               if (checked == true)
                {
                    node.expand();
                    node.expandChildNodes(true);
                }   
                node.eachChild(function(child) {
                    child.ui.toggleCheck(checked);
                    child.ui.onCheckChange();
                });                
            }
            tree.resumeEvents();
            
            self.processSelectedNodes();
        });
    
    //root.expand();
    tree.render(this._options.clientId + "_tree_container");
    root.expand();        
};

SmartParts.Options.DefaultOpportunityProduct.prototype.processSelectedNodes = function() {
    var checked = this._productsTreePanel.getChecked();
    var values = [];
    $.each(checked, function() {
        if (this.leaf)
            values.push(this.id);        
    });
    
    $("#" + this._options.selectedNodesClientId).val(values.join(","));
};

if (typeof (Sys) !== 'undefined') Sys.Application.notifyScriptLoaded();