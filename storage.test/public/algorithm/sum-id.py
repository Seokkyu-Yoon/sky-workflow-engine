import sys
import os
import json
from utils import file
from utils import console

def sum(node):
  print('* sum data')
  node_id = node.get('id', None)
  if node_id is None: raise Exception('id is not defined')
  
  env = node.get('env')
  project_id = env.get('projectId', None)
  workflow_id = env.get('workflowId', None)
  storage_path = env.get('storagePath', None)
  if project_id is None: raise Exception('env.projectId is not defined')
  if workflow_id is None: raise Exception('env.workflowId is not defined')
  if storage_path is None: raise Exception('env.storagePath is not defined')
  
  inputs = node.get('inputs', [])
  outputs = node.get('outputs', [])
  params = node.get('params', {})
  
  file_csv = file.createFile('csv')
  csv_path = os.path.join(storage_path, project_id, workflow_id, inputs[0])
  csv_data = file_csv.read(csv_path)
  
  columns = csv_data.get('columns')
  data = csv_data.get('data')

  data_summed = [
    {
      col_name: int(row.get(col_name, 0)) + params.get('value', 0)
      for col_name in columns
    }
    for row in data
  ]
  output_path = os.path.join(storage_path, project_id, workflow_id, f'{node_id}.{outputs[0]}')

  file_csv.write(output_path, {
    'columns': columns,
    'data': data_summed
  })
  print('* data summed')

def main():
  node = json.loads(console.readJson())
  sum(node)

if __name__ == '__main__':
  main()
