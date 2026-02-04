'use client';

import { motion } from 'framer-motion';

const defaultVariants = {
  hidden: { opacity: 0, y: 12, filter: 'blur(12px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
};

export default function BlurFade({
  children,
  className = '',
  delay = 0,
  duration = 0.5,
  variants = defaultVariants,
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
