import { prisma } from "../src/data/prisma.js";


async function main() {
    const statuses = [
        { name: 'Pendiente'},
        { name: 'En progeso'},
        { name: 'Completado'},
        { name: 'Cancelado'}
    ];

    for( const status of statuses){
        await prisma.status.upsert({
            where: { name: status.name},
            update: {},
            create: status,
        });
    }

    // Categories
    const categories = [
        { id: 1, name: "Aires Acondicionados", description: "Servicios de aire acondicionado" },
        { id: 2, name: "Albañilería", description: "Trabajos de albañilería" },
        { id: 3, name: "Carpintero", description: "Servicios de carpintería" },
        { id: 4, name: "Cerrajería", description: "Servicios de cerrajería" },
        { id: 5, name: "Cuidados Adultos", description: "Cuidado de adultos mayores" },
        { id: 6, name: "Electricidad", description: "Servicios eléctricos" },
        { id: 7, name: "Herrería", description: "Trabajos de herrería" },
        { id: 8, name: "Jardinería", description: "Servicios de jardinería" },
        { id: 9, name: "Limpieza", description: "Servicios de limpieza" },
        { id: 10, name: "Logística", description: "Servicios de logística" },
        { id: 11, name: "Mudanzas", description: "Servicios de mudanza" },
        { id: 12, name: "Niñera", description: "Cuidado de niños" },
        { id: 13, name: "Pintura", description: "Trabajos de pintura" },
        { id: 14, name: "Plomería", description: "Servicios de plomería" },
        { id: 15, name: "Tornería", description: "Trabajos de tornería" }
    ];

    for (const category of categories) {
        await prisma.category.upsert({
            where: { id: category.id }, 
            update: {},
            create: category,
        });
    }
}

// Sponsors
const sponsors = [
    {
        tradeName: "Electricidad Sur",
        address: "Av. Corrientes 1234",
        phone: 1145678900,
        cuilId: 30712345678,
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
        cuilId: 30598765432,
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
        cuilId: 30711223344,
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
        cuilId: 30555666778,
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
        cuilId: 30766778899,
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

for (const sponsor of sponsors) {
    await prisma.sponsor.upsert({
        where: { cuilId: sponsor.cuilId },
        update: {},
        create: sponsor,
    });
}


// Relacionar sponsors con categorías
const sponsorCategories = [
    { sponsorId: 1, categoryId: 6 },  // Electricidad Sur → Electricidad
    { sponsorId: 2, categoryId: 14 }, // Plomería Express → Plomería
    { sponsorId: 3, categoryId: 8 },  // Jardines Verdes → Jardinería
    { sponsorId: 4, categoryId: 11 }, // Mudanzas Rápidas → Mudanzas
    { sponsorId: 5, categoryId: 13 }, // Pinturas del Sur → Pintura
];

for (const sc of sponsorCategories) {
    await prisma.sponsorCategory.upsert({
        where: {
            sponsorId_categoryId: {
                sponsorId: sc.sponsorId,
                categoryId: sc.categoryId
            }
        },
        update: {},
        create: sc,
    });
}



(async () =>{
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

