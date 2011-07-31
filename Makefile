REQ_PATH = myimgat/requirements/project.txt
TESTS_REQ_PATH = tests/requirements.txt

all: test jstest

run:
	@cd myimgat/ && python manage.py runserver

update_deps: update_test_deps
	@pip freeze | grep -v "git-remote-helpers" | grep -v "^nose" | grep -v "rdflib" | grep -v "termcolor" | grep -v "lxml" | grep -v "selenium" | grep -v "splinter" | grep -v "coverage" | grep -v "distribute" > ${REQ_PATH}

update_test_deps:
	@pip freeze | grep -v "git-remote-helpers" > ${TESTS_REQ_PATH}

setup_dev:
	@pip install -r ${TESTS_REQ_PATH}

setup:
	@pip install -r ${REQ_PATH}

drop:
	@mysql -u root -e 'DROP DATABASE IF EXISTS myimgat'
	@mysql -u root -e 'CREATE DATABASE IF NOT EXISTS myimgat'
	@make db

db:
	@cd myimgat/ && python manage.py syncdb && python manage.py migrate

deploy:
	@cd myimgat/ && gondor deploy primary master

test:
	@env PYTHONPATH=. python myimgat/manage.py test

jstest:
	@jasmine-splinter `pwd`/jstests/index.html

update_schema:
	@cd myimgat/ && python manage.py schemamigration wall --auto
