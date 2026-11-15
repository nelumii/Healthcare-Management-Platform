package com.carelink;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableAsync
public class CareLinkApplication {

	public static void main(String[] args) {
		SpringApplication.run(CareLinkApplication.class, args);
	}

	@Bean
	CommandLineRunner fixDb(JdbcTemplate jdbcTemplate) {
		return args -> {
			try {
				jdbcTemplate.execute("ALTER TABLE appointments MODIFY COLUMN status VARCHAR(50)");
				jdbcTemplate.execute("ALTER TABLE lab_reports MODIFY COLUMN status VARCHAR(50)");
				System.out.println("Modified appointments.status and lab_reports.status to VARCHAR(50)");
			} catch (Exception e) {
				System.out.println("Could not alter tables: " + e.getMessage());
			}
		};
	}
}
