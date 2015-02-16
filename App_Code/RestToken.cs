using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for AgolResponse
/// </summary>
[Serializable]
public class RestToken
{
    public RestToken()
    {
        //
        // TODO: Add constructor logic here
        //
    }
    
    public string token = "";
    public string expires = "";
    public string ssl = "";
}