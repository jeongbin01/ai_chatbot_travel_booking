package com.example.TravelProject.Repository.UserAccount;

import com.example.TravelProject.entity.UserAccount.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findByNickname(String nickname);

    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}