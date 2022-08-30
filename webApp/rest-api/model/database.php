<?php
class Database{
    protected $connection = null;

    public function __construct(){
        try{
            $this->connection = new mysqli(DB_HOST,DB_USER,DB_PASS,DB_NAME);
            if (mysqli_connect_errno()){
                throw new Exception("Could not connect to DB");
            }
        }catch(Exception $e){throw new Exception($e->getMessage());}
    }

    public function select($query = "", $params=[]){
        try{
            $stmt = $this->execStatement($query,$params);
            $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
            $stmt->close();
            
            return $result;
        }catch(Exception $e){throw new Exception($e->getMessage());}
        return false;
    }
    private function execStatement($query="",$params=[]){
        try{
            $stmt = $this->connection->prepare($query);
            if($stmt === false){
                throw new Exception("Unable to prep statement".$query);
            }
            if($params){
                $stmt->bind_param($params[0],$params[1]);
            }
            $stmt->execute();
            return $stmt;
        }catch(Exception $e){throw new Exception($e->getMessage());}
    }
}