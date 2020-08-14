package com.meeting.controller;

import com.alibaba.fastjson.JSONObject;
import com.meeting.pojo.MeetingPojo;
import com.meeting.service.MeetingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.Date;
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


    //增加信息(王鸿璋)
    //跳转到表单静态html页面
    @RequestMapping(value = "/meet/addIndexWhz", method = RequestMethod.GET)
    public String addMeetingindexWhz(){
        return "addWhz";
    }
    //增加信息（王鸿璋）
    //接收表单提交的数据，并调用service写入数据库。
    @RequestMapping(value = "/meet/addWhz", method = RequestMethod.POST)
    @ResponseBody
    public void addMeetingWhz(@RequestParam(name = "m_uuid",required = false) String m_uuid,
                              @RequestParam(name = "m_name",required = false) String m_name,
                              @RequestParam(name = "m_content",required = false) String m_content,
                              @RequestParam(name = "m_person",required = false) String m_person,
                              @RequestParam(name = "m_type",required = false) String m_type,
                              @RequestParam(name = "m_meetingid",required = false) String m_meetingid,
                              @RequestParam(name = "m_meetingurl",required = false) String m_meetingurl,
                              @RequestParam(name = "m_createtime") Date m_createtime,
                              @RequestParam(name = "m_meetingtime") Date m_meetingtime,
                              @RequestParam(name = "m_details",required = false) String m_details
    ){
        MeetingPojo mp = new MeetingPojo();
        mp.setM_uuid(m_uuid);
        mp.setM_name(m_name);
        mp.setM_content(m_content);
        mp.setM_person(m_person);
        if(!m_type.equals("")){
            mp.setM_type(Integer.parseInt(m_type));
        }
        mp.setM_meetingid(m_meetingid);
        mp.setM_meetingurl(m_meetingurl);
        mp.setM_details(m_details);
        mp.setM_createtime(m_createtime);
        mp.setM_meetingtime(m_meetingtime);
        meetingService.addMeetingWhz(mp);
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
    @RequestMapping(value = "/meet/editInfo", method = RequestMethod.POST)
    @ResponseBody
    public String editMeetings(MeetingPojo meetingPojo){
        int status = meetingService.editInfo(meetingPojo);
        if(status == 1){
            return "修改信息成功";
        }
        else{
            return "修改信息失败";
        }
    }
    //（陶鹏）
    @InitBinder
    public void initBinder(WebDataBinder binder) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        dateFormat.setLenient(false);
        binder.registerCustomEditor(Date.class, new CustomDateEditor(dateFormat, true));
    }


    //查看一个信息（张梦倩）
    public String viewMeetings(){
        return "";
    }



}
