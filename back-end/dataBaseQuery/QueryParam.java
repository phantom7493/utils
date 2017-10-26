package com.phantom.business.blueInkMall.utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created By 独自漫步〃寂静の夜空下
 * Date: 2017/10/9
 * Time: 21:30
 */
public class QueryParam {
    private static String BYTE = "^-?\\d{1,2}$|^-?1[0-1]\\d$|^-?12[0-7]$|^-128$";
    private static String INTEGER = "^\\d+$";
    private static String DOUBLE = "^\\d+(\\.\\d+)?$";
    private static SimpleDateFormat DATA_FORMATTER = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");

    private String field;
    private List<String> exact;
    private List<String> notExact;
    private List<String> fuzzy;
    private List<String> notFuzzy;
    private List<String> min;
    private List<String> max;
    private List<Between> between;
    private List<Between> notBetween;

    public static class Between {
        String min;
        String max;

        public String getMin() {
            return min;
        }

        public void setMin(String min) {
            this.min = min;
        }

        public String getMax() {
            return max;
        }

        public void setMax(String max) {
            this.max = max;
        }
    }

    /**
     * 将String集合转换为Byte集合
     */
    public static List<Byte> parseToByte(List<String> strList) {
        if (strList == null || strList.size() == 0)
            return null;
        List<Byte> rst = new ArrayList<>();
        strList.parallelStream().
                filter(str -> str.matches(BYTE)).
                forEach(str -> rst.add(Byte.parseByte(str)));
        return rst.size() == 0 ? null : rst;
    }

    /**
     * 将String集合转换为Integer集合
     */
    public static List<Integer> parseToInteger(List<String> strList) {
        if (strList == null || strList.size() == 0)
            return null;
        List<Integer> rst = new ArrayList<>();
        strList.parallelStream().
                filter(str -> str.matches(INTEGER)).
                forEach(str -> rst.add(Integer.parseInt(str)));
        return rst.size() == 0 ? null : rst;
    }

    /**
     * 将String集合转换为Double集合
     */
    public static List<Double> parseToDouble(List<String> strList) {
        if (strList == null || strList.size() == 0)
            return null;
        List<Double> rst = new ArrayList<>();
        strList.parallelStream().
                filter(str -> str.matches(DOUBLE)).
                forEach(str -> rst.add(Double.parseDouble(str)));
        return rst.size() == 0 ? null : rst;
    }

    /**
     * 将String集合转换为Date集合
     */
    public static List<Date> parseToDate(List<String> strList) {
        if (strList == null || strList.size() == 0)
            return null;
        List<Date> rst = new ArrayList<>();
        for (String str : strList) {
            try {
                rst.add(DATA_FORMATTER.parse(str));
            } catch (ParseException ignored) {
            }
        }
        return rst.size() == 0 ? null : rst;
    }

    /**
     * 将String集合内所有字符串用单引号包起来
     */
    public static List<String> parseToValue(List<String> strList) {
        if (strList == null || strList.size() == 0)
            return null;
        List<String> rst = new ArrayList<>();
        for (String str : strList)
            rst.add("'" + str + "'");
        return rst;
    }

    /* ****************************** getter/setter ****************************** */
    public String getField() {
        return field;
    }

    public void setField(String field) {
        this.field = field;
    }

    public List<String> getExact() {
        return exact;
    }

    public void setExact(List<String> exact) {
        this.exact = exact;
    }

    public List<String> getNotExact() {
        return notExact;
    }

    public void setNotExact(List<String> notExact) {
        this.notExact = notExact;
    }

    public List<String> getFuzzy() {
        return fuzzy;
    }

    public void setFuzzy(List<String> fuzzy) {
        this.fuzzy = fuzzy;
    }

    public List<String> getNotFuzzy() {
        return notFuzzy;
    }

    public void setNotFuzzy(List<String> notFuzzy) {
        this.notFuzzy = notFuzzy;
    }

    public List<String> getMin() {
        return min;
    }

    public void setMin(List<String> min) {
        this.min = min;
    }

    public List<String> getMax() {
        return max;
    }

    public void setMax(List<String> max) {
        this.max = max;
    }

    public List<Between> getBetween() {
        return between;
    }

    public void setBetween(List<Between> between) {
        this.between = between;
    }

    public List<Between> getNotBetween() {
        return notBetween;
    }

    public void setNotBetween(List<Between> notBetween) {
        this.notBetween = notBetween;
    }
}
