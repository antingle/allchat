import React from "react";
import "../css/welcome.css";
import { ReactComponent as NiceSvg } from "../svg/nice.svg";
import { ReactComponent as AnonymousSvg } from "../svg/anonymous.svg";
import useAuth from "../hooks/useAuth";

export default function WelcomeScreen() {
  const { setShowWelcome } = useAuth();
  return (
    <div className="flex container">
      <h1 className="welcome">
        Welcome to
        <span className="colored"> /allchat</span>
      </h1>
      <div className="flex flex-item">
        <AnonymousSvg className="svg" />
        <p className="text">Everyone is anonymous!</p>
      </div>
      <div className="flex flex-item">
        <NiceSvg className="svg" />
        <p className="text">Please be nice and respectful</p>
      </div>
      <button className="welcome-button" onClick={() => setShowWelcome(false)}>
        Let's Go
      </button>
    </div>
  );
}
