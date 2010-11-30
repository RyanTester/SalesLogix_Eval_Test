
function DependencyLookup(clientId, initCall, size, autoPostBack)
{
    this.ClientId = clientId;
    this.PanelId = clientId + "_Panel";
    this.InitCall = initCall;
    this.LookupControls = new Array();
    this.CurrentIndex = 0;
    this.Size = size + "px";
    this.AutoPostBack = autoPostBack;
    this.panel = null;
} 

function DependencyLookup_CanShow()
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
    
function DependencyLookup_Show()
{
    if (this.CanShow())
    {
        if ((this.panel == null) || (this.panel.element.parentNode == null))
        {
            var lookup = document.getElementById(this.PanelId);
            lookup.style.display = "block";
            this.panel = new YAHOO.widget.Panel(this.PanelId, { visible:false, width:this.Size, fixedcenter:true, constraintoviewport:true, /*x:250, y:200,*/ underlay:"shadow", draggable:true, iframe:true, modal:false });
            this.panel.render();
            if ((this.CurrentIndex == 0) || (this.LookupControls[i] != undefined))
            {
                this.Init();
            }
            for (var i = 0; i < this.CurrentIndex; i++)
            {
                if (this.LookupControls[i] != undefined)
                {
                    var text = document.getElementById(this.LookupControls[i].TextId);
                    var seedVal = "";
                    if (i > 0) 
                    { 
                        seedVal = this.GetSeeds(i); 
                    }
                    if ((text.value != "") || (seedVal != "") || (i == 0))
                    {
                        this.LookupControls[i].CurrentValue = text.value;
                        var listId = this.LookupControls[i].ListId;
                        var list = document.getElementById(listId);
                        if (list.options.length == 0)
                        {
                            this.LookupControls[i].LoadList(seedVal);
                        }
                    }
                }
            }
        }
        this.panel.show();
    }
}
    
function DependencyLookup_AddControl(baseId, listId, textId, type, displayProperty, seedProperty)
{
    var dependCtrl = new dependControl(baseId, listId, textId, type, displayProperty, seedProperty);
    this.LookupControls[this.CurrentIndex] = dependCtrl;
    this.CurrentIndex++;
}  

function DependencyLookup_AddFilters(FilterProp, FilterValue)
{
    var dependCtrl = new dependControl(listId, textId, type, displayProperty, seedProperty);
    this.LookupControls[this.CurrentIndex] = dependCtrl;
    this.CurrentIndex++;
}  

function DependencyLookup_SelectionChanged(index)
{
    if ((index+1) < this.CurrentIndex)
    {
        this.LookupControls[index+1].LoadList(this.GetSeeds(index +1));
        for (var i=index+2; i < this.CurrentIndex; i++)
        {
            this.LookupControls[i].ClearList();
        }
    }
}

function DependencyLookup_Ok()
{
    this.panel.hide();
    for (var i=0; i < this.CurrentIndex; i++)
    {
        var text = document.getElementById(this.LookupControls[i].TextId);
        var list = document.getElementById(this.LookupControls[i].ListId);
        if ((list.selectedIndex != undefined) && (list.selectedIndex != -1))
        {
            text.value = list.options[list.selectedIndex].text;
        }
        else
        {
            text.value = "";
        }
        this.InvokeChangeEvent(text);
    }
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

function DependencyLookup_Init()
{
    eval(this.InitCall);//DependencyLookupInit();
}

function DependencyLookup_InvokeChangeEvent(cntrl)
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

function DependencyLookup_GetSeeds(index)
{
    var result = "";
    for (var i=index; i>0; i--)
    {
        var dependParent = this.LookupControls[i-1];
        var dependChild = this.LookupControls[i];
        var list = document.getElementById(dependParent.ListId);
        if (list.selectedIndex == -1)
        {
            return result;
        }
        var seed = list.options[list.selectedIndex];
        result += dependChild.SeedProperty + "," + seed.text + "|"
    }
    result = result.substr(0, result.length -1);
    return result;
} 

DependencyLookup.prototype.CanShow = DependencyLookup_CanShow;
DependencyLookup.prototype.Show = DependencyLookup_Show;
DependencyLookup.prototype.AddControl = DependencyLookup_AddControl;
DependencyLookup.prototype.SelectionChanged = DependencyLookup_SelectionChanged;
DependencyLookup.prototype.Ok = DependencyLookup_Ok;
DependencyLookup.prototype.Init = DependencyLookup_Init;
DependencyLookup.prototype.InvokeChangeEvent = DependencyLookup_InvokeChangeEvent;
DependencyLookup.prototype.GetSeeds = DependencyLookup_GetSeeds;


dependControl = function(baseId, listId, textId, type, displayProperty, seedProperty)
{
    this.BaseId = baseId;
    this.ListId = listId;
    this.TextId = textId;
    this.Type = type;
    this.DisplayProperty = displayProperty;
    this.SeedProperty = seedProperty;
    this.CurrentValue = "";
}

dependControl.prototype.LoadList = function(seedValue)
{
    if (typeof(xmlhttp) == "undefined") {
        xmlhttp = YAHOO.util.Connect.createXhrObject().conn;
    }
    var vURL = "SLXDependencyHandler.aspx?cacheid=" + this.BaseId + "&type=" + this.Type + "&displayprop=" + this.DisplayProperty + "&seeds=" + seedValue + "&currentval=" + this.CurrentValue;
    xmlhttp.open("GET", vURL, false);
    xmlhttp.send(null);
    this.HandleHttpResponse(xmlhttp.responseText);
}

dependControl.prototype.HandleHttpResponse = function(results)
{
    var list = document.getElementById(this.ListId);
    //var ua = navigator.userAgent.toLowerCase();
    list.innerHTML = "";
    /*    for (var i=list.options.length-1; i >=0; i--)
        {
            list.options.remove(i);
        }*/
    var items = results.split("|");
    for (var i=0; i<items.length; i++)
    {
        if (items[i] == "") continue;
        var parts = items[i].split(",");
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

dependControl.prototype.ClearList = function()
{
    var list = document.getElementById(this.ListId);
    //var ua = navigator.userAgent.toLowerCase();
    //if (ua.indexOf("mozilla") != -1)
    list.innerHTML = "";
    /*    for (var i=list.options.length-1; i >=0; i--)
        {
            list.options.remove(i);
        }*/
}