using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class SiteMaster : System.Web.UI.MasterPage
{

    protected void Page_Load(object sender, EventArgs e)
    {
        if (Membership.GetUser() != null)
        {
            string[] roles = Roles.GetRolesForUser(Membership.GetUser().UserName);

            if (roles.Length == 0)
            {
                HyperLink hl = (HyperLink)HeadLoginView.FindControl("MapLink");
                hl.Visible = false;
            }

        }
    }
   
}
