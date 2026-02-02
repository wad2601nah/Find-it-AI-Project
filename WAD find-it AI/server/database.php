<?php

class Database {
    private $data;

    public function __construct() {
        $this->data = json_decode(file_get_contents(__DIR__ . '/data.json'), true);
    }

    public function search($item, $budget, $location) {
        $results = [];

        foreach ($this->data['stores'] as $store) {
            // Loc Logic: If location specified, MUST match.
            if ($location && strcasecmp($store['location'], $location) !== 0) {
                continue;
            }

            foreach ($store['products'] as $product) {
                // Item Logic: check if product name contains item keyword
                // Very simple matching: "Nasi Padang" matches "Nasi Padang Rendang"
                if (stripos($product['name'], $item) !== false || $item == "anything") {
                    
                    // Budget Logic: check price
                    if ($budget && $product['price'] > $budget) {
                        continue;
                    }

                    // Add to results
                    $results[] = [
                        'store_name' => $store['name'],
                        'rating' => $store['rating'],
                        'location' => $store['location'],
                        'address' => $store['address'],
                        'product_name' => $product['name'],
                        'price' => $product['price']
                    ];
                }
            }
        }

        // Sorting: Cheapest first, then Rating
        usort($results, function($a, $b) {
            if ($a['price'] == $b['price']) {
                return $b['rating'] <=> $a['rating']; // High rating first
            }
            return $a['price'] <=> $b['price']; // Low price first
        });

        return $results;
    }
}
?>
