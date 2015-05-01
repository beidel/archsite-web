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
	"dojo/text!./templates/AdminView.html",
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
    FeatureLayer, AttachmentEditor, QueryTask, Extent, Query, esriRequest, SiteReport, ArchSite, Graphic, FeatureEditResult, SimpleFillSymbol, SimpleLineSymbol,
    SimpleMarkerSymbol, Color, ContentPane, Button, CheckBox, RadioButton, TextBox, Select, ValidationTextBox) {
    var Widget = declare("modules.adminview.AdminView", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
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

            this.tb;
            this.editToolbar;

            this.tbEvent;

            this.geometry = null;

            this.simpleFillSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new Color([255, 0, 0]), 2), new Color([255, 255, 0, 0.25]));
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

            this.dflEvent = this.draftFeatureLayer.on("edits-complete", lang.hitch(_self, this.onEditsComplete));
            this.draftFeatureLayer.on("error", lang.hitch(_self, this.onError));


            this.prodFeatureLayer = new FeatureLayer(this.options.archsiteLayerUrl, {
                id: "Archsite Prod",
                outFields: ["*"]
            });

            this.options.map.addLayer(this.draftFeatureLayer);

            this.draftCountyCodesTable.on("query-features-complete", lang.hitch(_self, this.onCcQueryFeaturesComplete));

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

            this.fc = ArchSite;
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

            on(dojo.byId("av_cfgMenu"), ".mapButton:click, .mapButton:keyup", function (event) {
                if (event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13)) {
                    query('#av_cfgMenu .mapButton').removeClass('buttonSelected');
                    query(this).addClass('buttonSelected');
                    var id = query(this).attr('data-layer')[0];
                    var panelObj = query('#av_view_1 .cfgPanel[data-layer=' + id + ']');
                    query("#av_view_1 .cfgPanel").style('display', 'none');
                    panelObj.style('display', 'block');
                }
            });

            on(dojo.byId("av_navBar"), ".toolbarButton:click, .toolbarButton:keyup", function (event) {
                if (event.type === 'click' || (event.type === 'keyup' && event.keyCode === 13)) {

                    var action = query(this).attr('data-action')[0];

                    if (action == "back") {
                        _self.pageBack();
                    }
                    else {
                        _self.pageForward();
                    }
                }
            });

            dojo.query('#av_v10_btnBack').onclick(lang.hitch(this, function (evt) {
                this.setView(9);
            }));

            dojo.query('#av_v10_btnReject').onclick(lang.hitch(this, function (evt) {
                this.rejectSite();
            }));

            dojo.query('#av_v10_btnApprove').onclick(lang.hitch(this, function (evt) {
                this.approveSite();
            }));

            //View 11
            dojo.query('#av_v_11_btnCreate').onclick(lang.hitch(this, function (evt) {
                this.doQueriesAutopopulate();
            }));

            dojo.query('#av_v_11_btnCancel').onclick(lang.hitch(this, function (evt) {
                this.cancelFeature();
            }));

            //View 2
            dojo.query('#av_v2_btnGeo').onclick(lang.hitch(this, function (evt) {
                this.editGeometry();
            }));

            dojo.query('#av_v2_btnSaveGeo').onclick(lang.hitch(this, function (evt) {
                this.saveGeometry();
            }));

            dojo.query('#av_v2_btnCancel').onclick(lang.hitch(this, function (evt) {
                this.cancelGeometry();
            }));

            //View 4
            dojo.query('#av_v4_btnDeleteSite').onclick(lang.hitch(this, function (evt) {
                this.deleteSite();
            }));

            dojo.query('#av_v4_btnCancel').onclick(lang.hitch(this, function (evt) {
                this.showMainMenu();
            }));

            //View 5
            dojo.query('#av_v5_btnGeoSearch').onclick(lang.hitch(this, function (evt) {
                this.graphicSearch();
            }));

            dojo.query('#av_v5_btnCancel').onclick(lang.hitch(this, function (evt) {
                this.cancelRevisit();
            }));

            //View 6
            dojo.query('#av_v6_btnBackForm').onclick(lang.hitch(this, function (evt) {
                this.backToForm();
            }));

            //View 7
            dojo.query('#av_v_8_btnYes').onclick(lang.hitch(this, function (evt) {
                this.publishFeature();
            }));

            dojo.query('#av_v_8_btnNo').onclick(lang.hitch(this, function (evt) {
                this.backToForm();
            }));

            dojo.query('#av_v2_pg5_btnAddItem').onclick(lang.hitch(this, function (evt) {
                this.addDataRecov();
            }));

            dojo.query('#av_v2_pg5_btnTuAddItem').onclick(lang.hitch(this, function (evt) {
                this.addTestUnit();
            }));

            dojo.query('#av_v2_pg5_btnEuAddItem').onclick(lang.hitch(this, function (evt) {
                this.addExcavUnit();
            }));


            dojo.query('#av_v9_btnCommit').onclick(lang.hitch(this, function (evt) {
                this.commitChanges();
            }));

            var toolList = dojo.byId("av_v1_toolbar");
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

            var toolList = dojo.byId("av_v2_toolbar");
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

            var toolList = dojo.byId("av_v9_toolbar");
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
                content: "<div id='av_reportDiv'></div>",
                style: "width: 600px"
            });


            //this.setView(9);
            this.currentView = 9;
            this.getWaitList();

            this.attachmentEditor = new AttachmentEditor({}, dojo.byId("av_v2_attachment"));
            this.attachmentEditor.startup();

        },

        onHideWidget: function (e) {
            query('.adminWidget .viewPane').addClass('hidePage');
            this.cancelGeometry();
            //dojo.style(dojo.byId('av_view_' + this.currentView), "visibility", "hidden");
        },

        onShowWidget: function (e) {
            console.log("currentView", this.currentView);
            this.setView(this.currentView);
        },

        getWaitList: function () {
            var grid = this.av_v_9_waitDiv;

            console.log("GetWaitList");

            var _self = this;
            var qt = new QueryTask(_self.options.draftFeatureLayerUrl);
            var qry = new Query();
            qry.where = "STATUS = 'P'";
            qry.returnGeometry = true;
            qry.orderByFields = ["RECORDEDBY", "PROJECT"];
            qry.outFields = ["*"];

            qt.execute(qry, function (results) {
                grid.innerHTML = '';

                _self.siteList = [];

                if (results != null) {
                    var j = 0;
                    if (results.features.length > 0) {
                        arr.forEach(results.features, function (entry) {

                            var obj = { 'id': j, 'extent': entry.geometry.getExtent(), 'geometry': entry.geometry, 'attributes': entry.attributes };
                            _self.siteList.push(obj);

                            var row;

                            row = grid.appendChild(document.createElement('div'));

                            row.id = "av_psite_" + j;
                            dojo.addClass(row, "siteItem");

                            if (j < (results.features.length - 1)) {

                                dojo.addClass(row, "middleItem");
                            }

                            var siteinfo = document.createElement('div');
                            domStyle.set(siteinfo, "float", "left");

                            var siteid, project = "";

                            if (entry.attributes.PROJECT == null)
                                project = "Project is not defined";
                            else
                                project = entry.attributes.PROJECT;

                            if (project.length > 24) {
                                project = project.substring(0, 24) + "...";
                            }

                            if (entry.attributes.RECORDEDDATE == null)
                                sitename = "";
                            else
                                sitename = _self.formatDate(new Date(entry.attributes.RECORDEDDATE));


                            siteinfo.innerHTML = "<div class='itemDesc' id='av_adm_ahref_" + j + "'><span class='titleText' >" + project + "</span></div><div class='subText' style='clear:left'>" + sitename + "</div>"

                            row.appendChild(siteinfo);

                            var buttons = document.createElement('div');

                            var html = "";
                            html += "<span id='av_adm_editButton_" + j + "' class='editButton' title='Edit'></span>";

                            html += "<span id='av_adm_zoomButton_" + j + "' class='zoomButton' title='Zoom to Site'></span>";


                            buttons.innerHTML = html;
                            row.appendChild(buttons);


                            dojo.query("#av_psite_" + j).onclick(lang.hitch(this, function (e) {
                                console.log("GWL/AHREF", e);
                                var elem = "";
                                if (e.target.toString().toUpperCase().indexOf('SPAN') > -1) {
                                    elem = e.target.parentNode.id;
                                } else {
                                    elem = e.target.id;
                                }

                                console.log("GWL/elem", elem);

                                var id = elem.substring(elem.lastIndexOf('_') + 1, elem.length);
                                _self.reviewSite(id);
                                //_self.showReport(id);
                            }));

                            var eButton = dojo.byId("av_adm_editButton_" + j);
                            if (eButton) {

                                on(eButton, "click", lang.hitch(this, function (e) {
                                    e.stopPropagation();
                                    var elem = e.target.id;
                                    var id = elem.substring(elem.lastIndexOf('_') + 1, elem.length);
                                    _self.editSite(id, 'N');

                                }));
                            }

                            var zButton = dojo.byId("av_adm_zoomButton_" + j);
                            if (zButton) {

                                on(zButton, "click", lang.hitch(this, function (e) {
                                    e.stopPropagation();
                                    var elem = e.target.id;
                                    var id = elem.substring(elem.lastIndexOf('_') + 1, elem.length);
                                    _self.reproject(id);

                                }));
                            }

                            j++;


                        });


                    }
                    else {
                        var row = grid.appendChild(document.createElement('div'));
                        row.appendChild(document.createTextNode("No sites found."));
                    }


                }

                console.log("GetWaitList completed");

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

            this.myDialog.set("content", "<div id='av_reportDiv'></div>");
            domConstruct.place(rpt.domNode, dojo.byId('reportDiv'));
            rpt.startup();

            this.myDialog.show();

        },

        editSite: function (id, status) {
            //TODO: Need to fire off an update to the SiteID if this is a revist
            var lArray;
            var revisit = 'N';

            //Set the entry status
            if (status === 'R') {
                lArray = this.resultList;
                revisit = 'Y';
            }
            else if (status === 'E') {
                lArray = this.resultList;
            }
            else if (status === 'N') {
                lArray = this.siteList;
            }

            //Loop throuh array to get the geometry and attributes
            for (var i = 0; i < lArray.length; i++) {
                if (lArray[i].id == id) {

                    this.fcValues = lArray[i].attributes;
                    this.geometry = lArray[i].geometry;

                    this.reproject(id);

                    //TODO: Is this null check necessary?
                    if (this.geometry != null) {
                        var gra = new Graphic(this.geometry, null, this.fcValues);
                        this.attachmentEditor.showAttachments(gra, this.draftFeatureLayer);

                        this.toggleEditModeButton("E");

                        if (this.fcValues.GEO_VALID == 'Y')
                            this.showValidSite('');
                        else
                            this.showValidSite('1');
                    }
                    else {
                        this.toggleEditModeButton("A");
                        this.showValidSite('1');
                    }



                    if (status === 'R') {
                        this.fcValues["REVISIT"] = revisit;

                        if (revisit == null) {
                            this.fcValues["REVISITNUM"] = 0;
                        }
                        else if (revisit == "N") {
                            this.fcValues["REVISITNUM"] = 0;
                        }
                        else {
                            this.fcValues["REVISITNUM"] += 1;
                        }
                    }

                    this.clearForm();

                    this.populateForm();

                    this.setView(2);

                    break;
                }
            }

            this.options.map.disableKeyboardNavigation();

            var sqt = new QueryTask(this.options.draftDataRecovTableUrl);
            var squery = new Query();
            squery.where = "SITEID = '" + this.fcValues["SITEID"] + "'";
            squery.returnGeometry = false;
            squery.outFields = ["OBJECTID", "SITEID", "NUMBEROFARTIFACTS", "MaterialsRecovered"];

            sqt.execute(squery, lang.hitch(this, function (rel) {
                if (rel != null) {
                    console.log("ES\DataRecov", rel);
                    if (rel.features.length > 0) {
                        this.fcValues["DATARECOV"] = [];
                        for (var i = 0; i < rel.features.length; i++) {
                            var entry = rel.features[i];
                            var rec = { SITEID: entry.attributes.SITEID, NUMBEROFARTIFACTS: entry.attributes.NUMBEROFARTIFACTS, MaterialsRecovered: entry.attributes.MaterialsRecovered };
                            this.fcValues["DATARECOV"].push(entry);

                            this.addDataRecov();

                            dijit.byId("av_dr_num_" + this.dataRecovCount).set("value", entry.attributes.NUMBEROFARTIFACTS);
                            dijit.byId("av_dr_txt_" + this.dataRecovCount).set("value", entry.attributes.MaterialsRecovered);

                        }
                        console.log("ES\DataRecov\Results", this.fcValues["DATARECOV"]);
                    }
                }
            }));

            sqt2 = new QueryTask(this.options.draftTestingUnitsTableUrl);
            squery = new Query();
            squery.where = "SITEID = '" + this.fcValues["SITEID"] + "'";
            squery.returnGeometry = false;
            squery.outFields = ["OBJECTID", "SITEID", "NUMBER", "SIZE", "MAXDEPTH", "TESTINGMETHODTYPE", "OTHER"];

            sqt2.execute(squery, lang.hitch(this, function (rel) {
                if (rel != null) {
                    console.log("ES\TestUnit", rel);
                    if (rel.features.length > 0) {
                        this.fcValues["TESTINGUNITS"] = [];
                        for (var i = 0; i < rel.features.length; i++) {
                            var entry = rel.features[i];
                            var rec = {
                                SITEID: entry.attributes.SITEID,
                                NUMBERS: entry.attributes.NUMBER,
                                SIZE: entry.attributes.SIZE,
                                MAXDEPTH: entry.attributes.MAXDEPTH,
                                TESTINGMETHODTYPE: entry.attributes.TESTINGMETHODTYPE,
                                OTHER: entry.attributes.OTHER
                            };
                            this.fcValues["TESTINGUNITS"].push(entry);

                            this.addTestUnit();

                            dijit.byId("av_dr_num_" + this.dataRecovCount).set("value", entry.attributes.NUMBER);
                            dijit.byId("av_dr_size_" + this.dataRecovCount).set("value", entry.attributes.SIZE);
                            dijit.byId("av_dr_depth_" + this.dataRecovCount).set("value", entry.attributes.MAXDEPTH);

                            //SELECT is HTML object
                            domAttr.set(dojo.byId("av_dr_tmt_" + this.dataRecovCount), "value", entry.attributes.TESTINGMETHODTYPE);
                            //dijit.byId("av_dr_tmt_" + this.dataRecovCount).set("value", entry.attributes.TESTINGMETHODTYPE);

                            dijit.byId("av_dr_other_" + this.dataRecovCount).set("value", entry.attributes.OTHER);

                        }
                        console.log("ES\TestUnit\Results", this.fcValues["TESTINGUNITS"]);
                    }
                }
            }));

            sqt3 = new QueryTask(this.options.draftExcavationUnitsTableUrl);
            squery = new Query();
            squery.where = "SITEID = '" + this.fcValues["SITEID"] + "'";
            squery.returnGeometry = false;
            squery.outFields = ["OBJECTID", "SITEID", "NUMBER", "SIZE", "MAXDEPTH", "COMMENTS"];

            sqt3.execute(squery, lang.hitch(this, function (rel) {
                if (rel != null) {
                    console.log("ES\ExcavUnit", rel);
                    if (rel.features.length > 0) {
                        this.fcValues["EXCAVATIONUNITS"] = [];
                        for (var i = 0; i < rel.features.length; i++) {
                            var entry = rel.features[i];
                            var rec = {
                                SITEID: entry.attributes.SITEID,
                                NUMBERS: entry.attributes.NUMBER,
                                SIZE: entry.attributes.SIZE,
                                MAXDEPTH: entry.attributes.MAXDEPTH,
                                COMMENTS: entry.attributes.COMMENTS
                            };
                            this.fcValues["EXCAVATIONUNITS"].push(entry);

                            this.addExcavUnit();

                            dijit.byId("av_dr_num_" + this.dataRecovCount).set("value", entry.attributes.NUMBER);
                            dijit.byId("av_dr_size_" + this.dataRecovCount).set("value", entry.attributes.SIZE);
                            dijit.byId("av_dr_depth_" + this.dataRecovCount).set("value", entry.attributes.MAXDEPTH);
                            dijit.byId("av_dr_com_" + this.dataRecovCount).set("value", entry.attributes.COMMENTS);

                        }
                        console.log("ES\ExcavUnit\Results", this.fcValues["EXCAVATIONUNITS"]);
                    }
                }
            }));

        },

        populateForm: function () {
            var item;
            //console.log(this.fcValues);
            for (var i = 0; i < this.fc.length; i++) {
                item = this.fc[i];
                if (dijit.byId('av_' + item.name) != null) {
                    var control = dijit.byId('av_' + item.name);

                    var val = null;

                    if (this.fcValues[item.name] != null) {
                        val = this.fcValues[item.name];
                    }

                    if (control != null) {
                        //console.log(item.name);
                        switch (item.type) {
                            case "esriFieldTypeString":
                                if (item.inputtype == "checkbox") {
                                    //console.log("Checkbox: " + control.id, val);
                                    if (val != null) {
                                        //console.log("Checkbox: " + control.id + val);
                                        if (val == "Y") {
                                            control.set("checked", true);
                                        }
                                        else {
                                            control.set("checked", false);
                                        }
                                    }
                                    else {
                                        control.set("checked", false);
                                    }
                                } else {
                                    control.set("value", val);
                                }
                                control.set("value", val);
                                break;
                            case "esriFieldTypeSmallInteger":
                                control.set("value", val);
                                break;
                            case "esriFieldTypeInteger":
                                control.set("value", val);
                                break;
                            case "esriFieldTypeDouble":
                                control.set("value", val);
                                break;
                            case "esriFieldTypeDate":
                                val = new Date(val);
                                //var inputStr = (val.getMonth() + 1) + "/" + (val.getDate() + 1) + "/" + val.getFullYear();
                                control.set("value", val);
                                break;
                        }
                    }
                }
            }
        },

        clearForm: function () {
            var item;
            for (var i = 0; i < this.fc.length; i++) {
                item = this.fc[i];
                if (dijit.byId('av_' + item.name) != null) {
                    var control = dijit.byId('av_' + item.name);
                    if (control != null) {
                        switch (item.type) {
                            case "esriFieldTypeString":
                                if (item.inputtype == "checkbox") {
                                    control.set("checked", false);
                                } else {
                                    control.set("value", null);
                                }
                                break;
                            case "esriFieldTypeSmallInteger":
                                control.set("value", null);
                                break;
                            case "esriFieldTypeInteger":
                                control.set("value", null);
                                break;
                            case "esriFieldTypeDouble":
                                control.set("value", null);
                                break;
                            case "esriFieldTypeDate":
                                control.set("value", this.getDateNow("-"));
                                break;
                        }
                    }
                }
            }

            //Clean out the Data Recovered tables
            var table = dojo.byId("av_DataRecovered");

            var ids = [];
            var parts = [];
            var id = null;

            for (var p = 0; p < table.rows.length; p++) {
                if (table.rows[p] != null) {
                    if (table.rows[p].id.indexOf("_") > -1) {
                        parts = table.rows[p].id.split("_");
                        id = parts[parts.length - 1];
                        ids.push(id);
                    }
                }
            }

            arr.forEach(ids, lang.hitch(this, function (id) {
                this.removeDataRecov(id);
            }));

            //Clean out the Testing Unit tables
            table = dojo.byId("av_TestingUnits");

            ids = [];

            for (p = 0; p < table.rows.length; p++) {
                if (table.rows[p] != null) {
                    if (table.rows[p].id.indexOf("_") > -1) {
                        parts = table.rows[p].id.split("_");
                        id = parts[parts.length - 1];
                        ids.push(id);
                    }
                }
            }

            arr.forEach(ids, lang.hitch(this, function (id) {
                this.removeTestUnit(id);
            }));

            //Clean out the Excavation Unit tables
            table = dojo.byId("av_ExcavUnits");

            ids = [];

            for (p = 0; p < table.rows.length; p++) {
                if (table.rows[p] != null) {
                    if (table.rows[p].id.indexOf("_") > -1) {
                        parts = table.rows[p].id.split("_");
                        id = parts[parts.length - 1];
                        ids.push(id);
                    }
                }
            }

            arr.forEach(ids, lang.hitch(this, function (id) {
                this.removeExcavUnit(id);
            }));

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

                dijit.byId("av_SITELENGTH").set("value", result[0].getExtent().ymax - result[0].getExtent().ymin);
                dijit.byId("av_SITEWIDTH").set("value", result[0].getExtent().xmax - result[0].getExtent().xmin);
            }
        },

        showValidSite: function (state) {
            query('#av_v2_iconSave').removeClass();

            if (state == '0') {
                query('#av_v2_iconSave').addClass('hidePage');
            }
            else if (state == '1') {
                query('#av_v2_iconSave').addClass('iconInvalidSite');
                query('#av_v2_iconSave').attr("title", "Please define a valid site");
            }
            else {

                query('#av_v2_iconSave').addClass('iconValidSite');
                query('#av_v2_iconSave').attr("title", "Site is valid.");
            }
        },

        toggleEditModeButton: function (mode) {
            var button = query("#av_v2_btnGeo");

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

            query('.adminWidget .viewPane').addClass('hidePage');
            query('#av_view_' + view).removeClass('hidePage');

            this.currentView = view;
        },

        editGeometry: function () {
            console.log("editGeometry");
            var _self = this;
            var map = _self.options.map;
            if (_self.options.map.getScale() <= 24000) {
                console.log("EG/GoodScale");
                if (_self.geometry != null) {
                    if (_self.geometry.spatialReference.wkid != 102100) {
                        console.log("EG/existing graphic/needsreproject");
                        _self.reprojectSiteGeometry(_self.geometry);
                    } else {
                        console.log("EG/existing graphic");

                        query('#av_v2_btnSaveGeo').removeClass('hidePage');
                        query('#av_v2_btnCancel').removeClass('hidePage');
                        query('#av_v2_btnGeo').addClass('hidePage');
                        this.showValidSite('0');
                        //dojo.style(dojo.byId("av_v2_btnSaveGeo"), "visibility", "visible");
                        //dojo.style(dojo.byId("av_v2_btnSaveGeo"), "display", "inline");

                        _self.editToolbar = new Edit(map);

                        //console.log(_self.geometry);

                        _self.editToolbar.activate(Edit.EDIT_VERTICES, new Graphic(_self.geometry, _self.simpleFillSymbol));

                        _self.tbEvent = _self.editToolbar.on("deactivate", lang.hitch(_self, _self.saveEditGeometry));

                        _self.options.map.disableMapNavigation();
                    }


                } else {
                    console.log("EG/new graphic");
                    this.tb = new Draw(this.options.map);

                    this.tbEvent = this.tb.on("draw-end", lang.hitch(this, this.addGraphic));

                    this.options.map.disableMapNavigation();
                    this.tb.activate("polygon");
                }
            }
            else {
                this.showMessageView("Please zoom into a scale less than 1:24,000", 2);
            }

        },

        editGeometryAfterReproject: function (result) {
            query('#av_v2_btnSaveGeo').removeClass('hidePage');
            query('#av_v2_btnCancel').removeClass('hidePage');
            query('#av_v2_btnGeo').addClass('hidePage');

            this.editToolbar = new Edit(this.options.map);

            //console.log(this.geometry);

            this.editToolbar.activate(Edit.EDIT_VERTICES, new Graphic(result[0], this.simpleFillSymbol));

            this.tbEvent = this.editToolbar.on("deactivate", lang.hitch(this, this.saveEditGeometry));

            this.options.map.disableMapNavigation();
        },

        saveGeometry: function () {
            query('#av_v2_btnSaveGeo').addClass('hidePage');
            query('#av_v2_btnCancel').addClass('hidePage');
            query('#av_v2_btnGeo').removeClass('hidePage');

            this.showValidSite('');


            this.options.map.enableMapNavigation();
            this.editToolbar.deactivate();
        },

        cancelGeometry: function () {
            if (this.editToolbar != null)
                this.editToolbar.deactivate();

            if (this.tb != null)
                this.tb.deactivate();

            this.options.map.enableMapNavigation();

            if (this.tbEvent != null)
                this.tbEvent.remove();

            this.options.map.graphics.clear();

            query('#av_v2_btnSaveGeo').addClass('hidePage');
            query('#av_v2_btnCancel').addClass('hidePage');
            query('#av_v2_btnGeo').removeClass('hidePage');
        },

        saveEditGeometry: function (evt) {
            this.options.map.graphics.clear();
            this.options.map.graphics.add(evt.graphic);
            this.geometry = evt.graphic.geometry;
        },

        addGraphic: function (evt) {
            var map = this.options.map;
            var tb = this.tb;

            this.tb.deactivate();
            this.options.map.enableMapNavigation();

            this.tbEvent.remove();

            this.options.map.graphics.add(new Graphic(evt.geometry, this.simpleFillSymbol));

            this.geometry = evt.geometry;

            console.log("AG/Event", evt);

            //build a search extent
            var ext = evt.geometry.getExtent();
            ext.xmin = ext.xmin - this.searchBuffer;
            ext.ymin = ext.ymin - this.searchBuffer;
            ext.xmax = ext.xmax + this.searchBuffer;
            ext.ymax = ext.ymax + this.searchBuffer;

            console.log("AG/Extent", evt);

            // Check for neighboring sites
            var qry = new Query();
            qry.returnGeometry = true;
            qry.outFields = ["*"];
            qry.geometry = ext;
            qry.spatialRelationship = Query.SPATIAL_REL_INTERSECTS;

            var qt = new QueryTask(this.options.archsiteLayerUrl);
            qt.execute(qry, lang.hitch(this, this.onAddGraphicQuery), function (err) {
                console.log(err);
                alert("Error querying surrounding sites");
            });
        },

        onAddGraphicQuery: function (results) {
            console.log("OAGQ", results);
            var _self = this;
            //Check to see if there are site around the location
            if (results.features.length > 0) {
                var j = 0;
                _self.resultList = [];

                var msg = "There are " + results.features.length + " site within " + this.searchBuffer + " m of the currently drawn site.  ";
                msg += "You can create the new site or revisit one of the sites below.";

                var node = dojo.byId("av_v_11_msg");
                if (node) {
                    node.innerHTML = msg;

                }

                arr.forEach(results.features, function (entry) {
                    var obj = { 'id': j, 'extent': entry.geometry.getExtent(), 'geometry': entry.geometry, 'attributes': entry.attributes };
                    _self.resultList.push(obj);

                    var row;
                    row = _self.v_11_revistList.appendChild(document.createElement('div'));
                    row.id = "site_" + j;
                    dojo.addClass(row, "siteItem");

                    if (j < (results.features.length - 1)) {
                        dojo.addClass(row, "middleItem");
                    }

                    var sitename = "";
                    var project = "";

                    if (entry.attributes.SITENUMBER == null)
                        project = "Site Number is not defined";
                    else
                        project = entry.attributes.SITENUMBER;

                    if (project.length > 24) {
                        project = project.substring(0, 24) + "...";
                    }


                    if (entry.attributes.RECORDEDDATE == null)
                        sitename = "";
                    else
                        sitename = _self.formatDate(new Date(entry.attributes.RECORDEDDATE));

                    var siteinfo = document.createElement('div');
                    domStyle.set(siteinfo, "float", "left");

                    siteinfo.innerHTML = "<div class='itemDesc'><span class='titleText' >" + project + "</span></div><div class='subText' style='clear:left'>" + sitename + "</div>"

                    row.appendChild(siteinfo);

                    var buttons = document.createElement('div');

                    var html = "";

                    html += "<span id='av_v_11_revisitButton_" + j + "'>Revisit</span>";

                    var rButton = dojo.byId("av_v_11_revisitButton_" + j);
                    if (rButton) {

                        on(rButton, "click", lang.hitch(this, function (e) {
                            var elem = e.target.id;
                            var id = elem.substring(elem.indexOf('_') + 1, elem.length);
                            _self.editSite(id, "R");
                        }));
                    }

                    j++;
                });

                _self.setView(11);
            }
            else {
                _self.doQueriesAutopopulate();
            }
        },

        doQueriesAutopopulate: function () {
            console.log("DQAP");
            this.toggleEditModeButton("E");
            this.showValidSite('');

            if (this.currentView != 2)
                this.setView(2);

            esri.config.defaults.io.proxyUrl = this.options.proxyUrl;

            this.qUTM.returnGeometry = this.qPhyReg.returnGeometry = this.qCounty.returnGeometry = false;
            this.qUTM.outFields = this.qPhyReg.outFields = this.qCounty.outFields = ["*"];
            this.qUTM.geometry = this.qPhyReg.geometry = this.qCounty.geometry = this.geometry;
            this.qUTM.spatialRelationship = this.qPhyReg.spatialRelationship = this.qCounty.spatialRelationship = Query.SPATIAL_REL_INTERSECTS;

            var utm = this.qtUTM.execute(this.qUTM);
            var pregs = this.qtPhyReg.execute(this.qPhyReg);
            var county = this.qtCounty.execute(this.qCounty);

            promises = new all([utm, pregs, county]);
            promises.then(this.handleQueryResults);

            var queryObj = {
                f: "json",
                geometry: dojo.toJson(this.geometry.toJson()),
                geometryType: "esriGeometryPolygon",
                inSR: "102100",
                outFields: "*",
                outSR: "102100",
                returnGeometry: "false",
                spatialRel: "esriSpatialRelIntersects",
                where: ""
            };

            //var urls = "http://server.arcgisonline.com/ArcGIS/rest/services/Specialty/Soil_Survey_Map/MapServer/0/query?f=json&where=&returnGeometry=false&spatialRel=esriSpatialRelIntersects&geometry={'rings':[[[-9032346.271369405,4078678.371379903],[-9028677.294011718,4088462.311000403],[-9012778.392128406,4088462.311000403],[-8987095.550624594,4067671.4393068408],[-9012778.392128406,4034650.6430876534],[-9039684.22608478,4043211.590255591],[-9032346.271369405,4078678.371379903]]],'spatialReference':{'wkid':102100}}&geometryType=esriGeometryPolygon&inSR=102100&outFields=*&outSR=102100";
            //var urls = "http://server.arcgisonline.com/ArcGIS/rest/services/Specialty/Soil_Survey_Map/MapServer/0/query";
            //var url = esri.urlToObject(urls);

            console.log("AG/request");
            var soilsHandle = esri.request({
                url: this.soilUrl + "/query",
                content: queryObj
            });
            soilsHandle.then(lang.hitch(this, function (response, io) {
                console.log("AG/Succeeded: ", response);
                var soilStr = "";
                var soilList = []
                for (var i = 0; i < response.features.length; i++) {
                    var isExists = false;
                    for (var j = 0; j < soilList.length; j++) {
                        if (soilList[j] == response.features[i].attributes.musym) {
                            isExists = true;
                            break;

                        }
                    }

                    if (isExists == false) {
                        soilList.push(response.features[i].attributes.musym);
                    }
                }

                var comma = "";
                for (i = 0; i < soilList.length; i++) {
                    soilStr += comma + soilList[i];
                    comma = ",";
                }

                if (soilStr.length > 50) {
                    soilStr = soilStr.substr(0, 49);
                }

                dijit.byId("av_SOILCLASSIFICATION").set("value", soilStr);

            }), function (error, io) { console.log("AG/SOIL/Failed: ", error); });


            var quadHandle = esri.request({
                url: this.quadUrl + "/query",
                content: queryObj
            });
            quadHandle.then(lang.hitch(this, function (response, io) {
                console.log("AG/QUAD", response);
                if (response.features.length > 0) {
                    dijit.byId("av_USGSQUADRANGLE").set("value", response.features[0].attributes.CELL_NAME);
                }
            }), function (error, io) { console.log("AG/QUAD/Failed: ", error); });

            this.reprojectWebMercator2Nad27(this.geometry);
        },

        handleQueryResults: function (results) {
            console.log("handleQueryResults: ", results);
            var utm, soils, county;

            // make sure both queries finished successfully
            if (!results[0].hasOwnProperty("features")) {
                console.log("HQR/UTM query failed.");
            }

            if (!results[1].hasOwnProperty("features")) {
                console.log("HQR/Phy Regions query failed.");
            }


            if (!results[2].hasOwnProperty("features")) {
                console.log("HQR/County query failed.");
            }

            // results from deferred lists are returned in the order they were created
            // so parcel results are first in the array and buildings results are second
            utm = results[0].features;
            pregs = results[1].features;
            county = results[2].features;


            // add the results to the map
            arr.forEach(utm, function (feat) {
                var tb = dijit.byId('av_UTMZONE');
                tb.set("value", feat.attributes.ZONE);
            });

            arr.forEach(pregs, function (feat) {
                dijit.byId('av_PROVINCE').set("value", feat.attributes.PROVINCE);
            });

            arr.forEach(county, function (feat) {
                dijit.byId('av_COUNTY').set("value", feat.attributes.CNAME);
            });


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
                var tb = dijit.byId("av_attrSearch");
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
            var grid = _self.av_searchList;
            console.log("doSearch", _self.options.archsiteLayerUrl);
            var qt = new QueryTask(_self.options.archsiteLayerUrl);
            var qry = new Query();
            if (attr != null) {
                console.log("DS/ATTR", attr);
                qry.where = "SITENUMBER LIKE '%" + attr + "%'";
            }
            else if (geo != null) {
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

        saveRecord: function () {


            this.fcValues["RECORD_OWNER"] = this.options.userid;

            this.fcValues["STATE"] = "SC";

            var item;
            //console.log("FCLENGTH", this.fc.length);
            for (var i = 0; i < this.fc.length; i++) {
                item = this.fc[i];

                switch (item.type) {
                    case "esriFieldTypeString":
                        if (dojo.query("#av_" + item.name).length > 0)
                            if (item.inputtype == "checkbox") {

                                if (dojo.query("#av_" + item.name).attr('checked')[0] == true) {
                                    this.fcValues[item.name] = dojo.query("#av_" + item.name).attr('value')[0];
                                }
                            }
                            else {
                                this.fcValues[item.name] = dojo.query("#av_" + item.name).attr('value')[0];
                            }
                        break;
                    case "esriFieldTypeSmallInteger":

                        if (dojo.query("#av_" + item.name).length > 0)
                            this.fcValues[item.name] = Number(dojo.query("#av_" + item.name).attr('value')[0]);
                        break;
                    case "esriFieldTypeInteger":

                        if (dojo.query("#av_" + item.name).length > 0)
                            this.fcValues[item.name] = Number(dojo.query("#av_" + item.name).attr('value')[0]);
                        break;
                    case "esriFieldTypeDouble":
                        if (dojo.query("#av_" + item.name).length > 0)
                            this.fcValues[item.name] = Number(dojo.query("#av_" + item.name).attr('value')[0]);
                        break;
                    case "esriFieldTypeDate":
                        if (dojo.query("#av_" + item.name).length > 0) {
                            var dbdate = dojo.query("#av_" + item.name).attr('value')[0];
                            if (dbdate != null) {
                                this.fcValues[item.name] = this.convertDateDojoToDb(dbdate);
                            }

                        }
                        break;
                    default:
                        break;
                }
            }

            var geo;

            if (this.geometry == null) {
                this.fcValues["GEO_VALID"] = "N";
                var polygonJson = { "rings": [[[-9022497.431674672, 4027971.4763043914], [-9022511.763617475, 4028095.6864753584], [-9022368.444189437, 4028110.018418162], [-9022349.334932365, 4027995.362875731], [-9022483.099731868, 4027961.9216758558], [-9022497.431674672, 4027971.4763043914]]], "spatialReference": { "wkid": 102100 } };
                geo = new Polygon(polygonJson);
            }
            else {
                this.fcValues["GEO_VALID"] = "Y";
                geo = this.geometry;
            }

            console.log("GEOMETRY", geo.toJson());
            console.log("SR/Attrs", this.fcValues);

            var gra = new Graphic(geo, null, this.fcValues);
            //var gra = new Graphic(geo, null, {});


            if (this.fcValues["OBJECTID"] == null) {
                console.log("SR/Insert", gra);
                this.draftFeatureLayer.applyEdits([gra], null, null, null, function (e) {
                    console.log(e.name + ": " + e.message, e);
                });
            }
            else {
                console.log("SR/Update", gra);
                this.draftFeatureLayer.applyEdits(null, [gra], null);
            }
        },

        saveRecordAsPublished: function () {
            var _self = this;
            console.log("SaveRecordAsPublished")

            _self.toolMode = "FP";

            _self.fcValues["STATUS"] = "P";

            if (_self.geometry != null) {
                var gra = new Graphic(_self.geometry, null, _self.fcValues);

                console.log("SRAP/ApplyEdits");
                this.draftFeatureLayer.applyEdits(null, [gra], null);
            }
            else {
                this.showMessageView("Geometry is null.", 2);
            }
        },

        convertDateDojoToDb: function (val) {
            //console.log(val);
            parts = val.split("/");
            var returnDate = parts[2] + "-" + parts[0] + "-" + parts[1] + " 12:00:00 AM";
            //console.log("returnDate", returnDate);
            return returnDate;
        },

        saveRelatedLayer: function () {
            var drValues = this.processDataRecovRelated();
            var tuValues = this.processTestingUnitsRelated();
            var euValues = this.processExcavUnitsRelated();

            console.log("SRL/drValues", drValues);
            console.log("SRL/tuValues", tuValues);
            console.log("SRL/euValues", euValues);

            var dlDR = this.draftDataRecovTable.applyEdits(drValues.adds, drValues.updates, drValues.deletes);
            var dlTU = this.draftTestUnitTable.applyEdits(tuValues.adds, tuValues.updates, tuValues.deletes);
            var dlEU = this.draftExcavUnitTable.applyEdits(euValues.adds, euValues.updates, euValues.deletes);

            promises = new all([dlDR, dlTU, dlEU]);
            promises.then(this.onRelEditsComplete);

        },

        processDataRecovRelated: function () {

            var dataRecovArray = this.fcValues["DATARECOV"];
            var c = 0;
            var adds = [];
            var deletes = [];
            var updates = [];
            var nochanges = [];
            var edits = [];

            //Data Recoverd Items

            var table = dojo.byId("av_DataRecovered");
            for (var p = 0; p < table.rows.length; p++) {
                if (table.rows[p] != null) {
                    if (table.rows[p].id.indexOf("_") > -1) {
                        var parts = table.rows[p].id.split("_");
                        var id = parts[parts.length - 1];

                        //var children = dojo.query("#av_DataRecovered").children();

                        //for (var p = 0; p < children.length; p++) {
                        //var parts = children[p].id.split("_");
                        // var id = parts[parts.length - 1];
                        var isExists = false;

                        if (dataRecovArray != null) {
                            for (var i = 0; i < dataRecovArray.length; i++) {

                                var dr = dataRecovArray[i];
                                isExists = false;

                                if (dr.attributes.SITEID == this.fcValues["SITEID"] &&
                                        dr.attributes.MaterialsRecovered == dijit.byId("av_dr_txt_" + id).get("value") &&
                                        dr.attributes.NUMBEROFARTIFACTS != dijit.byId("av_dr_num_" + id).get("value")) {

                                    dr.attributes.NUMBEROFARTIFACTS = dijit.byId("av_dr_num_" + id).get("value");
                                    dataRecovArray[i].NUMBEROFARTIFACTS = dijit.byId("av_dr_num_" + id).get("value");
                                    updates.push(dr);

                                    //console.log("UPDATE", dr);

                                    isExists = true;
                                    break;
                                }
                                else if (dr.attributes.SITEID == this.fcValues["SITEID"] &&
                                        dr.attributes.MaterialsRecovered == dijit.byId("av_dr_txt_" + id).get("value") &&
                                        dr.attributes.NUMBEROFARTIFACTS == dijit.byId("av_dr_num_" + id).get("value")) {

                                    //console.log("NO UPDATE", dr);
                                    nochanges.push(dr);
                                    isExists = true;
                                    break;
                                }


                            }
                        }
                        else {
                            console.log("DATARECOV IS NULL", dataRecovArray);
                        }

                        //Add new ones that don't exist
                        if (isExists == false) {
                            if (dataRecovArray == null) {
                                dataRecovArray = [];
                            }

                            var attrs = { attributes: { SITEID: this.fcValues["SITEID"], NUMBEROFARTIFACTS: dijit.byId("av_dr_num_" + id).get("value"), MaterialsRecovered: dijit.byId("av_dr_txt_" + id).get("value"), RECORD_OWNER: "ArchSiteAdmin", EDITED_DATE: this.getDateNow("-") } };

                            adds.push(attrs);
                            dataRecovArray.push(attrs);
                        }

                        c++;
                    }

                    if (dataRecovArray != null) {
                        //Now remove ones that may no longer exist

                        for (var i = 0; i < dataRecovArray.length; i++) {

                            var dr = dataRecovArray[i];

                            var isExists = false;

                            for (var m = 0; m < updates.length; m++) {
                                if (dr.attributes.NUMBEROFARTIFACTS == updates[m].attributes.NUMBEROFARTIFACTS &&
                                    dr.attributes.MaterialsRecovered == updates[m].attributes.MaterialsRecovered) {
                                    isExists = true;
                                    break;
                                }
                                else if (dr.attributes.NUMBEROFARTIFACTS != updates[m].attributes.NUMBEROFARTIFACTS &&
                                    dr.attributes.MaterialsRecovered == updates[m].attributes.MaterialsRecovered) {
                                    isExists = true;
                                    break;
                                }
                            }

                            for (m = 0; m < nochanges.length; m++) {
                                if (dr.attributes.NUMBEROFARTIFACTS == nochanges[m].attributes.NUMBEROFARTIFACTS &&
                                    dr.attributes.MaterialsRecovered == nochanges[m].attributes.MaterialsRecovered) {
                                    isExists = true;
                                    break;
                                }
                            }

                            for (m = 0; m < adds.length; m++) {
                                if (dr.attributes.NUMBEROFARTIFACTS == adds[m].attributes.NUMBEROFARTIFACTS &&
                                    dr.attributes.MaterialsRecovered == adds[m].attributes.MaterialsRecovered) {
                                    isExists = true;
                                    break;
                                }
                            }

                            if (isExists == false) {
                                deletes.push(dr);

                            }
                        }

                        if (deletes.length > 0) {
                            for (var d = 0; d < deletes.length; d++) {
                                var id = -1;
                                for (i = 0; i < dataRecovArray.length; i++) {
                                    if (deletes[d].attributes.NUMBEROFARTIFACTS == dataRecovArray[i].attributes.NUMBEROFARTIFACTS &&
                                        deletes[d].attributes.MaterialsRecovered == dataRecovArray[i].attributes.MaterialsRecovered) {
                                        id = i;
                                        break;
                                    }
                                }

                                if (id > -1) {
                                    dataRecovArray.splice(id, 1);
                                }
                            }
                        }
                    }  //end if indexOf
                } //end if null
            }  //end for

            this.fcValues["DATARECOV"] = dataRecovArray;

            if (adds.length == 0) {
                adds = null;
            }

            if (updates.length == 0) {
                updates = null;
            }

            if (deletes.length == 0) {
                deletes = null;
            }

            edits.push({ 'adds': adds });
            edits.push({ 'updates': updates });
            edits.push({ 'deletes': deletes });

            return edits;
        },

        processTestingUnitsRelated: function () {

            var testUnitArray = this.fcValues["TESTINGUNITS"];
            var c = 0;
            var adds = [];
            var deletes = [];
            var updates = [];
            var nochanges = [];
            var edits = [];

            //Data Recoverd Items
            var children = dojo.query("#av_TestUnits").children();

            for (var p = 0; p < children.length; p++) {
                var parts = children[p].id.split("_");
                var id = parts[parts.length - 1];
                var isExists = false;

                //If there are existing entries
                if (testUnitArray != null) {
                    for (var i = 0; i < testUnitArray.length; i++) {

                        var dr = testUnitArray[i];
                        isExists = false;

                        if (dr.attributes.SITEID == this.fcValues["SITEID"] &&
                            dr.attributes.NUMBER == dijit.byId("av_tu_num_" + id).get("value") &&
                            dr.attributes.MAXDEPTH == dijit.byId("av_tu_depth_" + id).get("value") &&
                            dr.attributes.TESTINGMETHODTYPE == dijit.byId("av_tu_tmt_" + id).get("value") &&
                            dr.attributes.OTHER == dijit.byId("av_tu_other_" + id).get("value") &&
                            dr.attributes.SIZE == dijit.byId("av_tu_size_" + id).get("value")) {

                            nochanges.push(dr);
                            isExists = true;
                            break;
                        }

                    }
                }
                else {
                    console.log("TESTINGUNIT IS NULL", testUnitArray);
                }

                //Add new ones that don't exist
                if (isExists == false) {
                    if (testUnitArray == null) {
                        testUnitArray = [];
                    }

                    var attrs = {
                        attributes: {
                            SITEID: this.fcValues["SITEID"],
                            NUMBER: dijit.byId("av_tu_num_" + id).get("value"),
                            SIZE: dijit.byId("av_tu_size_" + id).get("value"),
                            MAXDEPTH: dijit.byId("av_tu_depth_" + id).get("value"),
                            TESTINGMETHODTYPE: dijit.byId("av_tu_tmt_" + id).get("value"),
                            OTHER: dijit.byId("av_tu_other_" + id).get("value")
                        }
                    };

                    adds.push(attrs);
                    testUnitArray.push(attrs);
                }

                c++;
            }

            if (testUnitArray != null) {
                //Now remove ones that may no longer exist

                for (var i = 0; i < testUnitArray.length; i++) {

                    var dr = testUnitArray[i];

                    var isExists = false;

                    /*for (var m = 0; m < updates.length; m++) {
                        if (dr.attributes.NUMBEROFARTIFACTS == updates[m].attributes.NUMBEROFARTIFACTS &&
                            dr.attributes.MaterialsRecovered == updates[m].attributes.MaterialsRecovered) {
                            isExists = true;
                            break;
                        }
                        else if (dr.attributes.NUMBEROFARTIFACTS != updates[m].attributes.NUMBEROFARTIFACTS &&
                            dr.attributes.MaterialsRecovered == updates[m].attributes.MaterialsRecovered) {
                            isExists = true;
                            break;
                        }
                    }*/

                    for (m = 0; m < nochanges.length; m++) {
                        if (dr.attributes.NUMBER == nochanges[m].attributes.NUMBER &&
                            dr.attributes.SIZE == nochanges[m].attributes.SIZE &&
                            dr.attributes.MAXDEPTH == nochanges[m].attributes.MAXDEPTH &&
                            dr.attributes.TESTINGMETHODTYPE == nochanges[m].attributes.TESTINGMETHODTYPE &&
                            dr.attributes.OTHER == nochanges[m].attributes.OTHER) {
                            isExists = true;
                            break;
                        }
                    }

                    for (m = 0; m < adds.length; m++) {
                        if (dr.attributes.NUMBER == adds[m].attributes.NUMBER &&
                            dr.attributes.SIZE == adds[m].attributes.SIZE &&
                            dr.attributes.MAXDEPTH == adds[m].attributes.MAXDEPTH &&
                            dr.attributes.TESTINGMETHODTYPE == adds[m].attributes.TESTINGMETHODTYPE &&
                            dr.attributes.OTHER == adds[m].attributes.OTHER) {
                            isExists = true;
                            break;
                        }
                    }

                    if (isExists == false) {
                        deletes.push(dr);

                    }
                }

                if (deletes.length > 0) {
                    for (var d = 0; d < deletes.length; d++) {
                        var id = -1;
                        for (i = 0; i < testUnitArray.length; i++) {
                            if (deletes[d].attributes.NUMBER == testUnitArray[i].attributes.NUMBER &&
                                deletes[d].attributes.SIZE == testUnitArray[i].attributes.SIZE &&
                                deletes[d].attributes.MAXDEPTH == testUnitArray[i].attributes.MAXDEPTH &&
                                deletes[d].attributes.TESTINGMETHODTYPE == testUnitArray[i].attributes.TESTINGMETHODTYPE &&
                                deletes[d].attributes.OTHER == testUnitArray[i].attributes.OTHER) {
                                id = i;
                                break;
                            }
                        }

                        if (id > -1) {
                            testUnitArray.splice(id, 1);
                        }
                    }
                }
            }

            this.fcValues["TESTINGUNITS"] = testUnitArray;

            if (adds.length == 0) {
                adds = null;
            }

            if (updates.length == 0) {
                updates = null;
            }

            if (deletes.length == 0) {
                deletes = null;
            }

            edits.push({ 'adds': adds });
            edits.push({ 'updates': updates });
            edits.push({ 'deletes': deletes });

            return edits;
        },

        processExcavUnitsRelated: function () {

            var excavUnitArray = this.fcValues["EXCAVATIONUNITS"];
            var c = 0;
            var adds = [];
            var deletes = [];
            var updates = [];
            var nochanges = [];
            var edits = [];

            //Data Recoverd Items
            var children = dojo.query("#av_ExcavUnits").children();

            for (var p = 0; p < children.length; p++) {
                var parts = children[p].id.split("_");
                var id = parts[parts.length - 1];
                var isExists = false;

                //If there are existing entries
                if (excavUnitArray != null) {
                    for (var i = 0; i < excavUnitArray.length; i++) {

                        var dr = excavUnitArray[i];
                        isExists = false;

                        if (dr.attributes.SITEID == this.fcValues["SITEID"] &&
                            dr.attributes.NUMBER == dijit.byId("av_eu_num_" + id).get("value") &&
                            dr.attributes.MAXDEPTH == dijit.byId("av_eu_depth_" + id).get("value") &&
                            dr.attributes.COMMENTS == dijit.byId("av_eu_com_" + id).get("value") &&
                            dr.attributes.SIZE == dijit.byId("av_eu_size_" + id).get("value")) {

                            nochanges.push(dr);
                            isExists = true;
                            break;
                        }

                    }
                }
                else {
                    console.log("EXCAVATIONUNIT IS NULL", excavUnitArray);
                }

                //Add new ones that don't exist
                if (isExists == false) {
                    if (excavUnitArray == null) {
                        excavUnitArray = [];
                    }

                    var attrs = {
                        attributes: {
                            SITEID: this.fcValues["SITEID"],
                            NUMBER: dijit.byId("av_tu_num_" + id).get("value"),
                            SIZE: dijit.byId("av_tu_size_" + id).get("value"),
                            MAXDEPTH: dijit.byId("av_tu_depth_" + id).get("value"),
                            COMMENTS: dijit.byId("av_tu_com_" + id).get("value")
                        }
                    };

                    adds.push(attrs);
                    excavUnitArray.push(attrs);
                }

                c++;
            }

            if (excavUnitArray != null) {
                //Now remove ones that may no longer exist

                for (var i = 0; i < excavUnitArray.length; i++) {

                    var dr = excavUnitArray[i];

                    var isExists = false;

                    for (m = 0; m < nochanges.length; m++) {
                        if (dr.attributes.NUMBER == nochanges[m].attributes.NUMBER &&
                            dr.attributes.SIZE == nochanges[m].attributes.SIZE &&
                            dr.attributes.MAXDEPTH == nochanges[m].attributes.MAXDEPTH &&
                            dr.attributes.COMMENTS == nochanges[m].attributes.COMMENTS) {
                            isExists = true;
                            break;
                        }
                    }

                    for (m = 0; m < adds.length; m++) {
                        if (dr.attributes.NUMBER == adds[m].attributes.NUMBER &&
                            dr.attributes.SIZE == adds[m].attributes.SIZE &&
                            dr.attributes.MAXDEPTH == adds[m].attributes.MAXDEPTH &&
                            dr.attributes.COMMENTS == adds[m].attributes.COMMENTS) {
                            isExists = true;
                            break;
                        }
                    }

                    if (isExists == false) {
                        deletes.push(dr);

                    }
                }

                if (deletes.length > 0) {
                    for (var d = 0; d < deletes.length; d++) {
                        var id = -1;
                        for (i = 0; i < excavUnitArray.length; i++) {
                            if (deletes[d].attributes.NUMBER == excavUnitArray[i].attributes.NUMBER &&
                                deletes[d].attributes.SIZE == excavUnitArray[i].attributes.SIZE &&
                                deletes[d].attributes.MAXDEPTH == excavUnitArray[i].attributes.MAXDEPTH &&
                                deletes[d].attributes.COMMENTS == excavUnitArray[i].attributes.COMMENTS) {
                                id = i;
                                break;
                            }
                        }

                        if (id > -1) {
                            excavUnitArray.splice(id, 1);
                        }
                    }
                }
            }

            this.fcValues["EXCAVATIONUNITS"] = excavUnitArray;

            if (adds.length == 0) {
                adds = null;
            }

            if (updates.length == 0) {
                updates = null;
            }

            if (deletes.length == 0) {
                deletes = null;
            }

            edits.push({ 'adds': adds });
            edits.push({ 'updates': updates });
            edits.push({ 'deletes': deletes });

            return edits;
        },

        approveSites: function () {
            //var sites = query(".av_adm_chk");

            //var ids = []

            /*for (var i = 0; i < sites.length; i++) {
                var node = sites[i];
                if (node.checked == true) {
                    ids.push(elem.substring(elem.lastIndexOf('_') + 1, elem.length));
                }
            }

            var graColl = [];

            for (var i = 0; i < ids.length; i++) {
                this.siteList[ids[i]].attributes.SITEENTEREDINDBDATE = "";

                var gra = new Graphic(this.siteList[ids[i]].geometry, null, this.siteList[ids[i]].attributes);
                graColl.push(gra);
                break;     
            }*/

            if (graColl.length > 0) {
                this.approveSitesList = graColl;
                this.prodFeatureLayer.applyEdits(graColl, null, null, lang.hitch(this, function () {
                    this.draftProdMode = true;
                    this.draftFeatureLayer.applyEdits(null, null, this.approveSitesList);

                }), function (error) {
                    console.log("AS/error saving to prod");
                });
            }

        },

        reviewSite: function (id) {
            var _self = this;

            this.fcValues = _self.siteList[id].attributes;
            this.geometry = _self.siteList[id].geometry;

            //Autopopulate the SiteNumber and SiteId
            var qry = new Query();
            qry.where = "COUNTY = '" + _self.siteList[id].attributes.COUNTY + "'";
            _self.draftCountyCodesTable.queryFeatures(qry);

            dijit.byId('SITEENTEREDINDBDATE').set("value", _self.getDateNow("-"));

            _self.setView(10);

        },

        rejectSite: function () {
            var _self = this;

            var attrs = { 'OBJECTID': this.fcValues.OBJECTID, 'STATUS': 'D' };

            var gra = new Graphic(this.geometry, null, attrs);

            this.dflEvent.remove();

            console.log("RS/ApplyEdits");
            this.draftFeatureLayer.applyEdits(null, [gra], null, lang.hitch(this, function (result) {
                console.log("RS/EDITRESULTS", result);
                if (result.updates.length > 0) {
                    if (result.updates[0].success == true) {
                        console.log("RS/REJECT/SUCCESS");
                        //TODO: Send email
                    }
                    else {
                        console.log("RS/REJECT/FAILURE");
                    }
                }
                _self.dflEvent = _self.draftFeatureLayer.on("edits-complete", lang.hitch(_self, _self.onEditsComplete));

                _self.getWaitList();

                _self.setView(9);
            }));

        },

        approveSite: function () {
            var _self = this;

            var attrs = { 'OBJECTID': this.fcValues.OBJECTID, 'STATUS': 'A' };

            var gra = new Graphic(this.geometry, null, attrs);

            this.dflEvent.remove();

            console.log("AS/ApplyEdits");
            this.draftFeatureLayer.applyEdits(null, [gra], null, lang.hitch(this, function (result) {
                console.log("AS/DFLEDITSRESULTS", result);
                var gra = new Graphic(null, null, _self.ccodes[_self.ccodes[_self.fcValues.COUNTY]]);
                console.log("AS/COUNTYATTRS", gra);

                if (result.length > 0) {
                    if (result[0].success == true) {
                        console.log("RS/APPROVE/SUCCESS");
                        this.draftCountyCodesTable.applyEdits(null, [gra], null, lang.hitch(this, function (cresult) {
                            console.log("AS/CCDITSRESULTS", cresult);
                            _self.dflEvent = _self.draftFeatureLayer.on("edits-complete", lang.hitch(_self, _self.onEditsComplete));
                        }), function (e) {
                            console.log("Error saving to County Codes table");
                        });
                    }
                    else {
                        console.log("RS/APPROVE/FAILURE");
                    }
                }

                _self.getWaitList();

                _self.setView(9);

            }), function (e) {
                console.log("Error saving approval information", e.message);
            });



        },

        verifyRecord: function () {
            console.log("VR");
            var isValid = true;
            var numTrue = 0;
            var errLiStr = ""

            //Clean out previous errors
            this.v_6_errors.domNode.innerHTML = '';

            //console.log("Checked?: " + dojo.query("#" + item.name).attr('checked')[0]);

            //PROJECT
            if (dijit.byId("av_PROJECT").get("value") == "") {
                errLiStr += this.createErrorItem("Please specify a project name");
                isValid = false;
            }

            console.log("GPS", dijit.byId("av_GPSEASTING"));

            //EASTING
            if (dijit.byId("av_GPSEASTING").get("value") == "NaN") {
                errLiStr += this.createErrorItem("Please specify an easting");
                isValid = false;
            }


            //NORTHING
            if (dijit.byId("av_GPSNORTHING").get("value") == "Nan") {
                errLiStr += this.createErrorItem("Please specify a northing");
                isValid = false;
            }


            //ARCH INVESTGATION
            numTrue = 0
            dojo.forEach(query("#av_chks_dst input"), lang.hitch(this, function (input) {
                if (input.checked == true) {
                    numTrue++;
                }
            }));

            if (numTrue == 0) {
                errLiStr += this.createErrorItem("Please choose an Archaeological Investigation");
                isValid = false;
            }

            //National Register of Historic Places status:
            numTrue = 0
            dojo.forEach(query("#av_chks_nr input"), lang.hitch(this, function (input) {
                if (input.checked == true) {
                    numTrue++;
                }
            }));

            if (numTrue == 0) {
                errLiStr += this.createErrorItem("Please choose a Current National Register of Historic Places status");
                isValid = false;
            }

            //LANDFORMLOCATION
            if (dijit.byId("av_LANDFORMLOCATION").get("value") == "") {
                errLiStr += this.createErrorItem("Please specify a Landform Location");
                isValid = false;
            }

            //NEARESTRIVERSTREAM
            if (dijit.byId("av_NEARESTRIVERSTREAM").get("value") == "") {
                errLiStr += this.createErrorItem("Please specify a Nearest River/Stream");
                isValid = false;
            }

            //CURRENT VEGETATION
            numTrue = 0
            dojo.forEach(query("#av_chks_cv input"), lang.hitch(this, function (input) {
                if (input.checked == true) {
                    numTrue++;
                }
            }));

            if (numTrue == 0) {
                errLiStr += this.createErrorItem("Please choose a Current Vegetation");
                isValid = false;
            }

            //SITEDEPTH
            if (dijit.byId("av_SITEDEPTH").get("value") == "Nan") {
                errLiStr += this.createErrorItem("Please specify a site depth");
                isValid = false;
            }


            //GENERALSITEDESCRIPTION
            if (dijit.byId("av_GENERALSITEDESCRIPTION").get("value") == "") {
                errLiStr += this.createErrorItem("Please specify a General Site Description");
                isValid = false;
            }

            //Arch Components
            numTrue = 0
            dojo.forEach(query("#av_chks_ac input"), lang.hitch(this, function (input) {
                if (input.checked == true) {
                    numTrue++;
                }
            }));

            if (numTrue == 0) {
                errLiStr += this.createErrorItem("Please choose an Archaeological Component");
                isValid = false;
            }

            //Recommend Future Work
            numTrue = 0
            dojo.forEach(query("#av_chks_rfw input"), lang.hitch(this, function (input) {
                if (input.checked == true) {
                    numTrue++;
                }
            }));

            if (numTrue == 0) {
                errLiStr += this.createErrorItem("Please choose a Future Work");
                isValid = false;
            }

            if (!isValid) {
                errLiStr = "<ul>" + errLiStr + "</ul>"
                domConstruct.create("div", { innerHTML: errLiStr }, this.v_6_errors.domNode);
            }

            console.log("ISVALID", isValid);

            return isValid;
        },

        createErrorItem: function (msg) {

            return "<li>" + msg + "</li>";
        },

        onError: function (error) {
            console.log("onError: ", error);
        },

        onEditsComplete: function (results) {
            var _self = this;

            console.log("onEditsComplete:", results);

            this.returnPage = 2;
            var msg = "";

            if (results.adds.length > 0) {
                console.log("OEC/ADDS", results.adds[0]);
                if (results.adds[0].success == true) {

                    _self.fcValues["OBJECTID"] = results.adds[0].objectId;
                    msg = "Feature has been saved";

                    _self.options.map.graphics.clear();
                    _self.draftFeatureLayer.refresh();

                    if (this.toolMode == "D" || this.toolMode == "P") {
                        //See if there any edits to the 1-M tables
                        if (_self.dataRecovCount > 0 || _self.testUnitCount > 0 || _self.excavUnitCount > 0) {
                            _self.saveRelatedLayer();
                        }
                        else {
                            if (this.toolMode == "P") {
                                console.log("OEC/Adds/Publish");
                                _self.publishFeatureAfterSave();
                            }
                        }
                    }
                }
                else {
                    msg = "Failure to save feature";
                }


            }

            if (results.updates.length > 0) {
                console.log("OEC/UPDATES", results.updates[0]);
                if (results.updates[0].success == true) {

                    msg = "Feature has been saved";

                    _self.options.map.graphics.clear();
                    _self.draftFeatureLayer.refresh();

                    if (this.toolMode == "D" || this.toolMode == "P") {
                        if (_self.dataRecovCount > 0 || _self.testUnitCount > 0 || _self.excavUnitCount > 0) {
                            _self.saveRelatedLayer();
                        }
                        else {
                            if (this.toolMode == "P") {
                                console.log("OEC/Updates/Publish");
                                _self.publishFeatureAfterSave();
                            }
                        }
                    }
                }
                else {
                    msg = "Failure to save feature";
                }
            }

            if (results.deletes.length > 0) {
                this.approveSitesList = null;
                this.draftProdMode = false;
                _self.getWaitList();
                msg = "Sites have been moved to production";
                this.returnPage = 9;
            }

            if (this.toolMode == "FP") {
                console.log("OEC/STATUS=P/PUBLISH");
                this.resetWidget();
                console.log("OEC/SMV");
                this.showMessageView("Your site form has been sent to SCIAA.", 1);
            } else {
                this.setPageStatus(msg);
            }

        },

        onRelEditsComplete: function (results) {
            console.log("onRelEditsComplete", results);
            if (this.toolMode == "P") {
                var _self = this;

                this.publishFeatureAfterSave();

            }
            else {
                this.setPageStatus("Form has been saved");
            }
        },

        onCcQueryFeaturesComplete: function (results) {
            console.log("onccqueryfeaturescomplete", results);

            if (results.featureSet.features.length > 0) {
                var county = results.featureSet.features[0].attributes.COUNTY;

                if (this.ccodes[county] == null) {
                    this.ccodes[county] = results.featureSet.features[0].attributes;
                }

                console.log("OCQFP/countydata", this.ccodes[county]);

                this.ccodes[county].SITECOUNT += 1;

                console.log("OCQFP/New number", this.ccodes[county].SITECOUNT);

                var sitenum = "";
                var val = (this.ccodes[county].SITECOUNT).toString();
                var sitecount = "";
                if (val.length == 1) {
                    sitecount = "000" + val;
                }
                else if (val.length == 2) {
                    sitecount = "00" + val;
                }
                else if (val.length == 3) {
                    sitecount = "0" + val;
                }
                else if (val.length == 4) {
                    sitecount = val;
                }

                sitenum = "38" + this.ccodes[county].COUNTY_ABBV + sitecount;

                this.fcValues["SITENUMBER"] = sitenum

                console.log("OCQFP/SITENUMBER", sitenum);
                console.log("OCQFP/fcValues", this.fcValues);

                var ext = "";
                if (this.fcValues["REVISIT"] == "Y") {
                    var revisit = this.fcValues["REVISITNUM"];
                    ext = "_" + (parsetInt(revisit) + 1).toString();
                }
                else {
                    ext = "_0";
                }

                this.fcValues["SITEID"] = this.fcValues["SITENUMBER"] + ext;

                console.log("OCQFP/SITEID", this.fcValues["SITEID"]);

                //this.draftCountyCodesTable.applyEdits(null, [results.featureSet.features[0]], null);

                dijit.byId("av_SITENUMBER").set("value", this.fcValues["SITENUMBER"]);
                dijit.byId("av_SITEID").set("value", this.fcValues["SITEID"]);
            }
        },

        setPageStatus: function (msg) {
            console.log("SPS/returnPage:", this.returnPage);
            this.showMessageView(msg, this.returnPage);

        },

        setMessage: function (msg) {
            var _self = this;
            dojo.byId("av_loadingMessage").innerHTML = msg;
            _self.setView(3);
        },

        hideMessage: function (view) {
            this.setView(view);
            dojo.byId("av_loadingMessage").innerHTML = "Loading...";
        },

        //this.dataRecovCount
        addDataRecov: function () {
            var id = this.dataRecovCount + 1;

            var table = dojo.byId("av_DataRecovered");
            var rowCount = table.rows.length;
            var row = table.insertRow(rowCount);
            row.id = "av_datarcv_" + id;

            //var div = domConstruct.create("div", { id: "av_datarcv_" + id, class: "itemRow" });

            var tb1 = new TextBox({
                id: "av_dr_num_" + id,
                'class': "numColumn",
                style: "width: 50px;"
            });

            var cell1 = row.insertCell(0);
            cell1.appendChild(tb1.domNode);
            //domConstruct.place(tb1.domNode, div);

            var tb = new TextBox({
                id: "av_dr_txt_" + id,
                'class': "fillColumn"
            });


            var cell2 = row.insertCell(1);
            cell2.appendChild(tb.domNode);
            //domConstruct.place(tb.domNode, div);

            /*var btn = new Button({
                id: "av_btn_" + id,
                label: "X",
                class: "itemCell",
                style: "width: 20px;",
                onClick: lang.hitch(this, this.removeDataRecov, id)
            });*/

            var div = domConstruct.create("div", { id: "av_btn_" + id, 'class': "smallCloseButton" });
            div.onclick = lang.hitch(this, this.removeDataRecov, id);

            var cell3 = row.insertCell(2);
            cell3.id = 'av_delCol' + id;
            //cell3.class = "deleteColumn hCenterColumn";
            cell3.appendChild(div);

            query('#av_delCol' + id).addClass('deleteColumn hCenterColumn');

            //domConstruct.place(btn.domNode, div);

            //domConstruct.place(div, dojo.byId("av_DataRecovered"));

            this.dataRecovCount = id;


        },

        removeDataRecov: function (id) {
            var qids = ["av_dr_num_" + id, "av_dr_txt_" + id, "av_btn_" + id];

            arr.forEach(qids, function (e) {
                if (dijit.byId(e) != null) {

                    dijit.byId(e).destroyRecursive();
                }
            });

            var table = dojo.byId("av_DataRecovered");
            var rowCount = table.rows.length;
            for (var i = 0; i < rowCount; i++) {
                if (table.rows[i].id == "av_datarcv_" + id) {

                    table.deleteRow(i);
                    break;
                }
            }

            dojo.destroy("av_datarcv_" + id);

            //this.dataRecovCount -= 1;
        },

        addTestUnit: function () {
            var id = this.testUnitCount + 1;

            var table = dojo.byId("av_TestingUnits");
            var rowCount = table.rows.length;
            var row = table.insertRow(rowCount);
            row.id = "av_testunit_" + id;

            var sel = new Select({
                name: "av_tu_tmt" + id,
                options: [
                    { label: "Auger", value: 0 },
                    { label: "Posthole", value: 1 },
                    { label: "Shovel", value: 2 },
                    { label: "Other", value: 3 }
                ],
                style: "width: 65px;"
            });

            //var select = domConstruct.toDom(selectDom);

            var cell0 = row.insertCell(0);
            cell0.id = 'av_menuCol' + id;
            //cell0.class = "menuColumn";
            cell0.appendChild(sel.domNode);

            query('#av_menuCol' + id).addClass('menuColumn');

            //Number
            var tb1 = new TextBox({
                id: "av_tu_num_" + id,
                'class': "numColumn"
            });

            var cell1 = row.insertCell(1);
            cell1.appendChild(tb1.domNode);

            //Size
            var tb2 = new TextBox({
                id: "av_tu_size_" + id,
                'class': "numDblColumn"
            });

            var cell2 = row.insertCell(2);
            cell2.appendChild(tb2.domNode);

            //Max Depth
            var tb3 = new TextBox({
                id: "av_tu_depth_" + id,
                'class': "numDblColumn"
            });

            var cell3 = row.insertCell(3);
            cell3.appendChild(tb3.domNode);

            //Comment 
            var tb = new TextBox({
                id: "av_tu_other_" + id,
                'class': "fillColumn"
            });

            var cell4 = row.insertCell(4);
            cell4.appendChild(tb.domNode);

            //Delete
            var div = domConstruct.create("div", { id: "av_tu_btn_" + id, 'class': "smallCloseButton" });
            div.onclick = lang.hitch(this, this.removeTestUnit, id);

            var cell5 = row.insertCell(5);
            cell5.id = 'av_delCol' + id;
            //cell5.class = "deleteColumn hCenterColumn";
            cell5.appendChild(div);

            query('#av_delCol' + id).addClass('deleteColumn hCenterColumn');

            this.testUnitCount = id;
        },

        removeTestUnit: function (id) {
            var qids = ["av_tu_num_" + id, "av_tu_size_" + id, "av_tu_depth_" + id, "av_tu_other_" + id];

            arr.forEach(qids, function (e) {
                dijit.byId(e).destroyRecursive();
            });

            var table = dojo.byId("av_TestingUnits");
            var rowCount = table.rows.length;
            for (var i = 0; i < rowCount; i++) {
                if (table.rows[i].id == "av_testunit_" + id) {

                    table.deleteRow(i);
                    break;
                }
            }

            dojo.destroy("av_testunit_" + id);

            //this.testUnitCount -= 1;
        },

        addExcavUnit: function () {
            var id = this.excavUnitCount + 1;

            var table = dojo.byId("av_ExcavUnits");
            console.log("TABLE", table);
            var rowCount = table.rows.length;
            var row = table.insertRow(rowCount);
            row.id = "av_excavunit_" + id;

            //Number
            var tb1 = new TextBox({
                id: "av_eu_num_" + id,
                'class': "numColumn"
            });

            var cell1 = row.insertCell(0);
            cell1.appendChild(tb1.domNode);

            //Size
            var tb2 = new TextBox({
                id: "av_eu_size_" + id,
                'class': "numDblColumn"
            });

            var cell2 = row.insertCell(1);
            cell2.appendChild(tb2.domNode);

            //Max Depth
            var tb3 = new TextBox({
                id: "av_eu_depth_" + id,
                'class': "numDblColumn"
            });

            var cell3 = row.insertCell(2);
            cell3.appendChild(tb3.domNode);

            //Comment 
            var tb = new TextBox({
                id: "av_eu_com_" + id,
                'class': "commentColumn"
            });

            var cell4 = row.insertCell(3);
            cell4.appendChild(tb.domNode);

            //Delete
            var div = domConstruct.create("div", { id: "av_eu_btn_" + id, 'class': "smallCloseButton" });
            div.onclick = lang.hitch(this, this.removeExcavUnit, id);

            var cell5 = row.insertCell(4);
            cell5.id = 'av_delCol' + id;
            //cell5.class = "deleteColumn hCenterColumn";
            cell5.appendChild(div);

            query('#av_delCol' + id).addClass('deleteColumn hCenterColumn');

            this.excavUnitCount = id;
        },

        removeExcavUnit: function (id) {
            var qids = ["av_eu_num_" + id, "av_eu_size_" + id, "av_eu_depth_" + id, "av_eu_com_" + id];

            arr.forEach(qids, function (e) {
                dijit.byId(e).destroyRecursive();
            });

            var table = dojo.byId("av_ExcavUnits");
            var rowCount = table.rows.length;
            for (var i = 0; i < rowCount; i++) {
                if (table.rows[i].id == "av_excavunit_" + id) {

                    table.deleteRow(i);
                    break;
                }
            }

            dojo.destroy("av_excavunit_" + id);

            //this.excavUnitCount -= 1;
        },

        commitChanges: function () {
            var _self = this;
            var qt = new QueryTask(_self.options.draftFeatureLayerUrl);
            var qry = new Query();
            qry.where = "STATUS = 'A'";
            qry.orderByFields = ["RECORD_OWNER, PROJECT"];
            qry.returnGeometry = true;
            qry.outFields = ["*"];

            console.log("CC");

            _self.appSum = {};
            _self.apprSites = [];

            var graColl = [];

            qt.execute(qry, function (results) {
                console.log("CC/QUERYRESULTS", results);
                if (results != null) {
                    if (results.features.length > 0) {

                        arr.forEach(results.features, function (entry) {
                            if (_self.appSum[entry.attributes.RECORD_OWNER] == null) {
                                _self.appSum[entry.attributes.RECORD_OWNER] = [];
                            }

                            _self.appSum[entry.attributes.RECORD_OWNER].push({
                                'PROJECT': entry.attributes.PROJECT,
                                'SITENUMBER': entry.attributes.SITENUMBER,
                                'SITEID': entry.attributes.SITEID
                            });

                            _self.apprSites.push(lang.clone(entry));

                            entry.attributes.OBJECTID = null;
                            console.log("DATE1", _self.convertDateDojoToDb(_self.getDateNow("/")));
                            console.log("DATE2", _self.convertDateDojoToDb("12/31/9999"));
                            //entry.attributes.EDIT_DATE_FROM = _self.convertDateDojoToDb(_self.getDateNow("/"));
                            entry.attributes.EDIT_DATE_TO = _self.convertDateDojoToDb("12/31/9999");

                            graColl.push(entry);

                        });
                        console.log("CC/SAVETOPROD", _self.prodFeatureLayer);
                        //Save to Production
                        _self.prodFeatureLayer.applyEdits(graColl, null, null, lang.hitch(_self, _self.onEditsProd), function (e) {
                            console.log("CC/SAVEERROR", e.message);
                        });


                    }
                }
            });
        },

        onEditsProd: function (results) {
            var _self = this;
            console.log("OEP", results);
            if (results.length > 0) {
                console.log("OEP1");
                if (results[0].success == true) {
                    console.log("OEP2", _self.apprSites);
                    _self.dflEvent.remove();

                    _self.draftFeatureLayer.applyEdits(null, null, _self.apprSites, lang.hitch(_self, function (cresults) {
                        console.log("OEP3", cresults);

                        _self.dflEvent = _self.draftFeatureLayer.on("edits-complete", lang.hitch(_self, _self.onEditsComplete));

                        _self.apprSites = null;

                        //TODO: Send email
                        //JSON to send: _self.appSum
                    }), function (e) {
                        console.log("OEP/Error deleting from drafts", e);
                    });

                }
            }

        },

        //
        // Button Actions
        //

        saveAttributes: function () {

            this.setMessage("Saving...");


            this.saveRecord();


        },

        publishFeature: function () {
            var _self = this;

            _self.setMessage("Publishing...");

            _self.isPublish = true;
            _self.toolMode = "P";

            _self.saveRecord();

        },

        //TODO: Function may no longer be needed
        publishFeatureAfterSave: function () {
            console.log("publishFeatureAfterSave");

            this.saveRecordAsPublished();

        },

        publishFeatureCheck: function () {
            var _self = this;
            if (_self.verifyRecord() == false) {
                _self.toolMode = "D";
                _self.returnPage = 6;
                _self.setView(6);
                console.log("Record is invalid");
            }
            else {
                this.setView(8);
            }


        },

        showMessageView: function (msg, toView) {
            var _self = this;
            console.log("showMessageView", toView);
            dojo.byId("av_v_7_message").innerHTML = msg;

            var handle = on(dojo.byId("av_v_7_btn"), "click", lang.hitch(this, function () {
                handle.remove();
                this.setView(toView);
            }));

            _self.setView(7);

        },

        showAddSite: function () {

            this.setView(2);

            this.fcValues = {};

            this.clearForm();

            //Set default values
            dijit.byId('av_RECORDEDBY').set("value", this.options.displayname);
            dijit.byId('av_AFFILIATION').set("value", this.options.affiliation);

            this.fcValues["STATUS"] = 'D';

            var currentdate = this.getDateNow("-");
            dijit.byId('av_RECORDEDDATE').set("value", currentdate);

            this.options.map.disableKeyboardNavigation();


        },

        formatDate: function (d) {
            var curr_date = d.getUTCDate();
            var curr_month = d.getUTCMonth() + 1; //Months are zero based
            var curr_year = d.getUTCFullYear();
            return curr_month + "/" + curr_date + "/" + curr_year;
        },

        getDateNow: function (sep) {
            var d = new Date();
            var month, date
            if ((d.getUTCMonth() + 1) < 10) {
                month = "0" + (d.getUTCMonth() + 1);
            }
            else {
                month = (d.getUTCMonth() + 1);
            }
            if (d.getUTCDate() < 10) {
                date = "0" + d.getUTCDate();
            }
            else {
                date = d.getUTCDate();
            }

            var dateStr = "";

            if (sep == "/") {
                dateStr = month + sep + date + sep + d.getUTCFullYear();
            }
            else {
                dateStr = d.getUTCFullYear() + sep + month + sep + date;
            }

            return dateStr;
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
            dojo.byId("av_searchList").innerHTML = '';
            dijit.byId("av_attrSearch").set("value", "");
            this.setView(1);
            this.options.map.enableKeyboardNavigation();
        },

        cancelFeature: function () {

            this.resetWidget();
            console.log('switch view');
            this.setView(1);

        },

        resetWidget: function () {
            query('#av_v2_btnSaveGeo').addClass('hidePage');
            query('#av_v2_btnCancel').addClass('hidePage');
            query('#av_v2_btnGeo').removeClass('hidePage');

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

            this.getWaitList();

            this.options.map.enableKeyboardNavigation();
        },

        pageReset: function () {
            this.currentPage = 1;

            this.pageMove();
        },

        pageMove: function () {
            for (var i = 1; i < this.totalPages + 1; i++) {
                if (this.currentPage == i) {
                    dojo.style(dojo.byId('av_pg_' + i), "visibility", "visible");
                    dojo.style(dojo.byId('av_pg_' + i), "display", "block");
                }
                else {
                    dojo.style(dojo.byId('av_pg_' + i), "visibility", "hidden");
                    dojo.style(dojo.byId('av_pg_' + i), "display", "none");
                }
            }

            dojo.query("#av_pages")[0].innerHTML = this.currentPage + " of " + this.totalPages;

        },

        pageBack: function () {
            if (this.currentPage - 1 >= 1) {
                this.currentPage = this.currentPage - 1;

                this.pageMove();
            }
        },

        pageForward: function () {
            if (this.currentPage + 1 <= 6) {
                this.currentPage = this.currentPage + 1;

                this.pageMove();
            }
        },
    });
    return Widget;
});