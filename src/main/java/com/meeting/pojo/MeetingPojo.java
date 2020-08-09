package com.meeting.pojo;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Date;

/**
 * Created by yj on 2020/8/7 13:02
 */

public class MeetingPojo {

    private String m_uuid;

    private String m_name;

    private String m_content;

    private String m_person;

    private Integer m_type;

    private String m_typeStr;

    private String m_meetingid;

    private String m_meetingurl;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date m_createtime;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date m_meetingtime;

    //详情
    private String m_details;

    public String getM_details() {
        return m_details;
    }

    public void setM_details(String m_details) {
        this.m_details = m_details;
    }

    public String getM_typeStr() {
        String res = "其他会议";
        if(this.m_type==0){
            res = "在线会议";
        }else if(this.m_type==1){
            res = "线下会议";
        }else if(this.m_type==2){
            res = "实时会议";
        }
        return res;
    }

    public void setM_typeStr(String m_typeStr) {
        this.m_typeStr = m_typeStr;
    }

    public String getM_uuid() {
        return m_uuid;
    }

    public void setM_uuid(String m_uuid) {
        this.m_uuid = m_uuid;
    }

    public String getM_name() {
        return m_name;
    }

    public void setM_name(String m_name) {
        this.m_name = m_name;
    }

    public String getM_content() {
        return m_content;
    }

    public void setM_content(String m_content) {
        this.m_content = m_content;
    }

    public String getM_person() {
        return m_person;
    }

    public void setM_person(String m_person) {
        this.m_person = m_person;
    }

    public Integer getM_type() {
        return m_type;
    }

    public void setM_type(Integer m_type) {
        this.m_type = m_type;
    }

    public String getM_meetingid() {
        return m_meetingid;
    }

    public void setM_meetingid(String m_meetingid) {
        this.m_meetingid = m_meetingid;
    }

    public String getM_meetingurl() {
        return m_meetingurl;
    }

    public void setM_meetingurl(String m_meetingurl) {
        this.m_meetingurl = m_meetingurl;
    }

    public Date getM_createtime() {
        return m_createtime;
    }

    public void setM_createtime(Date m_createtime) {
        this.m_createtime = m_createtime;
    }

    public Date getM_meetingtime() {
        return m_meetingtime;
    }

    public void setM_meetingtime(Date m_meetingtime) {
        this.m_meetingtime = m_meetingtime;
    }
}
