package com.botrunningsystem.kob.backend.demos.controller.pk;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class BotInfoController {
    @RequestMapping("/pk/getBotInfo/")
    public Map<String, String> getBotInfo() {
        Map<String, String> botInfo = new HashMap<>();
        botInfo.put("name", "Bot1");
        botInfo.put("weapon", "sword");
        System.out.println("已进入getBotInfo页面");
        return botInfo;
    }
}
