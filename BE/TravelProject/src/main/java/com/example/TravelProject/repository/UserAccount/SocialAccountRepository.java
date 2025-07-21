package com.example.TravelProject.repository.useraccount;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.TravelProject.entity.useraccount.SocialAccount;
import com.example.TravelProject.entity.useraccount.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface SocialAccountRepository extends JpaRepository<SocialAccount, Integer> {
    List<SocialAccount> findByUserUserId(int userId);
    Optional<SocialAccount> findByUserAndProvider(User user, String provider);
}

