// components/LetterModal.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LetterModal() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Botón "Ábreme" */}
      <button
        onClick={toggleModal}
        className="absolute top-4 left-4 z-50 bg-purple-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105"
      >
        Ábreme 💌
      </button>

      {/* Modal de la Carta */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4"
            onClick={toggleModal} // Cierra el modal al hacer clic fuera
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotateX: 90 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotateX: 90 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="bg-white p-8 rounded-3xl shadow-2xl max-w-lg w-full transform -rotate-1 perspective-1000"
              onClick={(e) => e.stopPropagation()} // Evita que se cierre al hacer clic dentro
              style={{
                fontFamily: "'Cursive', sans-serif", // Fuente más apropiada para una carta
                lineHeight: "1.8",
                color: "#333",
                backgroundImage: "url(/images/papel-antiguo.jpg)", // Puedes crear una imagen de papel antiguo
                backgroundSize: "cover",
                backgroundBlendMode: "multiply",
                backgroundColor: "#fdfbe7", // Tono de papel claro
              }}
            >
              <h2 className="text-3xl font-extrabold text-center text-red-500 mb-6 drop-shadow-sm">
                ¡Feliz Cumpleaños mi Amor!
              </h2>
              <p className="text-xl mb-4 text-justify indent-8">
                Feliz cumpleaños mi amor, expresarte lo bonito que me haces
                sentir me tomaría mucho tiempo porque conocerte fue una de las
                coincidencias más bonitas y grandes que la vida me permite
                vivir. Agradezco a Dios por tu vida, por poder estar junto a ti
                un año más y seguir viviendo nuevas experiencias a tu lado.
              </p>
              <p className="text-xl mb-6 text-justify indent-8">
                ¡Feliz cumple! Desearte todo lo mejor del mundo porque te lo
                mereces y que tus deseítos de cumple se cumplan mi amor.
              </p>
              <p className="text-xl font-semibold text-right mt-8 text-pink-600">
                Te amo, Amor, te amo Emily, a ti y a cada una de tus facetas ❤️.
              </p>
              <p className="text-lg font-bold text-right mt-2 text-gray-700">
                Att: Jonatan
              </p>
              <button
                onClick={toggleModal}
                className="mt-8 block mx-auto bg-red-500 text-white font-bold py-2 px-6 rounded-full hover:bg-red-600 transition-colors"
              >
                Cerrar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
