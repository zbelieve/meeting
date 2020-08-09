package com.cmcc.service;



import com.cmcc.pojo.MeetingPojo;

import java.util.List;

public interface MeetingService {
    List<MeetingPojo> selectAll();
}
