package com.cmcc;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

/**
 * Created by yj on 2020/8/8 14:50
 */
public class Main {
    public static void main(String[] args){
        Scanner input = new Scanner(System.in);
        int t = input.nextInt();
        for(int i=0;i<t;i++){
            int n = input.nextInt();
            int[] num = new int[n];
            for(int k=0;k<n;k++){
                num[k] = input.nextInt();
            }
            Arrays.sort(num);
            int sum1 = 0;
            int sum2 = 0;
            int[] flag1 = new int[n];
            int flag1Num = 0;


        }


    }

}
