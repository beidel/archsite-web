<%@ Page Language="C#" AutoEventWireup="true" CodeFile="map.aspx.cs" Inherits="Map_map" %>
<!DOCTYPE HTML>
<html>
<head>
<meta charset="utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" />
<title></title>
<meta name="Keywords" content="Archaeological Sites">
<meta name="Description" content="SC Archaeological Sites Application">
<!-- iOS -->
<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<link rel="apple-touch-icon" href="images/ui/apple-touch-icon.png" />
<!-- End iOS -->
<!-- CSS -->
<link rel="stylesheet" type="text/css" href="css/normalize.css" />
<link rel="stylesheet" type="text/css" href="css/application.css" />
<link rel="stylesheet" type="text/css" href="css/mediaQueries.css" />
<link rel="stylesheet" type="text/css" href="css/geocoder.css" />
<link rel="stylesheet" type="text/css" href="css/dijit.css" />
<link rel="stylesheet" href="css/bootstrap.min.css">
<link rel="stylesheet" href="http://js.arcgis.com/3.8/js/dgrid/css/dgrid.css" />
<link rel="stylesheet" href="http://js.arcgis.com/3.8/js/dojo/dijit/themes/claro/claro.css" />
<link rel="stylesheet" type="text/css" href="//js.arcgis.com/3.8/js/esri/css/esri.css" />
<link rel="stylesheet" href="js/modules/edit/css/EditSite.css" />
    <link rel="stylesheet" href="js/modules/adminview/css/AdminView.css" />
<link rel="stylesheet" href="js/modules/attrtable/css/AttrTable.css" />
<link rel="stylesheet" href="js/modules/scaleselector/css/ScaleSelector.css" />
<link rel="stylesheet" href="js/modules/revisits/css/Revisits.css" />
<link rel="stylesheet" href="js/modules/drawmeasure/css/DrawMeasure.css" />
<link rel="stylesheet" href="js/modules/dataexport/css/DataExport.css" />
<!--[if gte IE 9]>
<link rel="stylesheet" type="text/css" href="css/ie9.css">
<![endif]-->
<!-- End CSS -->
</head>
<body class="claro">
	<div id="mapcon" class="usc">
		<div id="map" dir="ltr">
            <div id="mapLoading" class="mapLoading">
        <div class="center">
            <span class='mapLoadingTitle1'>Arch</span><span class='mapLoadingTitle2'>Site</span><br />
            <span class="mapLoadingImage"></span><br />
            <span id="mapLoadingMessage" class="mapLoadingMessage">Loading....</span>
        </div>       
    </div>
		</div>
        <div id="homeButton"></div>
        <div id="locateButton"></div>
        <div id="navPanel"></div>
		<div id="zoomSlider"></div>
		<div id="topMenuBar">
			<div id="topMenuCon">
				<div id="topMenuLeft">
					<h1 id="mapTitle"></h1>
					<div id="locateBox">
    					<div id="geocoderSearch"></div> 
					</div>
					<div class="buttonCon">
					   <div id="scaleSelector"></div>
					   <div class="clear"></div>
					</div>
				</div>
				<div id="topMenuRight">
					<div id="aboutMapCon"></div>
                    <div id="attributeCon"></div>
					<div id="menuList"></div>
					<div class="clear"></div>
				</div>
			</div>
		</div>
		<div id="settingsDialog"></div>
		<div id="alertDialog"></div>
		<div id="aboutDialog"></div>
        <div id="editSitePane" class="editSitePane"></div>
        <div id="adminPane" class="adminPane"></div>
        <div id="attributePane" class="attributePane"></div>

	</div>
	<!-- JavaScript -->
    <script type="text/javascript">
        var _gaq = _gaq || [];
        _gaq.push(['_setAccount', 'UA-47078138-1']);
        _gaq.push(['_setDomainName', ".scarchsite.com"]);
        _gaq.push(['_trackPageview']);
        (function () {
            var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
            ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
        })();
    </script>
    <script type="text/javascript" src="js/application/djConfig.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <script type='text/javascript' src='js/plugins/knockout-3.2.0.js'></script>
    <script type='text/javascript' src='js/plugins/bootstrap.min.js'></script>
    <script type="text/javascript" src="//js.arcgis.com/3.8/"></script>
    <script type="text/javascript" src="js/plugins/respond.js"></script>
    
    <script type="text/javascript">
        //window.onbeforeunload = function () { return "Please do not use the back button."; };

        require(["application/main", "config/config"], function (application, configOptions) {
            configOptions.token = "<%=Session["agol_token"]%>";
            configOptions.analysisToken = "<%=Session["agol_analysis_token"]%>";
            configOptions.displayname = "<%=Session["DISPLAYNAME"]%>";
            configOptions.affiliation = "<%=Session["AFFILIATION"]%>";
            configOptions.userid = "<%=Session["username"]%>";
            application(configOptions);
        });
    </script>
    <!-- End JavaScript -->
</body>
</html>
   
