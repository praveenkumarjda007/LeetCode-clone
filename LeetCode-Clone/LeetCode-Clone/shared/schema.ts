import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";

export * from "./models/auth";

// Problems table
export const problems = pgTable("problems", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  difficulty: text("difficulty").notNull(), // Easy, Medium, Hard
  inputSchema: jsonb("input_schema").notNull(), // For parsing test cases
  outputSchema: jsonb("output_schema").notNull(),
  testCases: jsonb("test_cases").notNull(), // Array of {input, output}
  starterCode: jsonb("starter_code").notNull(), // Map of language -> code
  order: integer("order").default(0),
});

// Submissions table
export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // References users.id (which is varchar from auth)
  problemId: integer("problem_id").notNull().references(() => problems.id),
  code: text("code").notNull(),
  language: text("language").notNull(),
  status: text("status").notNull(), // Pending, Accepted, Wrong Answer, Compilation Error
  output: jsonb("output"), // Result details
  executionTime: integer("execution_time"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Schemas
export const insertProblemSchema = createInsertSchema(problems).omit({ id: true });
export const insertSubmissionSchema = createInsertSchema(submissions).omit({ 
  id: true, 
  userId: true, 
  status: true, 
  output: true, 
  executionTime: true,
  createdAt: true 
});

// Types
export type Problem = typeof problems.$inferSelect;
export type InsertProblem = z.infer<typeof insertProblemSchema>;
export type Submission = typeof submissions.$inferSelect;
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;

// Request Types
export type CreateSubmissionRequest = {
  problemId: number;
  code: string;
  language: string;
};

// Response Types
export type SubmissionResponse = Submission & {
  problem?: Problem;
};
