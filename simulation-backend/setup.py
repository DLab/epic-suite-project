import setuptools

"""
Epic Suite backend dependencies setup
To Do:
    * Install cv19gm as a dependency 
"""

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setuptools.setup(
    name='cv19gm_backend',
    version='0.0.1',
    author='Samuel Ropert',
    author_email='sropert@dlab.cl',
    description='Epidemic dynamic modeling and simulation tools',
    long_description=long_description,
    long_description_content_type="text/markdown",
    url='https://github.com/DLab/epic-suite-project',
    project_urls = {
        "Bug Tracker": "https://github.com/DLab/epic-suite-project/issues"
    },
    license='MIT',
    packages = setuptools.find_packages(),
    install_requires=['requests','numpy','matplotlib','pandas','scipy','datetime','toml','logging','pygmo','flask','flask_cors','argparse','waitress'],
    include_package_data=True 
)

#packages = ['cv19gm','cv19gm.models']