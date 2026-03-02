import { motion } from "framer-motion"
import error from "../assets/error.jpg"

export const ErrorPage = () => {
    return (
        <motion.div
            className="w-full h-screen p-8 md:p-16 lg:p-24 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div
                className="w-full h-full max-w-4xl max-h-4xl mx-auto"
                style={{
                    backgroundImage: `url(${error})`,
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            />
        </motion.div>
    )
}