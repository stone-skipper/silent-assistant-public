import { useEffect } from "react";

import { motion } from "framer-motion";
import Line from "./line";

import { Microphone, PauseCircle, ChatCircleText, Gear } from "phosphor-react";

export default function Control({
  listening,
  toggleC,
  setToggleC,
  toggleT,
  setToggleT,
  clickToListen,
  clickToStop,
  status,
}) {
  useEffect(() => {
    if (listening === true) {
      clickToStop();
    }
  }, []);
  return (
    <div
      style={{
        width: "100%",
        height: 80,
        display: "flex",
        flexDirection: "row",
        gap: 0,
        whiteSpace: "nowrap",
        background: "#EBF1F6",
      }}
    >
      {/* control */}
      <motion.div
        style={{
          width: "fit-content",
          height: "100%",
          background: "#105BFB",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          gap: 10,
          padding: "0 20px",
          color: "white",
          cursor: "pointer",
        }}
        onClick={() => {
          if (listening === false) {
            clickToListen();
          } else {
            clickToStop();
          }
        }}
        whileHover={{ background: "#4883FF" }}
        transition={{ duration: 0.4 }}
      >
        {listening === false ? (
          <Microphone size={24} weight="bold" color="white" />
        ) : (
          <PauseCircle size={24} weight="bold" color="white" />
        )}
        {listening === true ? "Stop" : "Listen"}
      </motion.div>
      <Line status={status} color="#105BFB" />
      <motion.div
        style={{
          padding: "0 20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
          cursor: "pointer",
          userSelect: "none",
          background: "white",
          color: "#105BFB",
        }}
        whileHover={{ background: "#C8D9FF" }}
        transition={{ duration: 0.4 }}
        onClick={() => {
          setToggleT(!toggleT);
        }}
      >
        <ChatCircleText size={24} weight="bold" color="#105BFB" />
        Transcription
      </motion.div>
      <motion.div
        style={{
          padding: "0 20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
          cursor: "pointer",
          userSelect: "none",
          background: "black",
        }}
        whileHover={{ background: "#105BFB" }}
        transition={{ duration: 0.3 }}
        onClick={() => {
          setToggleC(!toggleC);
        }}
      >
        <Gear size={24} weight="bold" color="white" />
      </motion.div>
    </div>
  );
}
