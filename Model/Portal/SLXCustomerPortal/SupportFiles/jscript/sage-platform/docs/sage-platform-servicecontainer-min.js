/*
 * SagePlatform
 * Copyright(c) 2009, Sage Software.
 */


window.Sage=window.Sage||{};window.Sage.__namespace=true;Sage.namespace=function(ns){if(!ns||!ns.length){return null;}
var levels=ns.split(".");var nsobj=Sage;for(var i=(levels[0]=="Sage")?1:0;i<levels.length;++i){nsobj[levels[i]]=nsobj[levels[i]]||{};nsobj=nsobj[levels[i]];}
return nsobj;};Sage.createNamespace=function(ns){if(!ns||!ns.length){return null;}
var levels=ns.split(".");window[levels[0]]=window[levels[0]]||{};var nsobj=window[levels[0]];for(var i=1;i<levels.length;++i){nsobj[levels[i]]=nsobj[levels[i]]||{};nsobj=nsobj[levels[i]];}
return nsobj;};Sage.extend=function(subclass,superclass){var f=function(){};f.prototype=superclass.prototype;subclass.prototype=new f();subclass.prototype.constructor=subclass;subclass.superclass=superclass.prototype;if(superclass.prototype.constructor==Object.prototype.constructor){superclass.prototype.constructor=superclass;}};Sage.ServiceContainer=function(){_services=[];};Sage.ServiceContainer.prototype={addService:function(name,service){if(name&&service){if(!this.hasService(name)){var innerService={};innerService.key=name;innerService.service=service;_services.push(innerService);return service;}
else{throw"Service already exists: "+name;}}},removeService:function(name){for(i=0;i<_services.length;i++){if(_services[i].key===name){_services.splice(i,1);}}},getService:function(name){if(name){for(i=0;i<_services.length;i++){if(_services[i].key===name)
return _services[i].service;}}
return null;},hasService:function(name){if(name){for(i=0;i<_services.length;i++){if(_services[i].key===name)
return true;}}
return false;}}
Sage.Services=new Sage.ServiceContainer();