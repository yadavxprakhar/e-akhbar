package com.news.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    public DatabaseInitializer(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("⏳ [DATABASE INITIALIZER] Running automated database schema updates...");
        try {
            jdbcTemplate.execute(
                "CREATE TABLE IF NOT EXISTS registration_otps (" +
                "    id UUID PRIMARY KEY," +
                "    email VARCHAR(255) UNIQUE NOT NULL," +
                "    username VARCHAR(100) NOT NULL," +
                "    password_hash VARCHAR(255) NOT NULL," +
                "    otp VARCHAR(6) NOT NULL," +
                "    expiry_time TIMESTAMP NOT NULL" +
                ")"
            );
            System.out.println("✓ [DATABASE INITIALIZER] Table 'registration_otps' is verified/created successfully!");
        } catch (Exception e) {
            System.err.println("✗ [DATABASE INITIALIZER] Failed to verify/create 'registration_otps' table: " + e.getMessage());
        }
    }
}
