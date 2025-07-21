package com.example.TravelProject.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping("/admin")
@Controller
public class AdministerController {
    @GetMapping("/")
    public String index() {
        return "admin/index";  // templates/admin/index.html 렌더링
    }

    @GetMapping("/login")
    public String login() {
        return "admin/login";  // templates/admin/login.html 렌더링
    }
    @GetMapping("/logout")
    public String logout(){
        return "redirect:admin/login";
    }
}

