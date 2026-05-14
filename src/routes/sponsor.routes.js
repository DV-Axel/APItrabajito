import {Router} from 'express';
import {
    registrarSponsor,
    loginSponsor,
    reenviarConfirmacion,
    confirmarCuenta,
    contraseñaOlvidada,
    cambiarContrasenia,
    extraerDatosSponsor,
    perfilSponsor,
    actualizarPerfilSponsor,
    busquedaSponsorPorIdentificacion,
    pendientesSponsoreo,
    datosHeaderSponsor,
    decisionSponsoreo,
    perfilWorker
} from '../controllers/sponsor.controller.js';
import {uploadSponsorFiles} from '../middlewares/files/uploadSponsorFiles.js';

export const sponsorRouter = Router();


//Rutas auth de sponsor
sponsorRouter.post('/registrar-sponsor', uploadSponsorFiles, registrarSponsor);
sponsorRouter.post('/reenviar-confirmacion', reenviarConfirmacion);
sponsorRouter.get('/confirmar-cuenta', confirmarCuenta)
sponsorRouter.post('/contrasenia-olvidada', contraseñaOlvidada)
sponsorRouter.post('/cambiar-contrasenia', cambiarContrasenia)
sponsorRouter.post('/login-sponsor', loginSponsor)
sponsorRouter.get('/buscar-sponsor-por-identificacion', busquedaSponsorPorIdentificacion)
sponsorRouter.get('/pendientes-sponsoreo/:id', pendientesSponsoreo)
sponsorRouter.get('/datos-header-sponsor/:id', datosHeaderSponsor)
sponsorRouter.patch('/decidir-solicitud-sponsoreo/:id', decisionSponsoreo)
sponsorRouter.get('/perfil-worker/:id', perfilWorker)

//Cookie
sponsorRouter.get('/me', extraerDatosSponsor)

sponsorRouter.get('/obtener-sponsor/:id', perfilSponsor)
sponsorRouter.put('/actualizar-perfil-sponsor/:id', uploadSponsorFiles, actualizarPerfilSponsor)
export default sponsorRouter