/*
The normal viewport breaks .net controls postbacks, this viewport appears to fix the issue
If we have layout problems with .net controls we may want to apply the following styles,
but currently they don't look necessary.

css changes:   
    	body {overflow:hidden;margin:0;padding:0;border:0px none;}
		html, body{height:100%;}

*/

Ext.FormViewport = Ext.extend(Ext.Container, {
    initComponent : function() {
        Ext.FormViewport.superclass.initComponent.call(this);
        document.getElementsByTagName('html')[0].className += ' x-viewport';
        this.el = Ext.get(document.forms[0]);
        this.el.setHeight = Ext.emptyFn;
        this.el.setWidth = Ext.emptyFn;
        this.el.setSize = Ext.emptyFn;
        this.el.dom.scroll = 'no';
        this.allowDomMove = false;
        this.autoWidth = true;
        this.autoHeight = true;
        Ext.EventManager.onWindowResize(this.fireResize, this);
        this.renderTo = this.el;
    },

    fireResize : function(w, h){
        this.fireEvent('resize', this, w, h, w, h);
    }
});
Ext.reg('FormViewport', Ext.FormViewport);
