define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/event",
    "dojo/parser",
    "dojo/query",
    "dijit/registry",
	"dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dojo/text!./templates/ScaleSelector.html",
	"dojo/_base/fx",
    "dojo/dom-style",
    "dojo/dom-class",
	"dojo/on"
],
function (declare, lang, event, parser, query, registry, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, baseFx, domStyle, domClass, on) {
    var Widget = declare("modules.scaleselector.ScaleSelector", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        constructor: function (options) {

            var _self = this;
            this.options = {

            };
            declare.safeMixin(this.options, options);

            // Our template - important!
            this.templateString = template;

            this.widgetsInTemplate = true;

            // A class to be applied to the root node in our template
            //this.baseClass = "";

            this.mapZoomEvent = null;

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

            //query('#ssel_Submit').onclick(lang.hitch(this, function (evt) {
            //    _self.toggleDropDownList();
            //}));

            var scale = Math.round(_self.options.map.getScale());
            var scaleText = scale.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            _self.inputNode.value = "1:" + scaleText;

            var html = '<ul>';

            for (var i = 0; i < _self.options.scales.length; i++) {
                var selClass = "";

                if (i == 0)
                    selClass = "scaleItemFirst";
                else if (i == _self.options.scales.length - 1)
                    selClass = "scaleItemLast";
                else if (i > 0 && i % 2 == 0)
                    selClass = "scaleItemEven";
                else if (i > 0 && i % 2 != 0)
                    selClass = "scaleItemOdd";
                
                html += '<li class="scaleItem ' + selClass + '" scale-value="' + _self.options.scales[i].id + '">' + _self.options.scales[i].name + '</li>';
            }

            html += "</ul>";

            //var scaleList = dojo.byId("ssel_ScaleList");

            this.resultsNode.innerHTML = html;

                query("li").on("click", function (event) {
                        var scale = query(this).attr('scale-value');
                        if (scale !== null) {
                            _self.options.map.setScale(Number(scale));
                            _self.inputNode.value = this.innerHTML;
                            _self.toggleDropDownList();
                        }
                    
                });
            

            this.mapZoomEvent = _self.options.map.on("zoom-end", lang.hitch(this, function () {
                var scale = Math.round(this.map.getScale());
                var scaleText = scale.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                this.inputNode.value = "1:" + scaleText;
            }));

            /*var txtSearch = dojo.byId("ssel_Search");
            if (txtSearch) {
                on(txtSearch, ".searchBox:input, .searchBox:keyup", function (event) {
                    if (event.type === 'input') {
                        this.value = this.value.replace(/[^0-9]/g, '');
                    }
                    else if (event.type === 'keyup' && event.keyCode === 13) {
                        var scale = Number(this.value);
                        if (scale != null) {
                            if (scale > 0 && scale < 2500000) {
                                _self.options.map.setScale(Number(scale));
                            }
                        }
                    }
                });
            }*/

        },

  
        toggleDropDownList: function () {

            if (domStyle.get(this.resultsNode, "display") == "none") {
                domClass.add(this.scaleBox, "scaleActive");
                domClass.add(this.domNode, "selectListOpen");
                domStyle.set(this.resultsNode, "display", "block");
            }
            else {
                domClass.remove(this.scaleBox, "scaleActive");
                domClass.remove(this.domNode, "selectListOpen");
                domStyle.set(this.resultsNode, "display", "none");
            }
        }
    });


    return Widget;
});