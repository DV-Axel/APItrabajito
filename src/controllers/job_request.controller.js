import { prisma } from "../data/prisma.js";


export const createJobRequest = async (req, res) => {
    try {
        console.log(req.body); // Muestra los datos en consola

        /*datos a guardar en COLUMNAS
        *
        * serviceKey
        * titulo
        * urgencia
        * fecha(la que se solicita el servicio)
        * fechaDeCreacionServicio(la fecha en la que se crea el servicio)
        * descripcion
        * address(fijate de guardar en json o parsealo como quede bien)
        * tipoPropiedad
        * piso
        * numeroDepto
        * position(esto en json, quiza nos sirva para implemetnar algo de geolocalizacion)
        * photos(creo que un json vas a poder guardar bien macheado name y notas de cada una).
        *
        *
        * LOS DEMAS DATOS QUE FALTAN SON EXTRADATA, GUARDALO EN JSON
        *
        * */


        res.status(200).json({ message: "Datos recibidos" });
    } catch (error) {
        res.status(500).json({ error: "Imposible crear JobRequest" });
    }
};




// Obtener todos los JobRequests
export const getAllJobRequests = async (req, res) => {
    try {
        const jobRequests = await prisma.jobRequest.findMany({
            include: { user: true }
        });
        res.json(jobRequests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un JobRequest por ID
export const getJobRequestById = async (req, res) => {
    try {
        const { id } = req.params;
        const jobRequest = await prisma.jobRequest.findUnique({
            where: { id: Number(id) },
            include: { user: true }
        });
        if (!jobRequest) {
            return res.status(404).json({ error: 'JobRequest no encontrado' });
        }
        res.json(jobRequest);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};