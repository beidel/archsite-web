/// <reference path="../../jsapi_vsdoc12_v36.js" />
define([
    "dojo/_base/declare",
    "dojo/_base/connect",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/_base/event",
    "dojo/dom-construct",
    "dojo/promise/all",
    "dojo/dom-attr",
    "dojo/query",
    "dojo/dom-class",
    "dojo/window",
    "dijit/registry",
	"dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dojo/text!./templates/AttrTable.html",
	"dojo/dom-style",
	"dojo/_base/fx",
	"dojo/on",
	"dojo/mouse",
    "dijit/Dialog",
    "modules/sitereport/SiteReport",
    "modules/revisits/Revisits",
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
    "dijit/layout/BorderContainer",
    "dijit/layout/ContentPane",
    "dijit/form/Button",
    "dijit/form/Select",
    "dijit/form/TextBox"
],
function (declare, connect, arr, lang, event, domConstruct, all, domAttr, query, domClass, win, registry, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template,
    domStyle, baseFx, on, mouse, Dialog, SiteReport, Revisits, Draw, GeometryService, ProjectParameters, SpatialReference, BufferParameters, FeatureLayer, QueryTask, Query,
    Graphic, Extent, SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol, Color, BorderContainer, ContentPane, Button, Select,TextBox) {
    var Widget = declare("modules.attrtable.AttrTable", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        constructor: function (options) {

            var _self = this;
            this.options = {

            };
            declare.safeMixin(this.options, options);

            this.templateString = template;

            this.widgetsInTemplate = true;

            // A class to be applied to the root node of template
            this.baseClass = "attrTable";

            this.archSitesUrl = ""; //Used in the queries

            this.layers = this.options.layers;  //Searchable layers
            this.tables = []; //Array to store the feature set info
            this.columns = []; //Array to store columns for feature set
            this.fields = []; //Array to store fields for feature set

            this.currentTableIndex = 0;  //Keeps track of current table index
            this.criteriaCount = 1;  //Keeps track of the number of criteria that user adds to attribute search, default is 1
            this.criteriaId = 0; //Counter for attribute id in attribute search

            this.windowWidth;  //Stores the current browser window width
            this.windowHeight; //Stores the current browser window height

            //TODO: Move color settings into config file
            //Symobology for spatial search tools
            this.simpleFillSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new Color([255, 0, 0]), 2), new Color([255, 255, 0, 0.25]));
            this.simpleMarkerSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 1), new Color([0, 255, 0, 0.25]));
            this.simpleLineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 1);

            //Get the geometry service, if it is specified
            if (this.options.geometryServiceUrl != null) {
                this.geometryService = new GeometryService(this.options.geometryServiceUrl);
            }

            //Toolbar instance
            this.tb;

            //Navigation
            this.currentView = 2;  //Keeps track of view state within widget

            //operators for attribute search
            this.connectors = [{ label: "AND", value: "AND" }, { label: "OR", value: "OR" }];
            this.operators = [{
                label: "=",
                value: "="
            }, {
                label: "<",
                value: "<"
            }, {
                label: ">",
                value: ">"
            }, {
                label: "not =",
                value: "<>"
            }, {
                label: "<=",
                value: "<="
            }, {
                label: ">=",
                value: ">="
            }, {
                label: "like",
                value: "LIKE"
            }];

        },

        //---------------------------------
        // postCreate
        //---------------------------------
        postCreate: function () { 
            this.inherited(arguments);
        },

        //---------------------------------
        // startup
        //---------------------------------
        startup: function () {
            this.inherited(arguments);

            var _self = this;

            // get windows height
            _self.setWindowSize();

            //set resize event for browser window
            on(window, "resize", _self.setWindowSize);

            //Back Button Click Event
            dojo.query('#at_btnBack').onclick(lang.hitch(this, function (evt) {
                _self.setView(1);
            }));

            //Back Button Click Event
            dojo.query('#at_v3_search').onclick(lang.hitch(this, function (evt) {
                _self.attrSearchClick();
            }));

            //Back Button Click Event
            dojo.query('#at_v3_clear').onclick(lang.hitch(this, function (evt) {
                _self.clearAttrSearch();
            }));

            //Back Button Click Event
            dojo.query('#at_v3_addQueryButton').onclick(lang.hitch(this, function (evt) {
                _self.addQueryParam();
            }));


            //Clear Button Click Event
            dojo.query('#at_btnClear').onclick(lang.hitch(this, function (evt) {
                _self.clearResults();
            }));

            //Main Search Toolbar Buttons' Click Event
            var toolList = dojo.byId("at_toolbar");
            if (toolList) {
                on(toolList, ".attrButton:click, .attrButton:keyup", function (event) {
                    if (event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13)) {
                        query('#at_toolbar .attrButton').removeClass('attrButtonSelected');
                        query(this).addClass('attrButtonSelected');
                        var id = query(this).attr('data-menu')[0];
                        if (id == "geosearch") {
                            _self.clearResults();
                            _self.setView(2);
                        }
                        else if (id == "attrsearch") {
                            _self.clearResults();
                            _self.showAttrSearch();
                        }
                        else if (id == "results") {
                            _self.setView(1);
                        }
                    }
                });
            }

            //configure the spatial search UI
            _self.configureSpatialUI();

            //configure the attribute search UI
            _self.configureAttrUI();

            
            //Initial the revisits dialog box
            this.revDialog = new Dialog({
                title: "Revisits",
                content: "<div id='revisitsDiv'></div>",
                style: "width: 600px"
            });

        },

        
        //==========================================================================================
        //
        // General Methods
        //
        //==========================================================================================
        
        //---------------------------------
        // onHideWidget - Called from main application to toggle off the view of the attribute window.
        //---------------------------------
        onHideWidget: function (e) {
            dojo.style(dojo.byId('at_view_' + this.currentView), "visibility", "hidden");
        },

        //---------------------------------
        // onShowWidget - Called from main application to toggle on the view of the attribute window.
        //---------------------------------
        onShowWidget: function (e) {
            dojo.style(dojo.byId('at_view_' + this.currentView), "visibility", "visible");
        },

        //Shows the loading overly
        showLoading: function (id) {
            for (i = 0; i < this.options.layers.length; i++) {
                if (this.options.layers.layerObject.id == id) {
                    if (this.currentTableIndex == i) {
                        dojo.style(dojo.byId("loadingOverlay"), { display: 'block' });
                    }
                    break;
                }
            }
        },

        //---------------------------------
        // showDialog - Shows a dialog window
        //---------------------------------
        showDialog: function (title, msg) {
            var myDialog = new Dialog({
                id: "dialogAttr",
                title: title,
                'class': "attrDialog",
                draggable: false,
                modal: true,
                showTitle: true
            });

            var html = "<div class='attrDialog'>" + msg + "</div>";

            myDialog.set("content", html);
            myDialog.show();
        },

        //---------------------------------
        // setView - Controls the widget view navigation
        //---------------------------------
        setView: function (view) {
            
            query('.attrTable .viewPane').addClass('hidePane');
            query('#at_view_' + view).removeClass('hidePane');

            this.currentView = view;
        },

        //---------------------------------
        // showAttrSearch - Shows the Attribute Search view
        //---------------------------------
        showAttrSearch: function () {
            //var node = dojo.byId("at_QueryList");
            //if (node) {
            //    node.innerHTML = "";
            //}

            this.setView(3);
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

        //---------------------------------
        // setWindowSize - Sets the window size
        //---------------------------------
        setWindowSize: function() {
            var vs = win.getBox();
            this.windowWidth = vs.w;
            this.windowHeight = vs.h;
        },

        //==========================================================================================
        //
        // Spatial Search Methods
        //
        //==========================================================================================

        //---------------------------------
        // configureSpatialUI - Set up UI and assign events
        //---------------------------------
        configureSpatialUI: function () {
            var _self = this;

            //Spatial Search Buttons' Click Event
            var toolButtons = dojo.byId("at_toolbuttons");
            if (toolButtons) {
                on(toolButtons, ".attrButton:click, .attrButton:keyup", function (event) {
                    if (event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13)) {
                        query('#at_toolbuttons .attrButton').removeClass('attrButtonSelected');
                        query(this).addClass('attrButtonSelected');
                        var id = query(this).attr('data-menu')[0];

                        _self.geoSearch(id);

                    }
                });
            }


            //Get URL and ID for searchable layers and create the UI
            for (i = 0; i < _self.options.layers.length; i++) {
                for (j = 0; j < _self.options.searchLayers.length; j++) {

                    if (_self.options.searchLayers[j].title == _self.options.layers[i].title) {
                        //Set the id and url for the layer
                        _self.options.searchLayers[j].id = _self.options.layers[i].layerObject.id;
                        _self.options.searchLayers[j].url = _self.options.layers[i].layerObject.url;

                        if (_self.options.searchLayers[j].title === _self.options.archSiteLayerTitle) {
                            _self.archSitesUrl = _self.options.layers[i].layerObject.url;
                        }

                        //set the checkbox selection
                        if (_self.options.searchLayers[j].checked == true) {
                            layerClass = 'qlayer checked';
                        }
                        else {
                            layerClass = 'qlayer';
                        }

                        html = '';
                        html += '<li class="' + layerClass + '" data-layer="' + _self.options.layers[i].title + '">';
                        html += '<div class="cover"></div>';
                        html += '<span tabindex="0" class="toggle cBox"></span>';
                        html += '<span tabindex="0" class="toggle cBtitle" title="' + _self.options.layers[i].title + '">' + _self.options.layers[i].title.replace(/[\-_]/g, " ") + '</span>';
                        html += '<div class="clear"></div>';
                        html += '</li>';
                        // append html
                        var node = dojo.byId('at_LayerSelectBoxes');
                        if (node) {

                            domConstruct.place(html, node, "first");
                        }
                        break;
                    }
                }
            }

            //TODO: Hide the buffer options if the geometry service parameter is null

            //TODO: Add event on buffer text box to make sure user is entering numbers
        },

        //---------------------------------
        // toggleChecked - Changes the CSS class for the layer checkboxes
        //---------------------------------
        toggleChecked: function (obj) {
            var _self = this;
            var list = query(obj).parent('li');

            domClass.toggle(list[0], 'checked');
        },

        //---------------------------------
        // showRevisit - Shows the revisit widget, in a dialog, if there are revisits for the site.
        //---------------------------------
        showRevisit: function (layerid, featureid) {
            var _self = this;

            //Get the selected feature
            var feat = _self.searchResults[layerid].features[featureid];
            var sn = feat.attributes.SITENUMBER;

            //Set size to 80% of of the browser size
            var w = Math.round(_self.windowWidth - (0.1 * _self.windowWidth));
            var h = Math.round(_self.windowHeight - (0.1 * _self.windowWidth));

            _self.revDialog.set("style", "width:" + w + "px; height:" + h + "px;");

            var rev = new Revisits({ archSitesUrl: _self.archSitesUrl, sitenumber: sn, width: w, height: h });
            rev.set("style", "width:" + w + "px; height:" + h + "px;");

            _self.revDialog.set("content", "<div id='revisitsDiv'></div>");
            domConstruct.place(rev.domNode, dojo.byId('revisitsDiv'));
            rev.startup();

            _self.revDialog.show();

        },

        //---------------------------------
        // geoSearch - Called when the spatial search buttons are clicked
        //---------------------------------
        geoSearch: function (tool) {
            var _self = this;

            if (dijit.byId("at_UseBuffer").get("checked") == true && dijit.byId("at_txtBufferDist").get("value") == "") {
                _self.showDialog("Error", "Please enter a buffer distance.");
                return;
            }

            _self.options.map.graphics.clear();

            //New draw
            _self.tb = new Draw(_self.options.map);

            //Set up event handler
            _self.tbEvent = _self.tb.on("draw-end", lang.hitch(this, _self.onGeoSearch));

            _self.options.map.disableMapNavigation();
            _self.options.map.disableMapClick();
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
            _self.options.map.enableMapNavigation();
            _self.options.map.enableMapClick();
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
            _self.options.map.graphics.add(new Graphic(evt.geometry, symbol));

            //Check to see if this should be buffered, if not just continue with the search
            if (dijit.byId("at_UseBuffer").get("checked") == true) {
                var params = new BufferParameters();
                params.geometries = [evt.geometry];

                params.distances = [dijit.byId('at_txtBufferDist').get("value")];

                switch (dijit.byId('at_cmbBufferUnits').get("value")) {
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
                params.outSpatialReference = _self.options.map.spatialReference;
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
                this.options.map.graphics.add(new Graphic(result[0], this.simpleFillSymbol));
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

            //Check the selected layer checkboxes and build a promise list
            query(".qlayer.checked").forEach(lang.hitch(this, function (node, index, nodelist) {
                var nquery = new Query();
                nquery.geometry = _self.geo;
                nquery.spatialRelationship = Query.SPATIAL_REL_INTERSECTS;
                nquery.returnGeometry = true;

                var title = domAttr.get(node, 'data-layer');
                var url = '';

                //get the layers parameters
                for (var j = 0; j < this.options.searchLayers.length; j++) {
                    if (_self.options.searchLayers[j].title == title) {
                        _self.queryLayerList.push({ 'title': title, id: _self.options.searchLayers[j].id, 'relid': _self.options.searchLayers[j].relId, 'dispFields': _self.options.searchLayers[j].dispFields });
                        nquery.outFields = _self.options.searchLayers[j].fields;
                        url = _self.options.searchLayers[j].url;
                        break;
                    }
                }

                //Build the task and assign it to the array
                var qTask = new QueryTask(url);
                var qTaskExec = qTask.execute(nquery);
                _self.queryTaskList.push(qTaskExec);

            }));

            //run the promises
            promises = new all(_self.queryTaskList);
            promises.then(lang.hitch(this, this.onSpatialSearch));

            dojo.byId("loadingMessage").innerHTML = "Querying records...";
            _self.setView(5);

        },

        //---------------------------------
        // onSpatialSearch - Handles the results of the spatial search
        //---------------------------------
        onSpatialSearch: function (results) {
            var _self = this;

            _self.setView(1);

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
                        var cspan = _self.queryLayerList[i].dispFields.length + 2;

                        html = '';
                        html += "<div><div class='resultTitle'>" + _self.queryLayerList[i].title + "</div>";
                        html += "<table class='tableResults'>";
                        html += "<tr>";
                        html += "<th>Zoom</th><th>Details</th>";

                        //Print field headers, capitalize first later for the fields
                        for (var j = 0; j < _self.queryLayerList[i].dispFields.length; j++) {
                            html += "<th>" + _self.queryLayerList[i].dispFields[j].charAt(0).toUpperCase() + _self.queryLayerList[i].dispFields[j].substr(1).toLowerCase() + "</th>"
                        }
                        html += "</tr>";

                        //Go through the features
                        for (var m = 0; m < results[i].features.length; m++) {
                            if (m == 0 || m % 2 == 0) {
                                html += "<tr>";
                            }
                            else {
                                html += "<tr class='alt'>";
                            }

                            html += "<td><span class='detailsLink' mode='zoom' layer-id='" + i + "' feature-id='" + m + "'>Zoom</span></td>";

                            html += "<td><span class='detailsLink' mode='details' layermap-id='" + _self.queryLayerList[i].id + "' layer-id='" + i + "' feature-id='" + m + "' rel-id='" + _self.queryLayerList[i].relid + "'>Details</span></td>";

                            html += "</td>";

                            //Add the specified display fields from config.js
                            for (j = 0; j < _self.queryLayerList[i].dispFields.length; j++) {
                                if (results[i].features[m].attributes[_self.queryLayerList[i].dispFields[j]] != null) {
                                    html += "<td>" + results[i].features[m].attributes[_self.queryLayerList[i].dispFields[j]] + "</td>"
                                }
                                else {
                                    html += "<td></td>"
                                }
                            }

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
            on(dojo.byId("at_results"), ".detailsLink:click", function (event) {
                if (event.type === 'click') {
                    var mode = query(this).attr('mode')[0];
                    var layerid = query(this).attr('layer-id');
                    var featureid = query(this).attr('feature-id');
                    
                    if (mode == "zoom") {
                        _self.zoomToSite(layerid, featureid);
                    }
                    else if (mode == "details") {
                        var relid = query(this).attr('rel-id');
                        var layermapid = query(this).attr('layermap-id');
                        _self.showFeatureDetails(layerid, featureid, relid, layermapid);
                    }
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
                ext = new Extent(pt.x - 750, pt.y - 750, pt.x + 750, pt.y + 750, _self.options.map.spatialReference);
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
                this.options.map.setExtent(result[0]);
            }

        },

        //==========================================================================================
        //
        // Attribute Search Methods
        //
        //==========================================================================================

        //---------------------------------
        // configureAttrUI - Set up UI and assign events
        //---------------------------------
        configureAttrUI: function () {
            var _self = this;

            var layersList = dojo.byId("at_LayerSelectBoxes");
            if (layersList) {
                on(layersList, ".toggle:click, .toggle:keyup", function (event) {
                    if (event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13)) {
                        _self.toggleChecked(this);

                    }
                });
            }

            //Set up the options dialog box 
            var soptions = [];

            var select = dojo.byId("at_cmbLayerSelect");
            var initVal = "";
            for (var i = 0; i < this.layers.length; i++) {
                if (this.options.layers[i].layerObject != null) {
                    if (this.options.layers[i].layerObject.type == "Feature Layer") {
                        this.options.layers[i].layerObject.maxRecordCount = 1000;

                        option = document.createElement("option");
                        option.value = this.options.layers[i].layerObject.id;
                        option.innerHTML = this.options.layers[i].title;
                        
                        if (this.options.layers[i].title == _self.options.archSiteLayerTitle) {
                            option.selected = true;
                            var initVal = this.options.layers[i].layerObject.id;
                        }

                        select.appendChild(option);
                    }
                }
            }

            //Add the change event handler
            //on(dojo.byId("at_cmbLayerSelect"), "onChange", lang.hitch(this, this.onSelectLayerClick));
            dojo.byId("at_cmbLayerSelect").onchange = lang.hitch(this, this.onSelectLayerClick);

            this.onSelectLayerClick(initVal);

            var select = dojo.byId("at_oselect0");
            for (var i = 0; i < this.operators.length; i++)
            {
                option = document.createElement("option");
                option.value = this.operators[i].value;
                option.innerHTML = this.operators[i].label;
                select.appendChild(option);
            }
        },

        //---------------------------------
        // onSelectLayerClick - Handles click event on layer select box in Attribute Search
        //---------------------------------
        onSelectLayerClick: function (e) {
            //Reset the attribute search
            this.clearAttrSearch();

            //Remove the list of fields from the select box
            //var cmbfld = dijit.byId("at_fselect0");
            //cmbfld.removeOption(cmbfld.options);

            var select = dojo.byId("at_fselect0");

            //Clean out the select
            select.options.length = 0;
            
            //Populate the fields for the selected layer
            for (var j = 0; j < this.options.layers.length; j++) {
                if (this.options.layers[j].layerObject != null) {
                    if (this.options.layers[j].layerObject.id == dojo.byId("at_cmbLayerSelect").value) {
                        var flds = [];
                        var initVal = "";
                        for (var m = 0; m < this.options.layers[j].layerObject.fields.length; m++) {
                            var name = this.options.layers[j].layerObject.fields[m].name

                            if (name.toUpperCase() != "OBJECTID" && name.toUpperCase() != "SHAPE" && name.toUpperCase() != "SHAPE.LEN" && name.toUpperCase() != "SHAPE.AREA" && name.toUpperCase() != "GLOBALID") {
                                this.fields.push({ value: name, label: name });
                                flds.push({ value: name, label: name });

                                option = document.createElement("option");
                                option.value = name;
                                option.innerHTML = name;
                                select.appendChild(option);

                            }
                        }

                        //cmbfld.addOption(flds);

                        

                        break;
                    }
                }
            }
        },

        //---------------------------------
        // addQueryParam - Add an additional query line to the Attribute UI
        //---------------------------------
        addQueryParam: function () {
            var id = this.criteriaId

            var table = dojo.byId("at_QueryList");
            var rowCount = table.rows.length;

            //Check for duplicates
            for (var i = 0; i < rowCount; i++) {
                if (table.rows[i].cells[0] == dojo.byId("at_fselect0").value) {
                    this.showDialog("Query Error", "Duplicate field values detected");
                    return;
                }
            }

            var row = table.insertRow(rowCount);
            row.id = "at_crit_" + id;

            var cell2 = row.insertCell(0);
            cell2.innerHTML = dojo.byId("at_fselect0").value;

            var cell3 = row.insertCell(1);
            cell3.innerHTML = dojo.byId("at_oselect0").value;

            var cell4 = row.insertCell(2);
            cell4.innerHTML = dojo.byId("at_txt0").value;

            //Delete
            var div = domConstruct.create("div", { id: "at_btn_" + id, 'class': "smallCloseButton" });
            div.onclick = lang.hitch(this, this.removeQueryParam, id);

            var cell5 = row.insertCell(3);
            cell5.id = 'delCol' + id;
            cell5.appendChild(div);

            query('#delCol' + id).addClass('deleteColumn hCenterColumn');

            //Reset the UI
            dojo.byId("at_fselect0").selectedIndex = 0;
            dojo.byId("at_oselect0").selectedIndex = 0;
            dojo.byId("at_txt0").value = "";

            this.criteriaId++;
            this.criteriaCount++;
        },

        //---------------------------------
        // removeQueryParam - Removes a query line to the Attribute UI
        //---------------------------------
        removeQueryParam: function (id) {
           
            var table = dojo.byId("at_QueryList");
            var rowCount = table.rows.length;
            for (var i = 0; i < rowCount; i++) {
                if (table.rows[i].id == "at_crit_" + id) {

                    table.deleteRow(i);
                    break;
                }
            }

            dojo.destroy("at_crit_" + id);

            this.criteriaCount--;
        },

        //---------------------------------
        // attrSearchClick
        //---------------------------------
        attrSearchClick: function () {
            var _self = this;
            var queryString = "";

            var table = dojo.byId("at_QueryList");
            var rowCount = table.rows.length;
            for (var i = 1; i < rowCount; i++) {

                //The first one does not have an join operator (i.e. AND, OR, etc)
                if (i > 1)
                    queryString += " AND ";

                if (this.getFieldType(table.rows[i].cells[0].innerHTML) == "esriFieldTypeString") {
                    queryString += table.rows[i].cells[0].innerHTML + " " + table.rows[i].cells[1].innerHTML + " '" + table.rows[i].cells[2].innerHTML + "'";
                }
                else {
                    queryString += table.rows[i].cells[0].innerHTML + " " + table.rows[i].cells[1].innerHTML + " " + table.rows[i].cells[2].innerHTML;
                }

            }

            console.log("AT/ATRSRCH", queryString);

            //Issue the query against the selected layer
            var qry = new Query();
            qry.outFields = ["*"];
            qry.returnGeometry = true;
            qry.where = queryString;

            var url = _self.options.map.getLayer(dojo.byId("at_cmbLayerSelect").value).url;
            
            var qTask = new QueryTask(url);
            qTask.execute(qry, lang.hitch(this, this.onAttrQueryResults), function (e) {
                console.log("ATRSRCH ERROR", e.message);
            });

            dojo.byId("loadingMessage").innerHTML = "Querying records...";
            _self.setView(5);

        },

        //---------------------------------
        // onAttrQueryResults - Handle the results from the attribute query
        //---------------------------------
        onAttrQueryResults: function (result) {
            var _self = this;

            _self.setView(1);

            console.log("HAQR/RESULTS", result);

            //Store this for later use in results
            _self.searchResults = [result];

            var selSearchLayer = null;

            _self.queryLayerList = [];

            //Get the details for the selected layer
            for (var i = 0; i < _self.options.searchLayers.length; i++) {
                if (_self.options.searchLayers[i].title == _self.options.map.getLayer(dojo.byId("at_cmbLayerSelect").value).name) {
                    _self.queryLayerList.push({ 'title': _self.options.searchLayers[i].title, id: _self.options.searchLayers[i].id, 'relid': _self.options.searchLayers[i].relId, 'dispFields': _self.options.searchLayers[i].dispFields });
                    selSearchLayer = _self.options.searchLayers[i];
                    break;
                }
            }

            //if the layer object is found, process the results
            if (selSearchLayer != null) {
                var node = dojo.byId("at_results");
                if (node) {
                    node.innerHTML = '';
                }

                //Build the results table
                if (result.features.length > 0) {
                    var cspan = selSearchLayer.dispFields.length + 2;

                    html = '';
                    html += "<div><div class='resultTitle'>" + selSearchLayer.title + "</div>";
                    html += "<table class='tableResults'>";
                    html += "<tr>";
                    html += "<th>Zoom</th><th>Details</th>";

                    for (var j = 0; j < selSearchLayer.dispFields.length; j++) {
                        html += "<th>" + selSearchLayer.dispFields[j] + "</th>"
                    }
                    html += "</tr>";

                    var fldValue = "";
                    for (var m = 0; m < result.features.length; m++) {
                        if (m == 0 || m % 2 == 0) {
                            html += "<tr>";
                        }
                        else {
                            html += "<tr class='alt'>";
                        }

                        html += "<td><span class='detailsLink' mode='zoom' layer-id='0' feature-id='" + m + "'>Zoom</span></td>";

                        html += "<td><span class='detailsLink' mode='details' layermap-id='" + selSearchLayer.id + "' layer-id='0' feature-id='" + m + "' rel-id='" + selSearchLayer.relid + "'>Details</span></td>";

                        for (j = 0; j < selSearchLayer.dispFields.length; j++) {
                            fldValue = result.features[m].attributes[selSearchLayer.dispFields[j]];
                            if (fldValue != null) {

                                if (selSearchLayer.dispFields[j].toUpperCase().indexOf("DATE") > -1) {
                                    fldValue = _self.formatDate(new Date(fldValue));
                                }
                            }
                            else {
                                fldValue = "";
                            }

                            html += "<td>" + fldValue + "</td>"

                            fldValue = "";
                        }

                        html += "</tr>";
                    }

                    html += "</table></div>";

                    if (node) {
                        domConstruct.place(html, node, "last");
                    }
                }
                
                //Handle clicks for Details and Zoom
                on(dojo.byId("at_results"), ".detailsLink:click", function (event) {
                    
                    if (event.type === 'click') {
                        var mode = query(this).attr('mode')[0];
                        var layerid = query(this).attr('layer-id');
                        var featureid = query(this).attr('feature-id');
                        
                        if (mode == "zoom") {
                            _self.zoomToSite(layerid, featureid);
                        }
                        else if (mode == "details") {
                            var relid = query(this).attr('rel-id');
                            var layermapid = query(this).attr('layermap-id');
                            _self.showFeatureDetails(layerid, featureid, relid, layermapid);
                        }
                    }
                });
            }
        },

        //---------------------------------
        // clearAttrSearch - Clear & reset the Attribute search UI
        //---------------------------------
        clearAttrSearch: function () {
            var _self = this;

            var children = dojo.query("#at_QueryList").children();

            //Clean out the query parameter lines
            for (var p = 0; p < children.length; p++) {
                var parts = children[p].id.split("_");
                var id = parts[parts.length - 1];
                this.removeQueryParam(id);
            }

            //Reset the UI
            dojo.byId("at_fselect0").selectedIndex = 0;
            dojo.byId("at_oselect0").selectedIndex = 0;
            dojo.byId("at_txt0").value = "";

            //Clear out graphics layer
            _self.options.map.graphics.clear();

        },

        //---------------------------------
        // getFieldType - Used to determine the type of field for the query string
        //---------------------------------
        getFieldType: function (fldName) {
            var _self = this;
            var lyr = dojo.byId("at_cmbLayerSelect").value;
            var result = "";
           
            for (var i = 0; i < _self.options.layers.length; i++) {
                if (_self.options.layers[i].layerObject != null) {
                    if (_self.options.layers[i].layerObject.id == lyr) {

                        for (var j = 0; j < _self.options.layers[i].layerObject.fields.length; j++) {

                            if (_self.options.layers[i].layerObject.fields[j].name == fldName) {
                                result = _self.options.layers[i].layerObject.fields[j].type;
                                break;
                            }
                        };
                        break;
                    }
                }
            };

            return result;
        },

        //---------------------------------
        // getLayerId - Get's the layer id from the layerObject
        //---------------------------------
        getLayerId: function (lyr) {
            var _self = this;

            var fid = "";

            for (var i = 0; i < _self.options.layers.length; i++) {
                if (_self.options.layers[i].title = lyr) {
                    fid = _self.options.layers[i].layerObject.id;
                    break;
                }
            }

            return fid;
        },

        //==========================================================================================
        //
        // Results Methods
        //
        //==========================================================================================

        //---------------------------------
        // showFeatureDetails - show the details for the selected features
        //---------------------------------
        showFeatureDetails: function (layerid, featureid, relid, layermapid) {
            
            var _self = this;

            //Get the feature layer for the selected layer
            var fl = _self.options.map.getLayer(layermapid);

            var node = dojo.byId("at_details");
            if (node) {
                node.innerHTML = '';
            }

            var feat = _self.searchResults[layerid].features[featureid];
            var attrs = _self.searchResults[layerid].fields;

            var html = '';

            //Only do this for Archaeological Site layer
            if (fl.name == _self.options.archSiteLayerTitle) {
                $.ajax({
                    url: _self.options.pdfLookupTblUrl + "/query?where=SITENUMBER+%3D+%27" + feat.attributes.SITENUMBER + "%27&objectIds=&time=&outFields=*&returnIdsOnly=false&returnCountOnly=false&returnZ=false&returnM=false&f=json",
                    dataType: "json",
                    async: false,
                    success: function (result) {
                        if (result.features.length > 0) {
                            if (result.features[0].attributes.Exist === "Y") {
                                html += "<a target=\"_blank\" href=\"" + _self.options.pdfBaseUrl + feat.attributes.SITENUMBER + ".pdf\">View site document</a>";
                            }
                        }
                    }
                });
            }

            //build the results table
            html += "<table class='tableResults'>";
            html += "<tr><th>Field Name</th><th>Value</th></tr>";

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
                    //replace Integers with the domain values from the config.js file
                    else if (attrs[i].type.indexOf("Integer" > -1)) {
                        for (var d = 0; d < _self.options.domainList.length; d++) {
                            if (_self.options.domainList[d].fieldname.toUpperCase() == attrs[i].name.toUpperCase()) {
                                for (var v = 0; v < _self.options.domainList[d].domain.length; v++) {
                                    if (_self.options.domainList[d].domain[v].value == fldValue) {
                                        fldValue = _self.options.domainList[d].domain[v].desc;
                                        break;
                                    }
                                }
                                break;
                            }
                        }
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

            //It's time to check the relationships
            if (relid != "") {
                var rels = fl.relationships;

                //Search on each relationship - Should only be archaeological sites layer
                dojo.forEach(rels, lang.hitch(this, lang.hitch(this, function (relationship) {
                    if (relationship.name != "DOCUMENTS") {
                        var relUrl = fl.url.substring(0, fl.url.lastIndexOf("/") + 1);
                        relUrl += relationship.relatedTableId
                        
                        var fldValue = "";

                        //Build the query
                        var qry = new Query();
                        qry.outFields = ["*"];
                        qry.where = relid + " = '" + feat.attributes[relid] + "'";
                        
                        //Execute query task and build results table
                        var qTask = new QueryTask(relUrl);
                        qTask.execute(qry, function (result) {

                            html = "";
                            html += "<table class='tableResults'>";
                            html += "<tr><th colspan='2'>" + relationship.name + "</th></tr>";

                            if (result.features.length > 0) {
                                for (var m = 0; m < result.features.fields.length; m++) {
                                    if (result.features.fields[m].name.toUpperCase() != "OBJECTID") {
                                        fldValue = feat.attributes[result.features.fields[m].name];
                                        if (fldValue == null) {
                                            fldValue = "";
                                        }

                                        html += "<tr>";
                                        html += "<td>" + result.features.fields[m].alias + "</td>";
                                        html += "<td>" + fldValue + "</td>";
                                        html += "<tr>";

                                        fldValue = "";
                                    }
                                }
                            }
                            else {
                                html += "<tr><td>No related records found.</td></tr>";
                            }

                            html += "</table><br />";

                            var node = dojo.byId("at_details");

                            if (node) {
                                domConstruct.place(html, node, "last");
                            }
                        });
                    }
                })));

            }

            //Check for Revisits if this is the Archaeological Sites layer
            if (fl.name == _self.options.archSiteLayerTitle) {
                var qry = new Query();
                qry.outFields = ["*"];
                qry.where = "SITENUMBER = '" + feat.attributes["SITENUMBER"] + "'";

                var qTask = new QueryTask(fl.url);
                qTask.execute(qry, function (result) {
                    //if there are revisits, add the link to the Revisit Widget
                    if (result.features.length > 1) {
                        html = "<span class='detailsLink' mode='revisit' layer-id='" + layerid + "' feature-id='" + featureid + "'>View Revisit</span> - ";
                        var node = dojo.byId("at_details");

                        if (node) {
                            domConstruct.place(html, node, "first");
                        }
                    }
                });
            }

            _self.setView(4);

        },

        //---------------------------------
        // clearResults - Clears the results view
        //---------------------------------
        clearResults: function () {
            this.options.map.graphics.clear();
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
        // showReport - Shows the PDF report from link in details view
        //---------------------------------
        showReport: function (layerid, featureid) {
            //Get the current feature from searchResults
            var feat = this.searchResults[layerid].features[featureid];

            //Navigate to the PDF Creator
            window.open("../../../PDFCreator.aspx?siteid=" + feat.attributes.SITEID, '_blank');
        }

    });


    return Widget;
});