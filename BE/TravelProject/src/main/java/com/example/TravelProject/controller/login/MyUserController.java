package com.example.TravelProject.controller.login;

import com.example.TravelProject.dto.login.MyUserDTO;
import com.example.TravelProject.entity.useraccount.User;
import com.example.TravelProject.service.UserAccount.MyUserService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/app/myuser")
@RequiredArgsConstructor
public class MyUserController {

    private final MyUserService myUserService;
    
    @Operation(
            summary = "사용자 정보 조회",
            description = """
                사용자 ID(userId)를 기준으로 해당 사용자의 정보를 조회합니다.
                존재하지 않는 경우 404 Not Found 응답을 반환합니다.
                """
        )
    // 사용자 ID로 조회
    @GetMapping("/{userId}")
    public ResponseEntity<MyUserDTO> getUserById(@PathVariable ("userId") Integer userId) {
        Optional<MyUserDTO> user = myUserService.getUserById(userId);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }


    @Operation(
            summary = "신규 사용자 생성",
            description = """
                전달받은 사용자 정보를 기반으로 새로운 사용자를 생성합니다.
                사용자 정보는 User 엔티티 형식으로 전달되어야 하며,
                생성된 결과는 MyUserDTO 형식으로 반환됩니다.
                """
        )
    @PostMapping
    public ResponseEntity<MyUserDTO> createUser(@RequestBody User user) {
        MyUserDTO createdUser = myUserService.createUser(user);
        return ResponseEntity.ok(createdUser);
    }
    
    @Operation(
            summary = "사용자 정보 수정",
            description = """
                주어진 사용자 ID(userId)를 기준으로 기존 사용자의 정보를 수정합니다.
                수정 대상 사용자가 존재하지 않는 경우 404 Not Found를 반환합니다.
                """
        )
    @PutMapping("/{userId}")
    public ResponseEntity<MyUserDTO> updateUser(@PathVariable("userId") Integer userId, @RequestBody User updatedUser) {
        Optional<MyUserDTO> user = myUserService.updateUser(userId, updatedUser);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @Operation(
            summary = "사용자 삭제",
            description = """
                사용자 ID를 기준으로 해당 사용자를 삭제합니다.
                삭제 성공 시 204 No Content 응답을 반환하며,
                존재하지 않는 경우 404 Not Found를 반환합니다.
                """
        )
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable("userId") Integer userId) {
        boolean deleted = myUserService.deleteUser(userId);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}