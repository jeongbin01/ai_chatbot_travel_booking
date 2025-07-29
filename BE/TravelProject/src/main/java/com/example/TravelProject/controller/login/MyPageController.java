package com.example.TravelProject.controller.login;

import com.example.TravelProject.dto.login.MyPageDTO;
import com.example.TravelProject.entity.useraccount.SocialAccount;
import com.example.TravelProject.entity.useraccount.User;
import com.example.TravelProject.service.UserAccount.MyPageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/app/mypage")
@RequiredArgsConstructor
public class MyPageController {
    private final MyPageService myPageService;

    // User와 연관된 SocialAccount 목록 조회
    @GetMapping("/{userId}")
    public ResponseEntity<List<MyPageDTO>> getMyPageData(@PathVariable Integer userId) {
        List<MyPageDTO> data = myPageService.getMyPageDataByUserId(userId);
        return ResponseEntity.ok(data);
    }

    // User 정보 업데이트
    @PutMapping("/user/{userId}")
    public ResponseEntity<User> updateUserData(
            @PathVariable Integer userId,
            @RequestBody MyPageDTO dto) {
        User updated = myPageService.updateUserData(userId, dto);
        return ResponseEntity.ok(updated);
    }

    // User 삭제
    @DeleteMapping("/user/{userId}")
    public ResponseEntity<Void> deleteUserData(@PathVariable Integer userId) {
        myPageService.deleteUserData(userId);
        return ResponseEntity.noContent().build();
    }

    // SocialAccount 정보 업데이트 (socialAccountId 기준)
    @PutMapping("/social/{socialAccountId}")
    public ResponseEntity<SocialAccount> updateSocialAccountData(
            @PathVariable Integer socialAccountId,
            @RequestBody MyPageDTO dto) {
        SocialAccount updated = myPageService.updateMyPageData(socialAccountId, dto);
        return ResponseEntity.ok(updated);
    }

    // SocialAccount 삭제
    @DeleteMapping("/social/{socialAccountId}")
    public ResponseEntity<Void> deleteSocialAccountData(@PathVariable Integer socialAccountId) {
        myPageService.deleteMyPageData(socialAccountId);
        return ResponseEntity.noContent().build();
    }
}
