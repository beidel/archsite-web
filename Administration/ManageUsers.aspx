<%@ Page Title="SC ArchSite Administration: Manage Users" Language="C#" MasterPageFile="~/Site.master" AutoEventWireup="true" CodeFile="ManageUsers.aspx.cs" Inherits="Account_ManageUsers" %>

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
        <h2 class="pageTitle">Manage Users</h2>
    </div>

    <div class="grid-6">

    <p>
        <asp:Repeater ID="FilteringUI" runat="server" 
            onitemcommand="FilteringUI_ItemCommand">
            <ItemTemplate>
                <asp:LinkButton runat="server" ID="lnkFilter" 
                                Text='<%# Container.DataItem %>' 
                                CommandName='<%# Container.DataItem %>'></asp:LinkButton>
            </ItemTemplate>
            
            <SeparatorTemplate>|</SeparatorTemplate>
        </asp:Repeater>
    </p>
    <p>
        <asp:GridView ID="UserAccounts" runat="server"
            AutoGenerateColumns="False" Font-Size=".8250em" Font-Bold="False" HeaderStyle-ForeColor="#333333" HeaderStyle-BackColor="#CCCCCC" CellPadding="-1" CellSpacing="0">
            <Columns>
                <asp:BoundField DataField="UserName" HeaderText="UserName" ItemStyle-Width="25%" />
                <asp:BoundField DataField="Email" HeaderText="Email" ItemStyle-Width="35%" />
                <asp:CheckBoxField DataField="IsApproved" HeaderText="Approved?" />
                <asp:CheckBoxField DataField="IsLockedOut" HeaderText="Locked Out?" />
                <asp:CheckBoxField DataField="IsOnline" HeaderText="Online?" />
                <asp:BoundField DataField="Comment" HeaderText="Comment" />
            </Columns>
        </asp:GridView>
    </p>
    <p>
        <asp:LinkButton ID="lnkFirst" runat="server" onclick="lnkFirst_Click" Font-Size=".8250em">&lt;&lt; First</asp:LinkButton> |
        <asp:LinkButton ID="lnkPrev" runat="server" onclick="lnkPrev_Click" Font-Size=".8250em">&lt; Prev</asp:LinkButton> |
        <asp:LinkButton ID="lnkNext" runat="server" onclick="lnkNext_Click" Font-Size=".8250em">Next &gt;</asp:LinkButton> |
        <asp:LinkButton ID="lnkLast" runat="server" onclick="lnkLast_Click" Font-Size=".8250em">Last &gt;&gt;</asp:LinkButton>
    </p>

    </div>
</asp:Content>

