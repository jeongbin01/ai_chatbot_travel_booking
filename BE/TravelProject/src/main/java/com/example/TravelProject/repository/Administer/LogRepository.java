package com.example.TravelProject.Repository.Administer;

import com.example.TravelProject.entity.Administer.Log;
import com.example.TravelProject.entity.UserAccount.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface LogRepository extends JpaRepository<Log, Integer> {

    List<Log> findByUser(User user);
    List<Log> findByEventType(String eventType);
    List<Log> findByAffectedEntityTypeAndAffectedEntityId(String entityType, Integer entityId);
}
