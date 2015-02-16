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
	"dojo/text!./templates/EditForm.html",
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
    "modules/editform/ArchSite",
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
    var Widget = declare("modules.editform.EditForm", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        constructor: function (options) {

            var _self = this;
            this.options = {
                widgetId: "eform",
                name: "Arch Site",
                userid: "",
                affiliation: "",
                height: 500
            };
            declare.safeMixin(this.options, options);

            this.set("widgetId", this.options.widgetId);

            this.templateString = template;

            this.widgetsInTemplate = true;

            this.vmArchSite = ArchSite;

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

            ko.applyBindings(this.vmArchSite, dojo.byId("pgContainer"));

        },

        setSite: function (featureSet) {
            //for (var i = 0; i < featureSet.fields.length; i++) {
            //    this.vmArchSite.[propName](value);
            //}
        }

    });
    return Widget;
});