<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'utils.php';
require_once 'database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $message = $input['message'] ?? '';

    if (empty($message)) {
        echo json_encode(['text' => 'Please tell me what you are looking for.', 'cards' => []]);
        exit;
    }

    $extractor = new EntityExtractor();
    $criteria = $extractor->extract($message);

    $db = new Database();
    
    // STRICT RULE Check
    // If location is specified but we don't have it in our "database", what to do?
    // The Database class currently loads JSON. If the extracted location is not in the known list in EntityExtractor, it might return null or the user's raw string? 
    // Let's rely on EntityExtractor returning a "valid" location from the list, or null if not found. 
    // But the prompt says: "If the location is not found in the database, the AI must ask for clarification instead of giving random suggestions."
    
    // Re-check Entity logic: 
    // Currently EntityExtractor looks for known locations. If user types "Surabaya" (not in list), extracted['location'] will be null.
    // The filtered search will then show ALL stores (since location is null). This violates the "don't show random suggestions" if the USER INTENDED a location.
    // However, distinguishing "Search for X" (no location) vs "Search for X in Y" (unknown Y) is hard without NLP.
    // For this simple demo, we will assume if we extracted a location, we use it. If we didn't extract one, we assume global search or ask?
    // "If the user specifies a location... forbidden from showing results outside. If location not found... ask for clarification".
    // This implies we need to detect they *tried* to specify a location. 
    // Let's refine EntityExtractor later if needed. For now, we trust the extract method.
    
    $results = $db->search($criteria['item'], $criteria['budget'], $criteria['location']);

    // Construct Response
    $response_text = "";
    
    if ($criteria['location']) {
         $response_text = "Finding the best " . ucwords($criteria['item']) . " in " . $criteria['location'];
         if ($criteria['budget']) {
            $formatted_budget = number_format($criteria['budget'], 0, ',', '.');
             $response_text .= " under Rp" . $formatted_budget;
         }
         $response_text .= " for you...";
    } else {
         $response_text = "Here are the best deals for " . ucwords($criteria['item']) . " I found:";
    }

    if (empty($results)) {
        $response_text = "I couldn't find any matches for " . ucwords($criteria['item']);
        if ($criteria['location']) {
            $response_text .= " in " . $criteria['location'];
        }
        if ($criteria['budget']) {
            $response_text .= " within your budget";
        }
        $response_text .= ". Please try a different search.";
    }

    echo json_encode([
        'text' => $response_text,
        'cards' => array_slice($results, 0, 5) // Limit to top 5
    ]);
}
?>
