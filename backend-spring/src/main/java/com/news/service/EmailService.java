package com.news.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class EmailService {

    @Value("${RESEND_API_KEY:}")
    private String resendApiKey;

    /**
     * Dispatches a highly styled premium registration OTP email via Resend's REST API (Port 443 HTTPS)
     */
    public void sendOtpEmail(String toEmail, String username, String otp) {
        if (resendApiKey == null || resendApiKey.isBlank()) {
            throw new IllegalStateException("RESEND_API_KEY environment variable is not defined. Please configure Resend REST API keys.");
        }

        try {
            // Premium HTML Email Template styled with professional aesthetics
            String htmlContent = "<div style=\"font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0d0e12; color: #ffffff; padding: 40px 20px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #1f222e;\">" +
                    "  <div style=\"text-align: center; margin-bottom: 30px;\">" +
                    "    <h1 style=\"color: #00e6ff; font-size: 2.2rem; font-weight: 800; margin: 0; letter-spacing: -1px;\">⚡ e-akhbar</h1>" +
                    "    <p style=\"color: #8f9bb3; font-size: 0.95rem; margin: 5px 0 0 0;\">A premium global news experience</p>" +
                    "  </div>" +
                    "  <div style=\"background-color: #161824; border-radius: 8px; padding: 30px; border: 1px solid #23273a;\">" +
                    "    <p style=\"font-size: 1.1rem; color: #e4e6eb; margin-top: 0;\">Hello <strong>" + username + "</strong>,</p>" +
                    "    <p style=\"color: #b0b8c9; font-size: 1rem; line-height: 1.6;\">Thank you for registering with e-akhbar. To complete your account sign-up and verify your email, please use the secure one-time verification code below:</p>" +
                    "    <div style=\"text-align: center; margin: 30px 0;\">" +
                    "      <div style=\"display: inline-block; background: linear-gradient(135deg, #00e6ff 0%, #0077ff 100%); color: #ffffff; font-size: 2.5rem; font-weight: 800; padding: 15px 40px; border-radius: 8px; letter-spacing: 6px; box-shadow: 0 4px 15px rgba(0, 230, 255, 0.25);\">" + otp + "</div>" +
                    "    </div>" +
                    "    <p style=\"color: #8f9bb3; font-size: 0.85rem; line-height: 1.5; margin-bottom: 0;\">This OTP is private and valid for <strong>5 minutes</strong>. If you did not initiate this request, you can safely ignore this email.</p>" +
                    "  </div>" +
                    "  <div style=\"text-align: center; margin-top: 30px; color: #626c7d; font-size: 0.8rem;\">" +
                    "    <p style=\"margin: 0;\">© 2026 e-akhbar. All rights reserved.</p>" +
                    "    <p style=\"margin: 5px 0 0 0;\">Designed with ❤️ for premium readers.</p>" +
                    "  </div>" +
                    "</div>";

            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + resendApiKey);
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Construct the Resend API Request Payload
            Map<String, Object> payload = new HashMap<>();
            payload.put("from", "e-akhbar <onboarding@resend.dev>");
            payload.put("to", new String[]{toEmail});
            payload.put("subject", "⚡ Verify your e-akhbar Account");
            payload.put("html", htmlContent);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
            ResponseEntity<String> response = restTemplate.postForEntity("https://api.resend.com/emails", entity, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                System.out.println("✓ [RESEND EMAIL API] Premium registration OTP successfully dispatched to: " + toEmail);
            } else {
                System.err.println("✗ [RESEND EMAIL API] Non-2xx response: " + response.getBody());
                throw new RuntimeException("Email service responded with failure status: " + response.getStatusCode());
            }
        } catch (Exception e) {
            System.err.println("✗ [RESEND EMAIL API] Failed to send email to " + toEmail + " due to error: " + e.getMessage());
            throw new RuntimeException("Email dispatch failed. Please check your system RESEND_API_KEY configurations.", e);
        }
    }
}
