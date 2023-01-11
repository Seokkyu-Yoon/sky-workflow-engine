import sys
import os
import json
import time
from utils import file
from utils import console

def error(node):
  raise Exception('Raise error')

def main():
  node = json.loads(console.readJson())
  error(node)
  
if __name__ == '__main__':
  main()