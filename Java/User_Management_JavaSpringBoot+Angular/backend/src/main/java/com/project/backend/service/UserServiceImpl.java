package com.project.backend.service;

import com.project.backend.model.User;
import com.project.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService{

    @Autowired
    private UserRepository userRepository;
    @Override
    public User createUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public List<User> getUsers() {
        return (List<User>) userRepository.findAll();
    }

    @Override
    public User getUserById(long id) {
        return userRepository.findById(id).get();
    }

    @Override
    public User updateUser(User user, long id) {
        User user1 = userRepository.findById(id).get();
        user1.setName((user.getName() == null) ? user1.getName():user.getName());
        user1.setEmail((user.getEmail() == null) ? user1.getEmail():user.getEmail());
        user1.setpNo((user.getpNo() == null) ? user1.getpNo():user.getpNo());
        user1.setAddress((user.getAddress() == null) ? user1.getAddress():user.getAddress());
        System.out.println(user.toString());
        return userRepository.saveAndFlush(user1);
    }

//    @Override
//    public User updateUser(@NotNull User user, long id) {
//        User userToUpdate = userRepository.findById(id).get();
//        Stream.of(
//                new AbstractMap.SimpleEntry<>("name", user.getName()),
//                new AbstractMap.SimpleEntry<>("email", user.getEmail()),
//                new AbstractMap.SimpleEntry<>("pNo", user.getpNo()),
//                new AbstractMap.SimpleEntry<>("address", user.getAddress())
//        ).forEach(entry -> {
//            String propertyName = entry.getKey();
//            Object propertyValue = entry.getValue();
//            if (propertyValue != null) {
//                BeanUtils.setProperty(userToUpdate, propertyName, propertyValue);
//            }
//        });
//        System.out.println("Updating user " + id + " with details: " + userToUpdate);
//        return userRepository.saveAndFlush(userToUpdate);
//    }


    @Override
    public void deleteUser(long id) {
        userRepository.deleteById(id);
    }
}
