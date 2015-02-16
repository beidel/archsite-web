using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;

using System.Collections.Generic;
using System.Text;
using System.Data.SqlClient;
using System.Collections;

/// <summary>
/// Summary description for clsStoreProcedureAccess
/// </summary>
/// 
namespace Shufan.DB.StoreProcedureAccess
{
    public class clsStoreProcedureAccess
    {
        private string _name;//name of storeprocedure
        private string _conStr;//connection string

        public clsStoreProcedureAccess(string strSPName, string strConStr)
        {
            //
            // TODO: Add constructor logic here
            //
            _name = strSPName;
            _conStr = strConStr;
        }

        //execute store procedure, no return
        public void fnExecuteSP(params object[] paraValues)
        {
            using (SqlConnection con = new SqlConnection(_conStr))
            {
                SqlCommand comm = new SqlCommand(_name, con);
                comm.CommandType = CommandType.StoredProcedure;

                AddInParaValues(comm, paraValues);

                con.Open();
                comm.ExecuteNonQuery();
                con.Close();
            }
        }

        //execute store procedure and return a datatable
        public DataTable fnExecuteSP2DataTable(params object[] paraValues)
        {
            SqlCommand comm = new SqlCommand(_name, new SqlConnection(_conStr));
            comm.CommandType = CommandType.StoredProcedure;
            AddInParaValues(comm, paraValues);

            SqlDataAdapter sda = new SqlDataAdapter(comm);
            DataTable dt = new DataTable();
            sda.Fill(dt);

            return dt;
        }

        //execute store procedure and return a SqlDateReader
        public SqlDataReader fnExecuteSP2DataReader(params object[] paraValues)
        {
            SqlConnection con = new SqlConnection(_conStr);
            SqlCommand comm = new SqlCommand(_name, con);
            comm.CommandType = CommandType.StoredProcedure;
            AddInParaValues(comm, paraValues);
            con.Open();
            return comm.ExecuteReader(CommandBehavior.CloseConnection);
        }

        //get parameters of a store procedure
        private ArrayList GetParas()
        {
            SqlCommand comm = new SqlCommand("dbo.sp_sproc_columns_90",
                       new SqlConnection(_conStr));
            comm.CommandType = CommandType.StoredProcedure;
            comm.Parameters.AddWithValue("@procedure_name", (object)_name);
            SqlDataAdapter sda = new SqlDataAdapter(comm);

            DataTable dt = new DataTable();
            sda.Fill(dt);

            ArrayList al = new ArrayList();
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                al.Add(dt.Rows[i][3].ToString());
            }
            return al;
        }
        
        //add parameters and arrange values to a sqlcommand
        private void AddInParaValues(SqlCommand comm, params object[] paraValues)
        {
            comm.Parameters.Add(new SqlParameter("@RETURN_VALUE", SqlDbType.Int));
            comm.Parameters["@RETURN_VALUE"].Direction =
                           ParameterDirection.ReturnValue;
            if (paraValues != null)
            {
                ArrayList al = GetParas();
                for (int i = 0; i < paraValues.Length; i++)
                {
                    comm.Parameters.AddWithValue(al[i + 1].ToString(),
                         paraValues[i]);
                }
            }
        }
    }
}
