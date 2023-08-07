import Image from "next/image";
import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function TextLink({ title, link }) {
  return (
    <motion.span
      style={{
        borderBottom: "2px solid black",
      }}
      whileHover={{ color: "#8AF75E", y: -10 }}
    >
      <Link href={link}>{title} ↗</Link>
    </motion.span>
  );
}
