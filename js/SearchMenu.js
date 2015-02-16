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
    "dojo/text!application/dijit/templates/SearchMenu.html", // template html
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/query",
    "dojo/promise/all",
    "esri/toolbars/draw",
    "esri/tasks/GeometryService",
    "esri/tasks/ProjectParameters",
    "esri/SpatialReference",
    "esri/tasks/BufferParameters",
    "esri/layers/FeatureLayer",
    "esri/tasks/QueryTask",
    "esri/tasks/query",
    "esri/graphic",
    "esri/geometry/Extent",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleMarkerSymbol",
    "dojo/_base/Color",
    
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
    domClass, domStyle, domConstruct, query, all,
    Draw, GeometryService, ProjectParameters, SpatialReference, BufferParameters, FeatureLayer, QueryTask, Query,
    Graphic, Extent, SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol, Color
) {
    var Widget = declare("application.SearchMenu", [_WidgetBase, _TemplatedMixin, Evented], {

        // template HTML
        templateString: dijitTemplate,

        // default options
        options: {
            theme: "SearchMenu",
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
            this.set("geometryServiceUrl", defaults.geometryServiceUrl);
            this.set("searchLayers", defaults.searchLayers);
            this.set("theme", defaults.theme);
            this.set("visible", defaults.visible);
            this.set("extent", defaults.extent);
            this.set("fit", defaults.fit);
            // listeners
            this.watch("theme", this._updateThemeWatch);
            this.watch("visible", this._visible);
            // classes
            this._css = {
                container: "searchContainer",
                search: "search",
                loading: "loading"
            };

            //Symobology for spatial search tools
            this.simpleFillSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new Color([255, 0, 0]), 2), new Color([255, 255, 0, 0.25]));
            this.simpleMarkerSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 1), new Color([0, 255, 0, 0.25]));
            this.simpleLineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 1);

            //Get the geometry service, if it is specified
            if (this.geometryServiceUrl != null) {
                this.geometryService = new GeometryService(this.geometryServiceUrl);
            }

            //Toolbar instance
            this.tb;
        },
        // bind listener for button to action
        postCreate: function () {
            this.inherited(arguments);
            //this.own(
            //    on(this._homeNode, a11yclick, lang.hitch(this, this.search))
            //);
        },
        // start widget. called by user
        startup: function () {
            var _self = this;

            

            // map not defined
            if (!this.map) {
                this.destroy();
                console.log('SearchButton::map required');
            }

            this._init();

          
            // when map is loaded
            //if (this.map.loaded) {
            //    this._init();
            //} else {
            //    on.once(this.map, "load", lang.hitch(this, function () {
            //        this._init();
            //    }));
            //}
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
        search: function () {
            var _self = this;

            // deferred to return
            var def = new Deferred();

            // show loading spinner
            this._showLoading();

            

            //printTask.execute(params, lang.hitch(this, function (result) {
            //    console.log("Print result", result);

            //    // hide loading spinner
            //    this._hideLoading();

            //    window.open(result.url);

            //    this.emit("print", result);
            //    def.resolve(result);

            //}), lang.hitch(this, function (error) {

            //    // hide loading spinner
            //    this._hideLoading();
            //    def.reject(error);
            //}));


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
        //---------------------------------
        // setView - Controls the widget view navigation
        //---------------------------------
        setView: function (view) {
            
            query('.searchContainer .viewPane').addClass('hidePane');
            query('#search_view_' + view).removeClass('hidePane');

            //this.currentView = view;
        },

        _init: function () {
            // show or hide widget
            this._visible();

            // widget is now loaded
            this.set("loaded", true);
            this.emit("load", {});

            var _self = this;

            //Back Button Click Event
            on(dojo.byId("search_btnBackTools"), "click", function (evt) {
                _self.setView(1);
            });

            on(dojo.byId("search_btnBackResults"), "click", function (evt) {
                _self.setView(2);
            });

            //Spatial Search Buttons' Click Event
            var toolButtons = dojo.byId("at_toolbuttons");
            if (toolButtons) {
                on(toolButtons, ".attrButton:click, .attrButton:keyup", function (event) {
                    if (event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13)) {

                        query('#at_toolbuttons .attrButton').removeClass('attrButtonSelected');
                        query(this).addClass('attrButtonSelected');
                        var id = query(this).attr('data-menu')[0];

                        console.log("geoSearch");

                        _self.geoSearch(id);

                    }
                });
            }
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
        },

        //---------------------------------
        // geoSearch - Called when the spatial search buttons are clicked
        //---------------------------------
        geoSearch: function (tool) {
            var _self = this;

            if (dojo.byId("at_UseBuffer").checked == true && dojo.byId("at_txtBufferDist").value == "") {
                //_self.showDialog("Error", "Please enter a buffer distance.");
                return;
            }

            _self.map.graphics.clear();

            //New draw
            _self.tb = new Draw(_self.map);

            //Set up event handler
            _self.tbEvent = _self.tb.on("draw-end", lang.hitch(this, _self.onGeoSearch));

            _self.map.disableMapNavigation();
            _self.tb.activate(tool);
        },

        //---------------------------------
        // onGeoSearch - Called when "draw-end" event is fired
        //---------------------------------
        onGeoSearch: function (evt) {
            var _self = this;

            //Reset the tools on the toolbar
            query('#at_toolbuttons .attrButton').removeClass('attrButtonSelected');

            //Deactivate draw
            _self.tb.deactivate();
            _self.map.enableMapNavigation();
            //Remove event handler
            _self.tbEvent.remove();

            //Set symbology based on shape type
            var symbol;
            switch (evt.geometry.type) {
                case "point":
                    symbol = this.simpleMarkerSymbol;
                    break;
                case "polyline":
                    symbol = this.simpleLineSymbol;
                    break;
                case "polygon":
                    symbol = this.simpleFillSymbol;
                    break;
                case "extent":
                    symbol = this.simpleFillSymbol;
                    break;
            }

            //Add the user defined search graphic
            _self.map.graphics.add(new Graphic(evt.geometry, symbol));

            //Check to see if this should be buffered, if not just continue with the search
            if (dojo.byId("at_UseBuffer").checked == true) {
                var params = new BufferParameters();
                params.geometries = [evt.geometry];

                params.distances = [dojo.byId('at_txtBufferDist').value];

                switch (dojo.byId('at_cmbBufferUnits').value) {
                    case "meters":
                        params.unit = GeometryService.UNIT_METER;
                        break;
                    case "feet":
                        params.unit = GeometryService.UNIT_FOOT;
                        break;
                    case "kilometers":
                        params.unit = GeometryService.UNIT_KILOMETER;
                        break;
                    case "miles":
                        params.unit = GeometryService.UNIT_STATUTE_MILE;
                        break;
                    default:
                        params.unit = GeometryService.UNIT_METER;
                        break;
                }

                params.bufferSpatialReference = new SpatialReference({ wkid: 102100 });
                params.outSpatialReference = _self.map.spatialReference;
                _self.geometryService.buffer(params, lang.hitch(_self, _self.onBufferComplete), function (error) {
                    alert("Buffer error: " + error);
                });
            }
            else {
                _self.spatialSearch(null, evt.geometry);
            }


        },

        //---------------------------------
        // onBufferComplete - Event function for after the buffer completes
        //---------------------------------
        onBufferComplete: function (result) {
            if (result.length > 0) {
                this.map.graphics.add(new Graphic(result[0], this.simpleFillSymbol));
                this.spatialSearch(null, result[0]);
            }
        },

        //---------------------------------
        // spatialSearch - Perform the spatial search, using the selected layers
        //---------------------------------
        spatialSearch: function (attr, geo) {
            var _self = this;

            _self.geo = geo;
            _self.queryTaskList = [];
            _self.queryLayerList = [];

            for (var i = 0; i < this.searchLayers.length; i++) {
                var nquery = new Query();
                nquery.geometry = geo;
                nquery.outFields = ["*"];
                nquery.spatialRelationship = Query.SPATIAL_REL_INTERSECTS;
                nquery.returnGeometry = true;

                var qTask = new QueryTask(this.searchLayers[i].url);
                var qTaskExec = qTask.execute(nquery);
                _self.queryTaskList.push(qTaskExec);
            }

            //run the promises
            promises = new all(_self.queryTaskList);
            promises.then(lang.hitch(this, this.onSpatialSearch));

            //dojo.byId("loadingMessage").innerHTML = "Querying records...";

        },

        //---------------------------------
        // onSpatialSearch - Handles the results of the spatial search
        //---------------------------------
        onSpatialSearch: function (results) {
            var _self = this;

            _self.setView(2);

            console.log("HQR/RESULTS", results);

            //Change the toolbar button status to show results as selected
            query('#at_toolbar .attrButton').removeClass('attrButtonSelected');
            query('#at_btnAttrTable').addClass('attrButtonSelected');

            _self.searchResults = results;

            //Reset the results view
            var node = dojo.byId("at_results");
            if (node) {
                node.innerHTML = '';
            }

            //Print out the summary of results
            for (var i = 0; i < results.length; i++) {
                if (results[i].hasOwnProperty("features")) {
                    if (results[i].features.length > 0) {
                        var cspan = results[i].fields.length + 1;

                        html = '';
                        html += "<div><div class='resultTitle'>" + _self.searchLayers[i].name + "</div>";
                        html += "<table class='tableResults'>";
                        html += "<tr>";
                        html += "<th></th><th>Value</th>";
                        html += "</tr>";

                        //Go through the features
                        for (var m = 0; m < results[i].features.length; m++) {

                            var attrs = results[i].features[m].attributes;
                            var df = _self.searchLayers[i].displayField;

                            if (m == 0 || m % 2 == 0) {
                                html += "<tr>";
                            }
                            else {
                                html += "<tr class='alt'>";
                            }

                            html += "<td><div class='icon-search-1' mode='zoom' layer-id='" + i + "' feature-id='" + m + "'></div>";

                            html += "<div class='icon-menu-1' mode='details' layermap-id='" + _self.searchLayers[i].name + "' layer-id='" + i + "' feature-id='" + m + "'></div></td>";

                            html += "</td>";

                            html += "<td>" + attrs[df] + "</td>"

                            html += "</tr>";
                        }

                        html += "</table></div>";

                        //Add it to the results list
                        if (node) {
                            domConstruct.place(html, node, "last");
                        }
                    }
                }
                else {

                }
            }

            //Add the click handler to the Zoom and Details links
            on(dojo.byId("at_results"), ".icon-search-1:click", function (event) {
                if (event.type === 'click') {
                    var mode = query(this).attr('mode')[0];
                    var layerid = query(this).attr('layer-id');
                    var featureid = query(this).attr('feature-id');

                    _self.zoomToSite(layerid, featureid);
                    
                }
            });

            on(dojo.byId("at_results"), ".icon-menu-1:click", function (event) {
                if (event.type === 'click') {
                    var mode = query(this).attr('mode')[0];
                    var layerid = query(this).attr('layer-id');
                    var featureid = query(this).attr('feature-id');
                    
                    var layermapid = query(this).attr('layermap-id');
                    _self.showFeatureDetails(layerid, featureid, layermapid);
                    
                }
            });
        },

        //---------------------------------
        // zoomToSite - Zooms to the selected feature
        //---------------------------------
        zoomToSite: function (layerid, featureid) {
            var _self = this;

            //Create an extent
            var ext;
            //Generate an extent for a point
            if (_self.searchResults[layerid].features[featureid].geometry.type == "point") {
                var pt = _self.searchResults[layerid].features[featureid].geometry;
                ext = new Extent(pt.x - 750, pt.y - 750, pt.x + 750, pt.y + 750, _self.map.spatialReference);
            }
            else {
                ext = _self.searchResults[layerid].features[featureid].geometry.getExtent();
            }

            //Reproject from Utm to web mercator
            var params = new ProjectParameters();
            params.geometries = [ext];
            params.outSR = new SpatialReference({ wkid: 102100 });
            params.transformation = { wkid: 15851 };
            this.geometryService.project(params, lang.hitch(this, this.onZoomToSite), function (error) {
                alert("Projection error: " + error);
            });
        },

        //---------------------------------
        // onZoomToSite - Zoom to the selected site
        //---------------------------------
        onZoomToSite: function (result) {
            if (result[0] != null) {
                this.map.setExtent(result[0]);
            }

        },

        //---------------------------------
        // showFeatureDetails - show the details for the selected features
        //---------------------------------
        showFeatureDetails: function (layerid, featureid, layermapid) {

            var _self = this;

            //Get the feature layer for the selected layer
            var fl = _self.map.getLayer(layermapid);

            var node = dojo.byId("at_details");
            if (node) {
                node.innerHTML = '';
            }
            var html = '';

            //build the results table
            html += "<table class='tableResults'>";
            html += "<tr><th>Field Name</th><th>Value</th></tr>";

            var feat = _self.searchResults[layerid].features[featureid];
            var attrs = _self.searchResults[layerid].fields;
            var fldValue = "";

            //alternating colors
            for (var i = 0; i < attrs.length; i++) {
                if (i == 0 || i % 2 == 0) {
                    html += "<tr>";
                }
                else {
                    html += "<tr class='alt'>";
                }

                fldValue = feat.attributes[attrs[i].name];
                if (fldValue != null) {

                    //Format the UTC Epoch date
                    if (attrs[i].name.toUpperCase().indexOf("DATE") > -1) {
                        fldValue = _self.formatDate(new Date(fldValue));
                    }
                     
                }
                else {
                    fldValue = "";
                }

                html += "<td>" + attrs[i].alias + "</td>";
                html += "<td>" + fldValue + "</td>";
                html += "<tr>";

                fldValue = "";
            }

            html += "</table><br />";

            //Get the results list object
            if (node) {
                domConstruct.place(html, node, "last");
            }
           
            _self.setView(3);

        },

        //---------------------------------
        // clearResults - Clears the results view
        //---------------------------------
        clearResults: function () {
            this.map.graphics.clear();
            var node = dojo.byId("at_results");
            if (node) {
                node.innerHTML = 'No records are currently selected';
            }

            node = dojo.byId("at_details");
            if (node) {
                node.innerHTML = '';
            }
        },

        //---------------------------------
        // formatDate - Gets the passed date and formats it MM/dd/yyyy
        //---------------------------------
        formatDate: function (d) {
            var curr_date = d.getUTCDate();
            var curr_month = d.getUTCMonth() + 1; //Months are zero based
            var curr_year = d.getUTCFullYear();
            return curr_month + "/" + curr_date + "/" + curr_year;
        },
    });

    return Widget;
});