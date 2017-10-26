package com.phantom.business.blueInkMall.utils;

import java.util.ArrayList;
import java.util.List;

/**
 * Created By 独自漫步〃寂静の夜空下
 * Date: 2017/9/21
 * Time: 17:40
 */
public class OperatorResult<T> {

    private List<T> success;
    private List<T> failure;

    /**
     * 根据condition的返回值,将target放入success集合或failure集合中
     *
     * @param condition 用于判断的条件
     * @param target    被放入的对象
     */
    public void add(boolean condition, T target) {
        if (condition) {
            if (success == null)
                success = new ArrayList<>();
            success.add(target);
        } else {
            if (failure == null)
                failure = new ArrayList<>();
            failure.add(target);
        }
    }

    /**
     * 获取成功操作结果对象数
     *
     * @return 成功操作结果对象数
     */
    public int successSize() {
        return success == null ? 0 : success.size();
    }

    /**
     * 获取失败操作结果对象数
     *
     * @return 失败操作结果对象数
     */
    public int failureSize() {
        return failure == null ? 0 : failure.size();
    }

    /* ****************************** getter/setter ****************************** */

    public List<T> getSuccess() {
        return success;
    }

    public OperatorResult<T> setSuccess(List<T> success) {
        this.success = success;
        return this;
    }

    public List<T> getFailure() {
        return failure;
    }

    public OperatorResult<T> setFailure(List<T> failure) {
        this.failure = failure;
        return this;
    }

}
