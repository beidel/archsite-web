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
	"dojo/text!./templates/DataExport.html",
	"dojo/on",
    "esri/map",
    "esri/toolbars/draw",
    "esri/graphic",
    "esri/geometry/Extent",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "dojo/_base/Color",
    "esri/tasks/Geoprocessor"
],
function (declare, lang, query, registry, domConstruct, domAttr, domClass, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
    template, on,
    Map, Draw, Graphic, Extent, SimpleFillSymbol, SimpleLineSymbol, Color, Geoprocessor) {
    var Widget = declare("modules.dataexport.DataExport", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
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

            //Toolbar instance
            this.tb;

            this.ext;

            this.exportFileName = "";
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

            //
            dojo.query('#dex_btnExtractArea').onclick(lang.hitch(this, function (evt) {
                this.selectExtArea();
            }));

            //
            dojo.query('#dex_btnSubmit').onclick(lang.hitch(this, function (evt) {
                this.exportDataRequest2();
            }));

            dojo.query('#dex_exportLink').onclick(lang.hitch(this, function (evt) {
                this.setView(1);
            }));

            dojo.query('#dex_exportLink2').onclick(lang.hitch(this, function (evt) {
                this.setView(1);
            }));

           this.buildUI();

        },

        buildUI: function () {
            var _self = this;

            //Get URL and ID for searchable layers and create the UI
            for (i = 0; i < _self.options.layers.length; i++) {
                for (j = 0; j < _self.options.exportLayers.length; j++) {

                    if (_self.options.exportLayers[j].title == _self.options.layers[i].title) {
                        //Set the id and url for the layer
                        _self.options.exportLayers[j].id = _self.options.layers[i].layerObject.id;
                        _self.options.exportLayers[j].url = _self.options.layers[i].layerObject.url;


                        //set the checkbox selection
                        if (_self.options.exportLayers[j].checked == true) {
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
                        var node = dojo.byId('dex_LayerSelectBoxes');
                        if (node) {
                            domConstruct.place(html, node, "first");
                        }
                        break;
                    }
                }
            }

            var layersList = dojo.byId("dex_LayerSelectBoxes");
            if (layersList) {
                on(layersList, ".toggle:click, .toggle:keyup", function (event) {
                    if (event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13)) {
                        _self.toggleChecked(this);

                    }
                });
            }

        },

        //---------------------------------
        // toggleChecked - Changes the CSS class for the layer checkboxes
        //---------------------------------
        toggleChecked: function (obj) {
            var _self = this;
            var list = query(obj).parent('li');

            domClass.toggle(list[0], 'checked');
        },

        selectExtArea: function() {
            var _self = this;

            query('#selExtractArea').addClass('attrButtonSelected');

            _self.options.map.graphics.clear();

            //New draw
            _self.tb = new Draw(_self.options.map);

            //Set up event handler
            _self.tbEvent = _self.tb.on("draw-end", lang.hitch(this, _self.onSelectExtArea));

            _self.options.map.disableMapNavigation();
            _self.tb.activate("extent");
        },

        onSelectExtArea: function(evt) {
            var _self = this;

            console.log("evt", evt);

            //Reset the tools on the toolbar
            query('#selExtractArea').removeClass('attrButtonSelected');

            //Deactivate draw
            _self.tb.deactivate();
            _self.options.map.enableMapNavigation();
            //Remove event handler
            _self.tbEvent.remove();

            //Set symbology based on shape type
            var symbol;
            switch (evt.geometry.type) {
                case "extent":
                    symbol = this.simpleFillSymbol;
                    break;
            }

            //Add the user defined search graphic
            _self.options.map.graphics.add(new Graphic(evt.geometry, symbol));

            _self.ext = evt.geometry;

            console.log("onext", _self.ext);
        },

        exportDataRequest2 :function() {
            var _self = this;

            _self.setView(2);

            var d = new Date();

            this.options.map.graphics.clear();

            if (dojo.byId("dex_rbCurExt").checked == true) {
                console.log("current ext");
                _self.ext = _self.options.map.extent;
            }

            console.log("ext", _self.ext);
            console.log("agstoken", _self.options.analysisGpToken);

            _self.gp = new Geoprocessor(_self.options.analysisGpServerUrl + "/ExtractData?token=" + _self.options.analysisGpToken);


            var inputLayers = [];
            var extObj = "";
            var contextObj = "";
            var outputName = "";
            var urlStr = "[";

            if (_self.ext != null) {

                var chkCount = 0;

                query("#dex_LayerSelectBoxes .qlayer.checked").forEach(lang.hitch(this, function (node, index, nodelist) {

                    var title = domAttr.get(node, 'data-layer');
                    
                    var url = '';

                    console.log("QLAYER", title);

                    //get the layers parameters
                    for (var j = 0; j < this.options.exportLayers.length; j++) {
                        if (_self.options.exportLayers[j].title == title) {
                            url = _self.options.exportLayers[j].url;
                            break;
                        }
                    }

                    //inputLayers.push({'url':  url, serviceToken: _self.options.token});
                    urlStr += "{ 'url': '" + url + "', 'serviceToken': '" + _self.options.token + "'}";
                   
                    chkCount++;

                }));

                urlStr += "]";

                if (chkCount > 0) {
                    //extObj = {xmin: _self.ext.xmin, ymin: _self.ext.ymin, xmax: _self.ext.xmax, ymax: _self.ext.ymax, spatialReference: {wkid: 102100, latestWkid: 3857} };
                    //contextObj = {extent: {type: 'extent', xmin: _self.ext.xmin, ymin: _self.ext.ymin, xmax: _self.ext.xmax, ymax: _self.ext.ymax, spatialReference: {wkid: 102100, latestWkid: 3857} }}

                    extObj += "{'";
                    extObj += "xmin':" + _self.ext.xmin + ",'";
                    extObj += "ymin':" + _self.ext.ymin + ",'";
                    extObj += "xmax':" + _self.ext.xmax + ",'";
                    extObj += "ymax':" + _self.ext.ymax + ",'";
                    extObj += "spatialReference':{'";
                    extObj += "wkid':102100,'";
                    extObj += "latestWkid':3857}}";


                    contextObj += "{'";
                    contextObj += "extent':{'";
                    contextObj += "type':'";
                    contextObj += "extent','";
                    contextObj += "xmin':" + _self.ext.xmin + ",'";
                    contextObj += "ymin':" + _self.ext.ymin + ",'";
                    contextObj += "xmax':" + _self.ext.xmax + ",'";
                    contextObj += "ymax':" + _self.ext.ymax + ",'";
                    contextObj += "spatialReference':{'";
                    contextObj += "wkid':102100,'";
                    contextObj += "latestWkid':3857}}}";

                    _self.exportFileName = "Extract Data " + d.getMonth().toString() + d.getDate().toString() + d.getFullYear().toString() + d.getHours().toString() + d.getMinutes().toString() + d.getSeconds().toString();

                    //outputName = {itemProperties:{title: _self.exportFileName, description: "File generated from running the Extract Data solution.", tags: "Analysis Result, Extract Data", snippet: "Analysis File item generated from Extract Data", folderId: ""}};

                    outputName = "{'itemProperties':{'title':'" + _self.exportFileName + "','description':'File generated from running the Extract Data solution.','tags':'Analysis Result, Extract Data','snippet':'Analysis File item generated from Extract Data','folderId':''}}";


                }

            }

            console.log("IL", urlStr);

            var params = {
                "inputLayers": urlStr,
                "clip": false,
                "dataFormat": dojo.byId("dex_selOutputType").value,
                "extent": extObj,
                "context": contextObj,
                "outputName": outputName
            };

            _self.gp.submitJob(params, lang.hitch(this, _self.completeCallback) , lang.hitch(this,_self.statusCallback), function(error){
                console.log(error);
                //_self.setView(2);
            });

        },

        completeCallback: function (jobInfo) {
            var _self = this;
            console.log("SUCCESS", jobInfo);
            if (jobInfo.jobStatus !== "esriJobFailed") {
                console.log("OK");

                _self.gp.getResultData(jobInfo.jobId, "contentID", lang.hitch(this, _self.downloadFile), function (error) {

                    console.log(error);
                });

                console.log("OK1");
          }
        },

        statusCallback: function (jobInfo) {
            console.log(jobInfo);
            var status = jobInfo.jobStatus;
            if ( status === "esriJobFailed" ) {
                console.log(jobInfo);

            }
            else if (status === "esriJobSucceeded"){

            }
        },

        downloadFile: function (outputFile) {
            var _self = this;
            console.log("OUTPUT");
            console.log("OUTPUT", outputFile);
            
            ///sharing/rest/content/items/09bfbc48ed8f4368b34a2c4b56416968/data?
            //value.itemID
            //https://www.arcgis.com/sharing/rest/content/items/" + outputFile.value.itemID + "/data?token=" + _self.options.token + "
                dojo.byId("dex_pdfLink").innerHTML = "<a href='https://www.arcgis.com/sharing/rest/content/items/" + outputFile.value.itemID + "/data?token=" + _self.options.token + "' target=_blank>Link</a>";
            //window.location = outputFile.value.url + "/data?token=" + _self.options.token;
            _self.setView(3);
        //var theurl = outputFile.value.url;
        //window.location = theurl;
    },

        exportDataRequest: function () {
            var _self = this;

            var d = new Date();

            this.options.map.graphics.clear();

            if (dojo.byId("dex_rbCurExt").value == "CurExt") {
                _self.ext = _self.options.map.extent;
            }
            

            if (_self.ext != null) {

                var urlStr = _self.options.analysisGpServerUrl + "/ExtractData/submitJob?f=json";
                urlStr += "&InputLayers=";

                urlStr += "%5B";

                comma = "";

                var chkCount = 0;

                query("#dex_LayerSelectBoxes .qlayer.checked").forEach(lang.hitch(this, function (node, index, nodelist) {

                    var title = domAttr.get(node, 'data-layer');
                    
                    var url = '';

                    console.log("QLAYER", title);

                    //get the layers parameters
                    for (var j = 0; j < this.options.exportLayers.length; j++) {
                        if (_self.options.exportLayers[j].title == title) {
                            url = _self.options.exportLayers[j].url;
                            break;
                        }
                    }

                    urlStr += comma + "{'url': '" + encodeURIComponent(url) + "', serviceToken: '" + _self.options.token + "'}";
                    //urlStr += "%22%7B%5C%22url%5C%22%3A%5C%22http%3A%2F%2Fservices.arcgis.com%2FoEazpvC7G00gPDRM%2Farcgis%2Frest%2Fservices%2FArchSites_Prod%2FFeatureServer%2F1%5C%22%2C%5C%22serviceToken%5C%22%3A%5C%" + _self.options.token + "%5C%22%7D%22";

                    comma = ",";

                    chkCount++;

                }));

                if (chkCount > 0) {

                    urlStr += "%5D";

                    urlStr += "&Clip=false";
                    urlStr += "&DataFormat=" + dojo.byId("dex_selOutputType").value;


                    urlStr += "&Extent=%7B%22";
                    urlStr += "xmin%22%3A" + _self.ext.xmin + "%2C%22";
                    urlStr += "ymin%22%3A" + _self.ext.ymin + "%2C%22";
                    urlStr += "xmax%22%3A" + _self.ext.xmax + "%2C%22";
                    urlStr += "ymax%22%3A" + _self.ext.ymax + "%2C%22";
                    urlStr += "spatialReference%22%3A%7B%22";
                    urlStr += "wkid%22%3A102100%2C%22";
                    urlStr += "latestWkid%22%3A3857%7D%7D";


                    urlStr += "&context=%7B%22";
                    urlStr += "extent%22%3A%7B%22";
                    urlStr += "type%22%3A%22";
                    urlStr += "extent%22%2C%22";
                    urlStr += "xmin%22%3A" + _self.ext.xmin + "%2C%22";
                    urlStr += "ymin%22%3A" + _self.ext.ymin + "%2C%22";
                    urlStr += "xmax%22%3A" + _self.ext.xmax + "%2C%22";
                    urlStr += "ymax%22%3A" + _self.ext.ymax + "%2C%22";
                    urlStr += "spatialReference%22%3A%7B%22";
                    urlStr += "wkid%22%3A102100%2C%22";
                    urlStr += "latestWkid%22%3A3857%7D%7D%7D";

                    _self.exportFileName = "Extract%20Data%20" + d.getMonth().toString() + d.getDate().toString() + d.getFullYear().toString() + d.getHours().toString() + d.getMinutes().toString() + d.getSeconds().toString();

                    urlStr += "&OutputName=%7B%22itemProperties%22%3A%7B%22title%22%3A%22" + _self.exportFileName + "%22%2C%22description%22%3A%22File%20generated%20from%20running%20the%20Extract%20Data%20solution.%22%2C%22tags%22%3A%22Analysis%20Result%2C%20Extract%20Data%22%2C%22snippet%22%3A%22Analysis%20File%20item%20generated%20from%20Extract%20Data%22%2C%22folderId%22%3A%22%22%7D%7D";

                    urlStr += "&token=" + _self.options.analysisGpToken;

                    console.log("URL", decodeURI(urlStr));

                    //urlStr = decodeURI(urlStr);

                    var layersRequest = esri.request({
                        url: urlStr,
                        handleAs: "json",
                        callbackParamName: "callback"
                    });

                    layersRequest.then(
                        function (response) {
                            console.log("YEA", response);
                            _self.runGPTool(response.jobId);

                        }, function (error) {
                            console.log("Error: ", error.message);
                        });
                }
            }
        },

        buildRequest: function(urlStr, tokenStr) {
            var layersRequest = esri.request({
                url: urlStr,
                content: {
                    f: "json",
                    token: tokenStr
                },
                handleAs: "json",
                callbackParamName: "callback"
            });

            return layersRequest;
        },

        runGPTool: function (jobId) {
            var _self = this;
            setTimeout(function () {
                console.log("TIME", jobId);
                _self.buildRequest(_self.options.analysisGpServerUrl + "/ExtractData/jobs/" + jobId, _self.options.analysisGpToken)
                    .then(function (response) {
                        console.log(response.jobStatus);
                        if (response.jobStatus == "esriJobSucceeded") {
                            _self.buildRequest(_self.options.analysisGpServerUrl + "/ExtractData/jobs/" + jobId, _self.options.analysisGpToken)
                                .then(function (response) {
                                    console.log("RESPONSE", response);
                                    _self.checkDir();
                                });
                        }
                        else if (response.jobStatus == "esriJobFailed") {
                            console.log("ERROR", response);
                            return;
                        }
                        else {
                            _self.runGPTool(jobId);
                        }
                    });
            }, 3000);
        },

        checkDir: function () {
            var _self = this;
            console.log("checkdir");
            ///sharing/rest/content/users/kramerusc
            _self.buildRequest("http://www.arcgis.com/sharing/rest/content/users/kramerusc", _self.options.analysisGpToken)
                .then(function (response) {
                    console.log("RESPONSE for directory", response);

                    var items = response.items;

                    var objId = "";
       
                    console.log("RESPONSE for TITLE", _self.exportFileName);

                    for (var i = 0; i < items.length; i++) {
                        console.log("Title", items[i].title);
                        if (items[i].title == decodeURI(_self.exportFileName)) {
                            console.log("ID", items[i].id);
                            objId = items[i].id;
                            break;
                        }
                    }

                    if (objId != "") {

                        var url = "http://www.arcgis.com/sharing/rest/content/items/" + objId + "/data";

                        _self.buildRequest(url, _self.options.analysisGpToken)
                            .then(function (response) {
                                console.log("RESPONSE for download", response);
                            });
                    }
            });

        },

        //---------------------------------
        // setView - Controls the widget view navigation
        //---------------------------------
        setView: function (view) {

            query('.dataExport .viewPane').addClass('hidePane');
            query('#dex_view_' + view).removeClass('hidePane');

            this.currentView = view;
        }

        
    });


    return Widget;
});