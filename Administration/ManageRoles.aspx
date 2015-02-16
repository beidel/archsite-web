<%@ Page Title="SC ArchSite Administration: Manage Roles" Language="C#" MasterPageFile="~/Site.master" AutoEventWireup="true" CodeFile="ManageRoles.aspx.cs" Inherits="Administration_ManageRoles" %>

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
        <h2 class="pageTitle">Manage Roles</h2>
    </div>
    <div class="grid-6">
    <p>
        <b>Create a New Role: </b>
        <asp:TextBox ID="RoleName" runat="server"></asp:TextBox>
        <asp:RequiredFieldValidator ID="RoleNameReqField" runat="server" 
            ControlToValidate="RoleName" Display="Dynamic" 
            ErrorMessage="You must enter a role name."></asp:RequiredFieldValidator>
        
        <br />
        <asp:Button ID="CreateRoleButton" runat="server" Text="Create Role" 
            onclick="CreateRoleButton_Click" />
    </p>
    <p>
        <asp:GridView ID="RoleList" runat="server" AutoGenerateColumns="False" 
            onrowdeleting="RoleList_RowDeleting" Font-Size=".8250em">
            <Columns>
                <asp:CommandField DeleteText="Delete Role" ShowDeleteButton="True" ItemStyle-BorderColor="#999999" ItemStyle-BorderStyle="Solid" ItemStyle-BorderWidth="1 px" />
                <asp:TemplateField HeaderText="Role" ItemStyle-BorderColor="#999999" ItemStyle-BorderStyle="Solid" ItemStyle-BorderWidth="1 px">
                    <ItemTemplate>
                        <asp:Label runat="server" ID="RoleNameLabel" Text='<%# Container.DataItem %>' />
                    </ItemTemplate>
                </asp:TemplateField>
            </Columns>
        </asp:GridView>
    </p>
    </div>
</asp:Content>

