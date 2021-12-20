import useAuth from "../hooks/useAuth";

export default function ChatMessage(props) {
  const { auth } = useAuth();
  const { text, uid, createdAt, name, userCode } = props.message;
  const messageClass = uid === auth.currentUser.uid ? "sent" : "recieved";
  return (
    <div className={`message ${messageClass}`}>
      <p className="message-user">
        <b>{name}</b> #{userCode}
      </p>
      <p className="message-text">{text}</p>
      {createdAt?.toDate() && (
        <time>{new Date(createdAt?.toDate()).toLocaleTimeString("en-US")}</time>
      )}
    </div>
  );
}
