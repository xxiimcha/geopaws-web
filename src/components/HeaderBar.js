import React, { useEffect, useState } from "react";
import { Layout, Dropdown, Menu, Avatar, Typography, Badge, message } from "antd";
import { BellOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { collection, query, where, onSnapshot, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";

const { Header } = Layout;
const { Text } = Typography;

const HeaderBar = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Admin");
  const [adminUid, setAdminUid] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Retrieve admin data from localStorage
    const storedUserName = localStorage.getItem("userName");
    const storedAdminUid = localStorage.getItem("adminUid");

    if (storedUserName) {
      setUserName(storedUserName);
    } else {
      console.warn("UserName not found in localStorage.");
    }

    if (storedAdminUid) {
      setAdminUid(storedAdminUid);
    } else {
      console.warn("Admin UID not found in localStorage.");
    }
  }, []);

  useEffect(() => {
    if (!adminUid) {
      console.warn("Admin UID is undefined. Unable to fetch notifications.");
      return;
    }

    // Fetch unread messages grouped by sender
    const messagesQuery = query(
      collection(db, "messages"),
      where("receiver_uid", "==", adminUid),
      where("status", "==", "unread")
    );

    const unsubscribe = onSnapshot(messagesQuery, async (snapshot) => {
      const groupedNotifications = {};
      for (const doc of snapshot.docs) {
        const data = doc.data();
        const senderUid = data.sender_uid;

        if (!groupedNotifications[senderUid]) {
          // Fetch sender details only for the first message
          try {
            const senderQuery = query(
              collection(db, "users"),
              where("uid", "==", senderUid)
            );
            const senderSnapshot = await getDocs(senderQuery);
            const senderName = !senderSnapshot.empty
              ? senderSnapshot.docs[0].data().firstname +
                " " +
                senderSnapshot.docs[0].data().lastname
              : "Unknown User";
            groupedNotifications[senderUid] = {
              senderName,
              count: 1,
            };
          } catch (error) {
            console.error("Error fetching sender details:", error);
            groupedNotifications[senderUid] = {
              senderName: "Unknown User",
              count: 1,
            };
          }
        } else {
          groupedNotifications[senderUid].count += 1;
        }
      }

      // Convert grouped notifications to an array
      const notificationsArray = Object.keys(groupedNotifications).map((uid) => ({
        senderUid: uid,
        senderName: groupedNotifications[uid].senderName,
        count: groupedNotifications[uid].count,
      }));

      setNotifications(notificationsArray);
      setUnreadCount(notificationsArray.reduce((total, item) => total + item.count, 0));
    });

    return () => unsubscribe();
  }, [adminUid]);

  // Notifications dropdown menu
  const notificationMenu = (
    <Menu>
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <Menu.Item key={notification.senderUid}>
            <span>
              {notification.count} unread message
              {notification.count > 1 ? "s" : ""} from <strong>{notification.senderName}</strong>
            </span>
          </Menu.Item>
        ))
      ) : (
        <Menu.Item key="no-notifications">No new notifications</Menu.Item>
      )}
    </Menu>
  );

  // Logout function
  const handleLogout = async () => {
    try {
      await auth.signOut(); // Firebase logout
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("adminUid");
      localStorage.removeItem("userName");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      message.error("Logout failed. Please try again.");
    }
  };

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
          <Badge count={unreadCount} offset={[-3, 10]}>
            <BellOutlined style={{ fontSize: "18px", cursor: "pointer" }} />
          </Badge>
        </Dropdown>

        {/* User Profile */}
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="profile" disabled>
                <UserOutlined /> {userName}
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
            <Text>{userName}</Text>
          </div>
        </Dropdown>
      </div>
    </Header>
  );
};

export default HeaderBar;
