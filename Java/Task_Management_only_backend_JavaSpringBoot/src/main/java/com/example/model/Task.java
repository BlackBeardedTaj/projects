package com.example.model;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

//These are JPA anotations
@Entity
//These 3 below are Lambook anotations that write stuff automatically for me (getters, setters, constructors)
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Task {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name="Id")
	private Long id;
	
	private String title;
	
	private String type;
	
	private Date dueDate;
	
	private String description;
	
}
