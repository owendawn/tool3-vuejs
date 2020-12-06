<?php
/**
 * Created by PhpStorm.
 * User: owen pan
 * Date: 2016/11/30
 * Time: 16:33
 */

require_once __DIR__ . "/../utils/SqliteUtil.php";
require_once __DIR__ . "/../utils/UUIDUtil.php";
require_once __DIR__ . "/../utils/JwtUtil.php";

class MagicBookController
{
    public function getDateTime()
    {
        try {
            $sqliteUtil = new SqliteUtil();
            $db = $sqliteUtil->getDB();
            $ps = $db->prepare("SELECT datetime('now','+8 hour') as dt,datetime(CURRENT_TIMESTAMP,'localtime') as localtime");
            $rs = $ps->execute();
            $row = array();
            $i = 0;
            if ($res = $rs->fetchArray(SQLITE3_ASSOC)) {
                $row = $res;
                $i++;
            }

            return array("data" => $row ,  "code" => 200);
        } catch (\Exception $e) {
            return array("code" => 500, "info" => $e->getMessage());
        }
    }

    public function random()
    {
        try {
            $sqliteUtil = new SqliteUtil();
            $db = $sqliteUtil->getDB();
            $ps = $db->prepare("SELECT (SELECT COUNT(*) FROM books AS t2 WHERE t2.id <= t1.id) AS rn, t1.* FROM books t1 ORDER BY RANDOM() limit 0,1");
            // $ps = $db->prepare("select * from bookmarklog where userid=:userId and create_at = (select max(create_at) from bookmarklog where userid=:userId)");
            // $ps->bindParam(":userId", $userId);

            $rs = $ps->execute();
            $row = array();
            $i = 0;
            if ($res = $rs->fetchArray(SQLITE3_ASSOC)) {
                $row[$i] = $res;
                $i++;
            }
            return array(
                "data" => $row, 
                "code" => 200
            );
        } catch (\Exception $e) {
            return array("code" => 500, "info" => $e->getMessage());
        }
    }

}
