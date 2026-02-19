import { db } from "./db";
import {
  problems,
  submissions,
  type Problem,
  type Submission,
  type InsertSubmission,
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getProblems(): Promise<Problem[]>;
  getProblem(slug: string): Promise<Problem | undefined>;
  getProblemById(id: number): Promise<Problem | undefined>;
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  getSubmissions(userId: string): Promise<Submission[]>;
  getSubmission(id: number): Promise<Submission | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getProblems(): Promise<Problem[]> {
    return await db.select().from(problems).orderBy(problems.order);
  }

  async getProblem(slug: string): Promise<Problem | undefined> {
    const [problem] = await db.select().from(problems).where(eq(problems.slug, slug));
    return problem;
  }

  async getProblemById(id: number): Promise<Problem | undefined> {
    const [problem] = await db.select().from(problems).where(eq(problems.id, id));
    return problem;
  }

  async createSubmission(submission: InsertSubmission): Promise<Submission> {
    const [newSubmission] = await db
      .insert(submissions)
      .values(submission)
      .returning();
    return newSubmission;
  }

  async getSubmissions(userId: string): Promise<Submission[]> {
    return await db
      .select()
      .from(submissions)
      .where(eq(submissions.userId, userId))
      .orderBy(desc(submissions.createdAt));
  }

  async getSubmission(id: number): Promise<Submission | undefined> {
    const [submission] = await db.select().from(submissions).where(eq(submissions.id, id));
    return submission;
  }
}

export const storage = new DatabaseStorage();
