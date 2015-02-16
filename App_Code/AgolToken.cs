using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for AgolResponse
/// </summary>
[Serializable]
public class AgolToken
{
    public AgolToken()
    {
        //
        // TODO: Add constructor logic here
        //
    }
    
    public string access_token = "";
    public Int32 expires_in = -1;
}