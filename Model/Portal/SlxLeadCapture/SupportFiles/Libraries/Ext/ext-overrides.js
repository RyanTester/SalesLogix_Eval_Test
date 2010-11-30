// Fixes an issue with modal alert dialogs appearing behind loading masks.

//Ext.WindowMgr.zseed = 50000; //this caused picklist drop downs to appear behind the dialog. so removing for now  

// Fixes issue described here: http://extjs.com/forum/showthread.php?t=33896
// This issue caused problems in DateTimePicker changing h:mm AM values to h:00 PM.

if (Ext.version == 2.1) {
    // private
    Date.createParser = function(format) {
        var funcName = "parse" + Date.parseFunctions.count++;
        var regexNum = Date.parseRegexes.length;
        var currentGroup = 1;
        Date.parseFunctions[format] = funcName;

        var code = "Date." + funcName + " = function(input){\n"
          + "var y = -1, m = -1, d = -1, h = -1, i = -1, s = -1, ms = -1, o, z, u, v;\n"
          + "input = String(input);var d = new Date();\n"
          + "y = d.getFullYear();\n"
          + "m = d.getMonth();\n"
          + "d = d.getDate();\n"
          + "var results = input.match(Date.parseRegexes[" + regexNum + "]);\n"
          + "if (results && results.length > 0) {";
        var regex = "";

        var special = false;
        var ch = '';
        for (var i = 0; i < format.length; ++i) {
            ch = format.charAt(i);
            if (!special && ch == "\\") {
                special = true;
            }
            else if (special) {
                special = false;
                regex += String.escape(ch);
            }
            else {
                var obj = Date.formatCodeToRegex(ch, currentGroup);
                currentGroup += obj.g;
                regex += obj.s;
                if (obj.g && obj.c) {
                    code += obj.c;
                }
            }
        }

        code += "if (u){\n"
          + "v = new Date(u * 1000);\n" // give top priority to UNIX time
          + "}else if (y >= 0 && m >= 0 && d > 0 && h >= 0 && i >= 0 && s >= 0 && ms >= 0){\n"
          + "v = new Date(y, m, d, h, i, s, ms);\n"
          + "}else if (y >= 0 && m >= 0 && d > 0 && h >= 0 && i >= 0 && s >= 0){\n"
          + "v = new Date(y, m, d, h, i, s);\n"
          + "}else if (y >= 0 && m >= 0 && d > 0 && h >= 0 && i >= 0){\n"
          + "v = new Date(y, m, d, h, i);\n"
          + "}else if (y >= 0 && m >= 0 && d > 0 && h >= 0){\n"
          + "v = new Date(y, m, d, h);\n"
          + "}else if (y >= 0 && m >= 0 && d > 0){\n"
          + "v = new Date(y, m, d);\n"
          + "}else if (y >= 0 && m >= 0){\n"
          + "v = new Date(y, m);\n"
          + "}else if (y >= 0){\n"
          + "v = new Date(y);\n"
          + "}\n}\nreturn (v && (z || o))?" // favour UTC offset over GMT offset
          + " (Ext.type(z) == 'number' ? v.add(Date.SECOND, -v.getTimezoneOffset() * 60 - z) :" // reset to UTC, then add offset
          + " v.add(Date.MINUTE, -v.getTimezoneOffset() + (sn == '+'? -1 : 1) * (hr * 60 + mn))) : v;\n" // reset to GMT, then add offset
          + "}";

        Date.parseRegexes[regexNum] = new RegExp("^" + regex + "$", "i");
        eval(code);
    };

    // private
    Ext.apply(Date.parseCodes, {
        j: {
            g: 1,
            c: "d = parseInt(results[{0}], 10);\n",
            s: "(\\d{1,2})" // day of month without leading zeroes (1 - 31)
        },
        M: function() {
            for (var a = [], i = 0; i < 12; a.push(Date.getShortMonthName(i)), ++i); // get localised short month names
            return Ext.applyIf({
                s: "(" + a.join("|") + ")"
            }, Date.formatCodeToRegex("F"));
        },
        n: {
            g: 1,
            c: "m = parseInt(results[{0}], 10) - 1;\n",
            s: "(\\d{1,2})" // month number without leading zeros (1 - 12)
        },
        o: function() {
            return Date.formatCodeToRegex("Y");
        },
        g: function() {
            return Date.formatCodeToRegex("G");
        },
        h: function() {
            return Date.formatCodeToRegex("H");
        },
        P: {
            g: 1,
            c: [
              "o = results[{0}];",
              "var sn = o.substring(0,1);", // get + / - sign
              "var hr = o.substring(1,3)*1 + Math.floor(o.substring(4,6) / 60);", // get hours (performs minutes-to-hour conversion also, just in case)
              "var mn = o.substring(4,6) % 60;", // get minutes
              "o = ((-12 <= (hr*60 + mn)/60) && ((hr*60 + mn)/60 <= 14))? (sn + String.leftPad(hr, 2, '0') + String.leftPad(mn, 2, '0')) : null;\n" // -12hrs <= GMT offset <= 14hrs
          ].join("\n"),
            s: "([+\-]\\d{2}:\\d{2})" // GMT offset in hrs and mins (with colon separator)
        }
    });

    // private
    Date.formatCodeToRegex = function(character, currentGroup) {
        // Note: currentGroup - position in regex result array (see notes for Date.parseCodes above)
        var p = Date.parseCodes[character];

        if (p) {
            p = Ext.type(p) == 'function' ? p() : p;
            Date.parseCodes[character] = p; // reassign function result to prevent repeated execution      
        }

        return p ? Ext.applyIf({
            c: p.c ? String.format(p.c, currentGroup || "{0}") : p.c
        }, p) : {
            g: 0,
            c: null,
            s: Ext.escapeRe(character) // treat unrecognised characters as literals
        }
    };

    Date.prototype.getGMTOffset = function(colon) {
        return (this.getTimezoneOffset() > 0 ? "-" : "+")
            + String.leftPad(Math.abs(Math.floor(this.getTimezoneOffset() / 60)), 2, "0")
            + (colon ? ":" : "")
            + String.leftPad(Math.abs(this.getTimezoneOffset() % 60), 2, "0");
    };

    // If browser is IE 7, ExtJs is doing a calculation for the width of the button text and
    // emitting an inline style that is incorrect.  Specifically the style was "width: 19px",
    // which caused the word "Cancel" on an Ext.Msg.prompt to look like "Car". See SlxDefect
    // 1-67721.  The additional checks in the first "if" block were taken from Ext ver. 3.0.
    // The 3.0 version changes the autoWidth property to a function named doAutoWidth().
    Ext.override(Ext.Button, {
        autoWidth: function() {
            if (this.el && this.text && typeof this.width == 'undefined') {
                this.el.setWidth("auto");
                if (Ext.isIE7 && Ext.isStrict) {
                    var ib = this.btnEl;
                    if (ib && ib.getWidth() > 20) {
                        ib.clip();
                        ib.setWidth(Ext.util.TextMetrics.measure(ib, this.text).width + ib.getFrameWidth('lr'));
                    }
                }
                if (this.minWidth) {
                    if (this.el.getWidth() < this.minWidth) {
                        this.el.setWidth(this.minWidth);
                    }
                }
            }
        }
    }); 
    
    //Need override to add isIE8 condition to this autoWidth
    Ext.override(Ext.menu.Menu, {
     autoWidth : function(){
	        var el = this.el, ul = this.ul;
	        if(!el){
	            return;
	        }
	        var w = this.width;
	        if(w){
	            el.setWidth(w);	            
	        }else if(Ext.isIE && !isIE8){
	            el.setWidth(this.minWidth);
	            var t = el.dom.offsetWidth;
	            el.setWidth(ul.getWidth()+el.getFrameWidth("lr"));
	        }
	    }
    });
    
    // In ExtJS 2.0 is not aware of IE8.  This causes all of our isIE6 checks to fail and all 
    // IE6 specific styles are applied in IE8
    // Override isIE6 variable to become aware of IE8 and of isIE7 variable to be true in IE8 scenario
    var isIE6;
    var isIE7; 
    var isIE8;       
    function IECheck() 
    {    
        ua = navigator.userAgent.toLowerCase(),
        check = function(r){
            return r.test(ua);
        };
        var isOpera = check(/opera/);
        var isIE = !isOpera && check(/msie/);
            isIE7 = isIE && check(/msie 7/) || check(/msie 8/);
            isIE8 = isIE && check(/msie 8/);
            isIE6 = isIE && !isIE7 && !isIE8;       
    }
    
    IECheck();
    Ext.isIE6 = isIE6;
    Ext.isIE7 = isIE7;
    Ext.isIE8 = isIE8;

    Ext.override(Ext.grid.GridView, {
        renderUI: function() {

            var header = this.renderHeaders();
            var body = this.templates.body.apply({ rows: '' });


            var html = this.templates.master.apply({
                body: body,
                header: header
            });

            var g = this.grid;

            g.getGridEl().dom.innerHTML = html;

            this.initElements();


            this.mainBody.dom.innerHTML = this.renderRows();
            this.processRows(0, true);

            if (this.deferEmptyText !== true) {
                this.applyEmptyText();
            }

            Ext.fly(this.innerHd).on("click", this.handleHdDown, this);
            this.mainHd.on("mouseover", this.handleHdOver, this);
            this.mainHd.on("mouseout", this.handleHdOut, this);
            this.mainHd.on("mousemove", this.handleHdMove, this);

            this.scroller.on('scroll', this.syncScroll, this);
            if (g.enableColumnResize !== false) {
                this.splitone = new Ext.grid.GridView.SplitDragZone(g, this.mainHd.dom);
            }

            if (g.enableColumnMove) {
                this.columnDrag = new Ext.grid.GridView.ColumnDragZone(g, this.innerHd);
                this.columnDrop = new Ext.grid.HeaderDropZone(g, this.mainHd.dom);
            }

            if (g.enableHdMenu !== false) {
                if (g.enableColumnHide !== false) {
                    this.colMenu = new Ext.menu.Menu({ id: g.id + "-hcols-menu" });
                    this.colMenu.on("beforeshow", this.beforeColMenuShow, this);
                    this.colMenu.on("itemclick", this.handleHdMenuClick, this);
                }
                this.hmenu = new Ext.menu.Menu({ id: g.id + "-hctx" });
                this.hmenu.add(
                { id: "asc", text: this.sortAscText, cls: "xg-hmenu-sort-asc" },
                { id: "desc", text: this.sortDescText, cls: "xg-hmenu-sort-desc" }
            );
                if (g.enableColumnHide !== false) {
                    this.hmenu.add('-',
                    { id: "columns", text: this.columnsText, menu: this.colMenu, iconCls: 'x-cols-icon', handler: function() { return false; } }
                );
                }
                this.hmenu.on("itemclick", this.handleHdMenuClick, this);

            }

            if (g.enableDragDrop || g.enableDrag) {
                this.dragZone = new Ext.grid.GridDragZone(g, {
                    ddGroup: g.ddGroup || 'GridDD'
                });
            }

            this.updateHeaderSortState();

        }
    });
}

