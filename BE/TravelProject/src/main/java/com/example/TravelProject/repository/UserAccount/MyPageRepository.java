package com.example.TravelProject.repository.UserAccount;

import com.example.TravelProject.dto.login.MyPageDTO;
import com.example.TravelProject.entity.useraccount.SocialAccount;
import com.example.TravelProject.entity.useraccount.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MyPageRepository extends JpaRepository<SocialAccount, Integer> {

    @Query("SELECT new com.example.TravelProject.dto.login.MyPageDTO(" +
            "u.userId, u.email, u.phoneNumber, u.registrationDate, u.userRole, u.nickname, u.username, " +
            "sa.socialAccountId, sa.provider) " +
            "FROM SocialAccount sa JOIN sa.user u WHERE u.userId = :userId")
    List<MyPageDTO> findAllByUserId(@Param("userId") Integer userId);


}
