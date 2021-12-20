import React, { useEffect, useState } from "react";
import scrollPolyfill from "scroll-polyfill";
import useAuth from "./hooks/useAuth";
import ChatRoom from "./components/ChatRoom";
import "./css/App.css";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection, limit, query } from "firebase/firestore";

function App() {
  const { auth, db } = useAuth();
  const [newUser] = useCollectionData(query(collection(db, "users"), limit(1)));
  const [announcement, setAnnouncement] = useState(false);

  useEffect(() => {
    scrollPolyfill();
  }, []);

  useEffect(() => {
    console.log(newUser);
    setAnnouncement(true);
    setTimeout(() => setAnnouncement(false), 5000);
  }, [newUser]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>/allchat</h1>
        {newUser && announcement && (
          <div className="new-user-announcement">
            {newUser[0].name} just joined for the first time!
          </div>
        )}
      </header>
      <section>{auth && <ChatRoom />}</section>
    </div>
  );
}

export default App;
