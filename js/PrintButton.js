define([
    "dojo/Evented",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/has", // feature detection
    "esri/kernel", // esri namespace
    "dijit/_WidgetBase",
    "dijit/a11yclick", // Custom press, release, and click synthetic events which trigger on a left mouse click, touch, or space/enter keyup.
    "dijit/_TemplatedMixin",
    "dojo/on",
    "dojo/Deferred",
    "dojo/text!application/dijit/templates/PrintButton.html", // template html
    "dojo/dom-class",
    "dojo/dom-style",
    "esri/tasks/PrintTask", "esri/tasks/PrintParameters", "esri/tasks/PrintTemplate"
],
function (
    Evented,
    declare,
    lang,
    has, esriNS,
    _WidgetBase, a11yclick, _TemplatedMixin,
    on,
    Deferred,
    dijitTemplate,
    domClass, domStyle,
    PrintTask, PrintParameters, PrintTemplate
) {
    var Widget = declare("application.PrintButton", [_WidgetBase, _TemplatedMixin, Evented], {

        // template HTML
        templateString: dijitTemplate,

        // default options
        options: {
            theme: "PrintButton",
            map: null,
            extent: null,
            fit: false,
            visible: true
        },

        // lifecycle: 1
        constructor: function (options, srcRefNode) {
            // mix in settings and defaults
            var defaults = lang.mixin({}, this.options, options);
            // widget node
            this.domNode = srcRefNode;
            // properties
            this.set("map", defaults.map);
            this.set("printUrl", defaults.printUrl);
            this.set("theme", defaults.theme);
            this.set("visible", defaults.visible);
            this.set("extent", defaults.extent);
            this.set("fit", defaults.fit);
            // listeners
            this.watch("theme", this._updateThemeWatch);
            this.watch("visible", this._visible);
            // classes
            this._css = {
                container: "printContainer",
                print: "print",
                loading: "loading"
            };
        },
        // bind listener for button to action
        postCreate: function () {
            this.inherited(arguments);
            this.own(
                on(this._homeNode, a11yclick, lang.hitch(this, this.print))
            );
        },
        // start widget. called by user
        startup: function () {
            // map not defined
            if (!this.map) {
                this.destroy();
                console.log('PrintButton::map required');
            }
            // when map is loaded
            if (this.map.loaded) {
                this._init();
            } else {
                on.once(this.map, "load", lang.hitch(this, function () {
                    this._init();
                }));
            }
        },
        // connections/subscriptions will be cleaned up during the destroy() lifecycle phase
        destroy: function () {
            this.inherited(arguments);
        },
        /* ---------------- */
        /* Public Events */
        /* ---------------- */
        // home
        // load
        /* ---------------- */
        /* Public Functions */
        /* ---------------- */
        print: function () {
            // deferred to return
            var def = new Deferred();

            // show loading spinner
            this._showLoading();

            var template = new PrintTemplate();
            template.format = "PDF";

            var printTask = new PrintTask(this.printUrl);
            var params = new PrintParameters();
            params.map = this.map;
            params.template = template;
  
            console.log("params", params);

            printTask.execute(params, lang.hitch(this, function (result) {
                console.log("Print result", result);

                // hide loading spinner
                this._hideLoading();

                window.open(result.url);

                this.emit("print", result);
                def.resolve(result);

            }), lang.hitch(this, function (error) {

                // hide loading spinner
                this._hideLoading();
                def.reject(error);
            }));


            return def.promise;
        },
        // show widget
        show: function () {
            this.set("visible", true);
        },
        // hide widget
        hide: function () {
            this.set("visible", false);
        },
        /* ---------------- */
        /* Private Functions */
        /* ---------------- */
        _init: function () {
            // show or hide widget
            this._visible();
            // if no extent set, set extent to map extent
            if (!this.get("extent")) {
                this.set("extent", this.map.extent);
            }
            // widget is now loaded
            this.set("loaded", true);
            this.emit("load", {});
        },
        // show loading spinner
        _showLoading: function () {
            domClass.add(this._homeNode, this._css.loading);
        },
        // hide loading spinner
        _hideLoading: function () {
            domClass.remove(this._homeNode, this._css.loading);
        },
        // theme changed
        _updateThemeWatch: function (attr, oldVal, newVal) {
            domClass.remove(this.domNode, oldVal);
            domClass.add(this.domNode, newVal);
        },
        // show or hide widget
        _visible: function () {
            if (this.get("visible")) {
                domStyle.set(this.domNode, 'display', 'block');
            }
            else {
                domStyle.set(this.domNode, 'display', 'none');
            }
        }
    });

    return Widget;
});