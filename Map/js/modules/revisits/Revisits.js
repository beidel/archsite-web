define([
    "dojo/_base/declare",
    "dojo/_base/connect",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/_base/event",
    "dojo/dom-construct",
    "dojo/parser",
    "dojo/query",
    "dijit/registry",
	"dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dojo/text!./templates/Revisits.html",
	"dojo/dom-style",
	"dojo/_base/fx",
	"dojo/on",
    "esri/map",
    "esri/graphic",
    "esri/tasks/QueryTask",
    "esri/tasks/query",
    "esri/geometry/Extent",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "dojo/_base/Color",
],
function (declare, connect, arr, lang, event, domConstruct, parser, query, registry, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, domStyle, baseFx, on,  
    Map, Graphic, QueryTask, Query, Extent, SimpleFillSymbol, SimpleLineSymbol, Color) {
    var Widget = declare("modules.revisits.Revisits", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        constructor: function (options) {

            var _self = this;
            this.options = {

            };
            declare.safeMixin(this.options, options);

            // Our template - important!
            this.templateString = template;

            this.widgetsInTemplate = true;

            // A class to be applied to the root node in our template
            this.baseClass = "Revisits";

            this.rev1FillSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_NULL, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color('red'), 2), null);
            this.rev2FillSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_NULL, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color("blue"), 2), null);

            this.rFeatures = null;
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

            _self.map = new Map(dojo.byId("rv_Map"), {
                basemap: "topo",
                sliderStyle: "small"
                
            });

            domStyle.set(dojo.byId("rv_MapDiv"), {
                "width": _self.options.width + 'px',
                "height": _self.options.height + 'px'
            });

            domStyle.set(dojo.byId("rv_Report"), {
                "width": _self.options.width - 20 + 'px',
                "height": _self.options.height - 50 + 'px'
            });

            var node = dojo.byId('rv_Map');
            if (node) {
                console.log("MAPWIDTH", _self.options.width + ":" + _self.options.height);
                domStyle.set(node, {
                    "width": _self.options.width + 'px',
                    "height": _self.options.height - 25 + 'px'
                });
            }   

            dojo.query('#rv_BackButton').onclick(lang.hitch(this, function (evt) {
                _self.hideGeoCompare();
            }));

            _self.getSiteDetails(_self.options.sitenumber);


        },

        getSiteDetails: function (siteNum) {
            var _self = this;
            var qry = new Query();
            qry.where = "SITENUMBER = '" + siteNum + "'";
            qry.outFields = ["*"];
            qry.returnGeometry = true;
            query.orderByFields = ["REVISITNUM"];

            var qTask = new QueryTask(_self.options.archSitesUrl);
            qTask.execute(qry, function (result) {
                console.log("revisit", result);
                _self.rFeatures = result.features;
                
                var flds = result.fields;
                //start comparison
                html = "";
                
                //run a comparison on revisists
                for (var i = 0; i < result.features.length; i++) {
                    
                    //Loop through other revisits
                    if (i != (result.features.length - 1)) {
                        
                        for (var j = (i + 1) ; j < result.features.length; j++) {
                            
                            html += "<table class='tableResults'>";
                            html += "<tr><th>Field Name</th><th>Revisit " + i + "</th><th>Revisit " + j + "</th></tr>";

                            

                            //check geometries
                            if (result.features[i].geometry != result.features[j].geometry) {
                                html += "<tr><td>Site Boundary</td><td colspan='2'><span class='geoCompareLink' revisit1='" + i + "' revisit2='" + j + "'>Site boundary has changed<span></td></tr>";
                            }

                           
                           

                            //loop through fields
                            for (var f = 0; f < flds.length; f++) {
                                
                                if (result.features[i].attributes[flds[f].name] != result.features[j].attributes[flds[f].name])
                                {
                                    html += "<tr><td>" + flds[f].alias + "</td><td>" + result.features[i].attributes[flds[f].name] + "</td>";
                                    html += "<td>" + result.features[j].attributes[flds[f].name] + "</td></tr>";
                                }
                                
                            }
                            html += "</table><br />";
                            
                        }
                    }
                }

               

                var node = dojo.byId("rv_Report");
                if (node) {

                    node.innerHTML = html;
                }

                

                on(dojo.byId("rv_Report"), ".geoCompareLink:click", function (event) {
                    if (event.type === 'click') {
                        var rev1 = query(this).attr('revisit1');
                        var rev2 = query(this).attr('revisit2');
                        _self.showGeoCompare(rev1, rev2);
                    }
                });

            });
        },

        showGeoCompare: function (rev1, rev2) {
            var _self = this;
            //rev1FillSymbol

            var gra1 = new Graphic(_self.rFeatures[rev1].geometry, _self.rev1FillSymbol, null);
            var gra2 = new Graphic(_self.rFeatures[rev2].geometry, _self.rev2FillSymbol, null);

            dojo.byId("#rv_Rev1Text").innerHTML = _self.rFeatures[rev1].attributes.REVISITNUM;
            dojo.byId("#rv_Rev2Text").innerHTML = _self.rFeatures[rev2].attributes.REVISITNUM;

            //poly = _self.rFeatures[rev1].geometry;

            var ext1 = _self.rFeatures[rev1].geometry.getExtent();
            var ext2 = _self.rFeatures[rev2].geometry.getExtent();

            var extBuf = 500;
            var xmin = ext2.xmin - extBuf;
            var ymin = ext2.ymin - extBuf;
            var xmax = ext2.xmax + extBuf;
            var ymax = ext2.ymax + extBuf;

            if (ext1.xmin > ext2.xmin) {
                xmin = ext1.xmin - extBuf;
            }


            if (ext1.ymin > ext2.ymin) {
                ymin = ext1.ymin - extBuf;
            }


            if (ext1.xmax > ext2.xmax) {
                xmax = ext1.xmax + extBuf;
            }


            if (ext1.ymax > ext2.ymax) {
                ymax = ext1.ymax + extBuf;
            }

            var newExt = new Extent(xmin, ymin, xmax, ymax, _self.map.spatialReference);

            _self.map.graphics.add(gra1);
            _self.map.graphics.add(gra2);

            query('#rv_Report').addClass('hideItem');
            query('#rv_MapDiv').removeClass('hideItem');

            _self.map.resize();
            _self.map.reposition();
            _self.map.setExtent(newExt);
        },

        hideGeoCompare: function () {
            console.log("hiding");
            query('#rv_Report').removeClass('hideItem');
            query('#rv_MapDiv').addClass('hideItem');
        }
    });


    return Widget;
});