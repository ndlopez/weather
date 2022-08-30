<?php
require_once PROJECT_ROOT_PATH . "/model/database.php";

class DataModel extends Database{

    public function getData($limit){
        //$dbTable = 'weather_data';
        return $this->select("SELECT * FROM weather_data ORDER BY hour ASC LIMIT ?",["i",$limit]);
    }
}