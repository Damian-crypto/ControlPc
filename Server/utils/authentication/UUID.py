from __future__ import annotations

import random
import string

class UUIDBuilder:

    def __init__(self, length: int):
        self.length = length
        self.upper_case = False
        self.digits = False
        self.punctuations = False
        self.whitespaces = False
    
    def add_upper_case(self) -> UUIDBuilder:
        self.upper_case = True
        return self
    
    def add_digits(self) -> UUIDBuilder:
        self.digits = True
        return self
    
    def add_punctuations(self) -> UUIDBuilder:
        self.punctuations = True
        return self
    
    def add_whitespaces(self) -> UUIDBuilder:
        self.whitespaces = True
        return self
    
    def build(self) -> UUID:
        return UUID(self)

class UUID:

    def __init__(self, builder: UUIDBuilder):
        self.uuid = ''
        self.used = set()
        self.length = builder.length
        self.letters = list(string.ascii_lowercase)
        if builder.upper_case:
            self.letters.extend(list(string.ascii_uppercase))
        if builder.digits:
            self.letters.extend(list(string.digits))
        if builder.punctuations:
            self.letters.extend(list(string.punctuation))
        if builder.whitespaces:
            self.letters.extend(list(string.whitespace))
        random.shuffle(self.letters)
    
    def generate_one(self):
        res = self.__generate_new()
        while res in self.used:
            res = self.__generate_new()
        
        self.used.add(res)
        return res
    
    def __generate_new(self):
        return ''.join(random.choice(self.letters) for _ in range(self.length))
