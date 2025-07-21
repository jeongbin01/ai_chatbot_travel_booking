package com.example.TravelProject.Repository.UserAccount;

import com.example.TravelProject.entity.UserAccount.SocialAccount;
import com.example.TravelProject.entity.UserAccount.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SocialAccountRepository extends JpaRepository<SocialAccount, Integer> {
    List<SocialAccount> findByUserUserId(int userId);
    Optional<SocialAccount> findByUserAndProvider(User user, String provider);
}

