using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;

/// <summary>
/// Summary description for EmailService
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
// To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
// [System.Web.Script.Services.ScriptService]
public class EmailService : System.Web.Services.WebService {


    public EmailService () {

        //Uncomment the following line if using designed components 
        //InitializeComponent(); 
    }

    [WebMethod(Description = "Sends an email to reciepient. Requires 3 arguments, TO_email_address, New_Password, and Service_Password to excute web service. Return message values are Message_Sent, Message_Failed, Incorrect_Password.  " +
     "  The From email will be scarchsite.com")]

    public string SendPwd_toUserEmail(string TO_email_address, string email_msg, string Service_Password)
    {

// ****** You will need to include a key in the web.config file in the appSettings.  Something like the following:
//   <add key="Email_pwd" value="Mypassword"/>

        string internalpwd = System.Configuration.ConfigurationManager.AppSettings["email_server_pwd"].ToString();
        if (Service_Password == internalpwd)
        {
            string returnmsg = "Message ";
            try
            {
                System.Net.Mail.MailMessage message = new System.Net.Mail.MailMessage();
                message.To.Add(TO_email_address);

// *********** Change this line to refer to SCArchsite
                message.Subject = "Archsite Email"; // Subject of email;

// *********** Change this line to refer to SCArchsite.com 
                message.From = new System.Net.Mail.MailAddress("no-reply@scarchsite.com");  // The email on the from field; need not match correct email

// *********** Change the following to the Email content referring to SCarchsite
                message.Body = email_msg; // body;

// ************** You will need to change this to the email handler on godaddy... .should be "mail.scarchsite.com"
                System.Net.Mail.SmtpClient smtp = new System.Net.Mail.SmtpClient("mail.scarchsite.com"); // email host on server

// ************** The line below is for the godaddy login information.  Not sure if Godaddy requires a login and password check for the NetworCredential
                // Must add credentials below as Parcom servers began checking on Jan 27, 2011 
                smtp.Credentials = new System.Net.NetworkCredential("service@scarchsite.com", "G4ha0.Lqb$"); // user mailid and password

                smtp.Send(message);
                return "Message_Sent";
            }
            catch (Exception ex)
            {
                return returnmsg + "Mesage_Failed: " + ex.Message;
            }
        }  // correct password
        else
        {
            return " Incorrect_Password";
        }

    }  // SendPwd_toUserEmail
    
}
