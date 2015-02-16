<%@ Page Language="C#" AutoEventWireup="true" CodeFile="PublicViewOld.aspx.cs" Inherits="PublicViewOld" %>

<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="initial-scale=1, maximum-scale=1,user-scalable=no"/>
    <title>SC ArchSite Public Map</title>
    <link rel="stylesheet" href="styles/kraken.css">
    <link rel="stylesheet" href="styles/scarch5.css">
    <link rel="stylesheet" href="http://js.arcgis.com/3.9/js/esri/css/esri.css">
    <style>
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
                        <li><a href="#">Print</a></li>
                        <li><a href="#">Identify</a></li>
                        <li><a href="#">Geocode</a></li>
                    </ul>
                </div><!-- close nav collapse -->
            </nav>
        </div><!-- close six -->
    </div><!-- close container -->

    <div class="container">
        <div class="grid-6 logo">
            <h1 class="no-space-bottom no-space-top header"><a href="default.aspx">SC <span class="arch">Arch</span><span class="site">Site</span></a> <span class="sublogo">SCIAA&nbsp;+&nbsp;SCDAH</span>
                    <img src="Images/AS/logos60x89.png" />
            </h1>
        </div><!-- close six logo -->

        <div class="grid-6">
            <h2 class="pageTitle">Public View ArchSite Map</h2>
        </div>
    </div><!-- close container -->

    <div class="container">
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



        <!-- Javascript -->
        <!-- In the footer for better performance -->
        <!--instantiate js plugins-->
        <script type="text/javascript" src="Javascript/jquery-1.7.1.min.js"></script>
        <script type="text/javascript" src="Javascript/dropdowns.js"></script>

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