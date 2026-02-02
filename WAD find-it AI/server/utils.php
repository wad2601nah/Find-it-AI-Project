<?php

class EntityExtractor {
    public function extract($message) {
        $extracted = [
            'item' => null,
            'budget' => null,
            'location' => null
        ];

        // normalize message
        $message = strtolower($message);

        // 1. Extract Budget (e.g., "under 25k", "25000", "Rp 25.000")
        // Check for 'k' notation first (e.g. 25k -> 25000)
        if (preg_match('/under\s*(?:rp\.?)?\s*(\d+)k/i', $message, $matches)) {
            $extracted['budget'] = intval($matches[1]) * 1000;
        } elseif (preg_match('/(\d+)k/i', $message, $matches)) {
             // Simple "25k" mention, usually implies limit if context logic was smarter, 
             // but here we look for "under" or just assume if it looks like price.
             // Let's stick to "under X" or "X max" patterns for strictness, 
             // but user prompt example is "Under 25k".
             // If just "25k", might be tricky. Let's assume numbers > 1000 are prices?
             // Let's refine: look for "under", "<", "max", "below"
        }
        
        // Strict budget regex
        if (!$extracted['budget']) {
            if (preg_match('/(?:under|below|max|budget)\s*(?:rp\.?)?\s*([\d\.]+)/i', $message, $matches)) {
                $clean_num = str_replace('.', '', $matches[1]);
                $extracted['budget'] = intval($clean_num);
            }
        }
        
        // Handle "25k" without "under" if it's explicitly "25k"
        if (!$extracted['budget'] && preg_match('/(?:rp\.?)?\s*(\d+)k/', $message, $matches)) {
             $extracted['budget'] = intval($matches[1]) * 1000;
        }

        // 2. Extract Location
        // In a real app, use NLP or a big city database. Here, check against known locations from data.json
        $data = json_decode(file_get_contents(__DIR__ . '/data.json'), true);
        $known_locations = array_map('strtolower', $data['locations']);
        
        foreach ($known_locations as $loc) {
            if (strpos($message, $loc) !== false) {
                $extracted['location'] = ucwords($loc); // Store capitalized
                break; // Assume one location for now
            }
        }

        // 3. Extract Item
        // This is the hardest part without NLP. 
        // Strategy: Remove budget and location words, remove common stop words, what remains is the item.
        $temp_msg = $message;
        
        // Remove location
        if ($extracted['location']) {
            $temp_msg = str_ireplace(strtolower($extracted['location']), '', $temp_msg);
        }
        
        // Remove budget patterns
        $temp_msg = preg_replace('/(?:under|below|max|budget)\s*(?:rp\.?)?\s*(\d+)k/i', '', $temp_msg);
        $temp_msg = preg_replace('/(?:under|below|max|budget)\s*(?:rp\.?)?\s*([\d\.]+)/i', '', $temp_msg);
        $temp_msg = preg_replace('/(\d+)k/i', '', $temp_msg);
        
        // Remove stop words
        $stop_words = [' i ', ' want ', ' find ', ' looking ', ' for ', ' a ', ' an ', ' the ', ' in ', ' at ', ' with ', ' price ', ' of ', ' me '];
        $temp_msg = str_replace($stop_words, ' ', $temp_msg);
        
        $extracted['item'] = trim(preg_replace('/\s+/', ' ', $temp_msg));
        
        // Fallback catch-all if empty
        if (empty($extracted['item'])) {
            $extracted['item'] = "anything"; 
        }

        return $extracted;
    }
}
?>
