from epic_backend import app

if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("-d","--debug", action='store_true', help = "debug mode")
    args = parser.parse_args()
    if args.debug:
        debug = True
    else:
        debug = False

    if debug:
        print("Initializing server in debugging mode")
        app.run(host="0.0.0.0", port=5003, debug=True)
    else: 
        print("Initializing server in production mode")
        from waitress import serve
        serve(app, host="0.0.0.0", port=5003)
    
    
else:
    # setup logging using gunicorn logger
    formatter = logging.Formatter(
        '[%(asctime)s.%(msecs)03d] [%(name)s] [%(levelname)s] - %(message)s',
        '%d-%m-%Y %H:%M:%S'
    )
    gunicorn_logger = logging.getLogger('gunicorn.error')
    app.logger.handlers = gunicorn_logger.handlers
    app.logger.handlers[0].setFormatter(formatter)
    app.logger.setLevel(logging.DEBUG)