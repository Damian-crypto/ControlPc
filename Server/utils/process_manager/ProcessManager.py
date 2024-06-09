import re
from typing import List
from utils.executor.PopenExecutor import PopenExecutor


def get_processes() -> str:
    pexe = PopenExecutor()
    process_list = pexe.run('wmic process list brief')

    return process_list.output


def get_process_list() -> List[str]:
    processes = get_processes()

    processes_lines = processes.split('\n')
    process_list = []

    for line in processes_lines[1:]:
        pattern = r'\S+\s+'
        res = re.sub(pattern, lambda match : match.group().strip() + ',', line)
        process_list.append(res.split(','))
    
    return process_list
