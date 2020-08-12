package com.meeting;

import javax.persistence.criteria.CriteriaBuilder;
import java.util.Arrays;
import java.util.Scanner;

/**
 * Created by yj on 2020/8/8 14:50
 */
public class Main {
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine());
        for(int i=0;i<n;i++){
            int N=sc.nextInt();
            int M =sc.nextInt();
            if(M==1){
                System.out.println(getx(M));
            }else if(N==1){
                System.out.println(getx(M));
            }else {
                int x = Math.min(getx(N),getx(M));
                System.out.println(x);
            }
        }
    }

    public static int getx(int n){
        for(int i=2;i<=Math.pow(n,0.5);i++){
            if(n%i==0){
                return i;
            }
        }
        return n;
    }

}
