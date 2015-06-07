<%@ Page Title="ArchSite - Management" Language="C#" MasterPageFile="~/Site.master"
    AutoEventWireup="true" CodeFile="ManagementTool.aspx.cs" Inherits="ManagementTool" %>

<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="AjaxControl" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="Server">
</asp:Content>
<asp:Content ID="nav1" ContentPlaceHolderID="nav" runat="Server" >

            <nav class="navAdmin-wrap navAdmin">
		            <ul class="navAdmin">
                        <li><a href="subscribermapredirect.aspx">Subscriber Map</a></li>
                        <li><a href="default.aspx">Home</a></li>
                    </ul>
            </nav>

</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="MainContent" runat="Server">
    <p>
        <AjaxControl:ToolkitScriptManager ID="ToolkitScriptManager1" runat="server"></AjaxControl:ToolkitScriptManager>
    </p>
    <div class="manage">
        <AjaxControl:TabContainer ID="TabContainer1" runat="server"
            ActiveTabIndex="0" Height="800px"
            Width="100%" Font-Bold="False">
            <AjaxControl:TabPanel runat="server" HeaderText="Search" ID="tpSearch" Visible="true">
                <ContentTemplate>
                    <table style="width: 100%;">
                        <tr>
                            <td style="width: 50%">
                                <asp:Label ID="Label1" runat="server" Text="Search for users: The search below will provide a list of site users. To get a list of all users click the &lt;i&gt;Search All&lt;/i&gt; option and click the Search button. To customize the search click the Search By Criteria option and enter the criterion to filter by in the window that is displayed. Once the information has been entered click the Search Button to Searth for the users."
                                    Width="100%"></asp:Label>
</td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td style="width: 30%">
                                <p>&nbsp;</p>
                                <asp:RadioButtonList ID="rblSearchBy" runat="server">
                                    <asp:ListItem>Search All</asp:ListItem>
                                    <asp:ListItem Selected="True">Search By Criteria</asp:ListItem>
                                </asp:RadioButtonList>
                                <br />
                            </td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>
                                <table style="width: 100%;">
                                    <tr>
                                        <td style="width: 30%">
                                            <asp:Label ID="Label2" runat="server" Text="Approval Status: " CssClass="float-right"></asp:Label>
</td>
                                        <td style="width: 60%">
                                            <asp:RadioButtonList ID="rblApprovalStatus" runat="server"><asp:ListItem Selected="True">N/A</asp:ListItem>
<asp:ListItem>Approved</asp:ListItem>
<asp:ListItem>Not Approved</asp:ListItem>
</asp:RadioButtonList>
</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <asp:Label ID="Label3" runat="server" Text="First Name: " CssClass="float-right"></asp:Label>
</td>
                                        <td>
                                            <asp:TextBox ID="txtFirstName" runat="server" Width="98%"></asp:TextBox>
<asp:DropDownList ID="ddlFirstName" runat="server" DataSourceID="sqldsFirstName"
                                                DataTextField="FirstName" DataValueField="FirstName" Visible="False" Width="99%"></asp:DropDownList>
</td>
                                        <td>
                                            <asp:LinkButton ID="lbListFirstName" runat="server" OnClick="lbListFirstName_Click">List</asp:LinkButton>
</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <asp:Label ID="Label4" runat="server" Text="Last Name: " CssClass="float-right"></asp:Label>
</td>
                                        <td>
                                            <asp:TextBox ID="txtLastName" runat="server" Width="98%"></asp:TextBox>
<asp:DropDownList ID="ddlLastName" runat="server" DataSourceID="sqldsLastName" DataTextField="LastName"
                                                DataValueField="LastName" Visible="False" Width="99%"></asp:DropDownList>
</td>
                                        <td>
                                            <asp:LinkButton ID="lbLastName" runat="server" OnClick="lbLastName_Click">List</asp:LinkButton>
</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <asp:Label ID="Label5" runat="server" Text="Organization: " CssClass="float-right"></asp:Label>
</td>
                                        <td>
                                            <asp:TextBox ID="txtOrganization" runat="server" Width="98%"></asp:TextBox>
<asp:DropDownList ID="ddlOrganization" runat="server" DataSourceID="sqldsOrganization"
                                                DataTextField="Organization" DataValueField="Organization" Visible="False" Width="99%"></asp:DropDownList>
</td>
                                        <td>
                                            <asp:LinkButton ID="lbOrganization" runat="server" OnClick="lbOrganization_Click">List</asp:LinkButton>
</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <asp:Label ID="Label6" runat="server" Text="Access Level: " CssClass="float-right"></asp:Label>
</td>
                                        <td>
                                            <asp:DropDownList ID="ddlAccessLevel" runat="server" Width="99%"><asp:ListItem Selected="True">N/A</asp:ListItem>
<asp:ListItem>pending</asp:ListItem>
<asp:ListItem>subscriber</asp:ListItem>
<asp:ListItem>editor</asp:ListItem>
<asp:ListItem>admin</asp:ListItem>
</asp:DropDownList>
</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <asp:Label ID="Label7" runat="server" Text="User Name: " CssClass="float-right"></asp:Label>
</td>
                                        <td>
                                            <asp:TextBox ID="txtUserName" runat="server" Width="98%"></asp:TextBox>
<asp:DropDownList ID="ddlUserName" runat="server" DataSourceID="sqldsUserName" DataTextField="UserName"
                                                DataValueField="UserName" Visible="False" Width="99%"></asp:DropDownList>
</td>
                                        <td>
                                            <asp:LinkButton ID="lbUserName" runat="server" OnClick="lbUserName_Click">List</asp:LinkButton>
</td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td>
                                            <asp:Button ID="btnSearch" runat="server" OnClick="btnSearch_Click" Text="Search"
                                                Width="99%"></asp:Button>
</td>
                                        <td>
                                            <asp:LinkButton ID="lbReset" runat="server" OnClick="lbReset_Click">Reset</asp:LinkButton>
</td>
                                    </tr>
                                </table>
                            </td>
                            <td>
                                <asp:SqlDataSource ID="sqldsFirstName" runat="server" ConnectionString="<%$ ConnectionStrings:ArchSiteDataConnectionString %>"
                                    SelectCommand="SELECT DISTINCT FirstName FROM UserAccountInfo ORDER BY FirstName"></asp:SqlDataSource>

                                <asp:SqlDataSource ID="sqldsLastName" runat="server" ConnectionString="<%$ ConnectionStrings:ArchSiteDataConnectionString %>"
                                    SelectCommand="SELECT DISTINCT LastName FROM UserAccountInfo ORDER BY LastName"></asp:SqlDataSource>

                                <asp:SqlDataSource ID="sqldsOrganization" runat="server" ConnectionString="<%$ ConnectionStrings:ArchSiteDataConnectionString %>"
                                    SelectCommand="SELECT DISTINCT Organization FROM UserAccountInfo ORDER BY Organization"></asp:SqlDataSource>

                                <asp:SqlDataSource ID="sqldsUserName" runat="server" ConnectionString="<%$ ConnectionStrings:ArchSiteDataConnectionString %>"
                                    SelectCommand="SELECT DISTINCT UserName FROM UserAccountInfo ORDER BY UserName"></asp:SqlDataSource>

                            </td>
                            <td></td>
                        </tr>
                        <tr>
                            <td colspan="2">
                                <asp:Label ID="lblMsg" runat="server" Font-Bold="True" CssClass="failureNotification"></asp:Label>
</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </table>
                    <asp:Panel ID="panelSearchResult" runat="server" ScrollBars="Auto" Width="100%" Font-Size="0.8125em">
                        <asp:GridView ID="gvSearchResult" runat="server" CellPadding="6" BackColor="White" BorderColor="#DEDFDE" BorderStyle="None" BorderWidth="1px" ForeColor="Black" GridLines="Vertical" Width="1000px">
<AlternatingRowStyle BackColor="White" />

<FooterStyle BackColor="#CCCC99" />

<HeaderStyle BackColor="#BB292D" Font-Bold="True" ForeColor="White" HorizontalAlign="Left" />

<PagerStyle BackColor="#F7F7DE" ForeColor="Black" HorizontalAlign="Right" />

<RowStyle BackColor="#F2F2F2" />

<SelectedRowStyle BackColor="#CE5D5A" Font-Bold="True" ForeColor="White" />

<SortedAscendingCellStyle BackColor="#FBFBF2" />

<SortedAscendingHeaderStyle BackColor="#848384" />

<SortedDescendingCellStyle BackColor="#EAEAD3" />

<SortedDescendingHeaderStyle BackColor="#575357" />
</asp:GridView>

                    </asp:Panel>

                    <p></p>
                
</ContentTemplate>
            
</AjaxControl:TabPanel>
            <AjaxControl:TabPanel runat="server" HeaderText="Manage" ID="tpManage" Visible="true">
                <HeaderTemplate>
Manage
</HeaderTemplate>
                
<ContentTemplate>
                    <table>
                        <tr>
                            <td style="width: 23%">
                                <asp:Label ID="Label8" runat="server" Text="Manage user with username: " CssClass="float-right"></asp:Label></td>
                            <td style="width: 23%">
                                <asp:DropDownList ID="ddlUserName0" runat="server" Width="99%"></asp:DropDownList></td>
                            <td style="width: 10%">
                                <asp:Button ID="btnGetUser0" runat="server" OnClick="btnGetUser0_Click" Text="Get User"
                                    Width="98%" /></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td style="width: 23%"></td>
                            <td style="width: 23%"></td>
                            <td style="width: 10%"></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>
                                <asp:Label ID="Label9" runat="server" Text="User Name: " CssClass="float-right"></asp:Label></td>
                            <td>
                                <asp:TextBox ID="txtUserName0" runat="server" Enabled="False" Width="97%"></asp:TextBox></td>
                            <td>
                                <asp:Label ID="Label21" runat="server" Text="(locked)"></asp:Label>
                            </td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>
                                <asp:Label ID="Label10" runat="server" Text="First Name: " CssClass="float-right"></asp:Label></td>
                            <td>
                                <asp:TextBox ID="txtFirstName0" runat="server" Width="97%"></asp:TextBox></td>
                            <td>
                                <asp:RequiredFieldValidator ID="FirstNameRequired" runat="server" ControlToValidate="txtFirstName0"
                                    CssClass="failureNotification" ErrorMessage="First Name is required." ToolTip="First Name is required."
                                    ValidationGroup="RegisterUserValidationGroup">*</asp:RequiredFieldValidator></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>
                                <asp:Label ID="Label11" runat="server" Text="Last Name: " CssClass="float-right"></asp:Label></td>
                            <td>
                                <asp:TextBox ID="txtLastName0" runat="server" Width="97%"></asp:TextBox></td>
                            <td>
                                <asp:RequiredFieldValidator ID="LastNameRequired" runat="server" ControlToValidate="txtLastName0"
                                    CssClass="failureNotification" ErrorMessage="Last Name is required." ToolTip="Last Name is required."
                                    ValidationGroup="RegisterUserValidationGroup">*</asp:RequiredFieldValidator></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>
                                <asp:Label ID="Label12" runat="server" Text="Organization: " CssClass="float-right"></asp:Label></td>
                            <td>
                                <asp:TextBox ID="txtOrganization0" runat="server" Width="97%"></asp:TextBox></td>
                            <td>
                                <asp:RequiredFieldValidator ID="OrganizationRequired" runat="server" ControlToValidate="txtOrganization0"
                                    CssClass="failureNotification" ErrorMessage="Organization is required." ToolTip="Organization is required."
                                    ValidationGroup="RegisterUserValidationGroup">*</asp:RequiredFieldValidator></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>
                                <asp:Label ID="Label13" runat="server" Text="Email: " CssClass="float-right"></asp:Label></td>
                            <td>
                                <asp:TextBox ID="txtEmail0" runat="server" Width="97%"></asp:TextBox></td>
                            <td>
                                <asp:RequiredFieldValidator ID="EmailRequired" runat="server" ControlToValidate="txtEmail0"
                                    CssClass="failureNotification" ErrorMessage="E-mail is required." ToolTip="E-mail is required."
                                    ValidationGroup="RegisterUserValidationGroup">*</asp:RequiredFieldValidator></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>
                                <asp:Label ID="Label14" runat="server" Text="Phone Number: " CssClass="float-right"></asp:Label></td>
                            <td>
                                <asp:TextBox ID="txtPhoneNum0" runat="server" Width="97%"></asp:TextBox></td>
                            <td>
                                <asp:RequiredFieldValidator ID="PhoneNumRequired" runat="server" ControlToValidate="txtPhoneNum0"
                                    CssClass="failureNotification" ErrorMessage="Phone Number is required." ToolTip="Phone Number is required."
                                    ValidationGroup="RegisterUserValidationGroup">*</asp:RequiredFieldValidator><asp:RegularExpressionValidator ID="PhoneNumExpression" runat="server" ControlToValidate="txtPhoneNum0"
                                        CssClass="failureNotification" ErrorMessage="Phone Number is invalid." ToolTip="Phone Number Format XXX-XXX-XXXX."
                                        ValidationGroup="RegisterUserValidationGroup" ValidationExpression="(\d{3})-(\d{3})-(\d{4})">*</asp:RegularExpressionValidator></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>
                                <asp:Label ID="Label15" runat="server" Text="Access Level: " CssClass="float-right"></asp:Label></td>
                            <td>
                                <div class="manage">
                                <asp:DropDownList ID="ddlAccessLevel0" runat="server" Width="99%">
                                    <asp:ListItem Selected="True">pending</asp:ListItem>
                                    <asp:ListItem>subscriber</asp:ListItem>
                                    <asp:ListItem>editor</asp:ListItem>
                                    <asp:ListItem>admin</asp:ListItem>
                                </asp:DropDownList></td>
                                </div>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>
                                <asp:Label ID="Label16" runat="server" Text="Approval Status: " CssClass="float-right"></asp:Label></td>
                            <td>
                                <asp:DropDownList ID="ddlApprovalStatus0" runat="server" Width="99%">
                                    <asp:ListItem Selected="True">No</asp:ListItem>
                                    <asp:ListItem>Yes</asp:ListItem>
                                </asp:DropDownList></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>
                                <asp:Label ID="Label17" runat="server" Text="Can this user export data? " CssClass="float-right"></asp:Label></td>
                            <td>
                                <asp:DropDownList ID="ddlExportData0" runat="server" Width="99%">
                                    <asp:ListItem Selected="True">No</asp:ListItem>
                                    <asp:ListItem>Yes</asp:ListItem>
                                </asp:DropDownList></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>
                                <asp:Label ID="Label18" runat="server" Text="Sign Up Date: " CssClass="float-right"></asp:Label></td>
                            <td>
                                <asp:TextBox ID="txtSignUpDate0" runat="server" Enabled="False" Width="97%"></asp:TextBox></td>
                            <td>
                                <asp:Label ID="Label22" runat="server" Text="(locked)"></asp:Label>
                            </td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td style="text-align: center">
                                <asp:LinkButton ID="btnReset0" runat="server" OnClick="btnReset0_Click">Reset</asp:LinkButton></td>
                            <td>
                                <asp:Button ID="btnSave0" runat="server" OnClick="btnSave0_Click" Text="Save" Width="98%"
                                    ValidationGroup="RegisterUserValidationGroup" /></td>
                            <td>
                                <asp:Button ID="btnDelete0" runat="server" Text="Delete" Width="98%" OnClick="btnDelete0_Click" /></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td colspan="3"><span class="failureNotification">
                                <asp:Literal ID="ErrorMessage" runat="server"></asp:Literal></span><asp:ValidationSummary ID="RegisterUserValidationSummary" runat="server" CssClass="failureNotification"
                                    ValidationGroup="RegisterUserValidationGroup" />
                                <asp:Label ID="lblMsg0" runat="server" CssClass="failureNotification"></asp:Label></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td colspan="3"></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </table>
                    <br />
                
</ContentTemplate>
            
</AjaxControl:TabPanel>
            <AjaxControl:TabPanel runat="server" HeaderText="Report" ID="tpReport" Visible="true">
                <ContentTemplate>
                    <table style="width: 100%;">
                        <tr>
                            <td style="width: 20%">
                                <asp:Label ID="Label19" runat="server" Text="Create Report by:"></asp:Label></td>
                            <td style="width: 20%"></td>
                            <td style="width: 20%"></td>
                            <td style="width: 20%"></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>
                                <asp:RadioButtonList ID="rblReportBy" runat="server" AutoPostBack="True" OnSelectedIndexChanged="rblReportBy_SelectedIndexChanged">
                                    <asp:ListItem>Individual</asp:ListItem>
                                    <asp:ListItem>Organization</asp:ListItem>
                                    <asp:ListItem>Access Level</asp:ListItem>
                                    <asp:ListItem Selected="True">All</asp:ListItem>
                                </asp:RadioButtonList></td>
                            <td>
                                <asp:TextBox ID="txtUserName1" runat="server" Width="97%" Visible="False"></asp:TextBox><asp:DropDownList ID="ddlUserName1" runat="server" Visible="False" Width="99%" DataSourceID="sqldsUserName1"
                                    DataTextField="UserName" DataValueField="UserName">
                                </asp:DropDownList><asp:TextBox ID="txtOrganization1" runat="server" Visible="False" Width="97%"></asp:TextBox><asp:DropDownList ID="ddlOrganization1" runat="server" DataSourceID="sqldsOrganization1"
                                    DataTextField="Organization" DataValueField="Organization" Visible="False" Width="99%">
                                </asp:DropDownList><asp:DropDownList
                                    ID="ddlAccessLevel2" runat="server" Visible="False" Width="99%">
                                    <asp:ListItem>pending</asp:ListItem>
                                    <asp:ListItem>subscriber</asp:ListItem>
                                    <asp:ListItem>editor</asp:ListItem>
                                    <asp:ListItem>admin</asp:ListItem>
                                </asp:DropDownList></td>
                            <td>
                                <asp:LinkButton ID="lbListUserName1" runat="server" OnClick="lbListUserName1_Click"
                                    Visible="False">List Individual Names</asp:LinkButton><asp:LinkButton ID="lbListOrganization1" runat="server" OnClick="lbListOrganization1_Click"
                                        Visible="False">List Organizations</asp:LinkButton></td>
                            <td>
                                <asp:SqlDataSource ID="sqldsOrganization1" runat="server" ConnectionString="<%$ ConnectionStrings:ArchSiteDataConnectionString %>"
                                    SelectCommand="SELECT DISTINCT Organization FROM UserAccountInfo ORDER BY Organization"></asp:SqlDataSource>
                                <asp:SqlDataSource ID="sqldsUserName1" runat="server" ConnectionString="<%$ ConnectionStrings:ArchSiteDataConnectionString %>"
                                    SelectCommand="SELECT DISTINCT UserName FROM UserAccountInfo ORDER BY UserName"></asp:SqlDataSource>
                            </td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>
                                <br />
                                <asp:Label ID="Label20" runat="server" Text="When"></asp:Label></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>
                                <asp:RadioButtonList ID="rblReportWhen" runat="server" AutoPostBack="True" OnSelectedIndexChanged="rblReportWhen_SelectedIndexChanged">
                                    <asp:ListItem>Single Day</asp:ListItem>
                                    <asp:ListItem>Date Range</asp:ListItem>
                                    <asp:ListItem Selected="True">All</asp:ListItem>
                                </asp:RadioButtonList></td>
                            <td>
                                <asp:TextBox ID="txtSingleDay" runat="server" Width="97%" Visible="False"></asp:TextBox><AjaxControl:CalendarExtender ID="txtStartDate_CalendarExtender" runat="server" Enabled="True"
                                    TargetControlID="txtSingleDay">
                                </AjaxControl:CalendarExtender>
                                <asp:TextBox ID="txtDayFrom" runat="server" Width="97%" Visible="False"></asp:TextBox><AjaxControl:CalendarExtender ID="txtDayFrom_CalendarExtender" runat="server" Enabled="True"
                                    TargetControlID="txtDayFrom">
                                </AjaxControl:CalendarExtender>
                            </td>
                            <td>
                                <asp:TextBox ID="txtDayTo" runat="server" Visible="False" Width="97%"></asp:TextBox><AjaxControl:CalendarExtender ID="txtDayTo_CalendarExtender" runat="server" Enabled="True"
                                    TargetControlID="txtDayTo">
                                </AjaxControl:CalendarExtender>
                            </td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>&nbsp;</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>
                                <asp:Button ID="btnGenerateReport" runat="server" Text="Generate Report" Width="97%"
                                    OnClick="btnGenerateReport_Click"></asp:Button></td>
                            <td>
                                <asp:LinkButton ID="lbReset1" runat="server" OnClick="lbReset1_Click">Reset</asp:LinkButton></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td colspan="5">
                                <asp:Label ID="lblMsg1" runat="server" CssClass="failureNotification"></asp:Label></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </table>
                    <asp:Panel ID="panelReport" runat="server" ScrollBars="Auto" Width="100%" Height="500px">
                        <asp:GridView ID="gvReport" runat="server" CellPadding="6" ForeColor="Black" GridLines="Vertical" BackColor="White" BorderColor="#DEDFDE" BorderStyle="None" BorderWidth="1px" Width="800px">
                            <AlternatingRowStyle BackColor="White"></AlternatingRowStyle>
                            <FooterStyle BackColor="#CCCC99"></FooterStyle>
                            <HeaderStyle BackColor="#BB292D" Font-Bold="True" ForeColor="White" HorizontalAlign="Left"></HeaderStyle>
                            <PagerStyle BackColor="#F7F7DE" ForeColor="Black" HorizontalAlign="Right"></PagerStyle>
                            <RowStyle BackColor="#F2F2F2"></RowStyle>
                            <SelectedRowStyle BackColor="#CE5D5A" Font-Bold="True" ForeColor="White"></SelectedRowStyle>
                            <SortedAscendingCellStyle BackColor="#FBFBF2"></SortedAscendingCellStyle>
                            <SortedAscendingHeaderStyle BackColor="#848384"></SortedAscendingHeaderStyle>
                            <SortedDescendingCellStyle BackColor="#EAEAD3"></SortedDescendingCellStyle>
                            <SortedDescendingHeaderStyle BackColor="#575357"></SortedDescendingHeaderStyle>
                        </asp:GridView>
                        <br />
                    </asp:Panel>
                
</ContentTemplate>
            
</AjaxControl:TabPanel>
        </AjaxControl:TabContainer>
    </div>

    <p>
    </p>
</asp:Content>
