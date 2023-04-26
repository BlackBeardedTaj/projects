package com.example.task;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
//This Entity Scan is to tell Sprint to look for our entity
@EntityScan("com.example")
//this tells the spring to scan all the components to acknowledge all the new stuff I created
@ComponentScan("com.example")
@EnableJpaRepositories(basePackages = {"com.example"})
public class TaskManagementApplication {

	public static void main(String[] args) {
		SpringApplication.run(TaskManagementApplication.class, args);
	}

}
