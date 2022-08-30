<?php
require_once PROJ_ROOT_PATH . "/model/database.php";

class DataModel extends Database{
    $dbTable = weathe_data
    public function getData($limit){
        return $this->select("SELECT * FROM $dbTable ORDER BY hour ASC LIMIT ?",["i",$limit]);
    }
}