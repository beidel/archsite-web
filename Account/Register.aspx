<%@ Page Title="ArchSite - Register" Language="C#" MasterPageFile="~/Site.master" AutoEventWireup="true"
    CodeFile="Register.aspx.cs" Inherits="Account_Register" %>

<asp:Content ID="HeaderContent" runat="server" ContentPlaceHolderID="HeadContent">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="nav" runat="Server">
    <nav class="nav-wrap">
        <a class="nav-toggle" href="#nav-menu">Menu &#9660;</a>
        <div class="nav-collapse" id="nav-menu">
            <ul class="nav">
                <li><a href="<%= ResolveUrl("~/PublicView.aspx") %>">Public View Map</a></li>
                <li><a href="<%= ResolveUrl("~/subscribermapredirect.aspx") %>" >Subscriber Map</a></li>
                <li class="dropdown"><a href="#">Subscription Info</a>
                    <div class="dropdown-menu">
                        <ul>
                            <li><a href="<%= ResolveUrl("~/overview.aspx") %>"><span>&#8212 </span>Subscription Overview</a></li>
                            <li><a href="http://archsite.cas.sc.edu/sciaainfo/ArchSite%20Subscription%20Request%20Form%20&%20License%20Agreement2.pdf" target="_blank"><span>&#8212 </span>License Agreement</a></li>
                            <li><a href="<%= ResolveUrl("~/Account/register.aspx") %>" id="current"><span>&#8212 </span>Create Account</a></li>
                            <li><a href="<%= ResolveUrl("~/Account/changePassword.aspx") %>"><span>&#8212 </span>Change Password</a></li>
                            <li><a href="<%= ResolveUrl("~/ForgotPassword.aspx") %>"><span>&#8212 </span>Forgot Password</a></li>
                            <li><a href="<%= ResolveUrl("~/userDoc.aspx") %>"><span>&#8212 </span>User Documentation</a></li>
                        </ul>
                    </div>
                    <!-- close dropdown-menu -->
                </li>
                <li><a href="<%= ResolveUrl("~/disclaimers.aspx") %>">Disclaimers</a></li>
                <li><a href="<%= ResolveUrl("~/about.aspx") %>">About</a></li>
            </ul>
        </div>
        <!-- close nav-collapse -->
    </nav>
</asp:Content>
<asp:Content ID="BodyContent" runat="server" ContentPlaceHolderID="MainContent">
    <asp:CreateUserWizard ID="RegisterUser" runat="server" EnableViewState="false"
        OnCreatedUser="RegisterUser_CreatedUser"
        CancelDestinationPageUrl="~/Account/Login.aspx"
        ContinueDestinationPageUrl="~/Account/Login.aspx" DisplayCancelButton="True"
        LoginCreatedUser="False">
        <LayoutTemplate>
            <asp:PlaceHolder ID="wizardStepPlaceholder" runat="server"></asp:PlaceHolder>
            <asp:PlaceHolder ID="navigationPlaceholder" runat="server"></asp:PlaceHolder>
        </LayoutTemplate>
        <WizardSteps>
            <asp:CreateUserWizardStep ID="RegisterUserWizardStep" runat="server">
                <ContentTemplate>
                    <div class="grid-6">
                        <h2 class="pageTitle">Create a New Account</h2>
                    </div>
                    <div class="grid-3">
                        <p>
                            NOTE:  When you click the Submit button on this form to create a new account, you will not automatically be given access to the Subscriber Map. To obtain a Subscriber account, you must complete the necessary paperwork as outlined on the <a href="<%= ResolveUrl("~/overview.aspx") %>">Subscription Overview</a> page before your account will be given access to the Subscriber Map. You will not be contacted by the ArchSite Administrator after you create an account <em>unless</em> the required paperwork has been submitted. You will have access to the <a href="<%= ResolveUrl("~/subscribermapredirect.aspx") %>" >Public View Map.</a>
                        </p>
                    </div>
                    <div class="grid-3">
                        <p>
                            The Subscriber Map has additional data layers, more tools for working with the data, and an option to export shapefiles. Please refer to the <a href="<%= ResolveUrl("~/overview.aspx") %>">Subscription Overview</a> page for an explanation of the differences between the Public and Subscriber Maps.
                        </p>
                    </div>

                    <div class="grid-4 offset-1">
                        <p>
                            Passwords are required to be a minimum of <%= Membership.MinRequiredPasswordLength %> characters in length.
                        </p>
                        <span class="failureNotification">
                            <asp:Literal ID="ErrorMessage" runat="server"></asp:Literal>
                        </span>
                        <asp:ValidationSummary ID="RegisterUserValidationSummary" runat="server" CssClass="failureNotification"
                            ValidationGroup="RegisterUserValidationGroup" />
                        <div class="accountInfo">
                            <fieldset class="log">
                                <legend>Account Information</legend>

                                <asp:Label ID="FirstNameLabel" runat="server" AssociatedControlID="FirstName">First Name:</asp:Label>
                                <asp:TextBox ID="FirstName" runat="server" CssClass="textEntry" MaxLength="50"></asp:TextBox>
                                <asp:RequiredFieldValidator ID="FirstNameRequired" runat="server" ControlToValidate="FirstName"
                                    CssClass="failureNotification" ErrorMessage="First Name is required." ToolTip="First Name is required."
                                    ValidationGroup="RegisterUserValidationGroup">*</asp:RequiredFieldValidator>

                                
                                    <asp:Label ID="LastNameLabel" runat="server" AssociatedControlID="LastName">Last Name:</asp:Label>
                                    <asp:TextBox ID="LastName" runat="server" CssClass="textEntry" MaxLength="50"></asp:TextBox>
                                    <asp:RequiredFieldValidator ID="LastNameRequired" runat="server" ControlToValidate="LastName"
                                        CssClass="failureNotification" ErrorMessage="Last Name is required." ToolTip="Last Name is required."
                                        ValidationGroup="RegisterUserValidationGroup">*</asp:RequiredFieldValidator>
                                
                                
                                    <asp:Label ID="PhoneNumLabel" runat="server" AssociatedControlID="PhoneNum" ToolTip="Phone Number Format XXX-XXX-XXXX.">Phone Number:</asp:Label>
                                    <asp:TextBox ID="PhoneNum" runat="server" CssClass="textEntry"></asp:TextBox>
                                    <asp:RequiredFieldValidator ID="PhoneNumRequired" runat="server" ControlToValidate="PhoneNum"
                                        CssClass="failureNotification" ErrorMessage="Phone Number is required." ToolTip="Phone Number is required."
                                        ValidationGroup="RegisterUserValidationGroup">*</asp:RequiredFieldValidator>
                                    <asp:RegularExpressionValidator ID="PhoneNumExpression" runat="server" ControlToValidate="PhoneNum"
                                        CssClass="failureNotification" ErrorMessage="Phone Number is invalid." ToolTip="Phone Number Format XXX-XXX-XXXX."
                                        ValidationGroup="RegisterUserValidationGroup" ValidationExpression="(\d{3})-(\d{3})-(\d{4})">*</asp:RegularExpressionValidator>
                                
                                    <asp:Label ID="EmailLabel" runat="server" AssociatedControlID="Email">E-mail:</asp:Label>
                                    <asp:TextBox ID="Email" runat="server" CssClass="textEntry" MaxLength="50"></asp:TextBox>
                                    <asp:RequiredFieldValidator ID="EmailRequired" runat="server" ControlToValidate="Email"
                                        CssClass="failureNotification" ErrorMessage="E-mail is required." ToolTip="E-mail is required."
                                        ValidationGroup="RegisterUserValidationGroup">*</asp:RequiredFieldValidator>
                                
                                    <asp:Label ID="OrganizationLabel" runat="server" AssociatedControlID="Organization">Organization:</asp:Label>
                                    <asp:TextBox ID="Organization" runat="server" CssClass="textEntry" MaxLength="250"></asp:TextBox>
                                    <asp:RequiredFieldValidator ID="OrganizationRequired" runat="server" ControlToValidate="Organization"
                                        CssClass="failureNotification" ErrorMessage="Organization is required." ToolTip="Organization is required."
                                        ValidationGroup="RegisterUserValidationGroup">*</asp:RequiredFieldValidator>
                                
                                    <asp:Label ID="UserNameLabel" runat="server" AssociatedControlID="UserName">User Name:</asp:Label>
                                    <asp:TextBox ID="UserName" runat="server" CssClass="textEntry" MaxLength="50"></asp:TextBox>
                                    <asp:RequiredFieldValidator ID="UserNameRequired" runat="server" ControlToValidate="UserName"
                                        CssClass="failureNotification" ErrorMessage="User Name is required." ToolTip="User Name is required."
                                        ValidationGroup="RegisterUserValidationGroup">*</asp:RequiredFieldValidator>
                                
                                    <asp:Label ID="PasswordLabel" runat="server" AssociatedControlID="Password">Password:</asp:Label>
                                    <asp:TextBox ID="Password" runat="server" CssClass="passwordEntry" TextMode="Password"></asp:TextBox>
                                    <asp:RequiredFieldValidator ID="PasswordRequired" runat="server" ControlToValidate="Password"
                                        CssClass="failureNotification" ErrorMessage="Password is required." ToolTip="Password is required."
                                        ValidationGroup="RegisterUserValidationGroup">*</asp:RequiredFieldValidator>
                                
                                    <asp:Label ID="ConfirmPasswordLabel" runat="server" AssociatedControlID="ConfirmPassword">Confirm Password:</asp:Label>
                                    <asp:TextBox ID="ConfirmPassword" runat="server" CssClass="passwordEntry" TextMode="Password"></asp:TextBox>
                                    <asp:RequiredFieldValidator ControlToValidate="ConfirmPassword" CssClass="failureNotification" Display="Dynamic"
                                        ErrorMessage="Confirm Password is required." ID="ConfirmPasswordRequired" runat="server"
                                        ToolTip="Confirm Password is required." ValidationGroup="RegisterUserValidationGroup">*</asp:RequiredFieldValidator>
                                    <asp:CompareValidator ID="PasswordCompare" runat="server" ControlToCompare="Password" ControlToValidate="ConfirmPassword"
                                        CssClass="failureNotification" Display="Dynamic" ErrorMessage="The Password and Confirmation Password must match."
                                        ValidationGroup="RegisterUserValidationGroup">*</asp:CompareValidator>
                                
                            </fieldset>
                            <p class="submitButton">
                                <asp:Button ID="CreateUserButton" runat="server" CommandName="MoveNext" CssClass="btn-xlarge" Text="Submit"
                                    ValidationGroup="RegisterUserValidationGroup" />
                            </p>
                            <p>
                                <asp:Label ID="lblSysMsg" runat="server" Text="" CssClass="failureNotification"></asp:Label>
                            </p>
                            <p> </p>
                        </div>
                    </div>
                </ContentTemplate>
                <CustomNavigationTemplate>
                </CustomNavigationTemplate>
            </asp:CreateUserWizardStep>
        </WizardSteps>
    </asp:CreateUserWizard>
    <br />
    <br />
</asp:Content>
