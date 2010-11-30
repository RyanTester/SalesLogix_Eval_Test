/*
  * Infragistics WebUI.Shared CSOM Script: ig_shared.js
  * Version 7.1.20071.40
  * Copyright(c) 2001-2006 Infragistics, Inc. All Rights Reserved.
  */

//VS 02/16/2007
function ig_WebControl(id)
{
	if(arguments.length > 0){
		this.init(id);
	}
}
ig_WebControl.prototype.init=function(id)
{
	this._id=id;
	var o=ig_all[id];
	if(o && o._deleteMe)
		o._deleteMe();
	ig_all[id]=this;
	this._posted=this._postRequest=0;
	ig_shared._isPosted=false;
	// clientViewState
	this.postField = ig_csom.getElementById(this.getClientID() + "_Data");	
	this.clientState = ig_ClientState.createRootNode();	
	this.rootNode = ig_ClientState.addNode(this.clientState, "XMLRootNode");
}

ig_WebControl.prototype.constructor=ig_WebControl;
ig_WebControl.prototype.getElement=function(){return this._element;}
ig_WebControl.prototype.getID=function(){return this._id;}
ig_WebControl.prototype.getUniqueID=function(){return this._uniqueID;}
ig_WebControl.prototype.getClientID=function(){return this._clientID;}


ig_WebControl.prototype.updateControlState = function(propName, propValue) {
	if(this.controlState == null)
		this.controlState = ig_ClientState.addNode(this.rootNode, "ControlState");
		
	ig_ClientState.setPropertyValue(this.controlState, propName, propValue);
	if(this.postField != null)
		this.postField.value = ig_ClientState.getText(this.clientState);	
}

ig_WebControl.prototype.addStateItem  = function(name, value) {
	if(this.stateItems == null)
		this.stateItems = ig_ClientState.addNode(this.rootNode, "StateItems");
	var stateItem = ig_ClientState.addNode(this.stateItems, "StateItem");
	this.updateStateItem(stateItem, name, value);
	return stateItem;
}

ig_WebControl.prototype.updateStateItem = function(stateItem, propName, propValue) {
	ig_ClientState.setPropertyValue(stateItem, propName, propValue);
	if(this.postField != null)
		this.postField.value = ig_ClientState.getText(this.clientState);	
}

ig_WebControl.prototype.fireServerEvent = function(eventName, data)
{
	if(ig_shared._isPosted)
		return;
	if(this._postRequest == -1)
	{
		this._postRequest = 0;
		return;
	}
	this._postRequest = 0;
	try
	{
		ig_shared._isPosted = true;
		__doPostBack(this._uniqueID, eventName + ":" + data);
	}
	catch(e){}
}

ig_WebControl.prototype.removeEventListener = function(name, handler)
{
	var i, evts = this._clientEvents ? this._clientEvents[name] : null;
	if(evts != null) for(i = 0; i < evts.length; i++)
		if(evts[i] != null && evts[i]._handler == handler)
	{
		delete evts[i];
		evts[i] = null;
		return;
	}
}

ig_WebControl.prototype.addEventListener = function(name, handler, obj, post)
{
	if(typeof handler != "function")
		return;
	if(!this._clientEvents) this._clientEvents = new Object();
	var i, evts = this._clientEvents[name];
	if(evts == null)
		evts = this._clientEvents[name] = new Array();
	var i0 = evts.length;
	for(i = 0; i < evts.length; i++)
	{
		if(evts[i] == null)
			i0 = i;
		else if(evts[i]._handler == handler)
			return;
	}
	var evt = new ig_EventObject();
	evt._object = obj;
	evts[i0] = {_webcontrol:this, _eventName:name, _handler:handler, _autoPostBack:(post==true), _event:evt};
}

ig_WebControl.prototype.fireEvent = function(name, evnt)
{
	if(!name || this._isInitializing || !this._clientEvents)
		return false;
	this._postRequest = 0;
	var evt, evts = this._clientEvents[name];
	var cancel = false, post = 0, i = (evts == null) ? 0 : evts.length;
	if(i == 0)
		return false;
	if(evnt == "check")
		return true;
	var args = this.fireEvent.arguments;
	while(i-- > 0)
	{
		if(evts[i] == null)
			continue;
		evt = evts[i]._event;
		evt.reset();
		evt.event=evnt;
		evt.needPostBack=evts[i]._autoPostBack;
		try
		{
			evts[i]._handler(this, evt, args[2], args[3], args[4], args[5], args[6], args[7]);
		}catch(ex){continue;}
		if(evt.cancelPostBack)
			post = -1;
		else if(post == 0 && evt.needPostBack)
			post = 1;
		if(evt.cancel)
			cancel = true;
		evt.event = null;
	}
	if(!cancel || post < 0)
		this._postRequest = post;
	return cancel;
}
ig_WebControl.prototype._decodeProps	= function(props)
{
	for(var i = 0; i < props.length; i++)
	{
		if(props[i] != null)
		{
			if(props[i].push != null)
				this._decodeProps(props[i]);
			if(typeof props[i]=="string")
			{
					
					props[i] = decodeURI(props[i]);
					props[i] = unescape(props[i]).replace(/\+/g," ");
					props[i] = unescape(props[i]);
			} 
		}
	}
}
ig_WebControl.prototype._initControlProps	= function(props)
{	
	this._decodeProps(props);
	this._props = props[0];
	this._uniqueID	= this._props[0];
	this._clientID = this._props[1];
	var i = props[1] ? props[1].length : 0;
	while(i-- > 0) try
	{
		this.addEventListener(props[1][i][0], eval(props[1][i][1]), null, props[1][i][2]);
	}catch(e)
	{window.status = "Can't find " + props[1][i][1];}
	this._objects = props[2];
	this._collections = props[3];
}	

//ig_initShared implements browser independent functionality
function ig_initShared()
{
	// Public Properties
	this.ScriptVersion="5.3.20053.14";
	try{this.AgentName=navigator.userAgent.toLowerCase();}catch(e){this.AgentName="";}
	this.MajorVersionNumber =parseInt(navigator.appVersion);
	//this.AgentName=navigator.userAgent.toLowerCase();
	//this.MajorVersionNumber=parseInt(navigator.appVersion);
	this.IsDom=document.getElementById?true:false;
	this.IsNetscape62=this.AgentName.indexOf("netscape6")>=0;
	var i=this.AgentName.indexOf("netscape/7.");
	this.Netscape7=(i>0)?this.AgentName.charCodeAt(i+11)-48:-1;
	this.IsNetscape=document.layers!=null;
	this.IsNetscape6=(this.IsDom&&navigator.appName=="Netscape");
	this.IsSafari=this.AgentName.indexOf("safari")>=0;
	this.IsFireFox=this.AgentName.indexOf("firefox")>=0;
	this.IsFireFox10=this.AgentName.indexOf("firefox/1.0")>=0;
	this.IsFireFox20=this.AgentName.indexOf("firefox/2.0")>=0;
	this.IsFireFox15=this.IsFireFox20||this.AgentName.indexOf("firefox/1.5")>=0;
	this.IsOpera=this.AgentName.indexOf("opera")>=0;
	this.IsMac=this.AgentName.indexOf("mac")>=0;
	this.IsIE=document.all!=null&&!this.IsOpera&&!this.IsSafari;
	this.IsIE4=this.IsIE&&!this.IsDom;
	this.IsIE4Plus=this.IsIE&&this.MajorVersionNumber>=4;
	this.IsIE5=this.IsIE&&this.IsDom;
	this.IsIE50=this.IsIE5&&this.AgentName.indexOf("msie 5.0")>0;
	this.IsWin=this.AgentName.indexOf("win")>=0;
	this.IsIEWin=this.IsIE&&this.IsWin;
	this.IsIE55=this.IsIEWin&&this.AgentName.indexOf("msie 5.5")>0;
	this.IsIE6=this.IsIEWin&&this.AgentName.indexOf("msie 6.0")>0;
	this.IsIE7=this.IsIEWin&&this.AgentName.indexOf("msie 7.0")>0;
	this.IsIE55Plus = this.IsIE55 || this.IsIE6 || this.IsIE7;
	this.IsStandardsMode=(document.compatMode=="CSS1Compat");
	this.attrID = "ig_mark";
	this._isPosted = false;
	this.isFormPosted = function(){return this._isPosted;}
	// Obtains an element object based on its Id
	this.getElementById = function (tagName)
	{
		if(this.IsIE)
			return document.all[tagName];
		else
			return document.getElementById(tagName);
	}

	this.isArray = function(a) {
		return a!=null && a.length!=null;
	}
	
	this.isEmpty = function(o) {
		return !(this.isArray(o) && o.length>0);
	}
	
	this.notEmpty = function(o) {
		return (this.isArray(o) && o.length>0);
	}

	// Adds an event listener to an html element.
	this.addEventListener=function(elem,evtName,fn,flag)
	{ 
		
		try{if(elem.addEventListener){elem.addEventListener(evtName,fn,flag==true); return;}}catch(ex){}
		try{if(elem.attachEvent){elem.attachEvent("on"+evtName,fn); return;}}catch(ex){}
		eval("var old=elem.on"+evtName);
		var sF=fn.toString();
		var i=sF.indexOf("(")+1;
		try
		{
		if((typeof old =="function") && i>10)
		{
			old=old.toString();
			
			var args=old.substring(old.indexOf("(")+1,old.indexOf(")"));
			args=ig_shared.replace(args," ","");
			if(args.length>0) args=args.split(",");
			
			old=old.substring(old.indexOf("{")+1,old.lastIndexOf("}"));
			
			sF=sF.substring(9,i);
			if(old.indexOf(sF)>=0)return;
			var s="fn=new Function(";
			for(i=0;i<args.length;i++)
			{
				if(i>0)sF+=",";
				s+="\""+args[i]+"\",";
				sF+=args[i];
			}
			sF+=");"+old;
			eval(s+"sF)");
		}
		eval("elem.on"+evtName+"=fn");
		}catch(ex){}
	}

	
	this.removeEventListener = function(elem, evt, fn)
	{ 
		try
		{
			if(elem && elem.removeEventListener)
			{
				elem.removeEventListener(evt, fn);
				return;
			}
		}catch(ex){}
		try
		{
			if(elem && elem.detachEvent)
				elem.detachEvent('on' + evt, fn);
		}catch(ex){}
	}
	// Obtains the proper source element in relation to an event
	this.getSourceElement = function (evnt, o)
	{
		if(evnt.target) // This does not appear to be working for Netscape
			return evnt.target;
		else 
		if(evnt.srcElement)
			return evnt.srcElement;
		else
			return o;
	}
	
	this.getText = function (e){
		if(e==null)return "";
		var i,v=null,ii=(e.childNodes==null)?0:e.childNodes.length;
		for(i=-1;i<ii;i++)
		{
			var ei=(i<0)?e:e.childNodes[i];
			if(ei.nodeName=="#text")v=(v==null)?ei.nodeValue:v+" "+ei.nodeValue;
		}
		if(v!=null)return v;
		if((v=e.text)!=null)return v;
		try{return e.innerText;}catch(ex){}
		try{return e.innerHTML;}catch(ex){}
		return "";
	}
	
	this.setText = function (e, text)
	{
		if(e==null)return false;
		if(text==null)text="";
		var i,ii=(e.childNodes==null)?0:e.childNodes.length;
		for(i=-1;i<ii;i++)
		{
			var ei=(i<0)?e:e.childNodes[i];
			if(ei.nodeName=="#text")
			{
				if(text!=null){ei.nodeValue=text; text=null;}
				else ei.nodeValue="";
			}
		}
		if(text!=null)try
		{
			if(e.text!=null)e.text=text;
			else if(e.innerText!=null)e.innerText=text;
			else e.innerHTML=text;
			text=null;
		}catch(ex){}
		return text==null;
	}
	this.setEnabled = function (e, bEnabled)
	{
		if(this.IsIE)
			e.disabled = !bEnabled;
	}
	this.getEnabled = function (e){
		if(this.IsIE)
			return !e.disabled;
	}

	this.navigateUrl =	function (targetUrl, targetFrame)
	{
		if(targetUrl == null || targetUrl.length == 0)
			return;
		var newUrl=targetUrl.toLowerCase();
		if(newUrl.indexOf("javascript:") == 0)
			eval(targetUrl);
		else 
		if(targetFrame != null && targetFrame!="")	{
			if(ig_shared.getElementById(targetFrame) != null) 
				ig_shared.getElementById(targetFrame).src = targetUrl;
			else {
				var oFrame = ig_searchFrames(top, targetFrame);
				if(oFrame != null)
					oFrame.location=targetUrl;
				else 
				if(targetFrame == "_self" 
					|| targetFrame == "_parent"
					|| targetFrame == "_media"
					|| targetFrame == "_top"
					|| targetFrame == "_blank"
					|| targetFrame == "_search")
					window.open(targetUrl, targetFrame);
				else
					window.open(targetUrl);
			}
		}
		else {
			try {
				location.href = targetUrl;
			}
			catch (x) {
			}
		}
	}
	
	function ig_searchFrames(frame, targetFrame) {
		if(frame.frames[targetFrame] != null)
			return frame.frames[targetFrame];
		var i;
		for(i=0; i<frame.frames.length; i++) {
			var subFrame = ig_searchFrames(frame.frames[i], targetFrame);
			if(subFrame != null)
				return subFrame; 
		}
		return null;
	}
	
	this.findControl=function(startElement,idList,closestMatch){
		var item;
		var searchString="";
		var i=0;
		var partialId=idList.split(":");
		while(partialId[i+1]!=null&&partialId[i+1].length>0){
			searchString+=partialId[i]+".*";
			i++;
		}
		searchString+=partialId[i]+"$";
		var searchExp=new RegExp(searchString);
		var curElement;
		if(startElement != null)
			curElement=startElement.firstChild;
		else
			curElement = window.document.firstChild;
		while(curElement!=null){
			if(curElement.id!=null&&(curElement.id.search(searchExp))!=-1){
				ig_dispose(searchExp);
				return curElement;
			}
			item=this.findControl(curElement,idList);
			if(item!=null){
				ig_dispose(searchExp);
				return item;
			}
			curElement=curElement.nextSibling;		
		}
		ig_dispose(searchExp);
		if(closestMatch)
			return findClosestMatch(startElement,partialId);
		else return null;
	}
	this.createTransparentPanel=function (){
		if(!this.IsIE)return null;
		var transLayer=document.createElement("IFRAME");
		transLayer.style.zIndex=1000;
		transLayer.frameBorder="no";
		transLayer.scrolling="no";
		transLayer.style.filter="progid:DXImageTransform.Microsoft.Alpha(Opacity=0);";
		transLayer.style.visibility='hidden';
		transLayer.style.display='none';
		transLayer.style.position="absolute";
		transLayer.src='javascript:new String("<html></html>")';
		var e = document.body.firstChild;
		document.body.insertBefore(transLayer, e);
		return new ig_TransparentPanel(transLayer);
	}
	
	
	
	
	
	this.isInside=function(evt,container,elem,shift)
	{
		var to=evt.toElement;
		if(to==null)to=evt.relatedTarget;
		if(to!=null && shift!=-1)
		{
			while(to!=null)
			{
				if(to==container)return true;
				to=to.parentNode;
			}
			return false;
		}
		if(elem==null)elem=container; if(shift==null)shift=0;
		var z,x=-evt.clientX,y=-evt.clientY;
		var w=elem.offsetWidth,h=elem.offsetHeight;
		while(elem!=null)
		{
			if((z=elem.offsetLeft)!=null){x+=z; y+=elem.offsetTop;}
			elem=elem.offsetParent;
		}
		return x<-1 && y<-1 && 1<x+w && 2+shift<y+h;
	}
	this.createHoverBehavior= function(objectToCallBackWith,element,mouseOverHandler,mouseOutHandler){
		element.__callBackObject=objectToCallBackWith;
		element.__isEventReady=true;
		objectToCallBackWith.__onFilteredMouseOver=mouseOverHandler;
		objectToCallBackWith.__onFilteredMouseOut=mouseOutHandler;
		this.addEventListener(element,"mouseover",ig_filterMouseOverEvents,false);
		this.addEventListener(element,"mouseout",ig_filterMouseOutEvents,false);
	}
	
	
	this.getCBManager = function(form)
	{
		if(!ig_all._ig_cbManager)
			ig_all._ig_cbManager = new ig_callBackManager(form);
		return ig_all._ig_cbManager;
	}
	
	
	
	
	
	
	
	
	
	
	
	
	this.addCBEventListener = function(evalCtl, elemID)
	{
		if(!this._cbListeners)
			this._cbListeners = new Array();
		var i = -1;
		while(++i < this._cbListeners.length)
			if(this._cbListeners[i].evalCtl == evalCtl)
				return;
		this._cbListeners[i] = {evalCtl:evalCtl, elemID:elemID};
	}
	
	
	
	
	this.addCBSubmitListener = function(fn)
	{
		this.addCBEventListener(fn);
	}
	
	

	
	
	this.getForm = function()
	{
		var form = document.forms[0];
		if(!form && (form = document.form1) == null)
		{
			var i = -1, eds = document.getElementsByTagName('INPUT');
			while(!form && ++i < eds.length)
				form = eds[i].form;
		}
		return form;
	}
	
	
	
	
	this.getElement = function(id, form)
	{
		var e = document.getElementById(id);
		if(e)
			return e;
		if(!form)
			form = this.getForm();
		return form ? form[id] : null;
	}
	
	
	
	
	
	
	
	this.absPosition = function(elem, pan, pos, ie, ed)
	{
		var z, htm = null, e = elem, body = document.body;
		var i = 1, ok = 0, y = 0, x = 0, pe = e;
		var elemH = e ? e.offsetHeight : -1, elemW = e ? e.offsetWidth : 0;
		while(e != null)
		{
			if(ok < 1 || e == body)
			{
				if((z = e.offsetLeft) != null)
					x += z;
				if((z = e.offsetTop) != null)
					y += z;
			}
			if(e.nodeName == "HTML")
				htm = body = e;
			if(e == body)
				break;
			z = e.scrollLeft;
			if(z == null || z == 0)
				z = pe.scrollLeft;
			if(z != null && z > 0)
				x -= z;
			z = e.scrollTop;
			if(z == null || z == 0)
				z = pe.scrollTop;
			if(z != null && z > 0)
				y -= z;
			pe = e.parentNode;
			e = e.offsetParent;
			if(pe.tagName == "TR")
				pe = e;
			if(e == body && pe.tagName == "DIV")
			{
				e = pe;
				ok++;
			}
		}
		if(elem && document.elementFromPoint)
		{
			var xOld = x, yOld = y;
			ok = true;
			var x0 = body.scrollLeft, y0 = body.scrollTop;
			while(++i < 16)
			{
				z = (i > 2) ? ((i & 2) - 1) * (i & 14) / 2 * 5 : 2;
				e = document.elementFromPoint(x + z - x0, y + z - y0);
				if(!e || e == ed || e == elem)
					break;
			}
			if(i > 15 || !e)
				ok = false;
			x += z;
			y += z;
			i = z = 0;
			while(ok && ++i < 22)
			{
				if(z == 0) x--;
				else y--;
				e = document.elementFromPoint(x - x0, y - y0);
				if(!e || i > 20)
					ok = false;
				if(e != ed && e != elem)
					if(z > 0)
						break;
					else
					{
						i = z = 1;
						x++;
					}
			}
			if(ok)
			{
				x--;
				y--;
			}
			else
			{
				x = xOld;
				y = yOld;
			}
		}
		if(!pan)
			return {x:x, y:y};
		ok = pan.style;
		ok.position = 'absolute';
		ok.visibility = 'visible';
		ok.display = '';
		ok.zIndex = 11000;
		ed = ed ? 0 : 20;
		var panH = pan.offsetHeight, panW = pan.offsetWidth;
		var iH = body.clientHeight, iW = body.clientWidth, iL = body.scrollLeft, iT = body.scrollTop;
		if(!iH || iH < 50)
		{
			iH = body.offsetHeight - ed;
			iW = body.offsetWidth - ed;
		}
		z = body;
		while(!htm && (z = z.parentNode) != null)
			if(z.nodeName == 'HTML')
				htm = z;
		if(htm)
		{
			z = htm.clientHeight;
			i = htm.offsetHeight;
			if(z && z > 20 && !ig_shared.IsOpera)
			{
				iH = z;
				iW = htm.clientWidth;
				iL = htm.scrollLeft;
				iT = htm.scrollTop;
			}
		}
		if(elemH < 0)
		{
			x = ++iL;
			y = ++iT;
			elemH = --iH;
			elemW = --iW;
		}
		if(iH < 20)
			iH = 20;
		if(iW < 90)
			iW = 90;
		if(!pos)
			pos = 0;
		if(typeof pos == 'object')
		{
			if((z = pos.x) != null)
				x += z;
			if((z = pos.y) != null)
				y += z;
			pos = 0;
		}
		
		if((pos & 4) != 0)
			x += elemW;
		
		else if((pos & 3) == 3)
			x -= panW;
		
		else if((pos & 1) != 0)
			x += (elemW >> 1) - (panW >> 1);
		
		else if((pos & 2) != 0)
			x += elemW - panW;
		
		if((pos & 8) != 0)
			y += (elemH >> 1) - (panH >> 1);
		
		else if((pos & 16) != 0)
			y += elemH - panH;
		
		else if((pos & 32) != 0)
			y -= panH;
		
		else if((pos & 64) != 0)
			y += elemH;
		if(y + panH > iH + iT)
		{
			
			if((pos & 64) != 0 && y - iT - 3 > panH + elemH)
				y -= panH + elemH;
			else
				y = iH + iT - panH;
		}
		if(y < iT)
			y = iT;
		if(x + panW > iW + iL)
		{
			
			if((pos & 4) != 0 && x - iL - 3 > panW + elemW)
				x -= panW + elemW;
			else
				x = iW + iL - panW;
		}
		if(x < iL)
			x = iL;
		if(ig_csom.IsMac && (ig_csom.IsIE || ig_csom.IsSafari))
		{
			x += ig_csom.IsIE ? 5 : -5;
			y += ig_csom.IsIE ? 11 : -7;
		}
		ok.left = x + 'px';
		ok.top = y + 'px';
		if(ie && (z = ie.Element) != null)
			ie = z;
		if(!ie || (z = ie.style) == null)
			return;
		z.position = 'absolute';
		z.left = --x + 'px';
		z.top = --y + 'px';
		z.width = (panW + 2) + 'px';
		z.height = (panH + 2) + 'px';
		z.visibility = 'visible';
		z.display = '';
		z.zIndex = 10999;
	}
	
	this.isName = function(n)
	{
		return n && n.indexOf('=') < 0 && n.indexOf(':') < 0 && n.indexOf('(') < 0 && n.indexOf(';') < 0 && n.indexOf(',') < 0 && n.indexOf('[') < 0 && n.indexOf('{') < 0 && n.indexOf('\"') < 0 && n.indexOf("'") < 0;
	}
	
	this.replace = function(txt, s0, s1)
	{
		while(txt.indexOf(s0) >= 0)
			txt = txt.replace(s0, s1);
		return txt;
	}
}
function ig_delete(o){ig_dispose(o);}

function ig_filterMouseOverEvents(evt){
	var element=ig_shared.getSourceElement(evt);
	if(!element.__isEventReady){
		while(element!=null && !element.__isEventReady && element.tagName!="BODY")element=element.parentNode;
	}
	if(element.__isEventReady && (element._hasMouse||!ig_isMouseOverSourceAChild(evt,element))) 
	{
		element._hasMouse=true;
		element.__callBackObject.__onFilteredMouseOver(evt);
	}	
}
function ig_filterMouseOutEvents(evt){
	var element=ig_shared.getSourceElement(evt);
	if(!element.__isEventReady){
		while(element!=null && !element.__isEventReady && element.tagName!="BODY")element=element.parentNode;
	}
	if(element&&element.__isEventReady&&!ig_isMouseOutSourceAChild(evt,element)) 
	{
		element._hasMouse=false;
		element.__callBackObject.__onFilteredMouseOut(evt);
	}	
}

function ig_isMouseOverSourceAChild(evt,element){
	var evnt=evt?evt:window.event;
	if(evnt==null)return false;
	var from=evnt.fromElement&&typeof evnt.fromElement!="undefined"?evnt.fromElement:evnt.relatedTarget;
	if(from==element)return true;
	if(from==null)return false;
	return ig_isAChildOfB(from,element);
}
function ig_isMouseOutSourceAChild(evt,element){
	var evnt=window.event?window.event:evt;
	if(!evnt)return false;
	var to=evnt.toElement&&typeof evnt.toElement!="undefined"?evnt.toElement:evnt.relatedTarget;
	if(to==element)return true;
	if(to==null)return false;
	return ig_isAChildOfB(to,element);	
}
function ig_isAChildOfB(a,b){
	if(a==null||b==null)return false;
	while(a!=null){
		a=a.parentNode;
		if(a==b)return true;
	}
	return false;
}
function ig_getWebControlById(id)
{
	var i,o=null;
	if(!ig_shared.isEmpty(id))if((o=ig_all[id])==null)for(i in ig_all)
	{
		if((o=ig_all[i])!=null)if(o._id==id || o._clientID==id || o._uniqueID==id)
			return o;
		o=null;
	}
	return o;
}
if(typeof ig_all !="object")
	var ig_all=new Object();
// cancel response of browser on event
function ig_cancelEvent(e, type)
{
	if(e == null) if((e = window.event) == null) return;
	if(type && e.type != type) return;
	if(e.stopPropagation != null) e.stopPropagation();
	if(e.preventDefault != null) e.preventDefault();
	e.cancelBubble = true;
	e.returnValue = false;
}
function ig_TransparentPanel(transLayer){
	this.Element=transLayer;
	this.show=function(){
		this.Element.style.visibility="visible";
		this.Element.style.display="";
	}
	this.hide=function(){
		this.Element.style.visibility="hidden";
		this.Element.style.display="none";
	}
	this.setPosition=function(top,left,width,height){
		this.Element.style.top=top;
		this.Element.style.left=left;
		this.Element.style.width=width;
		this.Element.style.height=height;
	}
}
if(typeof ig_shared !="object")
	var ig_shared=new ig_initShared();
var ig_csom=ig_shared,ig=ig_shared;

//Emulate 'apply' if it doesn't exist.
if ((typeof Function != 'undefined')&&
    (typeof Function.prototype != 'undefined')&&
    (typeof Function.apply != 'function')) {
    Function.prototype.apply = function(obj, args){
        var result, fn = 'ig_apply'
        while(typeof obj[fn] != 'undefined') fn += fn;
        obj[fn] = this;
        var length=(((ig_shared.isArray(args))&&(typeof args == 'object'))?args.length:0);
		switch(length){
		case 0:
			result = obj[fn]();
			break;
		default:
			for(var item=0, params=''; item<args.length;item++){
			if(item!=0) params += ',';
			params += 'args[' + item +']';
			}
			result = eval('obj.'+fn+'('+params+');');
			break;
		}
        ig_dispose(obj[fn]);
        return result;
    };
}

function findClosestMatch(startElement,partialId){
	var item;
	var searchString="";
	var i=0;
	while(partialId[i+1]!=null&&partialId[i+1].length>0){
		searchString+="("+partialId[i]+")?";
		i++;
	}
	searchString+=partialId[i]+"$";
	var searchExp=new RegExp(searchString);
	var curElement=startElement.firstChild;
	while(curElement!=null){
		if(curElement.id!=null&&(curElement.id.search(searchExp))!=-1){
			return curElement;
		}
		item=findClosestMatch(curElement,partialId);
		if(item!=null)return item;
		curElement=curElement.nextSibling;		
	}
	return null;
}

function ig_EventObject(){
	this.event=null;
	this.cancel=false;
	this.cancelPostBack=false;
	this.needPostBack=false;
	this.reset=function()
	{
		this.event=null;
		this.needPostBack=false;
		this.cancel=false;
		this.cancelPostBack=false;
	}
}

function ig_fireEvent(oControl,eventName)
{
	var i, fn = eventName;
	if(!fn || !oControl) return false;
	if(ig_shared.isName(fn))
	{
		fn += "(oControl";
		for(i = 2; i < ig_fireEvent.arguments.length; i++)
			fn += ", ig_fireEvent.arguments[" + i + "]";
		fn += ");";
	}
	try{eval(fn);}
	catch(i){window.status = "Can't eval " + fn; return false;}
	return true;
}

function ig_dispose(obj)
{
	if(ig_shared.IsIE&&ig_shared.IsWin)	
		for(var item in obj)
		{
			var t = typeof obj[item];
			if(obj[item] && t != 'undefined' && !obj[item].tagName && !obj[item].disposing && t != 'boolean' && t != 'number' && t != 'string' && t != 'function')
			{
				try {
					obj[item].disposing=true;
					ig_dispose(obj[item]);
				} catch(e1) {;}
			}
			try{delete obj[item];}catch(e2){;}
		}
}

function ig_initClientState(){
	this.XmlDoc=document;
	this.createRootNode=function(){
		if(!ig_shared.IsIE){
			var str ='<?xml version="1.0"?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" 	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"> <html xmlns="http://www.w3.org/1999/xhtml"><ClientState id="vs"></ClientState></html>';
			var p = new DOMParser();
			var doc = p.parseFromString(str,"text/xml");
			this.XmlDoc=doc;
			return doc.getElementById("vs");
		}
		if(ig_shared.IsIE50)this.XmlDoc=ig_createActiveXFromProgIDs(["MSXML2.DOMDocument","Microsoft.XMLDOM"]);
		return this.createNode("ClientState");
	}
	this.setPropertyValue=function(element,name,value){
		if(element!=null)element.setAttribute(name,escape(value));
	}
	this.getPropertyValue=function(element,name){
		if(element==null)return "";
		return unescape(element.getAttribute(name));
	}
	this.addNode=function(element,nodeName){
		var newNode=this.createNode(nodeName);
		if(element!=null)element.appendChild(newNode);
		return newNode;
	}
	this.removeNode=function(element,nodeName){
		var nodeToRemove=this.findNode(element,nodeName);
		if(element!=null)
			return element.removeChild(nodeToRemove);
		return null;
	}
	this.createNode=function(nodeName){
		return this.XmlDoc.createElement(nodeName);
	}
	this.findNode=function(element,node){
		if(element==null)return null;
		var curElement=element.firstChild;
		while(curElement!=null){
			if(curElement.nodeName==node || curElement==node){
				return curElement;
			}
			var item=this.findNode(curElement,node);
			if(item!=null)return item;
			curElement=curElement.nextSibling;		
		}
		return null;
	}
	this.getText=function(element){
		if(element==null)return "";
		if(ig_shared.IsIE55Plus)return escape(element.innerHTML);
		return escape(this.XmlToString(element));
	}
	this.XmlToString=function(startElem){
		var str="";
		if(!startElem)return "";
		var curElement=startElem.firstChild;
		while(curElement!=null){
			str+="<"+curElement.tagName+" ";

			for(var i=0; i<curElement.attributes.length;i++)
			{
				var attrib=curElement.attributes[i];
				str+=attrib.nodeName+"=\""+attrib.nodeValue+"\" ";
			}

			str+=">";
			str+=this.XmlToString(curElement);
			str+="</"+curElement.tagName+">";
			curElement=curElement.nextSibling;		
		}
		return str;
	}
}
//
function ig_xmlNode(name)
{
	this.lastChild = null;
	this.name = name;	
	this.getText = function(){return escape(this.toString());}
	this.childNodes = new Array();
	this.toString = function()
	{
		var i, s = (this.name == null) ? "" : "<" + this.name;
		if(this.props != null) for(i = 0; i < this.props.length; i++)
			s += " " + this.props[i].name + "=\"" + this.props[i].value + "\"";
		if(this.name != null) s += ">";
		for(i = 0; i < this.childNodes.length; i++)
			s += this.childNodes[i].toString();
		if(this.name != null) s += "</" + this.name + ">";
		return s;
	}
	this.addNode = function(node, unique)
	{
		if(node == null) return null;
		if(unique == true) if((unique = this.findNode(node)) != null) return unique;		
		if(node.name == null) node = new ig_xmlNode(node);
		node.parentNode = this;
		this.lastChild = node;
		return this.childNodes[this.childNodes.length] = node;
	}
	this.appendChild = this.addNode;
	this.setAttribute = function(name, value)
	{
		if(name == null) return;
		if(this.props == null) this.props = new Array();
		var prop, i = this.props.length;
		value = (value == null) ? "" : value;
		while(i-- > 0)
		{
			prop = this.props[i];
			if(prop.name == name){prop.value = value; return;}
		}
		prop = new Object();
		prop.name = name;
		prop.value = value;
		this.props[this.props.length] = prop;
	}
	this.setPropertyValue = function(name, value){this.setAttribute(name, (value == null) ? value : escape(value));}
	this.findNode = function(node, descendants)
	{
		if(node != null) for(var i = 0; i < this.childNodes.length; i++)
		{
			var n = this.childNodes[i];
			if(n != null)
			{
				if(n.name == node || n == node)
				{
					n.index = i;
					return n;
				}
				if(descendants == true && (n = n.findNode(node)) != null) return n;
			}
		}
		return null;
	}
	this.removeNode=function(n)
	{
		if((n=this.findNode(n))==null)return n;
		var i=-1,j=0,a=new Array(),a0=n.parentNode.childNodes;
		while(++i<a0.length)if(i!=n.index)a[j++]=a0[i];
		n.parentNode.childNodes=a;
		this.lastChild = a.length <= 0 ? null : a[a.length-1] ;
		return n;
	}
	this.getPropertyValue = function(name)
	{
		var i = (this.props == null) ? 0 : this.props.length;
		while(i-- > 0)
			if(this.props[i].name == name)
				return unescape(this.props[i].value);
		return null;
	}
}
function ig_xmlNodeStatic()
{
	this.createRootNode = function(){return new ig_xmlNode("Temp");}
	this.addNode = function(e, n){return (e == null) ? (new ig_xmlNode(n)) : e.addNode(n);}
	this.removeNode = function(e, n){return (e == null) ? e : e.removeNode(n);}
	this.findNode = function(e, n){return (e == null) ? e : e.findNode(n);}
	this.setPropertyValue = function(e, n, v){if(e != null)e.setPropertyValue(n, v);}
	this.getPropertyValue = function(e, n){return (e == null) ? "" : e.getPropertyValue(n);}
	this.getText = function(e)
	{
		var s = "", i = (e == null) ? 0 : e.childNodes.length;
		for(var j = 0; j < i; j++) s += e.childNodes[j].getText();
		return s;
	}
}

try{ig_shared.addEventListener(window, "load", ig_handleEvent);}catch(ex){}
try{ig_shared.addEventListener(window, "unload", ig_handleEvent);}catch(ex){}
try{ig_shared.addEventListener(window, "resize", ig_handleEvent);}catch(ex){}
function ig_findElemWithAttr(elem, attr)
{
	while(elem != null)
	{
		try
		{
			if(elem.getAttribute != null && !ig_shared.isEmpty(elem.getAttribute(attr)))
				return elem;
		}catch(ex){}
		elem = elem.parentNode;
	}
	return null;
}
function ig_handleEvent(evt)
{
	if(evt == null) if((evt = window.event) == null) return;
	var obj, attr = ig_shared.attrID, src = evt.target, type = evt.type;
	if(ig_shared.isEmpty(type)) return;
	var fn = "obj._on" + type.substring(0, 1).toUpperCase() + type.substring(1);
	if(!src)
		src = evt.srcElement;
	if(type == "load" || type == "unload" || type == "resize" || !src)
	{
		for(obj in ig_all)
		{
			if((obj = ig_all[obj]) == null)
				continue;
			eval("if(" + fn + "!=null){" + fn + "(src,evt); obj=null;}");
			if(obj && obj._onHandleEvent)
				obj._onHandleEvent(src, evt);
		}
		if(type == "unload")
		{
			ig_dispose(ig_all);
			for(var id in ig_all) if(ig_all[id])
				ig_all[id].base = null;
		}
		return;
	}
	var elem = ig_findElemWithAttr(src, attr);
	if(elem == null)
		elem = ig_findElemWithAttr(this, attr);
	if(elem != null && (obj = ig_getWebControlById(elem.getAttribute(attr))) != null)
	{
		eval("if(" + fn + "!=null){" + fn + "(src,evt); obj=null;}");
		if(obj != null && obj._onHandleEvent != null)
			obj._onHandleEvent(src, evt);
	}
}
function ig_handleTimer(obj)
{
	var i, all = ig_shared._timers, fn = ig_shared._timerFn;
	if(obj)
	{
		if(!obj._onTimer) return;
		if(!all) ig_shared._timers = all = new Array();
		i = all.length;
		while(i-- > 0) if(all[i] == obj) break;
		if(i < 0) all[all.length] = obj;
		if(!fn) ig_shared._timerFn = fn = window.setInterval(ig_handleTimer, 200);
		return;
	}
	if(!fn) return;
	for(i = 0; i < all.length; i++) if(all[i] && all[i]._onTimer) if(!all[i]._onTimer())
		obj = true;
	if(obj) return;
	window.clearInterval(fn);
	delete ig_shared._timerFn;
}

var ig_ClientState=null;
if(!ig_shared.IsIE55Plus||!ig_shared.IsWin) ig_ClientState = new ig_xmlNodeStatic();
else ig_ClientState=new ig_initClientState();

var _asyncSmartCallbacks = new Array();
var _inCallback = false;
        
function ig_SmartCallback(clientContext, serverContext, callbackFunction, uniqueId, control, waitResponse)
{
    var _callbackFunction;
    var _url = null;
    var _postdata = "";
    var _async = true;
    this._registeredControls = new Array();
    this._control = control;
    this._waitResponse=(waitResponse===true);
    this._progressIndicator = null;
    
    this._registeredControls[0] = {clientContext:clientContext, serverContext:serverContext, callbackFunction:callbackFunction, uniqueId:uniqueId, control:control};
    
	if(typeof XMLHttpRequest != "undefined") {
	   __xmlHttpRequest = new XMLHttpRequest();
	}
	else if(typeof ActiveXObject != "undefined")
	{
	   try{
		    __xmlHttpRequest = ig_createActiveXFromProgIDs(["MSXML2.XMLHTTP","Microsoft.XMLHTTP"]);
	   }
	   catch(e)
	   {
	   }
	}
	
	this.registerControl = function(clientContext, serverContext, callbackFunction, uniqueId, control)
	{
		this._registeredControls.push({clientContext:clientContext, serverContext:serverContext, callbackFunction:callbackFunction, uniqueId:uniqueId, control:control});
	}

	this._xmlHttpRequest = __xmlHttpRequest;
	    
    this.execute = function () 
    {
		var exec = true;
		if(this.beforeCallback != null)
				exec = this.beforeCallback();
		if(exec)
		{
			if(this._progressIndicator != null)
				this._progressIndicator.display();
			this.formatCallbackArguments();
		    this.registerSmartCallback();
		    this._xmlHttpRequest.open("POST", this.getUrl(), !this._waitResponse);
		    this._xmlHttpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		    this._xmlHttpRequest.onreadystatechange = this._responseComplete;
		    this._xmlHttpRequest.send(this.getCallbackArguments());
		 }
    }
   
    this.getCallbackArguments = function () {
        return this._callbackArguments;
    }
    this.setCallbackArguments = function (callbackArguments) {
        this._callbackArguments = callbackArguments;
    }

    this.getUrl = function () {
        if(this._url == null) {
            return this.getForm().action;
        }
        return this._url;
    }

    this.setUrl = function (url) {
        this._url = url;
    }

    this.getForm = function () 
    {
        var form;
        
        if(document.forms.length > 1)
        {
			for(var i = 0; i < document.forms.length; i++)
			{
				if(document.forms[i].method == "post" && document.forms[i].action != "")
				{
					form = document.forms[i];
					break;
				}
			}   
			if(form == null)
				 form = document.forms[0]; 
        }
		else
			form = document.forms[0];
        if (!form) 
            form = document.form1;
        return form;
    }
    
    this.setProgressIndicator = function(value)
    {
		this._progressIndicator = value; 
    }
    
    this._responseComplete = function () 
    {
		var proccessComplete = null;
        for (var i = 0; i < _asyncSmartCallbacks.length; i++) {
            smartCallback = _asyncSmartCallbacks[i];
            if (smartCallback && smartCallback._xmlHttpRequest && (smartCallback._xmlHttpRequest.readyState == 4)) 
            {
				//if(smartCallback && smartCallback._xmlHttpRequest.status == "500")
				//	alert(smartCallback && smartCallback._xmlHttpRequest.responseText);
				_asyncSmartCallbacks[i] = null;
                smartCallback.processSmartCallback();
                proccessComplete = smartCallback;
            }
        }
        if(proccessComplete != null)
        {
            if(proccessComplete.callbackFinished != null)
				proccessComplete.callbackFinished();
			proccessComplete._control = null;
			proccessComplete._registeredControls = null;
			proccessComplete._progressIndicator = null; 
			ig_dispose(proccessComplete);
			proccessComplete = null;
        }
    }

    this.processSmartCallback = function () {
       var responseString = this._xmlHttpRequest.responseText;
       var startIndex = responseString.indexOf("_ig_start");
       var endIndex = responseString.indexOf("_ig_end");
       var length = endIndex;
       if(startIndex > -1 && endIndex > -1) {
            responseString = responseString.substring(startIndex + 9, length); 
            var response = eval(responseString);
            var index;
            for(index = 0; index < response.length; index++) 
            {
                controlResponse = response[index];
                var header = controlResponse[0];
                var payload = controlResponse[1].replace(/\ig_NL/g, "\n");
			
                for(var i = 0; i < this._registeredControls.length; i++)
                {
					if(this._registeredControls[i] != null && header == this._registeredControls[i].uniqueId)
					{
						if(payload.length > 0)
						{
							if(this._registeredControls[i].clientContext.requestType != null && this._registeredControls[i].clientContext.requestType == "styles")
								this._resolveStyles(payload);
							else if(this._registeredControls[i].callbackFunction != null)
								this._registeredControls[i].callbackFunction(payload, this._registeredControls[i].clientContext);
							else if(this._registeredControls[i].control.callbackRender != null)
								this._registeredControls[i].control.callbackRender(payload, this._registeredControls[i].clientContext);
						}
						this._registeredControls[i] = null;
						break;
					}
                }
            }
       }
       if(this._progressIndicator != null)
		this._progressIndicator.hide();
    }
    
    this._resolveStyles = function(response)
    {
        var json = eval(response.replace(/\^/g, "\""));
        var key = json[0];
        var style = eval(json[1]);
        
        if (style && style.length > 0) 
        {
            window._ig_styleCache = window._ig_styleCache || {};            
            window._ig_styleCache[key] = window._ig_styleCache[key] || {rules:{}};
            
            var id = "ig_style_" + key;
            var el = document.getElementById(id);
            var sheet = null;     
           
            if (el)
                if (ig_shared.IsIE)
                    sheet = el.styleSheet;
                else
                    sheet = el.sheet;
            
            if (sheet == null)
            {                            
                el = document.createElement("style");
                el.setAttribute("id", id);
                document.getElementsByTagName('head')[0].appendChild(el);
                
                if (el)
                    if (ig_shared.IsIE)
                        sheet = el.styleSheet;
                    else
                        sheet = el.sheet;                                
            }
            
            /* combine styles */
            var output = [];
            for (var i = 0; i < style.length; i++)
                if (style[i])
                {
                    var rule = style[i][0].replace(/^\s*|\s*$/g,'');
                    var value = style[i][1];
                    
                    output.push(["body", rule, "{", value, "}"].join(' '));                        
                }
            
            if (ig_shared.IsIE)
                sheet.cssText = output.join('\n');
            else
                sheet.innerHTML = output.join('\n');
        }

        // original ig code
        /*
		var json = eval(response.replace(/\^/g, "\""));
		var key = json[0];
		var styleBlock = eval(json[1]);
		if(styleBlock != null && styleBlock.length > 0)
		{
			var styles = document.getElementsByTagName("style");	
			for(var i = 0; i < styles.length; i++)
			{
				var rules;
				
				if(ig_shared.IsIE)
					rules = styles[i].styleSheet.rules
				else
					rules = styles[i].sheet.cssRules
					
				for(var j  = 0; j < rules.length; j++)
				{
					if(rules[j].selectorText.indexOf(key) > -1)
					{
						if(ig_shared.IsIE)
							styles[i].styleSheet.removeRule(j);
						else
							styles[i].sheet.deleteRule(j);
					}	
				}
				for(var j = 0; j < styleBlock.length; j++)
				{
					if(styleBlock[j] != null)
					{
						if(ig_shared.IsIE)
							styles[i].styleSheet.addRule(styleBlock[j][0], styleBlock[j][1], 0);
						else
							styles[i].sheet.insertRule(styleBlock[j][0] + "{" +  styleBlock[j][1] + "}", 0);
					}
				}
			}
		}
		return;	
		*/
    }
    
    this.registerSmartCallback = function () {
        var index;
        for(index = 0; index < _asyncSmartCallbacks.length; index++)
            if(!_asyncSmartCallbacks[index])
                break;
        _asyncSmartCallbacks[index] = this;
        return index;
    }
    
    this.formatCallbackArguments = function () {
        var form = this.getForm();
        if(!form) return;
        var count = form.elements.length;
        var element;
        for (var i = 0; i < count; i++) {
            element = form.elements[i];
            if (element.tagName.toLowerCase() == "input" && (element.type == "hidden" || element.type == 'password' || element.type == 'text' || ((element.type == "checkbox"|| element.type =='radio')&& element.checked))) 
               this.addCallbackField(element.name, element.value);
            else if(element.tagName.toLowerCase() == "textarea")
				this.addCallbackField(element.name, element.value);
			else if(element.tagName.toLowerCase() == "select")
			{
				var o = element.options.length;
				while(o-- > 0)
				{
					if(element.options[o].selected)
						this.addCallbackField(element.name, element.options[o].value);
				}
			}
            
        }   
         
        var args =  _postdata + "__EVENTTARGET=&__EVENTARGUMENT=&" + 
                            "__CALLBACKID=" + 
                           this._registeredControls[0].uniqueId +
                            //this.getServerId() +
                            "&__CALLBACKPARAM=";
        var xml = '&lt;SmartCallback&gt;';
        if(this._registeredControls!= null) {
			for(var i = 0; i < this._registeredControls.length; i++)
			{
				xml += "&lt;Control";
				var control = this._registeredControls[i];
				
				xml += " id='" + control.uniqueId + "'";
				for(property in control.serverContext)
				{
					if(control.serverContext[property] != null) {
						var value = control.serverContext[property].toString();
						while(value.indexOf("'") != -1) {
							value = value.replace("'", "^^");
						}
						
						xml += " " + property + "='" + escape(value) + "'";
					}
				}
				xml += "/&gt;"
			}
        }
        xml += "&lt;/SmartCallback&gt;";
        xml = escape(xml); 
        args += xml; 
        this.setCallbackArguments(args);
    }
    
    this.addCallbackField = function(name, value) {
        _postdata += name + "=" + this.encodeValue(value) + "&";
    }
    
    this.isAsynchronous = function () {
            return _async;
    }
    this.setAsynchronous = function (async) {
        _async = async;
    }
   
    this.encodeValue = function(uri) {
        if(encodeURIComponent != null) 
            return encodeURIComponent(uri);
        else
            return escape(parameter);
    }
}

ig_createCallback = function(method, context ) {
	
	return function() {
		method.apply(context, [null]);
	}
}

var ViewportOrientationEnum = new function() {
   this.Horizontal = 0;
   this.Vertical  = 1;
} 

var AnimationDirectionEnum = new function() {
   this.Up  = 1;
   this.Down  = 2; 
   this.Left = 3;
   this.Right = 4;
} 

var AnimationRateEnum = new function() {
   this.Static = 0;
   this.Accelerate  = 1;
   this.Decelerate  = 2; 
   this.AccelDecel = 3;
   this.Linear = 4;
}  

ig_viewport = function() {
	
	this.createViewport  = function(elem, orientation) {
		if(this.elem) 
			return;

		this.elem = elem;
		this.orientation = orientation;
		
		this.div = document.createElement("div");
		this.div.style.position = "relative";
		this.table = document.createElement("table");
		var tr = document.createElement("tr");
		var tbody = document.createElement("tbody");
		this.td1 = document.createElement("td");
		this.td2 = document.createElement("td");
		this.div.style.overflow = "hidden";
		this.div.style.width = elem.offsetWidth + "px"; 
		this.div.style.height = elem.offsetHeight + "px"; 
		this.table.cellSpacing = "0px"; 
		this.table.cellPadding = "0px";
		this.div.appendChild(this.table);								
		this.table.appendChild(tbody);
		tbody.appendChild(tr);
		tr.appendChild(this.td1);
		
		this.td1.style.verticalAlign = "top";
		this.td2.style.verticalAlign = "top";
		
		if(this.orientation == ViewportOrientationEnum.Horizontal) {
			tr.appendChild(this.td2);
		}
		else {
			tr = document.createElement("tr");
			tbody.appendChild(tr);
			tr.appendChild(this.td2);
		}
		elem.parentNode.insertBefore(this.div, elem);
		this.td1.appendChild(elem);

		this.animate = new ig_SlideAnimation();
	}
	this.transferPositionToDiv = function(elem, oldElem)
	{
		if(elem.style.position != "" && elem.style.position != "static")
		{
			this.div.style.position = elem.style.position;
			elem.style.position = "static";
			if(oldElem)
			    oldElem.style.position = "static";
		}
		this.div.style.top = elem.style.top;
		this.div.style.left = elem.style.left;
		elem.style.top = "";
		elem.style.left = "";
		if(oldElem) {
		    oldElem.style.top = "";
		    oldElem.style.left = "";
		}
	}
	this.scroll = function(eCurrent, eNew, direction, rate) {
		this.direction = direction;
		this.animate.setElement(this.table);
		this.animate.setContainer(this.div);
		this.animate.setDirection(direction);
		this.animate.setRate(rate);

		switch (this.direction) {
			case AnimationDirectionEnum.Down :
			case AnimationDirectionEnum.Right :
				if(this.td1.firstChild != null)
					this.td1.removeChild(this.td1.firstChild);
				this.td1.appendChild(eCurrent);
				if(this.td2.firstChild != null)
					this.td2.removeChild(this.td2.firstChild);
				this.td2.appendChild(eNew);
				this.animate.startPos = 0;
				this.animate.finishPos = this.td1.offsetWidth;
				break;
	
			case AnimationDirectionEnum.Up :
			case AnimationDirectionEnum.Left :
				if(this.td1.firstChild != null)
					this.td1.removeChild(this.td1.firstChild);
				this.td1.appendChild(eNew);
				if(this.td2.firstChild != null)
					this.td2.removeChild(this.td2.firstChild);
				this.td2.appendChild(eCurrent);
				this.div.scrollLeft = this.td1.offsetWidth;
				this.animate.startPos = this.div.scrollLeft;
				this.animate.finishPos = 0;
				break;
		}
		
		this.animate.play();		
	}
}


ig_WebAnimation = function() {
    
    this.timerInterval = 30;
    this.startPos = 0;
	var _inProgress;
	this.eContainer = null;
	this.duration = null; 
	this.cancel = false;
}   
 
ig_WebAnimation.prototype.getElement = function() {
        return this.element;
}
ig_WebAnimation.prototype.setElement = function(value) {
	this.element = value;
}
 ig_WebAnimation.prototype.getTimerInterval = function() {
	return timerInterval;
}
ig_WebAnimation.prototype.setTimerInterval = function(value) {
	timerInterval = value;
}
ig_WebAnimation.prototype.isInProgress = function() {
	return _inProgress;
}

ig_WebAnimation.prototype.cancelAnimation = function() {
    clearTimeout(this.timerId);
	this.cancel = true;
}

ig_WebAnimation.prototype.setContainer = function(container) {
	this.eContainer = container;
}
ig_WebAnimation.prototype.getContainer = function() {
	return this.eContainer;
}

ig_WebAnimation.prototype.onBegin = function() {
}
ig_WebAnimation.prototype.onNext = function() {
}
ig_WebAnimation.prototype.onEnd = function() {
}

ig_WebAnimation.prototype.play = function() {
	this.currentPos = this.startPos;
	this.cancel = false;
	this.begin();
	if(!this.cancel)
		this.timerId = setInterval(ig_createCallback(this.tickHandler, this, null), this.timerInterval);
}

ig_WebAnimation.prototype.tickHandler = function() {
   if(this.cancel || !this.next())
   {
      clearTimeout(this.timerId);
	  this.end();
   }
}
ig_WebAnimation.prototype.getDuration = function() {
	return this.duration; 
}
ig_WebAnimation.prototype.setDuration = function(value) {
	this.duration = value; 
}

ig_WebAnimation.prototype.calcDurationIncrement = function()
{
	return this.distance /(this.duration / this.timerInterval);
}

ig_WebAnimation.prototype.ensureContainer = function(e) {
	var parent = e.parentNode;
	if(parent.getAttribute("container") == '1')
		return;
	if(e.getAttribute("container") == '1')
		return;
	var eDiv = window.document.createElement("DIV");
	eDiv.setAttribute("container", '1');
	eDiv.cssText = 'overflow:hidden; position:absolute;z-index:12000;';

	parent.insertBefore(eDiv, e);
	parent.removeChild(e);
	eDiv.appendChild(e);

}

ig_WebAnimation.prototype.removeContainer = function() {
	var container = this._element;
	var child = container.firstChild;
	if(container.getAttribute("container") != '1'){
		container = container.parentNode;
		if(container.getAttribute("container") != '1')
			return;
	}
	var parent = container.parentNode;
	container.removeChild(child);
	parent.removeChild(container);
	delete container;
	parent.appendChild(child);

}

ig_SlideAnimation.prototype = new ig_WebAnimation();


function ig_SlideAnimation(direction, rate)
{
	this.init(direction, rate);
	return this;
}

ig_SlideAnimation.prototype.init = function(direction, rate) {
	if(direction)
		this.direction = direction;
	else
		this.direction = AnimationDirectionEnum.Right;
	if(rate)
		this.rate = rate;
	else	
		this.rate = AnimationRateEnum.Linear;
}

ig_SlideAnimation.prototype.getDirection = function() {
	return this.direction;
}
ig_SlideAnimation.prototype.setDirection = function(value) {
	this.direction = value;
}
ig_SlideAnimation.prototype.getRate = function() {
	return this.rate;
}
ig_SlideAnimation.prototype.setRate = function(value) {
	this.rate = value;
}

ig_SlideAnimation.prototype.begin = function() {
	switch (this.direction) {
		case AnimationDirectionEnum.Up :
		case AnimationDirectionEnum.Down :
			this.distance = Math.abs(this.finishPos - this.startPos);
			break;
		case AnimationDirectionEnum.Right :
		case AnimationDirectionEnum.Left :
			this.distance = Math.abs(this.finishPos - this.startPos);
			break;
	}
	switch(this.rate) {
		case AnimationRateEnum.Accelerate :
			this.increment = 1;
			break;
		case AnimationRateEnum.Decelerate :
			this.increment = .5 * Math.abs(this.distance);;
			break;
		case AnimationRateEnum.AccelDecel :
			this.midPoint = this.distance / 2;
			this.accel = true;
			this.increment = 1;
			break;
		case AnimationRateEnum.Linear :
			
			if(this.duration != null)
				this.increment = this.calcDurationIncrement();
			else
			{
				if(this.increment == null)
					this.increment = 30; 
				this._originalIncrement = this.increment; 
				this.increment = 1; 
				var totalCount = 0; 
				var temp = 1; 
				var distance = this.distance; 
				while(temp * 2 < this._originalIncrement)
				{
					temp *=2; 
					distance -= temp*2; 
					totalCount++;
				}
				this._acelCount = totalCount; 
				temp = this._originalIncrement; 
				totalCount *= 2; 
				totalCount += parseInt(distance / this._originalIncrement); 
				this._decelCount = totalCount - this._acelCount; 
				this._currentCount = 1; 
			}
				
			break;
	}
	this.onBegin();
}

ig_SlideAnimation.prototype.next = function() {
	switch (this.direction) {
		case AnimationDirectionEnum.Down :
		case AnimationDirectionEnum.Right :
			this.currentPos += this.increment;
			if(this.currentPos > this.finishPos)
				return false;
			if(this.direction == AnimationDirectionEnum.Right)
				this.getContainer().scrollLeft = this.currentPos;
			else
				this.getContainer().scrollTop = this.currentPos;
			break;
		case AnimationDirectionEnum.Up :
		case AnimationDirectionEnum.Left :
			this.currentPos -= this.increment;
			if(this.currentPos < this.finishPos)
				return false;
			if(this.direction == AnimationDirectionEnum.Left)
				this.getContainer().scrollLeft = this.currentPos;
			else
				this.getContainer().scrollTop = this.currentPos;
			break;
	}
	
	switch(this.rate) {
		case AnimationRateEnum.Accelerate :
			this.increment *= 2;
			break;
		case AnimationRateEnum.Decelerate :
			this.increment = Math.max(2, this.increment / 2);
			break;
		case AnimationRateEnum.AccelDecel :
			if(this.accel) {
				if(this.direction == AnimationDirectionEnum.Right || this.direction == AnimationDirectionEnum.Down) {
					if(this.currentPos + this.increment >= this.midPoint) {
						this.accel = false;
						this.increment = this.midPoint / 2;
					}
					else
						this.increment *= 2;
				}
				else {
					if(this.currentPos - this.increment <= this.midPoint) {
						this.accel = false;
						this.increment = this.midPoint / 2;
					}
					else
						this.increment *= 2;
				}
			}
			else {
				this.increment = Math.max(2, this.increment / 2);
			}
			break;			
		case AnimationRateEnum.Linear :
		
			if(this.duration == null)
			{
				if(this._currentCount <= this._acelCount)
					this.increment *=2; 
				else if(this._currentCount > this._decelCount)
				{
					this.increment = Math.pow(2,this._acelCount);
					if(this._acelCount > 3)
						this._acelCount--; 
				}
				else
					this.increment = this._originalIncrement; 
				
				this._currentCount++; 
			}
		
		break;
	}
	
	this.onNext();
	return true;
}

ig_SlideAnimation.prototype.end = function() {
	this.getContainer().scrollLeft = this.finishPos;
	if(this.rate == AnimationRateEnum.Linear && this.duration == null)
	{
		this._currentCount = 0; 
		this.increment = this._originalIncrement; 
	}
	this.onEnd();
}

ig_SlideRevealAnimation.prototype = new ig_SlideAnimation();


function ig_SlideRevealAnimation(direction, rate)
{
	this.init(direction, rate);
	return this;
}

ig_SlideRevealAnimation.prototype.begin = function() {
	this.eContainer.style.overflow = "hidden";
	this.element.style.position = "relative";
	
	this.distance = Math.abs(this.finishPos - this.startPos);
	this.currentPos = this.startPos; 

	switch (this.direction) {
		case AnimationDirectionEnum.Up :
			this.element.style.top  = this.currentPos.toString();
			break;
		case AnimationDirectionEnum.Down :
			this.element.style.display = "";
			this.element.style.top  = this.currentPos.toString();
			break;
		case AnimationDirectionEnum.Right :
			this.element.style.display = "";
			this.element.style.left = this.currentPos.toString();
			break;
		case AnimationDirectionEnum.Left :
			this.element.style.left = this.currentPos.toString();
			break;
	}
	switch(this.rate) {
		case AnimationRateEnum.Accelerate :
			this.increment = 1;
			break;
		case AnimationRateEnum.Decelerate :
			this.increment = .5 * Math.abs(this.distance);;
			break;
		case AnimationRateEnum.AccelDecel :
			this.midPoint = this.distance / 2;
			this.accel = true;
			this.increment = 1;
			break;
		case AnimationRateEnum.Linear :
			if(!this.increment)
				this.increment = 20;
			break;
	}
	this.onBegin();
}

ig_SlideRevealAnimation.prototype.next = function() {
	switch (this.direction) {
		case AnimationDirectionEnum.Down :
		case AnimationDirectionEnum.Right :
			this.currentPos += this.increment;
			if(this.currentPos > this.finishPos)
				return false;
			if(this.direction == AnimationDirectionEnum.Right)
				this.element.style.left = this.currentPos.toString();
			else
				this.element.style.top = this.currentPos.toString();
			break;
		case AnimationDirectionEnum.Up :
		case AnimationDirectionEnum.Left :
			this.currentPos -= this.increment;
			if(this.currentPos < this.finishPos)
				return false;
			if(this.direction == AnimationDirectionEnum.Left)
				this.element.style.left = this.currentPos.toString();
			else
				this.element.style.top = this.currentPos.toString();
			break;
	}
	switch(this.rate) {
		case AnimationRateEnum.Accelerate :
			this.increment *= 2;
			break;
		case AnimationRateEnum.Decelerate :
			this.increment = Math.max(2, this.increment / 2);
			break;
		case AnimationRateEnum.AccelDecel :
			if(this.accel) {
				if(this.direction == AnimationDirectionEnum.Right || this.direction == AnimationDirectionEnum.Down) {
					if(this.currentPos + this.increment >= this.midPoint) {
						this.accel = false;
						this.increment = this.midPoint / 2;
					}
					else
						this.increment *= 2;
				}
				else {
					if(this.currentPos - this.increment <= this.midPoint) {
						this.accel = false;
						this.increment = this.midPoint / 2;
					}
					else
						this.increment *= 2;
				}
			}
			else {
				this.increment = Math.max(2, this.increment / 2);
			}
			break;		
	
	}
	this.onNext();
	return true;
}

ig_SlideRevealAnimation.prototype.end = function() {
	if(this.cancel)
		return;
	if(this.direction == AnimationDirectionEnum.Left ||this.direction == AnimationDirectionEnum.Right)
		this.element.style.left = this.finishPos;
	else
		this.element.style.top = this.finishPos;
	this.onEnd();
}

// Reveal Animation 
ig_RevealAnimation.prototype = new ig_WebAnimation();
function ig_RevealAnimation(direction, rate)
{
	this.init(direction, rate);
	return this;
}

ig_RevealAnimation.prototype.init = function(direction, rate) {
	if(direction)
		this.direction = direction;
	else
		this.direction = AnimationDirectionEnum.Right;
	if(rate)
		this.rate = rate;
	else	
		this.rate = AnimationRateEnum.Linear;
}

ig_RevealAnimation.prototype.getDirection = function() {
	return this.direction;
}
ig_RevealAnimation.prototype.setDirection = function(value) {
	this.direction = value;
}
ig_RevealAnimation.prototype.getRate = function() {
	return this.rate;
}
ig_RevealAnimation.prototype.setRate = function(value) {
	this.rate = value;
}

ig_RevealAnimation.prototype.begin = function() {
    this.element.style.overflow = "hidden";
	this.distance = Math.abs(this.finishPos - this.startPos);
	switch (this.direction) {
		case AnimationDirectionEnum.Up :
			if(!this.startPos)
				this.startPos = this.element.scrollHeight;
			break;
		case AnimationDirectionEnum.Down :
			if(!this.startPos)
				this.startPos = 1;
			break;
	}
	switch(this.rate) {
		case AnimationRateEnum.Accelerate :
			this.increment = 1;
			break;
		case AnimationRateEnum.Decelerate :
			this.increment = .5 * Math.abs(this.distance);;
			break;
		case AnimationRateEnum.AccelDecel :
			this.midPoint = this.distance / 2;
			this.accel = true;
			this.increment = 1;
			break;
		case AnimationRateEnum.Linear :
			if(!this.increment)
				this.increment = 20;
			break;
	}
	this.onBegin();
	this.currentPos = this.startPos;
}

ig_RevealAnimation.prototype.next = function() {
	switch (this.direction) {
		case AnimationDirectionEnum.Down :
			this.currentPos += this.increment;
			if(this.currentPos > this.finishPos)
				return false;
			break;
		case AnimationDirectionEnum.Up :
			this.currentPos -= this.increment;
			if(this.currentPos < this.finishPos)
				return false;
			break;
	}
	this.element.style.height = this.currentPos;
	switch(this.rate) {
		case AnimationRateEnum.Accelerate :
			this.increment *= 2;
			break;
		case AnimationRateEnum.Decelerate :
			this.increment = Math.max(2, this.increment / 2);
			break;
		case AnimationRateEnum.AccelDecel :
			if(this.accel) {
				if(this.direction == AnimationDirectionEnum.Right || this.direction == AnimationDirectionEnum.Down) {
					if(this.currentPos + this.increment >= this.midPoint) {
						this.accel = false;
						this.increment = this.midPoint / 2;
					}
					else
						this.increment *= 2;
				}
				else {
					if(this.currentPos - this.increment <= this.midPoint) {
						this.accel = false;
						this.increment = this.midPoint / 2;
					}
					else
						this.increment *= 2;
				}
			}
			else {
				this.increment = Math.max(2, this.increment / 2);
			}
			break;		
	
	}
	this.onNext();
	return true;
}

ig_RevealAnimation.prototype.end = function() {
	switch (this.direction) {
		case AnimationDirectionEnum.Down :
			this.element.style.height = "";
			break;
		case AnimationDirectionEnum.Up :
			this.element.style.display = "none";
			break;
	}
    this.element.style.overflow = "";
	this.element.style.width = "";
	this.onEnd();
}

var ig_Location = {TopLeft:0, TopCenter:1, TopRight:2, TopInfront:3, TopBehind:4,
	MiddleLeft:8, MiddleCenter:9, MiddleRight:10, MiddleInfront:11, MiddleBehind:12,
	BottomLeft:16, BottomCenter:17, BottomRight:18, BottomInfront:19, BottomBehind:20,
	AboveLeft:32, AboveCenter:33, AboveRight:34, AboveInfront:35, AboveBehind:36,
	BelowLeft:64, BelowCenter:65, BelowRight:66, BelowInfront:67, BelowBehind:68};

function ig_progressIndicator(imageUrl, relativeContainer)
{
	this._img = imageUrl;
	this._rc = relativeContainer;
	this.setImageUrl = function(url)
	{
		
		if(this._elem)
			this._elem.parentNode.removeChild(this._elem);
		this._elem = null;
		this._img = url;
	}
	this.getImageUrl = function()
	{
		return this._img; 
	}
	this.setTemplate = function(html)
	{
		var elem = this._elem;
		if(elem)
		{
			if(elem.tagName == 'DIV' && html)
			{
				elem.innerHTML = html;
				return;
			}
			elem.parentNode.removeChild(elem);
			this._elem = null;
		}
		this._html = html;
	}
	this.getTemplate = function()
	{
		return this._html; 
	}
	this.setLocation = function(location)
	{
		this._location = location;
	}
	this.setCssStyle = function(css)
	{
		this._css = css;
	}
	this.setRelativeContainer = function(elem)
	{
		this._rc = elem;
	}
	this.display = function(rc, loc)
	{
		this.visible = true;
		var elem = this._elem;
		if(!rc)
			rc = this._rc;
		if(!elem)
		{
			var body = document.body, append = !ig_shared.IsIE || document.readyState == 'complete';
			if(this._html)
			{
				elem = document.createElement('DIV');
				if(append)
					body.appendChild(elem);
				else
				
					body.insertBefore(elem,body.firstChild);
				elem.innerHTML = this._html;
			}
			else
			{
				elem = document.createElement('IMG');
				if(append)
					body.appendChild(elem);
				else
				
					body.insertBefore(elem,body.firstChild);
				var img = this._img;
				if(!img)
					img = (typeof ig_pi_imageUrl == 'string') ? ig_pi_imageUrl : '/ig_common/images/ig_progressIndicator.gif';
				elem.src = img;
			}
			elem.unselectable = 'on';
			this._elem = elem;
		}
		if(this._css)
			elem.className = this._css;
		if(loc == null)
			if((loc = this._location) == null)
				loc = ig_Location.BottomRight;
		ig_shared.absPosition(rc, elem, loc);
	}
	this.hide = function()
	{
		this.visible = false;
		if(this._elem)
			this._elem.style.display = 'none';
	}
}

function ig_callBackManager(form)
{
	if(!form)
		if((form = ig_shared.getForm()) == null)
	{

		return;
	}
	this._onUnload = function()
	{
		var f = this._form;
		if(!f)
			return;
		this._form = this._submit = this._style = null;
		ig_shared.removeEventListener(f, 'submit', this._onFormSubmit);
		ig_shared.removeEventListener(f, 'click', this._onFormEvt);
		ig_shared.removeEventListener(f, 'mousedown', this._onFormEvt);
		ig_shared.removeEventListener(f, 'mouseup', this._onFormEvt);
		if(f._ig_cb_submit)
		{
			f.submit = f._ig_cb_submit;
			f._ig_cb_submit = null;
		}
		if(this._onsubmit)
			f.onsubmit = this._onsubmit;
	}
	
	
	
	
	
	
	
	
	
	this.addPanel = function(control, id, elemID, rc, link, ids, post, noResp)
	{
		if(!this._form || !control)
			return;
		var i = -1;
		while(++i < this._panels.length)
			if(this._panels[i].elemID == elemID)
				break;
		this._panels[i] = {control:control, id:id, elemID:elemID, rc:rc, link:link, ids:ids, post:post, noResp:noResp};
	}
	
	
	
	
	
	this.addCallBack = function(control, id, rc, flag)
	{
		var e, ee, j, form = this._form;
		if(!control || !form)
			return;
		if(!this._ok)
		{
			form.submit();
			return;
		}
		if(!id)
		{
			id = control.id;
			rc = control.rc;
			control = control.control;
		}
		var i = null, args = this._submitElem;
		if(args)
		{
			args += '&';
			this._submitElem = null;
		}
		else args = '';
		if(this._wait || this._jsSrcs.length > 0)
			return;
		var id1 = this._elemID, id2 = this._evtElem;
		if(id2)
			id2 = id2.id;
		var triggers = [id2,this._subID,id1];
		if(!id1)
			id1 = id2;
		
		if(control.beforeCBSubmit)
			i = control.beforeCBSubmit(id1);
		var lsnrs = ig_shared._cbListeners;
		var elem, count = lsnrs ? lsnrs.length : 0;
		
		while(count-- > 0)
		{
			var fn = lsnrs[count];
			if(fn) if((fn = fn.evalCtl) != null)try
			{
				if(typeof fn == 'function')
					fn = fn(id1);
				else if(fn)
					fn = eval(fn).onCBSubmit(id1);
				if(!i)
					i = fn;
			}catch(e){}
		}
		if(i == 'fullPostBack')
		{
			form.submit();
			return;
		}
		if(i == 'cancelSubmit' || i === true)
			return;
		var resp = (i != 'cancelResponse'), request = null;
		try
		{
			if(this._ie)
				request = ig_createActiveXFromProgIDs(["MSXML2.XMLHTTP","Microsoft.XMLHTTP"]);
			else
				request = new XMLHttpRequest();
		}catch(e){}
		if(!request)
			return;
		if(resp)
		{
			id1 = this.__id(id1);
			id2 = this.__id(id2);
			ee = this._panels;
			i = ee.length;
			while(i-- > 0 && resp)
			{
				e = ee[i].noResp;
				j = e ? e.length : e;
				while(j-- > 0) if(e[j] == id1 || e[j] == id2)
					resp = false;
			}
		}
		this._wait = true;
		
		var tags = ['INPUT', 'TEXTAREA', 'SELECT'], evs = ['__EVENTTARGET', '__EVENTARGUMENT'];
		
		
		
		
		var vs = control.getCBSubmitElems ? control.getCBSubmitElems(flag) : null;
		var elems = vs ? vs : form.elements;
		var count = j = elems.length;
		if(vs)
		{
			elems = new Array();
			count = 0;
			while(j-- > 0)
			{
				e = vs[j];
				for(var t = 0; t < 3; t++) try
				{
					if(e.tagName == tags[0])
					{
						elems[count++] = e;
						break;
					}
					ee = e.getElementsByTagName(tags[t]);
					for(i = 0; i < ee.length; i++)
						elems[count++] = ee[i];
				}catch(ex){}
			}
			vs = this._vs;
			for(i = 0; i < vs.length; i += 2)
				elems[count++] = form[vs[i]];
		}
		while(count-- > 0)
		{
			if((elem = elems[count]) == null)
				continue;
			var val = null, name = elem.name;
			var tag = ig_csom.isEmpty(name) ? null : elem.tagName;
			i = 2;
			if(tag == tags[0])
			{
				var type = elem.type;
				if(type == 'text' || type == 'password' || type == 'hidden' || ((type == 'checkbox' || type == 'radio') && elem.checked))
					val = elem.value;
			}
			else if(tag == tags[1])
				val = elem.value;
			else if(tag == tags[2])
			{
				var o = elem.options;
				i = o ? o.length : 0;
				while(i-- > 0) if(o[i].selected)
					args += name + '=' + this._encode(o[i].value) + '&';
			}
			if(val != null)
			{
				args += name + '=' + this._encode(val) + '&';
				while(i-- > 0) if(name == evs[i])
				{
					elem.value = '';
					evs[i] = null;
				}
			}
		}
		i = 2;
		while(i-- > 0) if(evs[i])
			args += evs[i] + '=&';
		var postKey = '_' + Math.random(), cb = -1;
		while(++cb < this._callBacks.length)
			if(!this._callBacks[cb])
				break;
		args += '__IG_CALLBACK=' + this._encode(id + '#' + postKey);
		try
		{
			request.open('POST', form.action, true);
			try
			{
				if(this._ie || request.setRequestHeader)
					request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			}catch(e){}
			if(resp)
			{
				if(!(i = this._ie)) try
				{
					i = !request.addEventListener;
				}
				catch(e)
				{
					i = true;
				}
				if(i)
					request.onreadystatechange = this._responseEvt;
				else
					request.addEventListener('load', this._responseEvt, false);
			}
			request.send(args);
			ig_shared._isPosted = false;
			if(resp)
			{
				window.setTimeout("try{ig_all._ig_cbManager._timeOut('" + postKey + "');}catch(i){}", this._timeLimit + 1000);
				cb = this._callBacks[cb] = {request:request, id:id, postKey:postKey, control:control, timer:control._timer, time:(new Date()).getTime(), triggers:triggers};
				if(rc !== false)
				{
					cb.pis = new Array();
					if(!rc || rc.nodeName)
						cb.pis[0] = this._showPI(rc, control);
					else for(i = 0; i < rc.length; i++)
						cb.pis[i] = this._showPI(rc[i], control);
				}
			}
		}
		catch(e)
		{

		}
		this._wait = false;
	}
	
	this._timeOut = function(key)
	{
		var cb, i = this._callBacks.length;
		while(i-- > 0) if((cb = this._callBacks[i]) != null)
			if(cb.postKey == key)
				break;
		if(i < 0)
			return;
		var j = cb.control;
		if(j && j.onError)
			j.onError(6);
		j = cb.pis ? cb.pis.length : 0;
		while(j-- > 0)
			cb.pis[j].hide();
		delete this._callBacks[i];
	}
	
	this._showPI = function(rc, ctl)
	{
		var pis = this._indicators;
		if(!pis)
			pis = this._indicators = new Array();
		var pi = null, j = pis.length, i = -1;
		while(++i < j)
		{
			pi = pis[i];
			if(!pi.visible)
				break;
		}
		if(i == j)
		{
			pi = pis[j] = new ig_progressIndicator();
			if(ctl.fixPI)
				ctl.fixPI(pi);
		}
		if(pi._rc)
			rc = null;
		pi.display(rc);
		return pi;
	}
	
	
	
	
	
	this.setHtml = function(txt, elem)
	{
		if(!txt || !elem)
			return null;
		var i = 0, css = '';
		while(ig_shared.IsOpera)
		{
			var i0 = txt.indexOf('<style ', i), i1 = txt.indexOf('<style>', i), i2 = txt.indexOf('<STYLE ', i), i3 = txt.indexOf('<STYLE>', i);
			if(i > i0 || (i1 >= i && i0 > i1))
				i0 = i1;
			if(i > i0 || (i2 >= i && i0 > i2))
				i0 = i2;
			if(i > i0 || (i3 >= i && i0 > i3))
				i0 = i3;
			i1 = txt.indexOf('>', i0);
			if(i > i0 || i0 > i1)
				break;
			i2 = txt.indexOf('</style>', i0);
			i3 = txt.indexOf('</STYLE>', i0);
			if(i1 > i2 || (i3 > i1 && i2 > i3))
				i2 = i3;
			if(i1 > i2)
				break;
			css += txt.substring(i1 + 1, i2);
			txt = txt.substring(0, i0) + txt.substring(i2 + 8);
			i = i0;
		}
		if(css.length > 5)
			this._setCss(null, css, elem.id + '_ig_css');
		i = -3;
		while((i = txt.indexOf('<&>3', i += 3)) >= 0)
			txt = txt.replace('<&>3', '<&>');
		i = 0;
		while(true)
		{
			var iLen = txt.length;
			var i1 = txt.indexOf('<script', i), i2 = txt.indexOf('<SCRIPT', i);
			if(i1 > i2 && i2 >= i)
				i1 = i2;
			if(i1 < i)
				break;
			var t = this._fixScript(txt, i1);
			if(t == null)
				i = i1 + 7;
			else
				txt = t;
		}
		this._fireBeforeResponse(elem);
		elem.innerHTML = txt;
		return txt;
	}
	
	
	
	
	
	this._fixScript = function(txt, i)
	{
		var i2 = txt.indexOf('>', i);
		if(i2 < i)
			return null;
		var i3 = txt.indexOf('</script>', i2), i4 = txt.indexOf('</SCRIPT>', i2);
		if(i3 > i4 && i4 > i)
			i3 = i4;
		var js = txt.substring(i, i2);
		if(js.toLowerCase().indexOf('javascript') < 0)
			return null;
		var first = js.indexOf('IG_FIRST') > 0;
		js = txt.substring(i2 + 1, i3);
		txt = txt.substring(0, i) + txt.substring(i3 + 9);
		if(js.length < 2)
			return txt;
		if(!this._scripts)
			this._scripts = new Array();
		i = this._scripts.length;
		this._scripts[i] = js;
		if(first)
		{
			while(i-- > 0)
				this._scripts[i + 1] = this._scripts[i];
			this._scripts[0] = js;
		}
		return txt;
	}
	
	
	
	this._fireBeforeResponse = function(elem)
	{
		var el, ec, control, i = -1, lsnrs = ig_shared._cbListeners;
		if(lsnrs) while(++i < lsnrs.length)
		{
			if((el = lsnrs[i].elemID) == null)
				continue;
			if((el = ig_shared.getElement(el, this._form)) == null)
				continue;
			try
			{
				control = eval(ec = lsnrs[i].evalCtl);
			}
			catch(ex)
			{
				continue;
			}
			while((el = el.parentNode) != null)
				if(el == elem)
			{
				if(control.onCBBeforeResponse)
					control.onCBBeforeResponse();
				var cb = this._cb;
				if(!cb || !control.onCBAfterResponse)
					continue;
				if(!cb.lsnrs)
					cb.lsnrs = new Array();
				cb.lsnrs[cb.lsnrs.length] = ec;
			}
		}
	}
	this._form = form;
	
	this._timeLimit = 20000;
	
	this._vs = ['__VIEWSTATE', null, '__EVENTVALIDATION', null];
	
	this._sep = '<&>0';
	
	this._sepLen = this._sep.length;
	
	this._doPostBack = function(target, arg)
	{
		var me = ig_all._ig_cbManager, evt = window.event;
		if(!me || me._wait)
			return ig_cancelEvent(evt, 'submit');
		var pan = me._findPanel(target), form = me._form;
		if(!pan)
		{
			me._evtElem = null;
			me._oldPostBack(target, arg);
			return;
		}
		me._panelToSubmit = pan;
		var e = form ? form.__EVENTTARGET : null;
		if(e)
			e.value = target;
		e = form ? form.__EVENTARGUMENT : null;
		if(e)
			e.value = arg;
		me._elemID = target;
		me._onFormSubmit();
		me._elemID = null;
		ig_cancelEvent(evt, 'submit');
	}
	
	this._isMatch = function(x, v)
	{
		if(x == v)
			return true;
		if(x && x.charCodeAt(0) != 42)
			return false;
		var i = v.lastIndexOf(x = x.substring(1));
		return i >= 0 && i + x.length == v.length;
	}
	this.__id = function(id){return id ? id.replace(/\:/g, '_').replace(/\$/g, '_') : id;}
	
	this._findPanel = function(id, e)
	{
		var j, i, pans = this._panels.length, form = this._form;
		if(this._wait || pans < 1)
			return null;
		if(e)
			id = e.id;
		else if(!id)
			return null;
		var id0 = id;
		id = this.__id(id);
		if(!e && id)
			if((e = ig_shared.getElement(id, form)) == null)
				if((e = ig_shared.getElement(id + "_Data", form)) == null)
					if((e = ig_shared.getElement(id + "_hidden", form)) == null)
						if((e = ig_shared.getElement(id.replace(/\_/g, 'x'), form)) != null)
							if(id0 != id) if((e = ig_shared.getElement(id0, form)) == null)
								e = ig_shared.getElement(id0 + "_Data", form);
		id0 = id;
		while(e || id)
		{
			if(id || (e && e.id)) for(i = 0; i < pans; i++)
			{
				var p = this._panels[i];
				if(e && p.elemID == e.id)
				{
					if(p.post) for(j = 0; j < p.post.length; j++)
						if(this._isMatch(p.post[j], id0))
							return null;
					return p;
				}
				if(p.ids && id) for(j = 0; j < p.ids.length; j++)
					if(this._isMatch(p.ids[j], id0))
						return p;
				if(p.noResp && id) for(j = 0; j < p.noResp.length; j++)
					if(this._isMatch(p.noResp[j], id0))
						return p;
			}
			id = null;
			if(e)
				e = e.parentNode;
		}
		return null;
	}
	
	this._onFormEvt = function(evt)
	{
		if(!evt)
			if((evt = window.event) == null)
				return;
		var elem = evt.target;
		if(!elem)
			if((elem = evt.srcElement) == null)
				elem = this;
		var me = ig_all._ig_cbManager, type = elem.type, tag = elem.tagName, name = elem.name;
		if(!me)
			return;
		me._evtElem = elem;
		me._evtTime = (new Date()).getTime();
		if(evt.type != 'click' || elem.disabled)
			return;
		me._subID = me._submitElem = null;
		var pan = me._findPanel(null, elem);
		if(!pan)
			return;
		var val = null, x = evt.offsetX;
		if(type == 'image' && tag == 'INPUT')
			val = name + '.x=' + (x ? x : 1) + '&' + name + '.y=' + (x ? evt.offsetY : 1);
		else if(type == 'submit' && (tag == 'BUTTON' || tag == 'INPUT'))
			val = name + '=' + me._encode(elem.value);
		else
			return;
		if(ig_csom.notEmpty(me._subID = name))
			me._submitElem = val;
		me._panelToSubmit = pan;
	}
	
	this._encode = function(val)
	{
		return (typeof encodeURIComponent == 'function') ? encodeURIComponent(val) : escape(val);
	}
	
	this._restore = function()
	{
		for(var i = 0; i < 3; i += 2)
		{
			var val = this._vs[i + 1], e = ig_shared.getElement(this._vs[i], this._form);
			if(e && val)
				e.value = val;
		}
	}
	
	
	this._onFormSubmit = function(evt, me)
	{
		var my = me && me._vs;
		if(!my)
		{
			me = ig_all._ig_cbManager;
			if(!evt)
				evt = window.event;
		}
		if(me && me._wait)
			me = null;
		if(me && me._onsubmit && !my)
		{
			try
			{
				if(me._onsubmit() === false)
					me = null;
			}catch(ex)
			{
				me = null;
			}
			if(evt && evt.returnValue == false)
				me = null;
		}
		if(!me)
			return ig_cancelEvent(evt, 'submit');
		var form = me._form, pan = me._panelToSubmit, pp = me._panels;
		if(!pan || !form || form.action != form._ig_cb_act)
			return true;
		ig_cancelEvent(evt, 'submit');
		
		var p, rc = pan.rc, i = pp.length, id = pan.link;
		if(id) while(i-- > 0)
			if((p = pp[i]) != null)
				if(p.elemID == id || p.id == id)
					pan = p;
		if(pan)
			me.addCallBack(pan.control, pan.id, rc ? rc : pan.rc);
		me._panelToSubmit = null;
		me._evtElem = null;
		return false;
	}
	
	this._responseEvt = function()
	{
		var me = ig_all._ig_cbManager;
		if(!me || me._wait)
			return;
		for(var i = 0; i < me._callBacks.length; i++)
		{
			var j = -1, cb = me._callBacks[i];
			if(cb && me._doResponse(cb))
			{
				if(cb.pis)
					j = cb.pis.length;
				while(j-- > 0)
					cb.pis[j].hide();
				me._cb = me._scripts = null;
				delete me._callBacks[i];
				if(!me._jsWait && cb.timer)
					me._timer(cb.id, true);
			}
		}
	}
	
	this._doCss = function(e, v)
	{
		e.cssText = v;
		var e1, ss = document.styleSheets;
		var i = ss.length;
		while(i-- > 0)
		{
			e1 = ss[i];
			if(e1 == e)
				return;
			if(!e1.readOnly && !e1.disabled && e1.type == 'text/css')
				break;
		}
		if(i < 0)
			return;
		
	}
	
	this._doResponse = function(cb)
	{
		var request = cb.request;
		if(!request || request.readyState != 4)
			return false;
		var txt = request.responseText, sep = this._sep, sepLen = this._sepLen;
		if(!txt)
			return (new Date()).getTime() - cb.time > this._timeLimit;
		this.serverError = null;
		var e, i, i0 = txt.indexOf(sep);
		var iID = txt.indexOf(sep, i0 + sepLen);
		var iKey = txt.indexOf(sep, iID + sepLen);
		if(i0 < 0 || iID < 0 || iKey < 0)
		{

			return false;
		}
		this.triggers = cb.triggers;
		this._jsWait = false;
		var id = txt.substring(i0 + sepLen, iID), postKey = txt.substring(iID + sepLen, iKey);
		this._error = 0;
		if(postKey.indexOf('<error>') == 0)
		{
			i = this._panels.length;
			this.serverError = txt.split(this._sep)[3];
			while(i-- > 0)
			{
				e = this._panels[i].control;
				if(e && e.onError)
					e.onError(1);
			}
			var lsnrs = ig_shared._cbError;
			i = lsnrs ? lsnrs.length : 0;
			
			while(i-- > 0)try
			{
				lsnrs[i](cb.control,cb.triggers,this.serverError);
			}catch(e){}
			this._restore();
			try
			{
				this._submit(9);
			}catch(e){}
			return true;
		}
		if(id == cb.id && postKey == cb.postKey)
		{
			if(this._cb)
			{
				window.setTimeout("try{ig_all._ig_cbManager._responseEvt();}catch(i){}", 1);
				return this._killCB++ > 20;
			}
			this._cb = cb;
			this._killCB = 0;
			txt = txt.substring(iKey + sepLen);
			var vals = txt.split(sep), old = this._vs;
			for(i = 2; i < vals.length - 1; i += 2)
			{
				var index = -1, v0 = vals[i], v1 = vals[i + 1];
				if(v0 == old[2])
					index = 2;
				else if(v0 == old[0])
					index = 0;
				else if(v0 && v0.indexOf('<') != 0)
					continue;
				vals[i] = vals[i + 1] = null;
				if(index > -1)
				{
					e = ig_shared.getElement(v0, this._form);
					if(e)
					{
						old[index + 1] = e.value;
						e.value = v1;
					}
				}
				else if(v0 == '<script>')
					this._scripts = new Array(v1);
				else if(v0 == '<jssrc>')
				{
					e = document.scripts;
					if(!e || e.length < 2)
						e = document.getElementsByTagName('SCRIPT');
					if(!e)
						continue;
					var s, x = -1, src = '';
					while(++x < e.length) if(e[x]) if((s = e[x].src) != null)
						src += s;
					v1 = v1.split('|');
					this._scriptCount = 0; x = -1;
					while(++x < v1.length)
					{
						s = v1[x].replace('&amp;','&');
						if(src.indexOf((s.charCodeAt(0) < 47) ? s.substring(1) : s) < 0)
							this._addJS(this._runScript(s, true), s, cb);
					}
				}
				else if(v0 == '<style>')
					this._setCss(this._style, v1);
			}
			var ctl = cb.control;
			
			if(vals[0] == '<error>')
			{
				this.serverError = vals[1];
				this._error = 2;
			}
			else if(ctl && ctl.doResponse) try
			{
				ctl.doResponse(vals, this);
			}catch(e){this._error |= 4;}
			cb._js = this._scripts;
			if(this._jsWait)
				window.setTimeout("try{ig_all._ig_cbManager._killJsSrc('" + id + "');}catch(i){}", 3000);
			else
				this._jsDelay(cb);
			if(this._error > 0 && ctl.onError)
				ctl.onError(this._error);
			return true;
		}

		return false;
	}
	
	
	
	this._setCss = function(e, v, id)
	{
		try
		{
			if(!id && document.createStyleSheet)
			{
				var e0 = e ? e.owningElement : null;
				e = e0 ? e0.parentElement : null;
				if(e && e.parentNode)
					e.removeChild(e0);
				this._doCss(this._style = document.createStyleSheet(), v);
				return;
			}
			if(id)
				e = document.getElementById(id);
			if(!e)
			{
				e = document.createElement('STYLE');
				e.type = 'text/css';
				var h = document.getElementsByTagName('HEAD');
				h = (h && h.length > 0) ? h[0] : document.body;
				h.appendChild(e);
				if(id)
					e.id = id;
				else
					this._style = e;
			}
			e.innerHTML = v;
		}catch(e)
		{
			this._error |= 32;
		}
	}
	
	this._jsDelay = function(cb)
	{
		if(!cb)
			return;
		var i, ctl = cb.control, js = cb._js;
		cb.control = cb._js = null;
		if(js) for(i = 0; i < js.length; i++)
			this._runScript(js[i]);
		
		
		if(cb.lsnrs) for(i = 0; i < cb.lsnrs.length; i++) try
		{
			eval(cb.lsnrs[i]).onCBAfterResponse();
		}catch(ex){}
		cb.lsnrs = null;
		
		if(ctl && ctl.afterCBResponse)
			ctl.afterCBResponse();
	}
	
	
	
	
	this._addJS = function(se, src, cb)
	{
		if(!se)
			return;
		this._jsWait = true;
		var js = this._jsSrcs;
		var j = -1, jL = js.length;
		while(++j < jL) if(js[j].src == src)
		{
			js[j].cb[js[j].cb.length] = cb;
			return;
		}
		js[jL] = {se:se,src:src,cb:[cb]};
		ig_shared.addEventListener(se, 'readystatechange', this._removeJS);
	}
	
	
	
	this._removeJS = function(se)
	{
		var me = ig_all._ig_cbManager;
		if(!me || !se)
			return;
		var e = se.srcElement;
		if(e)
		{
			if(e.readyState != 'loaded')
				return;
			se = e;
		}
		ig_shared.removeEventListener(se, 'readystatechange', me._removeJS);
		var js = me._jsSrcs;
		var x, i, cbx, cb = null, j = -1, jL = js ? js.length : 0;
		while(++j < jL) if(js[j].se == se)
		{
			cb = js[j].cb;
			js[j].se = null;
		}
		i = cb ? cb.length : 0;
		while(i-- > 0)
		{
			var cbi = cb[i];
			j = jL;
			while(j-- > 0 && cbi) if(js[j].se)
			{
				cbx = js[j].cb;
				x = cbx.length;
				while(x-- > 0) if(cbx[x] == cbi)
				{
					cbi = null;
					break;
				}
			}
			if(!cbi)
				continue;
			j = jL;
			while(j-- > 0)
			{
				if(js[j].se)
					se = null;
				cbx = js[j].cb;
				x = cbx.length;
				while(x-- > 0) if(cbx[x] == cbi)
					delete cbx[x];
			}
			if(se)
			{
				while(++j < jL)
					delete js[j];
				me._jsSrcs = new Array();
			}
			me._jsDelay(cbi);
			if(cbi.timer)
				me._timer(cbi.id, true);
		}
	}
	
	this._killJsSrc = function(id)
	{
		var me = ig_all._ig_cbManager;
		var js = me ? me._jsSrcs : null;
		var j = js ? js.length : 0;
		while(j-- > 0)
		{
			var x = -1, cbx = js[j].cb;
			while(++x < cbx.length)
				if(cbx[x] && cbx[x].id == id)
					me._removeJS(js[j].se);
		}
	}
	
	
	
	this._timer = function(id, wait)
	{
		var me = ig_all._ig_cbManager;
		var pan, cb = me ? me._callBacks : null;
		var i = cb ? cb.length : 0;
		while(i-- > 0) if(cb[i] && cb[i].id == id)
			return;
		i = me._panels.length;
		while(i-- > 0)
		{
			pan = me._panels[i];
			if(pan.id == id)
				break;
		}
		if(i >= 0)
			i = pan.control._timer;
		if(!i || i < 1)
			return;
		if(!wait)
		{
			pan.wait = false;
			me.addCallBack(pan);
			return;
		}
		if(!pan.wait)
			window.setTimeout("try{ig_all._ig_cbManager._timer('" + id + "');}catch(i){}", i);
		pan.wait = true;
	}
	
	this._runScript = function(js, src)
	{
		var e = document.getElementsByTagName('HEAD');
		e = (e && e.length > 0) ? e[0] : document.body;
		if(js && js.length > 1) try
		{
			var se = document.createElement('SCRIPT');
			se.type = 'text/javascript';
			if(src)
				se.src = js;
			else
				se.text = js;
			e.appendChild(se);
			if(src && document.all)
				return se;
		}
		catch(ex)
		{
			this._error |= 16;

		}
	}
	
	this.newPanel = function(id, uid, ids, prop, post, noResp)
	{
		var elem = document.getElementById(id);
		if(!elem)
			return;
		var o = ig_all[id];
		if(o)
			ig_dispose(o);
		var pi = {loc:ig_Location.MiddleCenter};
		pi.setImageUrl = function(v){this.url = v;}
		pi.getImageUrl = function(){return this.url;}
		pi.setTemplate = function(v){this.html = v;}
		pi.getTemplate = function(){return this.html;}
		pi.setLocation = function(v){this.loc = v;}
		pi.getLocation = function(){return this.loc;}
		o = ig_all[id] = {_id:id, _uniqueID:uid, _element:elem, _pi:pi, _evts:prop};
		var t = o._timer = prop[5] ? prop[5] : 0;
		o.getTimer = function(){return this._timer;}
		o.setTimer = function(v){this._timer = v;}
		o.getID = function(){return this._id;}
		o.getUniqueID = function(){return this._uniqueID;}
		o.getElement = function(){return this._element;}
		o.getProgressIndicator = function(){return this._pi;}
		o.findControl = function(id){return ig_shared.findControl(this._element, id);}
		o._fire = function(evt, p3)
		{
			evt = this._evts ? this._evts[evt] : null;
			if(!evt)
				return false;
			var evtO = new ig_EventObject();
			ig_fireEvent(this, ig_shared.replace(evt, "&quot;", "'"), evtO, p3);
			if(evtO.cancelResponse)
				return 'cancelResponse';
			if(evtO.fullPostBack)
				return 'fullPostBack';
			return evtO.cancel;
		}
		o.beforeCBSubmit = function(src){return this._fire(1, src);}
		o.afterCBResponse = function(){this._fire(3);}
		o.onError = function(flags){this._fire(4, flags);}
		o.doResponse = function(vals, man)
		{
			if(!this._fire(2)) for(var i = 0; i + 1 < vals.length; i += 2)
			{
				var e, v, v0 = vals[i], v1 = vals[i + 1];
				if(!v0)
					continue;
				if(v0.indexOf('-') == 0)
				{
					e = ig_shared.getElement(v = v0.substring(2), man._form);
					if(!e)
						e = ig_shared.getElement(man.__id(v), man._form);
					if(e)
						v0 = v0.charCodeAt(1);
					if(v0 == 51)
						e.innerHTML = v1;
					else if(v1 == '&nbsp;')
						v1 = '';
					if(v0 == 48)
						e.value = v1;
					if(v0 == 49)
						e.checked = v1.toLowerCase() == 'true';
					if(v0 == 50)
						e.selectedIndex = parseInt(v1);
					if(v0 == 52)
						e.src = v1;
					continue;
				}
				e = ig_getWebControlById(v0);
				if(e)
				{
					man.setHtml(v1, e._element);
					continue;
				}
				try
				{
					var multi = v0.indexOf('+') == 0;
					e = eval(multi ? v0.substring(1) : v0);
					if(e && e.doResponse)
					{
						if(multi)
						{
							v1 = parseInt(v1);
							v0 = new Array();
							while(v1-- > 0)
							{
								v0[v0.length] = vals[i += 2];
								v0[v0.length] = vals[i + 1];
							}
						}
						else
							v0 = [v0,v1];
						e.doResponse(v0, man);
					}
				}catch(e){man._error |= 8;}
			}
		}
		o.fixPI = function(pi)
		{
			var p = this._pi;
			pi.setLocation(p.loc);
			if(p.url)
				pi.setImageUrl(p.url);
			else if(p.html)
				pi.setTemplate(p.html);
		}
		o.refresh = function()
		{
			try
			{
				ig_all._ig_cbManager.addCallBack(this, this._uniqueID, this._element);
			}catch(e){}
		}
		this.addPanel(o, uid, id, elem, null, ids, post, noResp);
		o._fire(0);
		if(t > 0)
			window.setTimeout("try{ig_all._ig_cbManager._timer('" + id + "');}catch(i){}", t);
	}
	
	
	this._submit = function(flag)
	{
		var me = ig_all._ig_cbManager;
		if(!me)
			return;
		var pan = me._panelToSubmit, elem = me._evtElem, f = me._form;
		if(!pan && elem && flag != 9)
		{
			if((new Date()).getTime() < me._evtTime + ((elem.nodeName == 'A') ? 200 : 30))
				pan = me._panelToSubmit = me._findPanel(null, elem);
			if(pan)
				if(!me._onFormSubmit(null, me))
					return;
			me._evtElem = me._panelToSubmit = null;
		}
		if(f && f._ig_cb_submit)try
		{
			f._ig_cb_submit();
		}catch(me){}
	}
	
	this._callBacks = new Array();
	
	
	this._panels = new Array();
	
	this._jsSrcs = new Array();
	this._ie = typeof ActiveXObject != 'undefined';
	this._ok = this._ie || typeof XMLHttpRequest != 'undefined';
	if(!this._ok)
		return;
	form._ig_cb_act = form.action;
	this._onsubmit = form.onsubmit;
	form.onsubmit = null;
	form._ig_cb_submit = form.submit;
	form.submit = this._submit;
	ig_shared.addEventListener(form, 'submit', this._onFormSubmit, true);
	ig_shared.addEventListener(form, 'click', this._onFormEvt, true);
	ig_shared.addEventListener(form, 'mousedown', this._onFormEvt, true);
	ig_shared.addEventListener(form, 'mouseup', this._onFormEvt, true);
	this._oldPostBack = window.__doPostBack;
	if(this._oldPostBack)
		window.__doPostBack = this._doPostBack;
}

function ig_createActiveXFromProgIDs(progIDs)
{
	var e;
	for(var i=0;i<progIDs.length;i++)
	{
		try
		{
			var activeX=new ActiveXObject(progIDs[i]);
			return activeX;
		}
		catch (e){;}
	}
	return null;
}

function ig$(id)
{
	var o = null;
	if(typeof ig_getWebControlById == "function")
		o = ig_getWebControlById(id);
	if(o)
		return o;
	if(typeof igedit_getById == "function")
		o = igedit_getById(id);
	if(o)
		return o;
	if(typeof igtab_getTabById == "function")
		o = igtab_getTabById(id);
	if(o)
		return o;
	if(typeof igcal_getCalendarById == "function")
		o = igcal_getCalendarById(id);
	if(o)
		return o;
	if(typeof iged_getById == "function")
		o = iged_getById(id);
	if(o)
		return o;
	if(typeof iglbar_getListbarById == "function")
		o = iglbar_getListbarById(id);
	if(o)
		return o;
	if(typeof igcmbo_getComboById == "function")
		o = igcmbo_getComboById(id);
	if(o)
		return o;
	if(typeof igtbl_getGridById == "function")
		o = igtbl_getGridById(id);
	if(o)
		return o;
	if(typeof igtbar_getToolbarById == "function")
		o = igtbar_getToolbarById(id);
	if(o)
		return o;
	if(typeof igmenu_getMenuById == "function")
		o = igmenu_getMenuById(id);
	if(o)
		return o;
	if(typeof igtree_getTreeById == "function")
		o = igtree_getTreeById(id);
	return o;
}