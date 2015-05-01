define(["esri/layers/ArcGISDynamicMapServiceLayer", "esri/layers/FeatureLayer"], function (ArcGISDynamicMapServiceLayer, FeatureLayer) {
    var config = {
        "debug": true,
        "mainUrl": "http://www.scarchsite.com",
        "appid": "",
        "version": "v 2.2 April 2015",
        "webmap": "2f65ad9933014c72ab2cef582d23689e",
        "analysisGpServer": "http://analysis.arcgis.com/arcgis/rest/services/tasks/GPServer",
        "token": "VW8EeLqGBJKwEB3EhMEopqz8vB3j3ogEYA3Qf4tJcyv8JPNKopHSEvyR3NC9GC5mrfMOT7NuKOvjAXUytI9HidJCqRbyo28C6bgVKdVLtCPocxw79le-G53enyRQsUpe__-wSEApn9jWpNqUGmV9KYVAuClTE9wlvag09ncfeWx7QaZMIIcMQ1s7Q6uoKScb",
        "analysisToken": "0w_D6qW6gga9ywyO8I_v9F6cAXmYzxqVTVcI8Ozc5bo1FqG9FWjw0Jz9nL0lggrN3Tr6s6kKj366iz2OwYBlMqbWu7EKN8zbWhmNm29qRDaUp9qSjIyNhYzrV2psoAwB",
        "archsitename": "Archaeological Sites",
        "draftFeatureLayer": "http://services.arcgis.com/oEazpvC7G00gPDRM/arcgis/rest/services/ArchSites_Draft2/FeatureServer/0",
        "draftDataRecovTable": "http://services.arcgis.com/oEazpvC7G00gPDRM/arcgis/rest/services/ArchSites_Draft2/FeatureServer/3",
        "draftDocumentsTable": "http://services.arcgis.com/oEazpvC7G00gPDRM/arcgis/rest/services/ArchSites_Draft2/FeatureServer/1",
        "draftTestingUnitsTable": "http://services.arcgis.com/oEazpvC7G00gPDRM/arcgis/rest/services/ArchSites_Draft2/FeatureServer/5",
        "draftExcavationUnitsTable": "http://services.arcgis.com/oEazpvC7G00gPDRM/arcgis/rest/services/ArchSites_Draft2/FeatureServer/4",
        "draftCountyCodesTable": "http://services.arcgis.com/oEazpvC7G00gPDRM/arcgis/rest/services/ArchSites_Draft2/FeatureServer/2",
        "queryUtmLayer": "http://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/World_UTM_Grid/FeatureServer/0",
        "queryCountyLayer": "http://services.arcgis.com/oEazpvC7G00gPDRM/arcgis/rest/services/ReferenceLayers/FeatureServer/1",
        "queryPhyRegLayer": "http://services.arcgis.com/oEazpvC7G00gPDRM/arcgis/rest/services/ArchSite_Prod/FeatureServer/16",
        "querySoilsLayer": "http://server.arcgisonline.com/ArcGIS/rest/services/Specialty/Soil_Survey_Map/MapServer/0",
        "queryQuadLayer": "http://services.nationalmap.gov/ArcGIS/rest/services/map_indices/MapServer/9",
        "pdfLookupTableUrl": "http://services.arcgis.com/oEazpvC7G00gPDRM/arcgis/rest/services/SC_ArchSite_LKP/FeatureServer/1",
        "pdfBaseUrl": "http://www.scarchsite.org/PDFs/",
        "useArcGISOnlineBasemaps": true,
        "basemapGroupTitle": "Community Basemaps",
        "basemapGroupOwner": "esri",
        "pointGraphic": "images/map/bluepoint21x29.png",
        "proxyUrl": "http://scarchsite.com/proxy/proxy.ashx",
        "showSearchBox": true,
        "showAboutDialog": true,
        "showMeasureDialog": true,
        "showPrintDialog": true,
        "showAboutDialogOnLoad": false,
        "showAttributePane": true,
        "showAdminPane": true,
        "showEditSitePane": true,
        "exportLayers": [
            { title: "Archaeological Points" },
            { title: "Archaeological Sites" },
            { title: "National Register Points" },
            { title: "National Register Polygons" },
            { title: "Restricted National Register Points" },
            { title: "Historic Structures" },
            { title: "Historic Areas" }
        ],
        "searchLayers": [
            {
                title: "Archaeological Points",
                relId: "",
                checked: true,
                dispFields: ["SITENUMBER", "USGSQUADRANGLE"],
                fields: ["SITENUMBER", "USGSQUADRANGLE", "NRHP_STATUS", "PALEO_INDIAN", "EARLY_ARCHAIC", "MIDDLE_ARCHAIC", "LATE_ARCHAIC", "EARLY_WOODLAND",
                "MIDDLE_WOODLAND", "LATE_WOODLAND", "MISSISSIPPIAN", "UNKNOWN_PREHISTORIC", "CENTURY_16TH", "CENTURY_17TH", "CENTURY_18TH", "CENTURY_19TH",
                "CENTURY_20TH", "UNKNOWN_HISTORIC", "DATERECORDED", "GPSEASTING", "GPSNORTHING", "Revist"]
            },
            {
                title: "Archaeological Sites",
                relId: "SITEID",
                checked: true,
                dispFields: ["SITEID", "PROJECT", "COUNTY"],
                fields: ["OBJECTID", "SITENUMBER", "SITEID", "STATE", "COUNTY", "SITENUMBER", "RECORDEDBY", "AFFILIATION", "RECORDEDDATE", "SITENAME", "PROJECT", "USGSQUADRANGLE",
                    "UTMZONE", "EASTING", "NORTHING", "GPSEASTING", "GPSNORTHING", "GPSUNITDESC", "AI_SURVEY", "AI_TESTING", "AI_EXCAVATION", "PROPERTYOWNER", "PHONENUMBER",
                    "ADDRESS", "NRHP_ELIGIBLE", "NRHP_NONELIGIBLE", "NRHP_ADDWORK", "LOS_NATIONAL", "LOS_STATE", "LOS_LOCAL", "PROVINCE", "LANDFORMLOCATION", "SITEELEVATION",
                    "SOILTYPE", "SOILCLASSIFICATION", "MAJORRIVER", "NEARESTRIVERSTREAM", "CV_PINECONF", "CV_HARDWOOD", "CV_MIXEDPINEHW", "CV_OLDFIELD", "CV_GRASSPASTURE",
                    "CV_AGRICULTURE", "CV_WETLANDSFRESHWAT", "CV_WETLANDSSALTWAT", "CV_OTHER", "COVERTYPE", "SITELENGTH", "SITEWIDTH", "SITEDEPTH", "NH_MIDDEN", "NH_FLORAL",
                    "NH_FAUNA", "NH_SHELL", "NH_CHARCOAL", "HUMANREMAINS", "HUMANREMAINSPRESERVATION", "ARC_PALEO", "ARC_EARLYARCHAIC", "ARC_MIDDLEARCHAIC", "ARC_LATEARCHAIC",
                    "ARC_ANYARCHAIC", "ARC_EARLYWOODLAND", "ARC_MIDDLEWOODLAND", "ARC_LATEWOODLAND", "ARC_ANYWOODLAND", "ARC_MISSISSIPPIAN", "ARC_LATEPREHISTORIC",
                    "ARC_UNKNOWNPREHISTORIC", "ARC_ERAPREHISTORIC", "ARC_16CENTURY", "ARC_17CENTURY", "ARC_18CENTURY", "ARC_19CENTURY", "ARC_20CENTURY", "ARC_UNKNOWNHISTORIC",
                    "TOTALARTIFACTS", "VIS_0", "VIS_1_25", "VIS_26_50", "VIS_51_75", "VIS_76_100", "TOTALHOURSCOLLECTING", "CT_GRID", "CT_CONTROLLED", "CT_GRAB", "CT_OTHER",
                    "COLEXT_COMPLETE", "COLEXT_SELECTIVE", "COLEXT_NO_COLLECT", "TESTINGMETHOD", "TU_AUGER_NUM", "TU_AUGER_SIZE", "TU_AUGER_DEPTH", "TU_POSTHOLE_NUM",
                    "TU_POSTHOLE_SIZE", "TU_POSTHOLE_DEPTH", "TU_SHOVEL_NUM", "TU_SHOVEL_SIZE", "TU_SHOVEL_DEPTH", "TU_OTHER_NUM", "TU_OTHER_SIZE", "TU_OTHER_DEPTH",
                    "EXCAVNUMBER", "EXCAVSIZE", "EXCAVDEPTH", "LU_AGRICULTURE", "LU_FOREST", "LU_FALLOW", "LU_RESIDENTIALLD", "LU_RESIDENTIALHD", "LU_COMMERCIAL",
                    "LU_INDUSTRIAL", "LU_OTHER", "SITEINTEGRITY", "DAMAGEEXTENT", "DAMAGE_EROSION", "DAMAGE_CULTIVATION", "DAMAGE_LOGGING", "DAMAGE_CONSTRUCTION",
                    "DAMAGE_VANDALISM", "DAMAGE_INUNDATION", "DAMAGE_OTHER", "THREATPOTENTIAL", "THREAT_EROSION", "THREAT_CULTIVATION", "THREAT_LOGGING", "THREAT_CONSTRUCTION",
                    "THREAT_VANDALISM", "THREAT_INUNDATION", "THREAT_OTHER", "REC_SURVEY", "REC_TESTING", "REC_EXCAVATION", "REC_ARCHIVAL", "REC_NONE", "REC_OTHER",
                    "IMPACTZONE", "ARCHIVE", "GROUPID", "HISTORICALARCHIVALDOC", "ARCHAEOLOGICALDOC", "COLLECTIONSLOCATION", "PHOTOLOCATION", "SAMPLELOCATION", "SAMPLETYPE",
                    "DST_PREHISTORIC", "DST_HISTORIC", "OTHERMAPREFNOTES", "OTHERSITEDESIGNATIONS", "JUSTIFICATION", "VEGCOMMENTS", "CULTURALFEATURES", "GENERALSITEDESCRIPTION",
                    "LOCATIONDESCRIPTION", "COLLECTIONCOMMENTS", "EXCAVATIONCOMMENTS", "LANDUSECOMMENTS", "DAMAGECOMMENTS", "THREATCOMMENTS", "RECOMMENDCOMMENTS",
                    "HISTORICALARCHIVALDOCNOTES", "ARCHAEOLOGICALDOCNOTES", "MANAGEMENTCOMMENTS", "SITEENTEREDINDBDATE", "DETERMINATION", "DATEDETERMINED", "ONNRHP",
                    "NRHPDATE", "MAPSCALE"]
            },
            {
                title: "National Register Points",
                relId: "",
                checked: true,
                dispFields: ["RESOURCE_NAME", "ADDRESS", "CITY", "COUNTY"],
                fields: ["RESOURCE_NAME", "ADDRESS", "CITY", "COUNTY", "ACREAGE", "CERTIFICATION", "CERTIFICATION_DATE", "YEAR_OF_SIGNIFICANCE",
                "LEVEL_OF_SIGNIFICANCE", "AREA_OF_SIGNIFICANCE", "COUNTY_CODE", "SHPO_SITE_NO", "HOTLINK"]
            },
            {
                title: "National Register Polygons",
                relId: "",
                checked: true,
                dispFields: ["RESOURCE_NAME", "ADDRESS", "CITY", "COUNTY"],
                fields: ["RESOURCE_NAME", "ADDRESS", "CITY", "COUNTY", "ACREAGE", "CERTIFICATION", "CERTIFICATION_DATE", "YEAR_OF_SIGNIFICANCE",
                "LEVEL_OF_SIGNIFICANCE", "AREA_OF_SIGNIFICANCE", "COUNTY_CODE", "SHPO_SITE_NO", "HOTLINK"]
            },
            {
                title: "Restricted National Register Points",
                relId: "",
                checked: true,
                dispFields: ["RESOURCE_NAME", "ADDRESS", "CITY", "COUNTY"],
                fields: ["RESOURCE_NAME", "ADDRESS", "CITY", "COUNTY", "ACREAGE", "CERTIFICATION", "CERTIFICATION_DATE", "YEAR_OF_SIGNIFICANCE",
                "LEVEL_OF_SIGNIFICANCE", "AREA_OF_SIGNIFICANCE", "COUNTY_CODE", "SHPO_SITE_NO", "HOTLINK"]
            },
            {
                title: "Restricted National Register Polygons",
                relId: "",
                checked: true,
                dispFields: ["RESOURCE_NAME", "ADDRESS", "CITY", "COUNTY"],
                fields: ["RESOURCE_NAME", "ADDRESS", "CITY", "COUNTY", "ACREAGE", "CERTIFICATION", "CERTIFICATION_DATE", "YEAR_OF_SIGNIFICANCE",
                "LEVEL_OF_SIGNIFICANCE", "AREA_OF_SIGNIFICANCE", "COUNTY_CODE", "SHPO_SITE_NO", "HOTLINK"]
            },
            {
                title: "Historic Structures",
                relId: "",
                checked: true,
                dispFields: ["SITE_NUMBER", "RESOURCE_NAME", "COUNTY"],
                fields: ["SITE_NUMBER", "RESOURCE_NAME", "NR_ELIGIBILITY", "DATE_", "ADDRESS", "CITY", "COUNTY", "REPORT_TITLE", "NOTES", "HYPERLINK", "COUNTY_CODE"]
            },
            {
                title: "Historic Areas",
                relId: "",
                checked: true,
                dispFields: ["SITE_NUMBER", "RESOURCE_NAME", "COUNTY"],
                fields: ["SITE_NUMBER", "RESOURCE_NAME", "NR_ELIGIBILITY", "DATE_", "ADDRESS", "CITY", "COUNTY", "REPORT_TITLE", "NOTES", "COUNTY_CODE"]
            },
            {
                title: "Civil War Earthworks",
                relId: "",
                checked: true,
                dispFields: ["REPORT_SURVEY_NUMBER ", "RESOURCE_NAME", "REPORT_TITLE"],
                fields: ["REPORT_SURVEY_NUMBER ", "RESOURCE_NAME", "REPORT_TITLE"]
            },
            {
                title: "Survey Lines",
                relId: "",
                checked: true,
                dispFields: ["SURVEY_NAME", "SURVEY_DATE", "COUNTY"],
                fields: ["SURVEY_NAME", "SURVEY_DATE", "AGENCY", "CONSULTANT", "AUTHORS", "TYPE", "COUNTY", "ARCH_SITES", "AG_SITES", "NOTES"]
            },
            {
                title: "Survey Areas",
                relId: "",
                checked: true,
                dispFields: ["SURVEY_NAME", "_DATE", "COUNTY"],
                fields: ["SURVEY_NAME", "_DATE", "AGENCY", "CONSULTANT", "TYPE", "COUNTY", "ARCH_SITES", "AG_SITES", "NOTES", "AUTHORS_GEO"]
            },
            {
                title: "Covenants",
                relId: "",
                checked: false,
                dispFields: ["PROPERTY_N ", "EXPIRATION"],
                fields: ["PROPERTY_N ", "EXPIRATION"]
            }
        ],
        "videos": [
        {
            filename: "http://scarchsite.org/videos/ArchSite_Intro.mp4",
            type: "MP4",
            desc: "Introduction (MP4)"
        }, {
            filename: "http://scarchsite.org/videos/Intro.webm",
            type: "WEBM",
            desc: "Introduction (WEBM)"
        }, {
            filename: "http://scarchsite.org/videos/ArchSite_Toolbar.mp4",
            type: "MP4",
            desc: "How to use the tooolbar (MP4)"
        }, {
            filename: "http://scarchsite.org/videos/Primary Toolbar.webm",
            type: "WEBM",
            desc: "How to use the tooolbar (WEBM)"
        }, {
            filename: "http://scarchsite.org/videos/ArchSite_CreateSites.mp4",
            type: "MP4",
        desc: "How to create sites (MP4)"
        }, {
            filename: "http://scarchsite.org/videos/CreateSites.webm",
            type: "WEBM",
            desc: "How to create sites (WEBM)"
    }
        ],
        domains: [{fieldname: 'PROVINCE', domain: [{value: 0, desc: 'Lower Coastal Plain'},
            {value: 1, desc: 'Middle Coastal Plain'},
            {value: 2, desc: 'Upper Coastal Plain'},
            {value: 3, desc: 'Piedmont'},
            {value: 4, desc: 'Blue Ridge Mountains'}
            ]},
            {fieldname: 'SOILTYPE', domain: [{value: 0, desc: 'Clay'},
            {value: 1, desc: 'Clay/Loam'},
            {value: 2, desc: 'Silty/Clay'},
            {value: 3, desc: 'Sandy/Clay/Loam'},
            {value: 4, desc: 'Sandy/Loam'},
            {value: 5, desc: 'Sand'},
            {value: 6, desc: 'Silt'},
            {value: 7, desc: 'Silty/Loam'},
            {value: 8, desc: 'Sandy/Clay'},
            {value: 9, desc: 'Silty/Clay/Loam'},
            {value: 10, desc: 'Loam'},
            {value: 11, desc: 'Loam/Sand'},
            {value: 12, desc: 'Gravel'},
            {value: 13, desc: 'Organic'},
            {value: 14, desc: 'Other'}
            ]},
            {fieldname: 'MAJORRIVER', domain: [{value: 0, desc: 'Pee Dee'},
            {value: 1, desc: 'Santee'},
            {value: 2, desc: 'Ashley-Combahee-Edisto'},
            {value: 3, desc: 'Savannah'}
            ]},
            {fieldname: 'COVERTYPE', domain: [{value: 0, desc: 'Absent'},
            {value: 1, desc: 'Light'},
            {value: 2, desc: 'Moderate'},
            {value: 3, desc: 'Heavy'}
            ]},
            {fieldname: 'HUMANREMAINS', domain: [{value: 0, desc: 'Present'},
            {value: 1, desc: 'Absent'},
            {value: 2, desc: 'Unknown'}
            ]},
            {fieldname: 'HUMANREMAINSPRESERVATION', domain: [{value: 0, desc: 'Poor'},
            {value: 1, desc: 'Good'},
            {value: 2, desc: 'Unknown'}
            ]},
            {fieldname: 'TESTINGMETHOD', domain: [{value: 0, desc: 'Systematic'},
            {value: 1, desc: 'Non Systematic'}
            ]},
            {fieldname: 'SITEINTEGRITY', domain: [{value: 0, desc: 'Intact'},
            {value: 1, desc: 'Damaged'},
            {value: 2, desc: 'Unknown'}
            ]},
            {fieldname: 'DAMAGEEXTENT', domain: [{value: 0, desc: 'Light'},
            {value: 1, desc: 'Moderate'},
            {value: 2, desc: 'Heavy'}
            ]},
            {fieldname: 'THREATPOTENTIAL', domain: [{value: 0, desc: 'None'},
            {value: 1, desc: 'Low'},
            {value: 2, desc: 'Moderate'},
            {value: 3, desc: 'High'}
            ]},
            {fieldname: 'IMPACTZONE', domain: [{value: 0, desc: 'Direct Impact Zone'},
            {value: 1, desc: 'Indirect Impact Zone'},
            {value: 2, desc: 'Outside Impact Zone'},
            {value: 3, desc: 'Indeterminate'}
            ]},
            {fieldname: 'ARCHIVE', domain: [{value: 0, desc: 'No'},
            {value: 1, desc: 'Yes'}
            ]},
            {fieldname: 'HISTORICALARCHIVALDOC', domain: [{value: 0, desc: 'Yes'},
            {value: 1, desc: 'No'},
            {value: 2, desc: 'Unknown'}
            ]},
            {fieldname: 'ARCHAEOLOGICALDOC', domain: [{value: 0, desc: 'Yes'},
            {value: 1, desc: 'No'},
            {value: 2, desc: 'Unknown'}
            ]},
            {fieldname: 'DETERMINATION', domain: [{value: 0, desc: 'Eligible'},
            {value: 1, desc: 'Not Eligible'}
            ]},
            {fieldname: 'ONNRHP', domain: [{ value: 0, desc: 'Yes' },
            {value: 1, desc: 'No'},
            {value: 2, desc: 'Unknown'}
            ]}],
        "locateName": "",
        "locatePoint": ""
    };
    return config;
});
