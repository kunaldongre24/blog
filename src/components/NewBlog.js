import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import { Editor } from "react-draft-wysiwyg";
import { EditorState } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {
  ref,
  set,
  push,
  onValue,
  remove,
  update,
  query,
  equalTo,
  get,
  orderByChild,
} from "firebase/database";
import { useAuthState } from "react-firebase-hooks/auth";
import { db } from "../config/firebase";
import { authentication } from "../config/firebase";
import Loader from "../components/Loader";
import { NavLink } from "react-router-dom";

function EditorContainer() {
  const [user, loading, error] = useAuthState(authentication);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [username, setUsername] = useState("");
  const [uLoading, setULoading] = useState(false);
  const [sLoading, setSLoading] = useState(false);
  const [showUModal, setUModal] = useState(false);
  const [showSModal, setSModal] = useState(false);
  const [convertedContent, setConvertedContent] = useState();
  const handleEditorChange = (state) => {
    setEditorState(state);
    convertContentToHTML();
  };
  const fetchUser = async () => {
    const dbRef = ref(db, "users");
    const q = query(dbRef, orderByChild("id"), equalTo(user.uid));

    const snapshot = await get(q);
    if (snapshot.exists()) {
      const results = snapshot.val();
      const data = [];
      for (let id in results) {
        data.push({ id, ...results[id] });
      }
      setUsername(data[0].username);
    } else {
    }
  };
  useEffect(() => {
    fetchUser();
  }, [user]);
  const publishBlog = async () => {
    if (convertedContent.length > 10) {
      setULoading(true);
      const postListRef = ref(db, "posts");
      const newPostRef = push(postListRef);
      set(newPostRef, {
        user: username,
        blog: convertedContent,
        publish: true,
        created_on: Date.now(),
        last_update: Date.now(),
      });
      setUModal(true);
    }
  };
  const saveBlog = async () => {
    if (convertedContent.length > 10) {
      setSLoading(true);
      const postListRef = ref(db, "posts");
      const newPostRef = push(postListRef);
      set(newPostRef, {
        user: username,
        blog: convertedContent,
        publish: false,
        created_on: Date.now(),
        last_update: Date.now(),
      });
      setSModal(true);
    }
  };
  const convertContentToHTML = () => {
    let currentContentAsHTML = stateToHTML(editorState.getCurrentContent());
    setConvertedContent(currentContentAsHTML);
  };
  return (
    <div className="editor">
      {showUModal ? (
        <div className="modal">
          <div
            className="modal-container"
            style={{
              backgroundColor: "rgba(0,0,0,0.9)",
            }}
          >
            <div className="modal-body">
              <div
                className="heading"
                style={{ padding: 40, paddingLeft: 20, paddingRight: 20 }}
              >
                Blog has been published
              </div>
              <div className="btn-cnt">
                <NavLink to="/">Ok</NavLink>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {showSModal ? (
        <div className="modal">
          <div
            className="modal-container"
            style={{ backgroundColor: "rgba(0,0,0,0.9)" }}
          >
            <div className="modal-body">
              <div
                className="heading"
                style={{ padding: 15, paddingLeft: 20, paddingRight: 20 }}
              >
                Blog has been Saved
              </div>
              <div className="btn-cnt">
                <NavLink to="/">Ok</NavLink>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <Editor
        editorState={editorState}
        placeholder="Write your blog here..."
        editorState={editorState}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        toolbar={{
          inline: { inDropdown: true },
          list: { inDropdown: true },
          textAlign: { inDropdown: true },
          link: { inDropdown: true },
          history: { inDropdown: true },
        }}
        editorClassName="editorClassName"
        onEditorStateChange={handleEditorChange}
      />

      <div className="footer">
        <button
          onClick={() => saveBlog()}
          className="btn-cnt btn2"
          style={{ marginRight: 10, background: "#51AD4D" }}
        >
          {sLoading ? <Loader /> : "Save"}
        </button>
        <button className="btn-cnt btn2" onClick={() => publishBlog()}>
          {uLoading ? <Loader /> : "Publish"}
        </button>
      </div>
    </div>
  );
}

export default EditorContainer;
