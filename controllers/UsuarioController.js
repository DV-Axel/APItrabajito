import Usuario from '../models/Usuario.js';

export async function getUsuarios(req,res) {
    try{
        const usuarios = await  Usuario.getUsuarios();
        res.status(200).json(usuarios);
    }catch(error){
        res.status(500).json({'error': 'Error al obtener los usuarios'});
    }
}

export async function getUsuarioId(req,res){

    const id = req.params.id;

    try{
        const usuario = {'axel': 'hola'};
        res.status(200).json(usuario);
    }catch(error){
        res.status(500).json({'error': 'Error al obtener el usuario mediante el ID'});
    }
}

export async function getUsuarioLogin(req, res) {
    const { email, password } = req.body;
    console.log("entro");
    console.log(req.body);
    console.log(email);
    console.log(password);

    res.status(200).json({
        message: "Login recibido correctamente",
        emailRecibido: email
    });
}