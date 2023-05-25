package com.example.pp_3_1_5_rest.service;

import org.springframework.security.core.userdetails.UserDetailsService;
import com.example.pp_3_1_5_rest.entities.User;

import java.util.List;

public interface UserService extends UserDetailsService {
    User findByUsername(String username);

    User findById(Long id);

    List<User> getAllUsers();

    void saveUser(User user);

    void updateUser(Long id, User user);

    void removeUser(Long id);
}
