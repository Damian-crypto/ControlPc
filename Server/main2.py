from utils.process_manager import ProcessManager


res = ProcessManager.get_process_list()
str_res = '\n'.join([' '.join(line) for line in res]).strip()
print(str_res)
