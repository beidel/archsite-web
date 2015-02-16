using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using iTextSharp.text;
using iTextSharp.text.pdf;
using System.Data;
using System.Drawing;


using System.IO;
using System.Configuration;

public partial class PDFCreator : System.Web.UI.Page
{
    private float cellHeight = 0;

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!System.Web.HttpContext.Current.User.Identity.IsAuthenticated || Session["agol_token"] == null)
       {
            Response.Redirect("Default.aspx");
        }

        string siteID = Request.QueryString["siteid"];
        //int siteOID = Convert.ToInt32(siteID);
        //Session["agol_token"] = "9jPtLvPjjcIL9q_TyPQEL7i77886EKX_ai7PKcgwEZwUQFQ9z-kBMJ57kd6L6BPMhznrIg5LrP0DbL7SYt4DhT74jdsKeNN-l1XJpJi-ANKGa0opFBvOu3eYUiFH4pYsXV6N0HaYCl7MBejCLAd68Q..";

        FeatureQueryAgol fga = new FeatureQueryAgol();
        ArchSiteRecord asr = fga.getArchSiteRecord(siteID, "9jPtLvPjjcIL9q_TyPQEL7i77886EKX_ai7PKcgwEZwUQFQ9z-kBMJ57kd6L6BPMhznrIg5LrP0DbL7SYt4DhT74jdsKeNN-l1XJpJi-ANKGa0opFBvOu3eYUiFH4pYsXV6N0HaYCl7MBejCLAd68Q.."); 
        //DataSet ds = fga.getSiteBySiteID(Convert.ToInt32(siteOID));
        createPDFTemplate2(asr);
    }

    private void createPDFTemplate2(ArchSiteRecord asr)
    {
        iTextSharp.text.Document doc = null;

     

            string sSiteNo = asr.SITENUMBER;
            //iTextSharp.text.Document doc = new Document(PageSize.LETTER, 36, 36, 36, 36);
            doc = new Document(PageSize.LETTER);
            Response.ContentType = "application/pdf";

            //string exportPath = System.Configuration.ConfigurationSettings.AppSettings["outputPath"];
            string exportPath = System.Web.Hosting.HostingEnvironment.MapPath(HttpContext.Current.Request.ApplicationPath);
            string fullPath = exportPath + "\\" + "PDF\\_ags_" + asr.SITEID + "myPDF.pdf";
            iTextSharp.text.pdf.PdfWriter writer = iTextSharp.text.pdf.PdfWriter.GetInstance(doc, new FileStream(fullPath, FileMode.Create));

            doc.Open();

            #region tableheader
            PdfPTable table1 = new PdfPTable(1);
            table1.HorizontalAlignment = Element.ALIGN_LEFT;
            table1.TotalWidth = 500;
            table1.LockedWidth = true;
            int[] headerwidths = { 500 };
            table1.SetWidths(headerwidths);
            //table1.WidthPercentage = 100;

            //table1.AbsWidth =  Convert.ToString(doc.Right - doc.Left);
            //table1.AddCell(" ");
            table1.AddCell(addNewCell("South Carolina Institute of Archaeology and Anthropology\nUniversity of South Carolina\nSite Inventory Record\n68-1 Rev.85", "center", "top", false, false, false, false, 63, false, 1));
            //table1.AddCell(" ");
            doc.Add(table1);
            #endregion

            #region overview
            PdfPTable table2 = new PdfPTable(6);
            table2.HorizontalAlignment = Element.ALIGN_LEFT;
            table2.TotalWidth = 500;
            table2.LockedWidth = true;
            //int[] headerwidths1 = {10,20,10,20,17,23};
            int[] headerwidths1 = { 50, 90, 60, 100, 85, 115 };
            table2.SetWidths(headerwidths1);
            //table2.WidthPercentage = 100;
            //table2.AbsWidth = Convert.ToString(doc.Right - doc.Left);

            string lgtext = "When casting between interfaces, it is perfectly acceptable to use implicit casts because there is no chance of data loss as there is when casting between numeric types. However, when casts fail, an exception (System.InvalidCastException) is thrown in box";
            table2.AddCell(addNewCell("STATE:", "left", "bottom", false, false, false, false, 18, false, 1));
            table2.AddCell(addNewCell("South Carolina", "left", "bottom", false, false, false, true, 18, false, 1));
            table2.AddCell(addNewCell("COUNTY:", "left", "bottom", false, false, false, false, 18, false, 1));
            table2.AddCell(addNewCell(asr.COUNTY, "left", "bottom", false, false, false, true, 18, false, 1));
            table2.AddCell(addNewCell("SITE NUMBER:", "left", "bottom", false, false, false, false, 18, false, 1));
            table2.AddCell(addNewCell(asr.SITENUMBER, "left", "bottom", false, false, false, true, 18, false, 1));
            doc.Add(table2);

            PdfPTable table2_2 = new PdfPTable(6);
            table2_2.HorizontalAlignment = Element.ALIGN_LEFT;
            table2_2.TotalWidth = 500;
            table2_2.LockedWidth = true;
            //int[] headerwidths2_2 = {15, 20, 10, 25, 7, 23};
            int[] headerwidths2_2 = { 65, 100, 60, 125, 35, 115 };
            table2_2.SetWidths(headerwidths2_2);
            //table2_2.WidthPercentage = 100;
            table2_2.AddCell(addNewCell("Recorded By:", "left", "bottom", false, false, false, false, 18, false, 1));
            table2_2.AddCell(addNewCell(asr.RECORDEDBY, "left", "bottom", false, false, false, true, 18, false, 1));
            table2_2.AddCell(addNewCell("Affiliation:", "left", "bottom", false, false, false, false, 18, false, 1));
            table2_2.AddCell(addNewCell(asr.AFFILIATION, "left", "bottom", false, false, false, true, 18, false, 1));
            table2_2.AddCell(addNewCell("Date:", "left", "bottom", false, false, false, false, 18, false, 1));
            string sDate = asr.RECORDEDDATE.ToString();
            if (sDate != "")
            {
                DateTime fullDate = Convert.ToDateTime(sDate);
                sDate = fullDate.ToShortDateString();
            }
            table2_2.AddCell(addNewCell(sDate, "left", "bottom", false, false, false, true, 18, false, 1));
            doc.Add(table2_2);
            # endregion


            #region General Information Section
            PdfPTable table3 = new PdfPTable(4);
            table3.HorizontalAlignment = Element.ALIGN_LEFT;
            table3.TotalWidth = 500;
            table3.LockedWidth = true;
            int[] headerwidths3_0 = { 15, 20, 65, 400 };
            table3.SetWidths(headerwidths3_0);
            //table3.WidthPercentage = 100;
            table3.SpacingBefore = 15;
            //table3.AutoFillEmptyCells = true;

            //table3.AbsWidth = Convert.ToString(doc.Right - doc.Left);
            table3.AddCell(addNewCell("A.", "left", "bottom", false, false, false, false, 18, false, 1));
            table3.AddCell(addNewCell("GENERAL INFORMATION", "left", "bottom", false, false, false, false, 18, true, 3));
            table3.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 5, false, 4));
            table3.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));
            table3.AddCell(addNewCell("1.", "left", "bottom", false, false, false, false, 18, false, 1));
            table3.AddCell(addNewCell("Site name:", "left", "bottom", false, false, false, false, 18, false, 1));
            table3.AddCell(addNewCell(asr.SITENAME, "left", "bottom", false, false, false, true, 18, false, 1));

            table3.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));
            table3.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));
            table3.AddCell(addNewCell("Project:", "left", "bottom", false, false, false, false, 18, false, 1));
            table3.AddCell(addNewCell(asr.PROJECT, "left", "bottom", false, false, false, true, 18, false, 1));

            doc.Add(table3);

            PdfPTable table3_1 = new PdfPTable(4);
            table3_1.HorizontalAlignment = Element.ALIGN_LEFT;
            //int[] headerwidths3_1 = {3,3,20,74};
            int[] headerwidths3_1 = { 15, 20, 100, 365 };
            table3_1.TotalWidth = 500;
            table3_1.LockedWidth = true;
            table3_1.SetWidths(headerwidths3_1);
            table3_1.WidthPercentage = 100;
            table3_1.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));
            table3_1.AddCell(addNewCell("2.", "left", "bottom", false, false, false, false, 18, false, 1));
            table3_1.AddCell(addNewCell("USGS Quadrangle:", "left", "bottom", false, false, false, false, 18, false, 1));

            if (asr.USGSQUADRANGLE != null)
                table3_1.AddCell(addNewCell(asr.USGSQUADRANGLE.ToString(), "left", "bottom", false, false, false, true, 18, false, 1));
            else
                table3_1.AddCell(addNewCell("", "left", "bottom", false, false, false, true, 18, false, 1));

            doc.Add(table3_1);

            PdfPTable table3_2 = new PdfPTable(8);
            table3_2.HorizontalAlignment = Element.ALIGN_LEFT;
            //int[] headerwidths3_2 = {3,3,13,7,10,27,10,27};	
            int[] headerwidths3_2 = { 15, 20, 60, 35, 50, 135, 50, 135 };
            table3_2.SetWidths(headerwidths3_2);
            table3_2.TotalWidth = 500;
            table3_2.LockedWidth = true;
            //table3_2.WidthPercentage = 100;
            table3_2.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));
            table3_2.AddCell(addNewCell("3.", "left", "bottom", false, false, false, false, 18, false, 1));
            table3_2.AddCell(addNewCell("UTM: Zone", "left", "bottom", false, false, false, false, 18, false, 1));
            table3_2.AddCell(addNewCell(asr.UTMZONE.ToString(), "left", "bottom", false, false, false, true, 18, false, 1));
            table3_2.AddCell(addNewCell("Easting:", "left", "bottom", false, false, false, false, 18, false, 1));
            table3_2.AddCell(addNewCell(asr.EASTING.ToString(), "left", "bottom", false, false, false, true, 18, false, 1));
            table3_2.AddCell(addNewCell("Northing:", "left", "bottom", false, false, false, false, 18, false, 1));
            table3_2.AddCell(addNewCell(asr.NORTHING.ToString(), "left", "bottom", false, false, false, true, 18, false, 1));

            doc.Add(table3_2);

            PdfPTable table3_3 = new PdfPTable(4);
            table3_3.HorizontalAlignment = Element.ALIGN_LEFT;
            table3_3.TotalWidth = 500;
            table3_3.LockedWidth = true;
            //int[] headerwidths3_3 = {3,3,25,69};
            int[] headerwidths3_3 = { 15, 20, 125, 340 };
            table3_3.SetWidths(headerwidths3_3);
            //table3_3.WidthPercentage = 100;
            table3_3.AddCell(addNewCell(" ", "left", "top", false, false, false, false, 18, false, 1));
            table3_3.AddCell(addNewCell("4.", "left", "top", false, false, false, false, 18, false, 1));
            table3_3.AddCell(addNewCell("Other map reference:", "left", "top", false, false, false, false, 18, false, 1));
            table3_3.AddCell(addNewCell(" ", "left", "top", false, false, false, false, 18, false, 1));
            table3_3.AddCell(addNewCell(" ", "left", "top", false, false, false, false, 54, false, 2));

            if (asr.OTHERMAPREFNOTES != null)
                table3_3.AddCell(addNewCell(asr.OTHERMAPREFNOTES.ToString(), "left", "top", false, false, false, false, 54, false, 2));
            else
                table3_3.AddCell(addNewCell("", "left", "top", false, false, false, false, 54, false, 2));

            //THIS COMES FROM RELATED TABLE
            string prehDesc = asr.DST_PREHISTORIC;
            string histDesc = asr.DST_HISTORIC;
            DataRow dr = null;

            table3_3.AddCell(addNewCell(" ", "left", "top", false, false, false, false, 18, false, 1));
            table3_3.AddCell(addNewCell("5.", "left", "top", false, false, false, false, 18, false, 1));
            table3_3.AddCell(addNewCell("Descriptive site type:", "left", "top", false, false, false, false, 18, false, 2));
            table3_3.AddCell(addNewCell(" ", "left", "top", false, false, false, false, 18, false, 2));
            table3_3.AddCell(addNewCell("Prehistoric:", "left", "top", false, false, false, false, 18, false, 2));
            table3_3.AddCell(addNewCell(" ", "left", "top", false, false, false, false, 54, false, 2));
            table3_3.AddCell(addNewCell(prehDesc, "left", "top", false, false, false, false, 54, false, 2));

            table3_3.AddCell(addNewCell(" ", "left", "top", false, false, false, false, 18, false, 2));
            table3_3.AddCell(addNewCell("Historic:", "left", "top", false, false, false, false, 18, false, 2));
            table3_3.AddCell(addNewCell(" ", "left", "top", false, false, false, false, 54, false, 2));
            table3_3.AddCell(addNewCell(histDesc, "left", "top", false, false, false, false, 54, false, 2));

            doc.Add(table3_3);

            //related table
            bool bSurvey = false;
            bool bTesting = false;
            bool bExcavation = false;
            string sval = "";

            if (asr.AI_SURVEY.Equals('Y'))
                bSurvey = true;
            if (asr.AI_TESTING.Equals('Y'))
                bTesting = true;
            if (asr.AI_EXCAVATION.Equals('Y'))
                bExcavation = true;

            PdfPTable table3_5 = new PdfPTable(9);
            table3_5.HorizontalAlignment = Element.ALIGN_LEFT;
            //int[] headerwidths3_5 = {3,3,32,10,10,10,10,12,10};
            int[] headerwidths3_5 = { 15, 20, 150, 50, 25, 50, 25, 60, 25 };
            table3_5.TotalWidth = 420;
            table3_5.LockedWidth = true;
            table3_5.SetWidths(headerwidths3_5);
            //table3_5.WidthPercentage = 100;
            table3_5.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));
            table3_5.AddCell(addNewCell("6.", "left", "bottom", false, false, false, false, 18, false, 1));
            table3_5.AddCell(addNewCell("Archaeological investigation:", "left", "bottom", false, false, false, false, 18, false, 1));
            table3_5.AddCell(addNewCell("Survey", "right", "bottom", false, false, false, false, 18, false, 1));
            if (bSurvey) table3_5.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            else table3_5.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));

            table3_5.AddCell(addNewCell("Testing", "right", "bottom", false, false, false, false, 18, false, 1));
            if (bTesting) table3_5.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            else table3_5.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));

            table3_5.AddCell(addNewCell("Excavation", "right", "bottom", false, false, false, false, 18, false, 1));
            if (bExcavation) table3_5.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            else table3_5.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));

            doc.Add(table3_5);

            PdfPTable table3_6 = new PdfPTable(6);
            table3_6.HorizontalAlignment = Element.ALIGN_LEFT;
            table3_6.TotalWidth = 500;
            table3_6.LockedWidth = true;
            //int[] headerwidths3_6 = {3,4,17,46,15,15};	
            int[] headerwidths3_6 = { 15, 20, 80, 230, 75, 80 };
            table3_6.SetWidths(headerwidths3_6);
            //table3_6.WidthPercentage = 100;
            table3_6.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));
            table3_6.AddCell(addNewCell("7.", "left", "bottom", false, false, false, false, 18, false, 1));
            table3_6.AddCell(addNewCell("Property owner:", "left", "bottom", false, false, false, false, 18, false, 1));
            table3_6.AddCell(addNewCell(asr.PROPERTYOWNER.ToString(), "left", "bottom", false, false, false, true, 18, false, 1));
            table3_6.AddCell(addNewCell("Phone number:", "right", "bottom", false, false, false, false, 18, false, 1));
            table3_6.AddCell(addNewCell(asr.PHONENUMBER.ToString(), "left", "bottom", false, false, false, true, 18, false, 1));

            table3_6.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));
            table3_6.AddCell(addNewCell("8.", "left", "bottom", false, false, false, false, 18, false, 1));
            table3_6.AddCell(addNewCell("Address:", "left", "bottom", false, false, false, false, 18, false, 1));
            table3_6.AddCell(addNewCell(asr.ADDRESS.ToString(), "left", "bottom", false, false, false, true, 18, false, 3));

            table3_6.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));
            table3_6.AddCell(addNewCell("9.", "left", "bottom", false, false, false, false, 18, false, 1));
            table3_6.AddCell(addNewCell("Other site designations:", "left", "bottom", false, false, false, false, 18, false, 4));
            table3_6.AddCell(addNewCell(" ", "left", "top", false, false, false, false, 54, false, 2));
            table3_6.AddCell(addNewCell(asr.OTHERSITEDESIGNATIONS.ToString(), "left", "top", false, false, false, false, 54, false, 4));
            table3_6.AddCell(addNewCell("", "left", "bottom", false, false, false, false, 18, false, 1));
            table3_6.AddCell(addNewCell("10.", "left", "bottom", false, false, false, false, 18, false, 1));
            table3_6.AddCell(addNewCell("National Register of Historic Places status:", "left", "bottom", false, false, false, false, 18, false, 4));

            doc.Add(table3_6);

            bool bEligible = false;
            bool bNotEligible = false;
            bool bAddWork = false;

            if (asr.NRHP_ELIGIBLE.Equals('Y'))
                bEligible = true;
            if (asr.NRHP_NONELIGIBLE.Equals('Y'))
                bNotEligible = true;
            if (asr.NRHP_ADDWORK.Equals('Y'))
                bAddWork = true;

            //related table
            PdfPTable table3_7 = new PdfPTable(7);
            table3_7.HorizontalAlignment = Element.ALIGN_LEFT;
            table3_7.TotalWidth = 395;
            table3_7.LockedWidth = true;
            //int[] headerwidths3_7 = {6,20,10,20,10,14,10};
            int[] headerwidths3_7 = { 35, 95, 25, 105, 25, 85, 25 };
            table3_7.SetWidths(headerwidths3_7);
            //table3_7.WidthPercentage = 100;
            table3_7.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));
            table3_7.AddCell(addNewCell("Potentially eligible", "right", "bottom", false, false, false, false, 18, false, 1));
            if (bEligible) table3_7.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            else table3_7.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            table3_7.AddCell(addNewCell("Probably not eligible", "right", "bottom", false, false, false, false, 18, false, 1));
            if (bNotEligible) table3_7.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            else table3_7.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            table3_7.AddCell(addNewCell("Additional work", "right", "bottom", false, false, false, false, 18, false, 1));
            if (bAddWork) table3_7.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            else table3_7.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));

            doc.Add(table3_7);

            PdfPTable table3_8 = new PdfPTable(8);
            table3_8.SpacingBefore = 15;
            table3_8.HorizontalAlignment = Element.ALIGN_CENTER;
            table3_8.TotalWidth = 425;
            table3_8.LockedWidth = true;
            //int[] headerwidths3_8 = {20,10,25,10,10,15};
            int[] headerwidths3_8 = { 25, 95, 25, 110, 25, 25, 115, 5 };

            table3_8.SetWidths(headerwidths3_8);

            sval = asr.DETERMINATION.ToString();

            table3_8.AddCell(addNewCell("Office Use Only", "center", "top", true, true, true, false, 18, false, 8));

            table3_8.AddCell(addNewCell(" ", "left", "bottom", true, false, false, false, 18, false, 1));
            table3_8.AddCell(addNewCell("Determined eligible", "left", "bottom", false, false, false, false, 18, false, 1));

            if (sval == "0")
            {
                table3_8.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
                table3_8.AddCell(addNewCell("Determined not eligible", "left", "bottom", false, false, false, false, 18, false, 1));
                table3_8.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            }
            else if (sval == "1")
            {
                table3_8.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
                table3_8.AddCell(addNewCell("Determined not eligible", "left", "bottom", false, false, false, false, 18, false, 1));
                table3_8.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            }
            else
            {
                table3_8.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
                table3_8.AddCell(addNewCell("Determined not eligible", "left", "bottom", false, false, false, false, 18, false, 1));
                table3_8.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            }

            table3_8.AddCell(addNewCell("Date", "left", "bottom", false, false, false, false, 18, false, 1));

            sDate = asr.DATEDETERMINED.ToString();
            if (sDate != "")
            {
                DateTime fullDate = Convert.ToDateTime(sDate);
                sDate = fullDate.ToShortDateString();
            }
            table3_8.AddCell(addNewCell(sDate, "left", "bottom", false, false, false, true, 18, false, 1));
            table3_8.AddCell(addNewCell(" ", "left", "bottom", false, true, false, false, 18, false, 1));
            doc.Add(table3_8);

            PdfPTable table3_9 = new PdfPTable(6);
            table3_9.HorizontalAlignment = Element.ALIGN_CENTER;
            table3_9.TotalWidth = 425;
            table3_9.LockedWidth = true;
            int[] headerwidths3_9 = { 35, 60, 40, 25, 115, 150 };
            table3_9.SetWidths(headerwidths3_9);
            //table3_9.WidthPercentage = 90;

            table3_9.AddCell(addNewCell(" ", "left", "bottom", true, false, false, false, 18, false, 1));
            table3_9.AddCell(addNewCell("On NRHP", "left", "bottom", false, false, false, false, 18, false, 1));

            sval = asr.ONNRHP.ToString();
            if (sval == "0") table3_9.AddCell(addNewCell("Yes", "center", "bottom", false, false, false, true, 18, false, 1));
            else if (sval == "1") table3_9.AddCell(addNewCell("No", "center", "bottom", false, false, false, true, 18, false, 1));
            else table3_9.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));

            table3_9.AddCell(addNewCell("Date", "right", "bottom", false, false, false, false, 18, false, 1));

            sDate = asr.NRHPDATE.ToString();
            if (sDate != "")
            {
                DateTime fullDate = Convert.ToDateTime(sDate);
                sDate = fullDate.ToShortDateString();
            }

            table3_9.AddCell(addNewCell(sDate, "left", "bottom", false, false, false, true, 18, false, 1));
            table3_9.AddCell(addNewCell(" ", "left", "bottom", false, true, false, false, 18, false, 1));
            table3_9.AddCell(addNewCell(" ", "left", "bottom", true, true, false, true, 18, false, 6));

            doc.Add(table3_9);

            doc.NewPage();

            //add header information
            //site number and page number

            bool bNational = false;
            bool bState = false;
            bool bLocal = false;

            if (asr.LOS_NATIONAL.Equals('Y'))
                bNational = true;
            if (asr.LOS_STATE.Equals('Y'))
                bState = true;
            if (asr.LOS_LOCAL.Equals('Y'))
                bLocal = true;

            PdfPTable table3_10 = new PdfPTable(10);
            table3_10.HorizontalAlignment = Element.ALIGN_LEFT;
            table3_10.TotalWidth = 500;
            table3_10.LockedWidth = true;
            //int[] headerwidths3_10 = {3,4,20,8,5,6,5,6,5,38};
            int[] headerwidths3_10 = { 15, 20, 125, 50, 25, 40, 25, 40, 25, 155 };
            table3_10.SetWidths(headerwidths3_10);
            //table3_10.WidthPercentage = 100;
            table3_10.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));
            table3_10.AddCell(addNewCell("11.", "left", "bottom", false, false, false, false, 18, false, 1));
            table3_10.AddCell(addNewCell("Level of significance:", "left", "bottom", false, false, false, false, 18, false, 1));
            table3_10.AddCell(addNewCell("National", "right", "bottom", false, false, false, false, 18, false, 1));
            if (bNational) table3_10.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            else table3_10.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            table3_10.AddCell(addNewCell("State", "right", "bottom", false, false, false, false, 18, false, 1));
            if (bState) table3_10.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            else table3_10.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            table3_10.AddCell(addNewCell("Local", "right", "bottom", false, false, false, false, 18, false, 1));
            if (bLocal) table3_10.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            else table3_10.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            table3_10.AddCell(addNewCell(" ", "center", "bottom", false, false, false, false, 18, false, 1));

            table3_10.AddCell(addNewCell(" ", "center", "bottom", false, false, false, false, 18, false, 1));
            table3_10.AddCell(addNewCell("12.", "left", "bottom", false, false, false, false, 18, false, 1));
            table3_10.AddCell(addNewCell("Justification:", "left", "bottom", false, false, false, false, 18, false, 8));
            table3_10.AddCell(addNewCell(" ", "left", "top", false, false, false, false, 54, false, 1));
            table3_10.AddCell(addNewCell(asr.JUSTIFICATION.ToString(), "left", "top", false, false, false, false, 54, false, 9)); //Update with justification - should be part of fc
            doc.Add(table3_10);
            #endregion

            PdfPTable tableb = new PdfPTable(8);
            tableb.HorizontalAlignment = Element.ALIGN_LEFT;
            tableb.TotalWidth = 430;
            tableb.LockedWidth = true;
            //int[] headerwidthsb = {3,4,20,5,20,5,20,5,18};
            int[] headerwidthsb = { 15, 20, 100, 25, 110, 25, 110, 25 };
            tableb.SetWidths(headerwidthsb);
            //tableb.WidthPercentage = 100;
            tableb.SpacingBefore = 15;
            //table3.AutoFillEmptyCells = true;

            //table3.AbsWidth = Convert.ToString(doc.Right - doc.Left);
            tableb.AddCell(addNewCell("B.", "left", "bottom", false, false, false, false, 18, false, 1));
            tableb.AddCell(addNewCell("ENVIRONMENT AND LOCATION", "left", "bottom", false, false, false, false, 18, true, 7));
            tableb.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 5, false, 8));

            tableb.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));
            tableb.AddCell(addNewCell("1.", "left", "bottom", false, false, false, false, 18, false, 1));
            tableb.AddCell(addNewCell("General physiographic province:", "left", "bottom", false, false, false, false, 18, false, 6));

            sval = asr.PROVINCE.ToString();

            tableb.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 2));
            tableb.AddCell(addNewCell("Lower Coastal Plain", "right", "bottom", false, false, false, false, 18, false, 1));
            if (sval != "0") tableb.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            else tableb.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            tableb.AddCell(addNewCell("Middle Coastal Plain", "right", "bottom", false, false, false, false, 18, false, 1));
            if (sval != "1") tableb.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            else tableb.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            tableb.AddCell(addNewCell("Upper Coastal Plain", "right", "bottom", false, false, false, false, 18, false, 1));
            if (sval != "2") tableb.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            else tableb.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            //tableb.AddCell(addNewCell(" ","left",false,false,false,false,18,false,1));

            tableb.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 2));
            tableb.AddCell(addNewCell("Piedmont", "right", "bottom", false, false, false, false, 18, false, 1));
            if (sval != "3") tableb.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            else tableb.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            tableb.AddCell(addNewCell("Blue Ridge Mountains", "right", "bottom", false, false, false, false, 18, false, 1));
            if (sval != "4") tableb.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            else tableb.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            tableb.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 2));

            doc.Add(tableb);

            PdfPTable tableb2 = new PdfPTable(4);
            tableb2.HorizontalAlignment = Element.ALIGN_LEFT;
            tableb2.TotalWidth = 430;
            int[] headerwidthsb2 = { 15, 20, 100, 295 };
            //tableb2.TotalWidth = 485;
            tableb2.LockedWidth = true;

            //int[] headerwidthsb2 = {15,20,125,250,75};
            tableb2.SetWidths(headerwidthsb2);
            //tableb2.WidthPercentage = 100;
            tableb2.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));
            tableb2.AddCell(addNewCell("2.", "left", "bottom", false, false, false, false, 18, false, 1));
            tableb2.AddCell(addNewCell("Landform Location:", "left", "bottom", false, false, false, false, 18, false, 1));
            tableb2.AddCell(addNewCell(asr.LANDFORMLOCATION.ToString(), "left", "bottom", false, false, false, true, 18, false, 1));
            doc.Add(tableb2);

            tableb2 = new PdfPTable(5);
            tableb2.HorizontalAlignment = Element.ALIGN_LEFT;
            tableb2.TotalWidth = 335;
            //tableb2.TotalWidth = 485;
            tableb2.LockedWidth = true;
            int[] headerwidthsb21 = { 15, 20, 150, 75, 75 };
            tableb2.SetWidths(headerwidthsb21);

            tableb2.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 2));
            tableb2.AddCell(addNewCell("Site elevation (above MSEL):", "left", "bottom", false, false, false, false, 18, false, 1));
            tableb2.AddCell(addNewCell(asr.SITEELEVATION.ToString(), "left", "bottom", false, false, false, true, 18, false, 1));
            tableb2.AddCell(addNewCell("(in feet)", "left", "bottom", false, false, false, false, 18, false, 1));
            doc.Add(tableb2);

            tableb2 = new PdfPTable(4);
            tableb2.TotalWidth = 430;
            int[] headerwidthsb22 = { 15, 20, 100, 295 };
            tableb2.HorizontalAlignment = Element.ALIGN_LEFT;
            tableb2.SetWidths(headerwidthsb22);
            tableb2.LockedWidth = true;
            tableb2.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));
            tableb2.AddCell(addNewCell("3.", "left", "bottom", false, false, false, false, 18, false, 1));
            tableb2.AddCell(addNewCell("On site soil type:", "left", "bottom", false, false, false, false, 18, false, 1));

            sval = asr.SOILTYPE.ToString();

            switch (sval)
            {
                case "0":
                    tableb2.AddCell(addNewCell("Clay", "left", "bottom", false, false, false, true, 18, false, 1));
                    break;
                case "1":
                    tableb2.AddCell(addNewCell("Clay/Loam", "left", "bottom", false, false, false, true, 18, false, 1));
                    break;
                case "2":
                    tableb2.AddCell(addNewCell("Silty Clay", "left", "bottom", false, false, false, true, 18, false, 1));
                    break;
                case "3":
                    tableb2.AddCell(addNewCell("Sandy/Clay/Loam", "left", "bottom", false, false, false, true, 18, false, 1));
                    break;
                case "4":
                    tableb2.AddCell(addNewCell("Sandy/Loam", "left", "bottom", false, false, false, true, 18, false, 1));
                    break;
                case "5":
                    tableb2.AddCell(addNewCell("Sand", "left", "bottom", false, false, false, true, 18, false, 1));
                    break;
                case "6":
                    tableb2.AddCell(addNewCell("Silt", "left", "bottom", false, false, false, true, 18, false, 1));
                    break;
                case "7":
                    tableb2.AddCell(addNewCell("Silty/Loam", "left", "bottom", false, false, false, true, 18, false, 1));
                    break;
                case "8":
                    tableb2.AddCell(addNewCell("Sandy/Clay", "left", "bottom", false, false, false, true, 18, false, 1));
                    break;
                case "9":
                    tableb2.AddCell(addNewCell("Silty/Clay/Loam", "left", "bottom", false, false, false, true, 18, false, 1));
                    break;
                case "10":
                    tableb2.AddCell(addNewCell("Loam", "left", "bottom", false, false, false, true, 18, false, 1));
                    break;
                case "11":
                    tableb2.AddCell(addNewCell("Loam/Sand", "left", "bottom", false, false, false, true, 18, false, 1));
                    break;
                case "12":
                    tableb2.AddCell(addNewCell("Gravel", "left", "bottom", false, false, false, true, 18, false, 1));
                    break;
                case "13":
                    tableb2.AddCell(addNewCell("Organic", "left", "bottom", false, false, false, true, 18, false, 1));
                    break;
                case "14":
                    tableb2.AddCell(addNewCell("Other", "left", "bottom", false, false, false, true, 18, false, 1));
                    break;
                default:
                    tableb2.AddCell(addNewCell(" ", "left", "bottom", false, false, false, true, 18, false, 1));
                    break;
            }


            tableb2.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 2));
            tableb2.AddCell(addNewCell("Soil classification:", "left", "bottom", false, false, false, false, 18, false, 1));
            tableb2.AddCell(addNewCell(asr.SOILCLASSIFICATION.ToString(), "left", "bottom", false, false, false, true, 18, false, 1));

            doc.Add(tableb2);

            PdfPTable tableb3 = new PdfPTable(10);
            tableb3.HorizontalAlignment = Element.ALIGN_LEFT;
            tableb3.TotalWidth = 430;
            tableb3.LockedWidth = true;
            //int[] headerwidthsb3 = {3,4,8,5,6,5,23,5,9,5,37};
            int[] headerwidthsb3 = { 15, 20, 45, 25, 45, 25, 125, 25, 60, 30 };
            tableb3.SetWidths(headerwidthsb3);
            //tableb3.WidthPercentage = 100;
            tableb3.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));
            tableb3.AddCell(addNewCell("4.", "left", "bottom", false, false, false, false, 18, false, 1));
            tableb3.AddCell(addNewCell("Major River System:", "left", "bottom", false, false, false, false, 18, false, 8));

            sval = asr.MAJORRIVER.ToString();

            tableb3.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 2));
            tableb3.AddCell(addNewCell("Pee Dee", "left", "bottom", false, false, false, false, 18, false, 1));
            if (sval != "0") tableb3.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            else tableb3.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            tableb3.AddCell(addNewCell("Santee", "right", "bottom", false, false, false, false, 18, false, 1));
            if (sval != "1") tableb3.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            else tableb3.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            tableb3.AddCell(addNewCell("Ashley-Combahee-Edisto", "right", "bottom", false, false, false, false, 18, false, 1));
            if (sval != "2") tableb3.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            else tableb3.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            tableb3.AddCell(addNewCell("Savannah", "right", "bottom", false, false, false, false, 18, false, 1));
            if (sval != "3") tableb3.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            else tableb3.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));

            doc.Add(tableb3);

            tableb3 = new PdfPTable(4);
            tableb3.HorizontalAlignment = Element.ALIGN_LEFT;
            tableb3.TotalWidth = 430;
            tableb3.LockedWidth = true;
            //int[] headerwidthsb3 = {3,4,8,5,6,5,23,5,9,5,37};
            int[] headerwidthsb31 = { 15, 20, 105, 290 };
            tableb3.SetWidths(headerwidthsb31);
            tableb3.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));
            tableb3.AddCell(addNewCell("5.", "left", "bottom", false, false, false, false, 18, false, 1));
            tableb3.AddCell(addNewCell("Nearest river/stream:", "left", "bottom", false, false, false, false, 18, false, 1));
            tableb3.AddCell(addNewCell(asr.NEARESTRIVERSTREAM.ToString(), "left", "bottom", false, false, false, true, 18, false, 1));
            doc.Add(tableb3);


            sval = "";

            //TODO: Fix for Vegetation
            PdfPTable tableb4 = new PdfPTable(8);
            tableb4.HorizontalAlignment = Element.ALIGN_LEFT;
            tableb4.TotalWidth = 430;
            tableb4.LockedWidth = true;
            //int[] headerwidthsb4 = {3,4,20,5,19,5,20,5,19};
            int[] headerwidthsb4 = { 15, 20, 100, 25, 105, 25, 115, 25 };
            tableb4.SetWidths(headerwidthsb4);
            //tableb4.WidthPercentage = 100;
            tableb4.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));
            tableb4.AddCell(addNewCell("6.", "left", "bottom", false, false, false, false, 18, false, 1));
            tableb4.AddCell(addNewCell("Current vegetation:", "left", "bottom", false, false, false, false, 18, false, 6));

            tableb4.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 2));
            tableb4.AddCell(addNewCell("Pine/coniferous:", "right", "bottom", false, false, false, false, 18, false, 1));
            if (sval.IndexOf("0") > -1) tableb4.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            else tableb4.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            tableb4.AddCell(addNewCell("Hardwood:", "right", "bottom", false, false, false, false, 18, false, 1));
            if (sval.IndexOf("1") > -1) tableb4.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            else tableb4.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            tableb4.AddCell(addNewCell("Mixed pine/hardwood:", "right", "bottom", false, false, false, false, 18, false, 1));
            if (sval.IndexOf("2") > -1) tableb4.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            else tableb4.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));

            tableb4.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 2));
            tableb4.AddCell(addNewCell("Old field:", "right", "bottom", false, false, false, false, 18, false, 1));
            if (sval.IndexOf("3") > -1) tableb4.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            else tableb4.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            tableb4.AddCell(addNewCell("Grass/pasture:", "right", "bottom", false, false, false, false, 18, false, 1));
            if (sval.IndexOf("4") > -1) tableb4.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            else tableb4.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            tableb4.AddCell(addNewCell("Agricultural/crops:", "right", "bottom", false, false, false, false, 18, false, 1));
            if (sval.IndexOf("5") > -1) tableb4.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            else tableb4.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));

            tableb4.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 2));
            tableb4.AddCell(addNewCell("Wetlands/freshwater:", "right", "bottom", false, false, false, false, 18, false, 1));
            if (sval.IndexOf("6") > -1) tableb4.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            else tableb4.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            tableb4.AddCell(addNewCell("Wetlands/saltwater:", "right", "bottom", false, false, false, false, 18, false, 1));
            if (sval.IndexOf("7") > -1) tableb4.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            else tableb4.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            tableb4.AddCell(addNewCell("Other:", "right", "bottom", false, false, false, false, 18, false, 1));
            if (sval.IndexOf("8") > -1) tableb4.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            else tableb4.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            doc.Add(tableb4);

            tableb4 = new PdfPTable(3);
            tableb4.SpacingBefore = 5;
            tableb4.HorizontalAlignment = Element.ALIGN_LEFT;
            tableb4.TotalWidth = 500;
            tableb4.LockedWidth = true;
            int[] headerwidthsb41 = { 15, 20, 465 };
            tableb4.SetWidths(headerwidthsb41);

            tableb4.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 2));
            tableb4.AddCell(addNewCell("Comments:", "left", "top", false, false, false, false, 18, false, 1));
            tableb4.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 54, false, 2));
            tableb4.AddCell(addNewCell(asr.VEGCOMMENTS.ToString(), "left", "top", false, false, false, false, 54, false, 1));
            doc.Add(tableb4);


            PdfPTable tableb5 = new PdfPTable(10);
            tableb5.HorizontalAlignment = Element.ALIGN_LEFT;
            tableb5.TotalWidth = 335;
            tableb5.LockedWidth = true;
            int[] headerwidthsb5 = { 15, 20, 45, 25, 45, 25, 65, 25, 45, 25 };
            tableb5.SetWidths(headerwidthsb5);
            tableb5.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));
            tableb5.AddCell(addNewCell("7.", "left", "bottom", false, false, false, false, 18, false, 1));
            tableb5.AddCell(addNewCell("Description of Ground Cover:", "left", "bottom", false, false, false, false, 18, false, 8));

            sval = asr.COVERTYPE.ToString();

            tableb5.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 2));
            tableb5.AddCell(addNewCell("Absent", "left", "bottom", false, false, false, false, 18, false, 1));
            if (sval != "0") tableb5.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            else tableb5.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            tableb5.AddCell(addNewCell("Light", "right", "bottom", false, false, false, false, 18, false, 1));
            if (sval != "1") tableb5.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            else tableb5.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            tableb5.AddCell(addNewCell("Moderate", "right", "bottom", false, false, false, false, 18, false, 1));
            if (sval != "2") tableb5.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            else tableb5.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            tableb5.AddCell(addNewCell("Heavy", "right", "bottom", false, false, false, false, 18, false, 1));
            if (sval != "3") tableb5.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            else tableb5.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));

            doc.Add(tableb5);

            PdfPTable tablec = new PdfPTable(7);
            tablec.HorizontalAlignment = Element.ALIGN_LEFT;
            tablec.TotalWidth = 340;
            tablec.LockedWidth = true;
            int[] headerwidthsc = { 15, 20, 125, 40, 50, 40, 50 };
            tablec.SetWidths(headerwidthsc);
            tablec.SpacingBefore = 15;

            tablec.AddCell(addNewCell("C.", "left", "bottom", false, false, false, false, 18, false, 1));
            tablec.AddCell(addNewCell("SITE CHARACTERISTICS", "left", "bottom", false, false, false, false, 18, true, 6));
            tablec.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 5, false, 7));

            tablec.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));
            tablec.AddCell(addNewCell("1.", "left", "bottom", false, false, false, false, 18, false, 1));
            tablec.AddCell(addNewCell("Estimated site dimensions:", "left", "bottom", false, false, false, false, 18, false, 1));
            tablec.AddCell(addNewCell(asr.SITELENGTH.ToString(), "center", "bottom", false, false, false, true, 18, false, 1));
            tablec.AddCell(addNewCell("meters by", "left", "bottom", false, false, false, false, 18, false, 1));
            tablec.AddCell(addNewCell(asr.SITEWIDTH.ToString(), "center", "bottom", false, false, false, true, 18, false, 1));
            tablec.AddCell(addNewCell("meters", "left", "bottom", false, false, false, false, 18, false, 1));
            doc.Add(tablec);

            tablec = new PdfPTable(5);
            tablec.HorizontalAlignment = Element.ALIGN_LEFT;
            tablec.TotalWidth = 145;
            tablec.LockedWidth = true;
            int[] headerwidthsc2 = { 15, 20, 55, 30, 25 };
            tablec.SetWidths(headerwidthsc2);
            tablec.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));
            tablec.AddCell(addNewCell("2.", "left", "bottom", false, false, false, false, 18, false, 1));
            tablec.AddCell(addNewCell("Site depth:", "left", "bottom", false, false, false, false, 18, false, 1));
            tablec.AddCell(addNewCell(asr.SITEDEPTH.ToString(), "center", "bottom", false, false, false, true, 18, false, 1));
            tablec.AddCell(addNewCell("cm.", "left", "bottom", false, false, false, false, 18, false, 1));
            doc.Add(tablec);

            tablec = new PdfPTable(3);
            tablec.HorizontalAlignment = Element.ALIGN_LEFT;
            tablec.TotalWidth = 500;
            tablec.LockedWidth = true;
            int[] headerwidthsc3 = { 15, 20, 465 };
            tablec.SetWidths(headerwidthsc3);

            tablec.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));
            tablec.AddCell(addNewCell("3.", "left", "bottom", false, false, false, false, 18, false, 1));
            tablec.AddCell(addNewCell("Cultural features:", "left", "bottom", false, false, false, false, 18, false, 1));
            tablec.AddCell(addNewCell(" ", "left", "top", false, false, false, false, 54, false, 2));
            tablec.AddCell(addNewCell(asr.CULTURALFEATURES.ToString(), "left", "top", false, false, false, false, 54, false, 1));
            doc.Add(tablec);

            sval = "";

            //TODO: rework for Presence of
            tablec = new PdfPTable(12);
            tablec.HorizontalAlignment = Element.ALIGN_LEFT;
            tablec.TotalWidth = 495;
            tablec.LockedWidth = true;
            int[] headerwidthsc4 = { 15, 20, 45, 25, 85, 25, 85, 25, 50, 25, 70, 25 };
            tablec.SetWidths(headerwidthsc4);
            tablec.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));
            tablec.AddCell(addNewCell("4.", "left", "bottom", false, false, false, false, 18, false, 1));
            tablec.AddCell(addNewCell("Presence of:", "left", "bottom", false, false, false, false, 18, false, 10));

            tablec.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 2));
            tablec.AddCell(addNewCell("Midden", "left", "bottom", false, false, false, false, 18, false, 1));
            if (sval.IndexOf("0") > -1) tablec.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            else tablec.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            tablec.AddCell(addNewCell("Floral Remains", "right", "bottom", false, false, false, false, 18, false, 1));
            if (sval.IndexOf("1") > -1) tablec.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            else tablec.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            tablec.AddCell(addNewCell("Faunal Remains", "right", "bottom", false, false, false, false, 18, false, 1));
            if (sval.IndexOf("2") > -1) tablec.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            else tablec.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            tablec.AddCell(addNewCell("Shell", "right", "bottom", false, false, false, false, 18, false, 1));
            if (sval.IndexOf("3") > -1) tablec.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            else tablec.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            tablec.AddCell(addNewCell("Charcoal", "right", "bottom", false, false, false, false, 18, false, 1));
            if (sval.IndexOf("4") > -1) tablec.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            else tablec.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));

            doc.Add(tablec);

            sval = asr.HUMANREMAINS.ToString();
            tablec = new PdfPTable(9);
            tablec.HorizontalAlignment = Element.ALIGN_LEFT;
            tablec.TotalWidth = 419;
            tablec.LockedWidth = true;
            int[] headerwidthsc5 = { 15, 20, 114, 55, 25, 65, 25, 75, 25 };
            tablec.SetWidths(headerwidthsc5);
            tablec.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));
            tablec.AddCell(addNewCell("5.", "left", "bottom", false, false, false, false, 18, false, 1));
            tablec.AddCell(addNewCell("Human skeletal remains:", "left", "bottom", false, false, false, false, 18, false, 1));
            tablec.AddCell(addNewCell("Present", "right", "bottom", false, false, false, false, 18, false, 1));
            if (sval != "0") tablec.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            else tablec.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            tablec.AddCell(addNewCell("Absent", "right", "bottom", false, false, false, false, 18, false, 1));
            if (sval != "1") tablec.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            else tablec.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            tablec.AddCell(addNewCell("Unknown", "right", "bottom", false, false, false, false, 18, false, 1));
            if (sval != "2") tablec.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            else tablec.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));

            sval = asr.HUMANREMAINSPRESERVATION.ToString();
            tablec.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 2));
            tablec.AddCell(addNewCell("Preservation:", "right", "bottom", false, false, false, false, 18, false, 1));
            tablec.AddCell(addNewCell("Good", "right", "bottom", false, false, false, false, 18, false, 1));
            if (sval != "0") tablec.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            else tablec.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            tablec.AddCell(addNewCell("Poor", "right", "bottom", false, false, false, false, 18, false, 1));
            if (sval != "1") tablec.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            else tablec.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            tablec.AddCell(addNewCell("Unknown", "right", "bottom", false, false, false, false, 18, false, 1));
            if (sval != "2") tablec.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            else tablec.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));

            doc.Add(tablec);

            doc.NewPage();

            tablec = new PdfPTable(3);
            tablec.HorizontalAlignment = Element.ALIGN_LEFT;
            tablec.TotalWidth = 500;
            tablec.LockedWidth = true;
            int[] headerwidthsc6 = { 15, 20, 465 };
            tablec.SetWidths(headerwidthsc6);

            tablec.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));
            tablec.AddCell(addNewCell("6.", "left", "bottom", false, false, false, false, 18, false, 1));
            tablec.AddCell(addNewCell("General Site Description:", "left", "bottom", false, false, false, false, 18, false, 1));
            tablec.AddCell(addNewCell(" ", "left", "top", false, false, false, false, 54, false, 2));
            tablec.AddCell(addNewCell(asr.GENERALSITEDESCRIPTION.ToString(), "left", "top", false, false, false, false, 54, false, 1));
            tablec.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 3));

            tablec.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));
            tablec.AddCell(addNewCell("7.", "left", "bottom", false, false, false, false, 18, false, 1));
            tablec.AddCell(addNewCell("Location Description:", "left", "bottom", false, false, false, false, 18, false, 1));
            tablec.AddCell(addNewCell(" ", "left", "top", false, false, false, false, 54, false, 2));
            tablec.AddCell(addNewCell(asr.LOCATIONDESCRIPTION.ToString(), "left", "top", false, false, false, false, 54, false, 1));

            doc.Add(tablec);

            #region Section D - Archaeological Components

            PdfPTable tabled = new PdfPTable(7);
            tabled.HorizontalAlignment = Element.ALIGN_LEFT;
            tabled.TotalWidth = 495;
            tabled.LockedWidth = true;
            int[] headerwidthsd = { 15, 30, 130, 30, 130, 30, 130 };
            tabled.SetWidths(headerwidthsd);
            tabled.SpacingBefore = 15;

            tabled.AddCell(addNewCell("D.", "left", "bottom", false, false, false, false, 18, false, 1));
            tabled.AddCell(addNewCell("ARCHAEOLOGICAL COMPONENTS", "left", "bottom", false, false, false, false, 18, true, 6));
            tabled.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 5, false, 7));
            tabled.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            if (asr.ARC_PALEO.Equals("Y"))
            {
                tabled.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            }
            else
            {
                tabled.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            }

            tabled.AddCell(addNewCell("Paleo Indian", "left", "bottom", false, false, false, false, 18, false, 1));

            if (asr.ARC_LATEWOODLAND.Equals("Y"))
            {
                tabled.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            }
            else
            {
                tabled.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            }

            tabled.AddCell(addNewCell("Late Woodland", "left", "bottom", false, false, false, false, 18, false, 1));

            if (asr.ARC_17CENTURY.Equals("Y"))
            {
                tabled.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            }
            else
            {
                tabled.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            }

            tabled.AddCell(addNewCell("17th Century", "left", "bottom", false, false, false, false, 18, false, 1));

            tabled.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            if (asr.ARC_EARLYARCHAIC.Equals("Y"))
            {
                tabled.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            }
            else
            {
                tabled.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            }

            tabled.AddCell(addNewCell("Early Archaic", "left", "bottom", false, false, false, false, 18, false, 1));

            if (asr.ARC_ANYWOODLAND.Equals("Y"))
            {
                tabled.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            }
            else
            {
                tabled.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            }

            tabled.AddCell(addNewCell("Any Woodland Period", "left", "bottom", false, false, false, false, 18, false, 1));

            if (asr.ARC_18CENTURY.Equals("Y"))
            {
                tabled.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            }
            else
            {
                tabled.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            }

            tabled.AddCell(addNewCell("18th Century", "left", "bottom", false, false, false, false, 18, false, 1));


            tabled.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            if (asr.ARC_MIDDLEARCHAIC.Equals("Y"))
            {
                tabled.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            }
            else
            {
                tabled.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            }

            tabled.AddCell(addNewCell("Middle Archaic", "left", "bottom", false, false, false, false, 18, false, 1));

            if (asr.ARC_MISSISSIPPIAN.Equals("Y"))
            {
                tabled.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            }
            else
            {
                tabled.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            }

            tabled.AddCell(addNewCell("Mississippian", "left", "bottom", false, false, false, false, 18, false, 1));

            if (asr.ARC_19CENTURY.Equals("Y"))
            {
                tabled.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            }
            else
            {
                tabled.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            }

            tabled.AddCell(addNewCell("19th Century", "left", "bottom", false, false, false, false, 18, false, 1));


            tabled.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            if (asr.ARC_LATEARCHAIC.Equals("Y"))
            {
                tabled.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            }
            else
            {
                tabled.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            }

            tabled.AddCell(addNewCell("Late Archaic", "left", "bottom", false, false, false, false, 18, false, 1));


            if (asr.ARC_LATEPREHISTORIC.Equals("Y"))
            {
                tabled.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            }
            else
            {
                tabled.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            }

            tabled.AddCell(addNewCell("Late Prehistoric", "left", "bottom", false, false, false, false, 18, false, 1));

            if (asr.ARC_20CENTURY.Equals("Y"))
            {
                tabled.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            }
            else
            {
                tabled.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            }

            tabled.AddCell(addNewCell("20th Century", "left", "bottom", false, false, false, false, 18, false, 1));


            tabled.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            if (asr.ARC_ANYARCHAIC.Equals("Y"))
            {
                tabled.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            }
            else
            {
                tabled.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            }

            tabled.AddCell(addNewCell("Any Archaic Period", "left", "bottom", false, false, false, false, 18, false, 1));

            if (asr.ARC_UNKNOWNPREHISTORIC.Equals("Y"))
            {
                tabled.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            }
            else
            {
                tabled.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            }

            tabled.AddCell(addNewCell("Unknown Prehistoric", "left", "bottom", false, false, false, false, 18, false, 1));

            if (asr.ARC_UNKNOWNHISTORIC.Equals("Y"))
            {
                tabled.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            }
            else
            {
                tabled.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            }

            tabled.AddCell(addNewCell("Unknown Historic", "left", "bottom", false, false, false, false, 18, false, 1));


            tabled.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            if (asr.ARC_EARLYWOODLAND.Equals("Y"))
            {
                tabled.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            }
            else
            {
                tabled.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            }

            tabled.AddCell(addNewCell("Early Woodland", "left", "bottom", false, false, false, false, 18, false, 1));

            if (asr.ARC_ERAPREHISTORIC.Equals("Y"))
            {
                tabled.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            }
            else
            {
                tabled.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            }

            tabled.AddCell(addNewCell("Contact Era Prehistoric", "left", "bottom", false, false, false, false, 18, false, 1));

            tabled.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 2)); //blank rows b/c not even number of arch components


            tabled.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            if (asr.ARC_MIDDLEWOODLAND.Equals("Y"))
            {
                tabled.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            }
            else
            {
                tabled.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            }

            tabled.AddCell(addNewCell("Middle Woodland", "left", "bottom", false, false, false, false, 18, false, 1));

            if (asr.ARC_16CENTURY.Equals("Y"))
            {
                tabled.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            }
            else
            {
                tabled.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            }

            tabled.AddCell(addNewCell("16th Century", "left", "bottom", false, false, false, false, 18, false, 1));

            tabled.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 2)); //blank rows b/c not even number of arch components

            doc.Add(tabled);

            #endregion

            #region Section E - Data Recovered

            PdfPTable tablee = new PdfPTable(3);
            tablee.HorizontalAlignment = Element.ALIGN_LEFT;
            tablee.TotalWidth = 165;
            tablee.LockedWidth = true;
            int[] headerwidthse = { 15, 125, 25 };
            tablee.SetWidths(headerwidthse);
            tablee.SpacingBefore = 15;

            tablee.AddCell(addNewCell("E.", "left", "bottom", false, false, false, false, 18, false, 1));
            tablee.AddCell(addNewCell("DATA RECOVERED", "left", "bottom", false, false, false, false, 18, true, 2));

            tablee.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 5, false, 3));
            tablee.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));
            tablee.AddCell(addNewCell("Total number of artifacts:", "left", "bottom", false, false, false, false, 18, false, 1));
            tablee.AddCell(addNewCell(asr.TOTALARTIFACTS.ToString(), "center", "bottom", false, false, false, true, 18, false, 1));

            tablee.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 5, false, 3));
            tablee.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));
            tablee.AddCell(addNewCell("List materials recovered:", "left", "bottom", false, false, false, false, 18, false, 2));

            doc.Add(tablee);

            tablee = new PdfPTable(4);
            tablee.HorizontalAlignment = Element.ALIGN_LEFT;
            tablee.TotalWidth = 500;
            tablee.LockedWidth = true;
            int[] headerwidthse1 = { 15, 235, 15, 235 };
            tablee.SetWidths(headerwidthse1);

            int cnt = 0;
            int tblcnt = 0;
            if (asr.DataRecoveredList.Count > 15) tblcnt = asr.DataRecoveredList.Count - 15;

            foreach (DataRecovered dataR in asr.DataRecoveredList)
            {
                cnt++;
                tablee.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 16, false, 1));
                tablee.AddCell(addNewCell(dataR.NUMBEROFARTIFACTS.ToString() + " " + dataR.MaterialsRecovered.ToString(), "left", "bottom", false, false, false, true, 16, false, 1));
                if (tblcnt == 0)
                {
                    tablee.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 16, false, 1));
                    tablee.AddCell(addNewCell(" ", "left", "bottom", false, false, false, true, 16, false, 1));
                }
                else tblcnt--;

                if (cnt == 30) break; //only displaying 30 results for materials recovered
            }

            if (cnt < 15)
            {
                do
                {
                    tablee.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 16, false, 1));
                    tablee.AddCell(addNewCell(" ", "left", "bottom", false, false, false, true, 16, false, 1));
                    tablee.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 16, false, 1));
                    tablee.AddCell(addNewCell(" ", "left", "bottom", false, false, false, true, 16, false, 1));
                    cnt++;
                } while (cnt < 15);
            }

            doc.Add(tablee);
            doc.NewPage();

            #endregion

            #region Section F - Data Recovery Methods

            PdfPTable tablef = new PdfPTable(13);
            tablef.HorizontalAlignment = Element.ALIGN_LEFT;
            tablef.TotalWidth = 500;
            tablef.LockedWidth = true;
            int[] headerwidthsf = { 15, 20, 125, 45, 23, 45, 23, 45, 23, 45, 23, 45, 23 };
            tablef.SetWidths(headerwidthsf);

            tablef.AddCell(addNewCell("F.", "left", "bottom", false, false, false, false, 18, false, 1));
            tablef.AddCell(addNewCell("DATA RECOVERY METHODS", "left", "bottom", false, false, false, false, 18, true, 12));
            tablef.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 5, false, 13));


            tablef.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));
            tablef.AddCell(addNewCell("1.", "left", "bottom", false, false, false, false, 18, false, 1));
            tablef.AddCell(addNewCell("Ground surface visibility:", "left", "bottom", false, false, false, false, 18, false, 1));
            tablef.AddCell(addNewCell("0%", "right", "bottom", false, false, false, false, 18, false, 1));

            if (asr.VIS_0.Equals("Y")) tablef.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            else tablef.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));

            tablef.AddCell(addNewCell("1-25%", "right", "bottom", false, false, false, false, 18, false, 1));
            if (asr.VIS_1_25.Equals("Y")) tablef.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            else tablef.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));

            tablef.AddCell(addNewCell("26-50%", "right", "bottom", false, false, false, false, 18, false, 1));
            if (asr.VIS_26_50.Equals("Y")) tablef.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            else tablef.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));

            tablef.AddCell(addNewCell("51-75%", "right", "bottom", false, false, false, false, 18, false, 1));
            if (asr.VIS_51_75.Equals("Y")) tablef.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            else tablef.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));

            tablef.AddCell(addNewCell("76-100%", "right", "bottom", false, false, false, false, 18, false, 1));
            if (asr.VIS_76_100.Equals("Y")) tablef.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            else tablef.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));

            doc.Add(tablef);

            tablef = new PdfPTable(4);
            tablef.HorizontalAlignment = Element.ALIGN_LEFT;
            tablef.TotalWidth = 405;
            tablef.LockedWidth = true;
            tablef.SpacingBefore = 5;
            int[] headerwidthsf1 = { 15, 20, 320, 50 };
            tablef.SetWidths(headerwidthsf1);
            tablef.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));
            tablef.AddCell(addNewCell("2.", "left", "bottom", false, false, false, false, 18, false, 1));
            tablef.AddCell(addNewCell("Number of person hours spent collecting (total hours x total people):", "left", "bottom", false, false, false, false, 18, false, 1));
            tablef.AddCell(addNewCell(asr.TOTALHOURSCOLLECTING.ToString(), "center", "bottom", false, false, false, true, 18, false, 1));

            doc.Add(tablef);

            //Collection Type
            //make a table with 2 columns and 2 rows followed by a space for the collection comments
            tablef = new PdfPTable(8);
            tablef.HorizontalAlignment = Element.ALIGN_LEFT;
            tablef.TotalWidth = 500;
            tablef.LockedWidth = true;
            tablef.SpacingBefore = 5;
            int[] headerwidthsf2 = { 15, 20, 25, 120, 25, 25, 120, 150 };
            tablef.SetWidths(headerwidthsf2);
            tablef.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));
            tablef.AddCell(addNewCell("3.", "left", "bottom", false, false, false, false, 18, false, 1));
            tablef.AddCell(addNewCell("Description of surface collection methods:", "left", "bottom", false, false, false, false, 18, false, 6));
            tablef.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 2));
            tablef.AddCell(addNewCell("Collection Type:", "left", "bottom", false, false, false, false, 18, false, 6));

            tablef.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 2));



            if (asr.CT_GRID.Equals("Y"))
            {
                tablef.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            }
            else
            {
                tablef.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            }

            tablef.AddCell(addNewCell("Grid Collection", "left", "bottom", false, false, false, false, 18, false, 1));

            tablef.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            if (asr.CT_CONTROLLED.Equals("Y"))
            {
                tablef.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            }
            else
            {
                tablef.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            }

            tablef.AddCell(addNewCell("Controlled Sampling", "left", "bottom", false, false, false, false, 18, false, 1));
            tablef.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));
            tablef.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 2));

            if (asr.CT_GRAB.Equals("Y"))
            {
                tablef.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            }
            else
            {
                tablef.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            }

            tablef.AddCell(addNewCell("Grab Collection", "left", "bottom", false, false, false, false, 18, false, 1));

            tablef.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            if (asr.CT_OTHER.Equals("Y"))
            {
                tablef.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            }
            else
            {
                tablef.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            }

            tablef.AddCell(addNewCell("Other", "left", "bottom", false, false, false, false, 18, false, 1));
            tablef.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));
            tablef.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 10, false, 8));
            tablef.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 2));
            tablef.AddCell(addNewCell("Collection Comments:", "left", "bottom", false, false, false, false, 18, false, 6));
            tablef.AddCell(addNewCell(" ", "left", "top", false, false, false, false, 54, false, 2));
            tablef.AddCell(addNewCell(asr.COLLECTIONCOMMENTS.ToString(), "left", "top", false, false, false, false, 54, false, 6));

            doc.Add(tablef);

            //Collection Extent
            tablef = new PdfPTable(8);
            tablef.HorizontalAlignment = Element.ALIGN_LEFT;
            tablef.TotalWidth = 385;
            tablef.LockedWidth = true;
            int[] headerwidthsf3 = { 15, 20, 25, 75, 25, 75, 25, 125 };
            tablef.SetWidths(headerwidthsf3);
            tablef.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 2));
            tablef.AddCell(addNewCell("Collection Extent:", "left", "bottom", false, false, false, false, 18, false, 6));

            tablef.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 2));


            if (asr.COLEXT_COMPLETE.Equals("Y")) tablef.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            else tablef.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            tablef.AddCell(addNewCell("Complete", "left", "bottom", false, false, false, false, 18, false, 1));

            if (asr.COLEXT_SELECTIVE.Equals("Y")) tablef.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            else tablef.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            tablef.AddCell(addNewCell("Selective", "left", "bottom", false, false, false, false, 18, false, 1));

            if (asr.COLEXT_NO_COLLECT.Equals("Y")) tablef.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            else tablef.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            tablef.AddCell(addNewCell("No Collection Made", "left", "bottom", false, false, false, false, 18, false, 1));

            doc.Add(tablef);

            //Testing Method Systematic/Nonsystematic
            sval = asr.TESTINGMETHOD.ToString();
            tablef = new PdfPTable(6);
            tablef.HorizontalAlignment = Element.ALIGN_LEFT;
            tablef.TotalWidth = 245;
            tablef.SpacingBefore = 10;
            tablef.LockedWidth = true;
            int[] headerwidthsf4 = { 15, 20, 60, 25, 100, 25 };
            tablef.SetWidths(headerwidthsf4);
            tablef.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));
            tablef.AddCell(addNewCell("4.", "left", "bottom", false, false, false, false, 18, false, 1));
            tablef.AddCell(addNewCell("Description of testing methods:", "left", "bottom", false, false, false, false, 18, false, 4));
            tablef.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 2));
            tablef.AddCell(addNewCell("Systematic", "left", "bottom", false, false, false, false, 18, false, 1));
            if (sval != "0") tablef.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            else tablef.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            tablef.AddCell(addNewCell("Nonsystematic", "right", "bottom", false, false, false, false, 18, false, 1));
            if (sval != "1") tablef.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            else tablef.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));

            doc.Add(tablef);

            tablef = new PdfPTable(9);
            tablef.HorizontalAlignment = Element.ALIGN_LEFT;
            tablef.TotalWidth = 410;
            tablef.SpacingBefore = 5;
            tablef.LockedWidth = true;
            int[] headerwidthsf5 = { 15, 20, 25, 75, 50, 20, 85, 20, 100 };
            tablef.SetWidths(headerwidthsf5);
            tablef.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 2));
            tablef.AddCell(addNewCell("Testing Units:", "left", "bottom", false, false, false, false, 18, false, 7));
            tablef.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 3));
            tablef.AddCell(addNewCell("Test Type", "left", "bottom", false, false, false, false, 18, true, 1));
            tablef.AddCell(addNewCell("Number", "center", "bottom", false, false, false, false, 18, true, 1));
            tablef.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));
            tablef.AddCell(addNewCell("Size (cm/m)", "center", "bottom", false, false, false, false, 18, true, 1));
            tablef.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));
            tablef.AddCell(addNewCell("Max. Depth (cm)", "center", "bottom", false, false, false, false, 18, true, 1));

            foreach (TestingUnit tu in asr.TestingUnitList)
            {
                tablef.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 2));

                tablef.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
                tablef.AddCell(addNewCell(tu.TESTINGMETHODTYPE.ToString(), "left", "bottom", false, false, false, false, 18, false, 1));
                tablef.AddCell(addNewCell(tu.NUMBER.ToString(), "center", "bottom", false, false, false, true, 18, false, 1));
                tablef.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));
                tablef.AddCell(addNewCell(tu.SIZE.ToString(), "center", "bottom", false, false, false, true, 18, false, 1));
                tablef.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));
                tablef.AddCell(addNewCell(tu.MAXDEPTH.ToString(), "center", "bottom", false, false, false, true, 18, false, 1));
            }
            doc.Add(tablef);

            tablef = new PdfPTable(5);
            tablef.HorizontalAlignment = Element.ALIGN_LEFT;
            tablef.TotalWidth = 500;
            tablef.SpacingBefore = 10;
            tablef.LockedWidth = true;
            int[] headerwidthsf6 = { 15, 20, 80, 50, 335 };
            tablef.SetWidths(headerwidthsf6);
            tablef.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));
            tablef.AddCell(addNewCell("5.", "left", "bottom", false, false, false, false, 18, false, 1));
            tablef.AddCell(addNewCell("Description of excavation units:", "left", "bottom", false, false, false, false, 18, false, 3));
            tablef.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 2));
            tablef.AddCell(addNewCell("Number:", "left", "bottom", false, false, false, false, 18, false, 1));
            tablef.AddCell(addNewCell(asr.EXCAVNUMBER.ToString(), "center", "bottom", false, false, false, true, 18, false, 1));
            tablef.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            tablef.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 2));
            tablef.AddCell(addNewCell("Size (meters):", "left", "bottom", false, false, false, false, 18, false, 1));
            tablef.AddCell(addNewCell(asr.EXCAVSIZE.ToString(), "center", "bottom", false, false, false, true, 18, false, 1));
            tablef.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            tablef.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 2));
            tablef.AddCell(addNewCell("Max. Depth (cm):", "left", "bottom", false, false, false, false, 18, false, 1));
            tablef.AddCell(addNewCell(asr.EXCAVDEPTH.ToString(), "center", "bottom", false, false, false, true, 18, false, 1));
            tablef.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            //EXCAV COMMENTS
            tablef.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 5));
            tablef.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 2));
            tablef.AddCell(addNewCell("Excavation Comments:", "left", "bottom", false, false, false, false, 18, false, 3));
            tablef.AddCell(addNewCell(" ", "left", "top", false, false, false, false, 54, false, 2));
            tablef.AddCell(addNewCell(asr.EXCAVATIONCOMMENTS.ToString(), "left", "top", false, false, false, false, 54, false, 3));

            doc.Add(tablef);
            #endregion

            doc.NewPage();

            #region Section G - Management Information

            PdfPTable tableg = new PdfPTable(8);
            tableg.HorizontalAlignment = Element.ALIGN_LEFT;
            tableg.TotalWidth = 500;
            tableg.LockedWidth = true;
            int[] headerwidthsg = { 15, 20, 25, 150, 15, 25, 150, 100 };
            tableg.SetWidths(headerwidthsg);

            tableg.AddCell(addNewCell("G.", "left", "bottom", false, false, false, false, 18, false, 1));
            tableg.AddCell(addNewCell("MANAGEMENT INFORMATION", "left", "bottom", false, false, false, false, 18, true, 7));
            tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 5, false, 8));
            tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));
            tableg.AddCell(addNewCell("1.", "left", "bottom", false, false, false, false, 18, false, 1));
            tableg.AddCell(addNewCell("Present land use:", "left", "bottom", false, false, false, false, 18, false, 6));

            tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 2));

            if (asr.LU_AGRICULTURE.Equals("Y"))
            {
                tableg.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("Agricultural", "left", "bottom", false, false, false, false, 18, false, 1));
                tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            }
            else
            {
                tableg.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("Agricultural", "left", "bottom", false, false, false, false, 18, false, 1));
                tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            }

            if (asr.LU_RESIDENTIALHD.Equals("Y"))
            {
                tableg.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("Residential, high density", "left", "bottom", false, false, false, false, 18, false, 1));
                tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            }
            else
            {
                tableg.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("Residential, high density", "left", "bottom", false, false, false, false, 18, false, 1));
                tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            }

            tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 2));

            if (asr.LU_FOREST.Equals("Y"))
            {
                tableg.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("Forest", "left", "bottom", false, false, false, false, 18, false, 1));
                tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            }
            else
            {
                tableg.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("Forest", "left", "bottom", false, false, false, false, 18, false, 1));
                tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            }

            if (asr.LU_COMMERCIAL.Equals("Y"))
            {
                tableg.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("Commercial", "left", "bottom", false, false, false, false, 18, false, 1));
                tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            }
            else
            {
                tableg.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("Commercial", "left", "bottom", false, false, false, false, 18, false, 1));
                tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            }

            tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 2));

            if (asr.LU_FALLOW.Equals("Y"))
            {
                tableg.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("Fallow", "left", "bottom", false, false, false, false, 18, false, 1));
                tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            }
            else
            {
                tableg.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("Fallow", "left", "bottom", false, false, false, false, 18, false, 1));
                tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            }

            if (asr.LU_INDUSTRIAL.Equals("Y"))
            {
                tableg.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("Industrial", "left", "bottom", false, false, false, false, 18, false, 1));
                tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            }
            else
            {
                tableg.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("Industrial", "left", "bottom", false, false, false, false, 18, false, 1));
                tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            }

            tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 2));

            if (asr.LU_RESIDENTIALLD.Equals("Y"))
            {
                tableg.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("Residential, low density", "left", "bottom", false, false, false, false, 18, false, 1));
                tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            }
            else
            {
                tableg.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("Residential, low density", "left", "bottom", false, false, false, false, 18, false, 1));
                tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            }

            if (asr.LU_OTHER.Equals("Y"))
            {
                tableg.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("Other", "left", "bottom", false, false, false, false, 18, false, 1));
                tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            }
            else
            {
                tableg.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("Other", "left", "bottom", false, false, false, false, 18, false, 1));
                tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            }


            tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 5, false, 8));
            tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 2));
            tableg.AddCell(addNewCell("Land Use Comments:", "left", "bottom", false, false, false, false, 18, false, 6));

            tableg.AddCell(addNewCell(" ", "left", "top", false, false, false, false, 54, false, 2));
            tableg.AddCell(addNewCell(asr.LANDUSECOMMENTS.ToString(), "left", "top", false, false, false, false, 54, false, 6));

            doc.Add(tableg);

            tableg = new PdfPTable(9);
            tableg.HorizontalAlignment = Element.ALIGN_LEFT;
            tableg.TotalWidth = 475;
            tableg.LockedWidth = true;
            int[] headerwidthsg1 = { 15, 20, 140, 25, 75, 25, 75, 25, 75 };
            tableg.SetWidths(headerwidthsg1);

            tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));
            tableg.AddCell(addNewCell("2.", "left", "bottom", false, false, false, false, 18, false, 1));
            tableg.AddCell(addNewCell("Present condition of site:", "left", "bottom", false, false, false, false, 18, false, 1));

            sval = asr.SITEINTEGRITY.ToString();

            if (sval != "0") tableg.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            else tableg.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            tableg.AddCell(addNewCell("Intact", "left", "bottom", false, false, false, false, 18, false, 1));

            if (sval != "1") tableg.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            else tableg.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            tableg.AddCell(addNewCell("Damaged", "left", "bottom", false, false, false, false, 18, false, 1));

            if (sval != "2") tableg.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            else tableg.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            tableg.AddCell(addNewCell("Unknown", "left", "bottom", false, false, false, false, 18, false, 1));

            tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 5, false, 9));
            tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 2));
            tableg.AddCell(addNewCell("Extent of Damage:", "left", "bottom", false, false, false, false, 18, false, 1));

            sval = asr.DAMAGEEXTENT.ToString();

            if (sval != "0") tableg.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            else tableg.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            tableg.AddCell(addNewCell("Light", "left", "bottom", false, false, false, false, 18, false, 1));

            if (sval != "1") tableg.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            else tableg.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            tableg.AddCell(addNewCell("Moderate", "left", "bottom", false, false, false, false, 18, false, 1));

            if (sval != "2") tableg.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            else tableg.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            tableg.AddCell(addNewCell("Heavy", "left", "bottom", false, false, false, false, 18, false, 1));

            doc.Add(tableg);

            tableg = new PdfPTable(8);
            tableg.HorizontalAlignment = Element.ALIGN_LEFT;
            tableg.TotalWidth = 500;
            tableg.LockedWidth = true;
            int[] headerwidthsg2 = { 15, 20, 25, 130, 5, 25, 130, 150 };
            tableg.SetWidths(headerwidthsg2);
            tableg.SpacingBefore = 5;

            tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 2));
            tableg.AddCell(addNewCell("Nature of Damage:", "left", "bottom", false, false, false, false, 18, false, 6));

            tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 2));

            if (asr.DAMAGE_EROSION.Equals("Y"))
            {
                tableg.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("Erosion", "left", "bottom", false, false, false, false, 18, false, 1));
                tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            }
            else
            {
                tableg.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("Erosion", "left", "bottom", false, false, false, false, 18, false, 1));
                tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            }

            if (asr.DAMAGE_VANDALISM.Equals("Y"))
            {
                tableg.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("Vandalism", "left", "bottom", false, false, false, false, 18, false, 1));
                tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            }
            else
            {
                tableg.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("Vandalism", "left", "bottom", false, false, false, false, 18, false, 1));
                tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            }

            tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 2));

            if (asr.DAMAGE_CULTIVATION.Equals("Y"))
            {
                tableg.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("Cultivation", "left", "bottom", false, false, false, false, 18, false, 1));
                tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            }
            else
            {
                tableg.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("Cultivation", "left", "bottom", false, false, false, false, 18, false, 1));
                tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            }

            if (asr.DAMAGE_INUNDATION.Equals("Y"))
            {
                tableg.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("Inundation", "left", "bottom", false, false, false, false, 18, false, 1));
                tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            }
            else
            {
                tableg.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("Inundation", "left", "bottom", false, false, false, false, 18, false, 1));
                tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            }

            tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 2));

            if (asr.DAMAGE_LOGGING.Equals("Y"))
            {
                tableg.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("Logging", "left", "bottom", false, false, false, false, 18, false, 1));
                tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            }
            else
            {
                tableg.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("Logging", "left", "bottom", false, false, false, false, 18, false, 1));
                tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            }

            if (asr.DAMAGE_OTHER.Equals("Y"))
            {
                tableg.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("Other", "left", "bottom", false, false, false, false, 18, false, 1));
                tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            }
            else
            {
                tableg.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("Other", "left", "bottom", false, false, false, false, 18, false, 1));
                tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            }

            tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 2));

            if (asr.DAMAGE_CONSTRUCTION.Equals("Y"))
            {
                tableg.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("Construction/Development", "left", "bottom", false, false, false, false, 18, false, 1));
                tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            }
            else
            {
                tableg.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("Construction/Development", "left", "bottom", false, false, false, false, 18, false, 1));
                tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            }

            tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 10, false, 8));
            tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 2));
            tableg.AddCell(addNewCell("Nature of Damage Comments:", "left", "bottom", false, false, false, false, 18, false, 6));
            tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 54, false, 2));
            tableg.AddCell(addNewCell(asr.DAMAGECOMMENTS.ToString(), "left", "top", false, false, false, false, 54, false, 6));

            doc.Add(tableg);

            tableg = new PdfPTable(10);
            tableg.HorizontalAlignment = Element.ALIGN_LEFT;
            tableg.TotalWidth = 435;
            tableg.LockedWidth = true;
            int[] headerwidthsg3 = { 15, 20, 25, 75, 25, 75, 25, 75, 25, 75 };
            tableg.SetWidths(headerwidthsg3);

            tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));
            tableg.AddCell(addNewCell("3.", "left", "bottom", false, false, false, false, 18, false, 1));
            tableg.AddCell(addNewCell("Potential impacts and threats to site:", "left", "bottom", false, false, false, false, 18, false, 8));
            tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 2));
            tableg.AddCell(addNewCell("Potential threat:", "left", "bottom", false, false, false, false, 18, false, 8));
            tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 2));

            sval = asr.THREATPOTENTIAL.ToString();
            if (sval != "0") tableg.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            else tableg.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            tableg.AddCell(addNewCell("None", "left", "bottom", false, false, false, false, 18, false, 1));
            if (sval != "1") tableg.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            else tableg.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            tableg.AddCell(addNewCell("Low", "left", "bottom", false, false, false, false, 18, false, 1));
            if (sval != "2") tableg.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            else tableg.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            tableg.AddCell(addNewCell("Moderate", "left", "bottom", false, false, false, false, 18, false, 1));
            if (sval != "3") tableg.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            else tableg.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            tableg.AddCell(addNewCell("High", "left", "bottom", false, false, false, false, 18, false, 1));

            doc.Add(tableg);

            tableg = new PdfPTable(8);
            tableg.HorizontalAlignment = Element.ALIGN_LEFT;
            tableg.TotalWidth = 500;
            tableg.LockedWidth = true;
            //int[] headerwidthsg2 = {15,20,25,130,5,25,130,150};
            tableg.SetWidths(headerwidthsg2);
            tableg.SpacingBefore = 5;

            tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 2));
            tableg.AddCell(addNewCell("Nature of Threat:", "left", "bottom", false, false, false, false, 18, false, 6));


            /*tableg.AddCell(addNewCell(nod[0], "left", "bottom", false, false, false, false, 18, false, 2));
            sval = asr.IMPACTZONE.ToString();
            switch (sval)
            {
                case "0":
                    tableg.AddCell(addNewCell(" - Direct Impact Zone", "left", "bottom", false, false, false, false, 18, false, 2));
                    break;
                case "1":
                    tableg.AddCell(addNewCell(" - Indirect Impact Zone", "left", "bottom", false, false, false, false, 18, false, 2));
                    break;
                case "2":
                    tableg.AddCell(addNewCell(" - Outside Impact Zone", "left", "bottom", false, false, false, false, 18, false, 2));
                    break;
                case "3":
                    tableg.AddCell(addNewCell(" - Indeterminate Impact Zone", "left", "bottom", false, false, false, false, 18, false, 2));
                    break;
                default:
                    tableg.AddCell(addNewCell(" - Impact Zone Undefined", "left", "bottom", false, false, false, false, 18, false, 2));
                    break;
            }*/

            tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 2));

            if (asr.THREAT_EROSION.Equals("Y"))
            {
                tableg.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("Erosion", "left", "bottom", false, false, false, false, 18, false, 1));
                tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            }
            else
            {
                tableg.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("Erosion", "left", "bottom", false, false, false, false, 18, false, 1));
                tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            }

            if (asr.THREAT_VANDALISM.Equals("Y"))
            {
                tableg.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("Vandalism", "left", "bottom", false, false, false, false, 18, false, 1));
                tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            }
            else
            {
                tableg.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("Vandalism", "left", "bottom", false, false, false, false, 18, false, 1));
                tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            }

            tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 2));

            if (asr.THREAT_CULTIVATION.Equals("Y"))
            {
                tableg.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("Cultivation", "left", "bottom", false, false, false, false, 18, false, 1));
                tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            }
            else
            {
                tableg.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("Cultivation", "left", "bottom", false, false, false, false, 18, false, 1));
                tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            }

            if (asr.THREAT_INUNDATION.Equals("Y"))
            {
                tableg.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("Inundation", "left", "bottom", false, false, false, false, 18, false, 1));
                tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            }
            else
            {
                tableg.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("Inundation", "left", "bottom", false, false, false, false, 18, false, 1));
                tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            }

            tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 2));

            if (asr.THREAT_LOGGING.Equals("Y"))
            {
                tableg.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("Logging", "left", "bottom", false, false, false, false, 18, false, 1));
                tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            }
            else
            {
                tableg.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("Logging", "left", "bottom", false, false, false, false, 18, false, 1));
                tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            }

            if (asr.THREAT_OTHER.Equals("Y"))
            {
                tableg.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("Other", "left", "bottom", false, false, false, false, 18, false, 1));
                tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            }
            else
            {
                tableg.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("Other", "left", "bottom", false, false, false, false, 18, false, 1));
                tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            }

            tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 2));

            if (asr.THREAT_CONSTRUCTION.Equals("Y"))
            {
                tableg.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("Construction/Development", "left", "bottom", false, false, false, false, 18, false, 1));
                tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            }
            else
            {
                tableg.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("Construction/Development", "left", "bottom", false, false, false, false, 18, false, 1));
                tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            }

            tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));

            tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 10, false, 8));
            tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 2));
            tableg.AddCell(addNewCell("Nature of Threat Comments:", "left", "bottom", false, false, false, false, 18, false, 6));
            tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 54, false, 2));
            tableg.AddCell(addNewCell(asr.THREATCOMMENTS.ToString(), "left", "top", false, false, false, false, 54, false, 6));

            doc.Add(tableg);

            doc.NewPage();

            tableg = new PdfPTable(14);
            tableg.HorizontalAlignment = Element.ALIGN_LEFT;
            tableg.TotalWidth = 500;
            tableg.LockedWidth = true;
            int[] headerwidthsg4 = { 15, 20, 25, 50, 25, 50, 25, 60, 25, 55, 25, 50, 25, 50 };
            tableg.SetWidths(headerwidthsg4);

            tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));
            tableg.AddCell(addNewCell("4.", "left", "bottom", false, false, false, false, 18, false, 1));
            tableg.AddCell(addNewCell("Recommendations for further work:", "left", "bottom", false, false, false, false, 18, false, 12));


            if (asr.REC_SURVEY.Equals("Y"))
            {
                tableg.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("Survey", "left", "bottom", false, false, false, false, 18, false, 1));

            }
            else
            {
                tableg.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("Survey", "left", "bottom", false, false, false, false, 18, false, 1));
            }

            if (asr.REC_TESTING.Equals("Y"))
            {
                tableg.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("Testing", "left", "bottom", false, false, false, false, 18, false, 1));

            }
            else
            {
                tableg.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("Testing", "left", "bottom", false, false, false, false, 18, false, 1));
            }

            if (asr.REC_EXCAVATION.Equals("Y"))
            {
                tableg.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("Excavation", "left", "bottom", false, false, false, false, 18, false, 1));

            }
            else
            {
                tableg.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("Excavation", "left", "bottom", false, false, false, false, 18, false, 1));
            }

            if (asr.REC_ARCHIVAL.Equals("Y"))
            {
                tableg.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("Archival", "left", "bottom", false, false, false, false, 18, false, 1));

            }
            else
            {
                tableg.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("Archival", "left", "bottom", false, false, false, false, 18, false, 1));
            }

            if (asr.REC_NONE.Equals("Y"))
            {
                tableg.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("None", "left", "bottom", false, false, false, false, 18, false, 1));

            }
            else
            {
                tableg.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("None", "left", "bottom", false, false, false, false, 18, false, 1));
            }

            if (asr.REC_OTHER.Equals("Y"))
            {
                tableg.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("Other", "left", "bottom", false, false, false, false, 18, false, 1));

            }
            else
            {
                tableg.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
                tableg.AddCell(addNewCell("Other", "left", "bottom", false, false, false, false, 18, false, 1));
            }

            tableg.AddCell(addNewCell(" ", "center", "bottom", false, false, false, false, 18, false, 2));
            tableg.AddCell(addNewCell("Comments:", "left", "bottom", false, false, false, false, 18, false, 12));
            tableg.AddCell(addNewCell(" ", "center", "bottom", false, false, false, false, 54, false, 2));
            tableg.AddCell(addNewCell(asr.RECOMMENDCOMMENTS.ToString(), "left", "top", false, false, false, false, 54, false, 12));

            doc.Add(tableg);

            tableg = new PdfPTable(9);
            tableg.HorizontalAlignment = Element.ALIGN_LEFT;
            tableg.TotalWidth = 500;
            tableg.LockedWidth = true;
            int[] headerwidthsg5 = { 15, 20, 25, 50, 25, 50, 25, 50, 240 };
            tableg.SetWidths(headerwidthsg5);
            tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));
            tableg.AddCell(addNewCell("5.", "left", "bottom", false, false, false, false, 18, false, 1));
            tableg.AddCell(addNewCell("References: Historic/Archival Documentation", "left", "bottom", false, false, false, false, 18, false, 7));
            tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 2));
            sval = asr.HISTORICALARCHIVALDOC.ToString();
            if (sval != "0") tableg.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            else tableg.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            tableg.AddCell(addNewCell("Yes", "left", "bottom", false, false, false, false, 18, false, 1));
            if (sval != "1") tableg.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            else tableg.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            tableg.AddCell(addNewCell("No", "left", "bottom", false, false, false, false, 18, false, 1));
            if (sval != "2") tableg.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            else tableg.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            tableg.AddCell(addNewCell("Unknown", "left", "bottom", false, false, false, false, 18, false, 1));
            tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));
            tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 2));
            tableg.AddCell(addNewCell("Comments:", "left", "bottom", false, false, false, false, 18, false, 7));
            tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 54, false, 2));
            tableg.AddCell(addNewCell(asr.HISTORICALARCHIVALDOCNOTES.ToString(), "left", "top", false, false, false, false, 54, false, 7));

            tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 2));
            tableg.AddCell(addNewCell("Archaeological Documentation", "left", "bottom", false, false, false, false, 18, false, 7));
            tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 2));
            sval = asr.ARCHAEOLOGICALDOC.ToString();
            if (sval != "0") tableg.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            else tableg.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            tableg.AddCell(addNewCell("Yes", "left", "bottom", false, false, false, false, 18, false, 1));
            if (sval != "1") tableg.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            else tableg.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            tableg.AddCell(addNewCell("No", "left", "bottom", false, false, false, false, 18, false, 1));
            if (sval != "2") tableg.AddCell(addNewCell(" ", "center", "bottom", false, false, false, true, 18, false, 1));
            else tableg.AddCell(addNewCell("X", "center", "bottom", false, false, false, true, 18, false, 1));
            tableg.AddCell(addNewCell("Unknown", "left", "bottom", false, false, false, false, 18, false, 1));
            tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));
            tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 2));
            tableg.AddCell(addNewCell("Comments:", "left", "bottom", false, false, false, false, 18, false, 7));
            tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 54, false, 2));
            tableg.AddCell(addNewCell(asr.ARCHAEOLOGICALDOCNOTES.ToString(), "left", "top", false, false, false, false, 54, false, 7));

            tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));
            tableg.AddCell(addNewCell("6.", "left", "bottom", false, false, false, false, 18, false, 1));
            tableg.AddCell(addNewCell("Additional management information/comments:", "left", "bottom", false, false, false, false, 18, false, 7));
            tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 54, false, 2));
            tableg.AddCell(addNewCell(asr.MANAGEMENTCOMMENTS.ToString(), "left", "top", false, false, false, false, 54, false, 7));

            tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));
            tableg.AddCell(addNewCell("7.", "left", "bottom", false, false, false, false, 18, false, 1));
            tableg.AddCell(addNewCell("Location of existing collections:", "left", "bottom", false, false, false, false, 18, false, 7));
            tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 54, false, 2));
            tableg.AddCell(addNewCell(asr.COLLECTIONSLOCATION.ToString(), "left", "top", false, false, false, false, 54, false, 7));

            tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));
            tableg.AddCell(addNewCell("8.", "left", "bottom", false, false, false, false, 18, false, 1));
            tableg.AddCell(addNewCell("Location of photographs:", "left", "bottom", false, false, false, false, 18, false, 7));
            tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 54, false, 2));
            tableg.AddCell(addNewCell(asr.PHOTOLOCATION.ToString(), "left", "top", false, false, false, false, 54, false, 7));

            tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 1));
            tableg.AddCell(addNewCell("9.", "left", "bottom", false, false, false, false, 18, false, 1));
            tableg.AddCell(addNewCell("Location of special samples:", "left", "bottom", false, false, false, false, 18, false, 7));
            tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 54, false, 2));
            tableg.AddCell(addNewCell(asr.SAMPLELOCATION.ToString(), "left", "top", false, false, false, false, 54, false, 7));

            tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 18, false, 2));
            tableg.AddCell(addNewCell("Type of special samples:", "left", "bottom", false, false, false, false, 18, false, 7));
            tableg.AddCell(addNewCell(" ", "left", "bottom", false, false, false, false, 54, false, 2));
            tableg.AddCell(addNewCell(asr.SAMPLETYPE.ToString(), "left", "top", false, false, false, false, 54, false, 7));

            doc.Add(tableg);
            #endregion


            doc.Close();


            doc = null;
            string outputURL = HttpContext.Current.Request.Url.GetLeftPart(UriPartial.Authority) + ResolveUrl("~/");
            Response.Redirect(outputURL + "PDF/" + "_ags_" + asr.SITEID + "myPDF.pdf");
        

    }


    private PdfPCell addNewCell(string msg, string align, string border, string height, bool bunderline, int colSpan)
    {
        PdfPCell cell = null;
        if (bunderline == false)
        {
            iTextSharp.text.pdf.BaseFont bf = iTextSharp.text.pdf.BaseFont.CreateFont(BaseFont.TIMES_ROMAN, BaseFont.WINANSI, BaseFont.NOT_EMBEDDED);
            Single fontSize = 11;
            cell = new PdfPCell(new iTextSharp.text.Phrase(msg, new iTextSharp.text.Font(bf, fontSize)));
        }
        else
        {
            iTextSharp.text.pdf.BaseFont bf = iTextSharp.text.pdf.BaseFont.CreateFont(BaseFont.TIMES_ROMAN, BaseFont.WINANSI, BaseFont.NOT_EMBEDDED);
            Single fontSize = 11;
            cell = new PdfPCell(new iTextSharp.text.Phrase(msg, new iTextSharp.text.Font(bf, fontSize, iTextSharp.text.Font.UNDERLINE)));

        }

        //cell.VerticalAlignment = Element.ALIGN_MIDDLE;
        if (align == "center") cell.HorizontalAlignment = Element.ALIGN_CENTER;
        else if (align == "right") cell.HorizontalAlignment = Element.ALIGN_RIGHT;
        else cell.HorizontalAlignment = Element.ALIGN_LEFT;
        cell.PaddingLeft = 2;
        cell.PaddingBottom = 0;
        cell.PaddingRight = 2;
        cell.PaddingTop = 2;
        cell.UseAscender = false;
        cell.UseDescender = true;
        cell.Colspan = colSpan;
        if (border == "bottom")
        {
            cell.Border = iTextSharp.text.Rectangle.BOTTOM_BORDER;
            cell.BorderColorBottom = iTextSharp.text.Color.BLACK;
        }
        else cell.Border = iTextSharp.text.Rectangle.NO_BORDER;

        if (height == "small") cell.FixedHeight = 18;
        else if (height == "medium") cell.FixedHeight = 36;
        else if (height == "large") cell.FixedHeight = 72;

        return cell;
    }
    private PdfPCell addNewCell(string msg, string align, string border, float height, bool bunderline, int colSpan)
    {
        PdfPCell cell = null;
        if (bunderline == false)
        {
            iTextSharp.text.pdf.BaseFont bf = iTextSharp.text.pdf.BaseFont.CreateFont(BaseFont.TIMES_ROMAN, BaseFont.WINANSI, BaseFont.NOT_EMBEDDED);
            Single fontSize = 11;
            cell = new PdfPCell(new iTextSharp.text.Phrase(msg, new iTextSharp.text.Font(bf, fontSize)));
        }
        else
        {
            iTextSharp.text.pdf.BaseFont bf = iTextSharp.text.pdf.BaseFont.CreateFont(BaseFont.TIMES_ROMAN, BaseFont.WINANSI, BaseFont.NOT_EMBEDDED);
            Single fontSize = 11;
            cell = new PdfPCell(new iTextSharp.text.Phrase(msg, new iTextSharp.text.Font(bf, fontSize, iTextSharp.text.Font.UNDERLINE)));

        }
        cell.PaddingLeft = 2;
        cell.PaddingBottom = 0;
        cell.PaddingRight = 2;
        cell.PaddingTop = 2;
        cell.UseAscender = false;
        cell.UseDescender = true;
        //cell.VerticalAlignment = Element.ALIGN_MIDDLE;
        if (align == "center") cell.HorizontalAlignment = Element.ALIGN_CENTER;
        else if (align == "right") cell.HorizontalAlignment = Element.ALIGN_RIGHT;
        else cell.HorizontalAlignment = Element.ALIGN_LEFT;

        cell.Colspan = colSpan;
        if (border == "bottom")
        {
            cell.Border = iTextSharp.text.Rectangle.BOTTOM_BORDER;
            cell.BorderColorBottom = iTextSharp.text.Color.BLACK;
        }
        else cell.Border = iTextSharp.text.Rectangle.NO_BORDER;

        cell.FixedHeight = height;
        return cell;
    }

    private PdfPCell addNewCell(string msg, string align, string valign, bool borderL, bool borderR, bool borderT, bool borderB, float height, bool bunderline, int colSpan)
    {
        PdfPCell cell = null;
        if (bunderline == false)
        {
            iTextSharp.text.pdf.BaseFont bf = iTextSharp.text.pdf.BaseFont.CreateFont(BaseFont.TIMES_ROMAN, BaseFont.WINANSI, BaseFont.NOT_EMBEDDED);
            Single fontSize = 11;
            cell = new PdfPCell(new iTextSharp.text.Phrase(msg, new iTextSharp.text.Font(bf, fontSize)));
        }
        else
        {
            iTextSharp.text.pdf.BaseFont bf = iTextSharp.text.pdf.BaseFont.CreateFont(BaseFont.TIMES_ROMAN, BaseFont.WINANSI, BaseFont.NOT_EMBEDDED);
            Single fontSize = 11;
            cell = new PdfPCell(new iTextSharp.text.Phrase(msg, new iTextSharp.text.Font(bf, fontSize, iTextSharp.text.Font.UNDERLINE)));

        }
        cell.PaddingLeft = 2;
        cell.PaddingBottom = 0;
        cell.PaddingRight = 2;
        cell.PaddingTop = 2;
        cell.UseAscender = false;
        cell.UseDescender = true;
        //cell.VerticalAlignment = Element.ALIGN_MIDDLE;
        if (align == "center") cell.HorizontalAlignment = Element.ALIGN_CENTER;
        else if (align == "right") cell.HorizontalAlignment = Element.ALIGN_RIGHT;
        else cell.HorizontalAlignment = Element.ALIGN_LEFT;

        if (valign == "top") cell.VerticalAlignment = Element.ALIGN_TOP;
        else if (valign == "bottom") cell.VerticalAlignment = Element.ALIGN_BOTTOM;

        cell.Colspan = colSpan;

        int borderval = 0;

        if (borderL)
        {
            borderval += iTextSharp.text.Rectangle.LEFT_BORDER;
            cell.BorderColorLeft = iTextSharp.text.Color.BLACK;
        }
        if (borderR)
        {
            borderval += iTextSharp.text.Rectangle.RIGHT_BORDER;
            cell.BorderColorRight = iTextSharp.text.Color.BLACK;
        }
        if (borderT)
        {
            borderval += iTextSharp.text.Rectangle.TOP_BORDER;
            cell.BorderColorTop = iTextSharp.text.Color.BLACK;
        }
        if (borderB)
        {
            borderval += iTextSharp.text.Rectangle.BOTTOM_BORDER;
            cell.BorderColorBottom = iTextSharp.text.Color.BLACK;
        }
        cell.Border = borderval;

        cell.FixedHeight = height;
        return cell;
    }
    private PdfPCell addNewCell(string msg, string align, bool borderL, bool borderR, bool borderT, bool borderB, float height, bool bunderline, int colSpan)
    {
        PdfPCell cell = null;
        if (bunderline == false)
        {
            iTextSharp.text.pdf.BaseFont bf = iTextSharp.text.pdf.BaseFont.CreateFont(BaseFont.TIMES_ROMAN, BaseFont.WINANSI, BaseFont.NOT_EMBEDDED);
            Single fontSize = 11;
            cell = new PdfPCell(new iTextSharp.text.Phrase(msg, new iTextSharp.text.Font(bf, fontSize)));
        }
        else
        {
            iTextSharp.text.pdf.BaseFont bf = iTextSharp.text.pdf.BaseFont.CreateFont(BaseFont.TIMES_ROMAN, BaseFont.WINANSI, BaseFont.NOT_EMBEDDED);
            Single fontSize = 11;
            cell = new PdfPCell(new iTextSharp.text.Phrase(msg, new iTextSharp.text.Font(bf, fontSize, iTextSharp.text.Font.UNDERLINE)));

        }
        cell.PaddingLeft = 2;
        cell.PaddingBottom = 0;
        cell.PaddingRight = 2;
        cell.PaddingTop = 2;
        cell.UseAscender = false;
        cell.UseDescender = true;
        //cell.VerticalAlignment = Element.ALIGN_MIDDLE;
        if (align == "center") cell.HorizontalAlignment = Element.ALIGN_CENTER;
        else if (align == "right") cell.HorizontalAlignment = Element.ALIGN_RIGHT;
        else cell.HorizontalAlignment = Element.ALIGN_LEFT;

        //			if (valign == "top")cell.VerticalAlignment = Element.ALIGN_TOP;
        //			else if (valign == "bottom") cell.VerticalAlignment = Element.ALIGN_BOTTOM;

        cell.Colspan = colSpan;

        int borderval = 0;

        if (borderL)
        {
            borderval += iTextSharp.text.Rectangle.LEFT_BORDER;
            cell.BorderColorLeft = iTextSharp.text.Color.BLACK;
        }
        if (borderR)
        {
            borderval += iTextSharp.text.Rectangle.RIGHT_BORDER;
            cell.BorderColorRight = iTextSharp.text.Color.BLACK;
        }
        if (borderT)
        {
            borderval += iTextSharp.text.Rectangle.TOP_BORDER;
            cell.BorderColorTop = iTextSharp.text.Color.BLACK;
        }
        if (borderB)
        {
            borderval += iTextSharp.text.Rectangle.BOTTOM_BORDER;
            cell.BorderColorBottom = iTextSharp.text.Color.BLACK;
        }
        cell.Border = borderval;

        cell.FixedHeight = height;
        return cell;
    }
    
    private iTextSharp.text.Cell addCellCenterNoUnderline(string msg)
    {
        iTextSharp.text.pdf.BaseFont bf = iTextSharp.text.pdf.BaseFont.CreateFont(BaseFont.HELVETICA, BaseFont.WINANSI, BaseFont.NOT_EMBEDDED);
        Single fontSize = 11;
        iTextSharp.text.Cell cell = new iTextSharp.text.Cell(new iTextSharp.text.Phrase(msg, new iTextSharp.text.Font(bf, fontSize)));

        cell.HorizontalAlignment = Element.ALIGN_CENTER;
        cell.VerticalAlignment = Element.ALIGN_MIDDLE;
        //cell.NoWrap = true;
        cell.Border = iTextSharp.text.Rectangle.NO_BORDER;
        //cell.BorderColor = new iTextSharp.text.Color(255, 255, 255);
        cellHeight += cell.Height;
        return cell;
    }
    private iTextSharp.text.Cell addCellCenterNoUnderline(string msg, int colspan)
    {
        iTextSharp.text.pdf.BaseFont bf = iTextSharp.text.pdf.BaseFont.CreateFont(BaseFont.HELVETICA, BaseFont.WINANSI, BaseFont.NOT_EMBEDDED);
        Single fontSize = 11;
        iTextSharp.text.Cell cell = new iTextSharp.text.Cell(new iTextSharp.text.Phrase(msg, new iTextSharp.text.Font(bf, fontSize)));

        cell.HorizontalAlignment = Element.ALIGN_CENTER;
        cell.VerticalAlignment = Element.ALIGN_MIDDLE;
        cell.Colspan = colspan;
        //cell.NoWrap = true;
        cell.Border = iTextSharp.text.Rectangle.NO_BORDER;
        //cell.BorderColor = new iTextSharp.text.Color(255, 255, 255);
        cellHeight += cell.Height;
        return cell;
    }
    private iTextSharp.text.Cell addCellLeftNoUnderline(string msg)
    {
        iTextSharp.text.pdf.BaseFont bf = iTextSharp.text.pdf.BaseFont.CreateFont(BaseFont.HELVETICA, BaseFont.WINANSI, BaseFont.NOT_EMBEDDED);
        Single fontSize = 11;
        iTextSharp.text.Cell cell = new iTextSharp.text.Cell(new iTextSharp.text.Phrase(msg, new iTextSharp.text.Font(bf, fontSize)));
        cell.HorizontalAlignment = Element.ALIGN_LEFT;
        cell.VerticalAlignment = Element.ALIGN_MIDDLE;
        //cell.NoWrap = true;
        cell.Border = iTextSharp.text.Rectangle.NO_BORDER;
        //cell.BorderColor = new iTextSharp.text.Color(255, 255, 255);
        cellHeight += cell.Height;

        return cell;
    }
    private iTextSharp.text.Cell addCellRightNoUnderline(string msg, int colspan)
    {
        iTextSharp.text.pdf.BaseFont bf = iTextSharp.text.pdf.BaseFont.CreateFont(BaseFont.HELVETICA, BaseFont.WINANSI, BaseFont.NOT_EMBEDDED);
        Single fontSize = 11;

        iTextSharp.text.Cell cell = new iTextSharp.text.Cell(new iTextSharp.text.Phrase(msg, new iTextSharp.text.Font(bf, fontSize)));
        cell.Colspan = colspan;
        //cell.CellWidth = width;
        cell.HorizontalAlignment = Element.ALIGN_RIGHT;
        cell.VerticalAlignment = Element.ALIGN_MIDDLE;
        //cell.NoWrap = true;
        cell.Border = iTextSharp.text.Rectangle.NO_BORDER;
        //cell.BorderColor = new iTextSharp.text.Color(255, 255, 255);
        cellHeight += cell.Height;

        return cell;
    }
    private iTextSharp.text.Cell addCellLeftNoUnderline(string msg, int colspan)
    {
        iTextSharp.text.pdf.BaseFont bf = iTextSharp.text.pdf.BaseFont.CreateFont(BaseFont.HELVETICA, BaseFont.WINANSI, BaseFont.NOT_EMBEDDED);
        Single fontSize = 11;

        iTextSharp.text.Cell cell = new iTextSharp.text.Cell(new iTextSharp.text.Phrase(msg, new iTextSharp.text.Font(bf, fontSize)));

        cell.Colspan = colspan;
        //cell.CellWidth = width;
        cell.HorizontalAlignment = Element.ALIGN_LEFT;
        cell.VerticalAlignment = Element.ALIGN_MIDDLE;
        //cell.NoWrap = true;
        cell.Border = iTextSharp.text.Rectangle.NO_BORDER;
        //cell.BorderColor = new iTextSharp.text.Color(255, 255, 255);
        cellHeight += cell.Height;

        return cell;
    }

    private iTextSharp.text.Cell addCellLeftNoUnderline(string msg, int colspan, bool txtUnderline)
    {
        iTextSharp.text.pdf.BaseFont bf = iTextSharp.text.pdf.BaseFont.CreateFont(BaseFont.HELVETICA, BaseFont.WINANSI, BaseFont.NOT_EMBEDDED);
        Single fontSize = 11;
        iTextSharp.text.Cell cell = null;
        if (txtUnderline)
        {
            cell = new iTextSharp.text.Cell(new iTextSharp.text.Phrase(msg, new iTextSharp.text.Font(bf, fontSize, iTextSharp.text.Font.UNDERLINE)));
        }
        else
        {
            cell = new iTextSharp.text.Cell(new iTextSharp.text.Phrase(msg, new iTextSharp.text.Font(bf, fontSize)));
        }

        cell.Colspan = colspan;
        //cell.CellWidth = width;
        cell.HorizontalAlignment = Element.ALIGN_LEFT;
        cell.VerticalAlignment = Element.ALIGN_MIDDLE;
        //cell.NoWrap = true;
        //			if (txtUnderline == false) cell.Border = iTextSharp.text.Rectangle.NO_BORDER;
        //			else
        //			{
        //				cell.Border = iTextSharp.text.Rectangle.BOTTOM_BORDER;
        //				cell.BorderColorBottom = new iTextSharp.text.Color(0, 0, 255);
        //			}
        //cell.BorderColor = new iTextSharp.text.Color(255, 255, 255);
        cellHeight += cell.Height;
        return cell;
    }
    private iTextSharp.text.Cell addCellLeftNoUnderline(string msg, string width)
    {
        iTextSharp.text.pdf.BaseFont bf = iTextSharp.text.pdf.BaseFont.CreateFont(BaseFont.HELVETICA, BaseFont.WINANSI, BaseFont.NOT_EMBEDDED);
        Single fontSize = 11;
        iTextSharp.text.Cell cell = new iTextSharp.text.Cell(new iTextSharp.text.Phrase(msg, new iTextSharp.text.Font(bf, fontSize)));
        //cell.Colspan=colspan;
        cell.HorizontalAlignment = Element.ALIGN_LEFT;
        cell.VerticalAlignment = Element.ALIGN_MIDDLE;
        cell.Width = width;
        cell.Border = iTextSharp.text.Rectangle.NO_BORDER;
        //cell.BorderColor = new iTextSharp.text.Color(255, 255, 255);
        cellHeight += cell.Height;
        return cell;
    }
    private iTextSharp.text.Cell addCellCenterUnderline(string msg)
    {
        iTextSharp.text.pdf.BaseFont bf = iTextSharp.text.pdf.BaseFont.CreateFont(BaseFont.HELVETICA, BaseFont.WINANSI, BaseFont.NOT_EMBEDDED);
        Single fontSize = 11;
        iTextSharp.text.Cell cell = new iTextSharp.text.Cell(new iTextSharp.text.Phrase(msg, new iTextSharp.text.Font(bf, fontSize)));
        cell.HorizontalAlignment = Element.ALIGN_CENTER;
        cell.VerticalAlignment = Element.ALIGN_MIDDLE;
        //cell.NoWrap = true;
        cell.Border = iTextSharp.text.Rectangle.BOTTOM_BORDER;
        cell.BorderColorBottom = new iTextSharp.text.Color(0, 0, 255);
        cellHeight += cell.Height;
        return cell;
    }
    private iTextSharp.text.Cell addCellCenterUnderline(string msg, string width)
    {
        iTextSharp.text.pdf.BaseFont bf = iTextSharp.text.pdf.BaseFont.CreateFont(BaseFont.HELVETICA, BaseFont.WINANSI, BaseFont.NOT_EMBEDDED);
        Single fontSize = 11;
        iTextSharp.text.Cell cell = new iTextSharp.text.Cell(new iTextSharp.text.Phrase(msg, new iTextSharp.text.Font(bf, fontSize)));
        cell.HorizontalAlignment = Element.ALIGN_CENTER;
        cell.VerticalAlignment = Element.ALIGN_MIDDLE;
        cell.Width = width;
        cell.Border = iTextSharp.text.Rectangle.BOTTOM_BORDER;
        cell.BorderColorBottom = new iTextSharp.text.Color(0, 0, 255);
        cellHeight += cell.Height;
        return cell;
    }
    private iTextSharp.text.Cell addCellLeft(string msg, string msg2)
    {
        iTextSharp.text.pdf.BaseFont bf = iTextSharp.text.pdf.BaseFont.CreateFont(BaseFont.HELVETICA, BaseFont.WINANSI, BaseFont.NOT_EMBEDDED);
        Single fontSize = 11;
        iTextSharp.text.Cell cell = new iTextSharp.text.Cell();
        cell.Add(new iTextSharp.text.Phrase(msg, FontFactory.GetFont(FontFactory.HELVETICA, 12)));
        cell.Add(new iTextSharp.text.Phrase(msg2, FontFactory.GetFont(FontFactory.HELVETICA, 12, iTextSharp.text.Font.UNDERLINE)));
        cell.HorizontalAlignment = Element.ALIGN_LEFT;
        cell.VerticalAlignment = Element.ALIGN_MIDDLE;
        //cell.Width = width;
        //cell.Border = iTextSharp.text.Rectangle.BOTTOM_BORDER;
        //cell.BorderColorBottom = new iTextSharp.text.Color(0, 0, 255);
        cellHeight += cell.Height;
        return cell;
    }
    private iTextSharp.text.Cell addCellLeftUnderline(string msg)
    {
        iTextSharp.text.pdf.BaseFont bf = iTextSharp.text.pdf.BaseFont.CreateFont(BaseFont.HELVETICA, BaseFont.WINANSI, BaseFont.NOT_EMBEDDED);
        Single fontSize = 11;
        iTextSharp.text.Cell cell = new iTextSharp.text.Cell(new iTextSharp.text.Phrase(msg, new iTextSharp.text.Font(bf, fontSize)));
        cell.HorizontalAlignment = Element.ALIGN_LEFT;
        cell.VerticalAlignment = Element.ALIGN_MIDDLE;
        //cell.NoWrap = true;
        cell.Border = iTextSharp.text.Rectangle.BOTTOM_BORDER;
        cell.BorderColorBottom = new iTextSharp.text.Color(0, 0, 255);
        cellHeight += cell.Height;
        return cell;
    }
    private iTextSharp.text.Cell addCellLeftUnderline(string msg, int colspan)
    {
        iTextSharp.text.pdf.BaseFont bf = iTextSharp.text.pdf.BaseFont.CreateFont(BaseFont.HELVETICA, BaseFont.WINANSI, BaseFont.NOT_EMBEDDED);
        Single fontSize = 11;
        iTextSharp.text.Cell cell = new iTextSharp.text.Cell(new iTextSharp.text.Phrase(msg, new iTextSharp.text.Font(bf, fontSize)));
        cell.Colspan = colspan;
        cell.HorizontalAlignment = Element.ALIGN_LEFT;
        cell.VerticalAlignment = Element.ALIGN_MIDDLE;
        //cell.NoWrap = true;
        cell.Border = iTextSharp.text.Rectangle.BOTTOM_BORDER;
        cell.BorderColorBottom = new iTextSharp.text.Color(0, 0, 255);
        cellHeight += cell.Height;
        return cell;
    }

    private iTextSharp.text.Cell addCellLeftUnderline(string msg, int colspan, int rowspan)
    {
        iTextSharp.text.pdf.BaseFont bf = iTextSharp.text.pdf.BaseFont.CreateFont(BaseFont.HELVETICA, BaseFont.WINANSI, BaseFont.NOT_EMBEDDED);
        Single fontSize = 11;
        iTextSharp.text.Cell cell = new iTextSharp.text.Cell(new iTextSharp.text.Phrase(msg, new iTextSharp.text.Font(bf, fontSize)));
        cell.Colspan = colspan;
        cell.Rowspan = rowspan;
        cell.HorizontalAlignment = Element.ALIGN_LEFT;
        cell.VerticalAlignment = Element.ALIGN_MIDDLE;
        //cell.NoWrap = true;
        cell.Border = iTextSharp.text.Rectangle.BOTTOM_BORDER;
        cell.BorderColorBottom = new iTextSharp.text.Color(0, 0, 255);
        cellHeight += cell.Height;
        return cell;
    }

}