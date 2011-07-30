all: run

run:
	@cd myimgat/ && python manage.py runserver

update_deps:
	@pip freeze | grep -v "git-remote-helpers" > myimgat/requirements/project.txt

setup:
	@pip install -r myimgat/requirements/project.txt

db:
	@cd myimgat/ && python manage.py syncdb

deploy:
	@cd myimgat/ && gondor deploy primary master

test:
	@env PYTHONPATH=. nosetests -v -s --with-coverage --cover-erase --cover-package=myimgat --cover-inclusive tests/
