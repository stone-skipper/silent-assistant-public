import { motion } from "framer-motion";
export default function SettingPanel({ children, toggleC }) {
  return (
    <motion.div
      style={{
        height: "calc(100% - 80px)",
        width: "30vw",
        flexDirection: "column",
        position: "fixed",
        right: 0,
        top: 0,
        background: "#222222",
        color: "white",
      }}
      initial={{ x: "30vw" }}
      animate={{ x: toggleC === true ? 0 : "30vw" }}
      transition={{ duration: 0.4 }}
    >
      {/* control panel */}

      <div
        style={{
          height: "100%",
          width: "100%",
          padding: 30,
          display: "flex",
          gap: 20,
          flexDirection: "column",
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}
