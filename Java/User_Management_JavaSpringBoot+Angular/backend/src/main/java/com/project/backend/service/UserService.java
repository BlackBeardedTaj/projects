package com.project.backend.service;

import com.project.backend.model.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface UserService {
//    create users
    public User createUser(User user);

//    read/display users
    public List<User> getUsers();

//    read a user by id
    public User getUserById(long id);

//    update/edit users by id
    public User updateUser(User user, long id);

//    delete users by id
    public void deleteUser(long id);
}
