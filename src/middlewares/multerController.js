import multer from "multer";

const storage = multer.memoryStorage(); // Armazena a imagem em memória
const upload = multer({ storage: storage });

export { upload };
