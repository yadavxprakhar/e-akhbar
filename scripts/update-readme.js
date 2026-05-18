const fs = require('fs');
const path = require('path');

// Root of the project workspace
const rootDir = path.resolve(__dirname, '..');

// Helper to check if a file or directory exists relative to root
const exists = (relativePath) => {
    try {
        return fs.existsSync(path.join(rootDir, relativePath));
    } catch {
        return false;
    }
};

// Mapping of README checklist strings to their actual corresponding file paths
const mapping = {
    // Phase 1
    "Create root `.gitignore` rules": exists(".gitignore"),
    "Configure PostgreSQL and Redis in `docker-compose.yml`": exists("docker-compose.yml"),
    "Design relational database schemas in `database/init.sql`": exists("database/init.sql"),
    "Establish backend and frontend workspace folders": exists("backend-node") && exists("backend-spring") && exists("frontend"),
    "Write Spring Boot microservice build dependencies (`pom.xml`)": exists("backend-spring/pom.xml"),
    "Write Node.js Express API Gateway configurations (`package.json`, `tsconfig.json`)": exists("backend-node/package.json") && exists("backend-node/tsconfig.json"),

    // Phase 2
    "Configure database connection (`application.properties`)": exists("backend-spring/src/main/resources/application.properties"),
    "Write JPA User model (`User.java`)": exists("backend-spring/src/main/java/com/news/model/User.java"),
    "Write JPA Preference model (`UserPreference.java`)": exists("backend-spring/src/main/java/com/news/model/UserPreference.java"),
    "Establish JPA database repositories (`UserRepository`, `UserPreferenceRepository`)": exists("backend-spring/src/main/java/com/news/repository/UserRepository.java") && exists("backend-spring/src/main/java/com/news/repository/UserPreferenceRepository.java"),
    "Implement stateless JWT token provider (`JwtTokenProvider.java`)": exists("backend-spring/src/main/java/com/news/security/JwtTokenProvider.java"),
    "Build Spring Boot security UserDetails loader (`CustomUserDetailsService.java`)": exists("backend-spring/src/main/java/com/news/security/CustomUserDetailsService.java"),
    "Build Spring Boot JWT authentication filters & context config": exists("backend-spring/src/main/java/com/news/security/JwtAuthenticationFilter.java") && exists("backend-spring/src/main/java/com/news/config/SecurityConfig.java"),
    "Implement signup, login, and profile controllers": exists("backend-spring/src/main/java/com/news/controller/AuthController.java"),

    // Phase 3
    "Create Gateway environment variables loader (`env.ts`)": exists("backend-node/src/config/env.ts"),
    "Implement Redis server integration": exists("backend-node/src/config/redis.ts"),
    "Establish rate limiters and helmet shields": exists("backend-node/src/middleware/rateLimiter.ts"),
    "Build external NewsAPI client and cached request pipeline": exists("backend-node/src/services/newsApiService.ts"),
    "Design mock-news article fallbacks": exists("backend-node/src/services/newsApiService.ts"),
    "Configure Spring Boot routing gateway proxy": exists("backend-node/src/routes/gatewayProxyRoutes.ts"),

    // Phase 4
    "Initialize React + TS scaffold": exists("frontend/package.json"),
    "Map Outfit & typography styles": exists("frontend/src/index.css"),
    "Configure Axios clients with JWT auto-refresh interceptors": exists("frontend/src/api/client.ts"),
    "Build global state store (`authStore.ts`)": exists("frontend/src/store/authStore.ts"),
    "Create login and registration visual pages": exists("frontend/src/pages/LoginPage.tsx"),

    // Phase 5
    "Build breaking category tag filters": exists("frontend/src/components/news/CategoryFilter.tsx"),
    "Create search-bar indices": exists("frontend/src/components/news/SearchBar.tsx"),
    "Create articles grid layout and card animations": exists("frontend/src/components/news/NewsCard.tsx") && exists("frontend/src/components/news/NewsList.tsx"),
    "Establish bookmark syncing logic": exists("frontend/src/hooks/useBookmarks.ts"),
    "Final end-to-end integration and run validation": exists("frontend/src/App.tsx")
};

// Paths for reading and writing README.md
const readmePath = path.join(rootDir, 'README.md');

if (!fs.existsSync(readmePath)) {
    console.error("README.md not found!");
    process.exit(1);
}

let readmeContent = fs.readFileSync(readmePath, 'utf8');

// Parse and toggle checkboxes based on actual file existence mapping
let updatedContent = readmeContent;
Object.entries(mapping).forEach(([task, isCompleted]) => {
    // Regex matches "- [ ] task" or "- [x] task" (case-insensitive on the x)
    const escapedTask = task.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); // Escape regex chars
    const regex = new RegExp(`- \\[([ xX]?)\\] ${escapedTask}`, 'g');
    
    const replacement = isCompleted ? `- [x] ${task}` : `- [ ] ${task}`;
    updatedContent = updatedContent.replace(regex, replacement);
});

if (readmeContent !== updatedContent) {
    fs.writeFileSync(readmePath, updatedContent, 'utf8');
    console.log("README.md progress checklist has been automatically updated based on workspace files!");
} else {
    console.log("README.md is already up to date.");
}
