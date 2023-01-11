import io
import sys

def readJson():
  input_stream = io.TextIOWrapper(sys.stdin.buffer, encoding='utf-8')
  lines = []
  for line in input_stream:
    lines.append(line)
    if line == '}\n' or line == '\n': break
  str_json = ''.join(lines)
  return str_json
