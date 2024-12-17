import React, { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import {
  Table,
  Modal,
  Button,
  Typography,
  Card,
  Row,
  Col,
  Select,
  Input,
  Pagination,
  Descriptions,
  message,
  Image
} from "antd";
import Sidebar from "./Sidebar";

const { Title } = Typography;
const { confirm } = Modal;
const { Option } = Select;

const ManagePets = () => {
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Filter states
  const [selectedField, setSelectedField] = useState(""); // First filter (Type, Breed, etc.)
  const [uniqueValues, setUniqueValues] = useState([]); // Second filter options
  const [selectedValue, setSelectedValue] = useState(""); // Selected value from second dropdown
  const [breedSearch, setBreedSearch] = useState(""); // Breed search input state

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Fetch pets from Firestore
  const fetchPets = async () => {
    try {
      const petsCollection = collection(db, "pet");
      const petsSnapshot = await getDocs(petsCollection);
      const petsList = petsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPets(petsList);
      setFilteredPets(petsList);
    } catch (error) {
      console.error("Error fetching pets:", error);
      message.error("Failed to fetch pets.");
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  // Generate unique values for the selected field
  const generateUniqueValues = (field) => {
    const values = pets
      .map((pet) => pet[field])
      .filter((value, index, self) => value && self.indexOf(value) === index);
    setUniqueValues(values);
    setSelectedValue(""); // Reset second filter selection
  };

  // Handle First Filter Change
  const handleFieldChange = (field) => {
    setSelectedField(field);
    generateUniqueValues(field);
  };

  // Handle Second Filter Change
  const handleValueChange = (value) => {
    setSelectedValue(value);
    applyFilters(value, breedSearch);
  };

  // Handle Breed Search
  const handleBreedSearch = (value) => {
    setBreedSearch(value);
    applyFilters(selectedValue, value);
  };

  // Apply Combined Filters
  const applyFilters = (filterValue, breedSearchValue) => {
    let result = pets;

    if (selectedField && filterValue) {
      result = result.filter((pet) => pet[selectedField] === filterValue);
    }

    if (breedSearchValue) {
      result = result.filter((pet) =>
        pet.breed.toLowerCase().includes(breedSearchValue.toLowerCase())
      );
    }

    setFilteredPets(result);
  };

  // Table Columns
  const columns = [
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Breed", dataIndex: "breed", key: "breed" },
    { title: "Age", dataIndex: "age", key: "age" },
    { title: "Color", dataIndex: "color", key: "color" },
    { title: "Sex", dataIndex: "sex", key: "sex" },
    { title: "Arrival Date", dataIndex: "arrivaldate", key: "arrivaldate" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => showModal(record)}>
            View More
          </Button>
          <Button type="link" danger onClick={() => showDeleteConfirm(record.id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  // Modal Functions
  const showModal = (pet) => {
    setSelectedPet(pet);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedPet(null);
  };

  const showDeleteConfirm = (id) => {
    confirm({
      title: "Are you sure you want to delete this pet?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        handleDelete(id);
      },
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "pet", id));
      message.success("Pet deleted successfully!");
      fetchPets();
    } catch (error) {
      console.error("Error deleting pet:", error);
      message.error("Failed to delete pet.");
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flexGrow: 1, padding: "20px" }}>
        <Card bordered style={{ marginBottom: "20px" }}>
          <Title level={3} style={{ textAlign: "center" }}>
            Manage Pets
          </Title>
          {/* Filters */}
          <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
            <Col xs={24} sm={8}>
              <Select
                placeholder="Select Field to Filter"
                style={{ width: "100%" }}
                onChange={handleFieldChange}
                allowClear
              >
                <Option value="type">Type</Option>
                <Option value="breed">Breed</Option>
                <Option value="age">Age</Option>
                <Option value="color">Color</Option>
                <Option value="sex">Sex</Option>
              </Select>
            </Col>
            <Col xs={24} sm={8}>
              <Select
                placeholder="Select Value"
                style={{ width: "100%" }}
                value={selectedValue}
                onChange={handleValueChange}
                allowClear
                disabled={!selectedField} // Disable if no field selected
              >
                {uniqueValues.map((value) => (
                  <Option key={value} value={value}>
                    {value}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={8}>
              <Input
                placeholder="Search by Breed"
                allowClear
                value={breedSearch}
                onChange={(e) => handleBreedSearch(e.target.value)}
              />
            </Col>
          </Row>
        </Card>

        {/* Table */}
        <Card>
          <Table
            dataSource={filteredPets.slice(
              (currentPage - 1) * pageSize,
              currentPage * pageSize
            )}
            columns={columns}
            rowKey="id"
            pagination={false}
          />
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredPets.length}
            onChange={(page, pageSize) => {
              setCurrentPage(page);
              setPageSize(pageSize);
            }}
            style={{ marginTop: "20px", textAlign: "center" }}
          />
        </Card>

        {/* Modal for Pet Details */}
        <Modal
          title={
            <Typography.Title level={4} style={{ margin: 0, textAlign: "center" }}>
              {selectedPet?.breed || "Pet Details"}
            </Typography.Title>
          }
          visible={isModalVisible}
          onCancel={handleCloseModal}
          footer={[
            <Button key="close" type="primary" onClick={handleCloseModal}>
              Close
            </Button>,
          ]}
          centered
          width={800} // Adjust modal width for better spacing
        >
          {selectedPet && (
            <Row gutter={[16, 16]} align="middle">
              {/* Left Side - Image Preview */}
              <Col xs={24} md={8} style={{ textAlign: "center" }}>
                <Image
                  src={selectedPet.images || "https://via.placeholder.com/200"}
                  alt={selectedPet.breed || "Pet Image"}
                  style={{
                    borderRadius: "8px",
                    maxWidth: "100%",
                    maxHeight: "250px",
                    objectFit: "cover",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  }}
                  placeholder
                />
              </Col>

              {/* Right Side - Pet Details */}
              <Col xs={24} md={16}>
                <Descriptions
                  bordered
                  column={{ xs: 1, sm: 1, md: 2 }}
                  size="small"
                  style={{ backgroundColor: "#f9f9f9", borderRadius: "8px", padding: "10px" }}
                >
                  <Descriptions.Item label="Type">{selectedPet.type}</Descriptions.Item>
                  <Descriptions.Item label="Breed">{selectedPet.breed}</Descriptions.Item>
                  <Descriptions.Item label="Age">{selectedPet.age}</Descriptions.Item>
                  <Descriptions.Item label="Color">{selectedPet.color}</Descriptions.Item>
                  <Descriptions.Item label="Sex">{selectedPet.sex}</Descriptions.Item>
                  <Descriptions.Item label="Size/Weight">{selectedPet.sizeweight}</Descriptions.Item>
                  <Descriptions.Item label="Status">{selectedPet.status}</Descriptions.Item>
                  <Descriptions.Item label="Arrival Date">{selectedPet.arrivaldate}</Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
          )}
        </Modal>

      </div>
    </div>
  );
};

export default ManagePets;
