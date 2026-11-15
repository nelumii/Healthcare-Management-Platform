package com.carelink.controller;

import com.carelink.service.EmailService;
import com.carelink.entity.Appointment;
import com.carelink.entity.AppointmentStatus;
import com.carelink.entity.Role;
import com.carelink.entity.User;
import com.carelink.dto.AppointmentResponse;
import com.carelink.repository.AppointmentRepository;
import com.carelink.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.security.MessageDigest;
import java.text.DecimalFormat;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/appointments")
@CrossOrigin(origins = "http://localhost:3000")
public class AppointmentController {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final com.carelink.repository.NotificationRepository notificationRepository;
    private final EmailService emailService;

    public AppointmentController(AppointmentRepository appointmentRepository, UserRepository userRepository,
            com.carelink.repository.NotificationRepository notificationRepository, EmailService emailService) {
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
        this.emailService = emailService;
    }

    // ── Public: Patient books a slot (guest or registered) ────────────────────
    @PostMapping("/book")
    public ResponseEntity<?> bookAppointment(@RequestBody Map<String, Object> body) {
        Long doctorId = Long.parseLong(body.get("doctorId").toString());
        String dateStr = (String) body.get("slotDate");
        String timeStr = (String) body.get("slotTime");
        String patientName = (String) body.getOrDefault("patientName", "Guest");
        String patientEmail = (String) body.getOrDefault("patientEmail", "");
        String reason = (String) body.getOrDefault("reason", "");
        String bookingFor = (String) body.getOrDefault("bookingFor", "MYSELF");
        String dependentName = (String) body.getOrDefault("dependentName", "");

        User doctor = userRepository.findById(doctorId).orElse(null);
        if (doctor == null || doctor.getRole() != Role.DOCTOR) {
            return ResponseEntity.badRequest().body("Invalid doctor.");
        }

        // Look up registered patient by email, or create guest placeholder
        User patient = patientEmail.isBlank() ? null
                : userRepository.findByEmail(patientEmail).orElse(null);

        if (patient == null) {
            patient = new User();
            String uniqueSuffix = String.valueOf(System.currentTimeMillis());
            patient.setUsername("guest_" + uniqueSuffix);
            patient.setEmail(patientEmail.isBlank() ? "guest_" + uniqueSuffix + "@carelink.lk" : patientEmail);
            patient.setPassword("GUEST_NO_LOGIN");
            patient.setRole(Role.PATIENT);
            String[] nameParts = patientName.split(" ", 2);
            patient.setFirstName(nameParts[0]);
            patient.setLastName(nameParts.length > 1 ? nameParts[1] : "");
            patient.setApproved(true);
            patient = userRepository.save(patient);
        }

        LocalDateTime appointmentDateTime = LocalDateTime.of(
                LocalDate.parse(dateStr), LocalTime.parse(timeStr));

        Appointment appointment = new Appointment();
        appointment.setDoctor(doctor);
        appointment.setPatient(patient);
        appointment.setAppointmentDate(appointmentDateTime);
        appointment.setStatus(AppointmentStatus.PENDING);
        appointment.setNotes(reason);
        appointment.setReason(reason);
        appointment.setBookingFor(bookingFor);
        appointment.setDependentName("DEPENDENT".equals(bookingFor) ? dependentName : null);
        appointment.setPatientEmail(patientEmail);
        appointment.setPatientFullName(patientName);

        Appointment saved = appointmentRepository.save(appointment);

        // Notify Doctor
        notificationRepository.save(new com.carelink.entity.Notification(
                doctor,
                "New Appointment Request",
                "You have a new appointment request from " + patientName + " for " + dateStr + " at " + timeStr + "."));

        return ResponseEntity.ok(Map.of("message", "Appointment booked successfully. Status: PENDING", "appointmentId", saved.getId()));
    }

    // ── Doctor: Approve appointment ────────────────────────────────────────────
    @PatchMapping("/{id}/approve")
    public ResponseEntity<?> approveAppointment(@AuthenticationPrincipal User doctor, @PathVariable Long id) {
        if (doctor == null || doctor.getRole() != Role.DOCTOR)
            return ResponseEntity.status(403).build();
        Appointment appt = appointmentRepository.findById(id).orElse(null);
        if (appt == null || !appt.getDoctor().getId().equals(doctor.getId()))
            return ResponseEntity.notFound().build();
        appt.setStatus(AppointmentStatus.CONFIRMED);
        appointmentRepository.save(appt);

        // Notify Patient
        notificationRepository.save(new com.carelink.entity.Notification(
                appt.getPatient(),
                "Appointment Confirmed",
                "Your appointment with Dr. " + doctor.getFirstName() + " " + doctor.getLastName()
                        + " has been confirmed for " + appt.getAppointmentDate().toString() + "."));
 
        // ── Automated Email Confirmation ──
        try {
            emailService.sendAppointmentConfirmation(appt);
        } catch (Exception e) {
            System.err.println("Failed to send confirmation email: " + e.getMessage());
        }

        return ResponseEntity.ok(Map.of("message", "Appointment confirmed."));
    }

    // ── Patient: Cancel appointment ────────────────────────────────────────────
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<?> cancelAppointment(@AuthenticationPrincipal User patient, @PathVariable Long id) {
        if (patient == null || patient.getRole() != Role.PATIENT)
            return ResponseEntity.status(403).build();
        Appointment appt = appointmentRepository.findById(id).orElse(null);
        if (appt == null || !appt.getPatient().getId().equals(patient.getId()))
            return ResponseEntity.notFound().build();
        
        appt.setStatus(AppointmentStatus.CANCELLED);
        appointmentRepository.save(appt);

        // Notify Doctor
        notificationRepository.save(new com.carelink.entity.Notification(
                appt.getDoctor(),
                "Appointment Cancelled by Patient",
                "Patient " + (appt.getPatientFullName() != null ? appt.getPatientFullName() : patient.getFirstName() + " " + patient.getLastName())
                        + " has cancelled their appointment for " + appt.getAppointmentDate().toString() + ". The slot is now free."));

        return ResponseEntity.ok(Map.of("message", "Appointment cancelled successfully."));
    }

    // ── Doctor: Reject appointment ─────────────────────────────────────────────
    @PatchMapping("/{id}/reject")
    public ResponseEntity<?> rejectAppointment(@AuthenticationPrincipal User doctor,
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        if (doctor == null || doctor.getRole() != Role.DOCTOR)
            return ResponseEntity.status(403).build();
        Appointment appt = appointmentRepository.findById(id).orElse(null);
        if (appt == null || !appt.getDoctor().getId().equals(doctor.getId()))
            return ResponseEntity.notFound().build();
        appt.setStatus(AppointmentStatus.CANCELLED);
        if (body != null && body.containsKey("reason"))
            appt.setRejectionReason(body.get("reason"));
        appointmentRepository.save(appt);

        // Notify Patient
        notificationRepository.save(new com.carelink.entity.Notification(
                appt.getPatient(),
                "Appointment Declined",
                "Your appointment with Dr. " + doctor.getFirstName() + " " + doctor.getLastName()
                        + " has been declined." +
                        (appt.getRejectionReason() != null ? " Reason: " + appt.getRejectionReason() : "")));

        return ResponseEntity.ok(Map.of("message", "Appointment rejected."));
    }

    // ── Shared: My appointments (doctor or patient) ────────────────────────────
    @GetMapping("/me")
    public ResponseEntity<List<AppointmentResponse>> getMyAppointments(@AuthenticationPrincipal User user) {
        List<Appointment> appointments;
        if (user.getRole() == Role.DOCTOR) {
            appointments = appointmentRepository.findByDoctor_IdOrderByAppointmentDateAsc(user.getId());
        } else if (user.getRole() == Role.PATIENT) {
            appointments = appointmentRepository.findByPatient_IdOrderByAppointmentDateAsc(user.getId());
        } else {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(appointments.stream().map(this::mapToResponse).collect(Collectors.toList()));
    }

    private AppointmentResponse mapToResponse(Appointment appt) {
        AppointmentResponse res = new AppointmentResponse();
        res.setId(appt.getId());
        res.setDoctorId(appt.getDoctor().getId());
        res.setDoctorName("Dr. " + appt.getDoctor().getFirstName() + " " + appt.getDoctor().getLastName());
        res.setDoctorSpecialization(appt.getDoctor().getSpecialization());
        res.setPatientId(appt.getPatient().getId());
        res.setPatientName(appt.getPatientFullName() != null
                ? appt.getPatientFullName()
                : appt.getPatient().getFirstName() + " " + appt.getPatient().getLastName());
        res.setPatientEmail(appt.getPatientEmail());
        res.setAppointmentDate(appt.getAppointmentDate());
        res.setStatus(appt.getStatus().name());
        res.setNotes(appt.getNotes());
        res.setReason(appt.getReason());
        res.setBookingFor(appt.getBookingFor());
        res.setDependentName(appt.getDependentName());
        res.setRejectionReason(appt.getRejectionReason());
        return res;
    }

    // ── PayHere Hash Generation ────────────────────
    @PostMapping("/payhere-hash")
    public ResponseEntity<?> generatePayHereHash(@RequestBody Map<String, Object> body) {
        try {
            String merchantId = "1234687";
            String merchantSecret = "MTQ2ODA2OTAyMzMyNjUxNDI1MjUzOTA2MDkzNzMzMTgzODk1Mjcx";
            
            String orderId = (String) body.get("orderId");
            double amount = Double.parseDouble(body.get("amount").toString());
            String currency = (String) body.get("currency");

            DecimalFormat df = new DecimalFormat("0.00");
            String amountFormatted = df.format(amount);

            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] digest = md.digest(merchantSecret.getBytes());
            StringBuilder sb = new StringBuilder();
            for (byte b : digest) {
                sb.append(String.format("%02x", b));
            }
            String hashedSecret = sb.toString().toUpperCase();

            String hashString = merchantId + orderId + amountFormatted + currency + hashedSecret;
            
            byte[] digest2 = md.digest(hashString.getBytes());
            StringBuilder sb2 = new StringBuilder();
            for (byte b : digest2) {
                sb2.append(String.format("%02x", b));
            }
            String finalHash = sb2.toString().toUpperCase();

            return ResponseEntity.ok(Map.of(
                "merchantId", merchantId,
                "hash", finalHash,
                "amount", amountFormatted
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error generating hash");
        }
    }

    // ── Payment Success ────────────────────
    @PatchMapping("/{id}/paid")
    public ResponseEntity<?> markAppointmentAsPaid(@PathVariable Long id) {
        Appointment appt = appointmentRepository.findById(id).orElse(null);
        if (appt == null) return ResponseEntity.notFound().build();
        
        appt.setStatus(AppointmentStatus.CONFIRMED);
        appointmentRepository.save(appt);

        notificationRepository.save(new com.carelink.entity.Notification(
                appt.getPatient(),
                "Payment Successful — Appointment Confirmed",
                "Your payment has been received and your appointment is now confirmed."
        ));

        notificationRepository.save(new com.carelink.entity.Notification(
                appt.getDoctor(),
                "New Confirmed Appointment",
                "Patient " + appt.getPatientFullName() + " has paid and confirmed their appointment for " + appt.getAppointmentDate().toString() + "."
        ));
 
        // ── Automated Email Notifications (Doctor & Patient) ──
        try {
            emailService.sendAppointmentConfirmation(appt);
            emailService.sendNewAppointmentToDoctor(appt);
        } catch (Exception e) {
            System.err.println("Failed to send payment confirmation emails: " + e.getMessage());
        }

        return ResponseEntity.ok(Map.of("message", "Appointment paid and confirmed."));
    }
}
