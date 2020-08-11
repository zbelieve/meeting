package com.meeting.service.impl;

import com.meeting.dao.MeetingDao;
import com.meeting.pojo.MeetingPojo;
import com.meeting.service.MeetingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by yj on 2020/8/7 14:39
 */
@Service
public class MeetingServiceImpl implements MeetingService {
    @Autowired
    MeetingDao meetingDao;


    @Override
    public List<MeetingPojo> selectAll() {
       return meetingDao.selectAll();
        //return meetingDaojpa.findAll();
    }

    @Override
    public int editInfo(MeetingPojo meetingPojo) {
        return meetingDao.editInfo(meetingPojo);
    }
}
