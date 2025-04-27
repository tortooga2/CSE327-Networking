import React from "react";
import { motion } from "framer-motion";

function Animated() {
    return (
        <motion.div
            intial = {{ opacity: 0 }}
            animate = {{ opacity: 1 }}
            transition = {{ duration: 1 }}
        >
            <h1>Here is the animation!</h1>
        </motion.div>
    );
}

export default Animated;