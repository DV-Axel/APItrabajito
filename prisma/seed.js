// prisma/seed.js
import { prisma } from "../src/data/prisma.js";

async function main() {
    // Estados
    const statuses = [
        { name: 'Pendiente'},
        { name: 'En progeso'},
        { name: 'Completado'},
        { name: 'Cancelado'}
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
