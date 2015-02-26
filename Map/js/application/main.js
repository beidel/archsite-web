define(["dojo/ready", "dojo/_base/declare", "dojo/_base/connect", "dojo/_base/Deferred", "dojo/_base/event", "dojo/_base/array", "dojo/_base/lang", "dojo/dom",
    "dojo/query", "dojo/dom-class", "dojo/dom-construct", "dojo/dom-geometry", "dojo/dom-style", "dojo/date", "dojo/number", "dojo/window",
    "dojo/on", "dojo/topic", "dojo/fx", "dojo/i18n!./nls/template.js", "modules/edit/EditSite", "modules/adminview/AdminView", "modules/attrtable/AttrTable",
    "modules/sitereport/SiteReport", "modules/adminview/AdminView", "modules/print/PrintWidget",
    "modules/scaleselector/ScaleSelector", "modules/drawmeasure/DrawMeasure", "modules/dataexport/DataExport", "dijit/Dialog",
    "dijit/form/HorizontalSlider",
    "dijit/form/VerticalSlider", "dojo/NodeList-traverse", "dojo/NodeList-manipulate", "templateConfig/commonConfig", "dojo/cookie", "dojo/json", 
    "esri/config", "esri/arcgis/utils", "esri/urlUtils", "esri/request", "esri/tasks/query", "esri/tasks/QueryTask", "esri/tasks/GeometryService",
    "esri/dijit/BasemapGallery", "esri/dijit/HomeButton", "esri/dijit/LocateButton", "esri/geometry/Extent", "esri/geometry/Point", "esri/SpatialReference", "esri/symbols/PictureMarkerSymbol",
    "esri/dijit/Legend", "esri/dijit/Scalebar", "esri/geometry/webMercatorUtils", "esri/graphic", "esri/layers/GraphicsLayer", "esri/dijit/Geocoder",
    "esri/geometry/screenUtils", "esri/dijit/Popup", "esri/layers/FeatureLayer", "esri/dijit/Measurement", "esri/IdentityManagerBase", "esri/kernel", "esri/dijit/Print"
, "esri/tasks/PrintTemplate", "dojo/store/Memory", "dijit/form/ComboBox"],
function (ready, declare, connect, Deferred, event, array, lang, dom, query, domClass, domConstruct, domGeom, domStyle, date, number, win, on, topic, coreFx, i18n,
    EditSite, AdminView, AttrTable, SiteReport, AdminView, PrintWidget, ScaleSelector, DrawMeasure, DataExport, Dialog, HorizontalSlider, VerticalSlider, nlTraverse, nlManipulate,
    templateConfig, cookie, JSON, config, arcgisUtils, urlUtils, esriRequest, Query, QueryTask, GeometryService, BasemapGallery, HomeButton, LocateButton, Extent, Point, SpatialReference,
    PictureMarkerSymbol, Legend, Scalebar, webMercatorUtils, Graphic, GraphicsLayer, Geocoder, screenUtils, Popup, FeatureLayer, Measurement, IMB, kernel, Print,
    PrintTemplate, Memory, ComboBox) {
    var Widget = declare("application.main", null, {
        constructor: function(options) {
            var _self = this;
            this.options = {};
            declare.safeMixin(_self.options, options);
            _self.setOptions();
            ready(function() {
                _self.getItemData().then(function(response) {
                    if (response) {
                        // check for false value strings
                        var appSettings = _self.setFalseValues(response.values);
                        _self._appSettings = appSettings;
                        // set other config options from app id
                        _self.options = declare.safeMixin(_self.options, _self._appSettings);
                    }
                    _self.init();
                });
            });

            this.debug = true;

            this.mapExtentEvent;
            this.mapPanEvent;
            this.mapZoomEvent;
        },
        logToConsole: function (msg) {
            if (this.debug == true) {
                console.log(msg);
            }
        },
        // Set false url param strings to false
        setFalseValues: function(obj) {
            // for each key
            for (var key in obj) {
                // if not a prototype
                if (obj.hasOwnProperty(key)) {
                    // if is a false value string
                    if (typeof obj[key] === 'string' && (obj[key].toLowerCase() === 'false' || obj[key].toLowerCase() === 'null' || obj[key].toLowerCase() === 'undefined')) {
                        // set to false bool type
                        obj[key] = false;
                    }
                    // if it's a true string
                    else if (typeof obj[key] === 'string' && obj[key].toLowerCase() === 'true') {
                        obj[key] = true;
                    }
                }
            }
            // return object
            return obj;
        },
        // set application configuration settings
        getItemData: function(all) {
            var _self = this;
            var deferred = new Deferred();
            if (_self.options.appid) {
                var dataUrl;
                if (all) {
                    dataUrl = arcgisUtils.arcgisUrl + "/" + _self.options.appid;
                } else {
                    dataUrl = arcgisUtils.arcgisUrl + "/" + _self.options.appid + "/data";
                }
                esriRequest({
                    url: dataUrl,
                    content: {
                        f: "json"
                    },
                    callbackParamName: "callback",
                    // on load
                    load: function(response) {
                        // callback function
                        deferred.resolve(response);
                    },
                    // on error
                    error: function(response) {
                        var error = response.message;
                        // show error dialog
                        var dialog = new Dialog({
                            title: i18n.viewer.errors.general,
                            content: '<div class="padContainer">' + error + '</div>'
                        });
                        dialog.show();
                        deferred.resolve();
                    }
                });
            } else {
                deferred.resolve();
            }
            return deferred;
        },
        getUrlObject: function() {
            var params = urlUtils.urlToObject(document.location.href);
            // make sure it's an object
            params.query = params.query || {};
            return params;
        },
        // get URL params
        configUrlParams: function() {
            var _self = this;
            // set url object
            var params = this.getUrlObject();
            // check for false value strings
            params.query = this.setFalseValues(params.query);
            // mix in settings
            _self.options = declare.safeMixin(_self.options, params.query);
        },
        // set defaults for config
        setDefaultOptions: function() {
            var _self = this;
            if (!_self.options.locateName) {
                _self.options.locateName = "";
            }
            _self.options.previewSize = {
                "width": 900,
                "height": 750
            };
            _self.options.embedSizes = {
                "small": {
                    width: 480,
                    height: 360
                },
                "medium": {
                    width: 700,
                    height: 525
                },
                "large": {
                    width: 940,
                    height: 705
                },
                "maximum": {
                    width: 1900,
                    height: 1200
                },
                "minimum": {
                    width: 350,
                    height: 250
                }
            };
            _self.options.previewPage = 'preview.html';
            _self.options.homePage = 'index.html';
            if (!_self.options.layerInfos) {
                _self.options.layerInfos = [];
            }
            if (_self.options.layers && typeof _self.options.layers === 'string') {
                _self.options.layers = _self.options.layers.split(',');
            } else {
                _self.options.layers = [];
            }
            if (_self.options.locatePoint && typeof _self.options.locatePoint === 'string') {
                _self.options.locatePoint = _self.options.locatePoint.split(',');
            } else {
                _self.options.locatePoint = [];
            }
            if (window.dojoConfig.locale && window.dojoConfig.locale.indexOf("ar") !== -1) {
                //right now checking for Arabic only, to generalize for all RTL languages
                _self.options.isRightToLeft = true; // _self.options.isRightToLeft property setting to true when the locale is 'ar'
            }
            var dirNode = query('html');
            if (_self.options.isRightToLeft) {
                _self.options.dir = 'rtl';
                dirNode.attr("dir", "rtl");
                dirNode.addClass('esriRtl');
            } else {
                _self.options.dir = 'ltr';
                dirNode.attr("dir", "ltr");
                dirNode.addClass('esriLtr');
            }
        },
        // make sure config options are correct
        validateConfig: function() {
            var _self = this;
            //need to set the sharing url here so that when we query the applciation and organization the correct
            //location is searched.
            if (location.host.indexOf("arcgis.com") === -1) {
                //default (Not Hosted no org specified)
                arcgisUtils.arcgisUrl = location.protocol + "//www.arcgis.com/sharing/rest/content/items";
            } else {
                // org app
                arcgisUtils.arcgisUrl = location.protocol + '//' + location.host + "/sharing/rest/content/items";
                _self.options.proxyUrl = location.protocol + '//' + location.host + "/sharing/proxy";
            }
            //if the sharing url is set overwrite value
            if (_self.options.sharingurl) {
                arcgisUtils.arcgisUrl = _self.options.sharingurl + 'sharing/rest/content/items';
                //esri.dijit._arcgisUrl = _self.options.sharingurl + 'sharing/rest';
            }
            /* else {
                esri.dijit._arcgisUrl = location.protocol + "//www.arcgis.com/sharing/rest/";
            } */
            // Set geometry to HTTPS if protocol is used
            if (templateConfig.helperServices.geometry.url && location.protocol === "https:") {
                templateConfig.helperServices.geometry.url = templateConfig.helperServices.geometry.url.replace('http:', 'https:');
            }
            config.defaults.geometryService = new GeometryService(templateConfig.helperServices.geometry.url);
            //config.defaults.io.proxyUrl = _self.options.proxyUrl.substring(0, _self.options.proxyUrl.lastIndexOf('/'));

            config.defaults.io.proxyUrl = _self.options.proxyUrl;


            console.log(config.defaults.io.proxyUrl);
            var proxySub = _self.options.proxyUrl.substring(0, _self.options.proxyUrl.lastIndexOf('/'));
            //esri.addProxyRule({ urlPrefix: "analysis.arcgis.com", proxyUrl: proxySub });

            config.defaults.io.useCors = true;
            config.defaults.io.corsEnabledServers.push("analysis.arcgis.com");
            config.defaults.io.alwaysUseProxy = false;

            console.log("DONE");
        },
        // Alert box
        alertDialog: function(text) {
            var _self = this;
            if (_self._alertDialog) {
                _self._alertDialog.destroy();
            }
            if (_self.alertCloseConnect) {
                connect.disconnect(_self.alertCloseConnect);
            }
            var html = '';
            html += '<div class="padContainer">';
            html += '<div>';
            html += text;
            html += '</div>';
            html += '<div class="buttons">';
            html += '<span id="closeAlert" tabindex="0" class="mapSubmit">' + i18n.viewer.general.ok + '</span>';
            html += '</div>';
            html += '</div>';
            var props = {
                style: "width: 350px",
                draggable: true,
                modal: false,
                showTitle: true,
                title: i18n.viewer.errors.general,
                content: html
            };
            _self._alertDialog = new Dialog(props, dom.byId('alertDialog'));
            _self._alertDialog.show();
            var closeAlert = dom.byId("closeAlert");
            if (closeAlert) {
                _self.alertCloseConnect = on(closeAlert, "click, keyup", function(event) {
                    if (event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13)) {
                        _self._alertDialog.hide();
                    }
                });
            }
        },
        // create the basemap gallery when active
        createBMGallery: function() {
            var _self = this;
            var basemapGroup = false;
            if (!_self.options.useArcGISOnlineBasemaps) {
                basemapGroup = {
                    title: _self.options.basemapGroupTitle,
                    owner: _self.options.basemapGroupOwner
                };
            }
            // basemap gallery
            _self.basemapDijit = new BasemapGallery({
                showArcGISBasemaps: _self.options.useArcGISOnlineBasemaps,
                basemapsGroup: basemapGroup,
                map: _self.map
            }, domConstruct.create("div"));
            // on initial load
            connect.connect(_self.basemapDijit, "onLoad", function () {
                query('#mapLoading').removeClass('mapLoading');
                query('#mapLoading').addClass('hideItem');
                //query('#mapcon').removeClass('hideMapCon');
                _self.selectCurrentBasemap().then(function() {
                    connect.connect(_self.basemapDijit, "onSelectionChange", function() {
                        _self.baseMapChanged();
                    });
                });
            });
            // start it up
            
            var baseContainer = dom.byId("baseContainer");
            if (baseContainer) {
                domConstruct.place(_self.basemapDijit.domNode, baseContainer, "first");
            }

            _self.basemapDijit.startup();
        },
        // Gets current basemap ID by its title
        getBasemapIdTitle: function(title) {
            var _self = this;
            var bmArray = _self.basemapDijit.basemaps;
            if (bmArray) {
                for (var i = 0; i < bmArray.length; i++) {
                    if (bmArray[i].title === title) {
                        return bmArray[i].id;
                    }
                }
            }
            return false;
        },
        // Gets current basemap id by its Item ID on arcgisonline
        getBasemapId: function(itemId) {
            var _self = this;
            var bmArray = _self.basemapDijit.basemaps;
            if (bmArray) {
                for (var i = 0; i < bmArray.length; i++) {
                    if (bmArray[i].itemId === itemId) {
                        return bmArray[i].id;
                    }
                }
            }
            return false;
        },
        // Selects a basemap by its title
        selectCurrentBasemap: function() {
            var _self = this;
            var deferred = new Deferred();
            _self._bmInitConnect = connect.connect(_self.basemapDijit, "onSelectionChange", function() {
                deferred.resolve();
                connect.disconnect(_self._bmInitConnect);
            });
            var bmid;
            if (_self.options.basemap) {
                bmid = _self.getBasemapId(_self.options.basemap);
                if (bmid) {
                    _self.basemapDijit.select(bmid);
                }
            } else {
                bmid = _self.getBasemapIdTitle(_self.itemInfo.itemData.baseMap.title);
                if (bmid) {
                    _self.basemapDijit.select(bmid);
                }
            }
            return deferred;
        },
        // on change of basemap, update selected basemap global variable
        baseMapChanged: function() {
            var _self = this;
            // get currently selected basemap
            var basemap = _self.basemapDijit.getSelected();
            if (basemap && basemap.itemId) {
                // update global
                _self.options.basemap = basemap.itemId;
            }
            // set sharing links and embed code
            //_self.setSharing();
            _self.hideAllMenus();
        },
        adjustPopupSize: function(map) {
            var box = domGeom.getContentBox(map.container);
            var width = 270,
                height = 300,
                // defaults
                newWidth = Math.round(box.w * 0.60),
                newHeight = Math.round(box.h * 0.45);
            if (newWidth < width) {
                width = newWidth;
            }
            if (newHeight < height) {
                height = newHeight;
            }
            map.infoWindow.resize(width, height);
        },
        // Set initial extent for future use
        setStartExtent: function() {
            var _self = this;
            _self.options.startExtent = _self.map.extent;
            // if extent is a string
            if (_self.options.extent && typeof _self.options.extent === 'string') {
                var splitExtent = _self.options.extent.split(',');
                // Loaded from URL
                _self.options.startExtent = new Extent({
                    xmin: parseFloat(splitExtent[0]),
                    ymin: parseFloat(splitExtent[1]),
                    xmax: parseFloat(splitExtent[2]),
                    ymax: parseFloat(splitExtent[3]),
                    spatialReference: _self.map.extent.spatialReference
                });
            }
            _self.map.setExtent(_self.options.startExtent);
        },
        setStartLevel: function() {
            var _self = this;
            if (_self.options.level) {
                _self.map.setLevel(parseInt(_self.options.level, 10));
            }
        },
        setStartMarker: function() {
            var _self = this;
            if (_self.options.locatePoint[0] && _self.options.locatePoint[1]) {
                var point = new Point([_self.options.locatePoint[0], _self.options.locatePoint[1]], SpatialReference({
                    wkid: _self.map.spatialReference.wkid
                }));
                if (point) {
                    _self.setMarker(point, _self.options.locateName);
                }
            }
        },
        // set the order of these functions
        setOptions: function() {
            var _self = this;
            _self.configUrlParams();
            _self.setDefaultOptions();
            _self.validateConfig();
        },
        toggleSettingsContent: function() {
            var node = query('#collapseIcon')[0];
            var panel = query('#settingsDialog .dijitDialogPaneContent');
            domClass.toggle(node, "iconDown");
            if (domClass.contains(node, "iconDown")) {
                panel.style('display', 'none');
            } else {
                panel.style('display', 'block');
            }
        },
        // hide all dropdown menus
        hideAllMenus: function () {
            console.log("hideMenu");
            var _self = this;
            query('#topMenuCon .barButton').removeClass('barSelected');
            query('#mapcon .menuSelected').forEach(function(selectTag) {
                _self.hideMenu(selectTag);
            });
        },
        // hide all dropdown menus
        hideAllNavMenus: function () {
            var _self = this;
            query('#navPanel .NavButton').removeClass('navButtonSelected');
            query('#mapcon .navMenuSelected').forEach(function (selectTag) {
                _self.hideNavMenu(selectTag);
            });
        },
        // Show dropdown menu
        showMenu: function (menuObj, buttonObj) {
            console.log("menuObj", menuObj);
            console.log("buttonObj", buttonObj);
            query('#mapcon .menuSelected').removeClass('menuSelected');
            if (menuObj) {
                coreFx.wipeIn({
                    node: menuObj,
                    duration: 200
                }).play();
                query(menuObj).addClass('menuSelected');
            }
            if (buttonObj) {
                //query(buttonObj).addClass('barSelected');
            }
        },
        // Show dropdown menu
        showNavMenu: function (menuObj, buttonObj) {
            query('#mapcon .navMenuSelected').removeClass('navMenuSelected');
            if (menuObj) {
                coreFx.wipeIn({
                    node: menuObj,
                    duration: 200
                }).play();
                query(menuObj).addClass('navMenuSelected');
            }
            console.log("button", buttonObj);
            if (buttonObj) {
                query(buttonObj).addClass('navButtonSelected');
            }
        },
        // settings panel ui
        configureSettingsUI: function() {
            var _self = this;
            var props = {
                style: "width: 400px",
                draggable: true,
                showTitle: true,
                title: i18n.viewer.settings.title
            };
            // new Dialog(
            _self.options.settingsDialog = new Dialog(props, dom.byId('settingsDialog'));
            var node = query('#settingsDialog .dijitDialogTitle')[0];
            if (node) {
                node.innerHTML = '<div id="collapseIcon"></div><span class="configIcon"></span><span id="settingsTitle">' + i18n.viewer.settings.title + '</span>';
            }
            // Settings Menu Config
            var cfgMenu = dom.byId("cfgMenu");
            if (cfgMenu) {
                on(cfgMenu, ".mapButton:click, .mapButton:keyup", function(event) {
                    if (event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13)) {
                        query('#cfgMenu .mapButton').removeClass('buttonSelected');
                        query(this).addClass('buttonSelected');
                        var id = query(this).attr('data-layer')[0];
                        var panelObj = query('#settingsDialog .cfgPanel[data-layer=' + id + ']');
                        query("#settingsDialog .cfgPanel").style('display', 'none');
                        panelObj.style('display', 'block');
                    }
                });
            }
            var collapseIcon = dom.byId("collapseIcon");
            if (collapseIcon) {
                on(collapseIcon, "click", function(event) {
                    if (event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13)) {
                        _self.toggleSettingsContent();
                    }
                });
            }
            var settingsDialog = dom.byId("settingsDialog");
            if (settingsDialog) {
                on(settingsDialog, ".dijitDialogTitleBar:dblclick", function() {
                    _self.toggleSettingsContent();
                });
            }
            
        },    
        // return correct button class
        getButtonClass: function(i, size) {
            if ((i === 1) && (i === size)) {
                return 'buttonSingle';
            } else {
                switch (i) {
                case 1:
                    return 'buttonLeft';
                case size:
                    return 'buttonRight';
                default:
                    return 'buttonCenter';
                }
            }
        },
        // Folder Layer CheckBoxes
        toggleChecked: function(obj) {
            var _self = this;
            var list = query(obj).parent('li');
            if (domClass.contains(list[0], "checked")) {
                list.removeClass('cLoading');
            } else {
                list.addClass('cLoading');
            }
            domClass.toggle(list[0], 'checked');
            //_self.setSharing();
        },
        // removes layer from list of visible layers
        removeFromActiveLayers: function(layerid) {
            var _self = this;
            var theIndex = this.getActiveLayerIndex(layerid);
            for (theIndex; theIndex > -1; theIndex = this.getActiveLayerIndex(layerid)) {
                _self.options.layers.splice(theIndex, 1);
            }
            //_self.setSharing();
        },
        // change active layers
        getActiveLayerIndex: function(layerid) {
            var _self = this;
            var indexNum = array.indexOf(_self.options.layers, layerid);
            return indexNum;
        },
        // adds layer to list of visible layers
        addToActiveLayers: function(layerid) {
            var _self = this;
            var theIndex = _self.getActiveLayerIndex(layerid);
            if (theIndex === -1) {
                _self.options.layers.push(layerid);
            }
            //_self.setSharing();
        },
        // layers ui
        configureLayerUI: function() {
            var _self = this;
            var layersList = dom.byId("layersList");
            if (layersList) {
                on(layersList, ".toggle:click, .toggle:keyup", function(event) {
                    if (event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13)) {
                        _self.toggleChecked(this);
                        var changeMapVal = query(this).parent('li').attr('data-layer')[0];
                        var splitVals = changeMapVal.split(',');
                        if (splitVals) {
                            for (var i = 0; i < splitVals.length; i++) {
                                _self.toggleMapLayer(splitVals[i]);
                            }
                        }
                        _self.hideLoading(query('#layersList li[data-layer="' + changeMapVal + '"]'));
                    }
                });
            }
            // ToolTips
            on(query(".listMenu"), ".cBinfo:click, .cBinfo:keyup", function(event) {
                if (event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13)) {
                    var toolTip = query(this).parent('li').children('.infoHidden');
                    query('.listMenu ul li .cBinfo').removeClass('cBinfoAnim');
                    if (toolTip[0]) {
                        if (toolTip.style('display')[0] === 'none') {
                            query('.infoHidden').style('display', 'none');
                            query('.listMenu ul li').removeClass('active');
                            query(this).parent('li').addClass('active');
                            toolTip.style('display', 'inline-block');
                            query(this).addClass('cBinfoAnim');
                        } else {
                            toolTip.style('display', 'none');
                            query(this).parent('li').removeClass('active');
                        }
                    }
                }
            });
            // Close Menus
            on(query(".slideMenu"), ".closeMenu:click, .closeMenu:keyup", function() {
                _self.hideAllMenus();
            });
            on(query(".bottomMenu"), ".closeMenu:click, .closeMenu:keyup", function () {
                _self.hideAllNavMenus();
            });
            // Close Menus
            on(query(".editSitePane"), ".closeMenu:click, .closeMenu:keyup", function () {
                _self.toggleEditSiteMenu('edit');
            });
            // Close Menus
            on(query(".adminPane"), ".closeMenu:click, .closeMenu:keyup", function () {
                _self.toggleAdminMenu('admin');
            });
            // Close Menus
            on(query(".attributePane"), ".closeMenu:click, .closeMenu:keyup", function () {
                _self.toggleAttributeMenu('find');
            });
            // Close ToolTips
            on(query(".listMenu"), ".ihClose:click, .ihClose:keyup", function() {
                _self.hideLayerInfo();
            });
            // config settings
            on(query(".listMenu"), ".cBconfig:click, .cBconfig:keyup", function(event) {
                if (event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13)) {
                    _self.hideLayerInfo();
                    query('.listMenu ul li .cBconfig').removeClass('cBconfigAnim');
                    var parentLi = query(this).parent('li').attr('data-layer')[0];
                    var panelObj = query('#settingsDialog .cfgPanel[data-layer=' + parentLi + ']');
                    var panelBtn = query('#cfgMenu .mapButton[data-layer=' + parentLi + ']');
                    query('#cfgMenu span').removeClass('buttonSelected');
                    panelBtn.addClass('buttonSelected');
                    _self.options.customPopup.hide();
                    query(this).addClass('cBconfigAnim');
                    query("#settingsDialog .cfgPanel").style('display', 'none');
                    panelObj.style('display', 'block');
                    query('#collapseIcon').removeClass('iconDown');
                    query('#settingsDialog .dijitDialogPaneContent').style('display', 'block');
                    if (!_self.options.settingsDialog.get('open')) {
                        _self.options.settingsDialog.show();
                    } else if (_self.options.currentSettingsTab === parentLi) {
                        _self.options.settingsDialog.hide();
                    }
                    _self.options.currentSettingsTab = parentLi;
                }
            });
        },
        // toggle map layer on and off
        toggleMapLayer: function(layerid) {
            var _self = this;
            var layer = _self.map.getLayer(layerid);
            if (layer) {
                //if visible hide the layer
                if (layer.visible === true) {
                    layer.hide();
                    _self.removeFromActiveLayers(layerid);
                }
                //otherwise show and add to layers
                else {
                    layer.show();
                    _self.addToActiveLayers(layerid);
                }
            }
        },
        addLayerToUI: function(layerToAdd, index) {
            var _self = this;
            // each layer
            var layerClass;
            // URL layers variable
            var urlLayers = false;
            var params = _self.getUrlObject();
            // if visible layers set in URL
            if (params.query.hasOwnProperty('layers')) {
                urlLayers = true;
            }
            // generate layer html
            var html = '';
            // if layer object
            if (layerToAdd) {
                // default layer class
                layerClass = 'layer';
                // layer ids
                var dataLayers = '';
                // key variable
                var key;
                if (layerToAdd.featureCollection) {
                    // if feature collection layers
                    if (layerToAdd.featureCollection.layers) {
                        // for each feature collection
                        for (var k = 0; k < layerToAdd.featureCollection.layers.length; k++) {
                            // if URL layers set
                            if (urlLayers) {
                                // set layer visibility to false
                                layerToAdd.featureCollection.layers[k].visibility = false;
                                _self.map.getLayer(layerToAdd.featureCollection.layers[k].id).hide();
                                // for each visible layer array item
                                for (key in _self.options.layers) {
                                    // if current layer ID matches visible layer item
                                    if (_self.options.layers[key] === layerToAdd.featureCollection.layers[k].id) {
                                        // set visibility to true
                                        layerToAdd.featureCollection.layers[k].visibility = true;
                                        _self.map.getLayer(layerToAdd.featureCollection.layers[k].id).show();
                                    }
                                }
                            }
                            // if layer visibility is true
                            if (layerToAdd.featureCollection.layers[k].visibility === true) {
                                // set layer class to checked
                                layerClass = 'layer checked';
                                // add to active layers array
                                _self.addToActiveLayers(layerToAdd.featureCollection.layers[k].id);
                            }
                            // data layer attrubute
                            dataLayers += layerToAdd.featureCollection.layers[k].id;
                            // if not last feature collection add comma for splitting
                            if (k !== (layerToAdd.featureCollection.layers.length - 1)) {
                                dataLayers += ",";
                            }
                        }
                    }
                    // csv
                    else {
                        // if URL layers set
                        if (urlLayers) {
                            _self.map.getLayer(layerToAdd.id).hide();
                            layerToAdd.visibility = false;
                            // for each visible layer array item
                            for (key in _self.options.layers) {
                                // if current layer ID matches visible layer item
                                if (_self.options.layers[key] === layerToAdd.id) {
                                    // set visibility to true
                                    layerToAdd.visibility = true;
                                    _self.map.getLayer(layerToAdd.id).show();
                                }
                            }
                        }
                        // if layer visibility is true
                        if (layerToAdd.visibility === true) {
                            // set layer class to checked
                            layerClass = 'layer checked';
                            // add to active layers array
                            _self.addToActiveLayers(layerToAdd.id);
                        }
                        // data layer attrubute
                        dataLayers += layerToAdd.id;
                    }
                } else {
                    // if URL layers set
                    if (urlLayers) {
                        layerToAdd.visibility = false;
                        _self.map.getLayer(layerToAdd.id).hide();
                        // for each visible layer array item
                        for (key in _self.options.layers) {
                            // if current layer ID matches visible layer item
                            if (_self.options.layers[key] === layerToAdd.id) {
                                // set visibility to true
                                layerToAdd.visibility = true;
                                _self.map.getLayer(layerToAdd.id).show();
                            }
                        }
                    }
                    // if layer visibility is true
                    if (layerToAdd.visibility === true) {
                        // set layer class to checked
                        layerClass = 'layer checked';
                        // add to active layers array
                        _self.addToActiveLayers(layerToAdd.id);
                    }
                    // data layer attrubute
                    dataLayers += layerToAdd.id;
                }
                // Set data layers
                layerToAdd.dataLayers = dataLayers;
                // compose html list string
                html += '<li class="' + layerClass + '" data-layer="' + dataLayers + '">';
                html += '<div class="cover"></div>';
                html += '<span tabindex="0" class="cBinfo" title="' + i18n.viewer.layer.information + '"></span>';
                html += '<span tabindex="0" class="toggle cBox"></span>';
                html += '<span tabindex="0" class="toggle cBtitle" title="' + layerToAdd.title + '">' + layerToAdd.title.replace(/[\-_]/g, " ") + '</span>';
                html += '<div class="infoHidden">';
                html += '<div class="transSlider"><span class="transLabel">' + i18n.viewer.layer.transparency + '</span><span id="layerSlider' + index + '" data-layer-id="' + dataLayers + '" class="uiSlider slider"></span></div>';
                html += '</div>';
            }
            html += '</li>';
            // append html
            var node = dom.byId('layersList');
            if (node) {
                domConstruct.place(html, node, "first");
            }
        },
        // Show spinner on object
        showLoading: function(obj) {
            if (obj) {
                query('#' + obj).removeClass('LoadingComplete').addClass('Loading').style('display', 'inline-block');
            }
        },
        // remove loading spinners
        hideLoading: function(obj, obj2) {
            if (obj) {
                obj.removeClass('cLoading');
            }
            if (obj2) {
                obj2.removeClass('Loading').addClass('LoadingComplete');
            }
        },
        addLayerTransparencySlider: function(theLayer, index) {
            var _self = this;
            // if layer object
            if (theLayer) {
                // init sliders
                HorizontalSlider({
                    name: "slider",
                    value: parseFloat(theLayer.opacity * 100),
                    minimum: 1,
                    showButtons: false,
                    maximum: 100,
                    discreteValues: 20,
                    intermediateChanges: true,
                    style: "width:100px; display:inline-block; *display:inline; vertical-align:middle;",
                    onChange: function(value) {
                        _self.transparencyChange(value, theLayer.dataLayers);
                    }
                }, "layerSlider" + index);
            }
        },
        // create layer items
        configureLayers: function() {
            var _self = this;
            // if operational layers
            if (_self.itemInfo.itemData.operationalLayers) {
                // if operational layers of at least 1
                if (_self.itemInfo.itemData.operationalLayers.length > 0) {
                    if (!_self.options.layerInfos) {
                        _self.options.layerInfos = [];
                    }
                    // get legend layers
                    var legendLayers = arcgisUtils.getLegendLayers(_self.mapResponse);
                    // build layers
                    _self.options.layerInfos = _self.options.layerInfos.concat(legendLayers);
                    var node;
                    //if (_self.options.showLegendMenu) {
                        
                        node = dom.byId('legendMenu');
                        if (node) {
                            node.innerHTML = '<div class="menuClose"><div class="closeButton closeMenu"></div>' + i18n.viewer.legend.menuTitle + '<div class="clear"></div></div><div class="legendMenuCon"><div class="slideScrollBottom"><div id="legendContent"></div></div></div>';
                        }
                        
                        // Build Legend
                        if (_self.options.layerInfos && _self.options.layerInfos.length > 0) {

                            _self.options.legendDijit = new Legend({
                                map: _self.map,
                                layerInfos: _self.options.layerInfos
                            }, "legendContent");
                            _self.options.legendDijit.startup();
                        } else {

                            var legendContentNode = dom.byId('legendContent');
                            if (legendContentNode) {
                                legendContentNode.innerHTML = i18n.viewer.errors.noLegend;
                            }
                        }
                    //}
                    // ADD URL
                    node = dom.byId('layersMenu');
                    if (node) {
                        node.innerHTML = '<div class="menuClose"><div class="closeButton closeMenu"></div>' + i18n.viewer.layers.menuTitle + '<div class="clear"></div></div><div class="slideScrollBottom"><ul id="layersList"></ul></div>';
                    }
                    

                    // for each layer
                    for (var i = 0; i < _self.itemInfo.itemData.operationalLayers.length; i++) {
                        _self.addLayerToUI(_self.itemInfo.itemData.operationalLayers[i], i);
                        _self.addLayerTransparencySlider(_self.itemInfo.itemData.operationalLayers[i], i);
                    }
                }


                _self.options.scaleBar = new Scalebar({
                    map: _self.map,
                    attachTo: "bottom-center",
                    scalebarUnit: i18n.viewer.main.scaleBarUnits
                });
                _self.configureLayerUI();

            }
        },
        // slidder transparency change
        transparencyChange: function(value, layerID) {
            var _self = this;
            var newValue = (value / 100);
            var splitVals = layerID.split(',');
            if (splitVals) {
                for (var j = 0; j < splitVals.length; j++) {
                    var layer = _self.map.getLayer(splitVals[j]);
                    if (layer) {
                        if (layer._fLayers) {
                            for (var k = 0; k < layer._fLayers.length; k++) {
                                layer._fLayers[k].setOpacity(newValue);
                            }
                        } else {
                            layer.setOpacity(newValue);
                        }
                    }
                }
            }
        },
        // create places item
        createPlacesListItem: function(i) {
            var _self = this;
            // default vars //
            var html = '';
            // list html
            html += '<li data-index="' + i + '" class="layer sharedItem placesClick">';
            html += _self.itemInfo.itemData.bookmarks[i].name.replace(/[\-_]/g, " ");
            html += '</li>';
            // insert list item
            var node = dom.byId('placesList');
            if (node) {
                domConstruct.place(html, node, "last");
            }
        },
        // zoom to location: zooms map to location point
        zoomToLocation: function(x, y) {
            var _self = this;
            var lod = 16;
            // set point
            var pt = webMercatorUtils.geographicToWebMercator(new Point(x, y));
            // zoom and center
            _self.map.centerAndZoom(pt, lod);
        },
        // geolocation error
        geoLocateMapError: function(error) {
            this.alertDialog(error.toString());
        },
        // geolocate function: sets map location to users location
        geoLocateMap: function(position) {
            var _self = this;
            if (position) {
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;
                var IPAccuracy = position.coords.accuracy;
                _self.zoomToLocation(longitude, latitude, IPAccuracy);
            }
        },
        // configure places
        placesOnClick: function() {
            var _self = this;
            // places click
            var placesList = dom.byId("placesList");
            if (placesList) {
                on(placesList, ".placesClick:click, .placesClick:keyup", function(event) {
                    if (event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13)) {
                        var objIndex = query(this).attr('data-index');
                        if (objIndex !== -1) {
                            // create extent
                            var newExtent = new Extent(_self.itemInfo.itemData.bookmarks[objIndex].extent);
                            // set extent
                            _self.map.setExtent(newExtent);
                            _self.hideAllMenus();
                        }
                    }
                });
            }
            // places click
            var placesButton = dom.byId("placesButton");
            if (placesButton) {
                on(placesButton, "click, keyup", function(event) {
                    if (event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13)) {
                        _self.toggleMenus('places');
                    }
                });
            }
        },
        // configure places
        configurePlaces: function() {
            var _self = this;
            // if places
            if (_self.options.showPlaces) {
                if (_self.itemInfo.itemData.bookmarks && _self.itemInfo.itemData.bookmarks.length > 0) {
                    // insert places button
                    var node = dom.byId('placesCon');
                    if (node) {
                        node.innerHTML = '<span tabindex="0" id="placesButton" class="barButton" data-menu="places" title="' + i18n.viewer.places.placesTitle + '"><span class="barIcon placesMenuIcon"></span>' + i18n.viewer.places.places + '</span>';
                    }
                    // create list
                    node = dom.byId('placesMenu');
                    if (node) {
                        node.innerHTML = '<div class="menuClose"><div class="closeButton closeMenu"></div>' + i18n.viewer.places.menuTitle + '<div class="clear"></div></div><ul id="placesList"></ul>';
                    }
                    // if share object
                    for (var i = 0; i < _self.itemInfo.itemData.bookmarks.length; i++) {
                        _self.createPlacesListItem(i);
                    }
                    // set on clicks
                    _self.placesOnClick();
                } else {
                    _self.options.showPlaces = false;
                }
            }
        },
        // clear the locate graphic
        resetLocateLayer: function() {
            var _self = this;
            if (_self.options.locateLayer) {
                _self.options.locateLayer.clear();
            }
            _self.options.locateName = "";
            //_self.setSharing();
        },
        setMarker: function(point, address) {
            var _self = this;
            if (_self.options.pointGraphic) {
                // Create point marker
                var pointGraphic = new PictureMarkerSymbol(_self.options.pointGraphic, 21, 29).setOffset(0, 12);
                var locationGraphic = new Graphic(point, pointGraphic);
                // if locate point layer
                if (_self.options.locateLayer) {
                    _self.options.locateLayer.clear();
                    _self.clearPopupValues();
                    _self.options.customPopup.hide();
                } else {
                    _self.options.locateLayer = new GraphicsLayer();
                    connect.connect(_self.options.locateLayer, "onClick", function(evt) {
                        _self.clearPopupValues();
                        event.stop(evt);
                        var content = "<strong>" + evt.graphic.attributes.address + "</strong>";
                        _self.options.customPopup.setContent(content);
                        _self.options.customPopup.setTitle(i18n.viewer.search.location);
                        _self.options.customPopup.show(evt.graphic.geometry);
                    });
                    _self.map.addLayer(_self.options.locateLayer);
                }
                // graphic
                locationGraphic.setAttributes({
                    "address": address
                });
                _self.options.locateLayer.add(locationGraphic);
                var content = "<strong>" + address + "</strong>";
                _self.options.customPopup.setContent(content);
                _self.options.customPopup.setTitle(i18n.viewer.search.location);
                _self.options.customPopup.show(point);
            }
        },
        // resize map
        resizeMap: function() {
            var _self = this;
            _self.adjustPopupSize(_self.map);
            if (_self.mapTimer) {
                //clear any existing resize timer
                clearTimeout(_self.mapTimer);
            }
            //create new resize timer with delay of 500 milliseconds
            _self.mapTimer = setTimeout(function() {
                if (_self.map) {
                    var barHeight = 0,
                        chartHeight = 0;
                    // menu bar height
                    var menuBar = dom.byId('topMenuBar');
                    if (menuBar) {
                        var menuPos = domGeom.position(menuBar);
                        barHeight = menuPos.h;
                    }
                    // chart height
                    var chartNode = dom.byId('graphBar');
                    if (chartNode) {
                        var chartPos = domGeom.position(chartNode);
                        chartHeight = chartPos.h;
                    }
                    // window height
                    var vs = win.getBox();
                    var windowWidth = vs.w;
                    var windowHeight = vs.h;

                    if (domStyle.get(query('#attributePane')[0], "visibility") == "visible") {
                        windowWidth = vs.w - 400;
                       // windowHeight = vs.h - 300;
                    }

                    if (domStyle.get(query('#editSitePane')[0], "visibility") == "visible") {
                        windowWidth = vs.w - 400;
                        //windowHeight = vs.h - 300;
                    }

                    if (domStyle.get(query('#adminPane')[0], "visibility") == "visible") {
                        windowWidth = vs.w - 400;
                    }

                    var node = dom.byId('map');
                    if (node) {
                        domStyle.set(node, {
                            "width": windowWidth + 'px',
                            "height": windowHeight - barHeight - chartHeight + 'px'
                        });
                    }
                    // resize
                    _self.map.resize();
                    _self.map.reposition();
                    // update location of menus
                    _self.updateLeftMenuOffset('#placesButton', '#placesMenu');
                    _self.updateRightMenuOffset('#layersButton', '#layersMenu');
                    _self.updateRightMenuOffset('#basemapButton', '#basemapMenu');
                    _self.updateRightMenuOffset('#legendButton', '#legendMenu');
                    _self.updateRightMenuOffset('#editButton', '#editMenu');
                    _self.updateRightMenuOffset('#measureButton', '#measureMenu');
                    _self.updateRightMenuOffset('#revisitsButton', '#revisitsMenu');
                    _self.updateRightMenuOffset('#printButton', '#printMenu');
                    //_self.updateRightMenuOffset('attributeButton', '#attributePane');
                }
            }, 500);
        },
        // resize map
        resizeMapOnDemand: function () {
            var _self = this;
                if (_self.map) {
                    var barHeight = 0,
                        chartHeight = 0;
                    // menu bar height
                    var menuBar = dom.byId('topMenuBar');
                    if (menuBar) {
                        var menuPos = domGeom.position(menuBar);
                        barHeight = menuPos.h;
                    }
                    // chart height
                    var chartNode = dom.byId('graphBar');
                    if (chartNode) {
                        var chartPos = domGeom.position(chartNode);
                        chartHeight = chartPos.h;
                    }
                    // window height
                    var vs = win.getBox();
                    var windowWidth = vs.w;
                    var windowHeight = vs.h;

                    if (domStyle.get(query('#attributePane')[0], "visibility") == "visible") {
                        windowWidth = vs.w - 400;
                        //windowHeight = vs.h - 300;
                    }

                    if (domStyle.get(query('#editSitePane')[0], "visibility") == "visible") {
                        windowWidth = vs.w - 400;
                       // windowHeight = vs.h - 300;
                    }

                    if (domStyle.get(query('#adminPane')[0], "visibility") == "visible") {
                        windowWidth = vs.w - 400;
                        // windowHeight = vs.h - 300;
                    }

                    var node = dom.byId('map');
                    if (node) {
                        domStyle.set(node, {
                            "width": windowWidth + 'px',
                            "height": windowHeight - barHeight - chartHeight + 'px'
                        });
                    }
                    // resize
                    _self.map.resize();
                    _self.map.reposition();
                    // update location of menus
                    _self.updateLeftMenuOffset('#placesButton', '#placesMenu');
                    _self.updateRightMenuOffset('#layersButton', '#layersMenu');
                    _self.updateRightMenuOffset('#basemapButton', '#basemapMenu');
                    _self.updateRightMenuOffset('#legendButton', '#legendMenu');
                    _self.updateRightMenuOffset('#editButton', '#editMenu');
                    _self.updateRightMenuOffset('#measureButton', '#measureMenu');
                    _self.updateRightMenuOffset('#revisitsButton', '#revisitsMenu');
                    _self.updateRightMenuOffset('#printButton', '#printMenu');
                    //_self.updateRightMenuOffset('attributeButton', '#attributePane');
                }
        },
        // update position of menu for right side buttons
        updateRightMenuOffset: function(button, menu) {
            var _self = this;
            var buttonObj = query(button)[0];
            var menuObj = query(menu)[0];
            var position;
            if (buttonObj && menuObj) {
                var offset = domGeom.position(buttonObj);
                var vs = win.getBox();
                if (offset) {
                    if (_self.options.isRightToLeft) {
                        position = offset.x;
                        domStyle.set(menuObj, {
                            "left": position + 'px'
                        });
                    } else {
                        position = vs.w - (offset.x + offset.w);
                        domStyle.set(menuObj, {
                            "right": position + 'px'
                        });
                    }
                }
            }
        },
        // update position of menu for left side buttons
        updateLeftMenuOffset: function(button, menu) {
            var _self = this;
            var btn = query(button)[0];
            var mnu = query(menu)[0];
            var vs = win.getBox();
            var leftOffset;
            if (btn && mnu) {
                var offset = domGeom.position(btn);
                if (_self.options.isRightToLeft) {
                    leftOffset = vs.w - (offset.x + offset.w);
                    domStyle.set(mnu, {
                        "right": leftOffset + 'px'
                    });
                } else {
                    leftOffset = offset.x;
                    domStyle.set(mnu, {
                        "left": leftOffset + 'px'
                    });
                }
            }
        },
        hideAboutMap: function() {
            var _self = this;
            if (_self.options.aboutDialog) {
                _self.options.aboutDialog.hide();
                query('#aboutMap').removeClass('barSelected');
            }
        },
        // Toggle show/hide about map info
        toggleAboutMap: function(obj) {
            var _self = this;
            if (_self.options.aboutDialog) {
                if (!_self.options.aboutDialog.get('open')) {
                    _self.options.aboutDialog.show();
                    query(obj).addClass('barSelected');
                } else {
                    _self.options.aboutDialog.hide();
                    query(obj).removeClass('barSelected');
                }
            }
        },
        hideAttributeMap: function () {
            var _self = this;
            if (_self.options.attributeDialog) {
                _self.options.attributeDialog.hide();
                query('#attributeMap').removeClass('barSelected');
            }
        },
        toggleAttributeMap: function (obj) {
            var _self = this;
            if (_self.options.attributeDialog) {
                if (_self.options.attributeDialogVisible == false) {
                    _self.options.attributeDialog.show();
                    _self.options.attributeDialogVisible = true;
                    /*this.mapZoomEvent = _self.map.on("zoom", function () {
                        console.log("zoom");
                        dojo.publish("/foo/bar", [1]);
                    });*/
                    //this.mapPanEvent = _self.map.on("pan", function () {
                     //   console.log("pan");
                    //    dojo.publish("/foo/bar", [1]);
                    //});
                    query(obj).addClass('barSelected');
                } else {
                    //this.mapZoomEvent.remove();
                    //this.mapPanEvent.remove();
                    _self.options.attributeDialog.hide();
                    _self.options.attributeDialogVisible = false;
                    query(obj).removeClass('barSelected');
                }
            }
        },
        hideEdit: function () {
            var _self = this;
            if (_self.options.editDialog) {
                //_self.options.editDialog.hide();
                query('#editMap').removeClass('barSelected');
            }
        },
        toggleEdit: function (obj) {
            var _self = this;
            if (_self.options.editDialog) {
                if (!_self.options.editDialog.get('open')) {
                    _self.options.editDialog.show();
                    query(obj).addClass('barSelected');
                } else {
                    _self.options.editDialog.hide();
                    query(obj).removeClass('barSelected');
                }
            }
        },
        hidePrint: function () {
            var _self = this;
            if (_self.options.printDialog) {
                _self.options.printDialog.hide();
                query('#printMap').removeClass('barSelected');
            }
        },
        togglePrint: function (obj) {
            var _self = this;
            if (_self.options.printDialog) {
                if (!_self.options.printDialog.get('open')) {
                    _self.options.printDialog.show();
                    query(obj).addClass('barSelected');
                } else {
                    _self.options.printDialog.hide();
                    query(obj).removeClass('barSelected');
                }
            }
        },
        // Canvas detection
        isCanvasSupported: function() {
            var dc = document.createElement('canvas');
            if (!dc.getContext) {
                return 0;
            }
            var c = dc.getContext('2d');
            return typeof c.fillText === 'function' ? 2 : 1;
        },
        
        // right side menu buttons
        rightSideMenuButtons: function() {
            var _self = this;
            var html = '';
            var node;

            html += '<button tabindex="0" id="helpButton" data-menu="help" class="btn btn-default" style="margin-left:2px;margin-top:5px;" title="Help">Help</button>';
            html += '<button tabindex="0" id="userButton" data-menu="user" class="btn btn-default" style="margin-left:2px;margin-top:5px;" title="Logout">Logout</button>';

            //html += '<a href="../Logout.aspx"><span tabindex="0" id="logoutButton" data-menu="social" class="barButton" title="Logout">Logout</span></a>';
            node = dom.byId('menuList');
            if (node) {
                node.innerHTML = html;
            }

            // Comment TOGGLE
            var helpButton = dom.byId("helpButton");
            if (helpButton) {
                on(helpButton, "click, keyup", function (event) {
                    if (event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13)) {
                        _self.toggleMenus('help');
                    }
                });
            }

            // Comment TOGGLE
            var userButton = dom.byId("userButton");
            if (userButton) {
                on(userButton, "click, keyup", function (event) {
                    if (event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13)) {
                        window.location = "../../Logout.aspx";
                    }
                });
            }
            
            // Show Menu Bar
            query('#topMenuBar').style('display', 'block');
        },
        removeSpotlight: function() {
            query('.spotlight').removeClass('spotlight-active');
        },
        // show search
        configureSearchBox: function() {
            var _self = this;
            if (_self.options.showSearchBox) {
                var html = '<div id="spotlight" class="spotlight"><\/div>';
                domConstruct.place(html, dom.byId('map_container'), 'last');
                _self._geocoder = new Geocoder({
                    arcgisGeocoder: {placeholder: '1321 Pendleton Street'},
                    map: _self.map,
                    autoComplete: true
                }, dom.byId("geocoderSearch"));
                // on select test
                connect.connect(_self._geocoder, 'onSelect', function(result) {
                    var spotlight = connect.connect(_self.map, 'onExtentChange', function() {
                        var geom = screenUtils.toScreenGeometry(_self.map.extent, _self.map.width, _self.map.height, result.extent);
                        var width = geom.xmax - geom.xmin;
                        var height = geom.ymin - geom.ymax;
                        var max = height;
                        if (width > height) {
                            max = width;
                        }
                        var margin = '-' + Math.floor(max / 2) + 'px 0 0 -' + Math.floor(max / 2) + 'px';
                        var pt = result.feature.geometry;
                        _self.setMarker(pt, result.name);
                        query('.spotlight').addClass('spotlight-active').style({
                            width: max + 'px',
                            height: max + 'px',
                            margin: margin
                        });
                        //_self.setSharing();
                        connect.disconnect(spotlight);
                    });
                });
                connect.connect(_self._geocoder, 'onFindResults', function(response) {
                    if (!response.results.length) {
                        _self.alertDialog(i18n.viewer.errors.noLocation);
                        _self.resetLocateLayer();
                    }
                });
                _self._geocoder.startup();
                // on clear test
                connect.connect(_self._geocoder, 'onClear', function() {
                    _self.removeSpotlight();
                    _self.resetLocateLayer();
                    _self.clearPopupValues();
                    _self.map.infoWindow.hide();
                });
                if (_self.options.locateName) {
                    _self._search.set('value', _self.options.locateName);
                }
            }
        },
        // show about button if url is set
        configureAboutText: function() {
            var _self = this;
            if (_self.itemInfo.item.description && _self.options.showAboutDialog) {
                // insert html
                var node = dom.byId('aboutMapCon');
                if (node) {
                    node.innerHTML = '<span tabindex="0" class="barButton" id="aboutMap" title="' + i18n.viewer.buttons.aboutTitle + '"><span class="barIcon aboutInfo"></span>' + i18n.viewer.buttons.about + '</span>';
                }
                node = dom.byId('aboutDialog');
                var html = '';
                html += '<div class="padContainer">';
                html += '<h2 tabindex="0">' + _self.itemInfo.item.title + '</h2>';
                html += '<div class="desc">' + _self.itemInfo.item.description + '</div>';
                html += '<div class="clear"></div>';
                // see if not just empty HTML tags
                if (_self.itemInfo.item.licenseInfo) {
                    var result = _self.itemInfo.item.licenseInfo.replace(/(<([^>]+)>)/ig, "");
                    if (_self.itemInfo.item.licenseInfo && result) {
                        html += '<h3>' + i18n.viewer.about.access + '</h3>';
                        html += '<div class="license">' + _self.itemInfo.item.licenseInfo + '</div>';
                    }
                }
                html += '</div>';
                if (node) {
                    node.innerHTML = html;
                }
                var aboutMap = dom.byId("aboutMap");
                if (aboutMap) {
                    on(aboutMap, "click, keyup", function(event) {
                        if (event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13)) {
                            this.blur();
                            _self.hideAllMenus();
                            _self.toggleAboutMap(this);
                        }
                    });
                }
                var props = {
                    //style: "width:550px;",
                    style: "width:52%; max-width:725px; min-width:400px;",
                    draggable: true,
                    modal: false,
                    showTitle: true,
                    title: i18n.viewer.about.title
                };
                _self.options.aboutDialog = new Dialog(props, dom.byId('aboutDialog'));
                node = query('#aboutDialog .dijitDialogTitle')[0];
                if (node) {
                    node.innerHTML = '<span class="inlineIcon aboutInfo"></span>' + i18n.viewer.about.title;
                }
                if (_self.options.showAboutDialogOnLoad) {
                    _self.options.aboutDialog.show();
                }
                connect.connect(_self.options.aboutDialog, 'onHide', function() {
                    var buttons = query('#mapcon .barButton');
                    if (buttons && buttons.length > 0) {
                        buttons.removeClass('barSelected');
                        for (var i = 0; i < buttons.length; i++) {
                            buttons[i].blur();
                        }
                    }
                });
            }
        },

        configureVersionNum: function () {

            html = "<div class='version'>" + this.options.version + "</div>";

            var node = query('#mapcon')[0];
            if (node) {
                domConstruct.place(html, node, "last");
            }
        },

        configureExport: function () {
            var _self = this;
            var node = dom.byId('exportMenu');
            if (node) {
                node.innerHTML = '<div class="menuClose"><div class="closeButton closeMenu"></div><span style="color: #666666;">Export Data</span><div class="clear"></div></div><div class="exportCon"><div class="slideScroll"><div id="exportContent"></div></div></div>';
            }

            console.log("A", _self.options.analysisToken);
            console.log("Working", _self.options.working);

            this.options.exportDataWidget = new DataExport({
                map: _self.map,
                exportLayers: _self.options.exportLayers,
                layers: _self.itemInfo.itemData.operationalLayers,
                token: _self.options.token,
                analysisGpToken: _self.options.analysisToken,
                analysisGpServerUrl: _self.options.analysisGpServer
            });

            console.log("B");

            dojo.place(this.options.exportDataWidget.domNode, dom.byId('exportContent'));

            this.options.exportDataWidget.startup();

            console.log("C");
        },

        configureHelp: function() {
            var node = dom.byId('helpMenu');
            if (node) {
                node.innerHTML = '<div class="menuClose"><div class="closeButton closeMenu"></div><div class="clear"></div></div><div class="helpMenuCon"><div class="slideScroll"><div id="helpContent"></div></div></div>';
            }

            var browser = this.get_browser();
            var ver = this.get_browser_version();
            var parts = ver.split(".");
            ver = Number(parts[0]);
            var mp4 = false;
            var webm = false;

            if (browser.toLowerCase().indexOf("chrome") > -1 ||
                browser.toLowerCase().indexOf("msie") > -1 ||
                browser.toLowerCase().indexOf("safari") > -1 ||
                browser.toLowerCase().indexOf("opera") > -1 || 
                browser.toLowerCase().indexOf("firefox") > -1) {

                var divHtml = "<div class='videoDialog hideItem'><div class='videoPane'><div><span id='videoTitle'></span><div id='videoClose'></div></div><br /><video id='videoSource' src='' class='videoPlayer' controls>";
                divHtml += "</video></div></div>";

                var node = query('#mapcon')[0];
                if (node) {
                    domConstruct.place(divHtml, node, "last");
                }
                
                
            }

            if (browser.toLowerCase().indexOf("chrome") > -1 ||
                browser.toLowerCase().indexOf("msie") > -1 ||
                browser.toLowerCase().indexOf("safari") > -1) {
                mp4 = true;
            }
            else if (
                browser.toLowerCase().indexOf("opera") > -1 ||
                browser.toLowerCase().indexOf("firefox") > -1) {
                webm = true;
            }


            var html = "";
            html += "<span>Below are links to videos that will explain how the application works.</span>";
            html += "<ul>"; 
        
            for (var i=0; i < this.options.videos.length; i++)
            {
                if (mp4 && this.options.videos[i].type == "MP4") {
                    html += "<li><span class='videoItem' data-video='" + this.options.videos[i].filename + "' data-desc='" + this.options.videos[i].desc +
                        "'>" + this.options.videos[i].desc + "</span></li>";
                }
                else if (webm && this.options.videos[i].type == "WEBM") {
                    html += "<li><span class='videoItem' data-video='" + this.options.videos[i].filename + "' data-desc='" + this.options.videos[i].desc +
                        "'>" + this.options.videos[i].desc + "</span></li>";
                }
                else if (!mp4 && !webm) {
                    html += "<li><a data-video='" + this.options.videos[i].filename + "' data-desc='" + this.options.videos[i].desc +
                    "' href='../video/" + this.options.videos[i].filename + "'>" + this.options.videos[i].desc + "</a></li>";
                }
            }

            html += "</ul>";

            var node = dom.byId("helpContent");
            if (node) {
                node.innerHTML = html;
            }

            console.log("MP4", mp4);
            console.log("WEBM", webm);

            if (mp4 || webm) {
                var hc = dojo.byId("helpContent");
                console.log("HC", hc);
                if (hc) {
                    //console.log(node);
                    on(hc, ".videoItem:click", function (event) {
                        var video = dojo.attr(this, 'data-video');
                        var desc = dojo.attr(this, 'data-desc');
                        console.log("VIDEO", video);

                        var vp = document.getElementById('videoSource');
                        vp.setAttribute("src", video);
                        //dojo.attr(dojo.byId("videoSource"), "src", "videso/" + video);
                        dojo.byId("videoTitle").innerHTML = desc;
                        //console.log(dojo.attr(dojo.byId("videoSource"), "src"));
                        //dojo.byId("videoSource").load();
                        vp.load();
                        query(".videoDialog").removeClass("hideItem");
                        console.log("videoloaded");
                    });
                }
                
                var vc = dojo.byId("videoClose");
                if (vc) {
                    on(vc, "click", function () {
                        query(".videoDialog").addClass("hideItem");
                    });
                }
            }

            console.log("BROWSER", this.get_browser());
            console.log("BROWSERVERSIN", this.get_browser_version());
        },

        get_browser: function(){
    var N=navigator.appName, ua=navigator.userAgent, tem;
    var M=ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
    if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
    M=M? [M[1], M[2]]: [N, navigator.appVersion, '-?'];
    return M[0];
},
get_browser_version: function(){
    var N=navigator.appName, ua=navigator.userAgent, tem;
    var M=ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
    if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
    M=M? [M[1], M[2]]: [N, navigator.appVersion, '-?'];
    return M[1];
},

        configureUser: function() {
            var node = dom.byId('userMenu');
            if (node) {
                node.innerHTML = '<div class="menuClose"><div class="closeButton closeMenu"></div><div class="clear"></div></div><div class="userMenuCon"><div class="slideScroll"><div id="userContent"></div></div></div>';
            }

            var html = "";
            html += "<div id='logoutLink'><a href='../../Logout.aspx'>Logout</a></div>";

            var node = dom.byId("userContent");
            if (node) {
                node.innerHTML = html;
            }
        },
        // show about button if url is set
        configureMeasurementWindow: function () {
            var _self = this;

            if (_self.options.showMeasureDialog) {
                // insert html
                var node = dom.byId('measureMenu');
                if (node) {
                    node.innerHTML = '<div class="menuClose"><div class="closeButton closeMenu"></div>' + i18n.viewer.measure.menuTitle + '<div class="clear"></div></div><div class="measureMenuCon"><div class="slideScrollBottom"><div id="measureContent"></div></div></div>';
                }

               /*_self.options.measureTool = new Measurement({
                    map: _self.map,
                    id: 'measureTool',
                    style: "width:250px;height:150px"
                }, 'measureContent');

                _self.options.measureTool.startup();
                */

                _self.options.drawMeasure = new DrawMeasure({
                    map: _self.map,
                    geometryServiceUrl: templateConfig.helperServices.geometry.url,
                    style: "width:280px;height:150px"
                }, 'measureContent');

                _self.options.drawMeasure.startup();

                

               
            }            
        },
        // show about button if url is set
        configureAttributePane: function () {
            var _self = this;

            if (_self.options.showAttributePane) {
                // insert html
                var node = dom.byId('attributePane');
                if (node) {

                    node.innerHTML = '<div class="menuClose"><div class="closeButton closeMenu"></div>' + i18n.viewer.attribute.menuTitle + '<div class="clear"></div></div><div class="slideScroll"><div id="attributeContent"></div></div>';
                }

                this.options.attributeTableWidget = new AttrTable({
                    map: _self.map,
                    searchLayers: _self.options.searchLayers,
                    layers: _self.itemInfo.itemData.operationalLayers,
                    geometryServiceUrl: templateConfig.helperServices.geometry.url,
                    domainList: _self.options.domains,
                    archSiteLayerTitle: _self.options.archsitename,
                    searchTitle: _self.options.attrSearchTitle
                });

                dojo.place(this.options.attributeTableWidget.domNode, dom.byId('attributeContent'));

                this.options.attributeTableWidget.startup();

            }
        },
        configureEditSitePane: function () {
            var _self = this;

            if (_self.options.showEditSitePane) {
                // insert html
                var node = dom.byId('editSitePane');
                if (node) {
                    node.innerHTML = '<div class="menuClose"><div class="closeButton closeMenu"></div>' + i18n.viewer.edit.menuTitle + '<div class="clear"></div></div><div class="slideScroll"><div id="editSiteContent"></div></div>';
                }

                var asLayerUrl = "";
                //Insert widget title here
                for (var i = 0; i < _self.itemInfo.itemData.operationalLayers.length; i++) {
                    if (_self.itemInfo.itemData.operationalLayers[i].layerObject != null) {
                        if (_self.itemInfo.itemData.operationalLayers[i].layerObject.type == "Feature Layer") {
                            if (_self.options.archsitename == _self.itemInfo.itemData.operationalLayers[i].title) {
                                asLayerUrl = _self.itemInfo.itemData.operationalLayers[i].layerObject.url;
                                break;
                            }
                        }
                    }
                }

                //_self.options.editDijit = new AdminView({map: _self.map});

                _self.options.editDijit = new EditSite({
                    map: _self.map,
                    name: "Arch Site",
                    userid: _self.options.userid,
                    role: _self.options.role,
                    token: _self.options.token,
                    itemData: _self.itemInfo.itemData,
                    displayname: _self.options.displayname,
                    affiliation: _self.options.affiliation,
                    draftFeatureLayerUrl: _self.options.draftFeatureLayer,
                    draftDataRecovTableUrl: _self.options.draftDataRecovTable,
                    draftDocumentsTableUrl: _self.options.draftDocumentsTable,
                    draftTestingUnitsTableUrl: _self.options.draftTestingUnitsTable,
                    draftExcavationUnitsTableUrl: _self.options.draftExcavationUnitsTable,
                    draftCountyCodesTableUrl: _self.options.draftCountyCodesTable,
                    queryUtmUrl: _self.options.queryUtmLayer,
                    queryCountyUrl: _self.options.queryCountyLayer,
                    queryPhyRegUrl: _self.options.queryPhyRegLayer,
                    queryQuadUrl: _self.options.queryQuadLayer,
                    querySoilsUrl: _self.options.querySoilsLayer,
                    archsiteLayerUrl: asLayerUrl,
                    geometryServiceUrl: templateConfig.helperServices.geometry.url,
                    proxyUrl: _self.options.proxyUrl
                });

                dojo.place(_self.options.editDijit.domNode, dom.byId('editSiteContent'));

                _self.options.editDijit.startup();
                
            }
            
        },

        configureAdminPane: function () {
            var _self = this;

            if (_self.options.showAdminPane) {
                // insert html
                var node = dom.byId('adminPane');
                if (node) {
                    node.innerHTML = '<div class="menuClose"><div class="closeButton closeMenu"></div>' + i18n.viewer.admin.menuTitle + '<div class="clear"></div></div><div class="slideScroll"><div id="adminContent"></div></div>';
                }

                var asLayerUrl = "";
                //Insert widget title here
                for (var i = 0; i < _self.itemInfo.itemData.operationalLayers.length; i++) {
                    if (_self.itemInfo.itemData.operationalLayers[i].layerObject != null) {
                        if (_self.itemInfo.itemData.operationalLayers[i].layerObject.type == "Feature Layer") {
                            if (_self.options.archsitename == _self.itemInfo.itemData.operationalLayers[i].title) {
                                asLayerUrl = _self.itemInfo.itemData.operationalLayers[i].layerObject.url;
                                break;
                            }
                        }
                    }
                }

                //_self.options.editDijit = new AdminView({map: _self.map});

                _self.options.adminDijit = new AdminView({
                    map: _self.map,
                    name: "Arch Site",
                    userid: _self.options.userid,
                    role: _self.options.role,
                    token: _self.options.token,
                    itemData: _self.itemInfo.itemData,
                    displayname: _self.options.displayname,
                    affiliation: _self.options.affiliation,
                    draftFeatureLayerUrl: _self.options.draftFeatureLayer,
                    draftDataRecovTableUrl: _self.options.draftDataRecovTable,
                    draftDocumentsTableUrl: _self.options.draftDocumentsTable,
                    draftTestingUnitsTableUrl: _self.options.draftTestingUnitsTable,
                    draftExcavationUnitsTableUrl: _self.options.draftExcavationUnitsTable,
                    draftCountyCodesTableUrl: _self.options.draftCountyCodesTable,
                    queryUtmUrl: _self.options.queryUtmLayer,
                    queryCountyUrl: _self.options.queryCountyLayer,
                    queryPhyRegUrl: _self.options.queryPhyRegLayer,
                    queryQuadUrl: _self.options.queryQuadLayer,
                    querySoilsUrl: _self.options.querySoilsLayer,
                    archsiteLayerUrl: asLayerUrl,
                    geometryServiceUrl: templateConfig.helperServices.geometry.url,
                    proxyUrl: _self.options.proxyUrl
                });

                dojo.place(_self.options.adminDijit.domNode, dom.byId('adminContent'));

                _self.options.adminDijit.startup();

            }

        },
            
        // show about button if url is set
        configurePrintWindow: function () {
            var _self = this;

            if (_self.options.showPrintDialog) {
                // insert html
                var node = dom.byId('printMenu');
                if (node) {
                    node.innerHTML = '<div class="menuClose"><div class="closeButton closeMenu"></div>' + i18n.viewer.buttons.printTitle + '<div class="clear"></div></div><div class="printMenuCon"><div class="slideScroll2"><div id="printContent"></div></div></div>';
                }

                ////Insert widget title here
                //var layoutTemplate, templateNames, mapOnlyIndex, templates;

                //var layouts = [{
                //    name: "Letter ANSI A Landscape",
                //    label: "Landscape (PDF)",
                //    format: "pdf",
                //    options: {
                //        legendLayers: [], // empty array means no legend
                //        scalebarUnit: "Miles",
                //        titleText: "Archsite, Landscape PDF"
                //    }
                //}, {
                //    name: "Letter ANSI A Portrait",
                //    label: "Portrait (Image)",
                //    format: "jpg",
                //    options: {
                //        legendLayers: [],
                //        scaleBarUnit: "Miles",
                //        titleText: "Archsite, Portrait JPG"
                //    }
                //}];

                //// create the print templates
                //var templates = array.map(layouts, function (lo) {
                //    var t = new PrintTemplate();
                //    t.layout = lo.name;
                //    t.label = lo.label;
                //    t.format = lo.format;
                //    t.layoutOptions = lo.options;
                //    return t;
                //});

                _self.options.printerWidget = new PrintWidget({
                    map: _self.map,
                    url: templateConfig.helperServices.printTask.url
                }, dom.byId("printContent"));

                //_self.options.printerWidget = new Print({
                //    map: _self.map,
                //    templates: templates,
                //    url: templateConfig.helperServices.printTask.url
                //}, dom.byId("printContent"));

                _self.options.printerWidget.startup();

            }
      
        },
        createScaleSelector: function () {
            var _self = this;
            _self.options.scaleWidget = new ScaleSelector({
                map: _self.map,
                scales: [
                    { name: "1:2,311,162", id: "2311162" },
                    { name: "1:1,155,581", id: "1155581" },
                    { name: "1:577,791", id: "577791" },
                    { name: "1:288,895", id: "288895" },
                    { name: "1:144,448", id: "144448" },
                    { name: "1:72,224", id: "72224" },
                    { name: "1:36,112", id: "36112" },
                    { name: "1:24,000", id: "24000" },
                    { name: "1:18,056", id: "18056" },
                    { name: "1:9,028", id: "9028" },
                    { name: "1:4,514", id: "4514" },
                    { name: "1:2,257", id: "2257" },
                    { name: "1:1,128", id: "1128" }
                ]
            }, dom.byId("scaleSelector"));

            _self.options.scaleWidget.startup();
        },

        createNavPanel: function () {

            var _self = this;

            var browser = this.get_browser();
            var ver = this.get_browser_version();
            var parts = ver.split(".");
            ver = Number(parts[0]);

            if ((browser.indexOf("msie") > 1 && ver > 8) || browser.indexOf("msie") == -1) {
                var geoLocate = new LocateButton({
                    map: _self.map
                }, "locateButton");
                geoLocate.startup();
            }

            var home = new HomeButton({
                map: _self.map
            }, "homeButton");
            home.startup();

            var html = "";
            html += "<div id='basemapButton' data-menu='basemap' class='NavButton BasemapButton' title='Basemaps'></div>";
            html += "<div id='legendButton' data-menu='legend' class='NavButton LegendButton' title='Map Legend'></div>";
            html += "<div id='layersButton' data-menu='layers' class='NavButton LayersButton' title='Map Layers'></div>";
            html += "<div id='measureButton' data-menu='measure' class='NavButton MeasureButton' title='Measure'></div>";
            html += "<div id='printButton' data-menu='print' class='NavButton PrintButton' title='Print'></div>";
            html += "<div id='editButton' data-menu='edit' class='NavButton EditButton' title='Create/Edit a Site'></div>";
            html += "<div id='findButton' data-menu='find' class='NavButton FindButton' title='Find Features'></div>";
            html += "<div id='exportButton' data-menu='export' class='NavButton ExportButton' title='Data Export'></div>";

            if (_self.options.role === "admin") {
                html += "<div id='adminButton' data-menu='admin' class='NavButton ApproveButton' title='Approve Sites'></div>";
            }

            var node = dom.byId("navPanel");
            if (node) {
                node.innerHTML = html;
            }

            node = dom.byId('basemapMenu');
            if (node) {
                node.innerHTML = '<div class="menuClose"><div class="closeButton closeMenu"></div>' + i18n.viewer.basemap.menuTitle + '<div class="clear"></div></div><div class="bmMenuCon"><div class="slideScrollBottom"><div id="baseContainer"></div></div></div>';
            }

            var basemapButton = dom.byId("basemapButton");
            if (basemapButton) {
                on(basemapButton, "click", function (event) {
                    if (event.type === 'click') {
                        _self.toggleNavMenus('basemap');
                    }
                });
            }

            var legendButton = dom.byId("legendButton");
            if (legendButton) {
                on(legendButton, "click", function (event) {
                    if (event.type === 'click') {
                        _self.toggleNavMenus('legend');
                    }
                });
            }

            var layersButton = dom.byId("layersButton");
            if (layersButton) {
                on(layersButton, "click", function (event) {
                    if (event.type === 'click') {
                        _self.toggleNavMenus('layers');
                    }
                });
            }

           var measureButton = dom.byId("measureButton");
            if (measureButton) {
                on(measureButton, "click", function (event) {
                    if (event.type === 'click') {
                        //_self.options.measureTool.clearResult();
                        //_self.options.measureTool.setTool("area", false);
                        //_self.options.measureTool.setTool("distance", false);
                        //_self.options.measureTool.setTool("location", false);
                        _self.toggleNavMenus('measure');
                    }
                });
            }

            var printButton = dom.byId("printButton");
            if (printButton) {
                on(printButton, "click", function (event) {
                    if (event.type === 'click') {
                        _self.toggleNavMenus('print');
                    }
                });
            }

            var editButton = dom.byId("editButton");
            if (editButton) {
                on(editButton, "click", function (event) {
                    if (event.type === 'click') {
                        _self.toggleEditSiteMenu('edit');
                    }
                });
            }

            if (_self.options.role === "admin") {
                var adminButton = dom.byId("adminButton");
                if (adminButton) {
                    on(adminButton, "click", function (event) {
                        if (event.type === 'click') {
                            _self.toggleAdminMenu('admin');
                        }
                    });
                }
            }

            var findButton = dom.byId("findButton");
            if (findButton) {
                on(findButton, "click", function (event) {
                    if (event.type === 'click') {
                        _self.toggleAttributeMenu('find');
                    }
                });
            }

            var exportButton = dom.byId("exportButton");
            if (exportButton) {
                on(exportButton, "click", function (event) {
                    if (event.type === 'click') {
                        _self.toggleNavMenus('export');
                    }
                });
            }

        },
        // application title
        configureAppTitle: function() {
            var _self = this;
            document.title = "ArchSite Map Viewer";
            var node = dom.byId('mapTitle');
            if (node) {
                node.innerHTML = "<a href='" + _self.options.mainUrl + "'><span class='archTitle1'>Arch</span><span class='archTitle2'>Site</span></a>";
                query(node).attr('title', "ArchSite Map Viewer");
            }



            query('meta[name="Description"]').attr('content', _self.itemInfo.item.snippet);
            query('meta[property="og:image"]').attr('content', arcgisUtils.arcgisUrl + '/' + _self.itemInfo.item.id + '/info/' + _self.itemInfo.item.thumbnail);
        },
        // Hide dropdown menu
        hideMenu: function(menuObj) {
            if (menuObj) {
                coreFx.wipeOut({
                    node: menuObj,
                    duration: 200
                }).play();
                query('#mapcon .menuSelected').removeClass('menuSelected');
                var buttons = query('#mapcon .barButton');
                for (var i = 0; i < buttons.length; i++) {
                    buttons[i].blur();
                }
            }
        },
        // Hide dropdown menu
        hideNavMenu: function (menuObj) {
            if (menuObj) {
                coreFx.wipeOut({
                    node: menuObj,
                    duration: 200
                }).play();
                query('#mapcon .navMenuSelected').removeClass('navMenuSelected');
                //var buttons = query('#navPanel .NavButton');
                //for (var i = 0; i < buttons.length; i++) {
                //    buttons[i].blur();
                //}
            }
        },
        // Hide layer info boxes
        hideLayerInfo: function() {
            query('.listMenu ul li .infoHidden').style('display', 'none');
            query('.listMenu ul li').removeClass('active');
        },
        // toggle menu object
        toggleMenus: function(menu) {
            var _self = this;
            if (menu) {
                // get nodes
                var menuQuery = query('#dataMenuCon [data-menu="' + menu + '"]')[0];
                var buttonQuery = query('#topMenuCon [data-menu="' + menu + '"]')[0];
                // remove selected buttons
                query('#topMenuCon .barButton').removeClass('barSelected');
                if (menuQuery) {
                    if (domClass.contains(menuQuery, "menuSelected")) {
                        _self.hideMenu(menuQuery);
                    } else {
                        _self.hideAllMenus();
                        _self.showMenu(menuQuery, buttonQuery);
                    }
                }
                _self.hideLayerInfo();
            } else {
                _self.hideAllMenus();
            }
        },
        // toggle menu object
        toggleNavMenus: function (menu) {
            var _self = this;
            if (menu) {
                // get nodes
                var menuQuery = query('#dataMenuCon [data-menu="' + menu + '"]')[0];
                var buttonQuery = query('#navPanel [data-menu="' + menu + '"]')[0];
                query('#navPanel .NavButton').removeClass('navButtonSelected');
                if (menuQuery) {
                    if (domClass.contains(menuQuery, "navMenuSelected")) {
                        _self.hideNavMenu(menuQuery);
                    } else {
                        _self.hideAllNavMenus();
                        _self.showNavMenu(menuQuery, buttonQuery);
                    }
                }
                _self.hideLayerInfo();
            } else {
                _self.hideAllNavMenus();
            }
        },
        // toggle menu object
        toggleAdminMenu: function (menu) {
            var _self = this;
            if (menu) {
                // get nodes
                var menuQuery = query('#attributePane')[0];
                var adminQuery = query('#adminPane')[0];
                var editQuery = query('#editSitePane')[0];

                var buttonQuery = query('#navPanel [data-menu="' + menu + '"]')[0];
                query('#navPanel .NavButton').removeClass('navButtonSelected');
                if (adminQuery) {
                    if (domStyle.get(adminQuery, "visibility") == "visible") {

                        _self.options.adminDijit.onHideWidget();
                        domStyle.set(adminQuery, "visibility", "hidden");
                        _self.resizeMapOnDemand();

                    } else {
                        this.options.editDijit.onHideWidget();
                        this.options.attributeTableWidget.onHideWidget();

                        if (buttonQuery) {
                            query(buttonQuery).addClass('navButtonSelected');
                        }

                        domStyle.set(menuQuery, "visibility", "hidden");
                        domStyle.set(editQuery, "visibility", "hidden");
                        domStyle.set(adminQuery, "visibility", "visible");

                        _self.options.adminDijit.onShowWidget();
                        _self.resizeMapOnDemand();
                    }
                }
                //_self.hideLayerInfo();
            } else {
                _self.hideAllMenus();
            }
        },
        // toggle menu object
        toggleAttributeMenu: function (menu) {
            var _self = this;
            if (menu) {
                // get nodes
                var menuQuery = query('#attributePane')[0];
                var adminQuery = query('#adminPane')[0];
                var editQuery = query('#editSitePane')[0];
                var buttonQuery = query('#navPanel [data-menu="' + menu + '"]')[0];
                query('#navPanel .NavButton').removeClass('navButtonSelected');
                if (menuQuery) {
                    if (domStyle.get(menuQuery, "visibility") == "visible") {
                        this.options.attributeTableWidget.onHideWidget();

                        domStyle.set(menuQuery, "visibility", "hidden");
                        _self.resizeMapOnDemand();
                       
                    } else {
                        this.options.editDijit.onHideWidget();
                        if (_self.options.role === "admin") {
                            this.options.adminDijit.onHideWidget();
                        }

                        if (buttonQuery) {
                            query(buttonQuery).addClass('navButtonSelected');
                        }

                        domStyle.set(adminQuery, "visibility", "hidden");
                        domStyle.set(editQuery, "visibility", "hidden");
                        domStyle.set(menuQuery, "visibility", "visible");
                        
                        this.options.attributeTableWidget.onShowWidget();
                        _self.resizeMapOnDemand();
                    }
                }
                //_self.hideLayerInfo();
            } else {
                _self.hideAllMenus();
            }
        },
        // toggle menu object
        toggleEditSiteMenu: function (menu) {
            var _self = this;
            if (menu) {
                // get nodes
                var menuQuery = query('#editSitePane')[0];
                var adminQuery = query('#adminPane')[0];
                var attrQuery = query('#attributePane')[0];
                var buttonQuery = query('#navPanel [data-menu="' + menu + '"]')[0];
                query('#navPanel .NavButton').removeClass('navButtonSelected');
                if (menuQuery) {
                    if (domStyle.get(menuQuery, "visibility") == "visible") {
                        this.options.editDijit.onHideWidget();
                        domStyle.set(menuQuery, "visibility", "hidden");
                        _self.resizeMapOnDemand();

                    } else {
                        if (buttonQuery) {
                            query(buttonQuery).addClass('navButtonSelected');
                        }
                        if (_self.options.role === "admin") {
                            this.options.adminDijit.onHideWidget();
                        }
                        this.options.attributeTableWidget.onHideWidget();

                        domStyle.set(adminQuery, "visibility", "hidden");
                        domStyle.set(attrQuery, "visibility", "hidden");

                        this.options.editDijit.onShowWidget();
                        domStyle.set(menuQuery, "visibility", "visible");
                        _self.resizeMapOnDemand();
                    }
                }
                //_self.hideLayerInfo();
            } else {
                _self.hideAllMenus();
            }
        },
        // add menus to dom
        addSlideMenus: function() {
            var html = '';
            html += '<div id="dataMenuCon">';
            html += '<div data-menu="autocomplete" id="autoComplete" class="slideMenu"></div>';
            html += '<div data-menu="places" id="placesMenu" class="slideMenu listMenu"></div>';
            html += '<div data-menu="comment" id="commentMenu" class="slideMenu"></div>';
            html += '<div data-menu="export" id="exportMenu" class="bottomMenu"></div>';
            html += '<div data-menu="help" id="helpMenu" class="slideMenu"></div>';
            html += '<div data-menu="user" id="userMenu" class="slideMenu"></div>';
            //html += '<div data-menu="edit" id="editSitePane" class="slideMenu"></div>';
            //html += '<div data-menu="find" id="attributePane" class="slideMenu"></div>';
            html += '<div data-menu="basemap" id="basemapMenu" class="bottomMenu"></div>';
            html += '<div data-menu="measure" id="measureMenu" class="bottomMenu"></div>';
            html += '<div data-menu="layers" id="layersMenu" class="bottomMenu listMenu"></div>';
            html += '<div data-menu="legend" id="legendMenu" class="bottomMenu"></div>';
            html += '<div data-menu="print" id="printMenu" class="bottomMenu"></div>';
            html += '</div>';
            var node = query('#mapcon')[0];
            if (node) {
                domConstruct.place(html, node, "last");
            }
            query('#mapcon .slideMenu').style('display', 'none');
            query('#mapcon .bottomMenu').style('display', 'none');
        },
        webmapNext: function() {
            var _self = this;
            _self.setStartExtent();
            _self.setStartLevel();
            _self.setStartMarker();
            _self.configureAppTitle();
            _self.configureAboutText();
            _self.configureVersionNum();
                        
            //_self.configurePlaces();
            // once map is loaded
            if (_self.map.loaded) {
                _self.mapIsLoaded();
            } else {
                connect.connect(_self.map, "onLoad", function() {
                    _self.mapIsLoaded();
                });
            }
        },
        // webmap object returned. Create map data
        webmapReturned: function(response) {
            var _self = this;
            // map response
            _self.mapResponse = response;
            // webmap
            _self.map = response.map;
            //console.log(response.itemInfo)
            _self.itemInfo = response.itemInfo;

            console.log("ItemInfo", _self.itemInfo);
            // add secured layers

            //this.logToConsole(_suelf.itemInfo.itemData.operationalLayers);

            //set temporary global variable
            window.globals = { map: _self.map };

            //override built in map click
            _self.map.onClick = null;
            _self.map.on("click", function (evt) {
                //get click point
                var pt = evt.mapPoint;

                //read config file for layers to query on click

                //loop through config and get layers from map

                //query layers for map click
                    //collect the deferred results
                        //on deferred list complete built infoWindow content collection


                var layer = _self.map.getLayer("ArchSites_Prod_5009");
                
                var q = new Query();
                q.geometry = pt;
                q.outFields = ["*"];
                q.returnGeometry = false;
                q.where = "1=1";

                var d = layer.queryFeatures(q);
                d.then(function (results) {
                    var feature = results.features[0];
                    
                    var html = "<h5>" + layer.name + "</h5><hr />";
                    html += "<a target=\"_blank\" href=\"http://www.scarchsite.org/PDFs/" + feature.attributes.SITENUMBER + ".pdf\">Site PDF</a>";
                    for (var i=0,l=results.fields.length;i<l;i++){
                        html += "<div><b>" + results.fields[i].alias + "</b>: " + feature.attributes[results.fields[i].name] + "</div>";
                    }
                    _self.map.infoWindow.setContent(html);
                });

                _self.map.infoWindow.setTitle("Map Features");;
                _self.map.infoWindow.setContent("<h6>Querying...</h6>");
                _self.map.infoWindow.show(pt);
            });

            _self.agolPopupClickHandle = response.clickEventHandle;
            _self.agolPopupclickEventListener = response.clickEventListener;

            topic.subscribe("disablePopups", function () {
                _self.agolPopupClickHandle.remove();
                _self.agolPopupClickHandle = null;
            });

            topic.subscribe("enablePopups", function () {
                _self.agolPopupClickHandle = _self.map.on("onClick", _self.agolPopupclickEventListener);
            });

            if(_self.options.securedLayers && _self.options.securedLayers.length){
                for(var i = 0; i < _self.options.securedLayers.length; i++){
                    var layer = _self.options.securedLayers[i].layerObject;
                    var title = _self.options.securedLayers[i].title;
                    var index = _self.options.securedLayers[i].index;
                    _self.map.addLayer(layer, index);
                    _self.itemInfo.itemData.operationalLayers.splice(index, 0, {
                        id: layer.id,
                        opacity: layer.opacity,
                        visibility: layer.visible,
                        title: title
                    });
                }
            }
            if (_self.options.appid) {
                // get webapp object item info
                _self.getItemData(true).then(function(resp) {
                    if (resp && resp.length) {
                        for (var i in resp) {
                            if (resp.hasOwnProperty(i) && resp[i] === "" || resp[i] === null) {
                                delete resp[i];
                            }
                        }
                        // set other config options from app id
                        _self.itemInfo.item = declare.safeMixin(_self.itemInfo.item, _self._appSettings);
                    }
                    _self.webmapNext();
                });
            } else {
                _self.webmapNext();
            }
        },
        onMapLoad: function() {},
        mapIsLoaded: function() {
            var _self = this;
            // map connect functions
            connect.connect(window, "onresize", function() {
                _self.resizeMap();
            });
            _self.createNavPanel();
            _self.createScaleSelector();
            _self.configureLayers();
            _self.configurePrintWindow();
            _self.configureExport();

            _self.configureMeasurementWindow();

            _self.configureAttributePane();

            _self.configureEditSitePane();

            if (_self.options.role === "admin") {
                _self.configureAdminPane();
            }

            _self.rightSideMenuButtons();

            _self.configureHelp();
            _self.configureUser();
            // create basemap gallery widget
            _self.createBMGallery(_self.map);

 

            // resize map
            _self.resizeMap();
            _self.configureSearchBox();
            setTimeout(function() {
                connect.connect(_self.map, "onExtentChange", function(extent) {
                    _self.removeSpotlight();
                    // hide about panel if open
                    _self.hideAboutMap();
                    // update current extent
                    _self.options.extent = [extent.xmin, extent.ymin, extent.xmax, extent.ymax];
                    // update sharing link
                    //_self.setSharing();
                    // reset refresh timer for social media
                    //_self.resetSocialRefreshTimer();
                });
            }, 4000);
            // map loaded.
            _self.onMapLoad();

            
        },

        setScaleValue: function(val) {
            
        },
        // clear popup content, title and features
        clearPopupValues: function() {
            var _self = this;
            _self.options.customPopup.setContent('');
            _self.options.customPopup.setTitle('');
            _self.options.customPopup.clearFeatures();
        },
        // Info window popup creation
        configurePopup: function() {
            var _self = this;
            // popup dijit configuration
            _self.options.customPopup = new Popup({
                offsetX: 3,
                fillSymbol: false,
                highlight: false,
                lineSymbol: false,
                marginLeft: 10,
                marginTop: 10,
                markerSymbol: false,
                offsetY: 3,
                zoomFactor: 4
            }, domConstruct.create("div"));
            // connects for popup
            connect.connect(_self.options.customPopup, "maximize", function() {
                _self.hideAllMenus();
            });
            //connect.connect(_self.options.customPopup, "onSelectionChange", function() {
            //    _self.overridePopupTitle();
            //});
            //connect.connect(_self.options.customPopup, "onHide", function() {
            //    _self.clearPopupValues();
            //});
            // popup theme
            //domClass.add(_self.options.customPopup.domNode, "modernGrey");
        },
        // Create the map object for the template
        createWebMap: function () {
            
            var _self = this;
 
            var token = {
                "server": "http://www.arcgis.com/sharing/rest",
                "userId": "kramerusc",
                "token": _self.options.token,
                "ssl": false,
                "expires": 86400
            };

            kernel.id.registerToken(token);

            // configure popup
            _self.configurePopup();
            // create map deferred with options
            var mapDeferred = arcgisUtils.createMap(_self.options.webmap, 'map', {
                mapOptions: {
                    slider: true,
                    wrapAround180: true,
                    infoWindow: _self.options.customPopup,
                    isScrollWheelZoom: true
                },
                bingMapsKey: templateConfig.bingMapsKey,
                geometryServiceURL: templateConfig.helperServices.geometry.url
            });
            // on successful response
            mapDeferred.addCallback(function (response) {
                _self.webmapReturned(response);
            });
            // on error response
            mapDeferred.addErrback(function(error) {
                _self.alertDialog(i18n.viewer.errors.createMap + ": " + error.message);
            });
        },
        init: function() {
            var _self = this;
            //_self.setOptions();
            // add menus
            _self.addSlideMenus();
            // Create Map
            _self.createWebMap();
            // filtering
        }
    });
    return Widget;
});