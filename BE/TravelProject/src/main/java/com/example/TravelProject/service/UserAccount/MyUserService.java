package com.example.TravelProject.service.UserAccount;

import com.example.TravelProject.dto.login.MyUserDTO;
import com.example.TravelProject.entity.useraccount.User;
import com.example.TravelProject.repository.UserAccount.UserRepository;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MyUserService {

    private final UserRepository userRepository;

    public Optional<MyUserDTO> getUserById(Integer userId) {
        return userRepository.findById(userId)
                .map(MyUserDTO::fromEntity);
    }

    public MyUserDTO createUser(User user) {
        return MyUserDTO.fromEntity(userRepository.save(user));
    }

    public Optional<MyUserDTO> updateUser(Integer userId, User updatedUser) {
        return userRepository.findById(userId).map(user -> {
            user.setEmail(updatedUser.getEmail());
            user.setNickname(updatedUser.getNickname());
            user.setUserRole(updatedUser.getUserRole());
            user.setUsername(updatedUser.getUsername());
            return MyUserDTO.fromEntity(userRepository.save(user));
        });
    }

    public boolean deleteUser(Integer userId) {
        if (userRepository.existsById(userId)) {
            userRepository.deleteById(userId);
            return true;
        }
        return false;
    }
}