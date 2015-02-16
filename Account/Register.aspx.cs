using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;

using Shufan.DB.StoreProcedureAccess;

public partial class Account_Register : System.Web.UI.Page
{

    protected void Page_Load(object sender, EventArgs e)
    {
        //RegisterUser.ContinueDestinationPageUrl = Request.QueryString["ReturnUrl"];
    }

    protected void RegisterUser_CreatedUser(object sender, EventArgs e)
    {
        string strSQLConn = System.Configuration.ConfigurationManager.AppSettings["SQLConString"].Trim();
        try
        {
            //FormsAuthentication.SetAuthCookie(RegisterUser.UserName, false /* createPersistentCookie */);

            //string continueUrl = RegisterUser.ContinueDestinationPageUrl;
            //if (String.IsNullOrEmpty(continueUrl))
            //{
            //    continueUrl = "~/";
            //}
            //Response.Redirect(continueUrl);

            Roles.AddUserToRole(RegisterUser.UserName, "pending");//role

            TextBox txtFirstName = (TextBox)RegisterUser.CreateUserStep.ContentTemplateContainer.FindControl("FirstName");
            TextBox txtLastName = (TextBox)RegisterUser.CreateUserStep.ContentTemplateContainer.FindControl("LastName");
            TextBox txtPhoneNum = (TextBox)RegisterUser.CreateUserStep.ContentTemplateContainer.FindControl("PhoneNum");
            TextBox txtEmailAddress = (TextBox)RegisterUser.CreateUserStep.ContentTemplateContainer.FindControl("Email");
            TextBox txtOrganization = (TextBox)this.RegisterUser.CreateUserStep.ContentTemplateContainer.FindControl("Organization");
            TextBox txtUserName = (TextBox)RegisterUser.CreateUserStep.ContentTemplateContainer.FindControl("UserName");

            string[] strParas = new string[10];
            for (int i = 0; i < strParas.Length; i++)
            {
                strParas[i] = "";
            }

            strParas[0] = txtUserName.Text.Trim();
            strParas[1] = txtFirstName.Text.Trim();
            strParas[2] = txtLastName.Text.Trim();
            strParas[3] = txtPhoneNum.Text.Trim();
            strParas[4] = txtEmailAddress.Text.Trim();
            strParas[5] = txtOrganization.Text.Trim();
            strParas[6] = "pending";
            strParas[7] = "Yes";
            strParas[8] = "No";
            strParas[9] = DateTime.Today.ToShortDateString();


            clsStoreProcedureAccess clsNewAccount = new clsStoreProcedureAccess("InsertNewAccount", strSQLConn);
            clsNewAccount.fnExecuteSP(strParas);
        }
        catch (Exception ex)//lblSysMsg
        {
            Label lblMsg = (Label)RegisterUser.CreateUserStep.ContentTemplateContainer.FindControl("lblSysMsg");
            lblMsg.Text = "Error: " + ex.Message;
        }
    }

}
