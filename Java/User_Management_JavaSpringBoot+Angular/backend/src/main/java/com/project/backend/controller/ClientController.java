package com.project.backend.controller;

import com.project.backend.model.User;
import com.project.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
public class ClientController {
    @Autowired
    private UserService userService;

//    hello world
    @GetMapping ("/")
    public String helloworld(){
        return "Hello World!";
    }

//    Rest API CRUD
//    Create User
    @PostMapping("/add")
    public String createUser(@RequestBody User user){
        User user1 = userService.createUser(user);
        return "User added successfully";
    }

//    Read list of Users
    @GetMapping("/users")
    public List<User> getUsers(){
        return userService.getUsers();
    }

//    Read user by id
    @GetMapping("/user/{id}")
    public User getUserById(@PathVariable("id") long id){
        return userService.getUserById(id);
    }

//    Update User
    @PutMapping("/update/{id}")
    public User updateUserById(@RequestBody User user, @PathVariable("id") long id){
        return userService.updateUser(user, id);
    }

//    Delete User
    @DeleteMapping("/delete/{id}")
    public String deleteUser(@PathVariable("id") long id){
        userService.deleteUser(id);
        return "User deleted successfully";
    }

}
