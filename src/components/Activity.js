import React, { useEffect, useState } from "react";
import { db } from "../config/firebase";
import parse from "html-react-parser";
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
import { authentication } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

function Activity() {
  const [user, loading, error] = useAuthState(authentication);
  const [username, setUsername] = useState("");
  const [posts, setPosts] = useState([]);
  const fetchLectures = () => {
    const lectureRef = ref(db, "posts");
    onValue(lectureRef, (snapshot) => {
      const data = snapshot.val();
      const posts = [];
      for (let id in data) {
        posts.push({ id, ...data[id] });
      }
      setPosts(posts);
    });
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
    fetchLectures();
  }, []);
  useEffect(() => {
    fetchUser();
  }, [user]);
  useEffect(() => {
    console.log(posts);
  }, [posts]);
  return (
    <div>
      <div className="heading">Activity</div>
      <div className="active-body">
        {posts.map((x) => (
          <div className="post">
            <div className="post-head">{x.id} created a blog</div>
            <div className="post-body">{parse(x.blog)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Activity;
