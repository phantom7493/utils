package com.phantom.business.blueInkMall.utils;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.geom.AffineTransform;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Random;

/**
 * Created By 独自漫步〃寂静の夜空下 Date: 2017/9/18 Time: 21:38
 */
public class CAPTCHA {

    private static final String CAPTCHA_CODE = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
    private static final Random RANDOM = new Random();


    private CAPTCHA() {
        super();
    }

    /**
     * 获取指定范围内的随机色
     *
     * @param min 最小色值
     * @param max 最大色值
     * @return 随机色
     */
    private static Color getRandomColor(int min, int max) {
        int range = max - min;
        int r = min + RANDOM.nextInt(range);
        int g = min + RANDOM.nextInt(range);
        int b = min + RANDOM.nextInt(range);
        return new Color(r, g, b);
    }

    /**
     * 生成验证码
     *
     * @param width        图片宽度
     * @param height       图片高度
     * @param keyNum       验证码字符个数
     * @param outputStream 写出的输出流
     * @return 验证码正解
     * @throws IOException 由outputStream抛出
     */
    public static String generate(int width, int height, int keyNum, OutputStream outputStream) throws IOException {
        BufferedImage img = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = img.createGraphics();
        g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        /* 填充背景 */
        g2d.setColor(getRandomColor(200, 250));
        g2d.fillRect(0, 0, width, height);
        /* 绘制干扰线 */
        g2d.setColor(getRandomColor(160, 200));
        for (int i = 0, x1, y1, x2, y2; i < 20; i++) {
            x1 = RANDOM.nextInt(width - 1);
            y1 = RANDOM.nextInt(height - 1);
            x2 = x1 + 40 + RANDOM.nextInt(6);
            y2 = y1 + 20 + RANDOM.nextInt(12);
            g2d.drawLine(x1, y1, x2, y2);
        }
        /* 绘制验证码 */
        g2d.setColor(getRandomColor(100, 160));
        g2d.setFont(new Font("SourceCodePro", Font.ITALIC, (int) (height * 0.85)));
        StringBuilder key = new StringBuilder();
        AffineTransform affine = new AffineTransform();
        char tmp;
        for (int i = 0; i < keyNum; i++) {
            affine.setToRotation(Math.PI / 4 * RANDOM.nextDouble() * (RANDOM.nextBoolean() ? 1 : -1),
                    (width / keyNum) * i + ((height - 4) >> 1), height >> 1);
            g2d.setTransform(affine);
            tmp = CAPTCHA_CODE.charAt(RANDOM.nextInt(CAPTCHA_CODE.length()));
            key.append(tmp);
            g2d.drawString(String.valueOf(tmp), ((width - 10) / keyNum) * i + 5, (int) (height * 0.85));
        }
        g2d.dispose();
        ImageIO.write(img, "jpg", outputStream);
        return key.toString();
    }

}
