package com.example.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.dto.CountType;
import com.example.model.Task;

//This tells that every item we create in repository belongs to Tasks
public interface TaskRepository extends JpaRepository<Task,Long> {

//	this one give us the result in descending order, it's used in services
//	When we use native query we can write name of the table with the lower case
	@Query(value="SELECT * FROM task ORDER BY due_date DESC", nativeQuery = true)
	public List<Task> getAllTaskDueDateDesc();
	
//	!!!!!!When we use JPA query the name of the table has to start with the upper case, because we're reffering here to the Model(Class) and class names start with upper case letters!!!!!! 
    @Query(value="SELECT new com.example.dto.CountType((COUNT(*)/(SELECT COUNT(*) FROM Task)) *100,type) FROM Task GROUP BY type")
    public List<CountType> getPercentageGroupByType();
}
