import React, { useEffect, useRef, useState } from "react";
import {
  query,
  orderBy,
  collection,
  limit,
  serverTimestamp,
  addDoc,
  doc,
} from "firebase/firestore";
import {
  useCollection,
  useCollectionDataOnce,
} from "react-firebase-hooks/firestore";
import useAuth from "../hooks/useAuth";
import ChatMessage from "./ChatMessage";

export default function ChatRoom() {
  const { db, user, name, userCode, error } = useAuth();
  const bottomOfChat = useRef();
  const textAreaRef = useRef();
  const [formValue, setFormValue] = useState("");
  const [disabled, setDisabled] = useState(false); // prevent spam messages
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [allMessages, setAllMessages] = useState([]);
  const [messagesRef] = useState(collection(db, "messages"));
  const [q] = useState(
    query(messagesRef, orderBy("createdAt", "desc"), limit(1))
  );
  const [qInitial] = useState(
    query(messagesRef, orderBy("createdAt", "desc"), limit(20))
  );
  const [messageSnapshot] = useCollection(q, { idField: "id" });
  const [initialMessages] = useCollectionDataOnce(qInitial, { idField: "id" });

  // initial load
  useEffect(() => {
    if (!initialMessages) return;
    setAllMessages(initialMessages.reverse());
    setInitialLoaded(true);

    // eslint-disable-next-line
  }, [initialMessages]);

  // each new message
  useEffect(() => {
    if (!messageSnapshot || !initialLoaded) return;

    messageSnapshot.forEach((doc) => {
      if (!doc.metadata.hasPendingWrites) {
        setAllMessages((prev) => [...prev, doc.data()]);
      }
    });
    if (allMessages.length >= 60) setAllMessages((prev) => prev.slice(1));

    // eslint-disable-next-line
  }, [messageSnapshot]);

  // scroll whenever new message appears
  useEffect(() => {
    bottomOfChat.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [allMessages]);

  const sendMessage = async (e) => {
    textAreaRef.current.focus();
    e?.preventDefault();
    if (formValue === "" || null) return;
    setDisabled(true);
    const { uid } = user;
    await addDoc(messagesRef, {
      id: doc(messagesRef).id,
      uid,
      text: formValue,
      createdAt: serverTimestamp(),
      name,
      userCode,
    });
    setFormValue("");
    setTimeout(async () => setDisabled(false), 2000);
  };

  const submitOnEnter = (event) => {
    if (event.which === 13 && !event.shiftKey) {
      event.preventDefault();
      if (!disabled) sendMessage();
    }
  };

  if (error)
    return <h1 style={{ color: "white" }}>Sorry, something went wrong :(</h1>;

  return (
    <>
      <main>
        {allMessages &&
          allMessages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
        <div ref={bottomOfChat} className="bottom-of-chat"></div>
      </main>

      <form onSubmit={sendMessage}>
        <textarea
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          onKeyPress={submitOnEnter}
          placeholder="say something nice"
          ref={textAreaRef}
        />
        <button type="submit" disabled={formValue === "" || disabled}>
          Send
        </button>
      </form>
    </>
  );
}
