<%@ Control Language="C#" AutoEventWireup="true" CodeFile="Library.ascx.cs" Inherits="SmartParts_Library_Library" %>
<%@ Register Assembly="Sage.SalesLogix.Web" Namespace="Sage.SalesLogix.Web" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls"
    TagPrefix="SalesLogix" %>
<%@ Register Assembly="System.Web.Extensions, Version=3.5.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35"
    Namespace="System.Web.UI" TagPrefix="asp" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.ScriptResourceProvider" TagPrefix="Saleslogix" %>    

<!-- this control allows the client to read values from a resource file 
Never_lz is referenced in the script below as LibraryResources.Never_lz -->
<SalesLogix:ScriptResourceProvider ID="LibraryResources" runat="server">
    <Keys>
        <SalesLogix:ResourceKeyName Key="File" />
        <SalesLogix:ResourceKeyName Key="Size" />
        <SalesLogix:ResourceKeyName Key="Created" />
        <SalesLogix:ResourceKeyName Key="Revised" />
        <SalesLogix:ResourceKeyName Key="Expires" />
        <SalesLogix:ResourceKeyName Key="Description" />
        <SalesLogix:ResourceKeyName Key="Library" />
        <SalesLogix:ResourceKeyName Key="Never" />
    </Keys>
</SalesLogix:ScriptResourceProvider>

<input type="hidden" id="hidHelpLink" value='<%= HelpLink %>' />

<script type="text/javascript">
    $(document).ready(function() {
        var container = mainViewport.findById('center_panel_center');
        var toFixed = function(n, d) {
            if (typeof d !== "number")
                d = 2;

            var m = Math.pow(10, d);
            var v = Math.floor(parseFloat(n) * m) / m;
            return v;
        };
        var sizeRenderer = function(value, meta, record, rowIndex, columnIndex, store) {
            if (value / (1024*1024) > 0.5) return toFixed(value / (1024*1024), 1) + " MB";
            if (value / (1024) > 0.05) return toFixed(value / (1024), 1) + " KB";
            return value + " B";
        };
        var expiresRenderer = function(value, meta, record, rowIndex, columnIndex, store) {
            if (record.data['expires'] !== true) return LibraryResources.Never; //'Never';            
            if (value) return Ext.util.Format.date(value, ConvertToPhpDateTimeFormat(getContextByKey('userDateFmtStr'))); //Ext.util.Format.date(value, 'Y-m-d');
        };
        var makeRenderer = function(tpl) {
            var t;
            var reported = false;
            try
            {
                t = new Ext.XTemplate(arguments.length > 1 ? Array.prototype.join.call(arguments, '') : tpl.isArray(tpl) ? tpl.join('') : tpl);
                t.compile();
            }
            catch (e)
            {
                Ext.Msg.alert("Error Compiling Template", e.message || e.description);
            }
            return function(value, meta, record, rowIndex, columnIndex, store) {
                var o = {value: value, row: record};
                try
                {
                    /* we need to catch any errors here as they will not be presented in a friendly manner otherwise */
                    /* which makes it very difficult to track them down */
                    return t.apply(o);
                }
                catch (e)
                {
                    if (!reported)
                        Ext.Msg.alert("Error Applying Template", e.message || e.description);
                    reported = true;
                    return value;
                }
            };
        };
        
        var library = new Ext.Panel({
            layout: 'border',
            border: false,
            tbar: new Ext.Toolbar({
                items: [{
                    xtype: 'tbfill'
                }, {
                    icon: "~/ImageResource.axd?scope=global&type=Global_Images&key=Help_16x16",
                    text: false,
                    cls: "x-btn-text-icon x-btn-icon-only",
                    handler: function() { window.open(Ext.get('hidHelpLink').getValue(), 'MCWebHelp'); }
                }]
            }),            
            items: [{
                id: 'library-tree',
                xtype: 'treepanel',
                region: 'west',                
                split: true,            
                width: 150,
                collapsible: false,
                autoScroll: true,
                collapseMode: "mini", 
                border: false,               
                root: new Ext.tree.AsyncTreeNode({
                    id: 'root',
                    text: LibraryResources.Library,
                    expanded: true,
                    listeners: {
                        // this was added to create an id for the automated testing tool
                        load: function(node) {
                            var nodeEl = node.getUI().getAnchor();
                            if (nodeEl != undefined && $(nodeEl).attr("id") != undefined) {
                                $(nodeEl).attr("id", ("node_" + node.id));
                            }
                        }
                    }                    
                }),
                loader: new Ext.tree.TreeLoader({
                    url: 'slxdata.ashx/slx/crm/-/library/directories',
                    requestMethod: 'GET',
                    listeners: {
                        // this was added to create an id for the automated testing tool
                        load: function(loader, node, response) {
                            for (var i = 0; i < node.childNodes.length; i++) {
                                var child = node.childNodes[i];
                                var el = child.getUI().getAnchor();
                                if (el != undefined) {
                                    $(el).attr("id", ("node_" + child.id));
                                }
                            }

                        }
                    }                    
                }),
                listeners: {
                    click: function(node, e) {
                        var l = Ext.getCmp('library-list');
                        
                        l.store.proxy.conn.original = l.store.proxy.conn.original || l.store.proxy.conn.url;
                        l.store.proxy.conn.url = [l.store.proxy.conn.original,'?',Ext.urlEncode({node: node.id})].join('');
                        l.store.load();
                    },
                    render: function() {
                        this.selectPath.defer(10, this, ['root', 'id']);

                        var l = Ext.getCmp('library-list');
                        
                        l.store.proxy.conn.original = l.store.proxy.conn.original || l.store.proxy.conn.url;
                        l.store.proxy.conn.url = [l.store.proxy.conn.original,'?',Ext.urlEncode({node: 'root'})].join('');
                        l.store.load();
                    }
                }              
            },{
                id: 'library-list',
                xtype: 'grid',
                region: 'center',   
                layout: 'fit',             
                border: false,
                autoExpandColumn: 'description',
                viewConfig: {
                    forceFit: false
                },
                columns: [{
                    dataIndex: 'fileName', 
                    header: LibraryResources.File,
                    width: 200,
                    sortable: true,
                    renderer: makeRenderer(
                        '<a href="SmartParts/Attachment/ViewAttachment.aspx?FileId={values.row.id}&amp;Filename={[encodeURIComponent(values.row.data.fileName)]}&amp;DataType=FS" target="FileWin">',
                        '{value}',
                        '</a>'
                    )
                },{
                    dataIndex: 'fileSize', 
                    header: LibraryResources.Size, 
                    width: 100, 
                    sortable: true, 
                    renderer: sizeRenderer
                },{
                    dataIndex: 'createDate',
                    header: LibraryResources.Created,
                    width: 100,
                    sortable: true,
                    renderer: Ext.util.Format.dateRenderer(ConvertToPhpDateTimeFormat(getContextByKey('userDateFmtStr'))) //Ext.util.Format.dateRenderer('Y-m-d')
                },{
                    dataIndex: 'revisionDate',
                    header: LibraryResources.Revised,
                    width: 100,
                    sortable: true,
                    renderer: Ext.util.Format.dateRenderer(ConvertToPhpDateTimeFormat(getContextByKey('userDateFmtStr'))) //Ext.util.Format.dateRenderer('Y-m-d')
                },{
                    dataIndex: 'expireDate', 
                    header: LibraryResources.Expires, 
                    width: 100, 
                    sortable: true, 
                    renderer: expiresRenderer
                },{
                    id: 'description',
                    dataIndex: 'description',
                    width: 200,
                    sortable: true,
                    header: LibraryResources.Description
                }],
                store: new Ext.data.JsonStore({
                    autoLoad: false,
                    url: 'slxdata.ashx/slx/crm/-/library/documents',
                    root: 'items',
                    id: 'id',
                    totalProperty: 'count',
                    fields: ['id', 'fileName', 'fileSize', 'found', 'expires', 'expireDate', 'createDate', 'revisionDate', 'description'],
                    listeners: {
                        // this was added to create an id for the automated testing tool
                        load: function(store, records, index) {
                            for (var i = 0; i < records.length; i++) {
                                var row = Ext.getCmp('library-list').getView().getRow(i);
                                if (row != undefined)
                                    row.id = 'row_' + records[i].id;
                            }
                        }
                    }
                })                             
            }]
        });

        $(container.getEl().dom).find(".x-panel-body").children().hide();        
        
        container.add(library);
        container.doLayout();        
    });  
</script>

