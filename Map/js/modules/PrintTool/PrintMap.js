define([
    "dojo/_base/declare",
    "dojo/dom-construct",
    "dojo/dom",
    "dojo/on",
    "dojo/dom-style",
    "dojo/_base/window",
    "esri/map",
    "esri/tasks/PrintTask",
    "esri/tasks/PrintTemplate",
    "esri/tasks/PrintParameters",
    "esri/request",
    "modules/PrintTool/PrintMapUI"
],
function (
    declare,
    domConstruct,
    dom,
    on,
    domStyle,
    win,
    Map,
    PrintTask,
    PrintTemplate,
    PrintParameters,
    esriRequest,
    PrintMapUI) {

    return declare(null, {
        //properties
        map: null,
        url: null,
        gui: null,

        //constructor
        constructor: function (options) {
            this.map = options.map;
            this.url = options.url;
            this.gui = new PrintMapUI();

            domConstruct.place(this.gui.getHtml(), options.containerId, "only");
            this.bindGuiEvents();
        },

        bindGuiEvents: function () {
            var print = this;
            //var cancelPrintBtn = dom.byId("btn-cancel-print");
            //on(cancelPrintBtn, "click", function () {
            //    print.closePrintDialog();
            //});

            var ddl = dom.byId("print-select-layout");
            on(ddl, "change", function (evt) {
                if (evt.target.selectedIndex > 0) {
                    $("#print-title-row").show();
                }
                else {
                    $("#print-title-row").hide();
                }
            });

            var submitPrintBtn = dom.byId("btn-print-map");
            on(submitPrintBtn, "click", function () {
                print.printMap();
            });
        },

        toggleLoadingIndicator: function () {
            var loadingDiv = dom.byId("print-loading");
            var state = domStyle.get(loadingDiv, "display");
            if (state === "none") {
                domStyle.set(loadingDiv, "display", "block");
            }
            else {
                domStyle.set(loadingDiv, "display", "none");
            }
        },

        toggleResultsPanel: function () {
            var loadingDiv = dom.byId("print-result");
            var state = domStyle.get(loadingDiv, "display");
            if (state === "none") {
                domStyle.set(loadingDiv, "display", "block");
            }
            else {
                domStyle.set(loadingDiv, "display", "none");
            }
        },

        printMap: function () {
            this.toggleLoadingIndicator();

            var url = this.url;
            var print = new PrintTask(url);

            //get user input from print form
            var formatSelect = dom.byId("print-select-format");
            var format = formatSelect.options[formatSelect.selectedIndex].value;

            var layoutSelect = dom.byId("print-select-layout");
            var layout = layoutSelect.options[layoutSelect.selectedIndex].value;

            var title = dom.byId("print-title-text").value;

            var template = new PrintTemplate();
            template.format = format;
            template.exportOptions = {
                width: this.map.width,
                height: this.map.height,
                dpi: 96
            };
            template.layout = layout;
            template.layoutOptions = {
                titleText: title,
                authorText: "ArchSite",
                copyrightText: "ArchSite 2015"
            };

            var params = new PrintParameters();
            params.map = this.map;
            params.template = template;

            //turn off results while processing next request
            this.toggleResultsPanel();

            var printTool = this;
            print.execute(params, function (response) {
                printTool.toggleLoadingIndicator();
                printTool.toggleResultsPanel();

                var currentdate = new Date(); 
                var datetime = (currentdate.getMonth()+1) + "/"
                                + currentdate.getDate() + "/"
                                + currentdate.getFullYear() + "  "  
                                + currentdate.getHours() + ":"  
                                + ((currentdate.getMinutes() < 10) ? "0" : "") +currentdate.getMinutes() + ":" 
                                + currentdate.getSeconds();

                var printResultsTable = dom.byId("print-results-table");
                var url = response.url;
                var html = "<tr><td><a href=\"" + url + "\" target=\"_blank\">Download</a></td><td>" + datetime + "</td></tr>";
                domConstruct.place(html, printResultsTable, "first");

            }, function (err) {
                printTool.toggleLoadingIndicator();
                printTool.toggleResultsPanel();

                var printResultsTable = dom.byId("print-results-table");
                var html = "<tr><td colspan=\"2\"><span class=\"printError\">" + err + "<span></td></tr>";
                domConstruct.place(html, printResultsTable, "first");
            });
        }
    });

});