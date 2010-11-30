
/*** begin file 'yahoo.js' ***/
/*
Copyright (c) 2007, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.2.0
*/
/**
 * The YAHOO object is the single global object used by YUI Library.  It
 * contains utility function for setting up namespaces, inheritance, and
 * logging.  YAHOO.util, YAHOO.widget, and YAHOO.example are namespaces
 * created automatically for and used by the library.
 * @module yahoo
 * @title  YAHOO Global
 */

/**
 * YAHOO_config is not included part of the library.  Instead it is an object
 * that can be defined by the implementer immediately before including the
 * YUI library.  The properties included in this object will be used to
 * configure global properties needed as soon as the library begins to load.
 * @class YAHOO_config
 * @static
 */

/**
 * A reference to a function that will be executed every time a YAHOO module
 * is loaded.  As parameter, this function will receive the version
 * information for the module. See <a href="YAHOO.env.html#getVersion">
 * YAHOO.env.getVersion</a> for the description of the version data structure.
 * @property listener
 * @static
 */
if (typeof YAHOO == "undefined") {
    /**
     * The YAHOO global namespace object.  If YAHOO is already defined, the
     * existing YAHOO object will not be overwritten so that defined
     * namespaces are preserved.
     * @class YAHOO
     * @static
     */
    var YAHOO = {};
}

/**
 * Returns the namespace specified and creates it if it doesn't exist
 * <pre>
 * YAHOO.namespace("property.package");
 * YAHOO.namespace("YAHOO.property.package");
 * </pre>
 * Either of the above would create YAHOO.property, then
 * YAHOO.property.package
 *
 * Be careful when naming packages. Reserved words may work in some browsers
 * and not others. For instance, the following will fail in Safari:
 * <pre>
 * YAHOO.namespace("really.long.nested.namespace");
 * </pre>
 * This fails because "long" is a future reserved word in ECMAScript
 *
 * @method namespace
 * @static
 * @param  {String*} arguments 1-n namespaces to create 
 * @return {Object}  A reference to the last namespace object created
 */
YAHOO.namespace = function() {
    var a=arguments, o=null, i, j, d;
    for (i=0; i<a.length; i=i+1) {
        d=a[i].split(".");
        o=YAHOO;

        // YAHOO is implied, so it is ignored if it is included
        for (j=(d[0] == "YAHOO") ? 1 : 0; j<d.length; j=j+1) {
            o[d[j]]=o[d[j]] || {};
            o=o[d[j]];
        }
    }

    return o;
};

/**
 * Uses YAHOO.widget.Logger to output a log message, if the widget is
 * available.
 *
 * @method log
 * @static
 * @param  {String}  msg  The message to log.
 * @param  {String}  cat  The log category for the message.  Default
 *                        categories are "info", "warn", "error", time".
 *                        Custom categories can be used as well. (opt)
 * @param  {String}  src  The source of the the message (opt)
 * @return {Boolean}      True if the log operation was successful.
 */
YAHOO.log = function(msg, cat, src) {
    var l=YAHOO.widget.Logger;
    if(l && l.log) {
        return l.log(msg, cat, src);
    } else {
        return false;
    }
};


/**
 * Initializes the global by creating the default namespaces and applying
 * any new configuration information that is detected.
 * @method init
 * @static
 */
YAHOO.init = function() {
    this.namespace("util", "widget", "example");
    if (typeof YAHOO_config != "undefined") {
        var l=YAHOO_config.listener,ls=YAHOO.env.listeners,unique=true,i;
        if (l) {
            // if YAHOO is loaded multiple times we need to check to see if
            // this is a new config object.  If it is, add the new component
            // load listener to the stack
            for (i=0;i<ls.length;i=i+1) {
                if (ls[i]==l) {
                    unique=false;
                    break;
                }
            }
            if (unique) {
                ls.push(l);
            }
        }
    }
};

/**
 * Registers a module with the YAHOO object
 * @method register
 * @static
 * @param {String}   name    the name of the module (event, slider, etc)
 * @param {Function} mainClass a reference to class in the module.  This
 *                             class will be tagged with the version info
 *                             so that it will be possible to identify the
 *                             version that is in use when multiple versions
 *                             have loaded
 * @param {Object}   data      metadata object for the module.  Currently it
 *                             is expected to contain a "version" property
 *                             and a "build" property at minimum.
 */
YAHOO.register = function(name, mainClass, data) {
    var mods = YAHOO.env.modules;
    if (!mods[name]) {
        mods[name] = { versions:[], builds:[] };
    }
    var m=mods[name],v=data.version,b=data.build,ls=YAHOO.env.listeners;
    m.name = name;
    m.version = v;
    m.build = b;
    m.versions.push(v);
    m.builds.push(b);
    m.mainClass = mainClass;
    // fire the module load listeners
    for (var i=0;i<ls.length;i=i+1) {
        ls[i](m);
    }
    // label the main class
    if (mainClass) {
        mainClass.VERSION = v;
        mainClass.BUILD = b;
    } else {
        YAHOO.log("mainClass is undefined for module " + name, "warn");
    }
};

/**
 * YAHOO.env is used to keep track of what is known about the YUI library and
 * the browsing environment
 * @class YAHOO.env
 * @type Object
 * @static
 */
YAHOO.env = YAHOO.env || {
    /**
     * Keeps the version info for all YUI modules that have reported themselves
     * @property modules
     * @type Object[]
     */
    modules: [],
    
    /**
     * List of functions that should be executed every time a YUI module
     * reports itself.
     * @property listeners
     * @type Function[]
     */
    listeners: [],
    
    /**
     * Returns the version data for the specified module:
     *      <dl>
     *      <dt>name:</dt>      <dd>The name of the module</dd>
     *      <dt>version:</dt>   <dd>The version in use</dd>
     *      <dt>build:</dt>     <dd>The build number in use</dd>
     *      <dt>versions:</dt>  <dd>All versions that were registered</dd>
     *      <dt>builds:</dt>    <dd>All builds that were registered.</dd>
     *      <dt>mainClass:</dt> <dd>An object that was was stamped with the
     *                 current version and build. If 
     *                 mainClass.VERSION != version or mainClass.BUILD != build,
     *                 multiple versions of pieces of the library have been
     *                 loaded, potentially causing issues.</dd>
     *       </dl>
     *
     * @method getVersion
     * @static
     * @param {String}  name the name of the module (event, slider, etc)
     * @return {Object} The version info
     */
    getVersion: function(name) {
        return YAHOO.env.modules[name] || null;
    }
};

/**
 * Provides the language utilites and extensions used by the library
 * @class YAHOO.lang
 */
YAHOO.lang = {
    /**
     * Determines whether or not the provided object is an array
     * @method isArray
     * @param {any} obj The object being testing
     * @return Boolean
     */
    isArray: function(obj) { // frames lose type, so test constructor string
        if (obj.constructor && obj.constructor.toString().indexOf('Array') > -1) {
            return true;
        } else {
            return YAHOO.lang.isObject(obj) && obj.constructor == Array;
        }
    },

    /**
     * Determines whether or not the provided object is a boolean
     * @method isBoolean
     * @param {any} obj The object being testing
     * @return Boolean
     */
    isBoolean: function(obj) {
        return typeof obj == 'boolean';
    },
    
    /**
     * Determines whether or not the provided object is a function
     * @method isFunction
     * @param {any} obj The object being testing
     * @return Boolean
     */
    isFunction: function(obj) {
        return typeof obj == 'function';
    },
        
    /**
     * Determines whether or not the provided object is null
     * @method isNull
     * @param {any} obj The object being testing
     * @return Boolean
     */
    isNull: function(obj) {
        return obj === null;
    },
        
    /**
     * Determines whether or not the provided object is a legal number
     * @method isNumber
     * @param {any} obj The object being testing
     * @return Boolean
     */
    isNumber: function(obj) {
        return typeof obj == 'number' && isFinite(obj);
    },
      
    /**
     * Determines whether or not the provided object is of type object
     * or function
     * @method isObject
     * @param {any} obj The object being testing
     * @return Boolean
     */  
    isObject: function(obj) {
        return typeof obj == 'object' || YAHOO.lang.isFunction(obj);
    },
        
    /**
     * Determines whether or not the provided object is a string
     * @method isString
     * @param {any} obj The object being testing
     * @return Boolean
     */
    isString: function(obj) {
        return typeof obj == 'string';
    },
        
    /**
     * Determines whether or not the provided object is undefined
     * @method isUndefined
     * @param {any} obj The object being testing
     * @return Boolean
     */
    isUndefined: function(obj) {
        return typeof obj == 'undefined';
    },
    
    /**
     * Determines whether or not the property was added
     * to the object instance.  Returns false if the property is not present
     * in the object, or was inherited from the prototype.
     * This abstraction is provided to enable hasOwnProperty for Safari 1.3.x.
     * There is a discrepancy between YAHOO.lang.hasOwnProperty and
     * Object.prototype.hasOwnProperty when the property is a primitive added to
     * both the instance AND prototype with the same value:
     * <pre>
     * var A = function() {};
     * A.prototype.foo = 'foo';
     * var a = new A();
     * a.foo = 'foo';
     * alert(a.hasOwnProperty('foo')); // true
     * alert(YAHOO.lang.hasOwnProperty(a, 'foo')); // false when using fallback
     * </pre>
     * @method hasOwnProperty
     * @param {any} obj The object being testing
     * @return Boolean
     */
    hasOwnProperty: function(obj, prop) {
        if (Object.prototype.hasOwnProperty) {
            return obj.hasOwnProperty(prop);
        }
        
        return !YAHOO.lang.isUndefined(obj[prop]) && 
                obj.constructor.prototype[prop] !== obj[prop];
    },
        
    /**
     * Utility to set up the prototype, constructor and superclass properties to
     * support an inheritance strategy that can chain constructors and methods.
     *
     * @method extend
     * @static
     * @param {Function} subc   the object to modify
     * @param {Function} superc the object to inherit
     * @param {Object} overrides  additional properties/methods to add to the
     *                              subclass prototype.  These will override the
     *                              matching items obtained from the superclass 
     *                              if present.
     */
    extend: function(subc, superc, overrides) {
        var F = function() {};
        F.prototype=superc.prototype;
        subc.prototype=new F();
        subc.prototype.constructor=subc;
        subc.superclass=superc.prototype;
        if (superc.prototype.constructor == Object.prototype.constructor) {
            superc.prototype.constructor=superc;
        }
    
        if (overrides) {
            for (var i in overrides) {
                subc.prototype[i]=overrides[i];
            }
        }
    },
    
    /**
     * Applies all prototype properties in the supplier to the receiver if the
     * receiver does not have these properties yet.  Optionally, one or more
     * methods/properties can be specified (as additional parameters).  This
     * option will overwrite the property if receiver has it already.
     *
     * @method augment
     * @static
     * @param {Function} r  the object to receive the augmentation
     * @param {Function} s  the object that supplies the properties to augment
     * @param {String*}  arguments zero or more properties methods to augment the
     *                             receiver with.  If none specified, everything
     *                             in the supplier will be used unless it would
     *                             overwrite an existing property in the receiver
     */
    augment: function(r, s) {
        var rp=r.prototype, sp=s.prototype, a=arguments, i, p;
        if (a[2]) {
            for (i=2; i<a.length; i=i+1) {
                rp[a[i]] = sp[a[i]];
            }
        } else {
            for (p in sp) { 
                if (!rp[p]) {
                    rp[p] = sp[p];
                }
            }
        }
    }
};

YAHOO.init();

/*
 * An alias for <a href="YAHOO.lang.html">YAHOO.lang</a>
 * @class YAHOO.util.Lang
 */
YAHOO.util.Lang = YAHOO.lang;

/**
 * An alias for <a href="YAHOO.lang.html#augment">YAHOO.lang.augment</a>
 * @for YAHOO
 * @method augment
 * @static
 * @param {Function} r  the object to receive the augmentation
 * @param {Function} s  the object that supplies the properties to augment
 * @param {String*}  arguments zero or more properties methods to augment the
 *                             receiver with.  If none specified, everything
 *                             in the supplier will be used unless it would
 *                             overwrite an existing property in the receiver
 */
YAHOO.augment = YAHOO.lang.augment;
       
/**
 * An alias for <a href="YAHOO.lang.html#extend">YAHOO.lang.extend</a>
 * @method extend
 * @static
 * @param {Function} subc   the object to modify
 * @param {Function} superc the object to inherit
 * @param {Object} overrides  additional properties/methods to add to the
 *                              subclass prototype.  These will override the
 *                              matching items obtained from the superclass 
 *                              if present.
 */
YAHOO.extend = YAHOO.lang.extend;

YAHOO.register("yahoo", YAHOO, {version: "2.2.0", build: "127"});


/*** end file 'yahoo.js' ***/

/*** begin file 'event.js' ***/
/*
Copyright (c) 2007, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.2.0
*/
/**
 * The Event Utility provides utilities for managing DOM Events and tools
 * for building event systems
 *
 * @module event
 * @title Event Utility
 * @namespace YAHOO.util
 * @requires yahoo
 */

// The first instance of Event will win if it is loaded more than once.
// @TODO this needs to be changed so that only the state data that needs to
// be preserved is kept, while methods are overwritten/added as needed.
// This means that the module pattern can't be used.
if (!YAHOO.util.Event) {

/**
 * The event utility provides functions to add and remove event listeners,
 * event cleansing.  It also tries to automatically remove listeners it
 * registers during the unload event.
 *
 * @class Event
 * @static
 */
    YAHOO.util.Event = function() {

        /**
         * True after the onload event has fired
         * @property loadComplete
         * @type boolean
         * @static
         * @private
         */
        var loadComplete =  false;

        /**
         * Cache of wrapped listeners
         * @property listeners
         * @type array
         * @static
         * @private
         */
        var listeners = [];

        /**
         * User-defined unload function that will be fired before all events
         * are detached
         * @property unloadListeners
         * @type array
         * @static
         * @private
         */
        var unloadListeners = [];

        /**
         * Cache of DOM0 event handlers to work around issues with DOM2 events
         * in Safari
         * @property legacyEvents
         * @static
         * @private
         */
        var legacyEvents = [];

        /**
         * Listener stack for DOM0 events
         * @property legacyHandlers
         * @static
         * @private
         */
        var legacyHandlers = [];

        /**
         * The number of times to poll after window.onload.  This number is
         * increased if additional late-bound handlers are requested after
         * the page load.
         * @property retryCount
         * @static
         * @private
         */
        var retryCount = 0;

        /**
         * onAvailable listeners
         * @property onAvailStack
         * @static
         * @private
         */
        var onAvailStack = [];

        /**
         * Lookup table for legacy events
         * @property legacyMap
         * @static
         * @private
         */
        var legacyMap = [];

        /**
         * Counter for auto id generation
         * @property counter
         * @static
         * @private
         */
        var counter = 0;
        
        /**
         * addListener/removeListener can throw errors in unexpected scenarios.
         * These errors are suppressed, the method returns false, and this property
         * is set
         * @property lastError
         * @type Error
         */
        var lastError = null;

        return {

            /**
             * The number of times we should look for elements that are not
             * in the DOM at the time the event is requested after the document
             * has been loaded.  The default is 200@amp;50 ms, so it will poll
             * for 10 seconds or until all outstanding handlers are bound
             * (whichever comes first).
             * @property POLL_RETRYS
             * @type int
             * @static
             * @final
             */
            POLL_RETRYS: 200,

            /**
             * The poll interval in milliseconds
             * @property POLL_INTERVAL
             * @type int
             * @static
             * @final
             */
            POLL_INTERVAL: 20,

            /**
             * Element to bind, int constant
             * @property EL
             * @type int
             * @static
             * @final
             */
            EL: 0,

            /**
             * Type of event, int constant
             * @property TYPE
             * @type int
             * @static
             * @final
             */
            TYPE: 1,

            /**
             * Function to execute, int constant
             * @property FN
             * @type int
             * @static
             * @final
             */
            FN: 2,

            /**
             * Function wrapped for scope correction and cleanup, int constant
             * @property WFN
             * @type int
             * @static
             * @final
             */
            WFN: 3,

            /**
             * Object passed in by the user that will be returned as a 
             * parameter to the callback, int constant
             * @property OBJ
             * @type int
             * @static
             * @final
             */
            OBJ: 3,

            /**
             * Adjusted scope, either the element we are registering the event
             * on or the custom object passed in by the listener, int constant
             * @property ADJ_SCOPE
             * @type int
             * @static
             * @final
             */
            ADJ_SCOPE: 4,

            /**
             * Safari detection is necessary to work around the preventDefault
             * bug that makes it so you can't cancel a href click from the 
             * handler.  Since this function has been used outside of this
             * utility, it was changed to detect all KHTML browser to be more
             * friendly towards the non-Safari browsers that share the engine.
             * Internally, the preventDefault bug detection now uses the
             * webkit property.
             * @property isSafari
             * @private
             * @static
             * @deprecated
             */
            isSafari: (/KHTML/gi).test(navigator.userAgent),
            
            /**
             * If WebKit is detected, we keep track of the version number of
             * the engine.
             * Safari 1.3.2 (312.6): 312.8.1 <-- currently the latest
             *                       available on Mac OSX 10.3.
             * Safari 2.0.2: 416 <-- hasOwnProperty introduced
             * Safari 2.0.4: 418 <-- preventDefault fixed (I believe)
             * Safari 2.0.4 (419.3): 418.9.1 <-- current release
             *
             * http://developer.apple.com/internet/safari/uamatrix.html
             * @property webkit
             */
            webkit: function() {
                var v=navigator.userAgent.match(/AppleWebKit\/([^ ]*)/);
                if (v&&v[1]) {
                    return v[1];
                }
                return null;
            }(),
            
            /**
             * IE detection needed to properly calculate pageX and pageY.  
             * capabilities checking didn't seem to work because another 
             * browser that does not provide the properties have the values 
             * calculated in a different manner than IE.
             * @property isIE
             * @private
             * @static
             */
            isIE: (!this.webkit && !navigator.userAgent.match(/opera/gi) && 
                    navigator.userAgent.match(/msie/gi)),

            /**
             * poll handle
             * @property _interval
             * @private
             */
            _interval: null,

            /**
             * @method startInterval
             * @static
             * @private
             */
            startInterval: function() {
                if (!this._interval) {
                    var self = this;
                    var callback = function() { self._tryPreloadAttach(); };
                    this._interval = setInterval(callback, this.POLL_INTERVAL);
                    // this.timeout = setTimeout(callback, i);
                }
            },

            /**
             * Executes the supplied callback when the item with the supplied
             * id is found.  This is meant to be used to execute behavior as
             * soon as possible as the page loads.  If you use this after the
             * initial page load it will poll for a fixed time for the element.
             * The number of times it will poll and the frequency are
             * configurable.  By default it will poll for 10 seconds.
             *
             * @method onAvailable
             *
             * @param {string}   p_id the id of the element to look for.
             * @param {function} p_fn what to execute when the element is found.
             * @param {object}   p_obj an optional object to be passed back as
             *                   a parameter to p_fn.
             * @param {boolean}  p_override If set to true, p_fn will execute
             *                   in the scope of p_obj
             *
             * @static
             */
            onAvailable: function(p_id, p_fn, p_obj, p_override) {
                onAvailStack.push( { id:         p_id, 
                                     fn:         p_fn, 
                                     obj:        p_obj, 
                                     override:   p_override, 
                                     checkReady: false    } );

                retryCount = this.POLL_RETRYS;
                this.startInterval();
            },

            /**
             * Works the same way as onAvailable, but additionally checks the
             * state of sibling elements to determine if the content of the
             * available element is safe to modify.
             *
             * @method onContentReady
             *
             * @param {string}   p_id the id of the element to look for.
             * @param {function} p_fn what to execute when the element is ready.
             * @param {object}   p_obj an optional object to be passed back as
             *                   a parameter to p_fn.
             * @param {boolean}  p_override If set to true, p_fn will execute
             *                   in the scope of p_obj
             *
             * @static
             */
            onContentReady: function(p_id, p_fn, p_obj, p_override) {
                onAvailStack.push( { id:         p_id, 
                                     fn:         p_fn, 
                                     obj:        p_obj, 
                                     override:   p_override,
                                     checkReady: true      } );

                retryCount = this.POLL_RETRYS;
                this.startInterval();
            },

            /**
             * Appends an event handler
             *
             * @method addListener
             *
             * @param {Object}   el        The html element to assign the 
             *                             event to
             * @param {String}   sType     The type of event to append
             * @param {Function} fn        The method the event invokes
             * @param {Object}   obj    An arbitrary object that will be 
             *                             passed as a parameter to the handler
             * @param {boolean}  override  If true, the obj passed in becomes
             *                             the execution scope of the listener
             * @return {boolean} True if the action was successful or defered,
             *                        false if one or more of the elements 
             *                        could not have the listener attached,
             *                        or if the operation throws an exception.
             * @static
             */
            addListener: function(el, sType, fn, obj, override) {


                if (!fn || !fn.call) {
                    return false;
                }

                // The el argument can be an array of elements or element ids.
                if ( this._isValidCollection(el)) {
                    var ok = true;
                    for (var i=0,len=el.length; i<len; ++i) {
                        ok = this.on(el[i], 
                                       sType, 
                                       fn, 
                                       obj, 
                                       override) && ok;
                    }
                    return ok;

                } else if (typeof el == "string") {
                    var oEl = this.getEl(el);
                    // If the el argument is a string, we assume it is 
                    // actually the id of the element.  If the page is loaded
                    // we convert el to the actual element, otherwise we 
                    // defer attaching the event until onload event fires

                    // check to see if we need to delay hooking up the event 
                    // until after the page loads.
                    if (oEl) {
                        el = oEl;
                    } else {
                        // defer adding the event until the element is available
                        this.onAvailable(el, function() {
                           YAHOO.util.Event.on(el, sType, fn, obj, override);
                        });

                        return true;
                    }
                }

                // Element should be an html element or an array if we get 
                // here.
                if (!el) {
                    return false;
                }

                // we need to make sure we fire registered unload events 
                // prior to automatically unhooking them.  So we hang on to 
                // these instead of attaching them to the window and fire the
                // handles explicitly during our one unload event.
                if ("unload" == sType && obj !== this) {
                    unloadListeners[unloadListeners.length] =
                            [el, sType, fn, obj, override];
                    return true;
                }


                // if the user chooses to override the scope, we use the custom
                // object passed in, otherwise the executing scope will be the
                // HTML element that the event is registered on
                var scope = el;
                if (override) {
                    if (override === true) {
                        scope = obj;
                    } else {
                        scope = override;
                    }
                }

                // wrap the function so we can return the obj object when
                // the event fires;
                var wrappedFn = function(e) {
                        return fn.call(scope, YAHOO.util.Event.getEvent(e), 
                                obj);
                    };

                var li = [el, sType, fn, wrappedFn, scope];
                var index = listeners.length;
                // cache the listener so we can try to automatically unload
                listeners[index] = li;

                if (this.useLegacyEvent(el, sType)) {
                    var legacyIndex = this.getLegacyIndex(el, sType);

                    // Add a new dom0 wrapper if one is not detected for this
                    // element
                    if ( legacyIndex == -1 || 
                                el != legacyEvents[legacyIndex][0] ) {

                        legacyIndex = legacyEvents.length;
                        legacyMap[el.id + sType] = legacyIndex;

                        // cache the signature for the DOM0 event, and 
                        // include the existing handler for the event, if any
                        legacyEvents[legacyIndex] = 
                            [el, sType, el["on" + sType]];
                        legacyHandlers[legacyIndex] = [];

                        el["on" + sType] = 
                            function(e) {
                                YAHOO.util.Event.fireLegacyEvent(
                                    YAHOO.util.Event.getEvent(e), legacyIndex);
                            };
                    }

                    // add a reference to the wrapped listener to our custom
                    // stack of events
                    //legacyHandlers[legacyIndex].push(index);
                    legacyHandlers[legacyIndex].push(li);

                } else {
                    try {
                        this._simpleAdd(el, sType, wrappedFn, false);
                    } catch(ex) {
                        // handle an error trying to attach an event.  If it fails
                        // we need to clean up the cache
                        this.lastError = ex;
                        this.removeListener(el, sType, fn);
                        return false;
                    }
                }

                return true;
                
            },

            /**
             * When using legacy events, the handler is routed to this object
             * so we can fire our custom listener stack.
             * @method fireLegacyEvent
             * @static
             * @private
             */
            fireLegacyEvent: function(e, legacyIndex) {
                var ok=true,le,lh,li,scope,ret;
                
                lh = legacyHandlers[legacyIndex];
                for (var i=0,len=lh.length; i<len; ++i) {
                    li = lh[i];
                    if ( li && li[this.WFN] ) {
                        scope = li[this.ADJ_SCOPE];
                        ret = li[this.WFN].call(scope, e);
                        ok = (ok && ret);
                    }
                }

                // Fire the original handler if we replaced one.  We fire this
                // after the other events to keep stopPropagation/preventDefault
                // that happened in the DOM0 handler from touching our DOM2
                // substitute
                le = legacyEvents[legacyIndex];
                if (le && le[2]) {
                    le[2](e);
                }
                
                return ok;
            },

            /**
             * Returns the legacy event index that matches the supplied 
             * signature
             * @method getLegacyIndex
             * @static
             * @private
             */
            getLegacyIndex: function(el, sType) {
                var key = this.generateId(el) + sType;
                if (typeof legacyMap[key] == "undefined") { 
                    return -1;
                } else {
                    return legacyMap[key];
                }
            },

            /**
             * Logic that determines when we should automatically use legacy
             * events instead of DOM2 events.  Currently this is limited to old
             * Safari browsers with a broken preventDefault
             * @method useLegacyEvent
             * @static
             * @private
             */
            useLegacyEvent: function(el, sType) {
                if (this.webkit && ("click"==sType || "dblclick"==sType)) {
                    var v = parseInt(this.webkit, 10);
                    if (!isNaN(v) && v<418) {
                        return true;
                    }
                }
                return false;
            },
                    
            /**
             * Removes an event handler
             *
             * @method removeListener
             *
             * @param {Object} el the html element or the id of the element to 
             * assign the event to.
             * @param {String} sType the type of event to remove.
             * @param {Function} fn the method the event invokes.  If fn is
             * undefined, then all event handlers for the type of event are 
             * removed.
             * @return {boolean} true if the unbind was successful, false 
             * otherwise.
             * @static
             */
            removeListener: function(el, sType, fn) {
                var i, len;

                // The el argument can be a string
                if (typeof el == "string") {
                    el = this.getEl(el);
                // The el argument can be an array of elements or element ids.
                } else if ( this._isValidCollection(el)) {
                    var ok = true;
                    for (i=0,len=el.length; i<len; ++i) {
                        ok = ( this.removeListener(el[i], sType, fn) && ok );
                    }
                    return ok;
                }

                if (!fn || !fn.call) {
                    //return false;
                    return this.purgeElement(el, false, sType);
                }


                if ("unload" == sType) {

                    for (i=0, len=unloadListeners.length; i<len; i++) {
                        var li = unloadListeners[i];
                        if (li && 
                            li[0] == el && 
                            li[1] == sType && 
                            li[2] == fn) {
                                unloadListeners.splice(i, 1);
                                return true;
                        }
                    }

                    return false;
                }

                var cacheItem = null;

                // The index is a hidden parameter; needed to remove it from
                // the method signature because it was tempting users to
                // try and take advantage of it, which is not possible.
                var index = arguments[3];
  
                if ("undefined" == typeof index) {
                    index = this._getCacheIndex(el, sType, fn);
                }

                if (index >= 0) {
                    cacheItem = listeners[index];
                }

                if (!el || !cacheItem) {
                    return false;
                }


                if (this.useLegacyEvent(el, sType)) {
                    var legacyIndex = this.getLegacyIndex(el, sType);
                    var llist = legacyHandlers[legacyIndex];
                    if (llist) {
                        for (i=0, len=llist.length; i<len; ++i) {
                            li = llist[i];
                            if (li && 
                                li[this.EL] == el && 
                                li[this.TYPE] == sType && 
                                li[this.FN] == fn) {
                                    llist.splice(i, 1);
                                    break;
                            }
                        }
                    }

                } else {
                    try {
                        this._simpleRemove(el, sType, cacheItem[this.WFN], false);
                    } catch(ex) {
                        this.lastError = ex;
                        return false;
                    }
                }

                // removed the wrapped handler
                delete listeners[index][this.WFN];
                delete listeners[index][this.FN];
                listeners.splice(index, 1);

                return true;

            },

            /**
             * Returns the event's target element
             * @method getTarget
             * @param {Event} ev the event
             * @param {boolean} resolveTextNode when set to true the target's
             *                  parent will be returned if the target is a 
             *                  text node.  @deprecated, the text node is
             *                  now resolved automatically
             * @return {HTMLElement} the event's target
             * @static
             */
            getTarget: function(ev, resolveTextNode) {
                var t = ev.target || ev.srcElement;
                return this.resolveTextNode(t);
            },

            /**
             * In some cases, some browsers will return a text node inside
             * the actual element that was targeted.  This normalizes the
             * return value for getTarget and getRelatedTarget.
             * @method resolveTextNode
             * @param {HTMLElement} node node to resolve
             * @return {HTMLElement} the normized node
             * @static
             */
            resolveTextNode: function(node) {
                // if (node && node.nodeName && 
                        // "#TEXT" == node.nodeName.toUpperCase()) {
                if (node && 3 == node.nodeType) {
                    return node.parentNode;
                } else {
                    return node;
                }
            },

            /**
             * Returns the event's pageX
             * @method getPageX
             * @param {Event} ev the event
             * @return {int} the event's pageX
             * @static
             */
            getPageX: function(ev) {
                var x = ev.pageX;
                if (!x && 0 !== x) {
                    x = ev.clientX || 0;

                    if ( this.isIE ) {
                        x += this._getScrollLeft();
                    }
                }

                return x;
            },

            /**
             * Returns the event's pageY
             * @method getPageY
             * @param {Event} ev the event
             * @return {int} the event's pageY
             * @static
             */
            getPageY: function(ev) {
                var y = ev.pageY;
                if (!y && 0 !== y) {
                    y = ev.clientY || 0;

                    if ( this.isIE ) {
                        y += this._getScrollTop();
                    }
                }


                return y;
            },

            /**
             * Returns the pageX and pageY properties as an indexed array.
             * @method getXY
             * @param {Event} ev the event
             * @return {[x, y]} the pageX and pageY properties of the event
             * @static
             */
            getXY: function(ev) {
                return [this.getPageX(ev), this.getPageY(ev)];
            },

            /**
             * Returns the event's related target 
             * @method getRelatedTarget
             * @param {Event} ev the event
             * @return {HTMLElement} the event's relatedTarget
             * @static
             */
            getRelatedTarget: function(ev) {
                var t = ev.relatedTarget;
                if (!t) {
                    if (ev.type == "mouseout") {
                        t = ev.toElement;
                    } else if (ev.type == "mouseover") {
                        t = ev.fromElement;
                    }
                }

                return this.resolveTextNode(t);
            },

            /**
             * Returns the time of the event.  If the time is not included, the
             * event is modified using the current time.
             * @method getTime
             * @param {Event} ev the event
             * @return {Date} the time of the event
             * @static
             */
            getTime: function(ev) {
                if (!ev.time) {
                    var t = new Date().getTime();
                    try {
                        ev.time = t;
                    } catch(ex) { 
                        this.lastError = ex;
                        return t;
                    }
                }

                return ev.time;
            },

            /**
             * Convenience method for stopPropagation + preventDefault
             * @method stopEvent
             * @param {Event} ev the event
             * @static
             */
            stopEvent: function(ev) {
                this.stopPropagation(ev);
                this.preventDefault(ev);
            },

            /**
             * Stops event propagation
             * @method stopPropagation
             * @param {Event} ev the event
             * @static
             */
            stopPropagation: function(ev) {
                if (ev.stopPropagation) {
                    ev.stopPropagation();
                } else {
                    ev.cancelBubble = true;
                }
            },

            /**
             * Prevents the default behavior of the event
             * @method preventDefault
             * @param {Event} ev the event
             * @static
             */
            preventDefault: function(ev) {
                if (ev.preventDefault) {
                    ev.preventDefault();
                } else {
                    ev.returnValue = false;
                }
            },
             
            /**
             * Finds the event in the window object, the caller's arguments, or
             * in the arguments of another method in the callstack.  This is
             * executed automatically for events registered through the event
             * manager, so the implementer should not normally need to execute
             * this function at all.
             * @method getEvent
             * @param {Event} e the event parameter from the handler
             * @return {Event} the event 
             * @static
             */
            getEvent: function(e) {
                var ev = e || window.event;

                if (!ev) {
                    var c = this.getEvent.caller;
                    while (c) {
                        ev = c.arguments[0];
                        if (ev && Event == ev.constructor) {
                            break;
                        }
                        c = c.caller;
                    }
                }

                return ev;
            },

            /**
             * Returns the charcode for an event
             * @method getCharCode
             * @param {Event} ev the event
             * @return {int} the event's charCode
             * @static
             */
            getCharCode: function(ev) {
                return ev.charCode || ev.keyCode || 0;
            },

            /**
             * Locating the saved event handler data by function ref
             *
             * @method _getCacheIndex
             * @static
             * @private
             */
            _getCacheIndex: function(el, sType, fn) {
                for (var i=0,len=listeners.length; i<len; ++i) {
                    var li = listeners[i];
                    if ( li                 && 
                         li[this.FN] == fn  && 
                         li[this.EL] == el  && 
                         li[this.TYPE] == sType ) {
                        return i;
                    }
                }

                return -1;
            },

            /**
             * Generates an unique ID for the element if it does not already 
             * have one.
             * @method generateId
             * @param el the element to create the id for
             * @return {string} the resulting id of the element
             * @static
             */
            generateId: function(el) {
                var id = el.id;

                if (!id) {
                    id = "yuievtautoid-" + counter;
                    ++counter;
                    el.id = id;
                }

                return id;
            },


            /**
             * We want to be able to use getElementsByTagName as a collection
             * to attach a group of events to.  Unfortunately, different 
             * browsers return different types of collections.  This function
             * tests to determine if the object is array-like.  It will also 
             * fail if the object is an array, but is empty.
             * @method _isValidCollection
             * @param o the object to test
             * @return {boolean} true if the object is array-like and populated
             * @static
             * @private
             */
            _isValidCollection: function(o) {
                return ( o                    && // o is something
                         o.length             && // o is indexed
                         typeof o != "string" && // o is not a string
                         !o.tagName           && // o is not an HTML element
                         !o.alert             && // o is not a window
                         typeof o[0] != "undefined" );

            },

            /**
             * @private
             * @property elCache
             * DOM element cache
             * @static
             */
            elCache: {},

            /**
             * We cache elements bound by id because when the unload event 
             * fires, we can no longer use document.getElementById
             * @method getEl
             * @static
             * @private
             */
            getEl: function(id) {
                return document.getElementById(id);
            },

            /**
             * Clears the element cache
             * @deprecated Elements are not cached any longer
             * @method clearCache
             * @static
             * @private
             */
            clearCache: function() { },

            /**
             * hook up any deferred listeners
             * @method _load
             * @static
             * @private
             */
            _load: function(e) {
                loadComplete = true;
                var EU = YAHOO.util.Event;
                // Remove the listener to assist with the IE memory issue, but not
                // for other browsers because FF 1.0x does not like it.
                if (this.isIE) {
                    EU._simpleRemove(window, "load", EU._load);
                }
            },

            /**
             * Polling function that runs before the onload event fires, 
             * attempting to attach to DOM Nodes as soon as they are 
             * available
             * @method _tryPreloadAttach
             * @static
             * @private
             */
            _tryPreloadAttach: function() {

                if (this.locked) {
                    return false;
                }

                this.locked = true;


                // keep trying until after the page is loaded.  We need to 
                // check the page load state prior to trying to bind the 
                // elements so that we can be certain all elements have been 
                // tested appropriately
                var tryAgain = !loadComplete;
                if (!tryAgain) {
                    tryAgain = (retryCount > 0);
                }

                // onAvailable
                var notAvail = [];
                for (var i=0,len=onAvailStack.length; i<len ; ++i) {
                    var item = onAvailStack[i];
                    if (item) {
                        var el = this.getEl(item.id);

                        if (el) {
                            // The element is available, but not necessarily ready
                            // @todo verify IE7 compatibility
                            // @todo should we test parentNode.nextSibling?
                            // @todo re-evaluate global content ready
                            if ( !item.checkReady || 
                                    loadComplete || 
                                    el.nextSibling ||
                                    (document && document.body) ) {

                                var scope = el;
                                if (item.override) {
                                    if (item.override === true) {
                                        scope = item.obj;
                                    } else {
                                        scope = item.override;
                                    }
                                }
                                item.fn.call(scope, item.obj);
                                //delete onAvailStack[i];
                                // null out instead of delete for Opera
                                onAvailStack[i] = null;
                            }
                        } else {
                            notAvail.push(item);
                        }
                    }
                }

                retryCount = (notAvail.length === 0) ? 0 : retryCount - 1;

                if (tryAgain) {
                    // we may need to strip the nulled out items here
                    this.startInterval();
                } else {
                    clearInterval(this._interval);
                    this._interval = null;
                }

                this.locked = false;

                return true;

            },

            /**
             * Removes all listeners attached to the given element via addListener.
             * Optionally, the node's children can also be purged.
             * Optionally, you can specify a specific type of event to remove.
             * @method purgeElement
             * @param {HTMLElement} el the element to purge
             * @param {boolean} recurse recursively purge this element's children
             * as well.  Use with caution.
             * @param {string} sType optional type of listener to purge. If
             * left out, all listeners will be removed
             * @static
             */
            purgeElement: function(el, recurse, sType) {
                var elListeners = this.getListeners(el, sType);
                if (elListeners) {
                    for (var i=0,len=elListeners.length; i<len ; ++i) {
                        var l = elListeners[i];
                        // can't use the index on the changing collection
                        //this.removeListener(el, l.type, l.fn, l.index);
                        this.removeListener(el, l.type, l.fn);
                    }
                }

                if (recurse && el && el.childNodes) {
                    for (i=0,len=el.childNodes.length; i<len ; ++i) {
                        this.purgeElement(el.childNodes[i], recurse, sType);
                    }
                }
            },

            /**
             * Returns all listeners attached to the given element via addListener.
             * Optionally, you can specify a specific type of event to return.
             * @method getListeners
             * @param el {HTMLElement} the element to inspect 
             * @param sType {string} optional type of listener to return. If
             * left out, all listeners will be returned
             * @return {Object} the listener. Contains the following fields:
             * &nbsp;&nbsp;type:   (string)   the type of event
             * &nbsp;&nbsp;fn:     (function) the callback supplied to addListener
             * &nbsp;&nbsp;obj:    (object)   the custom object supplied to addListener
             * &nbsp;&nbsp;adjust: (boolean)  whether or not to adjust the default scope
             * &nbsp;&nbsp;index:  (int)      its position in the Event util listener cache
             * @static
             */           
            getListeners: function(el, sType) {
                var results=[], searchLists;
                if (!sType) {
                    searchLists = [listeners, unloadListeners];
                } else if (sType == "unload") {
                    searchLists = [unloadListeners];
                } else {
                    searchLists = [listeners];
                }

                for (var j=0;j<searchLists.length; ++j) {
                    var searchList = searchLists[j];
                    if (searchList && searchList.length > 0) {
                        for (var i=0,len=searchList.length; i<len ; ++i) {
                            var l = searchList[i];
                            if ( l  && l[this.EL] === el && 
                                    (!sType || sType === l[this.TYPE]) ) {
                                results.push({
                                    type:   l[this.TYPE],
                                    fn:     l[this.FN],
                                    obj:    l[this.OBJ],
                                    adjust: l[this.ADJ_SCOPE],
                                    index:  i
                                });
                            }
                        }
                    }
                }

                return (results.length) ? results : null;
            },

            /**
             * Removes all listeners registered by pe.event.  Called 
             * automatically during the unload event.
             * @method _unload
             * @static
             * @private
             */
            _unload: function(e) {

                var EU = YAHOO.util.Event, i, j, l, len, index;

                for (i=0,len=unloadListeners.length; i<len; ++i) {
                    l = unloadListeners[i];
                    if (l) {
                        var scope = window;
                        if (l[EU.ADJ_SCOPE]) {
                            if (l[EU.ADJ_SCOPE] === true) {
                                scope = l[EU.OBJ];
                            } else {
                                scope = l[EU.ADJ_SCOPE];
                            }
                        }
                        l[EU.FN].call(scope, EU.getEvent(e), l[EU.OBJ] );
                        unloadListeners[i] = null;
                        l=null;
                        scope=null;
                    }
                }

                unloadListeners = null;

                if (listeners && listeners.length > 0) {
                    j = listeners.length;
                    while (j) {
                        index = j-1;
                        l = listeners[index];
                        if (l) {
                            EU.removeListener(l[EU.EL], l[EU.TYPE], 
                                    l[EU.FN], index);
                        } 
                        j = j - 1;
                    }
                    l=null;

                    EU.clearCache();
                }

                for (i=0,len=legacyEvents.length; i<len; ++i) {
                    // dereference the element
                    //delete legacyEvents[i][0];
                    legacyEvents[i][0] = null;

                    // delete the array item
                    //delete legacyEvents[i];
                    legacyEvents[i] = null;
                }

                legacyEvents = null;

                EU._simpleRemove(window, "unload", EU._unload);

            },

            /**
             * Returns scrollLeft
             * @method _getScrollLeft
             * @static
             * @private
             */
            _getScrollLeft: function() {
                return this._getScroll()[1];
            },

            /**
             * Returns scrollTop
             * @method _getScrollTop
             * @static
             * @private
             */
            _getScrollTop: function() {
                return this._getScroll()[0];
            },

            /**
             * Returns the scrollTop and scrollLeft.  Used to calculate the 
             * pageX and pageY in Internet Explorer
             * @method _getScroll
             * @static
             * @private
             */
            _getScroll: function() {
                var dd = document.documentElement, db = document.body;
                if (dd && (dd.scrollTop || dd.scrollLeft)) {
                    return [dd.scrollTop, dd.scrollLeft];
                } else if (db) {
                    return [db.scrollTop, db.scrollLeft];
                } else {
                    return [0, 0];
                }
            },
            
            /**
             * Used by old versions of CustomEvent, restored for backwards
             * compatibility
             * @method regCE
             * @private
             */
            regCE: function() {
                // does nothing
            },

            /**
             * Adds a DOM event directly without the caching, cleanup, scope adj, etc
             *
             * @method _simpleAdd
             * @param {HTMLElement} el      the element to bind the handler to
             * @param {string}      sType   the type of event handler
             * @param {function}    fn      the callback to invoke
             * @param {boolen}      capture capture or bubble phase
             * @static
             * @private
             */
            _simpleAdd: function () {
                if (window.addEventListener) {
                    return function(el, sType, fn, capture) {
                        el.addEventListener(sType, fn, (capture));
                    };
                } else if (window.attachEvent) {
                    return function(el, sType, fn, capture) {
                        el.attachEvent("on" + sType, fn);
                    };
                } else {
                    return function(){};
                }
            }(),

            /**
             * Basic remove listener
             *
             * @method _simpleRemove
             * @param {HTMLElement} el      the element to bind the handler to
             * @param {string}      sType   the type of event handler
             * @param {function}    fn      the callback to invoke
             * @param {boolen}      capture capture or bubble phase
             * @static
             * @private
             */
            _simpleRemove: function() {
                if (window.removeEventListener) {
                    return function (el, sType, fn, capture) {
                        el.removeEventListener(sType, fn, (capture));
                    };
                } else if (window.detachEvent) {
                    return function (el, sType, fn) {
                        el.detachEvent("on" + sType, fn);
                    };
                } else {
                    return function(){};
                }
            }()
        };

    }();

    (function() {
        var EU = YAHOO.util.Event;

        /**
         * YAHOO.util.Event.on is an alias for addListener
         * @method on
         * @see addListener
         * @static
         */
        EU.on = EU.addListener;

        // YAHOO.mix(EU, YAHOO.util.EventProvider.prototype);
        // EU.createEvent("DOMContentReady");
        // EU.subscribe("DOMContentReady", EU._load);

        if (document && document.body) {
            EU._load();
        } else {
            // EU._simpleAdd(document, "DOMContentLoaded", EU._load);
            EU._simpleAdd(window, "load", EU._load);
        }
        EU._simpleAdd(window, "unload", EU._unload);
        EU._tryPreloadAttach();
    })();
}

/**
 * The CustomEvent class lets you define events for your application
 * that can be subscribed to by one or more independent component.
 *
 * @param {String}  type The type of event, which is passed to the callback
 *                  when the event fires
 * @param {Object}  oScope The context the event will fire from.  "this" will
 *                  refer to this object in the callback.  Default value: 
 *                  the window object.  The listener can override this.
 * @param {boolean} silent pass true to prevent the event from writing to
 *                  the debugsystem
 * @param {int}     signature the signature that the custom event subscriber
 *                  will receive. YAHOO.util.CustomEvent.LIST or 
 *                  YAHOO.util.CustomEvent.FLAT.  The default is
 *                  YAHOO.util.CustomEvent.LIST.
 * @namespace YAHOO.util
 * @class CustomEvent
 * @constructor
 */
YAHOO.util.CustomEvent = function(type, oScope, silent, signature) {

    /**
     * The type of event, returned to subscribers when the event fires
     * @property type
     * @type string
     */
    this.type = type;

    /**
     * The scope the the event will fire from by default.  Defaults to the window 
     * obj
     * @property scope
     * @type object
     */
    this.scope = oScope || window;

    /**
     * By default all custom events are logged in the debug build, set silent
     * to true to disable debug outpu for this event.
     * @property silent
     * @type boolean
     */
    this.silent = silent;

    /**
     * Custom events support two styles of arguments provided to the event
     * subscribers.  
     * <ul>
     * <li>YAHOO.util.CustomEvent.LIST: 
     *   <ul>
     *   <li>param1: event name</li>
     *   <li>param2: array of arguments sent to fire</li>
     *   <li>param3: <optional> a custom object supplied by the subscriber</li>
     *   </ul>
     * </li>
     * <li>YAHOO.util.CustomEvent.FLAT
     *   <ul>
     *   <li>param1: the first argument passed to fire.  If you need to
     *           pass multiple parameters, use and array or object literal</li>
     *   <li>param2: <optional> a custom object supplied by the subscriber</li>
     *   </ul>
     * </li>
     * </ul>
     *   @property signature
     *   @type int
     */
    this.signature = signature || YAHOO.util.CustomEvent.LIST;

    /**
     * The subscribers to this event
     * @property subscribers
     * @type Subscriber[]
     */
    this.subscribers = [];

    if (!this.silent) {
    }

    var onsubscribeType = "_YUICEOnSubscribe";

    // Only add subscribe events for events that are not generated by 
    // CustomEvent
    if (type !== onsubscribeType) {

        /**
         * Custom events provide a custom event that fires whenever there is
         * a new subscriber to the event.  This provides an opportunity to
         * handle the case where there is a non-repeating event that has
         * already fired has a new subscriber.  
         *
         * @event subscribeEvent
         * @type YAHOO.util.CustomEvent
         * @param {Function} fn The function to execute
         * @param {Object}   obj An object to be passed along when the event 
         *                       fires
         * @param {boolean|Object}  override If true, the obj passed in becomes 
         *                                   the execution scope of the listener.
         *                                   if an object, that object becomes the
         *                                   the execution scope.
         */
        this.subscribeEvent = 
                new YAHOO.util.CustomEvent(onsubscribeType, this, true);

    } 
};

/**
 * Subscriber listener sigature constant.  The LIST type returns three
 * parameters: the event type, the array of args passed to fire, and
 * the optional custom object
 * @property YAHOO.util.CustomEvent.LIST
 * @static
 * @type int
 */
YAHOO.util.CustomEvent.LIST = 0;

/**
 * Subscriber listener sigature constant.  The FLAT type returns two
 * parameters: the first argument passed to fire and the optional 
 * custom object
 * @property YAHOO.util.CustomEvent.FLAT
 * @static
 * @type int
 */
YAHOO.util.CustomEvent.FLAT = 1;

YAHOO.util.CustomEvent.prototype = {

    /**
     * Subscribes the caller to this event
     * @method subscribe
     * @param {Function} fn        The function to execute
     * @param {Object}   obj       An object to be passed along when the event 
     *                             fires
     * @param {boolean|Object}  override If true, the obj passed in becomes 
     *                                   the execution scope of the listener.
     *                                   if an object, that object becomes the
     *                                   the execution scope.
     */
    subscribe: function(fn, obj, override) {
        if (this.subscribeEvent) {
            this.subscribeEvent.fire(fn, obj, override);
        }

        this.subscribers.push( new YAHOO.util.Subscriber(fn, obj, override) );
    },

    /**
     * Unsubscribes subscribers.
     * @method unsubscribe
     * @param {Function} fn  The subscribed function to remove, if not supplied
     *                       all will be removed
     * @param {Object}   obj  The custom object passed to subscribe.  This is
     *                        optional, but if supplied will be used to
     *                        disambiguate multiple listeners that are the same
     *                        (e.g., you subscribe many object using a function
     *                        that lives on the prototype)
     * @return {boolean} True if the subscriber was found and detached.
     */
    unsubscribe: function(fn, obj) {

        if (!fn) {
            return this.unsubscribeAll();
        }

        var found = false;
        for (var i=0, len=this.subscribers.length; i<len; ++i) {
            var s = this.subscribers[i];
            if (s && s.contains(fn, obj)) {
                this._delete(i);
                found = true;
            }
        }

        return found;
    },

    /**
     * Notifies the subscribers.  The callback functions will be executed
     * from the scope specified when the event was created, and with the 
     * following parameters:
     *   <ul>
     *   <li>The type of event</li>
     *   <li>All of the arguments fire() was executed with as an array</li>
     *   <li>The custom object (if any) that was passed into the subscribe() 
     *       method</li>
     *   </ul>
     * @method fire 
     * @param {Object*} arguments an arbitrary set of parameters to pass to 
     *                            the handler.
     * @return {boolean} false if one of the subscribers returned false, 
     *                   true otherwise
     */
    fire: function() {
        var len=this.subscribers.length;
        if (!len && this.silent) {
            return true;
        }

        var args=[], ret=true, i;

        for (i=0; i<arguments.length; ++i) {
            args.push(arguments[i]);
        }

        var argslength = args.length;

        if (!this.silent) {
        }

        for (i=0; i<len; ++i) {
            var s = this.subscribers[i];
            if (s) {
                if (!this.silent) {
                }

                var scope = s.getScope(this.scope);

                if (this.signature == YAHOO.util.CustomEvent.FLAT) {
                    var param = null;
                    if (args.length > 0) {
                        param = args[0];
                    }
                    ret = s.fn.call(scope, param, s.obj);
                } else {
                    ret = s.fn.call(scope, this.type, args, s.obj);
                }
                if (false === ret) {
                    if (!this.silent) {
                    }

                    //break;
                    return false;
                }
            }
        }

        return true;
    },

    /**
     * Removes all listeners
     * @method unsubscribeAll
     * @return {int} The number of listeners unsubscribed
     */
    unsubscribeAll: function() {
        for (var i=0, len=this.subscribers.length; i<len; ++i) {
            this._delete(len - 1 - i);
        }

        return i;
    },

    /**
     * @method _delete
     * @private
     */
    _delete: function(index) {
        var s = this.subscribers[index];
        if (s) {
            delete s.fn;
            delete s.obj;
        }

        // delete this.subscribers[index];
        this.subscribers.splice(index, 1);
    },

    /**
     * @method toString
     */
    toString: function() {
         return "CustomEvent: " + "'" + this.type  + "', " + 
             "scope: " + this.scope;

    }
};

/////////////////////////////////////////////////////////////////////

/**
 * Stores the subscriber information to be used when the event fires.
 * @param {Function} fn       The function to execute
 * @param {Object}   obj      An object to be passed along when the event fires
 * @param {boolean}  override If true, the obj passed in becomes the execution
 *                            scope of the listener
 * @class Subscriber
 * @constructor
 */
YAHOO.util.Subscriber = function(fn, obj, override) {

    /**
     * The callback that will be execute when the event fires
     * @property fn
     * @type function
     */
    this.fn = fn;

    /**
     * An optional custom object that will passed to the callback when
     * the event fires
     * @property obj
     * @type object
     */
    this.obj = obj || null;

    /**
     * The default execution scope for the event listener is defined when the
     * event is created (usually the object which contains the event).
     * By setting override to true, the execution scope becomes the custom
     * object passed in by the subscriber.  If override is an object, that 
     * object becomes the scope.
     * @property override
     * @type boolean|object
     */
    this.override = override;

};

/**
 * Returns the execution scope for this listener.  If override was set to true
 * the custom obj will be the scope.  If override is an object, that is the
 * scope, otherwise the default scope will be used.
 * @method getScope
 * @param {Object} defaultScope the scope to use if this listener does not
 *                              override it.
 */
YAHOO.util.Subscriber.prototype.getScope = function(defaultScope) {
    if (this.override) {
        if (this.override === true) {
            return this.obj;
        } else {
            return this.override;
        }
    }
    return defaultScope;
};

/**
 * Returns true if the fn and obj match this objects properties.
 * Used by the unsubscribe method to match the right subscriber.
 *
 * @method contains
 * @param {Function} fn the function to execute
 * @param {Object} obj an object to be passed along when the event fires
 * @return {boolean} true if the supplied arguments match this 
 *                   subscriber's signature.
 */
YAHOO.util.Subscriber.prototype.contains = function(fn, obj) {
    if (obj) {
        return (this.fn == fn && this.obj == obj);
    } else {
        return (this.fn == fn);
    }
};

/**
 * @method toString
 */
YAHOO.util.Subscriber.prototype.toString = function() {
    return "Subscriber { obj: " + (this.obj || "")  + 
           ", override: " +  (this.override || "no") + " }";
};

/**
 * EventProvider is designed to be used with YAHOO.augment to wrap 
 * CustomEvents in an interface that allows events to be subscribed to 
 * and fired by name.  This makes it possible for implementing code to
 * subscribe to an event that either has not been created yet, or will
 * not be created at all.
 *
 * @Class EventProvider
 */
YAHOO.util.EventProvider = function() { };

YAHOO.util.EventProvider.prototype = {

    /**
     * Private storage of custom events
     * @property __yui_events
     * @type Object[]
     * @private
     */
    __yui_events: null,

    /**
     * Private storage of custom event subscribers
     * @property __yui_subscribers
     * @type Object[]
     * @private
     */
    __yui_subscribers: null,
    
    /**
     * Subscribe to a CustomEvent by event type
     *
     * @method subscribe
     * @param p_type     {string}   the type, or name of the event
     * @param p_fn       {function} the function to exectute when the event fires
     * @param p_obj
     * @param p_obj      {Object}   An object to be passed along when the event 
     *                              fires
     * @param p_override {boolean}  If true, the obj passed in becomes the 
     *                              execution scope of the listener
     */
    subscribe: function(p_type, p_fn, p_obj, p_override) {

        this.__yui_events = this.__yui_events || {};
        var ce = this.__yui_events[p_type];

        if (ce) {
            ce.subscribe(p_fn, p_obj, p_override);
        } else {
            this.__yui_subscribers = this.__yui_subscribers || {};
            var subs = this.__yui_subscribers;
            if (!subs[p_type]) {
                subs[p_type] = [];
            }
            subs[p_type].push(
                { fn: p_fn, obj: p_obj, override: p_override } );
        }
    },

    /**
     * Unsubscribes one or more listeners the from the specified event
     * @method unsubscribe
     * @param p_type {string}   The type, or name of the event
     * @param p_fn   {Function} The subscribed function to unsubscribe, if not
     *                          supplied, all subscribers will be removed.
     * @param p_obj  {Object}   The custom object passed to subscribe.  This is
     *                        optional, but if supplied will be used to
     *                        disambiguate multiple listeners that are the same
     *                        (e.g., you subscribe many object using a function
     *                        that lives on the prototype)
     * @return {boolean} true if the subscriber was found and detached.
     */
    unsubscribe: function(p_type, p_fn, p_obj) {
        this.__yui_events = this.__yui_events || {};
        var ce = this.__yui_events[p_type];
        if (ce) {
            return ce.unsubscribe(p_fn, p_obj);
        } else {
            return false;
        }
    },
    
    /**
     * Removes all listeners from the specified event
     * @method unsubscribeAll
     * @param p_type {string}   The type, or name of the event
     */
    unsubscribeAll: function(p_type) {
        return this.unsubscribe(p_type);
    },

    /**
     * Creates a new custom event of the specified type.  If a custom event
     * by that name already exists, it will not be re-created.  In either
     * case the custom event is returned. 
     *
     * @method createEvent
     *
     * @param p_type {string} the type, or name of the event
     * @param p_config {object} optional config params.  Valid properties are:
     *
     *  <ul>
     *    <li>
     *      scope: defines the default execution scope.  If not defined
     *      the default scope will be this instance.
     *    </li>
     *    <li>
     *      silent: if true, the custom event will not generate log messages.
     *      This is false by default.
     *    </li>
     *    <li>
     *      onSubscribeCallback: specifies a callback to execute when the
     *      event has a new subscriber.  This will fire immediately for
     *      each queued subscriber if any exist prior to the creation of
     *      the event.
     *    </li>
     *  </ul>
     *
     *  @return {CustomEvent} the custom event
     *
     */
    createEvent: function(p_type, p_config) {

        this.__yui_events = this.__yui_events || {};
        var opts = p_config || {};
        var events = this.__yui_events;

        if (events[p_type]) {
        } else {

            var scope  = opts.scope  || this;
            var silent = opts.silent || null;

            var ce = new YAHOO.util.CustomEvent(p_type, scope, silent,
                    YAHOO.util.CustomEvent.FLAT);
            events[p_type] = ce;

            if (opts.onSubscribeCallback) {
                ce.subscribeEvent.subscribe(opts.onSubscribeCallback);
            }

            this.__yui_subscribers = this.__yui_subscribers || {};
            var qs = this.__yui_subscribers[p_type];

            if (qs) {
                for (var i=0; i<qs.length; ++i) {
                    ce.subscribe(qs[i].fn, qs[i].obj, qs[i].override);
                }
            }
        }

        return events[p_type];
    },


   /**
     * Fire a custom event by name.  The callback functions will be executed
     * from the scope specified when the event was created, and with the 
     * following parameters:
     *   <ul>
     *   <li>The first argument fire() was executed with</li>
     *   <li>The custom object (if any) that was passed into the subscribe() 
     *       method</li>
     *   </ul>
     * @method fireEvent
     * @param p_type    {string}  the type, or name of the event
     * @param arguments {Object*} an arbitrary set of parameters to pass to 
     *                            the handler.
     * @return {boolean} the return value from CustomEvent.fire, or null if 
     *                   the custom event does not exist.
     */
    fireEvent: function(p_type, arg1, arg2, etc) {

        this.__yui_events = this.__yui_events || {};
        var ce = this.__yui_events[p_type];

        if (ce) {
            var args = [];
            for (var i=1; i<arguments.length; ++i) {
                args.push(arguments[i]);
            }
            return ce.fire.apply(ce, args);
        } else {
            return null;
        }
    },

    /**
     * Returns true if the custom event of the provided type has been created
     * with createEvent.
     * @method hasEvent
     * @param type {string} the type, or name of the event
     */
    hasEvent: function(type) {
        if (this.__yui_events) {
            if (this.__yui_events[type]) {
                return true;
            }
        }
        return false;
    }

};

/**
* KeyListener is a utility that provides an easy interface for listening for
* keydown/keyup events fired against DOM elements.
* @namespace YAHOO.util
* @class KeyListener
* @constructor
* @param {HTMLElement} attachTo The element or element ID to which the key 
*                               event should be attached
* @param {String}      attachTo The element or element ID to which the key
*                               event should be attached
* @param {Object}      keyData  The object literal representing the key(s) 
*                               to detect. Possible attributes are 
*                               shift(boolean), alt(boolean), ctrl(boolean) 
*                               and keys(either an int or an array of ints 
*                               representing keycodes).
* @param {Function}    handler  The CustomEvent handler to fire when the 
*                               key event is detected
* @param {Object}      handler  An object literal representing the handler. 
* @param {String}      event    Optional. The event (keydown or keyup) to 
*                               listen for. Defaults automatically to keydown.
*/
YAHOO.util.KeyListener = function(attachTo, keyData, handler, event) {
    if (!attachTo) {
    } else if (!keyData) {
    } else if (!handler) {
    } 
    
    if (!event) {
        event = YAHOO.util.KeyListener.KEYDOWN;
    }

    /**
    * The CustomEvent fired internally when a key is pressed
    * @event keyEvent
    * @private
    * @param {Object} keyData The object literal representing the key(s) to 
    *                         detect. Possible attributes are shift(boolean), 
    *                         alt(boolean), ctrl(boolean) and keys(either an 
    *                         int or an array of ints representing keycodes).
    */
    var keyEvent = new YAHOO.util.CustomEvent("keyPressed");
    
    /**
    * The CustomEvent fired when the KeyListener is enabled via the enable() 
    * function
    * @event enabledEvent
    * @param {Object} keyData The object literal representing the key(s) to 
    *                         detect. Possible attributes are shift(boolean), 
    *                         alt(boolean), ctrl(boolean) and keys(either an 
    *                         int or an array of ints representing keycodes).
    */
    this.enabledEvent = new YAHOO.util.CustomEvent("enabled");

    /**
    * The CustomEvent fired when the KeyListener is disabled via the 
    * disable() function
    * @event disabledEvent
    * @param {Object} keyData The object literal representing the key(s) to 
    *                         detect. Possible attributes are shift(boolean), 
    *                         alt(boolean), ctrl(boolean) and keys(either an 
    *                         int or an array of ints representing keycodes).
    */
    this.disabledEvent = new YAHOO.util.CustomEvent("disabled");

    if (typeof attachTo == 'string') {
        attachTo = document.getElementById(attachTo);
    }

    if (typeof handler == 'function') {
        keyEvent.subscribe(handler);
    } else {
        keyEvent.subscribe(handler.fn, handler.scope, handler.correctScope);
    }

    /**
    * Handles the key event when a key is pressed.
    * @method handleKeyPress
    * @param {DOMEvent} e   The keypress DOM event
    * @param {Object}   obj The DOM event scope object
    * @private
    */
    function handleKeyPress(e, obj) {
        if (! keyData.shift) {  
            keyData.shift = false; 
        }
        if (! keyData.alt) {    
            keyData.alt = false;
        }
        if (! keyData.ctrl) {
            keyData.ctrl = false;
        }

        // check held down modifying keys first
        if (e.shiftKey == keyData.shift && 
            e.altKey   == keyData.alt &&
            e.ctrlKey  == keyData.ctrl) { // if we pass this, all modifiers match
            
            var dataItem;
            var keyPressed;

            if (keyData.keys instanceof Array) {
                for (var i=0;i<keyData.keys.length;i++) {
                    dataItem = keyData.keys[i];

                    if (dataItem == e.charCode ) {
                        keyEvent.fire(e.charCode, e);
                        break;
                    } else if (dataItem == e.keyCode) {
                        keyEvent.fire(e.keyCode, e);
                        break;
                    }
                }
            } else {
                dataItem = keyData.keys;
                if (dataItem == e.charCode ) {
                    keyEvent.fire(e.charCode, e);
                } else if (dataItem == e.keyCode) {
                    keyEvent.fire(e.keyCode, e);
                }
            }
        }
    }

    /**
    * Enables the KeyListener by attaching the DOM event listeners to the 
    * target DOM element
    * @method enable
    */
    this.enable = function() {
        if (! this.enabled) {
            YAHOO.util.Event.addListener(attachTo, event, handleKeyPress);
            this.enabledEvent.fire(keyData);
        }
        /**
        * Boolean indicating the enabled/disabled state of the Tooltip
        * @property enabled
        * @type Boolean
        */
        this.enabled = true;
    };

    /**
    * Disables the KeyListener by removing the DOM event listeners from the 
    * target DOM element
    * @method disable
    */
    this.disable = function() {
        if (this.enabled) {
            YAHOO.util.Event.removeListener(attachTo, event, handleKeyPress);
            this.disabledEvent.fire(keyData);
        }
        this.enabled = false;
    };

    /**
    * Returns a String representation of the object.
    * @method toString
    * @return {String}  The string representation of the KeyListener
    */ 
    this.toString = function() {
        return "KeyListener [" + keyData.keys + "] " + attachTo.tagName + 
                (attachTo.id ? "[" + attachTo.id + "]" : "");
    };

};

/**
* Constant representing the DOM "keydown" event.
* @property YAHOO.util.KeyListener.KEYDOWN
* @static
* @final
* @type String
*/
YAHOO.util.KeyListener.KEYDOWN = "keydown";

/**
* Constant representing the DOM "keyup" event.
* @property YAHOO.util.KeyListener.KEYUP
* @static
* @final
* @type String
*/
YAHOO.util.KeyListener.KEYUP = "keyup";
YAHOO.register("event", YAHOO.util.Event, {version: "2.2.0", build: "127"});

/*** end file 'event.js' ***/

/*** begin file 'dom.js' ***/
/*
Copyright (c) 2007, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.2.0
*/
/*
Copyright (c) 2006, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
*/

/**
 * The dom module provides helper methods for manipulating Dom elements.
 * @module dom
 *
 */

(function() {
    var Y = YAHOO.util,     // internal shorthand
        getStyle,           // for load time browser branching
        setStyle,           // ditto
        id_counter = 0,     // for use with generateId
        propertyCache = {}; // for faster hyphen converts
    
    // brower detection
    var ua = navigator.userAgent.toLowerCase(),
        isOpera = (ua.indexOf('opera') > -1),
        isSafari = (ua.indexOf('safari') > -1),
        isGecko = (!isOpera && !isSafari && ua.indexOf('gecko') > -1),
        isIE = (!isOpera && ua.indexOf('msie') > -1); 
    
    // regex cache
    var patterns = {
        HYPHEN: /(-[a-z])/i
    };

    
    var toCamel = function(property) {
        if ( !patterns.HYPHEN.test(property) ) {
            return property; // no hyphens
        }
        
        if (propertyCache[property]) { // already converted
            return propertyCache[property];
        }
        
        while( patterns.HYPHEN.exec(property) ) {
            property = property.replace(RegExp.$1,
                    RegExp.$1.substr(1).toUpperCase());
        }
        
        propertyCache[property] = property;
        return property;
        //return property.replace(/-([a-z])/gi, function(m0, m1) {return m1.toUpperCase()}) // cant use function as 2nd arg yet due to safari bug
    };
    
    // branching at load instead of runtime
    if (document.defaultView && document.defaultView.getComputedStyle) { // W3C DOM method
        getStyle = function(el, property) {
            var value = null;
            
            var computed = document.defaultView.getComputedStyle(el, '');
            if (computed) { // test computed before touching for safari
                value = computed[toCamel(property)];
            }
            
            return el.style[property] || value;
        };
    } else if (document.documentElement.currentStyle && isIE) { // IE method
        getStyle = function(el, property) {                         
            switch( toCamel(property) ) {
                case 'opacity' :// IE opacity uses filter
                    var val = 100;
                    try { // will error if no DXImageTransform
                        val = el.filters['DXImageTransform.Microsoft.Alpha'].opacity;

                    } catch(e) {
                        try { // make sure its in the document
                            val = el.filters('alpha').opacity;
                        } catch(e) {
                        }
                    }
                    return val / 100;
                    break;
                default: 
                    // test currentStyle before touching
                    var value = el.currentStyle ? el.currentStyle[property] : null;
                    return ( el.style[property] || value );
            }
        };
    } else { // default to inline only
        getStyle = function(el, property) { return el.style[property]; };
    }
    
    if (isIE) {
        setStyle = function(el, property, val) {
            switch (property) {
                case 'opacity':
                    if ( typeof el.style.filter == 'string' ) { // in case not appended
                        el.style.filter = 'alpha(opacity=' + val * 100 + ')';
                        
                        if (!el.currentStyle || !el.currentStyle.hasLayout) {
                            el.style.zoom = 1; // when no layout or cant tell
                        }
                    }
                    break;
                default:
                el.style[property] = val;
            }
        };
    } else {
        setStyle = function(el, property, val) {
            el.style[property] = val;
        };
    }
    
    /**
     * Provides helper methods for DOM elements.
     * @namespace YAHOO.util
     * @class Dom
     */
    YAHOO.util.Dom = {
        /**
         * Returns an HTMLElement reference.
         * @method get
         * @param {String | HTMLElement |Array} el Accepts a string to use as an ID for getting a DOM reference, an actual DOM reference, or an Array of IDs and/or HTMLElements.
         * @return {HTMLElement | Array} A DOM reference to an HTML element or an array of HTMLElements.
         */
        get: function(el) {
            if (!el) { return null; } // nothing to work with
            
            if (typeof el != 'string' && !(el instanceof Array) ) { // assuming HTMLElement or HTMLCollection, so pass back as is
                return el;
            }
            
            if (typeof el == 'string') { // ID
                return document.getElementById(el);
            }
            else { // array of ID's and/or elements
                var collection = [];
                for (var i = 0, len = el.length; i < len; ++i) {
                    collection[collection.length] = Y.Dom.get(el[i]);
                }
                
                return collection;
            }

            return null; // safety, should never happen
        },
    
        /**
         * Normalizes currentStyle and ComputedStyle.
         * @method getStyle
         * @param {String | HTMLElement |Array} el Accepts a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements.
         * @param {String} property The style property whose value is returned.
         * @return {String | Array} The current value of the style property for the element(s).
         */
        getStyle: function(el, property) {
            property = toCamel(property);
            
            var f = function(element) {
                return getStyle(element, property);
            };
            
            return Y.Dom.batch(el, f, Y.Dom, true);
        },
    
        /**
         * Wrapper for setting style properties of HTMLElements.  Normalizes "opacity" across modern browsers.
         * @method setStyle
         * @param {String | HTMLElement | Array} el Accepts a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements.
         * @param {String} property The style property to be set.
         * @param {String} val The value to apply to the given property.
         */
        setStyle: function(el, property, val) {
            property = toCamel(property);
            
            var f = function(element) {
                setStyle(element, property, val);
                
            };
            
            Y.Dom.batch(el, f, Y.Dom, true);
        },
        
        /**
         * Gets the current position of an element based on page coordinates.  Element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
         * @method getXY
         * @param {String | HTMLElement | Array} el Accepts a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements
         * @return {Array} The XY position of the element(s)
         */
        getXY: function(el) {
            var f = function(el) {
    
            // has to be part of document to have pageXY
                if (el.parentNode === null || el.offsetParent === null ||
                        this.getStyle(el, 'display') == 'none') {
                    return false;
                }
                
                var parentNode = null;
                var pos = [];
                var box;
                
                if (el.getBoundingClientRect) { // IE
                    box = el.getBoundingClientRect();
                    var doc = document;
                    if ( !this.inDocument(el) && parent.document != document) {// might be in a frame, need to get its scroll
                        doc = parent.document;

                        if ( !this.isAncestor(doc.documentElement, el) ) {
                            return false;                      
                        }

                    }

                    var scrollTop = Math.max(doc.documentElement.scrollTop, doc.body.scrollTop);
                    var scrollLeft = Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft);
                    
                    return [box.left + scrollLeft, box.top + scrollTop];
                }
                else { // safari, opera, & gecko
                    pos = [el.offsetLeft, el.offsetTop];
                    parentNode = el.offsetParent;
                    if (parentNode != el) {
                        while (parentNode) {
                            pos[0] += parentNode.offsetLeft;
                            pos[1] += parentNode.offsetTop;
                            parentNode = parentNode.offsetParent;
                        }
                    }
                    if (isSafari && this.getStyle(el, 'position') == 'absolute' ) { // safari doubles in some cases
                        pos[0] -= document.body.offsetLeft;
                        pos[1] -= document.body.offsetTop;
                    } 
                }
                
                if (el.parentNode) { parentNode = el.parentNode; }
                else { parentNode = null; }
        
                while (parentNode && parentNode.tagName.toUpperCase() != 'BODY' && parentNode.tagName.toUpperCase() != 'HTML') 
                { // account for any scrolled ancestors
                    if (Y.Dom.getStyle(parentNode, 'display') != 'inline') { // work around opera inline scrollLeft/Top bug
                        pos[0] -= parentNode.scrollLeft;
                        pos[1] -= parentNode.scrollTop;
                    }
                    
                    if (parentNode.parentNode) {
                        parentNode = parentNode.parentNode; 
                    } else { parentNode = null; }
                }
        
                
                return pos;
            };
            
            return Y.Dom.batch(el, f, Y.Dom, true);
        },
        
        /**
         * Gets the current X position of an element based on page coordinates.  The element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
         * @method getX
         * @param {String | HTMLElement | Array} el Accepts a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements
         * @return {String | Array} The X position of the element(s)
         */
        getX: function(el) {
            var f = function(el) {
                return Y.Dom.getXY(el)[0];
            };
            
            return Y.Dom.batch(el, f, Y.Dom, true);
        },
        
        /**
         * Gets the current Y position of an element based on page coordinates.  Element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
         * @method getY
         * @param {String | HTMLElement | Array} el Accepts a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements
         * @return {String | Array} The Y position of the element(s)
         */
        getY: function(el) {
            var f = function(el) {
                return Y.Dom.getXY(el)[1];
            };
            
            return Y.Dom.batch(el, f, Y.Dom, true);
        },
        
        /**
         * Set the position of an html element in page coordinates, regardless of how the element is positioned.
         * The element(s) must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
         * @method setXY
         * @param {String | HTMLElement | Array} el Accepts a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements
         * @param {Array} pos Contains X & Y values for new position (coordinates are page-based)
         * @param {Boolean} noRetry By default we try and set the position a second time if the first fails
         */
        setXY: function(el, pos, noRetry) {
            var f = function(el) {
                var style_pos = this.getStyle(el, 'position');
                if (style_pos == 'static') { // default to relative
                    this.setStyle(el, 'position', 'relative');
                    style_pos = 'relative';
                }

                var pageXY = this.getXY(el);
                if (pageXY === false) { // has to be part of doc to have pageXY
                    return false; 
                }
                
                var delta = [ // assuming pixels; if not we will have to retry
                    parseInt( this.getStyle(el, 'left'), 10 ),
                    parseInt( this.getStyle(el, 'top'), 10 )
                ];
            
                if ( isNaN(delta[0]) ) {// in case of 'auto'
                    delta[0] = (style_pos == 'relative') ? 0 : el.offsetLeft;
                } 
                if ( isNaN(delta[1]) ) { // in case of 'auto'
                    delta[1] = (style_pos == 'relative') ? 0 : el.offsetTop;
                } 
        
                if (pos[0] !== null) { el.style.left = pos[0] - pageXY[0] + delta[0] + 'px'; }
                if (pos[1] !== null) { el.style.top = pos[1] - pageXY[1] + delta[1] + 'px'; }
              
                if (!noRetry) {
                    var newXY = this.getXY(el);

                    // if retry is true, try one more time if we miss 
                   if ( (pos[0] !== null && newXY[0] != pos[0]) || 
                        (pos[1] !== null && newXY[1] != pos[1]) ) {
                       this.setXY(el, pos, true);
                   }
                }        
        
            };
            
            Y.Dom.batch(el, f, Y.Dom, true);
        },
        
        /**
         * Set the X position of an html element in page coordinates, regardless of how the element is positioned.
         * The element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
         * @method setX
         * @param {String | HTMLElement | Array} el Accepts a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements.
         * @param {Int} x The value to use as the X coordinate for the element(s).
         */
        setX: function(el, x) {
            Y.Dom.setXY(el, [x, null]);
        },
        
        /**
         * Set the Y position of an html element in page coordinates, regardless of how the element is positioned.
         * The element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
         * @method setY
         * @param {String | HTMLElement | Array} el Accepts a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements.
         * @param {Int} x To use as the Y coordinate for the element(s).
         */
        setY: function(el, y) {
            Y.Dom.setXY(el, [null, y]);
        },
        
        /**
         * Returns the region position of the given element.
         * The element must be part of the DOM tree to have a region (display:none or elements not appended return false).
         * @method getRegion
         * @param {String | HTMLElement | Array} el Accepts a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements.
         * @return {Region | Array} A Region or array of Region instances containing "top, left, bottom, right" member data.
         */
        getRegion: function(el) {
            var f = function(el) {
                var region = new Y.Region.getRegion(el);
                return region;
            };
            
            return Y.Dom.batch(el, f, Y.Dom, true);
        },
        
        /**
         * Returns the width of the client (viewport).
         * @method getClientWidth
         * @deprecated Now using getViewportWidth.  This interface left intact for back compat.
         * @return {Int} The width of the viewable area of the page.
         */
        getClientWidth: function() {
            return Y.Dom.getViewportWidth();
        },
        
        /**
         * Returns the height of the client (viewport).
         * @method getClientHeight
         * @deprecated Now using getViewportHeight.  This interface left intact for back compat.
         * @return {Int} The height of the viewable area of the page.
         */
        getClientHeight: function() {
            return Y.Dom.getViewportHeight();
        },

        /**
         * Returns a array of HTMLElements with the given class.
         * For optimized performance, include a tag and/or root node when possible.
         * @method getElementsByClassName
         * @param {String} className The class name to match against
         * @param {String} tag (optional) The tag name of the elements being collected
         * @param {String | HTMLElement} root (optional) The HTMLElement or an ID to use as the starting point 
         * @return {Array} An array of elements that have the given class name
         */
        getElementsByClassName: function(className, tag, root) {
            var method = function(el) { return Y.Dom.hasClass(el, className); };
            return Y.Dom.getElementsBy(method, tag, root);
        },

        /**
         * Determines whether an HTMLElement has the given className.
         * @method hasClass
         * @param {String | HTMLElement | Array} el The element or collection to test
         * @param {String} className the class name to search for
         * @return {Boolean | Array} A boolean value or array of boolean values
         */
        hasClass: function(el, className) {
            var re = new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)');
            
            var f = function(el) {
                return re.test(el['className']);
            };
            
            return Y.Dom.batch(el, f, Y.Dom, true);
        },
    
        /**
         * Adds a class name to a given element or collection of elements.
         * @method addClass         
         * @param {String | HTMLElement | Array} el The element or collection to add the class to
         * @param {String} className the class name to add to the class attribute
         */
        addClass: function(el, className) {
            var f = function(el) {
                if (this.hasClass(el, className)) { return; } // already present
                
                
                el['className'] = [el['className'], className].join(' ');
            };
            
            Y.Dom.batch(el, f, Y.Dom, true);
        },
    
        /**
         * Removes a class name from a given element or collection of elements.
         * @method removeClass         
         * @param {String | HTMLElement | Array} el The element or collection to remove the class from
         * @param {String} className the class name to remove from the class attribute
         */
        removeClass: function(el, className) {
            var re = new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)', 'g');

            var f = function(el) {
                if (!this.hasClass(el, className)) { return; } // not present
                
                
                var c = el['className'];
                el['className'] = c.replace(re, ' ');
                if ( this.hasClass(el, className) ) { // in case of multiple adjacent
                    this.removeClass(el, className);
                }
                
            };
            
            Y.Dom.batch(el, f, Y.Dom, true);
        },
        
        /**
         * Replace a class with another class for a given element or collection of elements.
         * If no oldClassName is present, the newClassName is simply added.
         * @method replaceClass  
         * @param {String | HTMLElement | Array} el The element or collection to remove the class from
         * @param {String} oldClassName the class name to be replaced
         * @param {String} newClassName the class name that will be replacing the old class name
         */
        replaceClass: function(el, oldClassName, newClassName) {
            if (oldClassName === newClassName) { // avoid infinite loop
                return false;
            }
            
            var re = new RegExp('(?:^|\\s+)' + oldClassName + '(?:\\s+|$)', 'g');

            var f = function(el) {
            
                if ( !this.hasClass(el, oldClassName) ) {
                    this.addClass(el, newClassName); // just add it if nothing to replace
                    return; // note return
                }
            
                el['className'] = el['className'].replace(re, ' ' + newClassName + ' ');

                if ( this.hasClass(el, oldClassName) ) { // in case of multiple adjacent
                    this.replaceClass(el, oldClassName, newClassName);
                }
            };
            
            Y.Dom.batch(el, f, Y.Dom, true);
        },
        
        /**
         * Generates a unique ID
         * @method generateId  
         * @param {String | HTMLElement | Array} el (optional) An optional element array of elements to add an ID to (no ID is added if one is already present).
         * @param {String} prefix (optional) an optional prefix to use (defaults to "yui-gen").
         * @return {String | Array} The generated ID, or array of generated IDs (or original ID if already present on an element)
         */
        generateId: function(el, prefix) {
            prefix = prefix || 'yui-gen';
            el = el || {};
            
            var f = function(el) {
                if (el) {
                    el = Y.Dom.get(el);
                } else {
                    el = {}; // just generating ID in this case
                }
                
                if (!el.id) {
                    el.id = prefix + id_counter++; 
                } // dont override existing
                
                
                return el.id;
            };
            
            return Y.Dom.batch(el, f, Y.Dom, true);
        },
        
        /**
         * Determines whether an HTMLElement is an ancestor of another HTML element in the DOM hierarchy.
         * @method isAncestor
         * @param {String | HTMLElement} haystack The possible ancestor
         * @param {String | HTMLElement} needle The possible descendent
         * @return {Boolean} Whether or not the haystack is an ancestor of needle
         */
        isAncestor: function(haystack, needle) {
            haystack = Y.Dom.get(haystack);
            if (!haystack || !needle) { return false; }
            
            var f = function(needle) {
                if (haystack.contains && !isSafari) { // safari "contains" is broken
                    return haystack.contains(needle);
                }
                else if ( haystack.compareDocumentPosition ) {
                    return !!(haystack.compareDocumentPosition(needle) & 16);
                }
                else { // loop up and test each parent
                    var parent = needle.parentNode;
                    
                    while (parent) {
                        if (parent == haystack) {
                            return true;
                        }
                        else if (!parent.tagName || parent.tagName.toUpperCase() == 'HTML') {
                            return false;
                        }
                        
                        parent = parent.parentNode;
                    }
                    return false;
                }     
            };
            
            return Y.Dom.batch(needle, f, Y.Dom, true);      
        },
        
        /**
         * Determines whether an HTMLElement is present in the current document.
         * @method inDocument         
         * @param {String | HTMLElement} el The element to search for
         * @return {Boolean} Whether or not the element is present in the current document
         */
        inDocument: function(el) {
            var f = function(el) {
                return this.isAncestor(document.documentElement, el);
            };
            
            return Y.Dom.batch(el, f, Y.Dom, true);
        },
        
        /**
         * Returns a array of HTMLElements that pass the test applied by supplied boolean method.
         * For optimized performance, include a tag and/or root node when possible.
         * @method getElementsBy
         * @param {Function} method - A boolean method for testing elements which receives the element as its only argument.

         * @param {String} tag (optional) The tag name of the elements being collected
         * @param {String | HTMLElement} root (optional) The HTMLElement or an ID to use as the starting point 
         * @return {Array} Array of HTMLElements
         */
        getElementsBy: function(method, tag, root) {
            tag = tag || '*';
            
            var nodes = [];
            
            if (root) {
                root = Y.Dom.get(root);
                if (!root) { // if no root node, then no children
                    return nodes;
                }
            } else {
                root = document;
            }
            
            var elements = root.getElementsByTagName(tag);
            
            if ( !elements.length && (tag == '*' && root.all) ) {
                elements = root.all; // IE < 6
            }
            
            for (var i = 0, len = elements.length; i < len; ++i) {
                if ( method(elements[i]) ) { nodes[nodes.length] = elements[i]; }
            }

            
            return nodes;
        },
        
        /**
         * Returns an array of elements that have had the supplied method applied.
         * The method is called with the element(s) as the first arg, and the optional param as the second ( method(el, o) ).
         * @method batch
         * @param {String | HTMLElement | Array} el (optional) An element or array of elements to apply the method to
         * @param {Function} method The method to apply to the element(s)
         * @param {Any} o (optional) An optional arg that is passed to the supplied method
         * @param {Boolean} override (optional) Whether or not to override the scope of "method" with "o"
         * @return {HTMLElement | Array} The element(s) with the method applied
         */
        batch: function(el, method, o, override) {
            var id = el;
            el = Y.Dom.get(el);
            
            var scope = (override) ? o : window;
            
            if (!el || el.tagName || !el.length) { // is null or not a collection (tagName for SELECT and others that can be both an element and a collection)
                if (!el) {
                    return false;
                }
                return method.call(scope, el, o);
            } 
            
            var collection = [];
            
            for (var i = 0, len = el.length; i < len; ++i) {
                if (!el[i]) {
                    id = el[i];
                }
                collection[collection.length] = method.call(scope, el[i], o);
            }
            
            return collection;
        },
        
        /**
         * Returns the height of the document.
         * @method getDocumentHeight
         * @return {Int} The height of the actual document (which includes the body and its margin).
         */
        getDocumentHeight: function() {
            var scrollHeight = (document.compatMode != 'CSS1Compat') ? document.body.scrollHeight : document.documentElement.scrollHeight;

            var h = Math.max(scrollHeight, Y.Dom.getViewportHeight());
            return h;
        },
        
        /**
         * Returns the width of the document.
         * @method getDocumentWidth
         * @return {Int} The width of the actual document (which includes the body and its margin).
         */
        getDocumentWidth: function() {
            var scrollWidth = (document.compatMode != 'CSS1Compat') ? document.body.scrollWidth : document.documentElement.scrollWidth;
            var w = Math.max(scrollWidth, Y.Dom.getViewportWidth());
            return w;
        },

        /**
         * Returns the current height of the viewport.
         * @method getViewportHeight
         * @return {Int} The height of the viewable area of the page (excludes scrollbars).
         */
        getViewportHeight: function() {
            var height = self.innerHeight; // Safari, Opera
            var mode = document.compatMode;
        
            if ( (mode || isIE) && !isOpera ) { // IE, Gecko
                height = (mode == 'CSS1Compat') ?
                        document.documentElement.clientHeight : // Standards
                        document.body.clientHeight; // Quirks
            }
        
            return height;
        },
        
        /**
         * Returns the current width of the viewport.
         * @method getViewportWidth
         * @return {Int} The width of the viewable area of the page (excludes scrollbars).
         */
        
        getViewportWidth: function() {
            var width = self.innerWidth;  // Safari
            var mode = document.compatMode;
            
            if (mode || isIE) { // IE, Gecko, Opera
                width = (mode == 'CSS1Compat') ?
                        document.documentElement.clientWidth : // Standards
                        document.body.clientWidth; // Quirks
            }
            return width;
        }
    };
})();
/**
 * A region is a representation of an object on a grid.  It is defined
 * by the top, right, bottom, left extents, so is rectangular by default.  If 
 * other shapes are required, this class could be extended to support it.
 * @namespace YAHOO.util
 * @class Region
 * @param {Int} t the top extent
 * @param {Int} r the right extent
 * @param {Int} b the bottom extent
 * @param {Int} l the left extent
 * @constructor
 */
YAHOO.util.Region = function(t, r, b, l) {

    /**
     * The region's top extent
     * @property top
     * @type Int
     */
    this.top = t;
    
    /**
     * The region's top extent as index, for symmetry with set/getXY
     * @property 1
     * @type Int
     */
    this[1] = t;

    /**
     * The region's right extent
     * @property right
     * @type int
     */
    this.right = r;

    /**
     * The region's bottom extent
     * @property bottom
     * @type Int
     */
    this.bottom = b;

    /**
     * The region's left extent
     * @property left
     * @type Int
     */
    this.left = l;
    
    /**
     * The region's left extent as index, for symmetry with set/getXY
     * @property 0
     * @type Int
     */
    this[0] = l;
};

/**
 * Returns true if this region contains the region passed in
 * @method contains
 * @param  {Region}  region The region to evaluate
 * @return {Boolean}        True if the region is contained with this region, 
 *                          else false
 */
YAHOO.util.Region.prototype.contains = function(region) {
    return ( region.left   >= this.left   && 
             region.right  <= this.right  && 
             region.top    >= this.top    && 
             region.bottom <= this.bottom    );

};

/**
 * Returns the area of the region
 * @method getArea
 * @return {Int} the region's area
 */
YAHOO.util.Region.prototype.getArea = function() {
    return ( (this.bottom - this.top) * (this.right - this.left) );
};

/**
 * Returns the region where the passed in region overlaps with this one
 * @method intersect
 * @param  {Region} region The region that intersects
 * @return {Region}        The overlap region, or null if there is no overlap
 */
YAHOO.util.Region.prototype.intersect = function(region) {
    var t = Math.max( this.top,    region.top    );
    var r = Math.min( this.right,  region.right  );
    var b = Math.min( this.bottom, region.bottom );
    var l = Math.max( this.left,   region.left   );
    
    if (b >= t && r >= l) {
        return new YAHOO.util.Region(t, r, b, l);
    } else {
        return null;
    }
};

/**
 * Returns the region representing the smallest region that can contain both
 * the passed in region and this region.
 * @method union
 * @param  {Region} region The region that to create the union with
 * @return {Region}        The union region
 */
YAHOO.util.Region.prototype.union = function(region) {
    var t = Math.min( this.top,    region.top    );
    var r = Math.max( this.right,  region.right  );
    var b = Math.max( this.bottom, region.bottom );
    var l = Math.min( this.left,   region.left   );

    return new YAHOO.util.Region(t, r, b, l);
};

/**
 * toString
 * @method toString
 * @return string the region properties
 */
YAHOO.util.Region.prototype.toString = function() {
    return ( "Region {"    +
             "top: "       + this.top    + 
             ", right: "   + this.right  + 
             ", bottom: "  + this.bottom + 
             ", left: "    + this.left   + 
             "}" );
};

/**
 * Returns a region that is occupied by the DOM element
 * @method getRegion
 * @param  {HTMLElement} el The element
 * @return {Region}         The region that the element occupies
 * @static
 */
YAHOO.util.Region.getRegion = function(el) {
    var p = YAHOO.util.Dom.getXY(el);

    var t = p[1];
    var r = p[0] + el.offsetWidth;
    var b = p[1] + el.offsetHeight;
    var l = p[0];

    return new YAHOO.util.Region(t, r, b, l);
};

/////////////////////////////////////////////////////////////////////////////


/**
 * A point is a region that is special in that it represents a single point on 
 * the grid.
 * @namespace YAHOO.util
 * @class Point
 * @param {Int} x The X position of the point
 * @param {Int} y The Y position of the point
 * @constructor
 * @extends YAHOO.util.Region
 */
YAHOO.util.Point = function(x, y) {
   if (x instanceof Array) { // accept output from Dom.getXY
      y = x[1];
      x = x[0];
   }
   
    /**
     * The X position of the point, which is also the right, left and index zero (for Dom.getXY symmetry)
     * @property x
     * @type Int
     */

    this.x = this.right = this.left = this[0] = x;
     
    /**
     * The Y position of the point, which is also the top, bottom and index one (for Dom.getXY symmetry)
     * @property y
     * @type Int
     */
    this.y = this.top = this.bottom = this[1] = y;
};

YAHOO.util.Point.prototype = new YAHOO.util.Region();

YAHOO.register("dom", YAHOO.util.Dom, {version: "2.2.0", build: "127"});

/*** end file 'dom.js' ***/

/*** begin file 'dragdrop.js' ***/
/*
Copyright (c) 2007, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.2.0
*/
/**
 * The drag and drop utility provides a framework for building drag and drop
 * applications.  In addition to enabling drag and drop for specific elements,
 * the drag and drop elements are tracked by the manager class, and the
 * interactions between the various elements are tracked during the drag and
 * the implementing code is notified about these important moments.
 * @module dragdrop
 * @title Drag and Drop
 * @requires yahoo,dom,event
 * @namespace YAHOO.util
 */

// Only load the library once.  Rewriting the manager class would orphan 
// existing drag and drop instances.
if (!YAHOO.util.DragDropMgr) {

/**
 * DragDropMgr is a singleton that tracks the element interaction for 
 * all DragDrop items in the window.  Generally, you will not call 
 * this class directly, but it does have helper methods that could 
 * be useful in your DragDrop implementations.
 * @class DragDropMgr
 * @static
 */
YAHOO.util.DragDropMgr = function() {

    var Event = YAHOO.util.Event;

    return {

        /**
         * Two dimensional Array of registered DragDrop objects.  The first 
         * dimension is the DragDrop item group, the second the DragDrop 
         * object.
         * @property ids
         * @type {string: string}
         * @private
         * @static
         */
        ids: {},

        /**
         * Array of element ids defined as drag handles.  Used to determine 
         * if the element that generated the mousedown event is actually the 
         * handle and not the html element itself.
         * @property handleIds
         * @type {string: string}
         * @private
         * @static
         */
        handleIds: {},

        /**
         * the DragDrop object that is currently being dragged
         * @property dragCurrent
         * @type DragDrop
         * @private
         * @static
         **/
        dragCurrent: null,

        /**
         * the DragDrop object(s) that are being hovered over
         * @property dragOvers
         * @type Array
         * @private
         * @static
         */
        dragOvers: {},

        /**
         * the X distance between the cursor and the object being dragged
         * @property deltaX
         * @type int
         * @private
         * @static
         */
        deltaX: 0,

        /**
         * the Y distance between the cursor and the object being dragged
         * @property deltaY
         * @type int
         * @private
         * @static
         */
        deltaY: 0,

        /**
         * Flag to determine if we should prevent the default behavior of the
         * events we define. By default this is true, but this can be set to 
         * false if you need the default behavior (not recommended)
         * @property preventDefault
         * @type boolean
         * @static
         */
        preventDefault: true,

        /**
         * Flag to determine if we should stop the propagation of the events 
         * we generate. This is true by default but you may want to set it to
         * false if the html element contains other features that require the
         * mouse click.
         * @property stopPropagation
         * @type boolean
         * @static
         */
        stopPropagation: true,

        /**
         * Internal flag that is set to true when drag and drop has been
         * intialized
         * @property initialized
         * @private
         * @static
         */
        initalized: false,

        /**
         * All drag and drop can be disabled.
         * @property locked
         * @private
         * @static
         */
        locked: false,

        /**
         * Called the first time an element is registered.
         * @method init
         * @private
         * @static
         */
        init: function() {
            this.initialized = true;
        },

        /**
         * In point mode, drag and drop interaction is defined by the 
         * location of the cursor during the drag/drop
         * @property POINT
         * @type int
         * @static
         * @final
         */
        POINT: 0,

        /**
         * In intersect mode, drag and drop interaction is defined by the 
         * cursor position or the amount of overlap of two or more drag and 
         * drop objects.
         * @property INTERSECT
         * @type int
         * @static
         * @final
         */
        INTERSECT: 1,

        /**
         * In intersect mode, drag and drop interaction is defined only by the 
         * overlap of two or more drag and drop objects.
         * @property STRICT_INTERSECT
         * @type int
         * @static
         * @final
         */
        STRICT_INTERSECT: 2,

        /**
         * The current drag and drop mode.  Default: POINT
         * @property mode
         * @type int
         * @static
         */
        mode: 0,

        /**
         * Runs method on all drag and drop objects
         * @method _execOnAll
         * @private
         * @static
         */
        _execOnAll: function(sMethod, args) {
            for (var i in this.ids) {
                for (var j in this.ids[i]) {
                    var oDD = this.ids[i][j];
                    if (! this.isTypeOfDD(oDD)) {
                        continue;
                    }
                    oDD[sMethod].apply(oDD, args);
                }
            }
        },

        /**
         * Drag and drop initialization.  Sets up the global event handlers
         * @method _onLoad
         * @private
         * @static
         */
        _onLoad: function() {

            this.init();


            Event.on(document, "mouseup",   this.handleMouseUp, this, true);
            Event.on(document, "mousemove", this.handleMouseMove, this, true);
            Event.on(window,   "unload",    this._onUnload, this, true);
            Event.on(window,   "resize",    this._onResize, this, true);
            // Event.on(window,   "mouseout",    this._test);

        },

        /**
         * Reset constraints on all drag and drop objs
         * @method _onResize
         * @private
         * @static
         */
        _onResize: function(e) {
            this._execOnAll("resetConstraints", []);
        },

        /**
         * Lock all drag and drop functionality
         * @method lock
         * @static
         */
        lock: function() { this.locked = true; },

        /**
         * Unlock all drag and drop functionality
         * @method unlock
         * @static
         */
        unlock: function() { this.locked = false; },

        /**
         * Is drag and drop locked?
         * @method isLocked
         * @return {boolean} True if drag and drop is locked, false otherwise.
         * @static
         */
        isLocked: function() { return this.locked; },

        /**
         * Location cache that is set for all drag drop objects when a drag is
         * initiated, cleared when the drag is finished.
         * @property locationCache
         * @private
         * @static
         */
        locationCache: {},

        /**
         * Set useCache to false if you want to force object the lookup of each
         * drag and drop linked element constantly during a drag.
         * @property useCache
         * @type boolean
         * @static
         */
        useCache: true,

        /**
         * The number of pixels that the mouse needs to move after the 
         * mousedown before the drag is initiated.  Default=3;
         * @property clickPixelThresh
         * @type int
         * @static
         */
        clickPixelThresh: 3,

        /**
         * The number of milliseconds after the mousedown event to initiate the
         * drag if we don't get a mouseup event. Default=1000
         * @property clickTimeThresh
         * @type int
         * @static
         */
        clickTimeThresh: 1000,

        /**
         * Flag that indicates that either the drag pixel threshold or the 
         * mousdown time threshold has been met
         * @property dragThreshMet
         * @type boolean
         * @private
         * @static
         */
        dragThreshMet: false,

        /**
         * Timeout used for the click time threshold
         * @property clickTimeout
         * @type Object
         * @private
         * @static
         */
        clickTimeout: null,

        /**
         * The X position of the mousedown event stored for later use when a 
         * drag threshold is met.
         * @property startX
         * @type int
         * @private
         * @static
         */
        startX: 0,

        /**
         * The Y position of the mousedown event stored for later use when a 
         * drag threshold is met.
         * @property startY
         * @type int
         * @private
         * @static
         */
        startY: 0,

        /**
         * Each DragDrop instance must be registered with the DragDropMgr.  
         * This is executed in DragDrop.init()
         * @method regDragDrop
         * @param {DragDrop} oDD the DragDrop object to register
         * @param {String} sGroup the name of the group this element belongs to
         * @static
         */
        regDragDrop: function(oDD, sGroup) {
            if (!this.initialized) { this.init(); }
            
            if (!this.ids[sGroup]) {
                this.ids[sGroup] = {};
            }
            this.ids[sGroup][oDD.id] = oDD;
        },

        /**
         * Removes the supplied dd instance from the supplied group. Executed
         * by DragDrop.removeFromGroup, so don't call this function directly.
         * @method removeDDFromGroup
         * @private
         * @static
         */
        removeDDFromGroup: function(oDD, sGroup) {
            if (!this.ids[sGroup]) {
                this.ids[sGroup] = {};
            }

            var obj = this.ids[sGroup];
            if (obj && obj[oDD.id]) {
                delete obj[oDD.id];
            }
        },

        /**
         * Unregisters a drag and drop item.  This is executed in 
         * DragDrop.unreg, use that method instead of calling this directly.
         * @method _remove
         * @private
         * @static
         */
        _remove: function(oDD) {
            for (var g in oDD.groups) {
                if (g && this.ids[g][oDD.id]) {
                    delete this.ids[g][oDD.id];
                }
            }
            delete this.handleIds[oDD.id];
        },

        /**
         * Each DragDrop handle element must be registered.  This is done
         * automatically when executing DragDrop.setHandleElId()
         * @method regHandle
         * @param {String} sDDId the DragDrop id this element is a handle for
         * @param {String} sHandleId the id of the element that is the drag 
         * handle
         * @static
         */
        regHandle: function(sDDId, sHandleId) {
            if (!this.handleIds[sDDId]) {
                this.handleIds[sDDId] = {};
            }
            this.handleIds[sDDId][sHandleId] = sHandleId;
        },

        /**
         * Utility function to determine if a given element has been 
         * registered as a drag drop item.
         * @method isDragDrop
         * @param {String} id the element id to check
         * @return {boolean} true if this element is a DragDrop item, 
         * false otherwise
         * @static
         */
        isDragDrop: function(id) {
            return ( this.getDDById(id) ) ? true : false;
        },

        /**
         * Returns the drag and drop instances that are in all groups the
         * passed in instance belongs to.
         * @method getRelated
         * @param {DragDrop} p_oDD the obj to get related data for
         * @param {boolean} bTargetsOnly if true, only return targetable objs
         * @return {DragDrop[]} the related instances
         * @static
         */
        getRelated: function(p_oDD, bTargetsOnly) {
            var oDDs = [];
            for (var i in p_oDD.groups) {
                for (j in this.ids[i]) {
                    var dd = this.ids[i][j];
                    if (! this.isTypeOfDD(dd)) {
                        continue;
                    }
                    if (!bTargetsOnly || dd.isTarget) {
                        oDDs[oDDs.length] = dd;
                    }
                }
            }

            return oDDs;
        },

        /**
         * Returns true if the specified dd target is a legal target for 
         * the specifice drag obj
         * @method isLegalTarget
         * @param {DragDrop} the drag obj
         * @param {DragDrop} the target
         * @return {boolean} true if the target is a legal target for the 
         * dd obj
         * @static
         */
        isLegalTarget: function (oDD, oTargetDD) {
            var targets = this.getRelated(oDD, true);
            for (var i=0, len=targets.length;i<len;++i) {
                if (targets[i].id == oTargetDD.id) {
                    return true;
                }
            }

            return false;
        },

        /**
         * My goal is to be able to transparently determine if an object is
         * typeof DragDrop, and the exact subclass of DragDrop.  typeof 
         * returns "object", oDD.constructor.toString() always returns
         * "DragDrop" and not the name of the subclass.  So for now it just
         * evaluates a well-known variable in DragDrop.
         * @method isTypeOfDD
         * @param {Object} the object to evaluate
         * @return {boolean} true if typeof oDD = DragDrop
         * @static
         */
        isTypeOfDD: function (oDD) {
            return (oDD && oDD.__ygDragDrop);
        },

        /**
         * Utility function to determine if a given element has been 
         * registered as a drag drop handle for the given Drag Drop object.
         * @method isHandle
         * @param {String} id the element id to check
         * @return {boolean} true if this element is a DragDrop handle, false 
         * otherwise
         * @static
         */
        isHandle: function(sDDId, sHandleId) {
            return ( this.handleIds[sDDId] && 
                            this.handleIds[sDDId][sHandleId] );
        },

        /**
         * Returns the DragDrop instance for a given id
         * @method getDDById
         * @param {String} id the id of the DragDrop object
         * @return {DragDrop} the drag drop object, null if it is not found
         * @static
         */
        getDDById: function(id) {
            for (var i in this.ids) {
                if (this.ids[i][id]) {
                    return this.ids[i][id];
                }
            }
            return null;
        },

        /**
         * Fired after a registered DragDrop object gets the mousedown event.
         * Sets up the events required to track the object being dragged
         * @method handleMouseDown
         * @param {Event} e the event
         * @param oDD the DragDrop object being dragged
         * @private
         * @static
         */
        handleMouseDown: function(e, oDD) {

            this.currentTarget = YAHOO.util.Event.getTarget(e);

            this.dragCurrent = oDD;

            var el = oDD.getEl();

            // track start position
            this.startX = YAHOO.util.Event.getPageX(e);
            this.startY = YAHOO.util.Event.getPageY(e);

            this.deltaX = this.startX - el.offsetLeft;
            this.deltaY = this.startY - el.offsetTop;

            this.dragThreshMet = false;

            this.clickTimeout = setTimeout( 
                    function() { 
                        var DDM = YAHOO.util.DDM;
                        DDM.startDrag(DDM.startX, DDM.startY); 
                    }, 
                    this.clickTimeThresh );
        },

        /**
         * Fired when either the drag pixel threshol or the mousedown hold 
         * time threshold has been met.
         * @method startDrag
         * @param x {int} the X position of the original mousedown
         * @param y {int} the Y position of the original mousedown
         * @static
         */
        startDrag: function(x, y) {
            clearTimeout(this.clickTimeout);
            if (this.dragCurrent) {
                this.dragCurrent.b4StartDrag(x, y);
                this.dragCurrent.startDrag(x, y);
            }
            this.dragThreshMet = true;
        },

        /**
         * Internal function to handle the mouseup event.  Will be invoked 
         * from the context of the document.
         * @method handleMouseUp
         * @param {Event} e the event
         * @private
         * @static
         */
        handleMouseUp: function(e) {

            if (! this.dragCurrent) {
                return;
            }

            clearTimeout(this.clickTimeout);

            if (this.dragThreshMet) {
                this.fireEvents(e, true);
            } else {
            }

            this.stopDrag(e);

            this.stopEvent(e);
        },

        /**
         * Utility to stop event propagation and event default, if these 
         * features are turned on.
         * @method stopEvent
         * @param {Event} e the event as returned by this.getEvent()
         * @static
         */
        stopEvent: function(e) {
            if (this.stopPropagation) {
                YAHOO.util.Event.stopPropagation(e);
            }

            if (this.preventDefault) {
                YAHOO.util.Event.preventDefault(e);
            }
        },

        /** 
         * Internal function to clean up event handlers after the drag 
         * operation is complete
         * @method stopDrag
         * @param {Event} e the event
         * @private
         * @static
         */
        stopDrag: function(e) {

            // Fire the drag end event for the item that was dragged
            if (this.dragCurrent) {
                if (this.dragThreshMet) {
                    this.dragCurrent.b4EndDrag(e);
                    this.dragCurrent.endDrag(e);
                }

                this.dragCurrent.onMouseUp(e);
            }

            this.dragCurrent = null;
            this.dragOvers = {};
        },


        /** 
         * Internal function to handle the mousemove event.  Will be invoked 
         * from the context of the html element.
         *
         * @TODO figure out what we can do about mouse events lost when the 
         * user drags objects beyond the window boundary.  Currently we can 
         * detect this in internet explorer by verifying that the mouse is 
         * down during the mousemove event.  Firefox doesn't give us the 
         * button state on the mousemove event.
         * @method handleMouseMove
         * @param {Event} e the event
         * @private
         * @static
         */
        handleMouseMove: function(e) {
            if (! this.dragCurrent) {
                return true;
            }

            // var button = e.which || e.button;

            // check for IE mouseup outside of page boundary
            if (YAHOO.util.Event.isIE && !e.button) {
                this.stopEvent(e);
                return this.handleMouseUp(e);
            }

            if (!this.dragThreshMet) {
                var diffX = Math.abs(this.startX - YAHOO.util.Event.getPageX(e));
                var diffY = Math.abs(this.startY - YAHOO.util.Event.getPageY(e));
                if (diffX > this.clickPixelThresh || 
                            diffY > this.clickPixelThresh) {
                    this.startDrag(this.startX, this.startY);
                }
            }

            if (this.dragThreshMet) {
                this.dragCurrent.b4Drag(e);
                this.dragCurrent.onDrag(e);
                this.fireEvents(e, false);
            }

            this.stopEvent(e);

            return true;
        },

        /**
         * Iterates over all of the DragDrop elements to find ones we are 
         * hovering over or dropping on
         * @method fireEvents
         * @param {Event} e the event
         * @param {boolean} isDrop is this a drop op or a mouseover op?
         * @private
         * @static
         */
        fireEvents: function(e, isDrop) {
            var dc = this.dragCurrent;

            // If the user did the mouse up outside of the window, we could 
            // get here even though we have ended the drag.
            if (!dc || dc.isLocked()) {
                return;
            }

            var x = YAHOO.util.Event.getPageX(e);
            var y = YAHOO.util.Event.getPageY(e);
            var pt = new YAHOO.util.Point(x,y);

            // cache the previous dragOver array
            var oldOvers = [];

            var outEvts   = [];
            var overEvts  = [];
            var dropEvts  = [];
            var enterEvts = [];

            // Check to see if the object(s) we were hovering over is no longer 
            // being hovered over so we can fire the onDragOut event
            for (var i in this.dragOvers) {

                var ddo = this.dragOvers[i];

                if (! this.isTypeOfDD(ddo)) {
                    continue;
                }

                if (! this.isOverTarget(pt, ddo, this.mode)) {
                    outEvts.push( ddo );
                }

                oldOvers[i] = true;
                delete this.dragOvers[i];
            }

            for (var sGroup in dc.groups) {
                
                if ("string" != typeof sGroup) {
                    continue;
                }

                for (i in this.ids[sGroup]) {
                    var oDD = this.ids[sGroup][i];
                    if (! this.isTypeOfDD(oDD)) {
                        continue;
                    }

                    if (oDD.isTarget && !oDD.isLocked() && oDD != dc) {
                        if (this.isOverTarget(pt, oDD, this.mode)) {
                            // look for drop interactions
                            if (isDrop) {
                                dropEvts.push( oDD );
                            // look for drag enter and drag over interactions
                            } else {

                                // initial drag over: dragEnter fires
                                if (!oldOvers[oDD.id]) {
                                    enterEvts.push( oDD );
                                // subsequent drag overs: dragOver fires
                                } else {
                                    overEvts.push( oDD );
                                }

                                this.dragOvers[oDD.id] = oDD;
                            }
                        }
                    }
                }
            }

            if (this.mode) {
                if (outEvts.length) {
                    dc.b4DragOut(e, outEvts);
                    dc.onDragOut(e, outEvts);
                }

                if (enterEvts.length) {
                    dc.onDragEnter(e, enterEvts);
                }

                if (overEvts.length) {
                    dc.b4DragOver(e, overEvts);
                    dc.onDragOver(e, overEvts);
                }

                if (dropEvts.length) {
                    dc.b4DragDrop(e, dropEvts);
                    dc.onDragDrop(e, dropEvts);
                }

            } else {
                // fire dragout events
                var len = 0;
                for (i=0, len=outEvts.length; i<len; ++i) {
                    dc.b4DragOut(e, outEvts[i].id);
                    dc.onDragOut(e, outEvts[i].id);
                }
                 
                // fire enter events
                for (i=0,len=enterEvts.length; i<len; ++i) {
                    // dc.b4DragEnter(e, oDD.id);
                    dc.onDragEnter(e, enterEvts[i].id);
                }
         
                // fire over events
                for (i=0,len=overEvts.length; i<len; ++i) {
                    dc.b4DragOver(e, overEvts[i].id);
                    dc.onDragOver(e, overEvts[i].id);
                }

                // fire drop events
                for (i=0, len=dropEvts.length; i<len; ++i) {
                    dc.b4DragDrop(e, dropEvts[i].id);
                    dc.onDragDrop(e, dropEvts[i].id);
                }

            }

            // notify about a drop that did not find a target
            if (isDrop && !dropEvts.length) {
                dc.onInvalidDrop(e);
            }

        },

        /**
         * Helper function for getting the best match from the list of drag 
         * and drop objects returned by the drag and drop events when we are 
         * in INTERSECT mode.  It returns either the first object that the 
         * cursor is over, or the object that has the greatest overlap with 
         * the dragged element.
         * @method getBestMatch
         * @param  {DragDrop[]} dds The array of drag and drop objects 
         * targeted
         * @return {DragDrop}       The best single match
         * @static
         */
        getBestMatch: function(dds) {
            var winner = null;

            var len = dds.length;

            if (len == 1) {
                winner = dds[0];
            } else {
                // Loop through the targeted items
                for (var i=0; i<len; ++i) {
                    var dd = dds[i];
                    // If the cursor is over the object, it wins.  If the 
                    // cursor is over multiple matches, the first one we come
                    // to wins.
                    if (this.mode == this.INTERSECT && dd.cursorIsOver) {
                        winner = dd;
                        break;
                    // Otherwise the object with the most overlap wins
                    } else {
                        if (!winner || !winner.overlap || (dd.overlap &&
                            winner.overlap.getArea() < dd.overlap.getArea())) {
                            winner = dd;
                        }
                    }
                }
            }

            return winner;
        },

        /**
         * Refreshes the cache of the top-left and bottom-right points of the 
         * drag and drop objects in the specified group(s).  This is in the
         * format that is stored in the drag and drop instance, so typical 
         * usage is:
         * <code>
         * YAHOO.util.DragDropMgr.refreshCache(ddinstance.groups);
         * </code>
         * Alternatively:
         * <code>
         * YAHOO.util.DragDropMgr.refreshCache({group1:true, group2:true});
         * </code>
         * @TODO this really should be an indexed array.  Alternatively this
         * method could accept both.
         * @method refreshCache
         * @param {Object} groups an associative array of groups to refresh
         * @static
         */
        refreshCache: function(groups) {

            // refresh everything if group array is not provided
            var g = groups || this.ids;

            for (var sGroup in g) {
                if ("string" != typeof sGroup) {
                    continue;
                }
                for (var i in this.ids[sGroup]) {
                    var oDD = this.ids[sGroup][i];

                    if (this.isTypeOfDD(oDD)) {
                        var loc = this.getLocation(oDD);
                        if (loc) {
                            this.locationCache[oDD.id] = loc;
                        } else {
                            delete this.locationCache[oDD.id];
                        }
                    }
                }
            }
        },

        /**
         * This checks to make sure an element exists and is in the DOM.  The
         * main purpose is to handle cases where innerHTML is used to remove
         * drag and drop objects from the DOM.  IE provides an 'unspecified
         * error' when trying to access the offsetParent of such an element
         * @method verifyEl
         * @param {HTMLElement} el the element to check
         * @return {boolean} true if the element looks usable
         * @static
         */
        verifyEl: function(el) {
            try {
                if (el) {
                    var parent = el.offsetParent;
                    if (parent) {
                        return true;
                    }
                }
            } catch(e) {
            }

            return false;
        },
        
        /**
         * Returns a Region object containing the drag and drop element's position
         * and size, including the padding configured for it
         * @method getLocation
         * @param {DragDrop} oDD the drag and drop object to get the 
         *                       location for
         * @return {YAHOO.util.Region} a Region object representing the total area
         *                             the element occupies, including any padding
         *                             the instance is configured for.
         * @static
         */
        getLocation: function(oDD) {
            if (! this.isTypeOfDD(oDD)) {
                return null;
            }

            var el = oDD.getEl(), pos, x1, x2, y1, y2, t, r, b, l;

            try {
                pos= YAHOO.util.Dom.getXY(el);
            } catch (e) { }

            if (!pos) {
                return null;
            }

            x1 = pos[0];
            x2 = x1 + el.offsetWidth;
            y1 = pos[1];
            y2 = y1 + el.offsetHeight;

            t = y1 - oDD.padding[0];
            r = x2 + oDD.padding[1];
            b = y2 + oDD.padding[2];
            l = x1 - oDD.padding[3];

            return new YAHOO.util.Region( t, r, b, l );
        },

        /**
         * Checks the cursor location to see if it over the target
         * @method isOverTarget
         * @param {YAHOO.util.Point} pt The point to evaluate
         * @param {DragDrop} oTarget the DragDrop object we are inspecting
         * @return {boolean} true if the mouse is over the target
         * @private
         * @static
         */
        isOverTarget: function(pt, oTarget, intersect) {
            // use cache if available
            var loc = this.locationCache[oTarget.id];
            if (!loc || !this.useCache) {
                loc = this.getLocation(oTarget);
                this.locationCache[oTarget.id] = loc;

            }

            if (!loc) {
                return false;
            }

            oTarget.cursorIsOver = loc.contains( pt );

            // DragDrop is using this as a sanity check for the initial mousedown
            // in this case we are done.  In POINT mode, if the drag obj has no
            // contraints, we are done. Otherwise we need to evaluate the 
            // region the target as occupies to determine if the dragged element
            // overlaps with it.
            
            var dc = this.dragCurrent;
            if (!dc || !dc.getTargetCoord || 
                    (!intersect && !dc.constrainX && !dc.constrainY)) {

                //if (oTarget.cursorIsOver) {
                //}
                return oTarget.cursorIsOver;
            }

            oTarget.overlap = null;

            // Get the current location of the drag element, this is the
            // location of the mouse event less the delta that represents
            // where the original mousedown happened on the element.  We
            // need to consider constraints and ticks as well.
            var pos = dc.getTargetCoord(pt.x, pt.y);

            var el = dc.getDragEl();
            var curRegion = new YAHOO.util.Region( pos.y, 
                                                   pos.x + el.offsetWidth,
                                                   pos.y + el.offsetHeight, 
                                                   pos.x );

            var overlap = curRegion.intersect(loc);

            if (overlap) {
                oTarget.overlap = overlap;
                return (intersect) ? true : oTarget.cursorIsOver;
            } else {
                return false;
            }
        },

        /**
         * unload event handler
         * @method _onUnload
         * @private
         * @static
         */
        _onUnload: function(e, me) {
            this.unregAll();
        },

        /**
         * Cleans up the drag and drop events and objects.
         * @method unregAll
         * @private
         * @static
         */
        unregAll: function() {

            if (this.dragCurrent) {
                this.stopDrag();
                this.dragCurrent = null;
            }

            this._execOnAll("unreg", []);

            for (i in this.elementCache) {
                delete this.elementCache[i];
            }

            this.elementCache = {};
            this.ids = {};
        },

        /**
         * A cache of DOM elements
         * @property elementCache
         * @private
         * @static
         */
        elementCache: {},
        
        /**
         * Get the wrapper for the DOM element specified
         * @method getElWrapper
         * @param {String} id the id of the element to get
         * @return {YAHOO.util.DDM.ElementWrapper} the wrapped element
         * @private
         * @deprecated This wrapper isn't that useful
         * @static
         */
        getElWrapper: function(id) {
            var oWrapper = this.elementCache[id];
            if (!oWrapper || !oWrapper.el) {
                oWrapper = this.elementCache[id] = 
                    new this.ElementWrapper(YAHOO.util.Dom.get(id));
            }
            return oWrapper;
        },

        /**
         * Returns the actual DOM element
         * @method getElement
         * @param {String} id the id of the elment to get
         * @return {Object} The element
         * @deprecated use YAHOO.util.Dom.get instead
         * @static
         */
        getElement: function(id) {
            return YAHOO.util.Dom.get(id);
        },
        
        /**
         * Returns the style property for the DOM element (i.e., 
         * document.getElById(id).style)
         * @method getCss
         * @param {String} id the id of the elment to get
         * @return {Object} The style property of the element
         * @deprecated use YAHOO.util.Dom instead
         * @static
         */
        getCss: function(id) {
            var el = YAHOO.util.Dom.get(id);
            return (el) ? el.style : null;
        },

        /**
         * Inner class for cached elements
         * @class DragDropMgr.ElementWrapper
         * @for DragDropMgr
         * @private
         * @deprecated
         */
        ElementWrapper: function(el) {
                /**
                 * The element
                 * @property el
                 */
                this.el = el || null;
                /**
                 * The element id
                 * @property id
                 */
                this.id = this.el && el.id;
                /**
                 * A reference to the style property
                 * @property css
                 */
                this.css = this.el && el.style;
            },

        /**
         * Returns the X position of an html element
         * @method getPosX
         * @param el the element for which to get the position
         * @return {int} the X coordinate
         * @for DragDropMgr
         * @deprecated use YAHOO.util.Dom.getX instead
         * @static
         */
        getPosX: function(el) {
            return YAHOO.util.Dom.getX(el);
        },

        /**
         * Returns the Y position of an html element
         * @method getPosY
         * @param el the element for which to get the position
         * @return {int} the Y coordinate
         * @deprecated use YAHOO.util.Dom.getY instead
         * @static
         */
        getPosY: function(el) {
            return YAHOO.util.Dom.getY(el); 
        },

        /**
         * Swap two nodes.  In IE, we use the native method, for others we 
         * emulate the IE behavior
         * @method swapNode
         * @param n1 the first node to swap
         * @param n2 the other node to swap
         * @static
         */
        swapNode: function(n1, n2) {
            if (n1.swapNode) {
                n1.swapNode(n2);
            } else {
                var p = n2.parentNode;
                var s = n2.nextSibling;

                if (s == n1) {
                    p.insertBefore(n1, n2);
                } else if (n2 == n1.nextSibling) {
                    p.insertBefore(n2, n1);
                } else {
                    n1.parentNode.replaceChild(n2, n1);
                    p.insertBefore(n1, s);
                }
            }
        },

        /**
         * Returns the current scroll position
         * @method getScroll
         * @private
         * @static
         */
        getScroll: function () {
            var t, l, dde=document.documentElement, db=document.body;
            if (dde && (dde.scrollTop || dde.scrollLeft)) {
                t = dde.scrollTop;
                l = dde.scrollLeft;
            } else if (db) {
                t = db.scrollTop;
                l = db.scrollLeft;
            } else {
            }
            return { top: t, left: l };
        },

        /**
         * Returns the specified element style property
         * @method getStyle
         * @param {HTMLElement} el          the element
         * @param {string}      styleProp   the style property
         * @return {string} The value of the style property
         * @deprecated use YAHOO.util.Dom.getStyle
         * @static
         */
        getStyle: function(el, styleProp) {
            return YAHOO.util.Dom.getStyle(el, styleProp);
        },

        /**
         * Gets the scrollTop
         * @method getScrollTop
         * @return {int} the document's scrollTop
         * @static
         */
        getScrollTop: function () { return this.getScroll().top; },

        /**
         * Gets the scrollLeft
         * @method getScrollLeft
         * @return {int} the document's scrollTop
         * @static
         */
        getScrollLeft: function () { return this.getScroll().left; },

        /**
         * Sets the x/y position of an element to the location of the
         * target element.
         * @method moveToEl
         * @param {HTMLElement} moveEl      The element to move
         * @param {HTMLElement} targetEl    The position reference element
         * @static
         */
        moveToEl: function (moveEl, targetEl) {
            var aCoord = YAHOO.util.Dom.getXY(targetEl);
            YAHOO.util.Dom.setXY(moveEl, aCoord);
        },

        /**
         * Gets the client height
         * @method getClientHeight
         * @return {int} client height in px
         * @deprecated use YAHOO.util.Dom.getViewportHeight instead
         * @static
         */
        getClientHeight: function() {
            return YAHOO.util.Dom.getViewportHeight();
        },

        /**
         * Gets the client width
         * @method getClientWidth
         * @return {int} client width in px
         * @deprecated use YAHOO.util.Dom.getViewportWidth instead
         * @static
         */
        getClientWidth: function() {
            return YAHOO.util.Dom.getViewportWidth();
        },

        /**
         * Numeric array sort function
         * @method numericSort
         * @static
         */
        numericSort: function(a, b) { return (a - b); },

        /**
         * Internal counter
         * @property _timeoutCount
         * @private
         * @static
         */
        _timeoutCount: 0,

        /**
         * Trying to make the load order less important.  Without this we get
         * an error if this file is loaded before the Event Utility.
         * @method _addListeners
         * @private
         * @static
         */
        _addListeners: function() {
            var DDM = YAHOO.util.DDM;
            if ( YAHOO.util.Event && document ) {
                DDM._onLoad();
            } else {
                if (DDM._timeoutCount > 2000) {
                } else {
                    setTimeout(DDM._addListeners, 10);
                    if (document && document.body) {
                        DDM._timeoutCount += 1;
                    }
                }
            }
        },

        /**
         * Recursively searches the immediate parent and all child nodes for 
         * the handle element in order to determine wheter or not it was 
         * clicked.
         * @method handleWasClicked
         * @param node the html element to inspect
         * @static
         */
        handleWasClicked: function(node, id) {
            if (this.isHandle(id, node.id)) {
                return true;
            } else {
                // check to see if this is a text node child of the one we want
                var p = node.parentNode;

                while (p) {
                    if (this.isHandle(id, p.id)) {
                        return true;
                    } else {
                        p = p.parentNode;
                    }
                }
            }

            return false;
        }

    };

}();

// shorter alias, save a few bytes
YAHOO.util.DDM = YAHOO.util.DragDropMgr;
YAHOO.util.DDM._addListeners();

}

(function() {

var Event=YAHOO.util.Event; 
var Dom=YAHOO.util.Dom;

/**
 * Defines the interface and base operation of items that that can be 
 * dragged or can be drop targets.  It was designed to be extended, overriding
 * the event handlers for startDrag, onDrag, onDragOver, onDragOut.
 * Up to three html elements can be associated with a DragDrop instance:
 * <ul>
 * <li>linked element: the element that is passed into the constructor.
 * This is the element which defines the boundaries for interaction with 
 * other DragDrop objects.</li>
 * <li>handle element(s): The drag operation only occurs if the element that 
 * was clicked matches a handle element.  By default this is the linked 
 * element, but there are times that you will want only a portion of the 
 * linked element to initiate the drag operation, and the setHandleElId() 
 * method provides a way to define this.</li>
 * <li>drag element: this represents an the element that would be moved along
 * with the cursor during a drag operation.  By default, this is the linked
 * element itself as in {@link YAHOO.util.DD}.  setDragElId() lets you define
 * a separate element that would be moved, as in {@link YAHOO.util.DDProxy}
 * </li>
 * </ul>
 * This class should not be instantiated until the onload event to ensure that
 * the associated elements are available.
 * The following would define a DragDrop obj that would interact with any 
 * other DragDrop obj in the "group1" group:
 * <pre>
 *  dd = new YAHOO.util.DragDrop("div1", "group1");
 * </pre>
 * Since none of the event handlers have been implemented, nothing would 
 * actually happen if you were to run the code above.  Normally you would 
 * override this class or one of the default implementations, but you can 
 * also override the methods you want on an instance of the class...
 * <pre>
 *  dd.onDragDrop = function(e, id) {
 *  &nbsp;&nbsp;alert("dd was dropped on " + id);
 *  }
 * </pre>
 * @namespace YAHOO.util
 * @class DragDrop
 * @constructor
 * @param {String} id of the element that is linked to this instance
 * @param {String} sGroup the group of related DragDrop objects
 * @param {object} config an object containing configurable attributes
 *                Valid properties for DragDrop: 
 *                    padding, isTarget, maintainOffset, primaryButtonOnly,
 */
YAHOO.util.DragDrop = function(id, sGroup, config) {
    if (id) {
        this.init(id, sGroup, config); 
    }
};

YAHOO.util.DragDrop.prototype = {

    /**
     * The id of the element associated with this object.  This is what we 
     * refer to as the "linked element" because the size and position of 
     * this element is used to determine when the drag and drop objects have 
     * interacted.
     * @property id
     * @type String
     */
    id: null,

    /**
     * Configuration attributes passed into the constructor
     * @property config
     * @type object
     */
    config: null,

    /**
     * The id of the element that will be dragged.  By default this is same 
     * as the linked element , but could be changed to another element. Ex: 
     * YAHOO.util.DDProxy
     * @property dragElId
     * @type String
     * @private
     */
    dragElId: null, 

    /**
     * the id of the element that initiates the drag operation.  By default 
     * this is the linked element, but could be changed to be a child of this
     * element.  This lets us do things like only starting the drag when the 
     * header element within the linked html element is clicked.
     * @property handleElId
     * @type String
     * @private
     */
    handleElId: null, 

    /**
     * An associative array of HTML tags that will be ignored if clicked.
     * @property invalidHandleTypes
     * @type {string: string}
     */
    invalidHandleTypes: null, 

    /**
     * An associative array of ids for elements that will be ignored if clicked
     * @property invalidHandleIds
     * @type {string: string}
     */
    invalidHandleIds: null, 

    /**
     * An indexted array of css class names for elements that will be ignored
     * if clicked.
     * @property invalidHandleClasses
     * @type string[]
     */
    invalidHandleClasses: null, 

    /**
     * The linked element's absolute X position at the time the drag was 
     * started
     * @property startPageX
     * @type int
     * @private
     */
    startPageX: 0,

    /**
     * The linked element's absolute X position at the time the drag was 
     * started
     * @property startPageY
     * @type int
     * @private
     */
    startPageY: 0,

    /**
     * The group defines a logical collection of DragDrop objects that are 
     * related.  Instances only get events when interacting with other 
     * DragDrop object in the same group.  This lets us define multiple 
     * groups using a single DragDrop subclass if we want.
     * @property groups
     * @type {string: string}
     */
    groups: null,

    /**
     * Individual drag/drop instances can be locked.  This will prevent 
     * onmousedown start drag.
     * @property locked
     * @type boolean
     * @private
     */
    locked: false,

    /**
     * Lock this instance
     * @method lock
     */
    lock: function() { this.locked = true; },

    /**
     * Unlock this instace
     * @method unlock
     */
    unlock: function() { this.locked = false; },

    /**
     * By default, all insances can be a drop target.  This can be disabled by
     * setting isTarget to false.
     * @method isTarget
     * @type boolean
     */
    isTarget: true,

    /**
     * The padding configured for this drag and drop object for calculating
     * the drop zone intersection with this object.
     * @method padding
     * @type int[]
     */
    padding: null,

    /**
     * Cached reference to the linked element
     * @property _domRef
     * @private
     */
    _domRef: null,

    /**
     * Internal typeof flag
     * @property __ygDragDrop
     * @private
     */
    __ygDragDrop: true,

    /**
     * Set to true when horizontal contraints are applied
     * @property constrainX
     * @type boolean
     * @private
     */
    constrainX: false,

    /**
     * Set to true when vertical contraints are applied
     * @property constrainY
     * @type boolean
     * @private
     */
    constrainY: false,

    /**
     * The left constraint
     * @property minX
     * @type int
     * @private
     */
    minX: 0,

    /**
     * The right constraint
     * @property maxX
     * @type int
     * @private
     */
    maxX: 0,

    /**
     * The up constraint 
     * @property minY
     * @type int
     * @type int
     * @private
     */
    minY: 0,

    /**
     * The down constraint 
     * @property maxY
     * @type int
     * @private
     */
    maxY: 0,

    /**
     * Maintain offsets when we resetconstraints.  Set to true when you want
     * the position of the element relative to its parent to stay the same
     * when the page changes
     *
     * @property maintainOffset
     * @type boolean
     */
    maintainOffset: false,

    /**
     * Array of pixel locations the element will snap to if we specified a 
     * horizontal graduation/interval.  This array is generated automatically
     * when you define a tick interval.
     * @property xTicks
     * @type int[]
     */
    xTicks: null,

    /**
     * Array of pixel locations the element will snap to if we specified a 
     * vertical graduation/interval.  This array is generated automatically 
     * when you define a tick interval.
     * @property yTicks
     * @type int[]
     */
    yTicks: null,

    /**
     * By default the drag and drop instance will only respond to the primary
     * button click (left button for a right-handed mouse).  Set to true to
     * allow drag and drop to start with any mouse click that is propogated
     * by the browser
     * @property primaryButtonOnly
     * @type boolean
     */
    primaryButtonOnly: true,

    /**
     * The availabe property is false until the linked dom element is accessible.
     * @property available
     * @type boolean
     */
    available: false,

    /**
     * By default, drags can only be initiated if the mousedown occurs in the
     * region the linked element is.  This is done in part to work around a
     * bug in some browsers that mis-report the mousedown if the previous
     * mouseup happened outside of the window.  This property is set to true
     * if outer handles are defined.
     *
     * @property hasOuterHandles
     * @type boolean
     * @default false
     */
    hasOuterHandles: false,

    /**
     * Code that executes immediately before the startDrag event
     * @method b4StartDrag
     * @private
     */
    b4StartDrag: function(x, y) { },

    /**
     * Abstract method called after a drag/drop object is clicked
     * and the drag or mousedown time thresholds have beeen met.
     * @method startDrag
     * @param {int} X click location
     * @param {int} Y click location
     */
    startDrag: function(x, y) { /* override this */ },

    /**
     * Code that executes immediately before the onDrag event
     * @method b4Drag
     * @private
     */
    b4Drag: function(e) { },

    /**
     * Abstract method called during the onMouseMove event while dragging an 
     * object.
     * @method onDrag
     * @param {Event} e the mousemove event
     */
    onDrag: function(e) { /* override this */ },

    /**
     * Abstract method called when this element fist begins hovering over 
     * another DragDrop obj
     * @method onDragEnter
     * @param {Event} e the mousemove event
     * @param {String|DragDrop[]} id In POINT mode, the element
     * id this is hovering over.  In INTERSECT mode, an array of one or more 
     * dragdrop items being hovered over.
     */
    onDragEnter: function(e, id) { /* override this */ },

    /**
     * Code that executes immediately before the onDragOver event
     * @method b4DragOver
     * @private
     */
    b4DragOver: function(e) { },

    /**
     * Abstract method called when this element is hovering over another 
     * DragDrop obj
     * @method onDragOver
     * @param {Event} e the mousemove event
     * @param {String|DragDrop[]} id In POINT mode, the element
     * id this is hovering over.  In INTERSECT mode, an array of dd items 
     * being hovered over.
     */
    onDragOver: function(e, id) { /* override this */ },

    /**
     * Code that executes immediately before the onDragOut event
     * @method b4DragOut
     * @private
     */
    b4DragOut: function(e) { },

    /**
     * Abstract method called when we are no longer hovering over an element
     * @method onDragOut
     * @param {Event} e the mousemove event
     * @param {String|DragDrop[]} id In POINT mode, the element
     * id this was hovering over.  In INTERSECT mode, an array of dd items 
     * that the mouse is no longer over.
     */
    onDragOut: function(e, id) { /* override this */ },

    /**
     * Code that executes immediately before the onDragDrop event
     * @method b4DragDrop
     * @private
     */
    b4DragDrop: function(e) { },

    /**
     * Abstract method called when this item is dropped on another DragDrop 
     * obj
     * @method onDragDrop
     * @param {Event} e the mouseup event
     * @param {String|DragDrop[]} id In POINT mode, the element
     * id this was dropped on.  In INTERSECT mode, an array of dd items this 
     * was dropped on.
     */
    onDragDrop: function(e, id) { /* override this */ },

    /**
     * Abstract method called when this item is dropped on an area with no
     * drop target
     * @method onInvalidDrop
     * @param {Event} e the mouseup event
     */
    onInvalidDrop: function(e) { /* override this */ },

    /**
     * Code that executes immediately before the endDrag event
     * @method b4EndDrag
     * @private
     */
    b4EndDrag: function(e) { },

    /**
     * Fired when we are done dragging the object
     * @method endDrag
     * @param {Event} e the mouseup event
     */
    endDrag: function(e) { /* override this */ },

    /**
     * Code executed immediately before the onMouseDown event
     * @method b4MouseDown
     * @param {Event} e the mousedown event
     * @private
     */
    b4MouseDown: function(e) {  },

    /**
     * Event handler that fires when a drag/drop obj gets a mousedown
     * @method onMouseDown
     * @param {Event} e the mousedown event
     */
    onMouseDown: function(e) { /* override this */ },

    /**
     * Event handler that fires when a drag/drop obj gets a mouseup
     * @method onMouseUp
     * @param {Event} e the mouseup event
     */
    onMouseUp: function(e) { /* override this */ },
   
    /**
     * Override the onAvailable method to do what is needed after the initial
     * position was determined.
     * @method onAvailable
     */
    onAvailable: function () { 
    },

    /**
     * Returns a reference to the linked element
     * @method getEl
     * @return {HTMLElement} the html element 
     */
    getEl: function() { 
        if (!this._domRef) {
            this._domRef = Dom.get(this.id); 
        }

        return this._domRef;
    },

    /**
     * Returns a reference to the actual element to drag.  By default this is
     * the same as the html element, but it can be assigned to another 
     * element. An example of this can be found in YAHOO.util.DDProxy
     * @method getDragEl
     * @return {HTMLElement} the html element 
     */
    getDragEl: function() {
        return Dom.get(this.dragElId);
    },

    /**
     * Sets up the DragDrop object.  Must be called in the constructor of any
     * YAHOO.util.DragDrop subclass
     * @method init
     * @param id the id of the linked element
     * @param {String} sGroup the group of related items
     * @param {object} config configuration attributes
     */
    init: function(id, sGroup, config) {
        this.initTarget(id, sGroup, config);
        Event.on(this.id, "mousedown", this.handleMouseDown, this, true);
        // Event.on(this.id, "selectstart", Event.preventDefault);
    },

    /**
     * Initializes Targeting functionality only... the object does not
     * get a mousedown handler.
     * @method initTarget
     * @param id the id of the linked element
     * @param {String} sGroup the group of related items
     * @param {object} config configuration attributes
     */
    initTarget: function(id, sGroup, config) {

        // configuration attributes 
        this.config = config || {};

        // create a local reference to the drag and drop manager
        this.DDM = YAHOO.util.DDM;
        // initialize the groups array
        this.groups = {};

        // assume that we have an element reference instead of an id if the
        // parameter is not a string
        if (typeof id !== "string") {
            id = Dom.generateId(id);
        }

        // set the id
        this.id = id;

        // add to an interaction group
        this.addToGroup((sGroup) ? sGroup : "default");

        // We don't want to register this as the handle with the manager
        // so we just set the id rather than calling the setter.
        this.handleElId = id;

        Event.onAvailable(id, this.handleOnAvailable, this, true);


        // the linked element is the element that gets dragged by default
        this.setDragElId(id); 

        // by default, clicked anchors will not start drag operations. 
        // @TODO what else should be here?  Probably form fields.
        this.invalidHandleTypes = { A: "A" };
        this.invalidHandleIds = {};
        this.invalidHandleClasses = [];

        this.applyConfig();
    },

    /**
     * Applies the configuration parameters that were passed into the constructor.
     * This is supposed to happen at each level through the inheritance chain.  So
     * a DDProxy implentation will execute apply config on DDProxy, DD, and 
     * DragDrop in order to get all of the parameters that are available in
     * each object.
     * @method applyConfig
     */
    applyConfig: function() {

        // configurable properties: 
        //    padding, isTarget, maintainOffset, primaryButtonOnly
        this.padding           = this.config.padding || [0, 0, 0, 0];
        this.isTarget          = (this.config.isTarget !== false);
        this.maintainOffset    = (this.config.maintainOffset);
        this.primaryButtonOnly = (this.config.primaryButtonOnly !== false);

    },

    /**
     * Executed when the linked element is available
     * @method handleOnAvailable
     * @private
     */
    handleOnAvailable: function() {
        this.available = true;
        this.resetConstraints();
        this.onAvailable();
    },

     /**
     * Configures the padding for the target zone in px.  Effectively expands
     * (or reduces) the virtual object size for targeting calculations.  
     * Supports css-style shorthand; if only one parameter is passed, all sides
     * will have that padding, and if only two are passed, the top and bottom
     * will have the first param, the left and right the second.
     * @method setPadding
     * @param {int} iTop    Top pad
     * @param {int} iRight  Right pad
     * @param {int} iBot    Bot pad
     * @param {int} iLeft   Left pad
     */
    setPadding: function(iTop, iRight, iBot, iLeft) {
        // this.padding = [iLeft, iRight, iTop, iBot];
        if (!iRight && 0 !== iRight) {
            this.padding = [iTop, iTop, iTop, iTop];
        } else if (!iBot && 0 !== iBot) {
            this.padding = [iTop, iRight, iTop, iRight];
        } else {
            this.padding = [iTop, iRight, iBot, iLeft];
        }
    },

    /**
     * Stores the initial placement of the linked element.
     * @method setInitialPosition
     * @param {int} diffX   the X offset, default 0
     * @param {int} diffY   the Y offset, default 0
     */
    setInitPosition: function(diffX, diffY) {
        var el = this.getEl();

        if (!this.DDM.verifyEl(el)) {
            return;
        }

        var dx = diffX || 0;
        var dy = diffY || 0;

        var p = Dom.getXY( el );

        this.initPageX = p[0] - dx;
        this.initPageY = p[1] - dy;

        this.lastPageX = p[0];
        this.lastPageY = p[1];



        this.setStartPosition(p);
    },

    /**
     * Sets the start position of the element.  This is set when the obj
     * is initialized, the reset when a drag is started.
     * @method setStartPosition
     * @param pos current position (from previous lookup)
     * @private
     */
    setStartPosition: function(pos) {
        var p = pos || Dom.getXY( this.getEl() );

        this.deltaSetXY = null;

        this.startPageX = p[0];
        this.startPageY = p[1];
    },

    /**
     * Add this instance to a group of related drag/drop objects.  All 
     * instances belong to at least one group, and can belong to as many 
     * groups as needed.
     * @method addToGroup
     * @param sGroup {string} the name of the group
     */
    addToGroup: function(sGroup) {
        this.groups[sGroup] = true;
        this.DDM.regDragDrop(this, sGroup);
    },

    /**
     * Remove's this instance from the supplied interaction group
     * @method removeFromGroup
     * @param {string}  sGroup  The group to drop
     */
    removeFromGroup: function(sGroup) {
        if (this.groups[sGroup]) {
            delete this.groups[sGroup];
        }

        this.DDM.removeDDFromGroup(this, sGroup);
    },

    /**
     * Allows you to specify that an element other than the linked element 
     * will be moved with the cursor during a drag
     * @method setDragElId
     * @param id {string} the id of the element that will be used to initiate the drag
     */
    setDragElId: function(id) {
        this.dragElId = id;
    },

    /**
     * Allows you to specify a child of the linked element that should be 
     * used to initiate the drag operation.  An example of this would be if 
     * you have a content div with text and links.  Clicking anywhere in the 
     * content area would normally start the drag operation.  Use this method
     * to specify that an element inside of the content div is the element 
     * that starts the drag operation.
     * @method setHandleElId
     * @param id {string} the id of the element that will be used to 
     * initiate the drag.
     */
    setHandleElId: function(id) {
        if (typeof id !== "string") {
            id = Dom.generateId(id);
        }
        this.handleElId = id;
        this.DDM.regHandle(this.id, id);
    },

    /**
     * Allows you to set an element outside of the linked element as a drag 
     * handle
     * @method setOuterHandleElId
     * @param id the id of the element that will be used to initiate the drag
     */
    setOuterHandleElId: function(id) {
        if (typeof id !== "string") {
            id = Dom.generateId(id);
        }
        Event.on(id, "mousedown", 
                this.handleMouseDown, this, true);
        this.setHandleElId(id);

        this.hasOuterHandles = true;
    },

    /**
     * Remove all drag and drop hooks for this element
     * @method unreg
     */
    unreg: function() {
        Event.removeListener(this.id, "mousedown", 
                this.handleMouseDown);
        this._domRef = null;
        this.DDM._remove(this);
    },

    /**
     * Returns true if this instance is locked, or the drag drop mgr is locked
     * (meaning that all drag/drop is disabled on the page.)
     * @method isLocked
     * @return {boolean} true if this obj or all drag/drop is locked, else 
     * false
     */
    isLocked: function() {
        return (this.DDM.isLocked() || this.locked);
    },

    /**
     * Fired when this object is clicked
     * @method handleMouseDown
     * @param {Event} e 
     * @param {YAHOO.util.DragDrop} oDD the clicked dd object (this dd obj)
     * @private
     */
    handleMouseDown: function(e, oDD) {

        var button = e.which || e.button;

        if (this.primaryButtonOnly && button > 1) {
            return;
        }

        if (this.isLocked()) {
            return;
        }



        // firing the mousedown events prior to calculating positions
        this.b4MouseDown(e);
        this.onMouseDown(e);

        this.DDM.refreshCache(this.groups);
        // var self = this;
        // setTimeout( function() { self.DDM.refreshCache(self.groups); }, 0);

        // Only process the event if we really clicked within the linked 
        // element.  The reason we make this check is that in the case that 
        // another element was moved between the clicked element and the 
        // cursor in the time between the mousedown and mouseup events. When 
        // this happens, the element gets the next mousedown event 
        // regardless of where on the screen it happened.  
        var pt = new YAHOO.util.Point(Event.getPageX(e), Event.getPageY(e));
        if (!this.hasOuterHandles && !this.DDM.isOverTarget(pt, this) )  {
        } else {
            if (this.clickValidator(e)) {


                // set the initial element position
                this.setStartPosition();

                // start tracking mousemove distance and mousedown time to
                // determine when to start the actual drag
                this.DDM.handleMouseDown(e, this);

                // this mousedown is mine
                this.DDM.stopEvent(e);
            } else {


            }
        }
    },

    clickValidator: function(e) {
        var target = Event.getTarget(e);
        return ( this.isValidHandleChild(target) &&
                    (this.id == this.handleElId || 
                        this.DDM.handleWasClicked(target, this.id)) );
    },

    /**
     * Allows you to specify a tag name that should not start a drag operation
     * when clicked.  This is designed to facilitate embedding links within a
     * drag handle that do something other than start the drag.
     * @method addInvalidHandleType
     * @param {string} tagName the type of element to exclude
     */
    addInvalidHandleType: function(tagName) {
        var type = tagName.toUpperCase();
        this.invalidHandleTypes[type] = type;
    },

    /**
     * Lets you to specify an element id for a child of a drag handle
     * that should not initiate a drag
     * @method addInvalidHandleId
     * @param {string} id the element id of the element you wish to ignore
     */
    addInvalidHandleId: function(id) {
        if (typeof id !== "string") {
            id = Dom.generateId(id);
        }
        this.invalidHandleIds[id] = id;
    },


    /**
     * Lets you specify a css class of elements that will not initiate a drag
     * @method addInvalidHandleClass
     * @param {string} cssClass the class of the elements you wish to ignore
     */
    addInvalidHandleClass: function(cssClass) {
        this.invalidHandleClasses.push(cssClass);
    },

    /**
     * Unsets an excluded tag name set by addInvalidHandleType
     * @method removeInvalidHandleType
     * @param {string} tagName the type of element to unexclude
     */
    removeInvalidHandleType: function(tagName) {
        var type = tagName.toUpperCase();
        // this.invalidHandleTypes[type] = null;
        delete this.invalidHandleTypes[type];
    },
    
    /**
     * Unsets an invalid handle id
     * @method removeInvalidHandleId
     * @param {string} id the id of the element to re-enable
     */
    removeInvalidHandleId: function(id) {
        if (typeof id !== "string") {
            id = Dom.generateId(id);
        }
        delete this.invalidHandleIds[id];
    },

    /**
     * Unsets an invalid css class
     * @method removeInvalidHandleClass
     * @param {string} cssClass the class of the element(s) you wish to 
     * re-enable
     */
    removeInvalidHandleClass: function(cssClass) {
        for (var i=0, len=this.invalidHandleClasses.length; i<len; ++i) {
            if (this.invalidHandleClasses[i] == cssClass) {
                delete this.invalidHandleClasses[i];
            }
        }
    },

    /**
     * Checks the tag exclusion list to see if this click should be ignored
     * @method isValidHandleChild
     * @param {HTMLElement} node the HTMLElement to evaluate
     * @return {boolean} true if this is a valid tag type, false if not
     */
    isValidHandleChild: function(node) {

        var valid = true;
        // var n = (node.nodeName == "#text") ? node.parentNode : node;
        var nodeName;
        try {
            nodeName = node.nodeName.toUpperCase();
        } catch(e) {
            nodeName = node.nodeName;
        }
        valid = valid && !this.invalidHandleTypes[nodeName];
        valid = valid && !this.invalidHandleIds[node.id];

        for (var i=0, len=this.invalidHandleClasses.length; valid && i<len; ++i) {
            valid = !Dom.hasClass(node, this.invalidHandleClasses[i]);
        }


        return valid;

    },

    /**
     * Create the array of horizontal tick marks if an interval was specified
     * in setXConstraint().
     * @method setXTicks
     * @private
     */
    setXTicks: function(iStartX, iTickSize) {
        this.xTicks = [];
        this.xTickSize = iTickSize;
        
        var tickMap = {};

        for (var i = this.initPageX; i >= this.minX; i = i - iTickSize) {
            if (!tickMap[i]) {
                this.xTicks[this.xTicks.length] = i;
                tickMap[i] = true;
            }
        }

        for (i = this.initPageX; i <= this.maxX; i = i + iTickSize) {
            if (!tickMap[i]) {
                this.xTicks[this.xTicks.length] = i;
                tickMap[i] = true;
            }
        }

        this.xTicks.sort(this.DDM.numericSort) ;
    },

    /**
     * Create the array of vertical tick marks if an interval was specified in 
     * setYConstraint().
     * @method setYTicks
     * @private
     */
    setYTicks: function(iStartY, iTickSize) {
        this.yTicks = [];
        this.yTickSize = iTickSize;

        var tickMap = {};

        for (var i = this.initPageY; i >= this.minY; i = i - iTickSize) {
            if (!tickMap[i]) {
                this.yTicks[this.yTicks.length] = i;
                tickMap[i] = true;
            }
        }

        for (i = this.initPageY; i <= this.maxY; i = i + iTickSize) {
            if (!tickMap[i]) {
                this.yTicks[this.yTicks.length] = i;
                tickMap[i] = true;
            }
        }

        this.yTicks.sort(this.DDM.numericSort) ;
    },

    /**
     * By default, the element can be dragged any place on the screen.  Use 
     * this method to limit the horizontal travel of the element.  Pass in 
     * 0,0 for the parameters if you want to lock the drag to the y axis.
     * @method setXConstraint
     * @param {int} iLeft the number of pixels the element can move to the left
     * @param {int} iRight the number of pixels the element can move to the 
     * right
     * @param {int} iTickSize optional parameter for specifying that the 
     * element
     * should move iTickSize pixels at a time.
     */
    setXConstraint: function(iLeft, iRight, iTickSize) {
        this.leftConstraint = parseInt(iLeft, 10);
        this.rightConstraint = parseInt(iRight, 10);

        this.minX = this.initPageX - this.leftConstraint;
        this.maxX = this.initPageX + this.rightConstraint;
        if (iTickSize) { this.setXTicks(this.initPageX, iTickSize); }

        this.constrainX = true;
    },

    /**
     * Clears any constraints applied to this instance.  Also clears ticks
     * since they can't exist independent of a constraint at this time.
     * @method clearConstraints
     */
    clearConstraints: function() {
        this.constrainX = false;
        this.constrainY = false;
        this.clearTicks();
    },

    /**
     * Clears any tick interval defined for this instance
     * @method clearTicks
     */
    clearTicks: function() {
        this.xTicks = null;
        this.yTicks = null;
        this.xTickSize = 0;
        this.yTickSize = 0;
    },

    /**
     * By default, the element can be dragged any place on the screen.  Set 
     * this to limit the vertical travel of the element.  Pass in 0,0 for the
     * parameters if you want to lock the drag to the x axis.
     * @method setYConstraint
     * @param {int} iUp the number of pixels the element can move up
     * @param {int} iDown the number of pixels the element can move down
     * @param {int} iTickSize optional parameter for specifying that the 
     * element should move iTickSize pixels at a time.
     */
    setYConstraint: function(iUp, iDown, iTickSize) {
        this.topConstraint = parseInt(iUp, 10);
        this.bottomConstraint = parseInt(iDown, 10);

        this.minY = this.initPageY - this.topConstraint;
        this.maxY = this.initPageY + this.bottomConstraint;
        if (iTickSize) { this.setYTicks(this.initPageY, iTickSize); }

        this.constrainY = true;
        
    },

    /**
     * resetConstraints must be called if you manually reposition a dd element.
     * @method resetConstraints
     * @param {boolean} maintainOffset
     */
    resetConstraints: function() {


        // Maintain offsets if necessary
        if (this.initPageX || this.initPageX === 0) {
            // figure out how much this thing has moved
            var dx = (this.maintainOffset) ? this.lastPageX - this.initPageX : 0;
            var dy = (this.maintainOffset) ? this.lastPageY - this.initPageY : 0;

            this.setInitPosition(dx, dy);

        // This is the first time we have detected the element's position
        } else {
            this.setInitPosition();
        }

        if (this.constrainX) {
            this.setXConstraint( this.leftConstraint, 
                                 this.rightConstraint, 
                                 this.xTickSize        );
        }

        if (this.constrainY) {
            this.setYConstraint( this.topConstraint, 
                                 this.bottomConstraint, 
                                 this.yTickSize         );
        }
    },

    /**
     * Normally the drag element is moved pixel by pixel, but we can specify 
     * that it move a number of pixels at a time.  This method resolves the 
     * location when we have it set up like this.
     * @method getTick
     * @param {int} val where we want to place the object
     * @param {int[]} tickArray sorted array of valid points
     * @return {int} the closest tick
     * @private
     */
    getTick: function(val, tickArray) {

        if (!tickArray) {
            // If tick interval is not defined, it is effectively 1 pixel, 
            // so we return the value passed to us.
            return val; 
        } else if (tickArray[0] >= val) {
            // The value is lower than the first tick, so we return the first
            // tick.
            return tickArray[0];
        } else {
            for (var i=0, len=tickArray.length; i<len; ++i) {
                var next = i + 1;
                if (tickArray[next] && tickArray[next] >= val) {
                    var diff1 = val - tickArray[i];
                    var diff2 = tickArray[next] - val;
                    return (diff2 > diff1) ? tickArray[i] : tickArray[next];
                }
            }

            // The value is larger than the last tick, so we return the last
            // tick.
            return tickArray[tickArray.length - 1];
        }
    },

    /**
     * toString method
     * @method toString
     * @return {string} string representation of the dd obj
     */
    toString: function() {
        return ("DragDrop " + this.id);
    }

};

})();
/**
 * A DragDrop implementation where the linked element follows the 
 * mouse cursor during a drag.
 * @class DD
 * @extends YAHOO.util.DragDrop
 * @constructor
 * @param {String} id the id of the linked element 
 * @param {String} sGroup the group of related DragDrop items
 * @param {object} config an object containing configurable attributes
 *                Valid properties for DD: 
 *                    scroll
 */
YAHOO.util.DD = function(id, sGroup, config) {
    if (id) {
        this.init(id, sGroup, config);
    }
};

YAHOO.extend(YAHOO.util.DD, YAHOO.util.DragDrop, {

    /**
     * When set to true, the utility automatically tries to scroll the browser
     * window wehn a drag and drop element is dragged near the viewport boundary.
     * Defaults to true.
     * @property scroll
     * @type boolean
     */
    scroll: true, 

    /**
     * Sets the pointer offset to the distance between the linked element's top 
     * left corner and the location the element was clicked
     * @method autoOffset
     * @param {int} iPageX the X coordinate of the click
     * @param {int} iPageY the Y coordinate of the click
     */
    autoOffset: function(iPageX, iPageY) {
        var x = iPageX - this.startPageX;
        var y = iPageY - this.startPageY;
        this.setDelta(x, y);
    },

    /** 
     * Sets the pointer offset.  You can call this directly to force the 
     * offset to be in a particular location (e.g., pass in 0,0 to set it 
     * to the center of the object, as done in YAHOO.widget.Slider)
     * @method setDelta
     * @param {int} iDeltaX the distance from the left
     * @param {int} iDeltaY the distance from the top
     */
    setDelta: function(iDeltaX, iDeltaY) {
        this.deltaX = iDeltaX;
        this.deltaY = iDeltaY;
    },

    /**
     * Sets the drag element to the location of the mousedown or click event, 
     * maintaining the cursor location relative to the location on the element 
     * that was clicked.  Override this if you want to place the element in a 
     * location other than where the cursor is.
     * @method setDragElPos
     * @param {int} iPageX the X coordinate of the mousedown or drag event
     * @param {int} iPageY the Y coordinate of the mousedown or drag event
     */
    setDragElPos: function(iPageX, iPageY) {
        // the first time we do this, we are going to check to make sure
        // the element has css positioning

        var el = this.getDragEl();
        this.alignElWithMouse(el, iPageX, iPageY);
    },

    /**
     * Sets the element to the location of the mousedown or click event, 
     * maintaining the cursor location relative to the location on the element 
     * that was clicked.  Override this if you want to place the element in a 
     * location other than where the cursor is.
     * @method alignElWithMouse
     * @param {HTMLElement} el the element to move
     * @param {int} iPageX the X coordinate of the mousedown or drag event
     * @param {int} iPageY the Y coordinate of the mousedown or drag event
     */
    alignElWithMouse: function(el, iPageX, iPageY) {
        var oCoord = this.getTargetCoord(iPageX, iPageY);

        if (!this.deltaSetXY) {
            var aCoord = [oCoord.x, oCoord.y];
            YAHOO.util.Dom.setXY(el, aCoord);
            var newLeft = parseInt( YAHOO.util.Dom.getStyle(el, "left"), 10 );
            var newTop  = parseInt( YAHOO.util.Dom.getStyle(el, "top" ), 10 );

            this.deltaSetXY = [ newLeft - oCoord.x, newTop - oCoord.y ];
        } else {
            YAHOO.util.Dom.setStyle(el, "left", (oCoord.x + this.deltaSetXY[0]) + "px");
            YAHOO.util.Dom.setStyle(el, "top",  (oCoord.y + this.deltaSetXY[1]) + "px");
        }
        
        this.cachePosition(oCoord.x, oCoord.y);
        this.autoScroll(oCoord.x, oCoord.y, el.offsetHeight, el.offsetWidth);
    },

    /**
     * Saves the most recent position so that we can reset the constraints and
     * tick marks on-demand.  We need to know this so that we can calculate the
     * number of pixels the element is offset from its original position.
     * @method cachePosition
     * @param iPageX the current x position (optional, this just makes it so we
     * don't have to look it up again)
     * @param iPageY the current y position (optional, this just makes it so we
     * don't have to look it up again)
     */
    cachePosition: function(iPageX, iPageY) {
        if (iPageX) {
            this.lastPageX = iPageX;
            this.lastPageY = iPageY;
        } else {
            var aCoord = YAHOO.util.Dom.getXY(this.getEl());
            this.lastPageX = aCoord[0];
            this.lastPageY = aCoord[1];
        }
    },

    /**
     * Auto-scroll the window if the dragged object has been moved beyond the 
     * visible window boundary.
     * @method autoScroll
     * @param {int} x the drag element's x position
     * @param {int} y the drag element's y position
     * @param {int} h the height of the drag element
     * @param {int} w the width of the drag element
     * @private
     */
    autoScroll: function(x, y, h, w) {

        if (this.scroll) {
            // The client height
            var clientH = this.DDM.getClientHeight();

            // The client width
            var clientW = this.DDM.getClientWidth();

            // The amt scrolled down
            var st = this.DDM.getScrollTop();

            // The amt scrolled right
            var sl = this.DDM.getScrollLeft();

            // Location of the bottom of the element
            var bot = h + y;

            // Location of the right of the element
            var right = w + x;

            // The distance from the cursor to the bottom of the visible area, 
            // adjusted so that we don't scroll if the cursor is beyond the
            // element drag constraints
            var toBot = (clientH + st - y - this.deltaY);

            // The distance from the cursor to the right of the visible area
            var toRight = (clientW + sl - x - this.deltaX);


            // How close to the edge the cursor must be before we scroll
            // var thresh = (document.all) ? 100 : 40;
            var thresh = 40;

            // How many pixels to scroll per autoscroll op.  This helps to reduce 
            // clunky scrolling. IE is more sensitive about this ... it needs this 
            // value to be higher.
            var scrAmt = (document.all) ? 80 : 30;

            // Scroll down if we are near the bottom of the visible page and the 
            // obj extends below the crease
            if ( bot > clientH && toBot < thresh ) { 
                window.scrollTo(sl, st + scrAmt); 
            }

            // Scroll up if the window is scrolled down and the top of the object
            // goes above the top border
            if ( y < st && st > 0 && y - st < thresh ) { 
                window.scrollTo(sl, st - scrAmt); 
            }

            // Scroll right if the obj is beyond the right border and the cursor is
            // near the border.
            if ( right > clientW && toRight < thresh ) { 
                window.scrollTo(sl + scrAmt, st); 
            }

            // Scroll left if the window has been scrolled to the right and the obj
            // extends past the left border
            if ( x < sl && sl > 0 && x - sl < thresh ) { 
                window.scrollTo(sl - scrAmt, st);
            }
        }
    },

    /**
     * Finds the location the element should be placed if we want to move
     * it to where the mouse location less the click offset would place us.
     * @method getTargetCoord
     * @param {int} iPageX the X coordinate of the click
     * @param {int} iPageY the Y coordinate of the click
     * @return an object that contains the coordinates (Object.x and Object.y)
     * @private
     */
    getTargetCoord: function(iPageX, iPageY) {


        var x = iPageX - this.deltaX;
        var y = iPageY - this.deltaY;

        if (this.constrainX) {
            if (x < this.minX) { x = this.minX; }
            if (x > this.maxX) { x = this.maxX; }
        }

        if (this.constrainY) {
            if (y < this.minY) { y = this.minY; }
            if (y > this.maxY) { y = this.maxY; }
        }

        x = this.getTick(x, this.xTicks);
        y = this.getTick(y, this.yTicks);


        return {x:x, y:y};
    },

    /*
     * Sets up config options specific to this class. Overrides
     * YAHOO.util.DragDrop, but all versions of this method through the 
     * inheritance chain are called
     */
    applyConfig: function() {
        YAHOO.util.DD.superclass.applyConfig.call(this);
        this.scroll = (this.config.scroll !== false);
    },

    /*
     * Event that fires prior to the onMouseDown event.  Overrides 
     * YAHOO.util.DragDrop.
     */
    b4MouseDown: function(e) {
        this.setStartPosition();
        // this.resetConstraints();
        this.autoOffset(YAHOO.util.Event.getPageX(e), 
                            YAHOO.util.Event.getPageY(e));
    },

    /*
     * Event that fires prior to the onDrag event.  Overrides 
     * YAHOO.util.DragDrop.
     */
    b4Drag: function(e) {
        this.setDragElPos(YAHOO.util.Event.getPageX(e), 
                            YAHOO.util.Event.getPageY(e));
    },

    toString: function() {
        return ("DD " + this.id);
    }

    //////////////////////////////////////////////////////////////////////////
    // Debugging ygDragDrop events that can be overridden
    //////////////////////////////////////////////////////////////////////////
    /*
    startDrag: function(x, y) {
    },

    onDrag: function(e) {
    },

    onDragEnter: function(e, id) {
    },

    onDragOver: function(e, id) {
    },

    onDragOut: function(e, id) {
    },

    onDragDrop: function(e, id) {
    },

    endDrag: function(e) {
    }

    */

});
/**
 * A DragDrop implementation that inserts an empty, bordered div into
 * the document that follows the cursor during drag operations.  At the time of
 * the click, the frame div is resized to the dimensions of the linked html
 * element, and moved to the exact location of the linked element.
 *
 * References to the "frame" element refer to the single proxy element that
 * was created to be dragged in place of all DDProxy elements on the
 * page.
 *
 * @class DDProxy
 * @extends YAHOO.util.DD
 * @constructor
 * @param {String} id the id of the linked html element
 * @param {String} sGroup the group of related DragDrop objects
 * @param {object} config an object containing configurable attributes
 *                Valid properties for DDProxy in addition to those in DragDrop: 
 *                   resizeFrame, centerFrame, dragElId
 */
YAHOO.util.DDProxy = function(id, sGroup, config) {
    if (id) {
        this.init(id, sGroup, config);
        this.initFrame(); 
    }
};

/**
 * The default drag frame div id
 * @property YAHOO.util.DDProxy.dragElId
 * @type String
 * @static
 */
YAHOO.util.DDProxy.dragElId = "ygddfdiv";

YAHOO.extend(YAHOO.util.DDProxy, YAHOO.util.DD, {

    /**
     * By default we resize the drag frame to be the same size as the element
     * we want to drag (this is to get the frame effect).  We can turn it off
     * if we want a different behavior.
     * @property resizeFrame
     * @type boolean
     */
    resizeFrame: true,

    /**
     * By default the frame is positioned exactly where the drag element is, so
     * we use the cursor offset provided by YAHOO.util.DD.  Another option that works only if
     * you do not have constraints on the obj is to have the drag frame centered
     * around the cursor.  Set centerFrame to true for this effect.
     * @property centerFrame
     * @type boolean
     */
    centerFrame: false,

    /**
     * Creates the proxy element if it does not yet exist
     * @method createFrame
     */
    createFrame: function() {
        var self = this;
        var body = document.body;

        if (!body || !body.firstChild) {
            setTimeout( function() { self.createFrame(); }, 50 );
            return;
        }

        var div = this.getDragEl();

        if (!div) {
            div    = document.createElement("div");
            div.id = this.dragElId;
            var s  = div.style;

            s.position   = "absolute";
            s.visibility = "hidden";
            s.cursor     = "move";
            s.border     = "2px solid #aaa";
            s.zIndex     = 999;

            // appendChild can blow up IE if invoked prior to the window load event
            // while rendering a table.  It is possible there are other scenarios 
            // that would cause this to happen as well.
            body.insertBefore(div, body.firstChild);
        }
    },

    /**
     * Initialization for the drag frame element.  Must be called in the
     * constructor of all subclasses
     * @method initFrame
     */
    initFrame: function() {
        this.createFrame();
    },

    applyConfig: function() {
        YAHOO.util.DDProxy.superclass.applyConfig.call(this);

        this.resizeFrame = (this.config.resizeFrame !== false);
        this.centerFrame = (this.config.centerFrame);
        this.setDragElId(this.config.dragElId || YAHOO.util.DDProxy.dragElId);
    },

    /**
     * Resizes the drag frame to the dimensions of the clicked object, positions 
     * it over the object, and finally displays it
     * @method showFrame
     * @param {int} iPageX X click position
     * @param {int} iPageY Y click position
     * @private
     */
    showFrame: function(iPageX, iPageY) {
        var el = this.getEl();
        var dragEl = this.getDragEl();
        var s = dragEl.style;

        this._resizeProxy();

        if (this.centerFrame) {
            this.setDelta( Math.round(parseInt(s.width,  10)/2), 
                           Math.round(parseInt(s.height, 10)/2) );
        }

        this.setDragElPos(iPageX, iPageY);

        YAHOO.util.Dom.setStyle(dragEl, "visibility", "visible"); 
    },

    /**
     * The proxy is automatically resized to the dimensions of the linked
     * element when a drag is initiated, unless resizeFrame is set to false
     * @method _resizeProxy
     * @private
     */
    _resizeProxy: function() {
        if (this.resizeFrame) {
            var DOM    = YAHOO.util.Dom;
            var el     = this.getEl();
            var dragEl = this.getDragEl();

            var bt = parseInt( DOM.getStyle(dragEl, "borderTopWidth"    ), 10);
            var br = parseInt( DOM.getStyle(dragEl, "borderRightWidth"  ), 10);
            var bb = parseInt( DOM.getStyle(dragEl, "borderBottomWidth" ), 10);
            var bl = parseInt( DOM.getStyle(dragEl, "borderLeftWidth"   ), 10);

            if (isNaN(bt)) { bt = 0; }
            if (isNaN(br)) { br = 0; }
            if (isNaN(bb)) { bb = 0; }
            if (isNaN(bl)) { bl = 0; }


            var newWidth  = Math.max(0, el.offsetWidth  - br - bl);                                                                                           
            var newHeight = Math.max(0, el.offsetHeight - bt - bb);


            DOM.setStyle( dragEl, "width",  newWidth  + "px" );
            DOM.setStyle( dragEl, "height", newHeight + "px" );
        }
    },

    // overrides YAHOO.util.DragDrop
    b4MouseDown: function(e) {
        this.setStartPosition();
        var x = YAHOO.util.Event.getPageX(e);
        var y = YAHOO.util.Event.getPageY(e);
        this.autoOffset(x, y);
        this.setDragElPos(x, y);
    },

    // overrides YAHOO.util.DragDrop
    b4StartDrag: function(x, y) {
        // show the drag frame
        this.showFrame(x, y);
    },

    // overrides YAHOO.util.DragDrop
    b4EndDrag: function(e) {
        YAHOO.util.Dom.setStyle(this.getDragEl(), "visibility", "hidden"); 
    },

    // overrides YAHOO.util.DragDrop
    // By default we try to move the element to the last location of the frame.  
    // This is so that the default behavior mirrors that of YAHOO.util.DD.  
    endDrag: function(e) {
        var DOM = YAHOO.util.Dom;
        var lel = this.getEl();
        var del = this.getDragEl();

        // Show the drag frame briefly so we can get its position
        // del.style.visibility = "";
        DOM.setStyle(del, "visibility", ""); 

        // Hide the linked element before the move to get around a Safari 
        // rendering bug.
        //lel.style.visibility = "hidden";
        DOM.setStyle(lel, "visibility", "hidden"); 
        YAHOO.util.DDM.moveToEl(lel, del);
        //del.style.visibility = "hidden";
        DOM.setStyle(del, "visibility", "hidden"); 
        //lel.style.visibility = "";
        DOM.setStyle(lel, "visibility", ""); 
    },

    toString: function() {
        return ("DDProxy " + this.id);
    }

});
/**
 * A DragDrop implementation that does not move, but can be a drop 
 * target.  You would get the same result by simply omitting implementation 
 * for the event callbacks, but this way we reduce the processing cost of the 
 * event listener and the callbacks.
 * @class DDTarget
 * @extends YAHOO.util.DragDrop 
 * @constructor
 * @param {String} id the id of the element that is a drop target
 * @param {String} sGroup the group of related DragDrop objects
 * @param {object} config an object containing configurable attributes
 *                 Valid properties for DDTarget in addition to those in 
 *                 DragDrop: 
 *                    none
 */
YAHOO.util.DDTarget = function(id, sGroup, config) {
    if (id) {
        this.initTarget(id, sGroup, config);
    }
};

// YAHOO.util.DDTarget.prototype = new YAHOO.util.DragDrop();
YAHOO.extend(YAHOO.util.DDTarget, YAHOO.util.DragDrop, {
    toString: function() {
        return ("DDTarget " + this.id);
    }
});
YAHOO.register("dragdrop", YAHOO.util.DragDropMgr, {version: "2.2.0", build: "127"});

/*** end file 'dragdrop.js' ***/

/*** begin file 'animation.js' ***/
/*
Copyright (c) 2007, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.2.0
*/
/*
Copyright (c) 2006, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
*/

/**
 * The animation module provides allows effects to be added to HTMLElements.
 * @module animation
 * @requires yahoo, event, dom
 */

/**
 *
 * Base animation class that provides the interface for building animated effects.
 * <p>Usage: var myAnim = new YAHOO.util.Anim(el, { width: { from: 10, to: 100 } }, 1, YAHOO.util.Easing.easeOut);</p>
 * @class Anim
 * @namespace YAHOO.util
 * @requires YAHOO.util.AnimMgr
 * @requires YAHOO.util.Easing
 * @requires YAHOO.util.Dom
 * @requires YAHOO.util.Event
 * @requires YAHOO.util.CustomEvent
 * @constructor
 * @param {String | HTMLElement} el Reference to the element that will be animated
 * @param {Object} attributes The attribute(s) to be animated.  
 * Each attribute is an object with at minimum a "to" or "by" member defined.  
 * Additional optional members are "from" (defaults to current value), "units" (defaults to "px").  
 * All attribute names use camelCase.
 * @param {Number} duration (optional, defaults to 1 second) Length of animation (frames or seconds), defaults to time-based
 * @param {Function} method (optional, defaults to YAHOO.util.Easing.easeNone) Computes the values that are applied to the attributes per frame (generally a YAHOO.util.Easing method)
 */

YAHOO.util.Anim = function(el, attributes, duration, method) {
    if (el) {
        this.init(el, attributes, duration, method); 
    }
};

YAHOO.util.Anim.prototype = {
    /**
     * Provides a readable name for the Anim instance.
     * @method toString
     * @return {String}
     */
    toString: function() {
        var el = this.getEl();
        var id = el.id || el.tagName;
        return ("Anim " + id);
    },
    
    patterns: { // cached for performance
        noNegatives:        /width|height|opacity|padding/i, // keep at zero or above
        offsetAttribute:  /^((width|height)|(top|left))$/, // use offsetValue as default
        defaultUnit:        /width|height|top$|bottom$|left$|right$/i, // use 'px' by default
        offsetUnit:         /\d+(em|%|en|ex|pt|in|cm|mm|pc)$/i // IE may return these, so convert these to offset
    },
    
    /**
     * Returns the value computed by the animation's "method".
     * @method doMethod
     * @param {String} attr The name of the attribute.
     * @param {Number} start The value this attribute should start from for this animation.
     * @param {Number} end  The value this attribute should end at for this animation.
     * @return {Number} The Value to be applied to the attribute.
     */
    doMethod: function(attr, start, end) {
        return this.method(this.currentFrame, start, end - start, this.totalFrames);
    },
    
    /**
     * Applies a value to an attribute.
     * @method setAttribute
     * @param {String} attr The name of the attribute.
     * @param {Number} val The value to be applied to the attribute.
     * @param {String} unit The unit ('px', '%', etc.) of the value.
     */
    setAttribute: function(attr, val, unit) {
        if ( this.patterns.noNegatives.test(attr) ) {
            val = (val > 0) ? val : 0;
        }

        YAHOO.util.Dom.setStyle(this.getEl(), attr, val + unit);
    },                        
    
    /**
     * Returns current value of the attribute.
     * @method getAttribute
     * @param {String} attr The name of the attribute.
     * @return {Number} val The current value of the attribute.
     */
    getAttribute: function(attr) {
        var el = this.getEl();
        var val = YAHOO.util.Dom.getStyle(el, attr);

        if (val !== 'auto' && !this.patterns.offsetUnit.test(val)) {
            return parseFloat(val);
        }
        
        var a = this.patterns.offsetAttribute.exec(attr) || [];
        var pos = !!( a[3] ); // top or left
        var box = !!( a[2] ); // width or height
        
        // use offsets for width/height and abs pos top/left
        if ( box || (YAHOO.util.Dom.getStyle(el, 'position') == 'absolute' && pos) ) {
            val = el['offset' + a[0].charAt(0).toUpperCase() + a[0].substr(1)];
        } else { // default to zero for other 'auto'
            val = 0;
        }

        return val;
    },
    
    /**
     * Returns the unit to use when none is supplied.
     * @method getDefaultUnit
     * @param {attr} attr The name of the attribute.
     * @return {String} The default unit to be used.
     */
    getDefaultUnit: function(attr) {
         if ( this.patterns.defaultUnit.test(attr) ) {
            return 'px';
         }
         
         return '';
    },
        
    /**
     * Sets the actual values to be used during the animation.  Should only be needed for subclass use.
     * @method setRuntimeAttribute
     * @param {Object} attr The attribute object
     * @private 
     */
    setRuntimeAttribute: function(attr) {
        var start;
        var end;
        var attributes = this.attributes;

        this.runtimeAttributes[attr] = {};
        
        var isset = function(prop) {
            return (typeof prop !== 'undefined');
        };
        
        if ( !isset(attributes[attr]['to']) && !isset(attributes[attr]['by']) ) {
            return false; // note return; nothing to animate to
        }
        
        start = ( isset(attributes[attr]['from']) ) ? attributes[attr]['from'] : this.getAttribute(attr);

        // To beats by, per SMIL 2.1 spec
        if ( isset(attributes[attr]['to']) ) {
            end = attributes[attr]['to'];
        } else if ( isset(attributes[attr]['by']) ) {
            if (start.constructor == Array) {
                end = [];
                for (var i = 0, len = start.length; i < len; ++i) {
                    end[i] = start[i] + attributes[attr]['by'][i];
                }
            } else {
                end = start + attributes[attr]['by'];
            }
        }
        
        this.runtimeAttributes[attr].start = start;
        this.runtimeAttributes[attr].end = end;

        // set units if needed
        this.runtimeAttributes[attr].unit = ( isset(attributes[attr].unit) ) ? attributes[attr]['unit'] : this.getDefaultUnit(attr);
    },

    /**
     * Constructor for Anim instance.
     * @method init
     * @param {String | HTMLElement} el Reference to the element that will be animated
     * @param {Object} attributes The attribute(s) to be animated.  
     * Each attribute is an object with at minimum a "to" or "by" member defined.  
     * Additional optional members are "from" (defaults to current value), "units" (defaults to "px").  
     * All attribute names use camelCase.
     * @param {Number} duration (optional, defaults to 1 second) Length of animation (frames or seconds), defaults to time-based
     * @param {Function} method (optional, defaults to YAHOO.util.Easing.easeNone) Computes the values that are applied to the attributes per frame (generally a YAHOO.util.Easing method)
     */ 
    init: function(el, attributes, duration, method) {
        /**
         * Whether or not the animation is running.
         * @property isAnimated
         * @private
         * @type Boolean
         */
        var isAnimated = false;
        
        /**
         * A Date object that is created when the animation begins.
         * @property startTime
         * @private
         * @type Date
         */
        var startTime = null;
        
        /**
         * The number of frames this animation was able to execute.
         * @property actualFrames
         * @private
         * @type Int
         */
        var actualFrames = 0; 

        /**
         * The element to be animated.
         * @property el
         * @private
         * @type HTMLElement
         */
        el = YAHOO.util.Dom.get(el);
        
        /**
         * The collection of attributes to be animated.  
         * Each attribute must have at least a "to" or "by" defined in order to animate.  
         * If "to" is supplied, the animation will end with the attribute at that value.  
         * If "by" is supplied, the animation will end at that value plus its starting value. 
         * If both are supplied, "to" is used, and "by" is ignored. 
         * Optional additional member include "from" (the value the attribute should start animating from, defaults to current value), and "unit" (the units to apply to the values).
         * @property attributes
         * @type Object
         */
        this.attributes = attributes || {};
        
        /**
         * The length of the animation.  Defaults to "1" (second).
         * @property duration
         * @type Number
         */
        this.duration = duration || 1;
        
        /**
         * The method that will provide values to the attribute(s) during the animation. 
         * Defaults to "YAHOO.util.Easing.easeNone".
         * @property method
         * @type Function
         */
        this.method = method || YAHOO.util.Easing.easeNone;

        /**
         * Whether or not the duration should be treated as seconds.
         * Defaults to true.
         * @property useSeconds
         * @type Boolean
         */
        this.useSeconds = true; // default to seconds
        
        /**
         * The location of the current animation on the timeline.
         * In time-based animations, this is used by AnimMgr to ensure the animation finishes on time.
         * @property currentFrame
         * @type Int
         */
        this.currentFrame = 0;
        
        /**
         * The total number of frames to be executed.
         * In time-based animations, this is used by AnimMgr to ensure the animation finishes on time.
         * @property totalFrames
         * @type Int
         */
        this.totalFrames = YAHOO.util.AnimMgr.fps;
        
        
        /**
         * Returns a reference to the animated element.
         * @method getEl
         * @return {HTMLElement}
         */
        this.getEl = function() { return el; };
        
        /**
         * Checks whether the element is currently animated.
         * @method isAnimated
         * @return {Boolean} current value of isAnimated.     
         */
        this.isAnimated = function() {
            return isAnimated;
        };
        
        /**
         * Returns the animation start time.
         * @method getStartTime
         * @return {Date} current value of startTime.      
         */
        this.getStartTime = function() {
            return startTime;
        };        
        
        this.runtimeAttributes = {};
        
        
        
        /**
         * Starts the animation by registering it with the animation manager. 
         * @method animate  
         */
        this.animate = function() {
            if ( this.isAnimated() ) {
                return false;
            }
            
            this.currentFrame = 0;
            
            this.totalFrames = ( this.useSeconds ) ? Math.ceil(YAHOO.util.AnimMgr.fps * this.duration) : this.duration;
    
            YAHOO.util.AnimMgr.registerElement(this);
        };
          
        /**
         * Stops the animation.  Normally called by AnimMgr when animation completes.
         * @method stop
         * @param {Boolean} finish (optional) If true, animation will jump to final frame.
         */ 
        this.stop = function(finish) {
            if (finish) {
                 this.currentFrame = this.totalFrames;
                 this._onTween.fire();
            }
            YAHOO.util.AnimMgr.stop(this);
        };
        
        var onStart = function() {            
            this.onStart.fire();
            
            this.runtimeAttributes = {};
            for (var attr in this.attributes) {
                this.setRuntimeAttribute(attr);
            }
            
            isAnimated = true;
            actualFrames = 0;
            startTime = new Date(); 
        };
        
        /**
         * Feeds the starting and ending values for each animated attribute to doMethod once per frame, then applies the resulting value to the attribute(s).
         * @private
         */
         
        var onTween = function() {
            var data = {
                duration: new Date() - this.getStartTime(),
                currentFrame: this.currentFrame
            };
            
            data.toString = function() {
                return (
                    'duration: ' + data.duration +
                    ', currentFrame: ' + data.currentFrame
                );
            };
            
            this.onTween.fire(data);
            
            var runtimeAttributes = this.runtimeAttributes;
            
            for (var attr in runtimeAttributes) {
                this.setAttribute(attr, this.doMethod(attr, runtimeAttributes[attr].start, runtimeAttributes[attr].end), runtimeAttributes[attr].unit); 
            }
            
            actualFrames += 1;
        };
        
        var onComplete = function() {
            var actual_duration = (new Date() - startTime) / 1000 ;
            
            var data = {
                duration: actual_duration,
                frames: actualFrames,
                fps: actualFrames / actual_duration
            };
            
            data.toString = function() {
                return (
                    'duration: ' + data.duration +
                    ', frames: ' + data.frames +
                    ', fps: ' + data.fps
                );
            };
            
            isAnimated = false;
            actualFrames = 0;
            this.onComplete.fire(data);
        };
        
        /**
         * Custom event that fires after onStart, useful in subclassing
         * @private
         */    
        this._onStart = new YAHOO.util.CustomEvent('_start', this, true);

        /**
         * Custom event that fires when animation begins
         * Listen via subscribe method (e.g. myAnim.onStart.subscribe(someFunction)
         * @event onStart
         */    
        this.onStart = new YAHOO.util.CustomEvent('start', this);
        
        /**
         * Custom event that fires between each frame
         * Listen via subscribe method (e.g. myAnim.onTween.subscribe(someFunction)
         * @event onTween
         */
        this.onTween = new YAHOO.util.CustomEvent('tween', this);
        
        /**
         * Custom event that fires after onTween
         * @private
         */
        this._onTween = new YAHOO.util.CustomEvent('_tween', this, true);
        
        /**
         * Custom event that fires when animation ends
         * Listen via subscribe method (e.g. myAnim.onComplete.subscribe(someFunction)
         * @event onComplete
         */
        this.onComplete = new YAHOO.util.CustomEvent('complete', this);
        /**
         * Custom event that fires after onComplete
         * @private
         */
        this._onComplete = new YAHOO.util.CustomEvent('_complete', this, true);

        this._onStart.subscribe(onStart);
        this._onTween.subscribe(onTween);
        this._onComplete.subscribe(onComplete);
    }
};

/**
 * Handles animation queueing and threading.
 * Used by Anim and subclasses.
 * @class AnimMgr
 * @namespace YAHOO.util
 */
YAHOO.util.AnimMgr = new function() {
    /** 
     * Reference to the animation Interval.
     * @property thread
     * @private
     * @type Int
     */
    var thread = null;
    
    /** 
     * The current queue of registered animation objects.
     * @property queue
     * @private
     * @type Array
     */    
    var queue = [];

    /** 
     * The number of active animations.
     * @property tweenCount
     * @private
     * @type Int
     */        
    var tweenCount = 0;

    /** 
     * Base frame rate (frames per second). 
     * Arbitrarily high for better x-browser calibration (slower browsers drop more frames).
     * @property fps
     * @type Int
     * 
     */
    this.fps = 1000;

    /** 
     * Interval delay in milliseconds, defaults to fastest possible.
     * @property delay
     * @type Int
     * 
     */
    this.delay = 1;

    /**
     * Adds an animation instance to the animation queue.
     * All animation instances must be registered in order to animate.
     * @method registerElement
     * @param {object} tween The Anim instance to be be registered
     */
    this.registerElement = function(tween) {
        queue[queue.length] = tween;
        tweenCount += 1;
        tween._onStart.fire();
        this.start();
    };
    
    /**
     * removes an animation instance from the animation queue.
     * All animation instances must be registered in order to animate.
     * @method unRegister
     * @param {object} tween The Anim instance to be be registered
     * @param {Int} index The index of the Anim instance
     * @private
     */
    this.unRegister = function(tween, index) {
        tween._onComplete.fire();
        index = index || getIndex(tween);
        if (index != -1) {
            queue.splice(index, 1);
        }
        
        tweenCount -= 1;
        if (tweenCount <= 0) {
            this.stop();
        }
    };
    
    /**
     * Starts the animation thread.
	* Only one thread can run at a time.
     * @method start
     */    
    this.start = function() {
        if (thread === null) {
            thread = setInterval(this.run, this.delay);
        }
    };

    /**
     * Stops the animation thread or a specific animation instance.
     * @method stop
     * @param {object} tween A specific Anim instance to stop (optional)
     * If no instance given, Manager stops thread and all animations.
     */    
    this.stop = function(tween) {
        if (!tween) {
            clearInterval(thread);
            
            for (var i = 0, len = queue.length; i < len; ++i) {
                if ( queue[0].isAnimated() ) {
                    this.unRegister(queue[0], 0);  
                }
            }

            queue = [];
            thread = null;
            tweenCount = 0;
        }
        else {
            this.unRegister(tween);
        }
    };
    
    /**
     * Called per Interval to handle each animation frame.
     * @method run
     */    
    this.run = function() {
        for (var i = 0, len = queue.length; i < len; ++i) {
            var tween = queue[i];
            if ( !tween || !tween.isAnimated() ) { continue; }

            if (tween.currentFrame < tween.totalFrames || tween.totalFrames === null)
            {
                tween.currentFrame += 1;
                
                if (tween.useSeconds) {
                    correctFrame(tween);
                }
                tween._onTween.fire();          
            }
            else { YAHOO.util.AnimMgr.stop(tween, i); }
        }
    };
    
    var getIndex = function(anim) {
        for (var i = 0, len = queue.length; i < len; ++i) {
            if (queue[i] == anim) {
                return i; // note return;
            }
        }
        return -1;
    };
    
    /**
     * On the fly frame correction to keep animation on time.
     * @method correctFrame
     * @private
     * @param {Object} tween The Anim instance being corrected.
     */
    var correctFrame = function(tween) {
        var frames = tween.totalFrames;
        var frame = tween.currentFrame;
        var expected = (tween.currentFrame * tween.duration * 1000 / tween.totalFrames);
        var elapsed = (new Date() - tween.getStartTime());
        var tweak = 0;
        
        if (elapsed < tween.duration * 1000) { // check if falling behind
            tweak = Math.round((elapsed / expected - 1) * tween.currentFrame);
        } else { // went over duration, so jump to end
            tweak = frames - (frame + 1); 
        }
        if (tweak > 0 && isFinite(tweak)) { // adjust if needed
            if (tween.currentFrame + tweak >= frames) {// dont go past last frame
                tweak = frames - (frame + 1);
            }
            
            tween.currentFrame += tweak;      
        }
    };
};
/**
 * Used to calculate Bezier splines for any number of control points.
 * @class Bezier
 * @namespace YAHOO.util
 *
 */
YAHOO.util.Bezier = new function() {
    /**
     * Get the current position of the animated element based on t.
     * Each point is an array of "x" and "y" values (0 = x, 1 = y)
     * At least 2 points are required (start and end).
     * First point is start. Last point is end.
     * Additional control points are optional.     
     * @method getPosition
     * @param {Array} points An array containing Bezier points
     * @param {Number} t A number between 0 and 1 which is the basis for determining current position
     * @return {Array} An array containing int x and y member data
     */
    this.getPosition = function(points, t) {  
        var n = points.length;
        var tmp = [];

        for (var i = 0; i < n; ++i){
            tmp[i] = [points[i][0], points[i][1]]; // save input
        }
        
        for (var j = 1; j < n; ++j) {
            for (i = 0; i < n - j; ++i) {
                tmp[i][0] = (1 - t) * tmp[i][0] + t * tmp[parseInt(i + 1, 10)][0];
                tmp[i][1] = (1 - t) * tmp[i][1] + t * tmp[parseInt(i + 1, 10)][1]; 
            }
        }
    
        return [ tmp[0][0], tmp[0][1] ]; 
    
    };
};
(function() {
/**
 * Anim subclass for color transitions.
 * <p>Usage: <code>var myAnim = new Y.ColorAnim(el, { backgroundColor: { from: '#FF0000', to: '#FFFFFF' } }, 1, Y.Easing.easeOut);</code> Color values can be specified with either 112233, #112233, 
 * [255,255,255], or rgb(255,255,255)</p>
 * @class ColorAnim
 * @namespace YAHOO.util
 * @requires YAHOO.util.Anim
 * @requires YAHOO.util.AnimMgr
 * @requires YAHOO.util.Easing
 * @requires YAHOO.util.Bezier
 * @requires YAHOO.util.Dom
 * @requires YAHOO.util.Event
 * @constructor
 * @extends YAHOO.util.Anim
 * @param {HTMLElement | String} el Reference to the element that will be animated
 * @param {Object} attributes The attribute(s) to be animated.
 * Each attribute is an object with at minimum a "to" or "by" member defined.
 * Additional optional members are "from" (defaults to current value), "units" (defaults to "px").
 * All attribute names use camelCase.
 * @param {Number} duration (optional, defaults to 1 second) Length of animation (frames or seconds), defaults to time-based
 * @param {Function} method (optional, defaults to YAHOO.util.Easing.easeNone) Computes the values that are applied to the attributes per frame (generally a YAHOO.util.Easing method)
 */
    YAHOO.util.ColorAnim = function(el, attributes, duration,  method) {
        YAHOO.util.ColorAnim.superclass.constructor.call(this, el, attributes, duration, method);
    };
    
    YAHOO.extend(YAHOO.util.ColorAnim, YAHOO.util.Anim);
    
    // shorthand
    var Y = YAHOO.util;
    var superclass = Y.ColorAnim.superclass;
    var proto = Y.ColorAnim.prototype;
    
    proto.toString = function() {
        var el = this.getEl();
        var id = el.id || el.tagName;
        return ("ColorAnim " + id);
    };

    proto.patterns.color = /color$/i;
    proto.patterns.rgb            = /^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i;
    proto.patterns.hex            = /^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i;
    proto.patterns.hex3          = /^#?([0-9A-F]{1})([0-9A-F]{1})([0-9A-F]{1})$/i;
    proto.patterns.transparent = /^transparent|rgba\(0, 0, 0, 0\)$/; // need rgba for safari
    
    /**
     * Attempts to parse the given string and return a 3-tuple.
     * @method parseColor
     * @param {String} s The string to parse.
     * @return {Array} The 3-tuple of rgb values.
     */
    proto.parseColor = function(s) {
        if (s.length == 3) { return s; }
    
        var c = this.patterns.hex.exec(s);
        if (c && c.length == 4) {
            return [ parseInt(c[1], 16), parseInt(c[2], 16), parseInt(c[3], 16) ];
        }
    
        c = this.patterns.rgb.exec(s);
        if (c && c.length == 4) {
            return [ parseInt(c[1], 10), parseInt(c[2], 10), parseInt(c[3], 10) ];
        }
    
        c = this.patterns.hex3.exec(s);
        if (c && c.length == 4) {
            return [ parseInt(c[1] + c[1], 16), parseInt(c[2] + c[2], 16), parseInt(c[3] + c[3], 16) ];
        }
        
        return null;
    };

    proto.getAttribute = function(attr) {
        var el = this.getEl();
        if (  this.patterns.color.test(attr) ) {
            var val = YAHOO.util.Dom.getStyle(el, attr);
            
            if (this.patterns.transparent.test(val)) { // bgcolor default
                var parent = el.parentNode; // try and get from an ancestor
                val = Y.Dom.getStyle(parent, attr);
            
                while (parent && this.patterns.transparent.test(val)) {
                    parent = parent.parentNode;
                    val = Y.Dom.getStyle(parent, attr);
                    if (parent.tagName.toUpperCase() == 'HTML') {
                        val = '#fff';
                    }
                }
            }
        } else {
            val = superclass.getAttribute.call(this, attr);
        }

        return val;
    };
    
    proto.doMethod = function(attr, start, end) {
        var val;
    
        if ( this.patterns.color.test(attr) ) {
            val = [];
            for (var i = 0, len = start.length; i < len; ++i) {
                val[i] = superclass.doMethod.call(this, attr, start[i], end[i]);
            }
            
            val = 'rgb('+Math.floor(val[0])+','+Math.floor(val[1])+','+Math.floor(val[2])+')';
        }
        else {
            val = superclass.doMethod.call(this, attr, start, end);
        }

        return val;
    };

    proto.setRuntimeAttribute = function(attr) {
        superclass.setRuntimeAttribute.call(this, attr);
        
        if ( this.patterns.color.test(attr) ) {
            var attributes = this.attributes;
            var start = this.parseColor(this.runtimeAttributes[attr].start);
            var end = this.parseColor(this.runtimeAttributes[attr].end);
            // fix colors if going "by"
            if ( typeof attributes[attr]['to'] === 'undefined' && typeof attributes[attr]['by'] !== 'undefined' ) {
                end = this.parseColor(attributes[attr].by);
            
                for (var i = 0, len = start.length; i < len; ++i) {
                    end[i] = start[i] + end[i];
                }
            }
            
            this.runtimeAttributes[attr].start = start;
            this.runtimeAttributes[attr].end = end;
        }
    };
})();
/*
TERMS OF USE - EASING EQUATIONS
Open source under the BSD License.
Copyright 2001 Robert Penner All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 * Neither the name of the author nor the names of contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * Singleton that determines how an animation proceeds from start to end.
 * @class Easing
 * @namespace YAHOO.util
*/

YAHOO.util.Easing = {

    /**
     * Uniform speed between points.
     * @method easeNone
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    easeNone: function (t, b, c, d) {
    	return c*t/d + b;
    },
    
    /**
     * Begins slowly and accelerates towards end. (quadratic)
     * @method easeIn
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    easeIn: function (t, b, c, d) {
    	return c*(t/=d)*t + b;
    },

    /**
     * Begins quickly and decelerates towards end.  (quadratic)
     * @method easeOut
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    easeOut: function (t, b, c, d) {
    	return -c *(t/=d)*(t-2) + b;
    },
    
    /**
     * Begins slowly and decelerates towards end. (quadratic)
     * @method easeBoth
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    easeBoth: function (t, b, c, d) {
    	if ((t/=d/2) < 1) {
            return c/2*t*t + b;
        }
        
    	return -c/2 * ((--t)*(t-2) - 1) + b;
    },
    
    /**
     * Begins slowly and accelerates towards end. (quartic)
     * @method easeInStrong
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    easeInStrong: function (t, b, c, d) {
    	return c*(t/=d)*t*t*t + b;
    },
    
    /**
     * Begins quickly and decelerates towards end.  (quartic)
     * @method easeOutStrong
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    easeOutStrong: function (t, b, c, d) {
    	return -c * ((t=t/d-1)*t*t*t - 1) + b;
    },
    
    /**
     * Begins slowly and decelerates towards end. (quartic)
     * @method easeBothStrong
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    easeBothStrong: function (t, b, c, d) {
    	if ((t/=d/2) < 1) {
            return c/2*t*t*t*t + b;
        }
        
    	return -c/2 * ((t-=2)*t*t*t - 2) + b;
    },

    /**
     * Snap in elastic effect.
     * @method elasticIn
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @param {Number} a Amplitude (optional)
     * @param {Number} p Period (optional)
     * @return {Number} The computed value for the current animation frame
     */

    elasticIn: function (t, b, c, d, a, p) {
    	if (t == 0) {
            return b;
        }
        if ( (t /= d) == 1 ) {
            return b+c;
        }
        if (!p) {
            p=d*.3;
        }
        
    	if (!a || a < Math.abs(c)) {
            a = c; 
            var s = p/4;
        }
    	else {
            var s = p/(2*Math.PI) * Math.asin (c/a);
        }
        
    	return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    },

    /**
     * Snap out elastic effect.
     * @method elasticOut
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @param {Number} a Amplitude (optional)
     * @param {Number} p Period (optional)
     * @return {Number} The computed value for the current animation frame
     */
    elasticOut: function (t, b, c, d, a, p) {
    	if (t == 0) {
            return b;
        }
        if ( (t /= d) == 1 ) {
            return b+c;
        }
        if (!p) {
            p=d*.3;
        }
        
    	if (!a || a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        }
    	else {
            var s = p/(2*Math.PI) * Math.asin (c/a);
        }
        
    	return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
    },
    
    /**
     * Snap both elastic effect.
     * @method elasticBoth
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @param {Number} a Amplitude (optional)
     * @param {Number} p Period (optional)
     * @return {Number} The computed value for the current animation frame
     */
    elasticBoth: function (t, b, c, d, a, p) {
    	if (t == 0) {
            return b;
        }
        
        if ( (t /= d/2) == 2 ) {
            return b+c;
        }
        
        if (!p) {
            p = d*(.3*1.5);
        }
        
    	if ( !a || a < Math.abs(c) ) {
            a = c; 
            var s = p/4;
        }
    	else {
            var s = p/(2*Math.PI) * Math.asin (c/a);
        }
        
    	if (t < 1) {
            return -.5*(a*Math.pow(2,10*(t-=1)) * 
                    Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        }
    	return a*Math.pow(2,-10*(t-=1)) * 
                Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
    },


    /**
     * Backtracks slightly, then reverses direction and moves to end.
     * @method backIn
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @param {Number} s Overshoot (optional)
     * @return {Number} The computed value for the current animation frame
     */
    backIn: function (t, b, c, d, s) {
    	if (typeof s == 'undefined') {
            s = 1.70158;
        }
    	return c*(t/=d)*t*((s+1)*t - s) + b;
    },

    /**
     * Overshoots end, then reverses and comes back to end.
     * @method backOut
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @param {Number} s Overshoot (optional)
     * @return {Number} The computed value for the current animation frame
     */
    backOut: function (t, b, c, d, s) {
    	if (typeof s == 'undefined') {
            s = 1.70158;
        }
    	return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    },
    
    /**
     * Backtracks slightly, then reverses direction, overshoots end, 
     * then reverses and comes back to end.
     * @method backBoth
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @param {Number} s Overshoot (optional)
     * @return {Number} The computed value for the current animation frame
     */
    backBoth: function (t, b, c, d, s) {
    	if (typeof s == 'undefined') {
            s = 1.70158; 
        }
        
    	if ((t /= d/2 ) < 1) {
            return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
        }
    	return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
    },

    /**
     * Bounce off of start.
     * @method bounceIn
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    bounceIn: function (t, b, c, d) {
    	return c - YAHOO.util.Easing.bounceOut(d-t, 0, c, d) + b;
    },
    
    /**
     * Bounces off end.
     * @method bounceOut
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    bounceOut: function (t, b, c, d) {
    	if ((t/=d) < (1/2.75)) {
    		return c*(7.5625*t*t) + b;
    	} else if (t < (2/2.75)) {
    		return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
    	} else if (t < (2.5/2.75)) {
    		return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
    	}
        return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
    },
    
    /**
     * Bounces off start and end.
     * @method bounceBoth
     * @param {Number} t Time value used to compute current value
     * @param {Number} b Starting value
     * @param {Number} c Delta between start and end values
     * @param {Number} d Total length of animation
     * @return {Number} The computed value for the current animation frame
     */
    bounceBoth: function (t, b, c, d) {
    	if (t < d/2) {
            return YAHOO.util.Easing.bounceIn(t*2, 0, c, d) * .5 + b;
        }
    	return YAHOO.util.Easing.bounceOut(t*2-d, 0, c, d) * .5 + c*.5 + b;
    }
};

(function() {
/**
 * Anim subclass for moving elements along a path defined by the "points" 
 * member of "attributes".  All "points" are arrays with x, y coordinates.
 * <p>Usage: <code>var myAnim = new YAHOO.util.Motion(el, { points: { to: [800, 800] } }, 1, YAHOO.util.Easing.easeOut);</code></p>
 * @class Motion
 * @namespace YAHOO.util
 * @requires YAHOO.util.Anim
 * @requires YAHOO.util.AnimMgr
 * @requires YAHOO.util.Easing
 * @requires YAHOO.util.Bezier
 * @requires YAHOO.util.Dom
 * @requires YAHOO.util.Event
 * @requires YAHOO.util.CustomEvent 
 * @constructor
 * @extends YAHOO.util.Anim
 * @param {String | HTMLElement} el Reference to the element that will be animated
 * @param {Object} attributes The attribute(s) to be animated.  
 * Each attribute is an object with at minimum a "to" or "by" member defined.  
 * Additional optional members are "from" (defaults to current value), "units" (defaults to "px").  
 * All attribute names use camelCase.
 * @param {Number} duration (optional, defaults to 1 second) Length of animation (frames or seconds), defaults to time-based
 * @param {Function} method (optional, defaults to YAHOO.util.Easing.easeNone) Computes the values that are applied to the attributes per frame (generally a YAHOO.util.Easing method)
 */
    YAHOO.util.Motion = function(el, attributes, duration,  method) {
        if (el) { // dont break existing subclasses not using YAHOO.extend
            YAHOO.util.Motion.superclass.constructor.call(this, el, attributes, duration, method);
        }
    };

    YAHOO.extend(YAHOO.util.Motion, YAHOO.util.ColorAnim);
    
    // shorthand
    var Y = YAHOO.util;
    var superclass = Y.Motion.superclass;
    var proto = Y.Motion.prototype;

    proto.toString = function() {
        var el = this.getEl();
        var id = el.id || el.tagName;
        return ("Motion " + id);
    };
    
    proto.patterns.points = /^points$/i;
    
    proto.setAttribute = function(attr, val, unit) {
        if (  this.patterns.points.test(attr) ) {
            unit = unit || 'px';
            superclass.setAttribute.call(this, 'left', val[0], unit);
            superclass.setAttribute.call(this, 'top', val[1], unit);
        } else {
            superclass.setAttribute.call(this, attr, val, unit);
        }
    };

    proto.getAttribute = function(attr) {
        if (  this.patterns.points.test(attr) ) {
            var val = [
                superclass.getAttribute.call(this, 'left'),
                superclass.getAttribute.call(this, 'top')
            ];
        } else {
            val = superclass.getAttribute.call(this, attr);
        }

        return val;
    };

    proto.doMethod = function(attr, start, end) {
        var val = null;

        if ( this.patterns.points.test(attr) ) {
            var t = this.method(this.currentFrame, 0, 100, this.totalFrames) / 100;				
            val = Y.Bezier.getPosition(this.runtimeAttributes[attr], t);
        } else {
            val = superclass.doMethod.call(this, attr, start, end);
        }
        return val;
    };

    proto.setRuntimeAttribute = function(attr) {
        if ( this.patterns.points.test(attr) ) {
            var el = this.getEl();
            var attributes = this.attributes;
            var start;
            var control = attributes['points']['control'] || [];
            var end;
            var i, len;
            
            if (control.length > 0 && !(control[0] instanceof Array) ) { // could be single point or array of points
                control = [control];
            } else { // break reference to attributes.points.control
                var tmp = []; 
                for (i = 0, len = control.length; i< len; ++i) {
                    tmp[i] = control[i];
                }
                control = tmp;
            }

            if (Y.Dom.getStyle(el, 'position') == 'static') { // default to relative
                Y.Dom.setStyle(el, 'position', 'relative');
            }
    
            if ( isset(attributes['points']['from']) ) {
                Y.Dom.setXY(el, attributes['points']['from']); // set position to from point
            } 
            else { Y.Dom.setXY( el, Y.Dom.getXY(el) ); } // set it to current position
            
            start = this.getAttribute('points'); // get actual top & left
            
            // TO beats BY, per SMIL 2.1 spec
            if ( isset(attributes['points']['to']) ) {
                end = translateValues.call(this, attributes['points']['to'], start);
                
                var pageXY = Y.Dom.getXY(this.getEl());
                for (i = 0, len = control.length; i < len; ++i) {
                    control[i] = translateValues.call(this, control[i], start);
                }

                
            } else if ( isset(attributes['points']['by']) ) {
                end = [ start[0] + attributes['points']['by'][0], start[1] + attributes['points']['by'][1] ];
                
                for (i = 0, len = control.length; i < len; ++i) {
                    control[i] = [ start[0] + control[i][0], start[1] + control[i][1] ];
                }
            }

            this.runtimeAttributes[attr] = [start];
            
            if (control.length > 0) {
                this.runtimeAttributes[attr] = this.runtimeAttributes[attr].concat(control); 
            }

            this.runtimeAttributes[attr][this.runtimeAttributes[attr].length] = end;
        }
        else {
            superclass.setRuntimeAttribute.call(this, attr);
        }
    };
    
    var translateValues = function(val, start) {
        var pageXY = Y.Dom.getXY(this.getEl());
        val = [ val[0] - pageXY[0] + start[0], val[1] - pageXY[1] + start[1] ];

        return val; 
    };
    
    var isset = function(prop) {
        return (typeof prop !== 'undefined');
    };
})();
(function() {
/**
 * Anim subclass for scrolling elements to a position defined by the "scroll"
 * member of "attributes".  All "scroll" members are arrays with x, y scroll positions.
 * <p>Usage: <code>var myAnim = new YAHOO.util.Scroll(el, { scroll: { to: [0, 800] } }, 1, YAHOO.util.Easing.easeOut);</code></p>
 * @class Scroll
 * @namespace YAHOO.util
 * @requires YAHOO.util.Anim
 * @requires YAHOO.util.AnimMgr
 * @requires YAHOO.util.Easing
 * @requires YAHOO.util.Bezier
 * @requires YAHOO.util.Dom
 * @requires YAHOO.util.Event
 * @requires YAHOO.util.CustomEvent 
 * @extends YAHOO.util.Anim
 * @constructor
 * @param {String or HTMLElement} el Reference to the element that will be animated
 * @param {Object} attributes The attribute(s) to be animated.  
 * Each attribute is an object with at minimum a "to" or "by" member defined.  
 * Additional optional members are "from" (defaults to current value), "units" (defaults to "px").  
 * All attribute names use camelCase.
 * @param {Number} duration (optional, defaults to 1 second) Length of animation (frames or seconds), defaults to time-based
 * @param {Function} method (optional, defaults to YAHOO.util.Easing.easeNone) Computes the values that are applied to the attributes per frame (generally a YAHOO.util.Easing method)
 */
    YAHOO.util.Scroll = function(el, attributes, duration,  method) {
        if (el) { // dont break existing subclasses not using YAHOO.extend
            YAHOO.util.Scroll.superclass.constructor.call(this, el, attributes, duration, method);
        }
    };

    YAHOO.extend(YAHOO.util.Scroll, YAHOO.util.ColorAnim);
    
    // shorthand
    var Y = YAHOO.util;
    var superclass = Y.Scroll.superclass;
    var proto = Y.Scroll.prototype;

    proto.toString = function() {
        var el = this.getEl();
        var id = el.id || el.tagName;
        return ("Scroll " + id);
    };

    proto.doMethod = function(attr, start, end) {
        var val = null;
    
        if (attr == 'scroll') {
            val = [
                this.method(this.currentFrame, start[0], end[0] - start[0], this.totalFrames),
                this.method(this.currentFrame, start[1], end[1] - start[1], this.totalFrames)
            ];
            
        } else {
            val = superclass.doMethod.call(this, attr, start, end);
        }
        return val;
    };

    proto.getAttribute = function(attr) {
        var val = null;
        var el = this.getEl();
        
        if (attr == 'scroll') {
            val = [ el.scrollLeft, el.scrollTop ];
        } else {
            val = superclass.getAttribute.call(this, attr);
        }
        
        return val;
    };

    proto.setAttribute = function(attr, val, unit) {
        var el = this.getEl();
        
        if (attr == 'scroll') {
            el.scrollLeft = val[0];
            el.scrollTop = val[1];
        } else {
            superclass.setAttribute.call(this, attr, val, unit);
        }
    };
})();
YAHOO.register("animation", YAHOO.util.Anim, {version: "2.2.0", build: "127"});

/*** end file 'animation.js' ***/

/*** begin file 'connection.js' ***/
/*
Copyright (c) 2007, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.2.0
*/
/**
 * The Connection Manager provides a simplified interface to the XMLHttpRequest
 * object.  It handles cross-browser instantiantion of XMLHttpRequest, negotiates the
 * interactive states and server response, returning the results to a pre-defined
 * callback you create.
 *
 * @namespace YAHOO.util
 * @module connection
 * @requires yahoo
 */

/**
 * The Connection Manager singleton provides methods for creating and managing
 * asynchronous transactions.
 *
 * @class Connect
 */

YAHOO.util.Connect =
{
  /**
   * @description Array of MSFT ActiveX ids for XMLHttpRequest.
   * @property _msxml_progid
   * @private
   * @static
   * @type array
   */
	_msxml_progid:[
		'MSXML2.XMLHTTP.3.0',
		'MSXML2.XMLHTTP',
		'Microsoft.XMLHTTP'
		],

  /**
   * @description Object literal of HTTP header(s)
   * @property _http_header
   * @private
   * @static
   * @type object
   */
	_http_headers:{},

  /**
   * @description Determines if HTTP headers are set.
   * @property _has_http_headers
   * @private
   * @static
   * @type boolean
   */
	_has_http_headers:false,

 /**
  * @description Determines if a default header of
  * Content-Type of 'application/x-www-form-urlencoded'
  * will be added to any client HTTP headers sent for POST
  * transactions.
  * @property _use_default_post_header
  * @private
  * @static
  * @type boolean
  */
    _use_default_post_header:true,

 /**
  * @description Determines if a default header of
  * Content-Type of 'application/x-www-form-urlencoded'
  * will be added to client HTTP headers sent for POST
  * transactions.
  * @property _default_post_header
  * @private
  * @static
  * @type boolean
  */
    _default_post_header:'application/x-www-form-urlencoded',

 /**
  * @description Determines if a default header of
  * 'X-Requested-With: XMLHttpRequest'
  * will be added to each transaction.
  * @property _use_default_xhr_header
  * @private
  * @static
  * @type boolean
  */
    _use_default_xhr_header:true,

 /**
  * @description The default header value for the label
  * "X-Requested-With".  This is sent with each
  * transaction, by default, to identify the
  * request as being made by YUI Connection Manager.
  * @property _default_xhr_header
  * @private
  * @static
  * @type boolean
  */
    _default_xhr_header:'XMLHttpRequest',

 /**
  * @description Determines if custom, default headers
  * are set for each transaction.
  * @property _has_default_header
  * @private
  * @static
  * @type boolean
  */
    _has_default_headers:true,

 /**
  * @description Determines if custom, default headers
  * are set for each transaction.
  * @property _has_default_header
  * @private
  * @static
  * @type boolean
  */
    _default_headers:{},

 /**
  * @description Property modified by setForm() to determine if the data
  * should be submitted as an HTML form.
  * @property _isFormSubmit
  * @private
  * @static
  * @type boolean
  */
    _isFormSubmit:false,

 /**
  * @description Property modified by setForm() to determine if a file(s)
  * upload is expected.
  * @property _isFileUpload
  * @private
  * @static
  * @type boolean
  */
    _isFileUpload:false,

 /**
  * @description Property modified by setForm() to set a reference to the HTML
  * form node if the desired action is file upload.
  * @property _formNode
  * @private
  * @static
  * @type object
  */
    _formNode:null,

 /**
  * @description Property modified by setForm() to set the HTML form data
  * for each transaction.
  * @property _sFormData
  * @private
  * @static
  * @type string
  */
    _sFormData:null,

 /**
  * @description Collection of polling references to the polling mechanism in handleReadyState.
  * @property _poll
  * @private
  * @static
  * @type object
  */
    _poll:{},

 /**
  * @description Queue of timeout values for each transaction callback with a defined timeout value.
  * @property _timeOut
  * @private
  * @static
  * @type object
  */
    _timeOut:{},

  /**
   * @description The polling frequency, in milliseconds, for HandleReadyState.
   * when attempting to determine a transaction's XHR readyState.
   * The default is 50 milliseconds.
   * @property _polling_interval
   * @private
   * @static
   * @type int
   */
     _polling_interval:50,

  /**
   * @description A transaction counter that increments the transaction id for each transaction.
   * @property _transaction_id
   * @private
   * @static
   * @type int
   */
     _transaction_id:0,

  /**
   * @description Member to add an ActiveX id to the existing xml_progid array.
   * In the event(unlikely) a new ActiveX id is introduced, it can be added
   * without internal code modifications.
   * @method setProgId
   * @public
   * @static
   * @param {string} id The ActiveX id to be added to initialize the XHR object.
   * @return void
   */
	setProgId:function(id)
	{
		this._msxml_progid.unshift(id);
	},

  /**
   * @description Member to enable or disable the default POST header.
   * @method setDefaultPostHeader
   * @public
   * @static
   * @param {boolean} b Set and use default header - true or false .
   * @return void
   */
	setDefaultPostHeader:function(b)
	{
		this._use_default_post_header = b;
	},

  /**
   * @description Member to enable or disable the default POST header.
   * @method setDefaultXhrHeader
   * @public
   * @static
   * @param {boolean} b Set and use default header - true or false .
   * @return void
   */
	setDefaultXhrHeader:function(b)
	{
		this._use_default_xhr_header = b;
	},

  /**
   * @description Member to modify the default polling interval.
   * @method setPollingInterval
   * @public
   * @static
   * @param {int} i The polling interval in milliseconds.
   * @return void
   */
	setPollingInterval:function(i)
	{
		if(typeof i == 'number' && isFinite(i)){
			this._polling_interval = i;
		}
	},

  /**
   * @description Instantiates a XMLHttpRequest object and returns an object with two properties:
   * the XMLHttpRequest instance and the transaction id.
   * @method createXhrObject
   * @private
   * @static
   * @param {int} transactionId Property containing the transaction id for this transaction.
   * @return object
   */
	createXhrObject:function(transactionId)
	{
		var obj,http;
		try
		{
			// Instantiates XMLHttpRequest in non-IE browsers and assigns to http.
			http = new XMLHttpRequest();
			//  Object literal with http and tId properties
			obj = { conn:http, tId:transactionId };
		}
		catch(e)
		{
			for(var i=0; i<this._msxml_progid.length; ++i){
				try
				{
					// Instantiates XMLHttpRequest for IE and assign to http.
					http = new ActiveXObject(this._msxml_progid[i]);
					//  Object literal with conn and tId properties
					obj = { conn:http, tId:transactionId };
					break;
				}
				catch(e){}
			}
		}
		finally
		{
			return obj;
		}
	},

  /**
   * @description This method is called by asyncRequest to create a
   * valid connection object for the transaction.  It also passes a
   * transaction id and increments the transaction id counter.
   * @method getConnectionObject
   * @private
   * @static
   * @return {object}
   */
	getConnectionObject:function()
	{
		var o;
		var tId = this._transaction_id;

		try
		{
			o = this.createXhrObject(tId);
			if(o){
				this._transaction_id++;
			}
		}
		catch(e){}
		finally
		{
			return o;
		}
	},

  /**
   * @description Method for initiating an asynchronous request via the XHR object.
   * @method asyncRequest
   * @public
   * @static
   * @param {string} method HTTP transaction method
   * @param {string} uri Fully qualified path of resource
   * @param {callback} callback User-defined callback function or object
   * @param {string} postData POST body
   * @return {object} Returns the connection object
   */
	asyncRequest:function(method, uri, callback, postData)
	{
		var o = this.getConnectionObject();

		if(!o){
			return null;
		}
		else{
			if(this._isFormSubmit){
				if(this._isFileUpload){
					this.uploadFile(o.tId, callback, uri, postData);
					this.releaseObject(o);

					return;
				}

				//If the specified HTTP method is GET, setForm() will return an
				//encoded string that is concatenated to the uri to
				//create a querystring.
				if(method.toUpperCase() == 'GET'){
					if(this._sFormData.length != 0){
						// If the URI already contains a querystring, append an ampersand
						// and then concatenate _sFormData to the URI.
						uri += ((uri.indexOf('?') == -1)?'?':'&') + this._sFormData;
					}
					else{
						uri += "?" + this._sFormData;
					}
				}
				else if(method.toUpperCase() == 'POST'){
					//If POST data exist in addition to the HTML form data,
					//it will be concatenated to the form data.
					postData = postData?this._sFormData + "&" + postData:this._sFormData;
				}
			}

			o.conn.open(method, uri, true);

			if(this._use_default_xhr_header){
				if(!this._default_headers['X-Requested-With']){
					this.initHeader('X-Requested-With', this._default_xhr_header, true);
				}
			}
			if(this._isFormSubmit || (postData && this._use_default_post_header)){
				this.initHeader('Content-Type', this._default_post_header);
				if(this._isFormSubmit){
					this.resetFormState();
				}
			}

			if(this._has_default_headers || this._has_http_headers){
				this.setHeader(o);
			}

			this.handleReadyState(o, callback);
			o.conn.send(postData || null);

			return o;
		}
	},

  /**
   * @description This method serves as a timer that polls the XHR object's readyState
   * property during a transaction, instead of binding a callback to the
   * onreadystatechange event.  Upon readyState 4, handleTransactionResponse
   * will process the response, and the timer will be cleared.
   * @method handleReadyState
   * @private
   * @static
   * @param {object} o The connection object
   * @param {callback} callback The user-defined callback object
   * @return {void}
   */
    handleReadyState:function(o, callback)
    {
		var oConn = this;

		if(callback && callback.timeout){
			this._timeOut[o.tId] = window.setTimeout(function(){ oConn.abort(o, callback, true); }, callback.timeout);
		}

		this._poll[o.tId] = window.setInterval(
			function(){
				if(o.conn && o.conn.readyState == 4){
					window.clearInterval(oConn._poll[o.tId]);
					delete oConn._poll[o.tId];

					if(callback && callback.timeout){
						delete oConn._timeOut[o.tId];
					}

					oConn.handleTransactionResponse(o, callback);
				}
			}
		,this._polling_interval);
    },

  /**
   * @description This method attempts to interpret the server response and
   * determine whether the transaction was successful, or if an error or
   * exception was encountered.
   * @method handleTransactionResponse
   * @private
   * @static
   * @param {object} o The connection object
   * @param {object} callback The sser-defined callback object
   * @param {boolean} isAbort Determines if the transaction was aborted.
   * @return {void}
   */
    handleTransactionResponse:function(o, callback, isAbort)
    {
		// If no valid callback is provided, then do not process any callback handling.
		if(!callback){
			this.releaseObject(o);
			return;
		}

		var httpStatus, responseObject;

		try
		{
			if(o.conn.status !== undefined && o.conn.status != 0){
				httpStatus = o.conn.status;
			}
			else{
				httpStatus = 13030;
			}
		}
		catch(e){
			// 13030 is the custom code to indicate the condition -- in Mozilla/FF --
			// when the o object's status and statusText properties are
			// unavailable, and a query attempt throws an exception.
			httpStatus = 13030;
		}

		if(httpStatus >= 200 && httpStatus < 300){
			responseObject = this.createResponseObject(o, callback.argument);
			if(callback.success){
				if(!callback.scope){
					callback.success(responseObject);
				}
				else{
					// If a scope property is defined, the callback will be fired from
					// the context of the object.
					callback.success.apply(callback.scope, [responseObject]);
				}
			}
		}
		else{
			switch(httpStatus){
				// The following cases are wininet.dll error codes that may be encountered.
				case 12002: // Server timeout
				case 12029: // 12029 to 12031 correspond to dropped connections.
				case 12030:
				case 12031:
				case 12152: // Connection closed by server.
				case 13030: // See above comments for variable status.
					responseObject = this.createExceptionObject(o.tId, callback.argument, (isAbort?isAbort:false));
					if(callback.failure){
						if(!callback.scope){
							callback.failure(responseObject);
						}
						else{
							callback.failure.apply(callback.scope, [responseObject]);
						}
					}
					break;
				default:
					responseObject = this.createResponseObject(o, callback.argument);
					if(callback.failure){
						if(!callback.scope){
							callback.failure(responseObject);
						}
						else{
							callback.failure.apply(callback.scope, [responseObject]);
						}
					}
			}
		}

		this.releaseObject(o);
		responseObject = null;
    },

  /**
   * @description This method evaluates the server response, creates and returns the results via
   * its properties.  Success and failure cases will differ in the response
   * object's property values.
   * @method createResponseObject
   * @private
   * @static
   * @param {object} o The connection object
   * @param {callbackArg} callbackArg The user-defined argument or arguments to be passed to the callback
   * @return {object}
   */
    createResponseObject:function(o, callbackArg)
    {
		var obj = {};
		var headerObj = {};

		try
		{
			var headerStr = o.conn.getAllResponseHeaders();
			var header = headerStr.split('\n');
			for(var i=0; i<header.length; i++){
				var delimitPos = header[i].indexOf(':');
				if(delimitPos != -1){
					headerObj[header[i].substring(0,delimitPos)] = header[i].substring(delimitPos+2);
				}
			}
		}
		catch(e){}

		obj.tId = o.tId;
		obj.status = o.conn.status;
		obj.statusText = o.conn.statusText;
		obj.getResponseHeader = headerObj;
		obj.getAllResponseHeaders = headerStr;
		obj.responseText = o.conn.responseText;
		obj.responseXML = o.conn.responseXML;

		if(typeof callbackArg !== undefined){
			obj.argument = callbackArg;
		}

		return obj;
    },

  /**
   * @description If a transaction cannot be completed due to dropped or closed connections,
   * there may be not be enough information to build a full response object.
   * The failure callback will be fired and this specific condition can be identified
   * by a status property value of 0.
   *
   * If an abort was successful, the status property will report a value of -1.
   *
   * @method createExceptionObject
   * @private
   * @static
   * @param {int} tId The Transaction Id
   * @param {callbackArg} callbackArg The user-defined argument or arguments to be passed to the callback
   * @param {boolean} isAbort Determines if the exception case is caused by a transaction abort
   * @return {object}
   */
    createExceptionObject:function(tId, callbackArg, isAbort)
    {
		var COMM_CODE = 0;
		var COMM_ERROR = 'communication failure';
		var ABORT_CODE = -1;
		var ABORT_ERROR = 'transaction aborted';

		var obj = {};

		obj.tId = tId;
		if(isAbort){
			obj.status = ABORT_CODE;
			obj.statusText = ABORT_ERROR;
		}
		else{
			obj.status = COMM_CODE;
			obj.statusText = COMM_ERROR;
		}

		if(callbackArg){
			obj.argument = callbackArg;
		}

		return obj;
    },

  /**
   * @description Method that initializes the custom HTTP headers for the each transaction.
   * @method initHeader
   * @public
   * @static
   * @param {string} label The HTTP header label
   * @param {string} value The HTTP header value
   * @param {string} isDefault Determines if the specific header is a default header
   * automatically sent with each transaction.
   * @return {void}
   */
	initHeader:function(label,value,isDefault)
	{
		var headerObj = (isDefault)?this._default_headers:this._http_headers;

		if(headerObj[label] === undefined){
			headerObj[label] = value;
		}
		else{
			// Concatenate multiple values, comma-delimited,
			// for the same header label,
			headerObj[label] =  value + "," + headerObj[label];
		}

		if(isDefault){
			this._has_default_headers = true;
		}
		else{
			this._has_http_headers = true;
		}
	},


  /**
   * @description Accessor that sets the HTTP headers for each transaction.
   * @method setHeader
   * @private
   * @static
   * @param {object} o The connection object for the transaction.
   * @return {void}
   */
	setHeader:function(o)
	{
		if(this._has_default_headers){
			for(var prop in this._default_headers){
				if(YAHOO.lang.hasOwnProperty(this._default_headers,prop)){
					o.conn.setRequestHeader(prop, this._default_headers[prop]);
				}
			}
		}

		if(this._has_http_headers){
			for(var prop in this._http_headers){
				if(YAHOO.lang.hasOwnProperty(this._http_headers,prop)){
					o.conn.setRequestHeader(prop, this._http_headers[prop]);
				}
			}
			delete this._http_headers;

			this._http_headers = {};
			this._has_http_headers = false;
		}
	},

  /**
   * @description Resets the default HTTP headers object
   * @method resetDefaultHeaders
   * @public
   * @static
   * @return {void}
   */
	resetDefaultHeaders:function(){
		delete this._default_headers
		this._default_headers = {};
		this._has_default_headers = false;
	},

  /**
   * @description This method assembles the form label and value pairs and
   * constructs an encoded string.
   * asyncRequest() will automatically initialize the
   * transaction with a HTTP header Content-Type of
   * application/x-www-form-urlencoded.
   * @method setForm
   * @public
   * @static
   * @param {string || object} form id or name attribute, or form object.
   * @param {string} optional boolean to indicate SSL environment.
   * @param {string || boolean} optional qualified path of iframe resource for SSL in IE.
   * @return {string} string of the HTML form field name and value pairs..
   */
	setForm:function(formId, isUpload, secureUri)
	{
		this.resetFormState();
		var oForm;
		if(typeof formId == 'string'){
			// Determine if the argument is a form id or a form name.
			// Note form name usage is deprecated by supported
			// here for legacy reasons.
			oForm = (document.getElementById(formId) || document.forms[formId]);
		}
		else if(typeof formId == 'object'){
			// Treat argument as an HTML form object.
			oForm = formId;
		}
		else{
			return;
		}

		// If the isUpload argument is true, setForm will call createFrame to initialize
		// an iframe as the form target.
		//
		// The argument secureURI is also required by IE in SSL environments
		// where the secureURI string is a fully qualified HTTP path, used to set the source
		// of the iframe, to a stub resource in the same domain.
		if(isUpload){

			// Create iframe in preparation for file upload.
			this.createFrame(secureUri?secureUri:null);

			// Set form reference and file upload properties to true.
			this._isFormSubmit = true;
			this._isFileUpload = true;
			this._formNode = oForm;

			return;
		}

		var oElement, oName, oValue, oDisabled;
		var hasSubmit = false;

		// Iterate over the form elements collection to construct the
		// label-value pairs.
		for (var i=0; i<oForm.elements.length; i++){
			oElement = oForm.elements[i];
			oDisabled = oForm.elements[i].disabled;
			oName = oForm.elements[i].name;
			oValue = oForm.elements[i].value;

			// Do not submit fields that are disabled or
			// do not have a name attribute value.
			if(!oDisabled && oName)
			{
				switch (oElement.type)
				{
					case 'select-one':
					case 'select-multiple':
						for(var j=0; j<oElement.options.length; j++){
							if(oElement.options[j].selected){
								if(window.ActiveXObject){
									this._sFormData += encodeURIComponent(oName) + '=' + encodeURIComponent(oElement.options[j].attributes['value'].specified?oElement.options[j].value:oElement.options[j].text) + '&';
								}
								else{
									this._sFormData += encodeURIComponent(oName) + '=' + encodeURIComponent(oElement.options[j].hasAttribute('value')?oElement.options[j].value:oElement.options[j].text) + '&';
								}

							}
						}
						break;
					case 'radio':
					case 'checkbox':
						if(oElement.checked){
							this._sFormData += encodeURIComponent(oName) + '=' + encodeURIComponent(oValue) + '&';
						}
						break;
					case 'file':
						// stub case as XMLHttpRequest will only send the file path as a string.
					case undefined:
						// stub case for fieldset element which returns undefined.
					case 'reset':
						// stub case for input type reset button.
					case 'button':
						// stub case for input type button elements.
						break;
					case 'submit':
						if(hasSubmit == false){
							this._sFormData += encodeURIComponent(oName) + '=' + encodeURIComponent(oValue) + '&';
							hasSubmit = true;
						}
						break;
					default:
						this._sFormData += encodeURIComponent(oName) + '=' + encodeURIComponent(oValue) + '&';
						break;
				}
			}
		}

		this._isFormSubmit = true;
		this._sFormData = this._sFormData.substr(0, this._sFormData.length - 1);

		return this._sFormData;
	},

  /**
   * @description Resets HTML form properties when an HTML form or HTML form
   * with file upload transaction is sent.
   * @method resetFormState
   * @private
   * @static
   * @return {void}
   */
	resetFormState:function(){
		this._isFormSubmit = false;
		this._isFileUpload = false;
		this._formNode = null;
		this._sFormData = "";
	},

  /**
   * @description Creates an iframe to be used for form file uploads.  It is remove from the
   * document upon completion of the upload transaction.
   * @method createFrame
   * @private
   * @static
   * @param {string} optional qualified path of iframe resource for SSL in IE.
   * @return {void}
   */
	createFrame:function(secureUri){

		// IE does not allow the setting of id and name attributes as object
		// properties via createElement().  A different iframe creation
		// pattern is required for IE.
		var frameId = 'yuiIO' + this._transaction_id;
		if(window.ActiveXObject){
			var io = document.createElement('<iframe id="' + frameId + '" name="' + frameId + '" />');

			// IE will throw a security exception in an SSL environment if the
			// iframe source is undefined.
			if(typeof secureUri == 'boolean'){
				io.src = 'javascript:false';
			}
			else if(typeof secureURI == 'string'){
				// Deprecated
				io.src = secureUri;
			}
		}
		else{
			var io = document.createElement('iframe');
			io.id = frameId;
			io.name = frameId;
		}

		io.style.position = 'absolute';
		io.style.top = '-1000px';
		io.style.left = '-1000px';

		document.body.appendChild(io);
	},

  /**
   * @description Parses the POST data and creates hidden form elements
   * for each key-value, and appends them to the HTML form object.
   * @method appendPostData
   * @private
   * @static
   * @param {string} postData The HTTP POST data
   * @return {array} formElements Collection of hidden fields.
   */
	appendPostData:function(postData)
	{
		var formElements = [];
		var postMessage = postData.split('&');
		for(var i=0; i < postMessage.length; i++){
			var delimitPos = postMessage[i].indexOf('=');
			if(delimitPos != -1){
				formElements[i] = document.createElement('input');
				formElements[i].type = 'hidden';
				formElements[i].name = postMessage[i].substring(0,delimitPos);
				formElements[i].value = postMessage[i].substring(delimitPos+1);
				this._formNode.appendChild(formElements[i]);
			}
		}

		return formElements;
	},

  /**
   * @description Uploads HTML form, including files/attachments, to the
   * iframe created in createFrame.
   * @method uploadFile
   * @private
   * @static
   * @param {int} id The transaction id.
   * @param {object} callback - User-defined callback object.
   * @param {string} uri Fully qualified path of resource.
   * @return {void}
   */
	uploadFile:function(id, callback, uri, postData){

		// Each iframe has an id prefix of "yuiIO" followed
		// by the unique transaction id.
		var frameId = 'yuiIO' + id;
		var uploadEncoding = 'multipart/form-data';
		var io = document.getElementById(frameId);

		// Initialize the HTML form properties in case they are
		// not defined in the HTML form.
		this._formNode.action = uri;
		this._formNode.method = 'POST';
		this._formNode.target = frameId;

		if(this._formNode.encoding){
			// IE does not respect property enctype for HTML forms.
			// Instead it uses the property - "encoding".
			this._formNode.encoding = uploadEncoding;
		}
		else{
			this._formNode.enctype = uploadEncoding;
		}


		if(postData){
			var oElements = this.appendPostData(postData);
		}

		this._formNode.submit();

		if(oElements && oElements.length > 0){
			for(var i=0; i < oElements.length; i++){
				this._formNode.removeChild(oElements[i]);
			}
		}

		// Reset HTML form status properties.
		this.resetFormState();

		// Create the upload callback handler that fires when the iframe
		// receives the load event.  Subsequently, the event handler is detached
		// and the iframe removed from the document.

		var uploadCallback = function()
		{
			var obj = {};
			obj.tId = id;
			obj.argument = callback.argument;

			try
			{
				obj.responseText = io.contentWindow.document.body?io.contentWindow.document.body.innerHTML:null;
				obj.responseXML = io.contentWindow.document.XMLDocument?io.contentWindow.document.XMLDocument:io.contentWindow.document;
			}
			catch(e){}

			if(callback && callback.upload){
				if(!callback.scope){
					callback.upload(obj);
				}
				else{
					callback.upload.apply(callback.scope, [obj]);
				}
			}

			if(YAHOO.util.Event){
				YAHOO.util.Event.removeListener(io, "load", uploadCallback);
			}
			else if(window.detachEvent){
				io.detachEvent('onload', uploadCallback);
			}
			else{
				io.removeEventListener('load', uploadCallback, false);
			}
			setTimeout(
				function(){
					document.body.removeChild(io);
				}, 100);
		};


		// Bind the onload handler to the iframe to detect the file upload response.
		if(YAHOO.util.Event){
			YAHOO.util.Event.addListener(io, "load", uploadCallback);
		}
		else if(window.attachEvent){
			io.attachEvent('onload', uploadCallback);
		}
		else{
			io.addEventListener('load', uploadCallback, false);
		}
	},

  /**
   * @description Method to terminate a transaction, if it has not reached readyState 4.
   * @method abort
   * @public
   * @static
   * @param {object} o The connection object returned by asyncRequest.
   * @param {object} callback  User-defined callback object.
   * @param {string} isTimeout boolean to indicate if abort was a timeout.
   * @return {boolean}
   */
	abort:function(o, callback, isTimeout)
	{
		if(this.isCallInProgress(o)){
			o.conn.abort();
			window.clearInterval(this._poll[o.tId]);
			delete this._poll[o.tId];
			if(isTimeout){
				delete this._timeOut[o.tId];
			}

			this.handleTransactionResponse(o, callback, true);

			return true;
		}
		else{
			return false;
		}
	},

  /**
   * Public method to check if the transaction is still being processed.
   *
   * @method isCallInProgress
   * @public
   * @static
   * @param {object} o The connection object returned by asyncRequest
   * @return {boolean}
   */
	isCallInProgress:function(o)
	{
		// if the XHR object assigned to the transaction has not been dereferenced,
		// then check its readyState status.  Otherwise, return false.
		if(o.conn){
			return o.conn.readyState != 4 && o.conn.readyState != 0;
		}
		else{
			//The XHR object has been destroyed.
			return false;
		}
	},

  /**
   * @description Dereference the XHR instance and the connection object after the transaction is completed.
   * @method releaseObject
   * @private
   * @static
   * @param {object} o The connection object
   * @return {void}
   */
	releaseObject:function(o)
	{
		//dereference the XHR instance.
		o.conn = null;
		//dereference the connection object.
		o = null;
	}
};
YAHOO.register("connection", YAHOO.widget.Module, {version: "2.2.0", build: "127"});

/*** end file 'connection.js' ***/

/*** begin file 'container.js' ***/
/*
Copyright (c) 2007, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.2.0
*/
/**
* Config is a utility used within an Object to allow the implementer to maintain a list of local configuration properties and listen for changes to those properties dynamically using CustomEvent. The initial values are also maintained so that the configuration can be reset at any given point to its initial state.
* @namespace YAHOO.util
* @class Config
* @constructor
* @param {Object}	owner	The owner Object to which this Config Object belongs
*/
YAHOO.util.Config = function(owner) {
	if (owner) {
		this.init(owner);
	}
};

YAHOO.util.Config.prototype = {
	
	/**
	* Object reference to the owner of this Config Object
	* @property owner
	* @type Object
	*/
	owner : null,

	/**
	* Boolean flag that specifies whether a queue is currently being executed
	* @property queueInProgress
	* @type Boolean
	*/
	queueInProgress : false,


	/**
	* Validates that the value passed in is a Boolean.
	* @method checkBoolean
	* @param	{Object}	val	The value to validate
	* @return	{Boolean}	true, if the value is valid
	*/	
	checkBoolean: function(val) {
		if (typeof val == 'boolean') {
			return true;
		} else {
			return false;
		}
	},

	/**
	* Validates that the value passed in is a number.
	* @method checkNumber
	* @param	{Object}	val	The value to validate
	* @return	{Boolean}	true, if the value is valid
	*/
	checkNumber: function(val) {
		if (isNaN(val)) {
			return false;
		} else {
			return true;
		}
	}
};


/**
* Initializes the configuration Object and all of its local members.
* @method init
* @param {Object}	owner	The owner Object to which this Config Object belongs
*/
YAHOO.util.Config.prototype.init = function(owner) {

	this.owner = owner;

	/**
	* Object reference to the owner of this Config Object
	* @event configChangedEvent
	*/
	this.configChangedEvent = new YAHOO.util.CustomEvent("configChanged");
	this.queueInProgress = false;

	/* Private Members */

	/**
	* Maintains the local collection of configuration property objects and their specified values
	* @property config
	* @private
	* @type Object
	*/ 
	var config = {};

	/**
	* Maintains the local collection of configuration property objects as they were initially applied.
	* This object is used when resetting a property.
	* @property initialConfig
	* @private
	* @type Object
	*/ 
	var initialConfig = {};

	/**
	* Maintains the local, normalized CustomEvent queue
	* @property eventQueue
	* @private
	* @type Object
	*/ 
	var eventQueue = [];

	/**
	* Fires a configuration property event using the specified value. 
	* @method fireEvent
	* @private
	* @param {String}	key			The configuration property's name
	* @param {value}	Object		The value of the correct type for the property
	*/ 
	var fireEvent = function( key, value ) {
		key = key.toLowerCase();

		var property = config[key];

		if (typeof property != 'undefined' && property.event) {
			property.event.fire(value);
		}	
	};
	/* End Private Members */

	/**
	* Adds a property to the Config Object's private config hash.
	* @method addProperty
	* @param {String}	key	The configuration property's name
	* @param {Object}	propertyObject	The Object containing all of this property's arguments
	*/
	this.addProperty = function( key, propertyObject ) {
		key = key.toLowerCase();

		config[key] = propertyObject;

		propertyObject.event = new YAHOO.util.CustomEvent(key);
		propertyObject.key = key;

		if (propertyObject.handler) {
			propertyObject.event.subscribe(propertyObject.handler, this.owner, true);
		}

		this.setProperty(key, propertyObject.value, true);
		
		if (! propertyObject.suppressEvent) {
			this.queueProperty(key, propertyObject.value);
		}
	};

	/**
	* Returns a key-value configuration map of the values currently set in the Config Object.
	* @method getConfig
	* @return {Object} The current config, represented in a key-value map
	*/
	this.getConfig = function() {
		var cfg = {};
			
		for (var prop in config) {
			var property = config[prop];
			if (typeof property != 'undefined' && property.event) {
				cfg[prop] = property.value;
			}
		}
		
		return cfg;
	};

	/**
	* Returns the value of specified property.
	* @method getProperty
	* @param {String} key	The name of the property
	* @return {Object}		The value of the specified property
	*/
	this.getProperty = function(key) {
		key = key.toLowerCase();

		var property = config[key];
		if (typeof property != 'undefined' && property.event) {
			return property.value;
		} else {
			return undefined;
		}
	};

	/**
	* Resets the specified property's value to its initial value.
	* @method resetProperty
	* @param {String} key	The name of the property
	* @return {Boolean} True is the property was reset, false if not
	*/
	this.resetProperty = function(key) {
		key = key.toLowerCase();

		var property = config[key];
		if (typeof property != 'undefined' && property.event) {
			if (initialConfig[key] && initialConfig[key] != 'undefined')	{
				this.setProperty(key, initialConfig[key]);
			}
			return true;
		} else {
			return false;
		}
	};

	/**
	* Sets the value of a property. If the silent property is passed as true, the property's event will not be fired.
	* @method setProperty
	* @param {String} key		The name of the property
	* @param {String} value		The value to set the property to
	* @param {Boolean} silent	Whether the value should be set silently, without firing the property event.
	* @return {Boolean}			True, if the set was successful, false if it failed.
	*/
	this.setProperty = function(key, value, silent) {
		key = key.toLowerCase();

		if (this.queueInProgress && ! silent) {
			this.queueProperty(key,value); // Currently running through a queue... 
			return true;
		} else {
			var property = config[key];
			if (typeof property != 'undefined' && property.event) {
				if (property.validator && ! property.validator(value)) { // validator
					return false;
				} else {
					property.value = value;
					if (! silent) {
						fireEvent(key, value);
						this.configChangedEvent.fire([key, value]);
					}
					return true;
				}
			} else {
				return false;
			}
		}
	};

	/**
	* Sets the value of a property and queues its event to execute. If the event is already scheduled to execute, it is
	* moved from its current position to the end of the queue.
	* @method queueProperty
	* @param {String} key	The name of the property
	* @param {String} value	The value to set the property to
	* @return {Boolean}		true, if the set was successful, false if it failed.
	*/	
	this.queueProperty = function(key, value) {
		key = key.toLowerCase();

		var property = config[key];
							
		if (typeof property != 'undefined' && property.event) {
			if (typeof value != 'undefined' && property.validator && ! property.validator(value)) { // validator
				return false;
			} else {

				if (typeof value != 'undefined') {
					property.value = value;
				} else {
					value = property.value;
				}

				var foundDuplicate = false;

				for (var i=0;i<eventQueue.length;i++) {
					var queueItem = eventQueue[i];

					if (queueItem) {
						var queueItemKey = queueItem[0];
						var queueItemValue = queueItem[1];
						
						if (queueItemKey.toLowerCase() == key) {
							// found a dupe... push to end of queue, null current item, and break
							eventQueue[i] = null;
							eventQueue.push([key, (typeof value != 'undefined' ? value : queueItemValue)]);
							foundDuplicate = true;
							break;
						}
					}
				}
				
				if (! foundDuplicate && typeof value != 'undefined') { // this is a refire, or a new property in the queue
					eventQueue.push([key, value]);
				}
			}

			if (property.supercedes) {
				for (var s=0;s<property.supercedes.length;s++) {
					var supercedesCheck = property.supercedes[s];

					for (var q=0;q<eventQueue.length;q++) {
						var queueItemCheck = eventQueue[q];

						if (queueItemCheck) {
							var queueItemCheckKey = queueItemCheck[0];
							var queueItemCheckValue = queueItemCheck[1];
							
							if ( queueItemCheckKey.toLowerCase() == supercedesCheck.toLowerCase() ) {
								eventQueue.push([queueItemCheckKey, queueItemCheckValue]);
								eventQueue[q] = null;
								break;
							}
						}
					}
				}
			}

			return true;
		} else {
			return false;
		}
	};

	/**
	* Fires the event for a property using the property's current value.
	* @method refireEvent
	* @param {String} key	The name of the property
	*/
	this.refireEvent = function(key) {
		key = key.toLowerCase();

		var property = config[key];
		if (typeof property != 'undefined' && property.event && typeof property.value != 'undefined') {
			if (this.queueInProgress) {
				this.queueProperty(key);
			} else {
				fireEvent(key, property.value);
			}
		}
	};

	/**
	* Applies a key-value Object literal to the configuration, replacing any existing values, and queueing the property events.
	* Although the values will be set, fireQueue() must be called for their associated events to execute.
	* @method applyConfig
	* @param {Object}	userConfig	The configuration Object literal
	* @param {Boolean}	init		When set to true, the initialConfig will be set to the userConfig passed in, so that calling a reset will reset the properties to the passed values.
	*/
	this.applyConfig = function(userConfig, init) {
		if (init) {
			initialConfig = userConfig;
		}
		for (var prop in userConfig) {
			this.queueProperty(prop, userConfig[prop]);
		}
	};

	/**
	* Refires the events for all configuration properties using their current values.
	* @method refresh
	*/
	this.refresh = function() {
		for (var prop in config) {
			this.refireEvent(prop);
		}
	};

	/**
	* Fires the normalized list of queued property change events
	* @method fireQueue
	*/
	this.fireQueue = function() {
		this.queueInProgress = true;
		for (var i=0;i<eventQueue.length;i++) {
			var queueItem = eventQueue[i];
			if (queueItem) {
				var key = queueItem[0];
				var value = queueItem[1];
				
				var property = config[key];
				property.value = value;

				fireEvent(key,value);
			}
		}
		
		this.queueInProgress = false;
		eventQueue = [];
	};

	/**
	* Subscribes an external handler to the change event for any given property. 
	* @method subscribeToConfigEvent
	* @param {String}	key			The property name
	* @param {Function}	handler		The handler function to use subscribe to the property's event
	* @param {Object}	obj			The Object to use for scoping the event handler (see CustomEvent documentation)
	* @param {Boolean}	override	Optional. If true, will override "this" within the handler to map to the scope Object passed into the method.
	* @return {Boolean}				True, if the subscription was successful, otherwise false.
	*/	
	this.subscribeToConfigEvent = function(key, handler, obj, override) {
		key = key.toLowerCase();

		var property = config[key];
		if (typeof property != 'undefined' && property.event) {
			if (! YAHOO.util.Config.alreadySubscribed(property.event, handler, obj)) {
				property.event.subscribe(handler, obj, override);
			}
			return true;
		} else {
			return false;
		}
	};

	/**
	* Unsubscribes an external handler from the change event for any given property. 
	* @method unsubscribeFromConfigEvent
	* @param {String}	key			The property name
	* @param {Function}	handler		The handler function to use subscribe to the property's event
	* @param {Object}	obj			The Object to use for scoping the event handler (see CustomEvent documentation)
	* @return {Boolean}				True, if the unsubscription was successful, otherwise false.
	*/
	this.unsubscribeFromConfigEvent = function(key, handler, obj) {
		key = key.toLowerCase();

		var property = config[key];
		if (typeof property != 'undefined' && property.event) {
			return property.event.unsubscribe(handler, obj);
		} else {
			return false;
		}
	};

	/**
	* Returns a string representation of the Config object
	* @method toString
	* @return {String}	The Config object in string format.
	*/
	this.toString = function() {
		var output = "Config";
		if (this.owner) {
			output += " [" + this.owner.toString() + "]";
		}
		return output;
	};

	/**
	* Returns a string representation of the Config object's current CustomEvent queue
	* @method outputEventQueue
	* @return {String}	The string list of CustomEvents currently queued for execution
	*/
	this.outputEventQueue = function() {
		var output = "";
		for (var q=0;q<eventQueue.length;q++) {
			var queueItem = eventQueue[q];
			if (queueItem) {
				output += queueItem[0] + "=" + queueItem[1] + ", ";
			}
		}
		return output;
	};
};

/**
* Checks to determine if a particular function/Object pair are already subscribed to the specified CustomEvent
* @method YAHOO.util.Config.alreadySubscribed
* @static
* @param {YAHOO.util.CustomEvent} evt	The CustomEvent for which to check the subscriptions
* @param {Function}	fn	The function to look for in the subscribers list
* @param {Object}	obj	The execution scope Object for the subscription
* @return {Boolean}	true, if the function/Object pair is already subscribed to the CustomEvent passed in
*/
YAHOO.util.Config.alreadySubscribed = function(evt, fn, obj) {
	for (var e=0;e<evt.subscribers.length;e++) {
		var subsc = evt.subscribers[e];
		if (subsc && subsc.obj == obj && subsc.fn == fn) {
			return true;
		}
	}
	return false;
};

/**
*  The Container family of components is designed to enable developers to create different kinds of content-containing modules on the web. Module and Overlay are the most basic containers, and they can be used directly or extended to build custom containers. Also part of the Container family are four UI controls that extend Module and Overlay: Tooltip, Panel, Dialog, and SimpleDialog.
* @module container
* @title Container
* @requires yahoo,dom,event,dragdrop,animation
*/

/**
* Module is a JavaScript representation of the Standard Module Format. Standard Module Format is a simple standard for markup containers where child nodes representing the header, body, and footer of the content are denoted using the CSS classes "hd", "bd", and "ft" respectively. Module is the base class for all other classes in the YUI Container package.
* @namespace YAHOO.widget
* @class Module
* @constructor
* @param {String} el			The element ID representing the Module <em>OR</em>
* @param {HTMLElement} el		The element representing the Module
* @param {Object} userConfig	The configuration Object literal containing the configuration that should be set for this module. See configuration documentation for more details.
*/
YAHOO.widget.Module = function(el, userConfig) {
	if (el) {
		this.init(el, userConfig);
	} else {
	}
};

/**
* Constant representing the prefix path to use for non-secure images
* @property YAHOO.widget.Module.IMG_ROOT
* @static
* @final
* @type String
*/
YAHOO.widget.Module.IMG_ROOT = null;

/**
* Constant representing the prefix path to use for securely served images
* @property YAHOO.widget.Module.IMG_ROOT_SSL
* @static
* @final
* @type String
*/
YAHOO.widget.Module.IMG_ROOT_SSL = null;

/**
* Constant for the default CSS class name that represents a Module
* @property YAHOO.widget.Module.CSS_MODULE
* @static
* @final
* @type String
*/
YAHOO.widget.Module.CSS_MODULE = "module";

/**
* Constant representing the module header
* @property YAHOO.widget.Module.CSS_HEADER
* @static
* @final
* @type String
*/
YAHOO.widget.Module.CSS_HEADER = "hd";

/**
* Constant representing the module body
* @property YAHOO.widget.Module.CSS_BODY
* @static
* @final
* @type String
*/
YAHOO.widget.Module.CSS_BODY = "bd";

/**
* Constant representing the module footer
* @property YAHOO.widget.Module.CSS_FOOTER
* @static
* @final
* @type String
*/
YAHOO.widget.Module.CSS_FOOTER = "ft";

/**
* Constant representing the url for the "src" attribute of the iframe used to monitor changes to the browser's base font size
* @property YAHOO.widget.Module.RESIZE_MONITOR_SECURE_URL
* @static
* @final
* @type String
*/
YAHOO.widget.Module.RESIZE_MONITOR_SECURE_URL = "javascript:false;";

/**
* Singleton CustomEvent fired when the font size is changed in the browser.
* Opera's "zoom" functionality currently does not support text size detection.
* @event YAHOO.widget.Module.textResizeEvent
*/
YAHOO.widget.Module.textResizeEvent = new YAHOO.util.CustomEvent("textResize");

YAHOO.widget.Module.prototype = {
	/**
	* The class's constructor function
	* @property contructor
	* @type Function
	*/
	constructor : YAHOO.widget.Module,

	/**
	* The main module element that contains the header, body, and footer
	* @property element
	* @type HTMLElement
	*/
	element : null,

	/**
	* The header element, denoted with CSS class "hd"
	* @property header
	* @type HTMLElement
	*/
	header : null,

	/**
	* The body element, denoted with CSS class "bd"
	* @property body
	* @type HTMLElement
	*/
	body : null,

	/**
	* The footer element, denoted with CSS class "ft"
	* @property footer
	* @type HTMLElement
	*/
	footer : null,

	/**
	* The id of the element
	* @property id
	* @type String
	*/
	id : null,

	/**
	* The String representing the image root
	* @property imageRoot
	* @type String
	*/
	imageRoot : YAHOO.widget.Module.IMG_ROOT,

	/**
	* Initializes the custom events for Module which are fired automatically at appropriate times by the Module class.
	* @method initEvents
	*/
	initEvents : function() {

		/**
		* CustomEvent fired prior to class initalization.
		* @event beforeInitEvent
		* @param {class} classRef	class reference of the initializing class, such as this.beforeInitEvent.fire(YAHOO.widget.Module)
		*/
		this.beforeInitEvent = new YAHOO.util.CustomEvent("beforeInit");

		/**
		* CustomEvent fired after class initalization.
		* @event initEvent
		* @param {class} classRef	class reference of the initializing class, such as this.beforeInitEvent.fire(YAHOO.widget.Module)
		*/
		this.initEvent = new YAHOO.util.CustomEvent("init");

		/**
		* CustomEvent fired when the Module is appended to the DOM
		* @event appendEvent
		*/
		this.appendEvent = new YAHOO.util.CustomEvent("append");

		/**
		* CustomEvent fired before the Module is rendered
		* @event beforeRenderEvent
		*/
		this.beforeRenderEvent = new YAHOO.util.CustomEvent("beforeRender");

		/**
		* CustomEvent fired after the Module is rendered
		* @event renderEvent
		*/
		this.renderEvent = new YAHOO.util.CustomEvent("render");

		/**
		* CustomEvent fired when the header content of the Module is modified
		* @event changeHeaderEvent
		* @param {String/HTMLElement} content	String/element representing the new header content
		*/
		this.changeHeaderEvent = new YAHOO.util.CustomEvent("changeHeader");

		/**
		* CustomEvent fired when the body content of the Module is modified
		* @event changeBodyEvent
		* @param {String/HTMLElement} content	String/element representing the new body content
		*/
		this.changeBodyEvent = new YAHOO.util.CustomEvent("changeBody");

		/**
		* CustomEvent fired when the footer content of the Module is modified
		* @event changeFooterEvent
		* @param {String/HTMLElement} content	String/element representing the new footer content
		*/
		this.changeFooterEvent = new YAHOO.util.CustomEvent("changeFooter");

		/**
		* CustomEvent fired when the content of the Module is modified
		* @event changeContentEvent
		*/
		this.changeContentEvent = new YAHOO.util.CustomEvent("changeContent");

		/**
		* CustomEvent fired when the Module is destroyed
		* @event destroyEvent
		*/
		this.destroyEvent = new YAHOO.util.CustomEvent("destroy");

		/**
		* CustomEvent fired before the Module is shown
		* @event beforeShowEvent
		*/
		this.beforeShowEvent = new YAHOO.util.CustomEvent("beforeShow");

		/**
		* CustomEvent fired after the Module is shown
		* @event showEvent
		*/
		this.showEvent = new YAHOO.util.CustomEvent("show");

		/**
		* CustomEvent fired before the Module is hidden
		* @event beforeHideEvent
		*/
		this.beforeHideEvent = new YAHOO.util.CustomEvent("beforeHide");

		/**
		* CustomEvent fired after the Module is hidden
		* @event hideEvent
		*/
		this.hideEvent = new YAHOO.util.CustomEvent("hide");
	},

	/**
	* String representing the current user-agent platform
	* @property platform
	* @type String
	*/
	platform : function() {
					var ua = navigator.userAgent.toLowerCase();
					if (ua.indexOf("windows") != -1 || ua.indexOf("win32") != -1) {
						return "windows";
					} else if (ua.indexOf("macintosh") != -1) {
						return "mac";
					} else {
						return false;
					}
				}(),

	/**
	* String representing the current user-agent browser
	* @property browser
	* @type String
	*/
	browser : function() {
			var ua = navigator.userAgent.toLowerCase();
				  if (ua.indexOf('opera')!=-1) { // Opera (check first in case of spoof)
					 return 'opera';
				  } else if (ua.indexOf('msie 7')!=-1) { // IE7
					 return 'ie7';
				  } else if (ua.indexOf('msie') !=-1) { // IE
					 return 'ie';
				  } else if (ua.indexOf('safari')!=-1) { // Safari (check before Gecko because it includes "like Gecko")
					 return 'safari';
				  } else if (ua.indexOf('gecko') != -1) { // Gecko
					 return 'gecko';
				  } else {
					 return false;
				  }
			}(),

	/**
	* Boolean representing whether or not the current browsing context is secure (https)
	* @property isSecure
	* @type Boolean
	*/
	isSecure : function() {
		if (window.location.href.toLowerCase().indexOf("https") === 0) {
			return true;
		} else {
			return false;
		}
	}(),

	/**
	* Initializes the custom events for Module which are fired automatically at appropriate times by the Module class.
	*/
	initDefaultConfig : function() {
		// Add properties //

		/**
		* Specifies whether the Module is visible on the page.
		* @config visible
		* @type Boolean
		* @default true
		*/
		this.cfg.addProperty("visible", { value:true, handler:this.configVisible, validator:this.cfg.checkBoolean } );

		/**
		* Object or array of objects representing the ContainerEffect classes that are active for animating the container.
		* @config effect
		* @type Object
		* @default null
		*/
		this.cfg.addProperty("effect", { suppressEvent:true, supercedes:["visible"] } );

		/**
		* Specifies whether to create a special proxy iframe to monitor for user font resizing in the document
		* @config monitorresize
		* @type Boolean
		* @default true
		*/
		this.cfg.addProperty("monitorresize", { value:true, handler:this.configMonitorResize } );
	},

	/**
	* The Module class's initialization method, which is executed for Module and all of its subclasses. This method is automatically called by the constructor, and  sets up all DOM references for pre-existing markup, and creates required markup if it is not already present.
	* @method init
	* @param {String}	el	The element ID representing the Module <em>OR</em>
	* @param {HTMLElement}	el	The element representing the Module
	* @param {Object}	userConfig	The configuration Object literal containing the configuration that should be set for this module. See configuration documentation for more details.
	*/
	init : function(el, userConfig) {

		this.initEvents();

		this.beforeInitEvent.fire(YAHOO.widget.Module);

		/**
		* The Module's Config object used for monitoring configuration properties.
		* @property cfg
		* @type YAHOO.util.Config
		*/
		this.cfg = new YAHOO.util.Config(this);

		if (this.isSecure) {
			this.imageRoot = YAHOO.widget.Module.IMG_ROOT_SSL;
		}

		if (typeof el == "string") {
			var elId = el;

			el = document.getElementById(el);
			if (! el) {
				el = document.createElement("div");
				el.id = elId;
			}
		}

		this.element = el;

		if (el.id) {
			this.id = el.id;
		}

		var childNodes = this.element.childNodes;

		if (childNodes) {
			for (var i=0;i<childNodes.length;i++) {
				var child = childNodes[i];
				switch (child.className) {
					case YAHOO.widget.Module.CSS_HEADER:
						this.header = child;
						break;
					case YAHOO.widget.Module.CSS_BODY:
						this.body = child;
						break;
					case YAHOO.widget.Module.CSS_FOOTER:
						this.footer = child;
						break;
				}
			}
		}

		this.initDefaultConfig();

		YAHOO.util.Dom.addClass(this.element, YAHOO.widget.Module.CSS_MODULE);

		if (userConfig) {
			this.cfg.applyConfig(userConfig, true);
		}

		// Subscribe to the fireQueue() method of Config so that any queued configuration changes are
		// excecuted upon render of the Module
		if (! YAHOO.util.Config.alreadySubscribed(this.renderEvent, this.cfg.fireQueue, this.cfg)) {
			this.renderEvent.subscribe(this.cfg.fireQueue, this.cfg, true);
		}

		this.initEvent.fire(YAHOO.widget.Module);
	},

	/**
	* Initialized an empty IFRAME that is placed out of the visible area that can be used to detect text resize.
	* @method initResizeMonitor
	*/
	initResizeMonitor : function() {

        if(this.browser != "opera") {

            var resizeMonitor = document.getElementById("_yuiResizeMonitor");

            if (! resizeMonitor) {

                resizeMonitor = document.createElement("iframe");

                var bIE = (this.browser.indexOf("ie") === 0);

                if(this.isSecure && YAHOO.widget.Module.RESIZE_MONITOR_SECURE_URL && bIE) {
                   resizeMonitor.src = YAHOO.widget.Module.RESIZE_MONITOR_SECURE_URL;
                }

                resizeMonitor.id = "_yuiResizeMonitor";
                resizeMonitor.style.visibility = "hidden";

                document.body.appendChild(resizeMonitor);

                resizeMonitor.style.width = "10em";
                resizeMonitor.style.height = "10em";
                resizeMonitor.style.position = "absolute";

                var nLeft = -1 * resizeMonitor.offsetWidth;
                var nTop = -1 * resizeMonitor.offsetHeight;

                resizeMonitor.style.top = nTop + "px";
                resizeMonitor.style.left = nLeft + "px";
                resizeMonitor.style.borderStyle = "none";
                resizeMonitor.style.borderWidth = "0";
                YAHOO.util.Dom.setStyle(resizeMonitor, "opacity", "0");

                resizeMonitor.style.visibility = "visible";

                if(!bIE) {

                    var doc = resizeMonitor.contentWindow.document;

                    doc.open();
                    doc.close();

                }
            }

			var fireTextResize = function() {
				YAHOO.widget.Module.textResizeEvent.fire();
			};

            if(resizeMonitor && resizeMonitor.contentWindow) {
                this.resizeMonitor = resizeMonitor;

				YAHOO.widget.Module.textResizeEvent.subscribe(this.onDomResize, this, true);

				if (! YAHOO.widget.Module.textResizeInitialized) {
					if (! YAHOO.util.Event.addListener(this.resizeMonitor.contentWindow, "resize", fireTextResize)) {
						// This will fail in IE if document.domain has changed, so we must change the listener to
						// use the resizeMonitor element instead
						YAHOO.util.Event.addListener(this.resizeMonitor, "resize", fireTextResize);
					}
					YAHOO.widget.Module.textResizeInitialized = true;
				}
            }

        }

	},

	/**
	* Event handler fired when the resize monitor element is resized.
	* @method onDomResize
	* @param {DOMEvent} e	The DOM resize event
	* @param {Object} obj	The scope object passed to the handler
	*/
	onDomResize : function(e, obj) {

        var nLeft = -1 * this.resizeMonitor.offsetWidth,
            nTop = -1 * this.resizeMonitor.offsetHeight;

        this.resizeMonitor.style.top = nTop + "px";
        this.resizeMonitor.style.left =  nLeft + "px";

	},

	/**
	* Sets the Module's header content to the HTML specified, or appends the passed element to the header. If no header is present, one will be automatically created.
	* @method setHeader
	* @param {String}	headerContent	The HTML used to set the header <em>OR</em>
	* @param {HTMLElement}	headerContent	The HTMLElement to append to the header
	*/
	setHeader : function(headerContent) {
		if (! this.header) {
			this.header = document.createElement("div");
			this.header.className = YAHOO.widget.Module.CSS_HEADER;
		}

		if (typeof headerContent == "string") {
			this.header.innerHTML = headerContent;
		} else {
			this.header.innerHTML = "";
			this.header.appendChild(headerContent);
		}

		this.changeHeaderEvent.fire(headerContent);
		this.changeContentEvent.fire();
	},

	/**
	* Appends the passed element to the header. If no header is present, one will be automatically created.
	* @method appendToHeader
	* @param {HTMLElement}	element	The element to append to the header
	*/
	appendToHeader : function(element) {
		if (! this.header) {
			this.header = document.createElement("div");
			this.header.className = YAHOO.widget.Module.CSS_HEADER;
		}

		this.header.appendChild(element);
		this.changeHeaderEvent.fire(element);
		this.changeContentEvent.fire();
	},

	/**
	* Sets the Module's body content to the HTML specified, or appends the passed element to the body. If no body is present, one will be automatically created.
	* @method setBody
	* @param {String}	bodyContent	The HTML used to set the body <em>OR</em>
	* @param {HTMLElement}	bodyContent	The HTMLElement to append to the body
	*/
	setBody : function(bodyContent) {
		if (! this.body) {
			this.body = document.createElement("div");
			this.body.className = YAHOO.widget.Module.CSS_BODY;
		}

		if (typeof bodyContent == "string")
		{
			this.body.innerHTML = bodyContent;
		} else {
			this.body.innerHTML = "";
			this.body.appendChild(bodyContent);
		}

		this.changeBodyEvent.fire(bodyContent);
		this.changeContentEvent.fire();
	},

	/**
	* Appends the passed element to the body. If no body is present, one will be automatically created.
	* @method appendToBody
	* @param {HTMLElement}	element	The element to append to the body
	*/
	appendToBody : function(element) {
		if (! this.body) {
			this.body = document.createElement("div");
			this.body.className = YAHOO.widget.Module.CSS_BODY;
		}

		this.body.appendChild(element);
		this.changeBodyEvent.fire(element);
		this.changeContentEvent.fire();
	},

	/**
	* Sets the Module's footer content to the HTML specified, or appends the passed element to the footer. If no footer is present, one will be automatically created.
	* @method setFooter
	* @param {String}	footerContent	The HTML used to set the footer <em>OR</em>
	* @param {HTMLElement}	footerContent	The HTMLElement to append to the footer
	*/
	setFooter : function(footerContent) {
		if (! this.footer) {
			this.footer = document.createElement("div");
			this.footer.className = YAHOO.widget.Module.CSS_FOOTER;
		}

		if (typeof footerContent == "string") {
			this.footer.innerHTML = footerContent;
		} else {
			this.footer.innerHTML = "";
			this.footer.appendChild(footerContent);
		}

		this.changeFooterEvent.fire(footerContent);
		this.changeContentEvent.fire();
	},

	/**
	* Appends the passed element to the footer. If no footer is present, one will be automatically created.
	* @method appendToFooter
	* @param {HTMLElement}	element	The element to append to the footer
	*/
	appendToFooter : function(element) {
		if (! this.footer) {
			this.footer = document.createElement("div");
			this.footer.className = YAHOO.widget.Module.CSS_FOOTER;
		}

		this.footer.appendChild(element);
		this.changeFooterEvent.fire(element);
		this.changeContentEvent.fire();
	},

	/**
	* Renders the Module by inserting the elements that are not already in the main Module into their correct places. Optionally appends the Module to the specified node prior to the render's execution. NOTE: For Modules without existing markup, the appendToNode argument is REQUIRED. If this argument is ommitted and the current element is not present in the document, the function will return false, indicating that the render was a failure.
	* @method render
	* @param {String}	appendToNode	The element id to which the Module should be appended to prior to rendering <em>OR</em>
	* @param {HTMLElement}	appendToNode	The element to which the Module should be appended to prior to rendering
	* @param {HTMLElement}	moduleElement	OPTIONAL. The element that represents the actual Standard Module container.
	* @return {Boolean} Success or failure of the render
	*/
	render : function(appendToNode, moduleElement) {
		this.beforeRenderEvent.fire();

		if (! moduleElement) {
			moduleElement = this.element;
		}

		var me = this;
		var appendTo = function(element) {
			if (typeof element == "string") {
				element = document.getElementById(element);
			}

			if (element) {
				element.appendChild(me.element);
				me.appendEvent.fire();
			}
		};

		if (appendToNode) {
			appendTo(appendToNode);
		} else { // No node was passed in. If the element is not pre-marked up, this fails
			if (! YAHOO.util.Dom.inDocument(this.element)) {
				return false;
			}
		}

		// Need to get everything into the DOM if it isn't already

		if (this.header && ! YAHOO.util.Dom.inDocument(this.header)) {
			// There is a header, but it's not in the DOM yet... need to add it
			var firstChild = moduleElement.firstChild;
			if (firstChild) { // Insert before first child if exists
				moduleElement.insertBefore(this.header, firstChild);
			} else { // Append to empty body because there are no children
				moduleElement.appendChild(this.header);
			}
		}

		if (this.body && ! YAHOO.util.Dom.inDocument(this.body)) {
			// There is a body, but it's not in the DOM yet... need to add it
			if (this.footer && YAHOO.util.Dom.isAncestor(this.moduleElement, this.footer)) { // Insert before footer if exists in DOM
				moduleElement.insertBefore(this.body, this.footer);
			} else { // Append to element because there is no footer
				moduleElement.appendChild(this.body);
			}
		}

		if (this.footer && ! YAHOO.util.Dom.inDocument(this.footer)) {
			// There is a footer, but it's not in the DOM yet... need to add it
			moduleElement.appendChild(this.footer);
		}

		this.renderEvent.fire();
		return true;
	},

	/**
	* Removes the Module element from the DOM and sets all child elements to null.
	* @method destroy
	*/
	destroy : function() {
		var parent;

		if (this.element) {
			YAHOO.util.Event.purgeElement(this.element, true);
			parent = this.element.parentNode;
		}
		if (parent) {
			parent.removeChild(this.element);
		}

		this.element = null;
		this.header = null;
		this.body = null;
		this.footer = null;

		for (var e in this) {
			if (e instanceof YAHOO.util.CustomEvent) {
				e.unsubscribeAll();
			}
		}

		YAHOO.widget.Module.textResizeEvent.unsubscribe(this.onDomResize, this);

		this.destroyEvent.fire();
	},

	/**
	* Shows the Module element by setting the visible configuration property to true. Also fires two events: beforeShowEvent prior to the visibility change, and showEvent after.
	* @method show
	*/
	show : function() {
		this.cfg.setProperty("visible", true);
	},

	/**
	* Hides the Module element by setting the visible configuration property to false. Also fires two events: beforeHideEvent prior to the visibility change, and hideEvent after.
	* @method hide
	*/
	hide : function() {
		this.cfg.setProperty("visible", false);
	},

	// BUILT-IN EVENT HANDLERS FOR MODULE //

	/**
	* Default event handler for changing the visibility property of a Module. By default, this is achieved by switching the "display" style between "block" and "none".
	* This method is responsible for firing showEvent and hideEvent.
	* @param {String} type	The CustomEvent type (usually the property name)
	* @param {Object[]}	args	The CustomEvent arguments. For configuration handlers, args[0] will equal the newly applied value for the property.
	* @param {Object} obj	The scope object. For configuration handlers, this will usually equal the owner.
	* @method configVisible
	*/
	configVisible : function(type, args, obj) {
		var visible = args[0];
		if (visible) {
			this.beforeShowEvent.fire();
			YAHOO.util.Dom.setStyle(this.element, "display", "block");
			this.showEvent.fire();
		} else {
			this.beforeHideEvent.fire();
			YAHOO.util.Dom.setStyle(this.element, "display", "none");
			this.hideEvent.fire();
		}
	},

	/**
	* Default event handler for the "monitorresize" configuration property
	* @param {String} type	The CustomEvent type (usually the property name)
	* @param {Object[]}	args	The CustomEvent arguments. For configuration handlers, args[0] will equal the newly applied value for the property.
	* @param {Object} obj	The scope object. For configuration handlers, this will usually equal the owner.
	* @method configMonitorResize
	*/
	configMonitorResize : function(type, args, obj) {
		var monitor = args[0];
		if (monitor) {
			this.initResizeMonitor();
		} else {
			YAHOO.widget.Module.textResizeEvent.unsubscribe(this.onDomResize, this, true);
			this.resizeMonitor = null;
		}
	}
};

/**
* Returns a String representation of the Object.
* @method toString
* @return {String}	The string representation of the Module
*/
YAHOO.widget.Module.prototype.toString = function() {
	return "Module " + this.id;
};

/**
* Overlay is a Module that is absolutely positioned above the page flow. It has convenience methods for positioning and sizing, as well as options for controlling zIndex and constraining the Overlay's position to the current visible viewport. Overlay also contains a dynamicly generated IFRAME which is placed beneath it for Internet Explorer 6 and 5.x so that it will be properly rendered above SELECT elements.
* @namespace YAHOO.widget
* @class Overlay
* @extends YAHOO.widget.Module
* @param {String}	el	The element ID representing the Overlay <em>OR</em>
* @param {HTMLElement}	el	The element representing the Overlay
* @param {Object}	userConfig	The configuration object literal containing 10/23/2006the configuration that should be set for this Overlay. See configuration documentation for more details.
* @constructor
*/
YAHOO.widget.Overlay = function(el, userConfig) {
	YAHOO.widget.Overlay.superclass.constructor.call(this, el, userConfig);
};

YAHOO.extend(YAHOO.widget.Overlay, YAHOO.widget.Module);

/**
* The URL that will be placed in the iframe
* @property YAHOO.widget.Overlay.IFRAME_SRC
* @static
* @final
* @type String
*/
YAHOO.widget.Overlay.IFRAME_SRC = "javascript:false;";

/**
* Constant representing the top left corner of an element, used for configuring the context element alignment
* @property YAHOO.widget.Overlay.TOP_LEFT
* @static
* @final
* @type String
*/
YAHOO.widget.Overlay.TOP_LEFT = "tl";

/**
* Constant representing the top right corner of an element, used for configuring the context element alignment
* @property YAHOO.widget.Overlay.TOP_RIGHT
* @static
* @final
* @type String
*/
YAHOO.widget.Overlay.TOP_RIGHT = "tr";

/**
* Constant representing the top bottom left corner of an element, used for configuring the context element alignment
* @property YAHOO.widget.Overlay.BOTTOM_LEFT
* @static
* @final
* @type String
*/
YAHOO.widget.Overlay.BOTTOM_LEFT = "bl";

/**
* Constant representing the bottom right corner of an element, used for configuring the context element alignment
* @property YAHOO.widget.Overlay.BOTTOM_RIGHT
* @static
* @final
* @type String
*/
YAHOO.widget.Overlay.BOTTOM_RIGHT = "br";

/**
* Constant representing the default CSS class used for an Overlay
* @property YAHOO.widget.Overlay.CSS_OVERLAY
* @static
* @final
* @type String
*/
YAHOO.widget.Overlay.CSS_OVERLAY = "yui-overlay";

/**
* The Overlay initialization method, which is executed for Overlay and all of its subclasses. This method is automatically called by the constructor, and  sets up all DOM references for pre-existing markup, and creates required markup if it is not already present.
* @method init
* @param {String}	el	The element ID representing the Overlay <em>OR</em>
* @param {HTMLElement}	el	The element representing the Overlay
* @param {Object}	userConfig	The configuration object literal containing the configuration that should be set for this Overlay. See configuration documentation for more details.
*/
YAHOO.widget.Overlay.prototype.init = function(el, userConfig) {
	YAHOO.widget.Overlay.superclass.init.call(this, el/*, userConfig*/);  // Note that we don't pass the user config in here yet because we only want it executed once, at the lowest subclass level

	this.beforeInitEvent.fire(YAHOO.widget.Overlay);

	YAHOO.util.Dom.addClass(this.element, YAHOO.widget.Overlay.CSS_OVERLAY);

	if (userConfig) {
		this.cfg.applyConfig(userConfig, true);
	}

	if (this.platform == "mac" && this.browser == "gecko") {
		if (! YAHOO.util.Config.alreadySubscribed(this.showEvent,this.showMacGeckoScrollbars,this)) {
			this.showEvent.subscribe(this.showMacGeckoScrollbars,this,true);
		}
		if (! YAHOO.util.Config.alreadySubscribed(this.hideEvent,this.hideMacGeckoScrollbars,this)) {
			this.hideEvent.subscribe(this.hideMacGeckoScrollbars,this,true);
		}
	}

	this.initEvent.fire(YAHOO.widget.Overlay);

};

/**
* Initializes the custom events for Overlay which are fired automatically at appropriate times by the Overlay class.
* @method initEvents
*/
YAHOO.widget.Overlay.prototype.initEvents = function() {
	YAHOO.widget.Overlay.superclass.initEvents.call(this);

	/**
	* CustomEvent fired before the Overlay is moved.
	* @event beforeMoveEvent
	* @param {Number} x	x coordinate
	* @param {Number} y	y coordinate
	*/
	this.beforeMoveEvent = new YAHOO.util.CustomEvent("beforeMove", this);

	/**
	* CustomEvent fired after the Overlay is moved.
	* @event moveEvent
	* @param {Number} x	x coordinate
	* @param {Number} y	y coordinate
	*/
	this.moveEvent = new YAHOO.util.CustomEvent("move", this);
};

/**
* Initializes the class's configurable properties which can be changed using the Overlay's Config object (cfg).
* @method initDefaultConfig
*/
YAHOO.widget.Overlay.prototype.initDefaultConfig = function() {
	YAHOO.widget.Overlay.superclass.initDefaultConfig.call(this);

	// Add overlay config properties //

	/**
	* The absolute x-coordinate position of the Overlay
	* @config x
	* @type Number
	* @default null
	*/
	this.cfg.addProperty("x", { handler:this.configX, validator:this.cfg.checkNumber, suppressEvent:true, supercedes:["iframe"] } );

	/**
	* The absolute y-coordinate position of the Overlay
	* @config y
	* @type Number
	* @default null
	*/
	this.cfg.addProperty("y", { handler:this.configY, validator:this.cfg.checkNumber, suppressEvent:true, supercedes:["iframe"] } );

	/**
	* An array with the absolute x and y positions of the Overlay
	* @config xy
	* @type Number[]
	* @default null
	*/
	this.cfg.addProperty("xy",{ handler:this.configXY, suppressEvent:true, supercedes:["iframe"] } );

	/**
	* The array of context arguments for context-sensitive positioning. The format is: [id or element, element corner, context corner]. For example, setting this property to ["img1", "tl", "bl"] would align the Overlay's top left corner to the context element's bottom left corner.
	* @config context
	* @type Array
	* @default null
	*/
	this.cfg.addProperty("context",	{ handler:this.configContext, suppressEvent:true, supercedes:["iframe"] } );

	/**
	* True if the Overlay should be anchored to the center of the viewport.
	* @config fixedcenter
	* @type Boolean
	* @default false
	*/
	this.cfg.addProperty("fixedcenter", { value:false, handler:this.configFixedCenter, validator:this.cfg.checkBoolean, supercedes:["iframe","visible"] } );

	/**
	* CSS width of the Overlay.
	* @config width
	* @type String
	* @default null
	*/
	this.cfg.addProperty("width", { handler:this.configWidth, suppressEvent:true, supercedes:["iframe"] } );

	/**
	* CSS height of the Overlay.
	* @config height
	* @type String
	* @default null
	*/
	this.cfg.addProperty("height", { handler:this.configHeight, suppressEvent:true, supercedes:["iframe"] } );

	/**
	* CSS z-index of the Overlay.
	* @config zIndex
	* @type Number
	* @default null
	*/
	this.cfg.addProperty("zIndex", { value:null, handler:this.configzIndex } );

	/**
	* True if the Overlay should be prevented from being positioned out of the viewport.
	* @config constraintoviewport
	* @type Boolean
	* @default false
	*/
	this.cfg.addProperty("constraintoviewport", { value:false, handler:this.configConstrainToViewport, validator:this.cfg.checkBoolean, supercedes:["iframe","x","y","xy"] } );

	/**
	* True if the Overlay should have an IFRAME shim (for correcting the select z-index bug in IE6 and below).
	* @config iframe
	* @type Boolean
	* @default true for IE6 and below, false for all others
	*/
	this.cfg.addProperty("iframe", { value:(this.browser == "ie" ? true : false), handler:this.configIframe, validator:this.cfg.checkBoolean, supercedes:["zIndex"] } );
};

/**
* Moves the Overlay to the specified position. This function is identical to calling this.cfg.setProperty("xy", [x,y]);
* @method moveTo
* @param {Number}	x	The Overlay's new x position
* @param {Number}	y	The Overlay's new y position
*/
YAHOO.widget.Overlay.prototype.moveTo = function(x, y) {
	this.cfg.setProperty("xy",[x,y]);
};

/**
* Adds a special CSS class to the Overlay when Mac/Gecko is in use, to work around a Gecko bug where
* scrollbars cannot be hidden. See https://bugzilla.mozilla.org/show_bug.cgi?id=187435
* @method hideMacGeckoScrollbars
*/
YAHOO.widget.Overlay.prototype.hideMacGeckoScrollbars = function() {
	YAHOO.util.Dom.removeClass(this.element, "show-scrollbars");
	YAHOO.util.Dom.addClass(this.element, "hide-scrollbars");
};

/**
* Removes a special CSS class from the Overlay when Mac/Gecko is in use, to work around a Gecko bug where
* scrollbars cannot be hidden. See https://bugzilla.mozilla.org/show_bug.cgi?id=187435
* @method showMacGeckoScrollbars
*/
YAHOO.widget.Overlay.prototype.showMacGeckoScrollbars = function() {
	YAHOO.util.Dom.removeClass(this.element, "hide-scrollbars");
	YAHOO.util.Dom.addClass(this.element, "show-scrollbars");
};

// BEGIN BUILT-IN PROPERTY EVENT HANDLERS //

/**
* The default event handler fired when the "visible" property is changed. This method is responsible for firing showEvent and hideEvent.
* @method configVisible
* @param {String} type	The CustomEvent type (usually the property name)
* @param {Object[]}	args	The CustomEvent arguments. For configuration handlers, args[0] will equal the newly applied value for the property.
* @param {Object} obj	The scope object. For configuration handlers, this will usually equal the owner.
*/
YAHOO.widget.Overlay.prototype.configVisible = function(type, args, obj) {
	var visible = args[0];
	var currentVis = YAHOO.util.Dom.getStyle(this.element, "visibility");

	if (currentVis == "inherit") {
		var e = this.element.parentNode;
		while (e.nodeType != 9 && e.nodeType != 11) {
			currentVis = YAHOO.util.Dom.getStyle(e, "visibility");
			if (currentVis != "inherit") { break; }
			e = e.parentNode;
		}
		if (currentVis == "inherit") {
			currentVis = "visible";
		}
	}

	var effect = this.cfg.getProperty("effect");

	var effectInstances = [];
	if (effect) {
		if (effect instanceof Array) {
			for (var i=0;i<effect.length;i++) {
				var eff = effect[i];
				effectInstances[effectInstances.length] = eff.effect(this, eff.duration);
			}
		} else {
			effectInstances[effectInstances.length] = effect.effect(this, effect.duration);
		}
	}

	var isMacGecko = (this.platform == "mac" && this.browser == "gecko");

	if (visible) { // Show
		if (isMacGecko) {
			this.showMacGeckoScrollbars();
		}

		if (effect) { // Animate in
			if (visible) { // Animate in if not showing
				if (currentVis != "visible" || currentVis === "") {
					this.beforeShowEvent.fire();
					for (var j=0;j<effectInstances.length;j++) {
						var ei = effectInstances[j];
						if (j === 0 && ! YAHOO.util.Config.alreadySubscribed(ei.animateInCompleteEvent,this.showEvent.fire,this.showEvent)) {
							ei.animateInCompleteEvent.subscribe(this.showEvent.fire,this.showEvent,true); // Delegate showEvent until end of animateInComplete
						}
						ei.animateIn();
					}
				}
			}
		} else { // Show
			if (currentVis != "visible" || currentVis === "") {
				this.beforeShowEvent.fire();
				YAHOO.util.Dom.setStyle(this.element, "visibility", "visible");
				this.cfg.refireEvent("iframe");
				this.showEvent.fire();
			}
		}

	} else { // Hide
		if (isMacGecko) {
			this.hideMacGeckoScrollbars();
		}

		if (effect) { // Animate out if showing
			if (currentVis == "visible") {
				this.beforeHideEvent.fire();
				for (var k=0;k<effectInstances.length;k++) {
					var h = effectInstances[k];
					if (k === 0 && ! YAHOO.util.Config.alreadySubscribed(h.animateOutCompleteEvent,this.hideEvent.fire,this.hideEvent)) {
						h.animateOutCompleteEvent.subscribe(this.hideEvent.fire,this.hideEvent,true); // Delegate hideEvent until end of animateOutComplete
					}
					h.animateOut();
				}
			} else if (currentVis === "") {
				YAHOO.util.Dom.setStyle(this.element, "visibility", "hidden");
			}
		} else { // Simple hide
			if (currentVis == "visible" || currentVis === "") {
				this.beforeHideEvent.fire();
				YAHOO.util.Dom.setStyle(this.element, "visibility", "hidden");
				this.cfg.refireEvent("iframe");
				this.hideEvent.fire();
			}
		}
	}
};

/**
* Center event handler used for centering on scroll/resize, but only if the Overlay is visible
* @method doCenterOnDOMEvent
*/
YAHOO.widget.Overlay.prototype.doCenterOnDOMEvent = function() {
	if (this.cfg.getProperty("visible")) {
		this.center();
	}
};

/**
* The default event handler fired when the "fixedcenter" property is changed.
* @method configFixedCenter
* @param {String} type	The CustomEvent type (usually the property name)
* @param {Object[]}	args	The CustomEvent arguments. For configuration handlers, args[0] will equal the newly applied value for the property.
* @param {Object} obj	The scope object. For configuration handlers, this will usually equal the owner.
*/
YAHOO.widget.Overlay.prototype.configFixedCenter = function(type, args, obj) {
	var val = args[0];

	if (val) {
		this.center();

		if (! YAHOO.util.Config.alreadySubscribed(this.beforeShowEvent, this.center, this)) {
			this.beforeShowEvent.subscribe(this.center, this, true);
		}

		if (! YAHOO.util.Config.alreadySubscribed(YAHOO.widget.Overlay.windowResizeEvent, this.doCenterOnDOMEvent, this)) {
			YAHOO.widget.Overlay.windowResizeEvent.subscribe(this.doCenterOnDOMEvent, this, true);
		}

		if (! YAHOO.util.Config.alreadySubscribed(YAHOO.widget.Overlay.windowScrollEvent, this.doCenterOnDOMEvent, this)) {
			YAHOO.widget.Overlay.windowScrollEvent.subscribe( this.doCenterOnDOMEvent, this, true);
		}
	} else {
		YAHOO.widget.Overlay.windowResizeEvent.unsubscribe(this.doCenterOnDOMEvent, this);
		YAHOO.widget.Overlay.windowScrollEvent.unsubscribe(this.doCenterOnDOMEvent, this);
	}
};

/**
* The default event handler fired when the "height" property is changed.
* @method configHeight
* @param {String} type	The CustomEvent type (usually the property name)
* @param {Object[]}	args	The CustomEvent arguments. For configuration handlers, args[0] will equal the newly applied value for the property.
* @param {Object} obj	The scope object. For configuration handlers, this will usually equal the owner.
*/
YAHOO.widget.Overlay.prototype.configHeight = function(type, args, obj) {
	var height = args[0];
	var el = this.element;
	YAHOO.util.Dom.setStyle(el, "height", height);
	this.cfg.refireEvent("iframe");
};

/**
* The default event handler fired when the "width" property is changed.
* @method configWidth
* @param {String} type	The CustomEvent type (usually the property name)
* @param {Object[]}	args	The CustomEvent arguments. For configuration handlers, args[0] will equal the newly applied value for the property.
* @param {Object} obj	The scope object. For configuration handlers, this will usually equal the owner.
*/
YAHOO.widget.Overlay.prototype.configWidth = function(type, args, obj) {
	var width = args[0];
	var el = this.element;
	YAHOO.util.Dom.setStyle(el, "width", width);
	this.cfg.refireEvent("iframe");
};

/**
* The default event handler fired when the "zIndex" property is changed.
* @method configzIndex
* @param {String} type	The CustomEvent type (usually the property name)
* @param {Object[]}	args	The CustomEvent arguments. For configuration handlers, args[0] will equal the newly applied value for the property.
* @param {Object} obj	The scope object. For configuration handlers, this will usually equal the owner.
*/
YAHOO.widget.Overlay.prototype.configzIndex = function(type, args, obj) {
	var zIndex = args[0];

	var el = this.element;

	if (! zIndex) {
		zIndex = YAHOO.util.Dom.getStyle(el, "zIndex");
		if (! zIndex || isNaN(zIndex)) {
			zIndex = 0;
		}
	}

	if (this.iframe) {
		if (zIndex <= 0) {
			zIndex = 1;
		}
		YAHOO.util.Dom.setStyle(this.iframe, "zIndex", (zIndex-1));
	}

	YAHOO.util.Dom.setStyle(el, "zIndex", zIndex);
	this.cfg.setProperty("zIndex", zIndex, true);
};

/**
* The default event handler fired when the "xy" property is changed.
* @method configXY
* @param {String} type	The CustomEvent type (usually the property name)
* @param {Object[]}	args	The CustomEvent arguments. For configuration handlers, args[0] will equal the newly applied value for the property.
* @param {Object} obj	The scope object. For configuration handlers, this will usually equal the owner.
*/
YAHOO.widget.Overlay.prototype.configXY = function(type, args, obj) {
	var pos = args[0];
	var x = pos[0];
	var y = pos[1];

	this.cfg.setProperty("x", x);
	this.cfg.setProperty("y", y);

	this.beforeMoveEvent.fire([x,y]);

	x = this.cfg.getProperty("x");
	y = this.cfg.getProperty("y");


	this.cfg.refireEvent("iframe");
	this.moveEvent.fire([x,y]);
};

/**
* The default event handler fired when the "x" property is changed.
* @method configX
* @param {String} type	The CustomEvent type (usually the property name)
* @param {Object[]}	args	The CustomEvent arguments. For configuration handlers, args[0] will equal the newly applied value for the property.
* @param {Object} obj	The scope object. For configuration handlers, this will usually equal the owner.
*/
YAHOO.widget.Overlay.prototype.configX = function(type, args, obj) {
	var x = args[0];
	var y = this.cfg.getProperty("y");

	this.cfg.setProperty("x", x, true);
	this.cfg.setProperty("y", y, true);

	this.beforeMoveEvent.fire([x,y]);

	x = this.cfg.getProperty("x");
	y = this.cfg.getProperty("y");

	YAHOO.util.Dom.setX(this.element, x, true);

	this.cfg.setProperty("xy", [x, y], true);

	this.cfg.refireEvent("iframe");
	this.moveEvent.fire([x, y]);
};

/**
* The default event handler fired when the "y" property is changed.
* @method configY
* @param {String} type	The CustomEvent type (usually the property name)
* @param {Object[]}	args	The CustomEvent arguments. For configuration handlers, args[0] will equal the newly applied value for the property.
* @param {Object} obj	The scope object. For configuration handlers, this will usually equal the owner.
*/
YAHOO.widget.Overlay.prototype.configY = function(type, args, obj) {
	var x = this.cfg.getProperty("x");
	var y = args[0];

	this.cfg.setProperty("x", x, true);
	this.cfg.setProperty("y", y, true);

	this.beforeMoveEvent.fire([x,y]);

	x = this.cfg.getProperty("x");
	y = this.cfg.getProperty("y");

	YAHOO.util.Dom.setY(this.element, y, true);

	this.cfg.setProperty("xy", [x, y], true);

	this.cfg.refireEvent("iframe");
	this.moveEvent.fire([x, y]);
};

/**
* Shows the iframe shim, if it has been enabled
* @method showIframe
*/
YAHOO.widget.Overlay.prototype.showIframe = function() {
	if (this.iframe) {
		this.iframe.style.display = "block";
	}
};

/**
* Hides the iframe shim, if it has been enabled
* @method hideIframe
*/
YAHOO.widget.Overlay.prototype.hideIframe = function() {
	if (this.iframe) {
		this.iframe.style.display = "none";
	}
};

/**
* The default event handler fired when the "iframe" property is changed.
* @method configIframe
* @param {String} type	The CustomEvent type (usually the property name)
* @param {Object[]}	args	The CustomEvent arguments. For configuration handlers, args[0] will equal the newly applied value for the property.
* @param {Object} obj	The scope object. For configuration handlers, this will usually equal the owner.
*/
YAHOO.widget.Overlay.prototype.configIframe = function(type, args, obj) {

	var val = args[0];

	if (val) { // IFRAME shim is enabled

		if (! YAHOO.util.Config.alreadySubscribed(this.showEvent, this.showIframe, this)) {
			this.showEvent.subscribe(this.showIframe, this, true);
		}
		if (! YAHOO.util.Config.alreadySubscribed(this.hideEvent, this.hideIframe, this)) {
			this.hideEvent.subscribe(this.hideIframe, this, true);
		}

		var x = this.cfg.getProperty("x");
		var y = this.cfg.getProperty("y");

		if (! x || ! y) {
			this.syncPosition();
			x = this.cfg.getProperty("x");
			y = this.cfg.getProperty("y");
		}


		if (! isNaN(x) && ! isNaN(y)) {
			if (! this.iframe) {
				this.iframe = document.createElement("iframe");
				if (this.isSecure) {
					this.iframe.src = YAHOO.widget.Overlay.IFRAME_SRC;
				}

				var parent = this.element.parentNode;
				if (parent) {
					parent.appendChild(this.iframe);
				} else {
					document.body.appendChild(this.iframe);
				}

				YAHOO.util.Dom.setStyle(this.iframe, "position", "absolute");
				YAHOO.util.Dom.setStyle(this.iframe, "border", "none");
				YAHOO.util.Dom.setStyle(this.iframe, "margin", "0");
				YAHOO.util.Dom.setStyle(this.iframe, "padding", "0");
				YAHOO.util.Dom.setStyle(this.iframe, "opacity", "0");
				if (this.cfg.getProperty("visible")) {
					this.showIframe();
				} else {
					this.hideIframe();
				}
			}

			var iframeDisplay = YAHOO.util.Dom.getStyle(this.iframe, "display");

			if (iframeDisplay == "none") {
				this.iframe.style.display = "block";
			}

			YAHOO.util.Dom.setXY(this.iframe, [x,y]);

			var width = this.element.clientWidth;
			var height = this.element.clientHeight;

			YAHOO.util.Dom.setStyle(this.iframe, "width", (width+2) + "px");
			YAHOO.util.Dom.setStyle(this.iframe, "height", (height+2) + "px");

			if (iframeDisplay == "none") {
				this.iframe.style.display = "none";
			}
		}
	} else {
		if (this.iframe) {
			this.iframe.style.display = "none";
		}
		this.showEvent.unsubscribe(this.showIframe, this);
		this.hideEvent.unsubscribe(this.hideIframe, this);
	}
};


/**
* The default event handler fired when the "constraintoviewport" property is changed.
* @method configConstrainToViewport
* @param {String} type	The CustomEvent type (usually the property name)
* @param {Object[]}	args	The CustomEvent arguments. For configuration handlers, args[0] will equal the newly applied value for the property.
* @param {Object} obj	The scope object. For configuration handlers, this will usually equal the owner.
*/
YAHOO.widget.Overlay.prototype.configConstrainToViewport = function(type, args, obj) {
	var val = args[0];
	if (val) {
		if (! YAHOO.util.Config.alreadySubscribed(this.beforeMoveEvent, this.enforceConstraints, this)) {
			this.beforeMoveEvent.subscribe(this.enforceConstraints, this, true);
		}
	} else {
		this.beforeMoveEvent.unsubscribe(this.enforceConstraints, this);
	}
};

/**
* The default event handler fired when the "context" property is changed.
* @method configContext
* @param {String} type	The CustomEvent type (usually the property name)
* @param {Object[]}	args	The CustomEvent arguments. For configuration handlers, args[0] will equal the newly applied value for the property.
* @param {Object} obj	The scope object. For configuration handlers, this will usually equal the owner.
*/
YAHOO.widget.Overlay.prototype.configContext = function(type, args, obj) {
	var contextArgs = args[0];

	if (contextArgs) {
		var contextEl = contextArgs[0];
		var elementMagnetCorner = contextArgs[1];
		var contextMagnetCorner = contextArgs[2];

		if (contextEl) {
			if (typeof contextEl == "string") {
				this.cfg.setProperty("context", [document.getElementById(contextEl),elementMagnetCorner,contextMagnetCorner], true);
			}

			if (elementMagnetCorner && contextMagnetCorner) {
				this.align(elementMagnetCorner, contextMagnetCorner);
			}
		}
	}
};


// END BUILT-IN PROPERTY EVENT HANDLERS //

/**
* Aligns the Overlay to its context element using the specified corner points (represented by the constants TOP_LEFT, TOP_RIGHT, BOTTOM_LEFT, and BOTTOM_RIGHT.
* @method align
* @param {String} elementAlign		The String representing the corner of the Overlay that should be aligned to the context element
* @param {String} contextAlign		The corner of the context element that the elementAlign corner should stick to.
*/
YAHOO.widget.Overlay.prototype.align = function(elementAlign, contextAlign) {
	var contextArgs = this.cfg.getProperty("context");
	if (contextArgs) {
		var context = contextArgs[0];

		var element = this.element;
		var me = this;

		if (! elementAlign) {
			elementAlign = contextArgs[1];
		}

		if (! contextAlign) {
			contextAlign = contextArgs[2];
		}

		if (element && context) {
			var contextRegion = YAHOO.util.Dom.getRegion(context);

			var doAlign = function(v,h) {
				switch (elementAlign) {
					case YAHOO.widget.Overlay.TOP_LEFT:
						me.moveTo(h,v);
						break;
					case YAHOO.widget.Overlay.TOP_RIGHT:
						me.moveTo(h-element.offsetWidth,v);
						break;
					case YAHOO.widget.Overlay.BOTTOM_LEFT:
						me.moveTo(h,v-element.offsetHeight);
						break;
					case YAHOO.widget.Overlay.BOTTOM_RIGHT:
						me.moveTo(h-element.offsetWidth,v-element.offsetHeight);
						break;
				}
			};

			switch (contextAlign) {
				case YAHOO.widget.Overlay.TOP_LEFT:
					doAlign(contextRegion.top, contextRegion.left);
					break;
				case YAHOO.widget.Overlay.TOP_RIGHT:
					doAlign(contextRegion.top, contextRegion.right);
					break;
				case YAHOO.widget.Overlay.BOTTOM_LEFT:
					doAlign(contextRegion.bottom, contextRegion.left);
					break;
				case YAHOO.widget.Overlay.BOTTOM_RIGHT:
					doAlign(contextRegion.bottom, contextRegion.right);
					break;
			}
		}
	}
};

/**
* The default event handler executed when the moveEvent is fired, if the "constraintoviewport" is set to true.
* @method enforceConstraints
* @param {String} type	The CustomEvent type (usually the property name)
* @param {Object[]}	args	The CustomEvent arguments. For configuration handlers, args[0] will equal the newly applied value for the property.
* @param {Object} obj	The scope object. For configuration handlers, this will usually equal the owner.
*/
YAHOO.widget.Overlay.prototype.enforceConstraints = function(type, args, obj) {
	var pos = args[0];

	var x = pos[0];
	var y = pos[1];

	var offsetHeight = this.element.offsetHeight;
	var offsetWidth = this.element.offsetWidth;

	var viewPortWidth = YAHOO.util.Dom.getViewportWidth();
	var viewPortHeight = YAHOO.util.Dom.getViewportHeight();

	var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
	var scrollY = document.documentElement.scrollTop || document.body.scrollTop;

	var topConstraint = scrollY + 10;
	var leftConstraint = scrollX + 10;
	var bottomConstraint = scrollY + viewPortHeight - offsetHeight - 10;
	var rightConstraint = scrollX + viewPortWidth - offsetWidth - 10;

	if (x < leftConstraint) {
		x = leftConstraint;
	} else if (x > rightConstraint) {
		x = rightConstraint;
	}

	if (y < topConstraint) {
		y = topConstraint;
	} else if (y > bottomConstraint) {
		y = bottomConstraint;
	}

	this.cfg.setProperty("x", x, true);
	this.cfg.setProperty("y", y, true);
	this.cfg.setProperty("xy", [x,y], true);
};

/**
* Centers the container in the viewport.
* @method center
*/
YAHOO.widget.Overlay.prototype.center = function() {
	var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
	var scrollY = document.documentElement.scrollTop || document.body.scrollTop;

	var viewPortWidth = YAHOO.util.Dom.getClientWidth();
	var viewPortHeight = YAHOO.util.Dom.getClientHeight();

	var elementWidth = this.element.offsetWidth;
	var elementHeight = this.element.offsetHeight;

	var x = (viewPortWidth / 2) - (elementWidth / 2) + scrollX;
	var y = (viewPortHeight / 2) - (elementHeight / 2) + scrollY;

	this.cfg.setProperty("xy", [parseInt(x, 10), parseInt(y, 10)]);

	this.cfg.refireEvent("iframe");
};

/**
* Synchronizes the Panel's "xy", "x", and "y" properties with the Panel's position in the DOM. This is primarily used to update position information during drag & drop.
* @method syncPosition
*/
YAHOO.widget.Overlay.prototype.syncPosition = function() {
	var pos = YAHOO.util.Dom.getXY(this.element);
	this.cfg.setProperty("x", pos[0], true);
	this.cfg.setProperty("y", pos[1], true);
	this.cfg.setProperty("xy", pos, true);
};

/**
* Event handler fired when the resize monitor element is resized.
* @method onDomResize
* @param {DOMEvent} e	The resize DOM event
* @param {Object} obj	The scope object
*/
YAHOO.widget.Overlay.prototype.onDomResize = function(e, obj) {
	YAHOO.widget.Overlay.superclass.onDomResize.call(this, e, obj);
	var me = this;
	setTimeout(function() {
		me.syncPosition();
		me.cfg.refireEvent("iframe");
		me.cfg.refireEvent("context");
	}, 0);
};

/**
* Removes the Overlay element from the DOM and sets all child elements to null.
* @method destroy
*/
YAHOO.widget.Overlay.prototype.destroy = function() {
	if (this.iframe) {
		this.iframe.parentNode.removeChild(this.iframe);
	}

	this.iframe = null;

	YAHOO.widget.Overlay.windowResizeEvent.unsubscribe(this.doCenterOnDOMEvent, this);
	YAHOO.widget.Overlay.windowScrollEvent.unsubscribe(this.doCenterOnDOMEvent, this);

	YAHOO.widget.Overlay.superclass.destroy.call(this);
};

/**
* Returns a String representation of the object.
* @method toString
* @return {String} The string representation of the Overlay.
*/
YAHOO.widget.Overlay.prototype.toString = function() {
	return "Overlay " + this.id;
};

/**
* A singleton CustomEvent used for reacting to the DOM event for window scroll
* @event YAHOO.widget.Overlay.windowScrollEvent
*/
YAHOO.widget.Overlay.windowScrollEvent = new YAHOO.util.CustomEvent("windowScroll");

/**
* A singleton CustomEvent used for reacting to the DOM event for window resize
* @event YAHOO.widget.Overlay.windowResizeEvent
*/
YAHOO.widget.Overlay.windowResizeEvent = new YAHOO.util.CustomEvent("windowResize");

/**
* The DOM event handler used to fire the CustomEvent for window scroll
* @method YAHOO.widget.Overlay.windowScrollHandler
* @static
* @param {DOMEvent} e The DOM scroll event
*/
YAHOO.widget.Overlay.windowScrollHandler = function(e) {
	if (YAHOO.widget.Module.prototype.browser == "ie" || YAHOO.widget.Module.prototype.browser == "ie7") {
		if (! window.scrollEnd) {
			window.scrollEnd = -1;
		}
		clearTimeout(window.scrollEnd);
		window.scrollEnd = setTimeout(function() { YAHOO.widget.Overlay.windowScrollEvent.fire(); }, 1);
	} else {
		YAHOO.widget.Overlay.windowScrollEvent.fire();
	}
};

/**
* The DOM event handler used to fire the CustomEvent for window resize
* @method YAHOO.widget.Overlay.windowResizeHandler
* @static
* @param {DOMEvent} e The DOM resize event
*/
YAHOO.widget.Overlay.windowResizeHandler = function(e) {
	if (YAHOO.widget.Module.prototype.browser == "ie" || YAHOO.widget.Module.prototype.browser == "ie7") {
		if (! window.resizeEnd) {
			window.resizeEnd = -1;
		}
		clearTimeout(window.resizeEnd);
		window.resizeEnd = setTimeout(function() { YAHOO.widget.Overlay.windowResizeEvent.fire(); }, 100);
	} else {
		YAHOO.widget.Overlay.windowResizeEvent.fire();
	}
};

/**
* A boolean that indicated whether the window resize and scroll events have already been subscribed to.
* @property YAHOO.widget.Overlay._initialized
* @private
* @type Boolean
*/
YAHOO.widget.Overlay._initialized = null;

if (YAHOO.widget.Overlay._initialized === null) {
	YAHOO.util.Event.addListener(window, "scroll", YAHOO.widget.Overlay.windowScrollHandler);
	YAHOO.util.Event.addListener(window, "resize", YAHOO.widget.Overlay.windowResizeHandler);

	YAHOO.widget.Overlay._initialized = true;
}

/**
* OverlayManager is used for maintaining the focus status of multiple Overlays.* @namespace YAHOO.widget
* @namespace YAHOO.widget
* @class OverlayManager
* @constructor
* @param {Array}	overlays	Optional. A collection of Overlays to register with the manager.
* @param {Object}	userConfig		The object literal representing the user configuration of the OverlayManager
*/
YAHOO.widget.OverlayManager = function(userConfig) {
	this.init(userConfig);
};

/**
* The CSS class representing a focused Overlay
* @property YAHOO.widget.OverlayManager.CSS_FOCUSED
* @static
* @final
* @type String
*/
YAHOO.widget.OverlayManager.CSS_FOCUSED = "focused";

YAHOO.widget.OverlayManager.prototype = {
	/**
	* The class's constructor function
	* @property contructor
	* @type Function
	*/
	constructor : YAHOO.widget.OverlayManager,

	/**
	* The array of Overlays that are currently registered
	* @property overlays
	* @type YAHOO.widget.Overlay[]
	*/
	overlays : null,

	/**
	* Initializes the default configuration of the OverlayManager
	* @method initDefaultConfig
	*/
	initDefaultConfig : function() {
		/**
		* The collection of registered Overlays in use by the OverlayManager
		* @config overlays
		* @type YAHOO.widget.Overlay[]
		* @default null
		*/
		this.cfg.addProperty("overlays", { suppressEvent:true } );

		/**
		* The default DOM event that should be used to focus an Overlay
		* @config focusevent
		* @type String
		* @default "mousedown"
		*/
		this.cfg.addProperty("focusevent", { value:"mousedown" } );
	},

	/**
	* Initializes the OverlayManager
	* @method init
	* @param {YAHOO.widget.Overlay[]}	overlays	Optional. A collection of Overlays to register with the manager.
	* @param {Object}	userConfig		The object literal representing the user configuration of the OverlayManager
	*/
	init : function(userConfig) {
		/**
		* The OverlayManager's Config object used for monitoring configuration properties.
		* @property cfg
		* @type YAHOO.util.Config
		*/
		this.cfg = new YAHOO.util.Config(this);

		this.initDefaultConfig();

		if (userConfig) {
			this.cfg.applyConfig(userConfig, true);
		}
		this.cfg.fireQueue();

		/**
		* The currently activated Overlay
		* @property activeOverlay
		* @private
		* @type YAHOO.widget.Overlay
		*/
		var activeOverlay = null;

		/**
		* Returns the currently focused Overlay
		* @method getActive
		* @return {YAHOO.widget.Overlay}	The currently focused Overlay
		*/
		this.getActive = function() {
			return activeOverlay;
		};

		/**
		* Focuses the specified Overlay
		* @method focus
		* @param {YAHOO.widget.Overlay} overlay	The Overlay to focus
		* @param {String} overlay	The id of the Overlay to focus
		*/
		this.focus = function(overlay) {
			var o = this.find(overlay);
			if (o) {
				this.blurAll();
				activeOverlay = o;
				YAHOO.util.Dom.addClass(activeOverlay.element, YAHOO.widget.OverlayManager.CSS_FOCUSED);
				this.overlays.sort(this.compareZIndexDesc);
				var topZIndex = YAHOO.util.Dom.getStyle(this.overlays[0].element, "zIndex");
				if (! isNaN(topZIndex) && this.overlays[0] != overlay) {
					activeOverlay.cfg.setProperty("zIndex", (parseInt(topZIndex, 10) + 2));
				}
				this.overlays.sort(this.compareZIndexDesc);
			}
		};

		/**
		* Removes the specified Overlay from the manager
		* @method remove
		* @param {YAHOO.widget.Overlay}	overlay	The Overlay to remove
		* @param {String} overlay	The id of the Overlay to remove
		*/
		this.remove = function(overlay) {
			var o = this.find(overlay);
			if (o) {
				var originalZ = YAHOO.util.Dom.getStyle(o.element, "zIndex");
				o.cfg.setProperty("zIndex", -1000, true);
				this.overlays.sort(this.compareZIndexDesc);
				this.overlays = this.overlays.slice(0, this.overlays.length-1);
				o.cfg.setProperty("zIndex", originalZ, true);

				o.cfg.setProperty("manager", null);
				o.focusEvent = null;
				o.blurEvent = null;
				o.focus = null;
				o.blur = null;
			}
		};

		/**
		* Removes focus from all registered Overlays in the manager
		* @method blurAll
		*/
		this.blurAll = function() {
			activeOverlay = null;
			for (var o=0;o<this.overlays.length;o++) {
				YAHOO.util.Dom.removeClass(this.overlays[o].element, YAHOO.widget.OverlayManager.CSS_FOCUSED);
			}
		};

		var overlays = this.cfg.getProperty("overlays");

		if (! this.overlays) {
			this.overlays = [];
		}

		if (overlays) {
			this.register(overlays);
			this.overlays.sort(this.compareZIndexDesc);
		}
	},

	/**
	* Registers an Overlay or an array of Overlays with the manager. Upon registration, the Overlay receives functions for focus and blur, along with CustomEvents for each.
	* @method register
	* @param {YAHOO.widget.Overlay}	overlay		An Overlay to register with the manager.
	* @param {YAHOO.widget.Overlay[]}	overlay		An array of Overlays to register with the manager.
	* @return	{Boolean}	True if any Overlays are registered.
	*/
	register : function(overlay) {
		if (overlay instanceof YAHOO.widget.Overlay) {
			overlay.cfg.addProperty("manager", { value:this } );

			overlay.focusEvent = new YAHOO.util.CustomEvent("focus");
			overlay.blurEvent = new YAHOO.util.CustomEvent("blur");

			var mgr=this;

			overlay.focus = function() {
				mgr.focus(this);
				this.focusEvent.fire();
			};

			overlay.blur = function() {
				mgr.blurAll();
				this.blurEvent.fire();
			};

			var focusOnDomEvent = function(e,obj) {
				overlay.focus();
			};

			var focusevent = this.cfg.getProperty("focusevent");
			YAHOO.util.Event.addListener(overlay.element,focusevent,focusOnDomEvent,this,true);

			var zIndex = YAHOO.util.Dom.getStyle(overlay.element, "zIndex");
			if (! isNaN(zIndex)) {
				overlay.cfg.setProperty("zIndex", parseInt(zIndex, 10));
			} else {
				overlay.cfg.setProperty("zIndex", 0);
			}

			this.overlays.push(overlay);
			return true;
		} else if (overlay instanceof Array) {
			var regcount = 0;
			for (var i=0;i<overlay.length;i++) {
				if (this.register(overlay[i])) {
					regcount++;
				}
			}
			if (regcount > 0) {
				return true;
			}
		} else {
			return false;
		}
	},

	/**
	* Attempts to locate an Overlay by instance or ID.
	* @method find
	* @param {YAHOO.widget.Overlay}	overlay		An Overlay to locate within the manager
	* @param {String}	overlay		An Overlay id to locate within the manager
	* @return	{YAHOO.widget.Overlay}	The requested Overlay, if found, or null if it cannot be located.
	*/
	find : function(overlay) {
		if (overlay instanceof YAHOO.widget.Overlay) {
			for (var o=0;o<this.overlays.length;o++) {
				if (this.overlays[o] == overlay) {
					return this.overlays[o];
				}
			}
		} else if (typeof overlay == "string") {
			for (var p=0;p<this.overlays.length;p++) {
				if (this.overlays[p].id == overlay) {
					return this.overlays[p];
				}
			}
		}
		return null;
	},

	/**
	* Used for sorting the manager's Overlays by z-index.
	* @method compareZIndexDesc
	* @private
	* @return {Number}	0, 1, or -1, depending on where the Overlay should fall in the stacking order.
	*/
	compareZIndexDesc : function(o1, o2) {
		var zIndex1 = o1.cfg.getProperty("zIndex");
		var zIndex2 = o2.cfg.getProperty("zIndex");

		if (zIndex1 > zIndex2) {
			return -1;
		} else if (zIndex1 < zIndex2) {
			return 1;
		} else {
			return 0;
		}
	},

	/**
	* Shows all Overlays in the manager.
	* @method showAll
	*/
	showAll : function() {
		for (var o=0;o<this.overlays.length;o++) {
			this.overlays[o].show();
		}
	},

	/**
	* Hides all Overlays in the manager.
	* @method hideAll
	*/
	hideAll : function() {
		for (var o=0;o<this.overlays.length;o++) {
			this.overlays[o].hide();
		}
	},

	/**
	* Returns a string representation of the object.
	* @method toString
	* @return {String}	The string representation of the OverlayManager
	*/
	toString : function() {
		return "OverlayManager";
	}

};

/**
* KeyListener is a utility that provides an easy interface for listening for keydown/keyup events fired against DOM elements.
* @namespace YAHOO.util
* @class KeyListener
* @constructor
* @param {HTMLElement}	attachTo	The element or element ID to which the key event should be attached
* @param {String}	attachTo	The element or element ID to which the key event should be attached
* @param {Object}	keyData		The object literal representing the key(s) to detect. Possible attributes are shift(boolean), alt(boolean), ctrl(boolean) and keys(either an int or an array of ints representing keycodes).
* @param {Function}	handler		The CustomEvent handler to fire when the key event is detected
* @param {Object}	handler		An object literal representing the handler.
* @param {String}	event		Optional. The event (keydown or keyup) to listen for. Defaults automatically to keydown.
*/
YAHOO.util.KeyListener = function(attachTo, keyData, handler, event) {
	if (! attachTo) {
	}
	if (! keyData) {
	}
	if (! handler) {
	}

	if (! event) {
		event = YAHOO.util.KeyListener.KEYDOWN;
	}

	/**
	* The CustomEvent fired internally when a key is pressed
	* @event keyEvent
	* @private
	* @param {Object}	keyData		The object literal representing the key(s) to detect. Possible attributes are shift(boolean), alt(boolean), ctrl(boolean) and keys(either an int or an array of ints representing keycodes).
	*/
	var keyEvent = new YAHOO.util.CustomEvent("keyPressed");

	/**
	* The CustomEvent fired when the KeyListener is enabled via the enable() function
	* @event enabledEvent
	* @param {Object}	keyData		The object literal representing the key(s) to detect. Possible attributes are shift(boolean), alt(boolean), ctrl(boolean) and keys(either an int or an array of ints representing keycodes).
	*/
	this.enabledEvent = new YAHOO.util.CustomEvent("enabled");

	/**
	* The CustomEvent fired when the KeyListener is disabled via the disable() function
	* @event disabledEvent
	* @param {Object}	keyData		The object literal representing the key(s) to detect. Possible attributes are shift(boolean), alt(boolean), ctrl(boolean) and keys(either an int or an array of ints representing keycodes).
	*/
	this.disabledEvent = new YAHOO.util.CustomEvent("disabled");

	if (typeof attachTo == 'string') {
		attachTo = document.getElementById(attachTo);
	}

	if (typeof handler == 'function') {
		keyEvent.subscribe(handler);
	} else {
		keyEvent.subscribe(handler.fn, handler.scope, handler.correctScope);
	}

	/**
	* Handles the key event when a key is pressed.
	* @method handleKeyPress
	* @param {DOMEvent} e	The keypress DOM event
	* @param {Object}	obj	The DOM event scope object
	* @private
	*/
	function handleKeyPress(e, obj) {
		if (! keyData.shift) {
			keyData.shift = false;
		}
		if (! keyData.alt) {
			keyData.alt = false;
		}
		if (! keyData.ctrl) {
			keyData.ctrl = false;
		}

		// check held down modifying keys first
		if (e.shiftKey == keyData.shift &&
			e.altKey   == keyData.alt &&
			e.ctrlKey  == keyData.ctrl) { // if we pass this, all modifiers match

			var dataItem;
			var keyPressed;

			if (keyData.keys instanceof Array) {
				for (var i=0;i<keyData.keys.length;i++) {
					dataItem = keyData.keys[i];

					if (dataItem == e.charCode ) {
						keyEvent.fire(e.charCode, e);
						break;
					} else if (dataItem == e.keyCode) {
						keyEvent.fire(e.keyCode, e);
						break;
					}
				}
			} else {
				dataItem = keyData.keys;
				if (dataItem == e.charCode ) {
					keyEvent.fire(e.charCode, e);
				} else if (dataItem == e.keyCode) {
					keyEvent.fire(e.keyCode, e);
				}
			}
		}
	}

	/**
	* Enables the KeyListener by attaching the DOM event listeners to the target DOM element
	* @method enable
	*/
	this.enable = function() {
		if (! this.enabled) {
			YAHOO.util.Event.addListener(attachTo, event, handleKeyPress);
			this.enabledEvent.fire(keyData);
		}
		/**
		* Boolean indicating the enabled/disabled state of the Tooltip
		* @property enabled
		* @type Boolean
		*/
		this.enabled = true;
	};

	/**
	* Disables the KeyListener by removing the DOM event listeners from the target DOM element
	* @method disable
	*/
	this.disable = function() {
		if (this.enabled) {
			YAHOO.util.Event.removeListener(attachTo, event, handleKeyPress);
			this.disabledEvent.fire(keyData);
		}
		this.enabled = false;
	};

	/**
	* Returns a String representation of the object.
	* @method toString
	* @return {String}	The string representation of the KeyListener
	*/
	this.toString = function() {
		return "KeyListener [" + keyData.keys + "] " + attachTo.tagName + (attachTo.id ? "[" + attachTo.id + "]" : "");
	};

};

/**
* Constant representing the DOM "keydown" event.
* @property YAHOO.util.KeyListener.KEYDOWN
* @static
* @final
* @type String
*/
YAHOO.util.KeyListener.KEYDOWN = "keydown";

/**
* Constant representing the DOM "keyup" event.
* @property YAHOO.util.KeyListener.KEYUP
* @static
* @final
* @type String
*/
YAHOO.util.KeyListener.KEYUP = "keyup";

/**
* Tooltip is an implementation of Overlay that behaves like an OS tooltip, displaying when the user mouses over a particular element, and disappearing on mouse out.
* @namespace YAHOO.widget
* @class Tooltip
* @extends YAHOO.widget.Overlay
* @constructor
* @param {String}	el	The element ID representing the Tooltip <em>OR</em>
* @param {HTMLElement}	el	The element representing the Tooltip
* @param {Object}	userConfig	The configuration object literal containing the configuration that should be set for this Overlay. See configuration documentation for more details.
*/
YAHOO.widget.Tooltip = function(el, userConfig) {
	YAHOO.widget.Tooltip.superclass.constructor.call(this, el, userConfig);
};

YAHOO.extend(YAHOO.widget.Tooltip, YAHOO.widget.Overlay);

/**
* Constant representing the Tooltip CSS class
* @property YAHOO.widget.Tooltip.CSS_TOOLTIP
* @static
* @final
* @type String
*/
YAHOO.widget.Tooltip.CSS_TOOLTIP = "yui-tt";

/**
* The Tooltip initialization method. This method is automatically called by the constructor. A Tooltip is automatically rendered by the init method, and it also is set to be invisible by default, and constrained to viewport by default as well.
* @method init
* @param {String}	el	The element ID representing the Tooltip <em>OR</em>
* @param {HTMLElement}	el	The element representing the Tooltip
* @param {Object}	userConfig	The configuration object literal containing the configuration that should be set for this Tooltip. See configuration documentation for more details.
*/
YAHOO.widget.Tooltip.prototype.init = function(el, userConfig) {

	if (document.readyState && document.readyState != "complete") {
		var deferredInit = function() {
			this.init(el, userConfig);
		};
		YAHOO.util.Event.addListener(window, "load", deferredInit, this, true);
	} else {
		YAHOO.widget.Tooltip.superclass.init.call(this, el);

		this.beforeInitEvent.fire(YAHOO.widget.Tooltip);

		YAHOO.util.Dom.addClass(this.element, YAHOO.widget.Tooltip.CSS_TOOLTIP);

		if (userConfig) {
			this.cfg.applyConfig(userConfig, true);
		}

		this.cfg.queueProperty("visible",false);
		this.cfg.queueProperty("constraintoviewport",true);

		this.setBody("");
		this.render(this.cfg.getProperty("container"));

		this.initEvent.fire(YAHOO.widget.Tooltip);
	}
};

/**
* Initializes the class's configurable properties which can be changed using the Overlay's Config object (cfg).
* @method initDefaultConfig
*/
YAHOO.widget.Tooltip.prototype.initDefaultConfig = function() {
	YAHOO.widget.Tooltip.superclass.initDefaultConfig.call(this);

	/**
	* Specifies whether the Tooltip should be kept from overlapping its context element.
	* @config preventoverlap
	* @type Boolean
	* @default true
	*/
	this.cfg.addProperty("preventoverlap",		{ value:true, validator:this.cfg.checkBoolean, supercedes:["x","y","xy"] } );

	/**
	* The number of milliseconds to wait before showing a Tooltip on mouseover.
	* @config showdelay
	* @type Number
	* @default 200
	*/
	this.cfg.addProperty("showdelay",			{ value:200, handler:this.configShowDelay, validator:this.cfg.checkNumber } );

	/**
	* The number of milliseconds to wait before automatically dismissing a Tooltip after the mouse has been resting on the context element.
	* @config autodismissdelay
	* @type Number
	* @default 5000
	*/
	this.cfg.addProperty("autodismissdelay",	{ value:5000, handler:this.configAutoDismissDelay, validator:this.cfg.checkNumber } );

	/**
	* The number of milliseconds to wait before hiding a Tooltip on mouseover.
	* @config hidedelay
	* @type Number
	* @default 250
	*/
	this.cfg.addProperty("hidedelay",			{ value:250, handler:this.configHideDelay, validator:this.cfg.checkNumber } );

	/**
	* Specifies the Tooltip's text.
	* @config text
	* @type String
	* @default null
	*/
	this.cfg.addProperty("text",				{ handler:this.configText, suppressEvent:true } );

	/**
	* Specifies the container element that the Tooltip's markup should be rendered into.
	* @config container
	* @type HTMLElement/String
	* @default document.body
	*/
	this.cfg.addProperty("container",			{ value:document.body, handler:this.configContainer } );

	/**
	* Specifies the element or elements that the Tooltip should be anchored to on mouseover.
	* @config context
	* @type HTMLElement[]/String[]
	* @default null
	*/

};

// BEGIN BUILT-IN PROPERTY EVENT HANDLERS //

/**
* The default event handler fired when the "text" property is changed.
* @method configText
* @param {String} type	The CustomEvent type (usually the property name)
* @param {Object[]}	args	The CustomEvent arguments. For configuration handlers, args[0] will equal the newly applied value for the property.
* @param {Object} obj	The scope object. For configuration handlers, this will usually equal the owner.
*/
YAHOO.widget.Tooltip.prototype.configText = function(type, args, obj) {
	var text = args[0];
	if (text) {
		this.setBody(text);
	}
};

/**
* The default event handler fired when the "container" property is changed.
* @method configContainer
* @param {String} type	The CustomEvent type (usually the property name)
* @param {Object[]}	args	The CustomEvent arguments. For configuration handlers, args[0] will equal the newly applied value for the property.
* @param {Object} obj	The scope object. For configuration handlers, this will usually equal the owner.
*/
YAHOO.widget.Tooltip.prototype.configContainer = function(type, args, obj) {
	var container = args[0];
	if (typeof container == 'string') {
		this.cfg.setProperty("container", document.getElementById(container), true);
	}
};

/**
* The default event handler fired when the "context" property is changed.
* @method configContext
* @param {String} type	The CustomEvent type (usually the property name)
* @param {Object[]}	args	The CustomEvent arguments. For configuration handlers, args[0] will equal the newly applied value for the property.
* @param {Object} obj	The scope object. For configuration handlers, this will usually equal the owner.
*/
YAHOO.widget.Tooltip.prototype.configContext = function(type, args, obj) {
	var context = args[0];
	if (context) {

		// Normalize parameter into an array
		if (! (context instanceof Array)) {
			if (typeof context == "string") {
				this.cfg.setProperty("context", [document.getElementById(context)], true);
			} else { // Assuming this is an element
				this.cfg.setProperty("context", [context], true);
			}
			context = this.cfg.getProperty("context");
		}


		// Remove any existing mouseover/mouseout listeners
		if (this._context) {
			for (var c=0;c<this._context.length;++c) {
				var el = this._context[c];
				YAHOO.util.Event.removeListener(el, "mouseover", this.onContextMouseOver);
				YAHOO.util.Event.removeListener(el, "mousemove", this.onContextMouseMove);
				YAHOO.util.Event.removeListener(el, "mouseout", this.onContextMouseOut);
			}
		}

		// Add mouseover/mouseout listeners to context elements
		this._context = context;
		for (var d=0;d<this._context.length;++d) {
			var el2 = this._context[d];
			YAHOO.util.Event.addListener(el2, "mouseover", this.onContextMouseOver, this);
			YAHOO.util.Event.addListener(el2, "mousemove", this.onContextMouseMove, this);
			YAHOO.util.Event.addListener(el2, "mouseout", this.onContextMouseOut, this);
		}
	}
};

// END BUILT-IN PROPERTY EVENT HANDLERS //

// BEGIN BUILT-IN DOM EVENT HANDLERS //

/**
* The default event handler fired when the user moves the mouse while over the context element.
* @method onContextMouseMove
* @param {DOMEvent} e	The current DOM event
* @param {Object}	obj	The object argument
*/
YAHOO.widget.Tooltip.prototype.onContextMouseMove = function(e, obj) {
	obj.pageX = YAHOO.util.Event.getPageX(e);
	obj.pageY = YAHOO.util.Event.getPageY(e);

};

/**
* The default event handler fired when the user mouses over the context element.
* @method onContextMouseOver
* @param {DOMEvent} e	The current DOM event
* @param {Object}	obj	The object argument
*/
YAHOO.widget.Tooltip.prototype.onContextMouseOver = function(e, obj) {

	if (obj.hideProcId) {
		clearTimeout(obj.hideProcId);
		obj.hideProcId = null;
	}

	var context = this;
	YAHOO.util.Event.addListener(context, "mousemove", obj.onContextMouseMove, obj);

	if (context.title) {
		obj._tempTitle = context.title;
		context.title = "";
	}

	/**
	* The unique process ID associated with the thread responsible for showing the Tooltip.
	* @type int
	*/
	obj.showProcId = obj.doShow(e, context);
};

/**
* The default event handler fired when the user mouses out of the context element.
* @method onContextMouseOut
* @param {DOMEvent} e	The current DOM event
* @param {Object}	obj	The object argument
*/
YAHOO.widget.Tooltip.prototype.onContextMouseOut = function(e, obj) {
	var el = this;

	if (obj._tempTitle) {
		el.title = obj._tempTitle;
		obj._tempTitle = null;
	}

	if (obj.showProcId) {
		clearTimeout(obj.showProcId);
		obj.showProcId = null;
	}

	if (obj.hideProcId) {
		clearTimeout(obj.hideProcId);
		obj.hideProcId = null;
	}


	obj.hideProcId = setTimeout(function() {
				obj.hide();
				}, obj.cfg.getProperty("hidedelay"));
};

// END BUILT-IN DOM EVENT HANDLERS //

/**
* Processes the showing of the Tooltip by setting the timeout delay and offset of the Tooltip.
* @method doShow
* @param {DOMEvent} e	The current DOM event
* @return {Number}	The process ID of the timeout function associated with doShow
*/
YAHOO.widget.Tooltip.prototype.doShow = function(e, context) {

	var yOffset = 25;
	if (this.browser == "opera" && context.tagName == "A") {
		yOffset += 12;
	}

	var me = this;
	return setTimeout(
		function() {
			if (me._tempTitle) {
				me.setBody(me._tempTitle);
			} else {
				me.cfg.refireEvent("text");
			}

			me.moveTo(me.pageX, me.pageY + yOffset);
			if (me.cfg.getProperty("preventoverlap")) {
				me.preventOverlap(me.pageX, me.pageY);
			}

			YAHOO.util.Event.removeListener(context, "mousemove", me.onContextMouseMove);

			me.show();
			me.hideProcId = me.doHide();
		},
	this.cfg.getProperty("showdelay"));
};

/**
* Sets the timeout for the auto-dismiss delay, which by default is 5 seconds, meaning that a tooltip will automatically dismiss itself after 5 seconds of being displayed.
* @method doHide
*/
YAHOO.widget.Tooltip.prototype.doHide = function() {
	var me = this;
	return setTimeout(
		function() {
			me.hide();
		},
		this.cfg.getProperty("autodismissdelay"));
};

/**
* Fired when the Tooltip is moved, this event handler is used to prevent the Tooltip from overlapping with its context element.
* @method preventOverlay
* @param {Number} pageX	The x coordinate position of the mouse pointer
* @param {Number} pageY	The y coordinate position of the mouse pointer
*/
YAHOO.widget.Tooltip.prototype.preventOverlap = function(pageX, pageY) {

	var height = this.element.offsetHeight;

	var elementRegion = YAHOO.util.Dom.getRegion(this.element);

	elementRegion.top -= 5;
	elementRegion.left -= 5;
	elementRegion.right += 5;
	elementRegion.bottom += 5;

	var mousePoint = new YAHOO.util.Point(pageX, pageY);


	if (elementRegion.contains(mousePoint)) {
		this.cfg.setProperty("y", (pageY-height-5));
	}
};

/**
* Returns a string representation of the object.
* @method toString
* @return {String}	The string representation of the Tooltip
*/
YAHOO.widget.Tooltip.prototype.toString = function() {
	return "Tooltip " + this.id;
};

/**
* Panel is an implementation of Overlay that behaves like an OS window, with a draggable header and an optional close icon at the top right.
* @namespace YAHOO.widget
* @class Panel
* @extends YAHOO.widget.Overlay
* @constructor
* @param {String}	el	The element ID representing the Panel <em>OR</em>
* @param {HTMLElement}	el	The element representing the Panel
* @param {Object}	userConfig	The configuration object literal containing the configuration that should be set for this Panel. See configuration documentation for more details.
*/
YAHOO.widget.Panel = function(el, userConfig) {
	YAHOO.widget.Panel.superclass.constructor.call(this, el, userConfig);
};

YAHOO.extend(YAHOO.widget.Panel, YAHOO.widget.Overlay);

/**
* Constant representing the default CSS class used for a Panel
* @property YAHOO.widget.Panel.CSS_PANEL
* @static
* @final
* @type String
*/
YAHOO.widget.Panel.CSS_PANEL = "yui-panel";

/**
* Constant representing the default CSS class used for a Panel's wrapping container
* @property YAHOO.widget.Panel.CSS_PANEL_CONTAINER
* @static
* @final
* @type String
*/
YAHOO.widget.Panel.CSS_PANEL_CONTAINER = "yui-panel-container";

/**
* The Overlay initialization method, which is executed for Overlay and all of its subclasses. This method is automatically called by the constructor, and  sets up all DOM references for pre-existing markup, and creates required markup if it is not already present.
* @method init
* @param {String}	el	The element ID representing the Overlay <em>OR</em>
* @param {HTMLElement}	el	The element representing the Overlay
* @param {Object}	userConfig	The configuration object literal containing the configuration that should be set for this Overlay. See configuration documentation for more details.
*/
YAHOO.widget.Panel.prototype.init = function(el, userConfig) {
	YAHOO.widget.Panel.superclass.init.call(this, el/*, userConfig*/);  // Note that we don't pass the user config in here yet because we only want it executed once, at the lowest subclass level

	this.beforeInitEvent.fire(YAHOO.widget.Panel);

	YAHOO.util.Dom.addClass(this.element, YAHOO.widget.Panel.CSS_PANEL);

	this.buildWrapper();

	if (userConfig) {
		this.cfg.applyConfig(userConfig, true);
	}

	this.beforeRenderEvent.subscribe(function() {
		var draggable = this.cfg.getProperty("draggable");
		if (draggable) {
			if (! this.header) {
				this.setHeader("&#160;");
			}
		}
	}, this, true);

	var me = this;

	var doBlur = function() {
		this.blur();
	};

	this.showMaskEvent.subscribe(function() {
		var checkFocusable = function(el) {
			if ((el.tagName == "A" || el.tagName == "BUTTON" || el.tagName == "SELECT" || el.tagName == "INPUT" || el.tagName == "TEXTAREA") && el.type != "hidden") {
				if (! YAHOO.util.Dom.isAncestor(me.element, el)) {
					YAHOO.util.Event.addListener(el, "focus", doBlur, el, true);
					return true;
				}
			} else {
				return false;
			}
		};

		this.focusableElements = YAHOO.util.Dom.getElementsBy(checkFocusable);
	}, this, true);

	this.hideMaskEvent.subscribe(function() {
		for (var i=0;i<this.focusableElements.length;i++) {
			var el2 = this.focusableElements[i];
			YAHOO.util.Event.removeListener(el2, "focus", doBlur);
		}
	}, this, true);

	this.beforeShowEvent.subscribe(function() {
		this.cfg.refireEvent("underlay");
	}, this, true);
	this.initEvent.fire(YAHOO.widget.Panel);
};

/**
* Initializes the custom events for Module which are fired automatically at appropriate times by the Module class.
*/
YAHOO.widget.Panel.prototype.initEvents = function() {
	YAHOO.widget.Panel.superclass.initEvents.call(this);

	/**
	* CustomEvent fired after the modality mask is shown
	* @event showMaskEvent
	*/
	this.showMaskEvent = new YAHOO.util.CustomEvent("showMask");

	/**
	* CustomEvent fired after the modality mask is hidden
	* @event hideMaskEvent
	*/
	this.hideMaskEvent = new YAHOO.util.CustomEvent("hideMask");

	/**
	* CustomEvent when the Panel is dragged
	* @event dragEvent
	*/
	this.dragEvent = new YAHOO.util.CustomEvent("drag");
};

/**
* Initializes the class's configurable properties which can be changed using the Panel's Config object (cfg).
* @method initDefaultConfig
*/
YAHOO.widget.Panel.prototype.initDefaultConfig = function() {
	YAHOO.widget.Panel.superclass.initDefaultConfig.call(this);

	// Add panel config properties //

	/**
	* True if the Panel should display a "close" button
	* @config close
	* @type Boolean
	* @default true
	*/
	this.cfg.addProperty("close", { value:true, handler:this.configClose, validator:this.cfg.checkBoolean, supercedes:["visible"] } );

	/**
	* True if the Panel should be draggable
	* @config draggable
	* @type Boolean
	* @default true
	*/
	this.cfg.addProperty("draggable", { value:true,	handler:this.configDraggable, validator:this.cfg.checkBoolean, supercedes:["visible"] } );

	/**
	* Sets the type of underlay to display for the Panel. Valid values are "shadow", "matte", and "none".
	* @config underlay
	* @type String
	* @default shadow
	*/
	this.cfg.addProperty("underlay", { value:"shadow", handler:this.configUnderlay, supercedes:["visible"] } );

	/**
	* True if the Panel should be displayed in a modal fashion, automatically creating a transparent mask over the document that will not be removed until the Panel is dismissed.
	* @config modal
	* @type Boolean
	* @default false
	*/
	this.cfg.addProperty("modal",	{ value:false, handler:this.configModal, validator:this.cfg.checkBoolean, supercedes:["visible"] } );

	/**
	* A KeyListener (or array of KeyListeners) that will be enabled when the Panel is shown, and disabled when the Panel is hidden.
	* @config keylisteners
	* @type YAHOO.util.KeyListener[]
	* @default null
	*/
	this.cfg.addProperty("keylisteners", { handler:this.configKeyListeners, suppressEvent:true, supercedes:["visible"] } );
};

// BEGIN BUILT-IN PROPERTY EVENT HANDLERS //

/**
* The default event handler fired when the "close" property is changed. The method controls the appending or hiding of the close icon at the top right of the Panel.
* @method configClose
* @param {String} type	The CustomEvent type (usually the property name)
* @param {Object[]}	args	The CustomEvent arguments. For configuration handlers, args[0] will equal the newly applied value for the property.
* @param {Object} obj	The scope object. For configuration handlers, this will usually equal the owner.
*/
YAHOO.widget.Panel.prototype.configClose = function(type, args, obj) {
	var val = args[0];

	var doHide = function(e, obj) {
		obj.hide();
	};

	if (val) {
		if (! this.close) {
			this.close = document.createElement("span");
			YAHOO.util.Dom.addClass(this.close, "container-close");
			this.close.innerHTML = "&#160;";
			this.innerElement.appendChild(this.close);
			YAHOO.util.Event.addListener(this.close, "click", doHide, this);
		} else {
			this.close.style.display = "block";
		}
	} else {
		if (this.close) {
			this.close.style.display = "none";
		}
	}
};

/**
* The default event handler fired when the "draggable" property is changed.
* @method configDraggable
* @param {String} type	The CustomEvent type (usually the property name)
* @param {Object[]}	args	The CustomEvent arguments. For configuration handlers, args[0] will equal the newly applied value for the property.
* @param {Object} obj	The scope object. For configuration handlers, this will usually equal the owner.
*/
YAHOO.widget.Panel.prototype.configDraggable = function(type, args, obj) {
	var val = args[0];
	if (val) {
		if (this.header) {
			YAHOO.util.Dom.setStyle(this.header,"cursor","move");
			this.registerDragDrop();
		}
	} else {
		if (this.dd) {
			this.dd.unreg();
		}
		if (this.header) {
			YAHOO.util.Dom.setStyle(this.header,"cursor","auto");
		}
	}
};

/**
* The default event handler fired when the "underlay" property is changed.
* @method configUnderlay
* @param {String} type	The CustomEvent type (usually the property name)
* @param {Object[]}	args	The CustomEvent arguments. For configuration handlers, args[0] will equal the newly applied value for the property.
* @param {Object} obj	The scope object. For configuration handlers, this will usually equal the owner.
*/
YAHOO.widget.Panel.prototype.configUnderlay = function(type, args, obj) {
	var val = args[0];

	switch (val.toLowerCase()) {
		case "shadow":
			YAHOO.util.Dom.removeClass(this.element, "matte");
			YAHOO.util.Dom.addClass(this.element, "shadow");

			if (! this.underlay) { // create if not already in DOM
				this.underlay = document.createElement("div");
				this.underlay.className = "underlay";
				this.underlay.innerHTML = "&#160;";
				this.element.appendChild(this.underlay);
			}

			this.sizeUnderlay();
			break;
		case "matte":
			YAHOO.util.Dom.removeClass(this.element, "shadow");
			YAHOO.util.Dom.addClass(this.element, "matte");
			break;
		default:
			YAHOO.util.Dom.removeClass(this.element, "shadow");
			YAHOO.util.Dom.removeClass(this.element, "matte");
			break;
	}
};

/**
* The default event handler fired when the "modal" property is changed. This handler subscribes or unsubscribes to the show and hide events to handle the display or hide of the modality mask.
* @method configModal
* @param {String} type	The CustomEvent type (usually the property name)
* @param {Object[]}	args	The CustomEvent arguments. For configuration handlers, args[0] will equal the newly applied value for the property.
* @param {Object} obj	The scope object. For configuration handlers, this will usually equal the owner.
*/
YAHOO.widget.Panel.prototype.configModal = function(type, args, obj) {
	var modal = args[0];

	if (modal) {
		this.buildMask();

		if (! YAHOO.util.Config.alreadySubscribed( this.beforeShowEvent, this.showMask, this ) ) {
			this.beforeShowEvent.subscribe(this.showMask, this, true);
		}
		if (! YAHOO.util.Config.alreadySubscribed( this.hideEvent, this.hideMask, this) ) {
			this.hideEvent.subscribe(this.hideMask, this, true);
		}
		if (! YAHOO.util.Config.alreadySubscribed( YAHOO.widget.Overlay.windowResizeEvent, this.sizeMask, this ) ) {
			YAHOO.widget.Overlay.windowResizeEvent.subscribe(this.sizeMask, this, true);
		}
		if (! YAHOO.util.Config.alreadySubscribed( this.destroyEvent, this.removeMask, this) ) {
			this.destroyEvent.subscribe(this.removeMask, this, true);
		}

		this.cfg.refireEvent("zIndex");
	} else {
		this.beforeShowEvent.unsubscribe(this.showMask, this);
		this.hideEvent.unsubscribe(this.hideMask, this);
		YAHOO.widget.Overlay.windowResizeEvent.unsubscribe(this.sizeMask, this);
		this.destroyEvent.unsubscribe(this.removeMask, this);
	}
};

/**
* Removes the modality mask.
* @method removeMask
*/
YAHOO.widget.Panel.prototype.removeMask = function() {
	if (this.mask) {
		if (this.mask.parentNode) {
			this.mask.parentNode.removeChild(this.mask);
		}
		this.mask = null;
	}
};

/**
* The default event handler fired when the "keylisteners" property is changed.
* @method configKeyListeners
* @param {String} type	The CustomEvent type (usually the property name)
* @param {Object[]}	args	The CustomEvent arguments. For configuration handlers, args[0] will equal the newly applied value for the property.
* @param {Object} obj	The scope object. For configuration handlers, this will usually equal the owner.
*/
YAHOO.widget.Panel.prototype.configKeyListeners = function(type, args, obj) {
	var listeners = args[0];

	if (listeners) {
		if (listeners instanceof Array) {
			for (var i=0;i<listeners.length;i++) {
				var listener = listeners[i];

				if (! YAHOO.util.Config.alreadySubscribed(this.showEvent, listener.enable, listener)) {
					this.showEvent.subscribe(listener.enable, listener, true);
				}
				if (! YAHOO.util.Config.alreadySubscribed(this.hideEvent, listener.disable, listener)) {
					this.hideEvent.subscribe(listener.disable, listener, true);
					this.destroyEvent.subscribe(listener.disable, listener, true);
				}
			}
		} else {
			if (! YAHOO.util.Config.alreadySubscribed(this.showEvent, listeners.enable, listeners)) {
				this.showEvent.subscribe(listeners.enable, listeners, true);
			}
			if (! YAHOO.util.Config.alreadySubscribed(this.hideEvent, listeners.disable, listeners)) {
				this.hideEvent.subscribe(listeners.disable, listeners, true);
				this.destroyEvent.subscribe(listeners.disable, listeners, true);
			}
		}
	}
};

/**
* The default event handler fired when the "height" property is changed.
* @method configHeight
* @param {String} type	The CustomEvent type (usually the property name)
* @param {Object[]}	args	The CustomEvent arguments. For configuration handlers, args[0] will equal the newly applied value for the property.
* @param {Object} obj	The scope object. For configuration handlers, this will usually equal the owner.
*/
YAHOO.widget.Panel.prototype.configHeight = function(type, args, obj) {
	var height = args[0];
	var el = this.innerElement;
	YAHOO.util.Dom.setStyle(el, "height", height);
	this.cfg.refireEvent("underlay");
	this.cfg.refireEvent("iframe");
};

/**
* The default event handler fired when the "width" property is changed.
* @method configWidth
* @param {String} type	The CustomEvent type (usually the property name)
* @param {Object[]}	args	The CustomEvent arguments. For configuration handlers, args[0] will equal the newly applied value for the property.
* @param {Object} obj	The scope object. For configuration handlers, this will usually equal the owner.
*/
YAHOO.widget.Panel.prototype.configWidth = function(type, args, obj) {
	var width = args[0];
	var el = this.innerElement;
	YAHOO.util.Dom.setStyle(el, "width", width);
	this.cfg.refireEvent("underlay");
	this.cfg.refireEvent("iframe");
};

/**
* The default event handler fired when the "zIndex" property is changed.
* @method configzIndex
* @param {String} type	The CustomEvent type (usually the property name)
* @param {Object[]}	args	The CustomEvent arguments. For configuration handlers, args[0] will equal the newly applied value for the property.
* @param {Object} obj	The scope object. For configuration handlers, this will usually equal the owner.
*/
YAHOO.widget.Panel.prototype.configzIndex = function(type, args, obj) {
	YAHOO.widget.Panel.superclass.configzIndex.call(this, type, args, obj);

	var maskZ = 0;
	var currentZ = YAHOO.util.Dom.getStyle(this.element, "zIndex");

	if (this.mask) {
		if (! currentZ || isNaN(currentZ)) {
			currentZ = 0;
		}

		if (currentZ === 0) {
			this.cfg.setProperty("zIndex", 1);
		} else {
			maskZ = currentZ - 1;
			YAHOO.util.Dom.setStyle(this.mask, "zIndex", maskZ);
		}

	}
};

// END BUILT-IN PROPERTY EVENT HANDLERS //


/**
* Builds the wrapping container around the Panel that is used for positioning the shadow and matte underlays. The container element is assigned to a  local instance variable called container, and the element is reinserted inside of it.
* @method buildWrapper
*/
YAHOO.widget.Panel.prototype.buildWrapper = function() {
	var elementParent = this.element.parentNode;
	var originalElement = this.element;

	var wrapper = document.createElement("div");
	wrapper.className = YAHOO.widget.Panel.CSS_PANEL_CONTAINER;
	wrapper.id = originalElement.id + "_c";

	if (elementParent) {
		elementParent.insertBefore(wrapper, originalElement);
	}

	wrapper.appendChild(originalElement);

	this.element = wrapper;
	this.innerElement = originalElement;

	YAHOO.util.Dom.setStyle(this.innerElement, "visibility", "inherit");
};

/**
* Adjusts the size of the shadow based on the size of the element.
* @method sizeUnderlay
*/
YAHOO.widget.Panel.prototype.sizeUnderlay = function() {
	if (this.underlay && this.browser != "gecko" && this.browser != "safari") {
		this.underlay.style.width = this.innerElement.offsetWidth + "px";
		this.underlay.style.height = this.innerElement.offsetHeight + "px";
	}
};

/**
* Event handler fired when the resize monitor element is resized.
* @method onDomResize
* @param {DOMEvent} e	The resize DOM event
* @param {Object} obj	The scope object
*/
YAHOO.widget.Panel.prototype.onDomResize = function(e, obj) {
	YAHOO.widget.Panel.superclass.onDomResize.call(this, e, obj);
	var me = this;
	setTimeout(function() {
		me.sizeUnderlay();
	}, 0);
};

/**
* Registers the Panel's header for drag & drop capability.
* @method registerDragDrop
*/
YAHOO.widget.Panel.prototype.registerDragDrop = function() {
	if (this.header) {
		this.dd = new YAHOO.util.DD(this.element.id, this.id);

		if (! this.header.id) {
			this.header.id = this.id + "_h";
		}

		var me = this;

		this.dd.startDrag = function() {

			if (me.browser == "ie") {
				YAHOO.util.Dom.addClass(me.element,"drag");
			}

			if (me.cfg.getProperty("constraintoviewport")) {
				var offsetHeight = me.element.offsetHeight;
				var offsetWidth = me.element.offsetWidth;

				var viewPortWidth = YAHOO.util.Dom.getViewportWidth();
				var viewPortHeight = YAHOO.util.Dom.getViewportHeight();

				var scrollX = window.scrollX || document.documentElement.scrollLeft;
				var scrollY = window.scrollY || document.documentElement.scrollTop;

				var topConstraint = scrollY + 10;
				var leftConstraint = scrollX + 10;
				var bottomConstraint = scrollY + viewPortHeight - offsetHeight - 10;
				var rightConstraint = scrollX + viewPortWidth - offsetWidth - 10;

				this.minX = leftConstraint;
				this.maxX = rightConstraint;
				this.constrainX = true;

				this.minY = topConstraint;
				this.maxY = bottomConstraint;
				this.constrainY = true;
			} else {
				this.constrainX = false;
				this.constrainY = false;
			}

			me.dragEvent.fire("startDrag", arguments);
		};

		this.dd.onDrag = function() {
			me.syncPosition();
			me.cfg.refireEvent("iframe");
			if (this.platform == "mac" && this.browser == "gecko") {
				this.showMacGeckoScrollbars();
			}

			me.dragEvent.fire("onDrag", arguments);
		};

		this.dd.endDrag = function() {
			if (me.browser == "ie") {
				YAHOO.util.Dom.removeClass(me.element,"drag");
			}

			me.dragEvent.fire("endDrag", arguments);
		};

		this.dd.setHandleElId(this.header.id);
		this.dd.addInvalidHandleType("INPUT");
		this.dd.addInvalidHandleType("SELECT");
		this.dd.addInvalidHandleType("TEXTAREA");
	}
};

/**
* Builds the mask that is laid over the document when the Panel is configured to be modal.
* @method buildMask
*/
YAHOO.widget.Panel.prototype.buildMask = function() {
	if (! this.mask) {
		this.mask = document.createElement("div");
		this.mask.id = this.id + "_mask";
		this.mask.className = "mask";
		this.mask.innerHTML = "&#160;";

		var maskClick = function(e, obj) {
			YAHOO.util.Event.stopEvent(e);
		};

		var firstChild = document.body.firstChild;
		if (firstChild)	{
			document.body.insertBefore(this.mask, document.body.firstChild);
		} else {
			document.body.appendChild(this.mask);
		}
	}
};

/**
* Hides the modality mask.
* @method hideMask
*/
YAHOO.widget.Panel.prototype.hideMask = function() {
	if (this.cfg.getProperty("modal") && this.mask) {
		this.mask.style.display = "none";
		this.hideMaskEvent.fire();
		YAHOO.util.Dom.removeClass(document.body, "masked");
	}
};

/**
* Shows the modality mask.
* @method showMask
*/
YAHOO.widget.Panel.prototype.showMask = function() {
	if (this.cfg.getProperty("modal") && this.mask) {
		YAHOO.util.Dom.addClass(document.body, "masked");
		this.sizeMask();
		this.mask.style.display = "block";
		this.showMaskEvent.fire();
	}
};

/**
* Sets the size of the modality mask to cover the entire scrollable area of the document
* @method sizeMask
*/
YAHOO.widget.Panel.prototype.sizeMask = function() {
	if (this.mask) {
		this.mask.style.height = YAHOO.util.Dom.getDocumentHeight()+"px";
		this.mask.style.width = YAHOO.util.Dom.getDocumentWidth()+"px";
	}
};

/**
* Renders the Panel by inserting the elements that are not already in the main Panel into their correct places. Optionally appends the Panel to the specified node prior to the render's execution. NOTE: For Panels without existing markup, the appendToNode argument is REQUIRED. If this argument is ommitted and the current element is not present in the document, the function will return false, indicating that the render was a failure.
* @method render
* @param {String}	appendToNode	The element id to which the Module should be appended to prior to rendering <em>OR</em>
* @param {HTMLElement}	appendToNode	The element to which the Module should be appended to prior to rendering
* @return {boolean} Success or failure of the render
*/
YAHOO.widget.Panel.prototype.render = function(appendToNode) {
	return YAHOO.widget.Panel.superclass.render.call(this, appendToNode, this.innerElement);
};

/**
* Returns a String representation of the object.
* @method toString
* @return {String} The string representation of the Panel.
*/
YAHOO.widget.Panel.prototype.toString = function() {
	return "Panel " + this.id;
};

/**
* Dialog is an implementation of Panel that can be used to submit form data. Built-in functionality for buttons with event handlers is included, and button sets can be build dynamically, or the preincluded ones for Submit/Cancel and OK/Cancel can be utilized. Forms can be processed in 3 ways -- via an asynchronous Connection utility call, a simple form POST or GET, or manually.
* @namespace YAHOO.widget
* @class Dialog
* @extends YAHOO.widget.Panel
* @constructor
* @param {String}	el	The element ID representing the Dialog <em>OR</em>
* @param {HTMLElement}	el	The element representing the Dialog
* @param {Object}	userConfig	The configuration object literal containing the configuration that should be set for this Dialog. See configuration documentation for more details.
*/
YAHOO.widget.Dialog = function(el, userConfig) {
	YAHOO.widget.Dialog.superclass.constructor.call(this, el, userConfig);
};

YAHOO.extend(YAHOO.widget.Dialog, YAHOO.widget.Panel);

/**
* Constant representing the default CSS class used for a Dialog
* @property YAHOO.widget.Dialog.CSS_DIALOG
* @static
* @final
* @type String
*/
YAHOO.widget.Dialog.CSS_DIALOG = "yui-dialog";

/**
* Initializes the class's configurable properties which can be changed using the Dialog's Config object (cfg).
* @method initDefaultConfig
*/
YAHOO.widget.Dialog.prototype.initDefaultConfig = function() {
	YAHOO.widget.Dialog.superclass.initDefaultConfig.call(this);

	/**
	* The internally maintained callback object for use with the Connection utility
	* @property callback
	* @type Object
	*/
	this.callback = {
		/**
		* The function to execute upon success of the Connection submission
		* @property callback.success
		* @type Function
		*/
		success : null,
		/**
		* The function to execute upon failure of the Connection submission
		* @property callback.failure
		* @type Function
		*/
		failure : null,
		/**
		* The arbitraty argument or arguments to pass to the Connection callback functions
		* @property callback.argument
		* @type Object
		*/
		argument: null
	};

	// Add form dialog config properties //

	/**
	* The method to use for posting the Dialog's form. Possible values are "async", "form", and "manual".
	* @config postmethod
	* @type String
	* @default async
	*/
	this.cfg.addProperty("postmethod", { value:"async", handler:this.configPostMethod, validator:function(val) {
													if (val != "form" && val != "async" && val != "none" && val != "manual") {
														return false;
													} else {
														return true;
													}
												} });

	/**
	* Object literal(s) defining the buttons for the Dialog's footer.
	* @config buttons
	* @type Object[]
	* @default "none"
	*/
	this.cfg.addProperty("buttons",		{ value:"none",	handler:this.configButtons } );
};

/**
* Initializes the custom events for Dialog which are fired automatically at appropriate times by the Dialog class.
* @method initEvents
*/
YAHOO.widget.Dialog.prototype.initEvents = function() {
	YAHOO.widget.Dialog.superclass.initEvents.call(this);

	/**
	* CustomEvent fired prior to submission
	* @event beforeSumitEvent
	*/
	this.beforeSubmitEvent	= new YAHOO.util.CustomEvent("beforeSubmit");

	/**
	* CustomEvent fired after submission
	* @event submitEvent
	*/
	this.submitEvent		= new YAHOO.util.CustomEvent("submit");

	/**
	* CustomEvent fired prior to manual submission
	* @event manualSubmitEvent
	*/
	this.manualSubmitEvent	= new YAHOO.util.CustomEvent("manualSubmit");

	/**
	* CustomEvent fired prior to asynchronous submission
	* @event asyncSubmitEvent
	*/
	this.asyncSubmitEvent	= new YAHOO.util.CustomEvent("asyncSubmit");

	/**
	* CustomEvent fired prior to form-based submission
	* @event formSubmitEvent
	*/
	this.formSubmitEvent	= new YAHOO.util.CustomEvent("formSubmit");

	/**
	* CustomEvent fired after cancel
	* @event cancelEvent
	*/
	this.cancelEvent		= new YAHOO.util.CustomEvent("cancel");
};

/**
* The Dialog initialization method, which is executed for Dialog and all of its subclasses. This method is automatically called by the constructor, and  sets up all DOM references for pre-existing markup, and creates required markup if it is not already present.
* @method init
* @param {String}	el	The element ID representing the Dialog <em>OR</em>
* @param {HTMLElement}	el	The element representing the Dialog
* @param {Object}	userConfig	The configuration object literal containing the configuration that should be set for this Dialog. See configuration documentation for more details.
*/
YAHOO.widget.Dialog.prototype.init = function(el, userConfig) {
	YAHOO.widget.Dialog.superclass.init.call(this, el/*, userConfig*/);  // Note that we don't pass the user config in here yet because we only want it executed once, at the lowest subclass level

	this.beforeInitEvent.fire(YAHOO.widget.Dialog);

	YAHOO.util.Dom.addClass(this.element, YAHOO.widget.Dialog.CSS_DIALOG);

	this.cfg.setProperty("visible", false);

	if (userConfig) {
		this.cfg.applyConfig(userConfig, true);
	}

	this.showEvent.subscribe(this.focusFirst, this, true);
	this.beforeHideEvent.subscribe(this.blurButtons, this, true);

	this.beforeRenderEvent.subscribe(function() {
		var buttonCfg = this.cfg.getProperty("buttons");
		if (buttonCfg && buttonCfg != "none") {
			if (! this.footer) {
				this.setFooter("");
			}
		}
	}, this, true);

	this.initEvent.fire(YAHOO.widget.Dialog);
};

/**
* Performs the submission of the Dialog form depending on the value of "postmethod" property.
* @method doSubmit
*/
YAHOO.widget.Dialog.prototype.doSubmit = function() {
	var pm = this.cfg.getProperty("postmethod");
	switch (pm) {
		case "async":
			var method = this.form.getAttribute("method") || 'POST';
			method = method.toUpperCase();
			YAHOO.util.Connect.setForm(this.form);
			var cObj = YAHOO.util.Connect.asyncRequest(method, this.form.getAttribute("action"), this.callback);
			this.asyncSubmitEvent.fire();
			break;
		case "form":
			this.form.submit();
			this.formSubmitEvent.fire();
			break;
		case "none":
		case "manual":
			this.manualSubmitEvent.fire();
			break;
	}
};

/**
* Prepares the Dialog's internal FORM object, creating one if one is not currently present.
* @method registerForm
*/
YAHOO.widget.Dialog.prototype.registerForm = function() {
	var form = this.element.getElementsByTagName("form")[0];

	if (! form) {
		var formHTML = "<form name=\"frm_" + this.id + "\" action=\"\"></form>";
		this.body.innerHTML += formHTML;
		form = this.element.getElementsByTagName("form")[0];
	}

	this.firstFormElement = function() {
		for (var f=0;f<form.elements.length;f++ ) {
			var el = form.elements[f];
			if (el.focus && ! el.disabled) {
				if (el.type && el.type != "hidden") {
					return el;
				}
			}
		}
		return null;
	}();

	this.lastFormElement = function() {
		for (var f=form.elements.length-1;f>=0;f-- ) {
			var el = form.elements[f];
			if (el.focus && ! el.disabled) {
				if (el.type && el.type != "hidden") {
					return el;
				}
			}
		}
		return null;
	}();

	this.form = form;

	if (this.cfg.getProperty("modal") && this.form) {

		var me = this;

		var firstElement = this.firstFormElement || this.firstButton;
		if (firstElement) {
			this.preventBackTab = new YAHOO.util.KeyListener(firstElement, { shift:true, keys:9 }, {fn:me.focusLast, scope:me, correctScope:true} );
			this.showEvent.subscribe(this.preventBackTab.enable, this.preventBackTab, true);
			this.hideEvent.subscribe(this.preventBackTab.disable, this.preventBackTab, true);
		}

		var lastElement = this.lastButton || this.lastFormElement;
		if (lastElement) {
			this.preventTabOut = new YAHOO.util.KeyListener(lastElement, { shift:false, keys:9 }, {fn:me.focusFirst, scope:me, correctScope:true} );
			this.showEvent.subscribe(this.preventTabOut.enable, this.preventTabOut, true);
			this.hideEvent.subscribe(this.preventTabOut.disable, this.preventTabOut, true);
		}
	}
};

// BEGIN BUILT-IN PROPERTY EVENT HANDLERS //

/**
* The default event handler fired when the "close" property is changed. The method controls the appending or hiding of the close icon at the top right of the Dialog.
* @method configClose
* @param {String} type	The CustomEvent type (usually the property name)
* @param {Object[]}	args	The CustomEvent arguments. For configuration handlers, args[0] will equal the newly applied value for the property.
* @param {Object} obj	The scope object. For configuration handlers, this will usually equal the owner.
*/
YAHOO.widget.Dialog.prototype.configClose = function(type, args, obj) {
	var val = args[0];

	var doCancel = function(e, obj) {
		obj.cancel();
	};

	if (val) {
		if (! this.close) {
			this.close = document.createElement("div");
			YAHOO.util.Dom.addClass(this.close, "container-close");

			this.close.innerHTML = "&#160;";
			this.innerElement.appendChild(this.close);
			YAHOO.util.Event.addListener(this.close, "click", doCancel, this);
		} else {
			this.close.style.display = "block";
		}
	} else {
		if (this.close) {
			this.close.style.display = "none";
		}
	}
};

/**
* The default event handler for the "buttons" configuration property
* @method configButtons
* @param {String} type	The CustomEvent type (usually the property name)
* @param {Object[]}	args	The CustomEvent arguments. For configuration handlers, args[0] will equal the newly applied value for the property.
* @param {Object} obj	The scope object. For configuration handlers, this will usually equal the owner.
*/
YAHOO.widget.Dialog.prototype.configButtons = function(type, args, obj) {
	var buttons = args[0];
	if (buttons != "none") {
		this.buttonSpan = null;
		this.buttonSpan = document.createElement("span");
		this.buttonSpan.className = "button-group";

		for (var b=0;b<buttons.length;b++) {
			var button = buttons[b];

			var htmlButton = document.createElement("button");
			htmlButton.setAttribute("type", "button");

			if (button.isDefault) {
				htmlButton.className = "default";
				this.defaultHtmlButton = htmlButton;
			}

			htmlButton.appendChild(document.createTextNode(button.text));
			YAHOO.util.Event.addListener(htmlButton, "click", button.handler, this, true);

			this.buttonSpan.appendChild(htmlButton);
			button.htmlButton = htmlButton;

			if (b === 0) {
				this.firstButton = button.htmlButton;
			}

			if (b == (buttons.length-1)) {
				this.lastButton = button.htmlButton;
			}

		}

		this.setFooter(this.buttonSpan);

		this.cfg.refireEvent("iframe");
		this.cfg.refireEvent("underlay");
	} else { // Do cleanup
		if (this.buttonSpan) {
			if (this.buttonSpan.parentNode) {
				this.buttonSpan.parentNode.removeChild(this.buttonSpan);
			}

			this.buttonSpan = null;
			this.firstButton = null;
			this.lastButton = null;
			this.defaultHtmlButton = null;
		}
	}
};


/**
* The default event handler used to focus the first field of the form when the Dialog is shown.
* @method focusFirst
*/
YAHOO.widget.Dialog.prototype.focusFirst = function(type,args,obj) {
	if (args) {
		var e = args[1];
		if (e) {
			YAHOO.util.Event.stopEvent(e);
		}
	}

	if (this.firstFormElement) {
		this.firstFormElement.focus();
	} else {
		this.focusDefaultButton();
	}
};

/**
* Sets the focus to the last button in the button or form element in the Dialog
* @method focusLast
*/
YAHOO.widget.Dialog.prototype.focusLast = function(type,args,obj) {
	if (args) {
		var e = args[1];
		if (e) {
			YAHOO.util.Event.stopEvent(e);
		}
	}

	var buttons = this.cfg.getProperty("buttons");
	if (buttons && buttons instanceof Array) {
		this.focusLastButton();
	} else {
		if (this.lastFormElement) {
			this.lastFormElement.focus();
		}
	}
};

/**
* Sets the focus to the button that is designated as the default. By default, his handler is executed when the show event is fired.
* @method focusDefaultButton
*/
YAHOO.widget.Dialog.prototype.focusDefaultButton = function() {
	if (this.defaultHtmlButton) {
		this.defaultHtmlButton.focus();
	}
};

/**
* Blurs all the html buttons
* @method blurButtons
*/
YAHOO.widget.Dialog.prototype.blurButtons = function() {
	var buttons = this.cfg.getProperty("buttons");
	if (buttons && buttons instanceof Array) {
		var html = buttons[0].htmlButton;
		if (html) {
			html.blur();
		}
	}
};

/**
* Sets the focus to the first button in the button list
* @method focusFirstButton
*/
YAHOO.widget.Dialog.prototype.focusFirstButton = function() {
	var buttons = this.cfg.getProperty("buttons");
	if (buttons && buttons instanceof Array) {
		var html = buttons[0].htmlButton;
		if (html) {
			html.focus();
		}
	}
};

/**
* Sets the focus to the first button in the button list
* @method focusLastButton
*/
YAHOO.widget.Dialog.prototype.focusLastButton = function() {
	var buttons = this.cfg.getProperty("buttons");
	if (buttons && buttons instanceof Array) {
		var html = buttons[buttons.length-1].htmlButton;
		if (html) {
			html.focus();
		}
	}
};

/**
* The default event handler for the "postmethod" configuration property
* @method configPostMethod
* @param {String} type	The CustomEvent type (usually the property name)
* @param {Object[]}	args	The CustomEvent arguments. For configuration handlers, args[0] will equal the newly applied value for the property.
* @param {Object} obj	The scope object. For configuration handlers, this will usually equal the owner.
*/
YAHOO.widget.Dialog.prototype.configPostMethod = function(type, args, obj) {
	var postmethod = args[0];

	this.registerForm();
	YAHOO.util.Event.addListener(this.form, "submit", function(e) {
														YAHOO.util.Event.stopEvent(e);
														this.submit();
														this.form.blur();
													  }, this, true);
};

// END BUILT-IN PROPERTY EVENT HANDLERS //

/**
* Built-in function hook for writing a validation function that will be checked for a "true" value prior to a submit. This function, as implemented by default, always returns true, so it should be overridden if validation is necessary.
* @method validate
*/
YAHOO.widget.Dialog.prototype.validate = function() {
	return true;
};

/**
* Executes a submit of the Dialog followed by a hide, if validation is successful.
* @method submit
*/
YAHOO.widget.Dialog.prototype.submit = function() {
	if (this.validate()) {
		this.beforeSubmitEvent.fire();
		this.doSubmit();
		this.submitEvent.fire();
		this.hide();
		return true;
	} else {
		return false;
	}
};

/**
* Executes the cancel of the Dialog followed by a hide.
* @method cancel
*/
YAHOO.widget.Dialog.prototype.cancel = function() {
	this.cancelEvent.fire();
	this.hide();
};

/**
* Returns a JSON-compatible data structure representing the data currently contained in the form.
* @method getData
* @return {Object} A JSON object reprsenting the data of the current form.
*/
YAHOO.widget.Dialog.prototype.getData = function() {

    var oForm = this.form;

    if(oForm) {

        var aElements = oForm.elements,
            nTotalElements = aElements.length,
            oData = {},
            sName,
            oElement;


        for(var i=0; i<nTotalElements; i++) {

            sName = aElements[i].name,
            oElement = aElements[sName];


            if(oElement) {

                if(oElement.tagName) {

                    var sType = oElement.type,
                        sTagName = oElement.tagName.toUpperCase();

                    switch(sTagName) {

                        case "INPUT":

                            if(sType == "checkbox") {

                                oData[sName] = oElement.checked;

                            }
                            else if(sType != "radio") {

                                oData[sName] = oElement.value;

                            }

                        break;

                        case "TEXTAREA":

                            oData[sName] = oElement.value;

                        break;

                        case "SELECT":

                            var aOptions = oElement.options,
                                nOptions = aOptions.length,
                                aValues = [],
                                oOption,
                                sValue;


                            for(var n=0; n<nOptions; n++) {

                                oOption = aOptions[n];

                                if(oOption.selected) {

                                    sValue = oOption.value;

                                    if(!sValue || sValue === "") {

                                        sValue = oOption.text;

                                    }

                                    aValues[aValues.length] = sValue;

                                }

                            }

                            oData[sName] = aValues;

                        break;

                    }


                }
                else {

                    var nElements = oElement.length,
                        sType = oElement[0].type,
                        sTagName = oElement[0].tagName.toUpperCase();


                    switch(sType) {

                        case "radio":

                            var oRadio;

                            for(var n=0; n<nElements; n++) {

                                oRadio = oElement[n];

                                if(oRadio.checked) {

                                    oData[sName] = oRadio.value;
                                    break;

                                }

                            }

                        break;

                        case "checkbox":

                            var aValues = [],
                                oCheckbox;

                            for(var n=0; n<nElements; n++) {

                                oCheckbox = oElement[n];

                                if(oCheckbox.checked) {

                                    aValues[aValues.length] = oCheckbox.value;

                                }

                            }

                            oData[sName] = aValues;

                        break;

                    }

                }

            }

        }

    }


    return oData;

};

/**
* Returns a string representation of the object.
* @method toString
* @return {String}	The string representation of the Dialog
*/
YAHOO.widget.Dialog.prototype.toString = function() {
	return "Dialog " + this.id;
};

/**
* SimpleDialog is a simple implementation of Dialog that can be used to submit a single value. Forms can be processed in 3 ways -- via an asynchronous Connection utility call, a simple form POST or GET, or manually.
* @namespace YAHOO.widget
* @class SimpleDialog
* @extends YAHOO.widget.Dialog
* @constructor
* @param {String}	el	The element ID representing the SimpleDialog <em>OR</em>
* @param {HTMLElement}	el	The element representing the SimpleDialog
* @param {Object}	userConfig	The configuration object literal containing the configuration that should be set for this SimpleDialog. See configuration documentation for more details.
*/
YAHOO.widget.SimpleDialog = function(el, userConfig) {
	YAHOO.widget.SimpleDialog.superclass.constructor.call(this, el, userConfig);
};

YAHOO.extend(YAHOO.widget.SimpleDialog, YAHOO.widget.Dialog);

/**
* Constant for the standard network icon for a blocking action
* @property YAHOO.widget.SimpleDialog.ICON_BLOCK
* @static
* @final
* @type String
*/
YAHOO.widget.SimpleDialog.ICON_BLOCK = "blckicon";

/**
* Constant for the standard network icon for alarm
* @property YAHOO.widget.SimpleDialog.ICON_ALARM
* @static
* @final
* @type String
*/
YAHOO.widget.SimpleDialog.ICON_ALARM = "alrticon";

/**
* Constant for the standard network icon for help
* @property YAHOO.widget.SimpleDialog.ICON_HELP
* @static
* @final
* @type String
*/
YAHOO.widget.SimpleDialog.ICON_HELP  = "hlpicon";

/**
* Constant for the standard network icon for info
* @property YAHOO.widget.SimpleDialog.ICON_INFO
* @static
* @final
* @type String
*/
YAHOO.widget.SimpleDialog.ICON_INFO  = "infoicon";

/**
* Constant for the standard network icon for warn
* @property YAHOO.widget.SimpleDialog.ICON_WARN
* @static
* @final
* @type String
*/
YAHOO.widget.SimpleDialog.ICON_WARN  = "warnicon";

/**
* Constant for the standard network icon for a tip
* @property YAHOO.widget.SimpleDialog.ICON_TIP
* @static
* @final
* @type String
*/
YAHOO.widget.SimpleDialog.ICON_TIP   = "tipicon";

/**
* Constant representing the default CSS class used for a SimpleDialog
* @property YAHOO.widget.SimpleDialog.CSS_SIMPLEDIALOG
* @static
* @final
* @type String
*/
YAHOO.widget.SimpleDialog.CSS_SIMPLEDIALOG = "yui-simple-dialog";

/**
* Initializes the class's configurable properties which can be changed using the SimpleDialog's Config object (cfg).
* @method initDefaultConfig
*/
YAHOO.widget.SimpleDialog.prototype.initDefaultConfig = function() {
	YAHOO.widget.SimpleDialog.superclass.initDefaultConfig.call(this);

	// Add dialog config properties //

	/**
	* Sets the informational icon for the SimpleDialog
	* @config icon
	* @type String
	* @default "none"
	*/
	this.cfg.addProperty("icon",	{ value:"none",	handler:this.configIcon, suppressEvent:true } );

	/**
	* Sets the text for the SimpleDialog
	* @config text
	* @type String
	* @default ""
	*/
	this.cfg.addProperty("text",	{ value:"", handler:this.configText, suppressEvent:true, supercedes:["icon"] } );
};


/**
* The SimpleDialog initialization method, which is executed for SimpleDialog and all of its subclasses. This method is automatically called by the constructor, and  sets up all DOM references for pre-existing markup, and creates required markup if it is not already present.
* @method init
* @param {String}	el	The element ID representing the SimpleDialog <em>OR</em>
* @param {HTMLElement}	el	The element representing the SimpleDialog
* @param {Object}	userConfig	The configuration object literal containing the configuration that should be set for this SimpleDialog. See configuration documentation for more details.
*/
YAHOO.widget.SimpleDialog.prototype.init = function(el, userConfig) {
	YAHOO.widget.SimpleDialog.superclass.init.call(this, el/*, userConfig*/);  // Note that we don't pass the user config in here yet because we only want it executed once, at the lowest subclass level

	this.beforeInitEvent.fire(YAHOO.widget.SimpleDialog);

	YAHOO.util.Dom.addClass(this.element, YAHOO.widget.SimpleDialog.CSS_SIMPLEDIALOG);

	this.cfg.queueProperty("postmethod", "manual");

	if (userConfig) {
		this.cfg.applyConfig(userConfig, true);
	}

	this.beforeRenderEvent.subscribe(function() {
		if (! this.body) {
			this.setBody("");
		}
	}, this, true);

	this.initEvent.fire(YAHOO.widget.SimpleDialog);

};
/**
* Prepares the SimpleDialog's internal FORM object, creating one if one is not currently present, and adding the value hidden field.
* @method registerForm
*/
YAHOO.widget.SimpleDialog.prototype.registerForm = function() {
	YAHOO.widget.SimpleDialog.superclass.registerForm.call(this);
	this.form.innerHTML += "<input type=\"hidden\" name=\"" + this.id + "\" value=\"\"/>";
};

// BEGIN BUILT-IN PROPERTY EVENT HANDLERS //

/**
* Fired when the "icon" property is set.
* @method configIcon
* @param {String} type	The CustomEvent type (usually the property name)
* @param {Object[]}	args	The CustomEvent arguments. For configuration handlers, args[0] will equal the newly applied value for the property.
* @param {Object} obj	The scope object. For configuration handlers, this will usually equal the owner.
*/
YAHOO.widget.SimpleDialog.prototype.configIcon = function(type,args,obj) {
	var icon = args[0];
	if (icon && icon != "none") {
		var iconHTML = "";
		if (icon.indexOf(".") == -1) {
			iconHTML = "<span class=\"yui-icon " + icon +"\" >&#160;</span>";
		} else {
			iconHTML = "<img src=\"" + this.imageRoot + icon + "\" class=\"yui-icon\" />";
		}
		this.body.innerHTML = iconHTML + this.body.innerHTML;
	}
};

/**
* Fired when the "text" property is set.
* @method configText
* @param {String} type	The CustomEvent type (usually the property name)
* @param {Object[]}	args	The CustomEvent arguments. For configuration handlers, args[0] will equal the newly applied value for the property.
* @param {Object} obj	The scope object. For configuration handlers, this will usually equal the owner.
*/
YAHOO.widget.SimpleDialog.prototype.configText = function(type,args,obj) {
	var text = args[0];
	if (text) {
		this.setBody(text);
		this.cfg.refireEvent("icon");
	}
};
// END BUILT-IN PROPERTY EVENT HANDLERS //

/**
* Returns a string representation of the object.
* @method toString
* @return {String}	The string representation of the SimpleDialog
*/
YAHOO.widget.SimpleDialog.prototype.toString = function() {
	return "SimpleDialog " + this.id;
};

/**
* ContainerEffect encapsulates animation transitions that are executed when an Overlay is shown or hidden.
* @namespace YAHOO.widget
* @class ContainerEffect
* @constructor
* @param {YAHOO.widget.Overlay}	overlay		The Overlay that the animation should be associated with
* @param {Object}	attrIn		The object literal representing the animation arguments to be used for the animate-in transition. The arguments for this literal are: attributes(object, see YAHOO.util.Anim for description), duration(Number), and method(i.e. YAHOO.util.Easing.easeIn).
* @param {Object}	attrOut		The object literal representing the animation arguments to be used for the animate-out transition. The arguments for this literal are: attributes(object, see YAHOO.util.Anim for description), duration(Number), and method(i.e. YAHOO.util.Easing.easeIn).
* @param {HTMLElement}	targetElement	Optional. The target element that should be animated during the transition. Defaults to overlay.element.
* @param {class}	Optional. The animation class to instantiate. Defaults to YAHOO.util.Anim. Other options include YAHOO.util.Motion.
*/
YAHOO.widget.ContainerEffect = function(overlay, attrIn, attrOut, targetElement, animClass) {
	if (! animClass) {
		animClass = YAHOO.util.Anim;
	}

	/**
	* The overlay to animate
	* @property overlay
	* @type YAHOO.widget.Overlay
	*/
	this.overlay = overlay;
	/**
	* The animation attributes to use when transitioning into view
	* @property attrIn
	* @type Object
	*/
	this.attrIn = attrIn;
	/**
	* The animation attributes to use when transitioning out of view
	* @property attrOut
	* @type Object
	*/
	this.attrOut = attrOut;
	/**
	* The target element to be animated
	* @property targetElement
	* @type HTMLElement
	*/
	this.targetElement = targetElement || overlay.element;
	/**
	* The animation class to use for animating the overlay
	* @property animClass
	* @type class
	*/
	this.animClass = animClass;
};

/**
* Initializes the animation classes and events.
* @method init
*/
YAHOO.widget.ContainerEffect.prototype.init = function() {
	this.beforeAnimateInEvent = new YAHOO.util.CustomEvent("beforeAnimateIn");
	this.beforeAnimateOutEvent = new YAHOO.util.CustomEvent("beforeAnimateOut");

	this.animateInCompleteEvent = new YAHOO.util.CustomEvent("animateInComplete");
	this.animateOutCompleteEvent = new YAHOO.util.CustomEvent("animateOutComplete");

	this.animIn = new this.animClass(this.targetElement, this.attrIn.attributes, this.attrIn.duration, this.attrIn.method);
	this.animIn.onStart.subscribe(this.handleStartAnimateIn, this);
	this.animIn.onTween.subscribe(this.handleTweenAnimateIn, this);
	this.animIn.onComplete.subscribe(this.handleCompleteAnimateIn, this);

	this.animOut = new this.animClass(this.targetElement, this.attrOut.attributes, this.attrOut.duration, this.attrOut.method);
	this.animOut.onStart.subscribe(this.handleStartAnimateOut, this);
	this.animOut.onTween.subscribe(this.handleTweenAnimateOut, this);
	this.animOut.onComplete.subscribe(this.handleCompleteAnimateOut, this);
};

/**
* Triggers the in-animation.
* @method animateIn
*/
YAHOO.widget.ContainerEffect.prototype.animateIn = function() {
	this.beforeAnimateInEvent.fire();
	this.animIn.animate();
};

/**
* Triggers the out-animation.
* @method animateOut
*/
YAHOO.widget.ContainerEffect.prototype.animateOut = function() {
	this.beforeAnimateOutEvent.fire();
	this.animOut.animate();
};

/**
* The default onStart handler for the in-animation.
* @method handleStartAnimateIn
* @param {String} type	The CustomEvent type
* @param {Object[]}	args	The CustomEvent arguments
* @param {Object} obj	The scope object
*/
YAHOO.widget.ContainerEffect.prototype.handleStartAnimateIn = function(type, args, obj) { };
/**
* The default onTween handler for the in-animation.
* @method handleTweenAnimateIn
* @param {String} type	The CustomEvent type
* @param {Object[]}	args	The CustomEvent arguments
* @param {Object} obj	The scope object
*/
YAHOO.widget.ContainerEffect.prototype.handleTweenAnimateIn = function(type, args, obj) { };
/**
* The default onComplete handler for the in-animation.
* @method handleCompleteAnimateIn
* @param {String} type	The CustomEvent type
* @param {Object[]}	args	The CustomEvent arguments
* @param {Object} obj	The scope object
*/
YAHOO.widget.ContainerEffect.prototype.handleCompleteAnimateIn = function(type, args, obj) { };

/**
* The default onStart handler for the out-animation.
* @method handleStartAnimateOut
* @param {String} type	The CustomEvent type
* @param {Object[]}	args	The CustomEvent arguments
* @param {Object} obj	The scope object
*/
YAHOO.widget.ContainerEffect.prototype.handleStartAnimateOut = function(type, args, obj) { };
/**
* The default onTween handler for the out-animation.
* @method handleTweenAnimateOut
* @param {String} type	The CustomEvent type
* @param {Object[]}	args	The CustomEvent arguments
* @param {Object} obj	The scope object
*/
YAHOO.widget.ContainerEffect.prototype.handleTweenAnimateOut = function(type, args, obj) { };
/**
* The default onComplete handler for the out-animation.
* @method handleCompleteAnimateOut
* @param {String} type	The CustomEvent type
* @param {Object[]}	args	The CustomEvent arguments
* @param {Object} obj	The scope object
*/
YAHOO.widget.ContainerEffect.prototype.handleCompleteAnimateOut = function(type, args, obj) { };

/**
* Returns a string representation of the object.
* @method toString
* @return {String}	The string representation of the ContainerEffect
*/
YAHOO.widget.ContainerEffect.prototype.toString = function() {
	var output = "ContainerEffect";
	if (this.overlay) {
		output += " [" + this.overlay.toString() + "]";
	}
	return output;
};

/**
* A pre-configured ContainerEffect instance that can be used for fading an overlay in and out.
* @method FADE
* @static
* @param {Overlay}	overlay	The Overlay object to animate
* @param {Number}	dur	The duration of the animation
* @return {ContainerEffect}	The configured ContainerEffect object
*/
YAHOO.widget.ContainerEffect.FADE = function(overlay, dur) {
	var fade = new YAHOO.widget.ContainerEffect(overlay, { attributes:{opacity: {from:0, to:1}}, duration:dur, method:YAHOO.util.Easing.easeIn }, { attributes:{opacity: {to:0}}, duration:dur, method:YAHOO.util.Easing.easeOut}, overlay.element );

	fade.handleStartAnimateIn = function(type,args,obj) {
		YAHOO.util.Dom.addClass(obj.overlay.element, "hide-select");

		if (! obj.overlay.underlay) {
			obj.overlay.cfg.refireEvent("underlay");
		}

		if (obj.overlay.underlay) {
			obj.initialUnderlayOpacity = YAHOO.util.Dom.getStyle(obj.overlay.underlay, "opacity");
			obj.overlay.underlay.style.filter = null;
		}

		YAHOO.util.Dom.setStyle(obj.overlay.element, "visibility", "visible");
		YAHOO.util.Dom.setStyle(obj.overlay.element, "opacity", 0);
	};

	fade.handleCompleteAnimateIn = function(type,args,obj) {
		YAHOO.util.Dom.removeClass(obj.overlay.element, "hide-select");

		if (obj.overlay.element.style.filter) {
			obj.overlay.element.style.filter = null;
		}

		if (obj.overlay.underlay) {
			YAHOO.util.Dom.setStyle(obj.overlay.underlay, "opacity", obj.initialUnderlayOpacity);
		}

		obj.overlay.cfg.refireEvent("iframe");
		obj.animateInCompleteEvent.fire();
	};

	fade.handleStartAnimateOut = function(type, args, obj) {
		YAHOO.util.Dom.addClass(obj.overlay.element, "hide-select");

		if (obj.overlay.underlay) {
			obj.overlay.underlay.style.filter = null;
		}
	};

	fade.handleCompleteAnimateOut =  function(type, args, obj) {
		YAHOO.util.Dom.removeClass(obj.overlay.element, "hide-select");
		if (obj.overlay.element.style.filter) {
			obj.overlay.element.style.filter = null;
		}
		YAHOO.util.Dom.setStyle(obj.overlay.element, "visibility", "hidden");
		YAHOO.util.Dom.setStyle(obj.overlay.element, "opacity", 1);

		obj.overlay.cfg.refireEvent("iframe");

		obj.animateOutCompleteEvent.fire();
	};

	fade.init();
	return fade;
};


/**
* A pre-configured ContainerEffect instance that can be used for sliding an overlay in and out.
* @method SLIDE
* @static
* @param {Overlay}	overlay	The Overlay object to animate
* @param {Number}	dur	The duration of the animation
* @return {ContainerEffect}	The configured ContainerEffect object
*/
YAHOO.widget.ContainerEffect.SLIDE = function(overlay, dur) {
	var x = overlay.cfg.getProperty("x") || YAHOO.util.Dom.getX(overlay.element);
	var y = overlay.cfg.getProperty("y") || YAHOO.util.Dom.getY(overlay.element);

	var clientWidth = YAHOO.util.Dom.getClientWidth();
	var offsetWidth = overlay.element.offsetWidth;

	var slide = new YAHOO.widget.ContainerEffect(overlay, {
															attributes:{ points: { to:[x, y] } },
															duration:dur,
															method:YAHOO.util.Easing.easeIn
														},
														{
															attributes:{ points: { to:[(clientWidth+25), y] } },
															duration:dur,
															method:YAHOO.util.Easing.easeOut
														},
														overlay.element,
														YAHOO.util.Motion);


	slide.handleStartAnimateIn = function(type,args,obj) {
		obj.overlay.element.style.left = (-25-offsetWidth) + "px";
		obj.overlay.element.style.top  = y + "px";
	};

	slide.handleTweenAnimateIn = function(type, args, obj) {


		var pos = YAHOO.util.Dom.getXY(obj.overlay.element);

		var currentX = pos[0];
		var currentY = pos[1];

		if (YAHOO.util.Dom.getStyle(obj.overlay.element, "visibility") == "hidden" && currentX < x) {
			YAHOO.util.Dom.setStyle(obj.overlay.element, "visibility", "visible");
		}

		obj.overlay.cfg.setProperty("xy", [currentX,currentY], true);
		obj.overlay.cfg.refireEvent("iframe");
	};

	slide.handleCompleteAnimateIn = function(type, args, obj) {
		obj.overlay.cfg.setProperty("xy", [x,y], true);
		obj.startX = x;
		obj.startY = y;
		obj.overlay.cfg.refireEvent("iframe");
		obj.animateInCompleteEvent.fire();
	};

	slide.handleStartAnimateOut = function(type, args, obj) {
		var vw = YAHOO.util.Dom.getViewportWidth();

		var pos = YAHOO.util.Dom.getXY(obj.overlay.element);

		var yso = pos[1];

		var currentTo = obj.animOut.attributes.points.to;
		obj.animOut.attributes.points.to = [(vw+25), yso];
	};

	slide.handleTweenAnimateOut = function(type, args, obj) {
		var pos = YAHOO.util.Dom.getXY(obj.overlay.element);

		var xto = pos[0];
		var yto = pos[1];

		obj.overlay.cfg.setProperty("xy", [xto,yto], true);
		obj.overlay.cfg.refireEvent("iframe");
	};

	slide.handleCompleteAnimateOut = function(type, args, obj) {
		YAHOO.util.Dom.setStyle(obj.overlay.element, "visibility", "hidden");

		obj.overlay.cfg.setProperty("xy", [x,y]);
		obj.animateOutCompleteEvent.fire();
	};

	slide.init();
	return slide;
};
YAHOO.register("container", YAHOO.widget.Module, {version: "2.2.0", build: "127"});

/*** end file 'container.js' ***/

/*** begin file 'utilities.js' ***/
/*
Copyright (c) 2007, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.2.0
*/

if(typeof YAHOO=="undefined"){var YAHOO={};}
YAHOO.namespace=function(){var a=arguments,o=null,i,j,d;for(i=0;i<a.length;i=i+1){d=a[i].split(".");o=YAHOO;for(j=(d[0]=="YAHOO")?1:0;j<d.length;j=j+1){o[d[j]]=o[d[j]]||{};o=o[d[j]];}}
return o;};YAHOO.log=function(msg,cat,src){var l=YAHOO.widget.Logger;if(l&&l.log){return l.log(msg,cat,src);}else{return false;}};YAHOO.init=function(){this.namespace("util","widget","example");if(typeof YAHOO_config!="undefined"){var l=YAHOO_config.listener,ls=YAHOO.env.listeners,unique=true,i;if(l){for(i=0;i<ls.length;i=i+1){if(ls[i]==l){unique=false;break;}}
if(unique){ls.push(l);}}}};YAHOO.register=function(name,mainClass,data){var mods=YAHOO.env.modules;if(!mods[name]){mods[name]={versions:[],builds:[]};}
var m=mods[name],v=data.version,b=data.build,ls=YAHOO.env.listeners;m.name=name;m.version=v;m.build=b;m.versions.push(v);m.builds.push(b);m.mainClass=mainClass;for(var i=0;i<ls.length;i=i+1){ls[i](m);}
if(mainClass){mainClass.VERSION=v;mainClass.BUILD=b;}else{YAHOO.log("mainClass is undefined for module "+name,"warn");}};YAHOO.env=YAHOO.env||{modules:[],listeners:[],getVersion:function(name){return YAHOO.env.modules[name]||null;}};YAHOO.lang={isArray:function(obj){if(obj.constructor&&obj.constructor.toString().indexOf('Array')>-1){return true;}else{return YAHOO.lang.isObject(obj)&&obj.constructor==Array;}},isBoolean:function(obj){return typeof obj=='boolean';},isFunction:function(obj){return typeof obj=='function';},isNull:function(obj){return obj===null;},isNumber:function(obj){return typeof obj=='number'&&isFinite(obj);},isObject:function(obj){return typeof obj=='object'||YAHOO.lang.isFunction(obj);},isString:function(obj){return typeof obj=='string';},isUndefined:function(obj){return typeof obj=='undefined';},hasOwnProperty:function(obj,prop){if(Object.prototype.hasOwnProperty){return obj.hasOwnProperty(prop);}
return!YAHOO.lang.isUndefined(obj[prop])&&obj.constructor.prototype[prop]!==obj[prop];},extend:function(subc,superc,overrides){var F=function(){};F.prototype=superc.prototype;subc.prototype=new F();subc.prototype.constructor=subc;subc.superclass=superc.prototype;if(superc.prototype.constructor==Object.prototype.constructor){superc.prototype.constructor=superc;}
if(overrides){for(var i in overrides){subc.prototype[i]=overrides[i];}}},augment:function(r,s){var rp=r.prototype,sp=s.prototype,a=arguments,i,p;if(a[2]){for(i=2;i<a.length;i=i+1){rp[a[i]]=sp[a[i]];}}else{for(p in sp){if(!rp[p]){rp[p]=sp[p];}}}}};YAHOO.init();YAHOO.util.Lang=YAHOO.lang;YAHOO.augment=YAHOO.lang.augment;YAHOO.extend=YAHOO.lang.extend;YAHOO.register("yahoo",YAHOO,{version:"2.2.0",build:"127"});
(function(){var Y=YAHOO.util,getStyle,setStyle,id_counter=0,propertyCache={};var ua=navigator.userAgent.toLowerCase(),isOpera=(ua.indexOf('opera')>-1),isSafari=(ua.indexOf('safari')>-1),isGecko=(!isOpera&&!isSafari&&ua.indexOf('gecko')>-1),isIE=(!isOpera&&ua.indexOf('msie')>-1);var patterns={HYPHEN:/(-[a-z])/i};var toCamel=function(property){if(!patterns.HYPHEN.test(property)){return property;}
if(propertyCache[property]){return propertyCache[property];}
while(patterns.HYPHEN.exec(property)){property=property.replace(RegExp.$1,RegExp.$1.substr(1).toUpperCase());}
propertyCache[property]=property;return property;};if(document.defaultView&&document.defaultView.getComputedStyle){getStyle=function(el,property){var value=null;var computed=document.defaultView.getComputedStyle(el,'');if(computed){value=computed[toCamel(property)];}
return el.style[property]||value;};}else if(document.documentElement.currentStyle&&isIE){getStyle=function(el,property){switch(toCamel(property)){case'opacity':var val=100;try{val=el.filters['DXImageTransform.Microsoft.Alpha'].opacity;}catch(e){try{val=el.filters('alpha').opacity;}catch(e){}}
return val/100;break;default:var value=el.currentStyle?el.currentStyle[property]:null;return(el.style[property]||value);}};}else{getStyle=function(el,property){return el.style[property];};}
if(isIE){setStyle=function(el,property,val){switch(property){case'opacity':if(typeof el.style.filter=='string'){el.style.filter='alpha(opacity='+val*100+')';if(!el.currentStyle||!el.currentStyle.hasLayout){el.style.zoom=1;}}
break;default:el.style[property]=val;}};}else{setStyle=function(el,property,val){el.style[property]=val;};}
YAHOO.util.Dom={get:function(el){if(!el){return null;}
if(typeof el!='string'&&!(el instanceof Array)){return el;}
if(typeof el=='string'){return document.getElementById(el);}
else{var collection=[];for(var i=0,len=el.length;i<len;++i){collection[collection.length]=Y.Dom.get(el[i]);}
return collection;}
return null;},getStyle:function(el,property){property=toCamel(property);var f=function(element){return getStyle(element,property);};return Y.Dom.batch(el,f,Y.Dom,true);},setStyle:function(el,property,val){property=toCamel(property);var f=function(element){setStyle(element,property,val);};Y.Dom.batch(el,f,Y.Dom,true);},getXY:function(el){var f=function(el){if(el.parentNode===null||el.offsetParent===null||this.getStyle(el,'display')=='none'){return false;}
var parentNode=null;var pos=[];var box;if(el.getBoundingClientRect){box=el.getBoundingClientRect();var doc=document;if(!this.inDocument(el)&&parent.document!=document){doc=parent.document;if(!this.isAncestor(doc.documentElement,el)){return false;}}
var scrollTop=Math.max(doc.documentElement.scrollTop,doc.body.scrollTop);var scrollLeft=Math.max(doc.documentElement.scrollLeft,doc.body.scrollLeft);return[box.left+scrollLeft,box.top+scrollTop];}
else{pos=[el.offsetLeft,el.offsetTop];parentNode=el.offsetParent;if(parentNode!=el){while(parentNode){pos[0]+=parentNode.offsetLeft;pos[1]+=parentNode.offsetTop;parentNode=parentNode.offsetParent;}}
if(isSafari&&this.getStyle(el,'position')=='absolute'){pos[0]-=document.body.offsetLeft;pos[1]-=document.body.offsetTop;}}
if(el.parentNode){parentNode=el.parentNode;}
else{parentNode=null;}
while(parentNode&&parentNode.tagName.toUpperCase()!='BODY'&&parentNode.tagName.toUpperCase()!='HTML')
{if(Y.Dom.getStyle(parentNode,'display')!='inline'){pos[0]-=parentNode.scrollLeft;pos[1]-=parentNode.scrollTop;}
if(parentNode.parentNode){parentNode=parentNode.parentNode;}else{parentNode=null;}}
return pos;};return Y.Dom.batch(el,f,Y.Dom,true);},getX:function(el){var f=function(el){return Y.Dom.getXY(el)[0];};return Y.Dom.batch(el,f,Y.Dom,true);},getY:function(el){var f=function(el){return Y.Dom.getXY(el)[1];};return Y.Dom.batch(el,f,Y.Dom,true);},setXY:function(el,pos,noRetry){var f=function(el){var style_pos=this.getStyle(el,'position');if(style_pos=='static'){this.setStyle(el,'position','relative');style_pos='relative';}
var pageXY=this.getXY(el);if(pageXY===false){return false;}
var delta=[parseInt(this.getStyle(el,'left'),10),parseInt(this.getStyle(el,'top'),10)];if(isNaN(delta[0])){delta[0]=(style_pos=='relative')?0:el.offsetLeft;}
if(isNaN(delta[1])){delta[1]=(style_pos=='relative')?0:el.offsetTop;}
if(pos[0]!==null){el.style.left=pos[0]-pageXY[0]+delta[0]+'px';}
if(pos[1]!==null){el.style.top=pos[1]-pageXY[1]+delta[1]+'px';}
if(!noRetry){var newXY=this.getXY(el);if((pos[0]!==null&&newXY[0]!=pos[0])||(pos[1]!==null&&newXY[1]!=pos[1])){this.setXY(el,pos,true);}}};Y.Dom.batch(el,f,Y.Dom,true);},setX:function(el,x){Y.Dom.setXY(el,[x,null]);},setY:function(el,y){Y.Dom.setXY(el,[null,y]);},getRegion:function(el){var f=function(el){var region=new Y.Region.getRegion(el);return region;};return Y.Dom.batch(el,f,Y.Dom,true);},getClientWidth:function(){return Y.Dom.getViewportWidth();},getClientHeight:function(){return Y.Dom.getViewportHeight();},getElementsByClassName:function(className,tag,root){var method=function(el){return Y.Dom.hasClass(el,className);};return Y.Dom.getElementsBy(method,tag,root);},hasClass:function(el,className){var re=new RegExp('(?:^|\\s+)'+className+'(?:\\s+|$)');var f=function(el){return re.test(el['className']);};return Y.Dom.batch(el,f,Y.Dom,true);},addClass:function(el,className){var f=function(el){if(this.hasClass(el,className)){return;}
el['className']=[el['className'],className].join(' ');};Y.Dom.batch(el,f,Y.Dom,true);},removeClass:function(el,className){var re=new RegExp('(?:^|\\s+)'+className+'(?:\\s+|$)','g');var f=function(el){if(!this.hasClass(el,className)){return;}
var c=el['className'];el['className']=c.replace(re,' ');if(this.hasClass(el,className)){this.removeClass(el,className);}};Y.Dom.batch(el,f,Y.Dom,true);},replaceClass:function(el,oldClassName,newClassName){if(oldClassName===newClassName){return false;}
var re=new RegExp('(?:^|\\s+)'+oldClassName+'(?:\\s+|$)','g');var f=function(el){if(!this.hasClass(el,oldClassName)){this.addClass(el,newClassName);return;}
el['className']=el['className'].replace(re,' '+newClassName+' ');if(this.hasClass(el,oldClassName)){this.replaceClass(el,oldClassName,newClassName);}};Y.Dom.batch(el,f,Y.Dom,true);},generateId:function(el,prefix){prefix=prefix||'yui-gen';el=el||{};var f=function(el){if(el){el=Y.Dom.get(el);}else{el={};}
if(!el.id){el.id=prefix+id_counter++;}
return el.id;};return Y.Dom.batch(el,f,Y.Dom,true);},isAncestor:function(haystack,needle){haystack=Y.Dom.get(haystack);if(!haystack||!needle){return false;}
var f=function(needle){if(haystack.contains&&!isSafari){return haystack.contains(needle);}
else if(haystack.compareDocumentPosition){return!!(haystack.compareDocumentPosition(needle)&16);}
else{var parent=needle.parentNode;while(parent){if(parent==haystack){return true;}
else if(!parent.tagName||parent.tagName.toUpperCase()=='HTML'){return false;}
parent=parent.parentNode;}
return false;}};return Y.Dom.batch(needle,f,Y.Dom,true);},inDocument:function(el){var f=function(el){return this.isAncestor(document.documentElement,el);};return Y.Dom.batch(el,f,Y.Dom,true);},getElementsBy:function(method,tag,root){tag=tag||'*';var nodes=[];if(root){root=Y.Dom.get(root);if(!root){return nodes;}}else{root=document;}
var elements=root.getElementsByTagName(tag);if(!elements.length&&(tag=='*'&&root.all)){elements=root.all;}
for(var i=0,len=elements.length;i<len;++i){if(method(elements[i])){nodes[nodes.length]=elements[i];}}
return nodes;},batch:function(el,method,o,override){var id=el;el=Y.Dom.get(el);var scope=(override)?o:window;if(!el||el.tagName||!el.length){if(!el){return false;}
return method.call(scope,el,o);}
var collection=[];for(var i=0,len=el.length;i<len;++i){if(!el[i]){id=el[i];}
collection[collection.length]=method.call(scope,el[i],o);}
return collection;},getDocumentHeight:function(){var scrollHeight=(document.compatMode!='CSS1Compat')?document.body.scrollHeight:document.documentElement.scrollHeight;var h=Math.max(scrollHeight,Y.Dom.getViewportHeight());return h;},getDocumentWidth:function(){var scrollWidth=(document.compatMode!='CSS1Compat')?document.body.scrollWidth:document.documentElement.scrollWidth;var w=Math.max(scrollWidth,Y.Dom.getViewportWidth());return w;},getViewportHeight:function(){var height=self.innerHeight;var mode=document.compatMode;if((mode||isIE)&&!isOpera){height=(mode=='CSS1Compat')?document.documentElement.clientHeight:document.body.clientHeight;}
return height;},getViewportWidth:function(){var width=self.innerWidth;var mode=document.compatMode;if(mode||isIE){width=(mode=='CSS1Compat')?document.documentElement.clientWidth:document.body.clientWidth;}
return width;}};})();YAHOO.util.Region=function(t,r,b,l){this.top=t;this[1]=t;this.right=r;this.bottom=b;this.left=l;this[0]=l;};YAHOO.util.Region.prototype.contains=function(region){return(region.left>=this.left&&region.right<=this.right&&region.top>=this.top&&region.bottom<=this.bottom);};YAHOO.util.Region.prototype.getArea=function(){return((this.bottom-this.top)*(this.right-this.left));};YAHOO.util.Region.prototype.intersect=function(region){var t=Math.max(this.top,region.top);var r=Math.min(this.right,region.right);var b=Math.min(this.bottom,region.bottom);var l=Math.max(this.left,region.left);if(b>=t&&r>=l){return new YAHOO.util.Region(t,r,b,l);}else{return null;}};YAHOO.util.Region.prototype.union=function(region){var t=Math.min(this.top,region.top);var r=Math.max(this.right,region.right);var b=Math.max(this.bottom,region.bottom);var l=Math.min(this.left,region.left);return new YAHOO.util.Region(t,r,b,l);};YAHOO.util.Region.prototype.toString=function(){return("Region {"+"top: "+this.top+", right: "+this.right+", bottom: "+this.bottom+", left: "+this.left+"}");};YAHOO.util.Region.getRegion=function(el){var p=YAHOO.util.Dom.getXY(el);var t=p[1];var r=p[0]+el.offsetWidth;var b=p[1]+el.offsetHeight;var l=p[0];return new YAHOO.util.Region(t,r,b,l);};YAHOO.util.Point=function(x,y){if(x instanceof Array){y=x[1];x=x[0];}
this.x=this.right=this.left=this[0]=x;this.y=this.top=this.bottom=this[1]=y;};YAHOO.util.Point.prototype=new YAHOO.util.Region();YAHOO.register("dom",YAHOO.util.Dom,{version:"2.2.0",build:"127"});
if(!YAHOO.util.Event){YAHOO.util.Event=function(){var loadComplete=false;var listeners=[];var unloadListeners=[];var legacyEvents=[];var legacyHandlers=[];var retryCount=0;var onAvailStack=[];var legacyMap=[];var counter=0;var lastError=null;return{POLL_RETRYS:200,POLL_INTERVAL:20,EL:0,TYPE:1,FN:2,WFN:3,OBJ:3,ADJ_SCOPE:4,isSafari:(/KHTML/gi).test(navigator.userAgent),webkit:function(){var v=navigator.userAgent.match(/AppleWebKit\/([^ ]*)/);if(v&&v[1]){return v[1];}
return null;}(),isIE:(!this.webkit&&!navigator.userAgent.match(/opera/gi)&&navigator.userAgent.match(/msie/gi)),_interval:null,startInterval:function(){if(!this._interval){var self=this;var callback=function(){self._tryPreloadAttach();};this._interval=setInterval(callback,this.POLL_INTERVAL);}},onAvailable:function(p_id,p_fn,p_obj,p_override){onAvailStack.push({id:p_id,fn:p_fn,obj:p_obj,override:p_override,checkReady:false});retryCount=this.POLL_RETRYS;this.startInterval();},onContentReady:function(p_id,p_fn,p_obj,p_override){onAvailStack.push({id:p_id,fn:p_fn,obj:p_obj,override:p_override,checkReady:true});retryCount=this.POLL_RETRYS;this.startInterval();},addListener:function(el,sType,fn,obj,override){if(!fn||!fn.call){return false;}
if(this._isValidCollection(el)){var ok=true;for(var i=0,len=el.length;i<len;++i){ok=this.on(el[i],sType,fn,obj,override)&&ok;}
return ok;}else if(typeof el=="string"){var oEl=this.getEl(el);if(oEl){el=oEl;}else{this.onAvailable(el,function(){YAHOO.util.Event.on(el,sType,fn,obj,override);});return true;}}
if(!el){return false;}
if("unload"==sType&&obj!==this){unloadListeners[unloadListeners.length]=[el,sType,fn,obj,override];return true;}
var scope=el;if(override){if(override===true){scope=obj;}else{scope=override;}}
var wrappedFn=function(e){return fn.call(scope,YAHOO.util.Event.getEvent(e),obj);};var li=[el,sType,fn,wrappedFn,scope];var index=listeners.length;listeners[index]=li;if(this.useLegacyEvent(el,sType)){var legacyIndex=this.getLegacyIndex(el,sType);if(legacyIndex==-1||el!=legacyEvents[legacyIndex][0]){legacyIndex=legacyEvents.length;legacyMap[el.id+sType]=legacyIndex;legacyEvents[legacyIndex]=[el,sType,el["on"+sType]];legacyHandlers[legacyIndex]=[];el["on"+sType]=function(e){YAHOO.util.Event.fireLegacyEvent(YAHOO.util.Event.getEvent(e),legacyIndex);};}
legacyHandlers[legacyIndex].push(li);}else{try{this._simpleAdd(el,sType,wrappedFn,false);}catch(ex){this.lastError=ex;this.removeListener(el,sType,fn);return false;}}
return true;},fireLegacyEvent:function(e,legacyIndex){var ok=true,le,lh,li,scope,ret;lh=legacyHandlers[legacyIndex];for(var i=0,len=lh.length;i<len;++i){li=lh[i];if(li&&li[this.WFN]){scope=li[this.ADJ_SCOPE];ret=li[this.WFN].call(scope,e);ok=(ok&&ret);}}
le=legacyEvents[legacyIndex];if(le&&le[2]){le[2](e);}
return ok;},getLegacyIndex:function(el,sType){var key=this.generateId(el)+sType;if(typeof legacyMap[key]=="undefined"){return-1;}else{return legacyMap[key];}},useLegacyEvent:function(el,sType){if(this.webkit&&("click"==sType||"dblclick"==sType)){var v=parseInt(this.webkit,10);if(!isNaN(v)&&v<418){return true;}}
return false;},removeListener:function(el,sType,fn){var i,len;if(typeof el=="string"){el=this.getEl(el);}else if(this._isValidCollection(el)){var ok=true;for(i=0,len=el.length;i<len;++i){ok=(this.removeListener(el[i],sType,fn)&&ok);}
return ok;}
if(!fn||!fn.call){return this.purgeElement(el,false,sType);}
if("unload"==sType){for(i=0,len=unloadListeners.length;i<len;i++){var li=unloadListeners[i];if(li&&li[0]==el&&li[1]==sType&&li[2]==fn){unloadListeners.splice(i,1);return true;}}
return false;}
var cacheItem=null;var index=arguments[3];if("undefined"==typeof index){index=this._getCacheIndex(el,sType,fn);}
if(index>=0){cacheItem=listeners[index];}
if(!el||!cacheItem){return false;}
if(this.useLegacyEvent(el,sType)){var legacyIndex=this.getLegacyIndex(el,sType);var llist=legacyHandlers[legacyIndex];if(llist){for(i=0,len=llist.length;i<len;++i){li=llist[i];if(li&&li[this.EL]==el&&li[this.TYPE]==sType&&li[this.FN]==fn){llist.splice(i,1);break;}}}}else{try{this._simpleRemove(el,sType,cacheItem[this.WFN],false);}catch(ex){this.lastError=ex;return false;}}
delete listeners[index][this.WFN];delete listeners[index][this.FN];listeners.splice(index,1);return true;},getTarget:function(ev,resolveTextNode){var t=ev.target||ev.srcElement;return this.resolveTextNode(t);},resolveTextNode:function(node){if(node&&3==node.nodeType){return node.parentNode;}else{return node;}},getPageX:function(ev){var x=ev.pageX;if(!x&&0!==x){x=ev.clientX||0;if(this.isIE){x+=this._getScrollLeft();}}
return x;},getPageY:function(ev){var y=ev.pageY;if(!y&&0!==y){y=ev.clientY||0;if(this.isIE){y+=this._getScrollTop();}}
return y;},getXY:function(ev){return[this.getPageX(ev),this.getPageY(ev)];},getRelatedTarget:function(ev){var t=ev.relatedTarget;if(!t){if(ev.type=="mouseout"){t=ev.toElement;}else if(ev.type=="mouseover"){t=ev.fromElement;}}
return this.resolveTextNode(t);},getTime:function(ev){if(!ev.time){var t=new Date().getTime();try{ev.time=t;}catch(ex){this.lastError=ex;return t;}}
return ev.time;},stopEvent:function(ev){this.stopPropagation(ev);this.preventDefault(ev);},stopPropagation:function(ev){if(ev.stopPropagation){ev.stopPropagation();}else{ev.cancelBubble=true;}},preventDefault:function(ev){if(ev.preventDefault){ev.preventDefault();}else{ev.returnValue=false;}},getEvent:function(e){var ev=e||window.event;if(!ev){var c=this.getEvent.caller;while(c){ev=c.arguments[0];if(ev&&Event==ev.constructor){break;}
c=c.caller;}}
return ev;},getCharCode:function(ev){return ev.charCode||ev.keyCode||0;},_getCacheIndex:function(el,sType,fn){for(var i=0,len=listeners.length;i<len;++i){var li=listeners[i];if(li&&li[this.FN]==fn&&li[this.EL]==el&&li[this.TYPE]==sType){return i;}}
return-1;},generateId:function(el){var id=el.id;if(!id){id="yuievtautoid-"+counter;++counter;el.id=id;}
return id;},_isValidCollection:function(o){return(o&&o.length&&typeof o!="string"&&!o.tagName&&!o.alert&&typeof o[0]!="undefined");},elCache:{},getEl:function(id){return document.getElementById(id);},clearCache:function(){},_load:function(e){loadComplete=true;var EU=YAHOO.util.Event;if(this.isIE){EU._simpleRemove(window,"load",EU._load);}},_tryPreloadAttach:function(){if(this.locked){return false;}
this.locked=true;var tryAgain=!loadComplete;if(!tryAgain){tryAgain=(retryCount>0);}
var notAvail=[];for(var i=0,len=onAvailStack.length;i<len;++i){var item=onAvailStack[i];if(item){var el=this.getEl(item.id);if(el){if(!item.checkReady||loadComplete||el.nextSibling||(document&&document.body)){var scope=el;if(item.override){if(item.override===true){scope=item.obj;}else{scope=item.override;}}
item.fn.call(scope,item.obj);onAvailStack[i]=null;}}else{notAvail.push(item);}}}
retryCount=(notAvail.length===0)?0:retryCount-1;if(tryAgain){this.startInterval();}else{clearInterval(this._interval);this._interval=null;}
this.locked=false;return true;},purgeElement:function(el,recurse,sType){var elListeners=this.getListeners(el,sType);if(elListeners){for(var i=0,len=elListeners.length;i<len;++i){var l=elListeners[i];this.removeListener(el,l.type,l.fn);}}
if(recurse&&el&&el.childNodes){for(i=0,len=el.childNodes.length;i<len;++i){this.purgeElement(el.childNodes[i],recurse,sType);}}},getListeners:function(el,sType){var results=[],searchLists;if(!sType){searchLists=[listeners,unloadListeners];}else if(sType=="unload"){searchLists=[unloadListeners];}else{searchLists=[listeners];}
for(var j=0;j<searchLists.length;++j){var searchList=searchLists[j];if(searchList&&searchList.length>0){for(var i=0,len=searchList.length;i<len;++i){var l=searchList[i];if(l&&l[this.EL]===el&&(!sType||sType===l[this.TYPE])){results.push({type:l[this.TYPE],fn:l[this.FN],obj:l[this.OBJ],adjust:l[this.ADJ_SCOPE],index:i});}}}}
return(results.length)?results:null;},_unload:function(e){var EU=YAHOO.util.Event,i,j,l,len,index;for(i=0,len=unloadListeners.length;i<len;++i){l=unloadListeners[i];if(l){var scope=window;if(l[EU.ADJ_SCOPE]){if(l[EU.ADJ_SCOPE]===true){scope=l[EU.OBJ];}else{scope=l[EU.ADJ_SCOPE];}}
l[EU.FN].call(scope,EU.getEvent(e),l[EU.OBJ]);unloadListeners[i]=null;l=null;scope=null;}}
unloadListeners=null;if(listeners&&listeners.length>0){j=listeners.length;while(j){index=j-1;l=listeners[index];if(l){EU.removeListener(l[EU.EL],l[EU.TYPE],l[EU.FN],index);}
j=j-1;}
l=null;EU.clearCache();}
for(i=0,len=legacyEvents.length;i<len;++i){legacyEvents[i][0]=null;legacyEvents[i]=null;}
legacyEvents=null;EU._simpleRemove(window,"unload",EU._unload);},_getScrollLeft:function(){return this._getScroll()[1];},_getScrollTop:function(){return this._getScroll()[0];},_getScroll:function(){var dd=document.documentElement,db=document.body;if(dd&&(dd.scrollTop||dd.scrollLeft)){return[dd.scrollTop,dd.scrollLeft];}else if(db){return[db.scrollTop,db.scrollLeft];}else{return[0,0];}},regCE:function(){},_simpleAdd:function(){if(window.addEventListener){return function(el,sType,fn,capture){el.addEventListener(sType,fn,(capture));};}else if(window.attachEvent){return function(el,sType,fn,capture){el.attachEvent("on"+sType,fn);};}else{return function(){};}}(),_simpleRemove:function(){if(window.removeEventListener){return function(el,sType,fn,capture){el.removeEventListener(sType,fn,(capture));};}else if(window.detachEvent){return function(el,sType,fn){el.detachEvent("on"+sType,fn);};}else{return function(){};}}()};}();(function(){var EU=YAHOO.util.Event;EU.on=EU.addListener;if(document&&document.body){EU._load();}else{EU._simpleAdd(window,"load",EU._load);}
EU._simpleAdd(window,"unload",EU._unload);EU._tryPreloadAttach();})();}
YAHOO.util.CustomEvent=function(type,oScope,silent,signature){this.type=type;this.scope=oScope||window;this.silent=silent;this.signature=signature||YAHOO.util.CustomEvent.LIST;this.subscribers=[];if(!this.silent){}
var onsubscribeType="_YUICEOnSubscribe";if(type!==onsubscribeType){this.subscribeEvent=new YAHOO.util.CustomEvent(onsubscribeType,this,true);}};YAHOO.util.CustomEvent.LIST=0;YAHOO.util.CustomEvent.FLAT=1;YAHOO.util.CustomEvent.prototype={subscribe:function(fn,obj,override){if(this.subscribeEvent){this.subscribeEvent.fire(fn,obj,override);}
this.subscribers.push(new YAHOO.util.Subscriber(fn,obj,override));},unsubscribe:function(fn,obj){if(!fn){return this.unsubscribeAll();}
var found=false;for(var i=0,len=this.subscribers.length;i<len;++i){var s=this.subscribers[i];if(s&&s.contains(fn,obj)){this._delete(i);found=true;}}
return found;},fire:function(){var len=this.subscribers.length;if(!len&&this.silent){return true;}
var args=[],ret=true,i;for(i=0;i<arguments.length;++i){args.push(arguments[i]);}
var argslength=args.length;if(!this.silent){}
for(i=0;i<len;++i){var s=this.subscribers[i];if(s){if(!this.silent){}
var scope=s.getScope(this.scope);if(this.signature==YAHOO.util.CustomEvent.FLAT){var param=null;if(args.length>0){param=args[0];}
ret=s.fn.call(scope,param,s.obj);}else{ret=s.fn.call(scope,this.type,args,s.obj);}
if(false===ret){if(!this.silent){}
return false;}}}
return true;},unsubscribeAll:function(){for(var i=0,len=this.subscribers.length;i<len;++i){this._delete(len-1-i);}
return i;},_delete:function(index){var s=this.subscribers[index];if(s){delete s.fn;delete s.obj;}
this.subscribers.splice(index,1);},toString:function(){return"CustomEvent: "+"'"+this.type+"', "+"scope: "+this.scope;}};YAHOO.util.Subscriber=function(fn,obj,override){this.fn=fn;this.obj=obj||null;this.override=override;};YAHOO.util.Subscriber.prototype.getScope=function(defaultScope){if(this.override){if(this.override===true){return this.obj;}else{return this.override;}}
return defaultScope;};YAHOO.util.Subscriber.prototype.contains=function(fn,obj){if(obj){return(this.fn==fn&&this.obj==obj);}else{return(this.fn==fn);}};YAHOO.util.Subscriber.prototype.toString=function(){return"Subscriber { obj: "+(this.obj||"")+", override: "+(this.override||"no")+" }";};YAHOO.util.EventProvider=function(){};YAHOO.util.EventProvider.prototype={__yui_events:null,__yui_subscribers:null,subscribe:function(p_type,p_fn,p_obj,p_override){this.__yui_events=this.__yui_events||{};var ce=this.__yui_events[p_type];if(ce){ce.subscribe(p_fn,p_obj,p_override);}else{this.__yui_subscribers=this.__yui_subscribers||{};var subs=this.__yui_subscribers;if(!subs[p_type]){subs[p_type]=[];}
subs[p_type].push({fn:p_fn,obj:p_obj,override:p_override});}},unsubscribe:function(p_type,p_fn,p_obj){this.__yui_events=this.__yui_events||{};var ce=this.__yui_events[p_type];if(ce){return ce.unsubscribe(p_fn,p_obj);}else{return false;}},unsubscribeAll:function(p_type){return this.unsubscribe(p_type);},createEvent:function(p_type,p_config){this.__yui_events=this.__yui_events||{};var opts=p_config||{};var events=this.__yui_events;if(events[p_type]){}else{var scope=opts.scope||this;var silent=opts.silent||null;var ce=new YAHOO.util.CustomEvent(p_type,scope,silent,YAHOO.util.CustomEvent.FLAT);events[p_type]=ce;if(opts.onSubscribeCallback){ce.subscribeEvent.subscribe(opts.onSubscribeCallback);}
this.__yui_subscribers=this.__yui_subscribers||{};var qs=this.__yui_subscribers[p_type];if(qs){for(var i=0;i<qs.length;++i){ce.subscribe(qs[i].fn,qs[i].obj,qs[i].override);}}}
return events[p_type];},fireEvent:function(p_type,arg1,arg2,etc){this.__yui_events=this.__yui_events||{};var ce=this.__yui_events[p_type];if(ce){var args=[];for(var i=1;i<arguments.length;++i){args.push(arguments[i]);}
return ce.fire.apply(ce,args);}else{return null;}},hasEvent:function(type){if(this.__yui_events){if(this.__yui_events[type]){return true;}}
return false;}};YAHOO.util.KeyListener=function(attachTo,keyData,handler,event){if(!attachTo){}else if(!keyData){}else if(!handler){}
if(!event){event=YAHOO.util.KeyListener.KEYDOWN;}
var keyEvent=new YAHOO.util.CustomEvent("keyPressed");this.enabledEvent=new YAHOO.util.CustomEvent("enabled");this.disabledEvent=new YAHOO.util.CustomEvent("disabled");if(typeof attachTo=='string'){attachTo=document.getElementById(attachTo);}
if(typeof handler=='function'){keyEvent.subscribe(handler);}else{keyEvent.subscribe(handler.fn,handler.scope,handler.correctScope);}
function handleKeyPress(e,obj){if(!keyData.shift){keyData.shift=false;}
if(!keyData.alt){keyData.alt=false;}
if(!keyData.ctrl){keyData.ctrl=false;}
if(e.shiftKey==keyData.shift&&e.altKey==keyData.alt&&e.ctrlKey==keyData.ctrl){var dataItem;var keyPressed;if(keyData.keys instanceof Array){for(var i=0;i<keyData.keys.length;i++){dataItem=keyData.keys[i];if(dataItem==e.charCode){keyEvent.fire(e.charCode,e);break;}else if(dataItem==e.keyCode){keyEvent.fire(e.keyCode,e);break;}}}else{dataItem=keyData.keys;if(dataItem==e.charCode){keyEvent.fire(e.charCode,e);}else if(dataItem==e.keyCode){keyEvent.fire(e.keyCode,e);}}}}
this.enable=function(){if(!this.enabled){YAHOO.util.Event.addListener(attachTo,event,handleKeyPress);this.enabledEvent.fire(keyData);}
this.enabled=true;};this.disable=function(){if(this.enabled){YAHOO.util.Event.removeListener(attachTo,event,handleKeyPress);this.disabledEvent.fire(keyData);}
this.enabled=false;};this.toString=function(){return"KeyListener ["+keyData.keys+"] "+attachTo.tagName+
(attachTo.id?"["+attachTo.id+"]":"");};};YAHOO.util.KeyListener.KEYDOWN="keydown";YAHOO.util.KeyListener.KEYUP="keyup";YAHOO.register("event",YAHOO.util.Event,{version:"2.2.0",build:"127"});YAHOO.util.Connect={_msxml_progid:['MSXML2.XMLHTTP.3.0','MSXML2.XMLHTTP','Microsoft.XMLHTTP'],_http_headers:{},_has_http_headers:false,_use_default_post_header:true,_default_post_header:'application/x-www-form-urlencoded',_use_default_xhr_header:true,_default_xhr_header:'XMLHttpRequest',_has_default_headers:true,_default_headers:{},_isFormSubmit:false,_isFileUpload:false,_formNode:null,_sFormData:null,_poll:{},_timeOut:{},_polling_interval:50,_transaction_id:0,setProgId:function(id)
{this._msxml_progid.unshift(id);},setDefaultPostHeader:function(b)
{this._use_default_post_header=b;},setDefaultXhrHeader:function(b)
{this._use_default_xhr_header=b;},setPollingInterval:function(i)
{if(typeof i=='number'&&isFinite(i)){this._polling_interval=i;}},createXhrObject:function(transactionId)
{var obj,http;try
{http=new XMLHttpRequest();obj={conn:http,tId:transactionId};}
catch(e)
{for(var i=0;i<this._msxml_progid.length;++i){try
{http=new ActiveXObject(this._msxml_progid[i]);obj={conn:http,tId:transactionId};break;}
catch(e){}}}
finally
{return obj;}},getConnectionObject:function()
{var o;var tId=this._transaction_id;try
{o=this.createXhrObject(tId);if(o){this._transaction_id++;}}
catch(e){}
finally
{return o;}},asyncRequest:function(method,uri,callback,postData)
{var o=this.getConnectionObject();if(!o){return null;}
else{if(this._isFormSubmit){if(this._isFileUpload){this.uploadFile(o.tId,callback,uri,postData);this.releaseObject(o);return;}
if(method.toUpperCase()=='GET'){if(this._sFormData.length!=0){uri+=((uri.indexOf('?')==-1)?'?':'&')+this._sFormData;}
else{uri+="?"+this._sFormData;}}
else if(method.toUpperCase()=='POST'){postData=postData?this._sFormData+"&"+postData:this._sFormData;}}
o.conn.open(method,uri,true);if(this._use_default_xhr_header){if(!this._default_headers['X-Requested-With']){this.initHeader('X-Requested-With',this._default_xhr_header,true);}}
if(this._isFormSubmit||(postData&&this._use_default_post_header)){this.initHeader('Content-Type',this._default_post_header);if(this._isFormSubmit){this.resetFormState();}}
if(this._has_default_headers||this._has_http_headers){this.setHeader(o);}
this.handleReadyState(o,callback);o.conn.send(postData||null);return o;}},handleReadyState:function(o,callback)
{var oConn=this;if(callback&&callback.timeout){this._timeOut[o.tId]=window.setTimeout(function(){oConn.abort(o,callback,true);},callback.timeout);}
this._poll[o.tId]=window.setInterval(function(){if(o.conn&&o.conn.readyState==4){window.clearInterval(oConn._poll[o.tId]);delete oConn._poll[o.tId];if(callback&&callback.timeout){delete oConn._timeOut[o.tId];}
oConn.handleTransactionResponse(o,callback);}},this._polling_interval);},handleTransactionResponse:function(o,callback,isAbort)
{if(!callback){this.releaseObject(o);return;}
var httpStatus,responseObject;try
{if(o.conn.status!==undefined&&o.conn.status!=0){httpStatus=o.conn.status;}
else{httpStatus=13030;}}
catch(e){httpStatus=13030;}
if(httpStatus>=200&&httpStatus<300){responseObject=this.createResponseObject(o,callback.argument);if(callback.success){if(!callback.scope){callback.success(responseObject);}
else{callback.success.apply(callback.scope,[responseObject]);}}}
else{switch(httpStatus){case 12002:case 12029:case 12030:case 12031:case 12152:case 13030:responseObject=this.createExceptionObject(o.tId,callback.argument,(isAbort?isAbort:false));if(callback.failure){if(!callback.scope){callback.failure(responseObject);}
else{callback.failure.apply(callback.scope,[responseObject]);}}
break;default:responseObject=this.createResponseObject(o,callback.argument);if(callback.failure){if(!callback.scope){callback.failure(responseObject);}
else{callback.failure.apply(callback.scope,[responseObject]);}}}}
this.releaseObject(o);responseObject=null;},createResponseObject:function(o,callbackArg)
{var obj={};var headerObj={};try
{var headerStr=o.conn.getAllResponseHeaders();var header=headerStr.split('\n');for(var i=0;i<header.length;i++){var delimitPos=header[i].indexOf(':');if(delimitPos!=-1){headerObj[header[i].substring(0,delimitPos)]=header[i].substring(delimitPos+2);}}}
catch(e){}
obj.tId=o.tId;obj.status=o.conn.status;obj.statusText=o.conn.statusText;obj.getResponseHeader=headerObj;obj.getAllResponseHeaders=headerStr;obj.responseText=o.conn.responseText;obj.responseXML=o.conn.responseXML;if(typeof callbackArg!==undefined){obj.argument=callbackArg;}
return obj;},createExceptionObject:function(tId,callbackArg,isAbort)
{var COMM_CODE=0;var COMM_ERROR='communication failure';var ABORT_CODE=-1;var ABORT_ERROR='transaction aborted';var obj={};obj.tId=tId;if(isAbort){obj.status=ABORT_CODE;obj.statusText=ABORT_ERROR;}
else{obj.status=COMM_CODE;obj.statusText=COMM_ERROR;}
if(callbackArg){obj.argument=callbackArg;}
return obj;},initHeader:function(label,value,isDefault)
{var headerObj=(isDefault)?this._default_headers:this._http_headers;if(headerObj[label]===undefined){headerObj[label]=value;}
else{headerObj[label]=value+","+headerObj[label];}
if(isDefault){this._has_default_headers=true;}
else{this._has_http_headers=true;}},setHeader:function(o)
{if(this._has_default_headers){for(var prop in this._default_headers){if(YAHOO.lang.hasOwnProperty(this._default_headers,prop)){o.conn.setRequestHeader(prop,this._default_headers[prop]);}}}
if(this._has_http_headers){for(var prop in this._http_headers){if(YAHOO.lang.hasOwnProperty(this._http_headers,prop)){o.conn.setRequestHeader(prop,this._http_headers[prop]);}}
delete this._http_headers;this._http_headers={};this._has_http_headers=false;}},resetDefaultHeaders:function(){delete this._default_headers
this._default_headers={};this._has_default_headers=false;},setForm:function(formId,isUpload,secureUri)
{this.resetFormState();var oForm;if(typeof formId=='string'){oForm=(document.getElementById(formId)||document.forms[formId]);}
else if(typeof formId=='object'){oForm=formId;}
else{return;}
if(isUpload){this.createFrame(secureUri?secureUri:null);this._isFormSubmit=true;this._isFileUpload=true;this._formNode=oForm;return;}
var oElement,oName,oValue,oDisabled;var hasSubmit=false;for(var i=0;i<oForm.elements.length;i++){oElement=oForm.elements[i];oDisabled=oForm.elements[i].disabled;oName=oForm.elements[i].name;oValue=oForm.elements[i].value;if(!oDisabled&&oName)
{switch(oElement.type)
{case'select-one':case'select-multiple':for(var j=0;j<oElement.options.length;j++){if(oElement.options[j].selected){if(window.ActiveXObject){this._sFormData+=encodeURIComponent(oName)+'='+encodeURIComponent(oElement.options[j].attributes['value'].specified?oElement.options[j].value:oElement.options[j].text)+'&';}
else{this._sFormData+=encodeURIComponent(oName)+'='+encodeURIComponent(oElement.options[j].hasAttribute('value')?oElement.options[j].value:oElement.options[j].text)+'&';}}}
break;case'radio':case'checkbox':if(oElement.checked){this._sFormData+=encodeURIComponent(oName)+'='+encodeURIComponent(oValue)+'&';}
break;case'file':case undefined:case'reset':case'button':break;case'submit':if(hasSubmit==false){this._sFormData+=encodeURIComponent(oName)+'='+encodeURIComponent(oValue)+'&';hasSubmit=true;}
break;default:this._sFormData+=encodeURIComponent(oName)+'='+encodeURIComponent(oValue)+'&';break;}}}
this._isFormSubmit=true;this._sFormData=this._sFormData.substr(0,this._sFormData.length-1);return this._sFormData;},resetFormState:function(){this._isFormSubmit=false;this._isFileUpload=false;this._formNode=null;this._sFormData="";},createFrame:function(secureUri){var frameId='yuiIO'+this._transaction_id;if(window.ActiveXObject){var io=document.createElement('<iframe id="'+frameId+'" name="'+frameId+'" />');if(typeof secureUri=='boolean'){io.src='javascript:false';}
else if(typeof secureURI=='string'){io.src=secureUri;}}
else{var io=document.createElement('iframe');io.id=frameId;io.name=frameId;}
io.style.position='absolute';io.style.top='-1000px';io.style.left='-1000px';document.body.appendChild(io);},appendPostData:function(postData)
{var formElements=[];var postMessage=postData.split('&');for(var i=0;i<postMessage.length;i++){var delimitPos=postMessage[i].indexOf('=');if(delimitPos!=-1){formElements[i]=document.createElement('input');formElements[i].type='hidden';formElements[i].name=postMessage[i].substring(0,delimitPos);formElements[i].value=postMessage[i].substring(delimitPos+1);this._formNode.appendChild(formElements[i]);}}
return formElements;},uploadFile:function(id,callback,uri,postData){var frameId='yuiIO'+id;var uploadEncoding='multipart/form-data';var io=document.getElementById(frameId);this._formNode.action=uri;this._formNode.method='POST';this._formNode.target=frameId;if(this._formNode.encoding){this._formNode.encoding=uploadEncoding;}
else{this._formNode.enctype=uploadEncoding;}
if(postData){var oElements=this.appendPostData(postData);}
this._formNode.submit();if(oElements&&oElements.length>0){for(var i=0;i<oElements.length;i++){this._formNode.removeChild(oElements[i]);}}
this.resetFormState();var uploadCallback=function()
{var obj={};obj.tId=id;obj.argument=callback.argument;try
{obj.responseText=io.contentWindow.document.body?io.contentWindow.document.body.innerHTML:null;obj.responseXML=io.contentWindow.document.XMLDocument?io.contentWindow.document.XMLDocument:io.contentWindow.document;}
catch(e){}
if(callback&&callback.upload){if(!callback.scope){callback.upload(obj);}
else{callback.upload.apply(callback.scope,[obj]);}}
if(YAHOO.util.Event){YAHOO.util.Event.removeListener(io,"load",uploadCallback);}
else if(window.detachEvent){io.detachEvent('onload',uploadCallback);}
else{io.removeEventListener('load',uploadCallback,false);}
setTimeout(function(){document.body.removeChild(io);},100);};if(YAHOO.util.Event){YAHOO.util.Event.addListener(io,"load",uploadCallback);}
else if(window.attachEvent){io.attachEvent('onload',uploadCallback);}
else{io.addEventListener('load',uploadCallback,false);}},abort:function(o,callback,isTimeout)
{if(this.isCallInProgress(o)){o.conn.abort();window.clearInterval(this._poll[o.tId]);delete this._poll[o.tId];if(isTimeout){delete this._timeOut[o.tId];}
this.handleTransactionResponse(o,callback,true);return true;}
else{return false;}},isCallInProgress:function(o)
{if(o.conn){return o.conn.readyState!=4&&o.conn.readyState!=0;}
else{return false;}},releaseObject:function(o)
{o.conn=null;o=null;}};
YAHOO.register("connection", YAHOO.widget.Module, {version: "2.2.0", build: "127"});
YAHOO.util.Anim=function(el,attributes,duration,method){if(el){this.init(el,attributes,duration,method);}};YAHOO.util.Anim.prototype={toString:function(){var el=this.getEl();var id=el.id||el.tagName;return("Anim "+id);},patterns:{noNegatives:/width|height|opacity|padding/i,offsetAttribute:/^((width|height)|(top|left))$/,defaultUnit:/width|height|top$|bottom$|left$|right$/i,offsetUnit:/\d+(em|%|en|ex|pt|in|cm|mm|pc)$/i},doMethod:function(attr,start,end){return this.method(this.currentFrame,start,end-start,this.totalFrames);},setAttribute:function(attr,val,unit){if(this.patterns.noNegatives.test(attr)){val=(val>0)?val:0;}
YAHOO.util.Dom.setStyle(this.getEl(),attr,val+unit);},getAttribute:function(attr){var el=this.getEl();var val=YAHOO.util.Dom.getStyle(el,attr);if(val!=='auto'&&!this.patterns.offsetUnit.test(val)){return parseFloat(val);}
var a=this.patterns.offsetAttribute.exec(attr)||[];var pos=!!(a[3]);var box=!!(a[2]);if(box||(YAHOO.util.Dom.getStyle(el,'position')=='absolute'&&pos)){val=el['offset'+a[0].charAt(0).toUpperCase()+a[0].substr(1)];}else{val=0;}
return val;},getDefaultUnit:function(attr){if(this.patterns.defaultUnit.test(attr)){return'px';}
return'';},setRuntimeAttribute:function(attr){var start;var end;var attributes=this.attributes;this.runtimeAttributes[attr]={};var isset=function(prop){return(typeof prop!=='undefined');};if(!isset(attributes[attr]['to'])&&!isset(attributes[attr]['by'])){return false;}
start=(isset(attributes[attr]['from']))?attributes[attr]['from']:this.getAttribute(attr);if(isset(attributes[attr]['to'])){end=attributes[attr]['to'];}else if(isset(attributes[attr]['by'])){if(start.constructor==Array){end=[];for(var i=0,len=start.length;i<len;++i){end[i]=start[i]+attributes[attr]['by'][i];}}else{end=start+attributes[attr]['by'];}}
this.runtimeAttributes[attr].start=start;this.runtimeAttributes[attr].end=end;this.runtimeAttributes[attr].unit=(isset(attributes[attr].unit))?attributes[attr]['unit']:this.getDefaultUnit(attr);},init:function(el,attributes,duration,method){var isAnimated=false;var startTime=null;var actualFrames=0;el=YAHOO.util.Dom.get(el);this.attributes=attributes||{};this.duration=duration||1;this.method=method||YAHOO.util.Easing.easeNone;this.useSeconds=true;this.currentFrame=0;this.totalFrames=YAHOO.util.AnimMgr.fps;this.getEl=function(){return el;};this.isAnimated=function(){return isAnimated;};this.getStartTime=function(){return startTime;};this.runtimeAttributes={};this.animate=function(){if(this.isAnimated()){return false;}
this.currentFrame=0;this.totalFrames=(this.useSeconds)?Math.ceil(YAHOO.util.AnimMgr.fps*this.duration):this.duration;YAHOO.util.AnimMgr.registerElement(this);};this.stop=function(finish){if(finish){this.currentFrame=this.totalFrames;this._onTween.fire();}
YAHOO.util.AnimMgr.stop(this);};var onStart=function(){this.onStart.fire();this.runtimeAttributes={};for(var attr in this.attributes){this.setRuntimeAttribute(attr);}
isAnimated=true;actualFrames=0;startTime=new Date();};var onTween=function(){var data={duration:new Date()-this.getStartTime(),currentFrame:this.currentFrame};data.toString=function(){return('duration: '+data.duration+', currentFrame: '+data.currentFrame);};this.onTween.fire(data);var runtimeAttributes=this.runtimeAttributes;for(var attr in runtimeAttributes){this.setAttribute(attr,this.doMethod(attr,runtimeAttributes[attr].start,runtimeAttributes[attr].end),runtimeAttributes[attr].unit);}
actualFrames+=1;};var onComplete=function(){var actual_duration=(new Date()-startTime)/1000;var data={duration:actual_duration,frames:actualFrames,fps:actualFrames/actual_duration};data.toString=function(){return('duration: '+data.duration+', frames: '+data.frames+', fps: '+data.fps);};isAnimated=false;actualFrames=0;this.onComplete.fire(data);};this._onStart=new YAHOO.util.CustomEvent('_start',this,true);this.onStart=new YAHOO.util.CustomEvent('start',this);this.onTween=new YAHOO.util.CustomEvent('tween',this);this._onTween=new YAHOO.util.CustomEvent('_tween',this,true);this.onComplete=new YAHOO.util.CustomEvent('complete',this);this._onComplete=new YAHOO.util.CustomEvent('_complete',this,true);this._onStart.subscribe(onStart);this._onTween.subscribe(onTween);this._onComplete.subscribe(onComplete);}};YAHOO.util.AnimMgr=new function(){var thread=null;var queue=[];var tweenCount=0;this.fps=1000;this.delay=1;this.registerElement=function(tween){queue[queue.length]=tween;tweenCount+=1;tween._onStart.fire();this.start();};this.unRegister=function(tween,index){tween._onComplete.fire();index=index||getIndex(tween);if(index!=-1){queue.splice(index,1);}
tweenCount-=1;if(tweenCount<=0){this.stop();}};this.start=function(){if(thread===null){thread=setInterval(this.run,this.delay);}};this.stop=function(tween){if(!tween){clearInterval(thread);for(var i=0,len=queue.length;i<len;++i){if(queue[0].isAnimated()){this.unRegister(queue[0],0);}}
queue=[];thread=null;tweenCount=0;}
else{this.unRegister(tween);}};this.run=function(){for(var i=0,len=queue.length;i<len;++i){var tween=queue[i];if(!tween||!tween.isAnimated()){continue;}
if(tween.currentFrame<tween.totalFrames||tween.totalFrames===null)
{tween.currentFrame+=1;if(tween.useSeconds){correctFrame(tween);}
tween._onTween.fire();}
else{YAHOO.util.AnimMgr.stop(tween,i);}}};var getIndex=function(anim){for(var i=0,len=queue.length;i<len;++i){if(queue[i]==anim){return i;}}
return-1;};var correctFrame=function(tween){var frames=tween.totalFrames;var frame=tween.currentFrame;var expected=(tween.currentFrame*tween.duration*1000/tween.totalFrames);var elapsed=(new Date()-tween.getStartTime());var tweak=0;if(elapsed<tween.duration*1000){tweak=Math.round((elapsed/expected-1)*tween.currentFrame);}else{tweak=frames-(frame+1);}
if(tweak>0&&isFinite(tweak)){if(tween.currentFrame+tweak>=frames){tweak=frames-(frame+1);}
tween.currentFrame+=tweak;}};};YAHOO.util.Bezier=new function(){this.getPosition=function(points,t){var n=points.length;var tmp=[];for(var i=0;i<n;++i){tmp[i]=[points[i][0],points[i][1]];}
for(var j=1;j<n;++j){for(i=0;i<n-j;++i){tmp[i][0]=(1-t)*tmp[i][0]+t*tmp[parseInt(i+1,10)][0];tmp[i][1]=(1-t)*tmp[i][1]+t*tmp[parseInt(i+1,10)][1];}}
return[tmp[0][0],tmp[0][1]];};};(function(){YAHOO.util.ColorAnim=function(el,attributes,duration,method){YAHOO.util.ColorAnim.superclass.constructor.call(this,el,attributes,duration,method);};YAHOO.extend(YAHOO.util.ColorAnim,YAHOO.util.Anim);var Y=YAHOO.util;var superclass=Y.ColorAnim.superclass;var proto=Y.ColorAnim.prototype;proto.toString=function(){var el=this.getEl();var id=el.id||el.tagName;return("ColorAnim "+id);};proto.patterns.color=/color$/i;proto.patterns.rgb=/^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i;proto.patterns.hex=/^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i;proto.patterns.hex3=/^#?([0-9A-F]{1})([0-9A-F]{1})([0-9A-F]{1})$/i;proto.patterns.transparent=/^transparent|rgba\(0, 0, 0, 0\)$/;proto.parseColor=function(s){if(s.length==3){return s;}
var c=this.patterns.hex.exec(s);if(c&&c.length==4){return[parseInt(c[1],16),parseInt(c[2],16),parseInt(c[3],16)];}
c=this.patterns.rgb.exec(s);if(c&&c.length==4){return[parseInt(c[1],10),parseInt(c[2],10),parseInt(c[3],10)];}
c=this.patterns.hex3.exec(s);if(c&&c.length==4){return[parseInt(c[1]+c[1],16),parseInt(c[2]+c[2],16),parseInt(c[3]+c[3],16)];}
return null;};proto.getAttribute=function(attr){var el=this.getEl();if(this.patterns.color.test(attr)){var val=YAHOO.util.Dom.getStyle(el,attr);if(this.patterns.transparent.test(val)){var parent=el.parentNode;val=Y.Dom.getStyle(parent,attr);while(parent&&this.patterns.transparent.test(val)){parent=parent.parentNode;val=Y.Dom.getStyle(parent,attr);if(parent.tagName.toUpperCase()=='HTML'){val='#fff';}}}}else{val=superclass.getAttribute.call(this,attr);}
return val;};proto.doMethod=function(attr,start,end){var val;if(this.patterns.color.test(attr)){val=[];for(var i=0,len=start.length;i<len;++i){val[i]=superclass.doMethod.call(this,attr,start[i],end[i]);}
val='rgb('+Math.floor(val[0])+','+Math.floor(val[1])+','+Math.floor(val[2])+')';}
else{val=superclass.doMethod.call(this,attr,start,end);}
return val;};proto.setRuntimeAttribute=function(attr){superclass.setRuntimeAttribute.call(this,attr);if(this.patterns.color.test(attr)){var attributes=this.attributes;var start=this.parseColor(this.runtimeAttributes[attr].start);var end=this.parseColor(this.runtimeAttributes[attr].end);if(typeof attributes[attr]['to']==='undefined'&&typeof attributes[attr]['by']!=='undefined'){end=this.parseColor(attributes[attr].by);for(var i=0,len=start.length;i<len;++i){end[i]=start[i]+end[i];}}
this.runtimeAttributes[attr].start=start;this.runtimeAttributes[attr].end=end;}};})();YAHOO.util.Easing={easeNone:function(t,b,c,d){return c*t/d+b;},easeIn:function(t,b,c,d){return c*(t/=d)*t+b;},easeOut:function(t,b,c,d){return-c*(t/=d)*(t-2)+b;},easeBoth:function(t,b,c,d){if((t/=d/2)<1){return c/2*t*t+b;}
return-c/2*((--t)*(t-2)-1)+b;},easeInStrong:function(t,b,c,d){return c*(t/=d)*t*t*t+b;},easeOutStrong:function(t,b,c,d){return-c*((t=t/d-1)*t*t*t-1)+b;},easeBothStrong:function(t,b,c,d){if((t/=d/2)<1){return c/2*t*t*t*t+b;}
return-c/2*((t-=2)*t*t*t-2)+b;},elasticIn:function(t,b,c,d,a,p){if(t==0){return b;}
if((t/=d)==1){return b+c;}
if(!p){p=d*.3;}
if(!a||a<Math.abs(c)){a=c;var s=p/4;}
else{var s=p/(2*Math.PI)*Math.asin(c/a);}
return-(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b;},elasticOut:function(t,b,c,d,a,p){if(t==0){return b;}
if((t/=d)==1){return b+c;}
if(!p){p=d*.3;}
if(!a||a<Math.abs(c)){a=c;var s=p/4;}
else{var s=p/(2*Math.PI)*Math.asin(c/a);}
return a*Math.pow(2,-10*t)*Math.sin((t*d-s)*(2*Math.PI)/p)+c+b;},elasticBoth:function(t,b,c,d,a,p){if(t==0){return b;}
if((t/=d/2)==2){return b+c;}
if(!p){p=d*(.3*1.5);}
if(!a||a<Math.abs(c)){a=c;var s=p/4;}
else{var s=p/(2*Math.PI)*Math.asin(c/a);}
if(t<1){return-.5*(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b;}
return a*Math.pow(2,-10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p)*.5+c+b;},backIn:function(t,b,c,d,s){if(typeof s=='undefined'){s=1.70158;}
return c*(t/=d)*t*((s+1)*t-s)+b;},backOut:function(t,b,c,d,s){if(typeof s=='undefined'){s=1.70158;}
return c*((t=t/d-1)*t*((s+1)*t+s)+1)+b;},backBoth:function(t,b,c,d,s){if(typeof s=='undefined'){s=1.70158;}
if((t/=d/2)<1){return c/2*(t*t*(((s*=(1.525))+1)*t-s))+b;}
return c/2*((t-=2)*t*(((s*=(1.525))+1)*t+s)+2)+b;},bounceIn:function(t,b,c,d){return c-YAHOO.util.Easing.bounceOut(d-t,0,c,d)+b;},bounceOut:function(t,b,c,d){if((t/=d)<(1/2.75)){return c*(7.5625*t*t)+b;}else if(t<(2/2.75)){return c*(7.5625*(t-=(1.5/2.75))*t+.75)+b;}else if(t<(2.5/2.75)){return c*(7.5625*(t-=(2.25/2.75))*t+.9375)+b;}
return c*(7.5625*(t-=(2.625/2.75))*t+.984375)+b;},bounceBoth:function(t,b,c,d){if(t<d/2){return YAHOO.util.Easing.bounceIn(t*2,0,c,d)*.5+b;}
return YAHOO.util.Easing.bounceOut(t*2-d,0,c,d)*.5+c*.5+b;}};(function(){YAHOO.util.Motion=function(el,attributes,duration,method){if(el){YAHOO.util.Motion.superclass.constructor.call(this,el,attributes,duration,method);}};YAHOO.extend(YAHOO.util.Motion,YAHOO.util.ColorAnim);var Y=YAHOO.util;var superclass=Y.Motion.superclass;var proto=Y.Motion.prototype;proto.toString=function(){var el=this.getEl();var id=el.id||el.tagName;return("Motion "+id);};proto.patterns.points=/^points$/i;proto.setAttribute=function(attr,val,unit){if(this.patterns.points.test(attr)){unit=unit||'px';superclass.setAttribute.call(this,'left',val[0],unit);superclass.setAttribute.call(this,'top',val[1],unit);}else{superclass.setAttribute.call(this,attr,val,unit);}};proto.getAttribute=function(attr){if(this.patterns.points.test(attr)){var val=[superclass.getAttribute.call(this,'left'),superclass.getAttribute.call(this,'top')];}else{val=superclass.getAttribute.call(this,attr);}
return val;};proto.doMethod=function(attr,start,end){var val=null;if(this.patterns.points.test(attr)){var t=this.method(this.currentFrame,0,100,this.totalFrames)/100;val=Y.Bezier.getPosition(this.runtimeAttributes[attr],t);}else{val=superclass.doMethod.call(this,attr,start,end);}
return val;};proto.setRuntimeAttribute=function(attr){if(this.patterns.points.test(attr)){var el=this.getEl();var attributes=this.attributes;var start;var control=attributes['points']['control']||[];var end;var i,len;if(control.length>0&&!(control[0]instanceof Array)){control=[control];}else{var tmp=[];for(i=0,len=control.length;i<len;++i){tmp[i]=control[i];}
control=tmp;}
if(Y.Dom.getStyle(el,'position')=='static'){Y.Dom.setStyle(el,'position','relative');}
if(isset(attributes['points']['from'])){Y.Dom.setXY(el,attributes['points']['from']);}
else{Y.Dom.setXY(el,Y.Dom.getXY(el));}
start=this.getAttribute('points');if(isset(attributes['points']['to'])){end=translateValues.call(this,attributes['points']['to'],start);var pageXY=Y.Dom.getXY(this.getEl());for(i=0,len=control.length;i<len;++i){control[i]=translateValues.call(this,control[i],start);}}else if(isset(attributes['points']['by'])){end=[start[0]+attributes['points']['by'][0],start[1]+attributes['points']['by'][1]];for(i=0,len=control.length;i<len;++i){control[i]=[start[0]+control[i][0],start[1]+control[i][1]];}}
this.runtimeAttributes[attr]=[start];if(control.length>0){this.runtimeAttributes[attr]=this.runtimeAttributes[attr].concat(control);}
this.runtimeAttributes[attr][this.runtimeAttributes[attr].length]=end;}
else{superclass.setRuntimeAttribute.call(this,attr);}};var translateValues=function(val,start){var pageXY=Y.Dom.getXY(this.getEl());val=[val[0]-pageXY[0]+start[0],val[1]-pageXY[1]+start[1]];return val;};var isset=function(prop){return(typeof prop!=='undefined');};})();(function(){YAHOO.util.Scroll=function(el,attributes,duration,method){if(el){YAHOO.util.Scroll.superclass.constructor.call(this,el,attributes,duration,method);}};YAHOO.extend(YAHOO.util.Scroll,YAHOO.util.ColorAnim);var Y=YAHOO.util;var superclass=Y.Scroll.superclass;var proto=Y.Scroll.prototype;proto.toString=function(){var el=this.getEl();var id=el.id||el.tagName;return("Scroll "+id);};proto.doMethod=function(attr,start,end){var val=null;if(attr=='scroll'){val=[this.method(this.currentFrame,start[0],end[0]-start[0],this.totalFrames),this.method(this.currentFrame,start[1],end[1]-start[1],this.totalFrames)];}else{val=superclass.doMethod.call(this,attr,start,end);}
return val;};proto.getAttribute=function(attr){var val=null;var el=this.getEl();if(attr=='scroll'){val=[el.scrollLeft,el.scrollTop];}else{val=superclass.getAttribute.call(this,attr);}
return val;};proto.setAttribute=function(attr,val,unit){var el=this.getEl();if(attr=='scroll'){el.scrollLeft=val[0];el.scrollTop=val[1];}else{superclass.setAttribute.call(this,attr,val,unit);}};})();YAHOO.register("animation",YAHOO.util.Anim,{version:"2.2.0",build:"127"});
if(!YAHOO.util.DragDropMgr){YAHOO.util.DragDropMgr=function(){var Event=YAHOO.util.Event;return{ids:{},handleIds:{},dragCurrent:null,dragOvers:{},deltaX:0,deltaY:0,preventDefault:true,stopPropagation:true,initalized:false,locked:false,init:function(){this.initialized=true;},POINT:0,INTERSECT:1,STRICT_INTERSECT:2,mode:0,_execOnAll:function(sMethod,args){for(var i in this.ids){for(var j in this.ids[i]){var oDD=this.ids[i][j];if(!this.isTypeOfDD(oDD)){continue;}
oDD[sMethod].apply(oDD,args);}}},_onLoad:function(){this.init();Event.on(document,"mouseup",this.handleMouseUp,this,true);Event.on(document,"mousemove",this.handleMouseMove,this,true);Event.on(window,"unload",this._onUnload,this,true);Event.on(window,"resize",this._onResize,this,true);},_onResize:function(e){this._execOnAll("resetConstraints",[]);},lock:function(){this.locked=true;},unlock:function(){this.locked=false;},isLocked:function(){return this.locked;},locationCache:{},useCache:true,clickPixelThresh:3,clickTimeThresh:1000,dragThreshMet:false,clickTimeout:null,startX:0,startY:0,regDragDrop:function(oDD,sGroup){if(!this.initialized){this.init();}
if(!this.ids[sGroup]){this.ids[sGroup]={};}
this.ids[sGroup][oDD.id]=oDD;},removeDDFromGroup:function(oDD,sGroup){if(!this.ids[sGroup]){this.ids[sGroup]={};}
var obj=this.ids[sGroup];if(obj&&obj[oDD.id]){delete obj[oDD.id];}},_remove:function(oDD){for(var g in oDD.groups){if(g&&this.ids[g][oDD.id]){delete this.ids[g][oDD.id];}}
delete this.handleIds[oDD.id];},regHandle:function(sDDId,sHandleId){if(!this.handleIds[sDDId]){this.handleIds[sDDId]={};}
this.handleIds[sDDId][sHandleId]=sHandleId;},isDragDrop:function(id){return(this.getDDById(id))?true:false;},getRelated:function(p_oDD,bTargetsOnly){var oDDs=[];for(var i in p_oDD.groups){for(j in this.ids[i]){var dd=this.ids[i][j];if(!this.isTypeOfDD(dd)){continue;}
if(!bTargetsOnly||dd.isTarget){oDDs[oDDs.length]=dd;}}}
return oDDs;},isLegalTarget:function(oDD,oTargetDD){var targets=this.getRelated(oDD,true);for(var i=0,len=targets.length;i<len;++i){if(targets[i].id==oTargetDD.id){return true;}}
return false;},isTypeOfDD:function(oDD){return(oDD&&oDD.__ygDragDrop);},isHandle:function(sDDId,sHandleId){return(this.handleIds[sDDId]&&this.handleIds[sDDId][sHandleId]);},getDDById:function(id){for(var i in this.ids){if(this.ids[i][id]){return this.ids[i][id];}}
return null;},handleMouseDown:function(e,oDD){this.currentTarget=YAHOO.util.Event.getTarget(e);this.dragCurrent=oDD;var el=oDD.getEl();this.startX=YAHOO.util.Event.getPageX(e);this.startY=YAHOO.util.Event.getPageY(e);this.deltaX=this.startX-el.offsetLeft;this.deltaY=this.startY-el.offsetTop;this.dragThreshMet=false;this.clickTimeout=setTimeout(function(){var DDM=YAHOO.util.DDM;DDM.startDrag(DDM.startX,DDM.startY);},this.clickTimeThresh);},startDrag:function(x,y){clearTimeout(this.clickTimeout);if(this.dragCurrent){this.dragCurrent.b4StartDrag(x,y);this.dragCurrent.startDrag(x,y);}
this.dragThreshMet=true;},handleMouseUp:function(e){if(!this.dragCurrent){return;}
clearTimeout(this.clickTimeout);if(this.dragThreshMet){this.fireEvents(e,true);}else{}
this.stopDrag(e);this.stopEvent(e);},stopEvent:function(e){if(this.stopPropagation){YAHOO.util.Event.stopPropagation(e);}
if(this.preventDefault){YAHOO.util.Event.preventDefault(e);}},stopDrag:function(e){if(this.dragCurrent){if(this.dragThreshMet){this.dragCurrent.b4EndDrag(e);this.dragCurrent.endDrag(e);}
this.dragCurrent.onMouseUp(e);}
this.dragCurrent=null;this.dragOvers={};},handleMouseMove:function(e){if(!this.dragCurrent){return true;}
if(YAHOO.util.Event.isIE&&!e.button){this.stopEvent(e);return this.handleMouseUp(e);}
if(!this.dragThreshMet){var diffX=Math.abs(this.startX-YAHOO.util.Event.getPageX(e));var diffY=Math.abs(this.startY-YAHOO.util.Event.getPageY(e));if(diffX>this.clickPixelThresh||diffY>this.clickPixelThresh){this.startDrag(this.startX,this.startY);}}
if(this.dragThreshMet){this.dragCurrent.b4Drag(e);this.dragCurrent.onDrag(e);this.fireEvents(e,false);}
this.stopEvent(e);return true;},fireEvents:function(e,isDrop){var dc=this.dragCurrent;if(!dc||dc.isLocked()){return;}
var x=YAHOO.util.Event.getPageX(e);var y=YAHOO.util.Event.getPageY(e);var pt=new YAHOO.util.Point(x,y);var oldOvers=[];var outEvts=[];var overEvts=[];var dropEvts=[];var enterEvts=[];for(var i in this.dragOvers){var ddo=this.dragOvers[i];if(!this.isTypeOfDD(ddo)){continue;}
if(!this.isOverTarget(pt,ddo,this.mode)){outEvts.push(ddo);}
oldOvers[i]=true;delete this.dragOvers[i];}
for(var sGroup in dc.groups){if("string"!=typeof sGroup){continue;}
for(i in this.ids[sGroup]){var oDD=this.ids[sGroup][i];if(!this.isTypeOfDD(oDD)){continue;}
if(oDD.isTarget&&!oDD.isLocked()&&oDD!=dc){if(this.isOverTarget(pt,oDD,this.mode)){if(isDrop){dropEvts.push(oDD);}else{if(!oldOvers[oDD.id]){enterEvts.push(oDD);}else{overEvts.push(oDD);}
this.dragOvers[oDD.id]=oDD;}}}}}
if(this.mode){if(outEvts.length){dc.b4DragOut(e,outEvts);dc.onDragOut(e,outEvts);}
if(enterEvts.length){dc.onDragEnter(e,enterEvts);}
if(overEvts.length){dc.b4DragOver(e,overEvts);dc.onDragOver(e,overEvts);}
if(dropEvts.length){dc.b4DragDrop(e,dropEvts);dc.onDragDrop(e,dropEvts);}}else{var len=0;for(i=0,len=outEvts.length;i<len;++i){dc.b4DragOut(e,outEvts[i].id);dc.onDragOut(e,outEvts[i].id);}
for(i=0,len=enterEvts.length;i<len;++i){dc.onDragEnter(e,enterEvts[i].id);}
for(i=0,len=overEvts.length;i<len;++i){dc.b4DragOver(e,overEvts[i].id);dc.onDragOver(e,overEvts[i].id);}
for(i=0,len=dropEvts.length;i<len;++i){dc.b4DragDrop(e,dropEvts[i].id);dc.onDragDrop(e,dropEvts[i].id);}}
if(isDrop&&!dropEvts.length){dc.onInvalidDrop(e);}},getBestMatch:function(dds){var winner=null;var len=dds.length;if(len==1){winner=dds[0];}else{for(var i=0;i<len;++i){var dd=dds[i];if(this.mode==this.INTERSECT&&dd.cursorIsOver){winner=dd;break;}else{if(!winner||!winner.overlap||(dd.overlap&&winner.overlap.getArea()<dd.overlap.getArea())){winner=dd;}}}}
return winner;},refreshCache:function(groups){var g=groups||this.ids;for(var sGroup in g){if("string"!=typeof sGroup){continue;}
for(var i in this.ids[sGroup]){var oDD=this.ids[sGroup][i];if(this.isTypeOfDD(oDD)){var loc=this.getLocation(oDD);if(loc){this.locationCache[oDD.id]=loc;}else{delete this.locationCache[oDD.id];}}}}},verifyEl:function(el){try{if(el){var parent=el.offsetParent;if(parent){return true;}}}catch(e){}
return false;},getLocation:function(oDD){if(!this.isTypeOfDD(oDD)){return null;}
var el=oDD.getEl(),pos,x1,x2,y1,y2,t,r,b,l;try{pos=YAHOO.util.Dom.getXY(el);}catch(e){}
if(!pos){return null;}
x1=pos[0];x2=x1+el.offsetWidth;y1=pos[1];y2=y1+el.offsetHeight;t=y1-oDD.padding[0];r=x2+oDD.padding[1];b=y2+oDD.padding[2];l=x1-oDD.padding[3];return new YAHOO.util.Region(t,r,b,l);},isOverTarget:function(pt,oTarget,intersect){var loc=this.locationCache[oTarget.id];if(!loc||!this.useCache){loc=this.getLocation(oTarget);this.locationCache[oTarget.id]=loc;}
if(!loc){return false;}
oTarget.cursorIsOver=loc.contains(pt);var dc=this.dragCurrent;if(!dc||!dc.getTargetCoord||(!intersect&&!dc.constrainX&&!dc.constrainY)){return oTarget.cursorIsOver;}
oTarget.overlap=null;var pos=dc.getTargetCoord(pt.x,pt.y);var el=dc.getDragEl();var curRegion=new YAHOO.util.Region(pos.y,pos.x+el.offsetWidth,pos.y+el.offsetHeight,pos.x);var overlap=curRegion.intersect(loc);if(overlap){oTarget.overlap=overlap;return(intersect)?true:oTarget.cursorIsOver;}else{return false;}},_onUnload:function(e,me){this.unregAll();},unregAll:function(){if(this.dragCurrent){this.stopDrag();this.dragCurrent=null;}
this._execOnAll("unreg",[]);for(i in this.elementCache){delete this.elementCache[i];}
this.elementCache={};this.ids={};},elementCache:{},getElWrapper:function(id){var oWrapper=this.elementCache[id];if(!oWrapper||!oWrapper.el){oWrapper=this.elementCache[id]=new this.ElementWrapper(YAHOO.util.Dom.get(id));}
return oWrapper;},getElement:function(id){return YAHOO.util.Dom.get(id);},getCss:function(id){var el=YAHOO.util.Dom.get(id);return(el)?el.style:null;},ElementWrapper:function(el){this.el=el||null;this.id=this.el&&el.id;this.css=this.el&&el.style;},getPosX:function(el){return YAHOO.util.Dom.getX(el);},getPosY:function(el){return YAHOO.util.Dom.getY(el);},swapNode:function(n1,n2){if(n1.swapNode){n1.swapNode(n2);}else{var p=n2.parentNode;var s=n2.nextSibling;if(s==n1){p.insertBefore(n1,n2);}else if(n2==n1.nextSibling){p.insertBefore(n2,n1);}else{n1.parentNode.replaceChild(n2,n1);p.insertBefore(n1,s);}}},getScroll:function(){var t,l,dde=document.documentElement,db=document.body;if(dde&&(dde.scrollTop||dde.scrollLeft)){t=dde.scrollTop;l=dde.scrollLeft;}else if(db){t=db.scrollTop;l=db.scrollLeft;}else{}
return{top:t,left:l};},getStyle:function(el,styleProp){return YAHOO.util.Dom.getStyle(el,styleProp);},getScrollTop:function(){return this.getScroll().top;},getScrollLeft:function(){return this.getScroll().left;},moveToEl:function(moveEl,targetEl){var aCoord=YAHOO.util.Dom.getXY(targetEl);YAHOO.util.Dom.setXY(moveEl,aCoord);},getClientHeight:function(){return YAHOO.util.Dom.getViewportHeight();},getClientWidth:function(){return YAHOO.util.Dom.getViewportWidth();},numericSort:function(a,b){return(a-b);},_timeoutCount:0,_addListeners:function(){var DDM=YAHOO.util.DDM;if(YAHOO.util.Event&&document){DDM._onLoad();}else{if(DDM._timeoutCount>2000){}else{setTimeout(DDM._addListeners,10);if(document&&document.body){DDM._timeoutCount+=1;}}}},handleWasClicked:function(node,id){if(this.isHandle(id,node.id)){return true;}else{var p=node.parentNode;while(p){if(this.isHandle(id,p.id)){return true;}else{p=p.parentNode;}}}
return false;}};}();YAHOO.util.DDM=YAHOO.util.DragDropMgr;YAHOO.util.DDM._addListeners();}
(function(){var Event=YAHOO.util.Event;var Dom=YAHOO.util.Dom;YAHOO.util.DragDrop=function(id,sGroup,config){if(id){this.init(id,sGroup,config);}};YAHOO.util.DragDrop.prototype={id:null,config:null,dragElId:null,handleElId:null,invalidHandleTypes:null,invalidHandleIds:null,invalidHandleClasses:null,startPageX:0,startPageY:0,groups:null,locked:false,lock:function(){this.locked=true;},unlock:function(){this.locked=false;},isTarget:true,padding:null,_domRef:null,__ygDragDrop:true,constrainX:false,constrainY:false,minX:0,maxX:0,minY:0,maxY:0,maintainOffset:false,xTicks:null,yTicks:null,primaryButtonOnly:true,available:false,hasOuterHandles:false,b4StartDrag:function(x,y){},startDrag:function(x,y){},b4Drag:function(e){},onDrag:function(e){},onDragEnter:function(e,id){},b4DragOver:function(e){},onDragOver:function(e,id){},b4DragOut:function(e){},onDragOut:function(e,id){},b4DragDrop:function(e){},onDragDrop:function(e,id){},onInvalidDrop:function(e){},b4EndDrag:function(e){},endDrag:function(e){},b4MouseDown:function(e){},onMouseDown:function(e){},onMouseUp:function(e){},onAvailable:function(){},getEl:function(){if(!this._domRef){this._domRef=Dom.get(this.id);}
return this._domRef;},getDragEl:function(){return Dom.get(this.dragElId);},init:function(id,sGroup,config){this.initTarget(id,sGroup,config);Event.on(this.id,"mousedown",this.handleMouseDown,this,true);},initTarget:function(id,sGroup,config){this.config=config||{};this.DDM=YAHOO.util.DDM;this.groups={};if(typeof id!=="string"){id=Dom.generateId(id);}
this.id=id;this.addToGroup((sGroup)?sGroup:"default");this.handleElId=id;Event.onAvailable(id,this.handleOnAvailable,this,true);this.setDragElId(id);this.invalidHandleTypes={A:"A"};this.invalidHandleIds={};this.invalidHandleClasses=[];this.applyConfig();},applyConfig:function(){this.padding=this.config.padding||[0,0,0,0];this.isTarget=(this.config.isTarget!==false);this.maintainOffset=(this.config.maintainOffset);this.primaryButtonOnly=(this.config.primaryButtonOnly!==false);},handleOnAvailable:function(){this.available=true;this.resetConstraints();this.onAvailable();},setPadding:function(iTop,iRight,iBot,iLeft){if(!iRight&&0!==iRight){this.padding=[iTop,iTop,iTop,iTop];}else if(!iBot&&0!==iBot){this.padding=[iTop,iRight,iTop,iRight];}else{this.padding=[iTop,iRight,iBot,iLeft];}},setInitPosition:function(diffX,diffY){var el=this.getEl();if(!this.DDM.verifyEl(el)){return;}
var dx=diffX||0;var dy=diffY||0;var p=Dom.getXY(el);this.initPageX=p[0]-dx;this.initPageY=p[1]-dy;this.lastPageX=p[0];this.lastPageY=p[1];this.setStartPosition(p);},setStartPosition:function(pos){var p=pos||Dom.getXY(this.getEl());this.deltaSetXY=null;this.startPageX=p[0];this.startPageY=p[1];},addToGroup:function(sGroup){this.groups[sGroup]=true;this.DDM.regDragDrop(this,sGroup);},removeFromGroup:function(sGroup){if(this.groups[sGroup]){delete this.groups[sGroup];}
this.DDM.removeDDFromGroup(this,sGroup);},setDragElId:function(id){this.dragElId=id;},setHandleElId:function(id){if(typeof id!=="string"){id=Dom.generateId(id);}
this.handleElId=id;this.DDM.regHandle(this.id,id);},setOuterHandleElId:function(id){if(typeof id!=="string"){id=Dom.generateId(id);}
Event.on(id,"mousedown",this.handleMouseDown,this,true);this.setHandleElId(id);this.hasOuterHandles=true;},unreg:function(){Event.removeListener(this.id,"mousedown",this.handleMouseDown);this._domRef=null;this.DDM._remove(this);},isLocked:function(){return(this.DDM.isLocked()||this.locked);},handleMouseDown:function(e,oDD){var button=e.which||e.button;if(this.primaryButtonOnly&&button>1){return;}
if(this.isLocked()){return;}
this.b4MouseDown(e);this.onMouseDown(e);this.DDM.refreshCache(this.groups);var pt=new YAHOO.util.Point(Event.getPageX(e),Event.getPageY(e));if(!this.hasOuterHandles&&!this.DDM.isOverTarget(pt,this)){}else{if(this.clickValidator(e)){this.setStartPosition();this.DDM.handleMouseDown(e,this);this.DDM.stopEvent(e);}else{}}},clickValidator:function(e){var target=Event.getTarget(e);return(this.isValidHandleChild(target)&&(this.id==this.handleElId||this.DDM.handleWasClicked(target,this.id)));},addInvalidHandleType:function(tagName){var type=tagName.toUpperCase();this.invalidHandleTypes[type]=type;},addInvalidHandleId:function(id){if(typeof id!=="string"){id=Dom.generateId(id);}
this.invalidHandleIds[id]=id;},addInvalidHandleClass:function(cssClass){this.invalidHandleClasses.push(cssClass);},removeInvalidHandleType:function(tagName){var type=tagName.toUpperCase();delete this.invalidHandleTypes[type];},removeInvalidHandleId:function(id){if(typeof id!=="string"){id=Dom.generateId(id);}
delete this.invalidHandleIds[id];},removeInvalidHandleClass:function(cssClass){for(var i=0,len=this.invalidHandleClasses.length;i<len;++i){if(this.invalidHandleClasses[i]==cssClass){delete this.invalidHandleClasses[i];}}},isValidHandleChild:function(node){var valid=true;var nodeName;try{nodeName=node.nodeName.toUpperCase();}catch(e){nodeName=node.nodeName;}
valid=valid&&!this.invalidHandleTypes[nodeName];valid=valid&&!this.invalidHandleIds[node.id];for(var i=0,len=this.invalidHandleClasses.length;valid&&i<len;++i){valid=!Dom.hasClass(node,this.invalidHandleClasses[i]);}
return valid;},setXTicks:function(iStartX,iTickSize){this.xTicks=[];this.xTickSize=iTickSize;var tickMap={};for(var i=this.initPageX;i>=this.minX;i=i-iTickSize){if(!tickMap[i]){this.xTicks[this.xTicks.length]=i;tickMap[i]=true;}}
for(i=this.initPageX;i<=this.maxX;i=i+iTickSize){if(!tickMap[i]){this.xTicks[this.xTicks.length]=i;tickMap[i]=true;}}
this.xTicks.sort(this.DDM.numericSort);},setYTicks:function(iStartY,iTickSize){this.yTicks=[];this.yTickSize=iTickSize;var tickMap={};for(var i=this.initPageY;i>=this.minY;i=i-iTickSize){if(!tickMap[i]){this.yTicks[this.yTicks.length]=i;tickMap[i]=true;}}
for(i=this.initPageY;i<=this.maxY;i=i+iTickSize){if(!tickMap[i]){this.yTicks[this.yTicks.length]=i;tickMap[i]=true;}}
this.yTicks.sort(this.DDM.numericSort);},setXConstraint:function(iLeft,iRight,iTickSize){this.leftConstraint=parseInt(iLeft,10);this.rightConstraint=parseInt(iRight,10);this.minX=this.initPageX-this.leftConstraint;this.maxX=this.initPageX+this.rightConstraint;if(iTickSize){this.setXTicks(this.initPageX,iTickSize);}
this.constrainX=true;},clearConstraints:function(){this.constrainX=false;this.constrainY=false;this.clearTicks();},clearTicks:function(){this.xTicks=null;this.yTicks=null;this.xTickSize=0;this.yTickSize=0;},setYConstraint:function(iUp,iDown,iTickSize){this.topConstraint=parseInt(iUp,10);this.bottomConstraint=parseInt(iDown,10);this.minY=this.initPageY-this.topConstraint;this.maxY=this.initPageY+this.bottomConstraint;if(iTickSize){this.setYTicks(this.initPageY,iTickSize);}
this.constrainY=true;},resetConstraints:function(){if(this.initPageX||this.initPageX===0){var dx=(this.maintainOffset)?this.lastPageX-this.initPageX:0;var dy=(this.maintainOffset)?this.lastPageY-this.initPageY:0;this.setInitPosition(dx,dy);}else{this.setInitPosition();}
if(this.constrainX){this.setXConstraint(this.leftConstraint,this.rightConstraint,this.xTickSize);}
if(this.constrainY){this.setYConstraint(this.topConstraint,this.bottomConstraint,this.yTickSize);}},getTick:function(val,tickArray){if(!tickArray){return val;}else if(tickArray[0]>=val){return tickArray[0];}else{for(var i=0,len=tickArray.length;i<len;++i){var next=i+1;if(tickArray[next]&&tickArray[next]>=val){var diff1=val-tickArray[i];var diff2=tickArray[next]-val;return(diff2>diff1)?tickArray[i]:tickArray[next];}}
return tickArray[tickArray.length-1];}},toString:function(){return("DragDrop "+this.id);}};})();YAHOO.util.DD=function(id,sGroup,config){if(id){this.init(id,sGroup,config);}};YAHOO.extend(YAHOO.util.DD,YAHOO.util.DragDrop,{scroll:true,autoOffset:function(iPageX,iPageY){var x=iPageX-this.startPageX;var y=iPageY-this.startPageY;this.setDelta(x,y);},setDelta:function(iDeltaX,iDeltaY){this.deltaX=iDeltaX;this.deltaY=iDeltaY;},setDragElPos:function(iPageX,iPageY){var el=this.getDragEl();this.alignElWithMouse(el,iPageX,iPageY);},alignElWithMouse:function(el,iPageX,iPageY){var oCoord=this.getTargetCoord(iPageX,iPageY);if(!this.deltaSetXY){var aCoord=[oCoord.x,oCoord.y];YAHOO.util.Dom.setXY(el,aCoord);var newLeft=parseInt(YAHOO.util.Dom.getStyle(el,"left"),10);var newTop=parseInt(YAHOO.util.Dom.getStyle(el,"top"),10);this.deltaSetXY=[newLeft-oCoord.x,newTop-oCoord.y];}else{YAHOO.util.Dom.setStyle(el,"left",(oCoord.x+this.deltaSetXY[0])+"px");YAHOO.util.Dom.setStyle(el,"top",(oCoord.y+this.deltaSetXY[1])+"px");}
this.cachePosition(oCoord.x,oCoord.y);this.autoScroll(oCoord.x,oCoord.y,el.offsetHeight,el.offsetWidth);},cachePosition:function(iPageX,iPageY){if(iPageX){this.lastPageX=iPageX;this.lastPageY=iPageY;}else{var aCoord=YAHOO.util.Dom.getXY(this.getEl());this.lastPageX=aCoord[0];this.lastPageY=aCoord[1];}},autoScroll:function(x,y,h,w){if(this.scroll){var clientH=this.DDM.getClientHeight();var clientW=this.DDM.getClientWidth();var st=this.DDM.getScrollTop();var sl=this.DDM.getScrollLeft();var bot=h+y;var right=w+x;var toBot=(clientH+st-y-this.deltaY);var toRight=(clientW+sl-x-this.deltaX);var thresh=40;var scrAmt=(document.all)?80:30;if(bot>clientH&&toBot<thresh){window.scrollTo(sl,st+scrAmt);}
if(y<st&&st>0&&y-st<thresh){window.scrollTo(sl,st-scrAmt);}
if(right>clientW&&toRight<thresh){window.scrollTo(sl+scrAmt,st);}
if(x<sl&&sl>0&&x-sl<thresh){window.scrollTo(sl-scrAmt,st);}}},getTargetCoord:function(iPageX,iPageY){var x=iPageX-this.deltaX;var y=iPageY-this.deltaY;if(this.constrainX){if(x<this.minX){x=this.minX;}
if(x>this.maxX){x=this.maxX;}}
if(this.constrainY){if(y<this.minY){y=this.minY;}
if(y>this.maxY){y=this.maxY;}}
x=this.getTick(x,this.xTicks);y=this.getTick(y,this.yTicks);return{x:x,y:y};},applyConfig:function(){YAHOO.util.DD.superclass.applyConfig.call(this);this.scroll=(this.config.scroll!==false);},b4MouseDown:function(e){this.setStartPosition();this.autoOffset(YAHOO.util.Event.getPageX(e),YAHOO.util.Event.getPageY(e));},b4Drag:function(e){this.setDragElPos(YAHOO.util.Event.getPageX(e),YAHOO.util.Event.getPageY(e));},toString:function(){return("DD "+this.id);}});YAHOO.util.DDProxy=function(id,sGroup,config){if(id){this.init(id,sGroup,config);this.initFrame();}};YAHOO.util.DDProxy.dragElId="ygddfdiv";YAHOO.extend(YAHOO.util.DDProxy,YAHOO.util.DD,{resizeFrame:true,centerFrame:false,createFrame:function(){var self=this;var body=document.body;if(!body||!body.firstChild){setTimeout(function(){self.createFrame();},50);return;}
var div=this.getDragEl();if(!div){div=document.createElement("div");div.id=this.dragElId;var s=div.style;s.position="absolute";s.visibility="hidden";s.cursor="move";s.border="2px solid #aaa";s.zIndex=999;body.insertBefore(div,body.firstChild);}},initFrame:function(){this.createFrame();},applyConfig:function(){YAHOO.util.DDProxy.superclass.applyConfig.call(this);this.resizeFrame=(this.config.resizeFrame!==false);this.centerFrame=(this.config.centerFrame);this.setDragElId(this.config.dragElId||YAHOO.util.DDProxy.dragElId);},showFrame:function(iPageX,iPageY){var el=this.getEl();var dragEl=this.getDragEl();var s=dragEl.style;this._resizeProxy();if(this.centerFrame){this.setDelta(Math.round(parseInt(s.width,10)/2),Math.round(parseInt(s.height,10)/2));}
this.setDragElPos(iPageX,iPageY);YAHOO.util.Dom.setStyle(dragEl,"visibility","visible");},_resizeProxy:function(){if(this.resizeFrame){var DOM=YAHOO.util.Dom;var el=this.getEl();var dragEl=this.getDragEl();var bt=parseInt(DOM.getStyle(dragEl,"borderTopWidth"),10);var br=parseInt(DOM.getStyle(dragEl,"borderRightWidth"),10);var bb=parseInt(DOM.getStyle(dragEl,"borderBottomWidth"),10);var bl=parseInt(DOM.getStyle(dragEl,"borderLeftWidth"),10);if(isNaN(bt)){bt=0;}
if(isNaN(br)){br=0;}
if(isNaN(bb)){bb=0;}
if(isNaN(bl)){bl=0;}
var newWidth=Math.max(0,el.offsetWidth-br-bl);var newHeight=Math.max(0,el.offsetHeight-bt-bb);DOM.setStyle(dragEl,"width",newWidth+"px");DOM.setStyle(dragEl,"height",newHeight+"px");}},b4MouseDown:function(e){this.setStartPosition();var x=YAHOO.util.Event.getPageX(e);var y=YAHOO.util.Event.getPageY(e);this.autoOffset(x,y);this.setDragElPos(x,y);},b4StartDrag:function(x,y){this.showFrame(x,y);},b4EndDrag:function(e){YAHOO.util.Dom.setStyle(this.getDragEl(),"visibility","hidden");},endDrag:function(e){var DOM=YAHOO.util.Dom;var lel=this.getEl();var del=this.getDragEl();DOM.setStyle(del,"visibility","");DOM.setStyle(lel,"visibility","hidden");YAHOO.util.DDM.moveToEl(lel,del);DOM.setStyle(del,"visibility","hidden");DOM.setStyle(lel,"visibility","");},toString:function(){return("DDProxy "+this.id);}});YAHOO.util.DDTarget=function(id,sGroup,config){if(id){this.initTarget(id,sGroup,config);}};YAHOO.extend(YAHOO.util.DDTarget,YAHOO.util.DragDrop,{toString:function(){return("DDTarget "+this.id);}});YAHOO.register("dragdrop",YAHOO.util.DragDropMgr,{version:"2.2.0",build:"127"});
YAHOO.util.Attribute=function(hash,owner){if(owner){this.owner=owner;this.configure(hash,true);}};YAHOO.util.Attribute.prototype={name:undefined,value:null,owner:null,readOnly:false,writeOnce:false,_initialConfig:null,_written:false,method:null,validator:null,getValue:function(){return this.value;},setValue:function(value,silent){var beforeRetVal;var owner=this.owner;var name=this.name;var event={type:name,prevValue:this.getValue(),newValue:value};if(this.readOnly||(this.writeOnce&&this._written)){return false;}
if(this.validator&&!this.validator.call(owner,value)){return false;}
if(!silent){beforeRetVal=owner.fireBeforeChangeEvent(event);if(beforeRetVal===false){return false;}}
if(this.method){this.method.call(owner,value);}
this.value=value;this._written=true;event.type=name;if(!silent){this.owner.fireChangeEvent(event);}
return true;},configure:function(map,init){map=map||{};this._written=false;this._initialConfig=this._initialConfig||{};for(var key in map){if(key&&YAHOO.lang.hasOwnProperty(map,key)){this[key]=map[key];if(init){this._initialConfig[key]=map[key];}}}},resetValue:function(){return this.setValue(this._initialConfig.value);},resetConfig:function(){this.configure(this._initialConfig);},refresh:function(silent){this.setValue(this.value,silent);}};(function(){var Lang=YAHOO.util.Lang;YAHOO.util.AttributeProvider=function(){};YAHOO.util.AttributeProvider.prototype={_configs:null,get:function(key){var configs=this._configs||{};var config=configs[key];if(!config){return undefined;}
return config.value;},set:function(key,value,silent){var configs=this._configs||{};var config=configs[key];if(!config){return false;}
return config.setValue(value,silent);},getAttributeKeys:function(){var configs=this._configs;var keys=[];var config;for(var key in configs){config=configs[key];if(Lang.hasOwnProperty(configs,key)&&!Lang.isUndefined(config)){keys[keys.length]=key;}}
return keys;},setAttributes:function(map,silent){for(var key in map){if(Lang.hasOwnProperty(map,key)){this.set(key,map[key],silent);}}},resetValue:function(key,silent){var configs=this._configs||{};if(configs[key]){this.set(key,configs[key]._initialConfig.value,silent);return true;}
return false;},refresh:function(key,silent){var configs=this._configs;key=((Lang.isString(key))?[key]:key)||this.getAttributeKeys();for(var i=0,len=key.length;i<len;++i){if(configs[key[i]]&&!Lang.isUndefined(configs[key[i]].value)&&!Lang.isNull(configs[key[i]].value)){configs[key[i]].refresh(silent);}}},register:function(key,map){this.setAttributeConfig(key,map);},getAttributeConfig:function(key){var configs=this._configs||{};var config=configs[key]||{};var map={};for(key in config){if(Lang.hasOwnProperty(config,key)){map[key]=config[key];}}
return map;},setAttributeConfig:function(key,map,init){var configs=this._configs||{};map=map||{};if(!configs[key]){map.name=key;configs[key]=new YAHOO.util.Attribute(map,this);}else{configs[key].configure(map,init);}},configureAttribute:function(key,map,init){this.setAttributeConfig(key,map,init);},resetAttributeConfig:function(key){var configs=this._configs||{};configs[key].resetConfig();},fireBeforeChangeEvent:function(e){var type='before';type+=e.type.charAt(0).toUpperCase()+e.type.substr(1)+'Change';e.type=type;return this.fireEvent(e.type,e);},fireChangeEvent:function(e){e.type+='Change';return this.fireEvent(e.type,e);}};YAHOO.augment(YAHOO.util.AttributeProvider,YAHOO.util.EventProvider);})();(function(){var Dom=YAHOO.util.Dom,EventPublisher=YAHOO.util.EventPublisher,AttributeProvider=YAHOO.util.AttributeProvider;YAHOO.util.Element=function(el,map){if(arguments.length){this.init(el,map);}};YAHOO.util.Element.prototype={DOM_EVENTS:null,appendChild:function(child){child=child.get?child.get('element'):child;this.get('element').appendChild(child);},getElementsByTagName:function(tag){return this.get('element').getElementsByTagName(tag);},hasChildNodes:function(){return this.get('element').hasChildNodes();},insertBefore:function(element,before){element=element.get?element.get('element'):element;before=(before&&before.get)?before.get('element'):before;this.get('element').insertBefore(element,before);},removeChild:function(child){child=child.get?child.get('element'):child;this.get('element').removeChild(child);return true;},replaceChild:function(newNode,oldNode){newNode=newNode.get?newNode.get('element'):newNode;oldNode=oldNode.get?oldNode.get('element'):oldNode;return this.get('element').replaceChild(newNode,oldNode);},initAttributes:function(map){map=map||{};var element=Dom.get(map.element)||null;this.setAttributeConfig('element',{value:element,readOnly:true});},addListener:function(type,fn,obj,scope){var el=this.get('element');var scope=scope||this;el=this.get('id')||el;if(!this._events[type]){if(this.DOM_EVENTS[type]){YAHOO.util.Event.addListener(el,type,function(e){if(e.srcElement&&!e.target){e.target=e.srcElement;}
this.fireEvent(type,e);},obj,scope);}
this.createEvent(type,this);this._events[type]=true;}
this.subscribe.apply(this,arguments);},on:function(){this.addListener.apply(this,arguments);},removeListener:function(type,fn){this.unsubscribe.apply(this,arguments);},addClass:function(className){Dom.addClass(this.get('element'),className);},getElementsByClassName:function(className,tag){return Dom.getElementsByClassName(className,tag,this.get('element'));},hasClass:function(className){return Dom.hasClass(this.get('element'),className);},removeClass:function(className){return Dom.removeClass(this.get('element'),className);},replaceClass:function(oldClassName,newClassName){return Dom.replaceClass(this.get('element'),oldClassName,newClassName);},setStyle:function(property,value){var el=this.get('element');if(!el){this._queue[this._queue.length]=['setStyle',arguments];return false;}
return Dom.setStyle(this.get('element'),property,value);},getStyle:function(property){return Dom.getStyle(this.get('element'),property);},fireQueue:function(){var queue=this._queue;for(var i=0,len=queue.length;i<len;++i){this[queue[i][0]].apply(this,queue[i][1]);}},appendTo:function(parent,before){parent=(parent.get)?parent.get('element'):Dom.get(parent);this.fireEvent('beforeAppendTo',{type:'beforeAppendTo',target:parent});before=(before&&before.get)?before.get('element'):Dom.get(before);var element=this.get('element');if(!element){return false;}
if(!parent){return false;}
if(element.parent!=parent){if(before){parent.insertBefore(element,before);}else{parent.appendChild(element);}}
this.fireEvent('appendTo',{type:'appendTo',target:parent});},get:function(key){var configs=this._configs||{};var el=configs.element;if(el&&!configs[key]&&!YAHOO.lang.isUndefined(el.value[key])){return el.value[key];}
return AttributeProvider.prototype.get.call(this,key);},set:function(key,value,silent){var el=this.get('element');if(!el){this._queue[this._queue.length]=['set',arguments];if(this._configs[key]){this._configs[key].value=value;}
return;}
if(!this._configs[key]&&!YAHOO.lang.isUndefined(el[key])){_registerHTMLAttr.call(this,key);}
return AttributeProvider.prototype.set.apply(this,arguments);},setAttributeConfig:function(key,map,init){var el=this.get('element');if(el&&!this._configs[key]&&!YAHOO.lang.isUndefined(el[key])){_registerHTMLAttr.call(this,key,map);}else{AttributeProvider.prototype.setAttributeConfig.apply(this,arguments);}},getAttributeKeys:function(){var el=this.get('element');var keys=AttributeProvider.prototype.getAttributeKeys.call(this);for(var key in el){if(!this._configs[key]){keys[key]=keys[key]||el[key];}}
return keys;},init:function(el,attr){this._queue=this._queue||[];this._events=this._events||{};this._configs=this._configs||{};attr=attr||{};attr.element=attr.element||el||null;this.DOM_EVENTS={'click':true,'keydown':true,'keypress':true,'keyup':true,'mousedown':true,'mousemove':true,'mouseout':true,'mouseover':true,'mouseup':true};var readyHandler=function(){this.initAttributes(attr);this.setAttributes(attr,true);this.fireQueue();this.fireEvent('contentReady',{type:'contentReady',target:attr.element});};if(YAHOO.lang.isString(el)){_registerHTMLAttr.call(this,'id',{value:el});YAHOO.util.Event.onAvailable(el,function(){attr.element=Dom.get(el);this.fireEvent('available',{type:'available',target:attr.element});},this,true);YAHOO.util.Event.onContentReady(el,function(){readyHandler.call(this);},this,true);}else{readyHandler.call(this);}}};var _registerHTMLAttr=function(key,map){var el=this.get('element');map=map||{};map.name=key;map.method=map.method||function(value){el[key]=value;};map.value=map.value||el[key];this._configs[key]=new YAHOO.util.Attribute(map,this);};YAHOO.augment(YAHOO.util.Element,AttributeProvider);})();YAHOO.register("element",YAHOO.util.Element,{version:"2.2.0",build:"127"});

/*** end file 'utilities.js' ***/
