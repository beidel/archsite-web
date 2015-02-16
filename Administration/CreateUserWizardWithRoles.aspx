<%@ Page Title="SC ArchSite Administration: User / Role Wizard" Language="C#" MasterPageFile="~/Site.master" AutoEventWireup="true" CodeFile="CreateUserWizardWithRoles.aspx.cs" Inherits="Administration_CreateUserWizardWithRoles" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" Runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="nav" Runat="Server">
    <ul>
        <li><a href="<%= ResolveUrl("~/Account/register.aspx") %>" >Create Account</a></li>
        <li><a href="<%= ResolveUrl("~/Account/changePassword.aspx") %>" >Change Password</a></li>
        <li><a href="<%= ResolveUrl("~/userDoc.aspx") %>" >User Documentation</a></li>
        <li><a href="<%= ResolveUrl("~/overview.aspx") %>" >Subscription Overview</a></li>
        <li><a href="http://archsite.cas.sc.edu/sciaainfo/ArchSite%20Subscription%20Request%20Form%20&%20License%20Agreement2.pdf" target="_blank">License Agreement</a></li>
        <li><a href="<%= ResolveUrl("~/disclaimers.aspx") %>" >Disclaimers</a></li>
        <li><a href="<%= ResolveUrl("~/Administration/ManageRoles.aspx") %>" id ="current">Administration</a>
            <ul>
                <li><a href="<%= ResolveUrl("~/Administration/ManageRoles.aspx") %>" ><span> &#8212 </span>Manage Roles</a></li>
                <li><a href="<%= ResolveUrl("~/Administration/ManageUsers.aspx") %>" ><span> &#8212 </span>Manage Users</a></li>
                <li><a href="<%= ResolveUrl("~/Administration/RoleBasedAuthorization.aspx") %>" ><span> &#8212 </span>Role-Based Authorization</a></li>
                <li><a href="<%= ResolveUrl("~/Administration/UsersAndRoles.aspx") %>" ><span> &#8212 </span>User Role Management</a></li>
                <li><a href="<%= ResolveUrl("~/Administration/CreateUserWizardWithRoles.aspx") %>" ><span> &#8212 </span>Create Account Wizard</a></li>
            </ul>
        </li>
        <li><a href="<%= ResolveUrl("~/about.aspx") %>" >About</a></li>
        <li><a href="<%= ResolveUrl("~/ArchSitePublic.html") %>" >Public Map</a></li>
    </ul>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="mainContent" Runat="Server">
    <div class="grid-6">
    <h2 class="pageTitle">Create a User Account (with Roles!)</h2>
    </div>

    <div class="grid-4">
    <asp:CreateUserWizard ID="RegisterUserWithRoles" runat="server" 
        ContinueDestinationPageUrl="~/Default.aspx" 
        onactivestepchanged="RegisterUserWithRoles_ActiveStepChanged" 
        LoginCreatedUser="False">
        <WizardSteps>
            <asp:CreateUserWizardStep ID="CreateUserWizardStep1" runat="server">
            </asp:CreateUserWizardStep>
            <asp:WizardStep ID="SpecifyRolesStep" runat="server" StepType="Step" 
                Title="Specify Roles" AllowReturn="False">
                <asp:CheckBoxList ID="RoleList" runat="server">
                </asp:CheckBoxList>
            </asp:WizardStep>
            <asp:CompleteWizardStep ID="CompleteWizardStep1" runat="server">
            </asp:CompleteWizardStep>
        </WizardSteps>
    </asp:CreateUserWizard>
    </div>
</asp:Content>

