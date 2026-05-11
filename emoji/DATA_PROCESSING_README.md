# Experiment Data Processing

## Overview
This script processes raw SafeBank experiment data exported from Firebase and extracts meaningful metrics for analysis.

## What the Script Does

The `process_experiment_data.py` script converts raw keystroke logs and survey responses into a clean, analyzable format containing:

### For Each User Response:
1. **participant_id** - Unique identifier for each participant
2. **condition_order** - Order of conditions (e.g., "none-emoji" or "emoji-none")
3. **test_condition** - Which condition was active (e.g., "none" or "emoji")
4. **session_number** - Which session (1 or 2)
5. **question_number** - Sequential number of the question
6. **question_state** - Type of question (e.g., "greeting", "identification", "math_verification")
7. **time_to_first_keystroke_ms** - Duration from input becoming available to first keystroke
8. **total_input_duration_ms** - Total time from input available to submission
9. **keystroke_sequence** - All keys pressed, dash-separated (e.g., "h-e-l-l-Backspace-o")
10. **submitted_answer** - The final answer the user submitted
11. **bot_prompt** - The question/prompt shown to the user

### For Survey Responses:
- All Likert scale responses (1-7) are extracted with numeric values
- Includes: competent, knowledgeable, reliable, professional, appropriate_tone, appropriate_formality, appropriate_context, transaction_confidence
- Survey rows have `question_number` set to "SURVEY"

## Usage

### Basic Usage
```bash
python3 process_experiment_data.py <input_json_file>
```

### Example
```bash
python3 process_experiment_data.py experiment_sessions-1765243892.json
```

This will create:
- `experiment_sessions-1765243892_processed.json` - Processed data in JSON format
- `experiment_sessions-1765243892.csv` - Processed data in CSV format for Excel/R/Python analysis

### Custom Output File
```bash
python3 process_experiment_data.py input.json output.json
```

## Output Format

### CSV Columns
The CSV file contains these columns in order:
1. participant_id
2. condition_order
3. test_condition
4. session_number
5. question_number
6. question_state
7. time_to_first_keystroke_ms
8. total_input_duration_ms
9. keystroke_sequence
10. submitted_answer
11. bot_prompt
12. survey_appropriate_context
13. survey_appropriate_formality
14. survey_appropriate_tone
15. survey_competent
16. survey_knowledgeable
17. survey_message_style (legacy field, may be empty)
18. survey_professional
19. survey_reliable
20. survey_transaction_complete (legacy field, may be empty)
21. survey_transaction_confidence (1-7 scale)

### Example Output Row (User Response)
```csv
participant_id,condition_order,test_condition,session_number,question_number,question_state,time_to_first_keystroke_ms,total_input_duration_ms,keystroke_sequence,submitted_answer,bot_prompt
Pope.L,emoji-none,emoji,1,1,greeting,707.7,1897.1,Shift-X-9-Shift-J-2-Shift-P-Enter,X9J2P,"Welcome to SafeBank Support..."
```

### Example Output Row (Survey)
```csv
participant_id,condition_order,test_condition,session_number,question_number,question_state,...,survey_transaction_confidence
Pope.L,emoji-none,emoji,1,SURVEY,post_survey,...,7
```

## Analysis Notes

### Keystroke Sequence
The keystroke sequence includes ALL keys pressed, including:
- Regular keys: `a`, `b`, `c`, etc.
- Special keys: `Backspace`, `Enter`, `Shift`, `Space`, `ArrowLeft`, etc.
- Format: Keys are separated by dashes (`-`)
- Example: `h-e-l-l-Backspace-o` represents typing "hell", then backspace, then "o" to make "hello"

### Timing Metrics
- **time_to_first_keystroke_ms**: Reaction time - how long before the user started typing after input became available
- **total_input_duration_ms**: Total time from input available to submission (includes typing time + any pauses)

### Survey Values
- Likert scale questions use numeric values: 1-7 (1 = lowest, 7 = highest)
- The `transaction_confidence` field replaced the old `transaction_complete` field
- Empty survey fields indicate the participant's data was collected before that survey question was added

## Processing Summary

The script automatically:
- Handles Firebase export format with `meta` and `data` keys
- Processes all participants and sessions
- Converts keystroke arrays to dash-separated strings
- Extracts numeric values from Likert scale responses
- Creates both JSON and CSV outputs
- Prints summary statistics

## Troubleshooting

### No data processed (0 entries)
- Check that your JSON file is from Firebase export with the correct structure
- The file should have a `data` key containing participant records

### Missing survey fields
- Older data may not have newer survey questions like `transaction_confidence`
- This is normal - the script handles missing fields gracefully

### Character encoding issues
- The script uses UTF-8 encoding
- If you see garbled characters, ensure your terminal/Excel supports UTF-8
