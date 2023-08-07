import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ProjectLink({
  index,
  title,
  link,
  defaultColor = "white",
  hoverColor = "#8AF75E",
  newtab = false,
  shape = "vertical",
}) {
  const [hover, setHover] = useState(false);
  return (
    <Link href={link} target={newtab === true ? "_blank" : null}>
      <motion.div
        style={{
          textTransform: "uppercase",
          width: shape === "vertical" ? 200 : 415,
          height: shape === "vertical" ? 200 : 120,
          padding: 20,
          background: defaultColor,
          fontSize: 20,
          lineHeight: 1,
          display: "flex",
          alignItems: "flex-end",
          whiteSpace: "pre-line",
          color: "black",
          fontWeight: 400,
          borderRadius: 10,
          position: "relative",
        }}
        onMouseLeave={() => {
          setHover(false);
        }}
        onMouseOver={() => {
          setHover(true);
        }}
        whileHover={{ color: "white", background: hoverColor, y: -10 }}
      >
        <div
          style={{
            position: "absolute",
            top: 15,
            right: 15,
            borderRadius: 200,
            background: defaultColor,
            color: hoverColor,
            display: hover === true ? "flex" : "none",
            justifyContent: "center",
            alignItems: "center",
            width: 30,
            height: 30,
            transform: "rotate(-45deg)",
          }}
        >
          →
        </div>
        {index}
        <br />
        {title}
      </motion.div>
    </Link>
  );
}
