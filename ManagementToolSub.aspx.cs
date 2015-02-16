using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

using System.Web.Security;
using Shufan.DB.StoreProcedureAccess;
using System.Data;

public partial class ManagementToolSub : System.Web.UI.Page
{
    string strSQLConn = System.Configuration.ConfigurationManager.AppSettings["SQLConString"].Trim();

    protected void Page_Load(object sender, EventArgs e)
    {
        //if (Page.User.Identity.Name.ToString().Equals("liu"))//for specified user
        //{
            if (!IsPostBack)
            {
                //load user names
                fnLoadUserNames();
            }
        //    else
        //    {
        //        Response.Redirect("~/Default.aspx");
        //    }
        //}
        //else
        //{
        //    Response.Redirect("~/Default.aspx");
        //}
    }

    private void fnLoadUserNames()
    {
        clsStoreProcedureAccess clsUserNames = new clsStoreProcedureAccess("GetUserNames", strSQLConn);
        DataTable dtAllUserNames = clsUserNames.fnExecuteSP2DataTable();

        ddlUserName.Items.Clear();
        for (int i = 0; i < dtAllUserNames.Rows.Count; i++)
        {
            ListItem li = new ListItem();
            li.Value = dtAllUserNames.Rows[i][0].ToString();
            li.Text = dtAllUserNames.Rows[i][0].ToString();
            ddlUserName.Items.Add(li);
        }
    }

    protected void btnGetUser_Click(object sender, EventArgs e)
    {
        try
        {
            string[] strParas = new string[1];
            strParas[0] = ddlUserName.SelectedItem.Value;
            clsStoreProcedureAccess clsSearchByUserName = new clsStoreProcedureAccess("GetUserByUserName", strSQLConn);
            DataTable dtSearch = clsSearchByUserName.fnExecuteSP2DataTable(strParas);

            if (dtSearch.Rows.Count < 1)
            {
                lblMsg.Text = "No record found!";
            }
            if (dtSearch.Rows.Count == 1)
            {
                txtUserName.Text = dtSearch.Rows[0][0].ToString();
                ddlApprovalStatus.SelectedValue = dtSearch.Rows[0][7].ToString();
                ddlExportData.SelectedValue = dtSearch.Rows[0][8].ToString();
                txtSignUpDate.Text = dtSearch.Rows[0][9].ToString();
            }

            lblMsg.Text = "";
        }
        catch (Exception ex)
        {
            lblMsg.Text = "" + ex.Message;
        }
    }
    protected void btnReset_Click(object sender, EventArgs e)
    {
        txtUserName.Text = "";
        ddlApprovalStatus.SelectedIndex = 0;
        ddlExportData.SelectedIndex = 0;
        txtSignUpDate.Text = "";
        ddlUserName.SelectedIndex = 0;

        lblMsg.Text = "";

        fnLoadUserNames();
    }
    protected void btnSave_Click(object sender, EventArgs e)
    {
        try
        {
            //update other info
            string[] strParas = new string[3];
            strParas[0] = txtUserName.Text.Trim();
            strParas[1] = ddlApprovalStatus.SelectedItem.Value;
            strParas[2] = ddlExportData.SelectedItem.Value;

            clsStoreProcedureAccess clsUpdate = new clsStoreProcedureAccess("UpdateUserAccountInfoSpec", strSQLConn);
            clsUpdate.fnExecuteSP(strParas);

            lblMsg.Text = "Successfully Done!";
        }
        catch (Exception ex)
        {
            lblMsg.Text = ex.Message;
        }
    }
}