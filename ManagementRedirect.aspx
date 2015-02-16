<%@ Page Title="ArchSite" Language="C#" MasterPageFile="~/Site.master" AutoEventWireup="true" CodeFile="ManagementRedirect.aspx.cs" Inherits="ManagementRedirect" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" Runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" Runat="Server">
    <asp:Label ID="Label1" runat="server" 
        Text="You <b>DO NOT</b> have the appropriate access level to access the administration page."></asp:Label>
</asp:Content>

