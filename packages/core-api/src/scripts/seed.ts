import { databaseConnect, getDb } from "@shiftmate/database";
import { createTenant, createUser } from "@shiftmate/tenant";
import { workers, availability } from "@shiftmate/worker";
import { scheduleRules } from "@shiftmate/scheduling";
import { authUsers } from "@shiftmate/auth";
import { autoFill } from "@shiftmate/scheduling";
import bcrypt from "bcrypt";
import { migrate } from "../migrate";

databaseConnect();
migrate();

const db = getDb();

const existing = db.select().from(workers).all();
if (existing.length > 0) {
  console.log("Database already seeded. Skipping.");
  process.exit(0);
}

const tenant = createTenant({ name: "Restaurante Demo" });
console.log(`Created tenant: ${tenant.name} (id:${tenant.id})`);

const user = createUser({
  tenantId: tenant.id,
  name: "Admin",
  email: "admin@example.com",
  role: "owner",
});
const hashedPassword = await bcrypt.hash("123456", 10);
db.insert(authUsers)
  .values({ userId: user.id, password: hashedPassword })
  .run();
console.log(`Created user: ${user.email} / password: 123456`);

const workerData = [
  {
    tenantId: tenant.id,
    name: "Carlos Silva",
    role: "manager",
    phone: "(11) 99001-0001",
    maxHoursPerWeek: 44,
  },
  {
    tenantId: tenant.id,
    name: "Ana Oliveira",
    role: "manager",
    phone: "(11) 99001-0002",
    maxHoursPerWeek: 44,
  },
  {
    tenantId: tenant.id,
    name: "Roberto Mendes",
    role: "chef",
    phone: "(11) 99002-0001",
    maxHoursPerWeek: 40,
  },
  {
    tenantId: tenant.id,
    name: "Juliana Costa",
    role: "chef",
    phone: "(11) 99002-0002",
    maxHoursPerWeek: 40,
  },
  {
    tenantId: tenant.id,
    name: "Fernando Lima",
    role: "chef",
    phone: "(11) 99002-0003",
    maxHoursPerWeek: 36,
  },
  {
    tenantId: tenant.id,
    name: "Marcos Santos",
    role: "cook",
    phone: "(11) 99003-0001",
    maxHoursPerWeek: 40,
  },
  {
    tenantId: tenant.id,
    name: "Patrícia Rocha",
    role: "cook",
    phone: "(11) 99003-0002",
    maxHoursPerWeek: 40,
  },
  {
    tenantId: tenant.id,
    name: "Lucas Ferreira",
    role: "cook",
    phone: "(11) 99003-0003",
    maxHoursPerWeek: 36,
  },
  {
    tenantId: tenant.id,
    name: "Camila Souza",
    role: "cook",
    phone: "(11) 99003-0004",
    maxHoursPerWeek: 30,
  },
  {
    tenantId: tenant.id,
    name: "Diego Almeida",
    role: "cook",
    phone: "(11) 99003-0005",
    maxHoursPerWeek: 40,
  },
  {
    tenantId: tenant.id,
    name: "Renata Barbosa",
    role: "cook",
    phone: "(11) 99003-0006",
    maxHoursPerWeek: 30,
  },
  {
    tenantId: tenant.id,
    name: "Maria Eduarda",
    role: "waiter",
    phone: "(11) 99004-0001",
    maxHoursPerWeek: 40,
  },
  {
    tenantId: tenant.id,
    name: "João Pedro",
    role: "waiter",
    phone: "(11) 99004-0002",
    maxHoursPerWeek: 40,
  },
  {
    tenantId: tenant.id,
    name: "Isabela Martins",
    role: "waiter",
    phone: "(11) 99004-0003",
    maxHoursPerWeek: 36,
  },
  {
    tenantId: tenant.id,
    name: "Gabriel Nascimento",
    role: "waiter",
    phone: "(11) 99004-0004",
    maxHoursPerWeek: 30,
  },
  {
    tenantId: tenant.id,
    name: "Larissa Carvalho",
    role: "waiter",
    phone: "(11) 99004-0005",
    maxHoursPerWeek: 40,
  },
  {
    tenantId: tenant.id,
    name: "Pedro Henrique",
    role: "waiter",
    phone: "(11) 99004-0006",
    maxHoursPerWeek: 20,
  },
  {
    tenantId: tenant.id,
    name: "Amanda Ribeiro",
    role: "waiter",
    phone: "(11) 99004-0007",
    maxHoursPerWeek: 20,
  },
  {
    tenantId: tenant.id,
    name: "Thiago Araújo",
    role: "waiter",
    phone: "(11) 99004-0008",
    maxHoursPerWeek: 40,
  },
  {
    tenantId: tenant.id,
    name: "Beatriz Gomes",
    role: "waiter",
    phone: "(11) 99004-0009",
    maxHoursPerWeek: 36,
  },
  {
    tenantId: tenant.id,
    name: "Rafael Pereira",
    role: "waiter",
    phone: "(11) 99004-0010",
    maxHoursPerWeek: 30,
  },
  {
    tenantId: tenant.id,
    name: "Sophia Dias",
    role: "waiter",
    phone: "(11) 99004-0011",
    maxHoursPerWeek: 20,
  },
  {
    tenantId: tenant.id,
    name: "Matheus Teixeira",
    role: "waiter",
    phone: "(11) 99004-0012",
    maxHoursPerWeek: 20,
  },
  {
    tenantId: tenant.id,
    name: "José Antônio",
    role: "dishwasher",
    phone: "(11) 99005-0001",
    maxHoursPerWeek: 40,
  },
  {
    tenantId: tenant.id,
    name: "Francisco Moreira",
    role: "dishwasher",
    phone: "(11) 99005-0002",
    maxHoursPerWeek: 30,
  },
  {
    tenantId: tenant.id,
    name: "Antônio Carlos",
    role: "dishwasher",
    phone: "(11) 99005-0003",
    maxHoursPerWeek: 20,
  },
  {
    tenantId: tenant.id,
    name: "Paulo Ricardo",
    role: "dishwasher",
    phone: "(11) 99005-0004",
    maxHoursPerWeek: 20,
  },
  {
    tenantId: tenant.id,
    name: "Viviane Lopes",
    role: "host",
    phone: "(11) 99006-0001",
    maxHoursPerWeek: 36,
  },
  {
    tenantId: tenant.id,
    name: "Carolina Pinto",
    role: "host",
    phone: "(11) 99006-0002",
    maxHoursPerWeek: 30,
  },
  {
    tenantId: tenant.id,
    name: "Daniela Freitas",
    role: "host",
    phone: "(11) 99006-0003",
    maxHoursPerWeek: 20,
  },
];

const insertedWorkers = db.insert(workers).values(workerData).returning().all();
console.log(`Inserted ${insertedWorkers.length} workers`);

const availabilityPatterns: Record<string, boolean[][]> = {
  manager: [
    [true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true],
  ],
  chef: [
    [true, false, true, true, true, true, true],
    [true, true, false, true, true, true, true],
    [true, true, true, true, true, false, true],
  ],
  cook: [
    [true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true],
    [false, true, true, true, true, true, true],
    [true, false, false, true, true, true, true],
    [true, true, true, true, true, true, true],
    [true, true, false, false, true, true, true],
  ],
  waiter: [
    [true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true],
    [true, true, true, true, true, false, true],
    [true, false, false, true, true, true, true],
    [true, true, true, true, true, true, true],
    [true, false, false, false, false, true, true],
    [true, false, false, false, false, true, true],
    [true, true, true, true, true, true, true],
    [true, true, true, false, true, true, true],
    [true, false, false, true, true, true, true],
    [true, false, false, false, false, true, true],
    [true, false, false, false, false, true, true],
  ],
  dishwasher: [
    [true, true, true, true, true, true, true],
    [true, false, false, true, true, true, true],
    [true, false, false, false, false, true, true],
    [true, false, false, false, false, true, true],
  ],
  host: [
    [true, true, true, true, true, true, true],
    [true, false, false, true, true, true, true],
    [true, false, false, false, false, true, true],
  ],
};

const roleCounter: Record<string, number> = {
  manager: 0,
  chef: 0,
  cook: 0,
  waiter: 0,
  dishwasher: 0,
  host: 0,
};

const availRows = insertedWorkers.flatMap((w) => {
  const patterns = availabilityPatterns[w.role]!;
  const idx = roleCounter[w.role]!;
  const pattern = patterns[idx % patterns.length]!;
  roleCounter[w.role] = idx + 1;
  return Array.from({ length: 7 }, (_, day) => ({
    workerId: w.id,
    dayOfWeek: day,
    available: pattern[day]!,
  }));
});

db.insert(availability).values(availRows).run();
console.log(`Inserted ${availRows.length} availability rows`);

const rules = [
  {
    tenantId: tenant.id,
    name: "Weekday Lunch",
    dayType: "weekday",
    role: "chef",
    count: 1,
    startTime: "11:00",
    endTime: "15:00",
  },
  {
    tenantId: tenant.id,
    name: "Weekday Lunch",
    dayType: "weekday",
    role: "cook",
    count: 2,
    startTime: "11:00",
    endTime: "15:00",
  },
  {
    tenantId: tenant.id,
    name: "Weekday Lunch",
    dayType: "weekday",
    role: "waiter",
    count: 4,
    startTime: "11:00",
    endTime: "15:00",
  },
  {
    tenantId: tenant.id,
    name: "Weekday Lunch",
    dayType: "weekday",
    role: "dishwasher",
    count: 1,
    startTime: "11:00",
    endTime: "15:00",
  },
  {
    tenantId: tenant.id,
    name: "Weekday Lunch",
    dayType: "weekday",
    role: "host",
    count: 1,
    startTime: "11:00",
    endTime: "15:00",
  },
  {
    tenantId: tenant.id,
    name: "Weekday Dinner",
    dayType: "weekday",
    role: "chef",
    count: 1,
    startTime: "18:00",
    endTime: "23:00",
  },
  {
    tenantId: tenant.id,
    name: "Weekday Dinner",
    dayType: "weekday",
    role: "cook",
    count: 3,
    startTime: "18:00",
    endTime: "23:00",
  },
  {
    tenantId: tenant.id,
    name: "Weekday Dinner",
    dayType: "weekday",
    role: "waiter",
    count: 5,
    startTime: "18:00",
    endTime: "23:00",
  },
  {
    tenantId: tenant.id,
    name: "Weekday Dinner",
    dayType: "weekday",
    role: "dishwasher",
    count: 1,
    startTime: "18:00",
    endTime: "23:00",
  },
  {
    tenantId: tenant.id,
    name: "Weekday Dinner",
    dayType: "weekday",
    role: "host",
    count: 1,
    startTime: "18:00",
    endTime: "23:00",
  },
  {
    tenantId: tenant.id,
    name: "Weekend Lunch",
    dayType: "weekend",
    role: "manager",
    count: 1,
    startTime: "11:00",
    endTime: "16:00",
  },
  {
    tenantId: tenant.id,
    name: "Weekend Lunch",
    dayType: "weekend",
    role: "chef",
    count: 2,
    startTime: "11:00",
    endTime: "16:00",
  },
  {
    tenantId: tenant.id,
    name: "Weekend Lunch",
    dayType: "weekend",
    role: "cook",
    count: 4,
    startTime: "11:00",
    endTime: "16:00",
  },
  {
    tenantId: tenant.id,
    name: "Weekend Lunch",
    dayType: "weekend",
    role: "waiter",
    count: 8,
    startTime: "11:00",
    endTime: "16:00",
  },
  {
    tenantId: tenant.id,
    name: "Weekend Lunch",
    dayType: "weekend",
    role: "dishwasher",
    count: 2,
    startTime: "11:00",
    endTime: "16:00",
  },
  {
    tenantId: tenant.id,
    name: "Weekend Lunch",
    dayType: "weekend",
    role: "host",
    count: 1,
    startTime: "11:00",
    endTime: "16:00",
  },
  {
    tenantId: tenant.id,
    name: "Weekend Dinner",
    dayType: "weekend",
    role: "manager",
    count: 1,
    startTime: "18:00",
    endTime: "23:00",
  },
  {
    tenantId: tenant.id,
    name: "Weekend Dinner",
    dayType: "weekend",
    role: "chef",
    count: 2,
    startTime: "18:00",
    endTime: "23:00",
  },
  {
    tenantId: tenant.id,
    name: "Weekend Dinner",
    dayType: "weekend",
    role: "cook",
    count: 4,
    startTime: "18:00",
    endTime: "23:00",
  },
  {
    tenantId: tenant.id,
    name: "Weekend Dinner",
    dayType: "weekend",
    role: "waiter",
    count: 6,
    startTime: "18:00",
    endTime: "23:00",
  },
  {
    tenantId: tenant.id,
    name: "Weekend Dinner",
    dayType: "weekend",
    role: "dishwasher",
    count: 2,
    startTime: "18:00",
    endTime: "23:00",
  },
  {
    tenantId: tenant.id,
    name: "Weekend Dinner",
    dayType: "weekend",
    role: "host",
    count: 1,
    startTime: "18:00",
    endTime: "23:00",
  },
];

db.insert(scheduleRules).values(rules).run();
console.log(`Inserted ${rules.length} schedule rules`);

const now = new Date();
const day = now.getDay();
const diff = day === 0 ? -6 : 1 - day;
const monday = new Date(now);
monday.setDate(now.getDate() + diff);
const weekStart = monday.toLocaleDateString("sv-SE");

console.log(`Auto-filling schedule for week starting ${weekStart}...`);
const result = await autoFill(tenant.id, weekStart);
console.log(
  `Filled ${result.filled.length} shifts, ${result.unfilled.length} unfilled`,
);
result.unfilled.forEach((u) =>
  console.log(`  ${u.date} ${u.role} ${u.startTime}-${u.endTime}`),
);
console.log("\nSeed complete!");
