import { getDb } from "@shiftmate/database";
import { users, type User, type NewUser } from "../schema/userSchema";

export const createUser = (data: NewUser): User => {
  const db = getDb();
  const result = db.insert(users).values(data).returning().all();
  return result[0]!;
};
