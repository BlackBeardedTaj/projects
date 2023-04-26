package com.example.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.dto.CountType;
import com.example.model.Task;
import com.example.repositories.TaskRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class TaskService {

//	Here I'm going to use that interface (extended JPA Repository) to get all the data
//	I'll do here Auto-wire or dependency injection so I don'T have to initiate this all the time, I can use this instance of this
//	In this case I'm gonna use the dependency injection on taskRepository
	private TaskRepository taskRepository;
	
//	Transactional help us in case any API's fail, in that case it does rollback on failed one
	@Transactional(readOnly = true)
	public List<Task> getTask(){
		return taskRepository.getAllTaskDueDateDesc();
	}
	
	@Transactional
	public Task save(Task task) {
		return taskRepository.saveAndFlush(task);
	}
	
	@Transactional(readOnly = true)
	public boolean existById(Long id) {
		return taskRepository.existsById(id);
	}
	
	@Transactional(readOnly = true)
	public Optional<Task> getTaskById(Long id) {
		return taskRepository.findById(id);
	}

	public void delete(Long id) {
		taskRepository.deleteById(id);
	}
	
	public List<CountType> getPercentageGroupByType() {
		return taskRepository.getPercentageGroupByType();
	}
}
