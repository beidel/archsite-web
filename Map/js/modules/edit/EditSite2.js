define([
    "dojo/_base/declare",
    "dojo/_base/connect",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/_base/event",
    "dojo/_base/xhr",
    "dojo/query",
    "dojo/dom-construct",
    "dojo/dom-attr",
	"dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dojo/text!./templates/EditSite2.html",
	"dojo/dom-style",
	"dojo/_base/fx",
	"dojo/on",
    "dojo/io/iframe",
	"dojo/mouse",
    "dojo/promise/all",
    "dijit/Dialog",
    "esri/tasks/GeometryService",
    "esri/geometry/Polygon",
    "esri/SpatialReference",
    "esri/tasks/ProjectParameters",
    "esri/toolbars/draw",
    "esri/toolbars/edit",
    "esri/layers/FeatureLayer",
    "esri/dijit/editing/AttachmentEditor",
    "esri/tasks/QueryTask",
    "esri/geometry/Extent",
    "esri/tasks/query",
    "esri/request",
    "modules/sitereport/SiteReport",
    "modules/ArchSite",
    "modules/editform/EditForm",
    "esri/graphic",
    "esri/layers/FeatureEditResult",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleMarkerSymbol",
    "dojo/_base/Color",
    "dijit/layout/ContentPane",
    "dijit/form/Button",
    "dijit/form/CheckBox",
    "dijit/form/RadioButton",
    "dijit/form/TextBox",
    "dijit/form/Select",
    "dijit/form/ValidationTextBox",
    "dijit/form/Textarea",
    "dijit/form/DateTextBox",
    "dijit/form/NumberTextBox",
    "dijit/form/SimpleTextarea",
    "dojo/NodeList-traverse"
    
    
],
function (declare, connect, arr, lang, event, xhr, query, domConstruct, domAttr, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, domStyle,
    baseFx, on, ioFrame, mouse, all, Dialog, GeometryService, Polygon, SpatialReference, ProjectParameters, Draw, Edit,
    FeatureLayer, AttachmentEditor, QueryTask, Extent, Query, esriRequest, SiteReport, ArchSite, EditForm, Graphic, FeatureEditResult, SimpleFillSymbol, SimpleLineSymbol,
    SimpleMarkerSymbol, Color, ContentPane, Button, CheckBox, RadioButton, TextBox, Select, ValidationTextBox) {
    var Widget = declare("modules.edit.EditSite2", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        constructor: function (options) {
            
            var _self = this;
            this.options = {
                name: "Arch Site",
                userid: "",
                affiliation: "",
                height: 500
            };
            declare.safeMixin(this.options, options);

            this.fc = [];

            this.fcValues = {},

            this.dataRecovered = {
                OBJECTID: "",
                SITEID: "",
                NUMBEROFARTIFACTS: 0,
                MaterialsRecovered: "",
                RECORD_OWNER: "",
                EDITED_DATE: ""
            },

            this.documents = {
                OBJECTID: "",
                GROUPID: 0,
                LOCATION: "",
                NAME: "",
                COMMENTS: "",
                DOCOWNER: "",
                RECORD_OWNER: "",
                EDITED_DATE: ""
            },

            this.sitesVM = lang.hitch(this, function () {
                var _self = this;

                var userSites = ko.observableArray([]);
                var waitSites = ko.observableArray([]);

                return {
                    userSites: userSites,
                    waitSites: waitSites
                }
            })();

            this.tb;
            this.editToolbar;

            this.tbEvent;

            this.geometry = null;

            this.simpleFillSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new Color([255,0,0]), 2),new Color([255,255,0,0.25]));
            this.simpleMarkerSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 1), new Color([0, 255, 0, 0.25]));

            this.pgHeight = 600;

            this.name = this.options.name;

            this.totalPages = 6;

            this.currentPage = 1;

            this.numViews = 11;

            this.searchBuffer = 30;

            this.selId = "";

            this.siteList = [];

            this.resultList = [];

            // Our template - important!
            this.templateString = template;

            this.widgetsInTemplate = true;

            
            this.draftFeatureLayer = new FeatureLayer(this.options.draftFeatureLayerUrl, {
                id: "Archsite Draft",
                outFields: ["*"]
            });

            this.draftDataRecovTable = new FeatureLayer(this.options.draftDataRecovTableUrl, {
                id: "DataRecovDraft",
                outFields: ["*"]
            });

            this.draftTestUnitTable = new FeatureLayer(this.options.draftTestingUnitsTableUrl, {
                id: "TestingUnitDraft",
                outFields: ["*"]
            });

            this.draftExcavUnitTable = new FeatureLayer(this.options.draftExcavationUnitsTableUrl, {
                id: "ExcavUnitDraft",
                outFields: ["*"]
            });

            this.draftCountyCodesTable = new FeatureLayer(this.options.draftCountyCodesTableUrl, {
                id: "CountyCodes",
                outFields: ["*"]
            });

            this.dflEvent= this.draftFeatureLayer.on("edits-complete", lang.hitch(_self, this.onEditsComplete));
            this.draftFeatureLayer.on("error", lang.hitch(_self, this.onError));

            if (this.options.role == "admin") {
                this.prodFeatureLayer = new FeatureLayer(this.options.archsiteLayerUrl, {
                    id: "Archsite Prod",
                    outFields: ["*"]
                });

                //this.prodFeatureLayer.on("edits-complete", lang.hitch(_self, this.onEditsProd));
            }
            else {
                this.draftFeatureLayer.setDefinitionExpression("RECORD_OWNER = '" + this.options.userid + "'");
            }
            this.options.map.addLayer(this.draftFeatureLayer);

            this.draftCountyCodesTable.on("query-features-complete", lang.hitch(_self, this.onCcQueryFeaturesComplete));

            //this.draftDataRecovTable.on("edits-complete", lang.hitch(_self, this.onRelEditsComplete));
            
            this.ccodes = {};
            
            if (this.options.geometryServiceUrl != null) {
                this.geometryService = new GeometryService(this.options.geometryServiceUrl);
            }

            //TODO:Make these dynamic in config file
            this.qtUTM = new QueryTask(this.options.queryUtmUrl);
            this.qUTM = new Query();

            this.qtCounty = new QueryTask(this.options.queryCountyUrl);
            this.qCounty = new Query();

            this.qtPhyReg = new QueryTask(this.options.queryPhyRegUrl);
            this.qPhyReg = new Query();

            this.quadUrl = this.options.queryQuadUrl;
            this.soilUrl = this.options.querySoilsUrl;

            this.draftProdMode = false;

            // A class to be applied to the root node in our template
            this.baseClass = "editSite";

            // A reference to our background animation
            this.mouseAnim = null;

            // Colors for our background animation
            this.baseBackgroundColor = "#fff";
            this.mouseBackgroundColor = "#def";

            this.dataRecovCount = 0;
            this.testUnitCount = 0;
            this.excavUnitCount = 0;

            _self.isPublish = false;

            _self.toolMode = "";

            //xhr.get({
            //    url:"js/modules/edit/fields.json", handleAs:"json",
            //    load: lang.hitch(this, function(data){
            //        //console.log("FCLOAD", data);
            //        this.fc = data;
            //    })
            //});

            
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

            console.log("STARTUP");

            var _self = this;

            ko.applyBindings(_self.sitesVM, dojo.byId("siteList"));

            //_self.editForm = new EditForm();
            //dojo.place(_self.editForm.domNode, dojo.byId('editForm'));
            //_self.editForm.startup();

            on(dojo.byId("cfgMenu"), ".mapButton:click, .mapButton:keyup", function (event) {
                if (event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13)) {
                    query('#cfgMenu .mapButton').removeClass('buttonSelected');
                    query(this).addClass('buttonSelected');
                    var id = query(this).attr('data-layer')[0];
                    var panelObj = query('#es_view_1 .cfgPanel[data-layer=' + id + ']');
                    query("#es_view_1 .cfgPanel").style('display', 'none');
                    panelObj.style('display', 'block');
                }
            });

            dojo.query('#es_v12_btnBack').onclick(lang.hitch(this, function (evt) {
                dojo.byId("inFile").value = "";
                dojo.byId("upload-status").value = "";
                this.setView(1);
            }));

            dojo.query('#es_v10_btnBack').onclick(lang.hitch(this, function (evt) {
                this.setView(9);
            }));

            dojo.query('#es_v10_btnReject').onclick(lang.hitch(this, function (evt) {
                this.rejectSite();
            }));

            dojo.query('#es_v10_btnApprove').onclick(lang.hitch(this, function (evt) {
                this.approveSite();
            }));

            //View 11
            dojo.query('#v_11_btnCreate').onclick(lang.hitch(this, function (evt) {
                this.doQueriesAutopopulate();
            }));

            dojo.query('#v_11_btnCancel').onclick(lang.hitch(this, function (evt) {
                this.cancelFeature();
            }));

            //View 2
            dojo.query('#es_v2_btnGeo').onclick(lang.hitch(this, function (evt) {
                this.editGeometry();
            }));

            dojo.query('#es_v2_btnSaveGeo').onclick(lang.hitch(this, function (evt) {
                this.saveGeometry();
            }));

            dojo.query('#es_v2_btnCancel').onclick(lang.hitch(this, function (evt) {
                this.cancelGeometry();
            }));

            //View 4
            dojo.query('#es_v4_btnDeleteSite').onclick(lang.hitch(this, function (evt) {
                this.deleteSite();
            }));

            dojo.query('#es_v4_btnCancel').onclick(lang.hitch(this, function (evt) {
                this.showMainMenu();
            }));

            //View 5
            dojo.query('#es_v5_btnGeoSearch').onclick(lang.hitch(this, function (evt) {
                this.graphicSearch();
            }));

            dojo.query('#es_v5_btnCancel').onclick(lang.hitch(this, function (evt) {
                this.cancelRevisit();
            }));

            //View 6
            dojo.query('#es_v6_btnBackForm').onclick(lang.hitch(this, function (evt) {
                this.backToForm();
            }));

            //View 7
            dojo.query('#v_8_btnYes').onclick(lang.hitch(this, function (evt) {
                this.publishFeature();
            }));

            dojo.query('#v_8_btnNo').onclick(lang.hitch(this, function (evt) {
                this.backToForm();
            }));

            dojo.query('#es_v2_pg5_btnAddItem').onclick(lang.hitch(this, function (evt) {
                this.addDataRecov();
            }));

            dojo.query('#es_v2_pg5_btnTuAddItem').onclick(lang.hitch(this, function (evt) {
                this.addTestUnit();
            }));

            dojo.query('#es_v2_pg5_btnEuAddItem').onclick(lang.hitch(this, function (evt) {
                this.addExcavUnit();
            }));

            
            dojo.query('#es_v9_btnCommit').onclick(lang.hitch(this, function (evt) {
                this.commitChanges();
            }));

            var toolList = dojo.byId("es_v1_toolbar");
            if (toolList) {
                on(toolList, ".editToolButton:click, .editToolButton:keyup", function (event) {
                    if (event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13)) {
                        var id = query(this).attr('data-menu')[0];

                        switch (id) {
                            case "addsite":
                                _self.toolMode = "D";
                                _self.showAddSite();
                                break;
                            case "addrevisit":
                                _self.toolMode = "R";
                                _self.addRevisit();
                                break;
                            case "editsites":
                                _self.toolMode = "E";
                                _self.addRevisit();
                                break;
                            case "approvesites":
                                _self.setView(9);
                                break;
                            case "addshape":
                                _self.setView(12);
                                break;
                        }
                    }
                });
            }

            var toolList = dojo.byId("es_v2_toolbar");
            if (toolList) {
                on(toolList, ".editToolButton:click, .editToolButton:keyup", function (event) {
                    if (event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13)) {
                        var id = query(this).attr('data-menu')[0];

                        switch (id) {
                            case "save":
                                _self.saveAttributes();
                                break;
                            case "publish":
                                _self.publishFeatureCheck();
                                break;
                            case "cancel":
                                _self.cancelFeature();
                                break;
                        }
                    }
                });
            }
            
            var toolList = dojo.byId("es_v9_toolbar");
            if (toolList) {
                on(toolList, ".editToolButton:click, .editToolButton:keyup", function (event) {
                    if (event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13)) {
                        var id = query(this).attr('data-menu')[0];

                        switch (id) {
                            case "addsite":
                                _self.showAddSite();
                                break;
                            case "addrevisit":
                                _self.addRevisit();
                                break;
                            case "editsites":
                                _self.approveSites();
                                break;
                        }
                    }
                });
            }

            //TODO: can get rid of this
            this.myDialog = new Dialog({
                title: "Report",
                content: "<div id='reportDiv'></div>",
                style: "width: 600px"
            });

            if (this.options.role == "admin") {
                //this.setView(9);
                this.currentView = 9;
                this.getWaitList();
            } else {
                this.currentView = 1;
                this.getUserSites();
            }

            this.attachmentEditor = new AttachmentEditor({}, dojo.byId("es_v2_attachment"));
            this.attachmentEditor.startup();

            //this.addShapefile = new AddShapefile({'map': this.options.map, 'token': this.options.token}, dojo.byId("es_addshape"));
            //this.addShapefile.startup();

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

        onHideWidget: function (e) {
            query('.editWidget .viewPane').addClass('hidePage');
            this.cancelGeometry();
            //dojo.style(dojo.byId('es_view_' + this.currentView), "visibility", "hidden");
        },

        onShowWidget: function (e) {
            console.log("currentView", this.currentView);
            this.setView(this.currentView);
        },
        
        getUserSites: function () {
            var grid = this.gridDiv;
            var gridSub = this.gridSubmitted;

            console.log("GetUserSites");

            var _self = this;
            var qt = new QueryTask(_self.options.draftFeatureLayerUrl);
            var qry = new Query();
            qry.where = "RECORD_OWNER = '" + this.options.userid + "'";
            qry.orderByFields = ["PROJECT"];
            qry.returnGeometry = true;
            qry.outFields = ["*"];

            qt.execute(qry, function (results) {
                console.log("GetUserSites", results);

                if (results != null) {
                    var j = 0;
                    if (results.features.length > 0) {
                        arr.forEach(results.features, function (entry) {
                            _self.sitesVM.userSite.push(entry);
                        });
                    }
                }


            }, function (error) {
                alert("GetUserSites Error: " + error);
            });

        },

        getWaitList: function() {
            var grid = this.es_v_9_waitDiv;

            console.log("GetWaitList");

            var _self = this;
            var qt = new QueryTask(_self.options.draftFeatureLayerUrl);
            var qry = new Query();
            qry.where = "STATUS = 'P'";
            qry.returnGeometry = true;
            qry.orderByFields = ["RECORDEDBY", "PROJECT"];
            qry.outFields = ["*"];

            qt.execute(qry, function (results) {
                console.log("GetWaitList", results);

                if (results != null) {
                    var j = 0;
                    if (results.features.length > 0) {
                        arr.forEach(results.features, function (entry) {
                            _self.sitesVM.waitSites.push(entry);
                        });
                    }
                }

            }, function (error) {
                alert("GetUserSites Error: " + error);
            });
        },

        deleteSite: function () {
            this.setMessage("Deleting...");

            for (var i = 0; i < this.siteList.length; i++) {
                if (this.siteList[i].id == this.selId) {

                    var gra = new Graphic(this.siteList[i].geometry, null, this.siteList[i].attributes);
                    this.selId = "";
                    this.draftFeatureLayer.applyEdits(null, null, [gra]);

                    break;
                }

            }

            this.selId = "";
            
        },

        deleteSiteConfirm: function (id) {
            this.selId = id;

            this.setView(4);
        },

        showReport: function (id) {
            lArray = this.siteList;

            var obj;

            for (var i = 0; i < lArray.length; i++) {
                if (lArray[i].id == id) {

                    obj = lArray[i].attributes;

                    break;
                }
            }

            this.myDialog.set("style", "width:1200px; height:800px;");

            var rpt = new SiteReport({ fcValues: obj, height: '800px' });
            rpt.set("style", "width:1150px; height:700px;");

            this.myDialog.set("content", "<div id='reportDiv'></div>");
            domConstruct.place(rpt.domNode, dojo.byId('reportDiv'));
            rpt.startup();

            this.myDialog.show();

        },

        zoomToSite: function (result) {
            if (result[0] != null) {
                this.options.map.setExtent(result[0]);
            }
              
        },

        reproject: function (id) {
            
            for (var i = 0; i < this.siteList.length; i++) {
                if (this.siteList[i].id == id) {
                    var params = new ProjectParameters();
                    console.log(this.siteList[i].extent);
                    var ext = new Extent(this.siteList[i].extent.xmin - 250, this.siteList[i].extent.ymin - 250, this.siteList[i].extent.xmax + 250, this.siteList[i].extent.ymax + 250, new SpatialReference({ wkid: 26717 }));
                    params.geometries = [ext];
                    params.outSR = new SpatialReference({ wkid: 102100 });
                    params.transformation = { wkid: 15851 };
                    this.geometryService.project(params, lang.hitch(this, this.zoomToSite), function (error) {
                        alert("Projection error: " + error);
                    });
                    break;
                }
            }

            
        },

        reprojectSiteGeometry: function (geo) {
            var params = new ProjectParameters();
            params.geometries = [geo];
            params.outSR = new SpatialReference({ wkid: 102100 });
            params.transformation = { wkid: 15851 };
            this.geometryService.project(params, lang.hitch(this, this.editGeometryAfterReproject), function (error) {
                alert("Projection error: " + error);
            });
        },

        reprojectWebMercator2Nad27: function (geo) {
            var params = new ProjectParameters();
            params.geometries = [geo];
            params.outSR = new SpatialReference({ wkid: 26717 });
            params.transformation = { wkid: 15851 };
            this.geometryService.project(params, lang.hitch(this, this.populateSiteCoordiates), function (error) {
                alert("Projection error: " + error);
            });
        },

        populateSiteCoordiates: function (result) {
            if (result[0] != null) {
                //console.log("PSC", result[0]);
                this.fcValues["EASTING"] = result[0].getExtent().getCenter().x;
                this.fcValues["NORTHING"] = result[0].getExtent().getCenter().y;
                
                dijit.byId("SITELENGTH").set("value", result[0].getExtent().ymax - result[0].getExtent().ymin);
                dijit.byId("SITEWIDTH").set("value", result[0].getExtent().xmax - result[0].getExtent().xmin);
            }
        },

        showValidSite: function (state) {
            query('#es_v2_iconSave').removeClass();

            if (state == '0') {
                query('#es_v2_iconSave').addClass('hidePage');
            }
            else if (state == '1') {
                query('#es_v2_iconSave').addClass('iconInvalidSite');
                query('#es_v2_iconSave').attr("title", "Please define a valid site");
            }
            else {

                query('#es_v2_iconSave').addClass('iconValidSite');
                query('#es_v2_iconSave').attr("title", "Site is valid.");
            }
        },

        toggleEditModeButton: function(mode) {
            var button = query("#es_v2_btnGeo");

            if (button) {
                button.removeClass();
                button.addClass("geoToolButton");

                if (mode == "E") {
                    button.addClass("btnGeoEdit");
                    button.attr("title", "Edit Site Boundary");
                }
                else {
                    button.addClass("btnGeoNew");
                    button.attr("title", "Add New Site Boundary");
                }
            }
        },

        setView: function (view) {

            query('.editWidget .viewPane').addClass('hidePage');
            query('#es_view_' + view).removeClass('hidePage');

            this.currentView = view;
        },

        showDialog: function (title, msg) {
            var myDialog = new Dialog({
                id: "dialogAttr",
                title: title,
                style: "width: 200px; height:200px;",
                draggable: false,
                modal: true,
                showTitle: true
            });

            var html = msg;

            myDialog.set("content", html);
            myDialog.show();
        },

        editAttachments: function () {
            
        },

        attributeSearch: function (evt) {
            if (evt.keyCode === 13) {
                var tb = dijit.byId("attrSearch");
                var searchVal = tb.get("value");
                tb.set("value", "");
                this.doSearch(searchVal);
            }
        },

        graphicSearch: function () {

            this.options.map.graphics.clear();

            //var map = this.options.map;

            this.tb = new Draw(this.options.map);

            this.tbEvent = this.tb.on("draw-end", lang.hitch(this, this.doGraphicSearch));

            this.options.map.disableMapNavigation();
            this.tb.activate("point");
        },

        doGraphicSearch: function (evt) {
            //var map = this.options.map;
            //var tb = this.tb;

            this.tb.deactivate();
            this.options.map.enableMapNavigation();

            this.tbEvent.remove();

            this.options.map.graphics.add(new Graphic(evt.geometry, this.simpleMarkerSymbol));

            this.doSearch(null, evt.geometry);
        },

        doSearch: function (attr, geo) {
            var _self = this;
            var grid = _self.searchList;
            console.log("doSearch", _self.options.archsiteLayerUrl);
            var qt = new QueryTask(_self.options.archsiteLayerUrl);
            var qry = new Query();
            if (attr != null) {
                console.log("DS/ATTR", attr);
                qry.where = "SITENUMBER LIKE '%" + attr + "%'";
            }
            else if (geo != null){
                qry.geometry = geo;
                qry.spatialRelationship = Query.SPATIAL_REL_INTERSECTS;
            }
            qry.returnGeometry = true;
            qry.outFields = ["*"];

            qt.execute(qry, function (results) {
                if (results != null) {
                    console.log("DS/RESULTS", results);
                    grid.innerHTML = '';
                    var j = 0;
                    if (results.features.length > 0) {
                        arr.forEach(results.features, function (entry) {

                            var obj = { 'id': j, 'extent': entry.geometry.getExtent(), 'geometry': entry.geometry, 'attributes': entry.attributes };
                            _self.resultList.push(obj);

                            var row = grid.appendChild(document.createElement('div'));
                            row.id = "result_" + j;
                            dojo.addClass(row, "siteItem");

                            var siteinfo = document.createElement('div');
                            domStyle.set(siteinfo, "float", "left");

                            siteinfo.innerHTML = "<div style='float:left'>" + entry.attributes.SITEID + "</div><div style='clear:left'>" + entry.attributes.SITENAME + "</div>"

                            row.appendChild(siteinfo);

                            var buttonDiv = document.createElement('div');
                            //buttonDiv.id = 
                            domStyle.set(siteinfo, "float", "right");

                            var label = "";
                            var mode = "";

                            if (_self.toolMode == "R") {
                                label = "Revisit";
                                mode = "R";
                            }
                            else if (_self.toolMode == "E") {
                                label = "Edit";
                                mode = "E";
                            }

                            var button = new Button({
                                label: label,
                                id: "resultButton" + j,
                                onClick: lang.hitch(this, function (id) {
                                    _self.editSite(id, mode);
                                }, j)
                            });

                            buttonDiv.appendChild(button.domNode);
                            row.appendChild(buttonDiv);

                            j++;
                        });
                    }
                    else {
                        var row = grid.appendChild(document.createElement('div'));
                        row.appendChild(document.createTextNode("No sites found."));
                    }
                }
            }, function (error) {
                alert("Do Search Error: " + error);
            });
        },

        

        onError: function (error) {
            console.log("onError: ", error);
        },

        setPageStatus: function (msg) {
                console.log("SPS/returnPage:", this.returnPage);
                this.showMessageView(msg, this.returnPage);
            
        },

        setMessage: function (msg) {
            var _self = this;
            dojo.byId("loadingMessage").innerHTML = msg;
            _self.setView(3);
        },

        hideMessage: function (view) {
            this.setView(view);
            dojo.byId("loadingMessage").innerHTML = "Loading..."; 
        },

        showMessageView: function (msg, toView) {
            var _self = this;
            console.log("showMessageView", toView);
            dojo.byId("v_7_message").innerHTML = msg;

            var handle = on(dojo.byId("v_7_btn"), "click", lang.hitch(this, function () {
                handle.remove();
                this.setView(toView);
            }));

            //dojo.byId("v_7_btn").attr('onclick', lang.hitch(this, function () {
            //    this.setView(toView);
            //}));

            _self.setView(7);

        },

        showAddSite: function () {

            this.setView(2);

            this.fcValues = {};

            this.clearForm();

            //Set default values
            dijit.byId('RECORDEDBY').set("value", this.options.displayname);
            dijit.byId('AFFILIATION').set("value", this.options.affiliation);

            this.fcValues["STATUS"] = 'D';

            var currentdate = this.getDateNow("-");
            dijit.byId('RECORDEDDATE').set("value", currentdate);

            this.options.map.disableKeyboardNavigation();

            
        },

        showMainMenu: function () {
            this.setView(1);
        },

        addRevisit: function () {
            this.setView(5);
            this.options.map.disableKeyboardNavigation();
        },

        backToForm: function () {
            this.setView(2);
        },

        cancelRevisit: function () {
            this.resultsList = []
            dojo.byId("searchList").innerHTML = '';
            dijit.byId("attrSearch").set("value", "");
            this.setView(1);
            this.options.map.enableKeyboardNavigation();
        },

        cancelFeature: function () {

            this.resetWidget();
            console.log('switch view');
            this.setView(1);

        },

        resetWidget: function () {
            query('#es_v2_btnSaveGeo').addClass('hidePage');
            query('#es_v2_btnCancel').addClass('hidePage');
            query('#es_v2_btnGeo').removeClass('hidePage');

            this.options.map.enableMapNavigation();

            this.options.map.graphics.clear();

            if (this.editToolbar != null)
                this.editToolbar.deactivate();

            if (this.tb != null)
                this.tb.deactivate();

            this.clearForm();

            this.showValidSite('1');

            this.pageReset();

            this.toggleEditModeButton("A");

            this.fcValues = {};

            this.geometry = null;

            this.isPublish = false;

            this.getUserSites();

            this.options.map.enableKeyboardNavigation();
        },

        pageReset: function()
        {
            this.currentPage = 1;

            this.pageMove();
        },

        //==============================================================
        //
        // Add Shape function
        //
        //==============================================================

        generateFeatureCollection: function (fileName) {
            console.log("GFC", fileName);
            var _self = this;
            var name = fileName.split(".");
            //Chrome and IE add c:\fakepath to the value - we need to remove it
            //See this link for more info: http://davidwalsh.name/fakepath
            newname = name[0].replace("c:\\fakepath\\", "");

            dojo.byId('upload-status').innerHTML = '<b>Loading… </b>' + newname;

            //Define the input params for generate see the rest doc for details
            //http://www.arcgis.com/apidocs/rest/index.html?generate.html
            var params = {
                'name': newname + ".zip",
                'targetSR': _self.options.map.spatialReference,
                'maxRecordCount': 1000,
                'enforceInputFileSizeLimit': true,
                'enforceOutputJsonSizeLimit': true
            };

            console.log("GFC1", params);

            //generalize features for display Here we generalize at 1:40,000 which is approx 10 meters 
            //This should work well when using web mercator.  
            var extent = esri.geometry.getExtentForScale(_self.options.map, 40000);
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

            //_self.content = dojo.toJson(myContent);

            console.log("GFC2", myContent);

            console.log("UF", dojo.byId('uploadForm'));

            myurl = 'http://www.arcgis.com/sharing/rest/content/features/generate?f=json&filetype=shapefile&callbackParamName=textarea&publishParameters=' + encodeURIComponent(dojo.toJson(params))

            //use the rest generate operation to generate a feature collection from the zipped shapefile 
            esri.request({
                url: myurl,
                form: dojo.byId('uploadForm'),
                handleAs: 'json',
                load: dojo.hitch(this, function (response) {
                    console.log("RESPONSE", response.featureCollection);
                    if (response.error) {
                        console.log("RESPONSEERROR");
                        errorHandler(response.error);
                        return;
                    }
                    dojo.byId('upload-status').innerHTML = '<b>Loaded: </b>' + response.featureCollection.layers[0].layerDefinition.name;
                    _self.addShapefileToMap(response.featureCollection);
                    _self.getUserSites();

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

            this.dflEvent.remove();

            dojo.forEach(featureCollection.layers, function (layer) {
                var infoTemplate = new esri.InfoTemplate("Details", "${*}");
                var layer = new esri.layers.FeatureLayer(layer, {
                    infoTemplate: infoTemplate
                });

                var graCollection = layer.graphics;
                upCollection = [];

                
                
                var fc = new ArchSite();

                console.log("FC", fc);

                for (var g = 0; g < graCollection.length; g++) {
                    var attrs = {};

                    attrs["RECORD_OWNER"] = _self.options.userid;
                    attrs["STATE"] = "SC";
                    attrs["GEO_VALID"] = "Y";

                    for (var i = 0; i < fc.fields.length; i++) {
                        item = fc.fields[i];

                        if (graCollection[g].attributes[item.name.substring(0, 8)] != null) {
                            attrs[item.name] = graCollection[g].attributes[item.name.substring(0, 8)];
                        }
                    }

                    console.log("GRAATTRS", attrs);

                    var gra = new Graphic(graCollection[g].geometry, null, attrs);
                    upCollection.push(gra);
                }

                _self.draftFeatureLayer.applyEdits(upCollection, null, null);

                console.log("SHAPEFILELAYER", layer);

                //associate the feature with the popup on click to enable highlight and zoomto
                //dojo.connect(layer, 'onClick', function (evt) {
                //    _self.options.map.infoWindow.setFeatures([evt.graphic]);
                //});
                //change default symbol if desired. Comment this out and the layer will draw with the default symbology
                //changeRenderer(layer);
                fullExtent = fullExtent ? fullExtent.union(layer.fullExtent) : layer.fullExtent;
                layers.push(layer);
            });

           
            //_self.options.map.addLayers(layers);
            _self.options.map.setExtent(fullExtent.expand(1.25), true);

            dojo.byId('upload-status').innerHTML = "";
        }
    });
    return Widget;
});