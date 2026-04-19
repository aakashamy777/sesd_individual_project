import { PrismaClient, UserRole } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
    path: path.resolve(process.cwd(), ".env"),
    override: true,
});

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("Seeding data...");

    // 1. Create Users
    const passwordHash = await bcrypt.hash("password123", 10);

    const admin = await prisma.user.upsert({
        where: { email: "admin@staysync.com" },
        update: {},
        create: {
            email: "admin@staysync.com",
            name: "Admin User",
            password: passwordHash,
            role: UserRole.ADMIN,
        },
    });

    const customer = await prisma.user.upsert({
        where: { email: "customer@gmail.com" },
        update: {},
        create: {
            email: "customer@gmail.com",
            name: "John Doe",
            password: passwordHash,
            role: UserRole.CUSTOMER,
        },
    });

    console.log({ admin, customer });

    // 2. Create Hotels
    const hotel1 = await prisma.hotel.create({
        data: {
            name: "The Hinjewadi Grand",
            city: "Pune",
            address: "Phase 1, Hinjewadi, Pune, MH",
            description: "Luxurious stay near the IT hub of Pune.",
            rooms: {
                create: [
                    { type: "Executive Suite", capacity: 2, price: 4500.00 },
                    { type: "IT Professional Room", capacity: 1, price: 2500.00 },
                    { type: "Family Studio", capacity: 4, price: 6500.00 },
                ],
            },
        },
    });

    const hotel2 = await prisma.hotel.create({
        data: {
            name: "Marine Drive Suites",
            city: "Mumbai",
            address: "Marine Drive, Mumbai, MH",
            description: "Stunning sea view in the heart of the city of dreams.",
            rooms: {
                create: [
                    { type: "Sea View King", capacity: 2, price: 8500.00 },
                    { type: "Heritage Queen", capacity: 2, price: 5500.00 },
                ],
            },
        },
    });

    const hotel3 = await prisma.hotel.create({
        data: {
            name: "Connaught Place Heritage",
            city: "Delhi",
            address: "CP, New Delhi",
            description: "Experience the history and hustle of Delhi.",
            rooms: {
                create: [
                    { type: "Presidential Suite", capacity: 2, price: 9500.00 },
                    { type: "Lutyens Room", capacity: 2, price: 5000.00 },
                ],
            },
        },
    });

    const hotel4 = await prisma.hotel.create({
        data: {
            name: "Garden City Resort",
            city: "Bangalore",
            address: "Koramangala, Bangalore, KA",
            description: "Lush greenery and tech-savvy amenities.",
            rooms: {
                create: [
                    { type: "Silicon Valley Suite", capacity: 2, price: 5500.00 },
                    { type: "Garden View Room", capacity: 2, price: 3500.00 },
                ],
            },
        },
    });

    console.log("Seeding completed.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
