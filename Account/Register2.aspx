<%@ Page Title="SC ArchSite: Create a New Account" Language="C#" MasterPageFile="~/Site.master" AutoEventWireup="true" CodeFile="Register2.aspx.cs" Inherits="Account_Register2" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" Runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="nav" Runat="Server">
    <nav class="nav-wrap">
	<a class="nav-toggle" href="#nav-menu">Menu &#9660;</a>
	    <div class="nav-collapse" id="nav-menu">
		    <ul class="nav">
                <li><a href="<%= ResolveUrl("~/PublicView.aspx") %>" ><span> &#8212 </span>Public View Map</a></li>
                <li class="dropdown"><a href="#">Subscription Info</a>
                    <div class="dropdown-menu">
                        <ul>
                            <li><a href="<%= ResolveUrl("~/overview.aspx") %>" >Subscription Overview</a></li>
                            <li><a href="http://archsite.cas.sc.edu/sciaainfo/ArchSite%20Subscription%20Request%20Form%20&%20License%20Agreement2.pdf" target="_blank"><span> &#8212 </span>License Agreement</a></li>
                            <li><a href="<%= ResolveUrl("~/Account/register.aspx") %>" id="current"><span> &#8212 </span>Create Account</a></li>
                            <li><a href="<%= ResolveUrl("~/Account/changePassword.aspx") %>" ><span> &#8212 </span>Change Password</a></li>
                            <li><a href="<%= ResolveUrl("~/ForgotPassword.aspx") %>" ><span> &#8212 </span>Forgot Password</a></li>
                            <li><a href="<%= ResolveUrl("~/userDoc.aspx") %>" ><span> &#8212 </span>User Documentation</a></li>
                        </ul>
                    </div><!-- close dropdown-menu -->
                </li>
                <li><a href="<%= ResolveUrl("~/disclaimers.aspx") %>" >Disclaimers</a></li>
                <li><a href="<%= ResolveUrl("~/about.aspx") %>" >About</a></li>
            </ul>
        </div><!-- close nav-collapse -->
    </nav>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="mainContent" Runat="Server">

    <div class="grid-6">
        <h2 class="pageTitle">
            Create a New Account
        </h2>
    </div><!-- close 6 -->
    <div class="grid-3">
        <p>
            NOTE:  When you click the Submit button on this form to create a new account you will automatically be directed to the Public View Map regardless of the access level you request. If you are requesting a Subscriber account, you must complete the necessary paperwork as outlined on the <a href="<%= ResolveUrl("~/overview.aspx") %>" >Subscription Overview</a> page before your account will be given access to the Subscriber Map. You will not be contacted by the ArchSite Administrator after you create an account unless the required paperwork has been submitted.
        </p>
    </div>
    <div class="grid-3">
        <p>
            The Subscriber Map has additional data layers, more tools for working with the data and an option to export shapefiles. Please refer to the <a href="<%= ResolveUrl("~/overview.aspx") %>" >Subscription Overview</a> page for an explanation of the differences between the Public and Subscriber Maps.
        </p>
    </div>
    <div class="grid-4 offset-1">
        <fieldset class="register">
            <legend></legend>
            <label for="firstName"><span  class="title">First Name: </span><br />
                <input type="text" name="firstName" id="firsName" autocomplete="off" />
            </label>
            <label for="lastName"><span class="title">Last Name: </span><br />
                <input type="text" name="lastName" id="lastName" autocomplete="off" />
            </label>
            <label for="phone"><span class="title">Phone Number: </span><br />
                <input type="text" name="phone" id="phone" autocomplete="off" placeholder="555-555-5555" />
            </label>
            <label for="email"><span class="title">Email: </span><br />
                <input type="email" name="email" id="email" autocomplete="off" />
            </label>
            <label for="organization"><span class="title">Organization: </span><br />
                <input type="text" name="organization" id="organization" autocomplete="off" />
            </label>
            <label for="usrName"><span class="title">Create a User Name: </span><br />
                <input type="text" name="userName" id="userName" autocomplete="off" />
            </label>
            <label for="pass"><span class="title">Password: </span><br /><span class="smallprint">(Passwords are required to be a minimum of <%= Membership.MinRequiredPasswordLength %> characters in length.)</span><br />
                <input type="password" name="pass" id="pass" autocomplete="off" />
            </label>
            <label for="confirmpass"><span class="title">Confirm Password: </span><br />
                <input type="password" name="confirmpass" id="confirmpass" autocomplete="off" placeholder="Re-enter your password" />
            </label>
            <label for="securityQuestion"><span class="title">Select a Security Question: </span><br />
                <select name="securityQuestion" id="securityQuestion">
                    <option> </option>
                    <option>Name of your first pet?</option>
                    <option>City where you were born?</option>
                    <option>Your high school mascot?</option>
                </select>
            </label>
            <label for="securityAnswer"><span class="title">Answer: </span><br />
                <input type="text" name="securityAnswer" id="officialCapacity" />
            </label>
            <input type="submit" value="Submit" />

           </fieldset><br />

    </div><!-- close 4 -->

</asp:Content>

