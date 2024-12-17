import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../firebase";
import { Layout, List, Avatar, Typography, Input, Button, Spin, message, Upload, Empty } from "antd";
import { UserOutlined, SendOutlined, PaperClipOutlined } from "@ant-design/icons";
import Sidebar from "./Sidebar";
import HeaderBar from "./HeaderBar"; // Reusable header

const { Sider, Content } = Layout;
const { TextArea } = Input;
const { Title, Text } = Typography;

const ManageMessages = ({ adminUid, adminName }) => {
  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messagesHistory, setMessagesHistory] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const q = query(usersCollection, where("type", "==", "customer"));
        const snapshot = await getDocs(q);

        const customersList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCustomers(customersList);
      } catch (error) {
        console.error("Error fetching customers:", error);
        message.error("Failed to load customers.");
      } finally {
        setLoadingCustomers(false);
      }
    };

    fetchCustomers();
  }, []);

  const fetchMessages = async (userId) => {
    try {
      const messagesCollection = collection(db, "messages");
      const snapshot = await getDocs(messagesCollection);

      const allMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filteredMessages = allMessages.filter(
        (msg) =>
          (msg.sender_uid === adminUid && msg.receiver_uid === userId) ||
          (msg.sender_uid === userId && msg.receiver_uid === adminUid)
      );

      filteredMessages.sort((a, b) => a.timestamp.seconds - b.timestamp.seconds);
      setMessagesHistory(filteredMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      message.error("Failed to load messages.");
    }
  };

  const handleSelectUser = async (user) => {
    setSelectedUser(user);
    setMessagesHistory([]);
    await fetchMessages(user.id);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() && !file) {
      message.warning("Please type a message or attach an image.");
      return;
    }

    setSending(true);
    let imageUrl = "";

    try {
      if (file) {
        const storageRef = ref(storage, `messages/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        await uploadTask;
        imageUrl = await getDownloadURL(storageRef);
      }

      const messagesCollection = collection(db, "messages");
      await addDoc(messagesCollection, {
        sender_uid: adminUid,
        receiver_uid: selectedUser.id,
        text: messageText,
        image: imageUrl,
        timestamp: new Date(),
      });

      setMessageText("");
      setFile(null);
      await fetchMessages(selectedUser.id);
      message.success("Message sent successfully!");
    } catch (error) {
      console.error("Error sending message:", error);
      message.error("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  const handleFileChange = (info) => {
    const file = info.file.originFileObj;
    if (file && file.type.startsWith("image/")) {
      setFile(file);
      message.success("Image ready to send.");
    } else {
      message.error("Only image files are allowed.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout>
        {/* HeaderBar */}
        <HeaderBar userName={adminName || "Admin"} />

        <Layout>
          {/* Contacts Sidebar */}
          <Sider width={300} style={{ background: "#fff", borderRight: "1px solid #ddd" }}>
            <div style={{ padding: "20px", textAlign: "center" }}>
              <Title level={4}>Contacts</Title>
            </div>
            {loadingCustomers ? (
              <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
            ) : (
              <List
                dataSource={customers}
                renderItem={(user) => (
                  <List.Item
                    onClick={() => handleSelectUser(user)}
                    style={{
                      padding: "10px 20px",
                      cursor: "pointer",
                      backgroundColor: selectedUser?.id === user.id ? "#f0f2f5" : "inherit",
                    }}
                  >
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />} />}
                      title={<strong>{user.firstname} {user.lastname}</strong>}
                      description={user.email}
                    />
                  </List.Item>
                )}
              />
            )}
          </Sider>

          {/* Conversation Content */}
          <Content style={{ padding: "20px", background: "#fff" }}>
            {selectedUser ? (
              <>
                <Title level={4} style={{ marginBottom: "10px" }}>
                  Conversation with {selectedUser.firstname} {selectedUser.lastname}
                </Title>
                <div style={{ height: "500px", overflowY: "auto", marginBottom: "10px" }}>
                  {messagesHistory.length > 0 ? (
                    messagesHistory.map((msg) => (
                      <div
                        key={msg.id}
                        style={{
                          textAlign: msg.sender_uid === adminUid ? "right" : "left",
                          marginBottom: "10px",
                        }}
                      >
                        {msg.image && (
                          <img
                            src={msg.image}
                            alt="attachment"
                            style={{ maxWidth: "200px", borderRadius: "8px", marginBottom: "5px" }}
                          />
                        )}
                        <div
                          style={{
                            display: "inline-block",
                            background: msg.sender_uid === adminUid ? "#1890ff" : "#f0f0f0",
                            color: msg.sender_uid === adminUid ? "#fff" : "#000",
                            padding: "8px 12px",
                            borderRadius: "8px",
                          }}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))
                  ) : (
                    <Empty description="No messages yet" />
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <TextArea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={handleKeyPress}
                    rows={2}
                    placeholder="Type your message..."
                    style={{ flex: 1, marginRight: "10px" }}
                  />
                  <Upload beforeUpload={() => false} onChange={handleFileChange} accept="image/*" showUploadList={false}>
                    <Button icon={<PaperClipOutlined />} type="text" />
                  </Upload>
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={handleSendMessage}
                    loading={sending}
                  />
                </div>
              </>
            ) : (
              <Empty description="Select a contact to start messaging" />
            )}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default ManageMessages;
