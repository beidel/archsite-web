define({
    //Default configuration settings for the applciation. This is where you"ll define things like a bing maps key,
    //default web map, default app color theme and more. These values can be overwritten by template configuration settings
    //and url parameters.
    "appid": "",
    "webmap": "9e8f8fd1fd914e43b4d6efcb1f08b036",
    "printUrl": "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task",
    "searchLayers": [{ "name": "National Register Points", "displayField": "RESOURCE_NAME", "url": "http://services.arcgis.com/oEazpvC7G00gPDRM/arcgis/rest/services/ArchSite_Public/FeatureServer/1" },
        { "name": "National Register Polygons", "displayField": "RESOURCE_NAME", "url": "http://services.arcgis.com/oEazpvC7G00gPDRM/arcgis/rest/services/ArchSite_Public/FeatureServer/2" },
        { "name": "Historic Structures", "displayField": "RESOURCE_NAME", "url": "http://services.arcgis.com/oEazpvC7G00gPDRM/arcgis/rest/services/ArchSite_Public/FeatureServer/4" },
        { "name": "Historic Areas", "displayField": "RESOURCE_NAME", "url": "http://services.arcgis.com/oEazpvC7G00gPDRM/arcgis/rest/services/ArchSite_Public/FeatureServer/5" }],
    "geometryServiceUrl": "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/Geometry/GeometryServer",
    "oauthappid": null,
    //Enter the url to the proxy if needed by the applcation. See the "Using the proxy page" help topic for details
    //developers.arcgis.com/en/javascript/jshelp/ags_proxy.html
    "proxyurl": "",
    //Example of a template specific property. If your template had several color schemes
    //you could define the default here and setup configuration settings to allow users to choose a different
    //color theme.
    "title": "",
    "summary": "",
    "defaultPanel": "legend",
    "enableSummaryInfo": true,
    "enableSearch": true,
    "enableLegendPanel": true,
    "enableAboutPanel": false,
    "enableLayersPanel": true,
    "enableHomeButton": true,
    "enableLocateButton": true,
    "enablePrintButton": true,
    "enableBasemapToggle": true,
    "enableShareDialog": false,
    "enableBookmarks": true,
    "enableOverviewMap": true,
    "openOverviewMap": false,
    "enableModifiedDate": true,
    "enableMoreInfo": true,
    "defaultBasemap": "topo",
    "nextBasemap": "hybrid",
    "swipeType": "vertical",
    "swipeInvertPlacement": true,
    "hideNotesLayerPopups": true,
    "enableInstagram": false,
    "instagramVisible": false,
    "instagramTime": "",
    "enableFlickr": false,
    "flickrVisible": false,
    "flickrSearch": "",
    "flickrTime": "",
    "enableTwitter": false,
    "twitterVisible": false,
    "twitterSearch": "",
    "enableWebcams": false,
    "webcamsVisible": false,
    "enableYouTube": false,
    "youtubeVisible": false,
    "youtubeSearch": "",
    "youtubeTime": "all_time", // today, this_week, this_month, all_time
    "bitlyLogin": "esri",
    "bitlyKey": "R_65fd9891cd882e2a96b99d4bda1be00e",
    "twitterUrl": location.protocol + "//utility.arcgis.com/tproxy/proxy/1.1/search/tweets.json",
    "twitterSigninUrl": location.protocol + "//utility.arcgis.com/tproxy/signin",
    "flickr_key": "404ebea7d5bc27aa5251d1207620e99b",
    "webcams_key": "65939add1ebe8bc9cc4180763f5df2ca",
    "instagram_key": "288c36a1a42c49de9a2480a05d054619",
    "youtube_key": "AI39si5AmNrzX3VKNKo4Kcet9BVemrvyjl4B13ezBbNLsvKOlw9Vh3eL_57dZ2vC6M9PwV9i3bHm6emtZLr_BhQ8qtnTbvwzCw",
    /*
    "bannedUsersService": location.protocol + "//services.arcgis.com/QJfoC7c7Z2icolha/ArcGIS/rest/services/fai/FeatureServer/2",
    "bannedWordsService": location.protocol + "//tmservices1.esri.com/ArcGIS/rest/services/SharedTools/Filter/MapServer/1",
    "flagMailServer": location.protocol + "//tmappsevents.esri.com/Website/pim_fai/fai.php",
    */
    //Enter the url to your organizations bing maps key if you want to use bing basemaps
    "bingmapskey": "",
    //Defaults to arcgis.com. Set this value to your portal or organization host name.
    "sharinghost": location.protocol + "//" + "www.arcgis.com",
    //When true the template will query arcgis.com for default settings for helper services, units etc. If you 
    "units": null,
    "helperServices": {
        "geometry": {
            "url": null
        },
        "printTask": {
            "url": null
        },
        "elevationSync": {
            "url": null
        },
        "geocode": [{
            "url": null
           }]
    }
});