import jwt from "jsonwebtoken";
import Veterinario from "../models/Veterinario.js";

const checkAuth = async (request, response, next) => {

    // console.log('Checking desde mi middleware');
    let token;
    if (request.headers.authorization && request.headers.authorization.startsWith('Bearer')) {

        try {

            token = request.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            request.veterinario = await Veterinario.findById(decoded.id).select("-password -token -confirmado");

            return next();
        } catch (e) {
            e = new Error('Token no valido');
            return response.status(403).json({ msg: e.message });
        }

    }

    if (!token) {
        const error = new Error('Token no valido o inexistente');
        response.status(403).json({ msg: error.message });
    }
    next();

};

export default checkAuth;