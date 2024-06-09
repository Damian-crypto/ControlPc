setup:
	.\\controlpc\\Scripts\\pip.exe install -r requirements.txt

run:
	.\\controlpc\\Scripts\\python.exe main.py

freeze:
	.\\controlpc\\Scripts\\pip.exe freeze > requirements.txt

test:
    # -v for verbose
    # -s for stdout
	.\\controlpc\\Scripts\\python.exe -m pytest -v -s tests
