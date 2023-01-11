import sys
import os
import json
from utils import file
from utils import console

def data_loader(node):
  print('* load data')
  
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
  
  param_filename = params.get('file', '')
  target_path = os.path.join(storage_path, 'public', 'file', param_filename)
  
  file_csv = file.createFile('csv')
  csv_data = file_csv.read(target_path)
  
  output_path = os.path.join(storage_path, project_id, workflow_id, f'{node_id}.{outputs[0]}')
  file_csv.write(output_path, csv_data)
  print('* data loaded')

def main():
  node = json.loads(console.readJson())
  data_loader(node)

if __name__ == '__main__':
  main()
