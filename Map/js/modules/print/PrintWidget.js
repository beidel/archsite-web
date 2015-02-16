define([
    "dojo/_base/declare",
    "dojo/_base/connect",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/_base/event",
    "dojo/dom-construct",
    "dojo/dom",
    "dojo/parser",
    "dojo/query",
    "dijit/registry",
	"dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dojo/text!./templates/PrintWidget.html",
	"dojo/dom-style",
	"dojo/_base/fx",
	"dojo/on",
    "esri/map",
    "esri/tasks/PrintTemplate",
    "esri/tasks/PrintParameters",
    "esri/dijit/Print"
],
function (declare, connect, arr, lang, event, domConstruct, dom, parser, query, registry, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, domStyle, baseFx, on,
    Map, PrintTemplate, PrintParameters, Print) {
    var Widget = declare("modules.print.PrintWidget", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        constructor: function (options) {

            var _self = this;
            this.options = {
                widgetId: "printwidget"
            };

            declare.safeMixin(this.options, options);
            this.set("widgetId", this.options.widgetId);

            // Our template - important!
            this.templateString = template;

            this.widgetsInTemplate = true;

            // A class to be applied to the root node in our template
            this.baseClass = "Print";

            this.printTemplate = "";

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

            var printTitle = "SC Archaeological Sites";

            // create an array of objects that will be used to create print templates
            var layouts = [{
                name: "Letter ANSI A Landscape",
                label: "Landscape (PDF)",
                format: "pdf",
                options: {
                    legendLayers: [], // empty array means no legend
                    scalebarUnit: "Miles",
                    titleText: printTitle 
                }
            },
            {
                name: "Letter ANSI A Portrait",
                label: "Portrait (PDF)",
                format: "pdf",
                options: {
                    legendLayers: [], // empty array means no legend
                    scalebarUnit: "Miles",
                    titleText: printTitle 
                }
            },
            {
                name: "Letter ANSI A Landscape",
                label: "Landscape (Image)",
                format: "jpg",
                options: {
                    legendLayers: [], // empty array means no legend
                    scalebarUnit: "Miles",
                    titleText: printTitle 
                }
            },
            {
                name: "Letter ANSI A Portrait",
                label: "Portrait (Image)",
                format: "jpg",
                options: {
                    legendLayers: [],
                    scaleBarUnit: "Miles",
                    titleText: printTitle 
                }
            }
            ];

            // create the print templates
            var templates = arr.map(layouts, function (lo) {
                var t = new PrintTemplate();
                t.layout = lo.name;
                t.label = lo.label;
                t.format = lo.format;
                t.layoutOptions = lo.options;
                return t;
            });

            _self.printer = new Print({
                map: _self.options.map,
                templates: templates,
                url: _self.options.url
            }, dom.byId("print_button"));
            _self.printer.startup();

        }

 
    });


    return Widget;
});