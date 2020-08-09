package com.meeting.common;

/**
 * @Author yj
 * @create 2020/8/7 15:52
 */

import lombok.Data;
/**
 * 本工具类为传至前台的最终数据形式，使用addInfo将查得或者处理过的数据放置于record中传至前台
 */
@Data
public class ResultVO {

    private int code;
    private String message;
    private Object record;

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Object getRecord() {
        return record;
    }

    public void setRecord(Object record) {
        this.record = record;
    }

    public static ResultVO success(){
        ResultVO resultVO = new ResultVO();
        resultVO.setCode(200);
        resultVO.setMessage("success");
        return resultVO;
    }


    public static ResultVO fail(Exception e){
        ResultVO resultVO = new ResultVO();
        resultVO.setCode(400);
        resultVO.setMessage("fail "+e.toString());
        return resultVO;
    }

    public ResultVO addInfo(Object obj){
        this.setRecord(obj);
        return this;
    }


}