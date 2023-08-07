import { useState, useEffect } from "react";
import {
  motion,
  useTime,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";

export default function Line({ status = "default", color = "black" }) {
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

  return (
    <motion.div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          padding: "10px 20px",
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
        <motion.svg
          height="60"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.5 }}
        >
          <motion.polyline
            style={{
              //   stroke: status === "progress" ? "#8AF75E" : "black",
              stroke: color,
              strokeWidth: 2,
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
      </div>
    </motion.div>
  );
}
