<%@ Page Title="SC ArchSite: Log In" Language="C#" MasterPageFile="~/Site.master" AutoEventWireup="true"
    CodeFile="Login.aspx.cs" Inherits="Account_Login" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" Runat="Server">
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="nav" Runat="Server">
    <nav class="nav-wrap">
	<a class="nav-toggle" href="#nav-menu">Menu &#9660;</a>
	    <div class="nav-collapse" id="nav-menu">
		    <ul class="nav">
                <li><a href="<%= ResolveUrl("~/PublicView.aspx") %>" ><span> &#8212 </span>Public View Map</a></li>
                <li><a href="<%= ResolveUrl("~/subscribermapredirect.aspx") %>" >Subscriber Map</a></li>
                <li class="dropdown"><a href="#">Subscription Info</a>
                    <div class="dropdown-menu">
                        <ul>
                            <li><a href="<%= ResolveUrl("~/overview.aspx") %>" >Subscription Overview</a></li>
                            <li><a href="http://archsite.cas.sc.edu/sciaainfo/ArchSite%20Subscription%20Request%20Form%20&%20License%20Agreement2.pdf" target="_blank"><span> &#8212 </span>License Agreement</a></li>
                            <li><a href="<%= ResolveUrl("~/Account/register.aspx") %>" ><span> &#8212 </span>Create Account</a></li>
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
        <h2 class="pageTitle"> Log In</h2>
    </div>
    <div class="grid-3">
    <p>
    <asp:Login ID="LoginUser" runat="server" EnableViewState="false" 
        RenderOuterTable="false" onloggedin="LoginUser_LoggedIn"  >
        <LayoutTemplate>
            <span class="failureNotification">
                <asp:Literal ID="FailureText" runat="server"></asp:Literal>
            </span>
            <asp:ValidationSummary ID="LoginUserValidationSummary" runat="server" CssClass="failureNotification" 
                 ValidationGroup="LoginUserValidationGroup"/>
            <div class="accountInfo">
                <fieldset class="login">
                    <legend>Account Information</legend>
                    <hr />
                    <p>
                        <asp:Label ID="UserNameLabel" runat="server" AssociatedControlID="UserName" CssClass="formTitle">Username:</asp:Label>
                        <asp:TextBox ID="UserName" runat="server" CssClass="textEntry" TabIndex="1" ></asp:TextBox>
                        <asp:RequiredFieldValidator ID="UserNameRequired" runat="server" ControlToValidate="UserName" 
                             CssClass="failureNotification" ErrorMessage="User Name is required." ToolTip="User Name is required." 
                             ValidationGroup="LoginUserValidationGroup">*</asp:RequiredFieldValidator>
                        <p> </p>
                        <asp:Label ID="PasswordLabel" runat="server" AssociatedControlID="Password" CssClass="formTitle">Password: </asp:Label>
                        <asp:TextBox ID="Password" runat="server" CssClass="passwordEntry" TextMode="Password"></asp:TextBox>
                        <asp:RequiredFieldValidator ID="PasswordRequired" runat="server" ControlToValidate="Password" 
                             CssClass="failureNotification" ErrorMessage="Password is required." ToolTip="Password is required." 
                             ValidationGroup="LoginUserValidationGroup">*</asp:RequiredFieldValidator>
                        <br />
                        <asp:CheckBox ID="RememberMe" runat="server"/>
                        <asp:Label ID="RememberMeLabel" runat="server" AssociatedControlID="RememberMe" CssClass="inline">Keep me logged in</asp:Label>

                        <p>
                        </p>
                    </p>
                </fieldset>
                <p class="submitButton">
                    <asp:Button ID="LoginButton" runat="server" CommandName="Login" Text="Log In" ValidationGroup="LoginUserValidationGroup"/>
                </p>

                <p class="text-small no-space-bottom">
                    <asp:HyperLink ID="forgotPasswordLink" NavigateUrl="~/ForgotPassword.aspx" runat="server" Text="I forgot my password" />
               </p>
            </div>
        </LayoutTemplate>
    </asp:Login>
    
   </p>
        <p class="text-small no-spacetop"><a href="<%= ResolveUrl("~/Account/register.aspx") %>" >I need to create an account</a></p>

  </div><!-- close 3 -->


</asp:Content>