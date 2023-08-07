import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function TranscriptionPanel({
  transcript,
  resetClick,
  toggleT,
  latestWords,
  fullConv,
}) {
  const [transcriptArray, setTranscriptArray] = useState([]);

  useEffect(() => {
    setTranscriptArray(transcript.split(" "));
  }, [transcript]);

  return (
    <motion.div
      style={{
        height: "calc(100% - 80px)",
        width: "40vw",
        flexDirection: "column",
        position: "fixed",
        right: 0,
        top: 0,
        background: "#105BFB",
        color: "white",
      }}
      initial={{ x: "40vw" }}
      animate={{ x: toggleT === true ? 0 : "40vw" }}
      transition={{ duration: 0.4 }}
    >
      {/* transcription panel */}

      <div
        style={{
          height: "100%",
          width: "100%",
          padding: 30,
          overflowY: "scroll",
        }}
      >
        Transcription
        <br />
        <span onClick={resetClick}>reset</span>{" "}
        <span style={{ opacity: 0.5 }}>
          (word count : {transcriptArray.length - 1})
        </span>{" "}
        <br /> <br />
        {transcriptArray.length - 1 !== 0 && (
          <div>
            {transcriptArray.map((item, index) => {
              return (
                <span
                  key={index}
                  style={{
                    fontSize: "0.9em",
                    background:
                      transcriptArray.length < latestWords ||
                      (transcriptArray.length > latestWords &&
                        index > transcriptArray.length - latestWords) ||
                      fullConv === true
                        ? "rgba(255,255,255,0.2)"
                        : "transparent",
                  }}
                >
                  {item}{" "}
                </span>
              );
            })}
            <br />
          </div>
        )}
      </div>
    </motion.div>
  );
}
