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

