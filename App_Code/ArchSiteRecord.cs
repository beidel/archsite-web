using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for ArchSiteRecord
/// </summary>
public class ArchSiteRecord
{
    public ArchSiteRecord()
    {
        //
        // TODO: Add constructor logic here
        //
    }

    public Int32 OBJECTID { get; set; }
    public String SITEID { get; set; }
    public String STATE { get; set; }
    public String COUNTY { get; set; }
    public String SITENUMBER { get; set; }
    public String RECORDEDBY { get; set; }
    public String AFFILIATION { get; set; }
    public DateTime RECORDEDDATE { get; set; }
    public String SITENAME { get; set; }
    public String PROJECT { get; set; }
    public String USGSQUADRANGLE { get; set; }
    public Int32 UTMZONE { get; set; }
    public Double EASTING { get; set; }
    public Double NORTHING { get; set; }
    public Double GPSEASTING { get; set; }
    public Double GPSNORTHING { get; set; }
    public String GPSUNITDESC { get; set; }
    public String AI_SURVEY { get; set; }
    public String AI_TESTING { get; set; }
    public String AI_EXCAVATION { get; set; }
    public String PROPERTYOWNER { get; set; }
    public String PHONENUMBER { get; set; }
    public String ADDRESS { get; set; }
    public String NRHP_ELIGIBLE { get; set; }
    public String NRHP_NONELIGIBLE { get; set; }
    public String NRHP_ADDWORK { get; set; }
    public String LOS_NATIONAL { get; set; }
    public String LOS_STATE { get; set; }
    public String LOS_LOCAL { get; set; }
    public Int32 PROVINCE { get; set; }
    public String LANDFORMLOCATION { get; set; }
    public Double SITEELEVATION { get; set; }
    public Int32 SOILTYPE { get; set; }
    public String SOILCLASSIFICATION { get; set; }
    public Int32 MAJORRIVER { get; set; }
    public String NEARESTRIVERSTREAM { get; set; }
    public String CV_PINECONF { get; set; }
    public String CV_HARDWOOD { get; set; }
    public String CV_MIXEDPINEHW { get; set; }
    public String CV_OLDFIELD { get; set; }
    public String CV_GRASSPASTURE { get; set; }
    public String CV_AGRICULTURE { get; set; }
    public String CV_WETLANDSFRESHWAT { get; set; }
    public String CV_WETLANDSSALTWAT { get; set; }
    public String CV_OTHER { get; set; }
    public Int32 COVERTYPE { get; set; }
    public Double SITELENGTH { get; set; }
    public Double SITEWIDTH { get; set; }
    public Double SITEDEPTH { get; set; }
    public String NH_MIDDEN { get; set; }
    public String NH_FLORAL { get; set; }
    public String NH_FAUNA { get; set; }
    public String NH_SHELL { get; set; }
    public String NH_CHARCOAL { get; set; }
    public Int32 HUMANREMAINS { get; set; }
    public Int32 HUMANREMAINSPRESERVATION { get; set; }
    public String ARC_PALEO { get; set; }
    public String ARC_EARLYARCHAIC { get; set; }
    public String ARC_MIDDLEARCHAIC { get; set; }
    public String ARC_LATEARCHAIC { get; set; }
    public String ARC_ANYARCHAIC { get; set; }
    public String ARC_EARLYWOODLAND { get; set; }
    public String ARC_MIDDLEWOODLAND { get; set; }
    public String ARC_LATEWOODLAND { get; set; }
    public String ARC_ANYWOODLAND { get; set; }
    public String ARC_MISSISSIPPIAN { get; set; }
    public String ARC_LATEPREHISTORIC { get; set; }
    public String ARC_UNKNOWNPREHISTORIC { get; set; }
    public String ARC_ERAPREHISTORIC { get; set; }
    public String ARC_16CENTURY { get; set; }
    public String ARC_17CENTURY { get; set; }
    public String ARC_18CENTURY { get; set; }
    public String ARC_19CENTURY { get; set; }
    public String ARC_20CENTURY { get; set; }
    public String ARC_UNKNOWNHISTORIC { get; set; }
    public Int32 TOTALARTIFACTS { get; set; }
    public String VIS_0 { get; set; }
    public String VIS_1_25 { get; set; }
    public String VIS_26_50 { get; set; }
    public String VIS_51_75 { get; set; }
    public String VIS_76_100 { get; set; }
    public Double TOTALHOURSCOLLECTING { get; set; }
    public String CT_GRID { get; set; }
    public String CT_CONTROLLED { get; set; }
    public String CT_GRAB { get; set; }
    public String CT_OTHER { get; set; }
    public String COLEXT_COMPLETE { get; set; }
    public String COLEXT_SELECTIVE { get; set; }
    public String COLEXT_NO_COLLECT { get; set; }
    public Int32 TESTINGMETHOD { get; set; }
    public Int32 TU_AUGER_NUM { get; set; }
    public Double TU_AUGER_SIZE { get; set; }
    public Double TU_AUGER_DEPTH { get; set; }
    public Int32 TU_POSTHOLE_NUM { get; set; }
    public Double TU_POSTHOLE_SIZE { get; set; }
    public Double TU_POSTHOLE_DEPTH { get; set; }
    public Int32 TU_SHOVEL_NUM { get; set; }
    public Double TU_SHOVEL_SIZE { get; set; }
    public Double TU_SHOVEL_DEPTH { get; set; }
    public Int32 TU_OTHER_NUM { get; set; }
    public Double TU_OTHER_SIZE { get; set; }
    public Double TU_OTHER_DEPTH { get; set; }
    public Int32 EXCAVNUMBER { get; set; }
    public Double EXCAVSIZE { get; set; }
    public Double EXCAVDEPTH { get; set; }
    public String LU_AGRICULTURE { get; set; }
    public String LU_FOREST { get; set; }
    public String LU_FALLOW { get; set; }
    public String LU_RESIDENTIALLD { get; set; }
    public String LU_RESIDENTIALHD { get; set; }
    public String LU_COMMERCIAL { get; set; }
    public String LU_INDUSTRIAL { get; set; }
    public String LU_OTHER { get; set; }
    public Int32 SITEINTEGRITY { get; set; }
    public Int32 DAMAGEEXTENT { get; set; }
    public String DAMAGE_EROSION { get; set; }
    public String DAMAGE_CULTIVATION { get; set; }
    public String DAMAGE_LOGGING { get; set; }
    public String DAMAGE_CONSTRUCTION { get; set; }
    public String DAMAGE_VANDALISM { get; set; }
    public String DAMAGE_INUNDATION { get; set; }
    public String DAMAGE_OTHER { get; set; }
    public Int32 THREATPOTENTIAL { get; set; }
    public String THREAT_EROSION { get; set; }
    public String THREAT_CULTIVATION { get; set; }
    public String THREAT_LOGGING { get; set; }
    public String THREAT_CONSTRUCTION { get; set; }
    public String THREAT_VANDALISM { get; set; }
    public String THREAT_INUNDATION { get; set; }
    public String THREAT_OTHER { get; set; }
    public String REC_SURVEY { get; set; }
    public String REC_TESTING { get; set; }
    public String REC_EXCAVATION { get; set; }
    public String REC_ARCHIVAL { get; set; }
    public String REC_NONE { get; set; }
    public String REC_OTHER { get; set; }
    public Int32 IMPACTZONE { get; set; }
    public Int32 ARCHIVE { get; set; }
    public Int32 GROUPID { get; set; }
    public Int32 HISTORICALARCHIVALDOC { get; set; }
    public Int32 ARCHAEOLOGICALDOC { get; set; }
    public String COLLECTIONSLOCATION { get; set; }
    public String PHOTOLOCATION { get; set; }
    public String SAMPLELOCATION { get; set; }
    public String SAMPLETYPE { get; set; }
    public String DST_PREHISTORIC { get; set; }
    public String DST_HISTORIC { get; set; }
    public String OTHERMAPREFNOTES { get; set; }
    public String OTHERSITEDESIGNATIONS { get; set; }
    public String JUSTIFICATION { get; set; }
    public String VEGCOMMENTS { get; set; }
    public String CULTURALFEATURES { get; set; }
    public String GENERALSITEDESCRIPTION { get; set; }
    public String LOCATIONDESCRIPTION { get; set; }
    public String COLLECTIONCOMMENTS { get; set; }
    public String EXCAVATIONCOMMENTS { get; set; }
    public String LANDUSECOMMENTS { get; set; }
    public String DAMAGECOMMENTS { get; set; }
    public String THREATCOMMENTS { get; set; }
    public String RECOMMENDCOMMENTS { get; set; }
    public String HISTORICALARCHIVALDOCNOTES { get; set; }
    public String ARCHAEOLOGICALDOCNOTES { get; set; }
    public String MANAGEMENTCOMMENTS { get; set; }
    public DateTime SITEENTEREDINDBDATE { get; set; }
    public Int32 DETERMINATION { get; set; }
    public DateTime DATEDETERMINED { get; set; }
    public Int32 ONNRHP { get; set; }
    public DateTime NRHPDATE { get; set; }
    public String RECORD_OWNER { get; set; }
    public DateTime EDIT_DATE_FROM { get; set; }
    public DateTime EDIT_DATE_TO { get; set; }
    public String REVISIT { get; set; }
    public Int32 REVISITNUM { get; set; }
    public Int32 TRI3 { get; set; }
    public String TRI2 { get; set; }
    public Int32 MAPSCALE { get; set; }

    public String geometry { get; set; }
    public String extent { get; set; }

    public List<DataRecovered> DataRecoveredList { get; set; }

    public List<ExcavationUnit> ExcavationList { get; set; }

    public List<TestingUnit> TestingUnitList { get; set; }

}