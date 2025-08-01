package com.example.TravelProject.controller.login;

import com.example.TravelProject.dto.login.MyPageDTO;
import com.example.TravelProject.entity.useraccount.SocialAccount;
import com.example.TravelProject.entity.useraccount.User;
import com.example.TravelProject.service.UserAccount.MyPageService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/app/mypage")
@RequiredArgsConstructor
public class MyPageController {
    private final MyPageService myPageService;

    @Operation(
            summary = "마이페이지 정보 조회",
            description = "userId를 기준으로 해당 사용자의 마이페이지 정보 (소셜 계정 포함)를 조회합니다."
        )
    // User와 연관된 SocialAccount 목록 조회
    @GetMapping("/{userId}")
    public ResponseEntity<List<MyPageDTO>> getMyPageData(@PathVariable Integer userId) {
        List<MyPageDTO> data = myPageService.getMyPageDataByUserId(userId);
        return ResponseEntity.ok(data);
    }

    @Operation(
        summary = "사용자 정보 수정",
        description = "userId를 기준으로 닉네임, 이메일, 연락처 등의 사용자 정보를 수정합니다."
    )
    // User 정보 업데이트
    @PutMapping("/user/{userId}")
    public ResponseEntity<User> updateUserData(
            @PathVariable Integer userId,
            @RequestBody MyPageDTO dto) {
        System.out.println("answer"+dto);
        User updated = myPageService.updateUserData(userId, dto);
        return ResponseEntity.ok(updated);
    }
    
    
    @Operation(
            summary = "사용자 삭제",
            description = "userId를 기준으로 해당 사용자 계정을 삭제합니다. 관련 소셜 계정도 함께 삭제될 수 있습니다."
        )
    // User 삭제
    @DeleteMapping("/user/{userId}")
    public ResponseEntity<Void> deleteUserData(@PathVariable Integer userId) {
        myPageService.deleteUserData(userId);
        return ResponseEntity.noContent().build();
    }

    @Operation(
            summary = "소셜 계정 정보 수정",
            description = "socialAccountId를 기준으로 연결된 소셜 계정 정보를 수정합니다."
        )
    // SocialAccount 정보 업데이트 (socialAccountId 기준)
    @PutMapping("/social/{socialAccountId}")
    public ResponseEntity<SocialAccount> updateSocialAccountData(
            @PathVariable Integer socialAccountId,
            @RequestBody MyPageDTO dto) {
        SocialAccount updated = myPageService.updateMyPageData(socialAccountId, dto);
        return ResponseEntity.ok(updated);
    }

    @Operation(
            summary = "소셜 계정 삭제",
            description = "socialAccountId를 기준으로 소셜 계정 정보를 삭제합니다."
        )
    // SocialAccount 삭제
    @DeleteMapping("/social/{socialAccountId}")
    public ResponseEntity<Void> deleteSocialAccountData(@PathVariable Integer socialAccountId) {
        myPageService.deleteMyPageData(socialAccountId);
        return ResponseEntity.noContent().build();
    }
}
