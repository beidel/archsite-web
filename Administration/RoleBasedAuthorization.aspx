<%@ Page Title="SC ArchSite Administration: Role-Based Authorization" Language="C#" MasterPageFile="~/Site.master" AutoEventWireup="true" CodeFile="RoleBasedAuthorization.aspx.cs" Inherits="Administration_RoleBasedAuthorization" %>

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
    <h2 class="pageTitle">Role-Based Authorization Demo</h2>
    </div>

    <div class="grid-6">
    <p>
        <asp:LoginView ID="LoginView1" runat="server">
            <RoleGroups>
                <asp:RoleGroup Roles="Administrators">
                    <ContentTemplate>
                        As an Administrator, you may edit and delete user accounts. Remember: With great 
                        power comes great responsibility!
                    </ContentTemplate>
                </asp:RoleGroup>
                <asp:RoleGroup Roles="Supervisors">
                    <ContentTemplate>
                        As a Supervisor, you may edit users&#39; Email and Comment information. Simply click 
                        the Edit button, make your changes, and then click Update.
                    </ContentTemplate>
                </asp:RoleGroup>
            </RoleGroups>
            <LoggedInTemplate>
                You are not a member of the Supervisors or Administrators roles. Therefore you 
                cannot edit or delete any user information.
            </LoggedInTemplate>
            <AnonymousTemplate>
                You are not logged into the system. Therefore you cannot edit or delete any user 
                information.
            </AnonymousTemplate>
        </asp:LoginView>
    </p>
    <asp:GridView ID="UserGrid" runat="server" AutoGenerateColumns="False" DataKeyNames="UserName"
        onrowcancelingedit="UserGrid_RowCancelingEdit" onrowediting="UserGrid_RowEditing" 
        onrowupdating="UserGrid_RowUpdating" onrowdeleting="UserGrid_RowDeleting" 
        onrowcreated="UserGrid_RowCreated" Font-Size=".8250em">
        <Columns>
            <asp:TemplateField ShowHeader="False" ItemStyle-BorderColor="#999999" ItemStyle-BorderStyle="Solid" ItemStyle-BorderWidth="1 px">
                <EditItemTemplate>
                    <asp:LinkButton ID="LinkButton1" runat="server" CausesValidation="True" 
                        CommandName="Update" Text="Update"></asp:LinkButton>
                    &nbsp;<asp:LinkButton ID="LinkButton2" runat="server" CausesValidation="False" 
                        CommandName="Cancel" Text="Cancel"></asp:LinkButton>
                </EditItemTemplate>
                <ItemTemplate>
                    <asp:LinkButton ID="EditButton" runat="server" CausesValidation="False" 
                        CommandName="Edit" Text="Edit"></asp:LinkButton>
                    &nbsp;<asp:LinkButton ID="DeleteButton" runat="server" CausesValidation="False" 
                        CommandName="Delete" Text="Delete"></asp:LinkButton>
                </ItemTemplate>
            </asp:TemplateField>
            <asp:BoundField DataField="UserName" HeaderText="UserName" ReadOnly="True" ItemStyle-BorderColor="#999999" ItemStyle-BorderStyle="Solid" ItemStyle-BorderWidth="1 px" />
            <asp:BoundField DataField="LastLoginDate" DataFormatString="{0:d}" 
                HeaderText="Last Login" HtmlEncode="False" ReadOnly="True" ItemStyle-BorderColor="#999999" ItemStyle-BorderStyle="Solid" ItemStyle-BorderWidth="1 px" />
            <asp:TemplateField HeaderText="Email" ItemStyle-BorderColor="#999999" ItemStyle-BorderStyle="Solid" ItemStyle-BorderWidth="1 px">
                <ItemTemplate>
                    <asp:Label runat="server" ID="Label1" Text='<%# Eval("Email") %>'></asp:Label>
                </ItemTemplate>
                <EditItemTemplate>
                    <asp:TextBox runat="server" ID="Email" Text='<%# Bind("Email") %>'></asp:TextBox>
                    <asp:RequiredFieldValidator ID="RequiredFieldValidator1" runat="server" 
                        ControlToValidate="Email" Display="Dynamic" 
                        ErrorMessage="You must provide an email address." SetFocusOnError="True">*</asp:RequiredFieldValidator>
                    <asp:RegularExpressionValidator ID="RegularExpressionValidator1" runat="server" 
                        ControlToValidate="Email" Display="Dynamic" 
                        ErrorMessage="The email address you have entered is not valid. Please fix this and try again." 
                        SetFocusOnError="True" 
                        ValidationExpression="\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*">*</asp:RegularExpressionValidator>
                </EditItemTemplate>
            </asp:TemplateField>
            <asp:TemplateField ItemStyle-BorderColor="#999999" ItemStyle-BorderStyle="Solid" ItemStyle-BorderWidth="1 px" HeaderText="Comment">
                <ItemTemplate>
                    <asp:Label runat="server" ID="Label2" Text='<%# Eval("Comment") %>'></asp:Label>
                </ItemTemplate>
                <EditItemTemplate>
                    <asp:TextBox runat="server" ID="Comment" TextMode="MultiLine" Columns="40" Rows="4" Text='<%# Bind("Comment") %>'></asp:TextBox>
                </EditItemTemplate>
            </asp:TemplateField>
        </Columns>
    </asp:GridView>
    <asp:ValidationSummary ID="ValidationSummary1" runat="server" 
        ShowMessageBox="True" ShowSummary="False" />
    </div>
</asp:Content>

