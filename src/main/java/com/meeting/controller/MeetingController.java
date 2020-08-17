package com.meeting.controller;

import com.alibaba.fastjson.JSONObject;
import com.meeting.pojo.MeetingPojo;
import com.meeting.service.MeetingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Created by yj on 2020/8/7 14:31
 */
@Controller
public class MeetingController {
    @Autowired
    MeetingService meetingService;
    //查询信息(杨江)
    @RequestMapping(value = "/meet/findAll", method = RequestMethod.GET)
    @ResponseBody
    public JSONObject selectAll(){
        List<MeetingPojo> MeetingPojos = meetingService.selectAll();
        System.out.println(MeetingPojos.get(0).getM_name());
        System.out.println(MeetingPojos.get(0).getM_createtime());
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("MeetingList",MeetingPojos);
        return jsonObject;
    }


    //增加信息(杨江)
    @RequestMapping(value = "/meet/addInfo", method = RequestMethod.POST)
    @ResponseBody
    public String addInfo(MeetingPojo meetingPojo){
        meetingPojo.setM_uuid(UUID.randomUUID().toString().replace("-",""));
        //System.out.println(JSONObject.toJSON(meetingPojo));
        int status = meetingService.addInfo(meetingPojo);
        if(status == 1){
            return "添加信息成功";
        }
        else{
            return "添加信息失败";
        }
    }

    //删除多个信息（杨江）
    @RequestMapping(value = "/meet/delInfos")
    @ResponseBody
    public String delMeetings(HttpServletResponse response , String m_uuid) throws IOException{
        response.setContentType("text/text;charset=utf-8");//设置格式为UTF8
        response.setCharacterEncoding("UTF-8");//设置格式为UTF8
        //PrintWriter pw = response.getWriter();
        // get user
        String[] res = m_uuid.trim().split(" ");
        for (int i=0;i<res.length;i++){
            System.out.println(res[i]);
            meetingService.deleteOne(res[i]);
        }
        return "1";
    }

    /**
     * 删除单个会议
     * @param response
     * @param m_uuid 会议id
     * @throws IOException PrintWriter抛的异常
     */
    //删除一个信息（姜若鹏）
    @RequestMapping(value = "/meet/deleteOne")
    @ResponseBody
    public void delMeeting( HttpServletResponse response , String m_uuid) throws IOException {
        response.setContentType("text/text;charset=utf-8");//设置格式为UTF8
        response.setCharacterEncoding("UTF-8");//设置格式为UTF8
        PrintWriter pw = response.getWriter();
        // get user
        int status=meetingService.deleteOne(m_uuid);
        pw.write(status+"");
        pw.close();
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
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        dateFormat.setLenient(false);
        binder.registerCustomEditor(Date.class, new CustomDateEditor(dateFormat, true));
    }


    //查看一个信息（张梦倩）
    public String viewMeetings(){
        return "";
    }



}
