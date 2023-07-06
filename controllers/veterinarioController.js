import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

const registrar = async (request, response) => {

    const { nombre, password, email } = request.body;

    console.log('registrar usuario');
    //prevenir usuarios registrados
    const existeUsuario = await Veterinario.findOne({ email });

    if (existeUsuario) {
        const error = new Error('Usuario ya registrado!');
        return response.status(400).json({ msg: error.message });
    }

    try {
        //Guardar nueno veterinario

        const veterinario = new Veterinario(request.body);
        const veterinarioGuardado = await veterinario.save();

        //Enviar email
        emailRegistro({
            nombre,
            email,
            token: veterinarioGuardado.token
        });

        response.json(veterinarioGuardado);
    } catch (error) {
        console.log(error);
    }

};

const perfil = (request, response) => {
    const { veterinario } = request;
    response.json( veterinario );
};

const confirmar = async (request, response) => {
    const { token } = request.params;

    const usuarioConfirmar = await Veterinario.findOne({ token });

    if (!usuarioConfirmar) {
        const error = new Error('Token no valido!');
        return response.status(404).json({ msg: error.message });
    }

    try {
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save();

        response.json({ msg: 'Usuario confirmado Correctamente!' });
    } catch (error) {
        console.log(error);
    }
};


const autenticar = async (request, response) => {
    const { email, confirmado, password } = request.body;

    //Comprobar si el usuario existe
    const existeUsuario = await Veterinario.findOne({ email });
    if (!existeUsuario) {
        const error = new Error('El usuario no existe!');
        return response.status(403).json({ msg: error.message });
    }

    // Comprobar si el usuario esta confirmado
    if (!existeUsuario.confirmado) {
        const error = new Error('Tu cuenta no esta confirmada!');
        return response.status(403).json({ msg: error.message });
    }

    //Autenticar el password
    if (await existeUsuario.comprobarPassword(password)) {
        //Autenticar el password
        response.json({
            _id: existeUsuario._id,
            nombre: existeUsuario.nombre,
            email: existeUsuario.email,
            telefono: existeUsuario.telefono,
            web: existeUsuario.web,
            token: generarJWT(existeUsuario.id),
        });
    } else {
        const error = new Error('Contraseña incorrecta!');
        return response.status(403).json({ msg: error.message });

    }

};

const olvidePassword = async (request, response) => {
    const { email } = request.body;
    const existeVeterinario = await Veterinario.findOne({ email });
    console.log(existeVeterinario);

    if (!existeVeterinario) {
        const error = new Error('El usuario no existe');
        return response.status(400).json({ msg: error.message });
    }

    try {
        existeVeterinario.token = generarId();
        await existeVeterinario.save();
        
        //Enviar email con instrucciones
        emailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token
        });

        response.json({ msg: 'Hemos enviado un email con las instrucciones' });
        
    } catch (error) {
        console.log(error);
    }

};

const comprobarToken = async (request, response) => {
    const {token} = request.params;
    
    const tokenValido = await Veterinario.findOne({ token });

    if (tokenValido) {
        //Token valido
        response.json({ msg: 'Token valido. El usuario existe' });
    } else {
        const error = new Error('Token no valido!');
        return response.status(404).json({ msg: error.message });
    }

};

const nuevoPassword = async (request, response) => {
    const {token} = request.params;
    const {password} = request.body;

    const veterinario = await Veterinario.findOne({ token });

    if (!veterinario) {
        const error = new Error('Hubo un error!');
        return response.status(400).json({ msg: error.message });
    }

    try {
        veterinario.token = null;
        veterinario.password = password;
        await veterinario.save();
        response.json({ msg: 'Contraseña actualizada correctamente' });
    } catch (error) {
        console.log(error);
    }


};

const actualizarPerfil = async (request, response) => {
    const veterinario = await Veterinario.findById(request.params.id);

    if (!veterinario) {
        const error = new Error('Hubo un error!');
        return response.status(400).json({ msg: error.message });
    }

    const {email} = request.body;
    if (veterinario.email !== request.body.email) {
        const existeEmail = await Veterinario.findOne({email});
        if (existeEmail) {
            const error = new Error('El email ya existe');
            return response.status(400).json({ msg: error.message });
        }
    }

    try {
        veterinario.nombre = request.body.nombre;
        veterinario.email = request.body.email;
        veterinario.web = request.body.web;
        veterinario.telefono = request.body.telefono;

        const veterinarioActualizado = await veterinario.save();
        response.json(veterinarioActualizado);

    } catch (error) {
        console.log(error);
    }

}; 

const actualizarPassword = async (request, response) => {
    //Leer datos
    const {id} = request.veterinario;
    const {pwd_actual, pwd_nuevo} = request.body;

    //Comprobar que el veterinario exista
    const veterinario = await Veterinario.findById(id);
    if (!veterinario) {
        const error = new Error('Hubo un error!');
        return response.status(400).json({ msg: error.message });
    }

    //Comprobar su password
    if (await veterinario.comprobarPassword(pwd_actual)) {
        
        //Almacenar el nuevo password
        veterinario.password = pwd_nuevo;
        await veterinario.save();
        response.json({ msg: 'Contraseña actualizada correctamente' });

    } else {
        const error = new Error('El Password Actual es Incorrecto!');
        return response.status(400).json({ msg: error.message });
    }

    
};

export {
    registrar, perfil, confirmar, autenticar, olvidePassword, comprobarToken, nuevoPassword, actualizarPerfil, actualizarPassword
}