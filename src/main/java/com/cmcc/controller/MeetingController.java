package com.cmcc.controller;

import com.alibaba.fastjson.JSONObject;
import com.cmcc.pojo.MeetingPojo;
import com.cmcc.service.MeetingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

/**
 * Created by yj on 2020/8/7 14:31
 */
@Controller
public class MeetingController {
    @Autowired
    MeetingService meetingService;

    @RequestMapping(value = "/mt/findAll", method = RequestMethod.GET)
    @ResponseBody
    public JSONObject selectAll(){
        List<MeetingPojo> MeetingPojos = meetingService.selectAll();
        System.out.println(MeetingPojos.toString());
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("MeetingList",MeetingPojos);
        return jsonObject;
    }
    //跳转会议页面
    @RequestMapping("/mt/viewindex")
    public String viewindex(){
        return "mt/meetingindex";
    }
    //跳转首页
    @RequestMapping("/toIndex1")
    public String index1(){
        return "/index_v1";
    }


    //增加信息
    public String addMeeting(){
        return "";
    }

    //删除多个信息
    public String delMeetings(){
        return "";
    }

    //删除一个信息
    public String delMeeting(){
        return "";
    }

    //修改一个信息
    public String editMeetings(){
        return "";
    }

    //查看一个信息
    public String viewMeetings(){
        return "";
    }

}
