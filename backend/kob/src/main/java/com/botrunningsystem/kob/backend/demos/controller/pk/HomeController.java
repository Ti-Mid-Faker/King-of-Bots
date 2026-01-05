package com.botrunningsystem.kob.backend.demos.controller.pk;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/pk/")
public class HomeController {
    @RequestMapping("home/")
    public String home() {
        System.out.println("已进入home页面");
        return "index";
    }
}
