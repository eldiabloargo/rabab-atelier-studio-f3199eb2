import { motion } from "framer-motion";

export const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full"
      />
      <p className="text-sm text-muted-foreground font-sans tracking-wider">Rabab Atelier</p>
    </div>
  );
};
