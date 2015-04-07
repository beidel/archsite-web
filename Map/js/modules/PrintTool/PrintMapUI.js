define([
    "dojo/_base/declare",
    "dojo/dom-construct",
    "dojo/_base/window",
],
function (
    declare,
    domConstruct,
    win) {
    return declare(null, {
        //properties
        printWindow: null,

        constructor: function (options) {
            
        },

        getHtml: function () {
            //html for print window - will be injected into div
            var html =
                "<div class=\"printContainer\">" +
                    "<table class=\"print-table\">" +
                        "<tr>" +
                            "<td>Format:</td>" +
                            "<td>" +
                                "<select id=\"print-select-format\">" +
                                    "<option value=\"PDF\">PDF</option>" +
                                    "<option value=\"JPG\">JPG</option>" +
                                    "<option value=\"SVG\">SVG</option>" +
                                    "<option value=\"PNG8 \">PNG</option>" +
                                "</select>" +
                            "</td>" +
                        "</tr>" +
                        "<tr>" +
                            "<td>Layout:</td>" +
                            "<td>" +
                                "<select id=\"print-select-layout\">" +
                                    "<option value=\"MAP_ONLY\">Map Only</option>" +
                                    "<option value=\"Letter ANSI A Landscape\">Letter (8.5\" x 11\") - Landscape</option>" +
                                    "<option value=\"Letter ANSI A Portrait\">Letter (8.5\" x 11\") - Portrait</option>" +
                                    "<option value=\"Tabloid ANSI B Landscape\">Tabloid (11\" x 17\") - Landscape</option>" +
                                    "<option value=\"Letter ANSI A Portrait\">Tabloid (11\" x 17\") - Portrait</option>" +
                                "</select>" +
                            "</td>" +
                        "</tr>" +
                        "<tr id=\"print-title-row\" style=\"display:none;\">" +
                            "<td>Print Title:</td>" +
                            "<td><input type=\"text\" id=\"print-title-text\" /></td>" +
                        "</tr>" +
                    "</table>" +
                    "<div class=\"printSpacer\"></div>" +
                    "<button id=\"btn-print-map\" class=\"toolbarButton toolButtonCustom\">Create Print File</button>" +
                    "<hr />" +
                    "<div>" +
                        "<div id=\"print-loading\" class=\"printLoading\" style=\"display:none;\">" +
                            "<div class=\"printLoadingGraphic\"></div>" +
                            "<div class=\"printLoadingText\">&nbsp;&nbsp;Generating print file, please wait...</div>" +
                        "</div>" +
                        "<div id=\"print-result\" class=\"printResult\"><table class=\"print-table\" id=\"print-results-table\"></table></div>" +
                    "</div>" +
                "</div>";

            return html;
        }
    });
});