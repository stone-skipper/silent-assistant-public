import { useState, useEffect } from "react";
import Link from "next/link";
import {
  motion,
  useTime,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { TextHover } from "./textAnim";

export default function Title({
  from,
  to,
  status = "default",
  desc = "",
  onClickFrom,
  onClickTo,
  animate = false,
}) {
  const [degree, setDegree] = useState(0);
  const [windowSize, setWindowSize] = useState([0, 0]);
  const time = useTime();
  const rotate = useTransform(
    time,
    [0, 100000], // For every 10 seconds...
    [0, 180], // ...rotate 360deg
    { clamp: false }
  );
  useMotionValueEvent(rotate, "change", (latest) => {
    // console.log("rotate changed to", Math.sin(latest));
    setDegree(latest);
  });

  useEffect(() => {
    setWindowSize([window.innerWidth, window.innerHeight]);
  }, []);

  const Highlight = () => {
    return (
      <motion.div
        style={{
          width: 16,
          height: 16,
          borderRadius: 15,
          background: "#8AF75E",
        }}
      ></motion.div>
    );
  };

  return (
    <motion.div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        background: "black",
        justifyContent: "center",
        alignItems: "center",
      }}
      initial={{ height: animate === true ? "100%" : "fit-content" }}
      animate={{ height: animate === true ? "fit-content" : "fit-content" }}
      transition={{
        duration: animate === true ? 0.3 : 0,
        delay: animate === true ? 3.5 : 0,
        type: "spring",
      }}
    >
      <motion.div
        style={{
          height: "100%",
          background: "transparent",
          fontSize: 50,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
        }}
        whileHover={{
          background: "#8AF75E",
        }}
      >
        <Link
          href={"/"}
          style={{
            width: "100%",
            height: "100%",
            padding: "0 10px",
            margin: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          *
        </Link>
      </motion.div>
      <div
        style={{
          width: "100%",
          height: "100%",
          padding: "10px 20px",
          background: "white",
          fontSize: 50,
          display: "flex",
          flexDirection: "row",
          textTransform: "uppercase",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 20,
          lineHeight: 1,
        }}
      >
        <span
          onClick={onClickFrom}
          style={{
            cursor: "pointer",
            display: "flex",
            flexDirection: "row",
            alignItems: "start",
          }}
        >
          <TextHover
            content={from}
            color="black"
            hoverColor="black"
            fontSize={50}
          />
          {status === "default" && <Highlight />}
          {/* {from} {status === "default" && <Highlight />} */}
        </span>
        {/* <div style={{ height: 4, width: "100%", background: "black" }}></div> */}
        <motion.svg
          height="60"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.5 }}
        >
          <motion.polyline
            style={{
              stroke: status === "progress" ? "#8AF75E" : "black",
              strokeWidth: 5,
              fill: "none",
            }}
            //   @ts-ignore
            points={
              status !== "progress"
                ? "0 30," +
                  Array.from({ length: 180 * 3 }, (value, key) => {
                    return (
                      key +
                      Math.tan(0) * 200 +
                      300 +
                      " " +
                      (-Math.sin((key / 30) * Math.PI) *
                        Math.tan(Math.sin(0)) *
                        Math.sin(0) *
                        15 +
                        30)
                    );
                  }) +
                  ", 1800 30"
                : "0 30," +
                  Array.from({ length: 180 * 3 }, (value, key) => {
                    return (
                      key +
                      Math.tan(degree) * 200 +
                      300 +
                      " " +
                      (-Math.sin((key / 30) * Math.PI) *
                        Math.tan(Math.sin(degree)) *
                        Math.sin(degree) *
                        15 +
                        30)
                    );
                  }) +
                  ", 1800 30"
            }
            transition={{ repeatType: "loop", repeat: Infinity }}
          />
        </motion.svg>
        <span
          onClick={onClickTo}
          style={{
            cursor: "pointer",
            display: "flex",
            flexDirection: "row",
            alignItems: "start",
          }}
        >
          <TextHover
            content={to}
            color="black"
            hoverColor="black"
            fontSize={50}
          />
          {status === "result" && <Highlight />}
        </span>
        {desc !== "" && (
          <div style={{ fontSize: 12, maxWidth: 300 }}>{desc}</div>
        )}
      </div>
    </motion.div>
  );
}
