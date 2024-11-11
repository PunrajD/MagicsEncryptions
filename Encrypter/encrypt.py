import json
from datetime import datetime

def load_algorithm():
    with open("algorithm.json", "r") as f:
        return json.load(f)

def get_current_time_code(algorithm):
    current_time = datetime.now().strftime("%H:%M:%S")
    available_times = list(algorithm.keys())
    current_time_obj = datetime.strptime(current_time, "%H:%M:%S")

    nearest_time = min(
        available_times,
        key=lambda x: abs(current_time_obj - datetime.strptime(x, "%H:%M:%S"))
    )

    time_data = algorithm[nearest_time]
    time_code = time_data["time_code"]
    alphabet_mapping = time_data["A"]
    return time_code, alphabet_mapping

def encode_message(message, alphabet_mapping):
    encoded_message = ''.join(alphabet_mapping.get(char, char) for char in message.lower())
    return encoded_message

def main():
    algorithm = load_algorithm()
    time_code, alphabet_mapping = get_current_time_code(algorithm)
    
    message = input("Enter the message to encode: ")
    encoded_message = encode_message(message, alphabet_mapping)
    
    with open("output.magic", "w") as f:
        f.write(f"{time_code} {encoded_message}")

if __name__ == "__main__":
    main()
