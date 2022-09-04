import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BookIcon from "@mui/icons-material/Book";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import Person2Icon from "@mui/icons-material/Person2";
import { NavLink } from "react-router-dom";
import Activity from "../components/Activity";
import Recent from "../components/Recent";
import Popular from "../components/Popular";
import ProtectedRoute from "../components/ProtectedRoute";
import {
  ref,
  set,
  push,
  onValue,
  remove,
  update,
  query,
  orderByValue,
  equalTo,
  get,
  orderByChild,
} from "firebase/database";
import { db } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { authentication, logout } from "../config/firebase";
import Loader from "../components/Loader";
import NewBlog from "../components/NewBlog";

function Home() {
  const [user, loading, error] = useAuthState(authentication);
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState("");
  const [uLoading, setULoading] = useState(false);
  const fetchUser = async () => {
    const dbRef = ref(db, "users");
    const q = query(dbRef, orderByChild("id"), equalTo(user.uid));

    const snapshot = await get(q);
    if (snapshot.exists()) {
      const results = snapshot.val();
    } else {
      setShowModal(true);
    }
  };
  const uploadData = async () => {
    if (username.length) {
      setULoading(true);
      const postListRef = ref(db, "users");
      const newPostRef = push(postListRef);
      set(newPostRef, {
        id: user.uid,
        username: username.toLowerCase(),
        created_on: Date.now(),
        last_update: Date.now(),
      });
      setShowModal(false);
      setULoading(false);
    }
  };
  useEffect(() => {
    fetchUser();
  }, [user]);
  return (
    <div>
      {showModal ? (
        <div className="modal">
          <div className="modal-container">
            <div className="modal-body">
              <div
                className="heading"
                style={{ padding: 15, paddingLeft: 20, paddingRight: 20 }}
              >
                Create Username
              </div>
              <div className="form-body">
                <div
                  className="body"
                  style={{ borderBottom: "1px solid #eaeaea" }}
                >
                  <input
                    placeholder="New Username"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="btn-cnt">
                  <button onClick={() => uploadData()}>
                    {uLoading ? <Loader /> : "Submit"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <header>
        <img src={require("../images/logo.png")} />
        <button className="logout" onClick={() => logout()}>
          Logout
        </button>
      </header>
      <div className="pd-24">
        <div className="content">
          <Routes>
            <Route
              exact
              path=""
              element={
                <ProtectedRoute>
                  <Activity />
                </ProtectedRoute>
              }
            />

            <Route
              path="newblog"
              element={
                <ProtectedRoute>
                  <NewBlog />
                </ProtectedRoute>
              }
            />
            <Route
              path="recent"
              element={
                <ProtectedRoute>
                  <Recent />
                </ProtectedRoute>
              }
            />
            <Route
              path="popular"
              element={
                <ProtectedRoute>
                  <Popular />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
        <div className="sidebar">
          <div className="sidebar-header">
            <input className="search" placeholder="Search" />
          </div>

          <div className="btn-list">
            <NavLink to="" className="btn-item">
              <NotificationsNoneIcon
                style={{ fontSize: 25, marginRight: 15 }}
              />
              <div>Activities</div>
            </NavLink>
            <NavLink to="recent" className="btn-item">
              <CollectionsBookmarkIcon
                style={{ fontSize: 25, marginRight: 15 }}
              />
              <div>Recent Blogs</div>
            </NavLink>
            <NavLink to="popular" className="btn-item">
              <TrendingUpIcon style={{ fontSize: 25, marginRight: 15 }} />
              <div>Popular Blogs</div>
            </NavLink>
            <NavLink to="profile" className="btn-item">
              <Person2Icon style={{ fontSize: 25, marginRight: 15 }} />
              <div>Your Profile</div>
            </NavLink>
          </div>
          <div className="sidebar-h">
            <button>
              <BookIcon style={{ fontSize: 18 }} />
              <NavLink to="newblog">
                <div>New</div>
              </NavLink>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
