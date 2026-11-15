package com.carelink.init;

import com.carelink.repository.UserRepository;
import com.carelink.entity.User;
import com.carelink.entity.Role;
import com.carelink.entity.LabTest;
import com.carelink.repository.LabTestRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final LabTestRepository labTestRepository;
        private final com.carelink.repository.MedicineRepository medicineRepository;

        public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder,
                        LabTestRepository labTestRepository,
                        com.carelink.repository.MedicineRepository medicineRepository) {
                this.userRepository = userRepository;
                this.passwordEncoder = passwordEncoder;
                this.labTestRepository = labTestRepository;
                this.medicineRepository = medicineRepository;
        }

        @Override
        public void run(String... args) throws Exception {

                // ── Seed System Accounts ─────────────────────────────────────────────

                if (System.getenv("CARELINK_SEED_ADMIN_PASSWORD") != null && userRepository.findByUsername("admin@carelink.com").isEmpty()) {
                        userRepository.save(User.builder()
                                        .username("admin@carelink.com").email("admin@carelink.com")
                                        .password(passwordEncoder.encode(System.getenv("CARELINK_SEED_ADMIN_PASSWORD")))
                                        .role(Role.ADMIN).banned(false).approved(true)
                                        .firstName("System").lastName("Administrator").build());
                        System.out.println("✅ Admin account seeded.");
                }

                if (System.getenv("CARELINK_SEED_PHARMACY_PASSWORD") != null && userRepository.findByUsername("pharmacy@carelink.com").isEmpty()) {
                        userRepository.save(User.builder()
                                        .username("pharmacy@carelink.com").email("pharmacy@carelink.com")
                                        .password(passwordEncoder.encode(System.getenv("CARELINK_SEED_PHARMACY_PASSWORD")))
                                        .role(Role.PHARMACIST).banned(false).approved(true)
                                        .firstName("Central").lastName("Pharmacy").build());
                        System.out.println("✅ Pharmacy account seeded.");
                }

                if (System.getenv("CARELINK_SEED_LAB_PASSWORD") != null && userRepository.findByUsername("lab@carelink.com").isEmpty()) {
                        userRepository.save(User.builder()
                                        .username("lab@carelink.com").email("lab@carelink.com")
                                        .password(passwordEncoder.encode(System.getenv("CARELINK_SEED_LAB_PASSWORD")))
                                        .role(Role.LAB_TECH).banned(false).approved(true)
                                        .firstName("Main").lastName("Laboratory").build());
                        System.out.println("✅ Laboratory account seeded.");
                }

                // ── Seed Test Catalog ────────────────────────────────────────────────

                if (labTestRepository.count() == 0) {

                        // Haematology
                        labTestRepository.save(LabTest.builder()
                                        .name("Full Blood Count (FBC)")
                                        .description(
                                                        "Measures red blood cells, white blood cells, haemoglobin, haematocrit and platelets. Screens for anaemia, infections and blood disorders.")
                                        .price(1500.0)
                                        .category("HAEMATOLOGY")
                                        .prepInstructions(
                                                        "No special preparation needed. You may eat and drink normally.")
                                        .resourceRequired("Phlebotomist")
                                        .durationMinutes(15)
                                        .fastingRequired(false)
                                        .build());

                        labTestRepository.save(LabTest.builder()
                                        .name("Fasting Blood Sugar (FBS)")
                                        .description("Measures blood glucose levels to screen for and monitor diabetes mellitus.")
                                        .price(800.0)
                                        .category("BIOCHEMISTRY")
                                        .prepInstructions(
                                                        "You must fast for at least 8-12 hours before this test. You may drink plain water only. Do not take any medications before consulting your doctor.")
                                        .resourceRequired("Phlebotomist")
                                        .durationMinutes(15)
                                        .fastingRequired(true)
                                        .build());

                        labTestRepository.save(LabTest.builder()
                                        .name("Lipid Profile")
                                        .description(
                                                        "Measures cholesterol (total, LDL, HDL) and triglycerides to assess cardiovascular risk.")
                                        .price(2500.0)
                                        .category("BIOCHEMISTRY")
                                        .prepInstructions(
                                                        "Fast for 9-12 hours before the test. Avoid alcohol for 24 hours. You may drink plain water.")
                                        .resourceRequired("Phlebotomist")
                                        .durationMinutes(20)
                                        .fastingRequired(true)
                                        .build());

                        labTestRepository.save(LabTest.builder()
                                        .name("Liver Function Test (LFT)")
                                        .description("Evaluates liver health by measuring enzymes, proteins and bilirubin levels.")
                                        .price(3200.0)
                                        .category("BIOCHEMISTRY")
                                        .prepInstructions(
                                                        "Fast for 8 hours before the test. Avoid alcohol for 48 hours before.")
                                        .resourceRequired("Phlebotomist")
                                        .durationMinutes(20)
                                        .fastingRequired(true)
                                        .build());

                        labTestRepository.save(LabTest.builder()
                                        .name("Thyroid Function Test (TSH / T3 / T4)")
                                        .description("Assesses thyroid gland function to diagnose hypothyroidism or hyperthyroidism.")
                                        .price(2800.0)
                                        .category("ENDOCRINOLOGY")
                                        .prepInstructions(
                                                        "No fasting required. Inform the technician of any thyroid medications you take.")
                                        .resourceRequired("Phlebotomist")
                                        .durationMinutes(15)
                                        .fastingRequired(false)
                                        .build());

                        labTestRepository.save(LabTest.builder()
                                        .name("Urine Full Report (UFR)")
                                        .description("Analyzes urine for infections, kidney disease, diabetes and other conditions.")
                                        .price(600.0)
                                        .category("MICROBIOLOGY")
                                        .prepInstructions(
                                                        "Collect a mid-stream urine sample in the sterile container provided. Avoid collecting the first or last part of the stream.")
                                        .resourceRequired("Sample Point")
                                        .durationMinutes(30)
                                        .fastingRequired(false)
                                        .build());

                        labTestRepository.save(LabTest.builder()
                                        .name("PCR – COVID-19 / Viral Panel")
                                        .description(
                                                        "Highly accurate molecular test to detect active viral infections using a nasal/throat swab sample.")
                                        .price(5500.0)
                                        .category("MICROBIOLOGY")
                                        .prepInstructions(
                                                        "Do not eat, drink, smoke or chew gum for at least 30 minutes before the test. Avoid using nasal sprays or decongestants before the swab.")
                                        .resourceRequired("Swab Technician")
                                        .durationMinutes(30)
                                        .fastingRequired(false)
                                        .build());

                        labTestRepository.save(LabTest.builder()
                                        .name("MRI Scan – Brain / Spine / Joints")
                                        .description(
                                                        "High-resolution magnetic resonance imaging to visualize soft tissues, brain, spinal cord, and joints.")
                                        .price(18000.0)
                                        .category("RADIOLOGY")
                                        .prepInstructions(
                                                        "Remove all metal objects including jewellery, piercings and belts. Inform us if you have any metal implants, pacemakers or are pregnant. Wear comfortable, loose clothing. Do not bring credit cards into the scan room.")
                                        .resourceRequired("MRI Room")
                                        .durationMinutes(60)
                                        .fastingRequired(false)
                                        .build());

                        labTestRepository.save(LabTest.builder()
                                        .name("Chest X-Ray")
                                        .description(
                                                        "Imaging test to evaluate the lungs, heart and chest wall for infection, fractures or disease.")
                                        .price(1800.0)
                                        .category("RADIOLOGY")
                                        .prepInstructions(
                                                        "Remove metal objects and jewellery from the chest area. Inform us if you are or might be pregnant.")
                                        .resourceRequired("X-Ray Room")
                                        .durationMinutes(20)
                                        .fastingRequired(false)
                                        .build());

                        labTestRepository.save(LabTest.builder()
                                        .name("Dengue NS1 Antigen & Antibody")
                                        .description("Rapid serological test to diagnose early-stage dengue fever infection.")
                                        .price(2200.0)
                                        .category("SEROLOGY")
                                        .prepInstructions("No special preparation required.")
                                        .resourceRequired("Phlebotomist")
                                        .durationMinutes(20)
                                        .fastingRequired(false)
                                        .build());

                        System.out.println("✅ Lab test catalog seeded with " + labTestRepository.count() + " tests.");
                }

                // ── Seed Medicine Master List ────────────────────────────────────────

                if (medicineRepository.count() == 0) {
                        medicineRepository.save(new com.carelink.entity.Medicine("Amoxicillin 500mg", "Antibiotics",
                                        "Tablet", 45.0, 100, 500));
                        medicineRepository.save(new com.carelink.entity.Medicine("Paracetamol 500mg", "Painkillers",
                                        "Tablet", 5.0, 200, 1000));
                        medicineRepository.save(new com.carelink.entity.Medicine("Metformin 500mg", "Diabetes",
                                        "Tablet", 12.0, 150, 800));
                        medicineRepository.save(new com.carelink.entity.Medicine("Atorvastatin 20mg", "Cholesterol",
                                        "Tablet", 35.0, 80, 400));
                        medicineRepository.save(new com.carelink.entity.Medicine("Salbutamol Inhaler", "Respiratory",
                                        "Inhaler", 450.0, 20, 100));
                        medicineRepository.save(new com.carelink.entity.Medicine("Amoxicillin Syrup", "Antibiotics",
                                        "Syrup", 280.0, 30, 250));
                        medicineRepository.save(new com.carelink.entity.Medicine("Insulin Glargine", "Diabetes",
                                        "Injection", 1850.0, 10, 50));
                        medicineRepository.save(new com.carelink.entity.Medicine("Omeprazole 20mg", "Gastric",
                                        "Capsule", 15.0, 120, 600));

                        System.out.println("✅ Medicine master list seeded.");
                }
        }
}
