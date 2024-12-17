import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import {
  Table,
  Button,
  Typography,
  Card,
  Modal,
  Select,
  Input,
  message,
  Space,
  Badge,
} from "antd";
import Sidebar from "./Sidebar";
import HeaderBar from "./HeaderBar"; // Import the reusable header

const { Title } = Typography;
const { Option } = Select;

const ManagePetReports = ({ adminName }) => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [status, setStatus] = useState("");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Fetch reports from Firestore
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const reportsCollection = collection(db, "pet_reports");
        const reportsSnapshot = await getDocs(reportsCollection);
        const reportsList = reportsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReports(reportsList);
      } catch (error) {
        console.error("Error fetching reports:", error);
        message.error("Failed to load pet reports.");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  // Handle View Report
  const handleView = (report) => {
    setSelectedReport(report);
    setStatus(report.status || "");
    setRemarks(report.remarks || "");
    setIsModalVisible(true);
  };

  // Handle Delete Report
  const handleDelete = async (reportId) => {
    try {
      await deleteDoc(doc(db, "pet_reports", reportId));
      setReports((prev) => prev.filter((report) => report.id !== reportId));
      message.success("Report deleted successfully!");
    } catch (error) {
      console.error("Error deleting report:", error);
      message.error("Failed to delete report.");
    }
  };

  // Save Status and Remarks
  const handleSaveChanges = async () => {
    if (selectedReport) {
      try {
        const reportRef = doc(db, "pet_reports", selectedReport.id);
        await updateDoc(reportRef, { status, remarks });
        setReports((prev) =>
          prev.map((report) =>
            report.id === selectedReport.id ? { ...report, status, remarks } : report
          )
        );
        message.success("Report updated successfully!");
        setIsModalVisible(false);
      } catch (error) {
        console.error("Error updating report:", error);
        message.error("Failed to save changes.");
      }
    }
  };

  // Function to render status badges
  const renderStatusBadge = (status) => {
    switch (status) {
      case "In Progress":
        return <Badge status="processing" text="In Progress" />;
      case "Resolved":
        return <Badge status="success" text="Resolved" />;
      case "Closed":
        return <Badge status="error" text="Closed" />;
      default:
        return <Badge status="default" text="Unknown" />;
    }
  };

  // Table Columns
  const columns = [
    {
      title: "Concern",
      dataIndex: "pet_name",
      key: "pet_name",
    },
    {
      title: "Date Lost",
      dataIndex: "date_lost",
      key: "date_lost",
    },
    {
      title: "Location Lost",
      dataIndex: "location_lost",
      key: "location_lost",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => renderStatusBadge(status),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleView(record)}>
            View
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div style={{ flexGrow: 1 }}>
        {/* HeaderBar */}
        <HeaderBar userName={adminName || "Admin"} />

        {/* Page Content */}
        <div style={{ padding: "20px" }}>
          <Card bordered style={{ marginBottom: "20px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
            <Title level={3} style={{ textAlign: "center" }}>
              Manage Pet Reports
            </Title>
          </Card>

          {/* Table */}
          <Card>
            <Table
              dataSource={reports}
              columns={columns}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 5 }}
              bordered
            />
          </Card>

          {/* Modal for Viewing Details */}
          <Modal
            title="Pet Report Details"
            visible={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={[
              <Button key="cancel" onClick={() => setIsModalVisible(false)}>
                Cancel
              </Button>,
              <Button key="save" type="primary" onClick={handleSaveChanges}>
                Save Changes
              </Button>,
            ]}
          >
            {selectedReport && (
              <>
                <p>
                  <strong>Concern:</strong> {selectedReport.pet_name}
                </p>
                <p>
                  <strong>Date Lost:</strong> {selectedReport.date_lost}
                </p>
                <p>
                  <strong>Time Lost:</strong> {selectedReport.time_lost}
                </p>
                <p>
                  <strong>Location Lost:</strong> {selectedReport.location_lost}
                </p>
                <p>
                  <strong>Additional Info:</strong> {selectedReport.additional_info}
                </p>
                <p>
                  <strong>User Email:</strong> {selectedReport.user}
                </p>

                {/* Status Dropdown */}
                <Select
                  style={{ width: "100%", marginBottom: "16px" }}
                  value={status}
                  onChange={(value) => setStatus(value)}
                  placeholder="Select Status"
                >
                  <Option value="In Progress">In Progress</Option>
                  <Option value="Resolved">Resolved</Option>
                  <Option value="Closed">Closed</Option>
                </Select>

                {/* Remarks Input */}
                <Input.TextArea
                  rows={3}
                  placeholder="Add remarks..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </>
            )}
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default ManagePetReports;
