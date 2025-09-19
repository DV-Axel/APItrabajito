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

