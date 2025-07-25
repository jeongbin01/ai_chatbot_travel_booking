package com.example.TravelProject.repository.Administer;

import com.example.TravelProject.entity.administer.AdminUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface AdminUserRepository extends JpaRepository<AdminUser, Integer> {

    Optional<AdminUser> findByUsername(String username);
    Optional<AdminUser> findByEmail(String email);

    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}