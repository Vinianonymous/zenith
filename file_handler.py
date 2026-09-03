import json

def readData(file_path:str) -> dict:
    with open(file_path, 'r') as file:
        data = json.load(file)
    return data

def writeData(file_path:str, data:dict) -> None:
    with open(file_path, 'w') as file:
        json.dump(data, file, indent=4)