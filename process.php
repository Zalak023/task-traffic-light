<?php

header('Content-Type: application/json');


$servername = "localhost";
$username = "root";
$password = "";
$dbname = "signal_lights";

$conn = new mysqli($servername, $username, $password , $dbname);

if($conn->connect_error){
    die("connection failed:" . $conn->connect_error);
}


if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $input = json_decode(file_get_contents('php://input'), true);

    if (isset($input['sequence']) && isset($input['greenInterval']) &&isset($input['yellowInterval'])) {
        $sequence = $input['sequence'];
        $greenInterval = $input['greenInterval'];
        $yellowInterval = $input['yellowInterval'];

    
        $stmt = $conn->prepare("INSERT INTO signals (sequence, greenInterval, yellowInterval) VALUES (?, ?, ?)");

        $stmt->bind_param("sii", $sequence, $greenInterval, $yellowInterval);
       
        if ($stmt->execute()) {

            echo json_encode([
                'success' => true,
                'sequence' => $sequence,
                'greenInterval' => $greenInterval,
                'yelloInterval' => $yellowInterval
            ]);
            exit();
        } else{
            echo json_encode([
                'success' => false,
                'message' => 'Invalid data'
            ]);
            exit();
        }
    }else{
        echo json_encode([
            'success' => false,
            'message' => 'Missing required fields'
        ]);
        exit();
    }
}else{
    echo json_encode([
        'success' => false,
            'message' => 'Invalid method'
    ]);
    exit();
}

?>