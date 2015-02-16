using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

using Shufan.DB.StoreProcedureAccess;
using System.Data;
using System.Web.Security;

public partial class ManagementTool : System.Web.UI.Page
{
    string strSQLConn = System.Configuration.ConfigurationManager.AppSettings["SQLConString"].Trim();

    protected void Page_Load(object sender, EventArgs e)
    {
        if (Page.User.Identity.Name.ToString().Length > 0)
        {
            if (Roles.GetRolesForUser(Page.User.Identity.Name.ToString())[0].Equals("admin"))//if log in as a common user
            {
                if (!IsPostBack)
                {
                    //load user names
                    fnLoadUserNames();
                }
            }
            else
            {
                Response.Redirect("~/ManagementRedirect.aspx");
            }
        }
        else
        {
            Response.Redirect("~/Account/Login.aspx");
        }
    }

    //===========================================================================================================================Search==============

    protected void lbListFirstName_Click(object sender, EventArgs e)
    {
        txtFirstName.Text = "";
        txtFirstName.Visible = false;
        ddlFirstName.Visible = true;
    }
    protected void lbLastName_Click(object sender, EventArgs e)
    {
        txtLastName.Text = "";
        txtLastName.Visible = false;
        ddlLastName.Visible = true;
    }
    protected void lbOrganization_Click(object sender, EventArgs e)
    {
        txtOrganization.Text = "";
        txtOrganization.Visible = false;
        ddlOrganization.Visible = true;
    }
    protected void lbUserName_Click(object sender, EventArgs e)
    {
        txtUserName.Text = "";
        txtUserName.Visible = false;
        ddlUserName.Visible = true;
    }
    protected void lbReset_Click(object sender, EventArgs e)
    {
        ddlFirstName.Visible = false;
        txtFirstName.Visible = true;

        ddlLastName.Visible = false;
        txtLastName.Visible = true;

        ddlOrganization.Visible = false;
        txtOrganization.Visible = true;

        ddlUserName.Visible = false;
        txtUserName.Visible = true;

        gvSearchResult.DataSource = null;
        gvSearchResult.DataBind();

        lblMsg.Text = "";

        rblSearchBy.SelectedIndex = 0;
        rblApprovalStatus.SelectedIndex = 0;
    }

    protected void btnSearch_Click(object sender, EventArgs e)
    {
        if (rblSearchBy.SelectedIndex == 0)//search all
        {
            clsStoreProcedureAccess clsSearchAll = new clsStoreProcedureAccess("GetAllUser", strSQLConn);
            DataTable dtAllUser = clsSearchAll.fnExecuteSP2DataTable();
            gvSearchResult.DataSource = dtAllUser;
            gvSearchResult.DataBind();
            lblMsg.Text = dtAllUser.Rows.Count + " records found!";
        }
        else//search by criteria
        {
            string[] strParas = new string[6];
            strParas[0] = txtFirstName.Visible ? txtFirstName.Text.Trim() : ddlFirstName.SelectedItem.Value;//first
            //if (strParas[0].Length < 1) strParas[0] = " ";
            strParas[1] = txtLastName.Visible ? txtLastName.Text.Trim() : ddlLastName.SelectedItem.Value;//lastname
            //if (strParas[1].Length < 1) strParas[1] = " ";
            strParas[2] = txtUserName.Visible ? txtUserName.Text.Trim() : ddlUserName.SelectedItem.Value;//username
            //if (strParas[2].Length < 1) strParas[2] = " ";
            strParas[3] = txtOrganization.Visible ? txtOrganization.Text.Trim() : ddlOrganization.SelectedItem.Value;//organization
            //if (strParas[3].Length < 1) strParas[3] = " ";
            strParas[4] = ddlAccessLevel2.SelectedIndex > 0 ? ddlAccessLevel2.SelectedItem.Value : "";//accesslevel
            //if (strParas[4].Length < 1) strParas[4] = " ";

            if (rblApprovalStatus.SelectedIndex == 0)
                strParas[5] = "";
            else if (rblApprovalStatus.SelectedIndex == 1)
                strParas[5] = "Yes";
            else
                strParas[5] = "No";//approvalstatus;
            clsStoreProcedureAccess clsSearchByCriteria = new clsStoreProcedureAccess("GetUserByCriteria", strSQLConn);
            DataTable dtSearch = clsSearchByCriteria.fnExecuteSP2DataTable(strParas);

            gvSearchResult.DataSource = dtSearch;
            gvSearchResult.DataBind();
            lblMsg.Text = dtSearch.Rows.Count + " records found!";
        }
    }

    //===========================================================================================================================Manage==============
    private void fnLoadUserNames()
    {
        clsStoreProcedureAccess clsUserNames = new clsStoreProcedureAccess("GetUserNames", strSQLConn);
        DataTable dtAllUserNames = clsUserNames.fnExecuteSP2DataTable();

        ddlUserName0.Items.Clear();
        for (int i = 0; i < dtAllUserNames.Rows.Count; i++)
        {
            ListItem li = new ListItem();
            li.Value = dtAllUserNames.Rows[i][0].ToString();
            li.Text = dtAllUserNames.Rows[i][0].ToString();
            ddlUserName0.Items.Add(li);
        }
    }

    protected void btnGetUser0_Click(object sender, EventArgs e)
    {
        try
        {
            string[] strParas = new string[1];
            strParas[0] = ddlUserName0.SelectedItem.Value;
            clsStoreProcedureAccess clsSearchByUserName = new clsStoreProcedureAccess("GetUserByUserName", strSQLConn);
            DataTable dtSearch = clsSearchByUserName.fnExecuteSP2DataTable(strParas);

            if (dtSearch.Rows.Count < 1)
            {
                lblMsg.Text = "No record found!";
            }
            if (dtSearch.Rows.Count == 1)
            {
                txtUserName0.Text = dtSearch.Rows[0][0].ToString();
                txtFirstName0.Text = dtSearch.Rows[0][1].ToString();
                txtLastName0.Text = dtSearch.Rows[0][2].ToString();
                txtOrganization0.Text = dtSearch.Rows[0][3].ToString();
                txtEmail0.Text = dtSearch.Rows[0][4].ToString();
                txtPhoneNum0.Text = dtSearch.Rows[0][5].ToString();
                ddlAccessLevel0.SelectedValue = dtSearch.Rows[0][6].ToString();
                ddlApprovalStatus0.SelectedValue = dtSearch.Rows[0][7].ToString();
                ddlExportData0.SelectedValue = dtSearch.Rows[0][8].ToString();
                txtSignUpDate0.Text = dtSearch.Rows[0][9].ToString();

            }

            lblMsg.Text = "";
        }
        catch (Exception ex)
        {
            lblMsg.Text = "" + ex.Message;
        }
    }
    protected void btnReset0_Click(object sender, EventArgs e)
    {
        fnReset();
    }

    private void fnReset()
    {
        txtUserName0.Text = "";
        txtFirstName0.Text = "";
        txtLastName0.Text = "";
        txtOrganization0.Text = "";
        txtEmail0.Text = "";
        txtPhoneNum0.Text = "";
        ddlAccessLevel0.SelectedIndex = 0;
        ddlApprovalStatus0.SelectedIndex = 0;
        ddlExportData0.SelectedIndex = 0;
        txtSignUpDate0.Text = "";
        ddlUserName0.SelectedIndex = 0;

        lblMsg.Text = "";

        fnLoadUserNames();
    }

    protected void btnSave0_Click(object sender, EventArgs e)
    {
        try
        {
            //change access level
            string username = ddlUserName0.SelectedItem.Value;
            string strUserRole = Roles.GetRolesForUser(username)[0].ToString();
            Roles.RemoveUserFromRole(username, strUserRole);
            //add a specified role
            Roles.AddUserToRole(username, ddlAccessLevel0.SelectedItem.Value);

            //update other info
            string[] strParas = new string[9];
            strParas[0] = ddlUserName0.SelectedItem.Value;
            strParas[1] = txtFirstName0.Text.Trim();
            strParas[2] = txtLastName0.Text.Trim();
            strParas[3] = txtPhoneNum0.Text.Trim();
            strParas[4] = txtEmail0.Text.Trim();
            strParas[5] = txtOrganization0.Text.Trim();
            strParas[6] = ddlAccessLevel0.SelectedItem.Value;
            strParas[7] = ddlApprovalStatus0.SelectedItem.Value;
            strParas[8] = ddlExportData0.SelectedItem.Value;

            clsStoreProcedureAccess clsUpdate = new clsStoreProcedureAccess("UpdateUserAccountInfo", strSQLConn);
            clsUpdate.fnExecuteSP(strParas);

            lblMsg0.Text = "Done!";
        }
        catch (Exception ex)
        {
            lblMsg0.Text = ex.Message;
        }
    }
    protected void btnDelete0_Click(object sender, EventArgs e)
    {
        try
        {
            if (txtUserName0.Text.Trim().Length < 1)
            {
                lblMsg0.Text = "Please get one user first!";
            }
            else
            {
                //delete from login
                if (Membership.DeleteUser(txtUserName0.Text.Trim()))
                {
                    //delete from table
                    string[] strParas = new string[1];
                    strParas[0] = txtUserName0.Text.Trim();

                    clsStoreProcedureAccess clsDelete = new clsStoreProcedureAccess("DeleteUserAccount", strSQLConn);
                    clsDelete.fnExecuteSP(strParas);

                    lblMsg0.Text = "Delete successfully!";

                    //refresh - to be done
                    //fnLoadUserNames();
                    fnReset();
                }
            }
        }
        catch (Exception ex)
        {
            lblMsg0.Text = ex.Message;
        }
    }

    protected void rblReportBy_SelectedIndexChanged(object sender, EventArgs e)
    {
        //
        switch (rblReportBy.SelectedIndex)
        {
            case 0:
                txtUserName1.Visible = true;
                ddlUserName1.Visible = false;
                txtOrganization1.Visible = false;
                ddlOrganization1.Visible = false;
                lbListUserName1.Visible = true;
                lbListOrganization1.Visible = false;
                ddlAccessLevel2.Visible = false;
                break;
            case 1:
                txtUserName1.Visible = false;
                ddlUserName1.Visible = false;
                txtOrganization1.Visible = true;
                ddlOrganization1.Visible = false;
                lbListUserName1.Visible = false;
                lbListOrganization1.Visible = true;
                ddlAccessLevel2.Visible = false;
                break;
            case 2:
                txtUserName1.Visible = false;
                ddlUserName1.Visible = false;
                txtOrganization1.Visible = false;
                ddlOrganization1.Visible = false;
                lbListUserName1.Visible = false;
                lbListOrganization1.Visible = false;
                ddlAccessLevel2.Visible = true;
                break;
            case 3:
                txtUserName1.Visible = false;
                ddlUserName1.Visible = false;
                txtOrganization1.Visible = false;
                ddlOrganization1.Visible = false;
                lbListUserName1.Visible = false;
                lbListOrganization1.Visible = false;
                ddlAccessLevel2.Visible = false;
                break;
        }
    }
    protected void rblReportWhen_SelectedIndexChanged(object sender, EventArgs e)
    {
        switch (rblReportWhen.SelectedIndex)
        {
            case 0:
                txtSingleDay.Visible = true;
                txtSingleDay.Text = DateTime.Today.ToShortDateString();
                txtDayFrom.Visible = false;
                txtDayTo.Visible = false;
                break;
            case 1:
                txtSingleDay.Visible = false;
                txtDayFrom.Visible = true;
                txtDayFrom.Text = DateTime.Today.ToShortDateString();
                txtDayTo.Visible = true;
                txtDayTo.Text = DateTime.Today.AddDays(1).ToShortDateString();
                break;
            case 2:
                txtSingleDay.Visible = false;
                txtDayFrom.Visible = false;
                txtDayTo.Visible = false;
                break;
        }
    }
    protected void lbListUserName1_Click(object sender, EventArgs e)
    {
        txtUserName1.Text = "";
        txtUserName1.Visible = false;
        ddlUserName1.Visible = true;
    }
    protected void lbListOrganization1_Click(object sender, EventArgs e)
    {
        txtOrganization1.Text = "";
        txtOrganization1.Visible = false;
        ddlOrganization1.Visible = true;
    }
    protected void lbReset1_Click(object sender, EventArgs e)
    {
        rblReportBy.SelectedIndex = 2;
        rblReportWhen.SelectedIndex = 2;

        txtUserName1.Visible = false;
        ddlUserName1.Visible = false;
        txtOrganization1.Visible = false;
        ddlOrganization1.Visible = false;
        lbListUserName1.Visible = false;
        lbListOrganization1.Visible = false;

        txtSingleDay.Visible = false;
        txtDayFrom.Visible = false;
        txtDayTo.Visible = false;

        //gridview
        gvReport.DataSource = null;
        gvReport.DataBind();

        lblMsg1.Text = "";
    }

    protected void btnGenerateReport_Click(object sender, EventArgs e)
    {
        DataTable dtReport = new DataTable();

        if (rblReportBy.SelectedIndex == 0)//report by individual
        {
            //single day
            if (rblReportWhen.SelectedIndex == 0)
            {
                string[] strParas = new string[2];
                strParas[0] = txtUserName1.Visible ? txtUserName1.Text.Trim() : ddlUserName1.SelectedItem.Value;
                strParas[1] = Convert.ToDateTime(txtSingleDay.Text.Trim()).ToString("yyyy-MM-dd");

                clsStoreProcedureAccess clsIndividualSingleDay = new clsStoreProcedureAccess("GetLogInfoByUserNameDay", strSQLConn);
                dtReport = clsIndividualSingleDay.fnExecuteSP2DataTable(strParas);
            }
            //date range
            else if (rblReportWhen.SelectedIndex == 1)
            {
                string[] strParas = new string[3];
                strParas[0] = txtUserName1.Visible ? txtUserName1.Text.Trim() : ddlUserName1.SelectedItem.Value;
                strParas[1] = Convert.ToDateTime(txtDayFrom.Text.Trim()).ToString("yyyy-MM-dd");
                strParas[2] = Convert.ToDateTime(txtDayTo.Text.Trim()).AddDays(1).ToString("yyyy-MM-dd");

                clsStoreProcedureAccess clsIndividualSingleDay = new clsStoreProcedureAccess("GetLogInfoByUserNameRange", strSQLConn);
                dtReport = clsIndividualSingleDay.fnExecuteSP2DataTable(strParas);
            }
            //all
            else
            {
                string[] strParas = new string[1];
                strParas[0] = txtUserName1.Visible ? txtUserName1.Text.Trim() : ddlUserName1.SelectedItem.Value;

                clsStoreProcedureAccess clsIndividualSingleDay = new clsStoreProcedureAccess("GetLogInfoByUserName", strSQLConn);
                dtReport = clsIndividualSingleDay.fnExecuteSP2DataTable(strParas);
            }
        }
        else if (rblReportBy.SelectedIndex == 1)//report by organization
        {
            //single day
            if (rblReportWhen.SelectedIndex == 0)
            {
                string[] strParas = new string[2];
                strParas[0] = txtOrganization1.Visible ? txtOrganization1.Text.Trim() : ddlOrganization1.SelectedItem.Value;
                strParas[1] = Convert.ToDateTime(txtSingleDay.Text.Trim()).ToString("yyyy-MM-dd");

                clsStoreProcedureAccess clsIndividualSingleDay = new clsStoreProcedureAccess("GetLogInfoByOrganizationDay", strSQLConn);
                dtReport = clsIndividualSingleDay.fnExecuteSP2DataTable(strParas);
            }
            //date range
            else if (rblReportWhen.SelectedIndex == 1)
            {
                string[] strParas = new string[3];
                strParas[0] = txtOrganization1.Visible ? txtOrganization1.Text.Trim() : ddlOrganization1.SelectedItem.Value;
                strParas[1] = Convert.ToDateTime(txtDayFrom.Text.Trim()).ToString("yyyy-MM-dd");
                strParas[2] = Convert.ToDateTime(txtDayTo.Text.Trim()).AddDays(1).ToString("yyyy-MM-dd");

                clsStoreProcedureAccess clsIndividualSingleDay = new clsStoreProcedureAccess("GetLogInfoByOrganizationRange", strSQLConn);
                dtReport = clsIndividualSingleDay.fnExecuteSP2DataTable(strParas);
            }
            //all
            else
            {
                string[] strParas = new string[1];
                strParas[0] = txtOrganization1.Visible ? txtOrganization1.Text.Trim() : ddlOrganization1.SelectedItem.Value;

                clsStoreProcedureAccess clsIndividualSingleDay = new clsStoreProcedureAccess("GetLogInfoByOrganization", strSQLConn);
                dtReport = clsIndividualSingleDay.fnExecuteSP2DataTable(strParas);
            }

        }
        else if (rblReportBy.SelectedIndex == 2)//report by access level
        {
            //single day
            if (rblReportWhen.SelectedIndex == 0)
            {
                string[] strParas = new string[2];
                strParas[0] = ddlAccessLevel2.SelectedItem.Value;
                strParas[1] = Convert.ToDateTime(txtSingleDay.Text.Trim()).ToString("yyyy-MM-dd");

                clsStoreProcedureAccess clsIndividualSingleDay = new clsStoreProcedureAccess("GetLogInfoByAccessLevelDay", strSQLConn);
                dtReport = clsIndividualSingleDay.fnExecuteSP2DataTable(strParas);
            }
            //date range
            else if (rblReportWhen.SelectedIndex == 1)
            {
                string[] strParas = new string[3];
                strParas[0] = ddlAccessLevel2.SelectedItem.Value;
                strParas[1] = Convert.ToDateTime(txtDayFrom.Text.Trim()).ToString("yyyy-MM-dd");
                strParas[2] = Convert.ToDateTime(txtDayTo.Text.Trim()).AddDays(1).ToString("yyyy-MM-dd");

                clsStoreProcedureAccess clsIndividualSingleDay = new clsStoreProcedureAccess("GetLogInfoByAccessLevelRange", strSQLConn);
                dtReport = clsIndividualSingleDay.fnExecuteSP2DataTable(strParas);
            }
            //all
            else
            {
                string[] strParas = new string[1];
                strParas[0] = ddlAccessLevel2.SelectedItem.Value;

                clsStoreProcedureAccess clsIndividualSingleDay = new clsStoreProcedureAccess("GetLogInfoByAccessLevel", strSQLConn);
                dtReport = clsIndividualSingleDay.fnExecuteSP2DataTable(strParas);
            }
        }
        else//report all
        {
            //single day
            if (rblReportWhen.SelectedIndex == 0)
            {
                string[] strParas = new string[1];
                strParas[0] = Convert.ToDateTime(txtSingleDay.Text.Trim()).ToString("yyyy-MM-dd");

                clsStoreProcedureAccess clsIndividualSingleDay = new clsStoreProcedureAccess("GetLogInfoAllDay", strSQLConn);
                dtReport = clsIndividualSingleDay.fnExecuteSP2DataTable(strParas);
            }
            //date range
            else if (rblReportWhen.SelectedIndex == 1)
            {
                string[] strParas = new string[2];
                strParas[0] = Convert.ToDateTime(txtDayFrom.Text.Trim()).ToString("yyyy-MM-dd");
                strParas[1] = Convert.ToDateTime(txtDayTo.Text.Trim()).AddDays(1).ToString("yyyy-MM-dd");

                clsStoreProcedureAccess clsIndividualSingleDay = new clsStoreProcedureAccess("GetLogInfoAllRange", strSQLConn);
                dtReport = clsIndividualSingleDay.fnExecuteSP2DataTable(strParas);
            }
            //all
            else
            {
                clsStoreProcedureAccess clsIndividualSingleDay = new clsStoreProcedureAccess("GetLogInfoAll", strSQLConn);
                dtReport = clsIndividualSingleDay.fnExecuteSP2DataTable();
            }

        }
        gvReport.DataSource = dtReport;
        gvReport.DataBind();

        lblMsg1.Text = dtReport.Rows.Count + " records found!";
    }
}