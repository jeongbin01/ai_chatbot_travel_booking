package com.example.TravelProject.service;

import com.example.TravelProject.repository.Administer.AdministerMRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdministerService {
    @Autowired
    private AdministerMRepository administerRepository;

    public List<String> fetchTables() {
        return administerRepository.getAllTables();
    }
    public List<Object[]> getTableData(String tableName) {
        return administerRepository.getTableData(tableName);
    }
    public List<String> getTableColumns(String tableName) {
        return administerRepository.getTableColumns(tableName);
    }
}