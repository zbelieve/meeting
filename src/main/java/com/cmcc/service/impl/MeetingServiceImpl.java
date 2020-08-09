package com.cmcc.service.impl;

import com.cmcc.dao.MeetingDao;
import com.cmcc.pojo.MeetingPojo;
import com.cmcc.service.MeetingService;
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
}
