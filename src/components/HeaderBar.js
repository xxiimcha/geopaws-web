import React from "react";
import { Layout, Dropdown, Menu, Avatar, Typography, Badge, Button } from "antd";
import { BellOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

const { Header } = Layout;
const { Text } = Typography;

const HeaderBar = ({ userName }) => {
  const navigate = useNavigate();

  // Logout function
  const handleLogout = async () => {
    try {
      await auth.signOut(); // Firebase logout
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Notifications Placeholder
  const notificationMenu = (
    <Menu>
      <Menu.Item key="1">No new notifications</Menu.Item>
    </Menu>
  );

  return (
    <Header
      style={{
        background: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 20px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
      }}
    >
      {/* Logo or App Title */}
      <Text style={{ fontSize: "20px", fontWeight: "bold" }}></Text>

      {/* Right-side controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {/* Notifications */}
        <Dropdown overlay={notificationMenu} trigger={["click"]}>
          <Badge count={0} offset={[-3, 10]}>
            <BellOutlined style={{ fontSize: "18px", cursor: "pointer" }} />
          </Badge>
        </Dropdown>

        {/* User Profile */}
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="profile" disabled>
                <UserOutlined /> {userName || "Admin"}
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item key="logout" onClick={handleLogout}>
                <LogoutOutlined /> Logout
              </Menu.Item>
            </Menu>
          }
          trigger={["click"]}
        >
          <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
            <Avatar icon={<UserOutlined />} style={{ marginRight: "8px" }} />
            <Text>{userName || "Admin"}</Text>
          </div>
        </Dropdown>
      </div>
    </Header>
  );
};

export default HeaderBar;
