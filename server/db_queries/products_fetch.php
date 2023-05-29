<?php
    if($_SERVER["REQUEST_METHOD"] === "GET"){
        echo "This file should not be accessed through browser.";
        exit;
    }

    require "../db_conn/connection.php";
    require "../utils/headers.php";
    require "../utils/db_components.php";

    $request = file_get_contents("php://input");
    $data = json_decode($request, true);
    
    function getImageEncodedPath($image_path){
        list(, $type) = explode(".", $image_path);
        return "data:image/".$type.";base64,".base64_encode(file_get_contents($image_path));
    }

    $connection = getDBConnection();
    $result = NULL;
    if($data["searchType"] === "filter"){
        $nameParts = preg_split("/\s+/", $data["name"]);
        $conditions = array();
        foreach($nameParts as $value){
            $conditions[] = "product_name LIKE '%".$value."%'";
        }
        $conditions = implode(" AND ", $conditions);
        $types = implode("','",(array) $data["filterData"]["components"]);
        $brands = implode("','", (array) $data["filterData"]["brands"]);
        $statement = $connection->prepare("SELECT * FROM $product_table_name WHERE ".$conditions." AND price BETWEEN ? AND ? 
            AND product_type IN ('".$types."') AND brand IN ('".$brands."') LIMIT 28");
        $statement->bind_param("dd", $data["filterData"]["bottomPrice"], $data["filterData"]["topPrice"]);
        $statement->execute();
        $result = $statement->get_result();
        $statement->close();
    }
    else if($data["searchType"] === "ids"){
        $ids = implode("','",(array) $data["ids"]);
        $result = $connection->query("SELECT * FROM $product_table_name WHERE id IN ('".$ids."')");
    }
    else{
        $nameParts = preg_split("/\s+/", $data["name"]);
        $conditions = array();
        foreach($nameParts as $value){
            $conditions[] = "product_name LIKE '%".$value."%'";
        }
        $conditions = implode(" AND ", $conditions);
        $result = $connection->query("SELECT * FROM $product_table_name WHERE ".$conditions." LIMIT 28");

    }
    $result_array = array();
    while($row = $result->fetch_assoc()){
        $row["image_path"] = getImageEncodedPath($row["image_path"]);
        $result_array[] = $row;
    }
    $result->free_result();
    $connection->close();
    echo json_encode($result_array);
?>