<%@ Page Title="SC ArchSite Administration: Users and Roles" Language="C#" MasterPageFile="~/Site.master" AutoEventWireup="true" CodeFile="UsersAndRoles.aspx.cs" Inherits="Administration_UsersAndRoles" %>

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
        <h2 class="pageTitle">User Role Management</h2>
    </div>

    <div class="grid-3">

        <asp:Label ID="ActionStatus" runat="server" CssClass="Important"></asp:Label>

    <h3>Manage Roles By User</h3>
    <hr class="no-space" />
    <p>
        <b>Select a User:</b>
        <asp:DropDownList ID="UserList" runat="server" AutoPostBack="True" 
            DataTextField="UserName" DataValueField="UserName" 
            onselectedindexchanged="UserList_SelectedIndexChanged">
        </asp:DropDownList>
    </p>
    <p>
        <asp:Repeater ID="UsersRoleList" runat="server">
            <ItemTemplate>
                <asp:CheckBox runat="server" ID="RoleCheckBox" AutoPostBack="true" Text='<%# Container.DataItem %>' OnCheckedChanged="RoleCheckBox_CheckChanged" />
                <br />
            </ItemTemplate>
        </asp:Repeater>
    </p>
    </div>

    <div class="grid-3">
    <h3>Manage Users By Role</h3>
    <hr class="no-space" />
        <p>
        <b>Select a Role:</b>
        <asp:DropDownList ID="RoleList" runat="server" AutoPostBack="true" 
            onselectedindexchanged="RoleList_SelectedIndexChanged">
        </asp:DropDownList>
    </p>
    <p>
        <asp:GridView ID="RolesUserList" runat="server" AutoGenerateColumns="False" 
            EmptyDataText="No users belong to this role." 
            onrowdeleting="RolesUserList_RowDeleting" BorderColor="#999999" BorderStyle="Dotted" BorderWidth="1 px" Font-Size=".8250em" CellPadding="-1">
            <Columns>
                <asp:CommandField DeleteText="Remove" ShowDeleteButton="True" ControlStyle-Width="80 px" HeaderStyle-BorderColor="#666666" />
                <asp:TemplateField HeaderText="Users" ItemStyle-Width="200 px">
                    <ItemTemplate>
                        <asp:Label runat="server" id="UserNameLabel" Text='<%# Container.DataItem %>'></asp:Label>
                    </ItemTemplate>
                </asp:TemplateField>
            </Columns>
        </asp:GridView>
    </p>
    <p>
        <b>UserName:</b>
        <asp:TextBox ID="UserNameToAddToRole" runat="server"></asp:TextBox>
        <br />
        <asp:Button ID="AddUserToRoleButton" runat="server" Text="Add User to Role" 
            onclick="AddUserToRoleButton_Click" />
    </p>
    </div>
</asp:Content>

