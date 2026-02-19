import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { z } from "zod";
import { db } from "./db";
import { problems } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth Setup
  await setupAuth(app);
  registerAuthRoutes(app);

  // API Routes
  app.get(api.problems.list.path, async (_req, res) => {
    const allProblems = await storage.getProblems();
    res.json(allProblems);
  });

  app.get(api.problems.get.path, async (req, res) => {
    const problem = await storage.getProblem(req.params.slug);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    res.json(problem);
  });

  app.post(api.submissions.create.path, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Explicitly cast req.user to any to access claims
    const user = req.user as any;
    const userId = user.claims.sub;

    try {
      const input = api.submissions.create.input.parse(req.body);
      
      // Mock Execution Logic
      // In a real app, this would send code to a judge (Piston, Judge0)
      // Here we simulate it with random results or simple checks
      
      const statusOptions = ["Accepted", "Wrong Answer", "Time Limit Exceeded", "Runtime Error"];
      // Bias towards Accepted for demo purposes if code length > 20
      const randomStatus = input.code.length > 20 && Math.random() > 0.3 
        ? "Accepted" 
        : statusOptions[Math.floor(Math.random() * statusOptions.length)];

      const submission = await storage.createSubmission({
        userId,
        problemId: input.problemId,
        code: input.code,
        language: input.language,
        status: randomStatus,
        output: { result: randomStatus, logs: "Execution completed." }, // Mock output
        executionTime: Math.floor(Math.random() * 100), // Mock time
      });

      res.status(201).json(submission);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.submissions.list.path, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = req.user as any;
    const userId = user.claims.sub;

    const userSubmissions = await storage.getSubmissions(userId);
    // Enrich with problem details if needed, but for now simple list
    const enriched = await Promise.all(userSubmissions.map(async (sub) => {
        const problem = await storage.getProblemById(sub.problemId);
        return { ...sub, problem };
    }));

    res.json(enriched);
  });

  app.get(api.submissions.get.path, async (req, res) => {
    const submission = await storage.getSubmission(Number(req.params.id));
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }
    res.json(submission);
  });

  return httpServer;
}

// Seed function to add initial problems
export async function seedDatabase() {
  const existing = await storage.getProblems();
  if (existing.length === 0) {
    await db.insert(problems).values([
      {
        title: "Two Sum",
        slug: "two-sum",
        description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.

### Example 1:
\`\`\`
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
\`\`\`

### Example 2:
\`\`\`
Input: nums = [3,2,4], target = 6
Output: [1,2]
\`\`\`
`,
        difficulty: "Easy",
        inputSchema: { type: "object", properties: { nums: { type: "array" }, target: { type: "number" } } },
        outputSchema: { type: "array", items: { type: "number" } },
        testCases: [
          { input: { nums: [2, 7, 11, 15], target: 9 }, output: [0, 1] },
          { input: { nums: [3, 2, 4], target: 6 }, output: [1, 2] }
        ],
        starterCode: {
          javascript: "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    \n};",
          python: "class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        pass",
          java: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        \n    }\n}",
          cpp: "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};",
          c: "/**\n * Note: The returned array must be malloced, assume caller calls free().\n */\nint* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    \n}",
          csharp: "public class Solution {\n    public int[] TwoSum(int[] nums, int target) {\n        \n    }\n}",
          ruby: "# @param {Integer[]} nums\n# @param {Integer} target\n# @return {Integer[]}\ndef two_sum(nums, target)\n    \nend",
          go: "func twoSum(nums []int, target int) []int {\n    \n}",
          rust: "impl Solution {\n    pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {\n        \n    }\n}",
          php: "class Solution {\n\n    /**\n     * @param Integer[] $nums\n     * @param Integer $target\n     * @return Integer[]\n     */\n    function twoSum($nums, $target) {\n        \n    }\n}"
        },
        order: 1
      },
      {
        title: "Palindrome Number",
        slug: "palindrome-number",
        description: `Given an integer \`x\`, return \`true\` if \`x\` is a palindrome, and \`false\` otherwise.

### Example 1:
\`\`\`
Input: x = 121
Output: true
Explanation: 121 reads as 121 from left to right and from right to left.
\`\`\`

### Example 2:
\`\`\`
Input: x = -121
Output: false
Explanation: From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.
\`\`\`
`,
        difficulty: "Easy",
        inputSchema: { type: "object", properties: { x: { type: "number" } } },
        outputSchema: { type: "boolean" },
        testCases: [
          { input: { x: 121 }, output: true },
          { input: { x: -121 }, output: false }
        ],
        starterCode: {
           javascript: "/**\n * @param {number} x\n * @return {boolean}\n */\nvar isPalindrome = function(x) {\n    \n};",
           python: "class Solution:\n    def isPalindrome(self, x: int) -> bool:\n        pass",
           java: "class Solution {\n    public boolean isPalindrome(int x) {\n        \n    }\n}",
           cpp: "class Solution {\npublic:\n    bool isPalindrome(int x) {\n        \n    }\n}",
           c: "bool isPalindrome(int x) {\n    \n}",
           csharp: "public class Solution {\n    public bool IsPalindrome(int x) {\n        \n    }\n}",
           ruby: "# @param {Integer} x\n# @return {Boolean}\ndef is_palindrome(x)\n    \nend",
           go: "func isPalindrome(x int) bool {\n    \n}",
           rust: "impl Solution {\n    pub fn is_palindrome(x: i32) -> bool {\n        \n    }\n}",
           php: "class Solution {\n\n    /**\n     * @param Integer $x\n     * @return Boolean\n     */\n    function isPalindrome($x) {\n        \n    }\n}"
        },
        order: 2
      },
       {
        title: "Longest Substring Without Repeating Characters",
        slug: "longest-substring-without-repeating-characters",
        description: `Given a string \`s\`, find the length of the **longest substring** without repeating characters.

### Example 1:
\`\`\`
Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.
\`\`\`

### Example 2:
\`\`\`
Input: s = "bbbbb"
Output: 1
Explanation: The answer is "b", with the length of 1.
\`\`\`
`,
        difficulty: "Medium",
        inputSchema: { type: "object", properties: { s: { type: "string" } } },
        outputSchema: { type: "number" },
        testCases: [
          { input: { s: "abcabcbb" }, output: 3 },
          { input: { s: "bbbbb" }, output: 1 }
        ],
        starterCode: {
           javascript: "/**\n * @param {string} s\n * @return {number}\n */\nvar lengthOfLongestSubstring = function(s) {\n    \n};",
           python: "class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        pass",
           java: "class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        \n    }\n}",
           cpp: "class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        \n    }\n}",
           c: "int lengthOfLongestSubstring(char* s) {\n    \n}",
           csharp: "public class Solution {\n    public int LengthOfLongestSubstring(string s) {\n        \n    }\n}",
           ruby: "# @param {String} s\n# @return {Integer}\ndef length_of_longest_substring(s)\n    \nend",
           go: "func lengthOfLongestSubstring(s string) int {\n    \n}",
           rust: "impl Solution {\n    pub fn length_of_longest_substring(s: String) -> i32 {\n        \n    }\n}",
           php: "class Solution {\n\n    /**\n     * @param String $s\n     * @return Integer\n     */\n    function lengthOfLongestSubstring($s) {\n        \n    }\n}"
        },
        order: 3
      }
    ]);
  }
}
