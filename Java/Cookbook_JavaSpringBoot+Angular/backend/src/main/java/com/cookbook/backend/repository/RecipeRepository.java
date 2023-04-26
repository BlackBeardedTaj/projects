package com.cookbook.backend.repository;

import com.cookbook.backend.model.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Long> {

    List<Recipe> findByTitleContainingIgnoreCase(String title);

    List<Recipe> findByIngredientsContainingIgnoreCase(String ingredients);

    List<Recipe> findByPreparationContainingIgnoreCase(String preparation);
}

