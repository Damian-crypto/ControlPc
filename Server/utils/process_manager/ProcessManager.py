from typing import List

import re
import psutil

from utils.executor.PopenExecutor import PopenExecutor


# def get_processes_countinuout() -> str:
#     cmd = 'wmic process list brief /every:2'

#     proc = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, stdin=subprocess.PIPE)
#     while True:
#         output = proc.stdout.readline().decode()
#         if output == '' and proc.poll() is not None:
#             break
#         if output:
#             yield output.strip()

def get_cpu_usage():
    return psutil.cpu_percent()


def get_ram_usage():
    return psutil.virtual_memory().percent


def get_processes() -> str:
    pexe = PopenExecutor()
    process_list = pexe.run('wmic process list brief')

    return process_list.output


def tokenize(text: str, pattern):
    tokens = re.search(pattern, text)
    stripped_tokens = []
    for token in tokens.groups():
        stripped_tokens.append(token.strip())
    
    return stripped_tokens


def get_process_list() -> List[str]:
    processes = get_processes()

    lines = processes.split('\n')
    process_list = []

    # lines[1:] because skip header section
    for line in lines[1:]:
        try:
            tokens = tokenize(line, r'(\d+)\s+(\w+[\s\D]+)+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)')
            process_list.append(tokens)
        except:
            # raise Exception(f"Invalid line found: {line}")
            pass
    
    return process_list
