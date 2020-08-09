package com.meeting.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by yj on 2020/8/9 13:00
 */
@Controller
public class IndexController {
    //跳转会议页面
    @RequestMapping("/mt/viewindex")
    public String viewindex(){
        return "mt/meetingindex";
    }
    //跳转登陆
    @RequestMapping("/mt/viewindex2")
    public String viewindex2(){
        return "mt/meetingindex2";
    }
    //跳转首页
    @RequestMapping("/toIndex1")
    public String index1(){
        return "/index_v1";
    }

    //跳转登陆
    @RequestMapping("/tologin")
    public String login(){
        return "/login";
    }
}
