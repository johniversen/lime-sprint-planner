# uni

_Awesomeness in a package_


# What this package does

_Describe what this package does here..._

# Developing

## Setting up your environment

### Windows

Setting up a virtual environment:

```
C:\my-package>C:\Python34\python -m venv venv
C:\my-package>venv\scripts\activate
C:\my-package>pip install -r requirements_dev.txt
```

### Linux

The development environment is based on docker.

To build the docker image, run:

```
$ make build
```

## Running tests

### Windows 

```
C:\my-package>python manage.py test
```

### Linux

```
$ make test
```

## See what other commands are available

### Windows

```
C:\my-package>python manage.py -h
```

### Linux

```
$ make help
```

## Configuration

To add default configuration options to this package, add them to limepkg-uni/limepkg_uni/__init__.py like so:

```python
def default_config():
    return {
        'my-option': 'its default value'
    }
```

These options can later be retrieved like this:

```python
import lime_config

def my_function():
    opt = lime_config.config.plugins['limepkg-uni']['my-option']
```
