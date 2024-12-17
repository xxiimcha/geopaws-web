import React from "react";
import { Layout, Typography, Card, Row, Col, Button } from "antd";
import { UserOutlined, FileOutlined, SettingOutlined } from "@ant-design/icons";
import Sidebar from "./components/Sidebar";
import HeaderBar from "./components/HeaderBar"; // Reusable header with profile/logout

const { Content } = Layout;
const { Title, Text } = Typography;

const LandingPage = ({ adminName }) => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sidebar />

      <Layout>
        {/* Reusable Header */}
        <HeaderBar userName={adminName || "Admin"} />

        {/* Main Content */}
        <Content style={{ margin: "20px", background: "#fff", padding: "30px", borderRadius: "8px" }}>
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <Title level={2} style={{ marginBottom: "10px" }}>
              Welcome, {adminName || "Admin"}
            </Title>
            <Text type="secondary" style={{ fontSize: "16px" }}>
              This is the admin dashboard. Use the options below to manage your system.
            </Text>
          </div>

          {/* Quick Action Cards */}
          <Row gutter={[16, 16]} justify="center">
            <Col xs={24} sm={12} md={8}>
              <Card hoverable bordered style={{ textAlign: "center" }}>
                <UserOutlined style={{ fontSize: "40px", color: "#1890ff", marginBottom: "10px" }} />
                <Title level={4}>Manage Users</Title>
                <Button type="primary" onClick={() => console.log("Manage Users")}>
                  Go to Users
                </Button>
              </Card>
            </Col>

            <Col xs={24} sm={12} md={8}>
              <Card hoverable bordered style={{ textAlign: "center" }}>
                <FileOutlined style={{ fontSize: "40px", color: "#52c41a", marginBottom: "10px" }} />
                <Title level={4}>View Reports</Title>
                <Button type="primary" onClick={() => console.log("View Reports")}>
                  Go to Reports
                </Button>
              </Card>
            </Col>

            <Col xs={24} sm={12} md={8}>
              <Card hoverable bordered style={{ textAlign: "center" }}>
                <SettingOutlined style={{ fontSize: "40px", color: "#faad14", marginBottom: "10px" }} />
                <Title level={4}>Settings</Title>
                <Button type="primary" onClick={() => console.log("Settings")}>
                  Go to Settings
                </Button>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default LandingPage;
