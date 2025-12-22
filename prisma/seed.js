// prisma/seed.js
import { prisma } from "../src/data/prisma.js";

async function main() {
    // Estados
    const statuses = [
        { name: 'Buscando worker'},
        { name: 'En contacto'},
        { name: 'En progreso'},
        { name: 'Esperando calificacion'},
        { name: 'Finalizado'},
        { name: 'Cancelado'},
        { name: 'Esperando pago MercadoPago'}
    ];
    for (const status of statuses) {
        await prisma.status.upsert({
            where: { name: status.name },
            update: {},
            create: status,
        });
    }

    // Categorías
    const categories = [
        { name: "Aires Acondicionados", description: "Servicios de aire acondicionado" },
        { name: "Albañilería", description: "Trabajos de albañilería" },
        { name: "Carpintero", description: "Servicios de carpintería" },
        { name: "Cerrajería", description: "Servicios de cerrajería" },
        { name: "Cuidados Adultos", description: "Cuidado de adultos mayores" },
        { name: "Electricidad", description: "Servicios eléctricos" },
        { name: "Herrería", description: "Trabajos de herrería" },
        { name: "Jardinería", description: "Servicios de jardinería" },
        { name: "Limpieza", description: "Servicios de limpieza" },
        { name: "Logística", description: "Servicios de logística" },
        { name: "Mudanzas", description: "Servicios de mudanza" },
        { name: "Niñera", description: "Cuidado de niños" },
        { name: "Pintura", description: "Trabajos de pintura" },
        { name: "Plomería", description: "Servicios de plomería" },
        { name: "Tornería", description: "Trabajos de tornería" }
    ];
    const categoryMap = {};
    for (const category of categories) {
        const dbCategory = await prisma.category.upsert({
            where: { name: category.name },
            update: {},
            create: category,
        });
        categoryMap[category.name] = dbCategory.id;
    }

    // Sponsors
    const sponsors = [
        {
            tradeName: "Electricidad Sur",
            address: "Av. Corrientes 1234",
            phone: 1145678900,
            cuilId: 30712345678n,
            businessName: "Electricidad Sur S.A.",
            registeredAt: new Date("2022-03-15"),
            email: "contacto@electricsur.com",
            alternativeEmail: "soporte@electricsur.com",
            contactName: "Carlos Gómez",
            aditionalInformation: "Especialistas en instalaciones eléctricas residenciales y comerciales.",
            logo: "electricsur-logo.png",
            companyRegistration: "REG-2022-001",
            social: { instagram: "@electricsur", facebook: "fb.com/electricsur" },
            workingHours: { start: "08:00", end: "18:00" },
            workingDays: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"]
        },
        {
            tradeName: "Plomería Express",
            address: "Calle San Martín 456",
            phone: 1133344455,
            cuilId: 30598765432n,
            businessName: "Plomería Express S.R.L.",
            registeredAt: new Date("2023-01-10"),
            email: "info@plomeriaexpress.com",
            alternativeEmail: "ventas@plomeriaexpress.com",
            contactName: "María Fernández",
            aditionalInformation: "Servicio urgente de plomería en CABA y GBA.",
            logo: "plomeriaexpress-logo.png",
            companyRegistration: "REG-2023-002",
            social: { instagram: "@plomeriaexpress", facebook: "fb.com/plomeriaexpress" },
            workingHours: { start: "07:00", end: "20:00" },
            workingDays: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
        },
        {
            tradeName: "Jardines Verdes",
            address: "Av. Libertador 789",
            phone: 1122233344,
            cuilId: 30711223344n,
            businessName: "Jardines Verdes S.A.",
            registeredAt: new Date("2021-09-20"),
            email: "contacto@jardinesverdes.com",
            alternativeEmail: "info@jardinesverdes.com",
            contactName: "Lucía Martínez",
            aditionalInformation: "Mantenimiento y diseño de espacios verdes.",
            logo: "jardinesverdes-logo.png",
            companyRegistration: "REG-2021-003",
            social: { instagram: "@jardinesverdes", facebook: "fb.com/jardinesverdes" },
            workingHours: { start: "09:00", end: "17:00" },
            workingDays: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"]
        },
        {
            tradeName: "Mudanzas Rápidas",
            address: "Calle Rivadavia 321",
            phone: 1155566677,
            cuilId: 30555666778n,
            businessName: "Mudanzas Rápidas S.R.L.",
            registeredAt: new Date("2020-05-05"),
            email: "contacto@mudanzasrapidas.com",
            alternativeEmail: "ventas@mudanzasrapidas.com",
            contactName: "Pedro López",
            aditionalInformation: "Mudanzas y logística en todo el país.",
            logo: "mudanzasrapidas-logo.png",
            companyRegistration: "REG-2020-004",
            social: { instagram: "@mudanzasrapidas", facebook: "fb.com/mudanzasrapidas" },
            workingHours: { start: "08:00", end: "20:00" },
            workingDays: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
        },
        {
            tradeName: "Pinturas del Sur",
            address: "Av. Belgrano 654",
            phone: 1167788990,
            cuilId: 30766778899n,
            businessName: "Pinturas del Sur S.A.",
            registeredAt: new Date("2022-11-11"),
            email: "info@pinturasdelsur.com",
            alternativeEmail: "contacto@pinturasdelsur.com",
            contactName: "Sofía Ramírez",
            aditionalInformation: "Pintura de interiores y exteriores.",
            logo: "pinturasdelsur-logo.png",
            companyRegistration: "REG-2022-005",
            social: { instagram: "@pinturasdelsur", facebook: "fb.com/pinturasdelsur" },
            workingHours: { start: "08:30", end: "17:30" },
            workingDays: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"]
        }
    ];
    const sponsorMap = {};
    for (const sponsor of sponsors) {
        const dbSponsor = await prisma.sponsor.upsert({
            where: { cuilId: sponsor.cuilId },
            update: {},
            create: sponsor,
        });
        sponsorMap[sponsor.tradeName] = dbSponsor.id;
    }

    // Relacionar sponsors con categorías usando los IDs reales
    const sponsorCategories = [
        { sponsor: "Electricidad Sur", category: "Electricidad" },
        { sponsor: "Plomería Express", category: "Plomería" },
        { sponsor: "Jardines Verdes", category: "Jardinería" },
        { sponsor: "Mudanzas Rápidas", category: "Mudanzas" },
        { sponsor: "Pinturas del Sur", category: "Pintura" }
    ];
    for (const sc of sponsorCategories) {
        await prisma.sponsorCategory.upsert({
            where: {
                sponsorId_categoryId: {
                    sponsorId: sponsorMap[sc.sponsor],
                    categoryId: categoryMap[sc.category]
                }
            },
            update: {},
            create: {
                sponsorId: sponsorMap[sc.sponsor],
                categoryId: categoryMap[sc.category]
            }
        });
    }

    // javascript
// Crear payment methods (reemplaza el bloque actual en `prisma/seed.js`)
    const paymentMethods = [
        { name: "Efectivo" },
        { name: "MercadoPago" }
    ];
    const paymentMethodMap = {};
    for (const pm of paymentMethods) {
        let dbPm = await prisma.paymentMethod.findFirst({ where: { name: pm.name } });
        if (!dbPm) {
            dbPm = await prisma.paymentMethod.create({ data: pm });
        }
        paymentMethodMap[pm.name] = dbPm.id;
    }


    // Usuarios
    const users = [
        {
            firstName: "Axel",
            lastName: "Cichello",
            dni: "40143488",
            idType: "dni",
            email: "axel.cichello@davinci.edu.ar",
            birthDate: new Date("1997-07-29"),
            password: "$2b$10$eaoMcLQ4dCffjU.ELahzJusiDYMxdH7ihkk/7nSM.qD7XVZau3ddK",
            phone: 1139374061,
            registrationDate: new Date("2025-11-07"),
            isVerified: true,
            address: "Tuyuti",
            number: "2556",
            postalCode: "1822",
            departmentNumber: "1D",
            profilePicture: "/images/profilePicture/avatar.jpeg"
        },
        {
            firstName: "Lucía",
            lastName: "Martínez",
            dni: "40143489",
            idType: "dni",
            email: "lucia.martinez@dominiox.com",
            birthDate: new Date("1995-03-15"),
            password: "$2b$10$eaoMcLQ4dCffjU.ELahzJusiDYMxdH7ihkk/7nSM.qD7XVZau3ddK",
            phone: 1139374062,
            registrationDate: new Date("2025-11-08"),
            isVerified: true,
            address: "Belgrano",
            number: "1234",
            postalCode: "1001",
            departmentNumber: "2A",
            profilePicture: "/images/profilePicture/avatar.jpeg"
        },
        {
            firstName: "Juan",
            lastName: "Pérez",
            dni: "40143490",
            idType: "dni",
            email: "juan.perez@dominiox.com",
            birthDate: new Date("1992-06-21"),
            password: "$2b$10$eaoMcLQ4dCffjU.ELahzJusiDYMxdH7ihkk/7nSM.qD7XVZau3ddK",
            phone: 1139374063,
            registrationDate: new Date("2025-11-09"),
            isVerified: true,
            address: "Corrientes",
            number: "5678",
            postalCode: "1002",
            departmentNumber: "3B",
            profilePicture: "/images/profilePicture/avatar.jpeg"
        },
        {
            firstName: "María",
            lastName: "García",
            dni: "40143491",
            idType: "dni",
            email: "maria.garcia@dominiox.com",
            birthDate: new Date("1998-12-10"),
            password: "$2b$10$eaoMcLQ4dCffjU.ELahzJusiDYMxdH7ihkk/7nSM.qD7XVZau3ddK",
            phone: 1139374064,
            registrationDate: new Date("2025-11-10"),
            isVerified: true,
            address: "San Martín",
            number: "4321",
            postalCode: "1003",
            departmentNumber: "4C",
            profilePicture: "/images/profilePicture/avatar.jpeg"
        },
        {
            firstName: "Sofía",
            lastName: "Ramírez",
            dni: "40143492",
            idType: "dni",
            email: "sofia.ramirez@dominiox.com",
            birthDate: new Date("1996-09-05"),
            password: "$2b$10$eaoMcLQ4dCffjU.ELahzJusiDYMxdH7ihkk/7nSM.qD7XVZau3ddK",
            phone: 1139374065,
            registrationDate: new Date("2025-11-11"),
            isVerified: true,
            address: "Libertador",
            number: "8765",
            postalCode: "1004",
            departmentNumber: "5D",
            profilePicture: "/images/profilePicture/avatar.jpeg"
        },
        {
            firstName: "Pedro",
            lastName: "López",
            dni: "40143493",
            idType: "dni",
            email: "pedro.lopez@dominiox.com",
            birthDate: new Date("1993-11-30"),
            password: "$2b$10$eaoMcLQ4dCffjU.ELahzJusiDYMxdH7ihkk/7nSM.qD7XVZau3ddK",
            phone: 1139374066,
            registrationDate: new Date("2025-11-12"),
            isVerified: true,
            address: "Rivadavia",
            number: "6543",
            postalCode: "1005",
            departmentNumber: "6E",
            profilePicture: "/images/profilePicture/avatar.jpeg"
        },
        {
            firstName: "Carlos",
            lastName: "Gómez",
            dni: "40143494",
            idType: "dni",
            email: "carlos.gomez@dominiox.com",
            birthDate: new Date("1994-05-18"),
            password: "$2b$10$eaoMcLQ4dCffjU.ELahzJusiDYMxdH7ihkk/7nSM.qD7XVZau3ddK",
            phone: 1139374067,
            registrationDate: new Date("2025-11-13"),
            isVerified: true,
            address: "Mitre",
            number: "7890",
            postalCode: "1006",
            departmentNumber: "7F",
            profilePicture: "/images/profilePicture/avatar.jpeg"
        },
        {
            firstName: "Ana",
            lastName: "Fernández",
            dni: "40143495",
            idType: "dni",
            email: "ana.fernandez@dominiox.com",
            birthDate: new Date("1999-02-22"),
            password: "$2b$10$eaoMcLQ4dCffjU.ELahzJusiDYMxdH7ihkk/7nSM.qD7XVZau3ddK",
            phone: 1139374068,
            registrationDate: new Date("2025-11-14"),
            isVerified: true,
            address: "Santa Fe",
            number: "3210",
            postalCode: "1007",
            departmentNumber: "8G",
            profilePicture: "/images/profilePicture/avatar.jpeg"
        }
    ];



    for (const user of users) {
        await prisma.user.upsert({
            where: { email: user.email },
            update: {},
            create: user
        });
    }


    // Ejemplo de JobRequests para el seed
    const jobRequests = [
        {
            title: "Cambio de termica",
            urgency: true,
            jobCreationDate: new Date("2025-11-07 04:27:59.717"),
            date: new Date("2025-11-21 00:00:00"),
            description: "Necesito cambiar la termica de mi casa por que exploto, creo que fue por el consumo. Por favor tambien verificar mi consumo.",
            address: {"road": "Tuyutí", "town": "Valentín Alsina", "state": "Buenos Aires", "country": "Argentina", "postcode": "1822", "country_code": "ar", "house_number": "2556", "neighbourhood": "Valentín Alsina", "ISO3166-2-lvl4": "AR-B", "state_district": "Partido de Lanús"},
            propertyType: "Casa",
            floor: null,
            aparmentNumber: null,
            position: {"lat":-34.6755207,"lng":-58.4068976},
            extraData: {"tablero": "si", "tipo_trabajo": "reparacion", "acceso_seguro": "si", "certificacion": "no", "corte_general": "si", "interior_exterior": "interior", "descripcion_adicional": "es mi casa propia y tengo los planos."},
            photos: [{"url": "/images/jobRequests/1762489679704-Captura de pantalla 2024-08-31 233019.png", "name": "Captura de pantalla 2024-08-31 233019.png", "note": "materiales"}, {"url": "/images/jobRequests/1762489679704-Captura de pantalla 2024-09-01 203905.png", "name": "Captura de pantalla 2024-09-01 203905.png", "note": "termica explotada"}, {"url": "/images/jobRequests/1762489679705-Captura de pantalla 2024-09-26 172615.png", "name": "Captura de pantalla 2024-09-26 172615.png", "note": "plano electrico"}, {"url": "/images/jobRequests/1762489679711-Captura de pantalla 2024-10-10 232133.png", "name": "Captura de pantalla 2024-10-10 232133.png", "note": "tablero"}],
            isVisible: true,
            agreementWorker: false,
            agreementUser: false,
            finalBudget: 0,
            workFinishedUser: false,
            workFinishedWorker: false,
            userId: 1, // ID de usuario existente
            statusId: 1, // ID de status existente
            serviceKey: 6 // ID de categoría existente
        }
    ];

// Inserción en el seed
    // prisma/seed.js (fragmento)
    for (const job of jobRequests) {
        const { userId, statusId, serviceKey, paymentMethodId, ...rest } = job;
        const pmId = paymentMethodId ?? paymentMethodMap["Efectivo"]; // default si no viene
        await prisma.jobRequest.create({
            data: {
                ...rest,
                user: { connect: { id: userId } },
                status: { connect: { id: statusId } },
                service: { connect: { id: serviceKey } },
                paymentMethod: { connect: { id: pmId } }
            }
        });
    }



}

(async () => {
    try {
        await main();
        console.log('Seed ejecutado correctamente');
    } catch (error) {
        console.error(error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
})();





