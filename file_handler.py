import json
class FileHandler:
    @staticmethod
    def readData(file_path:str) -> list:
        try:
            with open(file_path, 'r') as file:
                data = json.load(file)
        except FileNotFoundError:
           return []
        return data

    @staticmethod
    def writeData(file_path:str, data:dict) -> None:
        with open(file_path, 'w') as file:
            json.dump(data, file, indent=4)
