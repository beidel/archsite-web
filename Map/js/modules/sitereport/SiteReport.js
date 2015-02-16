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
	"dojo/text!./templates/SiteReport.html",
	"dojo/dom-style",
	"dojo/_base/fx",
	"dojo/on",
	"dojo/mouse",
    "dojo/promise/all",
    "esri/toolbars/draw",
    "esri/layers/FeatureLayer",
    "esri/tasks/query",
    "esri/tasks/QueryTask",
    "esri/graphic",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleMarkerSymbol",
    "dojo/_base/Color",
    "dijit/layout/ContentPane",
    "dijit/form/Button",
    "dijit/form/Select",
    "dijit/form/TextBox",
    "dijit/form/RadioButton",
    "dgrid/Grid"

],
function (declare, connect, arr, lang, event, domConstruct, parser, query, registry, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, domStyle, baseFx, on, mouse, all, Draw,
    FeatureLayer, query, QueryTask, Graphic, SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol, Color, ContentPane, Button, Select, TextBox,RadioButton,
    Grid) {
    var Widget = declare("modules.sitereport.SiteReport", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        constructor: function (options) {

            var _self = this;
            this.options = {

            };
            declare.safeMixin(this.options, options);

            // Our template - important!
            this.templateString = template;

            this.widgetsInTemplate = true;

            // A class to be applied to the root node in our template
            this.baseClass = "siteReport";

            this.fldValues = this.options.fcValues;

             

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

            //this.setRadioButton("AI_SURVEY");
            //this.setRadioButton("AI_TESTING");
            //this.setRadioButton("AI_EXCAVATION");
        },

        setRadioButton: function (fld) {
            if (this.fcValues[fld] == "Y") {
                console.log("Y", dijit.byId(fld).id);
                dijit.byId(fld).checked = true;
            }
            else {
                dijit.byId(fld).checked = false;
                //dojo.byId(fld).checked = false;
            }
        }

    });


    return Widget;
});