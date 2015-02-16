using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for DataRecovered
/// </summary>
public class DataRecovered
{
	public DataRecovered()
	{
		//
		// TODO: Add constructor logic here
		//
	}

    public Double OBJECTID { get; set; }
    public String SITEID { get; set; }
    public Double NUMBEROFARTIFACTS { get; set; }
    public String MaterialsRecovered { get; set; }
    public String RECORD_OWNER { get; set; }
    public DateTime EDITED_DATE { get; set; }
}