set FLASK_ENV=development
set FLASK_APP=server.py
pushd server
python -m flask konch
popd
