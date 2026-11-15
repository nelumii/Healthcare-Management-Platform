package com.carelink.repository;

import com.carelink.entity.Appointment;
import com.carelink.entity.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByDoctor_IdOrderByAppointmentDateAsc(Long doctorId);

    List<Appointment> findByPatient_IdOrderByAppointmentDateAsc(Long patientId);

    List<Appointment> findByStatusInAndAppointmentDateBefore(List<AppointmentStatus> statuses, LocalDateTime dateTime);
}
