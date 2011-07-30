all: run

run:
	@cd myimgat/ && python manage.py runserver

update_deps:
	@pip freeze | grep -v "git-remote-helpers" | grep -v "^nose" | grep -v "rdflib" | grep -v "termcolor" | grep -v "lxml" | grep -v "selenium" | grep -v "splinter" | grep -v "coverage" | grep -v "distribute" > myimgat/requirements/project.txt

update_test_deps:
	@pip freeze | grep -v "git-remote-helpers" > myimgat/requirements/test.txt

setup_dev:
	@pip install -r myimgat/requirements/test.txt

setup:
	@pip install -r myimgat/requirements/project.txt

db:
	@cd myimgat/ && python manage.py syncdb

deploy:
	@cd myimgat/ && gondor deploy primary master

test:
	@env PYTHONPATH=. python myimgat/manage.py test

jstest:
	@jasmine-splinter `pwd`/jstests/index.html


