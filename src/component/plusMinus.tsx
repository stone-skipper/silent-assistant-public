import { motion } from "framer-motion";

export default function PlusMinus({
  onPlus,
  onMinus,
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
        fontSize: 20,
        gap: 2,
      }}
    >
      <motion.div
        onClick={onPlus}
        style={{
          padding: 10,
          background: btnColor,
          color: "white",
          width: 40,
          height: 40,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          userSelect: "none",
        }}
        whileHover={{ background: btnHoverColor }}
      >
        +
      </motion.div>
      <motion.div
        onClick={onMinus}
        style={{
          padding: 10,
          background: btnColor,
          color: "white",
          width: 40,
          height: 40,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          userSelect: "none",
        }}
        whileHover={{ background: btnHoverColor }}
      >
        -
      </motion.div>
    </motion.div>
  );
}
