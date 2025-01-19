// const { PrismaClient } = require('@prisma/client');
// const { faker } = require('@faker-js/faker');

// const prisma = new PrismaClient();

// async function main() {
//   console.log('Clearing database...');

//   // Delete all records from each table
//   await prisma.appointment.deleteMany({});
//   await prisma.order.deleteMany({});
//   await prisma.medicine.deleteMany({});
//   await prisma.doctor.deleteMany({});
//   await prisma.user.deleteMany({});

//   console.log('Database cleared!');

//   console.log('Seeding small dataset...');

//   // Seed Users
//   const users = await Promise.all(
//     Array.from({ length: 5 }).map(() =>
//       prisma.user.create({
//         data: {
//           name: faker.name.fullName(),
//           email: faker.internet.email(),
//           phone: faker.phone.number(),
//           password: '121245',
//         },
//       })
//     )
//   );

//   // Seed Doctors
//   const doctors = await Promise.all(
//     Array.from({ length: 3 }).map(() =>
//       prisma.doctor.create({
//         data: {
//           name: faker.name.fullName(),
//           specialty: faker.helpers.arrayElement(['Cardiology', 'Dermatology', 'Pediatrics']),
//           email: faker.internet.email(),
//           phone: faker.phone.number(),
//         },
//       })
//     )
//   );

//   // Seed Medicines
//   const medicines = await Promise.all(
//     Array.from({ length: 5 }).map(() =>
//       prisma.medicine.create({
//         data: {
//           name: faker.commerce.productName(),
//           description: faker.commerce.productDescription(),
//           price: parseFloat(faker.commerce.price()),
//         },
//       })
//     )
//   );

//   // Seed Appointments
//   await Promise.all(
//     Array.from({ length: 5 }).map(() =>
//       prisma.appointment.create({
//         data: {
//           userId: faker.helpers.arrayElement(users).id,
//           doctorId: faker.helpers.arrayElement(doctors).id,
//           date: faker.date.future(),
//           type: faker.helpers.arrayElement(['Video Call', 'Chat', 'In-Person']),
//         },
//       })
//     )
//   );

//   // Seed Orders
// // Seed Orders
// await Promise.all(
//   Array.from({ length: 5 }).map(() =>
//     prisma.order.create({
//       data: {
//         userId: faker.helpers.arrayElement(users).id,
//         medicineId: faker.helpers.arrayElement(medicines).id,
//         quantity: faker.number.int({ min: 1, max: 5 }), // Corrected method for number generation
//         status: faker.helpers.arrayElement(['Pending', 'Delivered']),
//       },
//     })
//   )
// );


//   console.log('Seeding finished!');
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
