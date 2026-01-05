package com.botrunningsystem.kob.backend.demos.controller.user;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.botrunningsystem.kob.backend.demos.mapper.UserMapper;
import com.botrunningsystem.kob.backend.demos.pojo.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class UserController {
    @Autowired
    private UserMapper userMapper;

    // 查询所有用户
    @GetMapping("/user/all/")
    public List<User> getAll() {
        System.out.println("获得所有用户信息");
        return userMapper.selectList(null);
    }

    // 查询某一个用户
    @GetMapping("/user/{userId}/")
    public User getUser(@PathVariable Integer userId) {
        // 这里QueryWrapper如果全局定义只能用第一次！
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("id", userId);
        return userMapper.selectOne(queryWrapper);
    }

    // 添加
    @GetMapping("/user/add/{userId}/{username}/{password}/")
    public String add(
            @PathVariable Integer userId,
            @PathVariable String username,
            @PathVariable String password
    ) {
        User user = new User(userId, username, password);
        userMapper.insert(user);
        return "成功添加一名用户";
    }

    // 删除
    @GetMapping("/user/delete/{userId}/")
    public String delete(@PathVariable Integer userId) {
        userMapper.deleteById(userId);
        return "成功删除一名用户";
    }
}
