import sys
import os
import json
import time
from utils import file
from utils import console

def delay(node):
  print('* delay')
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
  sleep_time = params.get('value', 0)
  time.sleep(sleep_time)
  
  for i, input_value in enumerate(inputs):
    input_path = os.path.join(storage_path, project_id, workflow_id, input_value)
    csv_data = file_csv.read(input_path)
    
    output_path = os.path.join(storage_path, project_id, workflow_id, f'{node_id}.{outputs[i]}')
    file_csv.write(output_path, csv_data)
  print(f'* delayed {sleep_time}s')
  
def main():
  node = json.loads(console.readJson())
  delay(node)

if __name__ == '__main__':
  main()