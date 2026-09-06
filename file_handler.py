# ============================================================================
# file_handler.py — READING/WRITING THE JSON DATA FILE
# ============================================================================
# A tiny helper class that hides all file details behind two functions:
# readData() and writeData(). main.py never touches files directly — it just
# asks this class for "the list of tasks" or tells it "save this list".
# If you ever switch storage (e.g. a real database), you only rewrite THIS
# file and main.py keeps working untouched. That idea is called SEPARATION
# OF CONCERNS: each file has ONE job.

# Python's built-in module for converting between Python objects (lists,
# dicts, strings...) and JSON text. json.load reads JSON from a file,
# json.dump writes Python objects to a file as JSON.
import json


class FileHandler:
    # A class used purely as a NAMESPACE for two helper functions — we never
    # create a FileHandler() object. Both methods are @staticmethods (see
    # below), so you call them as FileHandler.readData(...) directly.

    # @staticmethod means: "this function belongs to the class for
    # organization, but it does NOT receive the instance (`self`) as an
    # argument". Contrast with a normal method, where Python secretly passes
    # the object as the first parameter. Static = no object needed.
    @staticmethod
    def readData(file_path:str) -> list:
        # `file_path:str` is a TYPE HINT: "this argument should be a string".
        # `-> list` hints the return type. Hints are documentation + tooling
        # help only — Python does NOT enforce them at runtime.
        try:
            # `with open(...) as file:` opens the file and GUARANTEES it gets
            # closed afterwards, even if an error occurs inside the block.
            # Always prefer `with` over manual open()/close() — leaked file
            # handles are a classic beginner bug this avoids entirely.
            # Mode 'r' = read (the file must exist, else FileNotFoundError).
            with open(file_path, 'r') as file:
                # Parse the JSON text into Python objects (a list of dicts)
                # and store them in `data`.
                data = json.load(file)
        except FileNotFoundError:
            # First-ever run: the data file doesn't exist yet. Instead of
            # crashing, return an empty list — "no tasks yet" is a perfectly
            # valid state. The file gets created on the first writeData().
            # NOTE: only FileNotFoundError is caught. Other errors (e.g. the
            # file contains broken JSON -> json.JSONDecodeError) still crash
            # LOUDLY, which is what you want: silent swallowing of unexpected
            # errors hides bugs. Catch narrowly, fail loudly otherwise.
           return []
        # Reached only when no exception happened: hand the loaded data back.
        return data

    @staticmethod
    def writeData(file_path:str, data:dict) -> None:
        # `-> None` means "returns nothing" — the function's job is the SIDE
        # EFFECT (writing the file), not producing a value.
        # (The `data:dict` hint is slightly loose: we actually pass a list of
        # dicts. json.dump accepts any JSON-serializable object either way.)
        # Mode 'w' = write: creates the file if missing, TRUNCATES (empties)
        # it if it exists, then writes. That's why callers always read the
        # current list first, modify it in memory, and write the WHOLE list
        # back — 'w' cannot "append one item to JSON", it replaces the file.
        with open(file_path, 'w') as file:
            # indent=4 pretty-prints the JSON with 4-space indentation so the
            # file stays human-readable (and git diffs stay clean). Without
            # it, everything lands on one giant line.
            json.dump(data, file, indent=4)
