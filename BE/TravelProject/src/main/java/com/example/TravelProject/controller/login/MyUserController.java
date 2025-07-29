package com.example.TravelProject.controller.login;

import com.example.TravelProject.dto.login.MyUserDTO;
import com.example.TravelProject.entity.useraccount.User;
import com.example.TravelProject.service.UserAccount.MyUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/app/myuser")
@RequiredArgsConstructor
public class MyUserController {

    private final MyUserService myUserService;

    // 사용자 ID로 조회
    @GetMapping("/{userId}")
    public ResponseEntity<MyUserDTO> getUserById(@PathVariable Integer userId) {
        Optional<MyUserDTO> user = myUserService.getUserById(userId);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<MyUserDTO> createUser(@RequestBody User user) {
        MyUserDTO createdUser = myUserService.createUser(user);
        return ResponseEntity.ok(createdUser);
    }
    @PutMapping("/{userId}")
    public ResponseEntity<MyUserDTO> updateUser(@PathVariable Integer userId, @RequestBody User updatedUser) {
        Optional<MyUserDTO> user = myUserService.updateUser(userId, updatedUser);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer userId) {
        boolean deleted = myUserService.deleteUser(userId);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}