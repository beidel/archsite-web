using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Security;

public partial class subscribermapredirect : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (Page.User.Identity.Name.ToString().Length > 0)
        {
            string roleName = Roles.GetRolesForUser(Page.User.Identity.Name.ToString())[0];

            if (roleName.Equals("editor") || roleName.Equals("subscriber") || roleName.Equals("admin"))//if log in as a common user
            {
                Response.Redirect("Map/map.aspx");
            }
        }
        else
        {
            Response.Redirect("Account/Login.aspx");
        }
    }
}