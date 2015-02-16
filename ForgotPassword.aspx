<%@ Page Title="SC ArchSite: Forgot Password?" Language="C#" MasterPageFile="~/Site.master" AutoEventWireup="true" CodeFile="ForgotPassword.aspx.cs" Inherits="Account_ForgotPassword" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" Runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="nav" Runat="Server">
    <nav class="nav-wrap">
	<a class="nav-toggle" href="#nav-menu">Menu &#9660;</a>
	    <div class="nav-collapse" id="nav-menu">
		    <ul class="nav">
                <li><a href="<%= ResolveUrl("~/PublicView.aspx") %>" >Public View Map</a></li>
                <li><a href="<%= ResolveUrl("~/subscribermapredirect.aspx") %>" >Subscriber Map</a></li>
                <li class="dropdown"><a href="#">Subscription Info</a>
                    <div class="dropdown-menu">
                        <ul>
                            <li><a href="<%= ResolveUrl("~/overview.aspx") %>" ><span> &#8212 </span>Subscription Overview</a></li>
                            <li><a href="http://archsite.cas.sc.edu/sciaainfo/ArchSite%20Subscription%20Request%20Form%20&%20License%20Agreement2.pdf" target="_blank"><span> &#8212 </span>License Agreement</a></li>
                            <li><a href="<%= ResolveUrl("~/Account/register.aspx") %>" ><span> &#8212 </span>Create Account</a></li>
                            <li><a href="<%= ResolveUrl("~/Account/changePassword.aspx") %>" ><span> &#8212 </span>Change Password</a></li>
                            <li><a href="<%= ResolveUrl("~/ForgotPassword.aspx") %>" id="current"><span> &#8212 </span>Forgot Password</a></li>
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

<p>
    <asp:PasswordRecovery ID="PasswordRecovery1" runat="server" BackColor="#F7F6F3" 
        BorderColor="#E6E2D8" BorderPadding="4" BorderStyle="Solid" BorderWidth="1px" 
        Font-Names="Arial" Font-Size="0.8em" SuccessText="A temporary password has been sent to you." UserNameInstructionText="Enter your User Name to receive a temporary password.">
        <SubmitButtonStyle BackColor="#FFFBFF" BorderColor="#CCCCCC" BorderStyle="Solid" 
            BorderWidth="1px" Font-Names="Arial" Font-Size="0.8em" ForeColor="#284775" />
        <InstructionTextStyle Font-Italic="True" ForeColor="Black" />
        <SuccessTextStyle Font-Bold="True" ForeColor="#5D7B9D" />
        <TextBoxStyle Font-Size="0.8em" />
        <TitleTextStyle BackColor="#bb292d" Font-Bold="True" Font-Size="0.9em" 
            ForeColor="White" />
    </asp:PasswordRecovery>

</p>
        </div>

</asp:Content>

