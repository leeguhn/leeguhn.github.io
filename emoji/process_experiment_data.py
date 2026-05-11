#!/usr/bin/env python3
"""
Process SafeBank experiment data from Firebase export.
Extracts meaningful metrics from keystroke logs and survey responses.
"""

import json
import sys
from typing import Dict, List, Any


def process_keystroke_sequence(keystroke_list: List[Dict]) -> str:
    """Convert keystroke sequence to a dash-separated string."""
    if not keystroke_list:
        return ""
    return "-".join([ks.get("key", "") for ks in keystroke_list])


def extract_likert_value(response_value: Any) -> Any:
    """Extract numeric value from likert scale responses."""
    # If it's already a number, return it
    if isinstance(response_value, (int, float)):
        return response_value
    
    # If it's a string that looks like a number, extract it
    if isinstance(response_value, str):
        # Try to parse as int/float
        try:
            return int(response_value)
        except ValueError:
            try:
                return float(response_value)
            except ValueError:
                pass
    
    return response_value


def process_participant_sessions(participant_data: Dict) -> List[Dict]:
    """Process all sessions for a single participant."""
    results = []
    
    participant_id = participant_data.get("participant_id", "unknown")
    condition_order = participant_data.get("condition_order", "unknown")
    
    # Get sessions list from the data
    sessions = participant_data.get("sessions", [])
    
    # If sessions is not a list, try to find session_1, session_2 keys
    if not isinstance(sessions, list):
        sessions = []
        if "session_1" in participant_data:
            sessions.append(participant_data["session_1"])
        if "session_2" in participant_data:
            sessions.append(participant_data["session_2"])
    
    # Process each session
    for session_data in sessions:
        condition = session_data.get("condition", "unknown")
        session_number = session_data.get("session_number", 0)
        user_responses = session_data.get("user_responses", [])
        
        # Process each user response in the session
        question_number = 0
        for response_entry in user_responses:
            question_number += 1
            
            timing = response_entry.get("timing", {})
            
            # Extract meaningful metrics
            result = {
                "participant_id": participant_id,
                "condition_order": condition_order,
                "test_condition": condition,
                "session_number": session_number,
                "question_number": question_number,
                "question_state": response_entry.get("state", "unknown"),
                "bot_prompt": response_entry.get("bot_prompt", ""),
                "time_to_first_keystroke_ms": timing.get("time_to_first_keystroke_ms", 0),
                "total_input_duration_ms": timing.get("input_latency_ms", 0),
                "keystroke_sequence": process_keystroke_sequence(response_entry.get("keystroke_sequence", [])),
                "submitted_answer": response_entry.get("user_response", "")
            }
            
            results.append(result)
        
        # Process survey responses
        survey_responses = session_data.get("survey_responses", {})
        if survey_responses:
            survey_result = {
                "participant_id": participant_id,
                "condition_order": condition_order,
                "test_condition": condition,
                "session_number": session_number,
                "question_number": "SURVEY",
                "question_state": "post_survey",
                "bot_prompt": "Post-Experiment Survey",
                "time_to_first_keystroke_ms": "",
                "total_input_duration_ms": "",
                "keystroke_sequence": "",
                "submitted_answer": ""
            }
            
            # Add all survey responses as separate columns
            for key, value in survey_responses.items():
                survey_result[f"survey_{key}"] = extract_likert_value(value)
            
            results.append(survey_result)
    
    return results


def process_json_file(json_filepath: str, output_filepath: str | None = None):
    """Process the experiment JSON file and extract meaningful metrics."""
    
    # Read JSON file
    with open(json_filepath, 'r', encoding='utf-8') as f:
        raw_data = json.load(f)
    
    all_results = []
    
    # Handle Firebase export format with 'meta' and 'data' keys
    if isinstance(raw_data, dict) and 'data' in raw_data:
        data = raw_data['data']
    else:
        data = raw_data
    
    # Check if data is a dict with participant IDs as keys
    if isinstance(data, dict):
        # Process each participant
        for firebase_id, participant_data in data.items():
            if isinstance(participant_data, dict):
                results = process_participant_sessions(participant_data)
                all_results.extend(results)
    elif isinstance(data, list):
        # If it's a list, process each item
        for participant_data in data:
            if isinstance(participant_data, dict):
                results = process_participant_sessions(participant_data)
                all_results.extend(results)
    
    # Determine output file
    if output_filepath is None:
        output_filepath = json_filepath.replace('.json', '_processed.json')
    
    # Write processed data
    with open(output_filepath, 'w', encoding='utf-8') as f:
        json.dump(all_results, f, indent=2, ensure_ascii=False)
    
    print(f"✓ Processed {len(all_results)} entries from raw data")
    print(f"✓ Output saved to: {output_filepath}")
    
    # Print summary
    participants = set(r["participant_id"] for r in all_results)
    print(f"\nSummary:")
    print(f"  - Unique participants: {len(participants)}")
    print(f"  - Total entries: {len(all_results)}")
    
    return all_results


def export_to_csv(results: List[Dict], csv_filepath: str):
    """Export processed results to CSV format."""
    import csv
    
    if not results:
        print("No results to export")
        return
    
    # Get all unique keys from all results
    all_keys = set()
    for result in results:
        all_keys.update(result.keys())
    
    # Sort keys for consistent column order
    fieldnames = sorted(all_keys)
    
    # Move important fields to the front
    priority_fields = [
        "participant_id", "condition_order", "test_condition", 
        "session_number", "question_number", "question_state",
        "time_to_first_keystroke_ms", "total_input_duration_ms",
        "keystroke_sequence", "submitted_answer"
    ]
    
    ordered_fieldnames = [f for f in priority_fields if f in fieldnames]
    ordered_fieldnames += [f for f in fieldnames if f not in priority_fields]
    
    with open(csv_filepath, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=ordered_fieldnames)
        writer.writeheader()
        writer.writerows(results)
    
    print(f"✓ CSV exported to: {csv_filepath}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python process_experiment_data.py <input_json_file> [output_json_file]")
        print("\nExample:")
        print("  python process_experiment_data.py experiment_sessions-1765243892.json")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else None
    
    # Process JSON
    results = process_json_file(input_file, output_file)
    
    # Also export to CSV
    csv_file = (output_file or input_file).replace('.json', '.csv')
    export_to_csv(results, csv_file)
    
    print("\n✓ Processing complete!")
