using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.IO;
using System.Linq;
using System.Net;
using System.Runtime.Serialization.Json;
using System.Web;

/// <summary>
/// Summary description for AgolFeatureQuery
/// </summary>
public class FeatureQueryAgol
{

    private String pToken = "9jPtLvPjjcIL9q_TyPQEL7i77886EKX_ai7PKcgwEZwUQFQ9z-kBMJ57kd6L6BPMhznrIg5LrP0DbL7SYt4DhT74jdsKeNN-l1XJpJi-ANKGa0opFBvOu3eYUiFH4pYsXV6N0HaYCl7MBejCLAd68Q..";

    public FeatureQueryAgol()
    {
        //
        // TODO: Add constructor logic here
        //
    }

    public ArchSiteRecord getArchSiteRecord(String siteid, String token)
    {
        pToken = token;
        ArchSiteRecord asr = new ArchSiteRecord();
        String requestUrl = "";
        double xmin = 0.0;
        double ymin = 0.0;
        double xmax = 0.0;
        double ymax = 0.0;
        //siteid = "38RD1199_0";

        try
        {
            requestUrl = ConfigurationManager.AppSettings["agol_archsite_layer"] + "/query?where=SITEID+%3D+%27" + siteid + "%27&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&outFields=%27*%27&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&f=pjson&token=" + pToken;

            HttpWebRequest request = WebRequest.Create(requestUrl) as HttpWebRequest;
            using (HttpWebResponse response = request.GetResponse() as HttpWebResponse)
            {
                if (response.StatusCode != HttpStatusCode.OK)
                    throw new Exception(String.Format(
                    "Server error (HTTP {0}: {1}).",
                    response.StatusCode,
                    response.StatusDescription));

                StreamReader reader = new StreamReader(response.GetResponseStream());

                Boolean isAttributes = false;
                Boolean isGeo = false;
                Boolean isStartObj = false;
                int arrayCount = 0;
                int floatCount = 0;
                String jToken = "";
                String jValue = "";
                String gValue = "";

                JsonTextReader jsonReader = new JsonTextReader(reader);
                while (jsonReader.Read())
                {
                    if (jsonReader.TokenType == JsonToken.PropertyName)
                    {
                        jToken = jsonReader.Value.ToString();

                        if (jToken.Equals("attributes") && isAttributes == false)
                        {
                            isAttributes = true;
                        }
                        if (jToken.Equals("geometry") && isAttributes == false)
                        {
                            isGeo = true;
                            gValue += "{\"rings\" : [[";
                        }
                        else if (isAttributes == true & isStartObj == true)
                        {
                            jToken = jsonReader.Value.ToString();
                        }
                    }
                    else if ((jsonReader.TokenType == JsonToken.String || jsonReader.TokenType == JsonToken.Null) && !jToken.Equals("") && isAttributes == true && isStartObj == true)
                    {

                        if (jsonReader.TokenType == JsonToken.String)
                            jValue = jsonReader.Value.ToString();
                        else
                            jValue = "Null";

                        if (asr.GetType().GetProperty(jToken) != null)
                        {

                            System.Reflection.PropertyInfo p = typeof(ArchSiteRecord).GetProperty(jToken);
                            Type t = p.PropertyType;



                            if (t == typeof(String))
                            {
                                if (!jValue.Equals("Null") && jValue != null)
                                {
                                    asr.GetType().GetProperty(jToken).SetValue(asr, jValue, null);
                                }
                                else
                                {
                                    asr.GetType().GetProperty(jToken).SetValue(asr, "", null);
                                }
                            }
                            else if (t == typeof(Double))
                            {
                                if (!jValue.Equals("Null") && jValue != null)
                                {
                                    asr.GetType().GetProperty(jToken).SetValue(asr, Double.Parse(jValue), null);
                                }
                                else
                                {
                                    asr.GetType().GetProperty(jToken).SetValue(asr, 0.0, null);
                                }
                            }
                            else if (t == typeof(Int32))
                            {
                                if (!jValue.Equals("Null") && jValue != null)
                                {
                                    asr.GetType().GetProperty(jToken).SetValue(asr, Int32.Parse(jValue), null);
                                }
                                else
                                {
                                    asr.GetType().GetProperty(jToken).SetValue(asr, -1, null);
                                }
                            }
                            else if (t == typeof(DateTime))
                            {
                                //TODO: convert from milliseconds
                                if (!jValue.Equals("Null") && jValue != null)
                                {
                                    asr.GetType().GetProperty(jToken).SetValue(asr, new DateTime(long.Parse(jValue)), null);
                                }
                                else
                                {
                                    asr.GetType().GetProperty(jToken).SetValue(asr, DateTime.Now, null);
                                }
                            }
                        }
                        else
                        {
                            jToken = "";
                        }


                        jValue = "";
                        jToken = "";
                    }
                    else if (isGeo == true && jsonReader.TokenType == JsonToken.Float)
                    {
                        floatCount++;

                        jValue = jsonReader.Value.ToString();

                        if (floatCount == 1)
                        {
                            gValue += "[" + jValue + ", ";
                            if (xmin == 0.0)
                            {
                                xmin = Convert.ToDouble(jValue);
                                xmax = Convert.ToDouble(jValue);
                            }
                            else if (Convert.ToDouble(jValue) < xmin && xmin != 0.0)
                            {
                                xmin = Convert.ToDouble(jValue);
                            }
                            else if (Convert.ToDouble(jValue) > xmax && xmax != 0.0)
                            {
                                xmax = Convert.ToDouble(jValue);
                            }

                        }
                        else if (floatCount == 2)
                        {
                            gValue += jValue + "],";
                            floatCount = 0;

                            if (ymin == 0.0)
                            {
                                ymin = Convert.ToDouble(jValue);
                                ymax = Convert.ToDouble(jValue);
                            }
                            else if (Convert.ToDouble(jValue) < ymin && ymin != 0.0)
                            {
                                ymin = Convert.ToDouble(jValue);
                            }
                            else if (Convert.ToDouble(jValue) > ymax && ymax != 0.0)
                            {
                                ymax = Convert.ToDouble(jValue);
                            }
                        }

                    }
                    else if (isGeo == true && jsonReader.TokenType == JsonToken.StartArray)
                    {
                        if (arrayCount > 0)
                            arrayCount--;

                    }
                    else if (isGeo == true && jsonReader.TokenType == JsonToken.EndArray)
                    {
                        arrayCount++;

                        if (arrayCount == 3)
                        {
                            //Remove last comma
                            gValue = gValue.Substring(0, gValue.Length - 1);
                            gValue += "]]}";
                            asr.geometry = gValue;
                            gValue = "";
                        }
                    }
                    else if (isAttributes == true && jsonReader.TokenType == JsonToken.StartObject)
                    {
                        isStartObj = true;
                    }
                    else if (isAttributes == true && jsonReader.TokenType == JsonToken.EndObject)
                    {
                        isStartObj = false;
                        isAttributes = false;
                    }

                    /*if (jsonReader.Value != null)
                        jValue += ("Token: " + jsonReader.TokenType +", Value: " + jsonReader.Value) + "\n";
                    else
                        jValue += "Token: " + jsonReader.TokenType + "\n";
                    */
                }

                asr.extent = xmin.ToString() + "," + ymin.ToString() + "," + xmax.ToString() + "," + ymax.ToString();

                asr.TestingUnitList = getTestingUnits(siteid);

                asr.ExcavationList = new List<ExcavationUnit>();

                asr.DataRecoveredList = new List<DataRecovered>();

                return asr;
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(e.Message);
            asr.SITENAME = e.Message;
            asr.SITEID = DateTime.Now.Month.ToString() + DateTime.Now.Day.ToString() + DateTime.Now.Hour.ToString() + DateTime.Now.Minute.ToString() + DateTime.Now.Second.ToString();
            return asr;
        }
    }

    public List<TestingUnit> getTestingUnits(String siteid)
    {
        List<TestingUnit> tuList = new List<TestingUnit>();
        String requestUrl = "";

        try
        {
            requestUrl = ConfigurationManager.AppSettings["agol_testing_table"] + "/query?where=SITEID+%3D+%27" + siteid + "%27&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&outFields=%27*%27&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&f=pjson&token=" + pToken;

            HttpWebRequest request = WebRequest.Create(requestUrl) as HttpWebRequest;
            using (HttpWebResponse response = request.GetResponse() as HttpWebResponse)
            {
                if (response.StatusCode != HttpStatusCode.OK)
                    throw new Exception(String.Format(
                    "Server error (HTTP {0}: {1}).",
                    response.StatusCode,
                    response.StatusDescription));

                StreamReader reader = new StreamReader(response.GetResponseStream());

                Boolean isFeatures = false;
                Boolean isAttributes = false;
                Boolean isStartObj = false;

                String jToken = "";
                String jValue = "";
                TestingUnit tu = null;


                JsonTextReader jsonReader = new JsonTextReader(reader);
                while (jsonReader.Read())
                {
                    if (jsonReader.TokenType == JsonToken.PropertyName)
                    {
                        jToken = jsonReader.Value.ToString();

                        if (jToken.Equals("attributes") && isAttributes == false && isFeatures == true)
                        {
                            isAttributes = true;
                            tu = new TestingUnit();
                        }
                        else if (jToken.Equals("features"))
                        {
                            isFeatures = true;
                        }
                        else if (isAttributes == true & isStartObj == true)
                        {
                            jToken = jsonReader.Value.ToString();
                        }
                    }
                    else if (jsonReader.TokenType == JsonToken.String && !jToken.Equals("") && isAttributes == true && isStartObj == true)
                    {

                        jValue = jsonReader.Value.ToString();

                        if (!jValue.Equals("Null"))
                        {

                            if (tu.GetType().GetProperty(jToken) != null)
                            {

                                System.Reflection.PropertyInfo p = typeof(TestingUnit).GetProperty(jToken);
                                Type t = p.PropertyType;

                                if (t == typeof(String))
                                    tu.GetType().GetProperty(jToken).SetValue(tu, jValue, null);
                                else if (t == typeof(Double))
                                    tu.GetType().GetProperty(jToken).SetValue(tu, Double.Parse(jValue), null);
                                else if (t == typeof(Int32))
                                    tu.GetType().GetProperty(jToken).SetValue(tu, Int32.Parse(jValue), null);
                                else if (t == typeof(DateTime))
                                    //TODO: convert from milliseconds
                                    tu.GetType().GetProperty(jToken).SetValue(tu, new DateTime(long.Parse(jValue)), null);
                            }
                            else
                            {
                                jToken = "";
                            }
                        }

                        jValue = "";
                        jToken = "";
                    }
                    else if (isAttributes == true && jsonReader.TokenType == JsonToken.StartObject)
                    {
                        isStartObj = true;
                    }
                    else if (isAttributes == true && jsonReader.TokenType == JsonToken.EndObject)
                    {
                        tuList.Add(tu);
                        isStartObj = false;
                        isAttributes = false;
                    }

                    /*if (jsonReader.Value != null)
                        jValue += ("Token: " + jsonReader.TokenType +", Value: " + jsonReader.Value) + "\n";
                    else
                        jValue += "Token: " + jsonReader.TokenType + "\n";
                    */
                }

                return tuList;
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(e.Message);
            return null;
        }

        return null;
    }

    public List<ExcavationUnit> getExcavationUnits(String siteid)
    {
        List<ExcavationUnit> euList = new List<ExcavationUnit>();
        String requestUrl = "";

        try
        {
            requestUrl = ConfigurationManager.AppSettings["agol_testing_table"] + "/query?where=SITEID+%3D+%27" + siteid + "%27&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&outFields=%27*%27&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&f=pjson&token=" + pToken;

            HttpWebRequest request = WebRequest.Create(requestUrl) as HttpWebRequest;
            using (HttpWebResponse response = request.GetResponse() as HttpWebResponse)
            {
                if (response.StatusCode != HttpStatusCode.OK)
                    throw new Exception(String.Format(
                    "Server error (HTTP {0}: {1}).",
                    response.StatusCode,
                    response.StatusDescription));

                StreamReader reader = new StreamReader(response.GetResponseStream());

                Boolean isFeatures = false;
                Boolean isAttributes = false;
                Boolean isStartObj = false;

                String jToken = "";
                String jValue = "";
                ExcavationUnit eu = null;


                JsonTextReader jsonReader = new JsonTextReader(reader);
                while (jsonReader.Read())
                {
                    if (jsonReader.TokenType == JsonToken.PropertyName)
                    {
                        jToken = jsonReader.Value.ToString();

                        if (jToken.Equals("attributes") && isAttributes == false && isFeatures == true)
                        {
                            isAttributes = true;
                            eu = new ExcavationUnit();
                        }
                        else if (jToken.Equals("features"))
                        {
                            isFeatures = true;
                        }
                        else if (isAttributes == true & isStartObj == true)
                        {
                            jToken = jsonReader.Value.ToString();
                        }
                    }
                    else if (jsonReader.TokenType == JsonToken.String && !jToken.Equals("") && isAttributes == true && isStartObj == true)
                    {

                        jValue = jsonReader.Value.ToString();

                        if (!jValue.Equals("Null"))
                        {

                            if (eu.GetType().GetProperty(jToken) != null)
                            {

                                System.Reflection.PropertyInfo p = typeof(TestingUnit).GetProperty(jToken);
                                Type t = p.PropertyType;

                                if (t == typeof(String))
                                    eu.GetType().GetProperty(jToken).SetValue(eu, jValue, null);
                                else if (t == typeof(Double))
                                    eu.GetType().GetProperty(jToken).SetValue(eu, Double.Parse(jValue), null);
                                else if (t == typeof(Int32))
                                    eu.GetType().GetProperty(jToken).SetValue(eu, Int32.Parse(jValue), null);
                                else if (t == typeof(DateTime))
                                    //TODO: convert from milliseconds
                                    eu.GetType().GetProperty(jToken).SetValue(eu, new DateTime(long.Parse(jValue)), null);
                            }
                            else
                            {
                                jToken = "";
                            }
                        }

                        jValue = "";
                        jToken = "";
                    }
                    else if (isAttributes == true && jsonReader.TokenType == JsonToken.StartObject)
                    {
                        isStartObj = true;
                    }
                    else if (isAttributes == true && jsonReader.TokenType == JsonToken.EndObject)
                    {
                        euList.Add(eu);
                        isStartObj = false;
                        isAttributes = false;
                    }

                    /*if (jsonReader.Value != null)
                        jValue += ("Token: " + jsonReader.TokenType +", Value: " + jsonReader.Value) + "\n";
                    else
                        jValue += "Token: " + jsonReader.TokenType + "\n";
                    */
                }

                return euList;
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(e.Message);
            return null;
        }

        return null;
    }

    public DataSet getSiteBySiteID(int id)
    {
        return null;
    }

    public AgolToken MakeRequest(string requestUrl)
    {
        try
        {
            HttpWebRequest request = WebRequest.Create(requestUrl) as HttpWebRequest;
            using (HttpWebResponse response = request.GetResponse() as HttpWebResponse)
            {
                if (response.StatusCode != HttpStatusCode.OK)
                    throw new Exception(String.Format(
                    "Server error (HTTP {0}: {1}).",
                    response.StatusCode,
                    response.StatusDescription));

                DataContractJsonSerializer jsonSerializer = new DataContractJsonSerializer(typeof(AgolToken));
                AgolToken jsonResponse = jsonSerializer.ReadObject(response.GetResponseStream()) as AgolToken;
                return jsonResponse;
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(e.Message);
            return null;
        }
    }

}