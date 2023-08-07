import { motion } from "framer-motion";
import { House, Info, Lightbulb } from "phosphor-react";
import Link from "next/link";
import { useState } from "react";

export default function Nav({ title, desc, question = [], feedback = "" }) {
  const [infoHover, setInfoHover] = useState(true);
  return (
    <motion.div
      style={{
        padding: 20,
        display: "flex",
        gap: 10,
        flexDirection: "row",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 50,
        width: "fit-content",
        height: "fit-content",
      }}
    >
      <div
        style={{
          width: "100vw",
          height: "100vh",
          background: "rgba(0,0,0,0.4)",
          position: "fixed",
          left: 0,
          top: 0,
          zIndex: 55,
          display: infoHover === true ? "flex" : "none",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "40vw",
            background: "white",
            borderRadius: 20,
            padding: 20,
            whiteSpace: "pre-wrap",
          }}
        >
          <span
            style={{
              fontWeight: "bold",
              textTransform: "capitalize",
              marginBottom: 10,
            }}
          >
            {title}
          </span>
          <br />
          {desc}
          <br />
          {question.length !== 0 &&
            question.map((info, index) => {
              return (
                <p style={{ fontSize: "0.9em", color: "#105bfb" }} key={index}>
                  - {info}
                </p>
              );
            })}
          {question.length !== 0 && <br />}
          <div
            style={{
              width: "100%",
              padding: 14,
              background: "rgb(16, 91, 251)",
              borderRadius: 5,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              cursor: "pointer",
            }}
            onClick={() => {
              setInfoHover(false);
            }}
          >
            Okie
          </div>
        </div>
      </div>
      <Link href="/">
        <motion.div
          style={{
            width: "fit-content",
            height: "fit-content",
            background: "white",
            borderRadius: 200,
            padding: 15,
            cursor: "pointer",
          }}
          whileHover={{ background: "#C8D9FF" }}
        >
          <House color="black" size={24} weight="bold" />
        </motion.div>
      </Link>
      <div
        style={{
          width: "fit-content",
          height: "fit-content",
          background: "white",
          borderRadius: 200,
          padding: 15,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        {title}
        <motion.div
          style={{ cursor: "pointer" }}
          initial={{ opacity: 0.4 }}
          whileHover={{ opacity: 1 }}
          onClick={() => {
            setInfoHover(true);
          }}
        >
          <Info size={18} weight="bold"></Info>
        </motion.div>
      </div>
      <Link href={feedback} target="_blank">
        <motion.div
          style={{
            width: "fit-content",
            height: "fit-content",
            background: "white",
            borderRadius: 200,
            padding: 15,
            cursor: "pointer",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
          whileHover={{ background: "#C8D9FF" }}
        >
          <Lightbulb color="black" size={24} weight="bold" />
          Feedback
        </motion.div>
      </Link>
    </motion.div>
  );
}
