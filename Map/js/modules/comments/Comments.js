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
	"dojo/text!./templates/Comments.html",
    "dojo/dom-style",
    "dijit/Tooltip",
	"dojo/on",
    "dojo/dom-attr"
],
function (declare, lang, event, parser, query, registry, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, domStyle, Tooltip, on, domAttr) {
    var Widget = declare("modules.comments.Comments", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        constructor: function (options) {

            var _self = this;
            this.options = {};
            declare.safeMixin(this.options, options);

            // Our template - important!
            this.templateString = template;

            this.widgetsInTemplate = true;

            // A class to be applied to the root node in our template
            //this.baseClass = "drawMeasure";

            //2014-01-29T23:50:00
            var d = new Date();
            var cd = d.getYear() + "-" + d.getMonth() + "-" + d.getDate() + "T" + d.getHours() + ":" + d.getMinutes + ":" + d.getMilliseconds;
            this.currentDate = cd;

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

            on(_self.cm_commentArea, "keypress", function (event) {
                _self.clearTooltip(event.target);
            });

            on(_self.cm_email, "keypress", function (event) {
                _self.clearTooltip(event.target);
            });

        },

        sendComment: function () {
            var _self = this;

            var isValid = true;

            console.log(dojo.byId("cm_commentArea").value);

            if (dojo.byId("cm_commentArea").value == "") {
                Tooltip.show("Please enter a comment", dojo.byId("cm_commentArea"), ["below", "above"]);
                isValid = false;
            }

            if (dojo.byId("cm_email").value == "") {
                Tooltip.show("Please enter an email address", dojo.byId("cm_email"), ["below", "above"]);
                isValid = false;
            }
            else {
                var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (re.test(dojo.byId("cm_email").value) == false) {
                    Tooltip.show("Please enter a valid email address", dojo.byId("cm_email"), ["below", "above"]);
                    isValid = false;
                }
            }

            if (isValid) {
                var xhrArgs = {
                    url: "/archws/api/comment",
                    content: {Username: _self.options.username,
                        Browser:  _self.options.browser, 
                        CommentDate: _self.currentDate,
                        CommentText: dojo.byId("cm_commentArea").value , 
                        Email: dojo.byId("cm_email").value},
                    handleAs: "json",
                    load: function (data) {
                        _self.setView(3);

                        setTimeout(function () {
                            _self.cancelComment();
                        }, 10000);
                    },
                    error: function (error) {
                        _self.cm_v4_msg.innerHTML = "There was an error: <br/>" + error;
                        _self.setView(4);
                    }
                }
                //_self.setView(2);
                // Call the asynchronous xhrPost
                var deferred = dojo.xhrPut(xhrArgs);
            }
        },

        cancelComment: function () {
            dojo.byId("cm_commentArea").value = "";
            dojo.byId("cm_email").value = "";
            this.setView(1);
        },

        setView: function (view) {

            query('.commentWidget .viewPanel').addClass('hidePage');
            query('#cm_view_' + view).removeClass('hidePage');

            this.currentView = view;
        },

        clearTooltip: function (event) {
            Tooltip.hide(event);
        }

    });


    return Widget;
});