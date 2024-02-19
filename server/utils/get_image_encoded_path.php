<?php
    function getImageEncodedPath($image_path){
        list(, $type) = explode(".", $image_path);
        $data = file_get_contents($image_path);
        if($data === false) {
            http_response_code(500); 
        }
        return "data:image/".$type.";base64,".base64_encode($data);
    }
?>