package com.example.TravelProject.controller.login;

import com.example.TravelProject.service.AdministerService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.swing.*;
import java.util.List;

@Controller
@RequestMapping("/admin")
public class AdministerController {
    private AdministerService administerService;

    @Autowired
    public AdministerController(AdministerService administerService) {
        this.administerService = administerService;
    }

    @GetMapping("/")
    public String index(Model model) {
        List<String> tables = administerService.fetchTables();
        model.addAttribute("tables", tables);
        return "admin/index";  // templates/admin/index.html 렌더링
    }

    @GetMapping("/index/{table}")
    public String viewTable(@PathVariable("table") String table, Model model) {
        List<Object[]> rows = administerService.getTableData(table);
        List<String> columns = administerService.getTableColumns(table);

        model.addAttribute("tableName", table);
        model.addAttribute("rows", rows);
        model.addAttribute("columns", columns);

        return "admin/index";
    }

    @GetMapping("/login")
    public String login() {
        return "admin/login";  // templates/admin/login.html 렌더링
    }

    // 로그 아웃 :: 작동 안됨 : AdminSecurityConfig.java 에서 처리됨
    @PostMapping("/logout")
    public String logout(HttpSession session, RedirectAttributes redirectAttributes) {

        System.out.println("로그 아웃 호출됨 ::::");

        session.invalidate(); // 세션 만료 (로그아웃 처리)

        System.out.println("세션 만료 처리 안됨 ::::");
        redirectAttributes.addFlashAttribute("logoutMessage", "성공적으로 로그아웃되었습니다.");


        return "redirect:/admin/login";
    }


    @RequestMapping("/logout-success")
    public String logoutSuccess(RedirectAttributes redirectAttributes) {
        redirectAttributes.addFlashAttribute("logoutMessage", "성공적으로 로그아웃되었습니다.");
        return "redirect:/admin/login";
    }
}

