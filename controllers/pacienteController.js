import Paciente from "../models/Paciente.js";

const agregarPaciente = async (request, response) => {
    
    const paciente = new Paciente(request.body);
    paciente.veterinario = request.veterinario._id;
    try {
        const pacienteAlmacenado = await paciente.save();
        response.json(pacienteAlmacenado);

    } catch (error) {
        console.log(error);
    }
};

const obtenerPacientes = async (request, response) => {
    const pacientes = await Paciente.find().where('veterinario').equals(request.veterinario);
    response.json(pacientes);
};

const obtenerPaciente = async (request, response) => {
    const { id } = request.params;
    const paciente = await Paciente.findById(id);
    
    if (!paciente) {
        return response.status(404).json( { msg: 'Paciente no encontrado' } );
    }

    if (paciente.veterinario._id.toString() !== request.veterinario._id.toString()) {
        return response.json( { msg: 'Accion no valida' } )
    }

    response.json(paciente);

};

const actualizarPaciente = async (request, response) => {
    const { id } = request.params;
    const paciente = await Paciente.findById(id);

    if (!paciente) {
        return response.status(404).json( { msg: 'Paciente no encontrado' } );
    }
    
    if (paciente.veterinario._id.toString() !== request.veterinario._id.toString()) {
        return response.json( { msg: 'Accion no valida' } )
    }

    //Actualizar paciente
    paciente.nombre = request.body.nombre || paciente.nombre;
    paciente.propietario = request.body.propietario || paciente.propietario;
    paciente.email = request.body.email || paciente.email;
    paciente.fecha = request.body.fecha || paciente.fecha;
    paciente.sintomas = request.body.sintomas || paciente.sintomas;

    // console.log('Hola desde actualizar');
    
    try {
        const pacienteActualizado = await paciente.save();
        response.json(pacienteActualizado);
        
    } catch (error) {
        console.log(error);
    }

};

const eliminarPaciente = async (request, response) => {
    const { id } = request.params;
    const paciente = await Paciente.findById(id);

    if (!paciente) {
        return response.status(404).json( { msg: 'Paciente no encontrado' } );
    }
    
    if (paciente.veterinario._id.toString() !== request.veterinario._id.toString()) {
        return response.json( { msg: 'Accion no valida' } )
    }

    try {
        await paciente.deleteOne();
        response.json({ msg: 'Paciente eliminado' });
    } catch (error) {
        console.log(error);
    }
};


export {
    agregarPaciente, obtenerPacientes, obtenerPaciente, actualizarPaciente, eliminarPaciente
};