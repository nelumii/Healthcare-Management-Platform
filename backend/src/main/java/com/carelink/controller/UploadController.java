package com.carelink.controller;

import com.carelink.repository.UserRepository;
import com.carelink.service.FileStorageService;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/uploads")
public class UploadController {

    private final FileStorageService fileStorageService;
    private final UserRepository userRepository;

    public UploadController(UserRepository userRepository, FileStorageService fileStorageService) {
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
    }

    @PostMapping("/certificate")
    public ResponseEntity<String> uploadCertificate(@RequestParam("file") MultipartFile file,
            @RequestParam("email") String email) {
        try {
            String filename = fileStorageService.saveCertificate(file);

            userRepository.findByUsername(email).ifPresent(user -> {
                user.setCertificatePath(filename);
                userRepository.save(user);
            });

            return ResponseEntity.ok(filename);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Could not upload the file: " + e.getMessage());
        }
    }

    @GetMapping("/certificate/{filename:.+}")
    public ResponseEntity<Resource> getCertificate(@PathVariable String filename) {
        try {
            Path file = fileStorageService.getCertificatePath(filename);
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() || resource.isReadable()) {
                String contentType = "application/octet-stream";
                String lower = filename.toLowerCase();
                if (lower.endsWith(".png")) contentType = "image/png";
                else if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) contentType = "image/jpeg";
                else if (lower.endsWith(".pdf")) contentType = "application/pdf";

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/invoice")
    public ResponseEntity<String> uploadInvoice(@RequestParam("file") MultipartFile file) {
        try {
            if (!file.getOriginalFilename().toLowerCase().endsWith(".pdf")) {
                return ResponseEntity.badRequest().body("Only PDF files are allowed");
            }
            String filename = fileStorageService.saveInvoice(file);
            return ResponseEntity.ok(filename);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Could not upload the invoice: " + e.getMessage());
        }
    }

    @GetMapping("/invoice/{filename:.+}")
    public ResponseEntity<Resource> getInvoice(@PathVariable String filename) {
        try {
            Path file = fileStorageService.getInvoicePath(filename);
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType("application/pdf"))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/profile-picture")
    public ResponseEntity<String> uploadProfilePicture(@RequestParam("file") MultipartFile file,
            @RequestParam("email") String email) {
        try {
            String filename = fileStorageService.saveProfilePicture(file);

            userRepository.findByUsername(email).ifPresent(user -> {
                user.setProfilePicturePath(filename);
                userRepository.save(user);
            });

            return ResponseEntity.ok(filename);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Could not upload the profile picture: " + e.getMessage());
        }
    }

    @PostMapping("/profile-picture/me")
    public ResponseEntity<String> uploadMyProfilePicture(@RequestParam("file") MultipartFile file,
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.carelink.entity.User user) {
        try {
            String filename = fileStorageService.saveProfilePicture(file);

            user.setProfilePicturePath(filename);
            userRepository.save(user);

            return ResponseEntity.ok(filename);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Could not upload the profile picture: " + e.getMessage());
        }
    }

    @GetMapping("/profile-picture/{filename:.+}")
    public ResponseEntity<Resource> getProfilePicture(@PathVariable String filename) {
        try {
            Path file = fileStorageService.getProfilePath(filename);
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() || resource.isReadable()) {
                String contentType = "application/octet-stream";
                String lower = filename.toLowerCase();
                if (lower.endsWith(".png")) contentType = "image/png";
                else if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) contentType = "image/jpeg";

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/lab-report")
    public ResponseEntity<String> uploadLabReport(@RequestParam("file") MultipartFile file) {
        try {
            String filename = fileStorageService.saveLabReport(file);
            return ResponseEntity.ok(filename);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Could not upload the report: " + e.getMessage());
        }
    }

    @GetMapping("/lab-report/{filename:.+}")
    public ResponseEntity<Resource> getLabReport(@PathVariable String filename) {
        try {
            Path file = fileStorageService.getReportPath(filename);
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() || resource.isReadable()) {
                String contentType = "application/octet-stream";
                String lower = filename.toLowerCase();
                if (lower.endsWith(".png")) contentType = "image/png";
                else if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) contentType = "image/jpeg";
                else if (lower.endsWith(".pdf")) contentType = "application/pdf";

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
