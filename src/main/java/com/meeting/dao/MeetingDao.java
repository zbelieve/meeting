package com.meeting.dao;

import com.meeting.pojo.MeetingPojo;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Created by yj on 2020/8/7 13:18
 */
@Component
public interface MeetingDao {
    List<MeetingPojo> selectAll();
    int deleteOne(String  m_uuid);//姜若鹏
}
