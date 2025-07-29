package com.example.TravelProject.service.UserAccount;

import com.example.TravelProject.dto.login.MyPageDTO;
import com.example.TravelProject.entity.useraccount.SocialAccount;
import com.example.TravelProject.entity.useraccount.User;
import com.example.TravelProject.repository.UserAccount.MyPageRepository;
import com.example.TravelProject.repository.UserAccount.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MyPageService {

    private final MyPageRepository myPageRepository;
    private final UserRepository userRepository;

    public List<MyPageDTO> getMyPageDataByUserId(Integer userId) {
        return myPageRepository.findAllByUserId(userId);
    }

    public SocialAccount updateMyPageData(Integer socialAccountId, MyPageDTO dto) {
        SocialAccount socialAccount = myPageRepository.findById(socialAccountId)
                .orElseThrow(() -> new RuntimeException("SocialAccount not found"));

        socialAccount.setProvider(dto.getProvider()); // DTO에 있는 필드만 사용

        return myPageRepository.save(socialAccount);
    }

    public void deleteMyPageData(Integer socialAccountId) {
        myPageRepository.deleteById(socialAccountId);
    }
    // User 정보 수정
    public User updateUserData(Integer userId, MyPageDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setEmail(dto.getEmail());
        user.setUserRole(dto.getUserRole());
        user.setNickname(dto.getNickname());
        user.setUsername(dto.getUsername());

        return userRepository.save(user);
    }

    // User 삭제
    public void deleteUserData(Integer userId) {
        userRepository.deleteById(userId);
    }

}