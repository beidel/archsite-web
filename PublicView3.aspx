<%@ Page Language="C#" AutoEventWireup="true" CodeFile="PublicView3.aspx.cs" Inherits="PublicView3" %>

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
    a.second:hover {
        text-decoration: none;
    }

    #modal { 
        display: none; 
    }
    #modal a { 
        /*color: #787878; 
        font-weight: bold;*/ 
        padding: 5px 10px; 
        border: none; 
    }
    /*#modal a:hover { 
        background: #aaa;
    }*/
    #pageslide {
        /* These styles MUST be included. Do not change. */
        display: none;
        position: absolute;
        position: fixed;
        top: 0;
        height: 100%;
        z-index: 999999;
    
        /* Specify the width of your pageslide here */
        width: 200px;
        padding: 20px;
    
        /* These styles are optional, and describe how the pageslide will look */
        background-color: #f9f9f9;
        color: #787878;
        border-left: thin #999 solid;
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
            <hr class="no-space-top no-space-bottom" />
            <p class="text-small text-right"><a href="#modal1" class="second">Print</a> | <a href="#modal2" class="second">Identify</a> | <a href="#modal3" class="second">Buffer</a></p>
        </div>

      <div class="grid-6">



        <div id="map"></div>


      </div><!-- close grid-6 -->
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

        <div id="modal1" style="display:none">
            <h2>Tools </h2>
            <ul>
                <li><a href="#">Print</a></li>
                <li><a href="#">Identify</a></li>
                <li><a href="#">Geocode</a></li>
                <li><a href="#">Buffer</a></li>
            </ul>
            <a href="javascript:$.pageslide.close()" class="btn">Close</a>
        </div>

        <div id="modal2" style="display:none">
            <h2>Tools </h2>
            <ul>
                <li><a href="#">one</a></li>
                <li><a href="#">two</a></li>
                <li><a href="#">three</a></li>
                <li><a href="#">four</a></li>
            </ul>
            <a href="javascript:$.pageslide.close()" class="btn">Close</a>
        </div>

        <div id="modal3" style="display:none">
            <h2>Tools </h2>
            <ul>
                <li><a href="#">cats</a></li>
                <li><a href="#">dogs</a></li>
                <li><a href="#">bunnies</a></li>
                <li><a href="#">frogs</a></li>
            </ul>
            <a href="javascript:$.pageslide.close()" class="btn">Close</a>
        </div>
        <!-- Javascript -->
        <!-- In the footer for better performance -->
        <!--instantiate js plugins-->
        <script type="text/javascript" src="Javascript/jquery-1.7.1.min.js"></script>
        <script type="text/javascript" src="Javascript/dropdowns.js"></script>
        <script type="text/javascript" src="Javascript/jquery.pageslide.min.js"></script>
        <script>
            /* Default pageslide, moves to the right */
            //$(".first").pageslide();
            /* Slide to the left, and make it modal (you'll have to call $.pageslide.close() to close) */
            $(".second").pageslide({ direction: "left", modal: true });
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
