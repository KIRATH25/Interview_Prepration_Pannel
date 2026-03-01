import { CodingQuestion } from '../types';

// Enhanced Mock Data (Fallback & "My Solved" list)
// We keep this to ensure the demo always has some "Solved" items and code snippets
// which might not be available in the bulk API response.
const LOCAL_OVERRIDE_DATA: Record<string, Partial<CodingQuestion>> = {
    "1": {
        status: "Solved",
        snippet: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        prevMap = {} # val : index
        for i, n in enumerate(nums):
            diff = target - n
            if diff in prevMap:
                return [prevMap[diff], i]
            prevMap[n] = i
        return`,
        hint: "Use a Hash Map to store elements as you iterate. Check if (target - current) exists in the map.",
        acceptanceRate: 49.2
    },
    "2": {
        snippet: `class Solution:
    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
        dummy = ListNode()
        curr = dummy
        carry = 0
        while l1 or l2 or carry:
            # ... calculation
            curr.next = ListNode(val)
            curr = curr.next
        return dummy.next`,
        hint: "Traverse both linked lists simultaneously. Maintain a 'carry' variable for sums > 9. Create new nodes for (sum % 10).",
        acceptanceRate: 40.1
    },
    "3": { 
        status: "Solved", 
        acceptanceRate: 33.8,
        hint: "Use the Sliding Window technique. Keep a Set or Map to track characters in the current window. If you see a duplicate, shrink the window from the left."
    },
    "146": { 
        status: "Solved", 
        acceptanceRate: 40.5,
        hint: "Combine a Hash Map (for O(1) access) with a Doubly Linked List (for O(1) eviction). The Map stores keys pointing to nodes in the list."
    },
    "20": { 
        status: "Solved", 
        acceptanceRate: 40.3,
        hint: "Use a Stack. Iterate through the string; push opening brackets onto the stack. For closing brackets, pop and check if it matches the current one."
    },
    "42": {
        hint: "Compute 'max_left' and 'max_right' for each position. Water at index i = min(max_left[i], max_right[i]) - height[i]. Alternatively, use Two Pointers.",
        acceptanceRate: 59.5
    },
    "200": {
        hint: "Iterate through the grid. Whenever you encounter a '1', increment the island count and trigger a DFS or BFS to mark all connected '1's as visited (or '0').",
        acceptanceRate: 56.8
    }
};

const FALLBACK_DATA: CodingQuestion[] = [
    { id: '1', title: "Two Sum", slug: "two-sum", difficulty: "Easy", status: "Solved", tags: ["Array", "Hash Table"], platform: "LeetCode", acceptanceRate: 49.2 },
    { id: '2', title: "Add Two Numbers", slug: "add-two-numbers", difficulty: "Medium", status: "Todo", tags: ["Linked List", "Math"], platform: "LeetCode", acceptanceRate: 40.1 },
    { id: '3', title: "Longest Substring Without Repeating Characters", slug: "longest-substring-without-repeating-characters", difficulty: "Medium", status: "Solved", tags: ["Hash Table", "String"], platform: "LeetCode", acceptanceRate: 33.8 },
    { id: '4', title: "Median of Two Sorted Arrays", slug: "median-of-two-sorted-arrays", difficulty: "Hard", status: "Attempted", tags: ["Binary Search"], platform: "LeetCode", acceptanceRate: 35.6 },
    { id: '5', title: "Longest Palindromic Substring", slug: "longest-palindromic-substring", difficulty: "Medium", status: "Todo", tags: ["String", "DP"], platform: "LeetCode", acceptanceRate: 32.4 },
    { id: '20', title: "Valid Parentheses", slug: "valid-parentheses", difficulty: "Easy", status: "Solved", tags: ["String", "Stack"], platform: "LeetCode", acceptanceRate: 40.3 },
    { id: '21', title: "Merge Two Sorted Lists", slug: "merge-two-sorted-lists", difficulty: "Easy", status: "Todo", tags: ["Linked List"], platform: "LeetCode", acceptanceRate: 62.1 },
    { id: '42', title: "Trapping Rain Water", slug: "trapping-rain-water", difficulty: "Hard", status: "Todo", tags: ["Array", "Two Pointers"], platform: "LeetCode", acceptanceRate: 59.5 },
    { id: '200', title: "Number of Islands", slug: "number-of-islands", difficulty: "Medium", status: "Todo", tags: ["Array", "DFS"], platform: "LeetCode", acceptanceRate: 56.8 },
    { id: '146', title: "LRU Cache", slug: "lru-cache", difficulty: "Medium", status: "Solved", tags: ["Design", "Hash Table"], platform: "LeetCode", acceptanceRate: 40.5 },
];

const CACHE_KEY = 'interviewx_leetcode_questions';
const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

export const LeetCodeService = {
    fetchQuestions: async (): Promise<CodingQuestion[]> => {
        // 1. Try to load from Cache
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            try {
                const { data, timestamp } = JSON.parse(cached);
                // If cache is valid (less than 24h old), return it immediately
                if (Date.now() - timestamp < CACHE_EXPIRY_MS && Array.isArray(data) && data.length > 0) {
                    console.log("Loaded questions from cache");
                    return data;
                }
            } catch (e) {
                console.warn("Invalid cache data", e);
                localStorage.removeItem(CACHE_KEY);
            }
        }

        // 2. Fetch from API
        try {
            console.log("Fetching questions from API...");
            // Using a public unofficial API to fetch the problem list
            // NOTE: This server spins down on free tier, might take 10-30s initially.
            const response = await fetch('https://alfa-leetcode-api.onrender.com/problems?limit=3000');
            
            if (!response.ok) {
                throw new Error(`API unavailable: ${response.statusText}`);
            }

            const data = await response.json();
            const apiList = data.problemsetQuestionList || [];

            if (apiList.length === 0) throw new Error("Empty list returned");

            // Transform API data to our app's format
            const transformedList = apiList.map((q: any) => {
                const id = q.questionFrontendId;
                const override = LOCAL_OVERRIDE_DATA[id] || {};
                const tags = q.topicTags?.map((t: any) => t.name) || [];
                
                // Generate a generic hint if no specific one exists
                const genericHint = tags.length > 0 
                    ? `This problem is related to ${tags.join(', ')}. Review standard patterns for these topics.`
                    : "Analyze the constraints carefully. Is there a brute force solution? Can you optimize it?";

                return {
                    id: id,
                    title: q.title,
                    slug: q.titleSlug,
                    difficulty: q.difficulty,
                    status: override.status || 'Todo', // Default to Todo unless locally overridden
                    tags: tags,
                    platform: 'LeetCode',
                    acceptanceRate: override.acceptanceRate || (q.acRate ? parseFloat(q.acRate.toFixed(1)) : (Math.random() * 60 + 20).toFixed(1)),
                    snippet: override.snippet, // Keep local snippets
                    hint: override.hint || genericHint
                } as CodingQuestion;
            });

            // 3. Save to Cache
            try {
                localStorage.setItem(CACHE_KEY, JSON.stringify({
                    timestamp: Date.now(),
                    data: transformedList
                }));
            } catch (e) {
                console.warn("Failed to save to cache (quota exceeded?)", e);
            }

            return transformedList;

        } catch (error) {
            console.info("LeetCode API fetch failed or timed out. Checking for stale cache...", error);
            
            // 4. Fallback: Try Stale Cache if API fails
            if (cached) {
                try {
                    const { data } = JSON.parse(cached);
                    if (Array.isArray(data) && data.length > 0) {
                        console.log("Using stale cache due to API failure");
                        return data;
                    }
                } catch(e) {}
            }

            console.info("Using hardcoded fallback data.");
            // 5. Final Fallback: Hardcoded small list
            return FALLBACK_DATA.map(q => ({
                ...q,
                ...LOCAL_OVERRIDE_DATA[q.id],
                hint: LOCAL_OVERRIDE_DATA[q.id]?.hint || "Review the problem tags for clues."
            }));
        }
    },

    syncUserStatus: async (username: string): Promise<Record<string, 'Solved' | 'Todo'>> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    'two-sum': 'Solved',
                    'lru-cache': 'Solved'
                });
            }, 1000);
        });
    }
};