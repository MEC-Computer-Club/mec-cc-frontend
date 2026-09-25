/**
 * TLE-31 Competitive Programming Practice Sheet Dataset
 * Curated Codeforces problems across ratings 800 to 1600.
 */

export interface CPProblem {
  id: string; // e.g. "1903A"
  contestId: number;
  index: string;
  title: string;
  rating: number;
  order: number;
  url: string;
  tags: string[];
  hint: string;
  videoUrl: string;
  solutionCode?: {
    cpp?: string;
    python?: string;
  };
}

export const CP_SHEET_PROBLEMS: CPProblem[] = [
  {
    "id": "1903A",
    "contestId": 1903,
    "index": "A",
    "title": "Halloumi Boxes",
    "rating": 800,
    "url": "https://codeforces.com/problemset/problem/1903/A",
    "tags": [
      "brute force",
      "greedy",
      "sortings"
    ],
    "hint": "If k >= 2, you can swap any two adjacent elements by reversing a size-2 subarray, which allows bubble sorting any permutation. If k = 1, can you reorder elements at all?",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1903A+Halloumi%20Boxes+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid halloumi_box(int n, int k,vector<long long>&box)\n{\n    vector<long long> copy_box = box;\n    sort(copy_box.begin(), copy_box.end());\n    if(copy_box == box || k > 1)\n    {\n        cout<<\"YES\"<<\"\\n\";\n    }\n    else{\n        cout<<\"NO\"<<\"\\n\";\n    }\n}\n\nint main()\n{\n    ios_base::sync_with_stdio(0);\n    cin.tie(0);\n    cout.tie(0);\n    int tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long n, k;\n        cin >> n >> k;\n        vector<long long> box(n);\n        for (int i = 0; i < n; i++)\n        {\n            cin >> box[i];\n        }\n        halloumi_box(n, k,box);\n    }\n    return 0;\n}"
    },
    "order": 1
  },
  {
    "id": "1901A",
    "contestId": 1901,
    "index": "A",
    "title": "Line Trip",
    "rating": 800,
    "url": "https://codeforces.com/problemset/problem/1901/A",
    "tags": [
      "greedy",
      "math"
    ],
    "hint": "Calculate distances between consecutive gas stations. Note that travelling from the last station to x and turning back requires double the distance between the last station and x.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1901A+Line%20Trip+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid minimumPossibleVolume(vector<long long>&gasStation)\n{\n    int n = gasStation.size();\n    long long max_distance_between_point = INT_MIN;\n    for (int i = 1; i < n; i++)\n    {\n        if (i == n - 1)\n        {\n            max_distance_between_point = max(max_distance_between_point, 2 * (gasStation[i] - gasStation[i - 1]));\n        } \n        else    \n        {\n            max_distance_between_point = max(max_distance_between_point, gasStation[i] - gasStation[i - 1]);\n        }\n    }\n    cout << max_distance_between_point << \"\\n\";\n}\n\nint main()\n{\n    ios_base::sync_with_stdio(0);\n    cin.tie(0);\n    cout.tie(0);\n    int tt;\n    cin >> tt;\n    while (tt--)\n    {\n        // Input\n        long long n, x;\n        cin >> n >> x;\n        vector<long long> gasStation(n);\n        gasStation.push_back(0);\n        for (int i = 0; i < n; i++)\n        {\n            long long point;\n            cin >> point;\n            gasStation.push_back(point);\n        }\n        gasStation.push_back(x);\n        // Function minimum Possible volume\n        minimumPossibleVolume(gasStation);\n    }\n\n    return 0;\n}"
    },
    "order": 2
  },
  {
    "id": "1900A",
    "contestId": 1900,
    "index": "A",
    "title": "Cover in Water",
    "rating": 800,
    "url": "https://codeforces.com/problemset/problem/1900/A",
    "tags": [
      "constructive algorithms",
      "greedy",
      "implementation",
      "strings"
    ],
    "hint": "Look for three consecutive empty cells '...'. With three dots, you can create infinite water in just 2 moves. If no three dots exist, count the individual empty cells.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1900A+Cover%20in%20Water+editorial",
    "solutionCode": {
      "cpp": "#include<bits/stdc++.h>\nusing namespace std;\n\nvoid fillWater(int n, string &s)\n{\n\n        bool continous_three_empty_space = false;\n        int total_count_empty_cell = 0;\n        for(int i=0; i<n ; i++)\n        {   \n            if(s[i] == '.' && i + 1 < n && s[i+ 1] == '.' && i + 2 < n && s[i + 2] == '.')\n            {\n                continous_three_empty_space = true;\n                break;\n            }\n            if(s[i] == '.')\n            {\n                total_count_empty_cell++;\n            }\n        }\n        if(continous_three_empty_space)\n        {\n            cout<<2<<\"\\n\";\n        }\n        else{\n            cout<<total_count_empty_cell<<\"\\n\";\n        }\n}\n\n\nint main()\n{\n    ios_base::sync_with_stdio(0);\n    cin.tie(0);\n    cout.tie(0);\n    int tt;\n    cin >> tt;\n    while (tt--)\n    {\n        int n;\n        cin>>n;\n        string s;\n        cin>>s;\n        fillWater(n, s);\n    }\n    return 0;\n}"
    },
    "order": 3
  },
  {
    "id": "1899A",
    "contestId": 1899,
    "index": "A",
    "title": "Game with Integers",
    "rating": 800,
    "url": "https://codeforces.com/problemset/problem/1899/A",
    "tags": [
      "games",
      "math",
      "number theory"
    ],
    "hint": "Vanya wins if (n - 1) or (n + 1) is divisible by 3, which happens whenever n % 3 != 0. Otherwise, Vova can always counter Vanya and win.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1899A+Game%20with%20Integers+editorial",
    "solutionCode": {
      "cpp": "# include<bits/stdc++.h>\n\nusing namespace std;\n\n\nint main()\n{\n    ios_base::sync_with_stdio(0);\n    cin.tie(0);\n    cout.tie(0);\n    int tt;\n    cin>>tt;\n    while(tt--)\n    {\n        int n;\n        cin>>n;\n        if(n==1 || (n-1)%3==0 || (n+1) %3 ==0)\n        {\n            cout<<\"First\"<<\"\\n\";\n        }\n        else{\n            cout<<\"Second\"<<\"\\n\";\n        }\n    }\n    return 0;\n}"
    },
    "order": 4
  },
  {
    "id": "1896A",
    "contestId": 1896,
    "index": "A",
    "title": "Jagged Swaps",
    "rating": 800,
    "url": "https://codeforces.com/problemset/problem/1896/A",
    "tags": [
      "sortings"
    ],
    "hint": "Notice that the first element a[1] can never be swapped because an index i must satisfy 1 < i < n. If a[1] is not 1, is it ever possible to sort the array?",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1896A+Jagged%20Swaps+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    ios_base::sync_with_stdio(0);\n    cin.tie(0);\n    cout.tie(0);\n    int tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long n;\n        cin >> n;\n        vector<long long> permutation(n);\n        for (int i = 0; i < n; i++)\n        {\n            cin >> permutation[i];\n        }\n\n        if(permutation[0] == 1)\n        {\n            cout<<\"YES\"<<\"\\n\";\n        }\n        else{\n            cout<<\"NO\"<<\"\\n\";\n        }\n    }\n    return 0;\n}"
    },
    "order": 5
  },
  {
    "id": "1890A",
    "contestId": 1890,
    "index": "A",
    "title": "Doremy's Paint 3",
    "rating": 800,
    "url": "https://codeforces.com/problemset/problem/1890/A",
    "tags": [
      "constructive algorithms"
    ],
    "hint": "An array can be made good if and only if it consists of at most 2 distinct elements, and their frequencies differ by at most 1.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1890A+Doremy's%20Paint%203+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    ios_base::sync_with_stdio(0);\n    cin.tie(0);\n    cout.tie(0);\n    int tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long n;\n        cin >> n;\n        vector<long long> a(n);\n        for (int i = 0; i < n; i++)\n        {\n            cin >> a[i];\n        }\n\n        map<long long, long long> frequency_map;\n        for(int i=0; i<n; i++)\n        {\n            frequency_map[a[i]]++;\n        }\n        if(frequency_map.size()>=3){\n            cout<<\"No\"<<\"\\n\";\n        }\n        else{ \n            // begin first Elemnent and rbegin last element\n            long long freq_1 = frequency_map.begin()->second;\n            long long freq_2 = frequency_map.rbegin()->second;\n            if(freq_1 == freq_2)\n            {\n                cout<<\"Yes\"<<\"\\n\";\n            }\n            else if(n % 2 ==1 && abs(freq_1 - freq_2) == 1){\n                cout<<\"Yes\"<<\"\\n\";\n            }\n            else{\n                cout<<\"No\"<<\"\\n\";\n            }\n        }\n    }\n    return 0;\n}"
    },
    "order": 6
  },
  {
    "id": "1881A",
    "contestId": 1881,
    "index": "A",
    "title": "Don't Try to Count",
    "rating": 800,
    "url": "https://codeforces.com/problemset/problem/1881/A",
    "tags": [
      "brute force",
      "strings"
    ],
    "hint": "Track character frequencies, prefixes, or palindrome symmetry. Often checking prefix and suffix matches in linear time avoids costly quadratic nested loops.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1881A+Don't%20Try%20to%20Count+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n \nbool check(string s, string x)\n{\n    if (x.size() < s.size())\n    {\n        return false;\n    }\n    for (int i = 0; i < x.size() - s.size() + 1; i++) \n    {\n        if (x.substr(i, s.size()) == s)\n        {\n            return true;\n        }\n    }\n    return false;\n} \n \nint main()\n{\n    ios_base::sync_with_stdio(0);\n    cin.tie(0);\n    cout.tie(0);\n    int tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long n, m;\n        cin >> n >> m;\n        string x;\n        cin >> x;\n        string s;\n        cin >> s;\n\n        string x0 = x;\n        string x1 = x0 + x0; \n        string x2 = x1 + x1;\n        string x3 = x2 + x2; \n        string x4 = x3 + x3; \n        string x5 = x4 + x4; \n \n        long long ans = -1;\n        if (check(s, x0))\n            ans = 0;\n        else if (check(s, x1))\n            ans = 1;\n        else if (check(s, x2))\n            ans = 2;\n        else if (check(s, x3))\n            ans = 3;\n        else if (check(s, x4))\n            ans = 4;\n        else if (check(s, x5))\n            ans = 5;\n        cout << ans << \"\\n\";\n    }\n    return 0;\n}"
    },
    "order": 7
  },
  {
    "id": "1878A",
    "contestId": 1878,
    "index": "A",
    "title": "How Much Does Daytona Cost?",
    "rating": 800,
    "url": "https://codeforces.com/problemset/problem/1878/A",
    "tags": [
      "greedy"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1878A+How%20Much%20Does%20Daytona%20Cost%3F+editorial",
    "solutionCode": {
      "cpp": "#include<bits/stdc++.h>\nusing namespace std;\n// Aproach 1 checking each if found break\n// int main()\n// {\n//     ios_base::sync_with_stdio(0); \n//     cin.tie(0);\n//     cout.tie(0);\n//     int tt;\n//     cin>>tt;\n//     while(tt--)\n//     {\n//         long long n,k;\n//         cin>>n>>k;\n//         vector<long long> subarray(n);\n//         for(int i=0; i<n; i++)\n//         {\n//             cin>>subarray[i];\n//         }\n//         bool check= false;\n//         for(int i=0; i<n; i++)\n//         {\n//            if(subarray[i] == k)\n//            {\n//             check = true;\n//             break;\n//            } \n//         }\n//         if(check)\n//         {\n//             cout<<\"YES\"<<\"\\n\";\n//         }\n//         else{\n//             cout<<\"NO\"<<\"\\n\";\n//         }\n//     }\n//     return 0;\n// }\n\n// approach 2 using count\n\n\nint main()\n{\n    ios_base::sync_with_stdio(0); \n    cin.tie(0);\n    cout.tie(0);\n    int tt;\n    cin>>tt;\n    while(tt--)\n    {\n        long long n,k;\n        cin>>n>>k;\n        vector<long long> subarray(n);\n        for(int i=0; i<n; i++)\n        {\n            cin>>subarray[i];\n        }\n        if(count(subarray.begin(),subarray.end(),k)>0){\n            cout<<\"YES\"<<\"\\n\";\n        }\n        else{\n            cout<<\"NO\"<<\"\\n\";\n        }\n    }\n    return 0;\n}"
    },
    "order": 8
  },
  {
    "id": "1877A",
    "contestId": 1877,
    "index": "A",
    "title": "Goals of Victory",
    "rating": 800,
    "url": "https://codeforces.com/problemset/problem/1877/A",
    "tags": [
      "math"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1877A+Goals%20of%20Victory+editorial",
    "solutionCode": {
      "cpp": "#include<bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    ios_base::sync_with_stdio(0);\n    cin.tie(0);\n    cout.tie(0);\n    long long tt;\n    cin>>tt;\n    while(tt--){\n        long long n;\n        cin>>n;\n        vector<long long> a(n);\n        for (int i = 1; i < n; i++)\n        {\n            cin >> a[i];\n        }\n        long long sum = 0;\n        for(int i=0; i<n;  i++)\n        {\n            sum +=a[i];\n        }\n        cout<<(-sum)<<\"\\n\";\n        \n    }\n    return 0;\n}"
    },
    "order": 9
  },
  {
    "id": "1873C",
    "contestId": 1873,
    "index": "C",
    "title": "Target Practice",
    "rating": 800,
    "url": "https://codeforces.com/problemset/problem/1873/C",
    "tags": [
      "implementation",
      "math"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1873C+Target%20Practice+editorial",
    "solutionCode": {
      "cpp": "#include<bits/stdc++.h>\nusing namespace std;\n\nconst int score[10][10] = {\n\t{1,1,1,1,1,1,1,1,1,1},\n\t{1,2,2,2,2,2,2,2,2,1},\n\t{1,2,3,3,3,3,3,3,2,1},\n\t{1,2,3,4,4,4,4,3,2,1},\n\t{1,2,3,4,5,5,4,3,2,1},\n\t{1,2,3,4,5,5,4,3,2,1},\n\t{1,2,3,4,4,4,4,3,2,1},\n\t{1,2,3,3,3,3,3,3,2,1},\n\t{1,2,2,2,2,2,2,2,2,1},\n\t{1,1,1,1,1,1,1,1,1,1}\n};\n\nint main(){\n    ios_base::sync_with_stdio(0);\n    cin.tie(0);\n    cout.tie(0);\n    long long tt;\n    cin>>tt;\n    while(tt--)\n    {\n        char a[10][10];\n        for(int i=0; i<10; i++) // N\n        {\n            string s;\n            cin>>s;\n            for(int j=0; j<10; j++) // N*N\n            {\n                a[i][j] = s[j];\n            }\n        }\n        int total = 0;\n        for(int i=0; i<10; i++) // N\n        {\n            for(int j=0; j<10; j++){  // N*N\n                if(a[i][j] == 'X'){\n                    total +=score[i][j];\n                }\n            }\n        }\n        cout<<total<<\"\\n\";\n    }\n\n    return 0;\n}\n\n// TC : O(N*N + N*N) => O(N*N)\n// SC : O(N*N)"
    },
    "order": 10
  },
  {
    "id": "1866A",
    "contestId": 1866,
    "index": "A",
    "title": "Ambitious Kid",
    "rating": 800,
    "url": "https://codeforces.com/problemset/problem/1866/A",
    "tags": [
      "math"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1866A+Ambitious%20Kid+editorial",
    "solutionCode": {
      "cpp": "#include<bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    ios_base::sync_with_stdio(0);\n    cin.tie(0);\n    cout.tie(0);\n    long long n;\n    cin>>n;\n    long long a[n];\n    for(int i=0; i<n; i++)\n    {\n        cin>>a[i];\n    }\n    long long minimum_operation = INT_MAX;\n    for(int i=0; i<n; i++)\n    {\n        minimum_operation = min(minimum_operation, abs(a[i]));\n    }\n    cout<<minimum_operation<<\"\\n\";\n\n    return 0;\n}"
    },
    "order": 11
  },
  {
    "id": "1862B",
    "contestId": 1862,
    "index": "B",
    "title": "Sequence Game",
    "rating": 800,
    "url": "https://codeforces.com/problemset/problem/1862/B",
    "tags": [
      "constructive algorithms"
    ],
    "hint": "Build a pattern step by step. Look at small examples (n=1, 2, 3) to uncover an invariant or periodic pattern that generalizes to any valid input.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1862B+Sequence%20Game+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    ios_base::sync_with_stdio(0);\n    cin.tie(0);\n    cout.tie(0);\n    int tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long n;\n        cin >> n;\n        vector<long long> b(n), a;\n        for (int i = 0; i < n; i++)\n        {\n            cin >> b[i];\n        }\n        a.push_back(b[0]);\n        for (int i = 1; i < n; i++)\n        {\n            if (b[i] >= b[i - 1])\n            {\n                a.push_back(b[i]);\n            }\n            else\n            {\n                a.push_back(b[i]);\n                a.push_back(b[i]);\n            }\n        }\n        cout << a.size() << \"\\n\";\n        for (auto it : a)\n        {\n            cout << it << \" \";\n        }\n        cout<<\"\\n\";\n    }\n        return 0;\n}"
    },
    "order": 12
  },
  {
    "id": "1859A",
    "contestId": 1859,
    "index": "A",
    "title": "United We Stand",
    "rating": 800,
    "url": "https://codeforces.com/problemset/problem/1859/A",
    "tags": [
      "constructive algorithms",
      "math",
      "number theory"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1859A+United%20We%20Stand+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    ios_base::sync_with_stdio(0);\n    cin.tie(0);\n    cout.tie(0);\n    int tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long n;\n        cin >> n;\n        vector<long long> a(n);\n        for (int i = 0; i < n; i++)\n        {\n            cin >> a[i];\n        }\n        vector<long long> b, c;\n        long long mx = *max_element(a.begin(), a.end());\n        for (int i = 0; i < n; i++)\n        {\n            if (a[i] != mx)\n            {\n                b.push_back(a[i]);\n            }\n            else\n            {\n                c.push_back(a[i]);\n            }\n        }\n        if (b.size() == 0)\n        {\n            cout << -1 << \"\\n\";\n        }\n        else\n        {\n            cout << b.size() << \" \" << c.size() << \"\\n\";\n            for (auto it : b)\n            {\n                cout << it<<\" \";\n                \n            }\n            cout<<\"\\n\";\n            for(auto it: c)\n            {\n                cout<<it<<\" \";\n            }\n            cout<<\"\\n\";\n        }\n    }\n    return 0;\n}"
    },
    "order": 13
  },
  {
    "id": "1858A",
    "contestId": 1858,
    "index": "A",
    "title": "Buttons",
    "rating": 800,
    "url": "https://codeforces.com/problemset/problem/1858/A",
    "tags": [
      "implementation",
      "math"
    ],
    "hint": "Compare the counts: Anna can press (a + c) buttons and Katie can press (b + c) buttons. If c is odd, Anna gets one extra turn with c; if c is even, both get equal turns from c.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1858A+Buttons+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    long long a, b, c;\n    if (!(cin >> a >> b >> c)) return;\n    if (a + (c + 1) / 2 > b + c / 2) {\n        cout << \"First\\n\";\n    } else {\n        cout << \"Second\\n\";\n    }\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 14
  },
  {
    "id": "1857A",
    "contestId": 1857,
    "index": "A",
    "title": "Array Coloring",
    "rating": 800,
    "url": "https://codeforces.com/problemset/problem/1857/A",
    "tags": [
      "greedy",
      "math"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1857A+Array%20Coloring+editorial",
    "solutionCode": {
      "cpp": "#include<bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    ios_base::sync_with_stdio(0);\n    cin.tie(0);\n    cout.tie(0);\n    int tt;\n    cin >> tt;\n    while(tt--)\n    {\n        long long  n;\n        cin>>n;\n        long long a[n];\n        for(int i=0; i<n; i++)\n        {\n            cin>>a[i];\n        }\n        long long count_odd = 0;\n        for (int i = 0; i < n; i++)\n        {\n            if (a[i] % 2 == 1)\n                count_odd++;\n        }\n        if(count_odd %2 == 1){\n            cout<<\"NO\"<<\"\\n\";\n        }\n        else{\n            cout<<\"YES\"<<\"\\n\";\n        }\n    }\n\n    return 0;\n}"
    },
    "order": 15
  },
  {
    "id": "1853A",
    "contestId": 1853,
    "index": "A",
    "title": "Desorting",
    "rating": 800,
    "url": "https://codeforces.com/problemset/problem/1853/A",
    "tags": [
      "brute force",
      "greedy",
      "math"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1853A+Desorting+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    \n    ios_base::sync_with_stdio(0);\n    cin.tie(0);\n    cout.tie(0);\n    int tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long n;\n        cin >> n;\n        long long a[n];\n        for (int i = 0; i < n; i++) \n            cin >> a[i];\n\n        long long operations = INT_MAX;\n        for (int i = 0; i < n - 1; i++) \n        {\n            if (a[i] <= a[i + 1])\n            {\n                long long diff = a[i + 1] - a[i];\n                long long required_operations = diff / 2 + 1;\n                operations = min(operations, required_operations);\n            }\n            else \n                operations = 0;\n        }\n\n        cout << operations << \"\\n\";\n    }\n    return 0;\n}"
    },
    "order": 16
  },
  {
    "id": "1845A",
    "contestId": 1845,
    "index": "A",
    "title": "Forbidden Integer",
    "rating": 800,
    "url": "https://codeforces.com/problemset/problem/1845/A",
    "tags": [
      "constructive algorithms",
      "implementation",
      "math",
      "number theory"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1845A+Forbidden%20Integer+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    ios_base::sync_with_stdio(0);\n    cin.tie(0);\n    cout.tie(0);\n    int tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long n, k, x;\n        cin >> n >> k >> x;\n        \n        if (x != 1)\n        {\n            cout << \"YES\" << \"\\n\";\n            cout << n << \"\\n\";\n            for (int i = 1; i <= n; i++) \n                cout << 1 << \" \";\n            cout << \"\\n\";\n        }\n        else\n        {\n            if (k == 1 || (k == 2 && n % 2 == 1))\n                cout << \"NO\" << \"\\n\";\n            else\n            {\n                cout << \"YES\" << \"\\n\";\n                if (n % 2 == 0)\n                {\n                    cout << n / 2 << \"\\n\";\n                    for (int i = 1; i <= n / 2; i++) \n                        cout << 2 << \" \";\n                    cout << \"\\n\";\n                }\n                else\n                {\n                    cout << (n - 3) / 2 + 1 << \"\\n\";\n                    for (int i = 1; i <= (n - 3) / 2; i++) \n                        cout << 2 << \" \";\n                    cout << 3 << \"\\n\";\n                }\n            }\n        }\n    }\n    return 0;\n}"
    },
    "order": 17
  },
  {
    "id": "1837A",
    "contestId": 1837,
    "index": "A",
    "title": "Grasshopper on a Line",
    "rating": 800,
    "url": "https://codeforces.com/problemset/problem/1837/A",
    "tags": [
      "constructive algorithms",
      "math"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1837A+Grasshopper%20on%20a%20Line+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    ios_base::sync_with_stdio(0);\n    cin.tie(0);\n    cout.tie(0);\n    int tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long x , k;\n        cin>>x>>k;\n        if(x % k == 0){\n            cout<< 2 <<\"\\n\";\n            cout<< 1 <<\" \"<< x-1 <<\"\\n\";\n        } \n        else{\n            cout<<1<<\"\\n\";\n            cout<<x<<\"\\n\";\n        }\n    }\n    return 0;\n}"
    },
    "order": 18
  },
  {
    "id": "1834A",
    "contestId": 1834,
    "index": "A",
    "title": "Unit Array",
    "rating": 800,
    "url": "https://codeforces.com/problemset/problem/1834/A",
    "tags": [
      "greedy",
      "math"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1834A+Unit%20Array+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    ios_base::sync_with_stdio(0);\n    cin.tie(0);\n    cout.tie(0);\n    int tt;\n    cin >> tt;\n    while (tt--)\n    {\n        int n;\n        cin>>n;\n\n        vector<int> a(n);\n\n        for(int i=0; i<n; i++){\n            cin>>a[i];\n        }\n        int positive_count = 0;    // 1 count \n        int negative_count = 0;    // -1 count\n\n        for(int i=0; i<n; i++)\n        {\n            if(a[i] == 1){\n                positive_count++;\n            }\n            else{\n                negative_count++;\n            }\n        }\n        int operations= 0;\n\n        while(positive_count < negative_count || negative_count % 2 == 1){\n            operations++;\n            positive_count++;\n            negative_count--;\n        }\n        cout<<operations<<\"\\n\";\n    }\n    return 0;\n}"
    },
    "order": 19
  },
  {
    "id": "1831A",
    "contestId": 1831,
    "index": "A",
    "title": "Twin Permutations",
    "rating": 800,
    "url": "https://codeforces.com/problemset/problem/1831/A",
    "tags": [
      "constructive algorithms"
    ],
    "hint": "Build a pattern step by step. Look at small examples (n=1, 2, 3) to uncover an invariant or periodic pattern that generalizes to any valid input.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1831A+Twin%20Permutations+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    ios_base::sync_with_stdio(0);\n    cin.tie(0);\n    cout.tie(0);\n    int tt;\n    cin >> tt;\n    while (tt--)\n    {\n\n        long long n;\n        cin >> n;\n        long long a[n];\n        for (int i = 0; i < n; i++) // n\n            cin >> a[i];\n \n        for (int i = 0; i < n; i++) // n\n        {\n            cout << n + 1 - a[i] << \" \";\n        }\n        cout << \"\\n\";\n    }\n\n    return 0;\n}"
    },
    "order": 20
  },
  {
    "id": "1829B",
    "contestId": 1829,
    "index": "B",
    "title": "Blank Space",
    "rating": 800,
    "url": "https://codeforces.com/problemset/problem/1829/B",
    "tags": [
      "implementation"
    ],
    "hint": "Test small examples by hand, identify invariants preserved under the problem operations, and consider extreme corner cases (e.g. n=1, all equal elements).",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1829B+Blank%20Space+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n\n  ios_base::sync_with_stdio(0);\n    cin.tie(0);\n    cout.tie(0);\n    int tt;\n    cin >> tt;\n    while (tt--){\n    \n        long long n;\n        cin >> n;\n        long long a[n];\n        for (int i = 0; i < n; i++) \n            cin >> a[i];\n \n        long long count_of_zeroes = 0;\n        long long maximum_length = 0;\n        for (int i = 0; i < n; i++) \n        {\n            if (a[i] == 0)\n                count_of_zeroes++; \n            else\n                count_of_zeroes = 0; \n            \n            maximum_length = max(maximum_length, count_of_zeroes);\n        }\n        cout << maximum_length << \"\\n\";\n    }\n    return 0;\n\n}"
    },
    "order": 21
  },
  {
    "id": "1814A",
    "contestId": 1814,
    "index": "A",
    "title": "Coins",
    "rating": 800,
    "url": "https://codeforces.com/problemset/problem/1814/A",
    "tags": [
      "implementation"
    ],
    "hint": "We want to pay n using coins of 2 and k: 2*x + k*y = n. If n is even, we can pay with only 2s. If n is odd and k is odd, we can use one coin of k and the remainder (n - k) is even.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1814A+Coins+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    long long n, k;\n    if (!(cin >> n >> k)) return;\n    if (n % 2 == 0) {\n        cout << \"YES\\n\";\n    } else if (k % 2 != 0 && n >= k) {\n        cout << \"YES\\n\";\n    } else {\n        cout << \"NO\\n\";\n    }\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 22
  },
  {
    "id": "1806A",
    "contestId": 1806,
    "index": "A",
    "title": "Walking Master",
    "rating": 800,
    "url": "https://codeforces.com/problemset/problem/1806/A",
    "tags": [
      "geometry",
      "greedy",
      "math"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1806A+Walking%20Master+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n\n    ios_base::sync_with_stdio(0);\n    cin.tie(0);\n    cout.tie(0);\n    long long tt;\n    cin >> tt;\n      while (tt--)\n    {\n        int source_x, source_y, destination_x, destination_y;\n        cin >> source_x >> source_y >> destination_x >> destination_y;\n        if (destination_y < source_y)\n        {\n            cout << -1 << \"\\n\";\n            continue;\n        }\n        int moves = destination_y - source_y;\n        source_x += moves;\n        if (source_x < destination_x)\n        {\n            cout << -1 << \"\\n\";\n            continue;\n        }\n        moves += (source_x - destination_x);\n        cout << moves << \"\\n\";\n    }\n    return 0;\n}"
    },
    "order": 23
  },
  {
    "id": "1805A",
    "contestId": 1805,
    "index": "A",
    "title": "We Need the Zero",
    "rating": 800,
    "url": "https://codeforces.com/problemset/problem/1805/A",
    "tags": [
      "bitmasks",
      "brute force"
    ],
    "hint": "Test small examples by hand, identify invariants preserved under the problem operations, and consider extreme corner cases (e.g. n=1, all equal elements).",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1805A+We%20Need%20the%20Zero+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n\n  ios_base::sync_with_stdio(0);\n    cin.tie(0);\n    cout.tie(0);\n    long long tt;\n    cin >> tt;\n    while (tt--){\n        long long n;\n        cin>>n;\n        long long a[n];\n        for(int i=0; i<n; i++){\n            cin>>a[i];\n        }\n        long long total_xor = 0;\n\n        for(int i=0; i<n; i++){\n                total_xor ^= a[i];\n        }\n\n        if(n % 2 == 1){\n            cout<<total_xor<<\"\\n\";\n        }\n\n        else{\n            if(total_xor  == 0){\n                cout<<total_xor<<\"\\n\";\n            }\n            else{\n                cout<<-1<<\"\\n\";\n            }\n        }\n    }\n    return 0;\n\n}"
    },
    "order": 24
  },
  {
    "id": "1791C",
    "contestId": 1791,
    "index": "C",
    "title": "Prepend and Append",
    "rating": 800,
    "url": "https://codeforces.com/problemset/problem/1791/C",
    "tags": [
      "implementation",
      "two pointers"
    ],
    "hint": "Notice that as the right pointer expands, the left pointer only needs to move forward. Maintain frequency counts or window invariants to keep the window valid in O(N) overall.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1791C+Prepend%20and%20Append+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n\n  ios_base::sync_with_stdio(0);\n    cin.tie(0);\n    cout.tie(0);\n    long long tt;\n    cin >> tt;\n    while (tt--){\n       long long n;\n       cin>>n;\n       string s;\n       cin>>s;\n\n       long long ans =n;\n       long long left =0, right = n-1;\n       while(left<=right){\n            if(s[left] !=s[right]){\n                ans-=2;\n            }\n            else{\n                break;\n            }\n            left++;\n            right--;\n       }\n       cout<<ans<<\"\\n\";\n    }\n    return 0;\n\n}"
    },
    "order": 25
  },
  {
    "id": "1789A",
    "contestId": 1789,
    "index": "A",
    "title": "Serval and Mocha's Array",
    "rating": 800,
    "url": "https://codeforces.com/problemset/problem/1789/A",
    "tags": [
      "brute force",
      "math",
      "number theory"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1789A+Serval%20and%20Mocha's%20Array+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    ios_base::sync_with_stdio(0);\n    cin.tie(0);\n    cout.tie(0);\n    int tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long n;\n        cin >> n;\n        vector<long long> a(n);\n        for (int i = 0; i < n; i++)\n        {\n            cin >> a[i];\n        }\n        int flag = 0;\n        for (int i = 0; i < n; i++)\n        {\n            for (int j = i + 1; j < n; j++)\n            {\n                if(__gcd(a[i],a[j]) <=2){\n                    flag = 1;\n                }\n            }\n        }\n\n        if(flag == 0){\n            cout<<\"No\"<<\"\\n\";\n        }\n        else{\n            cout<<\"Yes\"<<\"\\n\";\n        }\n    }\n    return 0;\n}"
    },
    "order": 26
  },
  {
    "id": "1788A",
    "contestId": 1788,
    "index": "A",
    "title": "One and Two",
    "rating": 800,
    "url": "https://codeforces.com/problemset/problem/1788/A",
    "tags": [
      "brute force",
      "implementation",
      "math"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1788A+One%20and%20Two+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    ios_base::sync_with_stdio(0);\n    cin.tie(0);\n    cout.tie(0);\n    int tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long n;\n        cin >> n;\n        vector<long long> a(n);\n        for (int i = 0; i < n; i++)\n        {\n            cin >> a[i];\n        }\n        long long total_number_of_twos = 0;\n        long long current_number_of_twos = 0;\n \n        for (long long i = 0; i < n; i++) \n        {\n            if (a[i] == 2)\n                total_number_of_twos++;\n        }\n \n        long long ans = -1;\n\n        for (long long i = 0; i < n; i++) \n        {\n            if (a[i] == 2)\n                current_number_of_twos++;\n \n            if ((current_number_of_twos) == (total_number_of_twos - current_number_of_twos))\n            {\n                ans = i + 1;\n                break;\n            }\n        }\n \n        cout << ans << endl;\n    }\n    return 0;\n    }"
    },
    "order": 27
  },
  {
    "id": "1783A",
    "contestId": 1783,
    "index": "A",
    "title": "Make it Beautiful",
    "rating": 800,
    "url": "https://codeforces.com/problemset/problem/1783/A",
    "tags": [
      "constructive algorithms",
      "math",
      "sortings"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1783A+Make%20it%20Beautiful+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    ios_base::sync_with_stdio(0);\n    cin.tie(0);\n    cout.tie(0);\n    int tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long n;\n        cin >> n;\n        long long a[n];\n        for (int i = 0; i < n; i++)\n        {\n            cin >> a[i];\n        }\n        sort(a, a + n);\n        long long max_number= a[n - 1];\n        long long min_number = a[0];\n        if(max_number == min_number)\n        {\n            cout << \"NO\" << \"\\n\";\n        }\n        else\n        {\n            cout << \"YES\" << \"\\n\";\n            cout<<max_number<<\" \";\n            for(int i=0; i<n-1; i++){\n                cout<<a[i]<<\" \";\n            }\n            cout<<\"\\n\";\n        }\n    }\n        return 0;\n\n}"
    },
    "order": 28
  },
  {
    "id": "1777A",
    "contestId": 1777,
    "index": "A",
    "title": "Everybody Likes Good Arrays!",
    "rating": 800,
    "url": "https://codeforces.com/problemset/problem/1777/A",
    "tags": [
      "greedy",
      "math"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1777A+Everybody%20Likes%20Good%20Arrays!+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    int tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long n;\n        cin >> n;\n        long long a[n];\n        for (long long i = 0; i < n; i++) // n\n            cin >> a[i];\n\n        long long operations_count = 0;\n\n        for (long long i = 0; i < n - 1; i++)\n        {\n            if ((a[i] % 2) == (a[i + 1] % 2))\n                operations_count++;\n        }\n        cout << operations_count << \"\\n\";\n    }\n    return 0;\n}"
    },
    "order": 29
  },
  {
    "id": "1766A",
    "contestId": 1766,
    "index": "A",
    "title": "Extremely Round",
    "rating": 800,
    "url": "https://codeforces.com/problemset/problem/1766/A",
    "tags": [
      "brute force",
      "implementation"
    ],
    "hint": "Test small examples by hand, identify invariants preserved under the problem operations, and consider extreme corner cases (e.g. n=1, all equal elements).",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1766A+Extremely%20Round+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nbool check(long long x) \n{\n    long long count_of_digits = 0; \n    long long count_of_zeroes = 0; \n    while (x) \n    {\n        if (x % 10 == 0) \n            count_of_zeroes++; \n        count_of_digits++; \n        x /= 10; \n    }\n    return count_of_zeroes == count_of_digits - 1;\n}\n\nint main()\n{\n    vector<long long> round_numbers;\n    for (long long i = 1; i <= 999999; i++) \n    {\n        if (check(i) == true) \n            round_numbers.push_back(i); \n    }\n\n    int tt;    \n    cin >> tt;\n    while (tt--)\n    {\n        long long n;\n        cin >> n;\n\n        long long answer = 0; \n        for (int i = 0; i < round_numbers.size(); i++) \n        {\n            if (round_numbers[i] <= n) \n                answer++; \n            else\n                break; \n        }\n        cout << answer << \"\\n\"; \n    }\n    return 0;\n}"
    },
    "order": 30
  },
  {
    "id": "1761A",
    "contestId": 1761,
    "index": "A",
    "title": "Two Permutations",
    "rating": 800,
    "url": "https://codeforces.com/problemset/problem/1761/A",
    "tags": [
      "data structures",
      "hashing",
      "strings"
    ],
    "hint": "If a == n and b == n, both permutations are identical and prefix/suffix equal n. Otherwise, the longest common prefix of length a and suffix of length b can only coexist if a + b + 2 <= n.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1761A+Two%20Permutations+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    long long n, a, b;\n    if (!(cin >> n >> a >> b)) return;\n    if (a == n && b == n) {\n        cout << \"Yes\\n\";\n    } else if (a + b + 2 <= n) {\n        cout << \"Yes\\n\";\n    } else {\n        cout << \"No\\n\";\n    }\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 31
  },
  {
    "id": "1742A",
    "contestId": 1742,
    "index": "A",
    "title": "Sum",
    "rating": 800,
    "url": "https://codeforces.com/problemset/problem/1742/A",
    "tags": [
      "implementation"
    ],
    "hint": "Test small examples by hand, identify invariants preserved under the problem operations, and consider extreme corner cases (e.g. n=1, all equal elements).",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1742A+Sum+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 32
  },
  {
    "id": "1703A",
    "contestId": 1703,
    "index": "A",
    "title": "YES or YES?",
    "rating": 800,
    "url": "https://codeforces.com/problemset/problem/1703/A",
    "tags": [
      "brute force",
      "implementation",
      "strings"
    ],
    "hint": "Track character frequencies, prefixes, or palindrome symmetry. Often checking prefix and suffix matches in linear time avoids costly quadratic nested loops.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1703A+YES%20or%20YES%3F+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 33
  },
  {
    "id": "1669A",
    "contestId": 1669,
    "index": "A",
    "title": "Division?",
    "rating": 800,
    "url": "https://codeforces.com/problemset/problem/1669/A",
    "tags": [
      "implementation"
    ],
    "hint": "Test small examples by hand, identify invariants preserved under the problem operations, and consider extreme corner cases (e.g. n=1, all equal elements).",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1669A+Division%3F+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 34
  },
  {
    "id": "1676A",
    "contestId": 1676,
    "index": "A",
    "title": "Lucky?",
    "rating": 800,
    "url": "https://codeforces.com/problemset/problem/1676/A",
    "tags": [
      "implementation"
    ],
    "hint": "Test small examples by hand, identify invariants preserved under the problem operations, and consider extreme corner cases (e.g. n=1, all equal elements).",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1676A+Lucky%3F+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 35
  },
  {
    "id": "1692A",
    "contestId": 1692,
    "index": "A",
    "title": "Marathon",
    "rating": 800,
    "url": "https://codeforces.com/problemset/problem/1692/A",
    "tags": [
      "implementation"
    ],
    "hint": "Test small examples by hand, identify invariants preserved under the problem operations, and consider extreme corner cases (e.g. n=1, all equal elements).",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1692A+Marathon+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 36
  },
  {
    "id": "1807A",
    "contestId": 1807,
    "index": "A",
    "title": "Plus or Minus",
    "rating": 800,
    "url": "https://codeforces.com/problemset/problem/1807/A",
    "tags": [
      "implementation"
    ],
    "hint": "Test small examples by hand, identify invariants preserved under the problem operations, and consider extreme corner cases (e.g. n=1, all equal elements).",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1807A+Plus%20or%20Minus+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 37
  },
  {
    "id": "1999A",
    "contestId": 1999,
    "index": "A",
    "title": "A+B Again?",
    "rating": 800,
    "url": "https://codeforces.com/problemset/problem/1999/A",
    "tags": [
      "implementation",
      "math"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1999A+A%2BB%20Again%3F+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 38
  },
  {
    "id": "1791A",
    "contestId": 1791,
    "index": "A",
    "title": "Codeforces Checking",
    "rating": 800,
    "url": "https://codeforces.com/problemset/problem/1791/A",
    "tags": [
      "implementation",
      "strings"
    ],
    "hint": "Track character frequencies, prefixes, or palindrome symmetry. Often checking prefix and suffix matches in linear time avoids costly quadratic nested loops.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1791A+Codeforces%20Checking+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 39
  },
  {
    "id": "1512A",
    "contestId": 1512,
    "index": "A",
    "title": "Spy Detected!",
    "rating": 800,
    "url": "https://codeforces.com/problemset/problem/1512/A",
    "tags": [
      "brute force",
      "implementation"
    ],
    "hint": "Test small examples by hand, identify invariants preserved under the problem operations, and consider extreme corner cases (e.g. n=1, all equal elements).",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1512A+Spy%20Detected!+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 40
  },
  {
    "id": "1915A",
    "contestId": 1915,
    "index": "A",
    "title": "Odd One Out",
    "rating": 800,
    "url": "https://codeforces.com/problemset/problem/1915/A",
    "tags": [
      "bitmasks",
      "implementation"
    ],
    "hint": "Test small examples by hand, identify invariants preserved under the problem operations, and consider extreme corner cases (e.g. n=1, all equal elements).",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1915A+Odd%20One%20Out+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 41
  },
  {
    "id": "1760A",
    "contestId": 1760,
    "index": "A",
    "title": "Medium Number",
    "rating": 800,
    "url": "https://codeforces.com/problemset/problem/1760/A",
    "tags": [
      "implementation",
      "sortings"
    ],
    "hint": "Sort the array to impose monotonic order. Pairing adjacent elements or extremes (min with max) typically resolves the main condition.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1760A+Medium%20Number+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 42
  },
  {
    "id": "1850A",
    "contestId": 1850,
    "index": "A",
    "title": "To My Critics",
    "rating": 800,
    "url": "https://codeforces.com/problemset/problem/1850/A",
    "tags": [
      "implementation",
      "sortings"
    ],
    "hint": "Sort the array to impose monotonic order. Pairing adjacent elements or extremes (min with max) typically resolves the main condition.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1850A+To%20My%20Critics+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 43
  },
  {
    "id": "2009A",
    "contestId": 2009,
    "index": "A",
    "title": "Minimize!",
    "rating": 800,
    "url": "https://codeforces.com/problemset/problem/2009/A",
    "tags": [
      "brute force",
      "math"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+2009A+Minimize!+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 44
  },
  {
    "id": "1560A",
    "contestId": 1560,
    "index": "A",
    "title": "Dislike of Threes",
    "rating": 800,
    "url": "https://codeforces.com/problemset/problem/1560/A",
    "tags": [
      "implementation"
    ],
    "hint": "Test small examples by hand, identify invariants preserved under the problem operations, and consider extreme corner cases (e.g. n=1, all equal elements).",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1560A+Dislike%20of%20Threes+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 45
  },
  {
    "id": "1985A",
    "contestId": 1985,
    "index": "A",
    "title": "Creating Words",
    "rating": 800,
    "url": "https://codeforces.com/problemset/problem/1985/A",
    "tags": [
      "implementation",
      "strings"
    ],
    "hint": "Track character frequencies, prefixes, or palindrome symmetry. Often checking prefix and suffix matches in linear time avoids costly quadratic nested loops.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1985A+Creating%20Words+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 46
  },
  {
    "id": "1873A",
    "contestId": 1873,
    "index": "A",
    "title": "Short Sort",
    "rating": 800,
    "url": "https://codeforces.com/problemset/problem/1873/A",
    "tags": [
      "brute force",
      "implementation"
    ],
    "hint": "Test small examples by hand, identify invariants preserved under the problem operations, and consider extreme corner cases (e.g. n=1, all equal elements).",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1873A+Short%20Sort+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 47
  },
  {
    "id": "1858A",
    "contestId": 1858,
    "index": "A",
    "title": "Buttons",
    "rating": 800,
    "url": "https://codeforces.com/problemset/problem/1858/A",
    "tags": [
      "games",
      "greedy",
      "math"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1858A+Buttons+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 48
  },
  {
    "id": "1829A",
    "contestId": 1829,
    "index": "A",
    "title": "Love Story",
    "rating": 800,
    "url": "https://codeforces.com/problemset/problem/1829/A",
    "tags": [
      "implementation",
      "strings"
    ],
    "hint": "Track character frequencies, prefixes, or palindrome symmetry. Often checking prefix and suffix matches in linear time avoids costly quadratic nested loops.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1829A+Love%20Story+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 49
  },
  {
    "id": "1950A",
    "contestId": 1950,
    "index": "A",
    "title": "Stair, Peak, or Neither?",
    "rating": 800,
    "url": "https://codeforces.com/problemset/problem/1950/A",
    "tags": [
      "implementation"
    ],
    "hint": "Test small examples by hand, identify invariants preserved under the problem operations, and consider extreme corner cases (e.g. n=1, all equal elements).",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1950A+Stair%2C%20Peak%2C%20or%20Neither%3F+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 50
  },
  {
    "id": "1904A",
    "contestId": 1904,
    "index": "A",
    "title": "Forked!",
    "rating": 900,
    "url": "https://codeforces.com/problemset/problem/1904/A",
    "tags": [
      "brute force",
      "implementation"
    ],
    "hint": "Test small examples by hand, identify invariants preserved under the problem operations, and consider extreme corner cases (e.g. n=1, all equal elements).",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1904A+Forked!+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint dx[4] = {-1, 1, -1, 1}, dy[4] = {-1, -1, 1, 1};\n\nint main()\n{\n    int tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long a, b;\n        cin >> a >> b;\n        long long x_king, y_king;\n        cin >> x_king >> y_king;\n        long long x_queen, y_queen;\n        cin >> x_queen >> y_queen;\n\n        set<pair<int,int>> king_hits, queen_hits;\n\n        for(int j = 0; j < 4; j++){ \n            king_hits.insert({x_king+dx[j]*a, y_king+dy[j]*b});\n            king_hits.insert({x_king+dx[j]*b, y_king+dy[j]*a});\n\n            queen_hits.insert({x_queen+dx[j]*a, y_queen+dy[j]*b});\n            queen_hits.insert({x_queen+dx[j]*b, y_queen+dy[j]*a});\n        }\n\n        int ans = 0;\n        for(auto position : king_hits) \n            if(queen_hits.find(position) != queen_hits.end())\n                ans++;\n        \n        cout << ans <<\"\\n\";\n    }\n    return 0;\n}"
    },
    "order": 1
  },
  {
    "id": "1883B",
    "contestId": 1883,
    "index": "B",
    "title": "Chemistry",
    "rating": 900,
    "url": "https://codeforces.com/problemset/problem/1883/B",
    "tags": [
      "strings"
    ],
    "hint": "Track character frequencies, prefixes, or palindrome symmetry. Often checking prefix and suffix matches in linear time avoids costly quadratic nested loops.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1883B+Chemistry+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    long long tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long n, k;\n        cin >> n >> k;\n        string s;\n        cin >> s;\n\n        vector<int> frequency_of_characters(26, 0);\n        for (int i = 0; i < n; i++) \n            frequency_of_characters[s[i] - 'a']++;\n\n        long long odd_frequency = 0;\n        for (int i = 0; i < 26; i++) \n            odd_frequency += frequency_of_characters[i] % 2;\n\n        if (odd_frequency > k + 1)\n            cout << \"NO\" << \"\\n\";\n        else\n            cout << \"YES\" << \"\\n\";\n    }\n    return 0;\n}"
    },
    "order": 2
  },
  {
    "id": "1878C",
    "contestId": 1878,
    "index": "C",
    "title": "Vasilije in Cacak",
    "rating": 900,
    "url": "https://codeforces.com/problemset/problem/1878/C",
    "tags": [
      "math"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1878C+Vasilije%20in%20Cacak+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    int tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long n, k, x;\n        cin >> n >> k >> x;\n        long long minimum_sum = (k * (k + 1)) / 2;\n        long long maximum_sum = (n * (n + 1)) / 2 - ((n - k) * (n - k + 1)) / 2;\n        if (x >= minimum_sum && x <= maximum_sum)\n            cout << \"YES\" << \"\\n\";\n        else\n            cout << \"NO\" << \"\\n\";\n    }\n    return 0;\n}"
    },
    "order": 3
  },
  {
    "id": "1875A",
    "contestId": 1875,
    "index": "A",
    "title": "Jellyfish and Undertale",
    "rating": 900,
    "url": "https://codeforces.com/problemset/problem/1875/A",
    "tags": [
      "brute force",
      "greedy"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1875A+Jellyfish%20and%20Undertale+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    int tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long a, b, n;\n        cin >> a >> b >> n;\n        long long x[n];\n        for (int i = 0; i < n; i++)\n            cin >> x[i];\n        long long maximum_time = b;\n        for (int i = 0; i < n; i++) \n            maximum_time += min(x[i], a - 1);\n\n        cout << maximum_time << \"\\n\";\n    }\n    return 0;\n}"
    },
    "order": 4
  },
  {
    "id": "1869A",
    "contestId": 1869,
    "index": "A",
    "title": "Make It Zero",
    "rating": 900,
    "url": "https://codeforces.com/problemset/problem/1869/A",
    "tags": [
      "constructive algorithms"
    ],
    "hint": "Build a pattern step by step. Look at small examples (n=1, 2, 3) to uncover an invariant or periodic pattern that generalizes to any valid input.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1869A+Make%20It%20Zero+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    int tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long n;\n        cin >> n;\n        long long a[n];\n        for (int i = 0; i < n; i++) \n            cin >> a[i];\n       \n        if (n % 2 == 0)\n        {\n            cout << 2 << \"\\n\";\n            cout << 1 << \" \" << n << \"\\n\";\n            cout << 1 << \" \" << n << \"\\n\";\n        }\n        else\n        {\n            cout << 4 << \"\\n\";\n            cout << 1 << \" \" << n - 1 << \"\\n\";\n            cout << 1 << \" \" << n - 1 << \"\\n\";\n            cout << n - 1 << \" \" << n <<\"\\n\";\n            cout << n - 1 << \" \" << n << \"\\n\";\n        }\n    }\n    return 0;\n}"
    },
    "order": 5
  },
  {
    "id": "1855B",
    "contestId": 1855,
    "index": "B",
    "title": "Longest Divisors Interval",
    "rating": 900,
    "url": "https://codeforces.com/problemset/problem/1855/B",
    "tags": [
      "brute force",
      "combinatorics",
      "greedy",
      "math",
      "number theory"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1855B+Longest%20Divisors%20Interval+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    int tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long n;\n        cin >> n;\n        int i = 1;\n        while (n % i == 0) \n            i++;\n        cout << i - 1 << \"\\n\";\n    }\n    return 0;\n}"
    },
    "order": 6
  },
  {
    "id": "1850D",
    "contestId": 1850,
    "index": "D",
    "title": "Balanced Round",
    "rating": 900,
    "url": "https://codeforces.com/problemset/problem/1850/D",
    "tags": [
      "brute force",
      "greedy",
      "implementation",
      "sortings"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1850D+Balanced%20Round+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    int tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long n, k;\n        cin >> n >> k;\n        vector<long long> a(n);\n        for (int i = 0; i < n; i++) \n            cin >> a[i];\n\n        sort(a.begin(), a.end()); \n\n        long long counter = 1;\n        long long largest_length = 1;\n        for (int i = 1; i < n; i++) \n        {\n            if (a[i] - a[i - 1] <= k)\n                counter++;\n            else\n                counter = 1;\n            largest_length = max(largest_length, counter);\n        }\n\n        cout << n - largest_length <<\"\\n\";\n    }\n    return 0;\n}"
    },
    "order": 7
  },
  {
    "id": "1837B",
    "contestId": 1837,
    "index": "B",
    "title": "Comparison String",
    "rating": 900,
    "url": "https://codeforces.com/problemset/problem/1837/B",
    "tags": [
      "greedy"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1837B+Comparison%20String+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    int tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long n;\n        cin >> n;\n        string s;\n        cin >> s;\n        long long longest_substring_length = 1;\n        long long current_substring_length = 1;\n\n        for (int i = 1; i < n; i++) \n        {\n            if (s[i] == s[i - 1])\n                current_substring_length++;\n            else\n            {\n                longest_substring_length =\n                    max(longest_substring_length, current_substring_length);\n                current_substring_length = 1;\n            }\n        }\n\n        longest_substring_length =\n            max(longest_substring_length, current_substring_length);\n\n        cout << longest_substring_length + 1 << \"\\n\";\n    }\n    return 0;\n}"
    },
    "order": 8
  },
  {
    "id": "1828B",
    "contestId": 1828,
    "index": "B",
    "title": "Permutation Swap",
    "rating": 900,
    "url": "https://codeforces.com/problemset/problem/1828/B",
    "tags": [
      "math",
      "number theory"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1828B+Permutation%20Swap+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    long long tt;\n    cin >> tt;\n    while (tt--)\n    {\n        int n;\n        cin >> n;\n        vector<int> a(n);\n        for (int i = 0; i < n; i++) \n            cin >> a[i];\n        \n        int k = abs(a[0] - 1);\n        for (int i = 1; i < n; i++) \n        {\n            k = gcd(k, abs(a[i] - (i + 1)));\n        }\n        cout << k << \"\\n\";\n    }\n    return 0;\n}"
    },
    "order": 9
  },
  {
    "id": "1807D",
    "contestId": 1807,
    "index": "D",
    "title": "Odd Queries",
    "rating": 900,
    "url": "https://codeforces.com/problemset/problem/1807/D",
    "tags": [
      "data structures",
      "implementation"
    ],
    "hint": "Speed up operations from O(N) to O(log N) using appropriate containers like std::set, std::map, or a Fenwick/Segment Tree for dynamic range queries and updates.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1807D+Odd%20Queries+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long n, q;\n        cin >> n >> q;\n        vector<long long> a(n);\n        for (int i = 0; i < n; i++) \n            cin >> a[i];\n\n        long long old_sum = 0;\n        for (int i = 0; i < n; i++) \n            old_sum += a[i];\n\n        vector<long long> prefix_sum(n + 1, 0);\n        for (int i = 1; i <= n; i++) \n            prefix_sum[i] = prefix_sum[i - 1] + a[i - 1];\n\n        while (q--)\n        {\n            long long l, r, k;\n            cin >> l >> r >> k;\n            long long sum_to_remove = prefix_sum[r] - prefix_sum[l - 1];\n            long long sum_to_add = (r - l + 1) * k;\n            long long total_sum = old_sum - sum_to_remove + sum_to_add;\n            if (total_sum % 2 == 1)\n                cout << \"YES\" << \"\\n\";\n            else\n                cout << \"NO\" << \"\\n\";\n        }\n    }\n    return 0;\n}"
    },
    "order": 10
  },
  {
    "id": "1794B",
    "contestId": 1794,
    "index": "B",
    "title": "Not Dividing",
    "rating": 900,
    "url": "https://codeforces.com/problemset/problem/1794/B",
    "tags": [
      "constructive algorithms",
      "greedy",
      "math"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1794B+Not%20Dividing+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int tt;\n    cin >> tt;\n    while (tt--)\n    {\n        int n;\n        cin >> n;\n        vector<int> a(n);\n        for (int i = 0; i < n; i++) \n            cin >> a[i];\n\n        for (int i = 0; i < n; i++) \n        {\n            if (a[i] == 1)\n                a[i]++;\n        }\n\n        // n\n        for (int i = 0; i < n - 1; i++)\n        {\n            if (a[i + 1] % a[i] == 0)\n                a[i + 1]++;\n        }\n\n        for (int i = 0; i < n; i++)\n            cout << a[i] << \" \";\n        cout << endl;\n    }\n    return 0;\n}"
    },
    "order": 11
  },
  {
    "id": "1726A",
    "contestId": 1726,
    "index": "A",
    "title": "Mainak and Array",
    "rating": 900,
    "url": "https://codeforces.com/problemset/problem/1726/A",
    "tags": [
      "greedy",
      "math"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1726A+Mainak%20and%20Array+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long n;\n        cin >> n;\n        vector<long long> v(n);\n        for (long long i = 0; i < n; i++) \n            cin >> v[i];\n\n        long long answer = v[n - 1] - v[0];\n\n        for (int i = 1; i < n; i++) \n            answer = max(answer, v[i] - v[0]);\n        for (int i = 0; i < n - 1; i++)\n            answer = max(answer, v[n - 1] - v[i]);\n        for (int i = 0; i < n - 1; i++)\n            answer = max(answer, v[i] - v[i + 1]);\n\n        cout << answer << endl;\n    }\n    return 0;\n}"
    },
    "order": 12
  },
  {
    "id": "1696B",
    "contestId": 1696,
    "index": "B",
    "title": "NIT Destroys the Universe",
    "rating": 900,
    "url": "https://codeforces.com/problemset/problem/1696/B",
    "tags": [
      "greedy"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1696B+NIT%20Destroys%20the%20Universe+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long n;\n        cin >> n;\n        long long a[n];\n        for (int i = 0; i < n; i++) \n            cin >> a[i];\n\n\n        int count_of_zero = 0;\n\n        for (int i = 0; i < n; i++) \n        {\n            if (a[i] == 0)\n                count_of_zero++;\n        }\n\n        bool found_zero = false;\n        int left = 0;\n        int right = n - 1;\n\n        while (a[left] == 0) \n            left++;\n        while (a[right] == 0) \n            right--;\n\n        for (int i = left; i <= right; i++) \n        {\n            if (a[i] == 0)\n                found_zero = true;\n        }\n\n        if (count_of_zero == n) \n            cout << 0 << endl;\n        else if (found_zero == false)\n            cout << 1 << endl;\n        else \n            cout << 2 << endl;\n    }\n    return 0;\n}"
    },
    "order": 13
  },
  {
    "id": "1679A",
    "contestId": 1679,
    "index": "A",
    "title": "AvtoBus",
    "rating": 900,
    "url": "https://codeforces.com/problemset/problem/1679/A",
    "tags": [
      "brute force",
      "greedy",
      "math",
      "number theory"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1679A+AvtoBus+editorial",
    "solutionCode": {
      "cpp": "#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int tt;\n    cin >> tt;\n\n    while (tt--) {\n        long long n;\n        cin >> n;\n\n        if (n % 2 != 0 || n < 4) {\n            cout << -1 << '\\n';\n            continue;\n        }\n\n        long long min_buses = (n + 5) / 6;\n        long long max_buses = n / 4;\n\n        cout << min_buses << ' ' << max_buses << '\\n';\n    }\n\n    return 0;\n}"
    },
    "order": 14
  },
  {
    "id": "1437E",
    "contestId": 1437,
    "index": "E",
    "title": "Make It Increasing",
    "rating": 900,
    "url": "https://codeforces.com/problemset/problem/1437/E",
    "tags": [
      "binary search",
      "constructive algorithms",
      "data structures",
      "dp",
      "implementation"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1437E+Make%20It%20Increasing+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long n;\n        cin >> n;\n        vector<long long> a(n);\n        for (int i = 0; i < n; i++) \n            cin >> a[i];\n\n        long long ans = 0;\n        for (int i = n - 2; i >= 0; i--)\n        {\n            while (a[i] >= a[i + 1]) \n            {\n                ans++;\n                a[i] /= 2;\n                if (a[i] == 0)\n                    break;\n            }\n            if (a[i] == 0 && a[i + 1] == 0)\n            {\n                ans = -1;\n                break;\n            }\n        }\n        cout << ans << \"\\n\";\n    }\n    return 0;\n}"
    },
    "order": 15
  },
  {
    "id": "1666D",
    "contestId": 1666,
    "index": "D",
    "title": "Deletive Editing",
    "rating": 900,
    "url": "https://codeforces.com/problemset/problem/1666/D",
    "tags": [
      "greedy"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1666D+Deletive%20Editing+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    long long tt;\n    cin >> tt;\n    while (tt--)\n    {\n        string s, t;\n        cin >> s >> t;\n        int n = s.size();\n        int m = t.size();\n\n        vector<int> frequency_in_t(26, 0);\n        for (int i = 0; i < m; i++) \n            frequency_in_t[t[i] - 'A']++;\n\n        for (int i = n - 1; i >= 0; i--) \n        {\n            if (frequency_in_t[s[i] - 'A'] > 0)\n                frequency_in_t[s[i] - 'A']--;\n            else\n                s[i] = '.';\n        }\n\n        string final_string = \"\";\n\n        for (int i = 0; i < n; i++) \n        {\n            if (s[i] != '.')\n                final_string += s[i];\n        }\n\n        if (final_string == t) \n            cout << \"YES\" << \"\\n\";\n        else\n            cout << \"NO\" << \"\\n\";\n    }\n    return 0;\n}"
    },
    "order": 16
  },
  {
    "id": "1665B",
    "contestId": 1665,
    "index": "B",
    "title": "Array Cloning Technique",
    "rating": 900,
    "url": "https://codeforces.com/problemset/problem/1665/B",
    "tags": [
      "constructive algorithms",
      "greedy",
      "sortings"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1665B+Array%20Cloning%20Technique+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    long long tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long n;\n        cin >> n;\n        vector<long long> a(n);\n        for (long long i = 0; i < n; i++) \n            cin >> a[i];\n\n        map<long long, long long> mp;\n        for (long long i = 0; i < n; i++) \n            mp[a[i]]++;                   \n\n        long long current_highest_freq = 0;\n        for (auto i : mp)\n            current_highest_freq = max(current_highest_freq, i.second);\n\n        long long operations = 0;\n        while (current_highest_freq < n) \n        {\n            operations++; \n            if (current_highest_freq * 2 <= n)\n            {\n                operations += current_highest_freq; \n                current_highest_freq *= 2;\n            }\n            else\n            {\n                operations += n - current_highest_freq; \n                current_highest_freq = n;\n            }\n        }\n\n        cout << operations << endl;\n    }\n    return 0;\n}"
    },
    "order": 17
  },
  {
    "id": "1624B",
    "contestId": 1624,
    "index": "B",
    "title": "Make AP",
    "rating": 900,
    "url": "https://codeforces.com/problemset/problem/1624/B",
    "tags": [
      "implementation",
      "math"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1624B+Make%20AP+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    long long tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long a, b, c;\n        cin >> a >> b >> c;\n\n        bool answer = false;\n\n        long long new_a = 2 * b - c; \n        if (new_a / a > 0 && new_a % a == 0) \n            answer = true;\n\n        long long new_b = (a + c) / 2;\n        if (new_b / b > 0 && new_b % b == 0 && (c - a) % 2 == 0)\n            answer = true;\n\n        long long new_c = 2 * b - a;\n        if (new_c / c > 0 && new_c % c == 0)\n            answer = true;\n\n        if (answer)\n            cout << \"YES\" << \"\\n\";\n        else\n            cout << \"NO\" << \"\\n\";\n    }\n    return 0;\n}"
    },
    "order": 18
  },
  {
    "id": "1607B",
    "contestId": 1607,
    "index": "B",
    "title": "Odd Grasshopper",
    "rating": 900,
    "url": "https://codeforces.com/problemset/problem/1607/B",
    "tags": [
      "math"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1607B+Odd%20Grasshopper+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    int tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long start, jumps;\n        cin >> start >> jumps;\n\n        long long final_pos;\n        if (jumps % 4 == 1)\n            final_pos = -jumps;\n        else if (jumps % 4 == 2)\n            final_pos = 1;\n        else if (jumps % 4 == 3)\n            final_pos = jumps + 1;\n        else if (jumps % 4 == 0)\n            final_pos = 0;\n\n        if (start % 2 == 0)\n            final_pos = start + final_pos;\n        else\n            final_pos = start - final_pos;\n\n        cout << final_pos << \"\\n\";\n    }\n    return 0;\n}"
    },
    "order": 19
  },
  {
    "id": "1606A",
    "contestId": 1606,
    "index": "A",
    "title": "AB Balance",
    "rating": 900,
    "url": "https://codeforces.com/problemset/problem/1606/A",
    "tags": [
      "strings"
    ],
    "hint": "Track character frequencies, prefixes, or palindrome symmetry. Often checking prefix and suffix matches in linear time avoids costly quadratic nested loops.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1606A+AB%20Balance+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    int tt;\n    cin >> tt;\n    while (tt--)\n    {\n        string s;\n        cin >> s;\n        int n = s.size();\n\n        if (s[0] != s[n - 1])\n        {\n            if (s[0] == 'a')\n                s[0] = 'b';\n            else\n                s[0] = 'a';\n        }\n\n        cout << s << \"\\n\";\n    }\n    return 0;\n}"
    },
    "order": 20
  },
  {
    "id": "1593B",
    "contestId": 1593,
    "index": "B",
    "title": "Make it Divisible by 25",
    "rating": 900,
    "url": "https://codeforces.com/problemset/problem/1593/B",
    "tags": [
      "dfs and similar",
      "dp",
      "greedy",
      "math"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1593B+Make%20it%20Divisible%20by%2025+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint min_operations(string n, string possible_value)\n{\n    int operations = 0;\n    int checker_index = possible_value.size() - 1; \n    for (int i = n.size() - 1; i >= 0; i--) \n    {\n        if (n[i] == possible_value[checker_index])\n        {\n            checker_index--;\n            if (checker_index < 0)\n                break;\n        }\n        else\n            operations++;\n    }\n    if (checker_index >= 0)\n        operations = INT_MAX;\n    return operations;\n}\n\nint main()\n{\n    long long tt;\n    cin >> tt;\n    while (tt--)\n    {\n        string n;\n        cin >> n;\n        vector<string> possible_values = {\"00\", \"25\", \"50\", \"75\"};\n        int ans = INT_MAX;\n        for (auto possible_value : possible_values) \n            ans = min(ans, min_operations(n, possible_value));\n        cout << ans << endl;\n    }\n    return 0;\n}"
    },
    "order": 21
  },
  {
    "id": "1582B",
    "contestId": 1582,
    "index": "B",
    "title": "Luntik and Subsequences",
    "rating": 900,
    "url": "https://codeforces.com/problemset/problem/1582/B",
    "tags": [
      "combinatorics",
      "math"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1582B+Luntik%20and%20Subsequences+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    long long tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long n;\n        cin >> n;\n        vector<long long> a(n);\n        for (long long i = 0; i < n; i++)\n            cin >> a[i];\n        long long count_of_ones = 0;\n        long long count_of_zeros = 0;\n        for (long long i = 0; i < n; i++) \n        {\n            if (a[i] == 1)\n                count_of_ones++;\n            else if(a[i] == 0)\n                count_of_zeros++;\n        }\n\n        long long ways = pow(2, count_of_zeros) * count_of_ones;\n        cout << ways << \"\\n\";\n    }\n    return 0;\n}\n\nx"
    },
    "order": 22
  },
  {
    "id": "1559A",
    "contestId": 1559,
    "index": "A",
    "title": "Mocha and Math",
    "rating": 900,
    "url": "https://codeforces.com/problemset/problem/1559/A",
    "tags": [
      "bitmasks",
      "constructive algorithms",
      "math"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1559A+Mocha%20and%20Math+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    long long tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long n;\n        cin >> n;\n        vector<long long> a(n);\n        for (long long i = 0; i < n; i++)\n            cin >> a[i];\n\n        long long total_and = a[0];\n        for (long long i = 1; i < n; i++) \n            total_and &= a[i];\n\n        cout << total_and << \"\\n\";\n    }\n    return 0;\n}"
    },
    "order": 23
  },
  {
    "id": "1543A",
    "contestId": 1543,
    "index": "A",
    "title": "Exciting Bets",
    "rating": 900,
    "url": "https://codeforces.com/problemset/problem/1543/A",
    "tags": [
      "greedy",
      "math",
      "number theory"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1543A+Exciting%20Bets+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    long long tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long a, b;\n        cin >> a >> b;\n        if (b > a)\n            swap(a, b); \n\n        if (a == b)\n            cout << 0 << \" \" << 0 << \"\\n\"; \n        else\n        {\n            long long gcd = a - b;\n            long long moves = min(b % gcd, gcd - b % gcd);\n            cout << gcd << \" \" << moves << \"\\n\";\n        }\n    }\n    return 0;\n}"
    },
    "order": 24
  },
  {
    "id": "1537B",
    "contestId": 1537,
    "index": "B",
    "title": "Bad Boy",
    "rating": 900,
    "url": "https://codeforces.com/problemset/problem/1537/B",
    "tags": [
      "constructive algorithms",
      "greedy",
      "math"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1537B+Bad%20Boy+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 25
  },
  {
    "id": "1475A",
    "contestId": 1475,
    "index": "A",
    "title": "Odd Divisor",
    "rating": 900,
    "url": "https://codeforces.com/problemset/problem/1475/A",
    "tags": [
      "math",
      "number theory"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1475A+Odd%20Divisor+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    long long tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long n;\n        cin >> n;\n\n        while (n % 2 == 0) \n            n /= 2;\n        \n        if (n > 1)\n            cout << \"YES\" << \"\\n\";\n        else\n            cout << \"NO\" << \"\\n\";\n    }\n    return 0;\n}"
    },
    "order": 26
  },
  {
    "id": "1471A",
    "contestId": 1471,
    "index": "A",
    "title": "Strange Partition",
    "rating": 900,
    "url": "https://codeforces.com/problemset/problem/1471/A",
    "tags": [
      "greedy",
      "math",
      "number theory"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1471A+Strange%20Partition+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    int tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long n, x;\n        cin >> n >> x;\n        vector<long long> a(n);\n        long long min = 0, max = 0;\n        for (int i = 0; i < n; i++) \n            cin >> a[i];\n        \n        for (int i = 0; i < n; i++) \n        {\n            max += ceil(a[i] * 1.0 / x);\n            min += a[i];\n        }\n\n        min = ceil(min * 1.0 / x);\n        cout << min << \" \" << max << endl;\n    }\n    return 0;\n}"
    },
    "order": 27
  },
  {
    "id": "1440B",
    "contestId": 1440,
    "index": "B",
    "title": "Sum of Medians",
    "rating": 900,
    "url": "https://codeforces.com/problemset/problem/1440/B",
    "tags": [
      "binary search",
      "brute force",
      "data structures",
      "implementation"
    ],
    "hint": "Sort the array. To maximize the sum of medians across k arrays of size n, greedily assign the smallest elements to the lower halves and pick elements from the right step-by-step.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1440B+Sum%20of%20Medians+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n, k;\n    if (!(cin >> n >> k)) return;\n    int total = n * k;\n    vector<long long> a(total);\n    for (int i = 0; i < total; i++) cin >> a[i];\n    long long sum = 0;\n    int step = n / 2 + 1;\n    int idx = total - step;\n    for (int count = 0; count < k; count++) {\n        sum += a[idx];\n        idx -= step;\n    }\n    cout << sum << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 28
  },
  {
    "id": "1380A",
    "contestId": 1380,
    "index": "A",
    "title": "Three Indices",
    "rating": 900,
    "url": "https://codeforces.com/problemset/problem/1380/A",
    "tags": [
      "brute force",
      "data structures"
    ],
    "hint": "Speed up operations from O(N) to O(log N) using appropriate containers like std::set, std::map, or a Fenwick/Segment Tree for dynamic range queries and updates.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1380A+Three%20Indices+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    long long tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long n;\n        cin >> n;\n        vector<long long> a(n);\n        for (long long i = 0; i < n; i++) \n            cin >> a[i];\n\n        int flag = 0;\n        for (int j = 1; j < n - 1; j++) \n        {\n            int i = -1;\n            int k = -1;\n            for (int left = 0; left < j; left++) \n            {\n                if (a[left] < a[j])\n                {\n                    i = left;\n                    break;\n                }\n            }\n            for (int right = j + 1; right < n; right++)\n            {\n                if (a[right] < a[j])\n                {\n                    k = right;\n                    break;\n                }\n            }\n            if (i != -1 && k != -1)\n            {\n                cout << \"YES\" << endl;\n                cout << i + 1 << \" \" << j + 1 << \" \" << k + 1 << endl;\n                flag = 1;\n                break;\n            }\n        } \n        if (flag == 0)\n            cout << \"NO\" << endl;\n    }\n    return 0;\n}"
    },
    "order": 29
  },
  {
    "id": "1649A",
    "contestId": 1649,
    "index": "A",
    "title": "Game",
    "rating": 900,
    "url": "https://codeforces.com/problemset/problem/1649/A",
    "tags": [
      "brute force",
      "dp",
      "implementation"
    ],
    "hint": "Find the first zero from the left and the last zero from the right. The player can walk on continuous land (1s) for free, but must jump over the segment containing the zeros.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1649A+Game+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<int> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n    int firstZero = -1, lastZero = -1;\n    for (int i = 0; i < n; i++) {\n        if (a[i] == 0) {\n            if (firstZero == -1) firstZero = i;\n            lastZero = i;\n        }\n    }\n    if (firstZero == -1) {\n        cout << 0 << \"\\n\";\n    } else {\n        cout << (lastZero + 1) - (firstZero - 1) << \"\\n\";\n    }\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 30
  },
  {
    "id": "1374B",
    "contestId": 1374,
    "index": "B",
    "title": "Multiply by 2, divide by 6",
    "rating": 900,
    "url": "https://codeforces.com/problemset/problem/1374/B",
    "tags": [
      "math"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1374B+Multiply%20by%202%2C%20divide%20by%206+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    long long tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long n;\n        cin >> n;\n        long long count_of_3 = 0;\n        long long count_of_2 = 0;\n\n        while (n > 0 && n % 3 == 0) \n        {\n            count_of_3++;\n            n /= 3;\n        }\n\n        while (n > 0 && n % 2 == 0) \n        {\n            count_of_2++;\n            n /= 2;\n        }\n\n        if (n > 1 || count_of_2 > count_of_3)\n            cout << -1 << \"\\n\";\n        else\n            cout << count_of_3 + (count_of_3 - count_of_2) << endl;\n    }\n    return 0;\n}"
    },
    "order": 31
  },
  {
    "id": "1675B",
    "contestId": 1675,
    "index": "B",
    "title": "Make It Increasing",
    "rating": 900,
    "url": "https://codeforces.com/problemset/problem/1675/B",
    "tags": [
      "greedy",
      "implementation"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1675B+Make%20It%20Increasing+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 32
  },
  {
    "id": "1971C",
    "contestId": 1971,
    "index": "C",
    "title": "Clock and Strings",
    "rating": 900,
    "url": "https://codeforces.com/problemset/problem/1971/C",
    "tags": [
      "implementation"
    ],
    "hint": "Test small examples by hand, identify invariants preserved under the problem operations, and consider extreme corner cases (e.g. n=1, all equal elements).",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1971C+Clock%20and%20Strings+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 33
  },
  {
    "id": "1985D",
    "contestId": 1985,
    "index": "D",
    "title": "Manhattan Circle",
    "rating": 900,
    "url": "https://codeforces.com/problemset/problem/1985/D",
    "tags": [
      "implementation",
      "math"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1985D+Manhattan%20Circle+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 34
  },
  {
    "id": "1742C",
    "contestId": 1742,
    "index": "C",
    "title": "Stripes",
    "rating": 900,
    "url": "https://codeforces.com/problemset/problem/1742/C",
    "tags": [
      "implementation"
    ],
    "hint": "Test small examples by hand, identify invariants preserved under the problem operations, and consider extreme corner cases (e.g. n=1, all equal elements).",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1742C+Stripes+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 35
  },
  {
    "id": "1941C",
    "contestId": 1941,
    "index": "C",
    "title": "Rudolf and the Ugly String",
    "rating": 900,
    "url": "https://codeforces.com/problemset/problem/1941/C",
    "tags": [
      "dp",
      "greedy",
      "strings"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1941C+Rudolf%20and%20the%20Ugly%20String+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    vector<long long> dp(n + 1, 0);\n    for (int i = 0; i < n; i++) {\n        dp[i + 1] = max(dp[i], dp[i] + a[i]);\n    }\n    cout << dp[n] << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 36
  },
  {
    "id": "1927B",
    "contestId": 1927,
    "index": "B",
    "title": "Following the String",
    "rating": 900,
    "url": "https://codeforces.com/problemset/problem/1927/B",
    "tags": [
      "constructive algorithms",
      "greedy",
      "strings"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1927B+Following%20the%20String+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 37
  },
  {
    "id": "1915D",
    "contestId": 1915,
    "index": "D",
    "title": "Unnatural Language Processing",
    "rating": 900,
    "url": "https://codeforces.com/problemset/problem/1915/D",
    "tags": [
      "greedy",
      "implementation",
      "strings"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1915D+Unnatural%20Language%20Processing+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 38
  },
  {
    "id": "2132B",
    "contestId": 2132,
    "index": "B",
    "title": "The Secret Number",
    "rating": 900,
    "url": "https://codeforces.com/problemset/problem/2132/B",
    "tags": [
      "math"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+2132B+The%20Secret%20Number+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 39
  },
  {
    "id": "1535B",
    "contestId": 1535,
    "index": "B",
    "title": "Array Reodering",
    "rating": 900,
    "url": "https://codeforces.com/problemset/problem/1535/B",
    "tags": [
      "brute force",
      "greedy",
      "math",
      "number theory",
      "sortings"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1535B+Array%20Reodering+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 40
  },
  {
    "id": "1992C",
    "contestId": 1992,
    "index": "C",
    "title": "Gorilla and Permutation",
    "rating": 900,
    "url": "https://codeforces.com/problemset/problem/1992/C",
    "tags": [
      "constructive algorithms",
      "math"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1992C+Gorilla%20and%20Permutation+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 41
  },
  {
    "id": "1714A",
    "contestId": 1714,
    "index": "A",
    "title": "Everyone Loves to Sleep",
    "rating": 900,
    "url": "https://codeforces.com/problemset/problem/1714/A",
    "tags": [
      "implementation",
      "math"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1714A+Everyone%20Loves%20to%20Sleep+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 42
  },
  {
    "id": "2060C",
    "contestId": 2060,
    "index": "C",
    "title": "Game of Mathletes",
    "rating": 900,
    "url": "https://codeforces.com/problemset/problem/2060/C",
    "tags": [
      "games",
      "greedy",
      "sortings",
      "two pointers"
    ],
    "hint": "Notice that as the right pointer expands, the left pointer only needs to move forward. Maintain frequency counts or window invariants to keep the window valid in O(N) overall.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+2060C+Game%20of%20Mathletes+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 43
  },
  {
    "id": "1921C",
    "contestId": 1921,
    "index": "C",
    "title": "Sending Messages",
    "rating": 900,
    "url": "https://codeforces.com/problemset/problem/1921/C",
    "tags": [
      "greedy",
      "math"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1921C+Sending%20Messages+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 44
  },
  {
    "id": "2093B",
    "contestId": 2093,
    "index": "B",
    "title": "Expensive Number",
    "rating": 900,
    "url": "https://codeforces.com/problemset/problem/2093/B",
    "tags": [
      "greedy",
      "math"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+2093B+Expensive%20Number+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 45
  },
  {
    "id": "2072B",
    "contestId": 2072,
    "index": "B",
    "title": "Having Been a Treasurer in the Past, I Help Goblins Deceive",
    "rating": 900,
    "url": "https://codeforces.com/problemset/problem/2072/B",
    "tags": [
      "combinatorics",
      "constructive algorithms",
      "strings"
    ],
    "hint": "Build a pattern step by step. Look at small examples (n=1, 2, 3) to uncover an invariant or periodic pattern that generalizes to any valid input.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+2072B+Having%20Been%20a%20Treasurer%20in%20the%20Past%2C%20I%20Help%20Goblins%20Deceive+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 46
  },
  {
    "id": "1697B",
    "contestId": 1697,
    "index": "B",
    "title": "Promo",
    "rating": 900,
    "url": "https://codeforces.com/problemset/problem/1697/B",
    "tags": [
      "greedy",
      "sortings"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1697B+Promo+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 47
  },
  {
    "id": "2094C",
    "contestId": 2094,
    "index": "C",
    "title": "Brr Brrr Patapim",
    "rating": 900,
    "url": "https://codeforces.com/problemset/problem/2094/C",
    "tags": [
      "math"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+2094C+Brr%20Brrr%20Patapim+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 48
  },
  {
    "id": "2185C",
    "contestId": 2185,
    "index": "C",
    "title": "Shifted MEX",
    "rating": 900,
    "url": "https://codeforces.com/problemset/problem/2185/C",
    "tags": [
      "implementation",
      "sortings"
    ],
    "hint": "Sort the array to impose monotonic order. Pairing adjacent elements or extremes (min with max) typically resolves the main condition.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+2185C+Shifted%20MEX+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 49
  },
  {
    "id": "2114B",
    "contestId": 2114,
    "index": "B",
    "title": "Not Quite a Palindromic String",
    "rating": 900,
    "url": "https://codeforces.com/problemset/problem/2114/B",
    "tags": [
      "greedy",
      "math"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+2114B+Not%20Quite%20a%20Palindromic%20String+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 50
  },
  {
    "id": "1913B",
    "contestId": 1913,
    "index": "B",
    "title": "Swap and Delete",
    "rating": 1000,
    "url": "https://codeforces.com/problemset/problem/1913/B",
    "tags": [
      "strings"
    ],
    "hint": "Track character frequencies, prefixes, or palindrome symmetry. Often checking prefix and suffix matches in linear time avoids costly quadratic nested loops.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1913B+Swap%20and%20Delete+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    cout.tie(nullptr);\n    int tt;\n    cin >> tt;\n    while (tt--)\n    {\n        string s;\n        cin >> s; \n        int n = s.size();\n        int count_of_0s = 0, count_of_1s = 0;\n        for (int i = 0; i < n; i++)\n        {\n            if (s[i] == '0')\n                count_of_0s++;\n            else\n                count_of_1s++;\n        }\n\n        int length_of_t = 0;\n        for (int i = 0; i < n; i++) \n        {\n            if (s[i] == '0' && count_of_1s > 0)\n                count_of_1s--, length_of_t++;\n            else if (s[i] == '1' && count_of_0s > 0)\n                count_of_0s--, length_of_t++;\n            else\n                break;\n        }\n\n        cout << n - length_of_t << \"\\n\";\n    }\n    return 0;\n}"
    },
    "order": 1
  },
  {
    "id": "1883C",
    "contestId": 1883,
    "index": "C",
    "title": "Raspberries",
    "rating": 1000,
    "url": "https://codeforces.com/problemset/problem/1883/C",
    "tags": [
      "dp",
      "math"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1883C+Raspberries+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    long long t;\n    cin >> t;\n    while (t--)\n    {\n        long long n, k;\n        cin >> n >> k;\n        vector<long long> a(n);\n        for (long long i = 0; i < n; i++) \n            cin >> a[i];\n\n        long long ans = INT_MAX;\n        long long even_count = 0;\n        for (long long i = 0; i < n; i++) \n        {\n            if (a[i] % 2 == 0)\n                even_count++;\n            if (a[i] % k == 0)\n                ans = 0;\n            ans = min(ans, (k - a[i] % k));\n        }\n\n        if (k == 4)\n        {\n            if (even_count >= 2)\n                ans = min(ans, 0LL);\n            else if (even_count == 1)\n                ans = min(ans, 1LL);\n            else if (even_count == 0)\n                ans = min(ans, 2LL);\n        }\n        cout << ans << endl;\n    }\n    return 0;\n}"
    },
    "order": 2
  },
  {
    "id": "1876A",
    "contestId": 1876,
    "index": "A",
    "title": "Helmets in Night Light",
    "rating": 1000,
    "url": "https://codeforces.com/problemset/problem/1876/A",
    "tags": [
      "greedy",
      "sortings"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1876A+Helmets%20in%20Night%20Light+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    long long t;\n    cin >> t;\n    while (t--)\n    {\n        long long n, p;\n        cin >> n >> p;\n        vector<pair<long long, long long> > v(n);\n        vector<long long> a(n), b(n);\n\n        for (int i = 0; i < n; i++) \n            cin >> a[i];\n\n        for (int i = 0; i < n; i++)\n            cin >> b[i];\n\n        for (int i = 0; i < n; i++)\n            v[i] = {b[i], a[i]};\n\n        sort(v.begin(), v.end());\n\n        long long minimum_cost = p;\n        long long already_shared = 1;\n\n        for (auto it : v)\n        {\n            long long can_be_shared = it.second;\n            long long sharing_cost = it.first;\n\n            if (sharing_cost >= p)\n                break;\n\n            if (already_shared + can_be_shared > n)\n            {\n                minimum_cost += (n - already_shared) * sharing_cost;\n                already_shared = n;\n                break;\n            }\n            else\n            {\n                minimum_cost += can_be_shared * sharing_cost;\n                already_shared += can_be_shared;\n            }\n        }\n\n        minimum_cost += (n - already_shared) * p; \n        cout << minimum_cost << \"\\n\";\n    }\n    return 0;\n}"
    },
    "order": 3
  },
  {
    "id": "1859B",
    "contestId": 1859,
    "index": "B",
    "title": "Olya and Game with Arrays",
    "rating": 1000,
    "url": "https://codeforces.com/problemset/problem/1859/B",
    "tags": [
      "constructive algorithms",
      "greedy",
      "math",
      "sortings"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1859B+Olya%20and%20Game%20with%20Arrays+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    long long tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long n;\n        cin >> n;\n\n        vector<long long> second_elements;\n        long long lowest_first_minimum = INT_MAX;\n\n        for (int i = 0; i < n; i++)\n        {\n            long long m;\n            cin >> m;\n            vector<long long> a(m);\n            for (auto &x : a) \n                cin >> x;\n            \n            sort(a.begin(), a.end());\n            \n            second_elements.push_back(a[1]);\n            lowest_first_minimum = min(lowest_first_minimum, a[0]);\n        }\n\n        sort(second_elements.begin(), second_elements.end());\n\n        long long sum_of_second_elements = accumulate(second_elements.begin(), second_elements.end(), 0LL);\n        long long lowest_second_minimum = second_elements[0];\n\n        long long answer = lowest_first_minimum + sum_of_second_elements - lowest_second_minimum;\n        cout << answer << endl;\n    }\n    return 0;\n}"
    },
    "order": 4
  },
  {
    "id": "1810E",
    "contestId": 1810,
    "index": "E",
    "title": "Monsters",
    "rating": 1000,
    "url": "https://codeforces.com/problemset/problem/1810/E",
    "tags": [
      "brute force",
      "data structures",
      "dfs and similar",
      "dsu",
      "graphs",
      "greedy"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1810E+Monsters+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    int tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long n, k;\n        cin >> n >> k;\n        vector<pair<long long, long long> > health_points(n);\n        for (long long i = 0; i < n; i++) \n        {\n            long long x;\n            cin >> x;\n            health_points[i] = { x, i + 1 };\n        }\n\n        for (long long i = 0; i < n; i++) \n        {\n            health_points[i].first = health_points[i].first % k;\n            if (health_points[i].first == 0)\n                health_points[i].first = k;\n        }\n\n        sort(health_points.begin(), health_points.end(), [&](pair<long long, long long> a, pair<long long, long long> b) {\n            if (a.first != b.first)\n                return a.first > b.first;\n            return a.second < b.second;\n        }); \n\n        for (auto it : health_points) \n            cout << it.second << \" \";\n        cout << \"\\n\";\n    }\n    return 0;\n}"
    },
    "order": 5
  },
  {
    "id": "1840C",
    "contestId": 1840,
    "index": "C",
    "title": "Ski Resort",
    "rating": 1000,
    "url": "https://codeforces.com/problemset/problem/1840/C",
    "tags": [
      "combinatorics",
      "math",
      "two pointers"
    ],
    "hint": "Notice that as the right pointer expands, the left pointer only needs to move forward. Maintain frequency counts or window invariants to keep the window valid in O(N) overall.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1840C+Ski%20Resort+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    long long tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long n, k, q;\n        cin >> n >> k >> q;\n        vector<long long> a(n);\n        for (int i = 0; i < n; i++) \n        {\n            cin >> a[i];\n            a[i] = (a[i] > q) ? 0 : 1;\n        }\n\n        long long count_of_1s = 0;\n        long long ways = 0;\n        for (int i = 0; i < n; i++) \n        {\n            if (a[i] == 1)\n                count_of_1s++;\n            else\n            {\n                if (count_of_1s >= k)\n                {\n                    long long diff = count_of_1s - k + 1;\n                    ways += (diff * (diff + 1)) / 2;\n                }\n                count_of_1s = 0;\n            }\n        }\n        if (count_of_1s >= k)\n        {\n            long long diff = count_of_1s - k + 1;\n            ways += (diff * (diff + 1)) / 2;\n        }\n        \n        cout << ways << \"\\n\";\n    }\n    return 0;\n}"
    },
    "order": 6
  },
  {
    "id": "1831B",
    "contestId": 1831,
    "index": "B",
    "title": "Array merging",
    "rating": 1000,
    "url": "https://codeforces.com/problemset/problem/1831/B",
    "tags": [
      "constructive algorithms",
      "greedy"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1831B+Array%20merging+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    long long t;\n    cin >> t;\n    while (t--)\n    {\n        long long n;\n        cin >> n;\n        vector<long long> a(n);\n        for (long long i = 0; i < n; i++)\n            cin >> a[i];\n        vector<long long> b(n);\n        for (long long i = 0; i < n; i++)\n            cin >> b[i];\n\n        vector<long long> longest_subarray_a(2 * n + 1, 0);\n        vector<long long> longest_subarray_b(2 * n + 1, 0);\n\n        long long counter = 1;\n        for (int i = 1; i < n; i++)\n        {\n            if (a[i] == a[i - 1])\n                counter++;\n            else\n            {\n                longest_subarray_a[a[i - 1]] = max(longest_subarray_a[a[i - 1]], counter);\n                counter = 1;\n            }\n        }\n        longest_subarray_a[a[n - 1]] = max(longest_subarray_a[a[n - 1]], counter);\n\n        counter = 1;\n\n        for (int i = 1; i < n; i++) \n        {\n            if (b[i] == b[i - 1])\n                counter++;\n            else\n            {\n                longest_subarray_b[b[i - 1]] = max(longest_subarray_b[b[i - 1]], counter);\n                counter = 1;\n            }\n        }\n        longest_subarray_b[b[n - 1]] = max(longest_subarray_b[b[n - 1]], counter);\n\n        long long max_freq = -1;\n        for (int i = 1; i <= 2 * n; i++) \n            max_freq = max(max_freq, longest_subarray_a[i] + longest_subarray_b[i]);\n\n        cout << max_freq << endl;\n    }\n    return 0;\n}"
    },
    "order": 7
  },
  {
    "id": "1791D",
    "contestId": 1791,
    "index": "D",
    "title": "Distinct Split",
    "rating": 1000,
    "url": "https://codeforces.com/problemset/problem/1791/D",
    "tags": [
      "brute force",
      "greedy",
      "strings"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1791D+Distinct%20Split+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    int tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long n;\n        cin >> n;\n        string s;\n        cin >> s;\n\n        unordered_set<char> st;\n        vector<long long> prefix_unique_count(n + 1, 0);\n        vector<long long> suffix_unique_count(n + 1, 0);\n\n        for (long long i = 1; i <= n; i++) \n        {\n            st.insert(s[i - 1]); \n            prefix_unique_count[i] = st.size(); \n        }\n\n        st.clear();\n\n        for (long long i = n; i >= 1; i--) \n        {\n            st.insert(s[i - 1]);\n            suffix_unique_count[i] = st.size();\n        }\n\n        long long ans = 0;\n        for (long long i = 0; i < n; i++)\n            ans = max(ans, prefix_unique_count[i] + suffix_unique_count[i + 1]);\n        cout << ans << endl;\n    }\n    return 0;\n}"
    },
    "order": 8
  },
  {
    "id": "1765M",
    "contestId": 1765,
    "index": "M",
    "title": "Minimum LCM",
    "rating": 1000,
    "url": "https://codeforces.com/problemset/problem/1765/M",
    "tags": [
      "math",
      "number theory"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1765M+Minimum%20LCM+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    long long tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long n;\n        cin >> n;\n        long long ans_a = 1;\n        long long ans_b = n - 1;\n        for (long long fac = 2; fac * fac <= n; fac++)\n        {\n            if (n % fac == 0)\n            {\n                ans_a = n / fac;\n                ans_b = n - ans_a;\n                break;\n            }\n        }\n        cout << ans_a << \" \" << ans_b << \"\\n\";\n    }\n    return 0;\n}"
    },
    "order": 9
  },
  {
    "id": "1744C",
    "contestId": 1744,
    "index": "C",
    "title": "Traffic Light",
    "rating": 1000,
    "url": "https://codeforces.com/problemset/problem/1744/C",
    "tags": [
      "binary search",
      "implementation",
      "two pointers"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1744C+Traffic%20Light+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    long long t;\n    cin >> t;\n    while (t--)\n    {\n        long long n;\n        cin >> n;\n        char color;\n        cin >> color;\n        string s;\n        cin >> s; \n        s += s; \n        n *= 2;\n\n        long long last_green_index = -1;\n        long long max_seconds = INT_MIN;\n\n        for (int i = n - 1; i >= 0; i--) \n        {\n            if (s[i] == 'g')\n                last_green_index = i;\n            if (s[i] == color)\n            {\n                long long difference = last_green_index - i;\n                max_seconds = max(max_seconds, difference);\n            }\n        }\n        cout << max_seconds << \"\\n\";\n    }\n    return 0;\n}"
    },
    "order": 10
  },
  {
    "id": "1725B",
    "contestId": 1725,
    "index": "B",
    "title": "Basketball Together",
    "rating": 1000,
    "url": "https://codeforces.com/problemset/problem/1725/B",
    "tags": [
      "binary search",
      "greedy",
      "sortings"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1725B+Basketball%20Together+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    long long n, d;\n    cin >> n >> d;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++)cin >> a[i];\n    sort(a.begin(), a.end()); \n    long long left = -1;\n    long long right = n - 1;\n    long long team_size = 1;\n    long long teams = 0;\n\n    while (left < right)\n    {\n        if ((a[right] * team_size) <= d && left < right)\n        {\n            left++;\n            team_size++;\n        }\n        else\n        {\n            teams++;\n            right--;\n            team_size = 1;\n        }\n    }\n\n    cout << teams << \"\\n\";\n    return 0;\n}"
    },
    "order": 11
  },
  {
    "id": "1155D",
    "contestId": 1155,
    "index": "D",
    "title": "Beautiful Array",
    "rating": 1000,
    "url": "https://codeforces.com/problemset/problem/1155/D",
    "tags": [
      "brute force",
      "data structures",
      "divide and conquer",
      "dp",
      "greedy"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1155D+Beautiful%20Array+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    int tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long n, k, b, s;\n        cin >> n >> k >> b >> s;\n        long long minimum_s = (k * b);\n        long long maximum_s = (k * b) + (k - 1) * n;\n        if(s < minimum_s || s > maximum_s)\n            cout << \"-1\" << endl;\n        else\n        {\n            vector<long long> ans(n, 0);\n            ans[0] = minimum_s;\n            s -= minimum_s;\n            for (int i = 0; i < n; i++) \n            {\n                long long add = min(k - 1, s);\n                ans[i] += add;\n                s -= add;\n            }\n            for (long long i = 0; i < n; i++) \n                cout << ans[i] << \" \";\n            cout << \"\\n\";\n        }\n    }\n}"
    },
    "order": 12
  },
  {
    "id": "1704B",
    "contestId": 1704,
    "index": "B",
    "title": "Luke is a Foodie",
    "rating": 1000,
    "url": "https://codeforces.com/problemset/problem/1704/B",
    "tags": [
      "brute force",
      "greedy",
      "implementation"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1704B+Luke%20is%20a%20Foodie+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    int tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long n, x;\n        cin >> n >> x;\n        vector<long long> a(n);\n        for (long long i = 0; i < n; i++)\n            cin >> a[i];\n\n        vector<pair<long long, long long> > segments(n);\n        for (int i = 0; i < n; i++) \n            segments[i] = {a[i] - x, a[i] + x};\n        \n        long long ans = 0;\n        long long l = segments[0].first;\n        long long r = segments[0].second;\n        for (int i = 1; i < n; i++) \n        {\n            l = max(l, segments[i].first);\n            r = min(r, segments[i].second);\n            if (l > r)\n            {\n                ans++;\n                l = segments[i].first;\n                r = segments[i].second;\n            }\n        }\n        cout << ans << \"\\n\";\n    }\n}"
    },
    "order": 13
  },
  {
    "id": "1691B",
    "contestId": 1691,
    "index": "B",
    "title": "Shoe Shuffling",
    "rating": 1000,
    "url": "https://codeforces.com/problemset/problem/1691/B",
    "tags": [
      "constructive algorithms",
      "greedy",
      "implementation",
      "two pointers"
    ],
    "hint": "Notice that as the right pointer expands, the left pointer only needs to move forward. Maintain frequency counts or window invariants to keep the window valid in O(N) overall.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1691B+Shoe%20Shuffling+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    int tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long n;\n        cin >> n;\n        vector<long long> sizes(n);\n        for (int i = 0; i < n; i++) \n            cin >> sizes[i];\n\n        map<long long, long long> freq;\n        for (int i = 0; i < n; i++) \n            freq[sizes[i]]++;       \n\n        long long flag = 0;\n        for (auto i : freq)\n        {\n            if (i.second == 1)\n            {\n                flag = 1;\n                break;\n            }\n        }\n\n        if (flag)\n        {\n            cout << -1 << \"\\n\";\n            continue;\n        }\n\n        vector<long long> students(n);\n        for (int i = 0; i < n; i++) \n            students[i] = i + 1;\n\n        long long l = 0, r = 0;\n        while (r < n) \n        {\n            if (sizes[l] == sizes[r])\n                r++;\n            else\n            {\n                rotate(students.begin() + l, students.begin() + l + 1, students.begin() + r);\n                l = r;\n            }\n        }\n        rotate(students.begin() + l, students.begin() + l + 1, students.begin() + r);\n\n        for (auto i : students)\n            cout << i << \" \";\n        cout << \"\\n\";\n    }\n    return 0;\n}"
    },
    "order": 14
  },
  {
    "id": "1690D",
    "contestId": 1690,
    "index": "D",
    "title": "Black and White Stripe",
    "rating": 1000,
    "url": "https://codeforces.com/problemset/problem/1690/D",
    "tags": [
      "implementation",
      "two pointers"
    ],
    "hint": "Notice that as the right pointer expands, the left pointer only needs to move forward. Maintain frequency counts or window invariants to keep the window valid in O(N) overall.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1690D+Black%20and%20White%20Stripe+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    int tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long n, k;\n        cin >> n >> k;\n        string s; \n        cin >> s; \n        vector<long long> prefix(n + 1, 0);\n        for (int i = 0; i < n; i++) \n            prefix[i + 1] = prefix[i] + (s[i] == 'W');\n\n        long long minimum_cells = INT_MAX;\n        for (int i = 0; i <= n - k; i++) \n        {\n            long long diff = prefix[i + k] - prefix[i];\n            minimum_cells = min(minimum_cells, diff);\n        }\n\n        cout << minimum_cells << \"\\n\";\n    }\n    return 0;\n}"
    },
    "order": 15
  },
  {
    "id": "1659A",
    "contestId": 1659,
    "index": "A",
    "title": "Red Versus Blue",
    "rating": 1000,
    "url": "https://codeforces.com/problemset/problem/1659/A",
    "tags": [
      "constructive algorithms",
      "greedy",
      "implementation",
      "math"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1659A+Red%20Versus%20Blue+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    int tt;\n    cin >> tt;\n    while (tt--)\n    {\n        int n, r, b;\n        cin >> n >> r >> b;\n        string s;\n        int length_of_red = r / (b + 1);\n        int extra_red = r % (b + 1);\n        for (int times = 1; times <= b + 1; times++)\n        {\n            for (int i = 0; i < length_of_red; i++) \n                s += 'R';\n            if (extra_red > 0)\n            {\n                s += 'R';\n                extra_red--;\n            }\n            if (times != b + 1)\n                s += 'B';\n        }\n        cout << s << \"\\n\";\n    }\n    return 0;\n}"
    },
    "order": 16
  },
  {
    "id": "1632B",
    "contestId": 1632,
    "index": "B",
    "title": "Roof Construction",
    "rating": 1000,
    "url": "https://codeforces.com/problemset/problem/1632/B",
    "tags": [
      "bitmasks",
      "constructive algorithms"
    ],
    "hint": "Build a pattern step by step. Look at small examples (n=1, 2, 3) to uncover an invariant or periodic pattern that generalizes to any valid input.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1632B+Roof%20Construction+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    int tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long n;\n        cin >> n;\n        n--;\n        long long msb = log2(n); \n        vector<long long> ans;\n        long long num = pow(2, msb) - 1;\n        while (num >= 0) \n        {\n            ans.push_back(num);\n            num--;\n        }\n        num = pow(2, msb);\n        while (num <= n) \n        {\n            ans.push_back(num);\n            num++;\n        }\n\n        for (auto it : ans) \n            cout << it << \" \";\n        cout << \"\\n\";\n    }\n}"
    },
    "order": 17
  },
  {
    "id": "1620B",
    "contestId": 1620,
    "index": "B",
    "title": "Triangles on a Rectangle",
    "rating": 1000,
    "url": "https://codeforces.com/problemset/problem/1620/B",
    "tags": [
      "geometry",
      "greedy",
      "math"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1620B+Triangles%20on%20a%20Rectangle+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    int tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long w, h;\n        cin >> w >> h;\n        long long area = INT_MIN;\n        for (int i = 0; i < 4; i++) \n        {\n            long long k;\n            cin >> k;\n            long long first, last;\n\n            for (int j = 0; j < k; j++) \n            {\n                long long x;\n                cin >> x;\n                if (j == 0)\n                    first = x;\n                if (j == k - 1)\n                    last = x;\n            }\n\n            long long base = last - first;\n            long long height;\n            if (i <= 1)\n                height = h;\n            else\n                height = w;\n            \n            area = max(area, base * height);\n        }\n        cout << area << endl;\n    }\n    return 0;\n}"
    },
    "order": 18
  },
  {
    "id": "1614B",
    "contestId": 1614,
    "index": "B",
    "title": "Divan and a New Project ",
    "rating": 1000,
    "url": "https://codeforces.com/problemset/problem/1614/B",
    "tags": [
      "constructive algorithms",
      "sortings"
    ],
    "hint": "Build a pattern step by step. Look at small examples (n=1, 2, 3) to uncover an invariant or periodic pattern that generalizes to any valid input.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1614B+Divan%20and%20a%20New%20Project%20+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    int tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long n;\n        cin >> n;\n        vector<long long> a(n);\n        for (long long i = 0; i < n; i++) \n            cin >> a[i];\n\n        vector<pair<long long, long long> > building_map;\n        for (int i = 0; i < n; i++) \n            building_map.push_back({a[i], i});\n\n        sort(building_map.rbegin(), building_map.rend()); \n\n        vector<long long> ans(n + 1, 0);\n\n        ans[0] = 0;\n\n        long long minutes = 0;\n        long long coordinate = 1;\n        for (int i = 0; i < n; i++)\n        {\n            ans[building_map[i].second + 1] = coordinate;\n            minutes += (2 * abs(coordinate) * building_map[i].first);\n            if (coordinate < 0)\n                coordinate = abs(coordinate) + 1;\n            else\n                coordinate = -coordinate;\n        }\n        \n        cout << minutes << \"\\n\";\n        for (auto it : ans)\n            cout << it << \" \";\n        cout << \"\\n\";  \n     }\n}"
    },
    "order": 19
  },
  {
    "id": "1567B",
    "contestId": 1567,
    "index": "B",
    "title": "MEXor Mixup",
    "rating": 1000,
    "url": "https://codeforces.com/problemset/problem/1567/B",
    "tags": [
      "bitmasks",
      "greedy"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1567B+MEXor%20Mixup+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nlong long xor_till(long long n)\n{\n    long long a = n % 4;\n    if (a == 0)\n        return n;\n    else if (a == 1)\n        return 1;\n    else if (a == 2)\n        return n + 1;\n    else\n        return 0;\n}\n\nint main()\n{\n    int tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long a, b;\n        cin >> a >> b;\n        long long arr_xor = xor_till(a - 1);\n\n        if (arr_xor == b)\n            cout << a << \"\\n\";\n        else if ((arr_xor ^ b) != a)\n            cout << a + 1 << \"\\n\";\n        else\n            cout << a + 2 << \"\\n\";\n    }\n}"
    },
    "order": 20
  },
  {
    "id": "1506C",
    "contestId": 1506,
    "index": "C",
    "title": "Double-ended Strings",
    "rating": 1000,
    "url": "https://codeforces.com/problemset/problem/1506/C",
    "tags": [
      "brute force",
      "implementation",
      "strings"
    ],
    "hint": "Track character frequencies, prefixes, or palindrome symmetry. Often checking prefix and suffix matches in linear time avoids costly quadratic nested loops.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1506C+Double-ended%20Strings+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    int tt;\n    cin >> tt;\n    while (tt--)\n    {\n        string A, B;\n        cin >> A >> B; \n        long long n = A.size(), m = B.size();\n        long long lcs = 0;\n\n        for (long long len = 1; len <= min(n, m); len++) \n        {\n            for (long long i = 0; i + len <= n; i++) \n            {\n                for (long long j = 0; j + len <= m; j++) \n                {\n                    string extract_A = A.substr(i, len); \n                    string extract_B = B.substr(j, len);\n                    \n                    if (extract_A == extract_B) \n                        lcs = max(lcs, len);\n                }\n            }\n        }\n\n        long long operations = n + m - 2 * lcs;\n        cout << operations << \"\\n\";\n    }\n    return 0;\n}"
    },
    "order": 21
  },
  {
    "id": "1485A",
    "contestId": 1485,
    "index": "A",
    "title": "Add and Divide",
    "rating": 1000,
    "url": "https://codeforces.com/problemset/problem/1485/A",
    "tags": [
      "brute force",
      "greedy",
      "math",
      "number theory"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1485A+Add%20and%20Divide+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    int tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long a, b;\n        cin >> a >> b;\n\n        long long ans = INT_MAX;\n        for (int addition = 0; addition < 32; addition++)\n        {\n            long long operations = addition;\n            long long new_b = b + addition;\n            if (new_b == 1) \n                continue;\n            long long copy_a = a;\n            while (copy_a > 0) \n            {\n                copy_a /= new_b;\n                operations++;\n            }\n            ans = min(ans, operations);\n        }\n        cout << ans << \"\\n\";\n    }\n}"
    },
    "order": 22
  },
  {
    "id": "1474B",
    "contestId": 1474,
    "index": "B",
    "title": "Different Divisors",
    "rating": 1000,
    "url": "https://codeforces.com/problemset/problem/1474/B",
    "tags": [
      "binary search",
      "constructive algorithms",
      "greedy",
      "math",
      "number theory"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1474B+Different%20Divisors+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    vector<long long> primes;\n    for (long long i = 2; i <= 100000; i++) \n    {\n        bool is_prime = true;\n        for (long long j = 2; j * j <= i; j++) \n        {\n            if (i % j == 0)\n            {\n                is_prime = false;\n                break;\n            }\n        }\n        if (is_prime)\n            primes.push_back(i);\n    }\n\n    \n    int t;\n    cin >> t;\n\n    while (t--) \n    {\n        long long d;\n        cin >> d;\n\n        long long p = -1;\n        for (long long i = 0; i < primes.size(); i++)\n        {\n            if (primes[i] >= (1 + d))\n            {\n                p = primes[i];\n                break;\n            }\n        }\n        long long q = -1;\n        for (long long i = 0; i < primes.size(); i++) \n        {\n            if (primes[i] >= (p + d))\n            {\n                q = primes[i];\n                break;\n            }\n        }\n\n        long long a = min(1LL * p * p * p, 1LL * p * q);\n        cout << a << \"\\n\";\n    }\n}"
    },
    "order": 23
  },
  {
    "id": "1447B",
    "contestId": 1447,
    "index": "B",
    "title": "Numbers Box",
    "rating": 1000,
    "url": "https://codeforces.com/problemset/problem/1447/B",
    "tags": [
      "greedy",
      "math"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1447B+Numbers%20Box+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    int tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long n, m;\n        cin >> n >> m;\n        vector<vector<long long> > a(n, vector<long long>(m));\n        for (long long i = 0; i < n; i++)\n            for (long long j = 0; j < m; j++)\n                cin >> a[i][j];\n\n        long long negatives = 0;\n        long long minimum = INT_MAX;\n        long long sum = 0;\n\n        for (long long i = 0; i < n; i++)\n        {\n            for (long long j = 0; j < m; j++)\n            {\n                if (a[i][j] < 0)\n                    negatives++;\n                minimum = min(minimum, abs(a[i][j]));\n                sum += abs(a[i][j]);\n            }\n        }\n        if (negatives % 2 == 0)\n            cout << sum << endl;\n        else\n            cout << sum - 2 * abs(minimum) << \"\\n\";\n    }\n}"
    },
    "order": 24
  },
  {
    "id": "1438B",
    "contestId": 1438,
    "index": "B",
    "title": "Valerii Against Everyone",
    "rating": 1000,
    "url": "https://codeforces.com/problemset/problem/1438/B",
    "tags": [
      "constructive algorithms",
      "data structures",
      "greedy",
      "sortings"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1438B+Valerii%20Against%20Everyone+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    int tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long n;\n        cin >> n;\n        vector<long long> a(n);\n        for (long long i = 0; i < n; i++) \n            cin >> a[i];\n        \n        unordered_set<long long> s;\n        for (long long i = 0; i < n; i++) \n            s.insert(a[i]); \n\n        if (s.size() < n)\n            cout << \"YES\" << \"\\n\";\n        else\n            cout << \"NO\" << \"\\n\";\n    }\n}"
    },
    "order": 25
  },
  {
    "id": "1418A",
    "contestId": 1418,
    "index": "A",
    "title": "Buying Torches",
    "rating": 1000,
    "url": "https://codeforces.com/problemset/problem/1418/A",
    "tags": [
      "math"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1418A+Buying%20Torches+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nlong long ceil_division(long long a, long long b) { return (a + b - 1) / b; }\n\nint main()\n{\n    int tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long x, y, k;\n        cin >> x >> y >> k;\n        long long sticks_gained_per_trade = x - 1; \n        long long sticks_needed = k * y + k - 1;\n\n        long long trades = 0;\n        trades += ceil_division(sticks_needed, sticks_gained_per_trade); \n        trades += k;\n        cout << trades << \"\\n\";\n    }\n}"
    },
    "order": 26
  },
  {
    "id": "1411B",
    "contestId": 1411,
    "index": "B",
    "title": "Fair Numbers",
    "rating": 1000,
    "url": "https://codeforces.com/problemset/problem/1411/B",
    "tags": [
      "brute force",
      "number theory"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1411B+Fair%20Numbers+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nbool isFair(long long n)\n{\n    long long num = n;\n    while (num != 0)\n    {\n        int x = num % 10;\n        if (x != 0 && n % x != 0)\n        {\n            return false;\n        }\n        num /= 10;\n    }\n    return true;\n} \n\nint main()\n{\n    int tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long n;\n        cin >> n;\n        while (!isFair(n)) \n            n += 1;\n        cout << n << \"\\n\";\n    }\n}"
    },
    "order": 27
  },
  {
    "id": "1374C",
    "contestId": 1374,
    "index": "C",
    "title": "Move Brackets",
    "rating": 1000,
    "url": "https://codeforces.com/problemset/problem/1374/C",
    "tags": [
      "greedy",
      "strings"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1374C+Move%20Brackets+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    long long tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long n;\n        cin >> n;\n        string s;\n        cin >> s; \n        long long sum = 0;\n        long long ops = 0;\n        for (int i = 0; i < n; i++) \n        {\n            if (s[i] == ')')\n                sum--;\n            else\n                sum++;\n            if (sum < 0)\n            {\n                ops++;\n                sum = 0;\n            }\n        }\n        cout << ops << \"\\n\";\n    }\n    return 0;\n}"
    },
    "order": 28
  },
  {
    "id": "1362A",
    "contestId": 1362,
    "index": "A",
    "title": "Johnny and Ancient Computer",
    "rating": 1000,
    "url": "https://codeforces.com/problemset/problem/1362/A",
    "tags": [
      "implementation"
    ],
    "hint": "Test small examples by hand, identify invariants preserved under the problem operations, and consider extreme corner cases (e.g. n=1, all equal elements).",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1362A+Johnny%20and%20Ancient%20Computer+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    long long tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long a, b;\n        cin >> a >> b;\n        long long ra = a;\n        long long rb = b;\n        while (ra % 2 == 0) \n            ra /= 2;\n        while (rb % 2 == 0) \n            rb /= 2;\n\n        if (ra != rb)\n            cout << -1 << \"\\n\";\n        else\n        {\n            a /= ra;\n            b /= rb;\n            a = log2(a); \n            b = log2(b); \n            long long ans = ceil(abs(a - b) / 3.0);\n            cout << ans << \"\\n\";\n        }\n    }\n    return 0;\n}"
    },
    "order": 29
  },
  {
    "id": "1312B",
    "contestId": 1312,
    "index": "B",
    "title": "Bogosort",
    "rating": 1000,
    "url": "https://codeforces.com/problemset/problem/1312/B",
    "tags": [
      "constructive algorithms",
      "sortings"
    ],
    "hint": "Build a pattern step by step. Look at small examples (n=1, 2, 3) to uncover an invariant or periodic pattern that generalizes to any valid input.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1312B+Bogosort+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    long long tt;\n    cin >> tt;\n    while (tt--)\n    {\n        long long n;\n        cin >> n;\n        vector<long long> a(n);\n        for (long long i = 0; i < n; i++) \n            cin >> a[i];\n\n        sort(a.rbegin(), a.rend()); \n\n        for (auto ele : a)\n            cout << ele << \" \";\n        cout << \"\\n\";\n    }\n    return 0;\n}"
    },
    "order": 30
  },
  {
    "id": "1155A",
    "contestId": 1155,
    "index": "A",
    "title": "Reverse a Substring",
    "rating": 1000,
    "url": "https://codeforces.com/problemset/problem/1155/A",
    "tags": [
      "implementation",
      "sortings",
      "strings"
    ],
    "hint": "Sort the array to impose monotonic order. Pairing adjacent elements or extremes (min with max) typically resolves the main condition.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1155A+Reverse%20a%20Substring+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n    long long n;\n    cin >> n;\n    string s; \n    cin >> s; \n\n    int flag = 0;\n    for (int i = 0; i < n - 1; i++) \n    {\n        if (s[i] > s[i + 1])\n        {\n            cout << \"YES\" << \"\\n\";\n            cout << i + 1 << \" \" << i + 2 << \"\\n\";\n            flag = 1;\n            break;\n        }\n    }\n\n    if (flag == 0)\n        cout << \"NO\" << \"\\n\";\n    return 0;\n}"
    },
    "order": 31
  },
  {
    "id": "1849B",
    "contestId": 1849,
    "index": "B",
    "title": "Monsters",
    "rating": 1000,
    "url": "https://codeforces.com/problemset/problem/1849/B",
    "tags": [
      "greedy",
      "math",
      "sortings"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1849B+Monsters+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 32
  },
  {
    "id": "1999B",
    "contestId": 1999,
    "index": "B",
    "title": "Card Game",
    "rating": 1000,
    "url": "https://codeforces.com/problemset/problem/1999/B",
    "tags": [
      "brute force",
      "constructive algorithms",
      "implementation"
    ],
    "hint": "Build a pattern step by step. Look at small examples (n=1, 2, 3) to uncover an invariant or periodic pattern that generalizes to any valid input.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1999B+Card%20Game+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 33
  },
  {
    "id": "1521A",
    "contestId": 1521,
    "index": "A",
    "title": "Nastia and Nearly Good Numbers",
    "rating": 1000,
    "url": "https://codeforces.com/problemset/problem/1521/A",
    "tags": [
      "constructive algorithms",
      "math",
      "number theory"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1521A+Nastia%20and%20Nearly%20Good%20Numbers+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 34
  },
  {
    "id": "1985C",
    "contestId": 1985,
    "index": "C",
    "title": "Good Prefixes",
    "rating": 1000,
    "url": "https://codeforces.com/problemset/problem/1985/C",
    "tags": [
      "greedy"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1985C+Good%20Prefixes+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 35
  },
  {
    "id": "1715B",
    "contestId": 1715,
    "index": "B",
    "title": "Beautiful Array",
    "rating": 1000,
    "url": "https://codeforces.com/problemset/problem/1715/B",
    "tags": [
      "constructive algorithms",
      "greedy",
      "math"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1715B+Beautiful%20Array+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 36
  },
  {
    "id": "1829D",
    "contestId": 1829,
    "index": "D",
    "title": "Gold Rush",
    "rating": 1000,
    "url": "https://codeforces.com/problemset/problem/1829/D",
    "tags": [
      "brute force",
      "dfs and similar",
      "dp",
      "implementation"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1829D+Gold%20Rush+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    vector<long long> dp(n + 1, 0);\n    for (int i = 0; i < n; i++) {\n        dp[i + 1] = max(dp[i], dp[i] + a[i]);\n    }\n    cout << dp[n] << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 37
  },
  {
    "id": "1941B",
    "contestId": 1941,
    "index": "B",
    "title": "Rudolf and 121",
    "rating": 1000,
    "url": "https://codeforces.com/problemset/problem/1941/B",
    "tags": [
      "brute force",
      "dp",
      "greedy",
      "math"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1941B+Rudolf%20and%20121+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    vector<long long> dp(n + 1, 0);\n    for (int i = 0; i < n; i++) {\n        dp[i + 1] = max(dp[i], dp[i] + a[i]);\n    }\n    cout << dp[n] << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 38
  },
  {
    "id": "1520C",
    "contestId": 1520,
    "index": "C",
    "title": "Not Adjacent Matrix",
    "rating": 1000,
    "url": "https://codeforces.com/problemset/problem/1520/C",
    "tags": [
      "constructive algorithms"
    ],
    "hint": "Build a pattern step by step. Look at small examples (n=1, 2, 3) to uncover an invariant or periodic pattern that generalizes to any valid input.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1520C+Not%20Adjacent%20Matrix+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 39
  },
  {
    "id": "1931C",
    "contestId": 1931,
    "index": "C",
    "title": "Make Equal Again",
    "rating": 1000,
    "url": "https://codeforces.com/problemset/problem/1931/C",
    "tags": [
      "brute force",
      "greedy",
      "math"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1931C+Make%20Equal%20Again+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 40
  },
  {
    "id": "1916B",
    "contestId": 1916,
    "index": "B",
    "title": "Two Divisors",
    "rating": 1000,
    "url": "https://codeforces.com/problemset/problem/1916/B",
    "tags": [
      "constructive algorithms",
      "math",
      "number theory"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1916B+Two%20Divisors+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 41
  },
  {
    "id": "1955B",
    "contestId": 1955,
    "index": "B",
    "title": "Progressive Square",
    "rating": 1000,
    "url": "https://codeforces.com/problemset/problem/1955/B",
    "tags": [
      "constructive algorithms",
      "data structures",
      "implementation",
      "sortings"
    ],
    "hint": "Speed up operations from O(N) to O(log N) using appropriate containers like std::set, std::map, or a Fenwick/Segment Tree for dynamic range queries and updates.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1955B+Progressive%20Square+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 42
  },
  {
    "id": "2004B",
    "contestId": 2004,
    "index": "B",
    "title": "Game with Doors",
    "rating": 1000,
    "url": "https://codeforces.com/problemset/problem/2004/B",
    "tags": [
      "brute force",
      "greedy"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+2004B+Game%20with%20Doors+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 43
  },
  {
    "id": "2000C",
    "contestId": 2000,
    "index": "C",
    "title": "Numeric String Template",
    "rating": 1000,
    "url": "https://codeforces.com/problemset/problem/2000/C",
    "tags": [
      "data structures",
      "strings"
    ],
    "hint": "Speed up operations from O(N) to O(log N) using appropriate containers like std::set, std::map, or a Fenwick/Segment Tree for dynamic range queries and updates.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+2000C+Numeric%20String%20Template+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 44
  },
  {
    "id": "2167D",
    "contestId": 2167,
    "index": "D",
    "title": "Yet Another Array Problem",
    "rating": 1000,
    "url": "https://codeforces.com/problemset/problem/2167/D",
    "tags": [
      "brute force",
      "implementation",
      "math",
      "number theory"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+2167D+Yet%20Another%20Array%20Problem+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 45
  },
  {
    "id": "1927C",
    "contestId": 1927,
    "index": "C",
    "title": "Choose the Different Ones!",
    "rating": 1000,
    "url": "https://codeforces.com/problemset/problem/1927/C",
    "tags": [
      "brute force",
      "greedy",
      "math"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1927C+Choose%20the%20Different%20Ones!+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 46
  },
  {
    "id": "2123C",
    "contestId": 2123,
    "index": "C",
    "title": "Prefix Min and Suffix Max",
    "rating": 1000,
    "url": "https://codeforces.com/problemset/problem/2123/C",
    "tags": [
      "brute force",
      "data structures"
    ],
    "hint": "Speed up operations from O(N) to O(log N) using appropriate containers like std::set, std::map, or a Fenwick/Segment Tree for dynamic range queries and updates.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+2123C+Prefix%20Min%20and%20Suffix%20Max+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 47
  },
  {
    "id": "2093C",
    "contestId": 2093,
    "index": "C",
    "title": "Simple Repetition",
    "rating": 1000,
    "url": "https://codeforces.com/problemset/problem/2093/C",
    "tags": [
      "math",
      "number theory"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+2093C+Simple%20Repetition+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 48
  },
  {
    "id": "2114C",
    "contestId": 2114,
    "index": "C",
    "title": "Need More Arrays",
    "rating": 1000,
    "url": "https://codeforces.com/problemset/problem/2114/C",
    "tags": [
      "dp",
      "greedy"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+2114C+Need%20More%20Arrays+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    vector<long long> dp(n + 1, 0);\n    for (int i = 0; i < n; i++) {\n        dp[i + 1] = max(dp[i], dp[i] + a[i]);\n    }\n    cout << dp[n] << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 49
  },
  {
    "id": "1907B",
    "contestId": 1907,
    "index": "B",
    "title": "YetnotherrokenKeoard",
    "rating": 1000,
    "url": "https://codeforces.com/problemset/problem/1907/B",
    "tags": [
      "data structures",
      "implementation",
      "strings"
    ],
    "hint": "Speed up operations from O(N) to O(log N) using appropriate containers like std::set, std::map, or a Fenwick/Segment Tree for dynamic range queries and updates.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1907B+YetnotherrokenKeoard+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 50
  },
  {
    "id": "1917B",
    "contestId": 1917,
    "index": "B",
    "title": "Erase First or Second Letter",
    "rating": 1100,
    "url": "https://codeforces.com/problemset/problem/1917/B",
    "tags": [
      "brute force",
      "combinatorics",
      "data structures",
      "dp",
      "strings"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1917B+Erase%20First%20or%20Second%20Letter+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\ntypedef long long ll;\nint main(){\n    int tt=1;\n    cin>>tt;\n    while(tt--){\n        int n;\n        cin>>n;\n        string s;\n        cin>>s;\n        map<char,int>freq;\n        int count=0;\n        vector<int>distinct(n,0);\n        for(int i=0;i<n;i++){\n            freq[s[i]]++;\n            if(freq[s[i]]==1){\n                count++;\n            }\n            distinct[i]=count;\n        }\n        ll ans=0;\n        for(int i=0;i<n;i++){\n            ans+=distinct[i];\n        }\n        cout<<ans<<\"\\n\";\n    }\n}"
    },
    "order": 1
  },
  {
    "id": "1760F",
    "contestId": 1760,
    "index": "F",
    "title": "Quests",
    "rating": 1100,
    "url": "https://codeforces.com/problemset/problem/1760/F",
    "tags": [
      "binary search",
      "greedy",
      "sortings"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1760F+Quests+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\ntypedef long long ll;\nint main(){\n    int tt=1;\n    cin>>tt;\n    while(tt--){\n        int n,k;\n        cin>>n>>k;\n        vector<int>a(n),b(n);\n        for(int i=0;i<n;i++){\n            cin>>a[i];\n        }\n        for(int i=0;i<n;i++){\n            cin>>b[i];\n        }\n        int maxi=0;\n        int sum=0;\n        int ans=0;\n        for(int i=0;i<min(n,k);i++){\n            sum+=a[i];\n            maxi=max(maxi,b[i]);\n            ans=max(ans,sum+(k-(i+1))*maxi);\n        }\n        cout<<ans<<\"\\n\";\n    }\n    \n}"
    },
    "order": 2
  },
  {
    "id": "1904B",
    "contestId": 1904,
    "index": "B",
    "title": "Collecting Game",
    "rating": 1100,
    "url": "https://codeforces.com/problemset/problem/1904/B",
    "tags": [
      "binary search",
      "dp",
      "greedy",
      "sortings",
      "two pointers"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1904B+Collecting%20Game+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\ntypedef long long ll;\nint main(){\n    int tt=1;\n    cin>>tt;\n    while(tt--){\n        ll n;\n        cin>>n;\n        ll a;\n        vector<pair<ll,ll>>v;\n        for(int i=0;i<n;i++){\n            cin>>a;\n            v.push_back({a,i});\n        }\n        vector<ll>pre(n);\n        sort(v.begin(),v.end());\n        pre[0]=v[0].first;\n        for(int i=1;i<n;i++){\n            pre[i]=pre[i-1]+v[i].first;\n        }\n        vector<ll>ans(n);\n        for(int i=0;i<n;i++){\n            int j=i;\n            int found=i;\n            while(j<n){\n                pair<ll,ll>temp={pre[j]+1,INT_MIN};\n                ll idx=lower_bound(v.begin(),v.end(),temp)-v.begin();\n                idx--;\n                if(idx==j){\n                    break;\n                }\n                found+=idx-j;\n                j=idx;\n            }\n            ans[v[i].second]=found;\n        }\n        for(int i=0;i<n;i++){\n            cout<<ans[i]<<\" \";\n        }\n        cout<<\"\\n\";\n    }\n}"
    },
    "order": 3
  },
  {
    "id": "1899C",
    "contestId": 1899,
    "index": "C",
    "title": "Yarik and Array",
    "rating": 1100,
    "url": "https://codeforces.com/problemset/problem/1899/C",
    "tags": [
      "dp",
      "greedy",
      "two pointers"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1899C+Yarik%20and%20Array+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\ntypedef long long ll;\nint main(){\n    int t=1;\n    cin>>t;\n    while(t--){\n        ll n;\n        cin>>n;\n        vector<ll>v(n);\n        for(int i=0;i<n;i++){\n            cin>>v[i];\n        }\n        ll ans=INT_MIN;\n        int i=0,j=0;\n        ll sum=0;\n        while(j<n){\n            if(sum<0){\n                sum=0;\n                i=j;\n            }\n            if(i<j){\n                if( (v[j]^v[j-1]) & 1 ){\n                    sum+=v[j];\n                }\n                else{\n                    sum=v[j];\n                    i=j;\n                }\n            }\n            else{\n                sum=v[j];\n            }\n            ans=max(ans,sum);\n            j++;\n        }\n        cout<<ans<<endl;\n    }\n}"
    },
    "order": 4
  },
  {
    "id": "1899B",
    "contestId": 1899,
    "index": "B",
    "title": "250 Thousand Tons of TNT",
    "rating": 1100,
    "url": "https://codeforces.com/problemset/problem/1899/B",
    "tags": [
      "brute force",
      "implementation",
      "number theory"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1899B+250%20Thousand%20Tons%20of%20TNT+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n#define ll long long\n\nvoid solve() {\n    int n;\n    cin>>n;\n    vector<ll>v(n);\n    for(auto &it:v)cin>>it;\n    vector<ll>pre(n);\n    pre[0]=v[0];\n    for(ll i=1;i<n;i++){//n\n        pre[i]=v[i]+pre[i-1];\n    }\n    ll ans=0;\n    for(ll k=1;k<=n;k++){\n        if(n%k)continue;\n        ll start=k-1;\n        ll res=0;\n        ll maxi=pre[start];\n        ll mini=pre[start];\n        for(ll idx=start+k;idx<n;idx+=k){\n            ll curr=pre[idx]-pre[idx-k];\n            maxi=max(maxi,curr);\n            mini=min(mini,curr);\n        }\n        ans=max(ans,maxi-mini);\n    }\n    cout<<ans<<endl;\n}\n\n\n\nint main() {\n    int tt = 1;\n    cin >> tt;\n    while (tt--) {\n        solve();\n    }\n}"
    },
    "order": 5
  },
  {
    "id": "331E1",
    "contestId": 331,
    "index": "E1",
    "title": "Deja Vu",
    "rating": 1100,
    "url": "https://codeforces.com/problemset/problem/331/E1",
    "tags": [
      "constructive algorithms",
      "graphs",
      "implementation"
    ],
    "hint": "Represent the input as an adjacency list. Use BFS/DFS traversal to discover reachable components, compute shortest hops in unweighted graphs, or detect bipartite coloring.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+331E1+Deja%20Vu+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n#define ll long long \nint main(){\n    int tt;\n    cin>>tt;\n    while(tt--){\n        ll n,q;\n        cin>>n>>q;\n        vector<ll>a(n);\n        for(int i=0;i<n;i++){\n            cin>>a[i];\n        }\n        vector<ll>x(q);\n        for(int i=0;i<q;i++){\n            cin>>x[i];\n        }\n        ll prev=31;\n        for(int i=0;i<q;i++){//q\n            if(x[i]>=prev)continue;\n            ll val=pow(2,x[i]);\n            for(int j=0;j<n;j++){\n                if(a[j]%val==0){\n                    a[j]+=(val/2);\n                }\n            }\n            prev=x[i];\n        }\n        for(int i=0;i<n;i++){\n            cout<<a[i]<<\" \";\n        }\n        cout<<\"\\n\";\n    }\n    \n}"
    },
    "order": 6
  },
  {
    "id": "1873E",
    "contestId": 1873,
    "index": "E",
    "title": "Building an Aquarium",
    "rating": 1100,
    "url": "https://codeforces.com/problemset/problem/1873/E",
    "tags": [
      "binary search",
      "sortings"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1873E+Building%20an%20Aquarium+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n#define ll long long \nbool check(ll mid,vector<ll>&heights,ll x){\n    ll units=0;\n    int n=heights.size();\n    for(int i=0;i<n;i++){\n        if(heights[i]<mid){\n            units+=(mid-heights[i]);\n        }\n    }\n    return units<=x;\n}\nint main(){\n    int tt;\n    cin>>tt;\n    while(tt--){\n        ll n,x;\n        cin>>n>>x;\n        vector<ll>heights(n);\n        for(int i=0;i<n;i++){\n            cin>>heights[i];\n        }\n        ll si=1,ei=1e12,ans=-1;\n        while(si<=ei){\n            ll mid=si+(ei-si)/2;\n            if(check(mid,heights,x)){\n                ans=mid;\n                si=mid+1;\n            }\n            else{\n                ei=mid-1;\n            }\n        }\n        cout<<ans<<\"\\n\";\n    }\n    \n}"
    },
    "order": 7
  },
  {
    "id": "1869B",
    "contestId": 1869,
    "index": "B",
    "title": "2D Traveling",
    "rating": 1100,
    "url": "https://codeforces.com/problemset/problem/1869/B",
    "tags": [
      "geometry",
      "math",
      "shortest paths",
      "sortings"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1869B+2D%20Traveling+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n#define ll long long\nvoid solve() {\n    int n, k, s, t;\n    cin >> n >> k >> s >> t;\n    vector<ll> x(n + 1), y(n + 1);\n    for (int i = 1; i <= n; i++) {\n        cin >> x[i] >> y[i];\n    }\n    ll ans = abs(x[s] - x[t]) + abs(y[s] - y[t]);\n    ll mins = 1e17 , mint = 1e17;\n    for (int i = 1; i <= k; i++) {//K\n        mins = min(mins, abs(x[s] - x[i]) + abs(y[s] - y[i]));\n        mint = min(mint, abs(x[t] - x[i]) + abs(y[t] - y[i]));\n    }\n    ans = min(ans, mins + mint);\n    cout << ans << \"\\n\";\n}\nint main() {\n    int tt;\n    cin >> tt;\n    while (tt--) {\n        solve();\n    }\n\n}"
    },
    "order": 8
  },
  {
    "id": "1850E",
    "contestId": 1850,
    "index": "E",
    "title": "Cardboard for Pictures",
    "rating": 1100,
    "url": "https://codeforces.com/problemset/problem/1850/E",
    "tags": [
      "binary search",
      "geometry",
      "implementation",
      "math"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1850E+Cardboard%20for%20Pictures+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\n#define ll long long \n\nvoid solve(){\n    ll n, c; \n    cin >> n >> c;\n    vector<ll> a(n);\n    for(int i = 0; i < n; ++i) {\n        cin >> a[i];\n    }\n    ll l = 1, r = 1e9,ans=-1;\n    while(l <= r) {\n        ll mid = l + (r - l) / 2;\n        ll sum_all = 0;\n        for(int i = 0; i < n; ++i) {\n            sum_all += (a[i] + 2 * mid) * (a[i] + 2 * mid);\n            if(sum_all > c) break;\n        }\n        if(sum_all <= c) {\n            ans=mid;\n            l=mid+1;\n        }\n        else{\n            r=mid-1;\n        }\n    }\n    cout<<ans<<\"\\n\";\n}\n\nint main() {\n    int tt;\n    cin>>tt;\n    while(tt--){\n        solve();\n    }\n    \n}"
    },
    "order": 9
  },
  {
    "id": "1842B",
    "contestId": 1842,
    "index": "B",
    "title": "Tenzing and Books",
    "rating": 1100,
    "url": "https://codeforces.com/problemset/problem/1842/B",
    "tags": [
      "bitmasks",
      "greedy",
      "math"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1842B+Tenzing%20and%20Books+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false), cin.tie(nullptr);\n    int tt;\n    cin >> tt;\n    while (tt--) {\n        int n, x;\n        cin >> n >> x;\n        vector<int> pre[3];\n        for (int i = 0; i < 3; i++) {\n            int s = 0;\n            pre[i].push_back(s);\n            for (int j = 0; j < n; j++) {\n                int a;\n                cin >> a;\n                if ((s | a) != s){\n                    s |= a;\n                    pre[i].push_back(s);\n                }\n            }\n        }\n        bool ans = 0;\n        for (int A : pre[0]){\n            for (int B : pre[1]) {\n                for (int C : pre[2]){\n                    if((A | B | C )== x){\n                        ans=true;\n                    }\n                }\n            }\n        } \n            \n        cout << (ans ? \"YES\\n\" : \"NO\\n\");\n    }\n}"
    },
    "order": 10
  },
  {
    "id": "1832B",
    "contestId": 1832,
    "index": "B",
    "title": "Maximum Sum",
    "rating": 1100,
    "url": "https://codeforces.com/problemset/problem/1832/B",
    "tags": [
      "brute force",
      "sortings",
      "two pointers"
    ],
    "hint": "Notice that as the right pointer expands, the left pointer only needs to move forward. Maintain frequency counts or window invariants to keep the window valid in O(N) overall.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1832B+Maximum%20Sum+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\ntypedef long long ll;\nint main() {\n    int tt = 1;\n    cin >> tt;\n    while (tt--) {\n        ll n, k;\n        cin >> n >> k;\n        vector<ll>v(n);\n        for (auto &it : v)cin >> it;\n        sort(v.begin(), v.end());\n        vector<ll>pre(n);\n        pre[0] = v[0];\n        for (int i = 1; i < n; i++) {\n            pre[i] = v[i] + pre[i - 1];\n        }\n        ll ans = 0;\n        for (int first = 0; first <= k; first++) {\n            int second=k-first;\n            int left=2*first;\n            int right=n-second-1;\n            ll sum=pre[right]-(left==0 ? 0 : pre[left-1]);\n            ans=max(ans,sum);\n        }\n        cout<<ans<<\"\\n\";\n    }\n}"
    },
    "order": 11
  },
  {
    "id": "1827A",
    "contestId": 1827,
    "index": "A",
    "title": "Counting Orders",
    "rating": 1100,
    "url": "https://codeforces.com/problemset/problem/1827/A",
    "tags": [
      "combinatorics",
      "math",
      "sortings",
      "two pointers"
    ],
    "hint": "Notice that as the right pointer expands, the left pointer only needs to move forward. Maintain frequency counts or window invariants to keep the window valid in O(N) overall.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1827A+Counting%20Orders+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n#define ll long long\n#define MOD (ll)(1e9+7)\nvoid solve() {\n    int n; \n    cin >> n;\n    vector<int> a(n);\n    for (int i = 0; i < n; i++){\n        cin>>a[i];\n    }\n    sort(a.begin(), a.end());\n    vector<int> b(n);\n    for (int i = 0; i < n; i++){\n        cin>>b[i];\n    }\n    sort(b.rbegin(), b.rend());\n    ll result = 1;\n    for (int i = 0; i < n; i++) {\n        ll temp=upper_bound(a.begin(), a.end(), b[i]) - a.begin();\n        ll count = a.size() - temp;\n        result = result * max(count - i, 0LL) % MOD;\n    }\n    cout << result << \"\\n\";\n}\n\nint main() {\n    int tt= 1;\n    cin >> tt;\n    while (tt--) {\n        solve();\n    }\n}"
    },
    "order": 12
  },
  {
    "id": "1826B",
    "contestId": 1826,
    "index": "B",
    "title": "Lunatic Never Content",
    "rating": 1100,
    "url": "https://codeforces.com/problemset/problem/1826/B",
    "tags": [
      "math",
      "number theory"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1826B+Lunatic%20Never%20Content+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    cin >> n;\n    vector<int> a(n);\n    for (auto &i : a) cin >> i;\n    int ans = 0;\n    for (int i = 0; i < n; ++i) {\n        ans = __gcd(ans, abs(a[i] - a[n - i - 1]));\n    }\n    cout << ans << \"\\n\";\n}\n \nint main() {\n    int tt;\n    cin >> tt;\n    while (tt--) {\n        solve();\n    }\n}"
    },
    "order": 13
  },
  {
    "id": "1821B",
    "contestId": 1821,
    "index": "B",
    "title": "Sort the Subarray",
    "rating": 1100,
    "url": "https://codeforces.com/problemset/problem/1821/B",
    "tags": [
      "brute force",
      "greedy"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1821B+Sort%20the%20Subarray+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n \nusing namespace std;\n#define ll long long\nint main()\n{\n    ll tt;\n    cin>>tt;\n    while(tt--){\n        ll n;\n        cin>>n;\n        ll arr[n];\n        ll arr2[n];\n        for(int i=0;i<n;i++){\n            cin>>arr[i];\n        }\n        for(int i=0;i<n;i++){\n            cin>>arr2[i];\n        }\n        int change1=-1,change2=-1;\n        for(int i=0;i<n;i++){\n            if(arr[i]!=arr2[i]){\n                if(change1==-1){\n                    change1=i;\n                }\n                else{\n                    change2=i;\n                    break;\n                }\n            }\n        }\n        int i=change1-1;\n        while(i>=0){\n            if(arr2[i]<=arr2[i+1]){\n                i--;\n            }\n            else{\n                break;\n            }\n        }\n        change1=i+1;\n        if(change2==-1){\n            change2=n-1;\n        }\n        int j=change2+1;\n        while(j<n){\n            if(arr2[j]>=arr2[j-1]){\n                j++;\n            }\n            else{\n                break;\n            }\n        }\n        change2=j-1;\n        cout<<change1+1<<\" \"<<change2+1<<\"\\n\";\n    }\n}"
    },
    "order": 14
  },
  {
    "id": "1820B",
    "contestId": 1820,
    "index": "B",
    "title": "JoJo's Incredible Adventures",
    "rating": 1100,
    "url": "https://codeforces.com/problemset/problem/1820/B",
    "tags": [
      "math",
      "strings",
      "two pointers"
    ],
    "hint": "Notice that as the right pointer expands, the left pointer only needs to move forward. Maintain frequency counts or window invariants to keep the window valid in O(N) overall.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1820B+JoJo's%20Incredible%20Adventures+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\ntypedef long long ll;\nvoid solve(){\n    string s;\n    cin>>s;\n    ll n=s.size();\n    int maxi=0;\n    int i=0;\n    while(i<n){\n        if(s[i]=='0'){\n            i++;\n            continue;\n        }\n        int j=i+1;\n        while(j<n && s[j]=='1'){\n            j++;\n        }\n        maxi=max(maxi,j-i);\n        i=j;\n    }\n    if(maxi==n){\n        cout<<n*n<<\"\\n\";\n        return;\n    }\n    if(s[0]=='1' && s[n-1]=='1'){\n        int i=0;\n        int cnt=0;\n        while(i<n && s[i]=='1'){\n            i++;\n            cnt++;\n        }\n        int j=n-1;\n        while(j>i && s[j]=='1'){\n            j--,cnt++;\n        }\n        maxi=max(maxi,cnt);\n    }\n    maxi++;\n    ll temp=(maxi+1)/2;\n    cout<<(temp)*(maxi/2)<<\"\\n\";\n}\n\nint main(){\n    int tt=1;\n    cin>>tt;\n    while(tt--){\n        solve();\n    }\n}"
    },
    "order": 15
  },
  {
    "id": "1807G2",
    "contestId": 1807,
    "index": "G2",
    "title": "Subsequence Addition (Hard Version)",
    "rating": 1100,
    "url": "https://codeforces.com/problemset/problem/1807/G2",
    "tags": [
      "bitmasks",
      "dp",
      "greedy",
      "implementation",
      "sortings"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1807G2+Subsequence%20Addition%20(Hard%20Version)+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\ntypedef long long ll;\nvoid solve(){\n    ll n;\n    cin>>n;\n    vector<ll>v(n);\n    for(int i=0;i<n;i++){\n        cin>>v[i];\n    }\n    sort(v.begin(),v.end());\n    if(v[0]!=1){\n        cout<<\"No\"<<\"\\n\";\n        return;\n    }\n    ll sum=1;\n    for(int i=1;i<n;i++){\n        if(v[i]>sum){\n            cout<<\"No\"<<\"\\n\";\n            return;\n        }\n        sum+=v[i];\n    }\n    cout<<\"Yes\"<<\"\\n\";\n}\n\nint main(){\n    int tt=1;\n    cin>>tt;\n    while(tt--){\n        solve();\n    }\n}"
    },
    "order": 16
  },
  {
    "id": "1797B",
    "contestId": 1797,
    "index": "B",
    "title": "Li Hua and Pattern",
    "rating": 1100,
    "url": "https://codeforces.com/problemset/problem/1797/B",
    "tags": [
      "constructive algorithms",
      "greedy"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1797B+Li%20Hua%20and%20Pattern+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n#define ll long long\nint main()\n{\n    ll tt;\n    cin>>tt;\n    while(tt--){\n        ll n,k;\n        cin>>n>>k;\n        ll arr[n][n];\n        for(int i=0;i<n;i++){\n            for(int j=0;j<n;j++){\n                cin>>arr[i][j];\n            }\n        }\n        ll cnt=0;\n        for(int i=0;i<n;i++){\n            for(int j=0;j<n;j++){\n                if(arr[i][j]!=arr[n-i-1][n-j-1]){\n                    cnt++;\n                }\n            }\n        }\n        cnt/=2;\n        if(cnt>k){\n            cout<<\"NO\"<<\"\\n\";\n        }\n        else{\n            ll temp=k-cnt;\n            if(temp%2==0)cout<<\"YES\"<<\"\\n\";\n            else{\n                if(n%2==0)cout<<\"NO\"<<\"\\n\";\n                else cout<<\"YES\"<<\"\\n\";\n            }\n        }\n    }\n}"
    },
    "order": 17
  },
  {
    "id": "1791G1",
    "contestId": 1791,
    "index": "G1",
    "title": "Teleporters (Easy Version)",
    "rating": 1100,
    "url": "https://codeforces.com/problemset/problem/1791/G1",
    "tags": [
      "greedy",
      "sortings"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1791G1+Teleporters%20(Easy%20Version)+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\ntypedef long long ll;\nvoid solve(){\n    ll n;\n    cin>>n;\n    ll c;\n    cin>>c;\n    vector<ll>cost;\n    for(int i=1;i<=n;i++){\n        ll x;\n        cin>>x;\n        cost.push_back(i+x);\n    }\n    sort(cost.begin(),cost.end());\n    int i=0;\n    int ans=0;\n    while(i<n && cost[i]<=c){\n        c-=cost[i];\n        ans++;\n        i++;\n    }\n    cout<<ans<<\"\\n\";\n}\n\nint main(){\n    int tt=1;\n    cin>>tt;\n    while(tt--){\n        solve();\n    }\n}"
    },
    "order": 18
  },
  {
    "id": "1791E",
    "contestId": 1791,
    "index": "E",
    "title": "Negatives and Positives",
    "rating": 1100,
    "url": "https://codeforces.com/problemset/problem/1791/E",
    "tags": [
      "dp",
      "greedy",
      "sortings"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1791E+Negatives%20and%20Positives+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n#define ll long long\nint main() {\n    int tt; cin >> tt;\n    while(tt--) {\n        int n; cin >> n;\n        vector<int> a(n);\n        ll sum = 0;\n        int negs = 0;\n        for(int i = 0; i < n; ++i) {\n            cin >> a[i];\n            if(a[i] < 0) {\n                ++negs;\n                a[i] = -a[i];\n            }\n            sum += a[i];\n        }\n        sort(a.begin(), a.end());\n        if(negs & 1) sum -= 2 * a[0];\n        cout << sum << \"\\n\";\n    }\n}"
    },
    "order": 19
  },
  {
    "id": "1780B",
    "contestId": 1780,
    "index": "B",
    "title": "GCD Partition",
    "rating": 1100,
    "url": "https://codeforces.com/problemset/problem/1780/B",
    "tags": [
      "brute force",
      "greedy",
      "math",
      "number theory"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1780B+GCD%20Partition+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\ntypedef long long ll;\n\nvoid solve() {\n\tll n;\n\tcin >> n;\n\tvector<ll> v(n);\n\n\tfor (int i = 0; i < n; i++) {\n\t\tcin >> v[i];\n\t}\n\n\tll ans = 0; \n\tll total_sum = accumulate(v.begin(), v.end(), 0LL);\n\tll sum = 0;\n\n\t\n\tfor (int i = 0; i < n - 1; i++) {\n\t\tsum += v[i];\n\t\tans = max(ans, __gcd(total_sum - sum, sum));\n\t}\n\n\tcout << ans << \"\\n\";\n}\n\nint main() {\n\tint tt = 1;\n\tcin >> tt;\n\twhile (tt--) {\n\t\tsolve(); \n\t}\n}"
    },
    "order": 20
  },
  {
    "id": "1742D",
    "contestId": 1742,
    "index": "D",
    "title": "Coprime",
    "rating": 1100,
    "url": "https://codeforces.com/problemset/problem/1742/D",
    "tags": [
      "brute force",
      "greedy",
      "number theory"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1742D+Coprime+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nvector<int> pairs[1001];\n\nvoid solve() {\n\tint n;\n\tcin >> n;\n\tvector<int> idx(1001, 0);\n\n\tfor (int i = 1; i <= n; ++i) { \n\t\tint x;\n\t\tcin >> x;\n\t\tidx[x] = i;\n\t}\n\n\tint ans = -1; \n\tfor (int i = 1; i <= 1000; ++i) { \n\t\tif (idx[i] == 0) {\n\t\t\tcontinue; \n\t\t}\n\t\tfor (int j : pairs[i]) {\n\t\t\tif (idx[j] != 0) {\n\t\t\t\tans = max(ans, idx[i] + idx[j]);\n\t\t\t}\n\t\t}\n\t}\n\n\tcout << ans << endl; \n}\n\nint main() {\n\tfor (int i = 1; i <= 1000; ++i) {\n\t\tfor (int j = 1; j <= 1000; ++j) {\n\t\t\tif (__gcd(i, j) == 1) {\n\t\t\t\tpairs[i].push_back(j); \n\t\t\t}\n\t\t}\n\t}\n\n\tint tt;\n\tcin >> tt;\n\n\twhile (tt--) {\n\t\tsolve();\n\t}\n}"
    },
    "order": 21
  },
  {
    "id": "1731B",
    "contestId": 1731,
    "index": "B",
    "title": "Kill Demodogs",
    "rating": 1100,
    "url": "https://codeforces.com/problemset/problem/1731/B",
    "tags": [
      "greedy",
      "math"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1731B+Kill%20Demodogs+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nusing int64 = long long;\nconst int64 MOD = 1000000007LL;\n\nint64 modmul(long long a, long long b){\n    return ( (__int128)a * b ) % MOD;\n}\n\nint main(){\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int tt; if(!(cin>>tt)) return 0;\n    const int64 INV6 = 166666668LL;\n    const int64 MUL = 2022LL % MOD;\n    while(tt--){\n        long long n; cin>>n;\n        long long a = n % MOD;\n        long long a2 = modmul(a,a);\n        long long val = ( (4 * a2) % MOD + (3 * a) % MOD - 1 ) % MOD;\n        if(val < 0) val += MOD;\n        long long ans = modmul(a, val);\n        ans = modmul(ans, INV6);\n        ans = modmul(ans, MUL);\n        cout << ans % MOD << '\\n';\n    }\n    return 0;\n}"
    },
    "order": 22
  },
  {
    "id": "1708B",
    "contestId": 1708,
    "index": "B",
    "title": "Difference of GCDs",
    "rating": 1100,
    "url": "https://codeforces.com/problemset/problem/1708/B",
    "tags": [
      "constructive algorithms",
      "math"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1708B+Difference%20of%20GCDs+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\ntypedef long long ll;\n\nvoid solve() {\n\tll n;\n\tcin >> n;\n\tll l, r;\n\tcin >> l >> r;\n\tvector<ll> ans; \n\n\tfor (int i = 1; i <= n; i++) {\n\t\tll temp = ((l + i - 1) / i) * i;\n\t\tans.push_back(temp); \n\n\t\tif (temp > r) {\n\t\t\tcout << \"NO\" << \"\\n\";\n\t\t\treturn;\n\t\t}\n\t}\n\n\tcout << \"YES\" << \"\\n\";\n\tfor (auto it : ans) {\n\t\tcout << it << \" \";\n\t}\n\tcout << \"\\n\";\n}\n\nint main() {\n\tint tt = 1;\n\tcin >> tt;\n\twhile (tt--) {\n\t\tsolve();\n\t}\n}"
    },
    "order": 23
  },
  {
    "id": "1682B",
    "contestId": 1682,
    "index": "B",
    "title": "AND Sorting",
    "rating": 1100,
    "url": "https://codeforces.com/problemset/problem/1682/B",
    "tags": [
      "bitmasks",
      "constructive algorithms",
      "sortings"
    ],
    "hint": "Build a pattern step by step. Look at small examples (n=1, 2, 3) to uncover an invariant or periodic pattern that generalizes to any valid input.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1682B+AND%20Sorting+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n#define ll long long\n\nint main() {\n\tint t;\n\tcin >> t;\n\twhile (t--) {\n\t\tint n;\n\t\tcin >> n;\n\t\tint ans = (1 << 30) - 1;\n\t\tfor (int i = 0; i < n; ++i) { \n\t\t\tint x; \n\t\t\tcin >> x;\n\t\t\tif (x != i) {\n\t\t\t\tans &= x;\n\t\t\t}\n\t\t}\n\t\tcout << ans << \"\\n\";\n\t}\n}"
    },
    "order": 24
  },
  {
    "id": "1673B",
    "contestId": 1673,
    "index": "B",
    "title": "A Perfectly Balanced String?",
    "rating": 1100,
    "url": "https://codeforces.com/problemset/problem/1673/B",
    "tags": [
      "brute force",
      "greedy",
      "strings"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1673B+A%20Perfectly%20Balanced%20String%3F+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n\tstring s;\n\tcin >> s; \n\tint n = (int)s.size(); \n\tset<char> c; \n\tint k;\n\tfor (k = 0; k < n; k++) {\n\t\tif (c.find(s[k]) == c.end()) {\n\t\t\tc.insert(s[k]); \n\t\t} else {\n\t\t\tbreak; \n\t\t}\n\t}\n\tfor (int i = k; i < n; i++) { \n\t\tif (s[i] != s[i - k]) {\n\t\t\tcout << \"NO\" << endl; \n\t\t\treturn;\n\t\t}\n\t}\n\tcout << \"YES\" << endl; \n}\n\n\nint main() {\n\tint tt = 1;\n\tcin >> tt; \n\twhile (tt--) {\n\t\tsolve(); \n\t}\n}"
    },
    "order": 25
  },
  {
    "id": "1669F",
    "contestId": 1669,
    "index": "F",
    "title": "Eating Candies",
    "rating": 1100,
    "url": "https://codeforces.com/problemset/problem/1669/F",
    "tags": [
      "binary search",
      "data structures",
      "greedy",
      "two pointers"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1669F+Eating%20Candies+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n\tstring s;\n\tcin >> s; \n\tint n = (int)s.size(); \n\tset<char> c; \n\tint k;\n\tfor (k = 0; k < n; k++) {\n\t\tif (c.find(s[k]) == c.end()) {\n\t\t\tc.insert(s[k]); \n\t\t} else {\n\t\t\tbreak; \n\t\t}\n\t}\n\tfor (int i = k; i < n; i++) { \n\t\tif (s[i] != s[i - k]) {\n\t\t\tcout << \"NO\" << endl; \n\t\t\treturn;\n\t\t}\n\t}\n\tcout << \"YES\" << endl; \n}\n\n\nint main() {\n\tint tt = 1;\n\tcin >> tt; \n\twhile (tt--) {\n\t\tsolve(); \n\t}\n}"
    },
    "order": 26
  },
  {
    "id": "1656B",
    "contestId": 1656,
    "index": "B",
    "title": "Subtract Operation",
    "rating": 1100,
    "url": "https://codeforces.com/problemset/problem/1656/B",
    "tags": [
      "data structures",
      "greedy",
      "math",
      "two pointers"
    ],
    "hint": "Notice that as the right pointer expands, the left pointer only needs to move forward. Maintain frequency counts or window invariants to keep the window valid in O(N) overall.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1656B+Subtract%20Operation+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n#define ll long long\n\nvoid solve() {\n\tll n, k;\n\tcin >> n >> k; \n\tvector<ll> v(n); \n\tfor (int i = 0; i < n; i++) {\n\t\tcin >> v[i];\n\t}\n\n\tmap<ll, bool> mp;\n\tfor (auto it : v) {\n\t\tmp[it] = true;\n\t}\n\tfor (int i = 0; i < n; i++) {\n\t\tif (mp.find(v[i] - k) != mp.end()) {\n\t\t\tcout << \"YES\" << endl;\n\t\t\treturn;\n\t\t}\n\t}\n\n\tcout << \"NO\" << \"\\n\"; \n}\n\nint main() {\n\n\tint tt;\n\tcin >> tt;\n\twhile (tt--) {\n\t\tsolve();\n\t}\n}"
    },
    "order": 27
  },
  {
    "id": "2209B",
    "contestId": 2209,
    "index": "B",
    "title": "Array",
    "rating": 1100,
    "url": "https://codeforces.com/problemset/problem/2209/B",
    "tags": [
      "greedy"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+2209B+Array+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n\tint tt;\n\tcin >> tt; \n\twhile (tt--) {\n\t\tint n;\n\t\tcin >> n;\n\t\tvector<int> v(n); \n\t\tfor (int i = 0; i < n; i++) {\n\t\t\tcin >> v[i]; \n\t\t}\n\n\t\tint ans = 0; \n\t\tint i = n - 1;\n\t\twhile (i >= 0 && v[i] == v[n - 1]) {\n\t\t\ti--;\n\t\t}\n\t\tif (i == -1) {\n\t\t\tcout << 0 << endl;\n\t\t\tcontinue;\n\t\t}\n\t\twhile (i >= 0) {\n\t\t\ti -= (n - 1 - i);\n\t\t\tans++;\n\t\t\twhile (i >= 0 && v[i] == v[n - 1]) {\n\t\t\t\ti--;\n\t\t\t}\n\t\t}\n\n\t\tcout << ans << \"\\n\";\n\t}\n}"
    },
    "order": 28
  },
  {
    "id": "1618C",
    "contestId": 1618,
    "index": "C",
    "title": "Paint the Array",
    "rating": 1100,
    "url": "https://codeforces.com/problemset/problem/1618/C",
    "tags": [
      "math"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1618C+Paint%20the%20Array+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n#define ll long long\n\nint main() {\n    int tt;\n    cin >> tt;\n    while(tt--) { \n        int n;\n        cin >> n; \n        vector<ll> v(n);\n        for (int i = 0; i < n; i++) { \n            cin >> v[i];\n        }\n        ll gcd1 = 0, gcd2 = 0; \n        for (int i = 0; i < n; i++) { \n            if (i & 1) {\n                gcd2 = __gcd(gcd2, v[i]); \n            } else {\n                gcd1 = __gcd(gcd1, v[i]);\n            }\n        }\n        bool flag = true;\n        for (int i = 1; i < n; i += 2) {\n            if (v[i] % gcd1 == 0) { \n                flag = false;\n                break;\n            }\n        }\n        if (flag) {\n            cout << gcd1 << endl; \n            continue;\n        }\n        flag = true;\n        for (int i = 0; i < n; i += 2) {\n            if (v[i] % gcd2 == 0) {\n                flag = false;\n                break;\n            }\n        }\n        if (flag) {\n            cout << gcd2 << endl;\n        } else {\n            cout << 0 << endl;\n        }\n    }\n    return 0;\n}"
    },
    "order": 29
  },
  {
    "id": "1610B",
    "contestId": 1610,
    "index": "B",
    "title": "Kalindrome Array",
    "rating": 1100,
    "url": "https://codeforces.com/problemset/problem/1610/B",
    "tags": [
      "greedy",
      "two pointers"
    ],
    "hint": "Notice that as the right pointer expands, the left pointer only needs to move forward. Maintain frequency counts or window invariants to keep the window valid in O(N) overall.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1610B+Kalindrome%20Array+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\n#define ll long long\n\n\nbool check(vector<ll>& a, int x) {\n\tint n = a.size();\n\tvector<ll> b;\n\n    for (int i = 0; i < n; i++) {\n\t\tif (a[i] != x) {\n\t\t\tb.push_back(a[i]);\n\t\t}\n\t}\n\tint m = b.size();\n\n    for (int i = 0; i < m; i++) {\n\t\tif (b[i] != b[m - i - 1]) {\n\t\t\treturn false; \n            \n\t\t}\n\t}\n\treturn true;\n    \n}\n\n\nvoid solve() {\n\tll n;\n\tcin >> n;\n\tvector<ll> a(n);\n\n    for (int i = 0; i < n; i++) {\n\t\tcin >> a[i];\n\t}\n\n    for (int i = 0; i < n / 2; i++) {\n\t\tif (a[i] != a[n - i - 1]) {\n            if (check(a, a[i]) || check(a, a[n - i - 1])) {\n\t\t\t\tcout << \"YES\" << endl;\n\t\t\t} else {\n\t\t\t\tcout << \"NO\" << endl;\n\t\t\t}\n\t\t\treturn;\n\t\t}\n\t}\n\tcout << \"YES\" << endl; \n}\n\nint main() {\n\tint tt = 1;\n\tcin >> tt;\n\n    while (tt--) {\n\t\tsolve();\n\t}\n}"
    },
    "order": 30
  },
  {
    "id": "1511C",
    "contestId": 1511,
    "index": "C",
    "title": "Yet Another Card Deck",
    "rating": 1100,
    "url": "https://codeforces.com/problemset/problem/1511/C",
    "tags": [
      "brute force",
      "data structures",
      "implementation",
      "trees"
    ],
    "hint": "Speed up operations from O(N) to O(log N) using appropriate containers like std::set, std::map, or a Fenwick/Segment Tree for dynamic range queries and updates.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1511C+Yet%20Another%20Card%20Deck+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n\tint n, q;\n\tcin >> n >> q;\n\n\tvector<int> first_pos(51, n + 1);\n\n\tfor (int i = 1; i <= n; i++) { \n\t\tint color;\n\t\tcin >> color;\n\t\tif (first_pos[color] == n + 1) {\n\t\t\tfirst_pos[color] = i;\n\t\t}\n\t}\n\n\twhile (q--) { \n        int color;\n\t\tcin >> color;\n\t\tint ans = first_pos[color];\n\n\t\tfor (int i = 1; i <= 50; i++) {\n\t\t\tif (first_pos[i] < ans) {\n\t\t\t\tfirst_pos[i]++;\n\t\t\t}\n\t\t}\n\n\t\tfirst_pos[color] = 1;\n\n\t\tcout << ans << \" \";\n\t}\n\n\tcout << endl;\n}"
    },
    "order": 31
  },
  {
    "id": "1914C",
    "contestId": 1914,
    "index": "C",
    "title": "Quests",
    "rating": 1100,
    "url": "https://codeforces.com/problemset/problem/1914/C",
    "tags": [
      "greedy",
      "math"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1914C+Quests+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 32
  },
  {
    "id": "1676E",
    "contestId": 1676,
    "index": "E",
    "title": "Eating Queries",
    "rating": 1100,
    "url": "https://codeforces.com/problemset/problem/1676/E",
    "tags": [
      "binary search",
      "greedy",
      "sortings"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1676E+Eating%20Queries+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nbool check(long long mid, const vector<long long>& a, int n, long long k) {\n    long long count = 0;\n    for (int i = 0; i < n; i++) {\n        count += mid / a[i];\n    }\n    return count >= k;\n}\n\nvoid solve() {\n    int n;\n    long long k;\n    if (!(cin >> n >> k)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    long long low = 1, high = 1e18, ans = high;\n    while (low <= high) {\n        long long mid = low + (high - low) / 2;\n        if (check(mid, a, n, k)) {\n            ans = mid;\n            high = mid - 1;\n        } else {\n            low = mid + 1;\n        }\n    }\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 33
  },
  {
    "id": "2009C",
    "contestId": 2009,
    "index": "C",
    "title": "The Legend of Freya the Frog",
    "rating": 1100,
    "url": "https://codeforces.com/problemset/problem/2009/C",
    "tags": [
      "implementation",
      "math"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+2009C+The%20Legend%20of%20Freya%20the%20Frog+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 34
  },
  {
    "id": "1999D",
    "contestId": 1999,
    "index": "D",
    "title": "Slavic's Exam",
    "rating": 1100,
    "url": "https://codeforces.com/problemset/problem/1999/D",
    "tags": [
      "greedy",
      "implementation",
      "strings"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1999D+Slavic's%20Exam+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 35
  },
  {
    "id": "1891B",
    "contestId": 1891,
    "index": "B",
    "title": "Deja Vu",
    "rating": 1100,
    "url": "https://codeforces.com/problemset/problem/1891/B",
    "tags": [
      "brute force",
      "math",
      "sortings"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1891B+Deja%20Vu+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 36
  },
  {
    "id": "1971D",
    "contestId": 1971,
    "index": "D",
    "title": "Binary Cut",
    "rating": 1100,
    "url": "https://codeforces.com/problemset/problem/1971/D",
    "tags": [
      "dp",
      "greedy",
      "implementation",
      "sortings",
      "strings"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1971D+Binary%20Cut+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    vector<long long> dp(n + 1, 0);\n    for (int i = 0; i < n; i++) {\n        dp[i + 1] = max(dp[i], dp[i] + a[i]);\n    }\n    cout << dp[n] << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 37
  },
  {
    "id": "1703D",
    "contestId": 1703,
    "index": "D",
    "title": "Double Strings",
    "rating": 1100,
    "url": "https://codeforces.com/problemset/problem/1703/D",
    "tags": [
      "brute force",
      "data structures",
      "strings"
    ],
    "hint": "Speed up operations from O(N) to O(log N) using appropriate containers like std::set, std::map, or a Fenwick/Segment Tree for dynamic range queries and updates.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1703D+Double%20Strings+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 38
  },
  {
    "id": "1631B",
    "contestId": 1631,
    "index": "B",
    "title": "Fun with Even Subarrays",
    "rating": 1100,
    "url": "https://codeforces.com/problemset/problem/1631/B",
    "tags": [
      "dp",
      "greedy"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1631B+Fun%20with%20Even%20Subarrays+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    vector<long long> dp(n + 1, 0);\n    for (int i = 0; i < n; i++) {\n        dp[i + 1] = max(dp[i], dp[i] + a[i]);\n    }\n    cout << dp[n] << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 39
  },
  {
    "id": "2065C1",
    "contestId": 2065,
    "index": "C1",
    "title": "Skibidus and Fanum Tax (easy version)",
    "rating": 1100,
    "url": "https://codeforces.com/problemset/problem/2065/C1",
    "tags": [
      "binary search",
      "dp",
      "greedy"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+2065C1+Skibidus%20and%20Fanum%20Tax%20(easy%20version)+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    vector<long long> dp(n + 1, 0);\n    for (int i = 0; i < n; i++) {\n        dp[i + 1] = max(dp[i], dp[i] + a[i]);\n    }\n    cout << dp[n] << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 40
  },
  {
    "id": "2014C",
    "contestId": 2014,
    "index": "C",
    "title": "Robin Hood in Town",
    "rating": 1100,
    "url": "https://codeforces.com/problemset/problem/2014/C",
    "tags": [
      "binary search",
      "greedy",
      "math"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+2014C+Robin%20Hood%20in%20Town+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nbool check(long long mid, const vector<long long>& a, int n, long long k) {\n    long long count = 0;\n    for (int i = 0; i < n; i++) {\n        count += mid / a[i];\n    }\n    return count >= k;\n}\n\nvoid solve() {\n    int n;\n    long long k;\n    if (!(cin >> n >> k)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    long long low = 1, high = 1e18, ans = high;\n    while (low <= high) {\n        long long mid = low + (high - low) / 2;\n        if (check(mid, a, n, k)) {\n            ans = mid;\n            high = mid - 1;\n        } else {\n            low = mid + 1;\n        }\n    }\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 41
  },
  {
    "id": "1829E",
    "contestId": 1829,
    "index": "E",
    "title": "The Lakes",
    "rating": 1100,
    "url": "https://codeforces.com/problemset/problem/1829/E",
    "tags": [
      "dfs and similar",
      "dsu",
      "graphs",
      "implementation"
    ],
    "hint": "Represent the input as an adjacency list. Use BFS/DFS traversal to discover reachable components, compute shortest hops in unweighted graphs, or detect bipartite coloring.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1829E+The%20Lakes+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 42
  },
  {
    "id": "1800C2",
    "contestId": 1800,
    "index": "C2",
    "title": "Powering the Hero (hard version)",
    "rating": 1100,
    "url": "https://codeforces.com/problemset/problem/1800/C2",
    "tags": [
      "data structures",
      "greedy"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1800C2+Powering%20the%20Hero%20(hard%20version)+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 43
  },
  {
    "id": "2050B",
    "contestId": 2050,
    "index": "B",
    "title": "Transfusion",
    "rating": 1100,
    "url": "https://codeforces.com/problemset/problem/2050/B",
    "tags": [
      "brute force",
      "greedy",
      "math"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+2050B+Transfusion+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 44
  },
  {
    "id": "2004C",
    "contestId": 2004,
    "index": "C",
    "title": "Splitting Items",
    "rating": 1100,
    "url": "https://codeforces.com/problemset/problem/2004/C",
    "tags": [
      "games",
      "greedy",
      "sortings"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+2004C+Splitting%20Items+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 45
  },
  {
    "id": "1624C",
    "contestId": 1624,
    "index": "C",
    "title": "Division by Two and Permutation",
    "rating": 1100,
    "url": "https://codeforces.com/problemset/problem/1624/C",
    "tags": [
      "constructive algorithms",
      "flows",
      "graph matchings",
      "greedy",
      "math"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1624C+Division%20by%20Two%20and%20Permutation+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 46
  },
  {
    "id": "2126C",
    "contestId": 2126,
    "index": "C",
    "title": "I Will Definitely Make It",
    "rating": 1100,
    "url": "https://codeforces.com/problemset/problem/2126/C",
    "tags": [
      "greedy",
      "sortings"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+2126C+I%20Will%20Definitely%20Make%20It+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 47
  },
  {
    "id": "1722D",
    "contestId": 1722,
    "index": "D",
    "title": "Line",
    "rating": 1100,
    "url": "https://codeforces.com/problemset/problem/1722/D",
    "tags": [
      "greedy",
      "sortings"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1722D+Line+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 48
  },
  {
    "id": "1993B",
    "contestId": 1993,
    "index": "B",
    "title": "Parity and Sum",
    "rating": 1100,
    "url": "https://codeforces.com/problemset/problem/1993/B",
    "tags": [
      "constructive algorithms",
      "greedy"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1993B+Parity%20and%20Sum+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 49
  },
  {
    "id": "1872C",
    "contestId": 1872,
    "index": "C",
    "title": "Non-coprime Split",
    "rating": 1100,
    "url": "https://codeforces.com/problemset/problem/1872/C",
    "tags": [
      "math",
      "number theory"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1872C+Non-coprime%20Split+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 50
  },
  {
    "id": "1914D",
    "contestId": 1914,
    "index": "D",
    "title": "Three Activities",
    "rating": 1200,
    "url": "https://codeforces.com/problemset/problem/1914/D",
    "tags": [
      "brute force",
      "dp",
      "greedy",
      "implementation",
      "sortings"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1914D+Three%20Activities+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nvector<int> findMax3(vector<int> &arr) {\n\n\tvector<pair<int, int>> tmp(arr.size());\n\n\tfor (int i = 0; i < tmp.size(); i++) {\n\t\ttmp[i].first = arr[i];\n\t\ttmp[i].second = i;\n\t}\n\n\tsort(tmp.rbegin(), tmp.rend());\n\n\tvector<int> ans(3);\n\n\tfor (int i = 0; i < 3; i++)\n\t\tans[i] = tmp[i].second;\n\n\treturn ans;\n}\n\nint main() {\n\tint tt;\n\tcin >> tt; \n\twhile (tt--) {\n\t\tint n;\n\t\tcin >> n;\n\t\tvector<int> a(n), b(n), c(n);\n\n\t\tfor (int i = 0; i < n; i++)\n\t\t\tcin >> a[i];\n\t\tfor (int i = 0; i < n; i++)\n\t\t\tcin >> b[i]; \n\t\tfor (int i = 0; i < n; i++)\n\t\t\tcin >> c[i]; \n\n\t\tvector<int> maxa = findMax3(a); \n\t\tvector<int> maxb = findMax3(b);\n\t\tvector<int> maxc = findMax3(c);\n\n\t\tint ans = 0;\n\t\tfor (int i = 0; i < 3; i++) {\n\t\t\tfor (int j = 0; j < 3; j++) {\n\t\t\t\tfor (int k = 0; k < 3; k++) {\n\t\t\t\t\tint x = maxa[i], y = maxb[j], z = maxc[k];\n\t\t\t\t\tif ((x == y) or (y == z) or (z == x))\n\t\t\t\t\t\tcontinue;\n\t\t\t\t\tans = max(ans, a[x] + b[y] + c[z]); // O(1)\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\n\t\tcout << ans << endl; \n\t}\n}"
    },
    "order": 1
  },
  {
    "id": "1742E",
    "contestId": 1742,
    "index": "E",
    "title": "Scuza",
    "rating": 1200,
    "url": "https://codeforces.com/problemset/problem/1742/E",
    "tags": [
      "binary search",
      "greedy",
      "math"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1742E+Scuza+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\nint binSearch(vector<long long> &pmax, int n, int val)\n{\n\tint low = 0, high = n - 1;\n\tint ans = -1;\n\twhile (low <= high)\n\t{\n\t\tint mid = (low + high) / 2;\n\t\tif (pmax[mid] <= val)\n\t\t{\n\t\t\tans = mid; \n\t\t\tlow = mid + 1;\n\t\t}\n\t\telse\n\t\t{\n\t\t\thigh = mid - 1; \n\t\t}\n\t}\n\n\treturn ans; \n} \n\nint main()\n{\n\tint tt; \n\tcin >> tt;\n\n\twhile (tt--)\n\t{\n\t\tint n, q; \n\t\tcin >> n >> q;\n\n\t\tvector<long long> steps(n), query(q); \n\t\tfor (int i = 0; i < n; i++)\n\t\t\tcin >> steps[i]; \n\t\tfor (int i = 0; i < q; i++)\n\t\t\tcin >> query[i];\n\n\t\tvector<long long> pmax(n), psum(n); \n\t\tpmax[0] = steps[0];\n\t\tpsum[0] = steps[0]; \n\t\tfor (int i = 1; i < n; i++)\n\t\t{\n\t\t\tpmax[i] = max(pmax[i - 1], steps[i]); \n\t\t\tpsum[i] = psum[i - 1] + steps[i]; \n\t\t} \n\t\tfor (int i = 0; i < q; i++)\n\t\t{\n\t\t\tint val = query[i]; \n\t\t\tint ind = binSearch(pmax, n, val);\n\t\t\tif (ind == -1)\n\t\t\t{\n\t\t\t\tcout << \"0 \";\n\t\t\t}\n\t\t\telse\n\t\t\t{\n\t\t\t\tcout << psum[ind] << \" \"; \n\t\t\t}\n\t\t} \n\n\t\tcout << \"\\n\"; \n\t}\n\n\treturn 0;\n}"
    },
    "order": 2
  },
  {
    "id": "1734C",
    "contestId": 1734,
    "index": "C",
    "title": "Removing Smallest Multiples",
    "rating": 1200,
    "url": "https://codeforces.com/problemset/problem/1734/C",
    "tags": [
      "greedy",
      "math"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1734C+Removing%20Smallest%20Multiples+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nint main()\n{\n\tint tt;\n\tcin >> tt;\n\n\twhile (tt--)\n\t{\n\t\tint n;\n\t\tcin >> n; \n\n\t\tstring s;\n\t\tcin >> s;\n\n\t\tlong long ans = 0;\n\n\t\tvector<bool> isRemoved(n + 1, false);\n\n\t\tfor (int i = 1; i <= n; i++)\n\t\t{\n\t\t\tfor (int j = i; j <= n; j += i)\n\t\t\t{\n\t\t\t\tif (s[j - 1] == '1')\n\t\t\t\t\tbreak;\n\t\t\t\tif (isRemoved[j])\n\t\t\t\t\tcontinue;\n\t\t\t\telse\n\t\t\t\t{\n\t\t\t\t\tisRemoved[j] = true;\n\t\t\t\t\tans += i;\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\n\t\tcout << ans << \"\\n\"; \n\t}\n\n\treturn 0;\n}"
    },
    "order": 3
  },
  {
    "id": "1729D",
    "contestId": 1729,
    "index": "D",
    "title": "Friends and the Restaurant",
    "rating": 1200,
    "url": "https://codeforces.com/problemset/problem/1729/D",
    "tags": [
      "greedy",
      "sortings",
      "two pointers"
    ],
    "hint": "Notice that as the right pointer expands, the left pointer only needs to move forward. Maintain frequency counts or window invariants to keep the window valid in O(N) overall.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1729D+Friends%20and%20the%20Restaurant+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nint main()\n{\n\tint tt;\n\tcin >> tt; \n\n\twhile (tt--)\n\t{\n\t\tint n;\n\t\tcin >> n;\n\n\t\tvector<int> x(n), y(n); \n\t\tfor (int i = 0; i < n; i++)\n\t\t\tcin >> x[i]; \n\n\t\tfor (int i = 0; i < n; i++)\n\t\t\tcin >> y[i];\n\n\t\tmultiset<int> ms;\n\n\t\tfor (int i = 0; i < n; i++)\n\t\t\tms.insert(y[i] - x[i]); \n\n\t\tint ans = 0;\n\n\t\twhile (ms.size() > 1)\n\t\t{\n\t\t\tint val1 = *ms.begin();\n\t\t\tms.erase(ms.begin());\n\n\t\t\tauto it = ms.lower_bound(-val1); \n\n\t\t\tif (it == ms.end())\n\t\t\t\tcontinue; \n\t\t\tans++;\n\t\t\tms.erase(it);\n\t\t}\n\n\t\tcout << ans << \"\\n\"; \n\t}\n\n\treturn 0;\n}"
    },
    "order": 4
  },
  {
    "id": "1423H",
    "contestId": 1423,
    "index": "H",
    "title": "Virus",
    "rating": 1200,
    "url": "https://codeforces.com/problemset/problem/1423/H",
    "tags": [
      "data structures",
      "divide and conquer",
      "dsu",
      "graphs"
    ],
    "hint": "Represent the input as an adjacency list. Use BFS/DFS traversal to discover reachable components, compute shortest hops in unweighted graphs, or detect bipartite coloring.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1423H+Virus+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nint main() {\n\tint tt;\n\tcin >> tt;\n\n\twhile (tt--) {\n\t\tint n, m;\n\t\tcin >> n >> m; \n\t\tvector<int> v(m);\n\t\tfor (int i = 0; i < m; i++)\n\t\t\tcin >> v[i];\n\n\t\tsort(v.begin(), v.end());\n\n\t\tvector<int> gaps;\n\t\tfor (int i = 0; i < m - 1; i++) {\n\t\t\tgaps.push_back(v[i + 1] - v[i] - 1); \n\t\t}\n\n\t\tgaps.push_back(v[0] + n - v[m - 1] - 1); \n\n\t\tsort(gaps.rbegin(), gaps.rend());\n\n\t\tint numSaved = 0, numDays = 0; \n\n\t\tfor (auto gap : gaps) {\n\t\t\tint currGap = gap - numDays * 2; \n\t\t\tif (currGap > 0) {\n\t\t\t\tnumSaved++;\n\n\t\t\t\tcurrGap -= 2; \n\t\t\t\tif (currGap > 0)\n\t\t\t\t\tnumSaved += currGap;\n\n\t\t\t\tnumDays += 2; \n\t\t\t}\n\t\t}\n\n\t\tcout << (n - numSaved) << \"\\n\"; \n\t}\n\n\treturn 0;\n}"
    },
    "order": 5
  },
  {
    "id": "1703E",
    "contestId": 1703,
    "index": "E",
    "title": "Mirror Grid",
    "rating": 1200,
    "url": "https://codeforces.com/problemset/problem/1703/E",
    "tags": [
      "implementation"
    ],
    "hint": "Test small examples by hand, identify invariants preserved under the problem operations, and consider extreme corner cases (e.g. n=1, all equal elements).",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1703E+Mirror%20Grid+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nint main()\n{\n\tint tt;\n\tcin >> tt; \n\twhile (tt--)\n\t{\n\t\tint n;\n\t\tcin >> n; \n\t\tvector<vector<char>> mat(n, vector<char>(n));\n\n\n\t\tfor (int i = 0; i < n; i++)\n\t\t{\n\t\t\tfor (int j = 0; j < n; j++)\n\t\t\t\tcin >> mat[i][j];\n\t\t} \n\n\t\tint ans = 0; \n\t\tfor (int i = 0; i < n; i++)\n\t\t{\n\t\t\tfor (int j = 0; j < n; j++)\n\t\t\t{\n\t\t\t\tint c0 = 0, c1 = 0; \n\n\t\t\t\tif (mat[i][j] == '0')\n\t\t\t\t\tc0++;\n\t\t\t\telse\n\t\t\t\t\tc1++;\n\n\t\t\t\tif (mat[j][n - i - 1] == '0')\n\t\t\t\t\tc0++;\n\t\t\t\telse\n\t\t\t\t\tc1++;\n\n\t\t\t\tif (mat[n - i - 1][n - j - 1] == '0')\n\t\t\t\t\tc0++;\n\t\t\t\telse\n\t\t\t\t\tc1++;\n\n\t\t\t\tif (mat[n - j - 1][i] == '0')\n\t\t\t\t\tc0++;\n\t\t\t\telse\n\t\t\t\t\tc1++;\n\n\t\t\t\n\n\t\t\t\tif ((c0 == 0) or (c1 == 0))\n\t\t\t\t\tcontinue;\n\n\t\t\t\tif (c0 >= c1)\n\t\t\t\t{\n\t\t\t\t\tans += c1;\n\t\t\t\t\tmat[i][j] = '0';\n\t\t\t\t\tmat[j][n - i - 1] = '0';\n\t\t\t\t\tmat[n - i - 1][n - j - 1] = '0';\n\t\t\t\t\tmat[n - j - 1][i] = '0';\n\t\t\t\t}\n\t\t\t\telse\n\t\t\t\t{\n\t\t\t\t\tans += c0;\n\t\t\t\t\tmat[i][j] = '1';\n\t\t\t\t\tmat[j][n - i - 1] = '1';\n\t\t\t\t\tmat[n - i - 1][n - j - 1] = '1';\n\t\t\t\t\tmat[n - j - 1][i] = '1';\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\n\t\tcout << ans << \"\\n\";\n\t}\n\n\treturn 0;\n}"
    },
    "order": 6
  },
  {
    "id": "1692E",
    "contestId": 1692,
    "index": "E",
    "title": "Binary Deque",
    "rating": 1200,
    "url": "https://codeforces.com/problemset/problem/1692/E",
    "tags": [
      "binary search",
      "implementation",
      "two pointers"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1692E+Binary%20Deque+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nint main()\n{\n\tint tt;\n\tcin >> tt;\n\n\twhile (tt--)\n\t{\n\t\tint n, s;\n\t\tcin >> n >> s; \n\n\t\tvector<int> v(n);\n\n\t\tfor (int i = 0; i < n; i++)\n\t\t\tcin >> v[i]; //? O(N)\n\n\t\tint len = -1; \n\n\t\tmap<int, int> mp;\n\n\t\tmp[0] = -1; \n\n\t\tint sum = 0; \n\t\tfor (int i = 0; i < n; i++)\n\t\t{\n\t\t\tsum += v[i]; \n\t\t\tif (mp.count(sum - s))\n\t\t\t{\n\t\t\t\tlen = max(len, i - mp[sum - s]);\n\t\t\t}\n\n\t\t\t\n\t\t\tif (!mp.count(sum))\n\t\t\t{\n\t\t\t\tmp[sum] = i; \n\t\t\t}\n\t\t} \n\t\tif (len == -1)\n\t\t{\n\t\t\tcout << \"-1\\n\";\n\t\t}\n\t\telse\n\t\t{\n\t\t\t\n\t\t\tcout << (n - len) << \"\\n\";\n\t\t}\n\t}\n}"
    },
    "order": 7
  },
  {
    "id": "1679B",
    "contestId": 1679,
    "index": "B",
    "title": "Stone Age Problem",
    "rating": 1200,
    "url": "https://codeforces.com/problemset/problem/1679/B",
    "tags": [
      "data structures",
      "implementation"
    ],
    "hint": "Speed up operations from O(N) to O(log N) using appropriate containers like std::set, std::map, or a Fenwick/Segment Tree for dynamic range queries and updates.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1679B+Stone%20Age%20Problem+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nint main()\n{\n\tint n, q;\n\n\tcin >> n >> q;\n\n\tvector<pair<int, int>> v(n, {0, 0});\n\n\tfor (int i = 0; i < n; i++)\n\t{\n\t\tcin >> v[i].first;\n\t} \n\n\tpair<int, int> globalVal = {0, -1};\n\n\tlong long sum = 0;\n\tfor (int i = 0; i < n; i++) \n\t\tsum += v[i].first;\n\n\n\tfor (int it = 1; it <= q; it++)\n\t{\n\t\tint x;\n\t\tcin >> x;\n\n\t\tif (x == 1)\n\t\t{\n\t\t\tint ind, val;\n\t\t\tcin >> ind >> val;\n\n\t\t\tind--;\n\n\t\t\tif (v[ind].second > globalVal.second)\n\t\t\t{\n\t\t\t\tsum += (val - v[ind].first);\n\t\t\t}\n\t\t\telse\n\t\t\t{\n\t\t\t\tsum += (val - globalVal.first);\n\t\t\t}\n\n\t\t\tv[ind].first = val;\n\t\t\tv[ind].second = it;\n\t\t}\n\t\telse\n\t\t{\n\t\t\tint val;\n\t\t\tcin >> val;\n\n\t\t\tglobalVal.first = val;\n\t\t\tglobalVal.second = it;\n\n\t\t\tsum = (long long)(val) * n;\n\t\t}\n\n\t\tcout << sum << \"\\n\";\n\t}\n\n\treturn 0;\n}"
    },
    "order": 8
  },
  {
    "id": "1671C",
    "contestId": 1671,
    "index": "C",
    "title": "Dolce Vita",
    "rating": 1200,
    "url": "https://codeforces.com/problemset/problem/1671/C",
    "tags": [
      "binary search",
      "brute force",
      "greedy",
      "math"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1671C+Dolce%20Vita+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nbool pf(long long val, int ind, int x, int mid)\n{\n\tif (val + (1LL * (ind + 1) * (mid - 1)) <= x)\n\t\treturn true;\n\treturn false;\n}\n\nint binSearch(long long val, int ind, int x)\n{\n\tint low = 1, high = 1e9 + 5;\n\tint ans = 0;\n\n\twhile (low <= high)\n\t{\n\t\tint mid = (low + high) / 2;\n\t\tif (pf(val, ind, x, mid))\n\t\t{\n\t\t\tans = mid;\n\t\t\tlow = mid + 1;\n\t\t}\n\t\telse\n\t\t{\n\t\t\thigh = mid - 1;\n\t\t}\n\t} \n\n\treturn ans;\n} \n\nint main()\n{\n\tint tt;\n\tcin >> tt;\n\n\twhile (tt--)\n\t{\n\t\tint n, x;\n\t\tcin >> n >> x;\n\n\t\tvector<int> cost(n);\n\t\tfor (int i = 0; i < n; i++)\n\t\t\tcin >> cost[i];\n\n\t\tsort(cost.begin(), cost.end());\n\n\t\tvector<long long> presum(n);\n\n\t\tpresum[0] = cost[0];\n\t\tfor (int i = 1; i < n; i++)\n\t\t{\n\t\t\tpresum[i] = presum[i - 1] + cost[i];\n\t\t} \n\n\t\tlong long ans = 0;\n\t\tfor (int i = 0; i < n; i++)\n\t\t{\n\t\t\tans += binSearch(presum[i], i, x);\n\t\t} \n\n\t\tcout << ans << \"\\n\";\n\t}\n\n\treturn 0;\n}"
    },
    "order": 9
  },
  {
    "id": "1635C",
    "contestId": 1635,
    "index": "C",
    "title": "Differential Sorting",
    "rating": 1200,
    "url": "https://codeforces.com/problemset/problem/1635/C",
    "tags": [
      "constructive algorithms",
      "greedy"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1635C+Differential%20Sorting+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nint main()\n{\n\tint tt;\n\tcin >> tt;\n\n\twhile (tt--)\n\t{\n\t\tint n;\n\t\tcin >> n; \n\n\t\tvector<int> v(n);\n\t\tfor (int i = 0; i < n; i++)\n\t\t\tcin >> v[i];\n\t\tif (v[n - 2] > v[n - 1])\n\t\t{\n\t\t\tcout << \"-1\\n\";\n\t\t\tcontinue;\n\t\t}\n\t\telse if (v[n - 1] >= 0)\n\t\t{\n\t\t\tcout << n - 2 << \"\\n\";\n\t\t\tfor (int i = 1; i <= n - 2; i++)\n\t\t\t{\n\t\t\t\tcout << i << \" \" << n - 1 << \" \" << n << \"\\n\";\n\t\t\t}\n\t\t}\n\t\telse\n\t\t{\n\t\t\tif (is_sorted(v.begin(), v.end()))\n\t\t\t\tcout << \"0\\n\";\n\t\t\telse\n\t\t\t\tcout << \"-1\\n\";\n\t\t}\n\t}\n\n\treturn 0;\n}"
    },
    "order": 10
  },
  {
    "id": "1154B",
    "contestId": 1154,
    "index": "B",
    "title": "Make Them Equal",
    "rating": 1200,
    "url": "https://codeforces.com/problemset/problem/1154/B",
    "tags": [
      "math"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1154B+Make%20Them%20Equal+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nint main()\n{\n\tint tt;\n\tcin >> tt;\n\n\twhile (tt--)\n\t{\n\t\tint n;\n\t\tchar c;\n\t\tcin >> n >> c; \n\n\t\tstring s;\n\t\tcin >> s; \n\n\t\n\t\tbool check0 = true;\n\n\t\tfor (int i = 0; i < n; i++)\n\t\t{\n\t\t\tif (s[i] != c)\n\t\t\t{\n\t\t\t\tcheck0 = false; \n\t\t\t\tbreak;\n\t\t\t}\n\t\t} //? O(n)\n\n\t\tif (check0)\n\t\t{\n\t\t\tcout << \"0\\n\";\n\t\t\tcontinue;\n\t\t}\n\n\t\tint val1 = -1;\n\t\tfor (long long i = 2; i <= n; i++)\n\t\t{\n\t\t\tbool isPoss = true;\n\t\t\tfor (long long j = i; j <= n; j += i)\n\t\t\t{\n\t\t\t\tif (s[j - 1] != c)\n\t\t\t\t{\n\t\t\t\t\tisPoss = false; \n\t\t\t\t\tbreak;\n\t\t\t\t}\n\t\t\t}\n\n\t\t\tif (isPoss)\n\t\t\t{\n\t\t\t\tval1 = i; \n\t\t\t\tbreak;\n\t\t\t}\n\t\t} //? O(n log n)\n\n\t\tif (val1 != -1)\n\t\t{\n\t\t\tcout << \"1\\n\";\n\t\t\tcout << val1 << \"\\n\";\n\t\t\tcontinue;\n\t\t}\n\t\tcout << \"2\\n\";\n\t\tcout << n - 1 << \" \" << n << \"\\n\"; \n\t}\n\n\treturn 0;\n}"
    },
    "order": 11
  },
  {
    "id": "1909B",
    "contestId": 1909,
    "index": "B",
    "title": "Make Almost Equal With Mod",
    "rating": 1200,
    "url": "https://codeforces.com/problemset/problem/1909/B",
    "tags": [
      "bitmasks",
      "constructive algorithms",
      "math",
      "number theory"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1909B+Make%20Almost%20Equal%20With%20Mod+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nint main() {\n\tint tt;\n\tcin >> tt;\n\n\twhile (tt--) { \n\t\tint n;\n\t\tcin >> n;\n\n\t\tlong long arr[n];\n\n\t\tfor (int i = 0; i < n; i++)\n\t\t\tcin >> arr[i]; \n\n\t\tlong long ans = 0;\n\n\n        for (int i = 1; i <= 60; i++) { \n            \n\n\n            set<long long> distinctVals;\n\t\t\tlong long k = 1LL << i;\n            \n\n\t\t\tfor (int ind = 0; ind < n; ind++) {\n\t\t\t\tdistinctVals.insert(arr[ind] % k);\n\t\t\t}\n\n\t\t\tif (distinctVals.size() == 2) {\n\t\t\t\tans = k;\n\t\t\t\tbreak;\n\t\t\t}\n\t\t} \n\n\t\tcout << ans << \"\\n\";\n\t}\n}"
    },
    "order": 12
  },
  {
    "id": "1582C",
    "contestId": 1582,
    "index": "C",
    "title": "Grandma Capa Knits a Scarf",
    "rating": 1200,
    "url": "https://codeforces.com/problemset/problem/1582/C",
    "tags": [
      "brute force",
      "data structures",
      "greedy",
      "strings",
      "two pointers"
    ],
    "hint": "Notice that as the right pointer expands, the left pointer only needs to move forward. Maintain frequency counts or window invariants to keep the window valid in O(N) overall.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1582C+Grandma%20Capa%20Knits%20a%20Scarf+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nint main()\n{\n\tint tt;\n\tcin >> tt; \n\n\twhile (tt--)\n\t{\n\t\tint n;\n\t\tcin >> n;\n\n\t\tstring s;\n\t\tcin >> s;\n\n\t\tint ans = INT_MAX;\n\n\t\tfor (char c = 'a'; c <= 'z'; c++)\n\t\t{\n\t\t\tint tmp = 0;\n\t\t\tbool isPoss = true; \n\n\t\t\tint i = 0, j = n - 1; \n\n\t\t\twhile (i < j)\n\t\t\t{\n\t\t\t\tif (s[i] == s[j])\n\t\t\t\t{\n\t\t\t\t\ti++; \n\t\t\t\t\tj--;\n\t\t\t\t\tcontinue;\n\t\t\t\t}\n\n\t\t\t\tif (s[i] == c)\n\t\t\t\t{\n\t\t\t\t\ttmp++;\n\t\t\t\t\ti++; \n\t\t\t\t}\n\t\t\t\telse if (s[j] == c)\n\t\t\t\t{\n\t\t\t\t\ttmp++;\n\t\t\t\t\tj--;\n\t\t\t\t}\n\t\t\t\telse\n\t\t\t\t{\n\t\t\t\t\tisPoss = false;\n\t\t\t\t\tbreak;\n\t\t\t\t}\n\t\t\t} //? O(N)\n\n\t\t\tif (!isPoss)\n\t\t\t\ttmp = INT_MAX;\n\n\t\t\tans = min(ans, tmp);\n\t\t}\n\n\t\tif (ans == INT_MAX)\n\t\t\tans = -1;\n\n\t\tcout << ans << \"\\n\";\n\t}\n\n\treturn 0;\n}"
    },
    "order": 13
  },
  {
    "id": "1541B",
    "contestId": 1541,
    "index": "B",
    "title": "Pleasant Pairs",
    "rating": 1200,
    "url": "https://codeforces.com/problemset/problem/1541/B",
    "tags": [
      "brute force",
      "implementation",
      "math",
      "number theory"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1541B+Pleasant%20Pairs+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nint main()\n{\n\tint tt;\n\tcin >> tt; \n\n\twhile (tt--)\n\t{\n\t\tint n;\n\t\tcin >> n; \n\n\n\t\tvector<pair<long long, long long>> v(n);\n\n\t\tfor (int i = 0; i < n; i++)\n\t\t{\n\t\t\tcin >> v[i].first; \n\t\t\tv[i].second = i + 1;\n\t\t}\n\n\t\tsort(v.begin(), v.end()); \n\n\t\tint ans = 0;\n\n\t\tfor (int i = 0; i < n; i++)\n\t\t{\n\t\t\tfor (int j = i + 1; j < n; j++)\n\t\t\t{\n\t\t\t\tif (v[i].first * v[j].first >= 2 * n)\n\t\t\t\t\tbreak;\n\n\t\t\t\tif (v[i].first * v[j].first == v[i].second + v[j].second)\n\t\t\t\t\tans++;\n\t\t\t}\n\t\t} \n\t\tcout << ans << \"\\n\";\n\t}\n\n\treturn 0;\n}"
    },
    "order": 14
  },
  {
    "id": "1539C",
    "contestId": 1539,
    "index": "C",
    "title": "Stable Groups",
    "rating": 1200,
    "url": "https://codeforces.com/problemset/problem/1539/C",
    "tags": [
      "greedy",
      "sortings"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1539C+Stable%20Groups+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nint main()\n{\n\tlong long n, k, x;\n\tcin >> n >> k >> x;\n\n\tvector<long long> v(n);\n\tfor (int i = 0; i < n; i++)\n\t\tcin >> v[i];\n\n\n\tsort(v.begin(), v.end());\n\n\n\tvector<long long> differences;\n\n\tfor (int i = 0; i < n - 1; i++)\n\t{\n\t\tif (v[i + 1] - v[i] > x)\n\t\t{\n\t\t\tdifferences.push_back(v[i + 1] - v[i]);\n\t\t}\n\t}\n\n\tsort(differences.begin(), differences.end()); \n\tint ans = differences.size() + 1;\n\n\tfor (auto difference : differences)\n\t{\n\t\tlong long val = (difference / x) + (difference % x != 0) - 1; \n\t\tif (k >= val)\n\t\t{\n\t\t\tans--;\n\t\t\tk -= val;\n\t\t}\n\t}\n\tcout << ans << \"\\n\";\n}"
    },
    "order": 15
  },
  {
    "id": "1536B",
    "contestId": 1536,
    "index": "B",
    "title": "Prinzessin der Verurteilung",
    "rating": 1200,
    "url": "https://codeforces.com/problemset/problem/1536/B",
    "tags": [
      "brute force",
      "constructive algorithms",
      "strings"
    ],
    "hint": "Build a pattern step by step. Look at small examples (n=1, 2, 3) to uncover an invariant or periodic pattern that generalizes to any valid input.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1536B+Prinzessin%20der%20Verurteilung+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n\tint tt;\n\tcin >> tt; \n\n\twhile (tt--) {\n\t\tint n;\n\t\tcin >> n; \n\n\t\tstring s;\n\t\tcin >> s;\n\n\t\tstring mex = \"\"; \n\n\t\tfor (char c = 'a'; c <= 'z'; c++) {\n\t\t\tif (s.find(c) == string::npos) { \n\t\t\t\tmex = c;\n\t\t\t\tbreak;\n\t\t\t}\n\t\t}\n\n\t\tfor (char c1 = 'a'; c1 <= 'z'; c1++) {\n\t\t\tfor (char c2 = 'a'; c2 <= 'z'; c2++) {\n\t\t\t\tstring tmp = \"\";\n\t\t\t\ttmp.push_back(c1);\n\t\t\t\ttmp.push_back(c2);\n\n\t\t\t\tif (mex == \"\" && s.find(tmp) == string::npos) {\n\t\t\t\t\tmex = tmp;\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\n\t\tfor (char c1 = 'a'; c1 <= 'z'; c1++) {\n\t\t\tfor (char c2 = 'a'; c2 <= 'z'; c2++) {\n\t\t\t\tfor (char c3 = 'a'; c3 <= 'z'; c3++) {\n\t\t\t\t\tstring tmp = \"\";\n\t\t\t\t\ttmp.push_back(c1);\n\t\t\t\t\ttmp.push_back(c2);\n\t\t\t\t\ttmp.push_back(c3);\n\n\t\t\t\t\tif (mex == \"\" && s.find(tmp) == string::npos) {\n\t\t\t\t\t\tmex = tmp;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\n\t\tcout << mex << \"\\n\"; \n\t}\n\n\treturn 0;\n}"
    },
    "order": 16
  },
  {
    "id": "1527B1",
    "contestId": 1527,
    "index": "B1",
    "title": "Palindrome Game (easy version)",
    "rating": 1200,
    "url": "https://codeforces.com/problemset/problem/1527/B1",
    "tags": [
      "constructive algorithms",
      "games"
    ],
    "hint": "Build a pattern step by step. Look at small examples (n=1, 2, 3) to uncover an invariant or periodic pattern that generalizes to any valid input.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1527B1+Palindrome%20Game%20(easy%20version)+editorial",
    "solutionCode": {
      "cpp": "#include<bits/stdc++.h>\nusing namespace std;\n\n\nvoid solve(){\n\tint n;\n\tcin >> n;\n\tstring s;\n\tcin >> s;\n\tbool is_palindrome=1;\n\tint cnt_0 = 0;\n\tfor(int i=0;i<n;i++){\n\t\tcnt_0 += s[i]=='0';\n\t}\n\tif(cnt_0 == 1){\n\t\tcout << \"BOB\\n\";\n\t\treturn;\n\t}\n\tif(cnt_0%2){\n\t\tcout << \"ALICE\\n\";\n\t\treturn;\n\t}\n\tcout << \"BOB\\n\";\n\treturn;\n}\n\nsigned main()\n{\n\tint tt;\n\tcin >> tt;\n\twhile(tt--){\n\t\tsolve();\n\t}\n    return 0;\n}"
    },
    "order": 17
  },
  {
    "id": "1520D",
    "contestId": 1520,
    "index": "D",
    "title": "Same Differences",
    "rating": 1200,
    "url": "https://codeforces.com/problemset/problem/1520/D",
    "tags": [
      "data structures",
      "hashing",
      "math"
    ],
    "hint": "Speed up operations from O(N) to O(log N) using appropriate containers like std::set, std::map, or a Fenwick/Segment Tree for dynamic range queries and updates.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1520D+Same%20Differences+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nint main()\n{\n\tint tt;\n\tcin >> tt; \n\n\twhile (tt--)\n\t{\n\t\tint n;\n\t\tcin >> n; \n\n\t\tvector<int> v(n); \n\n\t\tfor (int i = 0; i < n; i++)\n\t\t{\n\t\t\tcin >> v[i]; \n\n\t\t\tv[i] -= i;\n\t\t}\n\n\n\t\tmap<long long, long long> freq; \n\n\t\tfor (int i = 0; i < n; i++) \n\t\t\tfreq[v[i]]++; \n\n\t\tlong long ans = 0; \n\n\t\tfor (auto &[val, count] : freq)\n\t\t{\n\t\t\tans += ((count) * (count - 1)) / 2; \n\t\t}\n\n\t\tcout << ans << \"\\n\";\n\t}\n\n\treturn 0;\n}"
    },
    "order": 18
  },
  {
    "id": "1514B",
    "contestId": 1514,
    "index": "B",
    "title": "AND 0, Sum Big",
    "rating": 1200,
    "url": "https://codeforces.com/problemset/problem/1514/B",
    "tags": [
      "bitmasks",
      "combinatorics",
      "math"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1514B+AND%200%2C%20Sum%20Big+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n \nusing namespace std;\n \nint n,k;\nconst int MOD=1e9+7;\n \nint main()\n{\n    int tt;\n    scanf(\"%d\",&tt);\n    while(tt--)\n    {\n        scanf(\"%d %d\",&n,&k);\n        long long ans=1;\n        for(int i=0;i<k;i++) ans=(ans*n)%MOD;\n        printf(\"%lld\\n\",ans);\n    }\n}"
    },
    "order": 19
  },
  {
    "id": "1504B",
    "contestId": 1504,
    "index": "B",
    "title": "Flip the Bits",
    "rating": 1200,
    "url": "https://codeforces.com/problemset/problem/1504/B",
    "tags": [
      "constructive algorithms",
      "greedy",
      "implementation",
      "math"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1504B+Flip%20the%20Bits+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nvoid solve() {\n    int n;\n    string a, b;\n    cin >> n >> a >> b;\n    a.push_back('0');\n    b.push_back('0');\n    int cnt = 0;\n    for(int i = 0; i < n; i++) {\n        cnt += (a[i] == '1') - (a[i] == '0');\n        if((a[i] == b[i]) != (a[i + 1] == b[i + 1]) && cnt != 0) {\n            cout << \"NO\\n\";\n            return;\n        }\n    }\n    cout << \"YES\\n\";\n}\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(0);\n    int tt;\n    cin >> tt;\n    while(tt--) {\n        solve();\n    }\n}"
    },
    "order": 20
  },
  {
    "id": "1497B",
    "contestId": 1497,
    "index": "B",
    "title": "M-arrays",
    "rating": 1200,
    "url": "https://codeforces.com/problemset/problem/1497/B",
    "tags": [
      "constructive algorithms",
      "greedy",
      "math"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1497B+M-arrays+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int tt;\n    cin >> tt;\n    while (tt--) {\n        int n, m;\n        cin >> n >> m;\n        map<int, int> cnt;\n        while (n--) {\n            int x;\n            cin >> x;\n            cnt[x % m]++;\n        }\n        int ans = 0;\n        for (auto &c : cnt) {\n            if (c.first == 0) ans++;\n            else if (2 * c.first == m) {\n                ans++;\n            } else if (2 * c.first < m || cnt.find(m - c.first) == cnt.end()) {\n                int x = c.second, y = cnt[m - c.first];\n                ans += 1 + max(0, abs(x - y) - 1);\n            }\n        }\n        cout << ans << '\\n';\n    }\n    return 0;\n}"
    },
    "order": 21
  },
  {
    "id": "1487B",
    "contestId": 1487,
    "index": "B",
    "title": "Cat Cycle",
    "rating": 1200,
    "url": "https://codeforces.com/problemset/problem/1487/B",
    "tags": [
      "math",
      "number theory"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1487B+Cat%20Cycle+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nint main()\n{\n\tint tt;\n\tcin >> tt; \n\n\twhile (tt--)\n\t{\n\t\tint n, k;\n\t\tcin >> n >> k; \n\n\t\tk--; \n\n\t\tif (n % 2 == 0) \n\t\t{\n\t\t\tint ans = k % n; \n\t\t\tcout << (k % n) + 1 << \"\\n\"; \n\t\t}\n\t\telse\n\t\t{\n\t\t\tint val = n / 2; \n\t\t\tcout << ((k + (k / val)) % n) + 1 << \"\\n\";\n\t\t}\n\t}\n\n\treturn 0;\n}"
    },
    "order": 22
  },
  {
    "id": "1872D",
    "contestId": 1872,
    "index": "D",
    "title": "Plus Minus Permutation",
    "rating": 1200,
    "url": "https://codeforces.com/problemset/problem/1872/D",
    "tags": [
      "math"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1872D+Plus%20Minus%20Permutation+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nlong long lcm(long long num1, long long num2) {\n\treturn (num1 * num2) / (gcd(num1, num2));\n}\n\nlong long calculateSum(long long start, long long end) {\n\tlong long sum = ((start + end) * (end - start + 1)) / 2;\n\treturn sum;\n}\n\nint main() {\n\tint tt; \n\tcin >> tt;\n\n\twhile (tt--) {\n\t\tlong long n, x, y;\n\t\tcin >> n >> x >> y;\n\n\t\tlong long count1 = (n / x) - (n / lcm(x, y)); \n\t\tlong long count2 = (n / y) - (n / lcm(x, y)); \n\n\t\tlong long ans = calculateSum(n - count1 + 1, n) - calculateSum(1LL, count2);\n\t\tcout << ans << endl;\n\t}\n}"
    },
    "order": 23
  },
  {
    "id": "1433D",
    "contestId": 1433,
    "index": "D",
    "title": "Districts Connection",
    "rating": 1200,
    "url": "https://codeforces.com/problemset/problem/1433/D",
    "tags": [
      "constructive algorithms",
      "dfs and similar"
    ],
    "hint": "Represent the input as an adjacency list. Use BFS/DFS traversal to discover reachable components, compute shortest hops in unweighted graphs, or detect bipartite coloring.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1433D+Districts%20Connection+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nint main() {\n\tint tt;\n\tcin >> tt;\n\twhile (tt--) {\n\t\tint n;\n\t\tcin >> n;\n\t\tvector<int> a(n);\n\t\tfor (auto &it : a) cin >> it;\n\t\tvector<pair<int, int>> res;\n\t\tint idx = -1;\n\t\tfor (int i = 1; i < n; ++i) {\n\t\t\tif (a[i] != a[0]) {\n\t\t\t\tidx = i;\n\t\t\t\tres.push_back({1, i + 1});\n\t\t\t}\n\t\t}\n\t\tif (idx == -1) {\n\t\t\tcout << \"NO\" << endl;\n\t\t\tcontinue;\n\t\t}\n\t\tfor (int i = 1; i < n; ++i) {\n\t\t\tif (a[i] == a[0]) {\n\t\t\t\tres.push_back({idx + 1, i + 1});\n\t\t\t}\n\t\t}\n\t\tcout << \"YES\" << endl;\n\t\tfor (auto [x, y] : res) cout << x << \" \" << y << endl;\n\t}\n\t\n\treturn 0;\n}"
    },
    "order": 24
  },
  {
    "id": "1420B",
    "contestId": 1420,
    "index": "B",
    "title": "Rock and Lever",
    "rating": 1200,
    "url": "https://codeforces.com/problemset/problem/1420/B",
    "tags": [
      "bitmasks",
      "math"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1420B+Rock%20and%20Lever+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nmt19937 rnd(time(NULL));\n\nint a[1000000+5];\n\nint main()\n{\n    ios_base::sync_with_stdio(false);\n    cin.tie(0);\n    cout.tie(0);\n    int t;\n    cin>>t;\n    while (t--)\n    {\n        int n;\n        cin>>n;\n        for (int i=0; i<n; i++)\n        {\n            cin>>a[i];\n        }\n        int64_t ans=0;\n        for (int j=29; j>=0; j--)\n        {\n            int64_t cnt=0;\n            for (int i=0; i<n; i++)\n            {\n                if (a[i]>=(1<<j)&&a[i]<(1<<(j+1)))\n                {\n                    cnt++;\n                }\n            }\n            ans+=cnt*(cnt-1)/2;\n        }\n        cout<<ans<<'\\n';\n    }\n}"
    },
    "order": 25
  },
  {
    "id": "1857C",
    "contestId": 1857,
    "index": "C",
    "title": "Assembly via Minimums",
    "rating": 1200,
    "url": "https://codeforces.com/problemset/problem/1857/C",
    "tags": [
      "greedy",
      "sortings"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1857C+Assembly%20via%20Minimums+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nint main() {\n\tint tt;\n\tcin >> tt; \n\n\twhile (tt--) {\n\t\tint n;\n\t\tcin >> n;\n\n\n\t\tint m = (n * (n - 1)) / 2;\n\n\t\tvector<int> v(m); \n\t\tfor (int i = 0; i < m; i++)\n\t\t\tcin >> v[i];\n\n\t\tsort(v.begin(), v.end());\n\n\t\tint x = n - 1, i = 0; \n\t\twhile (x > 0) {\n\t\t\tcout << v[i] << \" \"; \n\t\t\ti += x;\n\t\t\tx--;\n\t\t}\n\n\t\tcout << \"1000000000\\n\";\n\t}\n\n\treturn 0;\n}"
    },
    "order": 26
  },
  {
    "id": "1848B",
    "contestId": 1848,
    "index": "B",
    "title": "Vika and the Bridge",
    "rating": 1200,
    "url": "https://codeforces.com/problemset/problem/1848/B",
    "tags": [
      "binary search",
      "data structures",
      "greedy",
      "implementation",
      "math",
      "sortings"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1848B+Vika%20and%20the%20Bridge+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nint main()\n{\n\tint tt;\n\tcin >> tt; \n\n\twhile (tt--)\n\t{\n\t\tint n, k;\n\t\tcin >> n >> k;\n\n\t\tvector<int> v(n);\n\t\tfor (int i = 0; i < n; i++) \n\t\t\tcin >> v[i]; \n\n\t\tvector<int> colours[k + 1]; \n\n\t\tfor (int i = 1; i <= k; i++) \n\t\t{\n\t\t\tcolours[i].push_back(0); \n\t\t}\n\n\t\tfor (int i = 0; i < n; i++)\n\t\t{\n\t\t\tcolours[v[i]].push_back(i + 1); \n\t\t}\n\n\t\tfor (int i = 1; i <= k; i++) \n\t\t{\n\t\t\tcolours[i].push_back(n + 1);\n\t\t}\n\n\t\tpriority_queue<int> jumps[k + 1]; \n\n\t\tint ans = INT_MAX; \n\n\t\tfor (int i = 1; i <= k; i++)\n\t\t{\n\t\t\tfor (int j = 0; j < colours[i].size() - 1; j++)\n\t\t\t{\n\t\t\t\t\n\t\t\t\tjumps[i].push(colours[i][j + 1] - colours[i][j] - 1);\n\t\t\t} \n\n\t\t\tint max_val = jumps[i].top();\n\n\t\t\tjumps[i].pop(); \n\t\t\tif (max_val % 2 == 0)\n\t\t\t{\n\t\t\t\tjumps[i].push(max_val / 2);\n\t\t\t\tjumps[i].push((max_val / 2) - 1);\n\t\t\t}\n\t\t\telse\n\t\t\t{\n\t\t\t\tjumps[i].push(max_val / 2);\n\t\t\t\tjumps[i].push(max_val / 2);\n\t\t\t}\n\n\t\t\tans = min(ans, jumps[i].top());\n\t\t} \n\n\t\tcout << ans << \"\\n\";\n\t}\n\n\treturn 0;\n}"
    },
    "order": 27
  },
  {
    "id": "1832C",
    "contestId": 1832,
    "index": "C",
    "title": "Contrast Value",
    "rating": 1200,
    "url": "https://codeforces.com/problemset/problem/1832/C",
    "tags": [
      "greedy",
      "implementation"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1832C+Contrast%20Value+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nint main() {\n\tint tt;\n\tcin >> tt;\n\n\twhile (tt--) {\n\t\tint n;\n\t\tcin >> n;\n\n\t\tvector<int> v(n);\n\t\tfor (int i = 0; i < n; i++)\n\t\t\tcin >> v[i]; \n\n\t\tif (v.size() == 1) {\n\t\t\tcout << \"1\\n\";\n\t\t\tcontinue;\n\t\t}\n\n\t\tvector<int> ans;\n\t\tans.push_back(v[0]); \n\t\tans.push_back(v[1]); \n\t\tfor (int i = 2; i < n; i++) {\n\t\t\tint currSize = ans.size();\n\t\t\tint x = ans[currSize - 2] - ans[currSize - 1];\n\t\t\tint y = ans[currSize - 1] - v[i];\n\n\t\t\tif (x > 0) {\n\t\t\t\tif (y > 0)\n\t\t\t\t\tans[currSize - 1] = v[i];\n\t\t\t\telse if (y < 0)\n\t\t\t\t\tans.push_back(v[i]); \n\t\t\t} else {\n\t\t\t\tif (y < 0)\n\t\t\t\t\tans[currSize - 1] = v[i]; \n\t\t\t\telse if (y > 0)\n\t\t\t\t\tans.push_back(v[i]); \n\t\t\t}\n\t\t}\n\n\t\tint finalSize = ans.size(); \n\t\tif (ans[0] == ans[1])\n\t\t\tfinalSize--;\n\n\t\tcout << finalSize << \"\\n\"; // \n\t}\n}"
    },
    "order": 28
  },
  {
    "id": "1808B",
    "contestId": 1808,
    "index": "B",
    "title": "Playing in a Casino",
    "rating": 1200,
    "url": "https://codeforces.com/problemset/problem/1808/B",
    "tags": [
      "math",
      "sortings"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1808B+Playing%20in%20a%20Casino+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nint main()\n{\n\tint tt;\n\tcin >> tt; \n\n\twhile (tt--)\n\t{\n\t\tint n, m;\n\t\tcin >> n >> m;\n\n\n        vector<vector<long long>> v(m, vector<long long>(n));\n\n\n        for (int j = 0; j < n; j++)\n\t\t{\n\t\t\tfor (int i = 0; i < m; i++)\n\t\t\t{\n\t\t\t\tcin >> v[i][j]; \n                \n\t\t\t}\n\t\t} \n        \n\n\t\tfor (int i = 0; i < m; i++)\n\t\t{\n\t\t\tsort(v[i].begin(), v[i].end());\n        }\n\n\t\tlong long ans = 0;\n\n\t\tfor (int i = 0; i < m; i++)\n\t\t{\n\t\t\tfor (int j = 0; j < n; j++)\n\t\t\t{\n\t\t\t\tans -= (v[i][j] * (n - j - 1));\n\t\t\t\tans += (v[i][j] * j);\n\t\t\t}\n\t\t} \n\n\t\tcout << ans << \"\\n\";\n\t}\n}"
    },
    "order": 29
  },
  {
    "id": "1793C",
    "contestId": 1793,
    "index": "C",
    "title": "Dora and Search",
    "rating": 1200,
    "url": "https://codeforces.com/problemset/problem/1793/C",
    "tags": [
      "constructive algorithms",
      "data structures",
      "two pointers"
    ],
    "hint": "Notice that as the right pointer expands, the left pointer only needs to move forward. Maintain frequency counts or window invariants to keep the window valid in O(N) overall.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1793C+Dora%20and%20Search+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nbool isMinOrMax(int val, set<int> &segEle)\n{\n\tif ((*segEle.begin()) == val)\n\t\treturn true;\n\n\tif ((*segEle.rbegin()) == val)\n\t\treturn true;\n\n\treturn false;\n} \n\nint main()\n{\n\tint tt;\n\tcin >> tt; \n\n\twhile (tt--)\n\t{\n\t\tint n;\n\t\tcin >> n;\n\n\t\tvector<int> arr(n);\n\t\tfor (int i = 0; i < n; i++)\n\t\t\tcin >> arr[i]; \n\n\t\tset<int> segEle(arr.begin(), arr.end());\n\n\t\tint i = 0, j = n - 1;\n\n\t\twhile (i < j)\n\t\t{\n\t\t\tif (isMinOrMax(arr[i], segEle)) \n\t\t\t{\n\t\t\t\tsegEle.erase(arr[i]);\n\t\t\t\ti++;\n\t\t\t\tcontinue;\n\t\t\t}\n\n\t\t\tif (isMinOrMax(arr[j], segEle)) \n\t\t\t{\n\t\t\t\tsegEle.erase(arr[j]);\n\t\t\t\tj--;\n\t\t\t\tcontinue;\n\t\t\t}\n\n\t\t\tbreak;\n\t\t} \n\t\tif (i < j)\n\t\t{\n\t\t\tcout << (i + 1) << \" \" << (j + 1) << \"\\n\";\n\t\t}\n\t\telse\n\t\t{\n\t\t\tcout << \"-1\\n\";\n\t\t}\n\t}\n\n\treturn 0;\n}"
    },
    "order": 30
  },
  {
    "id": "1790D",
    "contestId": 1790,
    "index": "D",
    "title": "Matryoshkas",
    "rating": 1200,
    "url": "https://codeforces.com/problemset/problem/1790/D",
    "tags": [
      "data structures",
      "greedy",
      "sortings"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1790D+Matryoshkas+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n\tint tt;\n\tcin >> tt;\n\n\twhile (tt--) {\n\t\tint n;\n\t\tcin >> n;\n\n\t\tvector<int> v(n); \n\t\tfor (int i = 0; i < n; i++)\n\t\t\tcin >> v[i]; \n\n\t\tmap<int, int> cnt; \n\t\tfor (int i = 0; i < n; i++)\n\t\t\tcnt[v[i]]++; \n\n\t\tint ans = 0; \n\t\tfor (auto &[ele, fre] : cnt) {\n\t\t\tans += max(0, cnt[ele] - cnt[ele - 1]);\n\t\t}\n\n\t\tcout << ans << \"\\n\"; \n\t}\n\n\treturn 0;\n}"
    },
    "order": 31
  },
  {
    "id": "1926C",
    "contestId": 1926,
    "index": "C",
    "title": "Vlad and a Sum of Sum of Digits",
    "rating": 1200,
    "url": "https://codeforces.com/problemset/problem/1926/C",
    "tags": [
      "dp",
      "implementation"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1926C+Vlad%20and%20a%20Sum%20of%20Sum%20of%20Digits+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    vector<long long> dp(n + 1, 0);\n    for (int i = 0; i < n; i++) {\n        dp[i + 1] = max(dp[i], dp[i] + a[i]);\n    }\n    cout << dp[n] << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 32
  },
  {
    "id": "1613C",
    "contestId": 1613,
    "index": "C",
    "title": "Poisoned Dagger",
    "rating": 1200,
    "url": "https://codeforces.com/problemset/problem/1613/C",
    "tags": [
      "binary search"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1613C+Poisoned%20Dagger+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nbool check(long long mid, const vector<long long>& a, int n, long long k) {\n    long long count = 0;\n    for (int i = 0; i < n; i++) {\n        count += mid / a[i];\n    }\n    return count >= k;\n}\n\nvoid solve() {\n    int n;\n    long long k;\n    if (!(cin >> n >> k)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    long long low = 1, high = 1e18, ans = high;\n    while (low <= high) {\n        long long mid = low + (high - low) / 2;\n        if (check(mid, a, n, k)) {\n            ans = mid;\n            high = mid - 1;\n        } else {\n            low = mid + 1;\n        }\n    }\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 33
  },
  {
    "id": "1594C",
    "contestId": 1594,
    "index": "C",
    "title": "Make Them Equal",
    "rating": 1200,
    "url": "https://codeforces.com/problemset/problem/1594/C",
    "tags": [
      "brute force",
      "greedy",
      "math",
      "strings"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1594C+Make%20Them%20Equal+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 34
  },
  {
    "id": "1537C",
    "contestId": 1537,
    "index": "C",
    "title": "Challenging Cliffs",
    "rating": 1200,
    "url": "https://codeforces.com/problemset/problem/1537/C",
    "tags": [
      "constructive algorithms",
      "greedy",
      "implementation",
      "math"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1537C+Challenging%20Cliffs+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 35
  },
  {
    "id": "1800D",
    "contestId": 1800,
    "index": "D",
    "title": "Remove Two Letters",
    "rating": 1200,
    "url": "https://codeforces.com/problemset/problem/1800/D",
    "tags": [
      "data structures",
      "greedy",
      "hashing",
      "strings"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1800D+Remove%20Two%20Letters+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 36
  },
  {
    "id": "2000D",
    "contestId": 2000,
    "index": "D",
    "title": "Right Left Wrong",
    "rating": 1200,
    "url": "https://codeforces.com/problemset/problem/2000/D",
    "tags": [
      "greedy",
      "implementation",
      "two pointers"
    ],
    "hint": "Notice that as the right pointer expands, the left pointer only needs to move forward. Maintain frequency counts or window invariants to keep the window valid in O(N) overall.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+2000D+Right%20Left%20Wrong+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 37
  },
  {
    "id": "1996C",
    "contestId": 1996,
    "index": "C",
    "title": "Sort",
    "rating": 1200,
    "url": "https://codeforces.com/problemset/problem/1996/C",
    "tags": [
      "dp",
      "greedy",
      "sortings",
      "strings"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1996C+Sort+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    vector<long long> dp(n + 1, 0);\n    for (int i = 0; i < n; i++) {\n        dp[i + 1] = max(dp[i], dp[i] + a[i]);\n    }\n    cout << dp[n] << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 38
  },
  {
    "id": "1704C",
    "contestId": 1704,
    "index": "C",
    "title": "Virus",
    "rating": 1200,
    "url": "https://codeforces.com/problemset/problem/1704/C",
    "tags": [
      "greedy",
      "implementation",
      "sortings"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1704C+Virus+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 39
  },
  {
    "id": "2050C",
    "contestId": 2050,
    "index": "C",
    "title": "Uninteresting Number",
    "rating": 1200,
    "url": "https://codeforces.com/problemset/problem/2050/C",
    "tags": [
      "brute force",
      "dp",
      "math"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+2050C+Uninteresting%20Number+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    vector<long long> dp(n + 1, 0);\n    for (int i = 0; i < n; i++) {\n        dp[i + 1] = max(dp[i], dp[i] + a[i]);\n    }\n    cout << dp[n] << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 40
  },
  {
    "id": "1512D",
    "contestId": 1512,
    "index": "D",
    "title": "Corrupted Array",
    "rating": 1200,
    "url": "https://codeforces.com/problemset/problem/1512/D",
    "tags": [
      "constructive algorithms",
      "data structures",
      "greedy"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1512D+Corrupted%20Array+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 41
  },
  {
    "id": "2051D",
    "contestId": 2051,
    "index": "D",
    "title": "Counting Pairs",
    "rating": 1200,
    "url": "https://codeforces.com/problemset/problem/2051/D",
    "tags": [
      "binary search",
      "sortings",
      "two pointers"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+2051D+Counting%20Pairs+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nbool check(long long mid, const vector<long long>& a, int n, long long k) {\n    long long count = 0;\n    for (int i = 0; i < n; i++) {\n        count += mid / a[i];\n    }\n    return count >= k;\n}\n\nvoid solve() {\n    int n;\n    long long k;\n    if (!(cin >> n >> k)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    long long low = 1, high = 1e18, ans = high;\n    while (low <= high) {\n        long long mid = low + (high - low) / 2;\n        if (check(mid, a, n, k)) {\n            ans = mid;\n            high = mid - 1;\n        } else {\n            low = mid + 1;\n        }\n    }\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 42
  },
  {
    "id": "1744D",
    "contestId": 1744,
    "index": "D",
    "title": "Divisibility by 2^n",
    "rating": 1200,
    "url": "https://codeforces.com/problemset/problem/1744/D",
    "tags": [
      "greedy",
      "math",
      "sortings"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1744D+Divisibility%20by%202%5En+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 43
  },
  {
    "id": "2126D",
    "contestId": 2126,
    "index": "D",
    "title": "This Is the Last Time",
    "rating": 1200,
    "url": "https://codeforces.com/problemset/problem/2126/D",
    "tags": [
      "data structures",
      "greedy",
      "sortings"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+2126D+This%20Is%20the%20Last%20Time+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 44
  },
  {
    "id": "1992D",
    "contestId": 1992,
    "index": "D",
    "title": "Test of Love",
    "rating": 1200,
    "url": "https://codeforces.com/problemset/problem/1992/D",
    "tags": [
      "dp",
      "greedy",
      "implementation"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1992D+Test%20of%20Love+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    vector<long long> dp(n + 1, 0);\n    for (int i = 0; i < n; i++) {\n        dp[i + 1] = max(dp[i], dp[i] + a[i]);\n    }\n    cout << dp[n] << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 45
  },
  {
    "id": "1792B",
    "contestId": 1792,
    "index": "B",
    "title": "Stand-up Comedian",
    "rating": 1200,
    "url": "https://codeforces.com/problemset/problem/1792/B",
    "tags": [
      "greedy",
      "math"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1792B+Stand-up%20Comedian+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 46
  },
  {
    "id": "2091D",
    "contestId": 2091,
    "index": "D",
    "title": "Place of the Olympiad",
    "rating": 1200,
    "url": "https://codeforces.com/problemset/problem/2091/D",
    "tags": [
      "binary search",
      "greedy",
      "math"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+2091D+Place%20of%20the%20Olympiad+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nbool check(long long mid, const vector<long long>& a, int n, long long k) {\n    long long count = 0;\n    for (int i = 0; i < n; i++) {\n        count += mid / a[i];\n    }\n    return count >= k;\n}\n\nvoid solve() {\n    int n;\n    long long k;\n    if (!(cin >> n >> k)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    long long low = 1, high = 1e18, ans = high;\n    while (low <= high) {\n        long long mid = low + (high - low) / 2;\n        if (check(mid, a, n, k)) {\n            ans = mid;\n            high = mid - 1;\n        } else {\n            low = mid + 1;\n        }\n    }\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 47
  },
  {
    "id": "1598C",
    "contestId": 1598,
    "index": "C",
    "title": "Delete Two Elements",
    "rating": 1200,
    "url": "https://codeforces.com/problemset/problem/1598/C",
    "tags": [
      "data structures",
      "dp",
      "implementation",
      "math",
      "two pointers"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1598C+Delete%20Two%20Elements+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    vector<long long> dp(n + 1, 0);\n    for (int i = 0; i < n; i++) {\n        dp[i + 1] = max(dp[i], dp[i] + a[i]);\n    }\n    cout << dp[n] << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 48
  },
  {
    "id": "1933D",
    "contestId": 1933,
    "index": "D",
    "title": "Turtle Tenacity: Continual Mods",
    "rating": 1200,
    "url": "https://codeforces.com/problemset/problem/1933/D",
    "tags": [
      "constructive algorithms",
      "greedy",
      "math",
      "number theory",
      "sortings"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1933D+Turtle%20Tenacity%3A%20Continual%20Mods+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 49
  },
  {
    "id": "1985E",
    "contestId": 1985,
    "index": "E",
    "title": "Secret Box",
    "rating": 1200,
    "url": "https://codeforces.com/problemset/problem/1985/E",
    "tags": [
      "brute force",
      "combinatorics",
      "math"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1985E+Secret%20Box+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 50
  },
  {
    "id": "1931D",
    "contestId": 1931,
    "index": "D",
    "title": "Divisible Pairs",
    "rating": 1300,
    "url": "https://codeforces.com/problemset/problem/1931/D",
    "tags": [
      "combinatorics",
      "math",
      "number theory"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1931D+Divisible%20Pairs+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n\tint tt;\n\tcin >> tt;\n\twhile (tt--) {\n\t\tint n, x, y;\n\t\tcin >> n >> x >> y; \n\t\tvector<int> a(n, 0); \n\t\tmap<int, vector<int>> mp; \n\n\t\tfor (int i = 0; i < n; i++) { \n\t\t\tcin >> a[i];\n\t\t\tmp[a[i] % y].push_back(a[i]); \n\t\t}\n\n\t\tlong long int ans = 0; \n\t\tfor (auto it : mp) {\n\t\t\tvector<int> v = it.second; \n\t\t\tmap<int, long long int> mp1; \n\t\t\tfor (int i = 0; i < v.size(); i++) { \n\t\t\t\tmp1[v[i] % x]++;\n\t\t\t}\n\n\t\t\tfor (auto it : mp1) { \n\t\t\t\tif (it.first == 0 || (it.first == x / 2 && x % 2 == 0)) {\n\t\t\t\t\tlong long int cnt = it.second;\n\t\t\t\t\tans += (cnt * (cnt - 1)) / 2;\n\t\t\t\t\tit.second = 0;\n\t\t\t\t} else {\n\t\t\t\t\tlong long int cnt1 = it.second;\n\t\t\t\t\tlong long int cnt2 = mp1[x - it.first];\n\t\t\t\t\tans += cnt1 * cnt2; \n\t\t\t\t\tmp1[x - it.first] = 0; \n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\tcout << ans << endl;\n\t}\n}"
    },
    "order": 1
  },
  {
    "id": "1703F",
    "contestId": 1703,
    "index": "F",
    "title": "Yet Another Problem About Pairs Satisfying an Inequality",
    "rating": 1300,
    "url": "https://codeforces.com/problemset/problem/1703/F",
    "tags": [
      "binary search",
      "data structures",
      "dp",
      "greedy",
      "sortings"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1703F+Yet%20Another%20Problem%20About%20Pairs%20Satisfying%20an%20Inequality+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nvoid solve() {\n\tint n;\n\tcin >> n; \n\tint a[n];\n\tfor (int i = 0; i < n; i++) { \n\t\tcin >> a[i];\n\t}\n\tlong long res = 0; \n\tvector<int> v; \n\tfor (int i = 0; i < n; i++) { \n\t\tif (a[i] >= i + 1) {\n\t\t\tcontinue; \n\t\t}\n\t\tres += (long long)(lower_bound(v.begin(), v.end(), a[i]) - v.begin());\n\t\tv.push_back(i + 1);\n\t}\n\tcout << res << '\\n'; \n}\n\nint main() {\n\tint tt;\n\tcin >> tt;\n\tfor (int i = 1; i <= tt; i++)\n\t\tsolve();\n\treturn 0;\n}"
    },
    "order": 2
  },
  {
    "id": "1676G",
    "contestId": 1676,
    "index": "G",
    "title": "White-Black Balanced Subtrees",
    "rating": 1300,
    "url": "https://codeforces.com/problemset/problem/1676/G",
    "tags": [
      "dfs and similar",
      "dp",
      "graphs",
      "trees"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1676G+White-Black%20Balanced%20Subtrees+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nconst int MAX = 200007;\nconst int MOD = 1000000007;\n\nvoid solve() {\n\tint n;\n\tcin >> n;\n\tvector<int> child[n + 7];\n\tfor (int i = 2; i <= n; i++) {\n\t\tint x;\n\t\tcin >> x;\n\t\tchild[x].push_back(i);\n\t}\n\tstring s;\n\tcin >> s;\n\tint res = 0;\n\tfunction<int(int)> dp = [&] (int x) {\n\t\tint bal = (s[x - 1] == 'B') ? -1 : 1;\n\t\tif (child[x].empty()) {return bal;}\n\t\tfor (int i : child[x]) {\n\t\t\tbal += dp(i);\n\t\t}\n\t\tif (bal == 0) {res++;}\n\t\treturn bal;\n\t};\n\tdp(1);\n\tcout << res << '\\n';\n}\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int tt; cin >> tt; for (int i = 1; i <= tt; i++) {solve();}\n}"
    },
    "order": 3
  },
  {
    "id": "1669H",
    "contestId": 1669,
    "index": "H",
    "title": "Maximal AND",
    "rating": 1300,
    "url": "https://codeforces.com/problemset/problem/1669/H",
    "tags": [
      "bitmasks",
      "greedy",
      "math"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1669H+Maximal%20AND+editorial",
    "solutionCode": {
      "cpp": "#include \"bits/stdc++.h\"\nusing namespace std;\n\nint main() {\n    int t; cin >> t;\n    while(t--) {\n        int n, k; cin >> n >> k;\n        vector<int> cnt(31, 0), a(n);\n        for(int i = 0;i < n; ++i) {\n            cin >> a[i];\n            for(int j = 30; j >= 0; --j) {\n                if(a[i] & (1 << j)) ++cnt[j];\n            }\n        }\n        int ans = 0;\n        for(int i = 30; i >= 0; --i) {\n            int need = n - cnt[i];\n            if(need <= k) {\n                k -= need;\n                ans += (1 << i);\n            }\n        }\n        cout << ans << \"\\n\";\n    }\n}"
    },
    "order": 4
  },
  {
    "id": "1612C",
    "contestId": 1612,
    "index": "C",
    "title": "Chat Ban",
    "rating": 1300,
    "url": "https://codeforces.com/problemset/problem/1612/C",
    "tags": [
      "binary search",
      "math"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1612C+Chat%20Ban+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nlong long get(int x) {\n    return x * 1ll * (x + 1) / 2;\n}\n\nint main() {\n    int tt;\n    cin >> tt;\n    while (tt--) {\n        int k;\n        long long x;\n        cin >> k >> x;\n        long long l = 1, r = 2 * k - 1;\n        long long res = 2 * k - 1;\n        bool over = false;\n        while (l <= r) {\n            int mid = (l + r) >> 1;\n            if (mid >= k) {\n                over = (get(k) + get(k - 1) - get(2 * k - 1 - mid) >= x);\n            } else {\n                over = (get(mid) >= x);\n            }\n            if (over) {\n                res = mid;\n                r = mid - 1;\n            } else {\n                l = mid + 1;\n            }\n        }\n        cout << res << endl;\n    }\n    \n    return 0;\n}"
    },
    "order": 5
  },
  {
    "id": "1601A",
    "contestId": 1601,
    "index": "A",
    "title": "Array Elimination",
    "rating": 1300,
    "url": "https://codeforces.com/problemset/problem/1601/A",
    "tags": [
      "bitmasks",
      "greedy",
      "math",
      "number theory"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1601A+Array%20Elimination+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n\tint t; \n\tcin >> t;\n\twhile (t--) {\n\t\tint n; \n\t\tcin >> n; \n\t\tmap<int, int> mp; \n\t\tfor (int i = 0; i < n; i++) {\n\t\t\tint temp; \n\t\t\tcin >> temp; \n\t\t\tfor (int j = 0; j < 31; j++) {\n\t\t\t\tif (temp & (1 << j)) {\n\t\t\t\t\tmp[j]++;\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\tint gcd = 0; \n\t\tint f = 1; \n\t\tfor (auto i : mp) {\n\t\t\tf = 0; \n\t\t\tif (gcd == 0) {\n\t\t\t\tgcd = i.second; \n\t\t\t} else {\n\t\t\t\tgcd = __gcd(gcd, i.second); \n\t\t\t}\n\t\t}\n\t\tif (f) {\n\t\t\tfor (int i = 0; i < n; i++) {\n\t\t\t\tcout << i + 1 << \" \";\n\t\t\t}\n\t\t\tcout << \"\\n\";\n\t\t\tcontinue; \n\t\t}\n\n\t\tvector<int> factors; \n\t\tfor (int i = 1; i * i <= gcd; i++) {\n\t\t\tif (gcd % i == 0) {\n\t\t\t\tfactors.push_back(i); \n\t\t\t\tif (i != gcd / i)\n\t\t\t\t\tfactors.push_back(gcd / i); \n\t\t\t}\n\t\t}\n\t\tsort(factors.begin(), factors.end()); \n\t\tfor (int f : factors) {\n\t\t\tcout << f << \" \";\n\t\t}\n\t\tcout << \"\\n\"; \n\t}\n}"
    },
    "order": 6
  },
  {
    "id": "1561C",
    "contestId": 1561,
    "index": "C",
    "title": "Deep Down Below",
    "rating": 1300,
    "url": "https://codeforces.com/problemset/problem/1561/C",
    "tags": [
      "binary search",
      "greedy",
      "sortings"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1561C+Deep%20Down%20Below+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n\tint t;\n\tcin >> t;\n\twhile (t--) {\n\t\tint n;\n\t\tcin >> n;\n\t\tvector<pair<int, int>> a;\n\t\tfor (int i = 0; i < n; i++) {\n\t\t\tvector<int> v;\n\t\t\tint m;\n\t\t\tcin >> m;\n\t\t\tfor (int j = 0; j < m; j++) {\n\t\t\t\tint x;\n\t\t\t\tcin >> x;\n\t\t\t\tv.push_back(x - j + 1);\n\t\t\t}\n\t\t\tsort(v.begin(), v.end());\n\t\t\ta.push_back({v[m - 1], m});\n\t\t}\n\t\tsort(a.begin(), a.end());\n\t\tint ans = a[0].first;\n\t\tint increase = a[0].second;\n\t\tfor (int i = 1; i < n; i++) {\n\t\t\tans = max(ans, a[i].first - increase);\n\t\t\tincrease += a[i].second;\n\t\t}\n\t\tcout << ans << endl;\n\t}\n}"
    },
    "order": 7
  },
  {
    "id": "1498B",
    "contestId": 1498,
    "index": "B",
    "title": "Box Fitting",
    "rating": 1300,
    "url": "https://codeforces.com/problemset/problem/1498/B",
    "tags": [
      "binary search",
      "bitmasks",
      "data structures",
      "greedy"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1498B+Box%20Fitting+editorial",
    "solutionCode": {
      "cpp": "#include <cmath>\n#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int t;\n    cin >> t;\n\n    while (t--) {\n        int n, box_width, w;\n        cin >> n >> box_width;\n\n        vector<int> counts(20);\n        for (int i = 0; i < n; i++) {\n            cin >> w;\n            counts[log2(w)]++;\n        }\n\n        int height = 1, space_left = box_width;\n\n        for (int iter = 0; iter < n; iter++) {\n            int largest = -1;\n\n            for (int size = 19; size >= 0; size--) {\n                if (counts[size] and (1 << size) <= space_left) {\n                    largest = size;\n                    break;\n                }\n            }\n\n            if (largest == -1) {\n                space_left = box_width;\n                height++;\n                for (int size = 19; size >= 0; size--) {\n                    if (counts[size] and (1 << size) <= space_left) {\n                        largest = size;\n                        break;\n                    }\n                }\n            }\n\n            counts[largest] -= 1;\n            space_left -= 1 << largest;\n        }\n\n        cout << height << endl;\n    }\n\n}"
    },
    "order": 8
  },
  {
    "id": "1470A",
    "contestId": 1470,
    "index": "A",
    "title": "Strange Birthday Party",
    "rating": 1300,
    "url": "https://codeforces.com/problemset/problem/1470/A",
    "tags": [
      "binary search",
      "dp",
      "greedy",
      "sortings",
      "two pointers"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1470A+Strange%20Birthday%20Party+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\n#define int long long\n\nint32_t main() {\n\tint tt;\n\tcin >> tt; \n\twhile (tt--) {\n\t\tint n, m;\n\t\tcin >> n >> m;\n\t\tvector<int> k(n); \n\t\tfor (int i = 0; i < n; i++) { \n\t\t\tcin >> k[i];\n\t\t}\n\t\tvector<int> c(m); \n\t\tfor (int i = 0; i < m; i++) { \n\t\t\tcin >> c[i];\n\t\t}\n\t\tsort(k.begin(), k.end()); \n\t\tint ans = 0; \n\t\tint p = 0; \n\t\tfor (int i = n - 1; i >= 0; i--) { \n\t\t\tif (p < m && c[p] <= c[k[i] - 1]) {\n\t\t\t\tans += c[p]; \n\t\t\t\tp++; \n\t\t\t} else {\n\t\t\t\tans += c[k[i] - 1]; \n\t\t\t}\n\t\t}\n\t\tcout << ans << endl; \n\t}\n}"
    },
    "order": 9
  },
  {
    "id": "1459B",
    "contestId": 1459,
    "index": "B",
    "title": "Move and Turn",
    "rating": 1300,
    "url": "https://codeforces.com/problemset/problem/1459/B",
    "tags": [
      "dp",
      "math"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1459B+Move%20and%20Turn+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n\tint n;\n\tcin >> n;\n\tint k = n / 2;\n\tlong long int ans = 0;\n\tif (n % 2 == 0) {\n\t\tans = (k + 1) * (k + 1);\n\t} else {\n\t\tans = 2 * (k + 1) * (k + 2);\n\t}\n\tcout << ans << endl;\n\n\treturn 0;\n}"
    },
    "order": 10
  },
  {
    "id": "1372B",
    "contestId": 1372,
    "index": "B",
    "title": "Omkar and Last Class of Math",
    "rating": 1300,
    "url": "https://codeforces.com/problemset/problem/1372/B",
    "tags": [
      "greedy",
      "math",
      "number theory"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1372B+Omkar%20and%20Last%20Class%20of%20Math+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n\tint tt; \n\tcin >> tt;\n\twhile (tt--) {\n\t\tint n; \n\t\tcin >> n;\n\t\tint f = 0; \n\t\tfor (int i = 2; i * i <= n; i++) { \n\t\t\tif (n % i == 0) { \n\t\t\t\tint k = n / i; \n\t\t\t\tcout << k << \" \" << n - k << endl;\n\t\t\t\tf = 1; \n\t\t\t\tbreak; \n\t\t\t}\n\t\t}\n\t\tif (f == 0) {\n\t\t\tcout << 1 << \" \" << n - 1 << endl;\n\t\t}\n\t}\n}"
    },
    "order": 11
  },
  {
    "id": "1927D",
    "contestId": 1927,
    "index": "D",
    "title": "Find the Different Ones!",
    "rating": 1300,
    "url": "https://codeforces.com/problemset/problem/1927/D",
    "tags": [
      "binary search",
      "brute force",
      "data structures",
      "dp",
      "dsu",
      "greedy",
      "two pointers"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1927D+Find%20the%20Different%20Ones!+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n\tint tt;\n\tcin >> tt; \n\twhile (tt--) {\n\t\tint n;\n\t\tcin >> n; \n\t\tvector<int> a(n, 0);\n\t\tfor (int i = 0; i < n; i++) { \n\t\t\tcin >> a[i]; \n\t\t}\n\n\t\tvector<int> previous_different(n, -1);\n\t\tint prv = -1;\n\t\tfor (int i = 1; i < n; i++) {\n\t\t\tif (a[i] != a[i - 1])\n\t\t\t\tprv = i - 1;\n\t\t\tprevious_different[i] = prv;\n\t\t}\n\n\t\tint q;\n\t\tcin >> q;\n\t\twhile (q--) {\n\t\t\tint l, r;\n\t\t\tcin >> l >> r;\n\t\t\tif (previous_different[r - 1] >= l - 1) {\n\t\t\t\tcout << r << \" \" << previous_different[r - 1] + 1 << endl;\n\t\t\t} else {\n\t\t\t\tcout << -1 << \" \" << -1 << endl;\n\t\t\t}\n\t\t}\n\t\tcout << endl;\n\t}\n}"
    },
    "order": 12
  },
  {
    "id": "1366B",
    "contestId": 1366,
    "index": "B",
    "title": "Shuffle",
    "rating": 1300,
    "url": "https://codeforces.com/problemset/problem/1366/B",
    "tags": [
      "math",
      "two pointers"
    ],
    "hint": "Notice that as the right pointer expands, the left pointer only needs to move forward. Maintain frequency counts or window invariants to keep the window valid in O(N) overall.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1366B+Shuffle+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n\tint tt;\n\tcin >> tt;\n\n\twhile (tt--) {\n\t\tint n, x, m;\n\t\tcin >> n >> x >> m;\n\t\tint p1 = x, p2 = x;\n\t\tfor (int i = 0; i < m; i++) {\n\t\t\tint l, r;\n\t\t\tcin >> l >> r;\n\t\t\tif (r >= p1 && l <= p2) {\n\t\t\t\tp1 = min(p1, l);\n\t\t\t\tp2 = max(p2, r);\n\t\t\t}\n\t\t}\n\t\tcout << p2 - p1 + 1 << endl;\n\t}\n\n\treturn 0;\n}"
    },
    "order": 13
  },
  {
    "id": "1364B",
    "contestId": 1364,
    "index": "B",
    "title": "Most socially-distanced subsequence",
    "rating": 1300,
    "url": "https://codeforces.com/problemset/problem/1364/B",
    "tags": [
      "greedy",
      "two pointers"
    ],
    "hint": "Notice that as the right pointer expands, the left pointer only needs to move forward. Maintain frequency counts or window invariants to keep the window valid in O(N) overall.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1364B+Most%20socially-distanced%20subsequence+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n\tint tt;\n\tcin >> tt;\n\twhile (tt--) {\n\t\tint n;\n\t\tcin >> n;\n\t\tvector<int> a(n);\n\t\tfor (int i = 0; i < n; i++)\n\t\t\tcin >> a[i];\n\n\t\tvector<int> ans; \n\t\tans.push_back(a[0]);\n\t\tfor (int i = 1; i < n - 1; i++) { \n\t\t\tif ((1LL * a[i] - a[i - 1]) * (1LL * a[i + 1] - a[i]) < 0) {\n\t\t\t\tans.push_back(a[i]); \n\t\t\t}\n\t\t}\n\n\t\tans.push_back(a[n - 1]);\n\n\t\tcout << ans.size() << endl;\n\t\tfor (int i = 0; i < ans.size(); i++)\n\t\t\tcout << ans[i] << \" \"; \n\t\tcout << endl;\n\t}\n}"
    },
    "order": 14
  },
  {
    "id": "1360D",
    "contestId": 1360,
    "index": "D",
    "title": "Buying Shovels",
    "rating": 1300,
    "url": "https://codeforces.com/problemset/problem/1360/D",
    "tags": [
      "math",
      "number theory"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1360D+Buying%20Shovels+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n\tint test;\n\tcin >> test;\n\n\tfor (int tt = 0; tt < test; tt++) {\n\t\tint n, k;\n\t\tcin >> n >> k;\n\n\t\tint ans = n;\n\n\t\tfor (int j = 1; j * j <= n; j++) {\n\t\t\tif (n % j == 0) {\n\t\t\t\tif (j <= k) {\n\t\t\t\t\tans = min(ans, n / j);\n\t\t\t\t}\n\n\t\t\t\tif (n / j <= k) {\n\t\t\t\t\tans = min(ans, j);\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\n\t\tcout << ans << endl;\n\t}\n\n\treturn 0;\n}"
    },
    "order": 15
  },
  {
    "id": "1294C",
    "contestId": 1294,
    "index": "C",
    "title": "Product of Three Numbers",
    "rating": 1300,
    "url": "https://codeforces.com/problemset/problem/1294/C",
    "tags": [
      "greedy",
      "math",
      "number theory"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1294C+Product%20of%20Three%20Numbers+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nint main() {\n\tint q;\n\tcin >> q;\n\tfor (int i = 0; i < q; ++i) {\n\t\tint n;\n\t\tcin >> n;\n\t\tset<int> used;\n\t\tfor (int i = 2; i * i <= n; ++i) {\n\t\t\tif (n % i == 0 && !used.count(i)) {\n\t\t\t\tused.insert(i);\n\t\t\t\tn /= i;\n\t\t\t\tbreak;\n\t\t\t}\n\t\t}\n\t\tfor (int i = 2; i * i <= n; ++i) {\n\t\t\tif (n % i == 0 && !used.count(i)) {\n\t\t\t\tused.insert(i);\n\t\t\t\tn /= i;\n\t\t\t\tbreak;\n\t\t\t}\n\t\t}\n\t\tif (int(used.size()) < 2 || used.count(n) || n == 1) {\n\t\t\tcout << \"NO\" << endl;\n\t\t} else {\n\t\t\tcout << \"YES\" << endl;\n\t\t\tused.insert(n);\n\t\t\tfor (auto it : used) cout << it << \" \";\n\t\t\tcout << endl;\n\t\t}\n\t}\n\t\n\treturn 0;\n}"
    },
    "order": 16
  },
  {
    "id": "1285B",
    "contestId": 1285,
    "index": "B",
    "title": "Just Eat It!",
    "rating": 1300,
    "url": "https://codeforces.com/problemset/problem/1285/B",
    "tags": [
      "dp",
      "greedy",
      "implementation"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1285B+Just%20Eat%20It!+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n#define finish(x) return cout << x << endl, 0\n#define ll long long\n\nint n;\nvector <int> a;\n\nbool solve(){\n    cin >> n;\n    a.resize(n);\n    for(auto &i : a) cin >> i;\n    ll sum = 0;\n    for(int i = 0 ; i < n ; i++){\n        sum += a[i];\n        if(sum <= 0) return 0;\n    }\n    sum = 0;\n    for(int i = n - 1 ; i >= 0 ; i--){\n        sum += a[i];\n        if(sum <= 0) return 0;\n    }\n    return 1;\n}\nint main(){\n    ios_base::sync_with_stdio(0);\n    cin.tie(0);\n    int tt;\n    cin >> tt;\n    while(tt--){\n        if(solve()) cout << \"YES\\n\";\n        else cout << \"NO\\n\";\n    }\n}"
    },
    "order": 17
  },
  {
    "id": "1237B",
    "contestId": 1237,
    "index": "B",
    "title": "Balanced Tunnel",
    "rating": 1300,
    "url": "https://codeforces.com/problemset/problem/1237/B",
    "tags": [
      "data structures",
      "sortings",
      "two pointers"
    ],
    "hint": "Notice that as the right pointer expands, the left pointer only needs to move forward. Maintain frequency counts or window invariants to keep the window valid in O(N) overall.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1237B+Balanced%20Tunnel+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nint main()\n{\n    ios::sync_with_stdio(false);\n    cin.tie(0);\n    int n;\n    cin >> n;\n    vector<int> a(n), b(n);\n    for (int i = 0; i < n; i++)\n    {26. WOW Factor\n        cin >> a[i];\n        --a[i];\n    }\n    for (int i = 0; i < n; i++)\n    {\n        cin >> b[i];\n        --b[i];\n    }\n    vector<int> pos(n);\n    for (int i = 0; i < n; i++)\n    {\n        pos[b[i]] = i;\n    }\n    vector<int> c(n);\n    for (int i = 0; i < n; i++)\n    {\n        c[i] = pos[a[i]];\n    }\n    int mx = -1, ans = 0;\n    for (int i = 0; i < n; i++)\n    {\n        if (c[i] > mx)\n        {\n            mx = c[i];\n        }\n        else\n        {\n            ++ans;\n        }\n    }\n    cout << ans << '\\n';\n    return 0;\n}"
    },
    "order": 18
  },
  {
    "id": "1178B",
    "contestId": 1178,
    "index": "B",
    "title": "WOW Factor",
    "rating": 1300,
    "url": "https://codeforces.com/problemset/problem/1178/B",
    "tags": [
      "dp",
      "strings"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1178B+WOW%20Factor+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\n#define fastio() ios::sync_with_stdio(false); cin.tie(nullptr);\nusing ll = long long;\n#define endl '\\n'\n\nint main() {\n    fastio();\n\n    string s;\n    cin >> s;\n    ll a = 0, b = 0, c = 0;\n    for (int i=0; i<s.size(); i++) {\n        if (s[i] == 'o') b+=a;\n        else if (i > 0 &&  s[i-1] == 'v'){\n            a++;\n            c+=b;\n        } \n\n    }\n    cout << c << endl;\n    return 0;\n}"
    },
    "order": 19
  },
  {
    "id": "1119B",
    "contestId": 1119,
    "index": "B",
    "title": "Alyona and a Narrow Fridge",
    "rating": 1300,
    "url": "https://codeforces.com/problemset/problem/1119/B",
    "tags": [
      "binary search",
      "flows",
      "greedy",
      "sortings"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1119B+Alyona%20and%20a%20Narrow%20Fridge+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n\tint n, h;\n\tcin >> n >> h;\n\tvector<int> v(n);\n\tfor (int i = 0; i < n; i++)\n\t\tcin >> v[i]; // O(n)\n\tint low = 0, high = n - 1, ans = 0;\n\twhile (low <= high) { \n\t\tint mid = (low + high) >> 1;\n\t\tvector<int> temp;\n\t\tfor (int i = 0; i <= mid; i++)\n\t\t\ttemp.push_back(v[i]);\n\t\tsort(temp.begin(), temp.end());\n\t\tint height_required = 0, p = mid;\n\t\twhile (p >= 0) {\n\t\t\theight_required += temp[p];\n\t\t\tp -= 2;\n\t\t\tif (height_required > h) {\n\t\t\t\tbreak;\n\t\t\t}\n\t\t}\n\t\tif (height_required > h) {\n\t\t\thigh = mid - 1;\n\t\t} else {\n\t\t\tans = mid;\n\t\t\tlow = mid + 1;\n\t\t}\n\t}\ncout << ans + 1 << endl;\n\treturn 0;\n}"
    },
    "order": 20
  },
  {
    "id": "1077C",
    "contestId": 1077,
    "index": "C",
    "title": "Good Array",
    "rating": 1300,
    "url": "https://codeforces.com/problemset/problem/1077/C",
    "tags": [
      "implementation"
    ],
    "hint": "Test small examples by hand, identify invariants preserved under the problem operations, and consider extreme corner cases (e.g. n=1, all equal elements).",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1077C+Good%20Array+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nconst int MAX = 1e6;\n\nint main() {\n\tint n;\n\tcin >> n;\n\tvector<int> a(n);\n\tvector<int> cnt(MAX + 1);\n\tfor (int i = 0; i < n; ++i) {\n\t\tcin >> a[i];\n\t\t++cnt[a[i]];\n\t}\n\tlong long sum = accumulate(a.begin(), a.end(), 0ll);\n\t\n\tvector<int> ans;\n\tfor (int i = 0; i < n; ++i) {\n\t\tsum -= a[i];\n\t\t--cnt[a[i]];\n\t\tif (sum % 2 == 0 && sum / 2 <= MAX && cnt[sum / 2] > 0) {\n\t\t\tans.push_back(i);\n\t\t}\n\t\tsum += a[i];\n\t\t++cnt[a[i]];\n\t}\n\t\n\tcout << ans.size() << endl;\n\tfor (auto it : ans) cout << it + 1 << \" \";\n\tcout << endl;\n\t\n\treturn 0;\n}"
    },
    "order": 21
  },
  {
    "id": "862B",
    "contestId": 862,
    "index": "B",
    "title": "Mahmoud and Ehab and the bipartiteness",
    "rating": 1300,
    "url": "https://codeforces.com/problemset/problem/862/B",
    "tags": [
      "dfs and similar",
      "graphs",
      "trees"
    ],
    "hint": "Represent the input as an adjacency list. Use BFS/DFS traversal to discover reachable components, compute shortest hops in unweighted graphs, or detect bipartite coloring.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+862B+Mahmoud%20and%20Ehab%20and%20the%20bipartiteness+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n \nusing namespace std;\n \nint lev[100005];\nvector<int> adj[100005];\nint n;\n \nvoid dfs(int x,int hi,int pa)\n{\n    int i;\n    lev[x]=hi;\n    for(i=0;i<adj[x].size();i++)\n    {\n        if(adj[x][i]==pa)\n            continue;\n        dfs(adj[x][i],hi+1,x);\n    }\n}\n \nint main()\n{\n    cin >> n;\n    int i;\n    for(i=0;i<n-1;i++)\n    {\n        int x,y;\n        cin >> x >> y;\n        adj[x].push_back(y);\n        adj[y].push_back(x);\n    }\n    dfs(1,0,-1);\n    long long odd=0;\n    for(i=1;i<=n;i++)\n        odd+=(lev[i]%2);\n    cout << odd*(n-odd)-(n-1) << endl;\n}"
    },
    "order": 22
  },
  {
    "id": "1915E",
    "contestId": 1915,
    "index": "E",
    "title": "Romantic Glasses",
    "rating": 1300,
    "url": "https://codeforces.com/problemset/problem/1915/E",
    "tags": [
      "data structures",
      "greedy",
      "math"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1915E+Romantic%20Glasses+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve()\n{\n\tint n;\n\tcin >> n;\n\tvector<int> v(n); \n\tfor (int i = 0; i < n; i++)\n\t\tcin >> v[i];\n\n\tvector<long long int> prefixEven(n, 0), prefixOdd(n, 0);\n\n\n\tprefixEven[0] = v[0];\n\tint flag = 0; \n\tmap<long long int, int> mp; \n\tmp[prefixOdd[0] - prefixEven[0]]++;\n\n\tfor (int i = 1; i < n; i++)\n\t{\n\t\tprefixOdd[i] += prefixOdd[i - 1];\n\t\tprefixEven[i] += prefixEven[i - 1];\n\n\t\tif (i % 2)\n\t\t\tprefixOdd[i] += v[i];\n\t\telse\n\t\t\tprefixEven[i] += v[i];\n\n\t\tmp[prefixOdd[i] - prefixEven[i]]++;\n\n\t\tif (mp[prefixOdd[i] - prefixEven[i]] == 2 || prefixOdd[i] - prefixEven[i] == 0)\n\t\t{\n\t\t\tflag = 1;\n\t\t\tbreak;\n\t\t}\n\t}\n\n\tif (flag)\n\t\tcout << \"YES\" << endl;\n\telse\n\t\tcout << \"NO\" << endl;\n}\n\n\nint32_t main()\n{\n\tint tt;\n\tcin >> tt;\n\twhile (tt--)\n\t{\n\t\tsolve(); \n\t}\n\treturn 0;\n}"
    },
    "order": 23
  },
  {
    "id": "808B",
    "contestId": 808,
    "index": "B",
    "title": "Average Sleep Time",
    "rating": 1300,
    "url": "https://codeforces.com/problemset/problem/808/B",
    "tags": [
      "data structures",
      "implementation",
      "math"
    ],
    "hint": "Speed up operations from O(N) to O(log N) using appropriate containers like std::set, std::map, or a Fenwick/Segment Tree for dynamic range queries and updates.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+808B+Average%20Sleep%20Time+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n\tint n, k;\n\tcin >> n >> k;\n\tvector<int> v(n, 0);\n\n\tlong long total_sum = 0;\n\n\tfor (int i = 0; i < n; i++) { \n\t\tcin >> v[i];\n\t}\n\tlong long sum = 0;\n\tfor (int i = 0; i < k; i++) {\n\t\tsum += v[i];\n\t}\n\ttotal_sum = sum;\n\tint p1 = 0, p2 = k;\n\n\n\twhile (p2 < n) { \n\t\tsum -= v[p1];\n\t\tsum += v[p2];\n\t\ttotal_sum += sum;\n\t\tp1++;\n\t\tp2++;\n\t}\n\tcout << fixed << setprecision(6) << 1.0 * total_sum / (n - k + 1) << endl;\n}"
    },
    "order": 24
  },
  {
    "id": "665C",
    "contestId": 665,
    "index": "C",
    "title": "Simple Strings",
    "rating": 1300,
    "url": "https://codeforces.com/problemset/problem/665/C",
    "tags": [
      "dp",
      "greedy",
      "strings"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+665C+Simple%20Strings+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n\tstring s;\n\tcin >> s;\n\n\tint n = s.size();\n\n\tvector<char> ans(n);\n\n\tans[0] = s[0];\n\n\tfor (int i = 1; i < n; i++) { \n\t\tif (s[i] == ans[i - 1]) {\n\t\t\tfor (char j = 'a'; j <= 'z'; j++) {\n\t\t\t\tif (j != s[i - 1]) {\n\t\t\t\t\tif (i < n - 1 && j != s[i + 1]) {\n\t\t\t\t\t\tans[i] = j;\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t} else if (i == n - 1) {\n\t\t\t\t\t\tans[i] = j;\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t} else {\n\t\t\tans[i] = s[i];\n\t\t}\n\t}\n\n\tfor (int i = 0; i < n; i++)\n\t\tcout << ans[i];\n\tcout << endl;\n\n\treturn 0;\n}"
    },
    "order": 25
  },
  {
    "id": "1881D",
    "contestId": 1881,
    "index": "D",
    "title": "Divide and Equalize",
    "rating": 1300,
    "url": "https://codeforces.com/problemset/problem/1881/D",
    "tags": [
      "math",
      "number theory"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1881D+Divide%20and%20Equalize+editorial",
    "solutionCode": {
      "cpp": "#include<bits/stdc++.h>\nusing namespace std;\nconst int maxv = 1000000;\n\nvoid add_divs(int x, map<int, int>&divs){\n    int i = 2;\n    while(i * i <= x){\n        while (x % i == 0){\n            divs[i]++;\n            x /= i;\n        }\n        i++;\n    }\n    if(x > 1) divs[x]++;\n}\n\nbool solve(){\n    int n;\n    cin >> n;\n    vector<int>a(n);\n    map<int, int> divs;\n    for(int i = 0; i < n; i++) {\n        cin >> a[i];\n        add_divs(a[i], divs);\n    }\n    for(auto e: divs){\n        if(e.second % n != 0) return false;\n    }\n    return true;\n}\n\nint main(){\n    int t;\n    cin >> t;\n    while(t--) {\n        cout << (solve() ? \"YES\" : \"NO\") << \"\\n\";\n    }\n}"
    },
    "order": 26
  },
  {
    "id": "1879C",
    "contestId": 1879,
    "index": "C",
    "title": "Make it Alternating",
    "rating": 1300,
    "url": "https://codeforces.com/problemset/problem/1879/C",
    "tags": [
      "combinatorics",
      "dp",
      "greedy"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1879C+Make%20it%20Alternating+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nconst int MOD = 998'244'353;\n\nvoid upd(int &a, int b) {\n    a = (a * 1LL * b) % MOD;\n}\n\n\nint tt;\nstring s;\n\nint main() {\n\tcin >> tt;\n\tfor (int tc = 0; tc < tt; ++tc) {\n\t    cin >> s;\n\t    int res = 1;\n\t    int k = s.size();\n\t    int n = s.size();\n\t    for (int l = 0; l < n; ) {\n\t        int r = l + 1;\n\t        while(r < n && s[l] == s[r])\n\t            ++r;\n            upd(res, r - l);\n            --k;\n            l = r;\n\t    }\n\t    \n\t    for (int i = 1; i <= k; ++i)\n\t        upd(res, i);\n        cout << k << ' ' << res << endl;\n\t}\n}"
    },
    "order": 27
  },
  {
    "id": "1857D",
    "contestId": 1857,
    "index": "D",
    "title": "Strong Vertices",
    "rating": 1300,
    "url": "https://codeforces.com/problemset/problem/1857/D",
    "tags": [
      "math",
      "sortings",
      "trees"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1857D+Strong%20Vertices+editorial",
    "solutionCode": {
      "cpp": "#include<bits/stdc++.h>\nusing namespace std;\nconst int N=200005;\nint a[N],b[N];\nint main()\n{\n    int t;cin>>t;\n    while(t--)\n    {\n        int n;cin>>n;\n        for(int i=1;i<=n;i++)cin>>a[i];\n        for(int i=1;i<=n;i++)cin>>b[i];\n        int mx=INT_MIN;\n        for(int i=1;i<=n;i++)mx=max(mx,a[i]-b[i]);\n        int c=0;\n        for(int i=1;i<=n;i++)c+=(a[i]-b[i]==mx);\n        cout<<c<<\"\\n\";\n        for(int i=1;i<=n;i++)if(a[i]-b[i]==mx)cout<<i<<' ';\n        cout<<\"\\n\";\n    }\n}"
    },
    "order": 28
  },
  {
    "id": "1846E1",
    "contestId": 1846,
    "index": "E1",
    "title": "Rudolf and Snowflakes (simple version)",
    "rating": 1300,
    "url": "https://codeforces.com/problemset/problem/1846/E1",
    "tags": [
      "brute force",
      "implementation",
      "math"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1846E1+Rudolf%20and%20Snowflakes%20(simple%20version)+editorial",
    "solutionCode": {
      "cpp": "#include<bits/stdc++.h>\n\nusing namespace std;\n\nusing LL = long long;\n\nset<long long> nums;\n\nint main() {\n\n    for (long long k = 2; k <= 1000; ++k) {\n        long long val = 1 + k;\n        long long p = k*k;\n        for (int cnt = 2; cnt <= 20; ++cnt) {\n            val += p;\n            if (val > 1e6) break;\n            nums.insert(val);            \n            p *= k;\n        }\n    }\n\n\n\n    int _ = 0, __ = 1;\n    cin >> __;\n\n    for (int _ = 0; _ < __; ++_) {\n        long long n;\n        cin >> n;\n        \n\n        if (nums.count(n)) cout << \"YES\" << endl;\n        else cout << \"NO\" << endl;\n\n    }\n\n\n    return 0;\n}"
    },
    "order": 29
  },
  {
    "id": "1794C",
    "contestId": 1794,
    "index": "C",
    "title": "Scoring Subsequences",
    "rating": 1300,
    "url": "https://codeforces.com/problemset/problem/1794/C",
    "tags": [
      "binary search",
      "greedy",
      "math",
      "two pointers"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1794C+Scoring%20Subsequences+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() \n{\n\tios::sync_with_stdio(0);\n\tcin.tie(0);\n\tcout.tie(0);\n\n\tint tt;\n\tcin >> tt; \n\n\twhile (tt--) {\n\t\tint n;\n\t\tcin >> n; \n\n\t\tvector<int> a(n);\n\t\tfor (int i = 0; i < n; i++) {\n\t\t\tcin >> a[i];\n\t\t}\n\n\t\tvector<int> res; 9. Gardener and the Array\n\t\tfor (int i = 0; i < n; i++) {\n\t\t\tint l = 1, r = i + 1;\n\t\t\twhile (l <= r) {\n\t\t\t\tint m = (l + r) / 2;\n\t\t\t\tif (a[i - m + 1] >= m) {\n\t\t\t\t\tl = m + 1; \n\t\t\t\t} else {\n\t\t\t\t\tr = m - 1; \n\t\t\t\t}\n\t\t\t}\n\t\t\tres.push_back(r);\n\t\t}\n\n\t\tfor (auto i : res) {\n\t\t\tcout << i << \" \";\n\t\t}\n\t\tcout << \"\\n\";\n\t}\n\n\treturn 0;\n}"
    },
    "order": 30
  },
  {
    "id": "1775B",
    "contestId": 1775,
    "index": "B",
    "title": "Gardener and the Array",
    "rating": 1300,
    "url": "https://codeforces.com/problemset/problem/1775/B",
    "tags": [
      "bitmasks",
      "constructive algorithms"
    ],
    "hint": "Build a pattern step by step. Look at small examples (n=1, 2, 3) to uncover an invariant or periodic pattern that generalizes to any valid input.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1775B+Gardener%20and%20the%20Array+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\n#define fastio() ios::sync_with_stdio(false); cin.tie(nullptr);\n#define int long long\n#define endl '\\n'\n\nint32_t main() {\n    fastio();\n\n    int tt;\n    cin >> tt;\n    while (tt--) {\n        int n; cin>>n;\n        map<int,int>mp;\n        vector<vector<int>>v;\n        for(int i=0; i<n; i++){\n            int x;\n            cin>>x;\n\n            vector<int>temp(x);\n            for(int j=0; j<x; j++){\n                cin>>temp[j];\n                mp[temp[j]]++;\n            \n            }\n            v.push_back(temp);\n        }\n        string ans = \"No\";\n        for(int i=0; i<n; i++){\n            int f = 1;\n            for(auto it: v[i]){\n                if(mp[it] == 1){\n                    f = 0;\n                    break;\n\n                }\n            }\n            if(f == 1){\n                ans = \"Yes\";\n                break;\n            }\n        }\n        cout<<ans<<\"\\n\";\n\n    }\n    return 0;\n}"
    },
    "order": 31
  },
  {
    "id": "1538C",
    "contestId": 1538,
    "index": "C",
    "title": "Number of Pairs",
    "rating": 1300,
    "url": "https://codeforces.com/problemset/problem/1538/C",
    "tags": [
      "binary search",
      "data structures",
      "math",
      "two pointers"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1538C+Number%20of%20Pairs+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nbool check(long long mid, const vector<long long>& a, int n, long long k) {\n    long long count = 0;\n    for (int i = 0; i < n; i++) {\n        count += mid / a[i];\n    }\n    return count >= k;\n}\n\nvoid solve() {\n    int n;\n    long long k;\n    if (!(cin >> n >> k)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    long long low = 1, high = 1e18, ans = high;\n    while (low <= high) {\n        long long mid = low + (high - low) / 2;\n        if (check(mid, a, n, k)) {\n            ans = mid;\n            high = mid - 1;\n        } else {\n            low = mid + 1;\n        }\n    }\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 32
  },
  {
    "id": "1692F",
    "contestId": 1692,
    "index": "F",
    "title": "3SUM",
    "rating": 1300,
    "url": "https://codeforces.com/problemset/problem/1692/F",
    "tags": [
      "brute force",
      "math"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1692F+3SUM+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 33
  },
  {
    "id": "1850F",
    "contestId": 1850,
    "index": "F",
    "title": "We Were Both Children",
    "rating": 1300,
    "url": "https://codeforces.com/problemset/problem/1850/F",
    "tags": [
      "brute force",
      "implementation",
      "math",
      "number theory"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1850F+We%20Were%20Both%20Children+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 34
  },
  {
    "id": "1955C",
    "contestId": 1955,
    "index": "C",
    "title": "Inhabitant of the Deep Sea",
    "rating": 1300,
    "url": "https://codeforces.com/problemset/problem/1955/C",
    "tags": [
      "greedy",
      "implementation",
      "math"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1955C+Inhabitant%20of%20the%20Deep%20Sea+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 35
  },
  {
    "id": "1555C",
    "contestId": 1555,
    "index": "C",
    "title": "Coin Rows",
    "rating": 1300,
    "url": "https://codeforces.com/problemset/problem/1555/C",
    "tags": [
      "brute force",
      "constructive algorithms",
      "dp",
      "implementation"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1555C+Coin%20Rows+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    vector<long long> dp(n + 1, 0);\n    for (int i = 0; i < n; i++) {\n        dp[i + 1] = max(dp[i], dp[i] + a[i]);\n    }\n    cout << dp[n] << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 36
  },
  {
    "id": "1999E",
    "contestId": 1999,
    "index": "E",
    "title": "Triple Operations",
    "rating": 1300,
    "url": "https://codeforces.com/problemset/problem/1999/E",
    "tags": [
      "dp",
      "implementation",
      "math"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1999E+Triple%20Operations+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    vector<long long> dp(n + 1, 0);\n    for (int i = 0; i < n; i++) {\n        dp[i + 1] = max(dp[i], dp[i] + a[i]);\n    }\n    cout << dp[n] << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 37
  },
  {
    "id": "1521B",
    "contestId": 1521,
    "index": "B",
    "title": "Nastia and a Good Array",
    "rating": 1300,
    "url": "https://codeforces.com/problemset/problem/1521/B",
    "tags": [
      "constructive algorithms",
      "math",
      "number theory"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1521B+Nastia%20and%20a%20Good%20Array+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 38
  },
  {
    "id": "1829F",
    "contestId": 1829,
    "index": "F",
    "title": "Forever Winter",
    "rating": 1300,
    "url": "https://codeforces.com/problemset/problem/1829/F",
    "tags": [
      "dfs and similar",
      "graphs",
      "math"
    ],
    "hint": "Represent the input as an adjacency list. Use BFS/DFS traversal to discover reachable components, compute shortest hops in unweighted graphs, or detect bipartite coloring.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1829F+Forever%20Winter+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 39
  },
  {
    "id": "1922C",
    "contestId": 1922,
    "index": "C",
    "title": "Closest Cities",
    "rating": 1300,
    "url": "https://codeforces.com/problemset/problem/1922/C",
    "tags": [
      "greedy",
      "implementation",
      "math"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1922C+Closest%20Cities+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 40
  },
  {
    "id": "1660C",
    "contestId": 1660,
    "index": "C",
    "title": "Get an Even String",
    "rating": 1300,
    "url": "https://codeforces.com/problemset/problem/1660/C",
    "tags": [
      "dp",
      "greedy",
      "strings"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1660C+Get%20an%20Even%20String+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    vector<long long> dp(n + 1, 0);\n    for (int i = 0; i < n; i++) {\n        dp[i + 1] = max(dp[i], dp[i] + a[i]);\n    }\n    cout << dp[n] << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 41
  },
  {
    "id": "1943A",
    "contestId": 1943,
    "index": "A",
    "title": "MEX Game 1",
    "rating": 1300,
    "url": "https://codeforces.com/problemset/problem/1943/A",
    "tags": [
      "games",
      "greedy"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1943A+MEX%20Game%201+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 42
  },
  {
    "id": "1980C",
    "contestId": 1980,
    "index": "C",
    "title": "Sofia and the Lost Operations",
    "rating": 1300,
    "url": "https://codeforces.com/problemset/problem/1980/C",
    "tags": [
      "constructive algorithms",
      "greedy"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1980C+Sofia%20and%20the%20Lost%20Operations+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 43
  },
  {
    "id": "1948C",
    "contestId": 1948,
    "index": "C",
    "title": "Arrow Path",
    "rating": 1300,
    "url": "https://codeforces.com/problemset/problem/1948/C",
    "tags": [
      "brute force",
      "constructive algorithms",
      "dfs and similar",
      "dp",
      "graphs",
      "shortest paths"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1948C+Arrow%20Path+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    vector<long long> dp(n + 1, 0);\n    for (int i = 0; i < n; i++) {\n        dp[i + 1] = max(dp[i], dp[i] + a[i]);\n    }\n    cout << dp[n] << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 44
  },
  {
    "id": "1661B",
    "contestId": 1661,
    "index": "B",
    "title": "Getting Zero",
    "rating": 1300,
    "url": "https://codeforces.com/problemset/problem/1661/B",
    "tags": [
      "bitmasks",
      "brute force",
      "dfs and similar",
      "dp",
      "graphs",
      "greedy",
      "shortest paths"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1661B+Getting%20Zero+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    vector<long long> dp(n + 1, 0);\n    for (int i = 0; i < n; i++) {\n        dp[i + 1] = max(dp[i], dp[i] + a[i]);\n    }\n    cout << dp[n] << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 45
  },
  {
    "id": "1618D",
    "contestId": 1618,
    "index": "D",
    "title": "Array and Operations",
    "rating": 1300,
    "url": "https://codeforces.com/problemset/problem/1618/D",
    "tags": [
      "dp",
      "greedy",
      "math"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1618D+Array%20and%20Operations+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    vector<long long> dp(n + 1, 0);\n    for (int i = 0; i < n; i++) {\n        dp[i + 1] = max(dp[i], dp[i] + a[i]);\n    }\n    cout << dp[n] << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 46
  },
  {
    "id": "1676F",
    "contestId": 1676,
    "index": "F",
    "title": "Longest Strike",
    "rating": 1300,
    "url": "https://codeforces.com/problemset/problem/1676/F",
    "tags": [
      "data structures",
      "greedy",
      "implementation",
      "sortings",
      "two pointers"
    ],
    "hint": "Notice that as the right pointer expands, the left pointer only needs to move forward. Maintain frequency counts or window invariants to keep the window valid in O(N) overall.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1676F+Longest%20Strike+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 47
  },
  {
    "id": "1984C1",
    "contestId": 1984,
    "index": "C1",
    "title": "Magnitude (Easy Version)",
    "rating": 1300,
    "url": "https://codeforces.com/problemset/problem/1984/C1",
    "tags": [
      "dp",
      "greedy",
      "math"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1984C1+Magnitude%20(Easy%20Version)+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    vector<long long> dp(n + 1, 0);\n    for (int i = 0; i < n; i++) {\n        dp[i + 1] = max(dp[i], dp[i] + a[i]);\n    }\n    cout << dp[n] << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 48
  },
  {
    "id": "1988C",
    "contestId": 1988,
    "index": "C",
    "title": "Increasing Sequence with Fixed OR",
    "rating": 1300,
    "url": "https://codeforces.com/problemset/problem/1988/C",
    "tags": [
      "bitmasks",
      "constructive algorithms",
      "greedy"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1988C+Increasing%20Sequence%20with%20Fixed%20OR+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 49
  },
  {
    "id": "1873F",
    "contestId": 1873,
    "index": "F",
    "title": "Money Trees",
    "rating": 1300,
    "url": "https://codeforces.com/problemset/problem/1873/F",
    "tags": [
      "binary search",
      "greedy",
      "math",
      "two pointers"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1873F+Money%20Trees+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nbool check(long long mid, const vector<long long>& a, int n, long long k) {\n    long long count = 0;\n    for (int i = 0; i < n; i++) {\n        count += mid / a[i];\n    }\n    return count >= k;\n}\n\nvoid solve() {\n    int n;\n    long long k;\n    if (!(cin >> n >> k)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    long long low = 1, high = 1e18, ans = high;\n    while (low <= high) {\n        long long mid = low + (high - low) / 2;\n        if (check(mid, a, n, k)) {\n            ans = mid;\n            high = mid - 1;\n        } else {\n            low = mid + 1;\n        }\n    }\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 50
  },
  {
    "id": "1931E",
    "contestId": 1931,
    "index": "E",
    "title": "Anna and the Valentine's Day Gift",
    "rating": 1400,
    "url": "https://codeforces.com/problemset/problem/1931/E",
    "tags": [
      "games",
      "greedy",
      "math",
      "sortings"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1931E+Anna%20and%20the%20Valentine's%20Day%20Gift+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n \n#define all(arr) arr.begin(), arr.end()\n \nusing namespace std;\n \nconst int MAXN = 200200;\n \nint n, m;\nstring arr[MAXN];\nint len[MAXN], zrr[MAXN];\n \nvoid build() {\n    memset(zrr, 0, sizeof(*zrr) * n);\n    for (int i = 0; i < n; ++i) {\n        len[i] = arr[i].size();\n        for (auto it = arr[i].rbegin(); it != arr[i].rend() && *it == '0'; ++it) {\n            ++zrr[i];\n        }\n    }\n}\n \nstring solve() {\n    int ans = 0;\n    for (int i = 0; i < n; ++i) {\n        ans += len[i] - zrr[i];\n    }\n    sort(zrr, zrr + n);\n    reverse(zrr, zrr + n);\n    for (int i = 0; i < n; ++i) {\n        if (i & 1) ans += zrr[i];\n    }\n    return (ans - 1 >= m ? \"Sasha\" : \"Anna\");\n}\n \nint main() {\n    int tt; cin >> tt;\n    while (tt--) {\n        cin >> n >> m;\n        for (int i = 0; i < n; ++i)\n            cin >> arr[i];\n        build();\n        cout << solve() << '\\n';\n    }\n}"
    },
    "order": 1
  },
  {
    "id": "1759D",
    "contestId": 1759,
    "index": "D",
    "title": "Make It Round",
    "rating": 1400,
    "url": "https://codeforces.com/problemset/problem/1759/D",
    "tags": [
      "brute force",
      "number theory"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1759D+Make%20It%20Round+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nlong long p2[19];\nlong long p5[19];\n\nvoid solve() {\n\t\tint n, m;\n\t\tcin >> n >> m;\n\n\t\tint c2 = 0, c5 = 0; \n\n\t\tint temp = n;\n\t\twhile (temp % 2 == 0) {\n\t\t\t\tc2++;     \n\t\t\t\ttemp /= 2;\n\t\t}\n\n\t\ttemp = n;\n\t\twhile (temp % 5 == 0) {\n\t\t\t\tc5++;    \n\t\t\t\ttemp /= 5;\n\t\t}\n\t\tfor (int dig = 18; dig >= 0; dig--) {\n\t\t\t\tint extra2 = max(0, dig - c2);\n\t\t\t\tint extra5 = max(0, dig - c5);\n\n\t\t\t\tlong long need = p2[extra2] * p5[extra5];\n\t\t\t\tif (need <= m) {\n\t\t\t\t\t\tint largestK = m - m % need;\n\t\t\t\t\t\tcout << 1LL * largestK * n << '\\n';\n\t\t\t\t\t\treturn;\n\t\t\t\t}\n\t\t}\n}\n\nint main() {\n\t\tcin.sync_with_stdio(false);\n\t\tcin.tie(NULL);\n\t\tcout.tie(NULL);\n\n\t\tp2[0] = 1;\n\t\tp5[0] = 1;\n\t\tfor (int i = 1; i <= 18; i++) {\n\t\t\t\tp2[i] = 2 * p2[i - 1];\n\t\t\t\tp5[i] = 5 * p5[i - 1];\n\t\t}\n\n\t\tint tt;\n\t\tcin >> tt;\n\t\twhile (tt--) {\n\t\t\t\tsolve();\n\t\t}\n}"
    },
    "order": 2
  },
  {
    "id": "1714E",
    "contestId": 1714,
    "index": "E",
    "title": "Add Modulo 10",
    "rating": 1400,
    "url": "https://codeforces.com/problemset/problem/1714/E",
    "tags": [
      "brute force",
      "math",
      "number theory"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1714E+Add%20Modulo%2010+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n\t\tint n;\n\t\tcin >> n;\n\t\tint a[n];\n\t\tfor (int i = 0; i < n; i++) {\n\t\t\t\tcin >> a[i];\n\t\t}\n\t\tfor (int i = 0; i < n; i++) {\n\t\t\t\tif (a[i] % 2 == 1) {\n\t\t\t\t\t\ta[i] += a[i] % 10; \n\t\t\t\t}\n\t\t}\n\t\tif (count(a, a + n, a[0]) == n) { \n\t\t\t\tcout << \"YES\\n\";\n\t\t\t\treturn;\n\t\t}\n\n\t\tfor (int i = 0; i < n; i++) {\n\t\t\t\tif (a[i] % 10 == 0) { \n\t\t\t\t\t\tcout << \"NO\\n\";\n\t\t\t\t\t\treturn;\n\t\t\t\t}\n\t\t}\n\t\tfor (int i = 0; i < n; i++) {\n\t\t\t\twhile (a[i] % 10 != 2) { \n\t\t\t\t\t\ta[i] += a[i] % 10;\n\t\t\t\t}\n\t\t\t\ta[i] %= 20;\n\t\t}\n\n\t\tif (count(a, a + n, a[0]) == n) {\n\t\t\t\tcout << \"YES\\n\";\n\t\t\t\treturn;\n\t\t} else {\n\t\t\t\tcout << \"NO\\n\";\n\t\t}\n}\n\nint main() {\n\t\tcin.sync_with_stdio(false);\n\t\tcin.tie(NULL);\n\t\tcout.tie(NULL);\n\n\t\tint tt;\n\t\tcin >> tt;\n\n\t\twhile (tt--) {\n\t\t\t\tsolve();\n\t\t}\n}"
    },
    "order": 3
  },
  {
    "id": "1701C",
    "contestId": 1701,
    "index": "C",
    "title": "Schedule Management",
    "rating": 1400,
    "url": "https://codeforces.com/problemset/problem/1701/C",
    "tags": [
      "binary search",
      "greedy",
      "implementation",
      "two pointers"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1701C+Schedule%20Management+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvector<int> fr; \nbool check(int n, int m, int t) {\n\t\tlong long maxPossible = 0; \n\t\tfor (int i = 0; i < n; i++) {\n\t\t\t\tif (t < fr[i]) {\n\t\t\t\t\t\tmaxPossible += t;\n\t\t\t\t} else {\n\t\t\t\t\t\tmaxPossible += fr[i] + (t - fr[i]) / 2;\n\t\t\t\t}\n\t\t}\n\n\t\treturn maxPossible >= m;\n}\n\nvoid solve() {\n\t\tint n, m;\n\t\tcin >> n >> m;\n\t\tfr.assign(n, 0); \n\n\t\tfor (int i = 0; i < m; i++) {\n\t\t\t\tint temp;\n\t\t\t\tcin >> temp;\n\t\t\t\tfr[temp - 1]++; \n\t\t}\n\n\t\tint low = 0, high = 2 * m; \n\t\twhile (low < high) {\n\t\t\t\tint mid = (low + high) / 2;\n\t\t\t\tif (check(n, m, mid)) {\n\t\t\t\t\t\thigh = mid; \n\t\t\t\t} else {\n\t\t\t\t\t\tlow = mid + 1; \n\t\t\t\t}\n\t\t}\n\n\t\tcout << low << '\\n'; \n}\n\nint main() {\n\t\tcin.sync_with_stdio(false);\n\t\tcin.tie(NULL);\n\t\tcout.tie(NULL);\n\n\t\tint tt;\n\t\tcin >> tt;\n\n\t\twhile (tt--) {\n\t\t\t\tsolve();\n\t\t}\n}"
    },
    "order": 4
  },
  {
    "id": "1648A",
    "contestId": 1648,
    "index": "A",
    "title": "Weird Sum",
    "rating": 1400,
    "url": "https://codeforces.com/problemset/problem/1648/A",
    "tags": [
      "combinatorics",
      "data structures",
      "geometry",
      "math",
      "matrices",
      "sortings"
    ],
    "hint": "Speed up operations from O(N) to O(log N) using appropriate containers like std::set, std::map, or a Fenwick/Segment Tree for dynamic range queries and updates.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1648A+Weird%20Sum+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nconst int MAX_COLOUR = 100000;\n\nlong long calculateSumOfAllPairs(vector<int>& v) {\n\t\tsort(v.begin(), v.end(), greater<>());\n\t\tint n = v.size();\n\n\t\tlong long sum = 0;\n\n\t\tfor (int i = 0, j = n - 1; i < n; i++, j -= 2) {\n\t\t\t\tsum += 1LL * j * v[i];\n\t\t}\n\n\t\treturn sum;\n}\n\nint main() {\n\t\tios::sync_with_stdio(false);\n\t\tcin.tie(nullptr);\n\n\t\tint n, m;\n\t\tcin >> n >> m;\n\n\tint a[n][m];\n\tfor (int i = 0; i < n; i++) {\n\t\t\tfor (int j = 0; j < m; j++) {\n\t\t\t\t\tcin >> a[i][j];\n\t\t\t\t\ta[i][j]--;\n\t\t\t}\n\t}\n\n\tvector<vector<int>> x(MAX_COLOUR);\n\tvector<vector<int>> y(MAX_COLOUR);\n\n\tfor (int i = 0; i < n; i++) {\n\t\t\tfor (int j = 0; j < m; j++) {\n\t\t\t\t\tx[a[i][j]].push_back(i);\n\t\t\t\t\ty[a[i][j]].push_back(j);\n\t\t\t}\n\t}\n\n\tlong long ans = 0;\n\n\tfor (int colour = 0; colour < MAX_COLOUR; colour++) {\n\t\t\tans += calculateSumOfAllPairs(x[colour]);\n\t\t\tans += calculateSumOfAllPairs(y[colour]);\n\t}\n\n\tcout << ans;\n}"
    },
    "order": 5
  },
  {
    "id": "1634B",
    "contestId": 1634,
    "index": "B",
    "title": "Fortune Telling",
    "rating": 1400,
    "url": "https://codeforces.com/problemset/problem/1634/B",
    "tags": [
      "implementation",
      "number theory"
    ],
    "hint": "Notice that both (x + a) and (x ^ a) have the exact same parity: (x + a) % 2 == (x ^ a) % 2. Thus, the final parity after all n operations depends solely on the initial parity and the sum of array elements.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1634B+Fortune%20Telling+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    long long x, y;\n    if (!(cin >> n >> x >> y)) return;\n    long long sum = 0;\n    for (int i = 0; i < n; i++) {\n        long long a;\n        cin >> a;\n        sum += a;\n    }\n    if ((x + sum) % 2 == y % 2) {\n        cout << \"Alice\\n\";\n    } else {\n        cout << \"Bob\\n\";\n    }\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 6
  },
  {
    "id": "1520E",
    "contestId": 1520,
    "index": "E",
    "title": "Arranging The Sheep",
    "rating": 1400,
    "url": "https://codeforces.com/problemset/problem/1520/E",
    "tags": [
      "greedy",
      "math"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1520E+Arranging%20The%20Sheep+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n\t\tint n;\n\t\tcin >> n;\n\t\tstring s;\n\t\tcin >> s;\n\n\t\tvector<int> sheeps;\n\n\t\tfor (int i = 0; i < n; i++) {\n\t\t\t\tif (s[i] == '*') {\n\t\t\t\t\t\tsheeps.push_back(i);\n\t\t\t\t}\n\t\t}\n\n\t\tint index = (sheeps.size() - 1) / 2;\n\n\t\tlong long ans = 0;\n\n\t\tfor (int i = 0; i < sheeps.size(); i++) {\n\t\t\t\tans += abs(sheeps[i] - (sheeps[index] - index + i));\n\t\t}\n\n\t\tcout << ans << '\\n';\n}\n\nint main() {\n\t\tcin.sync_with_stdio(false);\n\t\tcin.tie(NULL);\n\t\tcout.tie(NULL);\n\n\t\tint tt;\n\t\tcin >> tt;\n\n\t\twhile (tt--) {\n\t\t\t\tsolve();\n\t\t}\n}"
    },
    "order": 7
  },
  {
    "id": "1519C",
    "contestId": 1519,
    "index": "C",
    "title": "Berland Regional",
    "rating": 1400,
    "url": "https://codeforces.com/problemset/problem/1519/C",
    "tags": [
      "brute force",
      "data structures",
      "greedy",
      "number theory",
      "sortings"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1519C+Berland%20Regional+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n\t\tint n; \n\t\tcin >> n;\n\n\t\tvector<int> u(n), s(n);\n\t\tfor (int i = 0; i < n; i++) cin >> u[i];\n\t\tfor (int i = 0; i < n; i++) cin >> s[i];\n\n\t\tvector<vector<int>> skills(n);\n\t\tfor (int i = 0; i < n; i++) {\n\t\t\tskills[u[i] - 1].push_back(s[i]);\n\t\t}\n\n\t\tfor (auto &v : skills) {\n\t\t\tsort(v.begin(), v.end());\n\t\t}\n\n\t\tvector<vector<long long>> pre(n, vector<long long>(1, 0));\n\t\tfor (int i = 0; i < n; i++) {\n\t\t\tfor (int j = 0; j < (int)skills[i].size(); j++) {\n\t\t\t\tpre[i].push_back(pre[i].back() + skills[i][j]);\n\t\t\t}\n\t\t}\n\n\t\tvector<long long> ans(n + 1);\n\t\tfor (int i = 0; i < n; i++) {\n\t\t\tint nums = (int)skills[i].size();\n\t\t\tfor (int k = 1; k <= nums; k++) {\n\t\t\t\tans[k] += pre[i].back() - pre[i][nums % k];\n\t\t\t}\n\t\t}\n\n\t\tfor (int i = 1; i <= n; i++) cout << ans[i] << ' ';\n\t\tcout << '\\n';\n}\n\nint main() {\n\t\tcin.tie(0);\n\t\tcout.tie(0);\n\t\tcin.sync_with_stdio(false);\n\n\t\tint tt; \n\t\tcin >> tt;\n\t\twhile (tt--) {\n\t\t\tsolve();\n\t\t}\n}"
    },
    "order": 8
  },
  {
    "id": "1513B",
    "contestId": 1513,
    "index": "B",
    "title": "AND Sequences",
    "rating": 1400,
    "url": "https://codeforces.com/problemset/problem/1513/B",
    "tags": [
      "bitmasks",
      "combinatorics",
      "constructive algorithms",
      "math"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1513B+AND%20Sequences+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nconst int N = 200000;\nconst int MOD = 1000000007;\nint fact[N + 1];\n\nvoid solve() {\n\t\tint n;\n\t\tcin >> n;\n\t\tint a[n];\n\t\tfor (int i = 0; i < n; i++) {\n\t\t\t\tcin >> a[i];\n\t\t}\n\n\t\tint totalAnd = a[0];\n\t\tfor (int i = 1; i < n; i++) {\n\t\t\t\ttotalAnd &= a[i];\n\t\t}\n\n\t\tint countAnd = count(a, a + n, totalAnd);\n\t\tif (countAnd <= 1) {\n\t\t\t\tcout << 0 << \"\\n\";\n\t\t\t\treturn;\n\t\t}\n\n\t\tcout << 1LL * countAnd * (countAnd - 1) % MOD * fact[n - 2] % MOD << '\\n';\n}\n\nint main() {\n\t\tios_base::sync_with_stdio(false);\n\t\tcin.tie(nullptr);\n\t\tcout.tie(nullptr);\n\n\t\tfact[0] = 1;\n\t\tfor (int i = 1; i <= N; i++) {\n\t\t\t\tfact[i] = (1LL * fact[i - 1] * i) % MOD;\n\t\t}\n\n\t\tint tt;\n\t\tcin >> tt;\n\t\twhile (tt--) {\n\t\t\t\tsolve();\n\t\t}\n}"
    },
    "order": 9
  },
  {
    "id": "1475C",
    "contestId": 1475,
    "index": "C",
    "title": "Ball in Berland",
    "rating": 1400,
    "url": "https://codeforces.com/problemset/problem/1475/C",
    "tags": [
      "combinatorics",
      "graphs",
      "math"
    ],
    "hint": "Represent the input as an adjacency list. Use BFS/DFS traversal to discover reachable components, compute shortest hops in unweighted graphs, or detect bipartite coloring.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1475C+Ball%20in%20Berland+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\nusing ll = long long;\nusing ld = long double;\n\nvoid solve() {\n  int A, B, k;\n  cin >> A >> B >> k;\n  vector<int> a(A), b(B);\n  vector<pair<int, int>> edges(k);\n  for (auto &[x, y] : edges) {\n    cin >> x;\n  }\n  for (auto &[x, y] : edges) {\n    cin >> y;\n  }\n  for (auto &[x, y] : edges) {\n    x--;\n    y--;\n    a[x]++;\n    b[y]++;\n  }\n  ll ans = 0;\n  for (auto &[x, y] : edges) {\n    ans += k - a[x] - b[y] + 1;\n  }\n  cout << ans / 2 << \"\\n\";\n}\n\nint main() {\n  int tt;\n  cin >> tt;\n  while (tt--) {\n    solve();\n  }\n}"
    },
    "order": 10
  },
  {
    "id": "1919C",
    "contestId": 1919,
    "index": "C",
    "title": "Grouping Increases",
    "rating": 1400,
    "url": "https://codeforces.com/problemset/problem/1919/C",
    "tags": [
      "data structures",
      "dp",
      "greedy"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1919C+Grouping%20Increases+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h> \nusing namespace std;\n\nconst int INF = 1000000005;\nconst int MAXN = 200005;\n\nint t;\nint n;\nint a[MAXN];\n\nint main() {\n    ios::sync_with_stdio(0), cin.tie(0);\n    cin >> t;\n    while (t--) {\n        cin >> n;\n        for (int i = 1; i <= n; i++) {\n            cin >> a[i];\n        }\n        int t1 = INF, t2 = INF;\n        int ans = 0;\n        for (int i = 1; i <= n; i++) {\n            if (t1 > t2) {\n                swap(t1, t2);\n            }\n            if (a[i] <= t1) {\n                t1 = a[i];\n            } else if (a[i] <= t2) {\n                t2 = a[i];\n            } else {\n                t1 = a[i];\n                ans++;\n            }\n        }\n        cout << ans << '\\n';\n    }\n}"
    },
    "order": 11
  },
  {
    "id": "1374D",
    "contestId": 1374,
    "index": "D",
    "title": "Zero Remainder Array",
    "rating": 1400,
    "url": "https://codeforces.com/problemset/problem/1374/D",
    "tags": [
      "math",
      "sortings",
      "two pointers"
    ],
    "hint": "Notice that as the right pointer expands, the left pointer only needs to move forward. Maintain frequency counts or window invariants to keep the window valid in O(N) overall.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1374D+Zero%20Remainder%20Array+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nint main() {\n\tint tt;\n\tcin >> tt;\n\twhile (tt--) {\n\t\tint n, k;\n\t\tcin >> n >> k;\n\t\tvector<int> a(n);\n\t\tfor (auto &it : a) cin >> it;\n\t\tmap<int, int> cnt;\n\t\tint mx = 0;\n\t\tfor (auto &it : a) {\n\t\t\tif (it % k == 0) continue;\n\t\t\t++cnt[k - it % k];\n\t\t\tmx = max(mx, cnt[k - it % k]);\n\t\t}\n\t\tlong long ans = 0;\n\t\tfor (auto [key, value] : cnt) {\n\t\t\tif (value == mx) {\n\t\t\t\tans = k * 1ll * (value - 1) + key + 1;\n\t\t\t}\n\t\t}\n\t\tcout << ans << endl;\n\t}\n\t\n\treturn 0;\n}"
    },
    "order": 12
  },
  {
    "id": "1362C",
    "contestId": 1362,
    "index": "C",
    "title": "Johnny and Another Rating Drop",
    "rating": 1400,
    "url": "https://codeforces.com/problemset/problem/1362/C",
    "tags": [
      "bitmasks",
      "greedy",
      "math"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1362C+Johnny%20and%20Another%20Rating%20Drop+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\ntypedef long long LL;\n\nvoid solve(){\n\tLL a;\n\tscanf(\"%lld\", &a);\n\t\n\tLL ans = 0;\n\tfor(int i = 0; i < 60; ++i)\n\t\tif(a & (1LL << i))\n\t\t\tans += (1LL << (i + 1)) - 1;\n\tprintf(\"%lld\\n\", ans);\n}\n\nint main(){\n\tint quest;\n\tscanf(\"%d\", &quest);\n\t\n\twhile(quest--)\n\t\tsolve();\n\treturn 0;\n}"
    },
    "order": 13
  },
  {
    "id": "1350B",
    "contestId": 1350,
    "index": "B",
    "title": "Orac and Models",
    "rating": 1400,
    "url": "https://codeforces.com/problemset/problem/1350/B",
    "tags": [
      "dp",
      "math",
      "number theory"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1350B+Orac%20and%20Models+editorial",
    "solutionCode": {
      "cpp": "#include <iostream>\n#include <cstdlib>\n#include <cstdio>\n#include <cstring>\n#include <algorithm>\n\nusing namespace std;\nconst int MAXN = 500005;\ninline int readint()\n{\n\tint res = 0;\n\tchar c = 0;\n\twhile(!isdigit(c))\n\t\tc = getchar();\n\twhile(isdigit(c))\n\t\tres = res*10+c-'0', c = getchar();\n\treturn res;\t\n}\nint n,a[MAXN],f[MAXN];\n\nint main()\n{\n\tint T = readint();\n\twhile(T--)\n\t{\n\t\tn = readint();\n\t\tfor(int i = 1; i<=n; i++)\n\t\t\ta[i] = readint();\n\t\tfor(int i = 1; i<=n; i++)\n\t\t\tf[i] = 1;\n\t\tfor(int i = 1; i<=n; i++) \n\t\t\tfor(int j = i*2; j<=n; j += i)\n\t\t\t\tif(a[i]<a[j])\n\t\t\t\t\tf[j] = max(f[j],f[i]+1);\n\t\tint ans = 0;\n\t\tfor(int i = 1; i<=n; i++)\n\t\t\tans = max(ans,f[i]);\n\t\tcout << ans << endl;\n\t}\n\treturn 0;\n}"
    },
    "order": 14
  },
  {
    "id": "1320A",
    "contestId": 1320,
    "index": "A",
    "title": "Journey Planning",
    "rating": 1400,
    "url": "https://codeforces.com/problemset/problem/1320/A",
    "tags": [
      "data structures",
      "dp",
      "greedy",
      "math",
      "sortings"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1320A+Journey%20Planning+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n\t\tint n;\n\t\tcin >> n;\n\n\t\tint b[n];\n\t\tfor (int i = 0; i < n; i++) {\n\t\t\t\tcin >> b[i];\n\t\t}\n\nmap<int, long long> poss;\n\n\tfor (int i = 0; i < n; i++) {\n\t\t\tposs[i - b[i]] += b[i];\n\t}\n\n\tlong long ans = 0;\n\tfor (auto [key, sum] : poss) {\n\t\t\tans = max(ans, sum);\n\t\t}\n\n\t\tcout << ans << '\\n';\n}\n\nint main() {\n\t\tcin.sync_with_stdio(false);\n\t\tcin.tie(NULL);\n\t\tcout.tie(NULL);\n\n\t\tsolve();\n}"
    },
    "order": 15
  },
  {
    "id": "1215B",
    "contestId": 1215,
    "index": "B",
    "title": "The Number of Products",
    "rating": 1400,
    "url": "https://codeforces.com/problemset/problem/1215/B",
    "tags": [
      "combinatorics",
      "dp",
      "implementation"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1215B+The%20Number%20of%20Products+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nvoid solve() {\n\t\tint n;\n\t\tcin >> n;\n\t\tint arr[n];\n\t\tfor (int i = 0; i < n; i++) {\n\t\t\t\tcin >> arr[i];\n\t\t}\n\n\tint odd = 0, even = 1;\n\tbool cur = 0;\n\tlong long ans = 0;\n\n\tfor (int i = 0; i < n; i++) {\n\t\t\tif (arr[i] < 0) cur = 1 - cur;\n\n\t\t\tif (cur == 0) {\n\t\t\t\t\t\tans += even;\n\t\t\t\t\t\teven++;\n\t\t\t\t} else {\n\t\t\t\t\t\tans += odd;\n\t\t\t\t\t\todd++;\n\t\t\t\t}\n\t\t}\n\n\t\tcout << 1LL * n * (n + 1) / 2 - ans << ' ' << ans << '\\n';\n}\n\nint main() {\n\t\tcin.sync_with_stdio(false);\n\t\tcin.tie(NULL);\n\t\tcout.tie(NULL);\n\n\t\tsolve();\n}"
    },
    "order": 16
  },
  {
    "id": "1195C",
    "contestId": 1195,
    "index": "C",
    "title": "Basketball Exercise",
    "rating": 1400,
    "url": "https://codeforces.com/problemset/problem/1195/C",
    "tags": [
      "dp"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1195C+Basketball%20Exercise+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nvoid solve() {\n\t\tint n;\n\t\tcin >> n;\n\n\t\tint a[n], b[n];\n\t\tfor (int i = 0; i < n; i++) {\n\t\t\t\tcin >> a[i];\n\t\t}\n\t\tfor (int i = 0; i < n; i++) {\n\t\t\t\tcin >> b[i];\n\t\t}\n\n\t\tlong long dp1[n], dp2[n];\n\t\tdp1[0] = a[0];\n\t\tdp2[0] = b[0];\n\n\t\tfor (int i = 1; i < n; i++) {\n\t\t\t\tdp1[i] = max(dp1[i - 1], dp2[i - 1] + a[i]);\n\t\t\t\tdp2[i] = max(dp2[i - 1], dp1[i - 1] + b[i]);\n\t\t}\n\n\t\tcout << max(dp1[n - 1], dp2[n - 1]) << '\\n';\n}\n\nint main() {\n\t\tcin.sync_with_stdio(false);\n\t\tcin.tie(NULL);\n\t\tcout.tie(NULL);\n\n\t\tsolve();\n}"
    },
    "order": 17
  },
  {
    "id": "1183D",
    "contestId": 1183,
    "index": "D",
    "title": "Candy Box (easy version)",
    "rating": 1400,
    "url": "https://codeforces.com/problemset/problem/1183/D",
    "tags": [
      "greedy",
      "sortings"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1183D+Candy%20Box%20(easy%20version)+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nvoid solve() {\n\t\tint n;\n\t\tcin >> n;\n\n\t\tint fr[n]{};\n\t\tfor (int i = 0; i < n; i++) {\n\t\t\t\tint temp;\n\t\t\t\tcin >> temp;\n\t\t\t\tfr[temp - 1]++;\n\t\t}\n\n\t\tsort(fr, fr + n, greater<>());\n\n\t\tint last = INT_MAX;\n\t\tlong long ans = 0;\n\t\tfor (int i = 0; i < n && last > 0; i++) {\n\t\t\t\tif (fr[i] >= last) {\n\t\t\t\t\t\tans += last - 1;\n\t\t\t\t\t\tlast--;\n\t\t\t\t} else {\n\t\t\t\t\t\tans += fr[i];\n\t\t\t\t\t\tlast = fr[i];\n\t\t\t\t}\n\t\t}\n\n\t\tcout << ans << '\\n';\n}\n\nint main() {\n\t\tcin.sync_with_stdio(false);\n\t\tcin.tie(NULL);\n\t\tcout.tie(NULL);\n\n\t\tint tt;\n\t\tcin >> tt;\n\t\twhile (tt--) {\n\t\t\t\tsolve();\n\t\t}\n}"
    },
    "order": 18
  },
  {
    "id": "1167C",
    "contestId": 1167,
    "index": "C",
    "title": "News Distribution",
    "rating": 1400,
    "url": "https://codeforces.com/problemset/problem/1167/C",
    "tags": [
      "dfs and similar",
      "dsu",
      "graphs"
    ],
    "hint": "Represent the input as an adjacency list. Use BFS/DFS traversal to discover reachable components, compute shortest hops in unweighted graphs, or detect bipartite coloring.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1167C+News%20Distribution+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nvector<int> parent, sz;\n\nint find(int a) {\n\t\tif (a == parent[a]) return a;\n\t\treturn parent[a] = find(parent[a]);\n}\n\nvoid join(int a, int b) {\n\t\ta = find(a);\n\t\tb = find(b);\n\t\tif (a == b) return;\n\t\tif (sz[a] < sz[b]) swap(a, b);\n\t\tparent[b] = a;\n\t\tsz[a] += sz[b];\n}\n\nvoid solve() {\n\t\tint n, m;\n\t\tcin >> n >> m;\n\n\t\tparent.resize(n);\n\t\tfor (int i = 0; i < n; i++) parent[i] = i;\n\t\tsz.resize(n, 1);\n\n\t\tfor (int i = 0; i < m; i++) {\n\t\t\t\tint k;\n\t\t\t\tcin >> k;\n\t\t\t\tif (k > 0) {\n\t\t\t\t\t\tint first;\n\t\t\t\t\t\tcin >> first;\n\t\t\t\t\t\tfirst--;\n\t\t\t\t\t\tfor (int j = 1; j < k; j++) {\n\t\t\t\t\t\t\t\tint a;\n\t\t\t\t\t\t\t\tcin >> a;\n\t\t\t\t\t\t\t\ta--;\n\t\t\t\t\t\t\t\tjoin(first, a);\n\t\t\t\t\t\t}\n\t\t\t\t}\n\t\t}\n\n\t\tfor (int i = 0; i < n; i++) {\n\t\t\t\tcout << sz[find(i)] << ' ';\n\t\t}\n}\n\nint main() {\n\t\tcin.sync_with_stdio(false);\n\t\tcin.tie(nullptr);\n\t\tcout.tie(nullptr);\n\n\t\tsolve();\n}"
    },
    "order": 19
  },
  {
    "id": "1167B",
    "contestId": 1167,
    "index": "B",
    "title": "Lost Numbers",
    "rating": 1400,
    "url": "https://codeforces.com/problemset/problem/1167/B",
    "tags": [
      "brute force",
      "divide and conquer",
      "interactive",
      "math"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1167B+Lost%20Numbers+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nint query(int i, int j) {\n\t\tcout << \"? \" << i + 1 << ' ' << j + 1 << endl;\n\t\tint ans;\n\t\tcin >> ans;\n\t\treturn ans;\n}\n\nint common(pair<int, int> a, pair<int, int> b) {\n\t\tif (a.first == b.first || a.first == b.second) return a.first;\n\t\telse return a.second;\n}\n\nint other(pair<int, int> p, int a) {\n\t\tif (p.first == a) return p.second;\n\t\telse return p.first;\n}\n\nvoid solve() {\n\t\tvector<int> arr = {4, 8, 15, 16, 23, 42};\n\t\tint n = arr.size();\n\n\t\tmap<int, pair<int, int>> m;\n\t\tfor (int i = 0; i < n; i++) {\n\t\t\t\tfor (int j = i + 1; j < n; j++) {\n\t\t\t\t\t\tm[arr[i] * arr[j]] = {arr[i], arr[j]};\n\t\t\t\t}\n\t\t}\n\n\t\tvector<int> ans(6);\n\n\t\tauto p1 = m[query(0, 1)];\n\t\tauto p2 = m[query(1, 2)];\n\t\tans[1] = common(p1, p2);\n\t\tans[0] = other(p1, ans[1]);\n\t\tans[2] = other(p2, ans[1]);\n\n\n\t\tp1 = m[query(3, 4)];\n\t\tp2 = m[query(4, 5)];\n\tans[4] = common(p1, p2);\n\t\tans[3] = other(p1, ans[4]);\n\t\tans[5] = other(p2, ans[4]);\n\n\t\tcout << \"! \";\n\t\tfor (auto x : ans) {\n\t\t\t\tcout << x << ' ';\n\t\t}\n\t\tcout << endl;\n}\n\nint main() {\n\t\tsolve();\n}"
    },
    "order": 20
  },
  {
    "id": "1143C",
    "contestId": 1143,
    "index": "C",
    "title": "Queen",
    "rating": 1400,
    "url": "https://codeforces.com/problemset/problem/1143/C",
    "tags": [
      "dfs and similar",
      "trees"
    ],
    "hint": "Represent the input as an adjacency list. Use BFS/DFS traversal to discover reachable components, compute shortest hops in unweighted graphs, or detect bipartite coloring.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1143C+Queen+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n\t\tint n;\n\t\tcin >> n;\n\t\tvector<bool> good(n); \n\t\tvector<vector<int>> adj(n); \n\t\tfor (int i = 0; i < n; i++) {\n\t\t\t\tint parent, type;\n\t\t\t\tcin >> parent >> type;\n\t\t\t\tif (type == 0) good[i] = true; \n\t\t\t\tif (parent != -1) {\n\t\t\t\t\t\tadj[parent - 1].push_back(i); \n\t\t\t\t}\n\t\t}\n\n\t\tvector<int> ans; \n\t\tfor (int i = 0; i < n; i++) { \n\t\t\t\tif (good[i]) continue; \n\t\t\t\tbool flag = true; \n\t\t\t\tfor (auto x : adj[i]) {\n\t\t\t\t\t\tif (good[x]) flag = false; \n\t\t\t\t}\n\t\t\t\tif (flag) ans.push_back(i + 1); \n\t\t}\n\n\t\tif (ans.size()) {\n\t\t\t\tfor (auto x : ans) {\n\t\t\t\t\t\tcout << x << ' ';\n\t\t\t\t}\n\t\t\t\tcout << '\\n';\n\t\t} else {\n\t\t\t\tcout << -1 << '\\n'; \n\t\t}\n}\n\nint main() {\n\t\tcin.sync_with_stdio(false);\n\t\tcin.tie(NULL);\n\t\tcout.tie(NULL);\n\t\tint tt = 1;\n\t\twhile (tt--) {\n\t\t\tsolve();\n\t\t}\n}"
    },
    "order": 21
  },
  {
    "id": "1907D",
    "contestId": 1907,
    "index": "D",
    "title": "Jumping Through Segments",
    "rating": 1400,
    "url": "https://codeforces.com/problemset/problem/1907/D",
    "tags": [
      "binary search",
      "constructive algorithms"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1907D+Jumping%20Through%20Segments+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nint segmentStart[200000], segmentEnd[200000];\n\nbool isReachableWithJump(int segmentCount, int maxJump)\n{\n\tint currentMinPosition = 0;\n\tint currentMaxPosition = 0;\n\n\tfor (int i = 0; i < segmentCount; i++)\n\t{\n\t\tcurrentMaxPosition += maxJump;\n\t\tcurrentMinPosition -= maxJump;\n\n\t\tint reachableStart = max(currentMinPosition, segmentStart[i]);\n\t\tint reachableEnd = min(currentMaxPosition, segmentEnd[i]);\n\n\t\tif (reachableStart > reachableEnd)\n\t\t{\n\t\t\treturn false;\n\t\t}\n\n\t\tcurrentMinPosition = reachableStart;\n\t\tcurrentMaxPosition = reachableEnd;\n\t}\n\n\treturn true;\n}\n\nvoid solveTestCase()\n{\n\tint segmentCount;\n\tcin >> segmentCount;\n\n\tfor (int i = 0; i < segmentCount; i++)\n\t{\n\t\tcin >> segmentStart[i] >> segmentEnd[i];\n\t}\n\n\tint low = 0, high = 1e9;\n\n\twhile (low < high)\n\t{\n\t\tint mid = (low + high) / 2;\n\t\tif (isReachableWithJump(segmentCount, mid))\n\t\t{\n\t\t\thigh = mid;\n\t\t}\n\t\telse\n\t\t{\n\t\t\tlow = mid + 1;\n\t\t}\n\t}\n\n\tcout << low << '\\n';\n}\n\nint main()\n{\n\tint tt;\n\tcin >> tt;\n\n\tfor (int testCase = 0; testCase < tt; testCase++)\n\t{\n\t\tsolveTestCase();\n\t}\n}"
    },
    "order": 22
  },
  {
    "id": "1110B",
    "contestId": 1110,
    "index": "B",
    "title": "Tape",
    "rating": 1400,
    "url": "https://codeforces.com/problemset/problem/1110/B",
    "tags": [
      "greedy",
      "sortings"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1110B+Tape+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n\t\tint n, m, k;\n\t\tcin >> n >> m >> k;\n\n\t\tint a[n];\n\t\tfor (int i = 0; i < n; i++) {\n\t\t\t\tcin >> a[i];\n\t\t}\n\n\t\tsort(a, a + n);\n\n\t\tint diff[n - 1];\n\t\tfor (int i = 0; i < n - 1; i++) {\n\t\t\t\tdiff[i] = a[i + 1] - a[i] - 1;\n\t\t}\n\n\t\tsort(diff, diff + n - 1);\n\n\t\tint ans = n;\n\t\tfor (int i = 0; i < n - k; i++) {\n\t\t\t\tans += diff[i];\n\t\t}\n\n\t\tcout << ans << '\\n';\n}\n\nint main() {\n\t\tcin.sync_with_stdio(false);\n\t\tcin.tie(NULL);\n\t\tcout.tie(NULL);\n\n\t\tsolve();\n}"
    },
    "order": 23
  },
  {
    "id": "414B",
    "contestId": 414,
    "index": "B",
    "title": "Mashmokh and ACM",
    "rating": 1400,
    "url": "https://codeforces.com/problemset/problem/414/B",
    "tags": [
      "combinatorics",
      "dp",
      "number theory"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+414B+Mashmokh%20and%20ACM+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nconst int MOD = 1000000007;\n\nint main() {\n\tint n, k;\n\tcin >> n >> k;\n\n\tvector<int> factors[n + 1];\n\tfor (int i = 1; i <= n; i++) {\n\t\tfor (int j = 1; j * j <= i; j++) {\n\t\t\tif (i % j == 0) {\n\t\t\t\tfactors[i].push_back(j);\n\t\t\t\tif (i / j != j) {\n\t\t\t\t\tfactors[i].push_back(i / j);\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n\n\tint dp[k + 1][n + 1];\n\n\tfor (int i = 1; i <= n; i++) {\n\t\tdp[1][i] = 1;\n\t}\n\n\tfor (int i = 2; i <= k; i++) {\n\t\tfor (int j = 1; j <= n; j++) {\n\t\t\tdp[i][j] = 0;\n\t\t\tfor (auto x : factors[j]) {\n\t\t\t\tdp[i][j] = (dp[i][j] + dp[i - 1][x]) % MOD;\n\t\t\t}\n\t\t}\n\t}\n\n\tint ans = 0;\n\tfor (int i = 1; i <= n; i++) {\n\t\tans = (ans + dp[k][i]) % MOD;\n\t}\n\n\tcout << ans << endl;\n}"
    },
    "order": 24
  },
  {
    "id": "1076G",
    "contestId": 1076,
    "index": "G",
    "title": "Array Game",
    "rating": 1400,
    "url": "https://codeforces.com/problemset/problem/1076/G",
    "tags": [
      "data structures",
      "games"
    ],
    "hint": "Speed up operations from O(N) to O(log N) using appropriate containers like std::set, std::map, or a Fenwick/Segment Tree for dynamic range queries and updates.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1076G+Array%20Game+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\n#define int long long\n \nsigned main() {\n    int tt;\n    cin >> tt;\n    while (tt--) {\n        int n, k;\n        cin >> n >> k;\n        vector<int> a(n);\n        for (int i = 0; i < n; i++) cin >> a[i];\n        if (k >= 3) {\n            cout << 0 << endl;\n            continue;\n        }\n        sort(begin(a), end(a));\n        int d = a[0];\n        for (int i = 0; i < n - 1; i++) d = min(d, a[i + 1] - a[i]);\n        if (k == 1) {\n            cout << d << endl;\n            continue;\n        }\n        for (int i = 0; i < n; i++) for (int j = 0; j < i; j++) {\n            int v = a[i] - a[j];\n            int p = lower_bound(begin(a), end(a), v) - begin(a);\n            if (p < n) d = min(d, a[p] - v);\n            if (p > 0) d = min(d, v - a[p - 1]);\n        }\n        cout << d << endl;\n    }\n}"
    },
    "order": 25
  },
  {
    "id": "1883G1",
    "contestId": 1883,
    "index": "G1",
    "title": "Dances (Easy version)",
    "rating": 1400,
    "url": "https://codeforces.com/problemset/problem/1883/G1",
    "tags": [
      "binary search",
      "greedy",
      "two pointers"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1883G1+Dances%20(Easy%20version)+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nbool check(int ops, vector<int> a, vector<int> b) {\n\tfor (int i = 0; i < ops; i++) {\n\t\ta.pop_back();\n\t\tb.pop_back();\n\t}\n\treverse(b.begin(), b.end());\n\tfor (int i = 0; i < (int)a.size(); i++) {\n\t\tif (a[i] >= b[i]) {\n\t\t\treturn false;\n\t\t}\n\t}\n\treturn true;\n}\n\nvoid solve() {\n\tint n, m;\n\tcin >> n >> m;\n\n\tvector<int> a(n), b(n);\n\ta[0] = 1;\n\tfor (int i = 1; i < n; i++) {\n\t\tcin >> a[i];\n\t}\n\tfor (int i = 0; i < n; i++) {\n\t\tcin >> b[i];\n\t}\n\tsort(a.begin(), a.end());                \n\tsort(b.begin(), b.end(), greater<>());   \n\tint low = 0, high = n;\n\twhile (low < high) {\n\t\tint mid = (low + high) / 2;\n\t\tif (check(mid, a, b)) { \n\t\t\thigh = mid;\n\t\t} else {\n\t\t\tlow = mid + 1;\n\t\t}\n\t}\n\n\tcout << low << '\\n';\n}\n\nint main() {\n\tcin.sync_with_stdio(false);\n\tcin.tie(nullptr);\n\n\tint tt;\n\tcin >> tt;\n\twhile (tt--) {\n\t\tsolve();\n\t}\n}"
    },
    "order": 26
  },
  {
    "id": "1878E",
    "contestId": 1878,
    "index": "E",
    "title": "Iva & Pav",
    "rating": 1400,
    "url": "https://codeforces.com/problemset/problem/1878/E",
    "tags": [
      "binary search",
      "bitmasks",
      "data structures",
      "greedy"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1878E+Iva%20%26%20Pav+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nusing ll = long long;\n \n \nconst int N =200003;\nconst int bits=30;\nint pref[N][bits];\nint a[N];\nvoid Buildprefix(int n){\n    for(int i=0; i< n; i++){\n        for(int j=0; j<30; j++){\n            if(a[i]&(1<<j)){\n                pref[i+1][j]=pref[i][j]+1;\n            }\n            else{\n                pref[i+1][j]=pref[i][j];\n            }\n        }\n    }\n}\nvoid solve(){\n    int n;\n    cin >> n;\n    for(int i=0; i< n; i++){\n        cin >> a[i];\n    }\n    Buildprefix(n);\n    int q;\n    cin >> q;\n    while(q--){\n        int l, k;\n        cin >> l >> k;\n        if(a[l-1]<k){\n            cout << -1 << '\\n';\n            continue;\n        }\n        int lo=l;\n        int hi=n;\n        int ans=l;\n        while(lo<=hi){\n            int s=(lo+hi)/2;\n            int num=0;\n            for(int j=0; j< bits; j++){\n                if(pref[s][j]-pref[l-1][j]==s-l+1){\n                    num+=(1<<j);\n                }\n            }\n            if(num>=k){\n                lo=s+1;\n                ans=max(ans, s);\n            }\n            else hi=s-1;\n        }\n        cout << ans << '\\n';\n    }\n}\n \nint main(){\n    int tt = 1;\n    cin >> tt;\n    while(tt--){\n        solve();\n    }\n}"
    },
    "order": 27
  },
  {
    "id": "1837D",
    "contestId": 1837,
    "index": "D",
    "title": "Bracket Coloring",
    "rating": 1400,
    "url": "https://codeforces.com/problemset/problem/1837/D",
    "tags": [
      "constructive algorithms",
      "greedy"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1837D+Bracket%20Coloring+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n \nusing namespace std;\n\nint main()\n{\n    ios_base::sync_with_stdio(0);\n    cin.tie(0);\n    int t;\n    cin >> t;\n    for(int i = 0; i < t; i++)\n    {\n        int n;\n        cin >> n;\n        string s;\n        cin >> s;\n        vector<int> bal(n + 1);\n        for(int j = 0; j < n; j++)\n            if(s[j] == '(')\n                bal[j + 1] = bal[j] + 1;\n            else\n                bal[j + 1] = bal[j] - 1;\n\n        if(bal.back() != 0)\n            cout << -1 << endl;\n        else\n        {\n            if(*min_element(bal.begin(), bal.end()) == 0 || *max_element(bal.begin(), bal.end()) == 0)\n            {\n                cout << 1 << endl;\n                for(int j = 0; j < n; j++)\n                {\n                    if(j) cout << \" \";\n                    cout << 1;\n                }\n                cout << endl;\n            }\n            else\n            {\n                cout << 2 << endl;\n                vector<int> ans;\n                int cur = 0;\n                while(cur < n)\n                {\n                    int w = (s[cur] == '(' ? 1 : 2);\n                    do\n                    {\n                        cur++;\n                        ans.push_back(w);\n                    }\n                    while(bal[cur] != 0);\n                }\n                for(int j = 0; j < n; j++)\n                {\n                    if(j) cout << \" \";\n                    cout << ans[j];\n                }\n                cout << endl;\n            }\n        }\n    }    \n}"
    },
    "order": 28
  },
  {
    "id": "1830A",
    "contestId": 1830,
    "index": "A",
    "title": "Copil Copac Draws Trees",
    "rating": 1400,
    "url": "https://codeforces.com/problemset/problem/1830/A",
    "tags": [
      "dfs and similar",
      "dp",
      "graphs",
      "trees"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1830A+Copil%20Copac%20Draws%20Trees+editorial",
    "solutionCode": {
      "cpp": "#include<bits/stdc++.h>\n\nusing namespace std;\nconst int NMAX = 2e5+5;\nint dp[NMAX], id[NMAX];\nvector<pair<int,int>> edg[NMAX];\nvoid dfs(int u){\n    for(auto it : edg[u]){\n        if(dp[it.first] == 0){\n            dp[it.first] = dp[u] + (it.second <= id[u]);\n            id[it.first] = it.second;\n            dfs(it.first);\n        }\n    }\n}\nvoid tc(){\n    int n;\n    cin>>n;\n    for(int i=1; i<=n; i++) dp[i] = id[i] = 0, edg[i].clear();\n    for(int i=1; i<n; i++){\n        int u,v;\n        cin>>u>>v;\n        edg[u].push_back({v,i});\n        edg[v].push_back({u,i});\n    }\n    dp[1] = 1;\n    dfs(1);\n    int ans = 0;\n    for(int i=1; i<=n; i++) ans=max(ans,dp[i]);\n    cout<<ans<<'\\n';\n}\nint main()\n{\n    ios_base::sync_with_stdio(false);\n    int tt;\n    cin>>tt;\n    while(tt--)\n        tc();\n    return 0;\n}"
    },
    "order": 29
  },
  {
    "id": "1771B",
    "contestId": 1771,
    "index": "B",
    "title": "Hossam and Friends",
    "rating": 1400,
    "url": "https://codeforces.com/problemset/problem/1771/B",
    "tags": [
      "binary search",
      "constructive algorithms",
      "dp",
      "two pointers"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1771B+Hossam%20and%20Friends+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n\t\tint n, m;\n\t\tcin >> n >> m;\n\t\tvector<int> nearestEnemy(n + 1, 0);\n\n\t\tfor (int i = 0; i < m; i++) {\n\t\t\t\tint a, b;\n\t\t\t\tcin >> a >> b;\n\t\t\t\tif (a > b) swap(a, b);             \n\t\t\t\tnearestEnemy[b] = max(nearestEnemy[b], a); \n\t\t}\n\n\t\tvector<int> maxLeft(n + 1);\n\n\t\tmaxLeft[1] = 1; \n\n\t\tlong long ans = 1; \n\n\t\tfor (int i = 2; i <= n; i++) {\n\t\t\t\tmaxLeft[i] = max(maxLeft[i - 1], nearestEnemy[i] + 1);\n\t\t\t\tans += i - maxLeft[i] + 1;\n\t\t}\n\n\t\tcout << ans << '\\n';\n}\n\nint main() {\n\t\tcin.sync_with_stdio(false);\n\t\tcin.tie(NULL);\n\t\tcout.tie(NULL);\n\n\t\tint t;\n\t\tcin >> tt;\n\t\twhile (tt--) {\n\t\t\t\tsolve();\n\t\t}\n}"
    },
    "order": 30
  },
  {
    "id": "1526B",
    "contestId": 1526,
    "index": "B",
    "title": "I Hate 1111",
    "rating": 1400,
    "url": "https://codeforces.com/problemset/problem/1526/B",
    "tags": [
      "dp",
      "math",
      "number theory"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1526B+I%20Hate%201111+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    vector<long long> dp(n + 1, 0);\n    for (int i = 0; i < n; i++) {\n        dp[i + 1] = max(dp[i], dp[i] + a[i]);\n    }\n    cout << dp[n] << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 31
  },
  {
    "id": "1692G",
    "contestId": 1692,
    "index": "G",
    "title": "2^Sort",
    "rating": 1400,
    "url": "https://codeforces.com/problemset/problem/1692/G",
    "tags": [
      "data structures",
      "dp",
      "sortings",
      "two pointers"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1692G+2%5ESort+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    vector<long long> dp(n + 1, 0);\n    for (int i = 0; i < n; i++) {\n        dp[i + 1] = max(dp[i], dp[i] + a[i]);\n    }\n    cout << dp[n] << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 32
  },
  {
    "id": "1506D",
    "contestId": 1506,
    "index": "D",
    "title": "Epic Transformation",
    "rating": 1400,
    "url": "https://codeforces.com/problemset/problem/1506/D",
    "tags": [
      "constructive algorithms",
      "data structures",
      "greedy"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1506D+Epic%20Transformation+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 33
  },
  {
    "id": "1904C",
    "contestId": 1904,
    "index": "C",
    "title": "Array Game",
    "rating": 1400,
    "url": "https://codeforces.com/problemset/problem/1904/C",
    "tags": [
      "binary search",
      "brute force",
      "data structures",
      "sortings",
      "two pointers"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1904C+Array%20Game+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nbool check(long long mid, const vector<long long>& a, int n, long long k) {\n    long long count = 0;\n    for (int i = 0; i < n; i++) {\n        count += mid / a[i];\n    }\n    return count >= k;\n}\n\nvoid solve() {\n    int n;\n    long long k;\n    if (!(cin >> n >> k)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    long long low = 1, high = 1e18, ans = high;\n    while (low <= high) {\n        long long mid = low + (high - low) / 2;\n        if (check(mid, a, n, k)) {\n            ans = mid;\n            high = mid - 1;\n        } else {\n            low = mid + 1;\n        }\n    }\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 34
  },
  {
    "id": "1634B",
    "contestId": 1634,
    "index": "B",
    "title": "Fortune Telling",
    "rating": 1400,
    "url": "https://codeforces.com/problemset/problem/1634/B",
    "tags": [
      "bitmasks",
      "math"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1634B+Fortune%20Telling+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 35
  },
  {
    "id": "1989C",
    "contestId": 1989,
    "index": "C",
    "title": "Two Movies",
    "rating": 1400,
    "url": "https://codeforces.com/problemset/problem/1989/C",
    "tags": [
      "greedy",
      "math"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1989C+Two%20Movies+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 36
  },
  {
    "id": "1974C",
    "contestId": 1974,
    "index": "C",
    "title": "Beautiful Triple Pairs",
    "rating": 1400,
    "url": "https://codeforces.com/problemset/problem/1974/C",
    "tags": [
      "combinatorics",
      "data structures"
    ],
    "hint": "Speed up operations from O(N) to O(log N) using appropriate containers like std::set, std::map, or a Fenwick/Segment Tree for dynamic range queries and updates.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1974C+Beautiful%20Triple%20Pairs+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 37
  },
  {
    "id": "1624D",
    "contestId": 1624,
    "index": "D",
    "title": "Palindromes Coloring",
    "rating": 1400,
    "url": "https://codeforces.com/problemset/problem/1624/D",
    "tags": [
      "binary search",
      "greedy",
      "sortings",
      "strings"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1624D+Palindromes%20Coloring+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nbool check(long long mid, const vector<long long>& a, int n, long long k) {\n    long long count = 0;\n    for (int i = 0; i < n; i++) {\n        count += mid / a[i];\n    }\n    return count >= k;\n}\n\nvoid solve() {\n    int n;\n    long long k;\n    if (!(cin >> n >> k)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    long long low = 1, high = 1e18, ans = high;\n    while (low <= high) {\n        long long mid = low + (high - low) / 2;\n        if (check(mid, a, n, k)) {\n            ans = mid;\n            high = mid - 1;\n        } else {\n            low = mid + 1;\n        }\n    }\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 38
  },
  {
    "id": "1932C",
    "contestId": 1932,
    "index": "C",
    "title": "LR-remainders",
    "rating": 1400,
    "url": "https://codeforces.com/problemset/problem/1932/C",
    "tags": [
      "brute force",
      "data structures",
      "implementation",
      "math",
      "two pointers"
    ],
    "hint": "Notice that as the right pointer expands, the left pointer only needs to move forward. Maintain frequency counts or window invariants to keep the window valid in O(N) overall.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1932C+LR-remainders+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 39
  },
  {
    "id": "2009D",
    "contestId": 2009,
    "index": "D",
    "title": "Satyam and Counting",
    "rating": 1400,
    "url": "https://codeforces.com/problemset/problem/2009/D",
    "tags": [
      "geometry",
      "math"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+2009D+Satyam%20and%20Counting+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 40
  },
  {
    "id": "1955D",
    "contestId": 1955,
    "index": "D",
    "title": "Inaccurate Subsequence Search",
    "rating": 1400,
    "url": "https://codeforces.com/problemset/problem/1955/D",
    "tags": [
      "data structures",
      "two pointers"
    ],
    "hint": "Notice that as the right pointer expands, the left pointer only needs to move forward. Maintain frequency counts or window invariants to keep the window valid in O(N) overall.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1955D+Inaccurate%20Subsequence%20Search+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 41
  },
  {
    "id": "1605C",
    "contestId": 1605,
    "index": "C",
    "title": "Dominant Character",
    "rating": 1400,
    "url": "https://codeforces.com/problemset/problem/1605/C",
    "tags": [
      "brute force",
      "greedy",
      "implementation",
      "strings"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1605C+Dominant%20Character+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 42
  },
  {
    "id": "1515C",
    "contestId": 1515,
    "index": "C",
    "title": "Phoenix and Towers",
    "rating": 1400,
    "url": "https://codeforces.com/problemset/problem/1515/C",
    "tags": [
      "constructive algorithms",
      "data structures",
      "greedy"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1515C+Phoenix%20and%20Towers+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 43
  },
  {
    "id": "1772D",
    "contestId": 1772,
    "index": "D",
    "title": "Absolute Sorting",
    "rating": 1400,
    "url": "https://codeforces.com/problemset/problem/1772/D",
    "tags": [
      "constructive algorithms",
      "math"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1772D+Absolute%20Sorting+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 44
  },
  {
    "id": "1923C",
    "contestId": 1923,
    "index": "C",
    "title": "Find B",
    "rating": 1400,
    "url": "https://codeforces.com/problemset/problem/1923/C",
    "tags": [
      "constructive algorithms",
      "greedy"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1923C+Find%20B+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 45
  },
  {
    "id": "2020C",
    "contestId": 2020,
    "index": "C",
    "title": "Bitwise Balancing",
    "rating": 1400,
    "url": "https://codeforces.com/problemset/problem/2020/C",
    "tags": [
      "bitmasks",
      "hashing",
      "implementation",
      "math",
      "schedules",
      "ternary search"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+2020C+Bitwise%20Balancing+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 46
  },
  {
    "id": "1579D",
    "contestId": 1579,
    "index": "D",
    "title": "Productive Meeting",
    "rating": 1400,
    "url": "https://codeforces.com/problemset/problem/1579/D",
    "tags": [
      "constructive algorithms",
      "graphs",
      "greedy"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1579D+Productive%20Meeting+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 47
  },
  {
    "id": "2033C",
    "contestId": 2033,
    "index": "C",
    "title": "Sakurako's Field Trip",
    "rating": 1400,
    "url": "https://codeforces.com/problemset/problem/2033/C",
    "tags": [
      "dp",
      "greedy",
      "two pointers"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+2033C+Sakurako's%20Field%20Trip+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    vector<long long> dp(n + 1, 0);\n    for (int i = 0; i < n; i++) {\n        dp[i + 1] = max(dp[i], dp[i] + a[i]);\n    }\n    cout << dp[n] << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 48
  },
  {
    "id": "2009E",
    "contestId": 2009,
    "index": "E",
    "title": "Klee's SUPER DUPER LARGE Array!!!",
    "rating": 1400,
    "url": "https://codeforces.com/problemset/problem/2009/E",
    "tags": [
      "binary search",
      "math",
      "ternary search"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+2009E+Klee's%20SUPER%20DUPER%20LARGE%20Array!!!+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nbool check(long long mid, const vector<long long>& a, int n, long long k) {\n    long long count = 0;\n    for (int i = 0; i < n; i++) {\n        count += mid / a[i];\n    }\n    return count >= k;\n}\n\nvoid solve() {\n    int n;\n    long long k;\n    if (!(cin >> n >> k)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    long long low = 1, high = 1e18, ans = high;\n    while (low <= high) {\n        long long mid = low + (high - low) / 2;\n        if (check(mid, a, n, k)) {\n            ans = mid;\n            high = mid - 1;\n        } else {\n            low = mid + 1;\n        }\n    }\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 49
  },
  {
    "id": "1986D",
    "contestId": 1986,
    "index": "D",
    "title": "Mathematical Problem",
    "rating": 1400,
    "url": "https://codeforces.com/problemset/problem/1986/D",
    "tags": [
      "brute force",
      "dp",
      "greedy",
      "implementation",
      "math",
      "two pointers"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1986D+Mathematical%20Problem+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    vector<long long> dp(n + 1, 0);\n    for (int i = 0; i < n; i++) {\n        dp[i + 1] = max(dp[i], dp[i] + a[i]);\n    }\n    cout << dp[n] << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 50
  },
  {
    "id": "1915F",
    "contestId": 1915,
    "index": "F",
    "title": "Greetings",
    "rating": 1500,
    "url": "https://codeforces.com/problemset/problem/1915/F",
    "tags": [
      "data structures",
      "divide and conquer",
      "sortings"
    ],
    "hint": "Speed up operations from O(N) to O(log N) using appropriate containers like std::set, std::map, or a Fenwick/Segment Tree for dynamic range queries and updates.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1915F+Greetings+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n#include <ext/pb_ds/assoc_container.hpp>\n#include <ext/pb_ds/tree_policy.hpp>\nusing namespace __gnu_pbds;\nusing namespace std;\n\n#define Oset tree<int, null_type, less<int>, rb_tree_tag, tree_order_statistics_node_update>\n\nint32_t main() {\n\t\tios::sync_with_stdio(false); \n\t\tcin.tie(nullptr);\n\n\t\tint t;\n\t\tcin >> t;\n\t\twhile (t--) {\n\t\t\t\tint n;\n\t\t\t\tcin >> n;\n\t\t\t\tvector<pair<int, int>> vec(n);\n\t\t\t\tfor (int i = 0; i < n; i++) cin >> vec[i].first >> vec[i].second;\n\t\t\t\tsort(vec.begin(), vec.end());\n\n\t\t\t\tOset st;         \n\t\t\t\tlong long ans = 0; \n\n\t\t\t\tfor (int i = 0; i < n; i++) {\n\t\t\t\t\t\tans += i - st.order_of_key(vec[i].second);\n\t\t\t\t\t\tst.insert(vec[i].second);\n\t\t\t\t}\n\n\t\t\t\tcout << ans << '\\n';\n\t\t}\n\n\t\treturn 0;\n}"
    },
    "order": 1
  },
  {
    "id": "1516B",
    "contestId": 1516,
    "index": "B",
    "title": "AGAGA XOOORRR",
    "rating": 1500,
    "url": "https://codeforces.com/problemset/problem/1516/B",
    "tags": [
      "bitmasks",
      "brute force",
      "dp",
      "greedy"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1516B+AGAGA%20XOOORRR+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n\t\tint n;\n\t\tcin >> n;\n\t\tvector<int> a(n);\n\t\tint x = 0;\n\t\tfor (int i = 0; i < n; i++) {\n\t\t\t\tcin >> a[i];\n\t\t\t\tx ^= a[i]; \n\t\t}\n\t\tif (x == 0) { \n\t\t\t\tcout << \"YES\\n\";\n\t\t\t\treturn;\n\t\t}\n\n\t\tint pr = 0, pr_ind = -1;\n\t\tfor (int i = 0; i < n; i++) {\n\t\t\t\tpr ^= a[i];\n\t\t\t\tif (pr == x) {\n\t\t\t\t\t\tpr_ind = i;\n\t\t\t\t\t\tbreak;\n\t\t\t\t}\n\t\t}\n\t\tint suf = 0, suf_ind = -1;\n\t\tfor (int i = n - 1; i >= 0; i--) {\n\t\t\t\tsuf ^= a[i];\n\t\t\t\tif (suf == x) {\n\t\t\t\t\t\tsuf_ind = i;\n\t\t\t\t\t\tbreak;\n\t\t\t\t}\n\t\t}\n\t\tif (suf_ind > pr_ind)\n\t\t\t\tcout << \"YES\\n\";\n\t\telse\n\t\t\t\tcout << \"NO\\n\";\n}\nint32_t main() {\n\t\tios::sync_with_stdio(false);\n\t\tcin.tie(NULL);\n\t\tcout.tie(NULL);\n\n\t\tint tt;\n\t\tcin >> tt;\n\t\twhile (tt--) {\n\t\t\t\tsolve();\n\t\t}\n\n\t\treturn 0;\n}"
    },
    "order": 2
  },
  {
    "id": "1486B",
    "contestId": 1486,
    "index": "B",
    "title": "Eastern Exhibition",
    "rating": 1500,
    "url": "https://codeforces.com/problemset/problem/1486/B",
    "tags": [
      "binary search",
      "geometry",
      "shortest paths",
      "sortings"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1486B+Eastern%20Exhibition+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nlong long solve(vector<int> x) {\n    sort(x.begin(), x.end());\n    return x[x.size() / 2] - x[(x.size() - 1) / 2] + 1;\n}\n\nvoid solve() {\n    int n;\n    cin >> n;\n    vector<int> x(n), y(n);\n    for (int i = 0; i < n; ++i)\n        cin >> x[i] >> y[i];\n    cout << solve(x) * solve(y) << '\\n';\n}\n\nint main() {\n    int tt;\n    cin >> tt;\n    while (tt--) solve();\n    return 0;\n}"
    },
    "order": 3
  },
  {
    "id": "1604A",
    "contestId": 1604,
    "index": "A",
    "title": "Era",
    "rating": 1500,
    "url": "https://codeforces.com/problemset/problem/1604/A",
    "tags": [
      "greedy"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1604A+Era+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\ntypedef long long int LL;\n\nconst int N = 100 * 1000 + 7;\n\nint n;\nint w[N];\nint deg[N];\n\nvoid solve() {\n\tscanf(\"%d\", &n);\n\tfor(int i = 1; i <= n; ++i) {\n\t\tscanf(\"%d\", &w[i]);\n\t\tdeg[i] = 0;\n\t}\n\t\n\tfor(int i = 1; i < n; ++i) {\n\t\tint u, v;\n\t\tscanf(\"%d %d\", &u, &v);\n\t\tdeg[u]++; deg[v]++;\n\t}\n\t\n\tLL ans = 0;\n\tvector <int> to_sort;\n\n\tfor(int i = 1; i <= n; ++i) {\n\t\tfor(int j = 1; j < deg[i]; ++j)\n\t\t\tto_sort.push_back(w[i]);\n\t\tans += w[i];\n\t}\n\t\n\tsort(to_sort.begin(), to_sort.end());\n\treverse(to_sort.begin(), to_sort.end());\n\t\n\tfor(auto &v: to_sort) {\n\t\tprintf(\"%lld \", ans);\n\t\tans += v;\n\t}\n\t\n\tprintf(\"%lld\\n\", ans);\n}\n\nint main() {\n\tint cases;\n\tscanf(\"%d\", &cases);\n\t\n\twhile(cases--)\n\t\tsolve();\n\treturn 0;\n}"
    },
    "order": 4
  },
  {
    "id": "1418C",
    "contestId": 1418,
    "index": "C",
    "title": "Mortal Kombat Tower",
    "rating": 1500,
    "url": "https://codeforces.com/problemset/problem/1418/C",
    "tags": [
      "dp",
      "graphs",
      "greedy",
      "shortest paths"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1418C+Mortal%20Kombat%20Tower+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n\t\tint n;\n\t\tcin >> n;\n\t\tvector<int> a(n + 1);\n\t\tfor (int i = 0; i < n; i++) cin >> a[i];\n\t\tvector<vector<int>> dp(n + 1, vector<int>(2, 0));\n\t\tdp[n][0] = 0;\n\t\tdp[n][1] = 0;\n\t\tdp[n - 1][0] = 0;             \n\t\tdp[n - 1][1] = a[n - 1];          \n\n\t\tfor (int i = n - 2; i >= 0; i--) {\n\t\t\tdp[i][0] = min(dp[i + 1][1], dp[i + 2][1]);\n\t\t\tdp[i][1] = min(\n\t\t\t\tdp[i + 1][0] + a[i],                \n\t\t\t\tdp[i + 2][0] + a[i] + a[i + 1]      \n\t\t\t);\n\t\t}\n\n\t\tcout << dp[0][1] << '\\n';\n}\n\n\nint32_t main() {\n\t\tios::sync_with_stdio(false);\n\t\tcin.tie(NULL);\n\t\tcout.tie(NULL);\n\n\t\tint tt;\n\t\tcin >> tt;\n\t\twhile (tt--) {\n\t\t\tsolve();\n\t\t}\n\n\t\treturn 0;\n}"
    },
    "order": 5
  },
  {
    "id": "1416A",
    "contestId": 1416,
    "index": "A",
    "title": "k-Amazing Numbers",
    "rating": 1500,
    "url": "https://codeforces.com/problemset/problem/1416/A",
    "tags": [
      "binary search",
      "data structures",
      "implementation",
      "two pointers"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1416A+k-Amazing%20Numbers+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n\t\tint n;\n\t\tcin >> n;\n\t\tvector<int> a(n);\n\t\tfor (auto &i : a) cin >> i;\n\n\t\tvector<vector<int>> pos(n + 1); \n\t\tfor (int i = 0; i < n; i++) {\n\t\t\t\tpos[a[i]].push_back(i);\n\t\t}\n\n\t\tvector<int> ans(n, -1); \n\t\tfor (int i = 1; i <= n; i++) {\n\t\t\t\tif (pos[i].empty()) continue;\n\n\t\t\t\n\t\t\t\tint mx = pos[i][0] + 1;\n\t\t\t\tfor (int j = 1; j < (int)pos[i].size(); j++) {\n\t\t\t\t\t\tmx = max(mx, pos[i][j] - pos[i][j - 1]); \n\t\t\t\t}\n\t\t\t\tmx = max(mx, n - pos[i].back()); \n\t\t\t\tfor (int j = mx - 1; j < n; j++) {\n\t\t\t\t\t\tif (ans[j] != -1) break;\n\t\t\t\t\t\tans[j] = i;\n\t\t\t\t}\n\t\t}\n\n\t\tfor (auto i : ans) cout << i << ' ';\n\t\tcout << '\\n';\n}\n\nint32_t main() {\n\t\tios::sync_with_stdio(false);\n\t\tcin.tie(NULL);\n\t\tcout.tie(NULL);\n\n\t\tint tt;\n\t\tcin >> tt;\n\t\twhile (tt--) {\n\t\t\t\tsolve();\n\t\t}\n\n\t\treturn 0;\n}"
    },
    "order": 6
  },
  {
    "id": "1404A",
    "contestId": 1404,
    "index": "A",
    "title": "Balanced Bitstring",
    "rating": 1500,
    "url": "https://codeforces.com/problemset/problem/1404/A",
    "tags": [
      "implementation",
      "strings"
    ],
    "hint": "Track character frequencies, prefixes, or palindrome symmetry. Often checking prefix and suffix matches in linear time avoids costly quadratic nested loops.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1404A+Balanced%20Bitstring+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint n, k, tt;\nstring s;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(nullptr);\n    cin >> tt;\n    while (tt--) {\n        cin >> n >> k >> s;\n        int zer = 0, one = 0;\n        bool chk = true;\n        for (int i = 0; i < k; i++) {\n            int tmp = -1;\n            for (int j = i; j < n; j += k) {\n                if (s[j] != '?') {\n                    if (tmp != -1 && s[j] - '0' != tmp) {\n                        chk = false;\n                        break;\n                    }\n                    tmp = s[j] - '0';\n                }\n            }\n            if (tmp != -1) {\n                (tmp == 0 ? zer : one)++;\n            }\n        }\n        if (max(zer, one) > k / 2) {\n            chk = false;\n        }\n        cout << (chk ? \"YES\\n\" : \"NO\\n\");\n    }\n}"
    },
    "order": 7
  },
  {
    "id": "1338A",
    "contestId": 1338,
    "index": "A",
    "title": "Powered Addition",
    "rating": 1500,
    "url": "https://codeforces.com/problemset/problem/1338/A",
    "tags": [
      "greedy",
      "math"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1338A+Powered%20Addition+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n\tint n;\n\tcin >> n;\n\tvector<int> a(n);\n\tfor (auto &i : a)\n\t\tcin >> i; \n\n\tint mx = 0; \n\tfor (int i = 1; i < n; i++) {\n\t\tif (a[i - 1] > a[i]) { \n\t\t\tmx = max(mx, a[i - 1] - a[i]); \n\t\t\ta[i] = a[i - 1];\n\t\t}\n\t}\n\n\tint ans = 0;\n\tif (mx > 0)\n\t\tans = static_cast<int>(log2(mx)) + 1; \n\n\tcout << ans << '\\n';\n}\n\nint32_t main() {\n\tios::sync_with_stdio(false);\n\tcin.tie(NULL);\n\tcout.tie(NULL);\n\n\tint tt;\n\tcin >> tt; \n\twhile (tt--) {\n\t\tsolve();\n\t}\n\n\treturn 0;\n}"
    },
    "order": 8
  },
  {
    "id": "1332C",
    "contestId": 1332,
    "index": "C",
    "title": "K-Complete Word",
    "rating": 1500,
    "url": "https://codeforces.com/problemset/problem/1332/C",
    "tags": [
      "dfs and similar",
      "dsu",
      "greedy",
      "implementation",
      "strings"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1332C+K-Complete%20Word+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n\t\tint n, k;\n\t\tcin >> n >> k;\n\t\tstring s;\n\t\tcin >> s;\n\n\t\tint ans = 0; \n\t\tfor (int i = 0; i < (k + 1) / 2; i++) { \n\t\t\t\tvector<int> freq(26, 0); \n\t\t\t\tfor (int j = 0; j < n / k; j++) { \n\t\t\t\t\t\tint idx1 = j * k + i; \n\t\t\t\t\t\tint idx2 = (j + 1) * k - i - 1;\n\t\t\t\t\t\tfreq[s[idx1] - 'a']++; \n\t\t\t\t\t\tif (idx1 != idx2) \n\t\t\t\t\t\t\t\tfreq[s[idx2] - 'a']++;\n\t\t\t\t}\n\t\t\t\tint mx = *max_element(freq.begin(), freq.end()); \n\t\t\t\tint s = accumulate(freq.begin(), freq.end(), 0LL);\n\t\t\t\tans += s - mx;\n\t\t}\n\t\tcout << ans << '\\n';\n}\n\nint32_t main() {\n\t\tios::sync_with_stdio(false);\n\t\tcin.tie(NULL);\n\t\tcout.tie(NULL);\n\n\t\tint tt;\n\t\tcin >> tt;\n\t\twhile (tt--) {\n\t\t\t\tsolve();\n\t\t}\n\n\t\treturn 0;\n}"
    },
    "order": 9
  },
  {
    "id": "1325C",
    "contestId": 1325,
    "index": "C",
    "title": "Ehab and Path-etic MEXs",
    "rating": 1500,
    "url": "https://codeforces.com/problemset/problem/1325/C",
    "tags": [
      "constructive algorithms",
      "dfs and similar",
      "greedy",
      "trees"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1325C+Ehab%20and%20Path-etic%20MEXs+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nint32_t main() {\n\t\tios::sync_with_stdio(false);\n\t\tcin.tie(NULL);\n\t\tcout.tie(NULL);\n\n\t\tint n;\n\t\tcin >> n;\n\t\tvector<vector<pair<int, int>>> adj(n + 1); \n\t\tfor (int i = 0; i < n - 1; i++) {\n\t\t\t\tint u, v;\n\t\t\t\tcin >> u >> v;\n\t\t\t\tadj[u].push_back({v, i}); \n\t\t\t\tadj[v].push_back({u, i});\n\t\t}\n\n\t\tvector<int> ans(n - 1, -1); \n\t\tint k = 0; \n\t\tfor (int i = 1; i <= n; i++) {\n\t\t\t\tif (adj[i].size() >= 3) { \n\t\t\t\t\t\tans[adj[i][0].second] = 0;\n\t\t\t\t\t\tans[adj[i][1].second] = 1;\n\t\t\t\t\t\tans[adj[i][2].second] = 2;\n\t\t\t\t\t\tk = 3;  \n\t\t\t\t\t\tbreak;  \n\t\t\t\t}\n\t\t}\n\n\t\tfor (int i = 0; i < n - 1; i++) {\n\t\t\t\tif (ans[i] == -1) {\n\t\t\t\t\t\tans[i] = k++; \n\t\t\t\t}\n\t\t}\n\n\t\tfor (auto x : ans) {\n\t\t\t\tcout << x << '\\n'; \n\t\t}\n\n\t\treturn 0;\n}"
    },
    "order": 10
  },
  {
    "id": "1323B",
    "contestId": 1323,
    "index": "B",
    "title": "Count Subrectangles",
    "rating": 1500,
    "url": "https://codeforces.com/problemset/problem/1323/B",
    "tags": [
      "binary search",
      "greedy",
      "implementation"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1323B+Count%20Subrectangles+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\n#define int long long\n\nint32_t main() {\n\t\tios::sync_with_stdio(false);\n\t\tcin.tie(nullptr);\n\t\tcout.tie(nullptr);\n\n\t\tint n, m, k;\n\t\tcin >> n >> m >> k;\n\t\tvector<int> a(n), b(m);\n\t\tfor (auto &x : a) cin >> x;\n\t\tfor (auto &x : b) cin >> x;\n\n\t\t\n\t\tvector<int> fa(n + 1, 0), fb(m + 1, 0);\n\t\tint c = 0;\n\t\tfor (int i = 0; i < n; i++) {\n\t\t\t\tif (a[i] == 1) {\n\t\t\t\t\t\tc++;\n\t\t\t\t\t\tfa[c]++;\n\t\t\t\t} else {\n\t\t\t\t\t\tc = 0;\n\t\t\t\t}\n\t\t}\n\t\tc = 0;\n\t\tfor (int i = 0; i < m; i++) {\n\t\t\t\tif (b[i] == 1) {\n\t\t\t\t\t\tc++;\n\t\t\t\t\t\tfb[c]++;\n\t\t\t\t} else {\n\t\t\t\t\t\tc = 0;\n\t\t\t\t}\n\t\t}\n\n\t\tfor (int i = n - 1; i > 0; i--) fa[i] += fa[i + 1];\n\t\tfor (int i = m - 1; i > 0; i--) fb[i] += fb[i + 1];\n\n\t\tlong long ans = 0;\n\t\tfor (int i = 1; i * i <= k; i++) {\n\t\t\t\tif (k % i == 0) {\n\t\t\t\t\t\tint j = k / i;\n\n\t\t\t\t\t\tif (i <= n && j <= m) ans += fa[i] * fb[j];\n\t\t\t\t\t\tif (i != j && j <= n && i <= m) ans += fa[j] * fb[i];\n\t\t\t\t}\n\t\t}\n\n\t\tcout << ans << '\\n';\n\t\treturn 0;\n}"
    },
    "order": 11
  },
  {
    "id": "1891C",
    "contestId": 1891,
    "index": "C",
    "title": "Smilo and Monsters",
    "rating": 1500,
    "url": "https://codeforces.com/problemset/problem/1891/C",
    "tags": [
      "binary search",
      "constructive algorithms",
      "greedy",
      "sortings",
      "two pointers"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1891C+Smilo%20and%20Monsters+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\n#define int long long\n\nint32_t main() {\n\t\tios::sync_with_stdio(false);\n\t\tcin.tie(NULL);\n\t\tcout.tie(NULL);\n\n\t\tint t;\n\t\tcin >> t;\n\t\twhile (t--) {\n\t\t\t\tint n;\n\t\t\t\tcin >> n;\n\t\t\t\tvector<int> a(n);\n\t\t\t\tfor (auto &i : a)\n\t\t\t\t\t\tcin >> i;\n\n\t\t\t\tint sum = accumulate(a.begin(), a.end(), 0LL); \n\t\t\t\tint rem = sum / 2; \n\t\t\t\tint ans = sum - rem; \n\n\t\t\t\tsort(a.rbegin(), a.rend());\n\t\t\t\tfor (auto x : a) {\n\t\t\t\t\t\tif (rem <= 0)\n\t\t\t\t\t\t\t\tbreak; \n\t\t\t\t\t\trem -= x; \n\t\t\t\t\t\tans++; \n\t\t\t\t}\n\n\t\t\t\tcout << ans << '\\n';\n\t\t}\n\n\t\treturn 0;\n}"
    },
    "order": 12
  },
  {
    "id": "1201B",
    "contestId": 1201,
    "index": "B",
    "title": "Zero Array",
    "rating": 1500,
    "url": "https://codeforces.com/problemset/problem/1201/B",
    "tags": [
      "greedy",
      "math"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1201B+Zero%20Array+editorial",
    "solutionCode": {
      "cpp": "#include<bits/stdc++.h>\nusing namespace std;\ntypedef long long ll;\nll n, m, a, s;\nint main()\n{\n    ios_base::sync_with_stdio(false);\n    cin>>n;\n    for (ll i=1; i<=n; i++)\n    {\n        cin>>a;\n        s+=a;\n        m=max(m, a);\n    }\n    if (s%2==1 || s<2*m)\n    {\n        cout<<\"NO\";\n        return 0;\n    }\n    cout<<\"YES\";\n    return 0;\n}"
    },
    "order": 13
  },
  {
    "id": "1139C",
    "contestId": 1139,
    "index": "C",
    "title": "Edgy Trees",
    "rating": 1500,
    "url": "https://codeforces.com/problemset/problem/1139/C",
    "tags": [
      "dfs and similar",
      "dsu",
      "graphs",
      "math",
      "trees"
    ],
    "hint": "Represent the input as an adjacency list. Use BFS/DFS traversal to discover reachable components, compute shortest hops in unweighted graphs, or detect bipartite coloring.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1139C+Edgy%20Trees+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n \n#define IOS ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);\n#define endl \"\\n\"\n#define int long long\n\nconst int N = 2e5 + 5;\nconst int MOD = 1e9 + 7;\n\nint pow(int a, int b, int m)\n{\n\tint ans=1;\n\twhile(b)\n\t{\n\t\tif(b&1)\n\t\t\tans=(ans*a)%m;\n\t\tb/=2;\n\t\ta=(a*a)%m;\n\t}\n\treturn ans;\n}\n\nint n, k, sz, ans = 0;\nbool vis[N];\nvector<int> g[N];\n\nvoid dfs(int u)\n{\n\tif(vis[u])\n\t\treturn;\n\tsz++;\n\tvis[u] = 1;\n\tfor(auto &it:g[u])\n\t\tdfs(it);\n}\n\nint32_t main()\n{\n\tIOS;\n\tcin>>n>>k;\n\tint ans = pow(n, k, MOD);\n\tfor(int i=1;i<=n-1;i++)\n\t{\n\t\tint u, v, x;\n\t\tcin>>u>>v>>x;\n\t\tif(x == 0)\n\t\t\tg[u].push_back(v), g[v].push_back(u);\n\t}\n\tfor(int i=1;i<=n;i++)\n\t{\n\t\tif(vis[i])\n\t\t\tcontinue;\n\t\tsz = 0;\n\t\tdfs(i);\n\t\tans -= pow(sz, k, MOD);\n\t\tans += MOD;\n\t\tans %= MOD;\n\t}\n\tcout<<ans;\n\treturn 0;\n}"
    },
    "order": 14
  },
  {
    "id": "1133D",
    "contestId": 1133,
    "index": "D",
    "title": "Zero Quantity Maximization",
    "rating": 1500,
    "url": "https://codeforces.com/problemset/problem/1133/D",
    "tags": [
      "hashing",
      "math",
      "number theory"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1133D+Zero%20Quantity%20Maximization+editorial",
    "solutionCode": {
      "cpp": "#include<bits/stdc++.h>\n\nusing namespace std;\n\n#define x first\n#define y second\n\nconst int N = 200043;\n\nvoid norm(pair<int, int>& p)\n{\n\tif(p.x < 0)\n\t{\n\t\tp.x *= -1;\n\t\tp.y *= -1;\n\t}\n\telse if (p.x == 0 && p.y < 0)\n\t{\n\t\tp.y *= -1;\n\t}\n\tint d = __gcd(abs(p.x), abs(p.y));\n\tp.x /= d;\n\tp.y /= d;\n}\n\nmap<pair<int, int>, int> m;\n\nint a[N];\nint b[N];\nint n;\n\nint main()\n{\n\tscanf(\"%d\", &n);\n\tfor(int i = 0; i < n; i++)\n\t\tscanf(\"%d\", &a[i]);\n\tfor(int i = 0; i < n; i++)\n\t\tscanf(\"%d\", &b[i]);\n\tint ans = 0;\n\tint cnt0 = 0;\n\tfor(int i = 0; i < n; i++)\n\t{\n\t\tif(a[i] == 0)\n\t\t{\n\t\t\tif(b[i] == 0)\n\t\t\t\tcnt0++;\n\t\t}\n\t\telse\n\t\t{\n\t\t\tpair<int, int> p = make_pair(-b[i], a[i]);\n\t\t\tnorm(p);\n\t\t\tm[p]++;\n\t\t\tans = max(ans, m[p]);\n\t\t}\n\t}\n\tcout << cnt0 + ans << endl;\n}"
    },
    "order": 15
  },
  {
    "id": "1106D",
    "contestId": 1106,
    "index": "D",
    "title": "Lunar New Year and a Wander",
    "rating": 1500,
    "url": "https://codeforces.com/problemset/problem/1106/D",
    "tags": [
      "data structures",
      "dfs and similar",
      "graphs",
      "greedy",
      "shortest paths"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1106D+Lunar%20New%20Year%20and%20a%20Wander+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint32_t main() {\n\tios::sync_with_stdio(false);\n\tcin.tie(NULL);\n\tcout.tie(NULL);\n\n\tint n, m;\n\tcin >> n >> m;\n\tvector<vector<int>> adj(n + 1);\n\tfor (int i = 0; i < m; i++) {\n\t\tint u, v;\n\t\tcin >> u >> v;\n\t\tadj[u].push_back(v);\n\t\tadj[v].push_back(u);\n\t}\n\n\tpriority_queue<int, vector<int>, greater<int>> pq;\n\tvector<int> vis(n + 1);\n\tvector<int> ans;\n\n\tpq.push(1);\n\tvis[1] = 1; \n\twhile (!pq.empty()) {\n\t\tint u = pq.top();\n\t\tpq.pop();\n\t\tans.push_back(u); \n\t\tfor (int v : adj[u]) {\n\t\t\tif (!vis[v]) {\n\t\t\t\tpq.push(v);\n\t\t\t\tvis[v] = 1;\n\t\t\t}\n\t\t}\n\t}\n\n\tfor (int x : ans) cout << x << ' ';\n\treturn 0;\n}"
    },
    "order": 16
  },
  {
    "id": "1101C",
    "contestId": 1101,
    "index": "C",
    "title": "Division and Union",
    "rating": 1500,
    "url": "https://codeforces.com/problemset/problem/1101/C",
    "tags": [
      "sortings"
    ],
    "hint": "Sort the array to impose monotonic order. Pairing adjacent elements or extremes (min with max) typically resolves the main condition.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1101C+Division%20and%20Union+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n\t\tint n;\n\t\tcin >> n;\n\n\t\tvector<vector<int>> a(n);\n\t\tfor (int i = 0; i < n; i++) {\n\t\t\t\tint l, r;\n\t\t\t\tcin >> l >> r;\n\t\t\t\ta[i] = {l, r, i}; \n\t\t}\n\n\t\tsort(a.begin(), a.end()); \n\n\t\tvector<int> ans(n, 2); \n\t\tint mx = a[0][1];      \n\t\tbool split_found = false; \n\n\t\tfor (int i = 0; i < n; i++) {\n\t\t\t\tif (a[i][0] > mx) {    \n\t\t\t\t\t\tsplit_found = true;  \n\t\t\t\t\t\tbreak;               \n\t\t\t\t}\n\t\t\t\tans[a[i][2]] = 1;      \n\t\t\t\tmx = max(mx, a[i][1]);   \n\t\t}\n\n\t\tif (!split_found) {\n\t\t\t\tcout << \"-1\\n\"; \n\t\t} else {\n\t\t\t\tfor (auto v : ans) cout << v << ' ';\n\t\t\t\tcout << '\\n';\n\t\t}\n}\n\nint32_t main() {\n\t\tios::sync_with_stdio(false);\n\t\tcin.tie(nullptr);\n\n\t\tint tt;\n\t\tcin >> tt;\n\t\twhile (tt--) {\n\t\t\t\tsolve();\n\t\t}\n        \n\t\treturn 0;\n}"
    },
    "order": 17
  },
  {
    "id": "1084C",
    "contestId": 1084,
    "index": "C",
    "title": "The Fair Nut and String",
    "rating": 1500,
    "url": "https://codeforces.com/problemset/problem/1084/C",
    "tags": [
      "combinatorics",
      "dp",
      "implementation"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1084C+The%20Fair%20Nut%20and%20String+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\n#define int long long \nconst int M = 1e9 + 7; \n\nint32_t main() {\n\t\tios::sync_with_stdio(false);\n\t\tcin.tie(NULL);\n\t\tcout.tie(NULL);\n\n\t\tstring s;\n\t\tcin >> s; \n\n\t\tint cnt = 0, p = 1; \n\t\tfor (int i = 0; i < (int)s.size(); i++) {\n\t\t\t\tif (s[i] == 'a')\n\t\t\t\t\t\tcnt++; \n\t\t\t\telse if (s[i] == 'b') {\n\t\t\t\t\t\tp = p * (cnt + 1) % M;\n\t\t\t\t\t\tcnt = 0;\n\t\t\t\t}\n\t\t}\n\t\tp = p * (cnt + 1) % M;\n\n\t\tint ans = (p - 1 + M) % M;\n\t\tcout << ans << '\\n';\n\t\treturn 0;\n}"
    },
    "order": 18
  },
  {
    "id": "982C",
    "contestId": 982,
    "index": "C",
    "title": "Cut 'em all!",
    "rating": 1500,
    "url": "https://codeforces.com/problemset/problem/982/C",
    "tags": [
      "dfs and similar",
      "dp",
      "graphs",
      "greedy",
      "trees"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+982C+Cut%20'em%20all!+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvector<vector<int>> adj;  \nvector<int> sz;         \n\nvoid dfs(int u, int par) {\n\t\tsz[u] = 1;  \n\t\tfor (int v : adj[u]) {\n\t\t\t\tif (v == par) continue;     \n\t\t\t\tdfs(v, u);\n\t\t\t\tsz[u] += sz[v];  \n\t\t}\n}\n\nint32_t main() {\n\t\tios::sync_with_stdio(false);\n\t\tcin.tie(nullptr);\n\n\t\tint n;\n\t\tcin >> n;\n\n\t\tadj.assign(n + 1, {});  \n\t\tfor (int i = 0; i < n - 1; ++i) {\n\t\t\t\tint u, v;\n\t\t\t\tcin >> u >> v;\n\t\t\t\tadj[u].push_back(v);\n\t\t\t\tadj[v].push_back(u);  \n\t\t}\n\n\t\tif (n % 2) {\n\t\t\t\tcout << \"-1\\n\";\n\t\t\t\treturn 0;\n\t\t}\n\n\t\tsz.assign(n + 1, 0);\n\t\tdfs(1, -1);  \n\n\t\tint ans = 0;\n\t\tfor (int i = 2; i <= n; ++i) {  \n\t\t\t\tif (sz[i] % 2 == 0) ++ans;      \n\t\t}\n\t\tcout << ans << '\\n';\n\n\t\treturn 0;\n}"
    },
    "order": 19
  },
  {
    "id": "652D",
    "contestId": 652,
    "index": "D",
    "title": "Nested Segments",
    "rating": 1500,
    "url": "https://codeforces.com/problemset/problem/652/D",
    "tags": [
      "data structures",
      "sortings"
    ],
    "hint": "Speed up operations from O(N) to O(log N) using appropriate containers like std::set, std::map, or a Fenwick/Segment Tree for dynamic range queries and updates.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+652D+Nested%20Segments+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint32_t main() {\n\t\tios::sync_with_stdio(false);\n\t\tcin.tie(NULL);\n\t\tcout.tie(NULL);\n\n\t\tint n;\n\t\tcin >> n;\n\n\t\tvector<vector<int>> a(n); \n\t\tfor (int i = 0; i < n; i++) {\n\t\t\t\tint l, r;\n\t\t\t\tcin >> l >> r;\n\t\t\t\ta[i] = {l, r, i + 1}; \n\t\t} \n\t\tsort(a.begin(), a.end(), [&](vector<int> &v1, vector<int> &v2) {\n\t\t\t\tif (v1[0] == v2[0]) return v1[1] > v2[1];\n\t\t\t\treturn v1[0] < v2[0];\n\t\t}); \n\n\t\tint mx = a[0][1], ind = a[0][2]; \n\t\tfor (int i = 1; i < n; i++) {\n\t\t\t\tif (mx >= a[i][1]) {\n\t\t\t\t\t\tcout << a[i][2] << ' ' << ind << '\\n';\n\t\t\t\t\t\treturn 0;\n\t\t\t\t}\n\t\t\t\tif (a[i][1] > mx) {\n\t\t\t\t\t\tmx = a[i][1];\n\t\t\t\t\t\tind = a[i][2];\n\t\t\t\t}\n\t\t} // n\n\n\t\tcout << \"-1 -1\\n\";\n\n\t\treturn 0;\n}"
    },
    "order": 20
  },
  {
    "id": "960B",
    "contestId": 960,
    "index": "B",
    "title": "Minimize the error",
    "rating": 1500,
    "url": "https://codeforces.com/problemset/problem/960/B",
    "tags": [
      "data structures",
      "greedy",
      "sortings"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+960B+Minimize%20the%20error+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\n#define int long long\n\nint32_t main() {\n\tios::sync_with_stdio(false);\n\tcin.tie(NULL);\n\tcout.tie(NULL);\n\n\tint n, k1, k2;\n\tcin >> n >> k1 >> k2;\n\n\tvector<int> a(n), b(n);\n\tfor (auto &i : a) cin >> i;\n\tfor (auto &i : b) cin >> i;\n\tpriority_queue<int> pq;\n\tfor (int i = 0; i < n; i++) {\n\t\tpq.push(abs(a[i] - b[i]));\n\t}\n\n\tint k = k1 + k2;\n\twhile (k > 0) {\n\t\tint x = pq.top();\n\t\tpq.pop();\n\n\t\tif (x == 0) break; \n\n\t\t--k;\n\t\t--x;\n\t\tpq.push(x);\n\t}\n\n\tint ans = 0;\n\twhile (!pq.empty()) {\n\t\tans += pq.top() * pq.top(); \n\t\tpq.pop();\n\t}\n\tif (k % 2) ++ans;\n\n\tcout << ans << '\\n';\n\treturn 0;\n}"
    },
    "order": 21
  },
  {
    "id": "891A",
    "contestId": 891,
    "index": "A",
    "title": "Pride",
    "rating": 1500,
    "url": "https://codeforces.com/problemset/problem/891/A",
    "tags": [
      "brute force",
      "dp",
      "greedy",
      "math",
      "number theory"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+891A+Pride+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nint32_t main() {\n\t\tios::sync_with_stdio(false);\n\t\tcin.tie(NULL);\n\t\tcout.tie(NULL);\n\n\t\tint n;\n\t\tcin >> n;\n\t\tvector<int> a(n);\n\t\tfor (auto &i : a) cin >> i; \n\n\t\tint g = a[0];\n\t\tint cnt = 0; \n\t\tfor (auto i : a) {\n\t\t\t\tg = __gcd(g, i);\n\t\t\t\tif (i == 1) cnt++;\n\t\t}\n\n\t\tif (g > 1) {\n\t\t\t\tcout << \"-1\\n\";\n\t\t\t\treturn 0;\n\t\t}\n\n\t\tif (cnt) {\n\t\t\t\tcout << n - cnt << '\\n';\n\t\t\t\treturn 0;\n\t\t}\n\n\t\tint ans = 2 * n;\n\t\tfor (int i = 0; i < n; i++) {\n\t\t\t\tint gc = a[i];\n\t\t\t\tfor (int j = i + 1; j < n; j++) {\n\t\t\t\t\t\tgc = __gcd(gc, a[j]);\n\t\t\t\t\t\tif (gc == 1) { \n\t\t\t\t\t\t\t\tans = min(ans, (n - 1) + (j - i));\n\t\t\t\t\t\t\t\tbreak;\n\t\t\t\t\t\t}\n\t\t\t\t}\n\t\t}\n\n\t\tcout << ans << '\\n';\n\n\t\treturn 0;\n}"
    },
    "order": 22
  },
  {
    "id": "1881E",
    "contestId": 1881,
    "index": "E",
    "title": "Block Sequence",
    "rating": 1500,
    "url": "https://codeforces.com/problemset/problem/1881/E",
    "tags": [
      "dp"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1881E+Block%20Sequence+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nint32_t main() {\n\tios::sync_with_stdio(false);\n\tcin.tie(nullptr);\n\n\tint tt;\n\tcin >> tt;\n\twhile (tt--) {\n\t\tint n;\n\t\tcin >> n;\n\t\tvector<int> a(n);\n\t\tfor (auto &i : a) cin >> i;\n\n\t\tvector<int> dp(n + 1);\n\t\tdp[n] = 0;\n\t\tfor (int i = n - 1; i >= 0; --i) {\n\t\t\tdp[i] = dp[i + 1] + 1;\n\t\t\tint j = i + a[i] + 1;\n\t\t\tif (j <= n) {\n\t\t\t\tdp[i] = min(dp[i], dp[j]);\n\t\t\t}\n\t\t}\n\n\t\tcout << dp[0] << '\\n';\n\t}\n\n\treturn 0;\n}"
    },
    "order": 23
  },
  {
    "id": "845C",
    "contestId": 845,
    "index": "C",
    "title": "Two TVs",
    "rating": 1500,
    "url": "https://codeforces.com/problemset/problem/845/C",
    "tags": [
      "data structures",
      "greedy",
      "sortings"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+845C+Two%20TVs+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint32_t main() {\n\t\tios::sync_with_stdio(false);\n\t\tcin.tie(NULL);\n\t\tcout.tie(NULL);\n\n\t\tint n;\n\t\tcin >> n;\n\t\tvector<int> l(n), r(n);\n\t\tfor (int i = 0; i < n; i++) {\n\t\t\t\tcin >> l[i] >> r[i];\n\t\t}\n\n\t\tvector<pair<int, int>> vec; \n\t\tfor (int i = 0; i < n; i++) {\n\t\t\t\tvec.push_back({l[i], 1});    \n\t\t\t\tvec.push_back({r[i] + 1, -1});\n\t\t}\n\n\t\tsort(vec.begin(), vec.end()); \n\n\t\tint s = 0; \n\t\tfor (auto it : vec) {\n\t\t\t\ts += it.second;     \n\t\t\t\tif (s > 2) {         \n\t\t\t\t\t\tcout << \"NO\\n\";\n\t\t\t\t\t\treturn 0;\n\t\t\t\t}\n\t\t}\n\n\t\tcout << \"YES\\n\"; \n\t\treturn 0;\n}"
    },
    "order": 24
  },
  {
    "id": "276C",
    "contestId": 276,
    "index": "C",
    "title": "Little Girl and Maximum Sum",
    "rating": 1500,
    "url": "https://codeforces.com/problemset/problem/276/C",
    "tags": [
      "data structures",
      "greedy",
      "implementation",
      "sortings"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+276C+Little%20Girl%20and%20Maximum%20Sum+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\n#define int long long \n\nint32_t main() {\n\tios::sync_with_stdio(false);\n\tcin.tie(NULL);\n\tcout.tie(NULL);\n\n\tint n, q;\n\tcin >> n >> q;\n\tvector<int> a(n);\n\tfor (auto &i : a)\n\t\tcin >> i;\n\tvector<int> diff(n + 1, 0);\n\twhile (q--) {\n\t\tint l, r;\n\t\tcin >> l >> r;\n\t\tl--, r--;         \n\t\tdiff[l]++;         \n\t\tdiff[r + 1]--;    \n\t}\n\tfor (int i = 1; i <= n; i++)\n\t\tdiff[i] += diff[i - 1];\n\tsort(diff.rbegin(), diff.rend());\n\tsort(a.rbegin(), a.rend());\n\n\tlong long ans = 0;\n\tfor (int i = 0; i < n; i++)\n\t\tans += a[i] * diff[i];\n\tcout << ans << '\\n';\n\n\treturn 0;\n}"
    },
    "order": 25
  },
  {
    "id": "1872E",
    "contestId": 1872,
    "index": "E",
    "title": "Data Structures Fan",
    "rating": 1500,
    "url": "https://codeforces.com/problemset/problem/1872/E",
    "tags": [
      "binary search",
      "bitmasks",
      "data structures",
      "dp"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1872E+Data%20Structures%20Fan+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nvoid solve() {\n\t\tint n;\n\t\tcin >> n;\n\t\tvector<int> a(n + 1); \n\t\tfor (int i = 1; i <= n; i++) cin >> a[i];\n\n\t\tstring s;\n\t\tcin >> s;\n\t\ts = \"*\" + s; \n\n\t\tint xr0 = 0, xr1 = 0; \n\t\tfor (int i = 1; i <= n; i++) {\n\t\t\t\tif (s[i] == '1')\n\t\t\t\t\t\txr1 ^= a[i];\n\t\t\t\telse\n\t\t\t\t\t\txr0 ^= a[i];\n\t\t}\n\n\t\tvector<int> prXor(n + 1, 0);\n\t\tfor (int i = 1; i <= n; i++) {\n\t\t\t\tprXor[i] = prXor[i - 1] ^ a[i];\n\t\t}\n\n\t\tint q;\n\t\tcin >> q;\n\t\twhile (q--) {\n\t\t\t\tint tp;\n\t\t\t\tcin >> tp;\n\t\t\t\tif (tp == 1) { \n\t\t\t\t\t\tint l, r;\n\t\t\t\t\t\tcin >> l >> r;\n\t\t\t\t\t\tint xrlr = prXor[r] ^ prXor[l - 1];\n\t\t\t\t\t\txr0 ^= xrlr;\n\t\t\t\t\t\txr1 ^= xrlr;\n\t\t\t\t} else { \n\t\t\t\t\t\tint g;\n\t\t\t\t\t\tcin >> g;\n\t\t\t\t\t\tif (g == 0)\n\t\t\t\t\t\t\t\tcout << xr0 << ' ';\n\t\t\t\t\t\telse\n\t\t\t\t\t\t\t\tcout << xr1 << ' ';\n\t\t\t\t}\n\t\t}\n\t\tcout << '\\n';\n}\n\n\nint32_t main() {\n\t\tios::sync_with_stdio(false);\n\t\tcin.tie(NULL);\n\t\tcout.tie(NULL);\n\n\t\tint tt;\n\t\tcin >> tt;\n\t\twhile (tt--) {\n\t\t\t\tsolve();\n\t\t}\n\n\t\treturn 0;\n}"
    },
    "order": 26
  },
  {
    "id": "1795C",
    "contestId": 1795,
    "index": "C",
    "title": "Tea Tasting",
    "rating": 1500,
    "url": "https://codeforces.com/problemset/problem/1795/C",
    "tags": [
      "binary search",
      "data structures",
      "implementation"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1795C+Tea%20Tasting+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\n#define int long long\n\nvoid solve() {\n\t\tint n;\n\t\tcin >> n;\n\tvector<int> a(n + 1), b(n + 1);\n\t\tfor (int i = 1; i <= n; i++) cin >> a[i];\n\t\tfor (int i = 1; i <= n; i++) cin >> b[i];\n\n\t\tvector<int> pr(n + 1, 0);\n\tfor (int i = 1; i <= n; i++) pr[i] = pr[i - 1] + b[i];\n\t\tvector<int> cnt(n + 2, 0), ans(n + 1, 0);\n\t\tfor (int i = 1; i <= n; i++) {\n\t\t\tint x = a[i] + pr[i - 1];\n\t\t\tint j = upper_bound(pr.begin(), pr.end(), x) - pr.begin();\n\t\t\tif (j <= n) {\n\t\t\t\t\tans[j] += x - pr[j - 1];\n\t\t\t}\n\t\t\t\tcnt[i]++;\n\t\t\t\tcnt[j]--;\n\t\t}\n\t\tfor (int i = 1; i <= n; i++) {\n\t\t\t\tcnt[i] += cnt[i - 1]; \n\t\t\t\tans[i] += cnt[i] * b[i];\n\t\t}\n\t\tfor (int i = 1; i <= n; i++) cout << ans[i] << ' ';\n\t\tcout << '\\n';\n}\n\nint32_t main() {\n\t\tios::sync_with_stdio(false);\n\t\tcin.tie(nullptr);\n\t\tcout.tie(nullptr);\n\n\t\tint tt;\n\t\tcin >> tt;\n\t\twhile (tt--) {\n\t\t\t\tsolve();\n\t\t}\n\t\treturn 0;\n}"
    },
    "order": 27
  },
  {
    "id": "1776L",
    "contestId": 1776,
    "index": "L",
    "title": "Controllers",
    "rating": 1500,
    "url": "https://codeforces.com/problemset/problem/1776/L",
    "tags": [
      "binary search",
      "math"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1776L+Controllers+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\n#define int long long\n\nint32_t main() {\n\t\tios::sync_with_stdio(false);\n\t\tcin.tie(NULL);\n\t\tcout.tie(NULL);\n\n\t\tint n;\n\t\tcin >> n;\n\t\tstring s;\n\tcin >> s;\n\n\tint c1 = count(s.begin(), s.end(), '+');\n\tint c2 = n - c1;\n\n\tint q;\n\tcin >> q;\n\twhile (q--) {\n\t\t\t\tint a, b;\n\t\t\t\tcin >> a >> b;\n\t\t\t\tif (c1 == c2) {\n\t\t\t\t\t\t\n\t\t\t\t\t\tcout << \"YES\\n\";\n\t\t\t\t\t\tcontinue;\n\t\t\t\t}\n\t\t\t\tif (a == b) {\n\t\t\t\t\t\n\t\t\t\t\t\tcout << \"NO\\n\";\n\t\t\t\t\t\tcontinue;\n\t\t\t\t}\n\t\t\t\tint l = lcm(a, b); \n\t\t\t\tint x = l / a, y = l / b;\n\t\t\t\tif (abs(c2 - c1) % abs(y - x) == 0) {\n\t\t\t\tint p = abs(c2 - c1) / abs(y - x);\n\t\t\t\t\t\tif ((x + y) * p > n) {\n\t\t\t\t\t\t\t\tcout << \"NO\\n\";\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\t\tcout << \"YES\\n\";\n\t\t\t\t\t\t}\n\t\t\t\t} else {\n\t\t\t\t\t\tcout << \"NO\\n\";\n\t\t\t\t}\n\t\t} \n\t\treturn 0;\n}"
    },
    "order": 28
  },
  {
    "id": "1673C",
    "contestId": 1673,
    "index": "C",
    "title": "Palindrome Basis",
    "rating": 1500,
    "url": "https://codeforces.com/problemset/problem/1673/C",
    "tags": [
      "brute force",
      "dp",
      "math",
      "number theory"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1673C+Palindrome%20Basis+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nbool check(int n) {\n\t\tstring s = to_string(n);\n\t\tstring str = s;\n\t\treverse(s.begin(), s.end());\n\t\treturn (s == str);\n}\n\nconst int M = 1e9 + 7;\nconst int N = 4e4 + 5;\n\nint32_t main() {\n\t\tios::sync_with_stdio(false);\n\t\tcin.tie(NULL);\n\t\tcout.tie(NULL);\n\n\t\tvector<int> a;\n\t\tfor (int i = 1; i < N; i++) {\n\t\t\t\tif (check(i))\n\t\t\t\t\t\ta.push_back(i);\n\t\t}\n\t\tint sz = a.size();\n\n\t\tvector<int> dp(N, 0);\n\t\tdp[0] = 1;\n\n\t\tfor (int i = 0; i < sz; i++) {\n\t\t\t\tfor (int x = 1; x < N; x++) {\n\t\t\t\t\t\tif (x - a[i] >= 0)\n\t\t\t\t\t\t\t\tdp[x] = (dp[x] + dp[x - a[i]]) % M;\n\t\t\t\t}\n\t\t}\n\n\t\tint t;\n\t\tcin >> t;\n\t\twhile (t--) {\n\t\t\t\tint n;\n\t\t\t\tcin >> n;\n\t\t\t\tcout << dp[n] << '\\n';\n\t\t}\n\n\t\treturn 0;\n}"
    },
    "order": 29
  },
  {
    "id": "1659C",
    "contestId": 1659,
    "index": "C",
    "title": "Line Empire",
    "rating": 1500,
    "url": "https://codeforces.com/problemset/problem/1659/C",
    "tags": [
      "binary search",
      "brute force",
      "dp",
      "greedy",
      "implementation",
      "math"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1659C+Line%20Empire+editorial",
    "solutionCode": {
      "cpp": "#include<bits/stdc++.h>\nusing namespace std;\nusing lol=long long int;\n#define endl \"\\n\"\nconst lol inf=1e18+8;\n \nint main()\n{\nios_base::sync_with_stdio(false);\ncin.tie(NULL);\nint _=1;\ncin>>_;\nwhile(_--)\n{\n    int n;\n    lol a,b;\n    cin>>n>>a>>b;\n    vector<lol> x(n+1),p(n+1);\n    x[0]=0;\n    for(int i=1;i<=n;i++)   cin>>x[i];\n    partial_sum(x.begin(),x.end(),p.begin());\n    lol ans=inf;\n    for(int i=0;i<=n;i++)\n    {\n        ans=min(ans,(a+b)*(x[i]-x[0])+b*(p[n]-p[i]-(n-i)*x[i]));\n    }\n    cout<<ans<<endl;\n}\nreturn 0;\n}"
    },
    "order": 30
  },
  {
    "id": "1646C",
    "contestId": 1646,
    "index": "C",
    "title": "Factorials and Powers of Two",
    "rating": 1500,
    "url": "https://codeforces.com/problemset/problem/1646/C",
    "tags": [
      "bitmasks",
      "brute force",
      "constructive algorithms",
      "dp",
      "math"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1646C+Factorials%20and%20Powers%20of%20Two+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\n#define int long long\nconst int INF = 1e18;   \n\nint setbits(int n) { return __builtin_popcountll(n); }\n\nvoid solve() {\n\tint n;\n\tcin >> n;\n\n\tvector<int> fact(15);\n\tfact[0] = 1;\n\tfor (int i = 1; i <= 14; i++) fact[i] = fact[i - 1] * i; \n\n\tvector<int> vec;\n\tfor (int i = 3; i <= 14; i++) vec.push_back(fact[i]); \n\tint ans = INF;\n\tfor (int mask = 0; mask < (1LL << 12); mask++) {\n\t\tint sum = 0;\n\t\tint cnt = 0; \n\t\tfor (int i = 0; i < 12; i++) {\n\t\t\tif (mask & (1LL << i)) {\n\t\t\t\tsum += vec[i];\n\t\t\t\tcnt++;\n\t\t\t}\n\t\t}\n\t\tif (sum > n) continue; \n\t\tcnt += setbits(n - sum);\n\t\tans = min(ans, cnt);\n\t}\n\n\tcout << ans << '\\n';\n}\n\nint32_t main() {\n\tios::sync_with_stdio(false);\n\tcin.tie(NULL);\n\tcout.tie(NULL);\n\n\tint tt;\n\tcin >> tt;\n\twhile (tt--) {\n\t\tsolve();\n\t}\n\n\treturn 0;\n}"
    },
    "order": 31
  },
  {
    "id": "1526C1",
    "contestId": 1526,
    "index": "C1",
    "title": "Potions (Easy Version)",
    "rating": 1500,
    "url": "https://codeforces.com/problemset/problem/1526/C1",
    "tags": [
      "brute force",
      "data structures",
      "dp",
      "greedy"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1526C1+Potions%20(Easy%20Version)+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    vector<long long> dp(n + 1, 0);\n    for (int i = 0; i < n; i++) {\n        dp[i + 1] = max(dp[i], dp[i] + a[i]);\n    }\n    cout << dp[n] << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 32
  },
  {
    "id": "1542B",
    "contestId": 1542,
    "index": "B",
    "title": "Plus and Multiply",
    "rating": 1500,
    "url": "https://codeforces.com/problemset/problem/1542/B",
    "tags": [
      "constructive algorithms",
      "math",
      "number theory"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1542B+Plus%20and%20Multiply+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 33
  },
  {
    "id": "1538F",
    "contestId": 1538,
    "index": "F",
    "title": "Interesting Function",
    "rating": 1500,
    "url": "https://codeforces.com/problemset/problem/1538/F",
    "tags": [
      "binary search",
      "dp",
      "math",
      "number theory"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1538F+Interesting%20Function+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    vector<long long> dp(n + 1, 0);\n    for (int i = 0; i < n; i++) {\n        dp[i + 1] = max(dp[i], dp[i] + a[i]);\n    }\n    cout << dp[n] << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 34
  },
  {
    "id": "1985F",
    "contestId": 1985,
    "index": "F",
    "title": "Final Boss",
    "rating": 1500,
    "url": "https://codeforces.com/problemset/problem/1985/F",
    "tags": [
      "binary search",
      "data structures"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1985F+Final%20Boss+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nbool check(long long mid, const vector<long long>& a, int n, long long k) {\n    long long count = 0;\n    for (int i = 0; i < n; i++) {\n        count += mid / a[i];\n    }\n    return count >= k;\n}\n\nvoid solve() {\n    int n;\n    long long k;\n    if (!(cin >> n >> k)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    long long low = 1, high = 1e18, ans = high;\n    while (low <= high) {\n        long long mid = low + (high - low) / 2;\n        if (check(mid, a, n, k)) {\n            ans = mid;\n            high = mid - 1;\n        } else {\n            low = mid + 1;\n        }\n    }\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 35
  },
  {
    "id": "1996D",
    "contestId": 1996,
    "index": "D",
    "title": "Fun",
    "rating": 1500,
    "url": "https://codeforces.com/problemset/problem/1996/D",
    "tags": [
      "binary search",
      "brute force",
      "combinatorics",
      "math",
      "number theory"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1996D+Fun+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nbool check(long long mid, const vector<long long>& a, int n, long long k) {\n    long long count = 0;\n    for (int i = 0; i < n; i++) {\n        count += mid / a[i];\n    }\n    return count >= k;\n}\n\nvoid solve() {\n    int n;\n    long long k;\n    if (!(cin >> n >> k)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    long long low = 1, high = 1e18, ans = high;\n    while (low <= high) {\n        long long mid = low + (high - low) / 2;\n        if (check(mid, a, n, k)) {\n            ans = mid;\n            high = mid - 1;\n        } else {\n            low = mid + 1;\n        }\n    }\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 36
  },
  {
    "id": "1971E",
    "contestId": 1971,
    "index": "E",
    "title": "Find the Car",
    "rating": 1500,
    "url": "https://codeforces.com/problemset/problem/1971/E",
    "tags": [
      "binary search",
      "math",
      "sortings"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1971E+Find%20the%20Car+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nbool check(long long mid, const vector<long long>& a, int n, long long k) {\n    long long count = 0;\n    for (int i = 0; i < n; i++) {\n        count += mid / a[i];\n    }\n    return count >= k;\n}\n\nvoid solve() {\n    int n;\n    long long k;\n    if (!(cin >> n >> k)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    long long low = 1, high = 1e18, ans = high;\n    while (low <= high) {\n        long long mid = low + (high - low) / 2;\n        if (check(mid, a, n, k)) {\n            ans = mid;\n            high = mid - 1;\n        } else {\n            low = mid + 1;\n        }\n    }\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 37
  },
  {
    "id": "1950E",
    "contestId": 1950,
    "index": "E",
    "title": "Nearly Shortest Repeating Substring",
    "rating": 1500,
    "url": "https://codeforces.com/problemset/problem/1950/E",
    "tags": [
      "brute force",
      "implementation",
      "number theory",
      "strings"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1950E+Nearly%20Shortest%20Repeating%20Substring+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 38
  },
  {
    "id": "2115A",
    "contestId": 2115,
    "index": "A",
    "title": "Gellyfish and Flaming Peony",
    "rating": 1500,
    "url": "https://codeforces.com/problemset/problem/2115/A",
    "tags": [
      "constructive algorithms",
      "dp",
      "math",
      "number theory"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+2115A+Gellyfish%20and%20Flaming%20Peony+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    vector<long long> dp(n + 1, 0);\n    for (int i = 0; i < n; i++) {\n        dp[i + 1] = max(dp[i], dp[i] + a[i]);\n    }\n    cout << dp[n] << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 39
  },
  {
    "id": "1873G",
    "contestId": 1873,
    "index": "G",
    "title": "ABBC or BACB",
    "rating": 1500,
    "url": "https://codeforces.com/problemset/problem/1873/G",
    "tags": [
      "constructive algorithms",
      "greedy"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1873G+ABBC%20or%20BACB+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 40
  },
  {
    "id": "1690E",
    "contestId": 1690,
    "index": "E",
    "title": "Price Maximization",
    "rating": 1500,
    "url": "https://codeforces.com/problemset/problem/1690/E",
    "tags": [
      "binary search",
      "greedy",
      "math",
      "two pointers"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1690E+Price%20Maximization+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nbool check(long long mid, const vector<long long>& a, int n, long long k) {\n    long long count = 0;\n    for (int i = 0; i < n; i++) {\n        count += mid / a[i];\n    }\n    return count >= k;\n}\n\nvoid solve() {\n    int n;\n    long long k;\n    if (!(cin >> n >> k)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    long long low = 1, high = 1e18, ans = high;\n    while (low <= high) {\n        long long mid = low + (high - low) / 2;\n        if (check(mid, a, n, k)) {\n            ans = mid;\n            high = mid - 1;\n        } else {\n            low = mid + 1;\n        }\n    }\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 41
  },
  {
    "id": "1792C",
    "contestId": 1792,
    "index": "C",
    "title": "Min Max Sort",
    "rating": 1500,
    "url": "https://codeforces.com/problemset/problem/1792/C",
    "tags": [
      "binary search",
      "brute force",
      "greedy",
      "math",
      "two pointers"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1792C+Min%20Max%20Sort+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nbool check(long long mid, const vector<long long>& a, int n, long long k) {\n    long long count = 0;\n    for (int i = 0; i < n; i++) {\n        count += mid / a[i];\n    }\n    return count >= k;\n}\n\nvoid solve() {\n    int n;\n    long long k;\n    if (!(cin >> n >> k)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    long long low = 1, high = 1e18, ans = high;\n    while (low <= high) {\n        long long mid = low + (high - low) / 2;\n        if (check(mid, a, n, k)) {\n            ans = mid;\n            high = mid - 1;\n        } else {\n            low = mid + 1;\n        }\n    }\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 42
  },
  {
    "id": "1842C",
    "contestId": 1842,
    "index": "C",
    "title": "Tenzing and Balls",
    "rating": 1500,
    "url": "https://codeforces.com/problemset/problem/1842/C",
    "tags": [
      "dp"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1842C+Tenzing%20and%20Balls+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    vector<long long> dp(n + 1, 0);\n    for (int i = 0; i < n; i++) {\n        dp[i + 1] = max(dp[i], dp[i] + a[i]);\n    }\n    cout << dp[n] << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 43
  },
  {
    "id": "1552B",
    "contestId": 1552,
    "index": "B",
    "title": "Running for Gold",
    "rating": 1500,
    "url": "https://codeforces.com/problemset/problem/1552/B",
    "tags": [
      "combinatorics",
      "graphs",
      "greedy",
      "sortings"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1552B+Running%20for%20Gold+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 44
  },
  {
    "id": "1924A",
    "contestId": 1924,
    "index": "A",
    "title": "Did We Get Everything Covered?",
    "rating": 1500,
    "url": "https://codeforces.com/problemset/problem/1924/A",
    "tags": [
      "constructive algorithms",
      "dp",
      "greedy",
      "shortest paths",
      "strings"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1924A+Did%20We%20Get%20Everything%20Covered%3F+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    vector<long long> dp(n + 1, 0);\n    for (int i = 0; i < n; i++) {\n        dp[i + 1] = max(dp[i], dp[i] + a[i]);\n    }\n    cout << dp[n] << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 45
  },
  {
    "id": "1547E",
    "contestId": 1547,
    "index": "E",
    "title": "Air Conditioners",
    "rating": 1500,
    "url": "https://codeforces.com/problemset/problem/1547/E",
    "tags": [
      "data structures",
      "dp",
      "implementation",
      "shortest paths",
      "sortings",
      "two pointers"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1547E+Air%20Conditioners+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    vector<long long> dp(n + 1, 0);\n    for (int i = 0; i < n; i++) {\n        dp[i + 1] = max(dp[i], dp[i] + a[i]);\n    }\n    cout << dp[n] << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 46
  },
  {
    "id": "2007C",
    "contestId": 2007,
    "index": "C",
    "title": "Dora and C++",
    "rating": 1500,
    "url": "https://codeforces.com/problemset/problem/2007/C",
    "tags": [
      "math",
      "number theory"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+2007C+Dora%20and%20C%2B%2B+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 47
  },
  {
    "id": "1997D",
    "contestId": 1997,
    "index": "D",
    "title": "Maximize the Root",
    "rating": 1500,
    "url": "https://codeforces.com/problemset/problem/1997/D",
    "tags": [
      "binary search",
      "dfs and similar",
      "dp",
      "greedy",
      "trees"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1997D+Maximize%20the%20Root+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    vector<long long> dp(n + 1, 0);\n    for (int i = 0; i < n; i++) {\n        dp[i + 1] = max(dp[i], dp[i] + a[i]);\n    }\n    cout << dp[n] << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 48
  },
  {
    "id": "1536C",
    "contestId": 1536,
    "index": "C",
    "title": "Diluc and Kaeya",
    "rating": 1500,
    "url": "https://codeforces.com/problemset/problem/1536/C",
    "tags": [
      "data structures",
      "dp",
      "hashing",
      "number theory"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1536C+Diluc%20and%20Kaeya+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    vector<long long> dp(n + 1, 0);\n    for (int i = 0; i < n; i++) {\n        dp[i + 1] = max(dp[i], dp[i] + a[i]);\n    }\n    cout << dp[n] << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 49
  },
  {
    "id": "1630A",
    "contestId": 1630,
    "index": "A",
    "title": "And Matching",
    "rating": 1500,
    "url": "https://codeforces.com/problemset/problem/1630/A",
    "tags": [
      "bitmasks",
      "constructive algorithms"
    ],
    "hint": "Build a pattern step by step. Look at small examples (n=1, 2, 3) to uncover an invariant or periodic pattern that generalizes to any valid input.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1630A+And%20Matching+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 50
  },
  {
    "id": "1920C",
    "contestId": 1920,
    "index": "C",
    "title": "Partitioning the Array",
    "rating": 1600,
    "url": "https://codeforces.com/problemset/problem/1920/C",
    "tags": [
      "brute force",
      "math",
      "number theory"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1920C+Partitioning%20the%20Array+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nint gcd(int a, int b) {\n    if (b == 0)\n        return a;\n    return gcd(b, a % b);\n}\n\nint func(vector<int>& a) {\n    sort(begin(a), end(a));\n    int x = a[0];\n    for (auto& val: a)\n        val -= x;\n    int g = 0;\n    for (auto& val: a)\n        g = gcd(g, val);\n    return g;\n}\n\nvoid solve() {\n    int n;\n\n    cin >> n;\n    vector<int> a(n);\n    for (int i = 0; i < n; i++)\n        cin >> a[i];\n    \n    int ans = 1;\n    for (int k = 1; k < n; k++) {\n        if (n % k != 0)\n            continue;\n        int gg = 0;\n        for (int z = 0; z < k; z++) {\n            vector<int> v;\n            for (int i = z; i < n; i += k)\n                v.push_back(a[i]);\n            int g = func(v);\n            gg = gcd(gg, g);\n        }\n        if (gg != 1)\n            ans++;\n    }\n\n    cout << ans << endl;\n}\n\nint main() {\n    int t;\n\n    ios::sync_with_stdio(0);\n    cin.tie(0);\n\n    cin >> t;\n    while (t--)\n        solve();\n\n    return 0;\n}"
    },
    "order": 1
  },
  {
    "id": "1781C",
    "contestId": 1781,
    "index": "C",
    "title": "Equal Frequencies",
    "rating": 1600,
    "url": "https://codeforces.com/problemset/problem/1781/C",
    "tags": [
      "brute force",
      "constructive algorithms",
      "greedy",
      "implementation",
      "sortings",
      "strings"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1781C+Equal%20Frequencies+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n\t\tios_base::sync_with_stdio(false);\n\t\tcin.tie(nullptr);\n\n\t\tint tc;\n\t\tcin >> tc;\n\t\twhile (tc--) {\n\t\t\t\tint n;\n\t\t\t\tcin >> n;\n\t\t\t\tstring s;\n\t\t\t\tcin >> s;\n\n\t\t\t\tvector<pair<int, char>> freq(26);\n\t\t\t\tfor (int i = 0; i < 26; i++) freq[i].second = 'a' + i; \n\t\t\t\tfor (char c : s) freq[c - 'a'].first++; \n\t\t\t\tsort(freq.rbegin(), freq.rend()); \n\t\t\t\tint best_k = 1, changes = n;\n\t\t\t\tfor (int k = 1; k <= 26; k++) {\n\t\t\t\t\t\tif (n % k) continue; \n\t\t\t\t\t\tint unchanged = 0;\n\t\t\t\t\t\tfor (int i = 0; i < k; i++) unchanged += min(freq[i].first, n / k);\n\t\t\t\t\t\tif (n - unchanged < changes) {\n\t\t\t\t\t\t\t\tbest_k = k;\n\t\t\t\t\t\t\t\tchanges = n - unchanged;\n\t\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\tmap<char, int> mp;\n\t\t\t\tfor (int i = 0; i < best_k; i++) mp[freq[i].second] = n / best_k;\n\n\t\t\t\tstring ans(n, ' ');\n\t\t\t\tfor (int i = 0; i < n; i++) {\n\t\t\t\t\t\tif (mp[s[i]] > 0) {\n\t\t\t\t\t\t\t\tans[i] = s[i];\n\t\t\t\t\t\t\t\tmp[s[i]]--;\n\t\t\t\t\t\t}\n\t\t\t\t}\n\n\t\t\t\tfor (int i = 0; i < n; i++) {\n\t\t\t\t\t\tif (ans[i] != ' ') continue; \n\t\t\t\t\t\twhile (!mp.empty() && (*mp.begin()).second == 0) mp.erase(mp.begin()); \n\t\t\t\t\t\tchar ch = (*mp.begin()).first; \n\t\t\t\t\t\tans[i] = ch;\n\t\t\t\t\t\tmp[ch]--;\n\t\t\t\t}\n\n\t\t\t\tcout << changes << \"\\n\" << ans << \"\\n\";\n\t\t}\n\n\t\treturn 0;\n}"
    },
    "order": 2
  },
  {
    "id": "1778C",
    "contestId": 1778,
    "index": "C",
    "title": "Flexible String",
    "rating": 1600,
    "url": "https://codeforces.com/problemset/problem/1778/C",
    "tags": [
      "bitmasks",
      "brute force",
      "strings"
    ],
    "hint": "Track character frequencies, prefixes, or palindrome symmetry. Often checking prefix and suffix matches in linear time avoids costly quadratic nested loops.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1778C+Flexible%20String+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nusing ll = long long;\n\nint main() {\n\t\tios::sync_with_stdio(false);\n\t\tcin.tie(nullptr);\n\n\t\tint tc;\n\t\tcin >> tc;\n\t\twhile (tc--) {\n\t\t\t\tint n, k;\n\t\t\t\tcin >> n >> k;\n\t\t\t\tstring a, b;\n\t\t\t\tcin >> a >> b;\n\n\t\t\t\tvector<int> id(26, -1);           \n\t\t\t\tvector<char> u;                    \n\t\t\t\tfor (char c : a) {\n\t\t\t\t\t\tif (id[c - 'a'] == -1) {     \n\t\t\t\t\t\t\t\tid[c - 'a'] = (int)u.size();\n\t\t\t\t\t\t\t\tu.push_back(c);\n\t\t\t\t\t\t}\n\t\t\t\t}\n\n\t\t\t\tll ans = 0;\n\t\t\t\tint uc = (int)u.size();        \n\t\t\t\tint bc = min(k, uc);           \n\t\t\t\tfor (int bm = 0; bm < (1 << uc); ++bm) {\n\t\t\t\t\t\tif (__builtin_popcount((unsigned)bm) != bc) continue;\n\n\t\t\t\t\t\tll cnt = 0;                 \n\t\t\t\t\t\tll match = 0;                \n\t\t\t\t\t\tfor (int i = 0; i < n; ++i) {\n\t\t\n\t\t\t\t\t\t\t\tif (a[i] == b[i] || (bm & (1 << id[a[i] - 'a']))) {\n\t\t\t\t\t\t\t\t\t\t++match;\n\t\t\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\tcnt += match * (match + 1) / 2;\n\t\t\t\t\t\t\t\t\t\tmatch = 0;\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t\tcnt += match * (match + 1) / 2; \n\t\t\t\t\t\tans = max(ans, cnt);\n\t\t\t\t}\n\n\t\t\t\tcout << ans << '\\n';\n\t\t}\n\t\treturn 0;\n}"
    },
    "order": 3
  },
  {
    "id": "1775C",
    "contestId": 1775,
    "index": "C",
    "title": "Interesting Sequence",
    "rating": 1600,
    "url": "https://codeforces.com/problemset/problem/1775/C",
    "tags": [
      "math"
    ],
    "hint": "The range bitwise AND product n & (n+1) & ... & m preserves prefix bits and turns differing suffixes into zeros. Check if m can be formed by rounding up to clear the necessary low-order bits.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1775C+Interesting%20Sequence+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    unsigned long long n, x;\n    if (!(cin >> n >> x)) return;\n    if ((n & x) != x) {\n        cout << -1 << \"\\n\";\n        return;\n    }\n    if (n == x) {\n        cout << n << \"\\n\";\n        return;\n    }\n    unsigned long long low = n, high = 5e18, ans = -1;\n    while (low <= high) {\n        unsigned long long mid = low + (high - low) / 2;\n        unsigned long long andVal = 0;\n        for (int b = 62; b >= 0; b--) {\n            unsigned long long bitN = (n >> b) & 1ULL;\n            unsigned long long bitM = (mid >> b) & 1ULL;\n            if (bitN != bitM) break;\n            if (bitN) andVal |= (1ULL << b);\n        }\n        if (andVal == x) {\n            ans = mid;\n            high = mid - 1;\n        } else if (andVal > x) {\n            low = mid + 1;\n        } else {\n            high = mid - 1;\n        }\n    }\n    cout << (long long)ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 4
  },
  {
    "id": "1741E",
    "contestId": 1741,
    "index": "E",
    "title": "Sending a Sequence Over the Network",
    "rating": 1600,
    "url": "https://codeforces.com/problemset/problem/1741/E",
    "tags": [
      "dp"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1741E+Sending%20a%20Sequence%20Over%20the%20Network+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n\t\tios::sync_with_stdio(false);\n\t\tcin.tie(nullptr);\n\n\t\tint tc;\n\t\tcin >> tc;\n\t\twhile (tc--) {\n\t\t\t\tint n;\n\t\t\t\tcin >> n;\n\n\t\t\t\tvector<int> dp(n + 1, 0); \n\t\t\t\tdp[0] = 1;\n\n\t\t\t\tfor (int i = 1; i <= n; ++i) {\n\t\t\t\t\t\tint x;\n\t\t\t\t\t\tcin >> x;\n\t\t\t\t\t\tif (dp[i - 1] && i + x <= n) dp[i + x] = 1;\n\t\t\t\t\t\tif (i - x - 1 >= 0) dp[i] = dp[i] || dp[i - x - 1];\n\t\t\t\t}\n\n\t\t\t\tcout << (dp[n] ? \"YES\\n\" : \"NO\\n\");\n\t\t}\n\t\treturn 0;\n}"
    },
    "order": 5
  },
  {
    "id": "1730B",
    "contestId": 1730,
    "index": "B",
    "title": "Meeting on the Line",
    "rating": 1600,
    "url": "https://codeforces.com/problemset/problem/1730/B",
    "tags": [
      "binary search",
      "geometry",
      "greedy",
      "implementation",
      "math",
      "ternary search"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1730B+Meeting%20on%20the%20Line+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nusing ld = long double;\n\nint n;\nvector<int> x, t;\nld best; \nbool check(ld T) {\n\tld L = 0, R = 1e8; \n\tfor (int i = 0; i < n; i++) {\n\t\tld reach = max(T - (ld)t[i], (ld)0);\n\t\tld l = (ld)x[i] - reach;\n\t\tld r = (ld)x[i] + reach;\n\n\t\tL = max(L, l);\n\t\tR = min(R, r);\n\n\t\tif (R < L) return false;\n\t}\n\tbest = (L + R) / 2;\n\treturn true;\n}\n\nint main() {\n\tios::sync_with_stdio(false);\n\tcin.tie(nullptr);\n\n\tint tc;\n\tcin >> tc;\n\twhile (tc--) {\n\t\tcin >> n;\n\n\t\tx.resize(n);\n\t\tfor (auto &xi : x) cin >> xi;\n\n\t\tt.resize(n);\n\t\tfor (auto &ti : t) cin >> ti;\n.\n\t\tld l = 0, r = 1e9; \n\t\tfor (int it = 0; it <= 60; it++) { \n\t\t\tld mid = (l + r) / 2;\n\t\t\tif (check(mid)) {\n\t\t\t\tr = mid; \n\t\t\t} else {\n\t\t\t\tl = mid; \n\t\t\t}\n\t\t}\n\n\t\tcout << setprecision(16) << best << \"\\n\";\n\t}\n\n\treturn 0;\n}"
    },
    "order": 6
  },
  {
    "id": "1702E",
    "contestId": 1702,
    "index": "E",
    "title": "Split Into Two Sets",
    "rating": 1600,
    "url": "https://codeforces.com/problemset/problem/1702/E",
    "tags": [
      "dfs and similar",
      "dsu",
      "graphs"
    ],
    "hint": "Represent the input as an adjacency list. Use BFS/DFS traversal to discover reachable components, compute shortest hops in unweighted graphs, or detect bipartite coloring.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1702E+Split%20Into%20Two%20Sets+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid dfs(int x, vector<vector<int>> &adj, vector<int> &color, bool &pos) {\n\t\tif (!pos) return;\n\t\tfor (auto y : adj[x]) {\n\t\t\t\tif (color[y] != -1) {\n\t\t\t\t\t\tif (color[y] == color[x]) {\n\t\t\t\t\t\t\t\tpos = false;\n\t\t\t\t\t\t\t\treturn;\n\t\t\t\t\t\t}\n\t\t\t\t\t\tcontinue;\n\t\t\t\t}\n\t\t\t\tcolor[y] = 1 - color[x];\n\t\t\t\tdfs(y, adj, color, pos);\n\t\t}\n}\n\nint main() {\n\t\tios_base::sync_with_stdio(false);\n\t\tcin.tie(nullptr);\n\n\t\tint tc;\n\t\tcin >> tc;\n\t\twhile (tc--) {\n\t\t\t\tint n;\n\t\t\t\tcin >> n;\n\t\t\t\tvector<vector<int>> doms_for_num(n);\n\t\t\t\tvector<pair<int, int>> domino(n);\n\n\t\t\t\tfor (int i = 0; i < n; i++) {\n\t\t\t\t\t\tcin >> domino[i].first >> domino[i].second;\n\t\t\t\t\t\tdoms_for_num[domino[i].first - 1].push_back(i);\n\t\t\t\t\t\tdoms_for_num[domino[i].second - 1].push_back(i);\n\t\t\t\t}\n\n\t\t\t\tbool pos = true;\n\t\t\t\tvector<vector<int>> adj(n);\n\n\t\t\t\tfor (int v = 0; v < n; v++) {\n\t\t\t\t\t\tif (doms_for_num[v].size() > 2) {\n\t\t\t\t\t\t\t\tpos = false;\n\t\t\t\t\t\t\t\tbreak;\n\t\t\t\t\t\t}\n\t\t\t\t\t\tif (doms_for_num[v].size() == 2) {\n\t\t\t\t\t\t\t\tint a = doms_for_num[v][0], b = doms_for_num[v][1];\n\t\t\t\t\t\t\t\tadj[a].push_back(b);\n\t\t\t\t\t\t\t\tadj[b].push_back(a);\n\t\t\t\t\t\t}\n\t\t\t\t}\n\n\t\t\t\tif (!pos) {\n\t\t\t\t\t\tcout << \"NO\\n\";\n\t\t\t\t\t\tcontinue;\n\t\t\t\t}\n\t\t\t\tvector<int> color(n, -1);\n\t\t\t\tfor (int i = 0; i < n && pos; i++) {\n\t\t\t\t\t\tif (color[i] != -1) continue; \n\t\t\t\t\t\tcolor[i] = 0;\n\t\t\t\t\t\tdfs(i, adj, color, pos);\n\t\t\t\t}\n\n\t\t\t\tcout << (pos ? \"YES\\n\" : \"NO\\n\");\n\t\t}\n\n\t\treturn 0;\n}"
    },
    "order": 7
  },
  {
    "id": "1698D",
    "contestId": 1698,
    "index": "D",
    "title": "Fixed Point Guessing",
    "rating": 1600,
    "url": "https://codeforces.com/problemset/problem/1698/D",
    "tags": [
      "binary search",
      "constructive algorithms",
      "interactive"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1698D+Fixed%20Point%20Guessing+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n\t\tint tc;\n\t\tcin >> tc;\n\t\twhile (tc--) {\n\t\t\t\tint n;\n\t\t\t\tcin >> n;\n\t\t\t\tint l = 1, r = n;\n\t\t\t\twhile (l < r) {\n\t\t\t\t\t\tint mid = (l + r) / 2;\n\t\t\t\t\t\tcout << \"? \" << l << \" \" << mid << endl;\n\t\t\t\t\t\tcout.flush(); \n\t\t\t\t\t\tint cnt = 0;\n\t\t\t\t\t\tfor (int i = 0; i < (mid - l + 1); i++) {\n\t\t\t\t\t\t\t\tint x;\n\t\t\t\t\t\t\t\tcin >> x;\n\t\t\t\t\t\t\t\tif (l <= x && x <= mid) cnt++;\n\t\t\t\t\t\t}\n\t\t\t\t\t\tif (cnt % 2) {\n\t\t\t\t\t\t\t\tr = mid;\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\t\tl = mid + 1;\n\t\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\tcout << \"! \" << l << endl;\n\t\t\t\tcout.flush();\n\t\t}\n\n\t\treturn 0;\n}"
    },
    "order": 8
  },
  {
    "id": "1660D",
    "contestId": 1660,
    "index": "D",
    "title": "Maximum Product Strikes Back",
    "rating": 1600,
    "url": "https://codeforces.com/problemset/problem/1660/D",
    "tags": [
      "brute force",
      "implementation",
      "math",
      "two pointers"
    ],
    "hint": "Notice that as the right pointer expands, the left pointer only needs to move forward. Maintain frequency counts or window invariants to keep the window valid in O(N) overall.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1660D+Maximum%20Product%20Strikes%20Back+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n\t\tios_base::sync_with_stdio(false);\n\t\tcin.tie(nullptr);\n\n\t\tint tt;\n\t\tcin >> tt;\n\t\twhile (tt--) {\n\t\t\t\tint n;\n\t\t\t\tcin >> n;\n\t\t\t\tvector<int> a(n);\n\t\t\t\tfor (auto &x : a) cin >> x;\n\t\t\t\tint best = 0, bestl = n, bestr = 0;\n\t\t\t\tint l = 0;\n\t\t\t\twhile (l < n) {\n\t\t\t\t\t\tif (a[l] == 0) {\n\t\t\t\t\t\t\t\tl++;\n\t\t\t\t\t\t\t\tcontinue;\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tint r = l - 1, tc = 0, neg = 1; \n\t\t\t\t\t\twhile (r + 1 < n && a[r + 1] != 0) {\n\t\t\t\t\t\t\t\tr++;\n\t\t\t\t\t\t\t\tif (abs(a[r]) == 2) tc++;       \n\t\t\t\t\t\t\t\tif (a[r] < 0) neg *= -1;        \n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tif (neg == 1) {  \n\t\t\t\t\t\t\t\tif (tc > best) {\n\t\t\t\t\t\t\t\t\t\tbestl = l;\n\t\t\t\t\t\t\t\t\t\tbestr = (n - 1) - r; \n\t\t\t\t\t\t\t\t\t\tbest = tc;\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\tl = r + 1; \n\t\t\t\t\t\t\t\tcontinue;\n\t\t\t\t\t\t}\n\t\t\t\t\t\tint ntc = tc, nl = l - 1;\n\t\t\t\t\t\tdo {\n\t\t\t\t\t\t\t\tnl++;\n\t\t\t\t\t\t\t\tntc -= (abs(a[nl]) == 2);  \n\t\t\t\t\t\t} while (a[nl] > 0);         \n\t\t\t\t\t\tif (ntc > best) {\n\t\t\t\t\t\t\t\tbestl = nl + 1;            \n\t\t\t\t\t\t\t\tbestr = (n - 1) - r;        \n\t\t\t\t\t\t\t\tbest = ntc;\n\t\t\t\t\t\t}\n\t\t\t\t\t\tint nr = r + 1;\n\t\t\t\t\t\tntc = tc;\n\t\t\t\t\t\tdo {\n\t\t\t\t\t\t\t\tnr--;\n\t\t\t\t\t\t\t\tntc -= (abs(a[nr]) == 2); \n\t\t\t\t\t\t} while (a[nr] > 0);          \n\t\t\t\t\t\tif (ntc > best) {\n\t\t\t\t\t\t\t\tbestl = l;                 \n\t\t\t\t\t\t\t\tbestr = n - nr;            \n\t\t\t\t\t\t\t\tbest = ntc;\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tl = r + 1;  \n\t\t\t\t}\n\n\t\t\t\tcout << bestl << \" \" << bestr << \"\\n\";\n\t\t}\n\t\treturn 0;\n}"
    },
    "order": 9
  },
  {
    "id": "1610C",
    "contestId": 1610,
    "index": "C",
    "title": "Keshi Is Throwing a Party",
    "rating": 1600,
    "url": "https://codeforces.com/problemset/problem/1610/C",
    "tags": [
      "binary search",
      "greedy"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1610C+Keshi%20Is%20Throwing%20a%20Party+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint n;\nvector<pair<int, int>> v; \n\nbool check(int x) {\n\t\tint c = 0;\n\t\tfor (int i = 0; i < n; i++) {\n\t\t\t\tif (v[i].second >= c && v[i].first >= x - c - 1) {\n\t\t\t\t\t\tc++;\n\t\t\t\t}\n\t\t}\n\t\treturn c >= x;\n}\n\nint main() {\n\t\tios::sync_with_stdio(false);\n\t\tcin.tie(nullptr);\n\n\t\tint tc;\n\t\tcin >> tc;\n\t\twhile (tc--) {\n\t\t\t\tcin >> n;\n\t\t\t\tv.resize(n);\n\t\t\t\tfor (auto &p : v) cin >> p.first >> p.second; \n\n\t\t\t\tint l = 1, r = n, best = 1; \n\t\t\t\twhile (l <= r) {\n\t\t\t\t\t\tint mid = (l + r) / 2;\n\t\t\t\t\t\tif (check(mid)) {\n\t\t\t\t\t\t\t\tbest = mid; \n\t\t\t\t\t\t\t\tl = mid + 1;\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\t\tr = mid - 1;\n\t\t\t\t\t\t}\n\t\t\t\t}\n\n\t\t\t\tcout << best << '\\n';\n\t\t}\n\n\t\treturn 0;\n}"
    },
    "order": 10
  },
  {
    "id": "1168B",
    "contestId": 1168,
    "index": "B",
    "title": "Good Triple",
    "rating": 1600,
    "url": "https://codeforces.com/problemset/problem/1168/B",
    "tags": [
      "brute force",
      "two pointers"
    ],
    "hint": "Notice that as the right pointer expands, the left pointer only needs to move forward. Maintain frequency counts or window invariants to keep the window valid in O(N) overall.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1168B+Good%20Triple+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nusing ll = long long;\n\nint main() {\n\tios_base::sync_with_stdio(false);\n\tcin.tie(nullptr);\n\n\tvector<int> ways(10, 0);\n\tfor (int i = 0; i <= 9; i++) {\n\t\tfor (int j = 0; j <= 9; j++) {\n\t\t\tfor (int k = 0; k <= 9; k++) {\n\t\t\t\tif (i + j + k < 10) ways[i + j + k]++;\n\t\t\t}\n\t\t}\n\t}\n\n\tint t;\n\tcin >> t;\n\twhile (t--) {\n\t\tstring n;\n\t\tcin >> n; \n\n\t\tll ans = 1;\n\t\tfor (char ch : n) {\n\t\t\tans *= ways[ch - '0'];\n\t\t}\n\n\t\tcout << ans << '\\n';\n\t}\n\n\treturn 0;\n}"
    },
    "order": 11
  },
  {
    "id": "1555D",
    "contestId": 1555,
    "index": "D",
    "title": "Say No to Palindromes",
    "rating": 1600,
    "url": "https://codeforces.com/problemset/problem/1555/D",
    "tags": [
      "brute force",
      "constructive algorithms",
      "dp",
      "strings"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1555D+Say%20No%20to%20Palindromes+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n\t\tios::sync_with_stdio(false);\n\t\tcin.tie(nullptr);\n\t\tconst vector<string> tiles = {\"abc\", \"acb\", \"bac\", \"bca\", \"cab\", \"cba\"};\n\n\t\tint n, q;\n\t\tcin >> n >> q;\n\t\tstring s;\n\t\tcin >> s;\n\t\tvector<vector<int>> pref(6, vector<int>(n, 0));\n\t\tfor (int j = 0; j < 6; ++j) {\n\t\t\t\tfor (int i = 0; i < n; ++i) {\n\t\t\t\t\t\tif (i) pref[j][i] = pref[j][i - 1]; \n\t\t\t\t\t\tif (s[i] != tiles[j][i % 3]) ++pref[j][i]; \n\t\t\t\t}\n\t\t}\n\n\t\twhile (q--) {\n\t\t\t\tint l, r;\n\t\t\t\tcin >> l >> r;\n\t\t\t\t--l, --r; \n\n\t\t\t\tint best = r - l + 1;\n\t\t\t\tfor (int j = 0; j < 6; ++j) {\n\t\t\t\t\t\tint mismatches = pref[j][r] - (l ? pref[j][l - 1] : 0);\n\t\t\t\t\t\tbest = min(best, mismatches);\n\t\t\t\t}\n\t\t\t\tcout << best << '\\n';\n\t\t}\n\n\t\treturn 0;\n}"
    },
    "order": 12
  },
  {
    "id": "1537E1",
    "contestId": 1537,
    "index": "E1",
    "title": "Erase and Extend (Easy Version)",
    "rating": 1600,
    "url": "https://codeforces.com/problemset/problem/1537/E1",
    "tags": [
      "binary search",
      "brute force",
      "dp",
      "greedy",
      "hashing",
      "implementation",
      "string suffix structures",
      "strings",
      "two pointers"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1537E1+Erase%20and%20Extend%20(Easy%20Version)+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n\t\tios::sync_with_stdio(false);\n\t\tcin.tie(nullptr);\n\n\t\tint n, k;\n\t\tcin >> n >> k;\n\t\tstring s;\n\t\tcin >> s;\n\n\t\tstring ans(k, 'z');\n\n\t\tfor (int len = 1; len <= n; ++len) {\n\t\t\t\tstring t = s.substr(0, len); \n\n\t\t\t\n\t\t\t\twhile ((int)t.size() < k) t = t + t;\n\t\t\t\tt = t.substr(0, k);\n\t\t\t\tans = min(ans, t);\n\t\t}\n\n\t\tcout << ans << '\\n';\n\t\treturn 0;\n}"
    },
    "order": 13
  },
  {
    "id": "1528A",
    "contestId": 1528,
    "index": "A",
    "title": "Parsa's Humongous Tree",
    "rating": 1600,
    "url": "https://codeforces.com/problemset/problem/1528/A",
    "tags": [
      "dfs and similar",
      "divide and conquer",
      "dp",
      "greedy",
      "trees"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1528A+Parsa's%20Humongous%20Tree+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nusing ll = long long;\nstatic void dfs(\n\t\tint x,\n\t\tint p,\n\t\tconst vector<pair<int, int>>& bounds,\n\t\tconst vector<vector<int>>& adj,\n\t\tvector<array<long long, 2>>& dp) {\n\tfor (int y : adj[x]) {\n\t\tif (y == p) continue; \n\t\tdfs(y, x, bounds, adj, dp);\n\n\t\tdp[x][0] += max(\n\t\t\tdp[y][0] + llabs(bounds[x].first - bounds[y].first),\n\t\t\tdp[y][1] + llabs(bounds[x].first - bounds[y].second)\n\t\t);\n\n\t\tdp[x][1] += max(\n\t\t\tdp[y][0] + llabs(bounds[x].second - bounds[y].first),\n\t\t\tdp[y][1] + llabs(bounds[x].second - bounds[y].second)\n\t\t);\n\t}\n}\n\nint main() {\n\tios::sync_with_stdio(false);\n\tcin.tie(nullptr);\n\n\tint tc;\n\tcin >> tc;\n\twhile (tc--) {\n\t\tint n;\n\t\tcin >> n;\n\n\t\tvector<pair<int, int>> bounds(n); \n\t\tfor (auto& pr : bounds) cin >> pr.first >> pr.second;\n\n\t\tvector<vector<int>> adj(n);\n\t\tfor (int i = 0; i < n - 1; ++i) {\n\t\t\tint u, w;\n\t\t\tcin >> u >> w;\n\t\t\t--u, --w; \n\t\t\tadj[u].push_back(w);\n\t\t\tadj[w].push_back(u);\n\t\t}\n\n\t\tvector<array<long long, 2>> dp(n, {0, 0}); \n\n\t\tdfs(0, -1, bounds, adj, dp); \n\n\t\tcout << max(dp[0][0], dp[0][1]) << '\\n'; \n\t}\n\n\treturn 0;\n}"
    },
    "order": 14
  },
  {
    "id": "1498C",
    "contestId": 1498,
    "index": "C",
    "title": "Planar Reflections",
    "rating": 1600,
    "url": "https://codeforces.com/problemset/problem/1498/C",
    "tags": [
      "brute force",
      "data structures",
      "dp"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1498C+Planar%20Reflections+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nconst int mod = 1e9 + 7;\n\nint main() {\n\tios::sync_with_stdio(false);\n\tcin.tie(nullptr);\n\n\tint tc;\n\tcin >> tc;\n\twhile (tc--) {\n\t\tint n, k;\n\t\tcin >> n >> k;\n\t\tint dp[n][k][2];\n\n\n\t\tfor (int i = 0; i < n; i++) dp[i][0][0] = dp[i][0][1] = 1;\n\n\n\t\tfor (int j = 1; j < k; j++) {\n\t\t\tfor (int i = n - 1; i >= 0; i--) {\n\t\t\t\tint v1 = 1, v2 = 1;\n\t\t\t\tif (i - 1 >= 0) v1 = dp[i - 1][j - 1][0];\n\t\t\t\tif (i + 1 < n) v2 = dp[i + 1][j][1];\n\t\t\t\tdp[i][j][1] = (v1 + v2) % mod;\n\t\t\t}\n\n\t\t\tfor (int i = 0; i < n; i++) {\n\t\t\t\tint v1 = 1, v2 = 1;\n\t\t\t\tif (i - 1 >= 0) v1 = dp[i - 1][j][0];].\n\t\t\t\tif (i + 1 < n) v2 = dp[i + 1][j - 1][1];\n\t\t\t\tdp[i][j][0] = (v1 + v2) % mod;\n\t\t\t}\n\t\t}\n\n\t\tcout << dp[0][k - 1][1] << '\\n';\n\t}\n\n\treturn 0;\n}"
    },
    "order": 15
  },
  {
    "id": "1475E",
    "contestId": 1475,
    "index": "E",
    "title": "Advertising Agency",
    "rating": 1600,
    "url": "https://codeforces.com/problemset/problem/1475/E",
    "tags": [
      "combinatorics",
      "math",
      "sortings"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1475E+Advertising%20Agency+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nusing ll = long long;\nconst ll MOD = 1000000007;\n\nll mul(ll a, ll b, ll m = MOD) { return ((a % m) * (b % m)) % m; }\n\nll modexp(ll a, ll e, ll m = MOD) {\n\t\ta %= m;\n\t\tll r = 1;\n\t\twhile (e) {\n\t\t\t\tif (e & 1) r = mul(r, a, m); \n\t\t\t\ta = mul(a, a, m);           \n\t\t\t\te >>= 1;                  \n\t\t}\n\t\treturn r;\n}\n\nll inv(ll a, ll m = MOD) { return modexp(a, m - 2, m); }\n\nint main() {\n\t\tios_base::sync_with_stdio(false);\n\t\tcin.tie(nullptr);\n\n\t\tint tc;\n\t\tcin >> tc;\n\t\twhile (tc--) {\n\t\t\t\tint n, k;\n\t\t\t\tcin >> n >> k;\n\t\t\t\tvector<int> a(n);\n\t\t\t\tfor (auto &x : a) cin >> x;\n\n\t\t\t\tsort(a.rbegin(), a.rend());\n\n\t\t\t\tint N = 0, R = 0;\n\t\t\t\tfor (int i = 0; i < n; i++) {\n\t\t\t\t\t\tif (a[i] == a[k - 1]) {\n\t\t\t\t\t\t\t\tN++;                \n\t\t\t\t\t\t\t\tif (i < k) R++;      \n\t\t\t\t\t\t}\n\t\t\t\t}\n\n\t\t\t\tll val = 1;\n\t\t\t\tfor (int i = 1; i <= R; i++) {\n\t\t\t\t\t\tval = mul(val, N - i + 1);\n\t\t\t\t\t\tval = mul(val, inv(i));\n\t\t\t\t}\n\n\t\t\t\tcout << val << '\\n';\n\t\t}\n\n\t\treturn 0;\n}"
    },
    "order": 16
  },
  {
    "id": "1458A",
    "contestId": 1458,
    "index": "A",
    "title": "Row GCD",
    "rating": 1600,
    "url": "https://codeforces.com/problemset/problem/1458/A",
    "tags": [
      "math",
      "number theory"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1458A+Row%20GCD+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nusing ll = long long;\n\nint main() {\n\t\tios_base::sync_with_stdio(false);\n\t\tcin.tie(nullptr);\n\n\t\tll n, m;\n\t\tcin >> n >> m;\n\n\t\tvector<ll> a(n);\n\t\tfor (ll i = 0; i < n; i++) cin >> a[i];\n\n\t\tll g = 0;\n\t\tfor (ll i = 1; i < n; i++) g = std::gcd(g, a[i] - a[0]);\n\n\t\tfor (ll i = 0; i < m; i++) {\n\t\t\tll x;\n\t\t\tcin >> x;\n\t\t\tcout << std::gcd(x + a[0], g) << \" \";\n\t\t}\n\n\t\treturn 0;\n}"
    },
    "order": 17
  },
  {
    "id": "1407C",
    "contestId": 1407,
    "index": "C",
    "title": "Chocolate Bunny",
    "rating": 1600,
    "url": "https://codeforces.com/problemset/problem/1407/C",
    "tags": [
      "constructive algorithms",
      "interactive",
      "math",
      "two pointers"
    ],
    "hint": "Notice that as the right pointer expands, the left pointer only needs to move forward. Maintain frequency counts or window invariants to keep the window valid in O(N) overall.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1407C+Chocolate%20Bunny+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n\t\tint n;\n\t\tcin >> n;\n\t\tvector<int> ans(n); \n\n\t\tstack<int> pos_left; \n\t\tunordered_set<int> vals_left;\n\t\tfor (int i = 0; i < n; i++) {\n\t\t\t\tpos_left.push(i);\n\t\t\t\tvals_left.insert(i + 1);\n\t\t}\n\n\t\twhile (pos_left.size() >= 2) {\n\t\t\t\tint x = pos_left.top();\n\t\t\t\tpos_left.pop();\n\t\t\t\tint y = pos_left.top();\n\t\t\t\tpos_left.pop();\n\n\t\t\t\tcout << \"? \" << x + 1 << \" \" << y + 1 << endl; \n\t\t\t\tint a1;\n\t\t\t\tcin >> a1;\n\t\t\t\tcout << \"? \" << y + 1 << \" \" << x + 1 << endl; \n\t\t\t\tint a2;\n\t\t\t\tcin >> a2;\n\t\t\t\tvals_left.erase(max(a1, a2));\n\n\t\t\t\tif (a1 > a2) {\n\t\t\t\t\t\tans[x] = a1;\n\t\t\t\t\t\tpos_left.push(y);\n\t\t\t\t} else {\n\t\t\t\t\t\tans[y] = a2;\n\t\t\t\t\t\tpos_left.push(x);\n\t\t\t\t}\n\t\t}\n\n\t\tint v = *vals_left.begin();\n\t\tans[pos_left.top()] = v;\n\n\t\tcout << \"! \";\n\t\tfor (auto x : ans) cout << x << \" \";\n\t\tcout << endl;\n\n\t\treturn 0;\n}"
    },
    "order": 18
  },
  {
    "id": "1398C",
    "contestId": 1398,
    "index": "C",
    "title": "Good Subarrays",
    "rating": 1600,
    "url": "https://codeforces.com/problemset/problem/1398/C",
    "tags": [
      "data structures",
      "dp",
      "math"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1398C+Good%20Subarrays+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nusing ll = long long;\n\nint main() {\n\tios_base::sync_with_stdio(false);\n\tcin.tie(nullptr);\n\n\tint tc;\n\tcin >> tc;\n\twhile (tc--) {\n\t\tint n;\n\t\tcin >> n;\n\t\tstring s;\n\t\tcin >> s;\n\t\tunordered_map<int, int> mp;\n\t\tmp[0]++;\n\n\t\tint pref = 0; \n\t\tfor (int i = 0; i < n; i++) {\n\t\t\tpref += (s[i] - '0');\n\t\t\tmp[pref - (i + 1)]++;\n\t\t}\n\n\t\tll ans = 0;\n\t\tfor (auto &[key, cnt] : mp) {\n\t\t\tans += (ll)cnt * (cnt - 1) / 2;\n\t\t}\n\n\t\tcout << ans << \"\\n\";\n\t}\n\n\treturn 0;\n}"
    },
    "order": 19
  },
  {
    "id": "1389B",
    "contestId": 1389,
    "index": "B",
    "title": "Array Walk",
    "rating": 1600,
    "url": "https://codeforces.com/problemset/problem/1389/B",
    "tags": [
      "brute force",
      "dp",
      "greedy"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1389B+Array%20Walk+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nusing ll = long long;\n\nint main() {\n\t\tios::sync_with_stdio(false);\n\t\tcin.tie(nullptr);\n\n\t\tint tc;\n\t\tcin >> tc;\n\t\twhile (tc--) {\n\t\t\t\tint n, k, Z;\n\t\t\t\tcin >> n >> k >> Z;\n\n\t\t\t\tvector<int> a(n);\n\t\t\t\tfor (auto &x : a) cin >> x;\n\n\t\t\t\tll ans = 0;\n\t\t\t\tfor (int z = 0; z <= Z && 2 * z <= k; ++z) {\n\t\t\t\t\t\tint r = k - 2 * z;  \n\t\t\t\t\t\tll base = accumulate(a.begin(), a.begin() + r + 1, 0LL);  \n\t\t\t\t\t\tint bestPair = 0;\n\t\t\t\t\t\tfor (int i = 1; i <= min(r + 1, n - 1); ++i) {\n\t\t\t\t\t\t\t\tbestPair = max(bestPair, a[i] + a[i - 1]);\n\t\t\t\t\t\t}\n\t\t\t\t\t\tll res = base + 1LL * z * bestPair;\n\t\t\t\t\t\tans = max(ans, res);\n\t\t\t\t}\n\n\t\t\t\tcout << ans << '\\n';\n\t\t}\n\n\t\treturn 0;\n}"
    },
    "order": 20
  },
  {
    "id": "1349A",
    "contestId": 1349,
    "index": "A",
    "title": "Orac and LCM",
    "rating": 1600,
    "url": "https://codeforces.com/problemset/problem/1349/A",
    "tags": [
      "data structures",
      "math",
      "number theory"
    ],
    "hint": "Speed up operations from O(N) to O(log N) using appropriate containers like std::set, std::map, or a Fenwick/Segment Tree for dynamic range queries and updates.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1349A+Orac%20and%20LCM+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nusing ll = long long;\n\nint main() {\n\t\tios_base::sync_with_stdio(false);\n\t\tcin.tie(nullptr);\n\n\n\t\tconst int NMAX = (int)(3e5);\n\t\tbitset<NMAX / 2> bits;      \n\t\tbits.set();                \n\t\tvector<int> primes = {2};  \n\t\tfor (int i = 3; i / 2 < (int)bits.size(); i = 2 * bits._Find_next(i / 2) + 1) {\n\t\t\t\tprimes.push_back(i);  \n\t\t\t\tfor (long long j = 1LL * i * i / 2; j < (int)bits.size(); j += i) bits[(size_t)j] = 0;\n\t\t}\n\n\t\tint n;\n\t\tcin >> n;\n\n\t\tunordered_map<int, int> cnt_prime;\n\t\tunordered_map<int, vector<int>> cnt_pair_prime;\n\n\t\tfor (int i = 0; i < n; i++) {\n\t\t\t\tint x;\n\t\t\t\tcin >> x;\n\n\t\t\t\tfor (int p : primes) {\n\t\t\t\t\t\tif (1LL * p * p > x) break;\n\t\t\t\t\t\tif (x % p != 0) continue;\n\n\t\t\t\t\t\tint e = 0;              \n\t\t\t\t\t\twhile (x % p == 0) {\n\t\t\t\t\t\t\t\t++e;\n\t\t\t\t\t\t\t\tx /= p;\n\t\t\t\t\t\t}\n\t\t\t\t\t\t++cnt_prime[p];\n\t\t\t\t\t\tauto &vec = cnt_pair_prime[p];\n\t\t\t\t\t\tvec.push_back(e);\n\t\t\t\t\t\tsort(vec.begin(), vec.end());\n\t\t\t\t\t\tif (vec.size() > 2) vec.pop_back(); \n\t\t\t\t}\n\n\t\t\t\tif (x > 1) {\n\t\t\t\t\t\t++cnt_prime[x];\n\t\t\t\t\t\tauto &vec = cnt_pair_prime[x];\n\t\t\t\t\t\tvec.push_back(1);\n\t\t\t\t\t\tsort(vec.begin(), vec.end());\n\t\t\t\t\t\tif (vec.size() > 2) vec.pop_back();\n\t\t\t\t}\n\t\t}\n\t\tll ans = 1;\n\t\tfor (int p : primes) {\n\t\t\t\tif (cnt_prime[p] < n - 1) continue;\n\n\t\t\t\tint e = 0;\n\t\t\t\tconst auto it = cnt_pair_prime.find(p);\n\t\t\t\tif (it != cnt_pair_prime.end()) {\n\t\t\t\t\t\tconst auto &vec = it->second; \n\t\t\t\t\t\te = (cnt_prime[p] == n ? vec[1] : vec[0]);\n\t\t\t\t}\n\n\t\t\t\twhile (e--) ans *= p;\n\t\t}\n\n\t\tcout << ans << '\\n';\n\t\treturn 0;\n}"
    },
    "order": 21
  },
  {
    "id": "1886C",
    "contestId": 1886,
    "index": "C",
    "title": "Decreasing String",
    "rating": 1600,
    "url": "https://codeforces.com/problemset/problem/1886/C",
    "tags": [
      "implementation",
      "strings"
    ],
    "hint": "Track character frequencies, prefixes, or palindrome symmetry. Often checking prefix and suffix matches in linear time avoids costly quadratic nested loops.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1886C+Decreasing%20String+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nusing ll = long long;\n\nint main() {\n\t\tios_base::sync_with_stdio(false);\n\t\tcin.tie(nullptr);\n\n\t\tint tc;\n\t\tcin >> tc;\n\t\twhile (tc--) {\n\t\t\t\tstring s;\n\t\t\t\tcin >> s;\n\t\t\t\tll n = (ll)s.size(); \n\t\t\t\tll pos;\n\t\t\t\tcin >> pos; \n\n\t\t\t\tstring stk; \n\t\t\t\tstk.reserve(s.size());\n\n\t\t\t\tfor (char c : s) {\n\t\t\t\t\t\twhile (!stk.empty() && stk.back() > c && pos > n) {\n\t\t\t\t\t\t\t\tstk.pop_back();\n\t\t\t\t\t\t\t\tpos -= n; \n\t\t\t\t\t\t\t\t--n;      \n\t\t\t\t\t\t}\n\t\t\t\t\t\tstk.push_back(c);\n\t\t\t\t}\n\t\t\t\twhile (pos > n) {\n\t\t\t\t\t\tstk.pop_back();\n\t\t\t\t\t\tpos -= n;\n\t\t\t\t\t\t--n;\n\t\t\t\t}\n\t\t\t\tcout << stk[(size_t)pos - 1];\n\t\t}\n\n\t\treturn 0;\n}"
    },
    "order": 22
  },
  {
    "id": "1336A",
    "contestId": 1336,
    "index": "A",
    "title": "Linova and Kingdom",
    "rating": 1600,
    "url": "https://codeforces.com/problemset/problem/1336/A",
    "tags": [
      "dfs and similar",
      "dp",
      "greedy",
      "sortings",
      "trees"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1336A+Linova%20and%20Kingdom+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint n, k;\nvector<vector<int>> adj;  \n    vector<int> d;             \nvector<int> s;             \nvector<int> v;              \nvoid dfs(int x, int p) {\n\tfor (int y : adj[x]) {\n\t\tif (y == p) continue;                 \n\t\td[y] = d[x] + 1;                      \n\t\tdfs(y, x);\n\t\ts[x] += s[y] + 1;                     \n\t}\n\tv[x] = d[x] - s[x];                        \n}\n\nint main() {\n\tios::sync_with_stdio(false);\n\tcin.tie(nullptr);\n\n\tcin >> n >> k;\n\tadj.resize(n);\n\tfor (int i = 0; i < n - 1; i++) {\n\t\tint x, y;\n\t\tcin >> x >> y;\n\t\tx--, y--;                            \n\t\tadj[x].push_back(y);\n\t\tadj[y].push_back(x);\n\t}\n\n\td.assign(n, 0);\n\ts.assign(n, 0);\n\tv.assign(n, 0);\n\tdfs(0, -1);                              \n\n\tsort(v.rbegin(), v.rend());          \n\tlong long ans = accumulate(v.begin(), v.begin() + k, 0LL);\n\tcout << ans << '\\n';\n\n\treturn 0;\n}"
    },
    "order": 23
  },
  {
    "id": "1305C",
    "contestId": 1305,
    "index": "C",
    "title": "Kuroni and Impossible Calculation",
    "rating": 1600,
    "url": "https://codeforces.com/problemset/problem/1305/C",
    "tags": [
      "brute force",
      "combinatorics",
      "math",
      "number theory"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1305C+Kuroni%20and%20Impossible%20Calculation+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n\t\tint n, m;\n\t\tcin >> n >> m;\n\n\t\tvector<int> a(n);\n\t\tfor (auto &x : a) cin >> x;\n\n\t\tif (n > m) {\n\t\t\t\tcout << 0;\n\t\t\t\treturn 0;\n\t\t}\n\n\t\tint ans = 1;\n\t\tfor (int i = 0; i < n; i++) {\n\t\t\t\tfor (int j = i + 1; j < n; j++) {\n\t\t\t\t\t\tans = (ans * (abs(a[j] - a[i]) % m)) % m;\n\t\t\t\t}\n\t\t}\n\n\t\tcout << ans;\n\t\treturn 0;\n}"
    },
    "order": 24
  },
  {
    "id": "1856C",
    "contestId": 1856,
    "index": "C",
    "title": "To Become Max",
    "rating": 1600,
    "url": "https://codeforces.com/problemset/problem/1856/C",
    "tags": [
      "binary search",
      "brute force",
      "data structures",
      "dp"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1856C+To%20Become%20Max+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nusing ll = long long;\n\nint n, k;\nvector<int> a;\n\nbool check(int x) {\n\t\tfor (int i = 0; i < n; i++) {\n\t\t\t\tll cost = 0; \n\t\t\t\tfor (int j = i, y = x; j < n; j++, y--) {\n\t\t\t\t\t\tif (y <= a[j]) break;\n\t\t\t\t\t\tif (j == n - 1) cost += (int)1e9;\n\t\t\t\t\t\telse cost += (y - a[j]); \n\t\t\t\t}\n\t\t\t\tif (cost <= k) return true;\n\t\t}\n\t\treturn false;\n}\n\nint main() {\n\t\tios::sync_with_stdio(false);\n\t\tcin.tie(nullptr);\n\n\t\tint tc;\n\t\tcin >> tc;\n\t\twhile (tc--) {\n\t\t\t\tcin >> n >> k;\n\t\t\t\ta.resize(n);\n\t\t\t\tfor (auto &x : a) cin >> x;\n\n\t\t\t\tint l = *max_element(a.begin(), a.end());\n\t\t\t\tint r = l + n;\n\t\t\t\tint ans = l;\n\n\t\t\t\twhile (l <= r) {\n\t\t\t\t\t\tint mid = (l + r) / 2;\n\t\t\t\t\t\tif (check(mid)) {\n\t\t\t\t\t\t\t\tans = mid;\n\t\t\t\t\t\t\t\tl = mid + 1;\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\t\tr = mid - 1;\n\t\t\t\t\t\t}\n\t\t\t\t}\n\n\t\t\t\tcout << ans << '\\n';\n\t\t}\n\t\treturn 0;\n}"
    },
    "order": 25
  },
  {
    "id": "1843E",
    "contestId": 1843,
    "index": "E",
    "title": "Tracking Segments",
    "rating": 1600,
    "url": "https://codeforces.com/problemset/problem/1843/E",
    "tags": [
      "binary search",
      "brute force",
      "data structures",
      "two pointers"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1843E+Tracking%20Segments+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint n, m, q;                  \nvector<pair<int, int>> seg;   \nvector<int> qry;              \n\nbool check(int x) {\n\tvector<int> a(n, 0);                 \n\tfor (int i = 0; i < x; i++) {\n\t\ta[qry[i]] = 1;                 \n\t}\n\n\tfor (int i = 1; i < n; i++) a[i] += a[i - 1];  \n\n\tfor (auto &[l, r] : seg) {\n\t\tint sum = a[r] - (l > 0 ? a[l - 1] : 0);   \n\t\tif (sum > (r - l + 1) / 2) return true;     \n\t}\n\treturn false;                                  \n}\n\nint main() {\n\tios_base::sync_with_stdio(false);\n\tcin.tie(nullptr);\n\n\tint tc; cin >> tc;\n\twhile (tc--) {\n\t\tcin >> n >> m;\n\t\tseg.resize(m);\n\t\tfor (auto &[l, r] : seg) {\n\t\t\tcin >> l >> r; l--; r--;            \n\t\t}\n\n\t\tcin >> q;\n\t\tqry.resize(q);\n\t\tfor (auto &x : qry) {\n\t\t\tcin >> x; x--;                   \n\t\t}\n\n\t\tint l = 1, r = q, ans = INT_MAX;      \n\t\twhile (l <= r) {\n\t\t\tint mid = (l + r) / 2;           \n\t\t\tif (check(mid)) {                 \n\t\t\t\tans = min(ans, mid);          \n\t\t\t\tr = mid - 1;                  \n\t\t\t} else {\n\t\t\t\tl = mid + 1;                  \n\t\t\t}\n\t\t}\n\n\t\tcout << (ans == INT_MAX ? -1 : ans) << '\\n';\n\t}\n\n\treturn 0;\n}"
    },
    "order": 26
  },
  {
    "id": "1833E",
    "contestId": 1833,
    "index": "E",
    "title": "Round Dance",
    "rating": 1600,
    "url": "https://codeforces.com/problemset/problem/1833/E",
    "tags": [
      "dfs and similar",
      "dsu",
      "graphs",
      "shortest paths"
    ],
    "hint": "Represent the input as an adjacency list. Use BFS/DFS traversal to discover reachable components, compute shortest hops in unweighted graphs, or detect bipartite coloring.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1833E+Round%20Dance+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint n;\nvector<int> vis;             \nvector<vector<int>> adj;       \n\nvoid dfs(int i, int &cycle, int &len) {\n\t\tvis[i] = true;          \n\t\tlen++;                  \n\t\tif (adj[i].size() < 2)   \n\t\t\t\tcycle = false;\n\n\t\tfor (auto j : adj[i]) {\n\t\t\t\tif (vis[j]) continue;\n\t\t\t\tdfs(j, cycle, len);\n\t\t}\n}\n\nint main() {\n\t\tios_base::sync_with_stdio(false);\n\t\tcin.tie(nullptr);\n\n\t\tint tc;\n\t\tcin >> tc;\n\t\twhile (tc--) {\n\t\t\t\tcin >> n;\n\t\t\t\tadj.assign(n, {});\n\t\t\t\tvis.assign(n, false);\n\n\t\t\t\tfor (int i = 0; i < n; i++) {\n\t\t\t\t\t\tint x;\n\t\t\t\t\t\tcin >> x;\n\t\t\t\t\t\tx--;                  \n\t\t\t\t\t\tadj[i].push_back(x);\n\t\t\t\t\t\tadj[x].push_back(i);\n\t\t\t\t}\n\n\t\t\t\tint b = 0, c = 0;        \n\t\t\t\tfor (int i = 0; i < n; i++) {\n\t\t\t\t\t\tif (vis[i]) continue;\n\t\t\t\t\t\tint cycle = 1, len = 0;\n\t\t\t\t\t\tdfs(i, cycle, len);\n\t\t\t\t\t\tif (cycle && len > 2)\n\t\t\t\t\t\t\t\tc++;\n\t\t\t\t\t\telse\n\t\t\t\t\t\t\t\tb++;\n\t\t\t\t}\n\t\t\t\tif (b)\n\t\t\t\t\t\tcout << c + 1 << \" \" << c + b << \"\\n\";\n\t\t\t\telse\n\t\t\t\t\t\tcout << c << \" \" << c << \"\\n\";\n\t\t}\n\n\t\treturn 0;\n}"
    },
    "order": 27
  },
  {
    "id": "1829G",
    "contestId": 1829,
    "index": "G",
    "title": "Hits Different",
    "rating": 1600,
    "url": "https://codeforces.com/problemset/problem/1829/G",
    "tags": [
      "data structures",
      "dp",
      "implementation",
      "math"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1829G+Hits%20Different+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nusing ll = long long;\n\nint main() {\n\t\tios_base::sync_with_stdio(false);\n\t\tcin.tie(nullptr);\n\n\t\tconst int RC = 2023;\n\t\tconst int N_max = RC * (RC + 1) / 2;\n\n\t\tvector<ll> dp1(N_max, 0), dp2(N_max, 0);\n\n\tdp1[0] = dp2[0] = 1;\n\n\tll idx = 1;\n\t\tfor (int rc = 1; rc < RC; rc++) {\n\t\t\t\tint prev_row = idx - rc;\n\t\t\t\tfor (int i = 0; i <= rc; i++) {\n\t\t\t\t\t\tll cur = (ll)(idx + 1) * (idx + 1);\n\n\t\t\t\tdp1[idx] = cur + ((i > 0) ? dp1[prev_row + i - 1] : 0LL);\n\n\t\t\t\t\t\tdp2[idx] = dp1[idx] + ((i < rc) ? dp2[prev_row + i] : 0LL);\n\n\t\t\t\t\t\tidx++;\n\t\t\t\t}\n\t\t}\n\n\t\tint tc;\n\t\tcin >> tc;\n\t\twhile (tc--) {\n\t\t\t\tint n;\n\t\t\t\tcin >> n;\n\t\t\t\t--n;\n\t\t\t\tcout << dp2[n] << '\\n';\n\t\t}\n\n\t\treturn 0;\n}"
    },
    "order": 28
  },
  {
    "id": "1798D",
    "contestId": 1798,
    "index": "D",
    "title": "Shocking Arrangement",
    "rating": 1600,
    "url": "https://codeforces.com/problemset/problem/1798/D",
    "tags": [
      "constructive algorithms",
      "greedy",
      "math"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1798D+Shocking%20Arrangement+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nusing ll = long long;\n\nint main() {\n\t\tios_base::sync_with_stdio(false);\n\t\tcin.tie(nullptr);\n\n\t\tint tc;\n\t\tcin >> tc;\n\t\twhile (tc--) {\n\t\t\t\tint n;\n\t\t\t\tcin >> n;\n\t\t\t\tvector<int> v(n);\n\n\t\t\t\tbool hasNonZero = false; \n\t\t\t\tfor (auto &x : v) {\n\t\t\t\t\t\tcin >> x;\n\t\t\t\t\t\thasNonZero |= (x != 0);\n\t\t\t\t}\n\t\t\t\tif (!hasNonZero) {\n\t\t\t\t\t\tcout << \"No\\n\";\n\t\t\t\t\t\tcontinue;\n\t\t\t\t}\n\t\t\t\tcout << \"Yes\\n\";\n\n\t\t\t\tvector<int> pos, neg;\n\t\t\t\tfor (auto &x : v) {\n\t\t\t\t\t\tif (x >= 0)\n\t\t\t\t\t\t\t\tpos.push_back(x); \n\t\t\t\t\t\telse\n\t\t\t\t\t\t\t\tneg.push_back(x);\n\t\t\t\t}\n\n\t\t\t\tvector<int> ans(n);\n\t\t\t\tll psum = 0; \n\t\t\t\tfor (int i = 0; i < n; i++) {\n\t\t\t\t\t\tif (psum <= 0 && !pos.empty()) {\n\t\t\t\t\t\t\t\tans[i] = pos.back();\n\t\t\t\t\t\t\t\tpos.pop_back();\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\t\tans[i] = neg.back();\n\t\t\t\t\t\t\t\tneg.pop_back();\n\t\t\t\t\t\t}\n\t\t\t\t\t\tpsum += ans[i];\n\t\t\t\t}\n\n\t\t\t\tfor (auto &x : ans) cout << x << ' ';\n\t\t\t\tcout << '\\n';\n\t\t}\n\n\t\treturn 0;\n}"
    },
    "order": 29
  },
  {
    "id": "1795D",
    "contestId": 1795,
    "index": "D",
    "title": "Triangle Coloring",
    "rating": 1600,
    "url": "https://codeforces.com/problemset/problem/1795/D",
    "tags": [
      "combinatorics",
      "math"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1795D+Triangle%20Coloring+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nusing ll = long long;\n\nconst ll MOD = 998244353;\n\nll add(ll a, ll b, ll m = MOD) { return ((a % m) + (b % m) + m) % m; }\nll sub(ll a, ll b, ll m = MOD) { return ((a % m) - (b % m) + m) % m; }\nll mul(ll a, ll b, ll m = MOD) { return ((a % m) * (b % m)) % m; }\nll modexp(ll a, ll e, ll m = MOD) {\n\t\ta %= m;\n\t\tll r = 1;\n\t\twhile (e) {\n\t\t\t\tif (e & 1) r = mul(r, a, m); \n\t\t\t\ta = mul(a, a, m); \n\t\t\t\te >>= 1;\n\t\t}\n\t\treturn r;\n}\nll inv(ll a, ll m = MOD) { return modexp(a, m - 2, m); }\n\nint main() {\n\t\tios::sync_with_stdio(false);\n\t\tcin.tie(nullptr);\n\n\t\tint n;\n\t\tcin >> n;\n\t\tint T = n / 3;\n\t\tint K = n / 6;\n\n\t\tll ans = 1;\n\t\tfor (int i = 1; i <= K; ++i) {\n\t\t\t\tans = mul(ans, T - i + 1); \n\t\t\t\tans = mul(ans, inv(i));    \n\t\t}\n\n\t\tvector<int> e(3); \n\t\tfor (int i = 0; i < n; ++i) {\n\t\t\t\tint w;\n\t\t\t\tcin >> w;\n\t\t\t\te[i % 3] = w; \n\n\t\t\t\tif (i % 3 == 2) {\n\t\t\t\t\t\tsort(e.begin(), e.end());\n\t\t\t\t\t\tint m = 1;          \n\t\t\t\t\t\tif (e[0] == e[1]) ++m; \n\t\t\t\t\t\tif (e[0] == e[2]) ++m; \n\t\t\t\t\t\tans = mul(ans, m);\n\t\t\t\t}\n\t\t}\n\t\tcout << ans;\n\t\treturn 0;\n}"
    },
    "order": 30
  },
  {
    "id": "1526C2",
    "contestId": 1526,
    "index": "C2",
    "title": "Potions (Hard Version)",
    "rating": 1600,
    "url": "https://codeforces.com/problemset/problem/1526/C2",
    "tags": [
      "data structures",
      "greedy"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1526C2+Potions%20(Hard%20Version)+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 31
  },
  {
    "id": "1633D",
    "contestId": 1633,
    "index": "D",
    "title": "Make Them Equal",
    "rating": 1600,
    "url": "https://codeforces.com/problemset/problem/1633/D",
    "tags": [
      "dp",
      "greedy"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1633D+Make%20Them%20Equal+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    vector<long long> dp(n + 1, 0);\n    for (int i = 0; i < n; i++) {\n        dp[i + 1] = max(dp[i], dp[i] + a[i]);\n    }\n    cout << dp[n] << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 32
  },
  {
    "id": "1514C",
    "contestId": 1514,
    "index": "C",
    "title": "Product 1 Modulo N",
    "rating": 1600,
    "url": "https://codeforces.com/problemset/problem/1514/C",
    "tags": [
      "greedy",
      "number theory"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1514C+Product%201%20Modulo%20N+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 33
  },
  {
    "id": "1519D",
    "contestId": 1519,
    "index": "D",
    "title": "Maximum Sum of Products",
    "rating": 1600,
    "url": "https://codeforces.com/problemset/problem/1519/D",
    "tags": [
      "brute force",
      "dp",
      "implementation",
      "math",
      "two pointers"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1519D+Maximum%20Sum%20of%20Products+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    vector<long long> dp(n + 1, 0);\n    for (int i = 0; i < n; i++) {\n        dp[i + 1] = max(dp[i], dp[i] + a[i]);\n    }\n    cout << dp[n] << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 34
  },
  {
    "id": "1907E",
    "contestId": 1907,
    "index": "E",
    "title": "Good Triples",
    "rating": 1600,
    "url": "https://codeforces.com/problemset/problem/1907/E",
    "tags": [
      "brute force",
      "combinatorics",
      "number theory"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1907E+Good%20Triples+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 35
  },
  {
    "id": "1513C",
    "contestId": 1513,
    "index": "C",
    "title": "Add One",
    "rating": 1600,
    "url": "https://codeforces.com/problemset/problem/1513/C",
    "tags": [
      "dp",
      "matrices"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1513C+Add%20One+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    vector<long long> dp(n + 1, 0);\n    for (int i = 0; i < n; i++) {\n        dp[i + 1] = max(dp[i], dp[i] + a[i]);\n    }\n    cout << dp[n] << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 36
  },
  {
    "id": "1542C",
    "contestId": 1542,
    "index": "C",
    "title": "Strange Function",
    "rating": 1600,
    "url": "https://codeforces.com/problemset/problem/1542/C",
    "tags": [
      "math",
      "number theory"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1542C+Strange%20Function+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 37
  },
  {
    "id": "2129B",
    "contestId": 2129,
    "index": "B",
    "title": "Stay or Mirror",
    "rating": 1600,
    "url": "https://codeforces.com/problemset/problem/2129/B",
    "tags": [
      "brute force",
      "data structures",
      "dp",
      "greedy",
      "sortings"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+2129B+Stay%20or%20Mirror+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    vector<long long> dp(n + 1, 0);\n    for (int i = 0; i < n; i++) {\n        dp[i + 1] = max(dp[i], dp[i] + a[i]);\n    }\n    cout << dp[n] << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 38
  },
  {
    "id": "1622C",
    "contestId": 1622,
    "index": "C",
    "title": "Set or Decrease",
    "rating": 1600,
    "url": "https://codeforces.com/problemset/problem/1622/C",
    "tags": [
      "binary search",
      "brute force",
      "greedy",
      "sortings"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1622C+Set%20or%20Decrease+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nbool check(long long mid, const vector<long long>& a, int n, long long k) {\n    long long count = 0;\n    for (int i = 0; i < n; i++) {\n        count += mid / a[i];\n    }\n    return count >= k;\n}\n\nvoid solve() {\n    int n;\n    long long k;\n    if (!(cin >> n >> k)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    long long low = 1, high = 1e18, ans = high;\n    while (low <= high) {\n        long long mid = low + (high - low) / 2;\n        if (check(mid, a, n, k)) {\n            ans = mid;\n            high = mid - 1;\n        } else {\n            low = mid + 1;\n        }\n    }\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 39
  },
  {
    "id": "1707A",
    "contestId": 1707,
    "index": "A",
    "title": "Doremy's IQ",
    "rating": 1600,
    "url": "https://codeforces.com/problemset/problem/1707/A",
    "tags": [
      "binary search",
      "constructive algorithms",
      "greedy",
      "implementation"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1707A+Doremy's%20IQ+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nbool check(long long mid, const vector<long long>& a, int n, long long k) {\n    long long count = 0;\n    for (int i = 0; i < n; i++) {\n        count += mid / a[i];\n    }\n    return count >= k;\n}\n\nvoid solve() {\n    int n;\n    long long k;\n    if (!(cin >> n >> k)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    long long low = 1, high = 1e18, ans = high;\n    while (low <= high) {\n        long long mid = low + (high - low) / 2;\n        if (check(mid, a, n, k)) {\n            ans = mid;\n            high = mid - 1;\n        } else {\n            low = mid + 1;\n        }\n    }\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 40
  },
  {
    "id": "1956C",
    "contestId": 1956,
    "index": "C",
    "title": "Nene's Magical Matrix",
    "rating": 1600,
    "url": "https://codeforces.com/problemset/problem/1956/C",
    "tags": [
      "constructive algorithms",
      "greedy",
      "math"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1956C+Nene's%20Magical%20Matrix+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 41
  },
  {
    "id": "2063C",
    "contestId": 2063,
    "index": "C",
    "title": "Remove Exactly Two",
    "rating": 1600,
    "url": "https://codeforces.com/problemset/problem/2063/C",
    "tags": [
      "brute force",
      "data structures",
      "dfs and similar",
      "dp",
      "graphs",
      "greedy",
      "sortings",
      "trees"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+2063C+Remove%20Exactly%20Two+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    vector<long long> dp(n + 1, 0);\n    for (int i = 0; i < n; i++) {\n        dp[i + 1] = max(dp[i], dp[i] + a[i]);\n    }\n    cout << dp[n] << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 42
  },
  {
    "id": "1753B",
    "contestId": 1753,
    "index": "B",
    "title": "Factorial Divisibility",
    "rating": 1600,
    "url": "https://codeforces.com/problemset/problem/1753/B",
    "tags": [
      "math",
      "number theory"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1753B+Factorial%20Divisibility+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 43
  },
  {
    "id": "1593E",
    "contestId": 1593,
    "index": "E",
    "title": "Gardener and Tree",
    "rating": 1600,
    "url": "https://codeforces.com/problemset/problem/1593/E",
    "tags": [
      "brute force",
      "data structures",
      "dfs and similar",
      "greedy",
      "implementation",
      "trees"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1593E+Gardener%20and%20Tree+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 44
  },
  {
    "id": "1527C",
    "contestId": 1527,
    "index": "C",
    "title": "Sequence Pair Weight",
    "rating": 1600,
    "url": "https://codeforces.com/problemset/problem/1527/C",
    "tags": [
      "hashing",
      "implementation",
      "math"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1527C+Sequence%20Pair%20Weight+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 45
  },
  {
    "id": "1603B",
    "contestId": 1603,
    "index": "B",
    "title": "Moderate Modular Mode",
    "rating": 1600,
    "url": "https://codeforces.com/problemset/problem/1603/B",
    "tags": [
      "constructive algorithms",
      "math",
      "number theory"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1603B+Moderate%20Modular%20Mode+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 46
  },
  {
    "id": "1775C",
    "contestId": 1775,
    "index": "C",
    "title": "Interesting Sequence",
    "rating": 1600,
    "url": "https://codeforces.com/problemset/problem/1775/C",
    "tags": [
      "bitmasks",
      "math"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1775C+Interesting%20Sequence+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 47
  },
  {
    "id": "1520F1",
    "contestId": 1520,
    "index": "F1",
    "title": "Guess the K-th Zero (Easy version)",
    "rating": 1600,
    "url": "https://codeforces.com/problemset/problem/1520/F1",
    "tags": [
      "binary search",
      "interactive"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1520F1+Guess%20the%20K-th%20Zero%20(Easy%20version)+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nbool check(long long mid, const vector<long long>& a, int n, long long k) {\n    long long count = 0;\n    for (int i = 0; i < n; i++) {\n        count += mid / a[i];\n    }\n    return count >= k;\n}\n\nvoid solve() {\n    int n;\n    long long k;\n    if (!(cin >> n >> k)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    long long low = 1, high = 1e18, ans = high;\n    while (low <= high) {\n        long long mid = low + (high - low) / 2;\n        if (check(mid, a, n, k)) {\n            ans = mid;\n            high = mid - 1;\n        } else {\n            low = mid + 1;\n        }\n    }\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 48
  },
  {
    "id": "1503A",
    "contestId": 1503,
    "index": "A",
    "title": "Balance the Bits",
    "rating": 1600,
    "url": "https://codeforces.com/problemset/problem/1503/A",
    "tags": [
      "constructive algorithms",
      "greedy"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1503A+Balance%20the%20Bits+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 49
  },
  {
    "id": "1779C",
    "contestId": 1779,
    "index": "C",
    "title": "Least Prefix Sum",
    "rating": 1600,
    "url": "https://codeforces.com/problemset/problem/1779/C",
    "tags": [
      "data structures",
      "greedy"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1779C+Least%20Prefix%20Sum+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 50
  },
  {
    "id": "2050F",
    "contestId": 2050,
    "index": "F",
    "title": "Maximum modulo equality",
    "rating": 1700,
    "url": "https://codeforces.com/problemset/problem/2050/F",
    "tags": [
      "data structures",
      "divide and conquer",
      "math",
      "number theory"
    ],
    "hint": "Speed up operations from O(N) to O(log N) using appropriate containers like std::set, std::map, or a Fenwick/Segment Tree for dynamic range queries and updates.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+2050F+Maximum%20modulo%20equality+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nlong long gcd(long long a, long long b) {\n\twhile (b != 0) {\n\t\tlong long temp = b;\n\t\tb = a % b;\n\t\ta = temp;\n\t}\n\treturn a;\n}\n\nclass SegmentTree {\nprivate:\n\tvector<long long> tree; \n\tsize_t size; \n\n\tvoid build(const vector<long long>& arr, size_t index, size_t left, size_t right) {\n\t\tif (left == right) {\n\t\t\ttree[index] = arr[left]; \n\t\t\treturn;\n\t\t}\n\t\tsize_t mid = (left + right) / 2;\n\t\tbuild(arr, 2 * index, left, mid); \n\t\tbuild(arr, 2 * index + 1, mid + 1, right);\n\t\ttree[index] = gcd(tree[2 * index], tree[2 * index + 1]); \n\t}\n\n\tlong long query(size_t index, size_t left, size_t right, size_t queryLeft, size_t queryRight) {\n\t\tif (queryLeft > right || queryRight < left) {\n\t\t\treturn 0; \n\t\t}\n\t\tif (queryLeft <= left && right <= queryRight) {\n\t\t\treturn tree[index]; \n\t\t}\n\t\tsize_t mid = (left + right) / 2;\n\t\tlong long leftGCD = query(2 * index, left, mid, queryLeft, queryRight); \n\t\tlong long rightGCD = query(2 * index + 1, mid + 1, right, queryLeft, queryRight); \n\t\treturn gcd(leftGCD, rightGCD); \n\t}\n\npublic:\n\tSegmentTree(const vector<long long>& arr) : size(arr.size()) {\n\t\tif (size > 0) {\n\t\t\ttree.resize(4 * size); \n\t\t\tbuild(arr, 1, 0, size - 1); \n\t\t}\n\t}\n\n\tlong long rangeGCD(size_t queryLeft, size_t queryRight) {\n\t\tif (size == 0) return 0;\n\t\treturn query(1, 0, size - 1, queryLeft, queryRight);\n\t}\n};\n\nint main() {\n\tlong long testCases;\n\tcin >> testCases; \n\twhile (testCases--) {\n\t\tsize_t arraySize, queries;\n\t\tcin >> arraySize >> queries; \n\t\tvector<long long> values(arraySize);\n\t\tfor (auto& value : values)\n\t\t\tcin >> value; \n\n\t\tif (arraySize == 1) {\n\t\t\tfor (size_t i = 0; i < queries; i++) {\n\t\t\t\tsize_t left, right;\n\t\t\t\tcin >> left >> right;\n\t\t\t\tcout << 0 << \" \";\n\t\t\t}\n\t\t\tcout << endl;\n\t\t} else {\n\t\t\tvector<long long> differences;\n\t\t\tfor (size_t i = 1; i < arraySize; i++) {\n\t\t\t\tdifferences.push_back(abs(values[i] - values[i - 1]));\n\t\t\t}\n\n\t\t\tSegmentTree segTree(differences);\n\n\t\t\tfor (size_t i = 0; i < queries; i++) {\n\t\t\t\tsize_t left, right;\n\t\t\t\tcin >> left >> right;\n\t\t\t\tif (left == right) {\n\t\t\t\t\tcout << 0 << \" \"; \n\t\t\t\t} else {\n\t\t\t\t\tcout << segTree.rangeGCD(left - 1, right - 2) << \" \";\n\t\t\t\t}\n\t\t\t}\n\t\t\tcout << endl;\n\t\t}\n\t}\n\treturn 0;\n}"
    },
    "order": 1
  },
  {
    "id": "1893B",
    "contestId": 1893,
    "index": "B",
    "title": "Neutral Tonality",
    "rating": 1700,
    "url": "https://codeforces.com/problemset/problem/1893/B",
    "tags": [
      "constructive algorithms",
      "greedy",
      "sortings",
      "two pointers"
    ],
    "hint": "Notice that as the right pointer expands, the left pointer only needs to move forward. Maintain frequency counts or window invariants to keep the window valid in O(N) overall.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1893B+Neutral%20Tonality+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid mergeSortedInDescendingOrder() {\n\tint firstArraySize, secondArraySize;\n\tstd::cin >> firstArraySize >> secondArraySize;\n\n\tstd::vector<int> firstArray(firstArraySize);\n\tstd::vector<int> secondArray(secondArraySize);\n\n\tfor (int &element : firstArray) {\n\t\tstd::cin >> element;\n\t}\n\n\tfor (int &element : secondArray) {\n\t\tstd::cin >> element;\n\t}\n\n\tstd::sort(secondArray.rbegin(), secondArray.rend());\n\n\tstd::vector<int> mergedArray(firstArraySize + secondArraySize);\n\tstd::merge(firstArray.begin(), firstArray.end(), secondArray.begin(), secondArray.end(), mergedArray.begin(), std::greater<int>());\n\n\tfor (const int &element : mergedArray) {\n\t\tstd::cout << element << ' ';\n\t}\n\tstd::cout << '\\n';\n}\n\nint main() {\n\tstd::ios::sync_with_stdio(false);\n\tstd::cin.tie(nullptr);\n\n\tint testCases;\n\tstd::cin >> testCases;\n\n\twhile (testCases--) {\n\t\tmergeSortedInDescendingOrder();\n\t}\n\n\treturn 0;\n}"
    },
    "order": 2
  },
  {
    "id": "1879D",
    "contestId": 1879,
    "index": "D",
    "title": "Sum of XOR Functions",
    "rating": 1700,
    "url": "https://codeforces.com/problemset/problem/1879/D",
    "tags": [
      "bitmasks",
      "combinatorics",
      "divide and conquer",
      "dp",
      "math"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1879D+Sum%20of%20XOR%20Functions+editorial",
    "solutionCode": {
      "cpp": "#include<bits/stdc++.h>\nusing namespace std;\n#define int long long\n\nint M = 998244353;\n\n\nint fun(vector<int> a){\n    int n = a.size();\n    int pref[n + 1];\n    pref[0] = 0;\n    for (int i = 1; i <= n; i++){\n        pref[i] = a[i - 1];\n        pref[i] ^= pref[i - 1];\n    }\n\n    int ans = 0;\n    int c0 = 0, c1 = 0, s0 = 0, s1 = 0;\n\n    for (int i = 0; i <= n; i++){\n\n        if (pref[i] == 1){\n            ans += (c0 * i) % M - s0;\n            ans %= M;\n        }\n        else{\n            ans += (c1 * i) % M - s1;\n            ans %= M;\n        }\n\n\n        c0 += pref[i] == 0;\n        s0 += (pref[i] == 0) * i;\n        c1 += pref[i] == 1;\n        s1 += (pref[i] == 1) * i;\n\n        s0 %= M;\n        s1 %= M;\n    }\n\n    ans = (ans + M) % M;\n\n    return ans;\n\n}\n\nint32_t main(){\n    ios_base::sync_with_stdio(false);\n    cin.tie(0);\n    cout.tie(0);\n\n    int n; cin >> n;\n    int a[n];\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    int ans = 0;\n    for (int j = 0; j < 30; j++){\n        vector<int> b;\n        for (int i = 0; i < n; i++){\n            b.push_back((a[i] & (1 << j)) > 0);\n        }\n\n        ans += ((1 << j) * fun(b)) % M;\n        ans %= M;\n    }\n\n    cout << ans << '\\n';\n\n}"
    },
    "order": 3
  },
  {
    "id": "1833F",
    "contestId": 1833,
    "index": "F",
    "title": "Ira and Flamenco",
    "rating": 1700,
    "url": "https://codeforces.com/problemset/problem/1833/F",
    "tags": [
      "combinatorics",
      "constructive algorithms",
      "data structures",
      "implementation",
      "math",
      "sortings",
      "two pointers"
    ],
    "hint": "Notice that as the right pointer expands, the left pointer only needs to move forward. Maintain frequency counts or window invariants to keep the window valid in O(N) overall.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1833F+Ira%20and%20Flamenco+editorial",
    "solutionCode": {
      "cpp": "#include<bits/stdc++.h>\nusing namespace std;\nusing IntPair = pair<int, int>;\n\nconst int MOD = 1000000007; \n\nint addMod(int a, int b) {\n\treturn (a + b >= MOD ? a + b - MOD : a + b);\n}\n\nint mulMod(int a, int b) {\n\treturn 1LL * a * b % MOD;\n}\n\nint solve(int n, int m, vector<int>& arr) {\n\tvector<int> uniqueElements = arr;\n\tsort(uniqueElements.begin(), uniqueElements.end());\n\tuniqueElements.erase(unique(uniqueElements.begin(), uniqueElements.end()), uniqueElements.end());\n\n\tvector<int> elementCount(uniqueElements.size());\n\tfor (auto& num : arr) {\n\t\tint idx = lower_bound(uniqueElements.begin(), uniqueElements.end(), num) - uniqueElements.begin();\n\t\telementCount[idx]++;\n\t}\n\n\tif (uniqueElements.size() < m) return 0;\n\n\tstack<IntPair> stack1, stack2;\n\tauto push = [](stack<IntPair>& stack, int x) {\n\t\tstack.emplace(x, mulMod(x, stack.empty() ? 1 : stack.top().second));\n\t};\n\n\tfor (int j = 0; j < m; ++j) {\n\t\tpush(stack1, elementCount[j]);\n\t}\n\n\tint result = 0; \n\tfor (size_t j = m; j <= uniqueElements.size(); ++j) {\n\t\tif (uniqueElements[j - 1] - uniqueElements[j - m] == m - 1) {\n\t\t\tresult = addMod(result, mulMod(stack1.empty() ? 1 : stack1.top().second, stack2.empty() ? 1 : stack2.top().second));\n\t\t}\n\n\t\tif (stack2.empty()) {\n\t\t\twhile (!stack1.empty()) {\n\t\t\t\tpush(stack2, stack1.top().first);\n\t\t\t\tstack1.pop();\n\t\t\t}\n\t\t}\n\t\tif (!stack2.empty()) {\n\t\t\tstack2.pop();\n\t\t}\n\t\tpush(stack1, elementCount[j]);\n\t}\n\treturn result;\n}\n\nint main() {\n\tios::sync_with_stdio(false);\n\tcin.tie(0); \n\n\tint testCases;\n\tcin >> testCases; \n\twhile (testCases--) {\n\t\tint n, m;\n\t\tcin >> n >> m; \n\t\tvector<int> arr(n);\n\t\tfor (int i = 0; i < n; ++i) {\n\t\t\tcin >> arr[i]; \n\t\t}\n\n\t\tcout << solve(n, m, arr) << endl; \n\t}\n\treturn 0;\n}"
    },
    "order": 4
  },
  {
    "id": "1829H",
    "contestId": 1829,
    "index": "H",
    "title": "Don't Blame Me",
    "rating": 1700,
    "url": "https://codeforces.com/problemset/problem/1829/H",
    "tags": [
      "bitmasks",
      "combinatorics",
      "dp",
      "math"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1829H+Don't%20Blame%20Me+editorial",
    "solutionCode": {
      "cpp": "#include<bits/stdc++.h>\n\nusing namespace std;\n\nconst int MODULO = 1e9 + 7;\n\nvoid solve() {\n\tint arraySize, targetPopcount;\n\tcin >> arraySize >> targetPopcount;\n\tvector<int> numbers(arraySize + 1);\n\tvector<vector<int>> dp(arraySize + 1, vector<int>(1 << 6, 0));\n\n\tfor (int i = 1; i <= arraySize; ++i) {\n\t\tcin >> numbers[i];\n\t\tfor (int mask = 0; mask < (1 << 6); ++mask) {\n\t\t\tdp[i][mask] = (dp[i][mask] + dp[i - 1][mask]) % MODULO;\n\t\t\tint combinedMask = mask & numbers[i];\n\t\t\tdp[i][combinedMask] = (dp[i][combinedMask] + dp[i - 1][mask]) % MODULO;\n\t\t}\n\t\tdp[i][numbers[i]] = (dp[i][numbers[i]] + 1) % MODULO;\n\t}\n\n\tint result = 0;\n\tfor (int mask = 0; mask < (1 << 6); ++mask) {\n\t\tif (__builtin_popcount(mask) == targetPopcount) {\n\t\t\tresult = (result + dp[arraySize][mask]) % MODULO;\n\t\t}\n\t}\n\n\tcout << result << \"\\n\";\n}\n\nint main() {\n\tios_base::sync_with_stdio(false);\n\tcin.tie(nullptr);\n\tcout.tie(nullptr);\n\n\tint testCases;\n\tcin >> testCases;\n\n\twhile (testCases--) {\n\t\tsolve();\n\t}\n\n\treturn 0;\n}"
    },
    "order": 5
  },
  {
    "id": "1826D",
    "contestId": 1826,
    "index": "D",
    "title": "Running Miles",
    "rating": 1700,
    "url": "https://codeforces.com/problemset/problem/1826/D",
    "tags": [
      "brute force",
      "dp",
      "greedy"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1826D+Running%20Miles+editorial",
    "solutionCode": {
      "cpp": "#include<bits/stdc++.h>\n\nvoid solve() {\n\tint numElements;\n\tstd::cin >> numElements;\n\tstd::vector<int> elements(numElements);\n\tfor (int& element : elements) {\n\t\tstd::cin >> element;\n\t}\n\n\tstd::vector<int> prefixMax(numElements), suffixMax(numElements);\n\tfor (int i = 0; i < numElements; ++i) {\n\t\tprefixMax[i] = elements[i] + i;\n\t\tsuffixMax[i] = elements[i] - i;\n\t}\n\n\tfor (int i = 1; i < numElements; ++i) {\n\t\tprefixMax[i] = std::max(prefixMax[i], prefixMax[i - 1]);\n\t}\n\n\tfor (int i = numElements - 2; i >= 0; --i) {\n\t\tsuffixMax[i] = std::max(suffixMax[i], suffixMax[i + 1]);\n\t}\n\n\tint maximumValue = 0;\n\tfor (int mid = 1; mid < numElements - 1; ++mid) {\n\t\tmaximumValue = std::max(maximumValue, elements[mid] + prefixMax[mid - 1] + suffixMax[mid + 1]);\n\t}\n\tstd::cout << maximumValue << '\\n';\n}\n\nint main() {\n\tstd::ios_base::sync_with_stdio(false);\n\tstd::cin.tie(nullptr);\n\tint testCases;\n\tstd::cin >> testCases;\n\twhile (testCases--) solve();\n\treturn 0;\n}"
    },
    "order": 6
  },
  {
    "id": "1822G1",
    "contestId": 1822,
    "index": "G1",
    "title": "Magic Triples (Easy Version)",
    "rating": 1700,
    "url": "https://codeforces.com/problemset/problem/1822/G1",
    "tags": [
      "brute force",
      "data structures",
      "math",
      "number theory"
    ],
    "hint": "Speed up operations from O(N) to O(log N) using appropriate containers like std::set, std::map, or a Fenwick/Segment Tree for dynamic range queries and updates.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1822G1+Magic%20Triples%20(Easy%20Version)+editorial",
    "solutionCode": {
      "cpp": "#include<bits/stdc++.h>\n\n\nconst int MAX_VALUE = 1e6;\nint frequency[MAX_VALUE + 1];\n\nint main() {\n    std::ios_base::sync_with_stdio(false);\n    std::cin.tie(nullptr);\n\n    int testCases;\n    std::cin >> testCases;\n\n    while (testCases--) {\n        int arraySize;\n        std::cin >> arraySize;\n\n        std::vector<int> numbers(arraySize);\n\n        for (int i = 0; i < arraySize; ++i) {\n            std::cin >> numbers[i];\n            ++frequency[numbers[i]];\n        }\n\n        long long totalCombinations = 0;\n\n        for (int i = 0; i < arraySize; ++i) {\n            int val = numbers[i];\n\n            if (frequency[val] >= 3) {\n                totalCombinations += 1LL * (frequency[val] - 1) * (frequency[val] - 2);\n            }\n\n            for (long long m = 2; 1LL * val * m * m <= MAX_VALUE; ++m) {\n                long long v2 = 1LL * val * m;\n                long long v3 = v2 * m;\n                totalCombinations += 1LL * frequency[v2] * frequency[v3];\n            }\n        }\n\n        std::cout << totalCombinations << \"\\n\";\n\n        for (int i = 0; i < arraySize; ++i) {\n            --frequency[numbers[i]];\n        }\n    }\n\n    return 0;\n}"
    },
    "order": 7
  },
  {
    "id": "1792D",
    "contestId": 1792,
    "index": "D",
    "title": "Fixed Prefix Permutations",
    "rating": 1700,
    "url": "https://codeforces.com/problemset/problem/1792/D",
    "tags": [
      "binary search",
      "bitmasks",
      "data structures",
      "hashing",
      "math",
      "sortings"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1792D+Fixed%20Prefix%20Permutations+editorial",
    "solutionCode": {
      "cpp": "#include<bits/stdc++.h>\n\nusing namespace std;\n\nint commonPrefixLength(const vector<int>& vec1, const vector<int>& vec2) {\n\tint commonLength = 0;\n\twhile (commonLength < static_cast<int>(vec1.size()) && vec1[commonLength] == vec2[commonLength]) {\n\t\t++commonLength;\n\t}\n\treturn commonLength;\n}\n\nint main() {\n\tios::sync_with_stdio(false); \n\tcin.tie(nullptr); \n\n\tint testCases;\n\tcin >> testCases; \n\n\twhile (testCases--) {\n\t\tint rows, cols;\n\t\tcin >> rows >> cols; \n\t\tvector<vector<int>> original(rows, vector<int>(cols));\n\t\tvector<vector<int>> transformed(rows, vector<int>(cols));\n\n\t\tfor (int i = 0; i < rows; ++i)\n\t\t\tfor (int j = 0; j < cols; ++j) {\n\t\t\t\tcin >> original[i][j];\n\t\t\t\t--original[i][j];\n\t\t\t}\n\n\t\tfor (int i = 0; i < rows; ++i)\n\t\t\tfor (int j = 0; j < cols; ++j) {\n\t\t\t\ttransformed[i][original[i][j]] = j;\n\t\t\t}\n\n\t\tsort(transformed.begin(), transformed.end());\n\n\t\tfor (int i = 0; i < rows; ++i) {\n\t\t\tint position = lower_bound(transformed.begin(), transformed.end(), original[i]) - transformed.begin();\n\t\t\tint maxCommonPrefix = 0;\n\n\t\t\tif (position > 0) {\n\t\t\t\tmaxCommonPrefix = max(maxCommonPrefix, commonPrefixLength(original[i], transformed[position - 1]));\n\t\t\t}\n\t\t\tif (position < rows) {\n\t\t\t\tmaxCommonPrefix = max(maxCommonPrefix, commonPrefixLength(original[i], transformed[position]));\n\t\t\t}\n\n\t\t\tcout << maxCommonPrefix << \" \";\n\t\t}\n\n\t\tcout << '\\n'; \n\t}\n\n\treturn 0;\n}"
    },
    "order": 8
  },
  {
    "id": "1777C",
    "contestId": 1777,
    "index": "C",
    "title": "Quiz Master",
    "rating": 1700,
    "url": "https://codeforces.com/problemset/problem/1777/C",
    "tags": [
      "binary search",
      "math",
      "number theory",
      "sortings",
      "two pointers"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1777C+Quiz%20Master+editorial",
    "solutionCode": {
      "cpp": "#include<bits/stdc++.h>\n\nusing namespace std;\nusing namespace std;\n\nusing ll = long long;\nusing pii = pair<ll, ll>;\n\nconst ll INF = 1e17; \nconst ll MAXM = 1e5;\nvector<ll> factors[MAXM + 5]; \nvoid initialize_factors() {\n\tfor (ll i = 1; i <= MAXM; ++i) {\n\t\tfor (ll j = i; j <= MAXM; j += i) {\n\t\t\tfactors[j].push_back(i); \n\t\t}\n\t}\n}\n\nvoid solve() {\n\tll n, m;\n\tcin >> n >> m; \n\tvector<pii> values; \n\tfor (ll i = 0; i < n; ++i) {\n\t\tll value;\n\t\tcin >> value; \n\t\tvalues.push_back({value, i}); \n\t}\n\t\n\tsort(values.begin(), values.end()); \n\tvector<ll> frequency(m + 5, 0); \n\tll count_factors = 0; \n\tll left_index = 0; \n\tll min_difference = INF; \n\n\tfor (ll right_index = 0; right_index < n; ++right_index) {\n\t\tfor (auto factor : factors[values[right_index].first]) {\n\t\t\tif (factor > m) break; \n\t\t\tif (!frequency[factor]++) {\n\t\t\t\t++count_factors; \n\t\t\t}\n\t\t}\n\t\t\n\t\twhile (count_factors == m) {\n\t\t\tll current_difference = values[right_index].first - values[left_index].first; \n\t\t\tif (current_difference < min_difference) {\n\t\t\t\tmin_difference = current_difference; \n\t\t\t}\n\t\t\tfor (auto factor : factors[values[left_index].first]) {\n\t\t\t\tif (factor > m) break;\n\t\t\t\tif (--frequency[factor] == 0) {\n\t\t\t\t\t--count_factors; \n\t\t\t\t}\n\t\t\t}\n\t\t\t++left_index; \n\t\t}\n\t}\n\n\tcout << (min_difference >= INF ? -1 : min_difference) << \"\\n\";\n}\n\nint main() {\n\tios::sync_with_stdio(false); \n\tcin.tie(nullptr); \n\t\n\tinitialize_factors(); \n\t\n\tll test_cases;\n\tcin >> test_cases;\n\twhile (test_cases--) {\n\t\tsolve(); \n\t}\n\t\n\treturn 0;\n}"
    },
    "order": 9
  },
  {
    "id": "1760G",
    "contestId": 1760,
    "index": "G",
    "title": "SlavicG's Favorite Problem",
    "rating": 1700,
    "url": "https://codeforces.com/problemset/problem/1760/G",
    "tags": [
      "bitmasks",
      "dfs and similar",
      "graphs"
    ],
    "hint": "Represent the input as an adjacency list. Use BFS/DFS traversal to discover reachable components, compute shortest hops in unweighted graphs, or detect bipartite coloring.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1760G+SlavicG's%20Favorite%20Problem+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nusing int64 = long long;\n\nconst int MAX_NODES = 100010;\n\nvector<pair<int, int>> adjacencyList[MAX_NODES];\n\nset<int> xorValues;\n\nint numNodes, nodeA, nodeB;\n\nvoid depthFirstSearch1(int currentNode, int parent, int currentXor) {\n\tif (currentNode == nodeB) return;\n\txorValues.insert(currentXor);\n\tfor (const auto& edge : adjacencyList[currentNode]) {\n\t\tint neighbor = edge.first, weight = edge.second;\n\t\tif (neighbor == parent) continue;\n\t\tdepthFirstSearch1(neighbor, currentNode, currentXor ^ weight);\n\t}\n}\n\nbool depthFirstSearch2(int currentNode, int parent, int currentXor) {\n\tif (currentNode != nodeB && xorValues.count(currentXor)) return true;\n\tfor (const auto& edge : adjacencyList[currentNode]) {\n\t\tint neighbor = edge.first, weight = edge.second;\n\t\tif (neighbor == parent) continue;\n\t\tif (depthFirstSearch2(neighbor, currentNode, weight ^ currentXor)) return true;\n\t}\n\treturn false;\n}\n\nvoid solve() {\n\txorValues.clear();\n\tcin >> numNodes >> nodeA >> nodeB;\n\t--nodeA, --nodeB;\n\tfor (int i = 0; i < numNodes; ++i) adjacencyList[i].clear();\n\tfor (int i = 0; i < numNodes - 1; ++i) {\n\t\tint u, v, w;\n\t\tcin >> u >> v >> w;\n\t\t--u, --v;\n\t\tadjacencyList[u].emplace_back(v, w);\n\t\tadjacencyList[v].emplace_back(u, w);\n\t}\n\tdepthFirstSearch1(nodeA, -1, 0);\n\tif (depthFirstSearch2(nodeB, -1, 0)) cout << \"YES\\n\";\n\telse cout << \"NO\\n\";\n}\n\nint main() {\n\tios_base::sync_with_stdio(false);\n\tcin.tie(nullptr);\n\tcout.tie(nullptr);\n\n\tint testCases;\n\tcin >> testCases;\n\twhile (testCases--) {\n\t\tsolve();\n\t}\n\treturn 0;\n}"
    },
    "order": 10
  },
  {
    "id": "1735D",
    "contestId": 1735,
    "index": "D",
    "title": "Meta-set",
    "rating": 1700,
    "url": "https://codeforces.com/problemset/problem/1735/D",
    "tags": [
      "brute force",
      "combinatorics",
      "data structures",
      "hashing",
      "math"
    ],
    "hint": "Speed up operations from O(N) to O(log N) using appropriate containers like std::set, std::map, or a Fenwick/Segment Tree for dynamic range queries and updates.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1735D+Meta-set+editorial",
    "solutionCode": {
      "cpp": "#include<bits/stdc++.h>\n\nusing namespace std;\n\nint n, k;\nvector<vector<int>> sequences;\n\nvector<int> calculateComplement(const vector<int>& a, const vector<int>& b) {\n\tvector<int> complement(k);\n\tfor (int i = 0; i < k; i++) {\n\t\tcomplement[i] = (6 - (a[i] + b[i])) % 3;\n\t}\n\treturn complement;\n}\n\nvoid solve() {\n\tcin >> n >> k;\n\tsequences.resize(n);\n\tfor (auto& sequence : sequences) {\n\t\tsequence.resize(k);\n\t\tfor (auto& element : sequence) {\n\t\t\tcin >> element;\n\t\t}\n\t}\n\n\tmap<vector<int>, int> complementCount;\n\tfor (int i = 0; i < n; i++) {\n\t\tfor (int j = i + 1; j < n; j++) {\n\t\t\tauto complement = calculateComplement(sequences[i], sequences[j]);\n\t\t\tcomplementCount[complement]++;\n\t\t}\n\t}\n\n\tlong long result = 0;\n\tfor (auto& sequence : sequences) {\n\t\tresult += static_cast<long long>(complementCount[sequence]) * (complementCount[sequence] - 1) / 2;\n\t}\n\n\tcout << result << '\\n';\n}\n\nint main() {\n\tios_base::sync_with_stdio(false);\n\tcin.tie(nullptr);\n\tcout.tie(nullptr);\n\tcout << fixed << setprecision(20);\n\t\n\tint testCases = 1;\n\twhile (testCases--) {\n\t\tsolve();\n\t}\n\t\n\treturn 0;\n}"
    },
    "order": 11
  },
  {
    "id": "2041D",
    "contestId": 2041,
    "index": "D",
    "title": "Drunken Maze",
    "rating": 1700,
    "url": "https://codeforces.com/problemset/problem/2041/D",
    "tags": [
      "brute force",
      "dfs and similar",
      "graphs",
      "shortest paths"
    ],
    "hint": "Represent the input as an adjacency list. Use BFS/DFS traversal to discover reachable components, compute shortest hops in unweighted graphs, or detect bipartite coloring.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+2041D+Drunken%20Maze+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nusing ll = long long;\n\nconst ll INF = 1e9;\nconst ll MODULO = 1000000007;\n\nconst vector<ll> DX{-1, 0, 1, 0};\nconst vector<ll> DY{0, 1, 0, -1};\n\nll computeGCD(ll a, ll b) {\n\twhile (b != 0) {\n\t\tll temp = b;\n\t\tb = a % b;\n\t\ta = temp;\n\t}\n\treturn a;\n}\n\nll computeLCM(ll a, ll b) {\n\treturn (a / computeGCD(a, b)) * b;\n}\n\nll computePower(ll base, ll exponent) {\n\tll result = 1;\n\twhile (exponent > 0) {\n\t\tif (exponent % 2 == 1) {\n\t\t\tresult *= base;\n\t\t}\n\t\tbase *= base;\n\t\texponent /= 2;\n\t}\n\treturn result;\n}\n\nint main() {\n\tll rows, columns;\n\tcin >> rows >> columns;\n\tvector<string> grid(rows);\n\tpair<ll, ll> start, end;\n\n\tfor (ll i = 0; i < rows; ++i) {\n\t\tcin >> grid[i];\n\t\tfor (ll j = 0; j < columns; ++j) {\n\t\t\tif (grid[i][j] == 'S') start = {i, j};\n\t\t\tif (grid[i][j] == 'T') end = {i, j};\n\t\t}\n\t}\n\n\tvector<vector<vector<vector<bool>>>> visited(\n\t\trows, vector<vector<vector<bool>>>(columns, vector<vector<bool>>(4, vector<bool>(4, false)))\n\t);\n\n\tqueue<vector<ll>> stateQueue;\n\tfor (ll direction = 0; direction < 4; ++direction) {\n\t\tll nextX = start.first + DX[direction];\n\t\tll nextY = start.second + DY[direction];\n\t\tif (nextX >= 0 && nextY >= 0 && nextX < rows && nextY < columns && grid[nextX][nextY] != '#') {\n\t\t\tstateQueue.push({nextX, nextY, direction, 1, 1});\n\t\t\tvisited[nextX][nextY][direction][1] = true;\n\t\t}\n\t}\n\n\twhile (!stateQueue.empty()) {\n\t\tauto state = stateQueue.front();\n\t\tstateQueue.pop();\n\n\t\tll x = state[0], y = state[1], dir = state[2], turnCount = state[3], distance = state[4];\n\n\t\tif (make_pair(x, y) == end) {\n\t\t\tcout << distance << '\\n';\n\t\t\treturn 0;\n\t\t}\n\n\t\tfor (ll newDir = 0; newDir < 4; ++newDir) {\n\t\t\tll nextX = x + DX[newDir];\n\t\t\tll nextY = y + DY[newDir];\n\t\t\tll newTurnCount = (newDir == dir) ? turnCount + 1 : 1;\n\n\t\t\tif (newTurnCount > 3 || nextX < 0 || nextY < 0 || nextX >= rows || nextY >= columns || grid[nextX][nextY] == '#')\n\t\t\t\tcontinue;\n\t\t\tif (visited[nextX][nextY][newDir][newTurnCount])\n\t\t\t\tcontinue;\n\n\t\t\tvisited[nextX][nextY][newDir][newTurnCount] = true;\n\t\t\tstateQueue.push({nextX, nextY, newDir, newTurnCount, distance + 1});\n\t\t}\n\t}\n\n\tcout << -1 << '\\n';\n\treturn 0;\n}"
    },
    "order": 12
  },
  {
    "id": "1731C",
    "contestId": 1731,
    "index": "C",
    "title": "Even Subarrays",
    "rating": 1700,
    "url": "https://codeforces.com/problemset/problem/1731/C",
    "tags": [
      "bitmasks",
      "brute force",
      "hashing",
      "math",
      "number theory"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1731C+Even%20Subarrays+editorial",
    "solutionCode": {
      "cpp": "#include<bits/stdc++.h>\n\nusing namespace std;\n\nint main() {\n\tstd::ios_base::sync_with_stdio(false);\n\tstd::cin.tie(nullptr);\n\tstd::cout.tie(nullptr);\n\n\tint testCases;\n\tstd::cin >> testCases; \n\twhile (testCases--) {\n\t\tlong long size;\n\t\tstd::cin >> size; \n\n\t\tstd::vector<int> array(size); \n\t\tstd::vector<int> xorFrequency(2 * size, 0); \n\n\t\tfor (int &element : array) {\n\t\t\tstd::cin >> element;\n\t\t}\n\n\t\tlong long matchingPairs = 0;\n\t\tint currentXor = 0;\n\t\txorFrequency[currentXor]++;\n\n\t\tfor (const int &element : array) {\n\t\t\tcurrentXor ^= element;\n\n\t\t\tfor (long long i = 0; i * i < 2 * size; i++) {\n\t\t\t\tif ((currentXor ^ (i * i)) < 2 * size) {\n\t\t\t\t\tmatchingPairs += xorFrequency[currentXor ^ (i * i)];\n\t\t\t\t}\n\t\t\t}\n\n\t\t\txorFrequency[currentXor]++;\n\t\t}\n\n\t\tlong long totalPairs = (size * (size + 1)) / 2;\n\t\tlong long result = totalPairs - matchingPairs;\n\t\tstd::cout << result << '\\n';\n\t}\n}"
    },
    "order": 13
  },
  {
    "id": "1715C",
    "contestId": 1715,
    "index": "C",
    "title": "Monoblock",
    "rating": 1700,
    "url": "https://codeforces.com/problemset/problem/1715/C",
    "tags": [
      "combinatorics",
      "data structures",
      "implementation",
      "math"
    ],
    "hint": "Speed up operations from O(N) to O(log N) using appropriate containers like std::set, std::map, or a Fenwick/Segment Tree for dynamic range queries and updates.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1715C+Monoblock+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int arraySize, queryCount;\n    cin >> arraySize >> queryCount;\n\n    vector<int> values(arraySize + 2, 0);\n    for (int index = 1; index <= arraySize; ++index) {\n        cin >> values[index];\n    }\n\n    long long totalWeight = 0;\n    for (int index = 1; index <= arraySize; ++index) {\n        if (values[index] != values[index + 1]) {\n            totalWeight += 1LL * (arraySize - index) * index;\n        }\n    }\n\n    while (queryCount--) {\n        int position, newValue;\n        cin >> position >> newValue;\n\n        if (values[position] != values[position - 1]) {\n            totalWeight -= 1LL * (arraySize - position + 1) * (position - 1);\n        }\n        if (values[position + 1] != values[position]) {\n            totalWeight -= 1LL * (arraySize - position) * position;\n        }\n\n        values[position] = newValue;\n\n        if (values[position] != values[position - 1]) {\n            totalWeight += 1LL * (arraySize - position + 1) * (position - 1);\n        }\n        if (values[position + 1] != values[position]) {\n            totalWeight += 1LL * (arraySize - position) * position;\n        }\n\n        cout << totalWeight + 1LL * arraySize * (arraySize + 1) / 2 << '\\n';\n    }\n\n    return 0;\n}"
    },
    "order": 14
  },
  {
    "id": "1709D",
    "contestId": 1709,
    "index": "D",
    "title": "Rorororobot",
    "rating": 1700,
    "url": "https://codeforces.com/problemset/problem/1709/D",
    "tags": [
      "binary search",
      "data structures",
      "greedy",
      "math"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1709D+Rorororobot+editorial",
    "solutionCode": {
      "cpp": "#include<bits/stdc++.h>\n\nusing namespace std;\n\nint main() {\n\tint numRows, numCols;\n\tstd::cin >> numRows >> numCols;\n\tstd::vector<int> heights(numCols);\n\tfor (int i = 0; i < numCols; ++i) std::cin >> heights[i];\n\n\tint logSize = 0;\n\twhile ((1 << logSize) <= numCols) ++logSize;\n\tstd::vector<std::vector<int>> sparseTable(logSize, std::vector<int>(numCols));\n\n\tfor (int i = 0; i < numCols; ++i) sparseTable[0][i] = heights[i];\n\n\tfor (int level = 1; level < logSize; ++level) {\n\t\tfor (int i = 0; i + (1 << level) <= numCols; ++i) {\n\t\t\tsparseTable[level][i] = std::max(sparseTable[level - 1][i],\n\t\t\t\t\t\t\t\t\t\t\t sparseTable[level - 1][i + (1 << (level - 1))]);\n\t\t}\n\t}\n\n\tstd::vector<int> logValues(numCols + 1, 0);\n\tfor (int i = 2; i <= numCols; ++i) {\n\t\tlogValues[i] = logValues[i / 2] + 1;\n\t}\n\n\tauto getMaxValue = [&](int left, int right) {\n\t\tif (left > right) std::swap(left, right);\n\t\t++right;\n\t\tint logLen = logValues[right - left];\n\t\treturn std::max(sparseTable[logLen][left], sparseTable[logLen][right - (1 << logLen)]);\n\t};\n\n\tint numQueries;\n\tstd::cin >> numQueries;\n\twhile (numQueries--) {\n\t\tint xs, ys, xf, yf, stepSize;\n\t\tstd::cin >> xs >> ys >> xf >> yf >> stepSize;\n\t\t--xs, --ys, --xf, --yf;\n\n\n\t\tif (ys % stepSize != yf % stepSize || xs % stepSize != xf % stepSize) {\n\t\t\tstd::cout << \"NO\" << std::endl;\n\t\t\tcontinue;\n\t\t}\n\n\t\tint maxRow = (numRows - xs - 1) / stepSize * stepSize + xs;\n\t\tstd::cout << (getMaxValue(ys, yf) <= maxRow ? \"YES\" : \"NO\") << std::endl;\n\t}\n\treturn 0;\n}"
    },
    "order": 15
  },
  {
    "id": "1695C",
    "contestId": 1695,
    "index": "C",
    "title": "Zero Path",
    "rating": 1700,
    "url": "https://codeforces.com/problemset/problem/1695/C",
    "tags": [
      "brute force",
      "data structures",
      "dp",
      "graphs",
      "greedy",
      "shortest paths"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1695C+Zero%20Path+editorial",
    "solutionCode": {
      "cpp": "#include<bits/stdc++.h>\n\nusing namespace std;\n\n\nint main() {\n\tstd::ios::sync_with_stdio(false);\n\tstd::cin.tie(nullptr);\n\n\tint numTests;\n  \tstd::cin >> numTests;\n\n\twhile (numTests--) {\n\t\tint rows, cols;\n\t\tstd::cin >> rows >> cols;\n\n\t\tstd::vector<std::vector<int>> grid(rows, std::vector<int>(cols));\n\t\tstd::vector<std::vector<int>> minPathSum(rows, std::vector<int>(cols));\n\t\tstd::vector<std::vector<int>> maxPathSum(rows, std::vector<int>(cols));\n\n\t\tfor (int i = 0; i < rows; ++i)\n\t\t\tfor (int j = 0; j < cols; ++j)\n\t\t\t\tstd::cin >> grid[i][j];\n\n\t\tminPathSum[0][0] = maxPathSum[0][0] = grid[0][0];\n\n\t\tfor (int i = 1; i < rows; ++i)\n\t\t\tmaxPathSum[i][0] = minPathSum[i][0] = maxPathSum[i - 1][0] + grid[i][0];\n\n\t\tfor (int j = 1; j < cols; ++j)\n\t\t\tmaxPathSum[0][j] = minPathSum[0][j] = maxPathSum[0][j - 1] + grid[0][j];\n\n\t\tfor (int i = 1; i < rows; ++i)\n\t\t\tfor (int j = 1; j < cols; ++j) {\n\t\t\t\tmaxPathSum[i][j] = std::max(maxPathSum[i - 1][j], maxPathSum[i][j - 1]) + grid[i][j];\n\t\t\t\tminPathSum[i][j] = std::min(minPathSum[i - 1][j], minPathSum[i][j - 1]) + grid[i][j];\n\t\t\t}\n\n\t\tif (maxPathSum[rows - 1][cols - 1] % 2 != 0 || minPathSum[rows - 1][cols - 1] > 0 || maxPathSum[rows - 1][cols - 1] < 0) {\n\t\t\tstd::cout << \"NO\\n\";\n\t\t} else {\n\t\t\tstd::cout << \"YES\\n\";\n\t\t}\n\t}\n\n\treturn 0;\n}"
    },
    "order": 16
  },
  {
    "id": "1692H",
    "contestId": 1692,
    "index": "H",
    "title": "Gambling",
    "rating": 1700,
    "url": "https://codeforces.com/problemset/problem/1692/H",
    "tags": [
      "data structures",
      "dp",
      "greedy",
      "math"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1692H+Gambling+editorial",
    "solutionCode": {
      "cpp": "#include<bits/stdc++.h>\n\nusing namespace std;\nusing ll = long long;\n\nstruct SegmentTree {\n\tstruct Node {\n\t\tll prefixMax, suffixMax, maxSubarraySum, totalSum;\n\t};\n\n\tint size;\n\tvector<Node> tree;\n\n\tSegmentTree(int n, ll initialValue) : size(n) {\n\t\ttree.resize(4 * n, {initialValue, initialValue, initialValue, initialValue});\n\t\tbuild(1, 0, n - 1, initialValue);\n\t}\n\n\tvoid build(int index, int left, int right, ll value) {\n\t\tif (left == right) {\n\t\t\ttree[index] = {value, value, value, value};\n\t\t\treturn;\n\t\t}\n\t\tint mid = (left + right) / 2;\n\t\tbuild(2 * index, left, mid, value);\n\t\tbuild(2 * index + 1, mid + 1, right, value);\n\t\ttree[index] = merge(tree[2 * index], tree[2 * index + 1]);\n\t}\n\n\tNode merge(const Node& a, const Node& b) {\n\t\tNode result;\n\t\tresult.prefixMax = max(a.prefixMax, a.totalSum + b.prefixMax);\n\t\tresult.suffixMax = max(b.suffixMax, b.totalSum + a.suffixMax);\n\t\tresult.maxSubarraySum = max({a.maxSubarraySum, b.maxSubarraySum, a.suffixMax + b.prefixMax});\n\t\tresult.totalSum = a.totalSum + b.totalSum;\n\t\treturn result;\n\t}\n\n\tvoid update(int pos, ll value) {\n\t\tupdate(1, 0, size - 1, pos, value);\n\t}\n\n\tvoid update(int index, int left, int right, int pos, ll value) {\n\t\tif (left > pos || right < pos) return;\n\t\tif (left == pos && right == pos) {\n\t\t\ttree[index] = {value, value, value, value};\n\t\t\treturn;\n\t\t}\n\t\tint mid = (left + right) / 2;\n\t\tupdate(2 * index, left, mid, pos, value);\n\t\tupdate(2 * index + 1, mid + 1, right, pos, value);\n\t\ttree[index] = merge(tree[2 * index], tree[2 * index + 1]);\n\t}\n\n\tNode query(int left, int right) {\n\t\treturn query(1, 0, size - 1, left, right);\n\t}\n\n\tNode query(int index, int left, int right, int queryLeft, int queryRight) {\n\t\tif (left > queryRight || right < queryLeft) return {0, 0, 0, 0};\n\t\tif (left >= queryLeft && right <= queryRight) return tree[index];\n\t\tint mid = (left + right) / 2;\n\t\tNode leftResult = query(2 * index, left, mid, queryLeft, queryRight);\n\t\tNode rightResult = query(2 * index + 1, mid + 1, right, queryLeft, queryRight);\n\t\treturn merge(leftResult, rightResult);\n\t}\n};\n\nvoid solve() {\n\tint n;\n\tcin >> n;\n\tvector<int> array(n);\n\tfor (int& item : array) cin >> item;\n\n\tmap<int, vector<int>> indexMap;\n\tfor (int i = 0; i < n; i++) {\n\t\tindexMap[array[i]].push_back(i);\n\t}\n\n\tSegmentTree segmentTree(n, -1);\n\n\tll maxSum = 0, bestValue = -1;\n\tfor (const auto& [value, indices] : indexMap) {\n\t\tfor (int index : indices) segmentTree.update(index, 1);\n\t\tll currentMaxSum = segmentTree.query(0, n - 1).maxSubarraySum;\n\t\tif (maxSum < currentMaxSum) {\n\t\t\tbestValue = value;\n\t\t\tmaxSum = currentMaxSum;\n\t\t}\n\t\tfor (int index : indices) segmentTree.update(index, -1);\n\t}\n\n\tint bestLeft = -1, bestRight = -1;\n\tfor (int& item : array) {\n\t\tif (item == bestValue) item = 1;\n\t\telse item = -1;\n\t}\n\n\tll currentSum = 0, bestCurrentSum = 0;\n\tll start = 0;\n\tfor (int i = 0; i < n; ++i) {\n\t\tcurrentSum += array[i];\n\t\tif (currentSum > bestCurrentSum) {\n\t\t\tbestCurrentSum = currentSum;\n\t\t\tbestRight = i;\n\t\t\tbestLeft = start;\n\t\t}\n\t\tif (currentSum <= 0) {\n\t\t\tstart = i + 1;\n\t\t\tcurrentSum = 0;\n\t\t}\n\t}\n\tcout << bestValue << \" \" << bestLeft + 1 << \" \" << bestRight + 1 << \"\\n\";\n}\n\nint main() {\n\tios_base::sync_with_stdio(false);\n\tcin.tie(nullptr);\n\tcout.tie(nullptr);\n\n\tint testCases;\n\tcin >> testCases;\n\twhile (testCases--) {\n\t\tsolve();\n\t}\n\treturn 0;\n}"
    },
    "order": 17
  },
  {
    "id": "1690F",
    "contestId": 1690,
    "index": "F",
    "title": "Shifting String",
    "rating": 1700,
    "url": "https://codeforces.com/problemset/problem/1690/F",
    "tags": [
      "graphs",
      "math",
      "number theory",
      "strings"
    ],
    "hint": "Represent the input as an adjacency list. Use BFS/DFS traversal to discover reachable components, compute shortest hops in unweighted graphs, or detect bipartite coloring.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1690F+Shifting%20String+editorial",
    "solutionCode": {
      "cpp": "#include<bits/stdc++.h>\n\nusing namespace std;\n\nlong long computeGCD(long long a, long long b) {\n\treturn b == 0 ? a : computeGCD(b, a % b);\n}\n\nint determineCycleShift(const string &s) {\n\tint length = s.size();\n\tfor (int i = 1; i <= length; ++i) {\n\t\tbool isShiftValid = true;\n\t\tfor (int j = 0; j < length; ++j) {\n\t\t\tif (s[j] != s[(j + i) % length]) {\n\t\t\t\tisShiftValid = false;\n\t\t\t\tbreak;\n\t\t\t}\n\t\t}\n\t\tif (isShiftValid) return i;\n\t}\n\treturn length;\n}\n\nvoid solveTestCase() {\n\tint n;\n\tcin >> n;\n\n\tstring sequence;\n\tcin >> sequence;\n\n\tvector<int> permutation(n);\n\tfor (int i = 0; i < n; ++i) {\n\t\tcin >> permutation[i];\n\t\t--permutation[i];\n\t}\n\n\tvector<bool> visited(n, false);\n\tlong long result = 1;\n\n\tfor (int i = 0; i < n; ++i) {\n\t\tif (visited[i]) continue;\n\n\t\tstring cycleSubstring;\n\t\tint currentIndex = i;\n\n\n\t\twhile (!visited[currentIndex]) {\n\t\t\tcycleSubstring += sequence[currentIndex];\n\t\t\tvisited[currentIndex] = true;\n\t\t\tcurrentIndex = permutation[currentIndex];\n\t\t}\n\n\t\tint cycleShift = determineCycleShift(cycleSubstring);\n\t\tresult = result * cycleShift / computeGCD(result, cycleShift);\n\t}\n\n\tcout << result << '\\n';\n}\n\nint main() {\n\tios::sync_with_stdio(false);\n\tcin.tie(nullptr);\n\n\tint testCaseCount;\n\tcin >> testCaseCount;\n\twhile (testCaseCount--) {\n\t\tsolveTestCase();\n\t}\n\n\treturn 0;\n}"
    },
    "order": 18
  },
  {
    "id": "1625C",
    "contestId": 1625,
    "index": "C",
    "title": "Road Optimization",
    "rating": 1700,
    "url": "https://codeforces.com/problemset/problem/1625/C",
    "tags": [
      "dp"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1625C+Road%20Optimization+editorial",
    "solutionCode": {
      "cpp": "#include<bits/stdc++.h>\n\nusing namespace std;\n\nint main() {\n\tios_base::sync_with_stdio(false);\n\tcin.tie(nullptr);\n\n\tint numberOfCheckpoints, totalDistance, maxRemovals;\n\tcin >> numberOfCheckpoints >> totalDistance >> maxRemovals;\n\n\tvector<int> distances(numberOfCheckpoints), costs(numberOfCheckpoints);\n\n\tfor (int i = 0; i < numberOfCheckpoints; i++) {\n\t\tcin >> distances[i];\n\t}\n\n\tfor (int i = 0; i < numberOfCheckpoints; i++) {\n\t\tcin >> costs[i];\n\t}\n\n\tvector<vector<int>> previousCost(maxRemovals + 1, vector<int>(numberOfCheckpoints));\n\n\tfor (int removals = 0; removals <= maxRemovals; removals++) {\n\t\tfor (int previousCheckpoint = 0; previousCheckpoint < numberOfCheckpoints; previousCheckpoint++) {\n\t\t\tpreviousCost[removals][previousCheckpoint] = (totalDistance - distances[previousCheckpoint]) * costs[previousCheckpoint];\n\t\t}\n\t}\n\n\tfor (int i = numberOfCheckpoints - 1; i >= 1; i--) {\n\t\tvector<vector<int>> currentCost(maxRemovals + 1, vector<int>(numberOfCheckpoints));\n\t\tfor (int previousCheckpoint = i - 1; previousCheckpoint >= 0; previousCheckpoint--) {\n\t\t\tfor (int removals = 0; removals <= maxRemovals; removals++) {\n\t\t\t\tint takeCost = ((distances[i] - distances[previousCheckpoint]) * costs[previousCheckpoint]) + previousCost[removals][i];\n\n\t\t\t\tint notTakeCost = INT_MAX;\n\t\t\t\tif (removals > 0) {\n\t\t\t\t\tnotTakeCost = previousCost[removals - 1][previousCheckpoint];\n\t\t\t\t}\n\n\t\t\t\tcurrentCost[removals][previousCheckpoint] = min(takeCost, notTakeCost);\n\t\t\t}\n\t\t}\n\t\tpreviousCost = currentCost;\n\t}\n\n\tcout << previousCost[maxRemovals][0] << endl;\n\n\treturn 0;\n}"
    },
    "order": 19
  },
  {
    "id": "1598D",
    "contestId": 1598,
    "index": "D",
    "title": "Training Session",
    "rating": 1700,
    "url": "https://codeforces.com/problemset/problem/1598/D",
    "tags": [
      "combinatorics",
      "data structures",
      "geometry",
      "implementation",
      "math"
    ],
    "hint": "Speed up operations from O(N) to O(log N) using appropriate containers like std::set, std::map, or a Fenwick/Segment Tree for dynamic range queries and updates.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1598D+Training%20Session+editorial",
    "solutionCode": {
      "cpp": "#include<bits/stdc++.h>\n\nusing namespace std;\n\nint main() {\n\tstd::ios_base::sync_with_stdio(false);\n\tstd::cin.tie(nullptr);\n\n\tint testCases;\n\tstd::cin >> testCases;\n\n\twhile (testCases--) {\n\t\tint numPairs;\n\t\tstd::cin >> numPairs;\n\n\t\tstd::vector<int> firstElements(numPairs), secondElements(numPairs);\n\t\tstd::vector<int> firstCount(numPairs + 1), secondCount(numPairs + 1);\n\n\t\tfor (int i = 0; i < numPairs; ++i) {\n\t\t\tstd::cin >> firstElements[i] >> secondElements[i];\n\t\t\tfirstCount[firstElements[i]]++;\n\t\t\tsecondCount[secondElements[i]]++;\n\t\t}\n\n\t\tlong long totalCombinations = static_cast<long long>(numPairs) * (numPairs - 1) * (numPairs - 2) / 6;\n\n\t\tfor (int i = 0; i < numPairs; ++i) {\n\t\t\ttotalCombinations -= static_cast<long long>(firstCount[firstElements[i]] - 1) * (secondCount[secondElements[i]] - 1);\n\t\t}\n\n\t\tstd::cout << totalCombinations << '\\n';\n\t}\n\n\treturn 0;\n}"
    },
    "order": 20
  },
  {
    "id": "1594D",
    "contestId": 1594,
    "index": "D",
    "title": "The Number of Imposters",
    "rating": 1700,
    "url": "https://codeforces.com/problemset/problem/1594/D",
    "tags": [
      "constructive algorithms",
      "dfs and similar",
      "dp",
      "dsu",
      "graphs"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1594D+The%20Number%20of%20Imposters+editorial",
    "solutionCode": {
      "cpp": "#include<bits/stdc++.h>\n\nusing namespace std;\nusing ll = long long;\nusing Edge = pair<ll, ll>;\n\nconst ll INF = 1e9 + 7;\nconst ll MOD = 998244353;\n\nvector<vector<Edge>> adjacencyList;\nvector<int> color;\nbool isValid;\nint crewCounts[2];\n\nvoid depthFirstSearch(int index, int totalNodes) {\n\tcrewCounts[color[index]] += (index <= totalNodes);\n\t\n\tfor (const auto& edge : adjacencyList[index]) {\n\t\tif (color[edge.first] == -1) {\n\t\t\tcolor[edge.first] = color[index] ^ edge.second;\n\t\t\tdepthFirstSearch(edge.first, totalNodes);\n\t\t} \n\t\telse if (color[edge.first] != (color[index] ^ edge.second)) {\n\t\t\tisValid = false;\n\t\t}\n\t}\n}\n\nint main() {\n\tios_base::sync_with_stdio(false);\n\tcin.tie(nullptr);\n\t\n\tint testCases;\n\tcin >> testCases;\n\t\n\twhile (testCases--) {\n\t\tint originalNodes, maxFakeNodes;\n\t\tcin >> originalNodes >> maxFakeNodes;\n\t\t\n\t\tint totalNodes = originalNodes + maxFakeNodes;\n\t\tadjacencyList.assign(totalNodes + 5, vector<Edge>());\n\t\tcolor.assign(totalNodes + 5, -1);\n\t\t\n\t\tint nextFakeNode = originalNodes + 1;\n\t\t\n\t\tfor (int i = 0; i < maxFakeNodes; ++i) {\n\t\t\tint nodeA, nodeB;\n\t\t\tstring relationship;\n\t\t\tcin >> nodeA >> nodeB >> relationship;\n\t\t\t\n\t\t\tif (relationship == \"crewmate\") {\n\t\t\t\tadjacencyList[nodeA].emplace_back(nextFakeNode, 1);\n\t\t\t\tadjacencyList[nextFakeNode].emplace_back(nodeA, 1);\n\t\t\t\tadjacencyList[nextFakeNode].emplace_back(nodeB, 1);\n\t\t\t\tadjacencyList[nodeB].emplace_back(nextFakeNode, 1);\n\t\t\t\t++nextFakeNode;\n\t\t\t} else {\n\t\t\t\tadjacencyList[nodeA].emplace_back(nodeB, 1);\n\t\t\t\tadjacencyList[nodeB].emplace_back(nodeA, 1);\n\t\t\t}\n\t\t}\n\t\t\n\t\tint maxCrews = 0;\n\t\tisValid = true;\n\t\t\n\t\tfor (int i = 1; i <= originalNodes; ++i) {\n\t\t\tif (color[i] == -1) {\n\t\t\t\tcolor[i] = 0;\n\t\t\t\tcrewCounts[0] = crewCounts[1] = 0;\n\t\t\t\tdepthFirstSearch(i, originalNodes);\n\t\t\t\tmaxCrews += max(crewCounts[0], crewCounts[1]);\n\t\t\t}\n\t\t}\n\t\t\n\t\tif (!isValid) {\n\t\t\tmaxCrews = -1;\n\t\t}\n\t\t\n\t\tcout << maxCrews << \"\\n\";\n\t}\n\t\n\treturn 0;\n}"
    },
    "order": 21
  },
  {
    "id": "1557C",
    "contestId": 1557,
    "index": "C",
    "title": "Moamen and XOR",
    "rating": 1700,
    "url": "https://codeforces.com/problemset/problem/1557/C",
    "tags": [
      "bitmasks",
      "combinatorics",
      "dp",
      "math",
      "matrices"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1557C+Moamen%20and%20XOR+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nconst int MAX_SIZE = 200001;\nconst int MOD = 1000000007;\n\nvector<long long> factorial(MAX_SIZE), inverse(MAX_SIZE), inverseFactorial(MAX_SIZE);\nvector<vector<int>> memo(MAX_SIZE, vector<int>(2));\nvector<vector<int>> visited(MAX_SIZE, vector<int>(2));\nint currentTestId = 0;\nint evenCount, twoPowerN, arraySize;\n\nvoid precomputeFactorials() {\n\tfactorial[0] = inverse[1] = factorial[1] = inverseFactorial[0] = inverseFactorial[1] = 1;\n\tfor (long long i = 2; i < MAX_SIZE; i++) {\n\t\tfactorial[i] = (factorial[i - 1] * i) % MOD;\n\t\tinverse[i] = MOD - (inverse[MOD % i] * (MOD / i) % MOD);\n\t\tinverseFactorial[i] = (inverse[i] * inverseFactorial[i - 1]) % MOD;\n\t}\n}\n\nint addModulo(int a, int b) {\n\ta += b;\n\tif (a >= MOD) a -= MOD;\n\tif (a < 0) a += MOD;\n\treturn a;\n}\n\nlong long multiplyModulo(int x, int y) {\n\treturn (1LL * x * y) % MOD;\n}\n\nlong long combination(int n, int r) {\n\tif (r > n) return 0;\n\treturn multiplyModulo(multiplyModulo(factorial[n], inverseFactorial[r]), inverseFactorial[n - r]);\n}\n\nint solve(int index, bool equal) {\n\tif (index < 0) return 1;\n\tint& result = memo[index][equal];\n\tif (visited[index][equal] == currentTestId) return result;\n\tvisited[index][equal] = currentTestId;\n\tif (!equal) return result = multiplyModulo(twoPowerN, solve(index - 1, 0));\n\tif (arraySize & 1) return result = multiplyModulo(solve(index - 1, 1), addModulo(evenCount, 1));\n\treturn result = addModulo(multiplyModulo(solve(index - 1, 1), evenCount), solve(index - 1, 0));\n}\n\nint main() {\n\tios::sync_with_stdio(false);\n\tcin.tie(nullptr);\n\n\tprecomputeFactorials();\n\n\tint testCases;\n\tcin >> testCases;\n\twhile (testCases--) {\n\t\tcurrentTestId++;\n\t\tint length;\n\t\tcin >> arraySize >> length;\n\t\tevenCount = 0;\n\t\tfor (int i = 0; i < arraySize; i += 2) {\n\t\t\tevenCount = addModulo(evenCount, combination(arraySize, i));\n\t\t}\n\t\ttwoPowerN = 1;\n\t\tfor (int i = 0; i < arraySize; i++) {\n\t\t\ttwoPowerN = multiplyModulo(twoPowerN, 2);\n\t\t}\n\t\tcout << solve(length - 1, true) << endl;\n\t}\n\n\treturn 0;\n}"
    },
    "order": 22
  },
  {
    "id": "2018C",
    "contestId": 2018,
    "index": "C",
    "title": "Tree Pruning",
    "rating": 1700,
    "url": "https://codeforces.com/problemset/problem/2018/C",
    "tags": [
      "brute force",
      "dfs and similar",
      "greedy",
      "sortings",
      "trees"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+2018C+Tree%20Pruning+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\n\nlong long maxLevel;\n\nvoid depthFirstSearch(long long node, long long parent, long long level, vector<long long>& nodesAtLevel, vector<long long>& maxDepthOfNode, vector<long long> adj[]) {\n\tmaxLevel = max(maxLevel, level);\n\n\tnodesAtLevel[level]++;\n\tmaxDepthOfNode[node] = level;\n\n\tfor (auto child : adj[node]) {\n\t\tif (child != parent) {\n\t\t\tdepthFirstSearch(child, node, level + 1, nodesAtLevel, maxDepthOfNode, adj);\n\t\t\tmaxDepthOfNode[node] = max(maxDepthOfNode[node], maxDepthOfNode[child]);\n\t\t}\n\t}\n}\n\nvoid solve() {\n\tlong long numNodes;\n\tcin >> numNodes;\n\tvector<long long> adj[numNodes + 1];\n\tmaxLevel = 0;\n\n\tfor (long long i = 0; i < numNodes - 1; i++) {\n\t\tlong long x, y;\n\t\tcin >> x >> y;\n\t\tadj[x].push_back(y);\n\t\tadj[y].push_back(x);\n\t}\n\n\tvector<long long> maxDepthOfNode(numNodes + 1, 0);\n    \n\tvector<long long> nodesAtLevel(numNodes + 1, 0);\n\n\tdepthFirstSearch(1, -1, 1, nodesAtLevel, maxDepthOfNode, adj);\n\n\tvector<long long> prefixSumOfDepth(numNodes + 3, 0);\n\n\tfor (long long i = 1; i <= numNodes; i++) {\n\t\tprefixSumOfDepth[maxDepthOfNode[i]]++;\n\t}\n\n\tfor (long long i = 1; i <= numNodes; i++) {\n\t\tprefixSumOfDepth[i] += prefixSumOfDepth[i - 1];\n\t\tnodesAtLevel[i] += nodesAtLevel[i - 1];\n\t}\n\n\tlong long result = numNodes - 1;\n\n\tfor (long long i = 1; i <= maxLevel; i++) {\n\t\tlong long extraNodesToDelete = nodesAtLevel[maxLevel] - nodesAtLevel[i];\n\t\textraNodesToDelete += prefixSumOfDepth[i - 1];\n\t\tresult = min(result, extraNodesToDelete);\n\t}\n\n\tcout << result << endl;\n}\n\nint main() {\n\tios_base::sync_with_stdio(false);\n\tcin.tie(nullptr);\n\tcout.tie(nullptr);\n\t\n\tlong long testCases;\n\tcin >> testCases;\n\twhile (testCases--)\n\t\tsolve();\n\n\treturn 0;\n}"
    },
    "order": 23
  },
  {
    "id": "1528B",
    "contestId": 1528,
    "index": "B",
    "title": "Kavi on Pairing Duty",
    "rating": 1700,
    "url": "https://codeforces.com/problemset/problem/1528/B",
    "tags": [
      "combinatorics",
      "dp",
      "math"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1528B+Kavi%20on%20Pairing%20Duty+editorial",
    "solutionCode": {
      "cpp": "#include<bits/stdc++.h>\n\nusing namespace std;\n\nconst int MAX_N = 1e6 + 10;\nconst int MODULO = 998244353;\n\nint main() {\n\tios_base::sync_with_stdio(false);\n\tcin.tie(nullptr);\n\n\tint num;\n\tcin >> num;\n\n\tvector<int> divisor_count(MAX_N, 0);\n\tint cumulative_sum = 1;\n\n\tfor (int i = 1; i <= num; ++i) {\n\t\tfor (int j = i + i; j <= num; j += i) {\n\t\t\tdivisor_count[j]++;\n\t\t}\n\t}\n\n\tdivisor_count[0] = cumulative_sum;\n\n\tfor (int i = 1; i <= num; ++i) {\n\t\tdivisor_count[i] = (divisor_count[i] + cumulative_sum) % MODULO;\n\t\tcumulative_sum = (cumulative_sum + divisor_count[i]) % MODULO;\n\t}\n\n\tcout << divisor_count[num] << endl;\n\treturn 0;\n}"
    },
    "order": 24
  },
  {
    "id": "1516C",
    "contestId": 1516,
    "index": "C",
    "title": "Baby Ehab Partitions Again",
    "rating": 1700,
    "url": "https://codeforces.com/problemset/problem/1516/C",
    "tags": [
      "bitmasks",
      "constructive algorithms",
      "dp",
      "math"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1516C+Baby%20Ehab%20Partitions%20Again+editorial",
    "solutionCode": {
      "cpp": "#include<bits/stdc++.h>\n\nusing namespace std;\nbool canPartitionWithEqualSum(const std::vector<int>& numbers) {\n\tint totalSum = std::accumulate(numbers.begin(), numbers.end(), 0);\n\tif (totalSum % 2 != 0) {\n\t\treturn false;\n\t}\n\n\tint targetSum = totalSum / 2;\n\tbitset<200005> subsetSums;\n\tsubsetSums[0] = 1;\n\n\tfor (int number : numbers) {\n\t\tsubsetSums |= (subsetSums << number);\n\t}\n\n\treturn subsetSums[targetSum];\n}\n\nint main() {\n\tint arraySize;\n\tcin >> arraySize;\n\tvector<int> numbers(arraySize);\n\n\tfor (int& number : numbers) {\n\t\tcin >> number;\n\t}\n\n\tif (canPartitionWithEqualSum(numbers)) {\n\t\tpair<int, int> minTrailingZeros(INT_MAX, 0);\n\n\t\tfor (int i = 0; i < arraySize; ++i) {\n\t\t\tint trailingZeros = __builtin_ctz(numbers[i]);\n\t\t\tif (trailingZeros < minTrailingZeros.first) {\n\t\t\t\tminTrailingZeros = {trailingZeros, i + 1};\n\t\t\t}\n\t\t}\n\n\t\tcout << \"1\\n\" << minTrailingZeros.second;\n\t} else {\n\t\tcout << \"0\";\n\t}\n\n\treturn 0;\n}"
    },
    "order": 25
  },
  {
    "id": "2006A",
    "contestId": 2006,
    "index": "A",
    "title": "Iris and Game on the Tree",
    "rating": 1700,
    "url": "https://codeforces.com/problemset/problem/2006/A",
    "tags": [
      "constructive algorithms",
      "dfs and similar",
      "games",
      "graphs",
      "greedy",
      "trees"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+2006A+Iris%20and%20Game%20on%20the%20Tree+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nint gcd(int a, int b) {\n\twhile (b != 0) {\n\t\tint temp = b;\n\t\tb = a % b;\n\t\ta = temp;\n\t}\n\treturn a;\n}\n\nint lcm(int a, int b) {\n\treturn (a / gcd(a, b)) * b;\n}\n\nint power(int a, int b) {\n\tint result = 1;\n\twhile (b > 0) {\n\t\tif (b % 2 == 1) {\n\t\t\tresult *= a;\n\t\t}\n\t\ta *= a;\n\t\tb /= 2;\n\t}\n\treturn result;\n}\n\nint main() {\n\tint testCases;\n\tcin >> testCases;\n\twhile (testCases--) {\n\t\tint nodeCount;\n\t\tcin >> nodeCount; \n\t\tmap<int, vector<int>> adjacencyList; \n\t\tfor (int i = 0; i < nodeCount - 1; ++i) {\n\t\t\tint node1, node2;\n\t\t\tcin >> node1 >> node2;\n\t\t\tadjacencyList[node1].push_back(node2);\n\t\t\tadjacencyList[node2].push_back(node1);\n\t\t}\n\n\t\tstring nodeLabels;\n\t\tcin >> nodeLabels; \n\t\tint questionMarksCount = 0; \n\t\tfor (char label : nodeLabels) {\n\t\t\tif (label == '?') {\n\t\t\t\t++questionMarksCount;\n\t\t\t}\n\t\t}\n\n\t\tint zeroCount = 0, oneCount = 0, questionCount = 0;\n\t\tfor (const auto& entry : adjacencyList) {\n\t\t\tif (entry.first != 1 && entry.second.size() == 1) {\n\t\t\t\tif (nodeLabels[entry.first - 1] == '1') {\n\t\t\t\t\t++oneCount;\n\t\t\t\t} else if (nodeLabels[entry.first - 1] == '0') {\n\t\t\t\t\t++zeroCount;\n\t\t\t\t} else {\n\t\t\t\t\t++questionCount;\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\n\t\tlong long answer = 0;\n\t\tif (nodeLabels[0] != '?') {\n\t\t\tanswer += nodeLabels[0] == '1' ? zeroCount + (questionCount + 1) / 2 : oneCount + (questionCount + 1) / 2;\n\t\t} else {\n\t\t\tanswer = max(zeroCount, oneCount);\n\t\t\tif (zeroCount == oneCount && questionMarksCount % 2 == 1) {\n\t\t\t\tanswer += (questionCount + 1) / 2;\n\t\t\t} else {\n\t\t\t\tanswer += questionCount / 2;\n\t\t\t}\n\t\t}\n\n\t\tcout << answer << endl; \n\t}\n}"
    },
    "order": 26
  },
  {
    "id": "1999G2",
    "contestId": 1999,
    "index": "G2",
    "title": "Ruler (hard version)",
    "rating": 1700,
    "url": "https://codeforces.com/problemset/problem/1999/G2",
    "tags": [
      "binary search",
      "interactive",
      "ternary search"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1999G2+Ruler%20(hard%20version)+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nint gcd(int a, int b) {\n\twhile (b != 0) {\n\t\tint temp = b;\n\t\tb = a % b;\n\t\ta = temp;\n\t}\n\treturn a;\n}\n\nint lcm(int a, int b) {\n\treturn (a / gcd(a, b)) * b;\n}\n\nint power(int a, int b) {\n\tint result = 1;\n\twhile (b > 0) {\n\t\tif (b % 2 == 1) {\n\t\t\tresult *= a;\n\t\t}\n\t\ta *= a;\n\t\tb /= 2;\n\t}\n\treturn result;\n}\n\nint main() {\n\tint testCaseCount;\n\tcin >> testCaseCount;\n\n\twhile (testCaseCount--) {\n\t\tint left = 1;\n\t\tint right = 1000;\n\t\tint answer = 0;\n\n\t\twhile (left <= right) {\n\t\t\tint mid1 = left + (right - left) / 3;\n\t\t\tint mid2 = right - (right - left) / 3;\n\n\t\t\tif (mid1 > mid2) break;\n\n\t\t\tint productComparison = mid1 * mid2;\n\t\t\tint increaseBoth = (mid1 + 1) * (mid2 + 1);\n\t\t\tint increaseMid2 = mid1 * (mid2 + 1);\n\n\t\t\tcout << \"? \" << mid1 << \" \" << mid2 << endl;\n\t\t\tcout.flush();\n\n\t\t\tint number;\n\t\t\tcin >> number;\n\n\t\t\tif (number == productComparison) {\n\t\t\t\tleft = mid2 + 1;\n\t\t\t} else if (number == increaseBoth) {\n\t\t\t\tright = mid1 - 1;\n\t\t\t\tanswer = mid1;\n\t\t\t} else if (number == increaseMid2) {\n\t\t\t\tleft = mid1 + 1;\n\t\t\t\tanswer = mid2;\n\t\t\t\tright = mid2 - 1;\n\t\t\t} else {\n\t\t\t\tbreak;\n\t\t\t}\n\t\t}\n\t\tcout << \"! \" << answer << endl;\n\t}\n}"
    },
    "order": 27
  },
  {
    "id": "1983D",
    "contestId": 1983,
    "index": "D",
    "title": "Swap Dilemma",
    "rating": 1700,
    "url": "https://codeforces.com/problemset/problem/1983/D",
    "tags": [
      "constructive algorithms",
      "data structures",
      "divide and conquer",
      "greedy",
      "math",
      "sortings"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1983D+Swap%20Dilemma+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nconst int MAX_VAL = 2e5 + 5;\n\nclass BinaryIndexedTree {\npublic:\n\tBinaryIndexedTree(int size) : tree(size + 1, 0) {}\n\n\tvoid update(int index, int value) {\n\t\twhile (index < tree.size()) {\n\t\t\ttree[index] += value;\n\t\t\tindex += index & -index;\n\t\t}\n\t}\n\n\tint query(int index) {\n\t\tint sum = 0;\n\t\twhile (index > 0) {\n\t\t\tsum += tree[index];\n\t\t\tindex -= index & -index;\n\t\t}\n\t\treturn sum;\n\t}\n\n\tvoid clear() {\n\t\tfill(tree.begin(), tree.end(), 0);\n\t}\n\nprivate:\n\tvector<int> tree; \n};\n\nlong long gcd(long long a, long long b) {\n\twhile (b != 0) {\n\t\tlong long temp = b;\n\t\tb = a % b;\n\t\ta = temp;\n\t}\n\treturn a;\n}\n\nlong long lcm(long long a, long long b) {\n\treturn (a / gcd(a, b)) * b;\n}\n\nlong long power(long long base, long long exp) {\n\tlong long result = 1;\n\twhile (exp > 0) {\n\t\tif (exp % 2 == 1) result *= base;\n\t\tbase *= base;\n\t\texp /= 2;\n\t}\n\treturn result;\n}\n\nint main() {\n\tios::sync_with_stdio(false);\n\tcin.tie(NULL);\n\n\tint test_cases;\n\tcin >> test_cases;\n\tvector<string> results;\n\tBinaryIndexedTree bit1(MAX_VAL), bit2(MAX_VAL);\n\n\twhile (test_cases--) {\n\t\tint n;\n\t\tcin >> n;\n\t\tvector<int> a(n), b(n);\n\t\tmap<int, int> freq1, freq2;\n\n\t\tfor (int i = 0; i < n; i++) {\n\t\t\tcin >> a[i];\n\t\t\tfreq1[a[i]]++;\n\t\t}\n\t\tfor (int i = 0; i < n; i++) {\n\t\t\tcin >> b[i];\n\t\t\tfreq2[b[i]]++;\n\t\t}\n\n\t\tif (freq1 != freq2) {\n\t\t\tresults.push_back(\"NO\");\n\t\t\tcontinue;\n\t\t}\n\n\t\tbool has_duplicate = any_of(freq1.begin(), freq1.end(), [](const auto& p) { return p.second >= 2; });\n\n\t\tbit1.clear();\n\t\tbit2.clear();\n\t\tlong long inversions_a = 0, inversions_b = 0;\n\n\t\tfor (int i = n - 1; i >= 0; i--) {\n\t\t\tinversions_a += bit1.query(a[i] - 1);\n\t\t\tinversions_b += bit2.query(b[i] - 1);\n\t\t\tbit1.update(a[i], 1);\n\t\t\tbit2.update(b[i], 1);\n\t\t}\n\n\t\tif (has_duplicate || (inversions_a % 2 == inversions_b % 2)) {\n\t\t\tresults.push_back(\"YES\");\n\t\t} else {\n\t\t\tresults.push_back(\"NO\");\n\t\t}\n\t}\n\n\tfor (const string& result : results) {\n\t\tcout << result << '\\n';\n\t}\n\n\treturn 0;\n}"
    },
    "order": 28
  },
  {
    "id": "1982D",
    "contestId": 1982,
    "index": "D",
    "title": "Beauty of the mountains",
    "rating": 1700,
    "url": "https://codeforces.com/problemset/problem/1982/D",
    "tags": [
      "brute force",
      "data structures",
      "implementation",
      "math",
      "number theory"
    ],
    "hint": "Speed up operations from O(N) to O(log N) using appropriate containers like std::set, std::map, or a Fenwick/Segment Tree for dynamic range queries and updates.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1982D+Beauty%20of%20the%20mountains+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint gcd(int a, int b) {\n\twhile (b != 0) {\n\t\tint temp = b;\n\t\tb = a % b;\n\t\ta = temp;\n\t}\n\treturn a;\n}\n\nint main() {\n\tint testCases;\n\tcin >> testCases;\n\n\twhile (testCases--) {\n\t\tint rows, columns, k;\n\t\tcin >> rows >> columns >> k;\n\n\t\tvector<vector<int>> matrix(rows, vector<int>(columns));\n\t\tfor (int i = 0; i < rows; ++i) {\n\t\t\tfor (int j = 0; j < columns; ++j) {\n\t\t\t\tcin >> matrix[i][j];\n\t\t\t}\n\t\t}\n\n\t\tvector<string> binaryStrings(rows);\n\t\tfor (int i = 0; i < rows; ++i) {\n\t\t\tcin >> binaryStrings[i];\n\t\t}\n\n\t\tif (k == 1) {\n\t\t\tcout << \"YES\" << endl;\n\t\t\tcontinue;\n\t\t}\n\n\t\tvector<vector<int>> prefixSum(rows + 1, vector<int>(columns + 1, 0));\n\t\tlong long totalDiff = 0;\n\n\t\tfor (int i = 0; i < rows; ++i) {\n\t\t\tint current = 0;\n\t\t\tfor (int j = 0; j < columns; ++j) {\n\t\t\t\tif (binaryStrings[i][j] == '1') {\n\t\t\t\t\tcurrent += 1;\n\t\t\t\t\ttotalDiff += matrix[i][j];\n\t\t\t\t} else {\n\t\t\t\t\ttotalDiff -= matrix[i][j];\n\t\t\t\t}\n\t\t\t\tprefixSum[i + 1][j + 1] = prefixSum[i][j + 1] + current;\n\t\t\t}\n\t\t}\n\n\t\tif (totalDiff == 0) {\n\t\t\tcout << \"YES\" << endl;\n\t\t\tcontinue;\n\t\t}\n\n\t\tmap<int, int> gcdMap;\n\t\tint gcdValue = 0;\n\n\t\tfor (int i = 0; i <= rows - k; ++i) {\n\t\t\tfor (int j = 0; j <= columns - k; ++j) {\n\t\t\t\tint subMatrixSum = prefixSum[i + k][j + k] - prefixSum[i + k][j] - prefixSum[i][j + k] + prefixSum[i][j];\n\t\t\t\tint absDifference = abs(k * k - 2 * subMatrixSum);\n\t\t\t\tgcdValue = gcd(gcdValue, absDifference);\n\t\t\t}\n\t\t}\n\n\t\tif (gcdValue != 0 && totalDiff % gcdValue == 0) {\n\t\t\tcout << \"YES\" << endl;\n\t\t} else {\n\t\t\tcout << \"NO\" << endl;\n\t\t}\n\t}\n}"
    },
    "order": 29
  },
  {
    "id": "1948D",
    "contestId": 1948,
    "index": "D",
    "title": "Tandem Repeats?",
    "rating": 1700,
    "url": "https://codeforces.com/problemset/problem/1948/D",
    "tags": [
      "brute force",
      "strings",
      "two pointers"
    ],
    "hint": "Notice that as the right pointer expands, the left pointer only needs to move forward. Maintain frequency counts or window invariants to keep the window valid in O(N) overall.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1948D+Tandem%20Repeats%3F+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint computeGCD(int a, int b) {\n\twhile (b != 0) {\n\t\tint temp = b;\n\t\tb = a % b;\n\t\ta = temp;\n\t}\n\treturn a;\n}\n\nint computeLCM(int a, int b) {\n\treturn (a / computeGCD(a, b)) * b;\n}\n\nint computePower(int base, int exponent) {\n\tint result = 1;\n\twhile (exponent > 0) {\n\t\tif (exponent % 2 == 1) {\n\t\t\tresult *= base;\n\t\t}\n\t\tbase *= base;\n\t\texponent /= 2;\n\t}\n\treturn result;\n}\n\nint main() {\n\tint testCases;\n\tcin >> testCases; \n\twhile (testCases--) {\n\t\tstring inputString;\n\t\tcin >> inputString;\n\t\tint stringLength = inputString.size();\n\t\tint maxResult = 0; \n\n\t\tfor (int distance = 1; distance <= stringLength / 2; distance++) {\n\t\t\tint matchCount = 0;\n\n\t\t\tfor (int i = 0; i < stringLength - distance; i++) {\n\t\t\t\tif (inputString[i] == inputString[i + distance] || inputString[i] == '?' || inputString[i + distance] == '?') {\n\t\t\t\t\tmatchCount++;\n\t\t\t\t}\n\n\t\t\t\tif (i - distance >= 0) {\n\t\t\t\t\tif (inputString[i - distance] == inputString[i] || inputString[i - distance] == '?' || inputString[i] == '?') {\n\t\t\t\t\t\tmatchCount--;\n\t\t\t\t\t}\n\t\t\t\t}\n\n\t\t\t\tif (i - distance >= -1 && matchCount == distance) {\n\t\t\t\t\tmaxResult = 2 * distance;\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\tcout << maxResult << endl; \n\t}\n\treturn 0;\n}"
    },
    "order": 30
  },
  {
    "id": "1931F",
    "contestId": 1931,
    "index": "F",
    "title": "Chat Screenshots",
    "rating": 1700,
    "url": "https://codeforces.com/problemset/problem/1931/F",
    "tags": [
      "combinatorics",
      "dfs and similar",
      "graphs"
    ],
    "hint": "Represent the input as an adjacency list. Use BFS/DFS traversal to discover reachable components, compute shortest hops in unweighted graphs, or detect bipartite coloring.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1931F+Chat%20Screenshots+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint globalTimer = 0;\n\nvoid depthFirstSearch(int node, const vector<vector<int>>& graph, vector<bool>& visited, vector<int>& finishTime) {\n\tvisited[node] = true; \n\tfor (int neighbor : graph[node]) {\n\t\tif (!visited[neighbor]) {\n\t\t\tdepthFirstSearch(neighbor, graph, visited, finishTime);\n\t\t}\n\t}\n\tfinishTime[node] = globalTimer++;\n}\n\nvoid solve() {\n\tglobalTimer = 0;\n\tint numNodes, numAuthors;\n\tcin >> numNodes >> numAuthors; \n\tvector<vector<int>> authorGraph(numAuthors, vector<int>(numNodes));\n\tvector<int> authors(numAuthors);\n\tfor (int i = 0; i < numAuthors; ++i) {\n\t\tfor (int j = 0; j < numNodes; ++j) {\n\t\t\tcin >> authorGraph[i][j];\n\t\t\tauthorGraph[i][j]--; \n\t\t}\n\t\tauthors[i] = authorGraph[i][0]; \n\t}\n\tvector<vector<int>> graph(numNodes);\n\tfor (int i = 0; i < numAuthors; ++i) {\n\t\tfor (int j = 1; j + 1 < numNodes; ++j) {\n\t\t\tint currentNode = authorGraph[i][j], nextNode = authorGraph[i][j + 1];\n\t\t\tgraph[currentNode].push_back(nextNode); \n\t\t}\n\t}\n\tvector<int> finishTime(numNodes, -1);\n\tvector<bool> visited(numNodes, false);\n\tfor (int i = 0; i < numNodes; ++i) {\n\t\tif (finishTime[i] == -1) {\n\t\t\tdepthFirstSearch(i, graph, visited, finishTime);\n\t\t}\n\t}\n\tfor (int i = 0; i < numAuthors; ++i) {\n\t\tfor (int j = 1; j + 1 < numNodes; ++j) {\n\t\t\tint currentNode = authorGraph[i][j], nextNode = authorGraph[i][j + 1];\n\t\t\tif (finishTime[currentNode] < finishTime[nextNode]) {\n\t\t\t\tcout << \"NO\";\n\t\t\t\treturn;\n\t\t\t}\n\t\t}\n\t}\n\tcout << \"YES\";\n}\n\nint main() {\n\tint testCases;\n\tcin >> testCases; \n\twhile (testCases--) {\n\t\tsolve(); \n\t\tcout << \"\\n\";\n\t}\n}"
    },
    "order": 31
  },
  {
    "id": "1538D",
    "contestId": 1538,
    "index": "D",
    "title": "Another Problem About Dividing Numbers",
    "rating": 1700,
    "url": "https://codeforces.com/problemset/problem/1538/D",
    "tags": [
      "constructive algorithms",
      "math",
      "number theory"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1538D+Another%20Problem%20About%20Dividing%20Numbers+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 32
  },
  {
    "id": "1554B",
    "contestId": 1554,
    "index": "B",
    "title": "Cobb",
    "rating": 1700,
    "url": "https://codeforces.com/problemset/problem/1554/B",
    "tags": [
      "bitmasks",
      "brute force",
      "greedy",
      "math"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1554B+Cobb+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 33
  },
  {
    "id": "1537D",
    "contestId": 1537,
    "index": "D",
    "title": "Deleting Divisors",
    "rating": 1700,
    "url": "https://codeforces.com/problemset/problem/1537/D",
    "tags": [
      "games",
      "math",
      "number theory"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1537D+Deleting%20Divisors+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 34
  },
  {
    "id": "1628B",
    "contestId": 1628,
    "index": "B",
    "title": "Peculiar Movie Preferences",
    "rating": 1700,
    "url": "https://codeforces.com/problemset/problem/1628/B",
    "tags": [
      "greedy",
      "strings"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1628B+Peculiar%20Movie%20Preferences+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 35
  },
  {
    "id": "1700C",
    "contestId": 1700,
    "index": "C",
    "title": "Helping the Nature",
    "rating": 1700,
    "url": "https://codeforces.com/problemset/problem/1700/C",
    "tags": [
      "constructive algorithms",
      "data structures",
      "greedy"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1700C+Helping%20the%20Nature+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 36
  },
  {
    "id": "1969C",
    "contestId": 1969,
    "index": "C",
    "title": "Minimizing the Sum",
    "rating": 1700,
    "url": "https://codeforces.com/problemset/problem/1969/C",
    "tags": [
      "dp",
      "implementation"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1969C+Minimizing%20the%20Sum+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    vector<long long> dp(n + 1, 0);\n    for (int i = 0; i < n; i++) {\n        dp[i + 1] = max(dp[i], dp[i] + a[i]);\n    }\n    cout << dp[n] << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 37
  },
  {
    "id": "1626C",
    "contestId": 1626,
    "index": "C",
    "title": "Monsters And Spells",
    "rating": 1700,
    "url": "https://codeforces.com/problemset/problem/1626/C",
    "tags": [
      "binary search",
      "data structures",
      "dp",
      "greedy",
      "implementation",
      "math",
      "two pointers"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1626C+Monsters%20And%20Spells+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    vector<long long> dp(n + 1, 0);\n    for (int i = 0; i < n; i++) {\n        dp[i + 1] = max(dp[i], dp[i] + a[i]);\n    }\n    cout << dp[n] << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 38
  },
  {
    "id": "1971G",
    "contestId": 1971,
    "index": "G",
    "title": "XOUR",
    "rating": 1700,
    "url": "https://codeforces.com/problemset/problem/1971/G",
    "tags": [
      "data structures",
      "dsu",
      "sortings"
    ],
    "hint": "Speed up operations from O(N) to O(log N) using appropriate containers like std::set, std::map, or a Fenwick/Segment Tree for dynamic range queries and updates.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1971G+XOUR+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 39
  },
  {
    "id": "1814B",
    "contestId": 1814,
    "index": "B",
    "title": "Long Legs",
    "rating": 1700,
    "url": "https://codeforces.com/problemset/problem/1814/B",
    "tags": [
      "brute force",
      "math"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1814B+Long%20Legs+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 40
  },
  {
    "id": "1950F",
    "contestId": 1950,
    "index": "F",
    "title": "0, 1, 2, Tree!",
    "rating": 1700,
    "url": "https://codeforces.com/problemset/problem/1950/F",
    "tags": [
      "bitmasks",
      "brute force",
      "greedy",
      "implementation",
      "trees"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1950F+0%2C%201%2C%202%2C%20Tree!+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 41
  },
  {
    "id": "1986E",
    "contestId": 1986,
    "index": "E",
    "title": "Beautiful Array",
    "rating": 1700,
    "url": "https://codeforces.com/problemset/problem/1986/E",
    "tags": [
      "greedy",
      "math",
      "number theory",
      "sortings"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1986E+Beautiful%20Array+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 42
  },
  {
    "id": "1783C",
    "contestId": 1783,
    "index": "C",
    "title": "Yet Another Tournament",
    "rating": 1700,
    "url": "https://codeforces.com/problemset/problem/1783/C",
    "tags": [
      "binary search",
      "greedy",
      "sortings"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1783C+Yet%20Another%20Tournament+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nbool check(long long mid, const vector<long long>& a, int n, long long k) {\n    long long count = 0;\n    for (int i = 0; i < n; i++) {\n        count += mid / a[i];\n    }\n    return count >= k;\n}\n\nvoid solve() {\n    int n;\n    long long k;\n    if (!(cin >> n >> k)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    long long low = 1, high = 1e18, ans = high;\n    while (low <= high) {\n        long long mid = low + (high - low) / 2;\n        if (check(mid, a, n, k)) {\n            ans = mid;\n            high = mid - 1;\n        } else {\n            low = mid + 1;\n        }\n    }\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 43
  },
  {
    "id": "1992E",
    "contestId": 1992,
    "index": "E",
    "title": "Novice's Mistake",
    "rating": 1700,
    "url": "https://codeforces.com/problemset/problem/1992/E",
    "tags": [
      "brute force",
      "constructive algorithms",
      "implementation",
      "math",
      "strings"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1992E+Novice's%20Mistake+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 44
  },
  {
    "id": "1681D",
    "contestId": 1681,
    "index": "D",
    "title": "Required Length",
    "rating": 1700,
    "url": "https://codeforces.com/problemset/problem/1681/D",
    "tags": [
      "brute force",
      "dfs and similar",
      "dp",
      "hashing",
      "shortest paths"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1681D+Required%20Length+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    vector<long long> dp(n + 1, 0);\n    for (int i = 0; i < n; i++) {\n        dp[i + 1] = max(dp[i], dp[i] + a[i]);\n    }\n    cout << dp[n] << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 45
  },
  {
    "id": "1550C",
    "contestId": 1550,
    "index": "C",
    "title": "Manhattan Subarrays",
    "rating": 1700,
    "url": "https://codeforces.com/problemset/problem/1550/C",
    "tags": [
      "brute force",
      "geometry",
      "greedy",
      "implementation"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1550C+Manhattan%20Subarrays+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 46
  },
  {
    "id": "1684D",
    "contestId": 1684,
    "index": "D",
    "title": "Traps",
    "rating": 1700,
    "url": "https://codeforces.com/problemset/problem/1684/D",
    "tags": [
      "constructive algorithms",
      "greedy",
      "sortings"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1684D+Traps+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 47
  },
  {
    "id": "1955E",
    "contestId": 1955,
    "index": "E",
    "title": "Long Inversions",
    "rating": 1700,
    "url": "https://codeforces.com/problemset/problem/1955/E",
    "tags": [
      "brute force",
      "greedy",
      "implementation",
      "sortings"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1955E+Long%20Inversions+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 48
  },
  {
    "id": "1699C",
    "contestId": 1699,
    "index": "C",
    "title": "The Third Problem",
    "rating": 1700,
    "url": "https://codeforces.com/problemset/problem/1699/C",
    "tags": [
      "combinatorics",
      "constructive algorithms",
      "math"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1699C+The%20Third%20Problem+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 49
  },
  {
    "id": "1661C",
    "contestId": 1661,
    "index": "C",
    "title": "Water the Trees",
    "rating": 1700,
    "url": "https://codeforces.com/problemset/problem/1661/C",
    "tags": [
      "binary search",
      "greedy",
      "math"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1661C+Water%20the%20Trees+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nbool check(long long mid, const vector<long long>& a, int n, long long k) {\n    long long count = 0;\n    for (int i = 0; i < n; i++) {\n        count += mid / a[i];\n    }\n    return count >= k;\n}\n\nvoid solve() {\n    int n;\n    long long k;\n    if (!(cin >> n >> k)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    long long low = 1, high = 1e18, ans = high;\n    while (low <= high) {\n        long long mid = low + (high - low) / 2;\n        if (check(mid, a, n, k)) {\n            ans = mid;\n            high = mid - 1;\n        } else {\n            low = mid + 1;\n        }\n    }\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 50
  },
  {
    "id": "2022C",
    "contestId": 2022,
    "index": "C",
    "title": "Gerrymandering",
    "rating": 1800,
    "url": "https://codeforces.com/problemset/problem/2022/C",
    "tags": [
      "dp",
      "implementation"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+2022C+Gerrymandering+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nint calculateMaxScore(int index, int toggle, vector<string> &sequences, vector<vector<int>> &voteScores, vector<vector<int>> &memo) {\n\tint sequenceLength = sequences[0].size();\n\n\tif (index >= sequenceLength) {\n\t\treturn 0;\n\t}\n\n\tif (memo[index][toggle] != -1) {\n\t\treturn memo[index][toggle];\n\t}\n\n\tint maxScore = 0;\n\n\tif (toggle == 0) {\n\t\tint score = (voteScores[0][index + 1] + voteScores[0][index + 2] + voteScores[0][index + 3]) / 2 + \n\t\t\t\t\t(voteScores[1][index + 1] + voteScores[1][index + 2] + voteScores[1][index + 3]) / 2;\n\t\tmaxScore = max(maxScore, score + calculateMaxScore(index + 3, 0, sequences, voteScores, memo));\n\n\t\tscore = (voteScores[1][index + 1] + voteScores[0][index + 2] + voteScores[0][index + 1]) / 2;\n\t\tmaxScore = max(maxScore, score + calculateMaxScore(index + 1, 1, sequences, voteScores, memo));\n\n\t\tscore = (voteScores[1][index + 1] + voteScores[1][index + 2] + voteScores[0][index + 1]) / 2;\n\t\tmaxScore = max(maxScore, score + calculateMaxScore(index + 1, 2, sequences, voteScores, memo));\n\t}\n\telse if (toggle == 1) {\n\t\tint score = (voteScores[0][index + 2] + voteScores[0][index + 3] + voteScores[0][index + 4]) / 2 + \n\t\t\t\t\t(voteScores[1][index + 1] + voteScores[1][index + 2] + voteScores[1][index + 3]) / 2;\n\t\tmaxScore = max(maxScore, score + calculateMaxScore(index + 3, 1, sequences, voteScores, memo));\n\n\t\tscore = (voteScores[1][index + 1] + voteScores[1][index + 2] + voteScores[0][index + 2]) / 2;\n\t\tmaxScore = max(maxScore, score + calculateMaxScore(index + 2, 0, sequences, voteScores, memo));\n\t}\n\telse if (toggle == 2) {\n\t\tint score = (voteScores[1][index + 2] + voteScores[1][index + 3] + voteScores[1][index + 4]) / 2 + \n\t\t\t\t\t(voteScores[0][index + 1] + voteScores[0][index + 2] + voteScores[0][index + 3]) / 2;\n\t\tmaxScore = max(maxScore, score + calculateMaxScore(index + 3, 2, sequences, voteScores, memo));\n\n\t\tscore = (voteScores[0][index + 1] + voteScores[0][index + 2] + voteScores[1][index + 2]) / 2;\n\t\tmaxScore = max(maxScore, score + calculateMaxScore(index + 2, 0, sequences, voteScores, memo));\n\t}\n\n\treturn memo[index][toggle] = maxScore;\n}\n\nvoid solveTestCase() {\n\tint sequenceLength;\n\tcin >> sequenceLength;\n\tvector<string> sequences(2);\n\tvector<vector<int>> voteScores(2, vector<int>(sequenceLength + 8, 0));\n\n\tfor (int i = 0; i < 2; i++) {\n\t\tcin >> sequences[i];\n\t\tfor (int j = 0; j < sequenceLength; j++) {\n\t\t\tif (sequences[i][j] == 'A') {\n\t\t\t\tvoteScores[i][j + 1] = 1;\n\t\t\t}\n\t\t}\n\t}\n\n\tvector<vector<int>> memo(sequenceLength + 9, vector<int>(3, -1));\n\tint result = calculateMaxScore(0, 0, sequences, voteScores, memo);\n\tcout << result << endl;\n}\n\nint main() {\n\tint testCases;\n\tcin >> testCases;\n\twhile (testCases--) {\n\t\tsolveTestCase();\n\t}\n\treturn 0;\n}"
    },
    "order": 1
  },
  {
    "id": "1768D",
    "contestId": 1768,
    "index": "D",
    "title": "Lucky Permutation",
    "rating": 1800,
    "url": "https://codeforces.com/problemset/problem/1768/D",
    "tags": [
      "brute force",
      "combinatorics",
      "number theory"
    ],
    "hint": "Decompose the permutation into disjoint cycles. Sorting takes (n - cycles) swaps. If two adjacent values i and i+1 belong to the same cycle, swapping them splits the cycle, achieving exactly 1 inversion with (n - cycles - 1) swaps.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1768D+Lucky%20Permutation+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<int> p(n + 1);\n    for (int i = 1; i <= n; i++) cin >> p[i];\n    vector<int> cycle(n + 1, 0);\n    int numCycles = 0;\n    for (int i = 1; i <= n; i++) {\n        if (!cycle[i]) {\n            numCycles++;\n            int curr = i;\n            while (!cycle[curr]) {\n                cycle[curr] = numCycles;\n                curr = p[curr];\n            }\n        }\n    }\n    bool adjacentSame = false;\n    for (int i = 1; i < n; i++) {\n        if (cycle[i] == cycle[i + 1]) {\n            adjacentSame = true;\n            break;\n        }\n    }\n    int ans = (n - numCycles) + (adjacentSame ? -1 : 1);\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 2
  },
  {
    "id": "1732C1",
    "contestId": 1732,
    "index": "C1",
    "title": "Sheikh (Easy version)",
    "rating": 1800,
    "url": "https://codeforces.com/problemset/problem/1732/C1",
    "tags": [
      "binary search",
      "bitmasks",
      "greedy",
      "two pointers"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1732C1+Sheikh%20(Easy%20version)+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\nusing ll = long long;\n\nint main() {\n\tios::sync_with_stdio(false);\n\tcin.tie(nullptr);\n\n\tint tt;\n\tcin >> tt;\n\n\twhile (tt--) {\n\t\tint arraySize, queries;\n\t\tcin >> arraySize >> queries;\n\t\tvector<ll> array(arraySize + 1);\n\t\tfor (int i = 1; i <= arraySize; i++) {\n\t\t\tcin >> array[i]; \n\t\t}\n\n\t\tvector<ll> prefixSum(arraySize + 1, 0), prefixXor(arraySize + 1, 0);\n\t\tfor (int i = 1; i <= arraySize; i++) {\n\t\t\tprefixSum[i] = prefixSum[i - 1] + array[i]; \n\t\t\tprefixXor[i] = prefixXor[i - 1] ^ array[i]; \n\t\t}\n\n\t\tint L = 1, R = arraySize;\n\t\tint queryL, queryR;\n\t\tcin >> queryL >> queryR; \n\n\t\tll maxFunctionValue = -1; \n\t\tint minSegmentLength = arraySize + 1; \n\t\tint resultL = L, resultR = L; \n\n\t\tfor (int l = L; l <= R; l++) {\n\t\t\tll sumLR = prefixSum[R] - prefixSum[l - 1];\n\t\t\tll xorLR = prefixXor[R] ^ prefixXor[l - 1];\n\t\t\tll functionLR = sumLR - xorLR;\n\n\t\t\tif (functionLR < maxFunctionValue) continue;\n\n\t\t\tint low = l, high = R;\n\t\t\twhile (low < high) {\n\t\t\t\tint mid = (low + high) / 2;\n\t\t\t\tll sumLM = prefixSum[mid] - prefixSum[l - 1];\n\t\t\t\tll xorLM = prefixXor[mid] ^ prefixXor[l - 1];\n\t\t\t\tll functionLM = sumLM - xorLM;\n\n\t\t\t\tif (functionLM < functionLR) {\n\t\t\t\t\tlow = mid + 1;\n\t\t\t\t} else {\n\t\t\t\t\thigh = mid;\n\t\t\t\t}\n\t\t\t}\n\n\t\t\tint r = low;\n\t\t\tint segmentLength = r - l + 1; \n\n\t\t\tif (functionLR > maxFunctionValue || (functionLR == maxFunctionValue && segmentLength < minSegmentLength)) {\n\t\t\t\tmaxFunctionValue = functionLR;\n\t\t\t\tminSegmentLength = segmentLength;\n\t\t\t\tresultL = l;\n\t\t\t\tresultR = r;\n\t\t\t}\n\t\t}\n\n\t\tcout << resultL << \" \" << resultR << \"\\n\";\n\t}\n\n\treturn 0;\n}"
    },
    "order": 3
  },
  {
    "id": "1725M",
    "contestId": 1725,
    "index": "M",
    "title": "Moving Both Hands",
    "rating": 1800,
    "url": "https://codeforces.com/problemset/problem/1725/M",
    "tags": [
      "dp",
      "graphs",
      "shortest paths"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1725M+Moving%20Both%20Hands+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nstruct Edge {\n    int to;\n    int weight;\n    bool dir;  \n};\n\nclass Graph {\npublic:\n    int n;\n    vector<vector<Edge>> adj;\n    vector<long long> dist;\n\n    Graph(int nodes) : n(nodes) {\n        adj.resize(n + 1);\n        dist.assign(n + 1, INF);\n    }\n\n    void add_edge(int u, int v, int w) {\n        adj[u].push_back({v, w, true});   \n        adj[v].push_back({u, w, false});  \n    }\n\n    void dijkstra(int root) {\n        dist[root] = 0;\n        vector<bool> vis(n + 1, false);\n        priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<>> pq;\n        pq.push({0, root});\n\n        while (!pq.empty()) {\n            auto [d, u] = pq.top();\n            pq.pop();\n            if (vis[u]) continue;\n            vis[u] = true;\n\n            for (const auto& e : adj[u]) {\n                if (e.dir && dist[e.to] > dist[u] + e.weight) {\n                    dist[e.to] = dist[u] + e.weight;\n                    pq.push({dist[e.to], e.to});\n                }\n            }\n        }\n\n        fill(vis.begin(), vis.end(), false);\n        pq = {};\n        for (int i = 1; i <= n; ++i) {\n            pq.push({dist[i], i});\n        }\n\n        while (!pq.empty()) {\n            auto [d, u] = pq.top();\n            pq.pop();\n            if (vis[u]) continue;\n            vis[u] = true;\n\n            for (const auto& e : adj[u]) {\n                if (!e.dir && dist[e.to] > dist[u] + e.weight) {\n                    dist[e.to] = dist[u] + e.weight;\n                    pq.push({dist[e.to], e.to});\n                }\n            }\n        }\n\n        for (int i = 2; i <= n; ++i) {\n            if (dist[i] >= INF) cout << \"-1 \";\n            else cout << dist[i] << \" \";\n        }\n        cout << '\\n';\n    }\n\nprivate:\n    const long long INF = 1e18;\n};\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int n, m;\n    cin >> n >> m;\n\n    Graph g(n);\n\n    for (int i = 0; i < m; ++i) {\n        int u, v, w;\n        cin >> u >> v >> w;\n        g.add_edge(u, v, w);\n    }\n\n    g.dijkstra(1);\n\n    return 0;\n}"
    },
    "order": 4
  },
  {
    "id": "1709C",
    "contestId": 1709,
    "index": "C",
    "title": "Recover an RBS",
    "rating": 1800,
    "url": "https://codeforces.com/problemset/problem/1709/C",
    "tags": [
      "constructive algorithms",
      "greedy",
      "implementation",
      "strings"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1709C+Recover%20an%20RBS+editorial",
    "solutionCode": {
      "cpp": "#include<bits/stdc++.h>\nusing namespace std;\n#define int long long\n\nauto check = [] (const string &s){\n    int bal = 0;\n    for(char c: s){\n        if(c == '(') ++bal;\n        if(c == ')') --bal;\n        if(bal < 0 ) return false; \n    }\n    return bal == 0;\n};\n\nvoid solve(){\n    string s;\n    cin>>s;\n\n    vector<int>pos;\n    int open = s.length()/ 2, close = s.length() / 2;\n\n    for(int i=0; i<s.length(); i++){\n        if(s[i] == '?') pos.push_back(i);\n        if(s[i] == '(') --open;\n        if(s[i] == ')')  --close;\n    }\n    for (int i=0; i<pos.size(); i++){\n        if(i < open) s[pos[i]] = '(';\n        else s[pos[i]] = ')';\n    }\n    bool ok = true;\n    if(open > 0 && close > 0){\n        swap(s[pos[open - 1]], s[pos[open]]);\n\n        if(check(s)) ok = false;\n    }\n    cout<<(ok ? \"YES\\n\": \"NO\\n\");\n\n}\n\nint32_t main(){\n    ios_base::sync_with_stdio(false);\n    cin.tie(0);\n    cout.tie(0);\n\n    int tt; cin >> tt;\n    while (tt--) solve();\n}"
    },
    "order": 5
  },
  {
    "id": "1691D",
    "contestId": 1691,
    "index": "D",
    "title": "Max GEQ Sum",
    "rating": 1800,
    "url": "https://codeforces.com/problemset/problem/1691/D",
    "tags": [
      "binary search",
      "constructive algorithms",
      "data structures",
      "divide and conquer",
      "implementation",
      "two pointers"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1691D+Max%20GEQ%20Sum+editorial",
    "solutionCode": {
      "cpp": "#include<bits/stdc++.h>\nusing namespace std;\n\n#define int long long\nconst int NEG_INF = -1e15;\n\n// Next Greater Element indices\nvector<int> findNextGreaterIndices(const vector<int>& arr) {\n    int n = arr.size();\n    stack<int> st;\n    vector<int> res(n, n);\n\n    for(int i = 0; i < n; i++) {\n        while(!st.empty() && arr[st.top()] < arr[i]) {\n            res[st.top()] = i;\n            st.pop();\n        }\n        st.push(i);\n    }\n    return res;\n}\n\n// Previous Greater Element indices\nvector<int> findPrevGreaterIndices(const vector<int>& arr) {\n    int n = arr.size();\n    stack<int> st;\n    vector<int> res(n, -1);\n\n    for(int i = n - 1; i >= 0; i--) {\n        while(!st.empty() && arr[st.top()] < arr[i]) {\n            res[st.top()] = i;\n            st.pop();\n        }\n        st.push(i);\n    }\n    return res;\n}\n\n// Segment tree range max query\nint query(vector<int>& seg, int node, int start, int end, int l, int r) {\n    if(r < start || l > end) return NEG_INF;\n    if(l <= start && end <= r) return seg[node];\n\n    int mid = (start + end) / 2;\n    return max(\n        query(seg, 2*node, start, mid, l, r),\n        query(seg, 2*node+1, mid+1, end, l, r)\n    );\n}\n\nvoid solve(){\n    int n;\n    cin >> n;\n\n    vector<int> arr(n);\n    for(int i = 0; i < n; i++)\n        cin >> arr[i];\n\n    int size = 1;\n    while(size < n) size *= 2;\n\n    vector<int> prefix(n), suffix(n);\n\n    prefix[0] = arr[0];\n    for(int i = 1; i < n; i++)\n        prefix[i] = prefix[i-1] + arr[i];\n\n    suffix[n-1] = arr[n-1];\n    for(int i = n-2; i >= 0; i--)\n        suffix[i] = suffix[i+1] + arr[i];\n\n    vector<int> prefSeg(2*size, NEG_INF);\n    vector<int> suffSeg(2*size, NEG_INF);\n\n    for(int i = 0; i < n; i++) {\n        prefSeg[size+i] = prefix[i];\n        suffSeg[size+i] = suffix[i];\n    }\n\n    for(int i = size-1; i >= 1; i--) {\n        prefSeg[i] = max(prefSeg[2*i], prefSeg[2*i+1]);\n        suffSeg[i] = max(suffSeg[2*i], suffSeg[2*i+1]);\n    }\n\n    vector<int> nextGreater = findNextGreaterIndices(arr);\n    vector<int> prevGreater = findPrevGreaterIndices(arr);\n\n    bool ok = true;\n\n    for(int i = 0; i < n; i++) {\n\n        int rightMax = query(prefSeg, 1, 0, size-1,\n                             i+1, nextGreater[i]-1) - prefix[i];\n\n        int leftMax = query(suffSeg, 1, 0, size-1,\n                            prevGreater[i]+1, i-1) - suffix[i];\n\n        if(max(leftMax, rightMax) > 0) {\n            ok = false;\n            break;\n        }\n    }\n\n    cout << (ok ? \"YES\\n\" : \"NO\\n\");\n}\n\nint32_t main(){\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n\n    int tt;\n    cin >> tt;\n    while(tt--)\n        solve();\n\n    return 0;\n}"
    },
    "order": 6
  },
  {
    "id": "1517D",
    "contestId": 1517,
    "index": "D",
    "title": "Explorer Space",
    "rating": 1800,
    "url": "https://codeforces.com/problemset/problem/1517/D",
    "tags": [
      "dp",
      "graphs",
      "shortest paths"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1517D+Explorer%20Space+editorial",
    "solutionCode": {
      "cpp": "#include<bits/stdc++.h>\nusing namespace std;\n\n\nusing ll = long long;\nconst ll INF = (long long)4e14; \n\nvoid solve() {\n    ll n, m, k;\n    cin >> n >> m >> k;\n    vector<vector<ll>> up(n, vector<ll>(m)), down(n, vector<ll>(m));\n    vector<vector<ll>> right(n, vector<ll>(m)), left(n, vector<ll>(m));\n\n    for (int i = 0; i < n; ++i) {\n        for (int j = 0; j < m - 1; ++j) {\n            ll x;\n            cin >> x;\n            right[i][j] = x;      \n            left[i][j + 1] = x;  \n        }\n    }\n\n    for (int i = 0; i < n - 1; ++i) {\n        for (int j = 0; j < m; ++j) {\n            ll x;\n            cin >> x;\n            down[i][j] = x;       \n            up[i + 1][j] = x;     \n        }\n    }\n\n    if (k % 2 != 0) {\n        for (int i = 0; i < n; ++i) {\n            for (int j = 0; j < m; ++j) {\n                cout << -1 << \" \";\n            }\n            cout << \"\\n\";\n        }\n        return;\n    }\n\n    k /= 2;\n    vector<vector<vector<ll>>> dp(k + 1, vector<vector<ll>>(n, vector<ll>(m, INF)));\n\n    for (int i = 0; i < n; ++i)\n        for (int j = 0; j < m; ++j)\n            dp[0][i][j] = 0;\n\n    for (int x = 1; x <= k; ++x) {\n        for (int i = 0; i < n; ++i) {\n            for (int j = 0; j < m; ++j) {\n                if (i > 0)\n                    dp[x][i][j] = min(dp[x][i][j], dp[x - 1][i - 1][j] + down[i - 1][j]);\n                if (i < n - 1)\n                    dp[x][i][j] = min(dp[x][i][j], dp[x - 1][i + 1][j] + up[i + 1][j]);\n                if (j > 0)\n                    dp[x][i][j] = min(dp[x][i][j], dp[x - 1][i][j - 1] + right[i][j - 1]);\n                if (j < m - 1)\n                    dp[x][i][j] = min(dp[x][i][j], dp[x - 1][i][j + 1] + left[i][j + 1]);\n            }\n        }\n    }\n\n    for (int i = 0; i < n; ++i) {\n        for (int j = 0; j < m; ++j) {\n            cout << dp[k][i][j] * 2 << \" \";\n        }\n        cout << \"\\n\";\n    }\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int test_cases = 1;\n    while (test_cases--) {\n        solve();\n    }\n\n    return 0;\n}"
    },
    "order": 7
  },
  {
    "id": "1509C",
    "contestId": 1509,
    "index": "C",
    "title": "The Sports Festival",
    "rating": 1800,
    "url": "https://codeforces.com/problemset/problem/1509/C",
    "tags": [
      "dp",
      "greedy"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1509C+The%20Sports%20Festival+editorial",
    "solutionCode": {
      "cpp": "#include<bits/stdc++.h>\nusing namespace std;\n\nusing ll = long long;\n\nconstexpr int MAX_SIZE = 2005;\n\nll memo[MAX_SIZE][MAX_SIZE];\n\nll elements[MAX_SIZE];\n\nll minimumDifferenceSum(int left, int right) {\n\tif (memo[left][right] != -1) {\n\t\treturn memo[left][right];\n\t}\n\tif (left == right) {\n\t\treturn 0;\n\t}\n\treturn memo[left][right] = elements[right] - elements[left] + min(minimumDifferenceSum(left + 1, right), minimumDifferenceSum(left, right - 1));\n}\n\nint main() {\n\tint numberOfElements;\n\tcin >> numberOfElements;\n\n\tfor (int i = 0; i < numberOfElements; ++i) {\n\t\tcin >> elements[i];\n\t}\n\n\tsort(elements, elements + numberOfElements);\n\n\tmemset(memo, -1, sizeof(memo));\n\n\tcout << minimumDifferenceSum(0, numberOfElements - 1) << '\\n';\n}"
    },
    "order": 8
  },
  {
    "id": "1491D",
    "contestId": 1491,
    "index": "D",
    "title": "Zookeeper and The Infinite Zoo",
    "rating": 1800,
    "url": "https://codeforces.com/problemset/problem/1491/D",
    "tags": [
      "bitmasks",
      "constructive algorithms",
      "dp",
      "greedy",
      "math"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1491D+Zookeeper%20and%20The%20Infinite%20Zoo+editorial",
    "solutionCode": {
      "cpp": "#include<bits/stdc++.h>\nusing namespace std;\ntypedef long long ll;\nint main(){\n\tios::sync_with_stdio(false);cin.tie(0);\n\tint tt;cin >> tt;\n\twhile(tt--){\n\t\tint x,y;cin >> x >> y;\n\t\tint z=0;\n\t\tbool ok=(x<=y);\n\t\tfor(int i=0; i<30 ;i++){\n\t\t\tif((x>>i)&1) z++;\n\t\t\tif((y>>i)&1) z--;\n\t\t\tif(z<0) ok=false;\n\t\t}\n\t\tif(ok) cout << \"YES\\n\";\n\t\telse cout << \"NO\\n\";\n\t}\n}"
    },
    "order": 9
  },
  {
    "id": "1468J",
    "contestId": 1468,
    "index": "J",
    "title": "Road Reform",
    "rating": 1800,
    "url": "https://codeforces.com/problemset/problem/1468/J",
    "tags": [
      "dsu",
      "graphs",
      "greedy"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1468J+Road%20Reform+editorial",
    "solutionCode": {
      "cpp": "#include<bits/stdc++.h>\nusing namespace std;\n\nclass DisjointSetUnion {\npublic:\n    int size; \n    vector<int> parent; \n    vector<int> componentSize; \n\n    DisjointSetUnion(int size) : size(size), parent(size), componentSize(size, 1) {\n        iota(parent.begin(), parent.end(), 0); \n    }\n\n    int find(int node) {\n        return (parent[node] == node ? node : parent[node] = find(parent[node]));\n    }\n\n    void unite(int node1, int node2) {\n        node1 = find(node1);\n        node2 = find(node2);\n        if (node1 == node2) return; \n        if (componentSize[node1] > componentSize[node2]) swap(node1, node2);\n        parent[node1] = node2;\n        componentSize[node2] += componentSize[node1];\n    }\n};\n\nvoid solve() {\n    int numNodes, numEdges, k;\n    cin >> numNodes >> numEdges >> k;\n\n    vector<pair<int, pair<int, int>>> edges(numEdges);\n    for (int i = 0; i < numEdges; i++) {\n        int nodeA, nodeB, cost;\n        cin >> nodeA >> nodeB >> cost;\n        nodeA--; nodeB--;\n        edges[i] = {cost, {nodeA, nodeB}};\n    }\n\n    sort(edges.begin(), edges.end());\n    auto modifiedEdges = edges;\n\n    vector<pair<long long, pair<int, int>>> zeroCostEdges;\n    for (int i = 0; i < numEdges; i++) {\n        modifiedEdges[i].first = static_cast<int>(max(0LL, static_cast<long long>(edges[i].first - k)));\n        if (edges[i].first <= k) {\n            zeroCostEdges.push_back({static_cast<long long>(k - edges[i].first), edges[i].second});\n        }\n    }\n\n    long long totalCost1 = 0, minimumCostAboveZero1 = LLONG_MAX, minimumCostAboveZero2 = LLONG_MAX;\n    DisjointSetUnion dsu1(numNodes);\n\n    sort(modifiedEdges.begin(), modifiedEdges.end());\n    for (const auto& [weight, nodes] : modifiedEdges) {\n        auto [nodeA, nodeB] = nodes;\n        if (weight) minimumCostAboveZero1 = min(minimumCostAboveZero1, static_cast<long long>(weight));\n        if (dsu1.find(nodeA) != dsu1.find(nodeB)) {\n            dsu1.unite(nodeA, nodeB);\n            totalCost1 += weight;\n        }\n    }\n\n    if (totalCost1 == 0) totalCost1 = minimumCostAboveZero1;\n\n    int requiredEdges = 0;\n    DisjointSetUnion dsu2(numNodes);\n\n    sort(zeroCostEdges.begin(), zeroCostEdges.end());\n    for (const auto& [weight, nodes] : zeroCostEdges) {\n        auto [nodeA, nodeB] = nodes;\n        if (dsu2.find(nodeA) != dsu2.find(nodeB)) {\n            dsu2.unite(nodeA, nodeB);\n            minimumCostAboveZero2 = min(minimumCostAboveZero2, weight);\n            requiredEdges++;\n        }\n    }\n\n    if (requiredEdges != numNodes - 1) minimumCostAboveZero2 = LLONG_MAX;\n\n    cout << min(totalCost1, minimumCostAboveZero2) << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n\n    int testCases;\n    cin >> testCases;\n    while (testCases--) solve();\n\n    return 0;\n}"
    },
    "order": 10
  },
  {
    "id": "1466E",
    "contestId": 1466,
    "index": "E",
    "title": "Apollo versus Pan",
    "rating": 1800,
    "url": "https://codeforces.com/problemset/problem/1466/E",
    "tags": [
      "bitmasks",
      "brute force",
      "math"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1466E+Apollo%20versus%20Pan+editorial",
    "solutionCode": {
      "cpp": "#include<bits/stdc++.h>\nusing namespace std;\n\nusing LongLong = long long int;\n\nconst int MAX_VALUES = 500000;\nconst int MAX_BITS = 60;\nconst int MODULO = 1000000007;\n\nLongLong input[MAX_VALUES];\nint bitCount[MAX_BITS];\n\nvoid solve() {\n    int totalNumbers;\n    scanf(\"%d\", &totalNumbers);\n\n    fill(bitCount, bitCount + MAX_BITS, 0);\n\n    for (int i = 0; i < totalNumbers; ++i) {\n        scanf(\"%lld\", &input[i]);\n        for (int j = 0; j < MAX_BITS; ++j) {\n            bitCount[j] += (input[i] >> j) & 1;\n        }\n    }\n\n    LongLong result = 0;\n\n    for (int i = 0; i < totalNumbers; ++i) {\n        LongLong expectedOr = 0, expectedAnd = 0;\n\n        for (int j = 0; j < MAX_BITS; ++j) {\n            LongLong powerOfTwo = (1LL << j) % MODULO;\n\n            if ((input[i] >> j) & 1) {\n                expectedOr = (expectedOr + powerOfTwo * totalNumbers % MODULO) % MODULO;\n                expectedAnd = (expectedAnd + powerOfTwo * bitCount[j] % MODULO) % MODULO;\n            } else {\n                expectedOr = (expectedOr + powerOfTwo * bitCount[j] % MODULO) % MODULO;\n            }\n        }\n\n        result = (result + expectedOr * expectedAnd % MODULO) % MODULO;\n    }\n\n    printf(\"%lld\\n\", result);\n}\n\nint main() {\n    int testCases;\n    scanf(\"%d\", &testCases);\n\n    while (testCases--) {\n        solve();\n    }\n\n    return 0;\n}"
    },
    "order": 11
  },
  {
    "id": "2014E",
    "contestId": 2014,
    "index": "E",
    "title": "Rendez-vous de Marian et Robin",
    "rating": 1800,
    "url": "https://codeforces.com/problemset/problem/2014/E",
    "tags": [
      "dfs and similar",
      "graphs",
      "shortest paths"
    ],
    "hint": "Represent the input as an adjacency list. Use BFS/DFS traversal to discover reachable components, compute shortest hops in unweighted graphs, or detect bipartite coloring.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+2014E+Rendez-vous%20de%20Marian%20et%20Robin+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nconst long long INF = 1e14;\n\n\nvector<long long> dijkstra(const vector<vector<pair<int, int>>> &graph, int source, int nodeCount) {\n\tvector<long long> distances(2 * nodeCount + 5, INF);\n\tpriority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<>> minHeap;\n\n\tdistances[source] = 0;\n\tminHeap.push({0, source});\n\n\twhile (!minHeap.empty()) {\n\t\tauto [currentDistance, u] = minHeap.top();\n\t\tminHeap.pop();\n\n\t\tif (currentDistance > distances[u]) continue;\n\n\t\tfor (const auto &[v, weight] : graph[u]) {\n\t\t\t// If a shorter path is found, update the distance and push to heap\n\t\t\tif (distances[v] > distances[u] + weight) {\n\t\t\t\tdistances[v] = distances[u] + weight;\n\t\t\t\tminHeap.push({distances[v], v});\n\t\t\t}\n\t\t}\n\t}\n\n\treturn distances;\n}\n\nint main() {\n\tint testCases;\n\tcin >> testCases;\n\n\twhile (testCases--) {\n\t\tint numNodes, numEdges, numHorses;\n\t\tcin >> numNodes >> numEdges >> numHorses;\n\n\t\tvector<vector<pair<int, int>>> graph(2 * numNodes + 5);\n\t\tvector<int> horseStartPositions(numHorses);\n\t\t\n\t\tfor (int &position : horseStartPositions) {\n\t\t\tcin >> position;\n\t\t}\n\n\t\tfor (int i = 0; i < numEdges; ++i) {\n\t\t\tint a, b, weight;\n\t\t\tcin >> a >> b >> weight;\n\t\t\tgraph[2 * a].emplace_back(2 * b, weight);\n\t\t\tgraph[2 * b].emplace_back(2 * a, weight);\n\t\t\tgraph[2 * a + 1].emplace_back(2 * b + 1, weight / 2);\n\t\t\tgraph[2 * b + 1].emplace_back(2 * a + 1, weight / 2);\n\t\t}\n\n\t\tfor (int i = 1; i <= numNodes; ++i) {\n\t\t\tgraph[2 * i + 1].emplace_back(2 * i, 0);\n\t\t}\n\n\t\tfor (int start : horseStartPositions) {\n\t\t\tgraph[2 * start].emplace_back(2 * start + 1, 0);\n\t\t}\n\n\t\tvector<long long> distanceFromStart = dijkstra(graph, 2, numNodes);\n\t\tvector<long long> distanceFromEnd = dijkstra(graph, 2 * numNodes, numNodes);\n\n\t\tlong long minMaxDistance = INF;\n\t\tfor (int i = 2; i <= 2 * numNodes + 1; ++i) {\n\t\t\tminMaxDistance = min(minMaxDistance, max(distanceFromStart[i], distanceFromEnd[i]));\n\t\t}\n\n\t\tcout << (minMaxDistance == INF ? -1 : minMaxDistance) << '\\n';\n\t}\n\n\treturn 0;\n}"
    },
    "order": 12
  },
  {
    "id": "1462F",
    "contestId": 1462,
    "index": "F",
    "title": "The Treasure of The Segments",
    "rating": 1800,
    "url": "https://codeforces.com/problemset/problem/1462/F",
    "tags": [
      "binary search",
      "data structures",
      "greedy"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1462F+The%20Treasure%20of%20The%20Segments+editorial",
    "solutionCode": {
      "cpp": "#include<bits/stdc++.h>\nusing namespace std;\n\n\nusing ll = long long;\n\nvoid solve() {\n\tint intervalCount;\n\tcin >> intervalCount;\n\n\tvector<pair<int, int>> intervals(intervalCount);\n\tvector<int> leftEndpoints(intervalCount);\n\tvector<int> rightEndpoints(intervalCount);\n\n\tfor (int i = 0; i < intervalCount; ++i) {\n\t\tcin >> intervals[i].first >> intervals[i].second;\n\t\tleftEndpoints[i] = intervals[i].first;\n\t\trightEndpoints[i] = intervals[i].second;\n\t}\n\n\tsort(leftEndpoints.begin(), leftEndpoints.end());\n\tsort(rightEndpoints.begin(), rightEndpoints.end());\n\n\tint minimumRemovals = intervalCount - 1;\n\n\tfor (auto [left, right] : intervals) {\n\t\tint leftOverlapCount = lower_bound(rightEndpoints.begin(), rightEndpoints.end(), left) - rightEndpoints.begin();\n\t\tint rightOverlapCount = max(0, intervalCount - static_cast<int>(upper_bound(leftEndpoints.begin(), leftEndpoints.end(), right) - leftEndpoints.begin()));\n\t\tminimumRemovals = min(minimumRemovals, leftOverlapCount + rightOverlapCount);\n\t}\n\n\tcout << minimumRemovals << \"\\n\";\n}\n\nint main() {\n\tint tt;\n\tcin >> tt;\n\twhile (tt--) {\n\t\tsolve();\n\t}\n}"
    },
    "order": 13
  },
  {
    "id": "1446B",
    "contestId": 1446,
    "index": "B",
    "title": "Catching Cheaters",
    "rating": 1800,
    "url": "https://codeforces.com/problemset/problem/1446/B",
    "tags": [
      "dp",
      "strings"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1446B+Catching%20Cheaters+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\n#define INF (int)(1e9)\n\nconst int maxn = 5005;\nint dp[maxn][maxn];\n\nvoid Solve() \n{\n    int n, m;\n    cin>>n>>m;\n    string s1, s2;\n    cin>>s1>>s2;\n    \n    int ans = 0;\n    \n    for (int i=0; i<=n; i++)\n    {\n        for (int j=0; j<=m; j++)\n        {\n            if (i==0 && j==0)continue;\n            dp[i][j] = 0;\n            if (i!=0 && j!=0 && s1[i-1]==s2[j-1])\n            dp[i][j] = max(dp[i][j], dp[i-1][j-1] + 2);\n            if (i!=0)\n            dp[i][j] = max(dp[i][j], dp[i-1][j] - 1);\n            if (j!=0)\n            dp[i][j] = max(dp[i][j], dp[i][j-1] - 1);\n            \n            ans = max(ans, dp[i][j]);\n        }\n    }\n    \n    cout<<ans;\n}\n\n\nint32_t main() \n{\n    auto begin = std::chrono::high_resolution_clock::now();\n    ios_base::sync_with_stdio(0);\n    cin.tie(0);\n    int t = 1;\n    //cin >> t;\n    for(int i = 1; i <= t; i++) \n    {\n        Solve();\n    }\n    return 0;\n}"
    },
    "order": 14
  },
  {
    "id": "1442B",
    "contestId": 1442,
    "index": "B",
    "title": "Identify the Operations",
    "rating": 1800,
    "url": "https://codeforces.com/problemset/problem/1442/B",
    "tags": [
      "combinatorics",
      "data structures",
      "dsu",
      "greedy",
      "implementation"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1442B+Identify%20the%20Operations+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n#include <ext/pb_ds/assoc_container.hpp>\n#include <ext/pb_ds/tree_policy.hpp>\n\nusing namespace std;\nusing namespace chrono;\nusing namespace __gnu_pbds;\n\n#define MOD1 998244353\n\ntypedef long long ll;\ntypedef tree<pair<int, int>, null_type, less<pair<int, int>>, rb_tree_tag, tree_order_statistics_node_update> ordered_set;\n\n\nll mod_multiply(ll a, ll b, ll mod) {\n\treturn ((a % mod) * (b % mod)) % mod;\n}\n\nvoid solve() {\n\tint test_cases;\n\tcin >> test_cases;\n\twhile (test_cases--) {\n\t\tll n, k;\n\t\tcin >> n >> k;\n\n\t\tvector<ll> a(n), b(k), index(n + 1), occ(n, 1);\n\n\t\tfor (int i = 0; i < n; i++) {\n\t\t\tcin >> a[i];\n\t\t\tindex[a[i]] = i;\n\t\t}\n\n\t\tfor (int i = 0; i < k; i++) {\n\t\t\tcin >> b[i];\n\t\t}\n\t\treverse(b.begin(), b.end()); \n\n\t\tll answer = 1; \n\t\n\t\tfor (int i = 0; i < k; i++) {\n\t\t\tint current_index = index[b[i]]; \n\t\t\tocc[current_index]--; \n\n\n\t\t\tint left = current_index > 0 ? occ[current_index - 1] : 0;\n\t\t\tint right = current_index < n - 1 ? occ[current_index + 1] : 0;\n\n\t\n\t\t\tanswer = mod_multiply(answer, left + right, MOD1);\n\t\t}\n\n\t\tcout << answer << \"\\n\";\n\t}\n}\n\nint main() {\n\tios_base::sync_with_stdio(false);\n\tcin.tie(NULL);\n\n\tsolve(); \n\n\treturn 0;\n}"
    },
    "order": 15
  },
  {
    "id": "1437C",
    "contestId": 1437,
    "index": "C",
    "title": "Chef Monocarp",
    "rating": 1800,
    "url": "https://codeforces.com/problemset/problem/1437/C",
    "tags": [
      "dp",
      "flows",
      "graph matchings",
      "greedy",
      "math",
      "sortings"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1437C+Chef%20Monocarp+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nconst int INF = INT_MAX;\n\nvoid solve() {\n\tint numElements;\n\tscanf(\"%d\", &numElements);\n\tvector<int> elements(numElements);\n\tfor (int i = 0; i < numElements; i++) {\n\t\tscanf(\"%d\", &elements[i]);\n\t\t--elements[i];\n\t}\n\tsort(elements.begin(), elements.end());\n\tvector<vector<int>> dp(numElements + 1, vector<int>(2 * numElements, INF));\n\tdp[0][0] = 0;\n\tfor (int i = 0; i <= numElements; i++) {\n\t\tfor (int j = 0; j < 2 * numElements - 1; j++) {\n\t\t\tif (dp[i][j] < INF) {\n\t\t\t\tif (i < numElements) {\n\t\t\t\t\tdp[i + 1][j + 1] = min(dp[i + 1][j + 1], dp[i][j] + abs(elements[i] - j));\n\t\t\t\t}\n\t\t\t\tdp[i][j + 1] = min(dp[i][j + 1], dp[i][j]);\n\t\t\t}\n\t\t}\n\t}\n\n\tprintf(\"%d\\n\", dp[numElements][2 * numElements - 1]);\n}\n\nint main() {\n\tint testCases;\n\tscanf(\"%d\", &testCases);\n\tfor (int i = 0; i < testCases; i++) {\n\t\tsolve();\n\t}\n}"
    },
    "order": 16
  },
  {
    "id": "1401D",
    "contestId": 1401,
    "index": "D",
    "title": "Maximum Distributed Tree",
    "rating": 1800,
    "url": "https://codeforces.com/problemset/problem/1401/D",
    "tags": [
      "dfs and similar",
      "dp",
      "greedy",
      "implementation",
      "math",
      "number theory",
      "sortings",
      "trees"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1401D+Maximum%20Distributed%20Tree+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n#define endl '\\n'\n\nusing namespace std;\n\ntypedef long long LL;\n\nstruct Edge {\n    int from, to;\n};\n\nint currentEdgeIndex, numNodes;\nconst int MOD = 1e9 + 7;\nLL primeFactors[100005];       \nLL adjacencyStart[100005];     \nLL visited[100005];           \nLL edgeContribution[100005];   \nEdge edges[200040];           \n\n\nint compareEdges(Edge a, Edge b) { return a.from < b.from; }\nint compareDescending(LL a, LL b) { return a > b; }\n\nLL computeSubtreeSize(int node) {\n    LL size = 1;\n    visited[node] = 1;\n\n    for (int i = adjacencyStart[node]; i < adjacencyStart[node + 1]; i++)\n        if (!visited[edges[i].to])\n            size += computeSubtreeSize(edges[i].to);\n\n    edgeContribution[currentEdgeIndex] = size * (numNodes - size); // Contribution for this edge\n    currentEdgeIndex++;\n\n    return size;\n}\n\nint main() {\n    ios_base::sync_with_stdio(0);\n    cin.tie(0);\n    cout.tie(0);\n\n    int testCases;\n    cin >> testCases;\n\n    while (testCases--) {\n        int k = 0, numPrimes;\n        LL result = 1;\n\n        cin >> numNodes;\n\n        for (int i = 0; i < numNodes - 1; i++) {\n            cin >> edges[i].from >> edges[i].to;\n            edges[i + numNodes - 1].from = edges[i].to;\n            edges[i + numNodes - 1].to = edges[i].from;\n        }\n\n        int edgeListSize = 2 * numNodes - 2;\n\n        sort(edges, edges + edgeListSize, compareEdges);\n\n        for (int i = 1; i < edgeListSize; i++) {\n            if (edges[i].from > edges[i - 1].from) {\n                for (int j = edges[i - 1].from + 1; j <= edges[i].from; j++)\n                    adjacencyStart[j] = i;\n            }\n        }\n        for (int j = edges[edgeListSize - 1].from + 1; j <= numNodes + 2; j++)\n            adjacencyStart[j] = edgeListSize;\n\n        currentEdgeIndex = k = 0;\n        computeSubtreeSize(1);\n\n        cin >> numPrimes;\n        for (int i = 0; i < numPrimes; i++)\n            cin >> primeFactors[i];\n\n        sort(primeFactors, primeFactors + numPrimes, compareDescending);\n        sort(edgeContribution, edgeContribution + numNodes - 1, compareDescending);\n\n        if (numPrimes < numNodes) {\n            for (int i = numPrimes; i < numNodes - 1; i++)\n                primeFactors[i] = 1;\n        } else {\n            int i;\n            for (i = numPrimes - 1; i > numPrimes - numNodes; k = i, i--)\n                edgeContribution[i] = edgeContribution[i - numPrimes + numNodes - 1];\n            for (; i; i--)\n                edgeContribution[i] = edgeContribution[0];\n        }\n\n        int totalElements = max(numPrimes, numNodes - 1);\n        \n        int i;\n        for (i = 0, result = edgeContribution[0]; i <= k; i++)\n            result = result * primeFactors[i] % MOD;\n\n        for (; i < totalElements; i++)\n            result = (result + edgeContribution[i] * primeFactors[i]) % MOD;\n\n        cout << result << endl;\n\n        for (int i = 1; i <= numNodes; i++)\n            visited[i] = 0;\n    }\n}"
    },
    "order": 17
  },
  {
    "id": "1396B",
    "contestId": 1396,
    "index": "B",
    "title": "Stoned Game",
    "rating": 1800,
    "url": "https://codeforces.com/problemset/problem/1396/B",
    "tags": [
      "brute force",
      "constructive algorithms",
      "games",
      "greedy"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1396B+Stoned%20Game+editorial",
    "solutionCode": {
      "cpp": "#include<bits/stdc++.h>\n#define endl '\\n'\nusing namespace std;\n\nint main() {\n\tint tt;\n\tcin >> tt;\n\n\t\n\twhile (tt--) {\n\t\n\t\tint numPiles;\n\t\tcin >> numPiles;\n        \n\t\tvector<int> stones(numPiles);\n\t\tfor (int &stoneCount : stones) {\n            cin >> stoneCount;\n\t\t}\n        \n\t\tint maxStonesInPile = *max_element(stones.begin(), stones.end());\n\t\tint totalStones = accumulate(stones.begin(), stones.end(), 0);\n        \n\t\tif (maxStonesInPile * 2 > totalStones || (totalStones % 2 != 0)) {\n            cout << \"T\" << endl;\n\t\t} else {\n            cout << \"HL\" << endl;\n\t\t}\n\t}\n    \n\treturn 0;\n}"
    },
    "order": 18
  },
  {
    "id": "1355C",
    "contestId": 1355,
    "index": "C",
    "title": "Count Triangles",
    "rating": 1800,
    "url": "https://codeforces.com/problemset/problem/1355/C",
    "tags": [
      "binary search",
      "implementation",
      "math",
      "two pointers"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1355C+Count%20Triangles+editorial",
    "solutionCode": {
      "cpp": "#include <iostream>\nusing namespace std;\n\ntypedef long long ll;\n\nconst int MAX_SIZE = 1000077;\n\nint startRange1, endRange1, startRange2, endRange2;\n\nll arraySum[MAX_SIZE];\n\nint main() {\n    cin >> startRange1 >> endRange1 >> startRange2 >> endRange2;\n\n    for (int i = startRange1; i <= endRange1; i++) {\n        arraySum[i + endRange1]++;\n        arraySum[i + startRange2 + 1]--;\n    }\n\n    for (int i = 1; i < MAX_SIZE; i++)\n        arraySum[i] += arraySum[i - 1];\n    for (int i = 1; i < MAX_SIZE; i++)\n        arraySum[i] += arraySum[i - 1];\n\n    ll result = 0;\n    for (int i = startRange2; i <= endRange2; i++)\n        result += arraySum[MAX_SIZE - 1] - arraySum[i];\n\n    cout << result << endl;\n\n    return 0;\n}"
    },
    "order": 19
  },
  {
    "id": "1338B",
    "contestId": 1338,
    "index": "B",
    "title": "Edge Weight Assignment",
    "rating": 1800,
    "url": "https://codeforces.com/problemset/problem/1338/B",
    "tags": [
      "bitmasks",
      "constructive algorithms",
      "dfs and similar",
      "greedy",
      "math",
      "trees"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1338B+Edge%20Weight%20Assignment+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\n#define int long long\n\npair<bool, bool> dfs(int node, int parent, vector<vector<int>>& adj, vector<int>& leafCounts, bool& hasMixedParity) {\n    if (adj[node].size() == 1) return {1, 0}; \n\n    int leafChildCount = 0;\n    bool hasEvenLeaf = false, hasOddLeaf = false;\n\n    for (auto& child : adj[node]) {\n        if (child == parent) continue;\n        auto childParity = dfs(child, node, adj, leafCounts, hasMixedParity);\n        hasEvenLeaf |= childParity.first;\n        hasOddLeaf  |= childParity.second;\n        if (adj[child].size() == 1) leafChildCount++; \n    }\n\n    if (hasEvenLeaf & hasOddLeaf) hasMixedParity = true;\n    if (leafChildCount) leafCounts.push_back(leafChildCount);\n\n    return {hasOddLeaf, hasEvenLeaf};\n}\n\nint32_t main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n\n    int n;\n    cin >> n;\n\n    vector<vector<int>> adj(n + 1);\n    int root = -1;\n\n    for (int i = 1; i < n; i++) {\n        int u, v;\n        cin >> u >> v;\n        adj[u].push_back(v);\n        adj[v].push_back(u);\n\n        if (adj[u].size() >= 2) root = u;\n        if (adj[v].size() >= 2) root = v;\n    }\n\n    bool hasMixedParity = false;\n    vector<int> leafCounts;\n\n    dfs(root, -1, adj, leafCounts, hasMixedParity);\n\n    int sumLeafCounts = accumulate(leafCounts.begin(), leafCounts.end(), 0LL);\n    \n    cout << (hasMixedParity ? 3 : 1) << \" \" << n - 1 - sumLeafCounts + leafCounts.size() << endl;\n\n    return 0;\n}"
    },
    "order": 20
  },
  {
    "id": "1335E2",
    "contestId": 1335,
    "index": "E2",
    "title": "Three Blocks Palindrome (hard version)",
    "rating": 1800,
    "url": "https://codeforces.com/problemset/problem/1335/E2",
    "tags": [
      "brute force",
      "data structures",
      "dp",
      "two pointers"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1335E2+Three%20Blocks%20Palindrome%20(hard%20version)+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\n\nint main() {\n\tint testCases;\n\tstd::cin >> testCases;\n\n\twhile (testCases--) {\n\t\tint arraySize;\n\t\tstd::cin >> arraySize;\n\t\tstd::vector<int> numbers(arraySize);\n\n\t\tfor (auto &number : numbers) {\n\t\t\tstd::cin >> number;\n\t\t}\n\n\t\tstd::vector<std::vector<int>> prefixCount(200, std::vector<int>(arraySize + 1));\n\t\tstd::vector<std::vector<int>> positions(200);\n\n\t\tfor (int i = 0; i < arraySize; ++i) {\n\t\t\tfor (int j = 0; j < 200; ++j) {\n\t\t\t\tprefixCount[j][i + 1] = prefixCount[j][i];\n\t\t\t}\n\t\t\t++prefixCount[numbers[i] - 1][i + 1];\n\t\t\tpositions[numbers[i] - 1].push_back(i);\n\t\t}\n\n\t\tint maxSequenceLength = 0;\n\n\t\tfor (int i = 0; i < 200; ++i) {\n\t\t\tmaxSequenceLength = std::max(maxSequenceLength, static_cast<int>(positions[i].size()));\n\n\t\t\tfor (size_t halfPos = 0; halfPos < positions[i].size() / 2; ++halfPos) {\n\t\t\t\tint left = positions[i][halfPos] + 1;\n\t\t\t\tint right = positions[i][positions[i].size() - halfPos - 1] - 1;\n\n\t\t\t\tfor (int element = 0; element < 200; ++element) {\n\t\t\t\t\tint sumInRange = prefixCount[element][right + 1] - prefixCount[element][left];\n\t\t\t\t\tmaxSequenceLength = std::max(maxSequenceLength, static_cast<int>((halfPos + 1) * 2 + sumInRange));\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\n\t\tstd::cout << maxSequenceLength << std::endl;\n\t}\n\n\treturn 0;\n}"
    },
    "order": 21
  },
  {
    "id": "1290B",
    "contestId": 1290,
    "index": "B",
    "title": "Irreducible Anagrams",
    "rating": 1800,
    "url": "https://codeforces.com/problemset/problem/1290/B",
    "tags": [
      "binary search",
      "constructive algorithms",
      "data structures",
      "strings",
      "two pointers"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1290B+Irreducible%20Anagrams+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass SegmentTree {\npublic:\n\tstruct Node {\n\t\tvector<long long> charCount; \n\t\tlong long distinctCount;   \n\n\t\tNode() {\n\t\t\tcharCount.assign(26, 0);\n\t\t\tdistinctCount = 0;\n\t\t}\n\n\t\tNode(long long charIndex) {\n\t\t\tcharCount.assign(26, 0);\n\t\t\tcharCount[charIndex] = 1;\n\t\t\tdistinctCount = 1;\n\t\t}\n\n\t\tvoid merge(const Node &left, const Node &right) {\n\t\t\tdistinctCount = 0;\n\t\t\tfor (int i = 0; i < 26; ++i) {\n\t\t\t\tcharCount[i] = left.charCount[i] + right.charCount[i];\n\t\t\t\tif (charCount[i] > 0)\n\t\t\t\t\t++distinctCount;\n\t\t\t}\n\t\t}\n\t};\n\n\tvector<Node> tree; \n\tvector<long long> data;\n\tlong long size;\n\t\n\tSegmentTree(const vector<long long> &input) {\n\t\tsize = input.size();\n\t\tdata = input;\n\t\ttree.resize(4 * size, Node());\n\t\tbuild(0, size - 1, 1);\n\t}\n\n\tvoid build(long long start, long long end, long long index) {\n\t\tif (start == end) {\n\t\t\ttree[index] = Node(data[start]);\n\t\t\treturn;\n\t\t}\n\t\tlong long mid = (start + end) / 2;\n\t\tbuild(start, mid, 2 * index);\n\t\tbuild(mid + 1, end, 2 * index + 1);\n\t\ttree[index].merge(tree[2 * index], tree[2 * index + 1]);\n\t}\n\n\tNode query(long long start, long long end, long long left, long long right, long long index) {\n\t\tif (start > right || end < left) {\n\t\t\treturn Node();\n\t\t}\n\t\tif (start >= left && end <= right) {\n\t\t\treturn tree[index]; \n\t\t}\n\t\tlong long mid = (start + end) / 2;\n\t\tNode leftResult = query(start, mid, left, right, 2 * index);\n\t\tNode rightResult = query(mid + 1, end, left, right, 2 * index + 1);\n\t\tNode result;\n\t\tresult.merge(leftResult, rightResult);\n\t\treturn result;\n\t}\n\t// Public query function\n\tNode query(long long left, long long right) {\n\t\treturn query(0, size - 1, left, right, 1);\n\t}\n};\n\nvoid solve() {\n\tstring inputString;\n\tcin >> inputString;\n\tlong long queryCount;\n\tcin >> queryCount;\n\n\tlong long n = inputString.size();\n\tvector<long long> charIndices(n);\n\tfor (long long i = 0; i < n; ++i) {\n\t\tcharIndices[i] = inputString[i] - 'a'; \n\t}\n\n\tSegmentTree segmentTree(charIndices); \n\n\tfor (long long i = 0; i < queryCount; ++i) {\n\t\tlong long left, right;\n\t\tcin >> left >> right;\n\t\t--left;\n\t\t--right;\n\n\t\tif (left == right) {\n\t\t\tcout << \"YES\\n\";\n\t\t\tcontinue;\n\t\t}\n\n\t\tlong long distinctChars = segmentTree.query(left, right).distinctCount;\n\n\t\tif (distinctChars == 1) {\n\t\t\tcout << \"NO\\n\";\n\t\t} else if (distinctChars > 2) {\n\t\t\tcout << \"YES\\n\";\n\t\t} else {\n\t\t\tif (inputString[left] == inputString[right]) {\n\t\t\t\tcout << \"NO\\n\";\n\t\t\t} else {\n\t\t\t\tcout << \"YES\\n\";\n\t\t\t}\n\t\t}\n\t}\n}\n\nint main() {\n\tios::sync_with_stdio(false);\n\tcin.tie(NULL);\n\n\tint testCases = 1;\n\twhile (testCases--) solve();\n\treturn 0;\n}"
    },
    "order": 22
  },
  {
    "id": "1974E",
    "contestId": 1974,
    "index": "E",
    "title": "Money Buys Happiness",
    "rating": 1800,
    "url": "https://codeforces.com/problemset/problem/1974/E",
    "tags": [
      "dp"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1974E+Money%20Buys%20Happiness+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nvoid solve() {\n    int itemCount;\n    long long multiplier;\n    std::cin >> itemCount >> multiplier;\n\n    std::vector<long long> costs(itemCount), happiness(itemCount);\n    for (int i = 0; i < itemCount; ++i) {\n        std::cin >> costs[i] >> happiness[i];\n    }\n\n    long long totalHappiness = std::accumulate(happiness.begin(), happiness.end(), 0LL);\n\n    const long long INF = std::numeric_limits<long long>::max();\n\n    std::vector<long long> minCost(static_cast<size_t>(totalHappiness + 1), INF);\n    minCost[0] = 0;\n\n    for (int i = 0; i < itemCount; ++i) {\n        for (long long currentHappiness = totalHappiness; currentHappiness >= happiness[i]; --currentHappiness) {\n            if (minCost[currentHappiness - happiness[i]] != INF) {\n                long long newCost = minCost[currentHappiness - happiness[i]];\n                if (newCost <= INF - costs[i]) {\n                    long long candidate = newCost + costs[i];\n                    if (candidate <= 1LL * i * multiplier) {\n                        minCost[currentHappiness] = std::min(minCost[currentHappiness], candidate);\n                    }\n                }\n            }\n        }\n    }\n\n    for (long long happinessValue = totalHappiness; happinessValue >= 0; --happinessValue) {\n        if (minCost[happinessValue] != INF) {\n            std::cout << happinessValue << '\\n';\n            break;\n        }\n    }\n}\n\nint main() {\n    std::ios::sync_with_stdio(false);\n    std::cin.tie(nullptr);\n\n    int testCases;\n    std::cin >> testCases;\n    while (testCases--) {\n        solve();\n    }\n    return 0;\n}"
    },
    "order": 23
  },
  {
    "id": "1286B",
    "contestId": 1286,
    "index": "B",
    "title": "Numbers on Tree",
    "rating": 1800,
    "url": "https://codeforces.com/problemset/problem/1286/B",
    "tags": [
      "constructive algorithms",
      "data structures",
      "dfs and similar",
      "graphs",
      "greedy",
      "trees"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1286B+Numbers%20on%20Tree+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nconst int MAX = 2003;\n\nbool isSolutionValid = true;\nint parents[MAX], constraints[MAX];\nvector<int> adjacencyList[MAX];\n\nvector<pair<int, int>> depthFirstSearch(int currentNode, int parentNode) {\n\tvector<pair<int, int>> nodeValues;\n\n\tfor (int childNode : adjacencyList[currentNode]) {\n\t\tif (childNode != parentNode) {\n\t\t\tauto childNodeValues = depthFirstSearch(childNode, currentNode);\n\t\t\tnodeValues.insert(nodeValues.end(), childNodeValues.begin(), childNodeValues.end());\n\t\t}\n\t}\n\tsort(nodeValues.begin(), nodeValues.end());\n\n\tif (constraints[currentNode] > nodeValues.size()) {\n\t\tisSolutionValid = false;\n\t\tnodeValues.emplace_back(currentNode, currentNode);\n\t\treturn nodeValues;\n\t}\n\n\tif (constraints[currentNode] == 0) {\n\t\tif (nodeValues.empty()) {\n\t\t\tnodeValues.emplace_back(currentNode, currentNode);\n\t\t} else {\n\t\t\tnodeValues.emplace_back(nodeValues.front().first - 1, currentNode);\n\t\t}\n\t} else {\n\t\tint newValue = nodeValues[constraints[currentNode] - 1].first + 1;\n\t\tfor (int i = constraints[currentNode]; i < nodeValues.size(); i++) {\n\t\t\tnodeValues[i].first += 2;\n\t\t}\n\t\tnodeValues.emplace_back(newValue, currentNode);\n\t}\n\tsort(nodeValues.begin(), nodeValues.end());\n\treturn nodeValues;\n}\n\nint main() {\n\tios_base::sync_with_stdio(false);\n\tcin.tie(nullptr);\n\n\tint nodeCount;\n\tcin >> nodeCount;\n\tint root = -1;\n\tfor (int i = 1; i <= nodeCount; i++) {\n\t\tcin >> parents[i] >> constraints[i];\n\t\tadjacencyList[parents[i]].push_back(i);\n\t\tif (parents[i] == 0) root = i;\n\t}\n\n\tauto result = depthFirstSearch(root, 0);\n\n\tif (!isSolutionValid) {\n\t\tcout << \"NO\\n\";\n\t\treturn 0;\n\t}\n\n\tvector<int> nodeOrder(nodeCount + 1);\n\tint minValue = 0;\n\tfor (auto [value, node] : result) {\n\t\tnodeOrder[node] = value;\n\t\tminValue = min(minValue, value);\n\t}\n\tcout << \"YES\\n\";\n\tfor (int i = 1; i <= nodeCount; i++) {\n\t\tcout << nodeOrder[i] - minValue + 1 << \" \";\n\t}\n\n\treturn 0;\n}"
    },
    "order": 24
  },
  {
    "id": "1283D",
    "contestId": 1283,
    "index": "D",
    "title": "Christmas Trees",
    "rating": 1800,
    "url": "https://codeforces.com/problemset/problem/1283/D",
    "tags": [
      "graphs",
      "greedy",
      "shortest paths"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1283D+Christmas%20Trees+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n\tint element_count, target_count;\n\tstd::cin >> element_count >> target_count;\n\n\tstd::vector<int> input_elements(element_count);\n\tfor (int& element : input_elements) {\n\t\tstd::cin >> element;\n\t}\n\n\tstd::queue<int> to_process;\n\tstd::map<int, int> distance_map;\n\n\tfor (const int& element : input_elements) {\n\t\tdistance_map[element] = 0;\n\t\tto_process.push(element);\n\t}\n\n\tlong long cumulative_distance = 0;\n\tstd::vector<int> result;\n\n\twhile (!to_process.empty() && result.size() < target_count) {\n\t\tint current = to_process.front();\n\t\tto_process.pop();\n\n\t\tif (distance_map[current] != 0) {\n\t\t\tcumulative_distance += distance_map[current];\n\t\t\tresult.push_back(current);\n\t\t}\n\n\t\tif (!distance_map.count(current - 1)) {\n\t\t\tdistance_map[current - 1] = distance_map[current] + 1;\n\t\t\tto_process.push(current - 1);\n\t\t}\n\n\t\tif (!distance_map.count(current + 1)) {\n\t\t\tdistance_map[current + 1] = distance_map[current] + 1;\n\t\t\tto_process.push(current + 1);\n\t\t}\n\t}\n\n\tstd::cout << cumulative_distance << std::endl;\n\tfor (const auto& element : result) {\n\t\tstd::cout << element << \" \";\n\t}\n\tstd::cout << std::endl;\n\n\treturn 0;\n}"
    },
    "order": 25
  },
  {
    "id": "1935D",
    "contestId": 1935,
    "index": "D",
    "title": "Exam in MAC",
    "rating": 1800,
    "url": "https://codeforces.com/problemset/problem/1935/D",
    "tags": [
      "binary search",
      "combinatorics",
      "implementation",
      "math"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1935D+Exam%20in%20MAC+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\nusing ll = long long;\n\nvoid solveTestCase() {\n\tint arraySize, cValue;\n\tcin >> arraySize >> cValue;\n\n\tvector<int> elements(arraySize);\n\tfor (int &element : elements) {\n\t\tcin >> element;\n\t}\n\n\tint oddCount = 0, evenCount = 0;\n\tll result = static_cast<ll>(cValue + 1) * (cValue + 2) / 2;\n\n\tfor (const int &element : elements) {\n\t\tresult -= element / 2 + 1;\n\t\tresult -= cValue - element + 1;\n\n\t\tif (element % 2 == 0) {\n\t\t\tevenCount++;\n\t\t} else {\n\t\t\toddCount++;\n\t\t}\n\t}\n\n\tresult += static_cast<ll>(evenCount) * (evenCount + 1) / 2;\n\tresult += static_cast<ll>(oddCount) * (oddCount + 1) / 2;\n\n\tcout << result << \"\\n\";\n}\n\nint main() {\n\tios::sync_with_stdio(false);\n\tcin.tie(nullptr);\n\n\tint testCases;\n\tcin >> testCases;\n\twhile (testCases--) {\n\t\tsolveTestCase();\n\t}\n\n\treturn 0;\n}"
    },
    "order": 26
  },
  {
    "id": "1915G",
    "contestId": 1915,
    "index": "G",
    "title": "Bicycles",
    "rating": 1800,
    "url": "https://codeforces.com/problemset/problem/1915/G",
    "tags": [
      "graphs",
      "greedy",
      "implementation",
      "shortest paths",
      "sortings"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1915G+Bicycles+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nconst int64_t INF = std::numeric_limits<int64_t>::max();\n\nvoid solve() {\n\tint vertexCount, edgeCount;\n\tstd::cin >> vertexCount >> edgeCount;\n\tstd::vector<std::vector<std::pair<int, int>>> adjacencyList(vertexCount);\n\n\tfor (int i = 0; i < edgeCount; ++i) {\n\t\tint start, end, weight;\n\t\tstd::cin >> start >> end >> weight;\n\t\t--start, --end; \n\t\tadjacencyList[start].emplace_back(end, weight);\n\t\tadjacencyList[end].emplace_back(start, weight);\n\t}\n\n\tstd::vector<int> nodeValues(vertexCount);\n\tfor (int& value : nodeValues) {\n\t\tstd::cin >> value;\n\t}\n\n\tstd::vector<std::vector<int64_t>> distances(vertexCount, std::vector<int64_t>(1001, INF));\n\tstd::vector<std::vector<bool>> visited(vertexCount, std::vector<bool>(1001, false));\n\n\tdistances[0][nodeValues[0]] = 0;\n\tstd::priority_queue<std::array<int64_t, 3>> priorityQueue;\n\tpriorityQueue.push({0, 0, nodeValues[0]});\n\n\twhile (!priorityQueue.empty()) {\n\t\tint currentNode = priorityQueue.top()[1];\n\t\tint currentK = priorityQueue.top()[2];\n\t\tpriorityQueue.pop();\n\n\t\tif (visited[currentNode][currentK] || distances[currentNode][currentK] == INF) {\n\t\t\tcontinue;\n\t\t}\n\n\t\tvisited[currentNode][currentK] = true;\n\n\t\tfor (const auto& neighbor : adjacencyList[currentNode]) {\n\t\t\tint neighborNode = neighbor.first;\n\t\t\tint edgeWeight = neighbor.second;\n\t\t\tint newK = std::min(nodeValues[neighborNode], currentK);\n\n\t\t\tif (distances[neighborNode][newK] > distances[currentNode][currentK] + static_cast<int64_t>(edgeWeight) * currentK) {\n\t\t\t\tdistances[neighborNode][newK] = distances[currentNode][currentK] + static_cast<int64_t>(edgeWeight) * currentK;\n\t\t\t\tpriorityQueue.push({-distances[neighborNode][newK], neighborNode, newK});\n\t\t\t}\n\t\t}\n\t}\n\tint64_t minimumCost = INF;\n\tfor (int k = 1; k <= 1000; ++k) {\n\t\tminimumCost = std::min(minimumCost, distances[vertexCount - 1][k]);\n\t}\n\tstd::cout << minimumCost << \"\\n\";\n}\n\nint main() {\n\tstd::ios_base::sync_with_stdio(false);\n\tstd::cin.tie(nullptr);\n\n\tint testCases;\n\tstd::cin >> testCases;\n\twhile (testCases--) {\n\t\tsolve();\n\t}\n}"
    },
    "order": 27
  },
  {
    "id": "1912K",
    "contestId": 1912,
    "index": "K",
    "title": "Kim's Quest",
    "rating": 1800,
    "url": "https://codeforces.com/problemset/problem/1912/K",
    "tags": [
      "bitmasks",
      "combinatorics",
      "dp"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1912K+Kim's%20Quest+editorial",
    "solutionCode": {
      "cpp": "#include <iostream>\n#include <vector>\n\nusing namespace std;\n\n\nvoid setIO(const string& filename = \"\") {\n\tios_base::sync_with_stdio(false); \n\tcin.tie(nullptr); \n}\n\n\nvoid solve() {\n\tint n;\n\tcin >> n;\n\tvector<int> array(n);\n\tfor (int& value : array) {\n\t\tcin >> value; \n\t\tvalue %= 2; \n\t}\n\n\tconstexpr int MOD = 998244353;\n\tvector<int> dp(4); \n\tvector<int> count(2); \n\tint result = 0;\n\tfor (int value : array) {\n\t\tvector<int> newDp = dp;\n\t\tfor (int i = 0; i < 2; ++i) {\n\t\t\tint j = i ^ value;\n\t\t\tdp[j | (value << 1)] += newDp[i | (j << 1)]; \n\t\t\tresult = (result + newDp[i | (j << 1)]) % MOD;\n\t\t}\n\n\t\tdp[0 | (value << 1)] = (dp[0 | (value << 1)] + count[0]) % MOD;\n\t\tdp[1 | (value << 1)] = (dp[1 | (value << 1)] + count[1]) % MOD;\n\t\tcount[value]++;\n\t}\n\tcout << result << '\\n'; \n}\n\nint main() {\n\tsetIO();\n\tint testCases = 1; \n\twhile (testCases--) {\n\t\tsolve(); \n\t}\n\treturn 0; \n}"
    },
    "order": 28
  },
  {
    "id": "1824B2",
    "contestId": 1824,
    "index": "B2",
    "title": "LuoTianyi and the Floating Islands (Hard Version)",
    "rating": 1800,
    "url": "https://codeforces.com/problemset/problem/1824/B2",
    "tags": [
      "combinatorics",
      "dfs and similar",
      "math",
      "probabilities",
      "trees"
    ],
    "hint": "Represent the input as an adjacency list. Use BFS/DFS traversal to discover reachable components, compute shortest hops in unweighted graphs, or detect bipartite coloring.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1824B2+LuoTianyi%20and%20the%20Floating%20Islands%20(Hard%20Version)+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nconst int MOD = 1'000'000'007;\nconst int MAX_NODES = 200005;\n\nstd::vector<int> adjacencyList[MAX_NODES];\nint subtreeSize[MAX_NODES];\nint factorial[MAX_NODES], inverseFactorial[MAX_NODES];\n\n\nint modularExponentiation(int base, int exp) {\n\tint result = 1;\n\twhile (exp > 0) {\n\t\tif (exp % 2 == 1)\n\t\t\tresult = static_cast<int>(1LL * result * base % MOD);\n\t\tbase = static_cast<int>(1LL * base * base % MOD);\n\t\texp /= 2;\n\t}\n\treturn result;\n}\n\nint combination(int n, int k) {\n\tif (k < 0 || k > n) return 0;\n\treturn static_cast<int>(1LL * factorial[n] * inverseFactorial[k] % MOD * inverseFactorial[n - k] % MOD);\n}\n\nvoid initializeCombinations(int limit) {\n\tfactorial[0] = inverseFactorial[0] = 1;\n\tfor (int i = 1; i <= limit; ++i) {\n\t\tfactorial[i] = static_cast<int>(1LL * factorial[i - 1] * i % MOD);\n\t}\n\tinverseFactorial[limit] = modularExponentiation(factorial[limit], MOD - 2);\n\tfor (int i = limit - 1; i >= 1; --i) {\n\t\tinverseFactorial[i] = static_cast<int>(1LL * inverseFactorial[i + 1] * (i + 1) % MOD);\n\t}\n}\n\nvoid depthFirstSearch(int node, int parent) {\n\tsubtreeSize[node] = 1;\n\tfor (int neighbor : adjacencyList[node]) {\n\t\tif (neighbor != parent) {\n\t\t\tdepthFirstSearch(neighbor, node);\n\t\t\tsubtreeSize[node] += subtreeSize[neighbor];\n\t\t}\n\t}\n}\n\nint main() {\n\tstd::ios::sync_with_stdio(false);\n\tstd::cin.tie(nullptr);\n\n\tint numNodes, k;\n\tstd::cin >> numNodes >> k;\n\n\tinitializeCombinations(MAX_NODES - 1);\n\n\n\tfor (int i = 0; i < numNodes - 1; ++i) {\n\t\tint u, v;\n\t\tstd::cin >> u >> v;\n\t\tadjacencyList[u].push_back(v);\n\t\tadjacencyList[v].push_back(u);\n\t}\n\n\tdepthFirstSearch(1, 0);\n\n\tif (k % 2 == 1) {\n\t\tstd::cout << \"1\\n\";\n\t} else {\n\t\tint result = 0;\n\t\tfor (int i = 2; i <= numNodes; ++i) {\n\t\t\tint leftSubtreeNodes = subtreeSize[i];\n\t\t\tint rightSubtreeNodes = numNodes - subtreeSize[i];\n\t\t\tint numWays = static_cast<int>(1LL * combination(leftSubtreeNodes, k / 2) * combination(rightSubtreeNodes, k / 2) % MOD);\n\t\t\tresult = (result + numWays) % MOD;\n\t\t}\n\t\tresult = static_cast<int>(1LL * result * modularExponentiation(combination(numNodes, k), MOD - 2) % MOD);\n\t\tresult = (result + 1) % MOD;\n\t\tstd::cout << result << '\\n';\n\t}\n\n\treturn 0;\n}"
    },
    "order": 29
  },
  {
    "id": "1805D",
    "contestId": 1805,
    "index": "D",
    "title": "A Wide, Wide Graph",
    "rating": 1800,
    "url": "https://codeforces.com/problemset/problem/1805/D",
    "tags": [
      "dfs and similar",
      "dp",
      "graphs",
      "greedy",
      "trees"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1805D+A%20Wide%2C%20Wide%20Graph+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\n#define all(a) a.begin(), a.end()\n#define rall(a) a.rbegin(), a.rend()\n\nusing namespace std;\n\nconst int N = 1e5 + 228;\n\nvector<int> G[N];\n\nvoid dfs(int v, int par, int h, vector<int> &d) {\n    d[v] = h;\n    for (int i : G[v]) {\n        if (i != par) {\n            dfs(i, v, h + 1, d);\n        }\n    }\n}\n\nint main() {\n    ios_base::sync_with_stdio(0);\n    cin.tie(0);\n\n    int n;\n    cin >> n;\n    for (int i = 0; i < n - 1; ++i) {\n        int a, b;\n        cin >> a >> b;\n        G[a - 1].push_back(b - 1);\n        G[b - 1].push_back(a - 1);\n    }\n\n    vector<int> d1(n), d2(n);\n    dfs(0, -1, 0, d1);\n    int a = max_element(all(d1)) - d1.begin();\n    dfs(a, -1, 0, d1);\n    int b = max_element(all(d1)) - d1.begin();\n    dfs(b, -1, 0, d2);\n    for (int i = 0; i < n; ++i) {\n        d2[i] = max(d2[i], d1[i]);\n    }\n    sort(all(d2));\n    int ans = 0;\n    for (int i = 1; i <= n; ++i) {\n        while (ans < n && d2[ans] < i) {\n            ++ans;\n        }\n        cout << min(n, ans + 1) << ' ';\n    }\n    cout << '\\n';\n}"
    },
    "order": 30
  },
  {
    "id": "1775D",
    "contestId": 1775,
    "index": "D",
    "title": "Friendly Spiders",
    "rating": 1800,
    "url": "https://codeforces.com/problemset/problem/1775/D",
    "tags": [
      "dfs and similar",
      "graphs",
      "math",
      "number theory",
      "shortest paths"
    ],
    "hint": "Represent the input as an adjacency list. Use BFS/DFS traversal to discover reachable components, compute shortest hops in unweighted graphs, or detect bipartite coloring.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1775D+Friendly%20Spiders+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nusing ll = long long;\n\nconst int MAXN = 300100;        \nconst int MAXVAL = 300100;      \nconst int INF = 1e9;\n\nvector<int> primeAdj[MAXVAL];   \nint distanceToPrime[MAXVAL];    \nint previousPrime[MAXVAL];      \nint previousSpider[MAXVAL];     \nint minPrimeFactor[MAXVAL];\nint legValueToSpider[MAXVAL]; \n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int n;\n    cin >> n;\n    vector<int> legs(n);\n    for (int i = 0; i < n; i++) {\n        cin >> legs[i];\n        legValueToSpider[legs[i]] = i;\n    }\n\n    int srcIndex, dstIndex;\n    cin >> srcIndex >> dstIndex;\n    --srcIndex;\n    --dstIndex;\n\n    if (legs[srcIndex] == legs[dstIndex]) {\n        if (srcIndex == dstIndex) {\n            cout << \"1\\n\" << srcIndex + 1 << '\\n';\n        } else if (legs[srcIndex] == 1) {\n            cout << -1;\n        } else {\n            cout << \"2\\n\" << srcIndex + 1 << \" \" << dstIndex + 1;\n        }\n        return 0;\n    }\n\n    fill(minPrimeFactor, minPrimeFactor + MAXVAL, INF);\n    for (int p = 2; p < MAXVAL; p++) {\n        if (minPrimeFactor[p] != INF) continue;\n        minPrimeFactor[p] = p;\n        if ((ll)p * p >= MAXVAL) continue;\n        for (int x = p * p; x < MAXVAL; x += p) {\n            minPrimeFactor[x] = min(minPrimeFactor[x], p);\n        }\n    }\n\n    fill(distanceToPrime, distanceToPrime + MAXVAL, INF);\n    fill(previousPrime, previousPrime + MAXVAL, -1);\n    fill(previousSpider, previousSpider + MAXVAL, -1);\n\n    queue<int> q;\n    vector<int> primeOwner(MAXVAL, -1); \n\n    for (int i = 0; i < n; i++) {\n        int value = legs[i];\n        int prevPrime = -1;\n        bool needToFill = primeAdj[value].empty();\n        while (value > 1) {\n            int p = minPrimeFactor[value];\n            if (p != prevPrime && needToFill) {\n                primeAdj[legs[i]].push_back(p);\n            }\n            if (p != prevPrime && i == srcIndex) {\n                distanceToPrime[p] = 0;\n                q.push(p);\n            }\n            prevPrime = p;\n            primeOwner[p] = i;\n            value /= p;\n        }\n    }\n\n    vector<bool> visitedValue(MAXVAL, false);\n\n    while (!q.empty()) {\n        int currPrime = q.front();\n        q.pop();\n\n        for (int multiple = currPrime * 2; multiple < MAXVAL; multiple += currPrime) {\n            if (visitedValue[multiple]) continue;\n            visitedValue[multiple] = true;\n\n            for (int nextPrime : primeAdj[multiple]) {\n                if (distanceToPrime[nextPrime] == INF) {\n                    distanceToPrime[nextPrime] = distanceToPrime[currPrime] + 1;\n                    previousSpider[nextPrime] = legValueToSpider[multiple];\n                    previousPrime[nextPrime] = currPrime;\n                    q.push(nextPrime);\n                }\n            }\n        }\n    }\n\n    int bestPrime = -1;\n    int bestDist = INF;\n    for (int p : primeAdj[legs[dstIndex]]) {\n        if (distanceToPrime[p] < bestDist) {\n            bestDist = distanceToPrime[p];\n            bestPrime = p;\n        }\n    }\n\n    if (bestDist == INF) {\n        cout << -1;\n        return 0;\n    }\n\n    vector<int> route;\n    route.push_back(dstIndex);\n    route.push_back(previousSpider[bestPrime]);\n    int p = bestPrime;\n    while (previousPrime[p] != -1) {\n        p = previousPrime[p];\n        route.push_back(previousSpider[p]);\n    }\n    reverse(route.begin(), route.end());\n    route.front() = srcIndex;\n\n    cout << route.size() << '\\n';\n    for (int idx : route) cout << idx + 1 << ' ';\n    cout << '\\n';\n    return 0;\n}"
    },
    "order": 31
  },
  {
    "id": "1548B",
    "contestId": 1548,
    "index": "B",
    "title": "Integers Have Friends",
    "rating": 1800,
    "url": "https://codeforces.com/problemset/problem/1548/B",
    "tags": [
      "binary search",
      "data structures",
      "divide and conquer",
      "math",
      "number theory",
      "two pointers"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1548B+Integers%20Have%20Friends+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nbool check(long long mid, const vector<long long>& a, int n, long long k) {\n    long long count = 0;\n    for (int i = 0; i < n; i++) {\n        count += mid / a[i];\n    }\n    return count >= k;\n}\n\nvoid solve() {\n    int n;\n    long long k;\n    if (!(cin >> n >> k)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    long long low = 1, high = 1e18, ans = high;\n    while (low <= high) {\n        long long mid = low + (high - low) / 2;\n        if (check(mid, a, n, k)) {\n            ans = mid;\n            high = mid - 1;\n        } else {\n            low = mid + 1;\n        }\n    }\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 32
  },
  {
    "id": "1525D",
    "contestId": 1525,
    "index": "D",
    "title": "Armchairs",
    "rating": 1800,
    "url": "https://codeforces.com/problemset/problem/1525/D",
    "tags": [
      "dp",
      "flows",
      "graph matchings",
      "greedy"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1525D+Armchairs+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    vector<long long> dp(n + 1, 0);\n    for (int i = 0; i < n; i++) {\n        dp[i + 1] = max(dp[i], dp[i] + a[i]);\n    }\n    cout << dp[n] << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 33
  },
  {
    "id": "1572A",
    "contestId": 1572,
    "index": "A",
    "title": "Book",
    "rating": 1800,
    "url": "https://codeforces.com/problemset/problem/1572/A",
    "tags": [
      "binary search",
      "brute force",
      "data structures",
      "dp",
      "graphs",
      "implementation",
      "sortings"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1572A+Book+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    vector<long long> dp(n + 1, 0);\n    for (int i = 0; i < n; i++) {\n        dp[i + 1] = max(dp[i], dp[i] + a[i]);\n    }\n    cout << dp[n] << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 34
  },
  {
    "id": "1554D",
    "contestId": 1554,
    "index": "D",
    "title": "Diane",
    "rating": 1800,
    "url": "https://codeforces.com/problemset/problem/1554/D",
    "tags": [
      "constructive algorithms",
      "greedy",
      "strings"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1554D+Diane+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 35
  },
  {
    "id": "1995C",
    "contestId": 1995,
    "index": "C",
    "title": "Squaring",
    "rating": 1800,
    "url": "https://codeforces.com/problemset/problem/1995/C",
    "tags": [
      "brute force",
      "constructive algorithms",
      "greedy",
      "implementation",
      "math",
      "number theory"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1995C+Squaring+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 36
  },
  {
    "id": "1935C",
    "contestId": 1935,
    "index": "C",
    "title": "Messenger in MAC",
    "rating": 1800,
    "url": "https://codeforces.com/problemset/problem/1935/C",
    "tags": [
      "binary search",
      "brute force",
      "constructive algorithms",
      "data structures",
      "dp",
      "greedy",
      "sortings"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1935C+Messenger%20in%20MAC+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    vector<long long> dp(n + 1, 0);\n    for (int i = 0; i < n; i++) {\n        dp[i + 1] = max(dp[i], dp[i] + a[i]);\n    }\n    cout << dp[n] << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 37
  },
  {
    "id": "1554C",
    "contestId": 1554,
    "index": "C",
    "title": "Mikasa",
    "rating": 1800,
    "url": "https://codeforces.com/problemset/problem/1554/C",
    "tags": [
      "binary search",
      "bitmasks",
      "greedy",
      "implementation"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1554C+Mikasa+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nbool check(long long mid, const vector<long long>& a, int n, long long k) {\n    long long count = 0;\n    for (int i = 0; i < n; i++) {\n        count += mid / a[i];\n    }\n    return count >= k;\n}\n\nvoid solve() {\n    int n;\n    long long k;\n    if (!(cin >> n >> k)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    long long low = 1, high = 1e18, ans = high;\n    while (low <= high) {\n        long long mid = low + (high - low) / 2;\n        if (check(mid, a, n, k)) {\n            ans = mid;\n            high = mid - 1;\n        } else {\n            low = mid + 1;\n        }\n    }\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 38
  },
  {
    "id": "1500A",
    "contestId": 1500,
    "index": "A",
    "title": "Going Home",
    "rating": 1800,
    "url": "https://codeforces.com/problemset/problem/1500/A",
    "tags": [
      "brute force",
      "hashing",
      "implementation",
      "math"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1500A+Going%20Home+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 39
  },
  {
    "id": "1768D",
    "contestId": 1768,
    "index": "D",
    "title": "Lucky Permutation",
    "rating": 1800,
    "url": "https://codeforces.com/problemset/problem/1768/D",
    "tags": [
      "constructive algorithms",
      "dfs and similar",
      "graphs",
      "greedy"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1768D+Lucky%20Permutation+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 40
  },
  {
    "id": "1852A",
    "contestId": 1852,
    "index": "A",
    "title": "Ntarsis' Set",
    "rating": 1800,
    "url": "https://codeforces.com/problemset/problem/1852/A",
    "tags": [
      "binary search",
      "math",
      "number theory"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1852A+Ntarsis'%20Set+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nbool check(long long mid, const vector<long long>& a, int n, long long k) {\n    long long count = 0;\n    for (int i = 0; i < n; i++) {\n        count += mid / a[i];\n    }\n    return count >= k;\n}\n\nvoid solve() {\n    int n;\n    long long k;\n    if (!(cin >> n >> k)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    long long low = 1, high = 1e18, ans = high;\n    while (low <= high) {\n        long long mid = low + (high - low) / 2;\n        if (check(mid, a, n, k)) {\n            ans = mid;\n            high = mid - 1;\n        } else {\n            low = mid + 1;\n        }\n    }\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 41
  },
  {
    "id": "1845D",
    "contestId": 1845,
    "index": "D",
    "title": "Rating System",
    "rating": 1800,
    "url": "https://codeforces.com/problemset/problem/1845/D",
    "tags": [
      "binary search",
      "brute force",
      "data structures",
      "dp",
      "dsu",
      "greedy",
      "math",
      "two pointers"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1845D+Rating%20System+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    vector<long long> dp(n + 1, 0);\n    for (int i = 0; i < n; i++) {\n        dp[i + 1] = max(dp[i], dp[i] + a[i]);\n    }\n    cout << dp[n] << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 42
  },
  {
    "id": "1922E",
    "contestId": 1922,
    "index": "E",
    "title": "Increasing Subsequences",
    "rating": 1800,
    "url": "https://codeforces.com/problemset/problem/1922/E",
    "tags": [
      "bitmasks",
      "constructive algorithms",
      "divide and conquer",
      "greedy",
      "math"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1922E+Increasing%20Subsequences+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 43
  },
  {
    "id": "1841C",
    "contestId": 1841,
    "index": "C",
    "title": "Ranom Numbers",
    "rating": 1800,
    "url": "https://codeforces.com/problemset/problem/1841/C",
    "tags": [
      "brute force",
      "dp",
      "greedy",
      "math",
      "strings"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1841C+Ranom%20Numbers+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    vector<long long> dp(n + 1, 0);\n    for (int i = 0; i < n; i++) {\n        dp[i + 1] = max(dp[i], dp[i] + a[i]);\n    }\n    cout << dp[n] << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 44
  },
  {
    "id": "1637D",
    "contestId": 1637,
    "index": "D",
    "title": "Yet Another Minimization Problem",
    "rating": 1800,
    "url": "https://codeforces.com/problemset/problem/1637/D",
    "tags": [
      "dp",
      "greedy",
      "math"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1637D+Yet%20Another%20Minimization%20Problem+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    vector<long long> dp(n + 1, 0);\n    for (int i = 0; i < n; i++) {\n        dp[i + 1] = max(dp[i], dp[i] + a[i]);\n    }\n    cout << dp[n] << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 45
  },
  {
    "id": "2101B",
    "contestId": 2101,
    "index": "B",
    "title": "Quartet Swapping",
    "rating": 1800,
    "url": "https://codeforces.com/problemset/problem/2101/B",
    "tags": [
      "brute force",
      "data structures",
      "divide and conquer",
      "greedy",
      "sortings"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+2101B+Quartet%20Swapping+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 46
  },
  {
    "id": "1556D",
    "contestId": 1556,
    "index": "D",
    "title": "Take a Guess",
    "rating": 1800,
    "url": "https://codeforces.com/problemset/problem/1556/D",
    "tags": [
      "bitmasks",
      "constructive algorithms",
      "interactive",
      "math"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1556D+Take%20a%20Guess+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 47
  },
  {
    "id": "1987D",
    "contestId": 1987,
    "index": "D",
    "title": "World is Mine",
    "rating": 1800,
    "url": "https://codeforces.com/problemset/problem/1987/D",
    "tags": [
      "dp",
      "games"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1987D+World%20is%20Mine+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    vector<long long> dp(n + 1, 0);\n    for (int i = 0; i < n; i++) {\n        dp[i + 1] = max(dp[i], dp[i] + a[i]);\n    }\n    cout << dp[n] << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 48
  },
  {
    "id": "2042C",
    "contestId": 2042,
    "index": "C",
    "title": "Competitive Fishing",
    "rating": 1800,
    "url": "https://codeforces.com/problemset/problem/2042/C",
    "tags": [
      "greedy"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+2042C+Competitive%20Fishing+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 49
  },
  {
    "id": "1560E",
    "contestId": 1560,
    "index": "E",
    "title": "Polycarp and String Transformation",
    "rating": 1800,
    "url": "https://codeforces.com/problemset/problem/1560/E",
    "tags": [
      "binary search",
      "implementation",
      "sortings",
      "strings"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1560E+Polycarp%20and%20String%20Transformation+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nbool check(long long mid, const vector<long long>& a, int n, long long k) {\n    long long count = 0;\n    for (int i = 0; i < n; i++) {\n        count += mid / a[i];\n    }\n    return count >= k;\n}\n\nvoid solve() {\n    int n;\n    long long k;\n    if (!(cin >> n >> k)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    long long low = 1, high = 1e18, ans = high;\n    while (low <= high) {\n        long long mid = low + (high - low) / 2;\n        if (check(mid, a, n, k)) {\n            ans = mid;\n            high = mid - 1;\n        } else {\n            low = mid + 1;\n        }\n    }\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 50
  },
  {
    "id": "2044F",
    "contestId": 2044,
    "index": "F",
    "title": "Easy Demon Problem",
    "rating": 1900,
    "url": "https://codeforces.com/problemset/problem/2044/F",
    "tags": [
      "binary search",
      "brute force",
      "data structures",
      "math",
      "number theory"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+2044F+Easy%20Demon%20Problem+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nusing ll = long long;\n\nvector<pair<int,int>> getFactorPairs(int number) {\n    vector<pair<int,int>> factorPairs;\n    factorPairs.push_back({1, number});\n    for (int divisor = 2; divisor * divisor <= number; divisor++) {\n        if (number % divisor == 0) {\n            factorPairs.push_back({divisor, number / divisor});\n        }\n    }\n    return factorPairs;\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int sizeA, sizeB, queryCount;\n    cin >> sizeA >> sizeB >> queryCount;\n\n    vector<int> arrA(sizeA), arrB(sizeB);\n    unordered_map<ll,int> freqA, freqB;\n    ll sumA = 0, sumB = 0;\n\n    for (int i = 0; i < sizeA; i++) {\n        cin >> arrA[i];\n        freqA[arrA[i]]++;\n        sumA += arrA[i];\n    }\n\n    for (int i = 0; i < sizeB; i++) {\n        cin >> arrB[i];\n        freqB[arrB[i]]++;\n        sumB += arrB[i];\n    }\n\n    for (int q = 0; q < queryCount; q++) {\n        int queryValue;\n        cin >> queryValue;\n        int absQuery = abs(queryValue);\n\n        vector<pair<int,int>> factorPairs = getFactorPairs(absQuery);\n        bool found = false;\n\n        for (auto [f1, f2] : factorPairs) {\n            vector<pair<ll,ll>> candidates;\n            if (queryValue >= 0) {\n                candidates = {\n                    {f1, f2}, {f2, f1}, {-f1, -f2}, {-f2, -f1}\n                };\n            } else {\n                candidates = {\n                    {-f1, f2}, {f2, -f1}, {f1, -f2}, {-f2, f1}\n                };\n            }\n\n            for (auto [x, y] : candidates) {\n                if (freqA[sumA - x] > 0 && freqB[sumB - y] > 0) {\n                    found = true;\n                    break;\n                }\n            }\n            if (found) break;\n        }\n\n        cout << (found ? \"YES\" : \"NO\") << \"\\n\";\n    }\n\n    return 0;\n}"
    },
    "order": 1
  },
  {
    "id": "1957D",
    "contestId": 1957,
    "index": "D",
    "title": "A BIT of an Inequality",
    "rating": 1900,
    "url": "https://codeforces.com/problemset/problem/1957/D",
    "tags": [
      "bitmasks",
      "brute force",
      "dp",
      "math"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1957D+A%20BIT%20of%20an%20Inequality+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nconst int NUM_BITS = 30;\nconst int MAX_SIZE = 100003;\n\nint prefixCount[NUM_BITS][MAX_SIZE][2];\nint suffixCount[NUM_BITS][MAX_SIZE][2];\n\nvoid solve() {\n\tint arraySize;\n\tcin >> arraySize;\n\tvector<int> array(arraySize + 1);\n\n\tfor (int i = 1; i <= arraySize; ++i) {\n\t\tcin >> array[i];\n\t}\n\n\tfor (int bit = 0; bit < NUM_BITS; ++bit) {\n\t\tsuffixCount[bit][arraySize + 1][0] = suffixCount[bit][arraySize + 1][1] = 0;\n\t}\n\n\tfor (int bit = 0; bit < NUM_BITS; ++bit) {\n\t\tfor (int index = 1; index <= arraySize; ++index) {\n\t\t\tint bitStatus = (array[index] & (1 << bit)) ? 1 : 0;\n\t\t\tfor (int k = 0; k < 2; ++k) {\n\t\t\t\tprefixCount[bit][index][k] = (bitStatus == k) + prefixCount[bit][index - 1][k ^ bitStatus];\n\t\t\t}\n\t\t}\n\t\tfor (int index = arraySize; index >= 1; --index) {\n\t\t\tint bitStatus = (array[index] & (1 << bit)) ? 1 : 0;\n\t\t\tfor (int k = 0; k < 2; ++k) {\n\t\t\t\tsuffixCount[bit][index][k] = (bitStatus == k) + suffixCount[bit][index + 1][k ^ bitStatus];\n\t\t\t}\n\t\t}\n\t}\n\n\tlong long result = 0;\n\tfor (int i = 1; i <= arraySize; ++i) {\n\t\tint highestBit = 31 - __builtin_clz(array[i]);\n\t\tresult += static_cast<long long>(prefixCount[highestBit][i - 1][1]) * (1 + suffixCount[highestBit][i + 1][0]);\n\t\tresult += static_cast<long long>(1 + prefixCount[highestBit][i - 1][0]) * suffixCount[highestBit][i + 1][1];\n\t}\n\tcout << result << \"\\n\";\n}\n\nint main() {\n\tint testCases;\n\tcin >> testCases;\n\twhile (testCases--) {\n\t\tsolve();\n\t}\n\treturn 0;\n}"
    },
    "order": 2
  },
  {
    "id": "1950G",
    "contestId": 1950,
    "index": "G",
    "title": "Shuffling Songs",
    "rating": 1900,
    "url": "https://codeforces.com/problemset/problem/1950/G",
    "tags": [
      "bitmasks",
      "dfs and similar",
      "dp",
      "graphs",
      "hashing",
      "implementation",
      "strings"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1950G+Shuffling%20Songs+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n\tint numPairs;\n\tcin >> numPairs;\n\tvector<int> startIndices(numPairs), endIndices(numPairs);\n\tvector<string> firstNames(numPairs), secondNames(numPairs);\n\tvector<string> allNames;\n\n\tfor (int i = 0; i < numPairs; ++i) {\n\t\tstring firstName, secondName;\n\t\tcin >> firstName >> secondName;\n\t\tallNames.push_back(firstName);\n\t\tallNames.push_back(secondName);\n\t\tfirstNames[i] = firstName;\n\t\tsecondNames[i] = secondName;\n\t}\n\n\tsort(allNames.begin(), allNames.end());\n\tallNames.erase(unique(allNames.begin(), allNames.end()), allNames.end());\n\n\tfor (int i = 0; i < numPairs; ++i) {\n\t\tstartIndices[i] = lower_bound(allNames.begin(), allNames.end(), firstNames[i]) - allNames.begin();\n\t\tendIndices[i] = lower_bound(allNames.begin(), allNames.end(), secondNames[i]) - allNames.begin();\n\t}\n\n\tvector<vector<int>> dp(1 << numPairs, vector<int>(numPairs, 0));\n\n\tfor (int i = 0; i < numPairs; ++i) {\n\t\tdp[1 << i][i] = 1;\n\t}\n\n\tfor (int mask = 0; mask < (1 << numPairs); ++mask) {\n\t\tfor (int last = 0; last < numPairs; ++last) {\n\t\t\tif (!dp[mask][last]) continue;\n\t\t\tfor (int i = 0; i < numPairs; ++i) {\n\t\t\t\tif (mask & (1 << i)) continue;\n\t\t\t\tif (startIndices[last] == startIndices[i] || endIndices[last] == endIndices[i]) {\n\t\t\t\t\tdp[mask | (1 << i)][i] |= dp[mask][last];\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n\n\tint maxDistinctPairs = 0;\n\n\tfor (int mask = 0; mask < (1 << numPairs); ++mask) {\n\t\tfor (int i = 0; i < numPairs; ++i) {\n\t\t\tif (dp[mask][i]) {\n\t\t\t\tmaxDistinctPairs = max(maxDistinctPairs, __builtin_popcount(mask));\n\t\t\t}\n\t\t}\n\t}\n\n\tcout << numPairs - maxDistinctPairs << \"\\n\";\n}\n\nint main() {\n\tint testCases;\n\tcin >> testCases;\n\twhile (testCases--) {\n\t\tsolve();\n\t}\n\treturn 0;\n}"
    },
    "order": 3
  },
  {
    "id": "1932F",
    "contestId": 1932,
    "index": "F",
    "title": "Feed Cats",
    "rating": 1900,
    "url": "https://codeforces.com/problemset/problem/1932/F",
    "tags": [
      "data structures",
      "dp",
      "sortings"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1932F+Feed%20Cats+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\n#define pb emplace_back\n#define mp make_pair\n#define x first\n#define y second\n#define all(a) a.begin(), a.end()\n#define rall(a) a.rbegin(), a.rend()\n\ntypedef long double ld;\ntypedef long long ll;\n\nusing namespace std;\n\nmt19937 rnd(time(nullptr));\n\nconst ll inf = 1e18;\nconst ll M = 998244353;\nconst ld pi = atan2(0, -1);\nconst ld eps = 1e-6;\n\nvoid solve(int tc) {\n\tint n, m;\n\tcin >> n >> m;\n\tvector<pair<int, int>> a(m); \n\tvector<int> op(n + 1); \n\tvector<vector<int>> del(n + 1); \n\n\tfor (auto &e : a) {\n\t\tcin >> e.x >> e.y; \n\t\top[e.x]++;\n\t\tdel[e.y].emplace_back(e.x); \n\t}\n\n\tmultiset<int> cur; \n\tvector<int> dp(n + 1); \n\n\tfor (int i = 1; i <= n; ++i) {\n\t\tdp[i] = dp[i - 1];\n\n\t\tfor (int j = 0; j < op[i]; ++j) cur.insert(i);\n\n\t\tif (!cur.empty()) {\n\t\t\tint min_l = *cur.begin();\n\t\t\tdp[i] = max(dp[i], dp[min_l - 1] + (int)cur.size());\n\t\t}\n\n\t\tfor (int l : del[i]) {\n\t\t\tcur.erase(cur.find(l));\n\t\t}\n\t}\n\n\tcout << dp[n];\n}\n\nbool multi = true;\n\nsigned main() {\n\tios::sync_with_stdio(false);\n\tcin.tie(nullptr);\n\n\tint t = 1;\n\tif (multi) cin >> t;\n\tfor (int i = 1; i <= t; ++i) {\n\t\tsolve(i);\n\t\tcout << \"\\n\";\n\t}\n\treturn 0;\n}"
    },
    "order": 4
  },
  {
    "id": "1925D",
    "contestId": 1925,
    "index": "D",
    "title": "Good Trip",
    "rating": 1900,
    "url": "https://codeforces.com/problemset/problem/1925/D",
    "tags": [
      "combinatorics",
      "dp",
      "math",
      "probabilities"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1925D+Good%20Trip+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nusing ll = long long;\nconst ll MOD = 1e9 + 7;\n\nll power(ll a, ll b) {\n\t\tll r = 1;\n\t\twhile (b) {\n\t\t\t\tif (b & 1) r = r * a % MOD; \n\t\t\t\ta = a * a % MOD;         \n\t\t\t\tb >>= 1;                   \n\t\t}\n\t\treturn r;                       \n}\n\nint main() {\n\t\tios::sync_with_stdio(false);\n\t\tcin.tie(nullptr);\n\n\t\tint t;\n\t\tcin >> t;\n\t\twhile (t--) {\n\t\t\t\tll n, m, k;\n\t\t\t\tcin >> n >> m >> k;\n\n\t\t\t\tll S = 0; \n\t\t\t\tfor (int i = 0; i < m; ++i) {\n\t\t\t\t\t\tll a, b, f;\n\t\t\t\t\t\tcin >> a >> b >> f;     \n\t\t\t\t\t\tS = (S + f) % MOD;    \n\t\t\t\t}\n\n\t\t\t\tll T = n * (n - 1) / 2;           \n\t\t\t\tll K2 = k * (k - 1) / 2;         \n\n\t\t\t\tll invT = power(T % MOD, MOD - 2);   \n\n\t\t\t\tll term1 = ((k % MOD) * (S % MOD)) % MOD * invT % MOD;\n\t\t\t\tll term2 = (m % MOD) * (K2 % MOD) % MOD * invT % MOD * invT % MOD;  \n\n\t\t\t\tll ans = (term1 + term2) % MOD;      \n\t\t\t\tcout << ans << '\\n';\n\t\t}\n}"
    },
    "order": 5
  },
  {
    "id": "1918D",
    "contestId": 1918,
    "index": "D",
    "title": "Blocking Elements",
    "rating": 1900,
    "url": "https://codeforces.com/problemset/problem/1918/D",
    "tags": [
      "binary search",
      "data structures",
      "dp",
      "implementation",
      "two pointers"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1918D+Blocking%20Elements+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nint main() {\n\t\tios_base::sync_with_stdio(false);\n\t\tcin.tie(0);\n\t\tint tt;\n\t\tcin >> tt;\n\t\twhile (tt--) {\n\t\t\t\tint n;\n\t\t\t\tcin >> n;\n\t\t\t\tint64_t a[n + 1];\n\t\t\t\tfor (int i = 0; i < n; ++i) {\n\t\t\t\t\t\tcin >> a[i];\n\t\t\t\t}\n\n\t\t\t\tint64_t l = 0, r = int64_t(1e9) * n;\n\t\t\t\twhile (l < r) {\n\t\t\t\t\t\tint64_t m = (l + r) / 2; \n\t\t\t\t\t\tset<pair<int64_t, int>> pos; \n\t\t\t\t\t\tint64_t dp[n + 1];\n\t\t\t\t\t\tint p2 = n; \n\t\t\t\t\t\tdp[n] = 0;\n\t\t\t\t\t\tpos.insert({dp[n], n});\n\n\t\t\t\t\t\tint64_t sum = 0; \n\t\t\t\t\t\tfor (int j = n - 1; j >= 0; --j) {\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\twhile (sum > m) {\n\t\t\t\t\t\t\t\t\t\tsum -= a[p2 - 1];\n\t\t\t\t\t\t\t\t\t\tpos.erase({dp[p2], p2}); \n\t\t\t\t\t\t\t\t\t\tp2--;\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\tdp[j] = pos.begin()->first + a[j];\n\t\t\t\t\t\t\t\tpos.insert({dp[j], j}); \n\t\t\t\t\t\t\t\tsum += a[j];\n\t\t\t\t\t\t}\n\t\t\t\t\t\tsum = 0;\n\t\t\t\t\t\tint yes = 0;\n\t\t\t\t\t\tfor (int j = 0; j < n; ++j) {\n\t\t\t\t\t\t\t\tif (sum <= m && dp[j] <= m) yes = 1;\n\t\t\t\t\t\t\t\tsum += a[j]; \n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tif (yes)\n\t\t\t\t\t\t\t\tr = m; \n\t\t\t\t\t\telse\n\t\t\t\t\t\t\t\tl = m + 1; \n\t\t\t\t}\n\n\t\t\t\tcout << l << \"\\n\"; \n\t\t}\n}"
    },
    "order": 6
  },
  {
    "id": "1912A",
    "contestId": 1912,
    "index": "A",
    "title": "Accumulator Apex",
    "rating": 1900,
    "url": "https://codeforces.com/problemset/problem/1912/A",
    "tags": [
      "data structures",
      "implementation",
      "sortings"
    ],
    "hint": "Speed up operations from O(N) to O(log N) using appropriate containers like std::set, std::map, or a Fenwick/Segment Tree for dynamic range queries and updates.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1912A+Accumulator%20Apex+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nusing ll = long long;\n\nstruct Chunk {\n\t\tll min_pref;\n\t\tll sum;\n};\n\nstruct Node {\n\t\tll min_pref;\n\t\tll sum;\n\t\tint list_id;\n\t\tint idx;\n\n\t\tbool operator<(const Node &other) const {\n\t\t\t\treturn min_pref < other.min_pref;\n\t\t}\n};\n\nint main() {\n\t\tios::sync_with_stdio(false);\n\t\tcin.tie(nullptr);\n\n\t\tll x;\n\t\tint k;\n\t\tcin >> x >> k;\n\n\t\tvector<vector<Chunk>> lists(k);\n\n\t\tfor (int i = 0; i < k; i++) {\n\t\t\t\tint n;\n\t\t\t\tcin >> n;\n\n\t\t\t\tll sum = 0, min_pref = 0;\n\n\t\t\t\tfor (int j = 0; j < n; j++) {\n\t\t\t\t\t\tll w;\n\t\t\t\t\t\tcin >> w;\n\n\t\t\t\t\t\tsum += w;\n\t\t\t\t\t\tmin_pref = min(min_pref, sum);\n\n\t\t\t\t\t\tif (sum > 0) {\n\t\t\t\t\t\t\t\tlists[i].push_back({min_pref, sum});\n\t\t\t\t\t\t\t\tsum = 0;\n\t\t\t\t\t\t\t\tmin_pref = 0;\n\t\t\t\t\t\t}\n\t\t\t\t}\n\t\t}\n\n\t\tpriority_queue<Node> pq;\n\n\t\tfor (int i = 0; i < k; i++) {\n\t\t\t\tif (!lists[i].empty()) {\n\t\t\t\t\t\tpq.push({lists[i][0].min_pref, lists[i][0].sum, i, 0});\n\t\t\t\t}\n\t\t}\n\n\t\twhile (!pq.empty()) {\n\t\t\t\tauto cur = pq.top();\n\t\t\t\tpq.pop();\n\n\t\t\t\tif (x + cur.min_pref < 0) break;\n\n\t\t\t\tx += cur.sum;\n\n\t\t\t\tint nxt = cur.idx + 1;\n\t\t\t\tif (nxt < (int)lists[cur.list_id].size()) {\n\t\t\t\t\t\tauto &c = lists[cur.list_id][nxt];\n\t\t\t\t\t\tpq.push({c.min_pref, c.sum, cur.list_id, nxt});\n\t\t\t\t}\n\t\t}\n\n\t\tcout << x << '\\n';\n}"
    },
    "order": 7
  },
  {
    "id": "1906E",
    "contestId": 1906,
    "index": "E",
    "title": "Merge Not Sort",
    "rating": 1900,
    "url": "https://codeforces.com/problemset/problem/1906/E",
    "tags": [
      "constructive algorithms",
      "dp"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1906E+Merge%20Not%20Sort+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n\tios::sync_with_stdio(false);\n\tcin.tie(nullptr);\n\n\tint N;\n\tcin >> N;\n\n\tvector<int> C(2 * N);\n\tfor (int &x : C) cin >> x;\n\n\tvector<vector<int>> chunks;\n\tchunks.push_back({C[0]});\n\tfor (int i = 1; i < 2 * N; i++) {\n\t\tif (C[i] < chunks.back()[0]) {\n\t\t\tchunks.back().push_back(C[i]);\n\t\t} else {\n\t\t\tchunks.push_back({C[i]});\n\t\t}\n\t}\n\n\tint k = (int)chunks.size();\n\tvector<int> len(k);\n\tfor (int i = 0; i < k; i++) len[i] = (int)chunks[i].size();\n\n\tvector<vector<bool>> dp(k + 1, vector<bool>(N + 1, false));\n\tvector<vector<bool>> take(k + 1, vector<bool>(N + 1, false));\n\t\n\tdp[0][0] = true;\n\tfor (int i = 1; i <= k; i++) {\n\t\tfor (int s = 0; s <= N; s++) {\n\t\t\tif (dp[i - 1][s]) dp[i][s] = true;\n\t\t\tif (s >= len[i - 1] && dp[i - 1][s - len[i - 1]]) {\n\t\t\t\tdp[i][s] = true;\n\t\t\t\ttake[i][s] = true;\n\t\t\t}\n\t\t}\n\t}\n\n\tif (!dp[k][N]) {\n\t\tcout << -1 << '\\n';\n\t\treturn 0;\n\t}\n\n\tvector<int> choose(k, 0);\n\tint s = N;\n\tfor (int i = k; i >= 1; i--) {\n\t\tif (take[i][s]) {\n\t\t\tchoose[i - 1] = 1;\n\t\t\ts -= len[i - 1];\n\t\t}\n\t}\n\n\tvector<int> A, B;\n\tfor (int i = 0; i < k; i++) {\n\t\tif (choose[i]) {\n\t\t\tfor (int x : chunks[i]) A.push_back(x);\n\t\t} else {\n\t\t\tfor (int x : chunks[i]) B.push_back(x);\n\t\t}\n\t}\n\n\tfor (int x : A) cout << x << ' ';\n\tcout << '\\n';\n\tfor (int x : B) cout << x << ' ';\n\tcout << '\\n';\n}"
    },
    "order": 8
  },
  {
    "id": "1902E",
    "contestId": 1902,
    "index": "E",
    "title": "Collapsing Strings",
    "rating": 1900,
    "url": "https://codeforces.com/problemset/problem/1902/E",
    "tags": [
      "data structures",
      "strings",
      "trees"
    ],
    "hint": "Speed up operations from O(N) to O(log N) using appropriate containers like std::set, std::map, or a Fenwick/Segment Tree for dynamic range queries and updates.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1902E+Collapsing%20Strings+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nusing ll = long long;\n\nconst int MAXN = 1000005;\n\nint nxt[MAXN][26];\nint cnt[MAXN];\n\nint main() {\n\t\tios::sync_with_stdio(false);\n\t\tcin.tie(nullptr);\n\n\t\tint n;\n\t\tcin >> n;\n\n\t\tvector<string> s(n);\n\n\t\tll total_len = 0;\n\t\tfor (int i = 0; i < n; i++) {\n\t\t\t\tcin >> s[i];\n\t\t\t\ttotal_len += s[i].size();\n\t\t}\n\n\t\tll ans = 2LL * n * total_len;\n\t\tint nodes = 1;\n\n\t\tfor (auto &str : s) {\n\t\t\t\tint node = 0;\n\t\t\t\tcnt[node]++;\n\n\t\t\t\tfor (int i = (int)str.size() - 1; i >= 0; i--) {\n\t\t\t\t\t\tint c = str[i] - 'a';\n\n\t\t\t\t\t\tif (!nxt[node][c]) nxt[node][c] = nodes++;\n\t\t\t\t\t\tnode = nxt[node][c];\n\t\t\t\t\t\tcnt[node]++;\n\t\t\t\t}\n\t\t}\n\n\t\tfor (auto &str : s) {\n\t\t\t\tint node = 0;\n\t\t\t\tfor (int i = 0; i < (int)str.size(); i++) {\n\t\t\t\t\t\tint c = str[i] - 'a';\n\t\t\t\t\t\tif (!nxt[node][c]) break;\n\t\t\t\t\t\tnode = nxt[node][c];\n\t\t\t\t\t\tans -= 2LL * cnt[node];\n\t\t\t\t}\n\t\t}\n\n\t\tcout << ans << \"\\n\";\n}"
    },
    "order": 9
  },
  {
    "id": "1898D",
    "contestId": 1898,
    "index": "D",
    "title": "Absolute Beauty",
    "rating": 1900,
    "url": "https://codeforces.com/problemset/problem/1898/D",
    "tags": [
      "greedy",
      "math"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1898D+Absolute%20Beauty+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nusing ll = long long;\n\nvoid solve() {\n\t\tint n;\n\t\tcin >> n;\n\n\t\tvector<ll> a(n), b(n);\n\t\tfor (auto &x : a) cin >> x;\n\t\tfor (auto &x : b) cin >> x;\n\n\t\tll beauty = 0;\n\t\tfor (int i = 0; i < n; i++)\n\t\t\t\tbeauty += abs(a[i] - b[i]); \n\n\t\tint i1 = 0, i2 = 0; \n\t\tfor (int i = 1; i < n; i++) {\n\t\t\t\tif (max(a[i], b[i]) < max(a[i1], b[i1])) i1 = i;\n\t\t\t\tif (min(a[i], b[i]) > min(a[i2], b[i2])) i2 = i;\n\t\t}\n\n\t\tll ans = beauty; \n\n\t\tif (i1 != i2) {\n\t\t\t\tll cur = beauty;\n\n\t\t\t\tcur -= abs(a[i1] - b[i1]);\n\t\t\t\tcur -= abs(a[i2] - b[i2]);\n\n\t\t\t\tcur += abs(a[i1] - b[i2]);\n\t\t\t\tcur += abs(a[i2] - b[i1]);\n\n\t\t\t\tans = max(ans, cur);\n\t\t}\n\n\t\tcout << ans << \"\\n\";\n}\n\nint main() {\n\t\tios::sync_with_stdio(false);\n\t\tcin.tie(nullptr);\n\n\t\tint t;\n\t\tcin >> t;\n\t\twhile (t--) solve();\n}"
    },
    "order": 10
  },
  {
    "id": "1882D",
    "contestId": 1882,
    "index": "D",
    "title": "Tree XOR",
    "rating": 1900,
    "url": "https://codeforces.com/problemset/problem/1882/D",
    "tags": [
      "bitmasks",
      "dfs and similar",
      "dp",
      "greedy",
      "trees"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1882D+Tree%20XOR+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nusing ll = long long;\nconst int N = 200005;\n\nvector<int> g[N];       \nll a[N];                 \nll sub[N];               \nll dp[N];                \nll ans[N];               \nint n;\n\nvoid dfs1(int u, int p) {\n\tsub[u] = 1;\n\tdp[u] = 0;\n\tfor (int v : g[u]) {\n\t\tif (v == p) continue;\n\t\tdfs1(v, u);\n\t\tsub[u] += sub[v];\n\t\tdp[u] += dp[v] + sub[v] * (a[u] ^ a[v]);\n\t}\n}\n\nvoid dfs2(int u, int p) {\n\tfor (int v : g[u]) {\n\t\tif (v == p) continue;\n\t\tll w = (a[u] ^ a[v]);\n\t\tans[v] = ans[u] - sub[v] * w + (n - sub[v]) * w;\n\t\tdfs2(v, u);\n\t}\n}\n\nvoid solve() {\n\tcin >> n;\n\tfor (int i = 1; i <= n; i++) {\n\t\tcin >> a[i];\n\t\tg[i].clear();\n\t}\n\n\tfor (int i = 0; i < n - 1; i++) {\n\t\tint u, v;\n\t\tcin >> u >> v;\n\t\tg[u].push_back(v);\n\t\tg[v].push_back(u);\n\t}\n\n\tdfs1(1, 0);      \n\tans[1] = dp[1];  \n\tdfs2(1, 0);      \n\n\tfor (int i = 1; i <= n; i++) cout << ans[i] << \" \";\n\tcout << \"\\n\";\n}\n\nint main() {\n\tios::sync_with_stdio(false);\n\tcin.tie(nullptr);\n\n\tint t;\n\tcin >> t;\n\twhile (t--) solve();\n}"
    },
    "order": 11
  },
  {
    "id": "1310A",
    "contestId": 1310,
    "index": "A",
    "title": "Recommendations",
    "rating": 1900,
    "url": "https://codeforces.com/problemset/problem/1310/A",
    "tags": [
      "data structures",
      "greedy",
      "sortings"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1310A+Recommendations+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\n#define forRange(i, l, r) for(int i = int(l); i < int(r); i++)\n#define sizeOf(a) int((a).size())\n\nstruct Segment {\n    int left, right;\n\n    bool operator< (const Segment &other) const {\n        if (left != other.left)\n            return left < other.left;\n        return right < other.right;\n    };\n};\n\nvoid solve() {\n    int numSegments;\n    cin >> numSegments;\n\n    vector<Segment> segments(numSegments);\n    forRange(i, 0, numSegments) \n        cin >> segments[i].left >> segments[i].right;\n\n    vector<int> answer(numSegments, 0);\n\n    for (int pass = 0; pass < 2; pass++) {\n        vector<int> order(numSegments);\n        iota(order.begin(), order.end(), 0); \n        sort(order.begin(), order.end(), [&segments](int i, int j){\n            if (segments[i].left != segments[j].left)\n                return segments[i].left < segments[j].left;\n            return segments[i].right > segments[j].right;\n        });\n\n        set<int> activeRights; \n        for (int idx : order) {\n            auto it = activeRights.lower_bound(segments[idx].right);\n            if (it != activeRights.end())\n                answer[idx] += *it - segments[idx].right;\n            activeRights.insert(segments[idx].right);\n        }\n        for (auto &s : segments) {\n            s.left = -s.left;\n            s.right = -s.right;\n            swap(s.left, s.right);\n        }\n    }\n\n    map<Segment, int> segmentCount;\n    for (auto s : segments)\n        segmentCount[s]++;\n    \n    for (int i = 0; i < numSegments; i++)\n        if (segmentCount[segments[i]] > 1)\n            answer[i] = 0;\n\n    for (int val : answer)\n        cout << val << '\\n';\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(0);\n\n    int testCases;\n    cin >> testCases;\n    while (testCases--)\n        solve();\n    \n    return 0;\n}"
    },
    "order": 12
  },
  {
    "id": "1842D",
    "contestId": 1842,
    "index": "D",
    "title": "Tenzing and His Animal Friends ",
    "rating": 1900,
    "url": "https://codeforces.com/problemset/problem/1842/D",
    "tags": [
      "constructive algorithms",
      "graphs",
      "greedy"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1842D+Tenzing%20and%20His%20Animal%20Friends%20+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\n\nusing namespace std;\n\nint n, m;\nlong long dis[100][100];\n\nint main() {\n\tios::sync_with_stdio(false), cin.tie(nullptr);\n\tcin >> n >> m;\n\n\tmemset(dis, 0x3f, sizeof dis);\n\n\twhile (m--) {\n\t\tint u, v;\n\t\tlong long y;\n\t\tcin >> u >> v >> y, u--, v--;\n\t\tdis[u][v] = dis[v][u] = y;\n\t}\n\n\tfor (int i = 0; i < n; i++) dis[i][i] = 0;\n\n\tfor (int k = 0; k < n; k++)\n\t\tfor (int i = 0; i < n; i++)\n\t\t\tfor (int j = 0; j < n; j++)\n\t\t\t\tdis[i][j] = min(dis[i][j], dis[i][k] + dis[k][j]);\n\n\tif (dis[0][n - 1] > (long long)1e18) cout << \"inf\", exit(0);\n\n\tint ord[100];\n\tiota(ord, ord + n, 0);\n\tsort(ord + 1, ord + n, [](int a, int b) { return dis[0][a] < dis[0][b]; });\n\n\tstring s(n, '0');\n\tvector<pair<string, long long>> ans;\n\n\tfor (int i = 0; i < n - 1; i++) {\n\t\tint u = ord[i], v = ord[i + 1];\n\t\ts[u] = '1';\n\t\tans.emplace_back(s, dis[0][v] - dis[0][u]);\n\t\tif (v == n - 1) break;\n\t}\n\n\tcout << dis[0][n - 1] << ' ' << ans.size() << '\\n';\n\tfor (auto [mask, t] : ans) cout << mask << ' ' << t << '\\n';\n}"
    },
    "order": 13
  },
  {
    "id": "1819B",
    "contestId": 1819,
    "index": "B",
    "title": "The Butcher",
    "rating": 1900,
    "url": "https://codeforces.com/problemset/problem/1819/B",
    "tags": [
      "geometry",
      "greedy",
      "implementation",
      "sortings",
      "two pointers"
    ],
    "hint": "Notice that as the right pointer expands, the left pointer only needs to move forward. Maintain frequency counts or window invariants to keep the window valid in O(N) overall.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1819B+The%20Butcher+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nbool check(long long H, long long W, vector<pair<int, int>> a) {\n\t\tmultiset<pair<int, int>> sh, sw;\n\n\t\tfor (auto &p : a) {\n\t\t\t\tsh.insert({p.first, p.second});\n\t\t\t\tsw.insert({p.second, p.first});\n\t\t}\n\n\t\twhile (!sh.empty()) {\n\t\t\t\tauto itw = prev(sw.end());\n\t\t\t\tauto ith = prev(sh.end());\n\n\t\t\t\tif (itw->first == W) {\n\t\t\t\t\t\tint h = itw->second;\n\t\t\t\t\t\tsw.erase(itw);\n\t\t\t\t\t\tsh.erase(sh.find({h, W}));\n\t\t\t\t\t\tH -= h;\n\t\t\t\t} else if (ith->first == H) {\n\t\t\t\t\t\tint w = ith->second;\n\t\t\t\t\t\tsh.erase(ith);\n\t\t\t\t\t\tsw.erase(sw.find({w, H}));\n\t\t\t\t\t\tW -= w;\n\t\t\t\t} else {\n\t\t\t\t\t\treturn false;\n\t\t\t\t}\n\t\t}\n\n\t\treturn true;\n}\n\nint main() {\n\t\tios::sync_with_stdio(false);\n\t\tcin.tie(nullptr);\n\n\t\tint t;\n\t\tcin >> t;\n\n\t\twhile (t--) {\n\t\t\t\tint n;\n\t\t\t\tcin >> n;\n\n\t\t\t\tvector<pair<int, int>> a(n);\n\t\t\t\tlong long area = 0;\n\t\t\t\tint maxh = 0, maxw = 0;\n\n\t\t\t\tfor (int i = 0; i < n; i++) {\n\t\t\t\t\t\tcin >> a[i].first >> a[i].second;\n\t\t\t\t\t\tarea += 1LL * a[i].first * a[i].second;\n\t\t\t\t\t\tmaxh = max(maxh, a[i].first);\n\t\t\t\t\t\tmaxw = max(maxw, a[i].second);\n\t\t\t\t}\n\n\t\t\t\tvector<pair<long long, long long>> ans;\n\n\t\t\t\tif (area % maxw == 0) {\n\t\t\t\t\t\tlong long h = area / maxw;\n\t\t\t\t\t\tif (check(h, maxw, a)) ans.push_back({h, maxw});\n\t\t\t\t}\n\n\t\t\t\tif (area % maxh == 0) {\n\t\t\t\t\t\tlong long w = area / maxh;\n\t\t\t\t\t\tif (check(maxh, w, a)) ans.push_back({maxh, w});\n\t\t\t\t}\n\n\t\t\t\tsort(ans.begin(), ans.end());\n\t\t\t\tans.erase(unique(ans.begin(), ans.end()), ans.end());\n\n\t\t\t\tcout << ans.size() << \"\\n\";\n\t\t\t\tfor (auto &p : ans) cout << p.first << ' ' << p.second << \"\\n\";\n\t\t}\n}"
    },
    "order": 14
  },
  {
    "id": "1817B",
    "contestId": 1817,
    "index": "B",
    "title": "Fish Graph",
    "rating": 1900,
    "url": "https://codeforces.com/problemset/problem/1817/B",
    "tags": [
      "brute force",
      "constructive algorithms",
      "dfs and similar",
      "graphs"
    ],
    "hint": "A fish graph requires a cycle containing a vertex u with degree >= 4, where u has at least 2 edges outside the cycle. Find such a vertex u and find a simple cycle through two of its neighbors using BFS.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1817B+Fish%20Graph+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n, m;\n    if (!(cin >> n >> m)) return;\n    vector<vector<int>> adj(n + 1);\n    for (int i = 0; i < m; i++) {\n        int u, v;\n        cin >> u >> v;\n        adj[u].push_back(v);\n        adj[v].push_back(u);\n    }\n    for (int u = 1; u <= n; u++) {\n        if (adj[u].size() >= 4) {\n            for (int v : adj[u]) {\n                vector<int> parent(n + 1, -1);\n                queue<int> q;\n                parent[v] = u;\n                q.push(v);\n                bool found = false;\n                int endNode = -1;\n                while (!q.empty()) {\n                    int curr = q.front();\n                    q.pop();\n                    for (int nxt : adj[curr]) {\n                        if (nxt == u) continue;\n                        if (parent[nxt] == -1) {\n                            parent[nxt] = curr;\n                            q.push(nxt);\n                        }\n                    }\n                }\n                for (int w : adj[u]) {\n                    if (w != v && parent[w] != -1) {\n                        endNode = w;\n                        found = true;\n                        break;\n                    }\n                }\n                if (found) {\n                    vector<pair<int, int>> cycleEdges;\n                    cycleEdges.push_back({u, v});\n                    int curr = endNode;\n                    unordered_set<int> inCycle = {u, v};\n                    while (curr != v) {\n                        cycleEdges.push_back({curr, parent[curr]});\n                        inCycle.insert(curr);\n                        curr = parent[curr];\n                    }\n                    cycleEdges.push_back({u, endNode});\n                    vector<pair<int, int>> finEdges = cycleEdges;\n                    int added = 0;\n                    for (int nei : adj[u]) {\n                        if (nei != v && nei != endNode && inCycle.find(nei) == inCycle.end()) {\n                            finEdges.push_back({u, nei});\n                            added++;\n                            if (added == 2) break;\n                        }\n                    }\n                    if (added == 2) {\n                        cout << \"YES\\n\" << finEdges.size() << \"\\n\";\n                        for (auto& e : finEdges) cout << e.first << \" \" << e.second << \"\\n\";\n                        return;\n                    }\n                }\n            }\n        }\n    }\n    cout << \"NO\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 15
  },
  {
    "id": "1799D1",
    "contestId": 1799,
    "index": "D1",
    "title": "Hot Start Up (easy version)",
    "rating": 1900,
    "url": "https://codeforces.com/problemset/problem/1799/D1",
    "tags": [
      "dp"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1799D1+Hot%20Start%20Up%20(easy%20version)+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nconst long long INF = 4e18; \n\nint main() {\n\t\tios::sync_with_stdio(false);\n\t\tcin.tie(nullptr);\n\n\t\tint T;\n\t\tcin >> T;\n\n\t\twhile (T--) {\n\t\t\t\tint n, k;\n\t\t\t\tcin >> n >> k;\n\n\t\t\t\tvector<int> a(n + 1);\n\t\t\t\tfor (int i = 1; i <= n; i++) cin >> a[i];\n\n\t\t\t\tvector<long long> cold(k + 1), hot(k + 1);\n\t\t\t\tfor (int i = 1; i <= k; i++) cin >> cold[i];\n\t\t\t\tfor (int i = 1; i <= k; i++) cin >> hot[i];\n\n\t\n\t\t\t\tvector<vector<long long>> dp(n + 1, vector<long long>(k + 1, INF));\n\n\t\t\t\tdp[1][0] = cold[a[1]];\n\n\t\t\t\tfor (int i = 2; i <= n; i++) {\n\t\t\t\t\t\tint x = a[i]; \n\n\t\t\t\t\t\tfor (int j = 0; j <= k; j++) {\n\t\t\t\t\t\t\t\tif (dp[i - 1][j] == INF) continue; \n\n\t\t\t\t\t\t\t\tlong long cost1 = (a[i] == a[i - 1] ? hot[x] : cold[x]);\n\t\t\t\t\t\t\t\tdp[i][j] = min(dp[i][j], dp[i - 1][j] + cost1);\n\t\t\t\t\t\t\t\tlong long cost2 = (j == x ? hot[x] : cold[x]);\n\t\t\t\t\t\t\t\tdp[i][a[i - 1]] = min(dp[i][a[i - 1]], dp[i - 1][j] + cost2);\n\t\t\t\t\t\t}\n\t\t\t\t}\n\n\t\t\t\tcout << *min_element(dp[n].begin(), dp[n].end()) << \"\\n\";\n\t\t}\n}"
    },
    "order": 16
  },
  {
    "id": "1794D",
    "contestId": 1794,
    "index": "D",
    "title": "Counting Factorizations",
    "rating": 1900,
    "url": "https://codeforces.com/problemset/problem/1794/D",
    "tags": [
      "combinatorics",
      "divide and conquer",
      "dp",
      "math",
      "number theory"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1794D+Counting%20Factorizations+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nusing ll = long long;\nconst ll MOD = 998244353;\n\nll modpow(ll a, ll b) {\n\t\tll r = 1;\n\t\twhile (b) {\n\t\t\t\tif (b & 1) r = r * a % MOD;\n\t\t\t\ta = a * a % MOD;\n\t\t\t\tb >>= 1;\n\t\t}\n\t\treturn r;\n}\n\nint main() {\n\t\tios::sync_with_stdio(false);\n\t\tcin.tie(nullptr);\n\n\t\tint n;\n\t\tcin >> n;\n\t\tint N = 2 * n;\n\n\t\tvector<ll> a(N);\n\t\tfor (int i = 0; i < N; i++) cin >> a[i];\n\n\t\tunordered_map<ll, int> freq;\n\t\tfor (ll x : a) freq[x]++;\n\n\t\tauto is_prime = [&](ll x) {\n\t\t\t\tif (x < 2) return false;\n\t\t\t\tfor (ll i = 2; i * i <= x; i++)\n\t\t\t\t\t\tif (x % i == 0) return false;\n\t\t\t\treturn true;\n\t\t};\n\n\t\tvector<int> primes, nonprimes;\n\t\tfor (auto &[val, cnt] : freq) {\n\t\t\t\tif (is_prime(val)) primes.push_back(cnt);\n\t\t\t\telse nonprimes.push_back(cnt);\n\t\t}\n\n\t\tif ((int)primes.size() < n) {\n\t\t\t\tcout << 0 << \"\\n\";\n\t\t\t\treturn 0;\n\t\t}\n\n\t\tvector<ll> fact(N + 1), invfact(N + 1);\n\t\tfact[0] = 1;\n\t\tfor (int i = 1; i <= N; i++) fact[i] = fact[i - 1] * i % MOD;\n\n\t\tinvfact[N] = modpow(fact[N], MOD - 2);\n\t\tfor (int i = N; i > 0; i--) invfact[i - 1] = invfact[i] * i % MOD;\n\n\t\tint t = (int)primes.size();\n\t\tvector<vector<ll>> dp(t + 1, vector<ll>(n + 1, 0));\n\t\tdp[t][0] = 1;\n\n\t\tfor (int i = t - 1; i >= 0; i--) {\n\t\t\t\tfor (int j = 0; j <= n; j++) {\n\t\t\t\t\t\tdp[i][j] = invfact[primes[i]] * dp[i + 1][j] % MOD;\n\t\t\t\t\t\tif (j > 0)\n\t\t\t\t\t\t\t\tdp[i][j] = (dp[i][j] + invfact[primes[i] - 1] * dp[i + 1][j - 1]) % MOD;\n\t\t\t\t}\n\t\t}\n\n\t\tll common = fact[n];\n\t\tfor (int c : nonprimes) common = common * invfact[c] % MOD;\n\n\t\tll ans = common * dp[0][n] % MOD;\n\t\tcout << ans << \"\\n\";\n}"
    },
    "order": 17
  },
  {
    "id": "1777D",
    "contestId": 1777,
    "index": "D",
    "title": "Score of a Tree",
    "rating": 1900,
    "url": "https://codeforces.com/problemset/problem/1777/D",
    "tags": [
      "bitmasks",
      "combinatorics",
      "dfs and similar",
      "dp",
      "math",
      "probabilities",
      "trees"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1777D+Score%20of%20a%20Tree+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nstatic const int MOD = 1e9 + 7;\n\nlong long modpow(long long a, long long b) {\n\t\tlong long r = 1;\n\t\twhile (b) {\n\t\t\t\tif (b & 1) r = (r * a) % MOD;\n\t\t\t\ta = (a * a) % MOD;\n\t\t\t\tb >>= 1;\n\t\t}\n\t\treturn r;\n}\n\nvector<vector<int>> g;\n\nlong long sumd;\n\nlong long dfs(int u, int p) {\n\t\tlong long mx = 1;\n\t\tfor (int v : g[u]) {\n\t\t\t\tif (v == p) continue; \n\t\t\t\tmx = max(mx, 1 + dfs(v, u)); \n\t\t}\n\t\tsumd = (sumd + mx) % MOD;\n\t\treturn mx;\n}\n\nint main() {\n\t\tios::sync_with_stdio(false);\n\t\tcin.tie(nullptr);\n\n\t\tint T;\n\t\tcin >> T;\n\t\twhile (T--) {\n\t\t\t\tint n;\n\t\t\t\tcin >> n;\n\n\t\t\t\tg.assign(n + 1, {});\n\t\t\t\tfor (int i = 0; i < n - 1; i++) {\n\t\t\t\t\t\tint u, v;\n\t\t\t\t\t\tcin >> u >> v;\n\t\t\t\t\t\tg[u].push_back(v);\n\t\t\t\t\t\tg[v].push_back(u);\n\t\t\t\t}\n\n\t\t\t\tsumd = 0;\n\t\t\t\tdfs(1, 0);\n\t\t\t\tlong long ans = modpow(2, n - 1) * sumd % MOD;\n\t\t\t\tcout << ans << \"\\n\";\n\t\t}\n\t\treturn 0;\n}"
    },
    "order": 18
  },
  {
    "id": "1759G",
    "contestId": 1759,
    "index": "G",
    "title": "Restore the Permutation",
    "rating": 1900,
    "url": "https://codeforces.com/problemset/problem/1759/G",
    "tags": [
      "binary search",
      "constructive algorithms",
      "data structures",
      "greedy",
      "math"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1759G+Restore%20the%20Permutation+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint n;\n\nvoid solve() {\n\t\tvector<int> b, p;\n\t\tvector<bool> isUsed;\n\t\tset<int> unused; \n\n\t\tcin >> n;\n\t\tb.assign(n / 2, 0);\n\t\tp.assign(n, 0);\n\t\tisUsed.assign(n + 1, false);\n\n\t\tfor (int i = 0; i < n / 2; i++) {\n\t\t\t\tcin >> b[i];\n\t\t\t\tp[i * 2 + 1] = b[i]; \n\t\t\t\tisUsed[b[i]] = true;\n\t\t}\n\n\t\tfor (int x = 1; x <= n; x++) {\n\t\t\t\tif (!isUsed[x]) unused.insert(x); \n\t\t}\n\n\t\tif ((int)unused.size() != n / 2) {\n\t\t\t\tcout << \"-1\\n\";\n\t\t\t\treturn;\n\t\t}\n\n\t\tfor (int i = n / 2 - 1; i >= 0; i--) {\n\t\t\t\tauto k = unused.upper_bound(p[2 * i + 1]); \n\t\t\t\tif (k == unused.begin()) { \n\t\t\t\t\t\tcout << \"-1\\n\";\n\t\t\t\t\t\treturn;\n\t\t\t\t}\n\t\t\t\t--k; \n\n\t\t\t\tif (*k < p[2 * i + 1]) {\n\t\t\t\t\t\tp[2 * i] = *k; \n\t\t\t\t\t\tunused.erase(k);\n\t\t\t\t} else {\n\t\t\t\t\t\tcout << \"-1\\n\";\n\t\t\t\t\t\treturn;\n\t\t\t\t}\n\t\t}\n\n\t\tfor (int v : p) cout << v << ' ';\n\t\tcout << '\\n';\n}\n\nint main() {\n\t\tios::sync_with_stdio(false);\n\t\tcin.tie(nullptr);\n\n\t\tint t;\n\t\tcin >> t;\n\t\twhile (t--) {\n\t\t\t\tsolve();\n\t\t}\n}"
    },
    "order": 19
  },
  {
    "id": "1747D",
    "contestId": 1747,
    "index": "D",
    "title": "Yet Another Problem",
    "rating": 1900,
    "url": "https://codeforces.com/problemset/problem/1747/D",
    "tags": [
      "binary search",
      "bitmasks",
      "constructive algorithms",
      "data structures"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1747D+Yet%20Another%20Problem+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n\t\tios::sync_with_stdio(false);\n\t\tcin.tie(nullptr);\n\n\t\tint n, q;\n\t\tcin >> n >> q;\n\n\t\tvector<int> a(n + 1), px(n + 1, 0), nz(n + 1, 0); \n\t\tfor (int i = 1; i <= n; i++) {\n\t\t\t\tcin >> a[i];\n\t\t\t\tpx[i] = px[i - 1] ^ a[i];\n\t\t\t\tnz[i] = nz[i - 1] + (a[i] != 0); \n\t\t}\n\n\t\tunordered_map<int, vector<int>> even, odd; \n\n\t\tfor (int i = 0; i <= n; i++) {\n\t\t\t\tif (i % 2 == 0)\n\t\t\t\t\t\teven[px[i]].push_back(i);\n\t\t\t\telse\n\t\t\t\t\t\todd[px[i]].push_back(i); \n\t\t}\n\n\t\twhile (q--) {\n\t\t\t\tint l, r;\n\t\t\t\tcin >> l >> r;\n\n\t\t\t\tif ((px[r] ^ px[l - 1]) != 0) {\n\t\t\t\t\t\tcout << -1 << '\\n';\n\t\t\t\t\t\tcontinue;\n\t\t\t\t}\n\n\t\t\t\tif (nz[r] - nz[l - 1] == 0) {\n\t\t\t\t\t\tcout << 0 << '\\n';\n\t\t\t\t\t\tcontinue;\n\t\t\t\t}\n\n\t\t\t\tint len = r - l + 1;\n\n\t\t\t\tif (len % 2 == 1) {\n\t\t\t\t\t\tcout << 1 << '\\n';\n\t\t\t\t\t\tcontinue;\n\t\t\t\t}\n\n\t\t\t\tif (a[l] == 0 || a[r] == 0) {\n\t\t\t\t\t\tcout << 1 << '\\n';\n\t\t\t\t\t\tcontinue;\n\t\t\t\t}\n\n\t\t\t\n\t\t\t\tauto& vec = (l % 2 == 0 ? even[px[l - 1]] : odd[px[l - 1]]);\n\t\t\t\tauto it = lower_bound(vec.begin(), vec.end(), l); \n\n\t\t\t\tif (it != vec.end() && *it <= r - 1)\n\t\t\t\t\t\tcout << 2 << '\\n';\n\t\t\t\telse\n\t\t\t\t\t\tcout << -1 << '\\n';\n\t\t}\n\n\t\treturn 0;\n}"
    },
    "order": 20
  },
  {
    "id": "1744E2",
    "contestId": 1744,
    "index": "E2",
    "title": "Divisible Numbers (hard version)",
    "rating": 1900,
    "url": "https://codeforces.com/problemset/problem/1744/E2",
    "tags": [
      "brute force",
      "math",
      "number theory"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1744E2+Divisible%20Numbers%20(hard%20version)+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nusing ll = long long;\n\nvoid solve() {\n\tll a, b, c, d;\n\tcin >> a >> b >> c >> d;\n\n\tvector<ll> fa, fb;\n\n\tfor (ll i = 1; i * i <= a; i++) {\n\t\tif (a % i == 0) {\n\t\t\tfa.push_back(i);\n\t\t\tif (i * i != a) fa.push_back(a / i);\n\t\t}\n\t}\n\n\tfor (ll i = 1; i * i <= b; i++) {\n\t\tif (b % i == 0) {\n\t\t\tfb.push_back(i);\n\t\t\tif (i * i != b) fb.push_back(b / i);\n\t\t}\n\t}\n\n\tfor (ll x1 : fa) {\n\t\tfor (ll y1 : fb) {\n\t\t\tll p = x1 * y1;\n\t\t\tll q = (a * b) / p;\n\n\t\t\tll x = a + 1;\n\t\t\tif (x % p) x += p - (x % p);\n\n\t\t\tll y = b + 1;\n\t\t\tif (y % q) y += q - (y % q);\n\n\t\t\tif (x <= c && y <= d) {\n\t\t\t\tcout << x << \" \" << y << \"\\n\";\n\t\t\t\treturn;\n\t\t\t}\n\t\t}\n\t}\n\n\tcout << \"-1 -1\\n\";\n}\n\nint main() {\n\tios::sync_with_stdio(false);\n\tcin.tie(nullptr);\n\n\tint t;\n\tcin >> t;\n\twhile (t--) solve();\n\n\treturn 0;\n}"
    },
    "order": 21
  },
  {
    "id": "1739D",
    "contestId": 1739,
    "index": "D",
    "title": "Reset K Edges",
    "rating": 1900,
    "url": "https://codeforces.com/problemset/problem/1739/D",
    "tags": [
      "binary search",
      "data structures",
      "dfs and similar",
      "graphs",
      "greedy",
      "trees"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1739D+Reset%20K%20Edges+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nconst int N = 200005;\n\nvector<int> g[N];\nint parent[N], depth[N];\nbool used[N];\nint n, k;\n\nvoid dfs_mark(int u) {\n\tused[u] = true;\n\tfor (int v : g[u]) {\n\t\tif (!used[v]) dfs_mark(v);\n\t}\n}\n\nbool check(int H, vector<int>& order) {\n\tfill(used + 1, used + n + 1, false);\n\n\tint cuts = 0;\n\n\tfor (int u : order) {\n\t\tif (depth[u] <= H) break;\n\t\tif (used[u]) continue;\n\n\t\tint v = u;\n\t\tfor (int i = 0; i < H - 1; i++) v = parent[v];\n\n\t\tdfs_mark(v);\n\t\tcuts++;\n\n\t\tif (cuts > k) return false;\n\t}\n\n\treturn true;\n}\n\nint main() {\n\tios::sync_with_stdio(false);\n\tcin.tie(nullptr);\n\n\tint t;\n\tcin >> t;\n\n\twhile (t--) {\n\t\tcin >> n >> k;\n\n\t\tfor (int i = 1; i <= n; i++) g[i].clear();\n\n\t\tparent[1] = 0;\n\t\tfor (int i = 2; i <= n; i++) {\n\t\t\tcin >> parent[i];\n\t\t\tg[parent[i]].push_back(i);\n\t\t}\n\n\t\tqueue<int> q;\n\t\tq.push(1);\n\t\tdepth[1] = 0;\n\t\twhile (!q.empty()) {\n\t\t\tint u = q.front();\n\t\t\tq.pop();\n\t\t\tfor (int v : g[u]) {\n\t\t\t\tdepth[v] = depth[u] + 1;\n\t\t\t\tq.push(v);\n\t\t\t}\n\t\t}\n\n\t\tvector<int> order(n);\n\t\tiota(order.begin(), order.end(), 1);\n\t\tsort(order.begin(), order.end(), [&](int a, int b) {\n\t\t\treturn depth[a] > depth[b];\n\t\t});\n\n\t\tint low = 1, high = n, ans = n;\n\t\twhile (low <= high) {\n\t\t\tint mid = (low + high) / 2;\n\t\t\tif (check(mid, order)) {\n\t\t\t\tans = mid;\n\t\t\t\thigh = mid - 1;\n\t\t\t} else {\n\t\t\t\tlow = mid + 1;\n\t\t\t}\n\t\t}\n\n\t\tcout << ans << '\\n';\n\t}\n\n\treturn 0;\n}"
    },
    "order": 22
  },
  {
    "id": "2036F",
    "contestId": 2036,
    "index": "F",
    "title": "XORificator 3000",
    "rating": 1900,
    "url": "https://codeforces.com/problemset/problem/2036/F",
    "tags": [
      "bitmasks",
      "dp",
      "number theory",
      "two pointers"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+2036F+XORificator%203000+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nusing ll = long long;\n\nll gcd(ll a, ll b) {\n\twhile (b != 0) {\n\t\tll temp = b;\n\t\tb = a % b;\n\t\ta = temp;\n\t}\n\treturn a;\n}\n\nll lcm(ll a, ll b) {\n\treturn (a / gcd(a, b)) * b;\n}\n\nll power(ll a, ll b) {\n\tll result = 1;\n\twhile (b > 0) {\n\t\tif (b % 2 == 1) {\n\t\t\tresult *= a;\n\t\t}\n\t\ta *= a;\n\t\tb /= 2;\n\t}\n\treturn result;\n}\n\nll xorUpTo(ll n) {\n\tif (n % 4 == 0) return n;\n\tif (n % 4 == 1) return 1;\n\tif (n % 4 == 2) return n + 1;\n\treturn 0;\n}\n\nll calculateXorWithMask(ll n, ll bitIndex, ll mask) {\n\tif (n <= 0) return 0;\n\n\tll result = xorUpTo(n);\n\tll reducedNumber = n >> bitIndex;\n\n\tif (n % (1LL << bitIndex) < mask) {\n\t\treducedNumber--;\n\t}\n\n\tll maskedXor = xorUpTo(reducedNumber) << bitIndex;\n\tif (reducedNumber % 2 == 0) {\n\t\tmaskedXor ^= mask;\n\t}\n\n\tresult ^= maskedXor;\n\treturn result;\n}\n\nint main() {\n\tll testCases;\n\tcin >> testCases;\n\twhile (testCases--) {\n\t\tll left, right, bitIndex, mask;\n\t\tcin >> left >> right >> bitIndex >> mask;\n\n\t\tll result = calculateXorWithMask(right, bitIndex, mask) ^ calculateXorWithMask(left - 1, bitIndex, mask);\n\t\tcout << result << endl;\n\t}\n}"
    },
    "order": 23
  },
  {
    "id": "1715D",
    "contestId": 1715,
    "index": "D",
    "title": "2+ doors",
    "rating": 1900,
    "url": "https://codeforces.com/problemset/problem/1715/D",
    "tags": [
      "2-sat",
      "bitmasks",
      "graphs",
      "greedy"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1715D+2%2B%20doors+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n\t\tios::sync_with_stdio(false);\n\t\tcin.tie(nullptr);\n\n\t\tint n, q;\n\t\tcin >> n >> q;\n\n\t\tvector<vector<pair<int, int>>> g(n);\n\t\tvector<int> forced(n, -1);\n\n\t\tfor (int idx = 0; idx < q; ++idx) {\n\t\t\tint u, v, x;\n\t\t\tcin >> u >> v >> x;\n\t\t\t--u;\n\t\t\t--v;\n\n\t\t\tif (u == v) {\n\t\t\t\tforced[u] = x;\n\t\t\t} else {\n\t\t\t\tg[u].push_back({v, x});\n\t\t\t\tg[v].push_back({u, x});\n\t\t\t}\n\t\t}\n\n\t\tvector<int> a(n, 0);\n\n\t\tfor (int b = 0; b < 30; ++b) {\n\t\t\tvector<int> val(n, 1);\n\n\t\t\tfor (int i = 0; i < n; ++i) {\n\t\t\t\tif (forced[i] != -1) val[i] = (forced[i] >> b) & 1;\n\t\t\t}\n\n\t\t\tfor (int i = 0; i < n; ++i) {\n\t\t\t\tfor (auto [j, x] : g[i]) {\n\t\t\t\t\tif (((x >> b) & 1) == 0) val[i] = 0;\n\t\t\t\t}\n\t\t\t}\n\n\t\t\tfor (int i = 0; i < n; ++i) {\n\t\t\t\tif (val[i] == 0 || forced[i] != -1) continue;\n\n\t\t\t\tbool mustKeepOne = false;\n\t\t\t\tfor (auto [j, x] : g[i]) {\n\t\t\t\t\tif (((x >> b) & 1) && val[j] == 0) {\n\t\t\t\t\t\tmustKeepOne = true;\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\tif (!mustKeepOne) val[i] = 0;\n\t\t\t}\n\n\t\t\tfor (int i = 0; i < n; ++i) {\n\t\t\t\tif (val[i]) a[i] |= (1 << b);\n\t\t\t}\n\t\t}\n\n\t\tfor (int i = 0; i < n; ++i) {\n\t\t\tcout << a[i] << (i + 1 == n ? '\\n' : ' ');\n\t\t}\n}"
    },
    "order": 24
  },
  {
    "id": "1700D",
    "contestId": 1700,
    "index": "D",
    "title": "River Locks",
    "rating": 1900,
    "url": "https://codeforces.com/problemset/problem/1700/D",
    "tags": [
      "binary search",
      "dp",
      "greedy",
      "math"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1700D+River%20Locks+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n\t\tlong long n, x, q, sum = 0, maxi = 0;\n\t\tcin >> n;\n\t\tfor (int i = 1; i <= n; i++) {\n\t\t\t\tcin >> x;\n\t\t\t\tsum += x;\n\t\t\t\tmaxi = max(maxi, (sum + i - 1) / i);\n\t\t}\n\n\t\tcin >> q;\n\t\twhile (q--) {\n\t\t\t\tcin >> x;\n\t\t\t\tif (x < maxi) {\n\t\t\t\t\t\tcout << -1 << \"\\n\";\n\t\t\t\t} else {\n\t\t\t\t\t\tcout << (sum + x - 1) / x << \"\\n\";\n\t\t\t\t}\n\t\t}\n\n\t\treturn 0;\n}"
    },
    "order": 25
  },
  {
    "id": "2014H",
    "contestId": 2014,
    "index": "H",
    "title": "Robin Hood Archery",
    "rating": 1900,
    "url": "https://codeforces.com/problemset/problem/2014/H",
    "tags": [
      "data structures",
      "divide and conquer",
      "greedy",
      "hashing"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+2014H+Robin%20Hood%20Archery+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nlong long getRandomUpto1e16() {\n\tstatic std::mt19937_64 rng(std::random_device{}());\n\tstatic std::uniform_int_distribution<long long> dist(0, 10000000000000000LL);\n\treturn dist(rng);\n}\n\nint main() {\n\tlong long testCases;\n\tcin >> testCases;\n\tmap<long long, long long> precomputedHashes;\n\tfor (long long i = 1; i <= 1e6; ++i) {\n\t\tprecomputedHashes[i] = getRandomUpto1e16();\n\t}\n\n\twhile (testCases--) {\n\t\tlong long arraySize, queries;\n\t\tcin >> arraySize >> queries; \n\n\t\tvector<long long> elements(arraySize);\n\t\tfor (long long &element : elements) {\n\t\t\tcin >> element;\n\t\t}\n\n\t\tvector<long long> hashValues(arraySize);\n\t\tfor (long long i = 0; i < arraySize; ++i) {\n\t\t\thashValues[i] = precomputedHashes[elements[i]];\n\t\t}\n\n\t\tvector<long long> prefixXor(arraySize + 1, 0);\n\t\tprefixXor[1] = hashValues[0];\n\t\tfor (long long i = 2; i <= arraySize; ++i) {\n\t\t\tprefixXor[i] = prefixXor[i - 1] ^ hashValues[i - 1];\n\t\t}\n\n\t\tfor (long long i = 0; i < queries; ++i) {\n\t\t\tlong long left, right;\n\t\t\tcin >> left >> right; \n\t\t\t--left; \n\n\t\t\tlong long xorResult = prefixXor[right] ^ prefixXor[left];\n\t\t\tcout << (xorResult == 0 ? \"YES\" : \"NO\") << endl;\n\t\t}\n\t}\n}"
    },
    "order": 26
  },
  {
    "id": "2009G1",
    "contestId": 2009,
    "index": "G1",
    "title": "Yunli's Subarray Queries (easy version)",
    "rating": 1900,
    "url": "https://codeforces.com/problemset/problem/2009/G1",
    "tags": [
      "binary search",
      "data structures",
      "two pointers"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+2009G1+Yunli's%20Subarray%20Queries%20(easy%20version)+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\n\nusing Long = long long;\nusing LongPair = pair<Long, Long>;\n\nLong gcd(Long a, Long b) {\n\twhile (b != 0) {\n\t\tLong temp = b;\n\t\tb = a % b;\n\t\ta = temp;\n\t}\n\treturn a;\n}\n\nLong lcm(Long a, Long b) {\n\treturn (a / gcd(a, b)) * b;\n}\n\nLong power(Long a, Long b) {\n\tLong result = 1;\n\twhile (b > 0) {\n\t\tif (b % 2 == 1) {\n\t\t\tresult *= a;\n\t\t}\n\t\ta *= a;\n\t\tb /= 2;\n\t}\n\treturn result;\n}\n\nint main() {\n\tLong testCases;\n\tcin >> testCases;\n\n\twhile (testCases--) {\n\t\tLong n, k, q;\n\t\tcin >> n >> k >> q;\n\t\tvector<Long> array(n);\n\n\t\tfor (Long& value : array) {\n\t\t\tcin >> value;\n\t\t}\n\n\t\tfor (Long i = 0; i < n; ++i) {\n\t\t\tarray[i] -= i;\n\t\t}\n\n\t\tvector<LongPair> results;\n\t\tmap<Long, Long> frequencyMap;\n\t\tLongPair maxFrequency = {0, 0};\n\n\t\tfor (Long i = 0; i < k; ++i) {\n\t\t\tfrequencyMap[array[i]]++;\n\t\t}\n\n\t\tfor (const auto& entry : frequencyMap) {\n\t\t\tif (entry.second > maxFrequency.first) {\n\t\t\t\tmaxFrequency = {entry.second, entry.first};\n\t\t\t}\n\t\t}\n\n\t\tresults.emplace_back(k - maxFrequency.first, maxFrequency.second);\n\n\t\tfor (Long i = k; i < n; ++i) {\n\t\t\tfrequencyMap[array[i - k]]--;\n\t\t\tif (frequencyMap[array[i - k]] == 0) {\n\t\t\t\tfrequencyMap.erase(array[i - k]);\n\t\t\t}\n\t\t\tfrequencyMap[array[i]]++;\n\t\t\tif (maxFrequency.second == array[i - k]) {\n\t\t\t\tmaxFrequency = {0, 0};\n\t\t\t\tfor (const auto& entry : frequencyMap) {\n\t\t\t\t\tif (entry.second > maxFrequency.first) {\n\t\t\t\t\t\tmaxFrequency = {entry.second, entry.first};\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t} else if (maxFrequency.first < frequencyMap[array[i]]) {\n\t\t\t\tmaxFrequency = {frequencyMap[array[i]], array[i]};\n\t\t\t}\n\n\t\t\tresults.emplace_back(k - maxFrequency.first, maxFrequency.second);\n\t\t}\n\n\t\tfor (Long i = 0; i < q; ++i) {\n\t\t\tLong left, right;\n\t\t\tcin >> left >> right;\n\t\t\tcout << results[left - 1].first << endl;\n\t\t}\n\t}\n}"
    },
    "order": 27
  },
  {
    "id": "2001D",
    "contestId": 2001,
    "index": "D",
    "title": "Longest Max Min Subsequence",
    "rating": 1900,
    "url": "https://codeforces.com/problemset/problem/2001/D",
    "tags": [
      "brute force",
      "constructive algorithms",
      "data structures",
      "greedy",
      "implementation"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+2001D+Longest%20Max%20Min%20Subsequence+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nstruct SegmentTreeNode {\n\tint minVal; \n\tint maxVal; \n};\n\n\nclass SegmentTree {\n\tvector<SegmentTreeNode> tree; \n\tvector<int>& elements; \n\tmap<int, bool>& visited; \n\tint size; \n\npublic:\n\tSegmentTree(vector<int>& arr, map<int, bool>& visitedMap) : elements(arr), visited(visitedMap) {\n\t\tsize = elements.size();\n\t\ttree.resize(4 * size); \n\t\tbuild(1, 0, size - 1); \n\t}\n\n\tvoid build(int node, int start, int end) {\n\t\tif (start == end) {\n\t\t\tif (!visited[elements[start]]) {\n\t\t\t\ttree[node] = {elements[start], elements[start]};\n\t\t\t} else {\n\t\t\t\ttree[node] = {INT_MAX, INT_MIN};\n\t\t\t}\n\t\t\treturn;\n\t\t}\n\t\tint mid = (start + end) / 2;\n\t\tbuild(2 * node, start, mid); \n\t\tbuild(2 * node + 1, mid + 1, end); \n\t\ttree[node].minVal = min(tree[2 * node].minVal, tree[2 * node + 1].minVal);\n\t\ttree[node].maxVal = max(tree[2 * node].maxVal, tree[2 * node + 1].maxVal); \n\t}\n\n\tSegmentTreeNode query(int node, int start, int end, int left, int right) {\n\t\tif (right < start || left > end) return {INT_MAX, INT_MIN}; \n\t\tif (left <= start && end <= right) return tree[node];\n\n\t\tint mid = (start + end) / 2;\n\t\tSegmentTreeNode leftQuery = query(2 * node, start, mid, left, right); \n\t\tSegmentTreeNode rightQuery = query(2 * node + 1, mid + 1, end, left, right); \n\t\treturn {\n\t\t\tmin(leftQuery.minVal, rightQuery.minVal),\n\t\t\tmax(leftQuery.maxVal, rightQuery.maxVal)\n\t\t};\n\t}\n\n\tSegmentTreeNode rangeQuery(int left, int right) {\n\t\treturn query(1, 0, size - 1, left, right);\n\t}\n\n\tvoid update(int node, int start, int end, int pos) {\n\t\tif (start == end) {\n\t\t\tif (!visited[elements[pos]]) {\n\t\t\t\ttree[node] = {elements[pos], elements[pos]};\n\t\t\t} else {\n\t\t\t\ttree[node] = {INT_MAX, INT_MIN};\n\t\t\t}\n\t\t\treturn;\n\t\t}\n\n\t\tint mid = (start + end) / 2;\n\t\tif (pos <= mid)\n\t\t\tupdate(2 * node, start, mid, pos);\n\t\telse\n\t\t\tupdate(2 * node + 1, mid + 1, end, pos); \n\n\t\ttree[node].minVal = min(tree[2 * node].minVal, tree[2 * node + 1].minVal); \n\t\ttree[node].maxVal = max(tree[2 * node].maxVal, tree[2 * node + 1].maxVal); \n\t}\n\n\tvoid updatePosition(int pos) {\n\t\tupdate(1, 0, size - 1, pos);\n\t}\n};\n\nint main() {\n\tint testCases;\n\tcin >> testCases;\n\twhile (testCases--) {\n\t\tint numElements;\n\t\tcin >> numElements; \n\t\tvector<int> elements(numElements);\n\t\tfor (int i = 0; i < numElements; i++) cin >> elements[i]; \n\n\t\tmap<int, int> indexMap;\n\t\tfor (int i = 0; i < numElements; i++) indexMap[elements[i]] = i; \n\n\t\tset<int> indices;\n\t\tfor (auto& element : indexMap) indices.insert(element.second); \n\n\t\tmap<int, int> visited;\n\t\tint lastUsedIndex = -1;\n\t\tint previous = 0;\n\t\tvector<int> result; \n\n\t\tpriority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> minHeap;\n\t\tpriority_queue<pair<int, int>> maxHeap;\n\n\t\twhile (!indices.empty()) {\n\t\t\tint currentIndex = *indices.begin();\n\t\t\tfor (int i = previous; i <= currentIndex; i++) {\n\t\t\t\tif (visited[elements[i]] == 0 && i > lastUsedIndex) {\n\t\t\t\t\tminHeap.push({elements[i], i}); \n\t\t\t\t\tmaxHeap.push({elements[i], numElements - i}); \n\t\t\t\t}\n\t\t\t}\n\n\t\t\tif (result.size() % 2 == 0) {\n\t\t\t\twhile (!maxHeap.empty() && (visited[maxHeap.top().first] || numElements - maxHeap.top().second <= lastUsedIndex)) \n\t\t\t\t\tmaxHeap.pop();\n\t\t\t\tint maxElement = maxHeap.top().first;\n\t\t\t\tlastUsedIndex = numElements - maxHeap.top().second;\n\t\t\t\tresult.push_back(maxElement);\n\t\t\t\tvisited[maxElement] = 1;\n\t\t\t\tindices.erase(indexMap[maxElement]);\n\t\t\t\tmaxHeap.pop();\n\t\t\t} else {\n\t\t\t\twhile (!minHeap.empty() && (visited[minHeap.top().first] || minHeap.top().second <= lastUsedIndex)) \n\t\t\t\t\tminHeap.pop();\n\t\t\t\tint minElement = minHeap.top().first;\n\t\t\t\tlastUsedIndex = minHeap.top().second;\n\t\t\t\tresult.push_back(minElement);\n\t\t\t\tvisited[minElement] = 1;\n\t\t\t\tindices.erase(indexMap[minElement]);\n\t\t\t\tminHeap.pop();\n\t\t\t}\n\n\t\t\tprevious = currentIndex + 1;\n\t\t}\n\n\t\tcout << result.size() << endl;\n\t\tfor (const int& element : result) cout << element << \" \"; \n\t\tcout << endl;\n\t}\n}"
    },
    "order": 28
  },
  {
    "id": "731E",
    "contestId": 731,
    "index": "E",
    "title": "Funny Game",
    "rating": 1900,
    "url": "https://codeforces.com/problemset/problem/731/E",
    "tags": [
      "dp",
      "games"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+731E+Funny%20Game+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\n\nint findGCD(int a, int b) {\n\twhile (b != 0) {\n\t\tint temp = b;\n\t\tb = a % b;\n\t\ta = temp;\n\t}\n\treturn a;\n}\n\nint findLCM(int a, int b) {\n\treturn (a / findGCD(a, b)) * b;\n}\n\nint calculatePower(int base, int exponent) {\n\tint result = 1;\n\twhile (exponent > 0) {\n\t\tif (exponent % 2 == 1) {\n\t\t\tresult *= base;\n\t\t}\n\t\tbase *= base;\n\t\texponent /= 2;\n\t}\n\treturn result;\n}\n\nint main() {\n\tint testCases;\n\tstd::cin >> testCases;\n\n\twhile (testCases--) {\n\t\tint arraySize;\n\t\tstd::cin >> arraySize;\n\n\t\tstd::vector<int> array(arraySize);\n\t\tfor (int& element : array) std::cin >> element;\n\n\t\tstd::vector<int> positions(arraySize);\n\t\tstd::iota(positions.begin(), positions.end(), 0);\n\n\t\tstd::vector<std::pair<int, int>> pairs;\n\n\t\tfor (int i = arraySize - 1; i >= 1; --i) {\n\t\t\tstd::vector<int> remainder(i, -1);\n\n\t\t\tfor (int index : positions) {\n\t\t\t\tint currentRemainder = array[index] % i;\n\n\t\t\t\tif (remainder[currentRemainder] != -1) {\n\t\t\t\t\tpairs.emplace_back(index, remainder[currentRemainder]);\n\t\t\t\t\tpositions.erase(std::find(positions.begin(), positions.end(), index));\n\t\t\t\t\tbreak;\n\t\t\t\t}\n\n\t\t\t\tremainder[currentRemainder] = index;\n\t\t\t}\n\t\t}\n\n\t\tstd::reverse(pairs.begin(), pairs.end());\n\t\tstd::cout << \"YES\" << std::endl;\n\n\t\tfor (const auto& pair : pairs) {\n\t\t\tstd::cout << pair.first + 1 << \" \" << pair.second + 1 << std::endl;\n\t\t}\n\t}\n\n\treturn 0;\n}"
    },
    "order": 29
  },
  {
    "id": "1992F",
    "contestId": 1992,
    "index": "F",
    "title": "Valuable Cards",
    "rating": 1900,
    "url": "https://codeforces.com/problemset/problem/1992/F",
    "tags": [
      "brute force",
      "dp",
      "greedy",
      "number theory",
      "two pointers"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1992F+Valuable%20Cards+editorial",
    "solutionCode": {
      "cpp": "#include<bits/stdc++.h>\n\nusing namespace std;\n\nusing Long = long long;\n\nLong gcd(Long a, Long b) {\n\twhile (b != 0) {\n\t\tLong temp = b;\n\t\tb = a % b;\n\t\ta = temp;\n\t}\n\treturn a;\n}\n\nLong lcm(Long a, Long b) {\n\treturn (a / gcd(a, b)) * b;\n}\n\nLong power(Long base, Long exponent) {\n\tLong result = 1;\n\twhile (exponent > 0) {\n\t\tif (exponent % 2 == 1) {\n\t\t\tresult *= base;\n\t\t}\n\t\tbase *= base;\n\t\texponent /= 2;\n\t}\n\treturn result;\n}\n\nvector<Long> findFactors(Long x) {\n\tvector<Long> factors;\n\tfor (Long i = 1; i * i <= x; i++) {\n\t\tif (x % i == 0) {\n\t\t\tfactors.push_back(i);\n\t\t\tif (i != x / i) {\n\t\t\t\tfactors.push_back(x / i);\n\t\t\t}\n\t\t}\n\t}\n\tsort(factors.begin(), factors.end());\n\treturn factors;\n}\n\nint main() {\n\tLong testCases;\n\tcin >> testCases;\n\n\twhile (testCases--) {\n\t\tLong n, x;\n\t\tcin >> n >> x;\n\n\t\tvector<Long> array(n);\n\t\tfor (Long i = 0; i < n; i++) {\n\t\t\tcin >> array[i];\n\t\t}\n\n\t\tvector<Long> factors = findFactors(x);\n\t\tLong result = 1;\n\t\tLong numFactors = factors.size();\n\t\tvector<bool> isProductPossible(numFactors, false);\n\t\tisProductPossible[0] = true;\n\n\t\tfor (Long num : array) {\n\t\t\tif (x % num != 0) {\n\t\t\t\tcontinue;\n\t\t\t}\n\t\t\tfor (Long j = numFactors - 1; j >= 0; j--) {\n\t\t\t\tif (isProductPossible[j]) {\n\t\t\t\t\tLong product = num * factors[j];\n\t\t\t\t\tif (x % product == 0) {\n\t\t\t\t\t\tLong index = lower_bound(factors.begin(), factors.end(), product) - factors.begin();\n\t\t\t\t\t\tisProductPossible[index] = true;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t\tif (isProductPossible[numFactors - 1]) {\n\t\t\t\tisProductPossible.assign(numFactors, false);\n\t\t\t\tisProductPossible[0] = true;\n\t\t\t\tLong index = lower_bound(factors.begin(), factors.end(), num) - factors.begin();\n\t\t\t\tisProductPossible[index] = true;\n\t\t\t\tresult++;\n\t\t\t}\n\t\t}\n\t\tcout << result << endl;\n\t}\n}"
    },
    "order": 30
  },
  {
    "id": "1986F",
    "contestId": 1986,
    "index": "F",
    "title": "Non-academic Problem",
    "rating": 1900,
    "url": "https://codeforces.com/problemset/problem/1986/F",
    "tags": [
      "dfs and similar",
      "graphs",
      "trees"
    ],
    "hint": "Represent the input as an adjacency list. Use BFS/DFS traversal to discover reachable components, compute shortest hops in unweighted graphs, or detect bipartite coloring.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1986F+Non-academic%20Problem+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\n#define int long long\n\nusing vi = vector<int>;\nusing vvi = vector<vector<int>>;\n\n#define FAST_IO ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);\n\nvoid solve() {\n    int n, m;\n    cin >> n >> m;\n\n    vvi adj(n + 1);\n    for (int i = 0; i < m; i++) {\n        int u, v;\n        cin >> u >> v;\n        adj[u].push_back(v);\n        adj[v].push_back(u);\n    }\n\n    vi subtreeSize(n + 1, 1);\n    vi visited(n + 1, 0);\n\n    function<void(int)> dfsSubtree = [&](int node) {\n        visited[node] = 1;\n        for (auto neighbor : adj[node]) {\n            if (!visited[neighbor]) {\n                dfsSubtree(neighbor);\n                subtreeSize[node] += subtreeSize[neighbor];\n            }\n        }\n    };\n    dfsSubtree(1);\n\n    int maxBridgeContribution = 0;\n    int timer = 1;\n    vi discoveryTime(n + 1, 0);\n    vi lowTime(n + 1, 2e9);\n\n    function<void(int, int)> tarjanDFS = [&](int node, int parent) {\n        discoveryTime[node] = timer;\n        lowTime[node] = timer;\n        timer++;\n\n        for (auto neighbor : adj[node]) {\n            if (discoveryTime[neighbor] == 0) {\n                tarjanDFS(neighbor, node);\n                lowTime[node] = min(lowTime[node], lowTime[neighbor]);\n\n                if (lowTime[neighbor] > discoveryTime[node]) {\n                    maxBridgeContribution = max(maxBridgeContribution,\n                                                subtreeSize[neighbor] * (n - subtreeSize[neighbor]));\n                }\n            } else if (neighbor != parent) { \n                lowTime[node] = min(lowTime[node], discoveryTime[neighbor]);\n            }\n        }\n    };\n    tarjanDFS(1, 0);\n\n    cout << (n * (n - 1)) / 2 - maxBridgeContribution << '\\n';\n}\n\nsigned main() {\n    FAST_IO\n    int testCases;\n    cin >> testCases;\n    while (testCases--) solve();\n    return 0;\n}"
    },
    "order": 31
  },
  {
    "id": "1620E",
    "contestId": 1620,
    "index": "E",
    "title": "Replace the Numbers",
    "rating": 1900,
    "url": "https://codeforces.com/problemset/problem/1620/E",
    "tags": [
      "constructive algorithms",
      "data structures",
      "dsu",
      "implementation"
    ],
    "hint": "Speed up operations from O(N) to O(log N) using appropriate containers like std::set, std::map, or a Fenwick/Segment Tree for dynamic range queries and updates.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1620E+Replace%20the%20Numbers+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 32
  },
  {
    "id": "1627D",
    "contestId": 1627,
    "index": "D",
    "title": "Not Adding",
    "rating": 1900,
    "url": "https://codeforces.com/problemset/problem/1627/D",
    "tags": [
      "brute force",
      "dp",
      "math",
      "number theory"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1627D+Not%20Adding+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    vector<long long> dp(n + 1, 0);\n    for (int i = 0; i < n; i++) {\n        dp[i + 1] = max(dp[i], dp[i] + a[i]);\n    }\n    cout << dp[n] << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 33
  },
  {
    "id": "1527B2",
    "contestId": 1527,
    "index": "B2",
    "title": "Palindrome Game (hard version)",
    "rating": 1900,
    "url": "https://codeforces.com/problemset/problem/1527/B2",
    "tags": [
      "constructive algorithms",
      "games"
    ],
    "hint": "Build a pattern step by step. Look at small examples (n=1, 2, 3) to uncover an invariant or periodic pattern that generalizes to any valid input.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1527B2+Palindrome%20Game%20(hard%20version)+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 34
  },
  {
    "id": "1977C",
    "contestId": 1977,
    "index": "C",
    "title": "Nikita and LCM",
    "rating": 1900,
    "url": "https://codeforces.com/problemset/problem/1977/C",
    "tags": [
      "brute force",
      "data structures",
      "dp",
      "greedy",
      "math",
      "number theory",
      "sortings"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1977C+Nikita%20and%20LCM+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    vector<long long> dp(n + 1, 0);\n    for (int i = 0; i < n; i++) {\n        dp[i + 1] = max(dp[i], dp[i] + a[i]);\n    }\n    cout << dp[n] << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 35
  },
  {
    "id": "1854A2",
    "contestId": 1854,
    "index": "A2",
    "title": "Dual (Hard Version)",
    "rating": 1900,
    "url": "https://codeforces.com/problemset/problem/1854/A2",
    "tags": [
      "constructive algorithms",
      "math"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1854A2+Dual%20(Hard%20Version)+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 36
  },
  {
    "id": "1991D",
    "contestId": 1991,
    "index": "D",
    "title": "Prime XOR Coloring",
    "rating": 1900,
    "url": "https://codeforces.com/problemset/problem/1991/D",
    "tags": [
      "bitmasks",
      "constructive algorithms",
      "graphs",
      "greedy",
      "math",
      "number theory"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1991D+Prime%20XOR%20Coloring+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 37
  },
  {
    "id": "1624G",
    "contestId": 1624,
    "index": "G",
    "title": "MinOr Tree",
    "rating": 1900,
    "url": "https://codeforces.com/problemset/problem/1624/G",
    "tags": [
      "bitmasks",
      "dfs and similar",
      "dsu",
      "graphs",
      "greedy"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1624G+MinOr%20Tree+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 38
  },
  {
    "id": "2133D",
    "contestId": 2133,
    "index": "D",
    "title": "Chicken Jockey",
    "rating": 1900,
    "url": "https://codeforces.com/problemset/problem/2133/D",
    "tags": [
      "dp",
      "greedy"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+2133D+Chicken%20Jockey+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    vector<long long> dp(n + 1, 0);\n    for (int i = 0; i < n; i++) {\n        dp[i + 1] = max(dp[i], dp[i] + a[i]);\n    }\n    cout << dp[n] << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 39
  },
  {
    "id": "1994D",
    "contestId": 1994,
    "index": "D",
    "title": "Funny Game",
    "rating": 1900,
    "url": "https://codeforces.com/problemset/problem/1994/D",
    "tags": [
      "constructive algorithms",
      "dsu",
      "graphs",
      "greedy",
      "math",
      "number theory",
      "trees"
    ],
    "hint": "Examine the local optimal decision. Usually sorting by end time, cost, or ratio guarantees that making the locally best choice never prevents a globally optimal solution.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1994D+Funny%20Game+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 40
  },
  {
    "id": "2013D",
    "contestId": 2013,
    "index": "D",
    "title": "Minimize the Difference",
    "rating": 1900,
    "url": "https://codeforces.com/problemset/problem/2013/D",
    "tags": [
      "binary search",
      "greedy"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+2013D+Minimize%20the%20Difference+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nbool check(long long mid, const vector<long long>& a, int n, long long k) {\n    long long count = 0;\n    for (int i = 0; i < n; i++) {\n        count += mid / a[i];\n    }\n    return count >= k;\n}\n\nvoid solve() {\n    int n;\n    long long k;\n    if (!(cin >> n >> k)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    long long low = 1, high = 1e18, ans = high;\n    while (low <= high) {\n        long long mid = low + (high - low) / 2;\n        if (check(mid, a, n, k)) {\n            ans = mid;\n            high = mid - 1;\n        } else {\n            low = mid + 1;\n        }\n    }\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 41
  },
  {
    "id": "1656D",
    "contestId": 1656,
    "index": "D",
    "title": "K-good",
    "rating": 1900,
    "url": "https://codeforces.com/problemset/problem/1656/D",
    "tags": [
      "constructive algorithms",
      "math",
      "number theory"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1656D+K-good+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 42
  },
  {
    "id": "1547F",
    "contestId": 1547,
    "index": "F",
    "title": "Array Stabilization (GCD version)",
    "rating": 1900,
    "url": "https://codeforces.com/problemset/problem/1547/F",
    "tags": [
      "binary search",
      "brute force",
      "data structures",
      "divide and conquer",
      "number theory",
      "two pointers"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1547F+Array%20Stabilization%20(GCD%20version)+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nbool check(long long mid, const vector<long long>& a, int n, long long k) {\n    long long count = 0;\n    for (int i = 0; i < n; i++) {\n        count += mid / a[i];\n    }\n    return count >= k;\n}\n\nvoid solve() {\n    int n;\n    long long k;\n    if (!(cin >> n >> k)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    long long low = 1, high = 1e18, ans = high;\n    while (low <= high) {\n        long long mid = low + (high - low) / 2;\n        if (check(mid, a, n, k)) {\n            ans = mid;\n            high = mid - 1;\n        } else {\n            low = mid + 1;\n        }\n    }\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 43
  },
  {
    "id": "1989D",
    "contestId": 1989,
    "index": "D",
    "title": "Smithing Skill",
    "rating": 1900,
    "url": "https://codeforces.com/problemset/problem/1989/D",
    "tags": [
      "brute force",
      "data structures",
      "dp",
      "greedy",
      "math",
      "sortings",
      "two pointers"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1989D+Smithing%20Skill+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    vector<long long> dp(n + 1, 0);\n    for (int i = 0; i < n; i++) {\n        dp[i + 1] = max(dp[i], dp[i] + a[i]);\n    }\n    cout << dp[n] << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 44
  },
  {
    "id": "2000F",
    "contestId": 2000,
    "index": "F",
    "title": "Color Rows and Columns",
    "rating": 1900,
    "url": "https://codeforces.com/problemset/problem/2000/F",
    "tags": [
      "dp",
      "greedy",
      "implementation",
      "math"
    ],
    "hint": "Formulate the dynamic programming state dp[i] representing the optimal answer for prefix i. Identify which previous states are reachable and initialize your base cases carefully.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+2000F+Color%20Rows%20and%20Columns+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    vector<long long> dp(n + 1, 0);\n    for (int i = 0; i < n; i++) {\n        dp[i + 1] = max(dp[i], dp[i] + a[i]);\n    }\n    cout << dp[n] << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 45
  },
  {
    "id": "1895D",
    "contestId": 1895,
    "index": "D",
    "title": "XOR Construction",
    "rating": 1900,
    "url": "https://codeforces.com/problemset/problem/1895/D",
    "tags": [
      "bitmasks",
      "constructive algorithms",
      "data structures",
      "math",
      "string suffix structures",
      "trees"
    ],
    "hint": "Speed up operations from O(N) to O(log N) using appropriate containers like std::set, std::map, or a Fenwick/Segment Tree for dynamic range queries and updates.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1895D+XOR%20Construction+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 46
  },
  {
    "id": "1998C",
    "contestId": 1998,
    "index": "C",
    "title": "Perform Operations to Maximize Score",
    "rating": 1900,
    "url": "https://codeforces.com/problemset/problem/1998/C",
    "tags": [
      "binary search",
      "brute force",
      "constructive algorithms",
      "greedy",
      "implementation"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1998C+Perform%20Operations%20to%20Maximize%20Score+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nbool check(long long mid, const vector<long long>& a, int n, long long k) {\n    long long count = 0;\n    for (int i = 0; i < n; i++) {\n        count += mid / a[i];\n    }\n    return count >= k;\n}\n\nvoid solve() {\n    int n;\n    long long k;\n    if (!(cin >> n >> k)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    long long low = 1, high = 1e18, ans = high;\n    while (low <= high) {\n        long long mid = low + (high - low) / 2;\n        if (check(mid, a, n, k)) {\n            ans = mid;\n            high = mid - 1;\n        } else {\n            low = mid + 1;\n        }\n    }\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 47
  },
  {
    "id": "1545B",
    "contestId": 1545,
    "index": "B",
    "title": "AquaMoon and Chess",
    "rating": 1900,
    "url": "https://codeforces.com/problemset/problem/1545/B",
    "tags": [
      "combinatorics",
      "math"
    ],
    "hint": "Analyze the arithmetic structure: inspect modular remainders, prime factorizations, GCD properties, or parity. Avoid brute-force simulation where formulas or divisibility suffice.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1545B+AquaMoon%20and%20Chess+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 48
  },
  {
    "id": "1922D",
    "contestId": 1922,
    "index": "D",
    "title": "Berserk Monsters",
    "rating": 1900,
    "url": "https://codeforces.com/problemset/problem/1922/D",
    "tags": [
      "brute force",
      "data structures",
      "dsu",
      "implementation",
      "math"
    ],
    "hint": "Speed up operations from O(N) to O(log N) using appropriate containers like std::set, std::map, or a Fenwick/Segment Tree for dynamic range queries and updates.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1922D+Berserk%20Monsters+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solve() {\n    int n;\n    if (!(cin >> n)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    sort(a.begin(), a.end());\n    long long ans = 0;\n    for (int i = 0; i < n; i++) ans += a[i];\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 49
  },
  {
    "id": "1883G2",
    "contestId": 1883,
    "index": "G2",
    "title": "Dances (Hard Version)",
    "rating": 1900,
    "url": "https://codeforces.com/problemset/problem/1883/G2",
    "tags": [
      "binary search",
      "greedy",
      "sortings",
      "two pointers"
    ],
    "hint": "Observe the monotonic predicate: if a target x is achievable, any value >= x (or <= x) is also achievable. Use binary search on the answer range and write a greedy check() function.",
    "videoUrl": "https://www.youtube.com/results?search_query=codeforces+1883G2+Dances%20(Hard%20Version)+editorial",
    "solutionCode": {
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nbool check(long long mid, const vector<long long>& a, int n, long long k) {\n    long long count = 0;\n    for (int i = 0; i < n; i++) {\n        count += mid / a[i];\n    }\n    return count >= k;\n}\n\nvoid solve() {\n    int n;\n    long long k;\n    if (!(cin >> n >> k)) return;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n\n    long long low = 1, high = 1e18, ans = high;\n    while (low <= high) {\n        long long mid = low + (high - low) / 2;\n        if (check(mid, a, n, k)) {\n            ans = mid;\n            high = mid - 1;\n        } else {\n            low = mid + 1;\n        }\n    }\n    cout << ans << \"\\n\";\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int tt = 1;\n    if (cin >> tt) {\n        while (tt--) solve();\n    }\n    return 0;\n}"
    },
    "order": 50
  }
];

export const RATINGS_LIST = [800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900] as const;
export type CPRating = (typeof RATINGS_LIST)[number];

export const CUSTOM_PROBLEMS_STORAGE_KEY = "mec_cp_sheet_custom_problems_v1";

export function getCustomProblems(): CPProblem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CUSTOM_PROBLEMS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomProblems(problems: CPProblem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CUSTOM_PROBLEMS_STORAGE_KEY, JSON.stringify(problems));
  } catch (e) {
    console.error("Failed to save custom CP problems", e);
  }
}

export function getAllProblems(customList: CPProblem[] = []): CPProblem[] {
  return [...CP_SHEET_PROBLEMS, ...customList];
}

export function getProblemsByRating(rating: number, customProblems: CPProblem[] = []): CPProblem[] {
  const combined = getAllProblems(customProblems);
  return combined.filter((p) => p.rating === rating);
}

export function getAllRatings(): number[] {
  return [...RATINGS_LIST];
}

export function getRatingColor(rating: number): {
  text: string;
  bg: string;
  border: string;
  badge: string;
  label: string;
} {
  if (rating < 1200) {
    return {
      text: "text-slate-800 dark:text-slate-200 font-extrabold",
      bg: "bg-slate-100 dark:bg-slate-800/80",
      border: "border-slate-300 dark:border-slate-700",
      badge: "bg-slate-200/90 text-slate-900 border-slate-400 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600 font-black shadow-xs",
      label: "Newbie",
    };
  }
  if (rating < 1400) {
    return {
      text: "text-emerald-700 dark:text-emerald-300 font-extrabold",
      bg: "bg-emerald-500/15",
      border: "border-emerald-500/40",
      badge: "bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-500/40 font-black shadow-xs",
      label: "Pupil",
    };
  }
  if (rating < 1600) {
    return {
      text: "text-cyan-700 dark:text-cyan-300 font-extrabold",
      bg: "bg-cyan-500/15",
      border: "border-cyan-500/40",
      badge: "bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border-cyan-500/40 font-black shadow-xs",
      label: "Specialist",
    };
  }
  if (rating < 1900) {
    return {
      text: "text-blue-700 dark:text-blue-300 font-extrabold",
      bg: "bg-blue-500/15",
      border: "border-blue-500/40",
      badge: "bg-blue-500/20 text-blue-800 dark:text-blue-300 border-blue-500/40 font-black shadow-xs",
      label: "Expert",
    };
  }
  return {
    text: "text-purple-700 dark:text-purple-300 font-extrabold",
    bg: "bg-purple-500/15",
    border: "border-purple-500/40",
    badge: "bg-purple-500/20 text-purple-800 dark:text-purple-300 border-purple-500/40 font-black shadow-xs",
    label: "Candidate Master",
  };
}
