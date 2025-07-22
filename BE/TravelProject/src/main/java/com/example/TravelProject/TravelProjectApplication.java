package com.example.TravelProject;

import com.example.TravelProject.config.AdminSecurityConfig;
import com.example.TravelProject.config.JwtSecuritConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

//@SpringBootApplication (exclude = { SecurityAutoConfiguration.class })
@SpringBootApplication
public class TravelProjectApplication {

	public static void main(String[] args) {
		SpringApplication.run(TravelProjectApplication.class, args);
	}

}
