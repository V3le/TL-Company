<?php
class User {
    private $conn;
    private $table_name = "users";

    public $id;
    public $username;
    public $email;
    public $password;
    public $first_name;
    public $last_name;
    public $middle_name;
    public $birth_date;
    public $phone;
    public $city;
    public $is_active;
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Проверка существования username
    public function usernameExists() {
        $query = "SELECT id FROM " . $this->table_name . " WHERE username = :username LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":username", $this->username);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    // Проверка существования email
    public function emailExists() {
        $query = "SELECT id FROM " . $this->table_name . " WHERE email = :email LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":email", $this->email);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    // Регистрация пользователя
    public function register() {
        $query = "INSERT INTO " . $this->table_name . " 
                  (username, email, password, first_name, last_name, middle_name, birth_date, phone, city) 
                  VALUES 
                  (:username, :email, :password, :first_name, :last_name, :middle_name, :birth_date, :phone, :city)";
        
        $stmt = $this->conn->prepare($query);
        
        $this->password = password_hash($this->password, PASSWORD_BCRYPT);
        
        $stmt->bindParam(":username", $this->username);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":password", $this->password);
        $stmt->bindParam(":first_name", $this->first_name);
        $stmt->bindParam(":last_name", $this->last_name);
        $stmt->bindParam(":middle_name", $this->middle_name);
        $stmt->bindParam(":birth_date", $this->birth_date);
        $stmt->bindParam(":phone", $this->phone);
        $stmt->bindParam(":city", $this->city);
        
        if($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }
        return false;
    }

    // Авторизация пользователя
    public function login() {
        $query = "SELECT id, username, email, password, first_name, last_name, middle_name, phone, city, birth_date 
                  FROM " . $this->table_name . " 
                  WHERE (username = :login OR email = :login) AND is_active = 1 
                  LIMIT 1";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":login", $this->username);
        $stmt->execute();
        
        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if(password_verify($this->password, $row['password'])) {
                $this->id = $row['id'];
                $this->username = $row['username'];
                $this->email = $row['email'];
                $this->first_name = $row['first_name'];
                $this->last_name = $row['last_name'];
                $this->middle_name = $row['middle_name'];
                $this->phone = $row['phone'];
                $this->city = $row['city'];
                $this->birth_date = $row['birth_date'];
                return true;
            }
        }
        return false;
    }

    // Получение данных пользователя по ID
    public function getUserById() {
        $query = "SELECT id, username, email, first_name, last_name, middle_name, birth_date, phone, city, created_at 
                  FROM " . $this->table_name . " 
                  WHERE id = :id AND is_active = 1 
                  LIMIT 1";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $this->id);
        $stmt->execute();
        
        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $this->username = $row['username'];
            $this->email = $row['email'];
            $this->first_name = $row['first_name'];
            $this->last_name = $row['last_name'];
            $this->middle_name = $row['middle_name'];
            $this->birth_date = $row['birth_date'];
            $this->phone = $row['phone'];
            $this->city = $row['city'];
            $this->created_at = $row['created_at'];
            return true;
        }
        return false;
    }
}
?>
