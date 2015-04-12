define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/event",
    "dojo/parser",
    "dojo/query",
    "dijit/registry",
	"dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dojo/text!./templates/DrawMeasure.html",
	"dojo/_base/fx",
    "dojo/dom-style",
	"dojo/on",
    "dojo/topic",
    "dojo/dom-attr",
    "esri/toolbars/draw",
    "esri/tasks/GeometryService",
    "esri/tasks/AreasAndLengthsParameters",
    "esri/tasks/LengthsParameters",
    "esri/tasks/ProjectParameters",
    "esri/SpatialReference",
    "esri/graphic",
    "esri/geometry/Extent",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleMarkerSymbol",
    "dojo/_base/Color",
    "dijit/form/Select"
],
function (declare, lang, event, parser, query, registry, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, baseFx, domStyle, on, topic, domAttr,
    Draw, GeometryService, AreasAndLengthsParameters, LengthsParameters, ProjectParameters, SpatialReference, Graphic, Extent, SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol, Color, Select) {
    var Widget = declare("modules.drawmeasure.DrawMeasure", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        constructor: function (options) {

            var _self = this;
            this.options = {

            };
            declare.safeMixin(this.options, options);

            // Our template - important!
            this.templateString = template;

            this.widgetsInTemplate = true;

            // A class to be applied to the root node in our template
            this.baseClass = "drawMeasure";

            this.tbEvent = null;
            this.prjEvent = null;
            this.distLabel = "";

            this.tb = null;

            this.simpleFillSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([193, 39, 45]), 1), new Color([193, 39, 45, 0.25]));
            this.simpleMarkerSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([193, 39, 45]), 1), new Color([0, 255, 0, 0.25]));
            this.simpleLineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([193, 39, 45]), 1);

            if (this.options.geometryServiceUrl != null) {
                this.geometryService = new GeometryService(this.options.geometryServiceUrl);
            }

        },

        // postCreate is called once our widget's DOM is ready,
        // but BEFORE it's been inserted into the page!
        // This is far and away the best point to put in any special work.
        postCreate: function () {
            // Get a DOM node reference for the root of our widget
            var domNode = this.domNode;

            // Run any parent postCreate processes - can be done at any point
            this.inherited(arguments);

        },

        startup: function () {
            this.inherited(arguments);

            var _self = this;

            var toolList = dojo.byId("buttonPanel");
            if (toolList) {
                on(toolList, ".measureButton:click, .measureButton:keyup", function (event) {
                    if (event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13)) {
                        query('#buttonPanel .measureButton').removeClass('measureButtonSelected');
                        query('#buttonPanel .selectMenus').addClass('hideItem');
                        query('#buttonPanel .selectBox').addClass('hideItem');
                        query(this).addClass('measureButtonSelected');
                        var type = query(this).attr('data-measure')[0];

                        if (type != null) {
                            if (type == "polyline") {
                                query('#buttonPanel .selectMenus').removeClass('hideItem');
                                query('#dm_lengthUnits').removeClass('hideItem');
                            }
                            else if (type == "polygon") {
                                query('#buttonPanel .selectMenus').removeClass('hideItem');
                                query('#dm_areaUnits').removeClass('hideItem');
                            }
                            else if (type == "point") {
                                query('#dm_lengthUnits').removeClass('hideItem');
                                query('#dm_areaUnits').removeClass('hideItem');
                            }
                            _self.doMeasure(type);
                        }
                        else {

                        }

                    }
                });
            }

            var results = dojo.byId("dm_Results");
            if (results) {
                on(results, ".clearLink:click, .clearLink:keyup", function (event) {
                    if (event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13)) {
                        _self.clearResults();
                    }
                });
            }
        },

        doMeasure: function (tool) {
            //disable map clicks
            this.options.map.disableActiveTools();

            this.options.map.graphics.clear();
            var node = dojo.byId("dm_ResultView");
            if (node) {
                node.innerHTML = "";
            }

            var tb = this.tb;
            tb = new Draw(this.options.map);
            this.tb = tb;

            this.tbEvent = tb.on("draw-end", lang.hitch(this, this.onEndDraw));

            this.options.map.disableMapNavigation();
            this.options.map.setInfoWindowOnClick(false);
            topic.publish("disablePopups");
            this.tb.activate(tool);
        },

        onEndDraw: function (evt) {
            var _self = this;
            this.options.map.enableActiveTools();
            var geo = evt.geometry;
            var sym;

            switch (geo.type) {
                case "point":
                    sym = _self.simpleMarkerSymbol;
                    break;
                case "polyline":
                    sym = _self.simpleLineSymbol;
                    break;
                case "polygon":
                    sym = _self.simpleFillSymbol;
                    break;
            }

            var gra = new Graphic(evt.geometry, sym, null);

            this.options.map.graphics.add(gra);

            _self.tb.deactivate();
            _self.options.map.enableMapNavigation();
            _self.options.map.setInfoWindowOnClick(true);
            topic.publish("enablePopups");

            _self.tbEvent.remove();

            var params = new ProjectParameters();
            params.geometries = [geo];
            params.outSR = new SpatialReference({ wkid: 26717 });
            params.transformation = { wkid: 15851 };

            self.prjEvent = _self.geometryService.on("project-complete", lang.hitch(this, this.onEndProject));
            _self.geometryService.project(params);
        },

        onEndProject: function (result) {
            var _self = this;
            var areasAndLengthParams = null;
            var lengthParams = null;

            self.prjEvent.remove();
            if (result.geometries[0] != null) {
                var geo = result.geometries[0];
                var results = "";
                var select;

                //Get the returning length or coordinates
                if (geo.type == "point") {
                    query('#dm_Results .clearLink').removeClass('hideItem');
                    results = "N: " + geo.x.toFixed(5) + "<br />E: " + geo.y.toFixed(5)
                    dojo.byId("dm_ResultView").innerHTML = results;
                }
                else if (geo.type == "polyline") {
                    lengthParams = new LengthsParameters();
                    lengthParams.polylines = [geo];
                    //Default
                    lengthParams.lengthUnit = GeometryService.UNIT_METER;
                    _self.distLabel = "Meters";


                    if (domAttr.get("dm_lengthUnits", "value") != null) {

                        switch (domAttr.get("dm_lengthUnits", "value")) {
                            case "UNIT_METER":
                                _self.distLabel = "Meters";
                                lengthParams.lengthUnit = GeometryService.UNIT_METER;
                                break;
                            case "UNIT_FOOT":
                                _self.distLabel = "Feet";
                                lengthParams.lengthUnit = GeometryService.UNIT_FOOT;
                                break;
                            case "UNIT_KILOMETER":
                                _self.distLabel = "Kilometers";
                                lengthParams.lengthUnit = GeometryService.UNIT_KILOMETER;
                                break;
                            case "UNIT_STATUTE_MILE":
                                _self.distLabel = "Miles";
                                lengthParams.lengthUnit = GeometryService.UNIT_STATUTE_MILE;
                                break;
                            default:
                                _self.distLabel = "Meters";
                                lengthParams.lengthUnit = GeometryService.UNIT_METER;
                                break;
                        }
                    }


                    lengthParams.geodesic = true;
                    _self.geometryService.lengths(lengthParams, lang.hitch(_self, _self.onMeasurePolyline), function (error) {
                        alert("Line Measurement error: " + error);
                    });
                }
                else if (geo.type == "polygon") {
                    areasAndLengthParams = new AreasAndLengthsParameters();
                    areasAndLengthParams.lengthUnit = GeometryService.UNIT_METER;
                    areasAndLengthParams.areaUnit = GeometryService.UNIT_ACRES;
                    _self.distLabel = "Acres";


                    if (domAttr.get("dm_areaUnits", "value") != null) {

                        switch (domAttr.get("dm_areaUnits", "value")) {
                            case "UNIT_ACRES":
                                _self.distLabel = "Acres";
                                areasAndLengthParams.areaUnit = GeometryService.UNIT_ACRES;
                                break;
                            case "UNIT_HECTARES":
                                _self.distLabel = "Hectares";
                                areasAndLengthParams.areaUnit = GeometryService.UNIT_HECTARES;
                                break;
                            case "UNIT_SQUARE_FEET":
                                _self.distLabel = "Sq. ft.";
                                areasAndLengthParams.areaUnit = GeometryService.UNIT_SQUARE_FEET;
                                break;
                            case "UNIT_SQUARE_METERS":
                                _self.distLabel = "Sq. m";
                                areasAndLengthParams.areaUnit = GeometryService.UNIT_SQUARE_MILES;
                                break;
                            case "UNIT_SQUARE_YARDS":
                                _self.distLabel = "Sq. yds";
                                areasAndLengthParams.areaUnit = GeometryService.UNIT_SQUARE_YARDS;
                                break;
                            default:
                                _self.distLabel = "Acres";
                                areasAndLengthParams.areaUnit = GeometryService.UNIT_ACRES;
                                break;
                        }
                    }


                    areasAndLengthParams.polygons = [geo];
                    _self.geometryService.areasAndLengths(areasAndLengthParams, lang.hitch(_self, _self.onMeasurePolygon), function (error) {
                        alert("Polygon Measurement error: " + error);
                    });
                }
            }
        },

        onMeasurePolyline: function (result) {
            query('#buttonPanel .measureButton').removeClass('measureButtonSelected');
            query('#dm_Results .clearLink').removeClass('hideItem');
            console.log("project2", result);
            dojo.byId("dm_ResultView").innerHTML = result.lengths[0].toFixed(5) + " " + this.distLabel;
        },

        onMeasurePolygon: function (result) {
            query('#buttonPanel .measureButton').removeClass('measureButtonSelected');
            query('#dm_Results .clearLink').removeClass('hideItem');
            console.log("project2", result);
            dojo.byId("dm_ResultView").innerHTML = result.areas[0].toFixed(5) + " " + this.distLabel;
        },

        clearResults: function () {
            this.options.map.graphics.clear();
            dojo.byId("dm_ResultView").innerHTML = "";
            query('#buttonPanel .selectMenus').addClass('hideItem');
            query('#buttonPanel .selectBox').addClass('hideItem');
            query('#buttonPanel .measureButton').removeClass('measureButtonSelected');
            query('#dm_Results .clearLink').addClass('hideItem');

            this.tb.deactivate();
            this.options.map.enableMapNavigation();
            this.options.map.setInfoWindowOnClick(true);
            topic.publish("enablePopups");

            this.tbEvent.remove();
        }
    });

    return Widget;
});