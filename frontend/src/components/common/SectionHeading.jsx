import { motion } from "framer-motion";
import Badge from "./Badge";

export default function SectionHeading({ eyebrow, title, description, align = "left" }) {
  const textAlign = align === "center" ? "text-center" : "text-left";
  const itemsAlign = align === "center" ? "items-center" : "items-start";

  return (
    <motion.div
      className={`flex flex-col gap-4 ${itemsAlign} ${textAlign}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      {eyebrow ? <Badge tone="teal">{eyebrow}</Badge> : null}
      <h2 className="font-display max-w-3xl text-4xl leading-tight text-slate-950 sm:text-5xl">
        {title}
      </h2>
      {description ? <p className="max-w-2xl text-base leading-8 text-slate-600">{description}</p> : null}
    </motion.div>
  );
}
