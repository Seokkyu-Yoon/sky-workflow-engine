import csv
import json

class File:
  def read(self, path, callback):
    with open(path, 'r', encoding='utf-8') as f:
      return callback(f)
    return None
  
  def write(self, path, callback):
    with open(path, 'w', encoding='utf-8', newline='') as f:
      return callback(f)
    return None

class FileCsv(File):
  def read(self, path=None):
    def cb(file):
      [columns, *rows] = csv.reader(file)
      data = [
        {
          colName: row[i]
          for i, colName in enumerate(columns)
        }
        for row in rows
      ]
      return { 'columns': columns, 'data': data }
    return File.read(self, path, cb)
  
  def write(self, path=None, data=None):
    columns = data.get('columns', [])
    dataRows = data.get('data', [])
    rows = [
      [
        dataRow.get(colName, None)
        for colName in columns
      ]
      for dataRow in dataRows
    ]
    def cb(file):
      writer = csv.writer(file)
      writer.writerow(columns)
      writer.writerows(rows)
    return File.write(self, path, cb)

class FileJson(File):
  def read(self, path=None):
    return File.read(self, path, lambda file: json.load(file))
  
  def write(self, path=None, data=None):
    return File.write(self, path, lambda file: json.dump(data, file, indent=2, ensure_ascii=False))

def createFile(file_type=None):
  if file_type == 'csv': return FileCsv()
  if file_type == 'json': return FileJson()
  raise Exception(f'undefined file_type ({file_type})')
