<%@ Page Language="C#" AutoEventWireup="true" CodeFile="PublicView6.aspx.cs" Inherits="PublicView6" %>

<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="initial-scale=1, maximum-scale=1,user-scalable=no"/>
    <title>SC ArchSite Public Map</title>
    <link rel="stylesheet" href="styles/kraken.css">
    <link rel="stylesheet" href="styles/scarch5.css">
    <link rel="stylesheet" href="http://js.arcgis.com/3.9/js/esri/css/esri.css">
    <style type="text/css">
        #map {
            height: 60vh;
            width: 100%;
            margin: 0;
            padding: 0;
        }
    </style>
    <script src="http://js.arcgis.com/3.9/"></script>
    <script>
        var map;

        require(["esri/map", "dojo/domReady!"], function (Map) {
            map = new Map("map", {
                basemap: "topo",
                center: [-80.78, 33.78], // longitude, latitude
                zoom: 8
            });
        });
    </script>

<style type="text/css">
/* Slide Panel */
        .cb_slide_panel {
            background: #ffffff;
            border-right: 1px solid #E0E0E0;
            box-shadow: 1px 1px 23px rgba(0, 0, 0, 0.17), -1px -1px 0 rgba(255, 255, 255, 0.85) inset;
            position: fixed;
            z-index: 65000;
            display: none;
        }
        .cb_slide_panel.panel_left, .cb_slide_panel.panel_right {
            width: 278px;
            height: 100%;
        }
        .cb_slide_panel.panel_right {
            box-shadow: 1px 1px 23px rgba(0, 0, 0, 0.17), 1px 1px 0 rgba(255, 255, 255, 0.85) inset;
        }
        /*.cb_slide_panel.panel_top, .cb_slide_panel.panel_bottom {
            height: 278px;
            width: 100%;
        }
        .cb_slide_panel.panel_top {
            box-shadow: 1px 1px 23px rgba(0, 0, 0, 0.17), -1px -1px 0 rgba(255, 255, 255, 0.85) inset;
        }
        .cb_slide_panel.panel_bottom {
            box-shadow: 1px 1px 23px rgba(0, 0, 0, 0.17), 1px 1px 0 rgba(255, 255, 255, 0.85) inset;
        }*/
        .cb_slide_panel a.close {
            background: #cccccc /*url(Images/AS/tools2.png) no-repeat*/;
            border: 1px solid #E0E0E0;
            height: 40px;
            position: absolute;
            text-indent: -9999em;
            width: 40px;
            display: none;
        }
        /*.cb_slide_panel.panel_left a.close {
            right: -42px;
            top: 20px;
        }*/
        .cb_slide_panel.panel_right a.close {
            left: -42px;
            top: 225px;
        }
        /*.cb_slide_panel.panel_top a.close {
            bottom: -41px;
            left: 20px;
        }
        .cb_slide_panel.panel_bottom a.close {
            top: -41px;
            left: 20px;
        }*/
        .cb_slide_panel a.close:hover {
            background: #aaaaaa /*url(Images/AS/tools2.png) no-repeat*/;
            background-position: -40px 0;
        }

        .cb_slide_panel .inner {
            padding: 20px 0 0 20px;
            width: 248px;
        }
        .cb_slide_panel.loading .inner {
            min-height: 300px;
            background: url(../img/ajax-loader.gif) no-repeat scroll 50% 50% transparent
        }
        .cb_slide_panel h1 {
            color: #434343;
            font-size: 1.2em;
            /*margin: -0.15em 0 20px;
            text-shadow: 0 1px 0 #000000;*/
        }
        .cb_slide_panel h2 {
            /*border-bottom: 1px solid #276BB3;*/
            color: #434343;
            font-size: 1em;
            font-style: bold;
        }
        .cb_slide_panel ul {
            padding: 0 0 0 10px;
            list-style-type: none;
        }
        .cb_slide_panel ul li {
        }
        .cb_slide_panel ul li a {
            color: #bb292d;
            text-decoration: none;
        }
        .cb_slide_panel ul li a:hover {
            color: #9b2225;
        }

</style>


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
                    <li><a href="<%= ResolveUrl("~/PublicView.aspx") %>" id="current">Public View Map</a></li>
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
        </nav>
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
       <div class="grid-6">

            <p class="text-right text-small"><a href="#toolPanel1" data-slidepanel="panel">Tool 1</a> | <a href="#toolPanel2" data-slidepanel="panel">Tool 2</a></p>
           </div>
       <div class="grid-6">
          <div id="map"></div>
       </div>

    </div><!-- close container -->

    <div class="footer">
    <div class="container">
        <div class="grid-6">
            <hr class="no-space-bottom" />

            <p class="copyright">
                SC ArchSite<br />
                &copy; 2004 &#8211; 2014<br />
                Maintained by the <a href="http://artsandsciences.sc.edu/sciaa/">South Carolina Institute of Archaeology and Anthropology</a>
            </p>
        </div><!-- close 6 -->
    </div><!-- close container -->
    </div><!-- close footer -->

       <div id="panel1" class="cb_slide_panel">
			<div class="wrapper">
				<a href="#" class="close">Close</a>
				<div class="inner">
					<div class="wrapper">
					</div>
				</div>
			</div>
	    </div>
        <div id="toolPanel1" style="display:none"><p>This is panel 1</p></div>
        <div id="toolPanel2" style="display:none"><p>And this is panel 2</p></div>     
        <!-- Javascript -->
        <!-- In the footer for better performance -->
        <!--instantiate js plugins-->
<%--        <script type="text/javascript" src="Javascript/jquery-1.7.1.min.js"></script>--%>

        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
        <script type="text/javascript" src="Javascript/dropdowns.js"></script>
        <script src="Javascript/jquery.slidePanel.js"></script> 
        <script type="text/javascript">
            $(document).ready(function () {
                $('[data-slidepanel]').slidepanel({
                    orientation: 'right',
                    mode: 'overlay',
                    static: true
                });
            });
        </script>


        <!-- Google Analytics -->

<%--        <script type="text/javascript">
            var _gaq = _gaq || [];
            _gaq.push(['_setAccount', 'UA-47078138-1']);
            _gaq.push(['_setDomainName', "scarchsite.com"]);
            _gaq.push(['_trackPageview']);
            (function () {
                var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
                ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
                var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
            })();
        </script>--%>



    </form>
</body>

</html>

