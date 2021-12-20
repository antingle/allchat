import React, { useEffect, useRef, useState } from "react";
import {
  query,
  orderBy,
  collection,
  limit,
  serverTimestamp,
  addDoc,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import useAuth from "../hooks/useAuth";
import ChatMessage from "./ChatMessage";

export default function ChatRoom() {
  const { db, auth, name, userCode, error } = useAuth();
  const bottomOfChat = useRef();
  const [formValue, setFormValue] = useState("");
  const [disabled, setDisabled] = useState(false); // prevent spam messages

  const [messagesRef] = useState(collection(db, "messages"));
  const [q] = useState(
    query(messagesRef, orderBy("createdAt", "desc"), limit(30))
  );
  const [messages] = useCollectionData(q, { idField: "id" });

  useEffect(() => {
    bottomOfChat.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e?.preventDefault();
    if (formValue === "" || null) return;
    setDisabled(true);
    const { uid } = auth.currentUser;
    await addDoc(collection(db, "messages"), {
      text: formValue,
      createdAt: serverTimestamp(),
      uid,
      name,
      userCode,
    });
    setFormValue("");
    setTimeout(async () => setDisabled(false), 2000);
  };

  const submitOnEnter = (event) => {
    if (event.which === 13 && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  if (error)
    return <h1 style={{ color: "white" }}>Sorry, an error has occurred :(</h1>;

  return (
    <>
      <main>
        {messages &&
          messages
            .reverse()
            .map((msg) => <ChatMessage key={msg.id} message={msg} />)}
        <div ref={bottomOfChat}></div>
      </main>

      <form onSubmit={sendMessage}>
        <textarea
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          onKeyPress={submitOnEnter}
          placeholder="say something nice"
        />
        <button type="submit" disabled={formValue === "" || disabled}>
          Send
        </button>
      </form>
    </>
  );
}
