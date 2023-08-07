import { motion } from "framer-motion";

export default function Toggle({
  fullConv,
  onToggle,
  btnColor,
  btnHoverColor,
}) {
  return (
    <motion.div
      style={{
        width: "fit-content",
        height: "fit-content",
        display: "flex",
        flexDirection: "row",
        fontSize: 14,
        gap: 2,
      }}
    >
      <motion.div
        onClick={onToggle}
        style={{
          padding: 10,
          background: btnColor,
          color: "white",
          width: 120,
          height: 40,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          userSelect: "none",
          opacity: fullConv === false ? 1 : 0.4,
        }}
        whileHover={{ background: btnHoverColor }}
      >
        Latest part{" "}
      </motion.div>
      <motion.div
        onClick={onToggle}
        style={{
          padding: 10,
          background: btnColor,
          color: "white",
          width: 180,
          height: 40,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          userSelect: "none",
          opacity: fullConv === true ? 1 : 0.4,
        }}
        whileHover={{ background: btnHoverColor }}
      >
        Full conversation
      </motion.div>
    </motion.div>
  );
}
