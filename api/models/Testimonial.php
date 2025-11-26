<?php
class Testimonial {
    private $conn;
    private $table_name = "testimonials";

    public $id;
    public $company_name;
    public $author_name;
    public $content;
    public $image_path;
    public $is_active;
    public $created_at;
    public $updated_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Получить все благодарственные письма
    public function read() {
        $query = "SELECT * FROM " . $this->table_name . " WHERE is_active = 1 ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Получить все письма (для админки)
    public function readAll() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Получить одно письмо
    public function readOne() {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = ? LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if($row) {
            $this->company_name = $row['company_name'];
            $this->author_name = $row['author_name'];
            $this->content = $row['content'];
            $this->image_path = $row['image_path'];
            $this->is_active = $row['is_active'];
            $this->created_at = $row['created_at'];
            $this->updated_at = $row['updated_at'];
        }
    }

    // Создать новое письмо
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET company_name=:company_name, author_name=:author_name, 
                      content=:content, image_path=:image_path, is_active=:is_active";
        
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(":company_name", $this->company_name);
        $stmt->bindParam(":author_name", $this->author_name);
        $stmt->bindParam(":content", $this->content);
        $stmt->bindParam(":image_path", $this->image_path);
        $stmt->bindParam(":is_active", $this->is_active);
        
        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    // Обновить письмо
    public function update() {
        $query = "UPDATE " . $this->table_name . " 
                  SET company_name=:company_name, author_name=:author_name, 
                      content=:content, image_path=:image_path, is_active=:is_active
                  WHERE id=:id";
        
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(":company_name", $this->company_name);
        $stmt->bindParam(":author_name", $this->author_name);
        $stmt->bindParam(":content", $this->content);
        $stmt->bindParam(":image_path", $this->image_path);
        $stmt->bindParam(":is_active", $this->is_active);
        $stmt->bindParam(":id", $this->id);
        
        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    // Удалить письмо
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        
        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>
