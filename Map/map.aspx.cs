using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Map_map : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!System.Web.HttpContext.Current.User.Identity.IsAuthenticated || Session["agol_token"] == null)
        {
            
            Response.Redirect("../Default.aspx");
            
        }
        else
        {
            if (!System.Web.HttpContext.Current.User.IsInRole("editor") &&
                !System.Web.HttpContext.Current.User.IsInRole("subscriber") &&
                !System.Web.HttpContext.Current.User.IsInRole("admin"))
            {
                Response.Redirect("../Default.aspx");
            }

        }

    }
}