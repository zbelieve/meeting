package com.meeting.service;



import com.meeting.dao.MeetingDao;
import com.meeting.pojo.MeetingPojo;

import java.util.List;

public interface MeetingService {
    List<MeetingPojo> selectAll();

    int deleteOne(String  m_uuid);//姜若鹏

    int editInfo(MeetingPojo meetingPojo);

    int addInfo(MeetingPojo meetingPojo);//杨江
}
