import React, { useState } from 'react';
import { Form, Input, Button, Typography, Upload, Select, DatePicker, Card, Row, Col, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { db, storage } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import Sidebar from './Sidebar';

const { Title } = Typography;
const { Option } = Select;

const AddPets = () => {
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);

  const onFinish = async (values) => {
    console.log("Form Values Submitted:", values); // Log form values for debugging
    setUploading(true);
    let imageUrl = '';
  
    try {
      // Check and upload the image
      if (values.imageFile && values.imageFile[0]) {
        const imageFile = values.imageFile[0].originFileObj; // Correctly access the file object
        console.log("Uploading File:", imageFile);
  
        const storageRef = ref(storage, `images/${imageFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);
  
        await new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log(`Upload Progress: ${progress}%`);
            },
            (error) => {
              console.error("Error during upload:", error);
              reject(error);
            },
            async () => {
              imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
              console.log("File successfully uploaded. URL:", imageUrl);
              resolve();
            }
          );
        });
      } else {
        throw new Error("No file uploaded or fileList is invalid.");
      }
  
      // Remove the imageFile field before saving to Firestore
      const { imageFile, ...cleanedValues } = values;
  
      // Add the uploaded image URL
      const petData = {
        ...cleanedValues,
        images: imageUrl,
        arrivaldate: values.arrivaldate.format('YYYY-MM-DD'),
      };
  
      console.log("Saving to Firestore:", petData);
  
      const petCollectionRef = collection(db, 'pet');
      await addDoc(petCollectionRef, petData);
  
      message.success('Pet added successfully!');
      form.resetFields();
    } catch (error) {
      console.error("Error in onFinish:", error.message);
      message.error(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setUploading(false);
    }
  };
  

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div style={{ flexGrow: 1, padding: '20px' }}>
        <Card style={{ maxWidth: 800, margin: '0 auto', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <Title level={3} style={{ textAlign: 'center', marginBottom: '20px' }}>
            Add New Pet
          </Title>
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Row gutter={[16, 16]}>
              {/* Fields */}
              <Col xs={24} sm={12}>
                <Form.Item name="age" label="Age" rules={[{ required: true }]}>
                  <Input placeholder="3 years old" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item name="arrivaldate" label="Arrival Date" rules={[{ required: true }]}>
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item name="breed" label="Breed" rules={[{ required: true }]}>
                  <Input placeholder="Calico Cat" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item name="color" label="Color" rules={[{ required: true }]}>
                  <Input placeholder="Tricolor" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item name="sex" label="Sex" rules={[{ required: true }]}>
                  <Select placeholder="Select sex">
                    <Option value="Male">Male</Option>
                    <Option value="Female">Female</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item name="sizeweight" label="Size/Weight" rules={[{ required: true }]}>
                  <Input placeholder="2kg" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                  <Input placeholder="Available" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item name="type" label="Type" rules={[{ required: true }]}>
                  <Input placeholder="Cat" />
                </Form.Item>
              </Col>

              {/* New Fields */}
              <Col xs={24}>
                <Form.Item name="first_owner" label="First Owner" rules={[{ required: true }]}>
                  <Input placeholder="John Doe" />
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Form.Item name="health_issues" label="Health Issues">
                  <Input placeholder="Healthy" />
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Form.Item name="rescue_location" label="Rescue Location">
                  <Input placeholder="Laguna" />
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Form.Item name="additional_details" label="Additional Details">
                  <Input.TextArea placeholder="None" />
                </Form.Item>
              </Col>

              {/* Image Upload */}
              <Col xs={24}>
                <Form.Item
                  name="imageFile"
                  label="Upload Image"
                  valuePropName="fileList"
                  getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
                  rules={[{ required: true, message: 'Please upload an image' }]}
                >
                  <Upload beforeUpload={() => false} maxCount={1} accept="image/*">
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={uploading} block>
                {uploading ? 'Uploading...' : 'Add Pet'}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default AddPets;
