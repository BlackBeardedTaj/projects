package com.example.controllers;

import java.util.HashMap;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.dto.CountType;
import com.example.model.Task;
import com.example.services.TaskService;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;

//Because we wanna create an API we'll use RestController
@RestController
//This tells the API to go to URL. /api/v1 and than call all the methods below
@RequestMapping("/api/v1")
//This specifies the frontend domain that I want to give it access to
@CrossOrigin("*")
@AllArgsConstructor
public class TaskController {
	
	private TaskService taskservice;
	
	@GetMapping("/task/vData/percentcounttype")
	public List<CountType> getPercentageGroupByType(){
		return taskservice.getPercentageGroupByType();
	}
	
//	Reading method
//	This specifies the URL of Tasks, whenever we do get method on task this method will trigger
	@GetMapping("/task")
	public List<Task> getTask(){
		return taskservice.getTask();
	}
	
	@GetMapping("/task/{id}")
	public Task getById(@PathVariable Long id) {
		return taskservice.getTaskById(id).orElseThrow(()->new EntityNotFoundException("Requested Task not found"));
	}
	
//	Creating method
	@PostMapping("/task")
	public Task addTask(@RequestBody Task task) {
		return taskservice.save(task);
	}
	
//	Updating method
	@PutMapping("/task/{id}")
	public ResponseEntity<?> addTask(@RequestBody Task taskPara,@PathVariable Long id) {
		if(taskservice.existById(id)) {
			Task task=taskservice.getTaskById(id).orElseThrow(()->new EntityNotFoundException("Requested Task not found"));
			task.setTitle(taskPara.getTitle());
			task.setDueDate(taskPara.getDueDate());
			task.setType(taskPara.getType());
			task.setDescription(taskPara.getDescription());
			taskservice.save(task);
			return ResponseEntity.ok().body(task);
		}else {
			HashMap<String, String>message= new HashMap<>();
			message.put("message", id + " task not found or matched");
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(message);
		}
	}
		
	@DeleteMapping("/task/{id}")
	public ResponseEntity<?> deleteTask(@PathVariable Long id) {
		if(taskservice.existById(id)) {
			taskservice.delete(id);
			HashMap<String, String>message= new HashMap<>();
			message.put("message", " task " + id + " removed!");
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(message);
		}else {
			HashMap<String, String>message= new HashMap<>();
			message.put("message", id + " task not found or matched");
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(message);
		}
	}
}

//HERE I CREATED THE CONTROLLER, CONTROLLER WILL CALL SERVICES, SERVICES WILL CALL REPOSITORY AND GETT ALL THE DATA
