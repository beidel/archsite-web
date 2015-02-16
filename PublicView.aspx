<%@ Page Language="C#" AutoEventWireup="true" CodeFile="PublicView.aspx.cs" Inherits="PublicView3" %>

<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="initial-scale=1, maximum-scale=1,user-scalable=no"/>
    <title>SC ArchSite Public Map</title>
    <link rel="stylesheet" href="styles/kraken.css">
    <link rel="stylesheet" href="styles/scarch5.css">
    <link rel="stylesheet" type="text/css" href="//js.arcgis.com/3.10/js/esri/css/esri.css" />
    <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Lato:300,400,700" />
    <!--Load any application specific styles-->
    <link rel="stylesheet" type="text/css" href="styles/dijit.css" />
    <link rel="stylesheet" type="text/css" href="styles/fontello.css" />
    <link rel="stylesheet" type="text/css" href="styles/TableOfContents.css" />
    <link rel="stylesheet" type="text/css" href="styles/HomeButton.css" />
      <link rel="stylesheet" type="text/css" href="styles/PrintButton.css" />
    <link rel="stylesheet" type="text/css" href="styles/LocateButton.css" />
    <link rel="stylesheet" type="text/css" href="styles/SimpleSlider.css" />
      <link rel="stylesheet" type="text/css" href="styles/search.css" />
    <link rel="stylesheet" type="text/css" href="styles/popup.css" />
    <link rel="stylesheet" type="text/css" href="styles/dialogs.css" />
    <link rel="stylesheet" type="text/css" href="styles/geocoder.css" />
    <link rel="stylesheet" type="text/css" href="styles/main.css" />


  </head>

<body>
    <form id="form1" runat="server">



    <div class="container">
        <div class="grid-6">
            <div class="grid-1">
                <h3 class="tb"><a href="default.aspx">scarchsite.com</a></h3>
            </div><!-- close one -->
            <div class="grid-5">

            </div><!-- close five -->
        </div><!-- close six -->
    </div><!-- close container -->

    <div class="container">
        <div class="grid-6">
    <nav class="nav-wrap">
	<a class="nav-toggle" href="#nav-menu">Menu &#9660;</a>
	    <div class="nav-collapse" id="nav-menu">
		    <ul class="nav">
                <li><a href="<%= ResolveUrl("~/PublicView.aspx") %>" id="current" >Public View Map</a></li>
                <li><a href="<%= ResolveUrl("~/subscribermapredirect.aspx") %>" >Subscriber Map</a></li>
                <li class="dropdown"><a href="#">Subscription Info</a>
                    <div class="dropdown-menu">
                        <ul>
                            <li><a href="<%= ResolveUrl("~/overview.aspx") %>" ><span> &#8212 </span>Subscription Overview</a></li>
                            <li><a href="http://archsite.cas.sc.edu/sciaainfo/ArchSite%20Subscription%20Request%20Form%20&%20License%20Agreement2.pdf" target="_blank"><span> &#8212 </span>License Agreement</a></li>
                            <li><a href="<%= ResolveUrl("~/Account/register.aspx") %>" ><span> &#8212 </span>Create Account</a></li>
                            <li><a href="<%= ResolveUrl("~/Account/changePassword.aspx") %>" ><span> &#8212 </span>Change Password</a></li>
                            <li><a href="<%= ResolveUrl("~/ForgotPassword.aspx") %>" ><span> &#8212 </span>Forgot Password</a></li>
                            <li><a href="<%= ResolveUrl("~/userDoc.aspx") %>" ><span> &#8212 </span>User Documentation</a></li>
                        </ul>
                    </div><!-- close dropdown-menu -->
                </li>
                <li><a href="<%= ResolveUrl("~/disclaimers.aspx") %>" >Disclaimers</a></li>
                <li><a href="<%= ResolveUrl("~/about.aspx") %>" >About</a></li>
            </ul>
        </div><!-- close nav-collapse -->
    </nav></asp:Content>

        </div><!-- close six -->
    </div><!-- close container -->

    <div class="container">
        <div class="grid-6 logo">
            <h1 class="no-space-bottom no-space-top header"><a href="<%= ResolveUrl("~/default.aspx") %>" >SC <span class="arch">Arch</span><span class="site">Site</span></a> <span class="sublogo">SCIAA&nbsp;+&nbsp;SCDAH</span>
                    <img src="<%= ResolveUrl("~/Images/AS/logos60x89.png") %>" /><br />
                <span class="title">Public View Map</span>
            </h1>
        </div><!-- close six logo -->
    </div><!-- close container -->

    <div class="container">
    <div id="mapContainer" class="calcite app-loading" style="position:relative; height: 800px;">
        <div class="loading-indicator">
        <div class="loading-error">
            <div class="icon-emo-unhappy"></div>
            <div class="error-message-text" id="error_message"></div>
        </div>
    </div>
    <div id="bc_outer" class="border-container-outer">
        <div id="cp_outer_left" class="content-pane-left">
            <div id="drawer_menus"></div>
        </div>
        <div id="cp_outer_center" class="content-pane-center">
            <div id="geoData"></div>
            <div class="top-bar">
                <div id="hamburger_button" class="hamburger-button toggle-grey">
                    <div class="icon-menu-1"></div>
                </div>
                <div id="title" class="app-title"></div>
                <div class="top-menu-right">
                    <div id="ShareDialog"></div>
                    <div class="locate-box">
                        <div id="geocoderSearch"></div>
                    </div>
                    <div id="mobileGeocoderIcon" class="mobile-geocoder-icon icon-right">
                        <div id="mobileGeocoderIconContainer" class="button-container toggle-grey icon-search-1"></div>
                    </div>
                    <div class="clear"></div>
                </div>
                <div class="clear"></div>
            </div>
            <div id="mobileSearch" class="mobile-locate-box-hidden">
                <div class="mobile-search-container">
                    <div id="geocoderMobile"></div>
                    <div id="btnCloseGeocoder" class="close-geocoder-button">Cancel</div>
                    <div class="clear"></div>
                </div>
            </div>
            <div id="mapButtons" class="map-buttons">
                <div id="LocateButton"></div>
                <div id="HomeButton"></div>
                <div id="PrintButton"></div>
            </div>
            <div id="BasemapToggle"></div>
            <div id="mapDiv" dir="ltr">
                <div id="swipeDiv"></div>
            </div>
        </div>
    </div>
    
    </div><!-- close mapContainer -->
    </div><!-- close container -->

    <div class="footer">
    <div class="container">
        <hr class="no-space-bottom" />
        <div class="grid-6">

            <p class="no-space-bottom"><span class="text-small"><strong>Contact Us</strong></span></p>
        </div><!-- close 6 -->

            <div class="grid-2">
                <p class="no-space-top"><span class="text-small">
                SCIAA<br />
                1321 Pendleton Street<br />
                Columbia, SC 29208<br />
                Attn: Tamara Wilson</span></p>
            </div><!-- close 2 -->

            <div class="grid-2">
                <p class="no-space-top"><span class="text-small">
                ArchSite Office: 803-777-9720<br />
                Direct Line: 803-576-6583<br />
                Fax: 803-254-1338<br />
                <a href="mailto:TAWILSON@mailbox.sc.edu">Email the web administrator</a></span>
                </p>
            </div><!-- close 2 -->

            <div class="grid-2">
                <p class="copyright">
                    SC ArchSite<br />
                    &copy; 2004 &#8211; 2014<br />
                    Maintained by the <a href="http://artsandsciences.sc.edu/sciaa/">South Carolina Institute of Archaeology and Anthropology</a>
                </p>
            </div><!-- close 2 -->
    </div><!-- close container -->
    </div><!-- close footer -->
        <!-- Javascript -->
        <!--instantiate js plugins-->
        <script src="http://code.jquery.com/jquery-1.9.1.js" type="text/javascript"></script>
        <script type="text/javascript" src="<%= ResolveUrl("~/Javascript/dropdowns.js") %>" ></script>

        <script type="text/javascript">
            var package_path = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
            var dojoConfig = {
                async: true,
                //The location.pathname.replace() logic below may look confusing but all its doing is
                // enabling us to load the api from a CDN and load local modules from the correct location.
                packages: [{
                    name: "application",
                    location: package_path + '/js'
                }, {
                    name: "config",
                    location: package_path + '/config'
                }, {
                    name: "arcgis_templates",
                    location: package_path + '/..'
                }]
            };
    </script>
    <script type="text/javascript" src="//js.arcgis.com/3.10/init.js"></script>
    <script type="text/javascript">
        require([
            "application/templateOptions",
            "application/template",
            "application/main"
        ], function (
            templateOptions,
            Template,
            Main
        ) {
            // create the template. This will take care of all the logic required for template applications 
            var myTemplate = new Template(templateOptions);
            // create my main application. Start placing your logic in the main.js file.
            var myApp = new Main();
            // start template
            myTemplate.startup().then(function (config) {
                // The config object contains the following properties: helper services, (optionally) 
                // i18n, appid, webmap and any custom values defined by the application. 
                // In this example we have one called theme. 
                myApp.startup(config);
            }, function (error) {
                // something went wrong. Let's report it.
                myApp.reportError(error);
            });
        });
    </script>
        
        <!-- Google Analytics -->

        <script type="text/javascript">
            var _gaq = _gaq || [];
            _gaq.push(['_setAccount', 'UA-47078138-1']);
            _gaq.push(['_setDomainName', "scarchsite.com"]);
            _gaq.push(['_trackPageview']);
            (function () {
                var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
                ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
                var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
            })();
        </script>



    </form>
</body>

</html>
