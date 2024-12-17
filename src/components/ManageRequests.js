import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import {
  Table,
  Button,
  Typography,
  Modal,
  Badge,
  message,
  Card,
  Space,
  Descriptions,
} from "antd";
import Sidebar from "./Sidebar";

const { Title } = Typography;

const ManageRequests = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [petDetails, setPetDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Fetch requests from Firestore
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const requestsCollection = collection(db, "request");
        const requestsSnapshot = await getDocs(requestsCollection);
        const requestsList = requestsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRequests(requestsList);
      } catch (error) {
        console.error("Error fetching requests:", error);
        message.error("Failed to load requests.");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  // Fetch additional details and open modal
  const handleView = async (request) => {
    try {
      setSelectedRequest(request);

      // Fetch pet details
      const petDoc = await getDoc(doc(db, "pet", request.petId));
      setPetDetails(petDoc.exists() ? petDoc.data() : null);

      // Fetch user details
      const userDoc = await getDoc(doc(db, "users", request.uid));
      setUserDetails(userDoc.exists() ? userDoc.data() : null);

      setIsModalVisible(true);
    } catch (error) {
      console.error("Error fetching details:", error);
      message.error("Failed to load additional details.");
    }
  };

  // Close modal
  const handleClose = () => {
    setIsModalVisible(false);
    setSelectedRequest(null);
    setPetDetails(null);
    setUserDetails(null);
  };

  // Handle delete request
  const handleDelete = async (requestId) => {
    try {
      await deleteDoc(doc(db, "request", requestId));
      setRequests((prevRequests) => prevRequests.filter((req) => req.id !== requestId));
      message.success("Request deleted successfully!");
    } catch (error) {
      console.error("Error deleting request:", error);
      message.error("Failed to delete request.");
    }
  };

  // Handle Approve Request
  const handleApprove = async () => {
    await updateStatus("Approved");
  };

  // Handle Decline Request
  const handleDecline = async () => {
    await updateStatus("Declined");
  };

  // Update request status
  const updateStatus = async (status) => {
    try {
      if (selectedRequest) {
        const requestRef = doc(db, "request", selectedRequest.id);
        await updateDoc(requestRef, { status });
        setRequests((prevRequests) =>
          prevRequests.map((req) =>
            req.id === selectedRequest.id ? { ...req, status } : req
          )
        );
        message.success(`Request ${status.toLowerCase()} successfully!`);
        handleClose();
      }
    } catch (error) {
      console.error("Error updating status:", error);
      message.error("Failed to update status.");
    }
  };

  // Table columns
  const columns = [
    {
      title: "Full Name",
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Badge
          status={
            status === "Approved"
              ? "success"
              : status === "Declined"
              ? "error"
              : "processing"
          }
          text={status}
        />
      ),
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
      <div style={{ flexGrow: 1, padding: "20px" }}>
        <Card bordered style={{ marginBottom: "20px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
          <Title level={3} style={{ textAlign: "center" }}>
            Manage Requests
          </Title>
        </Card>

        {/* Table */}
        <Card>
          <Table
            dataSource={requests}
            columns={columns}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 5 }}
            bordered
          />
        </Card>

        {/* Modal */}
        <Modal
          title="Request Details"
          visible={isModalVisible}
          onCancel={handleClose}
          footer={[
            <Button key="close" onClick={handleClose}>
              Close
            </Button>,
            selectedRequest?.status === "Pending" && (
              <>
                <Button key="approve" type="primary" onClick={handleApprove}>
                  Approve
                </Button>
                <Button key="decline" type="danger" onClick={handleDecline}>
                  Decline
                </Button>
              </>
            ),
          ]}
          centered
          width={700}
        >
          {selectedRequest && (
            <Descriptions bordered size="small" column={1}>
              <Descriptions.Item label="Full Name">{selectedRequest.fullname}</Descriptions.Item>
              <Descriptions.Item label="Status">{selectedRequest.status}</Descriptions.Item>

              {userDetails && (
                <>
                  <Descriptions.Item label="User Email">{userDetails.email}</Descriptions.Item>
                  <Descriptions.Item label="Contact">{userDetails.contact}</Descriptions.Item>
                  <Descriptions.Item label="Address">{userDetails.address}</Descriptions.Item>
                </>
              )}

              {petDetails && (
                <>
                  <Descriptions.Item label="Pet Name">{petDetails.first_owner}</Descriptions.Item>
                  <Descriptions.Item label="Breed">{petDetails.breed}</Descriptions.Item>
                  <Descriptions.Item label="Age">{petDetails.age}</Descriptions.Item>
                  <Descriptions.Item label="Health Issues">{petDetails.health_issues}</Descriptions.Item>
                  <Descriptions.Item label="Additional Details">
                    {petDetails.additional_details}
                  </Descriptions.Item>
                </>
              )}
            </Descriptions>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default ManageRequests;
