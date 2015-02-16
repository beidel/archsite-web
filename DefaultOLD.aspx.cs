using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class _Default : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        lblErrorMessage.Text = "";

        if (Membership.GetUser() != null)
        {
            string[] roles = Roles.GetRolesForUser(Membership.GetUser().UserName);

            if (roles.Length == 0)
            {
                lblErrorMessage.Text = "You do not have access to view the map.";
            }
        }
    }
}