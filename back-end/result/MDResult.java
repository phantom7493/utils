package com.phantom.business.blueInkMall.utils;

/**
 * Created By 独自漫步〃寂静の夜空下
 * Date: 2017/9/21
 * Time: 21:55
 */
public class MDResult {

    private static final String SUCCESS = "success";

    private String message;
    private Object data;

    /**
     * 创建一个指定message的MessageDateResult
     *
     * @param message 所携带的信息
     * @return MessageDataResult
     */
    public static MDResult build(String message) {
        MDResult pagerst = new MDResult();
        pagerst.message = message;
        return pagerst;
    }

    /**
     * 创建一个指定message与data的MessageDate
     *
     * @param message 所携带的信息
     * @param data    所携带的数据
     * @return MessageDataResult
     */
    public static MDResult build(String message, Object data) {
        MDResult pagerst = new MDResult();
        pagerst.message = message;
        pagerst.data = data;
        return pagerst;
    }

    /**
     * 创建一个message为"success"的MessageDateResult
     *
     * @return MessageDataResult
     */
    public static MDResult success() {
        MDResult pagerst = new MDResult();
        pagerst.message = SUCCESS;
        return pagerst;
    }

    /**
     * 创建一个message为"success"和指定数据的MessageDateResult
     *
     * @param data 所携带的数据
     * @return MessageDataResult
     */
    public static MDResult success(Object data) {
        MDResult pagerst = new MDResult();
        pagerst.message = SUCCESS;
        pagerst.data = data;
        return pagerst;
    }

    /* ****************************** getter/setter ****************************** */
    public String getMessage() {
        return message;
    }

    public Object getData() {
        return data;
    }
}
