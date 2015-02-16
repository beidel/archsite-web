<%@ Page Title="ArchSite - Management" Language="C#" MasterPageFile="~/Site.master" AutoEventWireup="true" CodeFile="ManagementToolSub.aspx.cs" Inherits="ManagementToolSub" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" Runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" Runat="Server">
    <table style="width: 100%;">
        <tr>
            <td style="width: 23%">
                <asp:Label runat="server" Text="Manage user with username:" ID="Label8"></asp:Label>
            </td>
            <td style="width: 23%">
                <asp:DropDownList runat="server" Width="99%" ID="ddlUserName">
                </asp:DropDownList>
            </td>
            <td style="width: 10%">
                <asp:Button runat="server" Text="Get User" Width="98%" ID="btnGetUser" 
                    OnClick="btnGetUser_Click"></asp:Button>
            </td>
            <td>
                &nbsp;</td>
        </tr>
        <tr>
            <td>
                &nbsp;
            </td>
            <td>
                &nbsp;
            </td>
            <td>
                &nbsp;
            </td>
            <td>
                &nbsp;</td>
        </tr>
        <tr>
            <td>
                <asp:Label runat="server" Text="UserName:" ID="Label9"></asp:Label>
            </td>
            <td>
                <asp:TextBox runat="server" Enabled="False" Width="97%" ID="txtUserName"></asp:TextBox>
            </td>
            <td>
                &nbsp;</td>
            <td>
                &nbsp;</td>
        </tr>
        <tr>
            <td>
                <asp:Label runat="server" Text="Approval Status:" ID="Label16"></asp:Label>
            </td>
            <td>
                <asp:DropDownList runat="server" Width="99%" ID="ddlApprovalStatus">
                    <asp:ListItem Selected="True">No</asp:ListItem>
                    <asp:ListItem>Yes</asp:ListItem>
                </asp:DropDownList>
            </td>
            <td>
                &nbsp;</td>
            <td>
                &nbsp;</td>
        </tr>
        <tr>
            <td>
                <asp:Label runat="server" Text="Can this user export data?" ID="Label17"></asp:Label>
            </td>
            <td>
                <asp:DropDownList runat="server" Width="99%" ID="ddlExportData">
                    <asp:ListItem Selected="True">No</asp:ListItem>
                    <asp:ListItem>Yes</asp:ListItem>
                </asp:DropDownList>
            </td>
            <td>
                &nbsp;</td>
            <td>
                &nbsp;</td>
        </tr>
        <tr>
            <td>
                <asp:Label runat="server" Text="Sign Up Date:" ID="Label18"></asp:Label>
            </td>
            <td>
                <asp:TextBox runat="server" Enabled="False" Width="97%" ID="txtSignUpDate"></asp:TextBox>
            </td>
            <td>
                &nbsp;</td>
            <td>
                &nbsp;</td>
        </tr>
        <tr>
            <td>
                &nbsp;</td>
            <td>
                &nbsp;</td>
            <td>
                &nbsp;</td>
            <td>
                &nbsp;</td>
        </tr>
        <tr>
            <td style="text-align: center">
                <asp:LinkButton runat="server" ID="btnReset" onclick="btnReset_Click">Reset</asp:LinkButton>
            </td>
            <td>
                <asp:Button runat="server" Text="Save" 
                    ValidationGroup="RegisterUserValidationGroup" Width="98%" ID="btnSave" 
                    onclick="btnSave_Click"></asp:Button>
            </td>
            <td>
                &nbsp;</td>
            <td>
                &nbsp;</td>
        </tr>
        <tr>
            <td>
                &nbsp;</td>
            <td colspan="3">
                <asp:Label runat="server" CssClass="failureNotification" ID="lblMsg"></asp:Label>
            </td>
        </tr>
        <tr>
            <td>
                &nbsp;</td>
            <td>
                &nbsp;</td>
            <td>
                &nbsp;</td>
            <td>
                &nbsp;</td>
        </tr>
        <tr>
            <td>
                &nbsp;</td>
            <td>
                &nbsp;</td>
            <td>
                &nbsp;</td>
            <td>
                &nbsp;</td>
        </tr>
        <tr>
            <td>
                &nbsp;</td>
            <td>
                &nbsp;</td>
            <td>
                &nbsp;</td>
            <td>
                &nbsp;</td>
        </tr>
    </table>
</asp:Content>

