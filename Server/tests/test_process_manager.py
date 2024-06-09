from utils.process_manager import ProcessManager


def test_process_list():
    res = ProcessManager.get_process_list()
    
    assert type(res) == list
    assert len(res) != 0


def test_process_list():
    res = ProcessManager.get_process_list()
    str_res = ''.join(res).strip()
    
    assert len(str_res) != 0
    assert str_res != ''
