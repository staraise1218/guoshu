<?php
/**
 * 短信验证码类
 */

namespace app\common\logic;
use think\Db;
use think\Controller;

class GeographyLogic extends Controller {

	/**
	* 计算两点地理坐标之间的距离
	* @param  Decimal $longitude1 起点经度
	* @param  Decimal $latitude1  起点纬度
	* @param  Decimal $longitude2 终点经度 
	* @param  Decimal $latitude2  终点纬度
	* @param  Int     $unit       单位 1:米 2:公里
	* @param  Int     $decimal    精度 保留小数位数
	* @return Decimal
	*/
	function getDistance($longitude1, $latitude1, $longitude2, $latitude2, $unit=2, $decimal=2){

		$EARTH_RADIUS = 6370.996; // 地球半径系数
		$PI = 3.1415926;

		$radLat1 = $latitude1 * $PI / 180.0;
		$radLat2 = $latitude2 * $PI / 180.0;

		$radLng1 = $longitude1 * $PI / 180.0;
		$radLng2 = $longitude2 * $PI /180.0;

		$a = $radLat1 - $radLat2;
		$b = $radLng1 - $radLng2;

		$distance = 2 * asin(sqrt(pow(sin($a/2),2) + cos($radLat1) * cos($radLat2) * pow(sin($b/2),2)));
		$distance = $distance * $EARTH_RADIUS * 1000;

		if($unit==2){
			$distance = $distance / 1000;
		}

		return round($distance, $decimal);
	}


	/**
	* 计算范围内的经纬度
	* @param latitude 纬度 longitude 经度 radius 单位米
	* return minLatitude,minLongitude,maxLatitude,maxLongitude
	*/
	public function getAround($lon, $lat, $raidus)
	{  
    	$PI = 3.14159265; 				// 圆周率
     	$EARTH_RADIUS = 6378137;  	  // 地球半径
		$RAD = Math.PI / 180.0;  		// 弧度
    	
        $latitude = $lat;  
        $longitude = $lon;  
          
        $degree = (24901*1609)/360.0;  
        $raidusMile = $raidus;  
          
        $dpmLat = 1/$degree;  
        $radiusLat = $dpmLat*$raidusMile;  
        $minLat = $latitude - $radiusLat;  
        $maxLat = $latitude + $radiusLat;  
          
        $mpdLng = $degree*cos($latitude * ($PI/180));  
        $dpmLng = 1 / $mpdLng;  
        $radiusLng = $dpmLng*$raidusMile;  
        $minLng = $longitude - $radiusLng;  
        $maxLng = $longitude + $radiusLng; 

        return array(
        	'minLatitude' => $minLat,
	        'minLongitude' => $minLng,
	        'maxLatitude' => $maxLat,
	        'maxLongitude' => $maxLng,
        );
	}
}