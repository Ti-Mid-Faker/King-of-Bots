package com.botrunningsystem.kob.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootTest
class KobApplicationTests {

    @Test
    void contextLoads() {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        // adminLi & lky
        System.out.println(passwordEncoder.encode("123"));
        // username_new
        System.out.println(passwordEncoder.encode("password_new"));
    }

}
