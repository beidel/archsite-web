define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/query",
    "dijit/registry",
    "dojo/dom-construct",
    "dojo/dom-attr",
    "dojo/dom-class",
	"dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dojo/text!./templates/AddShapefile.html",
	"dojo/on",
    "esri/map",
    "esri/graphic",
    "esri/geometry/Extent",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "dojo/_base/Color",
    "dijit/form/Form"

],
function (declare, lang, query, registry, domConstruct, domAttr, domClass, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
    template, on,
    Map, Graphic, Extent, SimpleFillSymbol, SimpleLineSymbol, Color) {
    var Widget = declare("modules.addShapefile.AddShapefile", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        constructor: function (options) {

            var _self = this;
            this.options = {

            };
            declare.safeMixin(this.options, options);

            // Our template - important!
            this.templateString = template;

            this.widgetsInTemplate = true;

            // A class to be applied to the root node in our template
            this.baseClass = "DataExport";

            this.simpleFillSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new Color([255, 0, 0]), 2), new Color([255, 255, 0, 0.25]));
            this.simpleLineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 1);

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

            dojo.connect(dojo.byId("uploadForm").data, "onchange", lang.hitch(this, function (evt) {
                console.log("EVENT", evt);
                var fileName = evt.target.value.toLowerCase();
                if (dojo.isIE) { //filename is full path in IE so extract the file name
                    var arr = fileName.split("\\");
                    fileName = arr[arr.length - 1];
                }

                if (fileName.indexOf(".zip") !== -1) {//is file a zip - if not notify user 
                    _self.generateFeatureCollection(fileName);
                } else {
                    dojo.byId('upload-status').innerHTML = '<p style="color:red">Add shapefile as .zip file</p>';
                }
            }));

        },


        generateFeatureCollection: function(fileName) {
            console.log("GFC", fileName);
            var _self = this;
            var name = fileName.split(".");
            //Chrome and IE add c:\fakepath to the value - we need to remove it
            //See this link for more info: http://davidwalsh.name/fakepath
            name = name[0].replace("c:\\fakepath\\","");
        
            dojo.byId('upload-status').innerHTML = '<b>Loading… </b>' + name; 
        
            //Define the input params for generate see the rest doc for details
            //http://www.arcgis.com/apidocs/rest/index.html?generate.html
            var params = {
                name: name,
                targetSR: _self.options.map.spatialReference,
                maxRecordCount: 1000,
                enforceInputFileSizeLimit: true,
                enforceOutputJsonSizeLimit: true
            };

            console.log("GFC1");

            //generalize features for display Here we generalize at 1:40,000 which is approx 10 meters 
            //This should work well when using web mercator.  
            var extent = esri.geometry.getExtentForScale(_self.options.map,40000); 
            var resolution = extent.getWidth() / _self.options.map.width;
            params.generalize = true;
            params.maxAllowableOffset = resolution;
            params.reducePrecision = true;
            params.numberOfDigitsAfterDecimal = 0;
        
            var myContent = {
                'filetype': 'shapefile',
                'publishParameters': dojo.toJson(params),
                'f': 'json',
                'callback.html': 'textarea'
            };

            _self.content = dojo.toJson(myContent);

            console.log("GFC2", myContent);

            console.log("UF", dojo.byId('uploadForm'));

            //use the rest generate operation to generate a feature collection from the zipped shapefile 
            esri.request({
                url: 'http://www.arcgis.com/sharing/rest/content/features/generate?f=json&filetype=shapefile&callback.html=textarea&publishParameters=' + _self.content,
                form: dojo.byId('uploadForm'),
                handleAs: 'json',
                load: dojo.hitch(this, function (response) {
                    console.log("RESPONSE");
                    if (response.error) {
                        console.log("RESPONSEERROR");
                        errorHandler(response.error);
                        return;
                    }
                    dojo.byId('upload-status').innerHTML = '<b>Loaded: </b>' + response.featureCollection.layers[0].layerDefinition.name;
                    _self.addShapefileToMap(response.featureCollection);
                }),
                error: lang.hitch(this, _self.errorHandler)
            });
            
            
            },

        errorHandler: function (error) {
            console.log("GENERROR", error);
            dojo.byId('upload-status').innerHTML = "<p style='color:red'>" + error.message + "</p>";
        },



        addShapefileToMap: function (featureCollection) {
            console.log("FC", featureCollection);
            var _self = this;
                //add the shapefile to the map and zoom to the feature collection extent
                //If you want to persist the feature collection when you reload browser you could store the collection in 
                //local storage by serializing the layer using featureLayer.toJson()  see the 'Feature Collection in Local Storage' sample
                //for an example of how to work with local storage. 
            var fullExtent;
            var layers = [];

            dojo.forEach(featureCollection.layers, function (layer) {
                var infoTemplate = new esri.InfoTemplate("Details", "${*}");
                var layer = new esri.layers.FeatureLayer(layer, {
                    infoTemplate: infoTemplate
                });
                //associate the feature with the popup on click to enable highlight and zoomto
                        dojo.connect(layer,'onClick',function(evt){
                    _self.options.map.infoWindow.setFeatures([evt.graphic]);
                });
                //change default symbol if desired. Comment this out and the layer will draw with the default symbology
                changeRenderer(layer);
                fullExtent = fullExtent ? fullExtent.union(layer.fullExtent) : layer.fullExtent;
                layers.push(layer);
            });
            _self.options.map.addLayers(layers);
            _self.options.map.setExtent(fullExtent.expand(1.25), true);
        
            dojo.byId('upload-status').innerHTML = "";
        }  


    });


    return Widget;
});