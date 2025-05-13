import { faker } from '@faker-js/faker';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function generateSeedData(prisma) {
  // Specific User: Andreas Alexander
  const specificUser = {
    firebase_uid: "V7hSEchTvwZzhKVqbt3CHTuHAuy2",
    name: "Andreas Alexander",
    email: "andreas@example.com",
    role: "admin",
    referral_code: faker.string.alphanumeric(6),
  };

  const existingUser = await prisma.user.findUnique({
    where: { firebase_uid: "V7hSEchTvwZzhKVqbt3CHTuHAuy2" },
  });

  if (!existingUser) {
    await prisma.user.create({ data: specificUser });
  }

  // 1. Seed Additional Users
  const users = Array.from({ length: 9 }).map(() => ({
    firebase_uid: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role: faker.helpers.arrayElement(['admin', 'staff', 'manager']),
    referral_code: faker.string.alphanumeric(6),
  }));
  await prisma.user.createMany({ data: users });

  // 2. Seed Payment Types
  const paymentTypes = ['Cash', 'Credit Card', 'Debit Card', 'Digital Wallet', 'QRIS'].map((name) => ({ name }));
  await prisma.paymentType.createMany({ data: paymentTypes });

  // 3. Seed Employee Positions
  const positions = ['Manager', 'Barista', 'Chef', 'Waiter', 'Cashier', 'Pastry Chef'].map((name) => ({ name }));
  await prisma.employeePosition.createMany({ data: positions });

  // 4. Seed Employee Statuses
  const statuses = ['Active', 'Inactive', 'On Leave'].map((name) => ({ name }));
  await prisma.employeeStatus.createMany({ data: statuses });

  // Fetch Employee Positions and Statuses
  const employeePositions = await prisma.employeePosition.findMany();
  const employeeStatuses = await prisma.employeeStatus.findMany();

  // 5. Seed Employees
  const specificEmployee = {
    id: faker.string.uuid(),
    name: "John Doe",
    phone_number: "+62 878 7819 7989",
    employeePosition: { connect: { id: employeePositions[0].id } }, // Manager
    employeeStatus: { connect: { id: employeeStatuses[0].id } }, // Active
  };
  await prisma.employee.create({ data: specificEmployee });

  // Random Employees
  const employees = Array.from({ length: 9 }).map(() => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    phone_number: faker.phone.number('+62 ### #### ####'),
    employeePosition: { connect: { id: employeePositions[getRandomInt(0, employeePositions.length - 1)].id } },
    employeeStatus: { connect: { id: employeeStatuses[getRandomInt(0, employeeStatuses.length - 1)].id } },
  }));
  
  // Create employees one by one since createMany doesn't support nested writes
  for (const employee of employees) {
    await prisma.employee.create({ data: employee });
  }

  // 6. Seed Cafe Inventory Items
  const cafeItems = [
    { name: "Coffee Beans (Arabica)", stock: getRandomInt(20, 100) },
    { name: "Milk (Fresh)", stock: getRandomInt(50, 200) },
    { name: "Sugar (White)", stock: getRandomInt(30, 150) },
    { name: "Flour (Premium)", stock: getRandomInt(40, 120) },
    { name: "Eggs", stock: getRandomInt(60, 300) },
    { name: "Butter", stock: getRandomInt(20, 80) },
    { name: "Vanilla Extract", stock: getRandomInt(10, 50) },
    { name: "Chocolate Chips", stock: getRandomInt(15, 60) },
    { name: "Whipped Cream", stock: getRandomInt(25, 100) },
    { name: "Caramel Syrup", stock: getRandomInt(15, 75) },
    { name: "Matcha Powder", stock: getRandomInt(10, 40) },
    { name: "Cinnamon Sticks", stock: getRandomInt(5, 30) }
  ];
  await prisma.items.createMany({ data: cafeItems });

  // 7. Seed Menu Categories
  const menuCategoryNames = ['Coffee', 'Tea', 'Pastry', 'Breakfast', 'Sandwiches', 'Desserts'];
  await prisma.menuCategory.createMany({
    data: menuCategoryNames.map(name => ({ name })),
    skipDuplicates: true
  });

  // Fetch the created menu categories with their IDs
  const createdMenuCategories = await prisma.menuCategory.findMany();

  // 8. Seed Cafe Menu Items
  const coffeeMenu = [
    {
      name: "Espresso",
      description: "Strong black coffee made by forcing steam through ground coffee beans",
      production_cost: 10000,
      margin: 8000,
      price: 18000,
      prep_time_minutes: 5,
      rating: faker.number.float({ min: 3.0, max: 5.0, precision: 0.1 })
    },
    {
      name: "Cappuccino",
      description: "Espresso with steamed milk foam",
      production_cost: 15000,
      margin: 10000,
      price: 25000,
      prep_time_minutes: 7,
      rating: faker.number.float({ min: 3.0, max: 5.0, precision: 0.1 })
    },
    {
      name: "Latte",
      description: "Espresso with a lot of steamed milk and a small amount of foam",
      production_cost: 15000,
      margin: 10000,
      price: 25000,
      prep_time_minutes: 7,
      rating: faker.number.float({ min: 3.0, max: 5.0, precision: 0.1 })
    },
    {
      name: "Americano",
      description: "Espresso shots topped with hot water",
      production_cost: 10000,
      margin: 8000,
      price: 18000,
      prep_time_minutes: 5,
      rating: faker.number.float({ min: 3.0, max: 5.0, precision: 0.1 })
    },
    {
      name: "Mocha",
      description: "Espresso with chocolate and steamed milk",
      production_cost: 20000,
      margin: 15000,
      price: 35000,
      prep_time_minutes: 8,
      rating: faker.number.float({ min: 3.0, max: 5.0, precision: 0.1 })
    }
  ];

  const pastryMenu = [
    {
      name: "Croissant",
      description: "Buttery, flaky pastry",
      production_cost: 8000,
      margin: 5000,
      price: 13000,
      prep_time_minutes: 2,
      rating: faker.number.float({ min: 3.0, max: 5.0, precision: 0.1 })
    },
    {
      name: "Blueberry Muffin",
      description: "Fresh muffin with blueberries",
      production_cost: 10000,
      margin: 7000,
      price: 17000,
      prep_time_minutes: 2,
      rating: faker.number.float({ min: 3.0, max: 5.0, precision: 0.1 })
    },
    {
      name: "Cinnamon Roll",
      description: "Sweet roll with cinnamon sugar filling",
      production_cost: 12000,
      margin: 8000,
      price: 20000,
      prep_time_minutes: 3,
      rating: faker.number.float({ min: 3.0, max: 5.0, precision: 0.1 })
    }
  ];

  const breakfastMenu = [
    {
      name: "Avocado Toast",
      description: "Sourdough bread with smashed avocado, salt, and pepper",
      production_cost: 25000,
      margin: 20000,
      price: 45000,
      prep_time_minutes: 10,
      rating: faker.number.float({ min: 3.0, max: 5.0, precision: 0.1 })
    },
    {
      name: "Pancake Stack",
      description: "Fluffy pancakes with maple syrup",
      production_cost: 20000,
      margin: 15000,
      price: 35000,
      prep_time_minutes: 12,
      rating: faker.number.float({ min: 3.0, max: 5.0, precision: 0.1 })
    }
  ];

  // Combine all menu items
  const allMenuItems = [
    ...coffeeMenu.map(item => ({ 
      ...item, 
      menu_category_id: createdMenuCategories.find(c => c.name === 'Coffee').id 
    })),
    ...pastryMenu.map(item => ({ 
      ...item, 
      menu_category_id: createdMenuCategories.find(c => c.name === 'Pastry').id 
    })),
    ...breakfastMenu.map(item => ({ 
      ...item, 
      menu_category_id: createdMenuCategories.find(c => c.name === 'Breakfast').id 
    }))
  ];

  // Add random values for dynamic fields
  const menus = allMenuItems.map(item => ({
    ...item,
    monthly_revenue: getRandomInt(1000, 5000),
    monthly_profit: getRandomInt(500, 3000),
    stock_serving: getRandomInt(10, 100),
    last_restocked: faker.date.recent(),
  }));

  await prisma.menu.createMany({ data: menus });

  // 9. Seed Referral
  const allUsers = await prisma.user.findMany();
  
  // Ensure we have at least 2 users for referrals
  if (allUsers.length < 2) {
    console.log('Not enough users to create referrals');
    return;
  }

  // Create referrals between users
  const referrals = [];
  
  // Create 3-5 referrals per user (except the last few)
  for (let i = 0; i < allUsers.length - 3; i++) {
    const referrer = allUsers[i];
    const referralCount = getRandomInt(3, 5);
    
    for (let j = 0; j < referralCount; j++) {
      // Ensure we don't go out of bounds
      if (i + j + 1 >= allUsers.length) break;
      
      const referredUser = allUsers[i + j + 1];
      
      referrals.push({
        referrerId: referrer.id,
        referredId: referredUser.id,
        rewardPoints: getRandomInt(50, 200), // Random reward points between 50-200
        created_at: faker.date.recent({ days: 30 }) // Within last 30 days
      });
    }
  }

  // Seed the referrals
  await prisma.referral.createMany({
    data: referrals,
    skipDuplicates: true
  });

  console.log('🌱 Cafe seeding completed successfully!');
}