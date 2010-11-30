/*
Declare the Sage global namespace
*/
window.Sage = window.Sage || {};
window.Sage.__namespace = true; //allows child namespaces to be registered via Type.registerNamespace(...)

/**
 * Returns the namespace specified and creates it if it doesn't exist
 *
 * Sage.namespace("property.package");
 * Sage.namespace("Sage.property.package");
 *
 * Either of the above would create Sage.property, then
 * Sage.property.package
 *
 * Be careful when naming packages. Reserved words may work in some browsers
 * and not others. For instance, the following will fail in Safari:
 *
 * Sage.namespace("really.long.nested.namespace");
 *
 * This fails because "long" is a future reserved word in ECMAScript
 *
 * @param  {String} ns The name of the namespace
 * @return {Object}    A reference to the namespace object
 */
Sage.namespace = function(ns) {
    if (!ns || !ns.length) {
        return null;
    }

    var levels = ns.split(".");
    var nsobj = Sage;

    // Sage is implied, so it is ignored if it is included
    for (var i=(levels[0] == "Sage") ? 1 : 0; i<levels.length; ++i) {
        nsobj[levels[i]] = nsobj[levels[i]] || {};
        nsobj = nsobj[levels[i]];
    }

    return nsobj;
};
/**
 * Returns the namespace specified and creates it if it doesn't exist
 *
 * Unlike the Sage.namespace function, Sage.createNamespace creates an entirely new namespace 
 * (not in the Sage namespace unless "Sage" is the first token in the namespace string)
 *
 * Be careful when naming packages. Reserved words may work in some browsers
 * and not others. For instance, the following will fail in Safari:
 *
 * Sage.createNamespace("really.long.nested.namespace");
 *
 * This fails because "long" is a future reserved word in ECMAScript
 *
 * @param  {String} ns The name of the namespace
 * @return {Object}    A reference to the namespace object
 */
Sage.createNamespace = function(ns) {
    if (!ns || !ns.length) {
        return null;
    }

    var levels = ns.split(".");
    window[levels[0]] = window[levels[0]] || {};
    var nsobj = window[levels[0]];

    // Sage is implied, so it is ignored if it is included
    for (var i=1; i<levels.length; ++i) {
        nsobj[levels[i]] = nsobj[levels[i]] || {};
        nsobj = nsobj[levels[i]];
    }

    return nsobj;
};
/**
 * Utility to set up the prototype, constructor and superclass properties to
 * support an inheritance strategy that can chain constructors and methods.
 *
 * @param {function} subclass   the object to modify
 * @param {function} superclass the object to inherit
 */
Sage.extend = function(subclass, superclass) {
    var f = function() {};
    f.prototype = superclass.prototype;
    subclass.prototype = new f();
    subclass.prototype.constructor = subclass;
    subclass.superclass = superclass.prototype;
    if (superclass.prototype.constructor == Object.prototype.constructor) {
        superclass.prototype.constructor = superclass;
    }
};

Sage.ServiceContainer = function(){
    _services = [];
};
Sage.ServiceContainer.prototype = {
    addService: function(name, service){
        if(name && service){
            if(!this.hasService(name)){
                var innerService = {};
                innerService.key = name;
                innerService.service = service;
                _services.push(innerService);
                return service;
            }
            else{
                throw "Service already exists: " + name;
            }
        }
    },
    removeService: function(name){
        for(i=0;i<_services.length;i++){
            if(_services[i].key === name){
                _services.splice(i, 1);
            }
        }
    },
    getService: function(name){
        if(name){
            for(i=0;i<_services.length;i++){
                if(_services[i].key === name)
                    return _services[i].service;
            }
        }
        return null;
    },
    hasService: function(name){
        if(name){
            for(i=0;i<_services.length;i++){
                if(_services[i].key === name)
                    return true;
            }
        }
        return false;
    }
}

Sage.Services = new Sage.ServiceContainer();