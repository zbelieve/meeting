package com.meeting.controller;

import com.alibaba.fastjson.JSONObject;
import com.meeting.pojo.MeetingPojo;
import com.meeting.service.MeetingService;
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

    @RequestMapping(value = "/meet/findAll", method = RequestMethod.GET)
    @ResponseBody
    public JSONObject selectAll(){
        List<MeetingPojo> MeetingPojos = meetingService.selectAll();
        System.out.println(MeetingPojos.toString());
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("MeetingList",MeetingPojos);
        return jsonObject;
    }


    //增加信息(王鸿章)
    public String addMeeting(){
        return "";
    }

    //删除多个信息（郑文宇）
    public String delMeetings(){
        return "";
    }

    //删除一个信息（姜若鹏）
    public String delMeeting(){
        return "";
    }

    //修改一个信息（陶鹏）
    public String editMeetings(){
        return "";
    }

    //查看一个信息（张梦倩）
    public String viewMeetings(){
        return "";
    }

}
